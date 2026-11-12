# Convertidor de video a WebM / WebP

Convierte videos de cualquier formato (MP4, MOV, AVI, MKV, FLV, WMV, GIF, etc.) a:

- **WebM** (video VP9 + audio Opus): ideal para la web, con audio.
- **WebP animado**: como un GIF pero mucho más ligero, sin audio.

## Requisitos

- Python 3.9 o superior
- [ffmpeg](https://ffmpeg.org/download.html)
  - Windows: `winget install ffmpeg`
  - macOS: `brew install ffmpeg`
  - Linux: `sudo apt install ffmpeg`

## Uso

```bash
python convert.py video.mp4 webm
```

```bash
python convert.py video.mov webp --width 480 --fps 15
```

```bash
python convert.py carpeta_videos/ webm -o convertidos/
```

## Opciones

| Opción | Descripción |
|---|---|
| `-o, --salida` | Carpeta de salida (por defecto, junto al original) |
| `--fps` | Fotogramas por segundo (WebP usa 15 por defecto) |
| `--width` | Ancho en píxeles, mantiene la proporción |
| `--quality` | Calidad WebM (CRF 0-63, menor = mejor; por defecto 32) |
| `--webp-quality` | Calidad WebP (0-100; por defecto 75) |
| `--no-audio` | Quita el audio del WebM |
| `--loop` | Repeticiones del WebP (0 = infinito) |
| `--start` | Momento de inicio, ej. `00:00:05` |
| `--duration` | Duración en segundos, ej. `10` |
