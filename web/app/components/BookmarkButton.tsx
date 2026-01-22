"use client";

import { useState, useEffect } from "react";
import type { CourseId } from "../lib/curriculum";
import { addBookmark, removeBookmark, isBookmarked as checkBookmarked } from "../lib/progress";

type Props = {
  course: CourseId;
  topic: string;
};

export default function BookmarkButton({ course, topic }: Props) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setBookmarked(checkBookmarked(course, topic));
  }, [course, topic]);

  function handleToggle() {
    if (bookmarked) {
      removeBookmark(course, topic);
      setBookmarked(false);
    } else {
      addBookmark(course, topic);
      setBookmarked(true);
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="btn"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 12px",
      }}
      aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      <span style={{ fontSize: 18 }}>{bookmarked ? "⭐" : "☆"}</span>
      <span style={{ fontSize: 13 }}>{bookmarked ? "Bookmarked" : "Bookmark"}</span>
    </button>
  );
}
