import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer, Header } from "../../../components/SiteChrome";
import { Cover, PostCard } from "../../../components/PostCard";
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
        <article>
          <header className="mx-auto max-w-4xl px-4 pt-10 sm:px-6">
            <Link href="/#stories" className="text-sm font-medium text-ink/60 transition hover:text-pink">← All stories</Link>
            <h1 className="mt-5 font-display text-3xl font-bold leading-tight sm:text-5xl">{post.title}</h1>
            <p className="mt-4 text-ink/55">
              {fmtDate(post.createdAt)} · {readMins(post.content)} min read · {post.category}
            </p>
            <div className="mt-8 h-60 overflow-hidden rounded-2xl shadow-lg shadow-ink/10 sm:h-96 [&>div]:h-full">
              <Cover post={post} big />
            </div>
          </header>

          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
            <p className="mb-8 max-w-[68ch] text-xl leading-relaxed text-ink/70">{post.excerpt}</p>
            <Prose content={post.content} />
          </div>
        </article>

        {more.length > 0 && (
          <section className="border-t border-ink/10 bg-white/60">
            <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
              <h2 className="font-display text-2xl font-bold sm:text-3xl">Keep reading</h2>
              <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {more.map((p) => <PostCard key={p.id} post={p} />)}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
