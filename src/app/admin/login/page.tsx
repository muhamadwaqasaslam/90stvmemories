import { LoginForm } from "./form";
import { Logo } from "../../../components/SiteChrome";
import { BANNER_IMAGE } from "../../../lib/stock";

export const metadata = { title: "Admin login", robots: { index: false } };

export default function LoginPage() {
  return (
    <div className="admin-ui relative grid min-h-screen place-items-center bg-cover bg-center px-4" style={{ backgroundImage: `url(${BANNER_IMAGE})` }}>
      <div className="absolute inset-0 bg-navy/80" />
      <div className="relative w-full max-w-sm">
        <div className="pop bg-white p-8">
          <div className="mb-6 flex justify-center"><Logo /></div>
          <p className="text-xs font-bold uppercase tracking-widest text-navy">Admin</p>
          <h1 className="mt-1 text-3xl text-navy">Welcome back</h1>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
