/* =========================================================
   AMUREK v3 · dirección de arte (se carga después de main.js de amurek.com)
   - Entrada: una pantalla solo para la red neuronal. Cada scroll muestra una idea de proyecto;
     al final, «Mantén para entrar» y la cámara atraviesa la red hasta la web.
   - Escenas WebGL por sección (scenes.js), scroll suave (Lenis) + GSAP ScrollTrigger.
   - Showreel que entra en el titular de los reels · bloque «De la idea al lanzamiento» en 4 etapas.
   - Capítulo de noche (servicios → proceso → testimonios) que se abre de borde a borde.
   ========================================================= */
import { mountScenes, createPortal, createDotForm } from './scenes.js?v=47';

const H = document.documentElement;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const still = /[?&]still/.test(location.search);
const reduce = () => still || matchMedia('(prefers-reduced-motion: reduce)').matches || H.classList.contains('motion-off');
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const G = window.gsap, ST = window.ScrollTrigger;
H.classList.add('ad');

const hasGL = (() => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; } })();

/* ---------- entrada ---------- */
const portalEl = $('#portal');
let seen = false; try { seen = !!sessionStorage.getItem('amurek-portal'); } catch {}
const wantPortal = !!(portalEl && hasGL && G && !reduce() && !location.hash && (/[?&]intro/.test(location.search) || !seen));
if (wantPortal) H.classList.add('adp-on'); else if (portalEl) portalEl.remove();

if (hasGL && $$('canvas[data-scene]').length) { H.classList.add('ad-3d'); mountScenes(); }

let lenis = null;
if (G && ST) {
  G.registerPlugin(ST);
  if (window.Lenis && !reduce()) {
    lenis = new window.Lenis({ lerp: .11, smoothWheel: true });
    lenis.on('scroll', ST.update);
    G.ticker.add((t) => lenis.raf(t * 1000)); G.ticker.lagSmoothing(0);
    const sync = () => { const lock = H.classList.contains('pre-on') || H.classList.contains('adp-on') || H.style.overflow === 'hidden'; lock ? lenis.stop() : lenis.start(); };
    new MutationObserver(sync).observe(H, { attributes: true, attributeFilter: ['class', 'style'] }); sync();
  }
  journey(); manifesto(); chapters(); dotField(); reelsFan();
  addEventListener('load', () => ST.refresh());
  document.fonts && document.fonts.ready.then(() => ST.refresh());
} else {
  $('.adj') && $('.adj').classList.add('is-static');
  const m = $('.adm'); m && (m.classList.add('is-static'), $$('.adm__s, .adm__v', m).forEach((s) => s.classList.add('is-on')));
}
[services, statsForm, ctaFlow, dotPages, wordsReveal, mediaReveal, glyphs, legalToc].forEach((fn) => { try { fn(); } catch (e) { console.error(e); } });
if (wantPortal) portal();
cursor();
window.__ad = { lenis };

/* =========================================================
   ENTRADA
   ========================================================= */
