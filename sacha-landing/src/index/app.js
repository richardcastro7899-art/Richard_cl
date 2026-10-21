(function(){
'use strict';

/* ======================  CONTENIDO EDITABLE  ======================
   Textos, pasos, cifras y fuentes viven aquí. Videos: pega la ruta de cada .mp4 en VIDEOS
   (vacío = reproductor de maqueta). El video de fondo del inicio (VIDEOS.hero: lista de formatos, el navegador
   usa el primero que pueda reproducir) es una imagen de referencia animada: reemplázalo por material propio
   y cambia el poster en body.html. */
var VIDEOS={hero:['assets/video/hero.mp4','assets/video/hero.webm'],sacha:'',caps:['','','','','','','',''],pods:['','']};
var YEAR_COST=350000;

var NAV=[['Encontré un animal','encontre'],['Videos','videos'],['El rescate','rescate'],['Nosotros','nosotros'],['Fauna','fauna'],['Podcast','podcast']];

var FACTS=[
 {n:'2018',pat:'felino',t:'Sacha, una cría de ocelote, llega a manos de la Dra. Eliana Molineros tras ser rescatada de una tienda en Vinces. De ahí nace la fundación.',s:'Primicias',u:'https://www.primicias.ec/noticias/tecnologia/sacha-ocelote-espacio-cuidar-fauna-silvestre/'},
 {n:'+3.500',pat:'manchas',t:'animales silvestres y exóticos rescatados, recuperados o reubicados desde 2018 (cifra de inicios de 2023).',s:'Expreso',u:'https://www.expreso.ec/buenavida/proyecto-sacha-apresta-inaugurar-centro-rehabilitacion-fauna-silvestre-147100.html'},
 {n:'61 %',pat:'selva',t:'de las zarigüeyas corre riesgo de ser atropellada en las carreteras.',s:'Material de la fundación'},
 {n:'$350.000',pat:'rayas',t:'cuesta operar un año. Las donaciones hoy no alcanzan.',s:'Fundación Proyecto Sacha',cta:true}
];

/* Guía de acción: situación + tipo de animal = pasos, errores a evitar y datos para avisar */
var SITS=[
 {id:'herido',title:'Está herido o en peligro',sub:'Atropellado, atrapado, sangrando o con dificultad para moverse.',urg:'Urgente · avisa ya',
  do:['Mantén la distancia y no lo persigas: el estrés puede empeorar sus lesiones.','Aleja a perros, gatos y niños, y baja el ruido.','Toma una foto o un video corto desde lejos y anota la ubicación exacta.','Avisa al equipo de rescate de inmediato. Si te lo indican, cúbrelo con una tela y déjalo en una caja ventilada, oscura y tranquila.'],
  dont:['No le des comida, agua ni leche.','No lo cargues con las manos desnudas: por miedo puede morder o arañar.','No lo lleves a casa ni intentes curarlo.','No lo traslades por tu cuenta sin la indicación del equipo.'],
  ready:['Dirección o referencia exacta','Una foto desde lejos','Cómo se ve: sangrado, no se mueve, ala o pata dañada','Un teléfono para llamarte']},
 {id:'cria',title:'Es una cría y está sola',sub:'Sin pelo o plumas completas, o llorando, y no ves a la madre.',urg:'Prioritario',
  do:['Obsérvala desde lejos un buen rato: su madre puede estar cerca y no se acerca si hay personas.','Aleja a perros, gatos y niños, y evita los ruidos.','Si está en peligro inmediato (calle, lluvia, depredadores), avisa de inmediato.','Toma una foto y anota la hora, el lugar y cuántas crías hay.'],
  dont:['No la alimentes: ni leche, ni agua, ni comida de mascotas.','No la tomes en brazos ni la lleves a casa: aunque parezca abandonada, muchas veces no lo está.','No la conviertas en mascota: la tenencia de fauna silvestre está regulada por ley.'],
  ready:['Hora en que la viste','Lugar exacto','Cuántas crías hay','Una foto desde lejos']},
 {id:'casa',title:'Entró a mi casa, patio o techo',sub:'Está en un lugar donde no debería estar.',urg:'Evalúa con calma',
  do:['Mantén la calma y dale espacio: casi siempre quiere salir tanto como tú quieres que salga.','Encierra a las mascotas y saca a los niños de la habitación.','Abre puertas o ventanas hacia el exterior, baja el ruido y deja un camino libre.','Si no sale por su cuenta, toma una foto desde lejos y avisa al equipo.'],
  dont:['No lo acorrales ni lo golpees.','No uses insecticidas, humo ni trampas de pegamento.','No lo agarres con las manos.','No lo alimentes para que se quede.'],
  ready:['En qué parte de la casa está y hace cuánto','Una foto desde lejos','Si hay niños o mascotas cerca','Un teléfono para llamarte']},
 {id:'trafico',title:'Alguien lo tiene o lo vende',sub:'Está en una casa, un local o un anuncio como mascota o producto.',urg:'Denuncia',
  do:['Cuida tu seguridad: no confrontes a la persona.','Si puedes hacerlo sin riesgo, guarda fotos o capturas: enlace del anuncio, perfil, fecha y lugar.','Reporta con los datos que tengas. La fundación informa a la Unidad de Policía de Medio Ambiente y al Ministerio del Ambiente.'],
  dont:['No compres al animal: comprar alimenta el tráfico.','No intentes quitárselo a la persona.','No publiques datos de la persona en redes antes de reportar.'],
  ready:['Dirección o enlace del anuncio','Fotos o capturas','Tipo de animal','Fecha y hora']}
];
var ANIS=[
 {id:'mamifero',title:'Mamífero',eg:'zarigüeya, ardilla, murciélago',
  do:['Si es una zarigüeya, no hace falta ahuyentarla: casi siempre se aleja sola de noche. En un patio, déjale un camino libre hacia afuera.'],
  dont:['No la mates: es inofensiva para las personas.']},
 {id:'ave',title:'Ave',eg:'garrapatero, lechuza, loro',
  do:['Si tiene plumas y salta, sus padres suelen cuidarla desde cerca; si no tiene plumas o está herida, avisa.'],
  dont:['No le des agua con jeringa ni pan: puede ahogarse.']},
 {id:'reptil',title:'Reptil',eg:'iguana, serpiente, cocodrilo, tortuga',danger:true,
  do:['Si es una serpiente, mantente a distancia y no la pierdas de vista hasta que llegue el equipo.','Iguanas y tortugas: déjalas tranquilas; mirarlas de lejos también es respetarlas.'],
  dont:['No intentes capturar ni matar a una serpiente: sin experiencia no puedes saber si es venenosa.','No te acerques a un cocodrilo ni a la orilla donde está.']},
 {id:'grande',title:'Animal grande',eg:'felino, venado, mono, oso hormiguero',danger:true,
  do:['Aléjate sin darle la espalda ni correr, y mantén lejos a otras personas.'],
  dont:['No intentes tocarlo ni acorralarlo: un animal asustado puede defenderse.']},
 {id:'nose',title:'No sé qué es',eg:'una foto desde lejos ayuda a identificarlo',
  do:['No hace falta saberlo: una foto desde lejos ayuda al equipo a identificarlo.'],dont:[]}
];
var NUMS=[{k:'ECU 911',v:'911',note:'Emergencias. Úsalo si hay riesgo para personas o un animal peligroso en la vía pública.'},{k:'Línea de la fundación',v:'',note:'Número de reportes por definir.'}];

var TABS=[{name:'Convivir',pat:'selva'},{name:'La fundación',pat:'felino'},{name:'El rescate por dentro',pat:'rayas'}];
var CAPS=[
 {tab:0,title:'Mitos sobre la zarigüeya',dur:58,desc:'Lo que crees saber y por qué no es una amenaza.'},
 {tab:0,title:'Encontré una cría: ¿qué hago?',dur:72,desc:'Primeros pasos antes de llamar al equipo.'},
 {tab:0,title:'Convivir con fauna en la ciudad',dur:65,desc:'Hábitos simples para coexistir.'},
 {tab:1,title:'Quiénes somos',dur:90,desc:'El equipo y lo que nos mueve.'},
 {tab:1,title:'Un día en Proyecto Sacha',dur:70,desc:'Turnos, protocolos y cuidado diario.'},
 {tab:2,title:'Rescate en campo',dur:100,desc:'Cómo se contiene a un animal sin dañarlo.'},
 {tab:2,title:'Traslado a Santa Elena',dur:75,desc:'Logística y cuidados durante el viaje.'},
 {tab:2,title:'Rehabilitación y liberación',dur:85,desc:'El día en que vuelve a su hábitat.'}
];
var STEPS=[
 {title:'Recepción médica',icon:'i-med',pat:'felino',text:'Evaluación clínica inmediata y estabilización. Reciben los mismos exámenes que un perro o un gato, porque necesitan los mismos cuidados.',cap:8},
 {title:'Gestión legal',icon:'i-doc',pat:'manchas',text:'Cada ingreso se informa al Ministerio del Ambiente y a la Unidad de Policía de Medio Ambiente. La liberación se coordina con ellos.',cap:6},
 {title:'Logística y traslado',icon:'i-truck',pat:'selva',text:'Trasladar y liberar necesita vehículos, combustible y personal. Mientras espera, el animal sigue necesitando cuidados.',cap:7,loc:true},
 {title:'Rehabilitación y liberación',icon:'i-leaf',pat:'rayas',text:'Cuidado prolongado, a veces durante meses, hasta devolverlo a su hábitat.',cap:8}
];
var ALLIES=['Ministerio del Ambiente','Unidad de Policía de Medio Ambiente','Universidades, mediante convenios'];

var STORY=[
 'Sacha, una cría de ocelote de unos diez días de vida, llegó en junio de 2018 a manos de la Dra. Eliana Molineros. Estaba a la venta en una tienda de Vinces, en poder de traficantes de fauna silvestre.',
 'No pudo regresar a su hábitat, pero su historia dio origen a la Fundación Proyecto Sacha, que hoy rehabilita fauna del Guayas y la devuelve a su medio. La mascota que te acompaña en esta página se inspira en esa historia.'
];
var STORY_SRC=[['Vistazo','https://www.vistazo.com/estilo-de-vida/sostenibilidad/sacha-el-ocelote-que-no-pudo-regresar-a-su-habitat-pero-inspiro-un-enorme-proyecto-CE1336316'],['Primicias','https://www.primicias.ec/noticias/tecnologia/sacha-ocelote-espacio-cuidar-fauna-silvestre/']];
var TL=[
 ['Jun. 2018','Sacha llega desde Vinces, rescatada del tráfico de fauna.','Vistazo · Primicias'],
 ['2018','Del caso de Sacha nace la fundación, dedicada a rehabilitar fauna del Guayas y devolverla a su medio.','Vistazo'],
 ['2022','Unos 1.100 animales auxiliados solo en ese año.','Expreso'],
 ['Inicios de 2023','Más de 3.500 animales silvestres y exóticos rescatados, recuperados o reubicados desde 2018.','Expreso'],
 ['Proyectado','Centro de rehabilitación en Chanduy, Santa Elena, anunciado como el más grande de la costa. Estado de la obra por confirmar.','Vistazo']
];
var SEDES=[
 {n:'01',kind:'Centro urbano',name:'Guayaquil',pin:'Guayaquil',desc:'Recepción médica y rescates urbanos.',pos:[74.17,42.62],dx:0,dy:-32,q:'Guayaquil, Ecuador'},
 {n:'02',kind:'Centro rural',name:'Santa Elena',pin:'Centro rural',desc:'Rehabilitación y liberación.',pos:[54.71,52.0],dx:0,dy:34,q:'Chanduy, Santa Elena, Ecuador',note:'Ubicación referencial: vía Guayaquil–Santa Elena, sector Chanduy.'}
];
var MREF=[{name:'Santa Elena',pos:[17.12,45.11]}];

var FAUNA=[
 {n:'Zarigüeya común',l:'Didelphis marsupialis',g:'Mamífero',ani:'mamifero',pat:'manchas',t:'Marsupial nocturno que come insectos, frutas, carroña y pequeños animales. Ayuda a controlar plagas y a dispersar semillas. Es inofensiva: que transmita la rabia es un mito.',s:'UTPL',u:'https://noticias.utpl.edu.ec/printpdf/node/3592'},
 {n:'Ardilla de Guayaquil',l:'Simosciurus stramineus',g:'Mamífero',ani:'mamifero',pat:'selva',t:'Diurna y trepadora, común en parques y jardines. La fundación reportó ardillas muertas en Lomas de Urdesa tras una presunta fumigación municipal.',s:'Primicias',u:'https://www.primicias.ec/guayaquil/municipio-cuerpo-ardillas-urdesa-fumigacion-proyecto-sacha-104000/'},
 {n:'Mono aullador de la costa',l:'Alouatta palliata',g:'Mamífero',ani:'grande',pat:'selva',t:'Se oye mucho antes de verse. La fundación ha atendido ejemplares encontrados con desnutrición y lesiones.',s:'El Universo',u:'https://www.eluniverso.com/guayaquil/comunidad/fauna-ocelote-bebe-mono-aullador-proyecto-sacha-guayaquil-guayas-dos-mangas-nota/'},
 {n:'Ocelote',l:'Leopardus pardalis',g:'Mamífero',ani:'grande',pat:'felino',t:'Felino manchado y nocturno. Sacha, el rostro de la fundación, es un ocelote. Entre los casos reportados: crías en riesgo por mascotización y un ejemplar atacado por perros en Bucay.',s:'Vistazo',u:'https://www.vistazo.com/estilo-de-vida/sostenibilidad/meg-la-bebe-ocelote-en-peligro-por-la-quema-de-plantaciones-y-mascotizacion-CK6972334'},
 {n:'Iguana verde',l:'Iguana iguana',g:'Reptil',ani:'reptil',pat:'reptil',t:'Herbívora. Se la ve en parques y orillas tomando sol. Mirarla de lejos también es respetarla.'},
 {n:'Cocodrilo de la costa',l:'Crocodylus acutus',g:'Reptil',ani:'reptil',pat:'reptil',t:'Vive en manglares y estuarios del golfo de Guayaquil. Siempre estuvo aquí: la ciudad llegó después. Mantén distancia del agua.'},
 {n:'Boa',l:'Boa constrictor',g:'Reptil',ani:'reptil',pat:'rayas',t:'No es venenosa: atrapa a sus presas por constricción, sobre todo roedores y aves. Si la ves, no la toques: avisa.'},
 {n:'Garrapatero',l:'Crotophaga sulcirostris',g:'Ave',ani:'ave',pat:'selva',t:'Ave negra de pico curvo que anda en grupos por jardines y potreros y se alimenta de insectos.'},
 {n:'Lechuza de campanario',l:'Tyto alba',g:'Ave',ani:'ave',pat:'manchas',t:'Cazadora nocturna que se alimenta sobre todo de roedores. Anida en techos y construcciones.'}
];
var MYTHS=[
 ['La zarigüeya es peligrosa y transmite la rabia.','Es inofensiva y ayuda a controlar plagas. Que transmita la rabia es un mito.'],
 ['Si lo llevo a la fundación, el problema se resuelve.','El rescate recién empieza: hospitalización, trámites, traslado y meses de cuidado.'],
 ['El gobierno financia todo.','Operar cuesta $350.000 al año y las donaciones hoy no alcanzan.'],
 ['Sacha está en la Amazonía.','Estamos en Guayaquil y en Santa Elena, en la costa.']
];
var FAQS=[
 ['¿Las zarigüeyas son peligrosas?','No. Son tímidas y casi siempre huyen. Además ayudan a controlar insectos y roedores. Lo mejor es mantener distancia y alejar a las mascotas.'],
 ['¿Qué hago si encuentro una cría sola?','No siempre está abandonada: su madre puede estar cerca. Obsérvala desde lejos, aleja a las mascotas y avísanos antes de tocarla. Usa la guía de acción de esta página.'],
 ['¿Puedo quedarme con un animal que encontré?','No. La tenencia de fauna silvestre está regulada y la mayoría de los animales no sobrevive en una casa. Avisa y el equipo coordina con la autoridad ambiental.'],
 ['¿Qué pasa con el animal después del rescate?','Pasa por atención médica, trámites legales, traslado y un periodo de rehabilitación. Cuando está listo, vuelve a su hábitat.'],
 ['¿Puedo visitar los centros?','No. Por seguridad no recibimos visitas ni voluntarios externos: resguardamos animales que llegan de incautaciones y allanamientos. Trabajamos con universidades mediante convenios.']
];
var NEWS=[
 ['Vistazo','Sacha, el ocelote que no pudo regresar a su hábitat pero inspiró un enorme proyecto','https://www.vistazo.com/estilo-de-vida/sostenibilidad/sacha-el-ocelote-que-no-pudo-regresar-a-su-habitat-pero-inspiro-un-enorme-proyecto-CE1336316'],
 ['Primicias','Sacha, el ocelote que inspiró un espacio para cuidar de la fauna silvestre','https://www.primicias.ec/noticias/tecnologia/sacha-ocelote-espacio-cuidar-fauna-silvestre/'],
 ['Expreso','Proyecto Sacha apresta inaugurar un centro de rehabilitación de fauna silvestre','https://www.expreso.ec/buenavida/proyecto-sacha-apresta-inaugurar-centro-rehabilitacion-fauna-silvestre-147100.html'],
 ['Expreso','Zarigüeyas en Guayaquil: ¿en qué sectores de la ciudad es común verlas y qué hacer?','https://www.expreso.ec/guayaquil/zarigueeyas-en-guayaquil-en-que-sectores-de-la-ciudad-es-comun-verlas-y-que-hacer-264427.html'],
 ['UTPL','Las zarigüeyas de Ecuador y su función ecológica','https://noticias.utpl.edu.ec/printpdf/node/3592'],
 ['El Universo','Ocelote bebé y un mono aullador, encontrados con signos de desnutrición y lesiones','https://www.eluniverso.com/guayaquil/comunidad/fauna-ocelote-bebe-mono-aullador-proyecto-sacha-guayaquil-guayas-dos-mangas-nota/'],
 ['Vistazo','Un ocelote, que fue atacado por varios perros en Bucay, requiere de cirugías','https://www.vistazo.com/sostenibilidad/un-ocelote-que-fue-atacado-por-varios-perros-en-bucay-requiere-de-cirugias-AX2671763'],
 ['Expreso','Policía halla oso hormiguero herido por perros en recinto militar de Guayaquil','https://www.expreso.ec/guayaquil/policia-halla-oso-hormiguero-herido-por-perros-en-recinto-militar-de-guayaquil-279129.html'],
 ['El Comercio','En Ecuador existen 845 especies de fauna silvestre en riesgo de extinción','https://www.elcomercio.com/actualidad/ecuador-especies-fauna-silvestre-riesgo-extincion/']
];
var GAL=['Todo','Quirófano','Campo','Instalaciones','Logística'];
var PHOTOS=[[280,'Quirófano','Cirugía a un ejemplar con fractura'],[170,'Campo','Contención en vía pública'],[230,'Instalaciones','Recintos de rehabilitación'],[320,'Quirófano','Preparando medicación al amanecer'],[190,'Logística','Inventario de insumos'],[260,'Campo','Rescate nocturno'],[200,'Instalaciones','Zona de cuarentena'],[300,'Quirófano','Revisión clínica'],[170,'Logística','Carga de insumos para el traslado'],[240,'Campo','Primer contacto con el hábitat']];
var PAT={'Quirófano':'rayas','Campo':'selva','Instalaciones':'felino','Logística':'manchas'};
var PODS=['Episodio 1 · Tema por definir','Episodio 2 · Tema por definir'];
var SOC=[['Instagram','Fotos y reels del día a día. Es nuestro canal principal.',true],['TikTok','Videos cortos sobre convivencia con la fauna.'],['Facebook','Comunidad, avisos y novedades.'],['YouTube','Podcast y videos completos.']];
var AMTS=[5,10,25,50];
var BANK=[['Banco','Banco Internacional'],['Cuenta corriente','1400625249'],['A nombre de','Fundación Proyecto Sacha'],['RUC','0993242721001'],['Correo','donaciones@proyectosacha.org']];

/* ======================  UTILIDADES  ====================== */
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var reduced=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var S={cap:0,sede:0,faq:0,gal:'Todo',fg:'Todos',lb:-1,pod:0,auto:true,playing:null,prog:{sacha:0,cap:0,pod:0},amt:2,custom:'',freq:1,giveStep:0,cTried:false,cOk:false,c:{org:'',name:'',mail:'',kind:'',msg:''},node:0};
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function fmt(s){s=Math.round(s);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
function ico(id){return '<svg class="ic" aria-hidden="true"><use href="#'+id+'"/></svg>'}
function toast(m){var t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(function(){t.classList.remove('show')},2400)}
function copy(txt,msg){function ok(){toast(msg||'Copiado')}function fb(){var a=document.createElement('textarea');a.value=txt;a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();try{document.execCommand('copy');ok()}catch(e){toast('Selecciona el texto y cópialo')}a.remove()}try{navigator.clipboard.writeText(txt).then(ok,fb)}catch(e){fb()}}
function go(id){var el=document.getElementById(id);if(!el)return;window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-58,behavior:reduced?'auto':'smooth'});closeMenu()}

/* ======================  NAVEGACIÓN  ====================== */
$('#nav').innerHTML=NAV.map(function(n){return '<button data-go="'+n[1]+'" data-nav="'+n[1]+'">'+n[0]+'</button>'}).join('');
$('#menuList').innerHTML=NAV.concat([['Donar','donar'],['Redes','redes']]).map(function(n){return '<button data-go="'+n[1]+'">'+n[0]+'</button>'}).join('');
function closeMenu(){$('#menu').classList.remove('open');$('#burger').setAttribute('aria-expanded','false')}
$('#burger').addEventListener('click',function(){var o=$('#menu').classList.toggle('open');this.setAttribute('aria-expanded',o?'true':'false')});
$('#goTop').addEventListener('click',function(){window.scrollTo({top:0,behavior:reduced?'auto':'smooth'});closeMenu()});
$('#toTop').addEventListener('click',function(){window.scrollTo({top:0,behavior:reduced?'auto':'smooth'})});
document.addEventListener('click',function(e){
  var g=e.target.closest('[data-go]');if(g){e.preventDefault();go(g.getAttribute('data-go'))}
  var n=e.target.closest('[data-noop]');if(n){e.preventDefault();toast('Este enlace se conecta cuando esté definido')}
  var c=e.target.closest('[data-copy-num]');if(c){var v=c.getAttribute('data-copy-num');copy(v,v+' copiado')}
});
var SPY=[['inicio',null],['encontre','encontre'],['videos','videos'],['rescate','rescate'],['galeria','rescate'],['nosotros','nosotros'],['ubicacion','nosotros'],['fauna','fauna'],['podcast','podcast'],['donar',null],['redes',null],['contacto',null]];
var lastAct='',lastShow=null;
function onScroll(){
  var y=window.scrollY,h=document.documentElement.scrollHeight-window.innerHeight,act=null;
  SPY.forEach(function(p){var el=document.getElementById(p[0]);if(el&&el.getBoundingClientRect().top<=160)act=p[1]});
  $('#prog').style.width=(h>0?Math.min(100,y/h*100):0)+'%';
  if(act!==lastAct){lastAct=act;$$('#nav button').forEach(function(b){if(b.getAttribute('data-nav')===act)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current')})}
  var t=$('#encontre').getBoundingClientRect(),d=$('#donar').getBoundingClientRect(),
      show=y>700&&!(t.top<window.innerHeight*.6&&t.bottom>window.innerHeight*.3)&&!(d.top<window.innerHeight&&d.bottom>0);
  if(show!==lastShow){lastShow=show;$('#fab').classList.toggle('show',show)}
  stepSpy();
}
window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);

/* ======================  INICIO: VIDEO DE FONDO SIN AUDIO  ====================== */
(function(){
  var v=$('#heroVid'),b=$('#heroPause'),lab=$('span',b),use=$('use',b),manual=false,auto=false,srcs=[].concat(VIDEOS.hero||[]),fails=0;
  if(!srcs.length){b.style.display='none';return}
  if(reduced)v.removeAttribute('autoplay');
  v.innerHTML=srcs.map(function(u){return '<source src="'+u+'" type="video/'+(/\.webm$/.test(u)?'webm':'mp4')+'">'}).join('');
  v.load();
  function ui(p){lab.textContent=p?'Pausar video':'Reproducir video';b.setAttribute('aria-label',p?'Pausar el video de fondo':'Reproducir el video de fondo');use.setAttribute('href',p?'#i-pause':'#i-play')}
  function play(){var p=v.play();if(p&&p.catch)p.catch(function(){})}
  v.addEventListener('play',function(){ui(true)});v.addEventListener('pause',function(){ui(false)});
  /* si ningún formato carga, queda el poster y se oculta el botón */
  v.addEventListener('error',function(){if(++fails>=srcs.length)b.style.display='none'},true);
  ui(false);
  b.addEventListener('click',function(){manual=true;if(v.paused)play();else v.pause()});
  /* ahorra batería: pausa fuera de pantalla y reanuda solo si no lo pausó la persona */
  if('IntersectionObserver' in window)new IntersectionObserver(function(es){
    if(!es[0].isIntersecting){if(!v.paused){auto=true;v.pause()}}
    else if(auto&&!manual){auto=false;play()}
  },{threshold:.05}).observe($('#inicio'));
})();

/* ======================  CIFRAS  ====================== */
$('#facts').innerHTML=FACTS.map(function(f){
  var src='<cite>Fuente: '+(f.u?'<a href="'+f.u+'" target="_blank" rel="noopener">'+esc(f.s)+'</a>':esc(f.s))+'</cite>';
  return '<div class="fact"><b class="pf tone '+f.pat+'">'+esc(f.n)+'</b><p>'+esc(f.t)+'</p>'+src+(f.cta?'<button class="btn pri sm" data-go="donar">Donar</button>':'')+'</div>'}).join('');

/* ======================  GUÍA DE ACCIÓN: ENCONTRÉ UN ANIMAL  ====================== */
var T={step:0,sit:-1,ani:-1,chk:{},tried:false,sent:false,f:{type:'',sit:'',where:'',desc:'',name:'',phone:'',ok:false,photo:''}};
function reach(){return T.sit<0?0:(T.ani<0?1:3)}
function validPhone(p){return String(p).replace(/\D/g,'').length>=7}
function stepper(){
  var L=['Situación','Animal','Qué hacer','Avisar'],r=reach();
  return '<ol class="tsteps">'+L.map(function(l,i){
    var cur=T.step===i,done=i<T.step||(T.sent&&i===3);
    return '<li><button class="'+(done?'done':'')+'" '+(cur?'aria-current="step" ':'')+(i>r?'disabled ':'')+'data-tstep="'+i+'"><span class="n">'+(done?ico('i-check'):(i+1))+'</span><span>'+l+'</span></button></li>'}).join('')+'</ol>';
}
function safety(){return '<div class="safety">'+ico('i-alert')+'<p>Tu seguridad va primero. Si hay riesgo para personas (un animal agresivo, una serpiente cerca de niños, un cocodrilo en la vía pública), llama al <button data-copy-num="911" aria-label="Copiar el número 911">911</button> antes de seguir.</p></div>'}
function bodySit(){
  var chosen=T.ani>=0?'<p class="small">Tipo de animal elegido: <b>'+esc(ANIS[T.ani].title)+'</b>. <button class="linkbtn" data-tstep="1">Cambiar</button></p>':'';
  return '<div class="tbody"><h3 class="tq" id="tq" tabindex="-1">¿Qué está pasando?</h3>'+chosen+'<div class="opts">'+SITS.map(function(s,i){return '<button class="opt" data-sit="'+i+'" aria-pressed="'+(T.sit===i)+'"><b>'+s.title+'</b><span>'+s.sub+'</span></button>'}).join('')+'</div>'+safety()+'</div>';
}
function bodyAni(){
  return '<div class="tbody"><h3 class="tq" id="tq" tabindex="-1">¿Qué tipo de animal es?</h3><div class="opts">'+ANIS.map(function(a,i){return '<button class="opt" data-ani="'+i+'" aria-pressed="'+(T.ani===i)+'"><b>'+a.title+'</b><span>'+a.eg+'</span></button>'}).join('')+'</div><div class="backrow"><button class="linkbtn" data-tstep="0">← Cambiar la situación</button></div></div>';
}
function guideLists(){var s=SITS[T.sit],a=ANIS[T.ani];return {s:s,a:a,doL:s.do.concat(a.do),dontL:s.dont.concat(a.dont)}}
function bodyRes(){
  var g=guideLists();
  return '<div class="tbody"><div class="rhead"><div class="row"><span class="urgtag">'+g.s.urg+'</span><span class="tag">'+esc(g.a.title)+'</span></div><h3 class="tq" id="tq" tabindex="-1">'+g.s.title+'</h3></div>'+
   (g.a.danger?'<div class="safety">'+ico('i-alert')+'<p>Si hay riesgo para personas, llama primero al <button data-copy-num="911" aria-label="Copiar el número 911">911</button>.</p></div>':'')+
   '<div class="rcols"><div class="rbox"><h4>Haz esto</h4>'+g.doL.map(function(x,i){var k='d'+i;return '<button class="chk" role="checkbox" aria-checked="'+!!T.chk[k]+'" data-chk="'+k+'"><i>'+ico('i-check')+'</i><span>'+esc(x)+'</span></button>'}).join('')+'</div>'+
   '<div class="rbox"><h4>No hagas esto</h4><ul class="nox">'+g.dontL.map(function(x){return '<li>'+ico('i-x')+'<span>'+esc(x)+'</span></li>'}).join('')+'</ul></div></div>'+
   '<div class="rbox"><h4>Ten a mano para avisar</h4><div class="ready">'+g.s.ready.map(function(r){return '<span class="tag">'+esc(r)+'</span>'}).join('')+'</div></div>'+
   '<div class="ract"><button class="btn urg" data-tstep="3">Reportar este caso '+ico('i-arrow')+'</button><button class="btn line" data-copyguide>Copiar guía</button><button class="linkbtn" data-tstep="1">← Cambiar tipo de animal</button><button class="linkbtn" data-treset>Empezar de nuevo</button></div></div>';
}
function fld(id,label,inner,bad,err,wide){return '<div class="fld'+(bad?' bad':'')+(wide?' wide':'')+'"><label for="'+id+'">'+label+'</label>'+inner+'<span class="err" role="alert">'+err+'</span></div>'}
function bodyForm(){
  var f=T.f,t=T.tried;
  return '<div class="tbody"><div class="rhead"><span class="label">Último paso</span><h3 class="tq" id="tq" tabindex="-1">Avisa al equipo</h3><p class="small">Llena lo que sepas. Lo mínimo es dónde está y cómo contactarte.</p></div>'+
   '<form id="repForm" novalidate><div class="fgrid">'+
   fld('rType','Tipo de animal','<select id="rType">'+ANIS.map(function(a){return '<option value="'+a.id+'"'+(f.type===a.id?' selected':'')+'>'+a.title+'</option>'}).join('')+'</select>',false,'')+
   fld('rSit','Situación','<select id="rSit">'+SITS.map(function(s){return '<option value="'+s.id+'"'+(f.sit===s.id?' selected':'')+'>'+s.title+'</option>'}).join('')+'</select>',false,'')+
   fld('rWhere','¿Dónde está? *','<input id="rWhere" autocomplete="street-address" placeholder="Calle, sector o referencia" value="'+esc(f.where)+'">',t&&!f.where.trim(),'Indica dónde está',true)+
   fld('rDesc','Descripción (opcional)','<textarea id="rDesc" placeholder="Cómo se ve, cuántos son, hace cuánto lo viste">'+esc(f.desc)+'</textarea>',false,'',true)+
   fld('rPhoto','Foto (opcional)','<input id="rPhoto" type="file" accept="image/*"><img class="photo-prev'+(f.photo?' on':'')+'" id="photoPrev" alt="Vista previa de la foto"'+(f.photo?' src="'+f.photo+'"':'')+'>',false,'',true)+
   fld('rName','Tu nombre *','<input id="rName" autocomplete="name" value="'+esc(f.name)+'">',t&&!f.name.trim(),'Escribe tu nombre')+
   fld('rPhone','Tu teléfono *','<input id="rPhone" type="tel" inputmode="tel" autocomplete="tel" value="'+esc(f.phone)+'">',t&&!validPhone(f.phone),'Teléfono no válido')+
   '</div><label class="consent'+(t&&!f.ok?' bad':'')+'" style="margin-top:14px"><input type="checkbox" id="rOk"'+(f.ok?' checked':'')+'><span>Acepto que la fundación use estos datos solo para atender este caso.</span></label>'+
   '<div class="ract" style="margin-top:18px"><button class="btn urg" type="submit">Preparar reporte</button><button class="linkbtn" type="button" data-tstep="2">← Volver a la guía</button></div></form>'+
   '<p class="proto">Maqueta: por ahora el reporte no se envía. Al prepararlo podrás copiarlo para mandarlo por los canales de la fundación.</p></div>';
}
function lookup(list,id){return list.filter(function(x){return x.id===id})[0]||list[0]}
function reportText(){
  var f=T.f;
  return ['REPORTE DE FAUNA SILVESTRE · Proyecto Sacha','Fecha: '+new Date().toLocaleString('es-EC'),'Situación: '+lookup(SITS,f.sit).title,'Animal: '+lookup(ANIS,f.type).title,'Ubicación: '+f.where.trim(),'Descripción: '+(f.desc.trim()||'—'),'Contacto: '+f.name.trim()+' · '+f.phone.trim(),f.photo?'Foto: adjuntar aparte':'Foto: no'].join('\n');
}
function bodySent(){
  var f=T.f;
  return '<div class="tbody"><div class="rhead"><span class="urgtag" style="background:var(--accent)">Reporte preparado</span><h3 class="tq" id="tq" tabindex="-1">Gracias por avisar, '+esc(f.name.trim().split(/\s+/)[0])+'</h3></div>'+
   '<dl class="sumbox"><div><dt>Situación</dt><dd>'+esc(lookup(SITS,f.sit).title)+'</dd></div><div><dt>Animal</dt><dd>'+esc(lookup(ANIS,f.type).title)+'</dd></div><div><dt>Ubicación</dt><dd>'+esc(f.where)+'</dd></div>'+(f.desc.trim()?'<div><dt>Descripción</dt><dd>'+esc(f.desc)+'</dd></div>':'')+'<div><dt>Contacto</dt><dd>'+esc(f.name)+' · '+esc(f.phone)+'</dd></div></dl>'+
   (f.photo?'<img class="photo-prev on" src="'+f.photo+'" alt="Foto adjunta al reporte">':'')+
   '<div class="ract"><button class="btn pri" data-copyrep>Copiar reporte</button><button class="btn line" data-treset>Nuevo reporte</button></div>'+
   '<p class="proto">Maqueta: el reporte aún no llega a la fundación. Cuando se conecte el canal oficial, este paso lo enviará al equipo. Mientras tanto, copia el texto y compártelo por los canales de la fundación. Si hay riesgo para personas, llama al 911.</p></div>';
}
function sachaSay(){
  if(T.sent)return ['Gracias por avisar.','Ya hiciste lo más importante. Copia el reporte y compártelo con el equipo.'];
  return [['Primero, respira.','Cuéntame qué está pasando y te explico qué hacer.'],['Ya casi.','Con saber el tipo de animal ajusto las indicaciones.'],['Con calma.','Sigue estos pasos y marca los que ya hiciste.'],['Un último paso.','Con estos datos el equipo puede ubicarlo más rápido.']][T.step];
}
function renderGuide(){var m=sachaSay();$('#guide').innerHTML='<div class="bubble"><b>'+m[0]+'</b>'+m[1]+'</div><img src="assets/mascot/sacha-saluda.webp" alt="Sacha, la guía" width="1228" height="1976" loading="lazy">'}
function renderTool(focus){
  var b=T.step===0?bodySit():T.step===1?bodyAni():T.step===2?bodyRes():(T.sent?bodySent():bodyForm());
  $('#tmain').innerHTML=stepper()+b;renderGuide();
  if(focus){var q=$('#tq');if(q)q.focus({preventScroll:true});var r=$('#tmain').getBoundingClientRect();if(r.top<70||r.top>window.innerHeight*.5)window.scrollTo({top:r.top+window.scrollY-84,behavior:reduced?'auto':'smooth'})}
}
function prepForm(){if(T.ani>=0)T.f.type=ANIS[T.ani].id;if(T.sit>=0)T.f.sit=SITS[T.sit].id}
function resetTool(){T={step:0,sit:-1,ani:-1,chk:{},tried:false,sent:false,f:{type:'',sit:'',where:'',desc:'',name:'',phone:'',ok:false,photo:''}}}
$('#nums').innerHTML='<span class="label">Números útiles</span>'+NUMS.map(function(n){return '<div class="num"><div><b'+(n.v?'':' class="p"')+'>'+(n.v||n.k)+'</b><small>'+(n.v?n.k+'. ':'')+n.note+'</small></div>'+(n.v?'<button class="cpy" data-copy-num="'+n.v+'">'+ico('i-copy')+'Copiar</button>':'<span class="tag dash">por definir</span>')+'</div>'}).join('');
document.addEventListener('click',function(e){
  var el;
  if((el=e.target.closest('[data-sit]'))){T.sit=+el.getAttribute('data-sit');T.chk={};T.sent=false;T.step=T.ani>=0?2:1;renderTool(true);return}
  if((el=e.target.closest('[data-ani]'))){T.ani=+el.getAttribute('data-ani');T.chk={};T.sent=false;T.step=2;renderTool(true);return}
  if((el=e.target.closest('[data-tstep]'))){var n=+el.getAttribute('data-tstep');if(n<=reach()){T.step=n;if(n===3)prepForm();renderTool(true)}return}
  if((el=e.target.closest('[data-chk]'))){var k=el.getAttribute('data-chk');T.chk[k]=!T.chk[k];el.setAttribute('aria-checked',!!T.chk[k]);return}
  if(e.target.closest('[data-treset]')){resetTool();renderTool(true);return}
  if(e.target.closest('[data-copyguide]')){
    var g=guideLists();
    copy(['Qué hacer si encuentras un animal silvestre · '+g.s.title+' · '+g.a.title,'','HAZ ESTO']
      .concat(g.doL.map(function(x,i){return (i+1)+'. '+x}),['','NO HAGAS ESTO'],g.dontL.map(function(x){return '- '+x}),['','Si hay riesgo para personas, llama al 911.']).join('\n'),'Guía copiada');return}
  if(e.target.closest('[data-copyrep]')){copy(reportText(),'Reporte copiado');return}
  if((el=e.target.closest('[data-fani]'))){var id=el.getAttribute('data-fani');T.ani=ANIS.map(function(a){return a.id}).indexOf(id);T.chk={};T.sent=false;T.step=T.sit>=0?2:0;renderTool(false);go('encontre')}
});
document.addEventListener('input',function(e){
  var m={rWhere:'where',rDesc:'desc',rName:'name',rPhone:'phone'}[e.target.id];if(m)T.f[m]=e.target.value;
});
document.addEventListener('change',function(e){
  var id=e.target.id;
  if(id==='rType')T.f.type=e.target.value;
  if(id==='rSit')T.f.sit=e.target.value;
  if(id==='rOk')T.f.ok=e.target.checked;
  if(id==='rPhoto'){
    var file=e.target.files&&e.target.files[0],pv=$('#photoPrev');
    if(T.f.photo&&T.f.photo.indexOf('blob:')===0)URL.revokeObjectURL(T.f.photo);
    if(file&&file.type.indexOf('image/')===0){T.f.photo=URL.createObjectURL(file);pv.src=T.f.photo;pv.classList.add('on')}
    else{T.f.photo='';pv.classList.remove('on');pv.removeAttribute('src');if(file){toast('Elige una imagen (JPG o PNG)');e.target.value=''}}
  }
});
document.addEventListener('submit',function(e){
  if(e.target.id!=='repForm')return;e.preventDefault();
  var f=T.f,ok=f.where.trim()&&f.name.trim()&&validPhone(f.phone)&&f.ok;
  if(ok){T.sent=true;T.tried=false}else T.tried=true;
  renderTool(false);
  if(ok){var q=$('#tq');if(q)q.focus({preventScroll:true})}
  else{var b=$('#repForm .bad input')||$('#repForm .consent.bad input');if(b)b.focus()}
});

/* ======================  PORTADAS Y REPRODUCTORES  ====================== */
var ICON_PLAY='<svg viewBox="0 0 16 16"><path d="M4 2l10 6-10 6z"/></svg>',ICON_PAUSE='<svg viewBox="0 0 16 16"><path d="M3 2h4v12H3zM9 2h4v12H9z"/></svg>';
var PL={sacha:{el:'#pl-sacha',dur:60},cap:{el:'#pl-cap',dur:0},pod:{el:'#pl-pod',dur:1800}};
function curDur(k){return k==='cap'?CAPS[S.cap].dur:PL[k].dur}
function mascotImg(){return '<img class="mini" src="assets/mascot/sacha-saluda.webp" alt="" width="1228" height="1976" loading="lazy">'}
function wideHTML(k,coverHtml,src){
  var stage=src?'<video src="'+esc(src)+'" controls playsinline preload="metadata"></video>':coverHtml+'<span class="badge">Video pendiente · vista de maqueta</span><button class="bigplay" data-play="'+k+'" aria-label="Reproducir"></button>';
  return '<div class="stage">'+stage+'</div>'+(src?'':'<div class="controls"><button class="pp" data-play="'+k+'" aria-label="Reproducir o pausar"></button><div class="track2" data-seek="'+k+'"><div><i></i></div></div><time></time></div>');
}
function paint(k){
  var p=$(PL[k].el);if(!p)return;
  p.classList.toggle('playing',S.playing===k);
  var i=$('.track2 i',p),t=$('time',p),b=$('.pp',p);
  if(i)i.style.width=S.prog[k]+'%';
  if(t)t.textContent=fmt(curDur(k)*S.prog[k]/100)+' / '+fmt(curDur(k));
  if(b)b.innerHTML=S.playing===k?ICON_PAUSE:ICON_PLAY;
}
function renderPlayers(){
  $('#pl-sacha').innerHTML=wideHTML('sacha','<div class="cover"><div class="pt" style="background-image:url(assets/patterns/tone-sage-felino.svg)"></div>'+mascotImg()+'<div class="ct"><small>Video · Mascota</small><h3>¿Quién es Sacha?</h3></div></div>',VIDEOS.sacha);
  renderReel();
  var bars='';for(var i=0;i<34;i++){bars+='<i style="height:'+(30+Math.abs(Math.sin(i*1.7))*70).toFixed(0)+'%;animation-delay:'+(i*0.07).toFixed(2)+'s"></i>'}
  $('#pl-pod').innerHTML=wideHTML('pod','<div class="cover"><div class="pt" style="background-image:url(assets/patterns/tone-sage-manchas.svg)"></div><div class="wave">'+bars+'</div><div class="ct"><small>Podcast en video</small><h3>'+esc(PODS[S.pod])+'</h3></div></div>',VIDEOS.pods[S.pod]);
  ['sacha','cap','pod'].forEach(paint);
}
function renderReel(){
  var c=CAPS[S.cap],src=VIDEOS.caps[S.cap],el=$('#pl-cap');
  el.innerHTML=src?'<video src="'+esc(src)+'" controls playsinline preload="metadata"></video>':
   '<div class="cover"><div class="pt" style="background-image:url(assets/patterns/tone-sage-'+TABS[c.tab].pat+'.svg)"></div><span class="num">'+(S.cap+1)+'</span><div class="ct"><small>'+esc(TABS[c.tab].name)+'</small><h3>'+esc(c.title)+'</h3></div>'+mascotImg()+'</div><span class="badge">Video pendiente</span><button class="bigplay" data-play="cap" aria-label="Reproducir"></button><div class="ctl"><button class="pp" data-play="cap" aria-label="Reproducir o pausar"></button><div class="track2" data-seek="cap"><div><i></i></div></div><time></time></div>';
  paint('cap');
}
setInterval(function(){
  var k=S.playing;if(!k)return;
  var v=S.prog[k]+100/300;
  if(v<100){S.prog[k]=v;paint(k);return}
  S.prog[k]=0;
  if(k==='cap'&&S.auto&&S.cap<CAPS.length-1){selectCap(S.cap+1,true);return}
  S.playing=null;paint(k);
},100);
function toggle(k){S.playing=(S.playing===k)?null:k;['sacha','cap','pod'].forEach(paint)}
document.addEventListener('click',function(e){
  var p=e.target.closest('[data-play]');if(p){toggle(p.getAttribute('data-play'));return}
  var s=e.target.closest('[data-seek]');if(s){var k=s.getAttribute('data-seek'),r=s.getBoundingClientRect();S.prog[k]=Math.max(0,Math.min(99,(e.clientX-r.left)/r.width*100));paint(k)}
});

/* ======================  VIDEOS  ====================== */
function renderCaps(){
  var c=CAPS[S.cap];
  $('#capTabs').innerHTML=TABS.map(function(t,i){var n=CAPS.filter(function(x){return x.tab===i}).length;return '<button class="tab" role="tab" aria-selected="'+(c.tab===i)+'" data-tab="'+i+'">'+t.name+' <small>('+n+')</small></button>'}).join('');
  $('#capKick').textContent='Video '+(S.cap+1)+' de '+CAPS.length+' · '+TABS[c.tab].name;
  $('#capTitle').textContent=c.title;$('#capDesc').textContent=c.desc;
  $('#capPrev').style.opacity=S.cap>0?1:.35;$('#capNext').style.opacity=S.cap<CAPS.length-1?1:.35;
  $('#relHead').textContent='Más en '+TABS[c.tab].name;
  $('#eplist').innerHTML=CAPS.map(function(x,i){return {x:x,i:i}}).filter(function(o){return o.x.tab===c.tab}).map(function(o){
    return '<button class="eprow" data-cap="'+o.i+'" aria-current="'+(o.i===S.cap)+'"><span class="n">'+(o.i+1)+'</span><b>'+esc(o.x.title)+'</b><time>'+fmt(o.x.dur)+'</time></button>'}).join('');
}
function selectCap(i,play){
  S.cap=Math.max(0,Math.min(CAPS.length-1,i));S.prog.cap=0;
  S.playing=play?'cap':(S.playing==='cap'?null:S.playing);
  renderCaps();renderReel();
}
$('#capTabs').addEventListener('click',function(e){var b=e.target.closest('[data-tab]');if(!b)return;var t=+b.getAttribute('data-tab');selectCap(CAPS.findIndex(function(x){return x.tab===t}),false)});
$('#eplist').addEventListener('click',function(e){var b=e.target.closest('[data-cap]');if(b)selectCap(+b.getAttribute('data-cap'),true)});
$('#capPrev').addEventListener('click',function(){if(S.cap>0)selectCap(S.cap-1,true)});
$('#capNext').addEventListener('click',function(){if(S.cap<CAPS.length-1)selectCap(S.cap+1,true)});
$('#autoplay').addEventListener('click',function(){S.auto=!S.auto;this.setAttribute('aria-pressed',S.auto)});
$('#capShare').addEventListener('click',function(){copy(location.href.split('#')[0]+'#videos','Enlace copiado')});

/* ======================  EL RESCATE  ====================== */
$('#nodes').innerHTML=STEPS.map(function(s,i){return '<li><button data-node="'+i+'" aria-current="'+(i===0)+'">'+(i+1)+' · '+s.title+'</button></li>'}).join('');
$('#allies').innerHTML=ALLIES.map(function(a){return '<li>'+a+'</li>'}).join('');
$('#steps').innerHTML=STEPS.map(function(s,i){
  return '<article class="stp" data-step="'+i+'" data-rv><span class="ico">'+ico(s.icon)+'</span><span class="big pf tone '+s.pat+'">'+(i+1)+'</span><h3>'+s.title+'</h3><p class="txt">'+s.text+'</p><div class="row">'+(s.loc?'<span class="tag dash">Guayaquil ↔ Santa Elena</span>':'')+'<button class="btn line sm" data-stepcap="'+s.cap+'">'+ico('i-play')+' Ver en el video '+s.cap+'</button></div></article>'}).join('');
function stepSpy(){
  var best=0,mid=window.innerHeight*.45;
  $$('.stp').forEach(function(el,i){var b=el.getBoundingClientRect();if(b.top<=mid)best=i});
  if(best!==S.node){S.node=best;$$('#nodes button').forEach(function(b,i){b.setAttribute('aria-current',i===best)})}
}
document.addEventListener('click',function(e){
  var n=e.target.closest('[data-node]');if(n){var el=$$('.stp')[+n.getAttribute('data-node')];if(el)window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-110,behavior:reduced?'auto':'smooth'});return}
  var c=e.target.closest('[data-stepcap]');if(c){selectCap(+c.getAttribute('data-stepcap')-1,true);go('videos')}
});

/* ======================  GALERÍA  ====================== */
function visPhotos(){return PHOTOS.map(function(p,i){return {h:p[0],cat:p[1],cap:p[2],n:i+1}}).filter(function(p){return S.gal==='Todo'||p.cat===S.gal})}
function phArt(p){return '<div class="pt" style="background-image:url(assets/patterns/tone-sage-'+PAT[p.cat]+'.svg)"></div><div class="cam"><span>'+ico('i-cam')+'</span></div>'}
function renderGallery(){
  $('#filters').innerHTML=GAL.map(function(g){return '<button class="filter" data-gal="'+g+'" aria-pressed="'+(S.gal===g)+'">'+g+'</button>'}).join('');
  var v=visPhotos();
  $('#masonry').innerHTML=v.map(function(p,i){return '<button class="ph" data-ph="'+i+'" style="height:'+p.h+'px" aria-label="Ampliar foto: '+esc(p.cap)+'">'+phArt(p)+'<span class="id">'+p.cat+' · '+String(p.n).padStart(2,'0')+'</span><span class="cp">'+esc(p.cap)+'</span></button>'}).join('');
  $('#photoCount').textContent='Mostrando '+v.length+' de '+PHOTOS.length+' fotos · los marcos se llenan con las fotos del rodaje';
}
var lastFocus=null;
function openLb(i){var v=visPhotos();S.lb=(i+v.length)%v.length;var p=v[S.lb];
  $$('#lbView .pt,#lbView .cam').forEach(function(n){n.remove()});
  $('#lbView').insertAdjacentHTML('afterbegin',phArt(p));
  $('#lbN').textContent=(S.lb+1)+' / '+v.length;$('#lbCap').textContent=p.cap;$('#lbCat').textContent=p.cat+' · foto pendiente de cargar';
  $('#lb').classList.add('open');}
function closeLb(){$('#lb').classList.remove('open');S.lb=-1;if(lastFocus)lastFocus.focus()}
document.addEventListener('click',function(e){
  var g=e.target.closest('[data-gal]');if(g){S.gal=g.getAttribute('data-gal');renderGallery();return}
  var p=e.target.closest('[data-ph]');if(p){lastFocus=p;openLb(+p.getAttribute('data-ph'));$('#lbClose').focus();return}
  if(e.target.id==='lbClose'||e.target===$('#lb'))closeLb();
  if(e.target.id==='lbPrev')openLb(S.lb-1);
  if(e.target.id==='lbNext')openLb(S.lb+1);
});
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){if(S.lb>=0)closeLb();closeMenu()}
  if(S.lb>=0&&e.key==='ArrowRight')openLb(S.lb+1);
  if(S.lb>=0&&e.key==='ArrowLeft')openLb(S.lb-1);
});

