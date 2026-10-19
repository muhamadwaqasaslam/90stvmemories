import Link from "next/link";
import { AdminShell } from "../../components/admin/Shell";
import { DailyChart, Legend } from "../../components/admin/Charts";
import { getDashboard } from "../../lib/stats";
import { fmtDay, fmtMonth } from "../../lib/dates";
import { usingRedis } from "../../lib/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard", robots: { index: false } };

const RANGES = [7, 30, 90] as const;
const nf = new Intl.NumberFormat("en-US");
const pct = (a: number, b: number) => (b ? `${((a / b) * 100).toFixed(1)}%` : "0%");

const COUNTRY: Record<string, string> = { US: "United States", CA: "Canada", GB: "United Kingdom", AU: "Australia", IN: "India", PK: "Pakistan", DE: "Germany", MX: "Mexico", "??": "Unknown (local)" };
const flag = (cc: string) => (/^[A-Z]{2}$/.test(cc) ? String.fromCodePoint(...[...cc].map((c) => 127397 + c.charCodeAt(0))) : "🌐");

function ago(t: number) {
  const m = Math.round((Date.now() - t) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  if (m < 1440) return `${Math.round(m / 60)}h ago`;
  return `${Math.round(m / 1440)}d ago`;
}

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const q = Number((await searchParams).days);
  const days = (RANGES as readonly number[]).includes(q) ? q : 30;
  const d = await getDashboard(days);
  const t = d.totals;
  const titles = new Map(d.perPost.map((p) => [p.post.slug, p.post.title]));
  const countryTotal = d.countries.reduce((a, [, v]) => a + v, 0);
  const usViews = d.countries.find(([c]) => c === "US")?.[1] ?? 0;
  const best = d.daily.reduce((a, b) => (b.imp > a.imp ? b : a), d.daily[0]);

  const stats = [
    { label: "Impressions", value: nf.format(t.imp), note: `${pct(t.usImp, t.imp)} from US`, color: "bg-pink" },
    { label: "Clicks", value: nf.format(t.click), note: `CTR ${pct(t.click, t.imp)}`, color: "bg-sun" },
    { label: "Article views", value: nf.format(t.view), note: `${pct(t.usView, t.view)} from US`, color: "bg-cyan" },
    { label: "Unique viewers", value: nf.format(t.unique), note: "sum of daily uniques", color: "bg-mint" },
  ];

  return (
    <AdminShell active="/admin">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-pink">CONTROL ROOM</p>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">Analytics</h1>
          <p className="mt-1 text-sm text-ink/55">Times shown in US Eastern. Last {days} days.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/api/admin/backup"
            download
            className="flex min-h-11 items-center gap-2 rounded-full border-2 border-ink/15 px-4 py-2 text-sm font-semibold hover:bg-ink/5 transition"
            title="Download full JSON backup of all articles"
          >
            <span>💾</span> Export Backup
          </a>
          <div className="flex gap-2" role="group" aria-label="Date range">
            {RANGES.map((r) => (
              <Link
                key={r}
                href={`/admin?days=${r}`}
                className={`flex min-h-11 items-center rounded-full border-2 px-4 py-2 text-sm font-semibold ${r === days ? "border-ink bg-ink text-white" : "border-ink/15 hover:bg-ink/5"}`}
              >
                {r}d
              </Link>
            ))}
          </div>
        </div>
      </div>

      {!usingRedis && (
        <p className="mt-5 rounded-xl border-2 border-sun/60 bg-sun/10 px-4 py-3 text-sm text-amber-600">
          Local mode: data is saved to <code>.data/db.json</code>. Connect Upstash Redis (see README) before deploying so stats persist on serverless.
        </p>
      )}

      {/* KPI tiles */}
      <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4" aria-label="Totals">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl pop bg-white p-5">
            <span className={`inline-block h-2 w-10 rounded-full ${s.color}`} />
            <p className="mt-3 text-sm font-bold text-ink/65">{s.label}</p>
            <p className="break-words font-display text-2xl font-bold sm:text-4xl">{s.value}</p>
            <p className="mt-1 text-sm text-ink/45">{s.note}</p>
          </div>
        ))}
      </section>

      {/* Per day */}
      <section className="mt-6 rounded-2xl pop bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-semibold">Per day</h2>
          <Legend />
        </div>
        <div className="mt-4"><DailyChart data={d.daily} /></div>
        {best && best.imp > 0 && (
          <p className="mt-2 text-sm text-ink/55">Best day: <b className="text-ink">{fmtDay(best.key)}</b> with {nf.format(best.imp)} impressions.</p>
        )}
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr] [&>*]:min-w-0">
        {/* Per month */}
        <section className="rounded-2xl pop bg-white p-5 sm:p-6">
          <h2 className="font-display text-xl font-semibold">Per month</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="text-ink/55">
                <tr>
                  <th className="pb-2 font-bold">Month</th>
                  <th className="pb-2 text-right font-bold">Impressions</th>
                  <th className="pb-2 text-right font-bold">Clicks</th>
                  <th className="pb-2 text-right font-bold">Views</th>
                  <th className="pb-2 text-right font-bold">Unique</th>
                </tr>
              </thead>
              <tbody>
                {[...d.monthly].reverse().map((m) => (
                  <tr key={m.key} className="border-t border-ink/10">
                    <td className="py-2.5 font-bold">{fmtMonth(m.key)}</td>
                    <td className="py-2.5 text-right tabular-nums">{nf.format(m.imp)}</td>
                    <td className="py-2.5 text-right tabular-nums">{nf.format(m.click)}</td>
                    <td className="py-2.5 text-right tabular-nums">{nf.format(m.view)}</td>
                    <td className="py-2.5 text-right tabular-nums">{nf.format(m.unique)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Audience */}
        <section className="rounded-2xl pop bg-white p-5 sm:p-6">
          <h2 className="font-display text-xl font-semibold">Where viewers are</h2>
          <p className="mt-1 text-sm text-ink/55">Article views, last 6 months. Target: 🇺🇸 United States</p>
          <div className="mt-4 rounded-xl bg-pink/10 p-4">
            <p className="font-display text-3xl">{pct(usViews, countryTotal)}</p>
            <p className="text-sm text-ink/65">of readers are in the US</p>
          </div>
          <ul className="mt-4 space-y-3">
            {d.countries.slice(0, 6).map(([cc, v]) => (
              <li key={cc}>
                <div className="flex justify-between text-sm font-bold">
                  <span>{flag(cc)} {COUNTRY[cc] ?? cc}</span>
                  <span className="tabular-nums">{nf.format(v)}</span>
                </div>
                <div className="mt-1 h-2.5 rounded-full bg-ink/5">
                  <div className={`h-full rounded-full ${cc === "US" ? "bg-pink" : "bg-cyan"}`} style={{ width: `${(v / (d.countries[0]?.[1] || 1)) * 100}%` }} />
                </div>
              </li>
            ))}
            {!d.countries.length && <li className="text-sm text-ink/45">No views yet.</li>}
          </ul>
        </section>
      </div>

      {/* Traffic Come From & Backup Options */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2 [&>*]:min-w-0">
        {/* Traffic Come From */}
        <section className="rounded-2xl pop bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold">Traffic Come From</h2>
              <p className="mt-1 text-sm text-ink/55">Where visitors discover your website &amp; articles</p>
            </div>
            <span className="rounded-full bg-pink/10 px-2.5 py-1 text-xs font-bold text-pink">Live Referrers</span>
          </div>
          <ul className="mt-4 space-y-3">
            {d.trafficSources.slice(0, 6).map((ts) => (
              <li key={ts.source}>
                <div className="flex justify-between text-sm font-bold">
                  <span className="truncate pr-2">{ts.source}</span>
                  <span className="tabular-nums text-ink/80">{nf.format(ts.count)} <span className="font-normal text-xs text-ink/45">({ts.pct}%)</span></span>
                </div>
                <div className="mt-1 h-2.5 rounded-full bg-ink/5">
                  <div className="h-full rounded-full bg-sun" style={{ width: `${Math.max(5, ts.pct)}%` }} />
                </div>
              </li>
            ))}
            {!d.trafficSources.length && <li className="text-sm text-ink/45">No traffic source data recorded yet.</li>}
          </ul>
        </section>

        {/* Website backup options */}
        <section className="flex flex-col justify-between rounded-2xl pop bg-white p-5 sm:p-6">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold">Website Backup Options</h2>
                <p className="mt-1 text-sm text-ink/55">Safeguard your database and article content</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600">Database Safety</span>
            </div>
            <div className="mt-4 rounded-xl border border-ink/10 bg-paper/50 p-4">
              <p className="text-sm font-semibold text-ink">Articles Backup Snapshot</p>
              <p className="mt-1 text-xs text-ink/60">
                Exports all {d.perPost.length} articles including full text, formatting, tags, images, categories, and timestamps in standard JSON format.
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="/api/admin/backup"
              download
              className="pop pop-hover inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-pink transition"
            >
              <span>💾</span> Download JSON Backup
            </a>
            <span className="text-xs text-ink/45">Instant 1-click download</span>
          </div>
        </section>
      </div>

      {/* Per article */}
      <section className="mt-6 rounded-2xl pop bg-white p-5 sm:p-6">
        <h2 className="font-display text-xl font-semibold">Per article <span className="text-sm font-sans font-bold text-ink/45">· last {days} days</span></h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-ink/55">
              <tr>
                <th className="pb-2 font-bold">Article</th>
                <th className="pb-2 text-right font-bold">Impressions</th>
                <th className="pb-2 text-right font-bold">Clicks</th>
                <th className="pb-2 text-right font-bold">CTR</th>
                <th className="pb-2 text-right font-bold">Views</th>
                <th className="pb-2 text-right font-bold">Unique readers</th>
              </tr>
            </thead>
            <tbody>
              {d.perPost.map((p) => (
                <tr key={p.post.id} className="border-t border-ink/10">
                  <td className="max-w-xs py-3 pr-4 font-bold">
                    <Link href={`/posts/${p.post.slug}`} target="_blank" className="hover:text-pink">{p.post.title}</Link>
                    {p.post.status === "draft" && <span className="ml-2 rounded bg-ink/10 px-1.5 text-xs">draft</span>}
                  </td>
                  <td className="py-3 text-right tabular-nums">{nf.format(p.imp)}</td>
                  <td className="py-3 text-right tabular-nums">{nf.format(p.click)}</td>
                  <td className="py-3 text-right tabular-nums">{pct(p.click, p.imp)}</td>
                  <td className="py-3 text-right tabular-nums">{nf.format(p.view)}</td>
                  <td className="py-3 text-right tabular-nums">{nf.format(p.unique)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Who viewed */}
      <section className="mt-6 rounded-2xl pop bg-white p-5 sm:p-6">
        <h2 className="font-display text-xl font-semibold">Latest readers</h2>
        <p className="mt-1 text-sm text-ink/55">Who opened an article, from where, and on what device. Visitors are anonymous.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-ink/55">
              <tr>
                <th className="pb-2 font-bold">When</th>
                <th className="pb-2 font-bold">Article</th>
                <th className="pb-2 font-bold">Location</th>
                <th className="pb-2 font-bold">Device</th>
                <th className="pb-2 font-bold">Came from</th>
              </tr>
            </thead>
            <tbody>
              {d.recent.map((v, i) => (
                <tr key={i} className="border-t border-ink/10">
                  <td className="whitespace-nowrap py-2.5 pr-3 text-ink/65">{ago(v.t)}</td>
                  <td className="max-w-[260px] truncate py-2.5 pr-3 font-bold">{titles.get(v.slug) ?? v.slug}</td>
                  <td className="whitespace-nowrap py-2.5 pr-3">
                    {flag(v.country)} {[v.city, v.region].filter(Boolean).join(", ") || COUNTRY[v.country] || v.country}
                  </td>
                  <td className="py-2.5 pr-3">{v.device}</td>
                  <td className="py-2.5 text-ink/65">{v.ref || "Direct"}</td>
                </tr>
              ))}
              {!d.recent.length && (
                <tr><td colSpan={5} className="py-6 text-center text-ink/45">No readers yet. Open an article on the site to see it appear here.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}
