// ─────────────────────────────────────────────────────────────────────────────
// SISTEMA DE SOUND DESIGN — manifiesto de eventos sonoros sincronizados por fotograma.
// Cada evento: id · receta de síntesis · fotograma de sincronía · duración · volumen ·
// fade in/out · categoría · elemento visual asociado.
// `sync` = fotograma del keyframe visual; `lead` = segundos del archivo anteriores a ese
// fotograma (el sonido "llega" al golpe visual: whoosh que sube, riser que culmina, etc.).
// ─────────────────────────────────────────────────────────────────────────────
import {Q, FPS, TOTAL} from '../timing';
import type {Recipe} from './synth';

export type Category = 'transitions' | 'text' | 'ui' | 'impacts' | 'graphics' | 'brand';
export const CATEGORY_LABEL: Record<Category, string> = {
  transitions: 'Transitions', text: 'Text animations', ui: 'UI interactions', impacts: 'Impacts', graphics: 'Graphic movements', brand: 'Brand sound',
};
export type SfxEvent = {
  id: string; cat: Category; recipe: Recipe; params: Record<string, any>;
  sync: number; lead: number; dur: number; vol: number; fadeIn: number; fadeOut: number; visual: string;
};

export const MASTER_GAIN = 0.4;
export const FADE_OUT_FRAMES = 24; // fundido final: termina exactamente en el último fotograma
export const masterFade = (frame: number) => {
  const t = (frame - (TOTAL - FADE_OUT_FRAMES)) / FADE_OUT_FRAMES;
  return t <= 0 ? 1 : t >= 1 ? 0 : 0.5 * (1 + Math.cos(Math.PI * t));
};

const EV: SfxEvent[] = [];
const add = (id: string, cat: Category, recipe: Recipe, params: Record<string, any>, sync: number, lead: number, dur: number, vol: number, visual: string, fadeOut = 0.08, fadeIn = 0.003) =>
  EV.push({id, cat, recipe, params, sync, lead, dur, vol, fadeIn, fadeOut, visual});

// Notas de la escala corporativa (Re mayor / pentatónica): D4 293.66 · F#4 369.99 · A4 440 · D5 587.33 · F#5 739.99 · A5 880 · C6 1046.5 · D6 1174.7 · E6 1318.5 · A6 1760
const ping = (...n: Array<[number, number]>) => ({timbre: 'bell', index: 1.6, ratio: 3.5, notes: n.map(([t, f], i) => [t, f, 0.7, 0.55 - i * 0.05]), verb: 0.22});
const pluck = (f: number) => ({timbre: 'pluck', decay: 0.5, notes: [[0, f, 0.22, 0.6]], verb: 0.12});
const chord = (fs: number[], d = 1.4) => ({timbre: 'soft', attack: 0.06, decay: 0.45, notes: fs.map((f, i) => [0, f, d, 0.5 - i * 0.07]), verb: 0.3});
const T = (id: string, p: any, s: number, l: number, d: number, v: number, vis: string, c: Category = 'text') => add(id, c, 'tick', p, s, l, d, v, vis);

const W = (id: string, p: any, sync: number, lead: number, dur: number, vol: number, vis: string, cat: Category = 'text') => add(id, cat, 'whoosh', p, sync, lead, dur, vol, vis);
const TXT = {f0: 700, f1: 3200, peak: 0.6}; // whoosh de texto suave

