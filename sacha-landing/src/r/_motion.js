
/* ======================  ANIMACIONES (GSAP + ScrollTrigger + SplitText + Lenis)  ======================
   Entradas al aparecer y salidas ligadas al scroll. Tres secciones se fijan mientras se recorren: el video
   institucional (la ventana crece), la línea de tiempo (avanza año por año) y «Cómo trabajamos» (las etapas se
   apilan). Si el marco de la vista previa no tiene scroll propio, esas secciones se muestran completas y animan
   al aparecer. Con «Reducir movimiento» la página queda estática y completa (el aviso inferior permite activarlas). */
var M={scrolls:false};
function onView(el,fn,o){if(!el)return;var list=el.length!==undefined?el:[el];if(!canIO){list.forEach(fn);return}o=o||{};var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);fn(e.target)}})},{rootMargin:o.margin||'0px 0px -12% 0px',threshold:o.th||0});list.forEach(function(x){io.observe(x)})}
function countTo(el,dur){var to=+el.getAttribute('data-count'),pre=el.getAttribute('data-pre')||'',o={v:0};if(!window.gsap||reduced){el.textContent=pre+nf(to);return}gsap.to(o,{v:to,duration:dur||1.8,ease:'power2.out',onUpdate:function(){el.textContent=pre+nf(o.v)}})}

