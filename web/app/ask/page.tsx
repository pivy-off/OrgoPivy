"use client";

import { useMemo, useState } from "react";

type AskContext = {
  stored_filename?: string;
  chunk_id?: number;
  snippet?: string;
  text?: string;
};

type AskResponse = {
  answer?: string;
  contexts?: AskContext[];
};

export default function AskPage() {
  const apiBase = useMemo(() => {
    return process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
  }, []);

  const [question, setQuestion] = useState("");
  const [topK, setTopK] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [contexts, setContexts] = useState<AskContext[]>([]);
  const [error, setError] = useState("");

  async function onAsk(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setAnswer("");
    setContexts([]);

    const q = question.trim();
    if (!q) {
      setError("Enter a question");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, top_k: Number(topK) }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Ask failed ${res.status} ${text}`);
      }

      const data = (await res.json()) as AskResponse;

      setAnswer(data.answer || "");
      setContexts(Array.isArray(data.contexts) ? data.contexts : []);
    } catch (err: any) {
      setError(err?.message || "Ask failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24, fontFamily: "system-ui, Arial" }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Ask</h1>

      <form onSubmit={onAsk} style={{ display: "grid", gap: 12, marginTop: 16 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <div>Question</div>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={4}
            placeholder="Ask something about your ingested files"
            style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
          />
        </label>

        <label style={{ display: "grid", gap: 6, maxWidth: 200 }}>
          <div>Top K</div>
          <input
            type="number"
            min={1}
            max={20}
            value={topK}
            onChange={(e) => setTopK(Number(e.target.value))}
            style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #111",
            background: loading ? "#eee" : "#fff",
            cursor: loading ? "not-allowed" : "pointer",
            width: 140,
          }}
        >
          {loading ? "Asking" : "Ask"}
        </button>
      </form>

      {error ? <div style={{ marginTop: 16, color: "crimson" }}>{error}</div> : null}

      {answer ? (
        <section style={{ marginTop: 20 }}>
          <h2 style={{ fontSize: 20, marginBottom: 8 }}>Answer</h2>
          <div style={{ whiteSpace: "pre-wrap", padding: 12, borderRadius: 10, border: "1px solid #ddd" }}>
            {answer}
          </div>
        </section>
      ) : null}

      {contexts.length ? (
        <section style={{ marginTop: 20 }}>
          <h2 style={{ fontSize: 20, marginBottom: 8 }}>Sources</h2>
          <div style={{ display: "grid", gap: 10 }}>
            {contexts.map((c, i) => (
              <div key={i} style={{ padding: 12, borderRadius: 10, border: "1px solid #ddd" }}>
                <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>
                  {(c.stored_filename || "unknown file") + (typeof c.chunk_id === "number" ? `  chunk ${c.chunk_id}` : "")}
                </div>
                <div style={{ whiteSpace: "pre-wrap" }}>{c.snippet || c.text || ""}</div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
