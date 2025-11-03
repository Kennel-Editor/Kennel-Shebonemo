import { client } from "./lib/_sanityClient.mjs";

function toStatsId(slug) {
  if (!slug || slug === "/") return "stats.home";
  let s = String(slug).replace(/^\/+/, "");
  s = s.replace(/\/+/g, "__");
  s = s.replace(/[^\w-]+/g, "_");
  s = s.slice(0, 120) || "home";
  return `stats.${s}`;
}

export const handler = async (event) => {
  try {
    const url = new URL(
      event.rawUrl ||
        `http://x${event.path}${event.rawQuery ? "?" + event.rawQuery : ""}`
    );
    const slug = url.searchParams.get("slug");
    if (!slug) return json({ error: "Missing slug" }, 400);

    const docId = toStatsId(slug);
    const doc = await client.getDocument(docId);

    if (!doc) {
      return json({
        page: slug,
        sessionsTotal: 0,
        sessionsToday: 0,
        uniquesTotal: 0,
      });
    }

    return json({
      page: doc.page,
      sessionsTotal: Number(doc.sessionsTotal || 0),
      sessionsToday: Number(doc.sessionsToday || 0),
      uniquesTotal: Number(doc.uniquesTotal || 0),
    });
  } catch (e) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: String(e?.message || e),
        envSeen: {
          projectId:
            process.env.SANITY_PROJECT_ID ||
            process.env.SANITY_STUDIO_PROJECT_ID,
          dataset:
            process.env.SANITY_DATASET || process.env.SANITY_STUDIO_DATASET,
          hasToken: Boolean(process.env.SANITY_TOKEN),
        },
      }),
    };
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
