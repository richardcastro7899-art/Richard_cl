# Verificación de contenido de audio: ¿el MP4 contiene solo la pista de efectos (y ninguna voz)?
# Compara espectros (insensibles a fase/retardo del codec AAC) del MP4 contra la pista WAV de efectos,
# y mide la correlación con la envolvente de la locución de referencia.
import numpy as np,subprocess,sys
def dec(p):
    raw=subprocess.run(['ffmpeg','-v','error','-i',p,'-ac','1','-ar','48000','-f','f32le','-'],capture_output=True).stdout
    return np.frombuffer(raw,dtype=np.float32)
mp4=dec(sys.argv[1]); wav=dec(sys.argv[2]); n=min(len(mp4),len(wav)); mp4=mp4[:n]; wav=wav[:n]
voice=dec(sys.argv[3])[:n] if len(sys.argv)>3 else None
N=4096; H=2048; win=np.hanning(N)
def bands(x):
    out=[]
    for i in range(0,len(x)-N,H):
        s=np.abs(np.fft.rfft(x[i:i+N]*win))**2
        f=np.fft.rfftfreq(N,1/48000)
        out.append([s[(f>=lo)&(f<hi)].sum() for lo,hi in [(80,250),(250,1000),(1000,4000),(4000,10000)]])
    return 10*np.log10(np.array(out)+1e-12)
A=bands(mp4); B=bands(wav)
act=(B.max(axis=1)>-30)|(A.max(axis=1)>-30)
d=(A-B)[act]
print("ventanas activas:",act.sum())
for k,name in enumerate(["80-250 Hz","250-1k","1-4k (voz)","4-10k"]):
    print("  banda %-11s dif. mediana %.2f dB | p95 |dif| %.2f dB | máx exceso MP4 %.2f dB"%(name,np.median(d[:,k]),np.percentile(np.abs(d[:,k]),95),d[:,k].max()))
print("RMS global MP4 %.1f dBFS | WAV %.1f dBFS | pico MP4 %.2f dBFS | pico WAV %.2f dBFS"%(
  20*np.log10(np.sqrt((mp4**2).mean())),20*np.log10(np.sqrt((wav**2).mean())),20*np.log10(np.abs(mp4).max()),20*np.log10(np.abs(wav).max())))
if voice is not None:
    V=bands(voice)[:,2]  # banda de voz
    c=lambda x: float(np.corrcoef(x[:,2],V[:len(x)])[0,1])
    print("correlación de la banda 1-4k con la locución: MP4 %.2f | WAV (referencia de efectos) %.2f"%(c(A),c(B)))
if len(sys.argv)>4:
    D=(A-B)
    for k in (0,3):
        idx=np.argsort(-D[:,k])[:6]
        print("peores ventanas banda",k,[ (round(i*H/48000,3), round(float(A[i,k]),1), round(float(B[i,k]),1)) for i in idx])
