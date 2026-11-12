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
  if(e.target.closest('[data-open-tool]'))openTool();
  var cp=e.target.closest('[data-cap]');if(cp){openStory(+cp.getAttribute('data-cap'))}
});
var pad2=function(n){return String(n).padStart(2,'0')};




/* ======================  REPRODUCTOR (maqueta con tiempo simulado o video real)  ====================== */
var ICON_PLAY='<svg class="ic" viewBox="0 0 24 24"><use href="#i-play"/></svg>',ICON_PAUSE='<svg class="ic" viewBox="0 0 24 24"><use href="#i-pause"/></svg>';
var PLAYERS=[];
function Player(root,o){
  var P={item:null,on:false,t:0};
  function paint(){var i=$('.track i',root),tm=$('time',root),b=$('.pp',root);if(!i)return;root.classList.toggle('playing',P.on);i.style.width=(P.t/MOCK_SECONDS*100)+'%';tm.textContent=fmt(P.item.dur*P.t/MOCK_SECONDS)+' / '+fmt(P.item.dur);b.innerHTML=P.on?ICON_PAUSE:ICON_PLAY}
  function end(){
    P.on=false;paint();if(o.onEnd&&o.onEnd(P.item))return;
    var n=NETS[P.item.net],ec=$('.endcard',root);if(!ec)return;
    ec.innerHTML=sacha('orgullosa',{alt:''})+'<b>La historia continúa en '+n.name+'</b><p>'+esc(n.what)+'</p><div class="row">'+follow(P.item.net,'pri')+'<button class="btn line sm" data-again>Ver otra vez</button></div>';ec.hidden=false;
  }
  P.load=function(item,play){
    P.item=item;P.on=false;P.t=0;root.classList.remove('playing');
    if(item.srcs.length){
      root.innerHTML='<div class="stage"><video controls playsinline preload="metadata" poster="assets/video/hero-poster.jpg">'+srcTags(item.srcs)+'</video></div><div class="endcard" hidden></div>';
      var v=$('video',root);v.addEventListener('ended',end);if(play){var p=v.play();if(p&&p.catch)p.catch(function(){})}
    }else{
      root.innerHTML='<div class="stage">'+item.cover+'<span class="badge">Video pendiente · vista de maqueta</span><button class="bigplay" data-pp aria-label="Reproducir">'+ico('i-play')+'</button></div><div class="controls"><button class="pp" data-pp aria-label="Reproducir o pausar">'+ICON_PLAY+'</button><div class="track" data-seek><div><i></i></div></div><time>0:00 / '+fmt(item.dur)+'</time></div><div class="endcard" hidden></div>';
      if(play){P.on=true;paint()}
    }
  };
  P.tick=function(){if(!P.on||!P.item||P.item.srcs.length)return;P.t+=.1;if(P.t>=MOCK_SECONDS){P.t=MOCK_SECONDS;end()}else paint()};
  root.addEventListener('click',function(e){
    if(e.target.closest('[data-pp]')){$('.endcard',root).hidden=true;if(P.t>=MOCK_SECONDS)P.t=0;P.on=!P.on;paint();return}
    if(e.target.closest('[data-again]')){$('.endcard',root).hidden=true;P.t=0;P.on=true;paint();return}
    var s=e.target.closest('[data-seek]');if(s){var rc=s.getBoundingClientRect();P.t=Math.max(0,Math.min(.99,(e.clientX-rc.left)/rc.width))*MOCK_SECONDS;paint()}
  });
  PLAYERS.push(P);return P;
}
function srcTags(a){return a.map(function(u){return '<source src="'+esc(u)+'" type="video/'+(/\.webm$/.test(u)?'webm':'mp4')+'">'}).join('')}
setInterval(function(){PLAYERS.forEach(function(p){p.tick()})},100);




/* ======================  VIDEOS: CÁPSULAS VERTICALES Y VISOR  ====================== */
var C={tab:-1,seen:{}};
function capList(){return CAPS.map(function(c,i){return i}).filter(function(i){return C.tab<0||CAPS[i].tab===C.tab})}
function capCover(i){var c=CAPS[i],p=PH[c.ph];return '<div class="cv phc"><img src="'+p.src+'" alt="" loading="lazy" style="object-position:'+(p.vpos||p.pos||'50% 50%')+'"><span class="meta">Cápsula '+pad2(i+1)+' · '+EJES[c.tab].name+'</span><div class="tt"><small>'+esc(c.pre)+'</small><b>'+esc(c.title)+'</b></div></div>'}
var ST={open:false,list:[],i:0,t:0,paused:false,last:null};
function openStory(cap){ST.list=capList();if(ST.list.indexOf(cap)<0){ST.list=capList()}ST.i=ST.list.indexOf(cap);ST.t=0;ST.paused=false;ST.open=true;ST.last=document.activeElement;$('#story-v').hidden=false;document.body.classList.add('lock');renderStory();$('#stClose').focus()}
function closeStory(){ST.open=false;$('#story-v').hidden=true;document.body.classList.remove('lock');$('#stFrame').innerHTML='';if(ST.last&&ST.last.focus)ST.last.focus({preventScroll:true})}
function renderStory(){
  var i=ST.list[ST.i],c=CAPS[i],src=VIDEOS.caps[i];C.seen[i]=true;
  $('#stFrame').innerHTML='<div class="st-bars">'+ST.list.map(function(x,k){return '<i><b style="width:'+(k<ST.i?100:0)+'%"></b></i>'}).join('')+'</div><div class="st-head"><span class="av"><img src="assets/mascot/sacha-saluda.webp" alt=""></span><div><b>Proyecto Sacha</b><span>'+esc(EJES[c.tab].name)+' · cápsula '+(i+1)+'</span></div><div class="sp"><button id="stPause" aria-label="Pausar">'+ico('i-pause')+'</button></div></div>'+
   (src?'<video id="stVid" src="'+esc(src)+'" autoplay playsinline></video>':capCover(i)+'<div class="st-mock"><span class="badge">Video pendiente · vista de maqueta</span></div>')+
   '<button class="st-tap l" data-st="-1" aria-label="Anterior"></button><button class="st-tap r" data-st="1" aria-label="Siguiente"></button><div class="st-foot"><p>'+esc(c.desc)+'</p><div class="row">'+follow(c.net,'pri')+'<button class="btn line sm" id="stShare">'+ico('i-share')+'Compartir</button></div></div>';
  var v=$('#stVid');if(v){v.addEventListener('ended',function(){stStep(1)});v.addEventListener('timeupdate',function(){var b=$$('.st-bars b')[ST.i];if(b&&v.duration)b.style.width=(v.currentTime/v.duration*100)+'%'})}
}
function stStep(d){var n=ST.i+d;if(n<0)n=0;if(n>=ST.list.length){closeStory();return}ST.i=n;ST.t=0;renderStory()}
setInterval(function(){if(!ST.open||ST.paused||VIDEOS.caps[ST.list[ST.i]])return;ST.t+=.1;var b=$$('.st-bars b')[ST.i];if(b)b.style.width=Math.min(100,ST.t/MOCK_SECONDS*100)+'%';if(ST.t>=MOCK_SECONDS)stStep(1)},100);
document.addEventListener('click',function(e){
  if(!ST.open)return;var t=e.target.closest('[data-st]');if(t){stStep(+t.getAttribute('data-st'));return}
  if(e.target.closest('#stPrev')){stStep(-1);return}if(e.target.closest('#stNext')){stStep(1);return}
  if(e.target.closest('#stClose')||e.target===$('#story-v')){closeStory();return}
  if(e.target.closest('#stPause')){ST.paused=!ST.paused;var v=$('#stVid');if(v){if(ST.paused)v.pause();else v.play()}$('#stPause').innerHTML=ico(ST.paused?'i-play':'i-pause');return}
  if(e.target.closest('#stShare'))copy(location.href.split('#')[0],'Enlace copiado');
});
document.addEventListener('keydown',function(e){if(!ST.open)return;if(e.key==='Escape')closeStory();if(e.key==='ArrowRight')stStep(1);if(e.key==='ArrowLeft')stStep(-1);if(e.key===' '&&$('#stPause')){e.preventDefault();$('#stPause').click()}});



