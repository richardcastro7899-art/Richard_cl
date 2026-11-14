
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
