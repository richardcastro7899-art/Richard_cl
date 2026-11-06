#!/bin/bash
# Renderiza TODAS las exportaciones de MHORIZON. Uso: bash scripts/render-all.sh [master|scenes|alpha|all]
# Opcional: export BROWSER=/ruta/a/chrome-headless-shell  (si Remotion no puede descargar su navegador)
set -euo pipefail
cd "$(dirname "$0")/.."
WHAT=${1:-all}
BARG=""; [ -n "${BROWSER:-}" ] && BARG="--browser-executable=$BROWSER"
R="npx remotion render"
FRAMES=1211; DUR=$(python3 -c "print(1211/30)")
mkdir -p out/video out/scenes out/alpha out/tmp

if [ "$WHAT" = all ] || [ "$WHAT" = master ]; then
  npx tsx scripts/build-sfx.ts                                    # síntesis + pista WAV + stems
  $R Master out/tmp/master_raw.mp4 --codec=h264 --crf=16 --pixel-format=yuv420p --audio-codec=aac --audio-bitrate=320k $BARG
  # Master: se recorta el audio a la duración exacta del video (1211 fotogramas) sin recodificar
  ffmpeg -v error -y -i out/tmp/master_raw.mp4 -map 0:v -map 0:a -c copy -t $DUR -movflags +faststart out/video/MHORIZON_Motion_Master_SFX.mp4
  # Silent: mismo flujo de video, sin pista de audio
  ffmpeg -v error -y -i out/video/MHORIZON_Motion_Master_SFX.mp4 -map 0:v -c:v copy -an -movflags +faststart out/video/MHORIZON_Motion_Silent.mp4
fi

if [ "$WHAT" = all ] || [ "$WHAT" = scenes ]; then
  for i in 01 02 03 04 05 06 07 08 09; do
    $R Scene$i out/tmp/Scene${i}_silent.mp4 --codec=h264 --crf=16 --pixel-format=yuv420p --muted $BARG
    ffmpeg -v error -y -i out/tmp/Scene${i}_silent.mp4 -i out/audio/scenes/Scene${i}_SFX.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -shortest -movflags +faststart out/scenes/MHORIZON_Scene${i}_SFX.mp4
    cp out/tmp/Scene${i}_silent.mp4 out/scenes/MHORIZON_Scene${i}_Silent.mp4
  done
fi

if [ "$WHAT" = all ] || [ "$WHAT" = alpha ]; then
  for i in 01 02 03 04 05 06 07 08 09; do
    $R Scene$i-Alpha out/alpha/MHORIZON_Scene${i}_Alpha.mov --codec=prores --prores-profile=4444 --pixel-format=yuva444p10le --image-format=png --muted $BARG
  done
fi
echo "Render completo."
