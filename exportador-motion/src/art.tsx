import React from 'react';
import {C, rnd} from './theme';

/* ───────── definiciones compartidas (degradados, filtros) ───────── */
export const Defs: React.FC = () => (
  <defs>
    <linearGradient id="gPawnBody" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stopColor="#050505" />
      <stop offset=".3" stopColor="#4a4a49" />
      <stop offset=".58" stopColor="#161616" />
      <stop offset="1" stopColor="#020202" />
    </linearGradient>
    <radialGradient id="gPawnHead" cx=".35" cy=".3" r=".8">
      <stop offset="0" stopColor="#92928f" />
      <stop offset=".35" stopColor="#2e2e2d" />
      <stop offset="1" stopColor="#030303" />
    </radialGradient>
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
    <linearGradient id="gSailL" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stopColor="#fbfaf6" />
      <stop offset="1" stopColor="#d4d1c9" />
    </linearGradient>
    <linearGradient id="gSailR" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stopColor="#bfbbb2" />
      <stop offset="1" stopColor="#8e8a82" />
    </linearGradient>
    <linearGradient id="gHullL" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stopColor="#f0eee8" />
      <stop offset="1" stopColor="#c9c6be" />
    </linearGradient>
    <linearGradient id="gHullR" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stopColor="#a8a49b" />
      <stop offset="1" stopColor="#6f6c65" />
    </linearGradient>
    <linearGradient id="gTile" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stopColor="#fbfaf7" />
      <stop offset="1" stopColor="#e4e1d9" />
    </linearGradient>
    <radialGradient id="gPieLight" cx=".4" cy=".3" r=".9">
      <stop offset="0" stopColor="#ffffff" />
      <stop offset="1" stopColor="#c4c1b9" />
    </radialGradient>
    <radialGradient id="gBall" cx=".35" cy=".3" r=".8">
      <stop offset="0" stopColor="#8f8f8c" />
      <stop offset=".4" stopColor="#222" />
      <stop offset="1" stopColor="#000" />
    </radialGradient>
  </defs>
);

/* ───────── suelo ajedrezado en perspectiva ───────── */
export type Cam = {yH: number; span: number; k: number};
export const proj = (c: Cam, x: number, z: number) => ({
  x: 540 + (x * c.k) / z,
  y: c.yH + c.span / z,
  s: 1 / z,
});

export const Floor: React.FC<{
  id: string;
  cam: Cam;
  tile: number;
  zNear: number;
  zFar: number;
  fade: [number, number, number, number]; // y: 0%, 100%, 100%, 0%
}> = ({id, cam, tile, zNear, zFar, fade}) => {
  const polys: React.ReactNode[] = [];
  const nx = 14;
  const iz0 = Math.floor(zNear / tile);
  const iz1 = Math.ceil(zFar / tile);
  for (let iz = iz0; iz < iz1; iz++) {
    for (let ix = -nx; ix < nx; ix++) {
      const z0 = iz * tile;
      const z1 = (iz + 1) * tile;
      const a = proj(cam, ix * tile, z0);
      const b = proj(cam, (ix + 1) * tile, z0);
      const c = proj(cam, (ix + 1) * tile, z1);
      const d = proj(cam, ix * tile, z1);
      if (Math.max(a.x, b.x, c.x, d.x) < -20 || Math.min(a.x, b.x, c.x, d.x) > 1100) continue;
      const dark = (ix + iz) % 2 === 0;
      polys.push(
        <polygon
          key={`${ix}-${iz}`}
          points={`${a.x},${a.y} ${b.x},${b.y} ${c.x},${c.y} ${d.x},${d.y}`}
          fill={dark ? '#55534f' : '#e2dfd6'}
          stroke={dark ? '#55534f' : '#e2dfd6'}
          strokeWidth={0.6}
        />,
      );
    }
  }
  return (
    <g>
      <linearGradient id={`${id}g`} gradientUnits="userSpaceOnUse" x1={0} y1={fade[0]} x2={0} y2={fade[3]}>
        <stop offset="0" stopColor="#000" />
        <stop offset={(fade[1] - fade[0]) / (fade[3] - fade[0])} stopColor="#fff" />
        <stop offset={(fade[2] - fade[0]) / (fade[3] - fade[0])} stopColor="#fff" />
        <stop offset="1" stopColor="#000" />
      </linearGradient>
      <mask id={id} maskUnits="userSpaceOnUse" x={0} y={0} width={1080} height={1920}>
        <rect width={1080} height={1920} fill={`url(#${id}g)`} />
      </mask>
      <g mask={`url(#${id})`}>{polys}</g>
    </g>
  );
};

