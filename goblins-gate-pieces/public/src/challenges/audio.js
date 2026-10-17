// Two modes, picked at random: match a note by ear on an on-screen piano, or a riddle read aloud.
// Replays are limited. Distortion grows by stage. Riddle captions appear after the 2nd failure.
import { el, rand } from './util.js';
const NOTES = { C: 261.63, D: 293.66, E: 329.63, F: 349.23, G: 392.0, A: 440.0, B: 493.88 };
const RIDDLES = [
  { q: 'I have a face but no eyes, hands but no arms. What am I?', a: ['clock', 'a clock'] },
  { q: 'I am orange, I am carved, and I glow on your porch. What am I?', a: ['pumpkin', 'a pumpkin', 'jack o lantern', 'jack-o-lantern'] },
  { q: 'The more of me you take, the more you leave behind. What am I?', a: ['footsteps', 'steps'] },
  { q: 'I fly without wings, I cry without eyes. What am I?', a: ['cloud', 'a cloud'] },
];
let ctx;
function tone(freq, stage) {
  ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = stage >= 2 ? 'sawtooth' : 'triangle';
  o.frequency.value = freq * (1 + (Math.random() - 0.5) * 0.01 * stage);
  if (stage) o.detune.value = (Math.random() - 0.5) * 30 * stage;
  g.gain.setValueAtTime(0.3, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
  o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 1.25);
}
export default {
  id: 'audio', title: 'Listen Up', blurb: 'Match the note by ear, or solve the riddle.',
  render(c, api) {
    const replays0 = Math.max(1, 4 - api.stage);
    let left = replays0;
    if (Math.random() < 0.5) {
      const keys = Object.keys(NOTES), target = keys[rand(0, keys.length - 1)];
      const ui = el(`<div class="ch ch-audio"><h3>Which note was that?</h3><button class="play">Play note (<span>${left}</span> left)</button>
        <div class="piano" style="display:flex;gap:4px;margin-top:10px">${keys.map(k => `<button data-k="${k}" style="width:44px;height:120px;background:#fff;color:#222">${k}</button>`).join('')}</div></div>`);
      c.append(ui);
      const play = ui.querySelector('.play');
      play.onclick = () => { if (left <= 0) return api.react('mistake'); left--; play.querySelector('span').textContent = left; tone(NOTES[target], api.stage); };
      ui.querySelectorAll('.piano button').forEach(b => b.onclick = () => { tone(NOTES[b.dataset.k], 0); if (b.dataset.k === target) api.pass(); else api.fail(); });
      api.say('Press play. Then pick the key.');
      api.debug && api.debug(target);
    } else {
      const r = RIDDLES[rand(0, RIDDLES.length - 1)]; let wrong = 0;
      const ui = el(`<div class="ch ch-audio"><h3>Listen to the riddle</h3><button class="play">Read it again (<span>${left}</span> left)</button><p class="cap"></p>
        <form><input autocomplete="off" aria-label="Riddle answer"><button>Answer</button></form></div>`);
      c.append(ui);
      const speak = () => { try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(r.q); u.rate = [1, .9, .8, .65][api.stage]; u.pitch = [1, .9, .6, .2][api.stage]; speechSynthesis.speak(u); } catch (e) {} };
      ui.querySelector('.play').onclick = () => { if (left <= 0) return api.react('mistake'); left--; ui.querySelector('span').textContent = left; speak(); };
      const showCaption = () => { ui.querySelector('.cap').textContent = '"' + r.q + '"'; };
      ui.querySelector('form').onsubmit = (e) => {
        e.preventDefault();
        const g = ui.querySelector('input').value.trim().toLowerCase();
        if (r.a.includes(g)) return api.pass();
        wrong++; if (wrong >= 2) showCaption();
        wrong >= 3 ? api.fail() : api.react('mistake');
      };
      speak(); api.say('Listen carefully. I will say it once.');
    }
  },
};
