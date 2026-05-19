import Link from "next/link";
import ExamVaultClient from "../../components/ExamVaultClient";
import { getCourseTopics } from "../../lib/curriculum";
import ExamPageClient from "../../components/ExamPageClient";

export default function OrgoChem1ExamsPage() {
  const topics = getCourseTopics("orgochem-1");

  return (
    <main className="stack">
      <div className="card">
        <div className="cardInner">
          <div className="stack">
            <div className="row">
              <div>
                <div className="subtle">OrgoChem Ι</div>
                <h1 className="h1">Exam Mode</h1>
                <div className="subtle">
                  Practice with exam problems, get instant feedback, and download study materials
                </div>
              </div>

              <div className="row">
                <Link className="btn" href="/orgochem-1">
                  Back to course
                </Link>
              </div>
            </div>

            <div className="divider" />

            <div style={{ display: "grid", gap: 32 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Practice Problems</h2>
                <ExamPageClient course="orgochem-1" />
              </div>

              <div className="divider" />

              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Exam Vault</h2>
                <div className="subtle" style={{ marginBottom: 16 }}>
                  Upload and organize your exam files. Tag them by topic for easy access.
                </div>
                <ExamVaultClient course="orgochem-1" topics={topics} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
