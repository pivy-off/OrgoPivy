/** Named mechanism pathways (sidebar entries) mapped to step-card indices per topic slug. */
export type MechanismPathwayDef = {
  id: string;
  title: string;
  subtitle?: string;
  /** Indices into `getMechanismStepCardsForSlug(slug)`. */
  stepIndices: number[];
};

const PATHWAYS: Record<string, MechanismPathwayDef[]> = {
  "substitution-elimination-nmr-review": [
    { id: "sn2-sn1", title: "SN₂ / SN₁", subtitle: "Backside attack vs carbocation", stepIndices: [0] },
    { id: "e2-e1", title: "E₂ / E₁", subtitle: "Anti elimination", stepIndices: [1] },
    { id: "nmr", title: "¹H NMR", subtitle: "Shift, integration, splitting", stepIndices: [2] },
  ],
  "ethers-epoxides": [
    { id: "acid-open", title: "Acid opening", subtitle: "Attack more substituted C", stepIndices: [0] },
    { id: "base-open", title: "Base opening", subtitle: "SN2 at less hindered C", stepIndices: [1] },
  ],
};

export function getMechanismPathwaysForSlug(slug: string): MechanismPathwayDef[] {
  return PATHWAYS[slug] ?? [];
}