/* ======================  NOSOTROS: HISTORIA, LÍNEA DE TIEMPO Y MAPA  ====================== */
$('#story').innerHTML=STORY.map(function(p){return '<p>'+esc(p)+'</p>'}).join('')+'<p class="src">Fuentes: '+STORY_SRC.map(function(s){return '<a href="'+s[1]+'" target="_blank" rel="noopener">'+s[0]+'</a>'}).join(' · ')+'</p>';
$('#timeline').innerHTML=TL.map(function(t){return '<li><b>'+t[0]+'</b><span>'+esc(t[1])+' <span class="src">'+t[2]+'</span></span></li>'}).join('');
function renderMap(){
  var box=$('#mapbox');$$('.mpin,.mref',box).forEach(function(n){n.remove()});
  MREF.forEach(function(r){var d=document.createElement('div');d.className='mref';d.style.left=r.pos[0]+'%';d.style.top=r.pos[1]+'%';d.innerHTML='<i></i><span>'+r.name+'</span>';box.appendChild(d)});
  SEDES.forEach(function(d,i){var b=document.createElement('button');b.className='mpin';b.style.left=d.pos[0]+'%';b.style.top=d.pos[1]+'%';b.style.setProperty('--dx',d.dx+'px');b.style.setProperty('--dy',d.dy+'px');b.setAttribute('aria-pressed',S.sede===i);b.setAttribute('data-sede',i);b.setAttribute('aria-label','Sede: '+d.pin);b.innerHTML='<i></i><span>'+d.pin+'</span>';box.appendChild(b)});
  $('#sedes').innerHTML=SEDES.map(function(d,i){
    return '<div class="sede'+(S.sede===i?' on':'')+'"><span class="label">Sede '+d.n+' · '+d.kind+'</span><h3><button data-sede="'+i+'" aria-pressed="'+(S.sede===i)+'">'+d.name+'</button></h3><span>'+d.desc+'</span><span class="meta"><span>Dirección: por confirmar</span><span>Horario: por confirmar</span>'+(d.note?'<span>'+d.note+'</span>':'')+'</span><a class="btn line sm" href="https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(d.q)+'" target="_blank" rel="noopener">Ver zona en Google Maps '+ico('i-ext')+'</a></div>'}).join('')+
    '<div class="callout">'+ico('i-info')+'<p>Por seguridad no recibimos visitas en los centros: resguardamos animales que llegan de incautaciones y allanamientos.</p></div>';
}
document.addEventListener('click',function(e){var b=e.target.closest('[data-sede]');if(b){S.sede=+b.getAttribute('data-sede');renderMap()}});

/* ======================  FAUNA, MITOS Y PREGUNTAS  ====================== */
function renderFauna(){
  var G=['Todos','Mamífero','Ave','Reptil'],L={'Todos':'Todos','Mamífero':'Mamíferos','Ave':'Aves','Reptil':'Reptiles'};
  $('#ffilters').innerHTML=G.map(function(g){return '<button class="filter" data-fg="'+g+'" aria-pressed="'+(S.fg===g)+'">'+L[g]+'</button>'}).join('');
  $('#fauna-list').innerHTML=FAUNA.filter(function(f){return S.fg==='Todos'||f.g===S.fg}).map(function(f){
    return '<article class="fcard"><div class="sw" style="background-image:url(assets/patterns/tone-sage-'+f.pat+'.svg)"></div><div class="in"><span class="tag" style="width:fit-content">'+f.g+'</span><h3>'+f.n+'</h3><em>'+f.l+'</em><p>'+esc(f.t)+'</p><div class="foot"><button class="btn line sm" data-fani="'+f.ani+'">Si la encuentras</button>'+(f.s?'<span class="src">Fuente: '+(f.u?'<a href="'+f.u+'" target="_blank" rel="noopener">'+f.s+'</a>':f.s)+'</span>':'')+'</div></div></article>'}).join('');
}
document.addEventListener('click',function(e){var b=e.target.closest('[data-fg]');if(b){S.fg=b.getAttribute('data-fg');renderFauna()}});
$('#myths').innerHTML=MYTHS.map(function(m){return '<div class="myth"><span class="k">Mito</span><q>'+esc(m[0])+'</q><span class="k r">Realidad</span><p>'+esc(m[1])+'</p></div>'}).join('');
function renderFaq(){
  $('#faq').innerHTML=FAQS.map(function(f,i){var o=S.faq===i;return '<div class="item'+(o?' open':'')+'"><h4><button data-faq="'+i+'" aria-expanded="'+o+'" id="fq'+i+'" aria-controls="fa'+i+'"><span>'+f[0]+'</span><span class="pm" aria-hidden="true">'+(o?'−':'+')+'</span></button></h4><div class="ans" id="fa'+i+'" role="region" aria-labelledby="fq'+i+'">'+f[1]+'</div></div>'}).join('');
}
document.addEventListener('click',function(e){var b=e.target.closest('[data-faq]');if(b){var i=+b.getAttribute('data-faq');S.faq=S.faq===i?-1:i;renderFaq();var n=$('#fq'+i);if(n)n.focus()}});
$('#news').innerHTML=NEWS.map(function(n){return '<li><a href="'+n[2]+'" target="_blank" rel="noopener"><b>'+n[0]+'</b><span>'+esc(n[1])+'</span>'+ico('i-ext')+'</a></li>'}).join('');

/* ======================  PODCAST  ====================== */
function renderPod(){
  $('#podTitle').textContent=PODS[S.pod];
  $('#eps').innerHTML='<span class="label">Episodios</span>'+PODS.map(function(t,i){return '<button class="ep" data-ep="'+i+'" aria-current="'+(S.pod===i)+'"><div class="th"><div class="pt" style="background-image:url(assets/patterns/tone-sage-manchas.svg)"></div></div><div><span class="small">Ep. '+(i+1)+' · duración por confirmar</span><b>'+t+'</b></div></button>'}).join('');
}
document.addEventListener('click',function(e){var b=e.target.closest('[data-ep]');if(b){S.pod=+b.getAttribute('data-ep');S.prog.pod=0;S.playing='pod';renderPod();renderPlayers()}});

/* ======================  DONAR  ====================== */
function amount(){var c=parseFloat(S.custom);return S.amt>=0?AMTS[S.amt]:(c>0?c:0)}
function num(n){return String(n).replace('.',',')}
function money(n){return '$'+Math.round(n).toLocaleString('es-EC')}
function impact(){
  var a=amount();if(a<=0)return ['Elige un monto','Calculamos cuánta operación cubre tu aporte.'];
  var perMin=YEAR_COST/525600,mins=a/perMin,perHour=YEAR_COST/8760;
  var t=mins<90?'unos '+Math.max(1,Math.round(mins))+' minutos':'unas '+num((mins/60).toFixed(1))+' horas';
  var yr=a*12;
  return ['Tu aporte de $'+a+' cubre '+t+' de operación.',S.freq?'En un año serían '+money(yr)+', unas '+num((yr/perHour).toFixed(1))+' horas de operación.':'Si lo repites cada mes, al año serían '+money(yr)+'.'];
}
function impactHTML(){var im=impact();return '<b>'+im[0]+'</b><span>'+im[1]+'</span><span class="small">Operar cuesta unos $'+Math.round(YEAR_COST/365)+' al día ($350.000 ÷ 365). Equivalencia ilustrativa.</span>'}
function renderGive(){
  var a=amount(),f=S.freq?'mensual':'único',el=$('#give');
  if(S.giveStep===1){
    el.innerHTML='<div class="thanks"><span class="label">Donaciones · último paso</span><h3>Gracias por tu aporte '+f+' de $'+a+'</h3><p>Para completarlo, haz una transferencia con estos datos. Pronto sumaremos pago con tarjeta.</p><dl class="bank">'+BANK.map(function(b,i){return '<div><dt>'+b[0]+'</dt><dd>'+b[1]+'</dd><button data-copy="'+i+'" aria-label="Copiar '+b[0]+'">Copiar</button></div>'}).join('')+'</dl><p class="small">Este paso es una maqueta. Aquí irán el pago y el recibo.</p><button class="btn line" id="giveBack" style="border-color:var(--selva);color:var(--selva);justify-self:start">← Volver</button></div>';
    return;
  }
  el.innerHTML='<span class="label">Donaciones</span><h3>Elige cómo aportar</h3>'+
   '<div class="seg" role="group" aria-label="Frecuencia"><button data-freq="0" aria-pressed="'+(S.freq===0)+'">Única vez</button><button data-freq="1" aria-pressed="'+(S.freq===1)+'">Mensual</button></div>'+
   '<div class="amts" role="group" aria-label="Monto">'+AMTS.map(function(x,i){return '<button data-amt="'+i+'" aria-pressed="'+(S.amt===i)+'">$'+x+'</button>'}).join('')+'<input id="customAmt" type="number" min="1" inputmode="decimal" placeholder="Otro $" aria-label="Otro monto" value="'+esc(S.custom)+'"></div>'+
   '<div class="impact" id="impact" aria-live="polite">'+impactHTML()+'</div>'+
   '<div class="covers"><b>Tu aporte cubre:</b><ul><li>Medicinas e insumos</li><li>Traslados y logística</li><li>Alimentación en rehabilitación</li></ul></div>'+
   '<button class="btn pri" id="doGive" '+(a>0?'':'disabled')+'>Donar '+(a>0?'$'+a+(S.freq?' / mes':''):'')+'</button>'+
   '<p class="small">Montos de ejemplo. Métodos: transferencia ahora; tarjeta y PayPal próximamente.</p>';
}
function syncGive(){var a=amount(),b=$('#doGive'),im=$('#impact');if(im)im.innerHTML=impactHTML();if(b){b.disabled=!(a>0);b.textContent='Donar '+(a>0?'$'+a+(S.freq?' / mes':''):'')}}
document.addEventListener('click',function(e){
  var f=e.target.closest('[data-freq]');if(f){S.freq=+f.getAttribute('data-freq');renderGive();return}
  var m=e.target.closest('[data-amt]');if(m){S.amt=+m.getAttribute('data-amt');S.custom='';renderGive();return}
  if(e.target.id==='doGive'&&amount()>0){S.giveStep=1;renderGive();return}
  if(e.target.id==='giveBack'){S.giveStep=0;renderGive();return}
  var c=e.target.closest('[data-copy]');if(c){var b=BANK[+c.getAttribute('data-copy')];copy(b[1],b[0]+' copiado')}
  if(e.target.closest('#shareSite'))copy(location.href.split('#')[0],'Enlace copiado');
});
document.addEventListener('input',function(e){if(e.target.id==='customAmt'){S.custom=e.target.value;S.amt=e.target.value?-1:2;if(!e.target.value){renderGive();$('#customAmt').focus();return}$$('.amts button').forEach(function(x){x.setAttribute('aria-pressed','false')});syncGive()}});

/* ======================  CONVENIOS (en lugar de voluntariado abierto)  ====================== */
function validMail(m){return /^\S+@\S+\.\S+$/.test(m)}
function renderConv(){
  var el=$('#conv'),v=S.c,t=S.cTried;
  if(S.cOk){el.innerHTML='<div class="thanks"><span class="label">Convenios</span><h3>Solicitud enviada</h3><p>Gracias, '+esc(v.name)+'. Te escribiremos a '+esc(v.mail)+' para conversar el convenio.</p><p class="small">Maqueta: el formulario aún no está conectado a un correo o base de datos.</p><button class="btn line" id="convBack" style="border-color:var(--selva);color:var(--selva);justify-self:start">← Volver</button></div>';return}
  el.innerHTML='<span class="label">Voluntariado y convenios</span><h3>Suma a tu universidad</h3><p>Trabajamos con universidades y organizaciones mediante convenios: es la única vía de voluntariado.</p>'+
   '<form class="form" id="convForm" novalidate><div class="fields">'+
   fld('cOrg','Institución *','<input id="cOrg" autocomplete="organization" value="'+esc(v.org)+'">',t&&!v.org.trim(),'Escribe el nombre de la institución',true)+
   fld('cName','Tu nombre *','<input id="cName" autocomplete="name" value="'+esc(v.name)+'">',t&&!v.name.trim(),'Escribe tu nombre')+
   fld('cMail','Correo *','<input id="cMail" type="email" autocomplete="email" value="'+esc(v.mail)+'">',t&&!validMail(v.mail),'Correo no válido')+
   fld('cKind','Tipo','<select id="cKind"><option value="">Selecciona</option><option'+(v.kind==='Universidad'?' selected':'')+'>Universidad</option><option'+(v.kind==='Organización'?' selected':'')+'>Organización</option><option'+(v.kind==='Empresa'?' selected':'')+'>Empresa</option></select>',false,'',true)+
   fld('cMsg','¿Qué te gustaría hacer? (opcional)','<textarea id="cMsg" rows="3">'+esc(v.msg)+'</textarea>',false,'',true)+
   '</div><button class="btn pri" type="submit">Enviar solicitud</button></form><p class="safe">Por seguridad no recibimos visitas ni voluntarios externos en el centro de rescate.</p>';
}
document.addEventListener('input',function(e){var m={cOrg:'org',cName:'name',cMail:'mail',cKind:'kind',cMsg:'msg'}[e.target.id];if(m)S.c[m]=e.target.value});
document.addEventListener('change',function(e){if(e.target.id==='cKind')S.c.kind=e.target.value});
document.addEventListener('submit',function(e){if(e.target.id!=='convForm')return;e.preventDefault();var v=S.c,ok=v.org.trim()&&v.name.trim()&&validMail(v.mail);if(ok){S.cOk=true;S.cTried=false}else S.cTried=true;renderConv();if(!ok){var b=$('#convForm .bad input');if(b)b.focus()}});
document.addEventListener('click',function(e){if(e.target.id==='convBack'){S.cOk=false;S.c={org:'',name:'',mail:'',kind:'',msg:''};renderConv()}});

/* ======================  REDES  ====================== */
$('#soc').innerHTML=SOC.map(function(s){return '<div class="sc'+(s[2]?' main':'')+'"><h3>'+s[0]+'</h3><p class="small">'+s[1]+'</p><a class="btn '+(s[2]?'inv':'line')+' sm" href="#redes" data-noop>Seguir ↗</a></div>'}).join('');

/* ======================  ARRANQUE  ====================== */
renderTool(false);renderPlayers();renderCaps();renderMap();renderFauna();renderFaq();renderGallery();renderPod();renderGive();renderConv();onScroll();
(function(){
  var els=$$('[data-rv]');
  if(reduced||!('IntersectionObserver' in window))return;
  var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})},{threshold:.08});
  els.forEach(function(e){if(e.getBoundingClientRect().top>window.innerHeight*.92){e.classList.add('rv');io.observe(e)}});
})();
})();
