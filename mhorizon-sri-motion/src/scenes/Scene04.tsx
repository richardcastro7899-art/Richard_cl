import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../lib/theme';
import {E, P} from '../lib/anim';
import {Lead, Txt} from '../lib/text';
import {Q} from '../timing';

const q = Q.s4;

// Escena 04 — «Y hay algo importante.»  Un único mensaje, centrado, con aire.
export const Scene04: React.FC = () => {
  const f = useCurrentFrame();
  const out = P(f, q.out, 9, E.inC);
  return (
    <>
      <Lead x={540} y={770} text="Y hay algo" size={96} align="center" p={P(f, q.hay - 4, 18, E.outExpo)} out={out} />
      <Txt x={540} y={890} text="IMPORTANTE" size={124} track={-0.035} color={C.orange} align="center" p={P(f, q.importante, 16, E.outExpo)} stagger={0.5} out={out} />
    </>
  );
};
