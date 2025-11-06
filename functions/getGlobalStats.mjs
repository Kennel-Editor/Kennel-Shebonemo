import { client } from "./lib/_sanityClient.mjs";
import { osloDateStr } from "./lib/_utils.mjs";

export const handler = async () => {
  try {
    const today = osloDateStr(new Date());
    const doc = await client.getDocument("stats.global");
    const days = (doc && doc.days) || {};
    const todayEntry = days[today] || {};
    const sessionsToday = Number(todayEntry.sessions || 0);
    const sessionsTotal = Number(doc?.sessionsTotal || 0);
    const uniquesGlobal = Array.isArray(doc?.uniqueHashes)
      ? doc.uniqueHashes.length
      : 0;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
      body: JSON.stringify({ sessionsToday, sessionsTotal, uniquesGlobal }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: String(e?.message || e) }),
    };
  }
};
