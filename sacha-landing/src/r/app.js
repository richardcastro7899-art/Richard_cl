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
var reduced=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches,sysReduced=reduced;
/* «Reducir movimiento» del sistema apaga todas las animaciones. En equipos de trabajo suele venir activado; el aviso de abajo permite verlas igual. */
function animForced(){var v='';try{v=localStorage.getItem('sachaAnim')||''}catch(e){}if(!v){try{v=sessionStorage.getItem('sachaAnim')||''}catch(e){}}if(!v&&/sachaAnim=1/.test(window.name||''))v='1';return v==='1'}
if(reduced&&(window.SACHA_ALWAYS_ANIM||animForced())){reduced=false;document.documentElement.classList.add('anim-on')}
function forceAnim(){try{localStorage.setItem('sachaAnim','1')}catch(e){}try{sessionStorage.setItem('sachaAnim','1')}catch(e){}window.name=(window.name||'')+' sachaAnim=1';location.reload()}
if(sysReduced&&reduced){(function(){var st=document.createElement('style');st.textContent='.moask{position:fixed;left:max(12px,env(safe-area-inset-left,0px));bottom:max(12px,env(safe-area-inset-bottom,0px));z-index:150;display:flex;align-items:center;gap:12px;max-width:min(460px,calc(100% - 24px));padding:10px 10px 10px 16px;border-radius:12px;background:#13201A;color:#fff;font:14px/1.35 system-ui,sans-serif;box-shadow:0 14px 40px -10px rgba(0,0,0,.5)}.moask button{flex:none;height:36px;padding:0 16px;border:0;border-radius:8px;background:#D9B97A;color:#13201A;font:600 14px system-ui,sans-serif;cursor:pointer}.moask button:hover{background:#fff}';document.head.appendChild(st);var d=document.createElement('div');d.className='moask';d.setAttribute('role','status');d.innerHTML='<span>Tu equipo tiene «Reducir movimiento» activado, por eso no se ven las animaciones.</span><button type="button">Activar animaciones</button>';d.querySelector('button').addEventListener('click',forceAnim);document.body.appendChild(d)})()}
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


var CASES=[
 {ph:'iguana2',sp:'Iguanas marinas de Galápagos',k:'Tráfico de fauna',d:'Mayo 2026',t:'Tres iguanas marinas aparecieron en Guayaquil en una semana: la fundación alertó sobre una posible red de tráfico.',s:'Vistazo',u:'https://www.vistazo.com/actualidad/nacional/2026-05-16-por-que-aparecieron-tres-iguanas-marinas-galapagos-guayaquil-esta-semana-HN10958942'},
 {ph:'cocodrilo',sp:'Cocodrilo de la costa',k:'Denuncia',d:'2026',t:'Un hombre cargaba un cocodrilo al hombro en un suburbio. La fundación pidió rescatarlo e investigar el caso.',s:'El Comercio',u:'https://www.elcomercio.com/actualidad/guayaquil/denuncian-presunta-captura-de-cocodrilo-en-guayaquil-tras-viralizacion-de-video/'},
 {ph:'ocelote',sp:'Meg, bebé ocelote',k:'Rescate',t:'En peligro por la quema de plantaciones y la mascotización.',s:'Vistazo',u:'https://www.vistazo.com/estilo-de-vida/sostenibilidad/meg-la-bebe-ocelote-en-peligro-por-la-quema-de-plantaciones-y-mascotizacion-CK6972334'},
 {ph:'tamandua',sp:'Oso hormiguero',k:'Atención médica',t:'Herido por perros dentro de un recinto militar de Guayaquil.',s:'Expreso',u:'https://www.expreso.ec/guayaquil/policia-halla-oso-hormiguero-herido-por-perros-en-recinto-militar-de-guayaquil-279129.html'},
 {ph:'mono',sp:'Mono aullador',k:'Rehabilitación',t:'Encontrado junto a una cría de ocelote, con desnutrición y lesiones.',s:'El Universo',u:'https://www.eluniverso.com/guayaquil/comunidad/fauna-ocelote-bebe-mono-aullador-proyecto-sacha-guayaquil-guayas-dos-mangas-nota/'},
 {ph:'manglar2',sp:'Centro rural en Chanduy',k:'Proyecto',t:'Anunciado como el centro de rehabilitación de fauna silvestre más grande de la costa. Estado de la obra por confirmar.',s:'Vistazo',u:'https://www.vistazo.com/estilo-de-vida/sostenibilidad/proyecto-sacha-inaugurara-el-centro-de-rehabilitacion-y-rescate-de-fauna-silvestre-mas-grande-de-la-costa-ecuatoriana-YI4028032'}
];
function renderCredits(){var seen={};$('#credits').innerHTML=Object.keys(PH).filter(function(k){var u=PH[k].url;if(seen[u])return false;seen[u]=1;return true}).map(function(k){var p=PH[k];return '<li>'+esc(p.alt)+': <a href="'+p.url+'" target="_blank" rel="noopener">'+esc(p.by)+'</a> · '+p.lic+'</li>'}).join('')}


/* ======================  SACHA ZAIZOO II  ======================
   Los videos son el eje: portada en video, video institucional que se abre con el scroll, reels en carrusel
   continuo, podcast y casos en YouTube. Alrededor: historia en línea de tiempo, proceso por etapas, galería,
   donar y apadrinar, y la guía para quien encuentra un animal.
   CONTENIDO EDITABLE: TL (línea de tiempo), YT (videos de YouTube), GAL (fotos), CAUSES y DAMT (donación),
   PATS y PLANS (apadrinamiento). */
VIDEOS.caps=[0,1,2,3,4,5,6,7].map(function(i){return 'assets/video/final/r'+i+'.mp4'});
(function(){var t=document.createElement('video');if(t.canPlayType&&!t.canPlayType('video/mp4; codecs="avc1.42E01E"'))VIDEOS.caps=VIDEOS.caps.map(function(u){return u.replace('.mp4','.webm')})})();
NETS.instagram.url='https://www.instagram.com/proyectosacha/';NETS.instagram.handle='@proyectosacha';
NETS.youtube.url='https://www.youtube.com/@proyectosacha3474';NETS.youtube.handle='@proyectosacha3474';
var BANK=[['Banco','Banco Internacional'],['Cuenta corriente','1400625249'],['A nombre de','Fundación Proyecto Sacha'],['Comprobante a','donaciones.tc@proyectosacha.org']];
function nf(n){return Math.round(n).toLocaleString('es-EC')}

/* ---------- cortina de inicio ----------
   Solo el logo. Al cargar, el verde se abre desde el ojo de Sacha (la «A» del logo), como una mirada que se abre. */
var PRE={done:false,cbs:[]};
function onPreDone(f){if(PRE.done)f();else PRE.cbs.push(f)}
(function(){var el=$('#pre'),de=document.documentElement,t0=performance.now(),MIN=1300,MAX=3800,loaded=document.readyState==='complete',out=false;
  if(!el){PRE.done=true;return}
  de.classList.add('pre-on');addEventListener('load',function(){loaded=true});
  function eye(){var lg=$('#preLogo').getBoundingClientRect();return {x:lg.left+lg.width*.268,y:lg.top+lg.height*.47}}
  function finish(){if(out)return;out=true;var e=eye(),R=Math.hypot(Math.max(e.x,innerWidth-e.x),Math.max(e.y,innerHeight-e.y))+40;
    el.style.setProperty('--ex',e.x+'px');el.style.setProperty('--ey',e.y+'px');
    var done=function(){PRE.done=true;PRE.cbs.splice(0).forEach(function(f){f()})},end=function(){de.classList.remove('pre-on');el.hidden=true};
    if(window.gsap&&!reduced){var o={r:0};gsap.timeline({onComplete:end})
      .to('#preLogo',{scale:1.06,duration:.35,ease:'power2.out'})
      .add(function(){el.classList.add('is-open')})
      .to(o,{r:R,duration:1.15,ease:'power3.inOut',onUpdate:function(){el.style.setProperty('--r',o.r.toFixed(1)+'px')}},'+=.02')
      .to('#preLogo',{scale:1.6,autoAlpha:0,duration:.7,ease:'power2.in'},'<')
      .add(done,'<.35')}
    else{done();end()}}
  requestAnimationFrame(function(){t0=performance.now();(function tick(){var t=performance.now()-t0;if((loaded&&t>=MIN)||t>MAX){finish();return}requestAnimationFrame(tick)})()});
})();

