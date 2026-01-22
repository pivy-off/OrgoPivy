// app/orgochem-1/page.tsx
import Link from "next/link";
import { getCourseTopics } from "../lib/curriculum";
import CourseProgressClient from "../components/CourseProgressClient";

export default function OrgoChem1Page() {
  const topics = getCourseTopics("orgochem-1");

  return (
    <main className="stack">
      <div className="card">
        <div className="cardInner">
          <div className="stack">
            <div className="row">
              <div>
                <h1 className="h1">OrgoChem Ι</h1>
                <div className="subtle">
                  Foundations, stereochemistry, and reaction logic. Follow the topics in order.
                </div>
              </div>

              <div className="row">
                <Link className="btn" href="/">
                  Back
                </Link>
              </div>
            </div>

            <div className="divider" />

            <CourseProgressClient course="orgochem-1" topics={topics} />

            <div className="divider" />

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link className="btn btnPrimary" href="/practice?course=orgochem-1">
                Practice Problems
              </Link>
              <Link className="btn" href="/orgochem-1/exams">
                Exam Mode
              </Link>
            </div>

            <div className="divider" />

            <div className="subtle">
              Tip: when stuck, identify the intermediate first. Then map reagents to that pathway.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
