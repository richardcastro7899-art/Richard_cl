// Genera las páginas del sitio (raíz) a partir de src/*.html: cabecera, nav y pie compartidos + bloques con los datos.
// Uso: node build.mjs
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(here, "assets/amurek-geo.js"), "utf8"), ctx);
const G = ctx.window.AMUREK_GEO;

/* ============================================================
   DATOS — servicios, proyectos, equipo y preguntas (editar aquí)
   Todo el material visual es de REFERENCIA (de internet): reemplazar por trabajos reales antes de publicar.
   Cada proyecto abre un visor: galería, video o enlace a la web.
   ============================================================ */
const R = "assets/ref/";
// v49: cada video ofrece WebM (VP9, más liviano) y MP4 de respaldo; el WebM se incluye solo si existe y pesa menos
const vsrc = (v) => {
  const [base, frag] = v.split("#"), t = frag ? "#" + frag : "", webm = base.replace(/\.mp4$/, ".webm");
  const ok = fs.existsSync(path.join(here, webm)) && fs.statSync(path.join(here, webm)).size < fs.statSync(path.join(here, base)).size;
  return (ok ? `<source src="${webm}${t}" type="video/webm">` : "") + `<source src="${v}" type="video/mp4">`;
};
// v49: dirección pública del sitio (cámbiala si el dominio final es otro); se usa en canonical, Open Graph, sitemap y datos estructurados
const SITE = "https://amurek.com";
const SERVICES = [
  {
    id: "branding", t: "Branding", short: "Branding", img: R + "n-cards.webp", label: "Identidad de marca",
    d: "Identidades con una idea clara detrás, que se reconocen en todas partes.",
    tags: ["Estrategia de marca", "Naming", "Logotipo", "Manual de marca", "Papelería"],
    pitch: "Construimos marcas con una idea clara: identidad, voz y sistema visual que se reconocen y se recuerdan.",
    incluye: ["Diagnóstico y estrategia de marca", "Naming y mensaje", "Logotipo y sistema visual", "Paleta, tipografía y estilo", "Manual de marca y papelería"],
    entregables: ["Archivos de marca en vector", "Versiones a color, negativo y monocromo", "Manual de uso", "Mockups de presentación"],
    ideal: "Marcas nuevas o que crecieron y ya no se ven como lo que son.",
  },
  {
    id: "audiovisual", t: "Producción audiovisual", short: "Audiovisual", img: R + "trailer-a.webp", video: R + "trailer-a.mp4#t=3", label: "Video y fotografía",
    d: "Video, fotografía y motion que cuentan tu historia con ritmo.",
    tags: ["Spots", "Reels", "Fotografía", "Motion graphics", "Animación de logo"],
    pitch: "Producimos video, fotografía y animación para que tu marca se vea, se escuche y se sienta.",
    incluye: ["Guion y preproducción", "Rodaje de video y fotografía", "Edición, color y sonido", "Motion graphics y animación", "Versiones para redes"],
    entregables: ["Videos en horizontal y vertical", "Cortes para reels y stories", "Fotografías editadas", "Archivos del proyecto"],
    ideal: "Lanzamientos, campañas y marcas que necesitan contenido con producción.",
  },
  {
    id: "redes", t: "Redes y contenido", short: "Redes", img: R + "knit.webp", label: "Contenido para redes",
    d: "Tu marca presente todos los días, con una sola voz y una sola línea gráfica.",
    tags: ["Estrategia de contenido", "Línea gráfica", "Calendario", "Community management", "Reportes"],
    pitch: "Cuidamos tu marca en el día a día: contenido, diseño y comunidad con una misma voz.",
    incluye: ["Estrategia y pilares de contenido", "Línea gráfica y plantillas", "Calendario y publicaciones", "Gestión de comunidad", "Reporte mensual"],
    entregables: ["Posts, carruseles y reels del mes", "Kit de plantillas editables", "Calendario aprobado", "Reporte de resultados"],
    ideal: "Marcas que quieren estar presentes sin improvisar.",
  },
  {
    id: "marketing", t: "Marketing digital", short: "Marketing", img: R + "n-poster.webp", label: "Campañas",
    d: "Campañas que llegan a las personas correctas y se pueden medir.",
    tags: ["Meta Ads", "Google Ads", "Embudos", "Landing pages", "Analítica"],
    pitch: "Diseñamos campañas que conectan con tu público y medimos lo que funciona para invertir mejor.",
    incluye: ["Plan de campaña y público", "Creatividades para anuncios", "Pauta en Meta y Google", "Embudos y landing pages", "Medición y optimización"],
    entregables: ["Plan de medios", "Piezas para anuncios", "Campañas configuradas", "Informe con aprendizajes"],
    ideal: "Negocios que quieren vender más con una inversión clara.",
  },
  {
    id: "web", t: "Web y software", short: "Web y software", img: R + "n-laptop.webp", label: "Sitios y herramientas",
    d: "Sitios, tiendas y herramientas digitales hechas a la medida.",
    tags: ["Sitios web", "E-commerce", "Apps web", "Automatización", "Integraciones"],
    pitch: "Diseñamos y desarrollamos sitios, tiendas y software a la medida: rápidos, claros y fáciles de usar.",
    incluye: ["Arquitectura y experiencia de usuario", "Diseño de interfaz", "Desarrollo web y e-commerce", "Software y apps web a medida", "Integraciones y automatización"],
    entregables: ["Sitio o app publicada", "Código y documentación", "Capacitación para editar", "Soporte de lanzamiento"],
    ideal: "Marcas que necesitan una herramienta digital que trabaje por ellas.",
  },
];
const S = Object.fromEntries(SERVICES.map((s) => [s.id, s]));

// kind: gallery = galería de imágenes · video = reproductor · web = enlace a un sitio
const PROJECTS = [
  { t: "Nómada", sub: "Identidad y papelería", s: "branding", year: "2026", img: R + "w-golden.webp", kind: "gallery", items: [R + "w-golden.webp", R + "n-cards.webp", R + "s20.webp", R + "n-bag.webp"] },
  { t: "Aurora", sub: "Spot de lanzamiento", s: "audiovisual", year: "2026", img: R + "trailer-a.webp", kind: "video", video: R + "trailer-a.mp4", poster: R + "trailer-a.webp" },
  { t: "Silvestre", sub: "Línea gráfica para redes", s: "redes", year: "2026", img: R + "w-wild.webp", kind: "gallery", items: [R + "w-wild.webp", R + "w-dsadas.webp", R + "n-ice.webp", R + "n-sport.webp"] },
  { t: "Carmín", sub: "Campaña de producto", s: "marketing", year: "2026", img: R + "w-saddas.webp", kind: "gallery", items: [R + "w-saddas.webp", R + "n-radio.webp", R + "n-poster.webp"] },
  { t: "Flora", sub: "Sitio web y comercio", s: "web", year: "2026", img: R + "n-laptop.webp", kind: "web", url: "https://nordic-template-supply.webflow.io/", note: "Sitio de referencia", poster: R + "n-laptop.webp" },
  { t: "Brisa", sub: "Película de marca", s: "audiovisual", year: "2026", img: R + "showreel.webp", kind: "video", video: R + "showreel.mp4", poster: R + "showreel.webp" },
];

const TEAM = [
  { n: "Richard Castro", r: "Director creativo", b: "Productor audiovisual y estratega de marca. Dirige la visión creativa de cada proyecto.", img: "assets/team/richard.jpg", pos: "50% 20%" },
  { n: "Nombre Apellido", r: "Directora de estrategia", b: "Convierte lo que quiere lograr tu negocio en un plan claro de marca y contenido.", img: R + "woman-final.webp", pos: "50% 25%" },
  { n: "Nombre Apellido", r: "Director de arte", b: "Cuida que la identidad se vea y se sienta igual en cada pieza.", img: R + "n-elegant.webp", pos: "50% 25%" },
  { n: "Nombre Apellido", r: "Líder de web y software", b: "Construye sitios y herramientas rápidas, claras y fáciles de usar.", img: R + "puffer.webp", pos: "50% 25%" },
];

