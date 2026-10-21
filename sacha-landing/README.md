# Landing Fundación Proyecto Sacha

Paso 1 · Dirección de arte (sin animación).

- `direccion-de-arte.html`: tablero de marca ya armado (fuentes incrustadas, imágenes en `assets/`). Se abre directo en el navegador.
- `src/direccion-de-arte.src.html`: fuente editable. `python3 build.py` regenera el HTML final.
- `css/tokens.css`: colores, tipografías, formas y tema claro/oscuro, para reutilizar en la landing.
- `assets/`: logotipos SVG (extraídos del `.ai` 2026), 5 patrones SVG, mascota, pósters, fotos de referencia y fuentes woff2.

Pendiente de confirmar: HEX oficial del menta (#C5FFE6 del manual vs #CBEFD4 usado en láminas) y licencia web de Myriad Pro.

## Paso 2 · Landing (`index.html`) · propuesta 3: primero la función

Fuente en `src/index.src.html`, que incluye `src/index/style.css`, `src/index/body.html` y `src/index/app.js` (`python3 build.py` los une). Todo el contenido editable (textos, guía de acción, cifras, fuentes, ejes de videos, pasos, mitos, fauna, datos de donación) está en el bloque `CONTENIDO EDITABLE` de `app.js`.

Qué hace la página (en orden de importancia):
1. **Encontré un animal**: guía en 4 pasos (situación → tipo de animal → qué hacer con lista marcable y qué evitar → formulario de reporte con foto opcional y «Copiar reporte»). Números útiles con botón de copiar.
2. **Donar**: frecuencia, monto, equivalencia en minutos de operación calculada con los $350.000 anuales, datos de transferencia con copiar, convenios con universidades.
3. **Videos** (reproductor vertical con ejes, autoplay y compartir), **El rescate**, **Galería** con visor, **Nosotros** (historia real de Sacha con fuentes, línea de tiempo y mapa cartográfico real con pines), **Fauna** (guía de campo con enlace a la guía de acción), mitos, preguntas y fuentes, **Podcast** y **Redes**.
4. Inicio con video de fondo sin audio (`VIDEOS.hero`, lista de formatos; botón de pausa; sin autoplay si el sistema pide menos movimiento) y la mascota como guía: invita desde el inicio y cambia su mensaje en cada paso de la guía.

Criterio visual: base crema + verde bosque, arena como único acento y terracota solo para lo urgente. La textura de pelaje queda en el titular del inicio, en las cifras y en los numerales; en fondos claros usa variantes en tono (`tools/tone_patterns.py` genera `assets/patterns/tone-*.svg`). El sitio no menciona la estrategia de comunicación detrás de las redes.

Datos reales (con fuente en la página): Sacha es un ocelote rescatado en junio de 2018 en Vinces; +3.500 animales desde 2018 (Expreso, cifra de 2023); ~1.100 auxiliados en 2022; centro en Chanduy, Santa Elena (proyectado). Del Drive de INTEGRADORA: presupuesto de $350.000 al año, sin voluntariado externo, WhatsApp interno.

Por confirmar con la fundación: línea pública de reportes, dirección y horario de ambas sedes, ubicación exacta del centro rural (el mapa muestra una zona referencial), fuente del 61 % de zarigüeyas atropelladas, estado del centro de Chanduy, cuenta bancaria y usuario de redes.

Reemplazos pendientes: el video de fondo del inicio se generó a partir de una imagen de referencia (no es fauna local ni material de la fundación); las fotos de rana, serpiente y ocelote del tablero de arte son de referencia. Videos, podcast y galería son reproductores y marcos de maqueta. Reporte, donaciones y convenios no envían datos ni procesan pagos.
