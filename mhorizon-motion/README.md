# MHORIZON · Revisar antes de solicitar

Motion graphic vertical para la cápsula tributaria de MHORIZON, hecho con [Remotion](https://www.remotion.dev).

| | |
|---|---|
| Formato | 9:16, 1080 × 1920 px |
| Duración | 17 s exactos (510 fotogramas a 30 fps) |
| Audio | Ninguno |
| Salida | `out/mhorizon-revisar-antes-de-solicitar.mp4` (H.264, yuv420p, CRF 16) |

## Escenas

| Tiempo | Fotogramas | Contenido |
|---|---|---|
| 0–4 s | 0–119 | Documentación: tarjetas «Declaraciones tributarias» y «Soportes contables» |
| 4–9 s | 120–269 | Proceso de revisión: conexiones al núcleo, recorrido naranja, lupa e indicadores |
| 9–13 s | 270–389 | Evaluación de saldos: el núcleo se transforma en la tarjeta de saldos (sin montos) |
| 13–17 s | 390–509 | «REVISAR ANTES DE SOLICITAR», legible del fotograma 430 al 494 (2,1 s); el último fotograma queda en fondo liso |

Todo el texto importante se mantiene entre x 110–970 y y 300–1480 (zonas seguras de Reels y TikTok).

## Uso

```bash
npm install
npm run studio   # previsualización interactiva con línea de tiempo
npm run render   # exporta el MP4 a out/
```

Si Remotion no puede descargar su navegador, añade `--browser-executable=/ruta/a/chrome-headless-shell` al comando de render.

`preview.html` reproduce el MP4 renderizado con controles de reproducción, reinicio, avance por fotograma y salto por escena.

La tipografía Inter (SIL OFL 1.1) va incluida en `public/fonts` para que el render no dependa de la red.
