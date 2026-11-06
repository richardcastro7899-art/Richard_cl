import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../lib/theme';
import {E, P, kf} from '../lib/anim';
import {Svg} from '../lib/stage';
import {Lead, Txt} from '../lib/text';
import {Draw} from '../lib/ui';
import {heroXform} from '../Hero';
import {Q} from '../timing';

const q = Q.s2;
const TRI = [[0, -215], [-235, 175], [235, 175]];

// Escena 02 — "Cuidado, porque esto no es así": la gráfica se convierte en señal de advertencia
export const Scene02: React.FC = () => {
  const f = useCurrentFrame();
  const h = heroXform(Math.min(f, 224));
  const ex = P(f, q.hit + 4, 16, E.outExpo);
  const out = P(f, q.out, 14, E.inC);
  const outT = P(f, q.out, 16, E.inC);
  const fade = 1 - P(f, q.out - 2, 12, E.inC);
  // Ecos de la señal (ondas de alerta)
  const echoes = [0, 7, 14].map((d) => P(f, q.rings + d, 30, E.outQuint));
  return (
    <>
      <Svg>
        {/* Ondas de alerta: copias del triángulo que se expanden */}
        {echoes.map((t, i) => {
          if (t <= 0 || t >= 1) return null;
          const sc = 1 + t * (0.55 + i * 0.12);
          const pts = TRI.map(([x, y]) => `${h.x + x * h.s * sc},${h.y + y * h.s * sc}`).join(' ');
          return <polygon key={i} points={pts} fill="none" stroke={C.orange} strokeWidth={3 - i * 0.6} strokeLinejoin="round" opacity={(1 - t) * 0.55 * fade} />;
        })}
        {/* Exclamación */}
        <g opacity={fade}>
          <Draw d={`M540 ${h.y - 120}V${h.y + 62}`} p={ex} stroke={C.white} w={22} />
          <circle cx={540} cy={h.y + 128} r={14 * P(f, q.hit + 12, 10, E.outBack)} fill={C.white} />
        </g>
      </Svg>
      <Lead x={540} y={1016} text="porque esto" size={70} align="center" p={P(f, q.esto - 4, 16, E.outExpo)} out={outT} outDir="left" />
      <Txt x={540} y={1100} text="NO" size={340} weight={800} track={-0.04} color={C.orange} align="center" p={P(f, q.no, 10, E.outExpo)} out={outT} outDir="right"
        scale={kf(f, [[q.no, 1.45], [q.no + 12, 1, E.outExpo]])} />
      <Txt x={540} y={1410} text="ES ASÍ" size={110} weight={800} track={0.02} color={C.white} align="center" p={P(f, q.esAsi, 12, E.outExpo)} stagger={0.4} out={outT} outDir="left" />
    </>
  );
};
