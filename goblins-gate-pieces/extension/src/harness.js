// Standalone test page: runs any challenge with a mock api, so you can build yours without the real app.
import { CHALLENGES } from './challenges/index.js';
import { Character } from './character/character.js';
const $ = (s) => document.querySelector(s);
const ch = new Character($('#char')); ch.muted = !new URLSearchParams(location.search).has('voice');
let stage = 0, cleanups = [], failed = 0;
const log = (m) => { $('#log').textContent = m + '\n' + $('#log').textContent; };
$('#stages').innerHTML = [0, 1, 2, 3].map(i => `<button data-s="${i}">${i}</button>`).join('');
$('#stages').onclick = (e) => { if (e.target.dataset.s) { stage = +e.target.dataset.s; ch.setStage(stage); } };
$('#menu').innerHTML = CHALLENGES.map(c => `<button data-id="${c.id}">${c.title}</button>`).join('');
$('#menu').onclick = (e) => e.target.dataset.id && run(CHALLENGES.find(c => c.id === e.target.dataset.id));
async function run(c) {
  cleanups.forEach(f => f()); cleanups = []; $('#stage').innerHTML = '';
  const api = {
    difficulty: +$('#diff').value, stage,
    say: (t) => ch.say(t), react: (e) => ch.react(e),
    pass() { log(`PASS ${c.id}`); ch.react('pass'); },
    fail(line) { log(`FAIL ${c.id} (failed logins ${++failed})`); line ? ch.say(line) : ch.react('fail'); },
    onCleanup: (f) => cleanups.push(f), debug: (s) => { window.__secret = s; },
  };
  await c.render($('#stage'), api);
}
window.goblinsHarness = { run, CHALLENGES, ch };
