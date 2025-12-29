"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type ConditionState = {
  heat: boolean;
  acid: boolean;
  base: boolean;
  polarAprotic: boolean;
};

type MechanismStep = {
  title: string;
  explanation: string;
  svg: (conditions: ConditionState) => JSX.Element;
};

type Mechanism = {
  id: string;
  name: string;
  tags: string[];
  conditionsHint: string;
  steps: MechanismStep[];
};

function CanvasFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="card" style={{ height: "100%" }}>
      <div className="cardInner" style={{ height: "100%" }}>
        {children}
      </div>
    </div>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      className="btn"
      onClick={() => onChange(!value)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <span style={{ fontWeight: 950 }}>{label}</span>

      <span
        style={{
          width: 46,
          height: 26,
          borderRadius: 999,
          border: "1px solid var(--border)",
          background: value ? "color-mix(in srgb, var(--blue) 35%, var(--panel))" : "var(--panel)",
          position: "relative",
          transition: "all 120ms ease",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 3,
            left: value ? 23 : 3,
            width: 20,
            height: 20,
            borderRadius: 999,
            background: value ? "linear-gradient(135deg, var(--blue), var(--green))" : "var(--text)",
            transition: "all 120ms ease",
          }}
        />
      </span>
    </button>
  );
}

function StepControls({
  stepIndex,
  stepCount,
  onPrev,
  onNext,
}: {
  stepIndex: number;
  stepCount: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
      <button type="button" onClick={onPrev} disabled={stepIndex === 0} className="btn">
        Prev
      </button>

      <div className="subtle" style={{ fontWeight: 950 }}>
        Step {stepIndex + 1} of {stepCount}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={stepIndex === stepCount - 1}
        className="btn btnPrimary"
      >
        Next
      </button>
    </div>
  );
}

function SvgStage({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 14,
        border: "1px solid var(--border)",
        background: "color-mix(in srgb, var(--panel-2) 80%, var(--panel))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 12,
      }}
    >
      {children}
    </div>
  );
}

function ArrowLegend() {
  return (
    <div className="subtle" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      <span>Curved arrows show electron flow</span>
      <span>Bold label marks the key event</span>
    </div>
  );
}

function AldolStep1(conditions: ConditionState) {
  const label = conditions.base ? "Base removes alpha H" : "Weak base slow enolate";
  return (
    <svg width="560" height="300" viewBox="0 0 560 300" role="img" aria-label="Aldol step 1">
      <rect x="12" y="12" width="536" height="276" rx="16" fill="white" stroke="#e5e5e5" />
      <text x="30" y="50" fontSize="18" fontWeight="700" fill="#111">
        Step 1
      </text>
      <text x="30" y="78" fontSize="13" fill="#444">
        {label}
      </text>

      <text x="70" y="160" fontSize="18" fontWeight="700" fill="#111">
        R
      </text>
      <line x1="95" y1="155" x2="145" y2="155" stroke="#111" strokeWidth="2" />
      <text x="152" y="160" fontSize="18" fontWeight="700" fill="#111">
        C
      </text>
      <text x="178" y="160" fontSize="18" fontWeight="700" fill="#111">
        H
      </text>
      <line x1="200" y1="155" x2="250" y2="155" stroke="#111" strokeWidth="2" />
      <text x="258" y="160" fontSize="18" fontWeight="700" fill="#111">
        C
      </text>
      <line x1="280" y1="155" x2="330" y2="155" stroke="#111" strokeWidth="2" />
      <text x="338" y="160" fontSize="18" fontWeight="700" fill="#111">
        O
      </text>

      <path d="M 210 125 C 230 105, 250 105, 270 125" fill="none" stroke="#111" strokeWidth="2" />
      <polygon points="270,125 260,123 265,132" fill="#111" />

      <text x="370" y="150" fontSize="16" fontWeight="700" fill="#111">
        Key
      </text>
      <text x="370" y="175" fontSize="13" fill="#444">
        Enolate formation
      </text>
    </svg>
  );
}

