// Capa de datos. Tres implementaciones con la misma interfaz, elegidas en este
// orden:
//
//   1. Firebase Realtime Database — si config.js está relleno. Es la opción más
//      robusta, pero exige crear un proyecto con una cuenta de Google.
//   2. MQTT sobre WebSocket contra brókeres públicos — sin cuentas, sin
//      configuración y con mensajes retenidos, de modo que quien entra tarde
//      recibe el estado y el recuento completos. Es lo que funciona por defecto.
//   3. Local (localStorage + BroadcastChannel) — último recurso si no hay red:
//      los votos solo se comparten entre pestañas del mismo navegador.
//
// Interfaz expuesta:
//   conectar()                        -> { modo, detalle }
//   escucharEstado(fn)                -> fn({ pregunta, revelada })
//   escucharVotos(fn)                 -> fn({ p1: {cliente: "C", ...}, ... })
//   fijarEstado({pregunta, revelada})
//   votar(preguntaId, opcionId)
//   reiniciar(preguntaId)
//   idCliente()

import { FIREBASE, SALA, CONFIGURADO, BROKERS, ESPACIO } from "./config.js";

const CLAVE_CLIENTE = "cnc2026:cliente";
const ESTADO_INICIAL = { pregunta: null, revelada: false };

export function idCliente() {
  let id = localStorage.getItem(CLAVE_CLIENTE);
  if (!id) {
    id = "c" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
    localStorage.setItem(CLAVE_CLIENTE, id);
  }
  return id;
}

function difusor() {
  const oyentesEstado = [];
  const oyentesVotos = [];
  return {
    estado: { ...ESTADO_INICIAL },
    votos: {},
    onEstado(fn) { oyentesEstado.push(fn); fn(this.estado); },
    onVotos(fn) { oyentesVotos.push(fn); fn(this.votos); },
    emitirEstado() { oyentesEstado.forEach((fn) => fn(this.estado)); },
    emitirVotos() { oyentesVotos.forEach((fn) => fn(this.votos)); },
  };
}

// --------------------------------------------------------------------------
// 1 · Firebase Realtime Database
// --------------------------------------------------------------------------

function crearFirebase() {
  let db = null;
  let fb = null;
  return {
    modo: "firebase",
    async conectar() {
      const appMod = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
      fb = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js");
      db = fb.getDatabase(appMod.initializeApp(FIREBASE));
      return { modo: "firebase", detalle: "Firebase Realtime Database" };
    },
    escucharEstado(fn) {
      fb.onValue(fb.ref(db, `${SALA}/estado`), (s) => fn({ ...ESTADO_INICIAL, ...(s.val() || {}) }));
    },
    escucharVotos(fn) {
      fb.onValue(fb.ref(db, `${SALA}/votos`), (s) => fn(s.val() || {}));
    },
    async fijarEstado(parcial) {
      await fb.update(fb.ref(db, `${SALA}/estado`), { ...parcial, ts: Date.now() });
    },
    async votar(preguntaId, opcionId) {
      await fb.set(fb.ref(db, `${SALA}/votos/${preguntaId}/${idCliente()}`), opcionId);
    },
    async reiniciar(preguntaId) {
      await fb.remove(fb.ref(db, preguntaId ? `${SALA}/votos/${preguntaId}` : `${SALA}/votos`));
    },
  };
}

// --------------------------------------------------------------------------
// 2 · MQTT sobre WebSocket (brókeres públicos, sin cuenta)
// --------------------------------------------------------------------------

function cargarMqtt() {
  if (window.mqtt) return Promise.resolve(window.mqtt);
  return new Promise((res, rej) => {
    const sc = document.createElement("script");
    sc.src = "assets/mqtt.min.js";
    sc.onload = () => (window.mqtt ? res(window.mqtt) : rej(new Error("mqtt no disponible")));
    sc.onerror = () => rej(new Error("no se pudo cargar assets/mqtt.min.js"));
    document.head.appendChild(sc);
  });
}

