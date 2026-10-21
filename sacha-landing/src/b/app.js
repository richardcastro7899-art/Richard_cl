(function(){
'use strict';

/* ======================  CONTENIDO EDITABLE  ======================
   Videos: pega la ruta de cada .mp4 en VIDEOS (vacío = vista de maqueta). El tráiler es una imagen de referencia
   animada: reemplázalo por material propio. El costo por hora sale de YEAR_COST (presupuesto anual). */
var VIDEOS={hero:['assets/video/hero.mp4','assets/video/hero.webm'],caps:['','','','','','','',''],h:{sacha:'',pod1:'',pod2:''}};
var MOCK_SECONDS=8, YEAR_COST=350000, PER_HOUR=YEAR_COST/8760;

var TICKER=[['2018','nace la fundación, tras el rescate de Sacha en Vinces'],['+3.500','animales rescatados, recuperados o reubicados desde 2018 (cifra de 2023)'],['~1.100','animales auxiliados solo en 2022'],['$350.000','cuesta operar un año'],['$40','cuesta cada hora, de día y de noche'],['108 km','separan Guayaquil de Santa Elena en línea recta']];

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
/* cápsula que acompaña a cada hora */
var NOW={nowM:{cap:2,kick:'Cápsula de las 08:00',say:'Hábitos simples para convivir con la fauna del barrio.'},nowT:{cap:6,kick:'Cápsula de las 15:00',say:'Cómo cuidamos a un animal durante el viaje.'},nowA:{cap:7,kick:'Cápsula de las 18:00',say:'El momento que más esperamos: la liberación.'}};
var HTABS=['Historia y tráiler','Podcast'];
var HVIDS=[
 {id:'sacha',tab:0,kind:'Video · Mascota',pre:'¿Quién es',title:'Sacha?',dur:60,desc:'La historia real detrás del nombre de la fundación, contada por Sacha.',pat:'felino',m:'sacha-saluda'},
 {id:'trailer',tab:0,kind:'Tráiler',pre:'Todos los días',title:'los ves',dur:14,desc:'Avance de la serie. Imagen de referencia: se reemplaza por material propio de la fundación.',src:'hero'},
 {id:'pod1',tab:1,kind:'Podcast en video',pre:'Episodio 1',title:'Tema por definir',dur:1800,desc:'Conversación con el equipo que rescata, cura y libera. Invitado/a por confirmar.',pat:'manchas',m:'sacha-dato'},
 {id:'pod2',tab:1,kind:'Podcast en video',pre:'Episodio 2',title:'Tema por definir',dur:1800,desc:'Segundo episodio. Invitado/a y duración por confirmar.',pat:'rayas',m:'sacha-donar'}
];

/* fauna por hora del día */
var FAUNA={
 faunaM:[
  {pre:'Todo sobre el',n:'garrapatero',full:'Garrapatero',l:'Crotophaga sulcirostris',ani:'ave',pat:'selva',t:'Ave negra de pico curvo que anda en grupos por jardines y potreros y se alimenta de insectos.'},
  {pre:'Todo sobre la',n:'ardilla',full:'Ardilla de Guayaquil',l:'Simosciurus stramineus',ani:'mamifero',pat:'manchas',t:'Diurna y trepadora, común en parques y jardines. La fundación alertó sobre ardillas muertas en Lomas de Urdesa tras una presunta fumigación.',s:'Primicias',u:'https://www.primicias.ec/guayaquil/municipio-cuerpo-ardillas-urdesa-fumigacion-proyecto-sacha-104000/'}],
 faunaD:[
  {pre:'Todo sobre la',n:'iguana',full:'Iguana verde',l:'Iguana iguana',ani:'reptil',pat:'reptil',t:'Herbívora. Se la ve en parques y orillas tomando sol. Mirarla de lejos también es respetarla.'},
  {pre:'Todo sobre el',n:'cocodrilo',full:'Cocodrilo de la costa',l:'Crocodylus acutus',ani:'reptil',pat:'rayas',t:'Vive en manglares y estuarios del golfo de Guayaquil. Siempre estuvo aquí: la ciudad llegó después.'}],
 faunaN:[
  {pre:'Todo sobre la',n:'zarigüeya',full:'Zarigüeya común',l:'Didelphis marsupialis',ani:'mamifero',pat:'manchas',t:'Marsupial nocturno: come insectos, frutas y carroña, y ayuda a controlar plagas. Es inofensiva.',s:'UTPL',u:'https://noticias.utpl.edu.ec/printpdf/node/3592'},
  {pre:'Todo sobre la',n:'lechuza',full:'Lechuza de campanario',l:'Tyto alba',ani:'ave',pat:'selva',t:'Cazadora nocturna de roedores. Anida en techos y construcciones.'},
  {pre:'Todo sobre el',n:'ocelote',full:'Ocelote',l:'Leopardus pardalis',ani:'grande',pat:'felino',t:'Felino manchado y nocturno, como Sacha. La mascotización y los perros sueltos lo ponen en riesgo.',s:'Vistazo',u:'https://www.vistazo.com/estilo-de-vida/sostenibilidad/meg-la-bebe-ocelote-en-peligro-por-la-quema-de-plantaciones-y-mascotizacion-CK6972334'}]
};
var STORIES=[
 {pre:'Ocelote bebé y mono aullador',title:'Dos Mangas',pat:'selva',bg:'#24362E',t:'Encontrados con signos de desnutrición y lesiones, y atendidos por la fundación.',s:'El Universo',u:'https://www.eluniverso.com/guayaquil/comunidad/fauna-ocelote-bebe-mono-aullador-proyecto-sacha-guayaquil-guayas-dos-mangas-nota/'},
 {pre:'Un ocelote atacado por perros',title:'Bucay',pat:'manchas',bg:'#3F5A4F',t:'Necesitó cirugías después del ataque de varios perros.',s:'Vistazo',u:'https://www.vistazo.com/sostenibilidad/un-ocelote-que-fue-atacado-por-varios-perros-en-bucay-requiere-de-cirugias-AX2671763'},
 {pre:'Meg, la bebé',title:'ocelote',pat:'rayas',bg:'#24362E',t:'En peligro por la quema de plantaciones y la mascotización.',s:'Vistazo',u:'https://www.vistazo.com/estilo-de-vida/sostenibilidad/meg-la-bebe-ocelote-en-peligro-por-la-quema-de-plantaciones-y-mascotizacion-CK6972334'},
 {pre:'Oso hormiguero herido',title:'Guayaquil',pat:'reptil',bg:'#3F5A4F',t:'Hallado herido por perros dentro de un recinto militar de la ciudad.',s:'Expreso',u:'https://www.expreso.ec/guayaquil/policia-halla-oso-hormiguero-herido-por-perros-en-recinto-militar-de-guayaquil-279129.html'}
];
var ORIGIN={t:['Sacha, una cría de ocelote de unos diez días de vida, llegó en junio de 2018 a manos de la Dra. Eliana Molineros. Estaba a la venta en una tienda de Vinces, en poder de traficantes de fauna.','No pudo regresar a su hábitat, pero su historia dio origen a la Fundación Proyecto Sacha, que hoy rehabilita fauna del Guayas y la devuelve a su medio.'],src:[['Vistazo','https://www.vistazo.com/estilo-de-vida/sostenibilidad/sacha-el-ocelote-que-no-pudo-regresar-a-su-habitat-pero-inspiro-un-enorme-proyecto-CE1336316'],['Primicias','https://www.primicias.ec/noticias/tecnologia/sacha-ocelote-espacio-cuidar-fauna-silvestre/']]};
var QUIZ=[
 {q:'La zarigüeya transmite la rabia y es peligrosa.',a:false,t:'Es inofensiva, huye de las personas y ayuda a controlar plagas.',s:'Expreso · UTPL'},
 {q:'Si encuentras una cría sola, siempre está abandonada.',a:false,t:'Muchas veces su madre está cerca y no se acerca si hay gente. Obsérvala de lejos y avisa.'},
 {q:'Darle leche a un animal silvestre lo ayuda a recuperarse.',a:false,t:'Puede enfermarlo o ahogarlo. Nunca le des comida ni bebida; avisa al equipo.'},
 {q:'Cada animal que llega a la fundación se informa al Ministerio del Ambiente.',a:true,t:'Cada ingreso se informa a la autoridad ambiental y la liberación se coordina con ella.'},
 {q:'Proyecto Sacha está en la Amazonía.',a:false,t:'Estamos en la costa: Guayaquil y la provincia de Santa Elena.'}
];
var PHOTOS=[['rayas','Cirugía a un ejemplar con fractura'],['felino','Preparando medicación'],['manchas','Revisión clínica'],['selva','Recintos de rehabilitación']];
var SEDES=[
 {n:'01',kind:'Centro urbano',name:'Guayaquil',pin:'Guayaquil',desc:'Recepción médica y rescates urbanos.',pos:[74.17,42.62],dy:-34,q:'Guayaquil, Ecuador'},
 {n:'02',kind:'Centro rural',name:'Santa Elena',pin:'Centro rural',desc:'Rehabilitación y liberación. Ubicación referencial: sector Chanduy.',pos:[54.71,52.0],dy:36,q:'Chanduy, Santa Elena, Ecuador'}
];
var MREF=[{name:'Santa Elena',pos:[17.12,45.11]}];
var SITS=[
 {id:'herido',ic:'i-med',c:'#D17A5B',title:'Está herido o en peligro',sub:'Atropellado, atrapado, sangrando o con dificultad para moverse.',urg:'Urgente · avisa ya',
  do:['Mantén la distancia y no lo persigas: el estrés puede empeorar sus lesiones.','Aleja a perros, gatos y niños, y baja el ruido.','Toma una foto o un video corto desde lejos y anota la ubicación exacta.','Avisa al equipo de inmediato. Si te lo indican, cúbrelo con una tela y déjalo en una caja ventilada, oscura y tranquila.'],
  dont:['No le des comida, agua ni leche.','No lo cargues con las manos desnudas.','No lo lleves a casa ni intentes curarlo.','No lo traslades por tu cuenta sin la indicación del equipo.']},
 {id:'cria',ic:'i-baby',c:'#AF7409',title:'Es una cría y está sola',sub:'Sin pelo o plumas completas, o llorando, y no ves a la madre.',urg:'Prioritario',
  do:['Obsérvala desde lejos un buen rato: su madre puede estar cerca.','Aleja a perros, gatos y niños.','Si está en peligro inmediato, avisa de inmediato.','Toma una foto y anota la hora, el lugar y cuántas crías hay.'],
  dont:['No la alimentes: ni leche, ni agua, ni comida de mascotas.','No la tomes en brazos ni la lleves a casa.','No la conviertas en mascota: la tenencia de fauna silvestre está regulada por ley.']},
 {id:'casa',ic:'i-home',c:'#3F5A4F',title:'Entró a mi casa, patio o techo',sub:'Está en un lugar donde no debería estar.',urg:'Evalúa con calma',
  do:['Dale espacio: casi siempre quiere salir tanto como tú quieres que salga.','Encierra a las mascotas y saca a los niños de la habitación.','Abre puertas o ventanas hacia afuera y deja un camino libre.','Si no sale, toma una foto desde lejos y avisa.'],
  dont:['No lo acorrales ni lo golpees.','No uses insecticidas, humo ni trampas de pegamento.','No lo agarres con las manos.']},
 {id:'trafico',ic:'i-cart',c:'#24362E',title:'Alguien lo tiene o lo vende',sub:'En una casa, un local o un anuncio como mascota o producto.',urg:'Denuncia',
  do:['Cuida tu seguridad: no confrontes a la persona.','Si puedes sin riesgo, guarda fotos o capturas del anuncio, el lugar y la fecha.','Reporta: la fundación informa a la Policía de Medio Ambiente y al Ministerio del Ambiente.'],
  dont:['No compres al animal: comprar alimenta el tráfico.','No intentes quitárselo a la persona.']}
];
var ANIS=[
 {id:'mamifero',ic:'i-paw',c:'#AF7409',title:'Mamífero',eg:'zarigüeya, ardilla, murciélago',do:['Si es una zarigüeya, casi siempre se aleja sola de noche: déjale un camino libre.'],dont:['No la mates: es inofensiva para las personas.']},
 {id:'ave',ic:'i-leaf',c:'#3F5A4F',title:'Ave',eg:'garrapatero, lechuza, loro',do:['Si tiene plumas y salta, sus padres suelen cuidarla desde cerca; si no tiene plumas o está herida, avisa.'],dont:['No le des agua con jeringa ni pan.']},
 {id:'reptil',ic:'i-alert',c:'#D17A5B',title:'Reptil',eg:'iguana, serpiente, cocodrilo',danger:true,do:['Si es una serpiente, mantente a distancia y no la pierdas de vista hasta que llegue el equipo.'],dont:['No intentes capturar ni matar a una serpiente.','No te acerques a un cocodrilo ni a la orilla donde está.']},
 {id:'grande',ic:'i-paw',c:'#24362E',title:'Animal grande',eg:'felino, venado, mono, oso hormiguero',danger:true,do:['Aléjate sin darle la espalda ni correr, y mantén lejos a otras personas.'],dont:['No intentes tocarlo ni acorralarlo.']},
 {id:'nose',ic:'i-info',c:'#D9B97A',title:'No sé qué es',eg:'una foto desde lejos ayuda',do:['No hace falta saberlo: una foto desde lejos ayuda al equipo a identificarlo.'],dont:[]}
];
var NUMS=[{k:'ECU 911',v:'911',note:'Emergencias. Si hay riesgo para personas o un animal peligroso en la vía pública.'},{k:'Línea de la fundación',v:'',note:'Número de reportes por definir.'}];
var BANK=[['Banco','Banco Internacional'],['Cuenta corriente','1400625249'],['A nombre de','Fundación Proyecto Sacha'],['RUC','0993242721001'],['Correo','donaciones@proyectosacha.org']];

/* ======================  UTILIDADES  ====================== */
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var reduced=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function fmt(s){s=Math.round(s);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
function ico(id){return '<svg class="ic" aria-hidden="true"><use href="#'+id+'"/></svg>'}
function money(n){return '$'+Math.round(n).toLocaleString('es-EC')}
function toast(m){var t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(function(){t.classList.remove('show')},2400)}
function copy(txt,msg){function ok(){toast(msg||'Copiado')}function fb(){var a=document.createElement('textarea');a.value=txt;a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();try{document.execCommand('copy');ok()}catch(e){toast('Selecciona el texto y cópialo')}a.remove()}try{navigator.clipboard.writeText(txt).then(ok,fb)}catch(e){fb()}}
function go(id){var el=document.getElementById(id);if(!el)return;window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-60,behavior:reduced?'auto':'smooth'})}
function plate(o){
  return '<div class="plate" style="--pb:'+(o.bg||'#3F5A4F')+'"><div class="pt" style="background-image:url(assets/patterns/'+o.pat+'.svg)"></div>'+
   '<svg class="wave" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path d="M0 12C22 2 40 22 62 12S90 2 100 8V40H0Z"/></svg>'+
   '<div class="ptx"><small>'+esc(o.pre||'')+'</small><b>'+esc(o.title||'')+'</b></div>'+(o.m?'<img class="pm" src="assets/mascot/'+o.m+'.webp" alt="" loading="lazy">':'')+'</div>';
}
function hex(h){h=h.replace('#','');return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]}
function lerp(a,b,t){return a+(b-a)*t}
function hhmm(h){h=((h%24)+24)%24;var m=Math.floor((h%1)*60/5)*5;return [String(Math.floor(h)).padStart(2,'0'),String(m).padStart(2,'0')]}
document.addEventListener('click',function(e){
  var g=e.target.closest('[data-go]');if(g){e.preventDefault();go(g.getAttribute('data-go'))}
  var n=e.target.closest('[data-noop]');if(n){e.preventDefault();toast('Este enlace se conecta cuando esté definido')}
  var c=e.target.closest('[data-copy-num]');if(c){var v=c.getAttribute('data-copy-num');copy(v,v+' copiado')}
});

