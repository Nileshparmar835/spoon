"""One entry point for the video pipeline. Run with the project's .venv Python.

  python make.py voice      record narration from episode/script.json
  python make.py words      list word numbers and times (shots and sound cues use these)
  python make.py sound      music, effects and subtitles
  python make.py preview    one still per shot -> output/preview.jpg
  python make.py render     full 1080x1920 render, joined with sound, then verified
  python make.py render --resume   continue a stopped render (only if nothing was edited)
  python make.py all        script, voice, sound, preview, render
"""
import json, math, re, shutil, subprocess as sp, sys, wave
from pathlib import Path
ROOT = Path(__file__).resolve().parent
OUT = ROOT / 'output'
PY = sys.executable

def run(*cmd):
    sp.run([str(c) for c in cmd], cwd=ROOT, check=True)

def bundle():
    OUT.mkdir(exist_ok=True)
    npx = shutil.which('npx') or sys.exit('Node.js is missing.')
    run(npx, 'esbuild', 'src/main.js', '--bundle', '--outfile=output/bundle.js', '--log-level=warning')

def script():
    run(PY, 'episode/make_script.py')

def voice():
    run(PY, 'studio/voice.py', 'episode/script.json', 'audio')

def words():
    for i, w in enumerate(json.loads((ROOT / 'audio/words.json').read_text())):
        print(f"{i:4} {w['start']:7.2f}  {w['text']}")

def sound():
    run(PY, 'studio/mix.py')

def preview():
    from PIL import Image, ImageDraw
    bundle()
    sys.path.insert(0, str(ROOT / 'studio'))
    from edit import timeline
    e = timeline(); w = e['words']
    ids = [int(m) for m in re.findall(r'^ S\((\d+),', (ROOT / 'src/main.js').read_text(encoding='utf-8'), re.M)]
    starts = [0 if i == 0 else w[i]['start'] - .07 for i in ids] + [e['duration']]
    times = [a + (b - a) * .72 for a, b in zip(starts, starts[1:])]
    stills = OUT / 'stills'
    shutil.rmtree(stills, ignore_errors=True); stills.mkdir()
    run(PY, 'studio/render3d.py', 'stills', stills, *times)
    files = sorted(stills.glob('*.jpg'))
    sheet = Image.new('RGB', (324 * 5, 576 * math.ceil(len(files) / 5)))
    for i, f in enumerate(files):
        xy = ((i % 5) * 324, (i // 5) * 576)
        sheet.paste(Image.open(f).resize((324, 576)), xy)
        ImageDraw.Draw(sheet).text((xy[0] + 6, xy[1] + 6), f'shot {i}: {times[i]:.1f}s', fill='black')
    sheet.save(OUT / 'preview.jpg', quality=88)
    print('Open', OUT / 'preview.jpg')

def render(resume=False):
    bundle(); sound()
    with wave.open(str(ROOT / 'audio/narration.wav')) as f:
        frames = math.ceil(f.getnframes() / f.getframerate() * 30)
    parts = OUT / 'parts'
    if not resume:
        shutil.rmtree(parts, ignore_errors=True)
    parts.mkdir(exist_ok=True)
    names = []
    for n, first in enumerate(range(0, frames, 250)):
        target = parts / f'part{n:03}.mp4'; names.append(target)
        if not target.exists():
            run(PY, 'studio/render3d.py', 'part', first, min(frames, first + 250), target)
    listing = parts / 'list.txt'
    listing.write_text(''.join(f"file '{p.name}'\n" for p in names))
    stem = json.loads((ROOT / 'episode/film.json').read_text())['file_stem']
    run('ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', listing, '-i', 'audio/mix.wav',
        '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000',
        '-movflags', '+faststart', OUT / (stem + '.mp4'))
    run(PY, 'studio/verify.py')
    print('Finished:', OUT / (stem + '.mp4'))

if __name__ == '__main__':
    command = sys.argv[1] if len(sys.argv) > 1 else ''
    if command == 'render':
        render('--resume' in sys.argv)
    elif command == 'all':
        script(); voice(); sound(); preview(); render()
    elif command in ('script', 'voice', 'words', 'sound', 'preview'):
        globals()[command]()
    else:
        print(__doc__)
