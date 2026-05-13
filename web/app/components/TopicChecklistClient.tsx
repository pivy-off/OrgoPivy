"use client";

import { useCallback, useState } from "react";
import { ChemFormattedLine } from "../lib/chemTypography";

export default function TopicChecklistClient({ items, chemPolish }: { items: string[]; chemPolish?: boolean }) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const toggle = useCallback((i: number) => {
    setChecked((prev) => ({ ...prev, [i]: !prev[i] }));
  }, []);

  return (
    <div className="topicChecklist">
      {items.map((raw, i) => {
        const parts = raw.split(":");
        const head = (parts[0] || "").trim();
        const tail = parts.slice(1).join(":").trim();
        const isOn = Boolean(checked[i]);
        return (
          <button
            key={`${i}-${raw}`}
            type="button"
            className="topicCheckItem topicCheckItemBtn"
            onClick={() => toggle(i)}
            aria-pressed={isOn}
          >
            <div className={`topicCheckBox ${isOn ? "topicCheckBoxOn" : ""}`} aria-hidden="true">
              {isOn ? "✓" : ""}
            </div>
            <div className="topicCheckText">
              <div className="topicCheckHead">{chemPolish ? <ChemFormattedLine text={head} /> : head}</div>
              {tail ? <div className="topicCheckTail">{chemPolish ? <ChemFormattedLine text={tail} /> : tail}</div> : null}
            </div>
          </button>
        );
      })}
    </div>
  );
}
