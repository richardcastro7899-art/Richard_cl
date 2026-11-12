#!/usr/bin/env python3
"""Versión de línea de comandos del convertidor (la interfaz gráfica está en app.py).

Uso:
    python convert.py video.mp4 webm
    python convert.py carpeta/ webp --fps 15 --width 480 -o salida/
"""
import argparse
import sys
from pathlib import Path

from converter_core import (VIDEO_EXT, ConversionError, Options, convert,
                            find_ffmpeg, output_path)


def main() -> int:
    p = argparse.ArgumentParser(description="Convierte videos a WebM o WebP animado.")
    p.add_argument("entrada", help="archivo de video o carpeta")
    p.add_argument("formato", choices=["webm", "webp"])
    p.add_argument("-o", "--salida", help="carpeta de salida (por defecto, junto al original)")
    p.add_argument("--fps", type=int, help="fotogramas por segundo")
    p.add_argument("--width", type=int, help="ancho máximo en px (mantiene proporción)")
    p.add_argument("--quality", type=int, default=70, help="calidad 1-100 (def. 70)")
    p.add_argument("--no-audio", action="store_true", help="WebM sin audio")
    p.add_argument("--loop", type=int, default=0, help="WebP: repeticiones, 0 = infinito")
    p.add_argument("--start", help="inicio, ej. 00:00:05")
    p.add_argument("--duration", help="duración en segundos, ej. 10")
    a = p.parse_args()

    ffmpeg = find_ffmpeg()
    if not ffmpeg:
        sys.exit("Error: ffmpeg no está instalado (https://ffmpeg.org/download.html)")

    src = Path(a.entrada)
    if src.is_dir():
        files = sorted(f for f in src.iterdir() if f.suffix.lower() in VIDEO_EXT)
    elif src.is_file():
        files = [src]
    else:
        sys.exit(f"Error: no existe {src}")
    if not files:
        sys.exit("No se encontraron videos.")

    out_dir = Path(a.salida) if a.salida else None
    opts = Options(fmt=a.formato, quality=a.quality, width=a.width, fps=a.fps,
                   no_audio=a.no_audio, loop=a.loop, start=a.start, duration=a.duration)
    fallos = 0
    for f in files:
        dst = output_path(f, out_dir, a.formato)
        print(f"→ {f.name} → {dst.name}")
        try:
            convert(f, dst, opts, ffmpeg=ffmpeg,
                    on_progress=lambda x: print(f"\r  {x:6.1%}", end="", flush=True))
            print()
        except ConversionError as e:
            print(f"\n  ✗ falló: {e}", file=sys.stderr)
            fallos += 1
    print(f"Listo: {len(files) - fallos}/{len(files)} convertidos.")
    return 1 if fallos else 0


if __name__ == "__main__":
    sys.exit(main())
