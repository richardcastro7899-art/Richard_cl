/* =========================================================
   AMUREK v3 · escenas WebGL por sección (dirección de /nk.studio sobre amurek.com)
   - net:   panel del hero · «conectando ideas»: red de nodos con los cinco servicios
   - core:  detrás de «Planes» · núcleo de vidrio con órbitas y nubes que suben
   - forma: cierre «Empieza tu proyecto» · fragmentos que se arman al llegar (la idea toma forma)
   Colores de la identidad nueva: negro #0A0A0A, blanco #F5F5F3, grises y verde neón #00FF8B solo como acento.
   ========================================================= */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';

const calcRM = () => matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('motion-off') || /[?&]still/.test(location.search);
let RM = calcRM();
document.addEventListener('motionchange', () => { RM = calcRM(); });
const MOB = () => innerWidth < 900;
// identidad nueva: verde neón #00FF8B (acento, poco), blanco #F5F5F3 y grises
const ACC = new THREE.Color('#00FF8B'), ACC_L = new THREE.Color('#F5F5F3'), ACC_D = new THREE.Color('#2A2A29');

const mouse = { x: 0, y: 0, tx: 0, ty: 0, cx: -9999, cy: -9999, on: false };
addEventListener('pointermove', (e) => { mouse.tx = e.clientX / innerWidth * 2 - 1; mouse.ty = e.clientY / innerHeight * 2 - 1; mouse.cx = e.clientX; mouse.cy = e.clientY; mouse.on = e.pointerType === 'mouse'; }, { passive: true });
document.addEventListener('pointerleave', () => (mouse.on = false));

