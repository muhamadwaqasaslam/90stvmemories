import { LoginForm } from "./form";
import { Logo } from "../../../components/SiteChrome";

export const metadata = { title: "Admin login", robots: { index: false } };

export default function LoginPage() {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-paper px-4">
      <div className="absolute -top-24 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-pink/15 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-60 w-60 rounded-full bg-cyan/15 blur-3xl" />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <div className="pop rounded-2xl bg-white p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-pink">Admin</p>
          <h1 className="mt-1 font-display text-2xl font-bold">Welcome back</h1>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
