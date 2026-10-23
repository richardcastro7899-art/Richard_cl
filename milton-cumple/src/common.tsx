import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {BG_EVENTS, BgKind, C, FPS, HEIGHT, WIDTH, clamp, eInOut, prog, ringRadius, rng} from './core';
import {PHOTO_SIZE} from './photoMeta';

export const pad2 = (n: number) => String(n).padStart(2, '0');
export const photoSrc = (i: number) => staticFile(`fotos/p${pad2(i)}.jpg`);
export const aspect = (i: number) => PHOTO_SIZE[i][0] / PHOTO_SIZE[i][1];

/** Tiempo global en segundos (las escenas no usan <Sequence>, así que el frame es absoluto). */
export const useT = () => useCurrentFrame() / FPS;

/** Tamaño de la foto dado alto o ancho, limitando el sobre-escalado de las fuentes pequeñas. */
export function fitBox(idx: number, h?: number, w?: number) {
  const a = aspect(idx);
  let bh = h ?? (w as number) / a;
  bh = Math.min(bh, PHOTO_SIZE[idx][1] * 1.45);
  return {w: bh * a, h: bh};
}

// ───────────────────────── polaroid ─────────────────────────
export const frameDims = (w: number, h: number) => {
  const m = clamp(w * 0.05, 14, 30);
  const b = clamp(w * 0.17, 54, 112);
  return {m, b, W: w + 2 * m, H: h + m + b};
};

/** Cinta adhesiva semitransparente con bordes irregulares. */
export const Tape: React.FC<{w?: number; rot?: number; style?: React.CSSProperties; tone?: number}> = ({w = 132, rot = -5, style, tone = 0}) => {
  const tones = ['rgba(224,206,158,0.78)', 'rgba(196,208,186,0.78)', 'rgba(224,182,160,0.74)'];
  return (
    <div
      style={{
        position: 'absolute', width: w, height: 40, transform: `rotate(${rot}deg)`, background: tones[tone % 3],
        clipPath: 'polygon(0 8%, 3% 0, 6% 10%, 9% 0, 12% 8%, 100% 0, 97% 12%, 100% 25%, 97% 40%, 100% 55%, 97% 70%, 100% 85%, 97% 100%, 12% 92%, 9% 100%, 6% 90%, 3% 100%, 0 92%)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)', opacity: 0.95, ...style,
      }}
    />
  );
};

export const Polaroid: React.FC<{idx: number; w: number; h: number; kb?: number; tape?: number; lift?: number; shadow?: number; dim?: number; tapeIn?: number}> = ({idx, w, h, kb = 1, tape = -1, lift = 0, shadow = 1, dim = 0, tapeIn = 1}) => {
  const f = frameDims(w, h);
  return (
    <div
      style={{
        position: 'absolute', left: 0, top: 0, width: f.W, height: f.H, borderRadius: 4,
        background: 'linear-gradient(172deg, #FFFEFA 0%, #F8F4EA 100%)',
        boxShadow: `0 ${20 + lift * 44}px ${42 + lift * 60}px rgba(40,30,20,${(0.3 - lift * 0.08) * shadow}), 0 4px 10px rgba(40,30,20,${0.22 * shadow}), inset 0 0 0 1px rgba(0,0,0,0.05)`,
        filter: dim > 0 ? `brightness(${1 - dim * 0.28})` : undefined,
      }}
    >
      <div style={{position: 'absolute', left: f.m, top: f.m, width: w, height: h, overflow: 'hidden', background: '#111'}}>
        <Img src={photoSrc(idx)} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: `scale(${kb})`, transformOrigin: '50% 38%'}} />
        <div style={{position: 'absolute', inset: 0, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.14), inset 0 3px 10px rgba(0,0,0,0.16)'}} />
      </div>
      {tape >= 0 && <Tape tone={tape} rot={tape % 2 === 0 ? -6 : 5} style={{left: f.W / 2 - 66, top: -22, opacity: tapeIn}} />}
    </div>
  );
};

// ───────────────────────── escenario: papel / pizarra ─────────────────────────
const DUST = (() => {
  const r = rng(41);
  return Array.from({length: 64}, () => ({x: r() * WIDTH, y: r() * HEIGHT, s: 1.6 + r() * r() * 5.5, sp: 5 + r() * 16, sw: 8 + r() * 26, ph: r() * 6.28, a: 0.1 + r() * 0.3}));
})();
const SOFTMOTES = (() => {
  const r = rng(77);
  return Array.from({length: 12}, () => ({x: r() * WIDTH, y: r() * HEIGHT, s: 40 + r() * 90, sp: 4 + r() * 8, ph: r() * 6.28, a: 0.035 + r() * 0.05}));
})();

