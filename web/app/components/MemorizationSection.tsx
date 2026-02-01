"use client";

import { useState } from "react";
import { getMemorizationItems } from "../lib/memorization";
import type { MemorizationItemEntry } from "../lib/memorization";

type Props = {
  slug: string;
};

export default function MemorizationSection({ slug }: Props) {
  const items = getMemorizationItems(slug);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  if (items.length === 0) {
    return null;
  }

  function toggleCategory(category: string) {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }

  return (
    <div className="topicSection">
      <div className="cardInner" style={{ padding: 20 }}>
        <div className="topicSectionHeader">
          <div className="topicSectionTitle">Things to Memorize</div>
          <div className="subtle" style={{ fontSize: 13 }}>
            Essential values and facts
          </div>
        </div>

        <div style={{ display: "grid", gap: 16, marginTop: 16 }}>
          {items.map((category, idx) => {
            const isExpanded = expandedCategories.has(category.category);
            return (
              <div
                key={idx}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleCategory(category.category)}
                  style={{
                    width: "100%",
                    padding: "14px 18px",
                    background: "var(--panel)",
                    border: "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--panel-2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--panel)";
                  }}
                >
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>
                    {category.category}
                  </div>
                  <div style={{ fontSize: 18, color: "var(--muted)" }}>
                    {isExpanded ? "−" : "+"}
                  </div>
                </button>

                {isExpanded && (
                  <div
                    style={{
                      padding: "16px 18px",
                      background: "var(--panel-2)",
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    {category.categoryImageUrl && (
                      <div style={{ marginBottom: 16, textAlign: "center" }}>
                        <img
                          src={category.categoryImageUrl}
                          alt={category.categoryImageAlt ?? category.category}
                          width={240}
                          height={120}
                          referrerPolicy="no-referrer"
                          style={{ objectFit: "contain", borderRadius: "var(--radius-sm)", background: "var(--panel)" }}
                        />
                      </div>
                    )}
                    <div style={{ display: "grid", gap: 12 }}>
                      {category.items.map((item, itemIdx) => {
                        const entry = item as MemorizationItemEntry;
                        return (
                          <div
                            key={itemIdx}
                            style={{
                              display: "grid",
                              gridTemplateColumns: entry.imageUrl ? "auto 1fr auto" : "1fr auto",
                              gap: 14,
                              alignItems: "center",
                              padding: "12px 14px",
                              background: "var(--panel)",
                              borderRadius: "var(--radius-sm)",
                              border: "1px solid var(--border-2)",
                            }}
                          >
                            {entry.imageUrl && (
                              <img
                                src={entry.imageUrl}
                                alt={entry.imageAlt ?? entry.term}
                                width={80}
                                height={80}
                                referrerPolicy="no-referrer"
                                style={{ objectFit: "contain", borderRadius: "var(--radius-sm)", background: "var(--panel-2)" }}
                              />
                            )}
                            <div>
                              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>
                                {entry.term}
                              </div>
                              {entry.note && (
                                <div style={{ fontSize: 12, color: "var(--muted-2)", marginTop: 2 }}>
                                  {entry.note}
                                </div>
                              )}
                            </div>
                            <div
                              style={{
                                fontSize: 15,
                                fontWeight: 700,
                                color: "var(--blue)",
                                textAlign: "right",
                              }}
                            >
                              {entry.value}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
