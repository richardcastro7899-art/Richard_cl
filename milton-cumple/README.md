# Cumpleaños de Milton · video motion graphic (Remotion)

Felicitación animada de la familia y MHORIZON. Proyecto [Remotion](https://www.remotion.dev) (React + TypeScript).

| | |
|---|---|
| Formato | **horizontal 16:9, 1920 × 1080 px** |
| Duración | 105 s (3150 fotogramas a 30 fps) |
| Salida | `out/milton-cumpleanos.mp4` · H.264 (CRF 16, yuv420p) + AAC 320 kb/s |
| Fotos | 31 (todas aparecen; `public/fotos/p00…p30.jpg`) |
| Música | original, instrumental, sintetizada con código (`tools/make_audio.py`); sin voces ni muestras de terceros → sin licencias que atribuir |
| Dirección de arte | álbum / scrapbook: polaroids con cinta sobre papel cálido y pizarra carbón, trazos dibujados a mano, textos que se escriben |
| Tipografía | **Fraunces** (serif suave, frases y ruleta) + **Caveat Brush** / **Caveat** (letra a mano). Licencia OFL, incluida en `public/fonts` |
| Paleta | papel `#EDE6D9` · tinta `#2B2A27` · carbón `#25282C` · terracota `#B5593A` / `#E8946A` · mostaza `#D2A24C` · salvia `#8F9F8A` · azul polvo `#7C90A4` |

## Guion visual

| Tiempo | Escena |
|---|---|
| 0:00–0:07 | **Ruleta de los meses** (sobre pizarra): tambor con proyección cilíndrica, motion blur por muestreo temporal (16 muestras), aceleración y frenada con curva bézier; clics sincronizados; se detiene exactamente en **OCTUBRE**, que se ilumina en terracota; un anillo expansivo descubre el papel |
| 0:07–0:14 | **Carrusel diagonal 3D**: 20 polaroids entran desde las esquinas y recorren la pantalla de abajo-izquierda a arriba-derecha en capas de profundidad, con desenfoque de profundidad, sombras y cámara virtual |
| 0:14–0:21 | **Selección**: la foto #04 queda rodeada por un marco dibujado a mano, avanza al frente en 3D; el resto se aparta y se desvanece. «Feliz cumpleaños» se escribe carácter a carácter y «¡MILTON!» entra en letra de pincel con subrayado, globos y regalo dibujados y confeti de papel |
| 0:21–1:31 | **Recuerdos**: 22 planos (individuales, dúos y tríos). Lenguaje de movimiento coherente: las polaroids se *colocan* sobre la mesa (caen, deslizan o se posan con rotación) y se *retiran* (barrido o elevación); los dúos intercambian posiciones; el fondo alterna papel ↔ pizarra con un círculo que se expande. 4 frases escritas letra a letra con subrayado a mano |
| 1:31–1:45 | **Cierre**: mosaico de 12 polaroids que se aleja, mensaje final sobre papel, «¡Feliz cumpleaños!» en letra de pincel sobre pizarra, firma de la familia y el equipo de MHORIZON, logotipo original y fundido a carbón |

Orden de capítulos: Recuerdos (graduación, infancia) → Familia → Aventuras → Sonrisas → Equipo.

## Uso

```bash
npm install
npm run studio                     # previsualización interactiva con línea de tiempo
npm run render                     # exporta out/milton-cumpleanos.mp4
node tools/stills.mjs 19.5 20.2    # fotogramas sueltos (segundos) → out/stills/
```

En entornos sin Chrome descargable, `remotion.config.ts` apunta al `chrome-headless-shell` local; cámbialo si hace falta.

## Estructura

- `src/core.ts` – easing, línea de tiempo, plan de planos (`SHOTS`), matemática de la ruleta. Es TypeScript puro: lo usa también el audio.
- `src/Roulette.tsx` · `Intro.tsx` · `Shots.tsx` · `Closing.tsx` – escenas; `common.tsx` (escenario, polaroid, cinta), `doodles.tsx` (garabatos, subrayados, marco a mano).
- `tools/events.mjs` → `tools/events.json`: exporta los eventos de la animación (clics de la ruleta, inicio de planos, palabras…).
- `tools/make_audio.py` – compone y mezcla la música y los efectos a partir de esos eventos (`python3 tools/make_audio.py out/milton_music.wav`, luego `ffmpeg … public/audio/milton-cumple.mp3`).
- `public/logo-mhorizon.svg` – logotipo original de MHORIZON (copiado sin modificar de `Mhorizon/frontend/public/images/LOGOTIPO.svg`).

## Notas

- `public/tex/*.jpg` – texturas de papel y pizarra generadas proceduralmente (sin imágenes de terceros).
- Las fotos originales (WhatsApp, máx. 1280 px) no se re-escalan ni se retocan; los tamaños de visualización limitan el sobre-escalado de las más pequeñas (#08, #13, #22).
- Para cambiar el orden o la duración de los planos, edita `SHOTS` en `src/core.ts`, ejecuta `node tools/events.mjs` y regenera el audio para mantener la sincronía.
