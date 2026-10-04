import type { Metadata } from "next";
import { coverUrl, BANNER_IMAGE } from "../../lib/stock";
import Link from "next/link";
import { Footer, Header } from "../../components/SiteChrome";
import { Banner, SubscribeSplit, Title } from "../../components/Blocks";
import { Cover } from "../../components/PostCard";
import { getPublished } from "../../lib/posts";

export const metadata: Metadata = { title: "About the site", description: "Who we are and what we cover on 90s TV Memories." };
export const revalidate = 300;

export default async function AboutUs() {
  const posts = await getPublished();
  const categories = [...new Set(posts.map((p) => p.category))];
  const cards = categories.length ? categories : ["Cartoons", "Sitcoms", "Movies & VHS", "Tech & Gadgets"];
  const count = (c: string) => posts.filter((p) => p.category === c).length;

  return (
    <>
      <Header />
      <main>
        <Banner title="About Us" />
        <section className="mx-auto grid max-w-5xl items-center gap-12 px-6 py-20 md:grid-cols-2">
          <div>
            <h2 className="text-2xl uppercase leading-snug text-navy">A small corner of the internet for 90s kids</h2>
            <p className="mt-5 font-serif text-base leading-7">
              Growing up in the 90s meant one family TV, a handful of channels and a weekly schedule that felt like a calendar of events. We started this site to keep those moments alive.
            </p>
            <p className="mt-4 font-serif text-base leading-7">
              Not as a museum, but as a place to smile, share a memory and remember that the best part of the shows was who we watched them with.{" "}
              <Link href="/contact" className="text-navy hover:underline">Share yours</Link>.
            </p>
          </div>
          {posts[0] ? <Cover post={posts[0]} /> : <div className="aspect-[16/10] bg-cover bg-center" style={{ backgroundImage: `url(${BANNER_IMAGE})` }} />}
        </section>

        <section className="mx-auto max-w-[1200px] px-6 pb-20">
          <Title>What you&apos;ll find here</Title>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((c) => (
              <Link key={c} href={`/blog?cat=${encodeURIComponent(c)}`} className="bg-[#fcfafb] px-6 py-8 text-center shadow-[4px_6px_10px_rgba(0,0,0,0.15)] transition hover:-translate-y-0.5">
                <h3 className="text-2xl text-navy">{c}</h3>
                <p className="mt-4 font-serif text-3xl leading-tight">{count(c)} {count(c) === 1 ? "story" : "stories"} to rewind through</p>
              </Link>
            ))}
            <div className="bg-[#fcfafb] px-6 py-8 text-center shadow-[4px_6px_10px_rgba(0,0,0,0.15)] sm:col-span-2 lg:col-span-1">
              <h3 className="text-2xl text-navy">Our promise</h3>
              <p className="mt-4 font-serif text-2xl leading-snug">
                Written with love. Short and easy to read. Respect for the originals. Made for the community. Be kind, please rewind.
              </p>
            </div>
          </div>
        </section>
        <SubscribeSplit title="Join the club" image={posts[1] ? coverUrl(posts[1]) : undefined} />
      </main>
      <Footer />
    </>
  );
}
