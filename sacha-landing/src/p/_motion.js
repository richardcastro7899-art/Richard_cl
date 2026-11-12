
/* ======================  ANIMACIONES (GSAP + ScrollTrigger + Lenis)  ======================
   Las entradas usan IntersectionObserver, que también funciona dentro de la previsualización (aunque el marco no
   tenga scroll propio). Los efectos ligados al scroll (portada que queda fija, giro del video vertical, tarjetas
   apiladas) usan ScrollTrigger cuando la página tiene scroll; si no, se reproducen como animación al aparecer.
   Con «reducir movimiento» o sin GSAP la página queda estática y completa. */
var M={scrolls:false};
function onView(el,fn,o){if(!el)return;if(!canIO){fn(el);return}o=o||{};var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);fn(e.target)}})},{rootMargin:o.margin||'0px 0px -12% 0px',threshold:o.th||0});(el.length!==undefined?el:[el]).forEach(function(x){io.observe(x)})}
/* parte el texto en palabras (y opcionalmente letras) sin tocar los SVG del subrayado */
function splitText(el,chars){
  if(el.__split)return el.__split;var out=[];
  (function walk(node){Array.prototype.slice.call(node.childNodes).forEach(function(n){
    if(n.nodeType===3){var parts=n.textContent.split(/(\s+)/),frag=document.createDocumentFragment();
      parts.forEach(function(p){if(!p)return;if(/^\s+$/.test(p)){frag.appendChild(document.createTextNode(' '));return}
        var w=document.createElement('span');w.className='xw';
        if(chars){p.split('').forEach(function(ch){var c=document.createElement('span');c.className='xc';c.textContent=ch;w.appendChild(c);out.push(c)})}
        else{var i=document.createElement('span');i.className='xwi';i.textContent=p;w.appendChild(i);out.push(i)}
        frag.appendChild(w)});
      n.parentNode.replaceChild(frag,n)}
    else if(n.nodeType===1&&n.tagName.toLowerCase()!=='svg')walk(n)})})(el);
  el.__split=out;return out;
}
function prepLines(){$$('.ul path,.doodle path').forEach(function(p){p.setAttribute('pathLength','1')})}
function drawIn(el,delay){$$('.ul,.doodle',el).forEach(function(s){setTimeout(function(){s.classList.add('drawn')},(delay||0)*1000)})}

