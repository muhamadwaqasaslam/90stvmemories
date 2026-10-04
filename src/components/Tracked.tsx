"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";

function send(type: "imp" | "click" | "view", slug: string) {
  const body = JSON.stringify({ type, slugs: [slug], ref: document.referrer ? new URL(document.referrer).hostname : "" });
  try {
    if (!navigator.sendBeacon?.("/api/track", new Blob([body], { type: "application/json" }))) throw 0;
  } catch {
    fetch("/api/track", { method: "POST", body, keepalive: true }).catch(() => {});
  }
}

/** Article card: counts an impression when it is ~60% visible, and a click when opened. */
export function TrackedLink({ slug, className, children }: { slug: string; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const seen = `imp:${slug}`;
    if (sessionStorage.getItem(seen)) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          sessionStorage.setItem(seen, "1");
          send("imp", slug);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [slug]);

  return (
    <Link ref={ref} href={`/posts/${slug}`} className={className} onClick={() => send("click", slug)}>
      {children}
    </Link>
  );
}

/** Mount on an article page: one view per browser session. */
export function ViewBeacon({ slug }: { slug: string }) {
  useEffect(() => {
    const seen = `view:${slug}`;
    if (sessionStorage.getItem(seen)) return;
    sessionStorage.setItem(seen, "1");
    send("view", slug);
  }, [slug]);
  return null;
}
