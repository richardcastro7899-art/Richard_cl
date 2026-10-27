import React, {createContext, useContext} from 'react';
import {AbsoluteFill, Sequence, staticFile, useCurrentFrame} from 'remotion';
import energyData from './energy.json';
import {C, DURATION, easeIn, EXIT, FONT, H, prog, SAFE, START, W} from './theme';

/* ───────── tiempo global ───────── */
const SceneCtx = createContext({start: 0, end: DURATION});
export const useScene = () => useContext(SceneCtx);
export const useG = () => useCurrentFrame() + useContext(SceneCtx).start;
// progreso de salida: primero el texto, 2 fotogramas después el gráfico
export const useExit = () => {
  const g = useG();
  const {end} = useScene();
  if (end >= DURATION) return {text: 0, art: 0};
  const s = end - EXIT;
  return {text: prog(g, s, 5, easeIn), art: prog(g, s + 2, 5, easeIn)};
};
export const useEnergy = () => {
  const g = useG();
  return (energyData as number[])[Math.min(g, energyData.length - 1)];
};

/* ───────── revelado con blur ───────── */
export const Reveal: React.FC<{
  at: number;
  ord?: number;
  dur?: number;
  y?: number;
  blur?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({at, ord = 0, dur = 14, y = 34, blur = 18, style, children}) => {
  const g = useG();
  const {start} = useScene();
  // nada aparece antes de que la escena anterior haya salido
  const p = prog(g, Math.max(at, start + 4 + ord * 3), dur);
  const o = Math.min(1, p * 2.4);
  return (
    <div
      style={{
        opacity: o,
        transform: `translateY(${(1 - p) * y}px) scale(${0.96 + p * 0.04})`,
        filter: `blur(${(1 - p) * blur}px)`,
        willChange: 'transform, filter, opacity',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// el texto aparece un instante antes de la voz: más tiempo de lectura
const LEAD = 0.12;

export type Wd = {
  w: string;
  t: number; // segundos (tiempo global del audio)
  size?: number;
  weight?: number;
  color?: string;
};

export const Line: React.FC<{
  words: Wd[];
  size: number;
  weight?: number;
  color?: string;
  gap?: number;
  ls?: string;
}> = ({words, size, weight = 500, color = C.ink, gap = 0.28, ls = '-0.02em'}) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'baseline',
      lineHeight: 1,
      fontFamily: FONT,
      gap: `${gap}em`,
      fontSize: size,
    }}
  >
    {words.map((w, i) => (
      <Reveal key={i} at={Math.round((w.t - LEAD) * 30)} ord={i}>
        <span
          style={{
            fontSize: w.size ?? size,
            fontWeight: w.weight ?? weight,
            color: w.color ?? color,
            letterSpacing: ls,
            display: 'inline-block',
            lineHeight: 1,
          }}
        >
          {w.w}
        </span>
      </Reveal>
    ))}
  </div>
);

export const Stack: React.FC<{top: number; gap?: number; children: React.ReactNode}> = ({top, gap = 14, children}) => {
  const q = useExit().text;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        width: W,
        top,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap,
        opacity: 1 - q,
        filter: q > 0 ? `blur(${q * 14}px)` : undefined,
        transform: q > 0 ? `translateY(${-q * 28}px)` : undefined,
      }}
    >
      {children}
    </div>
  );
};

/* texto que se sustituye por otro (cambio de cifra) */
export const Swap: React.FC<{at: number; a: React.ReactNode; b: React.ReactNode}> = ({at, a, b}) => {
  const g = useG();
  const p = prog(g, at, 12);
  return (
    <div style={{position: 'relative'}}>
      <div
        style={{
          opacity: 1 - Math.min(1, p * 2.2),
          filter: `blur(${p * 22}px)`,
          transform: `translateY(${-p * 40}px)`,
        }}
      >
        {a}
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          justifyContent: 'center',
          opacity: Math.min(1, p * 2.2),
          filter: `blur(${(1 - p) * 22}px)`,
          transform: `translateY(${(1 - p) * 40}px)`,
        }}
      >
        {b}
      </div>
    </div>
  );
};

/* ───────── escena: secuencial, sin solaparse con la siguiente ───────── */
export const Scene: React.FC<{start: number; end: number; children: React.ReactNode}> = ({start, end, children}) => (
  <Sequence from={start} durationInFrames={end - start} layout="none">
    <SceneCtx.Provider value={{start, end}}>{children}</SceneCtx.Provider>
  </Sequence>
);

