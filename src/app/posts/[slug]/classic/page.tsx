import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FooterColumns, Header } from "../../../../components/SiteChrome";
import { Cover } from "../../../../components/PostCard";
import { ViewBeacon } from "../../../../components/Tracked";
import { MailForm } from "../../../../components/MailForm";
import { Chevron } from "../../../../components/icons";
import { Prose } from "../../../../lib/render";
import { fmtDate } from "../../../../lib/dates";
import { getPostBySlug, readMins } from "../../../../lib/posts";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug((await params).slug);
  return post ? { title: post.title, description: post.excerpt, alternates: { canonical: `/posts/${post.slug}` } } : {};
}

function Share({ title, slug }: { title: string; slug: string }) {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://90stvmemories.vercel.app";
  const url = encodeURIComponent(`${site}/posts/${slug}`);
  const t = encodeURIComponent(title);
  const items = [
    ["Share", `https://www.facebook.com/sharer/sharer.php?u=${url}`, "bg-[#3b5998]"],
    ["Tweet", `https://twitter.com/intent/tweet?url=${url}&text=${t}`, "bg-[#55acee]"],
    ["Pin", `https://pinterest.com/pin/create/button/?url=${url}&description=${t}`, "bg-[#cb2027]"],
    ["Email", `mailto:?subject=${t}&body=${url}`, "bg-[#7b7b7b]"],
    ["Share", `https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "bg-[#0077b5]"],
  ] as const;
  return (
    <div className="flex flex-wrap justify-center gap-1.5">
      {items.map(([label, href, bg], i) => (
        <a key={i} href={href} target="_blank" rel="noopener noreferrer" className={`${bg} w-24 py-2 text-center text-xs font-bold text-white hover:opacity-90`}>{label}</a>
      ))}
    </div>
  );
}

export default async function ClassicPost({ params }: Props) {
  const post = await getPostBySlug((await params).slug);
  if (!post) notFound();

  return (
    <>
      <Header />
      <ViewBeacon slug={post.slug} />
      <main>
        <article className="mx-auto max-w-[900px] bg-white px-6 pb-4 pt-10 shadow-[0_0_40px_rgba(0,0,0,0.08)] sm:px-12">
          <div className="overflow-hidden [&>div]:aspect-[16/7]"><Cover post={post} /></div>
          <div className="mt-8"><Share title={post.title} slug={post.slug} /></div>
          <h1 className="mt-10 text-3xl font-bold leading-tight text-navy sm:text-4xl">{post.title}</h1>
          <p className="mt-3 font-serif text-sm text-slate">{fmtDate(post.createdAt)} · {readMins(post.content)} min read · {post.category}</p>
          <p className="mt-6 font-serif text-xl leading-relaxed">{post.excerpt}</p>
          <div className="mt-6"><Prose content={post.content} /></div>
          <div className="mt-10 flex items-center justify-between pb-8">
            <Link href="/blog" className="inline-flex items-center gap-2 bg-navy px-5 py-2 font-serif text-sm text-white">All stories <Chevron className="h-3 w-3" /></Link>
            <Link href={`/posts/${post.slug}`} className="font-serif text-sm text-navy hover:underline">Sidebar layout</Link>
          </div>
        </article>

        <section className="mx-auto max-w-[900px] px-6 py-10">
          <div className="border-t border-black/20 pt-8"><Share title={post.title} slug={post.slug} /></div>
          <h2 className="mt-14 text-2xl text-black">Leave a comment</h2>
          <p className="mt-2 font-serif text-sm text-slate">Comments go straight to the editors.</p>
          <div className="mt-6 border border-black/20 p-6">
            <MailForm
              subject={`Comment on: ${post.title}`}
              kind="comment"
              button="Send comment"
              fields={[{ name: "name", label: "Your name" }, { name: "comment", label: "Your comment", type: "textarea", required: true }]}
            />
          </div>
        </section>
      </main>
      <FooterColumns />
    </>
  );
}
