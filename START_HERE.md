# Your video project

| Folder | What it is |
|---|---|
| `cartoon3d/` | **Use this for new videos.** Source for "The Food That Cost Nothing" with Voice 13. |
| `skills/` | All the project skills. The same copy is in the hidden folder `.claude/skills/`, where Claude Code reads them. If you change a skill, change it there. |
| `older-episodes/` | Source for "The Five Extra Minutes" (its own HOW_TO_RUN.md). Not re-tested from this zip. |
| `enigma-original/` | The original Enigma code, without its large voice model and generated media. Get those from https://github.com/Nileshparmar835/enigma |

## Skills
| Skill | Use |
|---|---|
| `make-cartoon3d-video` | **New.** The full method for videos in your chosen style. |
| `make-fable`, `fable-script`, `fable-voice`, `fable-animation`, `fable-sound`, `reference-study` | From your original repo, for its 2D fable pipeline. |

## Setup (once)
You need a computer (not just a phone) with Python 3.12, Node.js, FFmpeg and internet.

    cd cartoon3d
    python3.12 setup.py          # Windows: py -3.12 setup.py

This installs the libraries and a headless browser, and downloads the voice files (about 340 MB).

On Linux, if the browser does not start, run: `.venv/bin/python -m playwright install-deps chromium`

## Build the example
    .venv/bin/python make.py all            # Windows: .venv\Scripts\python.exe make.py all

The video appears in `cartoon3d/output/`.

## Make your next video
Open this whole folder in Claude Code and type:

> Use the make-cartoon3d-video skill. Make a new video: "YOUR TOPIC", with Voice 13.

A new topic is not one click: the story, scenes, camera shots and sound cues must be written for it.
The skill tells the assistant how. Without an assistant, you edit the files listed in the skill yourself.

## Tested
On Linux, from a fresh unzip: setup, voice, sound, preview and the full render passed. The test machine already had
some libraries and a browser stored. Windows and macOS are not tested.

## Voice
Voice 13 = Kokoro `am_michael`. Sample: `cartoon3d/reference/Voice_13_sample.mp3`.

## Credits and licences
Kokoro model and kokoro-onnx, Three.js, esbuild, Montserrat font, Playwright and FFmpeg are third-party
software under their own licences. Check their terms before commercial use.
Experiment used in the example: Shampanier, Mazar and Ariely, "Zero as a Special Price"
https://people.duke.edu/~dandan/webfiles/PapersPI/Zero%20as%20a%20Special%20Price.pdf
