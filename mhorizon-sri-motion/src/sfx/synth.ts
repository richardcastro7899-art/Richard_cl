// ─────────────────────────────────────────────────────────────────────────────
// Motor de síntesis de efectos MHORIZON (100 % original, sin muestras de terceros).
// Osciladores, ruido filtrado, FM, envolventes y reverb algorítmica (Freeverb).
// Determinista: cada efecto usa una semilla derivada de su id.
// ─────────────────────────────────────────────────────────────────────────────
export const SR = 48000;
export type Stereo = [Float32Array, Float32Array];

export function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
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

const TAU = Math.PI * 2;
const mk = (n: number) => new Float32Array(n);

/** Biquad RBJ con frecuencia variable en el tiempo (actualiza coeficientes cada 24 muestras). */
function filter(x: Float32Array, type: 'lp' | 'hp' | 'bp', fc: (t: number) => number, q = 0.707): Float32Array {
  const y = mk(x.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  let b0 = 0, b1 = 0, b2 = 0, a1 = 0, a2 = 0;
  for (let i = 0; i < x.length; i++) {
    if (i % 24 === 0) {
      const f = Math.min(SR * 0.45, Math.max(20, fc(i / SR)));
      const w = (TAU * f) / SR;
      const cs = Math.cos(w);
      const al = Math.sin(w) / (2 * q);
      let a0 = 1 + al;
      if (type === 'lp') { b0 = (1 - cs) / 2; b1 = 1 - cs; b2 = (1 - cs) / 2; }
      else if (type === 'hp') { b0 = (1 + cs) / 2; b1 = -(1 + cs); b2 = (1 + cs) / 2; }
      else { b0 = al; b1 = 0; b2 = -al; }
      a1 = (-2 * cs) / a0; a2 = (1 - al) / a0; b0 /= a0; b1 /= a0; b2 /= a0;
    }
    const v = b0 * x[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
    x2 = x1; x1 = x[i]; y2 = y1; y1 = v;
    y[i] = v;
  }
  return y;
}

function whiteNoise(n: number, r: () => number) {
  const o = mk(n);
  for (let i = 0; i < n; i++) o[i] = r() * 2 - 1;
  return o;
}

/** Envolvente con pico en `peak` (0..1) y curvas de ataque/caída. */
const bell = (t01: number, peak: number, aExp: number, dExp: number) =>
  t01 < peak ? Math.pow(Math.max(0, t01 / peak), aExp) : Math.pow(Math.max(0, 1 - (t01 - peak) / (1 - peak)), dExp);

function pan(mono: Float32Array, p0: number, p1: number): Stereo {
  const L = mk(mono.length), R = mk(mono.length);
  for (let i = 0; i < mono.length; i++) {
    const p = p0 + (p1 - p0) * (i / mono.length);
    const th = ((p + 1) * Math.PI) / 4;
    L[i] = mono[i] * Math.cos(th);
    R[i] = mono[i] * Math.sin(th);
  }
  return [L, R];
}
const dual = (m: Float32Array): Stereo => [m, Float32Array.from(m)];

// ── Reverb Freeverb estéreo ──
function reverb(st: Stereo, wet: number, room = 0.84, damp = 0.25): Stereo {
  if (wet <= 0.001) return st;
  const scale = SR / 44100;
  const combT = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617].map((d) => Math.round(d * scale));
  const apT = [556, 441, 341, 225].map((d) => Math.round(d * scale));
  const run = (inp: Float32Array, spread: number) => {
    const out = mk(inp.length);
    const combs = combT.map((d) => ({buf: mk(d + spread), i: 0, s: 0}));
    const aps = apT.map((d) => ({buf: mk(d + spread), i: 0}));
    for (let n = 0; n < inp.length; n++) {
      const x = inp[n] * 0.015;
      let sum = 0;
      for (const c of combs) {
        const o = c.buf[c.i];
        c.s = o * (1 - damp) + c.s * damp;
        c.buf[c.i] = x + c.s * room;
        c.i = (c.i + 1) % c.buf.length;
        sum += o;
      }
      for (const a of aps) {
        const b = a.buf[a.i];
        const o = -sum + b;
        a.buf[a.i] = sum + b * 0.5;
        a.i = (a.i + 1) % a.buf.length;
        sum = o;
      }
      out[n] = sum;
    }
    return out;
  };
  const tail = Math.round(SR * (0.35 + wet * 3));
  const mkp = (a: Float32Array) => { const b = mk(a.length + tail); b.set(a); return b; };
  const l = mkp(st[0]), r = mkp(st[1]);
  const wl = run(l, 0), wr = run(r, 23);
  const L = mk(l.length), R = mk(r.length);
  for (let i = 0; i < l.length; i++) {
    L[i] = l[i] * (1 - wet * 0.35) + wl[i] * wet * 1.8;
    R[i] = r[i] * (1 - wet * 0.35) + wr[i] * wet * 1.8;
  }
  return [L, R];
}

export type Ctx = {dur: number; hit: number; r: () => number}; // dur y hit en segundos (hit = instante de ancla dentro del archivo)
export type P = Record<string, any>;

// ── RECETAS ──────────────────────────────────────────────────────────────────

/** Barrido de aire/whoosh direccional: ruido en banda con frecuencia, paneo y envolvente controlados. */
function whoosh(c: Ctx, p: P): Stereo {
  const n = Math.round(c.dur * SR);
  const f0 = p.f0 ?? 400, f1 = p.f1 ?? 3200, q = p.q ?? 1.1;
  const nz = whiteNoise(n, c.r);
  const lg = Math.log(f1 / f0);
  const dir = filter(nz, 'bp', (t) => f0 * Math.exp(lg * Math.pow(Math.min(1, t / c.dur), p.curve ?? 1)), q);
  const body = p.body ? filter(nz, 'lp', () => p.body, 0.7) : null;
  const y = mk(n);
  const peak = p.peak ?? c.hit / c.dur;
  for (let i = 0; i < n; i++) {
    const e = bell(i / n, Math.min(0.95, Math.max(0.05, peak)), p.a ?? 1.8, p.d ?? 2.2);
    y[i] = (dir[i] + (body ? body[i] * (p.bodyMix ?? 0.25) : 0)) * e;
  }
  return reverb(pan(y, p.pan0 ?? -0.5, p.pan1 ?? 0.5), p.verb ?? 0.12);
}

/** Aire suave: ruido pasa-altos muy ligero (transiciones ambientales). */
function air(c: Ctx, p: P): Stereo {
  const n = Math.round(c.dur * SR);
  const nz = whiteNoise(n, c.r);
  const hp = filter(nz, 'hp', (t) => (p.f0 ?? 1800) + t * (p.drift ?? 0), 0.6);
  const lp = filter(hp, 'lp', (t) => (p.f1 ?? 9000) * (0.6 + 0.4 * Math.sin(Math.PI * Math.min(1, t / c.dur))), 0.6);
  for (let i = 0; i < n; i++) lp[i] *= bell(i / n, c.hit / c.dur, 2.2, 2.4);
  return reverb(pan(lp, p.pan0 ?? -0.3, p.pan1 ?? 0.3), p.verb ?? 0.25);
}

/** Notas con timbres suaves: bell (FM), soft (aditivo), pluck. Cada nota: [t, hz, dur, ganancia]. */
function tone(c: Ctx, p: P): Stereo {
  const n = Math.round(c.dur * SR);
  const y = mk(n);
  const notes: number[][] = p.notes;
  for (const [t0, f, d, g] of notes) {
    const s0 = Math.round(t0 * SR);
    const len = Math.min(n - s0, Math.round(d * SR));
    const att = Math.max(1, Math.round((p.attack ?? 0.004) * SR));
    for (let i = 0; i < len; i++) {
      const t = i / SR;
      const env = Math.min(1, i / att) * Math.exp(-t / (d * (p.decay ?? 0.32)));
      let v: number;
      if (p.timbre === 'bell') {
        const idx = (p.index ?? 2.2) * Math.exp(-t / (d * 0.18));
        v = Math.sin(TAU * f * t + idx * Math.sin(TAU * f * (p.ratio ?? 3.5) * t));
      } else if (p.timbre === 'pluck') {
        v = Math.sin(TAU * f * t) + 0.35 * Math.sin(TAU * 2 * f * t) * Math.exp(-t * 18) + 0.15 * Math.sin(TAU * 3 * f * t) * Math.exp(-t * 30);
      } else {
        v = Math.sin(TAU * f * t) + 0.22 * Math.sin(TAU * 2 * f * t + 0.5) + 0.07 * Math.sin(TAU * 3 * f * t);
      }
      const idx2 = s0 + i;
      if (idx2 < n) y[idx2] += v * env * g;
    }
  }
  return reverb(pan(y, p.pan0 ?? -0.1, p.pan1 ?? 0.1), p.verb ?? 0.2);
}

/** Impacto suave: golpe grave con caída de tono + soplo de ruido filtrado + cola. */
function impact(c: Ctx, p: P): Stereo {
  const n = Math.round(c.dur * SR);
  const y = mk(n);
  const s0 = Math.round(c.hit * SR);
  const f = p.f ?? 62;
  const nz = filter(whiteNoise(n, c.r), 'lp', (t) => (p.noiseHz ?? 900) * Math.exp(-Math.max(0, t - c.hit) * 6) + 120, 0.8);
  let ph = 0;
  for (let i = s0; i < n; i++) {
    const t = (i - s0) / SR;
    const fr = f * (1 + (p.drop ?? 1.1) * Math.exp(-t * 22));
    ph += (TAU * fr) / SR;
    const env = Math.min(1, t / 0.004) * Math.exp(-t / (p.tau ?? 0.22));
    y[i] += Math.sin(ph) * env;
    y[i] += nz[i] * (p.noise ?? 0.35) * Math.min(1, t / 0.002) * Math.exp(-t / 0.09);
    y[i] += (p.tone ?? 0) * Math.sin(TAU * (p.toneHz ?? 392) * t) * Math.exp(-t / 0.35) * 0.4;
  }
  return reverb(dual(y), p.verb ?? 0.22);
}

/** Swell inverso (reverse swell / tonal riser): ruido con filtro ascendente + glissando, corte limpio en `hit`. */
function riser(c: Ctx, p: P): Stereo {
  const n = Math.round(c.dur * SR);
  const hit = Math.round(c.hit * SR);
  const nz = whiteNoise(n, c.r);
  const f0 = p.f0 ?? 300, f1 = p.f1 ?? 5200;
  const fl = filter(nz, 'bp', (t) => f0 * Math.pow(f1 / f0, Math.min(1, t / c.hit)), p.q ?? 1.4);
  const y = mk(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t01 = Math.min(1, i / hit);
    let e = i < hit ? Math.pow(t01, p.shape ?? 2.4) : Math.exp(-(i - hit) / SR / 0.12);
    const gl = (p.g0 ?? 180) * Math.pow((p.g1 ?? 720) / (p.g0 ?? 180), Math.min(1, i / hit));
    ph += (TAU * gl) / SR;
    y[i] = (fl[i] * (p.noiseMix ?? 0.8) + Math.sin(ph) * (p.tonal ?? 0.25)) * e;
  }
  return reverb(pan(y, p.pan0 ?? -0.3, p.pan1 ?? 0.3), p.verb ?? 0.2);
}

/** Trazado de línea / datos: glissando fino con granulado de pulsos. */
function trace(c: Ctx, p: P): Stereo {
  const n = Math.round(c.dur * SR);
  const y = mk(n);
  let ph = 0;
  const f0 = p.f0 ?? 500, f1 = p.f1 ?? 1800;
  for (let i = 0; i < n; i++) {
    const t01 = i / n;
    const fr = f0 * Math.pow(f1 / f0, p.curve === 'ease' ? t01 * t01 : t01);
    ph += (TAU * fr) / SR;
    const e = Math.min(1, t01 / 0.08) * Math.min(1, (1 - t01) / 0.2);
    const grain = 0.55 + 0.45 * Math.sign(Math.sin(TAU * (p.rate ?? 38) * (i / SR))) ;
    y[i] = Math.sin(ph) * e * (p.grain ? grain : 1);
  }
  const hp = filter(y, 'hp', () => 300, 0.7);
  return reverb(pan(hp, p.pan0 ?? -0.4, p.pan1 ?? 0.4), p.verb ?? 0.15);
}

/** Procesado de datos: ráfagas de blips cuantizados a una escala pentatónica. */
function data(c: Ctx, p: P): Stereo {
  const n = Math.round(c.dur * SR);
  const scale = [0, 2, 4, 7, 9];
  const base = p.base ?? 523.25;
  const notes: number[][] = [];
  const step = 1 / (p.rate ?? 14);
  for (let t = 0, k = 0; t < c.dur - 0.08; t += step * (0.75 + c.r() * 0.5), k++) {
    const deg = scale[Math.floor(c.r() * 5)] + (c.r() > 0.7 ? 12 : 0);
    const env = Math.sin(Math.PI * Math.min(1, t / c.dur));
    notes.push([t, base * Math.pow(2, deg / 12), 0.07, 0.35 + 0.65 * env]);
  }
  return tone({...c, dur: c.dur}, {notes, timbre: 'pluck', decay: 0.4, verb: p.verb ?? 0.18, pan0: -0.35, pan1: 0.35});
}

/** Clic de interfaz: transitorio de ruido filtrado + tono corto. */
function tick(c: Ctx, p: P): Stereo {
  const n = Math.round(c.dur * SR);
  const y = mk(n);
  const s0 = Math.round(c.hit * SR);
  const nz = filter(whiteNoise(n, c.r), 'bp', () => p.noiseHz ?? 4200, 2.2);
  for (let i = s0; i < n; i++) {
    const t = (i - s0) / SR;
    y[i] = nz[i] * Math.exp(-t / 0.004) * 0.7 + Math.sin(TAU * (p.f ?? 2300) * t) * Math.exp(-t / (p.tau ?? 0.018)) * 0.6;
  }
  return reverb(pan(y, p.pan ?? 0, p.pan ?? 0), p.verb ?? 0.1);
}

/** Sonido de documento/papel: soplo de ruido medio con golpe suave. */
function paper(c: Ctx, p: P): Stereo {
  const n = Math.round(c.dur * SR);
  const nz = whiteNoise(n, c.r);
  const mid = filter(nz, 'bp', (t) => 1100 + 2200 * Math.min(1, t / c.dur), 0.9);
  const y = mk(n);
  const s0 = Math.round(c.hit * SR);
  for (let i = 0; i < n; i++) {
    y[i] = mid[i] * bell(i / n, c.hit / c.dur, 1.6, 2.4) * 0.8;
    if (i >= s0) {
      const t = (i - s0) / SR;
      y[i] += Math.sin(TAU * (p.thump ?? 140) * t) * Math.exp(-t / 0.05) * 0.55;
    }
  }
  return reverb(pan(y, p.pan0 ?? 0.5, p.pan1 ?? -0.2), p.verb ?? 0.12);
}

/** Shimmer corporativo (revelación de marca): acorde aditivo con ataque suave y brillo. */
function brand(c: Ctx, p: P): Stereo {
  const n = Math.round(c.dur * SR);
  const y = mk(n);
  const root = p.root ?? 146.83; // Re (D3)
  const partials: Array<[number, number]> = [[1, 0.6], [2, 0.5], [3, 0.28], [1.5, 0.35], [2.5 * 1.0, 0.22], [4, 0.16], [6, 0.08], [3.0 * 1.25, 0.14]];
  const s0 = Math.round(c.hit * SR);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const tt = t - c.hit;
    const att = t < c.hit ? Math.pow(t / c.hit, 3) * 0.35 : 1;
    const dec = tt > 0 ? Math.exp(-tt / (p.tau ?? 1.1)) : 1;
    let v = 0;
    for (const [m, g] of partials) {
      const det = 1 + 0.0012 * Math.sin(i * 0.00013 * m);
      v += Math.sin(TAU * root * m * det * t) * g;
    }
    // chispa aguda en el golpe
    if (i >= s0) v += Math.sin(TAU * 2349.3 * tt) * Math.exp(-tt / 0.25) * 0.18 + Math.sin(TAU * 3135.9 * tt) * Math.exp(-tt / 0.18) * 0.1;
    y[i] = v * att * dec * Math.min(1, (n - i) / (0.15 * SR));
  }
  return reverb(pan(y, -0.15, 0.15), p.verb ?? 0.3);
}

