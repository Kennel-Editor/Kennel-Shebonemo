import { useEffect, useState } from "react";
import { fetchPosthogStats } from "../counter/utils/posthogStats";
import sanityClient from "../sanityClient";

const TOP_SLUGS = ["/", "/dogs", "/litters", "/gallery", "/about", "/contact"];
const empty = { sessionsTotal: 0, historicalUniques: 0, posthogUniques: 0, rows: [] };

// Preserve the existing content lookups so unvisited detail pages still appear.
// These queries fetch content IDs, never visit statistics.
async function fetchContentPaths() {
  const [dogs, litters, galleries] = await Promise.all([
    sanityClient.fetch('*[_type=="dog"]._id'),
    sanityClient.fetch('*[_type=="litter"]._id'),
    sanityClient.fetch('*[_type=="gallery"]._id'),
  ]);
  return [
    ...(dogs || []).map((id) => `/dogs/${id}`),
    ...(litters || []).map((id) => `/litters/${id}`),
    ...(galleries || []).map((id) => `/gallery/${id}`),
  ];
}

export default function useAdminData() {
  const [all, setAll] = useState(empty);
  const [today, setToday] = useState(empty);
  const [contentPaths, setContentPaths] = useState([]);
  const [expanded, setExpanded] = useState({ "/dogs": false, "/litters": false, "/gallery": false });
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);
  const [error, setError] = useState("");
  const [refTs, setRefTs] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetchPosthogStats({ range: "all" }),
      fetchPosthogStats({ range: "today" }),
      fetchContentPaths(),
    ]).then(([total, day, paths]) => {
      if (cancelled) return;
      setAll(total);
      setToday(day);
      setContentPaths(paths);
      setError("");
    }).catch((err) => {
      if (!cancelled) setError(err.message);
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  async function reloadAll() {
    setReloading(true);
    try {
      const [total, day, paths] = await Promise.all([
        fetchPosthogStats({ range: "all" }), fetchPosthogStats({ range: "today" }),
        fetchContentPaths(),
      ]);
      setAll(total);
      setToday(day);
      setContentPaths(paths);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setRefTs(Date.now());
      setReloading(false);
    }
  }

  const dayMap = new Map(today.rows.map((row) => [row.page, row]));
  const rowsByPage = new Map(all.rows.map((row) => [row.page, {
    ...row, sessionsToday: dayMap.get(row.page)?.sessionsTotal || 0,
  }]));
  for (const page of contentPaths) {
    if (!rowsByPage.has(page)) rowsByPage.set(page, {
      page, sessionsTotal: 0, sessionsToday: 0, historicalUniques: 0, posthogUniques: 0,
    });
  }
  const rows = TOP_SLUGS.map((page) => rowsByPage.get(page) || {
    page, sessionsTotal: 0, sessionsToday: 0, historicalUniques: 0, posthogUniques: 0,
  });
  const childrenByGroup = Object.fromEntries(["/dogs", "/litters", "/gallery"].map((group) => [
    group, [...rowsByPage.values()].filter((row) => row.page.startsWith(`${group}/`))
      .sort((a, b) => b.sessionsTotal - a.sessionsTotal),
  ]));

  return {
    rows, childrenByGroup, expanded, setExpanded, loading, reloading, error, refTs, reloadAll,
    global: all,
    dailyToday: { sessionsTotal: today.sessionsTotal },
    lifetime: { sessionsTotal: all.sessionsTotal },
  };
}
