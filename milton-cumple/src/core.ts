// Núcleo puro (sin React): easing, línea de tiempo y matemática de la ruleta.
// Lo usan tanto el video (Remotion) como tools/events.ts, que genera los
// eventos de sonido sincronizados con la animación.

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const DURATION_S = 105;
export const DURATION = DURATION_S * FPS;

// ───────────────────────── utilidades ─────────────────────────
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const prog = (t: number, a: number, b: number) => clamp((t - a) / (b - a));

/** cubic-bezier estilo CSS / After Effects (influencias de velocidad). */
export function bezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sx = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sy = (t: number) => ((ay * t + by) * t + cy) * t;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let lo = 0;
    let hi = 1;
    let t = x;
    for (let i = 0; i < 28; i++) {
      const v = sx(t);
      if (Math.abs(v - x) < 1e-6) break;
      if (v < x) lo = t;
      else hi = t;
      t = (lo + hi) / 2;
    }
    return sy(t);
  };
}

export const eOut = bezier(0.16, 1, 0.3, 1); // desaceleración larga (expo)
export const eOutSoft = bezier(0.22, 1, 0.36, 1);
export const eInOut = bezier(0.65, 0, 0.35, 1);
export const eIn = bezier(0.7, 0, 0.84, 0);
export const eBack = bezier(0.34, 1.45, 0.64, 1); // pequeño rebote

/** Pseudo-aleatorio determinista (mulberry32) */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ───────────────────────── identidad ─────────────────────────
export const C = {
  paper: '#EDE6D9',
  ink: '#2B2A27',
  inkSoft: '#5A564E',
  chalk: '#F2EEE5',
  chalkSoft: '#B9B4A9',
  charcoal: '#25282C',
  terracotta: '#B5593A', // acento sobre papel
  terraLight: '#E8946A', // acento sobre pizarra
  mustard: '#D2A24C',
  sage: '#8F9F8A',
  dusty: '#7C90A4',
  white: '#FCFBF7',
};
export type BgKind = 'paper' | 'chalk';

// ───────────────────────── tempo musical ─────────────────────────
export const BPM = 100;
export const BEAT = 60 / BPM; // 0,6 s
export const BAR = BEAT * 4; // 2,4 s

// ───────────────────────── escenas ─────────────────────────
export const T = {
  rouletteEnd: 7.2, // compás 3
  carouselStart: 7.2,
  selectStart: 14.4, // compás 6
  greetStart: 16.8, // compás 7: «Feliz cumpleaños»
  nameHit: 19.2, // compás 8: «¡MILTON!»
  s4Start: 21.6, // compás 9
  s4End: 91.2, // compás 38
  closingStart: 91.2,
};

// ───────────────────────── ruleta ─────────────────────────
export const MONTHS = [
  'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
  'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE',
];
export const OCTOBER = 9;
export const ROULETTE = {
  spinStart: 0.8,
  spinEnd: 6.1,
  // 33 meses de recorrido: Enero → … → Octubre (270° + 2 vueltas)
  total: 270 + 720,
};
const rouletteEase = bezier(0.5, 0, 0.1, 1);
/** Ángulo del tambor (grados) en el segundo t. */
export const rouletteAngle = (t: number) =>
  ROULETTE.total * rouletteEase(prog(t, ROULETTE.spinStart, ROULETTE.spinEnd));
/** Instantes en que cada mes cruza la marca (clic de la ruleta). */
export function rouletteTicks(): number[] {
  const out: number[] = [];
  const steps = ROULETTE.total / 30;
  for (let k = 1; k <= steps; k++) {
    const target = Math.min(k * 30, ROULETTE.total - 1.0); // el último «clic» cae cuando el tambor ya encaja
    let lo = ROULETTE.spinStart;
    let hi = ROULETTE.spinEnd;
    for (let i = 0; i < 40; i++) {
      const mid = (lo + hi) / 2;
      if (rouletteAngle(mid) < target) lo = mid;
      else hi = mid;
    }
    out.push((lo + hi) / 2);
  }
  return out;
}

// ───────────────────────── recorrido de fotos ─────────────────────────
export const HERO = 4; // foto elegida para «¡Feliz cumpleaños, Milton!»

