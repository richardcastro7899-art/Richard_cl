import React from 'react';
import {C} from './theme';

/* ───────── definiciones compartidas (degradados, filtros) ───────── */
export const Defs: React.FC = () => (
  <defs>
    <filter id="fBlur6" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="6" />
    </filter>
    <filter id="fBlur16" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="16" />
    </filter>
    <linearGradient id="gCoinSide" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stopColor="#2c2c2b" />
      <stop offset=".22" stopColor="#d6d4cd" />
      <stop offset=".45" stopColor="#8d8b85" />
      <stop offset=".8" stopColor="#4a4947" />
      <stop offset="1" stopColor="#1f1f1e" />
    </linearGradient>
    <radialGradient id="gCoinTop" cx=".4" cy=".35" r=".85">
      <stop offset="0" stopColor="#fdfcf8" />
      <stop offset=".7" stopColor="#c9c6be" />
      <stop offset="1" stopColor="#9c9993" />
    </radialGradient>
    <radialGradient id="gPinHead" cx=".34" cy=".3" r=".8">
      <stop offset="0" stopColor="#a9bdff" />
      <stop offset=".35" stopColor="#2c55f0" />
      <stop offset="1" stopColor="#0f2486" />
    </radialGradient>
    <linearGradient id="gPinStem" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stopColor="#0f2486" />
      <stop offset=".4" stopColor="#4f74ff" />
      <stop offset="1" stopColor="#0b1b6a" />
    </linearGradient>
    <linearGradient id="gNeedle" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stopColor="#8f8f8f" />
      <stop offset=".5" stopColor="#f4f4f4" />
      <stop offset="1" stopColor="#6a6a6a" />
    </linearGradient>
    <radialGradient id="gGlobe" cx=".34" cy=".28" r=".95">
      <stop offset="0" stopColor="#ffffff" />
      <stop offset=".5" stopColor="#d5d2ca" />
      <stop offset="1" stopColor="#5f5d58" />
    </radialGradient>
    <linearGradient id="gSheet" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stopColor="#fdfcf9" />
      <stop offset="1" stopColor="#e7e4dc" />
    </linearGradient>
    <linearGradient id="gTile" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stopColor="#fbfaf7" />
      <stop offset="1" stopColor="#e4e1d9" />
    </linearGradient>
    <linearGradient id="gNote" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stopColor="#f6f4ee" />
      <stop offset="1" stopColor="#d3d0c7" />
    </linearGradient>
    <radialGradient id="gEyeWhite" cx=".5" cy=".4" r=".75">
      <stop offset="0" stopColor="#ffffff" />
      <stop offset=".7" stopColor="#e6e4de" />
      <stop offset="1" stopColor="#b9b6ae" />
    </radialGradient>
    <radialGradient id="gIris" cx=".45" cy=".4" r=".6">
      <stop offset="0" stopColor="#d8d6d0" />
      <stop offset=".55" stopColor="#7b7a76" />
      <stop offset=".9" stopColor="#2a2a29" />
      <stop offset="1" stopColor="#0d0d0d" />
    </radialGradient>
  </defs>
);

