import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../lib/theme';
import {E, P, kf, pulse} from '../lib/anim';
import {Svg} from '../lib/stage';
import {Lead, Txt} from '../lib/text';
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
        {/* Onda de atención */}
        {f >= q.pulse && (
          <circle cx={540} cy={900} r={160 + P(f, q.pulse, 24, E.outQuint) * 260} fill="none" stroke={C.orange} strokeWidth={3} opacity={(1 - P(f, q.pulse, 24, E.outQuint)) * 0.6} />
        )}
        <Draw d="M540 560V610" p={P(f, q.converge + 10, 14)} stroke={C.mid} w={2} o={1 - out} />
        <circle cx={540 + Math.cos(spin * 0.05) * 0} cy={900} r={5 * h.s} fill={C.white} opacity={0.0} />
      </Svg>
      <Lead x={540} y={1240} text="Y hay algo" size={88} align="center" p={P(f, q.hay - 4, 18, E.outExpo)} out={out} outDir="up" />
      <Txt x={540} y={1360} text="IMPORTANTE" size={118} track={-0.035} color={C.orange} align="center" p={P(f, q.importante, 16, E.outExpo)} stagger={0.5} out={out} outDir="up"
        scale={kf(f, [[q.importante, 1.12], [q.importante + 14, 1, E.outExpo]])} />
    </>
  );
};