/* ---------- navegación y cabecera ---------- */
function hdrH(){var z=$('#zh');return z?z.offsetHeight:76}
function closeMenu(){var m=$('#zMenu');if(!m)return;m.hidden=true;$('#zBurger').setAttribute('aria-expanded','false');document.documentElement.classList.remove('menu-open')}
$('#zBurger').addEventListener('click',function(){var o=$('#zMenu').hidden;$('#zMenu').hidden=!o;this.setAttribute('aria-expanded',String(o));document.documentElement.classList.toggle('menu-open',o)});
function go(id){closeMenu();var el=document.getElementById(id);if(!el)return;var off=id==='video'?0:-hdrH()+1;
  if(window.__lenis){window.__lenis.scrollTo(id==='inicio'?0:el,{offset:off,duration:1.4});return}
  window.scrollTo({top:id==='inicio'?0:Math.max(0,el.getBoundingClientRect().top+scrollY+off),behavior:reduced?'auto':'smooth'})}
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMenu()});
var SPY=['video','nosotros','proceso','reels','podcast','galeria','ayuda','encuentras'],lastA='__';
function onScroll(){
  var H=document.documentElement.scrollHeight-innerHeight,a=null,hero=$('#inicio'),top=hero?hero.offsetHeight-hdrH()-10:300;
  $('#zh').classList.toggle('is-top',scrollY<top);$('#zh').classList.toggle('is-s',scrollY>40);
  SPY.forEach(function(id){var el=document.getElementById(id);if(el&&el.getBoundingClientRect().top<=hdrH()+160)a=id});
  if(a==='encuentras')a='ayuda';
  if(a!==lastA){lastA=a;$$('#znav a').forEach(function(l){l.setAttribute('aria-current',l.getAttribute('data-go')===a?'true':'false')})}
}
addEventListener('scroll',function(){if(!onScroll.r){onScroll.r=requestAnimationFrame(function(){onScroll.r=0;onScroll()})}},{passive:true});
addEventListener('resize',onScroll);
document.addEventListener('click',function(e){
  var a=e.target.closest('a[href="#"]');if(a&&!a.hasAttribute('data-follow'))e.preventDefault();
  var f=e.target.closest('a[href^="#"][data-go]');if(f)e.preventDefault();
  var at=e.target.closest('[data-at-go]');if(at)setTab(at.getAttribute('data-at-go'));
});

/* ---------- videos que se reproducen solos cuando están en pantalla ---------- */
function autoVid(v,th){if(!v)return;var play=function(){var p=v.play();if(p&&p.catch)p.catch(function(){})};if(reduced)return;
  if(!canIO){play();return}new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){if(!v.__userPaused)play()}else v.pause()})},{threshold:th||.15}).observe(v)}
/* ---------- video institucional ----------
   Se reproduce cuando la ventana termina de abrirse (lo controla la animación) o al aparecer, si no hay scroll. */
var iv=$('#immVid'),fr=$('#immFrame');
function ivPaint(){fr.classList.toggle('is-sound',!iv.muted);var b=$('#immSnd');b.innerHTML=ico(iv.muted?'i-mute':'i-vol')+'<span>'+(iv.muted?'Activar sonido':'Silenciar')+'</span>';b.setAttribute('aria-label',iv.muted?'Activar sonido':'Silenciar')}
function ivPlay(){var p=iv.play();if(p&&p.catch)p.catch(function(){})}
function ivStop(){iv.pause()}
$('#immFs').addEventListener('click',function(){var v=iv,fn=v.requestFullscreen||v.webkitRequestFullscreen||v.webkitEnterFullscreen;if(!fn){toast('Pantalla completa no disponible aquí');return}try{var p=fn.call(v);v.controls=true;if(p&&p.catch)p.catch(function(){v.controls=false;toast('Pantalla completa no disponible aquí')})}catch(e){v.controls=false}ivPlay()});
document.addEventListener('fullscreenchange',function(){if(!document.fullscreenElement)iv.controls=false});
$('#immSnd').addEventListener('click',function(){iv.muted=!iv.muted;if(!iv.muted){iv.loop=false;if(iv.ended)iv.currentTime=0;ivPlay()}ivPaint()});
iv.addEventListener('volumechange',ivPaint);
iv.addEventListener('timeupdate',function(){if(iv.duration)$('#immBar').style.width=(iv.currentTime/iv.duration*100)+'%'});
iv.addEventListener('ended',function(){iv.muted=true;iv.loop=true;ivPlay();ivPaint()});
$('.imm-bar').addEventListener('click',function(e){if(!iv.duration)return;var r=this.getBoundingClientRect();iv.currentTime=Math.max(0,Math.min(.99,(e.clientX-r.left)/r.width))*iv.duration});
ivPaint();

/* ---------- nuestra historia: línea de tiempo ----------
   Fuentes: la web de la fundación, Expreso (2023) y el canal de YouTube de Proyecto Sacha. */
var TL=[
 {y:'2018',t:'Llega Sacha',d:'Un ocelote de días de nacido, rescatado de una tienda en Vinces. Comía cada dos o tres horas y pasó sus primeros días en incubadora.',ph:'ocelote'},
 {y:'2018',t:'Zafira y Vicenta',d:'Una ocelote con quemaduras en las patas y una monita aulladora bebé. Entendimos que la fauna silvestre necesitaba un lugar.',ph:'mono'},
 {y:'2021',t:'“Tu casa no es mi hábitat”',d:'Campaña para desalentar el tráfico de fauna silvestre y alianza para conservar la fauna y sus ecosistemas.',ph:'iguana'},
 {y:'2022',t:'Serpientes del Guayas',d:'Programa de conservación de serpientes y guía para reaccionar si aparece una en casa.',ph:'serpiente'},
 {y:'2022',t:'Rescate en el incendio forestal',d:'Rescate de fauna durante el incendio de Cerro Azul, en Guayaquil. Ese año se auxiliaron cerca de 1.100 animales.',ph:'tamandua'},
 {y:'2023',t:'Más de 3.500 animales',d:'Rescatados, recuperados o reubicados desde 2018, en coordinación con la autoridad ambiental.',ph:'lechuza'},
 {y:'Hoy',t:'Más de 5.400 animales cuidados',d:'Sacha y Zafira ya son libres. Seguimos rescatando, rehabilitando y liberando, y contándolo: si los reconoces, los cuidas.',ph:'manglar'}
];
$('#tl').insertAdjacentHTML('beforeend',TL.map(function(x,i){var p=PH[x.ph];return '<li class="tl-i" data-tl="'+i+'"><span class="tl-dot" aria-hidden="true"></span><div class="tl-y"><b>'+esc(x.y)+'</b></div><div class="tl-c"><h3>'+esc(x.t)+'</h3><p>'+esc(x.d)+'</p></div><figure class="tl-img"><img src="'+p.src+'" alt="" loading="lazy" style="object-position:'+(p.pos||'50% 50%')+'"></figure></li>'}).join(''));
$('#histCard').insertAdjacentHTML('afterbegin','<span class="mcard-year" id="histYear">2018</span>');
function setTl(i){$$('.tl-i').forEach(function(li,k){li.classList.toggle('is-on',k<=i);li.classList.toggle('is-now',k===i)});var y=$('#histYear');if(y&&y.textContent!==TL[i].y){y.textContent=TL[i].y;if(window.gsap&&!reduced)gsap.fromTo(y,{yPercent:60,autoAlpha:0},{yPercent:0,autoAlpha:1,duration:.5,ease:'power3.out'})}}

