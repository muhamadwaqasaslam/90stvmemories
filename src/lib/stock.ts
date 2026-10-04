import type { Post } from "./posts";

/** Fallback photos (Unsplash, free licence) for posts without an uploaded cover. */
const TV = Array.from({ length: 10 }, (_, i) => `/images/stock/tv-${String(i + 1).padStart(2, "0")}.jpg`);

export const BANNER_IMAGE = "/images/stock/banner.jpg";
export const NIGHT_IMAGE = "/images/stock/night.jpg";

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

/** The post's own cover when it has one, otherwise a stable stock photo. */
export const coverUrl = (post: Pick<Post, "imageUrl" | "slug">) => post.imageUrl || TV[hash(post.slug) % TV.length];
