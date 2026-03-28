"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { QUIZ_SEED, type QuizItemBase } from "../lib/quiz-data";
import { getWeakTopics, recordQuizMiss } from "../lib/activity";
import { OpBadge, OpEmptyState, OpPanel, ToolPageLayout } from "../components/op";

function QuizCard({
  item,
  onResult,
}: {
  item: QuizItemBase;
  onResult: (correct: boolean) => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const [show, setShow] = useState(false);

  if (item.mode === "mcq" && item.choices && typeof item.correctIndex === "number") {
    const done = picked !== null;
    const correct = picked === item.correctIndex;
    return (
      <OpPanel title="Multiple choice">
        <div style={{ fontWeight: 800, marginBottom: 12 }}>{item.prompt}</div>
        <div style={{ display: "grid", gap: 8 }}>
          {item.choices.map((c, i) => (
            <button
              key={c}
              type="button"
              className="btn"
              style={{
                justifyContent: "flex-start",
                borderColor: done && i === item.correctIndex ? "var(--green)" : undefined,
              }}
              disabled={done}
              onClick={() => {
                setPicked(i);
                const ok = i === item.correctIndex;
                if (!ok) recordQuizMiss(item.topicTags[0] || item.id, item.topicTags.join(", "));
                onResult(ok);
                setShow(true);
              }}
            >
              {c}
            </button>
          ))}
        </div>
        {show ? (
          <div style={{ marginTop: 14, padding: 12, borderRadius: "var(--radius-md)", background: "var(--panel-2)", border: "1px solid var(--border)" }}>
            <div style={{ fontWeight: 850, marginBottom: 6 }}>{correct ? "Correct" : "Not quite"}</div>
            <div className="subtle" style={{ color: "var(--text)", lineHeight: 1.55 }}>
              {item.rationale}
            </div>
          </div>
        ) : null}
      </OpPanel>
    );
  }

  const [revealed, setRevealed] = useState(false);
  return (
    <OpPanel title={item.mode === "recall" ? "Rapid recall" : "Reaction reasoning"}>
      <div style={{ fontWeight: 800, marginBottom: 12 }}>{item.prompt}</div>
      {!revealed ? (
        <button type="button" className="btn btnPrimary" onClick={() => setRevealed(true)}>
          Reveal explanation
        </button>
      ) : (
        <div className="subtle" style={{ color: "var(--text)", lineHeight: 1.6 }}>
          {item.rationale}
        </div>
      )}
      {revealed ? (
        <div className="opFieldRow" style={{ marginTop: 12 }}>
          <button type="button" className="btn" onClick={() => { onResult(true); }}>
            I had it
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              recordQuizMiss(item.topicTags[0] || item.id, item.topicTags.join(", "));
              onResult(false);
            }}
          >
            Need practice
          </button>
        </div>
      ) : null}
    </OpPanel>
  );
}

export default function QuizPrepPage() {
  const [idx, setIdx] = useState(0);
  const item = QUIZ_SEED[idx % QUIZ_SEED.length];
  const weak = useMemo(() => getWeakTopics(4), [idx]);

  return (
    <ToolPageLayout
      eyebrow="Study OS"
      title="Quiz prep"
      subtitle="Multiple choice, recall, and reaction prompts with explanations. Weak topics accumulate locally for guided review."
      actions={
        <Link className="btn" href="/workspace">
          Workspace
        </Link>
      }
    >
      <OpPanel
        title="Session"
        right={
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <OpBadge tone="info">Card {idx + 1}</OpBadge>
            <OpBadge tone="neutral">{item.mode.toUpperCase()}</OpBadge>
          </div>
        }
      >
        <QuizCard
          key={item.id}
          item={item}
          onResult={() => {
            /* hook for analytics */
          }}
        />
        <div className="opFieldRow">
          <button type="button" className="btn" onClick={() => setIdx((i) => i - 1)} disabled={idx === 0}>
            Previous
          </button>
          <button type="button" className="btn btnPrimary" onClick={() => setIdx((i) => i + 1)}>
            Next card
          </button>
        </div>
      </OpPanel>

      <OpPanel title="Weak areas (local)">
        {weak.length === 0 ? (
          <OpEmptyState title="No misses tracked yet" description="Mark “Need practice” on recall cards to populate this list." />
        ) : (
          <ul className="opActivityList">
            {weak.map((w) => (
              <li key={w.slug} className="opActivityItem">
                <span>{w.title}</span>
                <OpBadge tone="warn">{w.wrong} misses</OpBadge>
              </li>
            ))}
          </ul>
        )}
      </OpPanel>

      <OpPanel title="AI quiz packs (coming soon)" variant="muted">
        <div className="subtle" style={{ lineHeight: 1.55 }}>
          The <code style={{ fontSize: 12 }}>QuizItemBase</code> shape is stable for importing generated JSON: keep{" "}
          <code style={{ fontSize: 12 }}>id</code>, <code style={{ fontSize: 12 }}>mode</code>, tags, choices, and{" "}
          <code style={{ fontSize: 12 }}>rationale</code> aligned with this page.
        </div>
      </OpPanel>
    </ToolPageLayout>
  );
}
