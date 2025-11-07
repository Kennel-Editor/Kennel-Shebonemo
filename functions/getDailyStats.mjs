import { client } from "./lib/_sanityClient.mjs";

function toStatsId(slug) {
  if (!slug || slug === "/") return "stats.home";
  let s = String(slug).replace(/^\/+/, "");
  s = s.replace(/\/+/g, "__");
  s = s.replace(/[^\w-]+/g, "_");
  s = s.slice(0, 120) || "home";
  return `stats.${s}`;
}

const DEFAULT_SLUGS = [
  "/",
  "/dogs",
  "/litters",
  "/gallery",
  "/about",
  "/contact",
];

export const handler = async (event) => {
  try {
    const url = new URL(event.rawUrl || "http://x");
    const date = url.searchParams.get("date");
    if (!date) return res({ error: "Missing date" }, 400);

    const qs = url.searchParams.getAll("slug");
    const slugs = qs.length ? qs : DEFAULT_SLUGS;

    const rows = [];
    let sessionsTotal = 0;
    const uniqGlobal = new Set();

    const debug = [];

    for (const slug of slugs) {
      const id = toStatsId(slug);
      const doc = await client.getDocument(id);

      const dayObj = doc?.days || {};
      const dayKeys = Object.keys(dayObj || {});
      const day = dayObj?.[date];

      if (day) {
        const s = Number(day.sessions || 0);
        const u = Number(day.uniques || 0);
        sessionsTotal += s;
        rows.push({ page: doc.page || slug, sessions: s, uniques: u });
        if (Array.isArray(day.hashes)) {
          for (const h of day.hashes) if (h) uniqGlobal.add(h);
        }
      }

      debug.push({
        slug,
        id,
        docExists: Boolean(doc),
        page: doc?.page,
        hasDays: Boolean(doc?.days),
        dayKeys,
        requestedDate: date,
        matched: Boolean(day),
        matchedValue: day || null,
      });
    }

    return res({
      date,
      sessionsTotal,
      uniquesGlobal: uniqGlobal.size,
      rows,
    });
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
    body: JSON.stringify(body, null, 2),
  };
}
