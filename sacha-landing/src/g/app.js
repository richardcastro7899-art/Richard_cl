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

var NAV=[['Guía de campo','guia'],['Cápsulas','capsulas'],['Proceso','proceso'],['Sacha','sacha'],['Participa','participa']];
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
 {tab:0,pre:'Mitos sobre la',title:'zarigüeya',dur:58,desc:'Lo que crees saber y por qué no es una amenaza.',m:'sacha-dato',net:'tiktok'},
 {tab:0,pre:'Encontré una cría:',title:'¿qué hago?',dur:72,desc:'Primeros pasos antes de llamar al equipo.',m:'sacha-rescate',net:'instagram'},
 {tab:0,pre:'Convivir con fauna',title:'en la ciudad',dur:65,desc:'Hábitos simples para coexistir.',m:'sacha-saluda',net:'tiktok'},
 {tab:1,pre:'Todo sobre',title:'quiénes somos',dur:90,desc:'El equipo y lo que nos mueve.',m:'sacha-saluda',net:'instagram'},
 {tab:1,pre:'Un día en',title:'Proyecto Sacha',dur:70,desc:'Turnos, protocolos y cuidado diario.',m:'sacha-dato',net:'tiktok'},
 {tab:2,pre:'Rescate',title:'en campo',dur:100,desc:'Cómo se contiene a un animal sin dañarlo.',m:'sacha-rescate',net:'instagram'},
 {tab:2,pre:'Traslado a',title:'Santa Elena',dur:75,desc:'Logística y cuidados durante el viaje.',m:'sacha-saluda',net:'tiktok'},
 {tab:2,pre:'Rehabilitación',title:'y liberación',dur:85,desc:'El día en que vuelve a su hábitat.',m:'sacha-donar',net:'instagram'}
];
var STEPS=[
 {pat:'felino',plate:'arena',mood:'cuidadora',title:'Recepción médica',icon:'i-med',who:'Equipo veterinario',text:'Evaluación clínica inmediata y estabilización. Reciben los mismos exámenes que un perro o un gato, porque necesitan los mismos cuidados.',cap:8},
 {pat:'manchas',plate:'menta',mood:'curiosa',title:'Gestión legal',icon:'i-doc',who:'Ministerio del Ambiente · Policía de Medio Ambiente',text:'Cada ingreso se informa a la autoridad ambiental y la liberación se coordina con ella.',cap:6},
 {pat:'selva',plate:'selva',mood:'explora',title:'Logística y traslado',icon:'i-truck',who:'Guayaquil → Santa Elena',text:'Vehículos, combustible y personal para llevar al animal al centro rural. Mientras espera, sigue necesitando cuidados.',cap:7},
 {pat:'rayas',plate:'terra',mood:'orgullosa',title:'Rehabilitación y liberación',icon:'i-leaf',who:'Centro rural · Santa Elena',text:'Cuidado prolongado, a veces durante meses, hasta devolverlo a su hábitat.',cap:8}
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
  if(e.target.closest('[data-open-tool]'))openTool();
  var cp=e.target.closest('[data-cap]');if(cp){selectCap(+cp.getAttribute('data-cap'),true);go('capsulas')}
});
var pad2=function(n){return String(n).padStart(2,'0')};

/* ======================  NAVEGACIÓN, PROGRESO Y SEGUIMIENTO  ====================== */
$('#nav').innerHTML=NAV.map(function(n){return '<button data-go="'+n[1]+'" data-nav="'+n[1]+'">'+n[0]+'</button>'}).join('');
$('#menuList').innerHTML=NAV.map(function(n){return '<button data-go="'+n[1]+'">'+n[0]+'</button>'}).join('')+'<button data-open-tool>Reportar un animal</button><button data-go="redes">Redes</button>';
function closeMenu(){$('#menu').classList.remove('open');$('#burger').setAttribute('aria-expanded','false')}
$('#burger').addEventListener('click',function(){var o=$('#menu').classList.toggle('open');this.setAttribute('aria-expanded',o?'true':'false')});
$('#goTop').addEventListener('click',function(){window.scrollTo({top:0,behavior:reduced?'auto':'smooth'});closeMenu()});
$('#toTop').addEventListener('click',function(){window.scrollTo({top:0,behavior:reduced?'auto':'smooth'})});
var SPY=['guia','capsulas','proceso','sacha','donde','prensa','participa','podcast','redes'],NOACT={donde:1,prensa:1,podcast:1,redes:1},lastAct='';
function onScroll(){
  var H=document.documentElement.scrollHeight-innerHeight,act=null;
  SPY.forEach(function(id){var el=document.getElementById(id);if(el&&el.getBoundingClientRect().top<=160)act=NOACT[id]?null:id});
  $('#prog').style.width=(H>0?Math.min(100,scrollY/H*100):0)+'%';
  if(act!==lastAct){lastAct=act;$$('#nav button').forEach(function(b){b.setAttribute('aria-current',b.getAttribute('data-nav')===act?'true':'false')})}
  if(!reduced)$('#hvid').style.setProperty('--z',(1.04+Math.min(.1,scrollY/3600)).toFixed(3));
}
window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMenu()});

