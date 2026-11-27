"""One-time setup for Windows, macOS and Linux:  python3.12 setup.py"""
import hashlib, os, shutil, subprocess as sp, sys, urllib.request
from pathlib import Path
ROOT = Path(__file__).resolve().parent
BASE = 'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/'
MODELS = {
    'kokoro-v1.0.onnx': '7d5df8ecf7d4b1878015a32686053fd0eebe2bc377234608764cc0ef3636a6c5',
    'voices-v1.0.bin': 'bca610b8308e8d99f32e6fe4197e7ec01679264efed0cac9140fe9c29f1fbf7d',
}

def digest(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for block in iter(lambda: f.read(1 << 20), b''):
            h.update(block)
    return h.hexdigest()

def main():
    if sys.version_info[:2] != (3, 12):
        sys.exit('Please run this with Python 3.12.')
    for tool in ('node', 'npm', 'npx', 'ffmpeg', 'ffprobe'):
        if not shutil.which(tool):
            sys.exit(f'Install {tool} first, then run setup again.')
    os.chdir(ROOT)
    if not Path('.venv').exists():
        sp.run([sys.executable, '-m', 'venv', '.venv'], check=True)
    py = str(ROOT / '.venv' / ('Scripts/python.exe' if os.name == 'nt' else 'bin/python'))
    sp.run([py, '-m', 'pip', 'install', '-r', 'requirements.txt'], check=True)
    sp.run([shutil.which('npm'), 'ci', '--no-audit', '--no-fund'], check=True)
    sp.run([py, '-m', 'playwright', 'install', 'chromium'], check=True)
    Path('models').mkdir(exist_ok=True)
    for name, expected in MODELS.items():
        path = Path('models') / name
        if not (path.exists() and digest(path) == expected):
            print('Downloading', name, '(large file, please wait)')
            urllib.request.urlretrieve(BASE + name, path)
            if digest(path) != expected:
                path.unlink(); sys.exit(f'{name} did not match its checksum. Run setup again.')
    print('Ready. Next:  ' + py + ' make.py all')

if __name__ == '__main__':
    main()