/** Sub grave (transición de baja frecuencia / acento de bajo). */
function sub(c: Ctx, p: P): Stereo {
  const n = Math.round(c.dur * SR);
  const y = mk(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t01 = i / n;
    const f = (p.f0 ?? 42) * Math.pow((p.f1 ?? 58) / (p.f0 ?? 42), t01);
    ph += (TAU * f) / SR;
    y[i] = Math.sin(ph) * bell(t01, c.hit / c.dur, 2.0, 2.0) + 0.18 * Math.sin(ph * 2) * bell(t01, c.hit / c.dur, 2.0, 2.4);
  }
  return dual(y);
}

export type Recipe = 'whoosh' | 'air' | 'tone' | 'impact' | 'riser' | 'trace' | 'data' | 'tick' | 'paper' | 'brand' | 'sub';
const RECIPES: Record<Recipe, (c: Ctx, p: P) => Stereo> = {whoosh, air, tone, impact, riser, trace, data, tick, paper, brand, sub};

export function synth(recipe: Recipe, params: P, id: string, durSec: number, hitSec: number, padSamples = 0): Stereo {
  const r = rng(hashStr(id));
  const raw = RECIPES[recipe]({dur: durSec, hit: hitSec, r}, params);
  // Normalización de pico y microfundidos anti-click; relleno inicial para precisión sub-fotograma
  let pk = 1e-9;
  for (const ch of raw) for (let i = 0; i < ch.length; i++) pk = Math.max(pk, Math.abs(ch[i]));
  const g = 0.89 / pk;
  const len = raw[0].length;
  const L = mk(len + padSamples), R = mk(len + padSamples);
  const fi = Math.round(0.002 * SR);
  const fo = Math.round(0.12 * SR);
  for (let i = 0; i < len; i++) {
    const w = Math.min(1, i / fi) * Math.min(1, (len - i) / fo);
    L[i + padSamples] = raw[0][i] * g * w;
    R[i + padSamples] = raw[1][i] * g * w;
  }
  return [L, R];
}
