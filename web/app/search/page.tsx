"use client";

import { useEffect, useMemo, useState } from "react";

type SearchResult = {
  stored_filename: string;
  chunk_id: number;
  score: number;
  text: string;
};

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [k, setK] = useState(5);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiBase = useMemo(() => {
    return process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";
  }, []);

  async function runSearch() {
    const query = q.trim();
    if (!query) {
      setError("Type a query first");
      setResults([]);
      return;
    }

    const kk = Number.isFinite(k) ? Math.max(1, Math.min(50, k)) : 5;

    setError("");
    setLoading(true);

    try {
      const url = `${apiBase}/search?q=${encodeURIComponent(query)}&k=${kk}`;
      const res = await fetch(url);

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setResults(Array.isArray(data?.results) ? data.results : []);
    } catch (e: any) {
      setError(e?.message || "Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") runSearch();
  }

  useEffect(() => {}, []);

  return (
    <main style={{ padding: 18 }}>
      <div className="card">
        <div className="cardInner" style={{ display: "grid", gap: 12 }}>
          <div className="row">
            <div>
              <div className="h1">Search</div>
              <div className="subtle">Search your ingested notes</div>
            </div>

            <div className="badge">Results {results.length}</div>
          </div>

          <div
            style={{
              display: "grid",
              gap: 10,
              gridTemplateColumns: "1fr 140px 140px",
              alignItems: "center",
            }}
          >
            <input
              className="input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Try: aldol condensation"
            />

            <input
              className="input"
              type="number"
              value={k}
              min={1}
              max={50}
              onChange={(e) => setK(parseInt(e.target.value || "5", 10))}
            />

            <button type="button" onClick={runSearch} disabled={loading} className="btn btnPrimary">
              {loading ? "Searching" : "Search"}
            </button>
          </div>

          {error ? (
            <div className="card warnCard">
              <div className="cardInner" style={{ padding: 12 }}>
                <div style={{ fontWeight: 950 }}>Error</div>
                <div className="subtle" style={{ marginTop: 4, color: "var(--text)" }}>
                  {error}
                </div>
              </div>
            </div>
          ) : null}

          <div style={{ display: "grid", gap: 10 }}>
            {results.map((r, idx) => (
              <div key={`${r.stored_filename}:${r.chunk_id}:${idx}`} className="card">
                <div className="cardInner" style={{ padding: 12 }}>
                  <div className="row">
                    <div style={{ fontWeight: 950 }}>{r.stored_filename}</div>
                    <div className="subtle">
                      chunk {r.chunk_id} score {Math.round(r.score * 1000) / 1000}
                    </div>
                  </div>

                  <div style={{ marginTop: 8, fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>
                    {r.text}
                  </div>
                </div>
              </div>
            ))}

            {results.length === 0 && !loading ? (
              <div className="subtle">No results yet</div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
