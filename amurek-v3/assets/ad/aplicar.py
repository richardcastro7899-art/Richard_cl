"""
AMUREK v3 · nueva propuesta: la información de amurek.com con la dirección de arte de /nk.studio.

Uso (desde la carpeta amurek-v3):  python assets/ad/aplicar.py

- La primera vez guarda los archivos de amurek.com en assets/ad/original/.
- Cada vez parte de esos originales, así que se puede ejecutar las veces que haga falta.
- Si se vuelve a descargar la web publicada, se borra assets/ad/original/ y se ejecuta de nuevo.

Qué hace:
  1. styles.css: esquinas contenidas (máx. 10 px).
  2. Todas las páginas: cargan la capa nueva (ad.css + ad.js con Three.js, GSAP y Lenis).
  3. Inicio:
     - Entrada: una pantalla solo para la red neuronal, con ideas de proyectos que aparecen con cada scroll.
     - Hero: vuelve el fondo en movimiento de amurek.com y suma el campo en el piso.
     - Showreel: llena la pantalla y entra en el titular «Reels que [video] detienen el scroll.».
       Los reels llevan una cabecera breve.
     - Servicios: abre con el núcleo y sus cinco órbitas (un solo equipo).
     - «De la idea al lanzamiento»: el bloque 3D (idea → conexión → forma → lanzamiento) reemplaza al proceso.
     - Planes: sin fondo 3D.
     - Cierre: fragmentos que se arman.
"""
import sys, io, os, re, shutil

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
ORIG = os.path.join(ROOT, 'assets', 'ad', 'original')
PAGES = ['index.html', 'servicios.html', 'proyectos.html', 'nosotros.html', 'contacto.html', 'privacidad.html', 'terminos.html', 'cookies.html']
V = '47'

def rd(p): return io.open(p, encoding='utf-8').read()
def wr(p, s): io.open(p, 'w', encoding='utf-8', newline='').write(s)

# 0 · originales
os.makedirs(ORIG, exist_ok=True)
for f in PAGES + ['styles.css', 'main.js']:
    src, dst = os.path.join(ROOT, f), os.path.join(ORIG, f)
    if not os.path.exists(dst) and os.path.exists(src): shutil.copyfile(src, dst)

# ---------- identidad nueva (21 nov 2026): negro #0A0A0A, blanco #F5F5F3, verde neón #00FF8B (solo sobre negro) ----------
import colorsys
def _parse(s):
    if s.startswith('#'):
        h = s[1:]
        if len(h) in (3, 4): h = ''.join(ch * 2 for ch in h)
        return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), (int(h[6:8], 16) / 255 if len(h) == 8 else None)
    n = re.findall(r'[\d.]+', s)
    if len(n) < 3 or 'var(' in s: return None
    return float(n[0]), float(n[1]), float(n[2]), (float(n[3]) if len(n) > 3 else None)
def _fmt(r, g, b, a):
    r, g, b = (max(0, min(255, round(x))) for x in (r, g, b))
    return f'#{r:02x}{g:02x}{b:02x}' if a is None else f'rgba({r},{g},{b},{a:.3g})'
def _map(m):
    s = m.group(0); p = _parse(s)
    if not p: return s
    r, g, b, a = p; h, l, sat = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
    warm = sat > .1 and (h > .8 or h < .08)
    if not warm: return s
    if l > .9: return _fmt(245, 245, 243, a)                      # cremas → blanco de marca
    if l > .52 and a is None: return _fmt(0, 255, 139, a)         # rosas/orquídea sólidos (acentos) → verde neón
    if l > .52: return _fmt(245, 245, 243, a * .4)                # brillos rosados (degradados) → luz blanca tenue
    if l > .3: v = 120 * l / .45; return _fmt(v, v, v, a)          # brillos vino → grafito
    v = max(10, l * 255 * .9); return _fmt(v, v, v, a)             # fondos vino casi negro → negro neutro
