// Reaction lines per event per stage (0 friendly, 1 uneasy, 2 slipping, 3 goblin).
// Tease the mistake, never the person. Add more lines freely.
export const LINES = {
  greet: [
    ["Welcome, valued guest! Quick little check and you're in.", "Delighted to have you. This won't take a moment."],
    ["Ah, back again. Just a small check, as always.", "Shall we try that once more?"],
    ["Let's... let's keep this friendly, shall we.", "Another check. Just a formality. Hm."],
    ["WELL, WELL. Another one at my gate.", "Prove yourself, little visitor."],
  ],
  mistake: [
    ["Oh, close! Almost had it.", "No worries, that happens to everyone!"],
    ["Hm. That's not quite right, is it.", "Careful now. Mistakes add up."],
    ["Wrong again... why does it always go wrong...", "My patience is... thinning."],
    ["HA! Wrong! Delicious, delicious wrong!", "That answer was the worst answer. Bravo."],
  ],
  fail: [
    ["Oops! Not this time. Try again?", "Missed it, but you'll get the next one."],
    ["That's... a failure. Noted.", "I don't enjoy saying this, but no."],
    ["Failed. My smile is cracking. Look at it.", "Again?! Something is waking up in me."],
    ["FAILED! The gate stays SHUT!", "Scurry back and try again, if you dare."],
  ],
  pass: [
    ["Wonderful! In you go!", "Splendid work, truly."],
    ["Fine. Fine. You may pass.", "Well. That was... acceptable."],
    ["You passed? How... unfortunate.", "Go. Before I change my mind."],
    ["Grr. You may enter. THIS TIME.", "Lucky little thing. Pass."],
  ],
  idle: [
    ["Still thinking? Take your time!", "I'm right here if you need a hint."],
    ["Are you still there?", "The clock is ticking, you know."],
    ["Hello? I'm getting restless.", "Don't make me come over there."],
    ["TICK. TOCK. I'M HUNGRY.", "SLOW. SLOW. SLOW."],
  ],
  hint: [
    ["Here's a little hint, just for you!", "A tiny nudge in the right direction."],
    ["A hint. Don't say I never help.", "Fine, one hint. Only one."],
    ["Hint... if you can even use it.", "Take it. Take it and hurry."],
    ["HINT: try HARDER.", "Even a goblin pities you. Almost."],
  ],
};
export const pick = (event, stage) => {
  const set = (LINES[event] || LINES.mistake)[Math.min(stage, 3)];
  return set[Math.floor(Math.random() * set.length)];
};
