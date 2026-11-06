import React, {createContext, useContext} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, H, W} from './theme';
import {cam} from './camera';
import {kf, E} from './anim';

export const RenderCtx = createContext<{transparent: boolean}>({transparent: false});
export const useTransparent = () => useContext(RenderCtx).transparent;

/** Cámara 2.5D: perspectiva CSS con transformaciones keyframed continuas. */
export const World: React.FC<{children: React.ReactNode}> = ({children}) => {
  const f = useCurrentFrame();
  const c = cam(f);
  return (
    <AbsoluteFill style={{perspective: 1800, perspectiveOrigin: '50% 50%'}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformStyle: 'preserve-3d',
          transform: `translate3d(${c.tx}px,${c.ty}px,${c.tz}px) rotateX(${c.rx}deg) rotateY(${c.ry}deg) rotateZ(${c.rz}deg) scale(${c.s})`,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

/** Capa con profundidad Z (parallax real al mover la cámara). */
export const Layer: React.FC<{z?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({z = 0, children, style}) => (
  <div style={{position: 'absolute', inset: 0, transform: `translateZ(${z}px)`, transformStyle: 'preserve-3d', ...style}}>{children}</div>
);

/** Plano posicionado en coordenadas de lienzo 1080×1920, con rotación 3D propia. */
export const Plane: React.FC<{
  x: number; y: number; w: number; h: number; z?: number; rx?: number; ry?: number; rz?: number; s?: number; o?: number; origin?: string;
  children?: React.ReactNode; style?: React.CSSProperties;
}> = ({x, y, w, h, z = 0, rx = 0, ry = 0, rz = 0, s = 1, o = 1, origin = '50% 50%', children, style}) => (
  <div
    style={{
      position: 'absolute', left: x, top: y, width: w, height: h, opacity: o, transformOrigin: origin,
      transform: `translateZ(${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${s})`,
      transformStyle: 'preserve-3d', ...style,
    }}
  >
    {children}
  </div>
);

/** SVG a pantalla completa en coordenadas del lienzo. */
export const Svg: React.FC<{children: React.ReactNode; z?: number; style?: React.CSSProperties}> = ({children, z = 0, style}) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', transform: `translateZ(${z}px)`, ...style}}>
    {children}
  </svg>
);

/** Fondo: azul MHORIZON con rejilla en parallax y resplandor cálido que migra por escena. */
export const Background: React.FC = () => {
  const f = useCurrentFrame();
  const c = cam(f);
  const gx = (c.ry * 5 + f * 0.25) % 90;
  const gy = (c.rx * -5 + f * 0.4) % 90;
  const gl = kf(f, [
    [0, 0.5, E.lin], [161, 0.78], [238, 0.45], [414, 0.7], [463, 0.4], [660, 0.5], [809, 0.45], [936, 0.55], [1081, 0.35], [1211, 0.8],
  ]);
  const glx = kf(f, [[0, 760], [238, 300], [463, 820], [809, 260], [1081, 540], [1211, 540]]);
  const gly = kf(f, [[0, 1500], [238, 1650], [463, 400], [809, 1500], [1081, 1650], [1211, 1500]]);
  return (
    <AbsoluteFill style={{background: C.navy}}>
      <div style={{position: 'absolute', left: glx - 700, top: gly - 700, width: 1400, height: 1400, borderRadius: 700, opacity: gl * 0.2,
        background: `radial-gradient(closest-side, ${C.orange} 0%, rgba(212,104,28,0.25) 45%, rgba(212,104,28,0) 100%)`}} />
      <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: 0.075}}>
        <defs>
          <pattern id="g" width="90" height="90" patternUnits="userSpaceOnUse" patternTransform={`translate(${gx} ${gy})`}>
            <path d="M90 0H0V90" fill="none" stroke={C.soft} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#g)" />
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(23,30,39,0) 35%, rgba(10,14,19,0.62) 100%)'}} />
    </AbsoluteFill>
  );
};
