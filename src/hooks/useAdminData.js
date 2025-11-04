import { useEffect, useState } from "react";

const slugs = ["/", "/dogs", "/litters", "/gallery", "/about", "/contact"];

async function fetchStats(slug) {
  const r = await fetch(
    `/.netlify/functions/getStats?slug=${encodeURIComponent(slug)}`
  );
  if (!r.ok) throw new Error("Kunne ikke hente stats");
  return r.json();
}
async function fetchStatsAll() {
  const r = await fetch(`/.netlify/functions/getStats?all=1`);
  if (!r.ok) throw new Error("Kunne ikke hente alle stats");
  const json = await r.json();
  return Array.isArray(json?.rows) ? json.rows : [];
}
async function fetchGlobal() {
  const r = await fetch(`/.netlify/functions/getGlobalStats`);
  if (!r.ok) throw new Error("Kunne ikke hente global stats");
  return r.json();
}
function ymdOslo(d = new Date()) {
  const parts = new Intl.DateTimeFormat("no-NO", {
    timeZone: "Europe/Oslo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const y = parts.find((p) => p.type === "year")?.value || "";
  const m = parts.find((p) => p.type === "month")?.value || "";
  const dd = parts.find((p) => p.type === "day")?.value || "";
  return `${y}-${m}-${dd}`;
}
async function fetchDaily(date) {
  const params = new URLSearchParams({
    date: String(date).replace(/[^\d-]/g, ""),
  });
  for (const s of slugs) params.append("slug", s);
  const r = await fetch(
    `/.netlify/functions/getDailyStats?${params.toString()}`
  );
  if (!r.ok) throw new Error("Kunne ikke hente daglig stats");
  return r.json();
}
async function fetchLifetime() {
  const params = new URLSearchParams({ start: "2000-01-01", end: ymdOslo() });
  for (const s of slugs) params.append("slug", s);
  const r = await fetch(
    `/.netlify/functions/getRangeStats?${params.toString()}`
  );
  if (!r.ok) throw new Error("Kunne ikke hente livstid stats");
  return r.json();
}

export default function useAdminData() {
  const [rows, setRows] = useState([]);
  const [childrenByGroup, setChildrenByGroup] = useState({
    "/dogs": [],
    "/litters": [],
    "/gallery": [],
  });
  const [expanded, setExpanded] = useState({
    "/dogs": false,
    "/litters": false,
    "/gallery": false,
  });
  const [global, setGlobal] = useState({
    sessionsTotal: 0,
    sessionsToday: 0,
    uniquesGlobal: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refTs, setRefTs] = useState(Date.now());
  const [reloading, setReloading] = useState(false);
  const [dailyToday, setDailyToday] = useState({
    date: ymdOslo(),
    sessionsTotal: 0,
    uniquesGlobal: 0,
    rows: [],
  });
  const [lifetime, setLifetime] = useState({
    sessionsTotal: 0,
    uniquesGlobal: 0,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [rowData, allRows, globalData, todayData, lifetimeData] =
          await Promise.all([
            Promise.all(slugs.map(fetchStats)),
            fetchStatsAll(),
            fetchGlobal(),
            fetchDaily(ymdOslo()),
            fetchLifetime(),
          ]);
        if (!cancelled) {
          setRows(rowData);
          const dogs = allRows
            .filter(
              (r) =>
                (r.page || "").startsWith("/dogs/") &&
                Number(r.sessionsTotal || 0) > 0
            )
            .sort((a, b) => (b.sessionsTotal || 0) - (a.sessionsTotal || 0));
          const litters = allRows
            .filter(
              (r) =>
                (r.page || "").startsWith("/litters/") &&
                Number(r.sessionsTotal || 0) > 0
            )
            .sort((a, b) => (b.sessionsTotal || 0) - (a.sessionsTotal || 0));
          const gallery = allRows
            .filter(
              (r) =>
                (r.page || "").startsWith("/gallery/") &&
                Number(r.sessionsTotal || 0) > 0
            )
            .sort((a, b) => (b.sessionsTotal || 0) - (a.sessionsTotal || 0));
          setChildrenByGroup({
            "/dogs": dogs,
            "/litters": litters,
            "/gallery": gallery,
          });
          setGlobal(globalData);
          setDailyToday(todayData);
          setLifetime({
            sessionsTotal: Number(lifetimeData.sessionsTotal || 0),
            uniquesGlobal: Number(lifetimeData.uniquesGlobal || 0),
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setRefTs(Date.now());
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function reloadAll() {
    setReloading(true);
    try {
      const [rowData, allRows, globalData, todayData, lifetimeData] =
        await Promise.all([
          Promise.all(slugs.map(fetchStats)),
          fetchStatsAll(),
          fetchGlobal(),
          fetchDaily(ymdOslo()),
          fetchLifetime(),
        ]);
      setRows(rowData);
      const dogs = allRows
        .filter(
          (r) =>
            (r.page || "").startsWith("/dogs/") &&
            Number(r.sessionsTotal || 0) > 0
        )
        .sort((a, b) => (b.sessionsTotal || 0) - (a.sessionsTotal || 0));
      const litters = allRows
        .filter(
          (r) =>
            (r.page || "").startsWith("/litters/") &&
            Number(r.sessionsTotal || 0) > 0
        )
        .sort((a, b) => (b.sessionsTotal || 0) - (a.sessionsTotal || 0));
      const gallery = allRows
        .filter(
          (r) =>
            (r.page || "").startsWith("/gallery/") &&
            Number(r.sessionsTotal || 0) > 0
        )
        .sort((a, b) => (b.sessionsTotal || 0) - (a.sessionsTotal || 0));
      setChildrenByGroup({
        "/dogs": dogs,
        "/litters": litters,
        "/gallery": gallery,
      });
      setGlobal(globalData);
      setDailyToday(todayData);
      setLifetime({
        sessionsTotal: Number(lifetimeData.sessionsTotal || 0),
        uniquesGlobal: Number(lifetimeData.uniquesGlobal || 0),
      });
      setRefTs(Date.now());
    } finally {
      setReloading(false);
    }
  }

  return {
    rows,
    childrenByGroup,
    expanded,
    setExpanded,
    global,
    loading,
    refTs,
    reloading,
    dailyToday,
    lifetime,
    reloadAll,
  };
}
