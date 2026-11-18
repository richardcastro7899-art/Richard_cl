
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
  $('#zProg').style.transform='scaleX('+(H>0?Math.min(1,scrollY/H):0).toFixed(4)+')';
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
var hv=$('#zhVid');autoVid(hv);
function paintPP(){var b=$('#hxPP');b.innerHTML=ico(hv.paused?'i-play':'i-pause');b.setAttribute('aria-label',hv.paused?'Reproducir el video de fondo':'Pausar el video de fondo')}
$('#hxPP').addEventListener('click',function(){if(hv.paused){hv.__userPaused=false;var p=hv.play();if(p&&p.catch)p.catch(function(){})}else{hv.__userPaused=true;hv.pause()}});
hv.addEventListener('play',paintPP);hv.addEventListener('pause',paintPP);paintPP();

/* ---------- video institucional ---------- */
var iv=$('#immVid'),fr=$('#immFrame');autoVid(iv,.05);
function ivPaint(){fr.classList.toggle('is-sound',!iv.muted);$('#immSnd').innerHTML=ico(iv.muted?'i-mute':'i-vol');$('#immSnd').setAttribute('aria-label',iv.muted?'Activar sonido':'Silenciar');$('#immPP').innerHTML=ico(iv.paused?'i-play':'i-pause');$('#immPP').setAttribute('aria-label',iv.paused?'Reproducir':'Pausar')}
function ivPlay(){iv.__userPaused=false;var p=iv.play();if(p&&p.catch)p.catch(function(){})}
$('#immPlay').addEventListener('click',function(){iv.muted=false;iv.loop=false;try{iv.currentTime=0}catch(e){}ivPlay();ivPaint()});
$('#immSnd').addEventListener('click',function(){iv.muted=!iv.muted;if(!iv.muted&&iv.paused)ivPlay();ivPaint()});
$('#immPP').addEventListener('click',function(){if(iv.paused)ivPlay();else{iv.__userPaused=true;iv.pause()}});
['play','pause','volumechange'].forEach(function(ev){iv.addEventListener(ev,ivPaint)});
iv.addEventListener('timeupdate',function(){if(iv.duration)$('#immBar').style.width=(iv.currentTime/iv.duration*100)+'%'});
iv.addEventListener('ended',function(){iv.muted=true;iv.loop=true;ivPlay();ivPaint()});
$('.imm-bar').addEventListener('click',function(e){if(!iv.duration)return;var r=this.getBoundingClientRect();iv.currentTime=Math.max(0,Math.min(.99,(e.clientX-r.left)/r.width))*iv.duration});
ivPaint();

/* ---------- nuestra historia: línea de tiempo ----------
   Fuentes: la web de la fundación, Expreso (2023) y el canal de YouTube de Proyecto Sacha. */
