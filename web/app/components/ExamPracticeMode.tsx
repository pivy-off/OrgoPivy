"use client";

import { useState, useMemo, useEffect } from "react";
import ExamProblemSolver from "./ExamProblemSolver";
import { getCourseTopics, findTopic } from "../lib/curriculum";
import type { CourseId } from "../lib/curriculum";

type Problem = {
  id: string;
  question: string;
  type: "multiple-choice" | "short-answer" | "mechanism" | "synthesis";
  options?: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
};

type Props = {
  course: "orgochem-1" | "orgochem-2";
  topic?: string;
};

// Sample problems - in production, these would come from uploaded exam files
// Each topic should have 15 problems total
const SAMPLE_PROBLEMS: Record<string, Problem[]> = {
  "alkanes": [
    {
      id: "alk-1",
      question: "What is the IUPAC name for (CH3)2CHCH2CH3?",
      type: "multiple-choice",
      options: ["2-methylbutane", "3-methylbutane", "isopentane", "neopentane"],
      correctAnswer: "2-methylbutane",
      explanation: "The longest chain has 4 carbons (butane). The methyl group is on carbon 2, so it's 2-methylbutane.",
      points: 10
    },
    {
      id: "alk-2",
      question: "Which conformation of butane is most stable?",
      type: "multiple-choice",
      options: ["Eclipsed", "Gauche", "Anti", "Fully eclipsed"],
      correctAnswer: "Anti",
      explanation: "The anti conformation has the methyl groups 180° apart, minimizing steric interactions.",
      points: 10
    },
    {
      id: "alk-3",
      question: "What is the IUPAC name for CH3CH2CH(CH3)CH2CH3?",
      type: "multiple-choice",
      options: ["3-methylpentane", "2-methylpentane", "4-methylpentane", "ethylpropane"],
      correctAnswer: "3-methylpentane",
      explanation: "The longest chain has 5 carbons (pentane). Number from the end that gives the substituent the lowest number (3-methyl).",
      points: 10
    },
    {
      id: "alk-4",
      question: "In a Newman projection, which conformation has the highest energy?",
      type: "multiple-choice",
      options: ["Staggered anti", "Staggered gauche", "Eclipsed", "Fully eclipsed"],
      correctAnswer: "Fully eclipsed",
      explanation: "Fully eclipsed has the maximum torsional strain with all bonds aligned.",
      points: 10
    },
    {
      id: "alk-5",
      question: "What type of strain is present in cyclopropane?",
      type: "multiple-choice",
      options: ["Torsional strain only", "Angle strain only", "Both angle and torsional strain", "No strain"],
      correctAnswer: "Both angle and torsional strain",
      explanation: "Cyclopropane has severe angle strain (60° vs 109.5°) and torsional strain from eclipsed hydrogens.",
      points: 10
    },
    {
      id: "alk-6",
      question: "Which alkane has the highest boiling point?",
      type: "multiple-choice",
      options: ["Methane", "Ethane", "Propane", "Butane"],
      correctAnswer: "Butane",
      explanation: "Boiling point increases with molecular weight due to increased London dispersion forces.",
      points: 10
    },
    {
      id: "alk-7",
      question: "What is the degree of substitution for the carbon in (CH3)3CBr?",
      type: "multiple-choice",
      options: ["Primary", "Secondary", "Tertiary", "Quaternary"],
      correctAnswer: "Tertiary",
      explanation: "The carbon bonded to Br has three alkyl groups attached, making it tertiary.",
      points: 10
    },
    {
      id: "alk-8",
      question: "Which Newman projection represents the most stable conformation of ethane?",
      type: "multiple-choice",
      options: ["Eclipsed", "Staggered", "Gauche", "Anti"],
      correctAnswer: "Staggered",
      explanation: "Staggered conformation minimizes torsional strain by having hydrogens offset.",
      points: 10
    },
    {
      id: "alk-9",
      question: "What is the molecular formula for an alkane with 8 carbons?",
      type: "short-answer",
      correctAnswer: "C8H18",
      explanation: "Alkanes follow the formula CnH2n+2. For 8 carbons: C8H18.",
      points: 10
    },
    {
      id: "alk-10",
      question: "Which has more steric strain: gauche or anti conformation of butane?",
      type: "multiple-choice",
      options: ["Gauche", "Anti", "They are equal", "Cannot determine"],
      correctAnswer: "Gauche",
      explanation: "Gauche has methyl groups 60° apart, causing steric strain. Anti has them 180° apart with no steric strain.",
      points: 10
    },
    {
      id: "alk-11",
      question: "What is the IUPAC name for CH3(CH2)5CH3?",
      type: "multiple-choice",
      options: ["Hexane", "Heptane", "Octane", "Nonane"],
      correctAnswer: "Heptane",
      explanation: "This is a straight-chain alkane with 7 carbons, so it's heptane.",
      points: 10
    },
    {
      id: "alk-12",
      question: "In which conformation are the methyl groups closest together in butane?",
      type: "multiple-choice",
      options: ["Anti", "Gauche", "Eclipsed", "Fully eclipsed"],
      correctAnswer: "Fully eclipsed",
      explanation: "Fully eclipsed has all atoms aligned, bringing methyl groups closest together.",
      points: 10
    },
    {
      id: "alk-13",
      question: "What is the relationship between chain length and melting point in alkanes?",
      type: "short-answer",
      correctAnswer: "Increases with chain length",
      explanation: "Melting point increases with molecular weight due to stronger intermolecular forces.",
      points: 10
    },
    {
      id: "alk-14",
      question: "Which alkane is a gas at room temperature?",
      type: "multiple-choice",
      options: ["Methane", "Butane", "Hexane", "Octane"],
      correctAnswer: "Methane",
      explanation: "Methane (CH4) is a gas at room temperature. Alkanes with 1-4 carbons are gases.",
      points: 10
    },
    {
      id: "alk-15",
      question: "What is the IUPAC name for (CH3)3CCH2CH3?",
      type: "multiple-choice",
      options: ["2,2-dimethylbutane", "3,3-dimethylbutane", "2-methylpentane", "Neohexane"],
      correctAnswer: "2,2-dimethylbutane",
      explanation: "Longest chain is 4 carbons (butane). Two methyl groups on carbon 2: 2,2-dimethylbutane.",
      points: 10
    }
  ],
  "substitution-elimination": [
    {
      id: "sub-1",
      question: "What is the major product when 2-bromobutane reacts with NaOEt in ethanol?",
      type: "multiple-choice",
      options: ["2-butanol", "1-butene", "2-butene", "Butane"],
      correctAnswer: "2-butene",
      explanation: "Strong base (OEt-) with secondary substrate favors E2 elimination, giving the more substituted alkene (2-butene).",
      points: 15
    },
    {
      id: "sub-2",
      question: "What mechanism occurs when tert-butyl bromide reacts with H2O?",
      type: "multiple-choice",
      options: ["SN1", "SN2", "E1", "E2"],
      correctAnswer: "SN1",
      explanation: "Tertiary substrate with weak nucleophile (H2O) favors SN1 mechanism due to stable carbocation formation.",
      points: 15
    },
    {
      id: "sub-3",
      question: "Which substrate undergoes SN2 reaction fastest?",
      type: "multiple-choice",
      options: ["Methyl bromide", "Primary bromide", "Secondary bromide", "Tertiary bromide"],
      correctAnswer: "Methyl bromide",
      explanation: "SN2 is fastest with methyl > primary > secondary. Tertiary does not undergo SN2.",
      points: 15
    },
    {
      id: "sub-4",
      question: "What is the stereochemistry outcome of an SN2 reaction?",
      type: "multiple-choice",
      options: ["Retention", "Inversion", "Racemization", "No change"],
      correctAnswer: "Inversion",
      explanation: "SN2 proceeds via backside attack, causing inversion of configuration at the stereocenter.",
      points: 15
    },
    {
      id: "sub-5",
      question: "Which solvent favors SN1 over SN2?",
      type: "multiple-choice",
      options: ["Polar aprotic", "Polar protic", "Nonpolar", "All equally"],
      correctAnswer: "Polar protic",
      explanation: "Polar protic solvents stabilize carbocations and favor SN1/E1 mechanisms.",
      points: 15
    },
    {
      id: "sub-6",
      question: "What is the major product when (CH3)3CBr reacts with CH3O- in DMSO?",
      type: "multiple-choice",
      options: ["(CH3)3COCH3", "CH2=C(CH3)2", "No reaction", "Mixture"],
      correctAnswer: "CH2=C(CH3)2",
      explanation: "Tertiary substrate with strong base in polar aprotic solvent favors E2 elimination.",
      points: 15
    },
    {
      id: "sub-7",
      question: "What is the Zaitsev product in E2 elimination of 2-bromobutane?",
      type: "multiple-choice",
      options: ["1-butene", "2-butene", "Butane", "No elimination"],
      correctAnswer: "2-butene",
      explanation: "Zaitsev rule: the more substituted (stable) alkene is favored. 2-butene is more substituted than 1-butene.",
      points: 15
    },
    {
      id: "sub-8",
      question: "Which nucleophile is strongest?",
      type: "multiple-choice",
      options: ["H2O", "OH-", "CH3OH", "NH3"],
      correctAnswer: "OH-",
      explanation: "OH- is a strong nucleophile due to its negative charge and small size.",
      points: 15
    },
    {
      id: "sub-9",
      question: "What mechanism occurs when CH3Br reacts with NaCN in DMF?",
      type: "multiple-choice",
      options: ["SN1", "SN2", "E1", "E2"],
      correctAnswer: "SN2",
      explanation: "Methyl substrate with strong nucleophile (CN-) in polar aprotic solvent favors SN2.",
      points: 15
    },
    {
      id: "sub-10",
      question: "What is the stereochemistry outcome of an SN1 reaction?",
      type: "multiple-choice",
      options: ["Retention", "Inversion", "Racemization", "No stereocenter"],
      correctAnswer: "Racemization",
      explanation: "SN1 forms a planar carbocation, allowing attack from both sides, resulting in racemization.",
      points: 15
    },
    {
      id: "sub-11",
      question: "Which base gives Hofmann product in E2 elimination?",
      type: "multiple-choice",
      options: ["Small base", "Bulky base", "Weak base", "Strong acid"],
      correctAnswer: "Bulky base",
      explanation: "Bulky bases (like t-BuO-) favor less substituted alkene (Hofmann product) due to steric hindrance.",
      points: 15
    },
    {
      id: "sub-12",
      question: "What is required for E2 elimination?",
      type: "multiple-choice",
      options: ["Anti-periplanar arrangement", "Syn arrangement", "No specific arrangement", "Coplanar only"],
      correctAnswer: "Anti-periplanar arrangement",
      explanation: "E2 requires anti-periplanar (180°) arrangement of leaving group and beta-hydrogen for optimal orbital overlap.",
      points: 15
    },
    {
      id: "sub-13",
      question: "Which substrate undergoes E1 reaction fastest?",
      type: "multiple-choice",
      options: ["Methyl", "Primary", "Secondary", "Tertiary"],
      correctAnswer: "Tertiary",
      explanation: "E1 is favored by tertiary substrates that form stable carbocations.",
      points: 15
    },
    {
      id: "sub-14",
      question: "What is the major product when 1-bromopropane reacts with KOH in ethanol with heat?",
      type: "multiple-choice",
      options: ["1-propanol", "2-propanol", "Propene", "No reaction"],
      correctAnswer: "Propene",
      explanation: "Primary substrate with strong base and heat favors E2 elimination to give propene.",
      points: 15
    },
    {
      id: "sub-15",
      question: "Which factor does NOT favor SN1?",
      type: "multiple-choice",
      options: ["Tertiary substrate", "Polar protic solvent", "Weak nucleophile", "Polar aprotic solvent"],
      correctAnswer: "Polar aprotic solvent",
      explanation: "Polar aprotic solvents favor SN2, not SN1. SN1 is favored by polar protic solvents.",
      points: 15
    }
  ],
  "cycloalkanes": [
    {
      id: "cyc-1",
      question: "Which conformation of cyclohexane is most stable?",
      type: "multiple-choice",
      options: ["Boat", "Chair", "Twist boat", "Half-chair"],
      correctAnswer: "Chair",
      explanation: "The chair conformation is the most stable due to minimal angle and torsional strain.",
      points: 10
    },
    {
      id: "cyc-2",
      question: "In a chair flip, what happens to axial substituents?",
      type: "multiple-choice",
      options: ["They become equatorial", "They stay axial", "They disappear", "They become up"],
      correctAnswer: "They become equatorial",
      explanation: "During a chair flip, all axial positions become equatorial and vice versa.",
      points: 10
    },
    {
      id: "cyc-3",
      question: "What is the relationship between up and down positions during a chair flip?",
      type: "multiple-choice",
      options: ["Up becomes down", "Up stays up", "They swap randomly", "They become axial"],
      correctAnswer: "Up stays up",
      explanation: "Up and down positions are stereochemical and do not change during chair flip.",
      points: 10
    },
    {
      id: "cyc-4",
      question: "Which group prefers the equatorial position?",
      type: "multiple-choice",
      options: ["Small groups", "Bulky groups", "All groups equally", "Charged groups"],
      correctAnswer: "Bulky groups",
      explanation: "Bulky groups prefer equatorial to avoid 1,3-diaxial interactions.",
      points: 10
    },
    {
      id: "cyc-5",
      question: "What causes 1,3-diaxial interactions?",
      type: "multiple-choice",
      options: ["Angle strain", "Torsional strain", "Steric strain", "Ring strain"],
      correctAnswer: "Steric strain",
      explanation: "1,3-diaxial interactions are steric repulsions between axial substituents on carbons 1 and 3.",
      points: 10
    },
    {
      id: "cyc-6",
      question: "How many axial positions are there in a cyclohexane chair?",
      type: "multiple-choice",
      options: ["3", "6", "12", "18"],
      correctAnswer: "6",
      explanation: "There are 6 axial positions (one per carbon) and 6 equatorial positions in a chair.",
      points: 10
    },
    {
      id: "cyc-7",
      question: "What is the dihedral angle between adjacent carbons in cyclohexane chair?",
      type: "multiple-choice",
      options: ["60°", "109.5°", "120°", "180°"],
      correctAnswer: "60°",
      explanation: "The chair conformation has a dihedral angle of approximately 60° between adjacent carbons.",
      points: 10
    },
    {
      id: "cyc-8",
      question: "Which ring size has the most angle strain?",
      type: "multiple-choice",
      options: ["Cyclopropane", "Cyclobutane", "Cyclopentane", "Cyclohexane"],
      correctAnswer: "Cyclopropane",
      explanation: "Cyclopropane has the most angle strain due to 60° bond angles vs ideal 109.5°.",
      points: 10
    },
    {
      id: "cyc-9",
      question: "In trans-1,2-dimethylcyclohexane, are the methyl groups cis or trans?",
      type: "multiple-choice",
      options: ["Cis", "Trans", "Both possible", "Cannot determine"],
      correctAnswer: "Trans",
      explanation: "Trans means the substituents are on opposite faces of the ring.",
      points: 10
    },
    {
      id: "cyc-10",
      question: "What is the most stable conformation of tert-butylcyclohexane?",
      type: "short-answer",
      correctAnswer: "Tert-butyl in equatorial position",
      explanation: "The bulky tert-butyl group must be equatorial to minimize 1,3-diaxial interactions.",
      points: 10
    },
    {
      id: "cyc-11",
      question: "How many chair conformations are possible for a monosubstituted cyclohexane?",
      type: "multiple-choice",
      options: ["1", "2", "4", "6"],
      correctAnswer: "2",
      explanation: "There are two chair conformations (flip isomers) that interconvert rapidly.",
      points: 10
    },
    {
      id: "cyc-12",
      question: "What is the energy difference between axial and equatorial methylcyclohexane?",
      type: "multiple-choice",
      options: ["~1.7 kcal/mol", "~3.4 kcal/mol", "~5.0 kcal/mol", "No difference"],
      correctAnswer: "~1.7 kcal/mol",
      explanation: "A methyl group in axial position has ~1.7 kcal/mol more energy due to 1,3-diaxial interactions.",
      points: 10
    },
    {
      id: "cyc-13",
      question: "Which is more stable: cis or trans-1,4-dimethylcyclohexane?",
      type: "multiple-choice",
      options: ["Cis", "Trans", "Equal", "Depends on temperature"],
      correctAnswer: "Trans",
      explanation: "Trans-1,4 can have both methyls equatorial simultaneously, making it more stable.",
      points: 10
    },
    {
      id: "cyc-14",
      question: "What happens to ring strain as ring size increases beyond cyclohexane?",
      type: "multiple-choice",
      options: ["Increases", "Decreases", "Stays same", "Varies randomly"],
      correctAnswer: "Increases",
      explanation: "Larger rings have transannular strain and less favorable conformations.",
      points: 10
    },
    {
      id: "cyc-15",
      question: "In a chair flip, how many bonds rotate?",
      type: "multiple-choice",
      options: ["All bonds", "Half the bonds", "No bonds rotate", "Only axial bonds"],
      correctAnswer: "All bonds",
      explanation: "All bonds rotate during a chair flip, changing the entire conformation.",
      points: 10
    }
  ],
  "stereochemistry": [
    {
      id: "ster-1",
      question: "What is a stereocenter?",
      type: "multiple-choice",
      options: ["A carbon with 4 different groups", "Any carbon", "A double bond", "A ring"],
      correctAnswer: "A carbon with 4 different groups",
      explanation: "A stereocenter (chiral center) is a carbon bonded to four different groups.",
      points: 10
    },
    {
      id: "ster-2",
      question: "What is the relationship between (R)-2-butanol and (S)-2-butanol?",
      type: "multiple-choice",
      options: ["Enantiomers", "Diastereomers", "Identical", "Constitutional isomers"],
      correctAnswer: "Enantiomers",
      explanation: "They are mirror images with opposite configurations at the stereocenter.",
      points: 10
    },
    {
      id: "ster-3",
      question: "How do you assign R or S configuration?",
      type: "short-answer",
      correctAnswer: "CIP priority rules, put lowest priority back, determine direction",
      explanation: "Assign priorities using CIP rules, put lowest priority away, then determine if sequence is clockwise (R) or counterclockwise (S).",
      points: 10
    },
    {
      id: "ster-4",
      question: "What is a meso compound?",
      type: "multiple-choice",
      options: ["Achiral despite having stereocenters", "Always chiral", "Has no stereocenters", "Racemic mixture"],
      correctAnswer: "Achiral despite having stereocenters",
      explanation: "A meso compound has stereocenters but is achiral due to a plane of symmetry.",
      points: 10
    },
    {
      id: "ster-5",
      question: "What is the maximum number of stereoisomers for a molecule with 2 stereocenters?",
      type: "multiple-choice",
      options: ["2", "4", "6", "8"],
      correctAnswer: "4",
      explanation: "For n stereocenters, maximum is 2^n stereoisomers (unless meso compounds exist).",
      points: 10
    },
    {
      id: "ster-6",
      question: "What is the E/Z notation for alkenes?",
      type: "multiple-choice",
      options: ["Based on CIP priorities", "Based on mass", "Based on alphabet", "Random"],
      correctAnswer: "Based on CIP priorities",
      explanation: "E (entgegen) = opposite sides, Z (zusammen) = same side, determined by CIP priority rules.",
      points: 10
    },
    {
      id: "ster-7",
      question: "Which is optically active?",
      type: "multiple-choice",
      options: ["Racemic mixture", "Meso compound", "Enantiomer", "Achiral molecule"],
      correctAnswer: "Enantiomer",
      explanation: "Only chiral molecules (like pure enantiomers) rotate plane-polarized light.",
      points: 10
    },
    {
      id: "ster-8",
      question: "What is the relationship between (2R,3R)-tartaric acid and (2S,3S)-tartaric acid?",
      type: "multiple-choice",
      options: ["Enantiomers", "Diastereomers", "Identical", "Meso"],
      correctAnswer: "Enantiomers",
      explanation: "They are mirror images with opposite configurations at both stereocenters.",
      points: 10
    },
    {
      id: "ster-9",
      question: "How many stereoisomers does 2,3-dibromobutane have?",
      type: "multiple-choice",
      options: ["2", "3", "4", "6"],
      correctAnswer: "3",
      explanation: "It has 2 stereocenters, but one is meso, so total: 2 enantiomers + 1 meso = 3 stereoisomers.",
      points: 10
    },
    {
      id: "ster-10",
      question: "What does a plane of symmetry indicate?",
      type: "multiple-choice",
      options: ["Molecule is achiral", "Molecule is chiral", "Has no stereocenters", "Is racemic"],
      correctAnswer: "Molecule is achiral",
      explanation: "A plane of symmetry means the molecule is superimposable on its mirror image (achiral).",
      points: 10
    },
    {
      id: "ster-11",
      question: "In Fischer projection, how do you determine R/S?",
      type: "short-answer",
      correctAnswer: "Put lowest priority back, then determine direction",
      explanation: "In Fischer projection, horizontal bonds come forward, vertical go back. Put lowest priority on vertical, then determine R/S.",
      points: 10
    },
    {
      id: "ster-12",
      question: "What is the relationship between diastereomers?",
      type: "multiple-choice",
      options: ["Mirror images", "Not mirror images, different at some stereocenters", "Identical", "Constitutional isomers"],
      correctAnswer: "Not mirror images, different at some stereocenters",
      explanation: "Diastereomers are stereoisomers that are not mirror images.",
      points: 10
    },
    {
      id: "ster-13",
      question: "Which has higher priority: CH3 or CH2CH3?",
      type: "multiple-choice",
      options: ["CH3", "CH2CH3", "Equal", "Cannot compare"],
      correctAnswer: "CH2CH3",
      explanation: "Compare first atom (both C), then compare second atoms. CH2CH3 has C,C,H vs CH3 has H,H,H, so CH2CH3 wins.",
      points: 10
    },
    {
      id: "ster-14",
      question: "What is a racemic mixture?",
      type: "multiple-choice",
      options: ["Equal amounts of enantiomers", "Equal amounts of diastereomers", "Pure enantiomer", "Meso compound"],
      correctAnswer: "Equal amounts of enantiomers",
      explanation: "A racemic mixture contains equal amounts of both enantiomers and is optically inactive.",
      points: 10
    },
    {
      id: "ster-15",
      question: "How do you break a tie in CIP priority rules?",
      type: "short-answer",
      correctAnswer: "Compare atoms at first point of difference",
      explanation: "If first atoms are identical, compare second atoms, then third, etc., until finding a difference.",
      points: 10
    }
  ],
  "alkenes": [
    {
      id: "alke-1",
      question: "What is Markovnikov's rule?",
      type: "short-answer",
      correctAnswer: "H adds to less substituted carbon, X adds to more substituted",
      explanation: "In addition to alkenes, the electrophile (H+) adds to the carbon with more hydrogens.",
      points: 15
    },
    {
      id: "alke-2",
      question: "What is the major product of propene + HBr?",
      type: "multiple-choice",
      options: ["1-bromopropane", "2-bromopropane", "3-bromopropane", "No reaction"],
      correctAnswer: "2-bromopropane",
      explanation: "Markovnikov addition: H adds to C1 (more H), Br adds to C2 (more substituted).",
      points: 15
    },
    {
      id: "alke-3",
      question: "Which reaction gives anti-Markovnikov addition?",
      type: "multiple-choice",
      options: ["HBr", "HBr + ROOR", "H2SO4 + H2O", "Br2"],
      correctAnswer: "HBr + ROOR",
      explanation: "Hydroboration-oxidation and HBr with peroxides give anti-Markovnikov addition.",
      points: 15
    },
    {
      id: "alke-4",
      question: "What is the stereochemistry of Br2 addition to alkenes?",
      type: "multiple-choice",
      options: ["Syn", "Anti", "Both", "Neither"],
      correctAnswer: "Anti",
      explanation: "Br2 addition proceeds via halonium ion intermediate, giving anti addition.",
      points: 15
    },
    {
      id: "alke-5",
      question: "What is the major product of 2-methylpropene + H2O/H2SO4?",
      type: "multiple-choice",
      options: ["1-butanol", "2-methyl-2-propanol", "2-methyl-1-propanol", "2-butanol"],
      correctAnswer: "2-methyl-2-propanol",
      explanation: "Markovnikov addition: OH adds to the more substituted carbon (tertiary).",
      points: 15
    },
    {
      id: "alke-6",
      question: "What intermediate forms in acid-catalyzed hydration?",
      type: "multiple-choice",
      options: ["Carbocation", "Carbanion", "Radical", "Halonium ion"],
      correctAnswer: "Carbocation",
      explanation: "Acid-catalyzed hydration proceeds via carbocation intermediate, allowing rearrangements.",
      points: 15
    },
    {
      id: "alke-7",
      question: "Which reaction does NOT allow rearrangements?",
      type: "multiple-choice",
      options: ["Acid-catalyzed hydration", "Oxymercuration", "Hydroboration", "HBr addition"],
      correctAnswer: "Oxymercuration",
      explanation: "Oxymercuration uses mercurinium ion (no carbocation), preventing rearrangements.",
      points: 15
    },
    {
      id: "alke-8",
      question: "What is the stereochemistry of hydroboration-oxidation?",
      type: "multiple-choice",
      options: ["Syn", "Anti", "Both", "Neither"],
      correctAnswer: "Syn",
      explanation: "Hydroboration-oxidation gives syn addition (both add to same face of alkene).",
      points: 15
    },
    {
      id: "alke-9",
      question: "What are the products of ozonolysis of 2-butene?",
      type: "multiple-choice",
      options: ["Two aldehydes", "Two ketones", "Aldehyde and ketone", "Two alcohols"],
      correctAnswer: "Two aldehydes",
      explanation: "Ozonolysis cleaves the double bond. 2-butene gives acetaldehyde (CH3CHO) twice.",
      points: 15
    },
    {
      id: "alke-10",
      question: "What is the regioselectivity of hydroboration-oxidation?",
      type: "multiple-choice",
      options: ["Markovnikov", "Anti-Markovnikov", "No regioselectivity", "Depends on substrate"],
      correctAnswer: "Anti-Markovnikov",
      explanation: "Hydroboration-oxidation gives anti-Markovnikov addition: OH to less substituted carbon.",
      points: 15
    },
    {
      id: "alke-11",
      question: "What is the major product of 1-methylcyclohexene + HBr?",
      type: "multiple-choice",
      options: ["1-bromo-1-methylcyclohexane", "1-bromo-2-methylcyclohexane", "2-bromo-1-methylcyclohexane", "No reaction"],
      correctAnswer: "1-bromo-1-methylcyclohexane",
      explanation: "Markovnikov addition: Br adds to the more substituted carbon (tertiary).",
      points: 15
    },
    {
      id: "alke-12",
      question: "What reagent gives syn diol from alkene?",
      type: "multiple-choice",
      options: ["OsO4", "KMnO4 (hot)", "Br2/H2O", "H2SO4/H2O"],
      correctAnswer: "OsO4",
      explanation: "OsO4 or cold dilute KMnO4 gives syn dihydroxylation (syn addition of OH groups).",
      points: 15
    },
    {
      id: "alke-13",
      question: "What is the product of catalytic hydrogenation?",
      type: "multiple-choice",
      options: ["Alkane", "Alcohol", "Alkene", "Alkyne"],
      correctAnswer: "Alkane",
      explanation: "Catalytic hydrogenation (H2/Pd) reduces alkenes to alkanes with syn addition.",
      points: 15
    },
    {
      id: "alke-14",
      question: "Which addition reaction is stereospecific?",
      type: "multiple-choice",
      options: ["All of them", "Only syn additions", "Only anti additions", "None"],
      correctAnswer: "All of them",
      explanation: "All addition reactions to alkenes are stereospecific (syn or anti, depending on mechanism).",
      points: 15
    },
    {
      id: "alke-15",
      question: "What causes carbocation rearrangements in alkene additions?",
      type: "short-answer",
      correctAnswer: "Formation of more stable carbocation",
      explanation: "Carbocations rearrange (1,2-hydride or methyl shift) to form more stable carbocations (3° > 2° > 1°).",
      points: 15
    }
  ],
  "spectroscopy": [
    {
      id: "spec-1",
      question: "What IR region indicates C=O stretch?",
      type: "multiple-choice",
      options: ["1700-1750 cm⁻¹", "3000-3100 cm⁻¹", "2200-2300 cm⁻¹", "1000-1200 cm⁻¹"],
      correctAnswer: "1700-1750 cm⁻¹",
      explanation: "Carbonyl (C=O) stretches appear around 1700-1750 cm⁻¹, a key diagnostic region.",
      points: 15
    },
    {
      id: "spec-2",
      question: "What does integration in 1H NMR tell you?",
      type: "multiple-choice",
      options: ["Number of equivalent protons", "Chemical shift", "Coupling constant", "Solvent"],
      correctAnswer: "Number of equivalent protons",
      explanation: "Integration (area under peak) gives the relative number of equivalent protons.",
      points: 15
    },
    {
      id: "spec-3",
      question: "What is the typical chemical shift for aldehyde proton?",
      type: "multiple-choice",
      options: ["~2 ppm", "~5 ppm", "~9-10 ppm", "~12 ppm"],
      correctAnswer: "~9-10 ppm",
      explanation: "Aldehyde protons are highly deshielded and appear around 9-10 ppm.",
      points: 15
    },
    {
      id: "spec-4",
      question: "What does splitting pattern indicate in 1H NMR?",
      type: "multiple-choice",
      options: ["Number of equivalent protons", "Number of neighboring protons", "Chemical shift", "Integration"],
      correctAnswer: "Number of neighboring protons",
      explanation: "Splitting follows n+1 rule: n neighboring protons give n+1 peaks.",
      points: 15
    },
    {
      id: "spec-5",
      question: "What is the DBE (double bond equivalent) for C6H12?",
      type: "multiple-choice",
      options: ["0", "1", "2", "3"],
      correctAnswer: "1",
      explanation: "DBE = (2C + 2 - H)/2 = (12 + 2 - 12)/2 = 1 (one double bond or ring).",
      points: 15
    },
    {
      id: "spec-6",
      question: "What IR region indicates O-H stretch?",
      type: "multiple-choice",
      options: ["2500-3000 cm⁻¹", "3200-3600 cm⁻¹", "1700-1750 cm⁻¹", "1000-1200 cm⁻¹"],
      correctAnswer: "3200-3600 cm⁻¹",
      explanation: "O-H stretches appear as broad peaks around 3200-3600 cm⁻¹.",
      points: 15
    },
    {
      id: "spec-7",
      question: "What is the typical chemical shift for aromatic protons?",
      type: "multiple-choice",
      options: ["~1-2 ppm", "~3-4 ppm", "~6-8 ppm", "~10-12 ppm"],
      correctAnswer: "~6-8 ppm",
      explanation: "Aromatic protons are deshielded by the ring current and appear around 6-8 ppm.",
      points: 15
    },
    {
      id: "spec-8",
      question: "What does 13C NMR count?",
      type: "multiple-choice",
      options: ["All carbons", "Unique carbon environments", "Only sp3 carbons", "Only aromatic carbons"],
      correctAnswer: "Unique carbon environments",
      explanation: "13C NMR shows one peak per unique carbon environment (equivalent carbons show one peak).",
      points: 15
    },
    {
      id: "spec-9",
      question: "What splitting pattern does a CH2 group next to CH3 show?",
      type: "multiple-choice",
      options: ["Singlet", "Doublet", "Triplet", "Quartet"],
      correctAnswer: "Quartet",
      explanation: "CH2 next to CH3: CH3 has 3 protons, so CH2 shows 3+1 = 4 peaks (quartet).",
      points: 15
    },
    {
      id: "spec-10",
      question: "What IR region indicates C-H stretch?",
      type: "multiple-choice",
      options: ["2800-3000 cm⁻¹", "1700-1750 cm⁻¹", "1000-1200 cm⁻¹", "2200-2300 cm⁻¹"],
      correctAnswer: "2800-3000 cm⁻¹",
      explanation: "C-H stretches appear around 2800-3000 cm⁻¹ (sp3), 3000-3100 cm⁻¹ (sp2), 3300 cm⁻¹ (sp).",
      points: 15
    },
    {
      id: "spec-11",
      question: "What is the typical chemical shift for alkane protons?",
      type: "multiple-choice",
      options: ["~0-2 ppm", "~2-4 ppm", "~4-6 ppm", "~6-8 ppm"],
      correctAnswer: "~0-2 ppm",
      explanation: "Alkane protons are shielded and appear around 0-2 ppm.",
      points: 15
    },
    {
      id: "spec-12",
      question: "What does a triplet in 1H NMR indicate?",
      type: "multiple-choice",
      options: ["1 neighboring proton", "2 neighboring protons", "3 neighboring protons", "4 neighboring protons"],
      correctAnswer: "2 neighboring protons",
      explanation: "Triplet (3 peaks) means n+1=3, so n=2 neighboring protons.",
      points: 15
    },
    {
      id: "spec-13",
      question: "What is the typical 13C NMR chemical shift for carbonyl carbon?",
      type: "multiple-choice",
      options: ["~50-70 ppm", "~100-150 ppm", "~180-220 ppm", "~0-50 ppm"],
      correctAnswer: "~180-220 ppm",
      explanation: "Carbonyl carbons are highly deshielded and appear around 180-220 ppm in 13C NMR.",
      points: 15
    },
    {
      id: "spec-14",
      question: "What IR region indicates C≡C stretch?",
      type: "multiple-choice",
      options: ["1700-1750 cm⁻¹", "2200-2300 cm⁻¹", "3000-3100 cm⁻¹", "1000-1200 cm⁻¹"],
      correctAnswer: "2200-2300 cm⁻¹",
      explanation: "Triple bonds (C≡C, C≡N) appear around 2200-2300 cm⁻¹.",
      points: 15
    },
    {
      id: "spec-15",
      question: "What is the workflow for structure determination?",
      type: "short-answer",
      correctAnswer: "Propose structure first, then verify with all spectra",
      explanation: "Never peak hunt. Calculate DBE, propose structure, then verify every signal matches.",
      points: 15
    }
  ],
  "alcohols": [
    {
      id: "alc-1",
      question: "What is the product when 1-propanol is oxidized with PCC?",
      type: "multiple-choice",
      options: ["Propanal", "Propanoic acid", "Propanone", "No reaction"],
      correctAnswer: "Propanal",
      explanation: "PCC oxidizes primary alcohols to aldehydes, stopping at the aldehyde stage.",
      points: 15
    },
    {
      id: "alc-2",
      question: "What reagent oxidizes a primary alcohol to a carboxylic acid?",
      type: "multiple-choice",
      options: ["PCC", "Jones reagent (CrO3/H2SO4)", "Swern", "DMP"],
      correctAnswer: "Jones reagent (CrO3/H2SO4)",
      explanation: "Jones reagent (chromic acid) oxidizes primary alcohols all the way to carboxylic acids.",
      points: 15
    },
    {
      id: "alc-3",
      question: "What is the product when 2-propanol is oxidized?",
      type: "multiple-choice",
      options: ["Propanal", "Propanoic acid", "Propanone", "No reaction"],
      correctAnswer: "Propanone",
      explanation: "Secondary alcohols oxidize to ketones. 2-propanol gives propanone (acetone).",
      points: 15
    },
    {
      id: "alc-4",
      question: "What is the best way to convert an alcohol to a good leaving group?",
      type: "multiple-choice",
      options: ["Tosylate", "Mesylate", "Both tosylate and mesylate", "Neither"],
      correctAnswer: "Both tosylate and mesylate",
      explanation: "Both tosylates (OTs) and mesylates (OMs) are excellent leaving groups for SN2 reactions.",
      points: 15
    },
    {
      id: "alc-5",
      question: "What happens when a tertiary alcohol is treated with H2SO4 and heat?",
      type: "multiple-choice",
      options: ["Oxidation", "Dehydration to alkene", "Substitution", "No reaction"],
      correctAnswer: "Dehydration to alkene",
      explanation: "Tertiary alcohols undergo acid-catalyzed dehydration to form alkenes, following Zaitsev's rule.",
      points: 15
    },
    {
      id: "alc-6",
      question: "What is the purpose of protecting an alcohol as a silyl ether?",
      type: "short-answer",
      correctAnswer: "To prevent reaction during other transformations",
      explanation: "Silyl ethers (like TBS) protect alcohols from reacting during other steps, then can be removed with F-.",
      points: 15
    },
    {
      id: "alc-7",
      question: "Which alcohol can be oxidized to an aldehyde without further oxidation?",
      type: "multiple-choice",
      options: ["Primary with PCC", "Primary with Jones", "Secondary with PCC", "Tertiary"],
      correctAnswer: "Primary with PCC",
      explanation: "PCC stops at aldehyde for primary alcohols. Jones continues to acid.",
      points: 15
    },
    {
      id: "alc-8",
      question: "What is the major product when 2-methyl-2-propanol undergoes dehydration?",
      type: "multiple-choice",
      options: ["1-butene", "2-methylpropene", "2-butene", "No reaction"],
      correctAnswer: "2-methylpropene",
      explanation: "Dehydration of 2-methyl-2-propanol gives the more substituted alkene (2-methylpropene).",
      points: 15
    },
    {
      id: "alc-9",
      question: "What reagent converts an alcohol to a tosylate?",
      type: "multiple-choice",
      options: ["TsCl/pyridine", "TsOH", "TsNH2", "TsO-"],
      correctAnswer: "TsCl/pyridine",
      explanation: "Tosyl chloride (TsCl) with pyridine converts alcohols to tosylates (OTs).",
      points: 15
    },
    {
      id: "alc-10",
      question: "What is the oxidation state of carbon in a primary alcohol?",
      type: "multiple-choice",
      options: ["-2", "-1", "0", "+1"],
      correctAnswer: "-2",
      explanation: "In primary alcohols, the carbon bonded to OH has oxidation state -2 (two bonds to H, one to C, one to O).",
      points: 15
    },
    {
      id: "alc-11",
      question: "What is the product when 1-butanol reacts with PBr3?",
      type: "multiple-choice",
      options: ["1-bromobutane", "2-bromobutane", "Butanal", "No reaction"],
      correctAnswer: "1-bromobutane",
      explanation: "PBr3 converts alcohols to alkyl bromides with inversion of configuration (SN2-like).",
      points: 15
    },
    {
      id: "alc-12",
      question: "Which alcohol is most acidic?",
      type: "multiple-choice",
      options: ["Methanol", "Ethanol", "2-propanol", "Phenol"],
      correctAnswer: "Phenol",
      explanation: "Phenol is most acidic due to resonance stabilization of the phenoxide ion.",
      points: 15
    },
    {
      id: "alc-13",
      question: "What is the mechanism for alcohol dehydration under acidic conditions?",
      type: "multiple-choice",
      options: ["E1", "E2", "SN1", "SN2"],
      correctAnswer: "E1",
      explanation: "Acid-catalyzed dehydration proceeds via E1 mechanism (carbocation intermediate) for secondary and tertiary alcohols.",
      points: 15
    },
    {
      id: "alc-14",
      question: "What is the product when 2-methyl-1-propanol is oxidized with Jones reagent?",
      type: "multiple-choice",
      options: ["2-methylpropanal", "2-methylpropanoic acid", "2-methylpropanone", "No reaction"],
      correctAnswer: "2-methylpropanoic acid",
      explanation: "Jones reagent oxidizes primary alcohols to carboxylic acids. 2-methyl-1-propanol → 2-methylpropanoic acid.",
      points: 15
    },
    {
      id: "alc-15",
      question: "What protecting group is commonly used for alcohols in synthesis?",
      type: "multiple-choice",
      options: ["TBS (t-butyldimethylsilyl)", "Boc", "Fmoc", "All of the above"],
      correctAnswer: "TBS (t-butyldimethylsilyl)",
      explanation: "TBS (t-butyldimethylsilyl) is a common protecting group for alcohols, removed with F- (TBAF).",
      points: 15
    }
  ],
  "ethers-epoxides": [
    {
      id: "eth-1",
      question: "What is the best substrate for Williamson ether synthesis?",
      type: "multiple-choice",
      options: ["Primary alkyl halide", "Secondary alkyl halide", "Tertiary alkyl halide", "All equally"],
      correctAnswer: "Primary alkyl halide",
      explanation: "Williamson ether synthesis is SN2, so primary alkyl halides work best (unhindered).",
      points: 15
    },
    {
      id: "eth-2",
      question: "What is the major product when propylene oxide opens under basic conditions?",
      type: "multiple-choice",
      options: ["1-propanol", "2-propanol", "1,2-propanediol (less substituted)", "1,2-propanediol (more substituted)"],
      correctAnswer: "1,2-propanediol (less substituted)",
      explanation: "Under basic conditions, nucleophile attacks the less substituted carbon of the epoxide.",
      points: 15
    },
    {
      id: "eth-3",
      question: "What is the stereochemistry of epoxide opening?",
      type: "multiple-choice",
      options: ["Syn", "Anti", "Both", "Neither"],
      correctAnswer: "Anti",
      explanation: "Epoxide opening is anti: the nucleophile and leaving group are on opposite sides.",
      points: 15
    },
    {
      id: "eth-4",
      question: "What is the major product when 1,2-epoxypropane opens under acidic conditions?",
      type: "multiple-choice",
      options: ["1-propanol", "2-propanol", "1,2-propanediol (less substituted)", "1,2-propanediol (more substituted)"],
      correctAnswer: "1,2-propanediol (more substituted)",
      explanation: "Under acidic conditions, nucleophile attacks the more substituted carbon (more stable carbocation-like).",
      points: 15
    },
    {
      id: "eth-5",
      question: "What reagent cleaves ethers with strong acids?",
      type: "multiple-choice",
      options: ["HBr", "HCl", "HI", "All of the above"],
      correctAnswer: "HI",
      explanation: "HI is the strongest and most commonly used for ether cleavage. HBr and HCl work but are slower.",
      points: 15
    },
    {
      id: "eth-6",
      question: "What is the mechanism of Williamson ether synthesis?",
      type: "multiple-choice",
      options: ["SN1", "SN2", "E1", "E2"],
      correctAnswer: "SN2",
      explanation: "Williamson ether synthesis is SN2: alkoxide attacks primary alkyl halide with inversion.",
      points: 15
    },
    {
      id: "eth-7",
      question: "What is the product when ethylene oxide reacts with water under acidic conditions?",
      type: "multiple-choice",
      options: ["Ethanol", "Ethylene glycol", "Acetaldehyde", "No reaction"],
      correctAnswer: "Ethylene glycol",
      explanation: "Epoxides open with water under acidic conditions to give diols. Ethylene oxide → ethylene glycol.",
      points: 15
    },
    {
      id: "eth-8",
      question: "Why do epoxides react more readily than ethers?",
      type: "short-answer",
      correctAnswer: "Ring strain makes them more reactive",
      explanation: "Epoxides have significant ring strain (60° bond angles vs 109.5°), making them much more reactive than regular ethers.",
      points: 15
    },
    {
      id: "eth-9",
      question: "What is the product when 2-methyloxirane opens with CH3O-?",
      type: "multiple-choice",
      options: ["2-methoxy-1-propanol", "1-methoxy-2-propanol", "2-methoxy-2-propanol", "No reaction"],
      correctAnswer: "1-methoxy-2-propanol",
      explanation: "Under basic conditions, CH3O- attacks the less substituted carbon, giving 1-methoxy-2-propanol.",
      points: 15
    },
    {
      id: "eth-10",
      question: "What is the major product when diethyl ether is cleaved with HI?",
      type: "multiple-choice",
      options: ["Two ethyl iodides", "Ethanol and iodoethane", "Ethane and ethanol", "No reaction"],
      correctAnswer: "Two ethyl iodides",
      explanation: "Symmetrical ethers like diethyl ether cleave to give two equivalent alkyl iodides.",
      points: 15
    },
    {
      id: "eth-11",
      question: "What is the regioselectivity of epoxide opening with Grignard reagents?",
      type: "multiple-choice",
      options: ["Less substituted", "More substituted", "Equal", "Depends on conditions"],
      correctAnswer: "Less substituted",
      explanation: "Grignard reagents (strong nucleophiles) attack the less substituted carbon under basic-like conditions.",
      points: 15
    },
    {
      id: "eth-12",
      question: "What protecting group strategy uses ethers?",
      type: "short-answer",
      correctAnswer: "Ethers can protect alcohols",
      explanation: "Ethers (like benzyl ethers) can protect alcohols during synthesis, then be removed with H2/Pd or HBr.",
      points: 15
    },
    {
      id: "eth-13",
      question: "What is the product when cyclohexene oxide opens with H2O/H+?",
      type: "multiple-choice",
      options: ["Cyclohexanol", "1,2-cyclohexanediol (trans)", "1,2-cyclohexanediol (cis)", "No reaction"],
      correctAnswer: "1,2-cyclohexanediol (trans)",
      explanation: "Acidic opening gives trans-1,2-cyclohexanediol due to anti addition stereochemistry.",
      points: 15
    },
    {
      id: "eth-14",
      question: "What is the limitation of Williamson ether synthesis?",
      type: "multiple-choice",
      options: ["Only works with primary halides", "Doesn't work with tertiary halides", "Requires strong base", "All of the above"],
      correctAnswer: "All of the above",
      explanation: "Williamson has limitations: best with primary halides, fails with tertiary (E2 instead), and requires strong base (alkoxide).",
      points: 15
    },
    {
      id: "eth-15",
      question: "What is the product when an epoxide opens with NH3?",
      type: "multiple-choice",
      options: ["Amine", "Amino alcohol", "Amide", "No reaction"],
      correctAnswer: "Amino alcohol",
      explanation: "Ammonia opens epoxides to give amino alcohols (beta-amino alcohols).",
      points: 15
    }
  ],
  "carbonyls-addition": [
    {
      id: "carb-1",
      question: "Which is more reactive: aldehyde or ketone?",
      type: "multiple-choice",
      options: ["Aldehyde", "Ketone", "Equal", "Depends on substituents"],
      correctAnswer: "Aldehyde",
      explanation: "Aldehydes are more reactive than ketones due to less steric hindrance and electronic effects.",
      points: 15
    },
    {
      id: "carb-2",
      question: "What is the product when benzaldehyde reacts with NaBH4?",
      type: "multiple-choice",
      options: ["Benzyl alcohol", "Benzoic acid", "Benzophenone", "No reaction"],
      correctAnswer: "Benzyl alcohol",
      explanation: "NaBH4 reduces aldehydes to primary alcohols. Benzaldehyde → benzyl alcohol.",
      points: 15
    },
    {
      id: "carb-3",
      question: "What is the product when acetone reacts with CH3MgBr then H3O+?",
      type: "multiple-choice",
      options: ["2-propanol", "2-methyl-2-propanol", "2-butanone", "No reaction"],
      correctAnswer: "2-methyl-2-propanol",
      explanation: "Grignard adds to ketone, then H3O+ protonates to give tertiary alcohol. Acetone + CH3MgBr → 2-methyl-2-propanol.",
      points: 15
    },
    {
      id: "carb-4",
      question: "What is the mechanism of carbonyl addition?",
      type: "multiple-choice",
      options: ["SN1", "SN2", "Nucleophilic addition", "Elimination"],
      correctAnswer: "Nucleophilic addition",
      explanation: "Carbonyls undergo nucleophilic addition (not substitution) because the C=O double bond is attacked first.",
      points: 15
    },
    {
      id: "carb-5",
      question: "What is the product when acetaldehyde reacts with HCN?",
      type: "multiple-choice",
      options: ["Acetonitrile", "Cyanohydrin", "Acetic acid", "No reaction"],
      correctAnswer: "Cyanohydrin",
      explanation: "HCN adds to aldehydes to give cyanohydrins (alpha-hydroxy nitriles).",
      points: 15
    },
    {
      id: "carb-6",
      question: "What is acetal formation used for?",
      type: "short-answer",
      correctAnswer: "Protecting carbonyl groups",
      explanation: "Acetals protect carbonyls from nucleophilic attack, then can be removed with acid to regenerate the carbonyl.",
      points: 15
    },
    {
      id: "carb-7",
      question: "What is the product when formaldehyde reacts with excess methanol and acid?",
      type: "multiple-choice",
      options: ["Formic acid", "Methyl formate", "Dimethyl acetal", "No reaction"],
      correctAnswer: "Dimethyl acetal",
      explanation: "Formaldehyde with excess alcohol and acid catalyst forms an acetal. H2CO + 2CH3OH → (CH3O)2CH2.",
      points: 15
    },
    {
      id: "carb-8",
      question: "What is the product when benzaldehyde reacts with primary amine?",
      type: "multiple-choice",
      options: ["Imine", "Enamine", "Amide", "No reaction"],
      correctAnswer: "Imine",
      explanation: "Aldehydes/ketones with primary amines form imines (Schiff bases) via condensation.",
      points: 15
    },
    {
      id: "carb-9",
      question: "What is the product when cyclohexanone reacts with secondary amine?",
      type: "multiple-choice",
      options: ["Imine", "Enamine", "Amide", "No reaction"],
      correctAnswer: "Enamine",
      explanation: "Ketones with secondary amines form enamines (alkene + amine) under acid catalysis.",
      points: 15
    },
    {
      id: "carb-10",
      question: "What is the stereochemistry of Grignard addition to carbonyls?",
      type: "multiple-choice",
      options: ["Syn", "Anti", "Racemic", "No stereochemistry"],
      correctAnswer: "Racemic",
      explanation: "Grignard addition to unsymmetrical ketones gives racemic mixtures (chiral centers formed).",
      points: 15
    },
    {
      id: "carb-11",
      question: "What is the product when propanal reacts with LiAlH4 then H3O+?",
      type: "multiple-choice",
      options: ["Propanol", "Propanoic acid", "Propanone", "No reaction"],
      correctAnswer: "Propanol",
      explanation: "LiAlH4 reduces aldehydes to primary alcohols. Propanal → 1-propanol.",
      points: 15
    },
    {
      id: "carb-12",
      question: "What is the difference between NaBH4 and LiAlH4?",
      type: "short-answer",
      correctAnswer: "LiAlH4 is stronger, works in ether; NaBH4 is milder, works in alcohol",
      explanation: "LiAlH4 is a stronger reducing agent, works in ether solvents. NaBH4 is milder, works in alcohol/water.",
      points: 15
    },
    {
      id: "carb-13",
      question: "What is the product when 2-butanone reacts with organolithium (CH3Li) then H3O+?",
      type: "multiple-choice",
      options: ["2-butanol", "3-methyl-2-butanol", "2-methyl-2-butanol", "No reaction"],
      correctAnswer: "3-methyl-2-butanol",
      explanation: "Organolithium adds to ketone, then H3O+ gives tertiary alcohol. 2-butanone + CH3Li → 3-methyl-2-butanol.",
      points: 15
    },
    {
      id: "carb-14",
      question: "What is the purpose of acid catalysis in acetal formation?",
      type: "multiple-choice",
      options: ["Protonate carbonyl", "Activate nucleophile", "Both", "Neither"],
      correctAnswer: "Both",
      explanation: "Acid protonates the carbonyl (making it more electrophilic) and can activate the alcohol nucleophile.",
      points: 15
    },
    {
      id: "carb-15",
      question: "What is the product when acetaldehyde reacts with 2 equivalents of ethanol and acid?",
      type: "multiple-choice",
      options: ["Hemiacetal", "Acetal", "Ether", "No reaction"],
      correctAnswer: "Acetal",
      explanation: "Aldehyde with 2 equivalents of alcohol and acid gives acetal. First forms hemiacetal, then acetal.",
      points: 15
    }
  ],
  "carboxylic-acids-derivatives": [
    {
      id: "acid-1",
      question: "What is the reactivity order of carboxylic acid derivatives?",
      type: "multiple-choice",
      options: ["Acid chloride > Anhydride > Ester > Amide", "Amide > Ester > Anhydride > Acid chloride", "All equal", "Depends on conditions"],
      correctAnswer: "Acid chloride > Anhydride > Ester > Amide",
      explanation: "Reactivity decreases as leaving group ability decreases: Cl- > RCOO- > RO- > NH2-.",
      points: 15
    },
    {
      id: "acid-2",
      question: "What is the mechanism of nucleophilic acyl substitution?",
      type: "multiple-choice",
      options: ["SN1", "SN2", "Addition-elimination", "Elimination-addition"],
      correctAnswer: "Addition-elimination",
      explanation: "Nucleophilic acyl substitution proceeds via addition-elimination: nucleophile adds, then leaving group leaves.",
      points: 15
    },
    {
      id: "acid-3",
      question: "What is the product when acetic acid reacts with SOCl2?",
      type: "multiple-choice",
      options: ["Acetyl chloride", "Acetic anhydride", "Acetamide", "No reaction"],
      correctAnswer: "Acetyl chloride",
      explanation: "SOCl2 (thionyl chloride) converts carboxylic acids to acid chlorides. Acetic acid → acetyl chloride.",
      points: 15
    },
    {
      id: "acid-4",
      question: "What is the product when acetyl chloride reacts with ethanol?",
      type: "multiple-choice",
      options: ["Ethyl acetate", "Acetic acid", "Acetaldehyde", "No reaction"],
      correctAnswer: "Ethyl acetate",
      explanation: "Acid chlorides react with alcohols to give esters. Acetyl chloride + EtOH → ethyl acetate.",
      points: 15
    },
    {
      id: "acid-5",
      question: "What is the product when acetic anhydride reacts with ammonia?",
      type: "multiple-choice",
      options: ["Acetamide", "Acetic acid", "Acetonitrile", "No reaction"],
      correctAnswer: "Acetamide",
      explanation: "Acid anhydrides react with ammonia to give amides. Acetic anhydride + NH3 → acetamide.",
      points: 15
    },
    {
      id: "acid-6",
      question: "What is transesterification?",
      type: "short-answer",
      correctAnswer: "Exchange of alkoxide group in ester",
      explanation: "Transesterification exchanges the alkoxide (OR) group of an ester with another alcohol, catalyzed by acid or base.",
      points: 15
    },
    {
      id: "acid-7",
      question: "What is the product when ethyl acetate undergoes hydrolysis with NaOH?",
      type: "multiple-choice",
      options: ["Acetic acid and ethanol", "Acetyl chloride", "Acetaldehyde", "No reaction"],
      correctAnswer: "Acetic acid and ethanol",
      explanation: "Ester hydrolysis with base (saponification) gives carboxylic acid salt and alcohol. Ethyl acetate → sodium acetate + ethanol.",
      points: 15
    },
    {
      id: "acid-8",
      question: "What is the intermediate in nucleophilic acyl substitution?",
      type: "multiple-choice",
      options: ["Carbocation", "Tetrahedral intermediate", "Carbanion", "Radical"],
      correctAnswer: "Tetrahedral intermediate",
      explanation: "Nucleophilic acyl substitution proceeds via a tetrahedral intermediate (sp3 carbon) before elimination.",
      points: 15
    },
    {
      id: "acid-9",
      question: "What is the product when benzoyl chloride reacts with water?",
      type: "multiple-choice",
      options: ["Benzoic acid", "Benzaldehyde", "Benzamide", "No reaction"],
      correctAnswer: "Benzoic acid",
      explanation: "Acid chlorides hydrolyze readily with water to give carboxylic acids. Benzoyl chloride → benzoic acid.",
      points: 15
    },
    {
      id: "acid-10",
      question: "What is the product when propanoic acid reacts with PCl5?",
      type: "multiple-choice",
      options: ["Propanoyl chloride", "Propanoic anhydride", "Propanamide", "No reaction"],
      correctAnswer: "Propanoyl chloride",
      explanation: "PCl5 converts carboxylic acids to acid chlorides. Propanoic acid → propanoyl chloride.",
      points: 15
    },
    {
      id: "acid-11",
      question: "What is decarboxylation?",
      type: "short-answer",
      correctAnswer: "Loss of CO2 from carboxylic acid",
      explanation: "Decarboxylation removes CO2 from beta-keto acids or malonic esters, giving enol that tautomerizes to ketone.",
      points: 15
    },
    {
      id: "acid-12",
      question: "What is the product when methyl benzoate reacts with LiAlH4?",
      type: "multiple-choice",
      options: ["Benzyl alcohol", "Benzoic acid", "Benzaldehyde", "No reaction"],
      correctAnswer: "Benzyl alcohol",
      explanation: "LiAlH4 reduces esters to primary alcohols. Methyl benzoate → benzyl alcohol + methanol.",
      points: 15
    },
    {
      id: "acid-13",
      question: "What is the product when acetic anhydride reacts with water?",
      type: "multiple-choice",
      options: ["Two acetic acids", "Acetyl chloride", "Acetaldehyde", "No reaction"],
      correctAnswer: "Two acetic acids",
      explanation: "Acid anhydrides hydrolyze to give two equivalents of carboxylic acid. Acetic anhydride → 2 CH3COOH.",
      points: 15
    },
    {
      id: "acid-14",
      question: "What is the product when butanoic acid reacts with thionyl chloride then ammonia?",
      type: "multiple-choice",
      options: ["Butanamide", "Butanoic anhydride", "Butanal", "No reaction"],
      correctAnswer: "Butanamide",
      explanation: "Acid → acid chloride (SOCl2) → amide (NH3). Butanoic acid → butanoyl chloride → butanamide.",
      points: 15
    },
    {
      id: "acid-15",
      question: "Why are amides the least reactive carboxylic acid derivative?",
      type: "short-answer",
      correctAnswer: "NH2- is a poor leaving group and resonance stabilizes amide",
      explanation: "Amides are least reactive because NH2- is a very poor leaving group and the amide has significant resonance stabilization.",
      points: 15
    }
  ],
  "enolates-aldol-claisen": [
    {
      id: "enol-1",
      question: "What is the alpha position in a carbonyl compound?",
      type: "short-answer",
      correctAnswer: "Carbon adjacent to carbonyl carbon",
      explanation: "The alpha carbon is the carbon directly adjacent to the carbonyl carbon. Alpha hydrogens are on the alpha carbon.",
      points: 15
    },
    {
      id: "enol-2",
      question: "What is an enolate?",
      type: "short-answer",
      correctAnswer: "Deprotonated enol, resonance-stabilized carbanion",
      explanation: "An enolate is formed by deprotonating the alpha carbon of a carbonyl, giving a resonance-stabilized carbanion.",
      points: 15
    },
    {
      id: "enol-3",
      question: "What is the product of an aldol addition?",
      type: "multiple-choice",
      options: ["Beta-hydroxy carbonyl", "Alpha,beta-unsaturated carbonyl", "Ketone", "Alcohol"],
      correctAnswer: "Beta-hydroxy carbonyl",
      explanation: "Aldol addition gives beta-hydroxy carbonyl compounds. Aldol condensation (with dehydration) gives enones.",
      points: 15
    },
    {
      id: "enol-4",
      question: "What is required for a Claisen condensation?",
      type: "multiple-choice",
      options: ["At least one alpha H", "Matching alkoxide base", "Both", "Neither"],
      correctAnswer: "Both",
      explanation: "Claisen requires at least one ester to have alpha H, and the base alkoxide must match the ester alkoxide.",
      points: 15
    },
    {
      id: "enol-5",
      question: "What is the difference between kinetic and thermodynamic enolate?",
      type: "short-answer",
      correctAnswer: "Kinetic = less substituted, faster; Thermodynamic = more substituted, more stable",
      explanation: "Kinetic enolate forms faster (less substituted, less stable). Thermodynamic enolate is more stable (more substituted).",
      points: 15
    },
    {
      id: "enol-6",
      question: "What base gives kinetic enolate?",
      type: "multiple-choice",
      options: ["LDA", "NaH", "Both", "Neither"],
      correctAnswer: "Both",
      explanation: "Strong, bulky bases like LDA or NaH at low temperature favor kinetic (less substituted) enolate.",
      points: 15
    },
    {
      id: "enol-7",
      question: "What is the product when acetaldehyde undergoes aldol addition?",
      type: "multiple-choice",
      options: ["3-hydroxybutanal", "Crotonaldehyde", "Butanal", "No reaction"],
      correctAnswer: "3-hydroxybutanal",
      explanation: "Aldol addition of acetaldehyde gives 3-hydroxybutanal (beta-hydroxy aldehyde).",
      points: 15
    },
    {
      id: "enol-8",
      question: "What is the product of a Claisen condensation of ethyl acetate?",
      type: "multiple-choice",
      options: ["Acetoacetic ester", "Ethyl acetoacetate", "Both are correct", "No reaction"],
      correctAnswer: "Both are correct",
      explanation: "Claisen of ethyl acetate gives ethyl acetoacetate (also called acetoacetic ester).",
      points: 15
    },
    {
      id: "enol-9",
      question: "What is Michael addition?",
      type: "short-answer",
      correctAnswer: "Conjugate addition of enolate to alpha,beta-unsaturated carbonyl",
      explanation: "Michael addition is 1,4-addition of an enolate to an alpha,beta-unsaturated carbonyl (conjugate addition).",
      points: 15
    },
    {
      id: "enol-10",
      question: "What is the product when propanal undergoes aldol condensation?",
      type: "multiple-choice",
      options: ["3-hydroxy-2-methylpentanal", "2-methyl-2-pentenal", "2-pentenal", "No reaction"],
      correctAnswer: "2-methyl-2-pentenal",
      explanation: "Aldol condensation (with dehydration) gives alpha,beta-unsaturated carbonyl. Propanal → 2-methyl-2-pentenal.",
      points: 15
    },
    {
      id: "enol-11",
      question: "What is the product when ethyl propanoate undergoes Claisen condensation?",
      type: "multiple-choice",
      options: ["Ethyl 2-methyl-3-oxopentanoate", "Ethyl acetoacetate", "Propanoic acid", "No reaction"],
      correctAnswer: "Ethyl 2-methyl-3-oxopentanoate",
      explanation: "Claisen of ethyl propanoate gives ethyl 2-methyl-3-oxopentanoate (beta-keto ester).",
      points: 15
    },
    {
      id: "enol-12",
      question: "What is the purpose of enolate formation?",
      type: "short-answer",
      correctAnswer: "To create nucleophilic carbon for C-C bond formation",
      explanation: "Enolates are nucleophilic carbons that can attack electrophiles (like other carbonyls) to form C-C bonds.",
      points: 15
    },
    {
      id: "enol-13",
      question: "What is the product when acetone reacts with benzaldehyde in aldol?",
      type: "multiple-choice",
      options: ["4-phenyl-4-hydroxy-2-butanone", "Benzalacetone", "Both possible", "No reaction"],
      correctAnswer: "Both possible",
      explanation: "Can give aldol addition product (beta-hydroxy) or condensation product (enone) depending on conditions.",
      points: 15
    },
    {
      id: "enol-14",
      question: "What is the difference between aldol addition and aldol condensation?",
      type: "short-answer",
      correctAnswer: "Condensation includes dehydration step",
      explanation: "Aldol addition gives beta-hydroxy carbonyl. Aldol condensation includes dehydration to give alpha,beta-unsaturated carbonyl.",
      points: 15
    },
    {
      id: "enol-15",
      question: "What is the product when 2-butanone undergoes Michael addition with methyl vinyl ketone?",
      type: "multiple-choice",
      options: ["1,5-dicarbonyl", "1,4-dicarbonyl", "1,3-dicarbonyl", "No reaction"],
      correctAnswer: "1,5-dicarbonyl",
      explanation: "Michael addition gives 1,5-dicarbonyl products (enolate adds to beta position of enone).",
      points: 15
    }
  ],
  "aromatic-chemistry": [
    {
      id: "arom-1",
      question: "What makes a compound aromatic?",
      type: "short-answer",
      correctAnswer: "Planar, cyclic, conjugated, 4n+2 pi electrons (Hückel's rule)",
      explanation: "Aromatic compounds are planar, cyclic, fully conjugated, and have 4n+2 pi electrons (Hückel's rule).",
      points: 15
    },
    {
      id: "arom-2",
      question: "What is the mechanism of electrophilic aromatic substitution?",
      type: "multiple-choice",
      options: ["SN1", "SN2", "Addition-elimination", "Elimination-addition"],
      correctAnswer: "Addition-elimination",
      explanation: "EAS proceeds via addition-elimination: electrophile adds to form sigma complex, then H+ leaves to restore aromaticity.",
      points: 15
    },
    {
      id: "arom-3",
      question: "What is an ortho/para director?",
      type: "short-answer",
      correctAnswer: "Substituent that directs EAS to ortho and para positions",
      explanation: "Ortho/para directors are activating groups (electron-donating) that direct substitution to positions ortho and para to themselves.",
      points: 15
    },
    {
      id: "arom-4",
      question: "Which is an ortho/para director?",
      type: "multiple-choice",
      options: ["NO2", "CN", "OH", "CO2H"],
      correctAnswer: "OH",
      explanation: "OH is an activating ortho/para director. NO2, CN, CO2H are deactivating meta directors.",
      points: 15
    },
    {
      id: "arom-5",
      question: "What is the major product when toluene undergoes nitration?",
      type: "multiple-choice",
      options: ["ortho-nitrotoluene", "meta-nitrotoluene", "para-nitrotoluene", "Equal mixture"],
      correctAnswer: "para-nitrotoluene",
      explanation: "Methyl is ortho/para director. Para is favored over ortho due to steric hindrance. Major product: para-nitrotoluene.",
      points: 15
    },
    {
      id: "arom-6",
      question: "What is the major product when nitrobenzene undergoes bromination?",
      type: "multiple-choice",
      options: ["ortho-bromonitrobenzene", "meta-bromonitrobenzene", "para-bromonitrobenzene", "No reaction"],
      correctAnswer: "meta-bromonitrobenzene",
      explanation: "NO2 is a strong deactivating meta director. Bromination gives meta-bromonitrobenzene.",
      points: 15
    },
    {
      id: "arom-7",
      question: "What is Friedel-Crafts alkylation?",
      type: "short-answer",
      correctAnswer: "EAS with carbocation to add alkyl group",
      explanation: "Friedel-Crafts alkylation uses alkyl halide + Lewis acid to generate carbocation that adds to aromatic ring.",
      points: 15
    },
    {
      id: "arom-8",
      question: "What is the limitation of Friedel-Crafts alkylation?",
      type: "multiple-choice",
      options: ["Rearrangements occur", "Polyalkylation", "Doesn't work with deactivated rings", "All of the above"],
      correctAnswer: "All of the above",
      explanation: "FC alkylation has limitations: carbocations rearrange, polyalkylation occurs, and it fails with deactivated rings.",
      points: 15
    },
    {
      id: "arom-9",
      question: "What is the major product when anisole (methoxybenzene) undergoes Friedel-Crafts acylation?",
      type: "multiple-choice",
      options: ["ortho-methoxyacetophenone", "meta-methoxyacetophenone", "para-methoxyacetophenone", "No reaction"],
      correctAnswer: "para-methoxyacetophenone",
      explanation: "Methoxy is strong ortho/para director. Para is favored. FC acylation gives para-methoxyacetophenone.",
      points: 15
    },
    {
      id: "arom-10",
      question: "What is the purpose of sulfonation in synthesis?",
      type: "short-answer",
      correctAnswer: "Blocking group - can be removed later",
      explanation: "Sulfonation is reversible. SO3H can block a position, then be removed with H2O/H+ to allow other substitutions.",
      points: 15
    },
    {
      id: "arom-11",
      question: "What is the order of steps to make m-bromonitrobenzene from benzene?",
      type: "short-answer",
      correctAnswer: "Nitration first, then bromination",
      explanation: "Must do nitration first (NO2 is meta director), then bromination gives meta product. Reverse order gives wrong product.",
      points: 15
    },
    {
      id: "arom-12",
      question: "What is the major product when phenol undergoes nitration?",
      type: "multiple-choice",
      options: ["ortho-nitrophenol", "meta-nitrophenol", "para-nitrophenol", "2,4-dinitrophenol"],
      correctAnswer: "2,4-dinitrophenol",
      explanation: "OH is strong activator. Under standard conditions, gives dinitration. Major: 2,4-dinitrophenol.",
      points: 15
    },
    {
      id: "arom-13",
      question: "What is the difference between Friedel-Crafts alkylation and acylation?",
      type: "short-answer",
      correctAnswer: "Alkylation uses R+ (rearranges), Acylation uses RCO+ (no rearrangement)",
      explanation: "FC alkylation uses carbocation (rearranges). FC acylation uses acyl cation (no rearrangement, deactivates ring).",
      points: 15
    },
    {
      id: "arom-14",
      question: "What is the major product when chlorobenzene undergoes nitration?",
      type: "multiple-choice",
      options: ["ortho-chloronitrobenzene", "meta-chloronitrobenzene", "para-chloronitrobenzene", "Equal mixture"],
      correctAnswer: "para-chloronitrobenzene",
      explanation: "Cl is ortho/para director (weak). Para is favored over ortho. Major: para-chloronitrobenzene.",
      points: 15
    },
    {
      id: "arom-15",
      question: "What is the sigma complex in EAS?",
      type: "short-answer",
      correctAnswer: "Intermediate with sp3 carbon, breaks aromaticity temporarily",
      explanation: "Sigma complex is the intermediate where electrophile adds to ring, creating sp3 carbon and breaking aromaticity. H+ leaves to restore aromaticity.",
      points: 15
    }
  ],
  "amines": [
    {
      id: "amin-1",
      question: "What is the order of basicity for amines?",
      type: "multiple-choice",
      options: ["Primary > Secondary > Tertiary", "Tertiary > Secondary > Primary", "All equal", "Depends on substituents"],
      correctAnswer: "Depends on substituents",
      explanation: "Basicity depends on substituents. In gas phase: tertiary > secondary > primary. In water: secondary > primary > tertiary (solvation effects).",
      points: 15
    },
    {
      id: "amin-2",
      question: "Why is aniline less basic than alkyl amines?",
      type: "short-answer",
      correctAnswer: "Resonance delocalizes lone pair into benzene ring",
      explanation: "Aniline's lone pair is delocalized into the benzene ring via resonance, making it less available for protonation (less basic).",
      points: 15
    },
    {
      id: "amin-3",
      question: "What is reductive amination?",
      type: "short-answer",
      correctAnswer: "Carbonyl + amine + reducing agent → amine",
      explanation: "Reductive amination converts carbonyls to amines: carbonyl forms imine with amine, then reducing agent (NaBH4 or H2/Pd) reduces imine to amine.",
      points: 15
    },
    {
      id: "amin-4",
      question: "What is the product when benzaldehyde reacts with methylamine then NaBH4?",
      type: "multiple-choice",
      options: ["Benzylamine", "N-methylbenzylamine", "Benzamide", "No reaction"],
      correctAnswer: "N-methylbenzylamine",
      explanation: "Reductive amination: benzaldehyde + CH3NH2 → imine, then NaBH4 reduces to N-methylbenzylamine.",
      points: 15
    },
    {
      id: "amin-5",
      question: "What is the product when an amide is reduced with LiAlH4?",
      type: "multiple-choice",
      options: ["Amine", "Aldehyde", "Carboxylic acid", "No reaction"],
      correctAnswer: "Amine",
      explanation: "LiAlH4 reduces amides to amines. Primary amide → primary amine, secondary amide → secondary amine, etc.",
      points: 15
    },
    {
      id: "amin-6",
      question: "What is the Gabriel synthesis?",
      type: "short-answer",
      correctAnswer: "Method to make primary amines from alkyl halides",
      explanation: "Gabriel synthesis: phthalimide + alkyl halide → N-alkylphthalimide, then hydrazine removes phthaloyl to give primary amine.",
      points: 15
    },
    {
      id: "amin-7",
      question: "What is the product when acetamide is reduced with LiAlH4?",
      type: "multiple-choice",
      options: ["Ethylamine", "Acetaldehyde", "Acetic acid", "No reaction"],
      correctAnswer: "Ethylamine",
      explanation: "LiAlH4 reduces amides to amines. Acetamide (CH3CONH2) → ethylamine (CH3CH2NH2).",
      points: 15
    },
    {
      id: "amin-8",
      question: "Why are amides weak bases?",
      type: "short-answer",
      correctAnswer: "Lone pair is delocalized into carbonyl",
      explanation: "Amide lone pair is delocalized into the carbonyl via resonance, making it unavailable for protonation (very weak base).",
      points: 15
    },
    {
      id: "amin-9",
      question: "What is the product when aniline is treated with NaNO2/HCl then CuCN?",
      type: "multiple-choice",
      options: ["Benzonitrile", "Benzamide", "Benzylamine", "No reaction"],
      correctAnswer: "Benzonitrile",
      explanation: "Sandmeyer reaction: aniline → diazonium salt (NaNO2/HCl), then CuCN replaces N2 with CN to give benzonitrile.",
      points: 15
    },
    {
      id: "amin-10",
      question: "What is the product when benzylamine reacts with acetic anhydride?",
      type: "multiple-choice",
      options: ["N-benzylacetamide", "Benzamide", "Benzyl acetate", "No reaction"],
      correctAnswer: "N-benzylacetamide",
      explanation: "Amines react with acid anhydrides to give amides. Benzylamine + acetic anhydride → N-benzylacetamide.",
      points: 15
    },
    {
      id: "amin-11",
      question: "What is the difference between primary, secondary, and tertiary amines?",
      type: "short-answer",
      correctAnswer: "Number of alkyl groups on nitrogen",
      explanation: "Primary: 1 alkyl group, Secondary: 2 alkyl groups, Tertiary: 3 alkyl groups on nitrogen.",
      points: 15
    },
    {
      id: "amin-12",
      question: "What is the product when methylamine reacts with benzoyl chloride?",
      type: "multiple-choice",
      options: ["N-methylbenzamide", "Benzamide", "Benzylamine", "No reaction"],
      correctAnswer: "N-methylbenzamide",
      explanation: "Amines react with acid chlorides to give amides. Methylamine + benzoyl chloride → N-methylbenzamide.",
      points: 15
    },
    {
      id: "amin-13",
      question: "What is the product when aniline is diazotized then treated with H3PO2?",
      type: "multiple-choice",
      options: ["Benzene", "Phenol", "Aniline", "No reaction"],
      correctAnswer: "Benzene",
      explanation: "Diazonium salt with H3PO2 (hypophosphorous acid) reduces to remove N2, giving the parent hydrocarbon. Aniline → benzene.",
      points: 15
    },
    {
      id: "amin-14",
      question: "What is the major product when 2-methylpropanal undergoes reductive amination with ammonia?",
      type: "multiple-choice",
      options: ["2-methylpropanamine", "2-methylpropanamide", "2-methylpropanal", "No reaction"],
      correctAnswer: "2-methylpropanamine",
      explanation: "Reductive amination: aldehyde + NH3 → imine, then reducing agent gives primary amine. 2-methylpropanal → 2-methylpropanamine.",
      points: 15
    },
    {
      id: "amin-15",
      question: "What is the product when aniline is treated with excess methyl iodide?",
      type: "multiple-choice",
      options: ["N-methylaniline", "N,N-dimethylaniline", "Trimethylanilinium iodide", "No reaction"],
      correctAnswer: "Trimethylanilinium iodide",
      explanation: "Excess alkyl halide quaternizes amine. Aniline + 3 CH3I → trimethylanilinium iodide (quaternary ammonium salt).",
      points: 15
    }
  ]
};

