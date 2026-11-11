/* ======================  PARTICIPA: DONACIÓN Y CONVENIOS  ====================== */
var HILL='<div class="hill"></div>';
var USES=[['i-med','Medicinas e insumos'],['i-truck','Traslados y logística'],['i-leaf','Alimentación'],['i-doc','Trámites legales']];
$('#uses').innerHTML=USES.map(function(u){return '<li>'+ico(u[0])+u[1]+'</li>'}).join('');
var G={a:-1,custom:'',f:1,bank:false,mode:'don'},CV={org:'',name:'',mail:'',msg:''},cTried=false,cOk=false;
function amount(){var c=parseFloat(G.custom);return G.a>=0?AMTS[G.a]:(c>0?c:0)}
function impactHTML(){var a=amount();if(a<=0)return 'Elige un monto para ver cuánta operación cubre tu aporte.';var perMin=YEAR_COST/525600,mins=a/perMin,t=mins<90?'unos '+Math.max(1,Math.round(mins))+' minutos':'unas '+(mins/60).toFixed(1).replace('.',',')+' horas',yr=a*12;return '<b>'+money(a)+'</b> cubren '+t+' de operación. '+(G.f?'En un año serían '+money(yr)+'. ':'')+'<span class="small">Equivalencia ilustrativa: $350.000 al año.</span>'}
/* Sacha acompaña el estado: triste sin aporte, alegre con monto, agradecida al donar; cómplice en convenios */
function paintDtop(){var el=$('#dtop');if(!el)return;var m,t;
  if(G.mode==='conv'){m=cOk?'gracias':'guino';t=cOk?'¡Gracias! Te escribiremos pronto.':'Es la única vía de voluntariado: por seguridad no recibimos voluntarios externos.'}
  else{m=G.bank?'gracias':(amount()>0?'alegre':'triste');t=G.bank?'¡Gracias! Cada aporte hace posible el próximo rescate.':(amount()>0?'¡Eso ayuda mucho!':'Hoy las donaciones no alcanzan.')}
  el.innerHTML=sacha(m,{eager:true})+'<div class="bubble">'+t+'</div>'}
