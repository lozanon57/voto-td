// ---------------------------------------------------------------------------
// CONFIGURACIÓN
//
// Tal como está, la aplicación YA FUNCIONA EN SALA: usa brókeres MQTT públicos
// sobre WebSocket, sin cuentas ni registro. No hace falta tocar nada.
//
// Si algún día quieres la versión más robusta (Firebase Realtime Database),
// rellena FIREBASE con los datos de tu proyecto y la aplicación cambiará sola
// de transporte. Instrucciones en el README, apartado «Opcional: Firebase».
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

// Prefijo de tópicos en los brókeres públicos. Es lo que separa esta sala del
// resto del mundo: si lo cambias, cámbialo en todos los dispositivos.
export const ESPACIO = "cnc2026-desmoides-hgugm";

// Brókeres MQTT públicos, en orden de preferencia. Si el primero no responde en
// siete segundos se pasa automáticamente al siguiente.
export const BROKERS = [
  "wss://broker.hivemq.com:8884/mqtt",
  "wss://broker.emqx.io:8084/mqtt",
  "wss://test.mosquitto.org:8081/mqtt",
];

// Clave para abrir los mandos del presentador: presentador.html?control=TU_CLAVE
// No es seguridad real, solo evita que alguien del público cambie de pregunta
// si llega a abrir la vista de presentador.
export const CLAVE_CONTROL = "maranon";

export const CONFIGURADO = FIREBASE.databaseURL.length > 0;
