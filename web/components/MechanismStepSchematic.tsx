"use client";

import { useId } from "react";
import { ChemFormattedLine } from "@/app/lib/chemTypography";
import { parseReactionScheme } from "@/lib/parseReactionScheme";

type Props = {
  reactant: string;
  product: string;
  electronFlow: string;
  stepNo: number;
  totalSteps: number;
  title?: string;
};

export default function MechanismStepSchematic({
  reactant,
  product,
  electronFlow,
  stepNo,
  totalSteps,
  title,
}: Props) {
  const uid = useId().replace(/:/g, "");
  const scheme = parseReactionScheme(
    product ? `${reactant} → ${product}` : reactant,
  );
  const left = scheme.reactant || reactant;
  const right = scheme.product || product || "—";

  return (
    <div className="mech-schematic" role="img" aria-label={`Mechanism step ${stepNo} of ${totalSteps}`}>
      <div className="mech-schematic__badge">
        Step {stepNo} of {totalSteps}
        {title ? <span className="mech-schematic__badge-title"> · {title}</span> : null}
      </div>

      <div className="mech-schematic__row">
        <div className="mech-schematic__species mech-schematic__species--reactant">
          <div className="mech-schematic__label">Reactants</div>
          <pre className="mech-schematic__formula">{left}</pre>
        </div>

        <div className="mech-schematic__arrows" aria-hidden>
          <svg viewBox="0 0 120 100" className="mech-schematic__svg">
            <defs>
              <marker id={`mechArrBlue${uid}`} markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                <path d="M0,0 L8,3 L0,6 z" fill="#007aff" />
              </marker>
              <marker id={`mechArrRed${uid}`} markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                <path d="M0,0 L8,3 L0,6 z" fill="#ff3b30" />
              </marker>
            </defs>
            <path
              d="M 8 35 Q 60 8 112 35"
              fill="none"
              stroke="#007aff"
              strokeWidth="3"
              markerEnd={`url(#mechArrBlue${uid})`}
            />
            <path
              d="M 8 65 Q 60 92 112 65"
              fill="none"
              stroke="#ff3b30"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              markerEnd={`url(#mechArrRed${uid})`}
            />
            <text x="60" y="54" textAnchor="middle" fontSize="11" fill="#64748b" fontWeight="700">
              e⁻ flow
            </text>
          </svg>
          <div className="mech-schematic__forward">→</div>
        </div>

        <div className="mech-schematic__species mech-schematic__species--product">
          <div className="mech-schematic__label">Products</div>
          <pre className="mech-schematic__formula">{right}</pre>
        </div>
      </div>

      <div className="mech-schematic__flow topicReadable">
        <strong>What happens</strong>
        <ChemFormattedLine text={electronFlow} />
      </div>
    </div>
  );
}
