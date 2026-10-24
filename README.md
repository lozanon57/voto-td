# Votación en directo — Tumores desmoides intraabdominales (CNC 2026)

Sistema de voto en vivo para la sesión de casos clínicos del 36 Congreso Nacional
de Cirugía. La sala vota desde el móvil escaneando un QR; tú ves las barras
crecer en tiempo real en la vista de presentador, con el mismo aspecto que las
diapositivas del congreso.

- **Público (móvil):** https://lozanon57.github.io/voto-td/
- **Presentador (con mandos):** https://lozanon57.github.io/voto-td/presentador.html
- **Presentador sin botones**, para proyectar: añade `?publico=1`

**Está listo para la sala tal cual: no hay nada que configurar.** Ni tú ni la
audiencia necesitáis cuenta, registro ni instalar nada.

---

## 1 · Cómo se usa el día de la charla

> **Lo primero, porque es lo que más despista:** las preguntas se lanzan una a
> una desde la vista de ponente. Quien escanee el QR sin que tú hayas abierto
> ninguna verá una pantalla de espera. Es normal, no es un fallo — pero sin esa
> ventana abierta no hay votación.

**Antes de empezar**

1. Abre en una segunda ventana o segunda pantalla
   `presentador.html` y ponla en pantalla completa (`F11`, o
   `Ctrl/Cmd + Mayús + F` en Safari). Los mandos salen solos.
2. Comprueba abajo a la derecha que pone **«Sala en línea · 3/3 servidores»**.
3. Pulsa **Sala**: queda el QR grande esperando. Esa pantalla se puede proyectar
   mientras entra la gente.

¿Sin segunda pantalla? La vista de ponente funciona también **en el móvil**:
ábrela en el teléfono y ve pasando preguntas desde la mano, con el PowerPoint a
pantalla completa en el portátil.

**Durante cada caso**

| Momento | Qué haces |
|---|---|
| Presentas el caso | Diapositivas de PowerPoint |
| Lanzas la pregunta | Cambias a la ventana del presentador y pulsas **▶** (o la flecha derecha) |
| La sala vota | Las barras crecen solas, en tu pantalla **y en el móvil de cada asistente** |
| Cierras la votación | Pulsas **Mostrar respuesta** (tecla `R`): la correcta se pone verde, el resto se atenúa y aparece la explicación con las referencias |
| Sigues | Vuelves a PowerPoint |

Atajos en la vista de presentador: **flecha derecha** avanza a la pregunta
siguiente, **flecha izquierda** retrocede, **0** o **Esc** vuelven a la pantalla
de sala, **R** muestra u oculta la respuesta. Los doce botones numerados saltan
a cualquier pregunta directamente.

**Si el wifi falla**: las diapositivas de pregunta del PowerPoint llevan las
mismas opciones impresas. Pide voto a mano alzada y sigue.

## 1 bis · Probarlo tú solo, sin montar nada

En la página del móvil, si no hay ninguna pregunta abierta aparece a los tres
segundos un botón **«Ver cómo funciona»**: recorre las doce preguntas en ese
teléfono, con su respuesta y su explicación, sin tocar la sala y sin contar
votos. Es la forma rápida de enseñárselo a alguien o de repasar el contenido.

Para probar el circuito completo (voto → barras en vivo → respuesta) necesitas
dos pantallas, aunque sea el portátil y el móvil: abre `presentador.html` en una
y la página de voto en la otra.

**Ensayo general**: cambia `SALA` en `config.js` a `"cnc2026-ensayo"`, ensaya con
el móvil y devuélvelo a `"cnc2026"` antes de la charla. Así llegas al congreso
con el recuento a cero. Alternativa sin tocar código: pulsa **Borrar votos de
esta pregunta** en cada uno de los tres casos antes de empezar.

---

## 2 · Cómo funciona por dentro

Tu portátil y los móviles de la sala se sincronizan por **MQTT sobre WebSocket**
contra brókeres públicos, usando **mensajes retenidos**: quien abre la página
tarde recibe al instante la pregunta activa y el recuento completo, sin servidor
propio ni base de datos.

Cada dispositivo se conecta a **todos** los brókeres de la lista a la vez, no a
uno solo. Esto es deliberado y corrige el fallo que tenía la primera versión: si
cada dispositivo elegía bróker por su cuenta, el portátil podía acabar en uno y
los móviles en otro, y eran dos salas distintas que no se veían. Publicando en
todos, basta con que cada móvil comparta **un** bróker con el presentador.

Además, un bróker que no responde al arrancar no se abandona: sigue reintentando
de fondo y, en cuanto entra, se le reenvía el estado y los votos propios. Una
sala que empieza con 2 de 3 servidores se repara sola. El indicador de la esquina
inferior derecha dice en todo momento cuántos hay conectados.

La lista, en `config.js`:

1. `wss://broker.hivemq.com:8884/mqtt`
2. `wss://broker.emqx.io:8084/mqtt`
3. `wss://test.mosquitto.org:8081/mqtt`

Si no hay ninguno alcanzable, cada navegador queda aislado y la página del móvil
lo avisa en rojo, para que nadie crea que ha votado cuando no es así.

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
| `preguntas.js` | Las doce preguntas. **Generado automáticamente**: no se edita a mano (ver abajo) |
| `config.js` | Sala, tópico, lista de brókeres, clave de los mandos y (opcional) Firebase |
| `datos.js` | Sincronización: Firebase → MQTT → local, en ese orden |
| `estilo.css` | Aspecto |
| `assets/qr.png` | QR que apunta a la página de voto (el mismo que va en el PowerPoint) |
| `assets/mqtt.min.js` | Cliente MQTT, servido desde el propio repositorio |

### Cambiar las preguntas

`preguntas.js` **se genera**, no se edita. La fuente única es

```
.../CNC desmoides/build/preguntas.py
```

que está junto a la presentación. Al editarlo y ejecutar

```bash
python3 "$HOME/Library/Mobile Documents/com~apple~CloudDocs/Desmoides ASO MSKCC/CNC desmoides/build/construir.py"
```

se reconstruyen a la vez el PowerPoint y este `preguntas.js`, de modo que las
diapositivas y los móviles no puedan decir cosas distintas. Después, `git commit`
y `git push`.

Los mandos del presentador y los atajos de teclado se generan a partir del número
de preguntas: si añades o quitas alguna, no hay que tocar el HTML.

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
