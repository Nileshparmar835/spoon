"""Compose a stereo underscore and place Foley at measured word onsets."""
import json,re,subprocess as sp,tempfile,wave
from pathlib import Path
import numpy as np
from edit import ROOT,timeline,read
RATE=24000
def write_wave(path,data):
    with wave.open(str(path),'wb') as f:
        f.setparams((2,2,RATE,0,'NONE',''))
        f.writeframes((np.clip(data,-.999,.999)*32767).astype('<i2').tobytes())
def pan(mono,pos):
    angle=(pos+1)*np.pi/4
    return mono[:,None]*np.array([np.cos(angle),np.sin(angle)])
def insert(dest,sound,sec):
    i=round(sec*RATE);n=min(len(sound),len(dest)-i)
    if n>0:dest[i:i+n]+=sound[:n]
def foley(kind,rng):
    t=np.arange(round(RATE*1.4))/RATE;noise=rng.normal(0,1,len(t))
    def tone(hz):return np.sin(2*np.pi*hz*t)
    if kind=='coin':return (tone(1568)+.45*tone(2487)+.18*tone(3440))*np.exp(-t*11)*.26
    if kind=='click':return (tone(1330)*np.exp(-t*130)+.45*noise*np.exp(-t*230))*.47
    if kind=='ping':return (tone(1760)+.5*tone(2637))*np.exp(-t*14)*np.minimum(1,t*300)*.22
    if kind=='tick':return sum((tone(2100)*np.exp(-np.maximum(t-d,0)*190)*(t>=d)) for d in (0,.5,1.0))*.28
    if kind=='splash':
        n=np.convolve(noise,np.ones(15)/np.sqrt(15),'same')
        return n*np.minimum(1,t*30)*np.exp(-t*5.5)*.2
    if kind=='low':return .40*tone(82.4)*np.exp(-t*4)
    if kind=='chime':return .33*(tone(587.33)+.35*tone(1174.7))*np.exp(-t*4)
    if kind in ('air','spark','cloth'):
        length={'air':65,'spark':7,'cloth':21}[kind]
        n=np.convolve(noise,np.ones(length)/np.sqrt(length),'same')
        return n*np.minimum(1,t*(11 if kind=='air' else 64))*np.exp(-t*(5 if kind=='air' else 16))*.18
    raise ValueError(f'Unknown Foley sound {kind}')
def main():
    edit=timeline();bmap={b['id']:b for b in edit['beats']};design=read(ROOT/'episode','sound.json')
    with wave.open(str(ROOT/'audio/narration.wav')) as f:
        voice=np.frombuffer(f.readframes(f.getnframes()),'<i2').astype(np.float32)/32768
    score=np.zeros((len(voice),2),np.float32);rng=np.random.default_rng(41)
    # Slow chamber chords, a sparse felt-key melody and a quiet bridge passage.
    chords=[[50,57,65],[46,53,62],[53,60,65],[48,55,64]]
    quiet_a=bmap[design['quiet_from']]['start'];quiet_b=bmap[design['quiet_until']]['start']
    for j,sec in enumerate(np.arange(0,edit['duration'],3.48)):
        notes=chords[j%len(chords)];t=np.arange(4.15*RATE)/RATE
        env=np.minimum(1,t/.62)*np.minimum(1,(4.15-t)/.86)
        for k,key in enumerate(notes):
            hz=440*2**((key-69)/12);osc=np.sin(2*np.pi*hz*t+.07*np.sin(t*2))+.13*np.sin(2*np.pi*hz*2*t)
            insert(score,pan(osc*env*.011,(k-1)*.48),sec)
        for k,delay in enumerate([.18,1.91]):
            hz=440*2**((notes[(k+j)%3]+12-69)/12)
            pluck=(np.sin(2*np.pi*hz*t)+.22*np.sin(2*np.pi*hz*2*t))*np.minimum(1,t*72)*np.exp(-t*2.8)
            insert(score,pan(pluck*.029,(k-.5)*.56),sec+delay)
    axis=np.arange(len(voice))/RATE
    v=np.interp(axis,[0,max(0,quiet_a-.3),quiet_a+.2,quiet_b-.5,quiet_b+.55,edit['duration']],[1,1,.23,.23,1,1])
    score*=v[:,None];score*=np.clip((edit['duration']-axis)/1.5,0,1)[:,None]
    # Speech envelope trims the bed by up to 4 dB during voiced syllables.
    blocks=np.arange(0,len(voice),480);peak=np.maximum.reduceat(np.abs(voice),blocks)
    duck=1-.38*np.interp(np.arange(len(voice)),blocks,np.clip(peak/.2,0,1))
    mix=score*duck[:,None]
    def clean(s):return re.sub(r'[^a-z0-9 ]','',s.lower())
    for scene,word,kind,gain,position in design['cues']:
        b=bmap[scene]
        hit=next((w for w in edit['words'] if b['start']-.001<=w['start']<b['speech_end'] and clean(w['text'])==clean(word)),None)
        if not hit:raise ValueError(f'Missing sound cue {scene}/{word}')
        insert(mix,pan(foley(kind,rng)*gain,position),hit['start'])
    mix+=voice[:,None]*.91
    with tempfile.TemporaryDirectory() as folder:
        raw=Path(folder)/'premix.wav';write_wave(raw,mix)
        base=['ffmpeg','-hide_banner','-nostats','-y','-i',str(raw),'-af']
        target='loudnorm=I=-15:TP=-1.8:LRA=9'
        p=sp.run(base+[target+':print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
        report=json.loads(p.stderr[p.stderr.rfind('{'):p.stderr.rfind('}')+1])
        keys={'measured_I':'input_i','measured_TP':'input_tp','measured_LRA':'input_lra','measured_thresh':'input_thresh','offset':'target_offset'}
        filt=target+''.join(':'+key+'='+report[value] for key,value in keys.items())+':linear=true'
        master=Path(folder)/'master.wav'
        sp.run(base+[filt,'-ar','48000','-c:a','pcm_s16le',str(master)],capture_output=True,check=True)
        # A very short, high-crest voice take can hit the peak ceiling before the
        # integrated target. Apply make-up gain with a look-ahead limiter there.
        check=sp.run(['ffmpeg','-hide_banner','-nostats','-i',str(master),'-af',target+':print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
        log=check.stderr
        achieved=float(json.loads(log[log.rfind('{'):log.rfind('}')+1])['input_i'])
        if achieved < -16.5:
            makeup=min(9,-15-achieved)
            limiter=f'volume={makeup:.2f}dB,alimiter=limit=0.81:level=false:latency=true'
            sp.run(['ffmpeg','-v','error','-y','-i',str(master),'-af',limiter,str(ROOT/'audio/mix.wav')],check=True)
        else:
            import shutil
            shutil.copyfile(master,ROOT/'audio/mix.wav')
if __name__=='__main__':main()
