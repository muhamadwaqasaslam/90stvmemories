import { notFound } from "next/navigation";
import { AdminShell } from "../../../../components/admin/Shell";
import { getPostById } from "../../../../lib/posts";
import { blobEnabled } from "../../../../lib/guard";
import { EditorForm } from "./form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit article", robots: { index: false } };

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = id === "new" ? undefined : await getPostById(id);
  if (id !== "new" && !post) notFound();

  return (
    <AdminShell active="/admin/posts">
      <p className="text-xs font-semibold uppercase tracking-widest text-pink">BROADCAST DESK</p>
      <h1 className="font-display text-3xl font-bold sm:text-4xl">{post ? "Edit article" : "Post a new article"}</h1>
      <EditorForm post={post} blobEnabled={blobEnabled()} />
    </AdminShell>
  );
}