/* ---------- cómo trabajamos ---------- */
$('#procNav').innerHTML=STEPS.map(function(s,i){return '<li data-pi="'+i+'"><button type="button" data-pgo="'+i+'"><b>'+esc(s.title)+'</b></button><p>'+esc(s.text)+'</p><i aria-hidden="true"><em></em></i></li>'}).join('');
$('#procCards').innerHTML=STEPS.map(function(s,i){var p=PH[s.ph];return '<article class="pcard" data-pc="'+i+'"><img src="'+p.src+'" alt="" loading="lazy" style="object-position:'+(p.pos||'50% 50%')+'"><div class="pcard-sh" aria-hidden="true"></div><div class="pcard-t"><span class="pcard-ic">'+ico(s.icon)+'</span><h3>'+esc(s.title)+'</h3></div></article>'}).join('');
var PI=-1;function setProc(i){if(i===PI)return;PI=i;$$('#procNav li').forEach(function(li,k){li.classList.toggle('is-on',k===i);li.classList.toggle('is-done',k<i)})}
function procFill(p){$$('#procNav li em').forEach(function(em,k){em.style.transform='scaleX('+Math.max(0,Math.min(1,p*STEPS.length-k)).toFixed(3)+')'})}
document.addEventListener('click',function(e){var b=e.target.closest('[data-pgo]');if(!b)return;var i=+b.getAttribute('data-pgo'),st=window.__procST;if(st){var y=st.start+(st.end-st.start)*((i+.5)/STEPS.length);if(window.__lenis)__lenis.scrollTo(y,{duration:1.1});else scrollTo({top:y,behavior:'smooth'})}else setProc(i)});
setProc(0);

/* ---------- carrusel genérico que avanza solo y se arrastra (galería y pacientes) ---------- */
function Loop(root,opt){
  var track=$('.loop-t',root),html=track.innerHTML,L={x:0,v:0,drag:false,hover:false,vis:true,moved:0,speed:opt.speed||40};
  function fill(){track.innerHTML=html;var setW=track.scrollWidth,n=Math.max(2,Math.ceil((innerWidth*2)/Math.max(1,setW))+1),s=html;for(var i=1;i<n;i++)s+=html.replace(/<(figure|article)/g,'<$1 aria-hidden="true" data-clone=""');track.innerHTML=s;L.setW=setW;$$('[data-clone] button,[data-clone] a',track).forEach(function(b){b.setAttribute('tabindex','-1')})}
  fill();L.refill=fill;
  function wrap(){if(L.setW>0){while(L.x<=-L.setW)L.x+=L.setW;while(L.x>0)L.x-=L.setW}}
  function paint(){track.style.transform='translate3d('+L.x.toFixed(1)+'px,0,0)';if(opt.scale){var cx=innerWidth/2;$$('.loop-i',track).forEach(function(it){var r=it.getBoundingClientRect(),d=Math.min(1,Math.abs(r.left+r.width/2-cx)/(innerWidth*.6));it.style.setProperty('--k',(1-d).toFixed(3))})}}
  var last=performance.now();
  function tick(now){var dt=Math.min(.05,(now-last)/1000);last=now;if(!L.drag){if(!L.hover&&L.vis&&!document.body.classList.contains('lock')&&!reduced)L.x-=L.speed*dt;L.x+=L.v*dt;L.v*=Math.pow(.04,dt)}wrap();paint();requestAnimationFrame(tick)}
  requestAnimationFrame(tick);
  var sx=0,lx=0,lt=0;
  root.addEventListener('pointerdown',function(e){if(e.button>0)return;L.drag=true;L.moved=0;sx=lx=e.clientX;lt=performance.now();L.v=0;root.classList.add('is-drag')});
  addEventListener('pointermove',function(e){if(!L.drag)return;var dx=e.clientX-lx,now=performance.now();L.x+=dx;L.moved+=Math.abs(dx);L.v=dx/Math.max(.008,(now-lt)/1000)*.6;lx=e.clientX;lt=now},{passive:true});
  addEventListener('pointerup',function(){if(!L.drag)return;L.drag=false;root.classList.remove('is-drag')});
  root.addEventListener('click',function(e){if(L.moved>6){e.stopPropagation();e.preventDefault()}},true);
  root.addEventListener('dragstart',function(e){e.preventDefault()});
  if(matchMedia('(hover:hover)').matches){root.addEventListener('mouseenter',function(){L.hover=true});root.addEventListener('mouseleave',function(){L.hover=false})}
  if(canIO)new IntersectionObserver(function(es){L.vis=es[0].isIntersecting},{threshold:0}).observe(root);
  var rz=0;addEventListener('resize',function(){clearTimeout(rz);rz=setTimeout(function(){fill();wrap()},200)});
  return L;
}

/* ---------- reels: carrusel circular que gira solo ---------- */
var R={list:[],pos:0,drag:false,hover:false,inView:false,cur:-1,speed:1/3.2};
function renderReels(){R.list=capList();
  $('#reelsT2').innerHTML=R.list.map(function(ci,k){var c=CAPS[ci],n=NETS[c.net];return '<button class="reel" data-rk="'+k+'" aria-label="Ver el reel '+(ci+1)+': '+esc(c.pre+' '+c.title)+'">'+
    '<video muted loop playsinline preload="none" poster="assets/video/final/r'+ci+'.jpg"><source src="assets/video/final/r'+ci+'.mp4" type="video/mp4"><source src="assets/video/final/r'+ci+'.webm" type="video/webm"></video>'+
    
    '<span class="reel-b"><b>'+esc(c.pre)+' '+esc(c.title)+'</b><em>'+ico('i-play')+'Ver reel</em></span></button>'}).join('');
  layoutReels()}
function layoutReels(){
  var cards=$$('.reel'),n=cards.length,W=innerWidth,cw=cards[0]?cards[0].offsetWidth:280,gap=Math.min(36,W*.03),step=W<700?cw+14:cw*.82+gap;
  var near=((Math.round(R.pos)%n)+n)%n;
  cards.forEach(function(el,k){var d=k-R.pos;d=((d%n)+n)%n;if(d>n/2)d-=n;var ad=Math.abs(d),
    x=d*step,rot=W<700?0:Math.max(-1,Math.min(1,d))*-22,sc=W<700?1-.08*Math.min(1,ad):Math.max(.72,1-.1*ad),bl=W<700?Math.min(2,ad*2):Math.min(6,ad*2.2),op=W<700?(ad>1.5?0:1):(ad>3.2?0:1-.2*Math.min(3,ad));
    el.style.transform='translateX('+x.toFixed(1)+'px) rotateY('+rot.toFixed(2)+'deg) scale('+sc.toFixed(3)+')';el.style.setProperty('--dim',Math.min(.6,ad*.28).toFixed(3));el.style.opacity=op.toFixed(3);el.style.zIndex=String(50-Math.round(ad*10));
    el.classList.toggle('is-on',k===near);el.setAttribute('tabindex',ad<1.5?'0':'-1');el.setAttribute('aria-hidden',ad>2?'true':'false')});
  if(near!==R.cur){R.cur=near;cards.forEach(function(el,k){var v=$('video',el);if(k===near&&R.inView&&!reduced){var p=v.play();if(p&&p.catch)p.catch(function(){})}else v.pause()})}
}
(function(){var last=performance.now(),acc=0;function tick(now){var dt=Math.min(.05,(now-last)/1000);last=now;if(!R.drag&&!R.hover&&R.inView&&!ST.open&&!document.hidden&&!reduced&&!R.tw){R.pos+=R.speed*dt;acc+=dt;if(acc>=1/30){acc=0;layoutReels()}}requestAnimationFrame(tick)}requestAnimationFrame(tick)})();
function reelTo(target){if(window.gsap&&!reduced){R.tw=gsap.to(R,{pos:target,duration:.7,ease:'power3.out',onUpdate:layoutReels,onComplete:function(){R.tw=null}})}else{R.pos=target;layoutReels()}}
(function(){var el=$('#krl'),sx=0,lx=0,moved=0;
  el.addEventListener('pointerdown',function(e){if(e.button>0)return;R.drag=true;moved=0;sx=lx=e.clientX;if(R.tw){R.tw.kill();R.tw=null}el.classList.add('is-drag')});
  addEventListener('pointermove',function(e){if(!R.drag)return;var c=$('.reel'),cw=c?c.offsetWidth:280,step=innerWidth<700?cw+14:cw*.82+30,dx=e.clientX-lx;moved+=Math.abs(dx);R.pos-=dx/step;lx=e.clientX;layoutReels()},{passive:true});
  addEventListener('pointerup',function(){if(!R.drag)return;R.drag=false;el.classList.remove('is-drag');reelTo(Math.round(R.pos))});
  el.addEventListener('click',function(e){if(moved>6){e.stopPropagation();e.preventDefault();return}var b=e.target.closest('[data-rk]');if(!b)return;var k=+b.getAttribute('data-rk'),n=R.list.length,d=k-R.pos;d=((d%n)+n)%n;if(d>n/2)d-=n;if(Math.abs(d)>.5)reelTo(Math.round(R.pos+d));else openStory(R.list[k])},true);
  el.addEventListener('dragstart',function(e){e.preventDefault()});
  if(matchMedia('(hover:hover)').matches){el.addEventListener('mouseenter',function(){R.hover=true});el.addEventListener('mouseleave',function(){R.hover=false})}
  el.addEventListener('focusin',function(){R.hover=true});el.addEventListener('focusout',function(){R.hover=false});
  el.addEventListener('keydown',function(e){if(e.key==='ArrowRight')reelTo(Math.round(R.pos)+1);if(e.key==='ArrowLeft')reelTo(Math.round(R.pos)-1)});
  if(canIO)new IntersectionObserver(function(es){R.inView=es[0].isIntersecting;R.cur=-1;layoutReels()},{threshold:.25}).observe(el);else R.inView=true;
  addEventListener('resize',layoutReels);
})();

