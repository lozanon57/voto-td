# Votación en directo — Tumores desmoides intraabdominales (CNC 2026)

Sistema de voto en vivo para la sesión de casos clínicos del 36 Congreso Nacional
de Cirugía. La sala vota desde el móvil escaneando un QR; tú ves las barras
crecer en tiempo real en la vista de presentador, con el mismo aspecto que las
diapositivas del congreso.

- **Público (móvil):** https://lozanon57.github.io/voto-td/
- **Presentador (proyección):** https://lozanon57.github.io/voto-td/presentador.html
- **Presentador con mandos:** https://lozanon57.github.io/voto-td/presentador.html?control=maranon

No hay que instalar nada ni registrarse: ni tú ni la audiencia.

---

## 1. Qué hace cada archivo

| Archivo | Para qué |
|---|---|
| `index.html` | Página de voto que ve el público en el móvil |
| `presentador.html` | Vista de proyección: QR, barras en vivo, mandos |
| `preguntas.js` | **Las tres preguntas, sus opciones, la respuesta correcta y la explicación.** Es el único archivo que necesitas tocar para cambiar contenido |
| `config.js` | Claves de Firebase, nombre de la sala, clave de los mandos |
| `datos.js` | Sincronización (Firebase o modo ensayo local) |
| `estilo.css` | Aspecto |
| `assets/qr.png` | QR que apunta a la página de voto (el mismo que va en el PowerPoint) |

---

## 2. Configurar Firebase (una vez, ~5 minutos)

Hace falta una base de datos en tiempo real gratuita. El plan Spark cubre de
sobra una sala de congreso.

1. Entra en https://console.firebase.google.com con tu cuenta de Google y pulsa
   **Crear un proyecto**. Nómbralo p. ej. `voto-td`. Puedes desactivar Google
   Analytics.
2. En el menú lateral, **Compilación → Realtime Database → Crear base de datos**.
   Elige la región **europe-west1** y arranca en **modo de prueba**.
3. En la pestaña **Reglas** de esa base de datos, pega esto y publica:

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

   La marca `1796083200000` es el **1 de diciembre de 2026**: pasada esa fecha
   la base de datos deja de admitir escrituras sola, sin que tengas que
   acordarte. Si cambias de fecha, usa milisegundos desde época.

4. Vuelve a **Configuración del proyecto** (rueda dentada) → **Tus apps** →
   icono `</>` (Web) → registra la app con cualquier nombre. Firebase te enseña
   un bloque `const firebaseConfig = { ... }`.
5. Copia esos valores dentro de `FIREBASE` en `config.js`. Comprueba que
   `databaseURL` está relleno (algo como
   `https://voto-td-default-rtdb.europe-west1.firebasedatabase.app`); si falta,
   es que has creado Firestore en vez de Realtime Database.
6. Guarda, `git commit` y `git push`. GitHub Pages republica en 1-2 minutos.

> Las claves de Firebase en un archivo público son normales y no son un secreto:
> quien protege los datos son las reglas del paso 3.

**Sin hacer nada de esto, la aplicación funciona igual en "modo ensayo"**: los
votos se comparten solo entre pestañas del mismo navegador. Sirve para probar la
charla en casa, pero no para la sala.

---

## 3. Cómo se usa el día de la charla

**Antes de empezar**

1. Abre en el navegador, en una segunda ventana o segunda pantalla:
   `presentador.html?control=maranon`
2. Déjala en pantalla completa (`F11`, o `Ctrl/Cmd + Mayús + F` en Safari).
3. Comprueba que arriba a la derecha pone *Sala en línea (Firebase)*.
4. Pulsa **Sala**: queda el QR grande esperando. Esa misma pantalla se puede
   proyectar mientras la gente entra.

**Durante cada caso**

| Momento | Qué haces |
|---|---|
| Presentas el caso | Diapositivas de PowerPoint |
| Lanzas la pregunta | Cambias a la ventana del presentador y pulsas **Caso 1** (o tecla `1`) |
| La sala vota | Las barras crecen solas; el contador de votos sube |
| Cierras la votación | Pulsas **Mostrar respuesta** (tecla `R`): la correcta se pone verde, el resto se atenúa y aparece la explicación con las referencias |
| Sigues | Vuelves a PowerPoint |

Atajos de teclado en la vista de presentador: `1` `2` `3` saltan a cada caso,
`0` vuelve a la pantalla de sala, `R` muestra u oculta la respuesta.

**Si el wifi falla**: las diapositivas de pregunta del PowerPoint llevan las
mismas opciones impresas. Pide voto a mano alzada y sigue: no se pierde nada de
la charla.

---

## 4. Ensayo general recomendado

Cambia `SALA` en `config.js` a `"cnc2026-ensayo"`, ensaya con el móvil, y
devuélvelo a `"cnc2026"` antes de la charla. Así llegas al congreso con el
recuento a cero.

---

## 5. Cambiar las preguntas

Todo está en `preguntas.js`. Cada pregunta lleva:

```js
{
  id: "p1",                 // no lo cambies: lo usan los mandos y las teclas 1/2/3
  etiqueta: "Caso 1 · ...", // eyebrow que sale arriba
  enunciado: "...",         // viñeta clínica
  pregunta: "...",          // la pregunta en sí
  opciones: [ { id: "A", texto: "..." }, ... ],   // 2 a 6 opciones
  correcta: "C",
  clave: "...",             // una frase, la idea que debe quedar
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

## 6. Privacidad

No se pide ni se guarda ningún dato personal. Cada navegador genera un
identificador aleatorio local que solo sirve para no contar dos veces el mismo
voto; no se asocia a ninguna persona y no sale del dispositivo salvo como clave
anónima del voto. Las viñetas clínicas publicadas están anonimizadas.
