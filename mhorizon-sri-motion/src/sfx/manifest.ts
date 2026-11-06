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

// ── ESCENA 01 ── interfaz financiera y caída
add('s1_card_open', 'ui', 'tone', ping([0, 880], [0.07, 1318.5]), Q.s1.card, 0, 0.9, 0.32, 'Tarjeta de interfaz se abre (UI reveal)');
add('s1_grid_build', 'graphics', 'data', {base: 659.25, rate: 16, verb: 0.15}, Q.s1.grid + 1, 0, 0.9, 0.12, 'Construcción de rejilla y cabecera');
add('s1_line_trace', 'graphics', 'trace', {f0: 1500, f1: 380, grain: true, rate: 34}, Q.s1.lineA, 0, 1.9, 0.14, 'Trazado de la línea de rendimiento descendente');
add('s1_line_sweep', 'graphics', 'whoosh', {f0: 4200, f1: 600, q: 0.9, peak: 0.4, pan0: -0.6, pan1: 0.5, verb: 0.2}, Q.s1.lineA, 0, 1.9, 0.1, 'Barrido suave acompañando la caída');
T('s1_chip_tick', {f: 1500, noiseHz: 2500}, 52, 0, 0.3, 0.26, 'Chip de caída aparece sobre el punto final', 'ui');
add('s1_perdidas_whoosh', 'text', 'whoosh', {f0: 600, f1: 2800, peak: 0.75, pan0: -0.4, pan1: 0.2}, Q.s1.perdidas, 0.34, 0.5, 0.2, '«PÉRDIDAS» se construye letra a letra');
add('s1_perdidas_hit', 'impacts', 'impact', {f: 66, noise: 0.3, tau: 0.25}, Q.s1.perdidas, 0.02, 1.0, 0.5, 'Impacto ligero en «PÉRDIDAS»');
add('s1_label_shrink', 'text', 'whoosh', {f0: 500, f1: 2200, peak: 0.5, pan0: 0.2, pan1: -0.3}, Q.s1.perdidasLabel, 0.17, 0.4, 0.14, '«PÉRDIDAS» se contrae a etiqueta');
T('s1_sin_tick', {f: 1900}, Q.s1.sin, 0, 0.3, 0.2, '«¿SIN» aparece');
add('s1_oblig_whoosh', 'text', 'whoosh', {f0: 900, f1: 3200, peak: 0.7}, Q.s1.oblig, 0.28, 0.45, 0.15, '«OBLIGACIONES?» se revela con máscara');
add('s1_oblig_tone', 'text', 'tone', chord([440, 659.25], 1.0), Q.s1.oblig, 0, 1.2, 0.14, 'Acento tonal corto en «OBLIGACIONES?»');
add('s1_status_ping', 'ui', 'tone', ping([0, 1174.7]), Q.s1.sri, 0, 1.0, 0.18, 'Indicador de estado pulsa (SRI)');
add('s1_text_out', 'text', 'whoosh', {f0: 2600, f1: 500, peak: 0.3, pan0: 0.3, pan1: -0.4}, Q.s1.textOut, 0.12, 0.4, 0.13, 'Textos salen hacia arriba');
add('s1_collapse', 'graphics', 'whoosh', {f0: 1800, f1: 250, peak: 0.35, pan0: 0.5, pan1: -0.5, body: 400}, Q.s1.collapse, 0.19, 0.55, 0.14, 'La interfaz se contrae hasta el horizonte (retracción)');
add('s1_to_s2_riser', 'transitions', 'riser', {f0: 300, f1: 5200, g0: 180, g1: 740, tonal: 0.22, shape: 2.2}, 161, 1.0, 1.3, 0.2, 'Reverse swell: gráfica → señal de advertencia');

