import RangeCard from "./RangeCard";
import {
  buildLastNDays,
  buildLastNWeeks,
  buildLastNMonths,
  buildLastNYears,
} from "../utils/ranges";
import { RangeSection } from "../../pages/Admin.styled";

export default function RollingPanels({ refreshKey = 0 }) {
  const days = buildLastNDays(7);
  const weeks = buildLastNWeeks(8);
  const months = buildLastNMonths(12);
  const years = buildLastNYears(5);

  return (
    <>
      <RangeSection>
        <RangeCard title="Dag" items={days} refreshKey={refreshKey} />
      </RangeSection>
      <RangeSection>
        <RangeCard title="Uke" items={weeks} refreshKey={refreshKey} />
      </RangeSection>
      <RangeSection>
        <RangeCard title="Måned" items={months} refreshKey={refreshKey} />
      </RangeSection>
      <RangeSection>
        <RangeCard title="År" items={years} refreshKey={refreshKey} />
      </RangeSection>
    </>
  );
}
