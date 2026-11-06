import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../lib/theme';
import {E, P, kf, lerp} from '../lib/anim';
import {Plane, Svg} from '../lib/stage';
import {Txt} from '../lib/text';
import {Draw, RR} from '../lib/ui';
import {roundedPoly} from '../lib/geometry';
import {Q} from '../timing';

const q = Q.s3;
export const DOC_W = 250;
export const DOC_H = 340;
// posiciones finales de los tres documentos de cumplimiento
export const DOCS = [
  {x: 95, y: 1030, rz: -3, kind: 0},
  {x: 415, y: 990, rz: 0, kind: 1},
  {x: 735, y: 1030, rz: 3, kind: 2},
];

export const DocArt: React.FC<{kind: number; p: number; check: number; w?: number; h?: number}> = ({kind, p, check, w = DOC_W, h = DOC_H}) => {
  const L = (i: number, n = 6) => P(p * 1, i / n * 0.7, 0.3, E.outC);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${DOC_W} ${DOC_H}`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <rect x={0} y={0} width={DOC_W} height={DOC_H} rx={20} fill={C.navy2} stroke={C.line} strokeWidth={1.5} />
      <RR x={22} y={24} w={90 * L(0)} h={12} r={6} fill={C.orange} />
      <RR x={22} y={46} w={150 * L(1)} h={8} r={4} fill={C.mid} />
      {kind === 0 && [0, 1, 2, 3, 4].map((i) => (
        <RR key={i} x={22} y={86 + i * 38} w={(i % 2 ? 150 : 206) * L(i + 1)} h={10} r={5} fill={C.navy3} />
      ))}
      {kind === 1 && (
        <g>
          {[0, 1, 2, 3].map((r) => (
            <Draw key={r} d={`M22 ${88 + r * 44}H228`} p={L(r + 1)} stroke={C.line} w={1.5} />
          ))}
          <Draw d="M96 88V220" p={L(2)} stroke={C.line} w={1.5} />
          <Draw d="M168 88V220" p={L(3)} stroke={C.line} w={1.5} />
          {[0, 1, 2].map((r) => <RR key={r} x={30} y={102 + r * 44} w={54 * L(r + 2)} h={9} r={4} fill={C.navy3} />)}
          {[0, 1, 2].map((r) => <RR key={r} x={106} y={102 + r * 44} w={50 * L(r + 3)} h={9} r={4} fill={C.mid} />)}
        </g>
      )}
      {kind === 2 && [0, 1, 2].map((i) => (
        <g key={i}>
          <RR x={22} y={86 + i * 56} w={70 * L(i + 1)} h={9} r={4} fill={C.mid} />
          <RR x={22} y={104 + i * 56} w={206 * L(i + 2)} h={26} r={8} stroke={C.line} sw={1.5} />
        </g>
      ))}
      {/* verificación */}
      <circle cx={DOC_W - 52} cy={DOC_H - 50} r={24} fill="none" stroke={check > 0 ? C.orange : C.line} strokeWidth={2.5} opacity={0.4 + 0.6 * check} />
      <Draw d={`M${DOC_W - 63} ${DOC_H - 50}l8 9l16 -18`} p={check} stroke={C.orange} w={4} />
    </svg>
  );
};

// Escena 03 — "Aunque una empresa registre pérdidas, debe continuar cumpliendo…"
export const Scene03: React.FC = () => {
  const f = useCurrentFrame();
  const out = P(f, q.out, 22, E.ioQuart);
  const hub = {x: 540, y: 905};
  const toCenter = (i: number) => {
    const d = DOCS[i];
    return {x: lerp(d.x, 540 - DOC_W / 2, out), y: lerp(d.y, 780 - DOC_H / 2, out)};
  };
  return (
    <>
      <Txt x={540} y={285} text="PÉRDIDAS" size={132} track={-0.035} align="center" p={P(f, q.perdidas, 16, E.outExpo)} stagger={0.5} out={P(f, q.out, 12, E.inC)} outDir="down" />
      <Txt x={540} y={725} text="SIN OBLIGACIONES" size={86} track={-0.03} align="center" p={P(f, q.sinOblig, 18, E.outExpo)} out={P(f, q.out, 12, E.inC)} outDir="up" />
      <Svg>
        {/* Conectores de datos */}
        {(() => {
          const top = DOCS.map((d) => ({x: d.x + DOC_W / 2, y: d.y + 6 - (d.kind === 1 ? 0 : 0)}));
          return (
            <g opacity={1 - out}>
              <Draw d={`M540 ${hub.y - 30}V${hub.y + 8}`} p={P(f, q.hub - 6, 12, E.outC)} stroke={C.orange} w={3} />
              <circle cx={540} cy={hub.y + 18} r={11 * P(f, q.hub, 12, E.outBack)} fill="none" stroke={C.orange} strokeWidth={3} />
              <circle cx={540} cy={hub.y + 18} r={4 * P(f, q.hub, 12, E.outBack)} fill={C.orange} />
              {top.map((t, i) => {
                const d = roundedPoly([[540, hub.y + 30], [540, hub.y + 56], [t.x, hub.y + 56], [t.x, t.y]], 22);
                if (i === 1) return <Draw key={i} d={`M540 ${hub.y + 30}V${t.y}`} p={P(f, q.conn[i], 18, E.outQuint)} stroke={C.orange} w={3} />;
                return <Draw key={i} d={d} p={P(f, q.conn[i], 22, E.outQuint)} stroke={C.orange} w={3} />;
              })}
              {/* pulso de datos recorriendo conectores */}
              {[0, 2].map((i) => {
                const t = P(f, q.check[i] - 14, 20, E.ioC);
                if (t <= 0 || t >= 1) return null;
                const x = lerp(540, top[i].x, t);
                return <circle key={i} cx={x} cy={hub.y + 56} r={6} fill={C.white} opacity={0.9} />;
              })}
            </g>
          );
        })()}
      </Svg>
      {DOCS.map((d, i) => {
        const pin = P(f, q.doc[i], 24, E.outExpo);
        const pos = toCenter(i);
        const o = pin * (1 - P(f, q.out + 8, 14, E.inC));
        return (
          <Plane key={i} x={pos.x} y={pos.y + (1 - pin) * 200} w={DOC_W} h={DOC_H} z={kf(f, [[q.doc[i], -140], [q.doc[i] + 24, i === 1 ? 50 : 0, E.outExpo]])}
            ry={(1 - pin) * (i === 0 ? 55 : i === 2 ? -55 : 0)} rx={(1 - pin) * 25} rz={d.rz * (1 - out)} s={lerp(1, 0.25, out)} o={o}>
            <DocArt kind={d.kind} p={P(f, q.doc[i] + 6, 24, E.outC)} check={P(f, q.check[i], 12, E.outBack)} />
          </Plane>
        );
      })}
    </>
  );
};
