(function(){
'use strict';

/* ======================  CONTENIDO EDITABLE  ======================
   VIDEOS: ruta del .mp4 de cada pieza (vacío = vista de maqueta). PODCAST: pega el ID de YouTube de cada
   episodio (lo que va después de «v=») y se reproduce incrustado aquí mismo. NETS: pega la URL de cada red;
   mientras esté vacía, los botones avisan que el enlace está por conectar. */
var VIDEOS={trailer:['assets/video/hero.mp4','assets/video/hero.webm'],c0:'',sacha:'',c1:'',c2:'',r1:'',r2:'',r3:'',r4:''};
var MOCK_SECONDS=8;
var NETS={
 instagram:{name:'Instagram',ab:'IG',c:'#D17A5B',url:'',handle:'@proyectosacha · por confirmar',what:'Detrás de escena del día a día y los reels de cada capítulo.'},
 tiktok:{name:'TikTok',ab:'TT',c:'#24362E',url:'',handle:'@proyectosacha · por confirmar',what:'Las cápsulas cortas: la versión vertical de cada capítulo.'},
 youtube:{name:'YouTube',ab:'YT',c:'#AF7409',url:'',handle:'Canal por confirmar',what:'El podcast completo y los videos largos de la historia.'},
 facebook:{name:'Facebook',ab:'FB',c:'#3F5A4F',url:'',handle:'Página por confirmar',what:'Comunidad, avisos de rescate y liberaciones.'}
};
var PODCAST={channel:'',eps:[{n:1,title:'Episodio 1 · Tema por definir',guest:'Invitado/a por confirmar',yt:''},{n:2,title:'Episodio 2 · Tema por definir',guest:'Invitado/a por confirmar',yt:''}]};
/* piezas de video: formato, portada y red donde sigue la historia */
var VIDS={
 trailer:{f:'v',pre:'Prólogo',title:'Todos los días los ves',dur:14,net:'youtube',live:true,ref:true},
 c0:{f:'v',pre:'Mitos sobre la',title:'zarigüeya',dur:58,pat:'selva',bg:'#3F5A4F',m:'sacha-dato',net:'tiktok'},
 sacha:{f:'h',pre:'¿Quién es',title:'Sacha?',dur:60,pat:'felino',bg:'#24362E',m:'sacha-saluda',net:'youtube'},
 c1:{f:'v',pre:'Encontré una cría:',title:'¿qué hago?',dur:72,pat:'selva',bg:'#3F5A4F',m:'sacha-rescate',net:'instagram'},
 c2:{f:'v',pre:'Convivir con fauna',title:'en la ciudad',dur:65,pat:'manchas',bg:'#3F5A4F',m:'sacha-saluda',net:'tiktok'},
 r1:{f:'v',pre:'Rescate',title:'en campo',dur:100,pat:'reptil',bg:'#3F5A4F',m:'sacha-rescate',net:'instagram'},
 r2:{f:'v',pre:'Un día en',title:'el quirófano',dur:70,pat:'felino',bg:'#24362E',m:'sacha-dato',net:'tiktok'},
 r3:{f:'v',pre:'Traslado a',title:'Santa Elena',dur:75,pat:'rayas',bg:'#3F5A4F',m:'sacha-saluda',net:'instagram'},
 r4:{f:'v',pre:'Rehabilitación',title:'y liberación',dur:85,pat:'selva',bg:'#24362E',m:'sacha-donar',net:'tiktok'}
};
var STEPS=[
 {id:'r1',title:'Recepción médica',text:'Evaluación clínica inmediata y estabilización: los mismos exámenes que un perro o un gato.'},
 {id:'r2',title:'Gestión legal',text:'Cada ingreso se informa al Ministerio del Ambiente y a la Unidad de Policía de Medio Ambiente.'},
 {id:'r3',title:'Logística y traslado',text:'Vehículos, combustible y personal para llevarlo de Guayaquil a Santa Elena.'},
 {id:'r4',title:'Rehabilitación y liberación',text:'Cuidado prolongado, a veces durante meses, hasta devolverlo a su hábitat.'}
];
var CH=[{id:'prologo',t:'Prólogo'},{id:'c1',t:'01 · Reconocer'},{id:'c2',t:'02 · ¿Quién es Sacha?'},{id:'c3',t:'03 · Convivir'},{id:'c4',t:'04 · El rescate por dentro'},{id:'c5',t:'05 · Las voces'},{id:'c6',t:'06 · Tu parte'},{id:'redes',t:'Epílogo · Redes'}];
var GUIDE=[
 ['sacha-saluda','¡Hola! Soy Sacha.','Te cuento esta historia en seis capítulos.'],
 ['sacha-dato','Mi vecina favorita.','La zarigüeya es inofensiva. ¡Dale play al video!'],
 ['sacha-saluda','Esta es mi historia.','Empezó en Vinces, en 2018.'],
 ['sacha-rescate','¿Encontraste un animal?','Te guío paso a paso.',true],
 ['sacha-rescate','Así es por dentro.','Sigue bajando y el recorrido avanza solo.'],
 ['sacha-dato','Escucha al equipo.','El podcast completo vive en YouTube.'],
 ['sacha-donar','Con tu ayuda,','el próximo rescate es posible.'],
 ['sacha-saluda','¡Nos vemos en redes!','Cada una cuenta una parte distinta.']
];
var AMTS=[10,25,50,100], YEAR_COST=350000;
var BANK=[['Banco','Banco Internacional'],['Cuenta corriente','1400625249'],['A nombre de','Fundación Proyecto Sacha'],['RUC','0993242721001']];
var SITS=[
 {ic:'i-med',c:'#D17A5B',t:'Está herido o en peligro',s:'Atropellado, atrapado o sangrando',do:['Mantén la distancia y no lo persigas.','Aleja a perros, gatos y niños.','Toma una foto desde lejos y anota la ubicación.','Avisa de inmediato.'],no:['No le des comida, agua ni leche.','No lo cargues con las manos desnudas.']},
 {ic:'i-baby',c:'#AF7409',t:'Es una cría y está sola',s:'No ves a la madre',do:['Obsérvala de lejos un buen rato: su madre puede estar cerca.','Si está en peligro inmediato, avisa.','Anota la hora y el lugar.'],no:['No la alimentes.','No la lleves a casa: muchas veces no está abandonada.']},
 {ic:'i-home',c:'#3F5A4F',t:'Entró a mi casa o patio',s:'Está donde no debería',do:['Dale espacio y deja un camino libre hacia afuera.','Encierra a las mascotas.','Si no sale, toma una foto y avisa.'],no:['No lo acorrales ni lo golpees.','No uses insecticidas ni trampas de pegamento.']},
 {ic:'i-cart',c:'#24362E',t:'Alguien lo tiene o lo vende',s:'Como mascota o producto',do:['Cuida tu seguridad: no confrontes.','Guarda fotos o capturas si puedes sin riesgo.','Reporta: la fundación informa a la autoridad ambiental.'],no:['No compres al animal: alimenta el tráfico.']}
];

/* ======================  UTILIDADES  ====================== */
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var reduced=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function fmt(s){s=Math.round(s);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
function ico(id){return '<svg class="ic" aria-hidden="true"><use href="#'+id+'"/></svg>'}
function money(n){return '$'+Math.round(n).toLocaleString('es-EC')}
function toast(m){var t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(function(){t.classList.remove('show')},2600)}
function copy(txt,msg){function ok(){toast(msg||'Copiado')}function fb(){var a=document.createElement('textarea');a.value=txt;a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();try{document.execCommand('copy');ok()}catch(e){toast('Selecciona el texto y cópialo')}a.remove()}try{navigator.clipboard.writeText(txt).then(ok,fb)}catch(e){fb()}}
function go(id){var el=document.getElementById(id);if(el)window.scrollTo({top:el.getBoundingClientRect().top+scrollY-56,behavior:reduced?'auto':'smooth'})}
function follow(k){var n=NETS[k];return '<a class="btn line sm" href="'+(n.url||'#redes')+'" target="'+(n.url?'_blank':'_self')+'" rel="noopener" data-follow="'+k+'">Seguir en '+n.name+' '+ico('i-ext')+'</a>'}
function plate(o){return '<div class="plate" style="--pb:'+o.bg+'"><div class="pt" style="background-image:url(assets/patterns/'+o.pat+'.svg)"></div><svg class="wave" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path d="M0 12C22 2 40 22 62 12S90 2 100 8V40H0Z"/></svg><div class="ptx"><small>'+esc(o.pre)+'</small><b>'+esc(o.title)+'</b></div>'+(o.m?'<img class="pm" src="assets/mascot/'+o.m+'.webp" alt="" loading="lazy">':'')+'</div>'}
document.addEventListener('click',function(e){
  var g=e.target.closest('[data-go]');if(g){e.preventDefault();go(g.getAttribute('data-go'))}
  var f=e.target.closest('[data-follow]');if(f&&!NETS[f.getAttribute('data-follow')].url){e.preventDefault();toast('Enlace de '+NETS[f.getAttribute('data-follow')].name+' por conectar')}
  var n=e.target.closest('[data-noop]');if(n){e.preventDefault();toast('Enlace por conectar')}
});
$('#goTop').addEventListener('click',function(){window.scrollTo({top:0,behavior:reduced?'auto':'smooth'})});

/* ======================  REPRODUCTORES CON TARJETA FINAL HACIA LA RED SIGUIENTE  ====================== */
var P={},cur=null;
function srcs(id){return [].concat(VIDEOS[id]||[]).filter(Boolean)}
function nextChap(el){var s=el.closest('[data-chap]'),i=s?+s.getAttribute('data-chap'):0;return CH[Math.min(CH.length-1,i+1)].id}
function playerHTML(id){
  var v=VIDS[id],n=NETS[v.net],list=srcs(id),media;
  if(list.length)media='<video '+(v.live?'autoplay muted loop ':'')+'playsinline preload="metadata" poster="assets/video/hero-poster.jpg">'+list.map(function(u){return '<source src="'+u+'" type="video/'+(/\.webm$/.test(u)?'webm':'mp4')+'">'}).join('')+'</video>';
  else media=plate(v);
  return '<div class="vf '+v.f+'" data-vid="'+id+'">'+media+
   '<div class="vbadge">'+(v.ref?'<span>Imagen de referencia</span>':(list.length?'':'<span>Vista de maqueta</span>'))+'<span class="on">También en '+n.name+'</span></div>'+
   (v.live?'':'<button class="vplay" data-vp="'+id+'" aria-label="Reproducir '+esc(v.pre+' '+v.title)+'">'+ico('i-play')+'</button>')+
   '<div class="vbar"><button data-vp="'+id+'" aria-label="Reproducir o pausar">'+ico(v.live?'i-pause':'i-play')+'</button><span class="tr"><i></i></span><time>'+(v.live?'En bucle':'0:00 / '+fmt(v.dur))+'</time></div>'+
   '<div class="vend" hidden><span class="pfm" style="--c:'+n.c+'">'+n.ab+'</span><b>La historia sigue en '+n.name+'</b><p>'+esc(n.what)+'</p><div class="row">'+follow(v.net).replace('btn line sm','btn pri sm')+'<button class="btn line sm" data-replay="'+id+'">'+ico('i-replay')+'Ver otra vez</button></div><button class="link" style="color:#F4EFE6" data-gonext="'+id+'">Siguiente capítulo '+ico('i-down')+'</button></div></div>'+
   '<div class="vcap"><b>'+esc(v.pre+' '+v.title)+'</b><span>'+(v.live?'Tráiler':fmt(v.dur))+'</span></div>';
}
$$('[data-player]').forEach(function(el){var id=el.getAttribute('data-player');el.outerHTML=playerHTML(id)});
function box(id){return $('.vf[data-vid="'+id+'"]')}
function paint(id){var b=box(id),s=P[id],v=VIDS[id];if(!b||!s)return;b.classList.toggle('playing',s.on);$('.tr i',b).style.width=(s.t/MOCK_SECONDS*100)+'%';$('.vbar time',b).textContent=fmt(v.dur*s.t/MOCK_SECONDS)+' / '+fmt(v.dur);$('.vbar button',b).innerHTML=ico(s.on?'i-pause':'i-play')}
function stopOthers(id){Object.keys(P).forEach(function(k){if(k!==id&&P[k].on){P[k].on=false;paint(k)}});$$('.vf video').forEach(function(v){var b=v.closest('.vf');if(b.getAttribute('data-vid')!==id&&!VIDS[b.getAttribute('data-vid')].live)v.pause()})}
function toggle(id){
  var b=box(id),v=VIDS[id],vid=$('video',b);
  if(vid){if(vid.paused){stopOthers(id);var p=vid.play();if(p&&p.catch)p.catch(function(){})}else vid.pause();return}
  var s=P[id]||(P[id]={t:0,on:false});$('.vend',b).hidden=true;
  s.on=!s.on;if(s.on){stopOthers(id);if(s.t>=MOCK_SECONDS)s.t=0}paint(id);
}
function ended(id){var b=box(id);$('.vend',b).hidden=false;b.classList.remove('playing')}
setInterval(function(){Object.keys(P).forEach(function(k){var s=P[k];if(!s.on)return;s.t+=.1;if(s.t>=MOCK_SECONDS){s.t=MOCK_SECONDS;s.on=false;paint(k);ended(k)}else paint(k)})},100);
$$('.vf video').forEach(function(vid){var b=vid.closest('.vf'),id=b.getAttribute('data-vid'),btn=$('.vbar button',b);
  vid.addEventListener('play',function(){b.classList.add('playing');btn.innerHTML=ico('i-pause')});vid.addEventListener('pause',function(){btn.innerHTML=ico('i-play')});
  vid.addEventListener('timeupdate',function(){if(vid.duration)$('.tr i',b).style.width=(vid.currentTime/vid.duration*100)+'%'});
  vid.addEventListener('ended',function(){ended(id)});
  if(reduced&&VIDS[id].live){vid.removeAttribute('autoplay');vid.pause()}});
document.addEventListener('click',function(e){
  var p=e.target.closest('[data-vp]');if(p){toggle(p.getAttribute('data-vp'));return}
  var r=e.target.closest('[data-replay]');if(r){var id=r.getAttribute('data-replay');P[id]={t:0,on:false};toggle(id);return}
  var n=e.target.closest('[data-gonext]');if(n){go(nextChap(box(n.getAttribute('data-gonext'))))}
});

/* ======================  CAPÍTULO 4: RECORRIDO HORIZONTAL  ====================== */
$('#ptrack').innerHTML=STEPS.map(function(s,i){return '<div class="pstep"><div>'+playerHTML(s.id)+'</div><div><span class="n pf '+['felino','manchas','selva','rayas'][i]+'">'+(i+1)+'</span><h3>'+s.title+'</h3><p>'+s.text+'</p></div></div>'}).join('');
function sizePin(){var t=$('#ptrack'),len=Math.max(0,t.scrollWidth-innerWidth);$('#pinWrap').style.setProperty('--len',len+'px')}

/* ======================  CAPÍTULO 5: PODCAST INCRUSTADO DESDE YOUTUBE  ====================== */
var EP=0;
function renderPod(){
  var e=PODCAST.eps[EP],watch=e.yt?'https://www.youtube.com/watch?v='+e.yt:(PODCAST.channel||'');
  $('#yt').innerHTML='<div class="yt" id="ytBox">'+plate({pat:'manchas',bg:'#24362E',pre:'Podcast · episodio '+e.n,title:e.title.replace(/^Episodio \d+ · /,''),m:'sacha-dato'})+'<div class="vbadge"><span class="on">YouTube</span>'+(e.yt?'':'<span>Episodio por publicar</span>')+'</div><button class="ytplay" id="ytPlay" aria-label="Reproducir el episodio '+e.n+' en YouTube">'+ico('i-play')+'</button></div>'+
   '<div class="ytmeta"><div><b style="font-family:var(--font-display);font-size:20px">'+esc(e.title)+'</b><div class="small">'+esc(e.guest)+'</div></div><div class="cta">'+(watch?'<a class="link" href="'+watch+'" target="_blank" rel="noopener">Abrir en YouTube '+ico('i-ext')+'</a>':'')+follow('youtube')+'</div></div>';
  $('#eps').innerHTML=PODCAST.eps.map(function(x,i){return '<button class="ep" data-ep="'+i+'" aria-current="'+(i===EP)+'"><span class="n">'+x.n+'</span><span><b>'+esc(x.title)+'</b><br><span>'+esc(x.guest)+'</span></span><span>'+ico('i-play')+'</span></button>'}).join('');
}
document.addEventListener('click',function(e){
  var b=e.target.closest('[data-ep]');if(b){EP=+b.getAttribute('data-ep');renderPod();return}
  if(e.target.closest('#ytPlay')){var ep=PODCAST.eps[EP],bx=$('#ytBox');
    if(ep.yt){bx.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+encodeURIComponent(ep.yt)+'?autoplay=1&rel=0" title="'+esc(ep.title)+'" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>'}
    else{bx.insertAdjacentHTML('beforeend','<div class="vend"><span class="pfm" style="--c:#AF7409">YT</span><b>Este episodio se reproducirá aquí</b><p>Cuando se publique en YouTube, pega su ID en PODCAST y se verá incrustado sin salir de la página.</p><div class="row">'+follow('youtube').replace('btn line sm','btn pri sm')+'</div></div>')}}
});

/* ======================  CAPÍTULO 6: DONAR  ====================== */
var G={a:1,f:1,bank:false};
function renderGive(){
  var a=AMTS[G.a],mins=a/(YEAR_COST/525600),t=mins<90?Math.round(mins)+' minutos':(mins/60).toFixed(1).replace('.',',')+' horas';
  $('#give').innerHTML='<div class="freq" role="group" aria-label="Frecuencia"><button data-gf="0" aria-pressed="'+(G.f===0)+'">Una vez</button><button data-gf="1" aria-pressed="'+(G.f===1)+'">Cada mes</button></div>'+
   '<div class="amts" role="group" aria-label="Monto">'+AMTS.map(function(x,i){return '<button data-ga="'+i+'" aria-pressed="'+(G.a===i)+'">$'+x+'</button>'}).join('')+'</div>'+
   '<p class="impact"><b>'+money(a)+'</b> '+(G.f?'al mes ':'')+'cubren unos '+t+' de operación de la fundación.</p>'+
   (G.bank?'<dl class="bank">'+BANK.map(function(b,i){return '<div><dt>'+b[0]+'</dt><dd>'+b[1]+'</dd><button data-cb="'+i+'">Copiar</button></div>'}).join('')+'</dl><p class="small">Transferencia por ahora; tarjeta y PayPal próximamente. Maqueta: no procesa pagos.</p>':'<div class="cta"><button class="btn pri" id="doGive">Donar '+money(a)+(G.f?' / mes':'')+'</button><button class="link" id="shareSite">Compartir la historia '+ico('i-arrow')+'</button></div>');
}
document.addEventListener('click',function(e){
  var a=e.target.closest('[data-ga]');if(a){G.a=+a.getAttribute('data-ga');renderGive();return}
  var f=e.target.closest('[data-gf]');if(f){G.f=+f.getAttribute('data-gf');renderGive();return}
  if(e.target.closest('#doGive')){G.bank=true;renderGive();return}
  var c=e.target.closest('[data-cb]');if(c){var b=BANK[+c.getAttribute('data-cb')];copy(b[1],b[0]+' copiado');return}
  if(e.target.closest('#shareSite'))copy(location.href.split('#')[0],'Enlace copiado');
});

/* ======================  REDES  ====================== */
$('#socMini').innerHTML=Object.keys(NETS).map(function(k){var n=NETS[k];return '<a href="'+(n.url||'#redes')+'" data-follow="'+k+'" aria-label="'+n.name+'" target="'+(n.url?'_blank':'_self')+'" rel="noopener">'+n.ab+'</a>'}).join('');
$('#nets').innerHTML=Object.keys(NETS).map(function(k,i){var n=NETS[k];return '<a class="net rv" style="--c:'+n.c+';--d:'+(i*.08)+'s" href="'+(n.url||'#redes')+'" target="'+(n.url?'_blank':'_self')+'" rel="noopener" data-follow="'+k+'"><span class="pfm">'+n.ab+'</span><b>'+n.name+'</b><p>'+esc(n.what)+'</p><span class="h">'+esc(n.handle)+'</span><span class="go">Seguir '+ico('i-arrow')+'</span></a>'}).join('');
$$('[data-net]').forEach(function(el){var k=el.getAttribute('data-net'),n=NETS[k];el.style.setProperty('--c',n.c);el.innerHTML='<span class="pfm">'+n.ab+'</span><div><b>Este capítulo sigue en '+n.name+'</b><span>'+esc(n.what)+'</span></div>'+follow(k)});
$('#chapterlist').innerHTML=CH.slice(1,7).map(function(c){var p=c.t.split(' · ');return '<li><b>'+p[0]+'</b><button class="link" style="font-weight:400;font-family:var(--font-text);text-decoration-thickness:1px;font-size:14px" data-go="'+c.id+'">'+p[1]+'</button></li>'}).join('');
$('#chaps').innerHTML=CH.map(function(c,i){return '<button data-go="'+c.id+'" aria-label="'+esc(c.t)+'"><i><b></b></i><span>'+esc(c.t)+'</span></button>'}).join('');

/* ======================  SACHA, GUÍA FIJA  ====================== */
var gNow=-1,gMin=false;
function guide(i){if(i===gNow)return;gNow=i;var g=GUIDE[i],img=$('#gimg');img.src='assets/mascot/'+g[0]+'.webp';img.style.animation='none';void img.offsetWidth;img.style.animation='';
  var say=$('#gsay');say.classList.add('hide');setTimeout(function(){say.innerHTML='<b>'+g[1]+'</b>'+g[2]+(g[3]?'<br><button data-guide>Abrir la guía</button>':'')+'<button class="x" id="gx" aria-label="Ocultar el mensaje">'+ico('i-x')+'</button>';say.classList.toggle('act',!!g[3]);say.classList.remove('hide');clearTimeout(guide.t);if(!g[3])guide.t=setTimeout(function(){say.classList.add('hide')},5200)},220)}
document.addEventListener('click',function(e){if(e.target.closest('#gx')){gMin=true;$('#guide').classList.add('min')}});

/* ======================  PANEL «ENCONTRÉ UN ANIMAL»  ====================== */
var D={s:-1,chk:{},sent:false,where:'',phone:''},lastF=null;
function renderPanel(){
  var p=$('#panel'),head='<div class="ph"><h3>Encontré un animal</h3><button class="btn line sm" id="dClose">Cerrar '+ico('i-x')+'</button></div>';
  var dots='<div class="dots" aria-hidden="true"><i class="'+(D.s<0?'on':'on')+'"></i><i class="'+(D.s>=0?'on':'')+'"></i><i class="'+(D.sent?'on':'')+'"></i></div>';
  var body;
  if(D.s<0)body='<p class="lead" style="font-size:19px">¿Qué está pasando?</p><div class="opts">'+SITS.map(function(s,i){return '<button class="opt" data-ds="'+i+'" style="--c:'+s.c+'"><span class="oi">'+ico(s.ic)+'</span><b>'+s.t+'</b><span>'+s.s+'</span></button>'}).join('')+'</div>';
  else if(!D.sent){var s=SITS[D.s];body='<button class="back" data-ds="-1">← Cambiar</button><p class="lead" style="font-size:20px"><b>'+s.t+'</b></p><span class="label">Haz esto</span><div>'+s.do.map(function(x,i){return '<button class="chk" role="checkbox" aria-checked="'+!!D.chk[i]+'" data-dc="'+i+'"><i>'+ico('i-check')+'</i><span>'+esc(x)+'</span></button>'}).join('')+'</div><span class="label">No hagas esto</span><ul class="dos">'+s.no.map(function(x){return '<li class="n">'+ico('i-x')+esc(x)+'</li>'}).join('')+'</ul>'+
   '<form id="dForm" novalidate style="display:grid;gap:12px"><span class="label">Avisa al equipo</span><div class="fld" id="fW"><label for="dWhere">¿Dónde está?</label><input id="dWhere" value="'+esc(D.where)+'" placeholder="Calle, sector o referencia"></div><div class="fld" id="fP"><label for="dPhone">Tu teléfono</label><input id="dPhone" type="tel" value="'+esc(D.phone)+'"></div><button class="btn urg" type="submit">Preparar reporte</button></form>'}
  else body='<p class="lead" style="font-size:20px"><b>Reporte listo.</b> Gracias por avisar.</p><p class="small">Maqueta: aún no se envía. Copia el texto y compártelo por los canales de la fundación.</p><div class="cta"><button class="btn pri" id="dCopy">'+ico('i-copy')+'Copiar reporte</button><button class="back" id="dNew">Nuevo reporte</button></div>';
  p.innerHTML=head+'<img src="assets/mascot/sacha-rescate.webp" alt="" style="height:120px;width:auto;justify-self:end;margin:-10px 0 -18px">'+dots+body+'<div class="num911"><div><b>911</b><div class="small">Si hay riesgo para personas o un animal peligroso.</div></div><button class="btn line sm" data-c911>'+ico('i-copy')+'Copiar</button></div>';
}
function openPanel(){lastF=document.activeElement;$('#drawer').hidden=false;document.body.classList.add('lock');renderPanel();$('#dClose').focus()}
function closePanel(){$('#drawer').hidden=true;document.body.classList.remove('lock');if(lastF)lastF.focus({preventScroll:true})}
document.addEventListener('click',function(e){
  if(e.target.closest('[data-guide]')){e.preventDefault();openPanel();return}
  if(e.target.closest('#dClose')||e.target===$('#drawer')){closePanel();return}
  var s=e.target.closest('[data-ds]');if(s){D.s=+s.getAttribute('data-ds');D.chk={};renderPanel();return}
  var c=e.target.closest('[data-dc]');if(c){var k=c.getAttribute('data-dc');D.chk[k]=!D.chk[k];c.setAttribute('aria-checked',!!D.chk[k]);return}
  if(e.target.closest('#dCopy')){copy(['REPORTE DE FAUNA SILVESTRE · Proyecto Sacha',SITS[D.s].t,'Ubicación: '+D.where,'Contacto: '+D.phone,new Date().toLocaleString('es-EC')].join('\n'),'Reporte copiado');return}
  if(e.target.closest('#dNew')){D={s:-1,chk:{},sent:false,where:'',phone:''};renderPanel();return}
  if(e.target.closest('[data-c911]'))copy('911','911 copiado');
});
document.addEventListener('input',function(e){if(e.target.id==='dWhere')D.where=e.target.value;if(e.target.id==='dPhone')D.phone=e.target.value});
document.addEventListener('submit',function(e){if(e.target.id!=='dForm')return;e.preventDefault();var okW=!!D.where.trim(),okP=D.phone.replace(/\D/g,'').length>=7;$('#fW').classList.toggle('bad',!okW);$('#fP').classList.toggle('bad',!okP);if(okW&&okP){D.sent=true;renderPanel()}else toast('Completa dónde está y un teléfono')});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!$('#drawer').hidden)closePanel()});

