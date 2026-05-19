"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import PracticeAchievements from "@/app/components/PracticeAchievements";

type SessionEntry = { score: number; date: string };

function loadSessionHistory(): SessionEntry[] {
  try {
    const saved = localStorage.getItem("orgopivy-practice-history");
    if (saved) return JSON.parse(saved) as SessionEntry[];
  } catch (e) {
    console.error("Failed to load practice history", e);
  }
  return [];
}

function loadPracticeStats(): { totalQuestions: number; correctAnswers: number } {
  try {
    const saved = localStorage.getItem("orgopivy-practice-stats");
    if (saved) {
      const stats = JSON.parse(saved) as { totalQuestions?: number; correctAnswers?: number };
      return {
        totalQuestions: stats.totalQuestions || 0,
        correctAnswers: stats.correctAnswers || 0,
      };
    }
  } catch (e) {
    console.error("Failed to load practice stats", e);
  }
  return { totalQuestions: 0, correctAnswers: 0 };
}

type PracticePrompt = {
  substrate: string;
  reagent: string;
  solvent: string;
  heat: boolean;
};

type PracticeQuestion = {
  id: string;
  text: string;
};

type StartResponse = {
  session_id: string;
  prompt: PracticePrompt;
  question: PracticeQuestion;
};

type AnswerResponse = {
  session_id: string;
  correct: boolean;
  message: string;
  done: boolean;
  score: number;
  decision?: string | null;
  decision_reason?: string;
  question?: PracticeQuestion;
};

