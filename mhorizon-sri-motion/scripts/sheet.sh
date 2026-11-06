#!/bin/bash
# uso: scripts/sheet.sh out.png f1 f2 f3 f4 ...  (une frames de out/tmp/f_N.png en una hoja de contacto de 4 columnas)
cd "$(dirname "$0")/.."
out=$1; shift
inputs=(); n=0
for fr in "$@"; do inputs+=(-i out/tmp/f_$fr.png); n=$((n+1)); done
cols=4; [ $n -lt 4 ] && cols=$n
rows=$(( (n+cols-1)/cols ))
layout=""; for ((i=0;i<n;i++)); do c=$((i%cols)); r=$((i/cols)); layout+="${c}0_${r}0|"; done
# usar xstack con posiciones en px (540x960 por celda)
pos=""; for ((i=0;i<n;i++)); do c=$((i%cols)); r=$((i/cols)); pos+="$((c*540))_$((r*960))|"; done
ffmpeg -v error -y "${inputs[@]}" -filter_complex "xstack=inputs=$n:layout=${pos%|}:fill=black" -frames:v 1 $out
