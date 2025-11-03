import { client } from "./lib/_sanityClient.mjs";

export const handler = async () => {
  try {
    const docs = await client.fetch(`*[_type == "pageStats"]{sessionsTotal, sessionsToday, uniqueHashes}`);
    let sessionsTotal = 0;
    let sessionsToday = 0;
    const uniq = new Set();
    for (const d of docs) {
      sessionsTotal += Number(d?.sessionsTotal || 0);
      sessionsToday += Number(d?.sessionsToday || 0);
      if (Array.isArray(d?.uniqueHashes)) for (const h of d.uniqueHashes) if (h) uniq.add(h);
    }
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      body: JSON.stringify({
        sessionsTotal,
        sessionsToday,
        uniquesGlobal: uniq.size,
      }),
    };
  } catch (e) {
    return { statusCode: 500, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: String(e?.message || e) }) };
  }
};
