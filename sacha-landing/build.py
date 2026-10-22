#!/usr/bin/env python3
"""Arma direccion-de-arte.html a partir de src/ + css/tokens.css + assets/.
Uso: python3 build.py [carpeta_para_fragmentos_artifact]"""
import re, base64, sys, os
R = os.path.dirname(os.path.abspath(__file__))
rd = lambda p: open(os.path.join(R, p), encoding="utf-8").read()
b64 = lambda p: base64.b64encode(open(os.path.join(R, p), "rb").read()).decode()

PAGES = [("src/direccion-de-arte.src.html", "direccion-de-arte.html"), ("src/index.src.html", "index.html"), ("src/propuesta-24h.src.html", "propuesta-24h.html"), ("src/propuesta-capitulos.src.html", "propuesta-capitulos.html"), ("src/propuesta-institucional.src.html", "propuesta-institucional.html"), ("src/animos.src.html", "animos-de-sacha.html"), ("src/propuesta-esencia.src.html", "propuesta-esencia.html"), ("src/propuesta-bento.src.html", "propuesta-bento.html"), ("src/propuesta-todo-sobre.src.html", "propuesta-todo-sobre.html"), ("src/propuesta-final.src.html", "propuesta-final.html"), ("src/propuesta-recorrido.src.html", "propuesta-recorrido.html")]
fonts = (
  '@font-face{font-family:"Oktah Round";src:url(data:font/woff2;base64,%s) format("woff2");font-weight:100 900;font-style:normal;font-display:swap}\n'
  '@font-face{font-family:"Myriad Pro";src:url(data:font/woff2;base64,%s) format("woff2");font-weight:400;font-style:normal;font-display:swap}'
) % (b64("assets/fonts/OktahRound-var.woff2"), b64("assets/fonts/MyriadPro-Regular.woff2"))

# Las pupilas de los ojos (las dos A) se pueden mover con --px/--py desde la página que usa el símbolo
PUPIL = ' style="transform:translate(var(--px,0px),var(--py,0px));transition:transform .18s ease-out"'
def sym(name, sid, pupils=()):
    s = rd(f"assets/logo/{name}.svg")
    vb = re.search(r'viewBox="([^"]+)"', s).group(1)
    body = re.search(r'<svg[^>]*>(.*)</svg>', s, re.S).group(1)
    n = iter(range(10**4))
    body = re.sub(r'<path', lambda m: '<path' + (PUPIL if next(n) in pupils else ''), body)
    return f'<symbol id="{sid}" viewBox="{vb}" fill="currentColor">{body}</symbol>'
sprite = '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">' + \
         sym("sacha-logo","sy-logo",(7,11)) + sym("sacha-wordmark","sy-wordmark",(7,11)) + sym("sacha-ojo","sy-ojo",(3,)) + '</svg>'

def includes(txt):
    """<!--include:ruta--> se reemplaza por el contenido del archivo (relativo a src/)."""
    return re.sub(r'<!--include:([^ >]+)-->', lambda m: rd("src/" + m.group(1)), txt)

for srcpath, dest in PAGES:
    src = includes(rd(srcpath))
    src = src.replace("<!--MAPSVG-->", rd("assets/map/sedes-map.svg")).replace("<!--INSETSVG-->", rd("assets/map/ecuador-inset.svg"))
    out = src.replace("/*FONTS*/", fonts).replace("/*TOKENS*/", rd("css/tokens.css")).replace("<!--SYMBOLS-->", sprite)
    if len(sys.argv) > 1:
        open(os.path.join(sys.argv[1], dest.replace(".html", ".artifact.html")), "w", encoding="utf-8").write(out)
    head, body = out.split("</style>", 1)
    page = '<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n' + head + '</style>\n</head>\n<body>' + body + '\n</body>\n</html>\n'
    open(os.path.join(R, dest), "w", encoding="utf-8").write(page)
    print(dest, "ok", len(page)//1024, "KB")
