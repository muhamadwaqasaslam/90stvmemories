import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { adminOk, blobEnabled } from "../../../../lib/guard";

export const runtime = "nodejs";

const EXT = /\.(jpe?g|png|webp|gif|avif|mp4|webm|mov|m4v)$/i;
const MAX = 50 * 1024 * 1024;

/** Local-development fallback: saves into public/uploads. Production uses Vercel Blob. */
export async function POST(req: Request) {
  if (!(await adminOk())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (process.env.VERCEL || blobEnabled()) {
    return NextResponse.json({ error: "Connect Vercel Blob storage to upload files." }, { status: 501 });
  }

  const file = (await req.formData()).get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (!EXT.test(file.name) || !/^(image|video)\//.test(file.type)) {
    return NextResponse.json({ error: "Only images and videos are allowed." }, { status: 400 });
  }
  if (file.size > MAX) return NextResponse.json({ error: "File is larger than 50 MB (local mode)." }, { status: 413 });

  const safe = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(-80);
  const name = `${Date.now()}-${safe}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url: `/uploads/${name}` });
}
