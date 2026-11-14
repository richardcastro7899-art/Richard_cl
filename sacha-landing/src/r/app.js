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
if(reduced&&animForced()){reduced=false;document.documentElement.classList.add('anim-on')}
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


/* ======================  SACHA ZAIZOO · VERSIÓN SOBRIA  ======================
   La composición gira alrededor de los videos: video de portada, video institucional con scroll inmersivo,
   reels verticales, podcast y casos en YouTube, y una galería de fotos que se recorre en horizontal.
   CONTENIDO EDITABLE: líneas del video en IMM, videos de YouTube en YT, fotos en GAL, causas de donación en CAUSES,
   montos en DAMT, pacientes para apadrinar en PATS. */
VIDEOS.caps=[0,1,2,3,4,5,6,7].map(function(i){return 'assets/video/final/r'+i+'.mp4'});
(function(){var t=document.createElement('video');if(t.canPlayType&&!t.canPlayType('video/mp4; codecs="avc1.42E01E"'))VIDEOS.caps=VIDEOS.caps.map(function(u){return u.replace('.mp4','.webm')})})();
NETS.instagram.url='https://www.instagram.com/proyectosacha/';NETS.instagram.handle='@proyectosacha';
NETS.youtube.url='https://www.youtube.com/@proyectosacha3474';NETS.youtube.handle='@proyectosacha3474';
BANK=[['Banco','Banco Internacional'],['Cuenta corriente','1400625249'],['A nombre de','Fundación Proyecto Sacha'],['RUC','0993242721001'],['Correo','donaciones.tc@proyectosacha.org']];

/* ---------- navegación ---------- */
var HDRH=76;
function hdrH(){var z=$('#zh');return z?z.offsetHeight:HDRH}
function closeMenu(){var m=$('#zMenu');if(!m)return;m.hidden=true;$('#zBurger').setAttribute('aria-expanded','false');document.documentElement.classList.remove('menu-open')}
$('#zBurger').addEventListener('click',function(){var o=$('#zMenu').hidden;$('#zMenu').hidden=!o;this.setAttribute('aria-expanded',String(o));document.documentElement.classList.toggle('menu-open',o)});
function go(id){closeMenu();var el=document.getElementById(id);if(!el)return;
  var target=id==='inicio'?0:el;
  if(window.__lenis){window.__lenis.scrollTo(target,{offset:id==='video'?0:-hdrH()+1,duration:1.4});return}
  var y=id==='inicio'?0:Math.max(0,el.getBoundingClientRect().top+scrollY-(id==='video'?0:hdrH())+1);window.scrollTo({top:y,behavior:reduced?'auto':'smooth'})}
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMenu()});
var SPY=['video','nosotros','reels','podcast','galeria','ayuda','encuentras'],lastA='__';
function onScroll(){
  var H=document.documentElement.scrollHeight-innerHeight,a=null;
  $('#zProg').style.transform='scaleX('+(H>0?Math.min(1,scrollY/H):0).toFixed(4)+')';
  $('#zh').classList.toggle('is-s',scrollY>40);
  SPY.forEach(function(id){var el=document.getElementById(id);if(el&&el.getBoundingClientRect().top<=hdrH()+160)a=id});
  if(a==='encuentras')a='ayuda';
  if(a!==lastA){lastA=a;$$('#znav a').forEach(function(l){l.setAttribute('aria-current',l.getAttribute('data-go')===a?'true':'false')})}
}
addEventListener('scroll',function(){if(!onScroll.r){onScroll.r=requestAnimationFrame(function(){onScroll.r=0;onScroll()})}},{passive:true});
document.addEventListener('click',function(e){
  var a=e.target.closest('a[href="#"]');if(a&&!a.hasAttribute('data-follow'))e.preventDefault();
  var f=e.target.closest('a[href^="#"][data-go]');if(f)e.preventDefault();
  var at=e.target.closest('[data-at-go]');if(at)setTab(at.getAttribute('data-at-go'));
});

/* ---------- videos que se reproducen solos cuando están en pantalla ---------- */
function autoVid(v,th){if(!v)return;var play=function(){var p=v.play();if(p&&p.catch)p.catch(function(){})};if(reduced){v.removeAttribute('autoplay');return}
  if(!canIO){play();return}new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){if(!v.__userPaused)play()}else v.pause()})},{threshold:th||.15}).observe(v)}
autoVid($('#zhVid'));
$('#zhAva').insertAdjacentHTML('afterbegin',['ocelote','zarigueya','tamandua','lechuza'].map(function(k){var p=PH[k];return '<img src="'+p.src+'" alt="" loading="lazy" style="object-position:'+(p.pos||'50% 50%')+'">'}).join(''));

/* ---------- video institucional con scroll inmersivo ----------
   Las líneas son del guion del tráiler «Un día en Sacha»; cada una aparece en su tramo del recorrido. */
var IMM=[
 {t:'Cada día empieza con alguien que necesita cuidado.',k:'Amanecer en el centro'},
 {t:'Preparamos su alimento y atendemos sus necesidades.',k:'Cocina y clínica'},
 {t:'El rescate no termina al llegar. Ahí empieza el cuidado.',k:'Quirófano'},
 {t:'Cada animal necesita atención y tiempo.',k:'Recuperación'}
];
var iv=$('#immVid');
$('#immLines').innerHTML=IMM.map(function(l,i){return '<p class="imm-l" data-i="'+i+'"><small>'+pad2(i+1)+' · '+esc(l.k)+'</small><span>'+esc(l.t)+'</span></p>'}).join('');
autoVid(iv,.05);
function immSound(){var on=iv.muted;iv.muted=!on;if(on){iv.loop=false;try{iv.currentTime=0}catch(e){}iv.__userPaused=false;var p=iv.play();if(p&&p.catch)p.catch(function(){})}else iv.loop=true;
  $('#immSndT').textContent=iv.muted?'Ver con sonido':'Silenciar';$('#immSnd .imm-snd-i').innerHTML=ico(iv.muted?'i-vol':'i-mute');$('#immFrame').classList.toggle('is-sound',!iv.muted)}