def recolor(text):
    return re.sub(r'#[0-9a-fA-F]{8}\b|#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3,4}\b|rgba?\([^)]*\)', _map, text)

WM = '''<g fill="currentColor"><path fill-rule="evenodd" d="M147.24,198.53A56.085 56.085 0 1 1 186.66,144.97V201.06H160.54V144.97A29.965 29.965 0 1 0 147.24,169.88Z"/><path fill-rule="evenodd" d="M200.07 135.54L200.07 201.06L226.19 201.06L226.19 135.54Q226.19 131.35 227.8 127.55Q229.36 123.87 232.2 121.02Q235.05 118.18 238.73 116.62Q242.53 115.01 246.72 115.01Q250.91 115.01 254.71 116.62Q258.39 118.18 261.24 121.02Q264.08 123.87 265.64 127.55Q267.25 131.35 267.25 135.54L267.25 201.06L293.37 201.06L293.37 135.54Q293.37 131.35 294.98 127.55Q296.54 123.87 299.38 121.02Q302.23 118.18 305.91 116.62Q309.71 115.01 313.9 115.01Q318.09 115.01 321.89 116.62Q325.57 118.18 328.42 121.02Q331.26 123.87 332.82 127.55Q334.43 131.35 334.43 135.54L334.43 154.41Q334.43 163.89 338.1 172.57Q341.64 180.95 348.09 187.4Q354.54 193.85 362.92 197.39Q371.6 201.06 381.08 201.06Q390.56 201.06 399.24 197.39Q407.62 193.85 414.07 187.4Q420.52 180.95 424.06 172.57Q427.73 163.89 427.73 154.41L427.73 88.89L401.61 88.89L401.61 154.41Q401.61 158.6 400 162.4Q398.44 166.08 395.6 168.93Q392.75 171.77 389.07 173.33Q385.27 174.94 381.08 174.94Q376.89 174.94 373.09 173.33Q369.41 171.77 366.56 168.93Q363.72 166.08 362.16 162.4Q360.55 158.6 360.55 154.41L360.55 135.54Q360.55 126.06 356.88 117.38Q353.34 109 346.89 102.55Q340.44 96.1 332.06 92.56Q323.38 88.89 313.9 88.89Q304.42 88.89 295.74 92.56Q287.36 96.1 280.91 102.55Q280.61 102.86 280.31 103.17Q280.01 102.86 279.71 102.55Q273.26 96.1 264.88 92.56Q256.2 88.89 246.72 88.89Q237.24 88.89 228.56 92.56Q220.18 96.1 213.73 102.55Q207.28 109 203.74 117.38Q200.07 126.06 200.07 135.54Z"/><path d="M441.14,201.06V144.975A56.085 56.085 0 0 1 497.225,88.89V115.01A29.965 29.965 0 0 0 467.26,144.975V201.06Z"/><g transform="translate(-19.245,0)"><path fill-rule="evenodd" d="M628 164.98A56.085 56.085 0 1 1 630.74 134.72L556.27 167.88A29.965 29.965 0 0 0 597.91 164.98ZM545.65 144.01A29.965 29.965 0 0 1 594.93 122.07Z"/></g><g transform="translate(-23.245,0)"><path fill-rule="evenodd" d="M643.25 54.21H669.37V122.89A34 34 0 0 0 703.37 88.89H729.49A60.120000000000005 60.120000000000005 0 0 1 707.64 135.26A76.12 76.12 0 0 1 745.49 201.06H719.37A50 50 0 0 0 669.37 151.06V201.06H643.25Z"/></g></g><circle class="wm-dot" cx="744.30" cy="188.00" r="13.06"/>'''
WM_VB = '74.49 54.21 682.87 146.85'
ISO = '<svg viewBox="74.49 88.89 112.17 112.17" aria-hidden="true" fill="currentColor"><path d="M147.24,198.53A56.085 56.085 0 1 1 186.66,144.97V201.06H160.54V144.97A29.965 29.965 0 1 0 147.24,169.88Z"/><circle class="iso-dot" cx="130.57" cy="144.97" r="13.06"/></svg>'
FAV = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='60.5 75 140 140'%3E%3Crect x='60.5' y='75' width='140' height='140' rx='30' fill='%230A0A0A'/%3E"
       "%3Cpath fill='%23F5F5F3' d='M147.24,198.53A56.085 56.085 0 1 1 186.66,144.97V201.06H160.54V144.97A29.965 29.965 0 1 0 147.24,169.88Z'/%3E%3Ccircle cx='130.57' cy='144.97' r='13.06' fill='%2300FF8B'/%3E%3C/svg%3E")
