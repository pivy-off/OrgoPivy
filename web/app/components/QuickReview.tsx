"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getCourseTopics } from "../lib/curriculum";
import type { CourseId, Topic } from "../lib/curriculum";

export default function QuickReview() {
  const [randomTopic, setRandomTopic] = useState<{ topic: Topic; courseId: CourseId } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const orgochem1Topics = getCourseTopics("orgochem-1");
  const orgochem2Topics = getCourseTopics("orgochem-2");
  const allTopics: Array<{ topic: Topic; courseId: CourseId }> = [
    ...orgochem1Topics.map((t) => ({ topic: t, courseId: "orgochem-1" as CourseId })),
    ...orgochem2Topics.map((t) => ({ topic: t, courseId: "orgochem-2" as CourseId })),
  ];

  function getRandomTopic() {
    setIsLoading(true);
    setTimeout(() => {
      const random = allTopics[Math.floor(Math.random() * allTopics.length)];
      setRandomTopic(random);
      setIsLoading(false);
    }, 300);
  }

  useEffect(() => {
    getRandomTopic();
  }, []);

  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Quick Review</div>
        <div className="subtle" style={{ fontSize: 13 }}>
          Random topic for spaced repetition
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>🎲</div>
          <div>Selecting a topic...</div>
        </div>
      ) : randomTopic ? (
        <div style={{ textAlign: "center" }}>
          <div style={{ 
            padding: 24, 
            background: "var(--panel-2)", 
            borderRadius: "var(--radius-md)",
            marginBottom: 16
          }}>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8, textTransform: "uppercase" }}>
              {randomTopic.courseId === "orgochem-1" ? "OrgoChem I" : "OrgoChem II"}
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: "var(--text)" }}>
              {randomTopic.topic.title}
            </div>
            <div style={{ fontSize: 14, color: "var(--muted)", marginBottom: 16 }}>
              {randomTopic.topic.shortDesc}
            </div>
            <Link
              href={`/${randomTopic.courseId}/${randomTopic.topic.slug}`}
              className="btn btnPrimary"
              style={{ display: "inline-block" }}
            >
              Review Topic
            </Link>
          </div>

          <button
            type="button"
            className="btn"
            onClick={getRandomTopic}
            style={{ width: "100%" }}
          >
            🎲 Get Another Topic
          </button>
        </div>
      ) : null}
    </div>
  );
}
