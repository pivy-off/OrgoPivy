import Link from "next/link";

const TOOLS = [
  {
    href: "/tools/pka",
    icon: "🧪",
    title: "pKa Memory Trainer",
    desc: "Flashcard drill for must-know pKa values. Grouped by functional class. Essential for acid-base and substitution.",
  },
  {
    href: "/tools/acid-base",
    icon: "⚖️",
    title: "Acid–Base Intelligence Engine",
    desc: "Input two acids or a reaction. See which side equilibrium favors, stronger vs weaker acid, conjugate pairs, pKa logic.",
  },
  {
    href: "/tools/sn1-sn2",
    icon: "🔄",
    title: "SN1 / SN2 / E1 / E2 Decision Engine",
    desc: "Substrate, nucleophile, solvent, temperature → predicted pathway, stereochemistry, major product.",
  },
  {
    href: "/spectra",
    icon: "📊",
    title: "NMR Studio",
    desc: "Chemical shift identifier, spectrum breakdown. Integration, multiplicity (n+1), shielding vs deshielding.",
  },
];

export default function ToolsPage() {
  return (
    <main className="stack" style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <div>
        <h1 className="h1" style={{ marginBottom: 8 }}>Study Tools</h1>
        <p className="subtle" style={{ fontSize: 16 }}>
          Tools designed to help you make A&apos;s. Drill pKa, predict acid-base outcomes, decide reaction pathways.
        </p>
      </div>

      <div style={{ display: "grid", gap: 20, marginTop: 32 }}>
        {TOOLS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            style={{
              display: "block",
              padding: 24,
              background: "var(--panel)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            className="card"
          >
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
              <span style={{ fontSize: 36 }}>{t.icon}</span>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{t.title}</div>
                <div className="subtle" style={{ fontSize: 15, lineHeight: 1.5 }}>{t.desc}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
