/** Public site address, without a trailing slash. Always enforce production custom domain. */
const rawUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").trim().replace(/\/+$/, "");
export const SITE_URL = rawUrl && !rawUrl.includes("vercel.app")
  ? rawUrl
  : "https://www.90stvmemories.com";
