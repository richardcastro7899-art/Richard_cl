import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {
  SceneDeclaracion,
  SceneExterior,
  SceneMulta,
  SceneNoReportado,
  SceneOmision,
  SceneSalarios,
  SceneTope,
} from './scenes';
import {Frame, Overlay} from './ui';
import {BODY, C, DURATION, START as S} from './theme';

export {DURATION};

export const Main: React.FC<{voz?: boolean}> = ({voz = false}) => (
  <AbsoluteFill style={{background: C.paper, fontFamily: BODY}}>
    {/* Solo efectos de sonido (sin música). `voz` añade la locución original */}
    <Audio src={staticFile('sfx.wav')} volume={voz ? 0.7 : 1} />
    {voz && <Audio src={staticFile('narracion.mp3')} />}
    <Frame />
    <SceneDeclaracion start={S.declaracion} end={S.omision} />
    <SceneOmision start={S.omision} end={S.multa} />
    <SceneMulta start={S.multa} end={S.exterior} />
    <SceneExterior start={S.exterior} end={S.noReportado} />
    <SceneNoReportado start={S.noReportado} end={S.tope} />
    <SceneTope start={S.tope} end={S.salarios} />
    <SceneSalarios start={S.salarios} end={DURATION} />
    <Overlay />
  </AbsoluteFill>
);
