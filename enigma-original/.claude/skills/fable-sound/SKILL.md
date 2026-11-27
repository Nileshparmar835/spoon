---
name: fable-sound
description: Compose an original local music bed, time sound effects, mix the narration and validate the final animated short.
---

# Give the action a sound
In episode/sound.json set quiet_from and quiet_until to valid scene IDs. This ducks the score across the vulnerable moment. Use cues of [scene id, spoken word, sound, gain, stereo position]. The mixer supports click, low, chime, coin, air, spark and cloth. It resolves the first matching word in the named scene. Split repeated contacts into separate lines or add explicit occurrence support to the mixer. Use different sound envelopes for different materials. Add new sounds in studio/mix.py for story-specific actions.

Run the mix stage and compare narration.wav with mix.wav. Listen for Masking on low male vowels and for clicks at edits. Reduce the competing layer first. Keep the voice centered and use small stereo offsets for objects. Let a silent beat before the answer carry the scene. Amend the original chord progression or timbres when the story mood changes.

Render and run verify. Inspect output/quality.json, the first caption, the main contact and the final fade. Confirm the full audio/video decode, 9:16 frame, expected frame count, subtitle timing, peak margin and stereo AAC. The included SRT groups thoughts for reading. The burned-in captions follow individual model timing groups.