const FAQS = [
  ["¿Con qué tipo de negocios trabajan?", "Con emprendimientos, pymes y marcas en crecimiento que quieren verse profesionales y coherentes. Si tienes una idea, empezamos por ahí."],
  ["¿Cuánto cuesta un proyecto?", "Cada proyecto se cotiza según su alcance. Cuéntanos qué necesitas y te enviamos una propuesta clara, con lo que incluye cada etapa."],
  ["¿Puedo contratar solo un servicio?", "Sí. Puedes empezar con una marca, un video, una campaña o una web, y sumar el resto cuando lo necesites."],
  ["¿Trabajan por proyecto o de forma mensual?", "De las dos formas: por proyecto para algo puntual, o con un plan mensual para redes, contenido y campañas."],
  ["¿Cómo empezamos?", "Escríbenos con tu idea. Agendamos una conversación, entendemos lo que necesitas y te enviamos la propuesta."],
];

// tira visual de «lo que hacemos» (todo material de referencia)
const STRIP_A = [["Identidad", R + "n-cards.webp"], ["Reels y video", R + "reel-1.webp"], ["Campañas", R + "w-man1.webp"], ["Redes", R + "n-sport.webp"], ["Empaque", R + "w-saddas.webp"]];
const STRIP_B = [["Sitios web", R + "n-laptop.webp"], ["Fotografía", R + "n-foot.webp"], ["Producto", R + "n-bag.webp"], ["Branding", R + "s20.webp"], ["Contenido", R + "knit.webp"]];

/* ============================================================
   PIEZAS
   ============================================================ */
const AR = `<svg class="ar" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;
const AR_UR = `<svg class="ar" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>`;
const PLAY = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>`;
const PLUS = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>`;
const CHECK = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>`;
const ISO_PATHS = `<path d="M47.11 0A47.11 47.11 0 0 0 47.11 94.22Z"/><path d="M53.83 21.84A47.11 47.11 0 0 1 100.94 68.95V116.06H53.83Z"/>`;
const ISO = `<svg viewBox="0 0 100.94 116.06" aria-hidden="true" fill="currentColor">${ISO_PATHS}</svg>`;
const AVATAR = `<span class="avatar avatar--iso" aria-hidden="true">${ISO}</span>`;
const letters = ["a", "mu", "r", "e", "k"].map((id) => `<path d="${G.LETTER_D[id]}"${G.EVENODD[id] ? ' fill-rule="evenodd"' : ""}/>`).join("");
const b = G.LOGO_BOX;
const SYMBOLS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
<symbol id="wordmark" viewBox="${b.x0} ${b.y0} ${(b.x1 - b.x0).toFixed(2)} ${(b.y1 - b.y0).toFixed(2)}"><g fill="currentColor">${letters}</g></symbol>
</defs></svg>`;
const WORDMARK = `<svg class="wm" viewBox="0 0 677.68 146.85" role="img" aria-label="AMUREK"><use href="#wordmark"/></svg>`;
const WM_B = G.LOGO_BOX;
const WORDMARK_L = `<svg class="wm wm--l" viewBox="${WM_B.x0} ${WM_B.y0} ${(WM_B.x1 - WM_B.x0).toFixed(2)} ${(WM_B.y1 - WM_B.y0).toFixed(2)}" role="img" aria-label="AMUREK">${["a", "mu", "r", "e", "k"].map((id, i) => `<path class="wml" style="--i:${i}" d="${G.LETTER_D[id]}"${G.EVENODD[id] ? ' fill-rule="evenodd"' : ""}/>`).join("")}</svg>`;
const ref = (n) => `${R}${n}.webp`;
const esc = (o) => JSON.stringify(o).replace(/&/g, "&amp;").replace(/"/g, "&quot;");

/* ============================================================
   PARTES COMPARTIDAS
   ============================================================ */
const pad2 = (n) => String(n).padStart(2, "0");
const MENU_DESC = { inicio: "Lo que hacemos", servicios: "Cinco servicios, un equipo", proyectos: "Trabajo seleccionado", nosotros: "El estudio y el equipo", contacto: "Cuéntanos tu idea" };
const MENU_IMG = { inicio: "assets/identidad-poster.jpg", servicios: "assets/ref/n-cards.webp", proyectos: "assets/ref/w-golden.webp", nosotros: "assets/ref/n-studio.webp", contacto: "assets/team/richard.jpg" };
const NAV_ITEMS = [["inicio", "index.html", "Inicio"], ["servicios", "servicios.html", "Servicios"], ["proyectos", "proyectos.html", "Proyectos"], ["nosotros", "nosotros.html", "Nosotros"], ["contacto", "contacto.html", "Contacto"]];

const PRE = `<div class="pre" id="pre" aria-hidden="true">
  <div class="pre__panels">${[0, 1, 2, 3, 4].map((i) => `<i class="pre__p" style="--i:${i}"></i>`).join("")}</div>
  <div class="pre__logo">${WORDMARK_L}</div>
</div>`;
// Cloudflare Pages sirve /servicios.html como /servicios: las direcciones públicas van sin .html
const pageUrl = (m) => SITE + "/" + (m.file === "index.html" ? "" : m.file.replace(/\.html$/, ""));
const SOCIAL = ["https://www.instagram.com/amurek.estudio", "https://www.tiktok.com/@amurek.estudio", "https://www.linkedin.com/company/amurek-estudio", "https://www.behance.net/amurekestudio"];
const LD = {
  "@context": "https://schema.org", "@type": "ProfessionalService", "@id": SITE + "/#org",
  name: "AMUREK", alternateName: "AMUREK Agencia Creativa", url: SITE + "/", logo: SITE + "/assets/icon-512.png", image: SITE + "/assets/og-amurek.jpg",
  description: "Agencia creativa en Ecuador: branding, producción audiovisual, redes y contenido, marketing digital y web y software.",
  email: "hola@amurek.com", areaServed: { "@type": "Country", name: "Ecuador" }, address: { "@type": "PostalAddress", addressCountry: "EC" },
  knowsAbout: ["Branding", "Producción audiovisual", "Redes sociales", "Marketing digital", "Diseño web"], sameAs: SOCIAL,
};
const HEAD = (m) => `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${m.title}</title>
<meta name="description" content="${m.desc}">
<meta name="theme-color" content="#F2F0EB">
<meta property="og:type" content="website">
<meta property="og:title" content="${m.title}">
<meta property="og:description" content="${m.desc}">
<meta property="og:locale" content="es_EC">
<meta property="og:site_name" content="AMUREK">
<meta property="og:url" content="${pageUrl(m)}">
<meta property="og:image" content="${SITE}/assets/og-amurek.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="AMUREK, agencia creativa en Ecuador">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${m.title}">
<meta name="twitter:description" content="${m.desc}">
<meta name="twitter:image" content="${SITE}/assets/og-amurek.jpg">
${m.noindex ? '<meta name="robots" content="noindex">\n<base href="/">' : `<link rel="canonical" href="${pageUrl(m)}">`}
<link rel="apple-touch-icon" href="assets/icon-180.png">
${m.page === "inicio" ? `<script type="application/ld+json">${JSON.stringify(LD)}</script>` : ""}
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-14 -14 129 144'%3E%3Crect x='-14' y='-14' width='129' height='144' rx='30' fill='%23541D35'/%3E%3Cpath fill='%23F5F3EE' d='M47.11 0A47.11 47.11 0 0 0 47.11 94.22Z'/%3E%3Cpath fill='%23F5F3EE' d='M53.83 21.84A47.11 47.11 0 0 1 100.94 68.95V116.06H53.83Z'/%3E%3C/svg%3E">
<link rel="preload" href="assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
<script>(function(){var d=document.documentElement;try{history.scrollRestoration="manual"}catch(e){}if(/[?&]still/.test(location.search))return;d.classList.add("js");try{if(!sessionStorage.getItem("amurek-pre"))d.classList.add("pre-on")}catch(e){}if("${m.page}"==="inicio")d.classList.add("nav-morph")})();</script>
<link rel="stylesheet" href="styles.css">
</head>
<body data-page="${m.page}">
${SYMBOLS}
${PRE}
<a class="skip" href="#main">Saltar al contenido</a>
`;

const NAV = (page) => `<header class="nav" id="nav">
  <div class="nav__in">
    <a class="nav__logo" href="index.html" aria-label="AMUREK, ir al inicio">${WORDMARK}</a>
    <span class="nav__tag"><span>Agencia</span><span>Creativa</span></span>
    <nav class="nav__links" aria-label="Principal">
      ${NAV_ITEMS.map(([k, h, t], i) => `<a style="--i:${i}" href="${h}"${k === page ? ' aria-current="page"' : ""}>${t}</a>`).join("\n      ")}
    </nav>
    <a class="btn btn--dark btn--sm nav__cta" href="contacto.html"><span>Cotiza tu proyecto</span><i class="dot"></i></a>
    <button class="nav__menu" id="menuBtn" aria-expanded="false" aria-controls="menu" aria-label="Abrir menú"><i></i><i></i></button>
  </div>
