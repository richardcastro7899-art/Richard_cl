#!/usr/bin/env python3
"""Arma direccion-de-arte.html a partir de src/ + css/tokens.css + assets/.
Uso: python3 build.py [carpeta_para_fragmentos_artifact]"""
import re, base64, sys, os
R = os.path.dirname(os.path.abspath(__file__))
rd = lambda p: open(os.path.join(R, p), encoding="utf-8").read()
b64 = lambda p: base64.b64encode(open(os.path.join(R, p), "rb").read()).decode()

PAGES = [("src/direccion-de-arte.src.html", "direccion-de-arte.html"), ("src/index.src.html", "index.html")]
fonts = (
  '@font-face{font-family:"Oktah Round";src:url(data:font/woff2;base64,%s) format("woff2");font-weight:100 900;font-style:normal;font-display:swap}\n'
  '@font-face{font-family:"Myriad Pro";src:url(data:font/woff2;base64,%s) format("woff2");font-weight:400;font-style:normal;font-display:swap}'
) % (b64("assets/fonts/OktahRound-var.woff2"), b64("assets/fonts/MyriadPro-Regular.woff2"))

def sym(name, sid):
    s = rd(f"assets/logo/{name}.svg")
    vb = re.search(r'viewBox="([^"]+)"', s).group(1)
    body = re.search(r'<svg[^>]*>(.*)</svg>', s, re.S).group(1)
    return f'<symbol id="{sid}" viewBox="{vb}" fill="currentColor">{body}</symbol>'
sprite = '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">' + \
         sym("sacha-logo","sy-logo") + sym("sacha-wordmark","sy-wordmark") + sym("sacha-ojo","sy-ojo") + '</svg>'

for srcpath, dest in PAGES:
    src = rd(srcpath)
    out = src.replace("/*FONTS*/", fonts).replace("/*TOKENS*/", rd("css/tokens.css")).replace("<!--SYMBOLS-->", sprite)
    if len(sys.argv) > 1:
        open(os.path.join(sys.argv[1], dest.replace(".html", ".artifact.html")), "w", encoding="utf-8").write(out)
    head, body = out.split("</style>", 1)
    page = '<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n' + head + '</style>\n</head>\n<body>' + body + '\n</body>\n</html>\n'
    open(os.path.join(R, dest), "w", encoding="utf-8").write(page)
    print(dest, "ok", len(page)//1024, "KB")
