import React from "react";
import {
  Table,
  Th,
  Td,
  ChildRow,
  ChildCellName,
  ChildCell,
  ParentRow,
  Arrow,
} from "../../pages/Admin.styled";
import { FaPaw } from "react-icons/fa";
import usePrettyNames from "../../hooks/usePrettyNames";

const nf = new Intl.NumberFormat("no-NO");
const topSlugs = new Set([
  "/",
  "/dogs",
  "/litters",
  "/gallery",
  "/about",
  "/contact",
]);
const labels = {
  "/": "Hjem",
  "/dogs": "Våre hunder",
  "/litters": "Valpekull",
  "/gallery": "Galleri",
  "/about": "Om oss",
  "/contact": "Kontakt",
};

export default function StatsTable({
  rows,
  childrenByGroup,
  expanded,
  setExpanded,
}) {
  const pretty = usePrettyNames(childrenByGroup);
  return (
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
          <React.Fragment key={r.page}>
            <ParentRow className={expanded[r.page] ? "open" : ""}>
              <Td>
                {topSlugs.has(r.page) ? (
                  <RowLabel
                    slug={r.page}
                    childrenByGroup={childrenByGroup}
                    expanded={expanded}
                    setExpanded={setExpanded}
                  />
                ) : (
                  labels[r.page] || r.page
                )}
              </Td>
              <Td>{nf.format(Number(r.sessionsTotal || 0))}</Td>
              <Td>{nf.format(Number(r.sessionsToday || 0))}</Td>
              <Td>{nf.format(Number(r.uniquesTotal || 0))}</Td>
            </ParentRow>

            {topSlugs.has(r.page) && expanded[r.page] && (
              <ChildrenRows
                slug={r.page}
                childrenByGroup={childrenByGroup}
                pretty={pretty}
              />
            )}
          </React.Fragment>
        ))}
      </tbody>
    </Table>
  );
}

function RowLabel({ slug, childrenByGroup, expanded, setExpanded }) {
  const items = childrenByGroup[slug] || [];
  const canExpand = items.length > 0;
  const isOpen = expanded[slug];
  return (
    <span
      onClick={
        canExpand
          ? () => setExpanded((e) => ({ ...e, [slug]: !e[slug] }))
          : undefined
      }
      style={{ cursor: canExpand ? "pointer" : "default", userSelect: "none" }}
    >
      {canExpand && (
        <Arrow className={isOpen ? "open" : undefined}>
          <FaPaw />
        </Arrow>
      )}

      {labels[slug] || slug}
    </span>
  );
}

function ChildrenRows({ slug, childrenByGroup, pretty }) {
  const items = childrenByGroup[slug] || [];
  if (items.length === 0) return null;

  return (
    <>
      {items.map((r) => (
        <ChildRow key={r.page}>
          <ChildCellName>{pretty[r.page] || r.page}</ChildCellName>
          <ChildCell>{nf.format(Number(r.sessionsTotal || 0))}</ChildCell>
          <ChildCell>{nf.format(Number(r.sessionsToday || 0))}</ChildCell>
          <ChildCell>{nf.format(Number(r.uniquesTotal || 0))}</ChildCell>
        </ChildRow>
      ))}
    </>
  );
}
