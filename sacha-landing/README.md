# Landing Fundación Proyecto Sacha

Paso 1 · Dirección de arte (sin animación).

- `direccion-de-arte.html`: tablero de marca ya armado (fuentes incrustadas, imágenes en `assets/`). Se abre directo en el navegador.
- `src/direccion-de-arte.src.html`: fuente editable. `python3 build.py` regenera el HTML final.
- `css/tokens.css`: colores, tipografías, formas y tema claro/oscuro, para reutilizar en la landing.
- `assets/`: logotipos SVG (extraídos del `.ai` 2026), 5 patrones SVG, mascota, pósters, fotos de referencia y fuentes woff2.

Pendiente de confirmar: HEX oficial del menta (#C5FFE6 del manual vs #CBEFD4 usado en láminas) y licencia web de Myriad Pro.

## Paso 2 · Landing (`index.html`) · propuesta 4: videos primero, con la esencia del tablero

Fuente en `src/index.src.html`, que incluye `src/index/style.css`, `src/index/body.html` y `src/index/app.js` (`python3 build.py` los une). Todo el contenido editable (videos, cápsulas, guía de acción, historias, cifras, fuentes, fauna, datos de donación) está en el bloque `CONTENIDO EDITABLE` de `app.js`.

Lenguaje visual (del tablero de arte): base crema, colina arena, arco verde selva, mancha menta, isla terracota; láminas «Todo sobre…» con patrón arriba, franja ondulada y título en dos tamaños; títulos en dos líneas (verde y dorado); Sacha en cuatro gestos con su color de estado: saluda (inicio, nosotros), rescate/urgente (guía de acción, terracota), dato de fauna (guía de campo, verde y menta) y donaciones (menta). Los recortes `assets/mascot/sacha-{rescate,dato,donar}.webp` salen de los pósters del manual.

Orden, inspirado en cómo organizan su web centros como Sheldrick Wildlife Trust (historias de animales que se pueden apadrinar), The Marine Mammal Center (recorrido del paciente, avisos de liberación, video en vivo) y Jaguar Rescue Center (cifras de impacto y adopción simbólica):
1. **Inicio** con tráiler sin audio en un marco, Sacha saludando sobre la colina y accesos a videos y a la guía de rescate. Cifras que cuentan al aparecer.
2. **Videos** (lo más visible): carrusel de cápsulas verticales con filtros por eje que abre un visor tipo historia (avance automático, toques, flechas, pausa, compartir) y reproductor horizontal con lista (historia, tráiler, podcast).
3. **Encontré un animal**: guía en 4 pasos con lista marcable, qué evitar y reporte con foto opcional y «Copiar reporte».
4. **El recorrido de un rescate** con línea que avanza al hacer scroll, cada paso enlazado a su cápsula, y suscripción a avisos de liberación.
5. **Historias de rescate** (casos reales de prensa) con «Apadrinar», **Galería**, **Nosotros** (ficha de Sacha, historia real, línea de tiempo y mapa cartográfico), **Fauna** (láminas, mitos que giran, preguntas), **Donar** (única, mensual o apadrinar, con equivalencia en tiempo de operación) y **Redes**.

Animación: entradas al hacer scroll, Sacha que se balancea y asoma en cada sección, globo de diálogo, conteo de cifras, láminas que se desplazan al pasar el cursor, ruta del mapa y pines, mitos que giran. Todo se desactiva con «reducir movimiento».

Datos reales (con fuente en la página): Sacha es un ocelote rescatado en junio de 2018 en Vinces; +3.500 animales desde 2018 (Expreso, cifra de 2023); ~1.100 auxiliados en 2022; centro en Chanduy, Santa Elena (proyectado). Del Drive de INTEGRADORA: presupuesto de $350.000 al año, sin voluntariado externo, WhatsApp interno.

Por confirmar con la fundación: línea pública de reportes, dirección y horario de ambas sedes, ubicación exacta del centro rural (el mapa muestra una zona referencial), fuente del 61 % de zarigüeyas atropelladas, estado del centro de Chanduy, cuenta bancaria, usuario de redes y si se ofrecerá apadrinamiento.

Reemplazos pendientes: el tráiler se generó a partir de una imagen de referencia (no es fauna local ni material de la fundación); las fotos del tablero de arte son de referencia. Cápsulas, videos horizontales, podcast y galería son de maqueta hasta cargar el material. Reporte, avisos, donaciones y convenios no envían datos ni procesan pagos.
