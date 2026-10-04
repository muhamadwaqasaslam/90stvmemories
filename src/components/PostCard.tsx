import { TrackedLink } from "./Tracked";
import { themeOf } from "../lib/themes";
import { fmtDate } from "../lib/dates";
import { readMins, type Post } from "../lib/posts";

export function Cover({ post, big = false }: { post: Post; big?: boolean }) {
  const t = themeOf(post.theme);
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${t.bg} ${big ? "min-h-64 md:min-h-full" : "aspect-[16/10]"}`}
      style={post.imageUrl ? { backgroundImage: `url(${post.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
    >
      {!post.imageUrl && (
        <span className={`absolute inset-0 grid place-items-center opacity-90 ${big ? "text-8xl" : "text-6xl"}`}>{t.emoji}</span>
      )}
    </div>
  );
}

export function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  return (
    <TrackedLink
      slug={post.slug}
      className={`pop pop-hover group block overflow-hidden rounded-2xl bg-white ${featured ? "md:grid md:grid-cols-2" : "flex flex-col"}`}
    >
      <Cover post={post} big={featured} />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-pink">{post.category}</p>
        <h3 className={`mt-2 font-display font-semibold leading-snug transition group-hover:text-pink ${featured ? "text-2xl sm:text-3xl" : "text-lg"}`}>
          {post.title}
        </h3>
        <p className="mt-3 line-clamp-3 leading-relaxed text-ink/65">{post.excerpt}</p>
        <p className="mt-auto pt-5 text-sm text-ink/50">
          {fmtDate(post.createdAt)} · {readMins(post.content)} min read
        </p>
      </div>
    </TrackedLink>
  );
}