/* ======================  EL CIELO, EL RELOJ Y LA LÍNEA DE HORAS  ====================== */
var SKY=$$('[data-sky]').map(function(el){return {el:el,c:hex(el.getAttribute('data-sky')),h:+el.getAttribute('data-h'),lbl:el.getAttribute('data-lbl'),dark:el.classList.contains('d')}});
$('#hours').innerHTML=SKY.slice(0,-1).map(function(s){var t=hhmm(s.h);return '<button data-go="'+s.el.id+'" data-hr="'+s.el.id+'"><b>'+t[0]+':'+t[1]+'</b><span>'+s.lbl+'</span></button>'}).join('');
var lastSky='';
function arcPath(f){var a=f*Math.PI*2-Math.PI/2,x=24+19*Math.cos(a),y=24+19*Math.sin(a);if(f<=0)return '';return 'M24 5 A19 19 0 '+(f>.5?1:0)+' 1 '+x.toFixed(2)+' '+y.toFixed(2)}
function sky(){
  /* el color se mantiene dentro de cada hora y se funde con la siguiente al acercarse al borde; la hora corre siempre */
  var mid=innerHeight*.55,k=0,prog=0,t=0;
  for(var i=0;i<SKY.length;i++){var r=SKY[i].el.getBoundingClientRect();if(r.top<=mid){k=i;prog=Math.min(1,(mid-r.top)/r.height);var left=r.bottom-mid,zone=innerHeight*.28;t=left<zone?Math.min(1,1-left/zone):0}}
  if(k>=SKY.length-1){k=SKY.length-2;prog=1;t=1}
  var a=SKY[k],b=SKY[k+1],rgb=[0,1,2].map(function(j){return Math.round(lerp(a.c[j],b.c[j],t))}),col='rgb('+rgb.join(',')+')';
  if(col!==lastSky){lastSky=col;document.documentElement.style.setProperty('--sky',col)}
  var h=lerp(a.h,b.h,prog),tt=hhmm(h),dark=(rgb[0]*.299+rgb[1]*.587+rgb[2]*.114)<120;
  $('#hudTime').innerHTML=tt[0]+'<i>:</i>'+tt[1];
  var cur=t<.5?a:b;$('#hudLbl').textContent=cur.lbl+' en Guayaquil';
  $('#hudCost').textContent='Este día cuesta '+money(Math.max(0,h-6)*PER_HOUR)+' hasta ahora';
  var day=((h%24)+24)%24,f=day/24,ang=f*Math.PI*2-Math.PI/2,orb=$('#hudOrb');
  orb.setAttribute('cx',(24+19*Math.cos(ang)).toFixed(2));orb.setAttribute('cy',(24+19*Math.sin(ang)).toFixed(2));orb.setAttribute('fill',day>=6&&day<18.5?'#D9B97A':'#F4EFE6');
  $('#hudArc').setAttribute('d',arcPath(Math.min(.999,Math.max(0,(h-6)/24))));
  $('#hud').classList.toggle('d',dark);$('#top').classList.toggle('d',dark);
  $$('#hours button').forEach(function(btn){btn.setAttribute('aria-current',btn.getAttribute('data-hr')===cur.el.id?'true':'false')});
  var H=document.documentElement.scrollHeight-innerHeight;$('#prog').style.width=(H>0?scrollY/H*100:0)+'%';
  van();var fr=$('#contacto').getBoundingClientRect();$('#sunup').style.setProperty('--rise',Math.max(0,Math.min(1,(innerHeight-fr.top)/fr.height)).toFixed(3));
}
window.addEventListener('scroll',sky,{passive:true});window.addEventListener('resize',sky);
$('#goTop').addEventListener('click',function(){window.scrollTo({top:0,behavior:reduced?'auto':'smooth'})});
$('#again').addEventListener('click',function(){window.scrollTo({top:0,behavior:reduced?'auto':'smooth'})});

