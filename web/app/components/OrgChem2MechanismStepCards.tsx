import { getMechanismStepCardsForSlug } from "../lib/orgochem2MechanismSteps";

export default function OrgChem2MechanismStepCards({ slug }: { slug: string }) {
  const steps = getMechanismStepCardsForSlug(slug);
  return (
    <div className="mechanismStepCards" style={{ display: "grid", gap: 12 }}>
      {steps.map((s) => (
        <div
          key={s.step}
          className="card"
          style={{
            boxShadow: "none",
            border: "1px solid var(--border)",
            borderLeft: "4px solid var(--blue)",
          }}
        >
          <div className="cardInner" style={{ padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "var(--muted)", marginBottom: 6 }}>
              Step {s.step}
            </div>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Electron flow</div>
            <div className="chem-mono-inline" style={{ fontSize: 14, lineHeight: 1.55, marginBottom: 10 }}>
              {s.electronFlow}
            </div>
            <div style={{ fontWeight: 800, marginBottom: 6 }}>Bonds formed / broken</div>
            <div style={{ fontSize: 14, lineHeight: 1.55, marginBottom: 10 }}>{s.bonds}</div>
            <div style={{ fontWeight: 800, marginBottom: 6 }}>Structure (line notation)</div>
            <pre
              style={{
                margin: 0,
                padding: 12,
                borderRadius: 10,
                background: "var(--panel-2)",
                border: "1px solid var(--border)",
                fontSize: 13,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Courier New', monospace",
                overflowX: "auto",
              }}
            >
              {s.structure}
            </pre>
          </div>
        </div>
      ))}
    </div>
  );
}
