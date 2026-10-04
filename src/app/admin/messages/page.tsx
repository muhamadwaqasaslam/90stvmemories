import Link from "next/link";
import { AdminShell } from "../../../components/admin/Shell";
import { KINDS, getMessages, type MessageKind } from "../../../lib/messages";
import { markMessage, removeMessage } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Messages", robots: { index: false } };

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/New_York" });

export default async function Messages({ searchParams }: { searchParams: Promise<{ kind?: string }> }) {
  const { kind } = await searchParams;
  const all = await getMessages();
  const active = kind && kind in KINDS ? (kind as MessageKind) : undefined;
  const list = active ? all.filter((m) => m.kind === active) : all;
  const count = (k: MessageKind) => all.filter((m) => m.kind === k).length;
  const subscribers = [...new Set(all.filter((m) => m.kind === "subscribe").map((m) => m.email))];

  return (
    <AdminShell active="/admin/messages">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-pink">INBOX</p>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">Messages &amp; subscribers</h1>
        </div>
        <p className="text-sm text-ink/60">
          {all.length} total · {all.filter((m) => !m.read).length} unread · {subscribers.length} subscribers
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 text-sm font-semibold">
        <Link href="/admin/messages" className={`px-4 py-2 ${!active ? "bg-navy text-white" : "bg-white hover:bg-white/60"}`}>All ({all.length})</Link>
        {(Object.keys(KINDS) as MessageKind[]).map((k) => (
          <Link key={k} href={`/admin/messages?kind=${k}`} className={`px-4 py-2 ${active === k ? "bg-navy text-white" : "bg-white hover:bg-white/60"}`}>
            {KINDS[k]} ({count(k)})
          </Link>
        ))}
      </div>

      {active === "subscribe" && subscribers.length > 0 && (
        <details className="pop mt-5 bg-white p-4">
          <summary className="cursor-pointer font-semibold">Copy all subscriber emails ({subscribers.length})</summary>
          <p className="mt-3 select-all break-words text-sm">{subscribers.join(", ")}</p>
        </details>
      )}

      <ul className="mt-6 space-y-3">
        {list.map((m) => (
          <li key={m.id} className={`pop bg-white p-5 ${m.read ? "" : "border-l-4 border-navy"}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 font-semibold">
                  <span className="bg-navy px-2 py-0.5 text-xs font-bold uppercase text-white">{KINDS[m.kind]}</span>
                  {m.name || m.email || "Anonymous"}
                  {!m.read && <span className="text-xs text-pink">new</span>}
                </p>
                <p className="mt-1 text-sm text-ink/55">
                  {m.email && <a href={`mailto:${m.email}`} className="text-navy hover:underline">{m.email}</a>}
                  {m.email && " · "}{when(m.createdAt)} · {m.device} · {m.country} · from {m.page || "unknown page"}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <form action={markMessage}>
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="read" value={m.read ? "0" : "1"} />
                  <button className="border border-navy px-4 py-2 text-navy hover:bg-navy hover:text-white">{m.read ? "Mark unread" : "Mark read"}</button>
                </form>
                <form action={removeMessage}>
                  <input type="hidden" name="id" value={m.id} />
                  <button className="border-2 border-red-600/60 px-4 py-2 text-red-600 hover:bg-red-600 hover:text-white">Delete</button>
                </form>
              </div>
            </div>
            {m.subject && <p className="mt-3 text-sm text-ink/55">{m.subject}</p>}
            <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[10rem_1fr]">
              {Object.entries(m.fields).map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="font-semibold text-ink/60">{k}</dt>
                  <dd className="whitespace-pre-wrap break-words">{v}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
      {!list.length && <p className="pop mt-6 bg-white p-10 text-center text-ink/60">Nothing here yet. Messages and subscribers from the site forms will show up in this list.</p>}
      <p className="mt-4 text-xs text-ink/45">Page views, clicks and visitors are on the Dashboard.</p>
    </AdminShell>
  );
}
