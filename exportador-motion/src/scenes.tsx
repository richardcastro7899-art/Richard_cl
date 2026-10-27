import React from 'react';
import {Cam, Coin, CycleRing, Defs, Floor, Globe, PaperBoat, Pawn, Pie, Pin, proj} from './art';
import {C, easeIO, easeOut, H, HEAD, prog, rnd, sec, W} from './theme';
import {Art, Line, Scene, Stack, Swap, useEnergy, useG} from './ui';

/*
 * Zonas seguras para redes: x 110–970, y 300–1480.
 * Contenido de 340 a 1480.
 */
const Svg: React.FC<{noEnter?: boolean; children: React.ReactNode}> = ({noEnter, children}) => (
  <Art noEnter={noEnter}>
    <Defs />
    {children}
  </Art>
);

const SMALL = 46;
const TOP = 340;

/* ═════════ 1 · Micro (0–2,5 s): 9 peones sobre tablero ═════════ */
const camA: Cam = {yH: 600, span: 852, k: 400};

export const SceneMicro: React.FC<{start: number; end: number}> = ({start, end}) => {
  const g = useG();
  const e = useEnergy();
  const rows = [1.55, 2.15, 2.95];
  const pawns: Array<{x: number; z: number; i: number}> = [];
  rows.forEach((z, ri) =>
    [-1, 0, 1].forEach((c, ci) => pawns.push({x: c * 1.3 + (ri % 2 ? 0.6 : -0.08), z, i: ri * 3 + ci})),
  );
  // «tú» (centro delantero) entra primero
  const order = [1, 0, 2, 4, 3, 5, 7, 6, 8];
  const S = 2.2;
  return (
    <Scene start={start} end={end}>
      <Svg noEnter>
        <Floor id="fl1" cam={camA} tile={0.5} zNear={1.0} zFar={9} fade={[650, 840, 1120, 1230]} />
        {[...pawns]
          .map((p) => ({...p, ord: order.indexOf(p.i)}))
          .sort((a, b) => b.z - a.z)
          .map((p) => {
            const t0 = p.ord === 0 ? 0.35 : 1.0 + (p.ord - 1) * 0.1;
            const pr = prog(g, sec(t0), 14);
            const q = proj(camA, p.x, p.z);
            return (
              <g key={p.i}>
                <Pawn x={q.x} y={q.y} s={S * q.s * (1 + e * 0.012)} op={Math.min(1, pr * 2.5)} dy={(1 - pr) * -90} blur={(1 - pr) * 10} />
                {p.ord === 0 && (
                  <Pin x={q.x} y={q.y - 154 * S * q.s - 22 + (1 - pr) * -40 + Math.sin(g * 0.12) * 6} s={0.78} op={pr} />
                )}
              </g>
            );
          })}
      </Svg>
      <Stack top={TOP} gap={4}>
        <Line size={SMALL} words={[{w: 'Eres', t: 0.0}]} />
        <Line size={200} weight={800} words={[{w: 'Micro', t: 0.26}]} />
      </Stack>
      <Stack top={1215} gap={8}>
        <Line size={SMALL} words={[{w: 'tienes', t: 0.78}, {w: 'de', t: 1.0}]} />
        <Line size={160} weight={800} words={[{w: '1', t: 1.18}, {w: 'a', t: 1.5, size: SMALL, weight: 500}, {w: '9', t: 1.7, color: C.grey}]} gap={0.2} />
        <Line size={SMALL} words={[{w: 'trabajadores', t: 1.9}]} />
      </Stack>
    </Scene>
  );
};

