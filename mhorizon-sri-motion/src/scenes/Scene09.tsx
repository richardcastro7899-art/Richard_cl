import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../lib/theme';
import {E, P, kf} from '../lib/anim';
import {Svg} from '../lib/stage';
import {Txt} from '../lib/text';
import {Draw} from '../lib/ui';
import {arc, toPath} from '../lib/geometry';
import {Q} from '../timing';
import {LOGO_SRC} from '../brand';

const q = Q.s9;
const SUN = {x: 540, y: 690};

// Escena 09 — Cierre corporativo MHORIZON: «TU EMPRESA AL DÍA»
export const Scene09: React.FC = () => {
  const f = useCurrentFrame();
  const settle = P(f, q.brand, 40, E.outExpo);
  return (
    <>
      <Svg>
        {/* arcos concéntricos del horizonte */}
        {[190, 275, 370].map((r, i) => (
          <Draw key={r} d={toPath(arc(SUN.x, SUN.y, r, 180, 360, 60))} p={P(f, q.brand + 6 + i * 8, 40, E.outQuint)} stroke={C.orange} w={i === 0 ? 2.5 : 1.8} o={0.55 - i * 0.14} />
        ))}
        {/* rayos lineales */}
        {Array.from({length: 13}).map((_, i) => {
          const a = Math.PI + ((i + 0.5) / 13) * Math.PI;
          const r0 = 135;
          const len = 40 + ((i * 37) % 5) * 14;
          const t = P(f, q.brand + 10 + i * 1.5, 22, E.outExpo);
          return <line key={i} x1={SUN.x + Math.cos(a) * r0} y1={SUN.y + Math.sin(a) * r0} x2={SUN.x + Math.cos(a) * (r0 + len * t)} y2={SUN.y + Math.sin(a) * (r0 + len * t)} stroke={C.orange} strokeWidth={2.5} strokeLinecap="round" opacity={0.7 * t} />;
        })}
        {/* esquinas editoriales */}
        {[[90, 250, 1, 1], [990, 250, -1, 1], [90, 1480, 1, -1], [990, 1480, -1, -1]].map(([x, y, sx, sy], i) => (
          <Draw key={i} d={`M${x} ${(y as number) + 70 * (sy as number)}V${y}H${(x as number) + 70 * (sx as number)}`} p={P(f, q.brand + 14 + i * 3, 24, E.outQuint)} stroke={C.orange} w={3} o={0.9} />
        ))}
        <Draw d="M300 1000H780" p={P(f, q.tu - 4, 26, E.outQuint)} stroke={C.line} w={1.5} />
        <Draw d="M240 1405H840" p={P(f, q.alDia + 10, 30, E.outQuint)} stroke={C.orange} w={2} o={0.8} />
      </Svg>
      {LOGO_SRC ? (
        <img src={LOGO_SRC} style={{position: 'absolute', left: 340, top: 780, width: 400, opacity: P(f, q.brand, 14)}} />
      ) : (
        <Txt x={540} y={800} text="MHORIZON" size={120} weight={800} track={0.03} align="center" p={P(f, q.brand, 20, E.outExpo)} stagger={0.6}
          scale={kf(f, [[q.brand, 1.08], [q.brand + 40, 1, E.outExpo]])} />
      )}
      <Txt x={540} y={1030} text="TU EMPRESA" size={132} track={-0.04} align="center" p={P(f, q.tu, 18, E.outExpo)} stagger={0.5} />
      <Txt x={540} y={1170} text="AL DÍA" size={160} track={-0.04} color={C.orange} align="center" p={P(f, q.alDia, 18, E.outExpo)} stagger={0.5}
        scale={kf(f, [[q.alDia, 1.1], [q.alDia + 16, 1, E.outExpo]])} />
      <Txt x={540} y={1440} text="CONSULTORÍA TRIBUTARIA Y EMPRESARIAL" size={25} weight={500} track={0.22} color={C.grey} align="center" p={P(f, q.alDia + 20, 20, E.outExpo)} />
    </>
  );
};