/* ======================  PORTADA: VIDEO SIN AUDIO, SACHA Y RECORRIDO  ====================== */
(function(){
  var v=$('#heroVid'),b=$('#heroPause'),lab=$('span',b),use=$('use',b),srcs=[].concat(VIDEOS.hero),fails=0,manual=false,auto=false;
  if(reduced)v.removeAttribute('autoplay');
  v.innerHTML=srcs.map(function(u){return '<source src="'+u+'" type="video/'+(/\.webm$/.test(u)?'webm':'mp4')+'">'}).join('');v.load();
  function ui(p){lab.textContent=p?'Pausar':'Reproducir';use.setAttribute('href',p?'#i-pause':'#i-play');b.setAttribute('aria-label',p?'Pausar el video':'Reproducir el video')}
  function play(){var p=v.play();if(p&&p.catch)p.catch(function(){})}
  v.addEventListener('play',function(){ui(true)});v.addEventListener('pause',function(){ui(false)});
  v.addEventListener('error',function(){if(++fails>=srcs.length)b.style.display='none'},true);ui(false);
  b.addEventListener('click',function(){manual=true;if(v.paused)play();else v.pause()});
  if(canIO)new IntersectionObserver(function(es){if(!es[0].isIntersecting){if(!v.paused){auto=true;v.pause()}}else if(auto&&!manual){auto=false;play()}},{threshold:.05}).observe($('#hvid'));
})();
$('#heroSacha').innerHTML=sacha('alegre',{eager:true,alt:'Sacha, ocelote y mascota de la fundación, saluda'});

/* ======================  CAP. 01: SACHA HABLA, DATOS, VIDEO Y MAPA  ====================== */
var MI=0;
function renderMeet(){
  var d=MEET[MI],p=$('#meetPlate'),s=$('#meetSay');
  p.style.setProperty('--pc',d.bg[0]);p.style.setProperty('--ph',d.bg[1]);
  $('#meetFig').innerHTML=sacha(d.m,{h:'100%',eager:true});
  s.innerHTML=d.t;s.style.animation='none';void s.offsetWidth;s.style.animation='';
  $('#meetDots').innerHTML=MEET.map(function(x,i){return '<button data-meet="'+i+'" aria-current="'+(i===MI)+'" aria-label="Dato '+(i+1)+' de '+MEET.length+'"></button>'}).join('');
}
document.addEventListener('click',function(e){
  if(e.target.closest('#meetTap')){MI=(MI+1)%MEET.length;renderMeet();return}
  var b=e.target.closest('[data-meet]');if(b){MI=+b.getAttribute('data-meet');renderMeet()}
});
$('#story').innerHTML=STORY.map(function(p){return '<p>'+esc(p)+'</p>'}).join('')+'<p class="src">Fuentes: '+STORY_SRC.map(function(s){return '<a href="'+s[1]+'" target="_blank" rel="noopener">'+s[0]+'</a>'}).join(' · ')+'</p>';
$('#facts').innerHTML=FACTS.map(function(f){return '<div><dt>'+f[0]+'</dt>'+(f[1]?'<dd>'+esc(f[1])+'</dd>':'<dd class="tbc">Por confirmar · <button data-go="donde">ver mapa</button></dd>')+'</div>'}).join('');

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

var sachaVid=Player($('#pl-s'),{});
sachaVid.load({cover:cover({pat:'felino',pre:'¿Quién es',title:'Sacha?',m:'sacha-saluda',meta:'Video · Historia'}),dur:60,net:'youtube',srcs:VIDEOS.sacha?[VIDEOS.sacha]:[]},false);
$('#sTitle').textContent='¿Quién es Sacha?';$('#sDesc').textContent='La historia real detrás del nombre de la fundación, contada por Sacha. Dura cerca de un minuto.';

/* ======================  CAP. 02: CÁPSULAS VERTICALES  ====================== */
var C={i:0,tab:-1,auto:true,seen:{}};
var capP=Player($('#pl-c'),{onEnd:function(){if(C.auto&&C.i<CAPS.length-1){selectCap(C.i+1,true);return true}return false}});
function capCover(i){var c=CAPS[i];return cover({pat:EJES[c.tab].pat,pre:c.pre,title:c.title,m:c.m,meta:'Cápsula '+pad2(i+1)+' · '+EJES[c.tab].name})}
function selectCap(i,play){C.i=Math.max(0,Math.min(CAPS.length-1,i));C.seen[C.i]=1;var c=CAPS[C.i];capP.load({cover:capCover(C.i),dur:c.dur,net:c.net,srcs:VIDEOS.caps[C.i]?[VIDEOS.caps[C.i]]:[]},play);renderCaps()}
function renderCaps(){
  var c=CAPS[C.i],n=NETS[c.net];
  $('#capTabs').innerHTML=[{name:'Todas',k:CAPS.length}].concat(EJES.map(function(x,k){return {name:x.name,k:CAPS.filter(function(y){return y.tab===k}).length}})).map(function(t,k){return '<button class="tab" role="tab" aria-selected="'+(C.tab===k-1)+'" data-ctab="'+(k-1)+'">'+t.name+' <span style="opacity:.7">'+t.k+'</span></button>'}).join('');
  $('#cKick').textContent='Cápsula '+(C.i+1)+' / '+CAPS.length+' · '+EJES[c.tab].name;
  $('#cTitle').textContent=c.pre+' '+c.title;$('#cDesc').textContent=c.desc;
  $('#cAct').innerHTML='<button class="btn line sm" data-cstep="-1"'+(C.i?'':' disabled')+'>'+ico('i-left')+'Anterior</button><button class="btn line sm" data-cstep="1"'+(C.i<CAPS.length-1?'':' disabled')+'>Siguiente'+ico('i-right')+'</button><button class="link" data-cshare>Compartir '+ico('i-share')+'</button>'+follow(c.net,'pri');
  $('#clist').innerHTML=CAPS.map(function(x,i){return i}).filter(function(i){return C.tab<0||CAPS[i].tab===C.tab}).map(function(i){var x=CAPS[i];return '<button class="crow'+(C.seen[i]?' seen':'')+'" data-crow="'+i+'" aria-current="'+(i===C.i)+'"><span class="n">'+(i+1)+'</span><span><b>'+esc(x.pre+' '+x.title)+'</b><span class="s">'+EJES[x.tab].name+(C.seen[i]&&i!==C.i?' · visto':'')+'</span></span><time>'+fmt(x.dur)+'</time></button>'}).join('');
}
document.addEventListener('click',function(e){
  var t=e.target.closest('[data-ctab]');if(t){C.tab=+t.getAttribute('data-ctab');renderCaps();return}
  var r=e.target.closest('[data-crow]');if(r){selectCap(+r.getAttribute('data-crow'),true);return}
  var s=e.target.closest('[data-cstep]');if(s){selectCap(C.i+ +s.getAttribute('data-cstep'),true);return}
  if(e.target.closest('[data-cshare]')){copy(location.href.split('#')[0]+'#capsulas','Enlace copiado');return}
  var a=e.target.closest('#autoSw');if(a){C.auto=!C.auto;a.setAttribute('aria-checked',String(C.auto))}
});