/* ═════════ 2 · Vendes hasta 100 mil (2,5–5 s) ═════════ */
export const SceneSales100: React.FC<{start: number; end: number}> = ({start, end}) => {
  const g = useG();
  const e = useEnergy();
  const coins = [];
  const n = 8;
  const baseY = 1140;
  const h = 28;
  for (let i = 0; i < n; i++) {
    const t0 = sec(2.9 + i * 0.1);
    const pr = prog(g, t0, 12);
    const land = prog(g, t0 + 6, 12, easeOut);
    const bounce = Math.sin(land * Math.PI * 2.4) * (1 - land) * 6;
    coins.push(
      <Coin
        key={i}
        cx={540 + (rnd(i + 3) - 0.5) * 8}
        cy={baseY - i * h + (1 - pr) * -620 + bounce}
        r={170}
        h={h}
        label={i === n - 1}
        accent={i === n - 1}
        op={Math.min(1, pr * 3)}
      />,
    );
  }
  return (
    <Scene start={start} end={end}>
      <Svg>
        <ellipse cx={556} cy={baseY + h + 16} rx={230} ry={40} fill="rgba(0,0,0,.34)" filter="url(#fBlur16)" opacity={prog(g, sec(2.95), 10)} />
        <g transform={`translate(540 ${baseY}) scale(${1 + e * 0.01}) translate(-540 ${-baseY})`}>{coins}</g>
      </Svg>
      <Stack top={TOP} gap={8}>
        <Line size={SMALL} words={[{w: 'y', t: 2.56}, {w: 'vendes', t: 2.82}, {w: 'hasta', t: 3.12}]} />
        <Line size={156} weight={800} gap={0.16} words={[{w: '$100', t: 3.3}, {w: 'mil', t: 3.55, color: C.grey}]} />
      </Stack>
      <Stack top={1330}>
        <Line size={64} weight={800} words={[{w: 'dólares', t: 3.7}, {w: 'al', t: 3.95, weight: 500, size: SMALL}, {w: 'año', t: 4.1}]} />
      </Stack>
    </Scene>
  );
};

/* ═════════ 3a · Pequeña · 10 a 49: equipo en tarjeta (gráfico distinto al de Micro) ═════════ */
const Person: React.FC<{x: number; y: number; s: number; fill: string; op: number; dy: number}> = ({x, y, s, fill, op, dy}) => (
  <g transform={`translate(${x} ${y + dy}) scale(${s})`} opacity={op}>
    <circle cx={0} cy={-35} r={11} fill={fill} />
    <path d="M-17 0 V-13 Q-17 -24 -6 -24 H6 Q17 -24 17 -13 V0 Z" fill={fill} />
  </g>
);

export const ScenePequena: React.FC<{start: number; end: number}> = ({start, end}) => {
  const g = useG();
  const e = useEnergy();
  const cardX = 130;
  const cardW = 820;
  const cardY = 600;
  const cardH = 570;
  const cin = prog(g, start, 14);
  const cols = 7;
  const rows = 7;
  const px = cardW / cols;
  const padT = 40;
  const py = (cardH - padT - 26) / rows;
  const people: React.ReactNode[] = [];
  // orden de llegada: fila a fila. Los 10 primeros (naranja) llegan con «pequeña»; el resto con «10 a 49»
  for (let i = 0; i < cols * rows; i++) {
    const r = Math.floor(i / cols);
    const c = i % cols;
    const t0 = i < 10 ? 5.25 + i * 0.04 : 5.75 + ((i - 10) / 39) * 0.6;
    const pr = prog(g, sec(t0), 12);
    people.push(
      <Person
        key={i}
        x={cardX + px * (c + 0.5)}
        y={cardY + padT + py * (r + 1) - 10}
        s={1.18 * (1 + e * 0.015)}
        fill={i < 10 ? C.orange : C.navy}
        op={Math.min(1, pr * 3)}
        dy={(1 - pr) * -50}
      />,
    );
  }
  return (
    <Scene start={start} end={end}>
      <Svg>
        <g transform={`translate(0 ${(1 - cin) * 90})`} opacity={Math.min(1, cin * 2)}>
          <rect x={cardX + 10} y={cardY + 26} width={cardW} height={cardH} rx={28} fill="rgba(0,0,0,.3)" filter="url(#fBlur16)" />
          <rect x={cardX} y={cardY} width={cardW} height={cardH} rx={28} fill="url(#gTile)" stroke="rgba(0,0,0,.12)" strokeWidth={2} />
          {people}
        </g>
      </Svg>
      <Stack top={TOP} gap={4}>
        <Line size={176} weight={800} words={[{w: 'Pequeña', t: 5.08}]} />
      </Stack>
      <Stack top={1215} gap={8}>
        <Line size={SMALL} words={[{w: 'y', t: 5.62}, {w: 'tienes', t: 5.76}, {w: 'de', t: 5.98}]} />
        <Line size={160} weight={800} words={[{w: '10', t: 6.0}, {w: 'a', t: 6.2, size: SMALL, weight: 500}, {w: '49', t: 6.35, color: C.grey}]} gap={0.2} />
        <Line size={SMALL} words={[{w: 'trabajadores', t: 6.55}]} />
      </Stack>
    </Scene>
  );
};

