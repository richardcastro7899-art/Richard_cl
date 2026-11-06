import React from 'react';
import {Audio, Composition, Sequence, staticFile} from 'remotion';
import './lib/fonts';
import {Main} from './Main';
import {Sound} from './Sound';
import {FPS, SCENE_END, SCENE_START, TOTAL} from './timing';

const size = {width: 1080, height: 1920, fps: FPS} as const;

/** Visual + efectos de sonido (sin voz). */
const MasterComp: React.FC = () => (
  <>
    <Main />
    <Sound />
  </>
);

/** Recorte de una escena: reutiliza el timeline global desplazado. */
const SceneClip: React.FC<{start: number; transparent: boolean}> = ({start, transparent}) => (
  <Sequence from={-start}>
    <Main transparent={transparent} />
  </Sequence>
);

/**
 * AUXILIAR — solo para revisar sincronía en el estudio. Incluye la locución de referencia.
 * NO se renderiza en ningún script de exportación.
 */
const VoiceSyncComp: React.FC = () => (
  <>
    <Main />
    <Sound />
    <Audio src={staticFile('reference/voz_referencia.mp3')} volume={1} />
  </>
);

export const Root: React.FC = () => (
  <>
    <Composition id="Master" component={MasterComp} durationInFrames={TOTAL} {...size} />
    <Composition id="Silent" component={Main} durationInFrames={TOTAL} {...size} />
    {SCENE_START.map((s, i) => {
      const n = String(i + 1).padStart(2, '0');
      return (
        <React.Fragment key={n}>
          <Composition id={`Scene${n}`} component={SceneClip} durationInFrames={SCENE_END[i] - s} {...size} defaultProps={{start: s, transparent: false}} />
          <Composition id={`Scene${n}-Alpha`} component={SceneClip} durationInFrames={SCENE_END[i] - s} {...size} defaultProps={{start: s, transparent: true}} />
        </React.Fragment>
      );
    })}
    <Composition id="AUX-SyncConVoz-NO-EXPORTAR" component={VoiceSyncComp} durationInFrames={TOTAL} {...size} />
  </>
);
