"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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
            ← Back
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Feedback Reports</h1>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>
            Broken video reports and other feedback. Use these to improve OrgoPivy.
          </p>
        </div>

        {loading ? (
          <div style={{ padding: 32, textAlign: "center", color: "var(--muted)" }}>Loading…</div>
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
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No feedback yet</div>
            <div style={{ color: "var(--muted)", fontSize: 14 }}>
              Reports from the &quot;Report broken&quot; button on topic pages will appear here.
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
                    Video: {e.videoTitle}
                  </div>
                )}
                {e.videoUrl && (
                  <a
                    href={e.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: 12, color: "var(--blue)" }}
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
