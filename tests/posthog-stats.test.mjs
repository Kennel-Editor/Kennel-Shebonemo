import test from "node:test";
import assert from "node:assert/strict";
import snapshot from "../src/data/shebonemo-legacy-reconstructed-preview.json" with { type: "json" };
import { validateLegacy, parsePeriod, historical, combineStats, queryPosthog, osloDate, validateProductionSnapshot } from "../functions/lib/_posthogStats.mjs";
import { handler } from "../functions/getPosthogStats.mjs";
import originalSnapshot from "../src/data/shebonemo-legacy-preview.json" with { type: "json" };

const legacy = validateLegacy(snapshot);
const startAt = "2026-11-05T00:00:00+01:00";
const period = (query) => parsePeriod(new URLSearchParams(query), startAt, legacy);
const empty = { sessions: 0, uniques: 0, pages: [] };

test("reconstructed metadata preserves original days and all page statistics", () => {
  assert.deepEqual(legacy.pages, originalSnapshot.pages);
  for (const [day, counts] of Object.entries(originalSnapshot.global.days)) {
    assert.deepEqual(legacy.global.days[day], counts);
  }
  assert.equal(legacy.reconstruction.reconstructedDayCount, 40);
  assert.equal(legacy.reconstruction.reconstructedSessionsAdded, 85);
  assert.equal(legacy.reconstruction.observedPageSessionsAfterGlobalStopped, 186);
  for (const change of [
    (d) => { d.reconstruction.reconstructedSessionsAdded++; },
    (d) => { d.reconstruction.monthlySummary["2026-09"].estimatedSessions++; },
    (d) => { d.reconstruction.reconstructedDates.push("2026-11-04"); },
    (d) => { d.global.uniquesTotal++; },
  ]) {
    const bad = structuredClone(legacy);
    change(bad);
    assert.throws(() => validateLegacy(bad), /rekonstruksjonsmetadata/);
  }
});

test("reconstructed visits reach day, week, month and year totals with estimate labels", () => {
  for (const [start, end, estimated] of [
    ["2026-11-04", "2026-11-04", 2],
    ["2026-11-02", "2026-11-08", 6],
    ["2026-09-01", "2026-09-30", 42],
    ["2026-10-01", "2026-10-31", 36],
    ["2026-11-01", "2026-11-30", 7],
    ["2026-01-01", "2026-12-31", 85],
  ]) {
    const result = combineStats(legacy, empty, period({ start, end }));
    assert.equal(result.historicalEstimatedSessions, estimated);
    assert.equal(result.sessionsTotal, result.historicalExactSessions + estimated);
    assert.equal(result.snapshot.status, "estimated_not_final");
    assert.equal(result.snapshot.through, "2026-11-04");
    if (start !== end) assert.equal(result.uniquesEstimated, true);
  }
  const exactDay = combineStats(legacy, empty, period({ start: "2025-11-07", end: "2025-11-07" }));
  assert.equal(exactDay.historicalEstimatedSessions, 0);
  const all = combineStats(legacy, empty, period({ range: "all" }));
  assert.equal(all.historicalExactSessions, 401);
  assert.equal(all.historicalEstimatedSessions, 85);
  assert.equal(all.historicalUniques, 353);
});

test("production accepts the existing preview snapshot and an intraday cutover after a gap", () => {
  assert.doesNotThrow(() => validateProductionSnapshot(legacy, startAt));
  assert.doesNotThrow(() => validateProductionSnapshot(legacy, "2026-11-10T14:23:45.123+01:00"));
  assert.throws(() => validateProductionSnapshot(legacy, undefined), /POSTHOG_START_AT/);
  assert.throws(() => validateProductionSnapshot(legacy, "2026-11-04T14:23:45+01:00"), /overlapper/);
});

test("Netlify endpoint serves reconstructed days without querying PostHog", async () => {
  const previous = process.env.POSTHOG_START_AT;
  try {
    process.env.POSTHOG_START_AT = startAt;
    const response = await handler({ httpMethod: "GET", rawQuery: "start=2026-10-01&end=2026-10-31" });
    assert.equal(response.statusCode, 200);
    const body = JSON.parse(response.body);
    assert.equal(body.sessionsTotal, 36);
    assert.equal(body.historicalEstimatedSessions, 36);
    assert.equal(body.historicalUniques, 31);
    assert.equal(body.uniquesTotal, 31);
    assert.equal(body.uniquesEstimated, true);
  } finally {
    if (previous === undefined) delete process.env.POSTHOG_START_AT;
    else process.env.POSTHOG_START_AT = previous;
  }
});

