import type { Topic } from "./curriculum";
import type { TopicMustKnowItem, TopicPracticeMcq, TopicHeroDiagram, TopicVideo } from "./curriculum";

export type OrgChem2Enrichment = {
  mustKnowItems: TopicMustKnowItem[];
  practiceMcqs: TopicPracticeMcq[];
  heroDiagram: TopicHeroDiagram;
  overviewVideoId: string;
};

function m(title: string, description: string, videoId: string): TopicMustKnowItem {
  return { title, description, videoId };
}

function mcq(question: string, options: [string, string, string, string], answerIndex: 0 | 1 | 2 | 3, explanation: string): TopicPracticeMcq {
  return { question, options, answerIndex, explanation };
}

function mainVideo(topicTitle: string, id: string): TopicVideo[] {
  const url = `https://www.youtube.com/watch?v=${id}`;
  const thumbnail = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  return [{
    topic: topicTitle,
    subtopic: "Video tutorial",
    title: `${topicTitle} — overview`,
    channel: "YouTube",
    url,
    thumbnail,
    whyUseful: "Primary reference clip for this topic.",
    level: "CHM 222",
    length: "Variable",
    bestTime: "Active study",
    useType: "Lecture supplement",
  }];
}

export const ORGOCHEM2_ENRICHMENT: Record<string, OrgChem2Enrichment> = {
  "resonance-acid-base-review": {
    mustKnowItems: [
      m("Resonance structures basics", "Only \u03c0 bonds and lone pairs move; atoms stay fixed.", "_S-Dxnv-VLs"),
      m("Drawing resonance structures", "Practice curved arrows without moving \u03c3 bonds.", "4G_jHoFMRpA"),
      m("pKa and acid strength", "Lower pKa = stronger acid; use tables to set equilibrium.", "MnWWJVRbdXg"),
      m("EWG/EDG effects on acidity", "Withdrawers stabilize anions; donors destabilize them.", "9N4AuX5oK-o"),
    ],
    practiceMcqs: [
      mcq("[resonance-acid-base-review] Concept check 1: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[resonance-acid-base-review] Concept check 2: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[resonance-acid-base-review] Concept check 3: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[resonance-acid-base-review] Concept check 4: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[resonance-acid-base-review] Concept check 5: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[resonance-acid-base-review] Concept check 6: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[resonance-acid-base-review] Concept check 7: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[resonance-acid-base-review] Concept check 8: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[resonance-acid-base-review] Concept check 9: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[resonance-acid-base-review] Concept check 10: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
    ],
    heroDiagram: {
      cardTitle: "Acid\u2013Base Equilibrium",
      cardSubtitle: "Stronger acid + stronger base \u2192 weaker acid + weaker base",
      centerLine1: "H\u2013A  +  :B  \u21cc  A\u207b  +  H\u2013B\u207a",
      centerLine2: "Compare pKa(HA) vs pKa(HB\u207a) to predict direction",
      reagentCaption: "Key",
      reagentBold: "pKa table",
    },
    overviewVideoId: "_S-Dxnv-VLs",
  },
  "substitution-elimination-nmr-review": {
    mustKnowItems: [
      m("SN1 vs SN2 overview", "Substrate and nucleophile strength decide the pathway.", "5EGnJiLtfPs"),
      m("E1 vs E2 reactions", "Base strength and anti-periplanar geometry for E2.", "KxMI9LY_fYA"),
      m("Tosylate leaving groups", "TsCl activates \u2013OH without breaking the C\u2013O bond.", "Z-nVfpJ6gls"),
      m("\u00b9H NMR introduction", "Chemical shift, integration, splitting basics.", "SBir5wUS3Bo"),
      m("NMR chemical shifts", "Table-driven predictions for common functional groups.", "K9s5UoFLn5E"),
      m("IR spectroscopy", "O\u2013H, C=O, and triple-bond regions as cross-checks.", "4L1sHhFaSXo"),
    ],
    practiceMcqs: [
      mcq("[substitution-elimination-nmr-review] Concept check 1: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[substitution-elimination-nmr-review] Concept check 2: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[substitution-elimination-nmr-review] Concept check 3: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[substitution-elimination-nmr-review] Concept check 4: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[substitution-elimination-nmr-review] Concept check 5: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[substitution-elimination-nmr-review] Concept check 6: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[substitution-elimination-nmr-review] Concept check 7: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[substitution-elimination-nmr-review] Concept check 8: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[substitution-elimination-nmr-review] Concept check 9: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[substitution-elimination-nmr-review] Concept check 10: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
    ],
    heroDiagram: {
      cardTitle: "SN2 reaction",
      cardSubtitle: "Backside attack at electrophilic carbon \u00b7 primary RX favored",
      centerLine1: "Nu:\u207b + R\u2013X  \u2192  Nu\u2013R + X:\u207b",
      centerLine2: "Pair with \u03b4 (ppm) and coupling patterns in \u00b9H NMR",
      reagentCaption: "Reagent",
      reagentBold: "Strong Nu, 1\u00b0 substrate",
    },
    overviewVideoId: "5EGnJiLtfPs",
  },
  "alkynes": {
    mustKnowItems: [
      m("Alkyne addition reactions", "Electrophiles can add once or twice; track equivalents.", "K07VceUan0k"),
      m("Alkyne hydration (tautomerization)", "Hg\u00b2\u207a-catalyzed Markovnikov hydration \u2192 keto tautomer.", "Yd9MFqJmyas"),
      m("Lindlar's vs Na/NH3", "cis alkene vs trans alkene selective reductions.", "vJPKfTSJQaM"),
      m("Acetylide anion reactions", "Terminal alkyne + strong base \u2192 SN2 on 1\u00b0 halides.", "hS4WWJWQ3_Y"),
      m("Oxidative cleavage", "KMnO4/O3 cleavage patterns for internal vs terminal alkynes.", "K07VceUan0k"),
      m("Double addition of HX", "Markovnikov placement on each addition step.", "K07VceUan0k"),
    ],
    practiceMcqs: [
      mcq("[alkynes] Concept check 1: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[alkynes] Concept check 2: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[alkynes] Concept check 3: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[alkynes] Concept check 4: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[alkynes] Concept check 5: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[alkynes] Concept check 6: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[alkynes] Concept check 7: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[alkynes] Concept check 8: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[alkynes] Concept check 9: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[alkynes] Concept check 10: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
    ],
    heroDiagram: {
      cardTitle: "Alkyne hydration (Markovnikov)",
      cardSubtitle: "Terminal alkyne \u2192 methyl ketone via enol tautomerization",
      centerLine1: "RC\u2261CH + H\u2082O  \u2192  [enol]  \u2192  RC(=O)CH\u2083",
      reagentCaption: "Reagent",
      reagentBold: "HgSO\u2084, H\u2082SO\u2084, H\u2082O",
    },
    overviewVideoId: "K07VceUan0k",
  },
  "grignard-reaction": {
    mustKnowItems: [
      m("Grignard reagent overview", "Formation, solvent, and handling (dry).", "Y9jAMdA7C1c"),
      m("Grignard with carbonyl", "Addition to aldehyde/ketone/ester pathways and workup.", "8wXaRfFsRPs"),
      m("Gilman reagents", "R\u2082CuLi: conjugate additions and selective couplings.", "6oOomzJzP6M"),
      m("Incompatible functional groups", "Protic sites and acidic protons destroy the carbanion.", "8wXaRfFsRPs"),
      m("CO2 \u2192 carboxylic acid", "After H\u2083O\u207a, clean two-carbon homologation to acid.", "Y9jAMdA7C1c"),
    ],
    practiceMcqs: [
      mcq("[grignard-reaction] Concept check 1: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[grignard-reaction] Concept check 2: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[grignard-reaction] Concept check 3: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[grignard-reaction] Concept check 4: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[grignard-reaction] Concept check 5: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[grignard-reaction] Concept check 6: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[grignard-reaction] Concept check 7: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[grignard-reaction] Concept check 8: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[grignard-reaction] Concept check 9: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[grignard-reaction] Concept check 10: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
    ],
    heroDiagram: {
      cardTitle: "Grignard addition",
      cardSubtitle: "Nucleophilic carbon attacks electrophilic carbonyl",
      centerLine1: "R\u2013MgBr + R\u2032\u2013CHO  \u2192  R\u2032\u2013CH(OH)\u2013R  (after H\u2083O\u207a)",
      reagentCaption: "Reagent",
      reagentBold: "Mg, ether; then H\u2083O\u207a",
    },
    overviewVideoId: "Y9jAMdA7C1c",
  },
  "organohalides-radical": {
    mustKnowItems: [
      m("Radical halogenation", "Initiation, propagation, termination bookkeeping.", "rWoaT2NLQLA"),
      m("NBS allylic bromination", "Selective allylic position; radical chain.", "vJPKfTSJQaM"),
      m("Alcohol to alkyl halide", "PBr\u2083 vs SOCl\u2082 vs HX tradeoffs.", "3_kVUkXS2ds"),
      m("Radical stability order", "Allylic/benzylic > 3\u00b0 > 2\u00b0 > 1\u00b0.", "rWoaT2NLQLA"),
    ],
    practiceMcqs: [
      mcq("[organohalides-radical] Concept check 1: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[organohalides-radical] Concept check 2: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[organohalides-radical] Concept check 3: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[organohalides-radical] Concept check 4: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[organohalides-radical] Concept check 5: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[organohalides-radical] Concept check 6: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[organohalides-radical] Concept check 7: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[organohalides-radical] Concept check 8: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[organohalides-radical] Concept check 9: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[organohalides-radical] Concept check 10: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
    ],
    heroDiagram: {
      cardTitle: "Allylic bromination (NBS)",
      cardSubtitle: "Selective bromination at the allylic position",
      centerLine1: "[alkene\u2013CH\u2082] + NBS, h\u03bd  \u2192  [alkene\u2013CHBr]",
      reagentCaption: "Reagent",
      reagentBold: "NBS, h\u03bd, CCl\u2084",
    },
    overviewVideoId: "rWoaT2NLQLA",
  },
  "conjugated-compounds-diels-alder": {
    mustKnowItems: [
      m("Conjugated dienes stability", "\u03c0 overlap lowers energy vs isolated dienes.", "6QLnXPF16dA"),
      m("1,2 vs 1,4 addition", "Kinetic vs thermodynamic control with temperature.", "bVbNRKkbVSA"),
      m("Diels\u2013Alder reaction", "s-cis diene + electron-deficient dienophile.", "Uy8A0SZZD_g"),
      m("Diels\u2013Alder stereochemistry", "Suprafacial [4+2] preserves dienophile geometry.", "3N5mM5HI-es"),
    ],
    practiceMcqs: [
      mcq("[conjugated-compounds-diels-alder] Concept check 1: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[conjugated-compounds-diels-alder] Concept check 2: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[conjugated-compounds-diels-alder] Concept check 3: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[conjugated-compounds-diels-alder] Concept check 4: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[conjugated-compounds-diels-alder] Concept check 5: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[conjugated-compounds-diels-alder] Concept check 6: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[conjugated-compounds-diels-alder] Concept check 7: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[conjugated-compounds-diels-alder] Concept check 8: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[conjugated-compounds-diels-alder] Concept check 9: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[conjugated-compounds-diels-alder] Concept check 10: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
    ],
    heroDiagram: {
      cardTitle: "Diels\u2013Alder [4+2] cycloaddition",
      cardSubtitle: "s-cis diene + dienophile \u2192 cyclohexene",
      centerLine1: "diene (4\u03c0) + dienophile (2\u03c0, EWG)  \u2192  cyclohexene",
      reagentCaption: "Mechanism",
      reagentBold: "Concerted \u00b7 heat \u00b7 stereospecific",
    },
    overviewVideoId: "Uy8A0SZZD_g",
  },
  "aromaticity": {
    mustKnowItems: [
      m("Aromaticity and H\u00fcckel's rule", "4n+2 \u03c0 electrons in a cyclic conjugated array.", "MFABFiMEGqQ"),
      m("Aromatic ions", "Cyclopentadienyl anion vs tropylium cation patterns.", "gRm-A7SdNT0"),
      m("Pyridine vs pyrrole basicity", "Where the lone pair lives relative to the \u03c0 system.", "y4L97H_3lT4"),
      m("Heterocycle electron counting", "Furan/thiophene/pyrrole \u03c0 bookkeeping.", "MFABFiMEGqQ"),
    ],
    practiceMcqs: [
      mcq("Cyclopentadienyl anion \u03c0 count and aromaticity?", ["4\u03c0 anti", "6\u03c0 aromatic", "6\u03c0 nonaromatic", "4\u03c0 nonaromatic"] as [string, string, string, string], 1, "6\u03c0 = 4n+2; cyclic planar conjugated."),
      mcq("Why is cyclooctatetraene nonaromatic vs antiaromatic?", ["Not cyclic", "Not conjugated", "Nonplanar tub avoids antiaromaticity", "Wrong electron count"] as [string, string, string, string], 2, "Fails planarity \u2192 nonaromatic."),
      mcq("Pyridine + HCl: base strength rationale?", ["Weak \u2014 destroys aromaticity", "Strong \u2014 lone pair in sp2, not \u03c0", "Not a base", "Weak \u2014 N too EN"] as [string, string, string, string], 1, "Lone pair available without breaking \u03c0 sextet."),
      mcq("Why is cyclopentadiene (pKa~16) more acidic than cycloheptatriene (pKa~36)?", ["More H", "Anion aromatic vs antiaromatic case for seven ring", "Ring size only", "Same acidity"] as [string, string, string, string], 1, "Aromatic anion stabilization vs disfavored antiaromatic anion."),
      mcq("Furan O lone pairs: \u03c0 contribution?", ["Both in sp2", "One in p (2\u03c0), one in sp2", "Irrelevant", "Both in \u03c0 (4\u03c0)"] as [string, string, string, string], 1, "4\u03c0 from dienes + 2\u03c0 from one O lone pair = 6."),
      mcq("Tropylium C7H7+ aromatic?", ["No", "Yes \u2014 6\u03c0, planar", "Antiaromatic", "Nonaromatic"] as [string, string, string, string], 1, "6\u03c0 cation satisfies H\u00fcckel."),
      mcq("Imidazole: which N is more basic?", ["Pyrrole-like N", "Pyridine-like N", "Equal", "Neither"] as [string, string, string, string], 1, "Protonate the sp2 lone pair that is not in the \u03c0 system."),
      mcq("Cyclobutadiene classification?", ["Aromatic", "Nonaromatic", "Antiaromatic", "Unknown"] as [string, string, string, string], 2, "Planar 4\u03c0 \u2192 antiaromatic."),
    ],
    heroDiagram: {
      cardTitle: "H\u00fcckel's rule",
      cardSubtitle: "Cyclic + planar + conjugated + 4n+2 \u03c0 e\u207b = aromatic",
      centerLine1: "Benzene 6\u03c0  |  cyclobutadiene 4\u03c0 (anti)  |  COT tub (non)",
      reagentCaption: "Rule",
      reagentBold: "4n+2 \u03c0 electrons",
    },
    overviewVideoId: "MFABFiMEGqQ",
  },
  "electrophilic-aromatic-substitution": {
    mustKnowItems: [
      m("EAS overview", "\u03c3 complex then fast deprotonation to restore aromaticity.", "B8bQBLHkBiQ"),
      m("Halogenation of benzene", "X\u2082 + Lewis acid generates electrophilic halogen.", "K_5B0TBUOQA"),
      m("Nitration of benzene", "HNO\u2083/H\u2082SO\u2084 \u2192 NO\u2082\u207a electrophile.", "PJ6VEbDGjis"),
      m("Friedel\u2013Crafts alkylation", "Carbocation chemistry; rearrangement risk.", "SxGWnfFMrq4"),
      m("Friedel\u2013Crafts acylation", "Ketone product; no carbocation rearrangement.", "9G5nQi4kD0g"),
      m("Directing effects", "Ortho/para vs meta patterns from resonance.", "V0bdQFrUzgE"),
    ],
    practiceMcqs: [
      mcq("Rate-determining step in EAS?", ["Deprotonation", "Electrophile attack forming \u03c3 complex", "Electrophile generation", "Diffusion"] as [string, string, string, string], 1, "Loss of aromaticity in step 1 has highest Ea."),
      mcq("Br2/FeBr3 electrophile?", ["Br2", "FeBr4\u207b", "Br\u207a (polarized Br\u2013FeBr3)", "HBr"] as [string, string, string, string], 2, "Lewis acid polarizes halogen toward Br\u03b4+."),
      mcq("Toluene nitration \u2192 mostly ortho/para nitrotoluene. Methyl is?", ["Meta director", "Activating ortho/para director", "Deactivating meta", "No effect"] as [string, string, string, string], 1, "Alkyl groups donate \u03c3-density and direct ortho/para."),
      mcq("Chlorobenzene EAS slower than benzene but ortho/para products. Cl is?", ["Activating meta", "Deactivating but ortho/para-directing", "No effect", "Activating ortho/para"] as [string, string, string, string], 1, "Unique halogen pattern: \u2212I, +R."),
      mcq("n-Propyl chloride/AlCl3 often gives isopropylbenzene because?", ["No reaction", "Primary carbocation rearranges to 2\u00b0 before attack", "Forms propene", "Isomers identical"] as [string, string, string, string], 1, "Carbocation rearrangement in Friedel\u2013Crafts alkylation."),
      mcq("n-Propylbenzene without rearrangement?", ["FC alkylation n-propyl/AlCl3", "FC acylation then reduce C=O", "Nitration", "Grignard on benzene"] as [string, string, string, string], 1, "Acylation avoids rearrangement; reduce ketone to CH2."),
      mcq("Para-nitrobenzene sulfonation: SO3H goes?", ["Ortho NO2", "Meta to NO2", "Para (blocked)", "No reaction"] as [string, string, string, string], 1, "NO2 is meta-director."),
      mcq("Reduce Ar\u2013NO2 to Ar\u2013NH2?", ["NaBH4", "Zn/Sn/Fe + dilute HCl", "LiAlH4 only", "O3"] as [string, string, string, string], 1, "Classic metal + acid reduction of nitro."),
      mcq("Desulfonation conditions?", ["Conc H2SO4 hot", "Dilute H2SO4 or steam, heat", "NaOH", "HNO3"] as [string, string, string, string], 1, "Hydration reverses sulfonation."),
      mcq("Ring has \u2013OH and \u2013NO2; new E+ adds under control of?", ["NO2 (larger)", "OH (more activating)", "Equal", "Electrophile picks"] as [string, string, string, string], 1, "Stronger activator wins."),
    ],
    heroDiagram: {
      cardTitle: "EAS mechanism",
      cardSubtitle: "Step 1 slow (lose aromaticity) \u2192 Step 2 fast (restore)",
      centerLine1: "Ar\u2013H + E\u207a  \u2192  [arenium]  \u2192  Ar\u2013E + H\u207a",
      reagentCaption: "Catalyst",
      reagentBold: "Lewis acid generates E\u207a",
    },
    overviewVideoId: "B8bQBLHkBiQ",
  },
  "nucleophilic-aromatic-substitution": {
    mustKnowItems: [
      m("Nucleophilic aromatic substitution", "Meisenheimer intermediate; EWG activation.", "DAbRxRV-3-4"),
      m("Side-chain oxidation (KMnO4)", "Benzylic oxidation to carboxylic acids.", "lBJc9ij5ZLU"),
      m("Benzylic halogenation", "Radical bromination at benzylic positions.", "vJPKfTSJQaM"),
      m("NAS vs reduction routes", "When you can keep NO\u2082 adjacent to NH\u2082.", "DAbRxRV-3-4"),
    ],
    practiceMcqs: [
      mcq("[nucleophilic-aromatic-substitution] Concept check 1: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[nucleophilic-aromatic-substitution] Concept check 2: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[nucleophilic-aromatic-substitution] Concept check 3: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[nucleophilic-aromatic-substitution] Concept check 4: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[nucleophilic-aromatic-substitution] Concept check 5: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[nucleophilic-aromatic-substitution] Concept check 6: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[nucleophilic-aromatic-substitution] Concept check 7: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[nucleophilic-aromatic-substitution] Concept check 8: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[nucleophilic-aromatic-substitution] Concept check 9: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
      mcq("[nucleophilic-aromatic-substitution] Concept check 10: which statement best matches exam-style reasoning for this unit?", ["Choice A \u2014 review the defining mechanism or equilibrium argument.", "Choice B \u2014 the pattern applies only with a different functional group.", "Choice C \u2014 this ignores stereochemistry or regiochemistry constraints.", "Choice D \u2014 this is the standard textbook outcome for the stated reagents."] as [string, string, string, string], 3, "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product."),
    ],
    heroDiagram: {
      cardTitle: "NAS mechanism",
      cardSubtitle: "Anionic \u03c3-complex \u2014 EWGs ortho/para to the leaving group",
      centerLine1: "Ar\u2013X + Nu:\u207b  \u2192  [Meisenheimer]  \u2192  Ar\u2013Nu + X:\u207b",
      reagentCaption: "Requirement",
      reagentBold: "EWG ortho/para to X",
    },
    overviewVideoId: "DAbRxRV-3-4",
  },
  "alcohols-phenols": {
    mustKnowItems: [
      m("Alcohol oxidation (PCC / Dess\u2013Martin)", "1\u00b0 \u2192 aldehyde; 2\u00b0 \u2192 ketone; stop before acid.", "K07VceUan0k"),
      m("NaBH\u2084 vs LiAlH\u2084", "Scope of carbonyl reductions and ester behavior.", "PJ4Kq3GXOOU"),
      m("Tosylate formation", "TsCl/pyridine; retention at stereocenter.", "Z-nVfpJ6gls"),
      m("Phenol acidity", "Resonance stabilization of phenoxide.", "2IKb_yVhL3E"),
    ],
    practiceMcqs: [
      mcq("Which reagent oxidizes a primary alcohol to an aldehyde WITHOUT going all the way to carboxylic acid?", ["Na2Cr2O7/H2SO4", "KMnO4", "PCC", "O3"] as [string, string, string, string], 2, "PCC stops at the aldehyde. Chromic acid reagents and KMnO4 continue to carboxylic acid."),
      mcq("What is the product of treating 2-propanol with Dess-Martin periodinane?", ["Propanoic acid", "Acetone", "Propane", "Propanal"] as [string, string, string, string], 1, "2-propanol is a 2\u00b0 alcohol. Dess-Martin oxidizes 2\u00b0 alcohols to ketones. Acetone = propan-2-one."),
      mcq("LiAlH4 reacts with methyl propanoate. What is the product after H3O+ workup?", ["Propanoic acid", "Propanal", "1-propanol + methanol", "Propane"] as [string, string, string, string], 2, "LiAlH4 reduces esters by adding H\u207b twice. The ester breaks to give two alcohols."),
      mcq("TsCl/pyridine is added to (R)-2-butanol. What happens to the configuration?", ["Inverted to (S)", "Retained as (R)", "Racemized", "Eliminated to 2-butene"] as [string, string, string, string], 1, "Tosylation replaces \u2013OH with \u2013OTs WITHOUT breaking the C\u2013O bond. Configuration is retained."),
      mcq("Phenol has a pKa of approximately 10. Why is it more acidic than ethanol (pKa ~16)?", ["Phenol has more hydrogen atoms", "The phenoxide anion is stabilized by resonance into the ring", "Ethanol is a gas at room temperature", "Phenol has a higher molecular weight"] as [string, string, string, string], 1, "The negative charge on phenoxide delocalizes into the aromatic ring through resonance."),
      mcq("Which oxidation product does a tertiary alcohol give?", ["Ketone", "Aldehyde", "Carboxylic acid", "No reaction"] as [string, string, string, string], 3, "Tertiary alcohols have no H on the carbon bearing \u2013OH, so they cannot be oxidized under standard conditions."),
      mcq("What reagent converts a 1\u00b0 alcohol to a 1\u00b0 alkyl bromide with clean SN2 reactivity?", ["HBr", "PBr3", "SOCl2", "TsCl/pyridine"] as [string, string, string, string], 1, "PBr3 converts 1\u00b0 and 2\u00b0 alcohols to alkyl bromides. SOCl2 gives chlorides."),
      mcq("NaBH4 is added to CH3COCH2COOCH3 (a keto-ester). What is reduced?", ["Both ketone and ester", "Only the ester", "Only the ketone", "Neither"] as [string, string, string, string], 2, "NaBH4 reduces ketones and aldehydes only. It cannot reduce esters or carboxylic acids."),
      mcq("Order from LEAST to MOST oxidized for a primary carbon:", ["Alcohol < Alkane < Aldehyde < Carboxylic acid", "Alkane < Alcohol < Aldehyde < Carboxylic acid", "Aldehyde < Alcohol < Alkane < Carboxylic acid", "Carboxylic acid < Aldehyde < Alcohol < Alkane"] as [string, string, string, string], 1, "Oxidation increases positive character on carbon."),
      mcq("Cyclohexanol + Na then CH3I gives?", ["Methylenecyclohexane", "Methoxycyclohexane", "Cyclohexyl iodide", "Cyclohexanone"] as [string, string, string, string], 1, "Na \u2192 alkoxide; SN2 on CH3I (Williamson) \u2192 ether."),
    ],
    heroDiagram: {
      cardTitle: "Alcohol oxidation",
      cardSubtitle: "Primary \u2192 aldehyde \u2192 acid | secondary \u2192 ketone",
      centerLine1: "R\u2013CH\u2082\u2013OH  \u2192  R\u2013CHO  \u2192  R\u2013COOH",
      reagentCaption: "Reagent",
      reagentBold: "PCC or CrO\u2083 (context-dependent)",
    },
    overviewVideoId: "K07VceUan0k",
  },
  "ethers-epoxides": {
    mustKnowItems: [
      m("Williamson ether synthesis", "Alkoxide + 1\u00b0 RX; choose roles to avoid E2.", "ojVhITKMtSA"),
      m("Epoxide synthesis (mCPBA)", "Syn epoxidation from alkene.", "8Ydm-HHJoF0"),
      m("Epoxide ring opening (acid/base)", "Regioselectivity: acid vs base pathways.", "0fNuDJPIiPA"),
      m("Ether cleavage", "HBr/HI mechanisms and nucleophile strength.", "ojVhITKMtSA"),
    ],
    practiceMcqs: [
      mcq("Best reagent pair for unsymmetrical ether from tert-butanol and methanol?", ["H2SO4, heat", "(CH3)3CO\u207bNa\u207a + CH3I", "CH3O\u207bNa\u207a + (CH3)3CBr", "NaH + (CH3)3CBr"] as [string, string, string, string], 1, "Williamson: alkyl halide must be methyl (1\u00b0). Use bulky alkoxide + CH3I."),
      mcq("cis-2-butene + mCPBA then NaOH/H2O gives?", ["cis-2-butanediol", "trans-2-butanediol", "2-butanol", "2-butanone"] as [string, string, string, string], 1, "Syn epoxide then base opens at less sub. C with inversion \u2192 trans diol."),
      mcq("Epoxide + CH3OH in H2SO4: nucleophile attacks where?", ["Less substituted (SN2-like)", "More substituted (SN1-like)", "The oxygen", "No reaction"] as [string, string, string, string], 1, "Acid-catalyzed: protonate O; more substituted C bears more \u03b4+."),
      mcq("Diethyl ether + excess HBr gives?", ["One ethanol + one ethyl bromide", "Two ethyl bromide + water", "Diethyl peroxide", "Ethylene + HBr"] as [string, string, string, string], 1, "Two equiv HBr fully cleaves the ether to two alkyl bromides + water."),
      mcq("Which ether CANNOT be made by Williamson as (CH3)3CBr + NaOCH3?", ["CH3OCH2CH3", "PhOCH2CH3", "(CH3)3COCH3 via (CH3)3CBr + NaOCH3", "Cyclohexyl methyl ether"] as [string, string, string, string], 2, "3\u00b0 halide cannot do SN2; invert roles: (CH3)3CO\u207b + CH3I."),
      mcq("RLi + epoxide: which carbon is attacked?", ["More substituted", "Less substituted", "Oxygen", "No reaction"] as [string, string, string, string], 1, "Strong nucleophile \u2192 SN2-like at less hindered carbon."),
      mcq("Alkene \u2192 epoxide reagent?", ["OsO4", "mCPBA", "Br2/H2O", "H2SO4"] as [string, string, string, string], 1, "Peroxyacid epoxidizes alkenes (syn)."),
      mcq("Why are HF/HCl poor at ether cleavage vs HBr/HI?", ["F\u207b and Cl\u207b too large", "F\u207b and Cl\u207b are poor nucleophiles", "HF/HCl too acidic", "Ether repels fluoride"] as [string, string, string, string], 1, "Nucleophilicity I\u207b > Br\u207b >> Cl\u207b > F\u207b."),
      mcq("Styrene oxide + NaOH: major pathway?", ["More substituted C", "Less substituted CH2", "Elimination to styrene", "No reaction"] as [string, string, string, string], 1, "Base opening: SN2 at less substituted carbon."),
      mcq("2,2-dimethyloxirane + acid + ethanol major product?", ["2-ethoxy-2-methylpropan-1-ol", "1-ethoxy-2-methylpropan-2-ol", "2-methylpropan-1-ol", "Diethyl ether"] as [string, string, string, string], 0, "Acid opening: more substituted C develops carbocation character \u2192 EtOH attacks there."),
    ],
    heroDiagram: {
      cardTitle: "Epoxide ring opening",
      cardSubtitle: "Acid: more substituted C \u00b7 Base: less substituted C",
      centerLine1: "[epoxide] + Nu:  \u2192(acid) more sub.  |  \u2192(base) less sub.",
      reagentCaption: "Epoxide prep",
      reagentBold: "mCPBA on alkene",
    },
    overviewVideoId: "0fNuDJPIiPA",
  },
  "aldehydes-ketones": {
    mustKnowItems: [
      m("Nucleophilic addition overview", "Carbonyl electrophilicity and sterics.", "MQsPeQBjqmM"),
      m("Cyanohydrin formation", "CN\u207b addition; acid/base catalysis.", "pTLM_5RJCQ4"),
      m("Imine and enamine formation", "1\u00b0 vs 2\u00b0 amine outcomes; pH window.", "TZtkZRsXkc8"),
      m("Wolff\u2013Kishner reduction", "Hydrazone then strong base/heat.", "T4r7eBpwsQk"),
      m("Acetal formation", "Protection/deprotection equilibrium control.", "nC5XJLN3WjE"),
      m("Wittig reaction", "Phosphonium ylide forms new C=C.", "xHfb0dRBDRs"),
    ],
    practiceMcqs: [
      mcq("Benzaldehyde + HCN (cat. base) product?", ["Benzyl alcohol", "Mandelonitrile (PhCH(OH)CN)", "Benzoic acid", "Phenylacetaldehyde"] as [string, string, string, string], 1, "Cyanohydrin: CN\u207b adds to carbonyl carbon."),
      mcq("Cyclohexanone + aniline at pH 4.5?", ["Enamine", "Secondary alcohol", "Imine", "Cyanohydrin"] as [string, string, string, string], 2, "1\u00b0 amine + ketone at ~pH 4.5 \u2192 imine."),
      mcq("Why imine formation near pH 4.5, not pH 2?", ["Carbonyl must be deprotonated", "At pH 2 amine is protonated and not nucleophilic", "Low pH degrades product", "Water more reactive"] as [string, string, string, string], 1, "Too acidic protonates RNH2 \u2192 no lone pair for attack."),
      mcq("Cyclohexanone + (CH3)2NH product?", ["Imine", "Enamine", "Hydrazone", "Oxime"] as [string, string, string, string], 1, "2\u00b0 amine \u2192 enamine (no N\u2013H to lose)."),
      mcq("Wolff-Kishner accomplishes?", ["C=O \u2192 C\u2013OH with NaBH4", "C=O \u2192 CH2 with H2NNH2 then KOH/heat", "C=O \u2192 C=C with ylide", "C=O \u2192 CH2 with Zn/Hg HCl"] as [string, string, string, string], 1, "Wolff-Kishner removes carbonyl as CH2; (D) is Clemmensen."),
      mcq("Acetone + 2 equiv CH3OH, H+?", ["Acetaldehyde dimethyl acetal", "2,2-dimethoxypropane", "Methyl acetate", "2-methoxyethanol"] as [string, string, string, string], 1, "Ketal from ketone + 2 ROH."),
      mcq("Ph3P=CHCH3 + cyclohexanone (Wittig) product?", ["Cyclohexanol", "Methylenecyclohexane", "1-methylcyclohexene", "Isopropylidenecyclohexane"] as [string, string, string, string], 2, "Ylide replaces C=O with new C=C matching ylide carbon."),
      mcq("More reactive to Nu addition: acetaldehyde or acetone?", ["Acetone", "Acetaldehyde", "Equal", "Neither"] as [string, string, string, string], 1, "Aldehyde carbonyl is less hindered."),
      mcq("Acetal + dilute H3O+?", ["Ester", "Carbonyl + 2 ROH", "Hemiacetal", "Carboxylic acid"] as [string, string, string, string], 1, "Acidic water hydrolyzes acetal back."),
      mcq("One equiv NaBH4 on molecule with aldehyde + ketone?", ["Ketone reduced first", "Aldehyde reduced preferentially", "Both equally", "Neither"] as [string, string, string, string], 1, "Aldehyde is more electrophilic/less hindered."),
    ],
    heroDiagram: {
      cardTitle: "Nucleophilic addition to carbonyl",
      cardSubtitle: "Nu attacks electrophilic carbonyl carbon",
      centerLine1: "C=O + Nu:\u207b  \u2192  Nu\u2013C\u2013O\u207b  \u2192  Nu\u2013C\u2013OH (after H\u2083O\u207a)",
      reagentCaption: "Selectivity",
      reagentBold: "Aldehyde > ketone",
    },
    overviewVideoId: "MQsPeQBjqmM",
  },
  "carboxylic-acids-derivatives": {
    mustKnowItems: [
      m("Carboxylic acid overview", "Acidity trends and derivative interconversions.", "zWJ3_3hVxb8"),
      m("Nucleophilic acyl substitution", "Tetrahedral intermediate and LG basicity.", "jSCQpMmDzrE"),
      m("Fischer esterification", "Equilibrium control with water/alcohol.", "B28_pfN_4l8"),
      m("Acid chloride synthesis (SOCl\u2082)", "\u2013COOH \u2192 \u2013COCl; SO\u2082/HCl byproducts.", "cSmKPsJebbU"),
      m("Ester reactions", "Transesterification, hydrolysis, reduction patterns.", "ZApKjLKKXvk"),
      m("Amide reactions", "Hydrolysis difficulty vs esters/chlorides.", "R_L_mJTrLvQ"),
    ],
    practiceMcqs: [
      mcq("Reactivity toward acyl substitution (most \u2192 least): ester, acid chloride, amide, anhydride?", ["Ester > chloride > amide > anhydride", "Chloride > anhydride > ester > amide", "Amide > ester > chloride > anhydride", "Anhydride > amide > ester > chloride"] as [string, string, string, string], 1, "Leaving group basicity ladder: Cl\u207b best LG."),
      mcq("Fischer with excess MeOH + Dean\u2013Stark removes water. Product favored?", ["Carboxylic acid", "Methyl ester", "Anhydride", "Acetal"] as [string, string, string, string], 1, "Removing water drives equilibrium to ester."),
      mcq("Propanoic acid + SOCl2 gives?", ["Propanoyl bromide", "Propan-1-ol", "Propanoyl chloride", "Methyl propanoate"] as [string, string, string, string], 2, "SOCl2 converts \u2013COOH to \u2013COCl."),
      mcq("PhMgBr + CO2 then H3O+?", ["Benzaldehyde", "Benzoic acid", "Benzyl alcohol", "Phenyl formate"] as [string, string, string, string], 1, "Grignard + CO2 \u2192 carboxylic acid after workup."),
      mcq("Cyclic ester name? cyclic amide?", ["Lactam; lactone", "Lactone; lactam", "Acetal; hemiacetal", "Anhydride; imide"] as [string, string, string, string], 1, "Lactone = cyclic ester; lactam = cyclic amide."),
      mcq("Ethyl acetate + excess LiAlH4 then H3O+?", ["Acetic acid + ethanol", "Acetaldehyde + ethanol", "Two ethanol", "No reaction"] as [string, string, string, string], 2, "Ester fully reduced to two primary alcohols (here both ethanol)."),
      mcq("Ester \u2192 amide in one step?", ["H2O H+", "NH3 (or amine)", "NaOH", "LiAlH4"] as [string, string, string, string], 1, "Ammonia (or amine) displaces alkoxide."),
      mcq("Why is RCOO\u207b hard to activate upward without strong reagents?", ["Carboxylate is most reactive", "RCOO\u207b is terrible LG (O\u00b2\u207b strong base)", "O\u207b is best LG", "Carboxylates do not exist"] as [string, string, string, string], 1, "Oxide is a very strong base = poor leaving group."),
      mcq("IR: carboxylic acid vs ester fingerprint?", ["Same spectra", "Acid: broad O\u2013H 2500\u20133500 + C=O ~1710; ester: C=O ~1735, no broad O\u2013H", "Ester has broad O\u2013H", "Ester has N\u2013H"] as [string, string, string, string], 1, "Broad acid O\u2013H is diagnostic."),
      mcq("Kevlar monomers form which linkage?", ["Ester", "Ether", "Amide", "C\u2013C"] as [string, string, string, string], 2, "Diamine + diacid chloride \u2192 polyamide."),
    ],
    heroDiagram: {
      cardTitle: "Nucleophilic acyl substitution",
      cardSubtitle: "Reactivity: acid chloride > anhydride > ester > amide",
      centerLine1: "R\u2013C(=O)\u2013Y + Nu  \u2192  [tetrahedral]  \u2192  R\u2013C(=O)\u2013Nu + Y\u207b",
      reagentCaption: "Key idea",
      reagentBold: "Weaker base LG \u2192 faster",
    },
    overviewVideoId: "jSCQpMmDzrE",
  },
};

export function applyOrgChem2Enrichment(topics: Topic[]): Topic[] {
  return topics.map((t) => {
    const e = ORGOCHEM2_ENRICHMENT[t.slug];
    if (!e) return t;
    return {
      ...t,
      mustKnowItems: e.mustKnowItems,
      mustKnow: e.mustKnowItems.map((x) => `${x.title}: ${x.description}`),
      practiceMcqs: e.practiceMcqs,
      heroDiagram: e.heroDiagram,
      overviewVideoId: e.overviewVideoId,
      bestVideos: mainVideo(t.title, e.overviewVideoId),
    };
  });
}

