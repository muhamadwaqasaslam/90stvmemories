import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { list } from "@vercel/blob";
import { adminOk, blobEnabled } from "../../../../lib/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VIDEO = /\.(mp4|webm|mov|m4v|ogv)(\?.*)?$/i;

/** Lists previously uploaded media so it can be reused in other articles. */
export async function GET() {
  if (!(await adminOk())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (blobEnabled()) {
    const { blobs } = await list({ prefix: "uploads/", limit: 100 });
    const items = blobs
      .sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt))
      .map((b) => ({ url: b.url, name: b.pathname.replace(/^uploads\//, ""), video: VIDEO.test(b.pathname) }));
    return NextResponse.json({ items });
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  try {
    const names = await fs.readdir(dir);
    const stats = await Promise.all(names.map(async (n) => ({ n, t: (await fs.stat(path.join(dir, n))).mtimeMs })));
    const items = stats.sort((a, b) => b.t - a.t).map(({ n }) => ({ url: `/uploads/${n}`, name: n, video: VIDEO.test(n) }));
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}