/* ======================  REPORTAR: GUÍA DE ACCIÓN (se abre bajo demanda)  ====================== */

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
function renderTool(focus){$('#tmain').innerHTML=stepper()+toolBody();var m=T.sent?['¡Gracias por avisar!','Ya hiciste lo más importante. Copia el reporte y compártelo con el equipo.']:SAY[T.step];$('#guide').innerHTML=sacha(T.sent?'gracias':['curiosa','curiosa','cuidadora','alerta'][T.step],{alt:''})+'<p><b>'+m[0]+'</b>'+m[1]+'</p>';if(focus){var q=$('#tq');if(q)q.focus({preventScroll:true});var r=$('#tmain').getBoundingClientRect();if(r.top<70||r.top>innerHeight*.5)window.scrollTo({top:r.top+scrollY-90,behavior:reduced?'auto':'smooth'})}}
document.addEventListener('click',function(e){var el;
  if((el=e.target.closest('[data-sit]'))){T.sit=+el.getAttribute('data-sit');T.chk={};T.sent=false;T.step=T.ani>=0?2:1;renderTool(true);return}
  if((el=e.target.closest('[data-ani]'))){T.ani=+el.getAttribute('data-ani');T.chk={};T.sent=false;T.step=2;renderTool(true);return}
  if((el=e.target.closest('[data-tstep]'))){var n=+el.getAttribute('data-tstep');if(n<=reach()){T.step=n;if(n===3){T.f.type=ANIS[T.ani].id;T.f.sit=SITS[T.sit].id}renderTool(true)}return}
  if((el=e.target.closest('[data-chk]'))){var k=el.getAttribute('data-chk');T.chk[k]=!T.chk[k];el.setAttribute('aria-checked',!!T.chk[k]);return}
  if(e.target.closest('[data-treset]')){resetTool();renderTool(true);return}
  if(e.target.closest('[data-copyguide]')){var s=SITS[T.sit],a=ANIS[T.ani];copy(['Qué hacer si encuentras un animal silvestre · '+s.title+' · '+a.title,'','HAZ ESTO'].concat(s.do.concat(a.do).map(function(x,i){return (i+1)+'. '+x}),['','NO HAGAS ESTO'],s.dont.concat(a.dont).map(function(x){return '- '+x}),['','Si hay riesgo para personas, llama al 911.']).join('\n'),'Guía copiada');return}
  if(e.target.closest('[data-copyrep]')){var f=T.f;copy(['REPORTE DE FAUNA SILVESTRE · Proyecto Sacha','Fecha: '+new Date().toLocaleString('es-EC'),'Situación: '+lookup(SITS,f.sit).title,'Animal: '+lookup(ANIS,f.type).title,'Ubicación: '+f.where.trim(),'Descripción: '+(f.desc.trim()||'—'),'Contacto: '+f.name.trim()+' · '+f.phone.trim()].join('\n'),'Reporte copiado');return}
});
document.addEventListener('input',function(e){var m={rWhere:'where',rDesc:'desc',rName:'name',rPhone:'phone'}[e.target.id];if(m)T.f[m]=e.target.value});
document.addEventListener('change',function(e){if(e.target.id==='rOk')T.f.ok=e.target.checked;if(e.target.id==='rPhoto'){var file=e.target.files&&e.target.files[0],pv=$('#photoPrev');if(T.f.photo&&T.f.photo.indexOf('blob:')===0)URL.revokeObjectURL(T.f.photo);if(file&&file.type.indexOf('image/')===0){T.f.photo=URL.createObjectURL(file);pv.src=T.f.photo;pv.classList.add('on')}else{T.f.photo='';pv.classList.remove('on');pv.removeAttribute('src');if(file){toast('Elige una imagen (JPG o PNG)');e.target.value=''}}}});
document.addEventListener('submit',function(e){if(e.target.id!=='repForm')return;e.preventDefault();var f=T.f,ok=f.where.trim()&&f.name.trim()&&validPhone(f.phone)&&f.ok;if(ok){T.sent=true;T.tried=false}else T.tried=true;renderTool(false);if(ok){var q=$('#tq');if(q)q.focus({preventScroll:true})}else{var b=$('#repForm .bad input')||$('#repForm .consent.bad input');if(b)b.focus()}});
var SD=0;
function renderMap(){
  var box=$('#mapbox');$$('.mpin,.mref',box).forEach(function(n){n.remove()});
  MREF.forEach(function(r){var d=document.createElement('div');d.className='mref';d.style.left=r.pos[0]+'%';d.style.top=r.pos[1]+'%';d.innerHTML='<i></i><span>'+r.name+'</span>';box.appendChild(d)});
  SEDES.forEach(function(d,i){var b=document.createElement('button');b.className='mpin';b.style.left=d.pos[0]+'%';b.style.top=d.pos[1]+'%';b.style.setProperty('--dy',d.dy+'px');b.setAttribute('aria-pressed',SD===i);b.setAttribute('data-sede',i);b.setAttribute('aria-label','Sede: '+d.pin);b.innerHTML='<i></i><span>'+d.pin+'</span>';box.appendChild(b)});
  $('#sedes').innerHTML=SEDES.map(function(d,i){return '<div class="sede'+(SD===i?' on':'')+'"><span class="k">Sede '+d.n+' · '+d.kind+'</span><h3><button data-sede="'+i+'">'+d.name+'</button></h3><span>'+d.desc+'</span><span class="meta"><span>Dirección y horario: por confirmar</span></span><a class="btn line sm" href="https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(d.q)+'" target="_blank" rel="noopener">Ver zona en Google Maps '+ico('i-ext')+'</a></div>'}).join('')+'<div class="callout">'+ico('i-info')+'<span>Por seguridad no recibimos visitas en los centros: resguardamos animales que llegan de incautaciones y allanamientos.</span></div>';
}
document.addEventListener('click',function(e){var b=e.target.closest('[data-sede]');if(b){SD=+b.getAttribute('data-sede');renderMap()}});


var FICHAS=[
 {id:'zarigueya',grupo:'Mamífero',v:'a',photo:'zarigueya',pat:'manchas',tab:'selva',pre:'Todo sobre las',name:'zarigüeyas',art:'una',single:'zarigüeya',state:'importante',mood:'guino',ani:'mamifero',cap:0,
  dato:'Marsupial nocturno que come insectos, frutas, carroña y pequeños animales. Ayuda a controlar plagas y a dispersar semillas.',src:['UTPL','https://noticias.utpl.edu.ec/printpdf/node/3592'],
  myth:['Es peligrosa y transmite la rabia.','Es inofensiva. Que transmita la rabia es un mito.'],
  do:['Déjale un camino libre hacia afuera: casi siempre se aleja sola de noche.','Aleja a perros, gatos y niños.','Si está herida o es una cría sola en peligro, avisa al equipo.'],dont:['No la mates: es inofensiva para las personas.','No la alimentes ni la lleves a casa.']},
 {id:'iguana',grupo:'Reptil',v:'d',photo:'iguana',pat:'reptil',tab:'terra',pre:'Todo sobre las',name:'iguanas',art:'una',single:'iguana',state:'importante',mood:'curiosa',ani:'reptil',cap:2,
  dato:'La iguana verde es herbívora. Se la ve en parques y orillas tomando sol: mirarla de lejos también es respetarla.',
  do:['Obsérvala desde lejos: tomar sol es normal.','Si está herida o en la vía, avisa con una foto y la ubicación.'],dont:['No la persigas ni la agarres: puede arañar y morder.','No la alimentes ni la lleves a casa.']},
 {id:'serpiente',grupo:'Reptil',v:'c',photo:'serpiente',pre:'',name:'¡Serpientes!',art:'una',single:'serpiente',state:'serpiente',mood:'alerta',ani:'reptil',cap:5,
  dato:'La boa no es venenosa: atrapa a sus presas por constricción, sobre todo roedores y aves. Pero a simple vista no puedes saber qué serpiente es.',
  do:['Mantente a distancia y no la pierdas de vista hasta que llegue el equipo.','Aleja a niños y mascotas.','Avisa de inmediato con una foto desde lejos.'],dont:['No intentes capturarla ni matarla: no puedes saber si es venenosa.','No te acerques a mirarla de cerca.']},
 {id:'cocodrilo',grupo:'Reptil',v:'d',photo:'cocodrilo',pat:'selva',tab:'selva',pre:'Todo sobre los',name:'cocodrilos',art:'un',single:'cocodrilo',state:'urgente',mood:'alerta',ani:'reptil',cap:5,
  dato:'El cocodrilo de la costa vive en manglares y estuarios del golfo de Guayaquil. Siempre estuvo aquí: la ciudad llegó después.',
  do:['Mantén distancia del agua y de la orilla.','Avisa de inmediato: es un animal peligroso. Si hay riesgo para personas, llama al 911.'],dont:['No te acerques ni intentes moverlo.','No lo cargues ni te tomes fotos con él.']},
 {id:'mono',grupo:'Mamífero',v:'d',photo:'mono',pat:'selva',tab:'selva',pre:'Todo sobre los',name:'monos aulladores',art:'un',single:'mono',state:'urgente',mood:'cuidadora',ani:'grande',cap:1,
  dato:'El mono aullador de la costa se oye mucho antes de verse. La fundación ha atendido ejemplares con desnutrición y lesiones.',src:['El Universo','https://www.eluniverso.com/guayaquil/comunidad/fauna-ocelote-bebe-mono-aullador-proyecto-sacha-guayaquil-guayas-dos-mangas-nota/'],
  do:['Aléjate sin darle la espalda ni correr, y mantén lejos a otras personas.','Avisa al equipo con una foto y la ubicación exacta.'],dont:['No intentes tocarlo ni acorralarlo: un animal asustado puede defenderse.','No le des comida.']},
 {id:'ocelote',grupo:'Felino',v:'b',photo:'ocelote',pre:'Todo sobre los',name:'ocelotes',art:'un',single:'ocelote',state:'importante',mood:'orgullosa',ani:'grande',cap:3,
  dato:'Felino manchado y nocturno. Sacha, el rostro de la fundación, es un ocelote. La mascotización y los perros sueltos lo ponen en riesgo.',src:['Vistazo','https://www.vistazo.com/estilo-de-vida/sostenibilidad/meg-la-bebe-ocelote-en-peligro-por-la-quema-de-plantaciones-y-mascotizacion-CK6972334'],
  do:['Aléjate sin darle la espalda ni correr.','Avisa de inmediato al equipo.'],dont:['No intentes tocarlo ni acorralarlo.','No lo conviertas en mascota: la tenencia de fauna silvestre está regulada.']},
 {id:'rana',grupo:'Anfibio',v:'a',photo:'rana',pre:'Todo sobre las',name:'ranas',art:'una',single:'rana',state:'dato',mood:'curiosa',ani:'anfibio',cap:2,
  dato:'Los anfibios tienen la piel delicada: absorben lo que tocan. Mirarlos sin manipularlos es lo mejor para ellos.',
  do:['Obsérvala sin tocarla.','Si está en un lugar peligroso, avisa al equipo.'],dont:['No la agarres con las manos secas ni la lleves a otro lugar.']},
 {id:'aves',grupo:'Ave',v:'c',photo:'aves',pat:'rayas',tab:'terra',pre:'Todo sobre las',name:'aves',art:'un',single:'ave',state:'importante',mood:'guino',ani:'ave',cap:2,
  dato:'Garrapateros, lechuzas de campanario y loros conviven con la ciudad. Muchos loros son víctimas del tráfico: comprar alimenta el negocio.',
  do:['Si tiene plumas y salta, sus padres suelen cuidarla desde cerca: observa de lejos.','Si no tiene plumas o está herida, avisa.'],dont:['No le des agua con jeringa ni pan: puede ahogarse.','No compres aves silvestres.']},
 {id:'perezoso',grupo:'Mamífero',v:'a',photo:'perezoso',pat:'selva',pre:'Todo sobre los',name:'perezosos',art:'un',single:'perezoso',state:'importante',mood:'cuidadora',ani:'grande',cap:7,
  dato:'Pasan casi toda su vida en los árboles y bajan muy poco. En el suelo se mueven con dificultad: por eso los cables, las vías y los perros son un peligro para ellos.',
  do:['Si está en el suelo o en la vía, mantén lejos a perros y personas.','Avisa al equipo con una foto y la ubicación exacta.'],dont:['No lo cargues ni lo subas a un árbol por tu cuenta: tiene garras fuertes.','No te tomes fotos con él ni lo alimentes.']},
 {id:'lechuza',grupo:'Ave',v:'d',photo:'lechuza',pat:'rayas',pre:'Todo sobre las',name:'lechuzas',art:'una',single:'lechuza',state:'dato',mood:'dormida',ani:'ave',cap:2,
  dato:'La lechuza de campanario caza de noche y se alimenta sobre todo de roedores: es una aliada contra las plagas. Suele anidar en techos y construcciones.',
  do:['Si está en el suelo y no vuela, cúbrela con una tela y avisa al equipo.','Mantén lejos a gatos y perros.'],dont:['No la persigas ni la asustes con luz o ruido.','No le des comida ni agua.']},
 {id:'caiman',grupo:'Reptil',v:'b',photo:'caiman',pre:'Todo sobre los',name:'caimanes',art:'un',single:'caimán',state:'urgente',mood:'alerta',ani:'reptil',cap:5,
  dato:'El caimán de anteojos vive en ríos, lagunas y pantanos. Es más pequeño que el cocodrilo, pero también puede morder: siempre a distancia.',
  do:['Aléjate del agua y de la orilla.','Avisa al equipo. Si hay riesgo para personas, llama al 911.'],dont:['No intentes atraparlo ni moverlo.','No lo tengas como mascota: es fauna silvestre protegida.']},
 {id:'sapo',grupo:'Anfibio',v:'c',photo:'sapo',pre:'Todo sobre los',name:'sapos',art:'un',single:'sapo',state:'dato',mood:'curiosa',ani:'anfibio',cap:2,
  dato:'El sapo de caña aparece en patios y jardines, sobre todo cuando llueve. Su piel tiene glándulas con toxinas: no lo toques y aleja a tus mascotas.',
  do:['Déjalo seguir su camino: suele irse solo.','Aleja a perros y gatos: pueden intoxicarse si lo muerden.'],dont:['No lo agarres con las manos.','No lo lastimes ni le eches sal o químicos.']}
];
var STATE={importante:{t:'¡Importante!',bg:'#D9B97A',fg:'#24362E'},urgente:{t:'¡Urgente!',bg:'#D17A5B',fg:'#1B1210'},serpiente:{t:'¡Serpiente!',bg:'#3F5A4F',fg:'#F4EFE6'},dato:{t:'Dato',bg:'#CBEFD4',fg:'#24362E'}};

/* ======================  FICHA: ¡Encontraste una…!  ====================== */
var FI=-1,fLast=null;
function fichaHTML(f,i){
  var st=STATE[f.state];
  var p=PH[f.photo],art='<img class="ph" src="'+p.src+'" alt="" style="object-position:'+(p.pos||'50% 50%')+'"><span class="credit">'+credit(p)+'</span>';
  return '<div class="fhead" style="--sb:'+st.bg+';--sf:'+st.fg+'">'+art+'<span class="stag">'+st.t+'</span><button class="fclose" id="fClose" aria-label="Cerrar la ficha">'+ico('i-close')+'</button>'+sacha(f.mood,{alt:''})+'<div class="ft"><small>Encontraste '+f.art+'…</small><h2 id="fTitle">'+(f.state==='serpiente'?'¡'+f.single+'!':f.single)+'</h2></div></div>'+
   '<div class="fbody"><p class="fdato">'+esc(f.dato)+(f.src?' <cite>Fuente: <a href="'+f.src[1]+'" target="_blank" rel="noopener">'+f.src[0]+'</a></cite>':'')+'</p>'+
   (f.myth?'<div class="fmyth"><div><span class="tag">Mito</span><q>'+esc(f.myth[0])+'</q></div><div><span class="tag">Realidad</span><p>'+esc(f.myth[1])+'</p></div></div>':'')+
   '<div class="fcols"><div class="rbox"><h4>Haz esto</h4><ul class="nox yes">'+f.do.map(function(x){return '<li>'+ico('i-check')+'<span>'+esc(x)+'</span></li>'}).join('')+'</ul></div><div class="rbox dont"><h4>No hagas esto</h4><ul class="nox">'+f.dont.map(function(x){return '<li>'+ico('i-x')+'<span>'+esc(x)+'</span></li>'}).join('')+'</ul></div></div>'+
   '<div class="safety">'+ico('i-alert')+'<p>Tu seguridad va primero. Si hay riesgo para personas, llama al <button data-copy-num="911" aria-label="Copiar 911">911</button>.</p></div>'+
   '<div class="fact"><button class="btn urg" data-fr="'+i+'">Reportar este caso'+ico('i-arrow')+'</button><button class="btn line" data-fcap="'+f.cap+'">'+ico('i-play')+'Ver cápsula '+(f.cap+1)+'</button></div>'+
   '<div class="fnav"><button data-fstep="-1">← Anterior</button><span>'+(i+1)+' / '+FICHAS.length+'</span><button data-fstep="1">Siguiente →</button></div></div>';
}
function openFicha(i,keep){
  FI=(i+FICHAS.length)%FICHAS.length;var f=$('#ficha');
  if(!keep)fLast=document.activeElement;
  f.innerHTML=fichaHTML(FICHAS[FI],FI);f.hidden=false;$('#fichaBg').hidden=false;document.body.classList.add('lock');
  f.scrollTop=0;var c=$('#fClose');if(c)c.focus({preventScroll:true});
}
function closeFicha(){FI=-1;$('#ficha').hidden=true;$('#fichaBg').hidden=true;document.body.classList.remove('lock');if(fLast&&fLast.focus)fLast.focus({preventScroll:true})}
document.addEventListener('click',function(e){
  var o=e.target.closest('[data-fi]');if(o){openFicha(+o.getAttribute('data-fi'));return}
  if(FI<0)return;
  if(e.target.closest('#fClose')||e.target===$('#fichaBg')){closeFicha();return}
  var st=e.target.closest('[data-fstep]');if(st){openFicha(FI+ +st.getAttribute('data-fstep'),true);return}
  var r=e.target.closest('[data-fr]');if(r){var f=FICHAS[+r.getAttribute('data-fr')],ai=ANIS.map(function(a){return a.id}).indexOf(f.ani);closeFicha();openTool(-1,ai);return}
  var cp=e.target.closest('[data-fcap]');if(cp){closeFicha();openStory(+cp.getAttribute('data-fcap'))}
});
document.addEventListener('keydown',function(e){if(FI<0)return;if(e.key==='Escape')closeFicha();if(e.key==='ArrowRight')openFicha(FI+1,true);if(e.key==='ArrowLeft')openFicha(FI-1,true);
  if(e.key==='Tab'){var els=$$('#ficha button, #ficha a[href]').filter(function(x){return x.offsetParent!==null});if(!els.length)return;var a=els[0],z=els[els.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});



/* ======================  CAJONES (guía de reporte y mapa)  ====================== */
var DR=null,drLast=null;
function openDr(id){var el=document.getElementById(id);if(!el)return;if(DR)closeDr();drLast=document.activeElement;DR=el;el.hidden=false;$('#fichaBg').hidden=false;document.body.classList.add('lock');el.scrollTop=0;var c=$('[data-drclose]',el);if(c)c.focus({preventScroll:true})}
function closeDr(){if(!DR)return;DR.hidden=true;DR=null;$('#fichaBg').hidden=true;document.body.classList.remove('lock');if(drLast&&drLast.focus)drLast.focus({preventScroll:true})}
document.addEventListener('click',function(e){if(DR&&(e.target===$('#fichaBg')||e.target.closest('[data-drclose]')))closeDr()});
document.addEventListener('keydown',function(e){if(DR&&e.key==='Escape')closeDr()});
function openTool(sit,ani){if(FI>=0)closeFicha();closeMenu();if(typeof sit==='number'){resetTool();T.sit=sit;T.ani=ani;T.step=sit<0?0:(ani<0?1:2)}renderTool(false);openDr('toolDr')}


/* ======================  PARTICIPA: DONACIÓN Y CONVENIOS  ====================== */
var HILL='<div class="hill"></div>';
var USES=[['i-med','Medicinas e insumos'],['i-truck','Traslados y logística'],['i-leaf','Alimentación'],['i-doc','Trámites legales']];
$('#uses').innerHTML=USES.map(function(u){return '<li>'+ico(u[0])+u[1]+'</li>'}).join('');
var G={a:-1,custom:'',f:1,bank:false,mode:'don'},CV={org:'',name:'',mail:'',msg:''},cTried=false,cOk=false;
function amount(){var c=parseFloat(G.custom);return G.a>=0?AMTS[G.a]:(c>0?c:0)}
function impactHTML(){var a=amount();if(a<=0)return 'Elige un monto para ver cuánta operación cubre tu aporte.';var perMin=YEAR_COST/525600,mins=a/perMin,t=mins<90?'unos '+Math.max(1,Math.round(mins))+' minutos':'unas '+(mins/60).toFixed(1).replace('.',',')+' horas',yr=a*12;return '<b>'+money(a)+'</b> cubren '+t+' de operación. '+(G.f?'En un año serían '+money(yr)+'. ':'')+'<span class="small">Equivalencia ilustrativa: $350.000 al año.</span>'}
/* Sacha acompaña el estado: triste sin aporte, alegre con monto, agradecida al donar; cómplice en convenios */
function paintDtop(){var el=$('#dtop');if(!el)return;var m,t;
  if(G.mode==='conv'){m=cOk?'gracias':'guino';t=cOk?'¡Gracias! Te escribiremos pronto.':'Es la única vía de voluntariado: por seguridad no recibimos voluntarios externos.'}
  else{m=G.bank?'gracias':(amount()>0?'alegre':'triste');t=G.bank?'¡Gracias! Cada aporte hace posible el próximo rescate.':(amount()>0?'¡Eso ayuda mucho!':'Hoy las donaciones no alcanzan.')}
  el.innerHTML=sacha(m,{eager:true})+'<div class="bubble">'+t+'</div>'}
function giveTabs(){return '<div class="seg2" role="tablist" aria-label="Cómo sumarte"><button role="tab" aria-selected="'+(G.mode==='don')+'" data-gm="don">Donar</button><button role="tab" aria-selected="'+(G.mode==='conv')+'" data-gm="conv">Universidades y organizaciones</button></div>'}
function renderGive(){
  var a=amount(),el=$('#give'),t=cTried,v=CV;
  if(G.mode==='conv'){
    if(cOk){el.innerHTML=HILL+giveTabs()+'<div class="thanks"><h3>Solicitud enviada</h3><p>Gracias, '+esc(v.name)+'. Te escribiremos a '+esc(v.mail)+' para conversar el convenio.</p><p class="proto-note">Maqueta: el formulario aún no está conectado a un correo.</p><div><button class="link" id="convBack">← Volver</button></div></div>'}
    else el.innerHTML=HILL+giveTabs()+'<div><span class="k">Voluntariado y convenios</span><h3>Suma a tu universidad u organización</h3></div><form id="convForm" novalidate style="display:grid;gap:10px"><div class="fields">'+
      fld('cOrg','Institución *','<input id="cOrg" autocomplete="organization" value="'+esc(v.org)+'">',t&&!v.org.trim(),'Escribe el nombre de la institución')+
      fld('cName','Tu nombre *','<input id="cName" autocomplete="name" value="'+esc(v.name)+'">',t&&!v.name.trim(),'Escribe tu nombre')+
      fld('cMail','Correo *','<input id="cMail" type="email" autocomplete="email" value="'+esc(v.mail)+'">',t&&!validMail(v.mail),'Correo no válido')+
      fld('cMsg','¿Qué les gustaría hacer juntos? (opcional)','<textarea id="cMsg" placeholder="Investigación, prácticas, campañas…">'+esc(v.msg)+'</textarea>',false,'')+
      '</div><button class="btn pri" type="submit" style="justify-self:start">Enviar solicitud</button></form>';
    paintDtop();return}
  if(G.bank){el.innerHTML=HILL+giveTabs()+'<div class="thanks"><span class="k">Último paso</span><h3>Aporte '+(G.f?'mensual':'único')+' de '+money(a)+'</h3><p>Para completarlo, haz una transferencia con estos datos. Pronto sumaremos pago con tarjeta.</p><dl class="bank">'+BANK.map(function(b,i){return '<div><dt>'+b[0]+'</dt><dd>'+b[1]+'</dd><button data-cb="'+i+'">Copiar</button></div>'}).join('')+'</dl><p class="proto-note">Maqueta: aquí irán el pago y el recibo.</p><div><button class="link" id="giveBack">← Volver</button></div></div>';paintDtop();return}
  el.innerHTML=HILL+giveTabs()+'<div><span class="k">Dona</span><h3>Elige tu aporte</h3></div><div class="seg" role="group" aria-label="Frecuencia"><button data-gf="0" aria-pressed="'+(G.f===0)+'">Una vez</button><button data-gf="1" aria-pressed="'+(G.f===1)+'">Cada mes</button></div><div class="bigamt" id="bigAmt">'+money(a)+'<small>'+(G.f?'/ mes':'una vez')+'</small></div><div class="amts" role="group" aria-label="Monto">'+AMTS.map(function(x,i){return '<button data-ga="'+i+'" aria-pressed="'+(G.a===i)+'">$'+x+'</button>'}).join('')+'<input id="customAmt" type="number" min="1" inputmode="decimal" placeholder="Otro $" aria-label="Otro monto" value="'+esc(G.custom)+'"></div><p class="impact" id="impact" aria-live="polite">'+impactHTML()+'</p><button class="btn pri" id="doGive" '+(a>0?'':'disabled')+'>Donar '+(a>0?money(a)+(G.f?' / mes':''):'')+'</button><p class="small">Montos de ejemplo. Transferencia por ahora; tarjeta y PayPal próximamente.</p>';
  paintDtop();
}
function syncGive(){var a=amount(),b=$('#doGive'),im=$('#impact'),big=$('#bigAmt');if(big){big.innerHTML=money(a)+'<small>'+(G.f?'/ mes':'una vez')+'</small>';big.classList.remove('bump');void big.offsetWidth;big.classList.add('bump')}if(im)im.innerHTML=impactHTML();if(b){b.disabled=!(a>0);b.textContent='Donar '+(a>0?money(a)+(G.f?' / mes':''):'')}paintDtop()}
document.addEventListener('click',function(e){
  var gm=e.target.closest('[data-gm]');if(gm){G.mode=gm.getAttribute('data-gm');renderGive();return}
  var f=e.target.closest('[data-gf]');if(f){G.f=+f.getAttribute('data-gf');renderGive();return}
  var m=e.target.closest('[data-ga]');if(m){G.a=+m.getAttribute('data-ga');G.custom='';renderGive();return}
  if(e.target.closest('#doGive')&&amount()>0){G.bank=true;renderGive();return}
  if(e.target.closest('#giveBack')){G.bank=false;renderGive();return}
  if(e.target.closest('#convBack')){cOk=false;CV={org:'',name:'',mail:'',msg:''};renderGive();return}
  var c=e.target.closest('[data-cb]');if(c){var b=BANK[+c.getAttribute('data-cb')];copy(b[1],b[0]+' copiado')}
});
document.addEventListener('input',function(e){
  if(e.target.id==='customAmt'){G.custom=e.target.value;G.a=-1;$$('.amts button').forEach(function(x){x.setAttribute('aria-pressed','false')});syncGive();return}
  var m={cOrg:'org',cName:'name',cMail:'mail',cMsg:'msg'}[e.target.id];if(m)CV[m]=e.target.value});
document.addEventListener('submit',function(e){if(e.target.id!=='convForm')return;e.preventDefault();var v=CV,ok=v.org.trim()&&v.name.trim()&&validMail(v.mail);if(ok){cOk=true;cTried=false}else cTried=true;renderGive();if(!ok){var b=$('#convForm .bad input');if(b)b.focus()}});


var CASES=[
 {ph:'iguana2',sp:'Iguanas marinas de Galápagos',k:'Tráfico de fauna',d:'Mayo 2026',t:'Tres iguanas marinas aparecieron en Guayaquil en una semana: la fundación alertó sobre una posible red de tráfico.',s:'Vistazo',u:'https://www.vistazo.com/actualidad/nacional/2026-05-16-por-que-aparecieron-tres-iguanas-marinas-galapagos-guayaquil-esta-semana-HN10958942'},
 {ph:'cocodrilo',sp:'Cocodrilo de la costa',k:'Denuncia',d:'2026',t:'Un hombre cargaba un cocodrilo al hombro en un suburbio. La fundación pidió rescatarlo e investigar el caso.',s:'El Comercio',u:'https://www.elcomercio.com/actualidad/guayaquil/denuncian-presunta-captura-de-cocodrilo-en-guayaquil-tras-viralizacion-de-video/'},
 {ph:'ocelote',sp:'Meg, bebé ocelote',k:'Rescate',t:'En peligro por la quema de plantaciones y la mascotización.',s:'Vistazo',u:'https://www.vistazo.com/estilo-de-vida/sostenibilidad/meg-la-bebe-ocelote-en-peligro-por-la-quema-de-plantaciones-y-mascotizacion-CK6972334'},
 {ph:'tamandua',sp:'Oso hormiguero',k:'Atención médica',t:'Herido por perros dentro de un recinto militar de Guayaquil.',s:'Expreso',u:'https://www.expreso.ec/guayaquil/policia-halla-oso-hormiguero-herido-por-perros-en-recinto-militar-de-guayaquil-279129.html'},
 {ph:'mono',sp:'Mono aullador',k:'Rehabilitación',t:'Encontrado junto a una cría de ocelote, con desnutrición y lesiones.',s:'El Universo',u:'https://www.eluniverso.com/guayaquil/comunidad/fauna-ocelote-bebe-mono-aullador-proyecto-sacha-guayaquil-guayas-dos-mangas-nota/'},
 {ph:'manglar2',sp:'Centro rural en Chanduy',k:'Proyecto',t:'Anunciado como el centro de rehabilitación de fauna silvestre más grande de la costa. Estado de la obra por confirmar.',s:'Vistazo',u:'https://www.vistazo.com/estilo-de-vida/sostenibilidad/proyecto-sacha-inaugurara-el-centro-de-rehabilitacion-y-rescate-de-fauna-silvestre-mas-grande-de-la-costa-ecuatoriana-YI4028032'}
];
function renderCredits(){var seen={};$('#credits').innerHTML=Object.keys(PH).filter(function(k){var u=PH[k].url;if(seen[u])return false;seen[u]=1;return true}).map(function(k){var p=PH[k];return '<li>'+esc(p.alt)+': <a href="'+p.url+'" target="_blank" rel="noopener">'+esc(p.by)+'</a> · '+p.lic+'</li>'}).join('')}


/* ======================  SITIO SACHA (propuesta final)  ======================
   Videos primero: portada con video de fondo, video institucional 16:9 con capítulos, cápsulas (reels) que se
   reproducen solas y podcast en video incrustado desde YouTube. Además: apadrinar, donar, reportar y sedes.
   CONTENIDO EDITABLE: rutas de video aquí abajo, capítulos en CH, episodio del podcast en POD (ID de YouTube),
   pacientes para apadrinar en PATS y planes en PLANS. */
VIDEOS.caps=[0,1,2,3,4,5,6,7].map(function(i){return 'assets/video/final/r'+i+'.mp4'});
NETS.youtube.url='https://www.youtube.com/@proyectosacha3474';NETS.youtube.handle='@proyectosacha3474';
/* si el navegador no reproduce H.264, el visor usa la versión WebM */
(function(){var t=document.createElement('video');if(t.canPlayType&&!t.canPlayType('video/mp4; codecs="avc1.42E01E"'))VIDEOS.caps=VIDEOS.caps.map(function(u){return u.replace('.mp4','.webm')})})();
var NVH=72;
function hdrH(){var n=$('#nv');return n?n.offsetHeight:NVH}
function closeMenu(){var m=$('#nvMenu');if(!m)return;m.hidden=true;$('#nvBurger').setAttribute('aria-expanded','false');document.documentElement.classList.remove('menu-open')}
function go(id){closeMenu();var el=document.getElementById(id);if(!el)return;var y=id==='inicio'?0:Math.max(0,el.getBoundingClientRect().top+scrollY-hdrH()+1);if(window.__lenis)window.__lenis.scrollTo(id==='inicio'?0:el,{offset:-hdrH()+1,duration:1.4,onComplete:function(){if(id!=='inicio'&&Math.abs(el.getBoundingClientRect().top-hdrH()+1)>4)window.__lenis.scrollTo(el,{offset:-hdrH()+1,duration:.5})}});else window.scrollTo({top:y,behavior:reduced?'auto':'smooth'})}
var UL='<svg class="ul" viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true"><path d="M4 15C70 8 170 5 296 10"/><path d="M60 20C130 14 200 14 262 17"/></svg>';

/* ---------- botones con texto que rueda y esquina recortada ---------- */
function obWrap(root){$$('.ob',root).forEach(function(b){if(b.querySelector('.ob-t'))return;var t=b.textContent.trim();b.innerHTML='<span class="ob-t"><span>'+esc(t)+'</span><span aria-hidden="true">'+esc(t)+'</span></span><i class="ob-n" aria-hidden="true"></i>'})}

/* ---------- cabecera ---------- */
$('#nvBurger').addEventListener('click',function(){var m=$('#nvMenu'),o=m.hidden;m.hidden=!o;this.setAttribute('aria-expanded',String(o));document.documentElement.classList.toggle('menu-open',o)});
var SPY=['nosotros','proceso','capsulas','podcast','casos','apadrina','donar','ayuda','sedes-s'],lastSpy='';
function onScroll(){
  var y=scrollY,hero=$('#inicio'),hb=hero?hero.offsetHeight:600;
  $('#nv').classList.toggle('is-solid',y>hb-hdrH()-20);
  var a='';SPY.forEach(function(id){var el=document.getElementById(id);if(el&&el.getBoundingClientRect().top<=hdrH()+140)a=id});
  if(a!==lastSpy){lastSpy=a;$$('#nvLinks a').forEach(function(l){l.setAttribute('aria-current',l.getAttribute('data-go')===a?'true':'false')})}
}
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);

/* ---------- videos que se reproducen solos al estar en pantalla ---------- */
function autoVid(v,opts){
  if(!v)return;opts=opts||{};
  if(reduced&&!opts.always){v.removeAttribute('autoplay');return}
  var play=function(){var p=v.play();if(p&&p.catch)p.catch(function(){})};
  if(!canIO){play();return}
  new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){if(!v.__userPaused)play()}else v.pause()})},{threshold:.15}).observe(v);
}
/* portada */
var hv=$('#heroVid');autoVid(hv);
$('#heroPP').addEventListener('click',function(){if(hv.paused){hv.__userPaused=false;hv.play();this.innerHTML=ico('i-pause');this.setAttribute('aria-label','Pausar el video de fondo')}else{hv.__userPaused=true;hv.pause();this.innerHTML=ico('i-play');this.setAttribute('aria-label','Reproducir el video de fondo')}});
if(reduced){$('#heroPP').innerHTML=ico('i-play');$('#heroPP').setAttribute('aria-label','Reproducir el video de fondo')}
autoVid($('.kh-mini video'));autoVid($('.pill video'));

