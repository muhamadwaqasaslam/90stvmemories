import Link from "next/link";
import { coverUrl } from "../lib/stock";
import { getStoryPosts, type Post } from "../lib/posts";
import { fmtDate } from "../lib/dates";
import { abs, JsonLd } from "../lib/seo";
import { Facebook, Search } from "../components/icons";
import { FB_PAGES } from "../lib/site";

export const revalidate = 60;

export const metadata = {
  title: { absolute: "90s TV Memories | 90s Cartoons, TGIF Sitcoms & VHS Nostalgia" },
  description: "Relive the golden era of 90s television: Saturday morning cartoons, TGIF sitcoms, VHS rental nostalgia, and untold behind-the-scenes stories.",
  alternates: { canonical: "/" },
};

/* Nickelodeon-style green slime dripping from top corners */
function CornerSlime() {
  return (
    <>
      {/* Top Left Slime */}
      <div className="pointer-events-none absolute top-0 left-0 z-40 overflow-hidden leading-none select-none">
        <svg width="140" height="110" viewBox="0 0 140 110" fill="#39FF14" className="slime-drop-shadow opacity-95">
          <path d="M0,0 L140,0 C125,25 110,32 98,32 C85,32 75,60 62,85 C54,102 42,102 38,78 C32,50 25,38 12,38 C5,38 0,28 0,0 Z" />
          <circle cx="52" cy="98" r="6" fill="#39FF14" />
          <circle cx="95" cy="46" r="4" fill="#39FF14" />
          <circle cx="20" cy="52" r="3" fill="#39FF14" />
        </svg>
      </div>
      {/* Top Right Slime */}
      <div className="pointer-events-none absolute top-0 right-0 z-40 overflow-hidden leading-none select-none scale-x-[-1]">
        <svg width="140" height="110" viewBox="0 0 140 110" fill="#39FF14" className="slime-drop-shadow opacity-95">
          <path d="M0,0 L140,0 C125,25 110,32 98,32 C85,32 75,60 62,85 C54,102 42,102 38,78 C32,50 25,38 12,38 C5,38 0,28 0,0 Z" />
          <circle cx="52" cy="98" r="6" fill="#39FF14" />
          <circle cx="95" cy="46" r="4" fill="#39FF14" />
        </svg>
      </div>
    </>
  );
}