var TL=[
 {y:'2018',k:'Junio',t:'Llega Sacha',d:'Un ocelote de días de nacido, rescatado de una tienda en Vinces. Comía cada dos o tres horas y pasó sus primeros días en incubadora.',ph:'ocelote'},
 {y:'2018',k:'Semanas después',t:'Zafira y Vicenta',d:'Una ocelote con quemaduras en las patas y una monita aulladora bebé. Entendimos que la fauna silvestre necesitaba un lugar.',ph:'mono'},
 {y:'2021',k:'Diciembre',t:'«Tu casa no es mi hábitat»',d:'Campaña para desalentar el tráfico de fauna silvestre y alianza para conservar la fauna y sus ecosistemas.',ph:'iguana'},
 {y:'2022',k:'Febrero',t:'Serpientes del Guayas',d:'Programa de conservación de serpientes y guía para reaccionar si aparece una en casa.',ph:'serpiente'},
 {y:'2022',k:'Cerro Azul',t:'Rescate en el incendio forestal',d:'Rescate de fauna durante el incendio de Cerro Azul, en Guayaquil. Ese año se auxiliaron cerca de 1.100 animales.',ph:'tamandua'},
 {y:'2023',k:'Expreso',t:'Más de 3.500 animales',d:'Rescatados, recuperados o reubicados desde 2018, en coordinación con la autoridad ambiental.',ph:'lechuza'},
 {y:'Hoy',k:'Guayaquil y Santa Elena',t:'Más de 5.400 animales cuidados',d:'Sacha y Zafira ya son libres. Seguimos rescatando, rehabilitando y liberando, y contándolo: si los reconoces, los cuidas.',ph:'manglar'}
];
$('#tl').insertAdjacentHTML('beforeend',TL.map(function(x,i){var p=PH[x.ph];return '<li class="tl-i" data-tl="'+i+'"><span class="tl-dot" aria-hidden="true"></span><div class="tl-y"><b>'+esc(x.y)+'</b><small>'+esc(x.k)+'</small></div><div class="tl-c"><h3>'+esc(x.t)+'</h3><p>'+esc(x.d)+'</p></div><figure class="tl-img"><img src="'+p.src+'" alt="" loading="lazy" style="object-position:'+(p.pos||'50% 50%')+'"></figure></li>'}).join(''));
$('#histCard').insertAdjacentHTML('afterbegin','<span class="mcard-year" id="histYear">2018</span>');
function setTl(i){$$('.tl-i').forEach(function(li,k){li.classList.toggle('is-on',k<=i);li.classList.toggle('is-now',k===i)});var y=$('#histYear');if(y&&y.textContent!==TL[i].y){y.textContent=TL[i].y;if(window.gsap&&!reduced)gsap.fromTo(y,{yPercent:60,autoAlpha:0},{yPercent:0,autoAlpha:1,duration:.5,ease:'power3.out'})}}

/* ---------- cómo trabajamos ---------- */
$('#procNav').innerHTML=STEPS.map(function(s,i){return '<li data-pi="'+i+'"><span>'+pad2(i+1)+'</span><b>'+esc(s.title)+'</b><i aria-hidden="true"><em></em></i></li>'}).join('');
$('#procCards').innerHTML=STEPS.map(function(s,i){var p=PH[s.ph];return '<article class="pcard" data-pc="'+i+'"><img src="'+p.src+'" alt="" loading="lazy" style="object-position:'+(p.pos||'50% 50%')+'"><div class="pcard-sh" aria-hidden="true"></div><div class="pcard-t"><span class="pcard-n">'+pad2(i+1)+' / '+pad2(STEPS.length)+'</span><h3>'+esc(s.title)+'</h3><p>'+esc(s.text)+'</p><small>'+esc(s.who)+'</small></div><span class="credit">Foto de referencia</span></article>'}).join('');
function setProc(i){$$('#procNav li').forEach(function(li,k){li.classList.toggle('is-on',k===i);li.classList.toggle('is-done',k<i)})}
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
  $('#reelsT2').innerHTML=R.list.map(function(ci,k){var c=CAPS[ci],n=NETS[c.net];return '<button class="reel" data-cursor="Ver" data-rk="'+k+'" aria-label="Ver el reel '+(ci+1)+': '+esc(c.pre+' '+c.title)+'">'+
    '<video muted loop playsinline preload="none" poster="assets/video/final/r'+ci+'.jpg"><source src="assets/video/final/r'+ci+'.mp4" type="video/mp4"><source src="assets/video/final/r'+ci+'.webm" type="video/webm"></video>'+
    '<span class="reel-top"><span class="reel-n">'+pad2(ci+1)+'</span><span class="reel-net">'+esc(n.name)+'</span></span>'+
    '<span class="reel-b"><small>'+fmt(c.dur)+'</small><b>'+esc(c.pre)+' '+esc(c.title)+'</b><em>'+ico('i-play')+'Ver reel</em></span></button>'}).join('');
  layoutReels()}