/* ---------- intro: avatares de fauna ---------- */
$('#proofAv').innerHTML=['ocelote','zarigueya','iguana','lechuza'].map(function(k){var p=PH[k];return '<img src="'+p.src+'" alt="" loading="lazy" style="object-position:'+(p.pos||'50% 50%')+'">'}).join('')+'<button class="proof-more" data-go="capsulas" aria-label="Ver las cápsulas">'+ico('i-plus')+'</button>';
$('#faqAv').innerHTML=['tamandua','mono','caiman'].map(function(k){var p=PH[k];return '<img src="'+p.src+'" alt="" loading="lazy" style="object-position:'+(p.pos||'50% 50%')+'">'}).join('');

/* ---------- cifras ---------- */
var MET=[{v:3500,pre:'+',t:'Animales rescatados, recuperados o reubicados desde 2018',h:30},{v:1100,pre:'~',t:'Animales auxiliados solo en 2022',h:46},{v:350000,pre:'$',t:'Lo que cuesta operar un año',h:62}];
function nf(n){return Math.round(n).toLocaleString('es-EC')}
$('#metBars').innerHTML=MET.map(function(m,i){return '<div class="mb" style="--h:'+m.h+'%"><div class="mb-bar"><i></i></div><div class="mb-t"><b data-count="'+m.v+'" data-pre="'+m.pre+'">'+m.pre+nf(m.v)+'</b><span>'+esc(m.t)+'</span></div></div>'}).join('');
function marq(items,cls){var one=items.map(function(t){return '<span class="'+(cls||'')+'">'+t+'</span><svg class="ic mq-s" aria-hidden="true"><use href="#i-spark"/></svg>'}).join('');return '<div class="marq-t">'+one+one+'</div>'}
$('#marqLogos').innerHTML=marq(['Ministerio del Ambiente','Policía de Medio Ambiente','UTPL','El Universo','Expreso','Vistazo','El Comercio','Primicias']);

