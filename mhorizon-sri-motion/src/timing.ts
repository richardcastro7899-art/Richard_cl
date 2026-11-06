// ─────────────────────────────────────────────────────────────────────────────
// TIMELINE MAESTRO — derivado del análisis del MP3 de referencia (40,359125 s).
// La voz es SOLO referencia temporal: no se importa ni se exporta en ninguna
// composición final. Los frames de este archivo gobiernan animación y sonido.
// ─────────────────────────────────────────────────────────────────────────────
export const FPS = 30;
export const AUDIO_SECONDS = 40.359125; // duración exacta de la locución de referencia
export const TOTAL = 1211; // 1211 fotogramas a 30 fps = 40,3667 s (+7,5 ms sobre el audio)
export const sf = (sec: number) => Math.round(sec * FPS);

// Inicio de cada escena (s) = final de cada pausa detectada en el audio
export const SCENE_SECONDS = [0, 5.3545, 7.9363, 13.8085, 15.4458, 22.0074, 26.9524, 31.1934, 36.0486, AUDIO_SECONDS];
export const SCENE_START = SCENE_SECONDS.slice(0, 9).map(sf); // 0,161,238,414,463,660,809,936,1081
export const SCENE_END = [...SCENE_START.slice(1), TOTAL];
export const SCENE_NAMES = [
  'Pérdidas',
  'Esto no es así',
  'Pérdidas ≠ obligaciones',
  'Algo importante',
  'Pérdida contable e impuesto',
  'Resultado tributario y régimen',
  'Declaraciones y anexos',
  'Sin utilidades ≠ sin obligaciones',
  'Tu empresa al día',
];

// Cues (frames globales) — cada uno apunta a una palabra o pausa de la locución.
export const Q = {
  s1: {
    card: 2, grid: 5, lineA: 10, lineB: 66, perdidas: sf(0.96), perdidasLabel: 70, sin: 72, oblig: sf(2.88),
    sri: sf(3.96), textOut: 132, collapse: 140, morph: 142,
  },
  s2: {
    hit: 161, rings: 163, esto: sf(6.32), no: sf(6.64), esAsi: sf(6.9), out: 224,
  },
  s3: {
    neq: 240, perdidas: sf(9.4), sinOblig: sf(10.2), hub: 322, doc: [328, 344, 360], conn: [338, 354, 370],
    check: [378, 387, 396], out: 400,
  },
  s4: {
    converge: 416, hay: sf(13.92), algo: sf(14.06), importante: sf(14.3), pulse: 436, hold: 452,
  },
  s5: {
    top: 466, label1: sf(15.7), bars: 474, divider: 505, no: 506, necesariamente: sf(17.58), esCero: sf(18.54),
    label2: sf(19.48), calc: 586, result: sf(20.72), out: 642,
  },
  s6: {
    hub: 664, cardA: 676, labelA: sf(22.84), cardB: sf(24.02), labelB: sf(24.38), pulses: 700, select: 750, settle: 772, out: 784,
  },
  s7: {
    doc1: 818, decl: sf(28.66), anexos: sf(29.5), doc2: 880, segun: sf(30.24), check1: 874, check2: 906, verify: 922, out: 928,
  },
  s8: {
    bands: 938, sin1: sf(32.19), utilidades: sf(32.58), neq: sf(33.36), sin2: sf(34.42), oblig: sf(34.7), settle: 1062, out: 1066,
  },
  s9: {
    horizon: 1062, brand: sf(36.18), tu: sf(37.2), alDia: sf(38.22), settle: 1172, fadeOut: 1180,
  },
} as const;

// Ventanas de renderizado por escena (preroll/tail para transiciones solapadas)
export const WINDOWS: Array<[number, number]> = SCENE_START.map((s, i) => [Math.max(0, s - 24), SCENE_END[i] + 24]);