/* ---------- podcast y casos: videos de YouTube incrustados ----------
   Para cambiar un video, reemplaza el id (lo que va después de “v=” en YouTube). Sirven horizontales o verticales. */
var YT={
 pod:[
  {id:'Md1QB3DbdmA',t:'Centro de Conservación de Vida Silvestre de Guayaquil',by:'Movimiento Animalista EC',d:'1:08:03',k:'Episodio 01'},
  {id:'29g1ng6XhMs',t:'En defensa de la vida silvestre',by:'Movimiento Animalista EC',d:'57:26',k:'Episodio 02'},
  {id:'IQyvc1qivhY',t:'Rescate de animales silvestres',by:'Ecuaterra · Ecuavisa',d:'4:53',k:'Episodio 03'},
  {id:'9lLk9cB1zJw',t:'Crías de especies silvestres en rehabilitación',by:'El Universo',d:'2:43',k:'Episodio 04'}
 ],
 cas:[
  {id:'zbSVX4I2vsA',t:'Sacha y Zafira',by:'Proyecto Sacha',k:'Caso'},
  {id:'xXsrLXpKaSQ',t:'Liberación de Horus',by:'Proyecto Sacha',k:'Liberación'},
  {id:'Z1FzceT_8Fc',t:'Lupe, la tamandúa',by:'Proyecto Sacha',k:'Caso'},
  {id:'13o128qfFmM',t:'Caribay, el jaguarundi',by:'Proyecto Sacha',k:'Caso'},
  {id:'w9WaD7-Q8Ig',t:'Julián, el mapache',by:'Proyecto Sacha',k:'Caso'},
  {id:'Hsg9KcuvNzg',t:'Liberación de Arturo y Poly',by:'Proyecto Sacha',k:'Liberación'},
  {id:'wnXHlzNrhbE',t:'Zarita, la zarigüeya',by:'Proyecto Sacha',k:'Caso'},
  {id:'7quoECxURsE',t:'Liberación de una culebrita',by:'Proyecto Sacha',k:'Liberación'}
 ]};
var YP={tab:'pod',i:0};
function ytFrame(){return /^https?:$/.test(location.protocol)}
function renderYT(anim){
  var L=YT[YP.tab],v=L[YP.i];
  $('#ytpV').innerHTML='<img src="assets/yt/'+v.id+'.jpg" alt=""><span class="ytp-ov"></span><span class="ytp-tag">'+ico(YP.tab==='pod'?'i-mic':'i-yt')+(YP.tab==='pod'?'Podcast':'Caso en video')+'</span><button class="ytp-play" data-ytplay aria-label="Reproducir: '+esc(v.t)+'">'+ico('i-play')+'</button><div class="ytp-cap"><b>'+esc(v.t)+'</b></div>';
  $('#ytpList').innerHTML=L.map(function(x,i){return '<li><button data-yti="'+i+'" aria-current="'+(i===YP.i)+'"><span class="ytp-th"><img src="assets/yt/'+x.id+'.jpg" alt="" loading="lazy"><i>'+ico('i-play')+'</i></span><span class="ytp-t"><b>'+esc(x.t)+'</b></span></button></li>'}).join('');
  if(anim&&window.gsap&&!reduced){gsap.fromTo('#ytpV img',{scale:1.12,opacity:.4},{scale:1,opacity:1,duration:.9,ease:'power3.out'});gsap.from('#ytpV .ytp-cap > *',{y:20,autoAlpha:0,duration:.6,stagger:.06,ease:'power3.out'});gsap.from('#ytpList li',{x:30,autoAlpha:0,duration:.5,stagger:.04,ease:'power3.out'})}
}
function ytPlay(){var v=YT[YP.tab][YP.i],box=$('#ytpV');if($('iframe',box))return;
  if(!ytFrame()){if(!$('.ytp-msg',box))box.insertAdjacentHTML('beforeend','<div class="ytp-msg"><b>El video se reproduce aquí</b><p>Esta vista previa no permite videos incrustados. En el sitio publicado, el video de YouTube se ve en este mismo recuadro.</p><a class="zbtn zbtn-light" href="https://www.youtube.com/watch?v='+v.id+'" target="_blank" rel="noopener"><span class="zbtn-t">Abrir en YouTube</span><span class="zbtn-c">'+ico('i-arrow-ur')+ico('i-arrow-ur')+'</span></a></div>');return}
  box.insertAdjacentHTML('beforeend','<iframe src="https://www.youtube-nocookie.com/embed/'+v.id+'?autoplay=1&rel=0" title="'+esc(v.t)+'" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>');box.classList.add('is-live')}
document.addEventListener('click',function(e){
  if(e.target.closest('[data-ytplay]')){ytPlay();return}
  var b=e.target.closest('[data-yti]');if(b){YP.i=+b.getAttribute('data-yti');$('#ytpV').classList.remove('is-live');renderYT(true);ytPlay();return}
  var t=e.target.closest('[data-pt]');if(t){YP.tab=t.getAttribute('data-pt');YP.i=0;$$('#ptabs [data-pt]').forEach(function(x){x.setAttribute('aria-selected',String(x===t))});moveInd('#ptabs','.ptabs-i');$('#ytpV').classList.remove('is-live');renderYT(true)}
});
document.addEventListener('securitypolicyviolation',function(e){if(/youtube/.test(e.blockedURI||'')){var f=$('#ytpV iframe');if(f)f.remove();$('#ytpV').classList.remove('is-live')}});
function moveInd(wrap,ind){var b=$(wrap+' [aria-selected="true"]'),i=$(wrap+' '+ind);if(!b||!i)return;var st={x:b.offsetLeft,width:b.offsetWidth};if(window.gsap&&!reduced)gsap.to(i,Object.assign({duration:.5,ease:'power3.out'},st));else{i.style.transform='translateX('+st.x+'px)';i.style.width=st.width+'px'}}

