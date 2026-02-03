"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getHomeworkProblems, getCourseHomeworkProblems, type HomeworkProblem } from "../lib/homework-problems";
import type { CourseId } from "../lib/curriculum";
import ProfessorAssignmentCreator from "./ProfessorAssignmentCreator";

type Assignment = {
  id: string;
  title: string;
  courseId: CourseId;
  topic?: string;
  problems: HomeworkProblem[];
  dueDate?: string;
  totalPoints: number;
  createdAt: string;
};

type Submission = {
  assignmentId: string;
  answers: Record<string, string>;
  submittedAt: string;
  score: number;
  percentage: number;
  graded: boolean;
  feedback?: Record<string, {
    correct: boolean;
    pointsEarned: number;
    feedback: string;
  }>;
};

type Props = {
  course: CourseId;
  topic?: string;
  assignmentId?: string; // For viewing specific assignment
  backHref?: string; // e.g. "/assignments" when on assignment page
};

export default function GradedHomework({ course, topic, assignmentId, backHref }: Props) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Record<string, Submission>>({});
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({});
  const [gradingMode, setGradingMode] = useState(false);
  const [showCreator, setShowCreator] = useState(false);

  // Load assignments and submissions from localStorage
  useEffect(() => {
    const savedAssignments = localStorage.getItem(`orgopivy-assignments-${course}`);
    const savedSubmissions = localStorage.getItem(`orgopivy-submissions-${course}`);
    
    if (savedAssignments) {
      try {
        setAssignments(JSON.parse(savedAssignments));
      } catch (e) {
        console.error("Failed to load assignments", e);
      }
    }
    
    if (savedSubmissions) {
      try {
        setSubmissions(JSON.parse(savedSubmissions));
      } catch (e) {
        console.error("Failed to load submissions", e);
      }
    }
  }, [course]);

  // Load or create assignment
  useEffect(() => {
    if (assignmentId) {
      const assignment = assignments.find(a => a.id === assignmentId);
      if (assignment) {
        setCurrentAssignment(assignment);
        // Load saved answers if exists
        const submission = submissions[assignmentId];
        if (submission) {
          setAnswers(submission.answers);
          setSubmitted(submission.graded);
          setShowFeedback(Object.keys(submission.feedback || {}).reduce((acc, key) => {
            acc[key] = true;
            return acc;
          }, {} as Record<string, boolean>));
        }
      }
    } else if (topic) {
      // Create new assignment for topic
      const problems = getHomeworkProblems(topic, 5); // 5 problems per assignment
      if (problems.length > 0) {
        const newAssignment: Assignment = {
          id: `hw-${course}-${topic}-${Date.now()}`,
          title: `${problems[0].topic.charAt(0).toUpperCase() + problems[0].topic.slice(1).replace(/-/g, " ")} Homework Assignment`,
          courseId: course,
          topic: topic,
          problems: problems,
          totalPoints: problems.reduce((sum, p) => sum + p.points, 0),
          createdAt: new Date().toISOString(),
        };
        setCurrentAssignment(newAssignment);
      }
    }
  }, [assignmentId, topic, course, assignments]);

  const currentProblem = currentAssignment?.problems[currentProblemIndex];
  const totalPoints = currentAssignment?.totalPoints || 0;
  
  const score = useMemo(() => {
    if (!currentAssignment || !submitted) return 0;
    const submission = submissions[currentAssignment.id];
    return submission?.score || 0;
  }, [currentAssignment, submitted, submissions]);

  const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;

  function handleAnswer(problemId: string, answer: string) {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [problemId]: answer }));
  }

  function gradeAnswer(problem: HomeworkProblem, answer: string): {
    correct: boolean;
    pointsEarned: number;
    feedback: string;
  } {
    const userAnswer = answer.trim().toLowerCase();
    const correctAnswer = problem.correctAnswer.toLowerCase();
    
    // Check for exact match or partial match
    const isExactMatch = userAnswer === correctAnswer;
    const containsCorrect = userAnswer.includes(correctAnswer) || correctAnswer.includes(userAnswer);
    
    if (isExactMatch || containsCorrect) {
      return {
        correct: true,
        pointsEarned: problem.points,
        feedback: `✓ Correct! ${problem.explanation}`
      };
    }
    
    // Partial credit logic (can be enhanced)
    let partialPoints = 0;
    let feedback = `✗ Incorrect. `;
    
    // Check for common mistakes
    if (problem.rubric?.commonMistakes.some(mistake => userAnswer.includes(mistake.toLowerCase()))) {
      partialPoints = Math.floor(problem.points * 0.3);
      feedback += `You made a common mistake. `;
    }
    
    feedback += `Correct answer: ${problem.correctAnswer}. ${problem.explanation}`;
    
    return {
      correct: false,
      pointsEarned: partialPoints,
      feedback: feedback
    };
  }

  function handleSubmit() {
    if (!currentAssignment || submitted) return;
    
    const feedback: Record<string, { correct: boolean; pointsEarned: number; feedback: string }> = {};
    let totalScore = 0;
    
    currentAssignment.problems.forEach(problem => {
      const answer = answers[problem.id] || "";
      const result = gradeAnswer(problem, answer);
      feedback[problem.id] = result;
      totalScore += result.pointsEarned;
      setShowFeedback(prev => ({ ...prev, [problem.id]: true }));
    });
    
    const submission: Submission = {
      assignmentId: currentAssignment.id,
      answers: { ...answers },
      submittedAt: new Date().toISOString(),
      score: totalScore,
      percentage: Math.round((totalScore / totalPoints) * 100),
      graded: true,
      feedback: feedback
    };
    
    setSubmissions(prev => {
      const updated = { ...prev, [currentAssignment.id]: submission };
      localStorage.setItem(`orgopivy-submissions-${course}`, JSON.stringify(updated));
      return updated;
    });
    
    setSubmitted(true);
  }

  function createNewAssignment() {
    if (!topic) return;
    const problems = getHomeworkProblems(topic, 5);
    if (problems.length === 0) {
      alert("No problems available for this topic yet.");
      return;
    }
    
    const newAssignment: Assignment = {
      id: `hw-${course}-${topic}-${Date.now()}`,
      title: `${problems[0].topic.charAt(0).toUpperCase() + problems[0].topic.slice(1).replace(/-/g, " ")} Homework Assignment`,
      courseId: course,
      topic: topic,
      problems: problems,
      totalPoints: problems.reduce((sum, p) => sum + p.points, 0),
      createdAt: new Date().toISOString(),
    };
    
    setAssignments(prev => {
      const updated = [...prev, newAssignment];
      localStorage.setItem(`orgopivy-assignments-${course}`, JSON.stringify(updated));
      return updated;
    });
    
    setCurrentAssignment(newAssignment);
    setAnswers({});
    setSubmitted(false);
    setShowFeedback({});
    setCurrentProblemIndex(0);
  }

  if (!currentAssignment) {
    return (
      <div className="card" style={{ padding: 40 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Graded Homework Assignments</div>
          <div className="subtle" style={{ fontSize: 15 }}>
            Professional-grade assignments with automatic grading and detailed feedback
          </div>
        </div>

        {/* Professor Assignment Creator */}
        <div style={{ marginBottom: 32 }}>
          <ProfessorAssignmentCreator 
            course={course} 
            topic={topic || undefined}
            onAssignmentCreated={(assignmentId) => {
              // Reload assignments
              const saved = localStorage.getItem(`orgopivy-assignments-${course}`);
              if (saved) {
                try {
                  const loaded = JSON.parse(saved);
                  setAssignments(loaded);
                  const newAssignment = loaded.find((a: Assignment) => a.id === assignmentId);
                  if (newAssignment) {
                    setCurrentAssignment(newAssignment);
                  }
                } catch (e) {
                  console.error("Failed to load assignments", e);
                }
              }
            }}
          />
        </div>

        {assignments.length > 0 && (
          <>
            <div className="divider" style={{ marginBottom: 24 }} />
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Your Assignments</div>
            <div style={{ display: "grid", gap: 12 }}>
              {assignments.map(assignment => {
                const submission = submissions[assignment.id];
                return (
                  <div
                    key={assignment.id}
                    onClick={() => setCurrentAssignment(assignment)}
                    style={{
                      padding: 16,
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                      cursor: "pointer",
                      background: "var(--panel)",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--blue)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                          {assignment.title}
                        </div>
                        <div className="subtle" style={{ fontSize: 13 }}>
                          {assignment.problems.length} problems • {assignment.totalPoints} points
                        </div>
                      </div>
                      {submission && (
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 20, fontWeight: 700, color: "var(--blue)" }}>
                            {submission.percentage}%
                          </div>
                          <div className="subtle" style={{ fontSize: 12 }}>
                            {submission.score}/{assignment.totalPoints}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  }

  const submission = submissions[currentAssignment.id];
  const isProfessor = typeof window !== "undefined" && localStorage.getItem("orgopivy-is-professor") === "true";

  function exportForStudents() {
    const data = {
      ...currentAssignment,
      courseId: course,
      course: course,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentAssignment.title.replace(/[^a-z0-9]/gi, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="card" style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{currentAssignment.title}</div>
            <div className="subtle" style={{ fontSize: 13 }}>
              {currentAssignment.problems.length} problems • {totalPoints} total points
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {isProfessor && (
              <button type="button" className="btn" onClick={exportForStudents} style={{ fontSize: 13 }}>
                Export for students
              </button>
            )}
            {submitted && submission && (
              <div style={{ textAlign: "right", padding: 16, background: "var(--panel-2)", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Final Score</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: percentage >= 90 ? "var(--green)" : percentage >= 70 ? "var(--orange)" : "var(--red)" }}>
                  {percentage}%
                </div>
                <div className="subtle" style={{ fontSize: 13 }}>
                  {submission.score} / {totalPoints} points
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
            <span style={{ color: "var(--muted)" }}>
              Problem {currentProblemIndex + 1} of {currentAssignment.problems.length}
            </span>
            <span style={{ color: "var(--muted)" }}>
              {Object.keys(answers).length} answered
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
              width: `${((currentProblemIndex + 1) / currentAssignment.problems.length) * 100}%`,
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
            padding: 24,
            background: "var(--panel-2)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
            marginBottom: 16,
          }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8, textTransform: "uppercase" }}>
                {currentProblem.type.replace("-", " ")} • {currentProblem.difficulty} • {currentProblem.points} points
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: "var(--text)", lineHeight: 1.6 }}>
                {currentProblem.question}
              </div>
            </div>

            {/* Answer Input */}
            {currentProblem.type === "multiple-choice" && currentProblem.options ? (
              <div style={{ display: "grid", gap: 12 }}>
                {currentProblem.options.map((option, idx) => {
                  const isSelected = answers[currentProblem.id] === option;
                  const feedback = submission?.feedback?.[currentProblem.id];
                  const isCorrect = feedback?.correct;
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
                        borderRadius: "var(--radius-sm)",
                        border: `2px solid ${
                          show && isSelected && isCorrect
                            ? "var(--green)"
                            : show && isSelected && !isCorrect
                            ? "var(--red)"
                            : show && option === currentProblem.correctAnswer
                            ? "var(--green)"
                            : isSelected
                            ? "var(--blue)"
                            : "var(--border)"
                        }`,
                        background: show && isSelected && isCorrect
                          ? "rgba(52, 199, 89, 0.1)"
                          : show && isSelected && !isCorrect
                          ? "rgba(255, 59, 48, 0.1)"
                          : show && option === currentProblem.correctAnswer
                          ? "rgba(52, 199, 89, 0.1)"
                          : isSelected
                          ? "rgba(0, 122, 255, 0.08)"
                          : "var(--panel)",
                        cursor: submitted ? "default" : "pointer",
                        fontSize: 15,
                        fontWeight: isSelected ? 600 : 400,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          border: `2px solid ${isSelected ? "var(--blue)" : "var(--border)"}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}>
                          {isSelected && <div style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--blue)" }} />}
                        </div>
                        <div>{option}</div>
                        {show && option === currentProblem.correctAnswer && <div style={{ marginLeft: "auto", fontSize: 20, color: "var(--green)" }}>✓</div>}
                        {show && isSelected && !isCorrect && <div style={{ marginLeft: "auto", fontSize: 20, color: "var(--red)" }}>✗</div>}
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
                  minHeight: 150,
                  padding: 16,
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border)",
                  background: "var(--panel)",
                  color: "var(--text)",
                  fontSize: 15,
                  fontFamily: "inherit",
                  resize: "vertical",
                }}
              />
            )}

            {/* Feedback */}
            {showFeedback[currentProblem.id] && submission?.feedback?.[currentProblem.id] && (
              <div style={{
                marginTop: 16,
                padding: 16,
                borderRadius: "var(--radius-sm)",
                background: submission.feedback[currentProblem.id].correct
                  ? "rgba(52, 199, 89, 0.1)"
                  : "rgba(255, 149, 0, 0.1)",
                border: `1px solid ${submission.feedback[currentProblem.id].correct ? "rgba(52, 199, 89, 0.3)" : "rgba(255, 149, 0, 0.3)"}`,
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: "var(--text)" }}>
                  {submission.feedback[currentProblem.id].correct ? "✓ Correct!" : "✗ Incorrect"}
                  <span style={{ marginLeft: 12, color: "var(--muted)", fontWeight: 400 }}>
                    ({submission.feedback[currentProblem.id].pointsEarned} / {currentProblem.points} points)
                  </span>
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text)", whiteSpace: "pre-wrap" }}>
                  {submission.feedback[currentProblem.id].feedback}
                </div>
                {currentProblem.rubric && (
                  <div style={{ marginTop: 12, padding: 12, background: "var(--panel)", borderRadius: "var(--radius-sm)" }}>
                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: "var(--muted)" }}>Grading Rubric</div>
                    <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 4 }}>
                      <strong>Full Credit:</strong> {currentProblem.rubric.fullCredit}
                    </div>
                    {currentProblem.rubric.partialCredit.length > 0 && (
                      <div style={{ fontSize: 13, color: "var(--text)", marginTop: 8 }}>
                        <strong>Partial Credit:</strong>
                        <ul style={{ margin: "4px 0 0 20px", padding: 0 }}>
                          {currentProblem.rubric.partialCredit.map((item, idx) => (
                            <li key={idx} style={{ marginBottom: 4 }}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
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
              onClick={() => setCurrentProblemIndex(Math.max(0, currentProblemIndex - 1))}
              disabled={currentProblemIndex === 0}
            >
              ← Previous
            </button>
            <div style={{ fontSize: 13, color: "var(--muted)", display: "flex", alignItems: "center" }}>
              {currentProblemIndex + 1} / {currentAssignment.problems.length}
            </div>
            {currentProblemIndex < currentAssignment.problems.length - 1 ? (
              <button
                type="button"
                className="btn btnPrimary"
                onClick={() => setCurrentProblemIndex(currentProblemIndex + 1)}
              >
                Next →
              </button>
            ) : (
              <button
                type="button"
                className="btn btnPrimary"
                onClick={handleSubmit}
                disabled={submitted || Object.keys(answers).length < currentAssignment.problems.length}
                style={{ opacity: submitted || Object.keys(answers).length < currentAssignment.problems.length ? 0.5 : 1 }}
              >
                {submitted ? "Submitted" : "Submit Assignment"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Back button */}
      <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
        {backHref ? (
          <Link href={backHref} className="btn">
            ← Back to Assignments
          </Link>
        ) : (
          <button
            type="button"
            className="btn"
            onClick={() => {
              setCurrentAssignment(null);
              setCurrentProblemIndex(0);
              setAnswers({});
              setSubmitted(false);
              setShowFeedback({});
            }}
          >
            ← Back to Assignments
          </button>
        )}
      </div>
    </div>
  );
}
