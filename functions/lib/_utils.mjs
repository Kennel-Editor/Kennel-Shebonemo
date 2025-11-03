import crypto from "node:crypto";

export function isLikelyBot(ua) {
  if (!ua) return false;
  const s = ua.toLowerCase();
  return /(bot|crawler|spider|crawling|headless|httpclient|python-requests|ahrefs|semrush|bingpreview)/.test(s);
}

export function osloDateStr(date = new Date()) {
  const fmt = new Intl.DateTimeFormat("no-NO", {
    timeZone: "Europe/Oslo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const p = fmt.formatToParts(date);
  const y = p.find(x => x.type === "year")?.value;
  const m = p.find(x => x.type === "month")?.value;
  const d = p.find(x => x.type === "day")?.value;
  return `${y}-${m}-${d}`;
}

export function hashVisitorId(visitorId) {
  const salt = process.env.HASH_SALT || "dogs";
  return crypto.createHash("sha256").update(`${salt}:${visitorId}`).digest("hex").slice(0, 24);
}
