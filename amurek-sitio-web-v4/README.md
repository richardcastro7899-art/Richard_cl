# AMUREK · Sitio web — versión 4 (propuesta v47)

## v47 — servicios en pantallas bajas y cierre presente; testimonios en panel vino
- **Servicios en portátiles de 768 px o menos de alto**: encabezado compacto (titular en dos líneas, menos relleno) para que cada servicio quepa entero con sus botones. Probado en 1350×640 (MacBook Air 11").
- **Foco que acompaña el avance**: el resaltado va del primer servicio (al entrar) a la tarjeta de cierre (al salir), así el cierre se ve iluminado. El cierre es más ancho, recuerda los cinco servicios y se sostiene más tiempo (38 % de una pantalla).
- **Testimonios**: panel vino de marca con tarjetas crema; se distingue de reels y equipo (claros) y de servicios y planes (oscuros).



## v46 — servicios en pista horizontal y testimonios minimalistas
- **Servicios**: el panel queda fijo y la pista de servicios avanza en horizontal, de forma continua, con el scroll (`SERVICES_PANEL` en `build.mjs`, bloque «v46 · SERVICIOS» en `main.js`). El servicio en foco se ilumina; los vecinos se atenúan y su imagen se desplaza en sentido contrario. Cada servicio lleva dentro su botón «Cotizar …» y el enlace «Qué incluye». Al final, una tarjeta «¿Necesitas más de uno?» se sostiene antes de soltar el panel. Arriba a la derecha, el nombre del servicio activo y una barra de avance. El alto de la sección lo calcula `main.js` según el largo de la pista.
- **Testimonios**: sin panel oscuro. Carrusel lento de tarjetas claras sobre el fondo de la página (cita, nombre, cargo · empresa), con pausa al pasar el puntero; cifras debajo en una línea sobria.
- Reemplaza servicios y testimonios de v45. Proceso y menú de celular: como antes.



## v45 — servicios guiados por el scroll y testimonios sin fotos
- **Servicios**: el panel queda fijo mientras se baja y los servicios cambian uno a uno; la imagen nueva sube cubriendo la anterior y el texto cambia con un fundido. A la izquierda, titular, lista de servicios (sin números; marca el activo y se puede tocar) y barra de avance. El último servicio se sostiene un tramo antes de soltar el panel. Alto de la sección: una pantalla + 62svh por servicio (55svh en celular). Reemplaza las tarjetas de v44.
- **Testimonios**: sin fotos. Comillas grandes de marca como elemento gráfico, cita en grande, nombre y cargo · empresa, controles y cifras.
- Proceso y menú de celular: como en v44.



## v44 — segunda propuesta de servicios y testimonios; proceso refinado
- **Servicios**: etiqueta + titular de marca («Todo lo que tu marca necesita, en un solo equipo.») + texto y botón; debajo, cinco tarjetas con imagen: dos grandes (Branding, Audiovisual) y tres pequeñas, con número, nombre, descripción y etiquetas siempre bajo la imagen. En celular, lista compacta con miniatura. Reemplaza el índice con imagen flotante de v43.
- **Testimonios**: retrato grande del cliente a la izquierda (cambia con cada testimonio) y, a la derecha, titular, cita destacada, controles y cifras. Retratos: `PORT` en `build.mjs`.
- **Proceso**: en la columna fija, la etapa activa muestra su descripción; las tarjetas quedan con una etiqueta y la escena, sin repetir el título, y son más bajas.



Copia de `../amurek-sitio-web-v3/` con cuatro piezas rediseñadas; v3 no se toca. Estilos: bloque «v43» al final de `styles.css`; interacciones: bloques «v43» en `main.js`; marcado: `SERVICES_PANEL`, `PROCESS`, `TESTI` y el menú en `build.mjs`.
- **Ritmo del inicio**: oscuro y claro alternados. Proceso pasa a claro para no quedar pegado a Servicios (oscuro).
- **Servicios**: índice editorial (número, nombre, descripción, flecha). Al pasar el puntero, la fila se llena de vino y la imagen del servicio sigue al cursor. En celular, todo visible con una miniatura.
- **Proceso**: etapas fijas a la izquierda con barra de avance; a la derecha, tarjetas claras con las escenas (chat, brief, fotos), que se animan al llegar. También en la página Servicios.
- **Testimonios**: una voz a la vez en grande, con barras de tiempo (6,5 s), flechas y pausa con el puntero encima; cifras debajo, separadas por líneas.
- **Menú de celular**: hoja clara que baja desde la barra, con enlaces medianos, la página actual en vino, el botón y el correo al pie; se cierra al tocar fuera.

---

# AMUREK · Sitio web — versión 3 (v37)

Base: la primera entrega de v3 (la que gustó). Los cambios de v36 (botón para pausar animaciones, sección «Nuestra marca», bloques que suben) se retiraron; siguen en el historial de git.

## v37 — qué cambió sobre la primera entrega
- **Animaciones siempre activas**: el sitio ya no lee el ajuste «reducir movimiento» del dispositivo ni guarda una preferencia para pausarlas. No hay botón ni regla que las apague. (Solo queda `?still` en la dirección, para tomar capturas.)
- **Fluidez**: sin desenfoques de fondo (`backdrop-filter`); los títulos aparecen sin desenfoque por palabra; los carruseles difuminan sus bordes con una franja de color en vez de una máscara; las animaciones en bucle de una sección se detienen cuando la sección sale de pantalla (`.is-off`); las escenas con scroll (proyectos, equipo, showreel) solo calculan cuando están cerca de la pantalla; la barra no recalcula si no cambia; imágenes con `decoding="async"`.
- **Nosotros**: «Nuestro Estudio» en texto oscuro normal (sin letras animadas). La animación del logotipo ocupa todo el ancho de su sección, se reproduce sola al pasar por ahí, en bucle y sin controles.
- **Proyectos**: se quitó el enlace al portafolio personal.
- **Inicio → testimonios**: vuelve el carrusel (con sus cifras dentro del panel), con las medidas y colores del sistema.
- **Inicio → equipo**: la misma animación de Nosotros (los retratos flotan alrededor del título y se acomodan en fila), con el botón «Conoce al equipo».
- **Barra del inicio**: vuelve a medir cuando terminan de cargar las tipografías, para que el logotipo llegue a su lugar sin cruzarse con la portada.
- **Se conservan** las correcciones de tablet y celular: pestaña activa de Servicios legible, tarjetas de Proyectos que no tapan el texto, «©2026 / Showreel» sin cortarse, sin scroll lateral.

## v42 — logo visible con el menú abierto y reels más ágiles
- Con el menú abierto la barra queda transparente sobre el panel oscuro. En el inicio, el fondo claro de la barra (`.is-bg`) se quedaba encima y el logotipo crema no se veía; «Agencia Creativa» también se aclaró.
- Reels en celular: cambian cada 2,6 s (antes 4,5 s); tras deslizar con el dedo, el avance automático espera 3,5 s.

## v41 — celular: reels, menú y servicios
- **Reels**: carrusel de un reel a la vez, entero a la vista, con puntos de posición; avanza solo cada 4,5 s mientras está en pantalla y se puede deslizar con el dedo.
- **Menú**: panel de marca con número, nombre grande, una línea de descripción y una foto por sección; la página actual en rosa; botón «Cotiza tu proyecto» y correo al pie; entrada escalonada. En pantallas bajas se compacta y se puede desplazar. Textos y fotos: `MENU_DESC` y `MENU_IMG` en `build.mjs`.
- **Servicios (inicio)**: los cinco servicios visibles a la vez (en dos filas, sin barra que recorrer) y la descripción debajo de la imagen, ya no encima.
- El escritorio no cambia: todo va en `@media (max-width:900px)`, salvo el menú, que solo se usa en pantallas pequeñas.

## v40 — celular y tablet con el mismo impacto que el escritorio
Todo va dentro de `@media (max-width:900px)` al final de `styles.css`: el escritorio no cambia.
- Escala tipográfica propia del celular: titulares grandes y apretados (antes se encogían a la mitad).
- Portada: titular más grande y los dos botones («Cotiza tu proyecto» y «Ver proyectos»).
- Servicios (inicio): pestañas de tamaño de botón (antes, pastillas de 30 px que se salían de la pantalla).
- Testimonios: tarjetas más anchas que se leen enteras; cifras con numerales grandes.
- Nosotros: «Nuestro / Estudio» en grande, en dos líneas, con la foto debajo a todo el ancho; la animación del logotipo de borde a borde y completa.
- Botón flotante «Cotiza tu proyecto»: se esconde al bajar y aparece al subir, para no tapar lo que se lee.
- Escritorio: el humo de la portada ya no se pausa al hacer scroll (se quitó la pausa de v39).

## v39 — barra del inicio fluida
Medido con la CPU 6× más lenta (recorrido de la barra, 1366×768): **68,6 ms → 18,3 ms por fotograma**; fotogramas lentos (>33 ms) 17 de 17 → 1 de 17; trabajo del hilo principal 559 → 213 ms.
- **Causa principal**: las luces del fondo de la portada (`.hs__glow`) tenían `filter: blur(90px)` sobre capas enormes; era lo más caro de pintar al hacer scroll. Ya son degradados suaves, así que se quitó el filtro (también en `.cta3__g`, `.svc4__glow`, `.aboutg__grad` y el proceso antiguo) sin cambiar el aspecto.
- **Animación por transform**: el logotipo y las palabras vuelan con `translate` + `scale` (antes cambiaban ancho y tamaño de letra en cada cuadro, lo que obligaba a medir y repintar). En Chrome y Edge la anima el compositor con una línea de tiempo de scroll en CSS (`animation-timeline: scroll()`): sigue el scroll al instante aunque la página esté ocupada. En los demás navegadores se calcula un transform por cuadro (misma animación).
- **Apariciones de la barra** (enlaces, botón, fondo, separador): transiciones de tiempo disparadas por clases (`.is-on`, `.is-bg`) en vez de recalcular estilos en cada cuadro del scroll.
- **El humo de la portada (WebGL)** se detiene mientras se hace scroll y se reanuda al parar; así la GPU queda libre para la barra.
- **Sin choques**: en 1920, 1440, 1280, 1024, 768 y 390 px el logotipo y las palabras quedan siempre ≥19 px por encima del panel de la portada y no se cruzan entre sí. En tablet y celular las palabras no vuelan: el texto de la barra aparece con un fundido cuando el logotipo ya llegó.

## v38 — cada página abre en su inicio
Al cambiar de página, la nueva se quedaba en la posición de scroll de la anterior (pasaba cuando el scroll lo hace el visor que contiene la página, como una vista previa en un iframe). Ahora el navegador no restaura la posición (`history.scrollRestoration = "manual"` en el arranque de `build.mjs` y en `main.js`) y cada página se lleva a su inicio al cargar (`scrollTo(0, 0)` + `scrollIntoView`, que también sube los contenedores). Si la dirección trae un `#ancla`, se respeta el ancla.

## Publicar en Cloudflare Pages
Subida directa del .zip: `index.html` en la raíz, sin carpeta contenedora. Incluye todo el sitio, `assets/ref` completo y un `_headers` con caché (tipografías 1 año, medios 7 días, páginas/CSS/JS siempre revalidados). El código fuente de trabajo (`build.mjs`, `src/`, etc.) no va en el .zip porque no hace falta para publicar.

## Material de referencia (`assets/ref/`)
Ahora **sí está en el repositorio**, por pedido expreso. Son imágenes y videos de las plantillas Alture y Nordic (Webflow): sirven para visualizar y no son de AMUREK. Hay que reemplazarlos por material propio antes de publicar la web.

## Uso
- Editar: `build.mjs` y `src/*.html`; luego `node build.mjs`.
- Ver: `node serve.mjs 5190` → http://localhost:5190

---
Historial anterior:

# AMUREK · Sitio web — versión 3 (la versión anterior, mejorada)

Copia de `../amurek-sitio-web/` (esa carpeta no se toca) con el material de referencia y tres bloques del inicio rediseñados.
Guía visual: Alture y Nordic (Webflow). Una sola tipografía, mismo color y mismas medidas del sistema; sin serif, sin cintas ni sellos.

## Material de referencia (`assets/ref/`)
Imágenes y videos tomados de las plantillas Alture y Nordic, con los mismos nombres de archivo que el sitio ya usaba. Son **solo para visualizar**: no son de AMUREK y hay que reemplazarlos por material propio antes de publicar la web.
- **No están en el repositorio** (es público y `.gitignore` excluye `assets/ref/`). Para verlos en tu equipo, copia dentro de esta carpeta el `assets/ref/` que ya tienes y añade los seis archivos nuevos de los testimonios: `t-retrato.jpg` y `c-1.jpg` … `c-5.jpg` (van en el .zip entregado junto con esta versión).
- Imágenes reducidas a 1600 px como máximo; `trailer-a.mp4` recortado a 14 s.

## Cambios en el inicio (capa «v35» al final de `styles.css`)
- **Portada**: en lugar de «Sigue bajando», una tarjeta «Habla con Richard · Director creativo» que lleva a Contacto (`.hcard`). Solo en escritorio.
- **Testimonios** (`TESTI` en `build.mjs`, `.tst`): un testimonio destacado sobre su retrato y dos más al lado. Flechas para pasar y contador 01 / 06; avanza solo mientras está a la vista y se detiene con el puntero encima. Antes: una fila de tarjetas pequeñas en movimiento.
- **Cifras** (`.nums`): bloque propio después de los testimonios, con numerales grandes sobre la página y una nota al pie. Antes: una fila pequeña dentro del panel de testimonios.

## Uso
- Editar: `build.mjs` y `src/index.html`; luego `node build.mjs`.
- Ver: `node serve.mjs 5190` → http://localhost:5190

---
Historial de la versión anterior:

# AMUREK · Sitio web (v7, estudio en bloques)

Estilo pedido por Richard a partir de dos plantillas de referencia (Alture y Nordic, de Webflow): fondo claro,
tarjetas blancas, paneles oscuros redondeados tipo bento, grotesca grande y etiquetas monoespaciadas.
Se tomó el estilo; el código, los textos y las imágenes son propios de AMUREK.

- Páginas: index, servicios, proyectos, caso-amurek, nosotros, contacto.
- Inicio: nombre gigante + panel con pestañas de servicios · lo que hacemos (carrusel) · proyectos que se apilan ·
  por qué AMUREK (bento) · nosotros · servicios (panel) · showreel que crece con el scroll · reels · cifras ·
  planes · preguntas · cierre con formulario y puntos interactivos · pie con el logotipo gigante.
- Servicios: Branding · Producción audiovisual · Redes y contenido · Marketing digital · Web y software.
- Tipografía: Switzer (titulares, alojada en `assets/fonts`, licencia libre de Fontshare) + Inter (texto) + Roboto Mono (etiquetas).
- Paleta: crema de fondo #F2F0EB, tarjetas #FDFCFA, negro de apoyo #181818, paneles vino casi negro #1E0C15 y
  vino #541D35 como único acento (botones, puntos, números).
- Editar textos: `src/*.html`. Servicios, proyectos, preguntas y entregables: arriba en `build.mjs`. Luego `node build.mjs`.
- Datos de contacto y redes: `CONFIG` al inicio de `main.js` (el correo actual es un marcador).
- Vista previa: `node serve.mjs` → http://localhost:5173 · `?still` desactiva animaciones (capturas).
- Versiones anteriores en `../sitio-web-v1-landing/` … `../sitio-web-v6-sistema/`.

## v8 (réplica de Alture, con medios de referencia)
- Basada en alture-template.webflow.io; portada con video, proyectos que llegan inclinados y se enderezan, bloques "por qué",
  nosotros con degradado de marca, servicios, showreel, reels, testimonios, cifras, planes con vidrio 3D, preguntas con foto, blog y cierre.
- **Medios de referencia** (tomados de las plantillas de Webflow, solo para ver la estética): carpeta `assets/ref/`, testimonios, rostros y
  artículos del blog son marcadores. NO publicar así: reemplazar por material propio y borrar `assets/ref`. Marcados con `ref: true` / `data-placeholder`.
- Backups: `../build.v7.backup.mjs`, `../styles.v7.backup.css`. Capturas con animaciones: `../_ref/cap.mjs`.

## v9 (versión final de diseño: estilo propio)
- Estética de bloques que le gusta a Richard (Alture/Nordic/Aceternity) pero con identidad propia: **sello** (esquina recta abajo a la derecha, tomada del isotipo) en todas las tarjetas, portada sin video ajeno, y el motivo de **las dos piezas del isotipo que se acercan** (portada y cierre).
- Tipografía: Outfit (títulos; su «a» de un piso hace eco del logotipo) + Inter (texto), alojadas en `assets/fonts`. Sin mono ni etiquetas en mayúsculas.
- Efectos (código propio, inspirados en el catálogo de Aceternity): aurora y haces de luz en la portada, rejilla que se revela con el puntero (máscara + @property), texto que se genera palabra a palabra, resplandor y leve inclinación en tarjetas, borde que gira en el botón principal, scroll de servicios con imagen fija, testimonios circulando, enfoque de tarjetas en el blog, meteoros en el cierre.
- Accesibilidad: botón «Pausar animaciones» en el pie (más el ajuste del sistema), contraste AA medido con `../_ref/a11y.mjs`, objetivos táctiles ≥ 24 px.
- Referencias ajenas a reemplazar: `assets/ref/` (fotos/videos de plantillas), testimonios, rostros del equipo, blog y proyectos Aurora/Nómada/Silvestre/Carmín/Flora. `hero.mp4` ya no se usa (se puede borrar).
- Backups: `../build.v8.backup.mjs`, `../styles.v8.backup.css`, `../main.v8.backup.js`.

## v10 (segunda ronda de dirección de arte)
- Sin isotipo repetido (nav, portada, proyectos, cierre): el nav lleva logotipo + separador + «Agencia creativa». Las cuentas/avatares usan una «a».
- Tipografía: **Inter Tight** (titulares, 600–700; punto de la i redondo) + Inter. Textos más grandes y legibles.
- Portada: garabato de tinta generativo en canvas (`.hero2__ink`, código en `main.js`), que se dibuja solo, reacciona al puntero y se ordena al bajar. En modo estático/reducido se pinta una imagen fija. La palabra del lema sigue cambiando.
- Nuevas secciones: franja con la animación del logo (tras la portada), frase corta + tira visual de trabajos, proyectos con leyenda interna, servicios con «qué incluye», proceso con scroll (texto fijo + escenas), cifras dinámicas, equipo (Richard Castro con foto real; el resto son de referencia), planes legibles, preguntas sin imagen, blog con 6 artículos propios de relleno (`blog-*.html`, generados por `build.mjs` desde `POSTS`), cierre sin meteoros y pie con el logotipo completo.
- Para quitar de referencia antes de publicar: `assets/ref/` (incluye ahora fotos de picsum `s*.jpg`), testimonios, equipo (salvo Richard), artículos del blog, proyectos Aurora/Nómada/Silvestre/Carmín/Flora. Ya sin uso: `assets/ref/hero.mp4`, `glass.webp`, `pieza-3d.jpg`.
- Backups: `../build.v9.backup.mjs`, `../styles.v9.backup.css`, `../main.v9.backup.js`. Auditoría: `../_ref/a11y.mjs`.

## v11 (tercera ronda)
- **Portada 3D controlada por el scroll** (`.hs`, WebGL propio en `main.js`, sin librerías): una nube de partículas pasa por 4 escenas —idea suelta, ideas que se conectan, ideas que se conforman, forma— mientras se hace scroll; reacciona al mouse. Sin WebGL o con animaciones pausadas hay un respaldo estático.
- **Nada de AMUREK como ejemplo**: proyectos, reels, tira visual, servicios y proceso usan material de referencia de internet (`assets/ref`). La animación del logo solo aparece en la página Nosotros. Quitados: blog, cifras, caso AMUREK, franja del logo en el inicio (archivados en `../_archivo-v10`).
- **Proyectos sin páginas**: cada proyecto abre un visor (galería con flechas, reproductor de video o enlace a un sitio). Se definen en `PROJECTS` de `build.mjs` (`kind: gallery | video | web`).
- Tipografía: **Inter 600** (la referencia usa BDO Grotesk, de pago; Inter es la alternativa libre más cercana y con punto de la i redondo). Títulos más pequeños y finos que en v10.
- Rehechos: servicios (escena fija con video), proceso (fondos y parallax), planes (oscuro, con precios de referencia «Desde $450 / $650»: CONFIRMAR o cambiar), preguntas (estilo referencia + tarjeta de Richard), cierre con formulario, pie con rótulo en movimiento y logo grande, Nosotros estilo estudio.
- Medios de referencia: fotos de plantillas de Webflow y picsum.photos; videos de las películas abiertas de Blender (Sintel, Tears of Steel; CC BY 3.0, requieren atribución si se publican). Reemplazar todo antes de publicar.
- Fuentes: `assets/fonts/inter-latin(.-ext).woff2` (ya correctas; antes había un archivo equivocado y el navegador usaba Arial).
- Backups: `../build.v10.backup.mjs`, `../styles.v10.backup.css`, `../main.v10.backup.js`.

## v12 (cuarta ronda)
- **Pantalla de carga**: fondo vino con el logotipo que se llena de 0 a 100 % y una cortina que se abre hacia la web (una vez por visita; se omite con «reducir movimiento»). Marcado `#pre`, estilos `.pre*`, lógica al inicio de `main.js`.
- **Portada 3D con sentido**: las partículas ya no forman un planeta. Pasan de nube → hilos → las dos piezas del isotipo separadas → isotipo unido con volumen (medio disco crema + cuarto de disco rosa), que se mece suavemente. Geometría tomada del SVG del isotipo (`R0`, `inside`, `onEdge` en `main.js`).
- **Proceso rehecho** (4 escenas con sentido): chat tipo mensajería con fondo de garabatos (`assets/wa-doodle.svg`), brief con idea central, espacio de trabajo con pestañas (diseño / producción / desarrollo) y lanzamiento (sitio en línea, calendario y medición).
- **Planes sin precios**: «Planes a tu medida», tres modalidades (por proyecto, mensual, anual) y «Cotización a tu medida».
- **Preguntas**: la tarjeta ya no lleva a Richard; usa el isotipo y habla de «el equipo creativo de AMUREK».
- **Pie nuevo** (`.foot4`): sin carrusel de servicios. Frase grande, botón de cotizar, correo con copiar, columnas, hora de Ecuador, volver arriba y logotipo completo cuyas letras suben al llegar.
- **Nosotros estilo estudio**: título «Nuestro [foto] Estudio» con letras que cambian de tipografía (Inter / Instrument Serif cursiva / contorno / vino), equipo que se transforma al hacer scroll (portadas flotando → dirección creativa), lista de miembros, «Así trabajamos» (Briefing, Acción, Resultados) con la animación del logotipo. Fuente nueva: `assets/fonts/instrumentserif-*.woff2` (OFL).
- **Encabezados**: «Trabajo [video] seleccionado», «Servicios [video] creativos» y «Proyectos [video] seleccionados» (inicio). Quitados «(05)» y «2026».
- Backups: `../build.v11.backup.mjs`, `../styles.v11.backup.css`, `../main.v11.backup.js`.

## v13 (quinta ronda — trabajo por partes, empezando por el inicio de la home)
- **Pantalla de carga minimalista**: solo el logotipo (letras que suben), un zoom lento y, al cargar, el logotipo se acerca a la pantalla mientras se abre un disco (con un anillo fino) que deja ver la web. Sin textos ni porcentaje. Lógica al inicio de `main.js`, estilos `.pre*`.
- **Portada 3D de formas sólidas** (three.js, MIT, empaquetado a `assets/hero3d.js`, carga diferida): una esfera (la idea) se conecta con otras formas (toro, cubo, cono, disco y las dos piezas del isotipo), se ordenan en un anillo y al final todo se recoge en el isotipo sólido. Fuente: `hero/hero3d.src.js`; para recompilar: `cd hero && npm install && npm run build`. Si el navegador no tiene WebGL, queda el respaldo `.no-gl`.
- **Tipografías mezcladas**: Inter (titulares), Instrument Serif cursiva (acentos: palabra que cambia en la portada y «forma.») y Roboto Mono (descriptivos: pasos de la portada, etiquetas, números, metadatos). Archivos: `assets/fonts/robotomono-latin.woff2`, `instrumentserif-*.woff2`.
- **«Ideas con forma»**: ahora es una tarjeta (bloque «bento») con titular, descriptivos y un carrusel continuo de 10 tarjetas con título y descripción. Tres copias del grupo = sin huecos en pantallas anchas. Pausa al pasar el mouse.
- Quitados los videos dentro de los títulos («Proyectos seleccionados» y los encabezados de Servicios y Proyectos vuelven a ser texto).
- Para publicar, el `public/` del despliegue debe incluir `assets/hero3d.js`, `assets/wa-doodle.svg` y `assets/fonts/`.
- Backups v12: `../build.v12.backup.mjs`, `../styles.v12.backup.css`, `../main.v12.backup.js`.

## v14 (sexta ronda — correcciones de Richard sobre v13)
- **Fuera el 3D**: se eliminó three.js y `assets/hero3d.js` (pesaba y se sentía lento). La portada ahora es un panel oscuro con **hilos de luz** dibujados en canvas 2D (`.hero4*`, código al final del bloque «PORTADA» de `main.js`): fluyen despacio, se doblan hacia el puntero y se ordenan al bajar. Costo medido: ~15 ms de JavaScript por segundo y 1,4 MB de memoria. Se pausa fuera de pantalla y con «reducir movimiento». Se quitaron los pasos «Idea · Conexión · Orden · Forma» y las 4 escenas con scroll fijo.
- **Tipografía**: se quitó Instrument Serif y todo resaltado de palabras. Quedan Inter (titulares) y Roboto Mono (descriptivos). En Nosotros las letras del título ahora alternan entre Inter, Roboto Mono, contorno y vino.
- **Recortes limpios de imágenes y videos**: las cajas ya no tienen fondo oscuro propio (se asomaba como borde negro al hacer zoom), están aisladas en su propia capa y los carruseles usan degradados en vez de máscaras.
- **Proyectos (inicio)**: escena fija de 4 proyectos; el siguiente aparece como un **cuarto de disco que crece desde la esquina recta** (`.pwork*`, `.pw__*`), con lista lateral en mono y botón que abre el visor.
- **Servicios**: índice en mono, «Ideal para», entregables sobre la imagen y contador `01 / 05`. El video de audiovisual arranca en el segundo 3 (`#t=3`) para no mostrar negro.
- **De la idea al lanzamiento**: 03 y 04 ahora usan fotografías y video reales de referencia (`.mos*`), sin maquetas dibujadas. 01 (chat) y 02 (brief) se mantienen.
- **Showreel**: etiquetas en mono sobre el video y lista de áreas. **Reels**: avatar con el isotipo. **Equipo (inicio)**: tarjeta grande de la dirección + tres tarjetas.
- **Planes → «Cómo trabajamos juntos»**: pestañas (Lanzamiento · Crecimiento · Alianza) con objetivo, ruta, qué incluye, lo que logras y «Pedir propuesta». Sin precios ni «cotización a tu medida».
- **Pie nuevo** (`.foot5*`): sin logotipo gigante; bloque vino con llamada a la acción, tarjetas de páginas/servicios/contacto con hora de Ecuador y barra final con logotipo pequeño.
- Backups v13: `../build.v13.backup.mjs`, `../styles.v13.backup.css`, `../main.v13.backup.js`.

## v15 (séptima ronda — ajustes de Richard sobre v14)
- **Portada con scroll**: se mantiene el giro de hilos de luz y ahora, al bajar (dos pantallas), los 64 hilos se ordenan y **tejen el isotipo** (medio disco crema + cuarto de disco rosa). La palabra que cambia se queda en «forma.» cuando el isotipo está formado. Sigue en canvas 2D (`.hero4*`; ~15 ms de JS por segundo). Con «Pausar animaciones» o «reducir movimiento» no hay scroll fijo ni transformación.
- **Menú**: se quitó el numerito de Proyectos; la página activa va en una píldora suave.
- **«Ideas con forma»**: solo imagen y título; sin etiquetas, números ni descripciones.
- **Servicios**: tarjetas verticales (`.svx`) que se abren al tocar, con teclado o al pasar el puntero (con intención, sin parpadeos). Sin numeración ni etiquetas.
- **De la idea al lanzamiento**: escena fija; con el scroll cambian chat → brief → fotos de «damos forma» → «lanzamos», y al terminar la web se suelta (`.proc__track`). En móvil se ven apiladas.
- **Showreel**: sin etiquetas; título «Ideas en movimiento.».
- **Equipo**: cuatro tarjetas iguales en el inicio; en Nosotros las cuatro personas flotan alrededor del título y se acomodan en una fila del mismo tamaño (sin tarjeta de «director»). Se quitó la lista «Miembros».
- **Planes**: tres tarjetas simples (Lanzamiento, Crecimiento, Alianza) y una invitación a **agendar una reunión** (`contacto.html?reunion=1#form`, que prellena el mensaje). Sin precios.
- **Pie**: fiel a la referencia de Richard (minimalista, oscuro, línea fina arriba, logo y derechos a la izquierda, columnas, nombre gigante casi invisible abajo). La columna «Redes» aparece sola cuando haya URL en `CONFIG.social` de `main.js`. Las páginas legales (privacidad, términos, cookies) no existen todavía.
- **Carga**: ahora se abre como un cuarto de disco desde la esquina inferior derecha, no desde el centro.
- Backups v14: `../build.v14.backup.mjs`, `../styles.v14.backup.css`, `../main.v14.backup.js`.

## v16 (octava ronda — ajustes de Richard sobre v15)
- **Carga**: sin zoom ni apertura circular. Las letras de AMUREK suben y, al estar todo listo, **cinco paneles (una por letra) se levantan de abajo hacia arriba como una cortina**, con el logo subiendo y desvaneciéndose (`.pre__panels`, lógica al inicio de `main.js`).
- **Portada**: los hilos de luz siguen igual; al bajar ya no se alinean en rayas. Ahora las ideas (puntos) viajan y se conectan formando una **red viva** que dibuja el isotipo: nodos que respiran, conexiones, pulsos que viajan de nodo en nodo (como señales), brillo que late y reacción al puntero. Al terminar el scroll, la portada se **disuelve hacia el fondo claro** (`--fd`). Sigue en canvas 2D (~24 ms de JS por segundo).
- **Proyectos**: sin lista ni contador; el siguiente proyecto sube como una cortina sobre el anterior (que se oscurece y se desplaza).
- **Servicios**: se mantienen las tarjetas verticales; ahora cambian solas cada ~6 s con una línea de tiempo, hasta que el usuario toca una o pasa el puntero.
- **De la idea al lanzamiento**: nueva propuesta más dinámica. La palabra de cada paso (Escuchamos, Conectamos, Damos forma, Lanzamos) gira letra por letra, la escena cambia de lado con una pequeña inclinación, el fondo alterna entre claro y vino, y una línea de tiempo se llena. En móvil se ven apiladas.
- **Planes**: nombres que se entienden solos (Por proyecto, Mensual, Anual) con un dibujo del ritmo de cada uno, un botón «Quiero este plan» (prellena el mensaje en el formulario) y la invitación a agendar una reunión. Sin precios.
- **Pie**: sin «Pausar animaciones» (el sitio sigue respetando el ajuste de «reducir movimiento» del sistema) y con columna **Legal**.
- **Páginas legales nuevas** (`privacidad.html`, `terminos.html`, `cookies.html`, fuentes en `src/`): texto base adaptado a Ecuador (Ley Orgánica de Protección de Datos Personales). **Revisar con un abogado y completar razón social, RUC y dirección antes de publicar.** Si se agrega analítica o publicidad, actualizar la política de cookies y pedir consentimiento.
- Backups v15: `../build.v15.backup.mjs`, `../styles.v15.backup.css`, `../main.v15.backup.js`.

## v17 (novena ronda — ajustes de Richard sobre v16)
- **Portada**: se quitó la red neuronal y el difuminado al bajar. Ahora **los mismos hilos de luz se curvan y se acomodan en líneas de contorno** (como un mapa topográfico) que dibujan el isotipo: 22 contornos por pieza más un borde reforzado. No queda ninguna onda atrás. El isotipo respira y destellos de luz recorren sus líneas. Código: `contour()` y el bloque «PORTADA» de `main.js` (~34 ms de JS por segundo).
- **Pie**: el logotipo gigante ahora se ve (opacidad .26) y se difumina hacia abajo hasta desaparecer.
- **Planes**: dos tarjetas, **Por proyecto** y **Mensual** (como en Alture y como suelen vender las agencias; lo anual se arma en una reunión). Sin dibujos encima de los títulos.
- **De la idea al lanzamiento**: las escenas van directo sobre el fondo (sin tarjetas atrás), sin la etiqueta de arriba; los puntos de la línea de tiempo quedan centrados sobre la línea; el fondo del bloque tiene luces que se mueven y una trama de puntos suave.
- **Servicios**: nueva presentación. Lista de nombres grandes; al pasar el puntero aparece una vista previa que sigue al mouse y al tocar se abre el detalle (imagen + texto + botón), como en Alture. Sin numeración ni etiquetas.
- **Cifras**: 4 contadores (+120, +45, 92 %, +300) debajo de los testimonios. **SON DE REFERENCIA**: reemplazar por los reales o quitarlos (`STATS` en `build.mjs`).
- Backups v16: `../build.v16.backup.mjs`, `../styles.v16.backup.css`, `../main.v16.backup.js`.

## v19 (décima ronda — ajustes de Richard sobre v17/v18)
Referencias que Richard señaló: Novix Core (portada y barra), Ridgen (ruleta del equipo), Deluix (pie) y Alture (planes). Lo que no le gustó de las propuestas intermedias (v18) se descartó: barra en píldora, ruleta de nombres, franjas verticales de servicios, planes lineales, portada de hilos.
- **Portada**: ocupa toda la pantalla, de borde a borde (sin tarjeta ni esquinas), como en Novix. **Sin animación de scroll**: baja como una portada normal. El fondo es **humo de luz en WebGL** (un solo plano con un shader propio, sin librerías; bloque «PORTADA» de `main.js`): fluye solo, reacciona un poco al puntero, ~33 cuadros por segundo, baja la resolución sola si el equipo va justo y se detiene al salir de pantalla o con «reducir movimiento» (queda un cuadro fijo). Si el navegador no soporta WebGL queda el fondo vino con resplandores (clase `no-gl`). El isotipo ya no aparece en la portada.
- **Barra de navegación**: la de siempre (logo, «Agencia creativa», enlaces, botón). Solo sobre la portada pierde la franja crema y se ve transparente con letras claras (`.nav.on-hero`).
- **Servicios**: lista fija a la izquierda (nombre + descriptor corto) y detalle a la derecha (imagen, qué es, 4 cosas que incluye y botón). Nada se mueve de lugar ni cambia solo; se elige con el puntero, un toque o las flechas. En móvil la lista pasa a fichas horizontales.
- **Equipo**: mazo de tarjetas. Empieza con Richard; cada ~5 s la tarjeta de arriba vuela y vuelve al fondo y aparece la siguiente (también con puntos, flecha o tocando la tarjeta; pausa con el puntero encima). Aplica en el inicio y en Nosotros (`TEAMW` en `build.mjs`; JS `#tk`).
- **Planes** (estilo Alture): título gigante «Planes» con dos tarjetas de vidrio encima; en lugar del precio, una frase que explica cómo se trabaja («Un proyecto /de inicio a fin», «Cada mes /con tu equipo»), lista con marcas, separador punteado y botón con luz que se mueve. Debajo, la invitación a agendar una reunión. Sin precios.
- **Cierre y pie**: el banner «Empieza tu proyecto con nosotros» va de borde a borde y baja directo al pie sin franjas ni esquinas sueltas. El pie (columnas, correo rápido, redes con iconos cuando haya URL, logotipo gigante que se difumina) no cambió.
- **Proyectos seleccionados**: sin cambios (Richard pidió dejarlos tal cual).
- Backups v17: `../build.v17.backup.mjs`, `../styles.v17.backup.css`, `../main.v17.backup.js`.

## v20 (undécima ronda — ajustes de Richard sobre v19)
- **Portada (referencia: Alture Studio)**: arriba, sobre el fondo crema, un título gigante con el logotipo **amurek®** a la izquierda y «Agencia Creativa» (dos líneas) a la derecha; debajo, el panel redondeado con el humo de luz que Richard ya aprobó, más corto. **No se ve la barra de navegación**: al bajar, el logotipo gigante se encoge y se convierte en el logo de la barra (el mismo elemento se mueve y escala, ver bloque «barra superior» de `main.js`), «Agencia Creativa» se desvanece y la barra se arma sola (franja, línea punteada, etiqueta, enlaces en cascada y botón). Solo en el inicio; con «reducir movimiento» la barra se ve normal. Con el teclado (Tab) la barra aparece completa.
- **Proyectos seleccionados**: tarjeta mediana (no pantalla completa). Al bajar, la siguiente entra deslizándose por encima, ligeramente girada, mientras la anterior se hace a un lado, más pequeña y oscura. Clic en la tarjeta activa abre el visor.
- **De la idea al lanzamiento**: cada escena se abre como un **cuarto de disco** desde la esquina inferior derecha (y la anterior se cierra hacia la superior izquierda); detrás, un **isotipo de línea gira** con el avance (`.proc2__iso`).
- **Reels**: fila en zigzag que se desplaza con el scroll; la tarjeta que pasa por el centro crece y se reproduce sola (solo una a la vez). Clic abre el reproductor con sonido.
- **Equipo** (inicio y Nosotros): las cuatro personas a la vez, en zigzag, con un leve vaivén; al pasar el puntero (o tocar) se enderezan y cuentan qué hacen. Nombre y cargo siempre visibles.
- **Testimonios**: panel oscuro con la frase en grande que se escribe palabra por palabra; seis rostros (forma del isotipo) que cambian la opinión solos o al tocarlos; las cifras (de referencia) quedan debajo.
- **Planes**: el título «Planes» se ve completo y las tarjetas van debajo. Botones iguales al resto del sitio (`.btn`).
- **Botones**: un solo estilo en todo el sitio (píldora con punto: clara sobre oscuro, vino sobre claro). Se reemplazó el botón con luz, el de flecha del cierre y el cuadrado del pie.
- **Cierre y pie**: el banner «Empieza tu proyecto con nosotros» es una tarjeta redondeada propia y el pie es otra pieza aparte, con esquinas redondeadas arriba y una franja de separación.
- Backups v19: `../build.v19.backup.mjs`, `../styles.v19.backup.css`, `../main.v19.backup.js`.

## v22 (duodécima ronda — ajustes de Richard sobre v20/v21)
Richard pidió **terminar primero el inicio y no tocar el contenido de Servicios, Proyectos, Nosotros ni Contacto** hasta entonces. Por eso Nosotros volvió a su equipo original (v17: las cuatro personas flotan y se acomodan en fila). Lo que sí es compartido (barra, pie, cierre, proceso, planes) cambia en todas las páginas.
- **Barra**: se descartaron la píldora, el panel oscuro y la franja. Ahora es una **tarjeta clara flotante** (blanco crema, esquinas con la forma del isotipo, borde finísimo, sombra suave), con enlaces de tinta, un punto vino en la página activa y el botón vino. Al inicio sigue sin verse: el logotipo gigante se redibuja cada vez más pequeño (no se estira, por eso ya no se pixelea) hasta quedar en ella y la tarjeta se abre de izquierda a derecha.
- **Proyectos seleccionados**: tarjetas **todas iguales** en pila 3D. La del frente se recuesta hacia atrás sobre la pila y la siguiente sube desde abajo (`#pwh`, JS «PROYECTOS»). El nombre gigante detrás cambia con cada proyecto.
- **De la idea al lanzamiento**: sin isotipo ni letras de fondo. El fondo es más vivo: tres luces grandes que se mueven despacio y una luz que sigue al puntero (`.proc2__bg`). Se mantiene el revelado en cuarto de disco y la leve inclinación con el puntero.
- **Reels**: solo los principales (4), todos del mismo tamaño, en una fila (se retiraron la lista y el teléfono). Para cambiarlos: `REEL_ITEMS` en `build.mjs`.
- **Testimonios**: vuelve el carrusel sobrio sobre el fondo crema, con las cifras debajo (cifras de referencia).
- **Equipo** (solo inicio): panel blanco con las cuatro tarjetas iguales, rectas, con nombre y cargo; al pasar el puntero (o tocar) aparece qué hace cada persona.
- Backups v21: `../build.v21.backup.mjs`, `../styles.v21.backup.css`, `../main.v21.backup.js`.

## v23 (decimotercera ronda — ajustes de Richard sobre v22)
- **Barra**: pegada al borde superior (ya no flota), contenido centrado en un ancho de 1240 px: logo + «Agencia Creativa» a la izquierda, enlaces centrados con subrayado vino que se dibuja al pasar el puntero (y en la página activa) y el botón vino a la derecha. Una línea vino fina en su borde inferior muestra cuánto se ha leído de la página (`--sp`). En el inicio no se ve: el logotipo gigante y «Agencia Creativa» viajan juntos hasta la barra (dos elementos `.nav__fly` y `.nav__fly2` que se redibujan en cada tamaño: el texto es Inter en dos líneas en ambos sitios, por eso el cambio es continuo).
- **Color del logotipo**: vino de la marca (título gigante y barra); «Agencia Creativa» en tinta oscura. El pie conserva el logo en crema.
- **Proyectos**: el nombre gigante ahora va arriba, sin que lo tapen las tarjetas (aparece subiendo desde una línea). Misma pila 3D de tarjetas iguales.
- **De la idea al lanzamiento (propuesta nueva, solo en el inicio)**: cuatro paneles que se apilan al bajar, cada uno con su color y su escena (conversación, brief, producción, publicación). El siguiente sube por encima y el anterior se encoge y se oscurece, dejando asomar su borde. Fondo vivo con luces que se mueven y se desplazan un poco con el puntero (ya no hay «globo» que lo siga). **La versión anterior (escena fija con la palabra que gira) se conserva en la página de Servicios** (`PROCESS_OLD`) para no tocar esa página.
- **Reels**: los cuatro con la misma jerarquía; ninguno se reproduce solo. Al pasar el puntero (o enfocar con el teclado) se inclina en 3D con un reflejo y se reproduce solo ese; los demás se atenúan. En el teléfono se reproduce el que queda bien a la vista. La entrada es en cascada.
- **Testimonios**: panel vino con dos filas de tarjetas crema que corren en sentidos opuestos (se detienen al pasar el puntero) y las cifras de referencia debajo. Contrasta con los reels (fondo crema) y con el equipo (panel blanco).
- Backups v22: `../build.v22.backup.mjs`, `../styles.v22.backup.css`, `../main.v22.backup.js`.

## v25 (ajustes de Richard sobre v24)
- **Barra**: el logotipo vuelve a ser negro y «Agencia» / «Creativa» van en dos líneas tanto en el título como en la barra; viajan tal cual (sin cambiar de forma). Se eliminaron todas las líneas de avance (barra y proyectos).
- **Proyectos**: texto del proyecto a la izquierda y, a la derecha, la pila 3D de tarjetas iguales, ahora más grandes (hasta 880 × 580 px). Sin nombre gigante.
- **De la idea al lanzamiento (inicio)**: sin línea de tiempo. Los cuatro paneles alternan entre las dos familias de fondo de la web: **claro** (blanco crema con rosa suave) en Escuchamos y Damos forma, y **oscuro** (el mismo de Planes y el cierre) en Conectamos y Lanzamos, para que cada escena resalte (el chat oscuro sobre claro, el brief claro sobre oscuro). Cada escena se abre de una forma: cuarto de disco, cortina desde arriba, cortina desde abajo e iris desde el centro; la palabra y el texto entran por lados distintos.
- **Testimonios**: una sola fila con el fondo oscuro de Planes (separa de los reels y del equipo). Reels y equipo se dejaron como estaban (reels sobre el fondo crema de la página; equipo en panel blanco).
- Backups v24: `../build.v24.backup.mjs`, `../styles.v24.backup.css`, `../main.v24.backup.js`.

## v26 (inicio)
- Testimonios: el carrusel ya no llega de borde a borde del panel; queda con el mismo margen que el título y las cifras, con los extremos difuminados (máscara) y tarjetas de cristal oscuro (casi del color del fondo, borde crema tenue, texto crema).
- Proceso: los paneles claros (Escuchamos y Damos forma) llevan un rosado suave de la marca (#E8D3D8) con borde vino tenue y sombra, para no confundirse con el fondo crema de la página. Los oscuros no cambian.
- Proceso: `.proc2__r .pcard` pasa a `overflow:visible` y los pasos 2 y 3 abren con `inset(-90px …)`, así la sombra del chat y de las tarjetas ya no se corta en línea recta.
- Respaldo de la hoja anterior: `amurek-isotipo/styles.v25.backup.css`.

## v27 (inicio)
- Proceso: se quita el rosado de los paneles claros (a Richard no le gustó). Ahora son gris-crema neutro (`--papel` #E3DFD6, con un degradado suave y un brillo blanco detrás del contenido), con borde y sombra tenues: más oscuros que la página (#F2F0EB), así se separan de ella sin añadir color.
- Respaldo anterior: `amurek-isotipo/styles.v26.backup.css`.

## v28 (inicio)
- Proceso: el gris-crema (v27) seguía confundiéndose con el fondo de la página, así que cambia la presentación: las cuatro escenas viven dentro de un marco oscuro (`.procs`, mismo fondo casi negro de Planes/CTA). Los paneles claros (Escuchamos, Damos forma) son blanco crema limpio sobre el marco; los oscuros (Conectamos, Lanzamos) son vino de marca (#541D35 con degradado), que se separa del marco casi negro. Sin rosado.
- Respaldo anterior: `amurek-isotipo/styles.v27.backup.css`.

## v29 (inicio) — proceso como acordeón
- Richard rechazó el marco oscuro de v28 («parece un problema de la web») y pidió otra presentación atractiva e interactiva. Se reemplaza la pila de paneles por un **acordeón horizontal** (`.pros`, `build.mjs` → `prosTile`/`PROCESS`; `main.js` → bloque «PROCESO (inicio): acordeón»; estilos v29 al final de `styles.css`).
- Cuatro franjas altas directamente sobre la página, sin marco: Escuchamos y Damos forma en vino de marca, Conectamos y Lanzamos en casi negro (alternadas). Cerrada: palabra vertical + botón «+». Abierta: título grande, descripción, botón «Sigue: …» (la última lleva a «Cotiza tu proyecto») y su escena (chat, brief, fotos, lanzamiento).
- Interacción: pasar el puntero con un instante de intención (140 ms), clic/toque, teclado (flechas, Inicio, Fin; `aria-expanded` y `aria-disabled` en la abierta) y botón «Sigue». La escena se vuelve a reproducir cada vez que se abre (clase `is-play`); solo se reproducen los videos de la etapa abierta; ligera inclinación de la escena con el puntero.
- Pantallas ≤1000 px: acordeón vertical (franjas apiladas, la abierta se despliega y se desplaza a la vista).
- Sin movimiento (`.motion-off`/reduce): sin transiciones ni escenas animadas, todo visible.
- Código viejo del apilado (`.procs`, `.proc2.ps`, v22–v28 de ese bloque) queda sin uso en `styles.css` (poda opcional). `PROCESS_OLD` sigue en servicios.html.
- Respaldos: `amurek-isotipo/build.v28.backup.mjs`, `main.v28.backup.js`, `styles.v28.backup.css`.

## v30 (inicio)
- Proceso: el acordeón ahora **avanza con el scroll**. La fila queda fija (`.pros__pin` > `.pros__sticky`, `position:sticky`) y cada tramo de scroll (0,55 × alto de pantalla por etapa) abre la siguiente: Escuchamos → Conectamos → Damos forma → Lanzamos; al terminar la última, la página sigue. Clic en una franja, flechas del teclado o «Sigue: …» llevan el scroll a esa etapa (`go()` con bloqueo para no reabrir las intermedias). Se quita la apertura por hover (se peleaba con el scroll); queda el brillo al pasar.
- En ≤1000 px o con movimiento desactivado no se fija (`.pros--free`): acordeón vertical que se abre con un toque.
- Barra: los enlaces (Inicio…Contacto) aparecen solo al final de la transición del logo (`--np` > 0,78, escalonados), así el logo y «Agencia Creativa» ya no pasan por encima de ellos. La CTA y el menú no cambian.
- Respaldos: `amurek-isotipo/build.v29.backup.mjs`, `main.v29.backup.js`, `styles.v29.backup.css`.

## v31 (inicio) — sistema de coherencia (auditoría medida)
- Auditoría con script (`_ref/audit.mjs`): valores calculados por sección en 1440 y 390. Informe: `amurek-isotipo/auditoria-coherencia-inicio.html`.
- Poda de CSS (`_ref/prune.mjs`): se quitan selectores cuyas clases/ids no aparecen en ninguna página ni en main.js (1358 reglas, 22 keyframes; 251 KB → ~134 KB). Verificado con `_ref/dump.mjs` + `_ref/cmp.cjs` (estilos calculados de las 8 páginas, 1440 y 390): sin diferencias reales.
- Capa v31 al final de `styles.css`, acotada a `[data-page=inicio]` (salvo el pie, compartido): tokens `--edge-pad`, `--edge`, `--panel-py`, `--sec-gap`, `--head-gap`, `--card-gap`, `--r-card`, `--r-card-l`, `--line-l`, `--on-1/2/3`, escala `--t-display … --t-mono`.
- Reglas: paneles = `--sello`; tarjetas = `--r-card` (8 + esquina del isotipo); medios grandes (proyectos, servicios, showreel) = `--r-card-l`. Borde de contenido 51/24 px. Relleno de paneles 64/32. Aire entre secciones 88/56. 12 px entre tarjetas. Un solo negro (#0d0509). Texto crema 100/78/58 %.
- Decisiones de diseño: contorno fino en paneles blancos (estado y equipo) y en Preguntas; etiquetas en mono unificadas y solo donde dan un dato (se oculta «Elige cómo trabajar»); sin números en Preguntas; videos de referencia ampliados 6 % para recortar sus franjas negras.
- Pie (todas las páginas): radio de panel, borde de contenido y campo de correo que ya no se sale en celular.
- Respaldo previo a la poda y al sistema: `amurek-isotipo/styles.v30.backup.css`.

## v32 (inicio)
- Hero: la palabra que cambia (`.hs__word`) pasa a `vertical-align:baseline`; antes quedaba 8 px por encima de la línea base del titular (medido).
- Barra (transición del logo): el logo y las palabras ya no suben por encima de su lugar final en la barra (antes se salían por arriba de la pantalla y se cortaban). «Agencia» y «Creativa» se frenan juntas con el mismo desplazamiento (`lift`) para no montarse. En pantallas ≤900 px, donde van en una línea bajo el logo, se desvanecen al empezar y reaparecen ya en la barra.
- Respaldo: `amurek-isotipo/main.v31.backup.js`.

## v33 (inicio)
- Transición del logo: avanza en línea recta con el scroll y termina exactamente cuando el panel del hero toca la barra (`D = top del panel − alto de la barra`). Así el logo y «Agencia Creativa» nunca quedan encima del panel y no aparece la línea de la barra a mitad del recorrido (el fondo de la barra aparece al final). En celular las palabras se desvanecen y reaparecen en la barra.
- Márgenes: los fondos van de borde a borde con `--inset` (8 px en celular → 16 px en pantallas grandes) y el contenido nunca pasa de 1440 px (`--maxc`), centrado: `--edge = max(inset + edge-pad, (100vw − 1440px)/2)`; `--pad-x` es el relleno lateral de los paneles. Barra, título gigante, texto del hero y todas las secciones empiezan en el mismo borde.
- Esquinas: paneles con las cuatro esquinas iguales (`--sello: var(--r-xl)`); tarjetas de texto (testimonios, planes, preguntas, brief, chat) 14 px simétricas; la esquina del isotipo queda solo en fotos y videos (`--r-card` / `--r-card-l`).
- «Ideas con forma»: todas las tarjetas del mismo tamaño (4:5).

## v34 — un solo sistema en todo el sitio (coherencia de las páginas internas)
El sistema de coherencia del inicio (v31–v33) ahora rige **todas** las páginas: en `styles.css` los selectores `[data-page=inicio]` pasaron a `[data-page]` y se añadió la capa v34 al final para los componentes propios de Servicios, Proyectos, Nosotros, Contacto y legales. El inicio no cambia (verificado midiendo tipografías, radios, bordes y aire antes y después, en 1440 y 390 px).
- **Medidas compartidas** (antes cada página tenía las suyas): borde de contenido 55 px (antes 32 px en las internas y la barra a 130 px), 86 px entre secciones (antes 0–86, y el cierre pegado al pie), paneles con el mismo margen exterior y las cuatro esquinas iguales, tarjetas de texto a 14 px, esquina del isotipo solo en fotos y videos, un solo negro (`--noche`).
- **Tipografía**: misma escala de 9 niveles. Título de página `--t-page` (118 px) en Servicios, Proyectos, legales, «Nuestro Estudio» y la marquesina de Contacto. Etiquetas en mono con un solo estilo.
- **Encabezado de páginas internas** (`PHERO` en `build.mjs`): título, línea y debajo etiqueta a la izquierda («05 servicios · un equipo») + frase a la derecha, como los encabezados del inicio.
- **Servicios**: índice de servicios con las mismas pastillas que los filtros de Proyectos; fichas en mitades iguales; «Ideal para» y su botón siempre en la misma fila; el proceso rosado antiguo (`PROCESS_OLD`) se reemplaza por el acordeón del inicio (`PROCESS`); Planes y Preguntas iguales al inicio (sin etiqueta «Elige cómo trabajamos», sin números).
- **Proyectos**: la tarjeta «Próximo proyecto» había perdido su fondo (texto crema sobre crema, no se leía): vuelve a ser un panel oscuro de marca y cierra la rejilla a todo el ancho.
- **Nosotros**: «Así trabajamos» usa las mismas cuatro etapas del inicio (Escuchamos, Conectamos, Damos forma, Lanzamos) en lugar de Briefing/Acción/Resultados; encabezados con título + frase; equipo y valores con las medidas del sistema; se cambió la línea «Sistema: AMUREK.estudio» por «Cinco servicios, un equipo».
- **Contacto**: dos columnas con la misma partición que Preguntas: a la izquierda qué pasa cuando escribes (frase, tres garantías, correo y base) y a la derecha el formulario. La marquesina se difumina en los bordes.
- **Legales**: frase y texto sobre el mismo eje izquierdo; títulos en el nivel `--t-h4`.
- **Celular**: listas de Servicios en una columna, un solo titular para el equipo en Nosotros.
- Sin uso tras este cambio (poda opcional): estilos de `.proc`/`.proc2` (proceso antiguo). Para volver atrás: `git revert` de este commit.
