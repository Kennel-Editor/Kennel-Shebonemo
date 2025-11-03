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
    const url = new URL(event.rawUrl || "http://x");
    const slug = url.searchParams.get("slug") || "/";
    const docId = toStatsId(slug);
    const doc = await client.getDocument(docId);
    return {
      statusCode: 200,
      headers: {"Content-Type":"application/json","Cache-Control":"no-store"},
      body: JSON.stringify(doc || { _id: docId, missing: true }, null, 2),
    };
  } catch (e) {
    return { statusCode: 500, headers: {"Content-Type":"application/json"}, body: JSON.stringify({ error: String(e?.message||e) }) };
  }
};
