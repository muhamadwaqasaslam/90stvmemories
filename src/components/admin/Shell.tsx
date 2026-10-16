import Link from "next/link";
import { logout } from "../../app/admin/actions";
import { Logo } from "../SiteChrome";
import { unreadCount } from "../../lib/messages";

const links = [
  ["/admin", "Dashboard"],
  ["/admin/posts", "Articles"],
  ["/admin/messages", "Messages"],
] as const;

export async function AdminShell({ active, children }: { active: string; children: React.ReactNode }) {
  const unread = await unreadCount();
  return (
    <div className="admin-ui min-h-screen bg-mist text-ink">
      <div className="bg-navy text-xs text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
          <span className="font-bold uppercase tracking-wide">Admin panel</span>
          <Link href="/" target="_blank" className="hover:underline">View site ↗</Link>
        </div>
      </div>
      <header className="sticky top-0 z-30 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-3">
          <div className="flex items-center justify-between gap-3">
            <Logo />
            <form action={logout} className="md:hidden">
              <button className="min-h-11 border border-navy px-4 text-sm text-navy transition hover:bg-navy hover:text-white">Log out</button>
            </form>
          </div>
          <nav aria-label="Admin" className="-mx-4 flex items-center gap-1 overflow-x-auto px-4 text-[15px] sm:mx-0 sm:px-0 md:overflow-visible">
            {links.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                aria-current={active === href ? "page" : undefined}
                className={`flex min-h-11 flex-1 items-center justify-center whitespace-nowrap px-5 py-2 transition md:flex-none ${active === href ? "bg-navy text-white" : "text-black hover:bg-mist hover:text-navy"}`}
              >
                {label}
                {href === "/admin/messages" && unread > 0 && <span className="ml-2 bg-red-600 px-1.5 py-0.5 text-xs font-bold text-white">{unread}</span>}
              </Link>
            ))}
            <form action={logout} className="hidden md:block">
              <button className="ml-2 min-h-11 border border-navy px-5 py-2 text-navy transition hover:bg-navy hover:text-white">Log out</button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </div>
  );
}
