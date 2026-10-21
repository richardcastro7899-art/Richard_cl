#!/usr/bin/env python3
"""Genera variantes en tono de los patrones de piel (dos colores por archivo):
  tone-gold-*.svg  bosque + dorado  -> cifras y numerales sobre fondo claro
  tone-sage-*.svg  verde selva y salvia -> fichas, portadas y marcos (paleta serena)
  tone-dark-*.svg  dorado y arena claro -> cifras y numerales cuando el tema es oscuro
Los originales (assets/patterns/*.svg) no se tocan: quedan solo en el titular del inicio y en la lámina de arte."""
import re, os
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = os.path.join(R, "assets", "patterns")
SCHEMES = {"gold": ("#24362E", "#AF7409"), "sage": ("#3F5A4F", "#8FA89A"), "dark": ("#AF7409", "#E8D9B5")}   # (oscuro, claro)
fill = re.compile(r'fill="rgb\(([\d.]+)%, ([\d.]+)%, ([\d.]+)%\)"')
lum = lambda m: 0.2126*float(m[0]) + 0.7152*float(m[1]) + 0.0722*float(m[2])
for name in ("felino", "manchas", "selva", "rayas", "reptil"):
    s = open(os.path.join(P, f"{name}.svg"), encoding="utf-8").read()
    cols = sorted({m.groups() for m in fill.finditer(s)}, key=lum)       # [más oscuro, más claro]
    assert len(cols) == 2, (name, cols)
    for key, (dark, light) in SCHEMES.items():
        def sub(m, cols=cols, dark=dark, light=light):
            return f'fill="{dark if m.groups() == cols[0] else light}"'
        out = fill.sub(sub, s)
        open(os.path.join(P, f"tone-{key}-{name}.svg"), "w", encoding="utf-8").write(out)
print("ok")
