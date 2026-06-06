"use client";

import { useState } from "react";
import type { TopicPracticeMcq } from "../lib/curriculum";
import { ChemFormattedLine } from "../lib/chemTypography";

const LABELS = ["A", "B", "C", "D"] as const;

type Props = {
  question: TopicPracticeMcq;
  index: number;
};

export default function TopicPracticeMcqCard({ question: q, index }: Props) {
  const [sel, setSel] = useState<0 | 1 | 2 | 3 | null>(null);
  const [show, setShow] = useState(false);
  const correct = q.answerIndex;

  return (
    <div id={`practice-q${index + 1}`} className="topicPracticeQuestionCard">
      <div className="topicPracticeQuestionPrompt">
        <ChemFormattedLine text={q.question} />
      </div>
      <div className="topicPracticeOptions">
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
                if (!show) setSel(oi as 0 | 1 | 2 | 3);
              }}
              className="topicPracticeOptionBtn"
              style={{ border, background: bg }}
            >
              <strong>{letter})</strong> <ChemFormattedLine text={opt} />
            </button>
          );
        })}
      </div>
      <div className="topicPracticeQuestionActions">
        {!show ? (
          <button type="button" className="btn btnPrimary" disabled={sel === null} onClick={() => setShow(true)}>
            Check answer
          </button>
        ) : (
          <div className="topicPracticeExplanation">
            <strong>Answer {LABELS[correct]}.</strong> <ChemFormattedLine text={q.explanation} />
          </div>
        )}
      </div>
    </div>
  );
}
