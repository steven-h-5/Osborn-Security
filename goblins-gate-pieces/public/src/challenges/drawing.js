// Draw a pumpkin: a roughly closed round shape plus a stem. Stricter at later stages.
import { el } from './util.js';
const len = (s) => s.reduce((t, p, i) => i ? t + Math.hypot(p.x - s[i - 1].x, p.y - s[i - 1].y) : 0, 0);
export function judge(strokes, stage, W = 300, H = 260) {
  if (!strokes.length) return { ok: false, why: 'empty' };
  const main = [...strokes].sort((a, b) => len(b) - len(a))[0];
  const xs = main.map(p => p.x), ys = main.map(p => p.y);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const w = x1 - x0, h = y1 - y0;
  const minSize = W * (0.25 + stage * 0.05);
  if (w < minSize || h < minSize * 0.8) return { ok: false, why: 'too small' };
  const gap = Math.hypot(main[0].x - main.at(-1).x, main[0].y - main.at(-1).y);
  if (gap > Math.max(w, h) * (0.35 - stage * 0.07)) return { ok: false, why: 'not closed' };
  const ratio = w / h;
  if (ratio < 0.8 - stage * 0.05 || ratio > 2.2 - stage * 0.2) return { ok: false, why: 'not pumpkin-shaped' };
  const cx = (x0 + x1) / 2;
  const stem = strokes.find(s => s !== main && s.length > 1 && s.every(p => Math.abs(p.x - cx) < w * 0.3) && Math.min(...s.map(p => p.y)) < y0 + h * 0.12 && len(s) > 6);
  if (!stem) return { ok: false, why: 'no stem' };
  return { ok: true };
}
export default {
  id: 'drawing', title: 'Draw a Pumpkin', blurb: 'A round shape and a stem. Mouse or touch.',
  render(c, api) {
    const ui = el(`<div class="ch ch-draw"><h3>Draw a pumpkin (closed shape + a stem on top)</h3>
      <canvas width="300" height="260" style="background:#fff;border-radius:8px;touch-action:none"></canvas>
      <p><button class="clr" type="button">Clear</button> <button class="go" type="button">Done</button></p></div>`);
    c.append(ui);
    const cv = ui.querySelector('canvas'), g = cv.getContext('2d');
    g.lineWidth = 4; g.lineCap = 'round'; g.strokeStyle = '#d96a00';
    let strokes = [], cur = null, fails = 0;
    const pos = (e) => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * cv.width / r.width, y: (e.clientY - r.top) * cv.height / r.height }; };
    cv.onpointerdown = (e) => { cv.setPointerCapture(e.pointerId); cur = [pos(e)]; strokes.push(cur); };
    cv.onpointermove = (e) => { if (!cur) return; const p = pos(e), q = cur.at(-1); cur.push(p); g.beginPath(); g.moveTo(q.x, q.y); g.lineTo(p.x, p.y); g.stroke(); };
    cv.onpointerup = () => { cur = null; };
    ui.querySelector('.clr').onclick = () => { strokes = []; g.clearRect(0, 0, 300, 260); };
    ui.querySelector('.go').onclick = () => {
      const r = judge(strokes, api.stage);
      if (r.ok) return api.pass();
      fails++; if (fails >= 3) return api.fail();
      api.say(({ empty: 'You drew nothing. Bold.', 'too small': 'A pumpkin that small is a grape.', 'not closed': 'Close the shape! Pumpkins have no gaps.', 'not pumpkin-shaped': 'That is not a pumpkin shape.', 'no stem': 'Where is the stem?' })[r.why]);
    };
    api.say('Draw me a pumpkin.');
  },
};
