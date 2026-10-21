(function(){
'use strict';

/* ======================  CONTENIDO EDITABLE  ======================
   Videos: pega la ruta de cada .mp4 en VIDEOS (vacío = vista de maqueta). VIDEOS.hero es una lista de formatos:
   el navegador usa el primero que pueda reproducir. El tráiler actual es una imagen de referencia animada:
   reemplázalo por material propio y cambia el poster en body.html. */
var VIDEOS={hero:['assets/video/hero.mp4','assets/video/hero.webm'],caps:['','','','','','','',''],h:{sacha:'',pod1:'',pod2:''}};
var MOCK_SECONDS=8;           /* duración de cada cápsula de maqueta en el visor */
var YEAR_COST=350000;

var NAV=[['Videos','videos'],['¿Mito o realidad?','quiz'],['Encontré un animal','encontre'],['El rescate','rescate'],['Historias','historias'],['Nosotros','nosotros'],['Fauna','fauna']];

var FACTS=[
 {n:2018,plain:true,pat:'felino',t:'Sacha, una cría de ocelote, llega a manos de la Dra. Eliana Molineros tras ser rescatada de una tienda en Vinces. De ahí nace la fundación.',s:'Primicias',u:'https://www.primicias.ec/noticias/tecnologia/sacha-ocelote-espacio-cuidar-fauna-silvestre/'},
 {n:3500,pre:'+',pat:'manchas',t:'animales silvestres y exóticos rescatados, recuperados o reubicados desde 2018 (cifra de inicios de 2023).',s:'Expreso',u:'https://www.expreso.ec/buenavida/proyecto-sacha-apresta-inaugurar-centro-rehabilitacion-fauna-silvestre-147100.html'},
 {n:61,post:' %',pat:'selva',t:'de las zarigüeyas corre riesgo de ser atropellada en las carreteras.',s:'Material de la fundación'},
 {n:350000,pre:'$',pat:'rayas',t:'cuesta operar un año. Las donaciones hoy no alcanzan.',s:'Fundación Proyecto Sacha',cta:true}
];

/* Cápsulas verticales: tres ejes, cada uno con su patrón y su color de lámina (tablero de arte) */
var TABS=[{name:'Convivir',pat:'selva',bg:'#3F5A4F'},{name:'La fundación',pat:'felino',bg:'#24362E'},{name:'El rescate por dentro',pat:'reptil',bg:'#3F5A4F'}];
var CAPS=[
 {tab:0,pre:'Mitos sobre la',title:'zarigüeya',dur:58,desc:'Lo que crees saber y por qué no es una amenaza.',m:'sacha-dato'},
 {tab:0,pre:'Encontré una cría:',title:'¿qué hago?',dur:72,desc:'Primeros pasos antes de llamar al equipo.',m:'sacha-rescate'},
 {tab:0,pre:'Convivir con fauna',title:'en la ciudad',dur:65,desc:'Hábitos simples para coexistir.',m:'sacha-saluda'},
 {tab:1,pre:'Todo sobre',title:'quiénes somos',dur:90,desc:'El equipo y lo que nos mueve.',m:'sacha-saluda'},
 {tab:1,pre:'Un día en',title:'Proyecto Sacha',dur:70,desc:'Turnos, protocolos y cuidado diario.',m:'sacha-dato'},
 {tab:2,pre:'Rescate',title:'en campo',dur:100,desc:'Cómo se contiene a un animal sin dañarlo.',m:'sacha-rescate'},
 {tab:2,pre:'Traslado a',title:'Santa Elena',dur:75,desc:'Logística y cuidados durante el viaje.',m:'sacha-saluda'},
 {tab:2,pre:'Rehabilitación',title:'y liberación',dur:85,desc:'El día en que vuelve a su hábitat.',m:'sacha-donar'}
];
/* Videos horizontales */
var HTABS=['Historia y tráiler','Podcast'];
var HVIDS=[
 {id:'sacha',tab:0,kind:'Video · Mascota',pre:'¿Quién es',title:'Sacha?',dur:60,desc:'La historia real detrás del nombre de la fundación, contada por Sacha.',pat:'felino',m:'sacha-saluda'},
 {id:'trailer',tab:0,kind:'Tráiler',pre:'Todos los días',title:'los ves',dur:14,desc:'Avance de la serie. Imagen de referencia: se reemplaza por material propio de la fundación.',pat:'selva',src:'hero'},
 {id:'pod1',tab:1,kind:'Podcast en video',pre:'Episodio 1',title:'Tema por definir',dur:1800,desc:'Conversación con el equipo que rescata, cura y libera. Invitado/a por confirmar.',pat:'manchas',m:'sacha-dato',wave:true},
 {id:'pod2',tab:1,kind:'Podcast en video',pre:'Episodio 2',title:'Tema por definir',dur:1800,desc:'Segundo episodio. Invitado/a y duración por confirmar.',pat:'rayas',m:'sacha-donar',wave:true}
];

/* Guía de acción: situación + tipo de animal = pasos, errores a evitar y datos para avisar */
var SITS=[
 {id:'herido',ic:'i-med',c:'var(--terracota)',title:'Está herido o en peligro',sub:'Atropellado, atrapado, sangrando o con dificultad para moverse.',urg:'Urgente · avisa ya',
  do:['Mantén la distancia y no lo persigas: el estrés puede empeorar sus lesiones.','Aleja a perros, gatos y niños, y baja el ruido.','Toma una foto o un video corto desde lejos y anota la ubicación exacta.','Avisa al equipo de rescate de inmediato. Si te lo indican, cúbrelo con una tela y déjalo en una caja ventilada, oscura y tranquila.'],
  dont:['No le des comida, agua ni leche.','No lo cargues con las manos desnudas: por miedo puede morder o arañar.','No lo lleves a casa ni intentes curarlo.','No lo traslades por tu cuenta sin la indicación del equipo.'],
  ready:['Dirección o referencia exacta','Una foto desde lejos','Cómo se ve: sangrado, no se mueve, ala o pata dañada','Un teléfono para llamarte']},
 {id:'cria',ic:'i-baby',c:'var(--dorado)',title:'Es una cría y está sola',sub:'Sin pelo o plumas completas, o llorando, y no ves a la madre.',urg:'Prioritario',
  do:['Obsérvala desde lejos un buen rato: su madre puede estar cerca y no se acerca si hay personas.','Aleja a perros, gatos y niños, y evita los ruidos.','Si está en peligro inmediato (calle, lluvia, depredadores), avisa de inmediato.','Toma una foto y anota la hora, el lugar y cuántas crías hay.'],
  dont:['No la alimentes: ni leche, ni agua, ni comida de mascotas.','No la tomes en brazos ni la lleves a casa: aunque parezca abandonada, muchas veces no lo está.','No la conviertas en mascota: la tenencia de fauna silvestre está regulada por ley.'],
  ready:['Hora en que la viste','Lugar exacto','Cuántas crías hay','Una foto desde lejos']},
 {id:'casa',ic:'i-home',c:'var(--selva)',title:'Entró a mi casa, patio o techo',sub:'Está en un lugar donde no debería estar.',urg:'Evalúa con calma',
  do:['Mantén la calma y dale espacio: casi siempre quiere salir tanto como tú quieres que salga.','Encierra a las mascotas y saca a los niños de la habitación.','Abre puertas o ventanas hacia el exterior, baja el ruido y deja un camino libre.','Si no sale por su cuenta, toma una foto desde lejos y avisa al equipo.'],
  dont:['No lo acorrales ni lo golpees.','No uses insecticidas, humo ni trampas de pegamento.','No lo agarres con las manos.','No lo alimentes para que se quede.'],
  ready:['En qué parte de la casa está y hace cuánto','Una foto desde lejos','Si hay niños o mascotas cerca','Un teléfono para llamarte']},
 {id:'trafico',ic:'i-cart',c:'#24362E',title:'Alguien lo tiene o lo vende',sub:'Está en una casa, un local o un anuncio como mascota o producto.',urg:'Denuncia',
  do:['Cuida tu seguridad: no confrontes a la persona.','Si puedes hacerlo sin riesgo, guarda fotos o capturas: enlace del anuncio, perfil, fecha y lugar.','Reporta con los datos que tengas. La fundación informa a la Unidad de Policía de Medio Ambiente y al Ministerio del Ambiente.'],
  dont:['No compres al animal: comprar alimenta el tráfico.','No intentes quitárselo a la persona.','No publiques datos de la persona en redes antes de reportar.'],
  ready:['Dirección o enlace del anuncio','Fotos o capturas','Tipo de animal','Fecha y hora']}
];
var ANIS=[
 {id:'mamifero',ic:'i-paw',c:'var(--dorado)',title:'Mamífero',eg:'zarigüeya, ardilla, murciélago',
  do:['Si es una zarigüeya, no hace falta ahuyentarla: casi siempre se aleja sola de noche. En un patio, déjale un camino libre hacia afuera.'],
  dont:['No la mates: es inofensiva para las personas.']},
 {id:'ave',ic:'i-leaf',c:'var(--selva)',title:'Ave',eg:'garrapatero, lechuza, loro',
  do:['Si tiene plumas y salta, sus padres suelen cuidarla desde cerca; si no tiene plumas o está herida, avisa.'],
  dont:['No le des agua con jeringa ni pan: puede ahogarse.']},
 {id:'reptil',ic:'i-alert',c:'var(--terracota)',title:'Reptil',eg:'iguana, serpiente, cocodrilo, tortuga',danger:true,
  do:['Si es una serpiente, mantente a distancia y no la pierdas de vista hasta que llegue el equipo.','Iguanas y tortugas: déjalas tranquilas; mirarlas de lejos también es respetarlas.'],
  dont:['No intentes capturar ni matar a una serpiente: sin experiencia no puedes saber si es venenosa.','No te acerques a un cocodrilo ni a la orilla donde está.']},
 {id:'grande',ic:'i-paw',c:'#24362E',title:'Animal grande',eg:'felino, venado, mono, oso hormiguero',danger:true,
  do:['Aléjate sin darle la espalda ni correr, y mantén lejos a otras personas.'],
  dont:['No intentes tocarlo ni acorralarlo: un animal asustado puede defenderse.']},
 {id:'nose',ic:'i-info',c:'var(--arena)',title:'No sé qué es',eg:'una foto desde lejos ayuda a identificarlo',
  do:['No hace falta saberlo: una foto desde lejos ayuda al equipo a identificarlo.'],dont:[]}
];
var NUMS=[{k:'ECU 911',v:'911',note:'Emergencias. Úsalo si hay riesgo para personas o un animal peligroso en la vía pública.'},{k:'Línea de la fundación',v:'',note:'Número de reportes por definir.'}];

var STEPS=[
 {title:'Recepción médica',icon:'i-med',pat:'felino',text:'Evaluación clínica inmediata y estabilización. Reciben los mismos exámenes que un perro o un gato, porque necesitan los mismos cuidados.',cap:8},
 {title:'Gestión legal',icon:'i-doc',pat:'manchas',text:'Cada ingreso se informa al Ministerio del Ambiente y a la Unidad de Policía de Medio Ambiente. La liberación se coordina con ellos.',cap:6},
 {title:'Logística y traslado',icon:'i-truck',pat:'selva',text:'Trasladar y liberar necesita vehículos, combustible y personal. Mientras espera, el animal sigue necesitando cuidados.',cap:7},
 {title:'Rehabilitación y liberación',icon:'i-leaf',pat:'rayas',text:'Cuidado prolongado, a veces durante meses, hasta devolverlo a su hábitat.',cap:8}
];
var ALLIES=[['Ministerio del Ambiente','var(--selva)'],['Policía de Medio Ambiente','var(--dorado)'],['Universidades','var(--terracota)']];

/* Historias reales (titulares de prensa con enlace). Apadrinar queda como función próxima. */
var STORIES=[
 {pre:'Sacha',title:'Vinces, 2018',pat:'felino',bg:'#3F5A4F',tag:'Felino',c:'var(--dorado)',t:'Rescatada con unos diez días de vida de una tienda donde la vendían traficantes de fauna. No pudo regresar a su hábitat, pero inspiró la fundación.',s:'Vistazo',u:'https://www.vistazo.com/estilo-de-vida/sostenibilidad/sacha-el-ocelote-que-no-pudo-regresar-a-su-habitat-pero-inspiro-un-enorme-proyecto-CE1336316'},
 {pre:'Ocelote bebé y mono aullador',title:'Dos Mangas',pat:'selva',bg:'#24362E',tag:'Felino y primate',c:'var(--selva)',t:'Encontrados con signos de desnutrición y lesiones, y atendidos por la fundación.',s:'El Universo',u:'https://www.eluniverso.com/guayaquil/comunidad/fauna-ocelote-bebe-mono-aullador-proyecto-sacha-guayaquil-guayas-dos-mangas-nota/'},
 {pre:'Un ocelote atacado por perros',title:'Bucay',pat:'manchas',bg:'#3F5A4F',tag:'Felino',c:'var(--dorado)',t:'Necesitó cirugías después del ataque de varios perros. Los perros sueltos son una amenaza diaria para la fauna.',s:'Vistazo',u:'https://www.vistazo.com/sostenibilidad/un-ocelote-que-fue-atacado-por-varios-perros-en-bucay-requiere-de-cirugias-AX2671763'},
 {pre:'Meg, la bebé',title:'ocelote',pat:'rayas',bg:'#24362E',tag:'Felino',c:'var(--terracota)',t:'En peligro por la quema de plantaciones y la mascotización: dos causas que llenan los centros de rescate.',s:'Vistazo',u:'https://www.vistazo.com/estilo-de-vida/sostenibilidad/meg-la-bebe-ocelote-en-peligro-por-la-quema-de-plantaciones-y-mascotizacion-CK6972334'},
 {pre:'Oso hormiguero herido',title:'Guayaquil',pat:'reptil',bg:'#3F5A4F',tag:'Mamífero',c:'var(--dorado)',t:'Hallado herido por perros dentro de un recinto militar de la ciudad.',s:'Expreso',u:'https://www.expreso.ec/guayaquil/policia-halla-oso-hormiguero-herido-por-perros-en-recinto-militar-de-guayaquil-279129.html'},
 {pre:'Ardillas de',title:'Lomas de Urdesa',pat:'selva',bg:'#24362E',tag:'Mamífero',c:'var(--selva)',t:'La fundación alertó sobre ardillas muertas tras una presunta fumigación municipal.',s:'Primicias',u:'https://www.primicias.ec/guayaquil/municipio-cuerpo-ardillas-urdesa-fumigacion-proyecto-sacha-104000/'}
];

var FICHA=[['Especie','Ocelote, felino manchado de la costa y la selva'],['Vestuario','Sombrero de safari con cordón y chaleco verde oliva'],['Inspirada en','La cría de ocelote rescatada en Vinces en 2018'],['En el sitio','Saluda, guía la acción, enseña fauna y pide ayuda']];
var STORY=[
 'Sacha, una cría de ocelote de unos diez días de vida, llegó en junio de 2018 a manos de la Dra. Eliana Molineros. Estaba a la venta en una tienda de Vinces, en poder de traficantes de fauna silvestre.',
 'No pudo regresar a su hábitat, pero su historia dio origen a la Fundación Proyecto Sacha, que hoy rehabilita fauna del Guayas y la devuelve a su medio.'
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
 {n:'01',kind:'Centro urbano',name:'Guayaquil',pin:'Guayaquil',desc:'Recepción médica y rescates urbanos.',pos:[74.17,42.62],dx:0,dy:-34,q:'Guayaquil, Ecuador'},
 {n:'02',kind:'Centro rural',name:'Santa Elena',pin:'Centro rural',desc:'Rehabilitación y liberación.',pos:[54.71,52.0],dx:0,dy:36,q:'Chanduy, Santa Elena, Ecuador',note:'Ubicación referencial: vía Guayaquil–Santa Elena, sector Chanduy.'}
];
var MREF=[{name:'Santa Elena',pos:[17.12,45.11]}];

var FAUNA=[
 {pre:'Todo sobre la',n:'zarigüeya',full:'Zarigüeya común',l:'Didelphis marsupialis',g:'Mamífero',ani:'mamifero',pat:'manchas',t:'Marsupial nocturno que come insectos, frutas, carroña y pequeños animales. Ayuda a controlar plagas y a dispersar semillas. Es inofensiva: que transmita la rabia es un mito.',s:'UTPL',u:'https://noticias.utpl.edu.ec/printpdf/node/3592'},
 {pre:'Todo sobre la',n:'ardilla',full:'Ardilla de Guayaquil',l:'Simosciurus stramineus',g:'Mamífero',ani:'mamifero',pat:'selva',t:'Diurna y trepadora, común en parques y jardines de la ciudad.',s:'Primicias',u:'https://www.primicias.ec/guayaquil/municipio-cuerpo-ardillas-urdesa-fumigacion-proyecto-sacha-104000/'},
 {pre:'Todo sobre el',n:'mono aullador',full:'Mono aullador de la costa',l:'Alouatta palliata',g:'Mamífero',ani:'grande',pat:'selva',t:'Se oye mucho antes de verse. La fundación ha atendido ejemplares con desnutrición y lesiones.',s:'El Universo',u:'https://www.eluniverso.com/guayaquil/comunidad/fauna-ocelote-bebe-mono-aullador-proyecto-sacha-guayaquil-guayas-dos-mangas-nota/'},
 {pre:'Todo sobre el',n:'ocelote',full:'Ocelote',l:'Leopardus pardalis',g:'Mamífero',ani:'grande',pat:'felino',t:'Felino manchado y nocturno. Sacha, el rostro de la fundación, es un ocelote. La mascotización y los perros sueltos lo ponen en riesgo.',s:'Vistazo',u:'https://www.vistazo.com/estilo-de-vida/sostenibilidad/meg-la-bebe-ocelote-en-peligro-por-la-quema-de-plantaciones-y-mascotizacion-CK6972334'},
 {pre:'Todo sobre la',n:'iguana',full:'Iguana verde',l:'Iguana iguana',g:'Reptil',ani:'reptil',pat:'reptil',t:'Herbívora. Se la ve en parques y orillas tomando sol. Mirarla de lejos también es respetarla.'},
 {pre:'Todo sobre el',n:'cocodrilo',full:'Cocodrilo de la costa',l:'Crocodylus acutus',g:'Reptil',ani:'reptil',pat:'reptil',t:'Vive en manglares y estuarios del golfo de Guayaquil. Siempre estuvo aquí: la ciudad llegó después. Mantén distancia del agua.'},
 {pre:'Todo sobre la',n:'boa',full:'Boa',l:'Boa constrictor',g:'Reptil',ani:'reptil',pat:'rayas',t:'No es venenosa: atrapa a sus presas por constricción, sobre todo roedores y aves. Si la ves, no la toques: avisa.'},
 {pre:'Todo sobre el',n:'garrapatero',full:'Garrapatero',l:'Crotophaga sulcirostris',g:'Ave',ani:'ave',pat:'selva',t:'Ave negra de pico curvo que anda en grupos por jardines y potreros y se alimenta de insectos.'},
 {pre:'Todo sobre la',n:'lechuza',full:'Lechuza de campanario',l:'Tyto alba',g:'Ave',ani:'ave',pat:'manchas',t:'Cazadora nocturna que se alimenta sobre todo de roedores. Anida en techos y construcciones.'}
];
var GROUP_C={'Mamífero':'var(--dorado)','Ave':'var(--selva)','Reptil':'var(--terracota)'};
var QUIZ=[
 {q:'La zarigüeya transmite la rabia y es peligrosa.',a:false,t:'Es inofensiva, huye de las personas y ayuda a controlar plagas.',s:'Expreso · UTPL'},
 {q:'Si encuentras una cría sola, siempre está abandonada.',a:false,t:'Muchas veces su madre está cerca y no se acerca si hay gente. Obsérvala de lejos y avisa antes de tocarla.'},
 {q:'Darle leche a un animal silvestre lo ayuda a recuperarse.',a:false,t:'No: puede enfermarlo o ahogarlo. Nunca le des comida ni bebida; avisa al equipo.'},
 {q:'Cada animal que llega a la fundación se informa al Ministerio del Ambiente.',a:true,t:'Cada ingreso se informa a la autoridad ambiental y a la Policía de Medio Ambiente, y la liberación se coordina con ellos.'},
 {q:'Proyecto Sacha está en la Amazonía.',a:false,t:'Estamos en la costa: en Guayaquil y en la provincia de Santa Elena. Sacha significa «selva» en kichwa.'},
 {q:'Operar la fundación durante un año cuesta unos $350.000.',a:true,t:'Y hoy las donaciones no alcanzan para cubrirlo.'}
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
var GAL=[['Todo','var(--selva)'],['Quirófano','var(--terracota)'],['Campo','var(--selva)'],['Instalaciones','var(--dorado)'],['Logística','var(--arena)']];
var PHOTOS=[[280,'Quirófano','Cirugía a un ejemplar con fractura'],[180,'Campo','Contención en vía pública'],[230,'Instalaciones','Recintos de rehabilitación'],[300,'Quirófano','Preparando medicación al amanecer'],[190,'Logística','Inventario de insumos'],[250,'Campo','Rescate nocturno'],[210,'Instalaciones','Zona de cuarentena'],[260,'Logística','Carga de insumos para el traslado']];
var PAT={'Quirófano':'rayas','Campo':'selva','Instalaciones':'felino','Logística':'manchas'};
var SOC=[['Instagram','Fotos y reels del día a día. Es nuestro canal principal.','var(--terracota)',true],['TikTok','Cápsulas cortas sobre convivencia con la fauna.','var(--menta)'],['Facebook','Comunidad, avisos y novedades.','var(--arena)'],['YouTube','Podcast y videos completos.','var(--dorado)']];
var AMTS=[5,10,25,50];
var BANK=[['Banco','Banco Internacional'],['Cuenta corriente','1400625249'],['A nombre de','Fundación Proyecto Sacha'],['RUC','0993242721001'],['Correo','donaciones@proyectosacha.org']];

/* ======================  UTILIDADES  ====================== */
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var reduced=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var S={ctab:-1,htab:0,h:0,sede:0,faq:0,gal:'Todo',fg:'Todos',lb:-1,playing:false,prog:0,amt:2,custom:'',freq:1,giveStep:0,cTried:false,cOk:false,c:{org:'',name:'',mail:'',kind:'',msg:''},seen:{},alertOk:false};
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function fmt(s){s=Math.round(s);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
function ico(id){return '<svg class="ic" aria-hidden="true"><use href="#'+id+'"/></svg>'}
function money(n){return '$'+Math.round(n).toLocaleString('es-EC')}
function toast(m){var t=$('#toast');t.textContent=m;t.classList.remove('show');void t.offsetWidth;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(function(){t.classList.remove('show')},2400)}
function copy(txt,msg){function ok(){toast(msg||'Copiado')}function fb(){var a=document.createElement('textarea');a.value=txt;a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();try{document.execCommand('copy');ok()}catch(e){toast('Selecciona el texto y cópialo')}a.remove()}try{navigator.clipboard.writeText(txt).then(ok,fb)}catch(e){fb()}}
function go(id){var el=document.getElementById(id);if(!el)return;window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-60,behavior:reduced?'auto':'smooth'});closeMenu()}
function validMail(m){return /^\S+@\S+\.\S+$/.test(m)}
/* lámina «Todo sobre…»: patrón arriba, franja ondulada abajo, título en dos tamaños y Sacha en la esquina */
function plate(o){
  return '<div class="plate" style="--pb:'+(o.bg||'#3F5A4F')+'"><div class="pt" style="background-image:url(assets/patterns/'+o.pat+'.svg)"></div>'+
   '<svg class="wave" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path d="M0 12C22 2 40 22 62 12S90 2 100 8V40H0Z"/></svg>'+
   (o.extra||'')+'<div class="ptx"><small>'+esc(o.pre||'')+'</small><b>'+esc(o.title||'')+'</b></div>'+
   (o.m?'<img class="pm" src="assets/mascot/'+o.m+'.webp" alt="" loading="lazy">':'')+'</div>';
}

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
var SPY=[['inicio',null],['videos','videos'],['quiz','quiz'],['encontre','encontre'],['rescate','rescate'],['historias','historias'],['galeria','historias'],['nosotros','nosotros'],['fauna','fauna'],['donar',null],['redes',null],['contacto',null]];
var lastAct='',lastShow=null;
function onScroll(){
  var y=window.scrollY,h=document.documentElement.scrollHeight-window.innerHeight,act=null;
  SPY.forEach(function(p){var el=document.getElementById(p[0]);if(el&&el.getBoundingClientRect().top<=160)act=p[1]});
  $('#prog').style.width=(h>0?Math.min(100,y/h*100):0)+'%';
  if(act!==lastAct){lastAct=act;$$('#nav button').forEach(function(b){if(b.getAttribute('data-nav')===act)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current')})}
  var t=$('#encontre').getBoundingClientRect(),d=$('#donar').getBoundingClientRect(),
      show=y>700&&!(t.top<window.innerHeight*.6&&t.bottom>window.innerHeight*.3)&&!(d.top<window.innerHeight&&d.bottom>0);
  if(show!==lastShow){lastShow=show;$('#fab').classList.toggle('show',show)}
  journeySpy();
}
window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);

/* ======================  INICIO: MAZO DE CÁPSULAS, PALABRA CON PIEL Y OJOS QUE MIRAN  ====================== */
var DECK=[{k:'trailer',say:'Este es el tráiler. Toca y míralo completo.'},{k:0,say:'¿Sabías que la zarigüeya es inofensiva? Mira la cápsula 1.'},{k:1,say:'Si encuentras una cría sola, mira esta cápsula antes de tocarla.'},{k:5,say:'Así es un rescate en campo, sin filtros.'},{k:7,say:'Mi momento favorito: cuando vuelven a su hábitat.'}];
var DK={order:DECK.map(function(d,i){return i}),paused:false,timer:null};
(function(){
  var deck=$('#deck');
  DECK.forEach(function(d,i){if(d.k==='trailer')return;var c=CAPS[d.k];
    deck.insertAdjacentHTML('beforeend','<button class="dk-card" data-dk="'+i+'" aria-label="Ver cápsula '+(d.k+1)+': '+esc(c.pre+' '+c.title)+'">'+capCover(d.k,true)+'<span class="dk-pl">'+ico('i-play')+'</span></button>')});
  $('.dk-card.trailer').setAttribute('data-dk','0');$('.dk-card.trailer').insertAdjacentHTML('beforeend','<span class="dk-pl">'+ico('i-play')+'</span>');
  $('#deckDots').innerHTML=DECK.map(function(){return '<i></i>'}).join('');
  dkPaint();
  if(!reduced)DK.timer=setInterval(function(){if(!DK.paused&&!ST.open)dkNext()},4200);
})();
function dkPaint(){
  var cards=$$('#deck .dk-card');
  DK.order.forEach(function(idx,pos){var el=cards.filter(function(c){return +c.getAttribute('data-dk')===idx})[0];if(!el)return;el.style.setProperty('--i',Math.min(pos,3));el.style.visibility=pos>3?'hidden':'visible';el.tabIndex=pos===0?0:-1;el.setAttribute('aria-hidden',pos===0?'false':'true')});
  $$('#deckDots i').forEach(function(d,i){d.classList.toggle('on',i===DK.order[0])});
  var say=$('#hsay');if(say)say.textContent=DECK[DK.order[0]].say;
}
function dkNext(){
  var first=DK.order[0],el=$$('#deck .dk-card').filter(function(c){return +c.getAttribute('data-dk')===first})[0];
  if(el&&!reduced){el.classList.add('out');setTimeout(function(){el.classList.remove('out');DK.order.push(DK.order.shift());dkPaint()},420)}
  else{DK.order.push(DK.order.shift());dkPaint()}
}
$('#deckNext').addEventListener('click',dkNext);
document.addEventListener('click',function(e){var c=e.target.closest('[data-dk]');if(!c)return;var d=DECK[+c.getAttribute('data-dk')];
  var idx=+c.getAttribute('data-dk');if(idx!==DK.order[0]){while(DK.order[0]!==idx)DK.order.push(DK.order.shift());dkPaint();return}
  if(d.k==='trailer'){S.h=1;S.htab=0;renderH();go('horizontales');setTimeout(function(){var v=$('#pl-h video');if(v){var p=v.play();if(p&&p.catch)p.catch(function(){})}},700)}else openStory(d.k)});
/* la palabra «reconoces» cambia de piel cada pocos segundos */
(function(){
  if(reduced)return;var P=['felino','manchas','selva','rayas'],i=0,kb=$('#kw .kb'),kt=$('#kw .kt');
  setInterval(function(){if(DK.paused)return;i=(i+1)%P.length;var n=P[(i+1)%P.length];
    kb.className='pf tone '+P[i]+' kb';kt.className='pf tone '+n+' kt';void kt.offsetWidth;kt.classList.add('go')},2800);
  kt.classList.add('go');
})();
/* los ojos de las dos A del logo siguen el puntero */
(function(){
  if(reduced||!window.matchMedia('(pointer:fine)').matches)return;
  var logos=$$('svg.logo'),raf=0,mx=0,my=0;
  function upd(){raf=0;logos.forEach(function(l){var r=l.getBoundingClientRect();if(!r.width||r.bottom<0||r.top>innerHeight)return;
    var dx=mx-(r.left+r.width/2),dy=my-(r.top+r.height/2),d=Math.hypot(dx,dy)||1,k=Math.min(1,d/320)*13;
    l.style.setProperty('--px',(dx/d*k).toFixed(1)+'px');l.style.setProperty('--py',(dy/d*k).toFixed(1)+'px')})}
  document.addEventListener('pointermove',function(e){mx=e.clientX;my=e.clientY;if(!raf)raf=requestAnimationFrame(upd)},{passive:true});
})();
/* inclinación suave de las tarjetas de video bajo el puntero */
(function(){
  if(reduced||!window.matchMedia('(pointer:fine)').matches)return;
  document.addEventListener('pointermove',function(e){var c=e.target.closest&&e.target.closest('.rc');if(!c)return;var r=c.getBoundingClientRect();
    c.style.setProperty('--ry',((e.clientX-r.left)/r.width*10-5).toFixed(1)+'deg');c.style.setProperty('--rx',(5-(e.clientY-r.top)/r.height*10).toFixed(1)+'deg')},{passive:true});
  document.addEventListener('pointerout',function(e){var c=e.target.closest&&e.target.closest('.rc');if(c&&!c.contains(e.relatedTarget)){c.style.removeProperty('--rx');c.style.removeProperty('--ry')}});
})();

/* ======================  INICIO: TRÁILER SIN AUDIO  ====================== */
(function(){
  var v=$('#heroVid'),b=$('#heroPause'),lab=$('span',b),use=$('use',b),manual=false,auto=false,srcs=[].concat(VIDEOS.hero||[]),fails=0;
  if(!srcs.length){b.style.display='none';return}
  if(reduced)v.removeAttribute('autoplay');
  v.innerHTML=srcs.map(function(u){return '<source src="'+u+'" type="video/'+(/\.webm$/.test(u)?'webm':'mp4')+'">'}).join('');
  v.load();
  function ui(p){lab.textContent=p?'Pausar':'Reproducir';b.setAttribute('aria-label',p?'Pausar el video y el carrusel':'Reproducir el video y el carrusel');use.setAttribute('href',p?'#i-pause':'#i-play')}
  function play(){var p=v.play();if(p&&p.catch)p.catch(function(){})}
  v.addEventListener('play',function(){ui(true)});v.addEventListener('pause',function(){ui(false)});
  v.addEventListener('error',function(){if(++fails>=srcs.length)b.style.display='none'},true);
  ui(false);
  b.addEventListener('click',function(){manual=true;if(v.paused){play();DK.paused=false}else{v.pause();DK.paused=true}});
  if('IntersectionObserver' in window)new IntersectionObserver(function(es){
    if(!es[0].isIntersecting){if(!v.paused){auto=true;v.pause()}}
    else if(auto&&!manual){auto=false;play()}
  },{threshold:.05}).observe($('#deck'));
})();

/* ======================  CIFRAS (cuentan al aparecer)  ====================== */
function factVal(f,n){return (f.pre||'')+(f.plain?String(Math.round(n)):Math.round(n).toLocaleString('es-EC'))+(f.post||'')}
$('#facts').innerHTML=FACTS.map(function(f,i){
  var src='<cite>Fuente: '+(f.u?'<a href="'+f.u+'" target="_blank" rel="noopener">'+esc(f.s)+'</a>':esc(f.s))+'</cite>';
  return '<div class="fact" data-rv style="--d:'+(i*.08)+'s"><b class="pf tone '+f.pat+'" data-count="'+i+'">'+factVal(f,f.n)+'</b><p>'+esc(f.t)+'</p>'+src+(f.cta?'<button class="btn pri sm" data-go="donar">Donar</button>':'')+'</div>'}).join('');
function countUp(el){
  var f=FACTS[+el.getAttribute('data-count')];if(f.plain||reduced||el.dataset.done)return;el.dataset.done='1';
  var t0=performance.now(),D=1400;
  (function step(now){var k=Math.min(1,(now-t0)/D),e=1-Math.pow(1-k,3);el.textContent=factVal(f,f.n*e);if(k<1)requestAnimationFrame(step)})(t0);
}

/* ======================  CÁPSULAS (verticales)  ====================== */
function capList(){return CAPS.map(function(c,i){return i}).filter(function(i){return S.ctab<0||CAPS[i].tab===S.ctab})}
function capCover(i,noM){var c=CAPS[i],t=TABS[c.tab];return plate({pat:t.pat,bg:t.bg,pre:c.pre,title:c.title,m:noM?'':c.m})}
function renderReels(){
  $('#capTabs').innerHTML=[{name:'Todas'}].concat(TABS).map(function(t,k){var i=k-1,n=i<0?CAPS.length:CAPS.filter(function(x){return x.tab===i}).length;
    return '<button class="tab" role="tab" aria-selected="'+(S.ctab===i)+'" data-ctab="'+i+'">'+t.name+' <small>('+n+')</small></button>'}).join('');
  $('#reels').innerHTML=capList().map(function(i,k){var c=CAPS[i];
    return '<button class="rc'+(S.seen[i]?' seen':'')+'" data-cap="'+i+'" style="animation:rise .6s '+(k*.06)+'s var(--ease) both" aria-label="Ver cápsula '+(i+1)+': '+esc(c.pre+' '+c.title)+'">'+capCover(i)+'<span class="num">'+(i+1)+'</span><span class="dur">'+fmt(c.dur)+'</span><span class="pl">'+ico('i-play')+'</span></button>'}).join('');
  $('#reels').scrollLeft=0;
}
document.addEventListener('click',function(e){var b=e.target.closest('[data-ctab]');if(b){S.ctab=+b.getAttribute('data-ctab');renderReels()}});
$('#reelPrev').addEventListener('click',function(){$('#reels').scrollBy({left:-$('#reels').clientWidth*.8,behavior:reduced?'auto':'smooth'})});
$('#reelNext').addEventListener('click',function(){$('#reels').scrollBy({left:$('#reels').clientWidth*.8,behavior:reduced?'auto':'smooth'})});

/* visor tipo historia: avanza solo, toques a los lados, flechas, espacio y Escape */
var ST={open:false,list:[],i:0,t:0,paused:false,last:null};
function openStory(cap){ST.list=capList();if(ST.list.indexOf(cap)<0){S.ctab=-1;renderReels();ST.list=capList()}ST.i=ST.list.indexOf(cap);ST.t=0;ST.paused=false;ST.open=true;ST.last=document.activeElement;
  $('#story-v').hidden=false;document.body.classList.add('lock');renderStory();$('#stClose').focus()}
function closeStory(){ST.open=false;$('#story-v').hidden=true;document.body.classList.remove('lock');$('#stFrame').innerHTML='';renderReels();if(ST.last&&ST.last.focus)ST.last.focus({preventScroll:true})}
function renderStory(){
  var i=ST.list[ST.i],c=CAPS[i],src=VIDEOS.caps[i];S.seen[i]=true;
  $('#stFrame').innerHTML='<div class="st-bars">'+ST.list.map(function(x,k){return '<i><b style="width:'+(k<ST.i?100:0)+'%"></b></i>'}).join('')+'</div>'+
   '<div class="st-head"><span class="av"><img src="assets/mascot/sacha-saluda.webp" alt=""></span><div><b>Proyecto Sacha</b><span>'+esc(TABS[c.tab].name)+' · cápsula '+(i+1)+'</span></div><div class="sp"><button id="stPause" aria-label="Pausar">'+ico('i-pause')+'</button></div></div>'+
   (src?'<video id="stVid" src="'+esc(src)+'" autoplay playsinline></video>':capCover(i)+'<div class="st-mock"><span class="badge">Video pendiente · vista de maqueta</span></div>')+
   '<button class="st-tap l" data-st="-1" aria-label="Anterior"></button><button class="st-tap r" data-st="1" aria-label="Siguiente"></button>'+
   '<div class="st-foot"><p>'+esc(c.desc)+'</p><div class="acts"><button class="btn inv" id="stShare">'+ico('i-share')+'Compartir</button><button class="btn line" data-go-close="encontre" style="color:#fff">Encontré un animal</button></div></div>';
  var v=$('#stVid');if(v){v.addEventListener('ended',function(){stStep(1)});v.addEventListener('timeupdate',function(){var b=$$('.st-bars b')[ST.i];if(b&&v.duration)b.style.width=(v.currentTime/v.duration*100)+'%'})}
}
function stStep(d){var n=ST.i+d;if(n<0)n=0;if(n>=ST.list.length){closeStory();return}ST.i=n;ST.t=0;renderStory()}
setInterval(function(){
  if(!ST.open||ST.paused||VIDEOS.caps[ST.list[ST.i]])return;
  ST.t+=0.1;var b=$$('.st-bars b')[ST.i];if(b)b.style.width=Math.min(100,ST.t/MOCK_SECONDS*100)+'%';
  if(ST.t>=MOCK_SECONDS)stStep(1);
},100);
document.addEventListener('click',function(e){
  var r=e.target.closest('[data-cap]');if(r){openStory(+r.getAttribute('data-cap'));return}
  if(!ST.open)return;
  var t=e.target.closest('[data-st]');if(t){stStep(+t.getAttribute('data-st'));return}
  if(e.target.closest('#stPrev')){stStep(-1);return}
  if(e.target.closest('#stNext')){stStep(1);return}
  if(e.target.closest('#stClose')||e.target===$('#story-v')){closeStory();return}
  if(e.target.closest('#stPause')){ST.paused=!ST.paused;var v=$('#stVid');if(v){if(ST.paused)v.pause();else v.play()}$('#stPause').innerHTML=ico(ST.paused?'i-play':'i-pause');$('#stPause').setAttribute('aria-label',ST.paused?'Reanudar':'Pausar');return}
  if(e.target.closest('#stShare')){copy(location.href.split('#')[0]+'#videos','Enlace copiado');return}
  var gc=e.target.closest('[data-go-close]');if(gc){var id=gc.getAttribute('data-go-close');closeStory();go(id)}
});

/* ======================  VIDEOS HORIZONTALES  ====================== */
function hList(){return HVIDS.map(function(v,i){return i}).filter(function(i){return HVIDS[i].tab===S.htab})}
function hSrc(v){return v.src==='hero'?[].concat(VIDEOS.hero):(VIDEOS.h[v.id]?[VIDEOS.h[v.id]]:[])}
function hCover(v,bars){
  var extra='';if(v.wave&&bars){for(var i=0;i<30;i++){extra+='<i style="height:'+(30+Math.abs(Math.sin(i*1.7))*70).toFixed(0)+'%;animation-delay:'+(i*0.07).toFixed(2)+'s"></i>'}extra='<div class="wave-bars">'+extra+'</div>'}
  if(v.src==='hero')return '<div class="plate"><img src="assets/video/hero-poster.jpg" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"><div class="ptx" style="text-shadow:0 2px 12px rgba(0,0,0,.6)"><small>'+esc(v.pre)+'</small><b>'+esc(v.title)+'</b></div></div>';
  return plate({pat:v.pat,bg:'#24362E',pre:v.pre,title:v.title,m:v.m,extra:extra});
}
var ICON_PLAY='<svg viewBox="0 0 16 16"><path d="M4 2l10 6-10 6z"/></svg>',ICON_PAUSE='<svg viewBox="0 0 16 16"><path d="M3 2h4v12H3zM9 2h4v12H9z"/></svg>';
function renderH(){
  var v=HVIDS[S.h],srcs=hSrc(v),el=$('#pl-h');
  $('#hTabs').innerHTML=HTABS.map(function(t,i){return '<button class="tab" role="tab" aria-selected="'+(S.htab===i)+'" data-htab="'+i+'">'+t+'</button>'}).join('');
  el.classList.remove('playing');S.playing=false;S.prog=0;
  if(srcs.length){
    el.innerHTML='<div class="stage2"><video controls playsinline preload="metadata" poster="'+(v.src==='hero'?'assets/video/hero-poster.jpg':'')+'">'+srcs.map(function(u){return '<source src="'+u+'" type="video/'+(/\.webm$/.test(u)?'webm':'mp4')+'">'}).join('')+'</video></div>';
  }else{
    el.innerHTML='<div class="stage2">'+hCover(v,true)+'<span class="badge" style="top:12px;left:12px">Video pendiente · vista de maqueta</span><button class="bigplay" data-hp aria-label="Reproducir"></button></div><div class="controls"><button class="pp" data-hp aria-label="Reproducir o pausar">'+ICON_PLAY+'</button><div class="track2" data-hseek><div><i></i></div></div><time>0:00 / '+fmt(v.dur)+'</time></div>';
  }
  $('#hKick').textContent=v.kind+' · '+fmt(v.dur);$('#hTitle').textContent=v.pre+' '+v.title;$('#hDesc').textContent=v.desc;
  $('#hlist').innerHTML='<span class="label">'+HTABS[S.htab]+'</span>'+hList().map(function(i){var x=HVIDS[i];
    return '<button class="hrow" data-h="'+i+'" aria-current="'+(i===S.h)+'"><span class="th">'+hCover(x,false)+'</span><span><b>'+esc(x.pre+' '+x.title)+'</b><span>'+x.kind+' · '+fmt(x.dur)+'</span></span></button>'}).join('');
}
function hPaint(){var el=$('#pl-h'),v=HVIDS[S.h],i=$('.track2 i',el),t=$('time',el),b=$('.pp',el);el.classList.toggle('playing',S.playing);if(i)i.style.width=S.prog+'%';if(t)t.textContent=fmt(v.dur*S.prog/100)+' / '+fmt(v.dur);if(b)b.innerHTML=S.playing?ICON_PAUSE:ICON_PLAY}
setInterval(function(){if(!S.playing)return;S.prog+=100/300;if(S.prog>=100){S.prog=0;S.playing=false}hPaint()},100);
document.addEventListener('click',function(e){
  var b=e.target.closest('[data-htab]');if(b){S.htab=+b.getAttribute('data-htab');S.h=hList()[0];renderH();return}
  var r=e.target.closest('[data-h]');if(r){S.h=+r.getAttribute('data-h');renderH();var v=$('#pl-h video');if(v){var p=v.play();if(p&&p.catch)p.catch(function(){})}else{S.playing=true;hPaint()}return}
  if(e.target.closest('[data-hp]')){S.playing=!S.playing;hPaint();return}
  var s=e.target.closest('[data-hseek]');if(s){var rc=s.getBoundingClientRect();S.prog=Math.max(0,Math.min(99,(e.clientX-rc.left)/rc.width*100));hPaint();return}
  var hp=e.target.closest('[data-hplay]');if(hp){var id=hp.getAttribute('data-hplay');S.h=HVIDS.map(function(x){return x.id}).indexOf(id);S.htab=HVIDS[S.h].tab;renderH();go('horizontales')}
});
$('#hShare').addEventListener('click',function(){copy(location.href.split('#')[0]+'#videos','Enlace copiado')});

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
function opt(attr,i,o,pressed,sub){return '<button class="opt" '+attr+'="'+i+'" aria-pressed="'+pressed+'" style="--c:'+o.c+'"><span class="oi">'+ico(o.ic)+'</span><b>'+o.title+'</b><span>'+sub+'</span></button>'}
function bodySit(){
  var chosen=T.ani>=0?'<p class="small">Tipo de animal elegido: <b>'+esc(ANIS[T.ani].title)+'</b>. <button class="linkbtn" data-tstep="1">Cambiar</button></p>':'';
  return '<div class="tbody"><h3 class="tq" id="tq" tabindex="-1">¿Qué está pasando?</h3>'+chosen+'<div class="opts">'+SITS.map(function(s,i){return opt('data-sit',i,s,T.sit===i,s.sub)}).join('')+'</div>'+safety()+'</div>';
}
function bodyAni(){
  return '<div class="tbody"><h3 class="tq" id="tq" tabindex="-1">¿Qué tipo de animal es?</h3><div class="opts">'+ANIS.map(function(a,i){return opt('data-ani',i,a,T.ani===i,a.eg)}).join('')+'</div><div class="backrow"><button class="linkbtn" data-tstep="0">← Cambiar la situación</button></div></div>';
}
function guideLists(){var s=SITS[T.sit],a=ANIS[T.ani];return {s:s,a:a,doL:s.do.concat(a.do),dontL:s.dont.concat(a.dont)}}
function bodyRes(){
  var g=guideLists();
  return '<div class="tbody"><div class="rhead"><div class="row"><span class="urgtag">'+g.s.urg+'</span><span class="tag" style="--c:'+g.a.c+'">'+esc(g.a.title)+'</span></div><h3 class="tq" id="tq" tabindex="-1">'+g.s.title+'</h3></div>'+
   (g.a.danger?'<div class="safety">'+ico('i-alert')+'<p>Si hay riesgo para personas, llama primero al <button data-copy-num="911" aria-label="Copiar el número 911">911</button>.</p></div>':'')+
   '<div class="rcols"><div class="rbox do"><h4>Haz esto</h4>'+g.doL.map(function(x,i){var k='d'+i;return '<button class="chk" role="checkbox" aria-checked="'+!!T.chk[k]+'" data-chk="'+k+'"><i>'+ico('i-check')+'</i><span>'+esc(x)+'</span></button>'}).join('')+'</div>'+
   '<div class="rbox dont"><h4>No hagas esto</h4><ul class="nox">'+g.dontL.map(function(x){return '<li>'+ico('i-x')+'<span>'+esc(x)+'</span></li>'}).join('')+'</ul></div></div>'+
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
  return '<div class="tbody"><div class="rhead"><span class="urgtag" style="background:var(--selva)">Reporte preparado</span><h3 class="tq" id="tq" tabindex="-1">Gracias por avisar, '+esc(f.name.trim().split(/\s+/)[0])+'</h3></div>'+
   '<dl class="sumbox"><div><dt>Situación</dt><dd>'+esc(lookup(SITS,f.sit).title)+'</dd></div><div><dt>Animal</dt><dd>'+esc(lookup(ANIS,f.type).title)+'</dd></div><div><dt>Ubicación</dt><dd>'+esc(f.where)+'</dd></div>'+(f.desc.trim()?'<div><dt>Descripción</dt><dd>'+esc(f.desc)+'</dd></div>':'')+'<div><dt>Contacto</dt><dd>'+esc(f.name)+' · '+esc(f.phone)+'</dd></div></dl>'+
   (f.photo?'<img class="photo-prev on" src="'+f.photo+'" alt="Foto adjunta al reporte">':'')+
   '<div class="ract"><button class="btn pri" data-copyrep>'+ico('i-copy')+'Copiar reporte</button><button class="btn line" data-treset>Nuevo reporte</button></div>'+
   '<p class="proto">Maqueta: el reporte aún no llega a la fundación. Cuando se conecte el canal oficial, este paso lo enviará al equipo. Mientras tanto, copia el texto y compártelo por los canales de la fundación. Si hay riesgo para personas, llama al 911.</p></div>';
}
function sachaSay(){
  if(T.sent)return ['¡Gracias por avisar!','Ya hiciste lo más importante. Copia el reporte y compártelo con el equipo.'];
  return [['Primero, respira.','Cuéntame qué está pasando y te explico qué hacer.'],['Ya casi.','Con saber el tipo de animal ajusto las indicaciones.'],['Con calma.','Sigue estos pasos y marca los que ya hiciste.'],['Un último paso.','Con estos datos el equipo puede ubicarlo más rápido.']][T.step];
}
function renderGuide(){var m=sachaSay();$('#guide').innerHTML='<span class="av"><img src="assets/mascot/sacha-saluda.webp" alt="Sacha"></span><div class="bubble"><b>'+m[0]+'</b>'+m[1]+'</div>'}
function renderTool(focus){
  var b=T.step===0?bodySit():T.step===1?bodyAni():T.step===2?bodyRes():(T.sent?bodySent():bodyForm());
  $('#tmain').innerHTML=stepper()+b;renderGuide();
  if(focus){var q=$('#tq');if(q)q.focus({preventScroll:true});var r=$('#tmain').getBoundingClientRect();if(r.top<70||r.top>window.innerHeight*.5)window.scrollTo({top:r.top+window.scrollY-84,behavior:reduced?'auto':'smooth'})}
}
function prepForm(){if(T.ani>=0)T.f.type=ANIS[T.ani].id;if(T.sit>=0)T.f.sit=SITS[T.sit].id}
function resetTool(){T={step:0,sit:-1,ani:-1,chk:{},tried:false,sent:false,f:{type:'',sit:'',where:'',desc:'',name:'',phone:'',ok:false,photo:''}}}
$('#nums').innerHTML='<span class="label">Números útiles</span>'+NUMS.map(function(n){return '<div class="num"><div><b'+(n.v?'':' class="p"')+'>'+(n.v||n.k)+'</b><small>'+(n.v?n.k+'. ':'')+n.note+'</small></div>'+(n.v?'<button class="cpy" data-copy-num="'+n.v+'">'+ico('i-copy')+'Copiar</button>':'<span class="tag dash plain">por definir</span>')+'</div>'}).join('');
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
document.addEventListener('input',function(e){var m={rWhere:'where',rDesc:'desc',rName:'name',rPhone:'phone'}[e.target.id];if(m)T.f[m]=e.target.value});
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

/* ======================  EL RECORRIDO DE UN RESCATE  ====================== */
$('#journey').innerHTML=STEPS.map(function(s,i){
  return '<li class="jstep" data-rv style="--d:'+(i*.12)+'s"><span class="dot">'+ico(s.icon)+'</span><span class="big pf tone '+s.pat+'">'+(i+1)+'</span><h3>'+s.title+'</h3><p>'+s.text+'</p><button class="btn line sm" data-cap="'+(s.cap-1)+'">'+ico('i-play')+' Ver la cápsula '+s.cap+'</button></li>'}).join('');
$('#allies').innerHTML=ALLIES.map(function(a){return '<li class="tag" style="--c:'+a[1]+'">'+a[0]+'</li>'}).join('');
function journeySpy(){
  var j=$('#journey'),r=j.getBoundingClientRect(),vh=window.innerHeight,p=Math.max(0,Math.min(1,(vh*.8-r.top)/(r.height+vh*.25)));
  j.style.setProperty('--p',p.toFixed(3));$('#jwrap').style.setProperty('--p',p.toFixed(3));
  $$('.jstep',j).forEach(function(el,i){el.classList.toggle('on',p>=i/STEPS.length+.04)});
}
function renderAlert(){
  var el=$('#alert');
  if(S.alertOk){el.innerHTML='<span class="label">Liberaciones</span><h3>Listo, te avisaremos</h3><p class="small">Maqueta: la suscripción aún no está conectada a un correo.</p>';return}
  el.innerHTML='<span class="label">Liberaciones</span><h3>Avísame cuando un animal vuelva a su hábitat</h3><p class="small">Un correo cuando haya una liberación o un video nuevo. Nada más.</p><form class="inline-form" id="alertForm" novalidate><input id="alertMail" type="email" autocomplete="email" placeholder="tu@correo.com" aria-label="Correo"><button class="btn pri sm" type="submit">'+ico('i-bell')+'Avisarme</button></form>';
}
document.addEventListener('submit',function(e){if(e.target.id!=='alertForm')return;e.preventDefault();var m=$('#alertMail').value;if(validMail(m)){S.alertOk=true;renderAlert()}else{e.target.classList.add('bad');$('#alertMail').focus();toast('Escribe un correo válido')}});

/* ======================  HISTORIAS  ====================== */
$('#stories').innerHTML=STORIES.map(function(s,i){
  return '<article class="story-card" data-rv style="--d:'+((i%3)*.1)+'s"><div class="cov">'+plate({pat:s.pat,bg:s.bg,pre:s.pre,title:s.title})+'</div><div class="in"><span class="tag" style="--c:'+s.c+'">'+s.tag+'</span><p>'+esc(s.t)+'</p><div class="foot"><a class="src" href="'+s.u+'" target="_blank" rel="noopener">Leer en '+s.s+' ↗</a><button class="btn line sm" data-sponsor>'+ico('i-heart')+'Apadrinar</button></div></div></article>'}).join('');
document.addEventListener('click',function(e){if(e.target.closest('[data-sponsor]')){S.freq=2;S.giveStep=0;renderGive();go('donar')}});

/* ======================  GALERÍA  ====================== */
function visPhotos(){return PHOTOS.map(function(p,i){return {h:p[0],cat:p[1],cap:p[2],n:i+1}}).filter(function(p){return S.gal==='Todo'||p.cat===S.gal})}
function phArt(p){return '<div class="pt" style="background-image:url(assets/patterns/tone-sage-'+PAT[p.cat]+'.svg)"></div><div class="cam"><span>'+ico('i-cam')+'</span></div>'}
function renderGallery(){
  $('#filters').innerHTML=GAL.map(function(g){return '<button class="filter" data-gal="'+g[0]+'" aria-pressed="'+(S.gal===g[0])+'" style="--c:'+g[1]+'">'+g[0]+'</button>'}).join('');
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
  if(ST.open){if(e.key==='Escape')closeStory();if(e.key==='ArrowRight')stStep(1);if(e.key==='ArrowLeft')stStep(-1);if(e.key===' '&&$('#stPause')){e.preventDefault();$('#stPause').click()}return}
  if(e.key==='Escape'){if(S.lb>=0)closeLb();closeMenu()}
  if(S.lb>=0&&e.key==='ArrowRight')openLb(S.lb+1);
  if(S.lb>=0&&e.key==='ArrowLeft')openLb(S.lb-1);
});

/* ======================  NOSOTROS: FICHA, HISTORIA Y MAPA  ====================== */
$('#ficha').innerHTML=FICHA.map(function(f){return '<div><dt>'+f[0]+'</dt><dd>'+f[1]+'</dd></div>'}).join('');
$('#story').innerHTML=STORY.map(function(p){return '<p>'+esc(p)+'</p>'}).join('')+'<p class="src">Fuentes: '+STORY_SRC.map(function(s){return '<a href="'+s[1]+'" target="_blank" rel="noopener">'+s[0]+'</a>'}).join(' · ')+'</p><div><button class="btn pri" data-hplay="sacha">'+ico('i-play')+'Ver «¿Quién es Sacha?»</button></div>';
$('#timeline').innerHTML=TL.map(function(t){return '<li><b>'+t[0]+'</b><span>'+esc(t[1])+' <span class="src">'+t[2]+'</span></span></li>'}).join('');
function renderMap(){
  var box=$('#mapbox');$$('.mpin,.mref',box).forEach(function(n){n.remove()});
  MREF.forEach(function(r){var d=document.createElement('div');d.className='mref';d.style.left=r.pos[0]+'%';d.style.top=r.pos[1]+'%';d.innerHTML='<i></i><span>'+r.name+'</span>';box.appendChild(d)});
  SEDES.forEach(function(d,i){var b=document.createElement('button');b.className='mpin';b.style.left=d.pos[0]+'%';b.style.top=d.pos[1]+'%';b.style.setProperty('--dx',d.dx+'px');b.style.setProperty('--dy',d.dy+'px');b.style.setProperty('--d',(i*.15)+'s');b.setAttribute('aria-pressed',S.sede===i);b.setAttribute('data-sede',i);b.setAttribute('aria-label','Sede: '+d.pin);b.innerHTML='<i></i><span>'+d.pin+'</span>';box.appendChild(b)});
  $('#sedes').innerHTML=SEDES.map(function(d,i){
    return '<div class="sede'+(S.sede===i?' on':'')+'"><span class="label">Sede '+d.n+' · '+d.kind+'</span><h3><button data-sede="'+i+'" aria-pressed="'+(S.sede===i)+'">'+d.name+'</button></h3><span>'+d.desc+'</span><span class="meta"><span>Dirección: por confirmar</span><span>Horario: por confirmar</span>'+(d.note?'<span>'+d.note+'</span>':'')+'</span><a class="btn line sm" href="https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(d.q)+'" target="_blank" rel="noopener">Ver zona en Google Maps '+ico('i-ext')+'</a></div>'}).join('')+
    '<div class="callout">'+ico('i-info')+'<p>Por seguridad no recibimos visitas en los centros: resguardamos animales que llegan de incautaciones y allanamientos.</p></div>';
}
document.addEventListener('click',function(e){var b=e.target.closest('[data-sede]');if(b){S.sede=+b.getAttribute('data-sede');renderMap()}});

/* ======================  FAUNA, MITOS Y PREGUNTAS  ====================== */
function renderFauna(){
  var G=['Todos','Mamífero','Ave','Reptil'],L={'Todos':'Todos','Mamífero':'Mamíferos','Ave':'Aves','Reptil':'Reptiles'};
  $('#ffilters').innerHTML=G.map(function(g){return '<button class="filter" data-fg="'+g+'" aria-pressed="'+(S.fg===g)+'" style="--c:'+(GROUP_C[g]||'var(--selva)')+'">'+L[g]+'</button>'}).join('');
  $('#fauna-list').innerHTML=FAUNA.filter(function(f){return S.fg==='Todos'||f.g===S.fg}).map(function(f){
    return '<article class="fcard" data-rv><div class="cov">'+plate({pat:f.pat,pre:f.pre,title:f.n})+'</div><div class="in"><span class="tag" style="--c:'+GROUP_C[f.g]+'">'+f.g+'</span><h3 style="font-size:22px;font-weight:800">'+f.full+'</h3><em>'+f.l+'</em><p>'+esc(f.t)+'</p><div class="foot"><button class="btn line sm" data-fani="'+f.ani+'">Si lo encuentras</button>'+(f.s?'<span class="src">Fuente: '+(f.u?'<a href="'+f.u+'" target="_blank" rel="noopener">'+f.s+'</a>':f.s)+'</span>':'')+'</div></div></article>'}).join('');
}
document.addEventListener('click',function(e){var b=e.target.closest('[data-fg]');if(b){S.fg=b.getAttribute('data-fg');renderFauna()}});
/* ======================  QUIZ: ¿MITO O REALIDAD?  ====================== */
var Q={i:0,ans:[]};
function renderQuiz(){
  var el=$('#quizBox'),done=Q.i>=QUIZ.length,ok=Q.ans.filter(Boolean).length,answered=Q.ans.length>Q.i;
  var pose=done?(ok>=5?'sacha-dato':'sacha-saluda'):(answered?(Q.ans[Q.i]?'sacha-dato':'sacha-donar'):'sacha-saluda');
  var bar='<div class="qbar" aria-hidden="true">'+QUIZ.map(function(x,i){return '<i class="'+(i<Q.ans.length?(Q.ans[i]?'ok':'ko'):(i===Q.i?'cur':''))+'"></i>'}).join('')+'</div>';
  var body;
  if(done){
    body='<span class="label" style="color:var(--on-dk2)">Resultado</span><p class="qtext">'+ok+' de '+QUIZ.length+'. '+(ok===QUIZ.length?'¡Reconoces a tus vecinos!':ok>=4?'¡Muy bien! Ya casi.':'Ahora ya sabes un poco más.')+'</p><p style="color:var(--on-dk)">Comparte el quiz para que más personas reconozcan a la fauna de la costa.</p><div class="qbtns"><button class="btn inv" id="qShare">'+ico('i-share')+'Compartir resultado</button><button class="btn line" id="qAgain" style="color:var(--crema)">Jugar de nuevo</button><button class="btn mint" data-go="fauna">Ver la guía de campo</button></div>';
  }else{
    var x=QUIZ[Q.i];
    body='<span class="label" style="color:var(--on-dk2)">Frase '+(Q.i+1)+' de '+QUIZ.length+'</span><p class="qtext" id="qText" tabindex="-1">«'+esc(x.q)+'»</p>'+
     (answered?'<div class="qfb '+(Q.ans[Q.i]?'ok':'ko')+'"><b>'+(Q.ans[Q.i]?'¡Exacto! ':'Casi. ')+(x.a?'Es realidad.':'Es un mito.')+'</b><p>'+esc(x.t)+'</p>'+(x.s?'<span class="small">Fuente: '+x.s+'</span>':'')+'</div><div class="qbtns"><button class="btn inv" id="qNext">'+(Q.i<QUIZ.length-1?'Siguiente frase':'Ver resultado')+' '+ico('i-arrow')+'</button></div>'
     :'<div class="qbtns"><button class="btn urg" data-qa="0">Mito</button><button class="btn mint" data-qa="1">Realidad</button></div>');
  }
  el.innerHTML='<figure class="qfig"><span class="qscore">'+ok+' / '+QUIZ.length+'</span><img src="assets/mascot/'+pose+'.webp" alt="Sacha reacciona a tu respuesta"></figure><div class="qbody">'+bar+body+'</div>';
}
document.addEventListener('click',function(e){
  var a=e.target.closest('[data-qa]');if(a){Q.ans[Q.i]=(a.getAttribute('data-qa')==='1')===QUIZ[Q.i].a;renderQuiz();var n=$('#qNext');if(n)n.focus({preventScroll:true});return}
  if(e.target.closest('#qNext')){Q.i++;renderQuiz();var t=$('#qText')||$('#qShare');if(t)t.focus({preventScroll:true});return}
  if(e.target.closest('#qAgain')){Q={i:0,ans:[]};renderQuiz();return}
  if(e.target.closest('#qShare')){var ok=Q.ans.filter(Boolean).length;copy('Saqué '+ok+' de '+QUIZ.length+' en «¿Mito o realidad?» de Proyecto Sacha. ¿Reconoces a la fauna de la costa? '+location.href.split('#')[0]+'#quiz','Resultado copiado')}
});

function renderFaq(){
  $('#faq').innerHTML=FAQS.map(function(f,i){var o=S.faq===i;return '<div class="item'+(o?' open':'')+'"><h4><button data-faq="'+i+'" aria-expanded="'+o+'" id="fq'+i+'" aria-controls="fa'+i+'"><span>'+f[0]+'</span><span class="pm" aria-hidden="true">'+(o?'−':'+')+'</span></button></h4><div class="ans" id="fa'+i+'" role="region" aria-labelledby="fq'+i+'">'+f[1]+'</div></div>'}).join('');
}
document.addEventListener('click',function(e){var b=e.target.closest('[data-faq]');if(b){var i=+b.getAttribute('data-faq');S.faq=S.faq===i?-1:i;renderFaq();var n=$('#fq'+i);if(n)n.focus()}});

/* ======================  DONAR  ====================== */
function amount(){var c=parseFloat(S.custom);return S.amt>=0?AMTS[S.amt]:(c>0?c:0)}
function num(n){return String(n).replace('.',',')}
function impact(){
  var a=amount();if(a<=0)return ['Elige un monto','Calculamos cuánta operación cubre tu aporte.',0];
  var perMin=YEAR_COST/525600,mins=a/perMin,perHour=YEAR_COST/8760,yr=a*12;
  var t=mins<90?'unos '+Math.max(1,Math.round(mins))+' minutos':'unas '+num((mins/60).toFixed(1))+' horas';
  var line2=S.freq===0?'Si lo repites cada mes, al año serían '+money(yr)+'.':'En un año serían '+money(yr)+', unas '+num((yr/perHour).toFixed(1))+' horas de operación.';
  if(S.freq===2)line2='Al apadrinar recibirás noticias de la recuperación de un paciente. '+line2;
  return ['Tu aporte de '+money(a)+' cubre '+t+' de operación.',line2,Math.min(100,(S.freq?yr:a)/(YEAR_COST/365)*100)];
}
function impactHTML(){var im=impact();return '<b>'+im[0]+'</b><span>'+im[1]+'</span><span class="meter" aria-hidden="true"><i style="width:'+im[2].toFixed(1)+'%"></i></span><span class="small">La barra compara tu aporte '+(S.freq?'de un año ':'')+'con un día de operación (unos '+money(YEAR_COST/365)+'). Equivalencia ilustrativa.</span>'}
var FREQ=['Única vez','Mensual','Apadrinar'];
function renderGive(){
  var a=amount(),f=['único','mensual','de padrino o madrina'][S.freq],el=$('#give');
  if(S.giveStep===1){
    el.innerHTML='<div class="thanks"><span class="label">Donaciones · último paso</span><h3>Gracias por tu aporte '+f+' de '+money(a)+'</h3><p>Para completarlo, haz una transferencia con estos datos. Pronto sumaremos pago con tarjeta.</p><dl class="bank">'+BANK.map(function(b,i){return '<div><dt>'+b[0]+'</dt><dd>'+b[1]+'</dd><button data-copy="'+i+'" aria-label="Copiar '+b[0]+'">Copiar</button></div>'}).join('')+'</dl><p class="small">Este paso es una maqueta. Aquí irán el pago y el recibo.</p><button class="btn line" id="giveBack" style="justify-self:start">← Volver</button></div>';
    return;
  }
  el.innerHTML='<span class="label">Elige cómo aportar</span><h3>Dona a Proyecto Sacha</h3>'+
   '<div class="seg" role="group" aria-label="Tipo de aporte">'+FREQ.map(function(x,i){return '<button data-freq="'+i+'" aria-pressed="'+(S.freq===i)+'">'+x+'</button>'}).join('')+'</div>'+
   '<div class="bigamt" id="bigAmt">'+money(a)+'<small>'+(S.freq?'/ mes':'una vez')+'</small></div>'+'<div class="amts" role="group" aria-label="Montos sugeridos">'+AMTS.map(function(x,i){return '<button data-amt="'+i+'" aria-pressed="'+(S.amt===i)+'">$'+x+'</button>'}).join('')+'</div>'+'<label class="range"><span class="label">O desliza para elegir otro monto</span><input id="amtRange" type="range" min="1" max="300" step="1" value="'+a+'" aria-label="Monto de la donación en dólares"><span class="rl"><span>$1</span><span>$300</span></span></label>'+
   '<div class="impact" id="impact" aria-live="polite">'+impactHTML()+'</div>'+
   '<div class="covers"><b>Tu aporte cubre:</b><ul><li>Medicinas e insumos</li><li>Traslados y logística</li><li>Alimentación en rehabilitación</li></ul></div>'+
   '<button class="btn pri" id="doGive" '+(a>0?'':'disabled')+'>'+ico('i-heart')+'<span>Donar '+(a>0?money(a)+(S.freq?' / mes':''):'')+'</span></button>'+
   '<p class="small">Montos de ejemplo. Métodos: transferencia ahora; tarjeta y PayPal próximamente.'+(S.freq===2?' Apadrinar es una función próxima: por ahora funciona como aporte mensual.':'')+'</p>';
}
function syncGive(){var a=amount(),b=$('#doGive'),im=$('#impact'),big=$('#bigAmt');if(big){big.innerHTML=money(a)+'<small>'+(S.freq?'/ mes':'una vez')+'</small>';big.classList.remove('bump');void big.offsetWidth;big.classList.add('bump')}if(im)im.innerHTML=impactHTML();if(b){b.disabled=!(a>0);$('span',b).textContent='Donar '+(a>0?money(a)+(S.freq?' / mes':''):'')}}
document.addEventListener('click',function(e){
  var f=e.target.closest('[data-freq]');if(f){S.freq=+f.getAttribute('data-freq');renderGive();return}
  var m=e.target.closest('[data-amt]');if(m){S.amt=+m.getAttribute('data-amt');S.custom='';renderGive();return}
  if(e.target.closest('#doGive')&&amount()>0){S.giveStep=1;renderGive();return}
  if(e.target.id==='giveBack'){S.giveStep=0;renderGive();return}
  var c=e.target.closest('[data-copy]');if(c){var b=BANK[+c.getAttribute('data-copy')];copy(b[1],b[0]+' copiado')}
  if(e.target.closest('#shareSite'))copy(location.href.split('#')[0],'Enlace copiado');
});
document.addEventListener('input',function(e){if(e.target.id==='amtRange'){S.custom=e.target.value;var k=AMTS.indexOf(+e.target.value);S.amt=k;$$('.amts button').forEach(function(x,i){x.setAttribute('aria-pressed',i===k?'true':'false')});syncGive()}});

/* ======================  CONVENIOS (en lugar de voluntariado abierto)  ====================== */
function renderConv(){
  var el=$('#conv'),v=S.c,t=S.cTried;
  if(S.cOk){el.innerHTML='<div class="thanks"><span class="label">Convenios</span><h3>Solicitud enviada</h3><p>Gracias, '+esc(v.name)+'. Te escribiremos a '+esc(v.mail)+' para conversar el convenio.</p><p class="small">Maqueta: el formulario aún no está conectado a un correo o base de datos.</p><button class="btn line" id="convBack" style="justify-self:start">← Volver</button></div>';return}
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
$('#soc').innerHTML=SOC.map(function(s,i){return '<div class="sc'+(s[3]?' main':'')+'" data-rv style="--c:'+s[2]+';--d:'+(i*.08)+'s"><h3>'+s[0]+'</h3><p class="small">'+s[1]+'</p><a class="btn '+(s[3]?'inv':'line')+' sm" href="#redes" data-noop>Seguir ↗</a></div>'}).join('');

/* ======================  ARRANQUE Y APARICIONES  ====================== */
renderReels();renderH();renderQuiz();renderTool(false);renderAlert();renderMap();renderFauna();renderFaq();renderGallery();renderGive();renderConv();onScroll();
(function(){
  var els=$$('[data-rv]');
  if(reduced||!('IntersectionObserver' in window)){$$('[data-count]').forEach(countUp);return}
  var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');$$('[data-count]',en.target).forEach(countUp);io.unobserve(en.target)}})},{threshold:.12});
  els.forEach(function(e){if(e.getBoundingClientRect().top>window.innerHeight*.9){e.classList.add('rv');io.observe(e)}else $$('[data-count]',e).forEach(countUp)});
  /* las fichas de fauna se vuelven a dibujar al filtrar: se muestran de inmediato */
  document.addEventListener('click',function(e){if(e.target.closest('[data-fg]'))$$('#fauna-list .fcard').forEach(function(c){c.classList.add('in')})});
})();
})();
