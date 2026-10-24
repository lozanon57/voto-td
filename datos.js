// Capa de datos. Tres implementaciones con la misma interfaz:
//
//   1. Firebase Realtime Database — si config.js está relleno.
//   2. MQTT sobre WebSocket contra brókeres públicos. Se conecta a TODOS los
//      brókeres de la lista a la vez y publica en todos ellos. Esto es
//      deliberado: si cada dispositivo eligiera un bróker por su cuenta, el
//      portátil podría acabar en uno y los móviles en otro, y serían dos salas
//      distintas que no se ven. Publicando en todos, basta con que cada móvil
//      comparta UN bróker con el presentador.
//   3. Local (localStorage + BroadcastChannel) — si no hay ninguno alcanzable.
//
// Interfaz:
//   conectar()                        -> { modo, detalle }
//   escucharEstado(fn)                -> fn({ pregunta, revelada })
//   escucharVotos(fn)                 -> fn({ p1: {cliente: "C", ...}, ... })
//   fijarEstado({pregunta, revelada})
//   votar(preguntaId, opcionId)
//   reiniciar(preguntaId)
//   idCliente()

import { FIREBASE, SALA, CONFIGURADO, BROKERS, ESPACIO } from "./config.js";

const CLAVE_CLIENTE = "cnc2026:cliente";
const ESTADO_INICIAL = { pregunta: null, revelada: false, ts: 0 };
const PLAZO_CONEXION = 9000;

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
  let db = null, fb = null;
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
    escucharVotos(fn) { fb.onValue(fb.ref(db, `${SALA}/votos`), (s) => fn(s.val() || {})); },
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
// 2 · MQTT sobre WebSocket, en todos los brókeres a la vez
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
  const clientes = [];          // los que están conectados AHORA
  const todos = [];             // todos, conectados o reintentando
  let respaldo = null;
  let avisarConexion = null;
  let esPonente = false;        // solo el presentador publica el estado
  const misVotos = {};          // para reenviarlos si entra un bróker tarde

  const resumen = () => ({
    modo: respaldo ? "local" : "mqtt",
    conectados: clientes.length,
    total: BROKERS.length,
    detalle: respaldo
      ? "Sin conexión con la sala"
      : `Sala en línea · ${clientes.length}/${BROKERS.length} servidores`,
  });

  const notificar = () => { if (avisarConexion) avisarConexion(resumen()); };

  const publicarEn = (c, topico, carga) => {
    if (c.connected) c.publish(topico, carga, { qos: 0, retain: true });
  };
  const publicar = (topico, carga) => {
    if (respaldo) return;
    clientes.forEach((c) => publicarEn(c, topico, carga));
  };

  function aplicar(topico, texto) {
    if (!topico.startsWith(RAIZ + "/")) return;
    const resto = topico.slice(RAIZ.length + 1).split("/");

    if (resto[0] === "estado") {
      if (!texto) return;
      let nuevo;
      try { nuevo = JSON.parse(texto); } catch { return; }
      // El mismo mensaje llega por varios brókeres, y uno que estuvo caído puede
      // traer un retenido viejo: solo avanzamos en el tiempo, nunca al revés.
      if ((nuevo.ts || 0) < (d.estado.ts || 0)) return;
      d.estado = { ...ESTADO_INICIAL, ...nuevo };
      d.emitirEstado();
      return;
    }
    if (resto[0] === "votos" && resto.length === 3) {
      const [, preguntaId, cli] = resto;
      d.votos[preguntaId] = d.votos[preguntaId] || {};
      const antes = d.votos[preguntaId][cli];
      if (texto) d.votos[preguntaId][cli] = texto;
      else delete d.votos[preguntaId][cli];
      if (antes !== d.votos[preguntaId][cli]) d.emitirVotos();
    }
  }

  // Al entrar (o reentrar) un bróker, le reenviamos lo que es nuestro: así una
  // sala que arrancó con 2 de 3 servidores se repara sola cuando llega el tercero.
  function reenviarLoPropio(c) {
    if (esPonente && d.estado.ts) {
      publicarEn(c, RAIZ + "/estado", JSON.stringify(d.estado));
    }
    Object.entries(misVotos).forEach(([preguntaId, opcion]) => {
      publicarEn(c, `${RAIZ}/votos/${preguntaId}/${idCliente()}`, opcion);
    });
  }

  // No se abandona ningún bróker: el que falla sigue reintentando de fondo y se
  // incorpora en cuanto responde.
  function conectarA(url) {
    return new Promise((res) => {
      let primera = true;
      let c;
      try {
        c = window.mqtt.connect(url, {
          clientId: "td-" + idCliente() + "-" + Math.random().toString(16).slice(2, 6),
          keepalive: 30,
          clean: true,
          protocolVersion: 4,
          connectTimeout: PLAZO_CONEXION,
          reconnectPeriod: 5000,
        });
      } catch { return res(null); }

      c.url = url;
      todos.push(c);
      const plazo = setTimeout(() => {
        if (primera) { primera = false; res(null); }
      }, PLAZO_CONEXION + 1500);

      c.on("error", () => { /* mqtt.js reintenta por su cuenta */ });
      c.on("message", (t, carga) => aplicar(t, carga.toString()));
      c.on("close", () => {
        const i = clientes.indexOf(c);
        if (i >= 0) { clientes.splice(i, 1); notificar(); }
      });
      c.on("connect", () => {
        c.subscribe(RAIZ + "/#", { qos: 0 });
        if (!clientes.includes(c)) { clientes.push(c); notificar(); }
        reenviarLoPropio(c);
        if (primera) { primera = false; clearTimeout(plazo); res(c); }
      });
    });
  }

  return {
    modo: "mqtt",
    alCambiarConexion(fn) { avisarConexion = fn; },
    async conectar() {
      try {
        await cargarMqtt();
        await Promise.all(BROKERS.map(conectarA));
      } catch { /* cae al respaldo */ }
      if (!clientes.length && !todos.length) {
        respaldo = crearLocal();
        await respaldo.conectar();
      }
      return resumen();
    },
    escucharEstado(fn) { respaldo ? respaldo.escucharEstado(fn) : d.onEstado(fn); },
    escucharVotos(fn) { respaldo ? respaldo.escucharVotos(fn) : d.onVotos(fn); },
    async fijarEstado(parcial) {
      if (respaldo) return respaldo.fijarEstado(parcial);
      esPonente = true;
      const nuevo = { ...d.estado, ...parcial, ts: Date.now() };
      d.estado = nuevo;
      d.emitirEstado();
      publicar(RAIZ + "/estado", JSON.stringify(nuevo));
    },
    async votar(preguntaId, opcionId) {
      if (respaldo) return respaldo.votar(preguntaId, opcionId);
      misVotos[preguntaId] = opcionId;
      d.votos[preguntaId] = d.votos[preguntaId] || {};
      d.votos[preguntaId][idCliente()] = opcionId;
      d.emitirVotos();
      publicar(`${RAIZ}/votos/${preguntaId}/${idCliente()}`, opcionId);
    },
    async reiniciar(preguntaId) {
      if (respaldo) return respaldo.reiniciar(preguntaId);
      Object.keys(d.votos[preguntaId] || {}).forEach((cli) =>
        publicar(`${RAIZ}/votos/${preguntaId}/${cli}`, "")  // carga vacía = borra el retenido
      );
      delete misVotos[preguntaId];
      d.votos[preguntaId] = {};
      d.emitirVotos();
    },
  };
}

// --------------------------------------------------------------------------
// 3 · Local (sin red)
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
      localStorage.setItem(kEstado, JSON.stringify({ ...leerEstado(), ...parcial, ts: Date.now() }));
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
