# AMUREK v3 — nueva propuesta: amurek.com + /nk.studio

La información de amurek.com y la dirección de arte de /nk.studio, unidas en un producto nuevo.

**Base:** la web publicada en amurek.com, descargada el 21 nov 2026. De ahí salen:
- los textos y las secciones;
- las tipografías Inter Tight, Inter y Roboto Mono;
- el pie, el aviso de cookies y el WhatsApp.

**Lo nuevo:** cómo se presenta y cómo se recorre. Todo vive en `assets/ad/`.

## Identidad nueva (21 nov 2026)
Los archivos de marca están en `assets/brand/`.
- **Logotipo e isotipo:** el «a» con el punto verde.
  - Aparecen en la barra, el hero, la pantalla de carga, el pie, los avatares, el chat y el favicon.
  - El punto es neón sobre negro y `#007A46` sobre blanco.
- **Paleta:**

  | Color | HEX | Uso |
  |---|---|---|
  | Negro | `#0A0A0A` | Fondo principal |
  | Negro superficie | `#1A1A1A` | Tarjetas sobre negro |
  | Blanco | `#F5F5F3` | Texto sobre negro y secciones claras |
  | Gris medio | `#8C8C8A` | Texto secundario |
  | Gris línea | `#2A2A29` | Líneas y bordes sobre negro |
  | Verde neón | `#00FF8B` | Acento, solo sobre negro |
  | Verde profundo | `#007A46` | Acento sobre blanco |

- **Proporción medida en el inicio:** las secciones claras ocupan el **22 %** del recorrido y las oscuras el **78 %** (negro más superficies y grises). La guía pide 24 % y 74 %.
  - Secciones claras: «Ideas con forma», Equipo, Planes y Preguntas.
  - El verde queda por debajo del 2 % en casi todo el recorrido: puntos, subrayados, el punto final del titular, algunos nodos 3D y los indicadores.
  - **Excepción pedida (25 nov):** el cierre «Empieza tu proyecto con nosotros» lleva fondo verde neón con texto negro, para que llame la atención.
- **Etiquetas:** un punto redondo (como el de la marca) y texto en mayúsculas mono. Sin ®.
- **Botones:** blancos sobre negro y negros sobre blanco.
- **Barra:** negra, con los enlaces en gris y el actual en blanco con subrayado verde.
- **Hero:**
  - La seda en movimiento pasa a plata y grafito.
  - Solo el punto de «forma.» va en verde.
- **3D:** blanco y grises. El verde solo aparece en nodos de acento y en destellos.
- **Pendiente (archivos raster):** `assets/icon-180.png`, `icon-512.png` y `og-amurek.jpg` siguen con la marca anterior. Hay que exportarlos de nuevo desde el logo.

El repositorio local `Desktop/code/amurek-isotipo/sitio-web` es una versión anterior (v33) y **no se tocó**, igual que la web publicada.

## Recorrido del inicio
| # | Bloque | Qué es |
|---|---|---|
| – | **Pantalla de carga** | Del símbolo al nombre: aparece el punto verde y la «a» crece a su alrededor (el isotipo). Luego el punto sale de la «a» y recorre el piso; cada letra sube desde debajo del piso cuando el punto pasa (aparece encendida en verde y se vuelve blanca). El punto queda después de la k con un brillo contenido que respeta el espacio. La pantalla sube entera, como un telón. |
| 0 | **Entrada** | Miles de puntos (el punto de la marca) en WebGL.<br>Al inicio forman una red de ideas. Con cada scroll fluyen en corrientes y forman cada proyecto en semitono con relieve (Nómada, Aurora, Carmín), con su nombre al lado. Al final se condensan en el punto de la marca: «Tu idea puede ser la siguiente.».<br>El cursor empuja y levanta los puntos, y un clic lanza una onda.<br>Al entrar, los puntos pasan junto a la cámara, todo se enciende en un destello y la web aparece en orden: logo y «Agencia Creativa», la seda, el texto y la barra.<br>«Entrar» está siempre disponible abajo a la derecha. Se ve una vez por sesión; para verla de nuevo, abre `index.html?intro`. |
| 1 | Hero | La seda en movimiento de amurek.com, ahora de borde a borde y sin tarjeta: nace del negro del logo. |
| 2 | Ideas con forma | Igual que amurek.com, con esquinas contenidas. |
| 3 | Showreel → Reels | Arranca solo con «©2026», el video y «Showreel». El video llena la pantalla y entra en el titular «Ideas en [video] movimiento.».<br>Los reels llevan una cabecera breve con su descripción. |
| 4 | Proyectos | Igual (te encanta). |
| 5 | **Servicios** | La ola de puntos de fondo, sin velo. Títulos fijos (el activo en blanco con el punto verde) y un solo detalle que cambia con un fundido mientras haces scroll. La ola sigue el scroll sin saltos y se funde con el negro arriba y abajo. |
| 6 | Testimonios | Sección clara. Las cifras se arman con puntos que llegan dispersos y encuentran su forma; luego queda el número nítido. |
| 7 | **Cómo trabajamos contigo** | Cuatro etapas: «Pensamos tu idea.», «La conectamos con tu público.», «Le damos forma.», «Y la lanzamos.». Una sola etiqueta.<br>El texto y su referencia (chat, brief, piezas, campaña) van a la izquierda; la escena 3D ocupa toda la sección y su forma se ubica a la derecha, sin cortes. |
| 8 | Equipo | Como en amurek.com: las fotos se reúnen en una fila con el scroll. Sin fondo animado. |
| 9 | Planes | Banda oscura con dos tarjetas claras iguales. |
| 10 | Preguntas | Igual. |
| 11 | Cierre | Verde neón con texto negro. Una trama de puntos negros crece hacia abajo y se convierte en el negro del pie; respira y responde al cursor. |
| 12 | Pie | La frase «Donde tu idea encuentra forma.» en lugar del logo de arriba; correo y botón en una sola pieza. El logo grande sigue abajo. |