PRE_PATHS = re.findall(r'<path[^>]*/>', WM.split('</g></g>')[0].replace('<g transform="translate(-19.245,0)">', '').replace('<g transform="translate(-23.245,0)">', '').replace('</g>', ''))
def brand(h):
    # símbolo del logotipo
    h = re.sub(r'<symbol id="wordmark" viewBox="[^"]*">.*?</symbol>', f'<symbol id="wordmark" viewBox="{WM_VB}">{WM}</symbol>', h, count=1, flags=re.S)
    h = h.replace('viewBox="0 0 677.68 146.85"', 'viewBox="0 0 682.87 146.85"')
    # logotipo de la pantalla de carga (letras animadas una a una + el punto verde)
    def pre(m):
        tr = ['', '', '', ' transform="translate(-19.245,0)"', ' transform="translate(-23.245,0)"']
        # del símbolo al nombre: primero la «a» con su punto (el isotipo); luego el punto sale de la «a»
        # y recorre la línea hasta su lugar después de la k; a su paso aparece el resto del nombre
        # el piso: las letras viven bajo la línea base y suben cuando el punto pasa por encima
        defs = ('<defs><clipPath id="pre-floor"><rect x="60" y="0" width="720" height="201.06"/></clipPath>'
                '<filter id="pre-glow" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="3.2"/></filter></defs>')
        a = '<g class="pre-a">' + PRE_PATHS[0] + '</g>'
        dl = [1.529, 1.75, 1.806, 1.889]
        rest = ''.join(f'<g{tr[i]}><g class="pre-l" style="--d:{dl[i - 1]}s">' + p + '</g></g>' for i, p in enumerate(PRE_PATHS) if i)
        glow = '<circle class="wm-glow" cx="744.30" cy="188.00" r="13.06" fill="#00FF8B" filter="url(#pre-glow)"/>'
        return (f'<svg class="wm wm--l" viewBox="{WM_VB}" role="img" aria-label="AMUREK">{defs}{a}<g class="pre-rest" clip-path="url(#pre-floor)">{rest}</g>{glow}'
                '<circle class="wm-dot" cx="744.30" cy="188.00" r="13.06"/></svg>')
    h = re.sub(r'<svg class="wm wm--l"[^>]*>.*?</svg>', pre, h, count=1, flags=re.S)
    # isotipo (avatares, chat, preguntas)
    h = re.sub(r'<svg viewBox="0 0 100\.94 116\.06"[^>]*>.*?</svg>', ISO, h, flags=re.S)
    # favicon y color del navegador
    h = re.sub(r'<link rel="icon" href="data:image/svg\+xml,[^"]*">', f'<link rel="icon" href="{FAV}">', h, count=1)
    h = h.replace('<meta name="theme-color" content="#F2F0EB">', '<meta name="theme-color" content="#0A0A0A">')
    return h

