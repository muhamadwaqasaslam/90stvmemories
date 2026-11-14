import { SITE_URL } from "./site";
import type { Post } from "./posts";

interface FBShareResult {
  page: string;
  success: boolean;
  postId?: string;
  error?: string;
}

/**
 * Automatically shares a newly published article to Facebook Pages using the Graph API.
 * Uses environment variables:
 * - FB_PAGE_ACCESS_TOKEN_90210 (and optional FB_PAGE_ID_90210)
 * - FB_PAGE_ACCESS_TOKEN_FULLHOUSE (and optional FB_PAGE_ID_FULLHOUSE)
 */
export async function autoShareToFacebook(post: Post): Promise<FBShareResult[]> {
  const url = `${SITE_URL}/posts/${post.slug}`;

  // Build engaging caption for 90s TV Facebook audiences
  const caption = [
    `📺 NEW 90s TV STORY: ${post.title}`,
    "",
    post.excerpt,
    "",
    `👉 Read the full untold story & cast updates: ${url}`,
    "",
    "#90sTV #Nostalgia #RetroTV #90sKids #TGIF #90sSitcoms",
  ].join("\n");

  const targets = [
    {
      name: "Beverly Hills 90210 Fan (8.2K)",
      token: process.env.FB_PAGE_ACCESS_TOKEN_90210,
      pageId: process.env.FB_PAGE_ID_90210 || "me",
    },
    {
      name: "Full House Fan Club (2.5K)",
      token: process.env.FB_PAGE_ACCESS_TOKEN_FULLHOUSE,
      pageId: process.env.FB_PAGE_ID_FULLHOUSE || "me",
    },
  ];

  const results: FBShareResult[] = [];

  for (const target of targets) {
    if (!target.token) {
      console.log(`[FB Auto-Share] Skipping ${target.name}: token not configured.`);
      results.push({ page: target.name, success: false, error: "Token not set" });
      continue;
    }

    try {
      const endpoint = `https://graph.facebook.com/v19.0/${target.pageId}/feed`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: caption,
          link: url,
          access_token: target.token,
        }),
      });

      const data = (await res.json()) as { id?: string; error?: { message: string } };

      if (!res.ok || data.error) {
        const errMsg = data.error?.message || `HTTP ${res.status}`;
        console.warn(`[FB Auto-Share] Failed for ${target.name}:`, errMsg);
        results.push({ page: target.name, success: false, error: errMsg });
      } else {
        console.log(`[FB Auto-Share] Successfully posted to ${target.name}! Post ID: ${data.id}`);
        results.push({ page: target.name, success: true, postId: data.id });
      }
    } catch (err) {
      const errMsg = (err as Error).message || "Network error";
      console.warn(`[FB Auto-Share] Exception posting to ${target.name}:`, errMsg);
      results.push({ page: target.name, success: false, error: errMsg });
    }
  }

  return results;
}
