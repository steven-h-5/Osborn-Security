// "I am not a goblin": dodges twice, ticks on the 3rd try, then 3 confirmations behind a fake progress bar.
import { el, sleep } from './util.js';
export default {
  id: 'checkbox', title: 'Not a Goblin', blurb: 'Tick the box. Simple. (It is not.)',
  render(c, api) {
    const ui = el(`<div class="ch ch-check" style="position:relative;height:220px;overflow:hidden">
      <label style="position:absolute;left:20px;top:20px;padding:10px;background:#fff;color:#222;border-radius:8px;cursor:pointer;transition:all .25s">
      <input type="checkbox"> I am not a goblin</label><div class="steps"></div></div>`);
    c.append(ui);
    const label = ui.querySelector('label'), box = ui.querySelector('input'), steps = ui.querySelector('.steps');
    let tries = 0, busy = false, dead = false;
    api.onCleanup(() => { dead = true; });
    const reach = 40 + api.stage * 25;
    api.say('Just tick the box. Easy!');
    box.addEventListener('click', async (e) => {
      if (busy) return;
      tries++;
      if (tries < 3) {
        e.preventDefault();
        const x = Math.max(0, Math.min(ui.clientWidth - label.offsetWidth, parseFloat(label.style.left) + (Math.random() * 2 - 1) * 4 * reach));
        const y = Math.max(0, Math.min(ui.clientHeight - label.offsetHeight, parseFloat(label.style.top) + (Math.random() * 2 - 1) * 2 * reach));
        label.style.left = x + 'px'; label.style.top = y + 'px';
        api.react('mistake'); return;
      }
      busy = true; box.disabled = true;
      const confirms = ['Are you SURE you are not a goblin?', 'Sure sure? Swear on the candy?', 'Last check: no horns, no fangs?'];
      for (let n = 0; n < confirms.length; n++) {
        steps.innerHTML = `<p>${confirms[n]}</p><progress max="100" value="0" style="width:100%"></progress><p><small>Verifying goblinness...</small></p>`;
        const p = steps.querySelector('progress');
        // fake progress bar: stalls near 90% before finishing
        for (const v of [20, 55, 90, 91, 100]) { if (dead) return; p.value = v; await sleep(v === 90 ? 900 : 350); }
        if (n < confirms.length - 1) { steps.innerHTML = `<button type="button">Yes</button>`; await new Promise(r => steps.firstElementChild.onclick = r); }
      }
      if (!dead) api.pass();
    });
  },
};
