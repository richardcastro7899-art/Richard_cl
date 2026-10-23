import React from 'react';
import {C, clamp, rng} from './core';

type P = {d: string; fill?: string; w?: number};

// ───────────── garabatos de celebración (trazo a mano, sin corazones ni estrellas) ─────────────
const balloon = (cx: number, cy: number, rx: number, ry: number, fill: string): P[] => [
  {d: `M${cx} ${cy - ry} C${cx + rx * 1.18} ${cy - ry} ${cx + rx * 1.1} ${cy + ry * 0.55} ${cx} ${cy + ry} C${cx - rx * 1.1} ${cy + ry * 0.55} ${cx - rx * 1.18} ${cy - ry} ${cx} ${cy - ry}Z`, fill},
  {d: `M${cx - 7} ${cy + ry + 11} L${cx} ${cy + ry} L${cx + 7} ${cy + ry + 11}Z`},
  {d: `M${cx} ${cy + ry + 11} C${cx - 16} ${cy + ry + 46} ${cx + 15} ${cy + ry + 78} ${cx - 5} ${cy + ry + 128}`, w: 0.8},
  {d: `M${cx - rx * 0.56} ${cy - ry * 0.46} C${cx - rx * 0.72} ${cy - ry * 0.16} ${cx - rx * 0.72} ${cy + ry * 0.04} ${cx - rx * 0.6} ${cy + ry * 0.24}`, w: 0.65},
];

const SHAPES: Record<string, {w: number; h: number; paths: (c: string[]) => P[]}> = {
  balloons: {
    w: 300, h: 370,
    paths: (c) => [...balloon(88, 120, 54, 68, c[0]), ...balloon(172, 92, 48, 62, c[1]), ...balloon(226, 160, 44, 56, c[2])],
  },
  gift: {
    w: 170, h: 160,
    paths: (c) => [
      {d: 'M22 70 H148 V146 H22 Z', fill: c[0]},
      {d: 'M12 46 H158 V70 H12 Z', fill: c[1]},
      {d: 'M85 46 V146', w: 0.8},
      {d: 'M85 46 C66 14 36 16 44 38 C48 50 72 50 85 46', w: 0.9},
      {d: 'M85 46 C104 14 134 16 126 38 C122 50 98 50 85 46', w: 0.9},
      {d: 'M85 46 C80 58 70 66 62 72 M85 46 C90 58 100 66 108 72', w: 0.6},
    ],
  },
  cake: {
    w: 190, h: 170,
    paths: (c) => [
      {d: 'M6 150 H184', w: 0.9},
      {d: 'M26 150 V96 H164 V150', fill: c[0]},
      {d: 'M26 96 C40 112 52 86 66 104 C80 120 94 86 108 104 C122 120 136 88 150 104 C156 108 160 102 164 96', w: 0.9},
      {d: 'M52 96 V66 H138 V96', fill: c[1]},
      {d: 'M52 66 C62 78 72 58 84 72 C96 84 108 58 120 72 C128 80 134 66 138 66', w: 0.8},
      {d: 'M72 66 V42 M95 66 V36 M118 66 V42', w: 0.9},
      {d: 'M72 40 C66 32 72 28 72 20 C79 28 79 34 72 40Z M95 34 C89 26 95 22 95 14 C102 22 102 28 95 34Z M118 40 C112 32 118 28 118 20 C125 28 125 34 118 40Z', fill: c[2], w: 0.6},
    ],
  },
};

export type DoodleKind = 'balloons' | 'gift' | 'cake';

/** Garabato que se dibuja trazo a trazo. p: 0→1 */
export const Doodle: React.FC<{kind: DoodleKind; p: number; scale?: number; color: string; fills: string[]; rot?: number; opacity?: number; wobble?: number}> = ({kind, p, scale = 1, color, fills, rot = 0, opacity = 1, wobble = 0}) => {
  const sh = SHAPES[kind];
  const paths = sh.paths(fills);
  const n = paths.length;
  return (
    <svg width={sh.w * scale} height={sh.h * scale} viewBox={`0 0 ${sh.w} ${sh.h}`} style={{overflow: 'visible', transform: `rotate(${rot + wobble}deg)`, opacity}}>
      {paths.map((pa, i) => {
        const a = (i / n) * 0.62;
        const q = clamp((p - a) / 0.38);
        const fillA = clamp((p - 0.7) / 0.25);
        return (
          <g key={i}>
            {/* segundo trazo desfasado: da aspecto de dibujo a mano */}
            <path d={pa.d} pathLength={1} fill="none" stroke={color} strokeOpacity={0.45} strokeWidth={2.2 * (pa.w ?? 1)} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1.02" strokeDashoffset={1 - q} transform="translate(1.6 -1.2)" />
            <path d={pa.d} pathLength={1} fill={pa.fill ?? 'none'} fillOpacity={pa.fill ? 0.28 * fillA : 0} stroke={color} strokeWidth={3 * (pa.w ?? 1)} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1.02" strokeDashoffset={1 - q} />
          </g>
        );
      })}
    </svg>
  );
};

