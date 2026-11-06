import { ymdOslo } from "./ranges.js";

export function trafficWeek(offset = 0, today = ymdOslo()) {
  // Calendar arithmetic at UTC noon keeps Oslo dates stable through DST changes.
  const date = new Date(`${today}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 6) % 7 - offset * 7);
  const start = date.toISOString().slice(0, 10);
  const endDate = new Date(date);
  endDate.setUTCDate(endDate.getUTCDate() + 6);
  const thursday = new Date(date);
  thursday.setUTCDate(thursday.getUTCDate() + 3);
  const year = thursday.getUTCFullYear();
  const jan4 = new Date(Date.UTC(year, 0, 4, 12));
  jan4.setUTCDate(jan4.getUTCDate() - (jan4.getUTCDay() + 6) % 7);
  const number = 1 + Math.round((date - jan4) / 604800000);
  return { start, end: endDate.toISOString().slice(0, 10), number, year };
}
