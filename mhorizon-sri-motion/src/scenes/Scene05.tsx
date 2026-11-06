import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../lib/theme';
import {E, P} from '../lib/anim';
import {FloatCard} from '../lib/stage';
import {Txt} from '../lib/text';
import {Draw, RR} from '../lib/ui';
import {Q} from '../timing';

const q = Q.s5;
const BARS = [64, 110, 92, 160, 206, 148, 232]; // alturas ilustrativas (sin valores)
const ROWS = [104, 168, 232];

// Escena 05 — Pérdida contable · «No necesariamente es cero» · Impuesto a la Renta
export const Scene05: React.FC = () => {
  const f = useCurrentFrame();
  const out = P(f, q.out, 12, E.inC);
  return (
    <>
      <FloatCard x={90} y={300} w={900} h={450} inAt={q.top} outAt={q.out} phase={0.5}>
        <Txt x={40} y={30} text="PÉRDIDA CONTABLE" size={44} track={-0.03} p={P(f, q.label1, 16, E.outExpo)} stagger={0.4} />
        <svg width={900} height={450} style={{position: 'absolute', left: 0, top: 0}}>
          <Draw d="M40 150H860" p={P(f, q.top + 8, 24, E.outQuint)} stroke={C.mid} w={2.5} />
          {BARS.map((h, i) => <RR key={i} x={80 + i * 112} y={150} w={64} h={h * P(f, q.bars + i * 4, 22, E.outExpo)} r={8} fill={i === 6 ? C.soft : C.mid} />)}
          <Draw d={`M112 ${150 + BARS[0]}${BARS.map((h, i) => `L${112 + i * 112} ${150 + h}`).join('')}`} p={P(f, q.bars + 8, 34, E.ioC)} stroke={C.orange} w={4} />
        </svg>
      </FloatCard>

      <Txt x={540} y={808} text="NO NECESARIAMENTE" size={60} track={-0.03} align="center" p={P(f, q.no, 22, E.outExpo)} stagger={0.6} out={out} />
      <Txt x={540} y={884} text="ES CERO" size={92} track={-0.035} align="center" p={P(f, q.esCero, 16, E.outExpo)} stagger={0.4} out={out} split={[{from: 3, to: 7, color: C.orange}]} />

      <FloatCard x={90} y={1060} w={900} h={360} inAt={q.label2 - 6} outAt={q.out} phase={2}>
        <Txt x={40} y={30} text="IMPUESTO A LA RENTA" size={44} track={-0.03} color={C.orange} p={P(f, q.label2, 16, E.outExpo)} stagger={0.4} />
        <svg width={900} height={360} style={{position: 'absolute', left: 0, top: 0}}>
          {ROWS.map((y, i) => {
            const rp = P(f, q.calc + i * 12, 26, E.ioC);
            return (
              <g key={i}>
                <RR x={40} y={y} w={(i === 1 ? 90 : 130) * P(f, q.calc + i * 12 - 4, 14)} h={12} r={6} fill={C.mid} />
                <RR x={230} y={y - 4} w={400} h={20} r={10} fill={C.navy3} />
                <RR x={230} y={y - 4} w={400 * rp} h={20} r={10} fill={i === 2 ? C.orange : C.mid} />
                <Draw d={`M660 ${y + 6}l8 8l14 -16`} p={P(f, q.calc + i * 12 + 24, 10, E.outBack)} stroke={C.orange} w={4} />
              </g>
            );
          })}
          <g opacity={P(f, q.result - 8, 10)}>
            <RR x={730} y={96} w={130} h={150} r={22} fill={C.orange} o={0.12 + 0.88 * P(f, q.result, 10)} />
            {[40, 78, 118].map((h, i) => <RR key={i} x={750 + i * 36} y={226 - h * P(f, q.result + 4 + i * 4, 14, E.outBack)} w={24} h={h * P(f, q.result + 4 + i * 4, 14, E.outBack)} r={5} fill="#FFFFFF" />)}
          </g>
        </svg>
      </FloatCard>
    </>
  );
};