/* ───────── peón de ajedrez (origen: centro de la base) ───────── */
export const Pawn: React.FC<{x: number; y: number; s: number; op?: number; dy?: number; blur?: number}> = ({
  x,
  y,
  s,
  op = 1,
  dy = 0,
  blur = 0,
}) => (
  <g transform={`translate(${x} ${y + dy}) scale(${s})`} opacity={op} style={blur ? {filter: `blur(${blur}px)`} : undefined}>
    <ellipse cx={8} cy={5} rx={52} ry={12} fill="rgba(0,0,0,.38)" filter="url(#fBlur6)" />
    <path d="M-44 -2 Q-44 -24 -30 -27 L30 -27 Q44 -24 44 -2 Q44 7 0 7 Q-44 7 -44 -2 Z" fill="url(#gPawnBody)" />
    <ellipse cx={0} cy={-27} rx={31} ry={5} fill="#3a3a39" opacity={0.7} />
    <path d="M-31 -27 C-22 -48 -14 -80 -14 -104 L14 -104 C14 -80 22 -48 31 -27 Z" fill="url(#gPawnBody)" />
    <ellipse cx={0} cy={-104} rx={28} ry={8.5} fill="url(#gPawnBody)" />
    <ellipse cx={0} cy={-107} rx={26} ry={6} fill="none" stroke="rgba(255,255,255,.22)" strokeWidth={1.5} />
    <circle cx={0} cy={-128} r={25} fill="url(#gPawnHead)" />
  </g>
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

/* ───────── moneda y pila de monedas ───────── */
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
          fontWeight={900}
          fontFamily="Montserrat MH, Montserrat, sans-serif"
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

/* ───────── barco de papel (origen: centro, línea de flotación) ───────── */
export const PaperBoat: React.FC<{x: number; y: number; s?: number; rot?: number}> = ({x, y, s = 1, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={20} cy={96} rx={330} ry={26} fill="rgba(0,0,0,.34)" filter="url(#fBlur16)" />
    {/* vela */}
    <polygon points="0,-300 -250,40 0,40" fill="url(#gSailL)" />
    <polygon points="0,-300 250,40 0,40" fill="url(#gSailR)" />
    <polygon points="0,-300 -40,-150 -250,40 0,40" fill="none" stroke="rgba(0,0,0,.14)" strokeWidth={2} />
    <line x1={0} y1={-300} x2={0} y2={40} stroke="rgba(0,0,0,.22)" strokeWidth={2} />
    {/* casco */}
    <polygon points="-340,40 0,40 0,160 -236,160" fill="url(#gHullL)" />
    <polygon points="0,40 340,40 236,160 0,160" fill="url(#gHullR)" />
    <polyline points="-340,40 -236,160 236,160 340,40" fill="none" stroke="rgba(0,0,0,.28)" strokeWidth={2} />
    <line x1={0} y1={40} x2={0} y2={160} stroke="rgba(0,0,0,.25)" strokeWidth={2} />
    <polygon points="-340,40 340,40 330,52 -330,52" fill="rgba(0,0,0,.1)" />
  </g>
);

/* ───────── globo terráqueo con pines y arcos de exportación ───────── */
const D2R = Math.PI / 180;
const globePt = (cx: number, cy: number, r: number, lon: number, lat: number, rot: number) => {
  const d = (lon - rot) * D2R;
  const p = lat * D2R;
  return {
    x: cx + r * Math.cos(p) * Math.sin(d),
    y: cy - r * Math.sin(p),
    vis: Math.cos(p) * Math.cos(d) > 0.05,
    nx: Math.cos(p) * Math.sin(d),
    ny: -Math.sin(p),
  };
};

export const Globe: React.FC<{
  cx: number;
  cy: number;
  r: number;
  rot: number; // grados
  home: [number, number];
  dests: Array<[number, number]>;
  arcP: number; // 0..1 progreso de los arcos
  pinP: number;
  flow: number; // desplazamiento del trazo
}> = ({cx, cy, r, rot, home, dests, arcP, pinP, flow}) => {
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
  const h = globePt(cx, cy, r, home[0], home[1], rot);
  const pts = dests.map((d) => globePt(cx, cy, r, d[0], d[1], rot));
  return (
    <g>
      <ellipse cx={cx + 24} cy={cy + r + 60} rx={r * 0.9} ry={38} fill="rgba(0,0,0,.32)" filter="url(#fBlur16)" />
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
      {/* arcos de exportación */}
      {pts.map((p, i) => {
        if (!p.vis || !h.vis) return null;
        const mx = (h.x + p.x) / 2;
        const my = (h.y + p.y) / 2;
        const lift = 1 + 0.55 * (1 - Math.hypot(mx - cx, my - cy) / r) + 0.2;
        const qx = cx + (mx - cx) * lift;
        const qy = cy + (my - cy) * lift - r * 0.1;
        const local = Math.max(0, Math.min(1, arcP * dests.length - i));
        return (
          <g key={i} opacity={Math.min(1, local * 3)}>
            <path
              d={`M${h.x} ${h.y} Q${qx} ${qy} ${p.x} ${p.y}`}
              fill="none"
              stroke={C.ink}
              strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray="16 14"
              strokeDashoffset={-flow}
              opacity={0.92}
            />
          </g>
        );
      })}
      {pts.map((p, i) => {
        const local = Math.max(0, Math.min(1, arcP * dests.length - i));
        if (!p.vis || local <= 0) return null;
        return <circle key={i} cx={p.x} cy={p.y} r={12 * Math.min(1, local * 2)} fill={C.ink} stroke="#f3f2ec" strokeWidth={4} />;
      })}
      {h.vis && <Pin x={h.x} y={h.y} s={0.9} op={pinP} />}
    </g>
  );
};

/* ───────── pastel con porción del 25 % ───────── */
const sector = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p = (a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
};

export const Pie: React.FC<{cx: number; cy: number; r: number; sweep: number; pull: number}> = ({
  cx,
  cy,
  r,
  sweep,
  pull,
}) => {
  const a0 = -Math.PI / 2;
  const a1 = a0 + sweep;
  const mid = (a0 + a1) / 2;
  const ox = Math.cos(mid) * pull;
  const oy = Math.sin(mid) * pull;
  const depth = 26;
  const layers = [];
  for (let i = depth; i > 0; i -= 2) {
    layers.push(
      <g key={i} transform={`translate(0 ${i})`}>
        <path d={sector(cx, cy, r, a1, a0 + Math.PI * 2)} fill="#a9a69e" />
        <path d={sector(cx + ox, cy + oy, r, a0, a1)} fill="#050505" />
      </g>,
    );
  }
  return (
    <g>
      <ellipse cx={cx + 20} cy={cy + depth + 50} rx={r * 0.95} ry={r * 0.95} fill="rgba(0,0,0,.28)" filter="url(#fBlur16)" />
      {layers}
      <path d={sector(cx, cy, r, a1, a0 + Math.PI * 2)} fill="url(#gPieLight)" stroke="rgba(0,0,0,.18)" strokeWidth={2} />
      <path d={sector(cx + ox, cy + oy, r, a0, a1)} fill="#161616" />
      <path d={sector(cx + ox, cy + oy, r, a0, a1)} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth={2} />
    </g>
  );
};

/* ───────── anillo cíclico (ejercicio fiscal) ───────── */
export const CycleRing: React.FC<{cx: number; cy: number; R: number; g: number; e: number}> = ({cx, cy, R, g, e}) => {
  const blob = (amp: number, phase: number, rr: number) => {
    const n = 180;
    let d = '';
    for (let i = 0; i <= n; i++) {
      const th = (i / n) * Math.PI * 2;
      const r = rr + amp * Math.cos(3 * th - phase);
      const x = cx + r * Math.cos(th - Math.PI / 2);
      const y = cy + r * Math.sin(th - Math.PI / 2);
      d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)} `;
    }
    return d + 'Z';
  };
  const months = ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  const phase = g * 0.045;
  const amp = R * (0.12 + 0.07 * e);
  const th = g * 0.05 - Math.PI / 2;
  return (
    <g>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={C.greyLt} strokeWidth={3} />
      {months.map((m, i) => {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const tx = cx + (R + 54) * Math.cos(a);
        const ty = cy + (R + 54) * Math.sin(a);
        return (
          <g key={i}>
            <circle cx={cx + R * Math.cos(a)} cy={cy + R * Math.sin(a)} r={6} fill={C.greyLt} />
            <text
              x={tx}
              y={ty}
              fontSize={30}
              fontWeight={800}
              fontFamily="Montserrat MH, Montserrat, sans-serif"
              textAnchor="middle"
              dominantBaseline="central"
              fill={C.grey}
            >
              {m}
            </text>
          </g>
        );
      })}
      <path d={blob(amp * 1.0, phase - 0.9, R * 0.74)} fill="none" stroke={C.greyLt} strokeWidth={10} strokeLinejoin="round" />
      <path d={blob(amp, phase, R * 0.74)} fill="rgba(0,0,0,.05)" stroke={C.ink} strokeWidth={16} strokeLinejoin="round" />
      <g>
        <circle cx={cx + R * Math.cos(th) + 8} cy={cy + R * Math.sin(th) + 12} r={26} fill="rgba(0,0,0,.3)" filter="url(#fBlur6)" />
        <circle cx={cx + R * Math.cos(th)} cy={cy + R * Math.sin(th)} r={26} fill="url(#gPinHead)" />
        <ellipse
          cx={cx + R * Math.cos(th) - 8}
          cy={cy + R * Math.sin(th) - 9}
          rx={8}
          ry={5}
          fill="rgba(255,255,255,.7)"
          transform={`rotate(-30 ${cx + R * Math.cos(th) - 8} ${cy + R * Math.sin(th) - 9})`}
        />
      </g>
    </g>
  );
};