</header>
<div class="menu" id="menu" aria-hidden="true">
  <div class="menu__sheet">
    <nav class="menu__links" aria-label="Menú">
      ${NAV_ITEMS.map(([id, h, t], i) => `<a href="${h}" data-page-link="${id}" style="--i:${i}"><span class="menu__t">${t}</span>${AR}</a>`).join("\n      ")}
    </nav>
    <div class="menu__foot"><a class="btn btn--dark" href="contacto.html"><span>Cotiza tu proyecto</span><i class="dot"></i></a><a class="menu__mail" href="contacto.html" data-mail>—</a><a class="menu__mail" href="#" data-wa data-wa-row hidden>WhatsApp</a></div>
  </div>
</div>
`;

/* ---------- formulario ---------- */
const SVC_CHIPS = SERVICES.map((s) => `<label><input type="checkbox" name="serv" value="${s.t}"><span>${s.short}</span></label>`).join("");
const FORM = `<form class="form" id="form" novalidate>
        <div class="form__row">
          <div class="field"><label for="f-nombre">Nombre</label><input id="f-nombre" name="nombre" autocomplete="name" placeholder="Escribe aquí" required><span class="err" aria-live="polite"></span></div>
          <div class="field"><label for="f-correo">Correo</label><input id="f-correo" name="correo" type="email" autocomplete="email" placeholder="Escribe aquí" required><span class="err" aria-live="polite"></span></div>
        </div>
        <div class="field field--full"><label for="f-empresa">Marca o negocio <small>(opcional)</small></label><input id="f-empresa" name="empresa" autocomplete="organization" placeholder="¿Cómo se llama?"></div>
        <fieldset class="field field--full"><legend>¿Qué necesitas?</legend><div class="chips">${SVC_CHIPS}</div></fieldset>
        <div class="field field--full"><label for="f-mensaje">Tu idea</label><textarea id="f-mensaje" name="mensaje" rows="3" placeholder="Cuéntanos en pocas líneas qué quieres lograr."></textarea></div>
        <div class="form__foot"><button class="btn btn--dark" type="submit"><span>Enviar mi idea</span><i class="dot"></i></button><p class="form__ok" id="formOk" role="status" hidden></p></div>
      </form>`;

/* ---------- cierre: banner con luz en movimiento (como el pie de Deluix, con la identidad de AMUREK) ---------- */
const AR_RET = `<svg class="ar" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5v6a3 3 0 0 0 3 3h11M15 9.5l4.2 4.5-4.2 4.5"/></svg>`;
const CTA = `<section class="pad cta3" id="cta">
  <div class="panel cta3__panel">
    <i class="cta3__g cta3__g--a" aria-hidden="true"></i><i class="cta3__g cta3__g--b" aria-hidden="true"></i><i class="cta3__g cta3__g--c" aria-hidden="true"></i>
    <canvas class="dots" aria-hidden="true"></canvas>
    <div class="cta3__in">
      <h2 class="h1 rv">Empieza tu proyecto con nosotros.</h2>
      <p>Cuéntanos tu idea. Te respondemos con una propuesta clara y los siguientes pasos.</p>
      <div class="cta3__act"><a class="btn btn--light cta3__btn" href="contacto.html"><span>Cotiza tu proyecto</span><i class="dot"></i></a></div>
      <ul class="cta3__list"><li><i>${CHECK}</i>Respuesta en un día hábil</li><li><i>${CHECK}</i>Propuesta clara antes de empezar</li><li><i>${CHECK}</i>Hablas con quien hace tu proyecto</li></ul>
    </div>
  </div>
</section>
`;

/* ---------- pie ---------- */
const COPY = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="3"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>`;
const UP = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>`;
const FOOT = `<footer class="foot7" id="foot">
  <div class="foot7__in">
    <div class="foot7__top">
      <div class="foot7__brand">
        <a class="foot7__logo" href="index.html" aria-label="AMUREK, ir al inicio">${WORDMARK}</a>
        <form class="foot7__form" data-quick novalidate>
          <label for="fq-mail">Tu correo</label>
          <div class="foot7__fld"><input id="fq-mail" name="correo" type="email" autocomplete="email" placeholder="Escribe tu correo"><button type="submit" class="btn btn--light btn--sm"><span>Escríbenos</span><i class="dot"></i></button></div>
          <p class="foot7__note" aria-live="polite">Te respondemos en un día hábil. Tu información nunca se comparte con terceros.</p>
        </form>
      </div>
      <nav class="foot7__cols" aria-label="Pie de página">
        <div><p class="foot7__k">Páginas</p><ul>${NAV_ITEMS.map(([, h, t]) => `<li><a href="${h}">${t}</a></li>`).join("")}</ul></div>
        <div><p class="foot7__k">Servicios</p><ul>${SERVICES.map((s) => `<li><a href="servicios.html#${s.id}">${s.short}</a></li>`).join("")}</ul></div>
        <div><p class="foot7__k">Legal</p><ul><li><a href="privacidad.html">Política de privacidad</a></li><li><a href="terminos.html">Términos de uso</a></li><li><a href="cookies.html">Política de cookies</a></li><li><button type="button" class="foot7__btn" data-consent-open>Preferencias de cookies</button></li></ul></div>
        <div><p class="foot7__k">Contacto</p><ul><li><a href="contacto.html" data-mail>—</a></li><li data-wa-row hidden><a href="#" data-wa>WhatsApp</a></li><li>Ecuador</li></ul></div>
      </nav>
    </div>
    <div class="foot7__bar">
      <div class="foot7__l"><ul class="foot7__soc" data-social-icons hidden></ul></div>
      <p class="foot7__c">©<span data-year>2026</span> AMUREK. Todos los derechos reservados.</p>
    </div>
    <div class="foot7__wm" aria-hidden="true">${WORDMARK}</div>
  </div>
</footer>
<div class="ck" id="ck" role="region" aria-labelledby="ck-t" hidden>
  <p class="ck__t" id="ck-t">Tu privacidad</p>
  <p class="ck__d">Usamos almacenamiento técnico para que el sitio funcione. Con tu permiso, también usaremos cookies de análisis y de marketing para saber cómo se usa el sitio y medir nuestras campañas. <a href="cookies.html">Política de cookies</a></p>
  <form class="ck__prefs" id="ckPrefs" hidden>
    <label class="ck__o"><span><b>Necesarias</b><small>Hacen que el sitio funcione. Siempre activas.</small></span><input type="checkbox" checked disabled><i></i></label>
    <label class="ck__o"><span><b>Análisis</b><small>Cuentan visitas de forma anónima para mejorar el sitio.</small></span><input type="checkbox" name="analytics"><i></i></label>
    <label class="ck__o"><span><b>Marketing</b><small>Miden campañas y muestran anuncios en otras plataformas.</small></span><input type="checkbox" name="marketing"><i></i></label>
  </form>
  <div class="ck__act">
    <button type="button" class="btn btn--dark btn--sm" data-ck="all"><span>Aceptar todas</span><i class="dot"></i></button>
    <button type="button" class="btn btn--line btn--sm" data-ck="none"><span>Solo necesarias</span></button>
    <button type="button" class="ck__cfg" data-ck="cfg" aria-expanded="false" aria-controls="ckPrefs">Configurar</button>
  </div>
</div>
<a class="stickycta" href="contacto.html" id="stickyCta"><span>Cotiza tu proyecto</span><i class="dot"></i></a>
<dialog class="lightbox" id="lightbox"><button class="x" aria-label="Cerrar">×</button><img alt=""></dialog>
<dialog class="player" id="player"><button class="x" aria-label="Cerrar">×</button><video controls playsinline preload="none"></video></dialog>
<dialog class="viewer" id="viewer" aria-label="Proyecto">
  <button class="x" data-close aria-label="Cerrar">×</button>
  <div class="viewer__stage" id="viewerStage"></div>
  <div class="viewer__bar">
    <div class="viewer__info"><b id="viewerT"></b><span id="viewerS"></span></div>
    <div class="viewer__nav" id="viewerNav"><button type="button" data-prev aria-label="Anterior">‹</button><span id="viewerCount"></span><button type="button" data-next aria-label="Siguiente">›</button></div>
  </div>
</dialog>
<script src="main.js" defer></script>
</body>
</html>
`;

