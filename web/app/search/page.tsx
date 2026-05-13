"use client";

import Link from "next/link";
import { Suspense, useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  OpBadge,
  OpEmptyState,
  OpPanel,
  OpSearchResultCard,
  OpSpinner,
  OpContextBanner,
  ToolPageLayout,
} from "../components/op";
import { apiUrl } from "../lib/api";
import { highlightSnippet } from "../lib/highlight";
import { logActivity } from "../lib/activity";

type SearchHit = {
  upload_id?: string;
  stored_filename?: string;
  chunk_id?: number;
  score?: number;
  text?: string;
  meta?: { course?: string | null; topic?: string | null };
};

type SearchResponse = {
  q: string;
  k: number;
  results: SearchHit[];
  engine?: string;
};

const EXAMPLES = ["Grignard", "SN2 stereochemistry", "enolate alkylation", "Diels-Alder dienophile", "chemical shift aromatic"];

function SearchContent() {
  const sp = useSearchParams();
  const courseParam = sp.get("course") || "";
  const topicParam = sp.get("topic") || "";

  const [q, setQ] = useState(sp.get("q") || "");
  const [topK, setTopK] = useState(8);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [data, setData] = useState<SearchResponse | null>(null);

  const engineNote = useMemo(
    () =>
      data?.engine === "lexical"
        ? "Lexical keyword search. Semantic ranking can plug into the same UI when the API adds an engine field."
        : "",
    [data?.engine]
  );

  const runSearch = useCallback(async () => {
    const query = q.trim();
    if (!query) {
      setErr("Enter a search query");
      return;
    }
    setErr("");
    setLoading(true);
    setData(null);
    try {
      const params = new URLSearchParams();
      params.set("q", query);
      params.set("k", String(topK));
      if (courseParam) params.set("course", courseParam);
      if (topicParam) params.set("topic", topicParam);
      const res = await fetch(apiUrl(`/search?${params.toString()}`), { cache: "no-store" });
      if (!res.ok) throw new Error(await res.text());
      const json = (await res.json()) as SearchResponse;
      setData(json);
      logActivity({
        kind: "search",
        label: `Search: ${query.slice(0, 48)}`,
        detail: `${json.results?.length ?? 0} hits`,
        href: `/search?q=${encodeURIComponent(query)}`,
      });
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }, [q, topK, courseParam, topicParam]);

  return (
    <ToolPageLayout
      eyebrow="Study OS"
      title="Search your library"
      subtitle="Lexical search across ingested note chunks. Upload .txt notes, run ingest, then search terms from your materials."
      actions={
        <Link className="btn" href="/uploads">
          Uploads
        </Link>
      }
    >
      {(courseParam || topicParam) && (
        <OpContextBanner
          title={`Scoped: ${courseParam || "all courses"}${topicParam ? ` · ${topicParam}` : ""}`}
        >
          Results filter to this scope when your notes include matching metadata.
        </OpContextBanner>
      )}

      <OpPanel title="Query">
        <label className="opFieldLabel" htmlFor="search-q">
          Keywords
        </label>
        <textarea
          id="search-q"
          className="opTextarea"
          rows={3}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="e.g. LDA enolate, epoxide opening, DEPT 13C"
          disabled={loading}
        />
        <div className="opFieldRow">
          <label className="subtle" style={{ display: "flex", gap: 8, alignItems: "center" }}>
            Max results
            <input
              className="input"
              type="number"
              min={1}
              max={50}
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              style={{ width: 72 }}
              disabled={loading}
            />
          </label>
          <button type="button" className="btn btnPrimary" onClick={() => void runSearch()} disabled={loading}>
            {loading ? "Searching…" : "Search"}
          </button>
        </div>
        {engineNote ? <div className="subtle" style={{ fontSize: 12 }}>{engineNote}</div> : null}
      </OpPanel>

      {err ? (
        <OpPanel title="Could not search" variant="muted">
          <div style={{ color: "var(--red)", fontWeight: 700 }}>{err}</div>
        </OpPanel>
      ) : null}

      {loading ? <OpSpinner label="Searching your indexed notes…" /> : null}

      {!loading && data && data.results.length === 0 ? (
        <OpEmptyState
          title="No matches yet"
          description="Try another phrase, widen scope, or upload and ingest a .txt note that contains those terms."
        >
          <div className="subtle" style={{ fontSize: 13 }}>
            Example queries:
            <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
              {EXAMPLES.map((ex) => (
                <li key={ex}>
                  <button type="button" className="btn" style={{ marginTop: 4 }} onClick={() => setQ(ex)}>
                    {ex}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </OpEmptyState>
      ) : null}

      {!loading && data && data.results.length > 0 ? (
        <OpPanel title={`Results (${data.results.length})`} right={data.engine ? <OpBadge tone="info">{data.engine}</OpBadge> : null}>
          <div style={{ display: "grid", gap: 12 }}>
            {data.results.map((r, i) => {
              const fname = r.stored_filename || r.upload_id || "file";
              const snippet = highlightSnippet((r.text || "").slice(0, 520), data.q);
              return (
                <OpSearchResultCard
                  key={`${fname}-${r.chunk_id}-${i}`}
                  metaLeft={
                    <>
                      {fname}
                      {typeof r.chunk_id === "number" ? ` · chunk ${r.chunk_id}` : ""}
                    </>
                  }
                  metaRight={typeof r.score === "number" ? <OpBadge tone="neutral">score {r.score}</OpBadge> : null}
                  snippet={snippet}
                  footer={
                    r.meta?.course || r.meta?.topic ? (
                      <span className="subtle">
                        {[r.meta?.course, r.meta?.topic].filter(Boolean).join(" · ")}
                      </span>
                    ) : null
                  }
                />
              );
            })}
          </div>
        </OpPanel>
      ) : null}
    </ToolPageLayout>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <ToolPageLayout title="Search" subtitle="Loading…">
          <OpSpinner />
        </ToolPageLayout>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
