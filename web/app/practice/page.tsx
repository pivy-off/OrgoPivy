"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import AchieveHomework from "../components/AchieveHomework";
import GradedHomework from "../components/GradedHomework";
import { getCourseTopics } from "../lib/curriculum";
import type { CourseId } from "../lib/curriculum";
import { useLanguage } from "../contexts/LanguageContext";

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

  const { t, locale } = useLanguage();
  const [selectedCourse, setSelectedCourse] = useState<CourseId>(course);
  const [selectedTopic, setSelectedTopic] = useState<string>(topicParam);
  const [selectedMode, setSelectedMode] = useState<"interactive" | "graded">(modeParam as "interactive" | "graded" || "interactive");

  const orgochem1Topics = getCourseTopics("orgochem-1", locale);
  const orgochem2Topics = getCourseTopics("orgochem-2", locale);

  return (
    <main style={{ padding: "40px 0", minHeight: "calc(100vh - 120px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 48, fontWeight: 700, marginBottom: 8 }}>
            {t("practiceProblems")}
          </h1>
          <p className="subtle" style={{ fontSize: 16 }}>
            {t("practiceDesc")}
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
              {t("interactiveHomework")}
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
              {t("gradedAssignments")}
            </button>
          </div>

          {/* Course Selector */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: "var(--text)" }}>
              {t("selectCourse")}
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
                {t("orgochem1")}
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
                {t("orgochem2")}
              </button>
            </div>
          </div>

          {/* Topic Selector */}
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: "var(--text)" }}>
              {t("selectTopicOptional")}
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
                {t("allTopics")}
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
                  {t("interactiveHomework")}
                </h2>
                <p className="subtle" style={{ fontSize: 14 }}>
                  {t("interactiveHomeworkDesc")}
                </p>
              </div>
              <AchieveHomework course={selectedCourse} topic={selectedTopic || undefined} />
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: 16 }}>
                <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
                  {t("gradedAssignments")}
                </h2>
                <p className="subtle" style={{ fontSize: 14 }}>
                  {t("gradedAssignmentsDesc")}
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
