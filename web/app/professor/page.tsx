import Link from "next/link";
import ProfessorAssignmentCreator from "../components/ProfessorAssignmentCreator";

export default function ProfessorPage() {
  return (
    <main className="stack" style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      <div>
        <Link href="/" className="btn" style={{ marginBottom: 16 }}>
          ← Back
        </Link>
        <h1 className="h1" style={{ marginBottom: 8 }}>Professor Tools</h1>
        <p className="subtle" style={{ fontSize: 15 }}>
          Create assignments and generate practice problems for your students. Pick topics, add AI-suggested problems, then share via export.
        </p>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <Link href="/assignments" className="btn" style={{ fontSize: 13 }}>
          View Assignments →
        </Link>
      </div>

      <ProfessorAssignmentCreator />
    </main>
  );
}
