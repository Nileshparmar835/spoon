# Voice-only revision: expressive reference delivery

Read this before generating narration. It supersedes the older fixed “Voice 13”,
fixed speed 1.05 directions for the host. All visual, story, character, camera,
caption styling, music and SFX design decisions remain as they are.

## Target and evidence

The user supplied `vidssave.com Australia lost against birds!! 480P.mp4` as the
new vocal reference. Use `cartoon3d/reference/expressive_reference.wav` if supplied,
or extract its audio with FFmpeg. The supplied clip is 38.60 seconds long.
The target is its expressive DELIVERY on new scripts: listen to establish accent,
register, pacing changes, emphasis, pauses, sentence endings and emotional range.
Do not infer those qualities from the filename or assume its speaker is Kokoro.
This update has not been auditioned against that audio. No reference speaker/model
has been identified. The current am_michael setting is a baseline, not a match.

## Listen first

1. Discover Earshot if available in your Claude environment. Inspect its actual
   documentation, then use its audio-listening capability on the reference.
   Do not invent Earshot commands, APIs, or successful listening results.
2. Another audio-capable analysis tool is acceptable. A transcript, waveform,
   pitch statistic or speech recogniser alone cannot judge vocal expressiveness.
3. Listen to opening, middle and ending. Record timecoded observations in
   `cartoon3d/output/voice_comparison.md`; distinguish observed qualities from
   proposed settings. Compare on headphones or an audio-capable model.
4. If listening is unavailable, still create the auditions below and expose them
   for the user to compare. Mark matching as unverified; never claim “same voice”.

## Free local synthesis and audition

Use existing local Kokoro first. No paid APIs, subscriptions or paid credits.
The reference is for style comparison, not audio to splice into a new story.

From `cartoon3d/`, after its usual setup:

    .venv/bin/python studio/audition_voice.py

Windows: use `.venv\Scripts\python.exe` instead. This generates identical short,
original lines for am_michael, am_fenrir and am_puck, each in its own directory
under `output/voice_auditions/`. These are candidates, not asserted matches.
Use each installed voice only if available; never replace a missing voice silently.
Listen to each dry WAV next to the reference, at comparable listening loudness.
Select for expressive phrasing, suitable vocal tone, clear consonants, natural
pauses and sentence endings. Prefer naturalness to exaggeration. If none fit,
say so; do not label the closest bad candidate a successful match.

Save the chosen voice in `episode/voice_profile.json` under `host_voice`.
Set `selection_status` to `auditioned` only after actual comparison and record
which listener/tool made it. Future runs reuse that voice, not a random new one.
The old name Voice 13 is no longer a requirement unless the user asks for it.

## Direct each performance

Preserve the script words and part order when only changing voice for an existing
episode. Edit speed, gain and pause in `episode/make_script.py` (the source);
editing generated `script.json` alone is overwritten by `make.py script`.
Keep the crowd voice unchanged. For future scripts, keep connected thoughts
rather than cutting every word into a separate synthesis call.

Plan delivery per thought: intent, stressed words, pace and pause. Suggested
starting points ONLY, to refine by listening:

| Intent | Speed | Gain dB | Pause after |
|---|---:|---:|---:|
| Urgent hook | 1.08–1.15 | +0.5 | 0.12–0.20 s |
| Clear explanation | 1.00–1.08 | 0 | 0.15–0.25 s |
| Suspense/setup | 0.94–1.00 | -0.5 | 0.25–0.40 s |
| Surprise/reaction | 1.04–1.12 | +1 | 0.15–0.25 s |
| Dry payoff | 0.95–1.03 | 0 | 0.30–0.45 s |

Use punctuation and sentence construction to invite emphasis. Kokoro has no
reliable ElevenLabs-style emotion-tag interface: keep [laughing], [angry], etc.
out of spoken text. Acting notes are instructions for generation and selection,
not text to read aloud. Do not promise that speed/gain controls create emotions.
Keep pitch at 1.0; this project's resampling pitch control changes timbre and can
sound artificial. Do not mask flat delivery with pitch tricks or louder music.
Regenerate and listen to weak takes. Avoid constant shouting, robotic uniformity,
clipped word endings and excessive dramatic pauses.

## Integrate without redesign

    .venv/bin/python make.py script
    .venv/bin/python make.py voice
    .venv/bin/python make.py words
    .venv/bin/python make.py sound

`make.py voice` now reads the saved host voice automatically. A one-off override:

    .venv/bin/python studio/voice.py episode/script.json output/test_voice --host-voice am_fenrir

Keep the words and indices unchanged so existing word-index-based shots and
sound cues follow the new timing. Rebuild subtitles, soundtrack and video from
the regenerated timings. Check any absolute-time cues, total duration and closing
hold. Do not use render --resume after changing narration. Do not redesign scenes.

Before delivery, compare dry narration AND final mix with the reference, confirm
word clarity and music balance, and provide a short audible sample. Report what
was actually listened to, what was automatically checked and what remains
unverified. A generated waveform alone is not a completed voice match.
