/**
 * Quiz item model designed for future AI-generated sets: stable ids, tags, and rationale.
 */
export type QuizMode = "mcq" | "recall" | "reaction";

export type QuizItemBase = {
  id: string;
  mode: QuizMode;
  topicTags: string[];
  prompt: string;
  /** For MCQ */
  choices?: string[];
  correctIndex?: number;
  /** Short explanation shown after answer */
  rationale: string;
};

export const QUIZ_SEED: QuizItemBase[] = [
  {
    id: "mcq-sn2-1",
    mode: "mcq",
    topicTags: ["sn2", "orgo1"],
    prompt: "Which substrate is the best candidate for a fast SN2 reaction with iodide?",
    choices: ["Methyl bromide", "Neopentyl bromide", "tert-Butyl bromide", "Vinyl bromide"],
    correctIndex: 0,
    rationale: "SN2 rates are highest for methyl and primary centers with minimal steric hindrance.",
  },
  {
    id: "mcq-grignard-1",
    mode: "mcq",
    topicTags: ["grignard", "orgo2"],
    prompt: "Why must Grignard reactions be run under anhydrous conditions?",
    choices: [
      "Water protonates the carbonyl faster than the Grignard adds",
      "Water protonates the Grignard to alkane, destroying the reagent",
      "Water acts as a catalyst for elimination only",
      "Water shifts the equilibrium toward enolates only",
    ],
    correctIndex: 1,
    rationale: "Grignard reagents are extremely basic and nucleophilic; water (and alcohols) quench them immediately.",
  },
  {
    id: "recall-nmr-1",
    mode: "recall",
    topicTags: ["nmr"],
    prompt: "State the n+1 rule and when it breaks down.",
    rationale:
      "Equivalent neighboring protons split a signal into n+1 lines. It breaks down when coupling constants are similar and second-order coupling appears, or when exchange broadens peaks.",
  },
  {
    id: "rxn-aldol-1",
    mode: "reaction",
    topicTags: ["enolate", "aldol"],
    prompt: "Aldol addition vs aldol condensation: what extra condition favors condensation?",
    rationale: "Heat and base often drive dehydration to the α,β-unsaturated carbonyl (condensation product).",
  },
];
