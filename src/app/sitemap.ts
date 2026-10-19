import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/site";
import { getPublished, isLegalSlug } from "../lib/posts";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublished().catch(() => []);
  const latest = posts[0]?.updatedAt || posts[0]?.createdAt
    ? new Date(posts[0].updatedAt || posts[0].createdAt)
    : new Date();
  const safeLatest = isNaN(latest.getTime()) ? new Date() : latest;

  const pages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: safeLatest, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/blog`, lastModified: safeLatest, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/magazine`, lastModified: safeLatest, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/features`, lastModified: safeLatest, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.4 },
  ];

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => {
    const isLegal = isLegalSlug(p.slug);
    const dateStr = p.updatedAt || p.createdAt;
    const date = dateStr ? new Date(dateStr) : safeLatest;
    const validDate = isNaN(date.getTime()) ? safeLatest : date;
    return {
      url: `${SITE_URL}/posts/${p.slug}`,
      lastModified: validDate,
      changeFrequency: isLegal ? "yearly" : "monthly",
      priority: isLegal ? 0.3 : 0.8,
    };
  });

  return [...pages, ...postEntries];
}
