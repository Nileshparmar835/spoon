---
name: make-fable
description: Direct an original vertical animated fable from one topic through a finished local MP4. Use for a complete episode or demo.
---

# Make the episode
Treat `$ARGUMENTS` as the topic. If empty, choose an everyday conflict with a visible consequence. Read CLAUDE.md and the production rules in docs/Reference_Analysis.pdf. The example has twenty connected thoughts, one model voice and one reference-sized canvas.

1. Check for the root .venv and the installed Node canvas module. On first use, run setup.ps1 on Windows or bash setup.sh on Linux/macOS. If the machine is missing a prerequisite, use its available free local installation route within the user’s permissions and report the exact missing tool if installation is blocked. Use the root virtual-environment Python to run `studio.py new <unused-slug>`. Work inside that run. Keep the root terminal open so the project skills remain available. Reuse the root interpreter and npm installation. On Windows a typical command is `..\..\.venv\Scripts\python.exe studio.py voice` from the new run. Set the title in episode/film.json.
2. Follow reference-study if fresh videos are attached. Follow fable-script. Replace the example script, scene IDs, sound cues and shot plans in the run. Write the chosen hook, the concrete callback and cue sheet to docs/director.md.
3. Follow fable-voice and run the voice stage. Use actual timings for the storyboard. Follow fable-animation and implement the new drawings and actions. Show the viewer the mechanism at work, including what changes after contact.
4. Follow fable-sound. Run mix, render and verify. Inspect samples of the rendered MP4 at the hook, change of rule, difficult physical contact, human comparison and last frame before fade. Include the final MP4, narration and editable scene sources in the delivery.
5. Fix failed checks and render again. Name the concrete dependency if a stage cannot run. A treatment or slide sequence alone leaves the episode incomplete.