function portal() {
  const P = portalEl; P.hidden = false; P.tabIndex = -1;
  const sts = $$('.adp__st', P), hold = $('.adp__hold', P);
  // las imágenes de los proyectos: los puntos las forman en semitono
  const imgs = [1, 2, 3].map((n) => { const c = $(`.adp__card[data-node="${n}"]`, P), i = c && $('img', c), v = c && $('video', c); return i ? i.getAttribute('src') : v ? v.getAttribute('poster') : null; });
  const api = createPortal($('.adp__cv', P), { images: imgs });
  const LAST = 4, MOBP = () => innerWidth < 760;
  let step = -1, last = 0, done = false, ready = false;
  const cardPos = new Map();

  const show = (k) => {
    sts.forEach((s) => s.classList.toggle('is-on', +s.dataset.st === k));
    P.classList.toggle('is-card', k >= 1 && k <= 3); P.classList.toggle('is-last', k === LAST);
  };
  const go = (k) => { k = Math.max(0, Math.min(LAST, k)); if (k === step) return; step = k; show(k); api.go(k); };
  const nav = (d) => {
    if (!ready || done) return; const now = performance.now(); if (now - last < 1250) return; last = now;
    if (d > 0 && step === LAST) return enter(); go(step + d);
  };
  const start = () => { if (ready) return; ready = true; P.classList.add('is-ready'); go(0); P.focus({ preventScroll: true }); };
  // el texto de la entrada aparece cuando el telón de la pantalla de carga termina de subir
  if (H.classList.contains('pre-on')) { const pre = $('#pre'); const mo = new MutationObserver(() => { if (!H.classList.contains('pre-on') || (pre && pre.classList.contains('is-out'))) { mo.disconnect(); setTimeout(start, 520); } });
    mo.observe(H, { attributes: true, attributeFilter: ['class'] }); pre && mo.observe(pre, { attributes: true, attributeFilter: ['class'] }); }
  else setTimeout(start, 300);

  // scroll, toque y teclado
  let acc = 0, accT = 0;
  const onWheel = (e) => { if (done) return; e.preventDefault(); const now = performance.now(); if (now - accT > 220) acc = 0; accT = now; acc += e.deltaY; if (Math.abs(acc) > 36) { nav(Math.sign(acc)); acc = 0; } };
  addEventListener('wheel', onWheel, { passive: false });
  let ty = null; const onTS = (e) => { ty = e.touches[0].clientY; }, onTE = (e) => { if (ty == null) return; const dy = ty - e.changedTouches[0].clientY; if (Math.abs(dy) > 40) nav(Math.sign(dy)); ty = null; };
  P.addEventListener('touchstart', onTS, { passive: true }); P.addEventListener('touchend', onTE, { passive: true });
  P.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
  const onKey = (e) => {
    if (done) return;
    if (['ArrowDown', 'PageDown', ' '].includes(e.key) && !(e.target.closest && e.target.closest('button'))) { e.preventDefault(); nav(1); }
    else if (['ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); nav(-1); }
    else if (e.key === 'Escape') enter(true);
  };
  addEventListener('keydown', onKey);
  // un clic sobre la escena lanza una onda entre los puntos
  P.addEventListener('pointerdown', (e) => { if (done || (e.target.closest && e.target.closest('button, a'))) return; api.ripple(e.clientX, e.clientY); });

  hold.addEventListener('click', () => enter());
  const goBtn = document.createElement('button'); goBtn.type = 'button'; goBtn.className = 'adp__hold adp__go'; goBtn.innerHTML = '<span>Entrar</span><i aria-hidden="true"></i>';
  goBtn.addEventListener('click', () => enter()); P.append(goBtn);

  // el texto de cada proyecto se ubica junto a la imagen que forman los puntos
  const tick = () => {
    if (done) return; requestAnimationFrame(tick);
    const card = sts.find((s) => s.classList.contains('is-on') && s.dataset.node); if (!card) return;
    const R = api.rect(+card.dataset.node), W = innerWidth, Hh = innerHeight, cw = card.offsetWidth, ch = card.offsetHeight;
    let tx, ty2;
    if (MOBP()) { tx = (W - cw) / 2; ty2 = Math.min(Hh - ch - 88, R.y + R.h + 28); }
    else { const left = card.classList.contains('adp__card--l'); tx = left ? R.x - 64 - cw : R.x + R.w + 64; ty2 = R.y + R.h / 2 - ch / 2; tx = Math.max(24, Math.min(W - cw - 24, tx)); ty2 = Math.max(90, Math.min(Hh - ch - 90, ty2)); }
    const c = cardPos.get(card) || { x: tx, y: ty2 }; c.x += (tx - c.x) * .2; c.y += (ty2 - c.y) * .2; cardPos.set(card, c);
    card.style.transform = `translate3d(${c.x.toFixed(1)}px,${c.y.toFixed(1)}px,0)`;
  };
  tick();

  function enter(skip) {
    if (done) return; done = true;
    try { sessionStorage.setItem('amurek-portal', '1'); } catch {}
    removeEventListener('wheel', onWheel); removeEventListener('keydown', onKey);
    P.classList.add('is-leaving');
    scrollTo(0, 0); lenis && lenis.scrollTo(0, { immediate: true, force: true });
    const reveal = () => { H.classList.remove('adp-on'); P.style.visibility = 'hidden'; arrive(); };
    if (skip) { H.classList.remove('adp-on'); arrive(); G.to(P, { opacity: 0, duration: .8, ease: 'power2.out', onComplete: () => { api.destroy(); P.remove(); } }); return; }
    // los puntos pasan junto a la cámara, todo se enciende en un destello y detrás está la web
    const fl = document.createElement('i'); fl.className = 'adp__flash'; fl.setAttribute('aria-hidden', 'true'); document.body.append(fl);
    G.timeline({ onComplete: () => { api.destroy(); P.remove(); fl.remove(); } })
      .to(api.S, { warp: 1, duration: 1.35, ease: 'power3.in' }, 0)
      .to(fl, { opacity: 1, duration: .3, ease: 'power2.in' }, 1.05)
      .add(reveal, 1.36)
      .to(fl, { opacity: 0, duration: 1.1, ease: 'power2.out' }, 1.46);
  }
}

/* la web aparece en orden desde el destello: primero el logo y «Agencia Creativa», luego la seda, el texto y la barra */
function arrive() {
  ST && ST.refresh();
  if (!G) return;
  const logo = $$('#nav .nav__fly, .ht__logo'), tag = $$('#nav .nav__fly2, .ht__r');
  const bg = $$('#heroPanel .hero4__cv, #heroPanel .hs__bg, #heroPanel > .ad-scene'), txt = $$('.hero4__top > *, .hero4__bot > *');
  const bar = $$('#nav .nav__in'), extra = $$('#heroPanel .hcard');
  G.timeline({ defaults: { ease: 'power3.out' } })
    .fromTo(logo, { opacity: 0, translate: '0px 40px', filter: 'blur(14px)' }, { opacity: 1, translate: '0px 0px', filter: 'blur(0px)', duration: 1.15, clearProps: 'opacity,translate,filter' }, .05)
    .fromTo(tag, { opacity: 0, translate: '0px 28px', filter: 'blur(10px)' }, { opacity: 1, translate: '0px 0px', filter: 'blur(0px)', duration: 1, clearProps: 'opacity,translate,filter' }, .25)
    .fromTo(bg, { opacity: 0, scale: 1.18 }, { opacity: 1, scale: 1, duration: 2.1, ease: 'expo.out', clearProps: 'opacity,scale' }, .4)
    .fromTo(txt, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .9, stagger: .08, clearProps: 'opacity,transform' }, .65)
    .fromTo(bar, { opacity: 0 }, { opacity: 1, duration: .8, clearProps: 'opacity' }, .95)
    .fromTo(extra, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .8, clearProps: 'opacity,transform' }, 1.1);
}

