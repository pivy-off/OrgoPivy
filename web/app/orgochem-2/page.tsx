// app/orgochem-2/page.tsx
import Link from "next/link";
import { getCourseTopics } from "../lib/curriculum";
import type { Topic } from "../lib/curriculum";

function weekSortKey(t: Topic) {
  return t.scheduleWeek ?? 999;
}

export default function OrgoChem2Page() {
  const topics = getCourseTopics("orgochem-2");
  const sorted = [...topics].sort((a, b) => weekSortKey(a) - weekSortKey(b) || a.title.localeCompare(b.title));

  const byWeek = new Map<number, Topic[]>();
  for (const t of sorted) {
    const w = t.scheduleWeek ?? 0;
    if (!byWeek.has(w)) byWeek.set(w, []);
    byWeek.get(w)!.push(t);
  }
  const weeks = Array.from(byWeek.keys()).filter((w) => w > 0).sort((a, b) => a - b);

  return (
    <main className="stack">
      <div className="card">
        <div className="cardInner">
          <div className="stack">
            <div className="row">
              <div>
                <h1 className="h1">OrgoChem ΙΙ</h1>
                <div className="subtle">
                  Berea College <strong>CHM 222</strong> (Dr. Garrett, Spring 2026). Topics follow the weekly lecture
                  sequence; weeks 8, 13, and 15 are omitted on the official calendar (exams / breaks).
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
              <Link className="btn" href="/spectra">
                NMR Studio
              </Link>
            </div>

            <div className="divider" />

            <div className="stack">
              {weeks.map((w) => (
                <div key={w} className="stack" style={{ gap: 10 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ fontWeight: 950, fontSize: 18 }}>Week {w}</div>
                    <div className="subtle">
                      {byWeek.get(w)?.[0]?.weekLabel && w === 1 ? byWeek.get(w)![0].weekLabel : null}
                    </div>
                  </div>
                  {(byWeek.get(w) || []).map((t, idx) => (
                    <div key={t.slug} className="progressRow">
                      <div className="progressRowLeft">
                        <div className="progressRowTitle">
                          {idx + 1}. {t.title}
                        </div>
                        <div className="progressRowDesc">{t.shortDesc}</div>
                        {t.practiceHref ? (
                          <div className="subtle" style={{ marginTop: 6 }}>
                            Drill:{" "}
                            <Link href={t.practiceHref} className="homeSearchHit" style={{ display: "inline" }}>
                              {t.practiceHref}
                            </Link>
                          </div>
                        ) : null}
                      </div>

                      <div className="progressRowAction">
                        <Link className="btn btnPrimary" href={`/orgochem-2/${t.slug}`}>
                          Open
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="divider" />

            <div className="subtle">
              Tip: complete the Week 1–2 review blocks before heavy mechanisms; use NMR review alongside structure proof
              on every later chapter.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