// ── ESCENA 01 ── gráfica y caída
add('s1_card_open', 'ui', 'tone', ping([0, 880], [0.07, 1318.5]), Q.s1.card, 0, 0.9, 0.28, 'Tarjeta financiera entra (UI reveal)');
add('s1_line_trace', 'graphics', 'trace', {f0: 1400, f1: 380, grain: true, rate: 34}, Q.s1.lineA, 0, 1.9, 0.12, 'Trazado de la línea de rendimiento descendente');
W('s1_lead', TXT, 6, 0.2, 0.4, 0.09, '«Tu empresa tuvo» entra');
W('s1_perdidas_whoosh', {f0: 600, f1: 2800, peak: 0.75, pan0: -0.4, pan1: 0.2}, Q.s1.perdidas, 0.34, 0.5, 0.17, '«PÉRDIDAS» se construye letra a letra');
add('s1_perdidas_hit', 'impacts', 'impact', {f: 66, noise: 0.3, tau: 0.25}, Q.s1.perdidas, 0.02, 1.0, 0.45, 'Impacto ligero en «PÉRDIDAS»');
W('s1_swap', {f0: 2400, f1: 600, peak: 0.4, pan0: 0.3, pan1: -0.3}, Q.s1.sin, 0.2, 0.4, 0.12, 'Cambio de mensaje: sale «PÉRDIDAS», entra la pregunta');
W('s1_oblig_whoosh', {f0: 900, f1: 3200, peak: 0.7}, Q.s1.oblig, 0.28, 0.45, 0.15, '«OBLIGACIONES?» se revela');
add('s1_oblig_tone', 'text', 'tone', chord([440, 659.25], 1.0), Q.s1.oblig, 0, 1.2, 0.12, 'Acento tonal corto');
W('s1_out', {f0: 2600, f1: 500, peak: 0.3, pan0: 0.3, pan1: -0.4}, Q.s1.textOut, 0.12, 0.4, 0.12, 'Salen textos y tarjeta');
add('s1_to_s2_riser', 'transitions', 'riser', {f0: 300, f1: 5200, g0: 180, g1: 740, tonal: 0.22, shape: 2.2}, 161, 1.0, 1.3, 0.18, 'Reverse swell hacia la advertencia');

// ── ESCENA 02 ── advertencia
add('s2_hit', 'impacts', 'impact', {f: 55, noise: 0.35, tau: 0.3, tone: 1, toneHz: 587.33}, 161, 0.02, 1.2, 0.55, 'Impacto suave: aparece la señal de advertencia');
add('s2_tri_trace', 'graphics', 'trace', {f0: 500, f1: 1200}, Q.s2.tri, 0, 0.45, 0.1, 'Se traza el triángulo y la exclamación');
W('s2_esto', {f0: 900, f1: 3500, peak: 0.6}, Q.s2.esto, 0.18, 0.32, 0.11, '«porque esto» entra');
add('s2_no_hit', 'impacts', 'impact', {f: 50, noise: 0.5, tau: 0.28, drop: 1.4}, Q.s2.no, 0.02, 1.1, 0.62, '«NO» golpea (cambio de jerarquía)');
add('s2_no_sub', 'impacts', 'sub', {f0: 52, f1: 40}, Q.s2.no, 0.1, 1.0, 0.32, 'Acento de bajo en «NO»');
W('s2_esasi', {f0: 1100, f1: 4200, peak: 0.6}, Q.s2.esAsi, 0.16, 0.3, 0.11, '«ES ASÍ» entra');
W('s2_out', {f0: 3000, f1: 500, peak: 0.35, pan0: 0.7, pan1: -0.8, body: 500}, Q.s2.out + 2, 0.21, 0.6, 0.16, 'Salida direccional', 'transitions');

