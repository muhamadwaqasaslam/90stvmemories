import type { Metadata } from "next";
import { coverUrl, BANNER_IMAGE } from "../../lib/stock";
import Link from "next/link";
import { Footer, Header } from "../../components/SiteChrome";
import { Pagination, SubscribeSplit, paginate } from "../../components/Blocks";
import { Cover } from "../../components/PostCard";
import { TrackedLink } from "../../components/Tracked";
import { getStoryPosts } from "../../lib/posts";

export const metadata: Metadata = {
  title: "Featured 90s TV Stories & Top Picks",
  description: "Top picks and featured stories about 90s cartoons, sitcoms and VHS-era TV from the 90s TV Memories archive.",
  alternates: { canonical: "/features" },
};
export const revalidate = 60;

export default async function Features({ searchParams }: { searchParams: Promise<{ cat?: string; page?: string }> }) {
  const { cat = "", page = "1" } = await searchParams;
  const stories = await getStoryPosts();
  const [hero] = stories;
  const archive = cat ? stories.filter((p) => p.category === cat) : stories;
  const { slice, pages, page: cur } = paginate(archive, Number(page), 8);
  const href = (n: number) => `/features?${new URLSearchParams({ ...(cat && { cat }), page: String(n) })}`;

  return (
    <div className="min-h-screen bg-[#0a0a23] text-white selection:bg-[#FF1493] selection:text-white">
      <Header />
      <main className="relative z-10 bg-gradient-to-b from-[#1a0a3a] via-[#10082b] to-[#0a0a23] pb-24">
        {/* Retro 90s Featured Hero */}
        <section className="relative overflow-hidden border-b border-[#FF1493]/30 bg-gradient-to-r from-[#1a0a3a] via-[#10082b] to-[#0a0a23] py-20 lg:py-28">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity filter blur-[1px]"
            style={{ backgroundImage: `url(${hero ? coverUrl(hero) : BANNER_IMAGE})` }}
          />
          <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.25)_0px,rgba(0,0,0,0.25)_2px,transparent_2px,transparent_4px)]" />

          <div className="relative mx-auto max-w-[1366px] px-6 lg:px-12">
            <span className="font-mono text-xs uppercase tracking-widest text-[#39FF14]">★ 90s TV Hall of Fame ★</span>
            <h1 className="mt-3 max-w-2xl font-head text-4xl sm:text-6xl font-black uppercase tracking-wider text-[#FF1493] drop-shadow-[0_0_20px_rgba(255,20,147,0.7)]">
              {hero?.title ?? "Press Play On Your Childhood"}
            </h1>
            <p className="mt-4 max-w-xl text-base text-[#F5E6C8]">{hero?.excerpt}</p>
            {hero && (
              <Link
                href={`/posts/${hero.slug}`}
                className="mt-6 inline-block rounded-full bg-[#FF1493] px-8 py-3.5 font-head text-lg font-bold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(255,20,147,0.7)] hover:bg-[#ff3baf] transition"
              >
                Read Featured Story →
              </Link>
            )}
          </div>
        </section>

        {/* Featured VHS Tape Cards Grid */}
        <section className="mx-auto max-w-[1366px] px-6 py-14 lg:px-12">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="font-head text-3xl uppercase tracking-wider text-[#00D9FF]">Featured VHS Tapes</h2>
            <Link href="/blog" className="font-mono text-xs uppercase text-[#FF1493] hover:underline">
              View All Tapes →
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {slice.map((p) => (
              <TrackedLink
                key={p.id}
                slug={p.slug}
                className="group flex flex-col overflow-hidden rounded-xl border border-black/20 bg-[#F2E8C9] text-black shadow-[4px_6px_0px_#000000] transition-all hover:-translate-y-1 hover:shadow-[6px_10px_0px_#FF1493]"
              >
                <div className="flex items-center justify-between bg-black px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#F5E6C8]">
                  <span className="flex items-center gap-1.5 font-bold text-[#39FF14]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#39FF14] animate-pulse" />
                    VHS • SP 120
                  </span>
                  <span className="text-[#00D9FF]">{p.category}</span>
                </div>
                <Cover post={p} />
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-head text-xl font-bold leading-tight tracking-wide text-black group-hover:text-[#FF1493] transition">
                    {p.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-black/75">{p.excerpt}</p>
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-black/10">
                    <span className="font-mono text-[11px] text-black/50">{p.category}</span>
                    <span className="inline-flex items-center gap-1 font-head text-sm font-bold uppercase tracking-wider text-[#FF1493]">
                      READ →
                    </span>
                  </div>
                </div>
              </TrackedLink>
            ))}
          </div>

          <Pagination page={cur} pages={pages} href={href} />
        </section>

        <div className="mx-auto max-w-[1366px] px-6 lg:px-12 mt-12">
          <SubscribeSplit />
        </div>
      </main>
      <Footer />
    </div>
  );
}
