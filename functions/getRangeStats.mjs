import { client } from "./lib/_sanityClient.mjs";

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
    if (!start || !end) return json({ error: "Missing start/end" }, 400);

    const doc = await client.getDocument("stats.global");
    const map = doc?.days || {};
    let sessionsTotal = 0;
    const uniq = new Set();

    function eachDay(startStr, endStr) {
      const [ys, ms, ds] = startStr.split("-").map(Number);
      const [ye, me, de] = endStr.split("-").map(Number);
      const cur = new Date(Date.UTC(ys, ms - 1, ds));
      const end = new Date(Date.UTC(ye, me - 1, de));
      const out = [];
      while (cur <= end) {
        const d = cur.toISOString().slice(0, 10);
        out.push(d);
        cur.setUTCDate(cur.getUTCDate() + 1);
      }
      return out;
    }

    for (const d of eachDay(start, end)) {
      const day = map[d];
      if (!day) continue;
      sessionsTotal += Number(day.sessions || 0);
      if (Array.isArray(day.hashes))
        for (const h of day.hashes) if (h) uniq.add(h);
    }

    return json({
      start,
      end,
      sessionsTotal,
      uniquesGlobal: uniq.size,
    });
  } catch (e) {
    return json({ error: String(e?.message || e) }, 500);
  }
};

function json(obj, code = 200) {
  return {
    statusCode: code,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(obj),
  };
}
