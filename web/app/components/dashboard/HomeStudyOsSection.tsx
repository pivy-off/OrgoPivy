"use client";

import Link from "next/link";
import { useMemo } from "react";
import { getRecentActivity, getWeakTopics } from "../../lib/activity";
import { getCourseTopics, type CourseId } from "../../lib/curriculum";

function nextTopicSuggestion(completed: number, total: number) {
  if (total <= 0) return { title: "Open OrgoChem II", href: "/orgochem-2", reason: "Start the curated topic path." };
  if (completed === 0) return { title: "Begin first topic checklist", href: "/orgochem-2", reason: "Complete one topic to unlock momentum metrics." };
  if (completed < total / 2) return { title: "Continue carbonyl chapter", href: "/orgochem-2", reason: "You are mid-way through the catalog." };
  return { title: "Run quiz prep", href: "/quiz", reason: "Stress-test decision-making under time pressure." };
}

export default function HomeStudyOsSection({
  completedTopics,
  totalTopics,
}: {
  completedTopics: number;
  totalTopics: number;
}) {
  const activity = useMemo(() => getRecentActivity().slice(0, 5), []);
  const weak = useMemo(() => getWeakTopics(3), []);
  const suggest = useMemo(
    () => nextTopicSuggestion(completedTopics, totalTopics),
    [completedTopics, totalTopics]
  );
  const oc2Count = useMemo(() => getCourseTopics("orgochem-2" as CourseId).length, []);

  return (
    <>
      <section className="opHero" aria-label="Welcome">
        <h2 className="opHeroTitle">Organic chemistry, one workspace</h2>
        <p className="opHeroSub">
          OrgoPivy ties uploads, lexical search, grounded Q&amp;A, mechanisms, NMR studio, workspace boards, and quiz prep into a single study OS—built for Orgo II workflows.
        </p>
      </section>

      <section aria-label="Quick launch">
        <div style={{ fontWeight: 900, marginBottom: 12, fontSize: 14 }}>Quick launch</div>
        <div className="opQuickGrid">
          <Link className="opQuickCard" href="/mechanisms">
            <div className="opQuickCardKicker">Tools</div>
            <div className="opQuickCardTitle">Mechanisms</div>
            <div className="opQuickCardDesc">SN2, E2, Aldol stages with toggles</div>
          </Link>
          <Link className="opQuickCard" href="/spectra">
            <div className="opQuickCardKicker">Spectra</div>
            <div className="opQuickCardTitle">NMR Studio</div>
            <div className="opQuickCardDesc">Import & guided prompts</div>
          </Link>
          <Link className="opQuickCard" href="/search">
            <div className="opQuickCardKicker">Library</div>
            <div className="opQuickCardTitle">Search</div>
            <div className="opQuickCardDesc">Lexical chunks today, semantic later</div>
          </Link>
          <Link className="opQuickCard" href="/ask">
            <div className="opQuickCardKicker">Tutor</div>
            <div className="opQuickCardTitle">Ask</div>
            <div className="opQuickCardDesc">Grounded on your uploads</div>
          </Link>
          <Link className="opQuickCard" href="/uploads">
            <div className="opQuickCardKicker">Ingest</div>
            <div className="opQuickCardTitle">Uploads</div>
            <div className="opQuickCardDesc">Txt notes → index → search</div>
          </Link>
          <Link className="opQuickCard" href="/workspace">
            <div className="opQuickCardKicker">Boards</div>
            <div className="opQuickCardTitle">Workspace</div>
            <div className="opQuickCardDesc">SN2, Grignard, dienes…</div>
          </Link>
          <Link className="opQuickCard" href="/quiz">
            <div className="opQuickCardKicker">Drills</div>
            <div className="opQuickCardTitle">Quiz prep</div>
            <div className="opQuickCardDesc">MCQ, recall, reactions</div>
          </Link>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
        <section className="opPanel">
          <div className="opPanelHead">
            <h2 className="opPanelTitle">Recommended next</h2>
          </div>
          <div className="opRecBanner">
            <strong>{suggest.title}</strong>
            <div style={{ marginTop: 6 }}>{suggest.reason}</div>
            <div style={{ marginTop: 12 }}>
              <Link className="btn btnPrimary" href={suggest.href}>
                Go
              </Link>
            </div>
          </div>
        </section>

        <section className="opPanel">
          <div className="opPanelHead">
            <h2 className="opPanelTitle">Progress snapshot</h2>
          </div>
          <div className="subtle" style={{ fontSize: 14, lineHeight: 1.55 }}>
            <div>
              <strong style={{ color: "var(--text)" }}>{completedTopics}</strong> / {totalTopics || oc2Count} topics marked complete across your library keys.
            </div>
            <div style={{ marginTop: 8 }}>
              OrgoChem II catalog: <strong style={{ color: "var(--text)" }}>{oc2Count}</strong> topics.
            </div>
          </div>
        </section>
      </div>

      <section className="opPanel">
        <div className="opPanelHead">
          <h2 className="opPanelTitle">Recent activity</h2>
        </div>
        {activity.length === 0 ? (
          <div className="subtle">Search, Ask, or Upload to populate this timeline.</div>
        ) : (
          <ul className="opActivityList">
            {activity.map((a) => (
              <li key={a.id} className="opActivityItem">
                <span>
                  <strong style={{ color: "var(--text)" }}>{a.kind}</strong> · {a.label}
                </span>
                {a.href ? (
                  <Link href={a.href} style={{ fontSize: 12 }}>
                    Open
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      {weak.length > 0 ? (
        <section className="opPanel opPanelMuted">
          <div className="opPanelHead">
            <h2 className="opPanelTitle">Quiz weak spots</h2>
          </div>
          <ul className="opActivityList">
            {weak.map((w) => (
              <li key={w.slug} className="opActivityItem">
                <span>{w.title}</span>
                <span className="subtle">{w.wrong} misses</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