/* ───────── pin azul (origen: punta de la aguja) ───────── */
export const Pin: React.FC<{x: number; y: number; s?: number; rot?: number; op?: number}> = ({
  x,
  y,
  s = 1,
  rot = 0,
  op = 1,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={op}>
    <ellipse cx={10} cy={2} rx={20} ry={5} fill="rgba(0,0,0,.35)" filter="url(#fBlur6)" />
    <polygon points="-3,-30 3,-30 0,0" fill="url(#gNeedle)" />
    <rect x={-10} y={-56} width={20} height={28} rx={4} fill="url(#gPinStem)" />
    <ellipse cx={0} cy={-56} rx={26} ry={7} fill="#1c3bc4" />
    <circle cx={0} cy={-84} r={28} fill="url(#gPinHead)" />
    <ellipse cx={-9} cy={-95} rx={9} ry={5.5} fill="rgba(255,255,255,.75)" transform="rotate(-30 -9 -95)" />
  </g>
);

/* ───────── moneda (para la torre del tope) ───────── */
export const Coin: React.FC<{cx: number; cy: number; r: number; h: number; label?: boolean; op?: number}> = ({
  cx,
  cy,
  r,
  h,
  label,
  op = 1,
}) => {
  const ry = r * 0.3;
  return (
    <g opacity={op}>
      <path
        d={`M${cx - r} ${cy} L${cx - r} ${cy + h} A${r} ${ry} 0 0 0 ${cx + r} ${cy + h} L${cx + r} ${cy} Z`}
        fill="url(#gCoinSide)"
      />
      <ellipse cx={cx} cy={cy} rx={r} ry={ry} fill="url(#gCoinTop)" stroke="rgba(0,0,0,.28)" strokeWidth={1.2} />
      <ellipse cx={cx} cy={cy} rx={r * 0.8} ry={ry * 0.8} fill="none" stroke="rgba(0,0,0,.2)" strokeWidth={1.4} />
      {label && (
        <text
          transform={`translate(${cx} ${cy}) scale(1 .3)`}
          fontSize={r * 1.05}
          fontWeight={800}
          fontFamily="Jakarta MH, Plus Jakarta Sans, sans-serif"
          textAnchor="middle"
          dominantBaseline="central"
          fill="rgba(0,0,0,.42)"
        >
          $
        </text>
      )}
    </g>
  );
};

/* ───────── formulario de declaración (hoja de papel) ─────────
 * rows[i]: 0..1 «escrito» · bars[i]: 0..1 tachado negro · hi: 0..1 tachados pasan a azul
 * stamp: 0 = casilla vacía (punteada), 1 = sellado · check: 0..1 trazo del visto
 */
const ROW_Y = (i: number) => -196 + i * 76;
const ROW_W = [210, 170, 240, 130, 200, 160, 230];

export const Form: React.FC<{
  cx: number;
  cy: number;
  rot?: number;
  s?: number;
  rows: number[];
  bars: number[];
  hi: number;
  stamp: number;
  check: number;
  op?: number;
}> = ({cx, cy, rot = -2.5, s = 1, rows, bars, hi, stamp, check, op = 1}) => (
  <g transform={`translate(${cx} ${cy}) rotate(${rot}) scale(${s})`} opacity={op}>
    <rect x={-262} y={-322} width={560} height={720} rx={24} fill="rgba(0,0,0,.3)" filter="url(#fBlur16)" />
    <rect x={-280} y={-340} width={560} height={720} rx={24} fill="url(#gSheet)" stroke="rgba(0,0,0,.14)" strokeWidth={2} />
    {/* encabezado */}
    <circle cx={-224} cy={-290} r={24} fill={C.ink} />
    <rect x={-176} y={-306} width={240} height={16} rx={8} fill={C.ink} />
    <rect x={-176} y={-278} width={150} height={10} rx={5} fill={C.greyLt} />
    <line x1={-240} x2={240} y1={-240} y2={-240} stroke="rgba(0,0,0,.18)" strokeWidth={2} />
    {/* filas */}
    {rows.map((p, i) => {
      const y = ROW_Y(i);
      return (
        <g key={i}>
          <rect x={-240} y={y - 22} width={110} height={11} rx={5.5} fill={C.greyLt} />
          <line x1={-240} x2={240} y1={y + 24} y2={y + 24} stroke="rgba(0,0,0,.14)" strokeWidth={2} />
          <rect x={-100} y={y - 4} width={ROW_W[i] * p} height={14} rx={7} fill={C.ink} opacity={0.78} />
        </g>
      );
    })}
    {/* tachados */}
    {bars.map((p, i) => {
      if (p <= 0.001) return null;
      const y = ROW_Y(i);
      return (
        <g key={i}>
          <rect x={-250} y={y - 30} width={500 * p} height={58} rx={8} fill={C.ink} />
          <rect x={-250} y={y - 30} width={500 * p} height={58} rx={8} fill={C.blue} opacity={hi} />
        </g>
      );
    })}
    {/* firma y sello */}
    <line x1={-240} x2={-20} y1={318} y2={318} stroke="rgba(0,0,0,.3)" strokeWidth={2.5} />
    <g transform="translate(150 292) rotate(-10)">
      {stamp < 0.02 ? (
        <circle r={62} fill="none" stroke={C.greyLt} strokeWidth={4} strokeDasharray="9 9" />
      ) : (
        <>
          <circle r={62} fill="none" stroke={C.ink} strokeWidth={7} opacity={Math.min(1, stamp * 1.6)} />
          <circle r={50} fill="none" stroke={C.ink} strokeWidth={2.5} opacity={Math.min(1, stamp * 1.6)} />
        </>
      )}
      <path
        d="M-28 4 L-8 26 L32 -24"
        fill="none"
        stroke={C.blue}
        strokeWidth={11}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={90}
        strokeDashoffset={90 * (1 - check)}
      />
    </g>
  </g>
);

/* ───────── 200 puntos: 0,5 % = 1 de cada 200 ───────── */
const COLS = 20;
const ROWS = 10;
const PITCH = 38;
export const HI_IDX = 4 * COLS + 9;

export const DotGrid: React.FC<{cx: number; cy: number; reveal: number; hiP: number; pulse: number}> = ({
  cx,
  cy,
  reveal,
  hiP,
  pulse,
}) => {
  const x0 = cx - ((COLS - 1) * PITCH) / 2;
  const y0 = cy - ((ROWS - 1) * PITCH) / 2;
  const dots = [];
  for (let i = 0; i < COLS * ROWS; i++) {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const k = (row + col * 0.35) / (ROWS + COLS * 0.35);
    const local = Math.max(0, Math.min(1, (reveal - k * 0.75) / 0.25));
    if (local <= 0) continue;
    const hi = i === HI_IDX;
    const x = x0 + col * PITCH;
    const y = y0 + row * PITCH;
    if (hi) continue;
    dots.push(
      <circle key={i} cx={x} cy={y} r={13 * local} fill="#bdbab2" opacity={(1 - 0.5 * hiP) * Math.min(1, local * 2)} />,
    );
  }
  const hx = x0 + (HI_IDX % COLS) * PITCH;
  const hy = y0 + Math.floor(HI_IDX / COLS) * PITCH;
  const hl = Math.max(0, Math.min(1, (reveal - 0.45) / 0.25));
  const hr = hiP > 0 ? 13 + 12 * hiP : 13 * hl;
  return (
    <g>
      <rect x={cx - 438 + 10} y={cy - 250 + 22} width={876} height={500} rx={30} fill="rgba(0,0,0,.28)" filter="url(#fBlur16)" />
      <rect x={cx - 438} y={cy - 250} width={876} height={500} rx={30} fill="url(#gTile)" stroke="rgba(0,0,0,.12)" strokeWidth={2} />
      {dots}
      {hiP > 0 && (
        <circle cx={hx} cy={hy} r={hr + 70 * pulse} fill="none" stroke={C.blue} strokeWidth={4} opacity={(1 - pulse) * 0.9} />
      )}
      {hl > 0 && <circle cx={hx} cy={hy} r={hr} fill={hiP > 0 ? C.blue : '#bdbab2'} />}
    </g>
  );
};

/* ───────── globo con pines (activos en el exterior) ───────── */
const D2R = Math.PI / 180;
const globePt = (cx: number, cy: number, r: number, lon: number, lat: number, rot: number) => {
  const d = (lon - rot) * D2R;
  const p = lat * D2R;
  return {x: cx + r * Math.cos(p) * Math.sin(d), y: cy - r * Math.sin(p), vis: Math.cos(p) * Math.cos(d) > 0.12};
};

export const GlobePins: React.FC<{
  cx: number;
  cy: number;
  r: number;
  rot: number;
  pins: Array<[number, number, number]>; // lon, lat, progreso 0..1
}> = ({cx, cy, r, rot, pins}) => {
  const meridians: React.ReactNode[] = [];
  for (let k = 0; k < 8; k++) {
    const lam = ((((rot + k * 22.5) % 180) + 180) % 180) - 90;
    const rx = r * Math.sin(lam * D2R);
    meridians.push(
      <path
        key={k}
        d={`M${cx} ${cy - r} A${Math.abs(rx)} ${r} 0 0 ${rx > 0 ? 1 : 0} ${cx} ${cy + r}`}
        fill="none"
        stroke="rgba(0,0,0,.26)"
        strokeWidth={2}
      />,
    );
  }
  const parallels = [-60, -30, 0, 30, 60].map((lat) => {
    const y = cy - r * Math.sin(lat * D2R);
    const w = r * Math.cos(lat * D2R);
    return <line key={lat} x1={cx - w} x2={cx + w} y1={y} y2={y} stroke="rgba(0,0,0,.26)" strokeWidth={2} />;
  });
  return (
    <g>
      <ellipse cx={cx + 24} cy={cy + r + 60} rx={r * 0.9} ry={36} fill="rgba(0,0,0,.32)" filter="url(#fBlur16)" />
      <circle cx={cx} cy={cy} r={r} fill="url(#gGlobe)" />
      <clipPath id="globeClip">
        <circle cx={cx} cy={cy} r={r} />
      </clipPath>
      <g clipPath="url(#globeClip)">
        {meridians}
        {parallels}
        <ellipse cx={cx - r * 0.3} cy={cy - r * 0.45} rx={r * 0.5} ry={r * 0.3} fill="rgba(255,255,255,.35)" filter="url(#fBlur16)" />
      </g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,0,0,.35)" strokeWidth={2.5} />
      {pins
        .map(([lon, lat, p]) => ({...globePt(cx, cy, r, lon, lat, rot), p}))
        .filter((q) => q.vis && q.p > 0)
        .sort((a, b) => a.y - b.y)
        .map((q, i) => (
          <g key={i}>
            <circle cx={q.x} cy={q.y} r={10 + 34 * (1 - q.p)} fill="none" stroke={C.blue} strokeWidth={3} opacity={(1 - q.p) * 0.8} />
            <Pin x={q.x} y={q.y - (1 - q.p) * 70} s={0.74} op={Math.min(1, q.p * 3)} />
          </g>
        ))}
    </g>
  );
};

