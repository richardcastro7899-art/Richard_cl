import React from 'react';
import {C, CAROUSEL_PHOTOS, HERO, T, bezier, clamp, eBack, eInOut, eOut, lerp, prog, rng} from './core';
import {Polaroid, fitBox, frameDims} from './common';
import {BRUSH, SERIF, SOFT} from './fonts';
import {Doodle, LoopFrame, Scribble, CONFETTI_COLORS} from './doodles';

// ───────────────────────── geometría del carrusel ─────────────────────────
const DIR_DEG = -30; // avance: esquina inferior izquierda → superior derecha
const DX = Math.cos((DIR_DEG * Math.PI) / 180);
const DY = Math.sin((DIR_DEG * Math.PI) / 180);
const NX = -DY;
const NY = DX;
const PERSP = 1500;
const SPACING = 290;
const D_TOTAL = 3000;
const BELT_START = 7.0;
const BELT_END = 15.7;
const beltEase = bezier(0.22, 0.3, 0.12, 1);

const J0 = -4;
const N_CARDS = 20;
const CORNERS: Array<[number, number]> = [[-560, -420], [2480, -420], [-560, 1500], [2480, 1500]];

type Card = {idx: number; j: number; b: number; z: number; o: number; rot: number; baseH: number; corner: [number, number]; rank: number; tape: number};
const CARDS: Card[] = (() => {
  const others = CAROUSEL_PHOTOS.filter((p) => p !== HERO);
  const out: Card[] = [];
  let oi = 0;
  const zs = [-400, -300, 230, -200, 300, 360, -350, 260];
  for (let k = 0; k < N_CARDS; k++) {
    const j = J0 + k;
    const idx = j === 0 ? HERO : others[oi++];
    const r = rng(100 + idx);
    const side = k % 2 === 0 ? 1 : -1;
    const near = Math.abs(j) <= 3;
    const z = near ? -(220 + r() * 160) : zs[Math.floor(r() * zs.length)];
    out.push({
      idx, j, b: j * SPACING, z, o: j === 0 ? 0 : side * (190 + r() * 150), rot: j === 0 ? 0 : (r() - 0.5) * 14,
      baseH: j === 0 ? 560 : 400, corner: CORNERS[(k + 1) % 4], rank: Math.max(0, j - 4), tape: r() < 0.45 ? Math.floor(r() * 3) : -1,
    });
  }
  return out;
})();

/** Foto elegida: alto de la foto (sin marco) y centro del marco durante el saludo. */
const HERO_FINAL = {cx: 500, cy: 540, h: 790, rot: -3};

export const introGlow = (t: number) => eOut(prog(t, T.nameHit - 0.05, T.nameHit + 1.0)) * (1 - prog(t, 21.2, 22.0));

// ───────────────────────── confeti de papel ─────────────────────────
const CONF = (() => {
  const r = rng(2024);
  return Array.from({length: 120}, (_, i) => {
    const second = i >= 84;
    return {
      ang: (-(18 + r() * 144) * Math.PI) / 180,
      v: (second ? 380 : 520) + r() * (second ? 520 : 880),
      col: CONFETTI_COLORS[Math.floor(r() * CONFETTI_COLORS.length)],
      kind: r() < 0.55 ? 0 : r() < 0.8 ? 1 : 2,
      s: 8 + r() * 11, w0: r() * 360, w: (r() - 0.5) * 900, f0: r() * 6.28, f: 5 + r() * 8, life: 2.2 + r() * 1.3,
      delay: second ? 0.28 + r() * 0.12 : r() * 0.06, ox: second ? 1650 : 1360, oy: second ? 830 : 800,
    };
  });
})();

const Confetti: React.FC<{tau: number}> = ({tau}) => {
  if (tau < 0 || tau > 4) return null;
  return (
    <>
      {CONF.map((p, i) => {
        const t = tau - p.delay;
        if (t < 0 || t > p.life) return null;
        const k = 2.4;
        const e = (1 - Math.exp(-k * t)) / k;
        const x = p.ox + Math.cos(p.ang) * p.v * e;
        const y = p.oy + Math.sin(p.ang) * p.v * e + 0.5 * 760 * t * t;
        const fade = 1 - prog(t, p.life - 0.7, p.life);
        const flip = Math.cos(p.f0 + p.f * t);
        const style: React.CSSProperties = {position: 'absolute', left: x, top: y, opacity: fade * 0.92, transform: `rotate(${p.w0 + p.w * t}deg) scaleY(${flip})`, background: p.col};
        if (p.kind === 0) return <div key={i} style={{...style, width: p.s, height: p.s * 1.8, borderRadius: 2}} />;
        if (p.kind === 1) return <div key={i} style={{...style, width: p.s * 0.9, height: p.s * 0.9, borderRadius: '50%'}} />;
        return <div key={i} style={{...style, width: p.s * 0.35, height: p.s * 2.6, borderRadius: 2}} />;
      })}
    </>
  );
};

