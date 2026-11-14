import Link from "next/link";
import type { ReactNode } from "react";
import { Chevron } from "./icons";
import { MailForm } from "./MailForm";
import { Cover } from "./PostCard";
import { TrackedLink } from "./Tracked";
import { fmtDate } from "../lib/dates";
import type { Post } from "../lib/posts";
import { BANNER_IMAGE } from "../lib/stock";

/** Retro 90s CRT banner with Bebas Neue heading */
export function Banner({ title, image }: { title: string; image?: string }) {
  return (
    <section className="relative grid min-h-56 place-items-center bg-[#10082b] px-6 py-14 text-center overflow-hidden border-b border-[#FF1493]/30">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity"
        style={{ backgroundImage: `url(${image ?? BANNER_IMAGE})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a3a]/80 via-[#0a0a23]/90 to-[#0a0a23]" />
      {/* Scanline overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.3)_0px,rgba(0,0,0,0.3)_2px,transparent_2px,transparent_4px)]" />

      <div className="relative z-10 max-w-4xl">
        <span className="font-mono text-xs uppercase tracking-widest text-[#00D9FF]">📼 90s TV VHS Archive</span>
        <h1 className="mt-2 font-head text-4xl sm:text-6xl font-black uppercase tracking-wider text-[#FF1493] drop-shadow-[0_0_20px_rgba(255,20,147,0.7)]">
          {title}
        </h1>
      </div>
    </section>
  );
}

export function Title({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`text-center font-head text-3xl sm:text-4xl uppercase tracking-wider text-[#FF1493] drop-shadow-[0_0_15px_rgba(255,20,147,0.6)] ${className}`}>
      {children}
    </h2>
  );
}

export function Btn({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-lg bg-[#FF1493] px-5 py-2 font-head text-sm font-bold uppercase tracking-wider text-white shadow-[0_0_15px_rgba(255,20,147,0.5)] transition hover:bg-[#ff3baf] hover:scale-105 ${className}`}
    >
      {children}
    </Link>
  );
}

/** Numbered pagination: 1 2 3 … last » */
export function Pagination({ page, pages, href }: { page: number; pages: number; href: (n: number) => string }) {
  if (pages <= 1) return null;
  const nums = new Set([1, 2, 3, pages, page, page - 1, page + 1].filter((n) => n >= 1 && n <= pages));
  const list = [...nums].sort((a, b) => a - b);
  return (
    <nav aria-label="Pagination" className="mt-14 flex items-center justify-center gap-2 font-mono text-sm">
      {list.map((n, i) => (
        <span key={n} className="flex items-center gap-2">
          {i > 0 && n - list[i - 1] > 1 && <span className="text-white/40">…</span>}
          <Link
            href={href(n)}
            aria-current={n === page ? "page" : undefined}
            className={`grid h-9 w-9 place-items-center rounded-lg font-bold transition ${
              n === page
                ? "bg-[#FF1493] text-white shadow-[0_0_15px_rgba(255,20,147,0.8)]"
                : "border border-white/20 bg-[#160a33] text-[#F5E6C8] hover:border-[#00D9FF] hover:text-[#00D9FF]"
            }`}
          >
            {n}
          </Link>
        </span>
      ))}
      {page < pages && (
        <Link
          href={href(page + 1)}
          aria-label="Next page"
          className="grid h-9 w-9 place-items-center rounded-lg border border-white/20 bg-[#160a33] text-[#00D9FF] hover:border-[#FF1493] hover:text-[#FF1493] transition"
        >
          <Chevron className="h-3.5 w-3.5" />
        </Link>
      )}
    </nav>
  );
}

/** Split section: retro newsletter split */
export function SubscribeSplit({ title = "Get new stories", image }: { title?: string; image?: string }) {
  return (
    <section className="grid overflow-hidden rounded-2xl border-2 border-[#00D9FF]/40 bg-[#10082b] md:grid-cols-2 shadow-[0_0_25px_rgba(0,217,255,0.2)]">
      <div className="min-h-64 bg-cover bg-center" style={{ backgroundImage: `url(${image ?? BANNER_IMAGE})` }} />
      <div className="px-8 py-14 text-center md:px-14 flex flex-col justify-center">
        <span className="font-mono text-xs uppercase tracking-widest text-[#39FF14]">📼 TGIF Fan Mail</span>
        <h2 className="mt-1 font-head text-3xl uppercase tracking-wider text-[#F5E6C8] sm:text-4xl">{title}</h2>
        <MailForm
          subject="Newsletter signup"
          kind="subscribe"
          fields={[
            { name: "name", placeholder: "Your name" },
            { name: "email", placeholder: "Your email", type: "email", required: true },
          ]}
          button="SUBSCRIBE"
          className="mx-auto mt-6 max-w-md w-full"
        />
      </div>
    </section>
  );
}

/** Wide article card used by the blog list and magazine pages. */
export function PostWide({ post }: { post: Post }) {
  return (
    <article className="overflow-hidden rounded-xl border border-black/20 bg-[#F2E8C9] text-black shadow-[4px_6px_0px_#000000] transition-all hover:-translate-y-1 hover:shadow-[6px_10px_0px_#FF1493]">
      <div className="flex items-center justify-between bg-black px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest text-[#F5E6C8]">
        <span className="flex items-center gap-1.5 font-bold text-[#39FF14]">
          <span className="h-2 w-2 rounded-full bg-[#39FF14] animate-pulse" />
          VHS ARCHIVE • SP 120
        </span>
        <span className="text-[#00D9FF]">{post.category}</span>
      </div>
      <div className="p-5 sm:p-6">
        <TrackedLink slug={post.slug} className="group block">
          <div className="overflow-hidden rounded-lg">
            <Cover post={post} />
          </div>
          <h3 className="mt-4 font-head text-2xl sm:text-3xl font-bold leading-tight tracking-wide text-black group-hover:text-[#FF1493] transition">
            {post.title}
          </h3>
        </TrackedLink>
        <p className="mt-2 font-mono text-xs text-black/60">{post.category} · {fmtDate(post.createdAt)}</p>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-black/80">{post.excerpt}</p>
        <div className="mt-5">
          <Btn href={`/posts/${post.slug}`}>Read story <Chevron className="h-3 w-3" /></Btn>
        </div>
      </div>
    </article>
  );
}

/** Three-up card with image, category tag, title, excerpt and two buttons (blog grid). */
export function PostGridCard({ post }: { post: Post }) {
  return <PostCard post={post} />;
}

export function Panel({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-[#FF1493]/30 bg-[#160a33] p-6 text-[#F5E6C8] shadow-[0_0_20px_rgba(0,0,0,0.5)] ${className}`}>
      <h2 className="font-head text-2xl uppercase tracking-wider text-[#FF1493]">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function paginate<T>(items: T[], page: number, size: number) {
  const pages = Math.max(1, Math.ceil(items.length / size));
  const p = Math.min(Math.max(1, page || 1), pages);
  return { pages, page: p, slice: items.slice((p - 1) * size, p * size) };
}
