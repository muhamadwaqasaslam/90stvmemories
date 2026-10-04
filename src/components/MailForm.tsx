"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

export type Field = { name: string; label?: string; placeholder?: string; type?: "text" | "email" | "textarea" | "tel"; required?: boolean; half?: boolean };

/** Sends the form to /api/contact so the admin can read it under Messages. */
export function MailForm({
  fields,
  button,
  subject,
  kind = "contact",
  className = "",
  inline = false,
  underline = false,
}: {
  fields: Field[];
  button: string;
  subject: string;
  kind?: "contact" | "subscribe" | "comment" | "memory";
  className?: string;
  inline?: boolean;
  underline?: boolean;
}) {
  const path = usePathname();
  const [state, setState] = useState<{ type: "idle" | "sending" | "ok" | "error"; text: string }>({ type: "idle", text: "" });

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const values: Record<string, string> = {};
    for (const f of fields) values[f.label ?? f.placeholder ?? f.name] = String(data.get(f.name) ?? "");
    setState({ type: "sending", text: "Sending…" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({ kind, subject, page: path, fields: values, website: data.get("website") }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Something went wrong. Please try again.");
      form.reset();
      setState({ type: "ok", text: kind === "subscribe" ? "You're subscribed. Thank you!" : "Thanks! Your message was sent." });
    } catch (err) {
      setState({ type: "error", text: err instanceof Error ? err.message : "Something went wrong." });
    }
  }

  const input = underline
    ? "w-full border-0 border-b border-navy/70 bg-transparent px-0 py-2 text-[17px] outline-none focus:border-navy"
    : inline
      ? "min-w-0 flex-1 bg-[#d9d6d6] px-3 py-2.5 font-serif text-sm outline-none"
      : "w-full border border-black/15 bg-[#fafafc] px-3 py-2 font-serif text-base outline-none focus:border-navy";
  const busy = state.type === "sending";

  return (
    <form onSubmit={submit} className={className}>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      <div className={inline ? "flex w-full max-w-xs" : "grid gap-5 sm:grid-cols-2"}>
        {fields.map((f) => (
          <label key={f.name} className={`block text-left font-serif text-sm ${f.half ? "" : "sm:col-span-2"}`}>
            {!inline && (f.label ?? f.placeholder) && <span className="mb-1 block">{f.label ?? f.placeholder}{f.required && " *"}</span>}
            {f.type === "textarea" ? (
              <textarea name={f.name} required={f.required} rows={underline ? 3 : 6} className={`${input} ${underline ? "" : "resize-y"}`} />
            ) : (
              <input name={f.name} type={f.type ?? "text"} required={f.required} placeholder={inline ? f.placeholder : undefined} aria-label={f.label ?? f.placeholder ?? f.name} className={input} />
            )}
          </label>
        ))}
        {inline && <button disabled={busy} className="bg-navy px-4 py-2.5 font-serif text-sm text-white disabled:opacity-60">{button}</button>}
      </div>
      {!inline && <button disabled={busy} className="mt-6 bg-navy px-8 py-3 text-[15px] uppercase text-white transition hover:bg-black disabled:opacity-60">{busy ? "Sending…" : button}</button>}
      {state.text && (
        <p role="status" className={`mt-2 text-sm ${state.type === "error" ? "text-red-600" : state.type === "ok" ? "text-emerald-700" : "text-slate"}`}>{state.text}</p>
      )}
    </form>
  );
}
