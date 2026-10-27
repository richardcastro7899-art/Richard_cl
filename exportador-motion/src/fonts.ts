import {continueRender, delayRender, staticFile} from 'remotion';

// Plus Jakarta Sans (títulos y cifras) + Inter (textos de apoyo). Locales: el render no depende de la red.
const FACES: Array<[string, string, number]> = [
  ['Jakarta MH', 'plus-jakarta-sans-latin-700-normal.woff2', 700],
  ['Jakarta MH', 'plus-jakarta-sans-latin-800-normal.woff2', 800],
  ['Inter MH', 'inter-latin-500-normal.woff2', 500],
  ['Inter MH', 'inter-latin-600-normal.woff2', 600],
];

const handle = delayRender('Cargando tipografías');
Promise.all(
  FACES.map(([family, file, weight]) => {
    const face = new FontFace(family, `url(${staticFile(`fonts/${file}`)})`, {weight: String(weight)});
    return face.load().then((f) => document.fonts.add(f));
  }),
)
  .then(() => continueRender(handle))
  .catch((err) => {
    console.error(err);
    continueRender(handle);
  });
