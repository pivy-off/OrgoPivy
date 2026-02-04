"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useLanguage } from "../contexts/LanguageContext";
import { getCourseTopics, findTopic } from "../lib/curriculum";
import type { CourseId, Topic } from "../lib/curriculum";

export default function HomeSearch() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const orgochem1Topics = getCourseTopics("orgochem-1");
  const orgochem2Topics = getCourseTopics("orgochem-2");
  const allTopics = [...orgochem1Topics, ...orgochem2Topics];

  const results = useMemo(() => {
    if (!query.trim()) return [];
    
    const q = query.toLowerCase();
    return allTopics
      .filter((topic) => {
        const searchText = `${topic.title} ${topic.shortDesc} ${topic.summary}`.toLowerCase();
        return searchText.includes(q);
      })
      .slice(0, 8);
  }, [query, allTopics]);

  function getCourseId(topic: Topic): CourseId {
    return orgochem1Topics.includes(topic) ? "orgochem-1" : "orgochem-2";
  }

  return (
    <div style={{ position: "relative", marginBottom: 40 }}>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder={t("searchPlaceholder")}
          style={{
            width: "100%",
            maxWidth: 600,
            margin: "0 auto",
            display: "block",
            padding: "16px 48px 16px 20px",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border)",
            background: "var(--panel)",
            color: "var(--text)",
            fontSize: 16,
            outline: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 16,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 20,
            color: "var(--muted)",
          }}
        >
          🔍
        </div>
      </div>

      {isOpen && results.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: 600,
            marginTop: 8,
            background: "var(--panel)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow)",
            maxHeight: 400,
            overflowY: "auto",
            zIndex: 100,
          }}
        >
          {results.map((topic) => {
            const courseId = getCourseId(topic);
            return (
              <Link
                key={`${courseId}-${topic.slug}`}
                href={`/${courseId}/${topic.slug}`}
                style={{
                  display: "block",
                  padding: 16,
                  borderBottom: "1px solid var(--border-2)",
                  textDecoration: "none",
                  color: "var(--text)",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--panel-2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--panel)";
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                  {topic.title}
                </div>
                <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>
                  {topic.shortDesc}
                </div>
                <div style={{ fontSize: 11, color: "var(--muted-2)" }}>
                  {courseId === "orgochem-1" ? "OrgoChem I" : "OrgoChem II"}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
