import React from 'react';
import {Ceiling, Coin, Defs, Doc, Eye, Forbid, Note, RulerLens, Tray, World} from './art';
import {C, easeIn, easeIO, easeOut, HEAD, H, prog, rnd, sec, W} from './theme';
import {Art, Line, Scene, Stack, useEnergy, useG, useScene} from './ui';

/*
 * Zonas seguras para redes: x 110–970, y 300–1480. El contenido empieza en y 340.
 * Escala tipográfica fija (px): SM 46 · M1 96 · M2 120 · L 170 · XL 210 · XXL 240.
 * Peso: Plus Jakarta Sans ExtraBold (800) para palabras clave, Inter Medium (500) para apoyo.
 */
const SM = 46;
const M1 = 96;
const M2 = 120;
const L = 170;
const XL = 210;
const XXL = 240;
const TOP = 340;

const Svg: React.FC<{noEnter?: boolean; children: React.ReactNode}> = ({noEnter, children}) => (
  <Art noEnter={noEnter}>
    <Defs />
    {children}
  </Art>
);

/* ranura de texto: una sola frase visible a la vez, sin solaparse con la siguiente */
const Slot: React.FC<{h: number; items: Array<{t: number; node: React.ReactNode}>}> = ({h, items}) => {
  const g = useG();
  const {start} = useScene();
  return (
    <div style={{position: 'relative', width: W, height: h}}>
      {items.map((it, i) => {
        const a = Math.max(Math.round((it.t - 0.12) * 30), start + 4);
        const b = i < items.length - 1 ? Math.max(Math.round((items[i + 1].t - 0.12) * 30), start + 4) : 1e9;
        if (g < a - 1 || g > b + 1) return null;
        const out = prog(g, b - 8, 5, easeIn);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: W,
              height: h,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: 1 - out,
              filter: out > 0 ? `blur(${out * 14}px)` : undefined,
              transform: out > 0 ? `translateY(${-out * 24}px)` : undefined,
            }}
          >
            {it.node}
          </div>
        );
      })}
    </div>
  );
};

/* ═════════ 1 · «Si no presentas la declaración» (0–2,2 s): documento en blanco que no entra en la bandeja ═════════ */
export const SceneDeclaracion: React.FC<{start: number; end: number}> = ({start, end}) => {
  const g = useG();
  const e = useEnergy();
  const enter = prog(g, 0, 18);
  const trayP = prog(g, 10, 14);
  const arrowP = prog(g, sec(0.7), 14);
  const forbidT = sec(1.15);
  const forbid = prog(g, forbidT, 12);
  // el documento intenta bajar a la bandeja y rebota
  const push = prog(g, sec(0.78), 12, easeIO) * (1 - prog(g, forbidT, 10));
  const ghost = 0.5 + 0.5 * Math.sin(g * 0.18);
  return (
    <Scene start={start} end={end}>
      <Svg noEnter>
        <Tray cx={540} cy={1380} op={trayP} ghost={ghost} />
        <g opacity={arrowP}>
          <line x1={540} y1={1236} x2={540} y2={1302} stroke="#55534f" strokeWidth={7} strokeLinecap="round" strokeDasharray="12 12" />
          <polygon points="518,1298 562,1298 540,1326" fill="#55534f" />
        </g>
        <Doc
          cx={540}
          cy={952 + (1 - enter) * 60 + push * 22 + Math.sin(g * 0.08) * 3}
          s={0.75 + e * 0.003}
          rot={-2.5}
          vals={Array(5).fill(0)}
          bars={Array(5).fill(0)}
          hi={0}
          stamp={0}
          check={0}
          op={Math.min(1, enter * 2.5)}
        />
        <Forbid cx={540} cy={1272} p={forbid} />
      </Svg>
      <Stack top={TOP} gap={8}>
        <Line size={SM} words={[{w: 'Si', t: 0.0}]} />
        <Line size={M2} weight={800} words={[{w: 'no', t: 0.3}, {w: 'presentas', t: 0.58, color: C.grey}]} />
        <Line size={M2} weight={800} words={[{w: 'la', t: 1.4, size: SM, weight: 500}, {w: 'declaración', t: 1.5}]} gap={0.2} />
      </Stack>
    </Scene>
  );
};

