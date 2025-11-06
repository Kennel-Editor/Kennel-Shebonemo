import { client } from "./lib/_sanityClient.mjs";

function ymdOslo(d = new Date()) {
  const p = new Intl.DateTimeFormat("no-NO", {
    timeZone: "Europe/Oslo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const y = p.find((x) => x.type === "year")?.value;
  const m = p.find((x) => x.type === "month")?.value;
  const dd = p.find((x) => x.type === "day")?.value;
  return `${y}-${m}-${dd}`;
}

export const handler = async () => {
  try {
    const doc = await client.getDocument("stats.global");
    const today = ymdOslo();
    const sessionsTotal = Number(doc?.sessionsTotal || 0);
    const sessionsToday = Number(doc?.days?.[today]?.sessions || 0);
    const uniquesGlobal = Array.isArray(doc?.uniqueHashes)
      ? doc.uniqueHashes.length
      : 0;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
      body: JSON.stringify({ sessionsTotal, sessionsToday, uniquesGlobal }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: String(e?.message || e) }),
    };
  }
};
