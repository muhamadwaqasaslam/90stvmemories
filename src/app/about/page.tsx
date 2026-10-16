import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header } from "../../components/SiteChrome";
import { Banner } from "../../components/Blocks";
import { getPublished } from "../../lib/posts";
import { JsonLd, breadcrumbLd, abs } from "../../lib/seo";

export const metadata: Metadata = {
  title: "About 90s TV Memories",
  description: "90s TV Memories is an independent US fan site for cartoons, sitcoms, VHS rentals and the TV rituals that raised a generation of 90s kids.",
  alternates: { canonical: "/about" },
};

export const revalidate = 300;

const topics = [
  ["🥣", "Cartoons", "Saturday mornings, cereal bowls and theme songs you can still sing."],
  ["📺", "Sitcoms", "Friday night families, catchphrases and the shows we watched together."],
  ["📼", "Movies & VHS", "Video store aisles, rewind rules and the weekend rental run."],
  ["📡", "Tech & Gadgets", "Rabbit ears, chunky remotes and the joy of channel surfing."],
];

const values = [
  ["Written with love", "Every story starts from a real memory of the shows, tapes and rituals we grew up with."],
  ["Short and easy to read", "Clear writing, big type and a few minutes of your time. No clutter, no clickbait."],
  ["Respect for the originals", "We celebrate the shows and the people who made them, and we credit our sources."],
  ["Made for the community", "Nostalgia is better shared. Your memories help decide what we write next."],
];

const faqs = [
  ["Who writes the stories?", "A small team of 90s kids who still remember the sound of a VCR rewinding. We write original pieces about the TV moments that shaped us."],
  ["Is this site affiliated with any TV network or studio?", "No. We are an independent fan site. All show names, characters and trademarks belong to their respective owners and are used only for commentary and nostalgia."],
  ["Can I share my own TV memory?", "We would love that. Get in touch and tell us your favorite show, ritual or snack. The best memories may become a story."],
  ["How often do you publish?", "We add new stories regularly. Check the latest stories on the home page."],
];

export default async function About() {
  const posts = await getPublished();
  const categories = new Set(posts.map((p) => p.category)).size;
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

  return (
    <>
      <Header />
      <main>
        <JsonLd
          data={[
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
            },
            { "@context": "https://schema.org", "@type": "AboutPage", name: "About 90s TV Memories", url: abs("/about"), inLanguage: "en-US" },
            breadcrumbLd([["Home", "/"], ["About", "/about"]]),
          ]}
        />
        <Banner title="About Us" />

        <section className="mx-auto max-w-4xl px-6 pb-4 pt-16 text-center">
          <h2 className="text-2xl uppercase text-navy sm:text-3xl">A love letter to the golden age of TV</h2>
          <div className="mt-6 space-y-4 font-serif text-lg leading-7">
            <p>
              Growing up in the 90s meant one family TV, a handful of channels and a weekly schedule that felt like a calendar of events. Saturday morning belonged to cartoons. Friday night belonged to the whole family on the couch.
            </p>
            <p>
              We started this site to keep those moments alive. Not as a museum, but as a place to smile, share a memory and remember that the best part of the shows was who we watched them with.
            </p>
            <p className="font-serif text-xl">
              {posts.length} stories across {categories || topics.length} topics.{" "}
              {email && <a href={`mailto:${email}`} className="text-navy hover:underline">{email}</a>}
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1100px] px-6 pt-16">
          <h2 className="text-center text-2xl uppercase text-navy sm:text-3xl">What you&apos;ll find here</h2>
          <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {topics.map(([icon, title, text]) => (
              <Link key={title} href={`/?cat=${encodeURIComponent(title)}#stories`} className="group text-center">
                <span className="text-3xl" aria-hidden>{icon}</span>
                <h3 className="mt-2 text-2xl text-navy group-hover:underline">{title}</h3>
                <p className="mt-2 font-serif text-xl leading-6">{text}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1100px] px-6 pt-20">
          <h2 className="text-center text-2xl uppercase text-navy sm:text-3xl">How we write</h2>
          <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2">
            {values.map(([title, text]) => (
              <div key={title} className="text-center">
                <h3 className="text-2xl text-navy">{title}</h3>
                <p className="mx-auto mt-2 max-w-sm font-serif text-xl leading-6">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 pt-20">
          <h2 className="text-center text-2xl uppercase text-navy sm:text-3xl">Questions</h2>
          <div className="mt-8 divide-y divide-black/20 border-y border-black/20">
            {faqs.map(([q, a]) => (
              <details key={q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-xl">
                  {q}
                  <span className="text-2xl text-navy transition group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="mt-3 font-serif text-lg leading-7">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 pt-20 text-center">
          <h2 className="text-2xl uppercase text-navy sm:text-3xl">Got a TV memory to share?</h2>
          <p className="mx-auto mt-3 max-w-md font-serif text-xl leading-7">
            Tell us your favorite show, the snack that went with it, or the rule your house had about the remote.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {email && (
              <a href={`mailto:${email}`} className="bg-navy px-8 py-3 text-[15px] font-bold uppercase text-white">Email us</a>
            )}
            <Link href="/#stories" className="border border-navy px-8 py-3 text-[15px] font-bold uppercase text-navy hover:bg-navy hover:text-white">
              Read the latest stories
            </Link>
          </div>
          <p className="mt-8 text-sm text-slate">
            90s TV Memories is an independent fan site and is not affiliated with any network, studio or brand mentioned. All trademarks belong to their owners.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
