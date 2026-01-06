"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ExamPracticeMode from "./ExamPracticeMode";

function ExamPageContent({ course }: { course: "orgochem-1" | "orgochem-2" }) {
  const searchParams = useSearchParams();
  const topicParam = searchParams?.get("topic") || undefined;

  return <ExamPracticeMode course={course} topic={topicParam} />;
}

export default function ExamPageClient({ course }: { course: "orgochem-1" | "orgochem-2" }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExamPageContent course={course} />
    </Suspense>
  );
}
