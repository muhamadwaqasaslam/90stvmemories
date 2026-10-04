import Link from "next/link";
import type { ReactNode } from "react";
import { Chevron } from "./icons";
import { MailForm } from "./MailForm";
import { Cover } from "./PostCard";
import { TrackedLink } from "./Tracked";
import { fmtDate } from "../lib/dates";
import type { Post } from "../lib/posts";
import { BANNER_IMAGE } from "../lib/stock";

/** Grey page banner with centred white title (Figma inner pages). */
export function Banner({ title, image }: { title: string; image?: string }) {
  return (
    <section className="relative grid min-h-60 place-items-center bg-[#8a8a8a] px-6 py-16 text-center sm:min-h-80">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image ?? BANNER_IMAGE})` }} />
      <div className="absolute inset-0 bg-black/55" />
      <h1 className="relative max-w-4xl text-4xl font-bold text-white sm:text-5xl">{title}</h1>
    </section>
  );
}

export function Title({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h2 className={`text-center text-2xl uppercase text-navy sm:text-3xl ${className}`}>{children}</h2>;
}

export function Btn({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={`inline-flex items-center gap-2 bg-navy px-5 py-2 font-serif text-sm text-white transition hover:bg-black ${className}`}>
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
    <nav aria-label="Pagination" className="mt-14 flex items-center justify-center gap-1.5 font-serif text-sm">
      {list.map((n, i) => (
        <span key={n} className="flex items-center gap-1.5">
          {i > 0 && n - list[i - 1] > 1 && <span>…</span>}
          <Link href={href(n)} aria-current={n === page ? "page" : undefined} className={`grid h-8 w-8 place-items-center ${n === page ? "bg-navy text-white" : "bg-[#d9d6d6] hover:bg-navy hover:text-white"}`}>{n}</Link>
        </span>
      ))}
      {page < pages && <Link href={href(page + 1)} aria-label="Next page" className="grid h-8 w-8 place-items-center bg-[#d9d6d6] hover:bg-navy hover:text-white"><Chevron className="h-3.5 w-3.5" /></Link>}
    </nav>
  );
}

/** Split section: grey picture block on the left, simple form on the right. */
export function SubscribeSplit({ title = "Get new stories", image }: { title?: string; image?: string }) {
  return (
    <section className="grid md:grid-cols-2">
      <div className="min-h-64 bg-[#c4c4c4] bg-cover bg-center" style={{ backgroundImage: `url(${image ?? BANNER_IMAGE})` }} />
      <div className="bg-[#ececee] px-8 py-14 text-center md:px-20">
        <h2 className="text-3xl uppercase sm:text-[40px]">{title}</h2>
        <MailForm
          subject="Newsletter signup"
          kind="subscribe"
          fields={[
            { name: "name", placeholder: "Your name" },
            { name: "email", placeholder: "Your email", type: "email", required: true },
          ]}
          button="Subscribe"
          underline
          className="mx-auto mt-6 max-w-md text-center [&_label]:text-center [&_input]:text-center [&_span]:hidden"
        />
      </div>
    </section>
  );
}

/** Wide article card used by the blog list and magazine pages. */
export function PostWide({ post }: { post: Post }) {
  return (
    <article className="border border-black/10 border-t-2 border-t-navy bg-white p-5">
      <TrackedLink slug={post.slug} className="group block">
        <Cover post={post} />
        <h3 className="mt-5 text-2xl leading-snug text-navy group-hover:underline">{post.title}</h3>
      </TrackedLink>
      <p className="mt-2 font-serif text-sm text-slate">{post.category} · {fmtDate(post.createdAt)}</p>
      <p className="mt-3 line-clamp-4 font-serif text-base leading-6">{post.excerpt}</p>
      <Btn href={`/posts/${post.slug}`} className="mt-5">Read more <Chevron className="h-3 w-3" /></Btn>
    </article>
  );
}

/** Three-up card with image, category tag, title, excerpt and two buttons (blog grid). */
export function PostGridCard({ post }: { post: Post }) {
  return (
    <article>
      <TrackedLink slug={post.slug} className="group block">
        <Cover post={post} />
        <p className="mt-3 font-serif text-xs text-slate">{post.category} · {fmtDate(post.createdAt)}</p>
        <h3 className="mt-2 text-lg leading-snug text-navy group-hover:underline">{post.title}</h3>
      </TrackedLink>
      <p className="mt-3 line-clamp-3 font-serif text-sm leading-5">{post.excerpt}</p>
      <div className="mt-4 flex gap-2">
        <Btn href={`/posts/${post.slug}`} className="px-3 py-1 text-xs">Read <Chevron className="h-3 w-3" /></Btn>
        <Btn href={`/blog?cat=${encodeURIComponent(post.category)}`} className="px-3 py-1 text-xs">More like this <Chevron className="h-3 w-3" /></Btn>
      </div>
    </article>
  );
}

export function Panel({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white p-6 shadow-[4px_6px_12px_rgba(0,0,0,0.15)] ${className}`}>
      <h2 className="text-2xl text-navy">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function paginate<T>(items: T[], page: number, size: number) {
  const pages = Math.max(1, Math.ceil(items.length / size));
  const p = Math.min(Math.max(1, page || 1), pages);
  return { pages, page: p, slice: items.slice((p - 1) * size, p * size) };
}
