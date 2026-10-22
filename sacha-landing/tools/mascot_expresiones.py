from PIL import Image, ImageDraw, ImageFilter
import numpy as np, math
import scipy.ndimage as ndi

def fill_region(im, mask):
    """rellena la máscara con el color del pelaje cercano (convolución normalizada)"""
    arr=np.array(im.convert('RGB')).astype(float)
    m=(np.array(mask)>20)
    ring=ndi.binary_dilation(m,iterations=18)&~m
    # solo pelaje claro/medio (evita manchas oscuras)
    lum=arr.mean(axis=2)
    ok=ring&(lum>110)
    out=arr.copy()
    num=np.zeros_like(arr);den=np.zeros(arr.shape[:2])
    for s in (6,14,28):
        w=ok.astype(float)
        for c in range(3): num[...,c]+=ndi.gaussian_filter(arr[...,c]*w,s)
        den+=ndi.gaussian_filter(w,s)
    fill=num/np.maximum(den[...,None],1e-6)
    soft=np.array(mask.filter(ImageFilter.GaussianBlur(6))).astype(float)/255
    rng=np.random.default_rng(3);grain=ndi.gaussian_filter(rng.normal(0,1,arr.shape[:2]),1.1)*9
    fill=fill+grain[...,None]
    out=arr*(1-soft[...,None])+fill*soft[...,None]
    return Image.fromarray(out.clip(0,255).astype('uint8'))

def lid(draw,cx,cy,w,kind,S,col=(66,36,16),lw=7):
    """dibuja un párpado cerrado como arco con pestañas, en coordenadas × S"""
    pts=[]
    for i in range(41):
        t=i/40;x=cx+(t-.5)*w
        if kind=='up':   y=cy-math.sin(t*math.pi)*w*.30
        elif kind=='down': y=cy+math.sin(t*math.pi)*w*.20
        else: y=cy
        pts.append((x*S,y*S))
    # grosor variable: más fino en las puntas
    for i in range(len(pts)-1):
        t=i/len(pts);th=lw*S*(0.45+0.55*math.sin(t*math.pi))
        draw.line([pts[i],pts[i+1]],fill=col+(255,),width=int(th))
    for p in (pts[0],pts[-1]):
        draw.ellipse([p[0]-lw*S*.25,p[1]-lw*S*.25,p[0]+lw*S*.25,p[1]+lw*S*.25],fill=col+(255,))
    # pestañas hacia afuera
    ex=pts[0 if cx<278 else -1];sgn=-1 if cx<278 else 1
    for a in (-0.25,0.15,0.55):
        x0,y0=ex;ang=a+(math.pi if sgn<0 else 0)
        draw.line([(x0,y0),(x0+math.cos(ang)*lw*S*2.2,y0+math.sin(ang)*lw*S*2.2-lw*S*.4)],fill=col+(255,),width=int(lw*S*.35))

def make(src,out,eyes=('up','up'),centers=((187,257),(370,257)),erase=((47,38),(47,38))):
    im=Image.open(src).convert('RGBA');alpha=im.getchannel('A')
    S=4
    mask=Image.new('L',im.size,0);md=ImageDraw.Draw(mask)
    for (cx,cy),(rx,ry),k in zip(centers,erase,eyes):
        if k!='open':md.ellipse([cx-rx,cy-ry,cx+rx,cy+ry],fill=255)
    rgb=fill_region(im,mask)
    big=rgb.resize((im.size[0]*S,im.size[1]*S),Image.LANCZOS).convert('RGBA')
    d=ImageDraw.Draw(big)
    for (cx,cy),k in zip(centers,eyes):
        if k!='open':lid(d,cx,cy+(10 if k=='up' else -4),78,k,S)
    res=big.resize(im.size,Image.LANCZOS).convert('RGB')
    res=res.convert('RGBA');res.putalpha(alpha);res.save(out)
if __name__=='__main__':
    make('cut/frente.png','mood_feliz.png',('up','up'))
    make('cut/frente.png','mood_dormida.png',('down','down'))
    make('cut/frente.png','mood_guino.png',('open','up'))
    ims=[Image.open(f).crop((0,60,555,520)) for f in ('cut/frente.png','mood_feliz.png','mood_dormida.png','mood_guino.png')]
    sheet=Image.new('RGBA',(555*4,460),(244,239,230,255))
    for i,f in enumerate(ims): sheet.alpha_composite(f,(i*555,0))
    sheet.convert('RGB').save('moods_face_test.png')
