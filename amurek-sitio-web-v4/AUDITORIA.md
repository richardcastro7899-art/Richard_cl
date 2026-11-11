# Auditoría de coherencia — AMUREK v4 (v48)

Medida en el navegador sobre los valores calculados de 6 páginas (Inicio, Servicios, Proyectos, Nosotros, Contacto, Privacidad), a 1440 px y 390 px. Herramientas: `design:design-system` (auditoría de sistema), `frontend-design` (criterio visual), `a11y-enforcer` (contraste WCAG) y comprobación responsive propia en 7 anchos.

## Resumen
| Aspecto | Antes | Después |
|---|---|---|
| Tamaños de letra distintos (escritorio) | 31 | 15 (los que quedan fuera de la escala son intencionales: logotipo con «Agencia Creativa» y el título gigante de Planes) |
| Tamaños de letra distintos (celular) | 32 | 15 |
| Tamaños de la etiqueta en mono | 3 (11,2 · 11,5 · 12 px) | 1 (12 px) |
| Tamaños de texto en botones | 3 (13,4 · 14,4 · 16 px) | 1 (14,4 px, `--t-ui`) |
| Duraciones de transición | más de 10, con curvas mezcladas | 3 velocidades (0,3 · 0,5 · 0,8 s, más 1,1 s para imágenes) con la curva de marca (81 transiciones normalizadas) |
| Aire entre secciones | 86 px / 56 px en todas | sin cambios (ya era coherente) |
| Borde de contenido | 55 px / 24 px, salvo Servicios en celular (28 px) | 55 px / 24 px en todas |
| Contraste del gris de etiquetas (`--ink-3`) | 3,4:1 (no cumple AA) | 4,7:1 (cumple AA) |
| Anillo de foco sobre paneles oscuros | 2,3:1 (casi invisible) | 14,5:1 (rosa de marca) |
| Desbordes horizontales (8 páginas × 7 anchos) | 0 | 0 |

## Correcciones
- **Títulos de sección**: todos en el mismo nivel (`--t-h2`). Antes, Servicios iba a 52 px y «Un equipo de expertos» a 78 px frente a 69 px. En portátiles de poca altura, Servicios conserva su versión compacta.
- **Títulos de página en celular**: «Nuestro Estudio» pasa de 70 px al mismo tamaño que «Servicios» y «Proyectos» (`--t-page`). La portada usa `--t-display` igual que en escritorio.
- **Textos de lectura**: citas de clientes, tarjeta de preguntas y enlaces del pie en `--t-body`; tarjeta de Nosotros en `--t-card`; lista del cierre en `--t-small`.
- **Cifras**: en `--t-h3` (antes, un tamaño propio de 40 px).
- **Formas**: el video del logotipo en Nosotros usa la esquina del isotipo de los medios grandes (antes, 8 px).
- **Botones**: el botón del cierre usa el mismo tamaño que los demás.
- **Etiquetas**: se quitó «Clientes» sobre «Lo que dicen nuestros clientes». Regla: una etiqueta solo va cuando el título no dice de qué trata la sección (se mantiene en Servicios, cuyo título es una frase de marca).

## Escala (tokens en `styles.css`)
- **Tipografía**: `--t-mono` 12 · `--t-ui` 14,4 · `--t-small` 15,2 · `--t-body` 17 · `--t-lead` 19,2 · `--t-card` 20,8 · `--t-h4` 31,7 · `--t-h3` 51,8 · `--t-h2` 69,1 · `--t-display` 77,8 · `--t-page` 118 (px a 1440; en celular cada nivel tiene su propio valor).
- **Espacio**: `--sec-gap` 86/56 · `--head-gap` · `--card-gap` 12 · `--panel-py` · borde `--edge` / `--pad-x`.
- **Formas**: paneles `--r-xl` (4 esquinas iguales) · tarjetas de texto `--r-text` 14 · fotos y videos `--r-card` / `--r-card-l` (esquina del isotipo) · controles 999 px.
- **Color**: crema `--bg` · tarjeta `--card` · tinta `--ink` / `--ink-2` / `--ink-3` · vino `--vino` · rosa `--rosa` · negro de marca `--noche` · texto sobre oscuro `--on-1/2/3`.
- **Movimiento**: `--d-1` 0,3 s · `--d-2` 0,5 s · `--d-3` 0,8 s · curva `--ease`.

## v49 — listo para publicar
- **Hoja de estilos podada**: 202 KB → 183 KB (148 selectores sin uso). Verificado con 134 capturas antes/después (9 páginas × 2 anchos): misma altura en todas las páginas, sin cambios visibles.
- **Medios de referencia**: imágenes en WebP y videos en WebM con MP4 más liviano de respaldo. `assets/ref` 7,5 MB → 5,1 MB; videos de marca de 1,2 MB a 0,23 MB en WebM.
- **Buscadores y redes**: canonical, Open Graph con imagen 1200×630, tarjeta para X, datos estructurados (ProfessionalService), `sitemap.xml`, `robots.txt`, íconos 180/512 y página 404.
- **Cookies**: aviso con «Aceptar todas», «Solo necesarias» y «Configurar» (necesarias, análisis, marketing); la elección se guarda y se cambia desde el pie. Nada de análisis o marketing se carga sin permiso.
- **Textos alternativos**: revisados. Las imágenes decorativas o que repiten el texto de al lado van con `alt=""` (correcto para lectores de pantalla); retratos, galería y visor llevan descripción.

## Pendiente (no se cambió)
- **Contenido de referencia**: testimonios, cifras, tres miembros del equipo e imágenes de `assets/ref` son de referencia.