// ── ESCENA 03 ── pérdidas ≠ sin obligaciones
W('s3_lead', TXT, Q.s3.lead, 0.2, 0.4, 0.09, '«Aunque una empresa registre» entra');
W('s3_perdidas', {f0: 700, f1: 3000, peak: 0.7}, Q.s3.perdidas, 0.32, 0.48, 0.15, '«PÉRDIDAS» entra');
add('s3_perdidas_hit', 'impacts', 'impact', {f: 70, noise: 0.3, tau: 0.22}, Q.s3.perdidas, 0.02, 0.8, 0.34, 'Golpe suave de «PÉRDIDAS»');
add('s3_neq_sweep', 'graphics', 'whoosh', {f0: 1200, f1: 5000, q: 2.5, peak: 0.6, pan0: -0.5, pan1: 0.5}, Q.s3.neq + 10, 0.3, 0.5, 0.1, 'Se dibuja el símbolo ≠');
add('s3_neq_hit', 'impacts', 'impact', {f: 78, noise: 0.3, tau: 0.3}, Q.s3.neq + 14, 0.02, 1.0, 0.42, 'Acento en el símbolo ≠');
add('s3_neq_tone', 'text', 'tone', ping([0, 587.33], [0, 880]), Q.s3.neq + 14, 0, 1.4, 0.12, 'Acento tonal del ≠');
W('s3_sinoblig', {f0: 800, f1: 3400, peak: 0.7}, Q.s3.sinOblig, 0.28, 0.42, 0.14, '«SIN OBLIGACIONES» entra');
[0, 1, 2].forEach((i) => {
  add(`s3_doc${i + 1}_paper`, 'graphics', 'paper', {thump: 150 - i * 20, pan0: [0.6, -0.5, -0.7][i], pan1: [-0.1, 0.1, 0.3][i]}, Q.s3.doc[i] + 8, 0.12, 0.7, 0.26, `Documento ${i + 1} entra`);
  add(`s3_check${i + 1}`, 'ui', 'tone', ping([0, [1046.5, 1174.7, 1318.5][i]], [0.09, [1568, 1760, 1975.5][i]]), Q.s3.check[i], 0, 0.9, 0.18 + i * 0.02, `Verificación del documento ${i + 1}`);
});
W('s3_out', {f0: 3500, f1: 300, peak: 0.3, pan0: 0.6, pan1: -0.6, body: 450}, Q.s3.out + 4, 0.22, 0.75, 0.14, 'Salen documentos y textos', 'transitions');

// ── ESCENA 04 ── «Y hay algo importante» (con silencio al final)
W('s4_hay', TXT, Q.s4.hay, 0.18, 0.32, 0.11, '«Y hay algo» entra');
W('s4_imp', {f0: 700, f1: 3800, peak: 0.7}, Q.s4.importante, 0.22, 0.4, 0.14, '«IMPORTANTE» entra');
add('s4_imp_tone', 'text', 'tone', chord([587.33, 739.99, 880], 1.4), Q.s4.importante + 2, 0, 1.6, 0.12, 'Acento tonal sutil');
add('s4_imp_hit', 'impacts', 'impact', {f: 55, noise: 0.25, tau: 0.3}, Q.s4.importante + 4, 0.02, 1.2, 0.34, 'Impacto suave en «IMPORTANTE»');
add('s4_line', 'graphics', 'trace', {f0: 500, f1: 1500}, Q.s4.line, 0, 0.5, 0.08, 'Se subraya «IMPORTANTE»');

