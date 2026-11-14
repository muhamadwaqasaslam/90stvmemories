import Link from "next/link";
import { Footer, Header } from "../components/SiteChrome";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a23] text-white flex flex-col justify-between selection:bg-[#FF1493] selection:text-white">
      <Header />

      <main className="relative z-10 flex-1 grid place-items-center px-4 py-16 sm:py-24 text-center overflow-hidden">
        {/* Nickelodeon green slime drips from top corners */}
        <div className="pointer-events-none absolute left-4 top-0 z-20 hidden sm:block">
          <svg width="120" height="70" viewBox="0 0 120 70" fill="none" className="drop-shadow-[0_0_12px_rgba(57,255,20,0.85)]">
            <path d="M0 0 H120 C110 20 100 35 90 20 C80 5 70 50 60 40 C50 30 40 65 30 35 C20 10 10 45 0 20 Z" fill="#39FF14" />
          </svg>
        </div>

        <div className="relative max-w-xl mx-auto">
          {/* CRT TV Graphic Frame */}
          <div className="relative mx-auto w-72 sm:w-80 rounded-3xl border-4 border-[#00D9FF] bg-[#1a0a3a] p-4 shadow-[0_0_35px_rgba(0,217,255,0.4)]">
            {/* TV Antennas */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-end gap-1 pointer-events-none">
              <div className="h-10 w-1.5 origin-bottom -rotate-25 rounded-full bg-gradient-to-t from-gray-400 to-white" />
              <div className="h-10 w-1.5 origin-bottom rotate-25 rounded-full bg-gradient-to-t from-gray-400 to-white" />
            </div>

            {/* CRT Screen with static / color bars */}
            <div className="relative h-44 rounded-2xl bg-black overflow-hidden flex flex-col items-center justify-center border-2 border-white/20">
              {/* Color bars (SMPTE) */}
              <div className="absolute inset-0 flex opacity-60">
                <div className="flex-1 bg-gray-200" />
                <div className="flex-1 bg-yellow-400" />
                <div className="flex-1 bg-cyan-400" />
                <div className="flex-1 bg-green-500" />
                <div className="flex-1 bg-magenta-500" />
                <div className="flex-1 bg-red-600" />
                <div className="flex-1 bg-blue-600" />
              </div>

              {/* Scanlines */}
              <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.3)_0px,rgba(0,0,0,0.3)_2px,transparent_2px,transparent_4px)]" />

              <div className="relative z-10 px-4 py-2 rounded bg-black/80 border border-[#FF1493] backdrop-blur-sm shadow-[0_0_15px_rgba(255,20,147,0.7)]">
                <p className="font-mono text-xs tracking-widest text-[#00D9FF] animate-pulse">CH 03 · NO SIGNAL</p>
                <p className="font-head text-3xl font-black text-[#FF1493] tracking-wider">PLEASE REWIND</p>
              </div>
            </div>

            {/* Dials */}
            <div className="mt-3 flex items-center justify-between px-3 text-xs font-mono text-[#F5E6C8]">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#39FF14] animate-ping" />
                VHS • SP 120
              </span>
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full border border-[#00D9FF] bg-[#0a0a23]" />
                <div className="h-3 w-3 rounded-full border border-[#FF1493] bg-[#0a0a23]" />
              </div>
            </div>
          </div>

          <h1 className="mt-8 font-head text-5xl sm:text-6xl font-black tracking-wider text-[#FF1493] drop-shadow-[0_0_20px_rgba(255,20,147,0.8)]">
            404 · CHANNEL NOT FOUND
          </h1>
          <p className="mt-3 text-base sm:text-lg text-[#F5E6C8] max-w-md mx-auto">
            This tape is unspooled or this channel is off the air! Hit the eject button below to head back home.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="rounded-full bg-[#FF1493] px-8 py-3.5 font-head text-xl font-bold uppercase tracking-wider text-white shadow-[0_0_25px_rgba(255,20,147,0.7)] hover:bg-[#ff3baf] hover:scale-105 transition-all"
            >
              ◀ Eject &amp; Go Home
            </Link>
            <Link
              href="/blog"
              className="rounded-full border-2 border-[#00D9FF] bg-[#0a0a23] px-6 py-3 font-head text-lg font-bold uppercase tracking-wider text-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.4)] hover:bg-[#00D9FF] hover:text-black transition-all"
            >
              Browse All VHS Archives →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
