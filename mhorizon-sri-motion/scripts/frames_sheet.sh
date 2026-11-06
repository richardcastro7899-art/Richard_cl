#!/bin/bash
# uso: scripts/frames_sheet.sh video.mp4 out.png f1 f2 ...   (hoja de contacto, 8 columnas, 270x480 por cuadro)
v=$1; o=$2; shift 2
sel=""; for f in "$@"; do sel+="eq(n\,$f)+"; done
n=$#; cols=8; rows=$(( (n+cols-1)/cols ))
ffmpeg -v error -y -i "$v" -vf "select='${sel%+}',scale=270:480,tile=${cols}x${rows}" -frames:v 1 -vsync 0 "$o"