/* ───────── ojo (lo no reportado) ───────── */
export const Eye: React.FC<{cx: number; cy: number; open: number; look: number; slash: number; slashDrop: number}> = ({
  cx,
  cy,
  open,
  look,
  slash,
  slashDrop,
}) => {
  const o = Math.max(0.02, open);
  const lid = `M-330 0 C-200 ${-195 * o} 200 ${-195 * o} 330 0 C200 ${195 * o} -200 ${195 * o} -330 0 Z`;
  const len = 700;
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <ellipse cx={14} cy={230} rx={300} ry={26} fill="rgba(0,0,0,.28)" filter="url(#fBlur16)" opacity={open} />
      <path d={lid} fill="url(#gEyeWhite)" />
      <clipPath id="eyeClip">
        <path d={lid} />
      </clipPath>
      <g clipPath="url(#eyeClip)">
        <g transform={`translate(${look * 46} 0)`}>
          <circle r={132} fill="url(#gIris)" />
          {Array.from({length: 28}, (_, i) => {
            const a = (i / 28) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={Math.cos(a) * 58}
                y1={Math.sin(a) * 58}
                x2={Math.cos(a) * 118}
                y2={Math.sin(a) * 118}
                stroke="rgba(0,0,0,.22)"
                strokeWidth={2}
              />
            );
          })}
          <circle r={56} fill="#070707" />
          <ellipse cx={-38} cy={-44} rx={24} ry={15} fill="rgba(255,255,255,.88)" transform="rotate(-25 -38 -44)" />
          <circle cx={30} cy={34} r={8} fill="rgba(255,255,255,.4)" />
        </g>
        <path d={lid} fill="none" stroke="rgba(0,0,0,.18)" strokeWidth={26} />
      </g>
      <path d={lid} fill="none" stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
      {slash > 0 && (
        <g transform={`translate(0 ${-slashDrop * 0})`}>
          <line x1={-286} y1={-210} x2={286} y2={210} stroke="rgba(0,0,0,.3)" strokeWidth={36} strokeLinecap="round" transform="translate(10 16)" filter="url(#fBlur6)" strokeDasharray={len} strokeDashoffset={len * (1 - slash)} />
          <line x1={-286} y1={-210} x2={286} y2={210} stroke="#f7f6f1" strokeWidth={50} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - slash)} />
          <line x1={-286} y1={-210} x2={286} y2={210} stroke={C.blue} strokeWidth={30} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - slash)} />
        </g>
      )}
    </g>
  );
};

