import React from 'react';
import {INTER, SERIF} from './fonts';
import {C} from './theme';
import {clamp, E, rnd} from './anim';

export type TxtProps = {
  x: number; y: number; text: string; size: number; weight?: number; color?: string; track?: number;
  align?: 'left' | 'center' | 'right'; p?: number; out?: number; stagger?: number; dir?: 'up' | 'down' | 'left' | 'right';
  outDir?: 'up' | 'down' | 'left' | 'right'; o?: number; z?: number; italic?: boolean; split?: Array<{from: number; to: number; color: string}>;
  style?: React.CSSProperties; scale?: number; rot?: number; serif?: boolean;
};

const off = (dir: string, v: number) => {
  switch (dir) {
    case 'up': return `translateY(${v * 112}%)`;
    case 'down': return `translateY(${-v * 112}%)`;
    case 'left': return `translateX(${v * 112}%)`;
    default: return `translateX(${-v * 112}%)`;
  }
};

/** Línea tipográfica con revelación enmascarada (entrada) y salida direccional. Caja de línea = size px. */
export const Txt: React.FC<TxtProps> = ({
  x, y, text, size, weight = 800, color = C.white, track = -0.02, align = 'left', p = 1, out = 0, stagger = 0,
  dir = 'up', outDir = 'up', o = 1, z = 0, split, style, scale = 1, rot = 0, serif = false,
}) => {
  const blur = Math.max(0, (1 - E.outQuint(clamp(p * 1.5))) * 14, clamp(out) * 12);
  if (p <= 0 && out <= 0) return null;
  if (out >= 1) return null;
  const chars = Array.from(text);
  const n = chars.length;
  const tx = align === 'center' ? '-50%' : align === 'right' ? '-100%' : '0';
  const colorAt = (i: number) => split?.find((s) => i >= s.from && i < s.to)?.color ?? color;
  const outV = E.inC(clamp(out));
  const body =
    stagger > 0 ? (
      chars.map((ch, i) => {
        const pc = E.outExpo(clamp((p - (i / Math.max(1, n - 1)) * stagger) / (1 - stagger)));
        return (
          <span key={i} style={{display: 'inline-block', transform: off(dir, 1 - pc), color: colorAt(i), whiteSpace: 'pre'}}>
            {ch === ' ' ? ' ' : ch}
          </span>
        );
      })
    ) : split ? (
      chars.map((ch, i) => (
        <span key={i} style={{color: colorAt(i), whiteSpace: 'pre'}}>{ch}</span>
      ))
    ) : (
      text
    );
  return (
    <div
      style={{
        position: 'absolute', left: x, top: y, transform: `translateX(${tx}) translateZ(${z}px) rotate(${rot}deg) scale(${scale})`,
        transformOrigin: align === 'center' ? '50% 50%' : align === 'right' ? '100% 50%' : '0% 50%', opacity: o,
        overflow: 'hidden', padding: '0.22em 0.06em 0.18em', margin: '-0.22em -0.06em -0.18em', whiteSpace: 'pre', ...style,
      }}
    >
      <div
        style={{
          fontFamily: serif ? SERIF : INTER, fontStyle: serif ? 'italic' : 'normal', fontWeight: serif ? 400 : weight, fontSize: size, lineHeight: 1, color, letterSpacing: `${serif ? 0 : track}em`,
          filter: blur > 0.4 ? `blur(${blur.toFixed(1)}px)` : undefined,
          transform: stagger > 0 ? `${off(outDir, -outV)}` : `${off(dir, 1 - E.outExpo(clamp(p)))} ${off(outDir, -outV)}`,
          fontFeatureSettings: '"ss01","cv11"',
        }}
      >
        {body}
      </div>
    </div>
  );
};

/** Texto con resolución tipo "decodificación" (para etiquetas pequeñas). */
export const scramble = (text: string, p: number, seed = 1) => {
  const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const chars = Array.from(text);
  const resolved = Math.floor(clamp(p) * chars.length);
  return chars.map((c, i) => (i < resolved || c === ' ' ? c : pool[Math.floor(rnd(seed + i * 7.3 + Math.floor(p * 18)) * pool.length)])).join('');
};

/** Etiqueta pequeña tipo UI (mayúsculas con tracking). */
export const Label: React.FC<{x: number; y: number; text: string; size?: number; color?: string; p?: number; align?: 'left' | 'center' | 'right'; weight?: number; out?: number; track?: number; z?: number}> = ({
  x, y, text, size = 26, color = C.grey, p = 1, align = 'left', weight = 600, out = 0, track = 0.18, z = 0,
}) => <Txt x={x} y={y} text={text} size={size} color={color} weight={weight} track={track} p={p} align={align} out={out} z={z} />;

/** Frase de apoyo en serif cursiva (estilo editorial), para acompañar palabras clave en negrita. */
export const Lead: React.FC<Omit<TxtProps, 'serif' | 'weight' | 'track'>> = (props) => <Txt {...props} serif color={props.color ?? C.soft} />;
