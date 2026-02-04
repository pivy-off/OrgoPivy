"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "../contexts/LanguageContext";

type FeedbackEntry = {
  id: string;
  timestamp: string;
  type: string;
  course: string;
  topic: string;
  topicSlug: string;
  videoTitle?: string;
  videoUrl?: string;
  itemIndex?: number;
  message?: string;
};

export default function FeedbackPage() {
  const { t } = useLanguage();
  const [entries, setEntries] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/feedback")
      .then((r) => r.json())
      .then(setEntries)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="stack" style={{ maxWidth: 800, margin: 0 }}>
      <div className="card">
        <div className="cardInner">
        <div style={{ marginBottom: 24 }}>
          <Link href="/" className="btn" style={{ marginBottom: 16 }}>
            {t("back")}
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{t("feedbackReports")}</h1>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>
            {t("feedbackDesc")}
          </p>
        </div>

        {loading ? (
          <div style={{ padding: 32, textAlign: "center", color: "var(--muted)" }}>{t("loading")}</div>
        ) : entries.length === 0 ? (
          <div
            style={{
              padding: 48,
              textAlign: "center",
              background: "var(--panel-2)",
              borderRadius: 12,
              border: "1px solid var(--border)",
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{t("noFeedback")}</div>
            <div style={{ color: "var(--muted)", fontSize: 14 }}>
              {t("noFeedbackDesc")}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {entries.map((e) => (
              <div
                key={e.id}
                style={{
                  padding: 16,
                  background: "var(--panel)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                }}
              >
                <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>
                  {new Date(e.timestamp).toLocaleString()} · {e.type}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                  {e.topic} ({e.course})
                </div>
                {e.videoTitle && (
                  <div style={{ fontSize: 13, marginBottom: 4 }}>
                    {t("video")}: {e.videoTitle}
                  </div>
                )}
                {e.videoUrl && (
                  <a
                    href={e.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: 12, color: "var(--blue)", wordBreak: "break-all" }}
                  >
                    {e.videoUrl}
                  </a>
                )}
                {e.message && (
                  <div style={{ marginTop: 8, fontSize: 13, color: "var(--muted)" }}>
                    {e.message}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </main>
  );
}
