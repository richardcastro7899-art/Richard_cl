import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../lib/theme';
import {E, P, kf, pulse} from '../lib/anim';
import {Svg} from '../lib/stage';
import {Txt} from '../lib/text';
import {Draw} from '../lib/ui';
import {heroXform} from '../Hero';
import {Q} from '../timing';

const q = Q.s4;

// Escena 04 — "Y hay algo importante": reducción de elementos hacia el centro, anticipación y pausa
export const Scene04: React.FC = () => {
  const f = useCurrentFrame();
  const h = heroXform(f);
  const out = P(f, 458, 14, E.inC);
  const ticksP = P(f, q.converge + 6, 26, E.outQuint);
  const pl = pulse(f, q.pulse, 20);
  const spin = f * 0.35;
  return (
    <>
      <Svg>
        {/* Dial de atención: marcas radiales alrededor del anillo */}
        <g transform={`translate(540 900) rotate(${-spin})`} opacity={(1 - out) * 0.9}>
          {Array.from({length: 48}).map((_, i) => {
            const a = (i / 48) * Math.PI * 2;
            const r0 = 262 + pl * 14;
            const long = i % 4 === 0;
            const r1 = r0 + (long ? 26 : 12);
            const t = P(f, q.converge + 4 + i * 0.35, 12, E.outC) * ticksP;
            return <line key={i} x1={Math.cos(a) * r0} y1={Math.sin(a) * r0} x2={Math.cos(a) * (r0 + (r1 - r0) * t)} y2={Math.sin(a) * (r0 + (r1 - r0) * t)} stroke={long ? C.orange : C.mid} strokeWidth={long ? 3 : 2} strokeLinecap="round" />;
          })}
        </g>
        {/* Onda de atención */}
        {f >= q.pulse && (
          <circle cx={540} cy={900} r={160 + P(f, q.pulse, 24, E.outQuint) * 260} fill="none" stroke={C.orange} strokeWidth={3} opacity={(1 - P(f, q.pulse, 24, E.outQuint)) * 0.6} />
        )}
        <Draw d="M540 560V610" p={P(f, q.converge + 10, 14)} stroke={C.mid} w={2} o={1 - out} />
        <circle cx={540 + Math.cos(spin * 0.05) * 0} cy={900} r={5 * h.s} fill={C.white} opacity={0.0} />
      </Svg>
      <Txt x={540} y={1245} text="HAY ALGO" size={112} track={-0.03} align="center" p={P(f, q.hay, 16, E.outExpo)} stagger={0.4} out={out} outDir="up" />
      <Txt x={540} y={1360} text="IMPORTANTE" size={118} track={-0.035} color={C.orange} align="center" p={P(f, q.importante, 16, E.outExpo)} stagger={0.5} out={out} outDir="up"
        scale={kf(f, [[q.importante, 1.12], [q.importante + 14, 1, E.outExpo]])} />
    </>
  );
};