test("snapshot has valid totals, unique paths and no identifiers", () => {
  assert.equal(legacy.pages.length, 19);
  assert.equal(legacy.global.sessionsTotal, 486);
  assert.equal(legacy.global.uniquesTotal, 353);
  for (const doc of [legacy.global, ...legacy.pages]) {
    assert.equal(Object.values(doc.days).reduce((n, day) => n + day.sessions, 0), doc.sessionsTotal);
  }
  assert.doesNotMatch(JSON.stringify(legacy), /uniqueHashes|lastSeen|visitorId/);
  assert.throws(() => validateLegacy({ ...legacy, pages: [...legacy.pages, legacy.pages[0]] }), /Duplikat/);
});

test("cutover accepts intraday ISO timestamps and rejects invalid dates and overlapping history", () => {
  assert.equal(period({ range: "all" }).cutoffDate, "2026-11-05");
  assert.throws(() => parsePeriod(new URLSearchParams(), undefined, legacy), /POSTHOG_START_AT/);
  assert.throws(() => parsePeriod(new URLSearchParams(), "2027-02-30T00:00:00+01:00", legacy), /POSTHOG_START_AT/);
  assert.equal(parsePeriod(new URLSearchParams(), "2026-11-05T14:23:45.123+01:00", legacy).startAt, "2026-11-05T13:23:45.123Z");
  assert.equal(parsePeriod(new URLSearchParams(), "2026-11-05T13:23:45Z", legacy).cutoffDate, "2026-11-05");
  assert.throws(() => parsePeriod(new URLSearchParams(), "2026-11-04T00:00:00+01:00", legacy), /overlapper/);
});

test("period dates are real, ordered dates and cannot inject SQL", () => {
  for (const query of [
    { start: "2026-02-30", end: "2026-03-01" },
    { start: "2026-11-06", end: "2026-11-05" },
    { start: "2026-11-05' OR 1=1", end: "2026-11-06" },
    { start: "2026-11-05" },
    { range: "bad" },
  ]) assert.throws(() => period(query), (err) => err.statusCode === 400);
});

test("unique visitor display adds the accepted historical baseline to PostHog", () => {
  const result = combineStats(legacy, {
    sessions: 7, uniques: 4,
    pages: [{ page: "/", sessions: 5, uniques: 3 }, { page: "/dogs/new", sessions: 2, uniques: 1 }],
  }, period({ range: "all" }));
  assert.equal(result.sessionsTotal, 493);
  assert.equal(result.historicalUniques, 353);
  assert.equal(result.posthogUniques, 4);
  assert.equal(result.uniquesTotal, 357);
  assert.equal(result.rows.find((row) => row.page === "/").uniquesTotal, 273);
  assert.equal(result.rows.find((row) => row.page === "/").sessionsTotal, 345);
  assert.equal(result.rows.find((row) => row.page === "/dogs/new").historicalUniques, 0);
  assert.equal(result.rows.filter((row) => row.page === "/").length, 1);
});

test("legacy multi-day uniques are estimates capped at the saved lifetime total", () => {
  assert.deepEqual(historical(legacy.global, period({ start: "2025-11-07", end: "2025-11-07" })), { sessions: 3, uniques: 2 });
  assert.deepEqual(historical(legacy.global, period({ start: "2025-11-07", end: "2025-11-08" })), { sessions: 4, uniques: 3 });
  assert.equal(historical(legacy.global, period({ start: "2026-01-01", end: "2026-12-31" })).uniques, 353);
  assert.deepEqual(historical(legacy.global, period({ start: "2026-11-05", end: "2026-11-06" })), { sessions: 0, uniques: 0 });
});

test("Oslo dates follow summer and winter midnight boundaries", () => {
  assert.equal(osloDate(new Date("2026-11-04T23:00:00Z")), "2026-11-05");
  assert.equal(osloDate(new Date("2026-07-04T22:00:00Z")), "2026-07-05");
});

test("historical periods need no API key and make no network calls", async () => {
  assert.deepEqual(await queryPosthog(period({ start: "2025-11-07", end: "2025-11-08" }), {}, () => { throw new Error("unexpected request"); }), empty);
});

