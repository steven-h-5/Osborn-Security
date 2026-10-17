// Simon Says. 4-5 steps (+ difficulty), faster each stage. Wrong press restarts; 3 restarts = fail.
import { el, sleep } from './util.js';
const COLORS = [['red', '#e33', 262], ['orange', '#f93', 330], ['green', '#3b3', 392], ['purple', '#93c', 523]];
export default {
  id: 'memory', title: 'Goblin Says', blurb: 'Repeat the pattern.',
  render(c, api) {
    const len = Math.min(8, 3 + Math.ceil(api.difficulty / 2) + (api.stage >= 2 ? 1 : 0));
    const speed = [650, 500, 380, 280][api.stage];
    const ui = el(`<div class="ch ch-mem"><h3>Watch, then repeat (${len} steps)</h3><div class="pad" style="display:grid;grid-template-columns:repeat(2,90px);gap:8px">
      ${COLORS.map((x, i) => `<button data-i="${i}" style="height:90px;background:${x[1]};opacity:.55" aria-label="${x[0]}"></button>`).join('')}</div><p class="st"></p></div>`);
    c.append(ui);
    let dead = false, restarts = 0, seq = [], pos = 0, accepting = false, ac;
    api.onCleanup(() => { dead = true; });
    const btns = [...ui.querySelectorAll('.pad button')];
    const beep = (f) => { try { ac = ac || new AudioContext(); const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = f; g.gain.value = .15; o.connect(g).connect(ac.destination); o.start(); o.stop(ac.currentTime + .2); } catch (e) {} };
    const flash = async (i) => { btns[i].style.opacity = 1; beep(COLORS[i][2]); await sleep(speed * .6); btns[i].style.opacity = .55; await sleep(speed * .4); };
    const run = async () => {
      accepting = false; pos = 0; ui.querySelector('.st').textContent = 'Watch...';
      seq = Array.from({ length: len }, () => Math.floor(Math.random() * 4));
      await sleep(500);
      for (const i of seq) { if (dead) return; await flash(i); }
      ui.querySelector('.st').textContent = 'Your turn!'; accepting = true;
    };
    btns.forEach((b, i) => b.onclick = async () => {
      if (!accepting) return;
      await flash(i);
      if (i !== seq[pos]) { accepting = false; restarts++; if (restarts >= 3) return api.fail(); api.react('mistake'); return run(); }
      if (++pos === seq.length) { accepting = false; api.pass(); }
    });
    api.say('Watch the colors.'); run();
  },
};
