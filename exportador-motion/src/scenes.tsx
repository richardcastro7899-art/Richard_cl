import React from 'react';
import {Coin, CycleRing, Defs, Floor, Globe, PaperBoat, Pawn, Pie, Pin, proj, Cam} from './art';
import {C, easeIO, easeOut, FONT, H, prog, rnd, sec, W} from './theme';
import {Line, Scene, Stack, Swap, Reveal, useEnergy, useG} from './ui';

const Svg: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
    <Defs />
    {children}
  </svg>
);

const SMALL = 54;
const BIG = 250;

/* ═════════ 1 · Micro (0–2,5 s) ═════════ */
const camA: Cam = {yH: 560, span: 820, k: 470};

export const SceneMicro: React.FC<{start: number; next: number}> = ({start, next}) => {
  const g = useG();
  const e = useEnergy();
  // 9 peones: el primero es «tú» (pin azul)
  const cols = [-1, 0, 1];
  const rows = [1.55, 2.15, 2.95];
  const pawns: Array<{x: number; z: number; t: number}> = [];
  let n = 0;
  rows.forEach((z, ri) =>
    cols.forEach((c, ci) => {
      const idx = ri * 3 + ci;
      pawns.push({x: c * 1.35 + (ri % 2 ? 0.62 : -0.1), z, t: idx === 4 ? 0.3 : 0 });
      n++;
    }),
  );
  // orden de aparición: el del centro delantero primero
  const order = [1, 0, 2, 4, 3, 5, 7, 6, 8];
  return (
    <Scene start={start} next={next} noEnter>
      <Svg>
        <Floor id="fl1" cam={camA} tile={0.5} zNear={0.8} zFar={9} fade={[640, 860, 1250, 1500]} />
        {[...pawns]
          .map((p, i) => ({...p, i, ord: order.indexOf(i)}))
          .sort((a, b) => b.z - a.z)
          .map((p) => {
            const t0 = p.ord === 0 ? 0.35 : 1.0 + (p.ord - 1) * 0.1;
            const pr = prog(g, sec(t0), 14);
            const q = proj(camA, p.x - 0.5 * 0, p.z);
            const breathe = 1 + e * 0.012;
            return (
              <g key={p.i}>
                <Pawn x={q.x} y={q.y} s={2.35 * q.s * breathe} op={Math.min(1, pr * 2.5)} dy={(1 - pr) * -90} blur={(1 - pr) * 10} />
                {p.ord === 0 && <Pin x={q.x} y={q.y - 154 * 2.35 * q.s - 24 + (1 - pr) * -40 + Math.sin(g * 0.12) * 6} s={0.8} op={pr} />}
              </g>
            );
          })}
      </Svg>
      <Stack top={250}>
        <Line size={SMALL} words={[{w: 'Eres', t: 0.0}]} />
        <Line size={BIG} weight={900} words={[{w: 'Micro', t: 0.26}]} />
      </Stack>
      <Stack top={1440} gap={8}>
        <Line size={SMALL} words={[{w: 'tienes', t: 0.78}, {w: 'de', t: 1.0}]} />
        <Line size={200} weight={900} words={[{w: '1', t: 1.18}, {w: 'a', t: 1.5, size: SMALL, weight: 500}, {w: '9', t: 1.7, color: C.grey}]} gap={0.2} />
        <Line size={SMALL} words={[{w: 'trabajadores', t: 1.9}]} />
      </Stack>
    </Scene>
  );
};

