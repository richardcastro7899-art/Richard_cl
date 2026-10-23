import React from 'react';
import {Composition} from 'remotion';
import {MiltonCumple} from './MiltonCumple';
import {DURATION, FPS, WIDTH, HEIGHT} from './core';

export const RemotionRoot: React.FC = () => (
  <Composition id="MiltonCumple" component={MiltonCumple} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
);
