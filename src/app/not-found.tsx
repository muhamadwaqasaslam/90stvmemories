import Link from "next/link";
import { Footer, Header } from "../components/SiteChrome";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="grid place-items-center px-4 py-24 text-center">
        <div>
          <h1 className="text-5xl text-navy">404 · No signal</h1>
          <p className="mt-3 font-serif text-xl">This channel doesn&apos;t exist. Try rewinding.</p>
          <Link href="/" className="mt-6 inline-block bg-navy px-8 py-3 text-[15px] font-bold uppercase text-white">◀ Back home</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
