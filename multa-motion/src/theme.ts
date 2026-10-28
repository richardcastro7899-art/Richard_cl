import {Easing, interpolate} from 'remotion';

export const W = 1080;
export const H = 1920;
export const FPS = 30;
// 21,89 s de audio
export const DURATION = 657;

export const C = {
  ink: '#121211',
  paper: '#ecEAE3',
  paperHi: '#f7f6f1',
  grey: '#8c8a85',
  greyLt: '#c8c6bf',
  blue: '#2c55f0',
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
  declaracion: 0,
  omision: sec(2.45),
  multa: sec(7.85),
  exterior: sec(11.75),
  noReportado: sec(15.15),
  tope: sec(16.75),
  salarios: sec(18.65),
};
