"""Stream deterministic 30 fps artwork to FFmpeg. Requires Node and FFmpeg."""
import argparse,json,math,subprocess as sp
from edit import ROOT,timeline,film_config
def render(width,poster=None):
    edit=timeline()
    out=ROOT/'output';out.mkdir(exist_ok=True)
    (out/'edit.json').write_text(json.dumps(edit),encoding='utf-8')
    (out/'edit-data.js').write_text('window.episodeData='+json.dumps(edit)+';',encoding='utf-8')
    node=['node',str(ROOT/'studio/frames.cjs'),str(width)]
    if poster is not None:
        n=round(poster*30)
        with (out/'frame.jpg').open('wb') as f:sp.run(node+[str(n),str(n+1)],stdout=f,check=True)
        return
    tmp=out/'film.partial.mp4';target=out/(film_config()['file_stem']+'.mp4')
    args=['ffmpeg','-hide_banner','-loglevel','error','-y','-f','image2pipe','-c:v','mjpeg','-framerate','30','-i','pipe:0','-i',str(ROOT/'audio/mix.wav'),'-map','0:v:0','-map','1:a:0','-vf','scale=in_range=full:out_range=tv:out_color_matrix=bt709,format=yuv420p','-color_range','tv','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-c:v','libx264','-preset','veryfast','-threads','3','-crf','17','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-ar','48000','-movflags','+faststart',str(tmp)]
    proc=sp.Popen(args,stdin=sp.PIPE);count=math.ceil(edit['duration']*30)
    try:
        for first in range(0,count,150):
            sp.run(node+[str(first),str(min(count,first+150))],stdout=proc.stdin,check=True)
            print(f'{min(count,first+150)}/{count} frames',flush=True)
        proc.stdin.close()
        if proc.wait():raise RuntimeError('FFmpeg failed')
        tmp.replace(target)
    finally:
        if proc.poll() is None:proc.kill();proc.wait()
        tmp.unlink(missing_ok=True)
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--width',type=int,choices=[360,720,1080],default=720);p.add_argument('--poster',type=float)
    args=p.parse_args();render(args.width,args.poster)
