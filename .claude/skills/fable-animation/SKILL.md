---
name: fable-animation
description: Storyboard and animate original 2D fable characters, objects and camera moves against speech-derived cues.
---

# Stage an illustrated fable
Build the stage in art/scenes.js; art/drawing.js supplies drawing primitives, the tiny acting rig and reusable settings. Each script id needs one scenes entry. The design grid is 360 × 640 and the standard export is twice that size. Place faces and props mostly in y=245–445. Reserve the upper caption line near y=156. Let one large object dominate close-ups. Preserve costume colors, prop scale and screen direction across adjoining shots.

For each cue draw an anticipation, contact and consequence. Example: lift the tool before "lit", touch the lantern on that word, then ease in the warm spill. Use c.on('word') for elapsed seconds since its onset. A negative value means the word is still ahead. For repeated words pass the occurrence number. Match merged captions exactly. Use c.p for local progress and absolute t for continuous secondary motion. Avoid frame-random drawing; use the seeded rand helper. Overlap the blink, hand and scarf slightly so the figure does not move as one rigid piece.

Alternate establishing shots, medium acting, an object insert and a human comparison. Introduce fresh silhouettes and props for a fresh topic. Use one or two quiet details such as water movement or wind. Keep large caption words legible against the scene. Draw costly effects once where possible.

Use `python studio/render.py --poster 32.8` for a frame at a chosen second. Open art/stage.html after generating the timeline to scrub the animation with sound. Final output is rendered from the same drawing functions at a fixed 30 fps.
