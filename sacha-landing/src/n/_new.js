
/* ======================  NAVEGACIÓN  ====================== */
var HDRH=76;
function closeMenu(){var m=$('#zMenu');m.hidden=true;$('#zBurger').setAttribute('aria-expanded','false');document.documentElement.classList.remove('menu-open')}
$('#zBurger').addEventListener('click',function(){var o=$('#zMenu').hidden;$('#zMenu').hidden=!o;this.setAttribute('aria-expanded',String(o));document.documentElement.classList.toggle('menu-open',o)});
function go(id){closeMenu();var el=document.getElementById(id);if(!el)return;window.scrollTo({top:id==='inicio'?0:Math.max(0,el.getBoundingClientRect().top+scrollY-HDRH+1),behavior:reduced?'auto':'smooth'})}
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMenu()});
var SPY=[['nosotros','nosotros'],['video','video'],['capsulas','video'],['podcast','podcast'],['ayuda','ayuda'],['donar','ayuda'],['casos','ayuda'],['fauna','ayuda'],['ubicaciones','ubicaciones']],lastA='__';
function onScroll(){
  var H=document.documentElement.scrollHeight-innerHeight,a=null;
  $('#zProg').style.transform='scaleX('+(H>0?Math.min(1,scrollY/H):0).toFixed(4)+')';
  $('#zh').classList.toggle('is-s',scrollY>40);
  SPY.forEach(function(p){var el=document.getElementById(p[0]);if(el&&el.getBoundingClientRect().top<=HDRH+160)a=p[1]});
  if(scrollY<200)a='inicio';
  var ft=document.getElementById('contacto');if(ft&&ft.getBoundingClientRect().top<=HDRH+160)a=null;
  if(a!==lastA){lastA=a;$$('#znav a').forEach(function(l){l.setAttribute('aria-current',l.getAttribute('data-go')===a?'true':'false')})}
}
window.addEventListener('scroll',function(){if(!onScroll.r){onScroll.r=requestAnimationFrame(function(){onScroll.r=0;onScroll()})}},{passive:true});
document.addEventListener('click',function(e){var s=e.target.closest('[data-share]');if(s){e.preventDefault();copy(location.href.split('#')[0],'Enlace copiado')}var gm=e.target.closest('[data-gmode]');if(gm){G.mode=gm.getAttribute('data-gmode');renderGive()}var a=e.target.closest('a.zbtn[href="#"]');if(a&&!a.hasAttribute('data-go')&&!a.hasAttribute('data-play-film')&&!a.hasAttribute('data-open-tool')&&!a.hasAttribute('data-follow'))e.preventDefault();
  var f=e.target.closest('a[href^="#"][data-go]');if(f)e.preventDefault()});

/* ======================  PORTADA  ====================== */
var HSL=[{k:'hero',t:'Mamíferos',pos:'60% 62%'},{k:'iguana',t:'Reptiles',pos:'55% 55%'},{k:'aves',t:'Aves',pos:'50% 72%'}],HI2=0;
$('#zhBg').innerHTML=HSL.map(function(h,i){var p=PH[h.k];return '<img src="'+p.src+'" alt="" class="'+(i===0?'is-on':'')+'" style="object-position:'+(h.pos||p.pos)+'"'+(i===0?' fetchpriority="high"':'')+'>'}).join('');
$('#zhThumbs').innerHTML=HSL.map(function(h,i){var p=PH[h.k];return '<button data-hero="'+i+'" aria-pressed="'+(i===0)+'"><img src="'+p.src+'" alt="" style="object-position:'+(p.pos||'50% 50%')+'"><span>'+h.t+'</span></button>'}).join('');
(function(){var av=['zarigueya','perezoso','mono','ocelote'];var b=$('#zhPlus')||$('.zh-plus');b.insertAdjacentHTML('beforebegin',av.map(function(k){return '<img src="'+PH[k].src+'" alt="" loading="lazy" style="object-position:'+(PH[k].pos||'50% 50%')+'">'}).join(''))})();
function paintCredit(){$('#zhCredit').innerHTML=credit(PH[HSL[HI2].k])}
function setHero(i){
  if(i===HI2)return;var imgs=$$('#zhBg img'),prev=imgs[HI2],next=imgs[i];HI2=i;
  $$('#zhThumbs button').forEach(function(b,k){b.setAttribute('aria-pressed',String(k===i))});paintCredit();
  if(window.gsap&&!reduced){next.classList.add('is-on');gsap.fromTo(next,{clipPath:'inset(0 0 0 100%)',scale:1.18},{clipPath:'inset(0 0 0 0%)',scale:1,duration:1.1,ease:'power4.inOut',onComplete:function(){prev.classList.remove('is-on');gsap.set(next,{clearProps:'clipPath'})}})}
  else{prev.classList.remove('is-on');next.classList.add('is-on')}
}
document.addEventListener('click',function(e){var b=e.target.closest('[data-hero]');if(b)setHero(+b.getAttribute('data-hero'))});
paintCredit();
/* video completo */
var fLast2=null;
function openFilm(){fLast2=document.activeElement;var f=$('#film');f.hidden=false;document.body.classList.add('lock');var v=$('#filmVid');var q=v.play();if(q&&q.catch)q.catch(function(){});$('#filmClose').focus()}
function closeFilm(){var v=$('#filmVid');v.pause();$('#film').hidden=true;document.body.classList.remove('lock');if(fLast2&&fLast2.focus)fLast2.focus({preventScroll:true})}
document.addEventListener('click',function(e){if(e.target.closest('[data-play-film]')){e.preventDefault();openFilm();return}if(!$('#film').hidden&&(e.target.closest('#filmClose')||e.target===$('#film')))closeFilm()});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!$('#film').hidden)closeFilm()});