// ── ESCENA 02 ── advertencia
add('s2_hit', 'impacts', 'impact', {f: 55, noise: 0.35, tau: 0.3, tone: 1, toneHz: 587.33}, 161, 0.02, 1.2, 0.6, 'Impacto cinematográfico suave: señal de advertencia');
add('s2_echo_ping', 'graphics', 'tone', ping([0, 1174.7], [0.03, 1760]), 163, 0, 1.1, 0.14, 'Ondas de alerta (ecos del triángulo)');
add('s2_excl_trace', 'graphics', 'trace', {f0: 600, f1: 1300}, 165, 0, 0.3, 0.1, 'Se traza la exclamación');
T('s2_excl_dot', {f: 1800}, 173, 0, 0.3, 0.2, 'Punto de la exclamación', 'ui');
add('s2_esto_whoosh', 'text', 'whoosh', {f0: 900, f1: 3500, peak: 0.6}, Q.s2.esto, 0.18, 0.32, 0.12, '«ESTO» entra');
add('s2_no_hit', 'impacts', 'impact', {f: 50, noise: 0.5, tau: 0.28, drop: 1.4}, Q.s2.no, 0.02, 1.1, 0.72, '«NO» golpea (cambio de jerarquía)');
add('s2_no_sub', 'impacts', 'sub', {f0: 52, f1: 40}, Q.s2.no, 0.1, 1.0, 0.36, 'Acento de bajo en «NO»');
add('s2_esasi_whoosh', 'text', 'whoosh', {f0: 1100, f1: 4200, peak: 0.6}, Q.s2.esAsi, 0.16, 0.3, 0.12, '«ES ASÍ» entra');
T('s2_esasi_tick', {f: 2600}, Q.s2.esAsi + 3, 0, 0.3, 0.14, 'Acento en «ES ASÍ»');
add('s2_out_whoosh', 'transitions', 'whoosh', {f0: 3000, f1: 500, peak: 0.35, pan0: 0.7, pan1: -0.8, body: 500}, Q.s2.out, 0.21, 0.6, 0.2, 'Salida direccional de los textos');

// ── ESCENA 03 ── pérdidas ≠ sin obligaciones
add('s3_morph_sweep', 'graphics', 'whoosh', {f0: 800, f1: 6000, q: 2.6, peak: 0.62, pan0: -0.7, pan1: 0.7}, 247, 0.68, 1.1, 0.13, 'Morphing triángulo → símbolo ≠ (digital sweep)');
add('s3_neq_hit', 'impacts', 'impact', {f: 78, noise: 0.3, tau: 0.3}, Q.s3.neq + 12, 0.02, 1.0, 0.5, 'Acento en el símbolo ≠');
add('s3_neq_tone', 'text', 'tone', ping([0, 587.33], [0, 880]), Q.s3.neq + 12, 0, 1.4, 0.15, 'Acento tonal del ≠');
add('s3_perdidas_whoosh', 'text', 'whoosh', {f0: 700, f1: 3000, peak: 0.7}, Q.s3.perdidas, 0.32, 0.48, 0.16, '«PÉRDIDAS» entra');
add('s3_perdidas_hit', 'impacts', 'impact', {f: 70, noise: 0.3, tau: 0.22}, Q.s3.perdidas, 0.02, 0.8, 0.38, 'Golpe suave de «PÉRDIDAS»');
add('s3_sinoblig_whoosh', 'text', 'whoosh', {f0: 800, f1: 3400, peak: 0.7}, Q.s3.sinOblig, 0.28, 0.42, 0.15, '«SIN OBLIGACIONES» entra');
T('s3_sinoblig_tick', {f: 2100}, Q.s3.sinOblig + 2, 0, 0.3, 0.14, 'Acento en «SIN OBLIGACIONES»');
add('s3_hub', 'ui', 'tone', pluck(1318.5), Q.s3.hub, 0, 0.6, 0.2, 'Nodo central de conexión');
[0, 1, 2].forEach((i) => {
  add(`s3_doc${i + 1}_paper`, 'graphics', 'paper', {thump: 150 - i * 20, pan0: [0.6, -0.5, -0.7][i], pan1: [-0.1, 0.1, 0.3][i]}, Q.s3.doc[i] + 6, 0.12, 0.7, 0.26 + i * 0.02, `Documento ${i + 1} entra (soft whoosh)`);
  add(`s3_conn${i + 1}_trace`, 'graphics', 'trace', {f0: 700 + i * 120, f1: 1500 + i * 150}, Q.s3.conn[i], 0, 0.45, 0.1, `Línea de conexión ${i + 1} se dibuja`);
  T(`s3_conn${i + 1}_tick`, {f: 2400 + i * 300}, Q.s3.conn[i] + 14, 0, 0.3, 0.12, `Conexión ${i + 1} establecida`, 'ui');
  add(`s3_check${i + 1}`, 'ui', 'tone', ping([0, [1046.5, 1174.7, 1318.5][i]], [0.09, [1568, 1760, 1975.5][i]]), Q.s3.check[i], 0, 0.9, 0.2 + i * 0.02, `Verificación del documento ${i + 1}`);
});
add('s3_out_retract', 'transitions', 'whoosh', {f0: 3500, f1: 300, peak: 0.3, pan0: 0.6, pan1: -0.6, body: 450}, Q.s3.out, 0.22, 0.75, 0.16, 'Elementos se contraen hacia el centro (retracción)');

