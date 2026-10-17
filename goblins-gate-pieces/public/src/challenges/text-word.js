// One-guess spooky word game. Wrong guess = failed login + new word next time.
import { el, rand } from './util.js';
const WORDS = [
  { w: 'GHOST', clear: ['It floats and says boo.', 'Often draped in a white sheet.', 'Haunts old houses.'], cryptic: ['Not alive, not quite gone.', 'Wears a sheet but owns no bed.'] },
  { w: 'WITCH', clear: ['Rides a broom.', 'Stirs a cauldron.', 'Wears a pointy hat.'], cryptic: ['Her hat is her signature.', 'Brews more than tea.'] },
  { w: 'SKULL', clear: ['Part of a skeleton.', 'The top bone of the body.', 'Pirates put it on flags.'], cryptic: ['Protects the thinker.', 'Grins with no lips.'] },
  { w: 'CANDY', clear: ['Sweet treat for trick-or-treaters.', 'Corn is one kind.', 'Comes in wrappers.'], cryptic: ['What the door gives for a costume.', 'Dentists dislike it.'] },
  { w: 'BROOM', clear: ['Used for sweeping.', 'Witches ride it.', 'Has bristles.'], cryptic: ['Flies, but never lands in a hangar.', 'Cleans and carries.'] },
  { w: 'CRYPT', clear: ['An underground tomb.', 'Found beneath old churches.', 'Cold and stony.'], cryptic: ['A cellar for the very quiet.', 'No vowels worth mentioning.'] },
  { w: 'MUMMY', clear: ['Wrapped in bandages.', 'From ancient Egypt.', 'Found in pyramids.'], cryptic: ['Dressed head to toe in linen.', 'Dusty relative of a pharaoh.'] },
  { w: 'FANGS', clear: ['Vampires have them.', 'Sharp teeth.', 'Snakes use them to bite.'], cryptic: ['Two points of dinner.', 'Teeth with ambition.'] },
  { w: 'CURSE', clear: ['An evil spell.', 'Mummies lay these on tomb robbers.', 'Opposite of a blessing.'], cryptic: ['Bad luck, on purpose.', 'A wish gone sour.'] },
  { w: 'TRICK', clear: ['Half of the Halloween phrase.', 'A prank.', 'Opposite of treat.'], cryptic: ['What you get if the bowl is empty.', 'Sleight of hand.'] },
];
let last = -1;
export default {
  id: 'text-word', title: 'Spooky Word', blurb: 'One guess. Five letters. Use the hints.',
  render(c, api) {
    let i; do { i = rand(0, WORDS.length - 1); } while (i === last); last = i;
    const word = WORDS[i];
    const hints = api.stage >= 2 ? word.cryptic.slice(0, 3 - (api.stage - 1)) : word.clear.slice(0, api.stage === 0 ? 3 : 2);
    const first = api.stage === 0 && api.difficulty <= 3 ? ` The first letter is ${word.w[0]}.` : '';
    const ui = el(`<div class="ch ch-text"><h3>Guess the five-letter word</h3>
      <ul>${hints.map(h => `<li>${h}</li>`).join('')}</ul><p>${first}</p>
      <form><input maxlength="5" autocomplete="off" aria-label="Your one guess" placeholder="_ _ _ _ _" style="text-transform:uppercase;letter-spacing:.4em">
      <button>Lock in my one guess</button></form></div>`);
    c.append(ui);
    api.say(`${hints[0]}`);
    ui.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();
      const g = ui.querySelector('input').value.trim().toUpperCase();
      if (g.length !== 5) { api.react('mistake'); return; }
      g === word.w ? api.pass() : api.fail();
    });
  },
};