test("admin preserves history, leaves the gap empty and combines new intraday visits", async () => {
  const intraday = "2026-11-10T14:23:45.123+01:00";
  const current = parsePeriod(new URLSearchParams({ range: "all" }), intraday, legacy);
  const gap = parsePeriod(new URLSearchParams({ start: "2026-11-05", end: "2026-11-09" }), intraday, legacy);
  assert.deepEqual(await queryPosthog(gap, {}, () => { throw new Error("unexpected request"); }), empty);
  assert.equal(combineStats(legacy, empty, gap).sessionsTotal, 0);
  const combined = combineStats(legacy, { sessions: 5, uniques: 3, pages: [] }, current);
  assert.equal(combined.sessionsTotal, 491);
  assert.equal(combined.historicalUniques, 353);
  assert.equal(combined.posthogUniques, 3);
  assert.equal(combined.historicalEstimatedSessions, 85);

  // Use a past synthetic snapshot so query generation is independent of today's date.
  const past = parsePeriod(new URLSearchParams({ start: "2020-01-10", end: "2020-01-10" }),
    "2020-01-10T14:23:45.123+01:00", { global: { days: {} }, pages: [] });
  const queries = [];
  await queryPosthog(past, { POSTHOG_PROJECT_ID: "123", POSTHOG_PERSONAL_API_KEY: "test-only" }, async (_, options) => {
    const query = JSON.parse(options.body).query.query;
    queries.push(query);
    return { ok: true, json: async () => ({ results: query.includes("GROUP BY") ? [] : [[0, 0, 0]] }) };
  });
  for (const query of queries) {
    assert.ok(query.includes(`timestamp >= fromUnixTimestamp64Milli(${Date.parse("2020-01-10T13:23:45.123Z")})`));
    assert.ok(query.includes("toDateTime('2020-01-10 00:00:00', 'Europe/Oslo')"));
  }
});

test("queries use cutover, Oslo boundaries, admin filter and configured region", async () => {
  const calls = [];
  const fetcher = async (url, options) => {
    calls.push({ url, options });
    const results = calls.length === 1 ? [[7, 4, 10]] : [["/", 5, 3, 8]];
    return { ok: true, json: async () => ({ results }) };
  };
  // Use a past cutover for deterministic tests regardless of execution host date.
  const oldLegacy = { global: { days: {} }, pages: [] };
  const past = parsePeriod(new URLSearchParams({ range: "all" }), "2020-01-01T00:00:00+01:00", oldLegacy);
  const result = await queryPosthog(past, { POSTHOG_PROJECT_ID: "123", POSTHOG_PERSONAL_API_KEY: "test-only", POSTHOG_REGION: "us" }, fetcher);
  assert.equal(calls.length, 2);
  assert.ok(calls.every((call) => call.url === "https://us.posthog.com/api/projects/123/query/"));
  const query = JSON.parse(calls[0].options.body).query.query;
  assert.ok(query.includes(`fromUnixTimestamp64Milli(${Date.parse("2019-12-31T23:00:00.000Z")})`));
  assert.match(query, /Europe\/Oslo/);
  assert.match(query, /admin/);
  assert.match(query, /deployment_context = 'production'/);
  assert.match(query, /uniqExactIf\(\$session_id/);
  assert.equal(result.sessions, 7);
  assert.equal(result.pages[0].uniques, 3);
});

test("PostHog failures are explicit, never silent zeroes or leaked credentials", async () => {
  const past = parsePeriod(new URLSearchParams({ range: "all" }), "2020-01-01T00:00:00+01:00", { global: { days: {} }, pages: [] });
  const env = { POSTHOG_PROJECT_ID: "123", POSTHOG_PERSONAL_API_KEY: "test-only" };
  await assert.rejects(queryPosthog(past, {}), /miljøvariabler/);
  await assert.rejects(queryPosthog(past, { ...env, POSTHOG_PROJECT_ID: "project-name" }), /POSTHOG_PROJECT_ID.*kun sifre/);
  await assert.rejects(queryPosthog(past, env, async () => ({ ok: false, status: 401 })), /401/);
  await assert.rejects(queryPosthog(past, env, async () => ({ ok: true, json: async () => ({ results: [], is_truncated: true }) })), /Ufullstendig/);
});

test("Netlify handler enforces GET and reports missing cutover", async () => {
  assert.equal((await handler({ httpMethod: "POST" })).statusCode, 405);
  const original = process.env.POSTHOG_START_AT;
  try {
    delete process.env.POSTHOG_START_AT;
    const response = await handler({ httpMethod: "GET", rawQuery: "range=all" });
    assert.equal(response.statusCode, 503);
    assert.match(JSON.parse(response.body).error, /POSTHOG_START_AT/);
  } finally {
    if (original === undefined) delete process.env.POSTHOG_START_AT;
    else process.env.POSTHOG_START_AT = original;
  }
});

test("retired endpoints cannot touch Sanity", async () => {
  for (const name of ["countVisit", "getStats", "getGlobalStats", "getDailyStats", "getRangeStats"]) {
    const { handler: retired } = await import(`../functions/${name}.mjs`);
    assert.equal((await retired({ httpMethod: "POST", body: '{"page":"/"}' })).statusCode, 410);
  }
});
