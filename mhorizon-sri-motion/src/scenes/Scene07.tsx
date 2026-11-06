import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../lib/theme';
import {E, P, kf, pulse} from '../lib/anim';
import {Plane, Svg} from '../lib/stage';
import {Txt} from '../lib/text';
import {Draw, RR} from '../lib/ui';
import {Q} from '../timing';
import {D1, D2} from './layout';

const q = Q.s7;

// Escena 07 — Declaraciones y anexos: documentos SVG que se construyen, se completan y se verifican
export const Scene07: React.FC = () => {
  const f = useCurrentFrame();
  if (f > 936) return null;
  const fade = 1 - P(f, q.out, 8, E.inC);
  const d2In = P(f, q.doc2 - 6, 24, E.outExpo);
  const seg = P(f, q.segun - 2, 20, E.outExpo);
  const seal = pulse(f, q.verify, 18);
  const shell: React.CSSProperties = {position: 'absolute', inset: 0, borderRadius: 20, background: C.navy2, border: `1.5px solid ${C.line}`, boxShadow: '0 30px 80px rgba(23,30,39,0.10)', overflow: 'hidden'};
  return (
    <>
      {/* Documento 1 — Declaraciones */}
      <Plane x={D1.x} y={D1.y} w={D1.w} h={D1.h} z={30} ry={0}>
        <div style={shell}>
          <svg width={D1.w} height={D1.h} style={{opacity: fade}}>
            <RR x={40} y={38} w={230 * P(f, q.doc1, 14, E.outExpo)} h={18} r={9} fill={C.orange} />
            <RR x={40} y={72} w={340 * P(f, q.doc1 + 4, 16, E.outExpo)} h={10} r={5} fill={C.mid} />
            <Draw d="M40 108H480" p={P(f, q.doc1 + 6, 20, E.outQuint)} stroke={C.line} w={1.5} />
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const y = 130 + i * 74;
              const t = P(f, q.doc1 + 14 + i * 6, 12, E.outExpo);
              const fillP = P(f, q.doc1 + 22 + i * 7, 14, E.outC);
              return (
                <g key={i} opacity={t}>
                  <RR x={40} y={y} w={(120 + (i % 3) * 40)} h={10} r={5} fill={C.mid} />
                  <RR x={40} y={y + 24} w={440} h={34} r={10} stroke={C.line} sw={1.5} />
                  <RR x={50} y={y + 36} w={(200 + ((i * 53) % 150)) * fillP} h={10} r={5} fill={C.soft} o={0.85} />
                  <Draw d={`M446 ${y + 41}l7 7l13 -15`} p={P(f, q.doc1 + 34 + i * 7, 10, E.outBack)} stroke={C.orange} w={3.5} />
                </g>
              );
            })}
            <circle cx={450} cy={56} r={22} fill="none" stroke={C.line} strokeWidth={2.5} />
            <circle cx={450} cy={56} r={22} fill="none" stroke={C.orange} strokeWidth={2.5} opacity={P(f, q.check1, 8)} />
            <Draw d="M440 56l7 8l14 -16" p={P(f, q.check1, 10, E.outBack)} stroke={C.orange} w={4} />
          </svg>
        </div>
      </Plane>
      <Txt x={100} y={292} text="DECLARACIONES" size={60} track={-0.03} p={P(f, q.decl, 16, E.outExpo)} stagger={0.45} out={1 - fade} />

      {/* Documento 2 — Anexos (en primer plano, desplazado) */}
      <Plane x={D2.x} y={D2.y + (1 - d2In) * 140} w={D2.w} h={D2.h} z={kf(f, [[q.doc2 - 6, -100], [q.doc2 + 18, 90, E.outExpo]])} ry={(1 - d2In) * -30} o={d2In}>
        <div style={shell}>
          <svg width={D2.w} height={D2.h} style={{opacity: fade}}>
            <RR x={40} y={40} w={440} h={46} r={12} fill={C.orange} o={0.9 * P(f, q.doc2 + 4, 14, E.outExpo)} />
            {[0, 1, 2].map((i) => <RR key={i} x={58 + i * 150} y={58} w={(80 - i * 12) * P(f, q.doc2 + 8 + i * 2, 12)} h={10} r={5} fill={C.white} />)}
            {[0, 1, 2, 3, 4, 5].map((r) => (
              <g key={r}>
                <Draw d={`M40 ${86 + (r + 1) * 66}H480`} p={P(f, q.doc2 + 8 + r * 3, 18, E.outQuint)} stroke={C.line} w={1.5} />
                <RR x={58} y={112 + r * 66} w={(70 + (r % 3) * 24) * P(f, q.doc2 + 12 + r * 4, 14, E.outExpo)} h={10} r={5} fill={C.mid} />
                <RR x={208} y={112 + r * 66} w={(80 + ((r * 31) % 40)) * P(f, q.doc2 + 14 + r * 4, 14, E.outExpo)} h={10} r={5} fill={C.soft} o={0.8} />
                <Draw d={`M434 ${118 + r * 66}l7 7l13 -15`} p={P(f, q.doc2 + 22 + r * 4, 10, E.outBack)} stroke={C.orange} w={3.5} />
              </g>
            ))}
            <Draw d="M180 86V482M360 86V482" p={P(f, q.doc2 + 10, 24, E.outQuint)} stroke={C.line} w={1.5} />
          </svg>
        </div>
      </Plane>
      <Txt x={980} y={1272} text="ANEXOS" size={60} track={-0.03} align="right" p={P(f, q.anexos, 16, E.outExpo)} stagger={0.45} out={1 - fade} />

      {/* SEGÚN CORRESPONDA */}
      {seg > 0.02 && <div style={{position: 'absolute', left: 540 - 330 * seg, top: 1388, width: 660 * seg, height: 84, borderRadius: 42, border: `2px solid ${C.orange}`, background: 'rgba(212,104,28,0.14)', opacity: fade}} />}
      <Txt x={540} y={1410} text="SEGÚN CORRESPONDA" size={40} weight={700} track={0.1} align="center" p={P(f, q.segun + 4, 14, E.outExpo)} out={1 - fade} />

      {/* Sello de verificación (el anillo héroe) */}
      <Svg>
        {f >= q.verify - 2 && (
          <g opacity={fade}>
            <circle cx={900} cy={330} r={39 + seal * 22} fill="none" stroke={C.orange} strokeWidth={2} opacity={(1 - seal) * 0.6} />
            <Draw d="M882 332l13 14l26 -30" p={P(f, q.verify, 10, E.outBack)} stroke={C.white} w={7} />
          </g>
        )}
      </Svg>
    </>
  );
};
