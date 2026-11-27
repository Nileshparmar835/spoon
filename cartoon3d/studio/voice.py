"""Multi-character expressive narration with word timings from the same model pass.

Each script row has `parts`; each part sets who speaks, speed, pitch, gain (dB) and pause."""
import argparse, json, re, tempfile, wave
from pathlib import Path
import numpy as np
import onnxruntime as ort
from kokoro_onnx import Kokoro
from kokoro_onnx.sliding import token_edges
from duration_graph import timing_model

ROOT = Path(__file__).resolve().parents[1]
SR = 24000
# Each character is a weighted blend of Kokoro voice styles.
CAST = {
    'host':  {'am_michael': 1.0},   # "Voice 13", unblended
    'crowd': {'af_bella': 1.0},
}

def take(engine, session, styles, part):
    phones = engine.tokenizer.phonemize(part['text'], 'en-us')
    groups = phones.split()
    labels = part.get('labels', part['text'].split())
    if len(labels) != len(groups):
        # Phonemizer merged words: spread the words over the line by length.
        labels = None
    tokens = engine.tokenizer.tokenize(phones)
    who, pitch = part['who'], part['pitch']
    key = engine._tokens_input
    raw, durations = session.run(None, {
        key: np.array([[0, *tokens, 0]], dtype=np.int64),
        'style': engine._style_for(styles[who], len(tokens)).astype(np.float32),
        # Resampling below changes tempo as well as pitch, so compensate here.
        'speed': np.array([part['speed'] / pitch], dtype=np.float32)})
    samples = raw.ravel()
    edges = token_edges(durations.ravel(), len(samples))[1:]
    active = np.flatnonzero(np.abs(samples) > .003)
    lo, hi = max(0, active[0] - 650), min(len(samples), active[-1] + 1600)
    samples = samples[lo:hi].copy()
    spans = []
    if not labels:
        print('NOTE estimated word timing:', part['text'])
    if labels:
        i = 0
        for label, group in zip(labels, groups):
            j = i + len(engine.tokenizer.tokenize(group))
            a, b = (float(np.clip(edges[k] - lo, 0, len(samples))) / SR for k in (i, j))
            spans.append((label, a, b))
            i = j + 1
    else:
        words = part['text'].split()
        total = sum(len(w) + 1 for w in words); at = 0
        for w in words:
            d = len(samples) / SR * (len(w) + 1) / total
            spans.append((w, at, at + d * .94)); at += d
    # Pitch shift by resampling.
    n = int(len(samples) / pitch)
    samples = np.interp(np.arange(n) * pitch, np.arange(len(samples)), samples).astype(np.float32)
    samples[:120] *= np.linspace(0, 1, 120)
    samples[-120:] *= np.linspace(1, 0, 120)
    # Level every line to the same speech loudness, then apply the acting gain.
    voiced = samples[np.abs(samples) > .01]
    samples *= .11 / max(.01, np.sqrt(np.mean(voiced ** 2))) * 10 ** (part['gain'] / 20)
    return samples, [(l, a / pitch, b / pitch) for l, a, b in spans]

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('phrases', type=Path); ap.add_argument('folder', type=Path)
    ap.add_argument('--host-voice', help='Override the saved narrator for an audition')
    args = ap.parse_args()
    profile_path = ROOT / 'episode/voice_profile.json'
    profile = json.loads(profile_path.read_text(encoding='utf-8')) if profile_path.exists() else {}
    host_voice = args.host_voice or profile.get('host_voice', 'am_michael')
    cast = {**CAST, 'host': {host_voice: 1.0}}
    rows = json.loads(args.phrases.read_text(encoding='utf-8'))
    pieces, words, beats = [np.zeros(int(SR * .35), np.float32)], [], []
    n = len(pieces[0])
    opts = ort.SessionOptions(); opts.intra_op_num_threads = 2
    ort.disable_telemetry_events()
    with tempfile.TemporaryDirectory() as tmp:
        timed = Path(tmp) / 'timed.onnx'
        timing_model(ROOT / 'models/kokoro-v1.0.onnx', timed)
        session = ort.InferenceSession(str(timed), sess_options=opts, providers=['CPUExecutionProvider'])
        engine = Kokoro.from_session(session, str(ROOT / 'models/voices-v1.0.bin'))
        styles = {k: sum(engine.get_voice_style(v) * w for v, w in mix.items()) for k, mix in cast.items()}
        for index, row in enumerate(rows):
            start = 0 if index == 0 else n / SR
            parts = []
            for part in row['parts']:
                y, spans = take(engine, session, styles, part)
                a = n / SR; b = (n + len(y)) / SR
                parts.append(dict(who=part['who'], text=part['text'], start=round(a, 4), end=round(b, 4)))
                words.extend(dict(text=l, who=part['who'], part=len(parts) - 1, start=round(s + a, 4), end=round(e + a, 4)) for l, s, e in spans)
                gap = np.zeros(round(SR * part['pause']), np.float32)
                pieces.extend([y, gap]); n += len(y) + len(gap)
            beats.append(dict(id=row['id'], start=round(start, 5), speech_end=parts[-1]['end'], text=row['spoken'], parts=parts))
    track = np.concatenate(pieces)
    track *= .86 / np.abs(track).max()
    args.folder.mkdir(parents=True, exist_ok=True)
    with wave.open(str(args.folder / 'narration.wav'), 'wb') as wav:
        wav.setparams((1, 2, SR, 0, 'NONE', ''))
        wav.writeframes((track * 32767).astype('<i2').tobytes())
    (args.folder / 'words.json').write_text(json.dumps(words, indent=2))
    (args.folder / 'beats.json').write_text(json.dumps(beats, indent=2))
    (args.folder / 'voice_used.json').write_text(json.dumps({'host_voice': host_voice, 'engine': 'kokoro-onnx'}, indent=2))
    print(f'{n / SR:.2f} s, {len(words)} timed words')

if __name__ == '__main__':
    main()
