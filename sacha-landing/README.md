# Landing Fundación Proyecto Sacha

Paso 1 · Dirección de arte (sin animación).

- `direccion-de-arte.html`: tablero de marca ya armado (fuentes incrustadas, imágenes en `assets/`). Se abre directo en el navegador.
- `src/direccion-de-arte.src.html`: fuente editable. `python3 build.py` regenera el HTML final.
- `css/tokens.css`: colores, tipografías, formas y tema claro/oscuro, para reutilizar en la landing.
- `assets/`: logotipos SVG (extraídos del `.ai` 2026), 5 patrones SVG, mascota, pósters, fotos de referencia y fuentes woff2.

Pendiente de confirmar: HEX oficial del menta (#C5FFE6 del manual vs #CBEFD4 usado en láminas) y licencia web de Myriad Pro.

## Paso 2 · Landing (`index.html`) · «Todos los días los ves. ¿Los reconoces?»

Fuente en `src/index.src.html`. Todo el contenido editable (textos, ejes de cápsulas, pasos, mitos, especies, datos de donación) está en el bloque `CONTENIDO EDITABLE` del script.

Decisiones que salen del brief y la entrevista con la directora (Drive: INTEGRADORA - PROYECTO SACHA):
- La gente no reconoce la fauna urbana y cree que el rescate termina al entregar al animal: hero «reconocer», sección de especies y de proceso.
- Creen que Sacha está en la Amazonía: bloque «Estamos en Guayaquil».
- No hay voluntariado externo (seguridad, animales de allanamientos): el formulario es de convenios con universidades.
- El WhatsApp es interno y no sirve como línea pública: el canal de reporte queda por definir.
- Presupuesto operativo anual de $350.000: se usa como argumento de donación.
- Estética tomada de «Referencias narrativas Sacha»: macro y fondo verde bosque, dato hecho imagen (pixel), Sacha solo como guía.

Videos: objeto `VIDEOS` (vacío = reproductor de maqueta). Fotos: rutas en `SPECIES`. Las fotos de rana, serpiente y ocelote son de referencia del manual y deben reemplazarse por fotos de especies locales.
Donaciones y convenios son maqueta: no procesan pagos ni envían datos.
