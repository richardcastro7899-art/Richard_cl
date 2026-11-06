#!/bin/bash
# uso: scripts/stills.sh f1 f2 f3 ...  -> out/tmp/f_<frame>.png
cd "$(dirname "$0")/.."
BR=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
for fr in "$@"; do npx remotion still Silent out/tmp/f_$fr.png --frame=$fr --browser-executable=$BR >/dev/null 2>&1 & done; wait