/* ======================  CAP. 03: PROCESO, QUÉ HACER Y PREGUNTAS  ====================== */
var PS=0;
function renderProceso(){
  var s=STEPS[PS];
  $('#psteps').innerHTML=STEPS.map(function(x,i){return '<button role="tab" aria-selected="'+(i===PS)+'" data-ps="'+i+'" tabindex="'+(i===PS?0:-1)+'"><span class="n pf '+x.pat+'">'+(i+1)+'</span><b>'+x.title+'</b></button>'}).join('');
  $('#ppanel').innerHTML='<div class="ptxt"><span class="k">Paso '+(PS+1)+' de '+STEPS.length+'</span><h3>'+s.title+'</h3><p>'+s.text+'</p><span class="who">'+s.who+'</span><div class="row"><button class="btn pri" data-cap="'+(s.cap-1)+'">'+ico('i-play')+'Ver en la cápsula '+s.cap+'</button></div><div class="row"><button class="linkbtn" data-pstep="-1"'+(PS?'':' disabled')+'>← Paso anterior</button><button class="linkbtn" data-pstep="1"'+(PS<STEPS.length-1?'':' disabled')+'>Paso siguiente →</button></div></div>'+
   '<div class="plate pvis '+s.plate+'"><div class="hill"></div><div class="pat" style="background-image:url(assets/patterns/tone-sage-'+s.pat+'.svg)"></div><span class="pn">Paso '+(PS+1)+'</span><svg class="ic bigic" aria-hidden="true"><use href="#'+s.icon+'"/></svg>'+sacha(s.mood,{alt:''})+'</div>';
}
document.addEventListener('click',function(e){
  var b=e.target.closest('[data-ps]');if(b){PS=+b.getAttribute('data-ps');renderProceso();return}
  var s=e.target.closest('[data-pstep]');if(s&&!s.disabled){PS+=+s.getAttribute('data-pstep');renderProceso()}
});
$('#psteps').addEventListener('keydown',function(e){var d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(!d)return;e.preventDefault();PS=(PS+d+STEPS.length)%STEPS.length;renderProceso();$('[data-ps="'+PS+'"]').focus()});
$('#allies').innerHTML=ALLIES.map(function(a){return '<li>'+a+'</li>'}).join('');
$('#hot').innerHTML=sacha('alerta',{alt:''})+'<div class="t"><b>Línea de reporte</b><span>Número o WhatsApp de la fundación: por definir. Si hay riesgo para personas, llama al 911. También puedes denunciar ante la Policía (UPMA), el Ministerio del Ambiente o la plataforma Animalia EC.</span></div><div class="nm"><button class="cpy" data-copy-num="911">'+ico('i-copy')+'911</button><button class="btn urg" data-open-tool>Reportar un animal</button></div>';
var FQ=0;
function renderFaq(){$('#faq').innerHTML=FAQS.map(function(f,i){var o=FQ===i;return '<div class="item'+(o?' open':'')+'"><h4><button data-faq="'+i+'" aria-expanded="'+o+'" id="fq'+i+'" aria-controls="fa'+i+'"><span>'+f[0]+'</span><span class="pm" aria-hidden="true">+</span></button></h4><div class="ans" id="fa'+i+'" role="region" aria-labelledby="fq'+i+'">'+f[1]+'</div></div>'}).join('')}
document.addEventListener('click',function(e){var b=e.target.closest('[data-faq]');if(b){var i=+b.getAttribute('data-faq');FQ=FQ===i?-1:i;renderFaq();var n=$('#fq'+i);if(n)n.focus()}});

/* ======================  REPORTAR: GUÍA DE ACCIÓN (se abre bajo demanda)  ====================== */
function openTool(sit,ani){closeMenu();var w=$('#toolwrap');if(typeof sit==='number'){resetTool();T.sit=sit;T.ani=ani;T.step=sit<0?0:(ani<0?1:2)}w.hidden=false;renderTool(false);go('toolwrap');var q=$('#tq');if(q)setTimeout(function(){q.focus({preventScroll:true})},400)}

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

