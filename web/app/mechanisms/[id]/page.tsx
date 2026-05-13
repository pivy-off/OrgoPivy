"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getAllMechanisms, type ConditionState } from "../mechanisms-data";

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
        ← Prev
      </button>
      <div className="subtle" style={{ fontWeight: 950, fontSize: 15 }}>
        Step {stepIndex + 1} of {stepCount}
      </div>
      <button
        type="button"
        onClick={onNext}
        disabled={stepIndex === stepCount - 1}
        className="btn btnPrimary"
      >
        Next →
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
        borderRadius: 16,
        border: "1px solid var(--border)",
        background: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 30,
        overflow: "auto",
        position: "relative",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
      }}
    >
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -12;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .mechanism-svg {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
      <div className="mechanism-svg" style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", gap: 16, alignItems: "stretch" }}>
        {children}
      </div>
    </div>
  );
}

export default function MechanismPage() {
  const params = useParams();
  const router = useRouter();
  const mechanismId = (params?.id as string) || "";

  const mechanisms = useMemo(() => getAllMechanisms(), []);
  const mechanism = useMemo(
    () => mechanisms.find((m) => m.id === mechanismId),
    [mechanisms, mechanismId]
  );

  const [stepIndex, setStepIndex] = useState<number>(0);
  const [conditions, setConditions] = useState<ConditionState>({
    heat: false,
    acid: false,
    base: true,
    polarAprotic: false,
  });

  if (!mechanism) {
    return (
      <main style={{ padding: "40px 20px", maxWidth: 1400, margin: "0 auto" }}>
        <div className="card">
          <div className="cardInner">
            <div>
              <div className="h1" style={{ fontSize: 32 }}>Mechanism not found</div>
              <div className="subtle" style={{ fontSize: 16 }}>The mechanism you're looking for doesn't exist.</div>
            </div>
            <div style={{ marginTop: 20 }}>
              <Link className="btn btnPrimary" href="/mechanisms">
                ← Back to Mechanisms
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const step = mechanism.steps[stepIndex];

  return (
    <main style={{ padding: 0, height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--background)" }}>
      {/* Header */}
      <div style={{ padding: "20px 30px", borderBottom: "1px solid var(--border)", background: "white" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1600, margin: "0 auto" }}>
          <div>
            <Link
              href="/mechanisms"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 14,
                color: "var(--blue)",
                textDecoration: "none",
                marginBottom: 8,
              }}
            >
              ← Back to Mechanisms
            </Link>
            <div className="h1" style={{ fontSize: 32, marginBottom: 4 }}>{mechanism.name}</div>
            <div className="subtle" style={{ fontSize: 15 }}>{mechanism.category}</div>
          </div>

          <StepControls
            stepIndex={stepIndex}
            stepCount={mechanism.steps.length}
            onPrev={() => setStepIndex((s) => Math.max(0, s - 1))}
            onNext={() => setStepIndex((s) => Math.min(mechanism.steps.length - 1, s + 1))}
          />
        </div>
      </div>

      {/* Step Navigation */}
      <div style={{ padding: "16px 30px", background: "var(--panel)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", gap: 8, maxWidth: 1600, margin: "0 auto", overflowX: "auto" }}>
          {mechanism.steps.map((s, idx) => (
            <button
              key={idx}
              type="button"
              className={idx === stepIndex ? "btn btnPrimary" : "btn"}
              onClick={() => setStepIndex(idx)}
              style={{
                padding: "10px 20px",
                fontSize: 14,
                whiteSpace: "nowrap",
                minWidth: "fit-content",
              }}
            >
              Step {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Mechanism Visualization */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", overflow: "auto" }}>
        <div style={{ width: "100%", maxWidth: 1600, height: "100%" }}>
          <SvgStage>
            {step.svg(conditions)}
            {step.svgContent ? (
              <div
                className="mechanismSupplementalSvg"
                // eslint-disable-next-line react/no-danger -- trusted curriculum SVG only
                dangerouslySetInnerHTML={{ __html: step.svgContent }}
              />
            ) : null}
          </SvgStage>
        </div>
      </div>
    </main>
  );
}
