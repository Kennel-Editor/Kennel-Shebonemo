import {
  Wrap,
  Title,
  Sub,
  KPIGrid,
  KPICard,
  KPIName,
  KPIValue,
  TableWrap,
  RangeGrid,
  SectionTitle,
  Btn,
} from "./Admin.styled";
import RollingPanels from "../counter/components/RollingPanels";
import { MiniPawSpinner } from "../utils/LoadingSpinner";
import useAdminData from "../hooks/useAdminData";
import StatsTable from "../counter/components/StatsTable";
import TrafficOverview from "../counter/components/TrafficOverview";

const nf = new Intl.NumberFormat("no-NO");

export default function Admin() {
  const {
    rows,
    childrenByGroup,
    expanded,
    setExpanded,
    global,
    loading,
    error,
    refTs,
    reloading,
    dailyToday,
    lifetime,
    reloadAll,
  } = useAdminData();

  return (
    <Wrap>
      <Title>Kontrollpanel</Title>
      <Sub>besøkstall f.o.m 07.11.2025</Sub>
      <Sub>
        <Btn onClick={reloadAll} disabled={loading || reloading} aria-busy={reloading}>
          {reloading ? <MiniPawSpinner style={{ marginRight: 8 }} /> : null}
          {reloading ? "Oppdaterer…" : "Oppdater"}
        </Btn>
      </Sub>

      {error && <Sub role="alert">{error}. Eventuelle viste tall er fra siste vellykkede henting.</Sub>}
      {loading && <Sub role="status">Henter besøksstatistikk…</Sub>}
      <KPIGrid>
        <KPICard>
          <KPIName>Besøk i dag</KPIName>
          <KPIValue>
            {loading || (error && !global.period) ? "—" : nf.format(Number(dailyToday.sessionsTotal || 0))}
          </KPIValue>
        </KPICard>
        <KPICard>
          <KPIName>Besøk totalt</KPIName>
          <KPIValue>{loading || (error && !global.period) ? "—" : nf.format(Number(lifetime.sessionsTotal || 0))}</KPIValue>
        </KPICard>
        <KPICard>
          <KPIName>Unike besøkere (alle tider)</KPIName>
          <KPIValue>{loading || (error && !global.period) ? "—" : nf.format(global.uniquesTotal || 0)}</KPIValue>
        </KPICard>
      </KPIGrid>

      <TableWrap>
        <StatsTable
          rows={rows}
          childrenByGroup={childrenByGroup}
          expanded={expanded}
          setExpanded={setExpanded}
        />
      </TableWrap>

      <SectionTitle>Rullerende oversikt</SectionTitle>
      <RangeGrid>
        <RollingPanels refreshKey={refTs} />
      </RangeGrid>
      <TrafficOverview refreshKey={refTs} />
    </Wrap>
  );
}
