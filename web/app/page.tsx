"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import HomePressable from "./components/HomePressable";
import { getCourseTopics, type CourseId, type Topic } from "./lib/curriculum";

type ProgressMap = Record<string, boolean>;

const GOAL_STORAGE = "orgopivy-daily-goal-minutes";
const TOTAL_STUDY_MIN_KEY = "orgopivy-total-study-minutes";
const BOOKMARKS_KEY = "orgopivy-bookmarks";
const STREAK_DAYS_KEY = "orgopivy-streak-days";
const ACHIEVEMENTS_KEY = "orgopivy-achievements-count";
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
  return course === "orgochem-1" ? "ORGOCHEM I" : "ORGOCHEM II";
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
  const [achievementsCount, setAchievementsCount] = useState(0);

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
      setAchievementsCount(readNumber(ACHIEVEMENTS_KEY));
    }
    setCompletedCount(done);
  }, []);

  useEffect(() => {
    setReview(randomTopic());
    refreshFromStorage();
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
        e.key === STREAK_DAYS_KEY ||
        e.key === ACHIEVEMENTS_KEY
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
  const totalStudyH = Math.floor(totalStudyMinutes / 60);

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

  return (
    <main className="homeMain">
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
          placeholder="Search topics, chapters, concepts..."
          aria-label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoComplete="off"
        />
        <span className="homeSearchIcon" aria-hidden>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
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
                <div className="subtle homeSearchHint">Enter opens the first result</div>
              ) : null}
            </div>
          </div>
        ) : null}
      </form>

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

      <div className="homeMetricsRow homeMetricsRow3">
        <HomePressable className="card homeMetricCard homeCardMotion">
          <div className="cardInner homeMetricInner">
            <div className="homeMetricSplit">
              <span className="homeMetricPrefix">{completedCount}</span>
              <span className="homeMetricSlash"> / </span>
              <span className="homeMetricTail">Topics Completed</span>
            </div>
          </div>
        </HomePressable>
        <HomePressable className="card homeMetricCard homeCardMotion">
          <div className="cardInner homeMetricInner">
            <div className="homeMetricSplit">
              <span className="homeMetricPrefix">{studyTimeLabel}</span>
              <span className="homeMetricSlash"> / </span>
              <span className="homeMetricTail">Study Time</span>
            </div>
          </div>
        </HomePressable>
        <HomePressable className="card homeMetricCard homeCardMotion">
          <div className="cardInner homeMetricInner">
            <div className="homeMetricSplit">
              <span className="homeMetricPrefix">{bookmarksCount}</span>
              <span className="homeMetricSlash"> / </span>
              <span className="homeMetricTail">Bookmarks</span>
            </div>
          </div>
        </HomePressable>
      </div>

      <div className="homeStreakReviewGrid">
        <HomePressable className="card homeCardMotion">
          <div className="cardInner homePanelInner">
            <div className="homePanelHead">
              <div className="homePanelTitle">Study Streak</div>
              <div className="subtle homePanelSub">Keep your momentum going!</div>
            </div>

            <div className="homeInsetBox homeStreakCounter">
              <div className="homeStreakBig">{streakDays}</div>
              <div className="subtle homeStreakCaption">Days Streak</div>
            </div>

            <div className="homeDailyGoal">
              <div className="homeDailyGoalTop">
                <span className="homeDailyGoalLabel">Daily Goal</span>
                <button type="button" className="homeEditBtn homeBtnMotion" onClick={editDailyGoal}>
                  Edit
                </button>
              </div>
              <div className="homeDailyGoalMeta">
                <span>
                  {studyMinutesToday} / {dailyGoalMin} minutes
                </span>
                <span className="subtle">{dailyLeft} min left</span>
              </div>
              <div className="homeProgressTrack" role="presentation">
                <div className="homeProgressFill homeProgressFillAccent" style={{ width: `${dailyPct}%` }} />
              </div>
            </div>

            <div className="homeStreakFoot">
              <div className="homeStreakFootCell">
                <div className="homeStreakFootVal">{streakDays}</div>
                <div className="subtle homeStreakFootLbl">Total Days</div>
              </div>
              <div className="homeStreakFootCell">
                <div className="homeStreakFootVal">{totalStudyH}h</div>
                <div className="subtle homeStreakFootLbl">Total Time</div>
              </div>
            </div>
          </div>
        </HomePressable>

        <HomePressable className="card homeCardMotion">
          <div className="cardInner homePanelInner">
            <div className="homePanelHead">
              <div className="homePanelTitle">Quick Review</div>
              <div className="subtle homePanelSub">Random topic for spaced repetition</div>
            </div>

            {review && (
              <div className="homeInsetBox homeQuickInset">
                <div className="homeQuickBadge">{courseLabel(review.course)}</div>
                <div className="homeQuickTopicTitle">{review.topic.title}</div>
                <div className="subtle homeQuickTopicDesc">{review.topic.shortDesc}</div>
                <Link
                  href={`/${review.course}/${review.topic.slug}`}
                  className="btn btnPrimary homeReviewCta homeBtnMotion homeAccentBtn"
                >
                  Review Topic
                </Link>
              </div>
            )}

            <button
              type="button"
              className={`homeDiceBtn homeBtnMotion${dicePulse ? " homeDiceBtnPulse" : ""}`}
              onClick={pickAnotherTopic}
            >
              <span className="homeDiceEmoji" aria-hidden>
                🎲
              </span>{" "}
              Get Another Topic
            </button>
          </div>
        </HomePressable>
      </div>

      <HomePressable className="card homeProgressCard homeCardMotion">
        <div className="cardInner homeProgressInner">
          <div className="homePanelHead">
            <div className="homePanelTitle">Progress Overview</div>
            <div className="subtle homePanelSub">Your learning journey</div>
          </div>

          <div className="homeProgressBarRow">
            <span className="homeProgressBarLbl">Topics Completed</span>
            <span className="homeProgressBarFrac">
              {completedCount} / {totalTopics || 0}
            </span>
          </div>
          <div className="homeProgressTrack homeProgressTrackLg" role="presentation">
            <div className="homeProgressFill homeProgressFillAccent" style={{ width: `${pct}%` }} />
          </div>
          <div className="homeProgressPct">{pct}%</div>

          <div className="homeProgressGrid">
            <div className="homeProgressStat">
              <div className="homeProgressStatVal">{studyTimeLabel}</div>
              <div className="subtle homeProgressStatLbl">Total Study Time</div>
            </div>
            <div className="homeProgressStat">
              <div className="homeProgressStatVal">{streakDays}</div>
              <div className="subtle homeProgressStatLbl">Day Streak</div>
            </div>
            <div className="homeProgressStat">
              <div className="homeProgressStatVal">{bookmarksCount}</div>
              <div className="subtle homeProgressStatLbl">Bookmarks</div>
            </div>
            <div className="homeProgressStat">
              <div className="homeProgressStatVal">{achievementsCount}</div>
              <div className="subtle homeProgressStatLbl">Achievements</div>
            </div>
          </div>
        </div>
      </HomePressable>

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
    </main>
  );
}
