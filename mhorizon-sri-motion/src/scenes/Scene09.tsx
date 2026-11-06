import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../lib/theme';
import {E, P, kf} from '../lib/anim';
import {Lead, Txt} from '../lib/text';
import {Q} from '../timing';
import {LOGO_SRC} from '../brand';

const q = Q.s9;

// Escena 09 — Cierre: logotipo oficial MHORIZON + «TU EMPRESA AL DÍA»
export const Scene09: React.FC = () => {
  const f = useCurrentFrame();
  const lp = P(f, q.brand, 26, E.outExpo);
  return (
    <>
      <div style={{position: 'absolute', left: 540 - 310, top: 640 + (1 - lp) * 24, width: 620, opacity: lp, filter: `blur(${(1 - lp) * 14}px)`}}>
        <img src={LOGO_SRC} style={{width: '100%', display: 'block'}} />
      </div>
      <Lead x={540} y={860} text="te ayudamos a mantener" size={58} align="center" p={P(f, q.lead, 18, E.outExpo)} />
      <Txt x={540} y={950} text="TU EMPRESA" size={130} track={-0.04} align="center" p={P(f, q.tu, 18, E.outExpo)} stagger={0.5} />
      <Txt x={540} y={1090} text="AL DÍA" size={156} track={-0.04} color={C.orange} align="center" p={P(f, q.alDia, 18, E.outExpo)} stagger={0.5}
        scale={kf(f, [[q.alDia, 1.08], [q.alDia + 16, 1, E.outExpo]])} />
      <Txt x={540} y={1330} text="CONSULTORÍA TRIBUTARIA Y EMPRESARIAL" size={24} weight={500} track={0.22} color={C.grey} align="center" p={P(f, q.tag, 20, E.outExpo)} />
    </>
  );
};