function crearMqtt() {
  const d = difusor();
  const RAIZ = `${ESPACIO}/${SALA}`;
  let cliente = null;
  let respaldo = null;   // implementación local si no hay bróker alcanzable

  const publicar = (topico, carga) => {
    if (respaldo) return;
    if (!cliente || !cliente.connected) return;
    cliente.publish(topico, carga, { qos: 0, retain: true });
  };

  function aplicar(topico, texto) {
    if (!topico.startsWith(RAIZ + "/")) return;
    const resto = topico.slice(RAIZ.length + 1).split("/");

    if (resto[0] === "estado") {
      if (!texto) { d.estado = { ...ESTADO_INICIAL }; } else {
        try { d.estado = { ...ESTADO_INICIAL, ...JSON.parse(texto) }; } catch { return; }
      }
      d.emitirEstado();
      return;
    }
    if (resto[0] === "votos" && resto.length === 3) {
      const [, preguntaId, cli] = resto;
      d.votos[preguntaId] = d.votos[preguntaId] || {};
      if (texto) d.votos[preguntaId][cli] = texto;
      else delete d.votos[preguntaId][cli];
      d.emitirVotos();
    }
  }

  function intentar(indice) {
    return new Promise((res, rej) => {
      if (indice >= BROKERS.length) return rej(new Error("ningún bróker alcanzable"));
      const url = BROKERS[indice];
      let resuelto = false;
      const c = window.mqtt.connect(url, {
        clientId: "td-" + idCliente() + "-" + Math.random().toString(16).slice(2, 6),
        keepalive: 30,
        clean: true,
        protocolVersion: 4,
        connectTimeout: 6000,
        reconnectPeriod: 2500,
      });
      const rendirse = () => {
        if (resuelto) return;
        resuelto = true;
        try { c.end(true); } catch { /* ignorar */ }
        intentar(indice + 1).then(res, rej);
      };
      const plazo = setTimeout(rendirse, 7000);
      c.on("error", rendirse);
      c.on("connect", () => {
        if (resuelto) return;
        resuelto = true;
        clearTimeout(plazo);
        c.subscribe(RAIZ + "/#", { qos: 0 });
        res({ c, url });
      });
      c.on("message", (t, carga) => aplicar(t, carga.toString()));
    });
  }

  return {
    modo: "mqtt",
    async conectar() {
      try {
        await cargarMqtt();
        const { c, url } = await intentar(0);
        cliente = c;
        // Al reconectar hay que volver a suscribirse para recibir los retenidos.
        c.on("connect", () => c.subscribe(RAIZ + "/#", { qos: 0 }));
        const host = new URL(url).host;
        return { modo: "mqtt", detalle: `Sala en línea · ${host}` };
      } catch (e) {
        respaldo = crearLocal();
        await respaldo.conectar();
        return { modo: "local", detalle: "Sin red: votos solo en este navegador" };
      }
    },
    escucharEstado(fn) { respaldo ? respaldo.escucharEstado(fn) : d.onEstado(fn); },
    escucharVotos(fn) { respaldo ? respaldo.escucharVotos(fn) : d.onVotos(fn); },
    async fijarEstado(parcial) {
      if (respaldo) return respaldo.fijarEstado(parcial);
      const nuevo = { ...d.estado, ...parcial, ts: Date.now() };
      d.estado = nuevo;
      d.emitirEstado();                       // respuesta inmediata en el mando
      publicar(RAIZ + "/estado", JSON.stringify(nuevo));
    },
    async votar(preguntaId, opcionId) {
      if (respaldo) return respaldo.votar(preguntaId, opcionId);
      d.votos[preguntaId] = d.votos[preguntaId] || {};
      d.votos[preguntaId][idCliente()] = opcionId;
      d.emitirVotos();
      publicar(`${RAIZ}/votos/${preguntaId}/${idCliente()}`, opcionId);
    },
    async reiniciar(preguntaId) {
      if (respaldo) return respaldo.reiniciar(preguntaId);
      const ids = Object.keys(d.votos[preguntaId] || {});
      // Un mensaje retenido se borra publicando una carga vacía en su tópico.
      ids.forEach((cli) => publicar(`${RAIZ}/votos/${preguntaId}/${cli}`, ""));
      d.votos[preguntaId] = {};
      d.emitirVotos();
    },
  };
}

// --------------------------------------------------------------------------
// 3 · Local (ensayo sin red)
// --------------------------------------------------------------------------

function crearLocal() {
  const canal = "BroadcastChannel" in window ? new BroadcastChannel("cnc2026") : null;
  const kEstado = `cnc2026:${SALA}:estado`;
  const kVotos = `cnc2026:${SALA}:votos`;
  const oyentesEstado = [];
  const oyentesVotos = [];

  const leerEstado = () => {
    try { return { ...ESTADO_INICIAL, ...JSON.parse(localStorage.getItem(kEstado) || "{}") }; }
    catch { return { ...ESTADO_INICIAL }; }
  };
  const leerVotos = () => {
    try { return JSON.parse(localStorage.getItem(kVotos) || "{}"); } catch { return {}; }
  };
  const emitir = () => {
    oyentesEstado.forEach((fn) => fn(leerEstado()));
    oyentesVotos.forEach((fn) => fn(leerVotos()));
  };
  const difundir = () => { if (canal) canal.postMessage("cambio"); emitir(); };

  if (canal) canal.onmessage = emitir;
  window.addEventListener("storage", emitir);

  return {
    modo: "local",
    async conectar() { return { modo: "local", detalle: "Votos solo en este navegador" }; },
    escucharEstado(fn) { oyentesEstado.push(fn); fn(leerEstado()); },
    escucharVotos(fn) { oyentesVotos.push(fn); fn(leerVotos()); },
    async fijarEstado(parcial) {
      localStorage.setItem(kEstado, JSON.stringify({ ...leerEstado(), ...parcial }));
      difundir();
    },
    async votar(preguntaId, opcionId) {
      const v = leerVotos();
      v[preguntaId] = v[preguntaId] || {};
      v[preguntaId][idCliente()] = opcionId;
      localStorage.setItem(kVotos, JSON.stringify(v));
      difundir();
    },
    async reiniciar(preguntaId) {
      const v = leerVotos();
      if (preguntaId) delete v[preguntaId];
      localStorage.setItem(kVotos, JSON.stringify(preguntaId ? v : {}));
      difundir();
    },
  };
}

export const datos = CONFIGURADO ? crearFirebase() : crearMqtt();

// Recuento: { A: 3, C: 11, ..., total: 14 }
export function contar(votosPregunta, opciones) {
  const conteo = {};
  opciones.forEach((o) => (conteo[o.id] = 0));
  let total = 0;
  Object.values(votosPregunta || {}).forEach((v) => {
    if (v in conteo) { conteo[v] += 1; total += 1; }
  });
  conteo.total = total;
  return conteo;
}