# main.js: la seda del hero pasa de rosa a grafito y plata
js = rd(os.path.join(ORIG, 'main.js'))
js = js.replace('vec3 cr = vec3(.97, .95, .92), ro = vec3(.95, .55, .72);', 'vec3 cr = vec3(.96, .96, .95), ro = vec3(.36, .38, .37);')
js = js.replace('rgba(234,214,214,${', 'rgba(0,255,139,${').replace('"rgba(245,243,238,.11)"', '"rgba(245,245,243,.11)"')
js = js.replace('e=1500,o=4800', 'e=3200,o=6000')
wr(os.path.join(ROOT, 'main.js'), js)

# 1 · esquinas: «lo necesario». Todo radio mayor de 6 px tiende a 10 px como máximo; sin la esquina grande del isotipo
def shrink_px(m):
    v = float(m.group(1))
    if v <= 6: return m.group(0)
    return f'{round(min(6 + (v - 6) * .25, 10))}px'
def shrink_val(val):
    if '%' in val or '999' in val or 'inherit' in val: return val
    val = re.sub(r'clamp\(([^,]+),[^,]+,([^)]+)\)', lambda m: m.group(2), val)   # clamp → su máximo (luego se reduce)
    val = re.sub(r'(\d*\.?\d+)px', shrink_px, val)
    return uniform(val)
def uniform(val):
    """Las cuatro esquinas con la misma curva (salvo diseños con esquinas en 0, como pestañas)."""
    if '/' in val: return val
    toks, depth, cur = [], 0, ''
    for ch in val.strip():
        depth += ch == '('; depth -= ch == ')'
        if ch == ' ' and depth == 0:
            if cur: toks.append(cur); cur = ''
        else: cur += ch
    if cur: toks.append(cur)
    if len(toks) < 2 or any(t in ('0', '0px') for t in toks): return val
    best = max(toks, key=lambda t: (toks.count(t), -toks.index(t)))
    return best
css = rd(os.path.join(ORIG, 'styles.css'))
css = re.sub(r'((?:border(?:-[a-z]+)*-radius)|--(?:r|sello)(?:-[a-z]+)*|--rr)\s*:\s*([^;}]+)', lambda m: m.group(1) + ':' + shrink_val(m.group(2)), css)
css = recolor(css)
wr(os.path.join(ROOT, 'styles.css'), css)

# 2 · cabecera común
HEAD = f'''<link rel="stylesheet" href="assets/ad/ad.css?v={V}">
<script type="importmap">{{"imports":{{"three":"https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js","three/addons/":"https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"}}}}</script>
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js"></script>
'''
TAIL = f'<script type="module" src="assets/ad/ad.js?v={V}"></script>\n'

def section(html, sid):
    m = re.search(r'<section[^>]*id="%s".*?</section>\s*' % sid, html, re.S)
    return m.group(0) if m else ''

def journey(html):
    """Showreel → pantalla completa → entra en el titular de los reels. La descripción pasa sobre las tarjetas."""
    reel = section(html, 'showreel')
    r = re.search(r'(<section class="sec" id="reels">\s*)<div class="wrap rhead">\s*<h2[^>]*>(.*?)</h2>\s*<p>(.*?)</p>\s*</div>\s*', html, re.S)
    if not reel or not r or 'class="reel"' not in reel: return html
    lead = re.search(r'<h2 class="reel__lead">(.*?)</h2>', reel, re.S).group(1)
    btn = re.search(r'<button class="reel__box"(.*?)</button>', reel, re.S).group(1)
    wl = re.search(r'reel__w--l">(.*?)<', reel).group(1); wrr = re.search(r'reel__w--r">(.*?)<', reel).group(1)
    h2, p = r.group(2).strip(), r.group(3).strip()
    words = re.sub(r'<[^>]+>', '', lead).split(' '); cut = max(1, len(words) - 1)
    new = f'''<section class="adj" id="showreel" aria-label="Showreel">
  <div class="adj__pin">
    <canvas class="adj__bg" aria-hidden="true"></canvas>
    <span class="adj__w adj__w--l" aria-hidden="true">{wl}</span>
    <span class="adj__w adj__w--r" aria-hidden="true">{wrr}</span>
    <div class="adj__end">
      <h2 class="adj__h"><span class="adj__hw">{' '.join(words[:cut])}</span> <span class="adj__slot" aria-hidden="true"></span> <span class="adj__hw">{' '.join(words[cut:])}</span></h2>
    </div>
    <button class="adj__box"{btn}</button>
  </div>
</section>
'''
    head = f'''<div class="wrap ad-rh"><h2 class="ad-rh__h">{h2}</h2><p class="ad-rh__p">{p}</p></div>
  '''
    html = html.replace(r.group(0), r.group(1) + head)
    html = html.replace(reel, new)
    return html

