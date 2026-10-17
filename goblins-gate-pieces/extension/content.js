// Loads the overlay module. Does not read or change anything on the host page.
(async () => {
  if (window.__goblinsGateLoaded) return;
  window.__goblinsGateLoaded = true;
  const base = chrome.runtime.getURL('');
  const mod = await import(chrome.runtime.getURL('src/overlay.js'));
  mod.start(base);
})();
