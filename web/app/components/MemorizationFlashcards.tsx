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
};

export default function MemorizationFlashcards({ slug }: Props) {
  // Memoize items to prevent infinite loops
  const items = useMemo(() => getMemorizationItems(slug), [slug]);
  
  const [flashcards, setFlashcards] = useState<FlashcardItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studied, setStudied] = useState<Set<number>>(new Set());
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Flatten all memorization items into flashcards
    const allCards: FlashcardItem[] = [];
    items.forEach((category) => {
      category.items.forEach((item) => {
        allCards.push({
          ...item,
          category: category.category,
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
      setIsFlipped(false);
      setShowAnswer(false);
    } else {
      // Completed all cards
      setIsActive(false);
    }
  }, [currentIndex, flashcards.length]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      setShowAnswer(false);
    }
  }, [currentIndex]);

  const handleFlip = useCallback(() => {
    setIsFlipped(!isFlipped);
    setShowAnswer(!showAnswer);
    setStudied((prev) => new Set([...prev, currentIndex]));
  }, [isFlipped, currentIndex]);

  useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      if (!isActive) return;
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        if (showAnswer) {
          handleNext();
        } else {
          handleFlip();
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        handleFlip();
      }
    }

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isActive, showAnswer, handleNext, handlePrevious, handleFlip]);

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
            transform: isFlipped ? "rotateY(180deg)" : "none",
            marginBottom: 24,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--blue)";
            e.currentTarget.style.transform = isFlipped ? "rotateY(180deg) scale(1.02)" : "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.transform = isFlipped ? "rotateY(180deg)" : "none";
          }}
        >
          {!showAnswer ? (
            <>
              <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>
                {currentCard.category}
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, color: "var(--text)", marginBottom: 16 }}>
                {currentCard.term}
              </div>
              <div style={{ fontSize: 14, color: "var(--muted)" }}>
                Click or press F to flip
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>
                Answer
              </div>
              <div style={{ fontSize: 36, fontWeight: 700, color: "var(--blue)", marginBottom: 12 }}>
                {currentCard.value}
              </div>
              {currentCard.note && (
                <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 12, maxWidth: 500 }}>
                  {currentCard.note}
                </div>
              )}
              <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 16 }}>
                Press Space or → for next
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
            {showAnswer ? "Show Question" : "Show Answer"}
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
          Keyboard: Space/→ = Next, ← = Previous, F = Flip
        </div>
      </div>
    </div>
  );
}
