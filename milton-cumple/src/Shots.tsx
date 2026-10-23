import React from 'react';
import {BgKind, C, Enter, Exit, Item, SHOTS, SHOT_START, Shot, TR, bezier, clamp, eBack, eInOut, eOut, lerp, prog} from './core';
import {Polaroid, fitBox, frameDims} from './common';
import {HAND, SERIF, SOFT} from './fonts';
import {Doodle, DoodleKind, Scribble} from './doodles';

const SHRINK = 0.9; // la foto ocupa algo menos para dejar sitio al marco polaroid
const eAway = bezier(0.3, 0.16, 0.68, 0.62); // la salida arranca ya en movimiento
const eSettle = bezier(0.2, 0.62, 0.3, 1); // la entrada se asienta sin frenar en seco

type Anim = {transform: string; opacity: number; lift: number};

/** Entradas: la foto se «coloca» sobre la mesa y se asienta. */
function enterAnim(kind: Enter, p: number): Anim {
  const q = 1 - p;
  switch (kind) {
    case 'rise': return {transform: `translateY(${q * 900}px) rotate(${-q * 9}deg)`, opacity: clamp(p * 5), lift: q};
    case 'drop': return {transform: `translateY(${-q * 900}px) rotate(${q * 7}deg)`, opacity: clamp(p * 5), lift: q};
    case 'slideL': return {transform: `translateX(${-q * 1400}px) rotate(${-q * 11}deg)`, opacity: clamp(p * 6), lift: q * 0.6};
    case 'slideR': return {transform: `translateX(${q * 1400}px) rotate(${q * 11}deg)`, opacity: clamp(p * 6), lift: q * 0.6};
    case 'rotL': return {transform: `translateX(${-q * 760}px) rotate(${-q * 26}deg) scale(${1 - q * 0.1})`, opacity: clamp(p * 5), lift: q * 0.7};
    case 'rotR': return {transform: `translateX(${q * 760}px) rotate(${q * 26}deg) scale(${1 - q * 0.1})`, opacity: clamp(p * 5), lift: q * 0.7};
    case 'pop': return {transform: `scale(${1 + q * 0.2}) rotate(${q * 4}deg)`, opacity: clamp(p * 4), lift: q * 1.2};
  }
}

/** Salidas: la foto se retira de la mesa. */
function exitAnim(kind: Exit, q: number): Anim {
  const p = 1 - q;
  switch (kind) {
    case 'swipeL': return {transform: `translateX(${-q * 1500}px) rotate(${-q * 14}deg)`, opacity: 1, lift: q * 0.5};
    case 'swipeR': return {transform: `translateX(${q * 1500}px) rotate(${q * 14}deg)`, opacity: 1, lift: q * 0.5};
    case 'swipeUp': return {transform: `translateY(${-q * 1200}px) rotate(${q * 8}deg)`, opacity: 1, lift: q * 0.5};
    case 'swipeDown': return {transform: `translateY(${q * 1200}px) rotate(${-q * 8}deg)`, opacity: 1, lift: q * 0.5};
    case 'lift': return {transform: `scale(${1 + q * 0.16}) rotate(${q * -3}deg)`, opacity: clamp(p * 1.4), lift: q * 1.4};
  }
}

