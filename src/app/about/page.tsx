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
    <div className="min-h-screen bg-[#0a0a23] text-white selection:bg-[#FF1493] selection:text-white">
      <Header />
      <main className="relative z-10 bg-gradient-to-b from-[#1a0a3a] via-[#10082b] to-[#0a0a23] pb-24">
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
        <Banner title="About 90s TV Memories" />

        <section className="mx-auto max-w-4xl px-6 pb-4 pt-16 text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-[#00D9FF]">📼 Our Mission</span>
          <h2 className="mt-2 font-head text-3xl sm:text-5xl font-black uppercase tracking-wider text-[#FF1493] drop-shadow-[0_0_15px_rgba(255,20,147,0.6)]">
            A Love Letter to the Golden Age of TV
          </h2>
          <div className="mt-6 space-y-4 text-base sm:text-lg leading-relaxed text-[#F5E6C8]">
            <p>
              Growing up in the 90s meant one family TV, a handful of channels, and a weekly schedule that felt like an appointment with destiny. Saturday morning belonged to cartoons. Friday night belonged to the whole family gathered around TGIF.
            </p>
            <p>
              We built 90s TV Memories to keep those moments alive. Not as a dusty museum, but as a vibrant playground to smile, relive classic memories, and remember that the best part of the shows was who we watched them with.
            </p>
            <p className="font-mono text-sm text-[#39FF14]">
              ★ {posts.length} VHS tapes archived across {categories || topics.length} retro categories.{" "}
              {email && <a href={`mailto:${email}`} className="text-[#00D9FF] underline hover:text-[#FF1493] transition">{email}</a>}
            </p>
          </div>
        </section>

        {/* Topics Grid as VHS Cards */}
        <section className="mx-auto max-w-[1200px] px-6 pt-16">
          <h2 className="text-center font-head text-3xl sm:text-4xl uppercase tracking-wider text-[#00D9FF] drop-shadow-[0_0_15px_rgba(0,217,255,0.5)]">
            What You&apos;ll Find In The Vault
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {topics.map(([icon, title, text]) => (
              <Link
                key={title}
                href={`/blog?cat=${encodeURIComponent(title)}`}
                className="group flex flex-col rounded-xl border border-black/20 bg-[#F2E8C9] p-6 text-black shadow-[4px_6px_0px_#000000] transition-all hover:-translate-y-1 hover:shadow-[6px_10px_0px_#FF1493]"
              >
                <div className="flex items-center justify-between border-b border-black/15 pb-3">
                  <span className="text-3xl" aria-hidden>{icon}</span>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#FF1493]">SP • 120</span>
                </div>
                <h3 className="mt-4 font-head text-2xl font-bold uppercase tracking-wide text-black group-hover:text-[#FF1493] transition">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-black/75">{text}</p>
                <span className="mt-auto pt-4 inline-flex items-center gap-1 font-head text-sm font-bold uppercase tracking-wider text-[#FF1493]">
                  Explore Tapes →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section className="mx-auto max-w-[1100px] px-6 pt-20">
          <h2 className="text-center font-head text-3xl sm:text-4xl uppercase tracking-wider text-[#FF1493] drop-shadow-[0_0_15px_rgba(255,20,147,0.5)]">
            How We Tell These Stories
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {values.map(([title, text]) => (
              <div key={title} className="rounded-xl border border-white/10 bg-[#160a33] p-6 text-left shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                <span className="font-mono text-xs uppercase tracking-widest text-[#39FF14]">📼 Core Standard</span>
                <h3 className="mt-2 font-head text-2xl uppercase tracking-wider text-[#F5E6C8]">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#F5E6C8]/80">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="mx-auto max-w-3xl px-6 pt-20">
          <h2 className="text-center font-head text-3xl sm:text-4xl uppercase tracking-wider text-[#00D9FF]">
            Frequently Asked Questions
          </h2>
          <div className="mt-8 divide-y divide-white/10 rounded-2xl border border-white/10 bg-[#160a33] p-6">
            {faqs.map(([q, a]) => (
              <details key={q} className="group py-4 first:pt-0 last:pb-0">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-head text-xl uppercase tracking-wider text-[#F5E6C8] hover:text-[#FF1493] transition">
                  {q}
                  <span className="text-2xl text-[#00D9FF] transition group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[#F5E6C8]/80">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Call to action */}
        <section className="mx-auto max-w-3xl px-6 pt-20 text-center">
          <h2 className="font-head text-3xl sm:text-4xl uppercase tracking-wider text-[#FF1493]">Got a TV Memory to Share?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm sm:text-base text-[#F5E6C8]/90">
            Tell us your favorite show, the snack that went with it, or the rule your house had about the remote!
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-[#FF1493] px-8 py-3.5 font-head text-lg font-bold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(255,20,147,0.7)] hover:bg-[#ff3baf] transition"
            >
              Send Us Your Memory
            </Link>
            <Link
              href="/blog"
              className="rounded-full border-2 border-[#00D9FF] bg-[#0a0a23] px-8 py-3.5 font-head text-lg font-bold uppercase tracking-wider text-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.4)] hover:bg-[#00D9FF] hover:text-black transition"
            >
              Browse All Stories →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
