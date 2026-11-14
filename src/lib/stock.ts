import type { Post } from "./posts";

/** Fallback photos for posts without an uploaded cover. */
const TV = Array.from({ length: 10 }, (_, i) => `/images/stock/tv-${String(i + 1).padStart(2, "0")}.jpg`);

export const BANNER_IMAGE = "/images/stock/banner.jpg";
export const NIGHT_IMAGE = "/images/stock/night.jpg";

/** High-quality thematic show images matched automatically by slug */
const SHOW_IMAGES: Record<string, string> = {
  "home-improvement": "/images/articles/home-improvement.jpg",
  "wilson": "/images/articles/home-improvement.jpg",
  "full-house": "/images/articles/full-house.jpg",
  "tanner": "/images/articles/full-house.jpg",
  "fresh-prince": "/images/articles/fresh-prince.jpg",
  "uncle-phil": "/images/articles/fresh-prince.jpg",
  "bel-air": "/images/articles/fresh-prince.jpg",
  "beverly-hills": "/images/articles/beverly-hills-90210.jpg",
  "90210": "/images/articles/beverly-hills-90210.jpg",
  "luke-perry": "/images/articles/luke-perry.jpg",
  "dylan-mckay": "/images/articles/luke-perry.jpg",
  "saved-by-the-bell": "/images/articles/saved-by-the-bell.jpg",
  "dustin-diamond": "/images/articles/saved-by-the-bell.jpg",
  "family-matters": "/images/articles/family-matters.jpg",
  "urkel": "/images/articles/family-matters.jpg",
  "friends": "/images/articles/friends.jpg",
  "central-perk": "/images/articles/friends.jpg",
  "charmed": "/images/articles/charmed.jpg",
  "halliwell": "/images/articles/charmed.jpg",
  "boy-meets-world": "/images/articles/boy-meets-world.jpg",
  "turner": "/images/articles/boy-meets-world.jpg",
  "married-with-children": "/images/articles/married-with-children.jpg",
  "bundy": "/images/articles/married-with-children.jpg",
  "70s-show": "/images/articles/that-70s-show.jpg",
  "pokemon": "/images/articles/pokemon.jpg",
  "sister-sister": "/images/articles/sister-sister.jpg",
  "dawsons-creek": "/images/articles/dawsons-creek.jpg",
  "sabrina": "/images/articles/sabrina-teenage-witch.jpg",
  "robin-williams": "/images/articles/robin-williams.jpg",
  "hottest-male": "/images/articles/hottest-male-actors.jpg",
};

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

/** 
 * Returns the post's cover if valid. 
 * If empty or suspended Vercel blob storage, automatically matches a high-quality show image!
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
  return "/images/articles/forgotten-90s-shows.jpg";
};
