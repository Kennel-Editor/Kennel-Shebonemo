import { useEffect, useMemo, useState } from "react";
import {
  Wrap,
  Title,
  Sub,
  KPIGrid,
  KPICard,
  KPIName,
  KPIValue,
  TableWrap,
  Table,
  Th,
  Td,
  Badge,
  Btn,
  RangeGrid,
  SectionTitle,
} from "./Admin.styled";
import RollingPanels from "../counter/components/RollingPanels";
import { MiniPawSpinner } from "../utils/LoadingSpinner";

const labels = {
  "/": "Hjem",
  "/dogs": "Våre hunder",
  "/litters": "Valpekull",
  "/gallery": "Galleri",
  "/about": "Om oss",
  "/contact": "Kontakt",
};

const slugs = ["/", "/dogs", "/litters", "/gallery", "/about", "/contact"];
const nf = new Intl.NumberFormat("no-NO");

async function fetchStats(slug) {
  const r = await fetch(
    `/.netlify/functions/getStats?slug=${encodeURIComponent(slug)}`
  );
  if (!r.ok) throw new Error("Kunne ikke hente stats");
  return r.json();
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
  const params = new URLSearchParams({
    start: "2000-01-01",
    end: ymdOslo(),
  });
  for (const s of slugs) params.append("slug", s);
  const r = await fetch(
    `/.netlify/functions/getRangeStats?${params.toString()}`
  );
  if (!r.ok) throw new Error("Kunne ikke hente livstid stats");
  return r.json();
}

export default function Admin() {
  const [rows, setRows] = useState([]);
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
        const [rowData, globalData, todayData, lifetimeData] =
          await Promise.all([
            Promise.all(slugs.map(fetchStats)),
            fetchGlobal(),
            fetchDaily(ymdOslo()),
            fetchLifetime(),
          ]);

        if (!cancelled) {
          setRows(rowData);
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
      const [rowData, globalData, todayData, lifetimeData] = await Promise.all([
        Promise.all(slugs.map(fetchStats)),
        fetchGlobal(),
        fetchDaily(ymdOslo()),
        fetchLifetime(),
      ]);
      setLifetime({
        sessionsTotal: Number(lifetimeData.sessionsTotal || 0),
        uniquesGlobal: Number(lifetimeData.uniquesGlobal || 0),
      });

      setRows(rowData);
      setGlobal(globalData);
      setDailyToday(todayData);
      setRefTs(Date.now());
    } finally {
      setReloading(false);
    }
  }

  return (
    <Wrap>
      <Title>Kontrollpanel</Title>
      <Sub>
        Sist oppdatert: {new Date(refTs).toLocaleString("no-NO")}{" "}
        <Badge>{loading ? "Laster…" : "Oppdatert"}</Badge>{" "}
        <Btn onClick={reloadAll} disabled={reloading} aria-busy={reloading}>
          {reloading ? <MiniPawSpinner style={{ marginRight: 8 }} /> : null}
          {reloading ? "Oppdaterer…" : "Oppdater"}
        </Btn>
      </Sub>

      <KPIGrid>
        <KPICard>
          <KPIName>Besøk i dag</KPIName>
          <KPIValue>
            {nf.format(Number(dailyToday.sessionsTotal || 0))}
          </KPIValue>
        </KPICard>

        <KPICard>
          <KPIName>Besøk totalt</KPIName>
          <KPIValue>{nf.format(Number(lifetime.sessionsTotal || 0))}</KPIValue>
        </KPICard>

        <KPICard>
          <KPIName>Unike besøkere (alle tider)</KPIName>
          <KPIValue>{nf.format(global.uniquesGlobal)}</KPIValue>
        </KPICard>
      </KPIGrid>

      <TableWrap>
        <Table>
          <thead>
            <tr>
              <Th>Side</Th>
              <Th>besøk total</Th>
              <Th>I dag</Th>
              <Th>Unike</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.page}>
                <Td>{labels[r.page] || r.page}</Td>
                <Td>{nf.format(Number(r.sessionsTotal || 0))}</Td>
                <Td>{nf.format(Number(r.sessionsToday || 0))}</Td>
                <Td>{nf.format(Number(r.uniquesTotal || 0))}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>

      <SectionTitle>Rullerende oversikt</SectionTitle>
      <RangeGrid>
        <RollingPanels refreshKey={refTs} />
      </RangeGrid>
    </Wrap>
  );
}
