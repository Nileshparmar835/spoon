# Production credits and component sources

The demo story, character designs, location designs, score and Foley were created for this project. The reference frames reproduced for commentary appear only in the analysis. All pictures and sounds in the actual episode are newly rendered.

* Voice weights: Kokoro v1.0 INT8, model-files-v1.0 release. The bundled english-voice.bin contains the am_michael preset extracted from the release voice bank. The model license is in models/LICENSE-Apache-2.0.txt. Upstream: https://huggingface.co/hexgrad/Kokoro-82M and https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
* Voice runtime: Kokoro ONNX with ONNX Runtime, phonemizer and eSpeak NG. The two vendored pure-Python wheels include their upstream notices. The graph adapter exposes token durations from the pinned model. Upstream: https://github.com/thewh1teagle/kokoro-onnx
* Typography: DejaVu Serif Bold and DejaVu Sans Bold. License and source attribution are in art/FONT-LICENSE.txt. https://dejavu-fonts.github.io/
* Picture and encoding: Node.js, @napi-rs/canvas, FFmpeg and ffprobe. Dependencies are installed on the local machine. https://github.com/Brooooooklyn/canvas and https://ffmpeg.org/
* Claude Code project-skill layout: https://code.claude.com/docs/en/skills
