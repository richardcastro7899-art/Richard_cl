// Exporta los eventos de la línea de tiempo (JSON) para sincronizar el sonido con la animación.
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
fs.copyFileSync('src/core.ts', '/tmp/core_events.mts');
const m = await import(pathToFileURL('/tmp/core_events.mts').href);
const out = {
  bpm: m.BPM, bar: m.BAR, duration: m.DURATION_S,
  ticks: m.rouletteTicks(), spinEnd: m.ROULETTE.spinEnd,
  T: m.T, close: m.CLOSE, bg: m.BG_EVENTS, TR: m.TR,
  shots: m.SHOTS.map((s, i) => ({id: s.id, kind: s.kind, start: m.SHOT_START[i], dur: s.dur, flare: !!s.flare, nItems: s.items?.length ?? 0, items: s.items?.map((x) => ({idx: x.idx, delay: x.delay ?? 0, enter: x.enter, exit: x.exit, swap: !!x.swapTo})), doodle: s.doodle ?? null, chapter: s.chapter ?? null, words: s.phrase ? s.phrase.lines.flat().map((w) => !!w.em) : undefined, wordLens: s.phrase ? s.phrase.lines.flat().map((w) => w.w.length) : undefined, swap: !!s.items?.some((x) => x.swapTo)})),
};
fs.writeFileSync('tools/events.json', JSON.stringify(out, null, 1));
console.log('ticks', out.ticks.length, 'first', out.ticks[0].toFixed(2), 'last', out.ticks.at(-1).toFixed(2));
