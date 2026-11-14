import Link from "next/link";
import { logout } from "../../app/admin/actions";
import { Logo } from "../SiteChrome";
import { unreadCount } from "../../lib/messages";

const links = [
  ["/admin", "Dashboard"],
  ["/admin/posts", "Articles & Tapes"],
  ["/admin/messages", "Fan Mail"],
] as const;

export async function AdminShell({ active, children }: { active: string; children: React.ReactNode }) {
  const unread = await unreadCount();
  return (
    <div className="admin-ui min-h-screen bg-[#0a0a23] text-white selection:bg-[#FF1493] selection:text-white">
      {/* Top Retro Bar */}
      <div className="border-b border-white/10 bg-[#160a33] text-xs font-mono text-[#F5E6C8]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6">
          <span className="flex items-center gap-2 font-bold uppercase tracking-wider text-[#39FF14]">
            <span className="h-2 w-2 rounded-full bg-[#39FF14] animate-ping" />
            90s TV ARCHIVES · ADMIN COMMAND DECK
          </span>
          <Link href="/" target="_blank" className="text-[#00D9FF] hover:text-[#FF1493] transition flex items-center gap-1 font-bold">
            Live Site ↗
          </Link>
        </div>
      </div>

      {/* Main Admin Header */}
      <header className="sticky top-0 z-30 border-b border-[#FF1493]/30 bg-[#0a0a23]/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between gap-3">
            <Logo dark />
            <form action={logout} className="md:hidden">
              <button className="rounded-lg border border-[#FF1493] px-3 py-1.5 font-mono text-xs font-bold uppercase text-[#FF1493] hover:bg-[#FF1493] hover:text-white transition">
                Log out
              </button>
            </form>
          </div>

          <nav aria-label="Admin" className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 text-sm sm:mx-0 sm:px-0 md:overflow-visible">
            {links.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                aria-current={active === href ? "page" : undefined}
                className={`flex min-h-10 items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 font-head text-base uppercase tracking-wider transition ${
                  active === href
                    ? "bg-[#FF1493] text-white shadow-[0_0_15px_rgba(255,20,147,0.7)]"
                    : "border border-white/10 bg-[#160a33] text-[#F5E6C8] hover:border-[#00D9FF] hover:text-[#00D9FF]"
                }`}
              >
                {label}
                {href === "/admin/messages" && unread > 0 && (
                  <span className="ml-2 rounded-full bg-[#39FF14] px-2 py-0.5 font-mono text-[10px] font-bold text-black">
                    {unread}
                  </span>
                )}
              </Link>
            ))}

            <form action={logout} className="hidden md:block">
              <button className="ml-3 rounded-lg border-2 border-[#FF1493] bg-[#0a0a23] px-4 py-1.5 font-head text-sm uppercase tracking-wider text-[#FF1493] shadow-[0_0_10px_rgba(255,20,147,0.4)] hover:bg-[#FF1493] hover:text-white transition">
                Log Out
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
