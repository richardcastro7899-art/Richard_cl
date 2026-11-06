import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../lib/theme';
import {E, P} from '../lib/anim';
import {FloatCard} from '../lib/stage';
import {Lead, Txt} from '../lib/text';
import {RR} from '../lib/ui';
import {Pt, catmull, partial, pointAt, resample, toPath} from '../lib/geometry';
import {Q} from '../timing';

const q = Q.s1;
const KEYS: Pt[] = [[-370, -215], [-300, -185], [-235, -226], [-160, -140], [-95, -168], [-25, -60], [40, -92], [110, 30], [175, -12], [250, 110], [320, 78], [372, 205]];
const LINE = resample(catmull(KEYS.map(([x, y]) => [450 + x * 1.05, 270 + y] as Pt), 16), 90);

// Escena 01 — «Tu empresa tuvo pérdidas y crees que ya no tiene obligaciones con el SRI?»
export const Scene01: React.FC = () => {
  const f = useCurrentFrame();
  const draw = P(f, q.lineA, q.lineB - q.lineA, E.ioC);
  const tip = pointAt(LINE, draw);
  const pts = partial(LINE, draw);
  const swapOut = P(f, q.swap - 6, 12, E.inC);
  const out = P(f, q.textOut, 12, E.inC);
  const area = pts.length > 1 ? `M${pts[0][0]} 470L${pts.map((p) => p.join(' ')).join('L')}L${pts[pts.length - 1][0]} 470Z` : '';
  return (
    <>
      <Lead x={540} y={300} text="Tu empresa tuvo" size={60} align="center" p={P(f, 6, 18, E.outExpo)} out={swapOut} />
      <Txt x={540} y={380} text="PÉRDIDAS" size={150} track={-0.035} align="center" p={P(f, q.perdidas, 18, E.outExpo)} stagger={0.5} out={swapOut} />
      <Lead x={540} y={300} text="crees que ya no tiene" size={54} align="center" p={P(f, q.sin, 16, E.outExpo)} out={out} />
      <Txt x={540} y={398} text="¿SIN" size={100} align="center" p={P(f, q.sin + 4, 16, E.outExpo)} out={out} split={[{from: 0, to: 1, color: C.orange}]} />
      <Txt x={540} y={508} text="OBLIGACIONES?" size={92} track={-0.03} align="center" p={P(f, q.oblig, 18, E.outExpo)} out={out} split={[{from: 12, to: 13, color: C.orange}]} />
      <FloatCard x={90} y={860} w={900} h={540} inAt={q.card} outAt={q.out}>
        <svg width={900} height={540} style={{position: 'absolute', left: 0, top: 0}}>
          <defs>
            <linearGradient id="s1a" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={C.orange} stopOpacity="0.16" />
              <stop offset="1" stopColor={C.orange} stopOpacity="0" />
            </linearGradient>
          </defs>
          {[70, 170, 270, 370].map((y, i) => <line key={y} x1={50} x2={850} y1={y} y2={y} stroke={C.line} strokeWidth={1.5} strokeDasharray="6 9" opacity={P(f, q.card + 4 + i * 3, 16)} />)}
          <line x1={50} x2={850} y1={470} y2={470} stroke={C.mid} strokeWidth={2} opacity={P(f, q.card + 4, 16)} />
          {area && <path d={area} fill="url(#s1a)" />}
          {pts.length > 1 && <path d={toPath(pts)} fill="none" stroke={C.orange} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />}
          {draw > 0.02 && <circle cx={tip[0]} cy={tip[1]} r={10} fill={C.orange} />}
          <RR x={50} y={28} w={110 * P(f, q.card + 6, 14)} h={14} r={7} fill={C.navy3} />
        </svg>
      </FloatCard>
    </>
  );
};
