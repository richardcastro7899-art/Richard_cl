# -*- coding: utf-8 -*-
"""Páginas internas de AMUREK v3 con la misma dirección de arte del inicio.

Sistema común:
- Hero oscuro con una escena de puntos que «toma forma» (createDotForm en scenes.js).
- Etiquetas con punto redondo (.ad-k), titulares con el punto verde, secciones que alternan oscuro y claro.
- Cierre verde unido al pie y la frase de la marca en el pie.
Se llama desde aplicar.py después de armar cada página.
"""
import re, json, html as H

AR = '<svg class="ar" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>'
DUO = '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><filter id="ad-duo" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=".33 .33 .33 0 0 .33 .33 .33 0 0 .33 .33 .33 0 0 0 0 0 1 0"/><feComponentTransfer><feFuncR type="table" tableValues=".04 .82"/><feFuncG type="table" tableValues=".04 .98"/><feFuncB type="table" tableValues=".04 .88"/></feComponentTransfer></filter></svg>'
CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>'


def sec(html, sid=None, cls=None):
    pat = r'<section[^>]*id="%s"[^>]*>.*?</section>\s*' % sid if sid else r'<section class="%s"[^>]*>.*?</section>\s*' % re.escape(cls)
    m = re.search(pat, html, re.S)
    return m.group(0) if m else ''


def strip(s):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', s)).strip()


def reorder(html, keys):
    blocks = [(k, sec(html, k)) for k in keys]
    blocks = [(k, b) for k, b in blocks if b]
    if not blocks: return html
    first = min(html.index(b) for _, b in blocks)
    for _, b in blocks: html = html.replace(b, '', 1)
    return html[:first] + ''.join(b for _, b in blocks) + html[first:]


# ---------- común a todas las páginas internas ----------
def comun(html):
    # cierre verde con la trama de puntos que se vuelve el pie
    html = html.replace('<canvas class="ad-scene" data-scene="forma" aria-hidden="true"></canvas>', '<canvas class="ad-flow" aria-hidden="true"></canvas>', 1)
    html = html.replace('Empieza tu proyecto con nosotros.</h2>', 'Empieza tu proyecto con nosotros<i class="ad-dot ad-cta-dot">.</i></h2>', 1)
    # filtro de duotono (las imágenes van en grafito y muestran su color al pasar el cursor)
    html = re.sub(r'(<a class="skip" href="#main">)', lambda m: DUO + m.group(1), html, count=1)
    # pie: la frase de la marca en lugar del logo
    html = re.sub(r'<a class="foot7__logo"[^>]*>.*?</a>', lambda m: '<p class="ad-claim">Donde tu idea<br>encuentra forma<i class="ad-dot">.</i></p>', html, count=1, flags=re.S)
    return html


def hero_index(label, h1, p, rows, kind, extra=''):
    """Hero con índice: a la izquierda el titular y la lista; al pasar por cada nombre los puntos forman su imagen."""
    return f'''<section class="dxh" id="top" data-dots="index" data-kind="{kind}">
  <canvas class="dxh__cv" aria-hidden="true"></canvas>
  <div class="dxh__in">
    <div class="dxh__text">
      <p class="ad-k">{label}</p>
      <h1 class="dxh__h">{h1}</h1>
      <p class="dxh__p">{p}</p>{extra}
    </div>
    <ol class="dxh__list">
{rows}
    </ol>
  </div>
</section>
'''


# ---------- Servicios ----------
SV_SHORT = {'branding': 'Identidad, voz y sistema visual', 'audiovisual': 'Video, foto y animación', 'redes': 'Contenido y comunidad',
            'marketing': 'Campañas que se miden', 'web': 'Sitios, tiendas y apps'}


