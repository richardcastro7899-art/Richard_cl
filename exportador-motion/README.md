# Micro, pequeña empresa y exportador habitual

Motion graphic vertical hecho con [Remotion](https://www.remotion.dev) como recurso visual para la locución `public/narracion.mp3`.

| | |
|---|---|
| Formato | 9:16, 1080 × 1920 px, 30 fps |
| Duración | 23,56 s (707 fotogramas), igual que el audio |
| Audio | Locución incluida en el MP4 |
| Salida | `out/exportador-habitual-ligero.mp4` (H.264 CRF 20, AAC) |

## Dirección de arte

Referencia: collage surrealista en blanco y negro sobre papel crema, viñeta, grano, tipografía Montserrat Black y revelado palabra por palabra con blur.

- **Paleta de marca:** papel crema + azul marino `#171E27` como tinta (texto, peones, calendario) y naranja `#D4681C` solo como acento: pins, arcos del globo, porción del 25 %, bandera del barco, 10 primeras figuras de «Pequeña», símbolo de las monedas superiores, bola del anillo, barra de progreso y marcas de esquina.
- **Zonas seguras (Reels/TikTok/Shorts):** todo el contenido importante queda entre x 110–970 e y 300–1480; solo fondo y decoración sangran.
- **Metáfora:** peones de ajedrez = trabajadores; monedas = ventas; barco de papel = exportación; globo y arcos = exportaciones netas; pastel = 25 %; calendario con pins = 6 en 6 meses / 3 en 3; anillo cíclico = producción y ejercicio fiscal.
- **Movimiento:** cada palabra entra en el instante exacto en que se pronuncia (tiempos sacados de la transcripción); las escenas cambian con un barrido de desenfoque; el anillo final reacciona a la energía del audio.
- **Marco:** etiqueta superior que cambia con el tema (Microempresa → Pequeña empresa → Exportador habitual), guías punteadas y marcas de esquina corporativas y barra de progreso.

## Transiciones y tiempos de lectura

Las escenas son secuenciales y nunca se superponen: al final de cada una sale primero el texto, luego el gráfico, queda un instante limpio y entra la siguiente (gráfico primero, texto después). Los cortes caen en pausas naturales de la voz (`START` en `src/theme.ts`), los objetos terminan de entrar con tiempo de sobra y el texto aparece 0,12 s antes de la palabra para que cada escena se mantenga completa antes de salir. La duración total sigue siendo la del audio.

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
npm run render   # exporta out/exportador-habitual.mp4 (CRF 16, máster)
```

Si Remotion no puede descargar su navegador, añade `--browser-executable=/ruta/a/chrome-headless-shell`.

`src/energy.json` es la energía del audio por fotograma; `public/grain*.png` es la textura de grano. Montserrat (SIL OFL 1.1) va en `public/fonts`.

> La transcripción se hizo automáticamente. Si alguna cifra o palabra del audio difiere de lo que aparece en pantalla, el texto se edita en `src/scenes.tsx`.
