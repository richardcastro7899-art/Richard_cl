
/* ======================  PÁGINA «SACHA × ARCLINE»  ======================
   Videos primero: portada con video de fondo, video institucional vertical por capítulos, cápsulas (krl) que se
   reproducen solas, podcast en video (YouTube) por episodios. Datos editables arriba de cada bloque. */
VIDEOS.caps=['assets/video/reels/r0.mp4','assets/video/reels/r1.mp4','assets/video/reels/r2.mp4','assets/video/reels/r3.mp4','assets/video/reels/r4.mp4','assets/video/reels/r5.mp4','assets/video/reels/r6.mp4','assets/video/reels/r7.mp4'];
VIDEOS.sacha='assets/video/sacha-vertical.mp4';
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
var SPY=['nosotros','capsulas','proceso','podcast','ayuda','sedes-s'],lastSpy='';
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

/* ---------- video institucional vertical por capítulos ---------- */
var CH=[
 {t:'Quiénes somos',at:'0:00',d:'Una fundación sin fines de lucro nacida en 2018 del rescate de Sacha, una cría de ocelote que era vendida en una tienda de Vinces. «Sacha» significa «selva» en kichwa.'},
 {t:'Qué hacemos',at:'0:15',d:'Atendemos fauna silvestre herida o víctima del tráfico: atención médica, trámites legales, traslado y rehabilitación hasta devolverla a su hábitat.'},
 {t:'Con quién trabajamos',at:'0:30',d:'Cada caso se coordina con el Ministerio del Ambiente y la Unidad de Policía de Medio Ambiente. Con universidades trabajamos por convenio.'},
 {t:'Cómo puedes ayudar',at:'0:45',d:'Donando, reportando un animal que encuentres y compartiendo las cápsulas. Por seguridad no recibimos visitas ni voluntarios externos.'}
];
var CI=0,iv=$('#instVid');
function renderCh(){
  $('#instList').innerHTML=CH.map(function(c,i){var on=i===CI;return '<div class="ac'+(on?' is-open':'')+'" role="listitem"><button class="ac-h" data-ch="'+i+'" aria-expanded="'+on+'"><span class="ac-n">'+pad2(i+1)+'</span><span class="ac-t">'+esc(c.t)+'</span><span class="ac-at">'+c.at+'</span><span class="ac-i">'+ico(on?'i-arrow-ur':'i-plus')+'</span></button><div class="ac-b"><p>'+esc(c.d)+'</p></div></div>'}).join('');
  $('#instCh').textContent=CI+1;$('#instChT').textContent=CH[CI].t;
}
function setCh(i,seek){CI=i;renderCh();if(seek&&iv){var go2=function(){iv.__seeking=true;iv.currentTime=iv.duration*i/CH.length+.05;setTimeout(function(){iv.__seeking=false},300)};if(iv.duration)go2();else{iv.preload='auto';iv.addEventListener('loadedmetadata',go2,{once:true});iv.load()}if(iv.paused&&!iv.__userPaused){var p=iv.play();if(p&&p.catch)p.catch(function(){})}}animateAc()}
function animateAc(){var b=$('.ac.is-open .ac-b');if(!b||!window.gsap||reduced)return;gsap.fromTo(b,{height:0,autoAlpha:0},{height:'auto',autoAlpha:1,duration:.55,ease:'power3.out'})}
renderCh();
$('#instList').addEventListener('click',function(e){var b=e.target.closest('[data-ch]');if(b)setCh(+b.getAttribute('data-ch'),true)});
if(iv){autoVid(iv);iv.addEventListener('timeupdate',function(){if(!iv.duration)return;var r=iv.currentTime/iv.duration;$('#instBar').style.width=(r*100)+'%';var c=Math.min(CH.length-1,Math.floor(r*CH.length));if(c!==CI&&!iv.__seeking){CI=c;renderCh()}})}
$('#instSnd').addEventListener('click',function(){iv.muted=!iv.muted;if(!iv.muted&&iv.paused)iv.play();this.innerHTML=ico(iv.muted?'i-mute':'i-vol');this.setAttribute('aria-label',iv.muted?'Activar sonido':'Silenciar')});
/* a pantalla completa */
var film=$('#film'),fv=$('#filmVid'),filmLast=null;
function openFilm(){filmLast=document.activeElement;film.hidden=false;document.body.classList.add('lock');if(window.__lenis)__lenis.stop();try{fv.currentTime=0;var p=fv.play();if(p&&p.catch)p.catch(function(){})}catch(e){}$('#filmClose').focus()}
function closeFilm(){film.hidden=true;fv.pause();document.body.classList.remove('lock');if(window.__lenis)__lenis.start();if(filmLast&&filmLast.focus)filmLast.focus({preventScroll:true})}
document.addEventListener('click',function(e){if(e.target.closest('[data-play-inst]')){e.preventDefault();openFilm()}if(!film.hidden&&(e.target===film||e.target.closest('#filmClose')))closeFilm()});
document.addEventListener('keydown',function(e){if(!film.hidden&&e.key==='Escape')closeFilm()});