def servicios_page(html, MANIFIESTO):
    arts = re.findall(r'<article class="sdet" id="([^"]+)">(.*?)</article>', html, re.S)
    if not arts: return html
    rows, chapters = [], []
    for k, (sid, a) in enumerate(arts):
        name = strip(re.search(r'<h2 class="h2">(.*?)</h2>', a, re.S).group(1))
        pitch = strip(re.search(r'<p class="sdet__pitch">(.*?)</p>', a, re.S).group(1))
        cols = re.findall(r'<p class="sdet__h">(.*?)</p><ul>(.*?)</ul>', a, re.S)
        ideal = re.search(r'<span>Ideal para</span>(.*?)</p>', a, re.S)
        cta = re.search(r'<a class="btn[^"]*" href="([^"]+)"><span>(.*?)</span>', a, re.S)
        tags = re.findall(r'<li>([^<]+)</li>', re.search(r'<ul class="tags[^"]*">(.*?)</ul>', a, re.S).group(1))
        img = re.search(r'<img[^>]*src="([^"]+)"', a)
        vid = re.search(r'<video[^>]*poster="([^"]+)"[^>]*>(.*?)</video>', a, re.S)
        still = img.group(1) if img else vid.group(1)
        media = (f'<video muted loop playsinline preload="none" data-autoplay poster="{vid.group(1)}" aria-hidden="true">{vid.group(2)}</video>' if vid
                 else f'<img src="{img.group(1)}" alt="" loading="lazy" decoding="async">')
        rows.append(f'      <li><a class="dxh__row" href="#{sid}" data-dot-k="{k}" data-img="{still}"><span class="dxh__n">{name}</span><span class="dxh__d">{SV_SHORT.get(sid, "")}</span>{AR}</a></li>')
        lists = ''.join(f'<div><p class="ad-k">{strip(t)}</p><ul class="svx__ul">' + ''.join(f'<li><i>{CHECK}</i>{strip(li)}</li>' for li in re.findall(r'</i>(.*?)</li>', ul, re.S)) + '</ul></div>' for t, ul in cols)
        theme = 'light' if k % 2 == 0 else 'dark'
        chapters.append(f'''<section class="svx svx--{theme}" id="{sid}">
  <div class="svx__in">
    <div class="svx__head">
      <p class="ad-k">Servicio</p>
      <h2 class="svx__h">{name}<i class="ad-dot">.</i></h2>
      <p class="svx__p">{pitch}</p>
      <ul class="svx__tags">{''.join(f'<li>{t.strip()}</li>' for t in tags)}</ul>
      <a class="btn {'btn--dark' if theme == 'light' else 'btn--light'}" href="{cta.group(1)}"><span>{cta.group(2)}</span><i class="dot"></i></a>
    </div>
    <div class="svx__body">
      <figure class="svx__m">{media}</figure>
      <div class="svx__cols">{lists}</div>
      {f'<p class="svx__ideal"><span class="ad-k">Ideal para</span>{strip(ideal.group(1))}</p>' if ideal else ''}
    </div>
  </div>
</section>
''')
    hero = hero_index('Servicios', 'Cinco servicios,<br>una sola idea<i class="ad-dot">.</i>',
                      'Contrata uno solo o arma el equipo completo. Todo trabaja junto porque nace de la misma estrategia.', '\n'.join(rows), 'servicios')
    top = sec(html, 'top'); body = re.search(r'<section class="sec sec--top0">.*?</section>\s*', html, re.S).group(0)
    html = html.replace(top, hero, 1).replace(body, ''.join(chapters), 1)
    pst = sec(html, 'proceso')
    if pst: html = html.replace(pst, MANIFIESTO, 1)
    html = html.replace('<i class="plans6__glow" aria-hidden="true"></i>', '<i class="plans6__glow" aria-hidden="true"></i>\n    <canvas class="ad-scene" data-scene="field" aria-hidden="true"></canvas>', 1)
    html = html.replace('<h2 class="plans6__h">Planes</h2>', '<h2 class="plans6__h">Planes</h2>\n    <p class="ad-plans__p">Empieza con un proyecto puntual o crece mes a mes con un equipo creativo a tu lado.</p>', 1)
    return reorder(html, ['top'] + [s for s, _ in arts] + ['proceso', 'faq', 'planes', 'cta'])


