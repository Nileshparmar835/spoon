"""Generate isolated Kokoro auditions; never overwrite production audio/script."""
import argparse
import json
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
CANDIDATES = ('am_michael', 'am_fenrir', 'am_puck')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--voices', nargs='+', default=list(CANDIDATES))
    parser.add_argument('--prepare-only', action='store_true', help='Write audition script without loading TTS')
    args = parser.parse_args()
    # Prevent command-line voice names from escaping the audition directory.
    if any(not v.replace('_', '').isalnum() for v in args.voices):
        parser.error('Voice names must contain only letters, digits and underscores.')
    output = ROOT / 'output/voice_auditions'
    output.mkdir(parents=True, exist_ok=True)
    lines = [
        ('hook', "They built a machine to save ten seconds. It wasted the entire day!", 1.10, 0.5, .18),
        ('setup', "At first, everything worked. Then someone pressed the button twice.", 1.02, 0, .32),
        ('reveal', "Wait. Twice? That was the one thing nobody had tested.", .98, .5, .38),
        ('payoff', "Their brilliant solution? Put a sign on the button.", 1.01, 0, .45),
    ]
    script = output / 'audition_script.json'
    script.write_text(json.dumps([
        {'id': key, 'spoken': text, 'parts': [dict(who='host', text=text,
          speed=speed, pitch=1.0, gain=gain, pause=pause)]}
        for key, text, speed, gain, pause in lines
    ], indent=2), encoding='utf-8')
    if args.prepare_only:
        print(script)
        return
    for voice in args.voices:
        subprocess.run([sys.executable, str(ROOT / 'studio/voice.py'), str(script),
                        str(output / voice), '--host-voice', voice], check=True)
    print('Auditions ready. Compare the WAVs with the reference; see VOICE_DIRECTION.md.')


if __name__ == '__main__':
    main()
