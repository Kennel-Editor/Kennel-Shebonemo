// netlify/functions/getRangeStats.mjs
import { client } from "./lib/_sanityClient.mjs";

function ymd(d) {
  const p = new Intl.DateTimeFormat("no-NO", {
    timeZone: "Europe/Oslo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const y = p.find((x) => x.type === "year")?.value || "";
  const m = p.find((x) => x.type === "month")?.value || "";
  const dd = p.find((x) => x.type === "day")?.value || "";
  return `${y}-${m}-${dd}`;
}

function eachDay(startStr, endStr) {
  const [ys, ms, ds] = startStr.split("-").map(Number);
  const [ye, me, de] = endStr.split("-").map(Number);
  const cur = new Date(Date.UTC(ys, ms - 1, ds));
  const end = new Date(Date.UTC(ye, me - 1, de));
  const out = [];
  while (cur <= end) {
    out.push(ymd(cur));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return out;
}

export const handler = async (event) => {
  try {
    const url = new URL(event.rawUrl || "http://x");
    const start = String(url.searchParams.get("start") || "").replace(
      /[^\d-]/g,
      ""
    );
    const end = String(url.searchParams.get("end") || "").replace(
      /[^\d-]/g,
      ""
    );
    if (!start || !end) return res({ error: "Missing start/end" }, 400);

    const doc = await client.getDocument("stats.global");
    const dayMap = doc?.days || {};

    let sessionsTotal = 0;
    const uniq = new Set();
    for (const d of eachDay(start, end)) {
      const entry = dayMap[d];
      if (!entry) continue;
      sessionsTotal += Number(entry.sessions || 0);
      if (Array.isArray(entry.hashes))
        for (const h of entry.hashes) if (h) uniq.add(h);
    }

    return res({ start, end, sessionsTotal, uniquesGlobal: uniq.size });
  } catch (e) {
    return res({ error: String(e?.message || e) }, 500);
  }
};

function res(body, code = 200) {
  return {
    statusCode: code,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(body),
  };
}
