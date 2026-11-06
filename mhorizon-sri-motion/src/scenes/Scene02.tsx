import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../lib/theme';
import {E, P, kf} from '../lib/anim';
import {Svg} from '../lib/stage';
import {Lead, Txt} from '../lib/text';
import {Draw} from '../lib/ui';
import {Q} from '../timing';

const q = Q.s2;

// Escena 02 — «Cuidado, porque esto no es así.»
export const Scene02: React.FC = () => {
  const f = useCurrentFrame();
  const out = P(f, q.out, 12, E.inC);
  const tri = P(f, q.tri, 22, E.outExpo);
  const echo = P(f, q.tri + 6, 34, E.outQuint);
  return (
    <>
      <Svg>
        <g opacity={1 - out} style={{transform: `translateY(${-out * 40}px)`}}>
          {echo > 0 && echo < 1 && <path d="M370 700L540 410L710 700Z" fill="none" stroke={C.orange} strokeWidth={2} strokeLinejoin="round" opacity={(1 - echo) * 0.4}
            transform={`translate(540 600) scale(${1 + echo * 0.35}) translate(-540 -600)`} />}
          <Draw d="M370 700L540 410L710 700Z" p={tri} stroke={C.orange} w={14} />
          <Draw d="M540 505V610" p={P(f, q.tri + 12, 14, E.outExpo)} stroke={C.white} w={16} />
          <circle cx={540} cy={655} r={10 * P(f, q.tri + 22, 10, E.outBack)} fill={C.white} />
        </g>
      </Svg>
      <Lead x={540} y={800} text="porque esto" size={68} align="center" p={P(f, q.esto, 16, E.outExpo)} out={out} />
      <Txt x={540} y={870} text="NO" size={300} track={-0.04} color={C.orange} align="center" p={P(f, q.no, 10, E.outExpo)} out={out}
        scale={kf(f, [[q.no, 1.35], [q.no + 12, 1, E.outExpo]])} />
      <Txt x={540} y={1190} text="ES ASÍ" size={108} track={0.01} align="center" p={P(f, q.esAsi, 14, E.outExpo)} stagger={0.4} out={out} />
    </>
  );
};
