// Uso: node tools/stills.mjs 2.0 5.5 7.4 …   (segundos) → out/stills/t_<seg>.jpg
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const BROWSER = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const times = process.argv.slice(2).map(Number);
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), publicDir: path.resolve('public')});
const comp = await selectComposition({serveUrl, id: 'MiltonCumple', browserExecutable: BROWSER});
fs.mkdirSync('out/stills', {recursive: true});
for (const t of times) {
  const frame = Math.round(t * 30);
  await renderStill({composition: comp, serveUrl, frame, output: `out/stills/t_${t.toFixed(2)}.jpg`, imageFormat: 'jpeg', jpegQuality: 88, browserExecutable: BROWSER});
  console.log('ok', t);
}
