/* AMUREK · sitio web v24 — interacciones propias (sin librerías) */
(() => {
  "use strict";

  /* ============================================================
     CONFIGURACIÓN — datos de contacto reales
     ============================================================ */
  const CONFIG = {
    email: "hola@amurek.com",     // correo general (crear la casilla en el dominio). Para nuevos clientes conviene también proyectos@amurek.com
    whatsapp: "593983776066",     // número con código de país, solo dígitos (provisional). Vacío = se oculta
    formEndpoint: "",             // ← opcional: URL de Formspree/Getform para recibir el formulario sin abrir el correo
    social: [                     // ← URL reales; las vacías no se muestran
      // un solo nombre en todas las redes: «amurek.estudio» (Behance no admite puntos). Crear o verificar las cuentas antes de publicar
      { name: "Instagram", url: "https://www.instagram.com/amurek.estudio" },
      { name: "TikTok", url: "https://www.tiktok.com/@amurek.estudio" },
      { name: "LinkedIn", url: "https://www.linkedin.com/company/amurek-estudio" },
      { name: "Behance", url: "https://www.behance.net/amurekestudio" },
    ],
  };

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const still = /[?&]still/.test(location.search);
  /* ---------- cada página abre siempre en su inicio (v38): sin restauración de posición del navegador, y se fuerza el inicio
     también cuando la página va dentro de un visor que hace el scroll por fuera (scrollIntoView sube todos los contenedores) ---------- */
  try { history.scrollRestoration = "manual"; } catch (_) { /* sin historial */ }
  if (!location.hash && !still) {
    const toTop = () => { const h = document.documentElement; h.style.scrollBehavior = "auto"; scrollTo(0, 0); try { document.body.scrollIntoView({ block: "start", behavior: "instant" }); } catch (_) { /* navegador antiguo */ } h.style.scrollBehavior = ""; };
    toTop(); addEventListener("load", toTop); addEventListener("pageshow", toTop);
  } // ?still = captura estática
  if (still) { const y = +(new URLSearchParams(location.search).get("y") || 0); if (y) addEventListener("load", () => { document.documentElement.style.scrollBehavior = "auto"; scrollTo(0, y); }); }
  const store = { get: (k) => { try { return localStorage.getItem(k); } catch (_) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (_) { /* sin almacenamiento */ } } };
  const reduce = still; // las animaciones están siempre activas: no dependen del dispositivo ni se pueden pausar (solo ?still, para capturas)
  const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const onVisible = (el, cb, margin = "10% 0px") => new IntersectionObserver((es) => es.forEach((e) => cb(e.isIntersecting)), { rootMargin: margin }).observe(el);
  const onScroll = (fn) => { let raf = 0; const run = () => { raf = 0; fn(); }; addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(run); }, { passive: true }); addEventListener("resize", run); run(); };
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  /* ---------- datos de contacto ---------- */
  $$("[data-mail]").forEach((a) => { a.textContent = CONFIG.email; a.href = "mailto:" + CONFIG.email; });
  if (CONFIG.whatsapp) {
    $$("[data-wa-row]").forEach((r) => (r.hidden = false));
    $$("[data-wa]").forEach((a) => { a.href = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent("Hola AMUREK, tengo una idea que quiero darle forma."); a.target = "_blank"; a.rel = "noopener"; a.textContent = a.dataset.wa === "num" ? "+" + CONFIG.whatsapp.replace(/^(593)(\d{2})(\d{3})(\d+)$/, "$1 $2 $3 $4") : "WhatsApp"; });
  }
  $$("[data-social]").forEach((ul) => CONFIG.social.filter((s) => s.url).forEach((s) => { const li = document.createElement("li"); li.innerHTML = `<a href="${s.url}" target="_blank" rel="noopener">${s.name}</a>`; ul.appendChild(li); }));
  $$("[data-social-col]").forEach((c) => { if ($("li", c)) c.hidden = false; });
  const ICON = {
    Instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4.6"/><circle cx="12" cy="12" r="3.7"/><circle cx="16.9" cy="7.1" r=".7" fill="currentColor" stroke="none"/></svg>',
    TikTok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.2 4v10.3a3.3 3.3 0 1 1-3.3-3.3M14.2 4c.35 2.4 1.9 3.9 4.3 4.1"/></svg>',
    LinkedIn: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10.2V17M7 7.1v.1M11.2 17v-6.8M11.2 13.3c0-2 1.3-3.3 3.1-3.3s3 1.2 3 3.3V17"/></svg>',
    Behance: '<span aria-hidden="true">Bē</span>',
  };
  $$("[data-social-icons]").forEach((ul) => { CONFIG.social.filter((x) => x.url).forEach((x) => { const li = document.createElement("li"); li.innerHTML = `<a href="${x.url}" target="_blank" rel="noopener" aria-label="${x.name}">${ICON[x.name] || x.name[0]}</a>`; ul.appendChild(li); }); if ($("li", ul)) ul.hidden = false; });
  $$("[data-quick]").forEach((f) => f.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = f.correo.value.trim(), note = $(".foot7__note", f);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { note.textContent = "Escribe un correo válido, por ejemplo nombre@correo.com."; f.correo.setAttribute("aria-invalid", "true"); f.correo.focus(); return; }
    location.href = "contacto.html?correo=" + encodeURIComponent(v) + "#form";
  }));
  $$("[data-year]").forEach((y) => (y.textContent = new Date().getFullYear()));

  /* ---------- v54: las páginas internas se descargan al acercar el puntero o tocar el enlace, así abren al instante.
     Chrome y Edge ya lo hacen con las reglas de especulación de la cabecera; esto cubre Safari y Firefox ---------- */
  if (!(HTMLScriptElement.supports && HTMLScriptElement.supports("speculationrules"))) {
    const done = new Set([location.pathname]);
    const warm = (e) => {
      const a = e.target.closest && e.target.closest("a[href]"); if (!a || a.target === "_blank" || a.origin !== location.origin) return;
      const u = a.pathname; if (done.has(u)) return; done.add(u);
      const l = document.createElement("link"); l.rel = "prefetch"; l.href = a.href.split("#")[0]; document.head.appendChild(l);
    };
    addEventListener("pointerover", warm, { passive: true }); addEventListener("touchstart", warm, { passive: true });
  }

  /* ---------- v49: consentimiento de cookies (LOPDP Ecuador). Elegir es tan fácil como aceptar; la elección se guarda y se puede cambiar
     desde el pie. Las herramientas de análisis o marketing que se agreguen deben cargarse solo así:
       addEventListener("amurek:consent", (e) => { if (e.detail.analytics) { ...cargar analítica... } });   (o leer window.amurekConsent) ---------- */
  (() => {
    const ck = $("#ck"); if (!ck) return;
    const KEY = "amurek-consent", V = 1, prefs = $("#ckPrefs", ck), cfg = $('[data-ck="cfg"]', ck), root = document.documentElement;
    let timer = 0;
    const read = () => { try { const c = JSON.parse(localStorage.getItem(KEY) || "null"); return c && c.v === V ? c : null; } catch (_) { return null; } };
    const apply = (c) => { window.amurekConsent = c; root.dataset.consent = [c.analytics && "analytics", c.marketing && "marketing"].filter(Boolean).join(" ") || "necessary"; dispatchEvent(new CustomEvent("amurek:consent", { detail: c })); };
    const setPrefs = (on) => { prefs.hidden = !on; cfg.setAttribute("aria-expanded", String(on)); cfg.textContent = on ? "Guardar selección" : "Configurar"; cfg.dataset.ck = on ? "save" : "cfg"; };
    const close = () => { ck.classList.remove("is-on"); root.classList.remove("ck-open"); clearTimeout(timer); timer = setTimeout(() => (ck.hidden = true), 500); };
    const open = (withPrefs) => {
      const c = read(); prefs.analytics.checked = !!(c && c.analytics); prefs.marketing.checked = !!(c && c.marketing);
      setPrefs(withPrefs); clearTimeout(timer); ck.hidden = false; root.classList.add("ck-open"); requestAnimationFrame(() => requestAnimationFrame(() => ck.classList.add("is-on")));
      if (withPrefs) setTimeout(() => prefs.analytics.focus({ preventScroll: true }), 60);
    };
    const save = (analytics, marketing) => { const c = { v: V, analytics, marketing, t: new Date().toISOString() }; try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (_) { /* sin almacenamiento: vale para esta visita */ } apply(c); close(); };
    ck.addEventListener("click", (e) => {
      const k = e.target.closest("[data-ck]")?.dataset.ck;
      if (k === "all") save(true, true); else if (k === "none") save(false, false);
      else if (k === "cfg") { setPrefs(true); prefs.analytics.focus({ preventScroll: true }); } else if (k === "save") save(prefs.analytics.checked, prefs.marketing.checked);
    });
    prefs.addEventListener("submit", (e) => e.preventDefault());
    $$("[data-consent-open]").forEach((bt) => bt.addEventListener("click", () => open(true)));
    const c = read();
    if (c) apply(c); else if (!still) setTimeout(() => open(false), 1800);
  })();
  $$("[data-top]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); }));

  /* ---------- pie: hora de Ecuador, copiar correo y letras que suben ---------- */
  $$("[data-clock]").forEach((el) => {
    let f = null;
    try { f = new Intl.DateTimeFormat("es-EC", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Guayaquil" }); } catch (_) { /* sin Intl */ }
    const t = () => { if (f) el.textContent = f.format(new Date()); };
    t(); setInterval(t, 20000);
  });
  $$("[data-copy-mail]").forEach((b) => {
    const txt = $("[data-mailtxt]", b); let timer = 0;
    txt.textContent = CONFIG.email;
    b.addEventListener("click", async () => {
      let ok = false;
      try { await navigator.clipboard.writeText(CONFIG.email); ok = true; } catch (_) { /* el navegador no permite copiar */ }
      if (!ok) { location.href = "mailto:" + CONFIG.email; return; }
      txt.textContent = "Correo copiado"; clearTimeout(timer);
      timer = setTimeout(() => { txt.textContent = CONFIG.email; }, 1800);
    });
  });
  $$(".foot4__wm").forEach((w) => { const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { w.classList.add("in"); io.disconnect(); } }), { threshold: 0.25 }); io.observe(w); });

  /* ---------- pausar animaciones (el usuario decide; respeta también el ajuste del sistema) ---------- */
  const mBtn = $("#motionToggle");
  const applyMotion = () => {
    document.documentElement.classList.toggle("motion-off", reduce);
    if (mBtn) { mBtn.setAttribute("aria-pressed", String(reduce)); mBtn.textContent = reduce ? "Reanudar animaciones" : "Pausar animaciones"; }
    $$("video[data-autoplay]").forEach((v) => { if (reduce) v.pause(); });
    document.dispatchEvent(new Event("motionchange"));
  };
  applyMotion();

  /* ---------- pantalla de carga: las letras de AMUREK suben y, al estar todo listo, cinco paneles (una por letra) se levantan como una cortina ---------- */
  const preEl = $("#pre"), root = document.documentElement;
  if (preEl && root.classList.contains("pre-on")) {
    const t0 = performance.now(), HOLD = 1500, MAX = 4800;
    let loaded = document.readyState === "complete", over = false, going = false;
    addEventListener("load", () => { loaded = true; });
    const finish = () => {
      if (over) return; over = true;
      try { sessionStorage.setItem("amurek-pre", "1"); } catch (_) { /* sin almacenamiento */ }
      root.classList.remove("pre-on"); root.classList.add("pre-done");
    };
    const tick = (now) => {
      const el = now - t0;
      if (!going && el >= HOLD && (loaded || el > MAX)) { going = true; preEl.classList.add("is-out"); setTimeout(finish, 1600); return; }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- menú ---------- */
  const menuBtn = $("#menuBtn"), menu = $("#menu");
  const setMenu = (open) => {
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("menu-open", open);
    document.documentElement.style.overflow = open ? "hidden" : "";
  };
  menuBtn.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
  $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  menu.addEventListener("click", (e) => { if (e.target === menu) setMenu(false); });   // v43: tocar fuera de la hoja la cierra
  addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* ---------- barra superior: pegada arriba. En el inicio no se ve: el logotipo gigante y «Agencia Creativa» viajan juntos hasta la barra (se redibujan en cada tamaño, no se estiran); las dos palabras, una sobre otra, viajan tal cual hasta la barra ---------- */
  const navEl = $("#nav"), htLogo = $("#htLogo");
  if (navEl && htLogo && !reduce) {
    const logo = $(".nav__logo", navEl), nwm = $(".wm", logo), pwm = $(".ht__wm .wm", htLogo), reg = $(".ht__reg", htLogo), htr = $(".ht__r"), tag = $(".nav__tag", navEl);
    const fly = document.createElement("div");
    fly.className = "nav__fly"; fly.setAttribute("aria-hidden", "true"); fly.appendChild(pwm.cloneNode(true)); navEl.appendChild(fly);
    const words = [0, 1].map((k) => { const w = document.createElement("div"); w.className = "nav__fly2"; w.setAttribute("aria-hidden", "true"); w.textContent = htr.children[k].textContent; navEl.appendChild(w); return w; });
    document.documentElement.classList.add("nav-morph");
    let nl = 0, nt = 0, nw = 1, pl = 0, pt = 0, pw = 1, fs0 = 80, fs1 = 12, D = 300, A = [], B = [], narrowNav = false, lastP = -1;
    const root = document.documentElement;
    // v39: el logotipo y las palabras se mueven SOLO con transform (sin layout ni repintado de texto).
    // Si el navegador tiene líneas de tiempo de scroll en CSS (Chrome, Edge), las anima el compositor directamente con el scroll,
    // sin pasar por JavaScript: no se atrasa aunque la página esté ocupada. En los demás, se calcula un transform por cuadro.
    const sd = !!(window.CSS && CSS.supports && CSS.supports("animation-timeline", "scroll()"));
    const px = (v) => v.toFixed(1) + "px";
    const measure = () => {
      const g = nwm.getBoundingClientRect(), r = pwm.getBoundingClientRect();
      nl = g.left; nt = g.top; nw = g.width || 1; pl = r.left; pt = r.top + scrollY; pw = r.width || 1;
      A = [0, 1].map((k) => { const q = htr.children[k].getBoundingClientRect(); return [q.left, q.top + scrollY]; });
      B = [0, 1].map((k) => { const q = tag.children[k].getBoundingClientRect(); return [q.left, q.top]; });
      fs0 = parseFloat(getComputedStyle(htr).fontSize) || 80; fs1 = parseFloat(getComputedStyle(tag.firstElementChild).fontSize) || 12;
      // la transición dura exactamente lo que tarda el panel del hero en llegar a la barra: así el logo nunca queda encima del panel
      const hp = $("#heroPanel") || $(".hero4__panel"), navh = navEl.getBoundingClientRect().height || 64;
      D = Math.max(48, (hp ? hp.getBoundingClientRect().top + scrollY : 200) - navh);
      narrowNav = innerWidth <= 900;
      fly.style.width = px(pw);
      words.forEach((w) => { w.style.fontSize = fs0.toFixed(2) + "px"; });
      root.classList.toggle("nav-n", narrowNav);
      if (sd) {
        root.style.setProperty("--nav-d", px(D));
        const put = (el, x0, y0, x1, y1, sc) => { el.style.setProperty("--x0", px(x0)); el.style.setProperty("--y0", px(y0)); el.style.setProperty("--x1", px(x1)); el.style.setProperty("--y1", px(y1)); el.style.setProperty("--sc", sc.toFixed(4)); };
        put(fly, pl, pt, nl, nt, nw / pw);
        words.forEach((w, k) => put(w, A[k][0], A[k][1], B[k][0], B[k][1], fs1 / fs0));
        root.classList.add("nav-sd");
      }
      lastP = -1;
    };
    const st = { on: false, bg: false, live: false, done: false };
    const flip = (k, cls, v) => { if (st[k] !== v) { st[k] = v; navEl.classList.toggle(cls, v); } };
    const apply = () => {
      // avance lineal con el scroll (sin aceleración): el borde inferior del logo baja al mismo ritmo que sube el panel, nunca se cruzan
      const p = clamp(scrollY / D);
      flip("on", "is-on", p >= 0.78); flip("bg", "is-bg", p >= 0.85); flip("live", "is-live", p > 0.5); flip("done", "is-done", p >= 0.999);
      if (sd || p === lastP) return;
      lastP = p;
      const lx = pl + (nl - pl) * p, ly = pt + (nt - pt) * p, s = 1 + (nw / pw - 1) * p;
      fly.style.transform = `translate3d(${lx.toFixed(1)}px,${ly.toFixed(1)}px,0) scale(${s.toFixed(4)})`;
      const ws = 1 + (fs1 / fs0 - 1) * p, wo = narrowNav ? (p < 0.25 ? 1 - p / 0.25 : 0) : 1; // en tablet y celular las palabras van bajo el logo: se desvanecen y el texto de la barra aparece con un fundido al llegar el logo (nunca se tocan)
      words.forEach((w, k) => { w.style.opacity = wo.toFixed(2); w.style.transform = `translate3d(${(A[k][0] + (B[k][0] - A[k][0]) * p).toFixed(1)}px,${(A[k][1] + (B[k][1] - A[k][1]) * p).toFixed(1)}px,0) scale(${ws.toFixed(4)})`; });
      reg.style.opacity = (1 - clamp(p * 5)).toFixed(2);
    };
    measure(); apply();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); apply(); });
    addEventListener("load", () => { measure(); apply(); });
    addEventListener("resize", () => { measure(); apply(); });
    onScroll(apply);
  }

  /* ---------- titulares: el texto se genera palabra por palabra al entrar en pantalla ---------- */
  const splitWords = (root) => {
    let i = 0;
    const walk = (node) => Array.from(node.childNodes).forEach((ch) => {
      if (ch.nodeType === 3) {
        const frag = document.createDocumentFragment();
        ch.textContent.split(/(\s+)/).forEach((tok) => {
          if (!tok) return;
          if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(" ")); return; }
          const w = document.createElement("span"); w.className = "w"; w.textContent = tok; w.style.setProperty("--i", i++); frag.appendChild(w);
        });
        node.replaceChild(frag, ch);
      } else if (ch.nodeType === 1 && ch.tagName !== "BR" && !ch.classList.contains("cta__wm")) walk(ch);
    });
    walk(root);
  };
  $$(".h1.rv, .h2.rv, .h3.rv, .giant.rv").forEach((h) => { h.classList.add("gen"); splitWords(h); });
  requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add("ready")));
  const revealIO = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); revealIO.unobserve(e.target); } }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  $$(".rv").forEach((el) => revealIO.observe(el));

  /* ---------- fluidez (v37): las animaciones en bucle de una sección solo corren mientras esa sección está a la vista ---------- */
  if (!still) {
    const offIO = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle("is-off", !e.isIntersecting)), { rootMargin: "25% 0px" });
    $$("main>section,footer").forEach((s) => offIO.observe(s));
  }

  /* ---------- videos que se reproducen solos al verse ---------- */
  $$("video[data-autoplay]").forEach((v) => onVisible(v, (on) => { if (on && !reduce) { v.preload = "auto"; v.play().catch(() => {}); } else v.pause(); }, "0px"));

  /* ---------- PORTADA: la última palabra cambia; al formarse el isotipo se queda en «forma» ---------- */
  const heroPanel = $("#heroPanel");
  const heroWords = $$(".hs__word span");
  let heroSet = () => {}, heroLock = false;
  if (heroWords.length > 1) {
    let k = 0, timer = 0, vis = true;
    heroSet = (n) => { if (n === k) return; heroWords.forEach((w, i) => { w.classList.toggle("is-on", i === n); w.classList.toggle("is-out", i === k); }); k = n; };
    const next = () => { if (reduce || heroLock) return; heroSet((k + 1) % heroWords.length); };
    const run = () => { clearInterval(timer); if (!reduce && vis) timer = setInterval(next, 2800); };
    onVisible(heroPanel, (v) => { vis = v; run(); }, "0px");
    document.addEventListener("motionchange", run);
  }

  /* ---------- PORTADA: humo de luz en WebGL (un solo plano a pantalla completa, sin librerías). Fluye solo; no depende del scroll ---------- */
  const heroCv = $(".hero4__cv"), heroSec = $(".hero4");
  if (heroPanel && heroCv && heroSec) {
    const gl = heroCv.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, powerPreference: "low-power" });
    const VS = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";
    const FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes; uniform float uT; uniform vec2 uMouse; uniform float uNarrow;
