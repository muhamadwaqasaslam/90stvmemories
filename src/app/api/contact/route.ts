import { NextRequest, NextResponse } from "next/server";
import { saveMessage, type MessageKind } from "../../../lib/messages";

export const runtime = "nodejs";

const KINDS: MessageKind[] = ["contact", "subscribe", "comment", "memory"];
const clip = (v: unknown, n: number) => String(v ?? "").trim().slice(0, n);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function device(ua: string) {
  if (/ipad|tablet/i.test(ua)) return "Tablet";
  if (/mobi|iphone|android/i.test(ua)) return "Mobile";
  return "Desktop";
}

export async function POST(req: NextRequest) {
  let body: { kind?: string; subject?: string; page?: string; fields?: Record<string, unknown>; website?: string };
  try {
    body = JSON.parse(await req.text());
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  // honeypot: real visitors never fill this hidden field
  if (body.website) return NextResponse.json({ ok: true });

  const kind = KINDS.includes(body.kind as MessageKind) ? (body.kind as MessageKind) : "contact";
  const fields: Record<string, string> = {};
  for (const [k, v] of Object.entries(body.fields ?? {}).slice(0, 12)) {
    const val = clip(v, 4000);
    if (val) fields[clip(k, 60)] = val;
  }
  if (!Object.keys(fields).length) return NextResponse.json({ error: "Please fill in the form." }, { status: 400 });

  const email = Object.entries(fields).find(([k, v]) => /e-?mail/i.test(k) && EMAIL.test(v))?.[1] ?? "";
  if (kind === "subscribe" && !email) return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  const name = Object.entries(fields).find(([k]) => /name/i.test(k))?.[1] ?? "";

  await saveMessage({
    id: crypto.randomUUID(),
    kind,
    name,
    email,
    subject: clip(body.subject, 160),
    fields,
    page: clip(body.page, 160),
    country: req.headers.get("x-vercel-ip-country") ?? "??",
    device: device(req.headers.get("user-agent") ?? ""),
    read: false,
    createdAt: new Date().toISOString(),
  });
  return NextResponse.json({ ok: true });
}
