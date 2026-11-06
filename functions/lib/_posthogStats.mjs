export function osloDate(date = new Date()) {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Oslo" }).format(date);
}

export function validDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value || "") &&
    Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}

export function validateLegacy(data) {
  if (!data?.global || !Array.isArray(data.pages)) throw new Error("Ugyldig historikkformat");
  const seen = new Set();
  for (const doc of [data.global, ...data.pages]) {
    if (typeof doc.page !== "string" || !doc.page.startsWith("/") ||
      !doc.days || Array.isArray(doc.days) || typeof doc.days !== "object") {
      throw new Error("Ugyldig historikkside");
    }
    for (const count of [doc.sessionsTotal, doc.uniquesTotal]) {
      if (!Number.isSafeInteger(count) || count < 0) throw new Error("Ugyldig historikktall");
    }
    for (const [day, counts] of Object.entries(doc.days)) {
      if (!validDate(day) || ![counts.sessions, counts.uniques].every(
        (n) => Number.isSafeInteger(n) && n >= 0,
      )) throw new Error("Ugyldig historikkdag");
    }
  }
  for (const page of data.pages) {
    if (seen.has(page.page)) throw new Error("Duplikat i historikksider");
    seen.add(page.page);
  }
  const r = data.reconstruction;
  if (r) {
    const fail = () => { throw new Error("Ugyldige rekonstruksjonsmetadata"); };
    if (!["estimated_not_final", "final"].includes(r.status) ||
      !validDate(r.originalGlobalLastDate) || !validDate(r.reconstructedThrough) ||
      r.originalGlobalLastDate >= r.reconstructedThrough ||
      !Array.isArray(r.reconstructedDates) || !r.monthlySummary ||
      !r.globalSessionsMethod || !r.globalUniqueMethod) fail();
    const dates = r.reconstructedDates;
    if (new Set(dates).size !== dates.length || dates.length !== r.reconstructedDayCount ||
      dates.some((day) => !validDate(day) || day <= r.originalGlobalLastDate ||
        day > r.reconstructedThrough || !data.global.days[day]) ||
      Object.keys(data.global.days).some((day) => day > r.originalGlobalLastDate && !dates.includes(day))) fail();
    const added = dates.reduce((sum, day) => sum + data.global.days[day].sessions, 0);
    const original = Object.entries(data.global.days).filter(([day]) => day <= r.originalGlobalLastDate)
      .reduce((sum, [, counts]) => sum + counts.sessions, 0);
    if (original !== r.originalGlobalSessionsTotal || added !== r.reconstructedSessionsAdded ||
      original + added !== data.global.sessionsTotal ||
      !Number.isSafeInteger(r.distinctNewVisitorHashesAfterGlobalStopped) ||
      r.distinctNewVisitorHashesAfterGlobalStopped < 0 ||
      r.originalGlobalUniquesTotal + r.distinctNewVisitorHashesAfterGlobalStopped !== data.global.uniquesTotal) fail();
    const months = [...new Set(dates.map((day) => day.slice(0, 7)))];
    if (Object.keys(r.monthlySummary).length !== months.length) fail();
    let observed = 0;
    for (const month of months) {
      const days = dates.filter((day) => day.startsWith(month));
      const summary = r.monthlySummary[month];
      const pageSessions = data.pages.reduce((sum, page) => sum + Object.entries(page.days)
        .filter(([day]) => day.startsWith(month) && day > r.originalGlobalLastDate && day <= r.reconstructedThrough)
        .reduce((n, [, counts]) => n + counts.sessions, 0), 0);
      if (!summary || summary.days !== days.length || summary.pageSessions !== pageSessions ||
        summary.estimatedSessions !== days.reduce((n, day) => n + data.global.days[day].sessions, 0) ||
        summary.dailyUniques !== days.reduce((n, day) => n + data.global.days[day].uniques, 0)) fail();
      observed += pageSessions;
    }
    if (observed !== r.observedPageSessionsAfterGlobalStopped) fail();
  }
  return data;
}

// The existing snapshot and a gap before PostHog are explicitly accepted.
// Still validate the data, timestamp and absence of overlapping historical days.
export function validateProductionSnapshot(data, startAt) {
  validateLegacy(data);
  parsePeriod(new URLSearchParams({ range: "all" }), startAt, data);
}