/* ═════════ 2 · Vendes hasta 100 mil (2,5–5 s) ═════════ */
export const SceneSales100: React.FC<{start: number; next: number}> = ({start, next}) => {
  const g = useG();
  const e = useEnergy();
  const coins = [];
  const n = 8;
  const baseY = 1250;
  const h = 30;
  for (let i = 0; i < n; i++) {
    const t0 = sec(2.95 + i * 0.13);
    const pr = prog(g, t0, 14);
    const land = prog(g, t0 + 6, 12, easeOut);
    const bounce = Math.sin(land * Math.PI * 2.4) * (1 - land) * 6;
    coins.push(
      <Coin
        key={i}
        cx={540 + (rnd(i + 3) - 0.5) * 8}
        cy={baseY - i * h + (1 - pr) * -620 + bounce}
        r={185}
        h={h}
        label={i === n - 1}
        op={Math.min(1, pr * 3)}
      />,
    );
  }
  return (
    <Scene start={start} next={next}>
      <Svg>
        <ellipse cx={560} cy={baseY + h + 18} rx={250} ry={44} fill="rgba(0,0,0,.34)" filter="url(#fBlur16)" />
        <g transform={`translate(540 ${baseY}) scale(${1 + e * 0.01}) translate(-540 ${-baseY})`}>{coins}</g>
      </Svg>
      <Stack top={270} gap={10}>
        <Line size={SMALL} words={[{w: 'y', t: 2.56}, {w: 'vendes', t: 2.82}, {w: 'hasta', t: 3.12}]} />
        <Line size={190} weight={900} gap={0.16} words={[{w: '$100', t: 3.36}, {w: 'mil', t: 3.62, color: C.grey}]} />
      </Stack>
      <Stack top={1480}>
        <Line size={72} weight={800} words={[{w: 'dólares', t: 3.8}, {w: 'al', t: 4.16, weight: 500, size: SMALL}, {w: 'año', t: 4.36}]} />
      </Stack>
    </Scene>
  );
};

/* ═════════ 3a · Pequeña · 10 a 49 (5–7 s) ═════════ */
const camB: Cam = {yH: 700, span: 900, k: 520};

export const ScenePequena: React.FC<{start: number; next: number}> = ({start, next}) => {
  const g = useG();
  const e = useEnergy();
  const items: Array<{x: number; z: number; i: number}> = [];
  let i = 0;
  for (let r = 0; r < 7; r++)
    for (let c = 0; c < 7; c++) {
      items.push({x: (c - 3) * 0.62 + (r % 2 ? 0.31 : 0) - 0.15, z: 1.55 + r * 0.42, i: i++});
    }
  // los 10 primeros llegan con «pequeña»; el resto con «10 a 49»
  const order = items
    .map((p) => ({...p, k: rnd(p.i + 9)}))
    .sort((a, b) => a.k - b.k);
  const rank = new Map(order.map((p, idx) => [p.i, idx]));
  return (
    <Scene start={start} next={next}>
      <Svg>
        <Floor id="fl3" cam={camB} tile={0.62} zNear={1.2} zFar={9} fade={[770, 900, 1300, 1400]} />
        {[...items]
          .sort((a, b) => b.z - a.z)
          .map((p) => {
            const k = rank.get(p.i)!;
            const t0 = k < 10 ? 5.3 + k * 0.06 : 6.16 + ((k - 10) / 39) * 0.9;
            const pr = prog(g, sec(t0), 12);
            const q = proj(camB, p.x, p.z);
            return (
              <Pawn
                key={p.i}
                x={q.x}
                y={q.y}
                s={1.32 * q.s * (1 + e * 0.01)}
                op={Math.min(1, pr * 3)}
                dy={(1 - pr) * -60}
                blur={(1 - pr) * 6}
              />
            );
          })}
      </Svg>
      <Stack top={250}>
        <Line size={BIG * 0.86} weight={900} words={[{w: 'Pequeña', t: 5.08}]} />
      </Stack>
      <Stack top={1460} gap={8}>
        <Line size={SMALL} words={[{w: 'y', t: 5.62}, {w: 'tienes', t: 5.76}, {w: 'de', t: 5.98}]} />
        <Line size={200} weight={900} words={[{w: '10', t: 6.16}, {w: 'a', t: 6.38, size: SMALL, weight: 500}, {w: '49', t: 6.58, color: C.grey}]} gap={0.2} />
        <Line size={SMALL} words={[{w: 'trabajadores', t: 6.8}]} />
      </Stack>
    </Scene>
  );
};

