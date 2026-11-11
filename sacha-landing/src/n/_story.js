/* ======================  VIDEOS: CÁPSULAS VERTICALES Y VISOR  ====================== */
var C={tab:-1,seen:{}};
function capList(){return CAPS.map(function(c,i){return i}).filter(function(i){return C.tab<0||CAPS[i].tab===C.tab})}
function capCover(i){var c=CAPS[i],p=PH[c.ph];return '<div class="cv phc"><img src="'+p.src+'" alt="" loading="lazy" style="object-position:'+(p.vpos||p.pos||'50% 50%')+'"><span class="meta">Cápsula '+pad2(i+1)+' · '+EJES[c.tab].name+'</span><div class="tt"><small>'+esc(c.pre)+'</small><b>'+esc(c.title)+'</b></div></div>'}
var ST={open:false,list:[],i:0,t:0,paused:false,last:null};
function openStory(cap){ST.list=capList();if(ST.list.indexOf(cap)<0){ST.list=capList()}ST.i=ST.list.indexOf(cap);ST.t=0;ST.paused=false;ST.open=true;ST.last=document.activeElement;$('#story-v').hidden=false;document.body.classList.add('lock');renderStory();$('#stClose').focus()}
function closeStory(){ST.open=false;$('#story-v').hidden=true;document.body.classList.remove('lock');$('#stFrame').innerHTML='';if(ST.last&&ST.last.focus)ST.last.focus({preventScroll:true})}
function renderStory(){
  var i=ST.list[ST.i],c=CAPS[i],src=VIDEOS.caps[i];C.seen[i]=true;
  $('#stFrame').innerHTML='<div class="st-bars">'+ST.list.map(function(x,k){return '<i><b style="width:'+(k<ST.i?100:0)+'%"></b></i>'}).join('')+'</div><div class="st-head"><span class="av"><img src="assets/mascot/sacha-saluda.webp" alt=""></span><div><b>Proyecto Sacha</b><span>'+esc(EJES[c.tab].name)+' · cápsula '+(i+1)+'</span></div><div class="sp"><button id="stPause" aria-label="Pausar">'+ico('i-pause')+'</button></div></div>'+
   (src?'<video id="stVid" src="'+esc(src)+'" autoplay playsinline></video>':capCover(i)+'<div class="st-mock"><span class="badge">Video pendiente · vista de maqueta</span></div>')+
   '<button class="st-tap l" data-st="-1" aria-label="Anterior"></button><button class="st-tap r" data-st="1" aria-label="Siguiente"></button><div class="st-foot"><p>'+esc(c.desc)+'</p><div class="row">'+follow(c.net,'pri')+'<button class="btn line sm" id="stShare">'+ico('i-share')+'Compartir</button></div></div>';
  var v=$('#stVid');if(v){v.addEventListener('ended',function(){stStep(1)});v.addEventListener('timeupdate',function(){var b=$$('.st-bars b')[ST.i];if(b&&v.duration)b.style.width=(v.currentTime/v.duration*100)+'%'})}
}
function stStep(d){var n=ST.i+d;if(n<0)n=0;if(n>=ST.list.length){closeStory();return}ST.i=n;ST.t=0;renderStory()}
setInterval(function(){if(!ST.open||ST.paused||VIDEOS.caps[ST.list[ST.i]])return;ST.t+=.1;var b=$$('.st-bars b')[ST.i];if(b)b.style.width=Math.min(100,ST.t/MOCK_SECONDS*100)+'%';if(ST.t>=MOCK_SECONDS)stStep(1)},100);
document.addEventListener('click',function(e){
  if(!ST.open)return;var t=e.target.closest('[data-st]');if(t){stStep(+t.getAttribute('data-st'));return}
  if(e.target.closest('#stPrev')){stStep(-1);return}if(e.target.closest('#stNext')){stStep(1);return}
  if(e.target.closest('#stClose')||e.target===$('#story-v')){closeStory();return}
  if(e.target.closest('#stPause')){ST.paused=!ST.paused;var v=$('#stVid');if(v){if(ST.paused)v.pause();else v.play()}$('#stPause').innerHTML=ico(ST.paused?'i-play':'i-pause');return}
  if(e.target.closest('#stShare'))copy(location.href.split('#')[0],'Enlace copiado');
});
document.addEventListener('keydown',function(e){if(!ST.open)return;if(e.key==='Escape')closeStory();if(e.key==='ArrowRight')stStep(1);if(e.key==='ArrowLeft')stStep(-1);if(e.key===' '&&$('#stPause')){e.preventDefault();$('#stPause').click()}});


