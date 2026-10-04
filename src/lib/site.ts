/** Public site address, without a trailing slash (set NEXT_PUBLIC_SITE_URL in Vercel). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.90stvmemories.com").trim().replace(/\/+$/, "");