const NOISE = `
vec3 nm289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 nm289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 nperm(vec4 x){return nm289(((x*34.0)+1.0)*x);}
vec4 ntis(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=nm289(i);
  vec4 p=nperm(nperm(nperm(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=ntis(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

/* ---------- base ---------- */
const rnd = (() => { let s = 20261120; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
function baseRenderer(canvas, { clear, dpr = 1.75, alpha = 1 }) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  r.setPixelRatio(Math.min(devicePixelRatio, MOB() ? 1.35 : dpr));
  r.setClearColor(clear, alpha);
  r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.05; r.outputColorSpace = THREE.SRGBColorSpace;
  return r;
}
function sizeOf(canvas) { const b = canvas.getBoundingClientRect(); return [Math.max(1, Math.round(b.width)), Math.max(1, Math.round(b.height))]; }
function fatLines(arr, color, width, opacity) {
  const g = new LineSegmentsGeometry(); g.setPositions(arr);
  const m = new LineMaterial({ color, linewidth: width, transparent: true, opacity, depthWrite: false });
  return new LineSegments2(g, m);
}
// aberración cromática radial + grano (como en la referencia)
const IRI = `vec3 iri(float x){vec3 c1=vec3(.5,.78,.64),c2=vec3(.93,.94,.93),c3=vec3(.5,.53,.56);float s=.5+.5*sin(x*6.2831);float u=.5+.5*sin(x*10.68+1.3);return mix(mix(c1,c2,s),c3,u*.45);}`;
const CAShader = {
  uniforms: { tDiffuse: { value: null }, uAmt: { value: .003 }, uT: { value: 0 } },
  vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
  fragmentShader: `uniform sampler2D tDiffuse;uniform float uAmt;uniform float uT;varying vec2 vUv;
    float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233))+uT)*43758.5453);}
    void main(){vec2 d=vUv-.5;float k=dot(d,d);vec2 o=d*k*uAmt*4.0;
      vec4 c=texture2D(tDiffuse,vUv);c.r=texture2D(tDiffuse,vUv+o).r;c.b=texture2D(tDiffuse,vUv-o).b;
      c.rgb*= 1.0+(h(vUv*1000.)-.5)*.12;c.rgb*=1.0-k*.9;gl_FragColor=c;}`,
};
function darkBase(canvas, fog) {
  const r = baseRenderer(canvas, { clear: 0x000000, alpha: 0, dpr: 1.5 });
  const scene = new THREE.Scene(); scene.fog = fog;
  const pm = new THREE.PMREMGenerator(r); scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture;
  const cam = new THREE.PerspectiveCamera(40, 1, .1, 150);
  const comp = new EffectComposer(r); comp.addPass(new RenderPass(scene, cam));
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), .48, .5, .3); comp.addPass(bloom);
  const ca = new ShaderPass(CAShader); comp.addPass(ca); comp.addPass(new OutputPass());
  return { r, scene, cam, comp, bloom, ca };
}
const softDot = (() => { let tex; return () => { if (tex) return tex; const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'); const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.35, 'rgba(255,255,255,.45)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); return (tex = new THREE.CanvasTexture(c)); }; })();

/* =========================================================
   0 · HERO · campo en el piso (retícula de /nk) sobre la seda en movimiento de amurek.com
   ========================================================= */
function floorField(opts = {}) {
  const W = opts.W || 14, F = opts.F || -2.7, Z0 = opts.Z0 || 6, D = opts.D || -20, NX = opts.NX || (MOB() ? 40 : 72), NZ = opts.NZ || (MOB() ? 30 : 52), A = opts.A || .26, FAR = (opts.FAR || 24).toFixed(1);
  const fp = [], pt = (i, j) => [-W + 2 * W * i / NX, 0, Z0 + (D - Z0) * j / NZ];
  for (let i = 0; i <= NX; i++) for (let j = 0; j < NZ; j++) fp.push(...pt(i, j), ...pt(i, j + 1));
  for (let j = 0; j <= NZ; j++) for (let i = 0; i < NX; i++) fp.push(...pt(i, j), ...pt(i + 1, j));
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(fp, 3));
  const m = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { uT: { value: 0 }, uF: { value: F }, uM: { value: new THREE.Vector2(99, 99) }, uO: { value: 0 }, uA: { value: A } },
    vertexShader: `uniform float uT;uniform float uF;uniform vec2 uM;varying float vA;
      void main(){vec3 p=position;float sag=-.9*exp(-(p.x*p.x)/30.0)*smoothstep(6.0,-2.0,p.z)*smoothstep(-22.0,-6.0,p.z);
        float wave=.18*sin(p.x*.5+uT*.45)*cos(p.z*.4-uT*.32);float bump=.6*exp(-dot(p.xz-uM,p.xz-uM)/2.4);
        p.y=uF+sag+wave+bump;vec4 mv=modelViewMatrix*vec4(p,1.);vA=pow(clamp(1.0-(-mv.z-4.0)/FAR0,0.,1.),1.4)*smoothstep(-W0,-W0+5.0,p.x)*smoothstep(W0,W0-5.0,p.x);gl_Position=projectionMatrix*mv;}`.replace(/W0/g, W.toFixed(1)).replace(/FAR0/g, FAR),
    fragmentShader: `uniform float uO;uniform float uA;varying float vA;void main(){gl_FragColor=vec4(.92,.93,.92,vA*uA*uO);}` });
  return { mesh: new THREE.LineSegments(g, m), mat: m };
}
function fieldScene(canvas) {
  const r = baseRenderer(canvas, { clear: 0x000000, alpha: 0, dpr: 1.5 });
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(42, 1, .1, 80); cam.position.set(0, .4, 9.5);
  const fl = floorField({ A: .3 }); scene.add(fl.mesh);
  const ray = new THREE.Raycaster(), floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 2.7), hit = new THREE.Vector3(), nd = new THREE.Vector2();
  let w = 1, h = 1, intro = RM ? 1 : 0;
  return {
    resize() { [w, h] = sizeOf(canvas); r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); },
    render(t, p) {
      intro = Math.min(1, intro + (RM ? 1 : .01)); const e = 1 - Math.pow(1 - intro, 3);
      const b = canvas.getBoundingClientRect(), inside = mouse.on && mouse.cx > b.left && mouse.cx < b.right && mouse.cy > b.top && mouse.cy < b.bottom;
      nd.set(((mouse.cx - b.left) / b.width) * 2 - 1, -(((mouse.cy - b.top) / b.height) * 2 - 1)); ray.setFromCamera(nd, cam);
      const ok = inside && ray.ray.intersectPlane(floorPlane, hit);
      fl.mat.uniforms.uT.value = t; fl.mat.uniforms.uO.value = e; fl.mat.uniforms.uM.value.set(ok ? hit.x : 99, ok ? hit.z : 99);
      cam.position.set(mouse.x * .3, .4 - p * .5, 9.5 - p * 1.5); cam.lookAt(0, -.6, -4);
      r.render(scene, cam);
    },
  };
}

/* =========================================================
   ENTRADA · una pantalla solo para la red: ideas de proyectos que aparecen con cada scroll
   ========================================================= */
export function createPortal(canvas, opts = {}) {
  /* La entrada: miles de puntos (el punto de la marca) que fluyen y toman forma.
     0 · una red de ideas hecha de puntos · 1-3 · los puntos fluyen en corrientes y forman cada proyecto (semitono en relieve)
     4 · todo se condensa en el punto de la marca · al entrar, los puntos pasan junto a la cámara.
     El cursor empuja y levanta los puntos; un clic lanza una onda. */
  const r = baseRenderer(canvas, { clear: 0x000000, alpha: 0, dpr: 2 });
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(40, 1, .1, 120);
  const fl = floorField({ W: 26, F: -3.6, Z0: 12, D: -28, NX: MOB() ? 34 : 52, NZ: MOB() ? 24 : 36, A: .1, FAR: 15 }); scene.add(fl.mesh);
  const narrow = () => innerWidth < 760;
  const GX = narrow() ? 132 : 200, GY = narrow() ? 92 : 136, N = GX * GY;
  const aUV = new Float32Array(N * 2), aL = new Float32Array(N * 3).fill(.35), aNet = new Float32Array(N * 3), aSph = new Float32Array(N * 3), aR = new Float32Array(N * 4);
  // red de ideas: nodos en el espacio y puntos a lo largo de sus conexiones
  const NN = narrow() ? 60 : 96, nodes = [];
  for (let i = 0; i < NN; i++) nodes.push(new THREE.Vector3((rnd() - .5) * (narrow() ? 9 : 19), (rnd() - .5) * 8 + .3, -9 + rnd() * 12));
  const edges = [];
  nodes.forEach((a, i) => nodes.map((b, j) => [j, a.distanceTo(b)]).filter(([j]) => j !== i).sort((p, q) => p[1] - q[1]).slice(0, 3)
    .forEach(([j]) => { if (!edges.some(([x, y]) => (x === i && y === j) || (x === j && y === i))) edges.push([i, j]); }));
  const g = () => (rnd() + rnd() + rnd() - 1.5) / 1.5, tv = new THREE.Vector3();
  for (let i = 0; i < N; i++) {
    const ix = i % GX, iy = Math.floor(i / GX);
    aUV[i * 2] = (ix + .5 + (rnd() - .5) * .35) / GX; aUV[i * 2 + 1] = 1 - (iy + .5 + (rnd() - .5) * .35) / GY;
    if (rnd() < .22) { const n = nodes[Math.floor(rnd() * NN)]; tv.set(n.x + g() * .14, n.y + g() * .14, n.z + g() * .14); }
    else { const [a, b] = edges[Math.floor(rnd() * edges.length)], t = rnd(); tv.copy(nodes[a]).lerp(nodes[b], t); tv.x += g() * .035; tv.y += g() * .035; tv.z += g() * .035; }
    aNet.set([tv.x, tv.y, tv.z], i * 3);
    // el punto: una esfera de puntos (la mayoría en la superficie)
    const y = 1 - 2 * (i + .5) / N, rr = Math.sqrt(1 - y * y), ph = i * 2.39996323, k = rnd() < .86 ? 1 - rnd() * .04 : .35 + rnd() * .55;
    aSph.set([Math.cos(ph) * rr * k, y * k, Math.sin(ph) * rr * k], i * 3);
    aR.set([rnd(), rnd(), rnd(), rnd()], i * 4);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(aNet.slice(), 3));
  geo.setAttribute('aUV', new THREE.BufferAttribute(aUV, 2)); geo.setAttribute('aL', new THREE.BufferAttribute(aL, 3));
  geo.setAttribute('aNet', new THREE.BufferAttribute(aNet, 3)); geo.setAttribute('aSph', new THREE.BufferAttribute(aSph, 3)); geo.setAttribute('aR', new THREE.BufferAttribute(aR, 4));
  const U = {
    uT: { value: 0 }, uFrom: { value: 0 }, uTo: { value: 0 }, uMix: { value: 1 }, uPx: { value: r.getPixelRatio() }, uSc: { value: 1 }, uO: { value: 0 }, uWarp: { value: 0 },
    uMouse: { value: new THREE.Vector3(99, 99, 0) }, uMOn: { value: 0 }, uRip: { value: new THREE.Vector4(0, 0, 0, -99) },
    uPl1: { value: new THREE.Vector4() }, uPl2: { value: new THREE.Vector4() }, uPl3: { value: new THREE.Vector4() }, uSize: { value: new THREE.Vector2(6, 4.08) },
    uSphC: { value: new THREE.Vector3() }, uSphR: { value: 1.5 }, uAcc: { value: ACC }, uDepth: { value: .9 },
  };
  const mat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: U,
    vertexShader: `uniform float uT,uFrom,uTo,uMix,uPx,uSc,uO,uWarp,uMOn,uSphR,uDepth;uniform vec3 uMouse,uSphC;uniform vec4 uRip,uPl1,uPl2,uPl3;uniform vec2 uSize;
      attribute vec2 aUV;attribute vec3 aL;attribute vec3 aNet;attribute vec3 aSph;attribute vec4 aR;varying float vA;varying float vG;varying float vL;
      vec3 flowN(vec3 p,float t){return vec3(sin(p.y*.9+t*.7+aR.z*6.28)+sin(p.z*.6-t*.5),cos(p.x*.8-t*.6+aR.y*6.28)+sin(p.z*.7+t*.4),sin(p.x*.7+t*.5)+cos(p.y*.6-t*.3))*.5;}
      vec3 imgPos(vec4 pl,float lum){vec2 q=(aUV-.5)*uSize;float z=(lum-.45)*uDepth;float c=cos(pl.w),s=sin(pl.w);return vec3(q.x*c+z*s,q.y,-q.x*s+z*c)+pl.xyz;}
      void img(vec4 pl,float lum,out vec3 p,out float sz,out float a){
        vec2 e=abs(aUV-.5);float vig=smoothstep(.5,.4,e.x)*smoothstep(.5,.38,e.y);
        p=imgPos(pl,lum)+flowN(vec3(aUV*9.,aR.x*4.),uT*.3)*(1.-vig)*1.3;sz=(.2+pow(lum,1.2)*1.05)*(.35+vig*.65);a=(.22+vig*.62)*(.62+lum*.38);}
      void stateOf(float s,out vec3 p,out float sz,out float lm,out float g,out float a){
        g=0.;a=1.;
        if(s<.5){p=aNet+flowN(aNet,uT*.35)*.22;sz=.38+aR.x*.55;lm=.35;a=.75;g=step(.975,aR.w);}
        else if(s<1.5){lm=aL.x;img(uPl1,lm,p,sz,a);}
        else if(s<2.5){lm=aL.y;img(uPl2,lm,p,sz,a);}
        else if(s<3.5){lm=aL.z;img(uPl3,lm,p,sz,a);}
        else{p=uSphC+aSph*uSphR*(1.+.05*sin(uT*1.4+aR.x*12.)+.03*sin(uT*.8+aSph.y*6.));sz=.5+aR.y*.55;lm=.6;g=step(.58,aR.w);}
      }
      void main(){
        vec3 pA,pB;float sA,sB,lA,lB,gA,gB,aA,aB;
        stateOf(uFrom,pA,sA,lA,gA,aA);stateOf(uTo,pB,sB,lB,gB,aB);
        float k=clamp(uMix*1.7-aR.x*.7,0.,1.);k=k*k*(3.-2.*k);
        vec3 p=mix(pA,pB,k);
        p+=flowN(p*.55+aR.xyz*3.,uT*.6)*sin(k*3.14159)*1.7;
        p+=flowN(p*1.3,uT*.45)*.025;
        vec2 dm=p.xy-uMouse.xy;float fm=exp(-dot(dm,dm)/.5)*uMOn;
        p.xy+=normalize(dm+1e-4)*fm*.42;p.z+=fm*.85;
        float rt=uT-uRip.w;if(rt>0.&&rt<3.){float d=length(p.xy-uRip.xy)-rt*3.4;p.z+=sin(d*4.5)*exp(-d*d*1.2)*(1.-rt/3.)*.55;}
        float w=uWarp*uWarp;p.z+=w*(16.+aR.y*34.);p.xy*=1.+w*.5;
        vec4 mv=modelViewMatrix*vec4(p,1.);
        gl_PointSize=clamp(mix(sA,sB,k)*uSc*uPx*(30./-mv.z),0.,16.*uPx);gl_Position=projectionMatrix*mv;
        vL=mix(lA,lB,k);vG=mix(gA,gB,k);vA=uO*mix(aA,aB,k)*clamp(1.35-(-mv.z)/30.,0.,1.);}`,
    fragmentShader: `uniform vec3 uAcc;varying float vA;varying float vG;varying float vL;
      void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(mix(vec3(.93,.94,.93),uAcc,vG),smoothstep(.5,.28,d)*vA*(.5+vL*.5));}` });
  const pts = new THREE.Points(geo, mat); pts.frustumCulled = false; scene.add(pts);
  // cada proyecto: su imagen, en semitono (el tamaño de cada punto sale del brillo)
  const sample = (src, ch) => { const im = new Image(); im.decoding = 'async'; im.onload = () => {
    const c = document.createElement('canvas'); c.width = GX; c.height = GY; const x = c.getContext('2d', { willReadFrequently: true });
    const s = Math.max(GX / im.naturalWidth, GY / im.naturalHeight), w = im.naturalWidth * s, h = im.naturalHeight * s; x.drawImage(im, (GX - w) / 2, (GY - h) / 2, w, h);
    const d = x.getImageData(0, 0, GX, GY).data; let lo = 1, hi = 0; const L = new Float32Array(N);
    for (let i = 0; i < N; i++) { const v = (d[i * 4] * .299 + d[i * 4 + 1] * .587 + d[i * 4 + 2] * .114) / 255; L[i] = v; lo = Math.min(lo, v); hi = Math.max(hi, v); }
    for (let i = 0; i < N; i++) aL[i * 3 + ch] = Math.pow((L[i] - lo) / Math.max(.05, hi - lo), 1.1);
    geo.attributes.aL.needsUpdate = true; }; im.src = src; };
  (opts.images || []).forEach((src, i) => src && sample(src, i));
  // estado y cámara
  const S = { fov: 40, warp: 0 };
  let w = 1, h = 1, raf = 0, alive = true, last = performance.now(), cur = 0, mOn = 0;
  const t0 = performance.now(), ray = new THREE.Raycaster(), nd = new THREE.Vector2(), plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), hit = new THREE.Vector3(), pv = new THREE.Vector3();
  const layout = () => {
    const n = narrow(), IW = n ? 3.1 : 6, IH = IW * GY / GX; U.uSize.value.set(IW, IH);
    if (n) { [U.uPl1, U.uPl2, U.uPl3].forEach((u) => u.value.set(0, 1.25, 0, 0)); U.uSphC.value.set(0, 1.1, 0); U.uSphR.value = 1.05; }
    else { U.uPl1.value.set(-2.1, .25, 0, .24); U.uPl2.value.set(2.1, .25, 0, -.24); U.uPl3.value.set(-2.1, .25, 0, .24); U.uSphC.value.set(2.3, .35, 0); U.uSphR.value = 1.55; }
  };
  const resize = () => { [w, h] = sizeOf(canvas); r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); U.uSc.value = h / 900; layout(); };
  addEventListener('resize', resize); resize();
  const DUR = 1.5;
  function frame() {
    if (!alive) return; raf = requestAnimationFrame(frame);
    const now = performance.now(), t = (now - t0) / 1000, dt = Math.min(.5, (now - last) / 1000); last = now;
    mouse.x += (mouse.tx - mouse.x) * .06; mouse.y += (mouse.ty - mouse.y) * .06;
    U.uT.value = t; U.uO.value = Math.min(1, t / 1.6);
    if (U.uMix.value < 1) U.uMix.value = Math.min(1, U.uMix.value + dt / DUR);
    cam.fov = S.fov + S.warp * 60; cam.updateProjectionMatrix();
    cam.position.set(mouse.x * .9 * (1 - S.warp), .25 - mouse.y * .55 * (1 - S.warp), 10 - S.warp * 2); cam.lookAt(0, .2, 0);
    nd.set(mouse.x, -mouse.y); ray.setFromCamera(nd, cam); if (ray.ray.intersectPlane(plane, hit)) U.uMouse.value.lerp(hit, .25);
    mOn += ((mouse.on && S.warp < .01 ? 1 : 0) - mOn) * .08; U.uMOn.value = mOn;
    U.uWarp.value = S.warp;
    fl.mat.uniforms.uT.value = t; fl.mat.uniforms.uO.value = U.uO.value * (1 - S.warp);
    r.render(scene, cam);
  }
  frame();
  return {
    S,
    go(k) { if (k === cur && U.uMix.value >= 1) return; U.uFrom.value = U.uMix.value < .55 ? U.uFrom.value : U.uTo.value; U.uTo.value = k; U.uMix.value = 0; cur = k; },
    ripple(cx, cy) { const b = canvas.getBoundingClientRect(); nd.set((cx - b.left) / b.width * 2 - 1, -((cy - b.top) / b.height) * 2 + 1); ray.setFromCamera(nd, cam); if (ray.ray.intersectPlane(plane, hit)) U.uRip.value.set(hit.x, hit.y, 0, U.uT.value); },
    // rectángulo en pantalla que ocupa la imagen de un proyecto (para ubicar su texto al lado)
    rect(k) {
      const pl = [null, U.uPl1, U.uPl2, U.uPl3][k].value, sz = U.uSize.value, c = Math.cos(pl.w), s = Math.sin(pl.w); let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      cam.updateMatrixWorld();
      for (const [ux, uy] of [[-.5, -.5], [.5, -.5], [.5, .5], [-.5, .5]]) { pv.set(ux * sz.x * c + pl.x, uy * sz.y + pl.y, -ux * sz.x * s + pl.z).project(cam);
        const X = (pv.x * .5 + .5) * w, Y = (-pv.y * .5 + .5) * h; x0 = Math.min(x0, X); x1 = Math.max(x1, X); y0 = Math.min(y0, Y); y1 = Math.max(y1, Y); }
      return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
    },
    destroy() { alive = false; cancelAnimationFrame(raf); removeEventListener('resize', resize); r.dispose(); try { r.forceContextLoss(); } catch {} },
  };
}

/* =========================================================
   1 · HERO · «conectando ideas» (dentro del panel oscuro del hero)
   ========================================================= */
function netScene(canvas) {
  const r = baseRenderer(canvas, { clear: 0x000000, alpha: 0 });
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(42, 1, .1, 80); cam.position.set(0, .5, 9.5);
  const NX0 = () => (MOB() ? 0 : 3.0);
  // suelo de malla curva (retícula de /nk) en rosa muy tenue
  const W = 12, F = -2.9, Z0 = 6, D = -18;
  const NX = MOB() ? 36 : 60, NZ = MOB() ? 30 : 48, fp = [], pt = (i, j) => [-W + 2 * W * i / NX, 0, Z0 + (D - Z0) * j / NZ];
  for (let i = 0; i <= NX; i++) for (let j = 0; j < NZ; j++) fp.push(...pt(i, j), ...pt(i, j + 1));
  for (let j = 0; j <= NZ; j++) for (let i = 0; i < NX; i++) fp.push(...pt(i, j), ...pt(i + 1, j));
  const floorGeo = new THREE.BufferGeometry(); floorGeo.setAttribute('position', new THREE.Float32BufferAttribute(fp, 3));
  const floorMat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { uT: { value: 0 }, uF: { value: F }, uM: { value: new THREE.Vector2(99, 99) }, uO: { value: 0 } },
    vertexShader: `uniform float uT;uniform float uF;uniform vec2 uM;varying float vA;
      void main(){vec3 p=position;float sag=-1.05*exp(-(p.x*p.x)/26.0)*smoothstep(6.0,-2.0,p.z)*smoothstep(-20.0,-6.0,p.z);
        float wave=.16*sin(p.x*.55+uT*.5)*cos(p.z*.42-uT*.35);float bump=.55*exp(-dot(p.xz-uM,p.xz-uM)/2.2);
        p.y=uF+sag+wave+bump;vec4 mv=modelViewMatrix*vec4(p,1.);vA=clamp(1.0-(-mv.z-5.0)/22.0,0.,1.);gl_Position=projectionMatrix*mv;}`,
    fragmentShader: `uniform float uO;varying float vA;void main(){gl_FragColor=vec4(.92,.8,.84,vA*.2*uO);}` });
  scene.add(new THREE.LineSegments(floorGeo, floorMat));

  // red de ideas
  const net = new THREE.Group(); net.position.set(NX0(), .55, 0); scene.add(net);
  const N = MOB() ? 70 : 140, home = [], pos = new Float32Array(N * 3), acc = new Float32Array(N), phase = [];
  for (let i = 0; i < N; i++) {
    const u = rnd() * 2 - 1, th = rnd() * Math.PI * 2, rr = Math.pow(rnd(), .55), s = Math.sqrt(1 - u * u);
    home.push(new THREE.Vector3(Math.cos(th) * s * 3.9 * rr, u * 2.05 * rr, Math.sin(th) * s * 2.1 * rr));
    const far = home[i].clone().multiplyScalar(2.6 + rnd() * 2).add(new THREE.Vector3((rnd() - .5) * 6, (rnd() - .5) * 4, (rnd() - .5) * 4));
    pos.set([far.x, far.y, far.z], i * 3); acc[i] = rnd() < .2 ? 1 : 0; phase.push([rnd() * 6.28, rnd() * 6.28, rnd() * 6.28, .5 + rnd()]);
  }
  const nodeGeo = new THREE.BufferGeometry(); nodeGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); nodeGeo.setAttribute('aAcc', new THREE.BufferAttribute(acc, 1));
  const nodeMat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { uPx: { value: r.getPixelRatio() }, uA: { value: ACC }, uO: { value: 0 } },
    vertexShader: `uniform float uPx;attribute float aAcc;varying float vAcc;void main(){vAcc=aAcc;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=(aAcc>.5?10.0:6.0)*uPx*(8.0/-mv.z);gl_Position=projectionMatrix*mv;}`,
    fragmentShader: `uniform vec3 uA;uniform float uO;varying float vAcc;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;float a=smoothstep(.5,.28,d)*uO*(vAcc>.5?1.0:.8);gl_FragColor=vec4(mix(vec3(.96,.96,.95),uA,vAcc),a);}` });
  net.add(new THREE.Points(nodeGeo, nodeMat));
  const MAXL = N * 7, lPos = new Float32Array(MAXL * 6), lA = new Float32Array(MAXL * 2), lC = new Float32Array(MAXL * 2);
  const lineGeo = new THREE.BufferGeometry(); lineGeo.setAttribute('position', new THREE.BufferAttribute(lPos, 3)); lineGeo.setAttribute('aA', new THREE.BufferAttribute(lA, 1)); lineGeo.setAttribute('aC', new THREE.BufferAttribute(lC, 1));
  const lineMat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { uA: { value: ACC } },
    vertexShader: `attribute float aA;attribute float aC;varying float vA;varying float vC;void main(){vA=aA;vC=aC;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `uniform vec3 uA;varying float vA;varying float vC;void main(){gl_FragColor=vec4(mix(vec3(.96,.96,.95),uA,vC*.45),vA);}` });
  const lines = new THREE.LineSegments(lineGeo, lineMat); net.add(lines);
  const MAXT = MOB() ? 60 : 130, tPos = new Float32Array(MAXT * 9), tA = new Float32Array(MAXT * 3);
  const triGeo = new THREE.BufferGeometry(); triGeo.setAttribute('position', new THREE.BufferAttribute(tPos, 3)); triGeo.setAttribute('aA', new THREE.BufferAttribute(tA, 1));
  const triMat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide, uniforms: { uA: { value: ACC } },
    vertexShader: `attribute float aA;varying float vA;void main(){vA=aA;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `uniform vec3 uA;varying float vA;void main(){gl_FragColor=vec4(uA,vA);}` });
  const tris = new THREE.Mesh(triGeo, triMat); net.add(tris);
  // pulsos que viajan por las conexiones (ideas que se conectan)
  const NP = MOB() ? 6 : 12, pulse = [], pPos = new Float32Array(NP * 3);
  for (let i = 0; i < NP; i++) pulse.push({ a: Math.floor(rnd() * N), b: Math.floor(rnd() * N), t: rnd() });
  const pGeo = new THREE.BufferGeometry(); pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({ color: ACC_L, size: .15, map: softDot(), transparent: true, depthWrite: false, opacity: 0 });
  net.add(new THREE.Points(pGeo, pMat));

  // etiquetas: los cinco servicios de AMUREK como ideas de la red
  const TAGS = MOB() ? ['Branding', 'Audiovisual', 'Redes', 'Web'] : ['Branding', 'Audiovisual', 'Redes', 'Marketing', 'Web y software'];
  const DIRS = [[-1, .55, .3], [1, .6, .2], [.95, -.55, .5], [-.9, -.6, .4], [.1, .95, -.3]];
  const host = canvas.parentElement, box = document.createElement('div'); box.className = 'ad-tags'; box.setAttribute('aria-hidden', 'true'); host.appendChild(box);
  const tagIdx = TAGS.map((name, k) => { const d = new THREE.Vector3(...DIRS[k]).normalize(); let best = 0, bs = -9;
    home.forEach((hv, i) => { const sc = hv.clone().normalize().dot(d) + hv.length() * .12; if (sc > bs && acc[i] !== 2) { bs = sc; best = i; } });
    acc[best] = 2; const el = document.createElement('span'); el.className = 'ad-tag'; el.innerHTML = `<i></i>${name}`; box.appendChild(el); return { i: best, el }; });
  tagIdx.forEach(({ i }) => (acc[i] = 1)); nodeGeo.attributes.aAcc.needsUpdate = true;
  const pv = new THREE.Vector3();
  const ray = new THREE.Raycaster(), plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), mw = new THREE.Vector3(), ml = new THREE.Vector3(), tmp = new THREE.Vector3(), inv = new THREE.Matrix4(), nd = new THREE.Vector2();
  const nbr = Array.from({ length: N }, () => []);
  let w = 1, h = 1, intro = RM ? 1 : 0;
  const DMAX = 1.15;
  return {
    resize() { [w, h] = sizeOf(canvas); r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); const mob = w < 760; net.scale.setScalar(mob ? .62 : Math.min(1, w / h / 1.6)); net.position.set(mob ? 0 : NX0() * Math.min(1, w / 1300), mob ? 2.5 : .55, 0); },
    render(t, p) {
      intro = Math.min(1, intro + (RM ? 1 : .009)); const e = 1 - Math.pow(1 - intro, 3);
      floorMat.uniforms.uT.value = t; floorMat.uniforms.uO.value = e;
      // puntero relativo al panel (no a la ventana)
      const b = canvas.getBoundingClientRect(), inside = mouse.on && mouse.cx > b.left && mouse.cx < b.right && mouse.cy > b.top && mouse.cy < b.bottom;
      nd.set(((mouse.cx - b.left) / b.width) * 2 - 1, -(((mouse.cy - b.top) / b.height) * 2 - 1));
      net.rotation.set(mouse.y * .1, t * .06 + mouse.x * .3 + p * 1.2, 0);
      ray.setFromCamera(nd, cam); ray.ray.intersectPlane(plane, mw);
      net.updateMatrixWorld(); inv.copy(net.matrixWorld).invert(); ml.copy(mw).applyMatrix4(inv);
      floorMat.uniforms.uM.value.set(inside ? mw.x : 99, -1);
      for (let i = 0; i < N; i++) {
        const hv = home[i], ph = phase[i];
        tmp.set(hv.x + Math.sin(t * .5 * ph[3] + ph[0]) * .2, hv.y + Math.sin(t * .45 * ph[3] + ph[1]) * .16, hv.z + Math.sin(t * .4 * ph[3] + ph[2]) * .2);
        if (inside && !RM) { const dx = ml.x - tmp.x, dy = ml.y - tmp.y, dz = ml.z - tmp.z, d = Math.hypot(dx, dy, dz); if (d < 1.4) { const f = (1 - d / 1.4) * .45; tmp.x += dx * f; tmp.y += dy * f; tmp.z += dz * f; } }
        const k = RM ? 1 : .06 + .06 * e;
        pos[i * 3] += (tmp.x - pos[i * 3]) * k; pos[i * 3 + 1] += (tmp.y - pos[i * 3 + 1]) * k; pos[i * 3 + 2] += (tmp.z - pos[i * 3 + 2]) * k;
      }
      nodeGeo.attributes.position.needsUpdate = true; nodeMat.uniforms.uO.value = e;
      let nl = 0; nbr.forEach((a) => (a.length = 0));
      for (let i = 0; i < N && nl < MAXL; i++) for (let j = i + 1; j < N && nl < MAXL; j++) {
        const dx = pos[i * 3] - pos[j * 3], dy = pos[i * 3 + 1] - pos[j * 3 + 1], dz = pos[i * 3 + 2] - pos[j * 3 + 2], d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d < DMAX) { nbr[i].push(j); const c = acc[i] || acc[j] ? 1 : 0, a = (1 - d / DMAX) * (c ? .5 : .3) * e;
          lPos.set([pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2], pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]], nl * 6); lA[nl * 2] = lA[nl * 2 + 1] = a; lC[nl * 2] = lC[nl * 2 + 1] = c; nl++; }
      }
      if (inside && !RM) for (let i = 0; i < N && nl < MAXL; i++) { const d = Math.hypot(pos[i * 3] - ml.x, pos[i * 3 + 1] - ml.y, pos[i * 3 + 2] - ml.z); if (d < 1.6) { lPos.set([ml.x, ml.y, ml.z, pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]], nl * 6); lA[nl * 2] = lA[nl * 2 + 1] = (1 - d / 1.6) * .7; lC[nl * 2] = lC[nl * 2 + 1] = 1; nl++; } }
      lineGeo.setDrawRange(0, nl * 2); ['position', 'aA', 'aC'].forEach((k) => (lineGeo.attributes[k].needsUpdate = true));
      let nt = 0;
      for (let i = 0; i < N && nt < MAXT; i++) { const ni = nbr[i]; for (let x = 0; x < ni.length && nt < MAXT; x++) for (let y = x + 1; y < ni.length && nt < MAXT; y++) {
        const j = ni[x], k = ni[y]; if (!nbr[Math.min(j, k)].includes(Math.max(j, k))) continue;
        if ((i * 7 + j * 3 + k) % 5) continue;
        tPos.set([pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2], pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2], pos[k * 3], pos[k * 3 + 1], pos[k * 3 + 2]], nt * 9);
        const a = (.035 + .07 * (Math.sin(t * 1.1 + i) * .5 + .5)) * e; tA[nt * 3] = tA[nt * 3 + 1] = tA[nt * 3 + 2] = a; nt++; } }
      triGeo.setDrawRange(0, nt * 3); triGeo.attributes.position.needsUpdate = true; triGeo.attributes.aA.needsUpdate = true;
      for (let q = 0; q < NP; q++) { const P = pulse[q]; P.t += RM ? 0 : .02;
        if (P.t >= 1 || !nbr[Math.min(P.a, P.b)].includes(Math.max(P.a, P.b))) { P.a = P.b; const opts = [...nbr[P.a], ...nbr.flatMap((n, ix) => (n.includes(P.a) ? [ix] : []))]; P.b = opts.length ? opts[Math.floor(rnd() * opts.length)] : Math.floor(rnd() * N); P.t = 0; }
        for (let c = 0; c < 3; c++) pPos[q * 3 + c] = pos[P.a * 3 + c] + (pos[P.b * 3 + c] - pos[P.a * 3 + c]) * P.t; }
      pGeo.attributes.position.needsUpdate = true; pMat.opacity = e;
      // al bajar, la cámara entra en la red: la idea se acerca
      const dive = Math.min(1, Math.max(0, (p - .55) * 2.2)), dv = dive * dive * (3 - 2 * dive);
      cam.position.set(mouse.x * .35 + net.position.x * dv * .8, .5 - mouse.y * .2 + dv * .4, 9.5 - dv * 5.6); cam.lookAt(net.position.x * dv * .9, .2 + dv * .5, -2);
      cam.updateMatrixWorld(); net.updateMatrixWorld();
      tagIdx.forEach(({ i, el }) => { pv.set(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]).applyMatrix4(net.matrixWorld).project(cam);
        const vis = pv.z < 1 && Math.abs(pv.x) < 1.05 && Math.abs(pv.y) < 1.05; const x = (pv.x * .5 + .5) * w, y = (-pv.y * .5 + .5) * h;
        el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) translate(-50%,-150%)`; el.style.opacity = vis ? (e * Math.max(0, 1 - dv * 2)).toFixed(2) : 0; });
      r.render(scene, cam);
    },
  };
}

