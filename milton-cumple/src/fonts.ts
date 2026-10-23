import {continueRender, delayRender, staticFile} from 'remotion';

/** Serif cálida para textos; pincel a mano para el nombre y las notas. */
export const SERIF = "Fraunces, Georgia, 'Times New Roman', serif";
export const BRUSH = "'Caveat Brush', Caveat, cursive";
export const HAND = "Caveat, 'Caveat Brush', cursive";
/** Fraunces: variante «suave» y sin quiebros para un tono cercano */
export const SOFT = "'SOFT' 100, 'WONK' 0";

const FACES: Array<[string, string, FontFaceDescriptors]> = [
  ['Fraunces', 'Fraunces.ttf', {weight: '100 900', style: 'normal'}],
  ['Fraunces', 'Fraunces-Italic.ttf', {weight: '100 900', style: 'italic'}],
  ['Caveat Brush', 'CaveatBrush.ttf', {}],
  ['Caveat', 'Caveat.ttf', {weight: '400 700'}],
];

// Fuentes locales: el render no depende de la red.
const handle = delayRender('Cargando tipografías');
Promise.all(
  FACES.map(([family, file, desc]) => new FontFace(family, `url(${staticFile(`fonts/${file}`)})`, desc).load().then((f) => document.fonts.add(f))),
)
  .then(() => continueRender(handle))
  .catch((err) => {
    console.error(err);
    continueRender(handle);
  });
