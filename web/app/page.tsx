"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getCourseTopics, type CourseId, type Topic } from "./lib/curriculum";

type ProgressMap = Record<string, boolean>;

const GOAL_STORAGE = "orgopivy-daily-goal-minutes";
const TOTAL_STUDY_MIN_KEY = "orgopivy-total-study-minutes";
const BOOKMARKS_KEY = "orgopivy-bookmarks";
const STREAK_DAYS_KEY = "orgopivy-streak-days";
const DEFAULT_GOAL_MIN = 30;

function storageKey(course: CourseId) {
  return `orgopivy-progress-${course}`;
}

function safeParse(raw: string | null): ProgressMap {
  if (!raw) return {};
  try {
    const v = JSON.parse(raw ?? "");
    if (v && typeof v === "object") return v as ProgressMap;
  } catch {
    // ignore
  }
  return {};
}

function readBookmarksCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    if (!raw) return 0;
    const v = JSON.parse(raw);
    if (Array.isArray(v)) return v.length;
    if (v && typeof v === "object" && Array.isArray((v as { items?: unknown }).items)) {
      return (v as { items: unknown[] }).items.length;
    }
  } catch {
    // ignore
  }
  return 0;
}

function readNumber(key: string): number {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(key);
  const n = raw ? Number(raw) : 0;
  return !Number.isNaN(n) && n >= 0 ? n : 0;
}

