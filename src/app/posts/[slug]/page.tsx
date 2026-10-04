import type { Metadata } from "next";
import { coverUrl } from "../../../lib/stock";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FooterColumns, Header } from "../../../components/SiteChrome";
import { Cover, PostRow } from "../../../components/PostCard";
import { ViewBeacon } from "../../../components/Tracked";
import { Prose } from "../../../lib/render";
import { fmtDate } from "../../../lib/dates";
import { getPostBySlug, getPublished, readMins } from "../../../lib/posts";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article", images: post.imageUrl ? [post.imageUrl] : undefined },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const more = (await getPublished()).filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <>
      <Header />
      <ViewBeacon slug={post.slug} />
      <main>
        {/* grey banner with centred title */}
        <section className="relative grid min-h-64 place-items-center bg-[#8c8c8c] px-6 py-16 text-center">
          <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url(${coverUrl(post)})` }} />
          <div className="relative max-w-4xl">
            <h1 className="text-3xl font-bold leading-tight text-white sm:text-5xl">{post.title}</h1>
            <p className="mt-4 text-white/90">
              {fmtDate(post.createdAt)} · {readMins(post.content)} min read · {post.category}
            </p>
          </div>
        </section>

        <section className="bg-mist pb-20">
          <div className="mx-auto grid max-w-[1200px] gap-10 px-6 lg:grid-cols-[1fr_320px]">
            <article className="-mt-0 bg-white p-8 shadow-[4px_6px_12px_rgba(0,0,0,0.15)] sm:p-12 lg:-mt-0">
              <Link href="/blog" className="text-sm text-navy hover:underline">← All stories</Link> <span className="text-slate">·</span> <Link href={`/posts/${post.slug}/classic`} className="text-sm text-navy hover:underline">Wide layout</Link>
              <p className="mb-8 mt-4 font-serif text-xl leading-relaxed text-slate">{post.excerpt}</p>
              <Prose content={post.content} />
            </article>

            <aside className="space-y-8 lg:pt-16">
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
