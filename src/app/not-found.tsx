import Link from "next/link";
import { Footer, Header } from "../components/SiteChrome";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="grid place-items-center px-4 py-24 text-center">
        <div>
          <div className="bars mx-auto mb-6 h-16 w-64 rounded-lg border border-ink" />
          <h1 className="font-display text-4xl">404 · No signal</h1>
          <p className="mt-3 text-lg">This channel doesn&apos;t exist. Try rewinding.</p>
          <Link href="/" className="pop pop-hover mt-6 inline-block rounded-full bg-pink px-6 py-3 font-semibold text-white">◀ Back home</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
