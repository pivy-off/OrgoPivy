"use client";

import { useMemo, useState } from "react";
import type { Topic } from "@/app/lib/curriculum";
import { geminiAsk, type ChatTurn } from "@/lib/gemini";
import { getNotebookSession, pushNotebookStarter, setNotebookSession } from "@/lib/storage";

export type ChatMsg = {
  role: "model" | "user";
  text: string;
  related?: string[];
  confidence?: string;
};

export default function AIChat({ slug, topicTitle, topic }: { slug: string; topicTitle: string; topic?: Topic }) {
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const chips = useMemo(() => {
    const mk = topic?.mustKnowItems?.slice(0, 4).map((m) => `Explain: ${m.title}`) ??
      topic?.mustKnow.slice(0, 4).map((s) => `Why does ${s.slice(0, 40)}… matter?`) ?? [
        `What is the hardest idea in ${topicTitle}?`,
        "Give me a practice MCQ with 4 choices.",
        "What reagents should I memorize first?",
        "Walk me through a mechanism template.",
      ];
    return mk;
  }, [topic, topicTitle]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || loading) return;
    setErr(null);
    setLoading(true);
    pushNotebookStarter(slug, q);
    const userMsg: ChatMsg = { role: "user", text: q };
    const nextThread = [...msgs, userMsg];
    setMsgs(nextThread);
    setInput("");
    const history: ChatTurn[] = nextThread.map((x) => ({ role: x.role, content: x.text }));
    try {
      const res = await geminiAsk(q, {
        topicSlug: slug,
        course: "orgochem-2",
        history: history.slice(0, -1),
        topic,
      });
      setRemaining(res.remaining_questions);
      setMsgs((m) => [
        ...m,
        {
          role: "model",
          text: res.answer,
          related: res.related_concepts,
          confidence: res.confidence,
        },
      ]);
      const prev = getNotebookSession(slug);
      setNotebookSession(slug, {
        lastOpened: new Date().toISOString(),
        questionsUsed: prev.questionsUsed + 1,
      });
    } catch (e) {
      setErr((e as Error).message);
      setMsgs((m) => m.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 420, fontFamily: "var(--op-font-sans)" }}>
      <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--op-border)", background: "#fff" }}>
        <strong>🧠 Ask AI</strong>
        {remaining !== null ? (
          <span style={{ marginLeft: 8, color: "var(--op-text-secondary)", fontSize: 13 }}>{remaining} questions left</span>
        ) : null}
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: 12, background: "var(--op-gray-bg)" }}>
        {msgs.length === 0 ? (
          <div style={{ color: "var(--op-text-secondary)", fontSize: 14, lineHeight: 1.5 }}>
            Ask me anything about <strong>{topicTitle}</strong>. I&apos;m trained on Dr. Garrett&apos;s course materials.
          </div>
        ) : null}
        {msgs.map((m, i) => (
          <div
            key={i}
            className="op-fade-in"
            style={{
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                maxWidth: "92%",
                padding: "10px 12px",
                borderRadius: 14,
                background: m.role === "user" ? "var(--op-indigo)" : "#dbeafe",
                color: m.role === "user" ? "#fff" : "var(--op-text-primary)",
                fontSize: 14,
                lineHeight: 1.45,
              }}
            >
              <div>{m.text}</div>
              {m.role === "model" && m.related && m.related.length > 0 ? (
                <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
                  <span style={{ fontSize: 12, opacity: 0.85 }}>Related:</span>
                  {m.related.map((r) => (
                    <span key={r} className="op-badge op-badge-green" style={{ fontSize: 11 }}>
                      {r}
                    </span>
                  ))}
                </div>
              ) : null}
              {m.role === "model" ? (
                <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button type="button" className="op-chip" style={{ fontSize: 11, padding: "4px 10px" }} onClick={() => navigator.clipboard.writeText(m.text)}>
                    📋 Copy
                  </button>
                  <button type="button" className="op-chip" style={{ fontSize: 11, padding: "4px 10px" }} aria-label="Thumbs up">
                    👍
                  </button>
                  <button type="button" className="op-chip" style={{ fontSize: 11, padding: "4px 10px" }} aria-label="Thumbs down">
                    👎
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ))}
        {loading ? (
          <div style={{ paddingLeft: 8 }}>
            <span className="op-typing-dot" />
            <span className="op-typing-dot" />
            <span className="op-typing-dot" />
          </div>
        ) : null}
        {err ? (
          <div style={{ marginTop: 12, padding: 12, borderRadius: 12, background: "var(--op-red-light)", color: "var(--op-red)", fontSize: 13 }}>{err}</div>
        ) : null}
      </div>
      <div style={{ padding: 10, borderTop: "1px solid var(--op-border)", background: "#fff" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
          {chips.map((c) => (
            <button key={c} type="button" className="op-chip" style={{ fontSize: 12 }} onClick={() => send(c)}>
              {c.length > 42 ? `${c.slice(0, 40)}…` : c}
            </button>
          ))}
        </div>
        <textarea
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question…"
          style={{
            width: "100%",
            resize: "none",
            borderRadius: 10,
            border: "1px solid var(--op-border)",
            padding: 10,
            maxHeight: 88,
            fontFamily: "inherit",
          }}
        />
        <button type="button" className="op-btn-primary" style={{ width: "100%", marginTop: 8 }} disabled={loading} onClick={() => send(input)}>
          Ask →
        </button>
      </div>
    </div>
  );
}