/* ═════════ 2 · «o si la presentas pero omites total o parcialmente esos activos» (2,45–7,85 s) ═════════ */
export const SceneOmision: React.FC<{start: number; end: number}> = ({start, end}) => {
  const g = useG();
  const sign = prog(g, start + 8, 18);
  const stamp = prog(g, sec(2.92), 8);
  const check = prog(g, sec(3.08), 12);
  const barsIn = Array.from({length: 5}, (_, i) => prog(g, sec(3.85) + i * 4, 10));
  // «parcialmente»: se destapan las filas 2.ª y 4.ª
  const bars = barsIn.map((p, i) => (i % 2 === 1 ? p * (1 - prog(g, sec(5.5) + (i >> 1) * 6, 10)) : p));
  const hi = prog(g, sec(6.65), 12);
  return (
    <Scene start={start} end={end}>
      <Svg>
        <Doc cx={540} cy={1050} s={1} rot={-2.5} vals={Array(5).fill(1)} bars={bars} hi={hi} stamp={stamp} check={check} sign={sign} />
      </Svg>
      <Stack top={TOP} gap={14}>
        <Line size={SM} words={[{w: 'o', t: 2.24}, {w: 'si', t: 2.56}, {w: 'la', t: 2.68}, {w: 'presentas', t: 2.82}]} />
        <Slot
          h={L}
          items={[
            {
              t: 3.52,
              node: <Line size={L} weight={800} words={[{w: 'pero', t: 3.52, size: SM, weight: 500}, {w: 'omites', t: 3.88}]} gap={0.2} />,
            },
            {t: 4.46, node: <Line size={L} weight={800} color={C.grey} words={[{w: 'total', t: 4.46}]} />},
            {
              t: 4.98,
              node: <Line size={M2} weight={800} words={[{w: 'o', t: 4.98, size: SM, weight: 500}, {w: 'parcialmente', t: 5.36}]} gap={0.2} />,
            },
            {
              t: 6.6,
              node: <Line size={L} weight={800} words={[{w: 'esos', t: 6.6, size: SM, weight: 500}, {w: 'activos', t: 6.84, color: C.blue}]} gap={0.2} />,
            },
          ]}
        />
      </Stack>
    </Scene>
  );
};

/* ═════════ 3 · «la multa será del 0,5 %»: la lupa revela lo pequeño que es (7,85–11,75 s) ═════════ */
export const SceneMulta: React.FC<{start: number; end: number}> = ({start, end}) => {
  const g = useG();
  const grow = prog(g, sec(8.0), 24);
  const lens = prog(g, sec(8.65), 16);
  const ticks = prog(g, sec(8.95), 12);
  const hiStart = sec(9.3);
  const fill = prog(g, hiStart, 10);
  const pulse = g >= hiStart + 4 ? ((g - hiStart - 4) % 42) / 42 : 0;
  return (
    <Scene start={start} end={end}>
      <Svg>
        <RulerLens cy={1060} grow={grow} lens={lens} ticks={ticks} fill={fill} pulse={pulse} />
      </Svg>
      <Stack top={TOP} gap={8}>
        <Line size={SM} words={[{w: 'la', t: 7.66}, {w: 'multa', t: 7.94}, {w: 'será', t: 8.34}, {w: 'del', t: 8.62}]} />
        <Line size={XXL} weight={800} gap={0.02} words={[{w: '0,5', t: 8.96}, {w: '%', t: 10.62, color: C.grey}]} />
      </Stack>
    </Scene>
  );
};

/* ═════════ 4 · «del valor total de los activos del exterior»: mapamundi con Ecuador y pines (11,75–14,95 s) ═════════ */
const PINS: Array<[number, number, number]> = [
  [-79.5, 8.9, 12.15],
  [-80.2, 25.8, 12.45],
  [-99.1, 19.4, 12.75],
  [-74.0, 40.7, 13.05],
  [-3.7, 40.4, 13.55],
  [8.5, 47.4, 13.95],
];

export const SceneExterior: React.FC<{start: number; end: number}> = ({start, end}) => {
  const g = useG();
  const sweep = prog(g, start, 100, easeIO);
  const pins = PINS.map(([lon, lat, t]) => [lon, lat, prog(g, sec(t), 12)] as [number, number, number]);
  return (
    <Scene start={start} end={end}>
      <Svg>
        <World cx={540} cy={1110} r={280} lon={-92 + 50 * sweep} lat={14} pins={pins} home={prog(g, sec(12.0), 14)} />
      </Svg>
      <Stack top={TOP} gap={12}>
        <Line
          size={SM}
          words={[{w: 'del', t: 11.32}, {w: 'valor', t: 11.74}, {w: 'total', t: 12.22}, {w: 'de', t: 12.84}, {w: 'los', t: 13.42}]}
        />
        <Line size={L} weight={800} words={[{w: 'activos', t: 13.4}]} />
        <Line size={M2} weight={800} color={C.grey} words={[{w: 'del', t: 14.06, size: SM, weight: 500, color: C.ink}, {w: 'exterior', t: 14.2}]} gap={0.2} />
      </Stack>
    </Scene>
  );
};