/* ---------- video institucional 16:9 con capítulos ---------- */
var CH=[
 {t:'Quiénes somos',at:'0:00',d:'Una fundación sin fines de lucro nacida en 2018 del rescate de Sacha, una cría de ocelote vendida en una tienda de Vinces.'},
 {t:'Qué hacemos',at:'0:15',d:'Atención médica, trámites, traslado y rehabilitación de fauna herida o víctima del tráfico, hasta devolverla a su hábitat.'},
 {t:'Con quién trabajamos',at:'0:30',d:'Con el Ministerio del Ambiente y la Unidad de Policía de Medio Ambiente. Con universidades, por convenio.'},
 {t:'Cómo puedes ayudar',at:'0:45',d:'Donando, apadrinando a un paciente, reportando un animal que encuentres y compartiendo las cápsulas.'}
];
var CI=0,iv=$('#instVid'),cine=$('#cine');
function renderCh(){$('#instList').innerHTML=CH.map(function(c,i){return '<button class="chap" role="listitem" data-ch="'+i+'"><span class="chap-h"><span class="chap-n">'+pad2(i+1)+'</span><span class="chap-at">'+c.at+'</span></span><b>'+esc(c.t)+'</b><span class="chap-d">'+esc(c.d)+'</span><i class="chap-p"><em></em></i></button>'}).join('');syncCh(0)}
function syncCh(local){$$('.chap').forEach(function(el,i){el.classList.toggle('is-on',i===CI);el.setAttribute('aria-current',String(i===CI));var em=$('em',el);if(em)em.style.width=(i<CI?100:(i===CI?Math.max(0,Math.min(100,local*100)):0))+'%'});$('#instCh').textContent=CI+1;$('#instChT').textContent=CH[CI].t}
function instPlay(){var p=iv.play();if(p&&p.catch)p.catch(function(){})}
function setCh(i){CI=i;syncCh(0);var go2=function(){iv.__seeking=true;iv.currentTime=iv.duration*i/CH.length+.05;setTimeout(function(){iv.__seeking=false},300)};if(iv.duration)go2();else{iv.preload='auto';iv.addEventListener('loadedmetadata',go2,{once:true});iv.load()}iv.__userPaused=false;instPlay()}
function paintCine(){cine.classList.toggle('is-playing',!iv.paused);cine.classList.toggle('is-sound',!iv.muted);$('#cinePP').innerHTML=ico(iv.paused?'i-play':'i-pause');$('#cinePP').setAttribute('aria-label',iv.paused?'Reproducir':'Pausar');$('#instSnd').innerHTML=ico(iv.muted?'i-mute':'i-vol');$('#instSnd').setAttribute('aria-label',iv.muted?'Activar sonido':'Silenciar')}
renderCh();
$('#instList').addEventListener('click',function(e){var b=e.target.closest('[data-ch]');if(b)setCh(+b.getAttribute('data-ch'))});
autoVid(iv);
iv.addEventListener('timeupdate',function(){if(!iv.duration)return;var r=iv.currentTime/iv.duration,x=r*CH.length,c=Math.min(CH.length-1,Math.floor(x));$('#instBar').style.width=(r*100)+'%';$('#cineTrack').setAttribute('aria-valuenow',Math.round(r*100));$('#cineTime').textContent=fmt(iv.currentTime)+' / '+fmt(iv.duration);if(!iv.__seeking){CI=c;syncCh(x-c)}});
['play','pause','volumechange'].forEach(function(ev){iv.addEventListener(ev,paintCine)});
$('#cinePP').addEventListener('click',function(){if(iv.paused){iv.__userPaused=false;instPlay()}else{iv.__userPaused=true;iv.pause()}});
$('#instSnd').addEventListener('click',function(){iv.muted=!iv.muted;if(!iv.muted&&iv.paused){iv.__userPaused=false;instPlay()}});
$('#cineTrack').addEventListener('click',function(e){if(!iv.duration)return;var rc=this.getBoundingClientRect();iv.currentTime=Math.max(0,Math.min(.999,(e.clientX-rc.left)/rc.width))*iv.duration});
$('#cineTrack').addEventListener('keydown',function(e){if(!iv.duration)return;if(e.key==='ArrowRight')iv.currentTime=Math.min(iv.duration-.1,iv.currentTime+2);if(e.key==='ArrowLeft')iv.currentTime=Math.max(0,iv.currentTime-2)});
$('#cineFs').addEventListener('click',function(){var el=cine,fn=el.requestFullscreen||el.webkitRequestFullscreen;if(document.fullscreenElement){document.exitFullscreen();return}if(fn){try{var p=fn.call(el);if(p&&p.catch)p.catch(function(){toast('Pantalla completa no disponible aquí')})}catch(err){toast('Pantalla completa no disponible aquí')}}else toast('Pantalla completa no disponible aquí')});
/* «Ver con sonido»: lleva al video, lo reinicia y activa el audio */
document.addEventListener('click',function(e){var b=e.target.closest('[data-play-inst]');if(!b)return;e.preventDefault();iv.muted=false;iv.__userPaused=false;try{iv.currentTime=0}catch(err){}instPlay();paintCine();if(!b.closest('#cine'))go('cineStage')});
paintCine();