export default function ExamPracticeMode({ course, topic }: Props) {
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [problems, setProblems] = useState<Problem[]>([]);
  const [examTitle, setExamTitle] = useState("Practice Exam");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState<Record<string, boolean>>({});

  // Load problems based on topic or use sample
  const availableExams = useMemo(() => {
    const exams: Array<{ id: string; title: string; problems: Problem[]; source: "built-in" | "ai" }> = [];
    const courseTopics = getCourseTopics(course);
    
    if (topic) {
      // Topic-specific exam
      if (SAMPLE_PROBLEMS[topic]) {
        const topicProblems = SAMPLE_PROBLEMS[topic];
        const problemsToUse = topicProblems.slice(0, 15);
        exams.push({
          id: `sample-${topic}`,
          title: `${findTopic(course, topic)?.title || topic.charAt(0).toUpperCase() + topic.slice(1).replace(/-/g, " ")} Practice Exam`,
          problems: problemsToUse,
          source: "built-in"
        });
      } else {
        // No built-in problems, will generate via AI
        exams.push({
          id: `ai-${topic}`,
          title: `${findTopic(course, topic)?.title || topic.charAt(0).toUpperCase() + topic.slice(1).replace(/-/g, " ")} Practice Exam (AI Generated)`,
          problems: [],
          source: "ai"
        });
      }
    } else {
      // Course-wide exams - create exam for each topic
      courseTopics.forEach((t) => {
        if (SAMPLE_PROBLEMS[t.slug]) {
          const topicProblems = SAMPLE_PROBLEMS[t.slug];
          const problemsToUse = topicProblems.slice(0, 10); // Use 10 for course-wide
          exams.push({
            id: `sample-${t.slug}`,
            title: `${t.title} Practice Exam`,
            problems: problemsToUse,
            source: "built-in"
          });
        } else {
          // AI-generated exam option
          exams.push({
            id: `ai-${t.slug}`,
            title: `${t.title} Practice Exam (AI Generated)`,
            problems: [],
            source: "ai"
          });
        }
      });
    }

    return exams;
  }, [topic, course]);

  // Generate AI problems when an AI exam is selected
  useEffect(() => {
    if (selectedExam && selectedExam.startsWith("ai-")) {
      const topicSlug = selectedExam.replace("ai-", "");
      if (!generating[topicSlug] && problems.length === 0) {
        generateAIProblems(course, topicSlug);
      }
    }
  }, [selectedExam, course]);

  async function generateAIProblems(course: CourseId, topicSlug: string) {
    setGenerating((prev) => ({ ...prev, [topicSlug]: true }));
    setLoading(true);
    
    try {
      const response = await fetch(`/api/generate-problems?course=${course}&topic=${topicSlug}&count=15`);
      if (response.ok) {
        const data = await response.json();
        if (data.problems && data.problems.length > 0) {
          setProblems(data.problems);
          const topic = findTopic(course, topicSlug);
          setExamTitle(`${topic?.title || topicSlug} Practice Exam (AI Generated)`);
        }
      }
    } catch (error) {
      console.error("Failed to generate AI problems:", error);
    } finally {
      setLoading(false);
      setGenerating((prev) => ({ ...prev, [topicSlug]: false }));
    }
  }

  const handleSelectExam = (examId: string) => {
    const exam = availableExams.find(e => e.id === examId);
    if (exam) {
      setSelectedExam(examId);
      if (exam.source === "built-in" && exam.problems.length > 0) {
        setProblems(exam.problems);
        setExamTitle(exam.title);
      } else if (exam.source === "ai") {
        // Problems will be generated via useEffect
        setProblems([]);
        setExamTitle(exam.title);
      }
    }
  };

  const handleDownloadWord = async () => {
    try {
      // Use the exam-guide API route to generate Word document
      const params = new URLSearchParams();
      params.set("course", course);
      if (topic) params.set("topic", topic);
      
      const response = await fetch(`/api/exam-guide?${params.toString()}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to generate study guide:", errorText);
        alert(`Failed to download study guide: ${response.status} ${response.statusText}`);
        return;
      }
      
      const blob = await response.blob();
      
      // Check if blob is valid
      if (!blob || blob.size === 0) {
        alert("Failed to generate study guide: Empty response");
        return;
      }
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${topic ? topic.replace(/\s+/g, "-") : examTitle.replace(/\s+/g, "-")}-study-guide.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Error downloading study guide:", error);
      alert(`Error downloading study guide: ${error?.message || "Unknown error"}`);
    }
  };

  if (availableExams.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <div style={{ fontSize: 16, color: "rgba(0, 0, 0, 0.6)" }}>
          No practice exams available. Try selecting a specific topic or course.
        </div>
      </div>
    );
  }

  if (loading && problems.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <div style={{ fontSize: 16, color: "rgba(0, 0, 0, 0.6)" }}>
          Generating practice problems...
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 24 }}>
      {!selectedExam ? (
        <div>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Practice Mode</h2>
            <p style={{ fontSize: 15, color: "rgba(0, 0, 0, 0.6)", lineHeight: 1.6 }}>
              Select an exam to practice. You'll receive immediate feedback on each problem and see your score at the end.
            </p>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {availableExams.map((exam) => (
              <button
                key={exam.id}
                disabled={loading && exam.source === "ai"}
                type="button"
                onClick={() => handleSelectExam(exam.id)}
                style={{
                  padding: 20,
                  textAlign: "left",
                  borderRadius: 16,
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                  background: "white",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#007AFF";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.1)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
                  {exam.title}
                </div>
                <div style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.6)" }}>
                  {exam.source === "built-in" 
                    ? `${exam.problems.length} problems · ${exam.problems.reduce((sum, p) => sum + p.points, 0)} total points`
                    : "AI Generated · Click to generate problems"}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <button
              type="button"
              onClick={() => {
                setSelectedExam("");
                setProblems([]);
              }}
              style={{
                padding: "10px 16px",
                borderRadius: 12,
                border: "1px solid rgba(0, 0, 0, 0.1)",
                background: "white",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600
              }}
            >
              ← Back to Exams
            </button>
            <button
              type="button"
              onClick={handleDownloadWord}
              style={{
                padding: "10px 16px",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg, #007AFF, #5856D6)",
                color: "white",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600
              }}
            >
              Download Study Guide
            </button>
          </div>

          <ExamProblemSolver problems={problems} examTitle={examTitle} />
        </div>
      )}
    </div>
  );
}
