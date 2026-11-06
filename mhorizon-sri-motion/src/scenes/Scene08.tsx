import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../lib/theme';
import {E, P, kf} from '../lib/anim';
import {Svg} from '../lib/stage';
import {Lead, Txt} from '../lib/text';
import {Draw} from '../lib/ui';
import {Q} from '../timing';

const q = Q.s8;

// Escena 08 — «SIN UTILIDADES ≠ SIN OBLIGACIONES»: composición tipográfica editorial
export const Scene08: React.FC = () => {
  const f = useCurrentFrame();
  const out = P(f, q.out, 12, E.inC);
  const pop = kf(f, [[q.neq, 1.3], [q.neq + 16, 1, E.outExpo]]);
  const b = (i: number) => P(f, q.neq + i * 4, 12, E.outExpo);
  return (
    <>
      <Lead x={540} y={430} text="sin" size={84} align="center" p={P(f, q.sin1, 16, E.outExpo)} out={out} />
      <Txt x={540} y={510} text="UTILIDADES" size={148} track={-0.045} align="center" p={P(f, q.utilidades, 18, E.outExpo)} out={out} />
      <Svg>
        <g opacity={1 - out} transform={`translate(540 850) scale(${pop}) translate(-540 -850)`}>
          <Draw d="M430 825H650" p={b(0)} stroke={C.orange} w={16} />
          <Draw d="M430 885H650" p={b(1)} stroke={C.orange} w={16} />
          <Draw d="M505 945L575 765" p={b(2)} stroke={C.orange} w={16} />
        </g>
      </Svg>
      <Lead x={540} y={1010} text="sin" size={84} align="center" p={P(f, q.sin2, 16, E.outExpo)} out={out} />
      <Txt x={540} y={1090} text="OBLIGACIONES" size={112} track={-0.045} align="center" p={P(f, q.oblig, 18, E.outExpo)} out={out} />
    </>
  );
};