/* ═════════ 3b · hasta un millón (7–8,7 s) ═════════ */
export const SceneSales1M: React.FC<{start: number; end: number}> = ({start, end}) => {
  const g = useG();
  const e = useEnergy();
  const baseY = 1420;
  const r = 112;
  const h = 14;
  const N = 54;
  const towerX = 680;
  const smallX = 285;
  const tower = [];
  for (let i = 0; i < N; i++) {
    const t0 = sec(7.4 + (i / N) * 0.6);
    const pr = prog(g, t0, 8);
    tower.push(
      <Coin
        key={i}
        cx={towerX + (rnd(i + 11) - 0.5) * 5}
        cy={baseY - i * h + (1 - pr) * -160}
        r={r}
        h={h}
        label={i === N - 1}
        accent={i === N - 1}
        op={Math.min(1, pr * 3)}
      />,
    );
  }
  const small = [];
  for (let i = 0; i < 6; i++) {
    const pr = prog(g, sec(7.4 + i * 0.03), 10);
    small.push(<Coin key={i} cx={smallX} cy={baseY - i * 12 + (1 - pr) * -80} r={r * 0.62} h={12} label={i === 5} op={Math.min(1, pr * 3)} />);
  }
  const lab = prog(g, sec(7.7), 14);
  return (
    <Scene start={start} end={end}>
      <Svg>
        <ellipse cx={towerX + 10} cy={baseY + 26} rx={r * 1.3} ry={28} fill="rgba(0,0,0,.34)" filter="url(#fBlur16)" opacity={prog(g, sec(7.45), 10)} />
        <ellipse cx={smallX + 8} cy={baseY + 20} rx={r * 0.85} ry={20} fill="rgba(0,0,0,.3)" filter="url(#fBlur16)" opacity={prog(g, sec(7.45), 10)} />
        <g transform={`translate(${towerX} ${baseY}) scale(${1 + e * 0.004}) translate(${-towerX} ${-baseY})`}>{tower}</g>
        {small}
        <text x={smallX} y={baseY - 120} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={32} fill={C.grey} opacity={lab}>
          $100 mil
        </text>
      </Svg>
      <Stack top={TOP} gap={8}>
        <Line size={SMALL} words={[{w: 'y', t: 7.06}, {w: 'vendes', t: 7.4}, {w: 'hasta', t: 7.72}, {w: 'un', t: 7.96}]} />
        <Line size={140} weight={800} gap={0.14} words={[{w: '$1', t: 7.85}, {w: 'millón', t: 8.0, color: C.grey}]} />
      </Stack>
    </Scene>
  );
};

/* ═════════ 4a · Exportador habitual — barco de papel (8,7–10,4 s) ═════════ */
export const SceneBoat: React.FC<{start: number; end: number}> = ({start, end}) => {
  const g = useG();
  const e = useEnergy();
  const p = prog(g, sec(8.8), 30);
  const bob = Math.sin(g * 0.09) * 9;
  const rock = Math.sin(g * 0.07) * 1.8;
  const waves = [0, 1, 2, 3].map((i) => {
    const y = 1290 + i * 42;
    let d = '';
    for (let x = -20; x <= 1100; x += 20) {
      const yy = y + Math.sin(x * 0.012 + g * 0.08 + i * 1.3) * (10 - i * 1.5);
      d += `${x === -20 ? 'M' : 'L'}${x} ${yy.toFixed(1)} `;
    }
    return <path key={i} d={d} fill="none" stroke={`rgba(23,30,39,${0.34 - i * 0.07})`} strokeWidth={4 - i * 0.6} strokeLinecap="round" />;
  });
  return (
    <Scene start={start} end={end}>
      <Svg>
        <g opacity={Math.min(1, p * 2)}>
          <PaperBoat x={540 + (1 - p) * -520} y={1110 + bob} s={0.92 + e * 0.01} rot={rock - (1 - p) * 8} />
        </g>
        {waves}
      </Svg>
      <Stack top={TOP} gap={4}>
        <Line size={SMALL} words={[{w: 'Se', t: 8.8}, {w: 'considera', t: 8.82}]} />
        <Line size={132} weight={800} words={[{w: 'Exportador', t: 9.38}]} />
        <Line size={132} weight={800} color={C.grey} words={[{w: 'habitual', t: 9.92}]} />
      </Stack>
    </Scene>
  );
};

