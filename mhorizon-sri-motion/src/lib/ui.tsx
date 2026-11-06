import React from 'react';
import {C} from './theme';
import {Pt, toPath, partial} from './geometry';

/** Trazo dibujándose (progreso 0..1) con pathLength normalizado. */
export const Draw: React.FC<{d: string; p: number; stroke?: string; w?: number; o?: number; cap?: 'round' | 'butt'; dash?: string}> = ({d, p, stroke = C.soft, w = 2, o = 1, cap = 'round', dash}) =>
  p <= 0.001 ? null : (
    <path d={d} fill="none" stroke={stroke} strokeWidth={w} strokeLinecap={cap} strokeLinejoin="round" opacity={o} pathLength={1}
      strokeDasharray={dash ?? '1 1'} strokeDashoffset={dash ? 0 : 1 - p} />
  );

export const PolyDraw: React.FC<{pts: Pt[]; p: number; stroke?: string; w?: number; o?: number}> = ({pts, p, stroke = C.soft, w = 2, o = 1}) =>
  p <= 0.001 ? null : <path d={toPath(partial(pts, p))} fill="none" stroke={stroke} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" opacity={o} />;

export const RR: React.FC<{x: number; y: number; w: number; h: number; r?: number; fill?: string; stroke?: string; sw?: number; o?: number}> = ({x, y, w, h, r = 8, fill = 'none', stroke, sw = 1.5, o = 1}) => (
  <rect x={x} y={y} width={Math.max(0, w)} height={Math.max(0, h)} rx={r} fill={fill} stroke={stroke} strokeWidth={sw} opacity={o} />
);

/** Tarjeta / módulo de interfaz (div con borde, sombra y apertura vertical). */
export const Card: React.FC<{x: number; y: number; w: number; h: number; open?: number; o?: number; r?: number; glow?: number; style?: React.CSSProperties; children?: React.ReactNode; fill?: string}> = ({
  x, y, w, h, open = 1, o = 1, r = 30, glow = 0, style, children, fill = C.navy2,
}) => {
  const hh = Math.max(3, h * open);
  return (
    <div
      style={{
        position: 'absolute', left: x, top: y + (h - hh) / 2, width: w, height: hh, borderRadius: r, background: fill, opacity: o,
        border: `1.5px solid ${glow > 0 ? C.orange : C.line}`, overflow: 'hidden',
        boxShadow: `0 30px 80px rgba(23,30,39,0.10), 0 0 ${60 * glow}px rgba(212,104,28,${0.35 * glow})`, ...style,
      }}
    >
      {children}
    </div>
  );
};
