import type { Metadata } from "next";
import { FooterColumns, Header } from "../../components/SiteChrome";
import { Banner, Pagination, PostGridCard, paginate } from "../../components/Blocks";
import { Search } from "../../components/icons";
import { getStoryPosts } from "../../lib/posts";

export const metadata: Metadata = {
  title: "90s TV Stories: Cartoons, Sitcoms & VHS Memories",
  description: "Browse every 90s TV Memories story: Saturday morning cartoons, TGIF sitcoms, VHS rentals and retro tech. Search by show or topic.",
  alternates: { canonical: "/blog" },
};
export const revalidate = 60;

export default async function Blog({ searchParams }: { searchParams: Promise<{ cat?: string; q?: string; page?: string }> }) {
  const { cat = "", q = "", page = "1" } = await searchParams;
  const stories = await getStoryPosts();
  const categories = [...new Set(stories.map((p) => p.category))];
  const needle = q.trim().toLowerCase();
  const filtered = stories.filter((p) => (!cat || p.category === cat) && (!needle || `${p.title} ${p.excerpt}`.toLowerCase().includes(needle)));
  const { slice, pages, page: cur } = paginate(filtered, Number(page), 9);
  const href = (n: number) => `/blog?${new URLSearchParams({ ...(cat && { cat }), ...(q && { q }), page: String(n) })}`;

  return (
    <>
      <Header />
      <main>
        <Banner title="All Stories" />
        <section className="mx-auto max-w-[1366px] px-6 py-14 lg:px-16">
          <form className="mx-auto flex max-w-2xl flex-col gap-4 sm:flex-row" action="/blog">
            <select name="cat" defaultValue={cat} aria-label="Topic" className="h-12 flex-1 border border-black bg-white px-3 text-lg">
              <option value="">All topics</option>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
            <div className="flex h-12 flex-1 items-center border border-black bg-white px-3">
              <input name="q" defaultValue={q} placeholder="Search stories" aria-label="Search stories" className="min-w-0 flex-1 text-lg outline-none" />
              <button aria-label="Search"><Search className="h-5 w-5" /></button>
            </div>
          </form>
          {slice.length ? (
            <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">{slice.map((p) => <PostGridCard key={p.id} post={p} />)}</div>
          ) : (
            <p className="mt-12 border border-dashed border-black/30 p-10 text-center">No stories match that search.</p>
          )}
          <Pagination page={cur} pages={pages} href={href} />
        </section>
      </main>
      <FooterColumns />
    </>
  );
}
