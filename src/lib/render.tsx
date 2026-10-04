import type { ReactNode } from "react";

const safeUrl = (u: string) => /^(https?:\/\/|\/(?!\/))/.test(u);

export const VIDEO_RE = /\.(mp4|webm|mov|m4v|ogv)(\?.*)?$/i;
export const MEDIA_RE = /^!\[([^\]]*)\]\(([^)\s]+)\)(?:\{([^}]*)\})?$/;

export type Align = "left" | "center" | "right";

/** Parses the `{w=60 align=left}` suffix of an image/video line. */
export function parseMediaAttrs(s?: string): { w: number; align: Align } {
  const out: { w: number; align: Align } = { w: 100, align: "center" };
  for (const m of (s ?? "").matchAll(/(\w+)=(\w+)/g)) {
    if (m[1] === "w") out.w = Math.min(100, Math.max(10, Number(m[2]) || 100));
    if (m[1] === "align" && (m[2] === "left" || m[2] === "center" || m[2] === "right")) out.align = m[2];
  }
  return out;
}

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>;
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link && safeUrl(link[2])) {
      const external = link[2].startsWith("http");
      return (
        <a key={i} href={link[2]} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {link[1]}
        </a>
      );
    }
    return part;
  });
}

/**
 * Tiny markdown subset: ## heading, > quote, - list, blank-line paragraphs, **bold**, *italic*, [text](url).
 * Media (image or video) on its own line: ![caption](url){w=60 align=center}
 */
export function Prose({ content }: { content: string }) {
  const blocks = content.replace(/\r\n/g, "\n").split(/\n{2,}/);
  return (
    <div className="prose-90s">
      {blocks.map((b, i) => {
        const t = b.trim();
        if (!t) return null;

        const media = t.match(MEDIA_RE);
        if (media && safeUrl(media[2])) {
          const { w, align } = parseMediaAttrs(media[3]);
          return (
            <figure key={i} className={`media media-${align}`} style={{ width: `${w}%` }}>
              {VIDEO_RE.test(media[2]) ? (
                <video src={media[2]} controls playsInline preload="metadata" aria-label={media[1] || undefined} />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={media[2]} alt={media[1]} loading="lazy" />
              )}
              {media[1] && <figcaption>{media[1]}</figcaption>}
            </figure>
          );
        }
        if (t.startsWith("## ")) return <h2 key={i}>{inline(t.slice(3))}</h2>;
        if (t.startsWith("### ")) return <h3 key={i}>{inline(t.slice(4))}</h3>;
        if (t.startsWith("> ")) return <blockquote key={i}>{inline(t.replace(/^> ?/gm, " ").trim())}</blockquote>;
        if (/^[-*] /.test(t))
          return (
            <ul key={i}>
              {t.split("\n").map((l, j) => (
                <li key={j}>{inline(l.replace(/^[-*] /, ""))}</li>
              ))}
            </ul>
          );
        return <p key={i}>{inline(t)}</p>;
      })}
    </div>
  );
}
