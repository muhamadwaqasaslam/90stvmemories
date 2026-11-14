import Link from "next/link";
import { Arrow, Facebook, Instagram, Mail, Pinterest, Search, Twitter, Youtube } from "./icons";
import { MobileNav } from "./MobileNav";
import { FB_PAGES } from "../lib/site";

/** Own mark: a retro TV with rabbit ears and green slime splash. */
export function Logo({ dark = true }: { dark?: boolean }) {
  return (
    <div className="relative flex items-center">
      {/* Organic Slime Splash SVG behind logo */}
      <div className="pointer-events-none absolute -inset-2 -left-3 scale-110 select-none">
        <svg viewBox="0 0 200 65" fill="#39FF14" className="h-full w-full slime-drop-shadow">
          <path d="M12,28 C6,12 28,6 50,14 C72,2 100,9 122,6 C150,2 182,12 188,28 C194,45 172,55 150,50 C128,60 100,53 78,60 C50,66 22,58 12,44 C4,35 6,31 12,28 Z" />
          <circle cx="192" cy="38" r="4" fill="#39FF14" />
          <circle cx="8" cy="48" r="3" fill="#39FF14" />
        </svg>
      </div>

      <Link href="/" className="relative z-10 flex items-center gap-2.5 py-1 px-1" aria-label="90s TV Memories home">
        <svg width="40" height="34" viewBox="0 0 46 42" fill="none" className="h-8 w-auto shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          <path d="M14 11 8 2M25 11l8-9" stroke="#000" strokeWidth="3" strokeLinecap="round" />
          <rect x="2" y="10" width="42" height="28" rx="7" fill="#0a0a23" stroke="#000" strokeWidth="2.5" />
          <rect x="7" y="15" width="25" height="18" rx="4" fill="#00D9FF" />
          <circle cx="38" cy="19" r="2.5" fill="#FF1493" />
          <circle cx="38" cy="28" r="2.5" fill="#FFD24A" />
        </svg>
        <span className="font-[family-name:var(--font-bebas)] text-2xl sm:text-3xl tracking-tight text-black drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]">
          90s TV <span className="text-[#10082b]">MEMORIES</span>
        </span>
      </Link>
    </div>
  );
}

export function Socials({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <a
        href={FB_PAGES.beverlyHills.url}
        target="_blank"
        rel="noopener noreferrer"
        title="Beverly Hills 90210 Fan (8.2K Fans)"
        aria-label="Beverly Hills 90210 Fan Facebook Page"
        className="inline-flex items-center gap-1 text-[#00D9FF] hover:text-[#FF1493] transition"
      >
        <Facebook className="h-4 w-4" />
        <span className="text-[10px] font-bold">90210 ({FB_PAGES.beverlyHills.followers})</span>
      </a>
      <a
        href={FB_PAGES.fullHouse.url}
        target="_blank"
        rel="noopener noreferrer"
        title="Full House Fan Club (2.5K Fans)"
        aria-label="Full House Fan Club Facebook Page"
        className="inline-flex items-center gap-1 text-[#FFD24A] hover:text-[#FF1493] transition"
      >
        <Facebook className="h-4 w-4" />
        <span className="text-[10px] font-bold">Full House ({FB_PAGES.fullHouse.followers})</span>
      </a>
      <Link href="/contact" aria-label="Follow on Pinterest" className="hover:text-[#00D9FF] transition"><Pinterest className="h-4 w-4" /></Link>
      <Link href="/contact" aria-label="Follow on Instagram" className="hover:text-[#00D9FF] transition"><Instagram className="h-4 w-4" /></Link>
      <Link href="/contact" aria-label="Follow on Twitter" className="hover:text-[#00D9FF] transition"><Twitter className="h-4 w-4" /></Link>
    </div>
  );
}

export const NAV = [
  ["Home", "/"],
  ["Shows", "/blog?cat=90s+TV+Sitcoms"],
  ["Quizzes", "/blog"],
  ["Shop", "/features"],
  ["About", "/about"],
  ["Contact", "/contact"],
] as const;

