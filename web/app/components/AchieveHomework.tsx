"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { CourseId } from "../lib/curriculum";
import { getCourseTopics } from "../lib/curriculum";
import { getProgress } from "../lib/progress";
import ChemistryDrawingCanvas from "./ChemistryDrawingCanvas";

type HomeworkProblem = {
  id: string;
  topic: string;
  courseId: CourseId;
  question: string;
  type: "multiple-choice" | "drawing";
  difficulty: "easy" | "medium" | "hard";
  points: number;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  hints: string[];
};

type Props = {
  course?: CourseId;
  topic?: string;
};

export default function AchieveHomework({ course, topic }: Props) {
  const [problems, setProblems] = useState<HomeworkProblem[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [drawings, setDrawings] = useState<Record<string, string>>({}); // For drawing problems
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateProblems();
  }, [course, topic]);

  async function generateProblems() {
    setLoading(true);
    
    if (topic && course) {
      // Use API to generate problems for specific topic
      try {
        const response = await fetch(`/api/generate-problems?course=${course}&topic=${topic}&count=10`);
        if (response.ok) {
          const data = await response.json();
          if (data.problems && data.problems.length > 0) {
            // Convert API problems to HomeworkProblem format - ensure multiple-choice
            const converted: HomeworkProblem[] = data.problems.map((p: any, idx: number) => {
              // Convert non-multiple-choice to multiple-choice if needed
              if (p.type !== "multiple-choice" && p.type !== "drawing") {
                // Convert to multiple-choice with options
                return {
                  id: p.id,
                  topic: topic,
                  courseId: course,
                  question: p.question,
                  type: "multiple-choice" as const,
                  difficulty: idx < 3 ? "easy" : idx < 7 ? "medium" : "hard",
                  points: p.points,
                  options: p.options || [
                    p.correctAnswer || "Option A",
                    "Option B",
                    "Option C",
                    "Option D"
                  ],
                  correctAnswer: p.correctAnswer,
                  explanation: p.explanation,
                  hints: [
                    "Review the must-know items for this topic",
                    "Check the study steps for guidance",
                    "Refer to the external textbook reference",
                  ],
                };
              }
              return {
                id: p.id,
                topic: topic,
                courseId: course,
                question: p.question,
                type: p.type === "drawing" ? "drawing" : "multiple-choice",
                difficulty: idx < 3 ? "easy" : idx < 7 ? "medium" : "hard",
                points: p.points,
                options: p.options,
                correctAnswer: p.correctAnswer,
                explanation: p.explanation,
                hints: [
                  "Review the must-know items for this topic",
                  "Check the study steps for guidance",
                  "Refer to the external textbook reference",
                ],
              };
            });
            setProblems(converted);
            setTotalPoints(converted.reduce((sum, p) => sum + p.points, 0));
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error("Failed to generate problems:", error);
      }
    }
    
    // Fallback to manual generation
    generateProblemsManual();
  }

  function generateProblemsManual() {
    // Generate problems based on course/topic
    const orgochem1Topics = getCourseTopics("orgochem-1");
    const orgochem2Topics = getCourseTopics("orgochem-2");
    const allTopics = course === "orgochem-1" 
      ? orgochem1Topics 
      : course === "orgochem-2" 
      ? orgochem2Topics 
      : [...orgochem1Topics, ...orgochem2Topics];

    const filteredTopics = topic 
      ? allTopics.filter((t) => t.slug === topic)
      : allTopics;

    const generated: HomeworkProblem[] = [];

    filteredTopics.forEach((t, idx) => {
      const courseId = orgochem1Topics.includes(t) ? "orgochem-1" : "orgochem-2";
      
      // Generate 2-3 problems per topic - all multiple-choice or drawing
      for (let i = 0; i < 2; i++) {
        const problemId = `${courseId}-${t.slug}-${i}`;
        
        if (t.slug.includes("stereochemistry")) {
          generated.push({
            id: problemId,
            topic: t.slug,
            courseId,
            question: `Draw the Newman projection for the most stable conformation of butane.`,
            type: "drawing",
            difficulty: i === 0 ? "easy" : "medium",
            points: i === 0 ? 10 : 15,
            correctAnswer: "Anti conformation with methyl groups 180° apart",
            explanation: "The anti conformation is most stable because the methyl groups are 180° apart, minimizing steric interactions.",
            hints: [
              "Draw Newman projection looking down C2-C3 bond",
              "Anti conformation has methyl groups 180° apart",
              "This minimizes steric interactions",
            ],
          });
        } else if (t.slug.includes("substitution") || t.slug.includes("elimination")) {
          generated.push({
            id: problemId,
            topic: t.slug,
            courseId,
            question: `What mechanism occurs when CH₃CH₂Br reacts with NaOCH₃ in DMSO?`,
            type: "multiple-choice",
            options: [
              "SN2 mechanism",
              "SN1 mechanism",
              "E1 mechanism",
              "E2 mechanism"
            ],
            correctAnswer: "SN2 mechanism",
            difficulty: i === 0 ? "medium" : "hard",
            points: i === 0 ? 10 : 15,
            explanation: "Primary alkyl halide + strong nucleophile in polar aprotic solvent → SN2. Product is substitution with inversion of configuration.",
            hints: [
              "Consider the substrate: primary, secondary, or tertiary?",
              "Check the nucleophile/base strength",
              "Polar aprotic solvents favor SN2",
            ],
          });
        } else if (t.slug.includes("alkanes")) {
          generated.push({
            id: problemId,
            topic: t.slug,
            courseId,
            question: `What is the IUPAC name for (CH₃)₂CHCH₂CH(CH₃)₂?`,
            type: "multiple-choice",
            options: [
              "2,4-dimethylpentane",
              "1,1,3-trimethylbutane",
              "2-methyl-4-methylpentane",
              "isoheptane"
            ],
            correctAnswer: "2,4-dimethylpentane",
            difficulty: "medium",
            points: 10,
            explanation: "The longest continuous chain has 5 carbons (pentane). There are two methyl groups, one on carbon 2 and one on carbon 4.",
            hints: [
              "Find the longest continuous chain",
              "Number to give lowest substituent numbers",
              "List substituents alphabetically",
            ],
          });
        } else {
          // Generic multiple-choice problem
          const concept = t.mustKnow[0] || t.title;
          generated.push({
            id: problemId,
            topic: t.slug,
            courseId,
            question: `Which of the following is a key concept for ${t.title}?`,
            type: "multiple-choice",
            options: [
              concept,
              t.mustKnow[1] || "Option B",
              t.mustKnow[2] || "Option C",
              "None of the above"
            ],
            correctAnswer: concept,
            difficulty: "medium",
            points: 10,
            explanation: t.summary,
            hints: [
              `Review the must-know items for ${t.title}`,
              `Check the study steps for ${t.title}`,
              `Refer to the external textbook reference`,
            ],
          });
        }
      }
    });

    setProblems(generated.slice(0, 10)); // Limit to 10 problems
    setTotalPoints(generated.reduce((sum, p) => sum + p.points, 0));
    setLoading(false);
  }

  const currentProblem = problems[currentProblemIndex];
  const progress = problems.length > 0 ? ((completed.size / problems.length) * 100).toFixed(0) : 0;

  function handleSubmit(problemId: string) {
    const problem = problems.find((p) => p.id === problemId);
    if (!problem) return;

    if (problem.type === "drawing") {
      // For drawing problems, just mark as completed if drawing exists
      const drawing = drawings[problemId];
      if (drawing && !completed.has(problemId)) {
        setScore((prev) => prev + problem.points);
        setCompleted((prev) => new Set([...prev, problemId]));
      }
    } else {
      // Multiple-choice problems
      const userAnswer = userAnswers[problemId]?.trim().toLowerCase();
      const correct = problem.correctAnswer 
        ? userAnswer === problem.correctAnswer.toLowerCase()
        : false;

      if (correct && !completed.has(problemId)) {
        setScore((prev) => prev + problem.points);
        setCompleted((prev) => new Set([...prev, problemId]));
      }
    }

    setShowExplanation((prev) => ({ ...prev, [problemId]: true }));
  }

  function handleNext() {
    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex(currentProblemIndex + 1);
    }
  }

  function handlePrevious() {
    if (currentProblemIndex > 0) {
      setCurrentProblemIndex(currentProblemIndex - 1);
    }
  }

  if (loading) {
    return (
      <div className="card" style={{ padding: 40, textAlign: "center" }}>
        <div>Loading homework problems...</div>
      </div>
    );
  }

  if (problems.length === 0) {
    return (
      <div className="card" style={{ padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No homework available</div>
        <div className="subtle">Select a course or topic to generate homework problems</div>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Interactive Homework</div>
            <div className="subtle" style={{ fontSize: 13 }}>
              Achieve-style practice with immediate feedback
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--blue)", marginBottom: 4 }}>
              {score} / {totalPoints}
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Points Earned</div>
          </div>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
            <span style={{ color: "var(--muted)" }}>
              Problem {currentProblemIndex + 1} of {problems.length}
            </span>
            <span style={{ color: "var(--muted)" }}>
              {completed.size} completed • {progress}%
            </span>
          </div>
          <div style={{
            width: "100%",
            height: 8,
            background: "var(--border)",
            borderRadius: 4,
            overflow: "hidden",
          }}>
            <div style={{
              width: `${progress}%`,
              height: "100%",
              background: "linear-gradient(90deg, var(--blue), var(--purple))",
              transition: "width 0.3s ease",
            }} />
          </div>
        </div>
      </div>

      {/* Current Problem */}
      {currentProblem && (
        <div style={{ marginBottom: 24 }}>
          <div style={{
            padding: 20,
            background: "var(--panel-2)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
            marginBottom: 16,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4, textTransform: "uppercase" }}>
                  {currentProblem.difficulty} • {currentProblem.points} points
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "var(--text)" }}>
                  {currentProblem.question}
                </div>
              </div>
              {completed.has(currentProblem.id) && (
                <div style={{
                  fontSize: 24,
                  color: "var(--green)",
                  marginLeft: 16,
                }}>
                  ✓
                </div>
              )}
            </div>

            {/* Answer Input */}
            {currentProblem.type === "drawing" ? (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: "var(--text)" }}>
                  Draw your answer:
                </div>
                <ChemistryDrawingCanvas
                  value={drawings[currentProblem.id]}
                  onChange={(imageData) => {
                    setDrawings((prev) => ({ ...prev, [currentProblem.id]: imageData }));
                  }}
                  disabled={completed.has(currentProblem.id)}
                  width={600}
                  height={400}
                />
              </div>
            ) : currentProblem.type === "multiple-choice" && currentProblem.options ? (
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "grid", gap: 8 }}>
                  {currentProblem.options.map((option, idx) => {
                    const isSelected = userAnswers[currentProblem.id] === option;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (!completed.has(currentProblem.id)) {
                            setUserAnswers((prev) => ({ ...prev, [currentProblem.id]: option }));
                          }
                        }}
                        disabled={completed.has(currentProblem.id)}
                        style={{
                          padding: 12,
                          textAlign: "left",
                          borderRadius: "var(--radius-sm)",
                          border: `2px solid ${isSelected ? "var(--blue)" : "var(--border)"}`,
                          background: isSelected ? "rgba(0, 122, 255, 0.1)" : "var(--panel)",
                          cursor: completed.has(currentProblem.id) ? "default" : "pointer",
                          fontSize: 15,
                          fontWeight: isSelected ? 600 : 400,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            border: `2px solid ${isSelected ? "var(--blue)" : "var(--border)"}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}>
                            {isSelected && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--blue)" }} />}
                          </div>
                          <div>{option}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: 12 }}>
                <input
                  type="text"
                  value={userAnswers[currentProblem.id] || ""}
                  onChange={(e) => setUserAnswers((prev) => ({ ...prev, [currentProblem.id]: e.target.value }))}
                  placeholder="Enter your answer..."
                  disabled={completed.has(currentProblem.id)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border)",
                    background: "var(--panel)",
                    color: "var(--text)",
                    fontSize: 15,
                    outline: "none",
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !completed.has(currentProblem.id)) {
                      handleSubmit(currentProblem.id);
                    }
                  }}
                />
              </div>
            )}

            {/* Hints */}
            {currentProblem.hints.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowHints((prev) => ({ ...prev, [currentProblem.id]: !prev[currentProblem.id] }))}
                  style={{ fontSize: 13, padding: "6px 12px" }}
                >
                  {showHints[currentProblem.id] ? "Hide" : "Show"} Hints ({currentProblem.hints.length})
                </button>
                {showHints[currentProblem.id] && (
                  <div style={{ marginTop: 8, padding: 12, background: "var(--panel)", borderRadius: "var(--radius-sm)" }}>
                    {currentProblem.hints.map((hint, idx) => (
                      <div key={idx} style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>
                        {idx + 1}. {hint}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            {!completed.has(currentProblem.id) && (
              <button
                type="button"
                className="btn btnPrimary"
                onClick={() => handleSubmit(currentProblem.id)}
                disabled={
                  currentProblem.type === "multiple-choice" 
                    ? !userAnswers[currentProblem.id]?.trim()
                    : currentProblem.type === "drawing"
                    ? !drawings[currentProblem.id]
                    : true
                }
                style={{ width: "100%" }}
              >
                Submit Answer
              </button>
            )}

            {/* Explanation */}
            {showExplanation[currentProblem.id] && currentProblem.explanation && (
              <div style={{
                marginTop: 16,
                padding: 16,
                background: completed.has(currentProblem.id) 
                  ? "rgba(52, 199, 89, 0.1)" 
                  : "rgba(255, 149, 0, 0.1)",
                border: `1px solid ${completed.has(currentProblem.id) ? "rgba(52, 199, 89, 0.3)" : "rgba(255, 149, 0, 0.3)"}`,
                borderRadius: "var(--radius-sm)",
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: "var(--text)" }}>
                  {completed.has(currentProblem.id) ? "✓ Correct!" : "Explanation"}
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text)" }}>
                  {currentProblem.explanation}
                </div>
                {currentProblem.correctAnswer && (
                  <div style={{ marginTop: 8, fontSize: 13, color: "var(--muted)" }}>
                    Correct answer: <strong>{currentProblem.correctAnswer}</strong>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
            <button
              type="button"
              className="btn"
              onClick={handlePrevious}
              disabled={currentProblemIndex === 0}
              style={{ opacity: currentProblemIndex === 0 ? 0.5 : 1 }}
            >
              ← Previous
            </button>
            <div style={{ fontSize: 13, color: "var(--muted)", display: "flex", alignItems: "center" }}>
              {currentProblemIndex + 1} / {problems.length}
            </div>
            <button
              type="button"
              className="btn"
              onClick={handleNext}
              disabled={currentProblemIndex === problems.length - 1}
              style={{ opacity: currentProblemIndex === problems.length - 1 ? 0.5 : 1 }}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Problem List */}
      <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>All Problems</div>
        <div style={{ display: "grid", gap: 8 }}>
          {problems.map((problem, idx) => (
            <button
              key={problem.id}
              type="button"
              onClick={() => setCurrentProblemIndex(idx)}
              style={{
                padding: 12,
                background: idx === currentProblemIndex ? "var(--panel-2)" : "var(--panel)",
                border: `1px solid ${idx === currentProblemIndex ? "var(--blue)" : "var(--border)"}`,
                borderRadius: "var(--radius-sm)",
                textAlign: "left",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                  Problem {idx + 1}: {problem.difficulty} • {problem.points} pts
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                  {problem.question.substring(0, 60)}...
                </div>
              </div>
              {completed.has(problem.id) && (
                <div style={{ fontSize: 20, color: "var(--green)", marginLeft: 12 }}>✓</div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
