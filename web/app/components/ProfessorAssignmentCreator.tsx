"use client";

import { useState, useEffect, useMemo } from "react";
import { getCourseTopics, findTopic, type Topic, type CourseId } from "../lib/curriculum";
import type { HomeworkProblem } from "../lib/homework-problems";

type ProblemSuggestion = {
  question: string;
  type: "multiple-choice" | "synthesis" | "mechanism" | "short-answer";
  options?: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
  difficulty: "easy" | "medium" | "hard";
  basedOn: string[];
  category: string; // e.g., "Naming", "Conformations", "Mechanisms"
};

type Props = {
  course: CourseId;
  topic?: string;
  onAssignmentCreated?: (assignmentId: string) => void;
};

// Comprehensive problem templates for each topic
const PROBLEM_TEMPLATES: Record<string, (topic: Topic) => ProblemSuggestion[]> = {
  "alkanes": (topic) => [
    {
      question: "What is the IUPAC name for the following structure: [Draw structure with multiple substituents]?",
      type: "multiple-choice",
      options: [
        "2,4-dimethylpentane",
        "1,1,3-trimethylbutane",
        "2-methyl-4-methylpentane",
        "isoheptane"
      ],
      correctAnswer: "2,4-dimethylpentane",
      explanation: "Find the longest continuous chain (5 carbons = pentane), number to give lowest substituent numbers, and list substituents alphabetically.",
      points: 10,
      difficulty: "medium",
      basedOn: [topic.mustKnow[0]],
      category: "Naming"
    },
    {
      question: "Which conformation of butane is most stable?",
      type: "multiple-choice",
      options: [
        "Anti conformation (180° between methyl groups)",
        "Gauche conformation (60° between methyl groups)",
        "Eclipsed conformation (0° between methyl groups)",
        "All conformations are equally stable"
      ],
      correctAnswer: "Anti conformation (180° between methyl groups)",
      explanation: "Anti conformation minimizes steric interactions between methyl groups, resulting in the lowest energy.",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[2], topic.mustKnow[3]],
      category: "Conformations"
    },
    {
      question: "Draw the Newman projection for the most stable conformation of 2-methylbutane, viewing down the C2-C3 bond.",
      type: "short-answer",
      correctAnswer: "Anti conformation with methyl groups 180° apart, staggered",
      explanation: "The most stable conformation has the largest groups (methyl groups) in the anti position (180° apart) to minimize steric strain.",
      points: 15,
      difficulty: "hard",
      basedOn: [topic.mustKnow[3]],
      category: "Newman Projections"
    },
    {
      question: "Rank the following in order of increasing stability: eclipsed ethane, gauche butane, anti butane, eclipsed butane.",
      type: "multiple-choice",
      options: [
        "eclipsed butane < eclipsed ethane < gauche butane < anti butane",
        "anti butane < gauche butane < eclipsed ethane < eclipsed butane",
        "eclipsed ethane < gauche butane < anti butane < eclipsed butane",
        "All are equally stable"
      ],
      correctAnswer: "eclipsed butane < eclipsed ethane < gauche butane < anti butane",
      explanation: "Anti has no steric strain, gauche has some, eclipsed ethane has torsional strain, eclipsed butane has both torsional and steric strain.",
      points: 12,
      difficulty: "hard",
      basedOn: [topic.mustKnow[2], topic.mustKnow[4]],
      category: "Stability Analysis"
    },
    {
      question: "Identify the type of strain present in cyclopropane: (a) torsional strain, (b) angle strain, (c) steric strain, (d) all of the above.",
      type: "multiple-choice",
      options: ["(a) only", "(b) only", "(c) only", "(d) all of the above"],
      correctAnswer: "(d) all of the above",
      explanation: "Cyclopropane has severe angle strain (60° vs ideal 109.5°), torsional strain (eclipsed bonds), and steric strain (crowded ring).",
      points: 10,
      difficulty: "medium",
      basedOn: [topic.mustKnow[4]],
      category: "Strain Analysis"
    },
    {
      question: "What is the relationship between the following structures? [Show two Newman projections]",
      type: "multiple-choice",
      options: [
        "Identical conformations",
        "Different conformations of the same molecule",
        "Constitutional isomers",
        "Stereoisomers"
      ],
      correctAnswer: "Different conformations of the same molecule",
      explanation: "Newman projections show different rotational conformations of the same molecule, not different compounds.",
      points: 10,
      difficulty: "easy",
      basedOn: [topic.mustKnow[3]],
      category: "Conformational Analysis"
    },
    {
      question: "Explain why staggered conformations are more stable than eclipsed conformations.",
      type: "short-answer",
      correctAnswer: "Staggered conformations minimize torsional strain by maximizing the distance between electron pairs in adjacent C-H bonds, reducing repulsion.",
      explanation: "In staggered conformations, C-H bonds are maximally separated (60° apart), minimizing electron-electron repulsion. Eclipsed conformations have bonds directly aligned, maximizing repulsion.",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[2], topic.mustKnow[4]],
      category: "Conceptual Understanding"
    },
    {
      question: "Which of the following has the highest boiling point?",
      type: "multiple-choice",
      options: [
        "2-methylpropane",
        "Butane",
        "2,2-dimethylpropane",
        "All have the same boiling point"
      ],
      correctAnswer: "Butane",
      explanation: "Straight-chain alkanes have higher boiling points than branched isomers due to greater surface area for London dispersion forces.",
      points: 10,
      difficulty: "medium",
      basedOn: [topic.mustKnow[0]],
      category: "Physical Properties"
    }
  ],
  "cycloalkanes": (topic) => [
    {
      question: "Draw the chair conformation of trans-1,4-dimethylcyclohexane and identify which conformation is more stable.",
      type: "short-answer",
      correctAnswer: "Diequatorial conformation is more stable than diaxial due to absence of 1,3-diaxial interactions.",
      explanation: "In trans-1,4-dimethylcyclohexane, both methyl groups can be equatorial in one chair form, avoiding 1,3-diaxial interactions.",
      points: 15,
      difficulty: "hard",
      basedOn: [topic.mustKnow[0], topic.mustKnow[4]],
      category: "Chair Conformations"
    },
    {
      question: "Which position is more stable for a substituent in cyclohexane?",
      type: "multiple-choice",
      options: [
        "Axial position",
        "Equatorial position",
        "Both are equally stable",
        "Depends on the substituent"
      ],
      correctAnswer: "Equatorial position",
      explanation: "Equatorial positions avoid 1,3-diaxial interactions with axial hydrogens, making them more stable.",
      points: 10,
      difficulty: "easy",
      basedOn: [topic.mustKnow[0], topic.mustKnow[2]],
      category: "Stability"
    },
    {
      question: "During a chair flip, what happens to axial and equatorial positions?",
      type: "multiple-choice",
      options: [
        "All axial become equatorial and vice versa",
        "Axial stay axial, equatorial stay equatorial",
        "Half become axial, half become equatorial",
        "Positions remain unchanged"
      ],
      correctAnswer: "All axial become equatorial and vice versa",
      explanation: "Chair flip interconverts all axial positions to equatorial and all equatorial to axial positions.",
      points: 10,
      difficulty: "medium",
      basedOn: [topic.mustKnow[1]],
      category: "Ring Flips"
    },
    {
      question: "Which of the following has the most 1,3-diaxial interactions?",
      type: "multiple-choice",
      options: [
        "Methylcyclohexane with methyl in equatorial position",
        "Methylcyclohexane with methyl in axial position",
        "t-Butylcyclohexane with t-butyl in equatorial position",
        "t-Butylcyclohexane with t-butyl in axial position"
      ],
      correctAnswer: "t-Butylcyclohexane with t-butyl in axial position",
      explanation: "t-Butyl is very bulky, and when axial, creates severe 1,3-diaxial interactions with axial hydrogens.",
      points: 12,
      difficulty: "hard",
      basedOn: [topic.mustKnow[2]],
      category: "Steric Interactions"
    },
    {
      question: "Identify whether the following substituents in cyclohexane are cis or trans: [Show structure]",
      type: "multiple-choice",
      options: ["Cis", "Trans", "Cannot be determined", "Both are possible"],
      correctAnswer: "Cis",
      explanation: "Cis means both substituents are on the same face (both up or both down), while trans means opposite faces.",
      points: 10,
      difficulty: "medium",
      basedOn: [topic.mustKnow[3]],
      category: "Stereochemistry"
    },
    {
      question: "Explain why cyclohexane adopts a chair conformation rather than a planar hexagon.",
      type: "short-answer",
      correctAnswer: "The chair conformation minimizes both angle strain (maintains ~109.5° bond angles) and torsional strain (staggered bonds), while a planar hexagon would have severe angle strain.",
      explanation: "Planar cyclohexane would require 120° bond angles, causing severe angle strain. The chair form allows tetrahedral angles while maintaining ring closure.",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[0]],
      category: "Conceptual Understanding"
    },
    {
      question: "Rank the following in order of increasing stability: cis-1,3-dimethylcyclohexane (diequatorial), cis-1,3-dimethylcyclohexane (diaxial), trans-1,3-dimethylcyclohexane.",
      type: "multiple-choice",
      options: [
        "diaxial < trans < diequatorial",
        "diequatorial < trans < diaxial",
        "trans < diaxial < diequatorial",
        "All are equally stable"
      ],
      correctAnswer: "diaxial < trans < diequatorial",
      explanation: "Diequatorial avoids all 1,3-diaxial interactions. Trans has one axial methyl. Diaxial has maximum steric strain.",
      points: 15,
      difficulty: "hard",
      basedOn: [topic.mustKnow[2], topic.mustKnow[4]],
      category: "Stability Ranking"
    },
    {
      question: "What is the energy difference between axial and equatorial methylcyclohexane?",
      type: "multiple-choice",
      options: [
        "~1.7 kcal/mol",
        "~0.5 kcal/mol",
        "~5.0 kcal/mol",
        "No energy difference"
      ],
      correctAnswer: "~1.7 kcal/mol",
      explanation: "The axial methyl experiences 1,3-diaxial interactions worth approximately 1.7 kcal/mol, making equatorial more stable.",
      points: 10,
      difficulty: "medium",
      basedOn: [topic.mustKnow[2]],
      category: "Energy Analysis"
    }
  ],
  "stereochemistry": (topic) => [
    {
      question: "Assign R or S configuration to the stereocenter in the following molecule: [Show structure]",
      type: "multiple-choice",
      options: ["R", "S", "Not a stereocenter", "Cannot be determined"],
      correctAnswer: "R",
      explanation: "Assign CIP priorities (1-4), put lowest priority away, trace 1→2→3: clockwise = R, counterclockwise = S.",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[2]],
      category: "R/S Configuration"
    },
    {
      question: "What is the relationship between the following two molecules? [Show two structures]",
      type: "multiple-choice",
      options: [
        "Enantiomers",
        "Diastereomers",
        "Identical",
        "Constitutional isomers"
      ],
      correctAnswer: "Enantiomers",
      explanation: "Enantiomers are non-superimposable mirror images. Diastereomers are stereoisomers that aren't enantiomers.",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[1]],
      category: "Stereoisomerism"
    },
    {
      question: "Assign E or Z configuration to the following alkene: [Show structure]",
      type: "multiple-choice",
      options: ["E", "Z", "Cannot be determined", "Not applicable"],
      correctAnswer: "E",
      explanation: "Assign priorities to each side of the double bond. E = high priority groups trans, Z = high priority groups cis.",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[3]],
      category: "E/Z Configuration"
    },
    {
      question: "Which of the following is a meso compound?",
      type: "multiple-choice",
      options: [
        "[Show meso compound]",
        "[Show enantiomer pair]",
        "[Show diastereomer]",
        "None of the above"
      ],
      correctAnswer: "[Show meso compound]",
      explanation: "Meso compounds have stereocenters but are achiral due to a plane of symmetry, resulting in no optical activity.",
      points: 15,
      difficulty: "hard",
      basedOn: [topic.mustKnow[0], topic.mustKnow[4]],
      category: "Meso Compounds"
    },
    {
      question: "How many stereoisomers exist for a molecule with 3 stereocenters?",
      type: "multiple-choice",
      options: ["3", "6", "8", "9"],
      correctAnswer: "8",
      explanation: "For n stereocenters, maximum stereoisomers = 2^n. With 3 stereocenters, 2^3 = 8 stereoisomers (4 pairs of enantiomers, or fewer if meso compounds exist).",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[1]],
      category: "Stereoisomer Counting"
    },
    {
      question: "Explain why a racemic mixture shows no optical activity.",
      type: "short-answer",
      correctAnswer: "A racemic mixture contains equal amounts of enantiomers, which rotate plane-polarized light equally but in opposite directions, canceling out the net rotation.",
      explanation: "Each enantiomer rotates light equally but oppositely. In a 50:50 mixture, rotations cancel to zero.",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[4]],
      category: "Optical Activity"
    },
    {
      question: "Which Fischer projection represents the R configuration? [Show multiple Fischer projections]",
      type: "multiple-choice",
      options: ["A", "B", "C", "All are S"],
      correctAnswer: "A",
      explanation: "In Fischer projections, if lowest priority is on vertical (away), trace 1→2→3: clockwise = R, counterclockwise = S.",
      points: 15,
      difficulty: "hard",
      basedOn: [topic.mustKnow[2]],
      category: "Fischer Projections"
    },
    {
      question: "Identify all stereocenters in the following molecule: [Show complex structure]",
      type: "short-answer",
      correctAnswer: "Carbons 2, 3, and 5 are stereocenters (each has 4 different groups attached).",
      explanation: "A stereocenter is a carbon with 4 different groups attached. Identify carbons meeting this criterion.",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[0]],
      category: "Stereocenter Identification"
    }
  ],
  "substitution-elimination": (topic) => [
    {
      question: "Predict the major product and mechanism (SN1, SN2, E1, or E2) for the following reaction: [Show substrate + nucleophile/base]",
      type: "synthesis",
      correctAnswer: "Product: [product]. Mechanism: SN2 (primary substrate, strong nucleophile, polar aprotic solvent).",
      explanation: "Primary substrates favor SN2/E2. Strong nucleophile + weak base → SN2. Strong base → E2.",
      points: 18,
      difficulty: "hard",
      basedOn: [topic.mustKnow[0], topic.mustKnow[1]],
      category: "Mechanism Prediction"
    },
    {
      question: "Which factor favors SN1 over SN2?",
      type: "multiple-choice",
      options: [
        "Primary substrate",
        "Tertiary substrate",
        "Strong nucleophile",
        "Polar aprotic solvent"
      ],
      correctAnswer: "Tertiary substrate",
      explanation: "Tertiary substrates favor SN1/E1 due to carbocation stability. Primary substrates favor SN2/E2.",
      points: 10,
      difficulty: "easy",
      basedOn: [topic.mustKnow[0]],
      category: "Substrate Effects"
    },
    {
      question: "What is the stereochemistry of SN2 reactions?",
      type: "multiple-choice",
      options: [
        "Retention of configuration",
        "Inversion of configuration",
        "Racemization",
        "No stereochemistry"
      ],
      correctAnswer: "Inversion of configuration",
      explanation: "SN2 proceeds via backside attack, causing inversion of stereochemistry (Walden inversion).",
      points: 10,
      difficulty: "medium",
      basedOn: [topic.mustKnow[3]],
      category: "Stereochemistry"
    },
    {
      question: "Which solvent favors SN2 reactions?",
      type: "multiple-choice",
      options: [
        "Water (polar protic)",
        "DMSO (polar aprotic)",
        "Hexane (nonpolar)",
        "All solvents equally"
      ],
      correctAnswer: "DMSO (polar aprotic)",
      explanation: "Polar aprotic solvents (DMSO, DMF, acetone) favor SN2 by solvating cations but not anions, making nucleophiles more reactive.",
      points: 10,
      difficulty: "medium",
      basedOn: [topic.mustKnow[2]],
      category: "Solvent Effects"
    },
    {
      question: "Predict the major product: [Show tertiary alkyl halide + strong base]. Consider both substitution and elimination.",
      type: "synthesis",
      correctAnswer: "E2 elimination product (alkene) is major. Tertiary substrate + strong base favors E2 over SN1.",
      explanation: "Strong base favors elimination. Tertiary substrate favors E1/E2. Strong base + tertiary → E2 major product.",
      points: 15,
      difficulty: "hard",
      basedOn: [topic.mustKnow[0], topic.mustKnow[1], topic.mustKnow[4]],
      category: "Product Prediction"
    },
    {
      question: "What is the Zaitsev product in elimination reactions?",
      type: "multiple-choice",
      options: [
        "Less substituted alkene",
        "More substituted alkene",
        "Terminal alkene",
        "Internal alkene only"
      ],
      correctAnswer: "More substituted alkene",
      explanation: "Zaitsev's rule states that elimination favors the more substituted (thermodynamically stable) alkene.",
      points: 10,
      difficulty: "easy",
      basedOn: [topic.mustKnow[4]],
      category: "Regioselectivity"
    },
    {
      question: "Explain why SN1 reactions show racemization while SN2 shows inversion.",
      type: "short-answer",
      correctAnswer: "SN1 forms a planar carbocation intermediate that can be attacked from either face, leading to racemization. SN2 has direct backside attack, causing inversion.",
      explanation: "SN1's carbocation intermediate is achiral and planar, allowing attack from both sides. SN2's concerted mechanism forces backside attack.",
      points: 15,
      difficulty: "hard",
      basedOn: [topic.mustKnow[3]],
      category: "Mechanism Understanding"
    },
    {
      question: "Rank the following in order of increasing SN2 reactivity: methyl bromide, ethyl bromide, isopropyl bromide, tert-butyl bromide.",
      type: "multiple-choice",
      options: [
        "tert-butyl < isopropyl < ethyl < methyl",
        "methyl < ethyl < isopropyl < tert-butyl",
        "ethyl < methyl < isopropyl < tert-butyl",
        "All have equal reactivity"
      ],
      correctAnswer: "tert-butyl < isopropyl < ethyl < methyl",
      explanation: "SN2 reactivity decreases with increasing substitution due to steric hindrance. Methyl is most reactive, tertiary doesn't undergo SN2.",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[0]],
      category: "Reactivity Trends"
    }
  ],
  "alkenes": (topic) => [
    {
      question: "Predict the major product: [Show alkene + HBr]. Consider Markovnikov's rule and possible rearrangements.",
      type: "synthesis",
      correctAnswer: "Markovnikov product: H adds to less substituted C, Br adds to more substituted C. If rearrangement occurs, show carbocation shift.",
      explanation: "HX addition follows Markovnikov's rule. If carbocation can rearrange to more stable form, rearrangement occurs.",
      points: 15,
      difficulty: "hard",
      basedOn: [topic.mustKnow[0], topic.mustKnow[3]],
      category: "Markovnikov Addition"
    },
    {
      question: "What is the stereochemistry of H₂/Pd addition to alkenes?",
      type: "multiple-choice",
      options: [
        "Syn addition",
        "Anti addition",
        "No stereoselectivity",
        "Depends on the alkene"
      ],
      correctAnswer: "Syn addition",
      explanation: "Catalytic hydrogenation (H₂/Pd) adds both hydrogens from the same face of the alkene, resulting in syn addition.",
      points: 10,
      difficulty: "medium",
      basedOn: [topic.mustKnow[2]],
      category: "Stereochemistry"
    },
    {
      question: "Predict the product of hydroboration-oxidation: [Show alkene]",
      type: "synthesis",
      correctAnswer: "Anti-Markovnikov alcohol: OH adds to less substituted carbon, H adds to more substituted carbon.",
      explanation: "Hydroboration-oxidation gives anti-Markovnikov addition with syn stereochemistry. OH ends up on less substituted carbon.",
      points: 15,
      difficulty: "hard",
      basedOn: [topic.mustKnow[0], topic.mustKnow[2]],
      category: "Anti-Markovnikov"
    },
    {
      question: "What is the product of ozonolysis of the following alkene: [Show alkene]?",
      type: "synthesis",
      correctAnswer: "Ozonolysis cleaves C=C to carbonyls. Terminal alkene → aldehyde + formaldehyde. Internal alkene → two carbonyls.",
      explanation: "Ozonolysis breaks the double bond and forms carbonyl compounds. Terminal carbons become aldehydes, internal carbons become ketones.",
      points: 15,
      difficulty: "hard",
      basedOn: [topic.mustKnow[4]],
      category: "Ozonolysis"
    },
    {
      question: "Which reaction gives anti addition?",
      type: "multiple-choice",
      options: [
        "H₂/Pd",
        "Br₂",
        "Hydroboration-oxidation",
        "Acid-catalyzed hydration"
      ],
      correctAnswer: "Br₂",
      explanation: "Halogenation (Br₂, Cl₂) gives anti addition via bromonium ion intermediate. Syn additions include H₂/Pd and hydroboration.",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[2]],
      category: "Stereochemistry"
    },
    {
      question: "Explain why carbocation rearrangements occur in alkene addition reactions.",
      type: "short-answer",
      correctAnswer: "Carbocations rearrange (hydride or methyl shift) to form more stable carbocations (3° > 2° > 1°), following the stability order.",
      explanation: "If a less stable carbocation can rearrange to a more stable one, the shift occurs. This changes the product distribution.",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[3]],
      category: "Rearrangements"
    },
    {
      question: "Predict the major product: [Show alkene + H₂O/H⁺]",
      type: "synthesis",
      correctAnswer: "Markovnikov alcohol: OH adds to more substituted carbon via most stable carbocation intermediate.",
      explanation: "Acid-catalyzed hydration follows Markovnikov's rule. H⁺ adds first to form carbocation, then H₂O attacks.",
      points: 15,
      difficulty: "hard",
      basedOn: [topic.mustKnow[0]],
      category: "Hydration"
    },
    {
      question: "What is the difference between oxymercuration-demercuration and acid-catalyzed hydration?",
      type: "multiple-choice",
      options: [
        "Oxymercuration avoids rearrangements, hydration allows rearrangements",
        "Hydration avoids rearrangements, oxymercuration allows rearrangements",
        "No difference",
        "Oxymercuration gives anti-Markovnikov product"
      ],
      correctAnswer: "Oxymercuration avoids rearrangements, hydration allows rearrangements",
      explanation: "Oxymercuration proceeds via mercurinium ion (no carbocation), preventing rearrangements. Acid-catalyzed hydration forms carbocations that can rearrange.",
      points: 15,
      difficulty: "hard",
      basedOn: [topic.mustKnow[0], topic.mustKnow[3]],
      category: "Reaction Comparison"
    }
  ],
  "spectroscopy": (topic) => [
    {
      question: "Identify the functional group responsible for the IR absorption at 1715 cm⁻¹.",
      type: "multiple-choice",
      options: ["O-H", "C=O", "C=C", "C≡N"],
      correctAnswer: "C=O",
      explanation: "Carbonyl groups (C=O) absorb around 1650-1750 cm⁻¹. 1715 cm⁻¹ is typical for ketones and aldehydes.",
      points: 10,
      difficulty: "easy",
      basedOn: [topic.mustKnow[0]],
      category: "IR Spectroscopy"
    },
    {
      question: "A molecule with molecular formula C₆H₁₂O has how many degrees of unsaturation?",
      type: "multiple-choice",
      options: ["0", "1", "2", "3"],
      correctAnswer: "1",
      explanation: "DBE = C + 1 - H/2 - X/2 + N/2 = 6 + 1 - 12/2 - 0/2 + 0/2 = 7 - 6 = 1. One double bond or ring.",
      points: 10,
      difficulty: "medium",
      basedOn: [topic.mustKnow[3]],
      category: "Degree of Unsaturation"
    },
    {
      question: "Predict the ¹H NMR spectrum: [Show structure]. Include chemical shifts, integration, and splitting patterns.",
      type: "short-answer",
      correctAnswer: "Describe each signal: chemical shift (ppm), integration (number of H's), splitting pattern (n+1 rule), and assignment.",
      explanation: "Analyze each unique proton environment. Consider chemical shift (deshielding), integration (H count), and coupling (neighboring H's).",
      points: 20,
      difficulty: "hard",
      basedOn: [topic.mustKnow[1]],
      category: "Proton NMR"
    },
    {
      question: "How many unique carbon signals would appear in the ¹³C NMR spectrum of [Show structure]?",
      type: "multiple-choice",
      options: ["3", "4", "5", "6"],
      correctAnswer: "5",
      explanation: "Count unique carbon environments (different chemical environments). Symmetry reduces the number of signals.",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[2]],
      category: "Carbon-13 NMR"
    },
    {
      question: "Determine the structure from the following data: IR: 1715 cm⁻¹; ¹H NMR: δ 2.1 (s, 3H), 2.3 (s, 3H); ¹³C NMR: 3 signals.",
      type: "synthesis",
      correctAnswer: "Acetone (CH₃COCH₃): C=O at 1715, two equivalent methyl groups (2.1 and 2.3 ppm), 3 unique carbons.",
      explanation: "C=O indicates carbonyl. Two singlet methyl groups suggest ketone. 3 carbon signals confirms symmetric ketone.",
      points: 20,
      difficulty: "hard",
      basedOn: [topic.mustKnow[4]],
      category: "Structure Determination"
    },
    {
      question: "What does a broad peak at 3300 cm⁻¹ in IR indicate?",
      type: "multiple-choice",
      options: ["C-H stretch", "O-H stretch", "C=O stretch", "C≡N stretch"],
      correctAnswer: "O-H stretch",
      explanation: "O-H stretches appear broad around 3200-3600 cm⁻¹ due to hydrogen bonding. N-H is also in this range but usually sharper.",
      points: 10,
      difficulty: "easy",
      basedOn: [topic.mustKnow[0]],
      category: "IR Spectroscopy"
    },
    {
      question: "Explain the n+1 rule in ¹H NMR spectroscopy.",
      type: "short-answer",
      correctAnswer: "A proton with n equivalent neighboring protons will show n+1 peaks. For example, CH₂CH₃ shows triplet (n=2, so 2+1=3 peaks) and quartet (n=3, so 3+1=4 peaks).",
      explanation: "The splitting pattern indicates the number of equivalent neighboring protons. n neighbors → n+1 peaks.",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[1]],
      category: "Splitting Patterns"
    },
    {
      question: "What is the difference between DEPT-90 and DEPT-135 in ¹³C NMR?",
      type: "multiple-choice",
      options: [
        "DEPT-90 shows CH only, DEPT-135 shows CH and CH₃ positive, CH₂ negative",
        "DEPT-135 shows CH only, DEPT-90 shows all carbons",
        "No difference",
        "DEPT-90 shows quaternary carbons only"
      ],
      correctAnswer: "DEPT-90 shows CH only, DEPT-135 shows CH and CH₃ positive, CH₂ negative",
      explanation: "DEPT experiments distinguish CH, CH₂, CH₃, and quaternary carbons. DEPT-90 shows only CH. DEPT-135 shows CH/CH₃ up, CH₂ down.",
      points: 15,
      difficulty: "hard",
      basedOn: [topic.mustKnow[2]],
      category: "DEPT NMR"
    }
  ],
  "alcohols": (topic) => [
    {
      question: "What is the product when 1-propanol is oxidized with PCC?",
      type: "multiple-choice",
      options: ["Propanal", "Propanoic acid", "Propanone", "No reaction"],
      correctAnswer: "Propanal",
      explanation: "PCC (pyridinium chlorochromate) oxidizes primary alcohols to aldehydes and stops there. It does not further oxidize to carboxylic acids.",
      points: 10,
      difficulty: "medium",
      basedOn: [topic.mustKnow[0], topic.mustKnow[1]],
      category: "Oxidation"
    },
    {
      question: "Which reagent oxidizes a primary alcohol directly to a carboxylic acid?",
      type: "multiple-choice",
      options: ["PCC", "Jones reagent (CrO₃/H₂SO₄)", "Swern", "DMP"],
      correctAnswer: "Jones reagent (CrO₃/H₂SO₄)",
      explanation: "Jones reagent (CrO₃ in H₂SO₄) oxidizes primary alcohols all the way to carboxylic acids. PCC stops at aldehyde.",
      points: 10,
      difficulty: "medium",
      basedOn: [topic.mustKnow[1]],
      category: "Oxidation Reagents"
    },
    {
      question: "Predict the product: [Show alcohol] + TsCl/pyridine → ?",
      type: "synthesis",
      correctAnswer: "Tosylate ester. TsCl converts OH to OTs, creating an excellent leaving group for SN2/E2 reactions.",
      explanation: "Tosyl chloride (TsCl) with pyridine converts alcohols to tosylates (OTs), which are excellent leaving groups for substitution/elimination reactions.",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[2]],
      category: "Leaving Group Formation"
    },
    {
      question: "Why are protecting groups necessary in multi-step synthesis involving alcohols?",
      type: "short-answer",
      correctAnswer: "Protecting groups prevent unwanted reactions (oxidation, reduction, substitution) at the OH group while other parts of the molecule are modified, then can be removed later.",
      explanation: "Alcohols are reactive and can interfere with other transformations. Protecting groups (like TBDMS) temporarily block reactivity, then are removed when needed.",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[3]],
      category: "Protecting Groups"
    },
    {
      question: "Predict the major product: [Show alcohol] + H₂SO₄/heat → ?",
      type: "synthesis",
      correctAnswer: "Alkene via E1 dehydration. Follows Zaitsev's rule (more substituted alkene). May show carbocation rearrangements.",
      explanation: "Acid-catalyzed dehydration follows E1 mechanism. Forms more substituted alkene (Zaitsev product). Carbocation rearrangements possible.",
      points: 15,
      difficulty: "hard",
      basedOn: [topic.mustKnow[4]],
      category: "Dehydration"
    },
    {
      question: "What is the difference between PCC and Jones reagent in alcohol oxidation?",
      type: "multiple-choice",
      options: [
        "PCC stops at aldehyde, Jones goes to acid",
        "Jones stops at aldehyde, PCC goes to acid",
        "Both give the same product",
        "PCC only works for secondary alcohols"
      ],
      correctAnswer: "PCC stops at aldehyde, Jones goes to acid",
      explanation: "PCC oxidizes primary alcohols to aldehydes and stops. Jones reagent (CrO₃/H₂SO₄) continues oxidation to carboxylic acids.",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[1]],
      category: "Reagent Comparison"
    },
    {
      question: "Design a synthesis: Convert [alcohol] to [target] using protecting groups if needed.",
      type: "synthesis",
      correctAnswer: "Step-by-step synthesis using protecting groups to prevent unwanted reactions at OH during other transformations.",
      explanation: "Use protecting groups strategically to block OH reactivity during other steps, then deprotect when needed.",
      points: 20,
      difficulty: "hard",
      basedOn: [topic.mustKnow[3]],
      category: "Synthesis Planning"
    },
    {
      question: "Which alcohol cannot be oxidized?",
      type: "multiple-choice",
      options: ["Primary alcohol", "Secondary alcohol", "Tertiary alcohol", "All can be oxidized"],
      correctAnswer: "Tertiary alcohol",
      explanation: "Tertiary alcohols have no α-hydrogens and cannot be oxidized. Primary → aldehyde/acid, secondary → ketone.",
      points: 10,
      difficulty: "easy",
      basedOn: [topic.mustKnow[0]],
      category: "Oxidation Limits"
    }
  ],
  "ethers-epoxides": (topic) => [
    {
      question: "Predict the product: [Show alkoxide] + [Show alkyl halide] → ?",
      type: "synthesis",
      correctAnswer: "Ether via Williamson ether synthesis (SN2 mechanism). Alkoxide attacks alkyl halide.",
      explanation: "Williamson ether synthesis: alkoxide (RO⁻) + alkyl halide → ether via SN2. Primary halides work best.",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[0]],
      category: "Williamson Synthesis"
    },
    {
      question: "What is the major product when an epoxide opens under basic conditions?",
      type: "multiple-choice",
      options: [
        "Nucleophile attacks more substituted carbon",
        "Nucleophile attacks less substituted carbon",
        "No reaction",
        "Depends on the epoxide"
      ],
      correctAnswer: "Nucleophile attacks less substituted carbon",
      explanation: "Under basic conditions, nucleophile attacks less substituted carbon (SN2-like). Under acidic conditions, attacks more substituted carbon.",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[1]],
      category: "Epoxide Opening"
    },
    {
      question: "What is the stereochemistry of epoxide opening?",
      type: "multiple-choice",
      options: ["Syn addition", "Anti addition", "No stereoselectivity", "Depends on conditions"],
      correctAnswer: "Anti addition",
      explanation: "Epoxide opening is always anti (trans-diaxial). Nucleophile and leaving group end up trans to each other.",
      points: 10,
      difficulty: "medium",
      basedOn: [topic.mustKnow[2]],
      category: "Stereochemistry"
    },
    {
      question: "Predict the product: [Show epoxide] + H⁺/ROH → ?",
      type: "synthesis",
      correctAnswer: "Alkoxy alcohol. Under acidic conditions, nucleophile attacks more substituted carbon of protonated epoxide.",
      explanation: "Acid protonates epoxide, making it more electrophilic. Nucleophile attacks more substituted carbon (more stable carbocation-like character).",
      points: 15,
      difficulty: "hard",
      basedOn: [topic.mustKnow[1]],
      category: "Acidic Opening"
    },
    {
      question: "Why does Williamson ether synthesis require a primary alkyl halide?",
      type: "short-answer",
      correctAnswer: "SN2 mechanism requires unhindered backside attack. Primary halides are least sterically hindered. Tertiary halides would favor elimination instead.",
      explanation: "SN2 requires backside attack, which is hindered in secondary/tertiary substrates. Primary halides allow clean SN2 to form ethers.",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[0]],
      category: "Mechanism Understanding"
    },
    {
      question: "What happens when an ether is treated with HBr?",
      type: "multiple-choice",
      options: [
        "No reaction",
        "Forms alkyl halides",
        "Forms alcohols",
        "Forms alkenes"
      ],
      correctAnswer: "Forms alkyl halides",
      explanation: "Strong acids (HBr, HI) cleave ethers. Mechanism depends on substitution, but typically gives alkyl halides.",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[3]],
      category: "Ether Cleavage"
    },
    {
      question: "Design a synthesis: Convert [alcohol] to [target ether] using Williamson synthesis.",
      type: "synthesis",
      correctAnswer: "Convert one alcohol to alkoxide, other to alkyl halide, then combine via SN2.",
      explanation: "Williamson synthesis requires alkoxide and alkyl halide. Plan which becomes which based on substitution.",
      points: 18,
      difficulty: "hard",
      basedOn: [topic.mustKnow[0]],
      category: "Synthesis Planning"
    },
    {
      question: "Compare epoxide opening under basic vs acidic conditions.",
      type: "short-answer",
      correctAnswer: "Basic: nucleophile attacks less substituted C (SN2-like). Acidic: nucleophile attacks more substituted C (carbocation-like). Both give anti addition.",
      explanation: "Basic conditions favor SN2 at less substituted carbon. Acidic conditions protonate epoxide, favoring attack at more substituted carbon.",
      points: 15,
      difficulty: "hard",
      basedOn: [topic.mustKnow[1]],
      category: "Condition Comparison"
    }
  ],
  "carbonyls-addition": (topic) => [
    {
      question: "Predict the product: [Show aldehyde] + RMgBr → ?",
      type: "synthesis",
      correctAnswer: "Secondary alcohol. Grignard adds to carbonyl, then H₃O⁺ workup gives alcohol.",
      explanation: "Grignard reagents add to aldehydes/ketones to form alcohols. Aldehyde + R'MgBr → secondary alcohol after workup.",
      points: 15,
      difficulty: "hard",
      basedOn: [topic.mustKnow[1]],
      category: "Grignard Addition"
    },
    {
      question: "Which is more reactive: aldehyde or ketone?",
      type: "multiple-choice",
      options: ["Aldehyde", "Ketone", "Equal reactivity", "Depends on substituents"],
      correctAnswer: "Aldehyde",
      explanation: "Aldehydes are more reactive than ketones due to less steric hindrance (one R vs two R groups) and electronic effects.",
      points: 10,
      difficulty: "easy",
      basedOn: [topic.mustKnow[0]],
      category: "Reactivity"
    },
    {
      question: "What is the product of aldehyde + primary amine?",
      type: "multiple-choice",
      options: ["Imine", "Enamine", "Amide", "No reaction"],
      correctAnswer: "Imine",
      explanation: "Aldehyde/ketone + primary amine → imine (C=N) via hemiaminal intermediate. Secondary amine → enamine.",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[2]],
      category: "Imine Formation"
    },
    {
      question: "What is the purpose of acetal formation?",
      type: "multiple-choice",
      options: [
        "To protect carbonyl from nucleophiles",
        "To activate carbonyl",
        "To reduce carbonyl",
        "No purpose"
      ],
      correctAnswer: "To protect carbonyl from nucleophiles",
      explanation: "Acetals protect aldehydes/ketones from nucleophiles, bases, and reducing agents. Stable to these conditions, removed with aqueous acid.",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[3]],
      category: "Protection"
    },
    {
      question: "Predict the product: [Show ketone] + NaBH₄ → ?",
      type: "synthesis",
      correctAnswer: "Secondary alcohol. NaBH₄ reduces ketones to secondary alcohols via hydride addition.",
      explanation: "NaBH₄ adds hydride to carbonyl, reducing ketones to secondary alcohols and aldehydes to primary alcohols.",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[1]],
      category: "Reduction"
    },
    {
      question: "What is the difference between imine and enamine?",
      type: "short-answer",
      correctAnswer: "Imine: C=N bond, formed from aldehyde/ketone + primary amine. Enamine: C-N with adjacent C=C, formed from aldehyde/ketone + secondary amine.",
      explanation: "Imines have C=N double bond. Enamines have C-N single bond with adjacent C=C double bond. Different amine types give different products.",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[2]],
      category: "Conceptual"
    },
    {
      question: "Design a synthesis: Convert [aldehyde] to [target] using Grignard and protecting groups.",
      type: "synthesis",
      correctAnswer: "Protect aldehyde as acetal, perform other reactions, then deprotect and use Grignard to add carbon chain.",
      explanation: "Use acetal protection to block aldehyde reactivity during other steps, then deprotect and use Grignard for carbon-carbon bond formation.",
      points: 20,
      difficulty: "hard",
      basedOn: [topic.mustKnow[1], topic.mustKnow[3]],
      category: "Synthesis Planning"
    },
    {
      question: "Why do aldehydes react faster than ketones with nucleophiles?",
      type: "short-answer",
      correctAnswer: "Aldehydes have less steric hindrance (one R group vs two) and are more electrophilic due to less electron donation from substituents.",
      explanation: "Steric factors: one R group is less crowded. Electronic factors: two alkyl groups in ketones donate electrons, reducing electrophilicity.",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[0]],
      category: "Reactivity Explanation"
    }
  ],
  "carboxylic-acids-derivatives": (topic) => [
    {
      question: "Rank the following in order of reactivity toward nucleophilic acyl substitution: acid chloride, ester, amide, carboxylic acid.",
      type: "multiple-choice",
      options: [
        "acid chloride > ester > carboxylic acid > amide",
        "amide > acid chloride > ester > carboxylic acid",
        "All equal",
        "carboxylic acid > ester > amide > acid chloride"
      ],
      correctAnswer: "acid chloride > ester > carboxylic acid > amide",
      explanation: "Reactivity ladder: acid chloride (best leaving group Cl⁻) > ester > carboxylic acid > amide (worst leaving group NH₂⁻).",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[0]],
      category: "Reactivity Ladder"
    },
    {
      question: "What is the mechanism of nucleophilic acyl substitution?",
      type: "multiple-choice",
      options: [
        "Addition-elimination (two steps)",
        "SN2 (one step)",
        "E2 elimination",
        "Free radical"
      ],
      correctAnswer: "Addition-elimination (two steps)",
      explanation: "Nucleophilic acyl substitution: nucleophile attacks carbonyl → tetrahedral intermediate → leaving group expelled. Two-step process, NOT like aldehyde/ketone addition.",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[1]],
      category: "Mechanism"
    },
    {
      question: "Predict the product: [Show acid chloride] + ROH/pyridine → ?",
      type: "synthesis",
      correctAnswer: "Ester. Acid chloride + alcohol → ester via nucleophilic acyl substitution. Pyridine neutralizes HCl.",
      explanation: "Acid chlorides react with alcohols to form esters. Pyridine acts as base to neutralize HCl byproduct.",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[2]],
      category: "Ester Formation"
    },
    {
      question: "What happens when a β-ketoacid is heated?",
      type: "multiple-choice",
      options: [
        "Forms ketone + CO₂",
        "Forms carboxylic acid",
        "No reaction",
        "Forms alkene"
      ],
      correctAnswer: "Forms ketone + CO₂",
      explanation: "β-Ketoacids and malonic acids undergo decarboxylation on heating, losing CO₂ to form ketones or carboxylic acids.",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[3]],
      category: "Decarboxylation"
    },
    {
      question: "Why are β-dicarbonyls acidic?",
      type: "short-answer",
      correctAnswer: "The enolate formed from deprotonation is stabilized by resonance with the adjacent carbonyl, making the α-H more acidic (pKa ~9-13).",
      explanation: "Enolate resonance delocalizes negative charge onto oxygen, stabilizing the conjugate base and increasing acidity.",
      points: 15,
      difficulty: "hard",
      basedOn: [topic.mustKnow[3]],
      category: "Acidity"
    },
    {
      question: "Convert carboxylic acid to amide. Show the best pathway.",
      type: "synthesis",
      correctAnswer: "Acid → acid chloride (SOCl₂) → amide (NH₃). Direct conversion is difficult, so go through acid chloride.",
      explanation: "Carboxylic acids don't directly form amides well. Convert to acid chloride first, then react with ammonia/amine.",
      points: 15,
      difficulty: "hard",
      basedOn: [topic.mustKnow[2]],
      category: "Conversion"
    },
    {
      question: "What is transesterification?",
      type: "short-answer",
      correctAnswer: "Exchange of alkoxide groups in esters. Ester + different alcohol + acid catalyst → new ester + original alcohol.",
      explanation: "Transesterification swaps the OR group of an ester. Requires acid catalyst and excess of new alcohol.",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[2]],
      category: "Transesterification"
    },
    {
      question: "How can you distinguish carboxylic acid from ester using IR?",
      type: "multiple-choice",
      options: [
        "Acid has broad O-H ~3000, ester doesn't",
        "Ester has O-H, acid doesn't",
        "No difference",
        "Acid has C=O at different frequency"
      ],
      correctAnswer: "Acid has broad O-H ~3000, ester doesn't",
      explanation: "Carboxylic acids show broad O-H stretch ~3000 cm⁻¹. Esters show C=O ~1735 but no O-H. Both show C=O but acids have additional O-H.",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[4]],
      category: "Spectroscopy"
    }
  ],
  "enolates-aldol-claisen": (topic) => [
    {
      question: "What is the pKa of the α-hydrogen in a ketone?",
      type: "multiple-choice",
      options: ["~20", "~25", "~35", "~50"],
      correctAnswer: "~20",
      explanation: "α-H's in ketones have pKa ~20 due to enolate stabilization. Esters ~25. Much more acidic than typical C-H bonds (~50).",
      points: 10,
      difficulty: "medium",
      basedOn: [topic.mustKnow[0]],
      category: "Acidity"
    },
    {
      question: "What is the difference between kinetic and thermodynamic enolate?",
      type: "short-answer",
      correctAnswer: "Kinetic enolate: LDA/low temp, attacks less substituted α-C. Thermodynamic: strong base/high temp, attacks more substituted α-C (more stable enolate).",
      explanation: "Kinetic control favors faster formation (less substituted). Thermodynamic control favors more stable product (more substituted).",
      points: 15,
      difficulty: "hard",
      basedOn: [topic.mustKnow[1]],
      category: "Enolate Control"
    },
    {
      question: "Predict the product: [Show aldehyde] + [Show aldehyde] + base → ?",
      type: "synthesis",
      correctAnswer: "Aldol product (β-hydroxy carbonyl). Enolate from one aldehyde attacks carbonyl of another, then protonation gives aldol.",
      explanation: "Aldol reaction: enolate + carbonyl → β-hydroxy carbonyl. Can be intermolecular or intramolecular.",
      points: 18,
      difficulty: "hard",
      basedOn: [topic.mustKnow[2]],
      category: "Aldol Reaction"
    },
    {
      question: "What is required for Claisen condensation?",
      type: "multiple-choice",
      options: [
        "Two α-H's, matching alkoxide base, full equivalent of base",
        "One α-H, any base",
        "No α-H's needed",
        "Acid catalyst only"
      ],
      correctAnswer: "Two α-H's, matching alkoxide base, full equivalent of base",
      explanation: "Claisen requires: 2 α-H's (one for enolate, one for second deprotonation), matching alkoxide (R'O⁻ for R'CO₂R'), full equivalent of base (consumed in second deprotonation).",
      points: 15,
      difficulty: "hard",
      basedOn: [topic.mustKnow[3]],
      category: "Claisen Condensation"
    },
    {
      question: "What is Michael addition?",
      type: "short-answer",
      correctAnswer: "Enolate (donor) + α,β-unsaturated carbonyl (acceptor) → 1,4-addition. Forms new C-C bond β to carbonyl via conjugate addition.",
      explanation: "Michael addition is conjugate addition of enolates to α,β-unsaturated carbonyls. Forms 1,4-addition product (not 1,2-addition).",
      points: 15,
      difficulty: "hard",
      basedOn: [topic.mustKnow[4]],
      category: "Michael Addition"
    },
    {
      question: "Predict the product: [Show ester] + [Show ester] + NaOEt → ?",
      type: "synthesis",
      correctAnswer: "β-Ketoester via Claisen condensation. Enolate attacks ester carbonyl, then deprotonation gives β-ketoester.",
      explanation: "Claisen condensation: two esters combine to form β-ketoester. Requires matching alkoxide base and full equivalent.",
      points: 18,
      difficulty: "hard",
      basedOn: [topic.mustKnow[3]],
      category: "Claisen"
    },
    {
      question: "Design a synthesis: Build C-C bond using aldol reaction.",
      type: "synthesis",
      correctAnswer: "Use aldol to form β-hydroxy carbonyl, then dehydrate to α,β-unsaturated carbonyl if needed.",
      explanation: "Aldol forms C-C bonds between α-carbon and carbonyl carbon. Can be used in synthesis to build carbon chains.",
      points: 20,
      difficulty: "hard",
      basedOn: [topic.mustKnow[2]],
      category: "Synthesis Planning"
    },
    {
      question: "Why is LDA used for kinetic enolate formation?",
      type: "short-answer",
      correctAnswer: "LDA is strong, non-nucleophilic base. Strong enough to form enolate completely, non-nucleophilic so it doesn't attack carbonyl. Low temp favors kinetic product.",
      explanation: "LDA (lithium diisopropylamide) is strong enough to deprotonate but bulky and non-nucleophilic. Low temperature favors kinetic control.",
      points: 15,
      difficulty: "hard",
      basedOn: [topic.mustKnow[1]],
      category: "Base Selection"
    }
  ],
  "aromatic-chemistry": (topic) => [
    {
      question: "Is the following compound aromatic? [Show structure] Apply Hückel's rule.",
      type: "multiple-choice",
      options: ["Aromatic", "Antiaromatic", "Nonaromatic", "Cannot determine"],
      correctAnswer: "Aromatic",
      explanation: "Hückel's rule: 4n+2 π electrons, planar, cyclic, conjugated. Check if structure meets all criteria.",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[0]],
      category: "Aromaticity"
    },
    {
      question: "Predict the major product: [Show aromatic] + HNO₃/H₂SO₄ → ?",
      type: "synthesis",
      correctAnswer: "Nitro-substituted aromatic. Nitration adds NO₂ group. Position depends on existing substituents (directing effects).",
      explanation: "Nitration: HNO₃/H₂SO₄ adds NO₂. Follows directing effects of existing groups (ortho/para or meta directors).",
      points: 15,
      difficulty: "hard",
      basedOn: [topic.mustKnow[2], topic.mustKnow[3]],
      category: "EAS Nitration"
    },
    {
      question: "Which group is an ortho/para director?",
      type: "multiple-choice",
      options: ["NO₂", "CN", "OH", "C=O"],
      correctAnswer: "OH",
      explanation: "Activating groups (OH, OR, NH₂, alkyl) are ortho/para directors. Deactivating groups (NO₂, CN, C=O) are meta directors (except halogens).",
      points: 10,
      difficulty: "easy",
      basedOn: [topic.mustKnow[2]],
      category: "Directing Effects"
    },
    {
      question: "Explain the EAS mechanism step-by-step.",
      type: "short-answer",
      correctAnswer: "1) Electrophile attacks aromatic ring → σ-complex (arenium ion, sp³ carbon), 2) Loss of H⁺ regenerates aromaticity. Rate-determining step is σ-complex formation.",
      explanation: "EAS is two-step: electrophile addition forms σ-complex (breaks aromaticity), then H⁺ loss restores aromaticity. First step is slow.",
      points: 15,
      difficulty: "hard",
      basedOn: [topic.mustKnow[1]],
      category: "Mechanism"
    },
    {
      question: "Design a synthesis: Convert benzene to [target] using EAS reactions. Consider order of steps.",
      type: "synthesis",
      correctAnswer: "Plan sequence: activating groups first (faster), then deactivating. Consider directing effects to get correct substitution pattern.",
      explanation: "Order matters! Activating groups go first, then deactivating. Plan to avoid wrong substitution patterns.",
      points: 20,
      difficulty: "hard",
      basedOn: [topic.mustKnow[4]],
      category: "Synthesis Planning"
    },
    {
      question: "What is Friedel-Crafts acylation?",
      type: "short-answer",
      correctAnswer: "RCOCl + AlCl₃ + aromatic → ketone. Acyl group adds to aromatic ring. No rearrangement (unlike alkylation).",
      explanation: "Friedel-Crafts acylation uses acid chloride + Lewis acid to add acyl group. Gives ketone product. No carbocation rearrangements.",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[3]],
      category: "Friedel-Crafts"
    },
    {
      question: "Why do meta directors deactivate the ring?",
      type: "short-answer",
      correctAnswer: "Meta directors withdraw electrons, making ring less nucleophilic. They stabilize meta σ-complex better than ortho/para, so meta product forms.",
      explanation: "Electron-withdrawing groups reduce ring nucleophilicity and stabilize meta σ-complex more than ortho/para positions.",
      points: 15,
      difficulty: "hard",
      basedOn: [topic.mustKnow[2]],
      category: "Directing Effects"
    },
    {
      question: "Predict product: [Show substituted aromatic] + Br₂/FeBr₃ → ?",
      type: "synthesis",
      correctAnswer: "Brominated product. Position depends on existing substituent: ortho/para for activating groups, meta for deactivating (except halogens).",
      explanation: "Halogenation: Br₂/FeBr₃ adds Br. Follows directing effects. Activating → ortho/para, deactivating → meta (except halogens are ortho/para despite deactivating).",
      points: 15,
      difficulty: "hard",
      basedOn: [topic.mustKnow[2], topic.mustKnow[3]],
      category: "Halogenation"
    }
  ],
  "amines": (topic) => [
    {
      question: "Rank the following in order of basicity: aniline, methylamine, ammonia, dimethylamine.",
      type: "multiple-choice",
      options: [
        "aniline < ammonia < methylamine < dimethylamine",
        "dimethylamine < methylamine < ammonia < aniline",
        "All equal",
        "ammonia < aniline < methylamine < dimethylamine"
      ],
      correctAnswer: "aniline < ammonia < methylamine < dimethylamine",
      explanation: "Aromatic amines (aniline) are weakest due to resonance. Aliphatic amines are stronger. More alkyl groups increase basicity (inductive effect).",
      points: 15,
      difficulty: "hard",
      basedOn: [topic.mustKnow[1]],
      category: "Basicity"
    },
    {
      question: "What is the product of reductive amination?",
      type: "synthesis",
      correctAnswer: "Amine. Carbonyl + amine → imine → reduction (NaBH₄, NaBH₃CN, H₂/Pd) → amine.",
      explanation: "Reductive amination: carbonyl + amine forms imine, then reduction gives amine. Versatile for 1°, 2°, 3° amine synthesis.",
      points: 15,
      difficulty: "hard",
      basedOn: [topic.mustKnow[2]],
      category: "Reductive Amination"
    },
    {
      question: "Why is aniline less basic than aliphatic amines?",
      type: "short-answer",
      correctAnswer: "Resonance delocalizes the lone pair on nitrogen into the aromatic ring, making it less available for protonation, reducing basicity.",
      explanation: "The lone pair on aniline's nitrogen is delocalized into the benzene ring via resonance, reducing its availability for protonation.",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[1]],
      category: "Basicity Explanation"
    },
    {
      question: "Predict the product: [Show acid chloride] + RNH₂ → ?",
      type: "synthesis",
      correctAnswer: "Amide. Acid chloride + amine → amide via nucleophilic acyl substitution.",
      explanation: "Acid chlorides react with amines to form amides. This is nucleophilic acyl substitution, not simple addition.",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[3]],
      category: "Amide Formation"
    },
    {
      question: "What is the pKaH of a typical aliphatic amine?",
      type: "multiple-choice",
      options: ["~4", "~9", "~14", "~20"],
      correctAnswer: "~9",
      explanation: "Aliphatic amines have pKaH ~9-10, making them weak bases. Aromatic amines are weaker (pKaH ~4-5).",
      points: 10,
      difficulty: "easy",
      basedOn: [topic.mustKnow[1]],
      category: "Basicity Values"
    },
    {
      question: "Design a synthesis: Convert [carbonyl] to [target amine] using reductive amination.",
      type: "synthesis",
      correctAnswer: "Carbonyl + appropriate amine → imine → reduction → amine. Choose amine type (1°, 2°, 3°) based on target.",
      explanation: "Use reductive amination: form imine from carbonyl and amine, then reduce to amine. Versatile for different amine types.",
      points: 18,
      difficulty: "hard",
      basedOn: [topic.mustKnow[2]],
      category: "Synthesis Planning"
    },
    {
      question: "Why are amides weak bases?",
      type: "short-answer",
      correctAnswer: "Resonance delocalizes the N lone pair into the C=O, making it unavailable for protonation. pKaH ~0-1, very weak bases.",
      explanation: "Amide resonance: N lone pair delocalizes into C=O π system, reducing basicity compared to amines.",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[3]],
      category: "Amide Basicity"
    },
    {
      question: "How can you distinguish amine from amide using IR?",
      type: "multiple-choice",
      options: [
        "Amine has N-H ~3300, amide has N-H ~3300 + C=O ~1680",
        "No difference",
        "Amide has no N-H",
        "Amine has C=O"
      ],
      correctAnswer: "Amine has N-H ~3300, amide has N-H ~3300 + C=O ~1680",
      explanation: "Both show N-H stretch ~3300-3500. Amides also show C=O ~1680. Use both signals to distinguish.",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[4]],
      category: "Spectroscopy"
    },
    {
      question: "Identify the functional group responsible for the IR absorption at 1715 cm⁻¹.",
      type: "multiple-choice",
      options: ["O-H", "C=O", "C=C", "C≡N"],
      correctAnswer: "C=O",
      explanation: "Carbonyl groups (C=O) absorb around 1650-1750 cm⁻¹. 1715 cm⁻¹ is typical for ketones and aldehydes.",
      points: 10,
      difficulty: "easy",
      basedOn: [topic.mustKnow[0]],
      category: "IR Spectroscopy"
    },
    {
      question: "A molecule with molecular formula C₆H₁₂O has how many degrees of unsaturation?",
      type: "multiple-choice",
      options: ["0", "1", "2", "3"],
      correctAnswer: "1",
      explanation: "DBE = C + 1 - H/2 - X/2 + N/2 = 6 + 1 - 12/2 - 0/2 + 0/2 = 7 - 6 = 1. One double bond or ring.",
      points: 10,
      difficulty: "medium",
      basedOn: [topic.mustKnow[3]],
      category: "Degree of Unsaturation"
    },
    {
      question: "Predict the ¹H NMR spectrum: [Show structure]. Include chemical shifts, integration, and splitting patterns.",
      type: "short-answer",
      correctAnswer: "Describe each signal: chemical shift (ppm), integration (number of H's), splitting pattern (n+1 rule), and assignment.",
      explanation: "Analyze each unique proton environment. Consider chemical shift (deshielding), integration (H count), and coupling (neighboring H's).",
      points: 20,
      difficulty: "hard",
      basedOn: [topic.mustKnow[1]],
      category: "Proton NMR"
    },
    {
      question: "How many unique carbon signals would appear in the ¹³C NMR spectrum of [Show structure]?",
      type: "multiple-choice",
      options: ["3", "4", "5", "6"],
      correctAnswer: "5",
      explanation: "Count unique carbon environments (different chemical environments). Symmetry reduces the number of signals.",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[2]],
      category: "Carbon-13 NMR"
    },
    {
      question: "Determine the structure from the following data: IR: 1715 cm⁻¹; ¹H NMR: δ 2.1 (s, 3H), 2.3 (s, 3H); ¹³C NMR: 3 signals.",
      type: "synthesis",
      correctAnswer: "Acetone (CH₃COCH₃): C=O at 1715, two equivalent methyl groups (2.1 and 2.3 ppm), 3 unique carbons.",
      explanation: "C=O indicates carbonyl. Two singlet methyl groups suggest ketone. 3 carbon signals confirms symmetric ketone.",
      points: 20,
      difficulty: "hard",
      basedOn: [topic.mustKnow[4]],
      category: "Structure Determination"
    },
    {
      question: "What does a broad peak at 3300 cm⁻¹ in IR indicate?",
      type: "multiple-choice",
      options: ["C-H stretch", "O-H stretch", "C=O stretch", "C≡N stretch"],
      correctAnswer: "O-H stretch",
      explanation: "O-H stretches appear broad around 3200-3600 cm⁻¹ due to hydrogen bonding. N-H is also in this range but usually sharper.",
      points: 10,
      difficulty: "easy",
      basedOn: [topic.mustKnow[0]],
      category: "IR Spectroscopy"
    },
    {
      question: "Explain the n+1 rule in ¹H NMR spectroscopy.",
      type: "short-answer",
      correctAnswer: "A proton with n equivalent neighboring protons will show n+1 peaks. For example, CH₂CH₃ shows triplet (n=2, so 2+1=3 peaks) and quartet (n=3, so 3+1=4 peaks).",
      explanation: "The splitting pattern indicates the number of equivalent neighboring protons. n neighbors → n+1 peaks.",
      points: 12,
      difficulty: "medium",
      basedOn: [topic.mustKnow[1]],
      category: "Splitting Patterns"
    },
    {
      question: "What is the difference between DEPT-90 and DEPT-135 in ¹³C NMR?",
      type: "multiple-choice",
      options: [
        "DEPT-90 shows CH only, DEPT-135 shows CH and CH₃ positive, CH₂ negative",
        "DEPT-135 shows CH only, DEPT-90 shows all carbons",
        "No difference",
        "DEPT-90 shows quaternary carbons only"
      ],
      correctAnswer: "DEPT-90 shows CH only, DEPT-135 shows CH and CH₃ positive, CH₂ negative",
      explanation: "DEPT experiments distinguish CH, CH₂, CH₃, and quaternary carbons. DEPT-90 shows only CH. DEPT-135 shows CH/CH₃ up, CH₂ down.",
      points: 15,
      difficulty: "hard",
      basedOn: [topic.mustKnow[2]],
      category: "DEPT NMR"
    }
  ]
};

