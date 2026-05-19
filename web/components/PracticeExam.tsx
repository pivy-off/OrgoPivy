"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Topic, TopicPracticeMcq } from "@/app/lib/curriculum";
import { geminiFreshQuestions, type FreshMcq } from "@/lib/gemini";
import { getExamScores, setExamScores } from "@/lib/storage";

export type ExamQuestion = {
  id: string;
  text: string;
  options: [string, string, string, string];
  answerIndex: 0 | 1 | 2 | 3;
  explanation: string;
  videoUrl?: string | null;
};

function mcqToExam(m: TopicPracticeMcq, i: number): ExamQuestion {
  return {
    id: `mcq-${i}`,
    text: m.question,
    options: m.options,
    answerIndex: m.answerIndex,
    explanation: m.explanation,
    videoUrl: null,
  };
}

function freshToExam(q: FreshMcq, i: number): ExamQuestion {
  return {
    id: `ai-${i}`,
    text: q.question,
    options: q.options,
    answerIndex: q.answerIndex,
    explanation: q.explanation,
    videoUrl: null,
  };
}

function letter(idx: number) {
  return ["A", "B", "C", "D"][idx] ?? "?";
}

export default function PracticeExam({
  slug,
  title,
  topic,
  seedMcqs,
}: {
  slug: string;
  title: string;
  topic: Topic;
  seedMcqs: TopicPracticeMcq[];
}) {
  const [phase, setPhase] = useState<"setup" | "exam" | "results">("setup");
  const [timed, setTimed] = useState(false);
  const [minutes, setMinutes] = useState(20);
  const [mixed, setMixed] = useState(false);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | undefined>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [loadingAi, setLoadingAi] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [ringPct, setRingPct] = useState(0);
  const [confetti, setConfetti] = useState(false);

  const buildFromSeed = useCallback(() => {
    let pool = seedMcqs.map(mcqToExam);
    if (pool.length < 10) {
      const filler: TopicPracticeMcq = {
        question: `Review checklist: which idea is most central for ${title}?`,
        options: ["Stereochemistry at new centers", "Resonance stabilization", "Inductive effects only", "Only solvent polarity"],
        answerIndex: 1,
        explanation: "Most unit outcomes tie back to electron delocalization and mechanism classes from the checklist.",
      };
      while (pool.length < 10) {
        pool.push(mcqToExam(filler, pool.length));
      }
    }
    pool = pool.slice(0, 10);
    setQuestions(pool);
  }, [seedMcqs, title]);

  useEffect(() => {
    if (phase !== "exam" || !timed) return;
    const t = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          window.clearInterval(t);
          setPhase("results");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, [phase, timed]);

  const start = () => {
    buildFromSeed();
    setAnswers({});
    setIdx(0);
    setPhase("exam");
    setSecondsLeft(minutes * 60);
  };

  const score = useMemo(() => {
    let ok = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.answerIndex) ok += 1;
    });
    return { ok, total: questions.length };
  }, [questions, answers]);

  useEffect(() => {
    if (phase !== "results" || !questions.length) return;
    const pct = Math.round((score.ok / score.total) * 100);
    const id = window.requestAnimationFrame(() => {
      let startT: number | null = null;
      const dur = 1200;
      const tick = (now: number) => {
        if (startT === null) startT = now;
        const p = Math.min(1, (now - startT) / dur);
        const ease = 1 - (1 - p) ** 2;
        setRingPct(pct * ease);
        if (p < 1) window.requestAnimationFrame(tick);
      };
      window.requestAnimationFrame(tick);
    });
    const prev = getExamScores(slug);
    const best = Math.max(prev.best, score.ok);
    setExamScores(slug, {
      best,
      attempts: prev.attempts + 1,
      lastDate: new Date().toISOString(),
    });
    if (score.ok === score.total && score.total > 0) {
      setConfetti(true);
      window.setTimeout(() => setConfetti(false), 3000);
    }
    return () => cancelAnimationFrame(id);
  }, [phase, questions.length, score.ok, score.total, slug]);

  const submit = () => setPhase("results");

  const gradeLetter = (pct: number) => {
    if (pct >= 90) return "A";
    if (pct >= 80) return "B";
    if (pct >= 70) return "C";
    if (pct >= 60) return "D";
    return "F";
  };

  if (phase === "setup") {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: 24, fontFamily: "var(--op-font-sans)" }}>
        <h1 style={{ fontSize: 24 }}>📝 Practice Exam — {title}</h1>
        <p style={{ color: "var(--op-text-secondary)" }}>10 Questions | Timed or untimed | Instant feedback</p>
        <div className="op-card op-fade-in" style={{ marginTop: 16 }}>
          <div style={{ marginBottom: 12 }}>
            <strong>Mode:</strong>{" "}
            <button type="button" className={timed ? "op-btn-primary" : "op-btn-secondary"} onClick={() => setTimed(true)} style={{ marginRight: 8 }}>
              Timed ⏱
            </button>
            <button type="button" className={!timed ? "op-btn-primary" : "op-btn-secondary"} onClick={() => setTimed(false)}>
              Untimed
            </button>
          </div>
          {timed ? (
            <div style={{ marginBottom: 12 }}>
              <strong>Timer:</strong>{" "}
              {[10, 20, 30].map((m) => (
                <button
                  key={m}
                  type="button"
                  className={minutes === m ? "op-btn-primary" : "op-btn-secondary"}
                  style={{ marginRight: 8 }}
                  onClick={() => setMinutes(m)}
                >
                  {m} min
                </button>
              ))}
            </div>
          ) : null}
          <div style={{ marginBottom: 16 }}>
            <strong>Type:</strong>{" "}
            <button type="button" className={!mixed ? "op-btn-primary" : "op-btn-secondary"} style={{ marginRight: 8 }} onClick={() => setMixed(false)}>
              Multiple Choice
            </button>
            <button type="button" className={mixed ? "op-btn-primary" : "op-btn-secondary"} onClick={() => setMixed(true)}>
              Mixed
            </button>
          </div>
          <button type="button" className="op-btn-primary" onClick={start}>
            Start Exam →
          </button>
        </div>
      </div>
    );
  }

  if (phase === "exam" && questions.length) {
    const q = questions[idx];
    const answered = answers[q.id];
    return (
      <div style={{ fontFamily: "var(--op-font-sans)", padding: "12px 16px", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
          <strong>
            Question {idx + 1}/{questions.length}
          </strong>
          {timed ? <span>Time: {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}</span> : <span>Untimed</span>}
          <button type="button" className="op-btn-primary" onClick={submit}>
            Submit
          </button>
        </div>
        <div className="op-card op-fade-in">
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Q{idx + 1}. {q.text}</div>
          {q.options.map((opt, oi) => (
            <label
              key={oi}
              style={{
                display: "flex",
                gap: 10,
                padding: 10,
                borderRadius: 10,
                cursor: "pointer",
                border: answered === oi ? "2px solid var(--op-indigo)" : "1px solid var(--op-border)",
                marginBottom: 8,
              }}
            >
              <input
                type="radio"
                name={q.id}
                checked={answered === oi}
                onChange={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
              />
              <span>
                {letter(oi)}) {opt}
              </span>
            </label>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
            <button type="button" className="op-btn-secondary" disabled={idx === 0} onClick={() => setIdx((i) => i - 1)}>
              ← Back
            </button>
            <button
              type="button"
              className="op-btn-secondary"
              disabled={idx >= questions.length - 1}
              onClick={() => setIdx((i) => i + 1)}
            >
              Next →
            </button>
          </div>
        </div>
        <div className="op-exam-map-desktop" style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 14 }}>
          {questions.map((qq, i) => (
            <button
              key={qq.id}
              type="button"
              onClick={() => setIdx(i)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: i === idx ? "2px solid var(--op-indigo)" : "1px solid var(--op-border)",
                background: answers[qq.id] !== undefined ? "var(--op-green-light)" : "#fff",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <div className="op-exam-map-mobile op-skeleton" style={{ height: 8, marginTop: 14, borderRadius: 4, display: "none" }} />
        <style jsx global>{`
          @media (max-width: 640px) {
            .op-exam-map-desktop {
              display: none !important;
            }
            .op-exam-map-mobile {
              display: block !important;
              width: ${((idx + 1) / questions.length) * 100}%;
              max-width: 100%;
            }
          }
        `}</style>
      </div>
    );
  }

  if (phase === "results" && questions.length) {
    const pct = Math.round((score.ok / score.total) * 100);
    const r = 52;
    const c = 2 * Math.PI * r;
    const offset = c - (ringPct / 100) * c;
    return (
      <div style={{ padding: 24, maxWidth: 800, margin: "0 auto", fontFamily: "var(--op-font-sans)" }}>
        {confetti ? <Confetti /> : null}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <svg width="140" height="140" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
            <circle
              cx="60"
              cy="60"
              r={r}
              fill="none"
              stroke="var(--op-indigo)"
              strokeWidth="10"
              strokeDasharray={c}
              strokeDashoffset={offset}
              transform="rotate(-90 60 60)"
              style={{ transition: "stroke-dashoffset 0.05s linear" }}
            />
            <text x="60" y="66" textAnchor="middle" fontSize="22" fontWeight="900" fill="var(--op-text-primary)">
              {score.ok} / {score.total}
            </text>
          </svg>
          <div style={{ fontSize: 20, fontWeight: 800 }}>Grade: {gradeLetter(pct)} ({pct}%)</div>
        </div>
        {questions.map((q) => {
          const ua = answers[q.id];
          const correct = ua === q.answerIndex;
          return (
            <div key={q.id} className="op-card" style={{ marginBottom: 12, textAlign: "left" }}>
              <div style={{ fontWeight: 800 }}>
                {correct ? "✅" : "❌"} {q.text}
              </div>
              <div style={{ fontSize: 14, color: "var(--op-text-secondary)", marginTop: 6 }}>
                Your answer: {ua !== undefined ? `${letter(ua)}) ${q.options[ua]}` : "(skipped)"} · Correct: {letter(q.answerIndex)}){" "}
                {q.options[q.answerIndex]}
              </div>
              <button type="button" className="op-chip" style={{ marginTop: 8 }} onClick={() => setExpanded((e) => ({ ...e, [q.id]: !e[q.id] }))}>
                {expanded[q.id] ? "Hide" : "Show"} explanation
              </button>
              {expanded[q.id] ? <div style={{ marginTop: 8, fontSize: 14 }}>{q.explanation}</div> : null}
              {topic.bestVideos?.[0]?.url ? (
                <Link href={topic.bestVideos[0].url} className="op-btn-secondary" style={{ display: "inline-block", marginTop: 10 }} target="_blank">
                  📺 Watch video for this concept
                </Link>
              ) : null}
            </div>
          );
        })}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16 }}>
          <button
            type="button"
            className="op-btn-secondary"
            onClick={() => {
              const missed = questions.filter((q) => answers[q.id] !== q.answerIndex);
              setQuestions(missed.length ? missed : questions);
              setAnswers({});
              setIdx(0);
              setPhase("exam");
            }}
          >
            Retry missed questions only
          </button>
          <button
            type="button"
            className="op-btn-primary"
            disabled={loadingAi}
            onClick={async () => {
              setLoadingAi(true);
              try {
                const { questions: fq } = await geminiFreshQuestions(topic, slug);
                const ex = fq.slice(0, 10).map((x, i) => freshToExam(x, i));
                setQuestions(ex.length ? ex : questions);
                setAnswers({});
                setIdx(0);
                setPhase("exam");
              } catch {
                setLoadingAi(false);
              }
              setLoadingAi(false);
            }}
          >
            Generate new exam with AI
          </button>
          <Link href={`/orgochem-2/${encodeURIComponent(slug)}`} className="op-btn-secondary" style={{ textDecoration: "none", display: "inline-block" }}>
            Back to topic
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="op-skeleton" style={{ height: 200, margin: 24 }}>
      Loading…
    </div>
  );
}

function Confetti() {
  const colors = ["#4F6EF7", "#22c55e", "#f97316", "#ef4444", "#eab308", "#a855f7"];
  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 9998 }}>
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="op-confetti-piece"
          style={{
            left: `${(i * 5) % 100}%`,
            background: colors[i % colors.length],
            animationDelay: `${i * 0.05}s`,
          }}
        />
      ))}
    </div>
  );
}
