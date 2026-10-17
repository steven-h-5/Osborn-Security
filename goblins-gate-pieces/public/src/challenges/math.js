// Candy word problem. The input refuses digits, so the answer must be typed in words.
import { el, rand } from './util.js';
const ONES = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
const TENS = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
export const parseWords = (s) => {
  const t = s.toLowerCase().replace(/-/g, ' ').trim().split(/\s+/).filter(w => w && w !== 'and');
  if (!t.length) return NaN;
  let n = 0;
  for (const w of t) {
    if (ONES.includes(w)) n += ONES.indexOf(w);
    else if (TENS.includes(w)) n += TENS.indexOf(w) * 10;
    else return NaN;
  }
  return n;
};
const make = (d) => {
  const a = rand(3 + d * 2, 8 + d * 4), b = rand(2, 4 + d * 2), k = rand(2, 3 + d);
  const kinds = [
    () => ({ q: `You have ${a} candy corns. A goblin steals ${b}, then a ghost gives you ${k} more. How many do you have?`, ans: a - b + k }),
    () => ({ q: `${k} trick-or-treaters each get ${b} chocolates. You eat ${Math.min(k, 3)}. How many are left?`, ans: k * b - Math.min(k, 3) }),
    () => ({ q: `A bowl holds ${a + b} sweets. ${b} are licorice and the rest are toffee. How many toffees?`, ans: a }),
  ];
  return kinds[rand(0, kinds.length - 1)]();
};
export default {
  id: 'math', title: 'Candy Math', blurb: 'Type the answer. In words.',
  render(c, api) {
    const p = make(api.difficulty);
    const ui = el(`<div class="ch ch-math"><h3>${p.q}</h3><form><input autocomplete="off" aria-label="Answer in words" placeholder="type the answer"><button>Answer</button></form><p class="msg"></p></div>`);
    c.append(ui);
    const inp = ui.querySelector('input'), msg = ui.querySelector('.msg');
    let wrong = 0;
    api.say('Do the sums. Carefully.');
    // digits are not allowed
    inp.addEventListener('keydown', (e) => { if (/^[0-9]$/.test(e.key)) { e.preventDefault(); api.react('mistake'); msg.textContent = 'Numbers? In MY vault?'; } });
    inp.addEventListener('input', () => { inp.value = inp.value.replace(/[0-9]/g, ''); });
    ui.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();
      if (parseWords(inp.value) === p.ans) return api.pass();
      wrong++;
      if (wrong >= 5) return api.fail();
      api.react('mistake');
      if (wrong >= 3) { msg.textContent = `Hint: the answer is between ${Math.max(0, p.ans - 3)} and ${p.ans + 3}. Spell it out.`; }
      inp.select();
    });
  },
};
