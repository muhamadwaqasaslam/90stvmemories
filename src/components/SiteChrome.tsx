import Link from "next/link";

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="90s TV Memories home">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-pink text-lg shadow-sm">📺</span>
      <span className={`font-logo text-lg leading-none tracking-wide ${dark ? "text-white" : "text-ink"}`}>
        90s TV <span className="text-pink">Memories</span>
      </span>
    </Link>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper/85 backdrop-blur-md">
      <div className="bars h-[3px]" />
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-1 text-sm font-medium text-ink/70">
          <Link href="/#stories" className="rounded-full px-4 py-2 transition hover:bg-ink/5 hover:text-ink">Stories</Link>
          <Link href="/about" className="rounded-full px-4 py-2 transition hover:bg-ink/5 hover:text-ink">About</Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink/10 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-10 text-center sm:px-6">
        <Logo />
        <nav className="flex gap-5 text-sm font-medium text-ink/70"><Link href="/#stories" className="hover:text-pink">Stories</Link><Link href="/about" className="hover:text-pink">About</Link></nav>
        <p className="max-w-md text-sm text-ink/60">
          A love letter to the shows, tapes and Saturday mornings that raised a generation.
        </p>
        <p className="text-xs text-ink/40">© {new Date().getFullYear()} 90s TV Memories. All trademarks belong to their owners.</p>
      </div>
    </footer>
  );
}