PORTAL = '''<div class="adp" id="portal" role="dialog" aria-modal="true" aria-label="Entrada a AMUREK" hidden>
  <canvas class="adp__cv" aria-hidden="true"></canvas>
  <svg class="adp__ln" aria-hidden="true"><line x1="0" y1="0" x2="0" y2="0"/><circle r="5"/></svg>
  <div class="adp__st adp__intro" data-st="0">
    <h2 class="adp__h">Toda marca empieza<br>como una idea.</h2>
  </div>
  <article class="adp__st adp__card" data-st="1" data-node="1">
    <figure><img src="assets/ref/w-golden.webp" alt="" decoding="async"></figure>
    <div><p class="adp__n">Branding</p><h3>Nómada</h3><p>Identidad y papelería</p></div>
  </article>
  <article class="adp__st adp__card adp__card--l" data-st="2" data-node="2">
    <figure><video muted loop playsinline preload="metadata" poster="assets/ref/trailer-a.webp"><source src="assets/ref/trailer-a.webm" type="video/webm"><source src="assets/ref/trailer-a.mp4" type="video/mp4"></video></figure>
    <div><p class="adp__n">Audiovisual</p><h3>Aurora</h3><p>Spot de lanzamiento</p></div>
  </article>
  <article class="adp__st adp__card" data-st="3" data-node="3">
    <figure><img src="assets/ref/w-saddas.webp" alt="" decoding="async"></figure>
    <div><p class="adp__n">Marketing</p><h3>Carmín</h3><p>Campaña de producto</p></div>
  </article>
  <div class="adp__st adp__enter" data-st="4">
    <h2 class="adp__h">Tu idea puede ser<br>la siguiente.</h2>
    <button class="adp__hold" type="button"><span>Entrar</span><i aria-hidden="true"></i></button>
  </div>
</div>
'''

