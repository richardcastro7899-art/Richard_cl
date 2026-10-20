import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {INTER} from './fonts';

export const FPS = 30;
export const DURATION = 17 * FPS; // 510 frames exactos
export const WIDTH = 1080;
export const HEIGHT = 1920;

/* ------------------------------------------------------------------ */
/* Sistema                                                            */
/* ------------------------------------------------------------------ */

const C = {
  bg: '#171E27',
  surface: '#1E2631',
  orange: '#D4681C',
  white: '#FFFFFF',
  hair: 'rgba(255,255,255,0.14)',
  muted: 'rgba(255,255,255,0.56)',
  faint: 'rgba(255,255,255,0.045)',
};

// Retícula: margen 110 px a cada lado (ancho útil 860), zona segura vertical 300–1480.
const G = {left: 110, right: 970, top: 300, bottom: 1480, cx: 540};

const E = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  soft: Easing.bezier(0.33, 1, 0.68, 1),
};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const tw = (f: number, a: number, b: number, from = 0, to = 1, easing = E.out) =>
  interpolate(f, [a, b], [from, to], {...clamp, easing});

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const label: React.CSSProperties = {
  fontFamily: INTER,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.16em',
  color: C.muted,
};

/* ------------------------------------------------------------------ */
/* Primitivas                                                         */
/* ------------------------------------------------------------------ */

