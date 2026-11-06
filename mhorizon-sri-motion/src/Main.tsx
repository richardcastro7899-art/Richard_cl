import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Background, Layer, RenderCtx, World} from './lib/stage';
import {HorizonLine} from './lib/horizon';
import {Hero} from './Hero';
import {WINDOWS} from './timing';
import {Scene01} from './scenes/Scene01';
import {Scene02} from './scenes/Scene02';
import {Scene03} from './scenes/Scene03';
import {Scene04} from './scenes/Scene04';
import {Scene05} from './scenes/Scene05';
import {Scene06} from './scenes/Scene06';
import {Scene07} from './scenes/Scene07';
import {Scene08} from './scenes/Scene08';
import {Scene09} from './scenes/Scene09';

const SCENES: React.FC[] = [Scene01, Scene02, Scene03, Scene04, Scene05, Scene06, Scene07, Scene08, Scene09];

/** Visual completo (9 escenas). Todo el movimiento depende del frame global. */
export const Main: React.FC<{transparent?: boolean}> = ({transparent = false}) => {
  const f = useCurrentFrame();
  return (
    <RenderCtx.Provider value={{transparent}}>
      <AbsoluteFill style={{background: transparent ? 'transparent' : undefined}}>
        {!transparent && <Background />}
        <World>
          <Layer>
            <HorizonLine />
            {SCENES.map((S, i) => (f >= WINDOWS[i][0] && f <= WINDOWS[i][1] ? <S key={i} /> : null))}
            <Hero />
          </Layer>
        </World>
      </AbsoluteFill>
    </RenderCtx.Provider>
  );
};
