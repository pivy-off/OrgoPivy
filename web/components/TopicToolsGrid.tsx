import Link from "next/link";

const SPECTRA_SLUGS = new Set([
  "nmr-spectroscopy-review",
  "alcohols-phenols",
  "carboxylic-acids-derivatives",
  "aldehydes-ketones",
]);

export default function TopicToolsGrid({ slug, title }: { slug: string; title: string }) {
  const base = `/orgochem-2/${encodeURIComponent(slug)}`;
  const showSpectra = SPECTRA_SLUGS.has(slug);

  const cards = [
    {
      href: `${base}/notebook`,
      icon: "🧠",
      name: "AI Notebook",
      desc: "Chat with AI grounded in Dr. Garrett's materials.",
    },
    {
      href: `${base}/flashcards`,
      icon: "🃏",
      name: "Flashcards",
      desc: "Spaced repetition card deck with mastery tracking.",
    },
    {
      href: `${base}/mechanisms`,
      icon: "⚗️",
      name: "Mechanisms",
      desc: "Step-by-step arrow-pushing interactive viewer.",
    },
    {
      href: `${base}/practice`,
      icon: "✓",
      name: "Practice Questions",
      desc: "Exam-style MCQs — one section per question with explanations.",
    },
    {
      href: `${base}/practice-exam`,
      icon: "📝",
      name: "Timed Exam",
      desc: "Timed, scored mode using the same question bank.",
    },
    {
      href: `${base}/concept-map`,
      icon: "🗺️",
      name: "Concept Map",
      desc: "Visual knowledge graph of topic connections.",
    },
    ...(showSpectra
      ? [
          {
            href: `${base}/spectra-lab`,
            icon: "🔬",
            name: "Spectra Lab",
            desc: "Interactive peak identification for this unit.",
          },
        ]
      : []),
  ];

  return (
    <div
      style={{
        marginTop: 20,
        paddingTop: 20,
        borderTop: "1px solid var(--op-border, #e5e7eb)",
        fontFamily: "var(--op-font-sans, inherit)",
      }}
    >
      <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 14, color: "var(--op-text-primary, inherit)" }}>
        🚀 Deep Study Tools
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="op-tools-card op-card-hover"
            style={{
              display: "block",
              textDecoration: "none",
              color: "inherit",
              background: "var(--op-card-bg, #fff)",
              borderRadius: 16,
              padding: 20,
              boxShadow: "var(--op-shadow-sm, 0 1px 3px rgba(0,0,0,0.08))",
              border: "1px solid var(--op-border, #e5e7eb)",
              transition: "var(--op-transition, all 0.2s ease)",
            }}
          >
            <div style={{ fontSize: 48, lineHeight: 1, marginBottom: 10 }} aria-hidden>
              {c.icon}
            </div>
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>{c.name}</div>
            <div
              style={{
                color: "var(--op-text-secondary, #6b7280)",
                fontSize: 14,
                lineHeight: 1.35,
                minHeight: 40,
                marginBottom: 12,
              }}
            >
              {c.desc}
            </div>
            <span style={{ color: "var(--op-indigo, #4F6EF7)", fontWeight: 700, fontSize: 14 }}>Open →</span>
          </Link>
        ))}
      </div>
      <div className="subtle" style={{ marginTop: 10, fontSize: 12 }}>
        Deep tools for <strong>{title}</strong> — opens full-page study experiences.
      </div>
    </div>
  );
}