/* =========================================================
   SHOWREEL → titular de los reels
   ========================================================= */
function journey() {
  const J = $('.adj'); if (!J) return;
  if (innerWidth <= 900 || reduce()) { J.classList.add('is-static'); return; }
  const pin = $('.adj__pin', J), box = $('.adj__box', J), slot = $('.adj__slot', J);
  const wl = $('.adj__w--l', J), wr = $('.adj__w--r', J), words = $$('.adj__hw, .adj__k', J), play = $('.reel__play', box);
  const R0 = () => { const W = pin.clientWidth, Hh = pin.clientHeight, w = Math.min(W * .24, 400), h = w * .62; return { left: (W - w) / 2, top: (Hh - h) / 2 + Hh * .05, width: w, height: h, borderRadius: 8 }; };
  const R1 = () => ({ left: 0, top: 0, width: pin.clientWidth, height: pin.clientHeight, borderRadius: 0 });
  const R2 = () => { let x = 0, y = 0, el = slot; while (el && el !== pin) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; } return { left: x, top: y, width: slot.offsetWidth, height: slot.offsetHeight, borderRadius: 6 }; };
  const fn = (R) => ({ left: () => R().left, top: () => R().top, width: () => R().width, height: () => R().height, borderRadius: () => R().borderRadius });
  const place = () => { const r = R0(), g = Math.max(16, innerWidth * .012); wl.style.left = (r.left - g - wl.offsetWidth) + 'px'; wr.style.left = (r.left + r.width + g) + 'px'; wl.style.top = wr.style.top = (r.top + r.height / 2) + 'px'; };
  place(); G.set(box, R0());
  G.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: J, start: 'top top', end: 'bottom bottom', scrub: .6, invalidateOnRefresh: true, onRefresh: place, onUpdate: (s) => J.classList.toggle('is-end', s.progress > .74) } })
    .fromTo(box, fn(R0), { ...fn(R1), duration: .34, ease: 'power2.inOut' }, 0)
    .to(wl, { x: () => -innerWidth * .34, opacity: 0, duration: .26, ease: 'power2.in' }, 0)
    .to(wr, { x: () => innerWidth * .34, opacity: 0, duration: .26, ease: 'power2.in' }, 0)
    .to(play, { opacity: 0, scale: .9, duration: .08 }, .5)
    .to(box, { ...fn(R2), duration: .3, ease: 'power3.inOut' }, .52)
    .fromTo(words, { opacity: 0, y: 48 }, { opacity: 1, y: 0, duration: .16, stagger: .05, ease: 'power2.out' }, .66)
    .to({}, { duration: .14 }, .86);
}

/* =========================================================
   DE LA IDEA AL LANZAMIENTO · 4 etapas con la escena 3D
   ========================================================= */
function manifesto() {
  const M = $('.adm'); if (!M) return;
  const steps = $$('.adm__s', M), vis = $$('.adm__v', M), bars = $$('.adm__bar i', M);
  if (reduce()) { M.classList.add('is-static'); [...steps, ...vis].forEach((s) => s.classList.add('is-on')); return; }
  let cur = -1;
  const set = (k) => { if (k === cur) return; cur = k; steps.forEach((s, i) => s.classList.toggle('is-on', i === k)); vis.forEach((v) => v.classList.toggle('is-on', +v.dataset.st === k)); bars.forEach((b, i) => b.classList.toggle('is-on', i <= k)); };
  set(0);
  ST.create({ trigger: M, start: 'top top', end: 'bottom bottom', onUpdate: (s) => set(s.progress < .2 ? 0 : s.progress < .47 ? 1 : s.progress < .77 ? 2 : 3) });
}

/* =========================================================
   Paneles: servicios se abre de borde a borde al salir de proyectos; el cierre entra como panel
   ========================================================= */
