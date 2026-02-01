"use client";

import { useState, useEffect } from "react";

type Props = {
  items: string[];
  course: string;
  topic: string;
};

export default function StudyStepsChecklist({ items, course, topic }: Props) {
  const storageKey = `orgopivy-study-steps-${course}-${topic}`;
  
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
      console.error("Failed to load study steps progress", e);
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
        console.error("Failed to save study steps progress", e);
      }
      
      return next;
    });
  };

  const progress = items.length > 0 ? (checked.size / items.length) * 100 : 0;

  return (
    <div>
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        marginBottom: 16
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)" }}>
          Progress: {checked.size} / {items.length}
        </div>
        <div style={{
          width: 120,
          height: 6,
          background: "var(--border-2)",
          borderRadius: 3,
          overflow: "hidden"
        }}>
          <div style={{
            width: `${progress}%`,
            height: "100%",
            background: "linear-gradient(90deg, var(--blue), var(--purple))",
            transition: "width 0.3s ease"
          }} />
        </div>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {items.map((raw, i) => {
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
                border: `1px solid ${isChecked ? "rgba(0, 122, 255, 0.3)" : "var(--border)"}`,
                background: isChecked ? "rgba(0, 122, 255, 0.04)" : "transparent",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                if (!isChecked) {
                  e.currentTarget.style.borderColor = "rgba(0, 122, 255, 0.2)";
                  e.currentTarget.style.background = "rgba(0, 122, 255, 0.02)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isChecked) {
                  e.currentTarget.style.borderColor = "var(--border)";
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
                  accentColor: "#007AFF"
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 14,
                  fontWeight: isChecked ? 500 : 600,
                  color: isChecked ? "var(--muted)" : "var(--text)",
                  textDecoration: isChecked ? "line-through" : "none",
                  marginBottom: tail ? 4 : 0
                }}>
                  {head}
                </div>
                {tail ? (
                  <div style={{
                    fontSize: 12,
                    color: "var(--muted)",
                    lineHeight: 1.5
                  }}>
                    {tail}
                  </div>
                ) : null}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
