// Overlay mode: a full-screen CAPTCHA gate inside a shadow DOM, shown on every page change.
// Touches nothing on the host page. No network calls except to its own bundled files.
import { CHALLENGES } from './challenges/index.js';
import { Character } from './character/character.js';

const stageFor = (f) => (f <= 2 ? 0 : f === 3 ? 1 : f === 4 ? 2 : 3);

export async function start(base) {
  globalThis.__GG_BASE = base;
  const css = await (await fetch(base + 'src/styles/character.css')).text();
  const host = document.createElement('div');
  host.id = 'goblins-gate-overlay';
  const root = host.attachShadow({ mode: 'open' });
  root.innerHTML = `<style>${css}
    .wrap{position:fixed;inset:0;z-index:2147483647;background:rgba(20,10,40,.96);color:#fff;font-family:system-ui,sans-serif;display:none;overflow:auto}
    .wrap.on{display:block}.in{max-width:900px;margin:2rem auto;padding:0 1rem}
    .ch{background:#2b1d4a;padding:1rem;border-radius:10px;margin-top:1rem}
    .menu button{margin:4px;padding:.5rem .8rem}.menu button[disabled]{opacity:.35}
    .row{display:flex;gap:1rem;align-items:flex-start;margin-right:270px}
    .top{display:flex;justify-content:space-between;align-items:center}</style>
    <div class="wrap"><div class="in">
      <div class="top"><h2>The Goblin's Gate (demo)</h2><span><button id="off">Let me in (turn off)</button></span></div>
      <div class="row"><div id="char"></div></div>
      <p>Pick a challenge:</p><div class="menu" id="menu"></div>
      <div id="stage"></div>
    </div></div>`;
  document.documentElement.append(host);
  const $ = (s) => root.querySelector(s);
  const wrap = $('.wrap');
  const ch = new Character($('#char'));
  ch.muted = false;
  let failed = 0, used = new Set(), cleanups = [], enabled = true, current = null;

  const show = () => { if (!enabled) return; wrap.classList.add('on'); ch.setStage(stageFor(failed)); ch.react('greet'); menu(); };
  const hide = () => { cleanups.forEach(f => f()); cleanups = []; $('#stage').innerHTML = ''; wrap.classList.remove('on'); };
  const menu = () => {
    if (used.size >= CHALLENGES.length) used = new Set(); // all used: unlock again
    $('#menu').innerHTML = CHALLENGES.map(c => `<button data-id="${c.id}" ${used.has(c.id) ? 'disabled' : ''}>${c.title}</button>`).join('');
  };
  $('#menu').addEventListener('click', (e) => {
    const c = CHALLENGES.find(x => x.id === e.target.dataset.id);
    if (c) run(c);
  });
  async function run(c) {
    cleanups.forEach(f => f()); cleanups = []; $('#stage').innerHTML = '';
    current = c;
    const api = {
      difficulty: 3, stage: stageFor(failed),
      say: (t) => ch.say(t), react: (e) => ch.react(e),
      pass() { used.add(c.id); ch.react('pass'); setTimeout(hide, 900); },
      fail(line) { failed++; ch.setStage(stageFor(failed)); line ? ch.say(line) : ch.react('fail'); setTimeout(() => { $('#stage').innerHTML = ''; menu(); }, 1400); },
      onCleanup: (f) => cleanups.push(f), debug() {},
    };
    await c.render($('#stage'), api);
  }
  $('#off').onclick = () => { enabled = false; hide(); };
  // Alt+Shift+G toggles the overlay back on or off.
  addEventListener('keydown', (e) => { if (e.altKey && e.shiftKey && e.code === 'KeyG') { enabled = !enabled; enabled ? show() : hide(); } });
  // Page changes: poll the address (works for single-page navigation too); ignore #fragment changes.
  let last = location.pathname + location.search;
  setInterval(() => { const now = location.pathname + location.search; if (now !== last) { last = now; show(); } }, 400);
  show();
}