// ── ESCENA 04 ── "Y hay algo importante"
add('s4_riser', 'transitions', 'riser', {f0: 400, f1: 6000, g0: 220, g1: 880, tonal: 0.18, shape: 2.6}, 446, 0.85, 1.0, 0.22, 'Reverse sweep: anticipación antes del pulso');
add('s4_hay_whoosh', 'text', 'whoosh', {f0: 900, f1: 3500, peak: 0.6}, Q.s4.hay, 0.18, 0.32, 0.12, '«HAY ALGO» entra');
T('s4_hay_tick', {f: 2000}, Q.s4.hay + 2, 0, 0.3, 0.12, 'Acento «HAY ALGO»');
add('s4_imp_whoosh', 'text', 'whoosh', {f0: 700, f1: 3800, peak: 0.7}, Q.s4.importante, 0.22, 0.4, 0.13, '«IMPORTANTE» entra');
add('s4_imp_tone', 'text', 'tone', chord([587.33, 739.99, 880], 1.4), Q.s4.importante + 2, 0, 1.6, 0.13, 'Acento tonal sutil en «IMPORTANTE»');
add('s4_pulse_hit', 'impacts', 'impact', {f: 55, noise: 0.25, tau: 0.3}, 450, 0.02, 1.2, 0.38, 'El anillo se expande: pulso de atención');
add('s4_pulse_sub', 'impacts', 'sub', {f0: 40, f1: 52}, 450, 0.1, 1.1, 0.44, 'Pulso de bajo (después: breve silencio)');

