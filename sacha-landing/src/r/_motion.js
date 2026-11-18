
/* ======================  ANIMACIONES (GSAP + ScrollTrigger + SplitText + Lenis)  ======================
   Cada sección aparece mientras se hace scroll (ligada al desplazamiento, no de golpe) y se despide al salir.
   Secciones fijas: el video institucional (la ventana se abre entre dos palabras y al terminar se reproduce) y
   «Cómo trabajamos» (las etapas se apilan). La historia avanza año por año. Las animaciones siempre están activas.
   Si el marco de la vista previa no tiene scroll propio, las secciones fijas se muestran completas. */
var M={scrolls:false};
function onView(el,fn,o){if(!el)return;var list=el.length!==undefined?el:[el];if(!canIO){list.forEach(fn);return}o=o||{};var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);fn(e.target)}})},{rootMargin:o.margin||'0px 0px -12% 0px',threshold:o.th||0});list.forEach(function(x){io.observe(x)})}
function countTo(el,dur){var to=+el.getAttribute('data-count'),pre=el.getAttribute('data-pre')||'',o={v:0};if(!window.gsap||reduced){el.textContent=pre+nf(to);return}gsap.to(o,{v:to,duration:dur||1.8,ease:'power2.out',onUpdate:function(){el.textContent=pre+nf(o.v)}})}

