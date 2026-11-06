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
  s1: {card: 4, lineA: 12, lineB: 66, perdidas: sf(0.96), swap: 66, sin: 74, oblig: sf(2.88), textOut: 134, out: 142},
  s2: {hit: 161, tri: 163, esto: 185, no: sf(6.64), esAsi: sf(6.9), out: 224},
  s3: {lead: 244, perdidas: sf(9.4), neq: 292, sinOblig: sf(10.2), doc: [328, 344, 360], check: [378, 387, 396], out: 400},
  s4: {hay: sf(13.92), importante: sf(14.3), line: 446, out: 454},
  s5: {top: 466, label1: sf(15.7), bars: 476, no: 508, esCero: sf(18.54), label2: sf(19.48), calc: 590, result: sf(20.72), out: 640},
  s6: {cardA: 666, labelA: sf(22.84), line: 702, cardB: 718, labelB: sf(24.38), select: 750, settle: 772, out: 786},
  s7: {doc1: 816, lead: 832, decl: sf(28.66), check1: 874, doc2: 880, anexos: sf(29.5), segun: sf(30.24), verify: 922, out: 928},
  s8: {sin1: sf(32.19), utilidades: sf(32.58), neq: sf(33.36), sin2: sf(34.42), oblig: sf(34.7), out: 1066},
  s9: {brand: sf(36.18), lead: sf(36.6), tu: sf(37.2), alDia: sf(38.22), tag: 1176, fadeOut: 1187},
} as const;

// Ventanas de renderizado por escena (preroll/tail para transiciones solapadas)
export const WINDOWS: Array<[number, number]> = SCENE_START.map((s, i) => [Math.max(0, s - 24), SCENE_END[i] + 24]);
