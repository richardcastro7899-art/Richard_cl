// node sheet.mjs salida.png a.png b.png ... → hoja de contacto 2 columnas a la mitad de tamaño (para revisar capturas)
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire("C:/Users/RICHARD/Desktop/code/amurek-isotipo/amurek-identidad-animacion/package.json");
const { PNG } = require("pngjs");
const [, , out, ...ins] = process.argv;
const imgs = ins.map((f) => PNG.sync.read(fs.readFileSync(f)));
const cw = Math.max(...imgs.map((i) => i.width)) / 2 | 0, ch = Math.max(...imgs.map((i) => i.height)) / 2 | 0;
const cols = 2, rows = Math.ceil(imgs.length / cols), gap = 8;
const o = new PNG({ width: cols * cw + gap, height: rows * ch + (rows - 1) * gap });
o.data.fill(255);
imgs.forEach((im, k) => {
  const ox = (k % cols) * (cw + gap), oy = Math.floor(k / cols) * (ch + gap);
  for (let y = 0; y < Math.min(ch, im.height / 2 | 0); y++) for (let x = 0; x < Math.min(cw, im.width / 2 | 0); x++) {
    const si = ((y * 2) * im.width + x * 2) * 4, di = ((oy + y) * o.width + ox + x) * 4;
    for (let c = 0; c < 4; c++) o.data[di + c] = im.data[si + c];
  }
});
fs.writeFileSync(out, PNG.sync.write(o));