// ───────────────────────── una foto del plano ─────────────────────────
const PhotoItem: React.FC<{it: Item; t: number; s: number; dur: number; multi: boolean}> = ({it, t, s, dur, multi}) => {
  const ph = fitBox(it.idx, it.h ? it.h * SHRINK : undefined, it.w ? it.w * SHRINK : undefined);
  const fr = frameDims(ph.w, ph.h);
  const d = it.delay ?? 0;
  const pIn = prog(t, s - TR + d, s + TR + d + 0.3);
  const qOut = prog(t, s + dur - TR + d * 0.4, s + dur + TR + 0.2 + d * 0.4);
  if (t < s - TR + d - 0.05 || pIn <= 0) return null;
  const a1 = enterAnim(it.enter, it.enter === 'drop' ? eBack(pIn) : eSettle(pIn));
  const a2 = qOut > 0 ? exitAnim(it.exit, eAway(qOut)) : undefined;

  let cx = it.cx;
  let cy = it.cy;
  let rot = it.rot ?? ((it.idx * 37) % 7 - 3) * 0.7;
  let lift = 0;
  let sw = 1;
  if (it.swapTo) {
    const mid = s + dur * 0.5 + d * 0.3;
    const sp = eInOut(prog(t, mid - 0.5, mid + 0.5));
    cx = lerp(it.cx, it.swapTo.cx, sp);
    cy = lerp(it.cy, it.swapTo.cy, sp);
    rot = lerp(rot, it.swapTo.rot ?? rot, sp);
    lift = Math.sin(Math.PI * sp) * (it.cx < it.swapTo.cx ? -80 : 80);
    sw = 1 + 0.04 * Math.sin(Math.PI * sp);
  }
  // Movimiento continuo: la foto nunca queda congelada (deriva + balanceo + respiración)
  const tt = t - (s - TR + d);
  const sgn = it.idx % 2 ? 1 : -1;
  // varias fotos: derivas pequeñas que se alejan del centro (no se solapan); una sola: deriva algo mayor
  const outward = it.cx < 800 ? -1 : it.cx > 1120 ? 1 : 0;
  const vx = it.drift?.[0] ?? (multi ? outward * 9 : sgn * 20);
  const vy = it.drift?.[1] ?? (multi ? ((it.idx % 3) - 1) * 5 : ((it.idx % 3) - 1) * 11);
  const dx = vx * tt;
  const dy = vy * tt;
  rot += Math.sin(tt * 0.95 + it.idx) * 0.9;
  sw *= 1 + 0.012 * Math.sin(tt * 0.7 + it.idx * 1.7);
  const kb = 1 + Math.max(it.zoom ?? 0.03, 0.08) * prog(t, s - TR, s + dur + TR);
  const tape = (it.idx * 7) % 5 < 2 ? it.idx % 3 : -1;

  return (
    <div style={{position: 'absolute', left: cx - fr.W / 2 + dx, top: cy - fr.H / 2 + dy + lift, width: fr.W, height: fr.H, transform: `rotate(${rot}deg) scale(${sw})`, zIndex: it.swapTo && it.cx < it.swapTo.cx ? 2 : 1}}>
      <div style={{position: 'absolute', inset: 0, transform: `${a1.transform} ${a2?.transform ?? ''}`, opacity: a1.opacity * (a2?.opacity ?? 1)}}>
        <Polaroid idx={it.idx} w={ph.w} h={ph.h} kb={kb} tape={tape} lift={Math.max(a1.lift, a2?.lift ?? 0)} />
      </div>
    </div>
  );
};

// ───────────────────────── notas a mano y garabatos ─────────────────────────
const inkFor = (bg: BgKind) => (bg === 'chalk' ? C.chalk : C.ink);
const lineFor = (bg: BgKind) => (bg === 'chalk' ? C.chalkSoft : C.ink);
const FILLS: Record<BgKind, string[]> = {
  paper: [C.terracotta, C.mustard, C.sage],
  chalk: [C.terraLight, C.mustard, C.dusty],
};

const DOODLE_SIZE: Record<DoodleKind, [number, number]> = {balloons: [300, 370], gift: [170, 160], cake: [190, 170]};

const DoodleSlot: React.FC<{kind: DoodleKind; x: number; y: number; scale: number; rot: number; p: number; fade: number; bg: BgKind}> = ({kind, x, y, scale, rot, p, fade, bg}) => {
  const [w, h] = DOODLE_SIZE[kind];
  return (
    <div style={{position: 'absolute', left: x - (w * scale) / 2, top: y - (h * scale) / 2, opacity: fade, transform: `translateY(${(1 - fade) * 20}px)`}}>
      <Doodle kind={kind} p={p} scale={scale} color={lineFor(bg)} fills={FILLS[bg]} rot={rot} wobble={Math.sin(p * 6) * 0.6} />
    </div>
  );
};

const ChapterNote: React.FC<{word: string; t: number; s: number; dur: number; bg: BgKind}> = ({word, t, s, dur, bg}) => {
  const pIn = prog(t, s + 0.1, s + 0.9);
  const qOut = eInOut(prog(t, s + dur - TR, s + dur + TR));
  const o = (1 - qOut) * clamp(pIn * 3);
  const chars = word.split('');
  return (
    <div style={{position: 'absolute', left: 96, bottom: 70, opacity: o, transform: 'rotate(-3deg)', transformOrigin: 'left bottom'}}>
      <div style={{fontFamily: HAND, fontWeight: 700, fontSize: 66, color: inkFor(bg), letterSpacing: '0.02em', whiteSpace: 'pre'}}>
        {chars.map((ch, i) => (
          <span key={i} style={{opacity: clamp(pIn * (chars.length + 2) - i)}}>{ch}</span>
        ))}
      </div>
      <Scribble p={eOut(prog(t, s + 0.6, s + 1.4))} w={Math.max(120, word.length * 30)} h={16} color={bg === 'chalk' ? C.terraLight : C.terracotta} sw={4} />
    </div>
  );
};

// ───────────────────────── frases: escritura letra a letra ─────────────────────────
const PHRASE_DOODLES: Record<string, [DoodleKind, DoodleKind]> = {
  p1: ['cake', 'gift'], p2: ['balloons', 'gift'], p3: ['gift', 'cake'], p4: ['balloons', 'balloons'],
};

