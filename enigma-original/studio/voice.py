"""Synthesize connected English thoughts and obtain caption timings from the same model pass."""
import argparse
import json
import tempfile
import wave
from pathlib import Path
import numpy as np
import onnxruntime as ort
from kokoro_onnx import Kokoro
from kokoro_onnx.sliding import token_edges
from duration_graph import timing_model

ROOT=Path(__file__).resolve().parents[1]
SR=24000
VOICE='am_michael'

def render_take(engine,session,row):
    spoken=row['spoken']
    phones=engine.tokenizer.phonemize(spoken,'en-us')
    groups=phones.split()
    labels=row.get('labels',spoken.split())
    if len(labels)!=len(groups):
        raise ValueError(f"Scene {row['id']}: supply one labels entry per phoneme group. {groups}")
    tokens=engine.tokenizer.tokenize(phones)
    if not tokens or len(tokens)>500:
        raise ValueError(f"Scene {row['id']}: split into short, connected thoughts.")
    key=engine._tokens_input
    args={
        key:np.array([[0,*tokens,0]],dtype=engine._input_dtypes[key]),
        'style':engine._style_for(engine.get_voice_style(VOICE),len(tokens)),
        'speed':np.array([row.get('speed',1.0)],dtype=engine._input_dtypes['speed'])
    }
    raw,durations=session.run(None,args)
    samples=raw.ravel()
    edges=token_edges(durations.ravel(),len(samples))[1:]
    active=np.flatnonzero(abs(samples)>.003)
    if not len(active):
        raise ValueError(f'Silent take for {spoken!r}')
    lo=max(0,active[0]-650)
    hi=min(len(samples),active[-1]+1200)
    samples=samples[lo:hi].copy()
    samples[:72]*=np.linspace(0,1,72)
    samples[-72:]*=np.linspace(1,0,72)
    marks=[]
    i=0
    for label,group in zip(labels,groups):
        j=i+len(engine.tokenizer.tokenize(group))
        start=float(np.clip(edges[i]-lo,0,len(samples)))/SR
        end=float(np.clip(edges[j]-lo,0,len(samples)))/SR
        marks.append({'text':label,'start':start,'end':end})
        i=j+1
    return samples,marks

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('phrases',type=Path)
    ap.add_argument('folder',type=Path)
    args=ap.parse_args()
    rows=json.loads(args.phrases.read_text(encoding='utf-8'))
    pieces,words,beats=[],[],[]
    n=0
    opts=ort.SessionOptions()
    opts.intra_op_num_threads=3
    opts.inter_op_num_threads=1
    ort.disable_telemetry_events()
    with tempfile.TemporaryDirectory() as tmp:
        timed=Path(tmp)/'timed.onnx'
        timing_model(ROOT/'models/kokoro-v1.0.int8.onnx',timed)
        session=ort.InferenceSession(str(timed),sess_options=opts,providers=['CPUExecutionProvider'])
        engine=Kokoro.from_session(session,str(ROOT/'models/english-voice.bin'))
        for row in rows:
            y,marks=render_take(engine,session,row)
            beats.append(dict(id=row['id'],start=round(n/SR,5),speech_end=round((n+len(y))/SR,5),text=row['spoken']))
            words.extend(dict(text=m['text'],start=round(m['start']+n/SR,4),end=round(m['end']+n/SR,4)) for m in marks)
            pause=np.zeros(round(SR*row.get('pause',.22)),np.float32)
            pieces.extend([y,pause])
            n+=len(y)+len(pause)
    track=np.concatenate(pieces)
    track*=.86/max(.001,np.abs(track).max())
    args.folder.mkdir(parents=True,exist_ok=True)
    with wave.open(str(args.folder/'narration.wav'),'wb') as wav:
        wav.setparams((1,2,SR,0,'NONE',''))
        wav.writeframes((track*32767).astype('<i2').tobytes())
    for name,data in [('words',words),('beats',beats)]:
        (args.folder/(name+'.json')).write_text(json.dumps(data,indent=2),encoding='utf-8')
    print(f'{n/SR:.2f} s, {len(words)} timed captions')
if __name__=='__main__':
    main()
