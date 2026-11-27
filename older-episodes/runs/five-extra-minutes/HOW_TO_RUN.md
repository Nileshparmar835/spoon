# The Five Extra Minutes: editable source

1. Clone https://github.com/Nileshparmar835/enigma and run its setup (setup.sh or setup.ps1).
2. Unzip this folder to `enigma/runs/five-extra-minutes/`.
3. Download two files into its `models/` folder from
   https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
   - kokoro-v1.0.onnx
   - voices-v1.0.bin
4. From that folder, using the repo's .venv Python: `python studio.py build`

Edit voices and delivery: CAST in studio/voice.py; speed, pitch, gain and pause per line in episode/script.json.
Edit visuals: art/drawing.js (depth camera), art/actors.js (characters), art/scenes.js (shots).
If you change the words, update the matching cues in episode/sound.json and art/scenes.js.