/* ═════════ 5 · «no reportados» (15,35–16,75 s) ═════════ */
export const SceneNoReportado: React.FC<{start: number; end: number}> = ({start, end}) => {
  const g = useG();
  const open = prog(g, start, 14);
  const look = Math.sin((g - start) * 0.11);
  const slash = prog(g, sec(15.8), 11, easeOut);
  return (
    <Scene start={start} end={end}>
      <Svg>
        <Eye cx={540} cy={1090} open={open} look={look} slash={slash} slashDrop={0} />
      </Svg>
      <Stack top={TOP} gap={8}>
        <Line size={L} weight={800} words={[{w: 'no', t: 15.24}]} />
        <Line size={M2} weight={800} color={C.grey} words={[{w: 'reportados', t: 15.74}]} />
      </Stack>
    </Scene>
  );
};

/* ═════════ 6 · «sin que esto exceda» — la torre choca con el techo (16,75–18,65 s) ═════════ */
export const SceneTope: React.FC<{start: number; end: number}> = ({start, end}) => {
  const g = useG();
  const base = 1420;
  const r = 125;
  const h = 15;
  const N = 36;
  const t0 = 16.95;
  const lastT = sec(t0 + ((N - 1) / N) * 1.0);
  const hit = lastT + 3;
  const since = g - hit;
  const shake = since >= 0 ? Math.sin(since * 1.1) * 9 * Math.exp(-since / 6) : 0;
  const flash = since >= 0 ? 0.35 + 0.65 * Math.max(0, 1 - since / 14) : 0;
  const coins = [];
  for (let i = 0; i < N; i++) {
    const p = prog(g, sec(t0 + (i / N) * 1.0), 9);
    coins.push(
      <Coin key={i} cx={540 + (rnd(i + 5) - 0.5) * 5} cy={base - i * h - (1 - p) * 150} r={r} h={h} op={Math.min(1, p * 3)} label={i === N - 1} />,
    );
  }
  const tin = prog(g, start, 14);
  return (
    <Scene start={start} end={end}>
      <Svg>
        <g opacity={tin}>
          <Ceiling cx={540} y={822} dy={shake} flash={flash} />
        </g>
        <ellipse cx={556} cy={base + 30} rx={r * 1.2} ry={26} fill="rgba(0,0,0,.34)" filter="url(#fBlur16)" opacity={prog(g, sec(t0), 8)} />
        {coins}
      </Svg>
      <Stack top={TOP} gap={8}>
        <Line size={SM} words={[{w: 'sin', t: 16.68}, {w: 'que', t: 16.86}, {w: 'esto', t: 17.1}]} />
        <Line size={L} weight={800} words={[{w: 'exceda', t: 17.48}]} />
      </Stack>
    </Scene>
  );
};

/* ═════════ 7 · «2075 salarios básicos unificados» (18,65–21,89 s) ═════════ */
const fmt = (n: number) => {
  const s = String(Math.round(n));
  return s.length > 3 ? `${s.slice(0, s.length - 3)}.${s.slice(-3)}` : s;
};

export const SceneSalarios: React.FC<{start: number; end: number}> = ({start, end}) => {
  const g = useG();
  const e = useEnergy();
  const count = prog(g, sec(18.72), 38, easeIO);
  const value = 2075 * count;
  const reveal = prog(g, start + 4, 12);
  const NN = 14;
  const baseY = 1080;
  const notes = [];
  for (let i = 0; i < NN; i++) {
    const p = prog(g, sec(18.78) + Math.round(i * 2.4), 9);
    notes.push(
      <Note
        key={i}
        cx={540 + (rnd(i + 21) - 0.5) * 18}
        cy={baseY - i * 15 - (1 - p) * 120}
        rot={(rnd(i + 41) - 0.5) * 3.2}
        op={Math.min(1, p * 3)}
      />,
    );
  }
  const digits = fmt(value).split('');
  return (
    <Scene start={start} end={end}>
      <Svg>
        <ellipse cx={556} cy={baseY + 130} rx={300} ry={30} fill="rgba(0,0,0,.3)" filter="url(#fBlur16)" opacity={prog(g, sec(18.75), 8)} />
        <g transform={`translate(540 ${baseY}) scale(${1.12 + e * 0.006}) translate(-540 ${-baseY})`}>{notes}</g>
      </Svg>
      <Stack top={TOP}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            fontFamily: HEAD,
            fontWeight: 800,
            fontSize: XL,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            color: C.ink,
            opacity: Math.min(1, reveal * 2.4),
            filter: `blur(${(1 - reveal) * 18}px)`,
            transform: `translateY(${(1 - reveal) * 34}px)`,
          }}
        >
          {digits.map((d, i) => (
            <span key={i} style={{display: 'inline-block', width: d === '.' ? '0.3em' : '0.64em', textAlign: 'center'}}>
              {d}
            </span>
          ))}
        </div>
      </Stack>
      <Stack top={1256} gap={8}>
        <Line size={M1} weight={800} words={[{w: 'salarios', t: 19.82}, {w: 'básicos', t: 20.62, color: C.grey}]} gap={0.2} />
        <Line size={M2} weight={800} words={[{w: 'unificados', t: 21.2}]} />
      </Stack>
    </Scene>
  );
};
