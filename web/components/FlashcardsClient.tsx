"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Topic } from "@/app/lib/curriculum";
import FlashCard, { FlashCardData, FlashCardRatingBar } from "@/components/FlashCard";
import { getFlashcardMastery, setFlashcardMastery } from "@/lib/storage";
import { showToast } from "@/components/Toast";

function buildCards(topic: Topic): FlashCardData[] {
  const out: FlashCardData[] = [];
  if (topic.mustKnowItems?.length) {
    topic.mustKnowItems.forEach((m, i) => {
      out.push({
        id: `c-${i}`,
        kind: "CONCEPT",
        front: `What is ${m.title}?`,
        back: m.description,
        mechanismType: topic.hasMechanism ? "See mechanism viewer" : undefined,
      });
      out.push({
        id: `r-${i}`,
        kind: "REAGENT",
        front: `What reagent or condition is central for: ${m.title}?`,
        back: m.description,
        reagents: [m.title],
      });
    });
  } else {
    topic.mustKnow.forEach((s, i) => {
      out.push({
        id: `c-${i}`,
        kind: "CONCEPT",
        front: `What is this idea?\n${s.slice(0, 120)}${s.length > 120 ? "…" : ""}`,
        back: s,
      });
      out.push({
        id: `r-${i}`,
        kind: "REACTION",
        front: `How do you apply / recognize this in a mechanism context?`,
        back: s,
        mechanismType: topic.hasMechanism ? "Mechanism-heavy unit" : "Conceptual",
      });
    });
  }
  topic.howToStudy.slice(0, 2).forEach((step, i) => {
    out.push({
      id: `s-${i}`,
        kind: "CONCEPT",
        front: `Study step: what should you do here?`,
        back: step,
    });
  });
  return out.length ? out : [{ id: "x", kind: "CONCEPT", front: "No flashcards yet", back: "Add must-know items in curriculum.", mechanismType: undefined }];
}

