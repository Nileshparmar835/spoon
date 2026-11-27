"""Build the shared picture/sound timeline from the measured narration."""
import json,wave
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def read(folder,name):
    return json.loads((folder/name).read_text(encoding='utf-8'))
def timeline():
    rows=read(ROOT/'episode','script.json')
    beats=read(ROOT/'audio','beats.json'); words=read(ROOT/'audio','words.json')
    if [(r['id'],r['spoken']) for r in rows]!=[(b['id'],b['text']) for b in beats]:
        raise ValueError('Regenerate the voice for the edited script before rendering.')
    if len(set(r['id'] for r in rows))!=len(rows):raise ValueError('Scene IDs must be unique.')
    for b,r in zip(beats,rows):b['accent']=r.get('accent','')
    with wave.open(str(ROOT/'audio/narration.wav')) as f:
        duration=f.getnframes()/f.getframerate()
        raw=f.readframes(f.getnframes());sr=f.getframerate()
    import array,math
    pcm=array.array('h',raw);hop=sr//30
    env=[math.sqrt(sum(v*v for v in pcm[i:i+hop])/max(1,len(pcm[i:i+hop])))/32768 for i in range(0,len(pcm),hop)]
    top=sorted(env)[int(len(env)*.95)] or 1
    return dict(duration=duration,beats=beats,words=words,mouth=[round(min(1,v/top),3) for v in env])

def film_config():
    import re
    data=read(ROOT/'episode','film.json')
    if not re.fullmatch(r'[A-Za-z0-9_-]+',data['file_stem']):
        raise ValueError('Choose a filename with letters, digits, hyphens or underscores.')
    return data
