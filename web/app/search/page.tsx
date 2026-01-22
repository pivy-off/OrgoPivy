"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { getCourseTopics } from "../lib/curriculum";
import type { CourseId, Topic } from "../lib/curriculum";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "orgochem-1" | "orgochem-2">("all");

  const orgochem1Topics = getCourseTopics("orgochem-1");
  const orgochem2Topics = getCourseTopics("orgochem-2");
  const allTopics = [...orgochem1Topics, ...orgochem2Topics];

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();
    let topicsToSearch = allTopics;

    if (selectedCategory === "orgochem-1") {
      topicsToSearch = orgochem1Topics;
    } else if (selectedCategory === "orgochem-2") {
      topicsToSearch = orgochem2Topics;
    }

    return topicsToSearch
      .filter((topic) => {
        const searchText = `${topic.title} ${topic.shortDesc} ${topic.summary} ${topic.mustKnow.join(" ")} ${topic.howToStudy.join(" ")}`.toLowerCase();
        return searchText.includes(q);
      })
      .map((topic) => {
        const courseId = orgochem1Topics.includes(topic) ? "orgochem-1" : "orgochem-2";
        return { topic, courseId };
      });
  }, [query, selectedCategory, allTopics, orgochem1Topics, orgochem2Topics]);

  // Focus search input on mount
  useEffect(() => {
    const input = document.querySelector<HTMLInputElement>('input[type="text"]');
    if (input) {
      input.focus();
    }
  }, []);

  return (
    <main style={{ padding: "40px 0", minHeight: "calc(100vh - 120px)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 48, fontWeight: 700, marginBottom: 8 }}>Search</h1>
          <p className="subtle" style={{ fontSize: 16 }}>
            Find topics, concepts, and study materials across all courses
          </p>
        </div>

        {/* Search Input */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ position: "relative", marginBottom: 16 }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search topics, concepts, or keywords..."
              style={{
                width: "100%",
                padding: "16px 48px 16px 20px",
                borderRadius: "var(--radius-lg)",
                border: "2px solid var(--border)",
                background: "var(--panel)",
                color: "var(--text)",
                fontSize: 18,
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--blue)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            />
            <div
              style={{
                position: "absolute",
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 24,
                color: "var(--muted)",
              }}
            >
              🔍
            </div>
          </div>

          {/* Category Filter */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={selectedCategory === "all" ? "pill pillActive" : "pill"}
            >
              All Courses
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("orgochem-1")}
              className={selectedCategory === "orgochem-1" ? "pill pillActive" : "pill"}
            >
              OrgoChem I
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("orgochem-2")}
              className={selectedCategory === "orgochem-2" ? "pill pillActive" : "pill"}
            >
              OrgoChem II
            </button>
          </div>
        </div>

        {/* Results */}
        {query.trim() && (
          <div>
            <div style={{ marginBottom: 16, fontSize: 14, color: "var(--muted)" }}>
              {results.length === 0 ? (
                <>No results found for "{query}"</>
              ) : (
                <>
                  Found {results.length} result{results.length !== 1 ? "s" : ""} for "{query}"
                </>
              )}
            </div>

            {results.length > 0 ? (
              <div style={{ display: "grid", gap: 12 }}>
                {results.map(({ topic, courseId }) => (
                  <Link
                    key={`${courseId}-${topic.slug}`}
                    href={`/${courseId}/${topic.slug}`}
                    className="card"
                    style={{
                      textDecoration: "none",
                      display: "block",
                      padding: 20,
                      transition: "transform 0.2s, box-shadow 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "var(--shadow)";
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: "var(--text)" }}>
                          {topic.title}
                        </div>
                        <div style={{ fontSize: 14, color: "var(--muted)", marginBottom: 8 }}>
                          {topic.shortDesc}
                        </div>
                        <div style={{ fontSize: 13, color: "var(--muted-2)" }}>
                          {courseId === "orgochem-1" ? "OrgoChem I" : "OrgoChem II"}
                        </div>
                      </div>
                      <div style={{ fontSize: 24, color: "var(--muted-2)" }}>→</div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="card" style={{ padding: 40, textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "var(--text)" }}>
                  No results found
                </div>
                <div className="subtle" style={{ fontSize: 14 }}>
                  Try different keywords or check your spelling
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!query.trim() && (
          <div className="card" style={{ padding: 40, textAlign: "center" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, color: "var(--text)" }}>
              Start searching
            </div>
            <div className="subtle" style={{ fontSize: 15, marginBottom: 24 }}>
              Search across all topics, concepts, and study materials
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginTop: 32 }}>
              <div style={{ padding: 20, background: "var(--panel-2)", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{orgochem1Topics.length}</div>
                <div className="subtle" style={{ fontSize: 13 }}>OrgoChem I Topics</div>
              </div>
              <div style={{ padding: 20, background: "var(--panel-2)", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{orgochem2Topics.length}</div>
                <div className="subtle" style={{ fontSize: 13 }}>OrgoChem II Topics</div>
              </div>
              <div style={{ padding: 20, background: "var(--panel-2)", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{allTopics.length}</div>
                <div className="subtle" style={{ fontSize: 13 }}>Total Topics</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
