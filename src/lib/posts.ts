import { run, toObj } from "./db";
import type { ThemeKey } from "./themes";
import fallbackPosts from "../data/fallbackPosts.json";

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  theme: ThemeKey;
  imageUrl?: string;
  tags?: string[];
  status: "published" | "draft";
  createdAt: string;
  updatedAt: string;
}

export const LEGAL_SLUGS = new Set(["privacy-policy", "terms-of-service", "disclaimer"]);

export function isLegalSlug(slug?: string): boolean {
  if (!slug) return false;
  return LEGAL_SLUGS.has(slug);
}

export function cleanCategory(cat?: string): string {
  if (typeof cat !== "string" || !cat.trim()) return "Memories";
  return cat
    .replace(/\s*یا\s*/g, " & ")
    .replace(/\s+/g, " ")
    .trim();
}

const KEY = "posts";

export async function getAllPosts(): Promise<Post[]> {
  const map = new Map<string, Post>();

  // 1. Seed with permanent fallback posts so they are ALWAYS available on the site
  for (const raw of fallbackPosts as unknown as Post[]) {
    if (raw && raw.slug) {
      const p = { ...raw };
      if (p.category) p.category = cleanCategory(p.category);
      if (!Array.isArray(p.tags)) p.tags = [];
      map.set(p.id || p.slug, p);
    }
  }

  // 2. Overlay posts from DB (Upstash Redis or local), so edits and new posts are reflected
  try {
    const [raw] = await run([["HGETALL", KEY]]);
    const dbMap = toObj(raw);
    for (const v of Object.values(dbMap)) {
      try {
        const p = JSON.parse(v) as Post;
        if (p && p.slug) {
          if (p.category) p.category = cleanCategory(p.category);
          if (!Array.isArray(p.tags)) p.tags = [];
          map.set(p.id || p.slug, p);
        }
      } catch {
        // ignore malformed items
      }
    }
  } catch (err) {
    console.warn("Failed to load posts from DB, relying on seed posts:", err);
  }

  return Array.from(map.values()).sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

export async function getPublished(): Promise<Post[]> {
  return (await getAllPosts()).filter((p) => p.status === "published");
}

export async function getStoryPosts(): Promise<Post[]> {
  return (await getPublished()).filter((p) => !isLegalSlug(p.slug));
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  if (!slug) return undefined;

  let decoded = slug;
  try {
    decoded = decodeURIComponent(slug).trim();
  } catch {
    decoded = slug.trim();
  }
  const cleanSlug = decoded.toLowerCase();

  const posts = await getAllPosts();

  // 1. Direct exact slug match (published)
  const direct = posts.find((p) => p.slug.toLowerCase() === cleanSlug && p.status === "published");
  if (direct) return direct;

  // 2. Direct ID match (e.g. /posts/post_1, /posts/post_45)
  const byId = posts.find((p) => (p.id === decoded || p.id.toLowerCase() === cleanSlug) && p.status === "published");
  if (byId) return byId;

  // 3. Fallback normalized alphanumeric match (ignoring dashes, case, punctuation)
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const target = norm(decoded);
  if (!target) return undefined;

  return posts.find((p) => {
    if (p.status !== "published") return false;
    const cur = norm(p.slug);
    return cur === target || cur.includes(target) || target.includes(cur);
  });
}

export async function getPostById(id: string): Promise<Post | undefined> {
  return (await getAllPosts()).find((p) => p.id === id);
}

export async function savePost(p: Post): Promise<void> {
  await run([["HSET", KEY, p.id, JSON.stringify(p)]]);
}

export async function deletePost(id: string): Promise<void> {
  await run([["HDEL", KEY, id]]);
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

export const readMins = (content: string) => Math.max(1, Math.round(content.split(/\s+/).length / 200));
