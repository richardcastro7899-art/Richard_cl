import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../lib/theme';
import {E, P, kf, lerp} from '../lib/anim';
import {Plane, Svg} from '../lib/stage';
import {Txt} from '../lib/text';
import {Draw, RR} from '../lib/ui';
import {pointAt, Pt} from '../lib/geometry';
import {Q} from '../timing';
import {D1, D2} from './layout';

const q = Q.s6;
const A = {x: 110, y: 320, w: 860, h: 470};
const B = {x: 110, y: 1050, w: 860, h: 430};

// Escena 06 — Resultado tributario + Régimen aplicable: dos sistemas relacionados
export const Scene06: React.FC = () => {
  const f = useCurrentFrame();
  const aIn = P(f, q.cardA, 26, E.outExpo);
  const bIn = P(f, q.cardB - 6, 26, E.outExpo);
  const morph = P(f, q.out, 30, E.ioQuart); // las tarjetas se convierten en documentos (escena 07)
  const content = 1 - P(f, q.out - 2, 12, E.inC);
  const scan = P(f, q.labelA, 34, E.ioC);
  const sel = f < q.select ? 0 : f < q.select + 8 ? 1 : f < q.select + 16 ? 2 : 1;
  const selX = kf(f, [[q.select - 6, 0], [q.select + 8, 1, E.snap], [q.select + 16, 2, E.snap], [q.settle, 1, E.outExpo]]);
  const rowsA = [0, 1, 2, 3, 4];
  const lineP = (a: number, b: number) => P(f, a, b, E.outQuint);
  const packet = (s: number, p0: Pt, p1: Pt) => {
    const t = P(f, s, 22, E.ioC);
    if (t <= 0 || t >= 1) return null;
    return <circle cx={lerp(p0[0], p1[0], t)} cy={lerp(p0[1], p1[1], t)} r={7} fill={C.white} />;
  };
  const geoA = {x: lerp(A.x, D1.x, morph), y: lerp(A.y, D1.y, morph), w: lerp(A.w, D1.w, morph), h: lerp(A.h, D1.h, morph)};
  const geoB = {x: lerp(B.x, D2.x, morph), y: lerp(B.y, D2.y, morph), w: lerp(B.w, D2.w, morph), h: lerp(B.h, D2.h, morph)};
  return (
    <>
      {/* Conexión de datos */}
      <Svg>
        <g opacity={content}>
          <Draw d="M540 792V874" p={lineP(q.hub, 16)} stroke={C.orange} w={3} />
          <Draw d="M540 986V1048" p={lineP(q.cardB + 4, 18)} stroke={C.orange} w={3} />
          {[-1, 1].map((d) => <Draw key={d} d={`M${540 + d * 110} 930H${540 + d * 400}`} p={lineP(q.hub + 4, 24)} stroke={C.mid} w={2} dash="6 9" />)}
          {packet(q.pulses, [540, 800], [540, 876])}
          {packet(q.pulses + 26, [540, 800], [540, 876])}
          {packet(q.pulses + 40, [540, 986], [540, 1046])}
          {packet(q.pulses + 58, [540, 986], [540, 1046])}
        </g>
      </Svg>

      <Plane x={geoA.x} y={geoA.y + (1 - aIn) * -160} w={geoA.w} h={geoA.h} z={kf(f, [[q.cardA, -120], [q.cardA + 26, 30, E.outExpo]])} rx={(1 - aIn) * -35} ry={(1 - morph) * 5} o={aIn}>
        <div style={{position: 'absolute', inset: 0, borderRadius: lerp(30, 20, morph), background: C.navy2, border: `1.5px solid ${C.line}`, boxShadow: '0 40px 110px rgba(4,7,11,0.55)', overflow: 'hidden'}}>
          <div style={{opacity: content}}>
            <svg width={A.w} height={A.h} style={{position: 'absolute', left: 0, top: 0}}>
              <RR x={40} y={96} w={780} h={1.5} r={1} fill={C.line} />
              {rowsA.map((i) => {
                const rp = P(f, q.labelA + 6 + i * 4, 18, E.outExpo);
                const y = 130 + i * 62;
                const hot = scan > (y - 120) / 320 && scan < (y - 120) / 320 + 0.18;
                return (
                  <g key={i}>
                    <RR x={40} y={y} w={30} h={30} r={8} fill={hot ? C.orange : C.navy3} stroke={C.line} />
                    <RR x={92} y={y + 9} w={(300 - i * 24) * rp} h={12} r={6} fill={C.mid} />
                    <RR x={560} y={y + 9} w={(150 - (i % 3) * 30) * rp} h={12} r={6} fill={hot ? C.white : C.navy3} />
                    <Draw d={`M770 ${y + 16}l8 8l14 -16`} p={P(f, q.labelA + 26 + i * 5, 10, E.outBack)} stroke={C.orange} w={3.5} />
                  </g>
                );
              })}
              {/* haz de análisis */}
              <rect x={30} y={120 + scan * 320 - 12} width={800} height={26} fill={C.orange} opacity={0.16 * Math.sin(Math.PI * scan)} rx={8} />
            </svg>
          </div>
        </div>
      </Plane>
      <Txt x={150} y={346} text="RESULTADO TRIBUTARIO" z={120} size={50} track={-0.03} p={P(f, q.labelA, 16, E.outExpo)} stagger={0.4} out={1 - content} />

      <Plane x={geoB.x} y={geoB.y + (1 - bIn) * 160} w={geoB.w} h={geoB.h} z={kf(f, [[q.cardB - 6, -120], [q.cardB + 20, 30, E.outExpo]])} rx={(1 - bIn) * 35} ry={(1 - morph) * -5} o={bIn}>
        <div style={{position: 'absolute', inset: 0, borderRadius: lerp(30, 20, morph), background: C.navy2, border: `1.5px solid ${C.line}`, boxShadow: '0 40px 110px rgba(4,7,11,0.55)', overflow: 'hidden'}}>
          <div style={{opacity: content}}>
            <svg width={B.w} height={B.h} style={{position: 'absolute', left: 0, top: 0}}>
              {[0, 1, 2].map((i) => {
                const x = 40 + i * 266;
                const on = Math.max(0, 1 - Math.abs(selX - i));
                return (
                  <g key={i}>
                    <RR x={x} y={110} w={246 * P(f, q.labelB + i * 3, 14, E.outExpo)} h={64} r={32} fill={on > 0.5 ? C.orange : C.navy3} stroke={on > 0.5 ? C.orangeHi : C.line} sw={2} />
                    <circle cx={x + 40} cy={142} r={10 * P(f, q.labelB + 6 + i * 3, 10, E.outBack)} fill={on > 0.5 ? C.white : C.mid} />
                    <RR x={x + 66} y={136} w={(110 - i * 14) * P(f, q.labelB + 6 + i * 3, 12)} h={12} r={6} fill={on > 0.5 ? C.white : C.mid} />
                  </g>
                );
              })}
              {/* ramificación del régimen elegido */}
              <Draw d={`M${40 + 123 + 266} 174V214`} p={P(f, q.settle - 4, 14, E.outQuint)} stroke={C.orange} w={3} />
              {[0, 1, 2].map((i) => (
                <g key={i} opacity={P(f, q.settle + i * 4, 12)}>
                  <RR x={60} y={236 + i * 58} w={740} h={44} r={12} fill={C.navy3} />
                  <RR x={80} y={252 + i * 58} w={(260 + (i % 2) * 120) * P(f, q.settle + i * 4, 18, E.outExpo)} h={12} r={6} fill={C.mid} />
                  <Draw d={`M760 ${258 + i * 58}l8 8l14 -16`} p={P(f, q.settle + 10 + i * 4, 10, E.outBack)} stroke={C.orange} w={3.5} />
                </g>
              ))}
            </svg>
          </div>
        </div>
      </Plane>
      <Txt x={150} y={1076} text="RÉGIMEN APLICABLE" z={120} size={50} track={-0.03} color={C.orange} p={P(f, q.labelB, 16, E.outExpo)} stagger={0.4} out={1 - content} />
    </>
  );
};
