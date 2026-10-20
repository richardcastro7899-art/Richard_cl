import React from 'react';
import {Composition} from 'remotion';
import {MHorizonRevision, DURATION, FPS, WIDTH, HEIGHT} from './MHorizonRevision';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="MHorizonRevision"
    component={MHorizonRevision}
    durationInFrames={DURATION}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