function AldolStep2(conditions: ConditionState) {
  const label = conditions.heat ? "Addition then dehydration favored" : "Addition favored";
  return (
    <svg width="560" height="300" viewBox="0 0 560 300" role="img" aria-label="Aldol step 2">
      <rect x="12" y="12" width="536" height="276" rx="16" fill="white" stroke="#e5e5e5" />
      <text x="30" y="50" fontSize="18" fontWeight="700" fill="#111">
        Step 2
      </text>
      <text x="30" y="78" fontSize="13" fill="#444">
        {label}
      </text>

      <text x="70" y="150" fontSize="14" fontWeight="700" fill="#111">
        Enolate attacks carbonyl
      </text>

      <path d="M 140 190 C 190 140, 240 140, 290 190" fill="none" stroke="#111" strokeWidth="2" />
      <polygon points="290,190 280,186 284,198" fill="#111" />

      <text x="330" y="200" fontSize="16" fontWeight="700" fill="#111">
        Key
      </text>
      <text x="330" y="224" fontSize="13" fill="#444">
        New C C bond
      </text>
    </svg>
  );
}

function AldolStep3(conditions: ConditionState) {
  const label = conditions.heat ? "Dehydration to alpha beta unsaturated" : "Beta hydroxy product";
  return (
    <svg width="560" height="300" viewBox="0 0 560 300" role="img" aria-label="Aldol step 3">
      <rect x="12" y="12" width="536" height="276" rx="16" fill="white" stroke="#e5e5e5" />
      <text x="30" y="50" fontSize="18" fontWeight="700" fill="#111">
        Step 3
      </text>
      <text x="30" y="78" fontSize="13" fill="#444">
        {label}
      </text>

      <text x="70" y="160" fontSize="18" fontWeight="700" fill="#111">
        Product
      </text>
      <line x1="160" y1="155" x2="230" y2="155" stroke="#111" strokeWidth="2" />
      <line x1="160" y1="162" x2="230" y2="162" stroke="#111" strokeWidth="2" />

      <text x="330" y="200" fontSize="16" fontWeight="700" fill="#111">
        Key
      </text>
      <text x="330" y="224" fontSize="13" fill="#444">
        {conditions.heat ? "Elimination" : "Addition"}
      </text>
    </svg>
  );
}

function Sn2Step1(conditions: ConditionState) {
  const label = conditions.polarAprotic ? "Polar aprotic boosts nucleophile" : "Solvent affects rate";
  return (
    <svg width="560" height="300" viewBox="0 0 560 300" role="img" aria-label="SN2 step 1">
      <rect x="12" y="12" width="536" height="276" rx="16" fill="white" stroke="#e5e5e5" />
      <text x="30" y="50" fontSize="18" fontWeight="700" fill="#111">
        Step 1
      </text>
      <text x="30" y="78" fontSize="13" fill="#444">
        {label}
      </text>

      <text x="70" y="160" fontSize="16" fontWeight="700" fill="#111">
        Nu attacks backside
      </text>
      <line x1="250" y1="160" x2="320" y2="160" stroke="#111" strokeWidth="2" />
      <text x="335" y="165" fontSize="16" fontWeight="700" fill="#111">
        LG
      </text>

      <path d="M 140 190 C 190 150, 220 150, 250 160" fill="none" stroke="#111" strokeWidth="2" />
      <polygon points="250,160 241,156 243,168" fill="#111" />

      <text x="330" y="210" fontSize="16" fontWeight="700" fill="#111">
        Key
      </text>
      <text x="330" y="234" fontSize="13" fill="#444">
        One step inversion
      </text>
    </svg>
  );
}

function Sn2Step2() {
  return (
    <svg width="560" height="300" viewBox="0 0 560 300" role="img" aria-label="SN2 step 2">
      <rect x="12" y="12" width="536" height="276" rx="16" fill="white" stroke="#e5e5e5" />
      <text x="30" y="50" fontSize="18" fontWeight="700" fill="#111">
        Step 2
      </text>
      <text x="30" y="78" fontSize="13" fill="#444">
        Leaving group departs as bond forms
      </text>

      <text x="70" y="160" fontSize="16" fontWeight="700" fill="#111">
        Product with inversion
      </text>

      <text x="330" y="210" fontSize="16" fontWeight="700" fill="#111">
        Key
      </text>
      <text x="330" y="234" fontSize="13" fill="#444">
        Transition state control
      </text>
    </svg>
  );
}

function E2Step1(conditions: ConditionState) {
  const label = conditions.base ? "Strong base promotes E2" : "Weak base slows E2";
  return (
    <svg width="560" height="300" viewBox="0 0 560 300" role="img" aria-label="E2 step 1">
      <rect x="12" y="12" width="536" height="276" rx="16" fill="white" stroke="#e5e5e5" />
      <text x="30" y="50" fontSize="18" fontWeight="700" fill="#111">
        Step 1
      </text>
      <text x="30" y="78" fontSize="13" fill="#444">
        {label}
      </text>

      <text x="70" y="160" fontSize="16" fontWeight="700" fill="#111">
        Base removes beta H
      </text>

      <path d="M 160 190 C 210 150, 240 150, 290 170" fill="none" stroke="#111" strokeWidth="2" />
      <polygon points="290,170 281,166 283,178" fill="#111" />

      <text x="330" y="210" fontSize="16" fontWeight="700" fill="#111">
        Key
      </text>
      <text x="330" y="234" fontSize="13" fill="#444">
        Anti periplanar
      </text>
    </svg>
  );
}

