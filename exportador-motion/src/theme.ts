import {Easing, interpolate} from 'remotion';

export const W = 1080;
export const H = 1920;
export const FPS = 30;
// 23,56 s de audio
export const DURATION = 707;

export const C = {
  ink: '#121211',
  paper: '#ecEAE3',
  paperHi: '#f7f6f1',
  grey: '#8c8a85',
  greyLt: '#c8c6bf',
  blue: '#2c55f0',
};

export const FONT = "'Montserrat MH', Montserrat, system-ui, sans-serif";

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
