const TZ = "America/New_York"; // target audience is the US

const dayFmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ });

export const dayKey = (d = new Date()) => dayFmt.format(d); // YYYY-MM-DD
export const monthKey = (d = new Date()) => dayFmt.format(d).slice(0, 7);

export function lastDays(n: number): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) out.push(dayKey(new Date(Date.now() - i * 86_400_000)));
  return out;
}

export function lastMonths(n: number): string[] {
  const [y, m] = monthKey().split("-").map(Number);
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(y, m - 1 - i, 1));
    out.push(`${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`);
  }
  return out;
}

export const fmtDay = (k: string) =>
  new Date(`${k}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

export const fmtMonth = (k: string) =>
  new Date(`${k}-15T12:00:00Z`).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: TZ });
