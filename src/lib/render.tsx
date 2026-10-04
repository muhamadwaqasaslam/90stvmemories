import type { ReactNode } from "react";

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>;
    return part;
  });
}

/** Tiny markdown subset: ## heading, > quote, - list, blank-line paragraphs, **bold**, *italic*. */
export function Prose({ content }: { content: string }) {
  const blocks = content.replace(/\r\n/g, "\n").split(/\n{2,}/);
  return (
    <div className="prose-90s">
      {blocks.map((b, i) => {
        const t = b.trim();
        if (!t) return null;
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
