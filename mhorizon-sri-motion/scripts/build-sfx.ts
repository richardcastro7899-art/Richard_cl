// Genera todos los efectos (síntesis), el índice para Remotion y las mezclas offline:
//   public/sfx/<id>.wav            efectos individuales (16-bit/48 kHz/estéreo)
//   src/sfx/generated.json         índice (fotograma de inicio, duración, volumen, fades…)
//   out/audio/MHORIZON_Sound_Design.wav   pista completa (PCM 24-bit/48 kHz/estéreo, 40,359125 s)
//   out/audio/stems/*.wav          una pista por categoría
//   out/audio/scenes/ScenesNN_SFX.wav     efectos por escena (cada archivo comienza en 0)
import fs from 'node:fs';
import path from 'node:path';
import {EVENTS, MASTER_GAIN, masterFade, place, CATEGORY_LABEL, Category} from '../src/sfx/manifest';
import {SR, synth} from '../src/sfx/synth';
import {AUDIO_SECONDS, FPS, SCENE_START, SCENE_END} from '../src/timing';

const root = path.resolve(__dirname, '..');
const dirs = ['public/sfx', 'out/audio/stems', 'out/audio/scenes', 'analysis'].map((d) => path.join(root, d));
dirs.forEach((d) => fs.mkdirSync(d, {recursive: true}));

const SPF = SR / FPS; // 1600 muestras por fotograma
const TOTAL_SAMPLES = Math.round(AUDIO_SECONDS * SR); // 1.937.238 — duración exacta de la locución de referencia

function wav(chL: Float32Array, chR: Float32Array, bits: 16 | 24): Buffer {
  const n = chL.length;
  const bps = bits / 8;
  const buf = Buffer.alloc(44 + n * 2 * bps);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 2 * bps, 4); buf.write('WAVE', 8); buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2 * bps, 28); buf.writeUInt16LE(2 * bps, 32); buf.writeUInt16LE(bits, 34); buf.write('data', 36); buf.writeUInt32LE(n * 2 * bps, 40);
  let o = 44;
  const max = bits === 16 ? 32767 : 8388607;
  for (let i = 0; i < n; i++) {
    for (const ch of [chL, chR]) {
      const v = Math.max(-1, Math.min(1, ch[i])) * max;
      const q = Math.round(v);
      if (bits === 16) buf.writeInt16LE(q, o); else buf.writeIntLE(q, o, 3);
      o += bps;
    }
  }
  return buf;
}

const stems: Record<Category, [Float32Array, Float32Array]> = {} as any;
(Object.keys(CATEGORY_LABEL) as Category[]).forEach((c) => (stems[c] = [new Float32Array(TOTAL_SAMPLES), new Float32Array(TOTAL_SAMPLES)]));

const index: any[] = [];
const rows = ['id,categoria,fotograma_sync,fotograma_inicio,tiempo_inicio_s,duracion_fotogramas,volumen,fade_in_s,fade_out_s,receta,elemento_visual'];
for (const e of EVENTS) {
  const pl = place(e);
  const [L, R] = synth(e.recipe, e.params, e.id, e.dur, pl.hit, pl.padSamples);
  // Fundidos del evento (fade in / fade out) integrados en el archivo: así Remotion y la mezcla offline coinciden.
  const fi = Math.max(1, Math.round(e.fadeIn * SR));
  const fo = Math.max(1, Math.round(e.fadeOut * SR));
  for (let i = 0; i < L.length; i++) {
    const g = Math.min(1, Math.max(0, (i - pl.padSamples) / fi)) * Math.min(1, (L.length - i) / fo);
    L[i] *= i < pl.padSamples ? 1 : g;
    R[i] *= i < pl.padSamples ? 1 : g;
  }
  fs.writeFileSync(path.join(root, 'public/sfx', `${e.id}.wav`), wav(L, R, 16));
  const lenFrames = Math.ceil(L.length / SPF);
  index.push({id: e.id, file: `sfx/${e.id}.wav`, cat: e.cat, startFrame: pl.startFrame, durationInFrames: lenFrames, vol: e.vol, fadeIn: e.fadeIn, fadeOut: e.fadeOut, sync: e.sync, visual: e.visual});
  rows.push([e.id, CATEGORY_LABEL[e.cat], e.sync, pl.startFrame, (pl.startFrame / FPS).toFixed(3), lenFrames, e.vol, e.fadeIn, e.fadeOut, e.recipe, `"${e.visual}"`].join(','));
  // mezcla (misma fórmula que el componente <Sound/>: vol · MASTER · fundido final)
  const base = pl.startFrame * SPF;
  for (let i = 0; i < L.length; i++) {
    const idx = base + i;
    if (idx >= TOTAL_SAMPLES) break;
    const g = e.vol * MASTER_GAIN * masterFade(idx / SPF);
    stems[e.cat][0][idx] += L[i] * g;
    stems[e.cat][1][idx] += R[i] * g;
  }
}
fs.writeFileSync(path.join(root, 'src/sfx/generated.json'), JSON.stringify(index, null, 1));
fs.writeFileSync(path.join(root, 'analysis/sfx_events.csv'), rows.join('\n') + '\n');

// Master = suma de pistas
const mL = new Float32Array(TOTAL_SAMPLES), mR = new Float32Array(TOTAL_SAMPLES);
let peak = 0;
for (const c of Object.keys(stems) as Category[]) {
  for (let i = 0; i < TOTAL_SAMPLES; i++) { mL[i] += stems[c][0][i]; mR[i] += stems[c][1][i]; }
  fs.writeFileSync(path.join(root, 'out/audio/stems', `MHORIZON_SFX_${CATEGORY_LABEL[c].replace(/\s+/g, '_')}.wav`), wav(stems[c][0], stems[c][1], 24));
}
for (let i = 0; i < TOTAL_SAMPLES; i++) peak = Math.max(peak, Math.abs(mL[i]), Math.abs(mR[i]));
console.log(`eventos: ${EVENTS.length} · pico master: ${(20 * Math.log10(peak)).toFixed(2)} dBFS`);
if (peak > 0.89) console.warn('⚠ pico elevado: reducir MASTER_GAIN');
fs.writeFileSync(path.join(root, 'out/audio/MHORIZON_Sound_Design.wav'), wav(mL, mR, 24));
// Escenas
SCENE_START.forEach((s, i) => {
  const a = s * SPF, b = Math.min(TOTAL_SAMPLES, SCENE_END[i] * SPF);
  const len = SCENE_END[i] * SPF - a; // longitud en fotogramas completos (rellena con silencio si hace falta)
  const L = new Float32Array(len), R = new Float32Array(len);
  L.set(mL.slice(a, b)); R.set(mR.slice(a, b));
  const f = Math.round(0.012 * SR);
  for (let k = 0; k < f; k++) { const w = k / f; if (i > 0) { L[k] *= w; R[k] *= w; } if (i < 8) { L[L.length - 1 - k] *= w; R[R.length - 1 - k] *= w; } }
  fs.writeFileSync(path.join(root, 'out/audio/scenes', `Scene${String(i + 1).padStart(2, '0')}_SFX.wav`), wav(L, R, 24));
});
console.log('listo');