function giveTabs(){return '<div class="seg2" role="tablist" aria-label="Cómo sumarte"><button role="tab" aria-selected="'+(G.mode==='don')+'" data-gm="don">Donar</button><button role="tab" aria-selected="'+(G.mode==='conv')+'" data-gm="conv">Universidades y organizaciones</button></div>'}
function renderGive(){
  var a=amount(),el=$('#give'),t=cTried,v=CV;
  if(G.mode==='conv'){
    if(cOk){el.innerHTML=HILL+giveTabs()+'<div class="thanks"><h3>Solicitud enviada</h3><p>Gracias, '+esc(v.name)+'. Te escribiremos a '+esc(v.mail)+' para conversar el convenio.</p><p class="proto-note">Maqueta: el formulario aún no está conectado a un correo.</p><div><button class="link" id="convBack">← Volver</button></div></div>'}
    else el.innerHTML=HILL+giveTabs()+'<div><span class="k">Voluntariado y convenios</span><h3>Suma a tu universidad u organización</h3></div><form id="convForm" novalidate style="display:grid;gap:10px"><div class="fields">'+
      fld('cOrg','Institución *','<input id="cOrg" autocomplete="organization" value="'+esc(v.org)+'">',t&&!v.org.trim(),'Escribe el nombre de la institución')+
      fld('cName','Tu nombre *','<input id="cName" autocomplete="name" value="'+esc(v.name)+'">',t&&!v.name.trim(),'Escribe tu nombre')+
      fld('cMail','Correo *','<input id="cMail" type="email" autocomplete="email" value="'+esc(v.mail)+'">',t&&!validMail(v.mail),'Correo no válido')+
      fld('cMsg','¿Qué les gustaría hacer juntos? (opcional)','<textarea id="cMsg" placeholder="Investigación, prácticas, campañas…">'+esc(v.msg)+'</textarea>',false,'')+
      '</div><button class="btn pri" type="submit" style="justify-self:start">Enviar solicitud</button></form>';
    paintDtop();return}
  if(G.bank){el.innerHTML=HILL+giveTabs()+'<div class="thanks"><span class="k">Último paso</span><h3>Aporte '+(G.f?'mensual':'único')+' de '+money(a)+'</h3><p>Para completarlo, haz una transferencia con estos datos. Pronto sumaremos pago con tarjeta.</p><dl class="bank">'+BANK.map(function(b,i){return '<div><dt>'+b[0]+'</dt><dd>'+b[1]+'</dd><button data-cb="'+i+'">Copiar</button></div>'}).join('')+'</dl><p class="proto-note">Maqueta: aquí irán el pago y el recibo.</p><div><button class="link" id="giveBack">← Volver</button></div></div>';paintDtop();return}
  el.innerHTML=HILL+giveTabs()+'<div><span class="k">Dona</span><h3>Elige tu aporte</h3></div><div class="seg" role="group" aria-label="Frecuencia"><button data-gf="0" aria-pressed="'+(G.f===0)+'">Una vez</button><button data-gf="1" aria-pressed="'+(G.f===1)+'">Cada mes</button></div><div class="bigamt" id="bigAmt">'+money(a)+'<small>'+(G.f?'/ mes':'una vez')+'</small></div><div class="amts" role="group" aria-label="Monto">'+AMTS.map(function(x,i){return '<button data-ga="'+i+'" aria-pressed="'+(G.a===i)+'">$'+x+'</button>'}).join('')+'<input id="customAmt" type="number" min="1" inputmode="decimal" placeholder="Otro $" aria-label="Otro monto" value="'+esc(G.custom)+'"></div><p class="impact" id="impact" aria-live="polite">'+impactHTML()+'</p><button class="btn pri" id="doGive" '+(a>0?'':'disabled')+'>Donar '+(a>0?money(a)+(G.f?' / mes':''):'')+'</button><p class="small">Montos de ejemplo. Transferencia por ahora; tarjeta y PayPal próximamente.</p>';
  paintDtop();
}
function syncGive(){var a=amount(),b=$('#doGive'),im=$('#impact'),big=$('#bigAmt');if(big){big.innerHTML=money(a)+'<small>'+(G.f?'/ mes':'una vez')+'</small>';big.classList.remove('bump');void big.offsetWidth;big.classList.add('bump')}if(im)im.innerHTML=impactHTML();if(b){b.disabled=!(a>0);b.textContent='Donar '+(a>0?money(a)+(G.f?' / mes':''):'')}paintDtop()}
document.addEventListener('click',function(e){
  var gm=e.target.closest('[data-gm]');if(gm){G.mode=gm.getAttribute('data-gm');renderGive();return}
  var f=e.target.closest('[data-gf]');if(f){G.f=+f.getAttribute('data-gf');renderGive();return}
  var m=e.target.closest('[data-ga]');if(m){G.a=+m.getAttribute('data-ga');G.custom='';renderGive();return}
  if(e.target.closest('#doGive')&&amount()>0){G.bank=true;renderGive();return}
  if(e.target.closest('#giveBack')){G.bank=false;renderGive();return}
  if(e.target.closest('#convBack')){cOk=false;CV={org:'',name:'',mail:'',msg:''};renderGive();return}
  var c=e.target.closest('[data-cb]');if(c){var b=BANK[+c.getAttribute('data-cb')];copy(b[1],b[0]+' copiado')}
});
document.addEventListener('input',function(e){
  if(e.target.id==='customAmt'){G.custom=e.target.value;G.a=-1;$$('.amts button').forEach(function(x){x.setAttribute('aria-pressed','false')});syncGive();return}
  var m={cOrg:'org',cName:'name',cMail:'mail',cMsg:'msg'}[e.target.id];if(m)CV[m]=e.target.value});
document.addEventListener('submit',function(e){if(e.target.id!=='convForm')return;e.preventDefault();var v=CV,ok=v.org.trim()&&v.name.trim()&&validMail(v.mail);if(ok){cOk=true;cTried=false}else cTried=true;renderGive();if(!ok){var b=$('#convForm .bad input');if(b)b.focus()}});

