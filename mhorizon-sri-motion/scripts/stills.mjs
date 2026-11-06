// Uso: node scripts/stills.mjs <CompId> f1 f2 ...  → out/tmp/f_<frame>.png  (contact sheet opcional con --sheet)
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
const BR = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const [id, ...frames] = process.argv.slice(2);
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), publicDir: path.resolve('public')});
const comp = await selectComposition({serveUrl, id, browserExecutable: BR});
for (const fr of frames) {
  await renderStill({composition: comp, serveUrl, frame: Number(fr), output: `out/tmp/f_${fr}.png`, browserExecutable: BR, scale: 0.5});
}
console.log('ok', frames.join(','));
