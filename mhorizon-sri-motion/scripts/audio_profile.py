import numpy as np,subprocess,sys
raw=subprocess.run(['ffmpeg','-v','error','-i',sys.argv[1],'-ac','1','-ar','48000','-f','f32le','-'],capture_output=True).stdout
x=np.frombuffer(raw,dtype=np.float32); sr=48000
out=[]
for s in range(0,int(len(x)/sr)+1):
    seg=x[s*sr:(s+1)*sr]
    if len(seg)==0: continue
    out.append("%d:%.0f/%.0f"%(s,20*np.log10(np.abs(seg).max()+1e-9),20*np.log10(np.sqrt((seg**2).mean())+1e-9)))
print(" ".join(out))