// ───────────────────────── saludo ─────────────────────────
const GREET = 'Feliz cumpleaños';
const NAME = ['¡', 'M', 'I', 'L', 'T', 'O', 'N', '!'];

const Greeting: React.FC<{t: number; exitP: number}> = ({t, exitP}) => {
  const X0 = 940;
  const tg = t - T.greetStart;
  const caretOn = tg > -0.05 && tg < 1.9;
  const nChars = clamp(tg / 0.07, 0, GREET.length);
  const tn = t - T.nameHit;
  const lineP = eOut(prog(t, T.nameHit + 0.55, T.nameHit + 1.4));
  const shine = prog(t, T.nameHit + 0.7, T.nameHit + 1.5);
  const ex = eInOut(exitP);
  return (
    <div style={{position: 'absolute', left: X0, top: 0, width: 1920 - X0 - 60, height: 1080, opacity: 1 - ex, transform: `translateY(${-ex * 50}px)`}}>
      <div style={{position: 'absolute', left: 4, top: 318, fontFamily: SERIF, fontVariationSettings: SOFT, fontStyle: 'italic', fontWeight: 500, fontSize: 96, color: C.inkSoft, whiteSpace: 'pre', lineHeight: 1.1}}>
        {GREET.split('').map((ch, i) => {
          const p = clamp(nChars - i);
          return (
            <span key={i} style={{display: 'inline-block', opacity: p, transform: `translateY(${(1 - eOut(p)) * 18}px)`, filter: p < 1 ? `blur(${(1 - p) * 3}px)` : undefined}}>
              {ch}
            </span>
          );
        })}
        {caretOn && <span style={{display: 'inline-block', width: 5, height: 76, marginLeft: 8, background: C.terracotta, verticalAlign: '-8px', opacity: Math.floor(tg * 3.2) % 2 === 0 || tg > 1.2 ? 0.9 : 0.15, borderRadius: 2}} />}
      </div>

      {/* ¡MILTON! — letra de pincel, mayor jerarquía */}
      <div style={{position: 'absolute', left: -8, top: 392, fontFamily: BRUSH, fontSize: 262, lineHeight: 1, letterSpacing: '0.01em', whiteSpace: 'nowrap', display: 'flex'}}>
        {NAME.map((ch, i) => {
          const p = clamp((tn - i * 0.06) / 0.6);
          const accent = i === 0 || i === NAME.length - 1;
          const sh = clamp(1 - Math.abs(shine * 1.5 - 0.25 - i * 0.12) / 0.3);
          return (
            <span
              key={i}
              style={{
                display: 'inline-block', opacity: clamp(p * 4), transform: `translateY(${(1 - eBack(p)) * 80}px) rotate(${(1 - eBack(p)) * (i % 2 ? 6 : -6)}deg) scale(${lerp(1.3, 1, eBack(p))})`,
                color: accent ? C.terracotta : C.ink, filter: p < 1 ? `blur(${(1 - p) * 5}px)` : undefined,
                textShadow: sh > 0 ? `0 0 ${sh * 30}px rgba(255,236,206,${sh})` : 'none',
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>

      {/* subrayado de pincel */}
      <div style={{position: 'absolute', left: 6, top: 672}}>
        <Scribble p={lineP} w={780} h={34} color={C.terracotta} kind="swoosh" sw={9} />
      </div>
    </div>
  );
};

// ───────────────────────── escena ─────────────────────────
export const Intro: React.FC<{t: number}> = ({t}) => {
  if (t < BELT_START - 0.1 || t > 22.4) return null;
  const sel = eInOut(prog(t, 14.3, 16.1));
  const P = D_TOTAL * (1 - beltEase(prog(t, BELT_START, BELT_END)));
  const camFade = 1 - sel;
  const camY = 6 * Math.sin(t * 0.55) * camFade;
  const camX = 3 * Math.cos(t * 0.7) * camFade;
  const camZ = (-3 + 2.6 * prog(t, 7, 15)) * camFade;
  const camS = 1 + 0.07 * (1 - prog(t, 7, 15)) * camFade;
  const dim = eInOut(prog(t, 12.4, 14.4));
  const heroGlow = eOut(prog(t, 12.6, 14.3));
  const othersOut = eOut(prog(t, 14.45, 15.6));
  const introOut = eInOut(prog(t, 21.15, 21.95));
  const exitHero = eInOut(prog(t, 21.2, 21.95));

  const heroPhoto = fitBox(HERO, HERO_FINAL.h);

  const cards = CARDS.map((c) => {
    const e = eOut(prog(t, BELT_START + 0.05 + c.rank * 0.07, BELT_START + 1.5 + c.rank * 0.07));
    const along = c.b - P;
    const bx = along * DX + c.o * NX;
    const by = along * DY + c.o * NY;
    return {c, e, x: lerp(c.corner[0] - 960, bx, e), y: lerp(c.corner[1] - 540, by, e)};
  });

  const heroCard = cards.find((k) => k.c.j === 0)!;
  const heroSX = lerp(960 + heroCard.x, HERO_FINAL.cx, sel);
  const heroSY = lerp(540 + heroCard.y, HERO_FINAL.cy, sel);
  const heroScale = lerp(heroCard.c.baseH / HERO_FINAL.h, 1, sel);
  const heroZ = 260 * Math.sin(Math.PI * sel);
  const heroRot = lerp(0, HERO_FINAL.rot, sel);

  const hw = heroPhoto.w * heroScale;
  const hh = heroPhoto.h * heroScale;
  const hf = frameDims(hw, hh);

  return (
    <div style={{position: 'absolute', inset: 0, opacity: 1 - introOut}}>
      <div style={{position: 'absolute', inset: 0, perspective: PERSP, perspectiveOrigin: '50% 50%'}}>
        <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateX(${camX}deg) rotateY(${camY}deg) rotateZ(${camZ}deg) scale(${camS})`}}>
          {cards.map(({c, e, x, y}) => {
            if (c.j === 0) return null;
            const sc = PERSP / (PERSP - c.z);
            const ph = fitBox(c.idx, c.baseH);
            const fr = frameDims(ph.w, ph.h);
            const px = x + (x > 0 ? 1 : -1) * 420 * othersOut;
            const py = y + (y > 0 ? 1 : -1) * 260 * othersOut;
            const op = clamp(e * 5) * (1 - othersOut) * (1 - dim * 0.4);
            if (op <= 0.01) return null;
            const farDark = lerp(0.78, 1, (c.z + 420) / 820);
            const blur = Math.abs(c.z) / 120 + othersOut * 6;
            const screenX = 960 + x * sc;
            const screenY = 540 + y * sc;
            const m = Math.max(fr.W, fr.H) * sc;
            if (screenX < -m || screenX > 1920 + m || screenY < -m || screenY > 1080 + m) return null;
            return (
              <div
                key={c.idx}
                style={{
                  position: 'absolute', left: 960 + px - fr.W / 2, top: 540 + py - fr.H / 2, width: fr.W, height: fr.H,
                  transform: `translateZ(${c.z}px) rotateZ(${c.rot}deg)`, opacity: op,
                  filter: `blur(${blur.toFixed(2)}px) brightness(${(farDark * (1 - dim * 0.1)).toFixed(3)})`,
                }}
              >
                <Polaroid idx={c.idx} w={ph.w} h={ph.h} tape={c.tape} shadow={0.7 + 0.3 * sc} />
              </div>
            );
          })}

          {/* foto elegida */}
          <div
            style={{
              position: 'absolute', left: heroSX - hf.W / 2, top: heroSY - hf.H / 2, width: hf.W, height: hf.H,
              opacity: clamp(heroCard.e * 5) * (1 - exitHero), filter: `brightness(${1 + heroGlow * 0.04})`,
              transform: `translateZ(${heroZ}px) translateX(${-exitHero * 1300}px) rotateZ(${heroRot - exitHero * 14}deg)`,
            }}
          >
            <Polaroid idx={HERO} w={hw} h={hh} tape={sel > 0.75 ? 0 : -1} tapeIn={eOut(prog(t, 15.7, 16.3))} lift={Math.sin(Math.PI * sel) * 0.6} />
          </div>
        </div>
      </div>

      {/* marco dibujado a mano alrededor de la foto elegida */}
      {(() => {
        const p = eOut(prog(t, 13.2, 14.1));
        const o = (1 - eInOut(prog(t, 15.9, 16.6))) * (1 - exitHero);
        if (p <= 0 || o <= 0) return null;
        const pad = 34 * (1 - sel * 0.3);
        return (
          <div style={{position: 'absolute', left: heroSX - hf.W / 2 - pad, top: heroSY - hf.H / 2 - pad, transform: `rotate(${heroRot}deg)`}}>
            <LoopFrame p={p} w={hf.W + pad * 2} h={hf.H + pad * 2} color={C.terracotta} opacity={o} />
          </div>
        );
      })()}

      {/* confeti (detrás del texto para no restar legibilidad) */}
      <div style={{position: 'absolute', inset: 0, opacity: 1 - introOut}}>
        <Confetti tau={t - T.nameHit} />
      </div>

      {/* garabatos que se dibujan al llegar el nombre */}
      {t > T.nameHit && (
        <div style={{position: 'absolute', inset: 0, opacity: 1 - exitHero}}>
          <div style={{position: 'absolute', left: 1560, top: 22}}>
            <Doodle kind="balloons" p={eOut(prog(t, T.nameHit + 0.5, T.nameHit + 2.0))} scale={0.72} color={C.ink} fills={[C.terracotta, C.mustard, C.sage]} rot={6} />
          </div>
          <div style={{position: 'absolute', left: 1640, top: 790}}>
            <Doodle kind="gift" p={eOut(prog(t, T.nameHit + 1.0, T.nameHit + 2.4))} scale={1.1} color={C.ink} fills={[C.dusty, C.terracotta]} rot={-5} />
          </div>
        </div>
      )}

      {t >= T.greetStart - 0.2 && <Greeting t={t} exitP={exitHero} />}
    </div>
  );
};