/* ======================  AMANECER: TRÁILER DENTRO DEL SOL  ====================== */
(function(){
  var v=$('#heroVid'),b=$('#heroPause'),lab=$('span',b),use=$('use',b),srcs=[].concat(VIDEOS.hero||[]),fails=0,manual=false,auto=false;
  if(reduced)v.removeAttribute('autoplay');
  v.innerHTML=srcs.map(function(u){return '<source src="'+u+'" type="video/'+(/\.webm$/.test(u)?'webm':'mp4')+'">'}).join('');v.load();
  function ui(p){lab.textContent=p?'Pausar':'Reproducir';use.setAttribute('href',p?'#i-pause':'#i-play');b.setAttribute('aria-label',p?'Pausar el video':'Reproducir el video')}
  function play(){var p=v.play();if(p&&p.catch)p.catch(function(){})}
  v.addEventListener('play',function(){ui(true)});v.addEventListener('pause',function(){ui(false)});
  v.addEventListener('error',function(){if(++fails>=srcs.length)b.style.display='none'},true);ui(false);
  b.addEventListener('click',function(){manual=true;if(v.paused)play();else v.pause()});
  if('IntersectionObserver' in window)new IntersectionObserver(function(es){if(!es[0].isIntersecting){if(!v.paused){auto=true;v.pause()}}else if(auto&&!manual){auto=false;play()}},{threshold:.05}).observe($('.sun'));
})();
$('#ticker').innerHTML=(function(){var x=TICKER.map(function(t){return '<span><b>'+t[0]+'</b>'+t[1]+'</span>'}).join('');return x+x})();

