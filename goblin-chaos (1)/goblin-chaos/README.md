# Goblin Chaos 👺

Goblin-themed Chrome extension for causing chaos at the hackathon.

## Captchas (one folder each, so we don't collide)
- [x] `captchas/osborn-security/` — Wordle-style "missing word" captcha
- [x] `captchas/dodging-checkbox/` — the "I am not a robot" box that dodges 10 times
- [x] `captchas/real-or-ai/` — pick the cake (random set of lemons, watermelons or phones each load)
- [x] `captchas/math-prompt/` — math question, letters-only box so the answer must be spelled out
- [x] `captchas/music-note/` — hear one note, name the note and the instrument (synthesized, no audio files)

## Demo
Open `demo/all-captchas.html` in a browser to see all five captchas on one page.

## Workflow
1. `git checkout -b captcha/<name>`
2. Work only inside your own `captchas/<name>/` folder
3. Open a PR into `main`

## Notes
- Manifest V3 forbids inline scripts, so each captcha keeps its JS in a separate file.
- Remote Google Fonts are dropped (extension CSP); use a bundled font file if you want Orbitron.