// Generate comprehensive problem suggestions for any topic
function generateComprehensiveSuggestions(topicData: Topic): ProblemSuggestion[] {
  const suggestions: ProblemSuggestion[] = [];
  
  // Use topic-specific templates if available
  const templateProblems = PROBLEM_TEMPLATES[topicData.slug];
  if (templateProblems) {
    suggestions.push(...templateProblems(topicData));
  }
  
  // Generate additional problems from must-know items
  topicData.mustKnow.forEach((concept, idx) => {
    const conceptLower = concept.toLowerCase();
    const words = concept.split(" ");
    const mainTerm = words[0] + " " + (words[1] || "");
    
    // Naming/IUPAC problems
    if (conceptLower.includes("naming") || conceptLower.includes("iupac")) {
      suggestions.push({
        question: `What is the correct IUPAC name for a molecule with ${mainTerm}?`,
        type: "multiple-choice",
        options: [
          concept.substring(0, 50) + "...",
          concept.split(" ").reverse().slice(0, 5).join(" ") + "...",
          "Incorrect option 1",
          "Incorrect option 2"
        ],
        correctAnswer: concept.substring(0, 50),
        explanation: `Based on IUPAC rules: ${concept}`,
        points: 10,
        difficulty: idx < 2 ? "easy" : "medium",
        basedOn: [concept],
        category: "Naming"
      });
    }
    
    // Mechanism problems
    if (conceptLower.includes("mechanism") && topicData.hasMechanism) {
      suggestions.push({
        question: `Draw the complete mechanism for ${mainTerm}. Include all curved arrows, intermediates, and show stereochemistry where applicable.`,
        type: "mechanism",
        correctAnswer: `Mechanism involves: ${concept}`,
        explanation: `The mechanism for ${topicData.title} involves: ${concept}`,
        points: 18,
        difficulty: "hard",
        basedOn: [concept],
        category: "Mechanisms"
      });
    }
    
    // Stability/Energy problems
    if (conceptLower.includes("stability") || conceptLower.includes("energy") || conceptLower.includes("stable")) {
      suggestions.push({
        question: `Which factor most affects ${mainTerm}?`,
        type: "multiple-choice",
        options: [
          concept.substring(0, 40),
          concept.replace("stability", "reactivity").substring(0, 40),
          "Temperature only",
          "Concentration only"
        ],
        correctAnswer: concept.substring(0, 40),
        explanation: `${mainTerm} is primarily affected by: ${concept}`,
        points: 10,
        difficulty: "medium",
        basedOn: [concept],
        category: "Stability"
      });
    }
    
    // Reaction/Synthesis problems
    if (conceptLower.includes("reaction") || conceptLower.includes("synthesis") || conceptLower.includes("product")) {
      suggestions.push({
        question: `Predict the major product when [reactant] undergoes ${mainTerm}.`,
        type: "synthesis",
        correctAnswer: `Product: [product]. The reaction involves: ${concept}`,
        explanation: `For ${topicData.title}, ${concept}`,
        points: 15,
        difficulty: "hard",
        basedOn: [concept],
        category: "Synthesis"
      });
    }
    
    // Conceptual understanding problems
    if (conceptLower.includes("explain") || conceptLower.includes("why") || conceptLower.includes("difference")) {
      suggestions.push({
        question: `Explain ${mainTerm} in the context of ${topicData.title}.`,
        type: "short-answer",
        correctAnswer: concept,
        explanation: `Detailed explanation: ${concept}`,
        points: 12,
        difficulty: "medium",
        basedOn: [concept],
        category: "Conceptual"
      });
    }
  });
  
  // Add synthesis problems for mechanism topics
  if (topicData.hasMechanism) {
    suggestions.push({
      question: `Design a synthesis to convert [starting material] to [target molecule] using reactions from ${topicData.title}.`,
      type: "synthesis",
      correctAnswer: `Synthesis pathway: [step-by-step]. Key reactions: ${topicData.mustKnow.slice(0, 2).join(" and ")}`,
      explanation: `This synthesis uses concepts from ${topicData.title}: ${topicData.mustKnow.slice(0, 3).join(", ")}`,
      points: 20,
      difficulty: "hard",
      basedOn: topicData.mustKnow.slice(0, 3),
      category: "Synthesis Planning"
    });
  }
  
  // Remove duplicates and limit
  const uniqueSuggestions = suggestions.filter((s, idx, self) => 
    idx === self.findIndex(t => t.question === s.question)
  );
  
  return uniqueSuggestions.slice(0, 25); // Return up to 25 diverse problems
}

