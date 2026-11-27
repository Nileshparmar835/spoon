"""Command-line entry point. Run from the project directory."""
import argparse,json,os,re,shutil,subprocess as sp,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parent
def run(script,*args):
    sp.run([sys.executable,str(ROOT/'studio'/script),*map(str,args)],cwd=ROOT,check=True)
def new(slug):
    if not re.fullmatch(r'[a-z0-9]+(-[a-z0-9]+)*',slug):raise SystemExit('Use a lowercase slug, e.g. the-empty-chair.')
    target=ROOT/'runs'/slug
    target.mkdir(parents=True,exist_ok=False)
    for folder in ['studio','art','episode']:
        shutil.copytree(ROOT/folder,target/folder,ignore=shutil.ignore_patterns('__pycache__'))
    for name in ['studio.py','CLAUDE.md']:
        shutil.copy2(ROOT/name,target/name)
    (target/'models').mkdir()
    for src in (ROOT/'models').iterdir():
        if not src.is_file():continue
        try:os.link(src,target/'models'/src.name)
        except OSError:shutil.copy2(src,target/'models'/src.name)
    for folder in ['audio','docs','output']:(target/folder).mkdir()
    reference=ROOT/'docs/Reference_Analysis.pdf'
    if reference.is_file():shutil.copy2(reference,target/'docs'/reference.name)
    (target/'episode/film.json').write_text(json.dumps(dict(title=slug.replace('-',' ').title(),file_stem=slug,width=720),indent=2))
    print(target)
def main():
    p=argparse.ArgumentParser(description=__doc__);sub=p.add_subparsers(dest='command',required=True)
    for name in ['build','voice','mix','render','verify']:sub.add_parser(name)
    sub.add_parser('new').add_argument('slug')
    args=p.parse_args()
    if args.command=='new':new(args.slug);return
    if args.command in ('build','voice'):run('voice.py',ROOT/'episode/script.json',ROOT/'audio')
    if args.command in ('build','mix'):run('mix.py')
    if args.command in ('build','render'):run('render.py','--width',json.loads((ROOT/'episode/film.json').read_text())['width'])
    if args.command in ('build','verify'):run('verify.py')
if __name__=='__main__':main()