/* ---------- galería ---------- */
var GAL=[
 {src:'assets/video/final/p-perezosa.jpg',t:'Perezosa de tres dedos',d:'En rehabilitación',by:'Mixkit',w:'p'},
 {src:PH.ocelote.src,t:'Ocelote',d:'La especie de Sacha',pos:PH.ocelote.pos,ph:'ocelote',w:'l'},
 {src:PH.tamandua.src,t:'Oso hormiguero',d:'Herido por perros en la ciudad',pos:'50% 70%',ph:'tamandua',w:'p'},
 {src:'assets/video/final/p-buho.jpg',t:'Búho',d:'Antes de su liberación',by:'Mixkit',w:'p'},
 {src:PH.mono.src,t:'Mono aullador',d:'En recuperación',pos:PH.mono.pos,ph:'mono',w:'l'},
 {src:PH.iguana.src,t:'Iguana',d:'Fauna urbana de Guayaquil',pos:PH.iguana.pos,ph:'iguana',w:'p'},
 {src:PH.zarigueya.src,t:'Zarigüeya',d:'Inofensiva y útil',pos:PH.zarigueya.pos,ph:'zarigueya',w:'l'},
 {src:'assets/video/final/p-guacamayo.jpg',t:'Guacamayo',d:'Víctima del tráfico de aves',by:'Mixkit',w:'p'},
 {src:PH.lechuza.src,t:'Lechuza',d:'Rapaz nocturna',pos:PH.lechuza.pos,ph:'lechuza',w:'p'},
 {src:PH.manglar.src,t:'Manglar',d:'Donde vuelven a casa',pos:PH.manglar.pos,ph:'manglar',w:'l'}
];
var LB=0;
function rowHTML(list){return list.map(function(g){var i=GAL.indexOf(g);return '<figure class="loop-i ph"><button class="ph-b" data-gal="'+i+'" aria-label="Ver foto: '+esc(g.t)+'"><img src="'+g.src+'" alt="'+esc(g.t)+'" draggable="false" loading="lazy" style="object-position:'+(g.pos||'50% 50%')+'"><span class="ph-cap">'+esc(g.t)+'</span></button></figure>'}).join('')}
$('#rowT1').innerHTML=rowHTML(GAL.filter(function(g,i){return i%2===0}));
$('#rowT2').innerHTML=rowHTML(GAL.filter(function(g,i){return i%2===1}));
function credOf(g){return g.ph&&PH[g.ph]?'Foto: '+PH[g.ph].by+' · '+PH[g.ph].lic:'Imagen de referencia · '+(g.by||'')}
function openLb(i){LB=(i+GAL.length)%GAL.length;var g=GAL[LB];$('#lbxImg').src=g.src;$('#lbxImg').alt=g.t;$('#lbxCap').innerHTML='<b>'+esc(g.t)+'</b> · '+esc(g.d)+'<small>'+esc(credOf(g))+'</small>';if($('#lbx').hidden){$('#lbx').hidden=false;document.body.classList.add('lock');$('#lbxX').focus()}
  if(window.gsap&&!reduced)gsap.fromTo('#lbxImg',{scale:.94,autoAlpha:0},{scale:1,autoAlpha:1,duration:.5,ease:'power3.out'})}
function closeLb(){$('#lbx').hidden=true;document.body.classList.remove('lock')}
document.addEventListener('click',function(e){var b=e.target.closest('[data-gal]');if(b){openLb(+b.getAttribute('data-gal'));return}var n=e.target.closest('[data-lbx]');if(n){openLb(LB+ +n.getAttribute('data-lbx'));return}if(e.target.closest('#lbxX')||e.target===$('#lbx'))closeLb()});
document.addEventListener('keydown',function(e){if($('#lbx').hidden)return;if(e.key==='Escape')closeLb();if(e.key==='ArrowRight')openLb(LB+1);if(e.key==='ArrowLeft')openLb(LB-1)});
var row1=Loop($('#row1'),{speed:34}),row2=Loop($('#row2'),{speed:-34});

/* ---------- donar ----------
   Donar es general (todo el centro, eliges el destino). Apadrinar es por un paciente concreto. */
var CAUSES=[
 {t:'Alimenta una vida',d:'Su ración diaria de comida y suplementos.',ph:'zarigueya'},
 {t:'Sana sus heridas',d:'Tratamientos, analgésicos y curaciones.',ph:'tamandua'},
 {t:'Construye su camino a la libertad',d:'Encierros naturales para recuperar fuerza.',ph:'mono'},
 {t:'Libera una vida',d:'Las etapas finales y el día de la liberación.',ph:'manglar'}
];
var DAMT={u:[10,25,50,100],m:[5,10,20,50]},YEAR=350000;
var D={c:0,fq:'u',a:0,other:''};
function damt(){var o=parseInt(D.other,10);return o>0?o:D.a}
function renderDon(){
  $('#causes').innerHTML=CAUSES.map(function(c,i){var p=PH[c.ph];return '<button class="cause" role="radio" aria-checked="'+(i===D.c)+'" data-cause="'+i+'"><img src="'+p.src+'" alt="" loading="lazy" style="object-position:'+(p.pos||'50% 50%')+'"><span><b>'+esc(c.t)+'</b><small>'+esc(c.d)+'</small></span><i aria-hidden="true">'+ico('i-check')+'</i></button>'}).join('');
  $$('#donFreq [data-fq]').forEach(function(b){b.setAttribute('aria-checked',String(b.getAttribute('data-fq')===D.fq))});
  $('#amts2').innerHTML=DAMT[D.fq].map(function(a){return '<button role="radio" aria-checked="'+(!D.other&&a===D.a)+'" data-amt="'+a+'">$'+a+'</button>'}).join('');
  var a=damt(),c=CAUSES[D.c],min=Math.round(a/YEAR*525600);
  $('#donSum').innerHTML=a?'Con <b>$'+a+(D.fq==='m'?' al mes':'')+'</b> nos ayudas a <b>'+esc(c.t.charAt(0).toLowerCase()+c.t.slice(1))+'</b>: equivale a unos '+nf(min)+' minutos de cuidado en el centro.':'Cualquier monto ayuda. Elige uno si quieres ver a cuánto cuidado equivale.';
  $('#donGoT').textContent=a?'Donar $'+a+(D.fq==='m'?' al mes':''):'Ver cómo donar';
}
document.addEventListener('click',function(e){
  var c=e.target.closest('[data-cause]');if(c){D.c=+c.getAttribute('data-cause');renderDon();return}
  var f=e.target.closest('[data-fq]');if(f&&f.closest('#donFreq')){D.fq=f.getAttribute('data-fq');D.a=0;D.other='';$('#donOther').value='';renderDon();return}
  var a=e.target.closest('[data-amt]');if(a){D.a=+a.getAttribute('data-amt');D.other='';$('#donOther').value='';renderDon();return}
  var cp=e.target.closest('[data-copyv]');if(cp)copy(cp.getAttribute('data-copyv'),cp.getAttribute('data-copyv')+' copiado');
});
$('#donOther').addEventListener('input',function(){this.value=this.value.replace(/[^0-9]/g,'').slice(0,5);D.other=this.value;renderDon()});
$('#donGo').addEventListener('click',function(){var b=$('#donBank');b.innerHTML='<p class="bank-h">Por ahora recibimos transferencias; pronto, tarjeta y PayPal.</p><dl>'+BANK.map(function(r){return '<div><dt>'+esc(r[0])+'</dt><dd>'+esc(r[1])+'<button class="cpy" data-copyv="'+esc(r[1])+'" aria-label="Copiar '+esc(r[0])+'">'+ico('i-copy')+'</button></dd></div>'}).join('')+'</dl><p class="bank-n">Cuéntanos en el correo tu nombre y el destino que elegiste. Maqueta: aún no se procesa ningún pago.</p>';if(b.hidden){b.hidden=false;if(window.gsap&&!reduced)gsap.from(b,{height:0,autoAlpha:0,duration:.6,ease:'power3.out',clearProps:'height'})}});
function setTab(t){$$('#atabs [data-at]').forEach(function(b){b.setAttribute('aria-selected',String(b.getAttribute('data-at')===t))});var don=t==='don',show=don?$('#paneDon'):$('#panePad'),hide=don?$('#panePad'):$('#paneDon');moveInd('#atabs','i');if(!show.hidden)return;
  var done=function(){if(!don&&patLoop)patLoop.refill()};
  if(window.gsap&&!reduced){gsap.to(hide,{autoAlpha:0,y:-20,duration:.3,ease:'power2.in',onComplete:function(){hide.hidden=true;gsap.set(hide,{clearProps:'all'});show.hidden=false;done();gsap.fromTo(show,{autoAlpha:0,y:30},{autoAlpha:1,y:0,duration:.6,ease:'power3.out'})}})}
  else{hide.hidden=true;show.hidden=false;done()}}