/* ======================  QUÉ HACEMOS  ====================== */
$('#zmason').innerHTML=STEPS.map(function(s,i){var p=PH[s.ph];return '<article class="zm-card"><figure class="zimg"><img src="'+p.src+'" alt="" loading="lazy" style="object-position:'+(p.pos||'50% 50%')+'"></figure><span class="zm-n">0'+(i+1)+'</span><h3>'+s.title+'</h3><p>'+s.text+'</p><span class="zm-who">'+esc(s.who)+'</span><button class="lnk" data-cap="'+(s.cap-1)+'">'+ico('i-play')+'Ver la cápsula</button></article>'}).join('');

/* ======================  NOSOTROS  ====================== */
$('#allies').innerHTML=ALLIES.map(function(a){return '<li>'+a+'</li>'}).join('');
var ZST=[[3500,'+','Animales rescatados, recuperados o reubicados desde 2018'],[1100,'~','Animales auxiliados solo en 2022'],[350000,'$','Lo que cuesta operar un año']];
function nf(n){return Math.round(n).toLocaleString('es-EC')}
$('#zstats').innerHTML=ZST.map(function(s){return '<div class="zstat zfade"><dd><b data-count="'+s[0]+'" data-pre="'+s[1]+'">'+s[1]+nf(s[0])+'</b></dd><dt>'+s[2]+'</dt></div>'}).join('');
(function(){var o=PH.ocelote,i=$('#zaImg');i.src=o.src;i.style.objectPosition=o.pos||'50% 40%';$('#zaCredit').innerHTML=credit(o);var d=PH.zarigueya,j=$('#zdImg');j.src=d.src;j.style.objectPosition=d.pos||'50% 50%';$('#zdCredit').innerHTML=credit(d)})();

/* ======================  VIDEO INSTITUCIONAL  ====================== */
var HV=[
 {id:'sacha',kind:'Video institucional',t:'¿Quién es Sacha?',dur:60,desc:'La historia real detrás del nombre de la fundación y lo que pasa en un rescate. Vista previa con material de referencia.',video:true},
 {id:'rescate',kind:'Reportaje',t:'Un rescate, de principio a fin',dur:200,desc:'Del aviso a la liberación: lo que ocurre con un animal desde que llega al centro.',ph:'perezoso'},
 {id:'trailer',kind:'Tráiler de la serie',t:'Todos los días los ves',dur:14,desc:'Avance de la serie en video. Material de referencia.',video:true,poster:true}
];
function zcover(v){var s=v.video?'assets/video/hero-poster.jpg':PH[v.ph].src,pos=v.video?'58% 38%':(PH[v.ph].pos||'50% 50%');return '<div class="zc"><img src="'+s+'" alt="" style="object-position:'+pos+'"><span class="zc-k">'+esc(v.kind)+'</span><b>'+esc(v.t)+'</b></div>'}
var VI=0,hP=Player($('#pl-h'),{});
function renderVideo(play){
  var v=HV[VI];
  hP.load({cover:zcover(v),dur:v.dur,net:'youtube',srcs:v.video?[].concat(VIDEOS.hero):[]},play);
  $('#hKick').textContent=v.kind+' · '+fmt(v.dur);$('#hTitle').textContent=v.t;$('#hDesc').textContent=v.desc;
  $('#vlist').innerHTML=HV.map(function(x,i){var s=x.video?'assets/video/hero-poster.jpg':PH[x.ph].src,pos=x.video?'58% 38%':(PH[x.ph].pos||'50% 50%');return '<li><button data-hv="'+i+'" aria-current="'+(i===VI)+'"><span class="zvl-th"><img src="'+s+'" alt="" style="object-position:'+pos+'">'+ico('i-play')+'</span><span class="zvl-t"><b>'+esc(x.t)+'</b><small>'+esc(x.kind)+'</small></span><span class="zvl-d">'+fmt(x.dur)+'</span></button></li>'}).join('')}
