import React, {createContext, useContext} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, H, W} from './theme';
import {cam} from './camera';
import {clamp, E} from './anim';

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

/** Fondo: blanco liso con una rejilla casi imperceptible (sin manchas de color). */
export const Background: React.FC = () => {
  const f = useCurrentFrame();
  const gy = (f * 0.25) % 90;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #E9EEF5 0%, #DEE5EE 100%)'}}>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: 0.05}}>
        <defs>
          <pattern id="g" width="90" height="90" patternUnits="userSpaceOnUse" patternTransform={`translate(0 ${gy})`}>
            <path d="M90 0H0V90" fill="none" stroke="#171E27" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#g)" />
      </svg>
    </AbsoluteFill>
  );
};

/** Tarjeta flotante: entra desde abajo con inclinación 3D, flota suavemente y sale hacia arriba. */
export const FloatCard: React.FC<{
  x: number; y: number; w: number; h: number; inAt: number; outAt: number; phase?: number; children?: React.ReactNode; fill?: string; border?: boolean; inner?: number;
}> = ({x, y, w, h, inAt, outAt, phase = 0, children, fill = '#FFFFFF', border = true, inner}) => {
  const sc = inner ? w / inner : 1;
  const f = useCurrentFrame();
  const pin = E.outExpo(clamp((f - inAt) / 26));
  const pout = E.inC(clamp((f - outAt) / 16));
  if (f < inAt - 1 || pout >= 1) return null;
  const bob = Math.sin(f * 0.055 + phase) * 6;
  return (
    <Plane x={x} y={y + (1 - pin) * 150 - pout * 100 + bob} w={w} h={h} z={0} rx={(1 - pin) * 24 - pout * 10} ry={Math.sin(f * 0.03 + phase) * 2} o={pin * (1 - pout)}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 28, background: fill, border: border ? '2px solid #D3D9E2' : 'none', boxShadow: '0 3px 8px rgba(23,30,39,0.07), 0 40px 90px rgba(23,30,39,0.22)', overflow: 'hidden'}}>
        {inner ? <div style={{position: 'absolute', left: 0, top: 0, width: inner, height: h / sc, transform: `scale(${sc})`, transformOrigin: '0 0'}}>{children}</div> : children}
      </div>
    </Plane>
  );
};
