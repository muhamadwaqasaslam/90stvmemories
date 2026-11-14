import Link from "next/link";
import { AdminShell } from "../../../components/admin/Shell";
import { getAllPosts } from "../../../lib/posts";
import { fmtDate } from "../../../lib/dates";
import { remove } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Articles | 90s TV Admin", robots: { index: false } };

export default async function PostsAdmin({ searchParams }: { searchParams: Promise<{ saved?: string; deleted?: string }> }) {
  const sp = await searchParams;
  const posts = await getAllPosts();

  return (
    <AdminShell active="/admin/posts">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-[#39FF14]">📼 VHS BROADCAST VAULT</p>
          <h1 className="mt-1 font-head text-4xl sm:text-5xl font-black uppercase tracking-wider text-[#FF1493] drop-shadow-[0_0_15px_rgba(255,20,147,0.6)]">
            Articles &amp; Tapes
          </h1>
          <p className="mt-1 font-mono text-xs text-[#F5E6C8]/70">Total {posts.length} archived tapes in database.</p>
        </div>
        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          <a
            href="/api/admin/backup"
            download
            className="flex min-h-10 items-center gap-2 rounded-lg border border-white/20 bg-[#160a33] px-4 py-2 font-mono text-xs font-bold uppercase text-[#F5E6C8] hover:border-[#00D9FF] hover:text-[#00D9FF] transition"
            title="Download full JSON backup of all articles"
          >
            <span>💾</span> JSON Backup
          </a>
          <Link
            href="/admin/posts/new"
            className="flex min-h-10 items-center rounded-lg bg-[#FF1493] px-6 py-2 text-center font-head text-base font-bold uppercase tracking-wider text-white shadow-[0_0_15px_rgba(255,20,147,0.7)] hover:bg-[#ff3baf] transition"
          >
            + New Article Tape
          </Link>
        </div>
      </div>

      {(sp.saved || sp.deleted) && (
        <div role="status" className="mt-6 rounded-xl border border-[#39FF14]/50 bg-[#160a33] px-4 py-3 font-mono text-sm font-bold text-[#39FF14]">
          {sp.saved ? "✓ Saved! Your article is on air." : "✓ Article tape deleted."}
        </div>
      )}

      <ul className="mt-6 space-y-3">
        {posts.map((p) => (
          <li
            key={p.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#160a33] p-4 sm:p-5 shadow-[0_0_15px_rgba(0,0,0,0.4)] transition hover:border-[#00D9FF]/40"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="rounded bg-black px-2 py-0.5 font-mono text-[10px] font-bold text-[#FFD24A]">
                  {p.id}
                </span>
                <span className={`font-mono text-xs font-bold uppercase ${p.status === "published" ? "text-[#39FF14]" : "text-amber-400"}`}>
                  ● {p.status}
                </span>
              </div>
              <p className="mt-1 font-head text-xl font-bold tracking-wide text-[#F5E6C8] hover:text-[#FF1493] transition">
                {p.title}
              </p>
              <p className="mt-1 font-mono text-xs text-white/50">
                {p.category} · {fmtDate(p.createdAt)} · <span className="text-[#00D9FF]">/posts/{p.slug}</span>
              </p>
            </div>
            <div className="flex w-full flex-wrap items-center gap-2 font-mono text-xs font-bold sm:w-auto">
              {p.status === "published" && (
                <Link
                  href={`/posts/${p.slug}`}
                  target="_blank"
                  className="rounded-lg border border-[#00D9FF] px-3.5 py-2 text-[#00D9FF] hover:bg-[#00D9FF] hover:text-black transition"
                >
                  View ↗
                </Link>
              )}
              <Link
                href={`/admin/posts/${p.id}`}
                className="rounded-lg bg-[#FF1493] px-4 py-2 text-white shadow-[0_0_10px_rgba(255,20,147,0.5)] hover:bg-[#ff3baf] transition"
              >
                Edit
              </Link>
              <form action={remove}>
                <input type="hidden" name="id" value={p.id} />
                <button className="rounded-lg border border-red-500/60 px-3 py-2 text-red-400 hover:bg-red-500 hover:text-white transition">
                  Delete
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
