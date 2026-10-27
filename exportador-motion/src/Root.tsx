import React from 'react';
import {Composition} from 'remotion';
import './fonts';
import {Main} from './Main';
import {DURATION, FPS, H, W} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition id="ExportadorHabitual" component={Main} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
);