function layoutReels(){
  var cards=$$('.reel'),n=cards.length,W=innerWidth,cw=cards[0]?cards[0].offsetWidth:280,gap=Math.min(36,W*.03),step=W<700?cw+14:cw*.82+gap;
  var near=((Math.round(R.pos)%n)+n)%n;
  cards.forEach(function(el,k){var d=k-R.pos;d=((d%n)+n)%n;if(d>n/2)d-=n;var ad=Math.abs(d),
    x=d*step,rot=W<700?0:Math.max(-1,Math.min(1,d))*-22,sc=W<700?1-.08*Math.min(1,ad):Math.max(.72,1-.1*ad),bl=W<700?Math.min(2,ad*2):Math.min(6,ad*2.2),op=W<700?(ad>1.5?0:1):(ad>3.2?0:1-.2*Math.min(3,ad));
    el.style.transform='translateX('+x.toFixed(1)+'px) rotateY('+rot.toFixed(2)+'deg) scale('+sc.toFixed(3)+')';el.style.filter='blur('+bl.toFixed(2)+'px)';el.style.opacity=op.toFixed(3);el.style.zIndex=String(50-Math.round(ad*10));
    el.classList.toggle('is-on',k===near);el.setAttribute('tabindex',ad<1.5?'0':'-1');el.setAttribute('aria-hidden',ad>2?'true':'false')});
  if(near!==R.cur){R.cur=near;cards.forEach(function(el,k){var v=$('video',el);if(k===near&&R.inView&&!reduced){var p=v.play();if(p&&p.catch)p.catch(function(){})}else v.pause()})}
}
(function(){var last=performance.now();function tick(now){var dt=Math.min(.05,(now-last)/1000);last=now;if(!R.drag&&!R.hover&&R.inView&&!ST.open&&!document.hidden&&!reduced&&!R.tw){R.pos+=R.speed*dt;layoutReels()}requestAnimationFrame(tick)}requestAnimationFrame(tick)})();
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
   Para cambiar un video, reemplaza el id (lo que va después de «v=» en YouTube). Sirven horizontales o verticales. */
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
  $('#ytpV').innerHTML='<img src="assets/yt/'+v.id+'.jpg" alt=""><span class="ytp-ov"></span><span class="ytp-tag">'+ico(YP.tab==='pod'?'i-mic':'i-yt')+(YP.tab==='pod'?'Podcast':'Caso en video')+'</span><button class="ytp-play" data-ytplay aria-label="Reproducir: '+esc(v.t)+'">'+ico('i-play')+'</button><div class="ytp-cap"><small>'+esc(v.k)+(v.d?' · '+v.d:'')+'</small><b>'+esc(v.t)+'</b><span>'+esc(v.by)+'</span></div>';
  $('#ytpList').innerHTML=L.map(function(x,i){return '<li><button data-yti="'+i+'" aria-current="'+(i===YP.i)+'"><span class="ytp-th"><img src="assets/yt/'+x.id+'.jpg" alt="" loading="lazy"><i>'+ico('i-play')+'</i></span><span class="ytp-t"><small>'+esc(x.k)+(x.d?' · '+x.d:'')+'</small><b>'+esc(x.t)+'</b><em>'+esc(x.by)+'</em></span></button></li>'}).join('');
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
$('#galTrack').innerHTML=GAL.map(function(g,i){return '<figure class="loop-i gi gi-'+g.w+'"><button class="gi-b" data-cursor="Ampliar" data-gal="'+i+'" aria-label="Ampliar foto: '+esc(g.t)+'"><img src="'+g.src+'" alt="'+esc(g.t)+'" draggable="false" loading="lazy" style="object-position:'+(g.pos||'50% 50%')+'"></button><figcaption><b>'+esc(g.t)+'</b><em>'+esc(g.d)+'</em></figcaption></figure>'}).join('');
function credOf(g){return g.ph&&PH[g.ph]?'Foto: '+PH[g.ph].by+' · '+PH[g.ph].lic:'Imagen de referencia · '+(g.by||'')}
function openLb(i){LB=(i+GAL.length)%GAL.length;var g=GAL[LB];$('#lbxImg').src=g.src;$('#lbxImg').alt=g.t;$('#lbxCap').innerHTML='<b>'+esc(g.t)+'</b> · '+esc(g.d)+'<small>'+esc(credOf(g))+'</small>';if($('#lbx').hidden){$('#lbx').hidden=false;document.body.classList.add('lock');$('#lbxX').focus()}
  if(window.gsap&&!reduced)gsap.fromTo('#lbxImg',{scale:.94,autoAlpha:0},{scale:1,autoAlpha:1,duration:.5,ease:'power3.out'})}
