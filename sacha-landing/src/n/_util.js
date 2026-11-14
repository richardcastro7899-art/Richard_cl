/* ======================  UTILIDADES  ====================== */
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var reduced=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches,sysReduced=reduced;
/* «Reducir movimiento» del sistema apaga todas las animaciones. En equipos de trabajo suele venir activado; el aviso de abajo permite verlas igual. */
function animForced(){var v='';try{v=localStorage.getItem('sachaAnim')||''}catch(e){}if(!v){try{v=sessionStorage.getItem('sachaAnim')||''}catch(e){}}if(!v&&/sachaAnim=1/.test(window.name||''))v='1';return v==='1'}
if(reduced&&animForced()){reduced=false;document.documentElement.classList.add('anim-on')}
function forceAnim(){try{localStorage.setItem('sachaAnim','1')}catch(e){}try{sessionStorage.setItem('sachaAnim','1')}catch(e){}window.name=(window.name||'')+' sachaAnim=1';location.reload()}
if(sysReduced&&reduced){(function(){var st=document.createElement('style');st.textContent='.moask{position:fixed;left:max(12px,env(safe-area-inset-left,0px));bottom:max(12px,env(safe-area-inset-bottom,0px));z-index:150;display:flex;align-items:center;gap:12px;max-width:min(460px,calc(100% - 24px));padding:10px 10px 10px 16px;border-radius:12px;background:#13201A;color:#fff;font:14px/1.35 system-ui,sans-serif;box-shadow:0 14px 40px -10px rgba(0,0,0,.5)}.moask button{flex:none;height:36px;padding:0 16px;border:0;border-radius:8px;background:#D9B97A;color:#13201A;font:600 14px system-ui,sans-serif;cursor:pointer}.moask button:hover{background:#fff}';document.head.appendChild(st);var d=document.createElement('div');d.className='moask';d.setAttribute('role','status');d.innerHTML='<span>Tu equipo tiene «Reducir movimiento» activado, por eso no se ven las animaciones.</span><button type="button">Activar animaciones</button>';d.querySelector('button').addEventListener('click',forceAnim);document.body.appendChild(d)})()}
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