/* ======================  CAP. 04: PODCAST INCRUSTADO  ====================== */
var EP=0;
function renderPod(){
  var e=PODCAST[EP],bars='';for(var i=0;i<28;i++)bars+='<i style="--h:'+(24+Math.abs(Math.sin(i*1.7))*76).toFixed(0)+'%"></i>';
  $('#yt').innerHTML='<div class="yt" id="ytBox">'+cover({pat:'manchas',pre:'Podcast · episodio '+e.n,title:e.title,meta:'YouTube'})+'<div class="bars" aria-hidden="true">'+bars+'</div>'+(e.yt?'':'<div class="zz">'+sacha('dormida',{alt:''})+'</div><span class="badge" style="left:auto;right:12px">Episodio por publicar</span>')+'<button class="bigplay" id="ytPlay" aria-label="Reproducir el episodio '+e.n+'">'+ico('i-play')+'</button></div><div class="meta2"><h3 style="font-size:22px">Episodio '+e.n+' · '+esc(e.title)+'</h3><p class="small" style="color:var(--on-c2)">'+esc(e.guest)+'</p><div class="row">'+follow('youtube','pri')+(e.yt?'<a class="link" href="https://www.youtube.com/watch?v='+encodeURIComponent(e.yt)+'" target="_blank" rel="noopener">Abrir en YouTube '+ico('i-ext')+'</a>':'')+'</div></div>';
  $('#eps').innerHTML=PODCAST.map(function(x,i){return '<button class="ep" data-ep="'+i+'" aria-current="'+(i===EP)+'"><span class="n">'+x.n+'</span><span><b>Episodio '+x.n+' · '+esc(x.title)+'</b><span class="s">'+esc(x.guest)+'</span></span>'+ico('i-play')+'</button>'}).join('');
}
document.addEventListener('click',function(e){
  var b=e.target.closest('[data-ep]');if(b){EP=+b.getAttribute('data-ep');renderPod();return}
  if(e.target.closest('#ytPlay')){var ep=PODCAST[EP],bx=$('#ytBox');
    if(ep.yt)bx.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+encodeURIComponent(ep.yt)+'?autoplay=1&rel=0" title="Episodio '+ep.n+'" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
    else if(!$('.pend',bx))bx.insertAdjacentHTML('beforeend','<div class="pend"><span class="nm" style="--c:#AF7409">YT</span><b>Este episodio se reproducirá aquí</b><p>Cuando se publique en YouTube, su ID se pega en la configuración y se verá incrustado, sin salir de la página.</p><div class="row">'+follow('youtube','pri')+'</div></div>')}
});

/* ======================  CAP. 05: DONACIÓN Y CONVENIOS  ====================== */
var HILL='<div class="hill"></div>';
var USES=[['i-med','Medicinas e insumos veterinarios'],['i-truck','Traslados y logística'],['i-leaf','Alimentación en rehabilitación'],['i-doc','Trámites con la autoridad ambiental']];
var G={a:-1,custom:'',f:1,bank:false};
function amount(){var c=parseFloat(G.custom);return G.a>=0?AMTS[G.a]:(c>0?c:0)}
function impactHTML(){var a=amount();if(a<=0)return 'Elige un monto para ver cuánta operación cubre tu aporte.';var perMin=YEAR_COST/525600,mins=a/perMin,t=mins<90?'unos '+Math.max(1,Math.round(mins))+' minutos':'unas '+(mins/60).toFixed(1).replace('.',',')+' horas',yr=a*12;return '<b>'+money(a)+'</b> cubren '+t+' de operación. '+(G.f?'En un año serían '+money(yr)+'. ':'')+'<span class="small">Equivalencia ilustrativa: $350.000 al año.</span>'}
/* Sacha acompaña el estado de la donación: triste sin aporte, alegre con monto, agradecida al donar */
function paintDtop(){var el=$('#dtop');if(!el)return;var m=G.bank?'gracias':(amount()>0?'alegre':'triste'),t=G.bank?'¡Gracias! Cada aporte hace posible el próximo rescate.':(amount()>0?'¡Eso ayuda mucho!':'Operar un año cuesta <b>$350.000</b> y hoy las donaciones no alcanzan.');el.innerHTML=sacha(m,{eager:true})+'<div class="bubble">'+t+'</div>'}
function renderGive(){
  var a=amount(),el=$('#give');
  if(G.bank){el.innerHTML=HILL+'<div class="dtop" id="dtop"></div><div class="thanks"><span class="k">Último paso</span><h3>Aporte '+(G.f?'mensual':'único')+' de '+money(a)+'</h3><p>Para completarlo, haz una transferencia con estos datos. Pronto sumaremos pago con tarjeta.</p><dl class="bank">'+BANK.map(function(b,i){return '<div><dt>'+b[0]+'</dt><dd>'+b[1]+'</dd><button data-cb="'+i+'">Copiar</button></div>'}).join('')+'</dl><p class="proto-note">Maqueta: aquí irán el pago y el recibo.</p><div><button class="link" id="giveBack">← Volver</button></div></div>';paintDtop();return}
  el.innerHTML=HILL+'<div class="dtop" id="dtop"></div><div><span class="k">Dona</span><h3>Elige tu aporte</h3></div><div class="seg" role="group" aria-label="Frecuencia"><button data-gf="0" aria-pressed="'+(G.f===0)+'">Una vez</button><button data-gf="1" aria-pressed="'+(G.f===1)+'">Cada mes</button></div><div class="bigamt" id="bigAmt">'+money(a)+'<small>'+(G.f?'/ mes':'una vez')+'</small></div><div class="amts" role="group" aria-label="Monto">'+AMTS.map(function(x,i){return '<button data-ga="'+i+'" aria-pressed="'+(G.a===i)+'">$'+x+'</button>'}).join('')+'<input id="customAmt" type="number" min="1" inputmode="decimal" placeholder="Otro $" aria-label="Otro monto" value="'+esc(G.custom)+'"></div><p class="impact" id="impact" aria-live="polite">'+impactHTML()+'</p><button class="btn pri" id="doGive" '+(a>0?'':'disabled')+'>Donar '+(a>0?money(a)+(G.f?' / mes':''):'')+'</button><div><p class="small" style="margin-bottom:4px">Tu aporte cubre:</p><ul class="uses">'+USES.map(function(u){return '<li>'+ico(u[0])+'<span>'+u[1]+'</span></li>'}).join('')+'</ul></div><p class="small">Montos de ejemplo. Transferencia por ahora; tarjeta y PayPal próximamente.</p>';
  paintDtop();
}
function syncGive(){var a=amount(),b=$('#doGive'),im=$('#impact'),big=$('#bigAmt');if(big){big.innerHTML=money(a)+'<small>'+(G.f?'/ mes':'una vez')+'</small>';big.classList.remove('bump');void big.offsetWidth;big.classList.add('bump')}if(im)im.innerHTML=impactHTML();if(b){b.disabled=!(a>0);b.textContent='Donar '+(a>0?money(a)+(G.f?' / mes':''):'')}paintDtop()}
document.addEventListener('click',function(e){
  var f=e.target.closest('[data-gf]');if(f){G.f=+f.getAttribute('data-gf');renderGive();return}
  var m=e.target.closest('[data-ga]');if(m){G.a=+m.getAttribute('data-ga');G.custom='';renderGive();return}
  if(e.target.closest('#doGive')&&amount()>0){G.bank=true;renderGive();return}
  if(e.target.closest('#giveBack')){G.bank=false;renderGive();return}
  var c=e.target.closest('[data-cb]');if(c){var b=BANK[+c.getAttribute('data-cb')];copy(b[1],b[0]+' copiado')}
});
document.addEventListener('input',function(e){if(e.target.id==='customAmt'){G.custom=e.target.value;G.a=-1;$$('.amts button').forEach(function(x){x.setAttribute('aria-pressed','false')});syncGive()}});