// ── ESCENA 05 ── pérdida contable · no necesariamente es cero · impuesto a la renta
add('s5_top_open', 'ui', 'tone', ping([0, 880], [0.06, 1174.7]), Q.s5.top, 0, 0.9, 0.2, 'Tarjeta superior entra');
W('s5_label1', {f0: 800, f1: 3200, peak: 0.6}, Q.s5.label1 + 1, 0.16, 0.34, 0.1, '«PÉRDIDA CONTABLE» entra');
add('s5_bars', 'graphics', 'data', {base: 392, rate: 14}, Q.s5.bars, 0, 1.1, 0.08, 'Barras de resultado contable');
W('s5_no', {f0: 700, f1: 3400, peak: 0.55}, Q.s5.no + 6, 0.25, 0.5, 0.13, '«NO NECESARIAMENTE» entra');
W('s5_escero', {f0: 900, f1: 3800, peak: 0.6}, Q.s5.esCero, 0.18, 0.3, 0.12, '«ES CERO» entra');
add('s5_escero_hit', 'impacts', 'impact', {f: 66, noise: 0.3, tau: 0.25}, Q.s5.esCero + 3, 0.02, 0.9, 0.38, 'Énfasis en «CERO»');
add('s5_card2', 'graphics', 'paper', {thump: 100, pan0: 0.5, pan1: -0.3}, Q.s5.label2, 0.3, 0.7, 0.2, 'Tarjeta inferior entra');
W('s5_label2', {f0: 700, f1: 3400, peak: 0.65}, Q.s5.label2, 0.28, 0.45, 0.14, '«IMPUESTO A LA RENTA» entra');
add('s5_concept_hit', 'impacts', 'impact', {f: 74, noise: 0.3, tau: 0.3}, Q.s5.label2, 0.02, 1.0, 0.46, 'Concepto principal');
add('s5_concept_tone', 'text', 'tone', ping([0, 587.33], [0, 880], [0, 1174.7]), Q.s5.label2, 0, 1.8, 0.16, 'Acento sonoro del concepto principal');
add('s5_calc', 'graphics', 'data', {base: 523.25, rate: 12}, Q.s5.calc + 2, 0, 1.6, 0.08, 'Cálculo procesándose');
[0, 1, 2].forEach((i) => add(`s5_row${i + 1}_ok`, 'ui', 'tone', pluck([1318.5, 1568, 1760][i]), Q.s5.calc + i * 12 + 24, 0, 0.5, 0.09, `Fila ${i + 1} confirmada`));
add('s5_result', 'ui', 'tone', ping([0, 1046.5], [0.1, 1568], [0.2, 2093]), Q.s5.result, 0, 1.4, 0.2, 'Indicador de resultado (no es cero)');
add('s5_result_sub', 'impacts', 'sub', {f0: 48, f1: 40}, Q.s5.result, 0.05, 0.6, 0.22, 'Acento de bajo del resultado');
W('s5_out', {f0: 800, f1: 4000, peak: 0.4, pan0: -0.6, pan1: 0.4}, Q.s5.out + 2, 0.25, 0.65, 0.13, 'Salen las tarjetas', 'transitions');

// ── ESCENA 06 ── resultado tributario y régimen
W('s6_cardA', {f0: 900, f1: 3600, peak: 0.55, pan0: -0.7, pan1: 0.4}, Q.s6.cardA + 6, 0.3, 0.6, 0.15, 'Módulo «RESULTADO TRIBUTARIO» entra', 'graphics');
add('s6_cardA_settle', 'graphics', 'paper', {thump: 100}, Q.s6.cardA + 16, 0.35, 0.7, 0.18, 'Módulo A asienta');
W('s6_labA', {f0: 800, f1: 3400, peak: 0.6}, Q.s6.labelA, 0.15, 0.3, 0.1, '«RESULTADO TRIBUTARIO» entra');
add('s6_scan', 'graphics', 'trace', {f0: 500, f1: 2400, curve: 'ease', grain: true, rate: 22}, Q.s6.labelA, 0, 1.15, 0.08, 'Haz de análisis recorre el libro');
[0, 1, 2, 3, 4].forEach((i) => add(`s6_ckA${i + 1}`, 'ui', 'tone', pluck([1046.5, 1174.7, 1318.5, 1568, 1760][i]), Q.s6.labelA + 26 + i * 5, 0, 0.4, 0.06, `Verificación de fila ${i + 1}`));
add('s6_line', 'graphics', 'trace', {f0: 600, f1: 1400}, Q.s6.line, 0, 0.35, 0.09, 'Conexión entre módulos');
W('s6_cardB', {f0: 900, f1: 3600, peak: 0.55, pan0: 0.7, pan1: -0.4}, Q.s6.cardB + 6, 0.3, 0.6, 0.15, 'Módulo «RÉGIMEN APLICABLE» entra', 'graphics');
add('s6_cardB_settle', 'graphics', 'paper', {thump: 90, pan0: -0.5, pan1: 0.3}, Q.s6.cardB + 16, 0.35, 0.7, 0.18, 'Módulo B asienta');
W('s6_labB', {f0: 800, f1: 3400, peak: 0.6}, Q.s6.labelB, 0.15, 0.3, 0.1, '«RÉGIMEN APLICABLE» entra');
[0, 1, 2].forEach((i) => {
  add(`s6_swipe${i + 1}`, 'graphics', 'whoosh', {f0: 3000, f1: 6500, q: 3, peak: 0.5, pan0: -0.5 + i * 0.4, pan1: -0.2 + i * 0.4}, Q.s6.select + i * 8, 0.09, 0.2, 0.09, `Selección digital ${i + 1}`);
  add(`s6_sel${i + 1}`, 'ui', 'tick', {f: 1800 + i * 250, noiseHz: 5000}, Q.s6.select + i * 8, 0, 0.3, 0.14, `Selector salta a opción ${i + 1}`);
});
add('s6_settle', 'ui', 'tone', ping([0, 1174.7], [0.08, 1760]), Q.s6.settle, 0, 1.0, 0.2, 'Régimen aplicable seleccionado');
W('s6_out', {f0: 1200, f1: 5500, q: 2, peak: 0.5, pan0: -0.6, pan1: 0.6}, Q.s6.out + 6, 0.45, 0.95, 0.15, 'Los módulos salen', 'transitions');
add('s6_out_air', 'transitions', 'air', {f0: 2200, f1: 9000}, Q.s6.out + 8, 0.5, 1.15, 0.08, 'Transición ambiental suave a documentos');