function chapters() {
  if (reduce()) return;
  const side = () => (innerWidth > 900 ? 4 : 2.5);
  const open = (el, endR = 0, startR = 18) => G.fromTo(el, { clipPath: () => `inset(0px ${side()}% 0px ${side()}% round ${startR}px)` }, {
    clipPath: `inset(0px 0% 0px 0% round ${endR}px)`, ease: 'none', scrollTrigger: { trigger: el, start: 'top 98%', end: 'top 30%', scrub: true, invalidateOnRefresh: true } });
  const sv = $('#servicios.adsv'); sv && open(sv, 0);
}

/* =========================================================
   Fondo del showreel: el punto de la marca, multiplicado.
   - Los puntos respiran con un flujo orgánico; cada tanto una idea «se enciende» y su onda empuja a los demás.
   - Unos pocos puntos verdes viajan más lejos y se conectan entre sí (ideas que se encuentran).
   - Al llegar al titular, todos se ordenan en corrientes que cruzan la pantalla de lado a lado: ideas en movimiento.
   ========================================================= */
function dotField() {
  const J = $('.adj'), cv = J && $('.adj__bg', J); if (!cv) return;
  const x = cv.getContext('2d'); let W = 0, Hh = 0, dpr = 1, pts = [], on = false, mx = -9999, my = -9999;
  const pulses = []; let nextPulse = 0;
  const build = () => {
    dpr = Math.min(devicePixelRatio || 1, 2); W = cv.clientWidth; Hh = cv.clientHeight; cv.width = W * dpr; cv.height = Hh * dpr;
    const g = W < 700 ? 24 : 30; pts = [];
    for (let yy = g / 2; yy < Hh; yy += g) for (let xx = g / 2; xx < W; xx += g) pts.push({ x: xx, y: yy, s: Math.random(), hot: Math.random() < .016 });
  };
  build(); addEventListener('resize', build);
  new IntersectionObserver(([e]) => (on = e.isIntersecting)).observe(J);
  addEventListener('pointermove', (e) => { const b = cv.getBoundingClientRect(); mx = e.clientX - b.left; my = e.clientY - b.top; }, { passive: true });
  const t0 = performance.now(); let tl = 0;
  const frame = () => {
    requestAnimationFrame(frame); if (!on || document.hidden) return;
    const t = (performance.now() - t0) / 1000, dt = Math.min(.05, t - tl); tl = t;
    const b = J.getBoundingClientRect(), k = Math.min(1, Math.max(0, -b.top / Math.max(1, b.height - innerHeight)));
    const g = k > .6 ? Math.min(1, (k - .6) / .3) : 0, ease = g * g * (3 - 2 * g);
    // una idea que se enciende
    if (t > nextPulse) { const hp = pts.filter((p) => p.hot); const o = hp[Math.floor(Math.random() * hp.length)] || { x: W / 2, y: Hh / 2 }; pulses.push({ x: o.x, y: o.y, r: 0 }); nextPulse = t + 1.4 + Math.random() * 1.2; }
    for (const pu of pulses) pu.r += dt * 260; while (pulses.length && pulses[0].r > Math.max(W, Hh) * .6) pulses.shift();
    x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, W, Hh);
    const gap = Hh / 9, hot = [];
    for (const p of pts) {
      const amp = p.hot ? 34 : 11;
      let px = p.x + (Math.sin(p.y * .012 + t * .7 + p.s * 6) + Math.sin((p.x + p.y) * .004 + t * .4) * .8) * amp;
      let py = p.y + (Math.cos(p.x * .011 + t * .6 + p.s * 5) + Math.cos((p.x - p.y) * .004 - t * .5) * .7) * amp;
      let glow = 0;
      for (const pu of pulses) { const dx = px - pu.x, dy = py - pu.y, d = Math.hypot(dx, dy) || 1, w = Math.exp(-((d - pu.r) ** 2) / 1800) * (1 - pu.r / (Math.max(W, Hh) * .6)); px += dx / d * w * 16; py += dy / d * w * 16; glow += w; }
      if (ease > 0) {   // corrientes que cruzan toda la pantalla
        const band = Math.round(p.y / gap), dir = band % 2 ? 1 : -1, sx = (((p.x + t * 46 * dir) % W) + W) % W;
        const sy = band * gap + Math.sin(sx * .0055 + t * .9 + band * 1.7) * gap * .38 + (p.s - .5) * gap * .25;
        px += (sx - px) * ease; py += (sy - py) * ease;
      }
      const dx = px - mx, dy = py - my, d = Math.hypot(dx, dy); if (d < 130) { const f = (1 - d / 130) * 20; px += dx / (d || 1) * f; py += dy / (d || 1) * f; }
      if (p.hot) { hot.push([px, py]); continue; }
      const wave = Math.sin(p.x * .006 + p.y * .004 - t * 1.3) * .5 + .5;
      x.fillStyle = `rgba(245,245,243,${Math.min(.75, .07 + wave * .13 + glow * .4 + ease * .06).toFixed(3)})`;
      x.beginPath(); x.arc(px, py, .8 + wave * 1 + glow * 1.4, 0, 6.2832); x.fill();
    }
    x.lineWidth = 1;
    for (let i = 0; i < hot.length; i++) for (let jj = i + 1; jj < hot.length; jj++) {
      const d = Math.hypot(hot[i][0] - hot[jj][0], hot[i][1] - hot[jj][1]); if (d > 240) continue;
      x.strokeStyle = `rgba(0,255,139,${((1 - d / 240) * .32).toFixed(3)})`; x.beginPath(); x.moveTo(hot[i][0], hot[i][1]); x.lineTo(hot[jj][0], hot[jj][1]); x.stroke();
    }
    x.fillStyle = '#00FF8B'; for (const [hx, hy] of hot) { x.beginPath(); x.arc(hx, hy, 2 + Math.sin(t * 2.2 + hx) * .6, 0, 6.2832); x.fill(); }
  };
  if (!reduce()) frame();
}