/* ───────── techo (límite) ───────── */
export const Ceiling: React.FC<{cx: number; y: number; dy: number; flash: number}> = ({cx, y, dy, flash}) => {
  const w = 820;
  const hatch = [];
  for (let i = 0; i < 26; i++) {
    const x = cx - w / 2 + i * 32;
    hatch.push(<line key={i} x1={x} y1={y - 8} x2={x + 36} y2={y - 52} stroke="rgba(0,0,0,.2)" strokeWidth={4} strokeLinecap="round" />);
  }
  return (
    <g transform={`translate(0 ${dy})`}>
      <ellipse cx={cx + 8} cy={y + 40} rx={w / 2} ry={16} fill="rgba(0,0,0,.2)" filter="url(#fBlur16)" />
      <clipPath id="ceilClip">
        <rect x={cx - w / 2} y={y - 60} width={w} height={60} />
      </clipPath>
      <g clipPath="url(#ceilClip)">{hatch}</g>
      <rect x={cx - w / 2} y={y} width={w} height={26} rx={7} fill={C.ink} />
      <rect x={cx - w / 2} y={y} width={w} height={26} rx={7} fill={C.blue} opacity={flash} />
      <rect x={cx - w / 2} y={y + 22} width={26} height={54} rx={6} fill={C.ink} />
      <rect x={cx + w / 2 - 26} y={y + 22} width={26} height={54} rx={6} fill={C.ink} />
      <rect x={cx - w / 2} y={y + 22} width={26} height={54} rx={6} fill={C.blue} opacity={flash} />
      <rect x={cx + w / 2 - 26} y={y + 22} width={26} height={54} rx={6} fill={C.blue} opacity={flash} />
    </g>
  );
};