# ---------- Proyectos ----------
def proyectos_page(html):
    cards = re.findall(r'<button type="button" class="gcard" data-cats="([^"]+)" data-project="([^"]+)" aria-label="([^"]+)">(.*?)</button>', html, re.S)
    rows = []
    for k, (cats, proj, aria, inner) in enumerate(cards):
        d = json.loads(H.unescape(proj))
        still = (d.get('items') or [d.get('poster')])[0]
        rows.append(f'      <li><button type="button" class="dxh__row" data-dot-k="{k}" data-img="{still}" data-project="{proj}" aria-label="{aria}"><span class="dxh__n">{d["t"]}</span><span class="dxh__d">{d["s"]} · {d["sub"]}</span>{AR}</button></li>')
    hero = hero_index('Trabajo reciente', 'Proyectos<br>seleccionados<i class="ad-dot">.</i>',
                      'Cada proyecto empieza como una idea suelta. Aquí está lo que pasa cuando encuentra su forma.', '\n'.join(rows), 'proyectos')
    html = html.replace(sec(html, 'top'), hero, 1)
    # la galería completa, en sección clara y con su propio titular
    grid = re.search(r'<section class="sec sec--top0">\s*<div class="wrap">\s*<div class="filters', html, re.S)
    if grid:
        html = html.replace(grid.group(0), '<section class="sec pgx" id="galeria">\n  <div class="wrap pgx__head"><p class="ad-k">Galería</p><h2 class="pgx__h">Todo el trabajo<i class="ad-dot">.</i></h2><p class="pgx__p">Filtra por servicio y abre cada proyecto para verlo completo.</p></div>\n  <div class="wrap">\n    <div class="filters', 1)
    # reels: el mismo abanico del inicio
    rs = sec(html, 'reels')
    if rs:
        inner = re.search(r'<section class="sec" id="reels">(.*)</section>', rs, re.S)
        if inner:
            body = re.sub(r'<div class="wrap">\s*(<ul class="reels reels4">.*?</ul>)\s*(?:<div class="rdots".*?</div>\s*)?</div>', lambda m: '<div class="ad-fan">' + m.group(1) + '</div>', inner.group(1), count=1, flags=re.S)
            html = html.replace(rs, '<section class="sec ad-reels" id="reels"><div class="ad-rs">' + body + '</div></section>\n')
    return html


# ---------- Nosotros ----------
def nosotros_page(html):
    hero = '''<section class="dxh dxh--iso" id="top" data-dots="iso">
  <canvas class="dxh__cv" aria-hidden="true"></canvas>
  <h1 class="sr">Nosotros: el estudio de AMUREK, agencia creativa en Ecuador.</h1>
  <div class="dxh__in">
    <div class="dxh__text">
      <p class="ad-k">Nosotros</p>
      <p class="dxh__h" aria-hidden="true">Nuestro<br>estudio<i class="ad-dot">.</i></p>
      <p class="dxh__p">Un equipo pequeño a propósito: hablas con quien piensa y hace tu proyecto.</p>
      <ul class="dxh__meta"><li>Agencia creativa</li><li>Ecuador</li><li>Cinco servicios, un equipo</li></ul>
    </div>
  </div>
</section>
'''
    html = html.replace(sec(html, 'top'), hero, 1)
    about = re.search(r'<section class="pad aboutg">.*?</section>\s*', html, re.S)
    if about:
        t = strip(re.search(r'<p class="aboutg__t">(.*?)</p>', about.group(0), re.S).group(1))
        html = html.replace(about.group(0), f'''<section class="mfx" id="estudio">
  <div class="wrap mfx__in">
    <p class="ad-k">Quiénes somos</p>
    <p class="mfx__t" data-words>{t}</p>
  </div>
</section>
''', 1)
    vals = re.search(r'<section class="sec sec--top0">\s*<div class="wrap values">.*?</section>\s*', html, re.S)
    if vals:
        items = re.findall(r'<h3>(.*?)</h3><p>(.*?)</p>', vals.group(0))
        glyph = ['idea', 'coherencia', 'medida', 'directo']
        lis = '\n'.join(f'      <li class="vlx__i"><canvas class="vlx__cv" data-glyph="{glyph[i % 4]}" aria-hidden="true"></canvas><h3>{a}</h3><p>{b}</p></li>' for i, (a, b) in enumerate(items))
        html = html.replace(vals.group(0), f'''<section class="vlx" id="valores">
  <div class="wrap vlx__in">
    <div class="vlx__head"><p class="ad-k">Lo que nos guía</p><h2 class="vlx__h">Cuatro ideas que guían<br>todo lo que hacemos<i class="ad-dot">.</i></h2><p class="vlx__p">Son la forma en que decidimos qué hacer, y qué no, en cada proyecto.</p></div>
    <ol class="vlx__list">
{lis}
    </ol>
  </div>
</section>
''', 1)
    enf = sec(html, 'enfoque')
    if enf: html = html.replace(enf, '', 1)
    return reorder(html, ['top', 'estudio', 'valores', 'equipo', 'cta'])


