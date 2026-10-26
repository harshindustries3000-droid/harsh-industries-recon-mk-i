# HI RECON Mk I — browser PWA prototype

## Included
- Responsive blue HUD
- Camera preview (HTTPS + permission required)
- COCO-SSD object detection through TensorFlow.js (internet needed to load model)
- Browser text-to-speech with an en-GB setting (device voice, not an actor imitation)
- Voice commands where browser speech recognition is supported
- Interactive rotating wireframe mannequin demo
- PWA manifest and service worker

## Important limits
- The mannequin is **not** a scan of a person.
- Real multi-view 3D body reconstruction is not implemented; it needs a suitable reconstruction model and compute plan.
- This is a PWA, not a signed APK. Installability depends on HTTPS hosting and browser/device support.
- External libraries load from CDNs. Speech recognition support varies by browser and may use a browser/vendor service.
- The app code does not upload camera frames, but external libraries and browser speech services have their own privacy behavior.

## Deploy
Upload all files to a static HTTPS host. Then open the hosted URL in Chrome on Android and use the browser menu to install/add to home screen if offered. Opening index.html directly from a file manager may block camera access and ES modules.

## Commands
“start camera”, “stop camera”, “scan objects”, “show 3D model”, “status report”.