/* ---------- cápsulas: carrusel con la tarjeta central nítida y las laterales giradas y desenfocadas ---------- */
var R={i:0,list:[],timer:0,inView:false};
function capFilter(){C.tab=C.tab===undefined?-1:C.tab;R.list=capList()}
function renderChips(){$('#capChips').innerHTML=[{n:'Todas',k:-1}].concat(EJES.map(function(e,i){return {n:e.name,k:i}})).map(function(x){return '<button role="tab" aria-selected="'+(C.tab===x.k)+'" data-capt="'+x.k+'">'+esc(x.n)+'</button>'}).join('')}
function renderReels(){
  capFilter();
  $('#reelsT').innerHTML=R.list.map(function(ci,k){var c=CAPS[ci],n=NETS[c.net];return '<button class="reel" data-rk="'+k+'" aria-label="Ver la cápsula '+(ci+1)+': '+esc(c.pre+' '+c.title)+'">'+
    '<video muted loop playsinline preload="none" poster="assets/video/reels/r'+ci+'.jpg"><source src="'+VIDEOS.caps[ci]+'" type="video/mp4"><source src="'+VIDEOS.caps[ci].replace('.mp4','.webm')+'" type="video/webm"></video>'+
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

/* ---------- podcast en video ---------- */
var EP=0,EPS=[
 {n:1,title:'Así llega un animal al centro',guest:['Equipo veterinario','Tema por confirmar'],dur:'Por publicar',ph:'tamandua',yt:'',d:'Qué pasa en las primeras horas: evaluación clínica, estabilización y por qué un animal silvestre necesita los mismos exámenes que un perro o un gato.'},
 {n:2,title:'Lo que la ciudad le hace a la fauna',guest:['Invitado/a por confirmar'],dur:'Por publicar',ph:'zarigueya',yt:'',d:'Atropellos, perros, cables y mascotización: los riesgos urbanos más comunes en Guayaquil y lo que cada vecino puede hacer distinto.'},
 {n:3,title:'El día de la liberación',guest:['Invitado/a por confirmar'],dur:'Por publicar',ph:'mono',yt:'',d:'Meses de rehabilitación terminan en una mañana. Cómo se decide que un animal está listo y cómo se coordina su regreso al hábitat.'}
];
function renderPodTabs(){$('#podTabs').innerHTML=EPS.map(function(e,i){return '<button role="tab" aria-selected="'+(i===EP)+'" data-ep="'+i+'">Episodio '+pad2(e.n)+'</button>'}).join('')+'<i class="ktabs-ind" aria-hidden="true"></i>';moveInd(true)}
function moveInd(instant){var b=$('#podTabs [aria-selected="true"]'),ind=$('#podTabs .ktabs-ind');if(!b||!ind)return;var st={x:b.offsetLeft,width:b.offsetWidth};if(window.gsap&&!instant&&!reduced)gsap.to(ind,Object.assign({duration:.5,ease:'power3.out'},st));else if(window.gsap)gsap.set(ind,st);else{ind.style.transform='translateX('+st.x+'px)';ind.style.width=st.width+'px'}}
function renderPod(anim){
  var e=EPS[EP],p=PH[e.ph];
  $('#kpod').innerHTML='<div class="kpod-v" id="podV"><img src="'+p.src+'" alt="" style="object-position:'+(p.pos||'50% 50%')+'"><div class="kpod-v-ov"></div><span class="kpod-yt">'+ico('i-yt')+'YouTube</span><button class="kpod-play" data-podplay aria-label="Reproducir el episodio '+e.n+'">'+ico('i-play')+'</button><span class="kpod-v-t"><small>Episodio '+pad2(e.n)+'</small><b>'+esc(e.title)+'</b></span><span class="credit">Foto de referencia</span></div>'+
   '<div class="kpod-c"><span class="kpod-num" aria-hidden="true">'+pad2(e.n)+'</span><p class="kpod-k">Episodio '+pad2(e.n)+' · '+esc(e.dur)+'</p><h3>'+esc(e.title)+'</h3><p>'+esc(e.d)+'</p><div class="kpod-tags">'+e.guest.map(function(g){return '<span>'+esc(g)+'</span>'}).join('')+'</div><div class="kpod-act"><a class="ob ob-ink" href="'+(e.yt?'https://www.youtube.com/watch?v='+e.yt:'#')+'" '+(e.yt?'target="_blank" rel="noopener"':'data-follow="youtube"')+'>Ver en YouTube</a><a class="ob ob-mist" href="#" data-follow="youtube">Suscribirse al canal</a></div></div>';
  obWrap($('#kpod'));
  if(anim&&window.gsap&&!reduced){var tl=gsap.timeline();tl.from('#kpod .kpod-v img',{scale:1.18,duration:1.1,ease:'power3.out'},0).from('#kpod .kpod-c > *',{y:30,autoAlpha:0,duration:.7,stagger:.06,ease:'power3.out'},0).from('#kpod .kpod-num',{yPercent:60,autoAlpha:0,duration:.9,ease:'power4.out'},.05)}
}
$('#podTabs').addEventListener('click',function(e){var b=e.target.closest('[data-ep]');if(!b)return;EP=+b.getAttribute('data-ep');$$('#podTabs [data-ep]').forEach(function(t,i){t.setAttribute('aria-selected',String(i===EP))});moveInd();renderPod(true)});
document.addEventListener('click',function(e){if(!e.target.closest('[data-podplay]'))return;var ep=EPS[EP],v=$('#podV');
  if(ep.yt){v.insertAdjacentHTML('beforeend','<iframe src="https://www.youtube-nocookie.com/embed/'+ep.yt+'?autoplay=1&rel=0" title="'+esc(ep.title)+'" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>');return}
  if(!$('.kpod-msg',v))v.insertAdjacentHTML('beforeend','<div class="kpod-msg"><b>Episodio por publicar</b><p>Cuando el episodio esté en YouTube, se verá aquí mismo y quedará anclado en el perfil de Proyecto Sacha.</p><button class="ob ob-sand" data-follow="youtube">Avisarme en YouTube</button></div>'),obWrap(v)});

/* ---------- casos: carrusel con laterales desenfocados ---------- */
var K=0;
function renderCases(){$('#casesT').innerHTML=CASES.map(function(c,i){var p=PH[c.ph];return '<a class="case" data-ck="'+i+'" href="'+c.u+'" target="_blank" rel="noopener"><div class="case-l"><span class="case-k">'+pad2(i+1)+' · '+esc(c.k)+(c.d?' · '+esc(c.d):'')+'</span><b>'+esc(c.t)+'</b><span class="case-s">'+esc(c.sp)+'</span><span class="ob ob-mist">Leer en '+esc(c.s)+'</span></div><figure class="case-r"><img src="'+p.src+'" alt="" loading="lazy" style="object-position:'+(p.pos||'50% 50%')+'"><figcaption class="case-note"><small>'+esc(c.s)+'</small><b>'+esc(c.sp)+'</b></figcaption><span class="credit">Foto de referencia</span></figure></a>'}).join('');obWrap($('#casesT'));layoutCases(true)}
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
renderChips();renderReels();renderPodTabs();renderPod(false);renderCases();renderMap();renderGive();renderCredits();obWrap(document);onScroll();reelAuto();
addEventListener('load',function(){layoutReels(true);layoutCases(true);moveInd(true)});
