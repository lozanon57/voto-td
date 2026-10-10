# Votación en directo — Tumores desmoides intraabdominales (CNC 2026)

Sistema de voto en vivo para la sesión de casos clínicos del 36 Congreso Nacional
de Cirugía. La sala vota desde el móvil escaneando un QR; tú ves las barras
crecer en tiempo real en la vista de presentador, con el mismo aspecto que las
diapositivas del congreso.

- **Público (móvil):** https://lozanon57.github.io/voto-td/
- **Presentador (proyección):** https://lozanon57.github.io/voto-td/presentador.html
- **Presentador con mandos:** https://lozanon57.github.io/voto-td/presentador.html?control=maranon

**Está listo para la sala tal cual: no hay nada que configurar.** Ni tú ni la
audiencia necesitáis cuenta, registro ni instalar nada.

---

## 1 · Cómo se usa el día de la charla

**Antes de empezar**

1. Abre en una segunda ventana o segunda pantalla
   `presentador.html?control=maranon` y ponla en pantalla completa
   (`F11`, o `Ctrl/Cmd + Mayús + F` en Safari).
2. Comprueba abajo a la derecha que pone **«Sala en línea · broker…»**. Si
   pusiera «Sin red», recarga.
3. Pulsa **Sala**: queda el QR grande esperando. Esa pantalla se puede proyectar
   mientras entra la gente.

**Durante cada caso**

| Momento | Qué haces |
|---|---|
| Presentas el caso | Diapositivas de PowerPoint |
| Lanzas la pregunta | Cambias a la ventana del presentador y pulsas **Caso 1** (o la tecla `1`) |
| La sala vota | Las barras crecen solas; el contador de votos sube |
| Cierras la votación | Pulsas **Mostrar respuesta** (tecla `R`): la correcta se pone verde, el resto se atenúa y aparece la explicación con las referencias |
| Sigues | Vuelves a PowerPoint |

Atajos en la vista de presentador: `1` `2` `3` saltan a cada caso, `0` vuelve a
la pantalla de sala, `R` muestra u oculta la respuesta.

**Si el wifi falla**: las diapositivas de pregunta del PowerPoint llevan las
mismas opciones impresas. Pide voto a mano alzada y sigue.

**Ensayo general**: cambia `SALA` en `config.js` a `"cnc2026-ensayo"`, ensaya con
el móvil y devuélvelo a `"cnc2026"` antes de la charla. Así llegas al congreso
con el recuento a cero. Alternativa sin tocar código: pulsa **Borrar votos de
esta pregunta** en cada uno de los tres casos antes de empezar.

---

## 2 · Cómo funciona por dentro

Los tres dispositivos —tu portátil y los móviles de la sala— se sincronizan por
**MQTT sobre WebSocket** contra brókeres públicos, usando **mensajes retenidos**.
Eso significa que quien abre la página tarde recibe inmediatamente la pregunta
activa y el recuento completo, sin necesidad de servidor propio ni base de datos.

Si el primer bróker no responde en siete segundos, la aplicación salta sola al
siguiente de la lista de `config.js`:

1. `wss://broker.hivemq.com:8884/mqtt`
2. `wss://broker.emqx.io:8084/mqtt`
3. `wss://test.mosquitto.org:8081/mqtt`

Si no hay ninguno alcanzable, cada navegador queda aislado y la página del móvil
lo avisa claramente, para que nadie crea que ha votado cuando no es así.

La librería MQTT va **vendorizada** en `assets/mqtt.min.js`: no se descarga nada
de ningún CDN en tiempo de ejecución.

### Qué implica usar un bróker público

Los tópicos cuelgan de `cnc2026-desmoides-hgugm/cnc2026`. Son públicos: alguien
que conociera ese prefijo podría, en teoría, leer el recuento o publicar votos
falsos. Para una encuesta de sala es irrelevante —no viaja ningún dato personal,
solo letras A-E— pero conviene saberlo. Si quieres una sala privada para otra
charla, cambia `ESPACIO` en `config.js` por algo que solo conozcas tú.