export type Enter = 'rise' | 'drop' | 'slideL' | 'slideR' | 'pop' | 'rotL' | 'rotR';
export type Exit = 'swipeL' | 'swipeR' | 'swipeUp' | 'swipeDown' | 'lift';

export type Item = {
  idx: number;
  /** centro y tamaño (alto o ancho) en px del cuadro 1920×1080 */
  cx: number;
  cy: number;
  h?: number;
  w?: number;
  rot?: number;
  enter: Enter;
  exit: Exit;
  delay?: number; // s
  /** intercambio de posición a mitad del plano */
  swapTo?: { cx: number; cy: number; rot?: number };
  drift?: [number, number]; // px/s
  zoom?: number; // ken burns total
};

export type Shot = {
  id: string;
  kind: 'phrase' | 'photos';
  dur: number;
  chapter?: string;
  ghost?: string; // palabra fantasma
  ghostSide?: 'L' | 'R';
  items?: Item[];
  phrase?: { lines: { w: string; em?: boolean }[][] };
  ghostPhotos?: number[];
  flare?: boolean; // (sonido) brillo en la entrada
  bg?: BgKind;
  doodle?: 'balloons' | 'gift' | 'cake';
  doodleSide?: 'L' | 'R';
};

export const TR = 0.36; // semiduración de transición (s)