// Línea de texto revelada por máscara (sube desde abajo, sale hacia arriba).
const MaskLine: React.FC<{
  inP: number;
  outP?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({inP, outP = 0, children, style}) => (
  <div style={{overflow: 'hidden', padding: '0.14em 0', margin: '-0.14em 0', ...style}}>
    <div style={{transform: `translateY(${(1 - inP) * 118 - outP * 118}%)`, willChange: 'transform'}}>
      {children}
    </div>
  </div>
);

// Trazo SVG que se dibuja con pathLength normalizado.
const draw = (p: number): React.SVGProps<SVGPathElement> => ({
  pathLength: 1,
  strokeDasharray: '1 1',
  strokeDashoffset: 1 - p,
});

/* ------------------------------------------------------------------ */
/* Retícula de fondo                                                  */
/* ------------------------------------------------------------------ */

const Grid: React.FC<{f: number}> = ({f}) => {
  const fadeOut = 1 - tw(f, 492, 508, 0, 1, E.inOut);
  const cols = [110, 325, 540, 755, 970];
  const marks: Array<[number, number]> = [];
  for (const x of cols) for (const y of [G.top - 40, G.bottom]) marks.push([x, y]);
  return (
    <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute', inset: 0, opacity: fadeOut}}>
      {cols.map((x, i) => {
        const p = tw(f, 2 + i * 3, 30 + i * 3, 0, 1, E.inOut);
        return (
          <line
            key={x}
            x1={x}
            x2={x}
            y1={0}
            y2={HEIGHT * p}
            stroke={C.white}
            strokeOpacity={0.035}
            strokeWidth={1.5}
          />
        );
      })}
      {marks.map(([x, y], i) => {
        const p = tw(f, 14 + i * 1.2, 34 + i * 1.2);
        return (
          <g key={i} opacity={0.22 * p} transform={`translate(${x} ${y}) scale(${0.4 + 0.6 * p})`}>
            <line x1={-9} x2={9} y1={0} y2={0} stroke={C.white} strokeWidth={1.5} />
            <line x1={0} x2={0} y1={-9} y2={9} stroke={C.white} strokeWidth={1.5} />
          </g>
        );
      })}
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Indicador de capítulo (fuera de la cámara, fijo en la retícula)    */
/* ------------------------------------------------------------------ */

const CHAPTERS = [
  {n: '01', t: 'Documentación', in: 12, out: 128},
  {n: '02', t: 'Revisión', in: 136, out: 278},
  {n: '03', t: 'Evaluación', in: 286, out: 372},
];

const ChapterIndex: React.FC<{f: number}> = ({f}) => {
  const rule = tw(f, 10, 34, 0, 1, E.inOut) * (1 - tw(f, 372, 388, 0, 1, E.inOut));
  return (
    <div style={{position: 'absolute', left: G.left, top: G.top - 6, display: 'flex', alignItems: 'center', gap: 22}}>
      <div style={{position: 'relative', width: 44, height: 34}}>
        {CHAPTERS.map((c) => (
          <MaskLine
            key={c.n}
            inP={tw(f, c.in, c.in + 20)}
            outP={tw(f, c.out, c.out + 12, 0, 1, E.in)}
            style={{position: 'absolute', inset: 0}}
          >
            <span style={{fontFamily: INTER, fontWeight: 700, fontSize: 28, color: C.white, fontVariantNumeric: 'tabular-nums'}}>
              {c.n}
            </span>
          </MaskLine>
        ))}
      </div>
      <div style={{width: 48, height: 2, background: C.hair, transform: `scaleX(${rule})`, transformOrigin: 'left'}} />
      <div style={{position: 'relative', width: 360, height: 34}}>
        {CHAPTERS.map((c) => (
          <MaskLine
            key={c.t}
            inP={tw(f, c.in + 4, c.in + 24)}
            outP={tw(f, c.out + 2, c.out + 14, 0, 1, E.in)}
            style={{position: 'absolute', inset: 0}}
          >
            <span style={{...label, fontSize: 24, lineHeight: '34px'}}>{c.t}</span>
          </MaskLine>
        ))}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Iconografía                                                        */
/* ------------------------------------------------------------------ */

const FormIcon: React.FC<{p: number}> = ({p}) => {
  const ln = (i: number) => tw(p, 0.35 + i * 0.12, 0.75 + i * 0.12, 0, 1, E.inOut);
  return (
    <svg viewBox="0 0 80 100" width="100%" height="100%" fill="none" stroke={C.white} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 4 H52 L72 24 V96 H8 Z" {...draw(tw(p, 0, 0.6, 0, 1, E.inOut))} />
      <path d="M52 4 V24 H72" {...draw(tw(p, 0.3, 0.6, 0, 1, E.inOut))} />
      <path d="M18 38 H44" strokeWidth={5} {...draw(ln(0))} />
      {[54, 66, 78].map((y, i) => (
        <g key={y} opacity={0.75}>
          <rect x={18} y={y - 4} width={8} height={8} rx={1.5} strokeWidth={2} opacity={ln(i + 1)} />
          <path d={`M32 ${y} H62`} {...draw(ln(i + 1))} />
        </g>
      ))}
    </svg>
  );
};

const ReceiptIcon: React.FC<{p: number}> = ({p}) => {
  const ln = (i: number) => tw(p, 0.35 + i * 0.12, 0.75 + i * 0.12, 0, 1, E.inOut);
  const zig = 'M12 4 H64 V90 L57.5 96 L51 90 L44.5 96 L38 90 L31.5 96 L25 90 L18.5 96 L12 90 Z';
  return (
    <svg viewBox="0 0 80 100" width="100%" height="100%" fill="none" stroke={C.white} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 4 V0 H74 V84" opacity={0.35 * tw(p, 0.4, 0.8)} transform="translate(0 4)" />
      <path d={zig} {...draw(tw(p, 0, 0.6, 0, 1, E.inOut))} />
      <path d="M22 22 H54" {...draw(ln(0))} />
      <path d="M22 36 H46" opacity={0.75} {...draw(ln(1))} />
      <path d="M22 50 H50" opacity={0.75} {...draw(ln(2))} />
      <path d="M22 70 H34 M44 70 H54" strokeWidth={4} {...draw(ln(3))} />
    </svg>
  );
};

// Indicador de verificación: pendiente → analizando (arco que gira) → revisado.
const CheckMarker: React.FC<{start: number; f: number; resolves: boolean}> = ({start, f, resolves}) => {
  const appear = tw(f, start - 10, start);
  const done = resolves ? tw(f, start + 16, start + 26, 0, 1, E.inOut) : 0;
  const spin = (f - start) * 14;
  const analyzing = f >= start ? 1 - done : 0;
  return (
    <svg width={30} height={30} viewBox="0 0 30 30" style={{opacity: appear, transform: `scale(${0.6 + 0.4 * appear})`}}>
      <circle cx={15} cy={15} r={12} fill="none" stroke={C.white} strokeOpacity={0.22 + 0.5 * done} strokeWidth={2} />
      <circle
        cx={15}
        cy={15}
        r={12}
        fill="none"
        stroke={C.orange}
        strokeWidth={2.4}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="0.28 1"
        opacity={analyzing}
        transform={`rotate(${spin} 15 15)`}
      />
      <path d="M9.5 15.5 L13.5 19.5 L20.5 11" fill="none" stroke={C.white} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" {...draw(done)} />
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Tarjetas de documento                                              */
/* ------------------------------------------------------------------ */

type CardSpec = {
  id: 'A' | 'B';
  tag: string;
  lines: [string, string];
  enter: number;
  wide: {x: number; y: number};
  compact: {x: number; y: number};
  checks: number;
  bob: number;
};

const CARDS: CardSpec[] = [
  {id: 'A', tag: 'Formularios SRI', lines: ['Declaraciones', 'tributarias'], enter: 8, wide: {x: 110, y: 600}, compact: {x: 110, y: 420}, checks: 192, bob: 0},
  {id: 'B', tag: 'Facturas · Registros', lines: ['Soportes', 'contables'], enter: 22, wide: {x: 230, y: 880}, compact: {x: 560, y: 420}, checks: 204, bob: 1.9},
];

const CARD_WIDE = {w: 740, h: 240};
const CARD_COMPACT = {w: 410, h: 220};

const cardGeometry = (spec: CardSpec, f: number) => {
  // A se compacta primero; B avanza en X y después sube, así nunca se cruzan.
  const m = spec.id === 'A' ? tw(f, 118, 152, 0, 1, E.inOut) : tw(f, 118, 166, 0, 1, E.inOut);
  const mx = spec.id === 'A' ? m : tw(f, 118, 150, 0, 1, E.inOut);
  const my = spec.id === 'A' ? m : tw(f, 134, 168, 0, 1, E.inOut);
  return {
    m,
    x: lerp(spec.wide.x, spec.compact.x, mx),
    y: lerp(spec.wide.y, spec.compact.y, my),
    w: lerp(CARD_WIDE.w, CARD_COMPACT.w, m),
    h: lerp(CARD_WIDE.h, CARD_COMPACT.h, m),
  };
};

const DocCard: React.FC<{spec: CardSpec; f: number}> = ({spec, f}) => {
  const {m, x, y, w, h} = cardGeometry(spec, f);
  const enter = tw(f, spec.enter, spec.enter + 32);
  const bobAmp = 6 * (1 - m * 0.6);
  const bob = Math.sin(f / 22 + spec.bob) * bobAmp;

  // Absorción hacia el núcleo (inicio escena 3)
  const ab = tw(f, 252, 284, 0, 1, E.in);
  const cx = x + w / 2;
  const cy = y + h / 2;
  const dx = (G.cx - cx) * ab;
  const dy = (CORE.cy - cy) * ab;

  const icon = tw(f, spec.enter + 10, spec.enter + 52, 0, 1, E.soft);
  const pad = lerp(40, 30, m);
  const iconW = lerp(84, 60, m);
  const titleSize = lerp(50, 36, m);
  const tagSize = lerp(21, 17, m);
  const markers = tw(f, spec.checks - 18, spec.checks - 4);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        transform: `translate(${dx}px, ${(1 - enter) * 90 + bob * (1 - ab) + dy}px) scale(${lerp(1, 0.22, ab)})`,
        opacity: enter * (1 - tw(f, 268, 284, 0, 1, E.inOut)),
        clipPath: `inset(${(1 - enter) * 100}% 0 0 0 round 18px)`,
        background: C.surface,
        border: `2px solid ${C.hair}`,
        borderRadius: 18,
        boxSizing: 'border-box',
        padding: pad,
        display: 'flex',
        gap: lerp(34, 22, m),
        alignItems: 'flex-start',
      }}
    >
      <div style={{width: iconW, height: iconW * 1.25, flexShrink: 0, marginTop: 4}}>
        {spec.id === 'A' ? <FormIcon p={icon} /> : <ReceiptIcon p={icon} />}
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: lerp(14, 10, m), minWidth: 0}}>
        <MaskLine inP={tw(f, spec.enter + 12, spec.enter + 34)}>
          <span style={{...label, fontSize: tagSize, whiteSpace: 'nowrap'}}>{spec.tag}</span>
        </MaskLine>
        <div>
          {spec.lines.map((t, i) => (
            <MaskLine key={t} inP={tw(f, spec.enter + 16 + i * 5, spec.enter + 42 + i * 5)}>
              <div style={{fontFamily: INTER, fontWeight: 600, fontSize: titleSize, lineHeight: 1.08, letterSpacing: '-0.02em', color: C.white, whiteSpace: 'nowrap'}}>
                {t}
              </div>
            </MaskLine>
          ))}
        </div>
      </div>
      <div style={{position: 'absolute', right: pad - 4, bottom: pad - 6, display: 'flex', gap: 10, opacity: markers}}>
        {[0, 1, 2].map((i) => (
          <CheckMarker key={i} f={f} start={spec.checks + i * 20} resolves={i < 2} />
        ))}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Conectores                                                         */
/* ------------------------------------------------------------------ */

const CORE = {cx: 540, cy: 975, r: 150};

const Connectors: React.FC<{f: number}> = ({f}) => {
  const ends = CARDS.map((s) => ({x: s.compact.x + CARD_COMPACT.w / 2, y: s.compact.y + CARD_COMPACT.h}));
  const ey = CORE.cy - CORE.r - 22;
  const paths = ends.map(({x, y}) => {
    const my = (y + ey) / 2;
    return `M${x} ${y} C${x} ${my} ${G.cx} ${my - 10} ${G.cx} ${ey}`;
  });
  const base = tw(f, 150, 182, 0, 1, E.inOut);
  const erase = tw(f, 248, 272, 0, 1, E.in);
  const pulses = [
    [174, 210],
    [184, 220],
    [216, 248],
    [224, 254],
  ];
  return (
    <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute', inset: 0}} fill="none">
      {paths.map((d, i) => (
        <g key={i}>
          <path d={d} stroke={C.white} strokeOpacity={0.24} strokeWidth={2} pathLength={1} strokeDasharray="1 2" strokeDashoffset={erase > 0 ? -erase : 1 - base} />
          <circle cx={ends[i].x} cy={ends[i].y} r={5} fill={C.white} opacity={base * (1 - erase)} />
        </g>
      ))}
      {pulses.map(([a, b], k) => {
        const i = k % 2;
        const t = tw(f, a, b, 0, 1, E.inOut);
        const visible = f >= a && f <= b;
        return (
          <path
            key={k}
            d={paths[i]}
            stroke={C.orange}
            strokeWidth={4}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="0.24 2"
            strokeDashoffset={0.24 - t * 1.24}
            opacity={visible ? 1 : 0}
          />
        );
      })}
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Núcleo → tarjeta de saldos                                         */
/* ------------------------------------------------------------------ */

const BAL = {w: 860, h: 670, cy: 790};

const DOC_LINES = [
  {y: -66, w: 150},
  {y: -33, w: 196},
  {y: 0, w: 176},
  {y: 33, w: 200},
  {y: 66, w: 120},
];

const CoreInterior: React.FC<{f: number; size: number}> = ({f, size}) => {
  const c = size / 2;
  const t = (f - 160) / FPS;
  const lensIn = tw(f, 166, 190);
  const lx = c + Math.sin(t * 1.25) * 52 * lensIn;
  const ly = c + Math.sin(t * 2.1 + 0.6) * 44 * lensIn;
  const lensR = 48;
  const lines = (opacity: number, sw: number) =>
    DOC_LINES.map((l, i) => {
      const p = tw(f, 156 + i * 4, 186 + i * 4, 0, 1, E.inOut);
      const x0 = c - 100;
      return <path key={i} d={`M${x0} ${c + l.y} H${x0 + l.w}`} stroke={C.white} strokeOpacity={opacity} strokeWidth={sw} strokeLinecap="round" {...draw(p)} />;
    });
  return (
    <svg width={size} height={size} style={{position: 'absolute', inset: 0}} fill="none">
      <defs>
        <clipPath id="lens">
          <circle cx={lx} cy={ly} r={lensR - 2} />
        </clipPath>
      </defs>
      {lines(0.2, 6)}
      <g clipPath="url(#lens)" opacity={lensIn}>
        <circle cx={lx} cy={ly} r={lensR} fill={C.bg} />
        <g transform={`translate(${lx} ${ly}) scale(1.45) translate(${-lx} ${-ly})`}>{lines(0.92, 6)}</g>
      </g>
      <g opacity={lensIn} transform={`rotate(${Math.sin(t * 1.6) * 6} ${lx} ${ly})`}>
        <circle cx={lx} cy={ly} r={lensR} stroke={C.white} strokeWidth={4} />
        <path d={`M${lx + lensR * 0.72} ${ly + lensR * 0.72} L${lx + lensR * 1.32} ${ly + lensR * 1.32}`} stroke={C.white} strokeWidth={9} strokeLinecap="round" />
      </g>
    </svg>
  );
};

const CoreRing: React.FC<{f: number}> = ({f}) => {
  const R = CORE.r + 24;
  const size = R * 2 + 20;
  const c = size / 2;
  const appear = tw(f, 154, 186, 0, 1, E.inOut);
  const arc = tw(f, 206, 262, 0, 0.72, E.soft);
  const hide = 1 - tw(f, 256, 274, 0, 1, E.inOut);
  return (
    <svg
      width={size}
      height={size}
      style={{position: 'absolute', left: CORE.cx - c, top: CORE.cy - c, opacity: hide}}
      fill="none"
    >
      <circle cx={c} cy={c} r={R} stroke={C.white} strokeOpacity={0.28} strokeWidth={2} strokeDasharray="2 12" transform={`rotate(${f * 0.4} ${c} ${c})`} opacity={appear} />
      <circle
        cx={c}
        cy={c}
        r={R}
        stroke={C.orange}
        strokeWidth={4}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={`${arc} 1`}
        transform={`rotate(${-90 + (f - 206) * 1.2} ${c} ${c})`}
        opacity={arc > 0.001 ? 1 : 0}
      />
    </svg>
  );
};

const SavingsRows = [
  {t: 'Crédito de IVA', w: 210},
  {t: 'Retenciones', w: 270},
  {t: 'Pago en exceso', w: 160},
];

const STOPS = [
  {p: 1 / 6, t: 'Origen'},
  {p: 1 / 2, t: 'Sustento'},
  {p: 5 / 6, t: 'Plazo'},
];

const BalanceContent: React.FC<{f: number}> = ({f}) => {
  const badge = tw(f, 300, 326, 0, 1, E.inOut);
  const progress = tw(f, 322, 384, 0, 0.72, E.soft);
  const divider = (s: number) => tw(f, s, s + 26, 0, 1, E.inOut);
  return (
    <div style={{position: 'absolute', inset: 0, padding: 56, boxSizing: 'border-box'}}>
      {/* Cabecera */}
      <div style={{display: 'flex', alignItems: 'center', gap: 32}}>
        <div style={{position: 'relative', width: 104, height: 104, flexShrink: 0}}>
          <svg width={104} height={104} style={{position: 'absolute', inset: 0}} fill="none">
            <circle cx={52} cy={52} r={49} stroke={C.orange} strokeWidth={3} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - badge} transform="rotate(-90 52 52)" />
          </svg>
          <MaskLine inP={tw(f, 308, 330)} style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0}}>
            <div style={{fontFamily: INTER, fontWeight: 600, fontSize: 56, color: C.orange, lineHeight: 1, textAlign: 'center', width: 104}}>$</div>
          </MaskLine>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
          <MaskLine inP={tw(f, 304, 326)}>
            <span style={{...label, fontSize: 21}}>Saldos tributarios</span>
          </MaskLine>
          <MaskLine inP={tw(f, 308, 332)}>
            <span style={{fontFamily: INTER, fontWeight: 600, fontSize: 46, letterSpacing: '-0.02em', color: C.white}}>Saldos a favor</span>
          </MaskLine>
        </div>
      </div>

      <div style={{height: 2, background: C.hair, marginTop: 40, transform: `scaleX(${divider(306)})`, transformOrigin: 'left'}} />

      {/* Filas abstractas: sin montos */}
      <div style={{display: 'flex', flexDirection: 'column', gap: 30, marginTop: 36}}>
        {SavingsRows.map((r, i) => {
          const s = 312 + i * 6;
          const bar = tw(f, s + 6, s + 34, 0, 1, E.inOut);
          const sweep = ((f - s) * 6 + i * 60) % (r.w + 120);
          return (
            <div key={r.t} style={{display: 'flex', alignItems: 'center', height: 48}}>
              <MaskLine inP={tw(f, s, s + 22)} style={{width: 320}}>
                <span style={{fontFamily: INTER, fontWeight: 500, fontSize: 32, color: 'rgba(255,255,255,0.88)'}}>{r.t}</span>
              </MaskLine>
              <div style={{position: 'relative', width: r.w, height: 20, borderRadius: 10, overflow: 'hidden', background: 'rgba(255,255,255,0.12)', transform: `scaleX(${bar})`, transformOrigin: 'left'}}>
                <div style={{position: 'absolute', top: 0, bottom: 0, width: 56, left: sweep - 60, background: 'rgba(255,255,255,0.16)', borderRadius: 10}} />
              </div>
              <div style={{marginLeft: 'auto', opacity: tw(f, s + 14, s + 30)}}>
                <svg width={40} height={40} fill="none">
                  <circle cx={20} cy={20} r={15} stroke={C.white} strokeOpacity={0.18} strokeWidth={2.5} />
                  <circle cx={20} cy={20} r={15} stroke={C.white} strokeOpacity={0.85} strokeWidth={2.5} strokeLinecap="round" pathLength={1} strokeDasharray="0.22 1" transform={`rotate(${(f - s) * (7 + i * 2)} 20 20)`} />
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{height: 2, background: C.hair, marginTop: 40, transform: `scaleX(${divider(320)})`, transformOrigin: 'left'}} />

      {/* Evaluación en curso */}
      <div style={{marginTop: 38}}>
        <MaskLine inP={tw(f, 318, 340)}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <div style={{width: 10, height: 10, borderRadius: 5, background: C.orange, opacity: 0.55 + 0.45 * Math.sin(f / 5) ** 2}} />
            <span style={{...label, fontSize: 21}}>Evaluación en curso</span>
          </div>
        </MaskLine>
        <div style={{position: 'relative', height: 90, marginTop: 30}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 10, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.12)', transform: `scaleX(${divider(322)})`, transformOrigin: 'left'}} />
          <div style={{position: 'absolute', left: 0, top: 10, height: 4, borderRadius: 2, width: `${progress * 100}%`, background: C.orange}} />
          {STOPS.map((s, i) => {
            const passed = progress >= s.p;
            const ap = tw(f, 326 + i * 4, 344 + i * 4);
            return (
              <div key={s.t} style={{position: 'absolute', left: `${s.p * 100}%`, top: 0, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, opacity: ap}}>
                <div style={{width: 24, height: 24, borderRadius: 12, boxSizing: 'border-box', border: `3px solid ${passed ? C.white : 'rgba(255,255,255,0.35)'}`, background: passed ? C.white : C.surface}} />
                <span style={{fontFamily: INTER, fontWeight: 500, fontSize: 24, color: passed ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)'}}>{s.t}</span>
              </div>
            );
          })}
          <div style={{position: 'absolute', left: `${progress * 100}%`, top: 4, width: 16, height: 16, marginLeft: -8, borderRadius: 8, background: C.orange, opacity: progress > 0.01 ? 1 : 0}} />
        </div>
      </div>
    </div>
  );
};

const CoreMorph: React.FC<{f: number}> = ({f}) => {
  const appear = tw(f, 154, 186, 0, 1, E.out);
  const mu = tw(f, 266, 304, 0, 1, E.inOut);
  const w = lerp(CORE.r * 2, BAL.w, mu);
  const h = lerp(CORE.r * 2, BAL.h, mu);
  const cy = lerp(CORE.cy, BAL.cy, mu);
  const radius = lerp(CORE.r, 22, mu);
  const interior = 1 - tw(f, 258, 274, 0, 1, E.inOut);
  // Barrido de máscara que revela el contenido de saldos
  const sweep = tw(f, 294, 330, 0, 1, E.inOut);
  // Cierre: la tarjeta colapsa hacia una línea horizontal
  const collapse = tw(f, 376, 394, 0, 1, E.inOut);
  if (f < 140 || f > 395) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: G.cx - w / 2,
        top: cy - h / 2,
        width: w,
        height: h,
        borderRadius: radius,
        background: C.surface,
        border: `2px solid ${C.hair}`,
        boxSizing: 'border-box',
        overflow: 'hidden',
        opacity: appear,
        transform: `scale(${0.82 + 0.18 * appear})`,
        clipPath: `inset(${collapse * 50}% 0 ${collapse * 50}% 0)`,
      }}
    >
      <div style={{position: 'absolute', left: w / 2 - CORE.r, top: h / 2 - CORE.r, width: CORE.r * 2, height: CORE.r * 2, opacity: interior}}>
        {interior > 0 && <CoreInterior f={f} size={CORE.r * 2} />}
      </div>
      {f >= 290 && (
        <>
          <div style={{position: 'absolute', left: (w - BAL.w) / 2, top: (h - BAL.h) / 2, width: BAL.w, height: BAL.h, clipPath: `inset(0 0 ${(1 - sweep) * 100}% 0)`}}>
            <BalanceContent f={f} />
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: (h - BAL.h) / 2 + sweep * BAL.h - 1, height: 3, background: C.orange, opacity: sweep > 0 && sweep < 1 ? 1 : 0}} />
        </>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Bloque de titular (misma posición en escenas 2 y 3)                */
/* ------------------------------------------------------------------ */

const HEAD_Y = 1200;

const Headline: React.FC<{
  f: number;
  eyebrow: string;
  lines: string[];
  at: number;
  out: number;
  pulse?: boolean;
}> = ({f, eyebrow, lines, at, out, pulse}) => {
  if (f < at - 2 || f > out + 24) return null;
  return (
    <div style={{position: 'absolute', left: G.left, top: HEAD_Y, display: 'flex', flexDirection: 'column', gap: 26}}>
      <MaskLine inP={tw(f, at, at + 20)} outP={tw(f, out, out + 14, 0, 1, E.in)}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          {pulse && <div style={{width: 10, height: 10, borderRadius: 5, background: C.orange, opacity: 0.5 + 0.5 * Math.sin(f / 5) ** 2}} />}
          <span style={{...label, fontSize: 24}}>{eyebrow}</span>
        </div>
      </MaskLine>
      <div>
        {lines.map((t, i) => (
          <MaskLine key={t} inP={tw(f, at + 6 + i * 6, at + 34 + i * 6)} outP={tw(f, out + i * 3, out + 16 + i * 3, 0, 1, E.in)}>
            <div style={{fontFamily: INTER, fontWeight: 700, fontSize: 100, lineHeight: 1.02, letterSpacing: '-0.035em', color: C.white, whiteSpace: 'nowrap'}}>
              {t}
            </div>
          </MaskLine>
        ))}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Mensaje principal                                                  */
/* ------------------------------------------------------------------ */

const FINAL = {wordTop: 700, lineY: 970, subTop: 1008};
const WORD = 'REVISAR';

const AccentLine: React.FC<{f: number}> = ({f}) => {
  if (f < 384) return null;
  const appear = tw(f, 384, 394, 0, 1, E.inOut);
  const move = tw(f, 392, 408, 0, 1, E.inOut);
  const exit = tw(f, 495, 505, 0, 1, E.in);
  const w = lerp(BAL.w, 96, move) * (1 - exit);
  const x = lerp(G.cx - BAL.w / 2, G.left, move);
  const y = lerp(BAL.cy, FINAL.lineY, move);
  const hgt = lerp(2, 6, move);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y - hgt / 2,
        width: w,
        height: hgt,
        background: appear < 1 ? `rgba(212,104,28,${appear})` : C.orange,
        boxShadow: appear < 1 ? `0 0 0 1px rgba(255,255,255,${0.14 * (1 - appear)})` : 'none',
      }}
    />
  );
};

const FinalMessage: React.FC<{f: number}> = ({f}) => {
  if (f < 398) return null;
  const sub = tw(f, 410, 430, 0, 1, E.inOut);
  const subOut = tw(f, 492, 502, 0, 1, E.in);
  return (
    <>
      <div style={{position: 'absolute', left: G.left - 8, top: FINAL.wordTop, display: 'flex'}}>
        {WORD.split('').map((ch, i) => (
          <MaskLine key={i} inP={tw(f, 400 + i * 2, 418 + i * 2)} outP={tw(f, 494 + i, 502 + i, 0, 1, E.in)}>
            <span style={{fontFamily: INTER, fontWeight: 800, fontSize: 200, lineHeight: 1, letterSpacing: '-0.035em', color: C.white, display: 'inline-block'}}>
              {ch}
            </span>
          </MaskLine>
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          left: G.left,
          top: FINAL.subTop,
          clipPath: `inset(-10% ${(1 - sub) * 100}% -10% ${subOut * 100}%)`,
          transform: `translateX(${(1 - sub) * -24}px)`,
        }}
      >
        <span style={{fontFamily: INTER, fontWeight: 600, fontSize: 60, letterSpacing: '0.04em', color: C.white, whiteSpace: 'nowrap'}}>
          ANTES DE SOLICITAR
        </span>
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Composición                                                        */
/* ------------------------------------------------------------------ */

export const MHorizonRevision: React.FC = () => {
  const f = useCurrentFrame();

  // Cámara 2D: asentamiento inicial, empuje lento en el análisis, respiro en cada transición.
  const scale = interpolate(
    f,
    [0, 120, 250, 300, 378, 400, 509],
    [1.045, 1.0, 1.022, 1.0, 1.016, 1.0, 1.028],
    {...clamp, easing: E.inOut},
  );
  const ty = interpolate(f, [0, 120, 250, 300], [24, 0, -12, 0], {...clamp, easing: E.inOut});

  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: INTER, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, transform: `translateY(${ty}px) scale(${scale})`, transformOrigin: `${G.cx}px 900px`}}>
        <Grid f={f} />
        {f >= 140 && f < 290 && <Connectors f={f} />}
        {f >= 140 && f < 280 && <CoreRing f={f} />}
        <CoreMorph f={f} />
        {f < 290 && CARDS.map((c) => <DocCard key={c.id} spec={c} f={f} />)}
        <Headline f={f} eyebrow="Proceso de análisis" lines={['Revisión', 'tributaria']} at={152} out={256} pulse />
        <Headline f={f} eyebrow="Evaluación de saldos" lines={['¿Se pueden', 'recuperar?']} at={286} out={372} />
        <AccentLine f={f} />
        <FinalMessage f={f} />
      </div>
      <ChapterIndex f={f} />
    </AbsoluteFill>
  );
};
