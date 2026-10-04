/** @type {import('next').NextConfig} */
const config = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
};

export default config;
