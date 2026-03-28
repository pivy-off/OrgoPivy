import type { ReactNode } from "react";

/**
 * Highlights whitespace-separated query terms in text (lexical / keyword style).
 * Prepared for future semantic snippets that may carry pre-ranked spans.
 */
export function highlightSnippet(text: string, query: string): ReactNode {
  const t = (text || "").trim();
  const q = (query || "").trim();
  if (!t) return null;
  if (!q) return t;

  const terms = Array.from(
    new Set(
      q
        .toLowerCase()
        .split(/\s+/)
        .map((s) => s.replace(/[^\w.-]/g, ""))
        .filter((s) => s.length >= 2)
    )
  );
  if (!terms.length) return t;

  const pattern = new RegExp(
    `(${terms.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "gi"
  );

  const parts: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  const re = new RegExp(pattern.source, pattern.flags);
  while ((m = re.exec(t)) !== null) {
    if (m.index > last) parts.push(t.slice(last, m.index));
    parts.push(
      <mark key={`${m.index}-${m[0]}`} className="opHighlight">
        {m[0]}
      </mark>
    );
    last = m.index + m[0].length;
  }
  if (last < t.length) parts.push(t.slice(last));
  return parts.length ? <>{parts}</> : t;
}
