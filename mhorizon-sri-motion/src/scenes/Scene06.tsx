import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../lib/theme';
import {E, P, kf} from '../lib/anim';
import {FloatCard, Svg} from '../lib/stage';
import {Txt} from '../lib/text';
import {Draw, RR} from '../lib/ui';
import {Q} from '../timing';

const q = Q.s6;

// Escena 06 — Resultado tributario y Régimen aplicable: dos módulos relacionados
export const Scene06: React.FC = () => {
  const f = useCurrentFrame();
  const out = P(f, q.out, 12, E.inC);
  const scan = P(f, q.labelA, 34, E.ioC);
  const selX = kf(f, [[q.select - 6, 0], [q.select + 8, 1, E.snap], [q.select + 16, 2, E.snap], [q.settle, 1, E.outExpo]]);
  return (
    <>
      <FloatCard x={90} y={300} w={900} h={470} inAt={q.cardA} outAt={q.out} phase={0.3}>
        <Txt x={40} y={32} text="RESULTADO TRIBUTARIO" size={44} track={-0.03} p={P(f, q.labelA, 16, E.outExpo)} stagger={0.4} />
        <svg width={900} height={470} style={{position: 'absolute', left: 0, top: 0}}>
          <rect x={30} y={124 + scan * 290 - 16} width={840} height={32} rx={10} fill={C.orange} opacity={0.12 * Math.sin(Math.PI * scan)} />
          {[0, 1, 2, 3, 4].map((i) => {
            const rp = P(f, q.labelA + 6 + i * 4, 18, E.outExpo);
            const y = 120 + i * 68;
            return (
              <g key={i}>
                <RR x={40} y={y} w={28} h={28} r={8} fill={C.navy3} />
                <RR x={92} y={y + 8} w={(300 - i * 24) * rp} h={12} r={6} fill={C.mid} />
                <RR x={600} y={y + 8} w={(150 - (i % 3) * 30) * rp} h={12} r={6} fill={C.navy3} />
                <Draw d={`M810 ${y + 14}l8 8l14 -16`} p={P(f, q.labelA + 26 + i * 5, 10, E.outBack)} stroke={C.orange} w={4} />
              </g>
            );
          })}
        </svg>
      </FloatCard>
      <Svg>
        <g opacity={1 - out}><Draw d="M540 796V876" p={P(f, q.line, 18, E.outQuint)} stroke={C.orange} w={3} /></g>
      </Svg>
      <FloatCard x={90} y={900} w={900} h={470} inAt={q.cardB} outAt={q.out} phase={2.2}>
        <Txt x={40} y={32} text="RÉGIMEN APLICABLE" size={44} track={-0.03} color={C.orange} p={P(f, q.labelB, 16, E.outExpo)} stagger={0.4} />
        <svg width={900} height={470} style={{position: 'absolute', left: 0, top: 0}}>
          {[0, 1, 2].map((i) => {
            const x = 40 + i * 284;
            const on = Math.max(0, 1 - Math.abs(selX - i)) > 0.5;
            return (
              <g key={i}>
                <RR x={x} y={116} w={264 * P(f, q.labelB + i * 3, 14, E.outExpo)} h={64} r={32} fill={on ? C.orange : C.navy3} />
                <circle cx={x + 40} cy={148} r={10 * P(f, q.labelB + 6 + i * 3, 10, E.outBack)} fill={on ? '#FFFFFF' : C.mid} />
                <RR x={x + 66} y={142} w={(120 - i * 16) * P(f, q.labelB + 6 + i * 3, 12)} h={12} r={6} fill={on ? '#FFFFFF' : C.mid} />
              </g>
            );
          })}
          <Draw d="M448 180V230" p={P(f, q.settle - 4, 14, E.outQuint)} stroke={C.orange} w={3} />
          {[0, 1, 2].map((i) => (
            <g key={i} opacity={P(f, q.settle + i * 4, 12)}>
              <RR x={40} y={240 + i * 62} w={820} h={46} r={12} fill={C.navy3} />
              <RR x={62} y={257 + i * 62} w={(280 + (i % 2) * 120) * P(f, q.settle + i * 4, 18, E.outExpo)} h={12} r={6} fill={C.mid} />
              <Draw d={`M810 ${263 + i * 62}l8 8l14 -16`} p={P(f, q.settle + 10 + i * 4, 10, E.outBack)} stroke={C.orange} w={4} />
            </g>
          ))}
        </svg>
      </FloatCard>
    </>
  );
};