/* ---------- cápsulas: carrusel con la tarjeta central nítida y las laterales giradas y desenfocadas ---------- */
var R={i:0,list:[],timer:0,inView:false};
function capFilter(){C.tab=C.tab===undefined?-1:C.tab;R.list=capList()}
function renderChips(){$('#capChips').innerHTML=[{n:'Todas',k:-1}].concat(EJES.map(function(e,i){return {n:e.name,k:i}})).map(function(x){return '<button role="tab" aria-selected="'+(C.tab===x.k)+'" data-capt="'+x.k+'">'+esc(x.n)+'</button>'}).join('')}
function renderReels(){
  capFilter();
  $('#reelsT').innerHTML=R.list.map(function(ci,k){var c=CAPS[ci],n=NETS[c.net];return '<button class="reel" data-cursor="Ver" data-rk="'+k+'" aria-label="Ver la cápsula '+(ci+1)+': '+esc(c.pre+' '+c.title)+'">'+
    '<video muted loop playsinline preload="none" poster="assets/video/final/r'+ci+'.jpg"><source src="'+VIDEOS.caps[ci]+'" type="video/mp4"><source src="'+VIDEOS.caps[ci].replace('.mp4','.webm')+'" type="video/webm"></video>'+
    '<span class="reel-bars"><i><b></b></i></span><span class="reel-top"><span class="reel-n">'+pad2(ci+1)+'</span><span class="reel-net">'+esc(n.name)+'</span></span>'+
    '<span class="reel-b"><small>'+esc(EJES[c.tab].name)+' · '+fmt(c.dur)+'</small><b>'+esc(c.pre)+' '+esc(c.title)+'</b><em>'+ico('i-play')+'Ver cápsula</em></span></button>'}).join('');
  $('#reelDots').innerHTML=R.list.map(function(x,k){return '<i></i>'}).join('');
  R.i=Math.min(R.i,R.list.length-1);if(R.i<0)R.i=0;layoutReels(true);
}
function layoutReels(instant){
  var cards=$$('.reel'),W=innerWidth,cw=cards[0]?cards[0].offsetWidth:280,gap=Math.min(36,W*.03);
  cards.forEach(function(el,k){
    var n=cards.length,d=k-R.i;if(d>n/2)d-=n;if(d<-n/2)d+=n;var ad=Math.abs(d),x=d*(cw*.82+gap),rot=Math.max(-1,Math.min(1,d))*-(ad?22:0),sc=ad?Math.max(.74,.9-.06*(ad-1)):1,bl=ad?Math.min(6,1+ad*1.6):0,op=ad>3?0:(ad?1-.2*ad:1);
    if(W<700){x=d*(cw+14);rot=0;sc=ad?.92:1;bl=ad?2:0;op=ad>1?0:1}
    var st={x:x,rotationY:rot,scale:sc,filter:'blur('+bl+'px)',opacity:op,zIndex:20-ad};
    if(window.gsap&&!reduced&&!instant)gsap.to(el,Object.assign({duration:.8,ease:'power3.out',overwrite:true},st));
    else if(window.gsap)gsap.set(el,st);
    else{el.style.transform='translateX('+x+'px) rotateY('+rot+'deg) scale('+sc+')';el.style.filter='blur('+bl+'px)';el.style.opacity=op;el.style.zIndex=20-ad}
    el.classList.toggle('is-on',d===0);el.setAttribute('tabindex',ad<=1?'0':'-1');el.setAttribute('aria-hidden',ad>2?'true':'false');
    var v=$('video',el);if(d===0&&R.inView&&!reduced){v.currentTime=0;var p=v.play();if(p&&p.catch)p.catch(function(){})}else{v.pause()}
  });
  $$('#reelDots i').forEach(function(d,k){d.classList.toggle('on',k===R.i)});
}
function reelGo(d){if(!R.list.length)return;R.i=(R.i+d+R.list.length)%R.list.length;layoutReels()}
$('#reelPrev').addEventListener('click',function(){reelGo(-1);reelAuto()});$('#reelNext').addEventListener('click',function(){reelGo(1);reelAuto()});
$('#reelsT').addEventListener('click',function(e){var b=e.target.closest('[data-rk]');if(!b)return;var k=+b.getAttribute('data-rk');if(k!==R.i){R.i=k;layoutReels();reelAuto()}else openStory(R.list[k])});
$('#capChips').addEventListener('click',function(e){var b=e.target.closest('[data-capt]');if(!b)return;C.tab=+b.getAttribute('data-capt');R.i=0;renderChips();renderReels();reelAuto()});
/* avance automático sincronizado con la barra de progreso del reel activo */
function reelAuto(){clearInterval(R.timer);if(reduced)return;var t0=Date.now(),D=6000;R.timer=setInterval(function(){if(!R.inView||ST.open||document.hidden){t0=Date.now()-(+(R.prog||0))*D;return}var r=(Date.now()-t0)/D;R.prog=r;var b=$('.reel.is-on .reel-bars b');if(b)b.style.width=Math.min(100,r*100)+'%';if(r>=1){t0=Date.now();R.prog=0;reelGo(1)}},60)}
(function(){var sx=0,dx=0,on=false,el=$('#krl');el.addEventListener('pointerdown',function(e){on=true;sx=e.clientX;dx=0});addEventListener('pointerup',function(){if(!on)return;on=false;if(Math.abs(dx)>50){reelGo(dx<0?1:-1);reelAuto()}});addEventListener('pointermove',function(e){if(on)dx=e.clientX-sx},{passive:true});el.addEventListener('click',function(e){if(Math.abs(dx)>8){e.stopPropagation();e.preventDefault()}},true)})();
if(canIO)new IntersectionObserver(function(es){es.forEach(function(e){R.inView=e.isIntersecting;layoutReels(true)})},{threshold:.3}).observe($('#krl'));else R.inView=true;
document.addEventListener('keydown',function(e){if(e.target.closest&&e.target.closest('#krl')){if(e.key==='ArrowRight'){reelGo(1);reelAuto()}if(e.key==='ArrowLeft'){reelGo(-1);reelAuto()}}});
var rz=0;addEventListener('resize',function(){clearTimeout(rz);rz=setTimeout(function(){layoutReels(true);layoutCases(true)},120)});

/* ---------- cómo trabajamos: tarjetas apiladas con una ficha que se anima ---------- */
var PANELS=[
 function(){return '<div class="pc-h"><span>Ficha de ingreso</span><em class="live">En observación</em></div><b class="pc-big">Paciente <span data-count="412" data-pre="#">#412</span></b><small>Zarigüeya · ingreso por atropello</small><div class="pc-rows"><p><span>Hidratación</span><i style="--w:72%"></i></p><p><span>Peso</span><i style="--w:58%"></i></p><p><span>Movilidad</span><i style="--w:40%"></i></p></div>'},
 function(){return '<div class="pc-h"><span>Acta de ingreso</span><em>Autoridad ambiental</em></div><b class="pc-big">3 de 4 trámites</b><small>Coordinado con el Ministerio del Ambiente</small><ul class="pc-chk"><li class="ok">'+ico('i-check')+'Informe de ingreso</li><li class="ok">'+ico('i-check')+'Registro de la especie</li><li class="ok">'+ico('i-check')+'Valoración veterinaria</li><li>'+ico('i-cal')+'Autorización de liberación</li></ul>'},
 function(){return '<div class="pc-h"><span>Traslado</span><em class="live">En camino</em></div><b class="pc-big">Guayaquil → Santa Elena</b><small>Vehículo, combustible y personal</small><div class="pc-route"><svg viewBox="0 0 300 70" aria-hidden="true"><path class="rt" d="M14 50C70 10 120 62 170 34S258 14 286 26"/><circle class="rt-a" cx="14" cy="50" r="5"/><circle class="rt-b" cx="286" cy="26" r="5"/><circle class="rt-dot" r="6"/></svg><div><span>Centro urbano</span><span>Centro rural</span></div></div>'},
 function(){return '<div class="pc-h"><span>Plan de liberación</span><em>Semana 9 de 12</em></div><b class="pc-big"><span data-count="68">68</span>%</b><small>Rehabilitación en el centro rural</small><div class="pc-prog"><i style="--w:68%"></i></div><div class="pc-tags"><span>Alimentación propia</span><span>Vuelo / trepa</span><span>Miedo a personas</span></div>'}
];
function renderStack(){
  $('#stack').innerHTML=STEPS.map(function(s,i){var p=PH[s.ph];return '<div class="sk" style="--i:'+i+'"><article class="sk-card">'+
    '<div class="sk-l"><span class="sk-n">'+pad2(i+1)+'</span><h3><span class="acc">'+esc(s.title)+UL+'</span></h3><p>'+esc(s.text)+'</p><small>'+esc(s.who)+'</small><a class="ob ob-mist" href="#" data-cap="'+(s.cap-1)+'">Ver la cápsula</a></div>'+
    '<div class="sk-r"><img src="'+p.src+'" alt="" loading="lazy" style="object-position:'+(p.pos||'50% 50%')+'"><div class="sk-dots" aria-hidden="true"></div><div class="pc">'+PANELS[i]()+'</div><span class="credit">Foto de referencia</span></div>'+
    '</article></div>'}).join('');
}
renderStack();

/* ---------- podcast en video: un episodio incrustado desde YouTube ----------
   Para publicar el episodio real basta con cambiar POD.yt por el ID del video (lo que va después de «v=»). */
var POD={n:1,title:'Así llega un animal al centro',d:'Qué pasa en las primeras horas después de un rescate: evaluación clínica, estabilización y el camino que sigue hasta volver a su hábitat.',tags:['Episodio piloto','Video en YouTube'],yt:'Md1QB3DbdmA',ph:'tamandua',
 ex:'Video de ejemplo: «Proyecto Sacha. Centro de Conservación de Vida Silvestre de Guayaquil», de Movimiento Animalista EC.'};
function renderPod(){
  var e=POD,p=PH[e.ph],url='https://www.youtube.com/watch?v='+e.yt,bars='';for(var i=0;i<34;i++)bars+='<i style="--d:'+(-(i*37%100)/50).toFixed(2)+'s;--h:'+(28+(i*53%72))+'%"></i>';
  $('#kpod').innerHTML='<div class="kpod-v" id="podV"><img src="'+p.src+'" alt="" loading="lazy" style="object-position:'+(p.pos||'50% 50%')+'"><div class="kpod-v-ov"></div><span class="kpod-yt">'+ico('i-yt')+'YouTube</span><div class="kpod-eq" aria-hidden="true">'+bars+'</div><button class="kpod-play" data-podplay aria-label="Reproducir el episodio '+e.n+'">'+ico('i-play')+'</button><span class="kpod-v-t"><small>Episodio '+pad2(e.n)+' · Podcast de Proyecto Sacha</small><b>'+esc(e.title)+'</b></span></div>'+
   '<div class="kpod-c"><span class="kpod-num" aria-hidden="true">'+pad2(e.n)+'</span><p class="kpod-k">Episodio '+pad2(e.n)+' · Nuevo</p><h3>'+esc(e.title)+'</h3><p>'+esc(e.d)+'</p><div class="kpod-tags">'+e.tags.map(function(g){return '<span>'+esc(g)+'</span>'}).join('')+'</div><div class="kpod-act"><a class="ob ob-ink" href="'+url+'" target="_blank" rel="noopener">Ver en YouTube</a><a class="ob ob-mist" href="#" data-follow="youtube">Suscribirse al canal</a></div><div class="kpod-next"><i aria-hidden="true"></i><div><b>Próximo episodio, en producción</b><small>Suscríbete al canal para verlo primero.</small></div></div><small class="kpod-ex">'+esc(e.ex)+'</small></div>';
  obWrap($('#kpod'));
}
function podFallback(){var v=$('#podV'),f=$('iframe',v);if(f)f.remove();if(!$('.kpod-msg',v)){v.insertAdjacentHTML('beforeend','<div class="kpod-msg"><b>El episodio se reproduce aquí</b><p>Esta vista previa no permite videos incrustados. En el sitio publicado, el video de YouTube se ve en este mismo recuadro.</p><a class="ob ob-sand" href="https://www.youtube.com/watch?v='+POD.yt+'" target="_blank" rel="noopener">Abrir en YouTube</a></div>');obWrap(v)}}
document.addEventListener('click',function(e){if(!e.target.closest('[data-podplay]'))return;var v=$('#podV');if($('iframe',v))return;
  if(!/^https?:$/.test(location.protocol)){podFallback();return}
  v.insertAdjacentHTML('beforeend','<iframe src="https://www.youtube-nocookie.com/embed/'+POD.yt+'?autoplay=1&rel=0" title="'+esc(POD.title)+'" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>');v.classList.add('is-live')});
