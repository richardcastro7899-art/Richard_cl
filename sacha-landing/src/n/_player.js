/* ======================  REPRODUCTOR (maqueta con tiempo simulado o video real)  ====================== */
var ICON_PLAY='<svg class="ic" viewBox="0 0 24 24"><use href="#i-play"/></svg>',ICON_PAUSE='<svg class="ic" viewBox="0 0 24 24"><use href="#i-pause"/></svg>';
var PLAYERS=[];
function Player(root,o){
  var P={item:null,on:false,t:0};
  function paint(){var i=$('.track i',root),tm=$('time',root),b=$('.pp',root);if(!i)return;root.classList.toggle('playing',P.on);i.style.width=(P.t/MOCK_SECONDS*100)+'%';tm.textContent=fmt(P.item.dur*P.t/MOCK_SECONDS)+' / '+fmt(P.item.dur);b.innerHTML=P.on?ICON_PAUSE:ICON_PLAY}
  function end(){
    P.on=false;paint();if(o.onEnd&&o.onEnd(P.item))return;
    var n=NETS[P.item.net],ec=$('.endcard',root);if(!ec)return;
    ec.innerHTML=sacha('orgullosa',{alt:''})+'<b>La historia continúa en '+n.name+'</b><p>'+esc(n.what)+'</p><div class="row">'+follow(P.item.net,'pri')+'<button class="btn line sm" data-again>Ver otra vez</button></div>';ec.hidden=false;
  }
  P.load=function(item,play){
    P.item=item;P.on=false;P.t=0;root.classList.remove('playing');
    if(item.srcs.length){
      root.innerHTML='<div class="stage"><video controls playsinline preload="metadata" poster="assets/video/hero-poster.jpg">'+srcTags(item.srcs)+'</video></div><div class="endcard" hidden></div>';
      var v=$('video',root);v.addEventListener('ended',end);if(play){var p=v.play();if(p&&p.catch)p.catch(function(){})}
    }else{
      root.innerHTML='<div class="stage">'+item.cover+'<span class="badge">Video pendiente · vista de maqueta</span><button class="bigplay" data-pp aria-label="Reproducir">'+ico('i-play')+'</button></div><div class="controls"><button class="pp" data-pp aria-label="Reproducir o pausar">'+ICON_PLAY+'</button><div class="track" data-seek><div><i></i></div></div><time>0:00 / '+fmt(item.dur)+'</time></div><div class="endcard" hidden></div>';
      if(play){P.on=true;paint()}
    }
  };
  P.tick=function(){if(!P.on||!P.item||P.item.srcs.length)return;P.t+=.1;if(P.t>=MOCK_SECONDS){P.t=MOCK_SECONDS;end()}else paint()};
  root.addEventListener('click',function(e){
    if(e.target.closest('[data-pp]')){$('.endcard',root).hidden=true;if(P.t>=MOCK_SECONDS)P.t=0;P.on=!P.on;paint();return}
    if(e.target.closest('[data-again]')){$('.endcard',root).hidden=true;P.t=0;P.on=true;paint();return}
    var s=e.target.closest('[data-seek]');if(s){var rc=s.getBoundingClientRect();P.t=Math.max(0,Math.min(.99,(e.clientX-rc.left)/rc.width))*MOCK_SECONDS;paint()}
  });
  PLAYERS.push(P);return P;
}
function srcTags(a){return a.map(function(u){return '<source src="'+esc(u)+'" type="video/'+(/\.webm$/.test(u)?'webm':'mp4')+'">'}).join('')}
setInterval(function(){PLAYERS.forEach(function(p){p.tick()})},100);



