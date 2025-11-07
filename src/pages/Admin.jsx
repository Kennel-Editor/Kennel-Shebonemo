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
  Badge,
  Btn,
} from "./Admin.styled";
import RollingPanels from "../counter/components/RollingPanels";
import { MiniPawSpinner } from "../utils/LoadingSpinner";
import useAdminData from "../hooks/useAdminData";
import StatsTable from "../counter/components/StatsTable";

const nf = new Intl.NumberFormat("no-NO");

export default function Admin() {
  const {
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
  } = useAdminData();

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
    </Wrap>
  );
}