document.addEventListener('click',function(e){var r=e.target.closest('[data-hv]');if(r){VI=+r.getAttribute('data-hv');renderVideo(true)}});

/* ======================  CÁPSULAS Y CASOS: CARRUSELES  ====================== */
function railInit(rail,prev,next){
  var x=null,sl=0,mv=0;
  rail.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;x=e.clientX;sl=rail.scrollLeft;mv=0;rail.classList.add('drag')});
  window.addEventListener('pointermove',function(e){if(x===null)return;mv=e.clientX-x;rail.scrollLeft=sl-mv});
  window.addEventListener('pointerup',function(){if(x===null)return;x=null;rail.classList.remove('drag')});
  rail.addEventListener('click',function(e){if(Math.abs(mv)>6){e.stopPropagation();e.preventDefault();mv=0}},true);
  prev.addEventListener('click',function(){rail.scrollBy({left:-rail.clientWidth*.7,behavior:reduced?'auto':'smooth'})});
  next.addEventListener('click',function(){rail.scrollBy({left:rail.clientWidth*.7,behavior:reduced?'auto':'smooth'})});
}
function renderReels(){$('#reels').innerHTML=CAPS.map(function(c,i){var p=PH[c.ph];return '<button class="zreel" data-cap="'+i+'" data-cursor="Ver" aria-label="Ver cápsula: '+esc(c.pre+' '+c.title)+'"><img src="'+p.src+'" alt="" loading="lazy" style="object-position:'+(p.vpos||p.pos||'50% 50%')+'"><span class="zr-n">'+pad2(i+1)+'</span><span class="zr-d">'+fmt(c.dur)+'</span><span class="zr-t"><small>'+esc(EJES[c.tab].name)+'</small><b>'+esc(c.pre+' '+c.title)+'</b></span></button>'}).join('')}
function renderCases(){$('#cases').innerHTML=CASES.map(function(c){var p=PH[c.ph];return '<a class="zcase" href="'+c.u+'" target="_blank" rel="noopener" data-cursor="Leer"><figure><img src="'+p.src+'" alt="" loading="lazy" style="object-position:'+(p.pos||'50% 50%')+'"><span class="zcs-tag">'+esc(c.k)+(c.d?' · '+c.d:'')+'</span><span class="credit">Foto de referencia</span></figure><div class="zcs-b"><b>'+esc(c.t)+'</b><span>'+esc(c.sp)+' · '+c.s+ico('i-arrow-ur')+'</span></div></a>'}).join('')}

/* ======================  PODCAST  ====================== */
var EP=0,EPS=[{n:1,title:'Así llega un animal al centro',guest:'Equipo veterinario · tema por confirmar',dur:'Por publicar',ph:'tamandua',yt:''},{n:2,title:'Lo que la ciudad le hace a la fauna',guest:'Invitado/a por confirmar',dur:'Por publicar',ph:'zarigueya',yt:''},{n:3,title:'El día de la liberación',guest:'Invitado/a por confirmar',dur:'Por publicar',ph:'mono',yt:''}];
function renderPod(){
  var e=EPS[EP],bars='';for(var i=0;i<36;i++)bars+='<i style="--h:'+(16+Math.abs(Math.sin(i*1.3+EP))*84).toFixed(0)+'%;--i:'+i+'"></i>';
  $('#yt').innerHTML='<div class="zpv" id="ytBox"><i class="zvid-pat"></i><div class="zpv-c"><span>Episodio '+e.n+' · YouTube</span><b>'+esc(e.title)+'</b><small>'+esc(e.guest)+'</small></div><button class="zpv-btn" id="ytPlay" aria-label="Reproducir el episodio '+e.n+'">'+ico('i-play')+'</button><div class="zpv-w" aria-hidden="true">'+bars+'</div></div>';
  $('#eps').innerHTML=EPS.map(function(x,i){var p=PH[x.ph];return '<li><button data-ep="'+i+'" aria-current="'+(i===EP)+'"><span class="zep-th"><img src="'+p.src+'" alt="" loading="lazy" style="object-position:'+(p.pos||'50% 50%')+'"></span><span class="zep-t"><b>'+esc(x.title)+'</b><small>'+esc(x.guest)+'</small></span><span class="zep-d">'+x.dur+'<i>'+ico('i-play')+'</i></span></button></li>'}).join('')}