/** Subrayado / trazo de pincel dibujado a mano. */
export const Scribble: React.FC<{p: number; w: number; color: string; h?: number; kind?: 'wave' | 'swoosh'; sw?: number}> = ({p, w, color, h = 26, kind = 'wave', sw = 5}) => {
  const d = kind === 'wave'
    ? `M3 ${h * 0.55} C${w * 0.18} ${h * 0.1} ${w * 0.3} ${h * 0.95} ${w * 0.5} ${h * 0.5} S${w * 0.82} ${h * 0.2} ${w - 4} ${h * 0.6}`
    : `M3 ${h * 0.7} C${w * 0.25} ${h * 0.2} ${w * 0.6} ${h * 0.95} ${w - 4} ${h * 0.25}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{overflow: 'visible', display: 'block'}}>
      <path d={d} pathLength={1} fill="none" stroke={color} strokeOpacity={0.4} strokeWidth={sw * 0.8} strokeLinecap="round" strokeDasharray="1 1.02" strokeDashoffset={1 - p} transform="translate(1.5 2)" />
      <path d={d} pathLength={1} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeDasharray="1 1.02" strokeDashoffset={1 - p} />
    </svg>
  );
};

/** Marco dibujado a mano alrededor de un elemento (se escala al contenedor). */
export const LoopFrame: React.FC<{p: number; w: number; h: number; color: string; opacity?: number}> = ({p, w, h, color, opacity = 1}) => (
  <svg width={w} height={h} viewBox="-0.06 -0.06 1.12 1.12" preserveAspectRatio="none" style={{overflow: 'visible', opacity}}>
    <path
      d="M0.07 0.012 C0.35 -0.012 0.7 0.03 0.965 0.008 C1.012 0.3 0.992 0.7 1.004 0.985 C0.7 1.016 0.3 0.97 0.035 1.004 C-0.008 0.7 0.012 0.3 0.018 0.05 C0.04 0.0 0.12 -0.035 0.2 0.0 C0.24 0.012 0.3 0.01 0.36 0.0"
      pathLength={1} fill="none" stroke={color} strokeWidth={7} vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1.02" strokeDashoffset={1 - p}
    />
  </svg>
);

/** Banderines colgando de una cuerda (decoración sobria). */
export const Bunting: React.FC<{p: number; width: number; color: string; flags: string[]}> = ({p, width, color, flags}) => {
  const n = 11;
  const sag = 70;
  const pts = Array.from({length: n}, (_, i) => {
    const u = (i + 0.5) / n;
    return {x: u * width, y: 4 * sag * u * (1 - u) + 10, u};
  });
  return (
    <svg width={width} height={sag + 110} viewBox={`0 0 ${width} ${sag + 110}`} style={{overflow: 'visible'}}>
      <path d={`M0 10 Q${width / 2} ${sag * 2 + 10} ${width} 10`} pathLength={1} fill="none" stroke={color} strokeWidth={3} strokeDasharray="1 1.02" strokeDashoffset={1 - clamp(p * 1.6)} />
      {pts.map((pt, i) => {
        const a = clamp((p - 0.25 - (i / n) * 0.5) / 0.25);
        return (
          <path key={i} d={`M${pt.x - 24} ${pt.y} L${pt.x + 24} ${pt.y} L${pt.x} ${pt.y + 62 * a}Z`} fill={flags[i % flags.length]} fillOpacity={0.85 * a} stroke={color} strokeWidth={2} strokeLinejoin="round" />
        );
      })}
    </svg>
  );
};

/** Confeti de papel sobrio (paleta apagada). */
export const CONFETTI_COLORS = [C.terracotta, C.mustard, C.sage, C.dusty, '#F0D9B8', '#E9A27E'];
export const confettiRng = (seed: number) => rng(seed);