document.addEventListener('securitypolicyviolation',function(e){if(/youtube/.test(e.blockedURI||''))podFallback()});

/* ---------- casos: carrusel con laterales desenfocados ---------- */
var K=0;
function renderCases(){$('#casesT').innerHTML=CASES.map(function(c,i){var p=PH[c.ph];return '<a class="case" data-cursor="Leer" data-ck="'+i+'" href="'+c.u+'" target="_blank" rel="noopener"><div class="case-l"><span class="case-k">'+pad2(i+1)+' · '+esc(c.k)+(c.d?' · '+esc(c.d):'')+'</span><b>'+esc(c.t)+'</b><span class="case-s">'+esc(c.sp)+'</span><span class="ob ob-mist">Leer en '+esc(c.s)+'</span></div><figure class="case-r"><img src="'+p.src+'" alt="" loading="lazy" style="object-position:'+(p.pos||'50% 50%')+'"><figcaption class="case-note"><small>'+esc(c.s)+'</small><b>'+esc(c.sp)+'</b></figcaption><span class="credit">Foto de referencia</span></figure></a>'}).join('');obWrap($('#casesT'));layoutCases(true)}
function layoutCases(instant){var cards=$$('.case'),cw=cards[0]?cards[0].offsetWidth:600,gap=24;cards.forEach(function(el,i){var n=cards.length,d=i-K;if(d>n/2)d-=n;if(d<-n/2)d+=n;var ad=Math.abs(d),st={x:d*(cw+gap),filter:'blur('+(ad?6:0)+'px)',opacity:ad>1?0:(ad?.55:1),scale:ad?.94:1};
  if(window.gsap&&!instant&&!reduced)gsap.to(el,Object.assign({duration:.7,ease:'power3.out',overwrite:true},st));else if(window.gsap)gsap.set(el,st);else{el.style.transform='translateX('+st.x+'px) scale('+st.scale+')';el.style.filter=st.filter;el.style.opacity=st.opacity}
  el.setAttribute('tabindex',d===0?'0':'-1');el.setAttribute('aria-hidden',d===0?'false':'true');el.classList.toggle('is-on',d===0)})}
function caseGo(d){K=(K+d+CASES.length)%CASES.length;layoutCases()}
$('#casePrev').addEventListener('click',function(){caseGo(-1)});$('#caseNext').addEventListener('click',function(){caseGo(1)});
$('#casesT').addEventListener('click',function(e){var a=e.target.closest('[data-ck]');if(a&&+a.getAttribute('data-ck')!==K){e.preventDefault();K=+a.getAttribute('data-ck');layoutCases()}});

/* ---------- preguntas frecuentes y fichas ---------- */
var FQ=[
 ['¿Qué hago si encuentro un animal herido?','Mantén la distancia, aleja a perros, gatos y niños, toma una foto desde lejos y avisa al equipo. No le des comida, agua ni leche, y no lo traslades por tu cuenta. <button class="lnk" data-open-tool>Abrir la guía de reporte</button>'],
 ['¿Las zarigüeyas son peligrosas?','No. Son inofensivas y ayudan a controlar plagas; que transmitan la rabia es un mito. <button class="lnk" data-cap="0">Mira la cápsula</button>'],
 ['¿Qué hago si encuentro una cría sola?','Obsérvala desde lejos un buen rato: su madre puede estar cerca y no se acerca si hay personas. Si está en peligro inmediato, avisa. <button class="lnk" data-cap="1">Mira la cápsula</button>'],
 ['¿Qué pasa con el animal después del rescate?','Pasa por atención médica, trámites legales, traslado y un periodo de rehabilitación. Cuando está listo, vuelve a su hábitat, siempre en coordinación con la autoridad ambiental.'],
 ['¿Puedo visitar los centros o ser voluntario?','No. Por seguridad no recibimos visitas ni voluntarios externos: resguardamos animales que llegan de incautaciones y allanamientos. Trabajamos con universidades mediante convenios. <button class="lnk" data-go="donar" data-gmode="conv">Proponer un convenio</button>'],
 ['¿Puedo tener un animal silvestre como mascota?','No. La tenencia de fauna silvestre está regulada por ley y comprarla alimenta el tráfico. Si sabes de un caso, puedes reportarlo de forma segura. <button class="lnk" data-open-tool>Reportar</button>']
];
var FQI=0;
function renderFaq(){$('#faqList').innerHTML=FQ.map(function(q,i){var on=i===FQI;return '<div class="fq'+(on?' is-open':'')+'"><button class="fq-h" data-fq="'+i+'" aria-expanded="'+on+'"><span>'+esc(q[0])+'</span><i>'+ico(on?'i-minus':'i-plus')+'</i></button><div class="fq-b"><p>'+q[1]+'</p></div></div>'}).join('')}
renderFaq();
$('#faqList').addEventListener('click',function(e){var b=e.target.closest('[data-fq]');if(!b)return;var i=+b.getAttribute('data-fq');FQI=FQI===i?-1:i;renderFaq();var o=$('.fq.is-open .fq-b');if(o&&window.gsap&&!reduced)gsap.fromTo(o,{height:0,autoAlpha:0},{height:'auto',autoAlpha:1,duration:.5,ease:'power3.out'})});
$('#fzList').innerHTML=FICHAS.map(function(f,i){var p=PH[f.photo],nm=f.single.charAt(0).toUpperCase()+f.single.slice(1);return '<button class="fzc" data-fi="'+i+'"><img src="'+p.src+'" alt="" loading="lazy" style="object-position:'+(p.pos||'50% 50%')+'"><span>'+esc(nm)+'</span></button>'}).join('');
document.addEventListener('click',function(e){var gm=e.target.closest('[data-gmode]');if(gm){G.mode=gm.getAttribute('data-gmode');renderGive()}var s=e.target.closest('[data-share]');if(s){e.preventDefault();copy(location.href.split('#')[0],'Enlace copiado')}
  var a=e.target.closest('a[href="#"]');if(a&&!a.hasAttribute('data-follow'))e.preventDefault();var f=e.target.closest('a[href^="#"][data-go]');if(f)e.preventDefault()});

/* ---------- apadrinar ---------- */
var PATS=[
 {n:'Meg',sp:'Ocelote',sci:'Leopardus pardalis',img:PH.ocelote.src,pos:PH.ocelote.pos,st:'Rehabilitación',pct:68,since:'5 meses en el centro',story:'Llegó como cría, en riesgo por la quema de plantaciones y la mascotización. Hoy aprende a cazar sola.'},
 {n:'Bruma',sp:'Perezosa de tres dedos',sci:'Bradypus variegatus',img:'assets/video/final/p-perezosa.jpg',st:'Atención médica',pct:35,since:'3 semanas en el centro',story:'Encontrada junto a una vía con una fractura. Está en reposo, con controles cada semana.'},
 {n:'Kuri',sp:'Oso hormiguero',sci:'Tamandua mexicana',img:PH.tamandua.src,pos:'50% 70%',st:'Rehabilitación',pct:54,since:'2 meses en el centro',story:'Herido por perros en la ciudad. Ya se alimenta por su cuenta y recupera fuerza para trepar.'},
 {n:'Nina',sp:'Búho',sci:'Ave rapaz nocturna',img:'assets/video/final/p-buho.jpg',st:'Preliberación',pct:90,since:'4 meses en el centro',story:'Cayó del nido siendo polluela. Ya vuela y caza en el recinto de vuelo: falta poco para liberarla.'}
];
var PLANS=[{a:10,t:'Alimentación',d:'Su dieta de un mes.'},{a:25,t:'Atención médica',d:'Medicinas, exámenes y controles.'},{a:50,t:'Rehabilitación completa',d:'Alimentación, medicinas y cuidado diario.'}];
var AP={i:0,plan:1,name:'',mail:'',tried:false,ok:false};
function renderPat(){$('#pat').innerHTML=PATS.map(function(p,i){return '<article class="pt"><button class="pt-f" data-ap="'+i+'" tabindex="-1" aria-hidden="true"><img src="'+p.img+'" alt="" loading="lazy" style="object-position:'+(p.pos||'50% 30%')+'"><span class="pt-st">'+esc(p.st)+'</span><span class="pt-go">'+ico('i-heart')+'</span></button><div class="pt-b"><small>'+esc(p.sp)+' · <em>'+esc(p.sci)+'</em></small><h3>'+esc(p.n)+'</h3><p>'+esc(p.story)+'</p><div class="pt-prog"><span>Recuperación</span><b data-count="'+p.pct+'" data-suf="%">'+p.pct+'%</b><i style="--w:'+p.pct+'%"></i></div><button class="ob ob-mist" data-ap="'+i+'">Apadrinar a '+esc(p.n)+'</button></div></article>'}).join('');obWrap($('#pat'))}
function renderAp(){
  var p=PATS[AP.i],pl=PLANS[AP.plan],el=$('#ap');$('#apDrT').textContent='Apadrina a '+p.n;
  if(AP.ok){el.innerHTML='<div class="ap-ok"><span class="ap-ok-i">'+ico('i-check')+'</span><h3>Gracias, '+esc(AP.name.split(' ')[0])+'.</h3><p>Ya acompañas la recuperación de <b>'+esc(p.n)+'</b> con $'+pl.a+' al mes. Te escribiremos a '+esc(AP.mail)+' con su certificado y las primeras noticias.</p><p class="ap-note">Maqueta: todavía no se cobra ni se envía ningún correo.</p><button class="ob ob-ink" data-drclose>Volver al sitio</button></div>';obWrap(el);return}
  el.innerHTML='<div class="ap-h"><img src="'+p.img+'" alt="" style="object-position:'+(p.pos||'50% 30%')+'"><div><small>'+esc(p.sp)+' · '+esc(p.st)+'</small><b>'+esc(p.n)+'</b><span>'+esc(p.since)+'</span><div class="pt-prog is-in"><span>Recuperación</span><b>'+p.pct+'%</b><i style="--w:'+p.pct+'%"></i></div></div></div>'+
   '<p class="ap-k">Elige cómo quieres ayudar cada mes</p><div class="ap-plans" role="radiogroup" aria-label="Plan de apadrinamiento">'+PLANS.map(function(x,i){return '<button role="radio" aria-checked="'+(i===AP.plan)+'" data-plan="'+i+'"><b>$'+x.a+'<small>/mes</small></b><span>'+esc(x.t)+'</span><em>'+esc(x.d)+'</em></button>'}).join('')+'</div>'+
   '<form id="apForm" novalidate><div class="fields">'+fld('apName','Tu nombre *','<input id="apName" autocomplete="name" value="'+esc(AP.name)+'">',AP.tried&&!AP.name.trim(),'Escribe tu nombre')+fld('apMail','Tu correo *','<input id="apMail" type="email" autocomplete="email" value="'+esc(AP.mail)+'">',AP.tried&&!validMail(AP.mail),'Escribe un correo válido, por ejemplo nombre@correo.com')+'</div>'+
   '<button class="ob ob-sand ap-go" type="submit">Apadrinar a '+esc(p.n)+' por $'+pl.a+' al mes</button><p class="ap-note">Puedes cancelar cuando quieras. El apadrinamiento es simbólico: '+esc(p.n)+' no se visita ni se entrega, porque el objetivo es que vuelva a la vida silvestre.</p></form>';
  obWrap(el);
}
function openAp(i){AP.i=i;AP.ok=false;AP.tried=false;renderAp();openDr('apDr')}
document.addEventListener('click',function(e){var b=e.target.closest('[data-ap]');if(b){openAp(+b.getAttribute('data-ap'));return}var pl=e.target.closest('[data-plan]');if(pl){AP.name=($('#apName')||{}).value||AP.name;AP.mail=($('#apMail')||{}).value||AP.mail;AP.plan=+pl.getAttribute('data-plan');renderAp();var n=$('[data-plan="'+AP.plan+'"]');if(n)n.focus()}});
document.addEventListener('submit',function(e){if(e.target.id!=='apForm')return;e.preventDefault();AP.name=$('#apName').value;AP.mail=$('#apMail').value;AP.tried=true;if(!AP.name.trim()||!validMail(AP.mail)){renderAp();var bad=!AP.name.trim()?$('#apName'):$('#apMail');if(bad)bad.focus();return}AP.ok=true;renderAp()});
renderPat();

