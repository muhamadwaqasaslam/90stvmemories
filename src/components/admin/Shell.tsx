import Link from "next/link";
import { logout } from "../../app/admin/actions";
import { Logo } from "../SiteChrome";

const links = [
  ["/admin", "📊 Dashboard"],
  ["/admin/posts", "📝 Articles"],
] as const;

export function AdminShell({ active, children }: { active: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="bars h-[3px]" />
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Logo />
          <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-ink/70">
            {links.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className={`rounded-full px-4 py-2 ${active === href ? "bg-ink text-white" : "hover:bg-ink/5"}`}
              >
                {label}
              </Link>
            ))}
            <Link href="/" target="_blank" className="rounded-full px-4 py-2 hover:bg-ink/5">↗ View site</Link>
            <form action={logout}>
              <button className="rounded-full border border-ink/15 px-4 py-2 hover:bg-ink/5">Log out</button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