document.addEventListener('click',function(e){
  var b=e.target.closest('[data-ep]');if(b){EP=+b.getAttribute('data-ep');renderPod();return}
  if(e.target.closest('#ytPlay')){var ep=EPS[EP],bx=$('#ytBox');
    if(ep.yt)bx.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+encodeURIComponent(ep.yt)+'?autoplay=1&rel=0" title="Episodio '+ep.n+'" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
    else if(!$('.pod-msg',bx))bx.insertAdjacentHTML('beforeend','<div class="pod-msg"><b>Este episodio aún no está publicado</b><p>Cuando esté en YouTube se reproducirá aquí mismo, sin salir de la página.</p>'+follow('youtube','paper')+'</div>')}
});

/* ======================  CÓMO AYUDAR, GUÍA DE CAMPO, PRENSA Y PIE  ====================== */
var ZC=[['i-heart','Dona cada mes','Un aporte fijo sostiene medicinas, traslados y alimentación.','data-go="donar" data-gmode="don"'],['i-alert','Reporta un animal','Dos preguntas y te decimos qué hacer y a quién avisar.','data-open-tool'],['i-people','Convenios','Universidades y organizaciones: prácticas, investigación y campañas.','data-go="donar" data-gmode="conv"'],['i-share','Comparte','Que más personas sepan qué hacer con la fauna de su barrio.','data-share']];
$('#zcards').innerHTML=ZC.map(function(c){return '<button class="zcard" '+c[3]+'><span class="zcard-i">'+ico(c[0])+'</span><span class="zcard-a">'+ico('i-arrow-ur')+'</span><span class="zcard-t"><b>'+c[1]+'</b><small>'+c[2]+'</small></span></button>'}).join('');
function renderFauna(){$('#fgrid').innerHTML=FICHAS.map(function(f,i){var p=PH[f.photo],nm=f.single.charAt(0).toUpperCase()+f.single.slice(1);return '<button class="zfz" data-fi="'+i+'" aria-label="Qué hacer si encuentras: '+esc(f.single)+'"><img src="'+p.src+'" alt="" loading="lazy" style="object-position:'+(p.pos||'50% 50%')+'"><span>'+esc(nm)+'</span></button>'}).join('')}
var STAR='<svg class="zstar" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1l2.6 8.4L23 12l-8.4 2.6L12 23l-2.6-8.4L1 12l8.4-2.6z"/></svg>';
function marqHTML(items){var one=items.map(function(t){return '<span>'+t+'</span>'+STAR}).join('');return '<div class="zmarq-t">'+one+one+'</div>'}
$('#zPress').innerHTML=marqHTML(['Vistazo','Primicias','Expreso','El Universo','El Comercio','El Telégrafo','UTPL']);
$('#zBig').innerHTML=marqHTML(['Que vuelvan a casa','Dona','Reporta','Comparte']);
var SOC={instagram:'i-ig',tiktok:'i-tt',youtube:'i-yt',facebook:'i-fb'};
function netHref(n){return n.url||'#contacto'}
$('#zSoc').innerHTML=Object.keys(NETS).map(function(k){var n=NETS[k];return '<a href="'+netHref(n)+'" data-follow="'+k+'" target="'+(n.url?'_blank':'_self')+'" rel="noopener" aria-label="'+n.name+'">'+ico(SOC[k])+'</a>'}).join('');
$('#footSacha').innerHTML=sacha('explora',{alt:'Sacha se va a explorar'});
$('#newsForm').addEventListener('submit',function(e){e.preventDefault();var v=$('#nMail').value.trim(),m=$('#nMsg');if(!validMail(v)){m.textContent='Escribe un correo válido, por ejemplo nombre@correo.com.';m.className='nmsg bad';$('#nMail').focus();return}m.textContent='Listo. Te avisaremos cuando salga la próxima cápsula. (Maqueta: aún no se envía.)';m.className='nmsg ok';this.reset()});

renderVideo(false);renderReels();renderCases();renderPod();renderFauna();renderMap();renderGive();renderCredits();
railInit($('#rail'),$('#reelPrev'),$('#reelNext'));railInit($('#csRail'),$('#csPrev'),$('#csNext'));
onScroll();
