"use client";

import { useState, useMemo } from "react";

type Problem = {
  id: string;
  question: string;
  type: "multiple-choice" | "short-answer" | "mechanism" | "synthesis";
  options?: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
};

type Props = {
  problems: Problem[];
  examTitle: string;
};

export default function ExamProblemSolver({ problems, examTitle }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const currentProblem = problems[currentIndex];
  const totalPoints = useMemo(() => problems.reduce((sum, p) => sum + p.points, 0), [problems]);
  const earnedPoints = useMemo(() => {
    return problems.reduce((sum, p) => {
      if (answers[p.id] && answers[p.id].toLowerCase().trim() === p.correctAnswer.toLowerCase().trim()) {
        return sum + p.points;
      }
      return sum;
    }, 0);
  }, [answers, problems]);

  const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

  const handleAnswer = (problemId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [problemId]: answer }));
    setShowFeedback((prev) => ({ ...prev, [problemId]: true }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    // Show feedback for all problems
    const allFeedback: Record<string, boolean> = {};
    problems.forEach((p) => {
      allFeedback[p.id] = true;
    });
    setShowFeedback(allFeedback);
  };

  const isCorrect = (problemId: string) => {
    const answer = answers[problemId];
    if (!answer) return null;
    const problem = problems.find((p) => p.id === problemId);
    if (!problem) return null;
    return answer.toLowerCase().trim() === problem.correctAnswer.toLowerCase().trim();
  };

  if (problems.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <div style={{ fontSize: 16, color: "rgba(0, 0, 0, 0.6)" }}>
          No problems available. Upload an exam file to get started.
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 24 }}>
      {/* Header with progress */}
      <div style={{
        padding: 20,
        background: "linear-gradient(135deg, rgba(0, 122, 255, 0.08) 0%, rgba(88, 86, 214, 0.08) 100%)",
        borderRadius: 16,
        border: "1px solid rgba(0, 122, 255, 0.2)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(0, 0, 0, 0.6)", marginBottom: 4 }}>
              {examTitle}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>
              Problem {currentIndex + 1} of {problems.length}
            </div>
          </div>
          {submitted && (
            <div style={{
              padding: "12px 20px",
              background: "white",
              borderRadius: 12,
              border: "1px solid rgba(0, 122, 255, 0.2)",
              textAlign: "center"
            }}>
              <div style={{ fontSize: 12, color: "rgba(0, 0, 0, 0.6)", marginBottom: 4 }}>Score</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#007AFF" }}>
                {earnedPoints} / {totalPoints}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: percentage >= 90 ? "#34C759" : percentage >= 70 ? "#FF9500" : "#FF3B30" }}>
                {percentage}%
              </div>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div style={{
          width: "100%",
          height: 8,
          background: "rgba(0, 0, 0, 0.08)",
          borderRadius: 4,
          overflow: "hidden"
        }}>
          <div style={{
            width: `${((currentIndex + 1) / problems.length) * 100}%`,
            height: "100%",
            background: "linear-gradient(90deg, #007AFF, #5856D6)",
            transition: "width 0.3s ease"
          }} />
        </div>
      </div>

      {/* Current Problem */}
      {currentProblem && (
        <div style={{
          padding: 24,
          background: "white",
          borderRadius: 16,
          border: "1px solid rgba(0, 0, 0, 0.08)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)"
        }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{
              display: "inline-block",
              padding: "6px 12px",
              background: "rgba(0, 122, 255, 0.1)",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              color: "#007AFF",
              marginBottom: 16
            }}>
              {currentProblem.type.replace("-", " ").toUpperCase()} · {currentProblem.points} points
            </div>
            <div style={{ fontSize: 18, lineHeight: 1.6, color: "rgba(0, 0, 0, 0.9)", marginBottom: 20 }}>
              {currentProblem.question}
            </div>
          </div>

          {/* Answer Input */}
          {currentProblem.type === "multiple-choice" && currentProblem.options ? (
            <div style={{ display: "grid", gap: 12 }}>
              {currentProblem.options.map((option, idx) => {
                const isSelected = answers[currentProblem.id] === option;
                const correct = isCorrect(currentProblem.id);
                const show = showFeedback[currentProblem.id];

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => !submitted && handleAnswer(currentProblem.id, option)}
                    disabled={submitted}
                    style={{
                      padding: 16,
                      textAlign: "left",
                      borderRadius: 12,
                      border: `2px solid ${
                        show && isSelected && correct
                          ? "#34C759"
                          : show && isSelected && !correct
                          ? "#FF3B30"
                          : show && option === currentProblem.correctAnswer
                          ? "#34C759"
                          : isSelected
                          ? "#007AFF"
                          : "rgba(0, 0, 0, 0.1)"
                      }`,
                      background:
                        show && isSelected && correct
                          ? "rgba(52, 199, 89, 0.1)"
                          : show && isSelected && !correct
                          ? "rgba(255, 59, 48, 0.1)"
                          : show && option === currentProblem.correctAnswer
                          ? "rgba(52, 199, 89, 0.1)"
                          : isSelected
                          ? "rgba(0, 122, 255, 0.08)"
                          : "white",
                      cursor: submitted ? "default" : "pointer",
                      transition: "all 0.2s ease",
                      fontSize: 15,
                      fontWeight: isSelected ? 600 : 400,
                      color: "rgba(0, 0, 0, 0.9)"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        border: `2px solid ${
                          show && isSelected && correct
                            ? "#34C759"
                            : show && isSelected && !correct
                            ? "#FF3B30"
                            : show && option === currentProblem.correctAnswer
                            ? "#34C759"
                            : isSelected
                            ? "#007AFF"
                            : "rgba(0, 0, 0, 0.3)"
                        }`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}>
                        {isSelected && (
                          <div style={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            background:
                              show && correct
                                ? "#34C759"
                                : show && !correct
                                ? "#FF3B30"
                                : "#007AFF"
                          }} />
                        )}
                      </div>
                      <div>{option}</div>
                      {show && option === currentProblem.correctAnswer && (
                        <div style={{ marginLeft: "auto", fontSize: 18 }}>✓</div>
                      )}
                      {show && isSelected && !correct && (
                        <div style={{ marginLeft: "auto", fontSize: 18, color: "#FF3B30" }}>✗</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <textarea
              value={answers[currentProblem.id] || ""}
              onChange={(e) => !submitted && handleAnswer(currentProblem.id, e.target.value)}
              disabled={submitted}
              placeholder="Type your answer here..."
              style={{
                width: "100%",
                minHeight: 120,
                padding: 16,
                borderRadius: 12,
                border: "2px solid rgba(0, 0, 0, 0.1)",
                fontSize: 15,
                fontFamily: "inherit",
                resize: "vertical"
              }}
            />
          )}

          {/* Feedback */}
          {showFeedback[currentProblem.id] && (
            <div style={{
              marginTop: 20,
              padding: 16,
              borderRadius: 12,
              background: isCorrect(currentProblem.id)
                ? "rgba(52, 199, 89, 0.1)"
                : "rgba(255, 59, 48, 0.1)",
              border: `1px solid ${isCorrect(currentProblem.id) ? "#34C759" : "#FF3B30"}`
            }}>
              <div style={{
                fontSize: 14,
                fontWeight: 600,
                color: isCorrect(currentProblem.id) ? "#34C759" : "#FF3B30",
                marginBottom: 8
              }}>
                {isCorrect(currentProblem.id) ? "✓ Correct!" : "✗ Incorrect"}
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(0, 0, 0, 0.8)" }}>
                <strong>Correct answer:</strong> {currentProblem.correctAnswer}
              </div>
              {currentProblem.explanation && (
                <div style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(0, 0, 0, 0.7)", marginTop: 8 }}>
                  <strong>Explanation:</strong> {currentProblem.explanation}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <button
          type="button"
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          style={{
            padding: "12px 24px",
            borderRadius: 12,
            border: "1px solid rgba(0, 0, 0, 0.1)",
            background: "white",
            cursor: currentIndex === 0 ? "not-allowed" : "pointer",
            opacity: currentIndex === 0 ? 0.5 : 1,
            fontSize: 15,
            fontWeight: 600
          }}
        >
          ← Previous
        </button>

        <div style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.6)" }}>
          {Object.keys(answers).length} of {problems.length} answered
        </div>

        {currentIndex < problems.length - 1 ? (
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => Math.min(problems.length - 1, prev + 1))}
            style={{
              padding: "12px 24px",
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(135deg, #007AFF, #5856D6)",
              color: "white",
              cursor: "pointer",
              fontSize: 15,
              fontWeight: 600
            }}
          >
            Next →
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitted || Object.keys(answers).length < problems.length}
            style={{
              padding: "12px 24px",
              borderRadius: 12,
              border: "none",
              background: submitted || Object.keys(answers).length < problems.length
                ? "rgba(0, 0, 0, 0.1)"
                : "linear-gradient(135deg, #34C759, #30D158)",
              color: submitted || Object.keys(answers).length < problems.length ? "rgba(0, 0, 0, 0.4)" : "white",
              cursor: submitted || Object.keys(answers).length < problems.length ? "not-allowed" : "pointer",
              fontSize: 15,
              fontWeight: 600
            }}
          >
            {submitted ? "Submitted" : "Submit Exam"}
          </button>
        )}
      </div>
    </div>
  );
}
