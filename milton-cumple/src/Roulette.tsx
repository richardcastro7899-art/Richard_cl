import React from 'react';
import {C, MONTHS, OCTOBER, ROULETTE, clamp, eOut, eInOut, prog, ringRadius, rng, rouletteAngle} from './core';
import {SERIF, SOFT} from './fonts';

const ITEM_H = 200;
const R = ITEM_H / (2 * Math.tan(Math.PI / 12)); // radio del tambor (12 caras)
const PERSP = 1500;
const SAMPLES = 16; // muestras de motion blur
const SHUTTER = 1.0 / 30; // obturador: 1 fotograma

/** Resplandor naranja de fondo cuando se detiene en OCTUBRE. */
export const rouletteWarm = (t: number) => eOut(prog(t, 5.95, 6.9)) * (1 - prog(t, 7.4, 8.6));

const SPARKS = (() => {
  const r = rng(5);
  return Array.from({length: 90}, () => ({x: r() * 1920, y: r() * 1080, s: 1.5 + r() * 3.5, sp: 10 + r() * 26, ph: r() * 6.28, w: r() < 0.3}));
})();

const Sparks: React.FC<{t: number}> = ({t}) => {
  const fadeIn = prog(t, 0, 1.4);
  const fadeOut = 1 - prog(t, 6.9, 7.8);
  const o = fadeIn * fadeOut;
  if (o <= 0) return null;
  return (
    <>
      {SPARKS.map((p, i) => {
        const y = (p.y - p.sp * t + 4320) % 1080;
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(t * 1.7 + p.ph));
        const col = p.w ? '240,170,120' : '240,234,222';
        return (
          <div
            key={i}
            style={{
              position: 'absolute', left: p.x, top: y, width: p.s, height: p.s, borderRadius: '50%',
              background: `rgba(${col},${0.9 * tw * o})`, boxShadow: `0 0 ${p.s * 4}px rgba(${col},${0.7 * tw * o})`,
            }}
          />
        );
      })}
    </>
  );
};

const Dial: React.FC<{phi: number; stopped: number}> = ({phi, stopped}) => {
  const ticks = Array.from({length: 72}, (_, i) => i);
  return (
    <svg width={1100} height={1100} viewBox="-550 -550 1100 1100" style={{position: 'absolute', left: 960 - 550, top: 540 - 550}}>
      <g transform={`rotate(${-phi * 0.5})`} opacity={0.5}>
        <circle r={500} fill="none" stroke="rgba(242,238,229,0.28)" strokeWidth={2} />
        {ticks.map((i) => {
          const major = i % 6 === 0;
          return (
            <line key={i} x1={0} y1={-500} x2={0} y2={-500 + (major ? 30 : 14)} stroke={major ? C.terraLight : 'rgba(242,238,229,0.5)'} strokeWidth={major ? 3 : 2} transform={`rotate(${i * 5})`} />
          );
        })}
      </g>
      <circle r={438} fill="none" stroke="rgba(242,238,229,0.12)" strokeWidth={1.5} />
      <circle r={438} fill="none" stroke={C.terraLight} strokeWidth={3} opacity={stopped * 0.9} strokeDasharray={`${stopped * 2750} 2750`} transform="rotate(-90)" />
    </svg>
  );
};

