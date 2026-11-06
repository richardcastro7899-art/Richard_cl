import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, W} from './theme';
import {E, kf} from './anim';
import {Q} from '../timing';

/** Línea de horizonte persistente: nace al colapsar la interfaz, es suelo, divisor y finalmente marca. */
export const HorizonLine: React.FC = () => {
  const f = useCurrentFrame();
  const y = kf(f, [[0, 1090], [Q.s1.collapse + 22, 1090], [186, 985, E.ioQuart], [630, 985], [660, 930, E.ioQuart], [784, 930], [810, 1008, E.ioQuart], [1062, 1008], [1098, 690, E.ioQuart]]);
  const o = kf(f, [[0, 0], [Q.s1.collapse + 18, 0], [Q.s1.collapse + 28, 0.9], [972, 0.9], [1004, 0.22, E.ioC], [1062, 0.22], [1098, 0, E.ioC]]);
  const wd = kf(f, [[0, 900], [Q.s1.collapse + 22, 900], [186, 1080, E.outExpo]]);
  if (o <= 0.001) return null;
  return (
    <div style={{position: 'absolute', left: (W - wd) / 2, top: y - 1, width: wd, height: 3, opacity: o, background: `linear-gradient(90deg, rgba(212,104,28,0), ${C.orange} 18%, ${C.orange} 82%, rgba(212,104,28,0))`, boxShadow: '0 0 24px rgba(212,104,28,0.55)'}} />
  );
};
