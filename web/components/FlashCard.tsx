"use client";

export type FlashCardData = {
  id: string;
  kind: "CONCEPT" | "REACTION" | "REAGENT";
  front: string;
  back: string;
  mechanismType?: string;
  reagents?: string[];
};

export default function FlashCard({
  card,
  flipped,
  onFlip,
}: {
  card: FlashCardData;
  flipped: boolean;
  onFlip: () => void;
}) {
  return (
    <div
      style={{ perspective: 1000, width: "100%", maxWidth: 600, minHeight: 380, margin: "0 auto" }}
      onClick={() => onFlip()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onFlip();
        }
      }}
      aria-label={flipped ? "Show front" : "Show back"}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 380,
          transformStyle: "preserve-3d",
          transition: "transform 0.5s ease",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            borderRadius: 24,
            background: "#fff",
            boxShadow: "var(--op-shadow-lg, 0 8px 24px rgba(0,0,0,0.12))",
            padding: 28,
            display: "flex",
            flexDirection: "column",
            border: "1px solid var(--op-border, #e5e7eb)",
          }}
        >
          <span className={`op-badge op-badge-${card.kind === "REACTION" ? "green" : "orange"}`} style={{ alignSelf: "flex-start" }}>
            {card.kind}
          </span>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontSize: 20, fontWeight: 800, color: "var(--op-text-primary)", lineHeight: 1.35 }}>
            {card.front}
          </div>
          <div style={{ textAlign: "center", color: "var(--op-text-tertiary)", fontSize: 14 }}>Tap to reveal →</div>
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: 24,
            background: "#fff",
            boxShadow: "var(--op-shadow-lg)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            border: "1px solid var(--op-border)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ background: "var(--op-green)", color: "#fff", padding: "12px 20px", fontWeight: 800 }}>Answer</div>
          <div style={{ padding: 20, flex: 1, overflow: "auto" }}>
            <div style={{ fontSize: 16, lineHeight: 1.45, color: "var(--op-text-primary)", marginBottom: 12 }}>{card.back}</div>
            {card.mechanismType ? (
              <div className="op-badge op-badge-green" style={{ marginBottom: 8 }}>
                {card.mechanismType}
              </div>
            ) : null}
            {card.reagents && card.reagents.length > 0 ? (
              <div style={{ fontSize: 13, color: "var(--op-text-secondary)" }}>
                <strong>Reagents:</strong> {card.reagents.join(" · ")}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FlashCardRatingBar({
  onRate,
  disabled,
}: {
  onRate: (r: "hard" | "ok" | "easy") => void;
  disabled?: boolean;
}) {
  return (
    <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
      {(
        [
          { k: "hard" as const, label: "😕 Hard" },
          { k: "ok" as const, label: "😐 OK" },
          { k: "easy" as const, label: "😊 Easy" },
        ]
      ).map((b) => (
        <button
          key={b.k}
          type="button"
          className="op-btn-secondary"
          disabled={disabled}
          onClick={() => onRate(b.k)}
          style={{ transform: "scale(1)" }}
        >
          {b.label}
        </button>
      ))}
    </div>
  );
}
