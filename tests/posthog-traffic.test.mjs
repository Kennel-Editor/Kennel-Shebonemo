import test from "node:test";
import assert from "node:assert/strict";
import { parsePeriod, queryPosthog } from "../functions/lib/_posthogStats.mjs";
import { trafficWeek } from "../src/counter/utils/trafficWeeks.js";

const env = { POSTHOG_PROJECT_ID: "123", POSTHOG_PERSONAL_API_KEY: "test-only" };
const legacy = { global: { days: {} }, pages: [] };
const cutoff = "2020-01-01T14:30:00+01:00";
const period = (params) => parsePeriod(new URLSearchParams(params), cutoff, legacy);

test("traffic counts countries by visitor and sources by session, using the chosen period", async () => {
  const calls = [];
  const result = await queryPosthog(period({ start: "2020-01-06", end: "2020-01-12" }), env, async (url, options) => {
    const query = JSON.parse(options.body).query.query;
    calls.push({ url, query });
    return { ok: true, json: async () => ({ results: query.includes("AS countryName")
      ? [["Norway", 4], ["Canada", "2"]] : [["Direkte", 5], ["Google", 3]] }) };
  }, { trafficOnly: true });
  assert.deepEqual(result.traffic.countries, [{ country: "Norway", visitors: 4 }, { country: "Canada", visitors: 2 }]);
  assert.deepEqual(result.traffic.sources, [{ source: "Direkte", sessions: 5 }, { source: "Google", sessions: 3 }]);
  assert.equal(calls.length, 2);
  assert.match(calls[0].query, /GROUP BY distinct_id/);
  assert.match(calls[1].query, /GROUP BY sessionId/);
  assert.match(calls[1].query, /argMin\(properties\.\$referrer, timestamp\)/);
  for (const { query } of calls) {
    assert.match(query, /deployment_context = 'production'/);
    assert.match(query, /admin/);
    assert.ok(query.includes(`fromUnixTimestamp64Milli(${Date.parse(cutoff)})`));
    assert.ok(query.includes("2020-01-06 00:00:00"));
    assert.ok(query.includes("2020-01-12 00:00:00"));
    assert.match(query, /Europe\/Oslo/);
    assert.doesNotMatch(query, /30 DAY/);
  }
});

test("all-time traffic uses the cutover, not a trailing 30-day window", async () => {
  const queries = [];
  await queryPosthog(period({ range: "all" }), env, async (_, options) => {
    queries.push(JSON.parse(options.body).query.query);
    return { ok: true, json: async () => ({ results: [] }) };
  }, { trafficOnly: true });
  assert.equal(queries.length, 2);
  assert.ok(queries.every((query) => query.includes("2020-01-01 00:00:00") && !query.includes("30 DAY")));
});

test("weeks before PostHog have empty traffic without API calls or invented legacy countries", async () => {
  const result = await queryPosthog(period({ start: "2019-12-23", end: "2019-12-29" }), {}, () => {
    throw new Error("unexpected request");
  }, { trafficOnly: true });
  assert.deepEqual(result.traffic, { countries: [], sources: [] });
});

test("malformed traffic counts and PostHog failures do not become empty successful cards", async () => {
  const current = period({ range: "all" });
  await assert.rejects(queryPosthog(current, env, async () => ({ ok: false, status: 403 }), { trafficOnly: true }), /403/);
  await assert.rejects(queryPosthog(current, env, async () => ({ ok: true, json: async () => ({ results: [["Canada", -1]] }) }), { trafficOnly: true }), /Ugyldige trafikktall/);
});

test("weekly navigation uses ISO weeks across year and daylight-saving boundaries", () => {
  assert.deepEqual(trafficWeek(0, "2021-01-01"), { start: "2020-12-28", end: "2021-01-03", number: 53, year: 2020 });
  assert.deepEqual(trafficWeek(0, "2021-01-04"), { start: "2021-01-04", end: "2021-01-10", number: 1, year: 2021 });
  assert.deepEqual(trafficWeek(1, "2021-01-04"), { start: "2020-12-28", end: "2021-01-03", number: 53, year: 2020 });
  assert.deepEqual(trafficWeek(0, "2026-03-29"), { start: "2026-03-23", end: "2026-03-29", number: 13, year: 2026 });
  assert.deepEqual(trafficWeek(0, "2026-10-25"), { start: "2026-10-19", end: "2026-10-25", number: 43, year: 2026 });
});
