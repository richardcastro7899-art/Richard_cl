import {spline} from './anim';

type K = [number, number, number, number, number, number, number, number]; // f, rx, ry, rz, tx, ty, tz, s
const KEYS: K[] = [
  [0, 13, -8, 0, 0, 30, -220, 1],
  [40, 9, -3, 0.4, 0, 10, -80, 1],
  [88, 5, 3, 0, 0, 0, 10, 1],
  [138, 2, 1, 0, 0, 0, 0, 1],
  [165, -1, 0, -0.8, 0, 0, 90, 1],
  [205, 0, 1, 0, 0, 0, 120, 1],
  [238, 3, -4, 0.5, 0, 0, 30, 1],
  [300, 6, 3, 0, 0, 10, 0, 1],
  [380, 4, -2, 0, 0, 0, 20, 1],
  [414, 0, 0, 0, 0, 0, 50, 1],
  [438, 0, 0, 0, 0, 0, 150, 1],
  [452, 0, 0, 0, 0, 0, 90, 1],
  [463, 2, 0, 0, 0, 0, 20, 1],
  [520, 5, -3, 0, 0, 0, 0, 1],
  [600, 3, 3, 0, 0, 0, 10, 1],
  [660, 0, 0, 0, 0, 0, 0, 1],
  [700, 6, 6, 0, 0, 0, 20, 1],
  [760, 4, -5, 0, 0, 0, 10, 1],
  [809, 8, 0, 0, 0, 0, -20, 1],
  [870, 10, -6, 0, 0, 0, 20, 1],
  [936, 4, 4, 0, 0, 0, 0, 1],
  [1000, 2, -2, 0, 0, 0, 40, 1],
  [1081, 0, 0, 0, 0, 0, 0, 1],
  [1150, 1, 0, 0, 0, 0, 50, 1],
  [1211, 0, 0, 0, 0, 0, 70, 1],
];

const SHAKES = [29, 161, 199, 282, 436, 506, 584, 1001, 1086];
function shake(f: number): [number, number] {
  let x = 0;
  let y = 0;
  for (const s of SHAKES) {
    const d = f - s;
    if (d < 0 || d > 14) continue;
    const a = Math.exp(-d / 3.2) * 7;
    x += Math.sin(d * 2.4) * a;
    y += Math.cos(d * 3.1) * a * 0.7;
  }
  return [x, y];
}

export function cam(f: number) {
  const col = (i: number) => spline(f, KEYS.map((k) => [k[0], k[i]] as [number, number]));
  const [sx, sy] = shake(f);
  return {rx: col(1), ry: col(2), rz: col(3), tx: col(4) + sx, ty: col(5) + sy, tz: col(6), s: col(7)};
}
