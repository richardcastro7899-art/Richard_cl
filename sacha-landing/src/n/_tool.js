/* ======================  REPORTAR: GUÍA DE ACCIÓN (se abre bajo demanda)  ====================== */

var T;function resetTool(){T={step:0,sit:-1,ani:-1,chk:{},tried:false,sent:false,f:{type:'',sit:'',where:'',desc:'',name:'',phone:'',ok:false,photo:''}}}resetTool();
function reach(){return T.sit<0?0:(T.ani<0?1:3)}
function validPhone(p){return String(p).replace(/\D/g,'').length>=7}
function lookup(l,id){return l.filter(function(x){return x.id===id})[0]||l[0]}
function stepper(){var L=['Situación','Animal','Qué hacer','Avisar'],r=reach();return '<ol class="tsteps">'+L.map(function(l,i){var cur=T.step===i,done=i<T.step||(T.sent&&i===3);return '<li><button class="'+(done?'done':'')+'" '+(cur?'aria-current="step" ':'')+(i>r?'disabled ':'')+'data-tstep="'+i+'"><span class="n">'+(done?ico('i-check'):(i+1))+'</span><span>'+l+'</span></button></li>'}).join('')+'</ol>'}
function opt(attr,i,o,sub){return '<button class="opt" '+attr+'="'+i+'" style="--c:'+o.c+'"><span class="oi">'+ico(o.ic)+'</span><span><b>'+o.title+'</b><span class="s">'+sub+'</span></span>'+ico('i-arrow')+'</button>'}
function safety(t){return '<div class="safety">'+ico('i-alert')+'<p>'+(t||'Tu seguridad va primero. Si hay riesgo para personas (un animal agresivo, una serpiente cerca de niños, un cocodrilo en la vía pública), llama al')+' <button data-copy-num="911" aria-label="Copiar 911">911</button>.</p></div>'}
function fld(id,label,inner,bad,err,wide){return '<div class="fld'+(bad?' bad':'')+(wide?' wide':'')+'"><label for="'+id+'">'+label+'</label>'+inner+'<span class="err" role="alert">'+err+'</span></div>'}
function toolBody(){
  if(T.step===0)return '<div class="tbody"><h3 class="tq" id="tq" tabindex="-1">¿Qué está pasando?</h3>'+(T.ani>=0?'<p class="small">Tipo de animal elegido: <b>'+ANIS[T.ani].title+'</b>. <button class="linkbtn" data-tstep="1">Cambiar</button></p>':'')+'<div class="opts">'+SITS.map(function(s,i){return opt('data-sit',i,s,s.sub)}).join('')+'</div>'+safety()+'</div>';
  if(T.step===1)return '<div class="tbody"><h3 class="tq" id="tq" tabindex="-1">¿Qué tipo de animal es?</h3><div class="opts">'+ANIS.map(function(a,i){return opt('data-ani',i,a,a.eg)}).join('')+'</div><div class="ract"><button class="linkbtn" data-tstep="0">← Cambiar la situación</button></div></div>';
  var s=SITS[T.sit],a=ANIS[T.ani],f=T.f,t=T.tried;
  if(T.step===2){var d=s.do.concat(a.do),n=s.dont.concat(a.dont);return '<div class="tbody"><span class="urgtag">'+s.urg+'</span><h3 class="tq" id="tq" tabindex="-1">'+s.title+' · '+a.title+'</h3>'+(a.danger?safety('Si hay riesgo para personas, llama primero al'):'')+'<div class="rcols"><div class="rbox"><h4>Haz esto</h4>'+d.map(function(x,i){return '<button class="chk" role="checkbox" aria-checked="'+!!T.chk['d'+i]+'" data-chk="d'+i+'"><i>'+ico('i-check')+'</i><span>'+esc(x)+'</span></button>'}).join('')+'</div><div class="rbox dont"><h4>No hagas esto</h4><ul class="nox">'+n.map(function(x){return '<li>'+ico('i-x')+'<span>'+esc(x)+'</span></li>'}).join('')+'</ul></div></div><div class="ract"><button class="btn urg" data-tstep="3">Reportar este caso '+ico('i-arrow')+'</button><button class="btn line" data-copyguide>Copiar guía</button><button class="linkbtn" data-treset>Empezar de nuevo</button></div></div>'}
  if(T.sent)return '<div class="tbody"><span class="urgtag" style="color:var(--accent)">Reporte preparado</span><h3 class="tq" id="tq" tabindex="-1">Gracias por avisar, '+esc(f.name.trim().split(/\s+/)[0])+'</h3><dl class="sumbox"><div><dt>Situación</dt><dd>'+esc(lookup(SITS,f.sit).title)+'</dd></div><div><dt>Animal</dt><dd>'+esc(lookup(ANIS,f.type).title)+'</dd></div><div><dt>Ubicación</dt><dd>'+esc(f.where)+'</dd></div>'+(f.desc.trim()?'<div><dt>Descripción</dt><dd>'+esc(f.desc)+'</dd></div>':'')+'<div><dt>Contacto</dt><dd>'+esc(f.name)+' · '+esc(f.phone)+'</dd></div></dl>'+(f.photo?'<img class="photo-prev on" src="'+f.photo+'" alt="Foto adjunta">':'')+'<div class="ract"><button class="btn pri" data-copyrep>'+ico('i-copy')+'Copiar reporte</button><button class="btn line" data-treset>Nuevo reporte</button></div><p class="proto-note">Maqueta: el reporte aún no llega a la fundación. Copia el texto y compártelo por sus canales. Si hay riesgo para personas, llama al 911.</p></div>';
  return '<div class="tbody"><h3 class="tq" id="tq" tabindex="-1">Avisa al equipo</h3><p class="small">Llena lo que sepas. Lo mínimo es dónde está y cómo contactarte.</p><form id="repForm" novalidate><div class="fgrid">'+
   fld('rWhere','¿Dónde está? *','<input id="rWhere" placeholder="Calle, sector o referencia" value="'+esc(f.where)+'">',t&&!f.where.trim(),'Indica dónde está',true)+
   fld('rDesc','Descripción (opcional)','<textarea id="rDesc" placeholder="Cómo se ve, cuántos son, hace cuánto lo viste">'+esc(f.desc)+'</textarea>',false,'',true)+
   fld('rPhoto','Foto (opcional)','<input id="rPhoto" type="file" accept="image/*"><img class="photo-prev'+(f.photo?' on':'')+'" id="photoPrev" alt="Vista previa"'+(f.photo?' src="'+f.photo+'"':'')+'>',false,'',true)+
   fld('rName','Tu nombre *','<input id="rName" autocomplete="name" value="'+esc(f.name)+'">',t&&!f.name.trim(),'Escribe tu nombre')+
   fld('rPhone','Tu teléfono *','<input id="rPhone" type="tel" inputmode="tel" autocomplete="tel" value="'+esc(f.phone)+'">',t&&!validPhone(f.phone),'Teléfono no válido')+
   '</div><label class="consent'+(t&&!f.ok?' bad':'')+'" style="margin-top:14px"><input type="checkbox" id="rOk"'+(f.ok?' checked':'')+'><span>Acepto que la fundación use estos datos solo para atender este caso.</span></label><div class="ract" style="margin-top:16px"><button class="btn urg" type="submit">Preparar reporte</button><button class="linkbtn" type="button" data-tstep="2">← Volver a la guía</button></div></form><p class="proto-note">Maqueta: por ahora el reporte no se envía.</p></div>';
}
var SAY=[['Primero, respira.','Cuéntame qué está pasando y te explico qué hacer.'],['Ya casi.','Con el tipo de animal ajusto las indicaciones.'],['Con calma.','Sigue los pasos y marca los que ya hiciste.'],['Un último paso.','Con estos datos el equipo te ubica más rápido.']];
function renderTool(focus){$('#tmain').innerHTML=stepper()+toolBody();var m=T.sent?['¡Gracias por avisar!','Ya hiciste lo más importante. Copia el reporte y compártelo con el equipo.']:SAY[T.step];$('#guide').innerHTML=sacha(T.sent?'gracias':['curiosa','curiosa','cuidadora','alerta'][T.step],{alt:''})+'<p><b>'+m[0]+'</b>'+m[1]+'</p>';if(focus){var q=$('#tq');if(q)q.focus({preventScroll:true});var r=$('#tmain').getBoundingClientRect();if(r.top<70||r.top>innerHeight*.5)window.scrollTo({top:r.top+scrollY-90,behavior:reduced?'auto':'smooth'})}}
document.addEventListener('click',function(e){var el;
  if((el=e.target.closest('[data-sit]'))){T.sit=+el.getAttribute('data-sit');T.chk={};T.sent=false;T.step=T.ani>=0?2:1;renderTool(true);return}
  if((el=e.target.closest('[data-ani]'))){T.ani=+el.getAttribute('data-ani');T.chk={};T.sent=false;T.step=2;renderTool(true);return}
  if((el=e.target.closest('[data-tstep]'))){var n=+el.getAttribute('data-tstep');if(n<=reach()){T.step=n;if(n===3){T.f.type=ANIS[T.ani].id;T.f.sit=SITS[T.sit].id}renderTool(true)}return}
  if((el=e.target.closest('[data-chk]'))){var k=el.getAttribute('data-chk');T.chk[k]=!T.chk[k];el.setAttribute('aria-checked',!!T.chk[k]);return}
  if(e.target.closest('[data-treset]')){resetTool();renderTool(true);return}
  if(e.target.closest('[data-copyguide]')){var s=SITS[T.sit],a=ANIS[T.ani];copy(['Qué hacer si encuentras un animal silvestre · '+s.title+' · '+a.title,'','HAZ ESTO'].concat(s.do.concat(a.do).map(function(x,i){return (i+1)+'. '+x}),['','NO HAGAS ESTO'],s.dont.concat(a.dont).map(function(x){return '- '+x}),['','Si hay riesgo para personas, llama al 911.']).join('\n'),'Guía copiada');return}
  if(e.target.closest('[data-copyrep]')){var f=T.f;copy(['REPORTE DE FAUNA SILVESTRE · Proyecto Sacha','Fecha: '+new Date().toLocaleString('es-EC'),'Situación: '+lookup(SITS,f.sit).title,'Animal: '+lookup(ANIS,f.type).title,'Ubicación: '+f.where.trim(),'Descripción: '+(f.desc.trim()||'—'),'Contacto: '+f.name.trim()+' · '+f.phone.trim()].join('\n'),'Reporte copiado');return}
});
document.addEventListener('input',function(e){var m={rWhere:'where',rDesc:'desc',rName:'name',rPhone:'phone'}[e.target.id];if(m)T.f[m]=e.target.value});
document.addEventListener('change',function(e){if(e.target.id==='rOk')T.f.ok=e.target.checked;if(e.target.id==='rPhoto'){var file=e.target.files&&e.target.files[0],pv=$('#photoPrev');if(T.f.photo&&T.f.photo.indexOf('blob:')===0)URL.revokeObjectURL(T.f.photo);if(file&&file.type.indexOf('image/')===0){T.f.photo=URL.createObjectURL(file);pv.src=T.f.photo;pv.classList.add('on')}else{T.f.photo='';pv.classList.remove('on');pv.removeAttribute('src');if(file){toast('Elige una imagen (JPG o PNG)');e.target.value=''}}}});
document.addEventListener('submit',function(e){if(e.target.id!=='repForm')return;e.preventDefault();var f=T.f,ok=f.where.trim()&&f.name.trim()&&validPhone(f.phone)&&f.ok;if(ok){T.sent=true;T.tried=false}else T.tried=true;renderTool(false);if(ok){var q=$('#tq');if(q)q.focus({preventScroll:true})}else{var b=$('#repForm .bad input')||$('#repForm .consent.bad input');if(b)b.focus()}});
var SD=0;
function renderMap(){
  var box=$('#mapbox');$$('.mpin,.mref',box).forEach(function(n){n.remove()});
  MREF.forEach(function(r){var d=document.createElement('div');d.className='mref';d.style.left=r.pos[0]+'%';d.style.top=r.pos[1]+'%';d.innerHTML='<i></i><span>'+r.name+'</span>';box.appendChild(d)});
  SEDES.forEach(function(d,i){var b=document.createElement('button');b.className='mpin';b.style.left=d.pos[0]+'%';b.style.top=d.pos[1]+'%';b.style.setProperty('--dy',d.dy+'px');b.setAttribute('aria-pressed',SD===i);b.setAttribute('data-sede',i);b.setAttribute('aria-label','Sede: '+d.pin);b.innerHTML='<i></i><span>'+d.pin+'</span>';box.appendChild(b)});
  $('#sedes').innerHTML=SEDES.map(function(d,i){return '<div class="sede'+(SD===i?' on':'')+'"><span class="k">Sede '+d.n+' · '+d.kind+'</span><h3><button data-sede="'+i+'">'+d.name+'</button></h3><span>'+d.desc+'</span><span class="meta"><span>Dirección y horario: por confirmar</span></span><a class="btn line sm" href="https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(d.q)+'" target="_blank" rel="noopener">Ver zona en Google Maps '+ico('i-ext')+'</a></div>'}).join('')+'<div class="callout">'+ico('i-info')+'<span>Por seguridad no recibimos visitas en los centros: resguardamos animales que llegan de incautaciones y allanamientos.</span></div>';
}
document.addEventListener('click',function(e){var b=e.target.closest('[data-sede]');if(b){SD=+b.getAttribute('data-sede');renderMap()}});


var FICHAS=[
 {id:'zarigueya',grupo:'Mamífero',v:'a',photo:'zarigueya',pat:'manchas',tab:'selva',pre:'Todo sobre las',name:'zarigüeyas',art:'una',single:'zarigüeya',state:'importante',mood:'guino',ani:'mamifero',cap:0,
  dato:'Marsupial nocturno que come insectos, frutas, carroña y pequeños animales. Ayuda a controlar plagas y a dispersar semillas.',src:['UTPL','https://noticias.utpl.edu.ec/printpdf/node/3592'],
  myth:['Es peligrosa y transmite la rabia.','Es inofensiva. Que transmita la rabia es un mito.'],
  do:['Déjale un camino libre hacia afuera: casi siempre se aleja sola de noche.','Aleja a perros, gatos y niños.','Si está herida o es una cría sola en peligro, avisa al equipo.'],dont:['No la mates: es inofensiva para las personas.','No la alimentes ni la lleves a casa.']},
 {id:'iguana',grupo:'Reptil',v:'d',photo:'iguana',pat:'reptil',tab:'terra',pre:'Todo sobre las',name:'iguanas',art:'una',single:'iguana',state:'importante',mood:'curiosa',ani:'reptil',cap:2,
  dato:'La iguana verde es herbívora. Se la ve en parques y orillas tomando sol: mirarla de lejos también es respetarla.',
  do:['Obsérvala desde lejos: tomar sol es normal.','Si está herida o en la vía, avisa con una foto y la ubicación.'],dont:['No la persigas ni la agarres: puede arañar y morder.','No la alimentes ni la lleves a casa.']},
 {id:'serpiente',grupo:'Reptil',v:'c',photo:'serpiente',pre:'',name:'¡Serpientes!',art:'una',single:'serpiente',state:'serpiente',mood:'alerta',ani:'reptil',cap:5,
  dato:'La boa no es venenosa: atrapa a sus presas por constricción, sobre todo roedores y aves. Pero a simple vista no puedes saber qué serpiente es.',
  do:['Mantente a distancia y no la pierdas de vista hasta que llegue el equipo.','Aleja a niños y mascotas.','Avisa de inmediato con una foto desde lejos.'],dont:['No intentes capturarla ni matarla: no puedes saber si es venenosa.','No te acerques a mirarla de cerca.']},
 {id:'cocodrilo',grupo:'Reptil',v:'d',photo:'cocodrilo',pat:'selva',tab:'selva',pre:'Todo sobre los',name:'cocodrilos',art:'un',single:'cocodrilo',state:'urgente',mood:'alerta',ani:'reptil',cap:5,
  dato:'El cocodrilo de la costa vive en manglares y estuarios del golfo de Guayaquil. Siempre estuvo aquí: la ciudad llegó después.',
  do:['Mantén distancia del agua y de la orilla.','Avisa de inmediato: es un animal peligroso. Si hay riesgo para personas, llama al 911.'],dont:['No te acerques ni intentes moverlo.','No lo cargues ni te tomes fotos con él.']},
 {id:'mono',grupo:'Mamífero',v:'d',photo:'mono',pat:'selva',tab:'selva',pre:'Todo sobre los',name:'monos aulladores',art:'un',single:'mono',state:'urgente',mood:'cuidadora',ani:'grande',cap:1,
  dato:'El mono aullador de la costa se oye mucho antes de verse. La fundación ha atendido ejemplares con desnutrición y lesiones.',src:['El Universo','https://www.eluniverso.com/guayaquil/comunidad/fauna-ocelote-bebe-mono-aullador-proyecto-sacha-guayaquil-guayas-dos-mangas-nota/'],
  do:['Aléjate sin darle la espalda ni correr, y mantén lejos a otras personas.','Avisa al equipo con una foto y la ubicación exacta.'],dont:['No intentes tocarlo ni acorralarlo: un animal asustado puede defenderse.','No le des comida.']},
 {id:'ocelote',grupo:'Felino',v:'b',photo:'ocelote',pre:'Todo sobre los',name:'ocelotes',art:'un',single:'ocelote',state:'importante',mood:'orgullosa',ani:'grande',cap:3,
  dato:'Felino manchado y nocturno. Sacha, el rostro de la fundación, es un ocelote. La mascotización y los perros sueltos lo ponen en riesgo.',src:['Vistazo','https://www.vistazo.com/estilo-de-vida/sostenibilidad/meg-la-bebe-ocelote-en-peligro-por-la-quema-de-plantaciones-y-mascotizacion-CK6972334'],
  do:['Aléjate sin darle la espalda ni correr.','Avisa de inmediato al equipo.'],dont:['No intentes tocarlo ni acorralarlo.','No lo conviertas en mascota: la tenencia de fauna silvestre está regulada.']},
 {id:'rana',grupo:'Anfibio',v:'a',photo:'rana',pre:'Todo sobre las',name:'ranas',art:'una',single:'rana',state:'dato',mood:'curiosa',ani:'anfibio',cap:2,
  dato:'Los anfibios tienen la piel delicada: absorben lo que tocan. Mirarlos sin manipularlos es lo mejor para ellos.',
  do:['Obsérvala sin tocarla.','Si está en un lugar peligroso, avisa al equipo.'],dont:['No la agarres con las manos secas ni la lleves a otro lugar.']},
 {id:'aves',grupo:'Ave',v:'c',photo:'aves',pat:'rayas',tab:'terra',pre:'Todo sobre las',name:'aves',art:'un',single:'ave',state:'importante',mood:'guino',ani:'ave',cap:2,
  dato:'Garrapateros, lechuzas de campanario y loros conviven con la ciudad. Muchos loros son víctimas del tráfico: comprar alimenta el negocio.',
  do:['Si tiene plumas y salta, sus padres suelen cuidarla desde cerca: observa de lejos.','Si no tiene plumas o está herida, avisa.'],dont:['No le des agua con jeringa ni pan: puede ahogarse.','No compres aves silvestres.']},
 {id:'perezoso',grupo:'Mamífero',v:'a',photo:'perezoso',pat:'selva',pre:'Todo sobre los',name:'perezosos',art:'un',single:'perezoso',state:'importante',mood:'cuidadora',ani:'grande',cap:7,
  dato:'Pasan casi toda su vida en los árboles y bajan muy poco. En el suelo se mueven con dificultad: por eso los cables, las vías y los perros son un peligro para ellos.',
  do:['Si está en el suelo o en la vía, mantén lejos a perros y personas.','Avisa al equipo con una foto y la ubicación exacta.'],dont:['No lo cargues ni lo subas a un árbol por tu cuenta: tiene garras fuertes.','No te tomes fotos con él ni lo alimentes.']},
 {id:'lechuza',grupo:'Ave',v:'d',photo:'lechuza',pat:'rayas',pre:'Todo sobre las',name:'lechuzas',art:'una',single:'lechuza',state:'dato',mood:'dormida',ani:'ave',cap:2,
  dato:'La lechuza de campanario caza de noche y se alimenta sobre todo de roedores: es una aliada contra las plagas. Suele anidar en techos y construcciones.',
  do:['Si está en el suelo y no vuela, cúbrela con una tela y avisa al equipo.','Mantén lejos a gatos y perros.'],dont:['No la persigas ni la asustes con luz o ruido.','No le des comida ni agua.']},
 {id:'caiman',grupo:'Reptil',v:'b',photo:'caiman',pre:'Todo sobre los',name:'caimanes',art:'un',single:'caimán',state:'urgente',mood:'alerta',ani:'reptil',cap:5,
  dato:'El caimán de anteojos vive en ríos, lagunas y pantanos. Es más pequeño que el cocodrilo, pero también puede morder: siempre a distancia.',
  do:['Aléjate del agua y de la orilla.','Avisa al equipo. Si hay riesgo para personas, llama al 911.'],dont:['No intentes atraparlo ni moverlo.','No lo tengas como mascota: es fauna silvestre protegida.']},
 {id:'sapo',grupo:'Anfibio',v:'c',photo:'sapo',pre:'Todo sobre los',name:'sapos',art:'un',single:'sapo',state:'dato',mood:'curiosa',ani:'anfibio',cap:2,
  dato:'El sapo de caña aparece en patios y jardines, sobre todo cuando llueve. Su piel tiene glándulas con toxinas: no lo toques y aleja a tus mascotas.',
  do:['Déjalo seguir su camino: suele irse solo.','Aleja a perros y gatos: pueden intoxicarse si lo muerden.'],dont:['No lo agarres con las manos.','No lo lastimes ni le eches sal o químicos.']}
];
var STATE={importante:{t:'¡Importante!',bg:'#D9B97A',fg:'#24362E'},urgente:{t:'¡Urgente!',bg:'#D17A5B',fg:'#1B1210'},serpiente:{t:'¡Serpiente!',bg:'#3F5A4F',fg:'#F4EFE6'},dato:{t:'Dato',bg:'#CBEFD4',fg:'#24362E'}};

/* ======================  FICHA: ¡Encontraste una…!  ====================== */
var FI=-1,fLast=null;
function fichaHTML(f,i){
  var st=STATE[f.state];
  var p=PH[f.photo],art='<img class="ph" src="'+p.src+'" alt="" style="object-position:'+(p.pos||'50% 50%')+'"><span class="credit">'+credit(p)+'</span>';
  return '<div class="fhead" style="--sb:'+st.bg+';--sf:'+st.fg+'">'+art+'<span class="stag">'+st.t+'</span><button class="fclose" id="fClose" aria-label="Cerrar la ficha">'+ico('i-close')+'</button>'+sacha(f.mood,{alt:''})+'<div class="ft"><small>Encontraste '+f.art+'…</small><h2 id="fTitle">'+(f.state==='serpiente'?'¡'+f.single+'!':f.single)+'</h2></div></div>'+
   '<div class="fbody"><p class="fdato">'+esc(f.dato)+(f.src?' <cite>Fuente: <a href="'+f.src[1]+'" target="_blank" rel="noopener">'+f.src[0]+'</a></cite>':'')+'</p>'+
   (f.myth?'<div class="fmyth"><div><span class="tag">Mito</span><q>'+esc(f.myth[0])+'</q></div><div><span class="tag">Realidad</span><p>'+esc(f.myth[1])+'</p></div></div>':'')+
   '<div class="fcols"><div class="rbox"><h4>Haz esto</h4><ul class="nox yes">'+f.do.map(function(x){return '<li>'+ico('i-check')+'<span>'+esc(x)+'</span></li>'}).join('')+'</ul></div><div class="rbox dont"><h4>No hagas esto</h4><ul class="nox">'+f.dont.map(function(x){return '<li>'+ico('i-x')+'<span>'+esc(x)+'</span></li>'}).join('')+'</ul></div></div>'+
   '<div class="safety">'+ico('i-alert')+'<p>Tu seguridad va primero. Si hay riesgo para personas, llama al <button data-copy-num="911" aria-label="Copiar 911">911</button>.</p></div>'+
   '<div class="fact"><button class="btn urg" data-fr="'+i+'">Reportar este caso'+ico('i-arrow')+'</button><button class="btn line" data-fcap="'+f.cap+'">'+ico('i-play')+'Ver cápsula '+(f.cap+1)+'</button></div>'+
   '<div class="fnav"><button data-fstep="-1">← Anterior</button><span>'+(i+1)+' / '+FICHAS.length+'</span><button data-fstep="1">Siguiente →</button></div></div>';
}
function openFicha(i,keep){
  FI=(i+FICHAS.length)%FICHAS.length;var f=$('#ficha');
  if(!keep)fLast=document.activeElement;
  f.innerHTML=fichaHTML(FICHAS[FI],FI);f.hidden=false;$('#fichaBg').hidden=false;document.body.classList.add('lock');
  f.scrollTop=0;var c=$('#fClose');if(c)c.focus({preventScroll:true});
}
function closeFicha(){FI=-1;$('#ficha').hidden=true;$('#fichaBg').hidden=true;document.body.classList.remove('lock');if(fLast&&fLast.focus)fLast.focus({preventScroll:true})}
document.addEventListener('click',function(e){
  var o=e.target.closest('[data-fi]');if(o){openFicha(+o.getAttribute('data-fi'));return}
  if(FI<0)return;
  if(e.target.closest('#fClose')||e.target===$('#fichaBg')){closeFicha();return}
  var st=e.target.closest('[data-fstep]');if(st){openFicha(FI+ +st.getAttribute('data-fstep'),true);return}
  var r=e.target.closest('[data-fr]');if(r){var f=FICHAS[+r.getAttribute('data-fr')],ai=ANIS.map(function(a){return a.id}).indexOf(f.ani);closeFicha();openTool(-1,ai);return}
  var cp=e.target.closest('[data-fcap]');if(cp){closeFicha();openStory(+cp.getAttribute('data-fcap'))}
});
document.addEventListener('keydown',function(e){if(FI<0)return;if(e.key==='Escape')closeFicha();if(e.key==='ArrowRight')openFicha(FI+1,true);if(e.key==='ArrowLeft')openFicha(FI-1,true);
  if(e.key==='Tab'){var els=$$('#ficha button, #ficha a[href]').filter(function(x){return x.offsetParent!==null});if(!els.length)return;var a=els[0],z=els[els.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});


