import { NextRequest, NextResponse } from "next/server";
import { record, type EventType } from "../../../lib/stats";

export const runtime = "nodejs";

const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse/i;

function device(ua: string) {
  if (/ipad|tablet/i.test(ua)) return "Tablet";
  if (/mobi|iphone|android/i.test(ua)) return "Mobile";
  return "Desktop";
}

export async function POST(req: NextRequest) {
  const ua = req.headers.get("user-agent") ?? "";
  if (BOT.test(ua)) return new NextResponse(null, { status: 204 });

  let body: { type?: string; slugs?: string[]; ref?: string };
  try {
    body = JSON.parse(await req.text());
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  const type = body.type as EventType;
  const slugs = (body.slugs ?? []).filter((s) => /^[a-z0-9-]{1,80}$/.test(s)).slice(0, 20);
  if (!["imp", "click", "view"].includes(type) || !slugs.length) return new NextResponse(null, { status: 400 });

  let visitor = req.cookies.get("tv_vid")?.value;
  const isNew = !visitor;
  visitor ??= crypto.randomUUID();

  const dec = (v: string | null) => {
    try {
      return decodeURIComponent(v ?? "");
    } catch {
      return v ?? "";
    }
  };

  await record(type, slugs, {
    visitor,
    // Vercel adds geo headers at the edge; falls back to "??" locally
    country: req.headers.get("x-vercel-ip-country") ?? "??",
    region: dec(req.headers.get("x-vercel-ip-country-region")),
    city: dec(req.headers.get("x-vercel-ip-city")),
    device: device(ua),
    ref: (body.ref ?? "").slice(0, 120),
  });

  const res = new NextResponse(null, { status: 204 });
  if (isNew) res.cookies.set("tv_vid", visitor, { maxAge: 60 * 60 * 24 * 365, path: "/", sameSite: "lax", httpOnly: true });
  return res;
}