/* ═════════ 4b · Exportaciones netas — globo (10,4–12,9 s) ═════════ */
export const SceneGlobe: React.FC<{start: number; end: number}> = ({start, end}) => {
  const g = useG();
  const lf = g - start;
  const arcP = prog(g, sec(11.2), 36, easeIO);
  const pinP = prog(g, sec(10.8), 14);
  const spin = prog(g, start, 90, (t) => t);
  return (
    <Scene start={start} end={end}>
      <Svg>
        <Globe
          cx={540}
          cy={1065}
          r={270}
          rot={-26 + spin * 26 + lf * 0.1}
          home={[-12, 2]}
          dests={[[22, 38], [30, -18], [-30, 40], [4, -40]]}
          arcP={arcP}
          pinP={pinP}
          flow={lf * 1.2}
        />
      </Svg>
      <Stack top={TOP} gap={6}>
        <Line size={SMALL} words={[{w: 'al', t: 10.4}, {w: 'contribuyente', t: 10.62}, {w: 'cuyas', t: 11.28}]} />
        <Line size={96} weight={800} words={[{w: 'Exportaciones', t: 11.66}]} />
        <Line size={176} weight={800} color={C.grey} words={[{w: 'netas', t: 12.28}]} />
      </Stack>
    </Scene>
  );
};

/* ═════════ 5 · 25 % (12,9–15,9 s) ═════════ */
export const ScenePct: React.FC<{start: number; end: number}> = ({start, end}) => {
  const g = useG();
  const sweep = prog(g, sec(13.7), 28, easeOut) * (Math.PI / 2);
  const pull = prog(g, sec(14.3), 24) * 36;
  const pinP = prog(g, sec(14.45), 12);
  const mid = -Math.PI / 2 + Math.PI / 4;
  const cx = 540;
  const cy = 975;
  const r = 235;
  const px = cx + Math.cos(mid) * (r * 0.55 + pull);
  const py = cy + Math.sin(mid) * (r * 0.55 + pull) + 26;
  return (
    <Scene start={start} end={end}>
      <Svg>
        <Pie cx={cx} cy={cy} r={r} sweep={Math.max(0.0001, sweep)} pull={pull} />
        <Pin x={px} y={py - (1 - pinP) * 120} s={0.9} op={pinP} navy />
      </Svg>
      <Stack top={TOP} gap={4}>
        <Line size={SMALL} words={[{w: 'son', t: 12.88}, {w: 'al', t: 13.08}, {w: 'menos', t: 13.24}, {w: 'del', t: 13.48}]} />
        <Line size={236} weight={800} gap={0.02} words={[{w: '25', t: 13.7}, {w: '%', t: 14.18, color: C.grey}]} />
      </Stack>
      <Stack top={1282} gap={4}>
        <Line size={SMALL} words={[{w: 'en', t: 14.55}, {w: 'su', t: 14.9}, {w: 'total', t: 15.05}, {w: 'de', t: 15.3}]} />
        <Line size={146} weight={800} words={[{w: 'ingreso', t: 15.42}]} />
      </Stack>
    </Scene>
  );
};

/* ═════════ 6/7 · 6 en 6 meses · 3 en 3 meses (15,9–20,4 s) ═════════ */
const MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
const SIX = [0, 2, 4, 6, 8, 10];
const THREE = [4, 6, 8];

