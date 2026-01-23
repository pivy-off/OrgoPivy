"use client";

import { useState, useEffect } from "react";
import { getCourseTopics, findTopic, type Topic, type CourseId } from "../lib/curriculum";
import type { HomeworkProblem } from "../lib/homework-problems";

type ProblemSuggestion = {
  question: string;
  type: "multiple-choice" | "synthesis" | "mechanism";
  options?: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
  difficulty: "easy" | "medium" | "hard";
  basedOn: string[]; // What curriculum concepts this is based on
};

type Props = {
  course: CourseId;
  topic?: string;
  onAssignmentCreated?: (assignmentId: string) => void;
};

export default function ProfessorAssignmentCreator({ course, topic, onAssignmentCreated }: Props) {
  const [isProfessor, setIsProfessor] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>(topic || "");
  const [suggestions, setSuggestions] = useState<ProblemSuggestion[]>([]);
  const [selectedProblems, setSelectedProblems] = useState<HomeworkProblem[]>([]);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const courseTopics = getCourseTopics(course);
  const currentTopic = selectedTopic ? findTopic(course, selectedTopic) : null;

  // Check if user is professor (for now, simple localStorage check - can be enhanced)
  useEffect(() => {
    const saved = localStorage.getItem("orgopivy-is-professor");
    setIsProfessor(saved === "true");
  }, []);

  function generateSuggestions(topicData: Topic): ProblemSuggestion[] {
    const suggestions: ProblemSuggestion[] = [];

    // Generate multiple-choice questions from must-know items
    topicData.mustKnow.forEach((concept, idx) => {
      if (suggestions.length >= 10) return;

      const conceptWords = concept.split(" ");
      const mainConcept = conceptWords.slice(0, 3).join(" ");

      // Create structured multiple-choice questions
      if (concept.includes("naming") || concept.includes("IUPAC")) {
        suggestions.push({
          question: `What is the correct IUPAC naming rule for ${mainConcept}?`,
          type: "multiple-choice",
          options: [
            concept,
            concept.split(" ").reverse().join(" "),
            concept.replace("parent chain", "main chain"),
            concept.replace("alphabetical", "numerical"),
          ],
          correctAnswer: concept,
          explanation: `Based on IUPAC naming conventions: ${concept}`,
          points: 10,
          difficulty: idx < 2 ? "easy" : idx < 4 ? "medium" : "hard",
          basedOn: [concept],
        });
      } else if (concept.includes("mechanism") || concept.includes("reaction")) {
        suggestions.push({
          question: `Which mechanism is most likely for ${mainConcept}?`,
          type: "multiple-choice",
          options: [
            concept,
            concept.replace("mechanism", "reaction"),
            concept.replace("reaction", "mechanism"),
            "None of the above",
          ],
          correctAnswer: concept,
          explanation: `The key mechanism is: ${concept}`,
          points: 10,
          difficulty: "medium",
          basedOn: [concept],
        });
      } else if (concept.includes("stability") || concept.includes("energy")) {
        suggestions.push({
          question: `Which factor affects ${mainConcept}?`,
          type: "multiple-choice",
          options: [
            concept,
            concept.replace("stability", "reactivity"),
            concept.replace("energy", "entropy"),
            "None of the above",
          ],
          correctAnswer: concept,
          explanation: `The factor affecting ${mainConcept} is: ${concept}`,
          points: 10,
          difficulty: "medium",
          basedOn: [concept],
        });
      }
    });

    // Generate synthesis problems
    if (topicData.hasMechanism) {
      suggestions.push({
        question: `Predict the major product when [reactant] reacts with [reagent] under [conditions]. Show the mechanism.`,
        type: "synthesis",
        correctAnswer: `Product: [product]. Mechanism: ${topicData.mustKnow[0] || "key reaction mechanism"}`,
        explanation: `For ${topicData.title}, the mechanism involves: ${topicData.mustKnow.slice(0, 2).join(" and ")}`,
        points: 15,
        difficulty: "hard",
        basedOn: topicData.mustKnow.slice(0, 3),
      });
    }

    // Generate mechanism problems
    if (topicData.hasMechanism && topicData.mustKnow.some(m => m.includes("mechanism"))) {
      suggestions.push({
        question: `Draw the complete mechanism for [reaction]. Include all curved arrows, intermediates, and show stereochemistry.`,
        type: "mechanism",
        correctAnswer: `Mechanism involves: ${topicData.mustKnow.find(m => m.includes("mechanism")) || "key steps"}`,
        explanation: `The mechanism for ${topicData.title} involves: ${topicData.mustKnow.slice(0, 2).join(" and ")}`,
        points: 18,
        difficulty: "hard",
        basedOn: topicData.mustKnow.filter(m => m.includes("mechanism") || m.includes("reaction")),
      });
    }

    return suggestions.slice(0, 8); // Limit to 8 suggestions
  }

  async function loadSuggestions() {
    if (!selectedTopic || !currentTopic) return;

    setGenerating(true);
    // Simulate AI generation - in production, this would call an API
    setTimeout(() => {
      const generated = generateSuggestions(currentTopic);
      setSuggestions(generated);
      setGenerating(false);
    }, 1000);
  }

  useEffect(() => {
    if (selectedTopic && currentTopic) {
      loadSuggestions();
    }
  }, [selectedTopic]);

  function addProblem(suggestion: ProblemSuggestion) {
    const problem: HomeworkProblem = {
      id: `prof-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      question: suggestion.question,
      type: suggestion.type,
      options: suggestion.options,
      correctAnswer: suggestion.correctAnswer,
      explanation: suggestion.explanation,
      points: suggestion.points,
      difficulty: suggestion.difficulty,
      topic: selectedTopic,
      courseId: course,
      rubric: {
        fullCredit: `Correctly answers: ${suggestion.correctAnswer}`,
        partialCredit: [
          "Partial understanding shown",
          "Correct concept but incomplete answer",
        ],
        commonMistakes: [
          "Not considering all factors",
          "Missing key concept",
        ],
      },
    };

    setSelectedProblems(prev => [...prev, problem]);
  }

  function removeProblem(problemId: string) {
    setSelectedProblems(prev => prev.filter(p => p.id !== problemId));
  }

  function createAssignment() {
    if (selectedProblems.length === 0) {
      alert("Please add at least one problem to the assignment.");
      return;
    }

    if (!assignmentTitle.trim()) {
      alert("Please enter an assignment title.");
      return;
    }

    const assignment = {
      id: `prof-assignment-${Date.now()}`,
      title: assignmentTitle,
      courseId: course,
      topic: selectedTopic,
      problems: selectedProblems,
      totalPoints: selectedProblems.reduce((sum, p) => sum + p.points, 0),
      createdAt: new Date().toISOString(),
      createdBy: "professor",
    };

    // Save assignment
    const savedAssignments = localStorage.getItem(`orgopivy-assignments-${course}`);
    const assignments = savedAssignments ? JSON.parse(savedAssignments) : [];
    assignments.push(assignment);
    localStorage.setItem(`orgopivy-assignments-${course}`, JSON.stringify(assignments));

    // Reset form
    setSelectedProblems([]);
    setAssignmentTitle("");
    setSuggestions([]);

    if (onAssignmentCreated) {
      onAssignmentCreated(assignment.id);
    }

    alert(`Assignment "${assignmentTitle}" created successfully!`);
  }

  if (!isProfessor) {
    return (
      <div className="card" style={{ padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
          Professor Assignment Creator
        </div>
        <div className="subtle" style={{ fontSize: 15, marginBottom: 24 }}>
          This tool is for professors only. Enable professor mode to create graded assignments.
        </div>
        <button
          type="button"
          className="btn btnPrimary"
          onClick={() => {
            const confirm = window.confirm("Are you a professor? This will enable assignment creation features.");
            if (confirm) {
              localStorage.setItem("orgopivy-is-professor", "true");
              setIsProfessor(true);
            }
          }}
        >
          Enable Professor Mode
        </button>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
              Create New Assignment
            </div>
            <div className="subtle" style={{ fontSize: 13 }}>
              AI-assisted problem generation based on curriculum content
            </div>
          </div>
          <button
            type="button"
            className="btn"
            onClick={() => {
              localStorage.setItem("orgopivy-is-professor", "false");
              setIsProfessor(false);
            }}
            style={{ fontSize: 12 }}
          >
            Exit Professor Mode
          </button>
        </div>
      </div>

      {/* Topic Selection */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
          Select Topic
        </label>
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="input"
          style={{ width: "100%" }}
        >
          <option value="">Select a topic...</option>
          {courseTopics.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.title}
            </option>
          ))}
        </select>
        {currentTopic && (
          <div className="subtle" style={{ fontSize: 13, marginTop: 8 }}>
            {currentTopic.shortDesc}
          </div>
        )}
      </div>

      {/* Assignment Title */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
          Assignment Title
        </label>
        <input
          type="text"
          value={assignmentTitle}
          onChange={(e) => setAssignmentTitle(e.target.value)}
          placeholder="e.g., Homework 1: Alkanes and Naming"
          className="input"
          style={{ width: "100%" }}
        />
      </div>

      {/* AI Suggestions */}
      {selectedTopic && currentTopic && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>
              AI-Generated Problem Suggestions
            </div>
            <button
              type="button"
              className="btn"
              onClick={loadSuggestions}
              disabled={generating}
              style={{ fontSize: 12 }}
            >
              {generating ? "Generating..." : "Refresh Suggestions"}
            </button>
          </div>

          {generating ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
              Generating problem suggestions based on curriculum...
            </div>
          ) : suggestions.length > 0 ? (
            <div style={{ display: "grid", gap: 12 }}>
              {suggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: 16,
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    background: "var(--panel)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4, textTransform: "uppercase" }}>
                        {suggestion.type} • {suggestion.difficulty} • {suggestion.points} points
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>
                        {suggestion.question}
                      </div>
                      {suggestion.options && (
                        <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>
                          Options: {suggestion.options.join(", ")}
                        </div>
                      )}
                      <div style={{ fontSize: 12, color: "var(--muted-2)" }}>
                        Based on: {suggestion.basedOn.join(", ")}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btnPrimary"
                      onClick={() => addProblem(suggestion)}
                      style={{ marginLeft: 16, fontSize: 12, padding: "6px 12px" }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="subtle" style={{ padding: 20, textAlign: "center" }}>
              Select a topic to generate problem suggestions
            </div>
          )}
        </div>
      )}

      {/* Selected Problems */}
      {selectedProblems.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
            Selected Problems ({selectedProblems.length})
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {selectedProblems.map((problem, idx) => (
              <div
                key={problem.id}
                style={{
                  padding: 16,
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--panel-2)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>
                      Problem {idx + 1} • {problem.type} • {problem.points} points
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>
                      {problem.question}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => removeProblem(problem.id)}
                    style={{ marginLeft: 16, fontSize: 12, padding: "6px 12px" }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
            Total Points: {selectedProblems.reduce((sum, p) => sum + p.points, 0)}
          </div>
        </div>
      )}

      {/* Create Button */}
      {selectedProblems.length > 0 && assignmentTitle && (
        <button
          type="button"
          className="btn btnPrimary"
          onClick={createAssignment}
          style={{ width: "100%" }}
        >
          Create Assignment ({selectedProblems.length} problems, {selectedProblems.reduce((sum, p) => sum + p.points, 0)} points)
        </button>
      )}
    </div>
  );
}