/* =========================================================
   Reels: llegan apilados como en un teléfono y se abren en abanico con el scroll
   ========================================================= */
function reelsFan() {
  const S = $('#reels.ad-reels'); if (!S) return;
  const cards = $$('.ad-fan .rcard', S); if (!cards.length) return;
  if (innerWidth <= 900 || reduce()) { S.classList.add('is-static'); return; }
  const mid = (cards.length - 1) / 2, cw = () => cards[0].offsetWidth;
  cards.forEach((c, i) => G.set(c, { '--fx': `${(i - mid) * 10}px`, '--fy': `${Math.abs(i - mid) * 6}px`, '--fr': `${(i - mid) * 4}deg`, zIndex: 10 - Math.round(Math.abs(i - mid) * 2) }));
  G.timeline({ scrollTrigger: { trigger: S, start: 'top top', end: 'bottom bottom', scrub: .7, invalidateOnRefresh: true } })
    .to(cards, { '--fx': (i) => `${(i - mid) * cw() * 1.12}px`, '--fy': (i) => `${(i - mid) ** 2 * 16}px`, '--fr': (i) => `${(i - mid) * 5}deg`, ease: 'power2.inOut', duration: .8 }, .05)
    .to({}, { duration: .2 });
}

/* =========================================================
   Servicios: los títulos no se mueven; el detalle cambia con un fundido y la ola acompaña el scroll sin saltos
   ========================================================= */
function services() {
  const S = $('#servicios.adsv'); if (!S) return;
  const items = $$('.adsv__s', S), panes = $$('.adsv__pane', S), cv = $('.adsv__cv', S); let cur = -1;
  const set = (k) => {
    if (k === cur) return; cur = k;
    items.forEach((it, i) => { it.classList.toggle('is-on', i === k); $('.adsv__t', it).setAttribute('aria-expanded', String(i === k)); });
    panes.forEach((p, i) => { p.classList.toggle('is-on', i === k); p.classList.toggle('is-up', i < k); p.inert = i !== k; });
  };
  set(0); cv && (cv.dataset.active = 0);
  if (ST && innerWidth > 900 && !reduce()) {
    S.classList.add('is-pinned');
    const n = items.length;
    ST.create({ trigger: S, start: 'top top', end: 'bottom bottom', invalidateOnRefresh: true, onUpdate: (s) => {
      const v = Math.min(n - 1, s.progress * n * 1.04); set(Math.min(n - 1, Math.floor(v)));
      cv && (cv.dataset.active = Math.max(0, v - .5).toFixed(3));
    } });
    items.forEach((it, i) => $('.adsv__t', it).addEventListener('click', () => {
      const y = S.getBoundingClientRect().top + scrollY + (S.offsetHeight - innerHeight) * ((i + .5) / n / 1.04);
      lenis ? lenis.scrollTo(y, { duration: 1.4 }) : scrollTo({ top: y, behavior: 'smooth' });
    }));
  } else items.forEach((it, i) => $('.adsv__t', it).addEventListener('click', () => { set(i); cv && (cv.dataset.active = i); }));
}

/* =========================================================
   Cifras: cada número se arma con puntos que llegan dispersos y encuentran su forma (la idea de la marca), luego queda el texto nítido
   ========================================================= */
