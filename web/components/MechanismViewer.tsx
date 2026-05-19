"use client";

import { useEffect, useMemo, useState } from "react";
import { addMechanismViewed } from "@/lib/storage";

export type MechanismStep = {
  title: string;
  narration: string;
  bondFormed: string;
  bondBroken: string;
  electronFlow: string;
  svg: string;
  commonError: string;
};

export type MechanismDef = {
  id: string;
  title: string;
  subtitle: string;
  steps: MechanismStep[];
};

export default function MechanismViewer({
  slug,
  mechanisms,
}: {
  slug: string;
  mechanisms: MechanismDef[];
}) {
  const [mid, setMid] = useState(mechanisms[0]?.id ?? "");
  const [stepIdx, setStepIdx] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [guess, setGuess] = useState("");
  const [revealed, setRevealed] = useState(false);

  const m = useMemo(() => mechanisms.find((x) => x.id === mid) ?? mechanisms[0], [mechanisms, mid]);
  const step = m?.steps[stepIdx];

  useEffect(() => {
    setStepIdx(0);
    setTestMode(false);
    setGuess("");
    setRevealed(false);
  }, [mid]);

  useEffect(() => {
    if (m?.id) addMechanismViewed(slug, m.id);
  }, [slug, m?.id]);

  if (!m || !step) {
    return (
      <div className="op-fade-in" style={{ padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 48 }}>⚗️</div>
        <p>No mechanism data for this topic yet.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 0,
        minHeight: 480,
        fontFamily: "var(--op-font-sans)",
      }}
    >
      <aside
        className="op-mech-sidebar"
        style={{
          width: 200,
          flexShrink: 0,
          borderRight: "1px solid var(--op-border)",
          padding: 12,
          background: "var(--op-gray-bg)",
        }}
      >
        <div style={{ fontWeight: 800, marginBottom: 8, fontSize: 13 }}>Mechanisms</div>
        {mechanisms.map((mech) => (
          <button
            key={mech.id}
            type="button"
            onClick={() => setMid(mech.id)}
            className="op-chip"
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              marginBottom: 8,
              background: mech.id === m.id ? "var(--op-indigo)" : "var(--op-indigo-light)",
              color: mech.id === m.id ? "#fff" : "var(--op-indigo)",
            }}
          >
            {mech.title}
          </button>
        ))}
      </aside>

      <div style={{ flex: 1, padding: "16px 20px", overflow: "auto" }}>
        <h1 style={{ fontSize: 22, margin: "0 0 4px" }}>{m.title}</h1>
        <p style={{ color: "var(--op-text-secondary)", marginTop: 0 }}>{m.subtitle}</p>

        <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, fontSize: 14 }}>
          <input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} />
          Show all steps at once
        </label>

        {showAll ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {m.steps.map((s, i) => (
              <StepCard key={i} step={s} stepNo={i + 1} total={m.steps.length} testMode={false} revealed />
            ))}
          </div>
        ) : (
          <StepCard
            step={step}
            stepNo={stepIdx + 1}
            total={m.steps.length}
            testMode={testMode}
            revealed={revealed}
          />
        )}

        {!showAll ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 16,
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <button
              type="button"
              className="op-btn-secondary"
              disabled={stepIdx === 0}
              onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
            >
              ← Previous
            </button>
            <div style={{ display: "flex", gap: 6 }}>
              {m.steps.map((_, i) => (
                <span
                  key={i}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: i === stepIdx ? "var(--op-indigo)" : i < stepIdx ? "var(--op-green)" : "#ddd",
                  }}
                />
              ))}
            </div>
            <button
              type="button"
              className="op-btn-secondary"
              disabled={stepIdx >= m.steps.length - 1}
              onClick={() => setStepIdx((i) => Math.min(m.steps.length - 1, i + 1))}
            >
              Next →
            </button>
          </div>
        ) : null}

        {!showAll ? (
          <div style={{ marginTop: 20 }}>
            <button
              type="button"
              className="op-btn-primary"
              onClick={() => {
                setTestMode((t) => !t);
                setRevealed(false);
                setGuess("");
              }}
            >
              ⚡ Test yourself
            </button>
            {testMode ? (
              <div className="op-fade-in" style={{ marginTop: 12 }}>
                {!revealed ? (
                  <>
                    <p style={{ fontSize: 14 }}>Describe what happens in this step:</p>
                    <textarea
                      value={guess}
                      onChange={(e) => setGuess(e.target.value)}
                      rows={3}
                      style={{ width: "100%", borderRadius: 8, padding: 10, border: "1px solid var(--op-border)" }}
                    />
                    <button
                      type="button"
                      className="op-btn-secondary"
                      style={{ marginTop: 8 }}
                      onClick={() => setRevealed(true)}
                    >
                      Reveal answer
                    </button>
                  </>
                ) : (
                  <div style={{ background: "var(--op-indigo-light)", padding: 14, borderRadius: 12, marginTop: 8 }}>
                    <strong>Answer:</strong> {step.narration}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        ) : null}

        {!showAll && !testMode ? (
          <div
            style={{
              marginTop: 16,
              padding: 14,
              borderRadius: 12,
              background: "var(--op-orange-light)",
              border: "1px solid var(--op-orange)",
              fontSize: 14,
            }}
          >
            <strong>🎯 Common error at this step:</strong> {step.commonError}
          </div>
        ) : null}
      </div>

      <style jsx global>{`
        @media (max-width: 700px) {
          .op-mech-sidebar {
            width: 100% !important;
            border-right: none !important;
            border-bottom: 1px solid var(--op-border);
            display: flex;
            flex-direction: row;
            overflow-x: auto;
            gap: 8px;
            flex-wrap: nowrap;
          }
        }
      `}</style>
    </div>
  );
}

function StepCard({
  step,
  stepNo,
  total,
  testMode,
  revealed,
}: {
  step: MechanismStep;
  stepNo: number;
  total: number;
  testMode: boolean;
  revealed: boolean;
}) {
  const hideDesc = testMode && !revealed;
  return (
    <div className="op-card op-fade-in" style={{ maxWidth: 720 }}>
      <div style={{ fontWeight: 800, marginBottom: 8 }}>
        Step {stepNo} of {total}
      </div>
      <hr style={{ border: 0, borderTop: "1px solid var(--op-border)", margin: "12px 0" }} />
      <div style={{ margin: "12px 0", display: "flex", justifyContent: "center" }} dangerouslySetInnerHTML={{ __html: step.svg }} />
      {!hideDesc ? <p style={{ fontSize: 15, lineHeight: 1.5 }}>{step.narration}</p> : <p className="op-skeleton" style={{ height: 60 }} />}
      {!hideDesc ? (
        <ul style={{ fontSize: 14, color: "var(--op-text-secondary)", paddingLeft: 18 }}>
          <li>
            <strong>Bond formed:</strong> {step.bondFormed}
          </li>
          <li>
            <strong>Bond broken:</strong> {step.bondBroken}
          </li>
          <li>
            <strong>Electron flow:</strong> {step.electronFlow}
          </li>
        </ul>
      ) : null}
    </div>
  );
}

export function buildMechanismsFromTopic(topic: {
  title: string;
  slug: string;
  mustKnow: string[];
  mustKnowItems?: { title: string; description: string }[];
  hasMechanism: boolean;
}): MechanismDef[] {
  const rows = topic.mustKnowItems?.length
    ? topic.mustKnowItems.map((m) => ({ title: m.title, desc: m.description }))
    : topic.mustKnow.map((s) => ({ title: s.slice(0, 80), desc: s }));

  const pick = rows.slice(0, Math.max(3, Math.min(rows.length, 5)));
  while (pick.length < 3) {
    pick.push({
      title: `${topic.title} — core idea`,
      desc: "Review lecture notes and textbook examples for accurate curved-arrow accounting.",
    });
  }

  return pick.slice(0, 3).map((row, mi) => ({
    id: `m-${mi}`,
    title: row.title,
    subtitle: topic.title,
    steps: defaultStepsFor(row.title, row.desc, topic.hasMechanism),
  }));
}

function defaultStepsFor(title: string, desc: string, rich: boolean): MechanismStep[] {
  const baseSvg = (label: string) => `
<svg viewBox="0 0 320 140" width="100%" height="140" xmlns="http://www.w3.org/2000/svg" aria-label="${label}">
  <rect x="8" y="8" width="304" height="124" rx="12" fill="#f8fafc" stroke="#cbd5e1"/>
  <path d="M40 90 L120 50 L200 90 L280 50" stroke="#4F6EF7" stroke-width="3" fill="none" stroke-linecap="round"/>
  <circle cx="120" cy="50" r="6" fill="#22c55e"/>
  <text x="24" y="28" font-size="12" fill="#64748b" font-family="sans-serif">${escapeXml(title.slice(0, 28))}</text>
</svg>`;
  if (rich) {
    return [
      {
        title: "Approach",
        narration: `The reactive site is set up by electronics and sterics described for: ${title}. ${desc.slice(0, 200)}`,
        bondFormed: "C–Nu (example)",
        bondBroken: "C–LG (leaving group departs)",
        electronFlow: "Nu lone pair → electrophilic carbon",
        svg: baseSvg("Step 1"),
        commonError: "Forgetting to track formal charge after each arrow.",
      },
      {
        title: "Intermediate",
        narration:
          "A high-energy intermediate forms briefly; stabilize it mentally with resonance if applicable.",
        bondFormed: "Partial bond order in TS",
        bondBroken: "π bond (if addition)",
        electronFlow: "π electrons toward electrophile",
        svg: baseSvg("Step 2"),
        commonError: "Drawing arrows from H⁺ instead of the actual π bond.",
      },
      {
        title: "Product formation",
        narration:
          desc.slice(0, 280) ||
          "Collapse to the stable product with correct stereochemistry when chiral centers are created.",
        bondFormed: "σ bond to product",
        bondBroken: "Leaving group bond",
        electronFlow: "Lone pairs reorganize to lower energy framework",
        svg: baseSvg("Step 3"),
        commonError: "Ignoring stereochemical outcome at newly formed stereocenters.",
      },
      {
        title: "Check",
        narration: "Verify atom balance, charges, and that the conditions match the mechanism class you named.",
        bondFormed: "—",
        bondBroken: "—",
        electronFlow: "—",
        svg: baseSvg("Step 4"),
        commonError: "Using a reagent that would over-oxidize or over-reduce relative to the prompt.",
      },
    ];
  }
  return [
    {
      title: "Overview",
      narration: `${title}: ${desc}`,
      bondFormed: "—",
      bondBroken: "—",
      electronFlow: "Review curved-arrow conventions",
      svg: baseSvg("Overview"),
      commonError: "Mixing up acidic vs basic conditions for the transformation.",
    },
    {
      title: "Detail",
      narration:
        "Connect this concept to prior topics (resonance, inductive effects, sterics) before memorizing reagent lists.",
      bondFormed: "Conceptual link",
      bondBroken: "—",
      electronFlow: "Electron density follows electronegativity and resonance",
      svg: baseSvg("Detail"),
      commonError: "Skipping the mechanism class name on exams.",
    },
    {
      title: "Drill",
      narration: "Practice naming the mechanism type and predicting the major product under typical exam conditions.",
      bondFormed: "—",
      bondBroken: "—",
      electronFlow: "—",
      svg: baseSvg("Drill"),
      commonError: "Stopping at the first plausible arrow instead of completing the sequence.",
    },
  ];
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}
