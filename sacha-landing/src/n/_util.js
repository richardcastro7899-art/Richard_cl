/* ======================  UTILIDADES  ====================== */
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var reduced=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var canIO='IntersectionObserver' in window;
if(!reduced&&canIO)document.documentElement.classList.add('js');
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function fmt(s){s=Math.round(s);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
function ico(id){return '<svg class="ic" aria-hidden="true"><use href="#'+id+'"/></svg>'}
function money(n){return '$'+Math.round(n).toLocaleString('es-EC')}
function toast(m){var t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(function(){t.classList.remove('show')},2600)}
function copy(txt,msg){function ok(){toast(msg||'Copiado')}function fb(){var a=document.createElement('textarea');a.value=txt;a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();try{document.execCommand('copy');ok()}catch(e){toast('Selecciona el texto y cópialo')}a.remove()}try{navigator.clipboard.writeText(txt).then(ok,fb)}catch(e){fb()}}
function validMail(m){return /^\S+@\S+\.\S+$/.test(m)}
function follow(k,cls){var n=NETS[k];return '<a class="btn '+(cls||'line')+' sm" href="'+(n.url||'#redes')+'" target="'+(n.url?'_blank':'_self')+'" rel="noopener" data-follow="'+k+'">Seguir en '+n.name+' '+ico('i-ext')+'</a>'}
function cover(o){
  return '<div class="cv"><div class="pt" style="background-image:url(assets/patterns/tone-sage-'+(o.pat||'felino')+'.svg)"></div>'+(o.meta?'<span class="meta">'+esc(o.meta)+'</span>':'')+'<div class="tt"><small>'+esc(o.pre)+'</small><b>'+esc(o.title)+'</b></div>'+(o.m?'<img class="pm" src="assets/mascot/'+o.m+'.webp" alt="" loading="lazy">':'')+'</div>';
}

document.addEventListener('click',function(e){
  var g=e.target.closest('[data-go]');if(g){e.preventDefault();go(g.getAttribute('data-go'))}
  var f=e.target.closest('[data-follow]');if(f&&!NETS[f.getAttribute('data-follow')].url){e.preventDefault();toast('Enlace de '+NETS[f.getAttribute('data-follow')].name+' por conectar')}
  var n=e.target.closest('[data-noop]');if(n){e.preventDefault();toast('Enlace por conectar')}
  var c=e.target.closest('[data-copy-num]');if(c){var v=c.getAttribute('data-copy-num');copy(v,v+' copiado')}
  if(e.target.closest('[data-open-tool]'))openTool();
  var cp=e.target.closest('[data-cap]');if(cp){openStory(+cp.getAttribute('data-cap'))}
});
var pad2=function(n){return String(n).padStart(2,'0')};



