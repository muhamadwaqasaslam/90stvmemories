import { LoginForm } from "./form";
import { Logo } from "../../../components/SiteChrome";

export const metadata = { title: "Admin Login | 90s TV Memories", robots: { index: false } };

export default function LoginPage() {
  return (
    <div className="admin-ui relative grid min-h-screen place-items-center bg-[#0a0a23] px-4 selection:bg-[#FF1493] selection:text-white overflow-hidden">
      {/* Retro background CRT scanlines */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1a0a3a_0%,#0a0a23_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.3)_0px,rgba(0,0,0,0.3)_2px,transparent_2px,transparent_4px)]" />

      {/* Slime drip decorative */}
      <div className="pointer-events-none absolute left-8 top-0 z-20 hidden sm:block">
        <svg width="120" height="70" viewBox="0 0 120 70" fill="none" className="drop-shadow-[0_0_12px_rgba(57,255,20,0.85)]">
          <path d="M0 0 H120 C110 20 100 35 90 20 C80 5 70 50 60 40 C50 30 40 65 30 35 C20 10 10 45 0 20 Z" fill="#39FF14" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="overflow-hidden rounded-2xl border-2 border-[#00D9FF] bg-[#160a33] p-8 shadow-[0_0_35px_rgba(0,217,255,0.3)]">
          <div className="mb-6 flex justify-center">
            <Logo dark />
          </div>

          <div className="border-t border-b border-white/10 py-3 my-4 text-center">
            <span className="font-mono text-xs uppercase tracking-widest text-[#39FF14]">📼 VHS ARCHIVE ACCESS</span>
            <h1 className="mt-1 font-head text-4xl uppercase tracking-wider text-[#FF1493] drop-shadow-[0_0_15px_rgba(255,20,147,0.7)]">
              Admin Login
            </h1>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
