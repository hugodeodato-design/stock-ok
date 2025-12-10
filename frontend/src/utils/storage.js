export const loadJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error('loadJSON', e);
    return fallback;
  }
}

export const saveJSON = (key, data) => {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) { console.error('saveJSON', e); }
}