// ── ESCENA 07 ── declaraciones y anexos
W('s7_lead', TXT, Q.s7.lead, 0.2, 0.4, 0.1, '«debe presentar las» entra');
add('s7_doc1', 'graphics', 'paper', {thump: 120, pan0: -0.6, pan1: 0.2}, Q.s7.doc1 + 10, 0.3, 0.65, 0.2, 'Documento de declaraciones entra');
add('s7_fields', 'graphics', 'data', {base: 659.25, rate: 13}, 840, 0, 1.4, 0.08, 'Campos de la declaración se completan');
W('s7_decl', {f0: 800, f1: 3400, peak: 0.6}, Q.s7.decl, 0.2, 0.4, 0.13, '«DECLARACIONES» entra');
add('s7_check1', 'ui', 'tone', ping([0, 1174.7], [0.09, 1760]), Q.s7.check1, 0, 0.9, 0.18, 'Declaración verificada');
add('s7_doc2', 'graphics', 'paper', {thump: 90, pan0: 0.6, pan1: -0.2}, Q.s7.doc2 + 10, 0.3, 0.65, 0.22, 'Documento de anexos entra');
W('s7_anexos', {f0: 800, f1: 3400, peak: 0.6}, Q.s7.anexos, 0.15, 0.3, 0.12, '«ANEXOS» entra');
add('s7_table', 'graphics', 'data', {base: 587.33, rate: 14}, Q.s7.doc2 + 12, 0, 0.9, 0.08, 'Tabla de anexos se completa');
[0, 1, 2].forEach((i) => add(`s7_ck2_${i + 1}`, 'ui', 'tone', pluck([1318.5, 1568, 1760][i]), 904 + i * 8, 0, 0.4, 0.07, `Verificación de fila de anexos ${i + 1}`));
W('s7_segun', {f0: 800, f1: 3500, peak: 0.6}, Q.s7.segun, 0.3, 0.55, 0.13, '«SEGÚN CORRESPONDA» se despliega');
add('s7_segun_tone', 'ui', 'tone', {timbre: 'bell', index: 1.2, notes: [[0, 880, 0.6, 0.4], [0.07, 1318.5, 0.7, 0.4]], verb: 0.2}, Q.s7.segun, 0, 1.0, 0.14, 'Píldora «SEGÚN CORRESPONDA»');
add('s7_verify', 'ui', 'tone', ping([0, 1318.5], [0.1, 1975.5]), Q.s7.verify, 0, 1.3, 0.2, 'Verificación final');
W('s7_out', {f0: 3200, f1: 400, peak: 0.35, pan0: 0.6, pan1: -0.6, body: 400}, Q.s7.out + 4, 0.24, 0.7, 0.14, 'Salen los documentos', 'transitions');

