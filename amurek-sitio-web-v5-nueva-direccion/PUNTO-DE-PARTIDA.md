# AMUREK v5 — nueva dirección de arte

Esta carpeta es una COPIA de `amurek-sitio-web-v4` (versión v54, la aprobada). Se trabaja aquí; v3 y v4 no se tocan.

## Qué se conserva (ya aprobado)
- Estructura de páginas, textos y secciones: Inicio, Servicios, Proyectos, Nosotros, Contacto, legales y 404.
- Funcionamiento: animaciones siempre activas, menú, aviso de cookies, SEO, rendimiento.
- Datos: correo, redes y WhatsApp (en `CONFIG` de `main.js`); dominio en `SITE` de `build.mjs`.
- Reglas del cliente: sin numeración (01, 02…), una sola forma de etiqueta, sin fotos de clientes en testimonios,
  sin enlace al portafolio personal, páginas abren siempre arriba.

## Qué cambia
- Solo la dirección de arte: paleta, tipografía, formas, ritmo, composición de secciones.

## Cómo se trabaja
- Editar `src/*.html`, `build.mjs`, `styles.css` y `main.js`; regenerar con `node build.mjs`.
- Ver en local: `node serve.mjs 5195` y abrir http://localhost:5195/index.html
- Zip para Cloudflare: CSS y JS comprimidos con esbuild (ver `AUDITORIA.md`, sección v54).