export const SHOTS: Shot[] = [
  // ── Recuerdos ──
  {
    id: 'p1', bg: 'chalk', kind: 'phrase', dur: 3.4, ghostPhotos: [0, 8],
    phrase: { lines: [[{ w: 'Hay' }, { w: 'momentos' }, { w: 'que' }], [{ w: 'se' }, { w: 'convierten' }, { w: 'en' }], [{ w: 'recuerdos', em: true }, { w: 'inolvidables.', em: true }]] },
  },
  {
    id: 'a1', bg: 'paper', kind: 'photos', dur: 3.8, flare: true,
    items: [
      { idx: 0, cx: 590, cy: 545, h: 860, enter: 'rise', exit: 'swipeUp', swapTo: { cx: 1300, cy: 520, rot: 1.2 }, rot: -1.2 },
      { idx: 2, cx: 1310, cy: 520, h: 700, enter: 'drop', exit: 'swipeDown', delay: 0.18, swapTo: { cx: 560, cy: 545, rot: -1 }, rot: 1.2 },
    ],
  },
  { id: 'a2', bg: 'paper', kind: 'photos', dur: 2.4, items: [{ idx: 8, cx: 960, cy: 540, h: 830, enter: 'pop', exit: 'lift', zoom: 0.07 }] },
  { id: 'a3', bg: 'paper', kind: 'photos', dur: 2.4, chapter: 'recuerdos', ghostSide: 'L', doodle: 'balloons', doodleSide: 'L', items: [{ idx: 1, cx: 1130, cy: 540, h: 900, enter: 'rotR', exit: 'swipeR', rot: -1.5, drift: [6, 0] }] },
  // ── Familia ──
  { id: 'b1', bg: 'paper', kind: 'photos', dur: 2.6, chapter: 'familia', ghostSide: 'R', doodle: 'gift', doodleSide: 'R', flare: true, items: [{ idx: 5, cx: 790, cy: 540, h: 920, enter: 'rise', exit: 'swipeUp', zoom: 0.05 }] },
  { id: 'b2', bg: 'paper', kind: 'photos', dur: 2.4, items: [{ idx: 6, cx: 960, cy: 540, h: 900, enter: 'slideR', exit: 'swipeL', zoom: 0.05 }] },
  {
    id: 'b3', bg: 'paper', kind: 'photos', dur: 3.4,
    items: [
      { idx: 13, cx: 600, cy: 540, h: 760, enter: 'slideL', exit: 'swipeL', rot: -2, drift: [-8, 0] },
      { idx: 16, cx: 1340, cy: 540, h: 880, enter: 'slideR', exit: 'swipeR', rot: 1.5, delay: 0.14, drift: [8, 0] },
    ],
  },
  { id: 'b4', bg: 'paper', kind: 'photos', dur: 2.4, chapter: 'familia', ghostSide: 'L', doodle: 'cake', doodleSide: 'L', items: [{ idx: 29, cx: 1110, cy: 540, h: 900, enter: 'pop', exit: 'lift', zoom: 0.06 }] },
  {
    id: 'p2', bg: 'chalk', kind: 'phrase', dur: 3.2, ghostPhotos: [5, 13],
    phrase: { lines: [[{ w: 'Y' }, { w: 'personas' }, { w: 'que' }, { w: 'hacen' }], [{ w: 'especiales', em: true }, { w: 'esos' }, { w: 'momentos.' }]] },
  },
  // ── Aventuras ──
  {
    id: 'c1', bg: 'chalk', kind: 'photos', dur: 4.6, flare: true,
    items: [
      { idx: 3, cx: 385, cy: 560, h: 720, enter: 'rise', exit: 'swipeUp', rot: -2 },
      { idx: 7, cx: 975, cy: 500, w: 740, enter: 'pop', exit: 'lift', delay: 0.35, zoom: 0.05 },
      { idx: 9, cx: 1550, cy: 560, h: 720, enter: 'drop', exit: 'swipeDown', delay: 0.7, rot: 2 },
    ],
  },
  { id: 'c2', bg: 'chalk', kind: 'photos', dur: 2.4, chapter: 'aventuras', ghostSide: 'R', doodle: 'balloons', doodleSide: 'R', items: [{ idx: 15, cx: 840, cy: 540, h: 920, enter: 'rotL', exit: 'swipeR', zoom: 0.06 }] },
  {
    id: 'c3', bg: 'chalk', kind: 'photos', dur: 3.4,
    items: [
      { idx: 12, cx: 620, cy: 540, h: 840, enter: 'drop', exit: 'swipeDown', swapTo: { cx: 1300, cy: 540, rot: 1 }, rot: -1 },
      { idx: 30, cx: 1300, cy: 540, h: 840, enter: 'drop', exit: 'swipeDown', delay: 0.1, swapTo: { cx: 620, cy: 540, rot: -1 }, rot: 1 },
    ],
  },
  {
    id: 'p3', bg: 'chalk', kind: 'phrase', dur: 3.2, ghostPhotos: [30, 12],
    phrase: { lines: [[{ w: 'Que' }, { w: 'nunca' }, { w: 'falten' }, { w: 'razones' }], [{ w: 'para' }, { w: 'sonreír.', em: true }]] },
  },
  // ── Sonrisas ──
  {
    id: 'd1', bg: 'paper', kind: 'photos', dur: 4.4, flare: true,
    items: [
      { idx: 10, cx: 440, cy: 545, h: 800, enter: 'rise', exit: 'swipeUp', rot: -1.5 },
      { idx: 17, cx: 985, cy: 505, h: 800, enter: 'drop', exit: 'swipeDown', delay: 0.3, rot: 1 },
      { idx: 18, cx: 1510, cy: 550, h: 800, enter: 'rise', exit: 'swipeUp', delay: 0.6, rot: -1 },
    ],
  },
  {
    id: 'd2', bg: 'paper', kind: 'photos', dur: 3.4,
    items: [
      { idx: 25, cx: 610, cy: 540, h: 860, enter: 'rotR', exit: 'swipeR', rot: -2, drift: [-6, 0] },
      { idx: 27, cx: 1310, cy: 540, h: 860, enter: 'slideR', exit: 'swipeL', delay: 0.15, rot: 2, drift: [6, 0] },
    ],
  },
  { id: 'd3', bg: 'paper', kind: 'photos', dur: 2.4, chapter: 'sonrisas', ghostSide: 'L', doodle: 'gift', doodleSide: 'L', items: [{ idx: 24, cx: 1100, cy: 540, h: 920, enter: 'pop', exit: 'lift', zoom: 0.07 }] },
  {
    id: 'd4', bg: 'paper', kind: 'photos', dur: 3.4,
    items: [
      { idx: 19, cx: 620, cy: 540, h: 860, enter: 'rise', exit: 'swipeL', swapTo: { cx: 1300, cy: 540, rot: 1 }, rot: -1 },
      { idx: 21, cx: 1300, cy: 540, h: 860, enter: 'drop', exit: 'swipeR', delay: 0.12, swapTo: { cx: 620, cy: 540, rot: -1 }, rot: 1 },
    ],
  },
  {
    id: 'd5', bg: 'paper', kind: 'photos', dur: 3.4,
    items: [
      { idx: 28, cx: 560, cy: 480, w: 840, enter: 'rotL', exit: 'swipeR', rot: -1.5, drift: [-6, -3] },
      { idx: 26, cx: 1420, cy: 640, w: 800, enter: 'slideR', exit: 'swipeR', delay: 0.2, rot: 1.5, drift: [6, 3] },
    ],
  },
  // ── Equipo ──
  {
    id: 'e1', bg: 'paper', kind: 'photos', dur: 3.4, flare: true,
    items: [
      { idx: 11, cx: 520, cy: 440, w: 880, enter: 'slideL', exit: 'swipeL', rot: -1.2 },
      { idx: 22, cx: 1380, cy: 640, w: 860, enter: 'slideR', exit: 'swipeR', delay: 0.2, rot: 1.2 },
    ],
  },
  {
    id: 'e2', bg: 'paper', kind: 'photos', dur: 3.6,
    items: [
      { idx: 14, cx: 560, cy: 540, h: 860, enter: 'pop', exit: 'lift', swapTo: { cx: 1330, cy: 540, rot: 1 }, rot: -1 },
      { idx: 20, cx: 1330, cy: 540, h: 860, enter: 'pop', exit: 'lift', delay: 0.15, swapTo: { cx: 560, cy: 540, rot: -1 }, rot: 1 },
    ],
  },
  { id: 'e3', bg: 'paper', kind: 'photos', dur: 2.6, items: [{ idx: 23, cx: 960, cy: 540, w: 1500, enter: 'rotL', exit: 'lift', zoom: 0.05 }] },
  {
    id: 'p4', bg: 'chalk', kind: 'phrase', dur: 3.4, ghostPhotos: [23, 14],
    phrase: { lines: [[{ w: 'Y' }, { w: 'que' }, { w: 'lo' }, { w: 'mejor', em: true }], [{ w: 'siempre' }, { w: 'esté' }, { w: 'por' }, { w: 'venir.', em: true }]] },
  },
];