$('#immSnd').addEventListener('click',immSound);
iv.addEventListener('timeupdate',function(){if(iv.duration)$('#immBar').style.width=(iv.currentTime/iv.duration*100)+'%'});
iv.addEventListener('ended',function(){iv.muted=true;iv.loop=true;$('#immSndT').textContent='Ver con sonido';$('#immSnd .imm-snd-i').innerHTML=ico('i-vol');$('#immFrame').classList.remove('is-sound');var p=iv.play();if(p&&p.catch)p.catch(function(){})});

/* ---------- cómo trabajamos (cuatro etapas, compacto) ---------- */
$('#steps').innerHTML='<p class="steps-h">Así trabajamos con cada animal</p>'+STEPS.map(function(s,i){var p=PH[s.ph];return '<article class="stp"><figure class="zimg"><img src="'+p.src+'" alt="" loading="lazy" style="object-position:'+(p.pos||'50% 50%')+'"></figure><span class="stp-n">'+pad2(i+1)+'</span><h3>'+esc(s.title)+'</h3><p>'+esc(s.text)+'</p></article>'}).join('');

/* ---------- reels: carrusel con la tarjeta central nítida ---------- */
var R={i:0,list:[],timer:0,inView:false,prog:0};
function renderChips(){$('#capChips').innerHTML=[{n:'Todos',k:-1}].concat(EJES.map(function(e,i){return {n:e.name,k:i}})).map(function(x){return '<button role="tab" aria-selected="'+(C.tab===x.k)+'" data-capt="'+x.k+'">'+esc(x.n)+'</button>'}).join('')}
function renderReels(){R.list=capList();
  $('#reelsT2').innerHTML=R.list.map(function(ci,k){var c=CAPS[ci],n=NETS[c.net];return '<button class="reel" data-cursor="Ver" data-rk="'+k+'" aria-label="Ver el reel '+(ci+1)+': '+esc(c.pre+' '+c.title)+'">'+
    '<video muted loop playsinline preload="none" poster="assets/video/final/r'+ci+'.jpg"><source src="assets/video/final/r'+ci+'.mp4" type="video/mp4"><source src="assets/video/final/r'+ci+'.webm" type="video/webm"></video>'+
    '<span class="reel-bars"><i><b></b></i></span><span class="reel-top"><span class="reel-n">'+pad2(ci+1)+'</span><span class="reel-net">'+esc(n.name)+'</span></span>'+
    '<span class="reel-b"><small>'+esc(EJES[c.tab].name)+' · '+fmt(c.dur)+'</small><b>'+esc(c.pre)+' '+esc(c.title)+'</b><em>'+ico('i-play')+'Ver reel</em></span></button>'}).join('');
  $('#reelDots').innerHTML=R.list.map(function(){return '<i></i>'}).join('');R.i=Math.max(0,Math.min(R.i,R.list.length-1));layoutReels(true)}
function layoutReels(instant){
  var cards=$$('.reel'),W=innerWidth,cw=cards[0]?cards[0].offsetWidth:280,gap=Math.min(36,W*.03);
  cards.forEach(function(el,k){var n=cards.length,d=k-R.i;if(d>n/2)d-=n;if(d<-n/2)d+=n;var ad=Math.abs(d),
    x=d*(cw*.82+gap),rot=ad?(d>0?-18:18):0,sc=ad?Math.max(.74,.9-.06*(ad-1)):1,bl=ad?Math.min(6,1+ad*1.6):0,op=ad>3?0:(ad?1-.2*ad:1);
    if(W<700){x=d*(cw+14);rot=0;sc=ad?.92:1;bl=ad?2:0;op=ad>1?0:1}
    var st={x:x,rotationY:rot,scale:sc,filter:'blur('+bl+'px)',opacity:op,zIndex:20-ad};
    if(window.gsap&&!reduced&&!instant)gsap.to(el,Object.assign({duration:.8,ease:'power3.out',overwrite:true},st));else if(window.gsap)gsap.set(el,st);
    else{el.style.transform='translateX('+x+'px) rotateY('+rot+'deg) scale('+sc+')';el.style.filter='blur('+bl+'px)';el.style.opacity=op;el.style.zIndex=20-ad}
    el.classList.toggle('is-on',d===0);el.setAttribute('tabindex',ad<=1?'0':'-1');el.setAttribute('aria-hidden',ad>2?'true':'false');
    var v=$('video',el);if(d===0&&R.inView&&!reduced){try{v.currentTime=0}catch(e){}var p=v.play();if(p&&p.catch)p.catch(function(){})}else v.pause()});
  $$('#reelDots i').forEach(function(d,k){d.classList.toggle('on',k===R.i)})}
function reelGo(d){if(!R.list.length)return;R.i=(R.i+d+R.list.length)%R.list.length;R.prog=0;layoutReels()}
function reelAuto(){clearInterval(R.timer);if(reduced)return;var t0=Date.now(),D=6000;R.timer=setInterval(function(){if(!R.inView||ST.open||document.hidden){t0=Date.now()-R.prog*D;return}var r=(Date.now()-t0)/D;R.prog=r;var b=$('.reel.is-on .reel-bars b');if(b)b.style.width=Math.min(100,r*100)+'%';if(r>=1){t0=Date.now();R.prog=0;reelGo(1)}},60)}
$('#reelPrev').addEventListener('click',function(){reelGo(-1);reelAuto()});$('#reelNext').addEventListener('click',function(){reelGo(1);reelAuto()});
$('#reelsT2').addEventListener('click',function(e){var b=e.target.closest('[data-rk]');if(!b)return;var k=+b.getAttribute('data-rk');if(k!==R.i){R.i=k;layoutReels();reelAuto()}else openStory(R.list[k])});
$('#capChips').addEventListener('click',function(e){var b=e.target.closest('[data-capt]');if(!b)return;C.tab=+b.getAttribute('data-capt');R.i=0;renderChips();renderReels();reelAuto()});
(function(){var sx=0,dx=0,on=false,el=$('#krl');el.addEventListener('pointerdown',function(e){on=true;sx=e.clientX;dx=0});addEventListener('pointerup',function(){if(!on)return;on=false;if(Math.abs(dx)>50){reelGo(dx<0?1:-1);reelAuto()}});addEventListener('pointermove',function(e){if(on)dx=e.clientX-sx},{passive:true});el.addEventListener('click',function(e){if(Math.abs(dx)>8){e.stopPropagation();e.preventDefault()}},true)})();
if(canIO)new IntersectionObserver(function(es){es.forEach(function(e){R.inView=e.isIntersecting;layoutReels(true)})},{threshold:.3}).observe($('#krl'));else R.inView=true;
document.addEventListener('keydown',function(e){if(e.target.closest&&e.target.closest('#krl')){if(e.key==='ArrowRight'){reelGo(1);reelAuto()}if(e.key==='ArrowLeft'){reelGo(-1);reelAuto()}}});

