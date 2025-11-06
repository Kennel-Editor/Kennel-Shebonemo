import { useEffect, useState } from "react";
import sanityClient from "../sanityClient";

const TOP_SLUGS = ["/", "/dogs", "/litters", "/gallery", "/about", "/contact"];

async function fetchGlobal() {
  const r = await fetch(`/.netlify/functions/getGlobalStats`);
  if (!r.ok) throw new Error("Kunne ikke hente global stats");
  return r.json();
}
async function fetchStats(slug) {
  const r = await fetch(
    `/.netlify/functions/getStats?slug=${encodeURIComponent(slug)}`
  );
  if (!r.ok) throw new Error("Kunne ikke hente stats");
  return r.json();
}

async function dogIds() {
  return sanityClient.fetch(`*[_type=="dog"]._id`);
}
async function litterIds() {
  return sanityClient.fetch(`*[_type=="litter"]._id`);
}
async function galleryIds() {
  return sanityClient.fetch(`*[_type=="gallery"]._id`);
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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const globalData = await fetchGlobal();

        const topRows = await Promise.all(TOP_SLUGS.map(fetchStats));

        const [dogs, litters, galleries] = await Promise.all([
          dogIds(),
          litterIds(),
          galleryIds(),
        ]);

        const dogRows = await Promise.all(
          (dogs || []).map((id) => fetchStats(`/dogs/${id}`))
        );
        const litterRows = await Promise.all(
          (litters || []).map((id) => fetchStats(`/litters/${id}`))
        );
        const galleryRows = await Promise.all(
          (galleries || []).map((id) => fetchStats(`/gallery/${id}`))
        );

        if (!cancelled) {
          setRows(topRows);
          setChildrenByGroup({
            "/dogs": dogRows.sort(
              (a, b) => (b.sessionsTotal || 0) - (a.sessionsTotal || 0)
            ),
            "/litters": litterRows.sort(
              (a, b) => (b.sessionsTotal || 0) - (a.sessionsTotal || 0)
            ),
            "/gallery": galleryRows.sort(
              (a, b) => (b.sessionsTotal || 0) - (a.sessionsTotal || 0)
            ),
          });
          setGlobal({
            sessionsTotal: Number(globalData.sessionsTotal || 0),
            sessionsToday: Number(globalData.sessionsToday || 0),
            uniquesGlobal: Number(globalData.uniquesGlobal || 0),
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
      const globalData = await fetchGlobal();

      const topRows = await Promise.all(TOP_SLUGS.map(fetchStats));

      const [dogs, litters, galleries] = await Promise.all([
        dogIds(),
        litterIds(),
        galleryIds(),
      ]);

      const dogRows = await Promise.all(
        (dogs || []).map((id) => fetchStats(`/dogs/${id}`))
      );
      const litterRows = await Promise.all(
        (litters || []).map((id) => fetchStats(`/litters/${id}`))
      );
      const galleryRows = await Promise.all(
        (galleries || []).map((id) => fetchStats(`/gallery/${id}`))
      );

      setRows(topRows);
      setChildrenByGroup({
        "/dogs": dogRows.sort(
          (a, b) => (b.sessionsTotal || 0) - (a.sessionsTotal || 0)
        ),
        "/litters": litterRows.sort(
          (a, b) => (b.sessionsTotal || 0) - (a.sessionsTotal || 0)
        ),
        "/gallery": galleryRows.sort(
          (a, b) => (b.sessionsTotal || 0) - (a.sessionsTotal || 0)
        ),
      });
      setGlobal({
        sessionsTotal: Number(globalData.sessionsTotal || 0),
        sessionsToday: Number(globalData.sessionsToday || 0),
        uniquesGlobal: Number(globalData.uniquesGlobal || 0),
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
    dailyToday: { sessionsTotal: global.sessionsToday },
    lifetime: {
      sessionsTotal: global.sessionsTotal,
      uniquesGlobal: global.uniquesGlobal,
    },
    reloadAll,
  };
}
