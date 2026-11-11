/* ======================  CAJONES (guía de reporte y mapa)  ====================== */
var DR=null,drLast=null;
function openDr(id){var el=document.getElementById(id);if(!el)return;if(DR)closeDr();drLast=document.activeElement;DR=el;el.hidden=false;$('#fichaBg').hidden=false;document.body.classList.add('lock');el.scrollTop=0;var c=$('[data-drclose]',el);if(c)c.focus({preventScroll:true})}
function closeDr(){if(!DR)return;DR.hidden=true;DR=null;$('#fichaBg').hidden=true;document.body.classList.remove('lock');if(drLast&&drLast.focus)drLast.focus({preventScroll:true})}
document.addEventListener('click',function(e){if(DR&&(e.target===$('#fichaBg')||e.target.closest('[data-drclose]')))closeDr()});
document.addEventListener('keydown',function(e){if(DR&&e.key==='Escape')closeDr()});
function openTool(sit,ani){if(FI>=0)closeFicha();closeMenu();if(typeof sit==='number'){resetTool();T.sit=sit;T.ani=ani;T.step=sit<0?0:(ani<0?1:2)}renderTool(false);openDr('toolDr')}

