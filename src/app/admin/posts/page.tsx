import Link from "next/link";
import { AdminShell } from "../../../components/admin/Shell";
import { getAllPosts } from "../../../lib/posts";
import { fmtDate } from "../../../lib/dates";
import { remove } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Articles", robots: { index: false } };

export default async function PostsAdmin({ searchParams }: { searchParams: Promise<{ saved?: string; deleted?: string }> }) {
  const sp = await searchParams;
  const posts = await getAllPosts();

  return (
    <AdminShell active="/admin/posts">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-pink">BROADCAST DESK</p>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">Articles</h1>
        </div>
        <Link href="/admin/posts/new" className="pop pop-hover w-full rounded-full bg-pink px-6 py-3 text-center font-semibold text-white sm:w-auto">
          + New article
        </Link>
      </div>

      {(sp.saved || sp.deleted) && (
        <p role="status" className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 font-bold text-emerald-600">
          {sp.saved ? "Saved! Your article is on air." : "Article deleted."}
        </p>
      )}

      <ul className="mt-6 space-y-3">
        {posts.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl pop bg-white p-4 sm:p-5">
            <div className="min-w-0 flex-1">
              <p className="break-words font-semibold leading-snug">{p.title}</p>
              <p className="mt-1 text-sm text-ink/55">
                {p.category} · {fmtDate(p.createdAt)} ·{" "}
                <span className={p.status === "published" ? "text-emerald-600" : "text-amber-600"}>{p.status}</span> · <span className="break-all">/posts/{p.slug}</span>
              </p>
            </div>
            <div className="flex w-full flex-wrap items-center gap-2 text-sm font-semibold sm:w-auto">
              {p.status === "published" && (
                <Link href={`/posts/${p.slug}`} target="_blank" className="flex min-h-11 items-center rounded-full px-3 py-2 hover:bg-ink/5">View</Link>
              )}
              <Link href={`/admin/posts/${p.id}`} className="flex min-h-11 items-center rounded-full bg-ink px-4 py-2 text-white">Edit</Link>
              <form action={remove}>
                <input type="hidden" name="id" value={p.id} />
                <button className="min-h-11 rounded-full border-2 border-red-600/60 px-4 py-2 text-red-600 hover:bg-red-600 hover:text-white">Delete</button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
