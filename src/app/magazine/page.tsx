import type { Metadata } from "next";
import Link from "next/link";
import { FooterColumns, Header } from "../../components/SiteChrome";
import { Pagination, PostWide, paginate } from "../../components/Blocks";
import { Cover } from "../../components/PostCard";
import { TrackedLink } from "../../components/Tracked";
import { MailForm } from "../../components/MailForm";
import { getStoryPosts } from "../../lib/posts";

export const metadata: Metadata = {
  title: "Magazine: 90s TV Nostalgia Stories",
  description: "A magazine-style front page for 90s TV nostalgia: cartoons, sitcoms, movies on VHS and the gadgets we grew up with.",
  alternates: { canonical: "/magazine" },
};
export const revalidate = 60;

export default async function Magazine({ searchParams }: { searchParams: Promise<{ cat?: string; page?: string }> }) {
  const { cat = "", page = "1" } = await searchParams;
  const stories = await getStoryPosts();
  const categories = [...new Set(stories.map((p) => p.category))];
  const list = cat ? stories.filter((p) => p.category === cat) : stories;
  const [lead, ...rest] = list;
  const { slice, pages, page: cur } = paginate(rest, Number(page), 6);
  const href = (n: number) => `/magazine?${new URLSearchParams({ ...(cat && { cat }), page: String(n) })}`;

  return (
    <div className="min-h-screen bg-[#0a0a23] text-white selection:bg-[#FF1493] selection:text-white">
      <Header />

      {/* Category Subheader */}
      <div className="border-b border-white/10 bg-[#160a33] text-xs uppercase tracking-wider">
        <nav className="mx-auto flex max-w-[1366px] flex-wrap items-center justify-center gap-2 px-4 py-3 sm:px-6">
          <Link
            href="/magazine"
            className={`rounded-full px-4 py-1.5 font-bold transition ${
              !cat ? "bg-[#FF1493] text-white shadow-[0_0_10px_rgba(255,20,147,0.7)]" : "text-[#F5E6C8] hover:text-[#00D9FF]"
            }`}
          >
            All Archives
          </Link>
          {categories.map((c) => (
            <Link
              key={c}
              href={`/magazine?cat=${encodeURIComponent(c)}`}
              className={`rounded-full px-4 py-1.5 font-bold transition ${
                cat === c ? "bg-[#FF1493] text-white shadow-[0_0_10px_rgba(255,20,147,0.7)]" : "text-[#F5E6C8] hover:text-[#00D9FF]"
              }`}
            >
              {c}
            </Link>
          ))}
        </nav>
      </div>

      <main className="mx-auto max-w-[1366px] px-4 sm:px-6 py-10 lg:px-12">
        {lead && (
          <section className="overflow-hidden rounded-2xl border-2 border-black/20 bg-[#F2E8C9] p-6 sm:p-10 text-black shadow-[6px_8px_0px_#000000]">
            <div className="-mx-6 -mt-6 sm:-mx-10 sm:-mt-10 mb-8 flex items-center justify-between bg-black px-6 py-2.5 font-mono text-xs font-bold tracking-widest text-[#F5E6C8]">
              <span className="flex items-center gap-1.5 text-[#39FF14]">
                <span className="h-2 w-2 rounded-full bg-[#39FF14] animate-pulse" />
                MAGAZINE LEAD • HI-FI STEREO
              </span>
              <span className="text-[#00D9FF]">{lead.category}</span>
            </div>

            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div className="overflow-hidden rounded-xl border-2 border-black shadow-[4px_4px_0px_#000]">
                <Cover post={lead} big />
              </div>
              <div>
                <span className="rounded bg-[#FF1493] px-3 py-1 font-mono text-xs font-bold uppercase text-white shadow-[0_0_10px_rgba(255,20,147,0.6)]">
                  {lead.category}
                </span>
                <h1 className="mt-4 font-head text-3xl sm:text-5xl font-black uppercase tracking-wide text-black leading-tight">
                  {lead.title}
                </h1>
                <p className="mt-4 text-sm sm:text-base leading-relaxed text-black/80">{lead.excerpt}</p>
                <TrackedLink
                  slug={lead.slug}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#FF1493] px-8 py-3.5 font-head text-lg font-bold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(255,20,147,0.7)] hover:bg-[#ff3baf] transition"
                >
                  Read Full Tape →
                </TrackedLink>
              </div>
            </div>
          </section>
        )}

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-head text-3xl uppercase tracking-wider text-[#00D9FF]">
                {cat || "Latest"} Stories
              </h2>
              <span className="font-mono text-xs text-[#39FF14]">{slice.length} Tapes</span>
            </div>
            {slice.map((p) => (
              <PostWide key={p.id} post={p} />
            ))}
            {!slice.length && (
              <p className="rounded-xl border border-dashed border-white/20 p-8 text-center text-[#F5E6C8]/60">
                No more stories in this category.
              </p>
            )}
            <Pagination page={cur} pages={pages} href={href} />
          </div>

          <aside className="space-y-8">
            <div className="rounded-2xl border border-white/10 bg-[#160a33] p-6 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <h2 className="font-head text-2xl uppercase tracking-wider text-[#FF1493] border-b border-white/10 pb-3">
                Top Tape Picks
              </h2>
              <div className="mt-4 divide-y divide-white/10">
                {stories.slice(0, 4).map((p) => (
                  <div key={p.id} className="py-4 first:pt-0">
                    <span className="font-mono text-[10px] uppercase text-[#39FF14]">{p.category}</span>
                    <TrackedLink
                      slug={p.slug}
                      className="mt-1 block font-head text-xl font-bold uppercase tracking-wide text-[#F5E6C8] hover:text-[#FF1493] transition"
                    >
                      {p.title}
                    </TrackedLink>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#00D9FF]/40 bg-[#10082b] p-6 shadow-[0_0_20px_rgba(0,217,255,0.2)]">
              <h2 className="font-head text-2xl uppercase tracking-wider text-[#00D9FF]">Share a TV Memory</h2>
              <p className="mt-1 text-xs text-[#F5E6C8]/75">Got a story from Friday night TGIF or Saturday cartoons?</p>
              <MailForm
                subject="A TV memory"
                kind="memory"
                fields={[
                  { name: "name", label: "Your name" },
                  { name: "email", label: "Email", type: "email", required: true },
                  { name: "memory", label: "Your memory", type: "textarea" },
                ]}
                button="SUBMIT MEMORY"
                className="mt-4"
              />
            </div>
          </aside>
        </div>
      </main>
      <FooterColumns />
    </div>
  );
}
