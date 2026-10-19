"use client";

import { useActionState, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { save } from "../../actions";
import { THEMES } from "../../../../lib/themes";
import type { Post } from "../../../../lib/posts";
import { MEDIA_RE, Prose, VIDEO_RE, parseMediaAttrs, type Align } from "../../../../lib/render";

const input =
  "mt-1 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-base text-ink outline-none placeholder:text-ink/35 focus:border-pink";
const btn = "min-h-10 min-w-10 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-ink/70 transition hover:bg-ink/5 hover:text-ink";

interface MediaItem {
  url: string;
  name: string;
  video: boolean;
}
interface UploadJob {
  id: number;
  name: string;
  progress: number;
  error?: string;
}

const safeName = (n: string) => n.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(-80);

async function uploadFile(file: File, blob: boolean, onProgress: (p: number) => void): Promise<string> {
  const isVideo = file.type.startsWith("video/");
  if (!file.type.startsWith("image/") && !isVideo) throw new Error("Only images and videos can be uploaded.");

  if (blob) {
    const { upload } = await import("@vercel/blob/client");
    const res = await upload(`uploads/${safeName(file.name)}`, file, {
      access: "public",
      handleUploadUrl: "/api/admin/upload",
      multipart: file.size > 8 * 1024 * 1024,
      onUploadProgress: ({ percentage }) => onProgress(percentage),
    });
    return res.url;
  }

  const fd = new FormData();
  fd.append("file", file);
  const r = await fetch("/api/admin/upload-local", { method: "POST", body: fd });
  const data = (await r.json().catch(() => ({}))) as { url?: string; error?: string };
  if (!r.ok || !data.url) throw new Error(data.error ?? "Upload failed");
  onProgress(100);
  return data.url;
}

export function EditorForm({ post, blobEnabled }: { post?: Post; blobEnabled: boolean }) {
  const [error, action, pending] = useActionState(save, null);

  const [title, setTitle] = useState(post?.title ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [tags, setTags] = useState(post?.tags?.join(", ") ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [sel, setSel] = useState({ start: 0, end: 0 });
  const [jobs, setJobs] = useState<UploadJob[]>([]);
  const [library, setLibrary] = useState<MediaItem[]>([]);
  const [libOpen, setLibOpen] = useState(false);
  const [libLoaded, setLibLoaded] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [cover, setCover] = useState(post?.imageUrl ?? "");
  const [coverBusy, setCoverBusy] = useState(false);
  const [coverErr, setCoverErr] = useState("");

  const ta = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const jobId = useRef(0);
  const pendingSel = useRef<{ start: number; end: number; boxTop: number; pageTop: number } | null>(null);

  /* Restore caret and scroll positions after React re-renders the controlled textarea. */
  useLayoutEffect(() => {
    const p = pendingSel.current;
    const el = ta.current;
    if (!p || !el) return;
    pendingSel.current = null;
    /* Don't steal focus from the caption box while someone is typing in it. */
    if (document.activeElement?.tagName !== "INPUT") {
      el.focus({ preventScroll: true });
      el.setSelectionRange(p.start, p.end);
    }
    el.scrollTop = p.boxTop;
    window.scrollTo(window.scrollX, p.pageTop);
    setSel({ start: p.start, end: p.end });
  }, [content]);

  const readSel = () => {
    const el = ta.current;
    if (el) setSel({ start: el.selectionStart, end: el.selectionEnd });
  };

  /* The textarea knows the true selection; state can lag a click behind. */
  const liveSel = () => {
    const el = ta.current;
    return el ? { start: el.selectionStart, end: el.selectionEnd } : sel;
  };

  function apply(value: string, start: number, end = start) {
    pendingSel.current = { start, end, boxTop: ta.current?.scrollTop ?? 0, pageTop: window.scrollY };
    setContent(value);
  }

  /* ---------- text formatting ---------- */
  function wrap(before: string, after: string, placeholder: string) {
    const { start, end } = liveSel();
    const chosen = content.slice(start, end) || placeholder;
    const next = content.slice(0, start) + before + chosen + after + content.slice(end);
    apply(next, start + before.length, start + before.length + chosen.length);
  }

  function lineBlock(prefix: string, perLine: boolean) {
    const { start, end } = liveSel();
    const ls = content.lastIndexOf("\n", start - 1) + 1;
    let le = content.indexOf("\n", end);
    if (le === -1) le = content.length;
    const lines = content.slice(ls, le).split("\n");
    const strip = (l: string) => l.replace(/^(#{1,3} |> |[-*] )/, "");
    const body = perLine ? lines.map((l) => prefix + strip(l)).join("\n") : prefix + strip(lines.join(" "));
    let before = content.slice(0, ls);
    let after = content.slice(le);
    if (before && !before.endsWith("\n\n")) before += before.endsWith("\n") ? "\n" : "\n\n";
    if (after && !after.startsWith("\n\n")) after = "\n" + after;
    apply(before + body + after, before.length + body.length);
  }

  function addLink() {
    const { start, end } = liveSel();
    const url = window.prompt("Link address (https://…)");
    if (!url) return;
    const text = content.slice(start, end) || "link text";
    const md = `[${text}](${url})`;
    apply(content.slice(0, start) + md + content.slice(end), start + md.length);
  }

  /* ---------- media ---------- */
  async function uploadMany(files: FileList | File[]) {
    for (const file of Array.from(files)) {
      const id = ++jobId.current;
      setJobs((j) => [...j, { id, name: file.name, progress: 0 }]);
      try {
        const url = await uploadFile(file, blobEnabled, (p) =>
          setJobs((j) => j.map((x) => (x.id === id ? { ...x, progress: p } : x))),
        );
        setLibrary((l) => [{ url, name: file.name, video: file.type.startsWith("video/") }, ...l]);
        insertMediaLatest(url);
        setJobs((j) => j.filter((x) => x.id !== id));
      } catch (e) {
        setJobs((j) => j.map((x) => (x.id === id ? { ...x, error: (e as Error).message } : x)));
      }
    }
  }

  /* Uploads finish asynchronously, so insert against the latest text, not a stale closure. */
  const latest = useRef({ content, sel });
  latest.current = { content, sel };
  function insertMediaLatest(url: string) {
    const { content: c, sel: s } = latest.current;
    const md = `![](${url}){w=100 align=center}`;
    let pos = c.indexOf("\n", s.end);
    if (pos === -1) pos = c.length;
    const before = c.slice(0, pos).replace(/\s+$/, "");
    const after = c.slice(pos).replace(/^\s+/, "");
    const head = before ? before + "\n\n" : "";
    const next = head + md + (after ? "\n\n" + after : "\n");
    latest.current = { content: next, sel: { start: head.length + 2, end: head.length + 2 } };
    apply(next, head.length + 2);
  }

  async function openLibrary() {
    setLibOpen((o) => !o);
    if (libLoaded) return;
    try {
      const r = await fetch("/api/admin/media");
      const data = (await r.json()) as { items?: MediaItem[] };
      setLibrary((l) => [...l, ...(data.items ?? []).filter((i) => !l.some((x) => x.url === i.url))]);
    } catch {
      /* library is optional */
    }
    setLibLoaded(true);
  }

  async function uploadCover(file?: File) {
    if (!file) return;
    setCoverErr("");
    setCoverBusy(true);
    try {
      if (!file.type.startsWith("image/")) throw new Error("Cover must be an image.");
      setCover(await uploadFile(file, blobEnabled, () => {}));
    } catch (e) {
      setCoverErr((e as Error).message);
    }
    setCoverBusy(false);
  }

  /* ---------- the media line under the caret ---------- */
  const ls = content.lastIndexOf("\n", sel.start - 1) + 1;
  let le = content.indexOf("\n", sel.start);
  if (le === -1) le = content.length;
  const line = content.slice(ls, le).trim();
  const m = line.match(MEDIA_RE);
  const media = m ? { alt: m[1], url: m[2], ...parseMediaAttrs(m[3]), video: VIDEO_RE.test(m[2]) } : null;

  function patchMedia(p: Partial<{ alt: string; w: number; align: Align }>) {
    if (!media) return;
    const n = { ...media, ...p };
    const md = `![${n.alt.replace(/[[\]\n]/g, "")}](${n.url}){w=${n.w} align=${n.align}}`;
    apply(content.slice(0, ls) + md + content.slice(le), ls + 1);
  }
  function removeMedia() {
    const rest = (content.slice(0, ls) + content.slice(le)).replace(/\n{3,}/g, "\n\n");
    apply(rest, Math.max(0, ls - 1));
  }

  // Real-time On-Page SEO calculation
  const titleLen = title.trim().length;
  const excerptLen = excerpt.trim().length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const parsedTags = tags.split(",").map((t) => t.trim()).filter(Boolean);
  const hasHeadings = /^(##|###)\s+/m.test(content);
  const hasCover = Boolean(cover);

  const checks = [
    {
      label: "Title Length",
      ideal: "40–65 chars",
      current: `${titleLen} chars`,
      ok: titleLen >= 40 && titleLen <= 65,
      warn: titleLen > 0 && (titleLen < 40 || titleLen > 65),
      note: titleLen === 0 ? "Missing title" : titleLen < 40 ? "A bit short" : titleLen > 65 ? "May truncate on Google" : "Ideal for SEO",
      points: titleLen >= 40 && titleLen <= 65 ? 20 : titleLen > 0 ? 10 : 0,
    },
    {
      label: "Meta Excerpt",
      ideal: "120–160 chars",
      current: `${excerptLen} chars`,
      ok: excerptLen >= 120 && excerptLen <= 160,
      warn: excerptLen > 0 && (excerptLen < 120 || excerptLen > 160),
      note: excerptLen === 0 ? "Empty snippet" : excerptLen < 120 ? "Short snippet" : excerptLen > 160 ? "May get trimmed" : "Optimal snippet",
      points: excerptLen >= 120 && excerptLen <= 160 ? 20 : excerptLen > 0 ? 10 : 0,
    },
    {
      label: "Keywords / Tags",
      ideal: "3–6 tags",
      current: `${parsedTags.length} tags`,
      ok: parsedTags.length >= 3,
      warn: parsedTags.length > 0 && parsedTags.length < 3,
      note: parsedTags.length === 0 ? "No tags added" : parsedTags.length < 3 ? "Add 1–2 more" : "Great keyword targeting",
      points: parsedTags.length >= 3 ? 20 : parsedTags.length > 0 ? 10 : 0,
    },
    {
      label: "Word Count",
      ideal: "600+ words",
      current: `${wordCount} words`,
      ok: wordCount >= 600,
      warn: wordCount >= 300 && wordCount < 600,
      note: wordCount === 0 ? "No content" : wordCount < 300 ? "Thin content" : wordCount < 600 ? "Decent, 600+ recommended" : "Great content depth",
      points: wordCount >= 600 ? 20 : wordCount >= 300 ? 12 : wordCount > 0 ? 5 : 0,
    },
    {
      label: "Subheadings",
      ideal: "H2/H3 in text",
      current: hasHeadings ? "Yes" : "None",
      ok: hasHeadings,
      warn: !hasHeadings && wordCount > 150,
      note: hasHeadings ? "Good structure" : "Add ## headings",
      points: hasHeadings ? 10 : 0,
    },
    {
      label: "Cover Image",
      ideal: "Required",
      current: hasCover ? "Set" : "None",
      ok: hasCover,
      warn: !hasCover,
      note: hasCover ? "Visual set" : "Missing cover",
      points: hasCover ? 10 : 0,
    },
  ];

  const totalScore = Math.min(100, checks.reduce((acc, c) => acc + c.points, 0));
  const scoreBadge =
    totalScore >= 80 ? "Good" : totalScore >= 50 ? "Fair" : "Needs Work";

  return (
    <form action={action} className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <input type="hidden" name="id" value={post?.id ?? ""} />

      <div className="min-w-0 space-y-5">
        <label className="block text-sm font-semibold">
          <div className="flex items-center justify-between">
            <span>Title</span>
            <span className={`text-xs font-normal ${titleLen >= 40 && titleLen <= 65 ? "font-bold text-emerald-600" : "text-ink/45"}`}>
              {titleLen}/65 chars {titleLen >= 40 && titleLen <= 65 ? "✓" : ""}
            </span>
          </div>
          <input
            name="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Saturday Morning Cartoons: …"
            className={`${input} text-lg`}
          />
        </label>

        <div
          className={`rounded-2xl border bg-white transition ${dragging ? "border-pink ring-4 ring-pink/10" : "border-ink/15"}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            if (e.dataTransfer.files.length) void uploadMany(e.dataTransfer.files);
          }}
        >
          {/* tabs + toolbar */}
          <div className="flex flex-wrap items-center gap-1 border-b border-ink/10 px-3 py-2">
            <div className="mr-2 flex rounded-full bg-ink/5 p-0.5 text-sm font-semibold">
              {(["write", "preview"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`rounded-full px-3.5 py-1 capitalize ${tab === t ? "bg-white text-ink shadow-sm" : "text-ink/55"}`}
                >
                  {t}
                </button>
              ))}
            </div>
            {tab === "write" && (
              <div
                className="contents"
                onMouseDown={(e) => { if ((e.target as HTMLElement).closest("button")) e.preventDefault(); }}
              >
                <button type="button" className={btn} title="Bold" aria-label="Bold" onClick={() => wrap("**", "**", "bold text")}><b>B</b></button>
                <button type="button" className={btn} title="Italic" aria-label="Italic" onClick={() => wrap("*", "*", "italic text")}><i>I</i></button>
                <button type="button" className={btn} title="Heading" aria-label="Heading" onClick={() => lineBlock("## ", false)}>H2</button>
                <button type="button" className={btn} title="Sub-heading" aria-label="Sub-heading" onClick={() => lineBlock("### ", false)}>H3</button>
                <button type="button" className={btn} title="Quote" aria-label="Quote" onClick={() => lineBlock("> ", false)}>❝</button>
                <button type="button" className={btn} title="Bulleted list" aria-label="Bulleted list" onClick={() => lineBlock("- ", true)}>• List</button>
                <button type="button" className={btn} title="Link" aria-label="Link" onClick={addLink}>🔗</button>
                <span className="mx-1 h-5 w-px bg-ink/10" />
                <button type="button" className="rounded-lg bg-pink px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-pink/90" onClick={() => fileRef.current?.click()}>
                  ＋ Image / Video
                </button>
                <button type="button" className={btn} onClick={openLibrary} aria-expanded={libOpen}>🗂 Library</button>
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  accept="image/*,video/mp4,video/webm,video/quicktime"
                  className="sr-only"
                  onChange={(e) => {
                    if (e.target.files?.length) void uploadMany(e.target.files);
                    e.target.value = "";
                  }}
                />
              </div>
            )}
          </div>

          {/* upload progress */}
          {jobs.length > 0 && (
            <ul className="space-y-2 border-b border-ink/10 px-4 py-3 text-sm">
              {jobs.map((j) => (
                <li key={j.id}>
                  <div className="flex justify-between gap-3">
                    <span className="truncate font-medium">{j.name}</span>
                    {j.error ? (
                      <button type="button" className="shrink-0 font-semibold text-pink" onClick={() => setJobs((x) => x.filter((y) => y.id !== j.id))}>
                        Dismiss
                      </button>
                    ) : (
                      <span className="shrink-0 tabular-nums text-ink/55">{Math.round(j.progress)}%</span>
                    )}
                  </div>
                  {j.error ? (
                    <p className="mt-1 text-pink">{j.error}</p>
                  ) : (
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink/10">
                      <div className="h-full rounded-full bg-pink transition-all" style={{ width: `${j.progress}%` }} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* media library */}
          {libOpen && tab === "write" && (
            <div className="border-b border-ink/10 bg-paper/60 px-4 py-3">
              <p className="mb-2 text-sm font-semibold">Your uploads <span className="font-normal text-ink/50">· click to insert at the cursor</span></p>
              {library.length === 0 ? (
                <p className="text-sm text-ink/55">Nothing uploaded yet. Use “＋ Image / Video” or drop files here.</p>
              ) : (
                <ul className="grid max-h-56 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-5">
                  {library.map((i) => (
                    <li key={i.url}>
                      <button type="button" onClick={() => insertMediaLatest(i.url)} title={i.name} className="group relative block aspect-square w-full overflow-hidden rounded-lg bg-ink/10 ring-pink transition hover:ring-2">
                        {i.video ? (
                          <video src={i.url} muted preload="metadata" className="h-full w-full object-cover" />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={i.url} alt={i.name} className="h-full w-full object-cover" loading="lazy" />
                        )}
                        {i.video && <span className="absolute inset-0 grid place-items-center text-2xl text-white drop-shadow">▶</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* settings for the image/video the caret is on */}
          {media && tab === "write" && (
            <div className="grid gap-4 border-b border-ink/10 bg-pink/5 px-4 py-4 sm:grid-cols-[88px_1fr]">
              <div className="h-[88px] w-[88px] overflow-hidden rounded-xl bg-ink/10">
                {media.video ? (
                  <video src={media.url} muted preload="metadata" className="h-full w-full object-cover" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={media.url} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="space-y-3">
                <p className="text-sm font-semibold">
                  {media.video ? "Video" : "Image"} settings <span className="font-normal text-ink/50">· changes apply to the selected line</span>
                </p>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                  <label className="flex items-center gap-3 text-sm font-medium">
                    Size
                    <input
                      type="range"
                      min={10}
                      max={100}
                      step={5}
                      value={media.w}
                      onChange={(e) => patchMedia({ w: Number(e.target.value) })}
                      className="w-40 accent-pink"
                      aria-label="Width in percent"
                    />
                    <span className="w-10 tabular-nums text-ink/60">{media.w}%</span>
                  </label>
                  <div className="flex gap-1">
                    {[25, 50, 75, 100].map((w) => (
                      <button key={w} type="button" onClick={() => patchMedia({ w })} className={`rounded-md px-2 py-1 text-xs font-semibold ${media.w === w ? "bg-ink text-white" : "bg-white ring-1 ring-ink/15 hover:bg-ink/5"}`}>
                        {w}%
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-1" role="group" aria-label="Alignment">
                    {(["left", "center", "right"] as const).map((a) => (
                      <button key={a} type="button" onClick={() => patchMedia({ align: a })} aria-pressed={media.align === a} className={`rounded-md px-2.5 py-1 text-xs font-semibold capitalize ${media.align === a ? "bg-ink text-white" : "bg-white ring-1 ring-ink/15 hover:bg-ink/5"}`}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <input value={media.alt} onChange={(e) => patchMedia({ alt: e.target.value })} placeholder="Caption (optional)" className="min-w-0 flex-1 rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-pink" />
                  <button type="button" onClick={removeMedia} className="shrink-0 rounded-lg border border-pink/50 px-3 py-2 text-sm font-semibold text-pink hover:bg-pink hover:text-white">
                    Remove
                  </button>
                </div>
                <p className="text-xs text-ink/50">On phones, media always fills the column.</p>
              </div>
            </div>
          )}

          <textarea
            ref={ta}
            name="content"
            required
            rows={16}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setSel({ start: e.target.selectionStart, end: e.target.selectionEnd });
            }}
            onSelect={readSel}
            onKeyUp={readSel}
            onClick={readSel}
            placeholder={"Write your story here.\n\nLeave a blank line between paragraphs.\nDrop images or videos anywhere in this box to upload them."}
            className={`${tab === "write" ? "block" : "hidden"} w-full min-h-[50vh] resize-y rounded-b-2xl bg-white px-4 py-4 text-base sm:px-5 sm:text-lg leading-relaxed text-ink outline-none placeholder:text-ink/35`}
          />
          {tab === "preview" && (
            <div className="min-h-64 px-4 py-6 sm:px-5">
              {content.trim() ? <Prose content={content} /> : <p className="text-ink/50">Nothing to preview yet.</p>}
            </div>
          )}
        </div>

        <p className="text-sm text-ink/45">
          Tip: click an image or video line to resize, align or caption it. A blank line starts a new paragraph.
        </p>
      </div>

      <aside className="space-y-5 rounded-2xl pop bg-white p-5 lg:self-start">
        <label className="block text-sm font-semibold">
          <div className="flex items-center justify-between">
            <span>Short summary (shows on cards &amp; Google)</span>
            <span className={`text-xs font-normal ${excerptLen >= 120 && excerptLen <= 160 ? "font-bold text-emerald-600" : "text-ink/45"}`}>
              {excerptLen}/160 {excerptLen >= 120 && excerptLen <= 160 ? "✓" : ""}
            </span>
          </div>
          <textarea
            name="excerpt"
            rows={3}
            maxLength={300}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className={input}
          />
          <span className="mt-1 block text-xs font-normal text-ink/50">SEO tip: aim for 120–160 characters and include the show name.</span>
        </label>

        <label className="block text-sm font-semibold">
          <div className="flex items-center justify-between">
            <span>Keywords &amp; Tags</span>
            <span className={`text-xs font-normal ${parsedTags.length >= 3 ? "font-bold text-emerald-600" : "text-ink/45"}`}>
              {parsedTags.length} tags {parsedTags.length >= 3 ? "✓" : ""}
            </span>
          </div>
          <input
            name="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. 90s TV, Sitcoms, Friends, Rachel Green"
            className={input}
          />
          <span className="mt-1 block text-xs font-normal text-ink/50">Comma-separated. Focus keywords help your article rank on search engines.</span>
        </label>

        <label className="block text-sm font-semibold">
          Category
          <input name="category" defaultValue={post?.category ?? "Memories"} className={input} />
        </label>

        <div className="text-sm font-semibold">
          Cover image
          {cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt="Cover preview" className="mt-2 aspect-[16/10] w-full rounded-xl object-cover ring-1 ring-ink/10" />
          )}
          <input type="hidden" name="imageUrl" value={cover} />
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="button" disabled={coverBusy} onClick={() => coverRef.current?.click()} className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink disabled:opacity-60">
              {coverBusy ? "Uploading…" : cover ? "Change" : "Upload cover"}
            </button>
            {cover && (
              <button type="button" onClick={() => setCover("")} className="rounded-full px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-600/10">
                Remove
              </button>
            )}
          </div>
          <input ref={coverRef} type="file" accept="image/*" className="sr-only" onChange={(e) => { void uploadCover(e.target.files?.[0]); e.target.value = ""; }} />
          {coverErr && <p className="mt-2 text-pink">{coverErr}</p>}
          <p className="mt-2 text-xs font-normal text-ink/50">Without one, the coloured cover style below is used.</p>
        </div>

        <label className="block text-sm font-semibold">
          Cover style
          <select name="theme" defaultValue={post?.theme ?? "sunset"} className={input}>
            {Object.entries(THEMES).map(([k, t]) => (
              <option key={k} value={k}>{t.emoji} {t.label}</option>
            ))}
          </select>
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

        {/* On-Page SEO Status */}
        <div className="rounded-2xl border-2 border-ink/10 bg-paper/60 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">On-Page SEO Status</span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                totalScore >= 80 ? "bg-emerald-100 text-emerald-800" : totalScore >= 50 ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"
              }`}
            >
              {totalScore}/100 · {scoreBadge}
            </span>
          </div>

          <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-ink/10">
            <div
              className={`h-full transition-all duration-300 ${
                totalScore >= 80 ? "bg-emerald-500" : totalScore >= 50 ? "bg-amber-500" : "bg-rose-500"
              }`}
              style={{ width: `${totalScore}%` }}
            />
          </div>

          <ul className="mt-3.5 space-y-2 text-xs">
            {checks.map((c) => (
              <li key={c.label} className="flex items-center justify-between gap-2 border-b border-ink/5 pb-1 last:border-0 last:pb-0">
                <span className="text-ink/75 font-medium">{c.label}</span>
                <span className="flex items-center gap-1.5 font-semibold">
                  <span className="text-ink/50">{c.current}</span>
                  {c.ok ? (
                    <span className="text-emerald-600" title={c.note}>✓</span>
                  ) : c.warn ? (
                    <span className="text-amber-600" title={c.note}>⚠</span>
                  ) : (
                    <span className="text-rose-600" title={c.note}>✕</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {error && <p role="alert" className="rounded-lg bg-pink/10 px-3 py-2 text-sm font-bold text-pink">{error}</p>}

        <button disabled={pending || jobs.some((j) => !j.error)} className="pop pop-hover w-full rounded-full bg-pink px-6 py-3 font-semibold text-white disabled:opacity-60">
          {pending ? "Saving…" : jobs.some((j) => !j.error) ? "Uploading…" : "▶ Publish"}
        </button>
        <Link href="/admin/posts" className="block text-center text-sm font-bold text-ink/55 hover:text-ink">Cancel</Link>
      </aside>
    </form>
  );
}