/* ============================================================
   BLOQUES
   ============================================================ */
// PORTADA: panel oscuro con hilos de luz (canvas 2D ligero). Al bajar, los hilos se ordenan y tejen el isotipo
const FLIP = ["forma", "movimiento", "comunidad", "clientes", "pantalla"];
const HERO = `<section class="hero4" id="top">
  <h1 class="sr">AMUREK, agencia creativa en Ecuador: donde tu idea encuentra forma.</h1>
  <div class="ht" aria-hidden="true">
    <div class="ht__logo" id="htLogo"><span class="ht__wm">${WORDMARK}</span><sup class="ht__reg">®</sup></div>
    <p class="ht__r"><span>Agencia</span><span>Creativa</span></p>
  </div>
  <div class="hero4__sticky">
    <div class="panel panel--dark hero4__panel" id="heroPanel">
      <div class="hs__bg" aria-hidden="true"><i class="hs__glow hs__glow--a"></i><i class="hs__glow hs__glow--b"></i><i class="hs__grain"></i></div>
      <canvas class="hero4__cv" aria-hidden="true"></canvas>
      <div class="hero4__in">
        <div class="hero4__top">
          <p class="hero4__k"><i></i>Agencia creativa en Ecuador</p>
          <p class="hero4__t" aria-hidden="true">Donde tu idea<br>encuentra <span class="hs__word">${FLIP.map((w, i) => `<span${i === 0 ? ' class="is-on"' : ""}>${w}.</span>`).join("")}</span></p>
        </div>
        <div class="hero4__bot">
          <p class="hero4__p">Marca, video, contenido, campañas y web con un solo equipo. Pensamos tu idea, la conectamos con tu público y le damos forma.</p>
          <div class="hero4__cta"><a class="btn btn--light" href="contacto.html"><span>Cotiza tu proyecto</span><i class="dot"></i></a><a class="btn btn--glass" href="proyectos.html"><span>Ver proyectos</span><i class="dot"></i></a></div>
        </div>
      </div>
      <a class="hcard" href="contacto.html" aria-label="Habla con un asesor de AMUREK">
        <span class="hcard__iso" aria-hidden="true">${ISO}</span>
        <span class="hcard__t"><b>Habla con un asesor</b><span>Equipo de proyectos</span></span>
        <i class="hcard__go" aria-hidden="true">${AR_UR}</i>
      </a>
    </div>
  </div>
</section>`;

// FRASE + CARRUSEL de lo que hacemos (material de referencia): solo la imagen y el título. Tres copias del grupo: el recorrido nunca deja huecos
const STRIP = [
  ["Identidad", R + "n-cards.webp"], ["Reels y video", R + "reel-1.webp"], ["Campañas", R + "w-man1.webp"], ["Redes", R + "n-sport.webp"], ["Empaque", R + "w-saddas.webp"],
  ["Sitios web", R + "n-laptop.webp"], ["Fotografía", R + "n-foot.webp"], ["Producto", R + "n-bag.webp"], ["Papelería", R + "s20.webp"], ["Contenido", R + "knit.webp"],
];
const AR_CYCLE = ["4/5", "1/1", "3/4"];
const sCard = ([t, img], i) => `<li class="scard" style="--ar:${AR_CYCLE[i % 3]}"><figure><img src="${img}" alt="" loading="lazy"></figure><p class="scard__t"><b>${t}</b></p></li>`;
const sSet = (hidden) => `<ul class="strip__set"${hidden ? ' aria-hidden="true"' : ""}>${STRIP.map(sCard).join("")}</ul>`;
const STATEMENT = `<section class="pad statement" id="hacemos">
  <div class="panel statement__panel">
    <div class="statement__head">
      <h2 class="statement__h rv">Ideas con forma.<br>Marcas que se notan.</h2>
      <p class="statement__p">Estrategia, diseño, imagen y tecnología en un solo equipo. Pensamos tu marca una vez y la hacemos viva en cada pantalla.</p>
    </div>
    <div class="strip" aria-label="Ejemplos de lo que hacemos"><div class="strip__run">${sSet(false)}${sSet(true)}${sSet(true)}</div></div>
  </div>
</section>`;

const pdata = (p) => ({ t: p.t, sub: p.sub, s: S[p.s].short, kind: p.kind, items: p.items, video: p.video, poster: p.poster, url: p.url, note: p.note });
const pmedia = (p) => p.kind === "video"
  ? `<video muted loop playsinline preload="none" data-autoplay poster="${p.img}" aria-hidden="true">${vsrc(p.video)}</video>`
  : `<img src="${p.img}" alt="" loading="lazy">`;
const cue = (p) => ({ gallery: "Ver galería", video: "Ver video", web: "Ver sitio" }[p.kind]);
// PROYECTOS: una escena fija; el siguiente proyecto aparece como un cuarto de disco que crece desde la esquina recta
const PW = [PROJECTS[0], PROJECTS[1], PROJECTS[3], PROJECTS[4]];
const WORK = `<section class="pwork" id="proyectos">
  <div class="wrap work__head">
    <h2 class="h1 rv">Proyectos seleccionados.</h2>
    <p class="work__lead">Una muestra de cómo damos forma a las marcas: identidad, contenido, campañas y web.</p>
  </div>
  <div class="pwh" id="pwh">
    <div class="pwh__sticky">
      <div class="pwh__txt">
        ${PW.map((p, i) => `<div class="pwh__i${i === 0 ? " is-on" : ""}">
          <p class="pwh__k">${S[p.s].short}</p>
          <h3 class="pwh__t">${p.t}</h3>
          <p class="pwh__s">${p.sub}</p>
          <button type="button" class="btn btn--dark" data-project="${esc(pdata(p))}" aria-label="${cue(p)}: ${p.t}"><span>${cue(p)}</span><i class="dot"></i></button>
        </div>`).join("\n        ")}
      </div>
      <ul class="pwh__row" aria-hidden="true">
        ${PW.map((p, i) => `<li class="pwh__c" style="--i:${i}"><figure class="pwh__m"><img src="${p.img}" alt=""${i > 1 ? ' loading="lazy"' : ""}></figure></li>`).join("\n        ")}
      </ul>
    </div>
  </div>
  <div class="center"><a class="btn btn--dark" href="proyectos.html"><span>Ver todos los proyectos</span><i class="dot"></i></a></div>
</section>`;

