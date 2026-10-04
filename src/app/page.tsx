import Link from "next/link";
import { coverUrl } from "../lib/stock";
import { Footer, Header } from "../components/SiteChrome";
import { Cover, PostCard, PostRow } from "../components/PostCard";
import { TrackedLink } from "../components/Tracked";
import { getPublished } from "../lib/posts";

export const revalidate = 60;

export default async function Home({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const { cat } = await searchParams;
  const all = await getPublished();
  const categories = [...new Set(all.map((p) => p.category))];
  const posts = cat ? all.filter((p) => p.category === cat) : all;
  const [featured, ...rest] = posts;
  const columns = rest.slice(0, 3);
  const grid = rest.slice(3, 11);

  return (
    <>
      <Header />
      <main>
        {/* hero: navy-to-grey banner with the featured story */}
        <section className="relative overflow-hidden bg-gradient-to-r from-navy via-[#6b7aa0] to-[#8c8c8c]">
          {featured && <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${coverUrl(featured)})` }} />}
          <div className="relative mx-auto max-w-[1366px] px-6 py-20 lg:px-16 lg:py-28">
            {featured ? (
              <div className="max-w-xl">
                <Link href={`/?cat=${encodeURIComponent(featured.category)}#stories`} className="inline-block bg-white px-5 py-2 text-xs font-medium uppercase text-navy">
                  {featured.category}
                </Link>
                <h1 className="mt-6 text-3xl leading-snug text-white sm:text-[39px] sm:leading-[54px]">{featured.title}</h1>
                <p className="mt-4 line-clamp-3 font-serif text-lg text-white/90">{featured.excerpt}</p>
                <TrackedLink slug={featured.slug} className="mt-8 inline-block bg-white px-5 py-2 text-[11px] font-bold uppercase text-navy">
                  Read story
                </TrackedLink>
                <div className="mt-14 flex gap-3" aria-hidden>{[0, 1, 2, 3, 4, 5].map((i) => <span key={i} className={`h-3 w-3 rounded-full border-2 border-white ${i === 0 ? "bg-white" : ""}`} />)}</div>
              </div>
            ) : (
              <h1 className="text-3xl text-white sm:text-[39px]">Press play on your childhood.</h1>
            )}
          </div>
        </section>

        {/* three columns: image story + list */}
        {columns.length > 0 && (
          <section className="mx-auto max-w-[1366px] px-6 py-16 lg:px-16">
            <div className="grid gap-10 md:grid-cols-3">
              {columns.map((p, i) => {
                const more = grid.slice(i * 2, i * 2 + 2);
                return (
                  <div key={p.id} className="border-t-2 border-black/60 pt-2">
                    <p className="text-[19px] uppercase">{p.category}</p>
                    <TrackedLink slug={p.slug} className="group mt-4 block">
                      <Cover post={p} />
                      <h3 className="mt-4 font-serif text-xl capitalize leading-[25px] group-hover:text-navy">{p.title}</h3>
                      <p className="mt-2 font-condensed text-sm capitalize text-slate">{p.excerpt.slice(0, 60)}</p>
                    </TrackedLink>
                    <div className="mt-4">{more.map((m) => <PostRow key={m.id} post={m} />)}</div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 8-up card grid on grey */}
        <section id="stories" className="scroll-mt-4 bg-[#ececee] py-16">
          <div className="mx-auto max-w-[1366px] px-6 lg:px-16">
            <h2 className="text-center text-[40px] uppercase leading-tight">Latest stories</h2>
            <div id="topics" className="mt-6 flex flex-wrap justify-center gap-3 scroll-mt-4">
              <Chip href="/#stories" active={!cat}>All</Chip>
              {categories.map((c) => (
                <Chip key={c} href={`/?cat=${encodeURIComponent(c)}#stories`} active={cat === c}>{c}</Chip>
              ))}
            </div>
            {posts.length > 0 ? (
              <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {posts.map((p) => <PostCard key={p.id} post={p} />)}
              </div>
            ) : (
              <p className="mt-10 border border-dashed border-black/30 p-10 text-center">No stories yet. Check back soon.</p>
            )}
          </div>
        </section>

        {/* split: grey image block + about call-out */}
        <section className="grid md:grid-cols-2">
          <div className="min-h-64 bg-[#c4c4c4]">
            {featured && <Cover post={featured} big />}
          </div>
          <div className="bg-[#ececee] px-8 py-16 text-center md:px-20">
            <h2 className="text-[40px] uppercase leading-tight">Why 90s TV Memories?</h2>
            <p className="mx-auto mt-6 max-w-md font-serif text-xl leading-8">
              A small, friendly corner of the internet for everyone who remembers rabbit ears, cereal bowls and rewinding the tape.
            </p>
            <Link href="/about" className="mt-8 inline-block bg-navy px-8 py-3 text-[15px] font-bold uppercase text-white">Our story</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Chip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`px-5 py-2 font-condensed text-sm font-bold uppercase transition ${active ? "bg-navy text-white" : "bg-white text-black hover:bg-navy hover:text-white"}`}
    >
      {children}
    </Link>
  );
}
