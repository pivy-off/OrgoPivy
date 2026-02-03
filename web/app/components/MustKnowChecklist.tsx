"use client";

import { useState, useEffect } from "react";
import type { Video } from "../lib/curriculum";

type Props = {
  items: string[];
  videos?: Video[];
  course: string;
  topic: string;
  topicTitle?: string;
};

export default function MustKnowChecklist({ items, videos, course, topic, topicTitle }: Props) {
  const storageKey = `orgopivy-checklist-${course}-${topic}`;
  
  const [checked, setChecked] = useState<Set<number>>(new Set());

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setChecked(new Set(parsed));
      }
    } catch (e) {
      console.error("Failed to load checklist progress", e);
    }
  }, [storageKey]);

  const toggleItem = (index: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      try {
        localStorage.setItem(storageKey, JSON.stringify(Array.from(next)));
      } catch (e) {
        console.error("Failed to save checklist progress", e);
      }
      return next;
    });
  };

  const progress = items.length > 0 ? (checked.size / items.length) * 100 : 0;

  async function reportBroken(
    course: string,
    topicSlug: string,
    topicTitle: string,
    video: Video,
    itemIndex: number
  ) {
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "broken_video",
          course,
          topic: topicTitle,
          topicSlug,
          videoTitle: video.title,
          videoUrl: video.url,
          itemIndex,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        alert("Thanks! Your report has been saved.");
      } else {
        alert("Could not save report. Please try again.");
      }
    } catch {
      alert("Could not save report. Please try again.");
    }
  }

  return (
    <div className="mustKnowChecklist">
      <div className="mustKnowProgress">
        <span className="mustKnowProgressText">{checked.size} / {items.length} complete</span>
        <div className="mustKnowProgressBar">
          <div className="mustKnowProgressFill" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <ol className="mustKnowList">
        {items.map((raw, i) => {
          const parts = raw.split(":");
          const head = (parts[0] || "").trim();
          const tail = parts.slice(1).join(":").trim();
          const isChecked = checked.has(i);
          const hasVideo = videos && videos[i];

          return (
            <li key={`${i}-${raw}`} className={`mustKnowItem ${isChecked ? "isChecked" : ""}`}>
              <label className="mustKnowLabel">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleItem(i)}
                  className="mustKnowCheckbox"
                />
                <span className="mustKnowContent">
                  <span className="mustKnowHead">{head}</span>
                  {tail ? <span className="mustKnowTail">{tail}</span> : null}
                  {hasVideo && (
                    <div className="mustKnowVideoRow">
                      <a
                        href={videos![i].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="mustKnowVideoLink"
                      >
                        <img src={videos![i].thumbnail} alt="" className="mustKnowVideoThumb" />
                        <span>{videos![i].title}</span>
                        <span className="mustKnowVideoArrow">→</span>
                      </a>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          reportBroken(course, topic, topicTitle || topic, videos![i], i);
                        }}
                        className="mustKnowReportBtn"
                        title="Report broken video"
                      >
                        Report broken
                      </button>
                    </div>
                  )}
                </span>
              </label>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
