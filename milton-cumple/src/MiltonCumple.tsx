import React from 'react';
import {AbsoluteFill} from 'remotion';
import './fonts';
import {Stage, useT} from './common';
import {Roulette} from './Roulette';
import {Intro} from './Intro';
import {Shots} from './Shots';
import {Closing} from './Closing';

export const MiltonCumple: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill style={{background: '#25282C'}}>
      <Stage t={t} />
      <Roulette t={t} />
      <Intro t={t} />
      <Shots t={t} />
      <Closing t={t} />
    </AbsoluteFill>
  );
};