function statsForm() {
  const L = $('#testimonios .tsm__stats'); if (!L || reduce()) return;
  const bs = $$('b', L); if (!bs.length) return;
  L.classList.add('is-form');
  const go = () => bs.forEach((b, i) => setTimeout(() => form(b), i * 180));
  const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); (document.fonts ? document.fonts.ready : Promise.resolve()).then(go); } }, { threshold: .6 });
  io.observe(L);
  function form(b) {
    const cs = getComputedStyle(b), dpr = Math.min(devicePixelRatio || 1, 2), M = 28;
    const mk = document.createElement('i'); mk.className = 'ad-mk'; b.prepend(mk);
    const br = b.getBoundingClientRect(), mr = mk.getBoundingClientRect(); mk.remove();
    const W = Math.ceil(br.width) + M * 2, Hh = Math.ceil(br.height) + M * 2, bx = mr.left - br.left + M, by = mr.bottom - br.top + M;
    const off = document.createElement('canvas'); off.width = W; off.height = Hh; const o = off.getContext('2d');
    o.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`; try { o.letterSpacing = cs.letterSpacing; } catch {}
    o.fillStyle = '#000'; o.textBaseline = 'alphabetic';
    const tw = document.createTreeWalker(b, NodeFilter.SHOW_TEXT), rg = document.createRange();
    for (let nd = tw.nextNode(); nd; nd = tw.nextNode()) for (let c = 0; c < nd.length; c++) {
      const ch = nd.data[c]; if (!ch.trim()) continue; rg.setStart(nd, c); rg.setEnd(nd, c + 1);
      const cr = rg.getBoundingClientRect(); o.fillText(ch, cr.left - br.left + M, by);
    }
    const data = o.getImageData(0, 0, W, Hh).data, fs = parseFloat(cs.fontSize), g = Math.max(2.5, fs / 15), pts = [];
    for (let yy = 0; yy < Hh; yy += g) for (let xx = 0; xx < W; xx += g) if (data[(Math.floor(yy) * W + Math.floor(xx)) * 4 + 3] > 140) {
      const a = Math.random() * 6.283, d = 24 + Math.random() * 70;
      pts.push({ x: xx, y: yy, sx: xx + Math.cos(a) * d - 18, sy: yy + Math.sin(a) * d * .55, dl: (xx / W) * .35 + Math.random() * .18, gr: Math.random() < .08 });
    }
    const cv = document.createElement('canvas'); cv.className = 'ad-numcv'; cv.setAttribute('aria-hidden', 'true');
    cv.width = W * dpr; cv.height = Hh * dpr; cv.style.cssText = `width:${W}px;height:${Hh}px;left:${-M}px;top:${-M}px`;
    b.append(cv); const x = cv.getContext('2d'); x.scale(dpr, dpr);
    const ink = getComputedStyle(b.closest('section') || b.parentElement).getPropertyValue('--ink').trim() || '#0A0A0A', green = getComputedStyle(H).getPropertyValue('--ad-g2').trim() || '#007A46', t0 = performance.now(), T = 1.25;
    const ez = (v) => 1 - Math.pow(1 - v, 4);
    const frame = () => {
      const t = (performance.now() - t0) / 1000; x.clearRect(0, 0, W, Hh);
      let left = false;
      for (const p of pts) {
        const k = Math.max(0, Math.min(1, (t - p.dl) / (T - .35))); if (k < 1) left = true;
        const e = ez(k), px = p.sx + (p.x - p.sx) * e, py = p.sy + (p.y - p.sy) * e;
        x.globalAlpha = .35 + e * .65; x.fillStyle = p.gr && k < 1 ? green : ink;
        x.beginPath(); x.arc(px, py, g * (.3 + e * .2), 0, 6.2832); x.fill();
      }
      if (left || t < T) return requestAnimationFrame(frame);
      b.classList.add('is-done'); cv.classList.add('is-out'); setTimeout(() => cv.remove(), 700);
    };
    requestAnimationFrame(frame);
  }
}

/* =========================================================
   Cierre: fondo verde de la marca. Una trama de puntos negros (el punto de la marca) crece hacia abajo
   hasta volverse el negro del pie, así el cierre y el pie son una sola pieza. La trama respira y el cursor la mueve.
   ========================================================= */
function ctaFlow() {
  const S = $('#cta'), cv = S && $('.ad-flow', S); if (!cv) return;
  const x = cv.getContext('2d'); let W = 0, Hh = 0, dpr = 1, g = 18, on = false, mx = -9999, my = -9999, sx = -9999, sy = -9999;
  const build = () => { dpr = Math.min(devicePixelRatio || 1, 2); W = cv.clientWidth; Hh = cv.clientHeight; cv.width = W * dpr; cv.height = Hh * dpr; g = W < 700 ? 13 : 17; draw(0); };
  new IntersectionObserver(([e]) => (on = e.isIntersecting)).observe(cv);
  addEventListener('pointermove', (e) => { const b = cv.getBoundingClientRect(); mx = e.clientX - b.left; my = e.clientY - b.top; }, { passive: true });
  const ss = (a, b, v) => { const k = Math.max(0, Math.min(1, (v - a) / (b - a))); return k * k * (3 - 2 * k); };
  function draw(t) {
    x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, W, Hh); x.fillStyle = '#0A0A0A';
    const rmax = g * .74, fine = new Path2D(); x.beginPath();
    for (let yy = g / 2; yy < Hh + g; yy += g) {
      const v = yy / Hh;
      for (let xx = (Math.round(yy / g) % 2) * g / 2; xx < W + g; xx += g) {
        const wave = Math.sin(xx * .006 + t * .55) * .045 + Math.sin(xx * .0023 - t * .35 + yy * .004) * .035;
        let k = ss(.58, 1.02, v + wave);
        const d = Math.hypot(xx - sx, yy - sy); if (d < 170) k = Math.max(k, (1 - d / 170) ** 2 * .55);
        if (k < .03) { fine.moveTo(xx + .8, yy); fine.arc(xx, yy, .8, 0, 6.2832); continue; }
        const r = rmax * k; x.moveTo(xx + r, yy); x.arc(xx, yy, r, 0, 6.2832);
      }
    }
    x.fill(); x.globalAlpha = .22; x.fill(fine); x.globalAlpha = 1;
  }
  build(); addEventListener('resize', build);
  if (reduce()) return;
  const t0 = performance.now();
  const frame = () => { requestAnimationFrame(frame); if (!on || document.hidden) return; sx += (mx - sx) * .12; sy += (my - sy) * .12; draw((performance.now() - t0) / 1000); };
  frame();
}

/* =========================================================
   PÁGINAS INTERNAS
   ========================================================= */
// el isotipo («a» con su punto) y el punto solo, dibujados para que los puntos los formen
function drawIso(x, W, Hh) {
  const s = Hh * .84 / 112.17; x.setTransform(s, 0, 0, s, W / 2 - 130.57 * s, Hh / 2 - 144.97 * s);
  x.fillStyle = '#fff'; x.fill(new Path2D('M147.24,198.53A56.085 56.085 0 1 1 186.66,144.97V201.06H160.54V144.97A29.965 29.965 0 1 0 147.24,169.88Z')); x.fillStyle = '#00ff00'; x.beginPath(); x.arc(130.57, 144.97, 13.06, 0, 6.2832); x.fill();
}
function drawDot(x, W, Hh) { x.fillStyle = '#00ff00'; x.beginPath(); x.arc(W / 2, Hh / 2, Math.min(W, Hh) * .4, 0, 6.2832); x.fill(); }

function dotPages() {
  const S = $('[data-dots]'); if (!S || !hasGL) return;
  const cv = $('.dxh__cv', S), kind = S.dataset.dots;
  const rip = (api, host) => host.addEventListener('pointerdown', (e) => { if (e.target.closest && e.target.closest('a, button, input, textarea, label')) return; api.ripple(e.clientX, e.clientY); });
  if (kind === 'index') {
    // al pasar por cada nombre, los puntos forman su imagen; si nadie elige, la lista avanza sola
    const rows = $$('[data-dot-k]', S); if (!rows.length) return;
    const api = createDotForm(cv, { targets: rows.map((r) => ({ img: r.dataset.img })) });
    let k = -1, hov = false;
    const set = (i) => { if (i === k) return; k = i; rows.forEach((r, j) => r.classList.toggle('is-on', j === i)); api.go(i); };
    rows.forEach((r, i) => { r.addEventListener('pointerenter', () => { hov = true; set(i); }); r.addEventListener('focus', () => set(i)); r.addEventListener('pointerleave', () => (hov = false)); });
    setTimeout(() => set(0), 450);
    if (!reduce()) setInterval(() => { if (!hov && !document.hidden) set((k + 1) % rows.length); }, 4600);
    rip(api, S);
  } else if (kind === 'iso') {
    const api = createDotForm(cv, { targets: [{ shape: drawIso }], depth: .5, x: .4 });
    setTimeout(() => api.go(0), 400); rip(api, S);
  } else if (kind === 'idea') {
    // el punto de la marca se arma a medida que completas el formulario
    const api = createDotForm(cv, { targets: [{ shape: drawDot }], center: true, ratio: 1, gx: 112, depth: .35 });
    const f = $('#form');
    const prog = () => {
      if (!f) return api.form(1);
      const val = (n) => (f.elements[n] && f.elements[n].value || '').trim();
      const done = [val('nombre').length > 1, /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val('correo')), !!f.querySelector('input[name="serv"]:checked'), val('mensaje').length > 8].filter(Boolean).length;
      api.form(.14 + .86 * done / 4);
    };
    setTimeout(() => api.go(0), 350); prog();
    f && ['input', 'change'].forEach((ev) => f.addEventListener(ev, prog));
    rip(api, $('.dxc__stage', S) || S);
  }
}

// manifiesto: las palabras se encienden al leer (scroll)
function wordsReveal() {
  $$('[data-words]').forEach((el) => {
    const words = el.textContent.trim().split(/\s+/); el.textContent = '';
    words.forEach((w, i) => { const s = document.createElement('span'); s.className = 'ad-w'; s.textContent = w; el.append(s); if (i < words.length - 1) el.append(' '); });
    if (!G || !ST || reduce()) { el.classList.add('is-static'); return; }
    G.to($$('.ad-w', el), { opacity: 1, stagger: .5, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 50%', scrub: .6 } });
  });
}

// imágenes de los servicios: se abren al entrar
function mediaReveal() {
  const els = $$('.svx__m'); if (!els.length) return;
  if (reduce()) return els.forEach((e) => e.classList.add('is-in'));
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { threshold: .25 });
  els.forEach((e) => io.observe(e));
}

// valores: cada uno es un glifo de puntos (el punto de la marca) que se arma al entrar
function glyphs() {
  const cvs = $$('.vlx__cv'); if (!cvs.length) return;
  const N = 9, c = (N - 1) / 2, bars = [2, 3, 3, 5, 4, 6, 7, 6, 8];
  const spec = (kind, i, j) => {
    if (kind === 'idea') return Math.hypot(i - c, j - c) < .5 ? [1, 2.6, 1] : [.14, .8, 0];
    if (kind === 'coherencia') return [.85, 1, 0];
    if (kind === 'medida') { const on = (N - 1 - j) < bars[i]; return on ? [.9, 1, (i === N - 1 && N - 1 - j === bars[i] - 1) ? 1 : 0] : [.1, .7, 0]; }
    const line = j === c && i >= 1 && i <= N - 2, end = j === c && (i === 1 || i === N - 2);
    return end ? [1, 2.2, i === N - 2 ? 1 : 0] : line ? [.75, 1, 0] : [.1, .7, 0];
  };
  cvs.forEach((cv) => {
    const x = cv.getContext('2d'), kind = cv.dataset.glyph; let W = 0, dpr = 1, on = false, t0 = 0;
    const pts = []; for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const [a, s, g] = spec(kind, i, j); pts.push({ i, j, a, s, g, sx: Math.random(), sy: Math.random(), d: Math.random() * .5 + (i + j) * .02 }); }
    const size = () => { dpr = Math.min(devicePixelRatio || 1, 2); W = cv.clientWidth; cv.width = cv.height = W * dpr; };
    size(); addEventListener('resize', size);
    new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on && !t0) t0 = performance.now(); }).observe(cv);
    const frame = () => {
      requestAnimationFrame(frame); if (!on || document.hidden) return;
      const t = (performance.now() - t0) / 1000, gap = W / N;
      x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, W, W);
      for (const p of pts) {
        const k = reduce() ? 1 : Math.min(1, Math.max(0, (t - p.d) / .9)), e = 1 - Math.pow(1 - k, 3);
        const gx = (p.i + .5) * gap, gy = (p.j + .5) * gap, px = p.sx * W + (gx - p.sx * W) * e, py = p.sy * W + (gy - p.sy * W) * e;
        let a = p.a, s = p.s;
        if (kind === 'idea' && p.g) s *= 1 + Math.sin(t * 2) * .12;
        if (kind === 'coherencia') a = .25 + .65 * (Math.sin((p.i + p.j) * .7 - t * 1.6) * .5 + .5);
        let g = p.g;
        if (kind === 'directo' && p.j === c && p.i >= 1 && p.i <= N - 2) { const run = ((t * .9) % 1) * (N - 3) + 1; if (Math.abs(p.i - run) < .6) { g = 1; s = 1.5; a = 1; } }
        x.globalAlpha = a * (.25 + e * .75); x.fillStyle = g ? '#00FF8B' : '#F5F5F3';
        x.beginPath(); x.arc(px, py, gap * .13 * s, 0, 6.2832); x.fill();
      }
      x.globalAlpha = 1;
    };
    frame();
  });
}

// legales: el índice marca la sección que estás leyendo
function legalToc() {
  const links = $$('.lgb__toc a'); if (!links.length) return;
  const map = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { links.forEach((a) => a.classList.remove('is-on')); const a = map.get(e.target.id); a && a.classList.add('is-on'); } }), { rootMargin: '-20% 0px -70% 0px' });
  $$('.lgb .legal h2[id]').forEach((h) => io.observe(h));
}

/* =========================================================
   Cursor con etiqueta «Play» / «Ver»
   ========================================================= */
function cursor() {
  if (!fine || reduce()) return;
  const c = document.createElement('div'); c.className = 'adc'; c.setAttribute('aria-hidden', 'true'); c.innerHTML = '<span></span>'; document.body.append(c);
  const lab = c.firstChild, J = $('.adj');
  let x = -200, y = -200, tx = -200, ty = -200, run = false;
  const SEL = '.adj__box, [data-reel], .rcard, [data-project], .pwh__c, .scard, [data-lightbox], .svh__m';
  addEventListener('pointermove', (e) => {
    tx = e.clientX; ty = e.clientY;
    const el = !H.classList.contains('adp-on') && e.target.closest && e.target.closest(SEL);
    const skip = el && el.classList.contains('adj__box') && J && !J.classList.contains('is-end') && !J.classList.contains('is-static');
    if (el && !skip) { lab.textContent = el.matches('.adj__box, [data-reel], .rcard') ? 'Play' : 'Ver'; c.classList.add('on'); } else c.classList.remove('on');
    if (!run) { run = true; x = tx; y = ty; loop(); }
  }, { passive: true });
  document.addEventListener('pointerleave', () => c.classList.remove('on'));
  function loop() { x += (tx - x) * .22; y += (ty - y) * .22; c.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`; requestAnimationFrame(loop); }
}
