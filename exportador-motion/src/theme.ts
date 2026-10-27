import {Easing, interpolate} from 'remotion';

export const W = 1080;
export const H = 1920;
export const FPS = 30;
// 23,56 s de audio
export const DURATION = 707;

export const C = {
  ink: '#171E27',
  paper: '#ecEAE3',
  paperHi: '#f7f6f1',
  grey: '#878b91',
  greyLt: '#c6c7c6',
  orange: '#D4681C',
  navy: '#171E27',
};

// Zonas seguras para redes (Reels / TikTok / Shorts)
export const SAFE = {x0: 110, x1: 970, top: 300, bottom: 1480};

export const HEAD = "'Jakarta MH', 'Plus Jakarta Sans', system-ui, sans-serif";
export const BODY = "'Inter MH', Inter, system-ui, sans-serif";
export const FONT = BODY;

export const sec = (s: number) => Math.round(s * FPS);

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeIn = Easing.bezier(0.7, 0, 0.84, 0);
export const easeIO = Easing.bezier(0.65, 0, 0.35, 1);

export const prog = (frame: number, start: number, dur: number, easing: (t: number) => number = easeOut) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

// pseudo-aleatorio determinista
export const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/*
 * Calendario de escenas (frames). Cada escena sale ENTERA (texto, luego gráfico)
 * en los EXIT fotogramas previos al inicio de la siguiente, y la siguiente entra
 * después: nunca se superponen. Los cortes caen en pausas/limites de frase de la voz.
 */
export const EXIT = 7;
export const START = {
  micro: 0,
  ventas100: sec(2.8),
  pequena: sec(5.05),
  ventas1m: sec(7.35),
  barco: sec(8.8),
  globo: sec(10.55),
  pastel: sec(13.1),
  calendario: sec(16.25),
  ciclo: sec(20.65),
};