// SERVICIOS: lista fija a la izquierda y detalle a la derecha. Nada se mueve de lugar: eliges un servicio y aparece su explicación
const svTab = (s, i) => `<button type="button" class="sv__t${i === 0 ? " is-on" : ""}" role="tab" id="sv-t${i}" aria-controls="sv-p${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"><b>${s.short}</b><span>${s.label}</span></button>`;
const svPanel = (s, i) => `<article class="sv__p${i === 0 ? " is-on" : ""}" role="tabpanel" id="sv-p${i}" aria-labelledby="sv-t${i}">
          <figure class="sv__m"><img src="${s.img}" alt="" loading="lazy"></figure>
          <div class="sv__x">
            <h3>${s.t}</h3>
            <p class="sv__d">${s.d}</p>
            <ul class="sv__i">${s.incluye.slice(0, 4).map((x) => `<li><i>${CHECK}</i>${x}</li>`).join("")}</ul>
            <a class="btn btn--light btn--sm" href="servicios.html#${s.id}"><span>Ver ${s.short.toLowerCase()}</span><i class="dot"></i></a>
          </div>
        </article>`;
const SERVICES_PANEL = `<section class="pad svh" id="servicios">
  <div class="svh__pin">
    <div class="panel svh__panel">
      <div class="svh__head">
        <div><p class="eyb"><i></i>Servicios</p><h2 class="h1 rv">Todo lo que tu marca necesita, en un solo equipo.</h2></div>
        <div class="svh__meta"><span class="svh__now" aria-hidden="true">${SERVICES[0].t}</span><div class="svh__bar" aria-hidden="true"><i></i></div></div>
      </div>
      <div class="svh__view">
        <ul class="svh__track">
          ${SERVICES.map((s) => `<li class="svh__s">
            <figure class="svh__m"><img src="${s.img}" alt="" loading="lazy"></figure>
            <div class="svh__x">
              <h3>${s.t}</h3>
              <p>${s.pitch}</p>
              <ul class="svh__tags">${s.tags.slice(0, 4).map((x) => `<li>${x}</li>`).join("")}</ul>
              <div class="svh__act"><a class="btn btn--light btn--sm" href="contacto.html?servicio=${encodeURIComponent(s.t)}#form"><span>Cotizar ${s.short.toLowerCase()}</span><i class="dot"></i></a><a class="svh__more" href="servicios.html#${s.id}"><span>Qué incluye</span>${AR}</a></div>
            </div>
          </li>`).join("\n          ")}
          <li class="svh__end">
            <p class="eyb"><i></i>Todo junto</p>
            <h3>¿Necesitas más de uno?</h3>
            <p>Arma el equipo completo para tu proyecto: una sola conversación, una sola propuesta.</p>
            <ul class="svh__all">${SERVICES.map((s) => `<li>${s.short}</li>`).join("")}</ul>
            <div class="svh__act"><a class="btn btn--light" href="contacto.html"><span>Cotiza tu proyecto</span><i class="dot"></i></a><a class="svh__more" href="servicios.html"><span>Ver todos los servicios</span>${AR}</a></div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</section>`;

// PROCESO: el texto se queda y las escenas pasan, con profundidad
const proc = [
  ["Escuchamos", "Una conversación para entender tu negocio, a tu público y lo que quieres lograr."],
  ["Conectamos", "Ordenamos la información y definimos la idea central que guía todo el trabajo."],
  ["Damos forma", "Diseñamos, producimos y desarrollamos. Ves avances en cada etapa y ajustamos contigo."],
  ["Lanzamos", "Publicamos, medimos lo que funciona y te entregamos todo listo para usar."],
];
const TICKS = `<svg class="wa__tick" viewBox="0 0 18 11" aria-hidden="true"><path d="M1 6l3.2 3.2L10.5 1.5M7 9.2l.8.8L16 1.5"/></svg>`;
const chat = [["a", "Hola, cuéntanos: ¿qué quieres lograr este año?", "10:02"], ["b", "Que nos reconozcan y nos escriban más clientes.", "10:04"], ["a", "Perfecto. ¿Y cómo quieres que se sienta tu marca?", "10:04"], ["b", "Cercana, pero profesional.", "10:06"]];
const CHAT = `<div class="wa" aria-hidden="true">
          <div class="wa__bar"><span class="wa__av">${ISO}</span><span class="wa__who"><b>AMUREK</b><em>en línea</em></span></div>
          <div class="wa__body">
            <p class="wa__day">Hoy</p>
            ${chat.map(([w, t, h], i) => `<p class="wa__m wa__m--${w}" style="--i:${i}">${t}<span class="wa__meta">${h}${w === "b" ? TICKS : ""}</span></p>`).join("")}
            <p class="wa__typing" style="--i:4"><i></i><i></i><i></i></p>
          </div>
          <div class="wa__in"><span>Escribe un mensaje</span><i></i></div>
        </div>`;
const BRIEF = `<div class="brief" aria-hidden="true">
          <div class="brief__sheet">
            <p class="brief__h"><b>Brief de marca</b><span>Borrador</span></p>
            <ul class="brief__rows">
              <li style="--i:0"><span>Objetivo</span><b>Que te reconozcan y te escriban</b></li>
              <li style="--i:1"><span>Público</span><b>Familias que compran en línea</b></li>
              <li style="--i:2"><span>Tono</span><b>Cercano y profesional</b></li>
              <li style="--i:3"><span>Canales</span><b>Instagram, video y web</b></li>
            </ul>
            <div class="brief__idea" style="--i:4"><span>Idea central</span><b>Cercanía con criterio.</b></div>
          </div>
          <p class="brief__lead">De aquí salen todas las piezas</p>
          <ul class="brief__out"><li style="--i:5">Marca</li><li style="--i:6">Contenido</li><li style="--i:7">Web</li></ul>
        </div>`;
// Escenas 3 y 4 del proceso: fotografías y video reales (de referencia), sin maquetas dibujadas
const mosTile = (cls, media, t, d, extra = "") => `<figure class="mos__${cls}">${media}<figcaption><b>${t}</b><span>${d}</span></figcaption>${extra}</figure>`;
const mosVid = (v, poster) => `<video muted loop playsinline preload="none" data-autoplay poster="${poster}">${vsrc(v)}</video>`;
const mosImg = (src) => `<img src="${src}" alt="" loading="lazy">`;
const MOS3 = `<div class="mos" aria-hidden="true">
          ${mosTile("a", mosImg(R + "s20.webp"), "Diseñamos", "Identidad y piezas de marca")}
          ${mosTile("b", mosVid(R + "trailer-a.mp4#t=3", R + "trailer-a.webp"), "Producimos", "Video y fotografía")}
          ${mosTile("c", mosImg(R + "n-laptop.webp"), "Desarrollamos", "Sitios y herramientas")}
        </div>`;
const MOS4 = `<div class="mos mos--l" aria-hidden="true">
          ${mosTile("a", mosImg(R + "n-poster.webp"), "Campaña publicada", "Piezas en circulación")}
          ${mosTile("b", mosVid(R + "reel-1.mp4", R + "reel-1.webp"), "Contenido en línea", "Reels y publicaciones", '<span class="mos__live"><i></i>En línea</span>')}
          ${mosTile("c", mosImg(R + "n-monitor.webp"), "Resultados", "Medimos y ajustamos")}
        </div>`;
const procScenes = [CHAT, BRIEF, MOS3, MOS4];
const procCls = ["pcard--dark pcard--chat", "pcard--cream pcard--brief", "pcard--dark pcard--mos", "pcard--cream pcard--mos pcard--mosl"];
const PROCESS_OLD = `<section class="proc" id="proceso" style="--n:${proc.length}">
  <div class="proc__track">
    <div class="proc__sticky">
      <div class="proc2" data-step="0">
        <div class="proc2__bg" aria-hidden="true"><i></i><i></i><i></i></div>
        <div class="proc2__l">
          <h2 class="sr">De la idea al lanzamiento.</h2>
          <ol class="sr">${proc.map(([t, d]) => `<li>${t}. ${d}</li>`).join("")}</ol>
          <div class="proc2__words" aria-hidden="true">${proc.map(([t], i) => `<span class="proc2__w${i === 0 ? " is-on" : ""}">${[...t].map((c, k) => `<i style="--k:${k}">${c === " " ? "&nbsp;" : c}</i>`).join("")}</span>`).join("")}</div>
          <div class="proc2__descs" aria-hidden="true">${proc.map(([, d], i) => `<p class="proc2__d${i === 0 ? " is-on" : ""}">${d}</p>`).join("")}</div>
          <div class="proc2__tl" aria-hidden="true"><i class="proc2__line"><b></b></i><ol>${proc.map(([t], i) => `<li${i === 0 ? ' class="is-on"' : ""}><span>${t}</span></li>`).join("")}</ol></div>
        </div>
        <div class="proc2__r">
          ${proc.map(([t, d], i) => `<article class="pcard ${procCls[i]}" data-step="${i}"><div class="pcard__txt"><b>${t}</b><span>${d}</span></div>${procScenes[i]}</article>`).join("\n          ")}
        </div>
      </div>
    </div>
  </div>
</section>`;

