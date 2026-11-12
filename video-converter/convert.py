#!/usr/bin/env python3
"""Convierte videos de cualquier formato a WebM (VP9/Opus) o WebP animado.

Requiere ffmpeg instalado. Uso:
    python convert.py video.mp4 webm
    python convert.py carpeta/ webp --fps 15 --width 480 -o salida/
"""
import argparse
import shutil
import subprocess
import sys
from pathlib import Path

VIDEO_EXT = {".mp4", ".mov", ".avi", ".mkv", ".flv", ".wmv", ".m4v", ".mpg",
             ".mpeg", ".3gp", ".ts", ".webm", ".gif", ".ogv", ".mts"}


def build_cmd(src: Path, dst: Path, fmt: str, a) -> list[str]:
    cmd = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-stats", "-i", str(src)]
    filters = []
    if a.fps:
        filters.append(f"fps={a.fps}")
    if a.width:
        filters.append(f"scale={a.width}:-2:flags=lanczos")
    if fmt == "webm":
        if filters:
            cmd += ["-vf", ",".join(filters)]
        cmd += ["-c:v", "libvpx-vp9", "-crf", str(a.quality), "-b:v", "0",
                "-row-mt", "1", "-pix_fmt", "yuv420p"]
        cmd += ["-an"] if a.no_audio else ["-c:a", "libopus", "-b:a", "128k"]
    else:  # webp animado (sin audio)
        if not a.fps:
            filters.append("fps=15")
        cmd += ["-vf", ",".join(filters), "-an", "-c:v", "libwebp",
                "-lossless", "0", "-q:v", str(a.webp_quality),
                "-compression_level", "6", "-loop", str(a.loop)]
    if a.start:
        cmd[5:5] = ["-ss", a.start]
    if a.duration:
        cmd += ["-t", a.duration]
    return cmd + [str(dst)]


def main() -> int:
    p = argparse.ArgumentParser(description="Convierte videos a WebM o WebP animado.")
    p.add_argument("entrada", help="archivo de video o carpeta")
    p.add_argument("formato", choices=["webm", "webp"])
    p.add_argument("-o", "--salida", help="carpeta de salida (por defecto, junto al original)")
    p.add_argument("--fps", type=int, help="fotogramas por segundo")
    p.add_argument("--width", type=int, help="ancho en px (mantiene proporción)")
    p.add_argument("--quality", type=int, default=32, help="WebM CRF 0-63, menor = mejor (def. 32)")
    p.add_argument("--webp-quality", type=int, default=75, help="WebP 0-100 (def. 75)")
    p.add_argument("--no-audio", action="store_true", help="WebM sin audio")
    p.add_argument("--loop", type=int, default=0, help="WebP: repeticiones, 0 = infinito")
    p.add_argument("--start", help="inicio, ej. 00:00:05")
    p.add_argument("--duration", help="duración, ej. 10")
    a = p.parse_args()

    if not shutil.which("ffmpeg"):
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
    if out_dir:
        out_dir.mkdir(parents=True, exist_ok=True)

    fallos = 0
    for f in files:
        dst = (out_dir or f.parent) / f"{f.stem}.{a.formato}"
        if dst.resolve() == f.resolve():
            print(f"Omitido (mismo archivo): {f}")
            continue
        print(f"→ {f.name} → {dst.name}")
        if subprocess.run(build_cmd(f, dst, a.formato, a)).returncode != 0:
            print(f"  ✗ falló: {f}", file=sys.stderr)
            fallos += 1
    print(f"Listo: {len(files) - fallos}/{len(files)} convertidos.")
    return 1 if fallos else 0


if __name__ == "__main__":
    sys.exit(main())
