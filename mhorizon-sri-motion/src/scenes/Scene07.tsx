import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../lib/theme';
import {E, P} from '../lib/anim';
import {FloatCard} from '../lib/stage';
import {Lead, Txt} from '../lib/text';
import {Draw, RR} from '../lib/ui';
import {Q} from '../timing';

const q = Q.s7;
const ART: React.CSSProperties = {position: 'absolute', left: 22, top: 96, width: 520, height: 600, transform: 'scale(0.8)', transformOrigin: '0 0'};

// Escena 07 — Declaraciones y anexos: dos documentos que se completan y se verifican
export const Scene07: React.FC = () => {
  const f = useCurrentFrame();
  const out = P(f, q.out, 12, E.inC);
  const seg = P(f, q.segun, 20, E.outExpo);
  return (
    <>
      <Lead x={540} y={520} text="debe presentar las" size={66} align="center" p={P(f, q.lead, 18, E.outExpo)} out={out} />
      <FloatCard x={66} y={680} w={456} h={590} inAt={q.doc1} outAt={q.out} phase={0.4}>
        <Txt x={30} y={30} text="DECLARACIONES" size={40} track={-0.03} p={P(f, q.decl, 16, E.outExpo)} stagger={0.4} />
        <div style={ART}>
          <svg width={520} height={600}>
            <RR x={40} y={20} w={230 * P(f, q.doc1, 14, E.outExpo)} h={16} r={8} fill={C.orange} />
            <Draw d="M40 62H480" p={P(f, q.doc1 + 6, 20, E.outQuint)} stroke={C.line} w={1.5} />
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const y = 86 + i * 80;
              const t = P(f, q.doc1 + 14 + i * 6, 12, E.outExpo);
              const fillP = P(f, q.doc1 + 22 + i * 7, 14, E.outC);
              return (
                <g key={i} opacity={t}>
                  <RR x={40} y={y} w={120 + (i % 3) * 40} h={10} r={5} fill={C.navy3} />
                  <RR x={40} y={y + 24} w={440} h={36} r={10} stroke={C.line} sw={1.5} />
                  <RR x={52} y={y + 37} w={(200 + ((i * 53) % 150)) * fillP} h={10} r={5} fill={C.mid} />
                  <Draw d={`M446 ${y + 42}l7 7l13 -15`} p={P(f, q.doc1 + 34 + i * 7, 10, E.outBack)} stroke={C.orange} w={4} />
                </g>
              );
            })}
          </svg>
        </div>
        <svg width={456} height={590} style={{position: 'absolute', left: 0, top: 0}}>
          <circle cx={410} cy={50} r={20} fill="none" stroke={C.line} strokeWidth={2.5} />
          <circle cx={410} cy={50} r={20} fill="none" stroke={C.orange} strokeWidth={2.5} opacity={P(f, q.check1, 8)} />
          <Draw d="M401 50l6 7l12 -14" p={P(f, q.check1, 10, E.outBack)} stroke={C.orange} w={4} />
        </svg>
      </FloatCard>
      <FloatCard x={558} y={680} w={456} h={590} inAt={q.doc2 - 4} outAt={q.out} phase={2.3}>
        <Txt x={30} y={30} text="ANEXOS" size={40} track={-0.03} p={P(f, q.anexos, 16, E.outExpo)} stagger={0.4} />
        <div style={ART}>
          <svg width={520} height={600}>
            <RR x={40} y={20} w={440} h={46} r={12} fill={C.orange} o={P(f, q.doc2 + 4, 14, E.outExpo)} />
            {[0, 1, 2].map((i) => <RR key={i} x={60 + i * 150} y={37} w={(80 - i * 12) * P(f, q.doc2 + 8 + i * 2, 12)} h={10} r={5} fill="#FFFFFF" />)}
            {[0, 1, 2, 3, 4, 5].map((r) => (
              <g key={r}>
                <Draw d={`M40 ${66 + (r + 1) * 76}H480`} p={P(f, q.doc2 + 8 + r * 3, 18, E.outQuint)} stroke={C.line} w={1.5} />
                <RR x={60} y={100 + r * 76} w={(70 + (r % 3) * 24) * P(f, q.doc2 + 12 + r * 4, 14, E.outExpo)} h={10} r={5} fill={C.mid} />
                <RR x={210} y={100 + r * 76} w={(80 + ((r * 31) % 40)) * P(f, q.doc2 + 14 + r * 4, 14, E.outExpo)} h={10} r={5} fill={C.navy3} />
                <Draw d={`M434 ${106 + r * 76}l7 7l13 -15`} p={P(f, q.doc2 + 22 + r * 4, 10, E.outBack)} stroke={C.orange} w={4} />
              </g>
            ))}
            <Draw d="M180 66V520M360 66V520" p={P(f, q.doc2 + 10, 24, E.outQuint)} stroke={C.line} w={1.5} />
          </svg>
        </div>
      </FloatCard>
      {seg > 0.02 && (
        <div style={{position: 'absolute', left: 540 - 320 * seg, top: 1366, width: 640 * seg, height: 80, borderRadius: 40, border: `2px solid ${C.orange}`, opacity: 1 - out, overflow: 'hidden'}} />
      )}
      <Txt x={540} y={1388} text="SEGÚN CORRESPONDA" size={38} weight={700} track={0.1} color={C.orange} align="center" p={P(f, q.segun + 4, 14, E.outExpo)} out={out} />
    </>
  );
};
