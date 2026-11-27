"""Render the Three.js film in headless Chromium and encode with FFmpeg.
usage: render3d.py stills OUTDIR t1 t2 ...   |   render3d.py part FIRST END OUT.mp4"""
import base64,json,sys,subprocess as sp
from pathlib import Path
from playwright.sync_api import sync_playwright
sys.path.insert(0,str(Path(__file__).parent))
from edit import ROOT,timeline
font=base64.b64encode((ROOT/'node_modules/@fontsource/montserrat/files/montserrat-latin-900-normal.woff2').read_bytes()).decode()
page_html=ROOT/'output/page.html'
page_html.write_text("<!doctype html><meta charset=utf-8><style>@font-face{font-family:Mont;font-weight:900;src:url(data:font/woff2;base64,"+font+")}body{margin:0}</style><canvas id=out></canvas><script src=bundle.js></script>")
def run(pg,t):return base64.b64decode(pg.evaluate('frame(%f)'%t).split(',',1)[1])
with sync_playwright() as p:
    b=p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
    pg=b.new_page();errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.on('console',lambda m:m.type=='error' and print(m.text))
    pg.goto(page_html.as_uri())
    mode=sys.argv[1]
    pg.evaluate('a=>init(a[0],a[1])',[timeline(),.5 if mode=='stills' else 1])
    if mode=='stills':
        out=Path(sys.argv[2])
        for i,t in enumerate(sys.argv[3:]):(out/f's{i:02}.jpg').write_bytes(run(pg,float(t)))
    else:
        first,end=int(sys.argv[2]),int(sys.argv[3])
        enc=sp.Popen(['ffmpeg','-v','error','-y','-f','image2pipe','-c:v','mjpeg','-framerate','30','-i','pipe:0','-vf','scale=in_range=full:out_range=tv:out_color_matrix=bt709,format=yuv420p','-color_range','tv','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-c:v','libx264','-preset','medium','-crf','21','-threads','2',sys.argv[4]+'.tmp.mp4'],stdin=sp.PIPE)
        for n in range(first,end):
            enc.stdin.write(run(pg,n/30))
            if n%100==0:print(n,flush=True)
        enc.stdin.close();assert enc.wait()==0
        Path(sys.argv[4]+'.tmp.mp4').replace(sys.argv[4])
    assert not errors,errors
    b.close()