/* ---------- donación: cuánto cubre el aporte elegido ---------- */
var DM={v:0};
function donMeter(){var el=$('#donCov');if(!el)return;var a=0;try{a=amount()}catch(err){}var to=Math.round(a/YEAR_COST*525600),bar=$('#donBar');if(bar)bar.style.width=Math.min(100,a)+'%';if(window.gsap&&!reduced)gsap.to(DM,{v:to,duration:.8,ease:'power2.out',overwrite:true,onUpdate:function(){el.textContent=nf(DM.v)}});else el.textContent=nf(to)}
if(window.MutationObserver)new MutationObserver(donMeter).observe($('#give'),{childList:true,subtree:true,attributes:true,attributeFilter:['aria-pressed','value']});
$('#give').addEventListener('input',donMeter);
autoVid($('.kdon-vid'));

/* ---------- cursor contextual sobre cápsulas y casos ---------- */
(function(){var c=$('#cur');if(!c||!window.gsap||reduced||!matchMedia('(pointer:fine)').matches)return;var lab=$('span',c),qx=gsap.quickTo(c,'x',{duration:.3,ease:'power3'}),qy=gsap.quickTo(c,'y',{duration:.3,ease:'power3'}),on=false;
  gsap.set(c,{xPercent:-50,yPercent:-50,scale:.2,autoAlpha:0});
  addEventListener('mousemove',function(e){qx(e.clientX);qy(e.clientY)},{passive:true});
  document.addEventListener('mouseover',function(e){var t=e.target.closest('[data-cursor]'),show=!!t&&!(t.classList.contains('reel')&&!t.classList.contains('is-on'))&&!(t.classList.contains('case')&&!t.classList.contains('is-on'));if(show){lab.textContent=t.getAttribute('data-cursor');if(!on){on=true;gsap.to(c,{scale:1,autoAlpha:1,duration:.35,ease:'back.out(2)'})}}else if(on){on=false;gsap.to(c,{scale:.2,autoAlpha:0,duration:.2})}});
})();

/* ---------- pie ---------- */
var SOC={instagram:'i-ig',tiktok:'i-tt',youtube:'i-yt',facebook:'i-fb'};
$('#ftSoc').innerHTML=Object.keys(NETS).map(function(k){var n=NETS[k];return '<a href="'+(n.url||'#contacto')+'" data-follow="'+k+'" target="'+(n.url?'_blank':'_self')+'" rel="noopener" aria-label="'+n.name+'">'+ico(SOC[k])+'</a>'}).join('');
$('#newsForm').addEventListener('submit',function(e){e.preventDefault();var v=$('#nMail').value.trim(),m=$('#nMsg');if(!validMail(v)){m.textContent='Escribe un correo válido, por ejemplo nombre@correo.com.';m.className='nmsg bad';$('#nMail').focus();return}m.textContent='Listo. Te avisaremos cuando salga la próxima cápsula. (Maqueta: aún no se envía.)';m.className='nmsg ok';this.reset()});

/* ---------- globo de puntos que gira (cierre) ---------- */
var GL={rot:0,speed:.0026,boost:0};
function initGlobe(){
  var cv=$('#globe');if(!cv||!cv.getContext)return;var cx=cv.getContext('2d'),N=1600,P=[],dpr=Math.min(2,window.devicePixelRatio||1),W=0,H=0;
  for(var i=0;i<N;i++){var y=1-(i/(N-1))*2,r=Math.sqrt(1-y*y),th=Math.PI*(3-Math.sqrt(5))*i;P.push([Math.cos(th)*r,y,Math.sin(th)*r])}
  function ll(lat,lon){lat*=Math.PI/180;lon*=Math.PI/180;return [Math.cos(lat)*Math.cos(lon),Math.sin(lat),Math.cos(lat)*Math.sin(lon)]}
  var PINS=[ll(-2.19,-79.89),ll(-2.45,-80.65)],TILT=-.32;
  function size(){var b=cv.getBoundingClientRect();W=b.width;H=b.height;cv.width=W*dpr;cv.height=H*dpr;cx.setTransform(dpr,0,0,dpr,0,0)}
  size();addEventListener('resize',size);
  function proj(p,R,ox,oy){var c=Math.cos(GL.rot),s=Math.sin(GL.rot),x=p[0]*c-p[2]*s,z=p[0]*s+p[2]*c,y=p[1],ct=Math.cos(TILT),st=Math.sin(TILT),y2=y*ct-z*st,z2=y*st+z*ct;return [ox+x*R,oy-y2*R,z2]}
  var visible=true;if(canIO)new IntersectionObserver(function(es){visible=es[0].isIntersecting},{rootMargin:'100px'}).observe(cv);
  function frame(){
    requestAnimationFrame(frame);if(!visible||document.hidden)return;
    GL.rot+=reduced?0:GL.speed+GL.boost;GL.boost*=.94;
    var R=Math.min(W*.5,H*.78),ox=W*.42,oy=H*.74;cx.clearRect(0,0,W,H);
    var g=cx.createRadialGradient(ox-R*.3,oy-R*.4,R*.1,ox,oy,R*1.05);g.addColorStop(0,'rgba(63,90,79,.55)');g.addColorStop(.75,'rgba(20,35,28,.35)');g.addColorStop(1,'rgba(217,185,122,.10)');cx.fillStyle=g;cx.beginPath();cx.arc(ox,oy,R,0,7);cx.fill();
    cx.strokeStyle='rgba(217,185,122,.28)';cx.lineWidth=1;cx.beginPath();cx.arc(ox,oy,R,0,7);cx.stroke();
    for(var i=0;i<P.length;i++){var q=proj(P[i],R,ox,oy);if(q[2]<-.05)continue;var a=Math.max(0,Math.min(1,(q[2]+.05)/1.05)),sz=1.1+a*1.7;cx.fillStyle='rgba(244,239,230,'+(.12+a*.72)+')';cx.fillRect(q[0]-sz/2,q[1]-sz/2,sz,sz)}
    cx.lineWidth=1;
    for(var m=0;m<12;m++){cx.beginPath();var pen=false;for(var t=0;t<=48;t++){var q2=proj(ll(t/48*180-90,m*30),R,ox,oy);if(q2[2]<0){pen=false;continue}if(!pen){cx.moveTo(q2[0],q2[1]);pen=true}else cx.lineTo(q2[0],q2[1])}cx.strokeStyle='rgba(244,239,230,.10)';cx.stroke()}
    for(var la=-60;la<=60;la+=30){cx.beginPath();var pen2=false;for(var t2=0;t2<=72;t2++){var q3=proj(ll(la,t2/72*360-180),R,ox,oy);if(q3[2]<0){pen2=false;continue}if(!pen2){cx.moveTo(q3[0],q3[1]);pen2=true}else cx.lineTo(q3[0],q3[1])}cx.strokeStyle=la===0?'rgba(217,185,122,.4)':'rgba(244,239,230,.08)';cx.stroke()}
    cx.strokeStyle='rgba(217,185,122,.5)';cx.lineWidth=1.2;cx.beginPath();cx.ellipse(ox,oy,R*1.18,R*.34,-.22,Math.PI*1.04,Math.PI*1.96);cx.stroke();
    cx.beginPath();cx.ellipse(ox,oy,R*1.32,R*.5,.18,Math.PI*1.08,Math.PI*1.9);cx.strokeStyle='rgba(244,239,230,.18)';cx.stroke();
    var pp=PINS.map(function(p){return proj(p,R,ox,oy)});
    pp.forEach(function(q,k){if(q[2]<0)return;var pulse=(Date.now()/900+k*.5)%1;cx.fillStyle='rgba(217,185,122,'+(.5*(1-pulse))+')';cx.beginPath();cx.arc(q[0],q[1],4+pulse*14,0,7);cx.fill();cx.fillStyle='#D9B97A';cx.beginPath();cx.arc(q[0],q[1],3.6,0,7);cx.fill()});
  }
  frame();
}
initGlobe();

/* ---------- arranque ---------- */
renderChips();renderReels();renderPod();renderCases();renderMap();renderGive();renderCredits();obWrap(document);onScroll();reelAuto();donMeter();
addEventListener('load',function(){layoutReels(true);layoutCases(true)});


/* ======================  ANIMACIONES (GSAP + ScrollTrigger + Lenis)  ======================
   Las entradas usan IntersectionObserver, que también funciona dentro de la previsualización (aunque el marco no
   tenga scroll propio). Los efectos ligados al scroll (portada que queda fija, giro del video vertical, tarjetas
   apiladas) usan ScrollTrigger cuando la página tiene scroll; si no, se reproducen como animación al aparecer.
   Con «reducir movimiento» o sin GSAP la página queda estática y completa. */
var M={scrolls:false};
function onView(el,fn,o){if(!el)return;if(!canIO){fn(el);return}o=o||{};var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);fn(e.target)}})},{rootMargin:o.margin||'0px 0px -12% 0px',threshold:o.th||0});(el.length!==undefined?el:[el]).forEach(function(x){io.observe(x)})}
/* parte el texto en palabras (y opcionalmente letras) sin tocar los SVG del subrayado */
function splitText(el,chars){
  if(el.__split)return el.__split;var out=[];
  (function walk(node){Array.prototype.slice.call(node.childNodes).forEach(function(n){
    if(n.nodeType===3){var parts=n.textContent.split(/(\s+)/),frag=document.createDocumentFragment();
      parts.forEach(function(p){if(!p)return;if(/^\s+$/.test(p)){frag.appendChild(document.createTextNode(' '));return}
        var w=document.createElement('span');w.className='xw';
        if(chars){p.split('').forEach(function(ch){var c=document.createElement('span');c.className='xc';c.textContent=ch;w.appendChild(c);out.push(c)})}
        else{var i=document.createElement('span');i.className='xwi';i.textContent=p;w.appendChild(i);out.push(i)}
        frag.appendChild(w)});
      n.parentNode.replaceChild(frag,n)}
    else if(n.nodeType===1&&n.tagName.toLowerCase()!=='svg')walk(n)})})(el);
  el.__split=out;return out;
}
function prepLines(){$$('.ul path,.doodle path').forEach(function(p){p.setAttribute('pathLength','1')})}
function drawIn(el,delay){$$('.ul,.doodle',el).forEach(function(s){setTimeout(function(){s.classList.add('drawn')},(delay||0)*1000)})}

