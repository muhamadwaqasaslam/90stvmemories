import type { Metadata } from "next";
import { coverUrl } from "../../../lib/stock";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FooterColumns, Header } from "../../../components/SiteChrome";
import { Cover, PostRow } from "../../../components/PostCard";
import { ViewBeacon } from "../../../components/Tracked";
import { Prose } from "../../../lib/render";
import { fmtDate } from "../../../lib/dates";
import { getPostBySlug, getStoryPosts, readMins } from "../../../lib/posts";
import { JsonLd, SITE_NAME, abs, breadcrumbLd } from "../../../lib/seo";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug((await params).slug);
  if (!post) return {};
  const image = coverUrl(post);
  const url = `/posts/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags?.length ? post.tags : undefined,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url,
      locale: "en_US",
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt || post.createdAt,
      section: post.category,
      tags: post.tags,
      authors: [SITE_NAME],
      images: [{ url: image, alt: post.title }],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt, images: [image] },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const more = (await getStoryPosts()).filter((p) => p.id !== post.id).slice(0, 6);

  return (
    <>
      <Header />
      <ViewBeacon slug={post.slug} />
      <main>
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
            breadcrumbLd([["Home", "/"], ["Stories", "/blog"], [post.title, `/posts/${post.slug}`]]),
          ]}
        />
        {/* grey banner with centred title */}
        <section className="relative grid min-h-64 place-items-center bg-[#8c8c8c] px-4 py-12 text-center sm:px-6 sm:py-16">
          <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url(${coverUrl(post)})` }} />
          <div className="relative max-w-4xl">
            <h1 className="break-words text-2xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">{post.title}</h1>
            <p className="mt-4 text-white/90">
              <time dateTime={post.createdAt}>{fmtDate(post.createdAt)}</time> · {readMins(post.content)} min read · {post.category}
            </p>
          </div>
        </section>

        <section className="bg-mist pb-20">
          <div className="mx-auto grid max-w-[1200px] gap-8 px-0 sm:px-6 lg:grid-cols-[1fr_320px]">
            <article className="-mt-0 min-w-0 bg-white p-5 shadow-[4px_6px_12px_rgba(0,0,0,0.15)] sm:p-12 lg:-mt-0">
              <Link href="/blog" className="text-sm text-navy hover:underline">← All stories</Link> <span className="text-slate">·</span> <Link href={`/posts/${post.slug}/classic`} className="text-sm text-navy hover:underline">Wide layout</Link>
              <p className="mb-8 mt-4 font-serif text-xl leading-relaxed text-slate">{post.excerpt}</p>
              
              <Prose content={post.content} />

              {/* High-CTR Monetag Direct Ad Banner inside Article */}
              <div className="my-10 rounded-lg border-2 border-dashed border-[#2b4886]/30 bg-amber-50/60 p-6 text-center shadow-sm">
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
                <div className="mt-10 border-t border-slate/15 pt-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate/70">Tags &amp; Keywords</p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-slate/10 px-3 py-1 text-xs font-semibold text-navy hover:bg-navy hover:text-white transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>

            <aside className="space-y-8 px-4 sm:px-0 lg:pt-16">
              {/* Sidebar High-CTR Direct Ad Box */}
              <div className="rounded border-2 border-navy/20 bg-gradient-to-br from-white to-amber-50/50 p-6 text-center shadow-[4px_6px_12px_rgba(0,0,0,0.12)]">
                <span className="font-condensed text-xs font-bold uppercase tracking-widest text-slate/60">Featured Archive</span>
                <h3 className="mt-2 font-serif text-xl font-bold text-navy">90s Retro Vault</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate">Exclusive cast reunions, tragic endings, and forgotten shows you loved.</p>
                <a
                  href="https://uplcm.com/4/12216602"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="mt-4 block rounded bg-navy py-3 font-serif text-sm font-bold text-white shadow transition hover:bg-navy/90"
                >
                  View Exclusive Access »
                </a>
              </div>

              {more.length > 0 && (
                <div className="bg-white p-6 shadow-[4px_6px_12px_rgba(0,0,0,0.15)]">
                  <h2 className="text-2xl text-navy">Keep reading</h2>
                  <div className="mt-4">{more.map((p) => <PostRow key={p.id} post={p} />)}</div>
                </div>
              )}
              <div className="bg-white p-6 shadow-[4px_6px_12px_rgba(0,0,0,0.15)]">
                <h2 className="text-2xl text-navy">More topics</h2>
                <Link href="/#stories" className="mt-4 block bg-navy px-4 py-3 text-center font-serif text-lg text-white">Browse all stories »</Link>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <FooterColumns />
    </>
  );
}
