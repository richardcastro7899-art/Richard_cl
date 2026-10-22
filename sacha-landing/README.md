# Landing Fundación Proyecto Sacha

Paso 1 · Dirección de arte (sin animación).

- `direccion-de-arte.html`: tablero de marca ya armado (fuentes incrustadas, imágenes en `assets/`). Se abre directo en el navegador.
- `src/direccion-de-arte.src.html`: fuente editable. `python3 build.py` regenera el HTML final.
- `css/tokens.css`: colores, tipografías, formas y tema claro/oscuro, para reutilizar en la landing.
- `assets/`: logotipos SVG (extraídos del `.ai` 2026), 5 patrones SVG, mascota, pósters, fotos de referencia y fuentes woff2.

Pendiente de confirmar: HEX oficial del menta (#C5FFE6 del manual vs #CBEFD4 usado en láminas) y licencia web de Myriad Pro.

## Paso 2 · Landing (`index.html`) · propuesta 5: «Sigue a Sacha»

Fuente en `src/index.src.html`, que incluye `src/index/style.css`, `src/index/body.html` y `src/index/app.js` (`python3 build.py` los une). Todo el contenido editable (videos, mazo del inicio, quiz, guía de acción, historias, cifras, fuentes, fauna, donación) está en el bloque `CONTENIDO EDITABLE` de `app.js`.

Fondo: claro (crema) como base y oscuro solo como «modo cine» en Videos y en el quiz. Razones: el logo principal del manual es dorado sobre crema; la mascota 3D y los patrones se leen mejor sobre colores planos claros; los estados del tablero (arena, menta, terracota, selva) necesitan un fondo neutro para distinguirse; los formularios y la guía de rescate son más legibles en claro; y el video luce mejor sobre oscuro, como en las plataformas de streaming. El tema oscuro del sistema también está diseñado.

Concepto: cada sección es un estado del tablero («un estado, un color») y Sacha acompaña el recorrido con el gesto que corresponde. Bordes ondulados entre secciones (la franja de las láminas), títulos en dos tonos y textura de pelaje en palabras clave.

Interacciones: mazo de cápsulas en el inicio (rota solo, se toca para abrir, la primera es el tráiler en movimiento) con Sacha comentando cada una; la palabra «reconoces» cambia de piel; los ojos de las dos A del logo siguen el puntero (`build.py` deja las pupilas movibles con `--px/--py`); barra de progreso con huella; carrusel de cápsulas con inclinación 3D y visor tipo historia; reproductor horizontal; quiz «¿Mito o realidad?» con Sacha reaccionando y resultado para compartir; guía «Encontré un animal» con reporte; recorrido del rescate con Sacha caminando sobre la línea al hacer scroll; historias reales con «Apadrinar»; mapa real; donación con deslizador y equivalencia en tiempo de operación. Todo se calma con «reducir movimiento».

Referencias de organización: Sheldrick Wildlife Trust (apadrinar y seguir historias), The Marine Mammal Center (recorrido del paciente y avisos de liberación) y Jaguar Rescue Center (cifras de impacto y adopción simbólica).

Datos reales (con fuente en la página): Sacha es un ocelote rescatado en junio de 2018 en Vinces; +3.500 animales desde 2018 (Expreso, cifra de 2023); ~1.100 auxiliados en 2022; centro en Chanduy, Santa Elena (proyectado). Del Drive de INTEGRADORA: presupuesto de $350.000 al año, sin voluntariado externo, WhatsApp interno.

Por confirmar con la fundación: línea pública de reportes, dirección y horario de ambas sedes, ubicación exacta del centro rural (el mapa muestra una zona referencial), fuente del 61 % de zarigüeyas atropelladas, estado del centro de Chanduy, cuenta bancaria, usuario de redes y si se ofrecerá apadrinamiento.

Reemplazos pendientes: el tráiler se generó a partir de una imagen de referencia (no es fauna local ni material de la fundación); las fotos del tablero de arte son de referencia. Cápsulas, videos horizontales, podcast y galería son de maqueta hasta cargar el material. Reporte, avisos, donaciones y convenios no envían datos ni procesan pagos.

## Propuesta alternativa (`propuesta-24h.html`) · «24 horas en Guayaquil»

Fuente en `src/propuesta-24h.src.html` + `src/b/{style.css,body.html,app.js}`. Al bajar pasa un día: el cielo de la página se funde de crema (06:00) a menta, arena, terracota (18:00), selva (20:30) y bosque (00:00 y 04:00), y vuelve a amanecer en el pie. Un reloj flotante muestra la hora y cuánto cuesta el día hasta ese momento ($350.000 ÷ 8.760 h ≈ $40 por hora). Cada hora muestra la fauna activa, lo que hace el equipo en ese momento y su cápsula: madrugadores (08:00), quirófano y quiz (12:00), traslado con camioneta que recorre el mapa (15:00), liberación e historias reales (18:00), fauna nocturna y guía «Encontré un animal» (20:30), cine con todas las cápsulas y videos horizontales (00:00), y donación «Cubre horas del próximo día» con un reloj de 24 segmentos (04:00). La cabecera es una línea de horas para saltar a cualquier momento. Es un mundo visual propio (día y noche), por eso no cambia con el tema del sistema.

## Propuesta institucional (`propuesta-institucional.html`) · estilo editorial

Fuente en `src/propuesta-institucional.src.html` + `src/d/{style.css,body.html,app.js}`. Lenguaje de informe de una fundación: papel crema y tinta bosque, líneas finas, secciones numeradas con rótulo fijo a la izquierda, datos con fuente y mucha jerarquía tipográfica (Oktah Round en peso 700, Myriad en textos). El color es información: terracota solo para lo urgente, dorado como acento, menta y arena de apoyo. La textura de pelaje queda en las cifras y los números de sección; Sacha tiene roles fijos (embajadora en la portada dentro de un arco, guía en el reporte, origen de la historia, llamada a ayudar y pie). Funciona en tema claro y oscuro.

Orden: portada con tráiler y cifras → 01 Videos (sala con video principal y lista, cápsulas verticales con visor tipo historia y podcast de YouTube) → 02 Qué hacemos (protocolo en cuatro etapas con línea que avanza al hacer scroll) → 03 Reportar (guía y formulario) → 04 Nosotros (historia real, línea de tiempo y mapa) → 05 Guía de campo (tabla filtrable, mitos y preguntas) → 06 En la prensa → 07 Transparencia y apoyo (presupuesto, qué cubre, donación y convenios) → 08 Redes. Cada video muestra «Seguir en [red]» y, al terminar, una tarjeta que lleva a esa red. Animaciones: titulares que suben por líneas, líneas finas que se dibujan, cifras que cuentan, video que se acerca con el scroll, lista y filas con barra que se desliza, ojos del logo que siguen el cursor. Todo se calma con «reducir movimiento».

Nota técnica: el podcast se incrusta con `youtube-nocookie.com`; las vistas previas de artefactos bloquean iframes externos, así que allí no se ve incrustado, pero en un sitio publicado sí.

## Propuesta «esencia» (`propuesta-esencia.html`) · wireframe + dirección de arte + ánimos de Sacha
Sigue los bloques del wireframe (hero con video en bucle, hilo narrativo por capítulos, Sacha y mapa, cápsulas, proceso, podcast, participa, redes) y usa la dirección de arte sin cambios: paleta, Oktah Round + Myriad, patrones de pelaje en numerales, láminas con fondo de estado y colina, mascota y logo con ojos.
- **Capítulos**: 01 Sacha (dato interactivo + video + mapa de sedes), 02 Cápsulas (reproductor vertical, 8 en 3 ejes, autoplay), 03 Proceso (4 pasos, qué hacer / qué no hacer, guía de reporte bajo demanda, preguntas), 04 Podcast (YouTube incrustado), 05 Participa (donación + convenios), epílogo de redes.
- **Cambios frente al wireframe**: voluntariado → convenios (la fundación no recibe voluntarios externos); la galería «Detrás de escena» queda fuera hasta tener fotos reales del equipo.
- **Código**: `src/e/` (`body.html`, `style.css`, `app.js`). Contenido editable al inicio de `app.js` (`VIDEOS`, `PODCAST`, `NETS`, textos).

### Ánimos de Sacha (`animos-de-sacha.html`)
Diez estados de la mascota usados como estados de la interfaz (triste sin donación → alegre con monto → agradecida al donar; alerta en reportes; dormida en episodios por publicar…). Cada ánimo = pose del manual/turnaround (`assets/mascot/`) + expresión retocada (`tools/mascot_expresiones.py`) + gesto vectorial en la paleta + movimiento corto. Definidos en `src/e/moods.{js,css}`; usar con `sacha('alerta',{h:'200px'})`. PNG transparentes de cada ánimo en `assets/mascot/animos/`.
Son variantes sobre el render existente, no ilustraciones 3D nuevas: para más expresiones conviene un ilustrador 3D.

## Propuesta «bento» (`propuesta-bento.html`) · referencia de conservación
Adapta la composición de una referencia (portada oscura con foto grande a la derecha, barra de acción, cifras con íconos, cuadrícula de bloques claros y oscuros con foto, franja de valores, llamado final a ancho completo) a la marca Sacha: paleta, Oktah Round + Myriad, patrones, colinas de las láminas y mascota (en la esquina derecha del hero) se mantienen.
- **Barra de acción del hero**: «¿Qué pasa? / ¿Qué animal?» abre la guía de reporte ya con la selección hecha (en la referencia era un buscador de especies).
- **Bloques**: fauna por grupo (cada tarjeta abre la guía), misión, apoyo, cómo ayudar, Sacha, video y podcast, cápsulas, proceso, preguntas, mapa, donación, convenios, newsletter y redes.
- **Esquinas**: 18 px en tarjetas y 14 px en piezas internas (tokens `--r-card`, `--r-lg`, `--r-md` en `src/f/style.css`); los botones siguen en píldora y las láminas conservan la colina.
- **Código**: `src/f/` (`body.html`, `style.css`, `app.js`), sobre `src/e/` (reproductores, reporte, mapa, donación) y `src/e/moods.*`. Las tres fotos son de referencia, no de la fundación.
