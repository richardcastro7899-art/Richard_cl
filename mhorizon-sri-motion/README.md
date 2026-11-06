# MHORIZON · «Pérdidas ≠ sin obligaciones» — motion graphic 9:16 (versión final minimalista, fondo blanco, con voz)

> **Entregable vigente:** `out/final/MHORIZON_Final.mp4` (1080×1920, MP4, con voz + efectos de fondo). Se renderiza con `npx remotion render Final out/final/MHORIZON_Final.mp4`. Las secciones siguientes describen la primera versión (oscura, sin voz); el sistema de timing y sonido es el mismo.

## Versión anterior

Producción hecha **íntegramente con [Remotion](https://www.remotion.dev)** (React + TypeScript + SVG animado + interpolaciones y curvas propias), con síntesis de audio original y FFmpeg para mezcla/exportación.

| | |
|---|---|
| Formato | vertical 9:16 · 1080 × 1920 · 30 fps |
| Duración | **1211 fotogramas = 40,3667 s** (la locución de referencia dura **40,359125 s**; diferencia +7,5 ms, menos de un fotograma) |
| Pista de efectos (WAV) | **exactamente 40,359125 s** (1 937 238 muestras a 48 kHz) |
| Audio exportado | solo efectos de sonido · **sin voz, sin música** |
| Tipografía | Inter (SIL OFL, incluida en `public/fonts`) |
| Paleta | `#171E27` azul · `#D4681C` naranja · blanco cálido y grises |

> **La locución es solo referencia temporal.** Está en `public/reference/voz_referencia.mp3` únicamente para la composición auxiliar `AUX-SyncConVoz-NO-EXPORTAR`. Ningún script de exportación la utiliza y ningún archivo entregado la contiene (ver «Control de calidad»).

## Entregables (`out/`)

| Archivo | Contenido |
|---|---|
| `video/MHORIZON_Motion_Master_SFX.mp4` | Las 9 escenas + efectos de sonido (H.264 CRF 16 + AAC 320 kb/s). Sin voz |
| `video/MHORIZON_Motion_Silent.mp4` | Mismo video, sin pista de audio |
| `audio/MHORIZON_Sound_Design.wav` | Solo efectos · PCM 24-bit · 48 kHz · estéreo · empieza en 0 s |
| `audio/stems/*.wav` | Una pista por categoría: Transitions, Text animations, UI interactions, Impacts, Graphic movements, Brand sound |
| `audio/scenes/SceneNN_SFX.wav` | Efectos de cada escena (cada archivo empieza en 0) |
| `../analysis/voice_words.json` | Marcas de tiempo por palabra de la locución (análisis local) |
| `../analysis/sfx_events.csv` | Tabla de los eventos sonoros (id, categoría, fotograma, duración, volumen, fades, elemento visual) |

## Cómo abrir y renderizar

```bash
npm install
npm run studio          # previsualización con línea de tiempo (composiciones abajo)
npm run sfx             # (re)genera efectos, índice y pistas WAV en out/audio
bash scripts/render-all.sh          # todo en MP4: master, silent y 9 escenas
bash scripts/render-all.sh master   # solo master + silent (+ sfx)
bash scripts/render-all.sh scenes   # 9 escenas MP4
bash scripts/render-all.sh alpha    # (opcional, no incluido en «all») 9 escenas ProRes 4444 con transparencia
```

Si Remotion no puede descargar su navegador: `export BROWSER=/ruta/a/chrome-headless-shell`.

Composiciones: `Master` (visual + SFX), `Silent`, `Scene01…09`, `Scene01-Alpha…09-Alpha` y `AUX-SyncConVoz-NO-EXPORTAR` (auxiliar de revisión con voz; **no exportar**).

## Estructura

```
src/timing.ts        TIMELINE MAESTRO: escenas y cues (frames) derivados de la locución
src/Main.tsx         ensamblaje: fondo, cámara 2.5D, línea de horizonte, héroe y 9 escenas
src/Hero.tsx         trazo "héroe" persistente que se transforma por morphing de escena a escena
src/scenes/          Scene01…09 (SVG + tipografía cinética) · layout.ts (geometría compartida)
src/lib/             animación (curvas, keyframes, splines), geometría (morph), texto, escenario 3D, UI
src/lib/camera.ts    cámara 2.5D continua (Catmull-Rom) + vibración en impactos
src/sfx/synth.ts     motor de síntesis (ruido filtrado, osciladores, FM, envolventes, reverb)
src/sfx/manifest.ts  SISTEMA DE SOUND DESIGN: lista de eventos sonoros por fotograma
src/Sound.tsx        <Audio> por evento, agrupados por categoría (sin locución)
scripts/             build-sfx.ts · render-all.sh · stills/sheet/frames_sheet · null_test.py
```

### Concepto visual
Un único trazo naranja recorre toda la pieza: **línea de rendimiento → señal de advertencia → ≠ → anillo (cero / nodo / sello) → ≠ → horizonte con sol naciente**. La interfaz de la escena 1 se contrae hasta convertirse en la **línea de horizonte** (alusión a MHORIZON), que actúa como suelo, divisor y finalmente marca. Las transiciones son distintas en cada cambio de escena (morphing de trazos, colapso de interfaz, retracción hacia el centro, paneles que se separan, tarjetas que se convierten en documentos, documentos que se vuelven bandas tipográficas, convergencia a la marca).

### Cómo se sincroniza
`src/timing.ts` contiene el inicio de cada escena (= final de cada pausa detectada en el MP3: 5,354 · 7,936 · 13,808 · 15,446 · 22,007 · 26,952 · 31,193 · 36,049 s) y los *cues* por palabra (p. ej. «pérdidas» 0,96 s → fotograma 29). La animación y el sonido leen **las mismas constantes** (`Q`), de modo que cualquier ajuste mueve ambos a la vez.

### Cómo editar el sound design
Cada evento en `src/sfx/manifest.ts` tiene: `id`, receta de síntesis + parámetros, fotograma de sincronía (`sync`), `lead` (segundos del sonido anteriores al golpe visual), duración, volumen, fade in/out, categoría y elemento visual asociado. Tras editar: `npm run sfx` y volver a renderizar. Todos los sonidos son **originales (síntesis)**: no se usan muestras de terceros, por lo que no hay licencias que verificar. Nivel moderado: ≈ −27 LUFS integrados, pico ≈ −7,7 dBFS (hay margen para la voz).

### Logotipo
No se proporcionó el logotipo oficial, así que **no se reconstruyó**: el cierre usa un tratamiento tipográfico provisional «MHORIZON». Para integrarlo, coloca el archivo en `public/brand/` y define `LOGO_SRC = staticFile('brand/logo.svg')` en `src/brand.ts`.

### Notas
- Three.js no era necesario: la profundidad 2.5D se resuelve con la perspectiva CSS 3D de Remotion (capas con `translateZ`, cámara con `rotateX/Y/Z`).
- Los textos/valores de las escenas son exactamente los del guion; los gráficos son ilustrativos y **no contienen cifras ni cálculos inventados**.
- `public/sfx/` se regenera con `npm run sfx` (determinista).