/* ---------- podcast y casos: videos de YouTube incrustados ----------
   Para cambiar un episodio, reemplaza el id (lo que va después de «v=» en YouTube). */
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
  $('#ytpV').innerHTML='<img src="assets/yt/'+v.id+'.jpg" alt=""><span class="ytp-ov"></span><button class="ytp-play" data-ytplay aria-label="Reproducir: '+esc(v.t)+'">'+ico('i-play')+'</button><div class="ytp-cap"><small>'+esc(v.k)+(v.d?' · '+v.d:'')+'</small><b>'+esc(v.t)+'</b><span>'+esc(v.by)+' · YouTube</span></div>';
  $('#ytpList').innerHTML=L.map(function(x,i){return '<li><button data-yti="'+i+'" aria-current="'+(i===YP.i)+'"><span class="ytp-th"><img src="assets/yt/'+x.id+'.jpg" alt="" loading="lazy"><i>'+ico('i-play')+'</i></span><span class="ytp-t"><small>'+esc(x.k)+(x.d?' · '+x.d:'')+'</small><b>'+esc(x.t)+'</b><em>'+esc(x.by)+'</em></span></button></li>'}).join('');
  if(anim&&window.gsap&&!reduced){gsap.fromTo('#ytpV img',{scale:1.12,opacity:.4},{scale:1,opacity:1,duration:.9,ease:'power3.out'});gsap.from('#ytpV .ytp-cap > *',{y:20,autoAlpha:0,duration:.6,stagger:.06,ease:'power3.out'})}
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

/* ---------- galería: fotos de recurso ---------- */
var GAL=[
 {src:'assets/video/final/p-perezosa.jpg',t:'Perezosa de tres dedos',d:'Rehabilitación',by:'Mixkit',w:'p'},
 {src:PH.ocelote.src,t:'Ocelote',d:'La especie de Sacha',pos:PH.ocelote.pos,ph:'ocelote',w:'l'},
 {src:PH.tamandua.src,t:'Oso hormiguero',d:'Herido por perros en la ciudad',pos:'50% 70%',ph:'tamandua',w:'p'},
 {src:'assets/video/final/p-buho.jpg',t:'Búho',d:'Preliberación',by:'Mixkit',w:'p'},
 {src:PH.mono.src,t:'Mono aullador',d:'Rehabilitación',pos:PH.mono.pos,ph:'mono',w:'l'},
 {src:PH.iguana.src,t:'Iguana',d:'Fauna urbana de Guayaquil',pos:PH.iguana.pos,ph:'iguana',w:'p'},
 {src:PH.zarigueya.src,t:'Zarigüeya',d:'Inofensiva y útil',pos:PH.zarigueya.pos,ph:'zarigueya',w:'l'},
 {src:'assets/video/final/p-guacamayo.jpg',t:'Guacamayo',d:'Tráfico de aves',by:'Mixkit',w:'p'},
 {src:PH.lechuza.src,t:'Lechuza',d:'Rapaz nocturna',pos:PH.lechuza.pos,ph:'lechuza',w:'p'},
 {src:PH.manglar.src,t:'Manglar',d:'Donde vuelven a casa',pos:PH.manglar.pos,ph:'manglar',w:'l'}
];
var LB=0;
$('#galTrack').innerHTML=GAL.map(function(g,i){return '<figure class="gi gi-'+g.w+'"><button class="gi-b" data-cursor="Ampliar" data-gal="'+i+'" aria-label="Ampliar foto: '+esc(g.t)+'"><img src="'+g.src+'" alt="'+esc(g.t)+'" loading="lazy" style="object-position:'+(g.pos||'50% 50%')+'"></button><figcaption><span>'+pad2(i+1)+'</span><b>'+esc(g.t)+'</b><em>'+esc(g.d)+'</em></figcaption></figure>'}).join('');
function credOf(g){return g.ph&&PH[g.ph]?'Foto: '+PH[g.ph].by+' · '+PH[g.ph].lic:'Imagen de referencia · '+(g.by||'')}
function openLb(i){LB=(i+GAL.length)%GAL.length;var g=GAL[LB];$('#lbxImg').src=g.src;$('#lbxImg').alt=g.t;$('#lbxCap').innerHTML='<b>'+esc(g.t)+'</b> · '+esc(g.d)+'<small>'+esc(credOf(g))+'</small>';if($('#lbx').hidden){$('#lbx').hidden=false;document.body.classList.add('lock');$('#lbxX').focus()}
  if(window.gsap&&!reduced)gsap.fromTo('#lbxImg',{scale:.94,autoAlpha:0},{scale:1,autoAlpha:1,duration:.5,ease:'power3.out'})}
function closeLb(){$('#lbx').hidden=true;document.body.classList.remove('lock')}
document.addEventListener('click',function(e){var b=e.target.closest('[data-gal]');if(b){openLb(+b.getAttribute('data-gal'));return}var n=e.target.closest('[data-lbx]');if(n){openLb(LB+ +n.getAttribute('data-lbx'));return}if(e.target.closest('#lbxX')||e.target===$('#lbx'))closeLb()});
document.addEventListener('keydown',function(e){if($('#lbx').hidden)return;if(e.key==='Escape')closeLb();if(e.key==='ArrowRight')openLb(LB+1);if(e.key==='ArrowLeft')openLb(LB-1)});

