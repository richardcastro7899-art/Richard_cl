"""Lógica de conversión compartida por la interfaz gráfica y la línea de comandos."""
from __future__ import annotations

import os
import re
import shutil
import subprocess
import sys
import threading
from dataclasses import dataclass
from pathlib import Path
from typing import Callable, Optional

VIDEO_EXT = {".mp4", ".mov", ".avi", ".mkv", ".flv", ".wmv", ".m4v", ".mpg",
             ".mpeg", ".3gp", ".ts", ".webm", ".gif", ".ogv", ".mts", ".m2ts",
             ".vob", ".divx", ".f4v", ".asf", ".rm", ".rmvb"}

# En Windows, evita que se abra una ventana de consola por cada ffmpeg.
_NO_WINDOW = subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0


@dataclass
class Options:
    fmt: str = "webm"             # "webm" o "webp"
    quality: int = 70             # 1-100, mayor = mejor calidad
    width: Optional[int] = None   # None = original
    fps: Optional[int] = None     # None = original (WebP usa 15)
    no_audio: bool = False
    loop: int = 0                 # WebP: 0 = infinito
    start: Optional[str] = None   # "00:00:05" o "5"
    duration: Optional[str] = None


class ConversionError(Exception):
    pass


class Cancelled(Exception):
    pass


def find_ffmpeg() -> Optional[str]:
    """Busca ffmpeg junto al programa (o dentro del .exe) y luego en el PATH."""
    name = "ffmpeg.exe" if os.name == "nt" else "ffmpeg"
    bases = []
    if getattr(sys, "frozen", False):
        bases.append(Path(sys.executable).parent)
        if hasattr(sys, "_MEIPASS"):
            bases.append(Path(sys._MEIPASS))
    bases.append(Path(__file__).resolve().parent)
    for base in bases:
        for cand in (base / name, base / "ffmpeg" / name, base / "ffmpeg" / "bin" / name):
            if cand.is_file():
                return str(cand)
    return shutil.which("ffmpeg")


def _to_seconds(value: Optional[str]) -> Optional[float]:
    if not value:
        return None
    secs = 0.0
    for part in str(value).strip().split(":"):
        secs = secs * 60 + float(part)
    return secs


def probe_duration(ffmpeg: str, src: Path) -> Optional[float]:
    """Duración en segundos leyendo la cabecera que imprime `ffmpeg -i`."""
    r = subprocess.run([ffmpeg, "-hide_banner", "-i", str(src)],
                       capture_output=True, text=True, errors="replace",
                       creationflags=_NO_WINDOW)
    m = re.search(r"Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)", r.stderr)
    if not m:
        return None
    h, mi, s = m.groups()
    return int(h) * 3600 + int(mi) * 60 + float(s)


def webm_crf(quality: int) -> int:
    # calidad 100 → CRF 22, 70 → 32, 1 → 55
    return max(0, min(63, round(55 - quality * 0.33)))


def build_cmd(ffmpeg: str, src: Path, dst: Path, o: Options, progress: bool = False) -> list[str]:
    cmd = [ffmpeg, "-y", "-hide_banner", "-loglevel", "error"]
    cmd += ["-progress", "pipe:1", "-nostats"] if progress else ["-stats"]
    if o.start:
        cmd += ["-ss", str(o.start)]
    cmd += ["-i", str(src)]
    if o.duration:
        cmd += ["-t", str(o.duration)]

    filters = []
    fps = o.fps or (15 if o.fmt == "webp" else None)
    if fps:
        filters.append(f"fps={fps}")
    if o.width:
        filters.append(f"scale='min({o.width},iw)':-2:flags=lanczos")

    if o.fmt == "webm":
        if filters:
            cmd += ["-vf", ",".join(filters)]
        cmd += ["-c:v", "libvpx-vp9", "-crf", str(webm_crf(o.quality)), "-b:v", "0",
                "-row-mt", "1", "-deadline", "good", "-cpu-used", "2",
                "-pix_fmt", "yuv420p"]
        cmd += ["-an"] if o.no_audio else ["-c:a", "libopus", "-b:a", "128k"]
    elif o.fmt == "webp":
        cmd += ["-vf", ",".join(filters), "-an", "-c:v", "libwebp",
                "-lossless", "0", "-q:v", str(o.quality),
                "-compression_level", "6", "-loop", str(o.loop)]
    else:
        raise ValueError(f"Formato no soportado: {o.fmt}")
    return cmd + [str(dst)]


def output_path(src: Path, out_dir: Optional[Path], fmt: str) -> Path:
    """Ruta de salida que no pisa el original ni archivos existentes."""
    folder = out_dir or src.parent
    dst = folder / f"{src.stem}.{fmt}"
    n = 1
    while dst.exists() or dst.resolve() == src.resolve():
        dst = folder / f"{src.stem} ({n}).{fmt}"
        n += 1
    return dst


def convert(src: Path, dst: Path, o: Options,
            on_progress: Optional[Callable[[float], None]] = None,
            cancel: Optional[threading.Event] = None,
            ffmpeg: Optional[str] = None) -> None:
    """Convierte un archivo. on_progress recibe valores 0.0-1.0."""
    ffmpeg = ffmpeg or find_ffmpeg()
    if not ffmpeg:
        raise ConversionError("No se encontró ffmpeg.")

    total = probe_duration(ffmpeg, src)
    start = _to_seconds(o.start) or 0.0
    if total is not None:
        total = max(total - start, 0.0)
    lim = _to_seconds(o.duration)
    if lim:
        total = min(total, lim) if total else lim

    dst.parent.mkdir(parents=True, exist_ok=True)
    proc = subprocess.Popen(build_cmd(ffmpeg, src, dst, o, progress=True),
                            stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                            stdin=subprocess.DEVNULL, text=True, errors="replace",
                            creationflags=_NO_WINDOW)
    err_lines: list[str] = []
    t = threading.Thread(target=lambda: err_lines.extend(proc.stderr), daemon=True)
    t.start()

    cancelled = False
    for line in proc.stdout:
        if cancel is not None and cancel.is_set():
            cancelled = True
            proc.terminate()
            break
        key, _, val = line.strip().partition("=")
        if key == "out_time_us" and total and on_progress and val.isdigit():
            on_progress(min(int(val) / 1e6 / total, 1.0))
    proc.wait()
    t.join(timeout=2)

    if cancelled:
        dst.unlink(missing_ok=True)
        raise Cancelled()
    if proc.returncode != 0:
        dst.unlink(missing_ok=True)
        msg = "".join(err_lines).strip().splitlines()
        raise ConversionError(msg[-1] if msg else f"ffmpeg terminó con código {proc.returncode}")
    if on_progress:
        on_progress(1.0)
