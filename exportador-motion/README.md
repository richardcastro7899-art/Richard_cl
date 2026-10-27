# Micro, pequeña empresa y exportador habitual

Motion graphic vertical hecho con [Remotion](https://www.remotion.dev) como recurso visual para la locución `public/narracion.mp3`.

| | |
|---|---|
| Formato | 9:16, 1080 × 1920 px, 30 fps |
| Duración | 23,56 s (707 fotogramas), igual que el audio |
| Audio | Solo efectos de sonido (sin música ni voz); variante con voz disponible |
| Salida | `out/exportador-habitual-sfx.mp4` (principal, solo efectos) y `out/exportador-habitual-sfx-con-voz.mp4` (H.264 CRF 20, AAC) |

## Dirección de arte

Referencia: collage surrealista en blanco y negro sobre papel crema, viñeta, grano y revelado palabra por palabra con blur.
- **Tipografía:** Plus Jakarta Sans ExtraBold para títulos y cifras + Inter Medium para los textos de apoyo.

- **Paleta de marca:** papel crema + azul marino `#171E27` como tinta (texto, peones, calendario) y naranja `#D4681C` solo como acento: pins, arcos del globo, porción del 25 %, bandera del barco, 10 primeras figuras de «Pequeña», símbolo de las monedas superiores y bola del anillo.
- **Zonas seguras (Reels/TikTok/Shorts):** todo el contenido importante queda entre x 110–970 e y 300–1480; solo fondo y decoración sangran.
- **Metáfora:** peones de ajedrez = trabajadores; monedas = ventas; barco de papel = exportación; globo y arcos = exportaciones netas; pastel = 25 %; calendario con pins = 6 en 6 meses / 3 en 3; anillo cíclico = producción y ejercicio fiscal.
- **Movimiento:** cada palabra entra en el instante exacto en que se pronuncia (tiempos sacados de la transcripción); las escenas cambian con un barrido de desenfoque; el anillo final reacciona a la energía del audio.
- **Marco:** solo guías punteadas muy tenues; sin etiquetas, barra de progreso ni marcas de esquina.

## Transiciones y tiempos de lectura

Las escenas son secuenciales y nunca se superponen: al final de cada una sale primero el texto, luego el gráfico, queda un instante limpio y entra la siguiente (gráfico primero, texto después). Los cortes caen en pausas naturales de la voz (`START` en `src/theme.ts`), los objetos terminan de entrar con tiempo de sobra y el texto aparece 0,12 s antes de la palabra para que cada escena se mantenga completa antes de salir. La duración total sigue siendo la del audio.

## Diseño de sonido

Sin música. Los efectos se sintetizan (`sfx/build_sfx.py` → `public/sfx.wav`, 48 kHz estéreo) y se colocan con precisión de fotograma. Criterios de motion graphics de gama alta: contención (sonidos secos y táctiles, no cartoon), whooshes ajustados a la dirección y velocidad del movimiento con el pico en el fotograma más rápido, impactos en el fotograma exacto del aterrizaje, una sola escala tonal (re mayor pentatónica) y variación de tono/volumen en cada evento.

| Elemento | Sonido |
|---|---|
| Transiciones de escena | Whoosh de aire filtrado: barrido ascendente al salir, descendente al entrar, cada uno con ligera variación |
| Aparición de texto | Tick de cristal suave en frases cortas; en palabras grandes, golpe grave suave + nota + soplo de aire |
| Peones | «Tok» de madera seca; el de «tú» lleva además el golpe del pin |
| Monedas | Clink metálico que sube de tono con la pila; la última añade un chime. La torre es una ráfaga ascendente con remate |
| Tarjeta / fichas | Deslizamiento de papel y toques suaves |
| Pins | «Thock» seco con un ping tonal |
| Globo / arcos | Trazo ascendente por arco y nota al llegar |
| Pastel | Barrido de aire, chasquido y desplazamiento de la porción |
| Cierre | Dos chimes graves-agudos sobre «fiscal» |

Mezcla: -16,5 LUFS integrados, pico -1,5 dBFS. `sfx/sfx_events.json` lista cada evento con su tiempo. `npm run render` produce la versión solo con efectos; la composición `ExportadorHabitualVoz` añade la locución.

## Escenas

| Tiempo | Voz | Visual |
|---|---|---|
| 0,0–2,5 s | «Eres micro… de 1 a 9 trabajadores» | 9 peones sobre el tablero; el primero lleva el pin («tú») |
| 2,5–4,9 s | «…vendes hasta 100 mil dólares al año» | Pila de monedas que cae |
| 4,9–7,0 s | «…pequeña… de 10 a 49» | Tarjeta de equipo: 49 figuras, las primeras 10 en naranja (gráfico distinto al de Micro) |
| 7,0–8,7 s | «…vendes hasta un millón» | Torre de 56 monedas frente a la pila de $100 mil (10×) |
| 8,7–10,4 s | «Se considera exportador habitual» | Barco de papel |
| 10,4–12,9 s | «…contribuyente cuyas exportaciones netas…» | Globo con arcos de exportación |
| 12,9–15,9 s | «…al menos del 25 % en su total de ingreso» | Pastel con porción del 25 % |
| 15,9–20,4 s | «…6 exportaciones en 6 meses distintos, o 3 en 3 meses» | Calendario con pins; pasa de 6 a 3 |
| 20,4–23,6 s | «…si tu producción es cíclica durante el ejercicio fiscal» | Anillo cíclico de 12 meses |

## Uso

```bash
npm install
npm run studio   # previsualización con línea de tiempo
npm run render   # exporta out/exportador-habitual.mp4 (CRF 16, solo efectos)
```

Si Remotion no puede descargar su navegador, añade `--browser-executable=/ruta/a/chrome-headless-shell`.

`src/energy.json` es la energía del audio por fotograma; `public/grain*.png` es la textura de grano. Plus Jakarta Sans e Inter (SIL OFL 1.1) van en `public/fonts`.

> La transcripción se hizo automáticamente. Si alguna cifra o palabra del audio difiere de lo que aparece en pantalla, el texto se edita en `src/scenes.tsx`.
