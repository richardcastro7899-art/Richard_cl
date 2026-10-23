import React from 'react';
import {Img, staticFile} from 'remotion';
import {C, CLOSE, bezier, clamp, eBack, eInOut, eOut, lerp, prog, rng} from './core';
import {Polaroid} from './common';
import {BRUSH, SERIF, SOFT} from './fonts';
import {Doodle, Scribble} from './doodles';

const eAway = bezier(0.55, 0, 0.85, 0.6);

// ───────────────────────── mosaico de recuerdos (polaroids sobre la mesa) ─────────────────────────
const COLS = 6;
const PW = 230;
const PH = 300;
const FW = PW + 28; // marco
const FH = PH + 14 + 54;
const GX = 6;
const GY = 8;
const MW = COLS * FW + (COLS - 1) * GX;
const MH = 2 * FH + GY;

const Mosaic: React.FC<{t: number}> = ({t}) => {
  const inP = CLOSE.mosaicIn;
  const out = prog(t, CLOSE.mosaicHold, CLOSE.mosaicOut);
  if (t < inP - 0.1 || out >= 1) return null;
  const idxs = CLOSE.mosaic;
  const r = rng(12);
  const po = eInOut(out);
  const scale = lerp(1.06, 1, eOut(prog(t, inP, inP + 2.4))) * lerp(1, 0.72, po) * (1 + 0.035 * prog(t, inP + 1.2, CLOSE.mosaicHold + 1.0));
  return (
    <div style={{position: 'absolute', inset: 0, opacity: 1 - eInOut(prog(t, CLOSE.mosaicHold + 0.4, CLOSE.mosaicOut))}}>
      <div style={{position: 'absolute', left: 960 - MW / 2, top: 540 - MH / 2, width: MW, height: MH, transform: `scale(${scale}) rotate(${-2 * po}deg)`}}>
        {idxs.map((idx, k) => {
          const col = k % COLS;
          const row = Math.floor(k / COLS);
          const rot0 = (r() - 0.5) * 9;
          const jx = (r() - 0.5) * 14;
          const jy = (r() - 0.5) * 16 + (col % 2 === 0 ? -10 : 10);
          const dist = Math.hypot(col - 2.5, row - 0.5);
          const p = prog(t, inP + dist * 0.11 + r() * 0.06, inP + dist * 0.11 + 0.85);
          if (p <= 0) return null;
          const e = eBack(p);
          const fromX = (col - 2.5) * 260;
          return (
            <div key={idx} style={{position: 'absolute', left: col * (FW + GX) + jx, top: row * (FH + GY) + jy, width: FW, height: FH, transform: `translate(${(1 - e) * fromX}px, ${(1 - e) * -620}px) rotate(${rot0 + (1 - e) * 14 + Math.sin(t * 0.9 + k) * 0.8}deg)`, opacity: clamp(p * 4)}}>
              <Polaroid idx={idx} w={PW} h={PH} lift={1 - e} tape={k % 4 === 1 ? k % 3 : -1} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ───────────────────────── mensaje final (sobre papel) ─────────────────────────
type W = {w: string; em?: boolean};
const MSG: W[][] = [
  [{w: 'Milton,'}, {w: 'que'}, {w: 'este'}, {w: 'nuevo'}, {w: 'año'}, {w: 'de'}, {w: 'vida'}],
  [{w: 'esté'}, {w: 'lleno'}, {w: 'de'}, {w: 'salud,', em: true}, {w: 'alegrías,', em: true}],
  [{w: 'sueños', em: true}, {w: 'cumplidos', em: true}, {w: 'y'}],
  [{w: 'momentos', em: true}, {w: 'inolvidables.', em: true}],
];

const Message: React.FC<{t: number}> = ({t}) => {
  const out = eInOut(prog(t, CLOSE.msgEnd - 0.55, CLOSE.msgEnd));
  if (t < CLOSE.msgStart - 0.1 || out >= 1) return null;
  const FS = 88;
  let n = 0;
  return (
    <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 1 - out, transform: `translateY(${-out * 28 + Math.sin(t * 1.2) * 4}px) scale(${1 + 0.03 * prog(t, CLOSE.msgStart, CLOSE.msgEnd)})`, filter: out > 0.02 ? `blur(${out * 6}px)` : undefined}}>
      {MSG.map((ln, li) => (
        <div key={li} style={{display: 'flex', gap: FS * 0.26, height: FS * 1.4, alignItems: 'flex-start'}}>
          {ln.map((wd, wi) => {
            const k = n++;
            const t0 = CLOSE.msgStart + k * 0.205 + (li > 0 ? li * 0.12 : 0);
            const p = eOut(prog(t, t0, t0 + 0.7));
            const ul = wd.em ? eOut(prog(t, t0 + 0.45, t0 + 1.1)) : 0;
            return (
              <span key={wi} style={{position: 'relative', display: 'inline-block'}}>
                <span style={{display: 'inline-block', transform: `translateY(${(1 - p) * 26}px)`, opacity: clamp(p * 2.4), filter: p < 1 ? `blur(${(1 - p) * 4}px)` : undefined, fontFamily: SERIF, fontVariationSettings: SOFT, fontSize: FS, lineHeight: 1.2, fontWeight: wd.em ? 650 : 400, fontStyle: wd.em ? 'italic' : 'normal', color: wd.em ? C.terracotta : C.ink}}>
                  {wd.w}
                </span>
                {wd.em && ul > 0.001 && (
                  <div style={{position: 'absolute', left: 0, right: 0, bottom: 2, height: 20, clipPath: `inset(0 ${(1 - ul) * 100}% 0 0)`}}>
                    <svg width="100%" height="20" viewBox="0 0 200 20" preserveAspectRatio="none" style={{overflow: 'visible'}}>
                      <path d="M3 11 C28 3 52 18 80 10 S140 5 197 11" fill="none" stroke={C.terracotta} strokeOpacity={0.8} strokeWidth={4} vectorEffect="non-scaling-stroke" strokeLinecap="round" />
                    </svg>
                  </div>
                )}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ───────────────────────── ¡Feliz cumpleaños! + despedida (sobre pizarra) ─────────────────────────
const Happy: React.FC<{t: number}> = ({t}) => {
  if (t < CLOSE.happy - 0.2) return null;
  const lift = eInOut(prog(t, CLOSE.signStart - 0.2, CLOSE.signStart + 0.9));
  const FS = 196;
  const y = lerp(0, -150, lift);
  const sc = lerp(1, 0.7, lift);
  const sign1 = eOut(prog(t, CLOSE.signStart + 0.1, CLOSE.signStart + 0.9));
  const sign2 = eOut(prog(t, CLOSE.signStart + 0.75, CLOSE.signStart + 1.6));
  const logo = eOut(prog(t, CLOSE.logoIn, CLOSE.logoIn + 1.0));
  const text = '¡Feliz cumpleaños!';
  const nChars = clamp((t - CLOSE.happy) / 0.055, 0, text.length);
  const under = eOut(prog(t, CLOSE.happy + 1.1, CLOSE.happy + 1.9));
  return (
    <div style={{position: 'absolute', inset: 0, transform: `scale(${1 + 0.03 * prog(t, CLOSE.happy, CLOSE.end)})`, transformOrigin: '50% 50%'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 540 - FS * 0.62 + y, display: 'flex', justifyContent: 'center', transform: `scale(${sc})`, transformOrigin: '50% 50%', whiteSpace: 'pre', fontFamily: BRUSH, fontSize: FS, lineHeight: 1.15, translate: `0 ${Math.sin(t * 1.4) * 5}px`}}>
        {text.split('').map((ch, i) => {
          const p = clamp(nChars - i);
          const word2 = i >= 7;
          return (
            <span key={i} style={{display: 'inline-block', opacity: clamp(p * 3), transform: `translateY(${(1 - eBack(p)) * 40}px) rotate(${(1 - p) * (i % 2 ? 5 : -5)}deg)`, color: word2 ? C.terraLight : C.chalk}}>
              {ch}
            </span>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 560, top: 540 + FS * 0.5 + y * 0.9, opacity: 1 - lift, transform: `scale(${sc})`}}>
        <Scribble p={under} w={800} h={30} color={C.terraLight} kind="swoosh" sw={8} />
      </div>

      <div style={{position: 'absolute', left: 0, right: 0, top: 604, textAlign: 'center', transform: `translateY(${Math.sin(t * 1.2 + 1) * 3}px)`}}>
        <div style={{opacity: sign1, transform: `translateY(${(1 - sign1) * 22}px)`, fontFamily: SERIF, fontVariationSettings: SOFT, fontStyle: 'italic', fontWeight: 400, fontSize: 60, color: C.chalkSoft}}>Con mucho cariño,</div>
        <div style={{opacity: sign2, transform: `translateY(${(1 - sign2) * 22}px)`, marginTop: 12, fontFamily: SERIF, fontVariationSettings: SOFT, fontWeight: 400, fontSize: 70, color: C.chalk}}>
          tu familia y todo el equipo de <span style={{fontWeight: 650, fontStyle: 'italic', color: C.terraLight}}>MHORIZON</span>.
        </div>
      </div>

      <div style={{position: 'absolute', left: 70, top: 800, opacity: sign1}}>
        <Doodle kind="cake" p={eOut(prog(t, CLOSE.signStart + 0.2, CLOSE.signStart + 1.8))} scale={1.05} color={C.chalkSoft} fills={[C.terraLight, C.mustard, C.dusty]} rot={-4} />
      </div>
      <div style={{position: 'absolute', left: 1670, top: 790, opacity: sign1}}>
        <Doodle kind="gift" p={eOut(prog(t, CLOSE.signStart + 0.5, CLOSE.signStart + 2.0))} scale={1.1} color={C.chalkSoft} fills={[C.dusty, C.terraLight]} rot={4} />
      </div>

      {/* logotipo original, sin alterar proporciones */}
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 62, display: 'flex', justifyContent: 'center', opacity: logo * 0.92, transform: `translateY(${(1 - logo) * 12}px)`}}>
        <Img src={staticFile('logo-mhorizon.svg')} style={{width: 280, height: 'auto', display: 'block'}} />
      </div>
    </div>
  );
};

export const Closing: React.FC<{t: number}> = ({t}) => {
  if (t < CLOSE.mosaicIn - 0.2) return null;
  const fade = eInOut(prog(t, CLOSE.fadeStart, CLOSE.end));
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Mosaic t={t} />
      <Message t={t} />
      <Happy t={t} />
      <div style={{position: 'absolute', inset: 0, background: C.charcoal, opacity: fade}} />
    </div>
  );
};
export {eAway};
