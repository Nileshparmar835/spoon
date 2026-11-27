---
name: make-cartoon3d-video
description: Use when making a new vertical cartoon-3D explainer short (psychology or true-story style) with the cartoon3d project - script, Voice 13 narration, Three.js scenes, one-word captions, sound and render.
---

# Make a cartoon-3D explainer video

Project folder: `cartoon3d/`. Run every command from it with the `.venv` Python.
`cartoon3d/` ships with one finished episode, "The Food That Cost Nothing".
Copy the whole folder (e.g. `cartoon3d-<topic>/`) for each new video so the finished one stays intact.

## The look
- Real 3D scene with toon shading, thick dark outlines, flat 2D faces on round heads, bean bodies, thin stick limbs.
- Bright daylight, blue sky, saturated colours. A world on every side, so any camera angle works.
- A new camera framing every 1-3 s: high, low, front, side, close-up. Slow push-ins; a shake on the big reveal.
- One large caption word at a time just below the middle; yellow for key words.
- Cream picture cards for numbers. Show the action instead of only saying it.
- Use original characters, scripts and designs. A reference video is for style only.
- `reference/style_sheet.jpg` shows the finished example.

## 1. Script (40-50 s, about 110-130 words)
Structure: hook (0-4 s) -> story or experiment -> twist -> name of the idea -> everyday examples -> question to the viewer.
- Check every real fact and number against the original source before writing it. State who the numbers describe.
- Say plainly to the user where a hook or example goes further than the source.

Edit the list in `episode/make_script.py`. Edit the title and file name in `episode/film.json`.

## 2. Voice
Default narrator "Voice 13" = Kokoro `am_michael`, unblended, speed 1.05 (`CAST` in `studio/voice.py`).
- Keep pitch at 1.0. Do not blend voices for the narrator.
- Record whole sentences together. Split only where the story needs a pause or another speaker.
- Run `python make.py script`, then `python make.py voice`.
- A `NOTE estimated word timing` line means captions for that take are approximate: rewrite it,
  or give the part a `labels` list matching the spoken word groups.

## 3. Scenes and shots
Run `python make.py words`. Shots, signs and sound cues refer to these word numbers.
- `src/kit.js`: toon material, outlines, faces and the character rig (`person().pose(t, {...})`).
- `src/world.js`: sets and props. Build new sets here.
- `src/main.js`: `buildShots()` (one `S(wordNumber, {...})` line per shot, each starting on its own line),
  crowd layouts, caption keywords (`HOT`), merged caption words, and picture cards.
- `studio/mix.py`: music bed and effects, with cues by word number.

**For a new topic, replace every episode-specific word number**: in the `S(...)` calls, in `window.frame`
(the price signs use fixed word numbers), in `cards()`, and in `studio/mix.py`
(including the extra music dip under one phrase of the example episode).
Every frame must depend only on time, so any frame can be redrawn.

## 4. Sound
`python make.py sound` makes `audio/mix.wav` (about -16 LUFS) and the subtitles.
Music ducks under speech. Drop the beat just before the main reveal.

Optional clarity check: `python studio/speech_check.py` and then `python studio/speech_check.py mix`
(setup is described at the top of that file). If a word is heard correctly without music but wrongly
with it, lower the music under that phrase in `studio/mix.py`. Recognisers also make small mistakes of their own.

## 5. Check before the full render
- `python make.py preview` and look at every shot: blocked views, props in front of the lens,
  cut-off characters, captions covering numbers or faces.
- Also draw frames in the middle of movements:
  `python studio/render3d.py stills <folder> <seconds> ...` after a preview has built the bundle.
- Inspect one frame at full size.

## 6. Render and verify
`python make.py render` (about 0.5-0.7 s per frame on a 2-core Linux machine with software graphics).
It checks format, frame count, decoding and loudness. Then look at frames from the finished file.
Resume with `--resume` only if no code, script or sound changed.

## 7. Deliver
Report what was and was not checked. Automated checks cannot judge how the voice sounds,
so ask the user to listen.