function E2Step2(conditions: ConditionState) {
  const label = conditions.heat ? "Heat favors elimination" : "Elimination still possible";
  return (
    <svg width="560" height="300" viewBox="0 0 560 300" role="img" aria-label="E2 step 2">
      <rect x="12" y="12" width="536" height="276" rx="16" fill="white" stroke="#e5e5e5" />
      <text x="30" y="50" fontSize="18" fontWeight="700" fill="#111">
        Step 2
      </text>
      <text x="30" y="78" fontSize="13" fill="#444">
        {label}
      </text>

      <text x="70" y="160" fontSize="16" fontWeight="700" fill="#111">
        Pi bond forms as LG leaves
      </text>

      <line x1="200" y1="155" x2="270" y2="155" stroke="#111" strokeWidth="2" />
      <line x1="200" y1="162" x2="270" y2="162" stroke="#111" strokeWidth="2" />

      <text x="330" y="210" fontSize="16" fontWeight="700" fill="#111">
        Key
      </text>
      <text x="330" y="234" fontSize="13" fill="#444">
        Concerted step
      </text>
    </svg>
  );
}

export default function MechanismsPage() {
  const sp = useSearchParams();
  const topic = (sp.get("topic") || "").trim().toLowerCase();

  const mechanismsAll: Mechanism[] = useMemo(() => {
    return [
      {
        id: "aldol",
        name: "Aldol condensation",
        tags: ["carbonyl", "enolate", "cc bond", "aldehyde"],
        conditionsHint: "Base then heat often",
        steps: [
          {
            title: "Enolate formation",
            explanation:
              "Base removes an alpha proton to form an enolate. Stronger base increases enolate population and speed.",
            svg: (c) => AldolStep1(c),
          },
          {
            title: "Carbon carbon bond formation",
            explanation:
              "The enolate attacks a carbonyl carbon to form a new carbon carbon bond and an alkoxide intermediate.",
            svg: (c) => AldolStep2(c),
          },
          {
            title: "Dehydration choice",
            explanation:
              "With heat, dehydration gives an alpha beta unsaturated carbonyl. Without heat, the beta hydroxy product is favored.",
            svg: (c) => AldolStep3(c),
          },
        ],
      },
      {
        id: "sn2",
        name: "SN2 substitution",
        tags: ["substitution", "one step", "inversion"],
        conditionsHint: "Strong nucleophile polar aprotic",
        steps: [
          {
            title: "Backside attack",
            explanation:
              "Nucleophile attacks from the backside. Polar aprotic solvents boost nucleophilicity and rate.",
            svg: (c) => Sn2Step1(c),
          },
          {
            title: "Inversion",
            explanation:
              "Bond forms as leaving group leaves in the same step. Geometry inverts at the carbon center.",
            svg: () => Sn2Step2(),
          },
        ],
      },
      {
        id: "e2",
        name: "E2 elimination",
        tags: ["elimination", "alkene", "base"],
        conditionsHint: "Strong base and often heat",
        steps: [
          {
            title: "Base removes beta H",
            explanation:
              "A strong base removes a beta hydrogen while the leaving group is positioned anti periplanar.",
            svg: (c) => E2Step1(c),
          },
          {
            title: "Pi bond forms",
            explanation:
              "The alkene forms as the leaving group leaves. Heat often pushes elimination relative to substitution.",
            svg: (c) => E2Step2(c),
          },
        ],
      },
    ];
  }, []);

  const mechanisms = useMemo(() => {
    if (!topic) return mechanismsAll;
    const filtered = mechanismsAll.filter((m) => m.tags.some((t) => t.toLowerCase() === topic));
    return filtered.length ? filtered : mechanismsAll;
  }, [mechanismsAll, topic]);

  const [selectedId, setSelectedId] = useState<string>(mechanismsAll[0].id);
  const [stepIndex, setStepIndex] = useState<number>(0);

  const [conditions, setConditions] = useState<ConditionState>({
    heat: false,
    acid: false,
    base: true,
    polarAprotic: false,
  });

  useEffect(() => {
    if (!mechanisms.length) return;
    const exists = mechanisms.some((m) => m.id === selectedId);
    if (!exists) {
      setSelectedId(mechanisms[0].id);
      setStepIndex(0);
    }
  }, [mechanisms, selectedId]);

  const selected = mechanisms.find((m) => m.id === selectedId) || mechanisms[0];
  const step = selected.steps[stepIndex];

  function onSelectMechanism(id: string) {
    setSelectedId(id);
    setStepIndex(0);
  }

  return (
    <main style={{ padding: 18 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr 340px",
          gap: 14,
          minHeight: "calc(100vh - 96px)",
        }}
      >
        <CanvasFrame>
          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <div className="h1">Reaction set</div>
              {topic ? <div className="subtle">Filter topic {topic}</div> : <div className="subtle">Pick one to learn fast</div>}
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              {mechanisms.map((m) => {
                const active = m.id === selectedId;
                return (
                  <button
                    key={m.id}
                    type="button"
                    className={active ? "btn btnPrimary" : "btn"}
                    onClick={() => onSelectMechanism(m.id)}
                    style={{
                      textAlign: "left",
                      display: "grid",
                      gap: 4,
                      padding: 12,
                    }}
                  >
                    <div style={{ fontWeight: 950 }}>{m.name}</div>
                    <div className="subtle" style={{ color: active ? "rgba(255,255,255,0.88)" : "var(--muted)" }}>
                      {m.conditionsHint}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="divider" />

            <div>
              <div className="h1">Conditions</div>
              <div className="subtle">Tap to toggle</div>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              <Toggle
                label="Base"
                value={conditions.base}
                onChange={(v) => setConditions((c) => ({ ...c, base: v }))}
              />
              <Toggle
                label="Acid"
                value={conditions.acid}
                onChange={(v) => setConditions((c) => ({ ...c, acid: v }))}
              />
              <Toggle
                label="Heat"
                value={conditions.heat}
                onChange={(v) => setConditions((c) => ({ ...c, heat: v }))}
              />
              <Toggle
                label="Polar aprotic"
                value={conditions.polarAprotic}
                onChange={(v) => setConditions((c) => ({ ...c, polarAprotic: v }))}
              />
            </div>
          </div>
        </CanvasFrame>

        <CanvasFrame>
          <div style={{ height: "100%", display: "grid", gridTemplateRows: "auto 1fr auto", gap: 12 }}>
            <div className="row">
              <div>
                <div className="h1">{selected.name}</div>
                <div className="subtle">{selected.tags.join("  ")}</div>
              </div>

              <StepControls
                stepIndex={stepIndex}
                stepCount={selected.steps.length}
                onPrev={() => setStepIndex((s) => Math.max(0, s - 1))}
                onNext={() => setStepIndex((s) => Math.min(selected.steps.length - 1, s + 1))}
              />
            </div>

            <SvgStage>{step.svg(conditions)}</SvgStage>

            <ArrowLegend />
          </div>
        </CanvasFrame>

        <CanvasFrame>
          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <div className="h1">Step detail</div>
              <div className="subtle">Focus on the decision point</div>
            </div>

            <div className="card" style={{ boxShadow: "none" }}>
              <div className="cardInner" style={{ padding: 12 }}>
                <div style={{ fontSize: 16, fontWeight: 950 }}>{step.title}</div>
                <div style={{ marginTop: 6, color: "var(--muted)", lineHeight: 1.55, fontSize: 13 }}>
                  {step.explanation}
                </div>
              </div>
            </div>

            <div className="divider" />

            <div>
              <div className="h1">How to use</div>
              <div className="subtle">Short practice routine</div>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              <div className="card" style={{ boxShadow: "none" }}>
                <div className="cardInner" style={{ padding: 12, color: "var(--muted)", fontSize: 13 }}>
                  Toggle conditions and watch the labels change
                </div>
              </div>
              <div className="card" style={{ boxShadow: "none" }}>
                <div className="cardInner" style={{ padding: 12, color: "var(--muted)", fontSize: 13 }}>
                  Say the key event out loud for each step
                </div>
              </div>
              <div className="card" style={{ boxShadow: "none" }}>
                <div className="cardInner" style={{ padding: 12, color: "var(--muted)", fontSize: 13 }}>
                  Next upgrade will add quiz mode
                </div>
              </div>
            </div>
          </div>
        </CanvasFrame>
      </div>
    </main>
  );
}