/* ======================  SCROLL: CAPÍTULOS, ESCALA DE VIDEOS, RECORRIDO Y GUÍA  ====================== */
function onScroll(){
  var mid=innerHeight*.5,act=0;
  CH.forEach(function(c,i){var el=document.getElementById(c.id),r=el.getBoundingClientRect(),f=Math.max(0,Math.min(1,(mid-r.top)/r.height));if(r.top<=mid)act=i;var b=$$('#chaps button')[i];if(b)$('b',b).style.width=(f*100)+'%'});
  guide(act);
  if(!reduced)$$('.vf').forEach(function(v){if(v.closest('.ptrack'))return;var r=v.getBoundingClientRect(),c=r.top+r.height/2,d=Math.min(1,Math.abs(c-mid)/(innerHeight*.9));v.style.setProperty('--s',(1-d*.08).toFixed(3))});
  var w=$('#pinWrap'),r=w.getBoundingClientRect(),span=r.height-innerHeight,p=span>0?Math.max(0,Math.min(1,-r.top/span)):0,t=$('#ptrack'),max=Math.max(0,t.scrollWidth-innerWidth);
  if(innerWidth>860){t.style.setProperty('--x',(-max*p).toFixed(1)+'px');$('#pbar').style.setProperty('--p',(p*100).toFixed(1)+'%')}
}
window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',function(){sizePin();onScroll()});

