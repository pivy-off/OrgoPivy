"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import GradedHomework from "../../../components/GradedHomework";
import { getAssignment } from "../../../lib/assignments";
import type { CourseId } from "../../../lib/curriculum";

export default function GradedHomeworkClient({
  course,
  assignmentId,
}: {
  course: CourseId;
  assignmentId: string;
}) {
  const [exists, setExists] = useState<boolean | null>(null);

  useEffect(() => {
    setExists(!!getAssignment(course, assignmentId));
  }, [course, assignmentId]);

  if (exists === null) {
    return (
      <div className="card" style={{ padding: 40, textAlign: "center" }}>
        <div style={{ color: "var(--muted)" }}>Loading…</div>
      </div>
    );
  }

  if (!exists) {
    return (
      <div className="card" style={{ padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Assignment not found</div>
        <div className="subtle" style={{ fontSize: 14, marginBottom: 20 }}>
          This assignment may not exist or hasn&apos;t been shared with you. Ask your professor to export and share the assignment file, then import it on the Assignments page.
        </div>
        <Link href="/assignments" className="btn btnPrimary">
          Go to Assignments
        </Link>
      </div>
    );
  }

  return <GradedHomework course={course} assignmentId={assignmentId} backHref="/assignments" />;
}