/* ═════════ 3b · hasta un millón (7–8,7 s) ═════════ */
export const SceneSales1M: React.FC<{start: number; next: number}> = ({start, next}) => {
  const g = useG();
  const e = useEnergy();
  const baseY = 1560;
  const r = 118;
  const h = 14;
  const tower = [];
  const N = 56;
  for (let i = 0; i < N; i++) {
    const t0 = sec(7.35 + (i / N) * 1.15);
    const pr = prog(g, t0, 8);
    tower.push(
      <Coin
        key={i}
        cx={690 + (rnd(i + 11) - 0.5) * 5}
        cy={baseY - i * h + (1 - pr) * -160}
        r={r}
        h={h}
        label={i === N - 1}
        op={Math.min(1, pr * 3)}
      />,
    );
  }
  const small = [];
  for (let i = 0; i < 6; i++) {
    const pr = prog(g, sec(7.1 + i * 0.03), 10);
    small.push(<Coin key={i} cx={250} cy={baseY - i * 12 + (1 - pr) * -80} r={r * 0.7} h={12} label={i === 5} op={Math.min(1, pr * 3)} />);
  }
  const lab = prog(g, sec(7.5), 14);
  return (
    <Scene start={start} next={next}>
      <Svg>
        <ellipse cx={700} cy={baseY + 28} rx={r * 1.3} ry={30} fill="rgba(0,0,0,.34)" filter="url(#fBlur16)" />
        <ellipse cx={260} cy={baseY + 22} rx={r * 0.95} ry={22} fill="rgba(0,0,0,.3)" filter="url(#fBlur16)" />
        <g transform={`translate(690 ${baseY}) scale(${1 + e * 0.004}) translate(-690 ${-baseY})`}>{tower}</g>
        {small}
        <text
          x={250}
          y={baseY - 120}
          textAnchor="middle"
          fontFamily={FONT}
          fontWeight={800}
          fontSize={34}
          fill={C.grey}
          opacity={lab}
        >
          $100 mil
        </text>
      </Svg>
      <Stack top={270} gap={10}>
        <Line size={SMALL} words={[{w: 'y', t: 7.06}, {w: 'vendes', t: 7.4}, {w: 'hasta', t: 7.72}, {w: 'un', t: 7.96}]} />
        <Line size={210} weight={900} gap={0.14} words={[{w: '$1', t: 8.0}, {w: 'millón', t: 8.18, color: C.grey}]} />
      </Stack>
    </Scene>
  );
};

/* ═════════ 4a · Exportador habitual — barco de papel (8,7–10,4 s) ═════════ */
export const SceneBoat: React.FC<{start: number; next: number}> = ({start, next}) => {
  const g = useG();
  const e = useEnergy();
  const p = prog(g, sec(8.95), 40);
  const bob = Math.sin(g * 0.09) * 10;
  const rock = Math.sin(g * 0.07) * 1.8;
  const waves = [0, 1, 2, 3].map((i) => {
    const y = 1365 + i * 46;
    let d = '';
    for (let x = -20; x <= 1100; x += 20) {
      const yy = y + Math.sin(x * 0.012 + g * 0.08 + i * 1.3) * (10 - i * 1.5);
      d += `${x === -20 ? 'M' : 'L'}${x} ${yy.toFixed(1)} `;
    }
    return <path key={i} d={d} fill="none" stroke={`rgba(30,30,28,${0.34 - i * 0.07})`} strokeWidth={4 - i * 0.6} strokeLinecap="round" />;
  });
  return (
    <Scene start={start} next={next}>
      <Svg>
        <g opacity={Math.min(1, p * 2)}>
          <PaperBoat x={540 + (1 - p) * -520} y={1230 + bob} s={1.14 + e * 0.01} rot={rock - (1 - p) * 8} />
        </g>
        {waves}
      </Svg>
      <Stack top={250} gap={6}>
        <Line size={SMALL} words={[{w: 'Se', t: 8.8}, {w: 'considera', t: 8.82}]} />
        <Line size={150} weight={900} words={[{w: 'Exportador', t: 9.38}]} />
        <Line size={150} weight={900} color={C.grey} words={[{w: 'habitual', t: 9.92}]} />
      </Stack>
    </Scene>
  );
};

