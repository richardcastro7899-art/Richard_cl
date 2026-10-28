import React from 'react';
import {Composition} from 'remotion';
import './fonts';
import {Main} from './Main';
import {DURATION, FPS, H, W} from './theme';

export const RemotionRoot: React.FC = () => (
  <>
    {/* Versión principal: solo efectos de sonido */}
    <Composition id="MultaActivos" component={Main} durationInFrames={DURATION} fps={FPS} width={W} height={H} defaultProps={{voz: false}} />
    {/* Variante con la locución original + efectos */}
    <Composition id="MultaActivosVoz" component={Main} durationInFrames={DURATION} fps={FPS} width={W} height={H} defaultProps={{voz: true}} />
  </>
);
