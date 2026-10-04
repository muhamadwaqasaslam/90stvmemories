import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header } from "../../components/SiteChrome";
import { Banner } from "../../components/Blocks";
import { Mail, MapPin, Phone } from "../../components/icons";
import { MailForm } from "../../components/MailForm";

export const metadata: Metadata = { title: "Get in touch", description: "Where to find us, and a quick contact form." };

export default function ContactUs() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const cols = [
    { Icon: MapPin, title: "Where", body: "Online, wherever the VCR is still plugged in.", link: ["Read our story", "/about"] },
    { Icon: Phone, title: "Talk", body: "We reply to every message, usually within a few days.", link: ["Send a message", "#form"] },
    { Icon: Mail, title: "Email", body: email ?? "Use the form below", link: ["Latest stories", "/blog"] },
  ] as const;
  return (
    <>
      <Header />
      <main>
        <Banner title="Get In Touch" />
        <section className="mx-auto grid max-w-5xl gap-12 px-6 py-14 text-center md:grid-cols-3">
          {cols.map(({ Icon, title, body, link }) => (
            <div key={title}>
              <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#0c1f5c] text-white"><Icon className="h-8 w-8" /></span>
              <h2 className="mt-8 text-base uppercase text-navy">{title}</h2>
              <p className="mx-auto mt-4 max-w-[16rem] font-serif text-xl leading-7">{body}</p>
              <Link href={link[1]} className="mt-6 inline-block uppercase text-navy hover:underline">{link[0]}</Link>
            </div>
          ))}
        </section>
        <section id="form" className="bg-[#f1f4f7] px-6 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl text-[#0c1f5c] sm:text-5xl">Send us a note</h2>
            <p className="mx-auto mt-4 max-w-xl font-serif text-lg leading-7">Tell us what you remember. We read every message.</p>
            <MailForm
              underline
              subject="Message from the website"
              button="Send"
              className="mt-12 text-left [&_span]:text-lg [&_span]:text-[#0c1f5c] [&_button]:mx-auto [&_button]:block"
              fields={[
                { name: "name", label: "Name", required: true, half: true },
                { name: "email", label: "Email", type: "email", required: true, half: true },
                { name: "topic", label: "Topic", half: true },
                { name: "show", label: "Show or film", half: true },
                { name: "message", label: "Your message", type: "textarea" },
              ]}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
