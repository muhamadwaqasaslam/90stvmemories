"use client";

import { useActionState } from "react";
import Link from "next/link";
import { save } from "../../actions";
import { THEMES } from "../../../../lib/themes";
import type { Post } from "../../../../lib/posts";

const input =
  "mt-1 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-base text-ink outline-none placeholder:text-ink/35 focus:border-pink";

export function EditorForm({ post }: { post?: Post }) {
  const [error, action, pending] = useActionState(save, null);

  return (
    <form action={action} className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
      <input type="hidden" name="id" value={post?.id ?? ""} />

      <div className="space-y-5">
        <label className="block text-sm font-semibold">
          Title
          <input name="title" required defaultValue={post?.title} placeholder="Saturday Morning Cartoons: …" className={`${input} text-lg`} />
        </label>
        <label className="block text-sm font-semibold">
          Article text
          <textarea
            name="content"
            required
            rows={22}
            defaultValue={post?.content}
            placeholder={"Write or paste your story here.\n\nLeave a blank line between paragraphs.\n\n## Add a heading like this"}
            className={`${input} font-mono text-lg leading-relaxed`}
          />
        </label>
        <p className="text-sm text-ink/45">
          Formatting: blank line = new paragraph · <code>## Heading</code> · <code>&gt; Quote</code> · <code>- List item</code> · <code>**bold**</code>
        </p>
      </div>

      <aside className="space-y-5 rounded-2xl pop bg-white p-5 lg:self-start">
        <label className="block text-sm font-semibold">
          Short summary (shows on cards &amp; Google)
          <textarea name="excerpt" rows={3} defaultValue={post?.excerpt} className={input} />
        </label>
        <label className="block text-sm font-semibold">
          Category
          <input name="category" defaultValue={post?.category ?? "Memories"} className={input} />
        </label>
        <label className="block text-sm font-semibold">
          Cover style
          <select name="theme" defaultValue={post?.theme ?? "sunset"} className={input}>
            {Object.entries(THEMES).map(([k, t]) => (
              <option key={k} value={k}>{t.emoji} {t.label}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Cover image URL (optional)
          <input name="imageUrl" type="url" defaultValue={post?.imageUrl} placeholder="https://…" className={input} />
        </label>
        <label className="block text-sm font-semibold">
          Page URL
          <input name="slug" defaultValue={post?.slug} placeholder="auto from title" className={input} />
        </label>
        <label className="block text-sm font-semibold">
          Status
          <select name="status" defaultValue={post?.status ?? "published"} className={input}>
            <option value="published">Published (live)</option>
            <option value="draft">Draft (hidden)</option>
          </select>
        </label>

        {error && <p role="alert" className="rounded-lg bg-pink/10 px-3 py-2 text-sm font-bold text-pink">{error}</p>}

        <button disabled={pending} className="pop pop-hover w-full rounded-full bg-pink px-6 py-3 font-semibold text-white disabled:opacity-60">
          {pending ? "Saving…" : "▶ Publish"}
        </button>
        <Link href="/admin/posts" className="block text-center text-sm font-bold text-ink/55 hover:text-ink">Cancel</Link>
      </aside>
    </form>
  );
}