/* ---------- nubes que suben (compartido por las escenas oscuras) ---------- */
function risingClouds(scene, r, { count, cols }) {
  // columnas de partículas (como /nk) + capa de nubes suaves con flujo de ruido
  const grp = new THREE.Group(); scene.add(grp);
  if (cols) {
    const NX = MOB() ? 56 : 104, NZ = MOB() ? 30 : 56, K = MOB() ? 6 : 9, n = NX * NZ * K, aC = new Float32Array(n * 3), aK = new Float32Array(n); let q = 0;
    for (let i = 0; i < NX; i++) for (let j = 0; j < NZ; j++) { const x = (i / (NX - 1) - .5) * 30, z = 3 - j / (NZ - 1) * 26, sp = rnd();
      for (let k = 0; k < K; k++) { aC[q * 3] = x + (rnd() - .5) * .08; aC[q * 3 + 1] = sp; aC[q * 3 + 2] = z; aK[q] = (k + rnd() * .6) / K; q++; } }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(aC, 3)); g.setAttribute('aK', new THREE.BufferAttribute(aK, 1));
    const m = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { uT: { value: 0 }, uPx: { value: r.getPixelRatio() }, uA: { value: ACC_D }, uB: { value: ACC_L }, uI: { value: 0 } },
      vertexShader: `${NOISE}uniform float uT;uniform float uPx;uniform float uI;attribute float aK;varying float vV;varying float vD;
        void main(){vec3 c=position;float sp=c.y;float hN=snoise(vec3(c.x*.12,c.z*.12,uT*.03))*.5+.5;
          float h=(pow(hN,2.0)*5.2)*(1.0-smoothstep(1.6,0.0,abs(c.x))*.8)*uI+.2;float f=fract(aK+uT*(.04+sp*.07));
          vec3 p=vec3(c.x+sin(uT*.3+c.z)*.1,-2.6+f*h,c.z);vV=f;vec4 mv=modelViewMatrix*vec4(p,1.);vD=-mv.z;
          gl_PointSize=(1.3+f*1.9)*uPx*(10.0/vD);gl_Position=projectionMatrix*mv;}`,
      fragmentShader: `uniform vec3 uA;uniform vec3 uB;varying float vV;varying float vD;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;
          gl_FragColor=vec4(mix(uA,uB,vV*vV)*.85,(1.0-d*2.0)*(.16+vV*.55)*clamp(1.3-vD/30.0,0.,1.));}` });
    grp.add(new THREE.Points(g, m)); grp.userData.cols = m;
  }
  const n = count, aP = new Float32Array(n * 3), aS = new Float32Array(n);
  for (let i = 0; i < n; i++) { aP[i * 3] = (rnd() - .5) * 34; aP[i * 3 + 1] = rnd(); aP[i * 3 + 2] = -2 - rnd() * 22; aS[i] = .5 + rnd(); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(aP, 3)); g.setAttribute('aS', new THREE.BufferAttribute(aS, 1));
  const m = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uT: { value: 0 }, uPx: { value: r.getPixelRatio() }, uMap: { value: softDot() }, uA: { value: ACC_D }, uB: { value: ACC_L }, uI: { value: 0 } },
    vertexShader: `${NOISE}uniform float uT;uniform float uPx;attribute float aS;varying float vF;varying float vD;
      void main(){vec3 c=position;float f=fract(c.y+uT*.018*aS);vec3 p=vec3(c.x,-3.0+f*11.0,c.z);
        p.x+=snoise(vec3(c.x*.08,f*2.0,uT*.05))*2.2;p.z+=snoise(vec3(c.z*.08,f*2.0+5.0,uT*.05))*1.4;vF=f;
        vec4 mv=modelViewMatrix*vec4(p,1.);vD=-mv.z;gl_PointSize=aS*uPx*(900.0/vD);gl_Position=projectionMatrix*mv;}`,
    fragmentShader: `uniform sampler2D uMap;uniform vec3 uA;uniform vec3 uB;uniform float uI;varying float vF;varying float vD;
      void main(){float a=texture2D(uMap,gl_PointCoord).a;float life=smoothstep(0.,.2,vF)*smoothstep(1.,.55,vF);
        gl_FragColor=vec4(mix(uB,uA,vF)*.9,a*life*.055*uI*clamp(1.2-vD/30.0,0.,1.));}` });
  grp.add(new THREE.Points(g, m)); grp.userData.cloud = m;
  return { update(t, e) { const m1 = grp.userData.cols; if (m1) { m1.uniforms.uT.value = t; m1.uniforms.uI.value = e; } m.uniforms.uT.value = t; m.uniforms.uI.value = e; } };
}