/* ======================  FICHAS, CÁPSULAS DE LA HORA E HISTORIAS  ====================== */
function fx(f){return '<article class="fx"><div class="cov">'+plate({pat:f.pat,pre:f.pre,title:f.n})+'</div><div class="in"><h3>'+f.full+'</h3><em>'+f.l+'</em><p>'+esc(f.t)+'</p><div class="foot"><button class="btn line sm" data-fani="'+f.ani+'">Si lo encuentras</button>'+(f.s?'<span class="src">Fuente: <a href="'+f.u+'" target="_blank" rel="noopener">'+f.s+'</a></span>':'')+'</div></div></article>'}
Object.keys(FAUNA).forEach(function(k){$('#'+k).innerHTML=FAUNA[k].map(fx).join('')});
function capCover(i){var c=CAPS[i],t=TABS[c.tab];return plate({pat:t.pat,bg:t.bg,pre:c.pre,title:c.title,m:c.m})}
function rc(i){var c=CAPS[i];return '<button class="rc" data-cap="'+i+'" aria-label="Ver cápsula '+(i+1)+': '+esc(c.pre+' '+c.title)+'">'+capCover(i)+'<span class="num">'+(i+1)+'</span><span class="dur">'+fmt(c.dur)+'</span><span class="pl">'+ico('i-play')+'</span></button>'}
Object.keys(NOW).forEach(function(k){var n=NOW[k],c=CAPS[n.cap];$('#'+k).innerHTML=rc(n.cap)+'<div class="in"><span class="label">'+n.kick+'</span><h3>'+esc(c.pre+' '+c.title)+'</h3><p>'+esc(n.say)+'</p><div><button class="btn pri sm" data-cap="'+n.cap+'">'+ico('i-play')+'Ver cápsula</button></div></div>'});
$('#strip').innerHTML=PHOTOS.map(function(p){return '<div class="ph"><div class="pt" style="background-image:url(assets/patterns/tone-sage-'+p[0]+'.svg)"></div><div class="cam"><span>'+ico('i-cam')+'</span></div><p>'+p[1]+' · foto pendiente</p></div>'}).join('');
$('#origin').innerHTML='<figure><img src="assets/mascot/sacha-saluda.webp" alt="Sacha, mascota inspirada en el ocelote rescatado" width="1228" height="1976" loading="lazy"></figure><div class="in"><span class="label" style="color:#526459">Junio de 2018 · Vinces</span><h3>Una cría de ocelote y la fundación que nació de ella</h3>'+ORIGIN.t.map(function(p){return '<p>'+esc(p)+'</p>'}).join('')+'<p class="src">Fuentes: '+ORIGIN.src.map(function(s){return '<a href="'+s[1]+'" target="_blank" rel="noopener">'+s[0]+'</a>'}).join(' · ')+'</p><div><button class="btn pri sm" data-hplay="sacha">'+ico('i-play')+'Ver «¿Quién es Sacha?»</button></div></div>';
$('#stories').innerHTML=STORIES.map(function(s){return '<article class="fx"><div class="cov">'+plate({pat:s.pat,bg:s.bg,pre:s.pre,title:s.title})+'</div><div class="in"><p>'+esc(s.t)+'</p><div class="foot"><a class="src" href="'+s.u+'" target="_blank" rel="noopener">Leer en '+s.s+' ↗</a><button class="btn line sm" data-go="madrugada">'+ico('i-heart')+'Ayudar</button></div></div></article>'}).join('');
(function(){var st='';for(var i=0;i<60;i++){st+='<i style="left:'+(Math.random()*100).toFixed(1)+'%;top:'+(Math.random()*70).toFixed(1)+'%;animation-delay:'+(Math.random()*3).toFixed(2)+'s;opacity:.'+(2+Math.floor(Math.random()*7))+'"></i>'}$('#stars').innerHTML=st})();

/* ======================  QUIZ DEL MEDIODÍA  ====================== */
var Q={i:0,ans:[]};
function renderQuiz(){
  var el=$('#quizBox'),done=Q.i>=QUIZ.length,ok=Q.ans.filter(Boolean).length,answered=Q.ans.length>Q.i;
  var pose=done?(ok>=4?'sacha-dato':'sacha-saluda'):(answered?(Q.ans[Q.i]?'sacha-dato':'sacha-donar'):'sacha-saluda');
  var bar='<div class="qbar" aria-hidden="true">'+QUIZ.map(function(x,i){return '<i class="'+(i<Q.ans.length?(Q.ans[i]?'ok':'ko'):(i===Q.i?'cur':''))+'"></i>'}).join('')+'</div>',body;
  if(done)body='<span class="label" style="color:#C3D5CA">Resultado</span><p class="qtext">'+ok+' de '+QUIZ.length+'. '+(ok===QUIZ.length?'¡Reconoces a tus vecinos!':ok>=3?'¡Muy bien!':'Ahora ya sabes un poco más.')+'</p><div class="qbtns"><button class="btn mint" id="qShare">'+ico('i-share')+'Compartir</button><button class="btn line" id="qAgain">Jugar de nuevo</button><button class="btn line" data-cap="0">'+ico('i-play')+'Ver «Mitos sobre la zarigüeya»</button></div>';
  else{var x=QUIZ[Q.i];body='<span class="label" style="color:#C3D5CA">Frase '+(Q.i+1)+' de '+QUIZ.length+'</span><p class="qtext" id="qText" tabindex="-1">«'+esc(x.q)+'»</p>'+(answered?'<div class="qfb '+(Q.ans[Q.i]?'ok':'ko')+'"><b>'+(Q.ans[Q.i]?'¡Exacto! ':'Casi. ')+(x.a?'Es realidad.':'Es un mito.')+'</b><p>'+esc(x.t)+'</p>'+(x.s?'<span class="small">Fuente: '+x.s+'</span>':'')+'</div><div class="qbtns"><button class="btn mint" id="qNext">'+(Q.i<QUIZ.length-1?'Siguiente':'Ver resultado')+' '+ico('i-arrow')+'</button></div>':'<div class="qbtns"><button class="btn urg" data-qa="0">Mito</button><button class="btn mint" data-qa="1">Realidad</button></div>')}
  el.innerHTML='<figure class="qfig"><span class="qscore">'+ok+' / '+QUIZ.length+'</span><img src="assets/mascot/'+pose+'.webp" alt="Sacha reacciona a tu respuesta"></figure><div class="qbody">'+bar+body+'</div>';
}
document.addEventListener('click',function(e){
  var a=e.target.closest('[data-qa]');if(a){Q.ans[Q.i]=(a.getAttribute('data-qa')==='1')===QUIZ[Q.i].a;renderQuiz();var n=$('#qNext');if(n)n.focus({preventScroll:true});return}
  if(e.target.closest('#qNext')){Q.i++;renderQuiz();var t=$('#qText');if(t)t.focus({preventScroll:true});return}
  if(e.target.closest('#qAgain')){Q={i:0,ans:[]};renderQuiz();return}
  if(e.target.closest('#qShare')){copy('Saqué '+Q.ans.filter(Boolean).length+' de '+QUIZ.length+' en «¿Mito o realidad?» de Proyecto Sacha. '+location.href.split('#')[0],'Resultado copiado')}
});

