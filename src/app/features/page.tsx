import type { Metadata } from "next";
import { coverUrl, BANNER_IMAGE } from "../../lib/stock";
import Link from "next/link";
import { Footer, Header } from "../../components/SiteChrome";
import { Btn, Pagination, SubscribeSplit, Title, paginate } from "../../components/Blocks";
import { Arrow, Search } from "../../components/icons";
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
  const categories = [...new Set(stories.map((p) => p.category))];
  const [hero, ...more] = stories;
  const strip = more.slice(0, 3);
  const archive = cat ? stories.filter((p) => p.category === cat) : stories;
  const top = archive.slice(0, 4);
  const showcase = top[0];
  const { slice, pages, page: cur } = paginate(archive, Number(page), 8);
  const href = (n: number) => `/features?${new URLSearchParams({ ...(cat && { cat }), page: String(n) })}`;

  return (
    <>
      <Header />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-r from-navy via-[#8da0b5] to-[#c4c4c4]">
          <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: `url(${hero ? coverUrl(hero) : BANNER_IMAGE})` }} />
          <div className="relative mx-auto max-w-[1366px] px-6 py-24 lg:px-16 lg:py-32">
            <h1 className="max-w-xl font-serif text-4xl leading-tight text-white sm:text-5xl">{hero?.title ?? "Press play on your childhood"}</h1>
            {hero && <Link href={`/posts/${hero.slug}`} className="mt-8 inline-block bg-white px-5 py-2 text-[11px] font-bold uppercase text-navy">Read this story</Link>}
            <div className="mt-16 flex gap-3" aria-hidden>{[0, 1, 2, 3, 4, 5].map((i) => <span key={i} className={`h-3 w-3 rounded-full border-2 border-white ${i === 0 ? "bg-white" : ""}`} />)}</div>
          </div>
        </section>

        {strip.length > 0 && (
          <section className="mx-auto max-w-[1366px] px-6 py-14 lg:px-16">
            <h2 className="text-center font-serif text-3xl uppercase text-navy">Don&apos;t miss</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {strip.map((p) => (
                <TrackedLink key={p.id} slug={p.slug} className="group grid grid-cols-[120px_1fr] gap-4">
                  <Cover post={p} big />
                  <div className="flex flex-col justify-between py-1">
                    <p className="line-clamp-4 font-serif text-sm leading-5 group-hover:text-navy">{p.excerpt}</p>
                    <span className="flex items-center gap-2 text-xs">read more <Arrow className="h-4 w-4" /></span>
                  </div>
                </TrackedLink>
              ))}
            </div>
          </section>
        )}

        <section className="mx-auto max-w-[1100px] px-6 lg:px-0">
          <div className="flex flex-col gap-4 bg-[#f1f1f1] p-3 md:flex-row md:items-center">
            <div className="flex flex-1 flex-wrap items-center gap-x-6 gap-y-2 px-3">
              <Link href="/features" className={`text-sm uppercase ${!cat ? "text-navy underline" : ""}`}>All</Link>
              {categories.map((c) => <Link key={c} href={`/features?cat=${encodeURIComponent(c)}`} className={`text-sm uppercase ${cat === c ? "text-navy underline" : ""}`}>{c}</Link>)}
            </div>
            <form action="/blog" className="flex items-center bg-navy px-3 py-2 text-white">
              <Search className="h-4 w-4" />
              <input name="q" placeholder="Search" aria-label="Search stories" className="ml-2 w-40 border border-white/50 bg-transparent px-2 py-1 font-serif text-sm outline-none placeholder:text-white/70" />
            </form>
          </div>
        </section>

        {showcase && (
          <section className="mx-auto mt-10 grid max-w-[1100px] bg-[#ececee] lg:grid-cols-[1.2fr_1fr]">
            <div className="p-6 text-center">
              <Cover post={showcase} />
              <span className="mt-8 inline-block bg-[#b9c8e6] px-2 text-[10px] uppercase">{showcase.category}</span>
              <h3 className="mx-auto mt-3 max-w-md font-serif text-lg uppercase leading-snug">{showcase.title}</h3>
              <Btn href={`/posts/${showcase.slug}`} className="mt-6 px-8 uppercase">Read story</Btn>
            </div>
            <ol className="bg-[#e5e5e7] p-6">
              <li className="mb-4 flex gap-2 text-xs uppercase"><span className="bg-black px-3 py-1 text-white">Top picks</span><span className="bg-white px-3 py-1">Newest</span></li>
              {top.map((p, i) => (
                <li key={p.id} className={`border-l-4 ${i === 0 ? "border-navy bg-white" : "border-transparent"} px-4 py-3`}>
                  <TrackedLink slug={p.slug} className="flex gap-4 font-serif text-sm uppercase leading-5 hover:text-navy"><span className="font-sans">{String(i + 1).padStart(2, "0")}</span>{p.title}</TrackedLink>
                </li>
              ))}
            </ol>
          </section>
        )}

        <section className="mx-auto max-w-[1100px] px-6 py-16 lg:px-0">
          <Title>{cat || "The full archive"}</Title>
          <div className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2">
            {slice.map((p) => (
              <div key={p.id} className="text-center">
                <span className="bg-[#b9c8e6] px-2 text-[10px] uppercase">{p.category}</span>
                <TrackedLink slug={p.slug} className="mt-3 block font-serif text-2xl leading-snug hover:text-navy">{p.title}</TrackedLink>
                <p className="mt-3 text-sm">{p.excerpt.slice(0, 40)}…</p>
                <Link href={`/posts/${p.slug}`} className="mt-1 inline-block border-b border-navy text-xs text-navy">Read more</Link>
              </div>
            ))}
          </div>
          <Pagination page={cur} pages={pages} href={href} />
        </section>
        <SubscribeSplit />
      </main>
      <Footer />
    </>
  );
}