export default function ProfessorAssignmentCreator({ course, topic, onAssignmentCreated }: Props) {
  const [isProfessor, setIsProfessor] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>(topic || "");
  const [suggestions, setSuggestions] = useState<ProblemSuggestion[]>([]);
  const [selectedProblems, setSelectedProblems] = useState<HomeworkProblem[]>([]);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [filterDifficulty, setFilterDifficulty] = useState<"all" | "easy" | "medium" | "hard">("all");
  const [filterType, setFilterType] = useState<"all" | ProblemSuggestion["type"]>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [editingProblem, setEditingProblem] = useState<ProblemSuggestion | null>(null);

  const courseTopics = getCourseTopics(course);
  const currentTopic = selectedTopic ? findTopic(course, selectedTopic) : null;

  // Check if user is professor
  useEffect(() => {
    const saved = localStorage.getItem("orgopivy-is-professor");
    setIsProfessor(saved === "true");
  }, []);

  // Filter suggestions
  const filteredSuggestions = useMemo(() => {
    return suggestions.filter(s => {
      if (filterDifficulty !== "all" && s.difficulty !== filterDifficulty) return false;
      if (filterType !== "all" && s.type !== filterType) return false;
      if (filterCategory !== "all" && s.category !== filterCategory) return false;
      return true;
    });
  }, [suggestions, filterDifficulty, filterType, filterCategory]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(suggestions.map(s => s.category));
    return Array.from(cats).sort();
  }, [suggestions]);

  async function loadSuggestions() {
    if (!selectedTopic || !currentTopic) return;

    setGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      const generated = generateComprehensiveSuggestions(currentTopic);
      setSuggestions(generated);
      setGenerating(false);
    }, 1500);
  }

  useEffect(() => {
    if (selectedTopic && currentTopic) {
      loadSuggestions();
    }
  }, [selectedTopic]);

  function addProblem(suggestion: ProblemSuggestion) {
    const problem: HomeworkProblem = {
      id: `prof-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      question: suggestion.question,
      type: suggestion.type === "synthesis" ? "synthesis" : suggestion.type === "mechanism" ? "mechanism" : suggestion.type === "short-answer" ? "short-answer" : "multiple-choice",
      options: suggestion.options,
      correctAnswer: suggestion.correctAnswer,
      explanation: suggestion.explanation,
      points: suggestion.points,
      difficulty: suggestion.difficulty,
      topic: selectedTopic,
      courseId: course,
      rubric: {
        fullCredit: `Correctly demonstrates understanding of: ${suggestion.basedOn.join(", ")}`,
        partialCredit: [
          "Shows partial understanding but missing key concepts",
          "Correct approach but computational or conceptual errors",
          "Identifies some factors but not all"
        ],
        commonMistakes: [
          "Not considering all relevant factors",
          "Missing key concept from curriculum",
          "Incorrect application of rules or principles"
        ]
      }
    };

    setSelectedProblems(prev => [...prev, problem]);
  }

  function removeProblem(problemId: string) {
    setSelectedProblems(prev => prev.filter(p => p.id !== problemId));
  }

  function editProblem(problem: ProblemSuggestion) {
    setEditingProblem(problem);
  }

  function saveEditedProblem(edited: ProblemSuggestion) {
    // Find and update the problem in selectedProblems
    const problemIndex = selectedProblems.findIndex(p => p.question === editingProblem?.question);
    if (problemIndex !== -1) {
      const updated: HomeworkProblem = {
        ...selectedProblems[problemIndex],
        question: edited.question,
        options: edited.options,
        correctAnswer: edited.correctAnswer,
        explanation: edited.explanation,
        points: edited.points,
        difficulty: edited.difficulty
      };
      setSelectedProblems(prev => [
        ...prev.slice(0, problemIndex),
        updated,
        ...prev.slice(problemIndex + 1)
      ]);
    }
    setEditingProblem(null);
  }

  function createAssignment() {
    if (selectedProblems.length === 0) {
      alert("Please add at least one problem to the assignment.");
      return;
    }

    if (!assignmentTitle.trim()) {
      alert("Please enter an assignment title.");
      return;
    }

    const assignment = {
      id: `prof-assignment-${Date.now()}`,
      title: assignmentTitle,
      courseId: course,
      topic: selectedTopic,
      problems: selectedProblems,
      totalPoints: selectedProblems.reduce((sum, p) => sum + p.points, 0),
      createdAt: new Date().toISOString(),
      createdBy: "professor",
    };

    // Save assignment
    const savedAssignments = localStorage.getItem(`orgopivy-assignments-${course}`);
    const assignments = savedAssignments ? JSON.parse(savedAssignments) : [];
    assignments.push(assignment);
    localStorage.setItem(`orgopivy-assignments-${course}`, JSON.stringify(assignments));

    // Reset form
    setSelectedProblems([]);
    setAssignmentTitle("");
    setSuggestions([]);

    if (onAssignmentCreated) {
      onAssignmentCreated(assignment.id);
    }

    alert(`Assignment "${assignmentTitle}" created successfully!`);
  }

  function exportAssignment() {
    if (selectedProblems.length === 0) return;
    
    const assignmentData = {
      title: assignmentTitle || "Untitled Assignment",
      course: course,
      topic: selectedTopic,
      problems: selectedProblems.map((p, idx) => ({
        number: idx + 1,
        question: p.question,
        type: p.type,
        options: p.options,
        points: p.points,
        difficulty: p.difficulty
      })),
      totalPoints: selectedProblems.reduce((sum, p) => sum + p.points, 0)
    };

    const blob = new Blob([JSON.stringify(assignmentData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${assignmentTitle || "assignment"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!isProfessor) {
    return (
      <div className="card" style={{ padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 16, color: "var(--text)" }}>
          Professor Assignment Creator
        </div>
        <div className="subtle" style={{ fontSize: 15, marginBottom: 24 }}>
          This tool is for professors only. Enable professor mode to create graded assignments with AI-generated problem suggestions.
        </div>
        <button
          type="button"
          className="btn btnPrimary"
          onClick={() => {
            const confirm = window.confirm("Are you a professor? This will enable assignment creation features.");
            if (confirm) {
              localStorage.setItem("orgopivy-is-professor", "true");
              setIsProfessor(true);
            }
          }}
        >
          Enable Professor Mode
        </button>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: "var(--text)" }}>
              Create New Assignment - {course === "orgochem-1" ? "OrgoChem I" : "OrgoChem II"}
            </div>
            <div className="subtle" style={{ fontSize: 13 }}>
              AI-assisted problem generation with 20+ diverse problem types per topic
            </div>
          </div>
          <button
            type="button"
            className="btn"
            onClick={() => {
              localStorage.setItem("orgopivy-is-professor", "false");
              setIsProfessor(false);
            }}
            style={{ fontSize: 12 }}
          >
            Exit Professor Mode
          </button>
        </div>
      </div>

      {/* Topic Selection */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8, color: "var(--text)" }}>
          Select Topic
        </label>
        <select
          value={selectedTopic}
          onChange={(e) => {
            setSelectedTopic(e.target.value);
            setSuggestions([]);
            setFilterDifficulty("all");
            setFilterType("all");
            setFilterCategory("all");
          }}
          className="input"
          style={{ width: "100%", color: "var(--text)", background: "var(--panel)" }}
        >
          <option value="">Select a topic...</option>
          {courseTopics.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.title}
            </option>
          ))}
        </select>
        {currentTopic && (
          <div className="subtle" style={{ fontSize: 13, marginTop: 8 }}>
            {currentTopic.shortDesc} • {currentTopic.mustKnow.length} key concepts
          </div>
        )}
      </div>

      {/* Assignment Title */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8, color: "var(--text)" }}>
          Assignment Title
        </label>
        <input
          type="text"
          value={assignmentTitle}
          onChange={(e) => setAssignmentTitle(e.target.value)}
          placeholder="e.g., Homework 1: Alkanes and Naming"
          className="input"
          style={{ width: "100%", color: "var(--text)", background: "var(--panel)" }}
        />
      </div>

      {/* AI Suggestions with Filters */}
      {selectedTopic && currentTopic && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 12 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)" }}>
              Problem Suggestions ({filteredSuggestions.length} of {suggestions.length})
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value as any)}
                style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 12, background: "var(--panel)", color: "var(--text)" }}
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 12, background: "var(--panel)", color: "var(--text)" }}
              >
                <option value="all">All Types</option>
                <option value="multiple-choice">Multiple Choice</option>
                <option value="short-answer">Short Answer</option>
                <option value="synthesis">Synthesis</option>
                <option value="mechanism">Mechanism</option>
              </select>
              {categories.length > 0 && (
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 12, background: "var(--panel)", color: "var(--text)" }}
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              )}
              <button
                type="button"
                className="btn"
                onClick={loadSuggestions}
                disabled={generating}
                style={{ fontSize: 12, padding: "6px 12px" }}
              >
                {generating ? "Generating..." : "Refresh"}
              </button>
            </div>
          </div>

          {generating ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
              Generating comprehensive problem suggestions based on curriculum...
            </div>
          ) : filteredSuggestions.length > 0 ? (
            <div style={{ display: "grid", gap: 12, maxHeight: "600px", overflowY: "auto", paddingRight: 8 }}>
              {filteredSuggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: 16,
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    background: "var(--panel)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 11, padding: "4px 8px", borderRadius: 6, background: "var(--panel-2)", color: "var(--text)", textTransform: "uppercase", fontWeight: 600 }}>
                          {suggestion.type}
                        </span>
                        <span style={{ fontSize: 11, padding: "4px 8px", borderRadius: 6, background: suggestion.difficulty === "easy" ? "rgba(52, 199, 89, 0.1)" : suggestion.difficulty === "medium" ? "rgba(255, 149, 0, 0.1)" : "rgba(255, 59, 48, 0.1)", color: "var(--text)", fontWeight: 600 }}>
                          {suggestion.difficulty}
                        </span>
                        <span style={{ fontSize: 11, padding: "4px 8px", borderRadius: 6, background: "var(--panel-2)", color: "var(--text)", fontWeight: 600 }}>
                          {suggestion.points} pts
                        </span>
                        <span style={{ fontSize: 11, padding: "4px 8px", borderRadius: 6, background: "rgba(0, 122, 255, 0.1)", color: "var(--blue)", fontWeight: 600 }}>
                          {suggestion.category}
                        </span>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, color: "var(--text)", lineHeight: 1.5 }}>
                        {suggestion.question}
                      </div>
                      {suggestion.options && (
                        <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8, paddingLeft: 12 }}>
                          <div style={{ fontWeight: 600, marginBottom: 4 }}>Options:</div>
                          {suggestion.options.map((opt, i) => (
                            <div key={i} style={{ marginBottom: 2 }}>{String.fromCharCode(65 + i)}. {opt}</div>
                          ))}
                        </div>
                      )}
                      <div style={{ fontSize: 12, color: "var(--muted-2)", marginTop: 8 }}>
                        Based on: {suggestion.basedOn.slice(0, 2).join(", ")}
                        {suggestion.basedOn.length > 2 && ` +${suggestion.basedOn.length - 2} more`}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <button
                        type="button"
                        className="btn btnPrimary"
                        onClick={() => addProblem(suggestion)}
                        style={{ fontSize: 12, padding: "8px 16px", whiteSpace: "nowrap" }}
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        className="btn"
                        onClick={() => editProblem(suggestion)}
                        style={{ fontSize: 12, padding: "8px 16px", whiteSpace: "nowrap" }}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="subtle" style={{ padding: 20, textAlign: "center" }}>
              {suggestions.length === 0 ? "Select a topic and click 'Refresh' to generate problem suggestions" : "No problems match your filters. Try adjusting the filters."}
            </div>
          )}
        </div>
      )}

      {/* Selected Problems */}
      {selectedProblems.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)" }}>
              Selected Problems ({selectedProblems.length})
            </div>
            <button
              type="button"
              className="btn"
              onClick={exportAssignment}
              style={{ fontSize: 12, padding: "6px 12px" }}
            >
              Export JSON
            </button>
          </div>
          <div style={{ display: "grid", gap: 12, maxHeight: "400px", overflowY: "auto", paddingRight: 8 }}>
            {selectedProblems.map((problem, idx) => (
              <div
                key={problem.id}
                style={{
                  padding: 16,
                  border: "2px solid var(--blue)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--panel-2)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, padding: "4px 8px", borderRadius: 6, background: "var(--blue)", color: "white", fontWeight: 700 }}>
                        Problem {idx + 1}
                      </span>
                      <span style={{ fontSize: 11, padding: "4px 8px", borderRadius: 6, background: "var(--panel)", color: "var(--text)", fontWeight: 600 }}>
                        {problem.type}
                      </span>
                      <span style={{ fontSize: 11, padding: "4px 8px", borderRadius: 6, background: "var(--panel)", color: "var(--text)", fontWeight: 600 }}>
                        {problem.points} pts
                      </span>
                      <span style={{ fontSize: 11, padding: "4px 8px", borderRadius: 6, background: problem.difficulty === "easy" ? "rgba(52, 199, 89, 0.1)" : problem.difficulty === "medium" ? "rgba(255, 149, 0, 0.1)" : "rgba(255, 59, 48, 0.1)", color: "var(--text)", fontWeight: 600 }}>
                        {problem.difficulty}
                      </span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", lineHeight: 1.5 }}>
                      {problem.question}
                    </div>
                    {problem.options && (
                      <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 8, paddingLeft: 12 }}>
                        {problem.options.map((opt, i) => (
                          <div key={i}>{String.fromCharCode(65 + i)}. {opt}</div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => removeProblem(problem.id)}
                    style={{ fontSize: 12, padding: "6px 12px", color: "var(--red)" }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: 16, background: "var(--panel-2)", borderRadius: "var(--radius-md)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>
                Assignment Summary
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>
                {selectedProblems.length} problems • {selectedProblems.reduce((sum, p) => sum + p.points, 0)} total points
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
                Difficulty breakdown: {selectedProblems.filter(p => p.difficulty === "easy").length} easy, {selectedProblems.filter(p => p.difficulty === "medium").length} medium, {selectedProblems.filter(p => p.difficulty === "hard").length} hard
              </div>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--blue)" }}>
              {selectedProblems.reduce((sum, p) => sum + p.points, 0)} pts
            </div>
          </div>
        </div>
      )}

      {/* Create Button */}
      {selectedProblems.length > 0 && assignmentTitle && (
        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="button"
            className="btn btnPrimary"
            onClick={createAssignment}
            style={{ flex: 1, padding: 14 }}
          >
            Create Assignment ({selectedProblems.length} problems, {selectedProblems.reduce((sum, p) => sum + p.points, 0)} points)
          </button>
        </div>
      )}
    </div>
  );
}
