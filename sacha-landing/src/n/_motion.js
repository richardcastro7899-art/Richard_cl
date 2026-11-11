
/* ======================  ANIMACIONES (GSAP + ScrollTrigger + SplitText)  ======================
   Sin «reducir movimiento» y con GSAP disponible: portada con entrada orquestada, titulares que suben por líneas,
   imágenes que se revelan y se desplazan con paralaje, contadores, tarjetas escalonadas, marquesinas que reaccionan
   a la velocidad del scroll, cursor contextual y botones magnéticos. Si no, la página es estática y completa. */
function initMotion(){
  if(!window.gsap||!window.ScrollTrigger||reduced){document.documentElement.classList.add('zstatic');return}
  gsap.registerPlugin(ScrollTrigger,window.SplitText);
  document.documentElement.classList.add('zmo');
  var fine=matchMedia('(pointer:fine)').matches,wide=innerWidth>=900;
  var FINAL='polygon(0% 0%,100% 0%,100% 77.6%,65% 77.6%,61.5% 66%,0% 46.5%)',START='polygon(0% 0%,100% 0%,100% 0%,65% 0%,61.5% 0%,0% 0%)';
  function countTo(el,dur){var to=+el.getAttribute('data-count'),pre=el.getAttribute('data-pre')||'',o={v:0};gsap.to(o,{v:to,duration:dur||1.8,ease:'power2.out',onUpdate:function(){el.textContent=pre+nf(o.v)}})}

  /* ---- portada ---- */
  var lines=$$('#zhT > span');lines.forEach(function(l){l.innerHTML='<span class="zl-in">'+l.innerHTML+'</span>'});
  var tl=gsap.timeline({defaults:{ease:'power4.out'}});
  tl.from('#zh',{yPercent:-100,duration:.9},0)
    .fromTo('#zhShape',{clipPath:START},{clipPath:FINAL,duration:1.4,ease:'power4.inOut'},0)
    .fromTo('#zhBg img.is-on',{scale:1.28},{scale:1,duration:2.4,ease:'power3.out'},0)
    .from('#zhT .zl-in',{yPercent:118,duration:1.2,stagger:.13},.55)
    .from('.zh-cta',{y:34,autoAlpha:0,duration:1},1.1)
    .from('#zhCard',{x:-80,autoAlpha:0,duration:1.1},.85)
    .from('#zhPlay',{scale:0,rotate:-45,duration:.9,ease:'back.out(2.2)'},1.25)
    .from('#zhAva img,#zhAva button',{scale:0,duration:.6,stagger:.07,ease:'back.out(2)'},1.45)
    .from('#zhThumbs',{yPercent:110,duration:1},1.2)
    .add(function(){var b=$('.zh-num b');if(b)countTo(b,1.9)},1.2);
  gsap.to('#zhBg',{yPercent:11,ease:'none',scrollTrigger:{trigger:'#inicio',start:'top top',end:'bottom top',scrub:true}});
  if(wide){gsap.to('.zh-copy',{y:-70,ease:'none',scrollTrigger:{trigger:'#inicio',start:'top top',end:'bottom top',scrub:true}});
    gsap.to('#zhCard',{y:-40,ease:'none',scrollTrigger:{trigger:'#inicio',start:'top top',end:'bottom top',scrub:true}})}

  /* ---- titulares por líneas ---- */
  function splitHeads(){
    $$('.zt').forEach(function(el){
      SplitText.create(el,{type:'lines',mask:'lines',linesClass:'zline',maskClass:'zmask',autoSplit:true,onSplit:function(self){
        return gsap.from(self.lines,{yPercent:112,duration:1.15,ease:'power4.out',stagger:.1,scrollTrigger:{trigger:el,start:'top 90%',once:true}})}})
    })
  }
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){splitHeads();ScrollTrigger.refresh()});else splitHeads();

  /* ---- entradas genéricas ---- */
  gsap.set('.zfade,.zeye',{autoAlpha:0,y:36});
  ScrollTrigger.batch('.zfade,.zeye',{start:'top 92%',once:true,onEnter:function(els){gsap.to(els,{autoAlpha:1,y:0,duration:1,ease:'power3.out',stagger:.1,overwrite:true})}});
  gsap.set('.zhead-r',{autoAlpha:0,x:30});
  ScrollTrigger.batch('.zhead-r',{start:'top 92%',once:true,onEnter:function(els){gsap.to(els,{autoAlpha:1,x:0,duration:1,ease:'power3.out',delay:.35})}});

  /* ---- imágenes con revelado y paralaje ---- */
  $$('.zimg').forEach(function(el){
    var img=$('img',el);
    gsap.fromTo(el,{clipPath:'inset(100% 0% 0% 0%)'},{clipPath:'inset(0% 0% 0% 0%)',duration:1.4,ease:'power4.inOut',scrollTrigger:{trigger:el,start:'top 88%',once:true}});
    if(img){gsap.fromTo(img,{scale:1.45},{scale:1.12,duration:1.8,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}});
      if(wide)gsap.fromTo(img,{yPercent:-7},{yPercent:7,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:true}})}
  });
  ScrollTrigger.batch('.zm-card',{start:'top 90%',once:true,onEnter:function(els){gsap.from(els,{y:90,autoAlpha:0,duration:1.1,ease:'power3.out',stagger:.14})}});

  /* ---- contadores ---- */
  $$('.zstat b').forEach(function(b){ScrollTrigger.create({trigger:b,start:'top 92%',once:true,onEnter:function(){countTo(b,1.8)}})});

  /* ---- bloques que se abren al entrar ---- */
  ['.zvid-in','.zhelp-in'].forEach(function(s){gsap.fromTo(s,{scale:.9,borderRadius:72},{scale:1,borderRadius:28,ease:'none',scrollTrigger:{trigger:s,start:'top 98%',end:'top 38%',scrub:true}})});
  gsap.from('.zvid-p',{y:80,autoAlpha:0,duration:1.2,ease:'power3.out',scrollTrigger:{trigger:'.zvid-p',start:'top 85%',once:true}});
  gsap.from('.zvid-list li',{x:-40,autoAlpha:0,duration:.9,stagger:.12,ease:'power3.out',scrollTrigger:{trigger:'.zvid-list',start:'top 90%',once:true}});

  /* ---- carruseles, tarjetas y rejillas ---- */
  function railIn(rail,sel){gsap.from(sel,{x:120,autoAlpha:0,rotate:4,duration:1.1,stagger:.09,ease:'power3.out',scrollTrigger:{trigger:rail,start:'top 85%',once:true}})}
  railIn('#rail','.zreel');railIn('#csRail','.zcase');
  gsap.from('.zeps li',{x:60,autoAlpha:0,duration:.9,stagger:.12,ease:'power3.out',scrollTrigger:{trigger:'.zeps',start:'top 88%',once:true}});
  gsap.from('.zpod-p',{y:70,autoAlpha:0,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:'.zpod-p',start:'top 88%',once:true}});
  gsap.from('.zcard',{y:110,autoAlpha:0,rotate:3,duration:1.1,stagger:.12,ease:'power3.out',scrollTrigger:{trigger:'#zcards',start:'top 88%',once:true}});
  ScrollTrigger.batch('.zfz',{start:'top 92%',once:true,onEnter:function(els){gsap.from(els,{y:70,autoAlpha:0,scale:.92,duration:.9,stagger:.07,ease:'power3.out'})}});
  gsap.from('.zdon',{y:90,autoAlpha:0,duration:1.2,ease:'power3.out',scrollTrigger:{trigger:'.zdon',start:'top 88%',once:true}});
  gsap.from('.zdon-badge',{scale:0,duration:.9,ease:'back.out(2)',scrollTrigger:{trigger:'.zdon',start:'top 70%',once:true},delay:.6});
  gsap.from('.zsedes-l .sede',{x:-40,autoAlpha:0,duration:.9,stagger:.15,ease:'power3.out',scrollTrigger:{trigger:'.zsedes',start:'top 85%',once:true}});
  gsap.from('.zfoot-top > *,.zfoot-cols > div',{y:50,autoAlpha:0,duration:1,stagger:.08,ease:'power3.out',scrollTrigger:{trigger:'.zfoot',start:'top 85%',once:true}});

  /* ---- marquesinas que reaccionan al scroll ---- */
  var tweens=[];
  [['#zPress',38,1],['#zBig',46,-1]].forEach(function(c){var t=$('.zmarq-t',$(c[0]));if(!t)return;var tw=gsap.fromTo(t,{xPercent:c[2]>0?0:-50},{xPercent:c[2]>0?-50:0,repeat:-1,duration:c[1],ease:'none'});tweens.push([tw,c[2]])});
  ScrollTrigger.create({start:0,end:'max',onUpdate:function(self){var v=Math.min(8,Math.abs(self.getVelocity())/260),d=self.direction;tweens.forEach(function(p){gsap.to(p[0],{timeScale:p[1]*d*(1+v),duration:.35,overwrite:true,onComplete:function(){gsap.to(p[0],{timeScale:p[1]*d,duration:1.2})}})})}});
  gsap.fromTo('#zBig .zmarq-t',{opacity:.2},{opacity:1,ease:'none',scrollTrigger:{trigger:'.zbig',start:'top 95%',end:'top 50%',scrub:true}});

  /* ---- cursor contextual y botones magnéticos ---- */
  if(fine){
    var cur=$('#zCur'),lab=$('span',cur),qx=gsap.quickTo(cur,'x',{duration:.35,ease:'power3'}),qy=gsap.quickTo(cur,'y',{duration:.35,ease:'power3'});
    document.addEventListener('mousemove',function(e){qx(e.clientX);qy(e.clientY)},{passive:true});
    document.addEventListener('mouseover',function(e){var t=e.target.closest('[data-cursor]');if(t){lab.textContent=t.getAttribute('data-cursor');gsap.to(cur,{scale:1,autoAlpha:1,duration:.35,ease:'back.out(2)'})}else if(cur.style.visibility!=='hidden'){gsap.to(cur,{scale:.2,autoAlpha:0,duration:.2})}});
    document.addEventListener('mouseout',function(e){var t=e.target.closest('[data-cursor]');if(t&&!(e.relatedTarget&&t.contains(e.relatedTarget)))gsap.to(cur,{scale:.2,autoAlpha:0,duration:.25})});
    gsap.set(cur,{xPercent:-50,yPercent:-50,scale:.2,autoAlpha:0});
    $$('.zbtn,.zh-don').forEach(function(b){
      b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();gsap.to(b,{x:(e.clientX-r.left-r.width/2)*.22,y:(e.clientY-r.top-r.height/2)*.35,duration:.4,ease:'power3.out'})});
      b.addEventListener('mouseleave',function(){gsap.to(b,{x:0,y:0,duration:.9,ease:'elastic.out(1,.4)'})})});
  }
  window.addEventListener('load',function(){ScrollTrigger.refresh()});
  var rt=0;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){ScrollTrigger.refresh()},200)});
}
initMotion();
