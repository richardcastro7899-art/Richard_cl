(function(){
'use strict';

/* ======================  CONTENIDO EDITABLE  ======================
   VIDEOS: ruta del .mp4 de cada pieza (vacío = vista de maqueta). PODCAST: pega el ID de YouTube de cada episodio
   (lo que va después de «v=») y se reproduce incrustado en esta página. NETS: URL de cada red; mientras esté
   vacía, los botones avisan que el enlace está por conectar. */
var VIDEOS={trailer:['assets/video/hero.mp4','assets/video/hero.webm'],caps:['','','','','','','',''],sacha:'',rescate:''};
var MOCK_SECONDS=8, YEAR_COST=350000;
var NETS={
 instagram:{name:'Instagram',ab:'IG',c:'#D17A5B',url:'',handle:'@proyectosacha · por confirmar',what:'El día a día del rescate en fotos y reels.'},
 tiktok:{name:'TikTok',ab:'TT',c:'#24362E',url:'',handle:'@proyectosacha · por confirmar',what:'Las cápsulas cortas: cada capítulo en vertical.'},
 youtube:{name:'YouTube',ab:'YT',c:'#AF7409',url:'',handle:'Canal por confirmar',what:'El podcast completo y los videos largos.'},
 facebook:{name:'Facebook',ab:'FB',c:'#3F5A4F',url:'',handle:'Página por confirmar',what:'Comunidad, avisos de rescate y liberaciones.'}
};
var PODCAST=[{n:1,title:'Tema por definir',guest:'Invitado/a por confirmar',yt:''},{n:2,title:'Tema por definir',guest:'Invitado/a por confirmar',yt:''}];

var NAV=[['Videos','videos'],['Qué hacemos','hacemos'],['Reportar','reportar'],['Nosotros','nosotros'],['Fauna','fauna'],['Prensa','prensa']];
var STATS=[
 {n:2018,plain:true,t:'Año en que nace la fundación, tras el rescate de Sacha en Vinces.',s:'Primicias',u:'https://www.primicias.ec/noticias/tecnologia/sacha-ocelote-espacio-cuidar-fauna-silvestre/',pat:'felino'},
 {n:3500,pre:'+',t:'Animales silvestres y exóticos rescatados, recuperados o reubicados desde 2018 (cifra de inicios de 2023).',s:'Expreso',u:'https://www.expreso.ec/buenavida/proyecto-sacha-apresta-inaugurar-centro-rehabilitacion-fauna-silvestre-147100.html',pat:'manchas'},
 {n:1100,pre:'~',t:'Animales auxiliados solo durante 2022.',s:'Expreso',u:'https://www.expreso.ec/buenavida/proyecto-sacha-apresta-inaugurar-centro-rehabilitacion-fauna-silvestre-147100.html',pat:'selva'},
 {n:350000,pre:'$',t:'Presupuesto anual necesario para operar. Las donaciones hoy no alcanzan.',s:'Fundación Proyecto Sacha',pat:'rayas'}
];
var TABS=[{name:'Convivir',pat:'selva'},{name:'La fundación',pat:'felino'},{name:'El rescate por dentro',pat:'reptil'}];
var CAPS=[
 {tab:0,pre:'Mitos sobre la',title:'zarigüeya',dur:58,desc:'Lo que crees saber y por qué no es una amenaza.',m:'sacha-dato',net:'tiktok'},
 {tab:0,pre:'Encontré una cría:',title:'¿qué hago?',dur:72,desc:'Primeros pasos antes de llamar al equipo.',m:'sacha-rescate',net:'instagram'},
 {tab:0,pre:'Convivir con fauna',title:'en la ciudad',dur:65,desc:'Hábitos simples para coexistir.',m:'sacha-saluda',net:'tiktok'},
 {tab:1,pre:'Todo sobre',title:'quiénes somos',dur:90,desc:'El equipo y lo que nos mueve.',m:'sacha-saluda',net:'instagram'},
 {tab:1,pre:'Un día en',title:'Proyecto Sacha',dur:70,desc:'Turnos, protocolos y cuidado diario.',m:'sacha-dato',net:'tiktok'},
 {tab:2,pre:'Rescate',title:'en campo',dur:100,desc:'Cómo se contiene a un animal sin dañarlo.',m:'sacha-rescate',net:'instagram'},
 {tab:2,pre:'Traslado a',title:'Santa Elena',dur:75,desc:'Logística y cuidados durante el viaje.',m:'sacha-saluda',net:'tiktok'},
 {tab:2,pre:'Rehabilitación',title:'y liberación',dur:85,desc:'El día en que vuelve a su hábitat.',m:'sacha-donar',net:'instagram'}
];
var HVIDS=[
 {id:'sacha',kind:'Video · Historia',pre:'¿Quién es',title:'Sacha?',dur:60,desc:'La historia real detrás del nombre de la fundación, contada por Sacha.',pat:'felino',m:'sacha-saluda',net:'youtube'},
 {id:'trailer',kind:'Tráiler',pre:'Todos los días',title:'los ves',dur:14,desc:'Avance de la serie. Es una imagen de referencia: se reemplaza por material propio de la fundación.',src:'trailer',net:'youtube'},
 {id:'rescate',kind:'Video · Reportaje',pre:'Un rescate,',title:'de principio a fin',dur:200,desc:'Del aviso a la liberación: lo que ocurre con un animal desde que llega.',pat:'reptil',m:'sacha-rescate',net:'youtube'}
];
var SITS=[
 {id:'herido',ic:'i-med',c:'#D17A5B',title:'Está herido o en peligro',sub:'Atropellado, atrapado, sangrando o con dificultad para moverse.',urg:'Urgente · avisa ya',
  do:['Mantén la distancia y no lo persigas: el estrés puede empeorar sus lesiones.','Aleja a perros, gatos y niños, y baja el ruido.','Toma una foto o un video corto desde lejos y anota la ubicación exacta.','Avisa al equipo de inmediato. Si te lo indican, cúbrelo con una tela y déjalo en una caja ventilada, oscura y tranquila.'],
  dont:['No le des comida, agua ni leche.','No lo cargues con las manos desnudas: por miedo puede morder o arañar.','No lo lleves a casa ni intentes curarlo.','No lo traslades por tu cuenta sin la indicación del equipo.']},
 {id:'cria',ic:'i-baby',c:'#AF7409',title:'Es una cría y está sola',sub:'Sin pelo o plumas completas, o llorando, y no ves a la madre.',urg:'Prioritario',
  do:['Obsérvala desde lejos un buen rato: su madre puede estar cerca y no se acerca si hay personas.','Aleja a perros, gatos y niños, y evita los ruidos.','Si está en peligro inmediato (calle, lluvia, depredadores), avisa de inmediato.','Toma una foto y anota la hora, el lugar y cuántas crías hay.'],
  dont:['No la alimentes: ni leche, ni agua, ni comida de mascotas.','No la tomes en brazos ni la lleves a casa: muchas veces no está abandonada.','No la conviertas en mascota: la tenencia de fauna silvestre está regulada por ley.']},
 {id:'casa',ic:'i-home',c:'#3F5A4F',title:'Entró a mi casa, patio o techo',sub:'Está en un lugar donde no debería estar.',urg:'Evalúa con calma',
  do:['Dale espacio: casi siempre quiere salir tanto como tú quieres que salga.','Encierra a las mascotas y saca a los niños de la habitación.','Abre puertas o ventanas hacia el exterior, baja el ruido y deja un camino libre.','Si no sale por su cuenta, toma una foto desde lejos y avisa al equipo.'],
  dont:['No lo acorrales ni lo golpees.','No uses insecticidas, humo ni trampas de pegamento.','No lo agarres con las manos.']},
 {id:'trafico',ic:'i-cart',c:'#24362E',title:'Alguien lo tiene o lo vende',sub:'Está en una casa, un local o un anuncio como mascota o producto.',urg:'Denuncia',
  do:['Cuida tu seguridad: no confrontes a la persona.','Si puedes sin riesgo, guarda fotos o capturas: enlace del anuncio, lugar y fecha.','Reporta con los datos que tengas. La fundación informa a la Unidad de Policía de Medio Ambiente y al Ministerio del Ambiente.'],
  dont:['No compres al animal: comprar alimenta el tráfico.','No intentes quitárselo a la persona.','No publiques datos de la persona antes de reportar.']}
];
var ANIS=[
 {id:'mamifero',ic:'i-paw',c:'#AF7409',title:'Mamífero',eg:'zarigüeya, ardilla, murciélago',do:['Si es una zarigüeya, casi siempre se aleja sola de noche: déjale un camino libre hacia afuera.'],dont:['No la mates: es inofensiva para las personas.']},
 {id:'ave',ic:'i-leaf',c:'#3F5A4F',title:'Ave',eg:'garrapatero, lechuza, loro',do:['Si tiene plumas y salta, sus padres suelen cuidarla desde cerca; si no tiene plumas o está herida, avisa.'],dont:['No le des agua con jeringa ni pan: puede ahogarse.']},
 {id:'reptil',ic:'i-alert',c:'#D17A5B',title:'Reptil',eg:'iguana, serpiente, cocodrilo, tortuga',danger:true,do:['Si es una serpiente, mantente a distancia y no la pierdas de vista hasta que llegue el equipo.'],dont:['No intentes capturar ni matar a una serpiente: no puedes saber si es venenosa.','No te acerques a un cocodrilo ni a la orilla donde está.']},
 {id:'grande',ic:'i-paw',c:'#24362E',title:'Animal grande',eg:'felino, venado, mono, oso hormiguero',danger:true,do:['Aléjate sin darle la espalda ni correr, y mantén lejos a otras personas.'],dont:['No intentes tocarlo ni acorralarlo: un animal asustado puede defenderse.']},
 {id:'nose',ic:'i-info',c:'#AF7409',title:'No sé qué es',eg:'una foto desde lejos ayuda a identificarlo',do:['No hace falta saberlo: una foto desde lejos ayuda al equipo a identificarlo.'],dont:[]}
];
var NUMS=[{k:'ECU 911',v:'911',note:'Emergencias: riesgo para personas o un animal peligroso en la vía pública.'},{k:'Línea de la fundación',v:'',note:'Número de reportes por definir.'}];
var STEPS=[
 {pat:'felino',title:'Recepción médica',icon:'i-med',who:'Equipo veterinario',text:'Evaluación clínica inmediata y estabilización. Reciben los mismos exámenes que un perro o un gato, porque necesitan los mismos cuidados.',cap:8},
 {pat:'manchas',title:'Gestión legal',icon:'i-doc',who:'Ministerio del Ambiente · Policía de Medio Ambiente',text:'Cada ingreso se informa a la autoridad ambiental y la liberación se coordina con ella.',cap:6},
 {pat:'selva',title:'Logística y traslado',icon:'i-truck',who:'Guayaquil → Santa Elena',text:'Vehículos, combustible y personal para llevar al animal al centro rural. Mientras espera, sigue necesitando cuidados.',cap:7},
 {pat:'rayas',title:'Rehabilitación y liberación',icon:'i-leaf',who:'Centro rural · Santa Elena',text:'Cuidado prolongado, a veces durante meses, hasta devolverlo a su hábitat.',cap:8}
];
var ALLIES=['Ministerio del Ambiente','Unidad de Policía de Medio Ambiente','Universidades, por convenio'];
var STORY=[
 'Sacha, una cría de ocelote de unos diez días de vida, llegó en junio de 2018 a manos de la Dra. Eliana Molineros. Estaba a la venta en una tienda de Vinces, en poder de traficantes de fauna silvestre.',
 'No pudo regresar a su hábitat, pero su historia dio origen a la Fundación Proyecto Sacha, que hoy rehabilita fauna del Guayas y la devuelve a su medio.'
];
var STORY_SRC=[['Vistazo','https://www.vistazo.com/estilo-de-vida/sostenibilidad/sacha-el-ocelote-que-no-pudo-regresar-a-su-habitat-pero-inspiro-un-enorme-proyecto-CE1336316'],['Primicias','https://www.primicias.ec/noticias/tecnologia/sacha-ocelote-espacio-cuidar-fauna-silvestre/']];
var TL=[['Jun. 2018','Sacha llega desde Vinces, rescatada del tráfico de fauna.','Vistazo · Primicias'],['2022','Unos 1.100 animales auxiliados solo en ese año.','Expreso'],['Inicios de 2023','Más de 3.500 animales rescatados, recuperados o reubicados desde 2018.','Expreso'],['Proyectado','Centro de rehabilitación en Chanduy, Santa Elena, anunciado como el más grande de la costa. Estado de la obra por confirmar.','Vistazo']];
var SEDES=[
 {n:'01',kind:'Centro urbano',name:'Guayaquil',pin:'Guayaquil',desc:'Recepción médica y rescates urbanos.',pos:[74.17,42.62],dy:-32,q:'Guayaquil, Ecuador'},
 {n:'02',kind:'Centro rural',name:'Santa Elena',pin:'Centro rural',desc:'Rehabilitación y liberación. Ubicación referencial: sector Chanduy.',pos:[54.71,52.0],dy:34,q:'Chanduy, Santa Elena, Ecuador'}
];
var MREF=[{name:'Santa Elena',pos:[17.12,45.11]}];
var FAUNA=[
 {n:'Zarigüeya común',l:'Didelphis marsupialis',g:'Mamífero',ani:'mamifero',t:'Marsupial nocturno que come insectos, frutas, carroña y pequeños animales. Ayuda a controlar plagas y a dispersar semillas. Es inofensiva: que transmita la rabia es un mito.',s:'UTPL',u:'https://noticias.utpl.edu.ec/printpdf/node/3592'},
 {n:'Ardilla de Guayaquil',l:'Simosciurus stramineus',g:'Mamífero',ani:'mamifero',t:'Diurna y trepadora, común en parques y jardines. La fundación alertó sobre ardillas muertas en Lomas de Urdesa tras una presunta fumigación municipal.',s:'Primicias',u:'https://www.primicias.ec/guayaquil/municipio-cuerpo-ardillas-urdesa-fumigacion-proyecto-sacha-104000/'},
 {n:'Mono aullador de la costa',l:'Alouatta palliata',g:'Mamífero',ani:'grande',t:'Se oye mucho antes de verse. La fundación ha atendido ejemplares con desnutrición y lesiones.',s:'El Universo',u:'https://www.eluniverso.com/guayaquil/comunidad/fauna-ocelote-bebe-mono-aullador-proyecto-sacha-guayaquil-guayas-dos-mangas-nota/'},
 {n:'Ocelote',l:'Leopardus pardalis',g:'Mamífero',ani:'grande',t:'Felino manchado y nocturno. Sacha, el rostro de la fundación, es un ocelote. La mascotización y los perros sueltos lo ponen en riesgo.',s:'Vistazo',u:'https://www.vistazo.com/estilo-de-vida/sostenibilidad/meg-la-bebe-ocelote-en-peligro-por-la-quema-de-plantaciones-y-mascotizacion-CK6972334'},
 {n:'Iguana verde',l:'Iguana iguana',g:'Reptil',ani:'reptil',t:'Herbívora. Se la ve en parques y orillas tomando sol. Mirarla de lejos también es respetarla.'},
 {n:'Cocodrilo de la costa',l:'Crocodylus acutus',g:'Reptil',ani:'reptil',t:'Vive en manglares y estuarios del golfo de Guayaquil. Siempre estuvo aquí: la ciudad llegó después. Mantén distancia del agua.'},
 {n:'Boa',l:'Boa constrictor',g:'Reptil',ani:'reptil',t:'No es venenosa: atrapa a sus presas por constricción, sobre todo roedores y aves. Si la ves, no la toques: avisa.'},
 {n:'Garrapatero',l:'Crotophaga sulcirostris',g:'Ave',ani:'ave',t:'Ave negra de pico curvo que anda en grupos por jardines y potreros y se alimenta de insectos.'},
 {n:'Lechuza de campanario',l:'Tyto alba',g:'Ave',ani:'ave',t:'Cazadora nocturna que se alimenta sobre todo de roedores. Anida en techos y construcciones.'}
];
var GROUP_C={'Mamífero':'#AF7409','Ave':'#3F5A4F','Reptil':'#D17A5B'};
var MYTHS=[
 ['La zarigüeya es peligrosa y transmite la rabia.','Es inofensiva y ayuda a controlar plagas. Que transmita la rabia es un mito.'],
 ['Si encuentro una cría sola, está abandonada.','Muchas veces su madre está cerca y no se acerca si hay personas. Observa de lejos y avisa antes de tocarla.'],
 ['Si lo llevo a la fundación, el problema se resuelve.','El rescate recién empieza: hospitalización, trámites, traslado y meses de cuidado.'],
 ['Sacha está en la Amazonía.','Estamos en Guayaquil y en Santa Elena, en la costa.']
];
var FAQS=[
 ['¿Puedo quedarme con un animal que encontré?','No. La tenencia de fauna silvestre está regulada y la mayoría de los animales no sobrevive en una casa. Avisa y el equipo coordina con la autoridad ambiental.'],
 ['¿Qué pasa con el animal después del rescate?','Pasa por atención médica, trámites legales, traslado y un periodo de rehabilitación. Cuando está listo, vuelve a su hábitat.'],
 ['¿Puedo visitar los centros?','No. Por seguridad no recibimos visitas ni voluntarios externos: resguardamos animales que llegan de incautaciones y allanamientos. Trabajamos con universidades mediante convenios.'],
 ['¿Quién financia la fundación?','Operar un año cuesta $350.000 y las donaciones hoy no alcanzan. Puedes aportar desde esta página.']
];
var NEWS=[
 ['Vistazo','Sacha, el ocelote que no pudo regresar a su hábitat pero inspiró un enorme proyecto','https://www.vistazo.com/estilo-de-vida/sostenibilidad/sacha-el-ocelote-que-no-pudo-regresar-a-su-habitat-pero-inspiro-un-enorme-proyecto-CE1336316'],
 ['Primicias','Sacha, el ocelote que inspiró un espacio para cuidar de la fauna silvestre','https://www.primicias.ec/noticias/tecnologia/sacha-ocelote-espacio-cuidar-fauna-silvestre/'],
 ['Expreso','Proyecto Sacha apresta inaugurar un centro de rehabilitación de fauna silvestre','https://www.expreso.ec/buenavida/proyecto-sacha-apresta-inaugurar-centro-rehabilitacion-fauna-silvestre-147100.html'],
 ['Expreso','Zarigüeyas en Guayaquil: ¿en qué sectores de la ciudad es común verlas y qué hacer?','https://www.expreso.ec/guayaquil/zarigueeyas-en-guayaquil-en-que-sectores-de-la-ciudad-es-comun-verlas-y-que-hacer-264427.html'],
 ['El Universo','Ocelote bebé y un mono aullador, encontrados con signos de desnutrición y lesiones','https://www.eluniverso.com/guayaquil/comunidad/fauna-ocelote-bebe-mono-aullador-proyecto-sacha-guayaquil-guayas-dos-mangas-nota/'],
 ['Vistazo','Un ocelote, que fue atacado por varios perros en Bucay, requiere de cirugías','https://www.vistazo.com/sostenibilidad/un-ocelote-que-fue-atacado-por-varios-perros-en-bucay-requiere-de-cirugias-AX2671763'],
 ['Vistazo','Meg: la bebé ocelote en peligro por la quema de plantaciones y mascotización','https://www.vistazo.com/estilo-de-vida/sostenibilidad/meg-la-bebe-ocelote-en-peligro-por-la-quema-de-plantaciones-y-mascotizacion-CK6972334'],
 ['Expreso','Policía halla oso hormiguero herido por perros en recinto militar de Guayaquil','https://www.expreso.ec/guayaquil/policia-halla-oso-hormiguero-herido-por-perros-en-recinto-militar-de-guayaquil-279129.html'],
 ['UTPL','Las zarigüeyas de Ecuador y su función ecológica','https://noticias.utpl.edu.ec/printpdf/node/3592']
];
var AMTS=[10,25,50,100];
var BANK=[['Banco','Banco Internacional'],['Cuenta corriente','1400625249'],['A nombre de','Fundación Proyecto Sacha'],['RUC','0993242721001'],['Correo','donaciones@proyectosacha.org']];

/* ======================  UTILIDADES  ====================== */
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var reduced=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var canIO='IntersectionObserver' in window;
if(!reduced&&canIO)document.documentElement.classList.add('js');
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function fmt(s){s=Math.round(s);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
function ico(id){return '<svg class="ic" aria-hidden="true"><use href="#'+id+'"/></svg>'}
function money(n){return '$'+Math.round(n).toLocaleString('es-EC')}
function toast(m){var t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(function(){t.classList.remove('show')},2600)}
function copy(txt,msg){function ok(){toast(msg||'Copiado')}function fb(){var a=document.createElement('textarea');a.value=txt;a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();try{document.execCommand('copy');ok()}catch(e){toast('Selecciona el texto y cópialo')}a.remove()}try{navigator.clipboard.writeText(txt).then(ok,fb)}catch(e){fb()}}
function go(id){var el=document.getElementById(id);if(el){window.scrollTo({top:el.getBoundingClientRect().top+scrollY-(id==='inicio'?0:56),behavior:reduced?'auto':'smooth'});closeMenu()}}
function validMail(m){return /^\S+@\S+\.\S+$/.test(m)}
function follow(k,cls){var n=NETS[k];return '<a class="btn '+(cls||'line')+' sm" href="'+(n.url||'#redes')+'" target="'+(n.url?'_blank':'_self')+'" rel="noopener" data-follow="'+k+'">Seguir en '+n.name+' '+ico('i-ext')+'</a>'}
function cover(o){
  return '<div class="cv"><div class="pt" style="background-image:url(assets/patterns/tone-sage-'+(o.pat||'felino')+'.svg)"></div>'+(o.meta?'<span class="meta">'+esc(o.meta)+'</span>':'')+'<div class="tt"><small>'+esc(o.pre)+'</small><b>'+esc(o.title)+'</b></div>'+(o.m?'<img class="pm" src="assets/mascot/'+o.m+'.webp" alt="" loading="lazy">':'')+'</div>';
}
document.addEventListener('click',function(e){
  var g=e.target.closest('[data-go]');if(g){e.preventDefault();go(g.getAttribute('data-go'))}
  var f=e.target.closest('[data-follow]');if(f&&!NETS[f.getAttribute('data-follow')].url){e.preventDefault();toast('Enlace de '+NETS[f.getAttribute('data-follow')].name+' por conectar')}
  var n=e.target.closest('[data-noop]');if(n){e.preventDefault();toast('Enlace por conectar')}
  var c=e.target.closest('[data-copy-num]');if(c){var v=c.getAttribute('data-copy-num');copy(v,v+' copiado')}
});

/* ======================  NAVEGACIÓN, PROGRESO Y REVELADOS  ====================== */
$('#nav').innerHTML=NAV.map(function(n){return '<button data-go="'+n[1]+'" data-nav="'+n[1]+'">'+n[0]+'</button>'}).join('');
$('#menuList').innerHTML=NAV.concat([['Transparencia y apoyo','apoyo'],['Redes','redes']]).map(function(n){return '<button data-go="'+n[1]+'">'+n[0]+'</button>'}).join('');
function closeMenu(){$('#menu').classList.remove('open');$('#burger').setAttribute('aria-expanded','false')}
$('#burger').addEventListener('click',function(){var o=$('#menu').classList.toggle('open');this.setAttribute('aria-expanded',o?'true':'false')});
$('#goTop').addEventListener('click',function(){window.scrollTo({top:0,behavior:reduced?'auto':'smooth'});closeMenu()});
var SPY=[['inicio',null],['videos','videos'],['hacemos','hacemos'],['reportar','reportar'],['nosotros','nosotros'],['fauna','fauna'],['prensa','prensa'],['apoyo',null],['redes',null],['contacto',null]],lastAct='';
function onScroll(){
  var H=document.documentElement.scrollHeight-innerHeight,act=null;
  SPY.forEach(function(p){var el=document.getElementById(p[0]);if(el&&el.getBoundingClientRect().top<=160)act=p[1]});
  $('#prog').style.width=(H>0?Math.min(100,scrollY/H*100):0)+'%';
  if(act!==lastAct){lastAct=act;$$('#nav button').forEach(function(b){b.setAttribute('aria-current',b.getAttribute('data-nav')===act?'true':'false')})}
  if(!reduced)$('#hvid').style.setProperty('--z',(1.04+Math.min(.1,scrollY/3600)).toFixed(3));
  protoSpy();
}
window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMenu()});

/* ======================  PORTADA: VIDEO SIN AUDIO Y CIFRAS  ====================== */
(function(){
  var v=$('#heroVid'),b=$('#heroPause'),lab=$('span',b),use=$('use',b),srcs=[].concat(VIDEOS.trailer),fails=0,manual=false,auto=false;
  if(reduced)v.removeAttribute('autoplay');
  v.innerHTML=srcs.map(function(u){return '<source src="'+u+'" type="video/'+(/\.webm$/.test(u)?'webm':'mp4')+'">'}).join('');v.load();
  function ui(p){lab.textContent=p?'Pausar':'Reproducir';use.setAttribute('href',p?'#i-pause':'#i-play');b.setAttribute('aria-label',p?'Pausar el video':'Reproducir el video')}
  function play(){var p=v.play();if(p&&p.catch)p.catch(function(){})}
  v.addEventListener('play',function(){ui(true)});v.addEventListener('pause',function(){ui(false)});
  v.addEventListener('error',function(){if(++fails>=srcs.length)b.style.display='none'},true);ui(false);
  b.addEventListener('click',function(){manual=true;if(v.paused)play();else v.pause()});
  if(canIO)new IntersectionObserver(function(es){if(!es[0].isIntersecting){if(!v.paused){auto=true;v.pause()}}else if(auto&&!manual){auto=false;play()}},{threshold:.05}).observe($('#hvid'));
})();
function sv(f,n){return (f.pre||'')+(f.plain?String(Math.round(n)):Math.round(n).toLocaleString('es-EC'))}
$('#stats').innerHTML=STATS.map(function(f,i){return '<div class="stat rv" style="--d:'+(i*.08)+'s"><b class="pf '+f.pat+'" data-count="'+i+'">'+sv(f,f.n)+'</b><p>'+esc(f.t)+'</p><cite>Fuente: '+(f.u?'<a href="'+f.u+'" target="_blank" rel="noopener">'+esc(f.s)+'</a>':esc(f.s))+'</cite></div>'}).join('');
function countUp(el){var f=STATS[+el.getAttribute('data-count')];if(f.plain||reduced||el.dataset.done)return;el.dataset.done='1';var t0=performance.now();(function st(now){var k=Math.min(1,(now-t0)/1500),e=1-Math.pow(1-k,3);el.textContent=sv(f,f.n*e);if(k<1)requestAnimationFrame(st)})(t0)}

/* ======================  VIDEOS: PANTALLA PRINCIPAL  ====================== */
var H={i:0,on:false,t:0};
function hSrcs(v){return v.src?[].concat(VIDEOS[v.src]).filter(Boolean):(VIDEOS[v.id]?[VIDEOS[v.id]]:[])}
function hCover(v){return v.src?'<div class="cv"><img src="assets/video/hero-poster.jpg" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.9"><span class="meta">'+esc(v.kind)+'</span><div class="tt"><small>'+esc(v.pre)+'</small><b>'+esc(v.title)+'</b></div></div>':cover({pat:v.pat,pre:v.pre,title:v.title,m:v.m,meta:v.kind})}
var ICON_PLAY='<svg class="ic" viewBox="0 0 24 24"><use href="#i-play"/></svg>',ICON_PAUSE='<svg class="ic" viewBox="0 0 24 24"><use href="#i-pause"/></svg>';
function renderH(){
  var v=HVIDS[H.i],srcs=hSrcs(v),el=$('#pl-h'),n=NETS[v.net];H.on=false;H.t=0;el.classList.remove('playing');
  el.innerHTML=srcs.length?'<div class="stage"><video controls playsinline preload="metadata" poster="assets/video/hero-poster.jpg">'+srcs.map(function(u){return '<source src="'+u+'" type="video/'+(/\.webm$/.test(u)?'webm':'mp4')+'">'}).join('')+'</video></div>':
   '<div class="stage">'+hCover(v)+'<span class="badge">Video pendiente · vista de maqueta</span><button class="bigplay" data-hp aria-label="Reproducir">'+ico('i-play')+'</button></div><div class="controls"><button class="pp" data-hp aria-label="Reproducir o pausar">'+ICON_PLAY+'</button><div class="track" data-hseek><div><i></i></div></div><time>0:00 / '+fmt(v.dur)+'</time></div>'+
   '<div class="pend" hidden><span class="nm" style="--c:'+n.c+'">'+n.ab+'</span><b>La historia continúa en '+n.name+'</b><p>'+esc(n.what)+'</p><div class="row">'+follow(v.net,'pri')+'<button class="btn line sm" data-hrep>Ver otra vez</button></div></div>';
  $('#hKick').textContent=v.kind+' · '+fmt(v.dur);$('#hTitle').textContent=v.pre+' '+v.title;$('#hDesc').textContent=v.desc;
  $('#hAct').innerHTML=follow(v.net,'pri')+'<button class="link" data-hshare style="color:#F4EFE6">Compartir '+ico('i-share')+'</button>';
  $('#hlist').innerHTML=HVIDS.map(function(x,i){return '<button class="hrow" data-hv="'+i+'" aria-current="'+(i===H.i)+'"><span class="th">'+hCover(x)+'</span><span><b>'+esc(x.pre+' '+x.title)+'</b><span class="s">'+x.kind+' · '+fmt(x.dur)+'</span></span></button>'}).join('');
}
function hPaint(){var el=$('#pl-h'),v=HVIDS[H.i],i=$('.track i',el),t=$('time',el),b=$('.pp',el);if(!i)return;el.classList.toggle('playing',H.on);i.style.width=(H.t/MOCK_SECONDS*100)+'%';t.textContent=fmt(v.dur*H.t/MOCK_SECONDS)+' / '+fmt(v.dur);b.innerHTML=H.on?ICON_PAUSE:ICON_PLAY}
setInterval(function(){if(!H.on)return;H.t+=.1;if(H.t>=MOCK_SECONDS){H.t=MOCK_SECONDS;H.on=false;hPaint();$('#pl-h .pend').hidden=false}else hPaint()},100);
document.addEventListener('click',function(e){
  var r=e.target.closest('[data-hv]');if(r){H.i=+r.getAttribute('data-hv');renderH();var vd=$('#pl-h video');if(vd){var p=vd.play();if(p&&p.catch)p.catch(function(){})}else{H.on=true;hPaint()}return}
  if(e.target.closest('[data-hp]')){var pd=$('#pl-h .pend');if(pd)pd.hidden=true;if(H.t>=MOCK_SECONDS)H.t=0;H.on=!H.on;hPaint();return}
  if(e.target.closest('[data-hrep]')){$('#pl-h .pend').hidden=true;H.t=0;H.on=true;hPaint();return}
  var s=e.target.closest('[data-hseek]');if(s){var rc=s.getBoundingClientRect();H.t=Math.max(0,Math.min(.99,(e.clientX-rc.left)/rc.width))*MOCK_SECONDS;hPaint();return}
  if(e.target.closest('[data-hshare]')){copy(location.href.split('#')[0]+'#videos','Enlace copiado');return}
  var hp=e.target.closest('[data-hplay]');if(hp){H.i=HVIDS.map(function(x){return x.id}).indexOf(hp.getAttribute('data-hplay'));renderH();go('videos')}
});

/* ======================  VIDEOS: CÁPSULAS VERTICALES Y VISOR  ====================== */
var C={tab:-1,seen:{}};
function capList(){return CAPS.map(function(c,i){return i}).filter(function(i){return C.tab<0||CAPS[i].tab===C.tab})}
function capCover(i){var c=CAPS[i];return cover({pat:TABS[c.tab].pat,pre:c.pre,title:c.title,m:c.m,meta:'Cápsula '+String(i+1).padStart(2,'0')+' · '+TABS[c.tab].name})}
function renderReels(){
  $('#capTabs').innerHTML=[{name:'Todas'}].concat(TABS).map(function(t,k){return '<button class="tab" role="tab" aria-selected="'+(C.tab===k-1)+'" data-ctab="'+(k-1)+'">'+t.name+'</button>'}).join('');
  $('#reels').innerHTML=capList().map(function(i){var c=CAPS[i];return '<button class="vcard'+(C.seen[i]?' seen':'')+'" data-cap="'+i+'" aria-label="Ver cápsula '+(i+1)+': '+esc(c.pre+' '+c.title)+'">'+capCover(i)+'<span class="num">'+fmt(c.dur)+'</span><span class="pl">'+ico('i-play')+'</span></button>'}).join('');
  $('#reels').scrollLeft=0;
}
document.addEventListener('click',function(e){var b=e.target.closest('[data-ctab]');if(b){C.tab=+b.getAttribute('data-ctab');renderReels()}});
$('#reelPrev').addEventListener('click',function(){$('#reels').scrollBy({left:-$('#reels').clientWidth*.8,behavior:'smooth'})});
$('#reelNext').addEventListener('click',function(){$('#reels').scrollBy({left:$('#reels').clientWidth*.8,behavior:'smooth'})});
var ST={open:false,list:[],i:0,t:0,paused:false,last:null};
function openStory(cap){ST.list=capList();if(ST.list.indexOf(cap)<0){C.tab=-1;renderReels();ST.list=capList()}ST.i=ST.list.indexOf(cap);ST.t=0;ST.paused=false;ST.open=true;ST.last=document.activeElement;$('#story-v').hidden=false;document.body.classList.add('lock');renderStory();$('#stClose').focus()}
function closeStory(){ST.open=false;$('#story-v').hidden=true;document.body.classList.remove('lock');$('#stFrame').innerHTML='';renderReels();if(ST.last&&ST.last.focus)ST.last.focus({preventScroll:true})}
function renderStory(){
  var i=ST.list[ST.i],c=CAPS[i],src=VIDEOS.caps[i];C.seen[i]=true;
  $('#stFrame').innerHTML='<div class="st-bars">'+ST.list.map(function(x,k){return '<i><b style="width:'+(k<ST.i?100:0)+'%"></b></i>'}).join('')+'</div><div class="st-head"><span class="av"><img src="assets/mascot/sacha-saluda.webp" alt=""></span><div><b>Proyecto Sacha</b><span>'+esc(TABS[c.tab].name)+' · cápsula '+(i+1)+'</span></div><div class="sp"><button id="stPause" aria-label="Pausar">'+ico('i-pause')+'</button></div></div>'+
   (src?'<video id="stVid" src="'+esc(src)+'" autoplay playsinline></video>':capCover(i)+'<div class="st-mock"><span class="badge">Video pendiente · vista de maqueta</span></div>')+
   '<button class="st-tap l" data-st="-1" aria-label="Anterior"></button><button class="st-tap r" data-st="1" aria-label="Siguiente"></button><div class="st-foot"><p>'+esc(c.desc)+'</p><div class="row">'+follow(c.net,'pri')+'<button class="btn line sm" id="stShare">'+ico('i-share')+'Compartir</button></div></div>';
  var v=$('#stVid');if(v){v.addEventListener('ended',function(){stStep(1)});v.addEventListener('timeupdate',function(){var b=$$('.st-bars b')[ST.i];if(b&&v.duration)b.style.width=(v.currentTime/v.duration*100)+'%'})}
}
function stStep(d){var n=ST.i+d;if(n<0)n=0;if(n>=ST.list.length){closeStory();return}ST.i=n;ST.t=0;renderStory()}
setInterval(function(){if(!ST.open||ST.paused||VIDEOS.caps[ST.list[ST.i]])return;ST.t+=.1;var b=$$('.st-bars b')[ST.i];if(b)b.style.width=Math.min(100,ST.t/MOCK_SECONDS*100)+'%';if(ST.t>=MOCK_SECONDS)stStep(1)},100);
document.addEventListener('click',function(e){
  var r=e.target.closest('[data-cap]');if(r){openStory(+r.getAttribute('data-cap'));return}
  if(!ST.open)return;var t=e.target.closest('[data-st]');if(t){stStep(+t.getAttribute('data-st'));return}
  if(e.target.closest('#stPrev')){stStep(-1);return}if(e.target.closest('#stNext')){stStep(1);return}
  if(e.target.closest('#stClose')||e.target===$('#story-v')){closeStory();return}
  if(e.target.closest('#stPause')){ST.paused=!ST.paused;var v=$('#stVid');if(v){if(ST.paused)v.pause();else v.play()}$('#stPause').innerHTML=ico(ST.paused?'i-play':'i-pause');return}
  if(e.target.closest('#stShare'))copy(location.href.split('#')[0]+'#videos','Enlace copiado');
});
document.addEventListener('keydown',function(e){if(!ST.open)return;if(e.key==='Escape')closeStory();if(e.key==='ArrowRight')stStep(1);if(e.key==='ArrowLeft')stStep(-1);if(e.key===' '&&$('#stPause')){e.preventDefault();$('#stPause').click()}});

/* ======================  VIDEOS: PODCAST INCRUSTADO  ====================== */
var EP=0;
function renderPod(){
  var e=PODCAST[EP],bars='';for(var i=0;i<28;i++)bars+='<i style="--h:'+(24+Math.abs(Math.sin(i*1.7))*76).toFixed(0)+'%"></i>';
  $('#yt').innerHTML='<div class="yt" id="ytBox">'+cover({pat:'manchas',pre:'Podcast · episodio '+e.n,title:e.title,m:'sacha-dato',meta:'YouTube'})+'<div class="bars" aria-hidden="true">'+bars+'</div><button class="bigplay" id="ytPlay" aria-label="Reproducir el episodio '+e.n+'">'+ico('i-play')+'</button>'+(e.yt?'':'<span class="badge">Episodio por publicar</span>')+'</div><div class="meta2"><h3 style="font-size:22px">Episodio '+e.n+' · '+esc(e.title)+'</h3><p class="small" style="color:var(--on-c2)">'+esc(e.guest)+'</p><div class="row">'+follow('youtube','pri')+(e.yt?'<a class="link" style="color:#F4EFE6" href="https://www.youtube.com/watch?v='+encodeURIComponent(e.yt)+'" target="_blank" rel="noopener">Abrir en YouTube '+ico('i-ext')+'</a>':'')+'</div></div>';
  $('#eps').innerHTML=PODCAST.map(function(x,i){return '<button class="ep" data-ep="'+i+'" aria-current="'+(i===EP)+'"><span class="n">'+x.n+'</span><span><b>Episodio '+x.n+' · '+esc(x.title)+'</b><span class="s">'+esc(x.guest)+'</span></span>'+ico('i-play')+'</button>'}).join('');
}
document.addEventListener('click',function(e){
  var b=e.target.closest('[data-ep]');if(b){EP=+b.getAttribute('data-ep');renderPod();return}
  if(e.target.closest('#ytPlay')){var ep=PODCAST[EP],bx=$('#ytBox');
    if(ep.yt)bx.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+encodeURIComponent(ep.yt)+'?autoplay=1&rel=0" title="Episodio '+ep.n+'" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
    else bx.insertAdjacentHTML('beforeend','<div class="pend"><span class="nm" style="--c:#AF7409">YT</span><b>Este episodio se reproducirá aquí</b><p>Cuando se publique en YouTube, su ID se pega en la configuración y se verá incrustado, sin salir de la página.</p><div class="row">'+follow('youtube','pri')+'</div></div>')}
});

/* ======================  QUÉ HACEMOS: PROTOCOLO  ====================== */
$('#proto').innerHTML=STEPS.map(function(s,i){return '<li class="ps rv" style="--d:'+(i*.1)+'s"><span class="n pf '+s.pat+'">'+(i+1)+'</span><h3>'+s.title+'</h3><p>'+s.text+'</p><span class="who">'+s.who+'</span><div><button class="link" data-cap="'+(s.cap-1)+'">Ver la cápsula '+ico('i-arrow')+'</button></div></li>'}).join('');
$('#allies').innerHTML=ALLIES.map(function(a){return '<li>'+a+'</li>'}).join('');
function protoSpy(){var p=$('#proto'),r=p.getBoundingClientRect(),f=Math.max(0,Math.min(1,(innerHeight*.78-r.top)/(r.height+innerHeight*.15)));p.style.setProperty('--p',f.toFixed(3));$$('.ps',p).forEach(function(el,i){el.classList.toggle('on',f>=i/STEPS.length+.04)})}

/* ======================  REPORTAR: GUÍA DE ACCIÓN  ====================== */
var T;function resetTool(){T={step:0,sit:-1,ani:-1,chk:{},tried:false,sent:false,f:{type:'',sit:'',where:'',desc:'',name:'',phone:'',ok:false,photo:''}}}resetTool();
function reach(){return T.sit<0?0:(T.ani<0?1:3)}
function validPhone(p){return String(p).replace(/\D/g,'').length>=7}
function lookup(l,id){return l.filter(function(x){return x.id===id})[0]||l[0]}
function stepper(){var L=['Situación','Animal','Qué hacer','Avisar'],r=reach();return '<ol class="tsteps">'+L.map(function(l,i){var cur=T.step===i,done=i<T.step||(T.sent&&i===3);return '<li><button class="'+(done?'done':'')+'" '+(cur?'aria-current="step" ':'')+(i>r?'disabled ':'')+'data-tstep="'+i+'"><span class="n">'+(done?ico('i-check'):(i+1))+'</span><span>'+l+'</span></button></li>'}).join('')+'</ol>'}
function opt(attr,i,o,sub){return '<button class="opt" '+attr+'="'+i+'" style="--c:'+o.c+'"><span class="oi">'+ico(o.ic)+'</span><span><b>'+o.title+'</b><span class="s">'+sub+'</span></span>'+ico('i-arrow')+'</button>'}
function safety(t){return '<div class="safety">'+ico('i-alert')+'<p>'+(t||'Tu seguridad va primero. Si hay riesgo para personas (un animal agresivo, una serpiente cerca de niños, un cocodrilo en la vía pública), llama al')+' <button data-copy-num="911" aria-label="Copiar 911">911</button>.</p></div>'}
function fld(id,label,inner,bad,err,wide){return '<div class="fld'+(bad?' bad':'')+(wide?' wide':'')+'"><label for="'+id+'">'+label+'</label>'+inner+'<span class="err" role="alert">'+err+'</span></div>'}
function toolBody(){
  if(T.step===0)return '<div class="tbody"><h3 class="tq" id="tq" tabindex="-1">¿Qué está pasando?</h3>'+(T.ani>=0?'<p class="small">Tipo de animal elegido: <b>'+ANIS[T.ani].title+'</b>. <button class="linkbtn" data-tstep="1">Cambiar</button></p>':'')+'<div class="opts">'+SITS.map(function(s,i){return opt('data-sit',i,s,s.sub)}).join('')+'</div>'+safety()+'</div>';
  if(T.step===1)return '<div class="tbody"><h3 class="tq" id="tq" tabindex="-1">¿Qué tipo de animal es?</h3><div class="opts">'+ANIS.map(function(a,i){return opt('data-ani',i,a,a.eg)}).join('')+'</div><div class="ract"><button class="linkbtn" data-tstep="0">← Cambiar la situación</button></div></div>';
  var s=SITS[T.sit],a=ANIS[T.ani],f=T.f,t=T.tried;
  if(T.step===2){var d=s.do.concat(a.do),n=s.dont.concat(a.dont);return '<div class="tbody"><span class="urgtag">'+s.urg+'</span><h3 class="tq" id="tq" tabindex="-1">'+s.title+' · '+a.title+'</h3>'+(a.danger?safety('Si hay riesgo para personas, llama primero al'):'')+'<div class="rcols"><div class="rbox"><h4>Haz esto</h4>'+d.map(function(x,i){return '<button class="chk" role="checkbox" aria-checked="'+!!T.chk['d'+i]+'" data-chk="d'+i+'"><i>'+ico('i-check')+'</i><span>'+esc(x)+'</span></button>'}).join('')+'</div><div class="rbox dont"><h4>No hagas esto</h4><ul class="nox">'+n.map(function(x){return '<li>'+ico('i-x')+'<span>'+esc(x)+'</span></li>'}).join('')+'</ul></div></div><div class="ract"><button class="btn urg" data-tstep="3">Reportar este caso '+ico('i-arrow')+'</button><button class="btn line" data-copyguide>Copiar guía</button><button class="linkbtn" data-treset>Empezar de nuevo</button></div></div>'}
  if(T.sent)return '<div class="tbody"><span class="urgtag" style="color:var(--accent)">Reporte preparado</span><h3 class="tq" id="tq" tabindex="-1">Gracias por avisar, '+esc(f.name.trim().split(/\s+/)[0])+'</h3><dl class="sumbox"><div><dt>Situación</dt><dd>'+esc(lookup(SITS,f.sit).title)+'</dd></div><div><dt>Animal</dt><dd>'+esc(lookup(ANIS,f.type).title)+'</dd></div><div><dt>Ubicación</dt><dd>'+esc(f.where)+'</dd></div>'+(f.desc.trim()?'<div><dt>Descripción</dt><dd>'+esc(f.desc)+'</dd></div>':'')+'<div><dt>Contacto</dt><dd>'+esc(f.name)+' · '+esc(f.phone)+'</dd></div></dl>'+(f.photo?'<img class="photo-prev on" src="'+f.photo+'" alt="Foto adjunta">':'')+'<div class="ract"><button class="btn pri" data-copyrep>'+ico('i-copy')+'Copiar reporte</button><button class="btn line" data-treset>Nuevo reporte</button></div><p class="proto-note">Maqueta: el reporte aún no llega a la fundación. Copia el texto y compártelo por sus canales. Si hay riesgo para personas, llama al 911.</p></div>';
  return '<div class="tbody"><h3 class="tq" id="tq" tabindex="-1">Avisa al equipo</h3><p class="small">Llena lo que sepas. Lo mínimo es dónde está y cómo contactarte.</p><form id="repForm" novalidate><div class="fgrid">'+
   fld('rWhere','¿Dónde está? *','<input id="rWhere" placeholder="Calle, sector o referencia" value="'+esc(f.where)+'">',t&&!f.where.trim(),'Indica dónde está',true)+
   fld('rDesc','Descripción (opcional)','<textarea id="rDesc" placeholder="Cómo se ve, cuántos son, hace cuánto lo viste">'+esc(f.desc)+'</textarea>',false,'',true)+
   fld('rPhoto','Foto (opcional)','<input id="rPhoto" type="file" accept="image/*"><img class="photo-prev'+(f.photo?' on':'')+'" id="photoPrev" alt="Vista previa"'+(f.photo?' src="'+f.photo+'"':'')+'>',false,'',true)+
   fld('rName','Tu nombre *','<input id="rName" autocomplete="name" value="'+esc(f.name)+'">',t&&!f.name.trim(),'Escribe tu nombre')+
   fld('rPhone','Tu teléfono *','<input id="rPhone" type="tel" inputmode="tel" autocomplete="tel" value="'+esc(f.phone)+'">',t&&!validPhone(f.phone),'Teléfono no válido')+
   '</div><label class="consent'+(t&&!f.ok?' bad':'')+'" style="margin-top:14px"><input type="checkbox" id="rOk"'+(f.ok?' checked':'')+'><span>Acepto que la fundación use estos datos solo para atender este caso.</span></label><div class="ract" style="margin-top:16px"><button class="btn urg" type="submit">Preparar reporte</button><button class="linkbtn" type="button" data-tstep="2">← Volver a la guía</button></div></form><p class="proto-note">Maqueta: por ahora el reporte no se envía.</p></div>';
}
var SAY=[['Primero, respira.','Cuéntame qué está pasando y te explico qué hacer.'],['Ya casi.','Con el tipo de animal ajusto las indicaciones.'],['Con calma.','Sigue los pasos y marca los que ya hiciste.'],['Un último paso.','Con estos datos el equipo te ubica más rápido.']];
function renderTool(focus){$('#tmain').innerHTML=stepper()+toolBody();var m=T.sent?['¡Gracias por avisar!','Ya hiciste lo más importante. Copia el reporte y compártelo con el equipo.']:SAY[T.step];$('#guide').innerHTML='<span class="av"><img src="assets/mascot/sacha-saluda.webp" alt="Sacha"></span><p><b>'+m[0]+'</b>'+m[1]+'</p>';if(focus){var q=$('#tq');if(q)q.focus({preventScroll:true});var r=$('#tmain').getBoundingClientRect();if(r.top<70||r.top>innerHeight*.5)window.scrollTo({top:r.top+scrollY-90,behavior:reduced?'auto':'smooth'})}}
$('#nums').innerHTML=NUMS.map(function(n){return '<div class="num"><div><b'+(n.v?'':' style="font-size:19px"')+'>'+(n.v||n.k)+'</b><small>'+(n.v?n.k+'. ':'')+n.note+'</small></div>'+(n.v?'<button class="cpy" data-copy-num="'+n.v+'">'+ico('i-copy')+'Copiar</button>':'')+'</div>'}).join('');
document.addEventListener('click',function(e){var el;
  if((el=e.target.closest('[data-sit]'))){T.sit=+el.getAttribute('data-sit');T.chk={};T.sent=false;T.step=T.ani>=0?2:1;renderTool(true);return}
  if((el=e.target.closest('[data-ani]'))){T.ani=+el.getAttribute('data-ani');T.chk={};T.sent=false;T.step=2;renderTool(true);return}
  if((el=e.target.closest('[data-tstep]'))){var n=+el.getAttribute('data-tstep');if(n<=reach()){T.step=n;if(n===3){T.f.type=ANIS[T.ani].id;T.f.sit=SITS[T.sit].id}renderTool(true)}return}
  if((el=e.target.closest('[data-chk]'))){var k=el.getAttribute('data-chk');T.chk[k]=!T.chk[k];el.setAttribute('aria-checked',!!T.chk[k]);return}
  if(e.target.closest('[data-treset]')){resetTool();renderTool(true);return}
  if(e.target.closest('[data-copyguide]')){var s=SITS[T.sit],a=ANIS[T.ani];copy(['Qué hacer si encuentras un animal silvestre · '+s.title+' · '+a.title,'','HAZ ESTO'].concat(s.do.concat(a.do).map(function(x,i){return (i+1)+'. '+x}),['','NO HAGAS ESTO'],s.dont.concat(a.dont).map(function(x){return '- '+x}),['','Si hay riesgo para personas, llama al 911.']).join('\n'),'Guía copiada');return}
  if(e.target.closest('[data-copyrep]')){var f=T.f;copy(['REPORTE DE FAUNA SILVESTRE · Proyecto Sacha','Fecha: '+new Date().toLocaleString('es-EC'),'Situación: '+lookup(SITS,f.sit).title,'Animal: '+lookup(ANIS,f.type).title,'Ubicación: '+f.where.trim(),'Descripción: '+(f.desc.trim()||'—'),'Contacto: '+f.name.trim()+' · '+f.phone.trim()].join('\n'),'Reporte copiado');return}
  if((el=e.target.closest('[data-fani]'))){T.ani=ANIS.map(function(a){return a.id}).indexOf(el.getAttribute('data-fani'));T.chk={};T.sent=false;T.step=T.sit>=0?2:0;renderTool(false);go('reportar')}
});
document.addEventListener('input',function(e){var m={rWhere:'where',rDesc:'desc',rName:'name',rPhone:'phone'}[e.target.id];if(m)T.f[m]=e.target.value});
document.addEventListener('change',function(e){if(e.target.id==='rOk')T.f.ok=e.target.checked;if(e.target.id==='rPhoto'){var file=e.target.files&&e.target.files[0],pv=$('#photoPrev');if(T.f.photo&&T.f.photo.indexOf('blob:')===0)URL.revokeObjectURL(T.f.photo);if(file&&file.type.indexOf('image/')===0){T.f.photo=URL.createObjectURL(file);pv.src=T.f.photo;pv.classList.add('on')}else{T.f.photo='';pv.classList.remove('on');pv.removeAttribute('src');if(file){toast('Elige una imagen (JPG o PNG)');e.target.value=''}}}});
document.addEventListener('submit',function(e){if(e.target.id!=='repForm')return;e.preventDefault();var f=T.f,ok=f.where.trim()&&f.name.trim()&&validPhone(f.phone)&&f.ok;if(ok){T.sent=true;T.tried=false}else T.tried=true;renderTool(false);if(ok){var q=$('#tq');if(q)q.focus({preventScroll:true})}else{var b=$('#repForm .bad input')||$('#repForm .consent.bad input');if(b)b.focus()}});

/* ======================  NOSOTROS: HISTORIA, LÍNEA DE TIEMPO Y MAPA  ====================== */
$('#story').innerHTML=STORY.map(function(p){return '<p>'+esc(p)+'</p>'}).join('')+'<p class="src">Fuentes: '+STORY_SRC.map(function(s){return '<a href="'+s[1]+'" target="_blank" rel="noopener">'+s[0]+'</a>'}).join(' · ')+'</p><ol class="tl">'+TL.map(function(t){return '<li><b>'+t[0]+'</b><span>'+esc(t[1])+' <span class="src">'+t[2]+'</span></span></li>'}).join('')+'</ol><div><button class="btn pri" data-hplay="sacha">'+ico('i-play')+'Ver «¿Quién es Sacha?»</button></div>';
var SD=0;
function renderMap(){
  var box=$('#mapbox');$$('.mpin,.mref',box).forEach(function(n){n.remove()});
  MREF.forEach(function(r){var d=document.createElement('div');d.className='mref';d.style.left=r.pos[0]+'%';d.style.top=r.pos[1]+'%';d.innerHTML='<i></i><span>'+r.name+'</span>';box.appendChild(d)});
  SEDES.forEach(function(d,i){var b=document.createElement('button');b.className='mpin';b.style.left=d.pos[0]+'%';b.style.top=d.pos[1]+'%';b.style.setProperty('--dy',d.dy+'px');b.setAttribute('aria-pressed',SD===i);b.setAttribute('data-sede',i);b.setAttribute('aria-label','Sede: '+d.pin);b.innerHTML='<i></i><span>'+d.pin+'</span>';box.appendChild(b)});
  $('#sedes').innerHTML=SEDES.map(function(d,i){return '<div class="sede'+(SD===i?' on':'')+'"><span class="k">Sede '+d.n+' · '+d.kind+'</span><h3><button data-sede="'+i+'">'+d.name+'</button></h3><span>'+d.desc+'</span><span class="meta"><span>Dirección y horario: por confirmar</span></span><a class="btn line sm" href="https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(d.q)+'" target="_blank" rel="noopener">Ver zona en Google Maps '+ico('i-ext')+'</a></div>'}).join('')+'<div class="callout">'+ico('i-info')+'<span>Por seguridad no recibimos visitas en los centros: resguardamos animales que llegan de incautaciones y allanamientos.</span></div>';
}
document.addEventListener('click',function(e){var b=e.target.closest('[data-sede]');if(b){SD=+b.getAttribute('data-sede');renderMap()}});

/* ======================  FAUNA, MITOS, PREGUNTAS Y PRENSA  ====================== */
var FG='Todos';
function renderFauna(){
  var G=['Todos','Mamífero','Ave','Reptil'],L={'Todos':'Todos','Mamífero':'Mamíferos','Ave':'Aves','Reptil':'Reptiles'};
  $('#ffilters').innerHTML=G.map(function(g){return '<button class="filter" data-fg="'+g+'" aria-pressed="'+(FG===g)+'">'+L[g]+'</button>'}).join('');
  $('#ftable').innerHTML=FAUNA.filter(function(f){return FG==='Todos'||f.g===FG}).map(function(f){return '<article class="frow"><div><h3>'+f.n+'</h3><em>'+f.l+'</em></div><span class="grp" style="--c:'+GROUP_C[f.g]+'">'+f.g+'</span><div><p>'+esc(f.t)+'</p>'+(f.s?'<span class="src">Fuente: <a href="'+f.u+'" target="_blank" rel="noopener">'+f.s+'</a></span>':'')+'</div><button class="btn line sm" data-fani="'+f.ani+'">Si lo encuentras</button></article>'}).join('');
}
document.addEventListener('click',function(e){var b=e.target.closest('[data-fg]');if(b){FG=b.getAttribute('data-fg');renderFauna()}});
$('#myths').innerHTML=MYTHS.map(function(m){return '<div class="myth"><div class="m"><span class="tag">Mito</span><q>'+esc(m[0])+'</q></div><div class="r"><span class="tag">Realidad</span><p>'+esc(m[1])+'</p></div></div>'}).join('');
var FQ=0;
function renderFaq(){$('#faq').innerHTML=FAQS.map(function(f,i){var o=FQ===i;return '<div class="item'+(o?' open':'')+'"><h4><button data-faq="'+i+'" aria-expanded="'+o+'" id="fq'+i+'" aria-controls="fa'+i+'"><span>'+f[0]+'</span><span class="pm" aria-hidden="true">+</span></button></h4><div class="ans" id="fa'+i+'" role="region" aria-labelledby="fq'+i+'">'+f[1]+'</div></div>'}).join('')}
document.addEventListener('click',function(e){var b=e.target.closest('[data-faq]');if(b){var i=+b.getAttribute('data-faq');FQ=FQ===i?-1:i;renderFaq();var n=$('#fq'+i);if(n)n.focus()}});
$('#press').innerHTML=NEWS.map(function(n){return '<a href="'+n[2]+'" target="_blank" rel="noopener"><b>'+n[0]+'</b><span>'+esc(n[1])+'</span>'+ico('i-ext')+'</a>'}).join('');

/* ======================  APOYO: DONACIÓN Y CONVENIOS  ====================== */
var G={a:1,custom:'',f:1,bank:false};
function amount(){var c=parseFloat(G.custom);return G.a>=0?AMTS[G.a]:(c>0?c:0)}
function impactHTML(){var a=amount();if(a<=0)return 'Elige un monto para ver cuánta operación cubre tu aporte.';var perMin=YEAR_COST/525600,mins=a/perMin,t=mins<90?'unos '+Math.max(1,Math.round(mins))+' minutos':'unas '+(mins/60).toFixed(1).replace('.',',')+' horas',yr=a*12;return '<b>'+money(a)+'</b> cubren '+t+' de operación. '+(G.f?'En un año serían '+money(yr)+'. ':'')+'<span class="small">Equivalencia ilustrativa: $350.000 al año.</span>'}
function renderGive(){
  var a=amount(),el=$('#give');
  if(G.bank){el.innerHTML='<div class="thanks"><span class="k">Último paso</span><h3>Gracias por tu aporte '+(G.f?'mensual':'único')+' de '+money(a)+'</h3><p>Para completarlo, haz una transferencia con estos datos. Pronto sumaremos pago con tarjeta.</p><dl class="bank">'+BANK.map(function(b,i){return '<div><dt>'+b[0]+'</dt><dd>'+b[1]+'</dd><button data-cb="'+i+'">Copiar</button></div>'}).join('')+'</dl><p class="proto-note">Maqueta: aquí irán el pago y el recibo.</p><div><button class="link" id="giveBack">← Volver</button></div></div>';return}
  el.innerHTML='<span class="k">Apoya a la fundación</span><h3>Elige tu aporte</h3><div class="seg" role="group" aria-label="Frecuencia"><button data-gf="0" aria-pressed="'+(G.f===0)+'">Una vez</button><button data-gf="1" aria-pressed="'+(G.f===1)+'">Cada mes</button></div><div class="bigamt" id="bigAmt">'+money(a)+'<small>'+(G.f?'/ mes':'una vez')+'</small></div><div class="amts" role="group" aria-label="Monto">'+AMTS.map(function(x,i){return '<button data-ga="'+i+'" aria-pressed="'+(G.a===i)+'">$'+x+'</button>'}).join('')+'<input id="customAmt" type="number" min="1" inputmode="decimal" placeholder="Otro $" aria-label="Otro monto" value="'+esc(G.custom)+'"></div><p class="impact" id="impact" aria-live="polite">'+impactHTML()+'</p><button class="btn pri" id="doGive" '+(a>0?'':'disabled')+'>Donar '+(a>0?money(a)+(G.f?' / mes':''):'')+'</button><p class="small">Montos de ejemplo. Transferencia por ahora; tarjeta y PayPal próximamente.</p>';
}
function syncGive(){var a=amount(),b=$('#doGive'),im=$('#impact'),big=$('#bigAmt');if(big){big.innerHTML=money(a)+'<small>'+(G.f?'/ mes':'una vez')+'</small>';big.classList.remove('bump');void big.offsetWidth;big.classList.add('bump')}if(im)im.innerHTML=impactHTML();if(b){b.disabled=!(a>0);b.textContent='Donar '+(a>0?money(a)+(G.f?' / mes':''):'')}}
document.addEventListener('click',function(e){
  var f=e.target.closest('[data-gf]');if(f){G.f=+f.getAttribute('data-gf');renderGive();return}
  var m=e.target.closest('[data-ga]');if(m){G.a=+m.getAttribute('data-ga');G.custom='';renderGive();return}
  if(e.target.closest('#doGive')&&amount()>0){G.bank=true;renderGive();return}
  if(e.target.id==='giveBack'||e.target.closest('#giveBack')){G.bank=false;renderGive();return}
  var c=e.target.closest('[data-cb]');if(c){var b=BANK[+c.getAttribute('data-cb')];copy(b[1],b[0]+' copiado')}
});
document.addEventListener('input',function(e){if(e.target.id==='customAmt'){G.custom=e.target.value;G.a=e.target.value?-1:1;if(!e.target.value){renderGive();$('#customAmt').focus();return}$$('.amts button').forEach(function(x){x.setAttribute('aria-pressed','false')});syncGive()}});
var CV={org:'',name:'',mail:'',kind:'',msg:''},cTried=false,cOk=false;
function renderConv(){
  var el=$('#conv'),v=CV,t=cTried;
  if(cOk){el.innerHTML='<div class="thanks"><span class="k">Convenios</span><h3>Solicitud enviada</h3><p>Gracias, '+esc(v.name)+'. Te escribiremos a '+esc(v.mail)+' para conversar el convenio.</p><p class="proto-note">Maqueta: el formulario aún no está conectado a un correo.</p><div><button class="link" id="convBack">← Volver</button></div></div>';return}
  el.innerHTML='<span class="k">Voluntariado y convenios</span><h3>Suma a tu universidad u organización</h3><p class="small">Es la única vía de voluntariado: por seguridad no recibimos visitas ni voluntarios externos en el centro de rescate.</p><form id="convForm" novalidate style="display:grid;gap:12px"><div class="fields">'+
   fld('cOrg','Institución *','<input id="cOrg" autocomplete="organization" value="'+esc(v.org)+'">',t&&!v.org.trim(),'Escribe el nombre de la institución',true).replace('class="fld','style="grid-column:1/-1" class="fld')+
   fld('cName','Tu nombre *','<input id="cName" autocomplete="name" value="'+esc(v.name)+'">',t&&!v.name.trim(),'Escribe tu nombre')+
   fld('cMail','Correo *','<input id="cMail" type="email" autocomplete="email" value="'+esc(v.mail)+'">',t&&!validMail(v.mail),'Correo no válido')+
   '</div><button class="btn line" type="submit" style="justify-self:start">Enviar solicitud</button></form>';
}
document.addEventListener('input',function(e){var m={cOrg:'org',cName:'name',cMail:'mail'}[e.target.id];if(m)CV[m]=e.target.value});
document.addEventListener('submit',function(e){if(e.target.id!=='convForm')return;e.preventDefault();var v=CV,ok=v.org.trim()&&v.name.trim()&&validMail(v.mail);if(ok){cOk=true;cTried=false}else cTried=true;renderConv();if(!ok){var b=$('#convForm .bad input');if(b)b.focus()}});
document.addEventListener('click',function(e){if(e.target.closest('#convBack')){cOk=false;CV={org:'',name:'',mail:'',kind:'',msg:''};renderConv()}});

/* ======================  REDES  ====================== */
function netHref(n){return n.url||'#redes'}
$('#utilNets').innerHTML=Object.keys(NETS).map(function(k){var n=NETS[k];return '<a href="'+netHref(n)+'" data-follow="'+k+'" target="'+(n.url?'_blank':'_self')+'" rel="noopener">'+n.name+'</a>'}).join('');
$('#footNets').innerHTML=Object.keys(NETS).map(function(k){var n=NETS[k];return '<li><a href="'+netHref(n)+'" data-follow="'+k+'" target="'+(n.url?'_blank':'_self')+'" rel="noopener">'+n.name+'</a></li>'}).join('');
$('#nets').innerHTML=Object.keys(NETS).map(function(k,i){var n=NETS[k];return '<a class="net rv" style="--c:'+n.c+';--d:'+(i*.08)+'s" href="'+netHref(n)+'" data-follow="'+k+'" target="'+(n.url?'_blank':'_self')+'" rel="noopener"><span class="nm">'+n.ab+'</span><b>'+n.name+'</b><p>'+esc(n.what)+'</p><span class="h">'+esc(n.handle)+'</span><span class="go">Seguir '+ico('i-arrow')+'</span></a>'}).join('');

/* ======================  ARRANQUE, REVELADOS Y OJOS DEL LOGO  ====================== */
renderH();renderReels();renderPod();renderTool(false);renderMap();renderFauna();renderFaq();renderGive();renderConv();
$$('.sec .wrap > .sgrid').forEach(function(g){if(g.parentNode.firstElementChild===g)g.insertAdjacentHTML('beforebegin','<div class="rule rulewrap"></div>')});
$$('.mask').forEach(function(m){$$('.ln',m).forEach(function(l,i){l.style.setProperty('--i',i)})});
onScroll();
(function(){
  if(!document.documentElement.classList.contains('js')){$$('[data-count]').forEach(countUp);return}
  var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');$$('[data-count]',en.target).forEach(countUp);io.unobserve(en.target)}})},{threshold:.12});
  $$('.mask,.rv,.rule').forEach(function(el){io.observe(el)});
  /* si algo no llegó a observarse (saltos de scroll, capturas), queda visible igualmente */
  setTimeout(function(){$$('.mask:not(.in),.rv:not(.in),.rule:not(.in)').forEach(function(el){var r=el.getBoundingClientRect();if(r.top<innerHeight*1.2&&r.bottom>-innerHeight*.2){el.classList.add('in');$$('[data-count]',el).forEach(countUp)}})},2500);
  if(!reduced&&matchMedia('(pointer:fine)').matches){var logos=$$('svg.logo'),raf=0,mx=0,my=0;document.addEventListener('pointermove',function(e){mx=e.clientX;my=e.clientY;if(raf)return;raf=requestAnimationFrame(function(){raf=0;logos.forEach(function(l){var r=l.getBoundingClientRect();if(!r.width||r.bottom<0||r.top>innerHeight)return;var dx=mx-(r.left+r.width/2),dy=my-(r.top+r.height/2),d=Math.hypot(dx,dy)||1,k=Math.min(1,d/320)*13;l.style.setProperty('--px',(dx/d*k).toFixed(1)+'px');l.style.setProperty('--py',(dy/d*k).toFixed(1)+'px')})})},{passive:true})}
})();
})();
