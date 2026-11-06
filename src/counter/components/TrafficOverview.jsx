import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  SectionTitle, Badge, TrafficGrid, TrafficColumn, TrafficCard, TrafficList,
  KPIName, RangeLabel, RangeTop, RangeTitleCenter, BtnIcon,
} from "../../pages/Admin.styled";
import { fetchPosthogStats } from "../utils/posthogStats";
import { trafficWeek } from "../utils/trafficWeeks";

const nf = new Intl.NumberFormat("no-NO");
const dateLabel = (date) => new Intl.DateTimeFormat("nb-NO", { timeZone: "UTC" })
  .format(new Date(`${date}T12:00:00Z`));

function useTraffic(query, refreshKey) {
  const queryString = new URLSearchParams({ ...query, traffic: "1" }).toString();
  const [state, setState] = useState({ loading: true, data: null, error: "" });
  useEffect(() => {
    let cancelled = false;
    setState({ loading: true, data: null, error: "" });
    fetchPosthogStats(Object.fromEntries(new URLSearchParams(queryString)))
      .then((data) => {
        if (!cancelled) setState({ loading: false, data, error: "" });
      })
      .catch((err) => {
        if (!cancelled) setState({ loading: false, data: null, error: err.message });
      });
    return () => { cancelled = true; };
  }, [queryString, refreshKey]);
  return state;
}

function TrafficItems({ state, kind }) {
  if (state.loading) return <RangeLabel role="status">Henter trafikk…</RangeLabel>;
  if (state.error) return <RangeLabel role="alert">{state.error}</RangeLabel>;
  const items = state.data?.traffic?.[kind] || [];
  if (!items.length) return <RangeLabel>Ingen registrerte besøk i perioden.</RangeLabel>;
  return <TrafficList>{items.map((item) => {
    const label = kind === "countries" ? item.country : item.source;
    const count = kind === "countries" ? item.visitors : item.sessions;
    return <li key={label}>{label} — <strong>{nf.format(count)}</strong></li>;
  })}</TrafficList>;
}

function WeeklyTraffic({ kind, startDate, refreshKey }) {
  const [offset, setOffset] = useState(0);
  const week = trafficWeek(offset);
  const state = useTraffic({ start: week.start, end: week.end }, refreshKey);
  const noun = kind === "countries" ? "Land" : "Trafikkilder";
  const canOlder = Boolean(startDate && week.start > startDate);
  return <TrafficCard>
    <RangeTop>
      <BtnIcon type="button" aria-label={`Forrige uke – ${noun}`} disabled={!canOlder}
        onClick={() => setOffset((n) => n + 1)}>←</BtnIcon>
      <RangeTitleCenter>{offset === 0 ? "Denne uken" : `Uke ${week.number}, ${week.year}`}</RangeTitleCenter>
      <BtnIcon type="button" aria-label={`Neste uke – ${noun}`} disabled={offset === 0}
        onClick={() => setOffset((n) => n - 1)}>→</BtnIcon>
    </RangeTop>
    <RangeLabel style={{ margin: "10px 0" }}>{dateLabel(week.start)}–{dateLabel(week.end)}</RangeLabel>
    <KPIName>{kind === "countries" ? "Unike besøkende per land" : "Økter per trafikkilde"}</KPIName>
    <TrafficItems state={state} kind={kind} />
  </TrafficCard>;
}

export default function TrafficOverview({ refreshKey = 0 }) {
  const totals = useTraffic({ range: "all" }, refreshKey);
  const startDate = totals.data?.period?.cutoffDate;
  return <section aria-label="Trafikk">
    <SectionTitle>Trafikk</SectionTitle>
    {startDate && <Badge>Fra {dateLabel(startDate)}</Badge>}
    <TrafficGrid>
      <TrafficColumn>
        <TrafficCard>
          <KPIName>Hvor kommer besøkende fra?</KPIName>
          <RangeLabel>Unike totalt</RangeLabel>
          <TrafficItems state={totals} kind="countries" />
        </TrafficCard>
        <WeeklyTraffic kind="countries" startDate={startDate} refreshKey={refreshKey} />
      </TrafficColumn>
      <TrafficColumn>
        <TrafficCard>
          <KPIName>Hvordan fant de oss?</KPIName>
          <RangeLabel>Alle økter</RangeLabel>
          <TrafficItems state={totals} kind="sources" />
        </TrafficCard>
        <WeeklyTraffic kind="sources" startDate={startDate} refreshKey={refreshKey} />
      </TrafficColumn>
    </TrafficGrid>
  </section>;
}

TrafficItems.propTypes = {
  state: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
    data: PropTypes.shape({ traffic: PropTypes.object }),
  }).isRequired,
  kind: PropTypes.oneOf(["countries", "sources"]).isRequired,
};
WeeklyTraffic.propTypes = {
  kind: PropTypes.oneOf(["countries", "sources"]).isRequired,
  startDate: PropTypes.string,
  refreshKey: PropTypes.number.isRequired,
};
TrafficOverview.propTypes = { refreshKey: PropTypes.number };
