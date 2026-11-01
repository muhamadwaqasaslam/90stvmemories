import type { Post } from "./posts";

/** Fallback photos (Unsplash, free licence) for posts without an uploaded cover. */
const TV = Array.from({ length: 10 }, (_, i) => `/images/stock/tv-${String(i + 1).padStart(2, "0")}.jpg`);

export const BANNER_IMAGE = "/images/stock/banner.jpg";
export const NIGHT_IMAGE = "/images/stock/night.jpg";

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

/** 
 * Returns the post's cover if valid. 
 * If it points to the suspended Vercel blob storage or is empty, automatically falls back to clean retro TV stock photos!
 */
export const coverUrl = (post: Pick<Post, "imageUrl" | "slug">) => {
  const url = post.imageUrl;
  if (!url || url.includes("blob.vercel-storage.com")) {
    return TV[hash(post.slug) % TV.length];
  }
  return url;
};
