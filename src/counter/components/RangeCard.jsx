import { useEffect, useState } from "react";
import {
  RangeCardWrap,
  RangeHeader,
  RangeTitle,
  RangeNav,
  RangeLabel,
  RangeMetrics,
  Metric,
  MetricName,
  MetricValue,
  BtnIcon,
} from "../../pages/Admin.styled";

const SLUGS = ["/", "/dogs", "/litters", "/gallery", "/about", "/contact"];

export default function RangeCard({ title, items }) {
  const [idx, setIdx] = useState(0);
  const cur = items[idx];
  const [data, setData] = useState({ sessionsTotal: 0, uniquesGlobal: 0 });

  useEffect(() => {
    const params = new URLSearchParams({ start: cur.start, end: cur.end });
    for (const s of SLUGS) params.append("slug", s);
    fetch(`/.netlify/functions/getRangeStats?${params.toString()}`)
      .then((r) => r.json())
      .then((json) =>
        setData({
          sessionsTotal: json.sessionsTotal || 0,
          uniquesGlobal: json.uniquesGlobal || 0,
        })
      )
      .catch(() => {});
  }, [cur.start, cur.end]);

  function prev() {
    setIdx((idx - 1 + items.length) % items.length);
  }
  function next() {
    setIdx((idx + 1) % items.length);
  }

  return (
    <RangeCardWrap>
      <RangeHeader>
        <RangeTitle>{title}</RangeTitle>
        <RangeNav>
          <BtnIcon onClick={prev} aria-label="Forrige">
            ←
          </BtnIcon>
          <BtnIcon onClick={next} aria-label="Neste">
            →
          </BtnIcon>
        </RangeNav>
      </RangeHeader>

      <RangeLabel>{cur.label}</RangeLabel>

      <RangeMetrics>
        <Metric>
          <MetricName>Besøk</MetricName>
          <MetricValue>
            {new Intl.NumberFormat("no-NO").format(data.sessionsTotal || 0)}
          </MetricValue>
        </Metric>
        <Metric>
          <MetricName>Unike</MetricName>
          <MetricValue>
            {new Intl.NumberFormat("no-NO").format(data.uniquesGlobal || 0)}
          </MetricValue>
        </Metric>
      </RangeMetrics>
    </RangeCardWrap>
  );
}
