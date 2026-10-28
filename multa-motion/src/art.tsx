import React from 'react';
import {geoDistance, geoGraticule10, geoOrthographic, geoPath} from 'd3-geo';
import {C} from './theme';
import world from './world.json';

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
    <linearGradient id="gTray" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stopColor="#3b3b39" />
      <stop offset="1" stopColor="#0f0f0e" />
    </linearGradient>
    <linearGradient id="gHandle" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stopColor="#4a4a48" />
      <stop offset=".5" stopColor="#161615" />
      <stop offset="1" stopColor="#050505" />
    </linearGradient>
    <linearGradient id="gRing" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stopColor="#6c6c69" />
      <stop offset=".4" stopColor="#151514" />
      <stop offset="1" stopColor="#3a3a38" />
    </linearGradient>
    <radialGradient id="gOcean" cx=".36" cy=".3" r=".95">
      <stop offset="0" stopColor="#ffffff" />
      <stop offset=".55" stopColor="#e3e0d8" />
      <stop offset="1" stopColor="#a6a39b" />
    </radialGradient>
    <radialGradient id="gLimb" cx=".5" cy=".5" r=".5">
      <stop offset=".62" stopColor="rgba(0,0,0,0)" />
      <stop offset="1" stopColor="rgba(0,0,0,.42)" />
    </radialGradient>
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

/* ───────── declaración (hoja con campos reales) ─────────
 * vals[i]: 0..1 «escrito» · bars[i]: 0..1 tachado · hi: 0..1 tachados pasan a azul
 * stamp: 0 = casilla vacía (punteada), 1 = sellado · check: 0..1 trazo del visto
 */
const LABELS = ['Cuentas bancarias', 'Inversiones', 'Inmuebles', 'Sociedades', 'Otros activos'];
const ROW_Y = (i: number) => -172 + i * 96;
const VAL_W = [300, 220, 340, 180, 260];
const F_HEAD = 'Jakarta MH, Plus Jakarta Sans, sans-serif';
const F_BODY = 'Inter MH, Inter, sans-serif';