def servicios(html):
    """Servicios: primero el porqué (invita a contratar), luego los cinco servicios en lista viva con la ola de fondo."""
    sec = section(html, 'servicios')
    items = re.findall(r'<li class="svh__s">.*?</div>\s*</div>\s*</li>', sec, re.S)
    if not items: return html
    rows, panes = [], []
    for k, it in enumerate(items):
        img = re.search(r'<img[^>]*src="([^"]+)"', it).group(1)
        h3 = re.search(r'<h3>(.*?)</h3>', it, re.S).group(1)
        txt = re.search(r'</h3>\s*<p>(.*?)</p>', it, re.S).group(1)
        tags = re.search(r'<ul class="svh__tags">(.*?)</ul>', it, re.S).group(1)
        cta = re.search(r'<a class="btn[^"]*" href="([^"]+)"><span>(.*?)</span>', it, re.S)
        more = re.search(r'<a class="svh__more" href="([^"]+)">', it)
        on = ' is-on' if k == 0 else ''
        more_a = '<a class="adsv__more" href="%s">Qué incluye</a>' % more.group(1) if more else ''
        rows.append('          <li class="adsv__s%s" data-k="%d"><button class="adsv__t" type="button" aria-controls="adsv-p%d" aria-expanded="%s"><span>%s</span><i aria-hidden="true"></i></button></li>'
                    % (on, k, k, 'true' if k == 0 else 'false', h3))
        panes.append('          <article class="adsv__pane%s" id="adsv-p%d" data-k="%d">\n'
                     '            <figure class="adsv__m"><img src="%s" alt="" loading="lazy" decoding="async"></figure>\n'
                     '            <div class="adsv__x"><h3 class="sr">%s</h3><p>%s</p><ul class="adsv__tags">%s</ul>\n'
                     '              <div class="adsv__act"><a class="btn btn--light btn--sm" href="%s"><span>%s</span><i class="dot"></i></a>%s</div></div>\n'
                     '          </article>' % (on, k, k, img, h3, txt, tags, cta.group(1), cta.group(2), more_a))
    new = ('<section class="adsv" id="servicios" data-scene-host aria-labelledby="adsv-t">\n'
           '  <canvas class="ad-scene adsv__cv" data-scene="wave" data-active="0" aria-hidden="true"></canvas>\n'
           '  <div class="adsv__pin">\n    <div class="adsv__in">\n      <div class="adsv__head">\n'
           '        <p class="adsv__k">Servicios</p>\n'
           '        <h2 class="adsv__h" id="adsv-t">Un solo equipo para que tu marca crezca<i class="ad-dot">.</i></h2>\n'
           '        <p class="adsv__p">Sin coordinar cinco proveedores ni repetir tu historia cada vez. Pensamos la estrategia, diseñamos, producimos y lanzamos, todo con la misma idea detrás.</p>\n'
           '        <a class="btn btn--light" href="contacto.html"><span>Cotiza tu proyecto</span><i class="dot"></i></a>\n'
           '      </div>\n      <div class="adsv__side">\n        <ol class="adsv__list">\n' + '\n'.join(rows) + '\n        </ol>\n'
           '        <div class="adsv__panes">\n' + '\n'.join(panes) + '\n        </div>\n      </div>\n    </div>\n  </div>\n</section>\n')
    return html.replace(sec, new)

MANIFIESTO = '''<section class="adm" id="proceso" data-scene-host aria-labelledby="adm-t">
  <div class="adm__pin">
    <div class="panel panel--dark adm__panel">
      <canvas class="ad-scene" data-scene="idea" aria-hidden="true"></canvas>
      <h2 class="sr" id="adm-t">De la idea al lanzamiento: escuchamos, conectamos, damos forma y lanzamos. Cuatro etapas, un mismo equipo.</h2>
      <p class="adm__k" aria-hidden="true"><i></i>Cómo trabajamos contigo</p>
      <ol class="adm__list">
        <li class="adm__s is-on"><span class="adm__n">Escuchamos</span><p class="adm__h">Pensamos tu idea.</p><p class="adm__d">Una conversación para entender tu negocio, a tu público y lo que quieres lograr.</p></li>
        <li class="adm__s"><span class="adm__n">Conectamos</span><p class="adm__h">La conectamos con tu público.</p><p class="adm__d">Ordenamos la información y definimos la idea central que guía todo el trabajo.</p></li>
        <li class="adm__s"><span class="adm__n">Damos forma</span><p class="adm__h">Le damos forma.</p><p class="adm__d">Diseñamos, producimos y desarrollamos. Ves avances en cada etapa y ajustamos contigo.</p></li>
        <li class="adm__s"><span class="adm__n">Lanzamos</span><p class="adm__h">Y la lanzamos.</p><p class="adm__d">Publicamos, medimos lo que funciona y te entregamos todo listo para usar.</p></li>
      </ol>
      <div class="adm__vis" aria-hidden="true">
        <div class="adm__v adm__chat" data-st="0"><p class="adm__vh"><b>AMUREK</b><span>en línea</span></p><p class="bb bb--in">Hola, cuéntanos: ¿qué quieres lograr este año?</p><p class="bb bb--out">Que nos reconozcan y nos escriban más clientes.</p><p class="bb bb--in">Perfecto. ¿Y cómo quieres que se sienta tu marca?</p><p class="bb bb--out">Cercana, pero profesional.</p></div>
        <div class="adm__v adm__brief" data-st="1"><p class="adm__vh"><b>Brief de marca</b><span>Borrador</span></p><dl><div><dt>Objetivo</dt><dd>Que te reconozcan y te escriban</dd></div><div><dt>Público</dt><dd>Familias que compran en línea</dd></div><div><dt>Tono</dt><dd>Cercano y profesional</dd></div><div><dt>Canales</dt><dd>Instagram, video y web</dd></div></dl><p class="adm__idea"><span>Idea central</span>Cercanía con criterio.</p></div>
        <div class="adm__v adm__media" data-st="2"><figure><img src="assets/ref/n-cards.webp" alt="" loading="lazy"><figcaption><b>Diseñamos</b>Identidad y piezas de marca</figcaption></figure><figure><img src="assets/ref/reel-2.webp" alt="" loading="lazy"><figcaption><b>Producimos</b>Video y fotografía</figcaption></figure><figure><img src="assets/ref/n-laptop.webp" alt="" loading="lazy"><figcaption><b>Desarrollamos</b>Sitios y herramientas</figcaption></figure></div>
        <div class="adm__v adm__launch" data-st="3"><p><i></i><b>Campaña publicada</b><span>Piezas en circulación</span></p><p><i></i><b>Contenido en línea</b><span>Reels y publicaciones</span></p><p><i></i><b>Resultados</b><span>Medimos y ajustamos</span></p></div>
      </div>
      <a class="btn btn--light adm__cta" href="contacto.html"><span>Cotiza tu proyecto</span><i class="dot"></i></a>
    </div>
  </div>
</section>
'''

