import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {
  SceneBoat,
  SceneCalendar,
  SceneCycle,
  SceneGlobe,
  SceneMicro,
  ScenePct,
  ScenePequena,
  SceneSales100,
  SceneSales1M,
} from './scenes';
import {Frame, Overlay, TopTag} from './ui';
import {C, DURATION, FONT} from './theme';

// Frames de inicio de cada escena (voz sincronizada con la transcripción)
const S = {micro: 0, v100: 74, peq: 148, v1m: 210, boat: 262, globe: 312, pct: 386, cal: 476, cycle: 612};

export {DURATION};

export const Main: React.FC = () => (
  <AbsoluteFill style={{background: C.paper, fontFamily: FONT}}>
    <Audio src={staticFile('narracion.mp3')} />
    <Frame />
    <SceneMicro start={S.micro} next={S.v100} />
    <SceneSales100 start={S.v100} next={S.peq} />
    <ScenePequena start={S.peq} next={S.v1m} />
    <SceneSales1M start={S.v1m} next={S.boat} />
    <SceneBoat start={S.boat} next={S.globe} />
    <SceneGlobe start={S.globe} next={S.pct} />
    <ScenePct start={S.pct} next={S.cal} />
    <SceneCalendar start={S.cal} next={S.cycle} />
    <SceneCycle start={S.cycle} next={DURATION} />
    <TopTag />
    <Overlay />
  </AbsoluteFill>
);