export default async function Home({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const { cat } = await searchParams;
  const stories = await getStoryPosts();
  const categories = [...new Set(stories.map((p) => p.category))];
  const posts = cat ? stories.filter((p) => p.category === cat) : stories;
  const [featured, ...rest] = posts;

  return (
    <div className="relative min-h-screen bg-[#0a0a23] bg-gradient-to-b from-[#1a0a3a] via-[#10082b] to-[#0a0a23] text-white selection:bg-[#FF1493] selection:text-white">
      <CornerSlime />

      {/* JSON-LD Schema */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: stories.slice(0, 10).map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: abs(`/posts/${p.slug}`),
            name: p.title,
          })),
        }}
      />

      {/* ========================================================
          1. HEADER (Slime splash, Retro menu, Neon LOGIN)
          ======================================================== */}
      <header className="relative z-30 border-b border-[#FF1493]/25 bg-[#0a0a23]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1366px] items-center justify-between px-4 py-3 sm:px-6 lg:px-12">
          {/* Logo with Green Slime Splash */}
          <div className="relative flex items-center">
            {/* Organic Slime Splash SVG behind logo */}
            <div className="pointer-events-none absolute -inset-2 -left-3 scale-110 select-none">
              <svg viewBox="0 0 200 65" fill="#39FF14" className="h-full w-full slime-drop-shadow">
                <path d="M12,28 C6,12 28,6 50,14 C72,2 100,9 122,6 C150,2 182,12 188,28 C194,45 172,55 150,50 C128,60 100,53 78,60 C50,66 22,58 12,44 C4,35 6,31 12,28 Z" />
                <circle cx="192" cy="38" r="4" fill="#39FF14" />
                <circle cx="8" cy="48" r="3" fill="#39FF14" />
              </svg>
            </div>

            <Link href="/" className="relative z-10 flex items-center gap-2.5 py-1 px-1">
              {/* Retro CRT SVG Icon */}
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

          {/* Navigation Menu: Home, Shows, Quizzes, Shop, About */}
          <nav aria-label="Main" className="hidden items-center gap-6 font-bold uppercase tracking-wider text-sm md:flex lg:gap-8">
            <Link href="/" className="text-[#00D9FF] hover:text-[#FF1493] transition drop-shadow-[0_0_10px_rgba(0,217,255,0.6)]">
              Home
            </Link>
            <Link href="/blog?cat=90s+TV+Sitcoms" className="text-[#F5E6C8] hover:text-[#00D9FF] transition">
              Shows
            </Link>
            <Link href="/blog" className="text-[#F5E6C8] hover:text-[#00D9FF] transition">
              Quizzes
            </Link>
            <Link href="/features" className="text-[#F5E6C8] hover:text-[#00D9FF] transition">
              Shop
            </Link>
            <Link href="/about" className="text-[#F5E6C8] hover:text-[#00D9FF] transition">
              About
            </Link>
          </nav>

          {/* Right Action: Facebook fan links & Neon LOGIN */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Facebook Fan Pages Direct Header Links */}
            <div className="hidden lg:flex items-center gap-2">
              <a
                href={FB_PAGES.beverlyHills.url}
                target="_blank"
                rel="noopener noreferrer"
                title="Beverly Hills 90210 Fan (8.2K)"
                className="flex items-center gap-1 rounded-full border border-[#00D9FF]/40 bg-[#0a0a23] px-2.5 py-1 text-[11px] font-bold text-[#00D9FF] hover:border-[#00D9FF] hover:bg-[#00D9FF]/10 transition"
              >
                <Facebook className="h-3 w-3" />
                <span>90210 ({FB_PAGES.beverlyHills.followers})</span>
              </a>
              <a
                href={FB_PAGES.fullHouse.url}
                target="_blank"
                rel="noopener noreferrer"
                title="Full House Fan Club (2.5K)"
                className="flex items-center gap-1 rounded-full border border-[#FFD24A]/40 bg-[#0a0a23] px-2.5 py-1 text-[11px] font-bold text-[#FFD24A] hover:border-[#FFD24A] hover:bg-[#FFD24A]/10 transition"
              >
                <Facebook className="h-3 w-3" />
                <span>Full House ({FB_PAGES.fullHouse.followers})</span>
              </a>
            </div>

            <Link
              href="/admin/login"
              className="rounded-full border-2 border-[#FF1493] bg-[#0a0a23] px-4 py-1.5 font-bold uppercase text-xs tracking-widest text-[#FF1493] shadow-[0_0_15px_rgba(255,20,147,0.5)] hover:bg-[#FF1493] hover:text-white transition duration-200 hover:shadow-[0_0_25px_rgba(255,20,147,0.85)]"
            >
              LOGIN
            </Link>
            <Link href="/blog" aria-label="Search stories" className="grid h-9 w-9 place-items-center text-[#00D9FF] hover:text-[#FF1493] transition">
              <Search className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Mobile quick-nav row */}
        <div className="flex items-center justify-center gap-3 overflow-x-auto border-t border-white/10 px-4 py-2 font-bold uppercase text-xs tracking-wider md:hidden">
          <Link href="/" className="text-[#00D9FF]">Home</Link>
          <Link href="/blog?cat=90s+TV+Sitcoms" className="text-[#F5E6C8]">Shows</Link>
          <a href={FB_PAGES.beverlyHills.url} target="_blank" rel="noopener noreferrer" className="text-[#00D9FF] flex items-center gap-1">
            <Facebook className="h-3 w-3" /> 90210
          </a>
          <a href={FB_PAGES.fullHouse.url} target="_blank" rel="noopener noreferrer" className="text-[#FFD24A] flex items-center gap-1">
            <Facebook className="h-3 w-3" /> Full House
          </a>
          <Link href="/about" className="text-[#F5E6C8]">About</Link>
        </div>
      </header>

      {/* ========================================================
          2. HERO SECTION (Bebas Heading, Beige Subtext, Stickers, CRT TV)
          ======================================================== */}
      <section className="relative overflow-hidden px-4 pt-10 pb-16 sm:px-6 sm:pt-14 sm:pb-24 lg:px-12">
        <div className="mx-auto grid max-w-[1366px] items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          
          {/* Left Column: Heading + Subtext + Stickers */}
          <div>
            {/* Small Top Badge */}
            <div className="inline-flex items-center gap-2 rounded-md border border-[#00D9FF]/40 bg-[#160a33] px-3.5 py-1 font-mono text-xs font-bold uppercase tracking-widest text-[#00D9FF] shadow-[0_0_10px_rgba(0,217,255,0.3)]">
              <span>📼</span>
              <span>TGIF • VHS • SATURDAY MORNING</span>
            </div>

            {/* Big heading: I LOVE 90s TV */}
            <h1 className="mt-4 font-[family-name:var(--font-bebas)] text-6xl leading-[0.95] tracking-wider text-[#FF1493] text-stroke-cyan-lg sm:text-7xl lg:text-8xl xl:text-9xl">
              I LOVE 90s TV
            </h1>

            {/* Subtext in beige #F5E6C8 */}
            <p className="mt-5 max-w-xl font-serif text-lg leading-relaxed text-[#F5E6C8] sm:text-xl">
              Saturday morning cartoons, TGIF sitcom perfection, VHS tapes from the corner rental store, and the legendary nostalgic stories that defined an entire childhood.
            </p>

            {/* 3 Sticker Badges: TGIF (pink), Cartoons (blue), Teen Dramas (yellow) */}
            <div className="mt-6 flex flex-wrap items-center gap-3 sm:gap-4 font-bold uppercase tracking-wider text-xs sm:text-sm">
              <span className="inline-block -rotate-3 rounded-md border-2 border-black bg-[#FF1493] px-4 py-1.5 text-white shadow-[3px_3px_0px_#000] hover:rotate-0 transition">
                ★ TGIF
              </span>
              <span className="inline-block rotate-2 rounded-md border-2 border-black bg-[#00D9FF] px-4 py-1.5 text-black shadow-[3px_3px_0px_#000] hover:rotate-0 transition">
                ⚡ Cartoons
              </span>
              <span className="inline-block -rotate-2 rounded-md border-2 border-black bg-[#FFD24A] px-4 py-1.5 text-black shadow-[3px_3px_0px_#000] hover:rotate-0 transition">
                📼 Teen Dramas
              </span>
            </div>

            {/* Action CTA */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="#archives"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-black bg-gradient-to-r from-[#FF1493] via-[#ff2a85] to-[#00D9FF] px-7 py-3.5 font-bold uppercase text-sm tracking-wider text-white shadow-[4px_4px_0px_#000] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#FFD24A] transition duration-200"
              >
                <span>Browse VHS Vault</span>
                <span className="text-base">→</span>
              </Link>
              {featured && (
                <Link
                  href={`/posts/${featured.slug}`}
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-[#00D9FF]/50 bg-[#0a0a23]/60 px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-[#00D9FF] hover:border-[#00D9FF] hover:bg-[#00D9FF]/10 transition"
                >
                  <span>Featured: {featured.title.slice(0, 24)}…</span>
                </Link>
              )}
            </div>
          </div>

          {/* Right Column: CRT TV with static + 90s -> PLAY text + neon glow */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            {/* Rabbit ear antenna on top */}
            <div className="relative mx-auto -mb-2 flex w-36 justify-between px-2">
              <div className="h-16 w-1 origin-bottom rotate-[-30deg] rounded-full bg-gradient-to-t from-zinc-500 to-zinc-300 shadow-[0_0_10px_rgba(255,255,255,0.4)]" />
              <div className="h-16 w-1 origin-bottom rotate-[30deg] rounded-full bg-gradient-to-t from-zinc-500 to-zinc-300 shadow-[0_0_10px_rgba(255,255,255,0.4)]" />
            </div>

            {/* CRT TV Body with Hot Pink Neon Glow */}
            <div className="relative rounded-[32px] border-4 border-[#FF1493] bg-[#140b2b] p-4 sm:p-5 shadow-[0_0_40px_rgba(255,20,147,0.45)]">
              <div className="grid grid-cols-[1fr_64px] gap-3 sm:grid-cols-[1fr_80px]">
                
                {/* CRT Screen with static scanlines & glow */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border-2 border-[#00D9FF]/70 bg-black crt-glow">
                  {/* Scanlines Overlay */}
                  <div className="pointer-events-none absolute inset-0 z-20 crt-scanlines opacity-75" />

                  {/* Background Featured Image */}
                  {featured && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={coverUrl(featured)}
                      alt={featured.title}
                      className="absolute inset-0 h-full w-full object-cover opacity-80"
                    />
                  )}

                  {/* CRT Screen VCR HUD Text */}
                  <div className="relative z-10 flex h-full flex-col justify-between p-3.5 font-mono text-xs sm:text-sm">
                    {/* Top HUD */}
                    <div className="flex items-center justify-between font-bold text-[#00D9FF] drop-shadow-[0_0_6px_#00D9FF]">
                      <span>CH 03</span>
                      <span className="rounded bg-black/60 px-1.5 py-0.5 text-[#FFD24A]">VHS • SP</span>
                    </div>

                    {/* Center: 90s -> PLAY text + Neon Glow */}
                    <div className="my-auto text-center">
                      <div className="font-[family-name:var(--font-bebas)] text-5xl sm:text-6xl tracking-widest text-[#FFD24A] drop-shadow-[0_0_18px_#FFD24A]">
                        90s
                      </div>
                      <div className="mt-1 flex items-center justify-center gap-2 font-bold tracking-widest text-[#39FF14] animate-blink drop-shadow-[0_0_12px_#39FF14]">
                        <span>▶</span>
                        <span>PLAY</span>
                        <span className="text-[11px] text-white/80">0:19:90</span>
                      </div>
                    </div>

                    {/* Bottom HUD: Story link */}
                    {featured && (
                      <Link
                        href={`/posts/${featured.slug}`}
                        className="rounded border border-white/20 bg-black/80 px-2 py-1 text-center font-sans text-xs font-semibold text-white truncate hover:bg-[#FF1493] transition"
                      >
                        {featured.title}
                      </Link>
                    )}
                  </div>
                </div>

                {/* TV Side Controls Panel */}
                <div className="flex flex-col items-center justify-between rounded-xl border border-white/10 bg-[#0d0720] p-2">
                  {/* Power Indicator */}
                  <div className="flex items-center gap-1 font-mono text-[9px] font-bold text-[#FF1493]">
                    <span className="h-2 w-2 rounded-full bg-[#39FF14] shadow-[0_0_8px_#39FF14] animate-pulse" />
                    <span>PWR</span>
                  </div>

                  {/* Rotary Knobs */}
                  <div className="space-y-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-gradient-to-br from-zinc-600 to-zinc-900 shadow-inner">
                      <div className="h-1 w-5 rounded-full bg-[#00D9FF] shadow-[0_0_5px_#00D9FF]" />
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-gradient-to-br from-zinc-600 to-zinc-900 shadow-inner">
                      <div className="h-1 w-5 rounded-full bg-[#FF1493] shadow-[0_0_5px_#FF1493]" />
                    </div>
                  </div>

                  {/* Speaker Slits */}
                  <div className="w-full space-y-1 py-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-1 w-full rounded-full bg-black/80" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. FEATURED — VHS ARCHIVES SECTION
          ======================================================== */}
      <section id="archives" className="relative scroll-mt-6 px-4 py-16 sm:px-6 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-[1366px]">
          
          {/* Section Heading: FEATURED — VHS ARCHIVES */}
          <div className="mb-12 text-center">
            <div className="inline-block -rotate-1 rounded bg-[#FF1493] px-4 py-1 font-mono text-xs font-bold tracking-widest text-white shadow-[2px_2px_0px_#000]">
              ★ TGIF &amp; RETRO SITCOMS ★
            </div>
            <h2 className="mt-3 font-[family-name:var(--font-bebas)] text-4xl sm:text-5xl lg:text-6xl tracking-wider text-[#FF1493] text-stroke-cyan drop-shadow-[0_0_20px_rgba(255,20,147,0.5)]">
              FEATURED — VHS ARCHIVES
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#F5E6C8] font-serif">
              Grab your cassette, pop it into the VCR, and rewind through the greatest stories of the 1990s.
            </p>

            {/* Category Filter Pills */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Link
                href="/#archives"
                className={`rounded-full border border-black px-4 py-1 font-mono text-xs font-bold uppercase transition ${
                  !cat ? "bg-[#00D9FF] text-black shadow-[2px_2px_0px_#000]" : "bg-[#160a33] text-[#F5E6C8] hover:border-[#00D9FF]"
                }`}
              >
                All Tapes ({stories.length})
              </Link>
              {categories.map((c) => (
                <Link
                  key={c}
                  href={`/?cat=${encodeURIComponent(c)}#archives`}
                  className={`rounded-full border border-black px-4 py-1 font-mono text-xs font-bold uppercase transition ${
                    cat === c ? "bg-[#00D9FF] text-black shadow-[2px_2px_0px_#000]" : "bg-[#160a33] text-[#F5E6C8] hover:border-[#00D9FF]"
                  }`}
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>

          {/* Cards Grid: Beige background #F2E8C9, black top bar with VHS • SP • 120 */}
          {posts.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {posts.map((p, idx) => (
                <article
                  key={p.id}
                  className="group flex flex-col overflow-hidden rounded-xl border-2 border-black bg-[#F2E8C9] text-[#1a0a3a] shadow-[6px_6px_0px_#000] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_#FF1493] transition duration-200"
                >
                  {/* Black top bar with: VHS • SP • 120 */}
                  <div className="flex items-center justify-between border-b-2 border-black bg-black px-3.5 py-1.5 font-mono text-xs font-bold tracking-wider text-[#FFD24A]">
                    <span className="flex items-center gap-1.5">
                      <span>📼</span>
                      <span>VHS • SP • 120</span>
                    </span>
                    <span className="text-[10px] text-[#00D9FF]">[TAPE {String(idx + 1).padStart(2, "0")}]</span>
                  </div>

                  {/* Card Illustration / Thumbnail with VHS scanline / grain overlay */}
                  <Link href={`/posts/${p.slug}`} className="relative aspect-[16/10] overflow-hidden bg-black block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={coverUrl(p)}
                      alt={p.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 crt-scanlines opacity-35 group-hover:opacity-15 transition" />
                    <span className="absolute bottom-2 left-2 rounded border border-black bg-[#FFD24A] px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-black shadow-[2px_2px_0px_#000]">
                      {p.category}
                    </span>
                  </Link>

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    {/* Tag badge like: Sitcom • 1987-1995 */}
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#6a2cff]">
                      <span>Sitcom</span>
                      <span>•</span>
                      <span>1990s Era</span>
                      <span>•</span>
                      <span>{fmtDate(p.createdAt)}</span>
                    </div>

                    <h3 className="mt-2 font-serif text-lg font-bold leading-snug text-black group-hover:text-[#6a2cff] transition line-clamp-2">
                      <Link href={`/posts/${p.slug}`}>{p.title}</Link>
                    </h3>

                    <p className="mt-2 line-clamp-3 font-serif text-sm leading-relaxed text-[#3a354d]">
                      {p.excerpt}
                    </p>

                    {/* Bottom Action: Pink/Blue READ -> Button */}
                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-black/10">
                      <span className="font-mono text-xs text-black/60">
                        HD Color
                      </span>
                      <Link
                        href={`/posts/${p.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-md border border-black bg-gradient-to-r from-[#FF1493] to-[#00D9FF] px-3.5 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-[2px_2px_0px_#000] hover:scale-105 hover:brightness-110 transition"
                      >
                        <span>READ</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-10 rounded-xl border-2 border-dashed border-white/20 p-12 text-center text-lg text-[#F5E6C8]">
              No tapes found in this category. Check back soon!
            </p>
          )}

          {/* View All Stories Button */}
          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-black bg-[#FFD24A] px-8 py-3.5 font-bold uppercase text-sm tracking-wider text-black shadow-[4px_4px_0px_#000] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#FF1493] transition"
            >
              <span>Explore All Archive Stories in Magazine</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          3B. FACEBOOK COMMUNITIES SHOWCASE (Page Plugin & Like Buttons)
          ======================================================== */}
      <section className="relative px-4 py-16 sm:px-6 sm:py-20 lg:px-12 bg-[#08051a] border-t-2 border-b-2 border-[#00D9FF]/30">
        <div className="mx-auto max-w-[1366px]">
          <div className="mb-10 text-center">
            <div className="inline-block -rotate-1 rounded bg-[#1877F2] px-4 py-1 font-mono text-xs font-bold tracking-widest text-white shadow-[2px_2px_0px_#000]">
              ★ OVER 10,000+ 90s TV FANS ON FACEBOOK ★
            </div>
            <h2 className="mt-3 font-[family-name:var(--font-bebas)] text-4xl sm:text-5xl lg:text-6xl tracking-wider text-[#00D9FF] text-stroke-pink drop-shadow-[0_0_20px_rgba(0,217,255,0.5)]">
              JOIN OUR FACEBOOK FAN CLUBS
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#F5E6C8] font-serif max-w-2xl mx-auto">
              Follow our official communities for daily nostalgic clips, rare cast photos, discussions, and exclusive 90s trivia.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Fan Club 1: Beverly Hills 90210 */}
            <div className="flex flex-col rounded-2xl border-2 border-[#00D9FF] bg-[#12082b] p-6 shadow-[6px_6px_0px_#00D9FF] relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1877F2] text-white shadow-md">
                    <Facebook className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-[family-name:var(--font-bebas)] text-2xl sm:text-3xl tracking-wide text-white">
                      {FB_PAGES.beverlyHills.name}
                    </h3>
                    <p className="text-xs font-mono text-[#00D9FF]">
                      ★ {FB_PAGES.beverlyHills.followers} Nostalgic Fans • Daily Peach Pit Memories
                    </p>
                  </div>
                </div>
                <a
                  href={FB_PAGES.beverlyHills.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[#00D9FF] bg-[#1877F2] px-4 py-1.5 font-bold uppercase text-xs tracking-wider text-white shadow hover:scale-105 transition"
                >
                  Like Page
                </a>
              </div>

              <p className="mt-4 font-serif text-sm text-[#F5E6C8]">
                {FB_PAGES.beverlyHills.description}
              </p>

              {/* Embedded Facebook Page Plugin iframe */}
              <div className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-black/40 p-1 flex justify-center">
                <iframe
                  src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(FB_PAGES.beverlyHills.url)}&tabs=timeline&width=500&height=300&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`}
                  width="100%"
                  height="300"
                  style={{ border: "none", overflow: "hidden" }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  title="Beverly Hills 90210 Fan Facebook Page Plugin"
                  className="rounded-lg"
                />
              </div>

              <a
                href={FB_PAGES.beverlyHills.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#1877F2] to-[#00D9FF] py-3 text-center font-bold uppercase text-xs tracking-wider text-white shadow hover:brightness-110 transition"
              >
                <Facebook className="h-4 w-4" />
                <span>Follow {FB_PAGES.beverlyHills.name} on Facebook</span>
              </a>
            </div>

            {/* Fan Club 2: Full House Fan Club */}
            <div className="flex flex-col rounded-2xl border-2 border-[#FF1493] bg-[#12082b] p-6 shadow-[6px_6px_0px_#FF1493] relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1877F2] text-white shadow-md">
                    <Facebook className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-[family-name:var(--font-bebas)] text-2xl sm:text-3xl tracking-wide text-white">
                      {FB_PAGES.fullHouse.name}
                    </h3>
                    <p className="text-xs font-mono text-[#FFD24A]">
                      ★ {FB_PAGES.fullHouse.followers} Tanner Family Fans • TGIF Sitcom Gold
                    </p>
                  </div>
                </div>
                <a
                  href={FB_PAGES.fullHouse.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[#FF1493] bg-[#1877F2] px-4 py-1.5 font-bold uppercase text-xs tracking-wider text-white shadow hover:scale-105 transition"
                >
                  Like Page
                </a>
              </div>

              <p className="mt-4 font-serif text-sm text-[#F5E6C8]">
                {FB_PAGES.fullHouse.description}
              </p>

              {/* Embedded Facebook Page Plugin iframe */}
              <div className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-black/40 p-1 flex justify-center">
                <iframe
                  src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(FB_PAGES.fullHouse.url)}&tabs=timeline&width=500&height=300&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`}
                  width="100%"
                  height="300"
                  style={{ border: "none", overflow: "hidden" }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  title="Full House Fan Club Facebook Page Plugin"
                  className="rounded-lg"
                />
              </div>

              <a
                href={FB_PAGES.fullHouse.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#1877F2] to-[#FF1493] py-3 text-center font-bold uppercase text-xs tracking-wider text-white shadow hover:brightness-110 transition"
              >
                <Facebook className="h-4 w-4" />
                <span>Follow {FB_PAGES.fullHouse.name} on Facebook</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. NEWSLETTER FOOTER (Beige Input & Pink SUBSCRIBE)
          ======================================================== */}
      <footer className="relative mt-20 border-t-2 border-[#FF1493]/40 bg-[#070517] pt-16 pb-12 text-[#F5E6C8]">
        {/* Green Slime Drips on Section Divider */}
        <div className="pointer-events-none absolute -top-4 left-0 right-0 overflow-hidden select-none">
          <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="h-6 w-full slime-drop-shadow" fill="#39FF14">
            <path d="M0,0 L1200,0 L1200,10 Q1150,10 1130,25 Q1110,40 1090,25 Q1070,10 1030,10 Q970,10 950,30 Q930,10 880,10 Q830,10 810,25 Q790,10 740,10 Q680,10 660,35 Q640,10 590,10 Q540,10 520,25 Q500,10 450,10 Q390,10 370,30 Q350,10 300,10 Q240,10 220,25 Q200,10 150,10 Q100,10 80,30 Q60,10 0,10 Z" />
          </svg>
        </div>

        <div className="mx-auto max-w-[1366px] px-4 sm:px-6 lg:px-12">
          {/* Newsletter Box */}
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

            {/* Beige Input & Pink SUBSCRIBE Button */}
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

          {/* Footer Bottom Links & Copyright */}
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
    </div>
  );
}
