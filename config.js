// ---------------------------------------------------------------------------
// CONFIGURACIÓN — rellena este archivo una sola vez (ver README.md, paso 2).
//
// Copia aquí el objeto firebaseConfig que te da la consola de Firebase en
// Configuración del proyecto → Tus apps → Configuración del SDK.
// La databaseURL es imprescindible: es la Realtime Database, no Firestore.
// ---------------------------------------------------------------------------

export const FIREBASE = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

// Raíz de datos de esta sesión. Cambiándola empiezas de cero sin borrar nada
// (p. ej. "cnc2026-ensayo" para el ensayo general y "cnc2026" para la charla).
export const SALA = "cnc2026";

// Clave para abrir los mandos del presentador: presentador.html?control=TU_CLAVE
// No es seguridad real, solo evita que alguien del público cambie de pregunta
// si llega a abrir la vista de presentador.
export const CLAVE_CONTROL = "maranon";

export const CONFIGURADO = FIREBASE.databaseURL.length > 0;
