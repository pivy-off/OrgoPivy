"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import GradedHomework from "../components/GradedHomework";
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

  // Validate course
  const course: CourseId = courseParam === "orgochem-1" || courseParam === "orgochem-2" 
    ? courseParam 
    : "orgochem-1";

  return (
    <main style={{ padding: "40px 0", minHeight: "calc(100vh - 120px)" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 48, fontWeight: 700, marginBottom: 8 }}>
            Graded Homework Assignments
          </h1>
          <p className="subtle" style={{ fontSize: 16 }}>
            Professional-grade assignments with automatic grading, detailed feedback, and comprehensive problems.
            Perfect for professors to assign and students to practice.
          </p>
        </div>

        <GradedHomework course={course} topic={topicParam || undefined} />
      </div>
    </main>
  );
}
