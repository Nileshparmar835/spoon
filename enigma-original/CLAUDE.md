# Bell Street Fable Studio

When the user gives a topic, use the make-fable project skill and produce the film. The archived example is The Last Lamp on Bell Street. Create each subsequent episode in a fresh runs/<slug> directory using the root studio.py new command. The user should be able to give a single topic and receive an MP4.

Use the bundled local English narrator, am_michael. Keep connected sentences and expressive timing. Keep the illustrated, atmospheric 2D stage, expressive dark heads, restrained camera movement and spoken-word captions. Design new actions, props and environments around the new script. Match the reference duration when the user gives no length preference. Adapt the script when they request a shorter Short.

The PDF in docs analyzes all nine supplied references. The root demo script and director sheet show how those observations become a new story. The rendered MP4 is in output. The five production skills live alongside the directing skill in .claude/skills and can also be used independently.

Run setup once. Use the project virtual-environment Python for all stages. Production uses the local CPU, the supplied voice model and fonts, Node Canvas and FFmpeg. Keep media generation free of paid APIs and account-based TTS. Complete the render and verify stages before reporting a finished episode.