// ── ESCENA 05 ── resultado contable vs impuesto a la renta
add('s5_ring_move', 'graphics', 'whoosh', {f0: 700, f1: 2800, peak: 0.5, pan0: 0.6, pan1: -0.6}, 470, 0.25, 0.55, 0.12, 'El anillo se desplaza a la banda central');
add('s5_top_open', 'ui', 'tone', ping([0, 880], [0.06, 1174.7]), Q.s5.top, 0, 0.9, 0.2, 'Módulo superior se abre');
add('s5_label1_whoosh', 'text', 'whoosh', {f0: 800, f1: 3200, peak: 0.6}, Q.s5.label1 + 1, 0.16, 0.34, 0.1, '«PÉRDIDA CONTABLE» entra');
T('s5_label1_tick', {f: 2000}, Q.s5.label1 + 2, 0, 0.3, 0.14, 'Acento «PÉRDIDA CONTABLE»');
add('s5_bars_data', 'graphics', 'data', {base: 392, rate: 14}, Q.s5.bars, 0, 1.1, 0.1, 'Barras de resultado contable (procesamiento de datos)');
add('s5_bars_trace', 'graphics', 'trace', {f0: 900, f1: 300}, Q.s5.bars + 6, 0, 0.8, 0.09, 'Línea de tendencia descendente');
add('s5_divider', 'ui', 'tick', {f: 1600, noiseHz: 3000}, Q.s5.divider, 0, 0.3, 0.22, 'Divisor de la composición');
add('s5_no_hit', 'impacts', 'impact', {f: 66, noise: 0.3, tau: 0.25}, Q.s5.no, 0.02, 0.9, 0.46, '«NO» (cero tachado)');
add('s5_slash', 'graphics', 'whoosh', {f0: 2000, f1: 5000, peak: 0.5, q: 2}, Q.s5.no + 4, 0.1, 0.2, 0.1, 'Se traza la diagonal que cruza el cero');
add('s5_nec_whoosh', 'text', 'whoosh', {f0: 700, f1: 3400, peak: 0.55}, Q.s5.necesariamente, 0.25, 0.5, 0.15, '«NECESARIAMENTE» se construye');
add('s5_escero_whoosh', 'text', 'whoosh', {f0: 900, f1: 3800, peak: 0.6}, Q.s5.esCero, 0.18, 0.3, 0.12, '«ES CERO» entra');
T('s5_escero_tick', {f: 2300}, Q.s5.esCero + 3, 0, 0.3, 0.14, 'Acento «ES CERO»');
add('s5_concept_hit', 'impacts', 'impact', {f: 74, noise: 0.3, tau: 0.3}, Q.s5.label2, 0.02, 1.0, 0.52, 'Concepto principal: «IMPUESTO A LA RENTA»');
add('s5_concept_tone', 'text', 'tone', ping([0, 587.33], [0, 880], [0, 1174.7]), Q.s5.label2, 0, 1.8, 0.18, 'Acento sonoro del concepto principal');
add('s5_label2_whoosh', 'text', 'whoosh', {f0: 700, f1: 3400, peak: 0.65}, Q.s5.label2, 0.28, 0.45, 0.14, '«IMPUESTO A LA RENTA» entra');
add('s5_calc_data', 'graphics', 'data', {base: 523.25, rate: 12}, Q.s5.calc + 2, 0, 1.6, 0.1, 'Cálculo procesándose (filas)');
[0, 1, 2].forEach((i) => {
  T(`s5_row${i + 1}_click`, {f: 2000 + i * 200}, Q.s5.calc + i * 12, 0, 0.3, 0.16, `Fila de cálculo ${i + 1} se activa`, 'ui');
  add(`s5_row${i + 1}_ok`, 'ui', 'tone', pluck([1318.5, 1568, 1760][i]), Q.s5.calc + i * 12 + 24, 0, 0.5, 0.11, `Fila ${i + 1} confirmada`);
});
add('s5_result_confirm', 'ui', 'tone', ping([0, 1046.5], [0.1, 1568], [0.2, 2093]), Q.s5.result, 0, 1.4, 0.22, 'Resultado: indicador activado (no es cero)');
add('s5_result_sub', 'impacts', 'sub', {f0: 48, f1: 40}, Q.s5.result, 0.05, 0.6, 0.24, 'Acento de bajo del resultado');
add('s5_out_up', 'transitions', 'whoosh', {f0: 800, f1: 4000, peak: 0.4, pan0: -0.6, pan1: 0.4}, Q.s5.out, 0.25, 0.65, 0.14, 'Cambio de panel: sale el módulo superior');
add('s5_out_down', 'transitions', 'whoosh', {f0: 4200, f1: 700, peak: 0.4, pan0: 0.5, pan1: -0.6, body: 500}, Q.s5.out, 0.25, 0.65, 0.13, 'Cambio de panel: sale el módulo inferior');

