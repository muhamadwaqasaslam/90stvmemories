import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { adminOk, blobEnabled } from "../../../../lib/guard";

export const runtime = "nodejs";

const EXT = /\.(jpe?g|png|webp|gif|avif|mp4|webm|mov|m4v)$/i;
const MAX = 50 * 1024 * 1024;

/** Handles direct file uploads using @vercel/blob with fallback to public/uploads */
export async function POST(req: Request) {
  if (!(await adminOk())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (!EXT.test(file.name) || !/^(image|video)\//.test(file.type)) {
    return NextResponse.json({ error: "Only images and videos are allowed." }, { status: 400 });
  }
  if (file.size > MAX) return NextResponse.json({ error: "File exceeds 50MB limit." }, { status: 413 });

  // 1. If Vercel Blob token is configured, save directly to permanent Vercel Blob CDN
  if (blobEnabled()) {
    try {
      const safe = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(-80);
      const blob = await put(`articles/${Date.now()}-${safe}`, file, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      return NextResponse.json({ url: blob.url });
    } catch (err) {
      console.warn("Vercel Blob put failed:", err);
    }
  }

  // 2. Local filesystem fallback
  try {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");
    const safe = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(-80);
    const name = `${Date.now()}-${safe}`;
    const dir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ url: `/uploads/${name}` });
  } catch {
    return NextResponse.json({ error: "Upload failed. Please connect Vercel Blob storage or enter an image URL." }, { status: 500 });
  }
}
