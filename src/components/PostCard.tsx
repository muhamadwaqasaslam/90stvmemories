import { TrackedLink } from "./Tracked";
import { coverUrl } from "../lib/stock";
import { fmtDate } from "../lib/dates";
import { readMins, type Post } from "../lib/posts";

import { TrackedLink } from "./Tracked";
import { coverUrl } from "../lib/stock";
import { fmtDate } from "../lib/dates";
import { readMins, type Post } from "../lib/posts";

export function Cover({ post, big = false }: { post: Post; big?: boolean }) {
  return (
    <div className={`relative overflow-hidden bg-black/40 ${big ? "min-h-64 md:min-h-full" : "aspect-[16/10]"}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={coverUrl(post)}
        alt={post.title}
        width={800}
        height={500}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
      />
      {/* VHS scanlines / noise texture */}
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.15)_0px,rgba(0,0,0,0.15)_1px,transparent_1px,transparent_3px)]" />
    </div>
  );
}

/** 90s VHS Cassette Card with beige sleeve and black top tape bar */
export function PostCard({ post }: { post: Post }) {
  return (
    <TrackedLink
      slug={post.slug}
      className="group flex flex-col overflow-hidden rounded-xl border border-black/20 bg-[#F2E8C9] text-black shadow-[4px_6px_0px_#000000] transition-all hover:-translate-y-1 hover:shadow-[6px_10px_0px_#FF1493]"
    >
      {/* VHS Top Label Bar */}
      <div className="flex items-center justify-between bg-black px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#F5E6C8]">
        <span className="flex items-center gap-1.5 font-bold text-[#39FF14]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#39FF14] animate-pulse" />
          VHS • SP 120
        </span>
        <span className="text-[#00D9FF]">HI-FI STEREO</span>
      </div>

      <Cover post={post} />

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded bg-[#FF1493] px-2 py-0.5 font-mono text-[11px] font-bold uppercase text-white shadow-[0_0_8px_rgba(255,20,147,0.5)]">
            {post.category}
          </span>
          <span className="font-mono text-xs text-black/60">
            {readMins(post.content)} min
          </span>
        </div>

        <h3 className="mt-3 font-head text-xl font-bold leading-tight tracking-wide text-black group-hover:text-[#FF1493] transition">
          {post.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-black/75">
          {post.excerpt}
        </p>

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-black/10">
          <span className="font-mono text-[11px] text-black/50">
            {fmtDate(post.createdAt)}
          </span>
          <span className="inline-flex items-center gap-1 font-head text-sm font-bold uppercase tracking-wider text-[#FF1493] group-hover:translate-x-1 transition">
            READ <span>→</span>
          </span>
        </div>
      </div>
    </TrackedLink>
  );
}

/** Compact row: thumbnail + title, used in sidebars and bottom lists. */
export function PostRow({ post }: { post: Post }) {
  return (
    <TrackedLink
      slug={post.slug}
      className="group flex items-center gap-3 border-b border-white/10 py-3 last:border-0 hover:bg-white/5 px-2 rounded-lg transition"
    >
      <div className="w-20 shrink-0 overflow-hidden rounded border border-[#00D9FF]/40">
        <Cover post={post} />
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-[10px] font-mono uppercase text-[#39FF14]">{post.category}</span>
        <h4 className="font-head text-base font-bold leading-snug text-[#F5E6C8] group-hover:text-[#FF1493] transition truncate">
          {post.title}
        </h4>
      </div>
    </TrackedLink>
  );
}
