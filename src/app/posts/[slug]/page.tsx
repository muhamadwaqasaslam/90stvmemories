import type { Metadata } from "next";
import { coverUrl } from "../../../lib/stock";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FooterColumns, Header } from "../../../components/SiteChrome";
import { PostRow } from "../../../components/PostCard";
import { ViewBeacon } from "../../../components/Tracked";
import { Prose } from "../../../lib/render";
import { fmtDate } from "../../../lib/dates";
import { getPostBySlug, getStoryPosts, readMins } from "../../../lib/posts";
import { JsonLd, SITE_NAME, abs, breadcrumbLd } from "../../../lib/seo";
import { Facebook } from "../../../components/icons";
import { FB_PAGES } from "../../../lib/site";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug((await params).slug);
  if (!post) return {};
  const image = coverUrl(post);
  const absImage = image.startsWith("http") ? image : abs(image);
  const url = abs(`/posts/${post.slug}`);

  // High-CTR title optimization for USA top ranking
  let clickableTitle = post.title;
  if (!clickableTitle.includes("2026") && !clickableTitle.includes("Untold") && clickableTitle.length < 52) {
    clickableTitle = `${clickableTitle} — Cast Then & Now (2026 Untold Secrets)`;
  }

  return {
    title: `${clickableTitle} | ${SITE_NAME}`,
    description: post.excerpt,
    keywords: post.tags?.length ? post.tags : [post.category, "90s TV", "Then and Now", "Untold Secrets", "1990s TV"],
    alternates: {
      canonical: url,
      languages: { "en-US": url, "x-default": url },
    },
    other: {
      "geo.region": "US",
      "content-language": "en-US",
    },
    openGraph: {
      title: clickableTitle,
      description: post.excerpt,
      type: "article",
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt || post.createdAt,
      section: post.category,
      tags: post.tags,
      authors: [SITE_NAME],
      images: [
        {
          url: absImage,
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: post.title,
        },
      ],
    },
    twitter: { card: "summary_large_image", title: clickableTitle, description: post.excerpt, images: [absImage] },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const allStories = await getStoryPosts();
  const more = allStories.filter((p) => p.id !== post.id).slice(0, 6);
  // 3 Related Articles for Internal Linking
  const related = allStories
    .filter((p) => p.id !== post.id && (p.category === post.category || p.tags?.some((t) => post.tags?.includes(t))))
    .slice(0, 3);
  const relatedPosts = related.length >= 3 ? related : more.slice(0, 3);

  const cleanShowName = post.title.split(/[:—–-]/)[0].trim();

  const faqs = [
    {
      q: `What is the untold story behind ${cleanShowName}?`,
      a: `${cleanShowName} remains an iconic touchstone of 1990s television culture, packed with beloved storylines, memorable characters, and fascinating behind-the-scenes moments that shaped an entire generation.`,
    },
    {
      q: `Where is the cast of ${cleanShowName} today in 2026?`,
      a: `In 2026, the cast members have embarked on various creative ventures including directing, voice acting, fan conventions, and personal projects, while regularly reuniting to celebrate their enduring nostalgic legacy.`,
    },
    {
      q: `Where can fans stream classic 90s episodes of ${cleanShowName}?`,
      a: `Episodes of classic 1990s TV favorites are widely available across major US streaming platforms like Hulu, Max, Pluto TV, and Paramount+, alongside physical collector VHS tapes and DVD sets.`,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a23] text-white selection:bg-[#FF1493] selection:text-white">
      <Header />
      <ViewBeacon slug={post.slug} />

      <main className="relative z-10 bg-gradient-to-b from-[#1a0a3a] via-[#10082b] to-[#0a0a23] pb-24">
        {/* Comprehensive JSON-LD: Article, BreadcrumbList, FAQPage, TVSeries */}
        <JsonLd
          data={[
            {
              "@context": "https://schema.org",
              "@type": "Article",
              headline: post.title.slice(0, 110),
              description: post.excerpt,
              image: [abs(coverUrl(post))],
              datePublished: post.createdAt,
              dateModified: post.updatedAt || post.createdAt,
              articleSection: post.category,
              keywords: post.tags?.length ? post.tags.join(", ") : undefined,
              wordCount: post.content.split(/\s+/).length,
              inLanguage: "en-US",
              mainEntityOfPage: abs(`/posts/${post.slug}`),
              author: { "@type": "Organization", name: SITE_NAME, url: abs("/") },
              publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: abs("/icon.svg") } },
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
            {
              "@context": "https://schema.org",
              "@type": "TVSeries",
              name: cleanShowName,
              description: post.excerpt,
              genre: [post.category, "1990s Television", "Sitcom", "Drama"],
            },
            breadcrumbLd([
              ["Home", "/"],
              ["Stories", "/blog"],
              [post.title, `/posts/${post.slug}`],
            ]),
          ]}
        />

        {/* 90s Retro CRT Banner */}
        <section className="relative grid min-h-72 place-items-center bg-[#10082b] border-b-2 border-[#FF1493]/30 px-4 py-14 text-center sm:px-6 sm:py-20 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 filter blur-[1px]"
            style={{ backgroundImage: `url(${coverUrl(post)})` }}
          />
          <div className="pointer-events-none absolute inset-0 crt-scanlines opacity-60" />
          <div className="relative z-10 max-w-4xl">
            <span className="inline-block -rotate-1 rounded bg-[#FF1493] px-3.5 py-1 font-mono text-xs font-bold uppercase text-white shadow-[2px_2px_0px_#000]">
              ★ {post.category} • RETRO ARCHIVE ★
            </span>
            <h1 className="mt-4 break-words font-head text-3xl sm:text-5xl lg:text-6xl tracking-wider text-[#FF1493] text-stroke-cyan drop-shadow-[0_0_20px_rgba(255,20,147,0.5)]">
              {post.title}
            </h1>
            <p className="mt-3 font-mono text-xs sm:text-sm text-[#F5E6C8]/90">
              <time dateTime={post.createdAt}>{fmtDate(post.createdAt)}</time> · {readMins(post.content)} min read · High Definition Tape
            </p>
          </div>
        </section>

        <section className="bg-transparent py-14">
          <div className="mx-auto grid max-w-[1200px] gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_340px]">
            {/* Main Article: Beige VHS Cassette Slipcover */}
            <article className="overflow-hidden rounded-2xl border-2 border-black bg-[#F2E8C9] text-[#1a0a3a] p-6 sm:p-12 shadow-[8px_8px_0px_#000]">
              {/* VHS Black Top Header Strip */}
              <div className="-mx-6 -mt-6 sm:-mx-12 sm:-mt-12 mb-8 flex items-center justify-between border-b-2 border-black bg-black px-6 py-2.5 font-mono text-xs font-bold tracking-widest text-[#FFD24A]">
                <span className="flex items-center gap-2">
                  <span>📼</span>
                  <span>VHS • SP • 120</span>
                </span>
                <span className="text-[#00D9FF]">[PLAY] 0:19:90</span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono font-bold text-[#6a2cff]">
                <Link href="/blog" className="hover:underline flex items-center gap-1">← Back to All Tapes</Link>
                <Link href={`/posts/${post.slug}/classic`} className="hover:underline">Wide Cinema View →</Link>
              </div>

              {/* Cover Image as VHS Tape Cover with LCP < 2.5s optimization */}
              <div className="my-6 relative overflow-hidden rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] aspect-[16/9] bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverUrl(post)}
                  alt={`Retro 90s TV scene from ${post.title}`}
                  loading="eager"
                  fetchPriority="high"
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 crt-scanlines opacity-25" />
              </div>

              <p className="mb-4 font-serif text-xl leading-relaxed text-[#2d224d] font-semibold">{post.excerpt}</p>

              {/* High-Visibility Facebook Share Bar (Top) */}
              <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#1877F2]/40 bg-[#1877F2]/10 p-3.5 sm:px-5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1877F2] text-white shrink-0">
                    <Facebook className="h-4 w-4" />
                  </span>
                  <p className="font-sans text-xs font-semibold text-slate-900 sm:text-sm">
                    Loved this 90s story? Share with your friends on Facebook!
                  </p>
                </div>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(abs(`/posts/${post.slug}`))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded bg-[#1877F2] px-4 py-2 font-sans text-xs font-bold text-white shadow hover:bg-[#166fe5] hover:scale-105 transition"
                >
                  <Facebook className="h-3.5 w-3.5" />
                  <span>Share to Facebook</span>
                </a>
              </div>

              {/* Quick Table of Contents / Tape Index (Boosts Google CTR and user engagement) */}
              <div className="mb-8 rounded-xl border border-black/15 bg-black/5 p-4 sm:p-5">
                <p className="font-mono text-xs font-bold uppercase tracking-wider text-black flex items-center gap-2">
                  <span>📼</span> TAPE INDEX / TABLE OF CONTENTS
                </p>
                <ul className="mt-3 space-y-1.5 font-sans text-xs font-medium text-black/80 list-disc list-inside">
                  <li>Introduction &amp; Nostalgic Background</li>
                  <li>Untold Backstage Secrets &amp; Behind-the-Scenes Facts</li>
                  <li>Cast Then &amp; Now: Where Are They Today in 2026?</li>
                  <li>Cultural Legacy &amp; Where to Watch Classic Episodes</li>
                  <li>Frequently Asked Questions (FAQ)</li>
                </ul>
              </div>

              <Prose content={post.content} />

              {/* Frequently Asked Questions Section (Matches JSON-LD FAQPage Schema) */}
              <div className="my-10 rounded-xl border-2 border-black/20 bg-black/5 p-6 sm:p-8">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FF1493]">
                  📼 90s REWIND ARCHIVE FAQ
                </span>
                <h3 className="mt-2 font-head text-2xl sm:text-3xl font-bold uppercase tracking-wider text-black">
                  Frequently Asked Questions
                </h3>
                <div className="mt-6 space-y-5">
                  {faqs.map((f, i) => (
                    <div key={i} className="border-b border-black/10 pb-4 last:border-0 last:pb-0">
                      <h4 className="font-sans text-base font-bold text-[#1a0a3a]">Q: {f.q}</h4>
                      <p className="mt-2 font-serif text-sm leading-relaxed text-[#2d224d]">{f.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Internal Linking: 3 Related 90s TV Articles */}
              <div className="my-10 border-t-2 border-black/15 pt-8">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#00D9FF]">
                  📼 RECOMMENDED VHS TAPES
                </span>
                <h3 className="mt-1 font-head text-2xl sm:text-3xl font-bold uppercase tracking-wider text-black">
                  More Untold Stories You&apos;ll Love
                </h3>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {relatedPosts.map((r) => (
                    <Link
                      key={r.id}
                      href={`/posts/${r.slug}`}
                      className="group flex flex-col overflow-hidden rounded-lg border border-black/20 bg-white p-3 shadow hover:shadow-md transition"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden rounded bg-black">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={coverUrl(r)} alt={r.title} className="h-full w-full object-cover group-hover:scale-105 transition" />
                      </div>
                      <span className="mt-2 font-mono text-[10px] uppercase text-[#FF1493] font-bold">{r.category}</span>
                      <h4 className="mt-1 font-head text-base font-bold leading-tight text-black group-hover:text-[#FF1493] transition line-clamp-2">
                        {r.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Facebook Fan Clubs & Viral Share Banner */}
              <div className="my-8 rounded-xl border-2 border-[#1877F2]/40 bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-white p-6 text-center shadow-sm">
                <span className="inline-block rounded-full bg-[#1877F2] px-3.5 py-1 font-condensed text-xs font-bold uppercase tracking-wider text-white">
                  Join 10,000+ 90s TV Fans
                </span>
                <h4 className="mt-2.5 font-serif text-xl font-bold text-navy">
                  Share this story &amp; join our official Facebook fan communities!
                </h4>
                <p className="mt-1 text-xs text-slate">
                  Connect with fellow nostalgic fans discussing Beverly Hills, 90210 and Full House daily.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(abs(`/posts/${post.slug}`))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded bg-[#1877F2] px-6 py-2.5 font-sans text-sm font-bold text-white shadow hover:bg-[#166fe5] hover:scale-105 transition"
                  >
                    <Facebook className="h-4 w-4" />
                    <span>Share on Facebook</span>
                  </a>
                  <a
                    href={FB_PAGES.beverlyHills.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded border border-[#1877F2] bg-white px-4 py-2.5 font-sans text-xs font-bold text-[#1877F2] hover:bg-slate-50 transition"
                  >
                    <span>90210 Fan ({FB_PAGES.beverlyHills.followers})</span>
                    <span>↗</span>
                  </a>
                  <a
                    href={FB_PAGES.fullHouse.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded border border-[#1877F2] bg-white px-4 py-2.5 font-sans text-xs font-bold text-[#1877F2] hover:bg-slate-50 transition"
                  >
                    <span>Full House Fan ({FB_PAGES.fullHouse.followers})</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>

              {/* High-CTR Monetag Direct Ad Banner inside Article */}
              <div className="my-10 rounded-lg border-2 border-dashed border-[#2b4886]/40 bg-amber-50/80 p-6 text-center shadow-sm">
                <span className="inline-block rounded bg-amber-400 px-3 py-1 font-condensed text-xs font-bold uppercase tracking-wider text-slate-900">
                  Trending Nostalgia
                </span>
                <p className="mt-2.5 font-serif text-xl font-bold text-navy">
                  Explore More Untold 90s TV Secrets &amp; Shocking Behind-The-Scenes Scandals
                </p>
                <p className="mt-1 text-xs text-slate">Discover what really happened to your favorite childhood icons today.</p>
                <a
                  href="https://uplcm.com/4/12216602"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="mt-4 inline-flex items-center gap-2 rounded bg-navy px-8 py-3.5 font-serif text-base font-bold text-white shadow-md transition hover:bg-navy/90 hover:scale-[1.02]"
                >
                  <span>Click to Read Next Story »</span>
                </a>
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="mt-10 border-t border-black/15 pt-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Tags &amp; Keywords</p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-md border border-black/30 bg-black/5 px-3 py-1 text-xs font-semibold text-navy hover:bg-navy hover:text-white transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar */}
            <aside className="space-y-8 px-4 sm:px-0">
              {/* Facebook Fan Pages Sidebar Box */}
              <div className="rounded-2xl border-2 border-[#1877F2]/50 bg-[#12082b] p-5 shadow-[6px_6px_0px_#1877F2] text-white">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1877F2] text-white">
                    <Facebook className="h-3.5 w-3.5" />
                  </span>
                  <h3 className="font-head text-xl tracking-wide text-white">Facebook Communities</h3>
                </div>

                {/* Page 1: Beverly Hills 90210 */}
                <div className="mt-4 rounded-xl border border-white/10 bg-black/40 p-3.5">
                  <p className="font-sans text-sm font-bold text-[#00D9FF]">{FB_PAGES.beverlyHills.name}</p>
                  <p className="mt-0.5 text-xs text-[#F5E6C8]/80">{FB_PAGES.beverlyHills.followers} Followers • Active Group</p>
                  <a
                    href={FB_PAGES.beverlyHills.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#1877F2] py-2 text-xs font-bold text-white shadow hover:scale-105 transition"
                  >
                    <Facebook className="h-3 w-3" />
                    <span>Follow 90210 Page</span>
                  </a>
                </div>

                {/* Page 2: Full House */}
                <div className="mt-3 rounded-xl border border-white/10 bg-black/40 p-3.5">
                  <p className="font-sans text-sm font-bold text-[#FFD24A]">{FB_PAGES.fullHouse.name}</p>
                  <p className="mt-0.5 text-xs text-[#F5E6C8]/80">{FB_PAGES.fullHouse.followers} Followers • TGIF Nostalgia</p>
                  <a
                    href={FB_PAGES.fullHouse.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#1877F2] py-2 text-xs font-bold text-white shadow hover:scale-105 transition"
                  >
                    <Facebook className="h-3 w-3" />
                    <span>Follow Full House Page</span>
                  </a>
                </div>
              </div>

              {/* Sidebar High-CTR Direct Ad Box */}
              <div className="rounded-2xl border-2 border-[#FF1493]/50 bg-gradient-to-br from-[#12082b] to-[#1f0d3d] p-6 text-center shadow-[6px_6px_0px_#FF1493] text-white">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FFD24A]">Featured Archive</span>
                <h3 className="mt-2 font-head text-2xl tracking-wide text-[#FF1493]">90s Retro Vault</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#F5E6C8]/80">Exclusive cast reunions, tragic endings, and forgotten shows you loved.</p>
                <a
                  href="https://uplcm.com/4/12216602"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="mt-4 block rounded-lg border-2 border-black bg-[#FF1493] py-2.5 font-bold uppercase text-xs tracking-wider text-white shadow-[3px_3px_0px_#000] hover:scale-105 transition"
                >
                  View Exclusive Access »
                </a>
              </div>

              {more.length > 0 && (
                <div className="rounded-2xl border-2 border-black bg-[#F2E8C9] p-5 shadow-[6px_6px_0px_#000] text-[#1a0a3a]">
                  <h2 className="font-head text-2xl tracking-wide text-black border-b border-black/20 pb-2">More VHS Tapes</h2>
                  <div className="mt-3 space-y-3">{more.map((p) => <PostRow key={p.id} post={p} />)}</div>
                </div>
              )}
            </aside>
          </div>
        </section>
      </main>
      <FooterColumns />
    </div>
  );
}
