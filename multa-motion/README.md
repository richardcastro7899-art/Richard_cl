# Multa por activos del exterior no reportados

Motion graphic vertical hecho con [Remotion](https://www.remotion.dev) como recurso visual para la locución `public/narracion.mp3`. Mismo estilo que `../exportador-motion`.

| | |
|---|---|
| Formato | 9:16, 1080 × 1920 px, 30 fps |
| Duración | 21,89 s (657 fotogramas), igual que el audio |
| Audio | Solo efectos de sonido (sin música ni voz); variante con voz disponible |
| Salida | `out/multa-activos-sfx.mp4` (principal, solo efectos) y `out/multa-activos-sfx-con-voz.mp4` (H.264 CRF 20, AAC) |

## Dirección de arte

Collage monocromo sobre papel crema con viñeta y grano, un único acento azul (el pin de la referencia) y revelado de texto palabra por palabra con blur sincronizado a la voz.

- **Tipografía:** Plus Jakarta Sans ExtraBold (800) para palabras clave + Inter Medium (500) para apoyo. Escala fija: 46 · 96 · 120 · 170 · 210 · 240 px. Todas las líneas miden ≤ 810 px (medido con las fuentes reales) dentro de los márgenes seguros.
- **Zonas seguras (Reels/TikTok/Shorts):** contenido entre x 110–970 e y 300–1480.
- **Transiciones secuenciales:** sale primero el texto, luego el gráfico, queda un instante limpio y entra la siguiente escena. Nada se superpone. El video termina en el último fotograma, sin fundido.

## Escenas

| Tiempo | Voz | Visual |
|---|---|---|
| 0,0–2,4 s | «Si no presentas la declaración» | Documento en blanco que intenta entrar a la bandeja y rebota contra un símbolo de prohibido |
| 2,4–7,8 s | «…o si la presentas pero omites total o parcialmente esos activos» | Declaración con campos (cuentas, inversiones, inmuebles, sociedades, otros activos); sello y visto; tachados que cubren todo y luego solo parte; los tachados pasan a azul |
| 7,8–11,7 s | «…la multa será del 0,5 %» | Barra del valor total (100 %) y una lupa que amplía el primer 1 % y deja ver que la multa es solo medio punto |
| 11,7–15,1 s | «…del valor total de los activos del exterior» | Mapamundi real (Natural Earth, dominio público) con Ecuador resaltado y pines en otros países |
| 15,1–16,7 s | «…no reportados» | Ojo tachado |
| 16,7–18,6 s | «…sin que esto exceda» | Torre de monedas que choca con un techo |
| 18,6–21,9 s | «…2075 salarios básicos unificados» | Cuenta hasta 2.075 y pila de billetes SBU |

Tiempos de lectura: cada escena queda completa y quieta entre 0,4 y 1 s antes de salir; las palabras clave aparecen hasta 0,25 s antes de la voz para ganar ese margen.

## Diseño de sonido

Sin música; efectos sintetizados (`sfx/build_sfx.py` → `public/sfx.wav`) con los mismos criterios que el motion anterior: whooshes ajustados al movimiento, impactos en el fotograma exacto, una sola escala tonal y variación en cada evento. Sonidos propios de esta pieza: documento que rebota con tono descendente de «prohibido», firma, sello, tachados que cubren y se destapan, lupa con cristal y ticks de escala, llenado del 0,5 %, pines en el mapa, golpe del tachón del ojo, choque metálico de la torre con el techo, cuenta con ticks y billetes. Mezcla: -16,7 LUFS, pico -1,5 dBFS. `sfx/sfx_events.json` lista cada evento con su tiempo.

## Uso

```bash
npm install
npm run studio   # previsualización con línea de tiempo
npm run render   # exporta out/multa-activos.mp4 (CRF 16, solo efectos)
```

La composición `MultaActivosVoz` añade la locución. Si Remotion no puede descargar su navegador, añade `--browser-executable=/ruta/a/chrome-headless-shell`.

> La transcripción se hizo automáticamente («0,5 %», «2.075»). Si alguna cifra o palabra difiere de lo que dice el audio, el texto se edita en `src/scenes.tsx`.

Plus Jakarta Sans e Inter (SIL OFL 1.1) van en `public/fonts`. Datos del mapa: Natural Earth 110m (dominio público) en `src/world.json`, dibujados con `d3-geo`.
