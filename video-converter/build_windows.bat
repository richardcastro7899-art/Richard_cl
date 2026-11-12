@echo off
REM Genera "ConvertidorVideo.exe" (programa para Windows, no necesita Python para usarse).
REM Requisitos: Python 3.9+ instalado. Si pones ffmpeg.exe en esta carpeta,
REM se incluira dentro del .exe y no hara falta instalar ffmpeg aparte.

cd /d "%~dp0"
python -m pip install --upgrade pyinstaller tkinterdnd2 || goto :error

set EXTRA=
if exist ffmpeg.exe set EXTRA=--add-binary "ffmpeg.exe;."

python -m PyInstaller --noconfirm --onefile --windowed --name ConvertidorVideo ^
  --collect-all tkinterdnd2 %EXTRA% app.py || goto :error

echo.
echo Listo: el programa esta en dist\ConvertidorVideo.exe
pause
exit /b 0

:error
echo.
echo Hubo un error al generar el programa.
pause
exit /b 1