var CV={org:'',name:'',mail:'',msg:''},cTried=false,cOk=false;
function renderConv(){
  var el=$('#conv'),v=CV,t=cTried;
  if(cOk){el.innerHTML=HILL+'<div class="ctop"><div><span class="k">Convenios</span><h3>Solicitud enviada</h3></div>'+sacha('gracias',{alt:''})+'</div><div class="thanks"><p>Gracias, '+esc(v.name)+'. Te escribiremos a '+esc(v.mail)+' para conversar el convenio.</p><p class="proto-note">Maqueta: el formulario aún no está conectado a un correo.</p><div><button class="link" id="convBack">← Volver</button></div></div>';return}
  el.innerHTML=HILL+'<div class="ctop"><div><span class="k">Voluntariado y convenios</span><h3>Suma a tu universidad u organización</h3></div>'+sacha('guino',{alt:''})+'</div><p class="small">Es la única vía de voluntariado: por seguridad no recibimos visitas ni voluntarios externos en el centro de rescate.</p><form id="convForm" novalidate style="display:grid;gap:12px"><div class="fields">'+
   fld('cOrg','Institución *','<input id="cOrg" autocomplete="organization" value="'+esc(v.org)+'">',t&&!v.org.trim(),'Escribe el nombre de la institución')+
   fld('cName','Tu nombre *','<input id="cName" autocomplete="name" value="'+esc(v.name)+'">',t&&!v.name.trim(),'Escribe tu nombre')+
   fld('cMail','Correo *','<input id="cMail" type="email" autocomplete="email" value="'+esc(v.mail)+'">',t&&!validMail(v.mail),'Correo no válido')+
   fld('cMsg','¿Qué les gustaría hacer juntos? (opcional)','<textarea id="cMsg" placeholder="Investigación, prácticas, campañas…">'+esc(v.msg)+'</textarea>',false,'')+
   '</div><button class="btn pri" type="submit" style="justify-self:start">Enviar solicitud</button></form>';
}
document.addEventListener('input',function(e){var m={cOrg:'org',cName:'name',cMail:'mail',cMsg:'msg'}[e.target.id];if(m)CV[m]=e.target.value});
document.addEventListener('submit',function(e){if(e.target.id!=='convForm')return;e.preventDefault();var v=CV,ok=v.org.trim()&&v.name.trim()&&validMail(v.mail);if(ok){cOk=true;cTried=false}else cTried=true;renderConv();if(!ok){var b=$('#convForm .bad input');if(b)b.focus()}});
document.addEventListener('click',function(e){if(e.target.closest('#convBack')){cOk=false;CV={org:'',name:'',mail:'',msg:''};renderConv()}});

