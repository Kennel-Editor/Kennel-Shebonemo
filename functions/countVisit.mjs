import { client } from "./lib/_sanityClient.mjs";
import { isLikelyBot, osloDateStr, hashVisitorId } from "./lib/_utils.mjs";

function toStatsId(slug) {
  if (!slug || slug === "/") return "stats.home";
  let s = String(slug).replace(/^\/+/, "");
  s = s.replace(/\/+/g, "__");
  s = s.replace(/[^\w-]+/g, "_");
  s = s.slice(0, 120) || "home";
  return `stats.${s}`;
}

const SESSION_MS = 30 * 60 * 1000;
const GLOBAL_ID = "stats.global";

export const handler = async (event) => {
  if (event.httpMethod !== "POST")
    return { statusCode: 405, body: "Method Not Allowed" };

  const ua = event.headers["user-agent"] || "";
  const dnt = event.headers["dnt"] === "1";
  if (isLikelyBot(ua)) return json({ counted: false, reason: "bot" });

  if (
    process.env.URL?.includes("localhost") ||
    process.env.NODE_ENV === "development"
  ) {
    return json({ counted: false, reason: "ignore-localhost" });
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: "Bad Request" };
  }

  const page = String(body.page || "").slice(0, 256);
  const visitorId = String(body.visitorId || "").slice(0, 128);
  if (!page || !visitorId) return { statusCode: 400, body: "Missing fields" };
  if (/^\/admin(\/|$)/i.test(page))
    return json({ counted: false, reason: "ignore-admin" });

  const vHash = hashVisitorId(visitorId);
  const today = osloDateStr(new Date());
  const now = Date.now();
  const docId = toStatsId(page);

  async function upsertAndCount(targetId, pageValue) {
    for (let attempt = 0; attempt < 3; attempt++) {
      const doc = await client.getDocument(targetId);
      if (!doc) {
        await client.createIfNotExists({
          _id: targetId,
          _type: "pageStats",
          page: pageValue,
          sessionsTotal: 0,
          sessionsToday: 0,
          sessionsTodayDate: today,
          uniquesTotal: 0,
          uniqueHashes: [],
          sessions: [],
          days: {},
        });
      }

      const fresh = await client.getDocument(targetId);
      const sessions = Array.isArray(fresh.sessions) ? fresh.sessions : [];
      const sessionsTotal = Number(fresh.sessionsTotal || 0);
      const sessionsToday = Number(fresh.sessionsToday || 0);
      const sessionsTodayDate = fresh.sessionsTodayDate || today;
      const uniqueHashes = Array.isArray(fresh.uniqueHashes)
        ? fresh.uniqueHashes
        : [];
      const days =
        typeof fresh.days === "object" && fresh.days !== null ? fresh.days : {};

      const cutoff = now - SESSION_MS;
      const cleaned = sessions.filter(
        (s) => Number(s?.lastSeen) >= cutoff && s?.hash
      );
      const idx = cleaned.findIndex((s) => s.hash === vHash);
      const alreadyActive = idx !== -1;
      if (alreadyActive) cleaned[idx] = { hash: vHash, lastSeen: now };
      else cleaned.push({ hash: vHash, lastSeen: now });

      const counted = !alreadyActive;

      const nextSessionsTotal = sessionsTotal + (counted ? 1 : 0);
      let nextSessionsTodayDate = sessionsTodayDate;
      let nextSessionsToday = sessionsToday;
      if (sessionsTodayDate === today) {
        nextSessionsToday = sessionsToday + (counted ? 1 : 0);
      } else {
        nextSessionsTodayDate = today;
        nextSessionsToday = counted ? 1 : 0;
      }

      let nextUniquesTotal = Number(fresh.uniquesTotal || 0);
      let nextUniqueHashes = uniqueHashes;
      if (!dnt && !uniqueHashes.includes(vHash)) {
        nextUniquesTotal += 1;
        nextUniqueHashes =
          uniqueHashes.length > 100000
            ? uniqueHashes.slice(uniqueHashes.length - 100000)
            : uniqueHashes;
        nextUniqueHashes = [...nextUniqueHashes, vHash];
      }

      const dayEntry = days[today] || { sessions: 0, uniques: 0, hashes: [] };
      const dayHashes = Array.isArray(dayEntry.hashes) ? dayEntry.hashes : [];
      const dayHas = dayHashes.includes(vHash);
      const daySessions = Number(dayEntry.sessions || 0) + (counted ? 1 : 0);
      const dayUniques = dayHas
        ? Number(dayEntry.uniques || 0)
        : Number(dayEntry.uniques || 0) + (dnt ? 0 : 1);
      const nextDay = {
        sessions: daySessions,
        uniques: dayUniques,
        hashes: dnt ? dayHashes : dayHas ? dayHashes : [...dayHashes, vHash],
      };
      const nextDays = { ...days, [today]: nextDay };

      const withKeys = (arr) =>
        (arr || []).map((s) => {
          const base = String(s?.hash || "");
          const key = s?._key || `s_${base}`;
          return { _key: key, hash: s.hash, lastSeen: s.lastSeen };
        });

      try {
        await client
          .transaction()
          .patch(targetId, (p) =>
            p.ifRevisionId(fresh._rev).set({
              page: pageValue,
              sessionsTodayDate: nextSessionsTodayDate,
              uniqueHashes: nextUniqueHashes,
              sessions: withKeys(cleaned),
              sessionsTotal: nextSessionsTotal,
              sessionsToday: nextSessionsToday,
              uniquesTotal: nextUniquesTotal,
              days: nextDays,
            })
          )
          .commit({ visibility: "async" });

        return {
          counted,
          totals: {
            sessionsTotal: nextSessionsTotal,
            sessionsToday: nextSessionsToday,
            uniquesTotal: nextUniquesTotal,
          },
        };
      } catch (e) {
        if (e?.statusCode === 409) continue;
        return { error: true };
      }
    }
    return { error: true };
  }

  const perPage = await upsertAndCount(docId, page);
  const global = await upsertAndCount(GLOBAL_ID, "/");

  if (perPage.error || global.error)
    return { statusCode: 500, body: "Server Error" };

  return json({
    counted: { perPage: perPage.counted, global: global.counted },
    page,
    today,
    totals: { perPage: perPage.totals, global: global.totals },
  });
};

function json(obj) {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(obj),
  };
}
