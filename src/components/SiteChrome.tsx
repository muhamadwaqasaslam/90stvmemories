import Link from "next/link";
import { Arrow, Facebook, Instagram, Mail, Pinterest, Search, Twitter, Youtube } from "./icons";
import { MailForm } from "./MailForm";
import { MobileNav } from "./MobileNav";

/** Own mark: a retro TV with rabbit ears, plus wordmark. */
export function Logo({ dark = false }: { dark?: boolean }) {
  const ink = dark ? "#ffffff" : "#2b4886";
  return (
    <Link href="/" className="inline-flex shrink-0 items-center gap-2 sm:gap-3" aria-label="90s TV Memories home">
      <svg width="46" height="42" viewBox="0 0 46 42" fill="none" aria-hidden className="h-9 w-auto shrink-0 sm:h-[42px]">
        <path d="M14 11 8 2M25 11l8-9" stroke={ink} strokeWidth="2.5" strokeLinecap="round" />
        <rect x="2" y="10" width="42" height="28" rx="7" fill={ink} />
        <rect x="7" y="15" width="25" height="18" rx="4" fill="#c5d3dc" />
        <circle cx="38" cy="19" r="2.3" fill="#c5d3dc" />
        <circle cx="38" cy="28" r="2.3" fill="#c5d3dc" />
        <path d="M13 24h13M13 28h8" stroke={ink} strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className={`font-head text-xl font-bold leading-none sm:text-2xl tracking-tight ${dark ? "text-white" : "text-navy"}`}>
        90s TV <span className={dark ? "text-[#c5d3dc]" : "text-black"}>Memories</span>
      </span>
    </Link>
  );
}

export function Socials({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {[Pinterest, Instagram, Twitter, Facebook].map((Icon, i) => (
        <Link key={i} href="/contact" aria-label="Follow us"><Icon /></Link>
      ))}
    </div>
  );
}

export const NAV = [
  ["Home", "/"],
  ["Stories", "/blog"],
  ["Magazine", "/magazine"],
  ["Features", "/features"],
  ["About", "/about"],
  ["Contact", "/contact"],
] as const;

export function Header() {
  return (
    <header className="relative bg-white">
      <div className="bg-navy text-xs text-white">
        <div className="mx-auto flex max-w-[1366px] items-center justify-between gap-x-6 gap-y-2 px-4 py-2.5 sm:px-6 sm:py-3 lg:px-16">
          <p className="flex min-w-0 items-center gap-2"><Mail className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">Saturday morning cartoons, TGIF sitcoms and VHS rentals</span></p>
          <Link href="/blog" className="hidden shrink-0 items-center gap-2 font-bold uppercase tracking-wide md:flex">Readable <Arrow className="h-3.5 w-3.5" /></Link>
          <div className="hidden sm:block"><Socials className="text-white [&_svg]:h-4 [&_svg]:w-4" /></div>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1366px] items-center gap-x-6 px-4 py-3 sm:px-6 sm:py-5 lg:gap-x-10 lg:px-16">
        <Logo />
        <nav aria-label="Main" className="ml-4 hidden flex-1 flex-wrap items-center gap-x-6 gap-y-2 text-[17px] text-black md:flex lg:gap-x-8">
          {NAV.map(([label, href]) => (
            <Link key={label} href={href} className="transition hover:text-navy">{label}</Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Link href="/blog" aria-label="Search stories" className="grid h-11 w-11 place-items-center text-black hover:text-navy"><Search /></Link>
          <MobileNav items={NAV} />
        </div>
      </div>
    </header>
  );
}

/** Centred-logo footer (landing + about pages). */
export function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto grid max-w-[1366px] items-center gap-6 px-6 pb-6 pt-16 text-center lg:grid-cols-3 lg:px-16">
        <Socials className="justify-center text-black lg:justify-start" />
        <div className="flex justify-center"><Logo /></div>
        <Link href="/contact" className="text-[17px] hover:text-navy lg:text-right">{process.env.NEXT_PUBLIC_CONTACT_EMAIL || "Contact us"}</Link>
      </div>
      <p className="mx-auto max-w-4xl px-6 pb-6 pt-4 text-center text-xl sm:text-2xl">
        A love letter to the shows, tapes and Saturday mornings that raised a generation
      </p>
      <div className="mx-auto max-w-[1366px] px-6 lg:px-16">
        <div className="border-t border-black" />
        <p className="py-4 text-center font-serif text-[15px]">© {new Date().getFullYear()} 90s TV Memories. All trademarks belong to their owners.</p>
      </div>
    </footer>
  );
}

/** Three-column footer (blog, article and magazine pages). */
export function FooterColumns() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  return (
    <footer className="border-t border-black/40 bg-white">
      <div className="mx-auto grid max-w-[1100px] gap-10 px-6 py-12 text-center md:grid-cols-3">
        <div>
          <h3 className="text-xl text-navy">Write to us</h3>
          <p className="mt-3 font-serif text-lg">{email || "Use the contact page"}</p>
        </div>
        <div>
          <h3 className="text-xl text-navy">Follow along</h3>
          <div className="mt-4 flex justify-center gap-5 text-navy">
            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
              <Link key={i} href="/contact" aria-label="Follow us"><Icon className="h-4 w-4" /></Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xl text-navy">Get new stories</h3>
          <MailForm subject="Newsletter signup" kind="subscribe" fields={[{ name: "email", placeholder: "Your email", type: "email" }]} button="Join" className="mt-3 flex justify-center" inline />
        </div>
      </div>
      <p className="px-6 pb-8 text-center font-serif text-[15px]">© {new Date().getFullYear()} 90s TV Memories. All trademarks belong to their owners.</p>
    </footer>
  );
}