### Opcional: Firebase

Si prefieres un backend privado y con garantías de servicio, la aplicación
cambia sola de transporte en cuanto rellenes `FIREBASE` en `config.js`:

1. https://console.firebase.google.com → **Crear un proyecto** (puedes desactivar
   Analytics).
2. **Compilación → Realtime Database → Crear base de datos**, región
   **europe-west1**, en modo de prueba.
3. Pestaña **Reglas**, pegar y publicar:

   ```json
   {
     "rules": {
       "cnc2026": {
         "estado": { ".read": true, ".write": "now < 1796083200000" },
         "votos": {
           ".read": true,
           "$pregunta": {
             "$cliente": {
               ".write": "now < 1796083200000",
               ".validate": "newData.isString() && newData.val().length < 3"
             }
           }
         }
       }
     }
   }
   ```

   `1796083200000` es el 1 de diciembre de 2026: pasada esa fecha la base de
   datos deja de admitir escrituras sola.
4. **Configuración del proyecto → Tus apps → `</>`**, copiar el objeto
   `firebaseConfig` dentro de `FIREBASE` en `config.js`. Comprueba que
   `databaseURL` está relleno; si falta, has creado Firestore en vez de Realtime
   Database.
5. `git commit` y `git push`. GitHub Pages republica en 1-2 minutos y la vista de
   presentador pasará a decir «Firebase Realtime Database».

---

## 3 · Archivos

| Archivo | Para qué |
|---|---|
| `index.html` | Página de voto que ve el público en el móvil |
| `presentador.html` | Vista de proyección: QR, barras en vivo, mandos |
| `preguntas.js` | **Las tres preguntas, sus opciones, la respuesta correcta y la explicación.** Es el único archivo que necesitas tocar para cambiar contenido |
| `config.js` | Sala, tópico, lista de brókeres, clave de los mandos y (opcional) Firebase |
| `datos.js` | Sincronización: Firebase → MQTT → local, en ese orden |
| `estilo.css` | Aspecto |
| `assets/qr.png` | QR que apunta a la página de voto (el mismo que va en el PowerPoint) |
| `assets/mqtt.min.js` | Cliente MQTT, servido desde el propio repositorio |

### Cambiar las preguntas

Todo está en `preguntas.js`. Cada pregunta lleva:

```js
{
  id: "p1",                 // no lo cambies: lo usan los mandos y las teclas 1/2/3
  etiqueta: "Caso 1 · ...", // rótulo pequeño de arriba
  enunciado: "...",         // viñeta clínica
  pregunta: "...",          // la pregunta en sí
  opciones: [ { id: "A", texto: "..." }, ... ],   // 2 a 6 opciones
  correcta: "C",
  clave: "...",             // una frase: la idea que debe quedar
  explicacion: "...",       // el párrafo razonado
  referencias: "...",
}
```

Si añades un cuarto caso, duplica un bloque con `id: "p4"`, añade un botón
`data-ir="p4"` en `presentador.html` y amplía el mapa de teclas.

Para regenerar el QR si cambias la URL:

```bash
python3 -c "import qrcode;from qrcode.constants import ERROR_CORRECT_M;q=qrcode.QRCode(error_correction=ERROR_CORRECT_M,box_size=20,border=2);q.add_data('https://lozanon57.github.io/voto-td/');q.make(fit=True);q.make_image(fill_color='#0B1924',back_color='white').convert('RGB').save('assets/qr.png')"
```

---

## 4 · Privacidad

No se pide ni se guarda ningún dato personal. Cada navegador genera un
identificador aleatorio local que solo sirve para no contar dos veces el mismo
voto; no se asocia a ninguna persona. Lo único que viaja por la red es una letra
(A-E) por votante. Las viñetas clínicas publicadas están anonimizadas.
