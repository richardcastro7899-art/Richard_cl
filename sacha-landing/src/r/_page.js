
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