$('#atabs').addEventListener('click',function(e){var b=e.target.closest('[data-at]');if(b)setTab(b.getAttribute('data-at'))});

/* ---------- apadrinar ---------- */
var PATS=[
 {n:'Meg',sp:'Ocelote',sci:'Leopardus pardalis',img:PH.ocelote.src,pos:PH.ocelote.pos,st:'Rehabilitación',pct:68,since:'5 meses en el centro',story:'Llegó como cría, en riesgo por la quema de plantaciones. Hoy aprende a cazar sola.'},
 {n:'Luna',sp:'Mona araña',sci:'Ateles fusciceps',img:PH.mono2.src,pos:PH.mono2.pos,st:'Atención médica',pct:40,since:'2 meses en el centro',story:'La mordió un caimán. Otra fundación la rescató y pidió ayuda a Sacha para operarla.'},
 {n:'Kuri',sp:'Oso hormiguero',sci:'Tamandua mexicana',img:PH.tamandua.src,pos:'50% 70%',st:'Rehabilitación',pct:54,since:'2 meses en el centro',story:'Herido por perros en la ciudad. Ya se alimenta solo y recupera fuerza para trepar.'},
 {n:'Nina',sp:'Búho',sci:'Ave rapaz nocturna',img:'assets/video/final/p-buho.jpg',st:'Preliberación',pct:90,since:'4 meses en el centro',story:'Cayó del nido siendo polluela. Ya vuela en el recinto de vuelo: falta poco.'},
 {n:'Bruma',sp:'Perezosa de tres dedos',sci:'Bradypus variegatus',img:'assets/video/final/p-perezosa.jpg',st:'Atención médica',pct:35,since:'3 semanas en el centro',story:'Encontrada junto a una vía con una fractura. Está en reposo, con controles semanales.'},
 {n:'Pepa',sp:'Zarigüeya',sci:'Didelphis marsupialis',img:PH.zarigueya.src,pos:PH.zarigueya.pos,st:'Rehabilitación',pct:72,since:'6 semanas en el centro',story:'Huérfana tras un atropello. Crece junto a sus hermanos y pronto volverá al bosque.'},
 {n:'Tito',sp:'Guacamayo',sci:'Ara ararauna',img:'assets/video/final/p-guacamayo.jpg',st:'Rehabilitación',pct:46,since:'3 meses en el centro',story:'Decomisado del tráfico con las alas cortadas. Espera a que le vuelvan a crecer.'},
 {n:'Coco',sp:'Iguana verde',sci:'Iguana iguana',img:PH.iguana.src,pos:PH.iguana.pos,st:'Preliberación',pct:85,since:'2 meses en el centro',story:'Rescatada de un techo durante las lluvias. Ya come sola y está lista para volver.'}
];
var PLANS=[{a:10,t:'Alimentación',d:'Su comida por un tiempo.'},{a:20,t:'Atención médica',d:'Medicinas y controles.'},{a:50,t:'Rehabilitación',d:'Alimento, medicinas y cuidado.'}];
var AP={i:0,plan:1,other:'',name:'',mail:'',tried:false,ok:false};
function apAmt(){var o=parseInt(AP.other,10);return o>0?o:PLANS[AP.plan].a}
$('#pat').innerHTML=PATS.map(function(p,i){return '<article class="loop-i pt"><button class="pt-f" data-ap="'+i+'" tabindex="-1" aria-hidden="true"><img src="'+p.img+'" alt="" draggable="false" loading="lazy" style="object-position:'+(p.pos||'50% 30%')+'"></button><div class="pt-b"><small>'+esc(p.sp)+'</small><h3>'+esc(p.n)+'</h3><p>'+esc(p.story)+'</p><button class="zbtn zbtn-ghost pt-go" data-ap="'+i+'"><span class="zbtn-t">Apadrinar a '+esc(p.n)+'</span><span class="zbtn-c">'+ico('i-arrow-ur')+ico('i-arrow-ur')+'</span></button></div></article>'}).join('');
var patLoop=Loop($('#patLoop'),{speed:30});
function renderAp(){
  var p=PATS[AP.i],a=apAmt(),el=$('#ap');$('#apDrT').textContent='Apadrina a '+p.n;
  if(AP.ok){el.innerHTML='<div class="ap-ok"><span class="ap-ok-i">'+ico('i-check')+'</span><h3>Gracias, '+esc(AP.name.split(' ')[0])+'.</h3><p>Tu aporte de $'+a+' ayudará a cuidar a <b>'+esc(p.n)+'</b>. Te escribiremos a '+esc(AP.mail)+' con los datos para completar la donación.</p><p class="ap-note">Maqueta: todavía no se cobra ni se envía ningún correo.</p><button class="zbtn" data-drclose><span class="zbtn-t">Volver al sitio</span><span class="zbtn-c">'+ico('i-arrow-ur')+ico('i-arrow-ur')+'</span></button></div>';return}
  el.innerHTML='<div class="ap-h"><img src="'+p.img+'" alt="" style="object-position:'+(p.pos||'50% 30%')+'"><div><small>'+esc(p.sp)+'</small><b>'+esc(p.n)+'</b><p>'+esc(p.story)+'</p></div></div>'+
   '<p class="ap-k">Elige con cuánto quieres ayudar</p><div class="ap-plans" role="radiogroup" aria-label="Monto del apadrinamiento">'+PLANS.map(function(x,i){return '<button role="radio" aria-checked="'+(!AP.other&&i===AP.plan)+'" data-plan="'+i+'"><b>$'+x.a+'</b><span>'+esc(x.t)+'</span><em>'+esc(x.d)+'</em></button>'}).join('')+'</div>'+
   '<label class="other ap-other"><span>Otro monto</span><input id="apOther" inputmode="numeric" placeholder="$" autocomplete="off" value="'+esc(AP.other)+'"></label>'+
   '<form id="apForm" novalidate><div class="fields">'+fld('apName','Tu nombre *','<input id="apName" autocomplete="name" value="'+esc(AP.name)+'">',AP.tried&&!AP.name.trim(),'Escribe tu nombre')+fld('apMail','Tu correo *','<input id="apMail" type="email" autocomplete="email" value="'+esc(AP.mail)+'">',AP.tried&&!validMail(AP.mail),'Escribe un correo válido, por ejemplo nombre@correo.com')+'</div>'+
   '<button class="zbtn ap-go" type="submit"><span class="zbtn-t">Apadrinar a '+esc(p.n)+' con $'+a+'</span><span class="zbtn-c">'+ico('i-arrow-ur')+ico('i-arrow-ur')+'</span></button><p class="ap-note">El apadrinamiento es simbólico: '+esc(p.n)+' no se puede visitar ni entregar. Tu aporte ayuda a cubrir su cuidado en el centro.</p></form>';
}
function openAp(i){AP.i=i;AP.ok=false;AP.tried=false;renderAp();openDr('apDr')}
document.addEventListener('input',function(e){if(e.target.id!=='apOther')return;var v=e.target.value.replace(/[^0-9]/g,'').slice(0,5);e.target.value=v;AP.other=v;$$('#ap [data-plan]').forEach(function(b){b.setAttribute('aria-checked',String(!v&&+b.getAttribute('data-plan')===AP.plan))});var t=$('#ap .ap-go .zbtn-t');if(t)t.textContent='Apadrinar a '+PATS[AP.i].n+' con $'+apAmt()});
document.addEventListener('click',function(e){var b=e.target.closest('[data-ap]');if(b){openAp(+b.getAttribute('data-ap'));return}var pl=e.target.closest('[data-plan]');if(pl){AP.name=($('#apName')||{}).value||AP.name;AP.mail=($('#apMail')||{}).value||AP.mail;AP.plan=+pl.getAttribute('data-plan');AP.other='';renderAp();var n=$('[data-plan="'+AP.plan+'"]');if(n)n.focus()}});
document.addEventListener('submit',function(e){if(e.target.id!=='apForm')return;e.preventDefault();AP.name=$('#apName').value;AP.mail=$('#apMail').value;AP.other=($('#apOther')||{}).value||AP.other;AP.tried=true;if(!AP.name.trim()||!validMail(AP.mail)){renderAp();var bad=!AP.name.trim()?$('#apName'):$('#apMail');if(bad)bad.focus();return}AP.ok=true;renderAp()});