function initMotion(){
  prepLines();
  if(!window.gsap||reduced){document.documentElement.classList.add('static');$$('.ul,.doodle').forEach(function(s){s.classList.add('drawn')});return}
  document.documentElement.classList.add('mo');
  if(window.ScrollTrigger)gsap.registerPlugin(ScrollTrigger);
  M.scrolls=!!window.ScrollTrigger&&(document.documentElement.scrollHeight-innerHeight>400);
  document.documentElement.classList.toggle('noscroll',!M.scrolls);
  var fine=matchMedia('(pointer:fine)').matches,wide=innerWidth>=900;

  /* desplazamiento suave (como la plantilla) */
  if(M.scrolls&&window.Lenis&&fine){
    var lenis=new Lenis({lerp:.1,smoothWheel:true});window.__lenis=lenis;
    lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(function(t){lenis.raf(t*1000)});gsap.ticker.lagSmoothing(0);
    $$('.ficha,.story,.film,.nv-menu').forEach(function(x){x.setAttribute('data-lenis-prevent','')});
    new MutationObserver(function(){if(document.body.classList.contains('lock'))lenis.stop();else lenis.start()}).observe(document.body,{attributes:true,attributeFilter:['class']});
  }

  function scrubFx(trigger,target,from,to,cfg){
    if(!$(typeof target==='string'?target:'body'))return;
    if(M.scrolls){return gsap.fromTo(target,from,Object.assign({},to,{ease:'none',scrollTrigger:Object.assign({trigger:trigger,scrub:true,invalidateOnRefresh:true},cfg||{})}))}
    gsap.set(target,from);onView($(trigger),function(){gsap.to(target,Object.assign({},to,{duration:1.5,ease:'power3.out'}))});
  }

  /* ---- portada: entrada orquestada ---- */
  var hc=splitText($('#heroT'),true);
  var pre=$('#pre'),tl=gsap.timeline({defaults:{ease:'power4.out'}});
  if(pre){pre.hidden=false;
    tl.fromTo('#pre .logo',{autoAlpha:0,y:24,scale:.94},{autoAlpha:1,y:0,scale:1,duration:.7},0).fromTo('#pre i',{scaleX:0},{scaleX:1,duration:.9,ease:'power2.inOut'},.1)
      .to('#pre .logo',{autoAlpha:0,y:-20,duration:.4,ease:'power2.in'},1.05).to(pre,{yPercent:-100,duration:.9,ease:'power4.inOut',onComplete:function(){pre.hidden=true}},1.2);
    tl.addLabel('in',1.35)}else tl.addLabel('in',0);
  tl.from('#nv',{yPercent:-100,autoAlpha:0,duration:1},'in+=.1')
    .fromTo('#heroMedia',{scale:1.18},{scale:1,duration:2.6,ease:'power3.out'},'in+=0')
    .from('.kh-eyb',{y:40,autoAlpha:0,duration:1},'in+=.35')
    .from(hc,{yPercent:110,autoAlpha:0,rotate:6,duration:1.1,stagger:.016},'in+=.45')
    .add(function(){drawIn($('#heroT'))},'in+=1.3')
    .from('.kh-p',{y:50,autoAlpha:0,duration:1.1},'in+=.95')
    .from('.kh-act .ob',{y:40,autoAlpha:0,duration:1,stagger:.1},'in+=1.1')
    .from('.kh-mini',{x:80,autoAlpha:0,rotationY:-30,transformPerspective:900,duration:1.3},'in+=1.2')
    .from('#heroPP,.kh-credit,.kh-cue',{autoAlpha:0,duration:.8},'in+=1.5');
  /* la página sube sobre la portada fija */
  if(M.scrolls){
    gsap.to('#heroIn',{y:-120,autoAlpha:.15,ease:'none',scrollTrigger:{trigger:'#sheet',start:'top bottom',end:'top 15%',scrub:true}});
    gsap.to('#heroMedia',{scale:1.08,filter:'brightness(.55)',ease:'none',scrollTrigger:{trigger:'#sheet',start:'top bottom',end:'top top',scrub:true}});
  }

  /* ---- titulares por palabras + subrayados que se dibujan ---- */
  $$('.st,.intro-t').forEach(function(h){var w=splitText(h,false);gsap.set(w,{yPercent:115});onView(h,function(){gsap.to(w,{yPercent:0,duration:1.1,stagger:.045,ease:'power4.out'});drawIn(h,.5)})});
  $$('.sk h3').forEach(function(h){onView(h,function(){drawIn(h,.2)})});

  /* ---- entradas genéricas ---- */
  gsap.set('.rv',{y:44,autoAlpha:0});
  onView($$('.rv'),function(el){gsap.to(el,{y:0,autoAlpha:1,duration:1.1,ease:'power3.out',delay:(el.matches('.sh-r,.proof')?.15:0)})});

  /* ---- intro: el video en la píldora crece ---- */
  gsap.set('.pill',{width:0});onView($('.intro-t'),function(){gsap.to('.pill',{width:'2.4em',duration:1.2,ease:'power4.inOut',delay:.35})});
  onView($('#proofAv'),function(){gsap.from('#proofAv > *',{scale:0,duration:.7,stagger:.07,ease:'back.out(2)',delay:.3})});

  /* ---- cifras: la tarjeta se abre, las barras caen y los números cuentan ---- */
  scrubFx('.metrics','#metCard',{scale:.9,borderRadius:48},{scale:1,borderRadius:24},{start:'top bottom',end:'top 30%'});
  gsap.set('.mb-bar i',{yPercent:-100});gsap.set('.mb-t',{y:40,autoAlpha:0});
  onView($('#metBars'),function(){gsap.to('.mb-bar i',{yPercent:0,duration:1.5,stagger:.15,ease:'power4.out'});gsap.to('.mb-t',{y:0,autoAlpha:1,duration:1,stagger:.15,ease:'power3.out',delay:.4});$$('#metBars [data-count]').forEach(function(b,i){setTimeout(function(){countUp(b,1.9)},400+i*150)})});

  /* ---- marquesina que acelera con el scroll ---- */
  var mq=$('#marqLogos .marq-t'),mqT=mq?gsap.to(mq,{xPercent:-50,repeat:-1,duration:34,ease:'none'}):null;
  if(M.scrolls&&mqT)ScrollTrigger.create({start:0,end:'max',onUpdate:function(s){var v=Math.min(6,Math.abs(s.getVelocity())/300);gsap.to(mqT,{timeScale:(1+v)*s.direction,duration:.3,overwrite:true,onComplete:function(){gsap.to(mqT,{timeScale:s.direction,duration:1})}});GL.boost=Math.min(.05,GL.boost+v*.004)}});

  /* ---- EL GIRO: la pantalla del video institucional entra inclinada y gira hasta quedar de frente ---- */
  if(wide)scrubFx('#cineStage','#cine',{rotationX:34,rotationY:-10,rotationZ:-3,scale:.74,y:0,transformPerspective:1500,transformOrigin:'50% 100%'},{rotationX:0,rotationY:0,rotationZ:0,scale:1,y:0},{start:'top 95%',end:'top 22%'});
  else{gsap.set('#cine',{rotationX:24,scale:.86,autoAlpha:0,transformPerspective:1200,transformOrigin:'50% 100%'});onView($('#cine'),function(){gsap.to('#cine',{rotationX:0,scale:1,autoAlpha:1,duration:1.4,ease:'power3.out'})})}
  gsap.set('.chap',{y:50,autoAlpha:0});onView($('#instList'),function(){gsap.to('.chap',{y:0,autoAlpha:1,duration:.9,stagger:.1,ease:'power3.out'})});

  /* ---- cápsulas: el carrusel entra girando ---- */
  gsap.set('#reelsT',{rotationY:-28,x:260,autoAlpha:0,transformPerspective:1600});
  onView($('#krl'),function(){gsap.to('#reelsT',{rotationY:0,x:0,autoAlpha:1,duration:1.6,ease:'power4.out'})});

  /* ---- tarjetas apiladas: la anterior se encoge y se desenfoca al llegar la siguiente ---- */
  var sks=$$('.sk');
  sks.forEach(function(sk,i){var card=$('.sk-card',sk),next=sks[i+1];
    if(M.scrolls&&next)gsap.to(card,{scale:.9-.012*(sks.length-i),y:-30,filter:'blur(4px)',opacity:.45,ease:'none',scrollTrigger:{trigger:next,start:'top 92%',end:'top 22%',scrub:true}});
    onView(card,function(){card.classList.add('is-in');gsap.from($$('.sk-l > *',card),{y:40,autoAlpha:0,duration:.9,stagger:.07,ease:'power3.out'});gsap.from($('.pc',card),{y:60,rotationX:-25,autoAlpha:0,transformPerspective:900,duration:1.2,ease:'power4.out',delay:.2});$$('[data-count]',card).forEach(function(b){countUp(b,1.6)});drawIn(card,.3);
      var dot=$('.rt-dot',card),path=$('.rt',card);if(dot&&path){var L=path.getTotalLength(),o={t:0};gsap.to(o,{t:1,duration:3.2,repeat:-1,repeatDelay:.6,ease:'power1.inOut',onUpdate:function(){var p=path.getPointAtLength(o.t*L);dot.setAttribute('cx',p.x);dot.setAttribute('cy',p.y)}})}},{margin:'0px 0px -20% 0px'});
  });

  /* ---- podcast, casos, preguntas, fichas, donación ---- */
  onView($('#kpod'),function(){gsap.from('#kpod .kpod-v img',{scale:1.25,duration:1.8,ease:'power3.out'});gsap.from('#kpod .kpod-num',{yPercent:70,autoAlpha:0,duration:1.2,ease:'power4.out',delay:.2});gsap.from('#kpod .kpod-c > *:not(.kpod-num)',{y:30,autoAlpha:0,duration:.8,stagger:.07,ease:'power3.out',delay:.25});gsap.from('#kpod .kpod-play',{scale:0,duration:.9,ease:'back.out(2)',delay:.5})});
  /* ---- apadrina: las tarjetas suben escalonadas y la barra de recuperación se llena ---- */
  gsap.set('.pt',{y:80,autoAlpha:0});onView($$('.pt'),function(el){var k=$$('.pt').indexOf(el);gsap.to(el,{y:0,autoAlpha:1,duration:1,ease:'power3.out',delay:(k%4)*.1,onStart:function(){el.classList.add('is-in')}});gsap.from($('img',el),{scale:1.3,duration:1.6,ease:'power3.out',delay:(k%4)*.1});$$('[data-count]',el).forEach(function(b){countUp(b,1.6)})});
  onView($('.pat-get'),function(){gsap.from('.pat-get li',{y:30,autoAlpha:0,duration:.8,stagger:.1,ease:'power3.out'})});
  onView($('.kdon-meter'),function(){donMeter()});
  gsap.set('#casesT',{x:200,autoAlpha:0});onView($('#cases'),function(){gsap.to('#casesT',{x:0,autoAlpha:1,duration:1.4,ease:'power4.out'})});
  onView($('#faqList'),function(){gsap.from('#faqList .fq',{y:30,autoAlpha:0,duration:.8,stagger:.07,ease:'power3.out'})});
  onView($('#fzList'),function(){gsap.from('#fzList .fzc',{scale:.6,autoAlpha:0,duration:.7,stagger:.04,ease:'back.out(1.8)'})});
  onView($('.kfaq-cta'),function(){gsap.from('#faqAv img',{scale:0,duration:.6,stagger:.08,ease:'back.out(2)',delay:.3})});
  onView($('.sedes-m'),function(){gsap.from('.sedes-m',{clipPath:'inset(0 0 100% 0 round 20px)',duration:1.4,ease:'power4.inOut'})});

  /* ---- cierre: el globo gira más rápido al llegar y las etiquetas flotan ---- */
  onView($('#kcta'),function(){GL.boost=.06;gsap.from('.kcta-chip',{scale:.6,autoAlpha:0,duration:.9,stagger:.15,ease:'back.out(2)',delay:.3});
    $$('.kcta-chip').forEach(function(c,i){gsap.to(c,{y:i%2?10:-10,duration:2.6+i*.4,repeat:-1,yoyo:true,ease:'sine.inOut',delay:1.2})})});
  scrubFx('#kcta','#globe',{scale:.8,rotate:-12},{scale:1,rotate:0},{start:'top bottom',end:'top 20%'});

  /* ---- pie: la palabra gigante sube ---- */
  gsap.set('.kft-big svg',{yPercent:60});onView($('.kft-big'),function(){gsap.to('.kft-big svg',{yPercent:0,duration:1.6,ease:'power4.out'})},{margin:'0px'});
  onView($('.kft-g'),function(){gsap.from('.kft-brand,.kft-links',{y:60,autoAlpha:0,duration:1.1,stagger:.12,ease:'power3.out'})});

  if(window.ScrollTrigger){addEventListener('load',function(){ScrollTrigger.refresh()});var rt=0;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){ScrollTrigger.refresh()},200)})}
}
function countUp(el,dur){var to=+el.getAttribute('data-count'),pre=el.getAttribute('data-pre')||'',suf=el.getAttribute('data-suf')||'',o={v:0};if(!window.gsap||reduced){el.textContent=pre+nf(to)+suf;return}gsap.to(o,{v:to,duration:dur||1.8,ease:'power2.out',onUpdate:function(){el.textContent=pre+nf(o.v)+suf}})}
initMotion();
