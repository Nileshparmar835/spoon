"""Verify the delivery file and produce an editable caption sidecar."""
import json,math,subprocess as sp
from edit import ROOT,film_config,timeline
def timestamp(seconds):
    n=round(seconds*1000)
    h,n=divmod(n,3600000);m,n=divmod(n,60000);s,ms=divmod(n,1000)
    return f'{h:02}:{m:02}:{s:02},{ms:03}'
def main():
    edit=timeline();cfg=film_config();out=ROOT/'output';path=out/(cfg['file_stem']+'.mp4')
    probe=json.loads(sp.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(path)]))
    v=next(s for s in probe['streams'] if s['codec_type']=='video');a=next(s for s in probe['streams'] if s['codec_type']=='audio')
    if (v['codec_name'],v['pix_fmt'],v['r_frame_rate'],a['codec_name'],int(a['sample_rate']),a['channels'])!=('h264','yuv420p','30/1','aac',48000,2):raise ValueError('Unexpected output codec or track format')
    if v['width']*16!=v['height']*9 or int(v['nb_frames'])!=math.ceil(edit['duration']*30):raise ValueError('Frame size or count differs from the timeline')
    if abs(float(v['duration'])-float(a['duration']))>.05:raise ValueError('Picture and audio lengths differ by over 50 ms')
    words=edit['words']
    if any(w['end']<=w['start'] or w['end']>edit['duration']+.001 for w in words) or any(b['start']<a['end']-.001 for a,b in zip(words,words[1:])):raise ValueError('Caption times overlap or exceed the track')
    # Decode both streams all the way through and measure the final AAC.
    run=sp.run(['ffmpeg','-hide_banner','-nostats','-xerror','-i',str(path),'-af','loudnorm=print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
    s=run.stderr;audio=json.loads(s[s.rfind('{'):s.rfind('}')+1])
    if not -17<=float(audio['input_i'])<=-13 or float(audio['input_tp'])>-.5:raise ValueError(f'Check final levels: {audio}')
    captions='\n\n'.join(f"{i}\n{timestamp(b['start'])} --> {timestamp(b['speech_end'])}\n{b['text']}" for i,b in enumerate(edit['beats'],1))
    (out/(cfg['file_stem']+'.srt')).write_text(captions+'\n',encoding='utf-8')
    results=dict(title=cfg['title'],duration_seconds=float(v['duration']),width=v['width'],height=v['height'],fps=30,frames=int(v['nb_frames']),scenes=len(edit['beats']),timed_captions=len(words),soundtrack_lufs=float(audio['input_i']),true_peak_dbtp=float(audio['input_tp']),audio_seconds=float(a['duration']))
    (out/'quality.json').write_text(json.dumps(results,indent=2),encoding='utf-8')
    print(json.dumps(results,indent=2))
if __name__=='__main__':main()
