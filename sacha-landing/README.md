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
