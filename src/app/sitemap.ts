import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/site";
import { getPublished } from "../lib/posts";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublished().catch(() => []);
  const latest = posts[0] ? new Date(posts[0].updatedAt || posts[0].createdAt) : new Date();
  const pages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: latest, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/blog`, lastModified: latest, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/magazine`, lastModified: latest, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/features`, lastModified: latest, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.4 },
  ];
  return [
    ...pages,
    ...posts.map((p) => ({
      url: `${SITE_URL}/posts/${p.slug}`,
      lastModified: new Date(p.updatedAt || p.createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
