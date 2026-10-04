import type { ReactNode } from "react";

const safeUrl = (u: string) => /^(https?:\/\/|\/(?!\/))/.test(u);

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
 * Tiny markdown subset: ## heading, > quote, - list, ![caption](url) image,
 * [text](url) link, blank-line paragraphs, **bold**, *italic*.
 */
export function Prose({ content }: { content: string }) {
  const blocks = content.replace(/\r\n/g, "\n").split(/\n{2,}/);
  return (
    <div className="prose-90s">
      {blocks.map((b, i) => {
        const t = b.trim();
        if (!t) return null;

        const img = t.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
        if (img && safeUrl(img[2])) {
          return (
            <figure key={i}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img[2]} alt={img[1]} loading="lazy" />
              {img[1] && <figcaption>{img[1]}</figcaption>}
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
