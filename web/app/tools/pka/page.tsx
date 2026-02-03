"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

const PKA_GROUPS = [
  {
    name: "Strong acids",
    items: [
      { term: "H₂SO₄", value: "~-3", reason: "Very strong acid" },
      { term: "H₃O⁺", value: "-1.7", reason: "Hydronium" },
      { term: "HF", value: "3.2", reason: "Hydrofluoric acid" },
    ],
  },
  {
    name: "Carboxylic acids & phenols",
    items: [
      { term: "Carboxylic acid RCOOH", value: "~4-5", reason: "Resonance stabilizes conjugate base" },
      { term: "H₂CO₃", value: "6.4", reason: "Carbonic acid" },
      { term: "Phenol", value: "10", reason: "Resonance but less acidic than carboxylic" },
    ],
  },
  {
    name: "Alcohols & water",
    items: [
      { term: "H₂O", value: "15.7", reason: "Water" },
      { term: "ROH (alcohol)", value: "~15-18", reason: "Alcohols" },
      { term: "Terminal alkyne RC≡CH", value: "~25", reason: "sp C-H more acidic" },
    ],
  },
  {
    name: "Very weak acids",
    items: [
      { term: "NH₃", value: "38", reason: "Ammonia conjugate acid" },
      { term: "Alkane C-H", value: "~50", reason: "Very weak acid" },
      { term: "Alkene C-H", value: "~44", reason: "Vinylic H" },
    ],
  },
];

type Card = { term: string; value: string; reason: string; group: string };

export default function PKaTrainerPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [current, setCurrent] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [missed, setMissed] = useState<Card[]>([]);
  const [started, setStarted] = useState(false);
  const [groups, setGroups] = useState<Set<string>>(new Set(PKA_GROUPS.map((g) => g.name)));

  const allCards: Card[] = PKA_GROUPS.flatMap((g) =>
    g.items.map((i) => ({ ...i, group: g.name }))
  );

  const start = useCallback(() => {
    const filtered = allCards.filter((c) => groups.has(c.group));
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrent(0);
    setShowAnswer(false);
    setCorrect(0);
    setMissed([]);
    setStarted(true);
  }, [groups]);

  const toggleGroup = (name: string) => {
    setGroups((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const handleCorrect = () => {
    setCorrect((c) => c + 1);
    if (current < cards.length - 1) {
      setCurrent((c) => c + 1);
      setShowAnswer(false);
    } else setStarted(false);
  };

  const handleMiss = () => {
    setMissed((m) => [...m, cards[current]]);
    if (current < cards.length - 1) {
      setCurrent((c) => c + 1);
      setShowAnswer(false);
    } else setStarted(false);
  };

  return (
    <main className="stack" style={{ maxWidth: 640, margin: "0 auto", padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Link href="/tools" className="subtle" style={{ fontSize: 14, textDecoration: "none" }}>
          ← Back to Tools
        </Link>
        <h1 className="h1" style={{ marginTop: 12, marginBottom: 8 }}>pKa Memory Trainer</h1>
        <p className="subtle" style={{ fontSize: 15 }}>
          Drill must-know pKa values. Lower pKa = stronger acid. Equilibrium favors weaker acid (higher pKa).
        </p>
      </div>

      {!started ? (
        <>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Select groups to drill</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {PKA_GROUPS.map((g) => (
                <button
                  key={g.name}
                  type="button"
                  onClick={() => toggleGroup(g.name)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "var(--radius-sm)",
                    border: groups.has(g.name) ? "2px solid var(--blue)" : "1px solid var(--border)",
                    background: groups.has(g.name) ? "rgba(0,122,255,0.1)" : "var(--panel)",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>
          <button type="button" className="btn btnPrimary" onClick={start} style={{ width: "100%" }}>
            Start Drill ({allCards.filter((c) => groups.has(c.group)).length} cards)
          </button>
        </>
      ) : (
        <>
          <div style={{ marginBottom: 16, fontSize: 14, color: "var(--muted)" }}>
            Card {current + 1} of {cards.length} • {correct} correct
          </div>

          <div
            style={{
              padding: 32,
              background: "var(--panel-2)",
              border: "2px solid var(--border)",
              borderRadius: "var(--radius-md)",
              minHeight: 200,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>{cards[current]?.group}</div>
            <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>{cards[current]?.term}</div>
            {showAnswer ? (
              <>
                <div style={{ fontSize: 28, fontWeight: 800, color: "var(--blue)", marginBottom: 12 }}>
                  pKa = {cards[current]?.value}
                </div>
                <div style={{ fontSize: 14, color: "var(--muted)", marginBottom: 24 }}>
                  {cards[current]?.reason}
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <button type="button" className="btn" onClick={handleMiss} style={{ background: "var(--warn-bg)" }}>
                    Missed
                  </button>
                  <button type="button" className="btn btnPrimary" onClick={handleCorrect}>
                    Got it
                  </button>
                </div>
              </>
            ) : (
              <button type="button" className="btn btnPrimary" onClick={() => setShowAnswer(true)}>
                Show pKa
              </button>
            )}
          </div>

          {missed.length > 0 && (
            <div style={{ marginTop: 24, padding: 16, background: "var(--warn-bg)", borderRadius: "var(--radius-sm)", border: "1px solid var(--warn-border)" }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Review these (reason why)</div>
              {missed.map((m, i) => (
                <div key={i} style={{ fontSize: 14, marginBottom: 8 }}>
                  <strong>{m.term}</strong> → pKa {m.value}. {m.reason}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
