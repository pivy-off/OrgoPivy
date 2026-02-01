"use client";

import { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

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

function AskPageContent() {
  const searchParams = useSearchParams();
  const courseParam = searchParams?.get("course") || "";
  const topicParam = searchParams?.get("topic") || "";

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
      setError("Please enter a question");
      return;
    }

    setLoading(true);
    try {
      const body: any = { question: q, top_k: Number(topK) };
      if (courseParam) body.course = courseParam;
      if (topicParam) body.topic = topicParam;

      const res = await fetch(`${apiBase}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }}>
      <div className="card">
        <div className="cardInner">
          <div className="stack">
            <div>
              <div className="h1">Ask Questions</div>
              <div className="subtle" style={{ marginTop: 8, fontSize: 15, lineHeight: 1.6 }}>
                Ask questions about your uploaded notes. The AI will search through your documents and provide answers with source references.
              </div>
            </div>

            {(courseParam || topicParam) && (
              <div style={{
                padding: 12,
                background: "rgba(0, 122, 255, 0.06)",
                borderRadius: 12,
                border: "1px solid rgba(0, 122, 255, 0.2)",
                fontSize: 14
              }}>
                <div style={{ fontWeight: 600, marginBottom: 4, color: "#007AFF" }}>
                  Context: {courseParam ? courseParam.replace("orgochem-", "OrgoChem ").replace("-", " ").toUpperCase() : ""} 
                  {topicParam ? ` • ${topicParam.charAt(0).toUpperCase() + topicParam.slice(1).replace(/-/g, " ")}` : ""}
                </div>
                <div style={{ color: "var(--muted)", fontSize: 13 }}>
                  Your questions will be focused on this {courseParam ? "course" : ""} {topicParam ? "and topic" : ""}.
                </div>
              </div>
            )}

            <div style={{
              padding: 20,
              background: "var(--panel-2)",
              borderRadius: 16,
              border: "1px solid var(--border)"
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "var(--text)" }}>
                How to use:
              </div>
              <ul style={{ 
                margin: 0, 
                paddingLeft: 20, 
                fontSize: 14, 
                lineHeight: 1.8, 
                color: "var(--muted)",
                listStyle: "disc"
              }}>
                <li>Upload your notes first using the Upload page</li>
                <li>Ask specific questions about concepts, reactions, or mechanisms</li>
                <li>The AI searches through your uploaded documents to find relevant information</li>
                <li>Answers include source references so you can verify the information</li>
                <li>Use topic-specific questions for better, focused answers</li>
              </ul>
            </div>

            <form onSubmit={onAsk} style={{ display: "grid", gap: 16, marginTop: 8 }}>
              <label style={{ display: "grid", gap: 8 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>Your Question</div>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={5}
                  placeholder="Example: What is the mechanism for SN2 reactions? How does stereochemistry work in alkene additions?"
                  style={{ 
                    width: "100%", 
                    padding: 16, 
                    borderRadius: 12, 
                    border: "1px solid var(--border)",
                    fontFamily: "inherit",
                    fontSize: 15,
                    lineHeight: 1.6,
                    resize: "vertical",
                    background: "var(--panel)"
                  }}
                  disabled={loading}
                />
              </label>

              <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ fontSize: 14, color: "var(--muted)" }}>Top K:</div>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={topK}
                    onChange={(e) => setTopK(Number(e.target.value))}
                    style={{ 
                      padding: "8px 12px", 
                      borderRadius: 8, 
                      border: "1px solid var(--border)",
                      width: 80,
                      fontSize: 14
                    }}
                    disabled={loading}
                  />
                  <div style={{ fontSize: 12, color: "var(--muted-2)" }}>
                    (number of source chunks to search)
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={loading || !question.trim()}
                  className="btn btnPrimary"
                  style={{ minWidth: 120 }}
                >
                  {loading ? "Searching..." : "Ask Question"}
                </button>
              </div>
            </form>

            {error ? (
              <div className="card" style={{ 
                background: "rgba(255, 59, 48, 0.06)", 
                border: "1px solid rgba(255, 59, 48, 0.2)",
                boxShadow: "none"
              }}>
                <div className="cardInner" style={{ padding: 16 }}>
                  <div style={{ fontWeight: 600, color: "#FF3B30", marginBottom: 4 }}>Error</div>
                  <div style={{ fontSize: 14, color: "var(--muted)" }}>{error}</div>
                </div>
              </div>
            ) : null}

            {answer ? (
              <div className="card" style={{ boxShadow: "none", marginTop: 24 }}>
                <div className="cardInner">
                  <div className="stack">
                    <div>
                      <div className="h2" style={{ fontSize: 20, marginBottom: 4 }}>Answer</div>
                      <div className="subtle" style={{ fontSize: 13 }}>
                        Based on your uploaded notes
                      </div>
                    </div>
                    <div style={{
                      whiteSpace: "pre-wrap",
                      padding: 20,
                      borderRadius: 12,
                      background: "var(--panel-2)",
                      border: "1px solid var(--border)",
                      fontSize: 15,
                      lineHeight: 1.7,
                      color: "var(--text)"
                    }}>
                      {answer}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {contexts.length > 0 ? (
              <div className="card" style={{ boxShadow: "none", marginTop: 16 }}>
                <div className="cardInner">
                  <div className="stack">
                    <div>
                      <div className="h2" style={{ fontSize: 18, marginBottom: 4 }}>Sources</div>
                      <div className="subtle" style={{ fontSize: 13 }}>
                        {contexts.length} source{contexts.length !== 1 ? "s" : ""} found
                      </div>
                    </div>
                    <div style={{ display: "grid", gap: 12 }}>
                      {contexts.map((c, i) => (
                        <div 
                          key={i} 
                          style={{ 
                            padding: 16, 
                            borderRadius: 12, 
                            border: "1px solid var(--border)",
                            background: "var(--panel)"
                          }}
                        >
                          <div style={{ 
                            fontSize: 12, 
                            fontWeight: 600,
                            color: "#007AFF", 
                            marginBottom: 8 
                          }}>
                            {(c.stored_filename || "unknown file") + (typeof c.chunk_id === "number" ? ` • chunk ${c.chunk_id}` : "")}
                          </div>
                          <div style={{ 
                            whiteSpace: "pre-wrap", 
                            fontSize: 14, 
                            lineHeight: 1.6,
                            color: "var(--text)"
                          }}>
                            {c.snippet || c.text || ""}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {!answer && !loading && (
              <div style={{
                padding: 20,
                textAlign: "center",
                color: "var(--muted)",
                fontSize: 14
              }}>
                Enter a question above to get started
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function AskPage() {
  return (
    <Suspense fallback={
      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }}>
        <div className="card">
          <div className="cardInner">
            <div>Loading...</div>
          </div>
        </div>
      </main>
    }>
      <AskPageContent />
    </Suspense>
  );
}