/* ---------- redes ---------- */
var SOC={instagram:'i-ig',tiktok:'i-tt',youtube:'i-yt',facebook:'i-fb'};
$('#zSoc').innerHTML=Object.keys(NETS).map(function(k){var n=NETS[k];return '<a href="'+(n.url||'#contacto')+'" data-follow="'+k+'" target="'+(n.url?'_blank':'_self')+'" rel="noopener" aria-label="'+n.name+'">'+ico(SOC[k])+'</a>'}).join('');

renderReels();renderYT(false);renderDon();onScroll();
window.__sacha={R:R,gal:row1,pat:patLoop};
addEventListener('load',function(){layoutReels();moveInd('#ptabs','.ptabs-i');moveInd('#atabs','i')});
var rz2=0;addEventListener('resize',function(){clearTimeout(rz2);rz2=setTimeout(function(){moveInd('#ptabs','.ptabs-i');moveInd('#atabs','i')},150)});


/* ======================  ANIMACIONES (GSAP + ScrollTrigger + SplitText + Lenis)  ======================
   Cada sección aparece mientras se hace scroll (ligada al desplazamiento, no de golpe) y se despide al salir.
   Secciones fijas: el video institucional (la ventana se abre entre dos palabras y al terminar se reproduce) y
   «Cómo trabajamos» (las etapas se apilan). La historia avanza año por año. Las animaciones siempre están activas.
   Si el marco de la vista previa no tiene scroll propio, las secciones fijas se muestran completas. */
var M={scrolls:false};
function onView(el,fn,o){if(!el)return;var list=el.length!==undefined?el:[el];if(!canIO){list.forEach(fn);return}o=o||{};var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);fn(e.target)}})},{rootMargin:o.margin||'0px 0px -12% 0px',threshold:o.th||0});list.forEach(function(x){io.observe(x)})}
function countTo(el,dur){var to=+el.getAttribute('data-count'),pre=el.getAttribute('data-pre')||'',o={v:0};if(!window.gsap||reduced){el.textContent=pre+nf(to);return}gsap.to(o,{v:to,duration:dur||1.8,ease:'power2.out',onUpdate:function(){el.textContent=pre+nf(o.v)}})}