function initMotion(){
  if(!window.gsap||reduced){document.documentElement.classList.add('zstatic');setTl(TL.length-1);autoVid(iv,.3);return}
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

  /* ---- portada: la imagen queda fija; el texto entra ---- */
  var lines=$$('#hxT > span');lines.forEach(function(l){l.innerHTML='<span class="hx-li">'+l.innerHTML+'</span>'});
  var tl=gsap.timeline({defaults:{ease:'power4.out'}});
  tl.from('#zh .zh-in > *',{y:-30,autoAlpha:0,duration:.9,stagger:.08},.1)
    .from('#hxEye',{y:24,autoAlpha:0,duration:.8},.35)
    .from('#hxT .hx-li',{yPercent:110,duration:1.2,stagger:.14},.45)
    .from('#hxP',{y:30,autoAlpha:0,duration:1},.9)
    .from('#hxAct > *',{y:30,autoAlpha:0,duration:.9,stagger:.1},1.05)
    .from('#hxStat',{x:60,autoAlpha:0,duration:1.1},1)
    .add(function(){countTo($('#hxStat b'),2)},1.1)
    .from('.hx-cue',{autoAlpha:0,duration:.8},1.5);
  if(M.scrolls){gsap.to('.hx-copy',{y:-100,autoAlpha:0,ease:'none',scrollTrigger:{trigger:'#inicio',start:'top top',end:'70% top',scrub:true}});
    gsap.to('#hxStat',{y:-60,autoAlpha:0,ease:'none',scrollTrigger:{trigger:'#inicio',start:'top top',end:'60% top',scrub:true}})}

  /* ---- video institucional: la ventana se abre entre dos palabras; al terminar, se reproduce ---- */
  if(M.scrolls){
    de.classList.add('imm-on');
    var small=wide?'inset(35% 31% 18% 31% round 24px)':'inset(38% 8% 30% 8% round 18px)';
    var playing=false;
    var it=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:'#video',start:'top top',end:'+=160%',pin:'#immPin',scrub:.6,anticipatePin:1,
      onUpdate:function(s){if(s.progress>.97&&!playing){playing=true;ivPlay()}else if(s.progress<.9&&playing){playing=false;ivStop()}}}});
    it.fromTo('#immFrame',{clipPath:small},{clipPath:'inset(0% 0% 0% 0% round 0px)',duration:2},0)
      .fromTo('#immVid',{scale:1.2},{scale:1,duration:2},0)
      .fromTo('#immWL',{xPercent:0},{xPercent:-140,autoAlpha:0,duration:1.6},0)
      .fromTo('#immWR',{xPercent:0},{xPercent:140,autoAlpha:0,duration:1.6},0)
      .to('#immHead',{y:-80,autoAlpha:0,duration:.8},.1)
      .fromTo('#immCtl',{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.4},1.8)
      .to({},{duration:.3});
    gsap.from('#immHead > *',{y:40,autoAlpha:0,duration:1,stagger:.1,ease:'power3.out',scrollTrigger:{trigger:'#video',start:'top 80%',once:true}});
    gsap.from('.imm-w',{y:60,autoAlpha:0,duration:1.1,stagger:.12,ease:'power3.out',scrollTrigger:{trigger:'#video',start:'top 70%',once:true}});
  }else{
    de.classList.add('imm-static');autoVid(iv,.3);
    onView($('#immFrame'),function(){gsap.fromTo('#immFrame',{clipPath:'inset(8% 8% 8% 8% round 24px)'},{clipPath:'inset(0% 0% 0% 0% round 24px)',duration:1.4,ease:'power4.inOut'})});
  }

  /* ---- títulos: las líneas suben y aparecen (sin máscara, así no se cortan letras como g, p o y) ---- */
  function splitHeads(){$$('.zt').forEach(function(el){if(el.closest('#immHead'))return;
    SplitText.create(el,{type:'lines',linesClass:'zline',autoSplit:true,onSplit:function(self){return gsap.from(self.lines,{y:46,autoAlpha:0,rotationX:-40,transformOrigin:'50% 100%',duration:1.1,ease:'power3.out',stagger:.12,scrollTrigger:{trigger:el,start:'top 88%',once:true}})}})})}
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
    gsap.fromTo('#proceso',{clipPath:'inset(6% 4% 0% 4% round 40px)'},{clipPath:'inset(0% 0% 0% 0% round 0px)',ease:'none',scrollTrigger:{trigger:'#proceso',start:'top 95%',end:'top top',scrub:true}});
    gsap.set(pcs.slice(1),{yPercent:110});
    var pt=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:'#proceso',start:'top top',end:'+='+(pcs.length*70)+'%',pin:'#procPin',scrub:.6,anticipatePin:1,
      onUpdate:function(s){setProc(Math.min(pcs.length-1,Math.floor(s.progress*pcs.length*0.999)))}}});
    pcs.forEach(function(c,i){if(!i)return;pt.to(c,{yPercent:0,duration:1},i-1).to(pcs[i-1],{scale:.9,autoAlpha:.35,filter:'blur(3px)',duration:1},i-1).fromTo($('img',c),{scale:1.25},{scale:1,duration:1},i-1)});
    pt.to({},{duration:.5});
    gsap.from('.proc-l > *',{x:-60,autoAlpha:0,duration:1,stagger:.1,ease:'power3.out',scrollTrigger:{trigger:'#proceso',start:'top 60%',once:true}});
    gsap.from('#procCards',{x:120,autoAlpha:0,duration:1.2,ease:'power3.out',scrollTrigger:{trigger:'#proceso',start:'top 60%',once:true}});
  }else{pcs.forEach(function(c){scrubIn(c,{y:80,autoAlpha:0,scale:.95},{y:0,autoAlpha:1,scale:1})})}

  /* ---- reels: el bloque oscuro se abre y el carrusel entra girando ---- */
  if(M.scrolls)gsap.fromTo('#reels',{clipPath:'inset(8% 5% 0% 5% round 48px)'},{clipPath:'inset(0% 0% 0% 0% round 0px)',ease:'none',scrollTrigger:{trigger:'#reels',start:'top 95%',end:'top 20%',scrub:true}});
  scrubIn($('#reelsT2'),{rotationY:-30,x:300,autoAlpha:0,transformPerspective:1600},{rotationY:0,x:0,autoAlpha:1},{trigger:'#krl',start:'top 100%',end:'top 45%'});

  /* ---- podcast: el panel crece y el reproductor se descubre ---- */
  scrubIn($('.podx'),{scale:.86,y:100,autoAlpha:.2,borderRadius:72},{scale:1,y:0,autoAlpha:1,borderRadius:28},{start:'top 100%',end:'top 35%'});
  gsap.set('#ytpV',{clipPath:'inset(0% 0% 100% 0% round 18px)'});gsap.set('.ytp-list li',{x:50,autoAlpha:0});
  onView($('#ytp'),function(){gsap.to('#ytpV',{clipPath:'inset(0% 0% 0% 0% round 18px)',duration:1.3,ease:'power4.inOut',clearProps:'clipPath'});gsap.to('.ytp-list li',{x:0,autoAlpha:1,duration:.8,stagger:.07,ease:'power3.out',delay:.3})});
  onView($('#ptabs'),function(){moveInd('#ptabs','.ptabs-i')});

  /* ---- galería: la banda con textura se despliega y las fotos caen en su lugar ---- */
  scrubIn($('.gal-band'),{scaleX:0},{scaleX:1},{trigger:'#galLoop',start:'top 100%',end:'top 50%'});
  scrubIn($('#galLoop'),{y:120,autoAlpha:0,rotation:3},{y:0,autoAlpha:1,rotation:0},{start:'top 100%',end:'top 55%'});

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
  if(M.scrolls&&wide)$$('.sh').forEach(function(h){gsap.to(h,{y:-40,autoAlpha:.2,ease:'none',scrollTrigger:{trigger:h,start:'top 14%',end:'top -20%',scrub:true}})});
  addEventListener('load',function(){ScrollTrigger.refresh()});var rt=0;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){ScrollTrigger.refresh()},200)});
}
initMotion();
