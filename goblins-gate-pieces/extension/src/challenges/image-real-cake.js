// 4 images; pick the ones that are real food (not a cake lookalike). 3/4 to pass.
// Swap the placeholders by editing public/assets/images/manifest.json:
// [{"src":"assets/images/x.jpg","kind":"real"|"cake","alt":"..."}]  (own/free-to-use images only!)
import { el, shuffle } from './util.js';
const ph = (emoji, label) => 'data:image/svg+xml;utf8,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><rect width="160" height="160" fill="#fdf1d8"/><text x="80" y="95" font-size="70" text-anchor="middle">${emoji}</text><text x="80" y="148" font-size="11" text-anchor="middle" fill="#a33">PLACEHOLDER - REPLACE ME</text></svg>`);
const FALLBACK = [
  ...['🍎', '🍕', '🍔', '🍩', '🍞', '🥗'].map((e, i) => ({ src: ph(e, ''), kind: 'real', alt: 'food ' + i })),
  ...['🎂', '🧁', '🍰', '🎂'].map((e, i) => ({ src: ph(e, ''), kind: 'cake', alt: 'cake lookalike ' + i })),
];
let pool;
async function load() {
  if (pool) return pool;
  try { const r = await fetch((globalThis.__GG_BASE || '') + 'assets/images/manifest.json'); pool = r.ok ? await r.json() : FALLBACK; } catch { pool = FALLBACK; }
  if (!pool.length) pool = FALLBACK;
  return pool;
}
export default {
  id: 'image-real-cake', title: 'Real or Cake?', blurb: 'Select every image that is really food.',
  async render(c, api) {
    const all = await load();
    const real = shuffle(all.filter(x => x.kind === 'real')), cake = shuffle(all.filter(x => x.kind === 'cake'));
    const items = shuffle([...real.slice(0, 2), ...cake.slice(0, 2)]);
    const ui = el(`<div class="ch ch-img"><h3>Tap every image of real, non-cake food</h3>
      <div class="grid" style="display:grid;grid-template-columns:repeat(2,160px);gap:8px"></div><button>Verify</button></div>`);
    const sel = new Set();
    items.forEach((it, i) => {
      const b = el(`<button type="button" aria-pressed="false" style="padding:0;border:3px solid transparent"><img src="${it.src}" alt="${it.alt || 'image ' + (i + 1)}" width="160" height="160"></button>`);
      b.onclick = () => { sel.has(i) ? sel.delete(i) : sel.add(i); b.setAttribute('aria-pressed', sel.has(i)); b.style.borderColor = sel.has(i) ? '#ff8c1a' : 'transparent'; };
      ui.querySelector('.grid').append(b);
    });
    c.append(ui);
    api.say('Is it food, or is it cake? Look closely.');
    ui.querySelector('button:last-child').onclick = () => {
      const correct = items.filter((it, i) => (it.kind === 'real') === sel.has(i)).length;
      correct >= 3 ? api.pass() : api.fail(); // 3 of 4 correct to pass
    };
  },
};
