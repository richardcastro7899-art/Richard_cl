# Landing Fundación Proyecto Sacha

Paso 1 · Dirección de arte (sin animación).

- `direccion-de-arte.html`: tablero de marca ya armado (fuentes incrustadas, imágenes en `assets/`). Se abre directo en el navegador.
- `src/direccion-de-arte.src.html`: fuente editable. `python3 build.py` regenera el HTML final.
- `css/tokens.css`: colores, tipografías, formas y tema claro/oscuro, para reutilizar en la landing.
- `assets/`: logotipos SVG (extraídos del `.ai` 2026), 5 patrones SVG, mascota, pósters, fotos de referencia y fuentes woff2.

Pendiente de confirmar: HEX oficial del menta (#C5FFE6 del manual vs #CBEFD4 usado en láminas) y licencia web de Myriad Pro.

## Paso 2 · Landing (`index.html`)

Fuente en `src/index.src.html`. Basada en el wireframe v3 con la dirección de arte aplicada.

- Videos: en el `<script>`, el objeto `VIDEOS` (hero, sacha, 8 cápsulas, 2 podcast). Vacío = reproductor de maqueta; con una ruta .mp4 usa el video real.
- Textos marcados "por confirmar": datos de Sacha, número de emergencia, direcciones, teléfono, episodios del podcast.
- Donaciones: el paso final muestra los datos de transferencia del Canva. No procesa pagos.
- Voluntariado: valida y confirma en pantalla, pero no envía datos a ningún lado todavía.
- Galería: marcos con patrones hasta tener las fotos reales.
