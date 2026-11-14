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
  try {
    const [raw] = await run([["HGETALL", KEY]]);
    const map = toObj(raw);
    const list = Object.values(map)
      .map((v) => {
        try {
          const p = JSON.parse(v) as Post;
          if (p && p.category) {
            p.category = cleanCategory(p.category);
          }
          if (p && !Array.isArray(p.tags)) {
            p.tags = [];
          }
          return p;
        } catch {
          return null as unknown as Post;
        }
      })
      .filter((p): p is Post => Boolean(p && p.slug))
      .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
      
    if (list.length > 0) {
      return list;
    }
  } catch (err) {
    console.warn("Failed to load posts from DB, using fallbackPosts:", err);
  }
  return [...(fallbackPosts as unknown as Post[])].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

export async function getPublished(): Promise<Post[]> {
  return (await getAllPosts()).filter((p) => p.status === "published");
}

export async function getStoryPosts(): Promise<Post[]> {
  return (await getPublished()).filter((p) => !isLegalSlug(p.slug));
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await getAllPosts();
  const direct = posts.find((p) => p.slug === slug && p.status === "published");
  if (direct) return direct;

  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const target = norm(slug);
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
