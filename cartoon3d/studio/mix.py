"""Original upbeat score and sound effects, all synthesized here, ducked under the narration."""
import json,wave,subprocess as sp
import numpy as np
from edit import ROOT,timeline,film_config
SR=48000
(ROOT/'output').mkdir(exist_ok=True)
e=timeline();W=e['words'];DUR=e['duration'];N=int(DUR*SR)
rng=np.random.default_rng(7)
music=np.zeros((N,2));fx=np.zeros((N,2))
def add(bus,at,y,gain=1.0,pan=0.0):
    i=int(max(0,at)*SR);y=y[:max(0,N-i)]
    bus[i:i+len(y),0]+=y*gain*np.sqrt((1-pan)/2);bus[i:i+len(y),1]+=y*gain*np.sqrt((1+pan)/2)
def tt(d):return np.arange(int(d*SR))/SR
def sine(f,t):return np.sin(2*np.pi*f*t)
def noise(t,k=1):return np.convolve(rng.standard_normal(len(t)),np.ones(k)/k,'same')
def pluck(f,d=.35):t=tt(d);return (sine(f,t)+.35*sine(2*f,t)*np.exp(-t*14)+.12*sine(4*f,t)*np.exp(-t*30))*np.exp(-t*11)*np.minimum(1,t*500)
def bass(f):t=tt(.4);return (sine(f,t)+.3*sine(2*f,t))*np.exp(-t*7)*np.minimum(1,t*200)
def kick():t=tt(.25);return np.sin(2*np.pi*(48*t+55*(1-np.exp(-t*35))/35))*np.exp(-t*17)
def hat():t=tt(.07);n=rng.standard_normal(len(t));return np.diff(n,prepend=0)*np.exp(-t*70)*.5
def clap():t=tt(.14);return np.diff(noise(t,3),prepend=0)*np.exp(-t*32)*1.4
hz=lambda m:440*2**((m-69)/12)
free=W[55]['start'];flip=W[63]['start'];effect=W[73]['start'];ask=W[111]['start']
beat=60/112;chords=[(45,[69,72,76]),(41,[69,72,77]),(48,[67,72,76]),(43,[67,71,74])]
k=0;at=0.0
while at<DUR-.3:
    root,notes=chords[(k//4)%4]
    # the beat stops just before the price reveal, and thins out for the closing question
    hush=free-1.15<at<free+.55;calm=effect-.2<at<effect+3.8 or at>ask-.1
    if not hush:
        add(music,at,pluck(hz(notes[k%3]+12)),.16,.35 if k%2 else -.35)
        add(music,at+beat/2,pluck(hz(notes[(k+1)%3])),.12,-.25)
        if k%2==0:add(music,at,bass(hz(root)),.34)
        else:add(music,at+beat/2,bass(hz(root+7)),.18)
        if not calm:
            add(music,at,kick(),.38 if k%2==0 else .22)
            add(music,at+beat/2,hat(),.11,.4)
            if k%2:add(music,at,clap(),.07)
    k+=1;at+=beat
def whoosh():t=tt(.3);return noise(t,9)*np.sin(np.pi*t/.3)**3*.9
def pop():t=tt(.16);return np.sin(2*np.pi*(420*t+1800*t*t))*np.exp(-t*24)*np.minimum(1,t*400)
def coin():t=tt(.55);return (sine(1975,t)*(t<.07)+sine(2637,t)*(t>=.07))*np.exp(-t*7)*.6
def ding():t=tt(1.3);return sum(sine(f,t)*a for f,a in [(1047,1),(1568,.7),(2093,.5),(3136,.25)])*np.exp(-t*3.4)*.45
def boom():t=tt(.9);return np.sin(2*np.pi*(38*t+40*(1-np.exp(-t*12))/12))*np.exp(-t*4.5)+noise(t,40)*np.exp(-t*12)*.5
def riser():t=tt(1.0);return (noise(t,5)*.5+np.sin(2*np.pi*(250*t+330*t*t))*.2)*(t/1.0)**2.4
def tick():t=tt(.05);return sine(2300,t)*np.exp(-t*120)
def gasp():t=tt(.4);return noise(t,14)*np.sin(np.pi*np.minimum(1,t/.4))**2
for i in [3,10,15,26,33,40,42,63,73,85,91,97,103,107,111]:add(fx,W[i]['start']-.2,whoosh(),.11,.2 if i%2 else -.2)
for i in [10,38,69,75]:add(fx,W[i]['start'],pop(),.3)
for i in [24,31,51]:add(fx,W[i]['start'],coin(),.3,.15)
add(fx,free-.98,riser(),.2);add(fx,free,ding(),.42);add(fx,free,boom(),.5)
add(fx,W[56]['start']-.05,gasp(),.3);add(fx,flip,boom(),.35);add(fx,effect+.25,boom(),.45)
for j in range(10):add(fx,W[99]['start']+j*.1,pop(),.15,rng.uniform(-.4,.4))
add(fx,W[105]['start'],ding(),.18);add(fx,W[108]['start'],pop(),.3);add(fx,W[110]['start'],pop(),.3)
for j in range(6):add(fx,W[120]['start']-.9+j*.16,tick(),.16)
with wave.open(str(ROOT/'audio/narration.wav')) as f:sr=f.getframerate();v=np.frombuffer(f.readframes(f.getnframes()),'<i2')/32768
v=np.interp(np.arange(N)/SR,np.arange(len(v))/sr,v,right=0)
level=np.sqrt(np.convolve(v**2,np.ones(2400)/2400,'same'))
# hold the music down briefly after each sound so soft word endings stay clear
speaking=np.clip(level/.03,0,1);hold=int(.28*SR);held=speaking.copy()
for shift in range(hold//24,hold+1,hold//24):held[shift:]=np.maximum(held[shift:],speaking[:-shift])
duck=1-.72*held;duck=np.convolve(duck,np.ones(7200)/7200,'same')
# drop the music almost out under "chocolate stall", which it otherwise masks
clock=np.arange(N)/SR
duck*=1-.9*np.clip(np.minimum((clock-(W[17]['start']-.2))/.2,(W[19]['end']+.45-clock)/.3),0,1)
fade=np.clip((DUR-np.arange(N)/SR)/1.0,0,1)
mix=(v[:,None]*1.0+(music*.45*duck[:,None]+fx*.75)*fade[:,None])
mix=np.tanh(mix*1.05)/1.05;mix*=.9/np.abs(mix).max()
raw=ROOT/'audio/raw.wav'
with wave.open(str(raw),'wb') as f:f.setparams((2,2,SR,0,'NONE',''));f.writeframes((mix*32767).astype('<i2').tobytes())
sp.run(['ffmpeg','-v','error','-y','-i',str(raw),'-af','loudnorm=I=-16:TP=-1.5:LRA=7','-ar','48000',str(ROOT/'audio/mix.wav')],check=True)
raw.unlink()
def stamp(s):ms=round(s*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
subs=[];cur=[]
for i,w in enumerate(W):
    cur.append(w);nxt=W[i+1] if i+1<len(W) else None
    if not nxt or w['text'][-1] in '.!?,:' or len(cur)>=7 or nxt['start']-w['end']>.2:
        subs.append(dict(start=cur[0]['start'],end=w['end'],text=' '.join(x['text'] for x in cur).replace('M I T','MIT')));cur=[]
(ROOT/'output'/(film_config()['file_stem']+'.srt')).write_text(''.join(f"{i}\n{stamp(p['start'])} --> {stamp(p['end'])}\n{p['text']}\n\n" for i,p in enumerate(subs,1)))
print('mixed',round(DUR,2),'s')