// ── ESCENA 06 ── resultado tributario y régimen
add('s6_hub', 'ui', 'tone', pluck(1568), Q.s6.hub, 0, 0.5, 0.18, 'Nodo hub de conexión');
add('s6_hub_trace', 'graphics', 'trace', {f0: 400, f1: 1100}, Q.s6.hub, 0, 0.3, 0.1, 'Conexión al nodo se traza');
add('s6_cardA_whoosh', 'graphics', 'whoosh', {f0: 900, f1: 3600, peak: 0.55, pan0: -0.7, pan1: 0.4}, Q.s6.cardA + 6, 0.3, 0.6, 0.17, 'Módulo «RESULTADO TRIBUTARIO» se desplaza');
add('s6_cardA_settle', 'graphics', 'paper', {thump: 100}, Q.s6.cardA + 14, 0.35, 0.7, 0.2, 'Módulo A asienta');
add('s6_labA_whoosh', 'text', 'whoosh', {f0: 800, f1: 3400, peak: 0.6}, Q.s6.labelA, 0.15, 0.3, 0.1, '«RESULTADO TRIBUTARIO» entra');
T('s6_labA_tick', {f: 2100}, Q.s6.labelA + 1, 0, 0.3, 0.14, 'Acento etiqueta A');
add('s6_scan', 'graphics', 'trace', {f0: 500, f1: 2400, curve: 'ease', grain: true, rate: 22}, Q.s6.labelA, 0, 1.15, 0.09, 'Haz de análisis recorre el libro');
[0, 1, 2, 3, 4].forEach((i) => add(`s6_ckA${i + 1}`, 'ui', 'tone', pluck([1046.5, 1174.7, 1318.5, 1568, 1760][i]), Q.s6.labelA + 26 + i * 5, 0, 0.4, 0.07, `Verificación de fila ${i + 1}`));
[[Q.s6.pulses, 1046.5], [Q.s6.pulses + 26, 1174.7], [Q.s6.pulses + 40, 1318.5], [Q.s6.pulses + 58, 1568]].forEach(([s, f], i) => add(`s6_pulse${i + 1}`, 'ui', 'tone', pluck(f), s, 0, 0.4, 0.1, `Pulso de datos ${i + 1} sobre la conexión`));
add('s6_cardB_whoosh', 'graphics', 'whoosh', {f0: 900, f1: 3600, peak: 0.55, pan0: 0.7, pan1: -0.4}, Q.s6.cardB + 2, 0.3, 0.6, 0.17, 'Módulo «RÉGIMEN APLICABLE» se desplaza');
add('s6_cardB_settle', 'graphics', 'paper', {thump: 90, pan0: -0.5, pan1: 0.3}, Q.s6.cardB + 10, 0.35, 0.7, 0.2, 'Módulo B asienta');
add('s6_labB_whoosh', 'text', 'whoosh', {f0: 800, f1: 3400, peak: 0.6}, Q.s6.labelB, 0.15, 0.3, 0.1, '«RÉGIMEN APLICABLE» entra');
T('s6_labB_tick', {f: 2000}, Q.s6.labelB + 1, 0, 0.3, 0.14, 'Acento etiqueta B');
[0, 1, 2].forEach((i) => {
  add(`s6_swipe${i + 1}`, 'graphics', 'whoosh', {f0: 3000, f1: 6500, q: 3, peak: 0.5, pan0: -0.5 + i * 0.4, pan1: -0.2 + i * 0.4}, Q.s6.select + i * 8, 0.09, 0.2, 0.1, `Selección digital ${i + 1} (digital swipe)`);
  T(`s6_sel${i + 1}`, {f: 1800 + i * 250, noiseHz: 5000}, Q.s6.select + i * 8, 0, 0.3, 0.15, `Selector salta a opción ${i + 1}`, 'ui');
});
add('s6_settle', 'ui', 'tone', ping([0, 1174.7], [0.08, 1760]), Q.s6.settle, 0, 1.0, 0.2, 'Régimen aplicable seleccionado');
[0, 1, 2].forEach((i) => add(`s6_branch${i + 1}`, 'ui', 'tone', pluck([1046.5, 1174.7, 1318.5][i]), Q.s6.settle + 10 + i * 4, 0, 0.4, 0.07, `Ramificación confirmada ${i + 1}`));
add('s6_out_sweep', 'transitions', 'whoosh', {f0: 1200, f1: 5500, q: 2, peak: 0.5, pan0: -0.6, pan1: 0.6}, 798, 0.45, 0.95, 0.16, 'Módulos se transforman en documentos');
add('s6_out_air', 'transitions', 'air', {f0: 2200, f1: 9000}, 800, 0.5, 1.15, 0.09, 'Transición ambiental suave a documentos');