export const Doc: React.FC<{
  cx: number;
  cy: number;
  rot?: number;
  s?: number;
  vals: number[];
  bars: number[];
  hi: number;
  stamp: number;
  check: number;
  sign?: number;
  op?: number;
}> = ({cx, cy, rot = -2.5, s = 1, vals, bars, hi, stamp, check, sign = 0, op = 1}) => (
  <g transform={`translate(${cx} ${cy}) rotate(${rot}) scale(${s})`} opacity={op}>
    <rect x={-262} y={-322} width={560} height={720} rx={24} fill="rgba(0,0,0,.3)" filter="url(#fBlur16)" />
    <rect x={-280} y={-340} width={560} height={720} rx={24} fill="url(#gSheet)" stroke="rgba(0,0,0,.14)" strokeWidth={2} />
    {/* encabezado */}
    <text x={-240} y={-286} fontFamily={F_HEAD} fontWeight={800} fontSize={40} letterSpacing="0.02em" fill={C.ink}>
      DECLARACIÓN
    </text>
    <text x={-240} y={-252} fontFamily={F_BODY} fontWeight={500} fontSize={24} fill={C.grey}>
      Activos en el exterior
    </text>
    <circle cx={226} cy={-292} r={22} fill={C.ink} />
    <circle cx={226} cy={-292} r={9} fill="url(#gSheet)" />
    <line x1={-240} x2={240} y1={-224} y2={-224} stroke="rgba(0,0,0,.18)" strokeWidth={2} />
    {/* filas */}
    {LABELS.map((label, i) => {
      const y = ROW_Y(i);
      return (
        <g key={i}>
          <text x={-240} y={y - 14} fontFamily={F_BODY} fontWeight={500} fontSize={25} fill="#77746e">
            {label}
          </text>
          <line x1={-240} x2={240} y1={y + 26} y2={y + 26} stroke="rgba(0,0,0,.16)" strokeWidth={2} />
          <rect x={-240} y={y + 2} width={VAL_W[i] * vals[i]} height={16} rx={8} fill={C.ink} opacity={0.8} />
        </g>
      );
    })}
    {/* tachados */}
    {bars.map((p, i) => {
      if (p <= 0.001) return null;
      const y = ROW_Y(i);
      return (
        <g key={i}>
          <rect x={-252} y={y - 42} width={504 * p} height={78} rx={9} fill={C.ink} />
          <rect x={-252} y={y - 42} width={504 * p} height={78} rx={9} fill={C.blue} opacity={hi} />
        </g>
      );
    })}
    {/* firma y sello */}
    <line x1={-240} x2={-30} y1={320} y2={320} stroke="rgba(0,0,0,.3)" strokeWidth={2.5} />
    <text x={-240} y={348} fontFamily={F_BODY} fontWeight={500} fontSize={22} fill={C.grey}>
      Firma
    </text>
    <path
      d="M-236 288 C-210 262 -190 308 -160 280 C-140 262 -126 296 -100 284"
      fill="none"
      stroke={C.ink}
      strokeWidth={4}
      strokeLinecap="round"
      strokeDasharray={170}
      strokeDashoffset={170 * (1 - sign)}
    />
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

/* ───────── bandeja de entrada (vacía, con el hueco punteado de la declaración) ───────── */
export const Tray: React.FC<{cx: number; cy: number; op: number; ghost: number}> = ({cx, cy, op, ghost}) => (
  <g transform={`translate(${cx} ${cy})`} opacity={op}>
    <ellipse cx={10} cy={86} rx={320} ry={26} fill="rgba(0,0,0,.34)" filter="url(#fBlur16)" />
    {/* interior */}
    <polygon points="-250,-64 250,-64 310,2 -310,2" fill="#1d1d1c" />
    <polygon points="-250,-64 250,-64 262,-52 -262,-52" fill="#0d0d0c" />
    {/* hueco punteado del documento */}
    <polygon
      points="-176,-54 176,-54 214,-8 -214,-8"
      fill="rgba(255,255,255,.04)"
      stroke={`rgba(200,198,191,${0.35 + 0.5 * ghost})`}
      strokeWidth={4}
      strokeDasharray="12 10"
    />
    {/* frente */}
    <rect x={-310} y={0} width={620} height={84} rx={16} fill="url(#gTray)" />
    <rect x={-310} y={0} width={620} height={10} rx={5} fill="rgba(255,255,255,.18)" />
    <rect x={-60} y={36} width={120} height={14} rx={7} fill="rgba(255,255,255,.14)" />
  </g>
);

/* ───────── prohibido (círculo con barra) ───────── */
export const Forbid: React.FC<{cx: number; cy: number; p: number}> = ({cx, cy, p}) => {
  if (p <= 0) return null;
  const sc = 0.4 + 0.6 * p + 0.15 * Math.sin(p * Math.PI);
  return (
    <g transform={`translate(${cx} ${cy}) scale(${sc})`} opacity={Math.min(1, p * 3)}>
      <circle r={52} fill="rgba(0,0,0,.25)" transform="translate(6 10)" filter="url(#fBlur6)" />
      <circle r={50} fill="#f7f6f1" />
      <circle r={42} fill="none" stroke={C.blue} strokeWidth={13} />
      <line x1={-30} y1={-30} x2={30} y2={30} stroke={C.blue} strokeWidth={13} strokeLinecap="round" />
    </g>
  );
};

/* ───────── barra del valor total + lupa que revela el 0,5 % ───────── */
const BAR_X0 = 140;
const BAR_X1 = 940;

export const RulerLens: React.FC<{
  cy: number;
  grow: number;
  lens: number;
  ticks: number;
  fill: number;
  pulse: number;
}> = ({cy, grow, lens, ticks, fill, pulse}) => {
  const lr = 190;
  const lx = BAR_X0 + lr;
  const ly = cy;
  const barW = (BAR_X1 - BAR_X0) * grow;
  const sc = 0.55 + 0.45 * lens;
  const inner = [];
  for (let k = 0; k <= 10; k++) {
    const x = -135 + k * 27;
    const major = k === 0 || k === 5 || k === 10;
    inner.push(
      <line
        key={k}
        x1={x}
        x2={x}
        y1={-58 - (major ? 26 : 12) * ticks}
        y2={-58}
        stroke={C.ink}
        strokeWidth={major ? 4 : 2.5}
        strokeLinecap="round"
        opacity={0.8}
      />,
    );
  }
  return (
    <g>
      {/* barra del valor total */}
      <ellipse cx={(BAR_X0 + BAR_X1) / 2 + 10} cy={cy + 56} rx={(BAR_X1 - BAR_X0) / 2} ry={14} fill="rgba(0,0,0,.25)" filter="url(#fBlur16)" opacity={grow} />
      <rect x={BAR_X0} y={cy - 30} width={Math.max(0, barW)} height={60} rx={10} fill={C.ink} />
      <rect x={BAR_X0} y={cy - 30} width={Math.min(Math.max(0, barW), 5)} height={60} rx={2} fill={C.blue} />
      <text x={BAR_X1} y={cy + 98} textAnchor="end" fontFamily={F_HEAD} fontWeight={800} fontSize={34} fill={C.grey} opacity={grow}>
        100 %
      </text>
      {/* lupa */}
      <g transform={`translate(${lx} ${ly}) scale(${sc})`} opacity={Math.min(1, lens * 2.5)}>
        <ellipse cx={22} cy={lr + 44} rx={150} ry={20} fill="rgba(0,0,0,.28)" filter="url(#fBlur16)" />
        {/* mango */}
        <g transform="rotate(48)">
          <rect x={lr - 6} y={-26} width={190} height={52} rx={26} fill="url(#gHandle)" />
          <rect x={lr + 22} y={-8} width={120} height={8} rx={4} fill="rgba(255,255,255,.18)" />
        </g>
        <circle r={lr + 14} fill="#0d0d0c" />
        <clipPath id="lensClip">
          <circle r={lr} />
        </clipPath>
        <g clipPath="url(#lensClip)">
          <rect x={-lr} y={-lr} width={lr * 2} height={lr * 2} fill="url(#gSheet)" />
          {/* zoom: de 0 a 1 % */}
          <rect x={-135} y={-58} width={270} height={116} rx={4} fill={C.ink} />
          <rect x={-135} y={-58} width={135 * fill} height={116} rx={4} fill={C.blue} />
          {inner}
          <text x={-135} y={96} textAnchor="middle" fontFamily={F_HEAD} fontWeight={800} fontSize={34} fill={C.ink} opacity={ticks}>
            0
          </text>
          <text x={135} y={96} textAnchor="middle" fontFamily={F_HEAD} fontWeight={800} fontSize={34} fill={C.ink} opacity={ticks}>
            1 %
          </text>
          <text x={-67} y={6} textAnchor="middle" dominantBaseline="central" fontFamily={F_HEAD} fontWeight={800} fontSize={36} fill="#fff" opacity={fill}>
            0,5 %
          </text>
          <ellipse cx={-70} cy={-120} rx={110} ry={46} fill="rgba(255,255,255,.55)" transform="rotate(-24 -70 -120)" filter="url(#fBlur6)" />
        </g>
        <circle r={lr + 7} fill="none" stroke="url(#gRing)" strokeWidth={14} />
        {fill > 0 && <circle r={lr + 14 + 70 * pulse} fill="none" stroke={C.blue} strokeWidth={4} opacity={(1 - pulse) * 0.85} />}
      </g>
    </g>
  );
};

/* ───────── mapamundi real (Natural Earth 110m, dominio público) ───────── */
const landGeo: any = {type: 'MultiPolygon', coordinates: (world as any).land};
const ecuGeo: any = {type: 'MultiPolygon', coordinates: (world as any).ecu};
const grat = geoGraticule10();

export const World: React.FC<{
  cx: number;
  cy: number;
  r: number;
  lon: number;
  lat: number;
  pins: Array<[number, number, number]>; // lon, lat, progreso 0..1
  home: number; // 0..1 Ecuador resaltado
}> = ({cx, cy, r, lon, lat, pins, home}) => {
  const proj = geoOrthographic().translate([cx, cy]).scale(r).clipAngle(90).rotate([-lon, -lat]).precision(0.6);
  const path = geoPath(proj);
  const center: [number, number] = [lon, lat];
  const ecuC = proj([-78.3, -1.4]);
  const ecuVis = geoDistance([-78.3, -1.4], center) < 1.35;
  return (
    <g>
      <ellipse cx={cx + 26} cy={cy + r + 64} rx={r * 0.92} ry={38} fill="rgba(0,0,0,.32)" filter="url(#fBlur16)" />
      <circle cx={cx} cy={cy} r={r + 10} fill="rgba(255,255,255,.55)" filter="url(#fBlur6)" />
      <circle cx={cx} cy={cy} r={r} fill="url(#gOcean)" />
      <clipPath id="worldClip">
        <circle cx={cx} cy={cy} r={r} />
      </clipPath>
      <g clipPath="url(#worldClip)">
        <path d={path(grat) || ''} fill="none" stroke="rgba(0,0,0,.13)" strokeWidth={1.6} />
        <path d={path(landGeo) || ''} fill="#b4b1a8" stroke="#8e8b83" strokeWidth={1.1} strokeLinejoin="round" />
        <path d={path(ecuGeo) || ''} fill={C.ink} stroke={C.ink} strokeWidth={1.4} opacity={0.4 + 0.6 * home} />
        <circle cx={cx} cy={cy} r={r} fill="url(#gLimb)" />
        <ellipse cx={cx - r * 0.32} cy={cy - r * 0.46} rx={r * 0.46} ry={r * 0.26} fill="rgba(255,255,255,.4)" filter="url(#fBlur16)" />
      </g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,0,0,.4)" strokeWidth={2.5} />
      {home > 0 && ecuVis && ecuC && (
        <g>
          <circle cx={ecuC[0]} cy={ecuC[1]} r={10 + 40 * (1 - home)} fill="none" stroke={C.ink} strokeWidth={3} opacity={(1 - home) * 0.8} />
          <circle cx={ecuC[0]} cy={ecuC[1]} r={7 * home} fill="#f7f6f1" stroke={C.ink} strokeWidth={3} />
        </g>
      )}
      {pins
        .map(([plon, plat, p]) => {
          const xy = proj([plon, plat]);
          return {xy, p, vis: geoDistance([plon, plat], center) < 1.32};
        })
        .filter((q) => q.xy && q.vis && q.p > 0)
        .sort((a, b) => a.xy![1] - b.xy![1])
        .map((q, i) => (
          <g key={i}>
            <circle cx={q.xy![0]} cy={q.xy![1]} r={9 + 36 * (1 - q.p)} fill="none" stroke={C.blue} strokeWidth={3} opacity={(1 - q.p) * 0.8} />
            <Pin x={q.xy![0]} y={q.xy![1] - (1 - q.p) * 80} s={0.62} op={Math.min(1, q.p * 3)} />
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