FAN = '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><filter id="ad-duo" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=".33 .33 .33 0 0 .33 .33 .33 0 0 .33 .33 .33 0 0 0 0 0 1 0"/><feComponentTransfer><feFuncR type="table" tableValues=".04 .82"/><feFuncG type="table" tableValues=".04 .98"/><feFuncB type="table" tableValues=".04 .88"/></feComponentTransfer></filter></svg>'

def home(html):
    """Orden: promesa → lo que logras → contenido en movimiento → prueba (proyectos) → oferta (servicios) →
    confianza (clientes) → cómo trabajamos → quiénes somos → planes → dudas → cierre."""
    html = re.sub(r'(<a class="skip" href="#main">)', lambda m: PORTAL + FAN + m.group(1), html, count=1)
    html = html.replace('<h2 class="statement__h rv">Ideas con forma.<br>Marcas que se notan.</h2>',
                        '<h2 class="statement__h rv">Tu idea merece<br>una marca que se note.</h2>')
    html = re.sub(r'<p class="statement__p">.*?</p>', lambda m: '<p class="statement__p">Te ayudamos a que la gente te reconozca, te recuerde y te elija. Estrategia, diseño, video y web trabajando juntos para que tu marca crezca.</p>', html, count=1, flags=re.S)
    html = re.sub(r'<p class="work__lead">.*?</p>', lambda m: '<p class="work__lead">Así ayudamos a otras marcas a dar su siguiente paso: identidad, contenido, campañas y web.</p>', html, count=1, flags=re.S)
    html = html.replace('<h2 class="ad-rh__h">Reels que detienen el scroll.</h2>', '<h2 class="ad-rh__h">Contenido que detiene el scroll.</h2>')
    html = re.sub(r'<p class="ad-rh__p">.*?</p>', lambda m: '<p class="ad-rh__p">Reels, videos y piezas pensadas para el teléfono desde el guion: ritmo, texto en pantalla y tu marca desde el primer segundo.</p>', html, count=1, flags=re.S)
    rs = section(html, 'reels')
    if rs:
        inner = re.search(r'<section class="sec" id="reels">(.*)</section>', rs, re.S).group(1)
        inner = re.sub(r'<div class="wrap">\s*(<ul class="reels reels4">.*?</ul>)\s*(?:<div class="rdots".*?</div>\s*)?</div>', lambda m: '<div class="ad-fan">' + m.group(1) + '</div>', inner, count=1, flags=re.S)
        html = html.replace(rs, '<section class="sec ad-reels" id="reels"><div class="ad-rs">' + inner + '</div></section>\n')
    html = html.replace('<i class="plans6__glow" aria-hidden="true"></i>', '<i class="plans6__glow" aria-hidden="true"></i>\n    <canvas class="ad-scene" data-scene="field" aria-hidden="true"></canvas>', 1)
    html = html.replace('<h2 class="plans6__h">Planes</h2>', '<h2 class="plans6__h">Planes</h2>\n    <p class="ad-plans__p">Empieza con un proyecto puntual o crece mes a mes con un equipo creativo a tu lado.</p>', 1)
    html = html.replace('<canvas class="ad-scene" data-scene="forma" aria-hidden="true"></canvas>', '<canvas class="ad-flow" aria-hidden="true"></canvas>', 1)
    html = html.replace('Empieza tu proyecto con nosotros.</h2>', 'Empieza tu proyecto con nosotros<i class="ad-dot ad-cta-dot">.</i></h2>', 1)
    html = servicios(html)
    html = re.sub(r'<span data-count="(\d+)">\1</span>', lambda m: '<span class="ad-num">' + m.group(1) + '</span>', html)
    html = re.sub(r'<a class="foot7__logo"[^>]*>.*?</a>', lambda m: '<p class="ad-claim">Donde tu idea<br>encuentra forma<i class="ad-dot">.</i></p>', html, count=1, flags=re.S)
    proc = section(html, 'proceso')
    if proc: html = html.replace(proc, MANIFIESTO)
    order = ['hacemos', 'showreel', 'reels', 'proyectos', 'servicios', 'testimonios', 'proceso', 'equipo', 'planes', 'faq', 'cta']
    blocks = {k: section(html, k) for k in order}
    first = min(html.index(b) for b in blocks.values() if b)
    for b in blocks.values():
        if b: html = html.replace(b, '', 1)
    return html[:first] + ''.join(blocks[k] for k in order if blocks[k]) + html[first:]

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from paginas import paginas

