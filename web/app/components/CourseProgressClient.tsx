"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CourseId, Topic } from "../lib/curriculum";
import { useLanguage } from "../contexts/LanguageContext";

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
  const { t } = useLanguage();
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
    for (const topic of topics) {
      if (progress[topic.slug]) n += 1;
    }
    return n;
  }, [progress, topics]);

  const pct = useMemo(() => {
    if (!topics.length) return 0;
    return Math.round((doneCount / topics.length) * 100);
  }, [doneCount, topics.length]);

  const nextTopic = useMemo(() => {
    const firstIncomplete = topics.find((topic) => !progress[topic.slug]);
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
            <div style={{ fontWeight: 950 }}>{t("progress")}</div>
            <div className="subtle">
              {doneCount} {t("of")} {topics.length} {t("topicsCompletedCount")}
            </div>
          </div>

          <div className="row">
            <div className="badge">{pct}%</div>

            {nextTopic ? (
              <Link className="btn btnPrimary" href={`/${course}/${nextTopic.slug}`}>
                {t("continue")}
              </Link>
            ) : null}

            <button className="btn" type="button" onClick={resetAll}>
              {t("reset")}
            </button>
          </div>
        </div>

        <div className="divider" />

        <div style={{ display: "grid", gap: 10 }}>
          {topics.map((topic, idx) => {
            const checked = Boolean(progress[topic.slug]);
            const isNext = nextTopic?.slug === topic.slug;

            return (
              <div 
                key={topic.slug} 
                className="progressRow"
                style={{
                  borderColor: isNext ? "rgba(0, 122, 255, 0.4)" : undefined,
                  background: isNext ? "rgba(0, 122, 255, 0.04)" : undefined,
                }}
              >
                <button
                  type="button"
                  className={checked ? "progressCheck progressCheckOn" : "progressCheck"}
                  aria-label={checked ? "Mark incomplete" : "Mark complete"}
                  onClick={() => toggle(topic.slug)}
                  style={{ flexShrink: 0 }}
                >
                  {checked ? "✓" : ""}
                </button>

                <div className="progressRowLeft">
                  <div className="progressRowTitle" style={{ opacity: checked ? 0.6 : 1 }}>
                    {idx + 1}. {topic.title}
                  </div>
                  <div className="progressRowDesc" style={{ opacity: checked ? 0.7 : 1 }}>
                    {topic.shortDesc}
                  </div>
                </div>

                <div className="progressRowAction">
                  <Link className="btn" href={`/${course}/${topic.slug}`}>
                    {t("open")}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
