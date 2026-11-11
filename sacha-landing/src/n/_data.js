(function(){
'use strict';

/* ======================  CONTENIDO EDITABLE  ======================
   VIDEOS: ruta del .mp4 de cada pieza (vacío = vista de maqueta). PODCAST: pega el ID de YouTube de cada episodio
   (lo que va después de «v=») y se reproduce incrustado en esta página. NETS: URL de cada red; mientras esté
   vacía, los botones avisan que el enlace está por conectar. Los ánimos de Sacha están en moods.js. */
var VIDEOS={hero:['assets/video/hero.mp4','assets/video/hero.webm'],sacha:'',caps:['','','','','','','','']};
var MOCK_SECONDS=8, YEAR_COST=350000;
var NETS={
 instagram:{name:'Instagram',ab:'IG',c:'#D17A5B',t:'#1B1210',url:'',handle:'@proyectosacha · por confirmar',what:'Fotos y reels del día a día del rescate.'},
 tiktok:{name:'TikTok',ab:'TT',c:'#24362E',t:'#F4EFE6',url:'',handle:'@proyectosacha · por confirmar',what:'Las cápsulas cortas: cada capítulo en vertical.'},
 youtube:{name:'YouTube',ab:'YT',c:'#D9B97A',t:'#24362E',url:'',handle:'Canal por confirmar',what:'El podcast completo y los videos largos.'},
 facebook:{name:'Facebook',ab:'FB',c:'#3F5A4F',t:'#F4EFE6',url:'https://www.facebook.com/ProyectoSacha',handle:'Proyecto Sacha',what:'Comunidad, avisos de rescate y liberaciones.'}
};
var PODCAST=[{n:1,title:'Tema por definir',guest:'Invitado/a por confirmar',yt:''},{n:2,title:'Tema por definir',guest:'Invitado/a por confirmar',yt:''}];

var NAV=[['Guía de campo','guia'],['Videos','videos'],['Proceso','proceso'],['Sacha','sacha'],['Participa','participa']];
/* Sacha habla: cada dato lleva su ánimo y el color de su lámina (fondo, colina) */
var MEET=[
 {m:'alegre',bg:['#F4EFE6','#D9B97A'],t:'¡Hola! Soy <b>Sacha</b>, una cría de ocelote rescatada en 2018. Mi historia dio nombre a la fundación.'},
 {m:'curiosa',bg:['#3F5A4F','#CBEFD4'],t:'«Sacha» significa «selva» en kichwa. Pero la fundación está en la costa: Guayaquil y Santa Elena.'},
 {m:'guino',bg:['#CBEFD4','#F4EFE6'],t:'Cada caso se coordina con el Ministerio del Ambiente y la Unidad de Policía de Medio Ambiente.'},
 {m:'cuidadora',bg:['#F4EFE6','#D17A5B'],t:'Cada animal que llega recibe atención médica, trámites, traslado y meses de cuidado.'},
 {m:'orgullosa',bg:['#3F5A4F','#D9B97A'],t:'Desde 2018 se han rescatado, recuperado o reubicado más de 3.500 animales <span style="font-weight:400">(cifra de inicios de 2023)</span>.'},
 {m:'dormida',bg:['#AF7409','#D9B97A'],t:'Los ocelotes son nocturnos: de día descanso. Tú sigue bajando, lo mejor viene en las cápsulas.'}
];
var FACTS=[['Especie','Ocelote · Leopardus pardalis'],['Llegó en','Junio de 2018, desde Vinces'],['Su nombre','«Sacha»: selva, en kichwa'],['Vive en',null]];
var STORY=[
 'Sacha, una cría de ocelote de unos diez días de vida, llegó en junio de 2018 a manos de la Dra. Eliana Molineros. Estaba a la venta en una tienda de Vinces, en poder de traficantes de fauna silvestre.',
 'No pudo regresar a su hábitat, pero su historia dio origen a la Fundación Proyecto Sacha, que hoy rehabilita fauna del Guayas y la devuelve a su medio.'
];
var STORY_SRC=[['Vistazo','https://www.vistazo.com/estilo-de-vida/sostenibilidad/sacha-el-ocelote-que-no-pudo-regresar-a-su-habitat-pero-inspiro-un-enorme-proyecto-CE1336316'],['Primicias','https://www.primicias.ec/noticias/tecnologia/sacha-ocelote-espacio-cuidar-fauna-silvestre/']];
var SEDES=[
 {n:'01',kind:'Centro urbano',name:'Guayaquil',pin:'Guayaquil',desc:'Recepción médica y rescates urbanos.',pos:[74.17,42.62],dy:-32,q:'Guayaquil, Ecuador'},
 {n:'02',kind:'Centro rural',name:'Santa Elena',pin:'Centro rural',desc:'Rehabilitación y liberación. Ubicación referencial: sector Chanduy.',pos:[54.71,52.0],dy:34,q:'Chanduy, Santa Elena, Ecuador'}
];
var MREF=[{name:'Santa Elena',pos:[17.12,45.11]}];

/* cápsulas: 8 en 3 ejes */
var EJES=[{name:'Convivencia',pat:'selva'},{name:'Identidad',pat:'felino'},{name:'Operatividad',pat:'reptil'}];
var CAPS=[
 {tab:0,pre:'Mitos sobre la',title:'zarigüeya',dur:58,desc:'Lo que crees saber y por qué no es una amenaza.',m:'sacha-dato',net:'tiktok',ph:'zarigueya2'},
 {tab:0,pre:'Encontré una cría:',title:'¿qué hago?',dur:72,desc:'Primeros pasos antes de llamar al equipo.',m:'sacha-rescate',net:'instagram',ph:'aves2'},
 {tab:0,pre:'Convivir con fauna',title:'en la ciudad',dur:65,desc:'Hábitos simples para coexistir.',m:'sacha-saluda',net:'tiktok',ph:'ardilla'},
 {tab:1,pre:'Todo sobre',title:'quiénes somos',dur:90,desc:'El equipo y lo que nos mueve.',m:'sacha-saluda',net:'instagram',ph:'mono2'},
 {tab:1,pre:'Un día en',title:'Proyecto Sacha',dur:70,desc:'Turnos, protocolos y cuidado diario.',m:'sacha-dato',net:'tiktok',ph:'perezoso'},
 {tab:2,pre:'Rescate',title:'en campo',dur:100,desc:'Cómo se contiene a un animal sin dañarlo.',m:'sacha-rescate',net:'instagram',ph:'serpiente2'},
 {tab:2,pre:'Traslado a',title:'Santa Elena',dur:75,desc:'Logística y cuidados durante el viaje.',m:'sacha-saluda',net:'tiktok',ph:'pelicano'},
 {tab:2,pre:'Rehabilitación',title:'y liberación',dur:85,desc:'El día en que vuelve a su hábitat.',m:'sacha-donar',net:'instagram',ph:'manglar'}
];
var STEPS=[
 {pat:'felino',plate:'arena',mood:'cuidadora',title:'Recepción médica',icon:'i-med',who:'Equipo veterinario',text:'Evaluación clínica inmediata y estabilización. Reciben los mismos exámenes que un perro o un gato, porque necesitan los mismos cuidados.',cap:8,ph:'tamandua'},
 {pat:'manchas',plate:'menta',mood:'curiosa',title:'Gestión legal',icon:'i-doc',who:'Ministerio del Ambiente · Policía de Medio Ambiente',text:'Cada ingreso se informa a la autoridad ambiental y la liberación se coordina con ella.',cap:6,ph:'aves'},
 {pat:'selva',plate:'selva',mood:'explora',title:'Logística y traslado',icon:'i-truck',who:'Guayaquil → Santa Elena',text:'Vehículos, combustible y personal para llevar al animal al centro rural. Mientras espera, sigue necesitando cuidados.',cap:7,ph:'pelicano2'},
 {pat:'rayas',plate:'terra',mood:'orgullosa',title:'Rehabilitación y liberación',icon:'i-leaf',who:'Centro rural · Santa Elena',text:'Cuidado prolongado, a veces durante meses, hasta devolverlo a su hábitat.',cap:8,ph:'manglar2'}
];
var ALLIES=['Ministerio del Ambiente','Unidad de Policía de Medio Ambiente','Universidades, por convenio'];
var DO=['Mantén la distancia y no lo persigas: el estrés puede empeorar sus lesiones.','Aleja a perros, gatos y niños, y baja el ruido.','Toma una foto desde lejos y anota la ubicación exacta.','Avisa al equipo de rescate.'];
var DONT=['No lo alimentes: ni comida, ni agua, ni leche.','No lo traslades por tu cuenta sin la indicación del equipo.','No lo conviertas en mascota: la tenencia de fauna silvestre está regulada.','No lo agarres con las manos desnudas.'];
var FAQS=[
 ['¿Las zarigüeyas son peligrosas?','No. Son inofensivas y ayudan a controlar plagas; que transmitan la rabia es un mito. <button class="link" data-cap="0">Mira la cápsula 1</button>'],
 ['¿Qué hago si encuentro una cría sola?','Obsérvala desde lejos un buen rato: su madre puede estar cerca y no se acerca si hay personas. Si está en peligro inmediato, avisa. <button class="link" data-cap="1">Mira la cápsula 2</button>'],
 ['¿Qué pasa con el animal después del rescate?','Pasa por atención médica, trámites legales, traslado y un periodo de rehabilitación. Cuando está listo, vuelve a su hábitat.'],
 ['¿Puedo visitar los centros?','No. Por seguridad no recibimos visitas ni voluntarios externos: resguardamos animales que llegan de incautaciones y allanamientos. Trabajamos con universidades mediante convenios.']
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
 {id:'anfibio',ic:'i-leaf',c:'#3F5A4F',title:'Anfibio',eg:'rana, sapo',do:['Obsérvalo sin tocarlo: su piel es delicada y absorbe lo que toca.'],dont:['No lo agarres con las manos secas ni lo lleves a otro lugar.']},
 {id:'nose',ic:'i-info',c:'#AF7409',title:'No sé qué es',eg:'una foto desde lejos ayuda a identificarlo',do:['No hace falta saberlo: una foto desde lejos ayuda al equipo a identificarlo.'],dont:[]}
];
var AMTS=[10,25,50,100];
var BANK=[['Banco','Banco Internacional'],['Cuenta corriente','1400625249'],['A nombre de','Fundación Proyecto Sacha'],['RUC','0993242721001'],['Correo','donaciones@proyectosacha.org']];


