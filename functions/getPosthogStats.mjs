import snapshot from "../src/data/shebonemo-legacy-reconstructed-preview.json" with { type: "json" };
import { validateLegacy, parsePeriod, queryPosthog, combineStats } from "./lib/_posthogStats.mjs";

// Static import is bundled by Netlify. Never import the raw NDJSON export.
const legacy = validateLegacy(snapshot);

export const handler = async (event) => {
  const headers = { "Content-Type": "application/json", "Cache-Control": "no-store" };
  if (event.httpMethod !== "GET") return { statusCode: 405, headers, body: JSON.stringify({ error: "Method Not Allowed" }) };
  try {
    const params = new URLSearchParams(event.rawQuery || new URL(event.rawUrl || "http://local").search);
    const period = parsePeriod(params, process.env.POSTHOG_START_AT, legacy);
    const trafficOnly = params.get("traffic") === "1";
    const posthog = await queryPosthog(period, process.env, fetch, { trafficOnly });
    const result = trafficOnly ? { period, traffic: posthog.traffic } : combineStats(legacy, posthog, period);
    return { statusCode: 200, headers, body: JSON.stringify(result) };
  } catch (error) {
    return { statusCode: error.statusCode || 503, headers, body: JSON.stringify({ error: error.message }) };
  }
};
