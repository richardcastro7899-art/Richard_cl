#!/bin/bash
# Genera "Convertidor de Video.app" y un instalador .dmg para macOS.
# Uso (en la app Terminal, dentro de esta carpeta):   bash build_mac.sh
# Requisitos: Python 3.9+ de python.org (incluye Tk). Si dejas un binario
# "ffmpeg" en esta carpeta, se incluirá dentro de la app.
set -euo pipefail
cd "$(dirname "$0")"

APP="Convertidor de Video"
PY="${PYTHON:-python3}"

"$PY" -m pip install --upgrade pyinstaller tkinterdnd2

EXTRA=()
if [ -x ./ffmpeg ]; then
  EXTRA+=(--add-binary "ffmpeg:.")
fi

"$PY" -m PyInstaller --noconfirm --clean --windowed \
  --name "$APP" \
  --osx-bundle-identifier com.convertidor.video \
  --collect-all tkinterdnd2 \
  ${EXTRA[@]+"${EXTRA[@]}"} \
  app.py

# Instalador .dmg con acceso directo a Aplicaciones
STAGE="$(mktemp -d)"
cp -R "dist/$APP.app" "$STAGE/"
ln -s /Applications "$STAGE/Applications"
ARCH="$(uname -m)"
DMG="dist/ConvertidorVideo-mac-$ARCH.dmg"
rm -f "$DMG"
hdiutil create -volname "$APP" -srcfolder "$STAGE" -ov -format UDZO "$DMG"
rm -rf "$STAGE"

echo
echo "Listo:"
echo "  App:        dist/$APP.app"
echo "  Instalador: $DMG"
