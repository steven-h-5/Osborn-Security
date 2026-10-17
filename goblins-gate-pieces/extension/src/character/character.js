// Original mascot: a candy corn executive who slowly becomes a goblin.
// Layered inline SVG; stage classes (stage-0..3) drive CSS transitions.
import { pick } from './lines.js';

const SVG = `
<svg viewBox="0 0 200 260" class="cc-svg" role="img" aria-label="Candy corn executive">
  <g class="ears"><path d="M44 120 L8 100 L40 150Z"/><path d="M156 120 L192 100 L160 150Z"/></g>
  <path class="body-y" d="M100 20 C60 20 40 70 40 120 L40 215 C40 235 160 235 160 215 L160 120 C160 70 140 20 100 20Z"/>
  <path class="body-o" d="M40 120 L40 215 C40 235 160 235 160 215 L160 120 C160 150 40 150 40 120Z"/>
  <path class="body-w" d="M40 190 L40 215 C40 235 160 235 160 215 L160 190 C160 205 40 205 40 190Z"/>
  <g class="horns"><path d="M60 70 L40 20 L82 52Z"/><path d="M140 70 L160 20 L118 52Z"/></g>
  <g class="suit"><path d="M100 150 L78 235 L100 225 L122 235Z" class="tie-bg"/><path d="M100 150 L92 168 L100 200 L108 168Z" class="tie"/></g>
  <g class="cracks"><path d="M70 40 L82 70 L70 92"/><path d="M130 50 L120 80 L134 104"/></g>
  <g class="eyes">
    <ellipse cx="78" cy="105" rx="14" ry="17" class="eye-w"/><ellipse cx="122" cy="105" rx="14" ry="17" class="eye-w"/>
    <circle cx="80" cy="107" r="7" class="pupil"/><circle cx="120" cy="107" r="7" class="pupil"/>
  </g>
  <path class="brows" d="M60 84 L96 90 M140 84 L104 90"/>
  <g class="mouth m0"><path d="M76 138 Q100 160 124 138" /></g>
  <g class="mouth m1"><path d="M80 146 Q100 142 120 146"/></g>
  <g class="mouth m2"><path d="M76 148 Q90 138 100 148 Q110 156 124 140"/></g>
  <g class="mouth m3"><path d="M72 138 Q100 176 128 138Z" class="gob-mouth"/><path class="fangs" d="M82 142 L88 158 L94 146Z M106 146 L112 158 L118 142Z"/></g>
</svg>`;

export class Character {
  constructor(root) {
    this.root = root;
    this.stage = 0;
    this.muted = false;
    root.classList.add('cc');
    root.innerHTML = `<div class="cc-bubble" aria-live="polite"></div>${SVG}`;
    this.bubble = root.querySelector('.cc-bubble');
    this.setStage(0);
  }
  setStage(n) {
    this.stage = Math.max(0, Math.min(3, n));
    for (let i = 0; i < 4; i++) this.root.classList.toggle('stage-' + i, i === this.stage);
  }
  say(text) {
    this.bubble.textContent = text;
    this.bubble.classList.remove('pop'); void this.bubble.offsetWidth; this.bubble.classList.add('pop');
    this.root.classList.add('talking');
    clearTimeout(this._t); this._t = setTimeout(() => this.root.classList.remove('talking'), 1400);
    this.speak(text);
  }
  react(event) { this.say(pick(event, this.stage)); }
  // Stage voice: pitch drops and rate slows as he turns. Swap for recorded clips later.
  speak(text) {
    if (this.muted || !('speechSynthesis' in window)) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.pitch = [1.1, 0.9, 0.6, 0.1][this.stage];
      u.rate = [1.05, 0.95, 0.85, 0.7][this.stage];
      speechSynthesis.speak(u);
    } catch (e) { /* voice is optional */ }
  }
}
