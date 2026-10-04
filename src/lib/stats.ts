import { run, toObj } from "./db";
import { dayKey, monthKey, lastDays, lastMonths } from "./dates";
import { getAllPosts } from "./posts";

export type EventType = "imp" | "click" | "view";

export interface Meta {
  visitor: string;
  country: string;
  region: string;
  city: string;
  device: string;
  ref: string;
}

export interface Viewer {
  t: number;
  slug: string;
  country: string;
  region: string;
  city: string;
  device: string;
  ref: string;
}

type Cmd = (string | number)[];

export async function record(type: EventType, slugs: string[], meta: Meta) {
  const day = dayKey();
  const month = monthKey();
  const cmds: Cmd[] = [];
  for (const slug of slugs) {
    for (const h of [`d:${day}`, `m:${month}`]) {
      cmds.push(["HINCRBY", h, type, 1], ["HINCRBY", h, `${type}:${slug}`, 1]);
      if (meta.country === "US") cmds.push(["HINCRBY", h, `us:${type}`, 1]);
    }
    if (type === "view") {
      const { country, region, city, device, ref } = meta;
      const v: Viewer = { t: Date.now(), slug, country, region, city, device, ref };
      cmds.push(
        ["SADD", `u:${day}`, meta.visitor],
        ["SADD", `um:${month}`, meta.visitor],
        ["SADD", `up:${slug}`, meta.visitor],
        ["HINCRBY", `c:${month}`, country, 1],
        ["LPUSH", "recent", JSON.stringify(v)],
        ["LTRIM", "recent", 0, 199],
      );
    }
  }
  await run(cmds);
}

export interface Counts {
  imp: number;
  click: number;
  view: number;
  usImp: number;
  usView: number;
}
const n = (v: string | undefined) => Number(v) || 0;
const counts = (h: Record<string, string>): Counts => ({
  imp: n(h.imp),
  click: n(h.click),
  view: n(h.view),
  usImp: n(h["us:imp"]),
  usView: n(h["us:view"]),
});

export async function getDashboard(days: number) {
  const dayKeys = lastDays(days);
  const monthKeys = lastMonths(6);
  const posts = await getAllPosts();

  const cmds: Cmd[] = [
    ...dayKeys.flatMap((k): Cmd[] => [["HGETALL", `d:${k}`], ["SCARD", `u:${k}`]]),
    ...monthKeys.flatMap((k): Cmd[] => [["HGETALL", `m:${k}`], ["SCARD", `um:${k}`], ["HGETALL", `c:${k}`]]),
    ["LRANGE", "recent", 0, 29],
    ...posts.map((p): Cmd => ["SCARD", `up:${p.slug}`]),
  ];
  const r = await run(cmds);
  let i = 0;

  const dayHashes: Record<string, string>[] = [];
  const daily = dayKeys.map((key) => {
    const h = toObj(r[i++]);
    dayHashes.push(h);
    return { key, ...counts(h), unique: Number(r[i++]) || 0 };
  });

  const countryTotals: Record<string, number> = {};
  const monthly = monthKeys.map((key) => {
    const c = counts(toObj(r[i++]));
    const unique = Number(r[i++]) || 0;
    for (const [cc, v] of Object.entries(toObj(r[i++]))) countryTotals[cc] = (countryTotals[cc] ?? 0) + n(v);
    return { key, ...c, unique };
  });

  const recent = ((r[i++] as string[]) ?? []).map((s) => JSON.parse(s) as Viewer);

  const perPost = posts.map((post) => {
    const t = { imp: 0, click: 0, view: 0 };
    for (const h of dayHashes) {
      t.imp += n(h[`imp:${post.slug}`]);
      t.click += n(h[`click:${post.slug}`]);
      t.view += n(h[`view:${post.slug}`]);
    }
    return { post, ...t, unique: Number(r[i++]) || 0 };
  });

  const sum = (f: (d: Counts) => number) => daily.reduce((a, d) => a + f(d), 0);
  const totals = {
    imp: sum((d) => d.imp),
    click: sum((d) => d.click),
    view: sum((d) => d.view),
    usImp: sum((d) => d.usImp),
    usView: sum((d) => d.usView),
    unique: daily.reduce((a, d) => a + d.unique, 0),
  };

  const countries = Object.entries(countryTotals).sort((a, b) => b[1] - a[1]);
  return { daily, monthly, perPost: perPost.sort((a, b) => b.imp - a.imp), totals, countries, recent };
}
