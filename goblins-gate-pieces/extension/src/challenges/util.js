export const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
export const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
export const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = rand(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
export const sleep = (ms) => new Promise(r => setTimeout(r, ms));