function PracticePageContent() {
  const searchParams = useSearchParams();
  const courseParam = searchParams?.get("course") || "";
  const topicParam = searchParams?.get("topic") || "";

  const apiBase = useMemo(() => {
    return process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
  }, []);

  const [sessionId, setSessionId] = useState("");
  const [prompt, setPrompt] = useState<PracticePrompt | null>(null);
  const [question, setQuestion] = useState<PracticeQuestion | null>(null);

  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(() =>
    typeof window !== "undefined" ? loadPracticeStats().totalQuestions : 0,
  );
  const [correctAnswers, setCorrectAnswers] = useState(() =>
    typeof window !== "undefined" ? loadPracticeStats().correctAnswers : 0,
  );
  const [sessionHistory, setSessionHistory] = useState<SessionEntry[]>(() =>
    typeof window !== "undefined" ? loadSessionHistory() : [],
  );

  const [decision, setDecision] = useState<string>("");
  const [decisionReason, setDecisionReason] = useState<string>("");

  const [message, setMessage] = useState("");
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  async function start() {
    setLoading(true);
    setMessage("");
    setCorrect(null);
    setDecision("");
    setDecisionReason("");
    setAnswer("");
    setScore(0);
    setSessionId("");
    setPrompt(null);
    setQuestion(null);

    try {
      const body: any = {};
      
      // Map topic to module name for backend
      if (topicParam) {
        if (topicParam === "substitution-elimination") {
          body.module = "sn1_sn2_e1_e2";
        } else if (topicParam === "alkenes") {
          body.module = "alkene_additions";
        } else if (topicParam === "alkanes") {
          body.module = "alkanes";
        } else if (topicParam === "cycloalkanes") {
          body.module = "cycloalkanes";
        } else if (topicParam === "stereochemistry") {
          body.module = "stereochemistry";
        } else if (topicParam === "spectroscopy") {
          body.module = "spectroscopy";
        } else {
          body.module = topicParam;
        }
      } else {
        // Default if no topic specified
        body.module = "sn1_sn2_e1_e2";
      }
      
      if (courseParam) body.course = courseParam;
      if (topicParam) body.topic = topicParam;

      const res = await fetch(`${apiBase}/practice/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Start failed ${res.status} ${txt}`);
      }

      const data = (await res.json()) as StartResponse;
      setSessionId(data.session_id);
      setPrompt(data.prompt);
      setQuestion(data.question);
      setLoading(false);
    } catch (e: any) {
      const errorMsg = e?.message || "Start failed";
      // If module not supported or API error, show helpful message
      if (errorMsg.includes("module") || errorMsg.includes("not found") || errorMsg.includes("404") || errorMsg.includes("500") || errorMsg.includes("Failed to fetch")) {
        setMessage(`Practice mode for "${topicParam ? topicParam.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) : "this topic"}" is coming soon. Currently available for: Substitution-Elimination (SN1/SN2/E1/E2). You can still use the Exam Practice Mode for practice problems.`);
      } else {
        setMessage(errorMsg);
      }
      setLoading(false);
    }
  }

  async function submit() {
    if (!sessionId || !question) return;

    const a = answer.trim();
    if (!a) {
      setMessage("Enter an answer");
      setCorrect(null);
      return;
    }

    setLoading(true);
    setMessage("");
    setCorrect(null);

    try {
      const res = await fetch(`${apiBase}/practice/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, answer: a }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Answer failed ${res.status} ${txt}`);
      }

      const data = (await res.json()) as AnswerResponse;

      const isCorrect = Boolean(data.correct);
      setCorrect(isCorrect);
      setMessage(data.message || "");
      const newScore = Number(data.score || 0);
      setScore(newScore);

      // Update stats
      setTotalQuestions(prev => {
        const updated = prev + 1;
        localStorage.setItem("orgopivy-practice-stats", JSON.stringify({
          totalQuestions: updated,
          correctAnswers: isCorrect ? correctAnswers + 1 : correctAnswers
        }));
        return updated;
      });

      if (isCorrect) {
        setCorrectAnswers(prev => {
          const updated = prev + 1;
          localStorage.setItem("orgopivy-practice-stats", JSON.stringify({
            totalQuestions: totalQuestions + 1,
            correctAnswers: updated
          }));
          return updated;
        });
      }

      const d = (data.decision || "") as string;
      setDecision(d);
      setDecisionReason(data.decision_reason || "");

      if (data.done) {
        setQuestion(null);
        // Save session to history
        const percentage = totalQuestions > 0 ? Math.round((correctAnswers / (totalQuestions + 1)) * 100) : (isCorrect ? 100 : 0);
        const newHistory = [...sessionHistory, { score: percentage, date: new Date().toISOString() }];
        setSessionHistory(newHistory);
        localStorage.setItem("orgopivy-practice-history", JSON.stringify(newHistory.slice(-50))); // Keep last 50 sessions
      } else {
        setQuestion(data.question || null);
      }

      setAnswer("");
    } catch (e: any) {
      setMessage(e?.message || "Answer failed");
    } finally {
      setLoading(false);
    }
  }

  const promptText = prompt
    ? `Substrate ${prompt.substrate}\nReagent ${prompt.reagent}\nSolvent ${prompt.solvent}\nHeat ${prompt.heat ? "yes" : "no"}`
    : "";

  const statusBorder =
    correct === null
      ? "var(--border)"
      : correct
        ? "color-mix(in srgb, var(--green) 40%, var(--border))"
        : "var(--warn-border)";

  const statusBg =
    correct === null
      ? "var(--panel)"
      : correct
        ? "color-mix(in srgb, var(--green) 10%, var(--panel))"
        : "var(--warn-bg)";

  return (
    <main className="stack" style={{ padding: 18, maxWidth: 980 }}>
      <div className="card">
        <div className="cardInner">
          <div className="stack">
            <div>
              <div className="h1">
                {topicParam 
                  ? `Practice: ${topicParam.charAt(0).toUpperCase() + topicParam.slice(1).replace(/-/g, " ")}`
                  : courseParam 
                    ? `Practice: ${courseParam.replace("orgochem-", "OrgoChem ").replace("-", " ").toUpperCase()}`
                    : "Practice Problems"
                }
              </div>
              <div className="subtle">
                {topicParam === "substitution-elimination" 
                  ? "Answer the ladder. Then lock the pathway."
                  : "Practice problems with instant feedback. Track your progress and improve your understanding."
                }
              </div>
              {(courseParam || topicParam) && (
                <div style={{
                  marginTop: 8,
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
                  <div style={{ color: "rgba(0, 0, 0, 0.6)", fontSize: 13 }}>
                    Practice problems are tailored to this {topicParam ? "topic" : "course"}.
                  </div>
                </div>
              )}
            </div>

            <div className="row">
              <button className="btn btnPrimary" type="button" onClick={start} disabled={loading}>
                {loading ? "Loading" : "Start new"}
              </button>

              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{
                  padding: "8px 16px",
                  background: "rgba(0, 122, 255, 0.1)",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 700
                }}>
                  Score: {score}
                </div>

                {totalQuestions > 0 && (
                  <div style={{
                    padding: "8px 16px",
                    background: "rgba(52, 199, 89, 0.1)",
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#34C759"
                  }}>
                    {Math.round((correctAnswers / totalQuestions) * 100)}% ({correctAnswers}/{totalQuestions})
                  </div>
                )}

                {decision && (
                  <div className="subtle" style={{ fontWeight: 900 }}>
                    Decision: {decision.toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {(totalQuestions > 0 || sessionHistory.length > 0) && (
              <>
                <div className="divider" />
                <PracticeAchievements
                  totalQuestions={totalQuestions}
                  correctAnswers={correctAnswers}
                  sessionHistory={sessionHistory}
                />
              </>
            )}

            {prompt ? (
              <div className="card" style={{ boxShadow: "none" }}>
                <div className="cardInner" style={{ padding: 12 }}>
                  <div style={{ fontWeight: 950, marginBottom: 6 }}>Prompt</div>
                  <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>
                    {promptText}
                  </pre>
                </div>
              </div>
            ) : null}

            {decisionReason ? (
              <div className="card" style={{ boxShadow: "none" }}>
                <div className="cardInner" style={{ padding: 12 }}>
                  <div style={{ fontWeight: 950, marginBottom: 6 }}>Why</div>
                  <div className="subtle" style={{ color: "var(--text)" }}>
                    {decisionReason}
                  </div>
                </div>
              </div>
            ) : null}

            {question ? (
              <div className="card" style={{ boxShadow: "none" }}>
                <div className="cardInner" style={{ padding: 12 }}>
                  <div style={{ fontWeight: 950, marginBottom: 6 }}>Question</div>
                  <div className="subtle" style={{ marginBottom: 10, color: "var(--text)" }}>
                    {question.text}
                  </div>

                  <div className="row">
                    <input
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Type your answer"
                      disabled={loading}
                      className="input"
                      style={{ flex: 1 }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          submit();
                        }
                      }}
                    />

                    <button className="btn btnPrimary" type="button" onClick={submit} disabled={loading}>
                      {loading ? "Working" : "Submit"}
                    </button>
                  </div>

                  <div className="subtle" style={{ marginTop: 8 }}>
                    Tip: use short answers like primary secondary tertiary, strong weak, polar protic, polar aprotic
                  </div>
                </div>
              </div>
            ) : (
              <div className="subtle">Press Start new to begin</div>
            )}

            {message ? (
              <div className="card" style={{ boxShadow: "none", borderColor: statusBorder, background: statusBg }}>
                <div className="cardInner" style={{ padding: 12 }}>
                  <div style={{ fontWeight: 950, marginBottom: 6 }}>
                    {correct === null ? "Info" : correct ? "Correct" : "Not yet"}
                  </div>
                  <div className="subtle" style={{ color: "var(--text)" }}>
                    {message}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function PracticePage() {
  return (
    <Suspense
      fallback={
        <main className="stack" style={{ padding: 18, maxWidth: 980 }}>
          <div className="card">
            <div className="cardInner">
              <div className="subtle">Loading practice…</div>
            </div>
          </div>
        </main>
      }
    >
      <PracticePageContent />
    </Suspense>
  );
}