/* ======================  TARDE: MAPA Y CAMIONETA EN RUTA  ====================== */
var S={sede:0};
function renderMap(){
  var box=$('#mapbox');$$('.mpin,.mref',box).forEach(function(n){n.remove()});
  MREF.forEach(function(r){var d=document.createElement('div');d.className='mref';d.style.left=r.pos[0]+'%';d.style.top=r.pos[1]+'%';d.innerHTML='<i></i><span>'+r.name+'</span>';box.appendChild(d)});
  SEDES.forEach(function(d,i){var b=document.createElement('button');b.className='mpin';b.style.left=d.pos[0]+'%';b.style.top=d.pos[1]+'%';b.style.setProperty('--dy',d.dy+'px');b.setAttribute('aria-pressed',S.sede===i);b.setAttribute('data-sede',i);b.setAttribute('aria-label','Sede: '+d.pin);b.innerHTML='<i></i><span>'+d.pin+'</span>';box.appendChild(b)});
  $('#sedes').innerHTML=SEDES.map(function(d,i){return '<div class="sede'+(S.sede===i?' on':'')+'"><span class="label" style="color:#526459">Sede '+d.n+' · '+d.kind+'</span><h3><button data-sede="'+i+'">'+d.name+'</button></h3><span>'+d.desc+'</span><span class="meta"><span>Dirección y horario: por confirmar</span></span><a class="btn line sm" href="https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(d.q)+'" target="_blank" rel="noopener">Ver zona en Google Maps '+ico('i-ext')+'</a></div>'}).join('')+'<div class="note">'+ico('i-info')+'<span>Por seguridad no recibimos visitas: resguardamos animales de incautaciones y allanamientos.</span></div>';
}
document.addEventListener('click',function(e){var b=e.target.closest('[data-sede]');if(b){S.sede=+b.getAttribute('data-sede');renderMap()}});
function van(){var sec=$('#tarde'),r=sec.getBoundingClientRect(),p=Math.max(0,Math.min(1,(innerHeight*.7-r.top)/(r.height*.8))),a=[74.17,42.62],b=[17.12,45.11],v=$('#van');
  v.style.setProperty('--vx',lerp(a[0],b[0],p).toFixed(2)+'%');v.style.setProperty('--vy',lerp(a[1],b[1],p).toFixed(2)+'%')}

/* ======================  NOCHE: GUÍA DE ACCIÓN  ====================== */
var T;function resetTool(){T={step:0,sit:-1,ani:-1,chk:{},tried:false,sent:false,f:{type:'',sit:'',where:'',desc:'',name:'',phone:'',ok:false,photo:''}}}resetTool();
function reach(){return T.sit<0?0:(T.ani<0?1:3)}
function validPhone(p){return String(p).replace(/\D/g,'').length>=7}
function lookup(l,id){return l.filter(function(x){return x.id===id})[0]||l[0]}
function stepper(){var L=['Situación','Animal','Qué hacer','Avisar'],r=reach();return '<ol class="tsteps">'+L.map(function(l,i){var cur=T.step===i,done=i<T.step||(T.sent&&i===3);return '<li><button class="'+(done?'done':'')+'" '+(cur?'aria-current="step" ':'')+(i>r?'disabled ':'')+'data-tstep="'+i+'"><span class="n">'+(done?ico('i-check'):(i+1))+'</span><span>'+l+'</span></button></li>'}).join('')+'</ol>'}
function opt(attr,i,o,p,sub){return '<button class="opt" '+attr+'="'+i+'" aria-pressed="'+p+'" style="--c:'+o.c+'"><span class="oi">'+ico(o.ic)+'</span><b>'+o.title+'</b><span>'+sub+'</span></button>'}
function safety(){return '<div class="safety">'+ico('i-alert')+'<p>Tu seguridad va primero. Si hay riesgo para personas, llama al <button data-copy-num="911" aria-label="Copiar 911">911</button>.</p></div>'}
function fld(id,label,inner,bad,err,wide){return '<div class="fld'+(bad?' bad':'')+(wide?' wide':'')+'"><label for="'+id+'">'+label+'</label>'+inner+'<span class="err" role="alert">'+err+'</span></div>'}
function body(){
  if(T.step===0)return '<div class="tbody"><h3 class="tq" id="tq" tabindex="-1">¿Qué está pasando?</h3>'+(T.ani>=0?'<p class="small" style="color:#526459">Tipo de animal elegido: <b>'+ANIS[T.ani].title+'</b>. <button class="linkbtn" data-tstep="1">Cambiar</button></p>':'')+'<div class="opts">'+SITS.map(function(s,i){return opt('data-sit',i,s,T.sit===i,s.sub)}).join('')+'</div>'+safety()+'</div>';
  if(T.step===1)return '<div class="tbody"><h3 class="tq" id="tq" tabindex="-1">¿Qué tipo de animal es?</h3><div class="opts">'+ANIS.map(function(a,i){return opt('data-ani',i,a,T.ani===i,a.eg)}).join('')+'</div><div class="backrow"><button class="linkbtn" data-tstep="0">← Cambiar la situación</button></div></div>';
  var s=SITS[T.sit],a=ANIS[T.ani];
  if(T.step===2){var d=s.do.concat(a.do),n=s.dont.concat(a.dont);return '<div class="tbody"><span class="urgtag">'+s.urg+'</span><h3 class="tq" id="tq" tabindex="-1">'+s.title+' · '+a.title+'</h3>'+(a.danger?safety():'')+'<div class="rcols"><div class="rbox do"><h4>Haz esto</h4>'+d.map(function(x,i){return '<button class="chk" role="checkbox" aria-checked="'+!!T.chk['d'+i]+'" data-chk="d'+i+'"><i>'+ico('i-check')+'</i><span>'+esc(x)+'</span></button>'}).join('')+'</div><div class="rbox dont"><h4>No hagas esto</h4><ul class="nox">'+n.map(function(x){return '<li>'+ico('i-x')+'<span>'+esc(x)+'</span></li>'}).join('')+'</ul></div></div><div class="ract"><button class="btn urg" data-tstep="3">Reportar este caso '+ico('i-arrow')+'</button><button class="linkbtn" data-treset>Empezar de nuevo</button></div></div>'}
  var f=T.f,t=T.tried;
  if(T.sent)return '<div class="tbody"><span class="urgtag" style="background:#3F5A4F">Reporte preparado</span><h3 class="tq" id="tq" tabindex="-1">Gracias por avisar, '+esc(f.name.trim().split(/\s+/)[0])+'</h3><dl class="sumbox"><div><dt>Situación</dt><dd>'+esc(lookup(SITS,f.sit).title)+'</dd></div><div><dt>Animal</dt><dd>'+esc(lookup(ANIS,f.type).title)+'</dd></div><div><dt>Ubicación</dt><dd>'+esc(f.where)+'</dd></div><div><dt>Contacto</dt><dd>'+esc(f.name)+' · '+esc(f.phone)+'</dd></div></dl>'+(f.photo?'<img class="photo-prev on" src="'+f.photo+'" alt="Foto adjunta">':'')+'<div class="ract"><button class="btn pri" data-copyrep style="background:#24362E;color:#F4EFE6">'+ico('i-copy')+'Copiar reporte</button><button class="btn line" data-treset>Nuevo reporte</button></div><p class="proto">Maqueta: el reporte aún no llega a la fundación. Copia el texto y compártelo por sus canales. Si hay riesgo para personas, llama al 911.</p></div>';
  return '<div class="tbody"><h3 class="tq" id="tq" tabindex="-1">Avisa al equipo</h3><form id="repForm" novalidate><div class="fgrid">'+
   fld('rWhere','¿Dónde está? *','<input id="rWhere" placeholder="Calle, sector o referencia" value="'+esc(f.where)+'">',t&&!f.where.trim(),'Indica dónde está',true)+
   fld('rDesc','Descripción (opcional)','<textarea id="rDesc">'+esc(f.desc)+'</textarea>',false,'',true)+
   fld('rPhoto','Foto (opcional)','<input id="rPhoto" type="file" accept="image/*"><img class="photo-prev'+(f.photo?' on':'')+'" id="photoPrev" alt="Vista previa"'+(f.photo?' src="'+f.photo+'"':'')+'>',false,'',true)+
   fld('rName','Tu nombre *','<input id="rName" autocomplete="name" value="'+esc(f.name)+'">',t&&!f.name.trim(),'Escribe tu nombre')+
   fld('rPhone','Tu teléfono *','<input id="rPhone" type="tel" autocomplete="tel" value="'+esc(f.phone)+'">',t&&!validPhone(f.phone),'Teléfono no válido')+
   '</div><label class="consent'+(t&&!f.ok?' bad':'')+'" style="margin-top:14px"><input type="checkbox" id="rOk"'+(f.ok?' checked':'')+'><span>Acepto que la fundación use estos datos solo para atender este caso.</span></label><div class="ract" style="margin-top:16px"><button class="btn urg" type="submit">Preparar reporte</button><button class="linkbtn" type="button" data-tstep="2">← Volver</button></div></form><p class="proto">Maqueta: por ahora el reporte no se envía.</p></div>';
}
var SAY=[['Primero, respira.','Cuéntame qué está pasando.'],['Ya casi.','Con el tipo de animal ajusto las indicaciones.'],['Con calma.','Sigue los pasos y marca los que hiciste.'],['Un último paso.','Con estos datos te ubican más rápido.']];
function renderTool(focus){$('#tmain').innerHTML=stepper()+body();var m=T.sent?['¡Gracias!','Ya hiciste lo más importante.']:SAY[T.step];$('#say').innerHTML='<b>'+m[0]+'</b>'+m[1];if(focus){var q=$('#tq');if(q)q.focus({preventScroll:true})}}
$('#nums').innerHTML='<span class="label" style="color:#526459">Números útiles</span>'+NUMS.map(function(n){return '<div class="num"><div><b'+(n.v?'':' style="font-size:18px"')+'>'+(n.v||n.k)+'</b><small>'+n.note+'</small></div>'+(n.v?'<button class="cpy" data-copy-num="'+n.v+'">'+ico('i-copy')+'Copiar</button>':'')+'</div>'}).join('');
document.addEventListener('click',function(e){var el;
  if((el=e.target.closest('[data-sit]'))){T.sit=+el.getAttribute('data-sit');T.chk={};T.sent=false;T.step=T.ani>=0?2:1;renderTool(true);return}
  if((el=e.target.closest('[data-ani]'))){T.ani=+el.getAttribute('data-ani');T.chk={};T.step=2;renderTool(true);return}
  if((el=e.target.closest('[data-tstep]'))){var n=+el.getAttribute('data-tstep');if(n<=reach()){T.step=n;if(n===3){T.f.type=ANIS[T.ani].id;T.f.sit=SITS[T.sit].id}renderTool(true)}return}
  if((el=e.target.closest('[data-chk]'))){var k=el.getAttribute('data-chk');T.chk[k]=!T.chk[k];el.setAttribute('aria-checked',!!T.chk[k]);return}
  if(e.target.closest('[data-treset]')){resetTool();renderTool(true);return}
  if(e.target.closest('[data-copyrep]')){var f=T.f;copy(['REPORTE DE FAUNA SILVESTRE · Proyecto Sacha','Fecha: '+new Date().toLocaleString('es-EC'),'Situación: '+lookup(SITS,f.sit).title,'Animal: '+lookup(ANIS,f.type).title,'Ubicación: '+f.where,'Descripción: '+(f.desc||'—'),'Contacto: '+f.name+' · '+f.phone].join('\n'),'Reporte copiado');return}
  if((el=e.target.closest('[data-fani]'))){T.ani=ANIS.map(function(a){return a.id}).indexOf(el.getAttribute('data-fani'));T.sent=false;T.step=T.sit>=0?2:0;renderTool(false);go('encontre')}
});
document.addEventListener('input',function(e){var m={rWhere:'where',rDesc:'desc',rName:'name',rPhone:'phone'}[e.target.id];if(m)T.f[m]=e.target.value});
document.addEventListener('change',function(e){if(e.target.id==='rOk')T.f.ok=e.target.checked;if(e.target.id==='rPhoto'){var file=e.target.files&&e.target.files[0],pv=$('#photoPrev');if(file&&file.type.indexOf('image/')===0){T.f.photo=URL.createObjectURL(file);pv.src=T.f.photo;pv.classList.add('on')}else if(file){toast('Elige una imagen');e.target.value=''}}});
document.addEventListener('submit',function(e){if(e.target.id!=='repForm')return;e.preventDefault();var f=T.f,ok=f.where.trim()&&f.name.trim()&&validPhone(f.phone)&&f.ok;if(ok){T.sent=true;T.tried=false}else T.tried=true;renderTool(ok);if(!ok){var b=$('#repForm .bad input');if(b)b.focus()}});

/* ======================  MEDIANOCHE: CINE  ====================== */
var C={tab:-1,htab:0,h:0,playing:false,prog:0};
function capList(){return CAPS.map(function(c,i){return i}).filter(function(i){return C.tab<0||CAPS[i].tab===C.tab})}
function renderReels(){
  $('#capTabs').innerHTML=[{name:'Todas'}].concat(TABS).map(function(t,k){return '<button class="tab" role="tab" aria-selected="'+(C.tab===k-1)+'" data-ctab="'+(k-1)+'">'+t.name+'</button>'}).join('');
  $('#reels').innerHTML=capList().map(rc).join('');
}
document.addEventListener('click',function(e){var b=e.target.closest('[data-ctab]');if(b){C.tab=+b.getAttribute('data-ctab');renderReels()}});
$('#reelPrev').addEventListener('click',function(){$('#reels').scrollBy({left:-$('#reels').clientWidth*.8,behavior:'smooth'})});
$('#reelNext').addEventListener('click',function(){$('#reels').scrollBy({left:$('#reels').clientWidth*.8,behavior:'smooth'})});
var ST={open:false,list:[],i:0,t:0,paused:false,last:null};
function openStory(cap){ST.list=CAPS.map(function(c,i){return i});ST.i=cap;ST.t=0;ST.paused=false;ST.open=true;ST.last=document.activeElement;$('#story-v').hidden=false;document.body.classList.add('lock');renderStory();$('#stClose').focus()}
function closeStory(){ST.open=false;$('#story-v').hidden=true;document.body.classList.remove('lock');$('#stFrame').innerHTML='';if(ST.last&&ST.last.focus)ST.last.focus({preventScroll:true})}
function renderStory(){var i=ST.list[ST.i],c=CAPS[i],src=VIDEOS.caps[i];
  $('#stFrame').innerHTML='<div class="st-bars">'+ST.list.map(function(x,k){return '<i><b style="width:'+(k<ST.i?100:0)+'%"></b></i>'}).join('')+'</div><div class="st-head"><span class="av"><img src="assets/mascot/sacha-saluda.webp" alt=""></span><div><b>Proyecto Sacha</b><span>'+TABS[c.tab].name+' · cápsula '+(i+1)+'</span></div><div class="sp"><button id="stPause" aria-label="Pausar">'+ico('i-pause')+'</button></div></div>'+
   (src?'<video id="stVid" src="'+esc(src)+'" autoplay playsinline></video>':capCover(i)+'<div class="st-mock"><span class="badge">Video pendiente · vista de maqueta</span></div>')+
   '<button class="st-tap l" data-st="-1" aria-label="Anterior"></button><button class="st-tap r" data-st="1" aria-label="Siguiente"></button><div class="st-foot"><p>'+esc(c.desc)+'</p></div>';
  var v=$('#stVid');if(v)v.addEventListener('ended',function(){stStep(1)})}
function stStep(d){var n=ST.i+d;if(n<0)n=0;if(n>=ST.list.length){closeStory();return}ST.i=n;ST.t=0;renderStory()}
setInterval(function(){if(!ST.open||ST.paused||VIDEOS.caps[ST.list[ST.i]])return;ST.t+=.1;var b=$$('.st-bars b')[ST.i];if(b)b.style.width=Math.min(100,ST.t/MOCK_SECONDS*100)+'%';if(ST.t>=MOCK_SECONDS)stStep(1)},100);
document.addEventListener('click',function(e){
  var r=e.target.closest('[data-cap]');if(r){openStory(+r.getAttribute('data-cap'));return}
  if(!ST.open)return;var t=e.target.closest('[data-st]');if(t){stStep(+t.getAttribute('data-st'));return}
  if(e.target.closest('#stPrev')){stStep(-1);return}if(e.target.closest('#stNext')){stStep(1);return}
  if(e.target.closest('#stClose')||e.target===$('#story-v')){closeStory();return}
  if(e.target.closest('#stPause')){ST.paused=!ST.paused;$('#stPause').innerHTML=ico(ST.paused?'i-play':'i-pause')}
});
document.addEventListener('keydown',function(e){if(!ST.open)return;if(e.key==='Escape')closeStory();if(e.key==='ArrowRight')stStep(1);if(e.key==='ArrowLeft')stStep(-1)});
var ICON_PLAY='<svg viewBox="0 0 16 16"><path d="M4 2l10 6-10 6z"/></svg>',ICON_PAUSE='<svg viewBox="0 0 16 16"><path d="M3 2h4v12H3zM9 2h4v12H9z"/></svg>';
function hList(){return HVIDS.map(function(v,i){return i}).filter(function(i){return HVIDS[i].tab===C.htab})}
function hCover(v){if(v.src==='hero')return '<div class="plate"><img src="assets/video/hero-poster.jpg" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></div>';return plate({pat:v.pat,bg:'#24362E',pre:v.pre,title:v.title,m:v.m})}
function renderH(){
  var v=HVIDS[C.h],el=$('#pl-h'),srcs=v.src==='hero'?[].concat(VIDEOS.hero):(VIDEOS.h[v.id]?[VIDEOS.h[v.id]]:[]);C.playing=false;C.prog=0;el.classList.remove('playing');
  el.innerHTML=srcs.length?'<div class="stage2"><video controls playsinline preload="metadata" poster="assets/video/hero-poster.jpg">'+srcs.map(function(u){return '<source src="'+u+'" type="video/'+(/\.webm$/.test(u)?'webm':'mp4')+'">'}).join('')+'</video></div>'
   :'<div class="stage2">'+hCover(v)+'<span class="badge">Video pendiente · vista de maqueta</span><button class="bigplay" data-hp aria-label="Reproducir"></button></div><div class="controls"><button class="pp" data-hp aria-label="Reproducir o pausar">'+ICON_PLAY+'</button><div class="track2"><div><i></i></div></div><time>0:00 / '+fmt(v.dur)+'</time></div>';
  $('#hKick').textContent=v.kind+' · '+fmt(v.dur);$('#hTitle').textContent=v.pre+' '+v.title;$('#hDesc').textContent=v.desc;
  $('#hlist').innerHTML='<div class="tabs">'+HTABS.map(function(t,i){return '<button class="tab" role="tab" aria-selected="'+(C.htab===i)+'" data-htab="'+i+'">'+t+'</button>'}).join('')+'</div>'+hList().map(function(i){var x=HVIDS[i];return '<button class="hrow" data-hv="'+i+'" aria-current="'+(i===C.h)+'"><span class="th">'+hCover(x)+'</span><span><b>'+esc(x.pre+' '+x.title)+'</b><span>'+x.kind+' · '+fmt(x.dur)+'</span></span></button>'}).join('');
}
function hPaint(){var el=$('#pl-h'),v=HVIDS[C.h],i=$('.track2 i',el),t=$('time',el),b=$('.pp',el);el.classList.toggle('playing',C.playing);if(i)i.style.width=C.prog+'%';if(t)t.textContent=fmt(v.dur*C.prog/100)+' / '+fmt(v.dur);if(b)b.innerHTML=C.playing?ICON_PAUSE:ICON_PLAY}
setInterval(function(){if(!C.playing)return;C.prog+=100/300;if(C.prog>=100){C.prog=0;C.playing=false}hPaint()},100);
document.addEventListener('click',function(e){
  var b=e.target.closest('[data-htab]');if(b){C.htab=+b.getAttribute('data-htab');C.h=hList()[0];renderH();return}
  var r=e.target.closest('[data-hv]');if(r){C.h=+r.getAttribute('data-hv');renderH();var v=$('#pl-h video');if(v){var p=v.play();if(p&&p.catch)p.catch(function(){})}else{C.playing=true;hPaint()}return}
  if(e.target.closest('[data-hp]')){C.playing=!C.playing;hPaint();return}
  var hp=e.target.closest('[data-hplay]');if(hp){C.h=HVIDS.map(function(x){return x.id}).indexOf(hp.getAttribute('data-hplay'));C.htab=HVIDS[C.h].tab;renderH();go('horizontales')}
});
/* inclinación de las cápsulas bajo el puntero */
if(!reduced&&matchMedia('(pointer:fine)').matches){
  document.addEventListener('pointermove',function(e){var c=e.target.closest&&e.target.closest('.rc');if(!c)return;var r=c.getBoundingClientRect();c.style.setProperty('--ry',((e.clientX-r.left)/r.width*10-5).toFixed(1)+'deg');c.style.setProperty('--rx',(5-(e.clientY-r.top)/r.height*10).toFixed(1)+'deg')},{passive:true});
  /* los ojos de las dos A del logo siguen el puntero */
  var logos=$$('svg.logo'),raf=0,mx=0,my=0;
  document.addEventListener('pointermove',function(e){mx=e.clientX;my=e.clientY;if(raf)return;raf=requestAnimationFrame(function(){raf=0;logos.forEach(function(l){var r=l.getBoundingClientRect();if(!r.width||r.bottom<0||r.top>innerHeight)return;var dx=mx-(r.left+r.width/2),dy=my-(r.top+r.height/2),d=Math.hypot(dx,dy)||1,k=Math.min(1,d/320)*13;l.style.setProperty('--px',(dx/d*k).toFixed(1)+'px');l.style.setProperty('--py',(dy/d*k).toFixed(1)+'px')})})},{passive:true});
}

/* ======================  MADRUGADA: CUBRE HORAS DEL PRÓXIMO DÍA  ====================== */
var G={hours:6,freq:0,step:0};
function ringSVG(){
  var out='',R=118,r=72,cx=130,cy=130;
  for(var i=0;i<24;i++){var a0=(i/24)*Math.PI*2-Math.PI/2,a1=((i+1)/24)*Math.PI*2-Math.PI/2,p=function(rad,a){return (cx+rad*Math.cos(a)).toFixed(1)+' '+(cy+rad*Math.sin(a)).toFixed(1)};
    var hr=(6+i)%24,night=hr>=19||hr<6;
    out+='<path class="seg'+(i<G.hours?' on':'')+(night?' night':'')+'" data-hseg="'+i+'" d="M'+p(R,a0)+' A'+R+' '+R+' 0 0 1 '+p(R,a1)+' L'+p(r,a1)+' A'+r+' '+r+' 0 0 0 '+p(r,a0)+'Z"><title>'+String(hr).padStart(2,'0')+':00</title></path>';
    if(i%6===0){var al=a0;out+='<text class="hl" x="'+(cx+(R+12)*Math.cos(al)).toFixed(1)+'" y="'+(cy+(R+12)*Math.sin(al)+4).toFixed(1)+'" text-anchor="middle">'+String(hr).padStart(2,'0')+'</text>'}}
  return '<svg viewBox="-6 -6 272 272" role="group" aria-label="Elige cuántas horas del día cubres">'+out+'<g class="ctr"><text x="130" y="128" text-anchor="middle"><tspan style="font:800 34px var(--font-display);fill:#24362E">'+G.hours+' h</tspan></text><text x="130" y="152" text-anchor="middle" style="font:400 13px var(--font-text);fill:#526459">del próximo día</text></g></svg>';
}
function amt(){return Math.round(G.hours*PER_HOUR)}
function renderGive(){
  var el=$('#give'),a=amt();
  if(G.step===1){el.innerHTML='<div class="thanks"><span class="label">Último paso</span><h3>Gracias por cubrir '+G.hours+' h ('+money(a)+(G.freq?' al mes':'')+')</h3><p>Para completarlo, haz una transferencia con estos datos. Pronto sumaremos tarjeta.</p><dl class="bank">'+BANK.map(function(b,i){return '<div><dt>'+b[0]+'</dt><dd>'+b[1]+'</dd><button data-copyb="'+i+'">Copiar</button></div>'}).join('')+'</dl><p class="small">Maqueta: aquí irán el pago y el recibo.</p><button class="btn line" id="giveBack" style="justify-self:start">← Volver</button></div>';return}
  el.innerHTML='<span class="label">Cubre horas del próximo día</span><h3>Cada hora cuesta unos '+money(PER_HOUR)+'</h3><div class="segc" role="group" aria-label="Frecuencia"><button data-gf="0" aria-pressed="'+(G.freq===0)+'">Una vez</button><button data-gf="1" aria-pressed="'+(G.freq===1)+'">Cada mes</button></div>'+
   '<div class="dayring"><div id="ring">'+ringSVG()+'</div><div class="ringtx"><div class="big" id="gAmt">'+money(a)+'<small>'+(G.freq?'/ mes':'una vez')+'</small></div><p>Cubres <b>'+G.hours+' '+(G.hours===1?'hora':'horas')+'</b> de rescate, medicinas, alimento y traslados. Toca el reloj o elige:</p><div class="pre">'+[1,3,6,12,24].map(function(h){return '<button data-gh="'+h+'" aria-pressed="'+(G.hours===h)+'">'+(h===24?'El día entero':h+' h')+'</button>'}).join('')+'</div></div></div>'+
   '<button class="btn pri" id="doGive" style="background:#24362E;color:#F4EFE6">'+ico('i-heart')+'Cubrir '+G.hours+' h · '+money(a)+'</button><p class="small">Equivalencia ilustrativa: $350.000 al año ÷ 8.760 horas. Por ahora, el pago es por transferencia.</p>';
}
document.addEventListener('click',function(e){
  var s=e.target.closest('[data-hseg]');if(s){G.hours=+s.getAttribute('data-hseg')+1;renderGive();var g=$('#gAmt');if(g){g.classList.add('bump')}return}
  var h=e.target.closest('[data-gh]');if(h){G.hours=+h.getAttribute('data-gh');renderGive();return}
  var f=e.target.closest('[data-gf]');if(f){G.freq=+f.getAttribute('data-gf');renderGive();return}
  if(e.target.closest('#doGive')){G.step=1;renderGive();return}
  if(e.target.id==='giveBack'){G.step=0;renderGive();return}
  var c=e.target.closest('[data-copyb]');if(c){var b=BANK[+c.getAttribute('data-copyb')];copy(b[1],b[0]+' copiado')}
  if(e.target.closest('#shareSite'))copy(location.href.split('#')[0],'Enlace copiado');
});

/* ======================  ARRANQUE Y APARICIONES  ====================== */
renderQuiz();renderMap();renderTool(false);renderReels();renderH();renderGive();sky();
(function(){
  if(reduced||!('IntersectionObserver' in window))return;
  var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})},{threshold:.1});
  $$('[data-rv]').forEach(function(e){if(e.getBoundingClientRect().top>innerHeight*.9){e.classList.add('rv');io.observe(e)}});
})();
})();
