import { SITE_URL } from "../../lib/site";
import { getPublished } from "../../lib/posts";
import { DEFAULT_DESC } from "../../lib/seo";

export const revalidate = 3600;

/** Plain-text site summary for AI assistants and answer engines (llmstxt.org convention). */
export async function GET() {
  const posts = await getPublished().catch(() => []);
  const body = [
    "# 90s TV Memories",
    "",
    `> ${DEFAULT_DESC}`,
    "",
    "Audience: readers in the United States (English, en-US). Independent fan site, not affiliated with any network or studio.",
    "",
    "## Main pages",
    `- [Home](${SITE_URL}/): latest stories and topics`,
    `- [All stories](${SITE_URL}/blog): searchable archive`,
    `- [Features](${SITE_URL}/features): top picks`,
    `- [About](${SITE_URL}/about): who we are and FAQ`,
    `- [Contact](${SITE_URL}/contact): send a memory or question`,
    "",
    "## Stories",
    ...posts.map((p) => `- [${p.title}](${SITE_URL}/posts/${p.slug}): ${p.excerpt.replace(/\s+/g, " ").trim()}`),
    "",
  ].join("\n");
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
