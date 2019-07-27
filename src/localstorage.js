const TOKENS_KEY = "TOKENS";
const SEGMENTS_KEY = "SEGMENTS";
const TOP10_KEY = "TOP10";

function loadFromLocalStorage(key) {
  try {
    let serializedItem = localStorage.getItem(key);
    if (!serializedItem)
      return null;
    return JSON.parse(serializedItem);
  } catch (err) {
    return null;
  }
}

function saveToLocalStorage(key, item) {
  try {
    let serializedItem = JSON.stringify(item);
    console.log(key, item);
    localStorage.setItem(key, serializedItem);
    return true;
  } catch (err) {
    return false;
  }
}

export function loadUserTokens() {
  return loadFromLocalStorage(TOKENS_KEY);
}

export function saveUserTokens(tokens) {
  return saveToLocalStorage(TOKENS_KEY, tokens);
}

export function loadSegments() {
  return loadFromLocalStorage(SEGMENTS_KEY);
}

export function saveSegments(segments) {
  return saveToLocalStorage(SEGMENTS_KEY, segments);
}

export function saveTop10Segments(top10) {
  return saveToLocalStorage(TOP10_KEY, top10);
}

export function loadTop10Segments() {
  return loadFromLocalStorage(TOP10_KEY);
}