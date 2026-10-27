import {continueRender, delayRender, staticFile} from 'remotion';

const WEIGHTS: Array<[string, number]> = [
  ['montserrat-latin-500-normal.woff2', 500],
  ['montserrat-latin-700-normal.woff2', 700],
  ['montserrat-latin-800-normal.woff2', 800],
  ['montserrat-latin-900-normal.woff2', 900],
];

// Fuentes locales: el render no depende de la red.
const handle = delayRender('Cargando Montserrat');
Promise.all(
  WEIGHTS.map(([file, weight]) => {
    const face = new FontFace('Montserrat MH', `url(${staticFile(`fonts/${file}`)})`, {weight: String(weight)});
    return face.load().then((f) => document.fonts.add(f));
  }),
)
  .then(() => continueRender(handle))
  .catch((err) => {
    console.error(err);
    continueRender(handle);
  });