float h21(vec2 p){ p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * f * (f * (f * 6. - 15.) + 10.); return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
const mat2 R = mat2(.8, -.6, .6, .8);
float fbm(vec2 p){ float s = 0., a = .5; for (int i = 0; i < 4; i++) { s += a * vn(p); p = R * p * 2.02 + vec2(3.1, 1.7); a *= .5; } return s; }
float ridge(vec2 p){ float s = 0., a = .5; for (int i = 0; i < 5; i++) { float v = 1. - abs(2. * vn(p) - 1.); s += a * v * v; p = R * p * 2.03 + vec2(3.1, 1.7); a *= .5; } return s; }
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  vec2 p = (uv - .5) * vec2(asp, 1.) + (uMouse - .5) * vec2(.07, -.05);
  float c = cos(-.32), s = sin(-.32);
  p = mat2(c, -s, s, c) * p; p *= vec2(.5, 1.45) * 1.2;
  float t = uT * .045;
  vec2 q = vec2(fbm(p + vec2(0., t)), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p + 2.4 * q + vec2(1.7, 9.2) + t * 1.3), fbm(p + 2.4 * q + vec2(8.3, 2.8) - t));
  float sm = ridge(p + 2.6 * r), body = r.x * .6 + q.y * .4;
  float k = max(pow(clamp(sm, 0., 1.), 3.) * 4.4 - .14, 0.);
  k *= smoothstep(.3, .62, body);
  vec2 u2 = uv - .5;
  k *= exp(-pow((u2.y - (.1 * sin(u2.x * 2.2 + uT * .05) - .16 * u2.x)) * 1.25, 2.));
  vec3 cr = vec3(.97, .95, .92), ro = vec3(.95, .55, .72);
  vec3 col = mix(ro * .9, cr, smoothstep(.2, .95, k)) * k;
  col = 1. - exp(-col * 1.4);
  col *= mix(mix(.5, 1., smoothstep(0., .65, uv.x)), .8, uNarrow);
  gl_FragColor = vec4(col, clamp(max(col.r, max(col.g, col.b)), 0., 1.));
}`;
    const mk = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; };
    const vs = gl && mk(gl.VERTEX_SHADER, VS), fs = gl && mk(gl.FRAGMENT_SHADER, FS), prog = vs && fs ? gl.createProgram() : null;
    if (prog) { gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog); }
    if (!prog || !gl.getProgramParameter(prog, gl.LINK_STATUS)) heroPanel.classList.add("no-gl");
    else {
      gl.useProgram(prog);
      const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, "a"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      const U = (n) => gl.getUniformLocation(prog, n), uRes = U("uRes"), uT = U("uT"), uMouse = U("uMouse"), uNarrow = U("uNarrow");
      let t = 8, last = 0, raf = 0, vis = true, mx = 0.6, my = 0.5, sx = 0.6, sy = 0.5, narrow = 0, q = 1, slow = 0;
      const size = () => {
        const r = heroPanel.getBoundingClientRect(), s = (innerWidth < 700 ? 0.4 : 0.42) * q;   // v54: el humo es difuso: a menos resolución se ve igual y cuesta menos de la mitad
        heroCv.width = Math.max(2, Math.round(r.width * s)); heroCv.height = Math.max(2, Math.round(r.height * s)); gl.viewport(0, 0, heroCv.width, heroCv.height);
        narrow = heroCv.width < heroCv.height * 0.9 ? 1 : 0;
      };
      const draw = () => { gl.uniform2f(uRes, heroCv.width, heroCv.height); gl.uniform1f(uT, t); gl.uniform2f(uMouse, sx, 1 - sy); gl.uniform1f(uNarrow, narrow); gl.drawArrays(gl.TRIANGLES, 0, 3); };
      const frame = (now) => {
        raf = 0;
        if (now - last >= 30) {                                       // unos 33 cuadros por segundo: el humo es lento y así gasta la mitad
          const dtv = last ? Math.min(0.1, (now - last) / 1000) : 0.033; last = now;   // v40: el humo sigue animándose también mientras se hace scroll
          t += dtv; sx += (mx - sx) * Math.min(1, dtv * 3); sy += (my - sy) * Math.min(1, dtv * 3);
          draw();
          if (dtv > 0.06) { if (++slow > 12 && q > 0.45) { q *= 0.8; slow = 0; size(); } } else if (slow > 0) slow -= 0.25;   // si el equipo va justo, baja la resolución
        }
        if (vis && !document.hidden && !reduce) raf = requestAnimationFrame(frame);
      };
      const kick = () => { if (!raf && vis && !reduce) raf = requestAnimationFrame(frame); };
      size(); draw();
      addEventListener("resize", () => { size(); draw(); kick(); });
      onVisible(heroPanel, (v) => { vis = v; if (v) { last = 0; kick(); } }, "0px");
      document.addEventListener("motionchange", () => { last = 0; draw(); kick(); });
      document.addEventListener("visibilitychange", () => { last = 0; kick(); });
      heroCv.addEventListener("webglcontextlost", (e) => e.preventDefault());
      if (fine) heroPanel.addEventListener("pointermove", (e) => { const r = heroPanel.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width; my = (e.clientY - r.top) / r.height; });
      kick();
    }
  }

  /* ---------- tarjetas: resplandor que sigue al puntero y leve inclinación ---------- */
  if (fine) {
    $$("[data-spot]").forEach((el) => el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--sx", e.clientX - r.left + "px");
      el.style.setProperty("--sy", e.clientY - r.top + "px");
    }));
    $$("[data-tilt]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        if (reduce) return;
        const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${(x * 7).toFixed(2)}deg) rotateX(${(-y * 7).toFixed(2)}deg) scale(1.012)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------- PROYECTOS: a la derecha, tarjetas iguales en 3D (la del frente se recuesta sobre la pila y sube la siguiente); a la izquierda, el texto del proyecto que está al frente ---------- */
  const pwh = $("#pwh");
  if (pwh) {
    const sticky = $(".pwh__sticky", pwh), cards = $$(".pwh__c", pwh), infos = $$(".pwh__i", pwh), n = cards.length;
    let range = 1, cur = -1;
    const stickyTop = () => parseFloat(getComputedStyle(sticky).top) || 0;
    const layout = () => { range = Math.max(1, (n - 1) * innerHeight * 0.85); pwh.style.height = Math.round(sticky.offsetHeight + range + innerHeight * 0.12) + "px"; };
    const frame = () => {
      const pr = pwh.getBoundingClientRect(); if (pr.bottom < -innerHeight || pr.top > innerHeight * 2) return;
      const p = clamp((stickyTop() - pr.top) / range), pos = p * (n - 1);
      cards.forEach((c, i) => {
        const d = i - pos;
        let ty = 0, rx = 0, tz = 0, sc = 1, op = 1;
        if (d >= 0) { const e = clamp(d); ty = Math.min(d, 2) * 122; rx = -9 * e; tz = -50 * e; sc = 1 - 0.03 * e; op = d > 1.7 ? 0 : 1; }          // llega subiendo desde abajo
        else { const a = -d, e = Math.min(a, 1), m = Math.max(0, a - 1); rx = 64 * e + 3 * m; ty = -7 * e - 5 * m; tz = -70 * a; sc = 1 - 0.05 * Math.min(a, 3); op = a > 3.3 ? 0 : 1; } // se recuesta y queda en la pila
        c.style.transform = `translate3d(0,${ty.toFixed(2)}%,${tz.toFixed(1)}px) rotateX(${rx.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
        c.style.opacity = String(op); c.style.zIndex = String(Math.round(d >= 0 ? 200 - d * 10 : 100 + d * 10));
        c.style.setProperty("--dim", (Math.min(Math.max(-d, 0), 1) * 0.55).toFixed(2));
        c.classList.toggle("is-on", Math.abs(d) < 0.5);
      });
      const best = clamp(Math.round(pos), 0, n - 1);
      if (best !== cur) { cur = best; infos.forEach((x, i) => x.classList.toggle("is-on", i === best)); }
    };
    layout(); onScroll(frame);
    addEventListener("resize", () => { layout(); frame(); });
    addEventListener("load", () => { layout(); frame(); });
    cards.forEach((c, i) => c.addEventListener("click", () => { if (c.classList.contains("is-on")) $("button", infos[i]).click(); }));
  }

  /* ---------- SERVICIOS: lista fija y detalle. Eliges un servicio (con el puntero o con un toque) y se muestra su explicación; nada cambia de lugar ---------- */
  const sv = $("#sv");
  if (sv) {
    const ts = $$(".sv__t", sv), ps = $$(".sv__p", sv), N = ts.length;
    const pick = (i, focus) => {
      ts.forEach((t, j) => { const on = i === j; t.classList.toggle("is-on", on); t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1; ps[j].classList.toggle("is-on", on); });
      if (focus) ts[i].focus({ preventScroll: true });
      if (innerWidth <= 900) { const l = $(".sv__list", sv); l.scrollTo({ left: Math.max(0, ts[i].offsetLeft - 16), behavior: "smooth" }); }
    };
    ts.forEach((t, i) => {
      let hv = 0;
      t.addEventListener("click", () => pick(i));
      if (fine) { t.addEventListener("pointerenter", () => { clearTimeout(hv); hv = setTimeout(() => pick(i), 90); }); t.addEventListener("pointerleave", () => clearTimeout(hv)); }
      t.addEventListener("keydown", (e) => {
        const k = e.key;
        if (k === "ArrowDown" || k === "ArrowRight") { e.preventDefault(); pick((i + 1) % N, true); }
        else if (k === "ArrowUp" || k === "ArrowLeft") { e.preventDefault(); pick((i + N - 1) % N, true); }
        else if (k === "Home") { e.preventDefault(); pick(0, true); } else if (k === "End") { e.preventDefault(); pick(N - 1, true); }
      });
    });
  }

  /* ---------- PROCESO: la palabra gira, la escena cambia de lado y el fondo alterna con cada paso; al terminar, la web se suelta ---------- */
  const pcards = $$(".proc__track .pcard"), procTrack = $(".proc__track"), proc2 = $(".proc__track .proc2");
  if (pcards.length) {
    const words = $$(".proc__track .proc2__w"), descs = $$(".proc__track .proc2__d"), tls = $$(".proc__track .proc2__tl li");
    let cur = -2;
    onScroll(() => {
      let best = 0;
      if (procTrack && proc2 && innerWidth > 900) {
        const stk = $(".proc__sticky", procTrack), top = parseFloat(getComputedStyle(stk).top) || 0;
        const p = clamp((top - procTrack.getBoundingClientRect().top) / Math.max(1, procTrack.offsetHeight - stk.offsetHeight));
        best = Math.min(pcards.length - 1, Math.floor(p * pcards.length));
        proc2.style.setProperty("--ps", p.toFixed(3));
        if (procTrack.getBoundingClientRect().top > innerHeight * 0.62) best = -1;   // la primera escena aparece al llegar a la sección
      } else {
        const mid = innerHeight * 0.5; let bd = 1e9;
        pcards.forEach((c, i) => { const r = c.getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - mid); if (d < bd) { bd = d; best = i; } });
      }
      if (best === cur) return; cur = best;
      const at = Math.max(0, best);
      if (proc2) proc2.dataset.step = String(at);
      pcards.forEach((c, i) => { c.classList.toggle("is-on", i === best); c.classList.toggle("is-past", i < best); });
      words.forEach((w, i) => { w.classList.toggle("is-on", i === at); w.classList.toggle("is-past", i < at); });
      descs.forEach((d, i) => d.classList.toggle("is-on", i === at));
      tls.forEach((l, i) => l.classList.toggle("is-on", i <= at));
    });
  }

  /* ---------- PROCESO: la escena se inclina un poco con el puntero (cada panel) ---------- */
  if (fine) $$(".proc2").forEach((box) => {
    box.addEventListener("pointermove", (e) => { const r = box.getBoundingClientRect(); box.style.setProperty("--tx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3)); box.style.setProperty("--ty", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3)); });
    box.addEventListener("pointerleave", () => { box.style.setProperty("--tx", "0"); box.style.setProperty("--ty", "0"); });
  });

  /* ---------- PROCESO (inicio): acordeón de etapas que avanza con el scroll. La fila se queda fija y, al bajar, se abre una etapa tras otra (Escuchamos → Lanzamos); al terminar la última, la página sigue. Un clic (o «Sigue») lleva el scroll a esa etapa. En pantallas estrechas o sin movimiento no se fija: se abre con un toque. La escena se reproduce otra vez cada vez que se abre y solo se reproducen los videos de la etapa abierta ---------- */
  const prosRow = $(".pros__row"), prosPin = $(".pros__pin"), prosSec = $(".pros");
  if (prosRow && prosPin && prosSec) {
    const tiles = $$(".pros__t", prosRow), heads = tiles.map((t) => $(".pros__h", t)), narrow = matchMedia("(max-width:1000px)"), n = tiles.length, root = document.documentElement;
    let cur = 0, range = 1, lock = null;
    const free = () => prosSec.classList.contains("pros--free");
    const top0 = () => (parseFloat(getComputedStyle(root).getPropertyValue("--navh")) || 64) + 8;
    const vids = (t, on) => $$("video", t).forEach((v) => { if (on && !reduce) { v.preload = "auto"; v.play().catch(() => {}); } else v.pause(); });
    const replay = (t) => { t.classList.remove("is-play"); void t.offsetWidth; t.classList.add("is-play"); };
    const open = (i, focus) => {
      i = clamp(i, 0, n - 1);
      if (i === cur) { if (focus) heads[i].focus({ preventScroll: true }); return; }
      cur = i;
      tiles.forEach((t, k) => { const on = k === i; t.classList.toggle("is-on", on); heads[k].setAttribute("aria-expanded", String(on)); if (on) heads[k].setAttribute("aria-disabled", "true"); else heads[k].removeAttribute("aria-disabled"); if (!on) vids(t, false); });
      replay(tiles[i]); vids(tiles[i], true);
      if (focus) heads[i].focus({ preventScroll: true });
      if (narrow.matches) setTimeout(() => { const r = tiles[i].getBoundingClientRect(), top = top0() + 2; if (r.top < top || r.top > innerHeight * 0.55) scrollTo({ top: scrollY + r.top - top, behavior: reduce ? "auto" : "smooth" }); }, 420);
    };
    const layout = () => {
      const pinned = !narrow.matches && !reduce;
      prosSec.classList.toggle("pros--free", !pinned);
      if (pinned) { range = n * innerHeight * 0.55; prosPin.style.height = Math.round(prosRow.offsetHeight + range) + "px"; } else prosPin.style.height = "";
    };
    const frame = () => {
      if ((!narrow.matches && !reduce) === free()) layout();
      if (free()) return;
      if (lock) { if (performance.now() > lock.until || Math.abs(scrollY - lock.y) < 3) lock = null; else return; }
      const k = Math.min(n - 1, Math.floor(clamp((top0() - prosPin.getBoundingClientRect().top) / range) * n));
      if (k !== cur) open(k);
    };
    const go = (k, focus) => {
      k = clamp(k, 0, n - 1);
      if (free()) { open(k, focus); return; }
      const y = Math.round(scrollY + prosPin.getBoundingClientRect().top - top0() + ((k + 0.5) / n) * range);
      lock = { y, until: performance.now() + 1800 };
      open(k, focus);
      scrollTo({ top: y, behavior: "smooth" });
    };
    tiles.forEach((t, i) => {
      heads[i].addEventListener("click", () => go(i));
      heads[i].addEventListener("keydown", (e) => {
        const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (k) { e.preventDefault(); go((i + k + n) % n, true); }
        else if (e.key === "Home") { e.preventDefault(); go(0, true); } else if (e.key === "End") { e.preventDefault(); go(n - 1, true); }
      });
      const nx = $(".pros__go[data-go]", t); if (nx) nx.addEventListener("click", () => go(+nx.dataset.go));
      if (fine) {
        t.addEventListener("pointermove", (e) => { if (i !== cur || narrow.matches) return; const r = t.getBoundingClientRect(); t.style.setProperty("--tx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3)); t.style.setProperty("--ty", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3)); });
        t.addEventListener("pointerleave", () => { t.style.setProperty("--tx", "0"); t.style.setProperty("--ty", "0"); });
      }
    });
    layout(); frame(); onScroll(frame);
    addEventListener("resize", () => { layout(); frame(); });
    addEventListener("load", () => { layout(); frame(); });
    const start = () => { prosRow.classList.add("in"); setTimeout(() => { replay(tiles[cur]); vids(tiles[cur], true); }, 420); };
    if ("IntersectionObserver" in window) { const io = new IntersectionObserver((es) => { if (es.some((x) => x.isIntersecting)) { io.disconnect(); start(); } }, { threshold: 0.25 }); io.observe(prosRow); } else start();
  }

  /* ---------- v45 · SERVICIOS guiados por el scroll: el panel queda fijo y los servicios cambian uno a uno.
     La imagen nueva sube cubriendo la anterior; al final el último servicio se sostiene un momento y el panel sigue su camino ---------- */
  const svs = $(".svs");
  if (svs && !still) {
    const pin = $(".svs__pin", svs), ss = $$(".svs__s", svs), bs = $$(".svs__list button", svs), bar = $(".svs__bar", svs), N = ss.length;
    let cur = -1;
    const kOf = (p) => Math.min(N - 1, Math.floor(p * (N - 0.4) + 0.4));          // el último tramo (≈20 %) sostiene el último servicio
    const set = (k) => {
      if (k === cur) return; cur = k;
      ss.forEach((s, j) => { s.classList.toggle("is-in", j <= k); s.classList.toggle("is-on", j === k); });
      bs.forEach((b, j) => { b.classList.toggle("is-on", j === k); b.toggleAttribute("aria-current", j === k); });
    };
    // todas las imágenes miden lo mismo: el bloque de texto toma el alto del más largo (si no, la imagen anterior asoma por debajo)
    const stage = $(".svs__stage", svs), xs = $$(".svs__x", svs);
    const fitText = () => { stage.style.removeProperty("--xh"); stage.style.setProperty("--xh", Math.ceil(Math.max(...xs.map((x) => x.offsetHeight))) + "px"); };
    fitText(); addEventListener("resize", fitText); if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitText);
    const range = () => Math.max(1, svs.offsetHeight - pin.offsetHeight);
    const pinTop = () => parseFloat(getComputedStyle(pin).top) || 0;
    onScroll(() => {
      const r = svs.getBoundingClientRect(); if (r.bottom < -innerHeight || r.top > innerHeight * 2) return;
      const p = clamp((pinTop() - r.top) / range());
      set(kOf(p)); if (bar) bar.style.setProperty("--pp", p.toFixed(3));
    });
    bs.forEach((b, i) => b.addEventListener("click", () => {
      const top = svs.getBoundingClientRect().top + scrollY - pinTop(), p = (i + 0.2) / (N - 0.4);
      scrollTo({ top: top + Math.min(1, p) * range(), behavior: "smooth" });
    }));
  }

  /* ---------- v46 · SERVICIOS: el panel queda fijo y la pista de servicios avanza en horizontal, de forma continua, con el scroll.
     El servicio que pasa por el foco se ilumina y su imagen se desplaza un poco en sentido contrario (profundidad) ---------- */
  const svh = $(".svh");
  if (svh && !still) {
    const pin = $(".svh__pin", svh), view = $(".svh__view", svh), track = $(".svh__track", svh), items = $$(".svh__track>li", svh);
    const imgs = items.map((s) => $(".svh__m img", s)), names = items.map((s) => ($("h3", s) || {}).textContent || ""), now = $(".svh__now", svh), bar = $(".svh__bar", svh);
    let dist = 0, hold = 0, vw = 1, pos = [], lastX = -1, lastName = "";
    const pinTop = () => parseFloat(getComputedStyle(pin).top) || 0;
    const layout = () => {
      vw = view.clientWidth || 1;
      pos = items.map((s) => [s.offsetLeft, s.offsetWidth]);
      dist = Math.max(0, track.scrollWidth - vw);
      hold = innerHeight * 0.38;                                           // al final, la tarjeta de cierre se sostiene un momento antes de soltar
      svh.style.height = Math.round(pin.offsetHeight + dist + hold) + "px";
      lastX = -1;
    };
    const frame = () => {
      const r = svh.getBoundingClientRect(); if (r.bottom < -innerHeight || r.top > innerHeight * 2) return;
      const x = Math.min(dist, Math.max(0, pinTop() - r.top));
      if (x === lastX) return; lastX = x;
      track.style.transform = `translate3d(${(-x).toFixed(1)}px,0,0)`;
      const pr = dist ? x / dist : 0, f0 = (pos[0][0] + pos[0][1] / 2) / vw, f1 = (pos[pos.length - 1][0] + pos[pos.length - 1][1] / 2 - dist) / vw;
      const focus = vw * (f0 + (f1 - f0) * pr); let best = 0, bd = 1e9;   // el foco va del primer servicio (inicio) a la tarjeta de cierre (final)
      items.forEach((s, i) => {
        const d = (pos[i][0] + pos[i][1] / 2 - x - focus) / vw, a = Math.min(1, Math.abs(d) * 1.5);
        s.style.opacity = (1 - a * 0.78).toFixed(3); s.style.transform = `scale(${(1 - a * 0.05).toFixed(4)})`;
        if (imgs[i]) imgs[i].style.transform = `translate3d(${(d * -70).toFixed(1)}px,0,0) scale(1.14)`;
        if (Math.abs(d) < bd) { bd = Math.abs(d); best = i; }
      });
      const nm = names[best]; if (now && nm && nm !== lastName) { lastName = nm; now.textContent = nm; }
      if (bar) bar.style.setProperty("--pp", (dist ? x / dist : 0).toFixed(3));
    };
    layout(); frame();
    addEventListener("resize", () => { layout(); frame(); });
    addEventListener("load", () => { layout(); frame(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { layout(); frame(); });
    onScroll(frame);
  }

  /* ---------- v43 · PROCESO: etapas fijas a la izquierda; cada escena se anima al llegar y la etapa activa se marca con la barra ---------- */
  const pst = $(".pst");
  if (pst) {
    const steps = $$(".pst__s", pst), btns = $$(".pst__nav button", pst), bar = $(".pst__bar", pst), wrap = $(".pst__steps", pst);
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) e.target.classList.add("is-play"); else if (e.boundingClientRect.top > 0) e.target.classList.remove("is-play"); }), { threshold: 0.3 });
    steps.forEach((s) => io.observe(s));
    btns.forEach((bt, i) => bt.addEventListener("click", () => { const s = steps[i]; scrollTo({ top: s.getBoundingClientRect().top + scrollY - Math.max(80, (innerHeight - s.offsetHeight) / 2), behavior: "smooth" }); }));
    let lastK = -1;
    onScroll(() => {
      const r = wrap.getBoundingClientRect(); if (r.bottom < -innerHeight || r.top > innerHeight * 2) return;
      const mid = innerHeight * 0.5; let k = 0; steps.forEach((s, i) => { if (s.getBoundingClientRect().top < mid) k = i; });
      if (k !== lastK) { lastK = k; btns.forEach((bt, i) => { bt.classList.toggle("is-on", i === k); bt.setAttribute("aria-current", i === k ? "step" : "false"); }); }
      if (bar) bar.style.setProperty("--pp", clamp((mid - r.top) / r.height).toFixed(3));
    });
  }

  /* ---------- v43 · TESTIMONIOS: una voz a la vez; la barra del testimonio activo marca el tiempo y al llenarse pasa al siguiente ---------- */
  const tsx = $("#tsx");
  if (tsx) {
    const qs = $$(".tsx__q", tsx), ds = $$(".tsx__d", tsx), n = qs.length, num = $(".tsx__count b", tsx); let k = 0;
    const set = (i) => {
      k = (i + n) % n;
      qs.forEach((q, j) => q.classList.toggle("is-on", j === k));
      ds.forEach((d, j) => { d.classList.toggle("is-on", j === k); d.classList.toggle("is-done", j < k); d.setAttribute("aria-pressed", String(j === k)); const f = $("i", d); f.style.animation = "none"; void f.offsetWidth; f.style.animation = ""; });
      if (num) num.textContent = String(k + 1).padStart(2, "0");
      $$(".tsp__ph", tsx).forEach((ph, j) => ph.classList.toggle("is-on", j === k));   // v44: el retrato acompaña al testimonio
    };
    ds.forEach((d, j) => { d.addEventListener("click", () => set(j)); $("i", d).addEventListener("animationend", () => { if (d.classList.contains("is-on")) set(k + 1); }); });
    $$("[data-tsx]", tsx).forEach((bt) => bt.addEventListener("click", () => set(k + +bt.dataset.tsx)));
    tsx.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") tsx.classList.add("is-hold"); });
    tsx.addEventListener("pointerleave", () => tsx.classList.remove("is-hold"));
  }

  /* ---------- REELS: los cuatro con la misma jerarquía; solo se reproduce el que tocas (o el que está bien a la vista en el teléfono), así la web no se vuelve lenta ---------- */
  const rcs = $$(".reels4 .rcard");
  if (rcs.length) {
    const reelsUl = $(".reels4"), play = (v) => { if (v && !reduce) { v.preload = "auto"; v.play().catch(() => {}); } };
    rcs.forEach((c) => {
      const v = $("video", c);
      if (fine) {
        c.addEventListener("pointerenter", () => { c.classList.add("is-hot"); play(v); });
        c.addEventListener("pointerleave", () => { c.classList.remove("is-hot"); c.style.setProperty("--rx", "0deg"); c.style.setProperty("--ry", "0deg"); if (v) v.pause(); });
        c.addEventListener("pointermove", (e) => { const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; c.style.setProperty("--ry", (x * 9).toFixed(2) + "deg"); c.style.setProperty("--rx", (-y * 7).toFixed(2) + "deg"); c.style.setProperty("--gx", ((x + 0.5) * 100).toFixed(1) + "%"); c.style.setProperty("--gy", ((y + 0.5) * 100).toFixed(1) + "%"); });
        c.addEventListener("focus", () => { c.classList.add("is-hot"); play(v); });
        c.addEventListener("blur", () => { c.classList.remove("is-hot"); if (v) v.pause(); });
      } else {
        new IntersectionObserver(([e]) => { const on = e.isIntersecting && e.intersectionRatio > 0.7; c.classList.toggle("is-hot", on); if (on) play(v); else if (v) v.pause(); }, { threshold: [0, 0.7] }).observe(c);
      }
    });
    onVisible(reelsUl, (v) => { if (v) reelsUl.classList.add("is-in"); }, "-10% 0px");
    // v41 · celular: carrusel de un reel a la vez. Avanza solo cada 4,5 s mientras está a la vista; se puede deslizar con el dedo
    const dots = $$(".rdots i"), narrowQ = matchMedia("(max-width:900px)");
    let ri = 0, rTimer = 0, rVis = false, rHold = 0;
    const cur = () => { const x = reelsUl.scrollLeft, w = rcs[0].offsetWidth + parseFloat(getComputedStyle(reelsUl).columnGap || 0); return Math.round(x / (w || 1)); };
    reelsUl.addEventListener("scroll", () => { ri = cur(); dots.forEach((d, i) => d.classList.toggle("is-on", i === ri)); }, { passive: true });
    const goR = (i) => { const c = rcs[(i + rcs.length) % rcs.length]; reelsUl.scrollTo({ left: c.offsetLeft - rcs[0].offsetLeft, behavior: "smooth" }); };
    const runR = () => { clearInterval(rTimer); if (narrowQ.matches && rVis) rTimer = setInterval(() => { if (Date.now() - rHold > 3500) goR(ri + 1); }, 2600); };
    reelsUl.addEventListener("touchstart", () => { rHold = Date.now(); }, { passive: true });
    onVisible(reelsUl, (v) => { rVis = v; runR(); }, "0px");
    narrowQ.addEventListener("change", runR);
  }

  /* ---------- EQUIPO: las cuatro tarjetas entran juntas; en pantallas táctiles se abre una a la vez al tocar ---------- */
  const tk = $("#tk");
  if (tk) {
    const cs = $$(".tk__c", tk);
    onVisible(tk, (v) => { if (v) tk.classList.add("is-in"); }, "-12% 0px");
    cs.forEach((c) => c.addEventListener("click", () => { if (fine) return; const was = c.classList.contains("is-open"); cs.forEach((o) => o.classList.remove("is-open")); c.classList.toggle("is-open", !was); }));
  }

  /* ---------- TESTIMONIOS (v35): uno destacado con su retrato y dos al lado. Avanza solo mientras está a la vista; se detiene al pasar el puntero o al usar las flechas ---------- */
  const tst = $("#tst");
  if (tst) {
    const feats = $$(".tst__f", tst), n = feats.length, num = $("#tstN");
    const slots = $$(".tst__slot", tst).map((sl) => ({ off: +sl.dataset.off, cards: $$(".tst__c", sl) }));
    let k = 0, timer = 0, vis = false, hold = false;
    const set = (i) => {
      k = ((i % n) + n) % n;
      feats.forEach((f, j) => f.classList.toggle("is-on", j === k));
      slots.forEach(({ off, cards }) => cards.forEach((c, j) => c.classList.toggle("is-on", j === (k + off) % n)));
      if (num) num.textContent = String(k + 1).padStart(2, "0");
    };
    const run = () => { clearInterval(timer); if (!reduce && vis && !hold) timer = setInterval(() => set(k + 1), 6500); };
    $$("[data-tst]", tst).forEach((b) => b.addEventListener("click", () => { set(k + +b.dataset.tst); run(); }));
    tst.addEventListener("pointerenter", () => { hold = true; run(); });
    tst.addEventListener("pointerleave", () => { hold = false; run(); });
    tst.addEventListener("focusin", () => { hold = true; run(); });
    tst.addEventListener("focusout", () => { hold = false; run(); });
    onVisible(tst, (v) => { vis = v; run(); }, "0px");
    document.addEventListener("motionchange", run);
  }

  /* ---------- TESTIMONIOS: las tarjetas entran en cascada ---------- */
  const tq3 = $("#tq3");
  if (tq3) onVisible(tq3, (v) => { if (v) tq3.classList.add("is-in"); }, "-12% 0px");

  /* ---------- NOSOTROS: las cuatro personas flotan alrededor del título y se acomodan en fila, todas con el mismo peso ---------- */
  const tm = $(".tm");
  if (tm) {
    const cards = $$(".tm__c", tm), box = $(".tm__sticky", tm);
    const ORB = [[0.15, 0.3], [0.85, 0.25], [0.2, 0.76], [0.81, 0.74]];   // centros de la órbita (fracción del cuadro)
    onScroll(() => {
      if (innerWidth <= 900) { tm.style.setProperty("--tp", "1"); cards.forEach((c) => (c.style.transform = "")); return; }
      const tr = tm.getBoundingClientRect(); if (tr.bottom < -innerHeight || tr.top > innerHeight * 2) return;
      const total = tm.offsetHeight - innerHeight;
      const raw = reduce ? 1 : clamp(-tm.getBoundingClientRect().top / total);
      const tp = ease(clamp((raw - 0.12) / 0.5));
      tm.style.setProperty("--tp", tp.toFixed(3));
      const W = box.clientWidth, H = box.clientHeight;
      cards.forEach((c, i) => {
        const fw = c.offsetWidth, fh = c.offsetHeight, fcx = c.offsetLeft + fw / 2, fcy = c.offsetTop + fh / 2;
        const s0 = Math.min(0.5, 170 / fw), s = s0 + (1 - s0) * tp, k = 1 - tp;
        c.style.transform = `translate(${((ORB[i][0] * W - fcx) * k).toFixed(1)}px,${((ORB[i][1] * H - fcy) * k).toFixed(1)}px) scale(${s.toFixed(4)})`;
      });
    });
  }

  /* ---------- VISOR DE PROYECTOS: galería, video o sitio (sin páginas por proyecto) ---------- */
  const viewer = $("#viewer");
  if (viewer) {
    const vStage = $("#viewerStage"), vT = $("#viewerT"), vS = $("#viewerS"), vNav = $("#viewerNav"), vCount = $("#viewerCount");
    let items = [], idx = 0, lastFocus = null, kind = "";
    const showImg = () => {
      vStage.innerHTML = "";
      const img = document.createElement("img"); img.src = items[idx]; img.alt = vT.textContent + ", imagen " + (idx + 1);
      vStage.appendChild(img); vCount.textContent = `${idx + 1} / ${items.length}`;
    };
    const step = (d) => { if (kind !== "gallery" || items.length < 2) return; idx = (idx + d + items.length) % items.length; showImg(); };
    const openProject = (d, trigger) => {
      lastFocus = trigger; kind = d.kind; vT.textContent = d.t; vS.textContent = `${d.sub} · ${d.s}`; vStage.innerHTML = "";
      if (d.kind === "gallery") { items = d.items || []; idx = 0; vNav.hidden = items.length < 2; showImg(); }
      else if (d.kind === "video") {
        vNav.hidden = true;
        const v = document.createElement("video"); v.src = d.video; v.poster = d.poster || ""; v.controls = true; v.playsInline = true; v.autoplay = true; vStage.appendChild(v);
      } else {
        vNav.hidden = true;
        const w = document.createElement("div"); w.className = "viewer__web";
        w.innerHTML = `<img src="${d.poster}" alt=""><p>${d.note || "Sitio web"}</p><a class="btn btn--light" href="${d.url}" target="_blank" rel="noopener"><span>Visitar sitio</span><i class="dot"></i></a>`;
        vStage.appendChild(w);
      }
      viewer.showModal();
    };
    viewer.addEventListener("close", () => { const v = $("video", vStage); if (v) v.pause(); vStage.innerHTML = ""; if (lastFocus) lastFocus.focus(); });
    $("[data-close]", viewer).addEventListener("click", () => viewer.close());
    $("[data-prev]", viewer).addEventListener("click", () => step(-1));
    $("[data-next]", viewer).addEventListener("click", () => step(1));
    viewer.addEventListener("click", (e) => { if (e.target === viewer || e.target === vStage) viewer.close(); });
    viewer.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") step(-1); if (e.key === "ArrowRight") step(1); });
    $$("[data-project]").forEach((el) => el.addEventListener("click", () => { try { openProject(JSON.parse(el.dataset.project), el); } catch (_) { /* dato inválido */ } }));
  }

  /* ---------- SHOWREEL: el video crece con el scroll ---------- */
  const reel = $(".reel");
  if (reel) {
    const sticky = $(".reel__sticky", reel);
    onScroll(() => {
      const r = reel.getBoundingClientRect();
      if (r.bottom < -innerHeight || r.top > innerHeight * 2) return;
      const raw = reduce ? 0 : clamp(-r.top / (r.height - innerHeight));
      const t = clamp((raw - 0.06) / 0.74);
      const e = ease(t);
      const W = innerWidth, H = sticky.clientHeight;
      const w0 = Math.min(W * (W < 700 ? 0.42 : 0.24), 400), h0 = w0 * 0.62;
      sticky.style.setProperty("--w", (w0 + (W - 16 - w0) * e).toFixed(1) + "px");
      sticky.style.setProperty("--h", (h0 + (H - 16 - h0) * e).toFixed(1) + "px");
      sticky.style.setProperty("--rr", (14 + 10 * e).toFixed(1) + "px");
      sticky.style.setProperty("--p", e.toFixed(3));
      sticky.style.setProperty("--pp", clamp((e - 0.7) / 0.3).toFixed(3));
    });
  }

  /* ---------- piezas que se unen al llegar (cierre) ---------- */
  const joiners = $$("[data-join]");
  if (joiners.length) onScroll(() => joiners.forEach((el) => {
    const r = el.getBoundingClientRect();
    const j = reduce ? 0.8 : ease(clamp((innerHeight * 0.95 - r.top) / (innerHeight * 0.7)));
    el.style.setProperty("--j", j.toFixed(3));
  }));

  /* ---------- CIFRAS: cuentan al verse ---------- */
  $$("[data-count]").forEach((el) => {
    const n = +el.dataset.count, pad = (v) => (n < 10 ? String(v).padStart(2, "0") : String(v));
    if (reduce) { el.textContent = pad(n); return; }
    el.textContent = pad(0);
    let done = false;
    onVisible(el, (v) => {
      if (!v || done) return;
      done = true;
      const t0 = performance.now(), D = 1400;
      const tick = (t) => { const p = clamp((t - t0) / D), e = 1 - Math.pow(1 - p, 3); el.textContent = pad(Math.round(n * e)); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }, "0px");
  });

  /* ---------- PREGUNTAS: una abierta a la vez ---------- */
  $$(".faq3__list").forEach((list) => {
    const items = $$("details", list);
    items.forEach((d) => d.addEventListener("toggle", () => { if (d.open) items.forEach((o) => { if (o !== d) o.open = false; }); }));
  });

  /* ---------- CIERRE: meteoros suaves + rejilla de puntos que reacciona al puntero ---------- */
  $$(".meteors").forEach((box) => {
    for (let i = 0; i < 12; i++) {
      const m = document.createElement("i");
      m.style.setProperty("--x", (Math.random() * 120 - 10).toFixed(1) + "%");
      m.style.setProperty("--d", (5 + Math.random() * 6).toFixed(1) + "s");
      m.style.setProperty("--dl", (-Math.random() * 9).toFixed(1) + "s");
      box.appendChild(m);
    }
  });
  $$("canvas.dots").forEach((cv) => {
    const ctx = cv.getContext("2d"), host = cv.parentElement;
    let W = 0, H = 0, dpr = 1, mx = -9999, my = -9999, raf = 0, on = false;
    const GAP = 22, R = 150;
    const size = () => { const r = host.getBoundingClientRect(); dpr = Math.min(devicePixelRatio || 1, 2); W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; draw(); };
    const draw = () => {
      raf = 0;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      for (let y = GAP / 2; y < H; y += GAP) for (let x = GAP / 2; x < W; x += GAP) {
        const dx = x - mx, dy = y - my, d = Math.hypot(dx, dy), f = d < R ? 1 - d / R : 0;
        const px = x + (f ? (dx / (d || 1)) * f * 7 : 0), py = y + (f ? (dy / (d || 1)) * f * 7 : 0);
        ctx.fillStyle = f ? `rgba(234,214,214,${0.12 + f * 0.75})` : "rgba(245,243,238,.11)";
        ctx.beginPath(); ctx.arc(px, py, 1 + f * 1.3, 0, 6.2832); ctx.fill();
      }
    };
    const req = () => { if (!raf && on) raf = requestAnimationFrame(draw); };
    host.addEventListener("pointermove", (e) => { if (reduce) return; const r = host.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; req(); });
    host.addEventListener("pointerleave", () => { mx = my = -9999; req(); });
    onVisible(host, (v) => { on = v; if (v) size(); }, "0px");
    addEventListener("resize", () => { if (on) size(); });
  });

  /* ---------- reproductor con sonido y lightbox ---------- */
  const player = $("#player"), pv = $("video", player);
  const openReel = (src) => { pv.src = src; player.showModal(); pv.currentTime = 0; pv.muted = false; pv.play().catch(() => {}); };
  player.addEventListener("close", () => { pv.pause(); pv.removeAttribute("src"); pv.load(); });
  $(".x", player).addEventListener("click", () => player.close());
  player.addEventListener("click", (e) => { if (e.target === player) player.close(); });
  $$("[data-reel]").forEach((el) => {
    el.addEventListener("click", () => openReel(el.dataset.reel));
    if (el.tagName !== "BUTTON") el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openReel(el.dataset.reel); } });
  });
  const lb = $("#lightbox"), lbImg = $("img", lb);
  $$("[data-lightbox]").forEach((fig) => {
    fig.tabIndex = 0; fig.setAttribute("role", "button");
    const open = () => { lbImg.src = fig.dataset.lightbox; lbImg.alt = fig.dataset.alt || ""; lb.showModal(); };
    fig.addEventListener("click", open);
    fig.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  });
  lb.addEventListener("click", () => lb.close());

  /* ---------- filtros de proyectos ---------- */
  const filters = $$("[data-filter]");
  filters.forEach((btn) => btn.addEventListener("click", () => {
    const f = btn.dataset.filter;
    filters.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    $$(".grid .gcard").forEach((c) => c.classList.toggle("is-out", !(f === "todo" || c.dataset.cats === "todo" || c.dataset.cats === f)));
  }));

  /* ---------- formulario ---------- */
  const form = $("#form");
  if (form) {
    const qs = new URLSearchParams(location.search), pre = qs.get("servicio");
    if (qs.has("reunion") && !form.mensaje.value) { const pl = qs.get("reunion"); form.mensaje.value = pl && pl !== "1" ? `Quiero agendar una reunión para hablar del plan «${pl}».` : "Quiero agendar una reunión para hablar de mi proyecto."; }
    if (qs.get("correo") && !form.correo.value) form.correo.value = qs.get("correo");
    if (pre) $$('input[name="serv"]', form).forEach((i) => { if (i.value === pre) i.checked = true; });
    const setErr = (input, msg) => { $(".err", input.closest(".field")).textContent = msg; input.setAttribute("aria-invalid", msg ? "true" : "false"); };
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const nombre = form.nombre, correo = form.correo;
      const okName = !!nombre.value.trim(), okMail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo.value.trim());
      setErr(nombre, okName ? "" : "Escribe tu nombre para poder responderte.");
      setErr(correo, okMail ? "" : "Escribe un correo válido, por ejemplo nombre@correo.com.");
      if (!okName || !okMail) { (okName ? correo : nombre).focus(); return; }
      const data = { nombre: nombre.value.trim(), correo: correo.value.trim(), empresa: form.empresa.value.trim(), servicios: $$('input[name="serv"]:checked', form).map((i) => i.value).join(", "), mensaje: form.mensaje.value.trim() };
      const ok = $("#formOk");
      if (CONFIG.formEndpoint) {
        try {
          const r = await fetch(CONFIG.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) });
          if (r.ok) { ok.textContent = "Recibimos tu idea. Te escribiremos pronto."; ok.hidden = false; form.reset(); return; }
        } catch (_) { /* si falla, se usa el correo */ }
      }
      const lines = [`Nombre: ${data.nombre}`, `Correo: ${data.correo}`];
      if (data.empresa) lines.push(`Marca o negocio: ${data.empresa}`);
      if (data.servicios) lines.push(`Necesito: ${data.servicios}`);
      if (data.mensaje) lines.push("", data.mensaje);
      location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent("Quiero darle forma a mi idea — " + data.nombre)}&body=${encodeURIComponent(lines.join("\n"))}`;
      ok.textContent = "Se abrió tu correo con el mensaje listo. Solo falta enviarlo.";
      ok.hidden = false;
    });
  }

  /* ---------- CTA fijo en móvil ---------- */
  const sticky = $("#stickyCta");
  const isContact = document.body.dataset.page === "contacto";
  const avoid = $$(".hero, .hero4, #cta, #foot, .cta");
  // v40: el botón flotante ya no tapa lo que se está leyendo: se esconde al bajar y aparece al subir (cuando la persona busca algo)
  let lastY = scrollY, goingUp = false;
  onScroll(() => {
    const y = scrollY;
    if (Math.abs(y - lastY) > 8) { goingUp = y < lastY; lastY = y; }
    const blocked = avoid.some((el) => { const r = el.getBoundingClientRect(); return r.top < innerHeight * 0.9 && r.bottom > innerHeight * 0.1; });
    sticky.classList.toggle("show", !isContact && y > innerHeight * 0.6 && goingUp && !blocked && !menu.classList.contains("is-open"));
  });
})();
