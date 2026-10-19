import type { Metadata } from "next";
import Link from "next/link";
import { FooterColumns, Logo, NAV } from "../../components/SiteChrome";
import { Btn, Pagination, PostWide, paginate } from "../../components/Blocks";
import { Chevron, Search } from "../../components/icons";
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
    <>
      <header className="bg-white">
        <div className="mx-auto flex max-w-[1366px] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-5 lg:px-16">
          <Logo />
          <form action="/blog" className="flex w-full max-w-sm items-center border border-black/30 px-3 py-2 sm:w-auto">
            <Search className="h-4 w-4 text-slate" />
            <input name="q" placeholder="Search stories" aria-label="Search stories" className="ml-2 w-full min-w-0 font-serif outline-none sm:w-64" />
          </form>
        </div>
        <div className="border-y-2 border-navy">
          <nav className="mx-auto flex max-w-[1366px] flex-wrap justify-center gap-x-1 px-4 text-xs uppercase sm:px-6 sm:text-sm lg:px-16">
            <Link href="/magazine" className={`px-3 py-3 sm:px-6 ${!cat ? "bg-navy text-white" : "hover:text-navy"}`}>All</Link>
            {categories.map((c) => (
              <Link key={c} href={`/magazine?cat=${encodeURIComponent(c)}`} className={`px-3 py-3 sm:px-6 ${cat === c ? "bg-navy text-white" : "hover:text-navy"}`}>{c}</Link>
            ))}
            {NAV.slice(4).map(([l, h]) => <Link key={l} href={h} className="px-3 py-3 sm:px-6 hover:text-navy">{l}</Link>)}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1366px] px-6 py-10 lg:px-16">
        {lead && (
          <section className="grid gap-8 border border-black/10 border-t-2 border-t-navy p-6 md:grid-cols-2">
            <Cover post={lead} big />
            <div className="flex flex-col justify-center">
              <span className="w-fit bg-navy px-2 py-0.5 font-condensed text-xs font-bold uppercase text-white">{lead.category}</span>
              <h1 className="mt-4 text-3xl leading-snug text-navy">{lead.title}</h1>
              <p className="mt-4 line-clamp-4 font-serif text-lg leading-7">{lead.excerpt}</p>
              <TrackedLink slug={lead.slug} className="mt-6 inline-flex w-fit items-center gap-2 bg-navy px-5 py-2 font-serif text-sm text-white">Learn more <Chevron className="h-3 w-3" /></TrackedLink>
            </div>
          </section>
        )}

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_340px]">
          <div className="space-y-8">
            <h2 className="border border-black/10 px-5 py-4 text-xl text-navy">{cat || "Latest"} stories</h2>
            {slice.map((p) => <PostWide key={p.id} post={p} />)}
            {!slice.length && <p className="border border-dashed border-black/30 p-8 text-center">No more stories here.</p>}
            <Pagination page={cur} pages={pages} href={href} />
          </div>
          <aside className="space-y-8">
            <div className="border-t-2 border-navy pt-4">
              <h2 className="text-xl text-navy">Popular</h2>
              <div className="mt-4 divide-y divide-black/15">
                {all.slice(0, 3).map((p) => (
                  <div key={p.id} className="py-4 first:pt-0">
                    <TrackedLink slug={p.slug} className="block text-lg leading-snug text-navy hover:underline">{p.title}</TrackedLink>
                    <p className="mt-2 line-clamp-3 font-serif text-sm leading-5">{p.excerpt}</p>
                    <Btn href={`/posts/${p.slug}`} className="mt-3 px-3 py-1 text-xs">Read more <Chevron className="h-3 w-3" /></Btn>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#f1f4f7] p-6">
              <h2 className="text-xl text-navy">Share a TV memory</h2>
              <MailForm subject="A TV memory" kind="memory" fields={[{ name: "name", label: "Name" }, { name: "email", label: "Email", type: "email", required: true }, { name: "memory", label: "Your memory", type: "textarea" }]} button="Send" className="mt-4 [&_input]:bg-white [&_textarea]:bg-white" />
            </div>
          </aside>
        </div>
      </main>
      <FooterColumns />
    </>
  );
}
