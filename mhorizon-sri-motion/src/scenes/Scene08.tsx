import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../lib/theme';
import {E, P, lerp, kf} from '../lib/anim';
import {Svg} from '../lib/stage';
import {Txt} from '../lib/text';
import {Q} from '../timing';
import {D1, D2} from './layout';

const q = Q.s8;
// Líneas-guía donde los documentos se convierten en tipografía
const BA = {x: 145, y: 470, w: 790, h: 142};
const BB = {x: 145, y: 1250, w: 790, h: 112};
const RULE = 6;

const Band: React.FC<{f: number; from: typeof D1; to: typeof BA; expand: number; reveal: number}> = ({f, from, to, expand, reveal}) => {
  const m = P(f, q.bands, 30, E.ioQuart);
  const ex = P(f, expand, 12, E.outExpo);
  const re = P(f, reveal - 6, 20, E.ioQuart);
  // rectángulo documento → línea fina → banda completa → se retira hacia arriba descubriendo la palabra
  const h = f < expand ? lerp(from.h, RULE, m) : lerp(RULE, to.h, ex);
  const x = lerp(from.x, to.x, m);
  const w = lerp(from.w, to.w, m);
  const cy = lerp(from.y + from.h / 2, to.y + to.h / 2, m);
  const top = f < expand ? cy - h / 2 : lerp(to.y + to.h / 2 - h / 2, to.y + to.h, re) ;
  const hh = f < expand ? h : lerp(h, 0, re);
  const o = 1 - P(f, reveal + 18, 4, E.lin);
  const col = f < q.bands + 18 ? C.navy2 : C.orange;
  return <rect x={x} y={top} width={w} height={Math.max(0, hh)} rx={lerp(20, 3, m)} fill={m < 0.4 ? C.navy2 : C.orange} stroke={C.line} strokeWidth={m < 0.4 ? 1.5 : 0} opacity={o} />;
};

// Escena 08 — "SIN UTILIDADES ≠ SIN OBLIGACIONES": documentos que se transforman en tipografía editorial
export const Scene08: React.FC = () => {
  const f = useCurrentFrame();
  if (f < 936) return null;
  const out = P(f, q.out, 18, E.inC);
  const burst = P(f, q.neq, 20, E.outQuint);
  return (
    <>
      <Svg>
        <Band f={f} from={D1} to={BA} expand={q.sin1 + 2} reveal={q.utilidades} />
        <Band f={f} from={D2} to={BB} expand={q.sin2} reveal={q.oblig} />
        {/* ráfaga de énfasis en ≠ */}
        {f >= q.neq && burst < 1 && Array.from({length: 16}).map((_, i) => {
          const a = (i / 16) * Math.PI * 2;
          const r0 = 250 + burst * 120;
          const r1 = r0 + 40 * (1 - burst);
          return <line key={i} x1={540 + Math.cos(a) * r0} y1={890 + Math.sin(a) * r0} x2={540 + Math.cos(a) * r1} y2={890 + Math.sin(a) * r1} stroke={C.orange} strokeWidth={4} strokeLinecap="round" opacity={1 - burst} />;
        })}
      </Svg>
      <Txt x={540} y={392} text="SIN" size={64} weight={600} track={0.4} color={C.soft} align="center" p={P(f, q.sin1, 14, E.outExpo)} out={out} outDir="up" />
      <Txt x={BA.x + BA.w / 2} y={BA.y + 2} text="UTILIDADES" size={148} track={-0.045} align="center" p={P(f, q.utilidades, 18, E.outExpo)} out={out} outDir="left" />
      <Txt x={540} y={1172} text="SIN" size={64} weight={600} track={0.4} color={C.soft} align="center" p={P(f, q.sin2, 14, E.outExpo)} out={out} outDir="down" />
      <Txt x={BB.x + BB.w / 2} y={BB.y + 2} text="OBLIGACIONES" size={112} track={-0.045} color={C.white} align="center" p={P(f, q.oblig, 18, E.outExpo)} out={out} outDir="right"
        split={[{from: 0, to: 12, color: C.white}]} />
    </>
  );
};