function initMotion(){
  prepLines();
  if(!window.gsap||reduced){document.documentElement.classList.add('static');$$('.ul,.doodle').forEach(function(s){s.classList.add('drawn')});return}
  document.documentElement.classList.add('mo');
  if(window.ScrollTrigger)gsap.registerPlugin(ScrollTrigger);
  M.scrolls=!!window.ScrollTrigger&&(document.documentElement.scrollHeight-innerHeight>400);
  document.documentElement.classList.toggle('noscroll',!M.scrolls);
  var fine=matchMedia('(pointer:fine)').matches,wide=innerWidth>=900;

  /* desplazamiento suave (como la plantilla) */
  if(M.scrolls&&window.Lenis&&fine){
    var lenis=new Lenis({lerp:.1,smoothWheel:true});window.__lenis=lenis;
    lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(function(t){lenis.raf(t*1000)});gsap.ticker.lagSmoothing(0);
    $$('.ficha,.story,.film,.nv-menu').forEach(function(x){x.setAttribute('data-lenis-prevent','')});
    new MutationObserver(function(){if(document.body.classList.contains('lock'))lenis.stop();else lenis.start()}).observe(document.body,{attributes:true,attributeFilter:['class']});
  }

  function scrubFx(trigger,target,from,to,cfg){
    if(!$(typeof target==='string'?target:'body'))return;
    if(M.scrolls){return gsap.fromTo(target,from,Object.assign({},to,{ease:'none',scrollTrigger:Object.assign({trigger:trigger,scrub:true,invalidateOnRefresh:true},cfg||{})}))}
    gsap.set(target,from);onView($(trigger),function(){gsap.to(target,Object.assign({},to,{duration:1.5,ease:'power3.out'}))});
  }

  /* ---- portada: entrada orquestada ---- */
  var hc=splitText($('#heroT'),true);
  var pre=$('#pre'),tl=gsap.timeline({defaults:{ease:'power4.out'}});
  if(pre){pre.hidden=false;
    tl.fromTo('#pre .logo',{autoAlpha:0,y:24,scale:.94},{autoAlpha:1,y:0,scale:1,duration:.7},0).fromTo('#pre i',{scaleX:0},{scaleX:1,duration:.9,ease:'power2.inOut'},.1)
      .to('#pre .logo',{autoAlpha:0,y:-20,duration:.4,ease:'power2.in'},1.05).to(pre,{yPercent:-100,duration:.9,ease:'power4.inOut',onComplete:function(){pre.hidden=true}},1.2);
    tl.addLabel('in',1.35)}else tl.addLabel('in',0);
  tl.from('#nv',{yPercent:-100,autoAlpha:0,duration:1},'in+=.1')
    .fromTo('#heroMedia',{scale:1.18},{scale:1,duration:2.6,ease:'power3.out'},'in+=0')
    .from('.kh-eyb',{y:40,autoAlpha:0,duration:1},'in+=.35')
    .from(hc,{yPercent:110,autoAlpha:0,rotate:6,duration:1.1,stagger:.016},'in+=.45')
    .add(function(){drawIn($('#heroT'))},'in+=1.3')
    .from('.kh-p',{y:50,autoAlpha:0,duration:1.1},'in+=.95')
    .from('.kh-act .ob',{y:40,autoAlpha:0,duration:1,stagger:.1},'in+=1.1')
    .from('.kh-mini',{x:80,autoAlpha:0,rotationY:-30,transformPerspective:900,duration:1.3},'in+=1.2')
    .from('#heroPP,.kh-credit,.kh-cue',{autoAlpha:0,duration:.8},'in+=1.5');
  /* la página sube sobre la portada fija */
  if(M.scrolls){
    gsap.to('#heroIn',{y:-120,autoAlpha:.15,ease:'none',scrollTrigger:{trigger:'#sheet',start:'top bottom',end:'top 15%',scrub:true}});
    gsap.to('#heroMedia',{scale:1.08,filter:'brightness(.55)',ease:'none',scrollTrigger:{trigger:'#sheet',start:'top bottom',end:'top top',scrub:true}});
  }

  /* ---- titulares por palabras + subrayados que se dibujan ---- */
  $$('.st,.intro-t').forEach(function(h){var w=splitText(h,false);gsap.set(w,{yPercent:115});onView(h,function(){gsap.to(w,{yPercent:0,duration:1.1,stagger:.045,ease:'power4.out'});drawIn(h,.5)})});
  $$('.sk h3').forEach(function(h){onView(h,function(){drawIn(h,.2)})});

  /* ---- entradas genéricas ---- */
  gsap.set('.rv',{y:44,autoAlpha:0});
  onView($$('.rv'),function(el){gsap.to(el,{y:0,autoAlpha:1,duration:1.1,ease:'power3.out',delay:(el.matches('.sh-r,.proof')?.15:0)})});

  /* ---- intro: el video en la píldora crece ---- */
  gsap.set('.pill',{width:0});onView($('.intro-t'),function(){gsap.to('.pill',{width:'2.4em',duration:1.2,ease:'power4.inOut',delay:.35})});
  onView($('#proofAv'),function(){gsap.from('#proofAv > *',{scale:0,duration:.7,stagger:.07,ease:'back.out(2)',delay:.3})});

  /* ---- cifras: la tarjeta se abre, las barras caen y los números cuentan ---- */
  scrubFx('.metrics','#metCard',{scale:.9,borderRadius:48},{scale:1,borderRadius:24},{start:'top bottom',end:'top 30%'});
  gsap.set('.mb-bar i',{yPercent:-100});gsap.set('.mb-t',{y:40,autoAlpha:0});
  onView($('#metBars'),function(){gsap.to('.mb-bar i',{yPercent:0,duration:1.5,stagger:.15,ease:'power4.out'});gsap.to('.mb-t',{y:0,autoAlpha:1,duration:1,stagger:.15,ease:'power3.out',delay:.4});$$('#metBars [data-count]').forEach(function(b,i){setTimeout(function(){countUp(b,1.9)},400+i*150)})});

  /* ---- marquesina que acelera con el scroll ---- */
  var mq=$('#marqLogos .marq-t'),mqT=mq?gsap.to(mq,{xPercent:-50,repeat:-1,duration:34,ease:'none'}):null;
  if(M.scrolls&&mqT)ScrollTrigger.create({start:0,end:'max',onUpdate:function(s){var v=Math.min(6,Math.abs(s.getVelocity())/300);gsap.to(mqT,{timeScale:(1+v)*s.direction,duration:.3,overwrite:true,onComplete:function(){gsap.to(mqT,{timeScale:s.direction,duration:1})}});GL.boost=Math.min(.05,GL.boost+v*.004)}});

  /* ---- EL GIRO: la pantalla del video institucional entra inclinada y gira hasta quedar de frente ---- */
  if(wide)scrubFx('#cineStage','#cine',{rotationX:34,rotationY:-10,rotationZ:-3,scale:.74,y:0,transformPerspective:1500,transformOrigin:'50% 100%'},{rotationX:0,rotationY:0,rotationZ:0,scale:1,y:0},{start:'top 95%',end:'top 22%'});
  else{gsap.set('#cine',{rotationX:24,scale:.86,autoAlpha:0,transformPerspective:1200,transformOrigin:'50% 100%'});onView($('#cine'),function(){gsap.to('#cine',{rotationX:0,scale:1,autoAlpha:1,duration:1.4,ease:'power3.out'})})}
  gsap.set('.chap',{y:50,autoAlpha:0});onView($('#instList'),function(){gsap.to('.chap',{y:0,autoAlpha:1,duration:.9,stagger:.1,ease:'power3.out'})});

  /* ---- cápsulas: el carrusel entra girando ---- */
  gsap.set('#reelsT',{rotationY:-28,x:260,autoAlpha:0,transformPerspective:1600});
  onView($('#krl'),function(){gsap.to('#reelsT',{rotationY:0,x:0,autoAlpha:1,duration:1.6,ease:'power4.out'})});

  /* ---- tarjetas apiladas: la anterior se encoge y se desenfoca al llegar la siguiente ---- */
  var sks=$$('.sk');
  sks.forEach(function(sk,i){var card=$('.sk-card',sk),next=sks[i+1];
    if(M.scrolls&&next)gsap.to(card,{scale:.9-.012*(sks.length-i),y:-30,filter:'blur(4px)',opacity:.45,ease:'none',scrollTrigger:{trigger:next,start:'top 92%',end:'top 22%',scrub:true}});
    onView(card,function(){card.classList.add('is-in');gsap.from($$('.sk-l > *',card),{y:40,autoAlpha:0,duration:.9,stagger:.07,ease:'power3.out'});gsap.from($('.pc',card),{y:60,rotationX:-25,autoAlpha:0,transformPerspective:900,duration:1.2,ease:'power4.out',delay:.2});$$('[data-count]',card).forEach(function(b){countUp(b,1.6)});drawIn(card,.3);
      var dot=$('.rt-dot',card),path=$('.rt',card);if(dot&&path){var L=path.getTotalLength(),o={t:0};gsap.to(o,{t:1,duration:3.2,repeat:-1,repeatDelay:.6,ease:'power1.inOut',onUpdate:function(){var p=path.getPointAtLength(o.t*L);dot.setAttribute('cx',p.x);dot.setAttribute('cy',p.y)}})}},{margin:'0px 0px -20% 0px'});
  });

  /* ---- podcast, casos, preguntas, fichas, donación ---- */
  onView($('#kpod'),function(){gsap.from('#kpod .kpod-v img',{scale:1.25,duration:1.8,ease:'power3.out'});gsap.from('#kpod .kpod-num',{yPercent:70,autoAlpha:0,duration:1.2,ease:'power4.out',delay:.2});gsap.from('#kpod .kpod-c > *:not(.kpod-num)',{y:30,autoAlpha:0,duration:.8,stagger:.07,ease:'power3.out',delay:.25});gsap.from('#kpod .kpod-play',{scale:0,duration:.9,ease:'back.out(2)',delay:.5})});
  /* ---- apadrina: las tarjetas suben escalonadas y la barra de recuperación se llena ---- */
  gsap.set('.pt',{y:80,autoAlpha:0});onView($$('.pt'),function(el){var k=$$('.pt').indexOf(el);gsap.to(el,{y:0,autoAlpha:1,duration:1,ease:'power3.out',delay:(k%4)*.1,onStart:function(){el.classList.add('is-in')}});gsap.from($('img',el),{scale:1.3,duration:1.6,ease:'power3.out',delay:(k%4)*.1});$$('[data-count]',el).forEach(function(b){countUp(b,1.6)})});
  onView($('.pat-get'),function(){gsap.from('.pat-get li',{y:30,autoAlpha:0,duration:.8,stagger:.1,ease:'power3.out'})});
  onView($('.kdon-meter'),function(){donMeter()});
  gsap.set('#casesT',{x:200,autoAlpha:0});onView($('#cases'),function(){gsap.to('#casesT',{x:0,autoAlpha:1,duration:1.4,ease:'power4.out'})});
  onView($('#faqList'),function(){gsap.from('#faqList .fq',{y:30,autoAlpha:0,duration:.8,stagger:.07,ease:'power3.out'})});
  onView($('#fzList'),function(){gsap.from('#fzList .fzc',{scale:.6,autoAlpha:0,duration:.7,stagger:.04,ease:'back.out(1.8)'})});
  onView($('.kfaq-cta'),function(){gsap.from('#faqAv img',{scale:0,duration:.6,stagger:.08,ease:'back.out(2)',delay:.3})});
  onView($('.sedes-m'),function(){gsap.from('.sedes-m',{clipPath:'inset(0 0 100% 0 round 20px)',duration:1.4,ease:'power4.inOut'})});

  /* ---- cierre: el globo gira más rápido al llegar y las etiquetas flotan ---- */
  onView($('#kcta'),function(){GL.boost=.06;gsap.from('.kcta-chip',{scale:.6,autoAlpha:0,duration:.9,stagger:.15,ease:'back.out(2)',delay:.3});
    $$('.kcta-chip').forEach(function(c,i){gsap.to(c,{y:i%2?10:-10,duration:2.6+i*.4,repeat:-1,yoyo:true,ease:'sine.inOut',delay:1.2})})});
  scrubFx('#kcta','#globe',{scale:.8,rotate:-12},{scale:1,rotate:0},{start:'top bottom',end:'top 20%'});

  /* ---- pie: la palabra gigante sube ---- */
  gsap.set('.kft-big svg',{yPercent:60});onView($('.kft-big'),function(){gsap.to('.kft-big svg',{yPercent:0,duration:1.6,ease:'power4.out'})},{margin:'0px'});
  onView($('.kft-g'),function(){gsap.from('.kft-brand,.kft-links',{y:60,autoAlpha:0,duration:1.1,stagger:.12,ease:'power3.out'})});

  if(window.ScrollTrigger){addEventListener('load',function(){ScrollTrigger.refresh()});var rt=0;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){ScrollTrigger.refresh()},200)})}
}
function countUp(el,dur){var to=+el.getAttribute('data-count'),pre=el.getAttribute('data-pre')||'',suf=el.getAttribute('data-suf')||'',o={v:0};if(!window.gsap||reduced){el.textContent=pre+nf(to)+suf;return}gsap.to(o,{v:to,duration:dur||1.8,ease:'power2.out',onUpdate:function(){el.textContent=pre+nf(o.v)+suf}})}
initMotion();

document.documentElement.classList.add('ready');
})();
