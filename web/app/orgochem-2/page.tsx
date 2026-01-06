// app/orgochem-2/page.tsx
import Link from "next/link";
import { getCourseTopics } from "../lib/curriculum";

export default function OrgoChem2Page() {
  const topics = getCourseTopics("orgochem-2");

  return (
    <main className="stack">
      <div className="card">
        <div className="cardInner">
          <div className="stack">
            <div className="row">
              <div>
                <h1 className="h1">OrgoChem ΙΙ</h1>
                <div className="subtle">
                  Carbonyl logic, synthesis, and structure proof. Follow the topics in order.
                </div>
              </div>

              <div className="row">
                <Link className="btn" href="/">
                  Back
                </Link>
              </div>
            </div>

            <div className="divider" />

            <div className="card" style={{ boxShadow: "none" }}>
              <div className="cardInner" style={{ display: "grid", gap: 10 }}>
                <div style={{ fontWeight: 950 }}>Progress</div>
                <div className="subtle">0 of {topics.length} topics completed</div>
              </div>
            </div>

            <div className="divider" />

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link className="btn btnPrimary" href="/practice?course=orgochem-2">
                Practice Problems
              </Link>
              <Link className="btn" href="/orgochem-2/exams">
                Exam Mode
              </Link>
            </div>

            <div className="divider" />

            <div className="stack">
              {topics.map((t, idx) => (
                <div key={t.slug} className="progressRow">
                  <div className="progressRowLeft">
                    <div className="progressRowTitle">
                      {idx + 1}. {t.title}
                    </div>
                    <div className="progressRowDesc">{t.shortDesc}</div>
                  </div>

                  <div className="progressRowAction">
                    <Link className="btn btnPrimary" href={`/orgochem-2/${t.slug}`}>
                      Open
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="divider" />

            <div className="subtle">
              Tip: predict the product first. Use spectroscopy as proof.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