function closeLb(){$('#lbx').hidden=true;document.body.classList.remove('lock')}
document.addEventListener('click',function(e){var b=e.target.closest('[data-gal]');if(b){openLb(+b.getAttribute('data-gal'));return}var n=e.target.closest('[data-lbx]');if(n){openLb(LB+ +n.getAttribute('data-lbx'));return}if(e.target.closest('#lbxX')||e.target===$('#lbx'))closeLb()});
document.addEventListener('keydown',function(e){if($('#lbx').hidden)return;if(e.key==='Escape')closeLb();if(e.key==='ArrowRight')openLb(LB+1);if(e.key==='ArrowLeft')openLb(LB-1)});
var galLoop=Loop($('#galLoop'),{speed:38,scale:true});

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
var PLANS=[{a:10,t:'Alimentación',d:'Su dieta de un mes.'},{a:20,t:'Atención médica',d:'Medicinas, exámenes y controles.'},{a:50,t:'Rehabilitación completa',d:'Alimento, medicinas y cuidado diario.'}];
var AP={i:0,plan:1,name:'',mail:'',tried:false,ok:false};
$('#pat').innerHTML=PATS.map(function(p,i){return '<article class="loop-i pt"><button class="pt-f" data-ap="'+i+'" tabindex="-1" aria-hidden="true"><img src="'+p.img+'" alt="" draggable="false" loading="lazy" style="object-position:'+(p.pos||'50% 30%')+'"><span class="pt-st">'+esc(p.st)+'</span></button><div class="pt-b"><small>'+esc(p.sp)+' · <em>'+esc(p.sci)+'</em></small><h3>'+esc(p.n)+'</h3><p>'+esc(p.story)+'</p><div class="pt-prog"><span>Recuperación</span><b>'+p.pct+'%</b><i style="--w:'+p.pct+'%"></i></div><button class="zbtn zbtn-ghost pt-go" data-ap="'+i+'"><span class="zbtn-t">Apadrinar a '+esc(p.n)+'</span><span class="zbtn-c">'+ico('i-arrow-ur')+ico('i-arrow-ur')+'</span></button></div></article>'}).join('');
var patLoop=Loop($('#patLoop'),{speed:30});
function renderAp(){
  var p=PATS[AP.i],pl=PLANS[AP.plan],el=$('#ap');$('#apDrT').textContent='Apadrina a '+p.n;
  if(AP.ok){el.innerHTML='<div class="ap-ok"><span class="ap-ok-i">'+ico('i-check')+'</span><h3>Gracias, '+esc(AP.name.split(' ')[0])+'.</h3><p>Ya acompañas la recuperación de <b>'+esc(p.n)+'</b> con $'+pl.a+' al mes. Te escribiremos a '+esc(AP.mail)+' con su certificado y las primeras noticias.</p><p class="ap-note">Maqueta: todavía no se cobra ni se envía ningún correo.</p><button class="zbtn" data-drclose><span class="zbtn-t">Volver al sitio</span><span class="zbtn-c">'+ico('i-arrow-ur')+ico('i-arrow-ur')+'</span></button></div>';return}
  el.innerHTML='<div class="ap-h"><img src="'+p.img+'" alt="" style="object-position:'+(p.pos||'50% 30%')+'"><div><small>'+esc(p.sp)+' · '+esc(p.st)+'</small><b>'+esc(p.n)+'</b><span>'+esc(p.since)+'</span><div class="pt-prog"><span>Recuperación</span><b>'+p.pct+'%</b><i style="--w:'+p.pct+'%"></i></div></div></div>'+
   '<p class="ap-k">Elige cómo quieres acompañarlo cada mes</p><div class="ap-plans" role="radiogroup" aria-label="Plan de apadrinamiento">'+PLANS.map(function(x,i){return '<button role="radio" aria-checked="'+(i===AP.plan)+'" data-plan="'+i+'"><b>$'+x.a+'<small>/mes</small></b><span>'+esc(x.t)+'</span><em>'+esc(x.d)+'</em></button>'}).join('')+'</div>'+
   '<form id="apForm" novalidate><div class="fields">'+fld('apName','Tu nombre *','<input id="apName" autocomplete="name" value="'+esc(AP.name)+'">',AP.tried&&!AP.name.trim(),'Escribe tu nombre')+fld('apMail','Tu correo *','<input id="apMail" type="email" autocomplete="email" value="'+esc(AP.mail)+'">',AP.tried&&!validMail(AP.mail),'Escribe un correo válido, por ejemplo nombre@correo.com')+'</div>'+
   '<button class="zbtn ap-go" type="submit"><span class="zbtn-t">Apadrinar a '+esc(p.n)+' por $'+pl.a+' al mes</span><span class="zbtn-c">'+ico('i-arrow-ur')+ico('i-arrow-ur')+'</span></button><p class="ap-note">Recibes un certificado digital, noticias cada mes y el aviso del día en que vuelve a su hábitat. Puedes cancelar cuando quieras. Es simbólico: '+esc(p.n)+' no se visita ni se entrega.</p></form>';
}
function openAp(i){AP.i=i;AP.ok=false;AP.tried=false;renderAp();openDr('apDr')}
document.addEventListener('click',function(e){var b=e.target.closest('[data-ap]');if(b){openAp(+b.getAttribute('data-ap'));return}var pl=e.target.closest('[data-plan]');if(pl){AP.name=($('#apName')||{}).value||AP.name;AP.mail=($('#apMail')||{}).value||AP.mail;AP.plan=+pl.getAttribute('data-plan');renderAp();var n=$('[data-plan="'+AP.plan+'"]');if(n)n.focus()}});
document.addEventListener('submit',function(e){if(e.target.id!=='apForm')return;e.preventDefault();AP.name=$('#apName').value;AP.mail=$('#apMail').value;AP.tried=true;if(!AP.name.trim()||!validMail(AP.mail)){renderAp();var bad=!AP.name.trim()?$('#apName'):$('#apMail');if(bad)bad.focus();return}AP.ok=true;renderAp()});

/* ---------- redes ---------- */
var SOC={instagram:'i-ig',tiktok:'i-tt',youtube:'i-yt',facebook:'i-fb'};
$('#zSoc').innerHTML=Object.keys(NETS).map(function(k){var n=NETS[k];return '<a href="'+(n.url||'#contacto')+'" data-follow="'+k+'" target="'+(n.url?'_blank':'_self')+'" rel="noopener" aria-label="'+n.name+'">'+ico(SOC[k])+'</a>'}).join('');

renderReels();renderYT(false);renderDon();onScroll();
window.__sacha={R:R,gal:galLoop,pat:patLoop};
addEventListener('load',function(){layoutReels();moveInd('#ptabs','.ptabs-i');moveInd('#atabs','i')});
var rz2=0;addEventListener('resize',function(){clearTimeout(rz2);rz2=setTimeout(function(){moveInd('#ptabs','.ptabs-i');moveInd('#atabs','i')},150)});