const Phrase: React.FC<{shot: Shot; t: number; s: number}> = ({shot, t, s}) => {
  const lines = shot.phrase!.lines;
  const t0 = s - 0.1;
  const qOut = eInOut(prog(t, s + shot.dur - TR - 0.05, s + shot.dur + TR));
  const FS = 106;
  const RATE = 0.036;
  let ci = 0;
  const dd = PHRASE_DOODLES[shot.id] ?? ['gift', 'cake'];
  const fade = 1 - qOut;
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <DoodleSlot kind={dd[0]} x={250} y={850} scale={dd[0] === 'balloons' ? 0.82 : 1.15} rot={-4} p={eOut(prog(t, s + 0.25, s + 2.4))} fade={fade} bg="chalk" />
      <DoodleSlot kind={dd[1]} x={1690} y={850} scale={dd[1] === 'balloons' ? 0.82 : 1.15} rot={4} p={eOut(prog(t, s + 0.5, s + 2.6))} fade={fade} bg="chalk" />
      <div style={{position: 'absolute', inset: 0, top: -40, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `translateY(${-qOut * 30 + Math.sin((t - s) * 1.3) * 5}px) scale(${1 + 0.035 * prog(t, s - 0.2, s + shot.dur + 0.4)})`, opacity: fade, filter: qOut > 0.02 ? `blur(${qOut * 6}px)` : undefined}}>
        {lines.map((ln, li) => (
          <div key={li} style={{display: 'flex', gap: FS * 0.26, height: FS * 1.3, alignItems: 'flex-start'}}>
            {ln.map((wd, wi) => {
              const startCi = ci;
              ci += wd.w.length + 1;
              const endT = t0 + (startCi + wd.w.length) * RATE;
              const ul = wd.em ? eOut(prog(t, endT, endT + 0.55)) : 0;
              return (
                <span key={wi} style={{position: 'relative', display: 'inline-block', whiteSpace: 'pre'}}>
                  {wd.w.split('').map((ch, k) => {
                    const p = clamp((t - (t0 + (startCi + k) * RATE)) / 0.16);
                    return (
                      <span
                        key={k}
                        style={{
                          display: 'inline-block', opacity: p, transform: `translateY(${(1 - p) * 14}px)`,
                          fontFamily: SERIF, fontVariationSettings: SOFT, fontSize: FS, lineHeight: 1.2,
                          fontWeight: wd.em ? 650 : 400, fontStyle: wd.em ? 'italic' : 'normal', color: wd.em ? C.terraLight : C.chalk,
                        }}
                      >
                        {ch}
                      </span>
                    );
                  })}
                  {wd.em && ul > 0.001 && (
                    <div style={{position: 'absolute', left: 0, right: 0, bottom: -4, height: 22, clipPath: `inset(0 ${(1 - ul) * 100}% 0 0)`}}>
                      <svg width="100%" height="22" viewBox="0 0 200 22" preserveAspectRatio="none" style={{overflow: 'visible'}}>
                        <path d="M3 13 C28 3 52 21 80 11 S140 5 197 12" fill="none" stroke={C.terraLight} strokeWidth={5} vectorEffect="non-scaling-stroke" strokeLinecap="round" />
                      </svg>
                    </div>
                  )}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

// ───────────────────────── un plano ─────────────────────────
const ShotView: React.FC<{shot: Shot; t: number; s: number; z: number}> = ({shot, t, s, z}) => {
  const bg = shot.bg ?? 'paper';
  const qOut = eInOut(prog(t, s + shot.dur - TR, s + shot.dur + TR));
  const side = shot.doodleSide;
  const items = shot.items ?? [];
  return (
    <div style={{position: 'absolute', inset: 0, zIndex: z}}>
      {shot.kind === 'photos' && shot.chapter && <ChapterNote word={shot.chapter} t={t} s={s} dur={shot.dur} bg={bg} />}
      {shot.kind === 'photos' && shot.doodle && side && (
        <DoodleSlot
          kind={shot.doodle}
          x={side === 'L' ? 330 : 1590}
          y={shot.doodle === 'balloons' ? 520 : 560}
          scale={shot.doodle === 'balloons' ? 1.15 : 1.5}
          rot={side === 'L' ? -5 : 5}
          p={eOut(prog(t, s + 0.15, s + 1.7))}
          fade={1 - qOut}
          bg={bg}
        />
      )}
      {shot.kind === 'photos' && items.map((it) => <PhotoItem key={it.idx} it={it} t={t} s={s} dur={shot.dur} multi={items.length > 1} />)}
      {shot.kind === 'phrase' && <Phrase shot={shot} t={t} s={s} />}
    </div>
  );
};

export const Shots: React.FC<{t: number}> = ({t}) => (
  <div style={{position: 'absolute', inset: 0}}>
    {SHOTS.map((shot, i) => {
      const s = SHOT_START[i];
      if (t < s - TR - 0.1 || t > s + shot.dur + TR + 0.9) return null;
      return <ShotView key={shot.id} shot={shot} t={t} s={s} z={i + 1} />;
    })}
  </div>
);