export function Header() {
  return (
    <header className="relative z-30 border-b border-[#FF1493]/30 bg-[#0a0a23]/95 backdrop-blur-md text-white">
      {/* Retro top ticker bar */}
      <div className="border-b border-white/10 bg-[#160a33] text-xs text-[#F5E6C8]">
        <div className="mx-auto flex max-w-[1366px] items-center justify-between gap-x-6 gap-y-2 px-4 py-1.5 sm:px-6 lg:px-12">
          <p className="flex min-w-0 items-center gap-2">
            <span className="text-[#39FF14]">📼</span>
            <span className="truncate font-mono">Saturday morning cartoons, TGIF sitcoms and VHS rental memories</span>
          </p>
          <div className="hidden sm:block">
            <Socials />
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1366px] items-center justify-between px-4 py-3 sm:px-6 lg:px-12">
        <Logo />

        {/* Desktop Navigation */}
        <nav aria-label="Main" className="hidden items-center gap-6 font-bold uppercase tracking-wider text-sm md:flex lg:gap-8">
          {NAV.map(([label, href]) => (
            <Link key={label} href={href} className="text-[#F5E6C8] hover:text-[#00D9FF] transition hover:drop-shadow-[0_0_8px_rgba(0,217,255,0.6)]">
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side: Login & Search */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/login"
            className="rounded-full border-2 border-[#FF1493] bg-[#0a0a23] px-4 py-1.5 font-bold uppercase text-xs tracking-widest text-[#FF1493] shadow-[0_0_15px_rgba(255,20,147,0.5)] hover:bg-[#FF1493] hover:text-white transition duration-200 hover:shadow-[0_0_25px_rgba(255,20,147,0.85)]"
          >
            LOGIN
          </Link>
          <Link href="/blog" aria-label="Search stories" className="grid h-9 w-9 place-items-center text-[#00D9FF] hover:text-[#FF1493] transition">
            <Search className="h-5 w-5" />
          </Link>
          <div className="md:hidden">
            <MobileNav items={NAV} />
          </div>
        </div>
      </div>

      {/* Mobile quick links */}
      <div className="flex items-center justify-center gap-4 overflow-x-auto border-t border-white/10 px-4 py-2 font-bold uppercase text-xs tracking-wider md:hidden">
        <Link href="/" className="text-[#00D9FF]">Home</Link>
        <Link href="/blog?cat=90s+TV+Sitcoms" className="text-[#F5E6C8]">Shows</Link>
        <a href={FB_PAGES.beverlyHills.url} target="_blank" rel="noopener noreferrer" className="text-[#00D9FF] flex items-center gap-1">
          <Facebook className="h-3 w-3" /> 90210
        </a>
        <a href={FB_PAGES.fullHouse.url} target="_blank" rel="noopener noreferrer" className="text-[#FFD24A] flex items-center gap-1">
          <Facebook className="h-3 w-3" /> Full House
        </a>
      </div>
    </header>
  );
}

/** Global Retro 90s Footer */
export function Footer() {
  return (
    <footer className="relative mt-20 border-t-2 border-[#FF1493]/40 bg-[#070517] pt-16 pb-12 text-[#F5E6C8]">
      {/* Green Slime Drips Divider */}
      <div className="pointer-events-none absolute -top-4 left-0 right-0 overflow-hidden select-none">
        <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="h-6 w-full slime-drop-shadow" fill="#39FF14">
          <path d="M0,0 L1200,0 L1200,10 Q1150,10 1130,25 Q1110,40 1090,25 Q1070,10 1030,10 Q970,10 950,30 Q930,10 880,10 Q830,10 810,25 Q790,10 740,10 Q680,10 660,35 Q640,10 590,10 Q540,10 520,25 Q500,10 450,10 Q390,10 370,30 Q350,10 300,10 Q240,10 220,25 Q200,10 150,10 Q100,10 80,30 Q60,10 0,10 Z" />
        </svg>
      </div>

      <div className="mx-auto max-w-[1366px] px-4 sm:px-6 lg:px-12">
        {/* Newsletter Box with Beige Input & Pink SUBSCRIBE */}
        <div className="mx-auto max-w-2xl rounded-2xl border-2 border-black bg-gradient-to-r from-[#1b0d38] to-[#110826] p-6 text-center shadow-[6px_6px_0px_#FF1493] sm:p-8">
          <span className="inline-block -rotate-1 rounded bg-[#FFD24A] px-3.5 py-1 font-mono text-xs font-bold uppercase text-black shadow-[2px_2px_0px_#000]">
            📼 REWIND CLUB 📼
          </span>
          <h3 className="mt-3 font-[family-name:var(--font-bebas)] text-3xl sm:text-4xl lg:text-5xl tracking-wider text-[#FF1493] text-stroke-cyan-sm">
            JOIN THE 90s TV NEWSLETTER
          </h3>
          <p className="mt-2 font-serif text-sm text-[#F5E6C8]">
            Get untold secrets, rare VHS discoveries, and nostalgic TGIF trivia delivered straight to your inbox.
          </p>

          <form action="/api/contact" method="POST" className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email (e.g. freshprince@aol.com)"
              className="flex-1 rounded-lg border-2 border-[#FF1493] bg-[#F5E6C8] px-4 py-3 font-medium text-[#1a0a3a] placeholder:text-[#1a0a3a]/60 outline-none focus:ring-2 focus:ring-[#00D9FF]"
            />
            <button
              type="submit"
              className="rounded-lg border-2 border-black bg-[#FF1493] px-8 py-3 font-bold uppercase tracking-wider text-white shadow-[3px_3px_0px_#000] hover:bg-[#FF1493]/90 hover:shadow-[0_0_20px_rgba(255,20,147,0.7)] transition"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>

        {/* Bottom Socials & Links */}
        <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider text-[#00D9FF]">
              90s TV MEMORIES
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-medium text-sm text-[#F5E6C8]/80">
            <a
              href={FB_PAGES.beverlyHills.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#00D9FF] hover:underline"
            >
              <Facebook className="h-3.5 w-3.5" />
              <span>90210 Fan ({FB_PAGES.beverlyHills.followers})</span>
            </a>
            <a
              href={FB_PAGES.fullHouse.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#FFD24A] hover:underline"
            >
              <Facebook className="h-3.5 w-3.5" />
              <span>Full House Fan ({FB_PAGES.fullHouse.followers})</span>
            </a>
            <Link href="/about" className="hover:text-[#00D9FF] transition">About</Link>
            <Link href="/contact" className="hover:text-[#00D9FF] transition">Contact</Link>
            <Link href="/posts/privacy-policy" className="hover:text-[#00D9FF] transition">Privacy Policy</Link>
            <Link href="/posts/terms-of-service" className="hover:text-[#00D9FF] transition">Terms of Service</Link>
            <Link href="/posts/disclaimer" className="hover:text-[#00D9FF] transition">Disclaimer</Link>
          </div>
        </div>

        <p className="mt-6 text-center font-mono text-xs text-[#F5E6C8]/50">
          © {new Date().getFullYear()} 90s TV Memories. All trademarks belong to their respective owners.
        </p>
      </div>
    </footer>
  );
}

export function FooterColumns() {
  return <Footer />;
}
