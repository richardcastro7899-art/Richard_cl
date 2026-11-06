import {Easing} from 'remotion';

export type EaseFn = (t: number) => number;
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Curvas de movimiento propias (cubic-bezier)
export const E = {
  lin: (t: number) => t,
  outC: Easing.bezier(0.215, 0.61, 0.355, 1),
  inC: Easing.bezier(0.55, 0.055, 0.675, 0.19),
  ioC: Easing.bezier(0.645, 0.045, 0.355, 1),
  outExpo: Easing.bezier(0.16, 1, 0.3, 1),
  inExpo: Easing.bezier(0.7, 0, 0.84, 0),
  ioExpo: Easing.bezier(0.87, 0, 0.13, 1),
  outQuint: Easing.bezier(0.22, 1, 0.36, 1),
  ioQuart: Easing.bezier(0.76, 0, 0.24, 1),
  outBack: Easing.bezier(0.34, 1.56, 0.64, 1),
  anticip: Easing.bezier(0.36, -0.4, 0.64, 1), // retroceso previo (anticipación)
  snap: Easing.bezier(0.7, 0, 0.2, 1),
} as const;

/** Progreso 0..1 de [start, start+dur] con una curva. */
export const P = (f: number, start: number, dur: number, e: EaseFn = E.outC) =>
  e(clamp((f - start) / Math.max(1, dur)));

/** Interpolación por keyframes; la curva de cada tramo se declara en el keyframe de llegada. */
export function kf(f: number, keys: Array<[number, number, EaseFn?]>): number {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [f1, v1, e] = keys[i];
    const [f0, v0] = keys[i - 1];
    if (f <= f1) return lerp(v0, v1, (e ?? E.ioC)(clamp((f - f0) / Math.max(1e-6, f1 - f0))));
  }
  return keys[keys.length - 1][1];
}

/** Interpolación Catmull-Rom (velocidad continua) para cámara. */
export function spline(f: number, keys: Array<[number, number]>): number {
  const n = keys.length;
  if (f <= keys[0][0]) return keys[0][1];
  if (f >= keys[n - 1][0]) return keys[n - 1][1];
  let i = 0;
  while (i < n - 2 && f > keys[i + 1][0]) i++;
  const [f0, v0] = keys[i];
  const [f1, v1] = keys[i + 1];
  const [fp, vp] = keys[Math.max(0, i - 1)];
  const [fn, vn] = keys[Math.min(n - 1, i + 2)];
  const h = f1 - f0;
  const t = (f - f0) / h;
  const m0 = ((v1 - vp) / Math.max(1, f1 - fp)) * h;
  const m1 = ((vn - v0) / Math.max(1, fn - f0)) * h;
  const t2 = t * t;
  const t3 = t2 * t;
  return (2 * t3 - 3 * t2 + 1) * v0 + (t3 - 2 * t2 + t) * m0 + (-2 * t3 + 3 * t2) * v1 + (t3 - t2) * m1;
}

/** Ruido determinista (0..1) para microanimaciones. */
export function rnd(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** Pulso suave 0..1..0 */
export const pulse = (f: number, start: number, dur: number) => {
  const t = clamp((f - start) / dur);
  return Math.sin(t * Math.PI);
};