/* ---------- apadrina y dona ---------- */
var CAUSES=[
 {id:'alimenta',t:'Alimenta una vida',d:'La ración diaria de comida y suplementos de un paciente hospitalizado.',ic:'i-heart',ph:'zarigueya'},
 {id:'sana',t:'Sana sus heridas',d:'Tratamientos médicos, analgésicos y curaciones que devuelven la movilidad.',ic:'i-med',ph:'tamandua'},
 {id:'camino',t:'Construye su camino a la libertad',d:'Encierros naturales donde recuperan su fuerza antes de volver.',ic:'i-home',ph:'mono'},
 {id:'libera',t:'Libera una vida',d:'Las etapas finales de rehabilitación y el día de la liberación.',ic:'i-leaf',ph:'manglar'}
];
var DAMT={m:[5,10,20,50],u:[10,25,50,100]};
var D={c:0,fq:'m',a:10,other:''};
function damt(){var o=parseInt(D.other,10);return o>0?o:D.a}
function renderDon(){
  $('#causes').innerHTML=CAUSES.map(function(c,i){var p=PH[c.ph];return '<button class="cause" role="radio" aria-checked="'+(i===D.c)+'" data-cause="'+i+'"><span class="cause-img"><img src="'+p.src+'" alt="" loading="lazy" style="object-position:'+(p.pos||'50% 50%')+'"></span><span class="cause-t"><b>'+esc(c.t)+'</b><small>'+esc(c.d)+'</small></span><i class="cause-r" aria-hidden="true">'+ico('i-check')+'</i></button>'}).join('');
  $$('#donFreq [data-fq]').forEach(function(b){b.setAttribute('aria-checked',String(b.getAttribute('data-fq')===D.fq))});
  $('#amts2').innerHTML=DAMT[D.fq].map(function(a){return '<button role="radio" aria-checked="'+(!D.other&&a===D.a)+'" data-amt="'+a+'">$'+a+'</button>'}).join('');
  var a=damt(),c=CAUSES[D.c],min=Math.round(a/YEAR_COST*525600);
  $('#donSum').innerHTML='<b>$'+a+(D.fq==='m'?' al mes':'')+'</b> para <b>'+esc(c.t.toLowerCase())+'</b>. Cubre unos <b>'+nf(min)+' minutos</b> de operación del centro'+(D.fq==='m'?' cada mes':'')+'.';
  $('#donGoT').textContent='Donar $'+a+(D.fq==='m'?' al mes':'');
}
function nf(n){return Math.round(n).toLocaleString('es-EC')}
document.addEventListener('click',function(e){
  var c=e.target.closest('[data-cause]');if(c){D.c=+c.getAttribute('data-cause');renderDon();return}
  var f=e.target.closest('[data-fq]');if(f&&f.closest('#donFreq')){D.fq=f.getAttribute('data-fq');D.a=DAMT[D.fq][1];D.other='';$('#donOther').value='';renderDon();return}
  var a=e.target.closest('[data-amt]');if(a){D.a=+a.getAttribute('data-amt');D.other='';$('#donOther').value='';renderDon();return}
  var cp=e.target.closest('[data-copyv]');if(cp){copy(cp.getAttribute('data-copyv'),cp.getAttribute('data-copyv')+' copiado')}
});
$('#donOther').addEventListener('input',function(){this.value=this.value.replace(/[^0-9]/g,'').slice(0,5);D.other=this.value;renderDon()});
$('#donGo').addEventListener('click',function(){var b=$('#donBank');b.innerHTML='<p class="bank-h">Por ahora recibimos transferencias. Pronto, tarjeta y PayPal.</p><dl>'+BANK.map(function(r){return '<div><dt>'+esc(r[0])+'</dt><dd>'+esc(r[1])+'<button class="cpy" data-copyv="'+esc(r[1])+'" aria-label="Copiar '+esc(r[0])+'">'+ico('i-copy')+'</button></dd></div>'}).join('')+'</dl><p class="bank-n">Envía el comprobante a donaciones.tc@proyectosacha.org con tu nombre y el destino elegido. Maqueta: aún no se procesa ningún pago.</p>';b.hidden=false;if(window.gsap&&!reduced)gsap.from(b,{height:0,autoAlpha:0,duration:.6,ease:'power3.out',clearProps:'height'})});
function setTab(t){$$('#atabs [data-at]').forEach(function(b){b.setAttribute('aria-selected',String(b.getAttribute('data-at')===t))});var don=t==='don',show=don?$('#paneDon'):$('#panePad'),hide=don?$('#panePad'):$('#paneDon');moveInd('#atabs','i');if(!show.hidden)return;
  if(window.gsap&&!reduced){gsap.to(hide,{autoAlpha:0,y:-20,duration:.3,ease:'power2.in',onComplete:function(){hide.hidden=true;gsap.set(hide,{clearProps:'all'});show.hidden=false;gsap.fromTo(show,{autoAlpha:0,y:30},{autoAlpha:1,y:0,duration:.6,ease:'power3.out'});gsap.from($$('.cause,.pt',show),{y:40,autoAlpha:0,duration:.7,stagger:.07,ease:'power3.out'})}})}
  else{hide.hidden=true;show.hidden=false}}
$('#atabs').addEventListener('click',function(e){var b=e.target.closest('[data-at]');if(b)setTab(b.getAttribute('data-at'))});

