# 90s TV Memories

Next.js 15 + TypeScript + Tailwind v4, fully serverless (Vercel-ready).

## Run locally

    npm install
    npm run dev        # http://localhost:3000

Admin: http://localhost:3000/admin (password from `.env.local`, default `retro90s`).

## What you get

- **Public site** (`/`, `/posts/[slug]`): 90s CRT/VHS theme, mobile friendly, readable article typography.
- **Post articles**: `/admin/posts` -> "New article" (title, text, category, cover, draft/publish).
- **Dashboard** (`/admin`): impressions, clicks, CTR, article views and unique viewers per **day** (7/30/90 days) and per **month**, a per-article table, US vs other countries, and the latest readers (city, device, referrer). Dates use US Eastern time.

## How tracking works

- Impression = card ~60% visible. Click = card opened. View = article page opened. Each counts once per browser session.
- Country and city come from Vercel edge headers (`x-vercel-ip-*`), so geo data only appears once deployed.
- Bots are ignored. Visitors are anonymous (random cookie id).

## Deploy (Vercel)

1. Push to GitHub and import the repo in Vercel.
2. Add the **Upstash Redis** integration (Storage tab). It injects `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
3. Set `ADMIN_PASSWORD`, `SESSION_SECRET` and `NEXT_PUBLIC_SITE_URL`.

Without Redis the app uses `.data/db.json` (local dev only; Vercel's filesystem is read-only).
