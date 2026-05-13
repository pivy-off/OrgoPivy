"use client";

import { useState } from "react";
import type { TopicPracticeMcq } from "../lib/curriculum";
import { ChemFormattedLine } from "../lib/chemTypography";

const LABELS = ["A", "B", "C", "D"] as const;

export default function TopicPracticeMcqs({ questions }: { questions: TopicPracticeMcq[] }) {
  const [choice, setChoice] = useState<Record<number, 0 | 1 | 2 | 3 | null>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {questions.map((q, qi) => {
        const sel = choice[qi] ?? null;
        const show = revealed[qi];
        const correct = q.answerIndex;
        return (
          <div
            key={qi}
            style={{
              padding: 14,
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.08)",
              background: "rgba(0,0,0,0.02)",
            }}
          >
            <div style={{ fontWeight: 800, marginBottom: 10, fontSize: 15 }}>
              <span style={{ color: "rgba(0,0,0,0.45)" }}>Q{qi + 1}. </span>
              <ChemFormattedLine text={q.question} />
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {q.options.map((opt, oi) => {
                const letter = LABELS[oi];
                const isSel = sel === oi;
                let border = "1px solid rgba(0,0,0,0.1)";
                let bg = "transparent";
                if (show) {
                  if (oi === correct) {
                    border = "1px solid rgba(52,199,89,0.55)";
                    bg = "rgba(52,199,89,0.08)";
                  } else if (isSel) {
                    border = "1px solid rgba(255,59,48,0.45)";
                    bg = "rgba(255,59,48,0.06)";
                  }
                } else if (isSel) {
                  border = "1px solid rgba(0,122,255,0.35)";
                  bg = "rgba(0,122,255,0.05)";
                }
                return (
                  <button
                    key={oi}
                    type="button"
                    onClick={() => {
                      if (!show) setChoice((c) => ({ ...c, [qi]: oi as 0 | 1 | 2 | 3 }));
                    }}
                    style={{
                      textAlign: "left",
                      padding: "10px 12px",
                      borderRadius: 10,
                      border,
                      background: bg,
                      cursor: show ? "default" : "pointer",
                      fontSize: 14,
                      lineHeight: 1.45,
                    }}
                  >
                    <strong>{letter})</strong> <ChemFormattedLine text={opt} />
                  </button>
                );
              })}
            </div>
            <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              {!show ? (
                <button
                  type="button"
                  className="btn btnPrimary"
                  disabled={sel === null}
                  onClick={() => setRevealed((r) => ({ ...r, [qi]: true }))}
                >
                  Check answer
                </button>
              ) : (
                <div style={{ fontSize: 13, lineHeight: 1.55, color: "rgba(0,0,0,0.75)" }}>
                  <strong>Answer {LABELS[correct]}.</strong> <ChemFormattedLine text={q.explanation} />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