// PROCESO (inicio): acordeón de cuatro etapas. Una sola abierta a la vez; al abrirla, su escena vuelve a reproducirse. Sin marcos ni paneles apilados
const noAuto = (s) => s.replaceAll(" data-autoplay", "");
const prosTile = ([t, d], i) => {
  const go = i < proc.length - 1
    ? `<button class="btn btn--light btn--sm pros__go" type="button" data-go="${i + 1}"><span>Sigue: ${proc[i + 1][0]}</span><i class="dot"></i></button>`
    : `<a class="btn btn--light btn--sm pros__go" href="contacto.html"><span>Cotiza tu proyecto</span><i class="dot"></i></a>`;
  return `<article class="pros__t${i === 0 ? " is-on" : ""}" data-step="${i}" style="--k:${i}">
      <button class="pros__h" type="button" id="pros-h${i}" aria-expanded="${i === 0}" aria-controls="pros-b${i}"${i === 0 ? ' aria-disabled="true"' : ""}><span class="pros__v">${t}</span><i class="pros__plus" aria-hidden="true"></i></button>
      <div class="pros__b" id="pros-b${i}" role="region" aria-labelledby="pros-h${i}">
        <div class="pros__in">
          <div class="pros__txt"><h3>${t}</h3><p>${d}</p>${go}</div>
          <div class="pros__sc">${noAuto(procScenes[i])}</div>
        </div>
      </div>
    </article>`;
};
const PROCESS = `<section class="sec pst" id="proceso">
  <div class="wrap rhead">
    <h2 class="h2 rv">De la idea al lanzamiento.</h2>
    <p>Cuatro etapas, un mismo equipo: de la primera conversación al lanzamiento.</p>
  </div>
  <div class="wrap pst__grid">
    <div class="pst__side">
      <ol class="pst__nav">${proc.map(([t], i) => `<li><button type="button" data-k="${i}"${i === 0 ? ' class="is-on"' : ""}><b>${t}</b><em class="pst__d">${proc[i][1]}</em></button></li>`).join("")}</ol>
      <div class="pst__bar" aria-hidden="true"><i></i></div>
      <a class="btn btn--dark" href="contacto.html"><span>Cotiza tu proyecto</span><i class="dot"></i></a>
    </div>
    <div class="pst__steps">
      ${proc.map(([t, d], i) => `<article class="pst__s" data-k="${i}">
        <div class="pst__txt"><h3>${t}</h3><p>${d}</p></div>
        <div class="pst__sc">${procScenes[i]}</div>
      </article>`).join("\n      ")}
    </div>
  </div>
</section>`;

// SHOWREEL: el video crece con el scroll
const SHOWREEL = `<section class="reel" id="showreel">
  <div class="reel__sticky">
    <h2 class="reel__lead">Ideas en movimiento.</h2>
    <div class="reel__row">
      <span class="reel__w reel__w--l">©2026</span>
      <button class="reel__box" type="button" data-reel="${R}showreel.mp4" aria-label="Reproducir showreel con sonido">
        <video muted loop playsinline preload="none" data-autoplay poster="${R}showreel.webp" aria-hidden="true">${vsrc(R + "showreel.mp4")}</video>
        <span class="reel__play"><span>Ver showreel</span><i>${PLAY}</i></span>
      </button>
      <span class="reel__w reel__w--r">Showreel</span>
    </div>
  </div>
</section>`;

// REELS: solo los principales, todos del mismo tamaño (referencias; reemplazar por los mejores reels reales)
const REEL_ITEMS = [
  { v: R + "reel-1.mp4", img: R + "reel-1.webp", t: "Teaser de producto", k: "Reel · referencia" },
  { v: R + "reel-2.mp4", img: R + "reel-2.webp", t: "Historia en vertical", k: "Reel · referencia" },
  { v: R + "reel-3.mp4", img: R + "reel-3.webp", t: "Corte para redes", k: "Reel · referencia" },
  { img: R + "n-foot.webp", t: "Lookbook de producto", k: "Foto · referencia" },
];
const REELS = `<section class="sec" id="reels">
  <div class="wrap rhead">
    <h2 class="h2 rv">Reels que detienen el scroll.</h2>
    <p>Pensados para el teléfono desde el guion: ritmo, texto en pantalla y marca desde el primer segundo.</p>
  </div>
  <div class="wrap">
    <ul class="reels reels4">
      ${REEL_ITEMS.map((r) => `<li class="rcard"${r.v ? ` data-reel="${r.v}" tabindex="0" role="button" aria-label="Reproducir ${r.t} con sonido"` : ` data-lightbox="${r.img}" data-alt="${r.t}"`}>
        ${r.v ? `<video muted loop playsinline preload="none"  poster="${r.img}" aria-hidden="true">${vsrc(r.v)}</video>` : `<img src="${r.img}" alt="" loading="lazy">`}
        <span class="rcard__top">${AVATAR}<b>amurek</b>${r.v ? `<i class="rcard__play">${PLAY}</i>` : ""}</span>
        <span class="rcard__cap"><span>${r.k}</span><b>${r.t}</b></span>
      </li>`).join("\n      ")}
    </ul>
    <div class="rdots" aria-hidden="true">${REEL_ITEMS.map((_, i) => `<i${i === 0 ? ' class="is-on"' : ""}></i>`).join("")}</div>
  </div>
</section>`;

// TESTIMONIOS — TEXTOS DE REFERENCIA: reemplazar por opiniones reales de clientes antes de publicar
const TQ = [
  ["Trabajar con AMUREK fue menos como contratar una agencia y más como ganar un socio estratégico.", "woman-2", "Nombre Apellido", "Fundadora · Marca"],
  ["Rápidos, atentos y muy colaborativos. Se sintió como parte de nuestro equipo desde el primer día.", "man-3", "Nombre Apellido", "Directora creativa · Empresa"],
  ["Su trabajo es sobrio en la forma pero rico en intención. Nos ayudaron a expresar nuestra marca con claridad.", "woman-4", "Nombre Apellido", "Jefa de marca · Empresa"],
  ["Entendieron lo que queríamos decir antes de que supiéramos explicarlo. El resultado se ve y se siente nuestro.", "man-2", "Nombre Apellido", "Gerente · Negocio"],
  ["Pasamos de publicar sin rumbo a tener una línea gráfica y un calendario que podemos sostener.", "woman-3", "Nombre Apellido", "Emprendedora · Marca"],
  ["Cada entrega llegó clara, a tiempo y con las razones detrás de cada decisión.", "man-1", "Nombre Apellido", "Director · Empresa"],
];
const tcard2 = ([q, av, n, r]) => `<li class="tcard2" data-spot><blockquote>«${q}»</blockquote><figcaption><img src="${ref(av)}" alt=""><span><b>${n}</b>${r}</span></figcaption></li>`;
// CIFRAS DE REFERENCIA: reemplazar por los números reales de la agencia antes de publicar
const STATS = [["+", 120, "", "Proyectos entregados"], ["+", 45, "", "Marcas acompañadas"], ["", 92, "%", "Clientes que repiten"], ["+", 300, "", "Piezas de contenido al mes"]];
const tq5Card = ([q, av, n, r]) => `<li class="tq5__c"><blockquote>«${q}»</blockquote><figcaption><img src="${ref(av)}" alt=""><span><b>${n}</b>${r}</span></figcaption></li>`;
const PORT = [[R + "t-retrato.webp", "50% 14%"], [R + "c-2.webp", "50% 22%"], [R + "c-4.webp", "50% 22%"], [R + "c-1.webp", "50% 22%"], [R + "c-5.webp", "50% 22%"], [R + "c-3.webp", "50% 22%"]];
const tsmCard = ([q, , n, r]) => `<li class="tsm__c"><blockquote>${q}</blockquote><p class="tsm__by"><b>${n}</b><span>${r}</span></p></li>`;
const TESTI = `<section class="pad tsm" id="testimonios" data-placeholder="testimonios y cifras de referencia">
  <div class="panel tsm__panel">
    <div class="rhead tsm__head"><h2 class="h2 rv">Lo que dicen nuestros clientes.</h2><p>Opiniones y cifras de referencia. Aquí irán las de tus clientes reales.</p></div>
    <div class="tsm__view" role="region" aria-label="Testimonios">
      <div class="tsm__track"><ul class="tsm__set">${TQ.map(tsmCard).join("")}</ul><ul class="tsm__set" aria-hidden="true">${TQ.map(tsmCard).join("")}</ul></div>
    </div>
    <ul class="tsm__stats" aria-label="Cifras de referencia">${STATS.map(([pre, n, suf, l]) => `<li><b>${pre}<span data-count="${n}">${n}</span>${suf}</b><p>${l}</p></li>`).join("")}</ul>
  </div>
</section>`;

