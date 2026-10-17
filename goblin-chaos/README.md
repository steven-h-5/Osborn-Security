# Goblin Chaos 👺

Goblin-themed Chrome extension for causing chaos at the hackathon.

## Captchas (one folder each, so we don't collide)
- [x] `captchas/osborn-security/` — Wordle-style "missing word" captcha
- [ ] captcha 2
- [ ] captcha 3
- [ ] captcha 4
- [ ] captcha 5

## Workflow
1. `git checkout -b captcha/<name>`
2. Work only inside your own `captchas/<name>/` folder
3. Open a PR into `main`

## Notes
- Manifest V3 forbids inline scripts, so each captcha keeps its JS in a separate file.
- Remote Google Fonts are dropped (extension CSP); use a bundled font file if you want Orbitron.