var PATS=[
 {n:'Meg',sp:'Ocelote',sci:'Leopardus pardalis',img:PH.ocelote.src,pos:PH.ocelote.pos,st:'Rehabilitación',pct:68,since:'5 meses en el centro',story:'Llegó como cría, en riesgo por la quema de plantaciones. Hoy aprende a cazar sola.'},
 {n:'Luna',sp:'Mona araña',sci:'Ateles fusciceps',img:PH.mono2.src,pos:PH.mono2.pos,st:'Atención médica',pct:40,since:'2 meses en el centro',story:'La mordió un caimán. Otra fundación la rescató y pidió ayuda a Sacha para operarla.'},
 {n:'Kuri',sp:'Oso hormiguero',sci:'Tamandua mexicana',img:PH.tamandua.src,pos:'50% 70%',st:'Rehabilitación',pct:54,since:'2 meses en el centro',story:'Herido por perros en la ciudad. Ya se alimenta por su cuenta y recupera fuerza para trepar.'},
 {n:'Nina',sp:'Búho',sci:'Ave rapaz nocturna',img:'assets/video/final/p-buho.jpg',st:'Preliberación',pct:90,since:'4 meses en el centro',story:'Cayó del nido siendo polluela. Ya vuela en el recinto de vuelo: falta poco para liberarla.'}
];
var PLANS=[{a:10,t:'Alimentación',d:'Su dieta de un mes.'},{a:20,t:'Atención médica',d:'Medicinas, exámenes y controles.'},{a:50,t:'Rehabilitación completa',d:'Alimentación, medicinas y cuidado diario.'}];
var AP={i:0,plan:1,name:'',mail:'',tried:false,ok:false};
$('#pat').innerHTML=PATS.map(function(p,i){return '<article class="pt"><button class="pt-f" data-ap="'+i+'" tabindex="-1" aria-hidden="true"><img src="'+p.img+'" alt="" loading="lazy" style="object-position:'+(p.pos||'50% 30%')+'"><span class="pt-st">'+esc(p.st)+'</span></button><div class="pt-b"><small>'+esc(p.sp)+' · <em>'+esc(p.sci)+'</em></small><h3>'+esc(p.n)+'</h3><p>'+esc(p.story)+'</p><div class="pt-prog"><span>Recuperación</span><b>'+p.pct+'%</b><i style="--w:'+p.pct+'%"></i></div><button class="zbtn zbtn-ghost pt-go" data-ap="'+i+'"><span class="zbtn-t">Apadrinar a '+esc(p.n)+'</span><span class="zbtn-c">'+ico('i-arrow-ur')+ico('i-arrow-ur')+'</span></button></div></article>'}).join('');
function renderAp(){
  var p=PATS[AP.i],pl=PLANS[AP.plan],el=$('#ap');$('#apDrT').textContent='Apadrina a '+p.n;
  if(AP.ok){el.innerHTML='<div class="ap-ok"><span class="ap-ok-i">'+ico('i-check')+'</span><h3>Gracias, '+esc(AP.name.split(' ')[0])+'.</h3><p>Ya acompañas la recuperación de <b>'+esc(p.n)+'</b> con $'+pl.a+' al mes. Te escribiremos a '+esc(AP.mail)+' con su certificado y las primeras noticias.</p><p class="ap-note">Maqueta: todavía no se cobra ni se envía ningún correo.</p><button class="zbtn" data-drclose><span class="zbtn-t">Volver al sitio</span><span class="zbtn-c">'+ico('i-arrow-ur')+ico('i-arrow-ur')+'</span></button></div>';return}
  el.innerHTML='<div class="ap-h"><img src="'+p.img+'" alt="" style="object-position:'+(p.pos||'50% 30%')+'"><div><small>'+esc(p.sp)+' · '+esc(p.st)+'</small><b>'+esc(p.n)+'</b><span>'+esc(p.since)+'</span><div class="pt-prog is-in"><span>Recuperación</span><b>'+p.pct+'%</b><i style="--w:'+p.pct+'%"></i></div></div></div>'+
   '<p class="ap-k">Elige cómo quieres ayudar cada mes</p><div class="ap-plans" role="radiogroup" aria-label="Plan de apadrinamiento">'+PLANS.map(function(x,i){return '<button role="radio" aria-checked="'+(i===AP.plan)+'" data-plan="'+i+'"><b>$'+x.a+'<small>/mes</small></b><span>'+esc(x.t)+'</span><em>'+esc(x.d)+'</em></button>'}).join('')+'</div>'+
   '<form id="apForm" novalidate><div class="fields">'+fld('apName','Tu nombre *','<input id="apName" autocomplete="name" value="'+esc(AP.name)+'">',AP.tried&&!AP.name.trim(),'Escribe tu nombre')+fld('apMail','Tu correo *','<input id="apMail" type="email" autocomplete="email" value="'+esc(AP.mail)+'">',AP.tried&&!validMail(AP.mail),'Escribe un correo válido, por ejemplo nombre@correo.com')+'</div>'+
   '<button class="zbtn ap-go" type="submit"><span class="zbtn-t">Apadrinar a '+esc(p.n)+' por $'+pl.a+' al mes</span><span class="zbtn-c">'+ico('i-arrow-ur')+ico('i-arrow-ur')+'</span></button><p class="ap-note">Puedes cancelar cuando quieras. El apadrinamiento es simbólico: '+esc(p.n)+' no se visita ni se entrega, porque el objetivo es que vuelva a la vida silvestre.</p></form>';
}
function openAp(i){AP.i=i;AP.ok=false;AP.tried=false;renderAp();openDr('apDr')}
document.addEventListener('click',function(e){var b=e.target.closest('[data-ap]');if(b){openAp(+b.getAttribute('data-ap'));return}var pl=e.target.closest('[data-plan]');if(pl){AP.name=($('#apName')||{}).value||AP.name;AP.mail=($('#apMail')||{}).value||AP.mail;AP.plan=+pl.getAttribute('data-plan');renderAp();var n=$('[data-plan="'+AP.plan+'"]');if(n)n.focus()}});
document.addEventListener('submit',function(e){if(e.target.id!=='apForm')return;e.preventDefault();AP.name=$('#apName').value;AP.mail=$('#apMail').value;AP.tried=true;if(!AP.name.trim()||!validMail(AP.mail)){renderAp();var bad=!AP.name.trim()?$('#apName'):$('#apMail');if(bad)bad.focus();return}AP.ok=true;renderAp()});

/* ---------- aliados, redes, boletín y créditos ---------- */
var STAR='<svg class="zstar" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1l2.6 8.4L23 12l-8.4 2.6L12 23l-2.6-8.4L1 12l8.4-2.6z"/></svg>';
function marqHTML(items){var one=items.map(function(t){return '<span>'+t+'</span>'+STAR}).join('');return '<div class="zmarq-t">'+one+one+'</div>'}
$('#zPress').innerHTML=marqHTML(['Ministerio del Ambiente','Tafur Animal Care','Mansión Mascota','Lente Verde','Vistazo','El Universo','Expreso','Ecuavisa','Primicias']);
var SOC={instagram:'i-ig',tiktok:'i-tt',youtube:'i-yt',facebook:'i-fb'};
$('#zSoc').innerHTML=Object.keys(NETS).map(function(k){var n=NETS[k];return '<a href="'+(n.url||'#contacto')+'" data-follow="'+k+'" target="'+(n.url?'_blank':'_self')+'" rel="noopener" aria-label="'+n.name+'">'+ico(SOC[k])+'</a>'}).join('');
$('#newsForm').addEventListener('submit',function(e){e.preventDefault();var v=$('#nMail').value.trim(),m=$('#nMsg');if(!validMail(v)){m.textContent='Escribe un correo válido, por ejemplo nombre@correo.com.';m.className='nmsg bad';$('#nMail').focus();return}m.textContent='Listo. Te avisaremos cuando salga el próximo reel. (Maqueta: aún no se envía.)';m.className='nmsg ok';this.reset()});

