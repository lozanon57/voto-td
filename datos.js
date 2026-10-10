// Capa de datos. Dos implementaciones con la misma interfaz:
//   - Firebase Realtime Database (sala real, varios móviles).
//   - Modo local (localStorage + BroadcastChannel) cuando config.js está vacío,
//     para poder ensayar la charla sin conexión en un solo ordenador.
//
// Interfaz expuesta:
//   conectar()                        -> { modo, enLinea }
//   escucharEstado(fn)                -> fn({ pregunta, revelada })
//   escucharVotos(fn)                 -> fn({ p1: {cliente: "C", ...}, ... })
//   fijarEstado({pregunta, revelada})
//   votar(preguntaId, opcionId)
//   reiniciar(preguntaId)
//   idCliente()

import { FIREBASE, SALA, CONFIGURADO } from "./config.js";

const CLAVE_CLIENTE = "cnc2026:cliente";

export function idCliente() {
  let id = localStorage.getItem(CLAVE_CLIENTE);
  if (!id) {
    id = "c" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
    localStorage.setItem(CLAVE_CLIENTE, id);
  }
  return id;
}

const ESTADO_INICIAL = { pregunta: null, revelada: false };

// --------------------------------------------------------------------------
// Implementación local (ensayo sin Firebase)
// --------------------------------------------------------------------------

function crearLocal() {
  const canal = "BroadcastChannel" in window ? new BroadcastChannel("cnc2026") : null;
  const kEstado = `cnc2026:${SALA}:estado`;
  const kVotos = `cnc2026:${SALA}:votos`;
  const oyentesEstado = [];
  const oyentesVotos = [];

  const leerEstado = () => {
    try {
      return { ...ESTADO_INICIAL, ...JSON.parse(localStorage.getItem(kEstado) || "{}") };
    } catch {
      return { ...ESTADO_INICIAL };
    }
  };
  const leerVotos = () => {
    try {
      return JSON.parse(localStorage.getItem(kVotos) || "{}");
    } catch {
      return {};
    }
  };
  const emitir = () => {
    const e = leerEstado();
    const v = leerVotos();
    oyentesEstado.forEach((fn) => fn(e));
    oyentesVotos.forEach((fn) => fn(v));
  };
  const difundir = () => {
    if (canal) canal.postMessage("cambio");
    emitir();
  };

  if (canal) canal.onmessage = emitir;
  window.addEventListener("storage", emitir);

  return {
    modo: "local",
    async conectar() {
      return { modo: "local", enLinea: true };
    },
    escucharEstado(fn) {
      oyentesEstado.push(fn);
      fn(leerEstado());
    },
    escucharVotos(fn) {
      oyentesVotos.push(fn);
      fn(leerVotos());
    },
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

// --------------------------------------------------------------------------
// Implementación Firebase
// --------------------------------------------------------------------------

function crearFirebase() {
  let db = null;
  let fb = null;

  return {
    modo: "firebase",
    async conectar() {
      const appMod = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
      fb = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js");
      const app = appMod.initializeApp(FIREBASE);
      db = fb.getDatabase(app);
      return { modo: "firebase", enLinea: true };
    },
    escucharEstado(fn) {
      fb.onValue(fb.ref(db, `${SALA}/estado`), (snap) => {
        fn({ ...ESTADO_INICIAL, ...(snap.val() || {}) });
      });
    },
    escucharVotos(fn) {
      fb.onValue(fb.ref(db, `${SALA}/votos`), (snap) => fn(snap.val() || {}));
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

export const datos = CONFIGURADO ? crearFirebase() : crearLocal();

// Recuento: { A: 3, C: 11, ... , total: 14 }
export function contar(votosPregunta, opciones) {
  const conteo = {};
  opciones.forEach((o) => (conteo[o.id] = 0));
  let total = 0;
  Object.values(votosPregunta || {}).forEach((v) => {
    if (v in conteo) {
      conteo[v] += 1;
      total += 1;
    }
  });
  conteo.total = total;
  return conteo;
}
