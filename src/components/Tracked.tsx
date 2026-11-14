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

/** Article card link: tracks clicks when clicked. */
export function TrackedLink({ slug, className, children }: { slug: string; className?: string; children: ReactNode }) {
  return (
    <Link href={`/posts/${slug}`} className={className} onClick={() => send("click", slug)}>
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
