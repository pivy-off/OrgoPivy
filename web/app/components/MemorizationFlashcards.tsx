"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { getMemorizationItems } from "../lib/memorization";
import type { MemorizationItem } from "../lib/memorization";

type Props = {
  slug: string;
};

type FlashcardItem = {
  term: string;
  value: string;
  note?: string;
  category: string;
  imageUrl?: string;
  imageAlt?: string;
};

export default function MemorizationFlashcards({ slug }: Props) {
  // Memoize items to prevent infinite loops
  const items = useMemo(() => getMemorizationItems(slug), [slug]);
  
  const [flashcards, setFlashcards] = useState<FlashcardItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardState, setCardState] = useState<"question" | "hint" | "answer">("question");
  const [studied, setStudied] = useState<Set<number>>(new Set());
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Flatten all memorization items into flashcards
    const allCards: FlashcardItem[] = [];
    items.forEach((category) => {
      category.items.forEach((item) => {
        const entry = item as { term: string; value: string; note?: string; imageUrl?: string; imageAlt?: string };
        allCards.push({
          term: entry.term,
          value: entry.value,
          note: entry.note,
          category: category.category,
          imageUrl: entry.imageUrl,
          imageAlt: entry.imageAlt,
        });
      });
    });
    // Shuffle cards only if we have cards and flashcards is empty or different
    if (allCards.length > 0) {
      const shuffled = [...allCards].sort(() => Math.random() - 0.5);
      setFlashcards(shuffled);
    }
  }, [slug]); // Use slug instead of items to prevent re-renders

  const currentCard = flashcards[currentIndex];
  const progress = flashcards.length > 0 ? ((studied.size / flashcards.length) * 100).toFixed(0) : 0;

  const handleNext = useCallback(() => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCardState("question");
    } else {
      // Completed all cards
      setIsActive(false);
    }
  }, [currentIndex, flashcards.length]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCardState("question");
    }
  }, [currentIndex]);

  const handleFlip = useCallback(() => {
    // Cycle through: question -> hint -> answer -> question
    if (cardState === "question") {
      setCardState("hint");
    } else if (cardState === "hint") {
      setCardState("answer");
      setStudied((prev) => new Set([...prev, currentIndex]));
    } else {
      setCardState("question");
    }
  }, [cardState, currentIndex]);

  useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      if (!isActive) return;
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        if (cardState === "answer") {
          handleNext();
        } else {
          handleFlip();
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (cardState === "question") {
          handlePrevious();
        } else {
          setCardState("question");
        }
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        handleFlip();
      }
    }

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isActive, cardState, handleNext, handlePrevious, handleFlip]);

  if (flashcards.length === 0) {
    return null;
  }

  if (!isActive) {
    return (
      <div className="topicSection">
        <div className="cardInner" style={{ padding: 20 }}>
          <div className="topicSectionHeader">
            <div className="topicSectionTitle">Flashcard Mode</div>
            <div className="subtle" style={{ fontSize: 13 }}>
              {flashcards.length} cards ready
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <button
              type="button"
              className="btn btnPrimary"
              onClick={() => setIsActive(true)}
              style={{ width: "100%" }}
            >
              Start Flashcards
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="topicSection">
      <div className="cardInner" style={{ padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div className="topicSectionTitle">Flashcard Mode</div>
            <div className="subtle" style={{ fontSize: 13 }}>
              Card {currentIndex + 1} of {flashcards.length} • {progress}% studied
            </div>
          </div>
          <button
            type="button"
            className="btn"
            onClick={() => setIsActive(false)}
          >
            Exit
          </button>
        </div>

        {/* Progress bar */}
        <div style={{ 
          width: "100%", 
          height: 6, 
          background: "var(--border)", 
          borderRadius: 3, 
          marginBottom: 24,
          overflow: "hidden"
        }}>
          <div style={{
            width: `${progress}%`,
            height: "100%",
            background: "linear-gradient(90deg, var(--blue), var(--purple))",
            transition: "width 0.3s ease"
          }} />
        </div>

        {/* Flashcard */}
        <div
          onClick={handleFlip}
          style={{
            minHeight: 300,
            background: "var(--panel-2)",
            border: "2px solid var(--border)",
            borderRadius: "var(--radius-md)",
            padding: 32,
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            transition: "all 0.3s ease",
            position: "relative",
            marginBottom: 24,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--blue)";
            e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {cardState === "question" && (
            <>
              <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>
                {currentCard.category}
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", marginBottom: 16, lineHeight: 1.4 }}>
                {currentCard.value}
              </div>
              {currentCard.note && (
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 8, fontStyle: "italic" }}>
                  💡 {currentCard.note}
                </div>
              )}
              <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 20 }}>
                Click or press F to see answer
              </div>
            </>
          )}
          
          {cardState === "hint" && (
            <>
              <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>
                Hint
              </div>
              <div style={{ fontSize: 20, fontWeight: 600, color: "var(--orange)", marginBottom: 16, lineHeight: 1.4 }}>
                {currentCard.term}
              </div>
              <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 20 }}>
                Click or press F to see full answer
              </div>
            </>
          )}
          
          {cardState === "answer" && (
            <>
              <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>
                Answer
              </div>
              {currentCard.imageUrl && (
                <img
                  src={currentCard.imageUrl}
                  alt={currentCard.imageAlt ?? currentCard.term}
                  width={120}
                  height={120}
                  referrerPolicy="no-referrer"
                  style={{ objectFit: "contain", marginBottom: 16, borderRadius: "var(--radius-sm)", background: "var(--panel)" }}
                />
              )}
              <div style={{ fontSize: 20, fontWeight: 600, color: "var(--blue)", marginBottom: 12, lineHeight: 1.5 }}>
                {currentCard.term}
              </div>
              <div style={{ fontSize: 16, color: "var(--text)", marginBottom: 12, lineHeight: 1.6 }}>
                {currentCard.value}
              </div>
              {currentCard.note && (
                <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 12, padding: 12, background: "var(--panel)", borderRadius: 8, border: "1px solid var(--border)" }}>
                  📚 {currentCard.note}
                </div>
              )}
              <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 16 }}>
                Press Space or → for next card
              </div>
            </>
          )}
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            type="button"
            className="btn"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            style={{ opacity: currentIndex === 0 ? 0.5 : 1 }}
          >
            ← Previous
          </button>
          <button
            type="button"
            className="btn btnPrimary"
            onClick={handleFlip}
          >
            {cardState === "question" ? "Show Hint" : cardState === "hint" ? "Show Answer" : "Show Question"}
          </button>
          <button
            type="button"
            className="btn"
            onClick={handleNext}
            disabled={currentIndex === flashcards.length - 1}
            style={{ opacity: currentIndex === flashcards.length - 1 ? 0.5 : 1 }}
          >
            Next →
          </button>
        </div>

        <div style={{ marginTop: 16, textAlign: "center", fontSize: 12, color: "var(--muted)" }}>
          Keyboard: Space/→ = Flip/Next, ← = Previous/Back, F = Flip
        </div>
      </div>
    </div>
  );
}
