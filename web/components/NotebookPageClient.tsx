"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import type { Topic } from "@/app/lib/curriculum";
import { geminiAudioBrief, geminiFreshQuestions, geminiStudyGuide } from "@/lib/gemini";
import AIChat from "@/components/AIChat";
import StudioPanel from "@/components/StudioPanel";
import { getNotebookStarters } from "@/lib/storage";

type MiddleMode = "home" | "content";

export default function NotebookPageClient({ slug, topic }: { slug: string; topic: Topic }) {
  const [mobileTab, setMobileTab] = useState<"chat" | "main" | "sources">("chat");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [middleMode, setMiddleMode] = useState<MiddleMode>("home");
  const [contentKind, setContentKind] = useState<string | null>(null);
  const [body, setBody] = useState<string>("");
  const [freshQs, setFreshQs] = useState<
    { question: string; options: string[]; answerIndex: number; explanation: string }[]
  >([]);
  const [busy, setBusy] = useState(false);
  const [aiError, setAiError] = useState(false);
  const starters = useMemo(
    () => (typeof window !== "undefined" ? getNotebookStarters(slug) : []),
    [slug],
  );

  const chapter = topic.chapter ?? "OpenStax chapter (see topic link)";

  const moleculeSvg = `<svg viewBox="0 0 400 220" width="100%" height="220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs><linearGradient id="nbg" x1="0" x2="1"><stop offset="0" stop-color="#EEF1FF"/><stop offset="1" stop-color="#f0fdf4"/></linearGradient></defs>
  <rect width="400" height="220" rx="20" fill="url(#nbg)" stroke="#e5e7eb"/>
  <path d="M80 140 L140 100 L200 130 L260 90 L320 120" stroke="#4F6EF7" stroke-width="4" fill="none" stroke-linecap="round"/>
  <circle cx="140" cy="100" r="8" fill="#22c55e"/><circle cx="260" cy="90" r="8" fill="#f97316"/>
</svg>`;

  const readAloud = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(body));
  };

  const downloadPdf = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(
      `<!doctype html><html><head><title>Study guide</title><style>body{font-family:system-ui;padding:24px;line-height:1.5}</style></head><body>${body.replace(/\n/g, "<br/>")}</body></html>`,
    );
    w.document.close();
    w.print();
  };

  const onStudioMarkdown = useCallback((md: string) => {
    setAiError(false);
    setMiddleMode("content");
    setContentKind("guide");
    setBody(md);
    setMobileTab("main");
  }, []);

  const onStudioTranscript = useCallback((t: string) => {
    setAiError(false);
    setMiddleMode("content");
    setContentKind("audio");
    setBody(t);
    setMobileTab("main");
  }, []);

  const onFresh = useCallback((qs: unknown[]) => {
    setAiError(false);
    setMiddleMode("content");
    setContentKind("fresh");
    const norm = (qs as { question?: string; options?: string[]; answerIndex?: number; explanation?: string }[])
      .filter((x) => x.question && Array.isArray(x.options))
      .map((x) => ({
        question: x.question!,
        options: x.options!,
        answerIndex: Number(x.answerIndex) || 0,
        explanation: x.explanation || "",
      }));
    setFreshQs(norm);
    setMobileTab("main");
  }, []);

  const onMapSvg = useCallback((svg: string) => {
    setAiError(false);
    setMiddleMode("content");
    setContentKind("map");
    setBody(svg);
    setMobileTab("main");
  }, []);

  const quickAudio = async () => {
    if (busy) return;
    setBusy(true);
    setAiError(false);
    try {
      const r = await geminiAudioBrief(topic, slug);
      onStudioTranscript(r.transcript);
    } catch {
      setAiError(true);
    } finally {
      setBusy(false);
    }
  };

  const quickGuide = async () => {
    if (busy) return;
    setBusy(true);
    setAiError(false);
    try {
      const r = await geminiStudyGuide(topic, slug);
      onStudioMarkdown(r.markdown);
    } catch {
      setAiError(true);
    } finally {
      setBusy(false);
    }
  };

  const quickFresh = async () => {
    if (busy) return;
    setBusy(true);
    setAiError(false);
    try {
      const r = await geminiFreshQuestions(topic, slug);
      onFresh(r.questions || []);
    } catch {
      setAiError(true);
    } finally {
      setBusy(false);
    }
  };

  const leftPanel = (
    <div
      style={{
        width: 240,
        flexShrink: 0,
        background: "#1a1a2e",
        color: "#fff",
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        minHeight: "100%",
      }}
    >
      <div>
        <div style={{ fontWeight: 900, fontSize: 18 }}>📓 Notebook</div>
        <div style={{ color: "#9ca3af", fontSize: 13, marginTop: 4 }}>{topic.title}</div>
      </div>
      <div>
        <div style={{ fontWeight: 800, fontSize: 11, color: "#9ca3af", marginBottom: 8 }}>SOURCES</div>
        <div style={{ fontSize: 12, padding: "6px 10px", background: "#16213e", borderRadius: 999, marginBottom: 6, color: "#cbd5e1" }}>📄 Activity PDF (course site)</div>
        <div style={{ fontSize: 12, padding: "6px 10px", background: "#16213e", borderRadius: 999, marginBottom: 6, color: "#cbd5e1" }}>📖 {chapter}</div>
        <div style={{ fontSize: 12, padding: "6px 10px", background: "#16213e", borderRadius: 999, marginBottom: 10, color: "#cbd5e1" }}>📝 Your uploaded notes (if any)</div>
        <Link href={`/uploads?course=orgochem-2&topic=${encodeURIComponent(slug)}`} className="op-btn-secondary" style={{ textDecoration: "none", display: "block", textAlign: "center", fontSize: 13 }}>
          + Add Source
        </Link>
      </div>
      <StudioPanel
        slug={slug}
        topic={topic}
        busy={busy}
        setBusy={setBusy}
        onError={() => setAiError(true)}
        onMarkdown={onStudioMarkdown}
        onTranscript={onStudioTranscript}
        onFreshQuestions={onFresh}
        onConceptMapSvg={onMapSvg}
      />
      <div>
        <div style={{ fontWeight: 800, fontSize: 11, color: "#9ca3af", marginBottom: 8 }}>SESSIONS</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {starters.length === 0 ? <span style={{ color: "#6b7280", fontSize: 12 }}>Recent questions appear here.</span> : null}
          {starters.map((s) => (
            <span key={s} style={{ fontSize: 11, padding: "6px 10px", borderRadius: 999, background: "#16213e", color: "#e5e7eb" }}>
              {s.length > 28 ? `${s.slice(0, 26)}…` : s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const middlePanel = (
    <div style={{ flex: 1, background: "#fff", minHeight: 480, padding: 20, overflow: "auto" }}>
      {aiError ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 48 }}>🤖</div>
          <h2>AI assistant is temporarily unavailable</h2>
          <p style={{ color: "var(--op-text-secondary)" }}>Try searching your uploaded notes or watching a video.</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <Link className="op-btn-primary" href={`/uploads?course=orgochem-2&topic=${encodeURIComponent(slug)}`} style={{ textDecoration: "none" }}>
              Search Notes →
            </Link>
            {topic.bestVideos?.[0]?.url ? (
              <a className="op-btn-secondary" href={topic.bestVideos[0].url} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                Watch Video →
              </a>
            ) : null}
          </div>
        </div>
      ) : middleMode === "home" ? (
        <div className="op-fade-in" style={{ textAlign: "center" }}>
          <div dangerouslySetInnerHTML={{ __html: moleculeSvg }} />
          <h2 style={{ marginTop: 16 }}>What would you like to explore?</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 16,
              marginTop: 24,
              maxWidth: 720,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <button type="button" className="op-card op-card-hover" disabled={busy} onClick={() => void quickAudio()} style={{ border: "1px solid var(--op-border)", cursor: "pointer", textAlign: "left" }}>
              <div style={{ fontSize: 36 }}>🎧</div>
              <div style={{ fontWeight: 700, marginTop: 8 }}>Listen to audio brief</div>
            </button>
            <button type="button" className="op-card op-card-hover" disabled={busy} onClick={() => void quickGuide()} style={{ border: "1px solid var(--op-border)", cursor: "pointer", textAlign: "left" }}>
              <div style={{ fontSize: 36 }}>📋</div>
              <div style={{ fontWeight: 700, marginTop: 8 }}>Generate study guide</div>
            </button>
            <button type="button" className="op-card op-card-hover" disabled={busy} onClick={() => void quickFresh()} style={{ border: "1px solid var(--op-border)", cursor: "pointer", textAlign: "left" }}>
              <div style={{ fontSize: 36 }}>❓</div>
              <div style={{ fontWeight: 700, marginTop: 8 }}>Get fresh practice Qs</div>
            </button>
          </div>
        </div>
      ) : (
        <div className="op-fade-in" key={contentKind ?? "x"}>
          {contentKind === "guide" ? (
            <>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <button type="button" className="op-btn-primary" onClick={downloadPdf}>
                  📥 Download as PDF
                </button>
              </div>
              <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.55 }}>{body}</div>
            </>
          ) : null}
          {contentKind === "audio" ? (
            <>
              <button type="button" className="op-btn-secondary" onClick={readAloud}>
                ▶ Read aloud
              </button>
              <div style={{ marginTop: 12, whiteSpace: "pre-wrap", lineHeight: 1.55 }}>{body}</div>
            </>
          ) : null}
          {contentKind === "map" ? <div dangerouslySetInnerHTML={{ __html: body }} /> : null}
          {contentKind === "fresh" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {freshQs.map((q, i) => (
                <div key={i} className="op-card" style={{ textAlign: "left" }}>
                  <strong>
                    Q{i + 1}. {q.question}
                  </strong>
                  {q.options.map((o, oi) => (
                    <div key={oi} style={{ marginTop: 6 }}>
                      {String.fromCharCode(65 + oi)}) {o}
                    </div>
                  ))}
                  <details style={{ marginTop: 8 }}>
                    <summary>Reveal answer</summary>
                    <div>{q.explanation}</div>
                  </details>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ fontFamily: "var(--op-font-sans)", minHeight: "calc(100vh - 120px)" }}>
      <div className="op-nb-mobile-tabs" style={{ display: "none", borderBottom: "1px solid var(--op-border)" }}>
        {(
          [
            ["chat", "💬 Chat"],
            ["main", "📄 Explore"],
            ["sources", "📓 Menu"],
          ] as const
        ).map(([k, lab]) => (
          <button
            key={k}
            type="button"
            onClick={() => {
              setMobileTab(k);
              if (k === "sources") setSheetOpen(true);
            }}
            style={{
              flex: 1,
              padding: 12,
              border: "none",
              background: mobileTab === k ? "var(--op-indigo-light)" : "#fff",
              fontWeight: 700,
            }}
          >
            {lab}
          </button>
        ))}
      </div>

      <div className="op-nb-row" style={{ display: "flex", flexDirection: "row", alignItems: "stretch", minHeight: 560 }}>
        <div className="op-nb-left">{leftPanel}</div>
        <div className="op-nb-main" style={{ flex: 1, minWidth: 0 }}>
          <div className="op-nb-main-desktop">{middlePanel}</div>
          <div className="op-nb-main-mobile" style={{ display: "none" }}>
            {mobileTab === "main" ? middlePanel : null}
            {mobileTab === "chat" ? (
              <div style={{ borderTop: "1px solid var(--op-border)", minHeight: 400 }}>
                <AIChat slug={slug} topicTitle={topic.title} topic={topic} />
              </div>
            ) : null}
          </div>
        </div>
        <div className="op-nb-right" style={{ width: 360, flexShrink: 0, borderLeft: "1px solid var(--op-border)", background: "var(--op-gray-bg)" }}>
          <AIChat slug={slug} topicTitle={topic.title} topic={topic} />
        </div>
      </div>

      {sheetOpen ? (
        <div
          role="dialog"
          aria-modal
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 50,
            display: "flex",
            alignItems: "flex-end",
          }}
          onClick={() => setSheetOpen(false)}
        >
          <div style={{ maxHeight: "72vh", overflow: "auto", width: "100%", background: "#1a1a2e", padding: 16 }} onClick={(e) => e.stopPropagation()}>
            <button type="button" className="op-btn-secondary" onClick={() => setSheetOpen(false)}>
              Close
            </button>
            <div style={{ marginTop: 12 }}>{leftPanel}</div>
          </div>
        </div>
      ) : null}

      <style jsx global>{`
        @media (max-width: 900px) {
          .op-nb-mobile-tabs {
            display: flex !important;
          }
          .op-nb-left {
            display: none !important;
          }
          .op-nb-right {
            display: none !important;
          }
          .op-nb-main-desktop {
            display: none !important;
          }
          .op-nb-main-mobile {
            display: block !important;
          }
        }
        @media (min-width: 901px) {
          .op-nb-main-mobile {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