// ── ESCENA 07 ── declaraciones y anexos
add('s7_fields', 'graphics', 'data', {base: 659.25, rate: 13}, 840, 0, 1.4, 0.09, 'Campos de la declaración se completan');
add('s7_check1', 'ui', 'tone', ping([0, 1174.7], [0.09, 1760]), Q.s7.check1, 0, 0.9, 0.2, 'Declaración verificada');
add('s7_decl_whoosh', 'text', 'whoosh', {f0: 800, f1: 3400, peak: 0.6}, Q.s7.decl, 0.2, 0.4, 0.14, '«DECLARACIONES» entra');
T('s7_decl_tick', {f: 2000}, Q.s7.decl + 2, 0, 0.3, 0.13, 'Acento «DECLARACIONES»');
add('s7_doc2_whoosh', 'graphics', 'whoosh', {f0: 900, f1: 3800, peak: 0.55, pan0: 0.7, pan1: -0.2}, Q.s7.doc2 + 4, 0.3, 0.6, 0.17, 'Documento de anexos se desplaza');
add('s7_doc2_paper', 'graphics', 'paper', {thump: 90, pan0: 0.4, pan1: -0.3}, Q.s7.doc2 + 10, 0.3, 0.65, 0.26, 'Anexos asienta (sonido discreto de documento)');
add('s7_anexos_whoosh', 'text', 'whoosh', {f0: 800, f1: 3400, peak: 0.6}, Q.s7.anexos, 0.15, 0.3, 0.12, '«ANEXOS» entra');
T('s7_anexos_tick', {f: 2200}, Q.s7.anexos + 1, 0, 0.3, 0.13, 'Acento «ANEXOS»');
add('s7_table', 'graphics', 'data', {base: 587.33, rate: 14}, Q.s7.doc2 + 12, 0, 0.9, 0.09, 'Tabla de anexos se completa');
[0, 1, 2].forEach((i) => add(`s7_ck2_${i + 1}`, 'ui', 'tone', pluck([1318.5, 1568, 1760][i]), 904 + i * 8, 0, 0.4, 0.08, `Verificación de fila de anexos ${i + 1}`));
add('s7_segun_whoosh', 'text', 'whoosh', {f0: 800, f1: 3500, peak: 0.6}, Q.s7.segun, 0.3, 0.55, 0.13, '«SEGÚN CORRESPONDA» se despliega');
add('s7_segun_tone', 'ui', 'tone', {timbre: 'bell', index: 1.2, notes: [[0, 880, 0.6, 0.4], [0.07, 1318.5, 0.7, 0.4]], verb: 0.2}, Q.s7.segun, 0, 1.0, 0.16, 'Píldora «SEGÚN CORRESPONDA»');
add('s7_verify', 'ui', 'tone', ping([0, 1318.5], [0.1, 1975.5]), Q.s7.verify, 0, 1.3, 0.24, 'Sello de verificación (anillo + check)');
add('s7_verify_pad', 'ui', 'tone', chord([587.33, 880], 1.2), Q.s7.verify, 0, 1.4, 0.1, 'Confirmación final de documentos');
add('s7_out_retract', 'transitions', 'whoosh', {f0: 3200, f1: 400, peak: 0.35, pan0: 0.6, pan1: -0.6, body: 400}, Q.s7.out + 2, 0.24, 0.7, 0.15, 'Documentos se retraen para convertirse en tipografía');