const BgLayer: React.FC<{kind: BgKind; t: number}> = ({kind, t}) => {
  const dark = kind === 'chalk';
  const dustCol = dark ? '244,238,226' : '110,84,56';
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: dark ? '#25282C' : C.paper}}>
      <Img src={staticFile(dark ? 'tex/chalk.jpg' : 'tex/paper.jpg')} style={{position: 'absolute', left: -64, top: -36, width: WIDTH + 128, height: HEIGHT + 72, objectFit: 'cover', transform: `translate(${Math.sin(t * 0.1) * 14}px, ${t * -1.2 % 20}px) scale(${1.02 + 0.01 * Math.sin(t * 0.2)})`}} />
      {/* luz cálida suave */}
      <div style={{position: 'absolute', inset: 0, background: dark ? 'radial-gradient(ellipse 70% 80% at 30% 20%, rgba(232,148,106,0.10) 0%, rgba(232,148,106,0) 70%)' : 'radial-gradient(ellipse 75% 85% at 22% 15%, rgba(255,246,226,0.75) 0%, rgba(255,246,226,0) 70%)'}} />
      {SOFTMOTES.map((b, i) => {
        const x = (b.x + b.sp * t + WIDTH * 2) % WIDTH;
        const y = (b.y - b.sp * 0.5 * t + HEIGHT * 4) % HEIGHT;
        const tw = 0.7 + 0.3 * Math.sin(t * 0.6 + b.ph);
        return <div key={i} style={{position: 'absolute', left: x - b.s, top: y - b.s, width: b.s * 2, height: b.s * 2, borderRadius: '50%', background: `radial-gradient(circle, rgba(${dark ? '240,200,160' : '255,250,235'},${b.a * tw * (dark ? 1 : 3)}) 0%, rgba(255,255,255,0) 70%)`}} />;
      })}
      {DUST.map((d, i) => {
        const x = (d.x + Math.sin(t * 0.5 + d.ph) * d.sw + WIDTH * 2) % WIDTH;
        const y = (d.y - d.sp * t + HEIGHT * 8) % HEIGHT;
        const tw = 0.55 + 0.45 * Math.sin(t * 1.3 + d.ph);
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: d.s, height: d.s, borderRadius: '50%', background: `rgba(${dustCol},${d.a * tw})`}} />;
      })}
      <div style={{position: 'absolute', inset: 0, background: dark ? 'radial-gradient(ellipse 100% 100% at 50% 50%, rgba(0,0,0,0) 55%, rgba(8,9,11,0.5) 100%)' : 'radial-gradient(ellipse 100% 100% at 50% 50%, rgba(80,60,30,0) 60%, rgba(80,60,30,0.22) 100%)'}} />
    </div>
  );
};

/** Fondo que alterna papel y pizarra mediante un círculo que se expande (firma de transición del video). */
export const Stage: React.FC<{t: number}> = ({t}) => {
  let cur: BgKind = 'chalk';
  let reveal: {kind: BgKind; r: number} | null = null;
  for (const ev of BG_EVENTS) {
    if (t < ev.t) break;
    if (t < ev.t + ev.dur) {
      const r = ev.ring ? ringRadius(t) : eInOut(prog(t, ev.t, ev.t + ev.dur)) * 1500;
      reveal = {kind: ev.kind, r};
      break;
    }
    cur = ev.kind;
  }
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <BgLayer kind={cur} t={t} />
      {reveal && (
        <div style={{position: 'absolute', inset: 0, clipPath: `circle(${reveal.r}px at 50% 50%)`}}>
          <BgLayer kind={reveal.kind} t={t} />
        </div>
      )}
    </div>
  );
};

/** ¿Qué fondo se ve en el centro en el instante t? (para elegir color de tinta) */
export const bgAt = (t: number): BgKind => {
  let cur: BgKind = 'chalk';
  for (const ev of BG_EVENTS) {
    if (t < ev.t + ev.dur * 0.45) break;
    cur = ev.kind;
  }
  return cur;
};
