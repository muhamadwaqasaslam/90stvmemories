import type { Post } from "./posts";

/** Fallback photos (Unsplash, free licence) for posts without an uploaded cover. */
const TV = Array.from({ length: 10 }, (_, i) => `/images/stock/tv-${String(i + 1).padStart(2, "0")}.jpg`);

export const BANNER_IMAGE = "/images/stock/banner.jpg";
export const NIGHT_IMAGE = "/images/stock/night.jpg";

/** High-quality thematic show images matched automatically by slug */
const SHOW_IMAGES: Record<string, string> = {
  "married-with-children": "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=1200",
  "charmed": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200",
  "boy-meets-world": "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=1200",
  "fresh-prince": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1200",
  "pokemon": "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&q=80&w=1200",
  "beverly-hills": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
  "family-matters": "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1200",
  "the-nanny": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1200",
  "dawsons-creek": "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=1200",
  "sister-sister": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1200",
  "step-by-step": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1200",
  "buffy": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=1200",
  "x-files": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200",
  "sabrina": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=1200",
  "full-house": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200",
  "friends": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200"
};

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

/** 
 * Returns the post's cover if valid. 
 * If it points to the suspended Vercel blob storage or is empty, automatically matches a high-quality thematic image based on the show name!
 */
export const coverUrl = (post: Pick<Post, "imageUrl" | "slug">) => {
  const url = post.imageUrl;
  // If user provided their own valid online image (not suspended blob), use it directly!
  if (url && !url.includes("blob.vercel-storage.com")) {
    return url;
  }
  
  // Smart show detection from slug
  const slugLower = (post.slug || "").toLowerCase();
  for (const [key, thematicImg] of Object.entries(SHOW_IMAGES)) {
    if (slugLower.includes(key)) {
      return thematicImg;
    }
  }

  // Fallback to local retro TV photos
  return TV[hash(post.slug || "tv") % TV.length];
};