// EQUIPO: las cuatro personas a la vez, con el mismo tamaño, en zigzag y con un leve vaivén; al pasar el puntero (o tocar) se endereza y cuenta qué hace
const phName = (m) => m.n === "Nombre Apellido";
const TEAMW = (h, p, more) => `<section class="pad" id="equipo" data-placeholder="equipo: salvo Richard Castro, personas de referencia">
  <div class="panel tk" id="tk">
    <div class="tk__head"><h2 class="h1 rv">${h}</h2><p>${p}</p></div>
    <ul class="tk__grid">
      ${TEAM.map((m, i) => `<li class="tk__c" style="--i:${i}" tabindex="0">
        <figure><img src="${m.img}" alt="${phName(m) ? "" : "Retrato de " + m.n}" loading="lazy" style="object-position:${m.pos}"><figcaption><p>${m.b}</p></figcaption></figure>
        <div class="tk__n"><b>${m.n}</b><span>${m.r}</span></div>
      </li>`).join("\n      ")}
    </ul>
    ${more ? `<div class="tk__more"><a class="btn btn--dark" href="nosotros.html"><span>Conoce al equipo</span><i class="dot"></i></a></div>` : ""}
  </div>
</section>`;
const TEAM_HOME = TEAMW("Un equipo pequeño que trabaja contigo.", "Las decisiones de AMUREK se toman entre cuatro personas, con el mismo peso y una sola visión.", true);

// NOSOTROS (estilo estudio): título con letras que cambian de tipografía, tarjeta de vidrio, equipo que se transforma al hacer scroll
const wordLetters = (w, base = 0) => w.split("").map((c, i) => `<i style="--i:${base + i}">${c}</i>`).join("");
const STUDIO_HEAD = `<section class="studio wrap" id="top">
  <h1 class="sr">Nosotros: el estudio de AMUREK, agencia creativa en Ecuador.</h1>
  <div class="studio__row" aria-hidden="true"><span class="studio__w">Nuestro</span><figure class="studio__img"><img src="${R}n-studio.webp" alt=""></figure><span class="studio__w">Estudio</span></div>
  <div class="studio__meta"><span>Agencia creativa</span><span>Ecuador</span><span>Cinco servicios, un equipo</span></div>
</section>`;
const ABOUT_GLASS = `<section class="pad aboutg">
  <div class="panel aboutg__panel">
    <i class="aboutg__grad" aria-hidden="true"></i>
    <div class="aboutg__card">
      <p class="aboutg__k">Quiénes somos</p>
      <p class="aboutg__t">AMUREK nació para que las marcas no tengan que coordinar a cinco proveedores distintos. Pensamos tu marca una sola vez y la hacemos viva en todas partes: en el logotipo, en el video, en las redes, en las campañas y en la web. Somos un equipo pequeño a propósito: hablas con quien piensa y hace tu proyecto.</p>
    </div>
  </div>
</section>`;
const tmCard = (m) => `<figure class="tm__c"><img src="${m.img}" alt="${m.n === "Nombre Apellido" ? "" : "Retrato de " + m.n}" loading="lazy" style="object-position:${m.pos}"><figcaption><b>${m.n}</b><span>${m.r}</span></figcaption></figure>`;
const TEAMPIN = (more) => `<section class="tm" id="equipo" data-placeholder="equipo: salvo Richard Castro, personas de referencia">
  <div class="tm__sticky">
    <div class="tm__a"><p class="tm__k">El equipo</p><h2 class="h1 tm__h">Un equipo<br>de expertos</h2></div>
    <div class="tm__b">
      <div class="tm__txt"><h3 class="tm__name">Cuatro personas, una sola visión.</h3><div class="tm__side"><p class="tm__bio">Quienes dirigen AMUREK lo hacen en conjunto: cada decisión se toma entre las cuatro, con el mismo peso.</p>${more ? `<a class="btn btn--dark" href="nosotros.html"><span>Conoce al equipo</span><i class="dot"></i></a>` : ""}</div></div>
      <div class="tm__row">${TEAM.map(tmCard).join("")}</div>
    </div>
  </div>
</section>`;
const TEAM_PIN = TEAMPIN(false), TEAM_PIN_HOME = TEAMPIN(true);
const MEMBERS = "";
const APPROACH = `<section class="sec" id="enfoque">
  <div class="wrap appr">
    <div class="rhead appr__head"><h2 class="h2 rv">Así trabajamos.</h2><p>Cuatro etapas, un mismo equipo: de la primera conversación al lanzamiento.</p></div>
    <figure class="appr__vid"><video muted loop playsinline preload="none" data-autoplay poster="assets/identidad-poster.jpg" aria-hidden="true">${vsrc("assets/amurek-identidad.mp4")}</video></figure>
    <ol class="appr__steps">
      ${proc.map(([t, d], i) => `<li><b>${t}</b><p>${d}</p></li>`).join("\n      ")}
    </ol>
  </div>
</section>`;

const BRAND_BAND = `<section class="pad brandband" aria-label="La animación de nuestro logotipo">
  <div class="panel brandband__panel">
    <video muted loop playsinline preload="none" data-autoplay poster="assets/identidad-poster.jpg" aria-hidden="true">${vsrc("assets/amurek-identidad.mp4")}</video>
  </div>
</section>`;

// PLANES (estilo Alture): título gigante con dos tarjetas de vidrio encima; en lugar del precio, una frase grande que explica cómo se trabaja
const pzItem = ([b, r]) => `<li><i>${CHECK}</i><p><b>${b}</b>${r}</p></li>`;
const PL = [
  { t: "Por proyecto", big: "Un proyecto", unit: "de inicio a fin", sep: "Ideal para algo puntual", inc: [["Una marca, un video, una campaña o una web", " con objetivo claro"], ["Alcance y fechas", " definidos desde el inicio"], ["Entregas por etapas", ", ajustadas contigo"], ["Todo listo para usar", " al terminar"]] },
  { t: "Mensual", big: "Cada mes", unit: "con tu equipo", sep: "Ideal para presencia constante", inc: [["Contenido y diseño", " todos los meses"], ["Campañas", " con medición"], ["Reunión mensual", " de estrategia"], ["Reporte", " claro de lo que funcionó"]] },
];
const PLANS = `<section class="pad" id="planes">
  <div class="panel plans6">
    <i class="plans6__glow" aria-hidden="true"></i>
    <p class="plans6__k"><i></i>Elige cómo trabajamos</p>
    <h2 class="plans6__h">Planes</h2>
    <ul class="plans6__grid">
      ${PL.map((p) => `<li class="pl6" data-spot>
        <p class="pl6__n">${p.t}</p>
        <p class="pl6__v"><span>${p.big}</span><em>/${p.unit}</em></p>
        <ul class="pl6__f">${p.inc.map(pzItem).join("")}</ul>
        <p class="pl6__sep"><i></i><span>${p.sep}</span><i></i></p>
        <a class="btn btn--light" href="contacto.html?reunion=${encodeURIComponent(p.t)}#form"><span>Quiero este plan</span><i class="dot"></i></a>
      </li>`).join("\n      ")}
    </ul>
    <div class="plans6__meet">
      <div><h3>¿No sabes cuál elegir?</h3><p>Agenda una reunión y conversamos sobre tu proyecto. Si buscas algo más grande o para todo el año, lo armamos contigo.</p></div>
      <div class="plans6__act"><a class="btn btn--light" href="contacto.html?reunion=1#form"><span>Agendar una reunión</span><i class="dot"></i></a><a class="btn btn--glass" href="#" data-wa data-wa-row hidden><span>WhatsApp</span></a></div>
    </div>
  </div>
</section>`;

