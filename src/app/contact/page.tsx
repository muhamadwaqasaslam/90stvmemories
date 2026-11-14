import type { Metadata } from "next";
import { FooterColumns, Header } from "../../components/SiteChrome";
import { Banner } from "../../components/Blocks";
import { Check } from "../../components/icons";
import { MailForm } from "../../components/MailForm";

export const metadata: Metadata = {
  title: "Contact 90s TV Memories",
  description: "Share your favorite 90s TV memory, suggest a story or send the 90s TV Memories team a note.",
  alternates: { canonical: "/contact" },
};

const points = [
  ["Tell us your favourite show", "The one you rushed home for, the theme tune you can still sing."],
  ["Share the snack that went with it", "Cereal bowl, microwave popcorn or pizza on movie night."],
  ["Suggest a story", "Your memory could become the next article on the site."],
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#0a0a23] text-white selection:bg-[#FF1493] selection:text-white">
      <Header />
      <main className="relative z-10 bg-gradient-to-b from-[#1a0a3a] via-[#10082b] to-[#0a0a23] pb-24">
        <Banner title="Contact 90s TV Memories" />

        <section className="mx-auto grid max-w-[1200px] gap-12 px-6 py-16 lg:grid-cols-[1.1fr_1fr]">
          {/* Retro VHS Tape Contact Form Card */}
          <div className="overflow-hidden rounded-2xl border border-black/20 bg-[#F2E8C9] p-6 sm:p-10 text-black shadow-[6px_8px_0px_#000000]">
            <div className="-mx-6 -mt-6 sm:-mx-10 sm:-mt-10 mb-8 flex items-center justify-between bg-black px-6 py-2.5 font-mono text-xs font-bold tracking-widest text-[#F5E6C8]">
              <span className="flex items-center gap-1.5 text-[#39FF14]">
                <span className="h-2 w-2 rounded-full bg-[#39FF14] animate-pulse" />
                VHS • SP 120
              </span>
              <span className="text-[#00D9FF]">FAN MAIL DESK</span>
            </div>

            <span className="font-mono text-xs uppercase tracking-widest text-[#FF1493] font-bold">📼 Send a message</span>
            <h2 className="mt-1 font-head text-4xl sm:text-5xl font-black uppercase tracking-wider text-black">Say Hello</h2>
            <p className="mt-3 text-sm leading-relaxed text-black/75">
              Got a nostalgic TV memory to share, a show suggestion, or just want to talk about TGIF sitcoms? Drop us a note below!
            </p>

            <div className="my-6 h-0.5 w-16 bg-[#FF1493]" />

            <MailForm
              subject="Message from 90s TV Memories"
              button="SEND FAN MAIL →"
              fields={[
                { name: "first", label: "First name", required: true, half: true },
                { name: "last", label: "Last name", required: true, half: true },
                { name: "email", label: "Email address", type: "email", required: true },
                { name: "subject", label: "Favorite 90s Show / Subject", required: true },
                { name: "message", label: "Your Nostalgia Memory", type: "textarea" },
              ]}
            />
          </div>

          {/* Right Column: 90s Memory Prompts & Direct Email */}
          <div className="flex flex-col justify-center">
            <span className="font-mono text-xs uppercase tracking-widest text-[#00D9FF]">📼 TGIF Community</span>
            <h3 className="mt-2 font-head text-3xl sm:text-4xl uppercase tracking-wider text-[#FF1493]">
              What We Love Hearing About
            </h3>

            <ul className="mt-8 space-y-6">
              {points.map(([t, d]) => (
                <li key={t} className="rounded-xl border border-white/10 bg-[#160a33] p-5 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                  <p className="flex items-center gap-3 font-head text-xl uppercase tracking-wide text-[#F5E6C8]">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-[#39FF14] text-black text-xs font-black">✓</span>
                    {t}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#F5E6C8]/75 pl-9">{d}</p>
                </li>
              ))}
            </ul>

            <div className="mt-10 rounded-xl border border-[#00D9FF]/40 bg-[#10082b] p-6 shadow-[0_0_20px_rgba(0,217,255,0.2)]">
              <h4 className="font-head text-2xl uppercase tracking-wider text-[#00D9FF]">Prefer Direct Email?</h4>
              <p className="mt-2 text-sm text-[#F5E6C8]/80">
                You can write directly to our editorial inbox anytime at:
              </p>
              <p className="mt-2 font-mono text-sm font-bold text-[#FF1493]">
                {process.env.NEXT_PUBLIC_CONTACT_EMAIL ? (
                  <a className="hover:underline" href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}>
                    {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
                  </a>
                ) : (
                  "contact@90stvmemories.com"
                )}
              </p>
            </div>
          </div>
        </section>
      </main>
      <FooterColumns />
    </div>
  );
}