function formatStudyHM(totalMinutes: number): string {
  const m = Math.max(0, Math.floor(totalMinutes));
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${h}h ${min}m`;
}

function randomTopic(): { course: CourseId; topic: Topic } {
  const courses: CourseId[] = ["orgochem-1", "orgochem-2"];
  const course = courses[Math.floor(Math.random() * courses.length)];
  const topics = getCourseTopics(course);
  const topic = topics[Math.floor(Math.random() * topics.length)];
  return { course, topic };
}

function courseLabel(course: CourseId) {
  return course === "orgochem-1" ? "OrgoChem I" : "OrgoChem II";
}

export default function HomePage() {
  const [completedCount, setCompletedCount] = useState(0);
  const [totalTopics, setTotalTopics] = useState(0);
  const [review, setReview] = useState<{ course: CourseId; topic: Topic } | null>(null);
  const [studyMinutesToday, setStudyMinutesToday] = useState(0);
  const [dailyGoalMin, setDailyGoalMin] = useState(DEFAULT_GOAL_MIN);
  const [searchQuery, setSearchQuery] = useState("");
  const [dicePulse, setDicePulse] = useState(false);
  const [totalStudyMinutes, setTotalStudyMinutes] = useState(0);
  const [bookmarksCount, setBookmarksCount] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const refreshFromStorage = useCallback(() => {
    const all = [...getCourseTopics("orgochem-1"), ...getCourseTopics("orgochem-2")];
    setTotalTopics(all.length);

    let done = 0;
    if (typeof window !== "undefined") {
      (["orgochem-1", "orgochem-2"] as CourseId[]).forEach((course) => {
        const progress = safeParse(localStorage.getItem(storageKey(course)));
        getCourseTopics(course).forEach((t) => {
          if (progress[t.slug]) done += 1;
        });
      });
      const raw = localStorage.getItem("orgopivy-study-minutes-today");
      const n = raw ? Number(raw) : 0;
      if (!Number.isNaN(n) && n >= 0) setStudyMinutesToday(Math.min(n, DEFAULT_GOAL_MIN * 8));
      const goalRaw = localStorage.getItem(GOAL_STORAGE);
      const g = goalRaw ? Number(goalRaw) : NaN;
      if (!Number.isNaN(g) && g >= 5 && g <= 240) setDailyGoalMin(g);

      setTotalStudyMinutes(readNumber(TOTAL_STUDY_MIN_KEY));
      setBookmarksCount(readBookmarksCount());
      setStreakDays(readNumber(STREAK_DAYS_KEY));
    }
    setCompletedCount(done);
  }, []);

  useEffect(() => {
    setReview(randomTopic());
    queueMicrotask(() => refreshFromStorage());
  }, [refreshFromStorage]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (!e.key) return;
      if (
        e.key.startsWith("orgopivy-progress-") ||
        e.key === "orgopivy-study-minutes-today" ||
        e.key === GOAL_STORAGE ||
        e.key === TOTAL_STUDY_MIN_KEY ||
        e.key === BOOKMARKS_KEY ||
        e.key === STREAK_DAYS_KEY
      ) {
        refreshFromStorage();
      }
    };
    const onFocus = () => refreshFromStorage();
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
  }, [refreshFromStorage]);

  const pct = useMemo(() => {
    if (!totalTopics) return 0;
    return Math.round((completedCount / totalTopics) * 100);
  }, [completedCount, totalTopics]);

  const dailyLeft = Math.max(0, dailyGoalMin - studyMinutesToday);
  const dailyPct =
    dailyGoalMin > 0 ? Math.min(100, Math.round((studyMinutesToday / dailyGoalMin) * 100)) : 0;

  const studyTimeLabel = formatStudyHM(totalStudyMinutes);

  const searchResults = useMemo(() => {
    const needle = searchQuery.trim().toLowerCase();
    if (needle.length < 2) return [];
    const out: { course: CourseId; topic: Topic }[] = [];
    for (const c of ["orgochem-1", "orgochem-2"] as CourseId[]) {
      for (const t of getCourseTopics(c)) {
        if (
          t.title.toLowerCase().includes(needle) ||
          t.slug.includes(needle) ||
          t.shortDesc.toLowerCase().includes(needle)
        ) {
          out.push({ course: c, topic: t });
        }
      }
    }
    return out.slice(0, 10);
  }, [searchQuery]);

  function editDailyGoal() {
    if (typeof window === "undefined") return;
    const raw = window.prompt(
      "Daily study goal in minutes (5–180)?",
      String(dailyGoalMin)
    );
    if (raw === null) return;
    const next = Number(String(raw).trim());
    if (Number.isNaN(next) || next < 5 || next > 180) {
      window.alert("Please enter a number between 5 and 180.");
      return;
    }
    try {
      localStorage.setItem(GOAL_STORAGE, String(next));
    } catch {
      // ignore
    }
    setDailyGoalMin(next);
  }

  function pickAnotherTopic() {
    setDicePulse(true);
    setReview(randomTopic());
    window.setTimeout(() => setDicePulse(false), 280);
  }

  const stats = [
    { label: "Topics completed", value: String(completedCount) },
    { label: "Study time", value: studyTimeLabel },
    { label: "Day streak", value: String(streakDays) },
    { label: "Bookmarks", value: String(bookmarksCount) },
  ];

  return (
    <main className="homeMain">
      <header className="homeHero">
        <div className="homeHeroIntro">
          <h1 className="homeHeroTitle">Dashboard</h1>
          <p className="subtle homeHeroSub">Search topics or open a course to continue studying.</p>
        </div>

        <form
          className="homeSearchWrap"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            const first = searchResults[0];
            if (first) window.location.assign(`/${first.course}/${first.topic.slug}`);
          }}
        >
          <input
            type="search"
            className="homeSearchInput"
            placeholder="Search topics, chapters, concepts…"
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
          />
          <span className="homeSearchIcon" aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4.2-4.2" />
            </svg>
          </span>
          {searchQuery.trim().length >= 2 ? (
            <div className="homeSearchResults card">
              <div className="cardInner homeSearchResultsInner">
                {searchResults.length === 0 ? (
                  <div className="subtle homeSearchEmpty">No topics match. Try another term.</div>
                ) : (
                  <ul className="homeSearchList">
                    {searchResults.map(({ course, topic: t }) => (
                      <li key={`${course}-${t.slug}`}>
                        <Link className="homeSearchHit" href={`/${course}/${t.slug}`}>
                          <span className="homeSearchHitCourse">{courseLabel(course)}</span>
                          <span className="homeSearchHitTitle">{t.title}</span>
                          <span className="subtle homeSearchHitDesc">{t.shortDesc}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                {searchResults.length > 0 ? (
                  <div className="subtle homeSearchHint">Press Enter to open the first result</div>
                ) : null}
              </div>
            </div>
          ) : null}
        </form>
      </header>

      <section className="homeSection" aria-labelledby="home-courses-heading">
        <h2 id="home-courses-heading" className="homeSectionTitle">
          Courses
        </h2>
        <div className="homeCourseGrid">
        <Link href="/orgochem-1" className="card homeCourseCard homeCardMotion">
          <div className="homeCourseBlob" aria-hidden />
          <div className="cardInner homeCourseCardInner">
            <h2 className="homeCourseTitle">OrgoChem I</h2>
            <p className="subtle homeCourseDesc">
              Foundations, stereochemistry, and reaction logic. Build your understanding step by step
              through alkanes, cycloalkanes, stereochemistry, substitution and elimination reactions,
              alkenes, and spectroscopy.
            </p>
            <span className="homeCourseCta">
              View topics <span aria-hidden>→</span>
            </span>
          </div>
        </Link>

        <Link href="/orgochem-2" className="card homeCourseCard homeCardMotion">
          <div className="homeCourseBlob" aria-hidden />
          <div className="cardInner homeCourseCardInner">
            <h2 className="homeCourseTitle">OrgoChem II</h2>
            <p className="subtle homeCourseDesc">
              Carbonyl logic, synthesis, and structure proof. Master advanced transformations
              including alcohols, ethers, carbonyls, carboxylic acids, enolates, aromatic chemistry,
              and amines.
            </p>
            <span className="homeCourseCta">
              View topics <span aria-hidden>→</span>
            </span>
          </div>
        </Link>
        </div>
      </section>

      <section className="homeSection" aria-labelledby="home-progress-heading">
        <div className="homeSectionHead">
          <h2 id="home-progress-heading" className="homeSectionTitle">
            Progress
          </h2>
          <span className="subtle homeSectionMeta">
            {completedCount} of {totalTopics || 0} topics · {pct}%
          </span>
        </div>
        <div className="homeProgressTrack homeProgressTrackLg" role="presentation" aria-hidden>
          <div className="homeProgressFill homeProgressFillAccent" style={{ width: `${pct}%` }} />
        </div>
        <div className="homeStatsGrid">
          {stats.map((stat) => (
            <div key={stat.label} className="homeStatCard">
              <div className="homeStatValue">{stat.value}</div>
              <div className="homeStatLabel">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="homeSection" aria-labelledby="home-study-heading">
        <h2 id="home-study-heading" className="homeSectionTitle">
          Study today
        </h2>
        <div className="homeStudyGrid">
          <div className="card homeStudyCard">
            <div className="cardInner homePanelInner">
              <h3 className="homeCardTitle">Quick review</h3>
              <p className="subtle homeCardSub">Pick a random topic for spaced repetition.</p>

              {review ? (
                <div className="homeQuickInset">
                  <span className="homeQuickBadge">{courseLabel(review.course)}</span>
                  <div className="homeQuickTopicTitle">{review.topic.title}</div>
                  <p className="subtle homeQuickTopicDesc">{review.topic.shortDesc}</p>
                  <Link
                    href={`/${review.course}/${review.topic.slug}`}
                    className="btn btnPrimary homeReviewCta homeBtnMotion homeAccentBtn"
                  >
                    Open topic
                  </Link>
                </div>
              ) : null}

              <button
                type="button"
                className={`homeDiceBtn homeBtnMotion${dicePulse ? " homeDiceBtnPulse" : ""}`}
                onClick={pickAnotherTopic}
              >
                Shuffle topic
              </button>
            </div>
          </div>

          <div className="card homeStudyCard">
            <div className="cardInner homePanelInner">
              <h3 className="homeCardTitle">Daily goal</h3>
              <p className="subtle homeCardSub">
                {streakDays > 0
                  ? `${streakDays}-day streak — keep it going.`
                  : "Set a daily target to build a streak."}
              </p>

              <div className="homeDailyGoal">
                <div className="homeDailyGoalTop">
                  <span className="homeDailyGoalLabel">
                    {studyMinutesToday} / {dailyGoalMin} min
                  </span>
                  <button type="button" className="homeEditBtn homeBtnMotion" onClick={editDailyGoal}>
                    Edit goal
                  </button>
                </div>
                <div className="homeProgressTrack" role="presentation" aria-hidden>
                  <div className="homeProgressFill homeProgressFillAccent" style={{ width: `${dailyPct}%` }} />
                </div>
                <p className="subtle homeDailyLeft">{dailyLeft} minutes left today</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="homeSection homeSectionLast" aria-labelledby="home-tools-heading">
        <h2 id="home-tools-heading" className="homeSectionTitle">
          For instructors
        </h2>
      <Link href="/studio" className="homeProfessorBar homeCardMotion">
        <span className="homeProfessorIcon" aria-hidden>
          📝
        </span>
        <span className="homeProfessorText">
          <span className="homeProfessorTitle">Professor Tools</span>
          <span className="homeProfessorDesc">
            Create assignments and generate practice problems for your students
          </span>
        </span>
        <span className="homeProfessorArrow" aria-hidden>
          →
        </span>
      </Link>
      </section>
    </main>
  );
}