export default function FlashcardsClient({ slug, topic }: { slug: string; topic: Topic }) {
  const base = useMemo(() => buildCards(topic), [topic]);
  const [queue, setQueue] = useState<string[]>(() => base.map((c) => c.id));
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [stats, setStats] = useState({ hard: 0, ok: 0, easy: 0 });
  const [sideOpen, setSideOpen] = useState(true);
  const [slideDir, setSlideDir] = useState<"left" | "right" | null>(null);

  useEffect(() => {
    setIdx((i) => Math.min(i, Math.max(0, queue.length - 1)));
  }, [queue.length]);

  const byId = useMemo(() => Object.fromEntries(base.map((c) => [c.id, c])), [base]);
  const currentId = queue[idx] ?? queue[0];
  const card = byId[currentId];

  const pct = queue.length ? Math.round(((base.length - queue.length + (flipped ? 0.5 : 0)) / base.length) * 100) : 100;

  const shuffle = () => {
    const q = [...base.map((c) => c.id)].sort(() => Math.random() - 0.5);
    setQueue(q);
    setIdx(0);
    setFlipped(false);
  };

  const resetProgress = () => {
    setFlashcardMastery(slug, { easy: [], hard: [], ok: [] });
    setQueue(base.map((c) => c.id));
    setIdx(0);
    setFlipped(false);
    setStats({ hard: 0, ok: 0, easy: 0 });
  };

  const rate = (r: "hard" | "ok" | "easy") => {
    if (!card) return;
    const m = getFlashcardMastery(slug);
    if (r === "easy") {
      setFlashcardMastery(slug, { ...m, easy: [...new Set([...m.easy, card.id])] });
      setStats((s) => ({ ...s, easy: s.easy + 1 }));
      showToast("✅ Concept marked as known!");
      setSlideDir("right");
    } else if (r === "hard") {
      setFlashcardMastery(slug, { ...m, hard: [...new Set([...m.hard, card.id])] });
      setStats((s) => ({ ...s, hard: s.hard + 1 }));
      setSlideDir("left");
    } else {
      setFlashcardMastery(slug, { ...m, ok: [...new Set([...m.ok, card.id])] });
      setStats((s) => ({ ...s, ok: s.ok + 1 }));
      setSlideDir("right");
    }

    setQueue((q) => {
      const id = q[idx];
      const rest = q.filter((_, i) => i !== idx);
      if (r === "easy") return rest.length ? rest : base.map((c) => c.id);
      if (r === "ok") return [...rest, id];
      const insertAt = Math.min(idx + 3, rest.length);
      const next = [...rest.slice(0, insertAt), id, ...rest.slice(insertAt)];
      return next.length ? next : base.map((c) => c.id);
    });
    setFlipped(false);
    setIdx((i) => 0);
    window.setTimeout(() => setSlideDir(null), 320);
  };

  const nextSwipe = useCallback(
    (dir: -1 | 1) => {
      setIdx((i) => {
        const ni = (i + dir + queue.length) % queue.length;
        return ni;
      });
      setFlipped(false);
      setSlideDir(dir < 0 ? "right" : "left");
      window.setTimeout(() => setSlideDir(null), 320);
    },
    [queue.length],
  );

  if (!card || card.front === "No flashcards yet") {
    return (
      <div style={{ textAlign: "center", padding: 48 }}>
        <div style={{ fontSize: 56 }}>🃏</div>
        <h2>No flashcards yet</h2>
        <p style={{ color: "var(--op-text-secondary)" }}>Cards are generated from the topic&apos;s must-know concepts.</p>
        <Link href={`/orgochem-2/${encodeURIComponent(slug)}`} className="op-btn-primary" style={{ textDecoration: "none", display: "inline-block", marginTop: 12 }}>
          Back to topic
        </Link>
      </div>
    );
  }

  const mastery = Math.max(0, Math.min(100, stats.easy * 14 + stats.ok * 4 - stats.hard * 3));

  return (
    <div style={{ fontFamily: "var(--op-font-sans)", padding: "12px 16px 96px", minHeight: "80vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        <strong>{topic.title}</strong>
        <span>
          Card {idx + 1} of {queue.length}
        </span>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Link href={`/orgochem-2/${encodeURIComponent(slug)}`} className="op-btn-secondary" style={{ textDecoration: "none" }}>
            ← Back
          </Link>
          <button type="button" className="op-btn-secondary" onClick={shuffle}>
            Shuffle
          </button>
          <button type="button" className="op-btn-secondary" onClick={resetProgress}>
            Reset Progress
          </button>
          <button type="button" className="op-btn-secondary" onClick={() => setSideOpen((s) => !s)}>
            {sideOpen ? "Hide" : "Show"} stats
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              transform: slideDir === "left" ? "translateX(-24px)" : slideDir === "right" ? "translateX(24px)" : "translateX(0)",
              opacity: slideDir ? 0.85 : 1,
              transition: "transform 0.28s ease, opacity 0.28s ease",
            }}
            onTouchStart={(e) => {
              const x0 = e.touches[0].clientX;
              const onEnd = (ev: TouchEvent) => {
                const x1 = ev.changedTouches[0].clientX;
                window.removeEventListener("touchend", onEnd as never);
                if (x1 - x0 > 60) nextSwipe(-1);
                if (x0 - x1 > 60) nextSwipe(1);
              };
              window.addEventListener("touchend", onEnd as never);
            }}
          >
            <FlashCard card={card} flipped={flipped} onFlip={() => setFlipped((f) => !f)} />
          </div>
          {flipped ? <FlashCardRatingBar onRate={rate} disabled={!queue.length} /> : null}
          <div className="op-skeleton" style={{ height: 8, borderRadius: 4, marginTop: 20, width: `${pct}%`, maxWidth: "100%" }} />
        </div>
        {sideOpen ? (
          <aside className="op-flash-side" style={{ width: 200, flexShrink: 0, background: "var(--op-gray-bg)", padding: 12, borderRadius: 12 }}>
            <strong>📊 Session Stats</strong>
            <div style={{ marginTop: 10, fontSize: 14 }}>
              Hard: {stats.hard} | OK: {stats.ok} | Easy: {stats.easy}
            </div>
            <div style={{ marginTop: 12, fontWeight: 800 }}>Est. mastery: {mastery}%</div>
          </aside>
        ) : null}
      </div>

      <div
        className="op-flash-fixed"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: 12,
          background: "rgba(255,255,255,0.96)",
          borderTop: "1px solid var(--op-border)",
          display: "none",
        }}
      >
        {flipped ? <FlashCardRatingBar onRate={rate} /> : null}
      </div>
      <style jsx global>{`
        @media (max-width: 700px) {
          .op-flash-side {
            display: none !important;
          }
          .op-flash-fixed {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