/** Inicio (s) de cada plano: planos consecutivos, sin huecos. */
export const SHOT_START: number[] = (() => {
  const out: number[] = [];
  let t = T.s4Start;
  for (const s of SHOTS) {
    out.push(t);
    t += s.dur;
  }
  return out;
})();
export const S4_END_COMPUTED = SHOT_START[SHOT_START.length - 1] + SHOTS[SHOTS.length - 1].dur;

// ───────────────────────── cierre ─────────────────────────
export const CLOSE = {
  mosaicIn: 90.9,
  mosaicHold: 93.2,
  mosaicOut: 94.8,
  msgStart: 94.3,
  msgEnd: 99.6,
  happy: 99.4,
  signStart: 101.5,
  logoIn: 102.8,
  fadeStart: 104.1,
  end: 105,
  mosaic: [3, 4, 5, 9, 12, 16, 17, 18, 19, 21, 25, 30],
};

/** Fotos del carrusel (la HERO es la elegida). */
export const CAROUSEL_PHOTOS = [4, 17, 25, 18, 19, 29, 24, 28, 27, 5, 13, 9, 15, 16, 12, 30, 21, 10, 3, 14, 20];

// ───────────────────────── fondos: papel ↔ pizarra ─────────────────────────
/** Radio del anillo (px) que sale de la ruleta y «descubre» el papel. */
export const ringRadius = (t: number) => eOut(prog(t, 6.95, 8.25)) * 1500;

export type BgEvent = {t: number; dur: number; kind: BgKind; ring?: boolean};
export const BG_EVENTS: BgEvent[] = (() => {
  const ev: BgEvent[] = [{t: 6.95, dur: 1.3, kind: 'paper', ring: true}];
  let cur: BgKind = 'paper';
  const push = (t: number, kind: BgKind, dur = 0.95) => {
    if (kind !== cur) {
      ev.push({t, dur, kind});
      cur = kind;
    }
  };
  push(21.3, 'chalk', 0.9); // fin del saludo → primera frase (pizarra)
  SHOTS.forEach((sh, i) => {
    if (i === 0) return;
    push(SHOT_START[i] - TR - 0.05, sh.bg ?? 'paper');
  });
  push(90.75, 'paper'); // mosaico
  push(98.9, 'chalk', 1.0); // ¡Feliz cumpleaños!
  return ev;
})();