export function parsePeriod(params, startAt, legacy) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(startAt || "") ||
    !validDate(startAt.slice(0, 10)) ||
    !Number.isFinite(Date.parse(startAt))) throw new Error("POSTHOG_START_AT må være et ISO-tidspunkt");
  const cutover = new Date(startAt);
  const cutoffDate = osloDate(cutover);
  const lastLegacyDay = Object.keys(legacy.global.days).concat(
    legacy.pages.flatMap((page) => Object.keys(page.days)),
  ).sort().at(-1);
  if (lastLegacyDay >= cutoffDate) throw new Error("Historikken overlapper PostHog-starten");
  const all = params.get("range") === "all";
  const hasDates = params.has("start") || params.has("end");
  const start = hasDates ? params.get("start") : (all ? "0001-01-01" : osloDate());
  const end = hasDates ? params.get("end") : osloDate();
  if (!validDate(start) || !validDate(end) || start > end) {
    const error = new Error("Ugyldig start/slutt-dato");
    error.statusCode = 400;
    throw error;
  }
  if (!hasDates && ![null, "today", "all"].includes(params.get("range"))) {
    const error = new Error("Ugyldig range");
    error.statusCode = 400;
    throw error;
  }
  return { all: all && !hasDates, start, end, cutoffDate, startAt: cutover.toISOString(), lastLegacyDay };
}

export function historical(doc, period) {
  if (period.all) return { sessions: doc?.sessionsTotal || 0, uniques: doc?.uniquesTotal || 0 };
  const days = Object.entries(doc?.days || {}).filter(([day]) => day >= period.start && day <= period.end);
  return {
    sessions: days.reduce((sum, [, day]) => sum + day.sessions, 0),
    // Multi-day history is an estimate: cap daily sums at the saved lifetime total.
    uniques: Math.min(doc?.uniquesTotal || 0, days.reduce((sum, [, day]) => sum + day.uniques, 0)),
  };
}

export function combineStats(legacy, posthog, period) {
  const history = historical(legacy.global, period);
  const reconstruction = legacy.reconstruction;
  const estimatedSessions = (reconstruction?.reconstructedDates || [])
    .filter((day) => period.all || (day >= period.start && day <= period.end))
    .reduce((sum, day) => sum + legacy.global.days[day].sessions, 0);
  const pages = new Map(legacy.pages.map((page) => [page.page, {
    page: page.page, historical: historical(page, period),
    posthog: { sessions: 0, uniques: 0, pageviews: 0 },
  }]));
  for (const page of posthog.pages) {
    const row = pages.get(page.page) || { page: page.page, historical: { sessions: 0, uniques: 0 } };
    row.posthog = page;
    pages.set(page.page, row);
  }
  return {
    period,
    sessionsTotal: history.sessions + posthog.sessions,
    historicalUniques: history.uniques,
    posthogUniques: posthog.uniques,
    uniquesTotal: history.uniques + posthog.uniques,
    uniquesEstimated: !period.all && period.start !== period.end && history.sessions > 0,
    historicalExactSessions: history.sessions - estimatedSessions,
    historicalEstimatedSessions: estimatedSessions,
    snapshot: reconstruction ? {
      status: reconstruction.status,
      through: reconstruction.reconstructedThrough,
      estimatedAfter: reconstruction.originalGlobalLastDate,
    } : null,
    rows: [...pages.values()].map((row) => ({
      page: row.page,
      sessionsTotal: row.historical.sessions + row.posthog.sessions,
      historicalUniques: row.historical.uniques,
      posthogUniques: row.posthog.uniques,
      uniquesTotal: row.historical.uniques + row.posthog.uniques,
    })),
  };
}

