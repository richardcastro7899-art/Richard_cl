import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../lib/theme';
import {E, P} from '../lib/anim';
import {FloatCard, Svg} from '../lib/stage';
import {Lead, Txt} from '../lib/text';
import {Draw, RR} from '../lib/ui';
import {Q} from '../timing';

const q = Q.s3;
export const DOC_W = 250;
export const DOC_H = 340;
const DOCS = [{x: 132, y: 900, kind: 0}, {x: 414, y: 900, kind: 1}, {x: 696, y: 900, kind: 2}];

/** Ilustración de documento (sin cifras): líneas, campos y marca de verificación. */
export const DocArt: React.FC<{kind: number; p: number; check: number}> = ({kind, p, check}) => {
  const L = (i: number) => P(p, (i / 6) * 0.7, 0.3, E.outC);
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${DOC_W} ${DOC_H}`} style={{position: 'absolute', left: 0, top: 0}}>
      <RR x={22} y={24} w={90 * L(0)} h={12} r={6} fill={C.orange} />
      <RR x={22} y={46} w={150 * L(1)} h={8} r={4} fill={C.navy3} />
      {kind === 0 && [0, 1, 2, 3, 4].map((i) => <RR key={i} x={22} y={86 + i * 38} w={(i % 2 ? 150 : 206) * L(i + 1)} h={10} r={5} fill={C.navy3} />)}
      {kind === 1 && (
        <g>
          {[0, 1, 2, 3].map((r) => <Draw key={r} d={`M22 ${88 + r * 44}H228`} p={L(r + 1)} stroke={C.line} w={1.5} />)}
          <Draw d="M96 88V220M168 88V220" p={L(2)} stroke={C.line} w={1.5} />
          {[0, 1, 2].map((r) => <RR key={r} x={30} y={102 + r * 44} w={54 * L(r + 2)} h={9} r={4} fill={C.navy3} />)}
        </g>
      )}
      {kind === 2 && [0, 1, 2].map((i) => (
        <g key={i}>
          <RR x={22} y={86 + i * 56} w={70 * L(i + 1)} h={9} r={4} fill={C.navy3} />
          <RR x={22} y={104 + i * 56} w={206 * L(i + 2)} h={26} r={8} stroke={C.line} sw={1.5} />
        </g>
      ))}
      <circle cx={DOC_W - 52} cy={DOC_H - 50} r={24} fill="none" stroke={C.line} strokeWidth={2.5} />
      <circle cx={DOC_W - 52} cy={DOC_H - 50} r={24} fill="none" stroke={C.orange} strokeWidth={2.5} opacity={check} />
      <Draw d={`M${DOC_W - 63} ${DOC_H - 50}l8 9l16 -18`} p={check} stroke={C.orange} w={4} />
    </svg>
  );
};

// Escena 03 — «Aunque una empresa registre pérdidas, debe continuar cumpliendo con sus obligaciones tributarias.»
export const Scene03: React.FC = () => {
  const f = useCurrentFrame();
  const out = P(f, q.out, 12, E.inC);
  const bar = (i: number) => P(f, q.neq + i * 6, 14, E.outExpo);
  return (
    <>
      <Lead x={540} y={262} text="Aunque una empresa registre" size={50} align="center" p={P(f, q.lead, 18, E.outExpo)} out={out} />
      <Txt x={540} y={326} text="PÉRDIDAS" size={122} track={-0.035} align="center" p={P(f, q.perdidas, 16, E.outExpo)} stagger={0.5} out={out} />
      <Svg>
        <g opacity={1 - out}>
          <Draw d="M450 545H630" p={bar(0)} stroke={C.orange} w={14} />
          <Draw d="M450 600H630" p={bar(1)} stroke={C.orange} w={14} />
          <Draw d="M515 640L565 505" p={bar(2)} stroke={C.orange} w={14} />
        </g>
      </Svg>
      <Txt x={540} y={702} text="SIN OBLIGACIONES" size={84} track={-0.03} align="center" p={P(f, q.sinOblig, 18, E.outExpo)} out={out} />
      {DOCS.map((d, i) => (
        <FloatCard key={i} x={d.x} y={d.y} w={252} h={343} inAt={q.doc[i]} outAt={q.out} phase={i * 1.7}>
          <DocArt kind={d.kind} p={P(f, q.doc[i] + 6, 24, E.outC)} check={P(f, q.check[i], 12, E.outBack)} />
        </FloatCard>
      ))}
    </>
  );
};
