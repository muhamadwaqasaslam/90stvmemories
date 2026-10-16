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
    <>
      <Header />
      <main>
        <Banner title="Contact Us" />
        <section className="mx-auto grid max-w-[1200px] gap-14 px-6 py-20 lg:grid-cols-[1.1fr_1fr]">
          <div className="bg-white p-8 shadow-[4px_6px_12px_rgba(0,0,0,0.2)] sm:p-10">
            <h2 className="text-4xl text-navy">Say hello</h2>
            <p className="mt-4 max-w-md font-serif text-lg leading-7">Got a TV memory to share, a correction or an idea? Fill in the form and we will read it in our inbox.</p>
            <div className="my-8 h-0.5 w-14 bg-navy" />
            <MailForm
              subject="Message from the website"
              button="Send"
              fields={[
                { name: "first", label: "First name", required: true, half: true },
                { name: "last", label: "Last name", required: true, half: true },
                { name: "email", label: "Email", type: "email", required: true },
                { name: "subject", label: "Subject", required: true },
                { name: "message", label: "Message", type: "textarea" },
              ]}
            />
          </div>
          <div className="font-serif text-lg">
            <ul className="space-y-8">
              {points.map(([t, d]) => (
                <li key={t}>
                  <p className="flex items-center gap-3 font-semibold"><Check className="h-5 w-5 text-navy" />{t}</p>
                  <p className="mt-2 pl-8 leading-7">{d}</p>
                </li>
              ))}
            </ul>
            <h2 className="mt-14 font-sans text-3xl text-navy">Prefer email?</h2>
            <p className="mt-4">{process.env.NEXT_PUBLIC_CONTACT_EMAIL ? <a className="text-navy underline" href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}>{process.env.NEXT_PUBLIC_CONTACT_EMAIL}</a> : "Use the form on this page."}</p>
          </div>
        </section>
      </main>
      <FooterColumns />
    </>
  );
}