// ── ESCENA 08 ── tipografía editorial
add('s8_bands_whoosh', 'transitions', 'whoosh', {f0: 600, f1: 5000, peak: 0.5, pan0: -0.5, pan1: 0.5}, 954, 0.5, 1.0, 0.17, 'Documentos → líneas guía tipográficas');
add('s8_bands_sub', 'transitions', 'sub', {f0: 40, f1: 56}, 954, 0.5, 1.0, 0.22, 'Transición de baja frecuencia');
add('s8_sin1_whoosh', 'text', 'whoosh', {f0: 900, f1: 3400, peak: 0.6}, Q.s8.sin1, 0.16, 0.3, 0.1, '«SIN» entra');
T('s8_sin1_tick', {f: 2000}, Q.s8.sin1 + 1, 0, 0.3, 0.13, 'Acento «SIN»');
add('s8_util_whoosh', 'text', 'whoosh', {f0: 700, f1: 3800, peak: 0.6}, Q.s8.utilidades, 0.27, 0.45, 0.17, '«UTILIDADES»: la banda se retira revelando la palabra (barrido tipográfico)');
T('s8_util_tick', {f: 2200}, Q.s8.utilidades + 2, 0, 0.3, 0.13, 'Acento «UTILIDADES»');
add('s8_ring_neq', 'graphics', 'whoosh', {f0: 500, f1: 6000, q: 2.6, peak: 0.9, pan0: -0.6, pan1: 0.6}, 1003, 0.95, 1.1, 0.13, 'Anillo → símbolo ≠ (morphing)');
add('s8_neq_hit', 'impacts', 'impact', {f: 60, noise: 0.4, tau: 0.35, tone: 1, toneHz: 587.33}, Q.s8.neq + 1, 0.02, 1.3, 0.66, 'Impacto sutil en el símbolo ≠');
add('s8_neq_sub', 'impacts', 'sub', {f0: 46, f1: 38}, Q.s8.neq + 1, 0.08, 1.2, 0.36, 'Acento de bajo del ≠');
add('s8_sin2_whoosh', 'text', 'whoosh', {f0: 1500, f1: 4500, peak: 0.55}, Q.s8.sin2 + 1, 0.15, 0.3, 0.11, 'Banda inferior se expande');
T('s8_sin2_tick', {f: 2000}, Q.s8.sin2, 0, 0.3, 0.13, 'Acento «SIN» inferior');
add('s8_oblig_whoosh', 'text', 'whoosh', {f0: 700, f1: 3800, peak: 0.6}, Q.s8.oblig, 0.27, 0.45, 0.17, '«OBLIGACIONES» se revela');
add('s8_oblig_tone', 'text', 'tone', chord([440, 587.33], 1.2), Q.s8.oblig, 0, 1.4, 0.1, 'Acento tonal en «OBLIGACIONES»');
add('s8_settle', 'text', 'tone', chord([293.66, 440, 659.25], 1.5), Q.s8.settle, 0, 1.8, 0.09, 'Composición final estable');
add('s8_to_brand_riser', 'transitions', 'riser', {f0: 300, f1: 6500, g0: 160, g1: 660, tonal: 0.24, shape: 2.4}, 1086, 0.85, 1.05, 0.2, 'Tonal riser hacia la marca');
add('s8_to_brand_sub', 'transitions', 'sub', {f0: 38, f1: 55}, 1086, 0.9, 1.4, 0.24, 'Transición de baja frecuencia hacia la marca');

// ── ESCENA 09 ── cierre de marca
add('s9_brand', 'brand', 'brand', {root: 146.83, tau: 1.2}, Q.s9.brand, 0.5, 3.4, 0.36, 'Revelación de la marca MHORIZON (acento corporativo original)', 0.3);
add('s9_brand_hit', 'impacts', 'impact', {f: 52, noise: 0.3, tau: 0.3}, Q.s9.brand, 0.02, 1.1, 0.4, 'Impacto suave de la marca');
add('s9_tu_whoosh', 'text', 'whoosh', {f0: 800, f1: 3600, peak: 0.6}, Q.s9.tu, 0.27, 0.48, 0.16, '«TU EMPRESA» entra');
T('s9_tu_tick', {f: 2100}, Q.s9.tu + 2, 0, 0.3, 0.13, 'Acento «TU EMPRESA»');
add('s9_aldia_whoosh', 'text', 'whoosh', {f0: 700, f1: 3600, peak: 0.65}, Q.s9.alDia, 0.22, 0.4, 0.16, '«AL DÍA» entra');
add('s9_aldia_hit', 'impacts', 'impact', {f: 58, noise: 0.3, tau: 0.26}, Q.s9.alDia, 0.02, 1.0, 0.46, 'Impacto suave en «AL DÍA»');
add('s9_corporate', 'brand', 'tone', chord([293.66, 369.99, 440, 659.25], 3.0), Q.s9.alDia + 1, 0, 3.4, 0.2, 'Acorde corporativo original (Re mayor add9) — fundido final', 0.5);

export const EVENTS: SfxEvent[] = EV.sort((a, b) => a.sync - b.sync);

/** Posición exacta en el timeline: fotograma de inicio + relleno sub-fotograma (en muestras). */
export function place(e: SfxEvent, sr = 48000) {
  const startSec = Math.max(0, e.sync / FPS - e.lead);
  const startFrame = Math.floor(startSec * FPS + 1e-9);
  const padSamples = Math.round((startSec - startFrame / FPS) * sr);
  const hit = e.sync / FPS - e.lead < 0 ? e.sync / FPS : e.lead;
  return {startSec, startFrame, padSamples, hit};
}
