"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCourseTopics, findTopic } from "../lib/curriculum";
import type { CourseId, Topic } from "../lib/curriculum";

type SearchResult = 
  | { type: "course"; id: string; title: string; href: string }
  | { type: "page"; id: string; title: string; href: string }
  | { type: "topic"; topic: Topic; courseId: CourseId; href: string };

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const orgochem1Topics = getCourseTopics("orgochem-1");
  const orgochem2Topics = getCourseTopics("orgochem-2");
  const allTopics = [...orgochem1Topics, ...orgochem2Topics];

  const results = useMemo((): SearchResult[] => {
    if (!query.trim()) {
      return [
        { type: "course" as const, id: "orgochem-1", title: "OrgoChem I", href: "/orgochem-1" },
        { type: "course" as const, id: "orgochem-2", title: "OrgoChem II", href: "/orgochem-2" },
        { type: "page" as const, id: "home", title: "Home", href: "/" },
        { type: "page" as const, id: "practice", title: "Practice", href: "/practice" },
        { type: "page" as const, id: "assignments", title: "Assignments", href: "/assignments" },
        { type: "page" as const, id: "professor", title: "Professor Tools", href: "/professor" },
        { type: "page" as const, id: "tools", title: "Study Tools", href: "/tools" },
        { type: "page" as const, id: "uploads", title: "Uploads", href: "/uploads" },
        { type: "page" as const, id: "search", title: "Search", href: "/search" },
        { type: "page" as const, id: "ask", title: "Ask Questions", href: "/ask" },
      ];
    }

    const q = query.toLowerCase();
    const topicResults: SearchResult[] = [];

    allTopics.forEach((topic) => {
      const searchText = `${topic.title} ${topic.shortDesc}`.toLowerCase();
      if (searchText.includes(q)) {
        const courseId = orgochem1Topics.includes(topic) ? "orgochem-1" : "orgochem-2";
        topicResults.push({
          type: "topic" as const,
          topic,
          courseId,
          href: `/${courseId}/${topic.slug}`,
        });
      }
    });

    return topicResults.slice(0, 10);
  }, [query, allTopics, orgochem1Topics]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Cmd+K or Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        setQuery("");
        setSelectedIndex(0);
      }

      // Escape to close
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        setQuery("");
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = results[selectedIndex];
        if (selected) {
          router.push(selected.href);
          setIsOpen(false);
          setQuery("");
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isOpen, results, selectedIndex, router]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "20vh",
      }}
      onClick={() => setIsOpen(false)}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 600,
          background: "var(--panel)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div style={{ padding: 16, borderBottom: "1px solid var(--border)" }}>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search topics, courses, or pages... (Cmd/Ctrl+K)"
            autoFocus
            style={{
              width: "100%",
              padding: "12px 16px",
              fontSize: 16,
              background: "var(--panel-2)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              color: "var(--text)",
              outline: "none",
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setIsOpen(false);
                setQuery("");
              }
            }}
          />
        </div>

        {/* Results */}
        <div style={{ maxHeight: 400, overflowY: "auto" }}>
          {results.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", color: "var(--muted)" }}>
              No results found
            </div>
          ) : (
            results.map((result, index) => {
              const isTopic = result.type === "topic";
              return (
                <Link
                  key={result.href}
                  href={result.href}
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: "block",
                    padding: "12px 16px",
                    background: index === selectedIndex ? "var(--panel-2)" : "transparent",
                    borderLeft: index === selectedIndex ? "3px solid var(--blue)" : "3px solid transparent",
                    textDecoration: "none",
                    color: "var(--text)",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                    {isTopic ? result.topic.title : result.title}
                  </div>
                  {isTopic && (
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>
                      {result.courseId === "orgochem-1" ? "OrgoChem I" : "OrgoChem II"} • {result.topic.shortDesc}
                    </div>
                  )}
                  {result.type === "course" && (
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>Course</div>
                  )}
                  {result.type === "page" && (
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>Page</div>
                  )}
                </Link>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div style={{ 
          padding: "12px 16px", 
          borderTop: "1px solid var(--border)",
          fontSize: 12,
          color: "var(--muted)",
          display: "flex",
          gap: 16,
        }}>
          <span>↑↓ Navigate</span>
          <span>Enter Select</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  );
}