/* ======================  REDES Y PIE  ====================== */
function netHref(n){return n.url||'#redes'}
$('#nets').innerHTML=Object.keys(NETS).map(function(k,i){var n=NETS[k];return '<a class="net rv" style="--c:'+n.c+';--tc:'+n.t+';--d:'+(i*.08)+'s" href="'+netHref(n)+'" data-follow="'+k+'" target="'+(n.url?'_blank':'_self')+'" rel="noopener"><span class="nm">'+n.ab+'</span><b>'+n.name+'</b><p>'+esc(n.what)+'</p><span class="h">'+esc(n.handle)+'</span><span class="go">Seguir '+ico('i-arrow')+'</span></a>'}).join('');
$('#footNets').innerHTML=Object.keys(NETS).map(function(k){var n=NETS[k];return '<li><a href="'+netHref(n)+'" data-follow="'+k+'" target="'+(n.url?'_blank':'_self')+'" rel="noopener">'+n.name+'</a></li>'}).join('');
$('#footSacha').innerHTML=sacha('explora',{alt:'Sacha se va a explorar'});

/* ======================  ARRANQUE, REVELADOS Y OJOS DEL LOGO  ====================== */

/* ======================  PORTADA: CIFRAS Y «¿ENCONTRASTE UNA…?»  ====================== */
var NUMS=[
 {c:'arena',pre:'Desde',n:'2018',t:'Nace la fundación'},
 {c:'menta',pre:'Más de',n:'3.500',t:'Animales atendidos desde 2018 (cifra de inicios de 2023)'},
 {c:'selva',pre:'Cerca de',n:'1.100',t:'Auxiliados solo en 2022'},
 {c:'terra',pre:'Operar un año cuesta',n:'$350.000',t:'Las donaciones hoy no alcanzan'}
];
$('#nums').innerHTML=NUMS.map(function(n,i){return '<li class="nm2 '+n.c+' rv" style="--d:'+(i*.08)+'s"><small>'+n.pre+'</small><b>'+n.n+'</b><span>'+n.t+'</span></li>'}).join('');

/* Fichas: cada una es una lámina «Todo sobre…» y también la guía de qué hacer. v = composición del manual:
   a (menta + foto en esquina), b (foto + curva dorada + Sacha), c (crema + foto en arco), p (patrón + Sacha) */
