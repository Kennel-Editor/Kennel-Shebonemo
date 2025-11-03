import { client } from "./lib/_sanityClient.mjs";

function toStatsId(slug) {
  if (!slug || slug === "/") return "stats.home";
  let s = String(slug).replace(/^\/+/, "");
  s = s.replace(/\/+/g, "__");
  s = s.replace(/[^\w-]+/g, "_");
  s = s.slice(0, 120) || "home";
  return `stats.${s}`;
}

const DEFAULT_SLUGS = ["/", "/dogs", "/litters", "/gallery", "/about", "/contact"];

function ymd(d) {
  const p = new Intl.DateTimeFormat("no-NO", { timeZone: "Europe/Oslo", year:"numeric", month:"2-digit", day:"2-digit" }).formatToParts(d);
  const y = p.find(x=>x.type==="year")?.value||"";
  const m = p.find(x=>x.type==="month")?.value||"";
  const dd = p.find(x=>x.type==="day")?.value||"";
  return `${y}-${m}-${dd}`;
}

function eachDay(startStr, endStr) {
  const [ys, ms, ds] = startStr.split("-").map(Number);
  const [ye, me, de] = endStr.split("-").map(Number);
  const cur = new Date(Date.UTC(ys, ms-1, ds));
  const end = new Date(Date.UTC(ye, me-1, de));
  const out = [];
  while (cur <= end) {
    out.push(ymd(cur));
    cur.setUTCDate(cur.getUTCDate()+1);
  }
  return out;
}

export const handler = async (event) => {
  try {
    const url = new URL(event.rawUrl || "http://x");
    const start = String(url.searchParams.get("start")||"").replace(/[^\d-]/g,"");
    const end = String(url.searchParams.get("end")||"").replace(/[^\d-]/g,"");
    if (!start || !end) return json({ error:"Missing start/end" },400);

    const qs = url.searchParams.getAll("slug");
    const slugs = qs.length ? qs : DEFAULT_SLUGS;

    const days = eachDay(start, end);
    let sessionsTotal = 0;
    const uniq = new Set();

    for (const slug of slugs) {
      const id = toStatsId(slug);
      const doc = await client.getDocument(id);
      const map = doc?.days || {};
      for (const d of days) {
        const day = map[d];
        if (!day) continue;
        sessionsTotal += Number(day.sessions||0);
        if (Array.isArray(day.hashes)) for (const h of day.hashes) if (h) uniq.add(h);
      }
    }

    return json({ start, end, sessionsTotal, uniquesGlobal: uniq.size });
  } catch (e) {
    return json({ error: String(e?.message||e) },500);
  }
};

function json(obj, code=200) {
  return { statusCode: code, headers:{ "Content-Type":"application/json","Cache-Control":"no-store" }, body: JSON.stringify(obj) };
}
