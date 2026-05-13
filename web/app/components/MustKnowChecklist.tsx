"use client";

import { useState, useEffect } from "react";
import { ChemFormattedLine } from "../lib/chemTypography";
import type { TopicMustKnowItem } from "../lib/curriculum";

type Props = {
  items: string[];
  course: string;
  topic: string;
  /** OrgoChem II: monospace / unicode formulas + bold reagents in checklist text. */
  chemPolish?: boolean;
  /** When set, each row shows its own explainer video (OrgoChem II enrichment). */
  structuredItems?: TopicMustKnowItem[];
};

export default function MustKnowChecklist({ items, course, topic, chemPolish, structuredItems }: Props) {
  const storageKey = `orgopivy-checklist-${course}-${topic}-v4`;
  
  const [checked, setChecked] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Load saved progress
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
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      
      // Save to localStorage
      try {
        localStorage.setItem(storageKey, JSON.stringify(Array.from(next)));
      } catch (e) {
        console.error("Failed to save checklist progress", e);
      }
      
      return next;
    });
  };

  const rows = structuredItems && structuredItems.length > 0 ? structuredItems : null;
  const total = rows ? rows.length : items.length;
  const progress = total > 0 ? (checked.size / total) * 100 : 0;

  return (
    <div>
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        marginBottom: 16
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(0, 0, 0, 0.6)" }}>
          Progress: {checked.size} / {total}
        </div>
        <div style={{
          width: 120,
          height: 6,
          background: "rgba(0, 0, 0, 0.08)",
          borderRadius: 3,
          overflow: "hidden"
        }}>
          <div style={{
            width: `${progress}%`,
            height: "100%",
            background: "linear-gradient(90deg, #007AFF, #5856D6)",
            transition: "width 0.3s ease"
          }} />
        </div>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {(rows ?? []).map((row, i) => {
          const head = row.title;
          const tail = row.description;
          const isChecked = checked.has(i);
          const vid = row.videoId;
          const watch = `https://www.youtube.com/watch?v=${vid}`;
          const thumb = `https://img.youtube.com/vi/${vid}/hqdefault.jpg`;
          return (
            <label
              key={`${i}-${head}`}
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                padding: 14,
                borderRadius: 12,
                border: `1px solid ${isChecked ? "rgba(0, 122, 255, 0.3)" : "rgba(0, 0, 0, 0.08)"}`,
                background: isChecked ? "rgba(0, 122, 255, 0.04)" : "transparent",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!isChecked) {
                  e.currentTarget.style.borderColor = "rgba(0, 122, 255, 0.2)";
                  e.currentTarget.style.background = "rgba(0, 122, 255, 0.02)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isChecked) {
                  e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.08)";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleItem(i)}
                style={{
                  width: 20,
                  height: 20,
                  marginTop: 2,
                  cursor: "pointer",
                  accentColor: "#007AFF",
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: isChecked ? 500 : 600,
                    color: isChecked ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.9)",
                    textDecoration: isChecked ? "line-through" : "none",
                    marginBottom: tail ? 4 : 0,
                  }}
                >
                  {chemPolish ? <ChemFormattedLine text={head} /> : head}
                </div>
                {tail ? (
                  <div
                    style={{
                      fontSize: 12,
                      color: "rgba(0, 0, 0, 0.6)",
                      lineHeight: 1.5,
                    }}
                  >
                    {chemPolish ? <ChemFormattedLine text={tail} /> : tail}
                  </div>
                ) : null}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
                  <a href={watch} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                    <img
                      src={thumb}
                      alt=""
                      width={96}
                      height={54}
                      style={{ borderRadius: 8, objectFit: "cover", border: "1px solid rgba(0,0,0,0.08)" }}
                    />
                  </a>
                  <a href={watch} target="_blank" rel="noreferrer" style={{ fontSize: 12, fontWeight: 600 }} onClick={(e) => e.stopPropagation()}>
                    Open video
                  </a>
                </div>
              </div>
            </label>
          );
        })}
        {!rows
          ? items.map((raw, i) => {
              const parts = raw.split(":");
              const head = (parts[0] || "").trim();
              const tail = parts.slice(1).join(":").trim();
              const isChecked = checked.has(i);

              return (
                <label
                  key={`${i}-${raw}`}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                    padding: 14,
                    borderRadius: 12,
                    border: `1px solid ${isChecked ? "rgba(0, 122, 255, 0.3)" : "rgba(0, 0, 0, 0.08)"}`,
                    background: isChecked ? "rgba(0, 122, 255, 0.04)" : "transparent",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isChecked) {
                      e.currentTarget.style.borderColor = "rgba(0, 122, 255, 0.2)";
                      e.currentTarget.style.background = "rgba(0, 122, 255, 0.02)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isChecked) {
                      e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.08)";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleItem(i)}
                    style={{
                      width: 20,
                      height: 20,
                      marginTop: 2,
                      cursor: "pointer",
                      accentColor: "#007AFF",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: isChecked ? 500 : 600,
                        color: isChecked ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.9)",
                        textDecoration: isChecked ? "line-through" : "none",
                        marginBottom: tail ? 4 : 0,
                      }}
                    >
                      {chemPolish ? <ChemFormattedLine text={head} /> : head}
                    </div>
                    {tail ? (
                      <div
                        style={{
                          fontSize: 12,
                          color: "rgba(0, 0, 0, 0.6)",
                          lineHeight: 1.5,
                        }}
                      >
                        {chemPolish ? <ChemFormattedLine text={tail} /> : tail}
                      </div>
                    ) : null}
                  </div>
                </label>
              );
            })
          : null}
      </div>
    </div>
  );
}
