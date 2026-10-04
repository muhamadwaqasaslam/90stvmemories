"use client";

import { useActionState, useState } from "react";
import { login } from "../actions";

function Eye({ off }: { off: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
      {off && <path d="M3 3l18 18" />}
    </svg>
  );
}

export function LoginForm() {
  const [error, action, pending] = useActionState(login, null);
  const [show, setShow] = useState(false);

  return (
    <form action={action} className="mt-6 space-y-4">
      <label className="block text-sm font-medium text-ink/75">
        Password
        <div className="relative mt-1.5">
          <input
            name="password"
            type={show ? "text" : "password"}
            required
            autoFocus
            autoComplete="current-password"
            className="w-full rounded-xl border border-ink/15 bg-white py-3 pl-4 pr-12 text-base text-ink outline-none transition focus:border-pink focus:ring-4 focus:ring-pink/10"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            aria-pressed={show}
            className="absolute inset-y-0 right-0 grid w-12 place-items-center rounded-r-xl text-ink/45 transition hover:text-ink"
          >
            <Eye off={show} />
          </button>
        </div>
      </label>
      {error && <p role="alert" className="rounded-lg bg-pink/10 px-3 py-2 text-sm font-medium text-pink">{error}</p>}
      <button
        disabled={pending}
        className="w-full bg-navy px-6 py-3 font-bold uppercase text-white transition hover:bg-black disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Log in"}
      </button>
    </form>
  );
}