export async function queryPosthog(period, env, fetcher = fetch, { trafficOnly = false } = {}) {
  const empty = { sessions: 0, uniques: 0, pages: [], ...(trafficOnly ? { traffic: { countries: [], sources: [] } } : {}) };
  if (period.end < period.cutoffDate || Date.parse(period.startAt) > Date.now()) return empty;
  if (!env.POSTHOG_PROJECT_ID || !env.POSTHOG_PERSONAL_API_KEY) {
    throw new Error("Mangler PostHog-miljøvariabler på serveren");
  }
  if (!/^\d+$/.test(env.POSTHOG_PROJECT_ID)) {
    throw new Error("POSTHOG_PROJECT_ID må være en numerisk prosjekt-ID (kun sifre), ikke prosjektnavn, URL eller API-nøkkel");
  }
  const hosts = { eu: "https://eu.posthog.com", us: "https://us.posthog.com" };
  const host = hosts[env.POSTHOG_REGION || "eu"];
  if (!host) throw new Error("POSTHOG_REGION må være eu eller us");
  const dateFilter = `timestamp >= fromUnixTimestamp64Milli(${Date.parse(period.startAt)})
    AND timestamp >= toDateTime('${period.start === "0001-01-01" ? period.cutoffDate : period.start} 00:00:00', 'Europe/Oslo')
    AND timestamp < toDateTime('${period.end} 00:00:00', 'Europe/Oslo') + INTERVAL 1 DAY`;
  const where = `event = '$pageview' AND ${dateFilter}
    AND properties.deployment_context = 'production'
    AND properties.pathname IS NOT NULL
    AND NOT match(properties.pathname, '(?i)^/admin(/|$)')`;
  async function run(query) {
    const response = await fetcher(`${host}/api/projects/${env.POSTHOG_PROJECT_ID}/query/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${env.POSTHOG_PERSONAL_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query: { kind: "HogQLQuery", query } }),
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) throw new Error(`Kunne ikke hente PostHog-statistikk (${response.status})`);
    const data = await response.json();
    if (!Array.isArray(data.results) || data.next || data.hasMore || data.is_truncated) {
      throw new Error("Ufullstendig svar fra PostHog");
    }
    return data.results;
  }
  if (trafficOnly) {
    // One country per distinct visitor within this period, not per pageview.
    const countriesQuery = `SELECT coalesce(nullIf(country, ''), 'Ukjent') AS countryName, count() AS visitors
      FROM (
        SELECT distinct_id, argMin(properties.$geoip_country_name, timestamp) AS country
        FROM events WHERE ${where} GROUP BY distinct_id
      ) GROUP BY countryName ORDER BY visitors DESC, countryName LIMIT 10`;
    // One source per session, using the first pageview's external referrer.
    const sourcesQuery = `SELECT source, count() AS sessions FROM (
      SELECT CASE
        WHEN referrer IS NULL OR referrer = '' OR referrer = '$direct' THEN 'Direkte'
        WHEN positionCaseInsensitive(referrer, 'google.') > 0 THEN 'Google'
        WHEN positionCaseInsensitive(referrer, 'facebook.com') > 0 OR positionCaseInsensitive(referrer, 'fb.com') > 0 THEN 'Facebook'
        WHEN positionCaseInsensitive(referrer, 'instagram.com') > 0 THEN 'Instagram'
        WHEN positionCaseInsensitive(referrer, 'bing.com') > 0 THEN 'Bing'
        ELSE 'Andre' END AS source
      FROM (
        SELECT $session_id AS sessionId, argMin(properties.$referrer, timestamp) AS referrer
        FROM events WHERE ${where} AND $session_id IS NOT NULL AND toString($session_id) != ''
        GROUP BY sessionId
      )
    ) GROUP BY source ORDER BY sessions DESC, source`;
    const [countries, sources] = await Promise.all([run(countriesQuery), run(sourcesQuery)]);
    const validTraffic = (rows) => rows.every((row) => row.length === 2 &&
      typeof row[0] === "string" && row[0].length > 0 && row[1] !== null && row[1] !== "" &&
      Number.isSafeInteger(Number(row[1])) && Number(row[1]) >= 0);
    if (!validTraffic(countries) || !validTraffic(sources)) throw new Error("Ugyldige trafikktall i PostHog-svaret");
    return { ...empty, traffic: {
      countries: countries.map(([country, visitors]) => ({ country, visitors: Number(visitors) })),
      sources: sources.map(([source, sessions]) => ({ source, sessions: Number(sessions) })),
    } };
  }
  const metrics = "uniqExactIf($session_id, $session_id IS NOT NULL AND toString($session_id) != ''), uniqExact(distinct_id), count()";
  const [totals, pages] = await Promise.all([
    run(`SELECT ${metrics} FROM events WHERE ${where}`),
    run(`SELECT properties.pathname, ${metrics} FROM events WHERE ${where} GROUP BY properties.pathname LIMIT 10000`),
  ]);
  if (pages.length >= 10000) throw new Error("For mange sider i PostHog-svaret");
  const validCounts = (row) => row.length === 3 && row.every((count) =>
    count !== null && count !== "" && Number.isSafeInteger(Number(count)) && Number(count) >= 0);
  if (totals.length !== 1 || !validCounts(totals[0]) || pages.some((row) =>
    typeof row[0] !== "string" || !row[0].startsWith("/") || !validCounts(row.slice(1)))) {
    throw new Error("Ugyldige tall i PostHog-svaret");
  }
  return {
    sessions: Number(totals[0]?.[0] || 0), uniques: Number(totals[0]?.[1] || 0),
    pages: pages.map(([page, sessions, uniques, pageviews]) => ({
      page, sessions: Number(sessions), uniques: Number(uniques), pageviews: Number(pageviews),
    })),
  };
}
