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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [rowData, globalData] = await Promise.all([
          Promise.all(slugs.map(fetchStats)),
          fetchGlobal(),
        ]);
        if (!cancelled) {
          setRows(rowData);
          setGlobal(globalData);
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

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, r) => ({
          sessions: acc.sessions + Number(r.sessionsTotal || 0),
          today: acc.today + Number(r.sessionsToday || 0),
        }),
        { sessions: 0, today: 0 }
      ),
    [rows]
  );

  async function reloadAll() {
    setReloading(true);
    try {
      const [rowData, globalData] = await Promise.all([
        Promise.all(slugs.map(fetchStats)),
        fetchGlobal(),
      ]);
      setRows(rowData);
      setGlobal(globalData);
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
        <Btn onClick={reloadAll}>{reloading ? "Oppdaterer…" : "Oppdater"}</Btn>
      </Sub>

      <KPIGrid>
        <KPICard>
          <KPIName>Besøk totalt</KPIName>
          <KPIValue>{nf.format(totals.sessions)}</KPIValue>
        </KPICard>
        <KPICard>
          <KPIName>Besøk i dag</KPIName>
          <KPIValue>{nf.format(totals.today)}</KPIValue>
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
              <Th>Sessions total</Th>
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
        <RollingPanels />
      </RangeGrid>
    </Wrap>
  );
}
