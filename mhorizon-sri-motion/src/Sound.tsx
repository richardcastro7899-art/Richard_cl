import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import index from './sfx/generated.json';
import {CATEGORY_LABEL, Category, MASTER_GAIN, masterFade} from './sfx/manifest';
import {TOTAL} from './timing';

type Entry = {id: string; file: string; cat: Category; startFrame: number; durationInFrames: number; vol: number; fadeIn: number; fadeOut: number};
const ENTRIES = index as Entry[];
const CATS = Object.keys(CATEGORY_LABEL) as Category[];

/**
 * Pistas de efectos separadas por categoría. Cada evento es un <Audio> programado en su
 * fotograma de inicio con volumen, fade in/out y fundido final del master.
 * NO existe ninguna pista de locución en este componente.
 */
export const Sound: React.FC = () => (
  <>
    {CATS.map((cat) => (
      <Sequence key={cat} name={`SFX · ${CATEGORY_LABEL[cat]}`} layout="none">
        {ENTRIES.filter((e) => e.cat === cat && e.startFrame < TOTAL).map((e) => (
          <Sequence key={e.id} name={e.id} from={e.startFrame} durationInFrames={Math.min(e.durationInFrames, TOTAL - e.startFrame)} layout="none">
            <Audio
              src={staticFile(e.file)}
              volume={(f) => Math.max(0, Math.min(1, e.vol * MASTER_GAIN * masterFade(e.startFrame + f)))}
            />
          </Sequence>
        ))}
      </Sequence>
    ))}
  </>
);