/* gráfico de la escena: entra primero, sale después del texto */
export const Art: React.FC<{noEnter?: boolean; children: React.ReactNode}> = ({noEnter, children}) => {
  const g = useG();
  const {start} = useScene();
  const q = useExit().art;
  const p = noEnter ? 1 : prog(g, start, 11);
  const blur = (1 - p) * 20 + q * 18;
  return (
    <svg
      width={W}
      height={H}
      style={{
        position: 'absolute',
        inset: 0,
        opacity: Math.min(1, p * 2.5) * (1 - q),
        filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
        transform: `scale(${1 + (1 - p) * 0.04 - q * 0.03})`,
        transformOrigin: '50% 55%',
      }}
    >
      {children}
    </svg>
  );
};

/* ───────── fondo y marco ───────── */
export const Frame: React.FC = () => {
  const f = useCurrentFrame();
  const dash = {stroke: 'rgba(0,0,0,.13)', strokeWidth: 2, strokeDasharray: '6 9'} as const;
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 85% 70% at 50% 46%, ${C.paperHi} 0%, ${C.paper} 52%, #cfccc3 100%)`,
        }}
      />
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        {[SAFE.top, SAFE.bottom].map((y) => (
          <line key={y} x1={SAFE.x0 - 40} x2={SAFE.x1 + 40} y1={y} y2={y} {...dash} />
        ))}
        {[SAFE.x0 - 40, SAFE.x1 + 40].map((x) => (
          <line key={x} x1={x} x2={x} y1={SAFE.top} y2={SAFE.bottom} {...dash} />
        ))}
        {/* marcas de esquina corporativas */}
        <g fill="none" stroke={C.navy} strokeWidth={4} strokeLinecap="square">
          <path d="M64 132 V64 H132" />
          <path d={`M${W - 64} ${H - 132} V${H - 64} H${W - 132}`} />
        </g>
        <rect x={52} y={52} width={16} height={16} fill={C.orange} />
        <rect x={W - 68} y={H - 68} width={16} height={16} fill={C.orange} />
      </svg>
    </AbsoluteFill>
  );
};

export const Overlay: React.FC = () => {
  const f = useCurrentFrame();
  const grain = (Math.floor(f / 2) % 3) + 1;
  const gx = ((f * 37) % 90) - 45;
  const gy = ((f * 53) % 90) - 45;
  // iris de apertura (negro → papel); el video termina sin fundido
  const open = prog(f, 0, 13);
  const R = open * 1500;
  const bw = SAFE.x1 - SAFE.x0;
  return (
    <>
      <div style={{position: 'absolute', left: SAFE.x0, top: 1852, width: bw, height: 4, background: 'rgba(23,30,39,.12)'}}>
        <div style={{width: (f / (DURATION - 1)) * bw, height: 4, background: C.orange}} />
      </div>
      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile(`grain${grain}.png`)})`,
          backgroundSize: 'cover',
          transform: `translate(${gx}px,${gy}px) scale(1.2)`,
          mixBlendMode: 'multiply',
          opacity: 0.2,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 100% 78% at 50% 48%, rgba(0,0,0,0) 48%, rgba(20,18,14,.24) 100%)`,
        }}
      />
      {f < 16 && (
        <AbsoluteFill
          style={{background: `radial-gradient(circle at 50% 46%, transparent ${R}px, #0c0c0b ${R + 3}px)`}}
        />
      )}
    </>
  );
};

/* etiqueta superior (sustituye al logotipo de la referencia) */
const TAGS = [
  {label: 'Microempresa', from: 0, to: START.pequena},
  {label: 'Pequeña empresa', from: START.pequena, to: START.barco},
  {label: 'Exportador habitual', from: START.barco, to: DURATION},
];

export const TopTag: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      {TAGS.map((t) => {
        const p = prog(f, t.from + (t.from === 0 ? 8 : 3), 10);
        const q = t.to >= DURATION ? 0 : prog(f, t.to - EXIT, 5, easeIn);
        const o = Math.min(1, p * 2) * (1 - q);
        if (o <= 0.001) return null;
        return (
          <div
            key={t.label}
            style={{
              position: 'absolute',
              top: SAFE.top + 6,
              left: 0,
              width: W,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 22,
              opacity: o,
              filter: `blur(${(1 - p) * 10 + q * 10}px)`,
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 24,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: C.ink,
            }}
          >
            <span style={{width: 40, height: 3, background: C.orange}} />
            {t.label}
            <span style={{width: 40, height: 3, background: C.orange}} />
          </div>
        );
      })}
    </>
  );
};
