import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { adminOk } from "../../../../lib/guard";

export const runtime = "nodejs";

/** Issues short-lived upload tokens so the browser uploads straight to Vercel Blob (works for large videos). */
export async function POST(req: Request) {
  const body = (await req.json()) as HandleUploadBody;

  // Vercel calls this route back (signed) when an upload finishes; only token requests need the admin cookie.
  if (body.type === "blob.generate-client-token" && !(await adminOk())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [
          "image/jpeg", "image/png", "image/webp", "image/gif", "image/avif",
          "video/mp4", "video/webm", "video/quicktime",
        ],
        maximumSizeInBytes: 300 * 1024 * 1024,
        addRandomSuffix: true,
      }),
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(json);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
