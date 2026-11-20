#!/bin/sh
# uso: sh shots.sh pagina y1 y2 ...  → capturas 1440x900 en ../_shots
p=$1; shift
for y in "$@"; do
"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=1440,900 --virtual-time-budget=5000 --screenshot="C:/Users/RICHARD/Desktop/code/amurek-isotipo/_shots/${p}_$y.png" "http://localhost:5173/$p.html?still&y=$y" >/dev/null 2>&1
done