/* ======================  TEXTO QUE ENTRA PALABRA A PALABRA Y APARICIONES  ====================== */
function splitWords(el){var i=0;(function walk(node){Array.prototype.slice.call(node.childNodes).forEach(function(n){
  if(n.nodeType===3){var frag=document.createDocumentFragment();n.textContent.split(/(\s+)/).forEach(function(w){if(!w)return;if(/^\s+$/.test(w)){frag.appendChild(document.createTextNode(w));return}var s=document.createElement('span');s.className='w';s.style.setProperty('--i',i++);s.textContent=w;frag.appendChild(s)});n.replaceWith(frag)}
  else if(n.nodeType===1)walk(n)})})(el)}
renderPod();renderGive();sizePin();onScroll();
(function(){
  var splits=$$('.split');splits.forEach(splitWords);
  if(reduced||!('IntersectionObserver' in window)){splits.concat($$('.rv')).forEach(function(s){s.classList.add('in')});return}
  var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})},{threshold:.15});
  splits.forEach(function(s){io.observe(s)});
  $$('.rv').forEach(function(e){if(e.getBoundingClientRect().top<innerHeight*.9){e.classList.add('in')}else io.observe(e)});
  /* los ojos de las dos A del logo siguen el puntero */
  if(matchMedia('(pointer:fine)').matches){var logos=$$('svg.logo'),raf=0,mx=0,my=0;document.addEventListener('pointermove',function(e){mx=e.clientX;my=e.clientY;if(raf)return;raf=requestAnimationFrame(function(){raf=0;logos.forEach(function(l){var r=l.getBoundingClientRect();if(!r.width||r.bottom<0||r.top>innerHeight)return;var dx=mx-(r.left+r.width/2),dy=my-(r.top+r.height/2),d=Math.hypot(dx,dy)||1,k=Math.min(1,d/320)*13;l.style.setProperty('--px',(dx/d*k).toFixed(1)+'px');l.style.setProperty('--py',(dy/d*k).toFixed(1)+'px')})})},{passive:true})}
})();
})();