**En todas las páginas:**
- esquinas de 10 px como máximo;
- botones más editoriales;
- paneles que se abren al entrar;
- scroll suave;
- cursor «Play» / «Ver».

## Páginas internas (25 nov 2026)
Todas usan el mismo sistema que el inicio. Las armo en `assets/ad/paginas.py`, que se llama desde `aplicar.py`.
- **Sistema común:**
  - hero oscuro con una escena de puntos que «toma forma» (`createDotForm` en `scenes.js`);
  - etiquetas con punto redondo y titulares con el punto verde;
  - secciones que alternan oscuro y claro;
  - cierre verde con la trama de puntos que se vuelve el pie, y la frase de la marca en el pie;
  - la barra se lee bien sobre el negro.
- **Servicios:**
  - Hero con los cinco servicios en lista: al pasar por cada uno, los puntos forman su imagen (si nadie elige, avanza sola).
  - Un capítulo por servicio, alternando claro y oscuro. El texto queda fijo a la izquierda; a la derecha van la imagen que se abre al entrar, qué incluye, qué recibes e ideal para.
  - Después: «Cómo trabajamos contigo» (la escena 3D del inicio), preguntas, planes y cierre.
- **Proyectos:**
  - Índice de proyectos en el hero: los puntos forman cada uno y el clic abre el proyecto.
  - Galería clara con filtros; las imágenes van en grafito y muestran su color al pasar el cursor.
  - Showreel y reels en abanico, como en el inicio.
- **Nosotros:**
  - Los puntos forman el isotipo (la «a» con su punto verde).
  - Manifiesto «Quiénes somos» que se enciende palabra por palabra al leer.
  - Valores con glifos de puntos animados: la idea, la coherencia, la medida y el trato directo.
  - Luego el equipo y el cierre. Se quitó «Así trabajamos», que repetía el proceso.
- **Contacto:** el punto de la marca se arma a medida que completas el formulario. El formulario es oscuro con campos de línea; abajo, las preguntas.
- **Legales:** hero oscuro y texto en claro con un índice fijo que marca la sección que lees.

## Archivos
- `assets/ad/ad.css`: estilos.
- `assets/ad/ad.js`: entrada, recorridos, etapas y cursor.
- `assets/ad/scenes.js`: escenas WebGL.
  - `createPortal`: la entrada.
  - `field`: el campo del hero y de Planes.
  - `wave`: la ola de Servicios.
  - `idea`: «Cómo trabajamos contigo».
- `assets/ad/aplicar.py`: arma las páginas a partir de los originales de amurek.com, guardados en `assets/ad/original/`. Después de cambiar algo, sube `V` (y el `?v=` de `scenes.js` en `ad.js`) y ejecuta `python assets/ad/aplicar.py`.

## Ver en local
```
node serve.mjs 5179
```
Abre http://localhost:5179 (o http://localhost:5179/index.html?intro para ver la entrada otra vez).

## Antes de publicar
- El material de referencia (`assets/ref/`), los testimonios, las cifras y el equipo siguen igual que en amurek.com.
- La analítica de Cloudflare se quitó de esta copia. Al publicar, Cloudflare Pages la vuelve a añadir.

## Nota sobre el material de referencia
Las fotos y videos de `assets/ref/` son de otros autores y están solo como referencia temporal. Hay que reemplazarlos por material propio.
