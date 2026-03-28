"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  OpBadge,
  OpContextBanner,
  OpEmptyState,
  OpPanel,
  OpSearchResultCard,
  OpSpinner,
  ToolPageLayout,
} from "../components/op";
import { apiUrl } from "../lib/api";
import { highlightSnippet } from "../lib/highlight";
import { logActivity } from "../lib/activity";

type AskContext = {
  stored_filename?: string;
  upload_id?: string;
  chunk_id?: number;
  snippet?: string;
  text?: string;
  score?: number;
  meta?: Record<string, unknown>;
};

type AskResponse = {
  answer?: string;
  contexts?: AskContext[];
  confidence_tier?: string;
  top_match_score?: number;
  semantic_ready?: boolean;
  follow_up_suggestions?: string[];
};

function tierBadge(tier: string | undefined) {
  const t = (tier || "low").toLowerCase();
  if (t === "high") return { tone: "success" as const, label: "High confidence" };
  if (t === "medium") return { tone: "info" as const, label: "Medium confidence" };
  return { tone: "warn" as const, label: "Low confidence" };
}

function AskPageContent() {
  const searchParams = useSearchParams();
  const courseParam = searchParams?.get("course") || "";
  const topicParam = searchParams?.get("topic") || "";

  const [question, setQuestion] = useState("");
  const [topK, setTopK] = useState(5);
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState<AskResponse | null>(null);
  const [error, setError] = useState("");

  async function submitQuestion(text: string) {
    const q = text.trim();
    if (!q) {
      setError("Please enter a question");
      return;
    }
    setError("");
    setLoading(true);
    setPayload(null);
    try {
      const body: Record<string, unknown> = { question: q, top_k: Number(topK) };
      if (courseParam) body.course = courseParam;
      if (topicParam) body.topic = topicParam;

      const res = await fetch(apiUrl("/ask"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(`Ask failed ${res.status} ${t}`);
      }

      const data = (await res.json()) as AskResponse;
      setPayload(data);
      logActivity({
        kind: "ask",
        label: `Ask: ${q.slice(0, 40)}…`,
        detail: data.confidence_tier || "",
        href: "/ask",
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ask failed");
    } finally {
      setLoading(false);
    }
  }

  function onAsk(e: React.FormEvent) {
    e.preventDefault();
    void submitQuestion(question);
  }

  const tier = tierBadge(payload?.confidence_tier);
  const lowConfidence = (payload?.confidence_tier || "").toLowerCase() === "low" && (payload?.contexts?.length || 0) > 0;

  return (
    <ToolPageLayout
      eyebrow="Study OS"
      title="Ask your notes"
      subtitle="Grounded answers from ingested chunks. Upload .txt files, run ingest from Uploads, then ask mechanism and exam-style questions."
      actions={
        <>
          <Link className="btn" href="/search">
            Search
          </Link>
          <Link className="btn btnPrimary" href="/uploads">
            Uploads
          </Link>
        </>
      }
    >
      {(courseParam || topicParam) && (
        <OpContextBanner
          title={`Context: ${courseParam ? courseParam.replace("orgochem-", "OrgoChem ").replace("-", " ").toUpperCase() : "All"}${topicParam ? ` · ${topicParam.replace(/-/g, " ")}` : ""}`}
        >
          The API receives optional course/topic filters with each question.
        </OpContextBanner>
      )}

      <OpPanel title="Your question">
        <form onSubmit={onAsk} className="opPanelBody">
          <label className="opFieldLabel" htmlFor="ask-q">
            Question
          </label>
          <textarea
            id="ask-q"
            className="opTextarea"
            rows={5}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Example: When does SN2 beat E2 for a primary substrate?"
            disabled={loading}
          />
          <div className="opFieldRow">
            <label className="subtle" style={{ display: "flex", gap: 8, alignItems: "center" }}>
              Source chunks (top_k)
              <input
                className="input"
                type="number"
                min={1}
                max={20}
                value={topK}
                onChange={(e) => setTopK(Number(e.target.value))}
                style={{ width: 72 }}
                disabled={loading}
              />
            </label>
            <button type="submit" className="btn btnPrimary" disabled={loading || !question.trim()}>
              {loading ? "Working…" : "Ask"}
            </button>
          </div>
        </form>
      </OpPanel>

      {error ? (
        <OpPanel title="Error" variant="muted">
          <div style={{ color: "var(--red)", fontWeight: 700 }}>{error}</div>
        </OpPanel>
      ) : null}

      {loading ? <OpSpinner label="Retrieving grounded answer…" /> : null}

      {payload?.answer ? (
        <OpPanel
          title="Answer"
          right={
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <OpBadge tone={tier.tone}>{tier.label}</OpBadge>
              {typeof payload.top_match_score === "number" ? (
                <OpBadge tone="neutral">top lexical score {payload.top_match_score}</OpBadge>
              ) : null}
              {payload.semantic_ready === false ? <OpBadge tone="info">semantic-ready API: off</OpBadge> : null}
            </div>
          }
        >
          {lowConfidence ? (
            <div className="opContextBanner" style={{ marginBottom: 12, borderColor: "var(--warn-border)", background: "var(--warn-bg)" }}>
              <div className="opContextBannerTitle" style={{ color: "var(--text)" }}>
                Low confidence match
              </div>
              <div className="opContextBannerBody" style={{ color: "var(--text)" }}>
                Verify against the source cards below or rephrase with vocabulary from your notes.
              </div>
            </div>
          ) : null}
          <div
            style={{
              whiteSpace: "pre-wrap",
              padding: 16,
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              background: "var(--panel-2)",
              fontSize: 15,
              lineHeight: 1.65,
            }}
          >
            {payload.answer}
          </div>
        </OpPanel>
      ) : null}

      {payload?.contexts && payload.contexts.length > 0 ? (
        <OpPanel title="Supporting contexts">
          <div style={{ display: "grid", gap: 12 }}>
            {payload.contexts.map((c, i) => (
              <OpSearchResultCard
                key={i}
                metaLeft={
                  <>
                    {(c.stored_filename || c.upload_id || "source") +
                      (typeof c.chunk_id === "number" ? ` · chunk ${c.chunk_id}` : "")}
                  </>
                }
                metaRight={typeof c.score === "number" ? <OpBadge tone="neutral">score {c.score}</OpBadge> : null}
                snippet={highlightSnippet((c.snippet || c.text || "").slice(0, 400), question)}
              />
            ))}
          </div>
        </OpPanel>
      ) : null}

      {payload?.follow_up_suggestions && payload.follow_up_suggestions.length > 0 ? (
        <OpPanel title="Follow up">
          <div className="subtle" style={{ marginBottom: 10 }}>
            Load a suggestion into the question box, edit if you want, then press Ask.
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {payload.follow_up_suggestions.map((s) => (
              <button key={s} type="button" className="btn" onClick={() => setQuestion(s)}>
                {s}
              </button>
            ))}
          </div>
        </OpPanel>
      ) : null}

      {!payload && !loading && !error ? (
        <OpEmptyState
          title="Ask grounded questions"
          description="Upload notes (Uploads), ensure ingest shows Ready, then ask about mechanisms, selectivity, and exam traps."
        />
      ) : null}
    </ToolPageLayout>
  );
}

export default function AskPage() {
  return (
    <Suspense
      fallback={
        <ToolPageLayout title="Ask" subtitle="Loading…">
          <OpSpinner />
        </ToolPageLayout>
      }
    >
      <AskPageContent />
    </Suspense>
  );
}