var FICHAS=[
 {id:'zarigueya',grupo:'Mamífero',v:'p',pat:'manchas',tab:'selva',pre:'Todo sobre las',name:'zarigüeyas',art:'una',single:'zarigüeya',state:'importante',mood:'guino',ani:'mamifero',cap:0,
  dato:'Marsupial nocturno que come insectos, frutas, carroña y pequeños animales. Ayuda a controlar plagas y a dispersar semillas.',src:['UTPL','https://noticias.utpl.edu.ec/printpdf/node/3592'],
  myth:['Es peligrosa y transmite la rabia.','Es inofensiva. Que transmita la rabia es un mito.'],
  do:['Déjale un camino libre hacia afuera: casi siempre se aleja sola de noche.','Aleja a perros, gatos y niños.','Si está herida o es una cría sola en peligro, avisa al equipo.'],dont:['No la mates: es inofensiva para las personas.','No la alimentes ni la lleves a casa.']},
 {id:'iguana',grupo:'Reptil',v:'p',pat:'reptil',tab:'terra',pre:'Todo sobre las',name:'iguanas',art:'una',single:'iguana',state:'importante',mood:'curiosa',ani:'reptil',cap:2,
  dato:'La iguana verde es herbívora. Se la ve en parques y orillas tomando sol: mirarla de lejos también es respetarla.',
  do:['Obsérvala desde lejos: tomar sol es normal.','Si está herida o en la vía, avisa con una foto y la ubicación.'],dont:['No la persigas ni la agarres: puede arañar y morder.','No la alimentes ni la lleves a casa.']},
 {id:'serpiente',grupo:'Reptil',v:'c',photo:'serpiente',pre:'',name:'¡Serpientes!',art:'una',single:'serpiente',state:'serpiente',mood:'alerta',ani:'reptil',cap:5,
  dato:'La boa no es venenosa: atrapa a sus presas por constricción, sobre todo roedores y aves. Pero a simple vista no puedes saber qué serpiente es.',
  do:['Mantente a distancia y no la pierdas de vista hasta que llegue el equipo.','Aleja a niños y mascotas.','Avisa de inmediato con una foto desde lejos.'],dont:['No intentes capturarla ni matarla: no puedes saber si es venenosa.','No te acerques a mirarla de cerca.']},
 {id:'cocodrilo',grupo:'Reptil',v:'p',pat:'selva',tab:'selva',pre:'Todo sobre los',name:'cocodrilos',art:'un',single:'cocodrilo',state:'urgente',mood:'alerta',ani:'reptil',cap:5,
  dato:'El cocodrilo de la costa vive en manglares y estuarios del golfo de Guayaquil. Siempre estuvo aquí: la ciudad llegó después.',
  do:['Mantén distancia del agua y de la orilla.','Avisa de inmediato: es un animal peligroso. Si hay riesgo para personas, llama al 911.'],dont:['No te acerques ni intentes moverlo.','No lo cargues ni te tomes fotos con él.']},
 {id:'mono',grupo:'Mamífero',v:'p',pat:'selva',tab:'selva',pre:'Todo sobre los',name:'monos aulladores',art:'un',single:'mono',state:'urgente',mood:'cuidadora',ani:'grande',cap:1,
  dato:'El mono aullador de la costa se oye mucho antes de verse. La fundación ha atendido ejemplares con desnutrición y lesiones.',src:['El Universo','https://www.eluniverso.com/guayaquil/comunidad/fauna-ocelote-bebe-mono-aullador-proyecto-sacha-guayaquil-guayas-dos-mangas-nota/'],
  do:['Aléjate sin darle la espalda ni correr, y mantén lejos a otras personas.','Avisa al equipo con una foto y la ubicación exacta.'],dont:['No intentes tocarlo ni acorralarlo: un animal asustado puede defenderse.','No le des comida.']},
 {id:'ocelote',grupo:'Felino',v:'b',photo:'ocelote',pre:'Todo sobre los',name:'ocelotes',art:'un',single:'ocelote',state:'importante',mood:'orgullosa',ani:'grande',cap:3,
  dato:'Felino manchado y nocturno. Sacha, el rostro de la fundación, es un ocelote. La mascotización y los perros sueltos lo ponen en riesgo.',src:['Vistazo','https://www.vistazo.com/estilo-de-vida/sostenibilidad/meg-la-bebe-ocelote-en-peligro-por-la-quema-de-plantaciones-y-mascotizacion-CK6972334'],
  do:['Aléjate sin darle la espalda ni correr.','Avisa de inmediato al equipo.'],dont:['No intentes tocarlo ni acorralarlo.','No lo conviertas en mascota: la tenencia de fauna silvestre está regulada.']},
 {id:'rana',grupo:'Anfibio',v:'a',photo:'rana',pre:'Todo sobre las',name:'ranas',art:'una',single:'rana',state:'dato',mood:'curiosa',ani:'anfibio',cap:2,
  dato:'Los anfibios tienen la piel delicada: absorben lo que tocan. Mirarlos sin manipularlos es lo mejor para ellos.',
  do:['Obsérvala sin tocarla.','Si está en un lugar peligroso, avisa al equipo.'],dont:['No la agarres con las manos secas ni la lleves a otro lugar.']},
 {id:'aves',grupo:'Ave',v:'p',pat:'rayas',tab:'terra',pre:'Todo sobre las',name:'aves',art:'un',single:'ave',state:'importante',mood:'guino',ani:'ave',cap:2,
  dato:'Garrapateros, lechuzas de campanario y loros conviven con la ciudad. Muchos loros son víctimas del tráfico: comprar alimenta el negocio.',
  do:['Si tiene plumas y salta, sus padres suelen cuidarla desde cerca: observa de lejos.','Si no tiene plumas o está herida, avisa.'],dont:['No le des agua con jeringa ni pan: puede ahogarse.','No compres aves silvestres.']}
];
var STATE={importante:{t:'¡Importante!',bg:'#D9B97A',fg:'#24362E'},urgente:{t:'¡Urgente!',bg:'#D17A5B',fg:'#1B1210'},serpiente:{t:'¡Serpiente!',bg:'#3F5A4F',fg:'#F4EFE6'},dato:{t:'Dato',bg:'#CBEFD4',fg:'#24362E'}};
var PBAND='<svg class="band" viewBox="0 0 100 42" preserveAspectRatio="none" aria-hidden="true"><path d="M0 14 C26 30 66 -6 100 8 L100 42 L0 42 Z" fill="#AF7409"/></svg>';
function posterBody(f){
  var t='<span class="pt">'+(f.pre?'<small>'+f.pre+'</small>':'')+'<strong>'+f.name+'</strong></span>';
  if(f.v==='a')return '<img class="ph" src="assets/photos/'+f.photo+'.jpg" alt="" loading="lazy">'+t;
  if(f.v==='b')return '<img class="ph" src="assets/photos/'+f.photo+'.jpg" alt="" loading="lazy">'+PBAND+t+sacha(f.mood,{alt:''});
  if(f.v==='c')return '<img class="ph" src="assets/photos/'+f.photo+'.jpg" alt="" loading="lazy">'+t;
  return '<i class="pat" style="background-image:url(assets/patterns/'+f.pat+'.svg)"></i>'+t+sacha(f.mood,{alt:''});
}
var GF='Todos';
function renderPosters(){
  var G=['Todos','Mamífero','Reptil','Ave','Anfibio','Felino'],L={'Todos':'Todos','Mamífero':'Mamíferos','Reptil':'Reptiles','Ave':'Aves','Anfibio':'Anfibios','Felino':'Felinos'};
  $('#gfilters').innerHTML=G.map(function(g){return '<button class="filter" data-gf2="'+g+'" aria-pressed="'+(GF===g)+'">'+L[g]+'</button>'}).join('');
  $('#posters').innerHTML=FICHAS.map(function(f,i){return {f:f,i:i}}).filter(function(x){return GF==='Todos'||x.f.grupo===GF}).map(function(x){var f=x.f;return '<button class="pz '+f.v+'" data-fi="'+x.i+'" aria-label="Todo sobre: '+esc(f.name)+'" style="'+(f.tab?'--pb:'+({selva:'#3F5A4F',terra:'#D17A5B'}[f.tab])+';':'')+'">'+posterBody(f)+'<span class="pgo" aria-hidden="true">'+ico('i-arrow')+'</span></button>'}).join('');
}
document.addEventListener('click',function(e){var b=e.target.closest('[data-gf2]');if(b){GF=b.getAttribute('data-gf2');renderPosters()}});
$('#fchips').innerHTML=FICHAS.map(function(f,i){return '<button class="fchip" data-fi="'+i+'">'+f.single+'</button>'}).join('')+'<button class="fchip o" data-open-tool>otro animal</button>';

