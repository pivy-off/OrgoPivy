// High-quality exam-level problems for homework assignments
// These are comprehensive, well-structured problems suitable for graded assignments

export type HomeworkProblem = {
  id: string;
  question: string;
  type: "multiple-choice" | "short-answer" | "mechanism" | "synthesis" | "drawing";
  options?: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
  courseId: "orgochem-1" | "orgochem-2";
  rubric?: {
    fullCredit: string;
    partialCredit: string[];
    commonMistakes: string[];
  };
};

export const HOMEWORK_PROBLEMS: Record<string, HomeworkProblem[]> = {
  "alkanes": [
    {
      id: "hw-alk-1",
      question: "What is the IUPAC name for (CH₃)₂CHCH₂CH(CH₃)₂?",
      type: "multiple-choice",
      options: [
        "2,4-dimethylpentane",
        "1,1,3-trimethylbutane",
        "2-methyl-4-methylpentane",
        "isoheptane"
      ],
      correctAnswer: "2,4-dimethylpentane",
      explanation: "The longest continuous chain has 5 carbons (pentane). There are two methyl groups, one on carbon 2 and one on carbon 4. When numbering, we choose the direction that gives the lowest numbers to substituents. Both methyl groups get the same number regardless of direction, so 2,4-dimethylpentane is correct.",
      points: 10,
      difficulty: "medium",
      topic: "alkanes",
      courseId: "orgochem-1",
      rubric: {
        fullCredit: "Correctly identifies longest chain (5 carbons), numbers to give lowest substituent numbers, and names both methyl groups correctly",
        partialCredit: [
          "Identifies pentane but wrong numbering (e.g., 1,3-dimethylpentane)",
          "Correct chain but misses one methyl group",
          "Correct structure but wrong alphabetical order"
        ],
        commonMistakes: [
          "Counting the longest chain incorrectly",
          "Not numbering from the correct end",
          "Incorrect alphabetical ordering of substituents"
        ]
      }
    },
    {
      id: "hw-alk-2",
      question: "Draw the Newman projection for the most stable conformation of butane. Explain why this conformation is most stable.",
      type: "drawing",
      correctAnswer: "Anti conformation with methyl groups 180° apart",
      explanation: "The anti conformation is most stable because the methyl groups are 180° apart, minimizing steric interactions. In this conformation, there are no gauche interactions between the methyl groups, resulting in the lowest energy state.",
      points: 15,
      difficulty: "hard",
      topic: "alkanes",
      courseId: "orgochem-1",
      rubric: {
        fullCredit: "Draws correct anti Newman projection with methyl groups 180° apart and explains steric minimization",
        partialCredit: [
          "Draws anti conformation but explanation is incomplete",
          "Correct drawing but doesn't explain steric interactions",
          "Identifies anti but drawing has minor errors"
        ],
        commonMistakes: [
          "Confusing anti with gauche",
          "Not understanding 180° relationship",
          "Incorrect explanation of stability factors"
        ]
      }
    },
    {
      id: "hw-alk-3",
      question: "Rank the following alkanes in order of increasing boiling point: hexane, 2-methylpentane, 3-methylpentane, 2,2-dimethylbutane. Explain your reasoning.",
      type: "short-answer",
      correctAnswer: "2,2-dimethylbutane < 2-methylpentane < 3-methylpentane < hexane. Boiling point increases with surface area and decreases with branching due to reduced London dispersion forces.",
      explanation: "Straight-chain alkanes have higher boiling points than branched isomers because they have more surface area for London dispersion forces. More branching reduces surface area and decreases boiling point. Hexane (straight chain) has the highest, while 2,2-dimethylbutane (most branched) has the lowest.",
      points: 12,
      difficulty: "medium",
      topic: "alkanes",
      courseId: "orgochem-1",
      rubric: {
        fullCredit: "Correct order and explains relationship between branching and intermolecular forces",
        partialCredit: [
          "Correct order but incomplete explanation",
          "Correct concept but wrong order",
          "Mentions surface area but doesn't connect to London forces"
        ],
        commonMistakes: [
          "Thinking molecular weight alone determines boiling point",
          "Not understanding effect of branching",
          "Confusing intermolecular forces"
        ]
      }
    }
  ],
  "substitution-elimination": [
    {
      id: "hw-sub-1",
      question: "Predict the major product and mechanism for the reaction: (CH₃)₃CBr + CH₃OH (excess) at room temperature. Explain your reasoning step by step.",
      type: "synthesis",
      correctAnswer: "SN1 mechanism, product: (CH₃)₃COCH₃. Tertiary substrate + weak nucleophile favors SN1. The carbocation intermediate is stable.",
      explanation: "Tertiary alkyl halide (CH₃)₃CBr with a weak nucleophile (CH₃OH) favors SN1 mechanism. The tertiary carbocation is stable, and methanol acts as both solvent and nucleophile. The product is methyl tert-butyl ether (CH₃)₃COCH₃. Racemization occurs due to planar carbocation intermediate.",
      points: 15,
      difficulty: "hard",
      topic: "substitution-elimination",
      courseId: "orgochem-1",
      rubric: {
        fullCredit: "Identifies SN1 mechanism, draws correct product, explains substrate/nucleophile analysis, mentions carbocation stability and racemization",
        partialCredit: [
          "Correct mechanism but wrong product",
          "Correct product but incomplete mechanism explanation",
          "Identifies SN1 but doesn't explain why",
          "Mentions carbocation but misses racemization"
        ],
        commonMistakes: [
          "Confusing SN1 with SN2",
          "Not considering nucleophile strength",
          "Forgetting about stereochemistry",
          "Incorrect product structure"
        ]
      }
    },
    {
      id: "hw-sub-2",
      question: "Which reaction will proceed faster: CH₃CH₂Br + NaI in acetone, or CH₃CH₂Br + NaI in ethanol? Explain using the concepts of solvent effects.",
      type: "short-answer",
      correctAnswer: "Acetone (polar aprotic) will be faster. Polar aprotic solvents don't solvate nucleophiles, keeping them more reactive for SN2 reactions.",
      explanation: "Acetone is a polar aprotic solvent, while ethanol is polar protic. In SN2 reactions, polar aprotic solvents don't solvate nucleophiles strongly, keeping them 'naked' and more reactive. Polar protic solvents solvate nucleophiles, reducing their nucleophilicity. Since I⁻ is a strong nucleophile and CH₃CH₂Br is a primary substrate (favoring SN2), the reaction in acetone will be faster.",
      points: 12,
      difficulty: "medium",
      topic: "substitution-elimination",
      courseId: "orgochem-1",
      rubric: {
        fullCredit: "Correctly identifies acetone as faster, explains polar aprotic vs protic, and connects to nucleophile solvation",
        partialCredit: [
          "Correct answer but incomplete explanation",
          "Mentions solvent type but doesn't explain mechanism",
          "Correct concept but wrong conclusion"
        ],
        commonMistakes: [
          "Confusing polar aprotic with polar protic",
          "Not understanding solvation effects",
          "Thinking all polar solvents are the same"
        ]
      }
    },
    {
      id: "hw-sub-3",
      question: "Draw the complete mechanism for the SN2 reaction between CH₃Br and OH⁻. Include all curved arrows, intermediates (if any), and show stereochemistry.",
      type: "mechanism",
      correctAnswer: "Backside attack mechanism with inversion of configuration, no intermediate, one-step concerted process",
      explanation: "SN2 is a one-step concerted mechanism. The OH⁻ nucleophile attacks from the backside (opposite the leaving group), forming a transition state where the C-Br bond is partially broken and the C-O bond is partially formed. The reaction proceeds with inversion of configuration (Walden inversion). No intermediate is formed.",
      points: 15,
      difficulty: "hard",
      topic: "substitution-elimination",
      courseId: "orgochem-1",
      rubric: {
        fullCredit: "Shows correct backside attack, curved arrows, transition state, inversion of configuration, and notes concerted mechanism",
        partialCredit: [
          "Correct arrows but missing transition state",
          "Shows mechanism but misses stereochemistry",
          "Correct concept but arrow direction errors",
          "Missing some key features"
        ],
        commonMistakes: [
          "Drawing an intermediate (SN2 has no intermediate)",
          "Wrong arrow direction",
          "Not showing backside attack",
          "Missing stereochemistry",
          "Incorrect transition state structure"
        ]
      }
    }
  ],
  "stereochemistry": [
    {
      id: "hw-stereo-1",
      question: "Assign R or S configuration to the stereocenter in the following molecule: [Molecule with stereocenter]. Show your work using CIP priority rules.",
      type: "short-answer",
      correctAnswer: "R or S (depending on specific molecule provided)",
      explanation: "To assign R/S: 1) Assign CIP priorities based on atomic number (higher = higher priority), 2) If tied, compare next atoms, 3) Put lowest priority group in back, 4) Trace from priority 1→2→3: clockwise = R, counterclockwise = S.",
      points: 15,
      difficulty: "hard",
      topic: "stereochemistry",
      courseId: "orgochem-1",
      rubric: {
        fullCredit: "Correctly assigns priorities, puts lowest priority in back, traces correctly, and gives correct R/S assignment",
        partialCredit: [
          "Correct priorities but wrong R/S assignment",
          "Correct concept but calculation error",
          "Missing one step in the process",
          "Correct answer but no work shown"
        ],
        commonMistakes: [
          "Incorrect priority assignment",
          "Not putting lowest priority in back",
          "Wrong direction of tracing",
          "Confusing R and S"
        ]
      }
    },
    {
      id: "hw-stereo-2",
      question: "Are the following pairs enantiomers, diastereomers, identical, or constitutional isomers? Explain: (a) (R)-2-butanol and (S)-2-butanol, (b) meso-tartaric acid and (R,R)-tartaric acid.",
      type: "short-answer",
      correctAnswer: "(a) Enantiomers - non-superimposable mirror images. (b) Diastereomers - stereoisomers that are not mirror images.",
      explanation: "(a) (R)-2-butanol and (S)-2-butanol are enantiomers because they are non-superimposable mirror images with opposite configurations at the stereocenter. (b) meso-tartaric acid has a plane of symmetry (achiral despite having stereocenters), while (R,R)-tartaric acid is chiral. They are diastereomers because they are stereoisomers but not mirror images.",
      points: 12,
      difficulty: "medium",
      topic: "stereochemistry",
      courseId: "orgochem-1",
      rubric: {
        fullCredit: "Correctly identifies both pairs and explains the relationship with proper terminology",
        partialCredit: [
          "Correct identification but incomplete explanation",
          "One correct, one incorrect",
          "Correct concept but wrong terminology"
        ],
        commonMistakes: [
          "Confusing enantiomers with diastereomers",
          "Not understanding meso compounds",
          "Missing the mirror image concept",
          "Confusing with constitutional isomers"
        ]
      }
    }
  ],
  "alkenes": [
    {
      id: "hw-alkene-1",
      question: "Predict the major product(s) and mechanism for: CH₃CH=CH₂ + HBr. Show the complete mechanism with all steps, intermediates, and explain regioselectivity.",
      type: "mechanism",
      correctAnswer: "Markovnikov addition: CH₃CHBrCH₃. Mechanism: protonation forms secondary carbocation, then Br⁻ attacks. Regioselectivity due to more stable carbocation intermediate.",
      explanation: "HBr adds to propene via electrophilic addition. H⁺ adds first, forming the more stable secondary carbocation (CH₃CH⁺CH₃) rather than the less stable primary carbocation. Br⁻ then attacks the carbocation. This follows Markovnikov's rule: H adds to the less substituted carbon, Br to the more substituted carbon. The mechanism involves: 1) Protonation to form carbocation, 2) Nucleophilic attack by Br⁻.",
      points: 18,
      difficulty: "hard",
      topic: "alkenes",
      courseId: "orgochem-1",
      rubric: {
        fullCredit: "Correct product, complete mechanism with arrows, identifies carbocation intermediate, explains Markovnikov rule and stability",
        partialCredit: [
          "Correct product but incomplete mechanism",
          "Correct mechanism but wrong product",
          "Missing regioselectivity explanation",
          "Mechanism has minor errors"
        ],
        commonMistakes: [
          "Anti-Markovnikov product",
          "Missing carbocation intermediate",
          "Wrong arrow directions",
          "Not explaining stability",
          "Missing stereochemistry considerations"
        ]
      }
    },
    {
      id: "hw-alkene-2",
      question: "Compare and contrast syn addition vs anti addition in alkene reactions. Give one example of each and explain why each occurs.",
      type: "short-answer",
      correctAnswer: "Syn addition: both groups add from same face (e.g., catalytic hydrogenation). Anti addition: groups add from opposite faces (e.g., halogen addition). Syn occurs with concerted mechanisms, anti with cyclic intermediates.",
      explanation: "Syn addition means both new groups add from the same side of the double bond (e.g., catalytic hydrogenation with H₂/Pd, where both H atoms add from the same face in a concerted mechanism). Anti addition means groups add from opposite sides (e.g., Br₂ addition forms a bromonium ion intermediate, then Br⁻ attacks from the backside, resulting in anti addition). The difference comes from the mechanism: concerted (syn) vs cyclic intermediate (anti).",
      points: 15,
      difficulty: "hard",
      topic: "alkenes",
      courseId: "orgochem-1",
      rubric: {
        fullCredit: "Correctly defines both, gives appropriate examples, and explains mechanistic basis for each",
        partialCredit: [
          "Correct definitions but weak examples",
          "Correct examples but incomplete explanation",
          "One correct, one incorrect",
          "Missing mechanistic explanation"
        ],
        commonMistakes: [
          "Confusing syn with anti",
          "Wrong examples",
          "Not understanding mechanistic basis",
          "Missing stereochemistry"
        ]
      }
    }
  ],
  "cycloalkanes": [
    {
      id: "hw-cyclo-1",
      question: "Draw the chair conformation of trans-1,4-dimethylcyclohexane. Identify which conformation is more stable and explain why.",
      type: "drawing",
      correctAnswer: "Both methyl groups equatorial is most stable. Trans means one up, one down, so both can be equatorial.",
      explanation: "In trans-1,4-dimethylcyclohexane, the methyl groups are on opposite sides. The most stable conformation has both methyl groups in equatorial positions, avoiding 1,3-diaxial interactions. The diequatorial conformation is significantly more stable than the diaxial conformation.",
      points: 15,
      difficulty: "hard",
      topic: "cycloalkanes",
      courseId: "orgochem-1",
      rubric: {
        fullCredit: "Draws correct chair with both methyls equatorial, identifies as most stable, explains 1,3-diaxial interactions",
        partialCredit: [
          "Correct drawing but incomplete explanation",
          "Identifies stability but doesn't explain why",
          "Minor drawing errors but correct concept"
        ],
        commonMistakes: [
          "Confusing axial with equatorial",
          "Not understanding trans relationship",
          "Missing 1,3-diaxial interaction concept"
        ]
      }
    },
    {
      id: "hw-cyclo-2",
      question: "Explain why cyclohexane adopts a chair conformation rather than a planar hexagon. Include discussion of angle strain and torsional strain.",
      type: "short-answer",
      correctAnswer: "Chair conformation minimizes both angle strain (109.5° angles) and torsional strain (staggered bonds). Planar hexagon would have severe angle strain (120° vs 109.5°) and eclipsed bonds.",
      explanation: "Cyclohexane adopts a chair conformation to minimize strain. In the chair, all C-C-C angles are close to the ideal 109.5° (no angle strain), and all bonds are staggered (minimal torsional strain). A planar hexagon would force 120° angles (angle strain) and eclipsed bonds (torsional strain), making it much higher in energy.",
      points: 12,
      difficulty: "medium",
      topic: "cycloalkanes",
      courseId: "orgochem-1",
      rubric: {
        fullCredit: "Explains both angle and torsional strain, compares chair to planar, mentions bond angles and staggered/eclipsed",
        partialCredit: [
          "Mentions one type of strain but not both",
          "Correct concept but incomplete comparison",
          "Missing specific angle values"
        ],
        commonMistakes: [
          "Only mentioning one type of strain",
          "Not comparing to planar structure",
          "Confusing strain types"
        ]
      }
    }
  ],
  "spectroscopy": [
    {
      id: "hw-spec-1",
      question: "A compound with molecular formula C₄H₈O shows an IR absorption at 1715 cm⁻¹ and a ¹H NMR signal at 2.1 ppm (singlet, 3H). Propose a structure and explain your reasoning.",
      type: "synthesis",
      correctAnswer: "CH₃COCH₂CH₃ (butanone). IR indicates C=O, NMR singlet at 2.1 ppm indicates CH₃ adjacent to C=O.",
      explanation: "The IR absorption at 1715 cm⁻¹ indicates a carbonyl group (C=O). The ¹H NMR singlet at 2.1 ppm with 3H integration suggests a methyl group adjacent to the carbonyl (typical chemical shift for CH₃-C=O). With formula C₄H₈O, this is consistent with a ketone. The structure is CH₃COCH₂CH₃ (butanone).",
      points: 15,
      difficulty: "hard",
      topic: "spectroscopy",
      courseId: "orgochem-1",
      rubric: {
        fullCredit: "Correct structure, identifies IR peak as C=O, explains NMR chemical shift, uses molecular formula correctly",
        partialCredit: [
          "Correct structure but incomplete explanation",
          "Identifies functional group but wrong structure",
          "Correct concept but missing NMR analysis"
        ],
        commonMistakes: [
          "Not using molecular formula",
          "Wrong IR interpretation",
          "Incorrect NMR chemical shift assignment",
          "Missing integration analysis"
        ]
      }
    },
    {
      id: "hw-spec-2",
      question: "Explain how you would distinguish between an aldehyde and a ketone using IR spectroscopy. What specific signals would you look for?",
      type: "short-answer",
      correctAnswer: "Aldehydes show C-H stretch at ~2700-2800 cm⁻¹ (two weak bands) in addition to C=O at ~1720-1740 cm⁻¹. Ketones only show C=O at ~1715 cm⁻¹, no aldehyde C-H stretch.",
      explanation: "Both aldehydes and ketones show C=O stretching around 1700-1750 cm⁻¹. However, aldehydes have a unique C-H stretch from the aldehyde hydrogen at ~2700-2800 cm⁻¹ (appears as two weak bands). Ketones do not have this signal. This is the key distinguishing feature.",
      points: 10,
      difficulty: "medium",
      topic: "spectroscopy",
      courseId: "orgochem-1",
      rubric: {
        fullCredit: "Identifies aldehyde C-H stretch at ~2700-2800 cm⁻¹, explains both show C=O, notes ketones lack aldehyde C-H",
        partialCredit: [
          "Mentions C-H stretch but wrong region",
          "Correct concept but incomplete",
          "Only mentions C=O difference"
        ],
        commonMistakes: [
          "Thinking only C=O position differs",
          "Not knowing aldehyde C-H stretch",
          "Wrong wavenumber ranges"
        ]
      }
    }
  ],
  "alcohols": [
    {
      id: "hw-alc-1",
      question: "Predict the product when 1-butanol is treated with PCC. Then predict the product if the same alcohol is treated with CrO₃/H₂SO₄. Explain the difference.",
      type: "synthesis",
      correctAnswer: "PCC gives butanal (aldehyde). CrO₃/H₂SO₄ gives butanoic acid. PCC stops at aldehyde, CrO₃ oxidizes all the way to acid.",
      explanation: "1-butanol is a primary alcohol. PCC (pyridinium chlorochromate) oxidizes primary alcohols to aldehydes and stops there, giving butanal. CrO₃/H₂SO₄ (Jones reagent) is stronger and oxidizes primary alcohols all the way to carboxylic acids, giving butanoic acid. The difference is that PCC is milder and stops at the aldehyde stage.",
      points: 15,
      difficulty: "hard",
      topic: "alcohols",
      courseId: "orgochem-2",
      rubric: {
        fullCredit: "Correct products for both reagents, explains PCC stops at aldehyde, explains CrO₃ goes to acid, mentions reagent strength difference",
        partialCredit: [
          "One correct product but wrong explanation",
          "Correct products but incomplete mechanism explanation",
          "Mentions oxidation but wrong products"
        ],
        commonMistakes: [
          "Confusing PCC with CrO₃",
          "Thinking both give same product",
          "Not understanding oxidation levels",
          "Wrong product structures"
        ]
      }
    }
  ],
  "carbonyls-addition": [
    {
      id: "hw-carb-1",
      question: "Explain why aldehydes are more reactive than ketones toward nucleophilic addition. Use both electronic and steric arguments.",
      type: "short-answer",
      correctAnswer: "Electronic: Aldehydes have less electron-donating groups, making carbonyl carbon more electrophilic. Steric: Aldehydes have less steric hindrance (one R vs two R groups), allowing easier nucleophile approach.",
      explanation: "Aldehydes are more reactive than ketones for two reasons: 1) Electronic: Aldehydes have one alkyl group (electron-donating) while ketones have two, making the carbonyl carbon in aldehydes more electrophilic. 2) Steric: Aldehydes have less steric hindrance around the carbonyl, allowing nucleophiles easier access. Ketones have two bulky R groups that hinder nucleophile approach.",
      points: 12,
      difficulty: "medium",
      topic: "carbonyls-addition",
      courseId: "orgochem-2",
      rubric: {
        fullCredit: "Explains both electronic (electron-donating groups) and steric (hindrance) factors correctly",
        partialCredit: [
          "One factor correct but missing the other",
          "Correct concept but incomplete explanation",
          "Mentions reactivity but doesn't explain why"
        ],
        commonMistakes: [
          "Only mentioning one factor",
          "Confusing electronic with steric",
          "Not understanding electrophilicity",
          "Wrong explanation of reactivity"
        ]
      }
    }
  ],
  "aromatic-chemistry": [
    {
      id: "hw-arom-1",
      question: "Predict the major product when toluene undergoes nitration. Then explain the directing effect of the methyl group and draw the resonance structures that show why it's an ortho/para director.",
      type: "mechanism",
      correctAnswer: "Ortho and para nitrotoluene. Methyl is activating ortho/para director. Resonance shows positive charge stabilized at ortho/para positions.",
      explanation: "Toluene undergoes nitration to give ortho-nitrotoluene and para-nitrotoluene (with para being major due to sterics). The methyl group is an activating ortho/para director. Resonance structures show that when the electrophile attacks ortho or para, the positive charge on the ring can be delocalized onto the methyl group (benzylic position), stabilizing the intermediate. Meta attack doesn't allow this stabilization.",
      points: 18,
      difficulty: "hard",
      topic: "aromatic-chemistry",
      courseId: "orgochem-2",
      rubric: {
        fullCredit: "Correct products (ortho/para), identifies methyl as activating ortho/para director, draws correct resonance structures showing stabilization",
        partialCredit: [
          "Correct products but incomplete resonance explanation",
          "Correct directing effect but wrong products",
          "Resonance structures have minor errors"
        ],
        commonMistakes: [
          "Thinking methyl is meta director",
          "Wrong resonance structures",
          "Not understanding activation vs deactivation",
          "Incorrect product structures"
        ]
      }
    }
  ]
};

// Get problems for a specific topic
export function getHomeworkProblems(topic: string, count?: number): HomeworkProblem[] {
  const problems = HOMEWORK_PROBLEMS[topic] || [];
  return count ? problems.slice(0, count) : problems;
}

// Get all problems for a course
export function getCourseHomeworkProblems(courseId: "orgochem-1" | "orgochem-2"): HomeworkProblem[] {
  const allProblems: HomeworkProblem[] = [];
  Object.values(HOMEWORK_PROBLEMS).forEach(topicProblems => {
    topicProblems.forEach(problem => {
      if (problem.courseId === courseId) {
        allProblems.push(problem);
      }
    });
  });
  return allProblems;
}
