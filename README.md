# Harsh Industries Recon Mk I — HUD 3.0

A phone-friendly JARVIS-inspired web HUD prototype.

## What changed in HUD 3.0
- Brighter electric-cyan palette and stronger glow.
- Animated floating-looking holographic data cards, waveform bars, motion-vector graphic, scanning sweep and technical grid.
- Reworked 3D visualization into a more proportioned human-shaped cyan mesh with torso, pelvis, limbs, joints, contour rings and drag-to-rotate interaction.
- Service-worker cache version bumped to `hi-recon-mk1-v4` so the updated files are not held behind the previous cache.

## Important limitations
- The 3D figure is procedurally drawn and stylized; it is **not** an anatomical-grade model or a real body scan.
- Camera-based object detection uses TensorFlow.js / COCO-SSD from external CDNs and requires internet access and camera permission.
- Browser speech recognition support varies by browser/device. Text-to-speech uses the available system voice; no exact movie voice is included.
- Holographic panels are visual effects on the phone screen, not true free-floating holograms.
- This package has not been tested on every phone/browser.

## Publish
Upload the contents of this folder to the root of the existing GitHub Pages repository, replacing files with the same names, then commit. Keep all seven files at the repository root. Wait for GitHub Pages to publish, close the old site tab, and reopen it.

Voice update: prefers an available British English voice with a masculine-sounding name and uses a slower, lower-pitched delivery. Actual voice options depend on the Android/browser text-to-speech engine; this does not reproduce or clone Paul Bettany’s voice.
