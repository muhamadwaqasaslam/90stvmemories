import { TrackedLink } from "./Tracked";
import { coverUrl } from "../lib/stock";
import { fmtDate } from "../lib/dates";
import { readMins, type Post } from "../lib/posts";

export function Cover({ post, big = false }: { post: Post; big?: boolean }) {
  return (
    <div className={`relative overflow-hidden bg-[#c4c4c4] ${big ? "min-h-64 md:min-h-full" : "aspect-[16/10]"}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={coverUrl(post)} alt={post.title} width={800} height={500} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
    </div>
  );
}

/** White card with soft drop shadow (Figma "Card" in the 8-up grid). */
export function PostCard({ post }: { post: Post }) {
  return (
    <TrackedLink
      slug={post.slug}
      className="group flex flex-col bg-white shadow-[6px_8px_14px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5"
    >
      <Cover post={post} />
      <div className="flex flex-1 flex-col items-center px-5 pb-6 pt-5 text-center">
        <span className="border border-black px-3 py-0.5 font-condensed text-sm font-bold uppercase">{post.category}</span>
        <h3 className="mt-4 font-serif text-lg leading-snug group-hover:text-navy">{post.title}</h3>
        <p className="mt-2 line-clamp-3 font-serif text-base leading-6">{post.excerpt}</p>
        <p className="mt-auto pt-4 font-condensed text-sm text-slate">
          {fmtDate(post.createdAt)} · {readMins(post.content)} min read
        </p>
      </div>
    </TrackedLink>
  );
}

/** Compact row: thumbnail + title, used in the 3-column list and sidebar. */
export function PostRow({ post }: { post: Post }) {
  return (
    <TrackedLink slug={post.slug} className="group flex items-center gap-3 border-b border-black/20 py-3 last:border-0">
      <div className="w-24 shrink-0"><Cover post={post} /></div>
      <h4 className="font-serif text-base capitalize leading-5 group-hover:text-navy">{post.title}</h4>
    </TrackedLink>
  );
}
