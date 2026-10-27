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
import {Frame, Overlay} from './ui';
import {BODY, C, DURATION, START as S} from './theme';

// Frames de inicio de cada escena (voz sincronizada con la transcripción)

export {DURATION};

export const Main: React.FC = () => (
  <AbsoluteFill style={{background: C.paper, fontFamily: BODY}}>
    <Audio src={staticFile('narracion.mp3')} />
    <Frame />
    <SceneMicro start={S.micro} end={S.ventas100} />
    <SceneSales100 start={S.ventas100} end={S.pequena} />
    <ScenePequena start={S.pequena} end={S.ventas1m} />
    <SceneSales1M start={S.ventas1m} end={S.barco} />
    <SceneBoat start={S.barco} end={S.globo} />
    <SceneGlobe start={S.globo} end={S.pastel} />
    <ScenePct start={S.pastel} end={S.calendario} />
    <SceneCalendar start={S.calendario} end={S.ciclo} />
    <SceneCycle start={S.ciclo} end={DURATION} />
    <Overlay />
  </AbsoluteFill>
);
