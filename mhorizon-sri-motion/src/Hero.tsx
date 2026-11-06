import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from './lib/theme';
import {E, P, kf, clamp} from './lib/anim';
import {Pt, Shape, arc, catmull, lerpPts, partial, resample, seg, toPath} from './lib/geometry';
import {Svg} from './lib/stage';
import {Q} from './timing';

const N = 72;
const rs = (p: Pt[]) => resample(p, N);

// ── Forma 1: línea de rendimiento (coordenadas locales de la tarjeta) ──
export const CHART_KEYS: Pt[] = [
  [-370, -215], [-300, -185], [-235, -226], [-160, -140], [-95, -168], [-25, -60], [40, -92], [110, 30], [175, -12], [250, 110], [320, 78], [372, 205],
];
export const chartLine = rs(catmull(CHART_KEYS, 16));

// ── Forma 2: señal de advertencia abstracta (3 aristas) ──
const apex: Pt = [0, -215];
const bl: Pt = [-235, 175];
const br: Pt = [235, 175];
const TRI: Shape = [rs(seg(bl, apex)), rs(seg(apex, br)), rs(seg(br, bl))];

// ── Forma 3: símbolo ≠ (diagonal + dos barras) ──
const NEQ: Shape = [rs(seg([-88, 150], [88, -150])), rs(seg([-172, -55], [172, -55])), rs(seg([172, 55], [-172, 55]))];

// ── Forma 4: anillo en tres arcos (el "cero" / nodo / sello) ──
const RING: Shape = [rs(arc(0, 0, 150, -80, 20)), rs(arc(0, 0, 150, 40, 140)), rs(arc(0, 0, 150, 160, 260))];

// ── Forma 5: horizonte con sol naciente (cierre de marca) ──
const HORIZON: Shape = [rs(arc(0, 0, 105, 180, 360)), rs(seg([-430, 0], [-120, 0])), rs(seg([430, 0], [120, 0]))];

const SHAPES: Record<string, Shape> = {
  chart: [chartLine, chartLine, chartLine], tri: TRI, neq: NEQ, ring: RING, horizon: HORIZON,
};

type Seg = {f0: number; f1: number; from: keyof typeof SHAPES; to: keyof typeof SHAPES};
export const MORPHS: Seg[] = [
  {f0: Q.s1.morph, f1: Q.s1.morph + 36, from: 'chart', to: 'tri'},
  {f0: 224, f1: 258, from: 'tri', to: 'neq'},
  {f0: 398, f1: 434, from: 'neq', to: 'ring'},
  {f0: 972, f1: 1004, from: 'ring', to: 'neq'},
  {f0: Q.s9.horizon, f1: Q.s9.horizon + 38, from: 'neq', to: 'horizon'},
];

export function heroShape(f: number): Shape {
  let cur: Shape = SHAPES.chart;
  for (const m of MORPHS) {
    if (f >= m.f1) cur = SHAPES[m.to];
    else if (f >= m.f0) {
      return SHAPES[m.from].map((s, i) => {
        const t = E.ioC(clamp((f - m.f0 - i * 4) / (m.f1 - m.f0 - 8)));
        return lerpPts(s, SHAPES[m.to][i], t);
      });
    }
  }
  return cur;
}

export function heroXform(f: number) {
  const x = kf(f, [[0, 540], [Q.s1.morph, 540], [176, 540], [224, 540], [258, 540], [430, 540, E.ioC], [470, 190, E.ioQuart], [640, 190], [676, 540, E.ioQuart], [784, 540], [822, 900, E.ioQuart], [936, 900], [978, 540, E.ioQuart], [1211, 540]]);
  const y = kf(f, [
    [0, 1090], [Q.s1.morph, 1090], [178, 700, E.ioQuart], [224, 700], [258, 566, E.ioC], [398, 566], [436, 900, E.ioQuart],
    [463, 900], [506, 966, E.ioQuart], [640, 966], [676, 930, E.ioQuart], [784, 930], [822, 330, E.ioQuart], [936, 330], [978, 890, E.ioQuart], [1062, 890], [1098, 690, E.ioQuart], [1211, 690],
  ]);
  const s = kf(f, [
    [0, 1], [Q.s1.morph, 1], [178, 1.22, E.ioQuart], [224, 1.22], [258, 0.82, E.ioC], [398, 0.82], [430, 1.2, E.ioC], [446, 0.84, E.ioC], [454, 1.5, E.outExpo],
    [463, 1.5], [506, 0.5, E.ioQuart], [640, 0.5], [676, 0.36, E.ioQuart], [784, 0.36], [822, 0.26, E.ioC], [936, 0.26], [978, 0.7, E.ioQuart], [1004, 1.45, E.outBack], [1062, 1.4], [1098, 1.04, E.ioQuart], [1211, 1.04],
  ]);
  const rot = kf(f, [[0, 0], [434, 0], [972, 360, E.ioC], [1211, 360]]);
  const sw = kf(f, [[0, 8], [Q.s1.morph, 8], [178, 15, E.ioC], [224, 15], [258, 19, E.ioC], [398, 19], [434, 12, E.ioC], [972, 12], [1004, 18, E.ioC], [1062, 18], [1098, 6, E.ioC]]);
  const o = kf(f, [[0, 1], [1211, 1]]);
  return {x, y, s, rot, sw, o};
}

/** Transforma un punto local del héroe a coordenadas de lienzo. */
export function heroToStage(f: number, p: Pt): Pt {
  const h = heroXform(f);
  const a = (h.rot * Math.PI) / 180;
  const px = p[0] * h.s;
  const py = p[1] * h.s;
  return [h.x + px * Math.cos(a) - py * Math.sin(a), h.y + px * Math.sin(a) + py * Math.cos(a)];
}

export const chartDraw = (f: number) => P(f, Q.s1.lineA, Q.s1.lineB - Q.s1.lineA, E.ioC);

/** Elemento héroe persistente: una línea vectorial que se transforma a lo largo de toda la pieza. */
export const Hero: React.FC = () => {
  const f = useCurrentFrame();
  const shape = heroShape(f);
  const h = heroXform(f);
  const draw = f < Q.s1.morph ? chartDraw(f) : 1;
  const flash = Math.exp(-Math.max(0, f - 161) / 7) * (f >= 161 ? 1 : 0);
  const impact = [Q.s3.neq + 12, 1004, 506].reduce((a, k) => a + (f >= k ? Math.exp(-(f - k) / 6) : 0), 0);
  const col = C.orange;
  const glowW = (h.sw + 26 + flash * 30 + impact * 10) / h.s;
  return (
    <Svg>
      <g transform={`translate(${h.x} ${h.y}) rotate(${h.rot}) scale(${h.s})`} opacity={h.o}>
        {(f <= Q.s1.morph ? shape.slice(0, 1) : shape).map((pts, i) => {
          const d = toPath(partial(pts, draw));
          return (
            <g key={i}>
              <path d={d} fill="none" stroke={col} strokeOpacity={0.14 + flash * 0.18} strokeWidth={glowW} strokeLinecap="round" strokeLinejoin="round" />
              <path d={d} fill="none" stroke={flash > 0.3 ? C.orangeHi : col} strokeWidth={h.sw / h.s} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          );
        })}
      </g>
    </Svg>
  );
};
