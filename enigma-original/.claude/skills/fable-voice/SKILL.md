---
name: fable-voice
description: Generate expressive English narration with the bundled Kokoro male preset and measured word timings for animation and captions.
---

# Render the performance
Use the bundled INT8 graph, english-voice.bin and am_michael. Preserve the actor identity across all lines. Choose a single intention per line. Let brisk setup approach 1.04–1.08 speed, an uncertain question 0.91–0.98, and the ending about 0.90–0.97. Starting pauses of 0.12–0.22 seconds connect thoughts. Give a reveal or a question 0.30–0.45 seconds to land. Tune these to the text.

Run `python studio.py voice` with the project environment. Open audio/narration.wav. Review the opening consonant, character name, repeated count and final downward cadence. Rewrite a stiff sentence before changing actors. Text in direction guides writing and performance choices. The engine expresses the final wording, punctuation, phrase speed and pauses. It does not interpret bracketed emotion instructions.

If phonemization merges two words, the error lists the phoneme groups. Add a labels array with one display string per group, preserving the entire original sentence. For instance, "On the" can share a caption when the phonemes join. Re-run. audio/beats.json contains line bounds, audio/words.json contains actual model-derived token timing projected onto the generated waveform. Time scene events from these files. Rebuild audio, picture, and QC after a script change.