/* ═════════ 4b · Exportaciones netas — globo (10,4–12,9 s) ═════════ */
export const SceneGlobe: React.FC<{start: number; next: number}> = ({start, next}) => {
  const g = useG();
  const lf = g - start;
  const arcP = prog(g, sec(11.4), 40, easeIO);
  const pinP = prog(g, sec(10.9), 14);
  const spin = prog(g, start, 90, (t) => t);
  return (
    <Scene start={start} next={next}>
      <Svg>
        <Globe
          cx={540}
          cy={1230}
          r={330}
          rot={-26 + spin * 26 + lf * 0.1}
          home={[-12, 2]}
          dests={[[22, 38], [30, -18], [-30, 40], [4, -40]]}
          arcP={arcP}
          pinP={pinP}
          flow={lf * 1.2}
        />
      </Svg>
      <Stack top={235} gap={10}>
        <Line size={SMALL} words={[{w: 'al', t: 10.4}, {w: 'contribuyente', t: 10.62}, {w: 'cuyas', t: 11.28}]} />
        <Line size={112} weight={900} words={[{w: 'Exportaciones', t: 11.66}]} />
        <Line size={230} weight={900} color={C.grey} words={[{w: 'netas', t: 12.28}]} />
      </Stack>
    </Scene>
  );
};

/* ═════════ 5 · 25 % (12,9–15,9 s) ═════════ */
export const ScenePct: React.FC<{start: number; next: number}> = ({start, next}) => {
  const g = useG();
  const sweep = prog(g, sec(13.7), 28, easeOut) * (Math.PI / 2);
  const pull = prog(g, sec(14.3), 24) * 42;
  const pinP = prog(g, sec(14.45), 12);
  const mid = -Math.PI / 2 + Math.PI / 4;
  const cx = 540;
  const cy = 1080;
  const r = 290;
  const px = cx + Math.cos(mid) * (r * 0.55 + pull);
  const py = cy + Math.sin(mid) * (r * 0.55 + pull) + 26;
  return (
    <Scene start={start} next={next}>
      <Svg>
        <Pie cx={cx} cy={cy} r={r} sweep={Math.max(0.0001, sweep)} pull={pull} />
        <Pin x={px} y={py - (1 - pinP) * 120} s={1} op={pinP} />
      </Svg>
      <Stack top={235} gap={4}>
        <Line size={SMALL} words={[{w: 'son', t: 12.88}, {w: 'al', t: 13.08}, {w: 'menos', t: 13.24}, {w: 'del', t: 13.48}]} />
        <Line size={300} weight={900} gap={0.02} words={[{w: '25', t: 13.7}, {w: '%', t: 14.18, color: C.grey}]} />
      </Stack>
      <Stack top={1470} gap={4}>
        <Line size={SMALL} words={[{w: 'en', t: 14.62}, {w: 'su', t: 15.04}, {w: 'total', t: 15.16}, {w: 'de', t: 15.5}]} />
        <Line size={190} weight={900} words={[{w: 'ingreso', t: 15.64}]} />
      </Stack>
    </Scene>
  );
};

/* ═════════ 6/7 · 6 en 6 meses  ·  3 en 3 meses (15,9–20,4 s) ═════════ */
const MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
const SIX = [0, 2, 4, 6, 8, 10]; // ENE MAR MAY JUL SEP NOV
const THREE = [4, 6, 8]; // MAY JUL SEP