renderChips();renderReels();reelAuto();renderYT(false);renderDon();renderCredits();onScroll();
$('#credits').insertAdjacentHTML('beforeend','<li>Videos de portada, institucional y reels: clips de referencia de Mixkit (licencia gratuita de Mixkit).</li><li>Videos del podcast y casos: YouTube (Proyecto Sacha, Movimiento Animalista EC, Ecuavisa, El Universo).</li>');
addEventListener('load',function(){layoutReels(true);moveInd('#ptabs','.ptabs-i');moveInd('#atabs','i')});
var rz=0;addEventListener('resize',function(){clearTimeout(rz);rz=setTimeout(function(){layoutReels(true);moveInd('#ptabs','.ptabs-i');moveInd('#atabs','i')},150)});


/* ======================  ANIMACIONES (GSAP + ScrollTrigger + SplitText + Lenis)  ======================
   Entradas con IntersectionObserver o ScrollTrigger, salidas ligadas al scroll, video institucional fijado
   mientras se recorre, galería que avanza en horizontal. Si el marco de la vista previa no tiene scroll propio,
   los efectos fijados se reemplazan por animaciones al aparecer. Con «Reducir movimiento» la página queda
   estática y completa (el aviso inferior permite activarlas). */
var M={scrolls:false};
function onView(el,fn,o){if(!el)return;var list=el.length!==undefined?el:[el];if(!canIO){list.forEach(fn);return}o=o||{};var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);fn(e.target)}})},{rootMargin:o.margin||'0px 0px -12% 0px',threshold:o.th||0});list.forEach(function(x){io.observe(x)})}
function countTo(el,dur){var to=+el.getAttribute('data-count'),pre=el.getAttribute('data-pre')||'',o={v:0};if(!window.gsap||reduced){el.textContent=pre+nf(to);return}gsap.to(o,{v:to,duration:dur||1.8,ease:'power2.out',onUpdate:function(){el.textContent=pre+nf(o.v)}})}

