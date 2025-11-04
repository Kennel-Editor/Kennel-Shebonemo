import { useEffect, useState, useMemo } from "react";
import {
  RangeCardWrap,
  RangeTop,
  RangeTitleCenter,
  BtnIcon,
  RangeLabel,
  RangeMetrics,
  Metric,
  MetricName,
  MetricValue,
} from "../../pages/Admin.styled";

const SLUGS = ["/", "/dogs", "/litters", "/gallery", "/about", "/contact"];

// Oslo helpers
function ymdOslo(d = new Date()) {
  const p = new Intl.DateTimeFormat("no-NO", {
    timeZone: "Europe/Oslo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const y = p.find((x) => x.type === "year")?.value;
  const m = p.find((x) => x.type === "month")?.value;
  const day = p.find((x) => x.type === "day")?.value;
  return `${y}-${m}-${day}`;
}
function addDays(dateStr, delta) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + delta);
  return ymdOslo(dt);
}
function parseYmd(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}
function getISOWeek(date) {
  const d = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
  const dayNum = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const diff = d - firstThursday;
  return 1 + Math.round(diff / (7 * 24 * 3600 * 1000));
}

export default function RangeCard({ title, items }) {
  const [idx, setIdx] = useState(0);
  const cur = items[idx];
  const [data, setData] = useState({ sessionsTotal: 0, uniquesGlobal: 0 });

  const todayYmd = useMemo(() => ymdOslo(), []);
  const yesterdayYmd = useMemo(() => addDays(ymdOslo(), -1), []);

  const smartLabel = useMemo(() => {
    const start = String(cur.start);
    const end = String(cur.end);

    if (title === "Dag") {
      if (start === todayYmd && end === todayYmd) return "I dag";
      if (start === yesterdayYmd && end === yesterdayYmd) return "I går";

      const startDate = parseYmd(start);
      const todayDate = parseYmd(todayYmd);
      const diffDays = Math.round(
        (todayDate.getTime() - startDate.getTime()) / (24 * 3600 * 1000)
      );

      if (diffDays <= 6 && diffDays >= 0) {
        const weekday = new Intl.DateTimeFormat("no-NO", {
          weekday: "long",
        }).format(startDate);
        return weekday.charAt(0).toUpperCase() + weekday.slice(1);
      }

      return new Intl.DateTimeFormat("no-NO").format(startDate);
    }

    if (title === "Uke") {
      const now = parseYmd(todayYmd);
      const startDate = parseYmd(start);
      const endDate = parseYmd(end);

      const inThisWeek = +now >= +startDate && +now <= +endDate;
      if (inThisWeek) return "Denne uken";

      const lastWeekDate = new Date(now);
      lastWeekDate.setUTCDate(lastWeekDate.getUTCDate() - 7);
      const inLastWeek =
        +lastWeekDate >= +startDate && +lastWeekDate <= +endDate;
      if (inLastWeek) return "Forrige uke";

      const weekNo = getISOWeek(startDate);
      return `Uke ${weekNo}`;
    }

    return cur.label;
  }, [cur, title, todayYmd, yesterdayYmd]);

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
      <RangeTop>
        <BtnIcon onClick={next} aria-label="Forrige">
          ←
        </BtnIcon>
        <RangeTitleCenter>{title}</RangeTitleCenter>
        <BtnIcon onClick={prev} aria-label="Neste">
          →
        </BtnIcon>
      </RangeTop>

      <RangeLabel>{smartLabel}</RangeLabel>

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