// ── ESCENA 08 ── tipografía editorial
W('s8_sin1', TXT, Q.s8.sin1, 0.16, 0.3, 0.1, '«sin» entra');
W('s8_util', {f0: 700, f1: 3800, peak: 0.6}, Q.s8.utilidades, 0.27, 0.45, 0.16, '«UTILIDADES» entra (barrido tipográfico)');
add('s8_neq_sweep', 'graphics', 'whoosh', {f0: 1200, f1: 5200, q: 2.5, peak: 0.6, pan0: -0.5, pan1: 0.5}, Q.s8.neq + 6, 0.3, 0.5, 0.1, 'Se dibuja el símbolo ≠');
add('s8_neq_hit', 'impacts', 'impact', {f: 60, noise: 0.4, tau: 0.35, tone: 1, toneHz: 587.33}, Q.s8.neq + 6, 0.02, 1.3, 0.6, 'Impacto sutil en el símbolo ≠');
add('s8_neq_sub', 'impacts', 'sub', {f0: 46, f1: 38}, Q.s8.neq + 6, 0.08, 1.2, 0.34, 'Acento de bajo del ≠');
W('s8_sin2', TXT, Q.s8.sin2, 0.16, 0.3, 0.1, '«sin» inferior entra');
W('s8_oblig', {f0: 700, f1: 3800, peak: 0.6}, Q.s8.oblig, 0.27, 0.45, 0.16, '«OBLIGACIONES» entra');
add('s8_oblig_tone', 'text', 'tone', chord([440, 587.33], 1.2), Q.s8.oblig, 0, 1.4, 0.09, 'Acento tonal');
add('s8_to_brand_riser', 'transitions', 'riser', {f0: 300, f1: 6500, g0: 160, g1: 660, tonal: 0.24, shape: 2.4}, 1086, 0.85, 1.05, 0.2, 'Tonal riser hacia la marca');
add('s8_to_brand_sub', 'transitions', 'sub', {f0: 38, f1: 55}, 1086, 0.9, 1.4, 0.22, 'Transición de baja frecuencia hacia la marca');

// ── ESCENA 09 ── cierre de marca
add('s9_brand', 'brand', 'brand', {root: 146.83, tau: 1.2}, Q.s9.brand, 0.5, 3.4, 0.34, 'Revelación del logotipo MHORIZON (acento corporativo original)', 0.3);
add('s9_brand_hit', 'impacts', 'impact', {f: 52, noise: 0.3, tau: 0.3}, Q.s9.brand, 0.02, 1.1, 0.36, 'Impacto suave de la marca');
W('s9_lead', TXT, Q.s9.lead, 0.18, 0.4, 0.09, '«te ayudamos a mantener» entra');
W('s9_tu', {f0: 800, f1: 3600, peak: 0.6}, Q.s9.tu, 0.27, 0.48, 0.15, '«TU EMPRESA» entra');
W('s9_aldia', {f0: 700, f1: 3600, peak: 0.65}, Q.s9.alDia, 0.22, 0.4, 0.15, '«AL DÍA» entra');
add('s9_aldia_hit', 'impacts', 'impact', {f: 58, noise: 0.3, tau: 0.26}, Q.s9.alDia, 0.02, 1.0, 0.42, 'Impacto suave en «AL DÍA»');
add('s9_corporate', 'brand', 'tone', chord([293.66, 369.99, 440, 659.25], 3.0), Q.s9.alDia + 1, 0, 3.4, 0.18, 'Acorde corporativo original (Re mayor add9) — fundido final', 0.5);

export const EVENTS: SfxEvent[] = EV.sort((a, b) => a.sync - b.sync);

/** Posición exacta en el timeline: fotograma de inicio + relleno sub-fotograma (en muestras). */
export function place(e: SfxEvent, sr = 48000) {
  const startSec = Math.max(0, e.sync / FPS - e.lead);
  const startFrame = Math.floor(startSec * FPS + 1e-9);
  const padSamples = Math.round((startSec - startFrame / FPS) * sr);
  const hit = e.sync / FPS - e.lead < 0 ? e.sync / FPS : e.lead;
  return {startSec, startFrame, padSamples, hit};
}