function initMotion(){
  if(!window.gsap||reduced){document.documentElement.classList.add('zstatic');setTl(TL.length-1);return}
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
  var lines=$$('#hxT > span');lines.forEach(function(l){l.innerHTML='<span class="hx-li">'+l.innerHTML+'</span>'});
  var tl=gsap.timeline({defaults:{ease:'power4.out'}});
  tl.fromTo('#hxBg',{scale:1.18},{scale:1,duration:2.6,ease:'power3.out'},0)
    .from('#zh .zh-in > *',{y:-30,autoAlpha:0,duration:.9,stagger:.08},.2)
    .from('#hxEye',{y:24,autoAlpha:0,duration:.8},.45)
    .from('#hxT .hx-li',{yPercent:110,duration:1.2,stagger:.14},.55)
    .from('#hxP',{y:30,autoAlpha:0,duration:1},1)
    .from('#hxAct > *',{y:30,autoAlpha:0,duration:.9,stagger:.1},1.15)
    .from('#hxStat',{x:60,autoAlpha:0,duration:1.1},1.1)
    .add(function(){countTo($('#hxStat b'),2)},1.2)
    .from('#hxPP,.hx-cue,.hx-credit',{autoAlpha:0,duration:.8},1.5);
  /* portada: salida al bajar */
  if(M.scrolls){var hx={trigger:'#inicio',start:'top top',end:'bottom top',scrub:true};
    gsap.to('#hxBg',{yPercent:18,scale:1.06,ease:'none',scrollTrigger:hx});
    gsap.to('.hx-copy',{y:-100,autoAlpha:0,ease:'none',scrollTrigger:{trigger:'#inicio',start:'top top',end:'70% top',scrub:true}});
    gsap.to('#hxStat',{y:-60,autoAlpha:0,ease:'none',scrollTrigger:{trigger:'#inicio',start:'top top',end:'60% top',scrub:true}})}

  /* ---- video institucional: la ventana crece hasta pantalla completa ---- */
  if(M.scrolls){
    de.classList.add('imm-on');
    var small=wide?'inset(34% 22% 8% 22% round 24px)':'inset(36% 5% 22% 5% round 18px)';
    var it=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:'#video',start:'top top',end:'+=140%',pin:'#immPin',scrub:.6,anticipatePin:1}});
    it.fromTo('#immFrame',{clipPath:small},{clipPath:'inset(0% 0% 0% 0% round 0px)',duration:2},0)
      .fromTo('#immVid',{scale:1.16},{scale:1,duration:2},0)
      .to('#immHead',{y:-80,autoAlpha:0,duration:.9},.3)
      .fromTo('#immPlay',{autoAlpha:0,scale:.8},{autoAlpha:1,scale:1,duration:.6},1.5)
      .fromTo('#immCtl',{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.5},1.6)
      .to({},{duration:.4});
  }else{
    de.classList.add('imm-static');
    onView($('#immFrame'),function(){gsap.fromTo('#immFrame',{clipPath:'inset(8% 8% 8% 8% round 24px)'},{clipPath:'inset(0% 0% 0% 0% round 24px)',duration:1.4,ease:'power4.inOut'})});
  }

  /* ---- títulos por líneas (entrada) y encabezados que se despiden (salida) ---- */
  function splitHeads(){$$('.zt').forEach(function(el){if(el.closest('#immHead'))return;
    SplitText.create(el,{type:'lines',mask:'lines',linesClass:'zline',maskClass:'zmask',autoSplit:true,onSplit:function(self){return gsap.from(self.lines,{yPercent:115,duration:1.15,ease:'power4.out',stagger:.1,scrollTrigger:{trigger:el,start:'top 90%',once:true}})}})})}
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){splitHeads();ScrollTrigger.refresh()});else splitHeads();
  gsap.set('.lbl',{autoAlpha:0,x:-20});onView($$('.lbl'),function(el){gsap.to(el,{autoAlpha:1,x:0,duration:.9,ease:'power3.out'})});
  gsap.set('.sh-p,.hist-lead',{autoAlpha:0,y:30});onView($$('.sh-p,.hist-lead'),function(el){gsap.to(el,{autoAlpha:1,y:0,duration:1,ease:'power3.out',delay:.2})});

  /* ---- historia: la línea se llena con el scroll y cada hito se enciende ---- */
  var tis=$$('.tl-i');
  if(M.scrolls){
    gsap.fromTo('#tlFill',{scaleY:0},{scaleY:1,ease:'none',scrollTrigger:{trigger:'#tl',start:'top 60%',end:'bottom 60%',scrub:true}});
    tis.forEach(function(li,i){ScrollTrigger.create({trigger:li,start:'top 62%',onEnter:function(){setTl(i)},onLeaveBack:function(){setTl(Math.max(0,i-1))}})});
    setTl(0);
  }else{setTl(TL.length-1);gsap.set('#tlFill',{scaleY:1})}
  gsap.set(tis,{autoAlpha:0,y:50});onView(tis,function(el){gsap.to(el,{autoAlpha:1,y:0,duration:.9,ease:'power3.out'})},{margin:'0px 0px -8% 0px'});
  gsap.set('#histCard img',{yPercent:25,autoAlpha:0});gsap.set('#histCard .mcard-pat',{scale:.85,autoAlpha:0});
  onView($('#histCard'),function(){gsap.to('#histCard .mcard-pat',{scale:1,autoAlpha:1,duration:1.2,ease:'power4.out'});gsap.to('#histCard img',{yPercent:0,autoAlpha:1,duration:1.2,ease:'back.out(1.4)',delay:.2})});
  onView($('#kpis'),function(){gsap.from('#kpis > div',{y:40,autoAlpha:0,duration:.9,stagger:.1,ease:'power3.out'});$$('#kpis [data-count]').forEach(function(b){countTo(b,1.8)})});

  /* ---- cómo trabajamos: las etapas se apilan mientras la sección queda fija ---- */
  var pcs=$$('.pcard');
  if(M.scrolls&&wide){
    de.classList.add('proc-on');
    gsap.set(pcs.slice(1),{yPercent:110});
    var pt=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:'#proceso',start:'top top',end:'+='+(pcs.length*70)+'%',pin:'#procPin',scrub:.6,anticipatePin:1,
      onUpdate:function(s){var i=Math.min(pcs.length-1,Math.floor(s.progress*pcs.length*0.999));setProc(i);$$('#procNav li em').forEach(function(em,k){var f=Math.max(0,Math.min(1,s.progress*pcs.length-k));em.style.transform='scaleX('+f.toFixed(3)+')'})}}});
    pcs.forEach(function(c,i){if(!i)return;pt.to(c,{yPercent:0,duration:1},i-1).to(pcs[i-1],{scale:.9,autoAlpha:.35,filter:'blur(3px)',duration:1},i-1).fromTo($('img',c),{scale:1.25},{scale:1,duration:1},i-1)});
    pt.to({},{duration:.5});
  }else{
    gsap.set(pcs,{y:60,autoAlpha:0});onView(pcs,function(el){gsap.to(el,{y:0,autoAlpha:1,duration:1,ease:'power3.out'})});
  }

  /* ---- reels: el carrusel entra girando ---- */
  gsap.set('#reelsT2',{rotationY:-24,x:240,autoAlpha:0,transformPerspective:1600});
  onView($('#krl'),function(){gsap.to('#reelsT2',{rotationY:0,x:0,autoAlpha:1,duration:1.6,ease:'power4.out'})});

  /* ---- podcast: el panel se abre ---- */
  if(M.scrolls)gsap.fromTo('.podx',{scale:.94,borderRadius:56},{scale:1,borderRadius:28,ease:'none',scrollTrigger:{trigger:'.podx',start:'top 98%',end:'top 45%',scrub:true}});
  gsap.set('#ytpV',{clipPath:'inset(0% 0% 100% 0% round 18px)'});gsap.set('.ytp-list li',{x:50,autoAlpha:0});
  onView($('#ytp'),function(){gsap.to('#ytpV',{clipPath:'inset(0% 0% 0% 0% round 18px)',duration:1.3,ease:'power4.inOut',clearProps:'clipPath'});gsap.to('.ytp-list li',{x:0,autoAlpha:1,duration:.8,stagger:.07,ease:'power3.out',delay:.3})});
  onView($('#ptabs'),function(){moveInd('#ptabs','.ptabs-i')});

  /* ---- galería y pacientes: entrada ---- */
  gsap.set('#galLoop',{autoAlpha:0,x:120});onView($('#galLoop'),function(){gsap.to('#galLoop',{autoAlpha:1,x:0,duration:1.4,ease:'power3.out'})});

  /* ---- donar ---- */
  gsap.set('#donCard img',{yPercent:30,autoAlpha:0});gsap.set('#donCard .mcard-txt > *',{y:30,autoAlpha:0});
  onView($('#donCard'),function(){gsap.to('#donCard .mcard-txt > *',{y:0,autoAlpha:1,duration:.9,stagger:.08,ease:'power3.out'});gsap.to('#donCard img',{yPercent:0,autoAlpha:1,duration:1.2,ease:'back.out(1.3)',delay:.3})});
  gsap.set('.cause',{y:30,autoAlpha:0});onView($('#causes'),function(){gsap.to('.cause',{y:0,autoAlpha:1,duration:.7,stagger:.07,ease:'power3.out'})});
  onView($('#atabs'),function(){moveInd('#atabs','i')});

  /* ---- si encuentras un animal: los pasos aparecen uno a uno ---- */
  var es=$$('#encSteps li');
  if(M.scrolls){es.forEach(function(li){gsap.fromTo(li,{autoAlpha:.25,x:-24},{autoAlpha:1,x:0,ease:'none',scrollTrigger:{trigger:li,start:'top 88%',end:'top 62%',scrub:true}});gsap.fromTo($('i',li),{scale:.6,rotate:-30},{scale:1,rotate:0,ease:'none',scrollTrigger:{trigger:li,start:'top 88%',end:'top 62%',scrub:true}})})}
  else{gsap.set(es,{y:30,autoAlpha:0});onView($('#encSteps'),function(){gsap.to(es,{y:0,autoAlpha:1,duration:.8,stagger:.12,ease:'power3.out'})})}
  gsap.set('#encR img',{x:80,autoAlpha:0});gsap.set('#encR .mcard-pat',{scale:.85,autoAlpha:0});
  onView($('#encR'),function(){gsap.to('#encR .mcard-pat',{scale:1,autoAlpha:1,duration:1.2,ease:'power4.out'});gsap.to('#encR img',{x:0,autoAlpha:1,duration:1.2,ease:'power3.out',delay:.2})});

  /* ---- pie ---- */
  gsap.set('.zfoot-top > *,.zfoot-cols > div',{y:50,autoAlpha:0});
  onView($('.zfoot'),function(){gsap.to('.zfoot-top > *,.zfoot-cols > div',{y:0,autoAlpha:1,duration:1,stagger:.08,ease:'power3.out'})});

  /* ---- cursor contextual y botones magnéticos ---- */
  if(fine){var c=document.createElement('div');c.className='zcur';c.setAttribute('aria-hidden','true');c.innerHTML='<span></span>';document.body.appendChild(c);
    var lab=$('span',c),qx=gsap.quickTo(c,'x',{duration:.3,ease:'power3'}),qy=gsap.quickTo(c,'y',{duration:.3,ease:'power3'}),on=false;gsap.set(c,{xPercent:-50,yPercent:-50,scale:.2,autoAlpha:0});
    addEventListener('mousemove',function(e){qx(e.clientX);qy(e.clientY)},{passive:true});
    document.addEventListener('mouseover',function(e){var t=e.target.closest('[data-cursor]'),show=!!t&&!(t.classList.contains('reel')&&!t.classList.contains('is-on'));if(show){lab.textContent=t.getAttribute('data-cursor');if(!on){on=true;gsap.to(c,{scale:1,autoAlpha:1,duration:.35,ease:'back.out(2)'})}}else if(on){on=false;gsap.to(c,{scale:.2,autoAlpha:0,duration:.2})}});
    $$('.zbtn,.zh-don').forEach(function(b){b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();gsap.to(b,{x:(e.clientX-r.left-r.width/2)*.16,y:(e.clientY-r.top-r.height/2)*.28,duration:.4,ease:'power3.out'})});b.addEventListener('mouseleave',function(){gsap.to(b,{x:0,y:0,duration:.9,ease:'elastic.out(1,.4)'})})});
  }
  /* encabezados que se despiden al salir (se crean al final para medir después de las secciones fijas) */
  if(M.scrolls&&wide)$$('.sh').forEach(function(h){gsap.to(h,{y:-40,autoAlpha:.2,ease:'none',scrollTrigger:{trigger:h,start:'top 14%',end:'top -20%',scrub:true}})});
  addEventListener('load',function(){ScrollTrigger.refresh()});var rt=0;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){ScrollTrigger.refresh()},200)});
}
initMotion();
