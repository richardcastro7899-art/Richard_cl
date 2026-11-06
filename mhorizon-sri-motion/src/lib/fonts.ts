import {continueRender, delayRender, staticFile} from 'remotion';

export const INTER = 'Inter MH, Inter, system-ui, sans-serif';

const WEIGHTS: Array<[string, number]> = [
  ['Inter-Regular.otf', 400],
  ['Inter-Medium.otf', 500],
  ['Inter-SemiBold.otf', 600],
  ['Inter-Bold.otf', 700],
  ['Inter-ExtraBold.otf', 800],
];

// Fuentes locales: el render no depende de la red.
const handle = delayRender('Cargando Inter');
Promise.all(
  WEIGHTS.map(([file, weight]) => {
    const face = new FontFace('Inter MH', `url(${staticFile(`fonts/${file}`)})`, {weight: String(weight)});
    return face.load().then((f) => document.fonts.add(f));
  }),
)
  .then(() => continueRender(handle))
  .catch((err) => {
    console.error(err);
    continueRender(handle);
  });
