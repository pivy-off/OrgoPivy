import Link from "next/link";
import GradedHomeworkClient from "./GradedHomeworkClient";

export default async function AssignmentPage({
  params,
}: {
  params: Promise<{ course: string; assignmentId: string }>;
}) {
  const { course, assignmentId } = await params;
  const validCourse = course === "orgochem-1" || course === "orgochem-2" ? course : "orgochem-1";

  return (
    <main className="stack" style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <Link href="/assignments" className="btn" style={{ marginBottom: 16, alignSelf: "flex-start" }}>
        ← All assignments
      </Link>
      <GradedHomeworkClient course={validCourse} assignmentId={assignmentId} />
    </main>
  );
}