export const Roulette: React.FC<{t: number}> = ({t}) => {
  if (t > 8.6) return null;
  const appear = eOut(prog(t, 0.05, 1.0));
  const phi0 = rouletteAngle(t);
  const emph = eOut(prog(t, 6.0, 6.75)); // OCTUBRE se ilumina
  const out = eInOut(prog(t, 6.85, 7.75)); // el tambor se transforma
  const stopped = eOut(prog(t, 6.0, 7.0));

  const raw = Array.from({length: SAMPLES}, (_, k) => {
    const dt = (k / (SAMPLES - 1) - 0.5) * SHUTTER;
    return rouletteAngle(t + dt);
  });
  const spread = raw[SAMPLES - 1] - raw[0];
  const still = spread < 0.05; // detenida: un único render nítido, sin mezcla aditiva
  const copies = still ? [phi0] : raw;
  const blurPx = Math.min(2.2, spread / 14);

  const drumScale = 0.92 + 0.08 * appear + out * 0.35;
  const drumOpacity = appear * (1 - out);
  const tiltY = Math.sin(t * 0.8) * 5 * (1 - emph) + (1 - appear) * 25;
  const tiltZ = -3 + emph * 3 + Math.sin(t * 0.55) * 1.2;

  // anillo expansivo: su borde descubre el papel (ver Stage)
  const ringR = ringRadius(t);
  const ringA = (1 - prog(t, 7.5, 8.3)) * (ringR > 0 ? 1 : 0);
  const flash = Math.max(0, 1 - Math.abs(t - 7.1) / 0.2) * 0.22;

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse 45% 55% at 50% 50%, rgba(232,148,106,${0.3 * rouletteWarm(t)}) 0%, rgba(232,148,106,0) 70%)`}} />
      <Sparks t={t} />
      <div style={{opacity: drumOpacity, transform: `scale(${drumScale})`, transformOrigin: '960px 540px'}}>
        <Dial phi={phi0} stopped={stopped} />
      </div>

      {/* tambor con proyección cilíndrica y motion blur por muestreo temporal */}
      <div style={{position: 'absolute', inset: 0, perspective: 1800, perspectiveOrigin: '50% 50%', opacity: drumOpacity}}>
        <div style={{position: 'absolute', inset: 0, transform: `scale(${drumScale}) rotateY(${tiltY}deg) rotateZ(${tiltZ}deg)`, transformOrigin: '960px 540px', isolation: 'isolate', filter: blurPx > 0.3 ? `blur(${blurPx}px)` : undefined}}>
          {copies.map((phi, k) => (
            <div key={k} style={{position: 'absolute', inset: 0, mixBlendMode: still ? 'normal' : 'plus-lighter', opacity: still ? 1 : 1 / SAMPLES}}>
              {MONTHS.map((m, i) => {
                const a = ((((phi - 30 * i) % 360) + 540) % 360) - 180; // grados respecto al frente
                const aa = Math.abs(a);
                if (aa > 92) return null;
                const rad = (a * Math.PI) / 180;
                const sc = PERSP / (PERSP + R * (1 - Math.cos(rad)));
                const y = -R * Math.sin(rad) * sc;
                const isOct = i === OCTOBER;
                let o = clamp(1 - Math.pow(aa / 80, 1.6));
                if (!isOct) o *= 1 - emph * 0.93;
                const col = isOct ? mixHex(C.chalk, '#EE9C6E', emph) : C.chalk;
                const glow = isOct ? emph : 0;
                return (
                  <div
                    key={m}
                    style={{
                      position: 'absolute', left: 960 - 700, top: 540 - ITEM_H / 2 + y, width: 1400, height: ITEM_H,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transform: `scale(${sc}, ${sc * Math.cos(rad)})`,
                      fontFamily: SERIF, fontVariationSettings: SOFT, fontWeight: 600, fontSize: 138, letterSpacing: '0.06em', color: col, opacity: o,
                      textShadow: glow > 0 ? `0 0 ${36 * glow}px rgba(232,148,106,${0.6 * glow}), 0 0 ${90 * glow}px rgba(232,148,106,${0.32 * glow})` : 'none',
                    }}
                  >
                    {m}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ventana de la ruleta: marcadores y guías */}
      <div style={{position: 'absolute', inset: 0, opacity: drumOpacity}}>
        {[-1, 1].map((s) => (
          <React.Fragment key={s}>
            <div
              style={{
                position: 'absolute', top: 540 - 15, left: s < 0 ? 960 - 640 : 960 + 640 - 30, width: 0, height: 0,
                borderTop: '15px solid transparent', borderBottom: '15px solid transparent',
                [s < 0 ? 'borderLeft' : 'borderRight']: `30px solid ${C.terraLight}`, filter: `drop-shadow(0 0 ${6 + emph * 12}px rgba(232,148,106,0.7))`,
              }}
            />
            {[-1, 1].map((v) => (
              <div
                key={v}
                style={{
                  position: 'absolute', top: 540 + v * 104, height: 2, width: 560, left: s < 0 ? 960 - 700 + 70 : 960 + 140,
                  background: `linear-gradient(${s < 0 ? 90 : 270}deg, rgba(242,238,229,0) 0%, rgba(242,238,229,${0.3 * (1 - emph * 0.5)}) 100%)`,
                }}
              />
            ))}
          </React.Fragment>
        ))}
      </div>

      {ringA > 0 && (
        <div
          style={{
            position: 'absolute', left: 960 - ringR, top: 540 - ringR, width: ringR * 2, height: ringR * 2, borderRadius: '50%',
            border: '5px solid rgba(232,148,106,0.85)', boxShadow: '0 0 40px rgba(232,148,106,0.5)', opacity: ringA,
          }}
        />
      )}
      {flash > 0 && <div style={{position: 'absolute', inset: 0, background: `rgba(255,236,214,${flash})`}} />}
    </div>
  );
};

function mixHex(a: string, b: string, t: number) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const m = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `rgb(${m[0]},${m[1]},${m[2]})`;
}

export {ROULETTE};