for f in PAGES:
    src = os.path.join(ORIG, f)
    if not os.path.exists(src): continue
    h = rd(src)
    h = h.replace('<link rel="stylesheet" href="styles.css">', '<link rel="stylesheet" href="styles.css?v=ad' + V + '">\n' + HEAD, 1)
    h = h.replace('</body>', TAIL + '</body>', 1)
    h = re.sub(r'(<div class="hs__bg" aria-hidden="true">.*?</div>\s*<canvas class="hero4__cv" aria-hidden="true"></canvas>)', r'\1\n      <canvas class="ad-scene" data-scene="field" aria-hidden="true"></canvas>', h, count=1, flags=re.S)
    h = re.sub(r'(<div class="panel cta3__panel">.*?<canvas class="dots" aria-hidden="true"></canvas>)', r'\1\n    <canvas class="ad-scene" data-scene="forma" aria-hidden="true"></canvas>', h, count=1, flags=re.S)
    h = journey(h)
    if f == 'index.html': h = home(h)
    h = paginas(f, h, MANIFIESTO)
    h = brand(h)
    h = re.sub(r'(<span class="hs__word">)(.*?)(</span>\s*</p>)', lambda m: m.group(1) + re.sub(r'\.</span>', '<i class="ad-dot">.</i></span>', m.group(2)) + m.group(3), h, count=1, flags=re.S)
    wr(os.path.join(ROOT, f), h)
    print('ok', f)
print('listo')
