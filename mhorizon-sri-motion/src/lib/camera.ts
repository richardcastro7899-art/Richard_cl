import {spline} from './anim';

// Cámara 2.5D muy contenida: deriva lenta para dar profundidad sin distraer.
type K = [number, number, number, number, number, number, number, number]; // f, rx, ry, rz, tx, ty, tz, s
const KEYS: K[] = [
  [0, 5, -3, 0, 0, 10, -60, 1],
  [140, 2, 1.5, 0, 0, 0, 10, 1],
  [238, 1, -1.5, 0, 0, 0, 20, 1],
  [414, 3, 1.5, 0, 0, 0, 10, 1],
  [463, 0, 0, 0, 0, 0, 30, 1],
  [560, 3, -2, 0, 0, 0, 0, 1],
  [660, 1, 0, 0, 0, 0, 10, 1],
  [740, 3, 2.5, 0, 0, 0, 20, 1],
  [809, 2, 0, 0, 0, 0, 0, 1],
  [880, 3, -2, 0, 0, 0, 20, 1],
  [936, 1, 0, 0, 0, 0, 10, 1],
  [1081, 0, 0, 0, 0, 0, 0, 1],
  [1211, 0, 0, 0, 0, 0, 30, 1],
];

export function cam(f: number) {
  const col = (i: number) => spline(f, KEYS.map((k) => [k[0], k[i]] as [number, number]));
  return {rx: col(1), ry: col(2), rz: col(3), tx: col(4), ty: col(5), tz: col(6), s: col(7)};
}