/* =========================================================
   2 · CREAMOS MARCAS · núcleo con fragmentos y órbitas
   ========================================================= */
function brandScene(canvas) {
  const LBL = (canvas.dataset.labels || '').split('|').filter(Boolean), CX = () => (innerWidth < 900 ? 0 : +(canvas.dataset.x || 0)), NO = LBL.length || 4;
  const { r, scene, cam, comp, ca, bloom } = darkBase(canvas, new THREE.FogExp2(0x000000, .04));
  cam.position.set(0, 1.0, 10.5); bloom.strength = .3; bloom.threshold = .42;
  const clouds = risingClouds(scene, r, { count: MOB() ? 320 : 700, cols: true });
  const core = new THREE.Group(); core.position.set(CX(), .9, 0); scene.add(core);
  // esfera de grano (partículas en la superficie y dentro)
  const NS = MOB() ? 4200 : 9000, sp = new Float32Array(NS * 3), sv = new Float32Array(NS);
  for (let i = 0; i < NS; i++) { const u = rnd() * 2 - 1, th = rnd() * 6.283, s = Math.sqrt(1 - u * u), inside = i % 3 === 0, rr = inside ? Math.cbrt(rnd()) * .96 : 1 + (rnd() - .5) * .03;
    sp.set([Math.cos(th) * s * rr, u * rr, Math.sin(th) * s * rr], i * 3); sv[i] = rnd(); }
  const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(sp, 3)); sg.setAttribute('aV', new THREE.BufferAttribute(sv, 1));
  const sm = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { uPx: { value: r.getPixelRatio() }, uO: { value: 0 }, uT: { value: 0 } },
    vertexShader: `uniform float uPx;uniform float uT;attribute float aV;varying float vV;void main(){vV=aV;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=(1.0+aV*1.6)*uPx*(9.0/-mv.z);gl_Position=projectionMatrix*mv;}`,
    fragmentShader: `uniform float uO;uniform float uT;varying float vV;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;float tw=.6+.4*sin(uT*3.0+vV*40.0);gl_FragColor=vec4(vec3(.9,.92,.91),(1.0-d*2.0)*.2*tw*uO);}` });
  core.add(new THREE.Points(sg, sm));
  const glass = new THREE.Mesh(new THREE.SphereGeometry(.97, 64, 64), new THREE.ShaderMaterial({ transparent: true, depthWrite: false,
    uniforms: { uT: { value: 0 }, uO: { value: 0 } },
    vertexShader: `varying vec3 vN;varying vec3 vV;varying vec3 vP;void main(){vec4 w=modelMatrix*vec4(position,1.);vN=normalize(mat3(modelMatrix)*normal);vV=normalize(cameraPosition-w.xyz);vP=position;gl_Position=projectionMatrix*viewMatrix*w;}`,
    fragmentShader: `${IRI}uniform float uT;uniform float uO;varying vec3 vN;varying vec3 vV;varying vec3 vP;
      void main(){vec3 n=normalize(vN),v=normalize(vV);float f=1.0-max(dot(n,v),0.0);float fr=pow(f,2.4);
        vec3 ir=iri(f*1.2+vP.y*.3+uT*.04);
        float sp=pow(max(dot(reflect(-v,n),normalize(vec3(-.45,.75,.5))),0.0),38.0);
        vec3 col=mix(vec3(.1,.11,.11),ir*.8,.38)*fr+vec3(.9,.95,.92)*pow(f,6.0)*.45+vec3(1.)*sp*.35;
        gl_FragColor=vec4(col,clamp(fr*.8+sp*.3+.035,0.,1.)*uO);}` }));
  core.add(glass);
  // fragmentos (pétalos de vidrio que salen del núcleo)
  const shardMat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
    uniforms: { uT: { value: 0 } },
    vertexShader: `varying vec3 vN;varying vec3 vP;void main(){vN=normalize(mat3(modelMatrix)*normal);vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `${IRI}uniform float uT;varying vec3 vN;varying vec3 vP;void main(){float l=abs(dot(normalize(vN),normalize(vec3(-.4,.7,.5))));
      vec3 ir=iri(length(vP)*.9+uT*.05);
      vec3 col=mix(vec3(.1,.11,.11),ir*.85,.45)*(.35+l*.65);float a=.16+pow(l,8.0)*.22;gl_FragColor=vec4(col*a,1.0);}` });
  const shards = [];
  for (let s = 0; s < 8; s++) {
    const dir = new THREE.Vector3(rnd() - .5, rnd() - .5, rnd() - .5).normalize(), side = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize(), up = new THREE.Vector3().crossVectors(side, dir).normalize();
    const w0 = .25 + rnd() * .28, len = .45 + rnd() * .55;
    const A = dir.clone().multiplyScalar(.85).addScaledVector(side, -w0), B = dir.clone().multiplyScalar(.85).addScaledVector(side, w0), C = dir.clone().multiplyScalar(.85 + len).addScaledVector(up, (rnd() - .5) * .6), M = dir.clone().multiplyScalar(.98).addScaledVector(up, .18);
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute([...A.toArray(), ...M.toArray(), ...C.toArray(), ...M.toArray(), ...B.toArray(), ...C.toArray()], 3)); g.computeVertexNormals();
    const mesh = new THREE.Mesh(g, shardMat); const edge = fatLines([...A.toArray(), ...C.toArray(), ...B.toArray(), ...C.toArray(), ...M.toArray(), ...C.toArray()], 0xF5F5F3, 1.2, .55);
    const holder = new THREE.Group(); holder.add(mesh, edge); holder.userData = { axis: new THREE.Vector3(rnd() - .5, rnd() - .5, rnd() - .5).normalize(), sp: (rnd() - .5) * .5, ph: rnd() * 6 };
    core.add(holder); shards.push(holder);
  }
  // órbitas con ideas que viajan
  const orbits = [];
  for (let o = 0; o < NO; o++) {
    const a = 1.9 + o * .3, b = a * (.5 + rnd() * .25), seg = 128, arr = [];
    for (let i = 0; i < seg; i++) { const t0 = i / seg * 6.283, t1 = (i + 1) / seg * 6.283; arr.push(Math.cos(t0) * a, 0, Math.sin(t0) * b, Math.cos(t1) * a, 0, Math.sin(t1) * b); }
    const ring = fatLines(arr, o % 2 ? 0xF5F5F3 : 0xF5F5F3, 1.0, .3);
    const bead = new THREE.Sprite(new THREE.SpriteMaterial({ map: softDot(), color: ACC_L, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false })); bead.scale.setScalar(.26);
    const holder = new THREE.Group(); holder.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3); holder.add(ring, bead); core.add(holder);
    orbits.push({ holder, bead, a, b, sp: .25 + rnd() * .35, ph: rnd() * 6, ring });
  }
  const rim = new THREE.PointLight(0x00FF8B, 9, 0, 2); rim.position.set(-2.4, 1.6, 2.6); scene.add(rim);
  const rim2 = new THREE.PointLight(0xffffff, 3.5, 0, 2); rim2.position.set(2.6, 2.4, 1.5); scene.add(rim2);
  const lines = [...shards.map((s) => s.children[1].material), ...orbits.map((o) => o.ring.material)];
  const lbox = document.createElement('div'); lbox.className = 'ad-tags ad-tags--orbit'; lbox.setAttribute('aria-hidden', 'true'); canvas.parentElement.appendChild(lbox);
  const lbl = LBL.map((name) => { const el = document.createElement('span'); el.className = 'ad-tag'; el.innerHTML = `<i></i>${name}`; lbox.appendChild(el); return el; });
  const bw = new THREE.Vector3();
  let w = 1, h = 1, intro = RM ? 1 : 0;
  return {
    resize() { [w, h] = sizeOf(canvas); r.setSize(w, h, false); comp.setSize(w, h); cam.aspect = w / h; cam.updateProjectionMatrix(); lines.forEach((m) => m.resolution.set(w, h)); core.scale.setScalar(MOB() ? .62 : .92); core.position.x = CX(); },
    render(t, p) {
      intro = Math.min(1, intro + (RM ? 1 : .008)); const e = 1 - Math.pow(1 - intro, 3);
      clouds.update(RM ? 0 : t, e); sm.uniforms.uO.value = e; sm.uniforms.uT.value = t; glass.material.uniforms.uT.value = t; glass.material.uniforms.uO.value = e; shardMat.uniforms.uT.value = t;
      core.rotation.set(.2 + mouse.y * .15, t * .12 + mouse.x * .4 + p * 1.6, .1);
      core.position.y = 1.25 + (1 - e) * -2.4 + Math.sin(t * .7) * .06;
      const open = .9 + .25 * Math.sin(t * .6) + p * .5;
      shards.forEach((s, i) => { s.rotation.set(0, 0, 0); s.rotateOnAxis(s.userData.axis, Math.sin(t * .5 + s.userData.ph) * .35 + t * s.userData.sp); s.scale.setScalar(e * open); });
      orbits.forEach((o) => { const a = t * o.sp + o.ph; o.bead.position.set(Math.cos(a) * o.a, 0, Math.sin(a) * o.b); o.holder.rotation.y += RM ? 0 : .0015; o.ring.material.opacity = .3 * e; });
      ca.uniforms.uT.value = t; ca.uniforms.uAmt.value = .003 + Math.abs(mouse.x) * .002;
      cam.position.x = mouse.x * .5; cam.position.y = 1.0 - mouse.y * .25 + (p - .5) * .8; cam.lookAt(0, .7, -2);
      if (lbl.length) { cam.updateMatrixWorld(); lbl.forEach((el, k) => { orbits[k].bead.getWorldPosition(bw); bw.project(cam);
        const vis = bw.z < 1 && Math.abs(bw.x) < 1.05 && Math.abs(bw.y) < 1.05;
        el.style.transform = `translate3d(${((bw.x * .5 + .5) * w).toFixed(1)}px,${((-bw.y * .5 + .5) * h).toFixed(1)}px,0) translate(-50%,-160%)`; el.style.opacity = vis ? e.toFixed(2) : 0; }); }
      comp.render();
    },
  };
}

/* =========================================================
   3 · DAMOS FORMA · fragmentos que se arman
   ========================================================= */
function rangeScene(canvas) {
  const FX = MOB() ? 0 : 4.1;
  const { r, scene, cam, comp, ca, bloom } = darkBase(canvas, new THREE.FogExp2(0x000000, .05));
  cam.position.set(0, 1.2, 11); bloom.strength = .32; bloom.threshold = .45;
  // suelo en retícula con brillo en el horizonte
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(90, 70, 1, 1), new THREE.ShaderMaterial({ transparent: true, depthWrite: false,
    uniforms: { uT: { value: 0 }, uA: { value: ACC }, uX: { value: FX } },
    vertexShader: `varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
    fragmentShader: `uniform float uT;uniform vec3 uA;uniform float uX;varying vec3 vW;
      float ln(float x,float s){float f=abs(fract(x/s-.5)-.5)/fwidth(x/s);return 1.0-min(f,1.0);}
      void main(){float g=max(ln(vW.x,1.2),ln(vW.z+uT*.6,1.2));float d=length(vW.xz-vec2(uX,-2.));
        float fade=smoothstep(22.0,3.0,d);float glow=exp(-d*.3);vec3 col=mix(vec3(.9,.91,.9),uA,.12)*g*.2*fade+mix(vec3(1.),uA,.4)*glow*.07;
        gl_FragColor=vec4(col,clamp(g*.38*fade+glow*.25,0.,1.));}` }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -2.6; scene.add(floor);
  // haz de luz
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(.6, 3.4, 16, 48, 1, true), new THREE.ShaderMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
    uniforms: { uT: { value: 0 }, uA: { value: ACC } },
    vertexShader: `varying vec2 vU;void main(){vU=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `${NOISE}uniform float uT;uniform vec3 uA;varying vec2 vU;void main(){float n=snoise(vec3(vU.x*8.0,vU.y*2.0-uT*.2,uT*.1))*.5+.5;
      float a=pow(1.0-vU.y,1.6)*.09*(0.5+n*.8);gl_FragColor=vec4(mix(uA,vec3(1.),.9)*a,a);}` }));
  beam.position.set(FX, 5.4, -3); scene.add(beam);
  // polvo
  const ND = MOB() ? 500 : 1200, dp = new Float32Array(ND * 3); for (let i = 0; i < ND; i++) dp.set([(rnd() - .5) * 20, -2.5 + rnd() * 9, -10 + rnd() * 14], i * 3);
  const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.BufferAttribute(dp, 3));
  const dust = new THREE.Points(dg, new THREE.PointsMaterial({ color: 0xF5F5F3, size: .04, transparent: true, opacity: .32, depthWrite: false, blending: THREE.AdditiveBlending })); scene.add(dust);
  // fragmentos: caras de un icosaedro que se arman
  const form = new THREE.Group(); form.position.set(FX, .9, 0); scene.add(form);
  const ico = new THREE.IcosahedronGeometry(1.45, 1).toNonIndexed(), P = ico.attributes.position;
  const glassMat = new THREE.ShaderMaterial({ transparent: true, side: THREE.DoubleSide, depthWrite: false, uniforms: { uT: { value: 0 } },
    vertexShader: `varying vec3 vN;varying vec3 vV;varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;vN=normalize(mat3(modelMatrix)*normal);vV=normalize(cameraPosition-w.xyz);gl_Position=projectionMatrix*viewMatrix*w;}`,
    fragmentShader: `${IRI}uniform float uT;varying vec3 vN;varying vec3 vV;varying vec3 vW;void main(){vec3 n=normalize(vN);if(!gl_FrontFacing)n=-n;vec3 v=normalize(vV);
      float f=1.0-abs(dot(n,v));float l=max(dot(n,normalize(vec3(-.5,.8,.4))),0.);
      float sp=pow(max(dot(reflect(-v,n),normalize(vec3(-.4,.7,.6))),0.),24.);
      vec3 col=mix(vec3(.04,.04,.04),iri(f*1.1+vW.y*.12+uT*.04)*.62,clamp(f*.85+l*.18,0.,1.))*(.45+l*.55)+vec3(1.)*sp*.3;
      gl_FragColor=vec4(col,clamp(.42+f*.3+sp*.3,0.,1.));}` });
  const pieces = [], lineMats = [];
  for (let f = 0; f < P.count; f += 3) {
    const a = new THREE.Vector3().fromBufferAttribute(P, f), b = new THREE.Vector3().fromBufferAttribute(P, f + 1), c = new THREE.Vector3().fromBufferAttribute(P, f + 2);
    const cen = a.clone().add(b).add(c).divideScalar(3), n = cen.clone().normalize();
    const shrink = (v) => v.clone().sub(cen).multiplyScalar(.9);
    const A = shrink(a), B = shrink(b), C = shrink(c), th = .07;
    const g = new THREE.BufferGeometry(); const T = (v, k) => v.clone().addScaledVector(n, k).toArray();
    g.setAttribute('position', new THREE.Float32BufferAttribute([...T(A, th), ...T(B, th), ...T(C, th), ...T(A, -th), ...T(C, -th), ...T(B, -th),
      ...T(A, th), ...T(A, -th), ...T(B, th), ...T(B, th), ...T(A, -th), ...T(B, -th), ...T(B, th), ...T(B, -th), ...T(C, th), ...T(C, th), ...T(B, -th), ...T(C, -th), ...T(C, th), ...T(C, -th), ...T(A, th), ...T(A, th), ...T(C, -th), ...T(A, -th)], 3));
    g.computeVertexNormals();
    const mesh = new THREE.Mesh(g, glassMat);
    const edge = fatLines([...T(A, th), ...T(B, th), ...T(B, th), ...T(C, th), ...T(C, th), ...T(A, th)], f % 6 ? 0xF5F5F3 : 0x00FF8B, 1.1, .45); lineMats.push(edge.material);
    const holder = new THREE.Group(); holder.add(mesh, edge);
    const far = n.clone().multiplyScalar(4 + rnd() * 5).add(new THREE.Vector3((rnd() - .5) * 7, (rnd() - .5) * 5, (rnd() - .5) * 6));
    holder.userData = { home: cen, far, rot: new THREE.Euler(rnd() * 6, rnd() * 6, rnd() * 6), delay: rnd() * .35 };
    form.add(holder); pieces.push(holder);
  }
  const core = new THREE.Sprite(new THREE.SpriteMaterial({ map: softDot(), color: ACC, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0 })); core.scale.setScalar(3.2); form.add(core);
  const rim = new THREE.PointLight(0x00FF8B, 12, 0, 2); rim.position.set(-2.5, 2, 3); scene.add(rim);
  const rim2 = new THREE.PointLight(0xffffff, 5, 0, 2); rim2.position.set(3, 3, 2); scene.add(rim2);
  let w = 1, h = 1, intro = RM ? 1 : 0;
  const q = new THREE.Quaternion(), q0 = new THREE.Quaternion();
  return {
    resize() { [w, h] = sizeOf(canvas); r.setSize(w, h, false); comp.setSize(w, h); cam.aspect = w / h; cam.updateProjectionMatrix(); lineMats.forEach((m) => m.resolution.set(w, h)); form.scale.setScalar(MOB() ? .62 : 1); },
    render(t, p) {
      intro = Math.min(1, intro + (RM ? 1 : .01));
      // 0 → disperso · 1 → forma completa (avanza con el scroll de la sección)
      const asm = RM ? 1 : Math.min(1, Math.max(0, (p - .08) / (MOB() ? .3 : .4))) * intro;
      pieces.forEach((pc) => { const u = pc.userData, k = Math.min(1, Math.max(0, (asm - u.delay * .6) / (1 - u.delay * .6))), e = k * k * (3 - 2 * k);
        pc.position.lerpVectors(u.far, u.home, e).addScaledVector(u.home, Math.sin(t * 1.2 + u.delay * 20) * .015 * e);
        q0.setFromEuler(u.rot); q.identity(); pc.quaternion.copy(q0).slerp(q, e); });
      core.material.opacity = asm * (.08 + .03 * Math.sin(t * 2));
      form.rotation.set(.15 + mouse.y * .12, t * .15 + mouse.x * .35 - p * .8, 0);
      form.position.y = .7 + Math.sin(t * .6) * .07;
      floor.material.uniforms.uT.value = RM ? 0 : t; beam.material.uniforms.uT.value = t; glassMat.uniforms.uT.value = t;
      dust.rotation.y = t * .02;
      ca.uniforms.uT.value = t; ca.uniforms.uAmt.value = .002 + (1 - asm) * .003;
      cam.position.x = FX * .12 + mouse.x * .5; cam.position.y = 1.2 - mouse.y * .3 + (p - .5) * .7; cam.lookAt(FX * .12, .4, -3);
      comp.render();
    },
  };
}

/* =========================================================
   4 · MANIFIESTO · «Pensamos tu idea → la conectamos → le damos forma»
   Una sola nube de puntos: suelta (idea) → red (conexión) → superficie de una gema facetada (forma).
   ========================================================= */
function ideaScene(canvas) {
  const r = baseRenderer(canvas, { clear: 0x000000, alpha: 0 });
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(40, 1, .1, 80); cam.position.set(0, 0, 10);
  const host = canvas.closest('[data-scene-host]') || canvas.parentElement;
  const grp = new THREE.Group(); scene.add(grp);
  const N = MOB() ? 1500 : 2800;
  const A = new Float32Array(N * 3), B = new Float32Array(N * 3), C = new Float32Array(N * 3), D = new Float32Array(N * 3), S = new Float32Array(N);
  // C · forma: puntos sobre las caras de un icosaedro, cargados hacia las aristas para que se lean las facetas
  const ico = new THREE.IcosahedronGeometry(2.3, 1).toNonIndexed(), IP = ico.attributes.position, NF = IP.count / 3;
  const va = new THREE.Vector3(), vb = new THREE.Vector3(), vc = new THREE.Vector3(), q = new THREE.Vector3();
  // B · red: 26 nodos (ideas) y los puntos agrupados a su alrededor
  const HUB = Array.from({ length: 26 }, () => new THREE.Vector3((rnd() - .5) * 6.4, (rnd() - .5) * 3.6, (rnd() - .5) * 3));
  for (let i = 0; i < N; i++) {
    // A · idea suelta: nube amplia y tenue con un núcleo
    const g = () => (rnd() + rnd() + rnd() - 1.5) / 1.5; const core = rnd() < .18, s = core ? .5 : 3.2;
    A.set([g() * s * 1.8, g() * s, g() * s * .9], i * 3);
    const h = HUB[i % HUB.length], sp = i < HUB.length ? 0 : .22;
    B.set([h.x + g() * sp, h.y + g() * sp, h.z + g() * sp], i * 3);
    const f = Math.floor(rnd() * NF) * 3; va.fromBufferAttribute(IP, f); vb.fromBufferAttribute(IP, f + 1); vc.fromBufferAttribute(IP, f + 2);
    let u = rnd(), v = rnd(); if (u + v > 1) { u = 1 - u; v = 1 - v; }
    if (rnd() < .55) { const e = Math.floor(rnd() * 3), t = rnd(); const P = [va, vb, vc]; q.copy(P[e]).lerp(P[(e + 1) % 3], t); } else q.copy(va).addScaledVector(vb.clone().sub(va), u).addScaledVector(vc.clone().sub(va), v);
    C.set([q.x, q.y, q.z], i * 3); S[i] = rnd(); const out = 2.1 + Math.pow(rnd(), 1.6) * 3.2; D.set([q.x * out + (rnd() - .5) * .6, q.y * out * .8 + (rnd() - .5) * .6, q.z * out + (rnd() - .5) * .6], i * 3);
  }
  const MORPH = `attribute vec3 aA;attribute vec3 aB;attribute vec3 aC;attribute vec3 aD;attribute float aS;uniform float uP;uniform float uT;
    vec3 morph(){float m1=smoothstep(0.,1.,clamp(uP,0.,1.));float m2=smoothstep(0.,1.,clamp(uP-1.,0.,1.));float m3=smoothstep(0.,1.,clamp(uP-2.,0.,1.));
      vec3 a=aA+vec3(sin(uT*.3+aS*20.),cos(uT*.25+aS*13.),sin(uT*.2+aS*7.))*.22;vec3 b=aB+vec3(sin(uT*.7+aS*9.),cos(uT*.6+aS*5.),0.)*.04;
      vec3 d=aD+vec3(sin(uT*.2+aS*11.),cos(uT*.17+aS*7.),sin(uT*.15+aS*3.))*.3;return mix(mix(mix(a,b,m1),aC,m2),d,m3);}`;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(C.slice(), 3)); geo.setAttribute('aA', new THREE.BufferAttribute(A, 3)); geo.setAttribute('aB', new THREE.BufferAttribute(B, 3)); geo.setAttribute('aC', new THREE.BufferAttribute(C, 3)); geo.setAttribute('aD', new THREE.BufferAttribute(D, 3)); geo.setAttribute('aS', new THREE.BufferAttribute(S, 1));
  const pm = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uP: { value: 0 }, uT: { value: 0 }, uPx: { value: r.getPixelRatio() }, uO: { value: 0 }, uA: { value: ACC }, uB: { value: ACC_L } },
    vertexShader: `${MORPH}uniform float uPx;varying float vS;varying float vD;void main(){vec3 p=morph();vS=aS;vec4 mv=modelViewMatrix*vec4(p,1.);vD=-mv.z;
      gl_PointSize=(1.1+aS*2.0)*uPx*(10.0/vD);gl_Position=projectionMatrix*mv;}`,
    fragmentShader: `uniform float uO;uniform vec3 uA;uniform vec3 uB;varying float vS;varying float vD;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;
      gl_FragColor=vec4(mix(uB,uA,step(.95,vS)),(1.0-d*2.0)*(.32+vS*.4)*uO*clamp(1.4-vD/16.0,0.,1.));}` });
  grp.add(new THREE.Points(geo, pm));
  // conexiones de la red (se ven sobre todo en el paso 2)
  const pairs = [];
  for (let i = 0; i < HUB.length; i++) for (let k = i + 1; k < HUB.length; k++) if (HUB[i].distanceTo(HUB[k]) < 2.4) pairs.push([i, k]);
  for (let i = HUB.length; i < N && pairs.length < (MOB() ? 260 : 520); i += 7) pairs.push([i, i % HUB.length]);
  const L = pairs.length, lA = new Float32Array(L * 6), lB = new Float32Array(L * 6), lC = new Float32Array(L * 6), lD = new Float32Array(L * 6), lS = new Float32Array(L * 2);
  pairs.forEach(([a, b], k) => { [a, b].forEach((idx, e) => { lA.set(A.subarray(idx * 3, idx * 3 + 3), k * 6 + e * 3); lB.set(B.subarray(idx * 3, idx * 3 + 3), k * 6 + e * 3); lC.set(C.subarray(idx * 3, idx * 3 + 3), k * 6 + e * 3); lD.set(D.subarray(idx * 3, idx * 3 + 3), k * 6 + e * 3); lS[k * 2 + e] = S[idx]; }); });
  const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.BufferAttribute(lC.slice(), 3)); lg.setAttribute('aA', new THREE.BufferAttribute(lA, 3)); lg.setAttribute('aB', new THREE.BufferAttribute(lB, 3)); lg.setAttribute('aC', new THREE.BufferAttribute(lC, 3)); lg.setAttribute('aD', new THREE.BufferAttribute(lD, 3)); lg.setAttribute('aS', new THREE.BufferAttribute(lS, 1));
  const lm = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { uP: { value: 0 }, uT: { value: 0 }, uL: { value: 0 }, uA: { value: ACC } },
    vertexShader: `${MORPH}void main(){gl_Position=projectionMatrix*modelViewMatrix*vec4(morph(),1.);}`,
    fragmentShader: `uniform float uL;uniform vec3 uA;void main(){gl_FragColor=vec4(mix(vec3(.96,.96,.95),uA,.12),uL);}` });
  const lines = new THREE.LineSegments(lg, lm); grp.add(lines);
  // la forma: vidrio oscuro facetado + aristas (aparecen en el paso 3)
  const gem = new THREE.Mesh(new THREE.IcosahedronGeometry(2.28, 1), new THREE.ShaderMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide, uniforms: { uT: { value: 0 }, uO: { value: 0 } },
    vertexShader: `varying vec3 vN;varying vec3 vV;varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;vN=normalize(mat3(modelMatrix)*normal);vV=normalize(cameraPosition-w.xyz);gl_Position=projectionMatrix*viewMatrix*w;}`,
    fragmentShader: `${IRI}uniform float uT;uniform float uO;varying vec3 vN;varying vec3 vV;varying vec3 vW;void main(){vec3 n=normalize(vN);if(!gl_FrontFacing)n=-n;vec3 v=normalize(vV);
      float f=1.0-abs(dot(n,v));float l=max(dot(n,normalize(vec3(-.5,.8,.4))),0.);float sp=pow(max(dot(reflect(-v,n),normalize(vec3(-.4,.7,.6))),0.),24.);
      vec3 col=mix(vec3(.04,.04,.04),iri(f*1.1+vW.y*.12+uT*.04)*.6,clamp(f*.85+l*.18,0.,1.))*(.45+l*.55)+vec3(1.)*sp*.3;
      gl_FragColor=vec4(col,clamp(.36+f*.3+sp*.3,0.,1.)*uO);}` }));
  gem.geometry = gem.geometry.toNonIndexed(); gem.geometry.computeVertexNormals();   // sin esfera sólida: solo las partículas toman la forma
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.3, 1)), new THREE.LineBasicMaterial({ color: 0xF5F5F3, transparent: true, opacity: 0, depthWrite: false }));
  const seed = new THREE.Sprite(new THREE.SpriteMaterial({ map: softDot(), color: ACC, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0 })); seed.scale.setScalar(2.4); grp.add(seed);
  let w = 1, h = 1, intro = RM ? 1 : 0, lt = null;
  const ss = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  return {
    resize() { [w, h] = sizeOf(canvas); r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); const mob = w < 760; grp.position.set(mob ? 0 : w / h * 1.15, mob ? 1.15 : -.15, 0); grp.scale.setScalar(mob ? .6 : Math.min(.74, w / h / 2)); },
    render(t) {
      const dtt = lt == null ? 0 : Math.min(.5, t - lt); lt = t; intro = Math.min(1, intro + (RM ? 1 : dtt * .7)); const e = 1 - Math.pow(1 - intro, 3);
      const b = host.getBoundingClientRect(), k = RM ? 1 : Math.min(1, Math.max(0, -b.top / Math.max(1, b.height - innerHeight)));
      const P = ss(.1, .27, k) + ss(.37, .54, k) + ss(.66, .84, k);   // 0 idea · 1 red · 2 forma · 3 lanzamiento
      pm.uniforms.uP.value = lm.uniforms.uP.value = P; pm.uniforms.uT.value = lm.uniforms.uT.value = t; pm.uniforms.uO.value = e;
      const net = Math.max(0, 1 - Math.abs(P - 1) * 1.4);
      lm.uniforms.uL.value = (.22 * net) * e * (P > 1.6 ? Math.max(0, 1 - (P - 1.6) * 2.5) : 1);
      const launch = ss(2, 2.9, P), form = ss(1.55, 2, P) * (1 - launch * .8);
      gem.material.uniforms.uO.value = form * e; gem.material.uniforms.uT.value = t; edges.material.opacity = form * .38 * e;
      seed.material.opacity = Math.max(0, 1 - P * 1.6) * .35 * e; seed.scale.setScalar(2.2 + Math.sin(t * 1.6) * .2);
      grp.rotation.set(.18 + mouse.y * .12, t * .08 + mouse.x * .35 + k * 1.4, 0);
      gem.scale.setScalar(1 + launch * .35); edges.scale.setScalar(1 + launch * .35);
      cam.position.set(mouse.x * .4, -mouse.y * .25, 10 - ss(1.55, 2, P) * 1.2 + launch * 1.6); cam.lookAt(grp.position.x * .25, 0, 0);
      r.render(scene, cam);
    },
  };
}

/* =========================================================
   SERVICIOS · la ola de partículas (columnas que suben) que acompaña la lista de servicios.
   Al cambiar de servicio, la cámara recorre la ola y su altura cambia.
   ========================================================= */
function waveScene(canvas) {
  const { r, scene, cam, comp, ca, bloom } = darkBase(canvas, new THREE.FogExp2(0x000000, .034));
  cam.position.set(-2, 1.4, 11); bloom.strength = .26; bloom.threshold = .42;
  const clouds = risingClouds(scene, r, { count: MOB() ? 260 : 560, cols: true });
  let w = 1, h = 1, intro = RM ? 1 : 0, act = 0;
  return {
    resize() { [w, h] = sizeOf(canvas); r.setSize(w, h, false); comp.setSize(w, h); cam.aspect = w / h; cam.updateProjectionMatrix(); },
    render(t, p) {
      intro = Math.min(1, intro + (RM ? 1 : .012)); const e = 1 - Math.pow(1 - intro, 3);
      act += ((+canvas.dataset.active || 0) - act) * .035;
      clouds.update(RM ? 0 : t, e * (.8 + .2 * Math.sin(act * 1.7 + 1)));
      const cx = -4 + act * 2;
      cam.position.set(cx + mouse.x * .6, 1.5 - mouse.y * .3 + (p - .5) * 1.1, 11 - Math.sin(act * .9) * .8);
      cam.lookAt(cx * .7, -.2, -6);
      ca.uniforms.uT.value = t; ca.uniforms.uAmt.value = .002;
      comp.render();
    },
  };
}

const FACTORY = { net: netScene, field: fieldScene, core: brandScene, forma: rangeScene, idea: ideaScene, wave: waveScene };

/* =========================================================
   Montaje: cada canvas[data-scene] se crea al acercarse y solo se dibuja visible.
   ========================================================= */
export function mountScenes(root = document) {
  const list = [];
  root.querySelectorAll('canvas[data-scene]').forEach((cv) => {
    const item = { cv, inst: null, on: false, sec: cv.closest('[data-scene-host]') || cv.parentElement };
    const io = new IntersectionObserver(([en]) => {
      item.on = en.isIntersecting;
      if (item.on && !item.inst) {
        try { item.inst = FACTORY[cv.dataset.scene](cv); item.inst.resize(); }
        catch (err) { console.warn('WebGL no disponible', err); item.sec.classList.add('no-gl'); io.disconnect(); item.on = false; }
      }
    }, { rootMargin: '250px 0px' });
    io.observe(cv); list.push(item);
  });
  if (!list.length) return;
  addEventListener('resize', () => list.forEach((i) => i.inst && i.inst.resize()));
  const t0 = performance.now();
  const loop = () => {
    requestAnimationFrame(loop);
    if (document.hidden || document.documentElement.classList.contains('adp-on')) return;
    mouse.x += (mouse.tx - mouse.x) * .06; mouse.y += (mouse.ty - mouse.y) * .06;
    const t = (performance.now() - t0) / 1000;
    for (const it of list) {
      if (!it.on || !it.inst) continue;
      const b = it.sec.getBoundingClientRect();
      it.inst.render(RM ? 0 : t, Math.min(1, Math.max(0, (innerHeight - b.top) / (innerHeight + b.height))));
    }
  };
  loop();
}

/* =========================================================
   Páginas internas · «los puntos toman forma» (mismo lenguaje que la entrada)
   Miles de puntos sobre una retícula. Cada forma es un mapa de brillo: una imagen (semitono en relieve)
   o una figura de la marca (el isotipo, el punto). Entre formas los puntos fluyen en corrientes.
   El cursor empuja y levanta los puntos; un clic lanza una onda. uForm arma la forma de a poco (contacto).
   ========================================================= */
export function createDotForm(canvas, opts = {}) {
  const r = baseRenderer(canvas, { clear: 0x000000, alpha: 0, dpr: 2 });
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(40, 1, .1, 80);
  const narrow = () => innerWidth < 760;
  const GX = narrow() ? 120 : (opts.gx || 176), GY = Math.round(GX * (opts.ratio || .68)), N = GX * GY;
  const aUV = new Float32Array(N * 2), aLa = new Float32Array(N * 4), aLb = new Float32Array(N * 4), aNet = new Float32Array(N * 3), aR = new Float32Array(N * 4);
  for (let i = 0; i < N; i++) {
    const ix = i % GX, iy = Math.floor(i / GX);
    aUV[i * 2] = (ix + .5 + (rnd() - .5) * .3) / GX; aUV[i * 2 + 1] = 1 - (iy + .5 + (rnd() - .5) * .3) / GY;
    aNet.set([(rnd() - .5) * 14, (rnd() - .5) * 8, -5 + rnd() * 7], i * 3);
    aR.set([rnd(), rnd(), rnd(), rnd()], i * 4);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(aNet.slice(), 3)); geo.setAttribute('aUV', new THREE.BufferAttribute(aUV, 2));
  geo.setAttribute('aLa', new THREE.BufferAttribute(aLa, 4)); geo.setAttribute('aLb', new THREE.BufferAttribute(aLb, 4));
  geo.setAttribute('aNet', new THREE.BufferAttribute(aNet, 3)); geo.setAttribute('aR', new THREE.BufferAttribute(aR, 4));
  const U = {
    uT: { value: 0 }, uFrom: { value: -1 }, uTo: { value: -1 }, uMix: { value: 1 }, uPx: { value: r.getPixelRatio() }, uSc: { value: 1 }, uO: { value: 0 },
    uMouse: { value: new THREE.Vector3(99, 99, 0) }, uMOn: { value: 0 }, uRip: { value: new THREE.Vector4(0, 0, 0, -99) }, uForm: { value: 1 },
    uPl: { value: new THREE.Vector4() }, uSize: { value: new THREE.Vector2(6, 4) }, uAcc: { value: ACC }, uGreen: { value: opts.green ? 1 : 0 }, uDepth: { value: opts.depth ?? .8 }, uInk: { value: new THREE.Color(opts.ink || 0xEDEFED) }, uDS: { value: new THREE.Vector3(1, 1, 1) },
  };
  const mat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: U,
    vertexShader: `uniform float uT,uFrom,uTo,uMix,uPx,uSc,uO,uMOn,uForm,uGreen,uDepth;uniform vec3 uMouse,uDS;uniform vec4 uRip,uPl;uniform vec2 uSize;
      attribute vec2 aUV;attribute vec4 aLa;attribute vec4 aLb;attribute vec3 aNet;attribute vec4 aR;varying float vA;varying float vG;varying float vL;
      vec3 flowN(vec3 p,float t){return vec3(sin(p.y*.9+t*.7+aR.z*6.28)+sin(p.z*.6-t*.5),cos(p.x*.8-t*.6+aR.y*6.28)+sin(p.z*.7+t*.4),sin(p.x*.7+t*.5)+cos(p.y*.6-t*.3))*.5;}
      float lumOf(float s){if(s<.5)return aLa.x;if(s<1.5)return aLa.y;if(s<2.5)return aLa.z;if(s<3.5)return aLa.w;if(s<4.5)return aLb.x;if(s<5.5)return aLb.y;if(s<6.5)return aLb.z;return aLb.w;}
      void dust(out vec3 p,out float sz,out float lm,out float a,out float g){vec3 n=aNet*uDS;p=n+flowN(n,uT*.3)*.35;sz=.32+aR.x*.45;lm=.3;a=.45;g=0.;}
      void stateOf(float s,out vec3 p,out float sz,out float lm,out float a,out float g){
        if(s<-.5){dust(p,sz,lm,a,g);return;}
        float L=lumOf(s),keep,gm=0.;if(L>2.5){gm=1.;L-=2.;}
        vec2 e=abs(aUV-.5);float vig=smoothstep(.5,.4,e.x)*smoothstep(.5,.38,e.y);
        if(L>1.0005){L=L-1.001;keep=smoothstep(.15,.6,L);L=keep;}else{keep=vig;}
        vec2 q=(aUV-.5)*uSize;float z=(L-.45)*uDepth*keep;float c=cos(uPl.w),sn=sin(uPl.w);
        p=vec3(q.x*c+z*sn,q.y,-q.x*sn+z*c)+uPl.xyz+flowN(vec3(aUV*9.,aR.x*4.),uT*.3)*(1.-keep)*1.4;
        sz=(.2+pow(L,1.2)*1.05)*(.3+keep*.7);a=(.12+keep*.76)*(.62+L*.38);lm=L;g=max(uGreen,gm)*keep;
      }
      void main(){
        vec3 pA,pB;float sA,sB,lA,lB,gA,gB,aA,aB;
        stateOf(uFrom,pA,sA,lA,aA,gA);stateOf(uTo,pB,sB,lB,aB,gB);
        float k=clamp(uMix*1.7-aR.x*.7,0.,1.);k=k*k*(3.-2.*k);
        vec3 p=mix(pA,pB,k);float sz=mix(sA,sB,k),lm=mix(lA,lB,k),a=mix(aA,aB,k),g=mix(gA,gB,k);
        p+=flowN(p*.55+aR.xyz*3.,uT*.6)*sin(k*3.14159)*1.5;
        if(uForm<.999){vec3 dp;float ds,dl,da,dg;dust(dp,ds,dl,da,dg);float f=smoothstep(aR.y-.1,aR.y,uForm);
          p=mix(dp,p,f);sz=mix(ds,sz,f);lm=mix(dl,lm,f);a=mix(da,a,f);g=mix(dg,g,f);}
        p+=flowN(p*1.3,uT*.45)*.025;
        vec2 dm=p.xy-uMouse.xy;float fm=exp(-dot(dm,dm)/.45)*uMOn;p.xy+=normalize(dm+1e-4)*fm*.4;p.z+=fm*.8;
        float rt=uT-uRip.w;if(rt>0.&&rt<3.){float d=length(p.xy-uRip.xy)-rt*3.2;p.z+=sin(d*4.5)*exp(-d*d*1.2)*(1.-rt/3.)*.5;}
        vec4 mv=modelViewMatrix*vec4(p,1.);
        gl_PointSize=clamp(sz*uSc*uPx*(30./-mv.z),0.,16.*uPx);gl_Position=projectionMatrix*mv;
        vL=lm;vG=g;vA=uO*a*clamp(1.35-(-mv.z)/24.,0.,1.);}`,
    fragmentShader: `uniform vec3 uAcc;uniform vec3 uInk;varying float vA;varying float vG;varying float vL;
      void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(mix(uInk,uAcc,vG),smoothstep(.5,.28,d)*vA*(.5+vL*.5));}` });
  const pts = new THREE.Points(geo, mat); pts.frustumCulled = false; scene.add(pts);
  // formas: imágenes (brillo normalizado) o figuras dibujadas (se marcan con +1.001)
  const put = (k, L) => { const A = k < 4 ? aLa : aLb, c = k % 4; for (let i = 0; i < N; i++) A[i * 4 + c] = L[i]; geo.attributes[k < 4 ? 'aLa' : 'aLb'].needsUpdate = true; };
  const grab = (draw) => { const c = document.createElement('canvas'); c.width = GX; c.height = GY; const x = c.getContext('2d', { willReadFrequently: true }); draw(x, GX, GY); return x.getImageData(0, 0, GX, GY).data; };
  (opts.targets || []).slice(0, 8).forEach((tg, k) => {
    if (tg.shape) { const d = grab(tg.shape), L = new Float32Array(N); for (let i = 0; i < N; i++) L[i] = 1.001 + d[i * 4 + 3] / 255 + (d[i * 4 + 1] > 160 && d[i * 4] < 90 ? 2 : 0); put(k, L); return; }
    const im = new Image(); im.decoding = 'async';
    im.onload = () => {
      const d = grab((x) => { const s = Math.max(GX / im.naturalWidth, GY / im.naturalHeight), w = im.naturalWidth * s, h = im.naturalHeight * s; x.drawImage(im, (GX - w) / 2, (GY - h) / 2, w, h); });
      const L = new Float32Array(N); let lo = 1, hi = 0;
      for (let i = 0; i < N; i++) { const v = (d[i * 4] * .299 + d[i * 4 + 1] * .587 + d[i * 4 + 2] * .114) / 255; L[i] = v; lo = Math.min(lo, v); hi = Math.max(hi, v); }
      for (let i = 0; i < N; i++) L[i] = Math.pow((L[i] - lo) / Math.max(.05, hi - lo), 1.1);
      put(k, L);
    };
    im.src = tg.img;
  });
  let w = 1, h = 1, raf = 0, alive = true, on = true, last = performance.now(), mOn = 0, hover = false;
  const t0 = performance.now(), ray = new THREE.Raycaster(), nd = new THREE.Vector2(), plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), hit = new THREE.Vector3(), pv = new THREE.Vector3(), mm = { x: 0, y: 0 };
  const layout = () => {
    const hh = Math.tan(20 * Math.PI / 180) * 10, hw = hh * w / h;
    let IW, cx, cy;
    if (narrow() || opts.center) { IW = Math.min(hw * 1.8, hh * 1.9 / (GY / GX)); cx = 0; cy = opts.center ? 0 : hh * .38; }
    else { IW = Math.min(hw * (opts.wide || .92), hh * 1.6 / (GY / GX)); cx = hw * (opts.x ?? .42); cy = opts.y ?? .05; }
    U.uSize.value.set(IW, IW * GY / GX); U.uSc.value = .28 * (IW / GX) * (h / 2) / hh; if (opts.center) U.uDS.value.set(hw / 6, hh / 3.6, .5); U.uPl.value.set(cx, cy, 0, narrow() || opts.center ? 0 : (opts.rot ?? -.16));
  };
  const resize = () => { [w, h] = sizeOf(canvas); r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); layout(); };
  addEventListener('resize', resize); resize();
  // solo se dibuja cuando se ve
  const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on && !raf) frame(); }); io.observe(canvas);
  const onMove = (e) => { const b = canvas.getBoundingClientRect(); hover = e.clientX >= b.left && e.clientX <= b.right && e.clientY >= b.top && e.clientY <= b.bottom; mm.x = (e.clientX - b.left) / b.width * 2 - 1; mm.y = (e.clientY - b.top) / b.height * 2 - 1; };
  addEventListener('pointermove', onMove, { passive: true });
  const DUR = opts.dur || 1.4;
  function frame() {
    raf = 0; if (!alive || !on) return; raf = requestAnimationFrame(frame);
    const now = performance.now(), t = (now - t0) / 1000, dt = Math.min(.5, (now - last) / 1000); last = now;
    U.uT.value = t; U.uO.value = Math.min(1, t / 1.4);
    if (U.uMix.value < 1) U.uMix.value = Math.min(1, U.uMix.value + dt / DUR);
    cam.position.set(mm.x * .5 * (hover ? 1 : .3), .2 - mm.y * .3 * (hover ? 1 : .3), 10); cam.lookAt(0, 0, 0);
    nd.set(mm.x, -mm.y); ray.setFromCamera(nd, cam); if (ray.ray.intersectPlane(plane, hit)) U.uMouse.value.lerp(hit, .25);
    mOn += ((hover ? 1 : 0) - mOn) * .08; U.uMOn.value = mOn;
    r.render(scene, cam);
  }
  frame();
  let cur = -1;
  return {
    get index() { return cur; },
    get state() { return { from: U.uFrom.value, to: U.uTo.value, mix: U.uMix.value, size: U.uSize.value.toArray(), pl: U.uPl.value.toArray(), sc: U.uSc.value, form: U.uForm.value }; },
    go(k) { if (k === cur) return; U.uFrom.value = U.uMix.value < .55 ? U.uFrom.value : U.uTo.value; U.uTo.value = k; U.uMix.value = 0; cur = k; },
    form(v) { U.uForm.value = Math.max(0, Math.min(1, v)); },
    ripple(cx, cy) { const b = canvas.getBoundingClientRect(); nd.set((cx - b.left) / b.width * 2 - 1, -((cy - b.top) / b.height) * 2 + 1); ray.setFromCamera(nd, cam); if (ray.ray.intersectPlane(plane, hit)) U.uRip.value.set(hit.x, hit.y, 0, U.uT.value); },
    destroy() { alive = false; cancelAnimationFrame(raf); io.disconnect(); removeEventListener('resize', resize); removeEventListener('pointermove', onMove); r.dispose(); },
  };
}