# ---------- Contacto ----------
def contacto_page(html):
    con = sec(html, 'top')
    if not con: return html
    form = re.search(r'<form class="form" id="form".*?</form>', con, re.S).group(0)
    lst = re.search(r'<ul class="connect__list">(.*?)</ul>', con, re.S).group(1)
    info = re.search(r'<ul class="connect__info">.*?</ul>', con, re.S).group(0)
    lead = strip(re.search(r'<p class="connect__lead">(.*?)</p>', con, re.S).group(1))
    new = f'''<section class="dxc" id="top" data-dots="idea">
  <h1 class="sr">Contacto</h1>
  <div class="wrap dxc__in">
    <div class="dxc__side">
      <p class="ad-k">Hablemos</p>
      <p class="dxc__h" aria-hidden="true">Cuéntanos<br>tu idea<i class="ad-dot">.</i></p>
      <p class="dxc__p">{lead}</p>
      <div class="dxc__stage"><canvas class="dxh__cv dxc__cv" aria-hidden="true"></canvas></div>
      <ul class="dxc__list">{lst}</ul>
      {info}
    </div>
    <div class="dxc__form">
      {form}
    </div>
  </div>
</section>
'''
    return html.replace(con, new, 1)


# ---------- Legales ----------
def legal_page(html):
    top = sec(html, 'top')
    art = re.search(r'<article class="legal wrap">(.*?)</article>', html, re.S)
    if not top or not art: return html
    h1 = strip(re.search(r'<h1[^>]*>(.*?)</h1>', top, re.S).group(1))
    sub = strip(re.search(r'<p class="h3">(.*?)</p>', top, re.S).group(1))
    body, toc, n = art.group(1), [], 0
    def h2(m):
        nonlocal n
        n += 1; t = strip(m.group(1)); toc.append(f'<li><a href="#s{n}">{t}</a></li>')
        return f'<h2 id="s{n}">{m.group(1)}</h2>'
    body = re.sub(r'<h2>(.*?)</h2>', h2, body)
    html = html.replace(top, f'''<section class="lgx" id="top">
  <div class="wrap lgx__in">
    <p class="ad-k">Legal</p>
    <h1 class="lgx__h">{h1}<i class="ad-dot">.</i></h1>
    <p class="lgx__p">{sub}</p>
  </div>
</section>
''', 1)
    html = html.replace(art.group(0), f'''<section class="lgb">
  <div class="wrap lgb__in">
    <nav class="lgb__toc" aria-label="En esta página"><p class="ad-k">En esta página</p><ol>{''.join(toc)}</ol></nav>
    <article class="legal">{body}</article>
  </div>
</section>''', 1)
    return html


def paginas(name, html, MANIFIESTO):
    if name == 'index.html': return html
    html = comun(html)
    if name == 'servicios.html': html = servicios_page(html, MANIFIESTO)
    elif name == 'proyectos.html': html = proyectos_page(html)
    elif name == 'nosotros.html': html = nosotros_page(html)
    elif name == 'contacto.html': html = contacto_page(html)
    elif name in ('privacidad.html', 'terminos.html', 'cookies.html'): html = legal_page(html)
    return html