/* ======================  FICHA: ¡Encontraste una…!  ====================== */
var FI=-1,fLast=null;
function fichaHTML(f,i){
  var st=STATE[f.state];
  var art=f.photo?'<img class="ph" src="assets/photos/'+f.photo+'.jpg" alt="">':'<i class="pat" style="background-image:url(assets/patterns/'+f.pat+'.svg)"></i>';
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
  var cp=e.target.closest('[data-fcap]');if(cp){closeFicha();selectCap(+cp.getAttribute('data-fcap'),true);go('capsulas')}
});
document.addEventListener('keydown',function(e){if(FI<0)return;if(e.key==='Escape')closeFicha();if(e.key==='ArrowRight')openFicha(FI+1,true);if(e.key==='ArrowLeft')openFicha(FI-1,true);
  if(e.key==='Tab'){var els=$$('#ficha button, #ficha a[href]').filter(function(x){return x.offsetParent!==null});if(!els.length)return;var a=els[0],z=els[els.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});

/* ======================  EN LA PRENSA  ====================== */
var NEWS=[
 {s:'Vistazo',d:'Mayo 2026',t:'¿Por qué aparecieron tres iguanas marinas de Galápagos en Guayaquil en esta semana?',u:'https://www.vistazo.com/actualidad/nacional/2026-05-16-por-que-aparecieron-tres-iguanas-marinas-galapagos-guayaquil-esta-semana-HN10958942',k:'Tráfico de fauna'},
 {s:'El Comercio',t:'Denuncian presunta captura de cocodrilo en Guayaquil, tras viralización de video',u:'https://www.elcomercio.com/actualidad/guayaquil/denuncian-presunta-captura-de-cocodrilo-en-guayaquil-tras-viralizacion-de-video/',k:'Caso reciente'},
 {s:'El Telégrafo',t:'Sacha, un proyecto que vela por la fauna silvestre en Guayas',u:'https://www.eltelegrafo.com.ec/noticias/ecuador/1/sacha-proyecto-fauna-silvestre',k:'La fundación'},
 {s:'Revista Mundo Diners',t:'La fauna, víctima del horror',u:'https://revistamundodiners.com/fauna-victima-del-horror/',k:'Reportaje'},
 {s:'Primicias',t:'Sacha, el ocelote que inspiró un espacio para cuidar de la fauna silvestre',u:'https://www.primicias.ec/noticias/tecnologia/sacha-ocelote-espacio-cuidar-fauna-silvestre/',k:'Origen'},
 {s:'Vistazo',t:'Proyecto Sacha inaugurará el centro de rehabilitación y rescate de fauna silvestre más grande de la costa ecuatoriana',u:'https://www.vistazo.com/estilo-de-vida/sostenibilidad/proyecto-sacha-inaugurara-el-centro-de-rehabilitacion-y-rescate-de-fauna-silvestre-mas-grande-de-la-costa-ecuatoriana-YI4028032',k:'Centro rural'}
];
$('#news').innerHTML=NEWS.map(function(n,i){return '<a class="nw'+(i===0?' big':'')+' rv" style="--d:'+(i*.06)+'s" href="'+n.u+'" target="_blank" rel="noopener"><span class="nk">'+n.k+(n.d?' · '+n.d:'')+'</span><b>'+esc(n.t)+'</b><span class="ns">'+n.s+ico('i-ext')+'</span></a>'}).join('');
renderPosters();

renderMeet();selectCap(0,false);renderProceso();renderFaq();renderPod();renderMap();renderGive();renderConv();
$$('.mask').forEach(function(m){$$('.ln',m).forEach(function(l,i){l.style.setProperty('--i',i)})});
onScroll();
(function(){
  if(!document.documentElement.classList.contains('js'))return;
  var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})},{threshold:.12});
  $$('.mask,.rv').forEach(function(el){io.observe(el)});
  /* si algo no llegó a observarse (saltos de scroll, capturas), queda visible igualmente */
  setTimeout(function(){$$('.mask:not(.in),.rv:not(.in)').forEach(function(el){var r=el.getBoundingClientRect();if(r.top<innerHeight*1.2&&r.bottom>-innerHeight*.2)el.classList.add('in')})},2500);
  /* tras un salto de scroll, lo que quedó a la vista se revela igualmente */
  var sweepT;window.addEventListener('scroll',function(){clearTimeout(sweepT);sweepT=setTimeout(function(){$$('.mask:not(.in),.rv:not(.in)').forEach(function(el){var r=el.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0)el.classList.add('in')})},180)},{passive:true});
  if(!reduced&&matchMedia('(pointer:fine)').matches){var logos=$$('svg.logo'),raf=0,mx=0,my=0;document.addEventListener('pointermove',function(e){mx=e.clientX;my=e.clientY;if(raf)return;raf=requestAnimationFrame(function(){raf=0;logos.forEach(function(l){var r=l.getBoundingClientRect();if(!r.width||r.bottom<0||r.top>innerHeight)return;var dx=mx-(r.left+r.width/2),dy=my-(r.top+r.height/2),d=Math.hypot(dx,dy)||1,k=Math.min(1,d/320)*13;l.style.setProperty('--px',(dx/d*k).toFixed(1)+'px');l.style.setProperty('--py',(dy/d*k).toFixed(1)+'px')})})},{passive:true})}
})();
})();
