# Mascot + CAPTCHA pieces

Standalone, no build step, no PHP needed. Test page: `php -S localhost:8000 -t public` then open `/harness.html`
(or any static server). `?voice=1` turns the speech on.

- `public/src/character/` : candy corn executive (SVG, 4 stages), reaction lines, voice
- `public/src/challenges/` : text-word, image-real-cake, checkbox, math, audio, memory, drawing (+ `index.js` registry)
- Contract: `{id, title, blurb, render(container, api)}`; api = `{difficulty, stage, say, react, pass, fail, onCleanup, debug}`
- IconCaptcha challenge is the integrator's; it follows the same contract.
- TODO: replace placeholder images (`assets/images/manifest.json`, own/free-to-use only), add recorded voice clips.

## Canvas overlay extension
1. `./tools/build_extension.sh` (copies `public/src` into `extension/`)
2. Chrome: `chrome://extensions` > Developer mode > Load unpacked > pick `extension/`
3. Open your school's Canvas. If your address is not `*.instructure.com`, add it to `matches` and `web_accessible_resources` in `extension/manifest.json`.
4. Alt+Shift+G toggles the overlay; "Let me in" turns it off. It reads, stores and sends nothing from the page.
Test without Canvas: open `/overlay-test.html` after running `overlay.js` start, or see `tests/overlay.mjs`.
