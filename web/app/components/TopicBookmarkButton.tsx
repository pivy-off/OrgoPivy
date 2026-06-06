"use client";

import { useCallback, useEffect, useState } from "react";

function storageKey(course: string, topic: string) {
  return `orgopivy-bookmark-${course}-${topic}`;
}

type Props = {
  course: string;
  topic: string;
};

export default function TopicBookmarkButton({ course, topic }: Props) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("orgopivy-bookmarks");
      if (!raw) return;
      const list = JSON.parse(raw) as string[];
      if (Array.isArray(list)) {
        setSaved(list.includes(storageKey(course, topic)));
      }
    } catch {
      // ignore
    }
  }, [course, topic]);

  const toggle = useCallback(() => {
    const key = storageKey(course, topic);
    try {
      const raw = localStorage.getItem("orgopivy-bookmarks");
      let list: string[] = [];
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) list = parsed.filter((x) => typeof x === "string");
      }
      const next = list.includes(key) ? list.filter((k) => k !== key) : [...list, key];
      localStorage.setItem("orgopivy-bookmarks", JSON.stringify(next));
      setSaved(next.includes(key));
    } catch {
      // ignore
    }
  }, [course, topic]);

  return (
    <button type="button" className="btn topicBookmarkBtn" onClick={toggle} aria-pressed={saved}>
      {saved ? "★" : "☆"} Bookmark
    </button>
  );
}