/* ───────── billete (salario básico unificado) ───────── */
export const Note: React.FC<{cx: number; cy: number; rot: number; op: number}> = ({cx, cy, rot, op}) => (
  <g transform={`translate(${cx} ${cy}) rotate(${rot})`} opacity={op}>
    <rect x={-226} y={-96} width={460} height={206} rx={16} fill="rgba(0,0,0,.2)" filter="url(#fBlur6)" />
    <rect x={-235} y={-105} width={470} height={206} rx={16} fill="url(#gNote)" stroke="rgba(0,0,0,.28)" strokeWidth={2.5} />
    <rect x={-216} y={-86} width={432} height={168} rx={10} fill="none" stroke="rgba(0,0,0,.2)" strokeWidth={2} strokeDasharray="6 7" />
    <circle cx={-150} cy={-2} r={52} fill="none" stroke="rgba(0,0,0,.3)" strokeWidth={3} />
    <circle cx={-150} cy={-2} r={36} fill="none" stroke="rgba(0,0,0,.2)" strokeWidth={2} />
    <text
      x={48}
      y={4}
      textAnchor="middle"
      dominantBaseline="central"
      fontFamily="Jakarta MH, Plus Jakarta Sans, sans-serif"
      fontWeight={800}
      fontSize={62}
      letterSpacing="-0.02em"
      fill="rgba(0,0,0,.62)"
    >
      SBU
    </text>
    <rect x={-60} y={52} width={216} height={9} rx={4.5} fill="rgba(0,0,0,.16)" />
    <rect x={-60} y={-70} width={120} height={9} rx={4.5} fill="rgba(0,0,0,.16)" />
  </g>
);
