"use client";

import { useState } from "react";
import { ChemFormattedLine } from "../lib/chemTypography";
import { isStudyTip } from "@/lib/studySteps";

type Props = {
  items: string[];
  course: string;
  topic: string;
  chemPolish?: boolean;
};

function loadChecked(storageKey: string): Set<number> {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) return new Set(JSON.parse(saved) as number[]);
  } catch (e) {
    console.error("Failed to load study steps progress", e);
  }
  return new Set();
}

export default function StudyStepsChecklist({ items, course, topic, chemPolish }: Props) {
  const storageKey = `orgopivy-study-steps-${course}-${topic}`;

  const [checked, setChecked] = useState<Set<number>>(() =>
    typeof window !== "undefined" ? loadChecked(storageKey) : new Set(),
  );

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

  const steps = items.filter((raw) => !isStudyTip(raw));
  const progress = steps.length > 0 ? (checked.size / steps.length) * 100 : 0;

  return (
    <div>
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        marginBottom: 16
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(0, 0, 0, 0.6)" }}>
          Progress: {checked.size} / {steps.length}
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
        {steps.map((raw, i) => {
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
                  accentColor: "#007AFF"
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 14,
                  fontWeight: isChecked ? 500 : 600,
                  color: isChecked ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.9)",
                  textDecoration: isChecked ? "line-through" : "none",
                  marginBottom: tail ? 4 : 0
                }}>
                  {chemPolish ? <ChemFormattedLine text={head} /> : head}
                </div>
                {tail ? (
                  <div style={{
                    fontSize: 12,
                    color: "rgba(0, 0, 0, 0.6)",
                    lineHeight: 1.5
                  }}>
                    {chemPolish ? <ChemFormattedLine text={tail} /> : tail}
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
