/**
 * Topic boards for the Study Workspace (Organic Chemistry II focus + shared foundations).
 * UI content is static for now; pinned notes can move to persisted storage later.
 */
export type WorkspaceBoard = {
  id: string;
  title: string;
  tagline: string;
  summary: string;
  quickFacts: string[];
  checklist: string[];
  links: { label: string; href: string }[];
};

export const WORKSPACE_BOARDS: WorkspaceBoard[] = [
  {
    id: "sn1-sn2-e1-e2",
    title: "SN1 · SN2 · E1 · E2",
    tagline: "Decision support for substitution vs elimination",
    summary:
      "Use substrate class, base strength, nucleophile concentration, temperature, and solvent polarity to choose the dominant pathway.",
    quickFacts: [
      "Primary + strong nucleophile + aprotic → SN2",
      "Tertiary + heat + strong base → E2 (often wins over SN1 if carbocation is messy)",
      "Protic solvent stabilizes carbocations → favors SN1/E1",
    ],
    checklist: [
      "Draw the best leaving group after protonation if needed",
      "Identify α-carbons and β-hydrogens for elimination",
      "Check stereochemistry: SN2 inverts at the electrophilic center",
    ],
    links: [
      { label: "Mechanism explorer", href: "/mechanisms" },
      { label: "Quiz prep", href: "/quiz" },
    ],
  },
  {
    id: "grignard",
    title: "Grignard reactions",
    tagline: "Nucleophilic carbon reagents",
    summary:
      "RMgX adds to carbonyls, opens epoxides at the less hindered side, and is destroyed by water or alcohols—keep conditions dry.",
    quickFacts: [
      "Formal oxidation state of carbon in RMgX is carbanion-like",
      "After addition to carbonyls, protonation gives alcohols",
    ],
    checklist: [
      "Check for acidic protons in the substrate before planning a Grignard step",
      "For synthesis problems, protect alcohols first",
    ],
    links: [
      { label: "Upload carbonyl notes", href: "/uploads" },
      { label: "Ask your notes", href: "/ask" },
    ],
  },
  {
    id: "alkynes",
    title: "Alkynes",
    tagline: "Acidity, alkylation, and partial reduction",
    summary:
      "Terminal alkynes are acidic enough for NaNH₂ deprotonation; internal alkynes give stereoselective alkenes under Lindlar vs Na/NH₃.",
    quickFacts: [
      "Alkyne pKa is between alkanes and alcohols—strong bases required",
      "Hydroboration–oxidation on alkynes stops at aldehydes or ketones depending on workup",
    ],
    checklist: [
      "Track regioselectivity when adding HX twice",
      "Specify cis vs trans partial reduction reagents explicitly",
    ],
    links: [{ label: "Search notes", href: "/search" }],
  },
  {
    id: "conjugated-dienes",
    title: "Conjugated dienes",
    tagline: "1,2 vs 1,4 additions",
    summary:
      "Kinetic control favors 1,2 products; thermodynamic control often favors the more stable 1,4 conjugated product at higher temperature.",
    quickFacts: [
      "Diels–Alder needs s-cis diene geometry (or ring-locked dienes)",
      "Electron-withdrawing dienophiles accelerate cycloaddition",
    ],
    checklist: [
      "Draw both resonance forms of the allylic cation or radical when needed",
      "Label endo vs exo stereochemistry for cyclic adducts when asked",
    ],
    links: [{ label: "Mechanisms", href: "/mechanisms" }],
  },
  {
    id: "nmr",
    title: "NMR interpretation",
    tagline: "Chemical shift, integration, splitting",
    summary:
      "Combine chemical shift regions, integration ratios, and splitting patterns to propose functional groups and connectivity.",
    quickFacts: [
      "Electronegative neighbors deshield protons (downfield)",
      "n+1 rule applies to first-order spectra with distinct couplings",
    ],
    checklist: [
      "Start with molecular formula and degrees of unsaturation",
      "Use symmetry to predict equivalent protons",
    ],
    links: [{ label: "NMR Studio", href: "/spectra" }],
  },
];