export const SceneCalendar: React.FC<{start: number; next: number}> = ({start, next}) => {
  const g = useG();
  const swapAt = sec(19.15);
  const tw = 214;
  const th = 150;
  const gap = 26;
  const x0 = (W - (4 * tw + 3 * gap)) / 2;
  const y0 = 790;
  const tiles = MONTHS.map((m, i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const cx = x0 + col * (tw + gap) + tw / 2;
    const cy = y0 + row * (th + gap) + th / 2;
    const rot = (rnd(i + 1) - 0.5) * 3.2;
    const tin = prog(g, sec(16.05) + i * 2, 14);
    const sixIdx = SIX.indexOf(i);
    const threeIdx = THREE.indexOf(i);
    const pinT = sixIdx >= 0 ? sec(16.5 + sixIdx * 0.33) : 0;
    const pinned6 = sixIdx >= 0 ? prog(g, pinT, 10) : 0;
    const keep3 = threeIdx >= 0;
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
          fontFamily={FONT}
          fontWeight={900}
          fontSize={58}
          letterSpacing="-0.02em"
          fill={pinned > 0.5 ? '#f5f4ef' : C.ink}
          opacity={pinned > 0.5 ? 1 : 0.88}
        >
          {m}
        </text>
        {shown && <Pin x={tw / 2 - 40} y={-th / 2 + 34 + (1 - pinFall) * -150} s={0.55} rot={14} op={Math.min(1, pinFall * 3)} />}
      </g>
    );
  });
  const topNum = (n: string) => (
    <Line size={300} weight={900} words={[{w: n, t: n === '6' ? 16.46 : 19.24}]} />
  );
  return (
    <Scene start={start} next={next}>
      <Svg>{tiles}</Svg>
      <Stack top={220} gap={0}>
        <Swap
          at={swapAt}
          a={<Line size={SMALL} words={[{w: 'y', t: 16.0}, {w: 'con', t: 16.2}]} />}
          b={<Line size={SMALL} words={[{w: 'o', t: 18.64}]} />}
        />
        <div style={{height: 14}} />
        <Swap
          at={sec(19.2)}
          a={<Line size={290} weight={900} words={[{w: '6', t: 16.46}]} />}
          b={<Line size={290} weight={900} color={C.ink} words={[{w: '3', t: 19.24}]} />}
        />
        <Line size={102} weight={900} words={[{w: 'exportaciones', t: 16.66}]} />
      </Stack>
      <Stack top={1520} gap={6}>
        <Swap
          at={sec(19.7)}
          a={
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
              <Line size={SMALL} words={[{w: 'en', t: 17.38}]} />
              <Line size={150} weight={900} words={[{w: '6', t: 17.7}, {w: 'meses', t: 17.9}]} gap={0.18} />
              <Line size={SMALL} color={C.grey} words={[{w: 'distintos', t: 18.14}]} />
            </div>
          }
          b={
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
              <Line size={SMALL} words={[{w: 'en', t: 19.72}]} />
              <Line size={150} weight={900} words={[{w: '3', t: 19.94}, {w: 'meses', t: 20.12}]} gap={0.18} />
              <div style={{height: 54}} />
            </div>
          }
        />
      </Stack>
    </Scene>
  );
};

/* ═════════ 8 · Producción cíclica · ejercicio fiscal (20,4–23,56 s) ═════════ */
export const SceneCycle: React.FC<{start: number; next: number}> = ({start, next}) => {
  const g = useG();
  const e = useEnergy();
  const p = prog(g, sec(20.6), 30);
  return (
    <Scene start={start} next={next}>
      <Svg>
        <g opacity={Math.min(1, p * 2)} transform={`translate(540 1010) scale(${0.86 + p * 0.14}) translate(-540 -1010)`}>
          <CycleRing cx={540} cy={1010} R={310} g={g} e={e} />
        </g>
      </Svg>
      <Stack top={250} gap={8}>
        <Line size={SMALL} words={[{w: 'si', t: 20.5}, {w: 'tu', t: 20.88}, {w: 'producción', t: 20.94}, {w: 'es', t: 21.28}]} />
        <Line size={220} weight={900} words={[{w: 'cíclica', t: 21.58}]} />
      </Stack>
      <Stack top={912} gap={0}>
        <Line size={190} weight={900} color={C.greyLt} words={[{w: '12', t: 20.8}]} />
        <Line size={32} weight={800} color={C.grey} ls="0.4em" words={[{w: 'MESES', t: 20.95}]} />
      </Stack>
      <Stack top={1440} gap={4}>
        <Line size={SMALL} words={[{w: 'durante', t: 22.0}, {w: 'el', t: 22.38}]} />
        <Line size={150} weight={900} words={[{w: 'ejercicio', t: 22.6}]} />
        <Line size={150} weight={900} color={C.grey} words={[{w: 'fiscal', t: 23.04}]} />
      </Stack>
    </Scene>
  );
};
