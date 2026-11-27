"""Optional check: a speech recogniser listens to each line and shows what it heard.

Setup once:  .venv/bin/python -m pip install sherpa-onnx
Download sherpa-onnx-whisper-base.en.tar.bz2 from
https://github.com/k2-fsa/sherpa-onnx/releases/tag/asr-models and unpack it into models/.

  python studio/speech_check.py        checks the clean narration
  python studio/speech_check.py mix    checks narration with music and effects
"""
import json, subprocess as sp, sys
from pathlib import Path
import numpy as np
import sherpa_onnx
ROOT = Path(__file__).resolve().parents[1]
model = ROOT / 'models/sherpa-onnx-whisper-base.en'
if not model.is_dir():
    sys.exit(__doc__)
recognizer = sherpa_onnx.OfflineRecognizer.from_whisper(
    encoder=str(model / 'base.en-encoder.onnx'), decoder=str(model / 'base.en-decoder.onnx'),
    tokens=str(model / 'base.en-tokens.txt'), language='en', num_threads=1)
source = ROOT / 'audio' / ('mix.wav' if 'mix' in sys.argv[1:] else 'narration.wav')
SR = 16000
pcm = sp.check_output(['ffmpeg', '-v', 'error', '-i', str(source), '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'])
audio = np.frombuffer(pcm, '<i2').astype(np.float32) / 32768
for beat in json.loads((ROOT / 'audio/beats.json').read_text()):
    for part in beat['parts']:
        stream = recognizer.create_stream()
        stream.accept_waveform(SR, audio[int(max(0, part['start'] - .1) * SR):int((part['end'] + .15) * SR)])
        recognizer.decode_stream(stream)
        print('want :', part['text'], '\nheard:', stream.result.text.strip(), '\n')
