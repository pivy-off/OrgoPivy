"use client";

import { useState, useEffect } from "react";
import type { CourseId } from "../lib/curriculum";
import { getStudyNotes, saveStudyNote } from "../lib/progress";

type Props = {
  course: CourseId;
  topic: string;
};

export default function StudyNotes({ course, topic }: Props) {
  const [content, setContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const note = getStudyNotes(course, topic);
    if (note) {
      setContent(note.content);
    }
  }, [course, topic]);

  function handleSave() {
    saveStudyNote(course, topic, content);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const hasContent = content.trim().length > 0;

  if (!isExpanded) {
    return (
      <button
        type="button"
        className="btn"
        onClick={() => setIsExpanded(true)}
        style={{ width: "100%" }}
      >
        {hasContent ? "📝 Edit Notes" : "📝 Add Study Notes"}
      </button>
    );
  }

  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        padding: 16,
        background: "var(--panel)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 15 }}>Study Notes</div>
        <button
          type="button"
          className="btn"
          onClick={() => setIsExpanded(false)}
          style={{ padding: "4px 8px", fontSize: 12 }}
        >
          ✕
        </button>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your notes here... (formulas, key concepts, reminders, etc.)"
        style={{
          width: "100%",
          minHeight: 150,
          padding: 12,
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--border)",
          background: "var(--panel)",
          color: "var(--text)",
          fontFamily: "inherit",
          fontSize: 14,
          lineHeight: 1.6,
          resize: "vertical",
        }}
      />

      <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end" }}>
        <button
          type="button"
          className="btn"
          onClick={() => setIsExpanded(false)}
          style={{ fontSize: 13 }}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btnPrimary"
          onClick={handleSave}
          style={{ fontSize: 13 }}
        >
          {saved ? "✓ Saved" : "Save Notes"}
        </button>
      </div>
    </div>
  );
}
