import Link from "next/link";
import { Footer, Header } from "../components/SiteChrome";
import { PostCard } from "../components/PostCard";
import { getPublished } from "../lib/posts";

export const revalidate = 60;

export default async function Home({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const { cat } = await searchParams;
  const all = await getPublished();
  const categories = [...new Set(all.map((p) => p.category))];
  const posts = cat ? all.filter((p) => p.category === cat) : all;
  const [featured, ...rest] = posts;

  return (
    <>
      <Header />
      <main>
        <section className="relative overflow-hidden">
          <div className="absolute -top-24 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-pink/15 blur-3xl" />
          <div className="absolute -top-10 right-0 h-60 w-60 rounded-full bg-cyan/15 blur-3xl" />
          <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-28">
            <p className="inline-block rounded-full bg-white px-4 py-1.5 text-sm font-medium text-ink/70 shadow-sm ring-1 ring-ink/10">
              📼 Stories from the golden age of TV
            </p>
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight sm:text-6xl">
              Press play on your <span className="text-pink">childhood.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink/65">
              Saturday morning cartoons, Friday night sitcoms and VHS rentals. The TV moments that raised a generation.
            </p>
            <Link
              href="#stories"
              className="mt-8 inline-block rounded-full bg-ink px-7 py-3.5 font-semibold text-white shadow-lg shadow-ink/20 transition hover:-translate-y-0.5 hover:bg-pink"
            >
              Start reading
            </Link>
          </div>
        </section>

        <section id="stories" className="scroll-mt-20">
          <div className="mx-auto max-w-6xl px-4 pb-6 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-display text-2xl font-bold sm:text-3xl">Latest stories</h2>
              <div className="flex flex-wrap gap-2">
                <Chip href="/#stories" active={!cat}>All</Chip>
                {categories.map((c) => (
                  <Chip key={c} href={`/?cat=${encodeURIComponent(c)}#stories`} active={cat === c}>{c}</Chip>
                ))}
              </div>
            </div>

            {featured ? (
              <div className="mt-8 space-y-8">
                <PostCard post={featured} featured />
                {rest.length > 0 && (
                  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {rest.map((p) => <PostCard key={p.id} post={p} />)}
                  </div>
                )}
              </div>
            ) : (
              <p className="mt-10 rounded-2xl border border-dashed border-ink/20 p-10 text-center text-ink/60">No stories yet. Check back soon.</p>
            )}
          </div>
        </section>

        <section id="about" className="mx-auto mt-20 max-w-3xl scroll-mt-20 px-4 text-center sm:px-6">
          <h2 className="font-display text-2xl font-bold">About</h2>
          <p className="mt-3 text-lg leading-relaxed text-ink/65">
            90s TV Memories is a small, friendly corner of the internet for everyone who remembers rabbit ears, cereal bowls and rewinding the tape. Short reads, big nostalgia.
          </p>
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
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${active ? "bg-ink text-white" : "bg-white text-ink/70 ring-1 ring-ink/10 hover:bg-ink/5"}`}
    >
      {children}
    </Link>
  );
}
