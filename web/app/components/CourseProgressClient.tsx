"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CourseId, Topic } from "../lib/curriculum";

type ProgressMap = Record<string, boolean>;

function storageKey(course: CourseId) {
  return `orgopivy-progress-${course}`;
}

function safeParse(raw: string | null): ProgressMap {
  if (!raw) return {};
  try {
    const v = JSON.parse(raw);
    if (v && typeof v === "object") return v as ProgressMap;
    return {};
  } catch {
    return {};
  }
}

export default function CourseProgressClient({
  course,
  topics,
}: {
  course: CourseId;
  topics: Topic[];
}) {
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    const key = storageKey(course);
    setProgress(safeParse(localStorage.getItem(key)));
  }, [course]);

  useEffect(() => {
    const key = storageKey(course);
    localStorage.setItem(key, JSON.stringify(progress));
  }, [progress, course]);

  const doneCount = useMemo(() => {
    let n = 0;
    for (const t of topics) {
      if (progress[t.slug]) n += 1;
    }
    return n;
  }, [progress, topics]);

  const pct = useMemo(() => {
    if (!topics.length) return 0;
    return Math.round((doneCount / topics.length) * 100);
  }, [doneCount, topics.length]);

  const nextTopic = useMemo(() => {
    const firstIncomplete = topics.find((t) => !progress[t.slug]);
    return firstIncomplete || topics[0] || null;
  }, [topics, progress]);

  function toggle(slug: string) {
    setProgress((p) => ({ ...p, [slug]: !p[slug] }));
  }

  function resetAll() {
    const cleared: ProgressMap = {};
    setProgress(cleared);
  }

  return (
    <div className="card" style={{ boxShadow: "none" }}>
      <div className="cardInner" style={{ display: "grid", gap: 12 }}>
        <div className="row">
          <div style={{ display: "grid", gap: 4 }}>
            <div style={{ fontWeight: 950 }}>Progress</div>
            <div className="subtle">
              {doneCount} of {topics.length} topics completed
            </div>
          </div>

          <div className="row">
            <div className="badge">{pct}%</div>

            {nextTopic ? (
              <Link className="btn btnPrimary" href={`/${course}/${nextTopic.slug}`}>
                Continue
              </Link>
            ) : null}

            <button className="btn" type="button" onClick={resetAll}>
              Reset
            </button>
          </div>
        </div>

        <div className="divider" />

        <div style={{ display: "grid", gap: 10 }}>
          {topics.map((t, idx) => {
            const checked = Boolean(progress[t.slug]);

            return (
              <div key={t.slug} className="progressRow">
                <button
                  type="button"
                  className={checked ? "progressCheck progressCheckOn" : "progressCheck"}
                  aria-label={checked ? "Mark incomplete" : "Mark complete"}
                  onClick={() => toggle(t.slug)}
                >
                  {checked ? "✓" : ""}
                </button>

                <div style={{ display: "grid", gap: 2 }}>
                  <div style={{ fontWeight: 950, opacity: checked ? 0.6 : 1 }}>
                    {idx + 1}. {t.title}
                  </div>
                  <div className="subtle" style={{ fontSize: 12, opacity: checked ? 0.7 : 1 }}>
                    {t.shortDesc}
                  </div>
                </div>

                <Link className="btn" href={`/${course}/${t.slug}`}>
                  Open
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
