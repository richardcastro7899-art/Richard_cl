import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../lib/theme';
import {E, P, clamp, kf, pulse} from '../lib/anim';
import {Svg} from '../lib/stage';
import {Lead, Txt} from '../lib/text';
import {Card, Draw, RR} from '../lib/ui';
import {chartLine, chartDraw} from '../Hero';
import {pointAt, toPath, partial} from '../lib/geometry';
import {Q} from '../timing';

const q = Q.s1;
const CARD = {x: 90, y: 770, w: 900, h: 640};
const CY = 1090;

// Escena 01 — "Tu empresa tuvo pérdidas…": interfaz financiera construida proceduralmente
export const Scene01: React.FC = () => {
  const f = useCurrentFrame();
  const open = P(f, q.card, 20, E.outExpo);
  const collapse = P(f, q.collapse, 24, E.ioQuart);
  const cardOpen = open * (1 - collapse);
  const inner = P(f, q.grid, 14, E.outC) * (1 - P(f, q.textOut + 4, 12, E.inC));
  const draw = chartDraw(f);
  const tip = pointAt(chartLine, draw);
  const tipX = 540 + tip[0];
  const tipY = CY + tip[1];
  const base = CY + 240;
  const gridYs = [CY - 215, CY - 120, CY - 25, CY + 70, CY + 165, base];

  // Texto cinético
  const pIn = P(f, q.perdidas, 18, E.outExpo);
  const shrink = P(f, q.perdidasLabel, 18, E.ioQuart);
  const pSize = 150;
  const pScale = kf(f, [[0, 1], [q.perdidasLabel, 1], [q.perdidasLabel + 18, 0.34, E.ioQuart]]);
  const pY = kf(f, [[0, 330], [q.perdidasLabel, 330], [q.perdidasLabel + 18, 240, E.ioQuart]]);
  const out = P(f, q.textOut, 16, E.inC);
  const fill = f >= q.lineA ? 0.25 : 0;
  const areaPts = partial(chartLine, draw).map(([x, y]) => `${540 + x},${CY + y}`);
  const area = areaPts.length > 1 ? `M${areaPts[0]}L${areaPts.join('L')}L${540 + partial(chartLine, draw).slice(-1)[0][0]},${base}L${540 + chartLine[0][0]},${base}Z` : '';
  const dotPulse = pulse(f, q.sri, 16);

  return (
    <>
      <Card x={CARD.x} y={CARD.y} w={CARD.w} h={CARD.h} open={cardOpen} o={1} />
      <Svg>
        <defs>
          <linearGradient id="s1area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.orange} stopOpacity={fill} />
            <stop offset="1" stopColor={C.orange} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Cabecera de módulo */}
        <g opacity={inner}>
          <circle cx={140} cy={815} r={9} fill={C.orange} />
          {dotPulse > 0 && f >= q.sri && <circle cx={140} cy={815} r={9 + dotPulse * 26} fill="none" stroke={C.orange} strokeWidth={2} opacity={1 - dotPulse} />}
          {[[170, 120], [304, 76], [392, 96]].map(([x, w], i) => (
            <RR key={i} x={x} y={805} w={w * P(f, q.grid + i * 3, 12, E.outExpo)} h={20} r={10} fill={C.navy3} />
          ))}
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={920 - i * 30} cy={815} r={7} fill={i === 0 ? C.mid : C.line} opacity={P(f, q.grid + 6 + i * 3, 10, E.outBack)} />
          ))}
          <path d={`M110 850H970`} stroke={C.line} strokeWidth={1.5} />
        </g>
        {/* Rejilla y ejes */}
        <g opacity={inner}>
          {gridYs.map((y, i) => (
            <Draw key={i} d={`M130 ${y}H950`} p={P(f, q.grid + i * 3, 22, E.outQuint)} stroke={i === gridYs.length - 1 ? C.mid : C.line} w={i === gridYs.length - 1 ? 2.5 : 1.5} dash={i === gridYs.length - 1 ? undefined : '8 9'} />
          ))}
          {Array.from({length: 11}).map((_, i) => (
            <Draw key={i} d={`M${168 + i * 74} ${base}v14`} p={P(f, q.grid + 10 + i * 1.5, 10, E.outC)} stroke={C.mid} w={2} />
          ))}
          {Array.from({length: 6}).map((_, i) => (
            <Draw key={i} d={`M118 ${gridYs[i]}h12`} p={P(f, q.grid + i * 3, 10, E.outC)} stroke={C.mid} w={2} />
          ))}
        </g>
        {/* Área bajo la curva */}
        {area && <path d={area} fill="url(#s1area)" opacity={1 - collapse} />}
        {/* Guías del punto actual */}
        {draw > 0.02 && draw < 1.01 && f < q.collapse && (
          <g opacity={inner}>
            <path d={`M${tipX} ${tipY}V${base}`} stroke={C.orange} strokeWidth={1.5} strokeDasharray="5 7" opacity={0.7} />
            <circle cx={tipX} cy={tipY} r={9} fill={C.orangeHi} />
            <circle cx={tipX} cy={tipY} r={20 + 8 * Math.sin(f * 0.5)} fill="none" stroke={C.orange} strokeWidth={2} opacity={0.5} />
          </g>
        )}
        {/* Chip de caída */}
        {f > q.lineB - 14 && f < q.collapse + 6 && (
          <g opacity={P(f, q.lineB - 14, 10, E.outBack) * (1 - P(f, q.textOut, 10, E.inC))} transform={`translate(${tipX - 66} ${tipY + 34})`}>
            <RR x={0} y={0} w={64} h={40} r={20} fill={C.orange} />
            <path d="M22 14L42 14L32 28Z" fill={C.white} />
          </g>
        )}
      </Svg>
      <Txt x={540} y={pY} text="PÉRDIDAS" size={pSize} weight={800} track={-0.035} align="center" p={pIn} stagger={0.5} out={out} outDir="up"
        scale={pScale} color={shrink > 0.5 ? C.orange : C.white} />
      <Lead x={540} y={236} text="Tu empresa tuvo" size={60} align="center" p={P(f, 6, 18, E.outExpo)} out={P(f, q.perdidasLabel - 6, 12, E.inC)} />
      <Lead x={540} y={392} text="crees que ya no tiene" size={52} align="center" p={P(f, 58, 16, E.outExpo)} out={out} />
      <Txt x={540} y={470} text="¿SIN" size={100} align="center" p={P(f, q.sin, 16, E.outExpo)} out={out} outDir="up" split={[{from: 0, to: 1, color: C.orange}]} />
      <Txt x={540} y={570} text="OBLIGACIONES?" size={91} align="center" p={P(f, q.oblig, 18, E.outExpo)} out={clamp(out * 1.1 - 0.05)} outDir="up" track={-0.03}
        split={[{from: 12, to: 13, color: C.orange}]} />
    </>
  );
};
