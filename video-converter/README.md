# Convertidor de Video a WebM / WebP

Programa de escritorio para convertir videos de cualquier formato (MP4, MOV, AVI,
MKV, FLV, WMV, GIF, MPG, 3GP, etc.) a:

- **WebM** (video VP9 y audio Opus): ideal para la web, conserva el audio.
- **WebP animado**: como un GIF pero mucho más ligero, sin audio.

## Funciones

- Agrega varios videos a la vez o una carpeta completa (también se pueden arrastrar y soltar).
- La lista muestra el tamaño, la duración, el estado y el porcentaje de cada video.
- Hay una barra de progreso para el archivo actual y otra para el total.
- Al terminar, cada video queda marcado como **✔ Listo**, con su nuevo tamaño y el tiempo que tardó, o **✖ Error**.
- Al final aparece un resumen y la opción de abrir la carpeta de salida.
- Puedes hacer doble clic en un video ya convertido para abrirlo.
- Opciones: formato, calidad, resolución, FPS, quitar el audio y carpeta de destino.
- Puedes cancelar a mitad de la conversión sin dejar archivos a medias.

## Requisitos

- [Python 3.9 o superior](https://www.python.org/downloads/). En Windows, marca «Add Python to PATH» al instalarlo.
- [ffmpeg](https://ffmpeg.org/download.html)
  - Windows: `winget install ffmpeg`, o deja `ffmpeg.exe` en esta misma carpeta
  - macOS: `brew install ffmpeg`
  - Linux: `sudo apt install ffmpeg python3-tk`

## Abrir el programa

```bash
python app.py
```

Para poder arrastrar y soltar videos (opcional):

```bash
pip install tkinterdnd2
```

## Crear un .exe para Windows

Haz doble clic en **`build_windows.bat`**. Se generará `dist\ConvertidorVideo.exe`,
un programa que se abre con doble clic y no necesita Python.

Si antes de ejecutarlo copias `ffmpeg.exe` a esta carpeta, quedará incluido dentro del
`.exe` y el programa funcionará en cualquier PC sin instalar nada más.

## Versión para Mac (.app / .dmg)

**Descargarla ya compilada:** cada vez que se suben cambios, GitHub Actions compila
automáticamente el `.dmg` para Mac (Apple Silicon e Intel) y el `.exe` para Windows.
Para descargarlos, entra en la pestaña **Actions** del repositorio, abre la última ejecución
de «Compilar Convertidor de Video» y busca la sección **Artifacts**.

**Compilarla tú mismo en el Mac:** en la app Terminal, dentro de esta carpeta, ejecuta:

```bash
bash build_mac.sh
```

Se generan `dist/Convertidor de Video.app` y un instalador `dist/ConvertidorVideo-mac-*.dmg`.

**Instalación en el Mac:**

1. Abre el `.dmg` y arrastra **Convertidor de Video** a la carpeta **Aplicaciones**.
2. La primera vez, haz **clic derecho → Abrir → Abrir**. Como la app no está firmada por
   Apple, macOS lo pide solo esa primera vez. Si dice que «está dañada», ejecuta en la Terminal:
   `xattr -cr "/Applications/Convertidor de Video.app"`
3. Instala ffmpeg con [Homebrew](https://brew.sh): `brew install ffmpeg`.
   La app lo encuentra sola, aunque la abras desde el Finder.

## Línea de comandos (opcional)

```bash
python convert.py video.mp4 webm
```

```bash
python convert.py carpeta_videos/ webp --width 480 --fps 15 -o convertidos/
```

Opciones: `-o` (carpeta de salida), `--quality 1-100`, `--width`, `--fps`, `--no-audio`,
`--loop`, `--start 00:00:05`, `--duration 10`.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `app.py` | Programa con interfaz gráfica |
| `converter_core.py` | Motor de conversión (usa ffmpeg) |
| `convert.py` | Versión de línea de comandos |
| `build_windows.bat` | Genera el `.exe` para Windows |
| `build_mac.sh` | Genera la `.app` y el `.dmg` para Mac |
