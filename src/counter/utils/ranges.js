export function ymdOslo(d=new Date()) {
  const p = new Intl.DateTimeFormat("no-NO",{ timeZone:"Europe/Oslo", year:"numeric", month:"2-digit", day:"2-digit" }).formatToParts(d);
  const y = p.find(x=>x.type==="year")?.value||"";
  const m = p.find(x=>x.type==="month")?.value||"";
  const dd = p.find(x=>x.type==="day")?.value||"";
  return `${y}-${m}-${dd}`;
}

function fromYMD(s){ const [y,m,d]=s.split("-").map(Number); return new Date(Date.UTC(y,m-1,d)); }

export function buildLastNDays(n=7) {
  const today = fromYMD(ymdOslo());
  const arr=[];
  for (let i=0;i<n;i++){
    const d=new Date(today); d.setUTCDate(today.getUTCDate()-i);
    const s=ymdOslo(d);
    arr.push({ label: d.toLocaleDateString("no-NO"), start:s, end:s });
  }
  return arr;
}

export function isoWeekStartEnd(d) {
  const date=new Date(d); const day=(date.getUTCDay()+6)%7;
  const start=new Date(date); start.setUTCDate(date.getUTCDate()-day);
  const end=new Date(start); end.setUTCDate(start.getUTCDate()+6);
  return { start: ymdOslo(start), end: ymdOslo(end) };
}

export function buildLastNWeeks(n=8) {
  const today=fromYMD(ymdOslo());
  const arr=[];
  let cursor = new Date(today);
  for (let i=0;i<n;i++){
    const {start,end}=isoWeekStartEnd(cursor);
    const label = `Uke ${weekNumber(cursor)} (${new Date(fromYMD(start)).toLocaleDateString("no-NO")}–${new Date(fromYMD(end)).toLocaleDateString("no-NO")})`;
    arr.push({ label, start, end });
    cursor = new Date(fromYMD(start)); cursor.setUTCDate(cursor.getUTCDate()-1);
  }
  return arr;
}

function weekNumber(d) {
  const dt = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = (dt.getUTCDay()+6)%7;
  dt.setUTCDate(dt.getUTCDate()-dayNum+3);
  const firstThursday = new Date(Date.UTC(dt.getUTCFullYear(),0,4));
  const diff = dt - firstThursday;
  return 1 + Math.round(diff/604800000);
}

export function monthStartEnd(d) {
  const y=d.getUTCFullYear(); const m=d.getUTCMonth();
  const start= new Date(Date.UTC(y,m,1));
  const end= new Date(Date.UTC(y,m+1,0));
  return { start: ymdOslo(start), end: ymdOslo(end) };
}

export function buildLastNMonths(n=12) {
  const today=fromYMD(ymdOslo());
  const arr=[];
  let y=today.getUTCFullYear(), m=today.getUTCMonth();
  for (let i=0;i<n;i++){
    const start= ymdOslo(new Date(Date.UTC(y,m,1)));
    const end= ymdOslo(new Date(Date.UTC(y,m+1,0)));
    const label = new Date(Date.UTC(y,m,1)).toLocaleDateString("no-NO",{ year:"numeric", month:"long"});
    arr.push({ label, start, end });
    m--; if (m<0){ m=11; y--; }
  }
  return arr;
}

export function yearStartEnd(d){
  const y=d.getUTCFullYear();
  return { start: ymdOslo(new Date(Date.UTC(y,0,1))), end: ymdOslo(new Date(Date.UTC(y,11,31))) };
}

export function buildLastNYears(n=5){
  const today=fromYMD(ymdOslo());
  const arr=[];
  let y=today.getUTCFullYear();
  for (let i=0;i<n;i++){
    const {start,end}=yearStartEnd(new Date(Date.UTC(y,0,1)));
    arr.push({ label: String(y), start, end });
    y--;
  }
  return arr;
}
