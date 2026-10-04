import fs from "node:fs";
import path from "node:path";

type Cmd = (string | number)[];

const URL = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

export const usingRedis = Boolean(URL && TOKEN);

/* ---------- Upstash Redis (REST, serverless friendly) ---------- */
async function redis(cmds: Cmd[]): Promise<unknown[]> {
  const res = await fetch(`${URL}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmds),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis ${res.status}`);
  const out = (await res.json()) as { result?: unknown; error?: string }[];
  return out.map((r) => {
    if (r.error) throw new Error(r.error);
    return r.result;
  });
}

/* ---------- Local JSON fallback (dev / read-only hosts) ---------- */
interface Local {
  h: Record<string, Record<string, string>>;
  s: Record<string, string[]>;
  l: Record<string, string[]>;
}
const FILE = path.join(process.cwd(), ".data", "db.json");
let mem: Local | null = null;

function load(): Local {
  if (mem) return mem;
  try {
    mem = JSON.parse(fs.readFileSync(FILE, "utf8")) as Local;
  } catch {
    mem = { h: {}, s: {}, l: {} };
  }
  return mem;
}
function persist() {
  try {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(mem));
  } catch {
    /* read-only filesystem: keep in memory only */
  }
}

function local(cmds: Cmd[]): unknown[] {
  const db = load();
  let dirty = false;
  const out = cmds.map(([op, key, ...a]) => {
    const k = String(key);
    switch (String(op).toUpperCase()) {
      case "HINCRBY": {
        const h = (db.h[k] ??= {});
        h[String(a[0])] = String((Number(h[String(a[0])]) || 0) + Number(a[1]));
        dirty = true;
        return h[String(a[0])];
      }
      case "HSET": {
        (db.h[k] ??= {})[String(a[0])] = String(a[1]);
        dirty = true;
        return 1;
      }
      case "HDEL":
        delete db.h[k]?.[String(a[0])];
        dirty = true;
        return 1;
      case "HGET":
        return db.h[k]?.[String(a[0])] ?? null;
      case "HGETALL":
        return Object.entries(db.h[k] ?? {}).flat();
      case "SADD": {
        const s = (db.s[k] ??= []);
        if (!s.includes(String(a[0]))) s.push(String(a[0]));
        dirty = true;
        return 1;
      }
      case "SCARD":
        return db.s[k]?.length ?? 0;
      case "LPUSH":
        (db.l[k] ??= []).unshift(String(a[0]));
        dirty = true;
        return 1;
      case "LTRIM":
        db.l[k] = (db.l[k] ?? []).slice(Number(a[0]), Number(a[1]) + 1);
        dirty = true;
        return "OK";
      case "LRANGE":
        return (db.l[k] ?? []).slice(Number(a[0]), Number(a[1]) + 1);
      default:
        throw new Error(`Unsupported command ${op}`);
    }
  });
  if (dirty) persist();
  return out;
}

export async function run(cmds: Cmd[]): Promise<unknown[]> {
  if (!cmds.length) return [];
  return usingRedis ? redis(cmds) : local(cmds);
}

export function toObj(flat: unknown): Record<string, string> {
  const arr = (flat as string[] | null) ?? [];
  const o: Record<string, string> = {};
  for (let i = 0; i < arr.length; i += 2) o[arr[i]] = arr[i + 1];
  return o;
}
