/* ======================  ÁNIMOS DE SACHA  ====================== */
var MOODS={
 alegre:{img:'saluda',em:null,an:'sway',t:'Alegre',use:'Bienvenida y saludos.'},
 guino:{img:'guino',em:'sparkle',an:'sway',t:'Cómplice',use:'Datos curiosos y consejos rápidos.'},
 gracias:{img:'feliz',em:'hearts',an:'bob',t:'Agradecida',use:'Después de donar, reportar o compartir.'},
 curiosa:{img:'mira',em:'question',an:'sway',t:'Curiosa',use:'Preguntas, búsqueda y «¿sabías que…?».'},
 alerta:{img:'frente',em:'exclam',an:'shake',t:'Alerta',use:'Urgente y advertencias.'},
 triste:{img:'donar',em:'tear',an:'droop',t:'Necesita ayuda',use:'Falta de fondos y pedidos de apoyo.'},
 cuidadora:{img:'rescate',em:'hearts',an:'bob',t:'Cuidadora',use:'Rescate, cuidado y rehabilitación.'},
 orgullosa:{img:'dato',em:'sparkle',an:'sway',t:'Orgullosa',use:'Logros, liberaciones y buenas noticias.'},
 dormida:{img:'dormida',em:'zzz',an:'breathe',t:'Descansa',use:'Cargando o sin contenido por ahora.'},
 explora:{img:'espalda',em:'paws',an:'sway',t:'Se va a explorar',use:'Despedidas y «sigue bajando».'}
};
var EMOTES={
 hearts:'<g class="i"><path transform="translate(8 40) scale(.3)" d="M50 88C10 60 8 28 30 22 42 19 50 28 50 34 50 28 58 19 70 22 92 28 90 60 50 88Z" fill="#D17A5B"/></g><g class="i"><path transform="translate(52 6) scale(.42)" d="M50 88C10 60 8 28 30 22 42 19 50 28 50 34 50 28 58 19 70 22 92 28 90 60 50 88Z" fill="#D17A5B"/></g><g class="i"><path transform="translate(34 50) scale(.24)" d="M50 88C10 60 8 28 30 22 42 19 50 28 50 34 50 28 58 19 70 22 92 28 90 60 50 88Z" fill="#D9B97A"/></g>',
 exclam:'<g class="i"><path d="M50 4L59 24 79 12 75 35 97 40 79 54 93 72 70 70 66 93 50 77 34 93 30 70 7 72 21 54 3 40 25 35 21 12 41 24Z" fill="#D17A5B"/><rect x="44" y="28" width="12" height="28" rx="6" fill="#F4EFE6"/><circle cx="50" cy="68" r="7" fill="#F4EFE6"/></g>',
 question:'<g class="i"><circle cx="50" cy="50" r="46" fill="#D9B97A"/><text x="50" y="72" text-anchor="middle" font-family="var(--font-display)" font-weight="800" font-size="70" fill="#3F5A4F">?</text></g>',
 sparkle:'<g class="i"><path transform="translate(40 4) scale(.5)" d="M50 0L58 42 100 50 58 58 50 100 42 58 0 50 42 42Z" fill="#D9B97A"/></g><g class="i"><path transform="translate(4 38) scale(.3)" d="M50 0L58 42 100 50 58 58 50 100 42 58 0 50 42 42Z" fill="#AF7409"/></g><g class="i"><path transform="translate(66 50) scale(.26)" d="M50 0L58 42 100 50 58 58 50 100 42 58 0 50 42 42Z" fill="#D17A5B"/></g>',
 tear:'<g class="i"><path d="M50 4C50 4 20 44 20 66a30 30 0 0 0 60 0C80 44 50 4 50 4Z" fill="#C5FFE6" stroke="#3F5A4F" stroke-width="5"/></g>',
 zzz:'<g class="i"><text x="4" y="94" font-family="var(--font-display)" font-weight="800" font-size="46" fill="#AF7409">z</text></g><g class="i"><text x="34" y="62" font-family="var(--font-display)" font-weight="800" font-size="36" fill="#D9B97A">z</text></g><g class="i"><text x="62" y="34" font-family="var(--font-display)" font-weight="800" font-size="28" fill="#3F5A4F">z</text></g>',
 paws:'<g class="i"><g fill="#3F5A4F"><circle cx="14" cy="60" r="7"/><circle cx="26" cy="46" r="5.5"/><circle cx="38" cy="46" r="5.5"/><circle cx="48" cy="60" r="7"/><path d="M20 76c0-10 8-16 14-16s14 6 14 16c0 6-8 8-14 8s-14-2-14-8z"/></g></g><g class="i"><g fill="#3F5A4F" transform="translate(60 -8) scale(.8)"><circle cx="14" cy="60" r="7"/><circle cx="26" cy="46" r="5.5"/><circle cx="38" cy="46" r="5.5"/><circle cx="48" cy="60" r="7"/><path d="M20 76c0-10 8-16 14-16s14 6 14 16c0 6-8 8-14 8s-14-2-14-8z"/></g></g>'
};
/* Devuelve el HTML de la figura: sacha('alerta',{h:'220px',label:'…'}) */
function sacha(mood,o){o=o||{};var m=MOODS[mood]||MOODS.alegre,h=o.h?' style="--h:'+o.h+'"':'';
  return '<span class="sx a-'+m.an+'"'+h+' data-mood="'+mood+'"><img src="assets/mascot/sacha-'+m.img.replace('saluda','saluda')+'.webp" alt="'+(o.alt===undefined?('Sacha, '+m.t.toLowerCase()):o.alt)+'" loading="'+(o.eager?'eager':'lazy')+'">'+(m.em?'<span class="em '+m.em+'" aria-hidden="true"><svg viewBox="0 0 100 100">'+EMOTES[m.em]+'</svg></span>':'')+'</span>'}
