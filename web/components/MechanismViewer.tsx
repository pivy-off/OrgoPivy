"use client";

import { useEffect, useMemo, useState } from "react";
import { ChemFormattedLine } from "@/app/lib/chemTypography";
import type { MechanismDef, MechanismStep } from "@/lib/buildMechanismsFromTopic";
import MechanismStepSchematic from "@/components/MechanismStepSchematic";
import { addMechanismViewed } from "@/lib/storage";

export type { MechanismDef, MechanismStep } from "@/lib/buildMechanismsFromTopic";

export default function MechanismViewer({
  slug,
  mechanisms,
}: {
  slug: string;
  mechanisms: MechanismDef[];
}) {
  const [mid, setMid] = useState(mechanisms[0]?.id ?? "");
  const m = useMemo(() => mechanisms.find((x) => x.id === mid) ?? mechanisms[0], [mechanisms, mid]);

  useEffect(() => {
    if (m?.id) addMechanismViewed(slug, m.id);
  }, [slug, m?.id]);

  if (!m || m.steps.length === 0) {
    return (
      <div className="op-fade-in" style={{ padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 48 }}>⚗️</div>
        <p>No mechanism steps for this topic yet.</p>
      </div>
    );
  }

  const multiPathway = mechanisms.length > 1;

  return (
    <div className="mech-viewer" style={{ fontFamily: "var(--op-font-sans)" }}>
      {multiPathway ? (
        <aside className="mech-viewer__sidebar">
          <div className="mech-viewer__sidebar-title">Pathways</div>
          {mechanisms.map((mech) => (
            <button
              key={mech.id}
              type="button"
              onClick={() => setMid(mech.id)}
              className={`mech-viewer__path-btn${mech.id === m.id ? " mech-viewer__path-btn--active" : ""}`}
            >
              <span className="mech-viewer__path-name">{mech.title}</span>
              <span className="mech-viewer__path-meta">{mech.steps.length} step{mech.steps.length === 1 ? "" : "s"}</span>
            </button>
          ))}
        </aside>
      ) : null}

      <div className="mech-viewer__main">
        <header className="mech-viewer__header">
          <h1 className="mech-viewer__title">{m.title}</h1>
          <p className="mech-viewer__subtitle">{m.subtitle}</p>
        </header>

        <MechanismStepPanel key={mid} mechanism={m} />
      </div>
    </div>
  );
}

function MechanismStepPanel({ mechanism }: { mechanism: MechanismDef }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [showAll, setShowAll] = useState(true);
  const step = mechanism.steps[stepIdx];
  const total = mechanism.steps.length;

  if (!step) return null;

  return (
    <>
      <div className="mech-viewer__toolbar">
        <label className="mech-viewer__show-all">
          <input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} />
          Show all steps
        </label>
        {!showAll ? (
          <div className="mech-viewer__step-tabs" role="tablist">
            {mechanism.steps.map((s, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === stepIdx}
                className={`mech-viewer__step-tab${i === stepIdx ? " mech-viewer__step-tab--active" : ""}`}
                onClick={() => setStepIdx(i)}
              >
                {i + 1}. {s.title}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {showAll ? (
        <div className="mech-viewer__steps-stack">
          {mechanism.steps.map((s, i) => (
            <StepCard key={i} step={s} stepNo={i + 1} total={total} />
          ))}
        </div>
      ) : (
        <>
          <StepCard step={step} stepNo={stepIdx + 1} total={total} />
          <div className="mech-viewer__nav">
            <button
              type="button"
              className="op-btn-secondary"
              disabled={stepIdx === 0}
              onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
            >
              ← Previous
            </button>
            <span className="mech-viewer__nav-count">
              Step {stepIdx + 1} / {total}
            </span>
            <button
              type="button"
              className="op-btn-secondary"
              disabled={stepIdx >= total - 1}
              onClick={() => setStepIdx((i) => Math.min(total - 1, i + 1))}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </>
  );
}

function StepCard({ step, stepNo, total }: { step: MechanismStep; stepNo: number; total: number }) {
  return (
    <article className="mech-step-card op-fade-in">
      <h2 className="mech-step-card__title">{step.title}</h2>

      <MechanismStepSchematic
        reactant={step.reactant}
        product={step.product}
        electronFlow={step.electronFlow}
        stepNo={stepNo}
        totalSteps={total}
        title={step.title}
      />

      <div className="mech-step-card__line">
        <span className="mech-step-card__line-label">Line notation</span>
        <pre className="mech-step-card__structure chem-structure-line">{step.structure}</pre>
      </div>

      <div className="mech-step-card__bonds">
        <div className="mech-step-card__chip mech-step-card__chip--form">
          <span className="mech-step-card__chip-label">Bonds formed</span>
          <ChemFormattedLine text={step.bondFormed} />
        </div>
        <div className="mech-step-card__chip mech-step-card__chip--break">
          <span className="mech-step-card__chip-label">Bonds broken</span>
          <ChemFormattedLine text={step.bondBroken} />
        </div>
      </div>

      <div className="mech-step-card__error topicReadable">
        <strong>Common mistake</strong>
        <ChemFormattedLine text={step.commonError} />
      </div>
    </article>
  );
}
