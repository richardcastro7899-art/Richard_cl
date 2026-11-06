import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../lib/theme';
import {E, P, kf, lerp} from '../lib/anim';
import {Svg} from '../lib/stage';
import {Txt} from '../lib/text';
import {Card, Draw, RR} from '../lib/ui';
import {Q} from '../timing';

const q = Q.s5;
const BARS = [70, 120, 96, 170, 210, 150, 236]; // alturas ilustrativas (sin valores)
const ROWS = [1262, 1334, 1406];

// Escena 05 — Resultado contable vs Impuesto a la Renta (composición dividida)
export const Scene05: React.FC = () => {
  const f = useCurrentFrame();
  const out = P(f, q.out, 22, E.ioQuart);
  const topOpen = P(f, q.top, 20, E.outExpo);
  const botOpen = P(f, q.label2 - 6, 20, E.outExpo);
  const ty = -out * 700;
  const by = out * 700;
  const slash = P(f, q.no + 4, 12, E.outExpo);
  return (
    <>
      {/* Panel superior: pérdida contable */}
      <div style={{position: 'absolute', inset: 0, transform: `translateY(${ty}px)`, opacity: 1 - out}}>
        <Txt x={110} y={262} text="PÉRDIDA CONTABLE" size={62} track={-0.03} p={P(f, q.label1, 16, E.outExpo)} stagger={0.4} />
        <Card x={90} y={370} w={900} h={440} open={topOpen}>
          <div />
        </Card>
        <Svg>
          <g opacity={topOpen}>
            <Draw d="M130 520H950" p={P(f, q.top + 6, 24, E.outQuint)} stroke={C.mid} w={3} />
            {[0, 1, 2, 3].map((i) => <Draw key={i} d={`M130 ${580 + i * 60}H950`} p={P(f, q.top + 8 + i * 3, 22, E.outQuint)} stroke={C.line} w={1.5} dash="6 9" />)}
            {BARS.map((h, i) => {
              const bp = P(f, q.bars + i * 4, 22, E.outExpo);
              return <RR key={i} x={160 + i * 110} y={520} w={64} h={h * bp} r={8} fill={i === BARS.length - 1 ? C.soft : C.mid} o={0.5 + 0.5 * (i / 6)} />;
            })}
            {/* línea de tendencia sobre la base de las barras */}
            <Draw d={`M192 ${520 + BARS[0]}${BARS.map((h, i) => `L${192 + i * 110} ${520 + h}`).join('')}`} p={P(f, q.bars + 8, 34, E.ioC)} stroke={C.white} w={3} />
            <circle cx={192 + 6 * 110} cy={520 + BARS[6]} r={9 * P(f, q.bars + 30, 10, E.outBack)} fill={C.orange} />
            <RR x={110} y={500} w={14} h={40} r={4} fill={C.orange} o={topOpen} />
          </g>
        </Svg>
      </div>

      {/* Banda central: "NO NECESARIAMENTE ES CERO" con el anillo (cero) */}
      <div style={{position: 'absolute', inset: 0, opacity: 1 - P(f, q.out, 12, E.inC)}}>
        <Svg>
          {/* diagonal que cruza el "cero" (hero) */}
          <Draw d="M148 1012L232 920" p={slash} stroke={C.white} w={7} />
        </Svg>
        <Txt x={300} y={846} text="NO" size={86} track={-0.03} color={C.orange} p={P(f, q.no, 14, E.outExpo)} stagger={0.3} />
        <Txt x={300} y={926} text="NECESARIAMENTE" size={74} track={-0.03} p={P(f, q.necesariamente, 18, E.outExpo)} stagger={0.5} />
        <Txt x={300} y={1006} text="ES CERO" size={86} track={-0.03} color={C.white} p={P(f, q.esCero, 14, E.outExpo)} stagger={0.3}
          split={[{from: 3, to: 7, color: C.orange}]} />
      </div>

      {/* Panel inferior: impuesto a la renta */}
      <div style={{position: 'absolute', inset: 0, transform: `translateY(${by}px)`, opacity: 1 - out}}>
        <Txt x={110} y={1128} text="IMPUESTO A LA RENTA" size={62} track={-0.03} color={C.orange} p={P(f, q.label2, 16, E.outExpo)} stagger={0.4} />
        <Card x={90} y={1230} w={900} h={250} open={botOpen} glow={P(f, q.result, 14, E.outC)}>
          <div />
        </Card>
        <Svg>
          <g opacity={botOpen}>
            {ROWS.map((y, i) => {
              const rp = P(f, q.calc + i * 12, 26, E.ioC);
              return (
                <g key={i}>
                  <RR x={126} y={y} w={30} h={30} r={8} fill={C.navy3} stroke={C.line} />
                  <RR x={172} y={y + 9} w={(i === 1 ? 70 : 100) * P(f, q.calc + i * 12 - 4, 14)} h={12} r={6} fill={C.mid} />
                  <RR x={330} y={y + 5} w={400} h={20} r={10} fill={C.navy3} />
                  <RR x={330} y={y + 5} w={400 * rp} h={20} r={10} fill={i === 2 ? C.orange : C.soft} o={0.9} />
                  {rp > 0 && rp < 1 && <circle cx={330 + 400 * rp} cy={y + 15} r={6} fill={C.white} />}
                  <Draw d={`M748 ${y + 16}l8 8l14 -16`} p={P(f, q.calc + i * 12 + 24, 10, E.outBack)} stroke={C.orange} w={4} />
                </g>
              );
            })}
            {/* resultado: no es cero (barras ascendentes sobre la línea base) */}
            <g transform="translate(830 1300)" opacity={P(f, q.result - 10, 10)}>
              <RR x={-30} y={-52} w={160} h={112} r={20} fill={C.orange} o={0.18 + 0.82 * P(f, q.result, 10)} />
              <Draw d="M-14 36H112" p={P(f, q.result, 10)} stroke={C.white} w={3} />
              {[26, 52, 80].map((h, i) => <RR key={i} x={4 + i * 38} y={36 - h * P(f, q.result + 4 + i * 4, 14, E.outBack)} w={24} h={h * P(f, q.result + 4 + i * 4, 14, E.outBack)} r={5} fill={C.white} />)}
            </g>
          </g>
        </Svg>
      </div>
    </>
  );
};
