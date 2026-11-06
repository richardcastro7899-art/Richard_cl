import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../lib/theme';
import {E, P, kf} from '../lib/anim';
import {Lead, Txt} from '../lib/text';
import {Draw} from '../lib/ui';
import {Svg} from '../lib/stage';
import {Q} from '../timing';
import {LOGO_SRC} from '../brand';

const q = Q.s9;

// Escena 09 — Cierre: logotipo oficial MHORIZON + «TU EMPRESA AL DÍA» (minimalista)
export const Scene09: React.FC = () => {
  const f = useCurrentFrame();
  const lp = P(f, q.brand, 26, E.outExpo);
  return (
    <>
      <Svg>
        <Draw d="M240 1432H840" p={P(f, q.alDia + 14, 30, E.outQuint)} stroke={C.mid} w={1.5} />
      </Svg>
      <div style={{position: 'absolute', left: 540 - 300, top: 800 + (1 - lp) * 24, width: 600, opacity: lp, filter: `blur(${(1 - lp) * 14}px)`}}>
        <img src={LOGO_SRC} style={{width: '100%', display: 'block'}} />
      </div>
      <Lead x={540} y={982} text="te ayudamos a mantener" size={58} align="center" p={P(f, 1096, 18, E.outExpo)} />
      <Txt x={540} y={1060} text="TU EMPRESA" size={128} track={-0.04} align="center" p={P(f, q.tu, 18, E.outExpo)} stagger={0.5} />
      <Txt x={540} y={1196} text="AL DÍA" size={154} track={-0.04} color={C.orange} align="center" p={P(f, q.alDia, 18, E.outExpo)} stagger={0.5}
        scale={kf(f, [[q.alDia, 1.08], [q.alDia + 16, 1, E.outExpo]])} />
      <Txt x={540} y={1452} text="CONSULTORÍA TRIBUTARIA Y EMPRESARIAL" size={24} weight={500} track={0.22} color={C.grey} align="center" p={P(f, q.alDia + 22, 20, E.outExpo)} />
    </>
  );
};
