# Plantilla Mailchimp · Informativo MHORIZON CHECK

`mhorizon-informativo.html` es un informativo completo en HTML con **texto real y editable** (sin imagen incrustada),
diseñado con el manual de marca Rebranding 2026: Azul Corporativo `#171E27`, Ámbar Horizonte `#D4681C`,
Blanco `#FFFFFF`, Gris Técnico `#F4F5F7`; tipografías Plus Jakarta Sans (títulos) e Inter (cuerpos).

## Estructura (pensada para que se lea hasta el final)
1. **Cabecera** oscura con el logotipo oficial y la etiqueta CHECK.
2. **Hero**: marco normativo, fecha, título de alto impacto (con la frase clave en ámbar), norma y tiempo de lectura.
3. **Lo esencial**: resumen de una frase para quien solo lee 10 segundos.
4. **Texto** con las ideas clave en negrita.
5. **Tarjetas** con cifra destacada (condiciones a observar).
6. **Atención**: caja oscura para la advertencia principal.
7. **Descargar PDF / Sitio web**.
8. **Banda de asesoría**: contacto con íconos y botón *Agendar asesoría*.
9. **Pie**: isotipo, redes, *Suscribirme* (para correos reenviados) y legal.

## Importar en Mailchimp
Plantillas de correo electrónico → **Programa tu propia plantilla** → **Importar HTML** → subir `mhorizon-informativo.html`.
Incluye `*|UNSUB|*`, `*|UPDATE_PROFILE|*`, `*|FORWARD|*`, `*|ARCHIVE|*` y la dirección legal de la audiencia.

## Zonas editables (`mc:edit`)
`fecha`, `ley`, `titulo`, `chip_norma`, `lead`, `cuerpo`, `card1`, `card2`, `atencion`, `cta_texto`,
`btn_pdf`, `btn_web`, `asesoria_texto`, `btn_asesoria`, `btn_suscribir`.
Para el título, la frase en ámbar es un `<span style="color:#D4681C">`; en el editor basta con aplicar ese color.

## Pendientes de verificar
- URLs de Facebook, X y LinkedIn (comentario `VERIFICAR` en el HTML).
- Enlaces de **Descargar PDF**, **Suscribirme** y **Sitio web** (por defecto `https://www.mhorizon.com.ec`).
- El texto de ejemplo (resumen, CTA y asesoría) es propuesta editorial: ajustarlo a cada informativo.

## Imágenes (`assets/`)
Se cargan desde este repositorio (`raw.githubusercontent.com`). Para mayor estabilidad, súbelas a Mailchimp
(Contenido) y reemplaza la URL base en el HTML:
`https://raw.githubusercontent.com/richardcastro7899-art/Richard_cl/claude/lucid-heisenberg-0sdcsl/mailchimp-template/assets/`

| Archivo | Uso |
|---|---|
| `logo-mhorizon-blanco.png`, `isotipo-oscuro.png`, `isotipo-claro.png` | Logo oficial extraído del manual de marca (fondo transparente) |
| `hero-anillo.png` | Fondo del hero (anillo ámbar sobre `#171E27`) |
| `ct-*.png`, `icon-alerta.png` | Íconos de contacto y de atención |
| `icon-facebook/instagram/x/linkedin/web.png` | Redes sociales |
