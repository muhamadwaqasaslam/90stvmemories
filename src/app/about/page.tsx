import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header } from "../../components/SiteChrome";
import { getPublished } from "../../lib/posts";

export const metadata: Metadata = {
  title: "About",
  description: "90s TV Memories is a friendly home for cartoons, sitcoms, VHS rentals and the TV rituals that raised a generation.",
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
        {/* hero */}
        <section className="relative overflow-hidden">
          <div className="absolute -top-24 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-pink/15 blur-3xl" />
          <div className="absolute -top-10 right-0 h-60 w-60 rounded-full bg-cyan/15 blur-3xl" />
          <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-24">
            <p className="inline-block rounded-full bg-white px-4 py-1.5 text-sm font-medium text-ink/70 shadow-sm ring-1 ring-ink/10">About us</p>
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight sm:text-5xl">
              A love letter to the <span className="text-pink">golden age of TV.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink/65">
              90s TV Memories is a small, friendly corner of the internet for everyone who remembers rabbit ears, cereal bowls and rewinding the tape.
            </p>
          </div>
        </section>

        {/* story */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-10 md:grid-cols-[1.3fr_1fr] md:items-center">
            <div>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">Our story</h2>
              <div className="mt-4 space-y-4 text-lg leading-relaxed text-ink/70">
                <p>
                  Growing up in the 90s meant one family TV, a handful of channels and a weekly schedule that felt like a calendar of events. Saturday morning belonged to cartoons. Friday night belonged to the whole family on the couch.
                </p>
                <p>
                  We started this site to keep those moments alive. Not as a museum, but as a place to smile, share a memory and remember that the best part of the shows was who we watched them with.
                </p>
              </div>
            </div>
            <div className="pop rounded-2xl bg-white p-6">
              <dl className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <dt className="text-sm text-ink/55">Stories</dt>
                  <dd className="font-display text-4xl font-bold text-pink">{posts.length}</dd>
                </div>
                <div>
                  <dt className="text-sm text-ink/55">Topics</dt>
                  <dd className="font-display text-4xl font-bold text-pink">{categories || topics.length}</dd>
                </div>
              </dl>
              <p className="mt-5 rounded-xl bg-paper px-4 py-3 text-center font-medium text-ink/70">📼 Be kind, please rewind.</p>
            </div>
          </div>
        </section>

        {/* topics */}
        <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
          <h2 className="text-center font-display text-2xl font-bold sm:text-3xl">What you&apos;ll find here</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {topics.map(([icon, title, text]) => (
              <Link
                key={title}
                href={`/?cat=${encodeURIComponent(title)}#stories`}
                className="pop pop-hover group rounded-2xl bg-white p-6"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-pink/10 text-2xl">{icon}</span>
                <h3 className="mt-4 font-display text-lg font-semibold group-hover:text-pink">{title}</h3>
                <p className="mt-2 leading-relaxed text-ink/65">{text}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* values */}
        <section className="mt-20 border-y border-ink/10 bg-white/70">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <h2 className="text-center font-display text-2xl font-bold sm:text-3xl">How we write</h2>
            <ul className="mt-10 grid gap-8 sm:grid-cols-2">
              {values.map(([title, text], i) => (
                <li key={title} className="flex gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-pink text-sm font-bold text-white">{i + 1}</span>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{title}</h3>
                    <p className="mt-1 leading-relaxed text-ink/65">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* faq */}
        <section className="mx-auto mt-20 max-w-3xl px-4 sm:px-6">
          <h2 className="text-center font-display text-2xl font-bold sm:text-3xl">Questions</h2>
          <div className="mt-8 space-y-3">
            {faqs.map(([q, a]) => (
              <details key={q} className="pop group rounded-2xl bg-white px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {q}
                  <span className="text-xl text-pink transition group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="mt-3 leading-relaxed text-ink/70">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* contact */}
        <section className="mx-auto mt-20 max-w-3xl px-4 sm:px-6">
          <div className="rounded-3xl bg-ink px-6 py-12 text-center text-white sm:px-12">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Got a TV memory to share?</h2>
            <p className="mx-auto mt-3 max-w-md leading-relaxed text-white/70">
              Tell us your favorite show, the snack that went with it, or the rule your house had about the remote.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {email && (
                <a href={`mailto:${email}`} className="rounded-full bg-pink px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-pink/90">
                  Email us
                </a>
              )}
              <Link href="/#stories" className="rounded-full border border-white/30 px-6 py-3 font-semibold transition hover:bg-white/10">
                Read the latest stories
              </Link>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-ink/45">
            90s TV Memories is an independent fan site and is not affiliated with any network, studio or brand mentioned. All trademarks belong to their owners.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
