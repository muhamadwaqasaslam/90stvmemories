import { NextResponse } from "next/server";
import { adminOk } from "../../../../lib/guard";
import { getAllPosts } from "../../../../lib/posts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await adminOk())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await getAllPosts();
  const backup = {
    site: "90s TV Memories",
    version: "1.0",
    exportedAt: new Date().toISOString(),
    totalArticles: posts.length,
    articles: posts,
  };

  const filename = `90stvmemories_backup_${new Date().toISOString().slice(0, 10)}.json`;
  return new NextResponse(JSON.stringify(backup, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