function initMotion(){
  if(!window.gsap||reduced){var pe=$('#pre');if(pe){pe.hidden=true;document.documentElement.classList.remove('pre-on')}document.documentElement.classList.add('zstatic');setTl(TL.length-1);autoVid(iv,.3);return}
  gsap.registerPlugin(ScrollTrigger,window.SplitText);
  M.scrolls=document.documentElement.scrollHeight-innerHeight>400;
  var de=document.documentElement;de.classList.add('zmo');de.classList.toggle('noscroll',!M.scrolls);
  var wide=innerWidth>=900,fine=matchMedia('(pointer:fine)').matches;
  /* scrub: animación ligada al scroll; si no hay scroll propio, se reproduce al aparecer */
  function scrubIn(el,from,to,cfg){if(!el)return;if(M.scrolls)return gsap.fromTo(el,from,Object.assign({},to,{ease:'none',scrollTrigger:Object.assign({trigger:el,start:'top 96%',end:'top 52%',scrub:.8},cfg||{})}));gsap.set(el,from);onView(el,function(){gsap.to(el,Object.assign({},to,{duration:1.2,ease:'power3.out'}))})}

  /* desplazamiento suave */
  if(M.scrolls&&window.Lenis&&fine){
    var lenis=new Lenis({lerp:.1,smoothWheel:true});window.__lenis=lenis;
    lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(function(t){lenis.raf(t*1000)});gsap.ticker.lagSmoothing(0);
    $$('.ficha,.story,.lbx,.zmenu').forEach(function(x){x.setAttribute('data-lenis-prevent','')});
    new MutationObserver(function(){if(document.body.classList.contains('lock'))lenis.stop();else lenis.start()}).observe(document.body,{attributes:true,attributeFilter:['class']});
  }

  if($('#pre')){if(window.__lenis)__lenis.stop();onPreDone(function(){if(window.__lenis)__lenis.start()})}

  /* ---- portada: la imagen queda fija; el texto entra ---- */
  var lines=$$('#hxT > span');lines.forEach(function(l){l.innerHTML='<span class="hx-li">'+l.innerHTML+'</span>'});
  var tl=gsap.timeline({paused:true,defaults:{ease:'power4.out'}});onPreDone(function(){tl.play()});
  tl.from('#zh .zh-in > *',{y:-30,autoAlpha:0,duration:.9,stagger:.08},.1)
    .from('#hxEye',{y:24,autoAlpha:0,duration:.8},.35)
    .from('#hxT .hx-li',{yPercent:110,duration:1.2,stagger:.14},.45)
    .from('#hxP',{y:30,autoAlpha:0,duration:1},.9)
    .from('#hxAct > *',{y:30,autoAlpha:0,duration:.9,stagger:.1},1.05)
    .from('.hx-cue',{autoAlpha:0,duration:.8},1.5);
  if(M.scrolls){gsap.to('.hx-copy',{y:-100,autoAlpha:0,ease:'none',scrollTrigger:{trigger:'#inicio',start:'top top',end:'70% top',scrub:true}});}

  /* ---- video institucional: la ventana se abre entre dos palabras; al terminar, se reproduce ---- */
  if(M.scrolls){
    de.classList.add('imm-on');
    var small=wide?'inset(35% 31% 18% 31% round 24px)':'inset(38% 8% 30% 8% round 18px)';
    var playing=false;
    var it=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:'#video',start:'top top',end:'+=160%',pin:'#immPin',scrub:.6,anticipatePin:1,
      onUpdate:function(s){if(s.progress>.97&&!playing){playing=true;ivPlay()}else if(s.progress<.9&&playing){playing=false;ivStop()}}}});
    it.fromTo('#immFrame',{clipPath:small},{clipPath:'inset(0% 0% 0% 0% round 0px)',duration:2,ease:'power1.in'},0)
      .fromTo('#immVid',{scale:1.2},{scale:1,duration:2},0)
      .fromTo('#immWL',{x:0},{x:-160,autoAlpha:0,duration:.75,ease:'power2.in'},0)
      .fromTo('#immWR',{x:0},{x:160,autoAlpha:0,duration:.75,ease:'power2.in'},0)
      .fromTo('#immCtl',{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.4},1.8)
      .to({},{duration:.3});
    gsap.from('.imm-w',{y:60,autoAlpha:0,duration:1.1,stagger:.14,ease:'power3.out',scrollTrigger:{trigger:'#video',start:'top 75%',once:true}});
    gsap.from('#immFrame',{y:80,duration:1.2,ease:'power3.out',scrollTrigger:{trigger:'#video',start:'top 80%',once:true}});
  }else{
    de.classList.add('imm-static');autoVid(iv,.3);gsap.from('.imm-w',{y:30,autoAlpha:0,duration:1,stagger:.12,ease:'power3.out',scrollTrigger:{trigger:'#video',start:'top 80%',once:true}});
    onView($('#immFrame'),function(){gsap.fromTo('#immFrame',{clipPath:'inset(8% 8% 8% 8% round 24px)'},{clipPath:'inset(0% 0% 0% 0% round 24px)',duration:1.4,ease:'power4.inOut'})});
  }

  /* ---- títulos: las líneas suben y aparecen (sin máscara, así no se cortan letras como g, p o y) ---- */
  function splitHeads(){$$('.zt').forEach(function(el){if(el.closest('#immHead'))return;
    SplitText.create(el,{type:'lines',linesClass:'zline',autoSplit:true,onSplit:function(self){return gsap.from(self.lines,{y:40,autoAlpha:0,duration:1,ease:'power3.out',stagger:.1,scrollTrigger:{trigger:el,start:'top 88%',once:true}})}})})}
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){splitHeads();ScrollTrigger.refresh()});else splitHeads();
  gsap.set('.lbl',{autoAlpha:0,y:16});onView($$('.lbl'),function(el){gsap.to(el,{autoAlpha:1,y:0,duration:.8,ease:'back.out(1.6)'})});
  gsap.set('.sh-p,.hist-lead',{autoAlpha:0,y:30});onView($$('.sh-p,.hist-lead'),function(el){gsap.to(el,{autoAlpha:1,y:0,duration:1,ease:'power3.out',delay:.2})});

  /* ---- historia ---- */
  var tis=$$('.tl-i');
  scrubIn($('.hist-l'),{x:-80,autoAlpha:0},{x:0,autoAlpha:1});
  if(M.scrolls){
    gsap.fromTo('#tlFill',{scaleY:0},{scaleY:1,ease:'none',scrollTrigger:{trigger:'#tl',start:'top 60%',end:'bottom 60%',scrub:true}});
    tis.forEach(function(li,i){ScrollTrigger.create({trigger:li,start:'top 62%',onEnter:function(){setTl(i)},onLeaveBack:function(){setTl(Math.max(0,i-1))}});
      gsap.fromTo(li,{x:60,autoAlpha:0},{x:0,autoAlpha:1,ease:'none',scrollTrigger:{trigger:li,start:'top 95%',end:'top 70%',scrub:.6}})});
    setTl(0);
  }else{setTl(TL.length-1);gsap.set('#tlFill',{scaleY:1})}
  gsap.set('#histCard img',{yPercent:25,autoAlpha:0});
  onView($('#histCard'),function(){gsap.to('#histCard img',{yPercent:0,autoAlpha:1,duration:1.2,ease:'back.out(1.4)',delay:.2})});
  scrubIn($('#kpis'),{y:80,autoAlpha:0},{y:0,autoAlpha:1});
  onView($('#kpis'),function(){$$('#kpis [data-count]').forEach(function(b){countTo(b,1.8)})});

  /* ---- cómo trabajamos: la sección entra como telón y las etapas se apilan ---- */
  var pcs=$$('.pcard');
  if(M.scrolls&&wide){
    de.classList.add('proc-on');
    gsap.set(pcs.slice(1),{yPercent:110});
    var pt=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:'#proceso',start:'top top',end:'+='+(pcs.length*70)+'%',pin:'#procPin',scrub:.6,anticipatePin:1,
      onUpdate:function(s){setProc(Math.min(pcs.length-1,Math.floor(s.progress*pcs.length*0.999)));procFill(s.progress)}}});
    window.__procST=pt.scrollTrigger;
    pcs.forEach(function(c,i){if(!i)return;pt.to(c,{yPercent:0,duration:1,ease:'power2.inOut'},i-1).to(pcs[i-1],{scale:.9,autoAlpha:.4,duration:1},i-1).fromTo($('img',c),{scale:1.25},{scale:1,duration:1},i-1)});
    pt.to({},{duration:.5});
    gsap.from('.proc-l > *',{x:-60,autoAlpha:0,duration:1,stagger:.1,ease:'power3.out',scrollTrigger:{trigger:'#proceso',start:'top 60%',once:true}});
    gsap.from('#procCards',{x:120,autoAlpha:0,duration:1.2,ease:'power3.out',scrollTrigger:{trigger:'#proceso',start:'top 60%',once:true}});
  }else{pcs.forEach(function(c){scrubIn(c,{y:80,autoAlpha:0,scale:.95},{y:0,autoAlpha:1,scale:1})})}

  /* ---- reels: el bloque oscuro se abre y el carrusel entra girando ---- */
  /* el bloque oscuro entra con un velo que sube (sin recortar la sección completa, que es costoso) */

  scrubIn($('#reelsT2'),{rotationY:-30,x:300,autoAlpha:0,transformPerspective:1600},{rotationY:0,x:0,autoAlpha:1},{trigger:'#krl',start:'top 100%',end:'top 45%'});

  /* ---- podcast: el panel crece y el reproductor se descubre ---- */
  scrubIn($('.podx'),{scale:.86,y:100,autoAlpha:.2,borderRadius:72},{scale:1,y:0,autoAlpha:1,borderRadius:28},{start:'top 100%',end:'top 35%'});
  gsap.set('#ytpV',{clipPath:'inset(0% 0% 100% 0% round 18px)'});gsap.set('.ytp-list li',{x:50,autoAlpha:0});
  onView($('#ytp'),function(){gsap.to('#ytpV',{clipPath:'inset(0% 0% 0% 0% round 18px)',duration:1.3,ease:'power4.inOut',clearProps:'clipPath'});gsap.to('.ytp-list li',{x:0,autoAlpha:1,duration:.8,stagger:.07,ease:'power3.out',delay:.3})});
  onView($('#ptabs'),function(){moveInd('#ptabs','.ptabs-i')});

  /* ---- galería: la banda con textura se despliega y las fotos caen en su lugar ---- */
  scrubIn($('#row1'),{x:-160,autoAlpha:0},{x:0,autoAlpha:1},{trigger:'#rows',start:'top 100%',end:'top 55%'});
  scrubIn($('#row2'),{x:160,autoAlpha:0},{x:0,autoAlpha:1},{trigger:'#rows',start:'top 95%',end:'top 50%'});

  /* ---- dona y apadrina ---- */
  scrubIn($('#donCard'),{x:-90,autoAlpha:0,rotation:-2},{x:0,autoAlpha:1,rotation:0});
  scrubIn($('.don-form'),{x:90,autoAlpha:0},{x:0,autoAlpha:1});
  gsap.set('#donCard img',{yPercent:30,autoAlpha:0});gsap.set('#donCard .mcard-txt > *',{y:30,autoAlpha:0});
  onView($('#donCard'),function(){gsap.to('#donCard .mcard-txt > *',{y:0,autoAlpha:1,duration:.9,stagger:.08,ease:'power3.out',delay:.2});gsap.to('#donCard img',{yPercent:0,autoAlpha:1,duration:1.2,ease:'back.out(1.3)',delay:.5})});
  gsap.set('.cause',{y:30,autoAlpha:0});onView($('#causes'),function(){gsap.to('.cause',{y:0,autoAlpha:1,duration:.7,stagger:.07,ease:'power3.out'})});
  onView($('#atabs'),function(){moveInd('#atabs','i')});

  /* ---- si encuentras un animal ---- */
  var es=$$('#encSteps li');
  es.forEach(function(li,i){scrubIn(li,{x:-70,autoAlpha:0},{x:0,autoAlpha:1},{start:'top 98%',end:'top 70%'});if(M.scrolls)gsap.fromTo($('i',li),{scale:.5,rotate:-40},{scale:1,rotate:0,ease:'none',scrollTrigger:{trigger:li,start:'top 95%',end:'top 70%',scrub:.6}})});
  scrubIn($('#encR'),{x:100,autoAlpha:0,rotation:3},{x:0,autoAlpha:1,rotation:0});
  gsap.set('#encR img',{yPercent:20,autoAlpha:0});onView($('#encR'),function(){gsap.to('#encR img',{yPercent:0,autoAlpha:1,duration:1.2,ease:'back.out(1.3)',delay:.3})});

  /* ---- pie ---- */
  scrubIn($('.zfoot-in'),{y:100,autoAlpha:0},{y:0,autoAlpha:1},{trigger:'.zfoot',start:'top 100%',end:'top 50%'});

  /* ---- salidas: los encabezados se despiden al salir por arriba (se crean al final para medir bien) ---- */
  addEventListener('load',function(){ScrollTrigger.refresh()});var rt=0;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){ScrollTrigger.refresh()},200)});
}
initMotion();

document.documentElement.classList.add('ready');
})();
