# Plantilla Mailchimp · Informativos MHORIZON

`mhorizon-informativo.html` replica el formato actual de los informativos con la identidad del rebranding 2026
(Azul Corporativo `#171E27`, Ámbar Horizonte `#D4681C`, Gris Técnico `#F4F5F7`, tipografía Inter).

Estructura: imagen del informativo (660 px) → botones **Descargar PDF** / **Sitio web** → isotipo → redes → **Suscribirme** → footer legal.

## Importar en Mailchimp
1. Plantillas de correo electrónico → **Programa tu propia plantilla** → **Importar HTML** → subir `mhorizon-informativo.html`.
2. El archivo ya incluye `*|UNSUB|*` y la dirección legal (`*|HTML:LIST_ADDRESS_HTML|*`), requeridos por Mailchimp.

## Uso en cada envío
Zonas editables (`mc:edit`): `informativo` (imagen), `btn_pdf`, `btn_web`, `btn_suscribir`.
- Reemplazar la imagen por el informativo exportado a **1320 px de ancho** (se muestra a 660 px).
- Cambiar el enlace del botón **Descargar PDF** al PDF de cada informativo.

## Pendientes de verificar
- URLs de Facebook, X y LinkedIn (marcadas `VERIFICAR` en el HTML).
- Enlace de **Suscribirme** y **Descargar PDF** (por defecto apuntan a `https://www.mhorizon.com.ec`).

## Imágenes (`assets/`)
Las imágenes se cargan desde este repositorio (`raw.githubusercontent.com`). Para mayor estabilidad, súbelas a
Mailchimp (Contenido → Subir) y reemplaza la URL base en el HTML:
`https://raw.githubusercontent.com/richardcastro7899-art/Richard_cl/claude/lucid-heisenberg-0sdcsl/mailchimp-template/assets/`

| Archivo | Tamaño | Uso |
|---|---|---|
| `isotipo.png` | 240×240 (se muestra a 120) | Isotipo versión fondo claro |
| `icon-*.png` | 80×80 (se muestran a 40) | Redes sociales |
| `informativo-placeholder.png` | 1320×1520 | Marcador de posición del informativo |
