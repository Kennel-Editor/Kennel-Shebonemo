import RangeCard from "./RangeCard";
import {
  buildLastNDays,
  buildLastNWeeks,
  buildLastNMonths,
  buildLastNYears,
} from "../utils/ranges";
import { RangeSection } from "../../pages/Admin.styled";

export default function RollingPanels() {
  const days = buildLastNDays(7);
  const weeks = buildLastNWeeks(8);
  const months = buildLastNMonths(12);
  const years = buildLastNYears(5);

  return (
    <>
      <RangeSection>
        <RangeCard title="Dag" items={days} />
      </RangeSection>
      <RangeSection>
        <RangeCard title="Uke" items={weeks} />
      </RangeSection>
      <RangeSection>
        <RangeCard title="Måned" items={months} />
      </RangeSection>
      <RangeSection>
        <RangeCard title="År" items={years} />
      </RangeSection>
    </>
  );
}
