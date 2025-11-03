export function getOrCreateVisitorId(key = "_vID") {
  const now = Date.now();
  const TTL_DAYS = 90;
  const TTL_MS = TTL_DAYS * 24 * 60 * 60 * 1000;

  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const obj = JSON.parse(raw);
      if (obj?.id && now - (obj.ts ?? 0) < TTL_MS) return obj.id;
    }
    const id = (crypto?.randomUUID && crypto.randomUUID()) || `${now}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(key, JSON.stringify({ id, ts: now }));
    return id;
  } catch {
     return `${now}-${Math.random().toString(36).slice(2)}`;
  }
}