function initMotion(){
  if(!window.gsap||reduced){document.documentElement.classList.add('zstatic');$$('[data-count]').forEach(function(b){countTo(b)});return}
  gsap.registerPlugin(ScrollTrigger,window.SplitText);
  M.scrolls=document.documentElement.scrollHeight-innerHeight>400;
  var de=document.documentElement;de.classList.add('zmo');de.classList.toggle('noscroll',!M.scrolls);
  var fine=matchMedia('(pointer:fine)').matches,wide=innerWidth>=900;

  /* desplazamiento suave */
  if(M.scrolls&&window.Lenis&&fine){
    var lenis=new Lenis({lerp:.1,smoothWheel:true});window.__lenis=lenis;
    lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(function(t){lenis.raf(t*1000)});gsap.ticker.lagSmoothing(0);
    $$('.ficha,.story,.lbx,.zmenu').forEach(function(x){x.setAttribute('data-lenis-prevent','')});
    new MutationObserver(function(){if(document.body.classList.contains('lock'))lenis.stop();else lenis.start()}).observe(document.body,{attributes:true,attributeFilter:['class']});
  }

  /* ---- portada: entrada ---- */
  var FINAL=getComputedStyle($('#zhShape')).clipPath,START='polygon(0% 0%,100% 0%,100% 0%,65% 0%,61.5% 0%,0% 0%)';
  var lines=$$('#zhT > span');lines.forEach(function(l){l.innerHTML='<span class="zl-in">'+l.innerHTML+'</span>'});
  var tl=gsap.timeline({defaults:{ease:'power4.out'}});
  tl.from('#zh',{yPercent:-100,duration:.9},0)
    .fromTo('#zhShape',{clipPath:START},{clipPath:FINAL,duration:1.4,ease:'power4.inOut',clearProps:'clipPath'},0)
    .fromTo('#zhBg',{scale:1.25},{scale:1,duration:2.4,ease:'power3.out'},0)
    .from('.zh-eye',{y:24,autoAlpha:0,duration:.8},.5)
    .from('#zhT .zl-in',{yPercent:118,duration:1.2,stagger:.13},.55)
    .from('.zh-cta',{y:34,autoAlpha:0,duration:1},1.1)
    .from('#zhCard',{x:-80,autoAlpha:0,duration:1.1},.85)
    .from('#zhPlay',{scale:0,rotate:-45,duration:.9,ease:'back.out(2.2)'},1.25)
    .from('#zhAva img,#zhAva button',{scale:0,duration:.6,stagger:.07,ease:'back.out(2)'},1.45)
    .from('#zhQuick',{yPercent:110,duration:1},1.2)
    .add(function(){var b=$('.zh-num b');if(b)countTo(b,1.9)},1.2);
  /* portada: salida al bajar */
  if(M.scrolls){
    var hx={trigger:'#inicio',start:'top top',end:'bottom top',scrub:true};
    gsap.to('#zhBg',{yPercent:14,scale:1.08,ease:'none',scrollTrigger:hx});
    if(wide){gsap.to('.zh-copy',{y:-120,autoAlpha:0,ease:'none',scrollTrigger:hx});gsap.to('#zhCard',{y:-60,autoAlpha:0,ease:'none',scrollTrigger:hx});gsap.to('#zhQuick',{yPercent:100,ease:'none',scrollTrigger:{trigger:'#inicio',start:'top top',end:'30% top',scrub:true}})}
  }

  /* ---- video institucional: scroll inmersivo ---- */
  var lineEls=$$('.imm-l');
  if(M.scrolls){
    de.classList.add('imm-on');
    var small=wide?'inset(37% 25% 6% 25% round 24px)':'inset(40% 6% 18% 6% round 18px)';
    var it=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:'#video',start:'top top',end:'+=360%',pin:'#immPin',scrub:.6,anticipatePin:1}});
    it.fromTo('#immFrame',{clipPath:small},{clipPath:'inset(0% 0% 0% 0% round 0px)',duration:2},0)
      .fromTo('#immVid',{scale:1.18},{scale:1,duration:2},0)
      .to('#immHead',{y:-90,autoAlpha:0,duration:1},.2)
      .fromTo('#immShade',{opacity:0},{opacity:1,duration:1},1.2);
    lineEls.forEach(function(l,i){var s=2+i*1.6;it.fromTo(l,{autoAlpha:0,y:60},{autoAlpha:1,y:0,duration:.6},s).to(l,{autoAlpha:0,y:-60,duration:.6},s+1.1)});
    it.fromTo('#immEnd',{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.8},2+lineEls.length*1.6).to({},{duration:.8});
  }else{
    de.classList.add('imm-static');
    onView($('#immFrame'),function(){gsap.fromTo('#immFrame',{clipPath:'inset(10% 10% 10% 10% round 24px)'},{clipPath:'inset(0% 0% 0% 0% round 24px)',duration:1.4,ease:'power4.inOut'});gsap.from('.imm-l',{y:30,autoAlpha:0,duration:.8,stagger:.12,ease:'power3.out',delay:.5})});
  }

  /* ---- títulos por líneas (entrada) y encabezados que se despiden (salida) ---- */
  function splitHeads(){$$('.zt').forEach(function(el){if(el.closest('#immHead'))return;
    SplitText.create(el,{type:'lines',mask:'lines',linesClass:'zline',maskClass:'zmask',autoSplit:true,onSplit:function(self){return gsap.from(self.lines,{yPercent:112,duration:1.15,ease:'power4.out',stagger:.1,scrollTrigger:{trigger:el,start:'top 90%',once:true}})}})})}
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){splitHeads();ScrollTrigger.refresh()});else splitHeads();
  if(M.scrolls&&wide)$$('.zhead').forEach(function(h){gsap.to(h,{y:-50,autoAlpha:.15,ease:'none',scrollTrigger:{trigger:h,start:'top 12%',end:'top -25%',scrub:true}})});

  /* ---- entradas genéricas ---- */
  gsap.set('.zfade,.zeye:not(#immHead .zeye)',{autoAlpha:0,y:36});
  onView($$('.zfade,.zeye:not(#immHead .zeye)'),function(el){gsap.to(el,{autoAlpha:1,y:0,duration:1,ease:'power3.out'})});
  gsap.set('.zhead-r',{autoAlpha:0,x:30});onView($$('.zhead-r'),function(el){gsap.to(el,{autoAlpha:1,x:0,duration:1,ease:'power3.out',delay:.3})});

  /* ---- nosotros: la mascota sube, el disco de pelaje gira, la línea de tiempo se dibuja ---- */
  gsap.set('#storyM img',{yPercent:30,autoAlpha:0});gsap.set('.sto-disc',{scale:.6,rotate:-40,autoAlpha:0});gsap.set('#storyM figcaption',{y:20,autoAlpha:0});
  onView($('#storyM'),function(){gsap.to('.sto-disc',{scale:1,rotate:0,autoAlpha:1,duration:1.4,ease:'power4.out'});gsap.to('#storyM img',{yPercent:0,autoAlpha:1,duration:1.3,ease:'back.out(1.4)',delay:.25});gsap.to('#storyM figcaption',{y:0,autoAlpha:1,duration:.8,ease:'power3.out',delay:.8});gsap.to('#storyM img',{y:-10,duration:2.8,ease:'sine.inOut',yoyo:true,repeat:-1,delay:1.6})});
  if(M.scrolls)gsap.to('.sto-disc',{rotate:90,ease:'none',scrollTrigger:{trigger:'.sto',start:'top bottom',end:'bottom top',scrub:true}});
  gsap.set('#tl li',{x:-30,autoAlpha:0});onView($('#tl'),function(){gsap.to('#tl li',{x:0,autoAlpha:1,duration:.9,stagger:.14,ease:'power3.out'});$('#tl').classList.add('is-in')});
  onView($('#kpis'),function(){gsap.from('#kpis > div',{y:40,autoAlpha:0,duration:.9,stagger:.1,ease:'power3.out'});$$('#kpis [data-count]').forEach(function(b){countTo(b,1.8)})});

  /* ---- etapas: imagen que se revela + escalonado ---- */
  gsap.set('.stp',{y:70,autoAlpha:0});
  onView($('#steps'),function(){gsap.to('.stp',{y:0,autoAlpha:1,duration:1,stagger:.12,ease:'power3.out'});gsap.fromTo('.stp .zimg',{clipPath:'inset(100% 0% 0% 0%)'},{clipPath:'inset(0% 0% 0% 0%)',duration:1.3,stagger:.12,ease:'power4.inOut'});gsap.fromTo('.stp .zimg img',{scale:1.35},{scale:1,duration:1.8,stagger:.12,ease:'power3.out'})});

  /* ---- reels: el carrusel entra girando ---- */
  gsap.set('#reelsT2',{rotationY:-28,x:260,autoAlpha:0,transformPerspective:1600});
  onView($('#krl'),function(){gsap.to('#reelsT2',{rotationY:0,x:0,autoAlpha:1,duration:1.6,ease:'power4.out'})});

  /* ---- podcast ---- */
  gsap.set('#ytpV',{clipPath:'inset(0% 0% 100% 0% round 18px)'});gsap.set('.ytp-list li',{x:50,autoAlpha:0});
  onView($('#ytp'),function(){gsap.to('#ytpV',{clipPath:'inset(0% 0% 0% 0% round 18px)',duration:1.3,ease:'power4.inOut',clearProps:'clipPath'});gsap.to('.ytp-list li',{x:0,autoAlpha:1,duration:.8,stagger:.08,ease:'power3.out',delay:.3})});
  gsap.set('#ptabs',{y:20,autoAlpha:0});onView($('#ptabs'),function(){gsap.to('#ptabs',{y:0,autoAlpha:1,duration:.8,ease:'power3.out',onComplete:function(){moveInd('#ptabs','.ptabs-i')}})});

  /* ---- galería: recorrido horizontal mientras la sección queda fija ---- */
  var track=$('#galTrack'),items=$$('.gi'),cnt=$('#galCount');
  if(M.scrolls&&wide){
    de.classList.add('gal-on');
    var dist=function(){return Math.max(0,track.scrollWidth-innerWidth+80)};
    gsap.to(track,{x:function(){return -dist()},ease:'none',scrollTrigger:{trigger:'#galeria',start:'top top',end:function(){return '+='+dist()},pin:'#galPin',scrub:.6,invalidateOnRefresh:true,anticipatePin:1,
      onUpdate:function(s){$('#galProg').style.transform='scaleX('+s.progress.toFixed(3)+')';var k=Math.min(items.length,1+Math.floor(s.progress*items.length));cnt.textContent=pad2(k)+' / '+pad2(items.length)}}});
    items.forEach(function(it){var im=$('img',it);gsap.fromTo(im,{xPercent:-8},{xPercent:8,ease:'none',scrollTrigger:{trigger:'#galeria',start:'top top',end:function(){return '+='+dist()},scrub:true,invalidateOnRefresh:true}})});
  }else{
    track.addEventListener('scroll',function(){var p=track.scrollLeft/Math.max(1,track.scrollWidth-track.clientWidth);$('#galProg').style.transform='scaleX('+p.toFixed(3)+')';cnt.textContent=pad2(Math.min(items.length,1+Math.floor(p*items.length)))+' / '+pad2(items.length)},{passive:true});
  }
  gsap.set(items,{y:80,autoAlpha:0});onView($('#galTrack'),function(){gsap.to(items,{y:0,autoAlpha:1,duration:1,stagger:.08,ease:'power3.out'})});

  /* ---- apadrina y dona ---- */
  gsap.set('.cause',{y:40,autoAlpha:0});onView($('#causes'),function(){gsap.to('.cause',{y:0,autoAlpha:1,duration:.8,stagger:.08,ease:'power3.out'})});
  gsap.set('.don-card',{y:60,autoAlpha:0});gsap.set('.don-m',{yPercent:100});
  onView($('#donR'),function(){gsap.to('.don-card',{y:0,autoAlpha:1,duration:1,ease:'power3.out'});gsap.to('.don-m',{yPercent:0,duration:1.1,ease:'back.out(1.6)',delay:.5,onComplete:function(){gsap.to('.don-m',{rotate:-3,duration:1.6,ease:'sine.inOut',yoyo:true,repeat:-1,transformOrigin:'50% 100%'})}})});
  onView($('#atabs'),function(){moveInd('#atabs','i')});

  /* ---- si encuentras un animal ---- */
  gsap.set('#encSteps li',{y:40,autoAlpha:0});onView($('#encSteps'),function(){gsap.to('#encSteps li',{y:0,autoAlpha:1,duration:.8,stagger:.1,ease:'power3.out'})});
  gsap.set('#encR img',{x:80,autoAlpha:0});gsap.set('.enc-pat',{scale:.7,autoAlpha:0});
  onView($('#encR'),function(){gsap.to('.enc-pat',{scale:1,autoAlpha:1,duration:1.2,ease:'power4.out'});gsap.to('#encR img',{x:0,autoAlpha:1,duration:1.2,ease:'power3.out',delay:.2})});

  /* ---- marquesina que reacciona a la velocidad del scroll ---- */
  var mt=$('#zPress .zmarq-t'),tw=mt?gsap.fromTo(mt,{xPercent:0},{xPercent:-50,repeat:-1,duration:40,ease:'none'}):null;
  if(M.scrolls&&tw)ScrollTrigger.create({start:0,end:'max',onUpdate:function(s){var v=Math.min(6,Math.abs(s.getVelocity())/300);gsap.to(tw,{timeScale:(1+v)*s.direction,duration:.3,overwrite:true,onComplete:function(){gsap.to(tw,{timeScale:s.direction,duration:1})}})}});

  /* ---- pie ---- */
  gsap.set('.zfoot-top > *,.zfoot-cols > div',{y:50,autoAlpha:0});
  onView($('.zfoot'),function(){gsap.to('.zfoot-top > *,.zfoot-cols > div',{y:0,autoAlpha:1,duration:1,stagger:.08,ease:'power3.out'});gsap.fromTo('.zfoot-m',{x:-120,autoAlpha:0},{x:0,autoAlpha:1,duration:1.6,ease:'power2.out',delay:.4})});

  /* ---- cursor contextual en fotos y reels ---- */
  if(fine){var c=document.createElement('div');c.className='zcur';c.setAttribute('aria-hidden','true');c.innerHTML='<span></span>';document.body.appendChild(c);
    var lab=$('span',c),qx=gsap.quickTo(c,'x',{duration:.3,ease:'power3'}),qy=gsap.quickTo(c,'y',{duration:.3,ease:'power3'}),on=false;gsap.set(c,{xPercent:-50,yPercent:-50,scale:.2,autoAlpha:0});
    addEventListener('mousemove',function(e){qx(e.clientX);qy(e.clientY)},{passive:true});
    document.addEventListener('mouseover',function(e){var t=e.target.closest('[data-cursor]'),show=!!t&&!(t.classList.contains('reel')&&!t.classList.contains('is-on'));if(show){lab.textContent=t.getAttribute('data-cursor');if(!on){on=true;gsap.to(c,{scale:1,autoAlpha:1,duration:.35,ease:'back.out(2)'})}}else if(on){on=false;gsap.to(c,{scale:.2,autoAlpha:0,duration:.2})}});
    $$('.zbtn,.zh-don').forEach(function(b){b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();gsap.to(b,{x:(e.clientX-r.left-r.width/2)*.18,y:(e.clientY-r.top-r.height/2)*.3,duration:.4,ease:'power3.out'})});b.addEventListener('mouseleave',function(){gsap.to(b,{x:0,y:0,duration:.9,ease:'elastic.out(1,.4)'})})});
  }
  addEventListener('load',function(){ScrollTrigger.refresh()});var rt=0;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){ScrollTrigger.refresh()},200)});
}
initMotion();

document.documentElement.classList.add('ready');
})();
