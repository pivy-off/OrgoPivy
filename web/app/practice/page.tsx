"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import AchieveHomework from "../components/AchieveHomework";
import GradedHomework from "../components/GradedHomework";
import { getCourseTopics } from "../lib/curriculum";
import type { CourseId } from "../lib/curriculum";

export default function PracticePage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: "center" }}>Loading...</div>}>
      <PracticePageContent />
    </Suspense>
  );
}

function PracticePageContent() {
  const searchParams = useSearchParams();
  const courseParam = (searchParams?.get("course") || "") as CourseId;
  const topicParam = searchParams?.get("topic") || "";
  const modeParam = searchParams?.get("mode") || "interactive";

  // Validate course
  const course: CourseId = courseParam === "orgochem-1" || courseParam === "orgochem-2" 
    ? courseParam 
    : "orgochem-1";

  const [selectedCourse, setSelectedCourse] = useState<CourseId>(course);
  const [selectedTopic, setSelectedTopic] = useState<string>(topicParam);
  const [selectedMode, setSelectedMode] = useState<"interactive" | "graded">(modeParam as "interactive" | "graded" || "interactive");

  const orgochem1Topics = getCourseTopics("orgochem-1");
  const orgochem2Topics = getCourseTopics("orgochem-2");

  return (
    <main style={{ padding: "40px 0", minHeight: "calc(100vh - 120px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 48, fontWeight: 700, marginBottom: 8 }}>
            Practice Problems
          </h1>
          <p className="subtle" style={{ fontSize: 16 }}>
            Interactive homework with immediate feedback, or graded assignments for professors.
          </p>
        </div>

        {/* Mode Selector */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            <button
              type="button"
              onClick={() => setSelectedMode("interactive")}
              className="btn"
              style={{
                background: selectedMode === "interactive" ? "var(--blue)" : "var(--panel)",
                color: selectedMode === "interactive" ? "white" : "var(--text)",
                fontSize: 15,
                padding: "12px 24px",
              }}
            >
              Interactive Homework
            </button>
            <button
              type="button"
              onClick={() => setSelectedMode("graded")}
              className="btn"
              style={{
                background: selectedMode === "graded" ? "var(--blue)" : "var(--panel)",
                color: selectedMode === "graded" ? "white" : "var(--text)",
                fontSize: 15,
                padding: "12px 24px",
              }}
            >
              Graded Assignments
            </button>
          </div>

          {/* Course Selector */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: "var(--text)" }}>
              Select Course:
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                type="button"
                onClick={() => {
                  setSelectedCourse("orgochem-1");
                  setSelectedTopic("");
                }}
                className="btn"
                style={{
                  background: selectedCourse === "orgochem-1" ? "var(--blue)" : "var(--panel)",
                  color: selectedCourse === "orgochem-1" ? "white" : "var(--text)",
                  fontSize: 15,
                  padding: "12px 24px",
                }}
              >
                OrgoChem I
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedCourse("orgochem-2");
                  setSelectedTopic("");
                }}
                className="btn"
                style={{
                  background: selectedCourse === "orgochem-2" ? "var(--blue)" : "var(--panel)",
                  color: selectedCourse === "orgochem-2" ? "white" : "var(--text)",
                  fontSize: 15,
                  padding: "12px 24px",
                }}
              >
                OrgoChem II
              </button>
            </div>
          </div>

          {/* Topic Selector */}
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: "var(--text)" }}>
              Select Topic (Optional):
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
              <button
                type="button"
                onClick={() => setSelectedTopic("")}
                className="btn"
                style={{
                  background: selectedTopic === "" ? "var(--green)" : "var(--panel)",
                  color: selectedTopic === "" ? "white" : "var(--text)",
                  fontSize: 13,
                  padding: "8px 16px",
                  textAlign: "left",
                }}
              >
                All Topics
              </button>
              {(selectedCourse === "orgochem-1" ? orgochem1Topics : orgochem2Topics).map((topic) => (
                <button
                  key={topic.slug}
                  type="button"
                  onClick={() => setSelectedTopic(topic.slug)}
                  className="btn"
                  style={{
                    background: selectedTopic === topic.slug ? "var(--green)" : "var(--panel)",
                    color: selectedTopic === topic.slug ? "white" : "var(--text)",
                    fontSize: 13,
                    padding: "8px 16px",
                    textAlign: "left",
                  }}
                >
                  {topic.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Practice Component */}
        <div style={{ marginTop: 40 }}>
          {selectedMode === "interactive" ? (
            <div>
              <div style={{ marginBottom: 16 }}>
                <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
                  Interactive Homework
                </h2>
                <p className="subtle" style={{ fontSize: 14 }}>
                  Achieve-style practice with immediate feedback, hints, and achievements. Perfect for self-study.
                </p>
              </div>
              <AchieveHomework course={selectedCourse} topic={selectedTopic || undefined} />
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: 16 }}>
                <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
                  Graded Assignments
                </h2>
                <p className="subtle" style={{ fontSize: 14 }}>
                  Professional-grade assignments with automatic grading, detailed feedback, and comprehensive problems.
                  Perfect for professors to assign and students to practice.
                </p>
              </div>
              <GradedHomework course={selectedCourse} topic={selectedTopic || undefined} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
