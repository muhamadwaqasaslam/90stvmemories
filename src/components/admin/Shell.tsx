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
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Logo />
          <nav className="flex flex-wrap items-center gap-1 text-[15px]">
            {links.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className={`px-5 py-2 transition ${active === href ? "bg-navy text-white" : "text-black hover:bg-mist hover:text-navy"}`}
              >
                {label}
                {href === "/admin/messages" && unread > 0 && <span className="ml-2 bg-red-600 px-1.5 py-0.5 text-xs font-bold text-white">{unread}</span>}
              </Link>
            ))}
            <form action={logout}>
              <button className="ml-2 border border-navy px-5 py-2 text-navy transition hover:bg-navy hover:text-white">Log out</button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