export const SceneCalendar: React.FC<{start: number; end: number}> = ({start, end}) => {
  const g = useG();
  const swapAt = sec(19.15);
  const tw = 196;
  const th = 120;
  const gap = 25;
  const x0 = (W - (4 * tw + 3 * gap)) / 2;
  const y0 = 760;
  const tiles = MONTHS.map((m, i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const cx = x0 + col * (tw + gap) + tw / 2;
    const cy = y0 + row * (th + gap) + th / 2;
    const rot = (rnd(i + 1) - 0.5) * 3.2;
    const tin = prog(g, sec(16.05) + i * 2, 14);
    const sixIdx = SIX.indexOf(i);
    const keep3 = THREE.indexOf(i) >= 0;
    const pinT = sixIdx >= 0 ? sec(16.5 + sixIdx * 0.33) : 0;
    const pinned6 = sixIdx >= 0 ? prog(g, pinT, 10) : 0;
    const unpin = g >= swapAt && !keep3 ? prog(g, swapAt + sixIdx * 2, 10) : 0;
    const pinned = pinned6 * (1 - unpin);
    const pinFall = prog(g, pinT - 8, 10, easeOut);
    const shown = sixIdx >= 0 && pinned6 > 0 && (keep3 || g < swapAt + sixIdx * 2 + 10);
    return (
      <g key={i} transform={`translate(${cx} ${cy + (1 - tin) * 80}) rotate(${rot})`} opacity={Math.min(1, tin * 2.5)}>
        <rect x={-tw / 2 + 8} y={-th / 2 + 14} width={tw} height={th} rx={16} fill="rgba(0,0,0,.28)" filter="url(#fBlur16)" />
        <rect x={-tw / 2} y={-th / 2} width={tw} height={th} rx={16} fill="url(#gTile)" stroke="rgba(0,0,0,.12)" strokeWidth={2} />
        <rect x={-tw / 2} y={-th / 2} width={tw} height={th} rx={16} fill={C.ink} opacity={pinned} />
        <text
          y={8}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily={HEAD}
          fontWeight={800}
          fontSize={48}
          letterSpacing="-0.02em"
          fill={pinned > 0.5 ? '#f5f4ef' : C.ink}
          opacity={pinned > 0.5 ? 1 : 0.88}
        >
          {m}
        </text>
        {shown && <Pin x={tw / 2 - 36} y={-th / 2 + 30 + (1 - pinFall) * -150} s={0.5} rot={14} op={Math.min(1, pinFall * 3)} />}
      </g>
    );
  });
  return (
    <Scene start={start} end={end}>
      <Svg>{tiles}</Svg>
      <Stack top={TOP} gap={0}>
        <Swap
          at={swapAt}
          a={<Line size={SMALL} words={[{w: 'y', t: 16.0}, {w: 'con', t: 16.2}]} />}
          b={<Line size={SMALL} words={[{w: 'o', t: 18.64}]} />}
        />
        <div style={{height: 8}} />
        <Swap
          at={sec(19.2)}
          a={<Line size={200} weight={800} words={[{w: '6', t: 16.46}]} />}
          b={<Line size={200} weight={800} words={[{w: '3', t: 19.24}]} />}
        />
        <Line size={90} weight={800} words={[{w: 'exportaciones', t: 16.66}]} />
      </Stack>
      <Stack top={1205} gap={6}>
        <Swap
          at={sec(19.55)}
          a={
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
              <Line size={SMALL} words={[{w: 'en', t: 17.38}]} />
              <Line size={130} weight={800} words={[{w: '6', t: 17.7}, {w: 'meses', t: 17.9}]} gap={0.18} />
              <Line size={SMALL} color={C.grey} words={[{w: 'distintos', t: 18.14}]} />
            </div>
          }
          b={
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
              <Line size={SMALL} words={[{w: 'en', t: 19.6}]} />
              <Line size={130} weight={800} words={[{w: '3', t: 19.8}, {w: 'meses', t: 19.98}]} gap={0.18} />
              <div style={{height: SMALL}} />
            </div>
          }
        />
      </Stack>
    </Scene>
  );
};

/* ═════════ 8 · Producción cíclica · ejercicio fiscal (20,4–23,56 s) ═════════ */
export const SceneCycle: React.FC<{start: number; end: number}> = ({start, end}) => {
  const g = useG();
  const e = useEnergy();
  const p = prog(g, sec(20.6), 30);
  const cy = 910;
  return (
    <Scene start={start} end={end}>
      <Svg>
        <g opacity={Math.min(1, p * 2)} transform={`translate(540 ${cy}) scale(${0.86 + p * 0.14}) translate(-540 ${-cy})`}>
          <CycleRing cx={540} cy={cy} R={212} g={g} e={e} />
        </g>
      </Svg>
      <Stack top={TOP} gap={6}>
        <Line size={SMALL} words={[{w: 'si', t: 20.5}, {w: 'tu', t: 20.88}, {w: 'producción', t: 20.94}, {w: 'es', t: 21.28}]} />
        <Line size={190} weight={800} words={[{w: 'cíclica', t: 21.58}]} />
      </Stack>
      <Stack top={cy - 88} gap={0}>
        <Line size={140} weight={800} color={C.greyLt} words={[{w: '12', t: 20.8}]} />
        <Line size={28} weight={800} color={C.grey} ls="0.4em" words={[{w: 'MESES', t: 20.95}]} />
      </Stack>
      <Stack top={1228} gap={2}>
        <Line size={SMALL} words={[{w: 'durante', t: 22.0}, {w: 'el', t: 22.38}]} />
        <Line size={100} weight={800} words={[{w: 'ejercicio', t: 22.6}]} />
        <Line size={100} weight={800} color={C.grey} words={[{w: 'fiscal', t: 23.04}]} />
      </Stack>
    </Scene>
  );
};