// PREGUNTAS
const FAQ = `<section class="sec" id="faq">
  <div class="wrap faq3">
    <div class="faq3__side">
      <h2 class="h1 rv">Preguntas respondidas.</h2>
      <p class="faq3__sub">Todo lo que quieres saber antes de empezar.</p>
      <div class="faq3__card">
        <span class="faq3__iso" aria-hidden="true">${ISO}</span>
        <p><b>¿Tienes otra pregunta?</b><span>Habla directamente con el equipo creativo de AMUREK.</span></p>
        <a class="btn btn--dark btn--sm" href="contacto.html"><span>Escríbenos</span><i class="dot"></i></a>
      </div>
    </div>
    <div class="faq3__list">
      ${FAQS.map(([q, a], i) => `<details class="qa3" data-spot${i === 0 ? " open" : ""}><summary>${q}<i>${PLUS}</i></summary><p>${a}</p></details>`).join("\n      ")}
    </div>
  </div>
</section>`;

// ENCABEZADO DE PÁGINAS INTERNAS
const PHERO = ({ a, b = "", p, k = "" }) => `<section class="phero wrap" id="top">
  <div class="phero__row"><h1 class="giant">${a}${b ? " " + b : ""}</h1></div>
  <div class="phero__sub">${k ? `<p class="phero__k"><i></i>${k}</p>` : ""}<p class="h3">${p}</p></div>
</section>`;
// índice de servicios: mismas pastillas que los filtros de Proyectos
const SVC_INDEX = SERVICES.map((s) => `<a href="#${s.id}">${s.short}</a>`).join("");

// SERVICIOS — detalle
const SVC_DETAIL = SERVICES.map((s) => `<article class="sdet" id="${s.id}">
      <div class="sdet__card">
        <h2 class="h2">${s.t}</h2>
        <p class="sdet__pitch">${s.pitch}</p>
        <div class="sdet__cols">
          <div><p class="sdet__h">Qué incluye</p><ul>${s.incluye.map((x) => `<li><i>${CHECK}</i>${x}</li>`).join("")}</ul></div>
          <div><p class="sdet__h">Qué recibes</p><ul>${s.entregables.map((x) => `<li><i>${CHECK}</i>${x}</li>`).join("")}</ul></div>
        </div>
        <div class="sdet__foot"><p><span>Ideal para</span>${s.ideal}</p><a class="btn btn--dark" href="contacto.html?servicio=${encodeURIComponent(s.t)}"><span>Cotizar ${s.short.toLowerCase()}</span><i class="dot"></i></a></div>
      </div>
      <figure class="sdet__img">${s.video ? `<video muted loop playsinline preload="none" data-autoplay poster="${s.img}" aria-hidden="true">${vsrc(s.video)}</video>` : `<img src="${s.img}" alt="" loading="lazy">`}<ul class="tags tags--glass">${s.tags.map((t) => `<li>${t}</li>`).join("")}</ul></figure>
    </article>`).join("\n    ");

// PROYECTOS — rejilla con filtros (cada tarjeta abre el visor)
const gcard = (p) => `<button type="button" class="gcard" data-cats="${p.s}" data-project="${esc(pdata(p))}" aria-label="Abrir proyecto ${p.t}">
        <span class="gcard__media" data-tilt>${pmedia(p)}<span class="pill pill--glass"><span>${cue(p)}</span></span></span>
        <span class="gcard__cap"><b>${p.t}</b><span>${p.sub}</span><span class="gcard__m">${S[p.s].short}</span></span>
      </button>`;
const GRID = PROJECTS.map(gcard).join("\n      ");
const FILTER_BTNS = [["todo", "Todo"], ...SERVICES.map((s) => [s.id, s.short])].map(([k, t], i) => `<button type="button" data-filter="${k}" aria-pressed="${i === 0}">${t}</button>`).join("");

/* ============================================================
   COMPILAR PÁGINAS
   ============================================================ */
const blocks = {
  HERO, STATEMENT, WORK, SERVICES_PANEL, PROCESS, PROCESS_OLD, SHOWREEL, REELS, TESTI, TEAM_HOME, STUDIO_HEAD, ABOUT_GLASS, TEAM_PIN, TEAM_PIN_HOME, MEMBERS, APPROACH, BRAND_BAND, PLANS, FAQ, CTA, FORM,
  SVC_DETAIL, SVC_INDEX, GRID, FILTER_BTNS, CHECK, AR, AR_UR, PLAY, AVATAR, WORDMARK, ISO,
  PHERO_SERVICIOS: PHERO({ a: "Servicios", k: "Un solo equipo", p: "Cinco servicios que trabajan juntos. Contrata uno solo o arma el equipo completo para tu proyecto." }),
  PHERO_PROYECTOS: PHERO({ a: "Proyectos", b: "seleccionados", k: "Trabajo reciente", p: "Cada proyecto empieza como una idea suelta. Aquí está lo que pasa cuando encuentra su forma." }),
  PHERO_CONTACTO: PHERO({ a: "Contacto", p: "¿Tienes una idea? Cuéntanos qué quieres lograr y te respondemos con una propuesta clara." }),
};
const srcDir = path.join(here, "src");
const built = [];
for (const old of ["blog.html", "caso-amurek.html"]) fs.rmSync(path.join(here, old), { force: true });
for (const f of fs.readdirSync(here).filter((f) => /^blog-.+\.html$/.test(f))) fs.rmSync(path.join(here, f));
for (const file of fs.readdirSync(srcDir).filter((f) => f.endsWith(".html"))) {
  let src = fs.readFileSync(path.join(srcDir, file), "utf8");
  const m = JSON.parse(src.match(/<!--meta\s*([\s\S]*?)-->/)[1]);
  m.file = file; if (!m.noindex) built.push(m);
  src = src.replace(/<!--meta[\s\S]*?-->\s*/, "");
  for (let pass = 0; pass < 2; pass++) for (const [k, v] of Object.entries(blocks)) src = src.split(`{{${k}}}`).join(v);
  const html = (HEAD(m) + NAV(m.page) + src + FOOT).replace(/<img /g, '<img decoding="async" ');
  fs.writeFileSync(path.join(here, file), html);
  console.log(file, html.length, "bytes");
}

/* ---------- v49: mapa del sitio y robots (para buscadores) ---------- */
const today = new Date().toISOString().slice(0, 10);
const prio = (m) => (m.file === "index.html" ? "1.0" : m.page === "legal" ? "0.3" : "0.8");
fs.writeFileSync(path.join(here, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${built.sort((a, z) => prio(z) - prio(a)).map((m) => `  <url><loc>${pageUrl(m)}</loc><lastmod>${today}</lastmod><priority>${prio(m)}</priority></url>`).join("\n")}
</urlset>
`);
fs.writeFileSync(path.join(here, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log("sitemap.xml", built.length, "páginas · robots.txt");
