import { run, toObj } from "./db";
import type { ThemeKey } from "./themes";

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  theme: ThemeKey;
  imageUrl?: string;
  status: "published" | "draft";
  createdAt: string;
  updatedAt: string;
}

const KEY = "posts";

export async function getAllPosts(): Promise<Post[]> {
  const [raw] = await run([["HGETALL", KEY]]);
  const map = toObj(raw);
  return Object.values(map)
    .map((v) => JSON.parse(v) as Post)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getPublished(): Promise<Post[]> {
  return (await getAllPosts()).filter((p) => p.status === "published");
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  return (await getAllPosts()).find((p) => p.slug === slug && p.status === "published");
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
