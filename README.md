# Votación en directo — Casos controvertidos interactivos. Desmoide abdominal (CNC 2026)

Sistema de voto en vivo para la sesión de casos clínicos del 36 Congreso
Nacional de Cirugía. La sala vota desde el móvil escaneando un QR y las barras
crecen **dentro de la propia diapositiva**, en una sola pantalla: no hace falta
PowerPoint ni una segunda ventana.

- **Charla (una sola pantalla):** https://lozanon57.github.io/voto-td/charla.html
- **Público (móvil):** https://lozanon57.github.io/voto-td/
- **Presentador clásico (solo barras, sin diapositivas):** https://lozanon57.github.io/voto-td/presentador.html

**Está listo para la sala tal cual: no hay nada que configurar.** Ni tú ni la
audiencia necesitáis cuenta, registro ni instalar nada.

---

## 1 · Cómo se usa el día de la charla

Hay **dos modos**, y los dos funcionan. Lo que decide cuál usas es una sola
cosa: si proyectas desde tu portátil o desde el ordenador de la sala. Pregúntalo
en la secretaría técnica al entregar el archivo.

| | Modo A · tu portátil | Modo B · ordenador de la sala |
|---|---|---|
| Qué proyectas | `charla.html` | el `.pptx` |
| Dónde salen las barras | en la pantalla grande, dentro de la opción | en los móviles de la sala, uno a uno |
| Quién abre cada pregunta | se abre sola al entrar en la diapositiva | la abres tú desde tu móvil |
| Qué llevas en la mano | el mando | el mando y tu móvil con `presentador.html` |

El modo A es mejor y es para el que está hecho todo esto. Pero **el modo B no
es un apaño**: el QR está impreso en las doce diapositivas de pregunta, y cada
asistente ve en su teléfono el recuento en directo, la respuesta razonada y las
referencias. Lo único que se pierde es la barra en la pantalla grande.

### Modo A · desde tu portátil

**La charla entera va en `charla.html`, en una sola pantalla.** Las
diapositivas son las mismas del PowerPoint —se exportan del propio `.pptx`— y
las barras de voto se dibujan dentro de la opción impresa, no en una ventana
aparte. No hay que alternar entre dos aplicaciones ni acordarse de lanzar nada:

| Lo que haces | Lo que pasa solo |
|---|---|
| Entras en una diapositiva de pregunta | Se abre esa pregunta en todos los móviles |
| La sala vota | Las barras crecen dentro de las propias opciones, con el porcentaje a la derecha |
| Pasas a la diapositiva de respuesta | Se revela en los móviles, con la explicación y las referencias |
| Pasas a cualquier otra | Los móviles vuelven a la pantalla de espera |

**Antes de empezar**

1. Abre `charla.html` y pulsa **F** para pantalla completa.
2. Mira el punto de la chapa, arriba a la derecha: **verde** es sala en línea,
   **ámbar** es que falta algún servidor —funciona igual— y **rojo** es que no
   hay sala, y entonces toca voto a mano alzada.
3. Si has ensayado, pulsa **B** en cada pregunta para dejar el recuento a cero.

**Teclas**

| Tecla | Qué hace |
|---|---|
| `→` `Espacio` `AvPág` | Siguiente diapositiva |
| `←` `RePág` | Anterior |
| `R` | Revelar o esconder la respuesta sin cambiar de diapositiva |
| `B` | Borrar los votos de la pregunta que está en pantalla |
| `T` | Poner el cronómetro a cero |
| `F` | Pantalla completa |
| `H` | Ayuda con todas las teclas |

Los mandos de presentación que emulan `AvPág`/`RePág` funcionan sin
configurar nada. Haciendo clic en la mitad derecha o izquierda también se pasa.

La chapa lleva un reloj con **dos números: el tiempo real y el previsto** a esa
altura del guión, que sale del minutado de `build/construir.py`. Si el primero
se va más de 45 segundos por encima del segundo, se pone en ámbar.

**Si el wifi falla**: abre el `.pptx`, que lleva las mismas opciones impresas,
y pide el voto a mano alzada. Las imágenes de `charla.html` se precargan
enteras al abrir la página, así que una caída a mitad de charla no deja la
presentación en blanco.

### Modo B · desde el ordenador de la sala

Entregas el `.pptx` y avanzas con el mando, como cualquier charla. Las barras
las llevas tú en el móvil, con `presentador.html`, que en pantalla de teléfono
deja la pregunta, las cinco barras y el teclado numérico a la vista sin
desplazar.

1. Antes de subir, abre en **tu** móvil, en vertical y en silencio:
   `https://lozanon57.github.io/voto-td/presentador.html`
2. Al llegar a cada diapositiva de pregunta, **pulsa su número**. Aquí las
   preguntas no se abren solas: eso solo pasa en el modo A.
3. Al pasar a la diapositiva de respuesta, pulsa **«Mostrar respuesta»**.
4. Lee el reparto y dilo en voz alta —«la sala se parte entre resecar y
   biopsiar»—. Eso es lo que sustituye a la barra proyectada.

`Borrar votos` limpia la pregunta que tengas abierta; hazlo en las doce antes
de empezar si has ensayado.

**Lo que no hay que intentar**: incrustar la votación dentro del PowerPoint con
un complemento (Web Viewer, Slido, Mentimeter). Necesita que el ordenador de la
sala tenga el complemento instalado, sesión de Office iniciada y conexión, y en
modo presentación falla con facilidad. En una sala ajena no se juega la charla
a eso.

## 1 ter · Probarlo tú solo, sin montar nada

En la página del móvil, si no hay ninguna pregunta abierta aparece a los tres
segundos un botón **«Ver cómo funciona»**: recorre las doce preguntas en ese
teléfono, con su respuesta y su explicación, sin tocar la sala y sin contar
votos.

Para probar el circuito completo necesitas dos dispositivos: abre `charla.html`
en el portátil y la página de voto en el móvil.

**Ensayo general**: cambia `SALA` en `config.js` a `"cnc2026-ensayo"`, ensaya y
devuélvelo a `"cnc2026"` antes de la charla. Alternativa sin tocar código:
pulsa **B** en cada una de las doce preguntas antes de empezar.

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
| `charla.html` | **La charla entera en una pantalla**: diapositivas y voto en la misma vista |
| `diapos/NN.jpg` | Las 36 diapositivas exportadas del `.pptx`. **Generadas**: `build/exportar_web.py` |
| `diapos/indice.json` | Qué es cada diapositiva y dónde cae cada opción. **Generado**: `build/construir.py` |
| `index.html` | Página de voto que ve el público en el móvil |
| `presentador.html` | Vista clásica de proyección: QR, barras en vivo, mandos |
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

se reconstruyen a la vez el PowerPoint, este `preguntas.js` y el
`diapos/indice.json`, de modo que las diapositivas y los móviles no puedan
decir cosas distintas. Si ha cambiado algo que se ve en pantalla, hay que
reexportar también las imágenes de la charla:

```bash
python3 "$HOME/Library/Mobile Documents/com~apple~CloudDocs/Desmoides ASO MSKCC/CNC desmoides/build/exportar_web.py"
```

Después, `git commit` y `git push`.

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
