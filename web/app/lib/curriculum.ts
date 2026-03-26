export type CourseId = "orgochem-1" | "orgochem-2";

export type TopicVideo = {
  topic: string;
  subtopic: string;
  title: string;
  channel: string;
  url: string;
  thumbnail: string;
  whyUseful: string;
  level: string;
  length: string;
  bestTime: string;
  useType: string;
};

export type Topic = {
  slug: string;
  title: string;
  shortDesc: string;

  summary: string;
  externalUrl: string;
  externalLabel: string;

  imageUrl?: string;
  imageAlt?: string;

  mustKnow: string[];
  howToStudy: string[];

  hasMechanism: boolean;

  // Optional richer curriculum metadata (Phase 1 upgrade)
  unit?: string;
  prerequisites?: string[];
  skills?: string[];
  commonMistakes?: string[];
  practiceTypes?: string[];
  reviewTriggers?: string[];
  relatedTopics?: string[];
  bestVideos?: TopicVideo[];
  mustKnowMap?: {
    definitions?: string[];
    patterns?: string[];
    reactionsToKnow?: string[];
    mechanismsToKnow?: string[];
    stereochemicalOutcomes?: string[];
    regiochemistry?: string[];
    spectroscopy?: string[];
    classicTraps?: string[];
    minimumPassing?: string;
    targetA?: string;
  };
  masteryGoal?: string;
  studyPlan?: string[];
};

const ORGOCHEM_1: Topic[] = [
  {
    slug: "structure-bonding",
    title: "Structure and Bonding",
    shortDesc: "Hybridization, geometry, formal charge, and polarity as the basis for mechanisms",
    summary:
      "Make structure, hybridization, and formal charge completely automatic so you can focus on mechanisms later. Every acid–base, resonance, and mechanism problem quietly uses these ideas.",
    externalUrl: "https://openstax.org/books/organic-chemistry/pages/1-introduction",
    externalLabel: "OpenStax Organic Chemistry - Structure and Bonding",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/c/cb/Sp3_Hybridized_Orbitals.svg",
    imageAlt: "Illustration of sp3 hybrid orbitals",
    mustKnow: [
      "How to draw complete Lewis structures with all lone pairs and charges",
      "Hybridization patterns sp3 sp2 sp and their typical geometries",
      "What sigma vs pi bonds are and where p orbitals live in a structure",
      "How formal charge is calculated and how it predicts basicity and nucleophilicity",
      "How increasing s character changes acidity and bond strength",
    ],
    howToStudy: [
      "Redraw a page of lecture notes adding all lone pairs and formal charges until it feels natural",
      "Drill 20 mixed structures where you assign hybridization geometry and formal charge for each atom",
      "Create a mini deck of flashcards with one structure on the front and hybridization geometry charges on the back",
      "Once per week redraw a full mechanism from class with all lone pairs and charges as a warmup",
    ],
    hasMechanism: false,
    unit: "Foundations",
    skills: [
      "Assigning hybridization and geometry without hesitation",
      "Tracking formal charge through resonance and mechanisms",
      "Relating bond type and hybridization to acidity basicity and stability",
    ],
    commonMistakes: [
      "Forgetting lone pairs when deciding geometry and formal charge",
      "Assigning hybridization mechanically instead of checking for multiple bonds or resonance",
      "Ignoring formal charge when predicting where reactions start in a mechanism",
    ],
    practiceTypes: [
      "Hybridization and geometry identification drills",
      "Formal charge bookkeeping in short mechanisms",
      "Concept questions comparing bond length strength and acidity",
    ],
    reviewTriggers: [
      "Any time a mechanism step gives the wrong charge pattern",
      "Difficulty explaining why one proton is more acidic than another",
    ],
    relatedTopics: ["functional-groups", "spectroscopy"],
    bestVideos: [
      {
        topic: "Structure and Bonding",
        subtopic: "Orbital hybridization and sigma vs pi bonds",
        title: "Orbital Hybridization & Bonding – Crash Course Organic Chemistry",
        channel: "CrashCourse",
        url: "https://www.youtube.com/watch?v=5yw3XBnzYX8",
        thumbnail: "https://i.ytimg.com/vi/5yw3XBnzYX8/hqdefault.jpg",
        whyUseful:
          "Fast animated overview that builds intuition for hybridization and bond types before heavy mechanism work.",
        level: "All Orgo 1",
        length: "≈10–15 min",
        bestTime: "Before first week on bonding and again before spectroscopy",
        useType: "Concept understanding",
      },
      {
        topic: "Structure and Bonding",
        subtopic: "Hybridization and formal charge practice",
        title: "Hybridization Practice – Organic Chemistry",
        channel: "The Organic Chemistry Tutor",
        url: "https://www.youtube.com/watch?v=AijP2z5KxYQ",
        thumbnail: "https://i.ytimg.com/vi/AijP2z5KxYQ/hqdefault.jpg",
        whyUseful:
          "Slow walkthrough of many exam-style problems to convert the rules into automatic pattern recognition.",
        level: "Foundations and review",
        length: "≈30–45 min",
        bestTime: "After first reading and during homework sets",
        useType: "Problem practice",
      },
    ],
    mustKnowMap: {
      definitions: [
        "Sigma bond",
        "Pi bond",
        "Hybridization",
        "Formal charge",
        "Electronegativity",
      ],
      patterns: [
        "More s character means greater electronegativity and stronger shorter bonds",
        "Formal charge tracks where electrons come from and where mechanisms begin",
      ],
      classicTraps: [
        "Treating atoms in resonance systems as pure sp3 when they share p orbitals",
        "Forgetting that lone pairs can participate in resonance and change acidity",
      ],
      minimumPassing:
        "Can draw correct Lewis structures and usually assign hybridization with some hesitation.",
      targetA:
        "Assigns hybridization geometry and formal charge instantly and uses them actively to reason about acidity and mechanisms.",
    },
    masteryGoal:
      "Be able to assign hybridization geometry and formal charge for any main-group atom in seconds and use that information to predict acidity basicity and likely reaction sites.",
    studyPlan: [
      "Day 1–2: Work through lecture or textbook examples and fill in all missing lone pairs and charges.",
      "Day 3: Do a 20 question drill mixing hybridization geometry and formal charge questions from different molecules.",
      "Day 4–5: Redraw at least 3 mechanisms from class adding charges and lone pairs on every intermediate.",
      "Day 6: Do a timed 10–15 minute checkpoint where you assign hybridization and formal charges for a mixed problem set without notes.",
    ],
  },
  {
    slug: "functional-groups",
    title: "Functional Groups and Representations",
    shortDesc: "Spot every functional group instantly and translate any drawing style",
    summary:
      "Treat functional group recognition as a reflex. You should be able to look at any line-angle or skeletal drawing and instantly label the key functional groups and what they tend to do in reactions.",
    externalUrl: "https://openstax.org/books/organic-chemistry/pages/2-introduction",
    externalLabel: "OpenStax Organic Chemistry - Organic Structures and Functional Groups",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/9/9c/Organic_Functional_Groups.png",
    imageAlt: "Chart of common organic functional groups",
    mustKnow: [
      "The core list of functional groups covered in Orgo 1 and 2 and how to recognize them quickly in line angle form",
      "How each functional group tends to behave in terms of electrophilicity nucleophilicity and acidity basicity",
      "How to convert between line angle condensed and full Lewis structures without losing functional group information",
      "The difference between look alike groups such as aldehydes vs ketones esters vs ethers and amides vs amines",
    ],
    howToStudy: [
      "Build a one page functional group map with names generic structures and one sentence describing typical reactivity",
      "Do timed drills where you circle and label all functional groups in a complex molecule in under 60 seconds",
      "Practice redrawing the same molecule in line angle condensed and full Lewis form to keep recognition flexible",
      "Integrate functional group labeling into every new mechanism or synthesis problem you solve",
    ],
    hasMechanism: false,
    unit: "Foundations",
    skills: [
      "Instant recognition of major functional groups in line angle drawings",
      "Predicting whether a site is likely to behave as electrophile nucleophile acid or base",
      "Switching comfortably between structural representations",
    ],
    commonMistakes: [
      "Missing functional groups that are partially hidden in ring systems or condensed notation",
      "Confusing aldehydes with ketones and esters with ethers in quick scans",
      "Treating functional group identification as pure memorization instead of pattern recognition around heteroatoms and pi bonds",
    ],
    practiceTypes: [
      "Functional group find and label worksheets",
      "Mixed classification questions tied to mechanisms and spectroscopy",
      "Short timed drills that mix purely structural and reactivity based prompts",
    ],
    reviewTriggers: [
      "Frequent wrong answers on which molecule reacts fastest with a given reagent",
      "Difficulty matching IR or NMR features to the right functional group in spectroscopy problems",
    ],
    relatedTopics: ["structure-bonding", "spectroscopy", "substitution-elimination"],
    bestVideos: [
      {
        topic: "Functional Groups",
        subtopic: "Overview and recognition practice",
        title: "Functional Groups in Organic Chemistry",
        channel: "The Organic Chemistry Tutor",
        url: "https://www.youtube.com/watch?v=NjSFR40SY58",
        thumbnail: "https://i.ytimg.com/vi/NjSFR40SY58/hqdefault.jpg",
        whyUseful:
          "Systematic walkthrough of all major functional groups with many practice identifications.",
        level: "All Orgo students",
        length: "≈45–60 min",
        bestTime: "Early in the course and before any spectroscopy or synthesis exam",
        useType: "Concept plus practice",
      },
    ],
    masteryGoal:
      "Identify and name every common functional group in a complex molecule within a few seconds and explain what each group is likely to do in a reaction.",
    studyPlan: [
      "Day 1: Build or copy a functional group summary sheet with names structures and one line reactivity notes.",
      "Day 2–3: Do two or three 10 minute timed drills labeling functional groups on mixed structures.",
      "Day 4: Integrate functional group labeling into 10 mechanism or synthesis problems from lecture or homework.",
      "Weekly: Revisit the summary sheet and add examples from mechanisms or exam style problems.",
    ],
  },
  {
    slug: "alkanes",
    title: "Alkanes",
    shortDesc: "Naming, conformations, and the logic behind stability",
    summary:
      "Use Must Know to focus, follow Study Steps, then practice until you can do it without notes. Full reference is on the external link.",
    externalUrl: "https://openstax.org/books/organic-chemistry/pages/3-introduction",
    externalLabel: "OpenStax Organic Chemistry - Chapter 3: Alkanes",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/9/9f/Newman_projection_ethane_staggered.svg",
    imageAlt: "Newman projection of ethane staggered conformation",
    mustKnow: [
      "IUPAC naming basics parent chain substituents numbering alphabetical order",
      "Degrees of substitution primary secondary tertiary",
      "Conformations staggered vs eclipsed anti vs gauche torsional strain",
      "Newman projections how to draw and compare stability quickly",
      "Strain types torsional steric angle transannular",
    ],
    howToStudy: [
      "Memorize the naming workflow then do 20 name conversions with feedback",
      "Drill Newman projections draw anti and gauche for butane and compare energy",
      "Practice strain spotting circle strain sources on molecules before naming",
      "Do mixed problems name draw then identify the most stable conformation",
    ],
    hasMechanism: false,
  },
  {
    slug: "cycloalkanes",
    title: "Cycloalkanes",
    shortDesc: "Chair flips axial vs equatorial and stability rules",
    summary:
      "Focus on chair mastery and stability predictions. Full reference is on the external link.",
    externalUrl: "https://openstax.org/books/organic-chemistry/pages/4-introduction",
    externalLabel: "OpenStax Organic Chemistry - Chapter 4: Cycloalkanes",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/5/55/Cyclohexane-chair.png",
    imageAlt: "Cyclohexane chair conformation",
    mustKnow: [
      "Cyclohexane chair axial and equatorial up vs down is stereochemistry",
      "Chair flip axial becomes equatorial and vice versa up stays up down stays down",
      "1,3 diaxial interactions and why bulky groups prefer equatorial",
      "Cis vs trans in rings relate wedges dashes to up down positions",
      "Energy ranking substituted chairs using axial penalties",
    ],
    howToStudy: [
      "Draw 10 chairs from flat hexagons and label all axial equatorial positions",
      "Do 15 chair flip drills convert a substituted chair to its flip in 30 seconds",
      "Practice stability choose the lowest energy chair for mono and disubstituted rings",
      "Do cis trans classification from drawings then verify by building two chairs",
    ],
    hasMechanism: false,
  },
  {
    slug: "stereochemistry",
    title: "Stereochemistry",
    shortDesc: "R S E Z enantiomers diastereomers and optical activity",
    summary:
      "Learn the decision rules and drill classification. Full reference is on the external link.",
    externalUrl: "https://openstax.org/books/organic-chemistry/pages/5-introduction",
    externalLabel: "OpenStax Organic Chemistry - Chapter 5: Stereochemistry",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/9/9b/CIP-system.svg",
    imageAlt: "CIP priority rules diagram",
    mustKnow: [
      "Chirality stereocenter plane of symmetry meso concept",
      "Enantiomers vs diastereomers vs identical how to decide fast",
      "R S assignment using CIP rules including tie breaks and multiple bonds",
      "E Z assignment on alkenes using CIP priorities",
      "Optical activity basics and racemic mixture idea",
    ],
    howToStudy: [
      "Memorize a checklist identify centers assign priorities assign configuration compare",
      "Do 20 R S problems including Fischer projections",
      "Do 15 E Z problems with priority ties",
      "Do 20 compare problems same molecule enantiomers diastereomers or constitutional isomers",
    ],
    hasMechanism: false,
  },
  {
    slug: "substitution-elimination",
    title: "SN1 SN2 E1 E2",
    shortDesc: "Decide pathway fast and predict products with confidence",
    summary:
      "Use the drill and practice picking the pathway before drawing anything. Full reference is on the external link.",
    externalUrl: "https://openstax.org/books/organic-chemistry/pages/6-introduction",
    externalLabel: "OpenStax Organic Chemistry - Chapter 6: Substitution and Elimination",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/3/3a/SN2_reaction_mechanism.png",
    imageAlt: "SN2 reaction mechanism",
    mustKnow: [
      "Substrate ranking methyl primary secondary tertiary and what they allow",
      "Nucleophile vs base strength and how it changes substitution vs elimination",
      "Solvent effects polar protic vs polar aprotic",
      "Stereochemistry outcomes SN2 inversion SN1 racemization E2 anti requirement",
      "Regioselectivity Zaitsev vs Hofmann and when bulky base matters",
    ],
    howToStudy: [
      "Use a checklist substrate nucleophile base solvent heat leaving group",
      "Drill 30 pathway picks with no drawing decide SN1 SN2 E1 E2 and give one reason",
      "Then do 20 full product predictions including stereochemistry",
      "Redo wrong ones the same day and write the one clue you ignored",
    ],
    hasMechanism: true,
  },
  {
    slug: "alkenes",
    title: "Alkenes",
    shortDesc: "Addition reactions and how reagents map to outcomes",
    summary:
      "Learn reagent to product patterns and stereochemistry of addition. Full reference is on the external link.",
    externalUrl: "https://openstax.org/books/organic-chemistry/pages/7-introduction",
    externalLabel: "OpenStax Organic Chemistry - Chapter 7: Alkenes",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/4/41/Hydroboration-oxidation.png",
    imageAlt: "Hydroboration oxidation overview",
    mustKnow: [
      "Markovnikov vs anti Markovnikov and when each applies",
      "Key additions HX X2 halohydrin hydration oxymercuration hydroboration oxidation",
      "Syn vs anti addition outcomes and how to spot them",
      "Carbocation rearrangements in acid catalyzed hydration",
      "Ozonolysis logic for cleavage products",
    ],
    howToStudy: [
      "Build a one page reagent map reagent intermediate stereochemistry regiochemistry",
      "Do 25 product predictions across mixed reagents",
      "For every problem label the intermediate first then draw product",
      "Add a second pass of 10 synthesis problems using alkene as a starting point",
    ],
    hasMechanism: true,
  },
  {
    slug: "spectroscopy",
    title: "Spectroscopy",
    shortDesc: "Use spectra as proof to confirm structures",
    summary:
      "Treat spectra as proof. Predict the structure first, then verify. Full reference is on the external link.",
    externalUrl: "https://openstax.org/books/organic-chemistry/pages/13-introduction",
    externalLabel: "OpenStax Organic Chemistry - Chapter 13: Structure Determination (Spectroscopy)",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/f/f3/Irspec1.jpg",
    imageAlt: "Example infrared spectrum",
    mustKnow: [
      "IR key regions OH NH CO C=O C=C and triple bonds",
      "Proton NMR chemical shift integration splitting and coupling ideas",
      "Carbon NMR shift ranges and counting unique carbons",
      "DBE index and how it constrains structures",
      "Workflow propose structure then check every peak do not peak hunt blindly",
    ],
    howToStudy: [
      "Memorize high yield IR and proton NMR ranges first",
      "Do 15 IR identification drills and justify each call",
      "Do 15 proton NMR problems integration and splitting to fragments",
      "Do 10 combined problems IR plus proton NMR plus formula to full structure",
    ],
    hasMechanism: false,
  },
];

const ORGOCHEM_2: Topic[] = [
  {
    slug: "alcohols",
    title: "Alcohols",
    shortDesc: "Oxidation substitution protection and synthesis roles",
    summary:
      "Alcohols are multipurpose. Learn oxidation levels and common transformations. Full reference is on the external link.",
    externalUrl: "https://openstax.org/books/organic-chemistry/pages/10-introduction",
    externalLabel: "OpenStax Organic Chemistry - Chapter 10: Alcohols",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/8/8d/Jones_oxidation.png",
    imageAlt: "Jones oxidation overview",
    mustKnow: [
      "Oxidation ladder primary to aldehyde to acid secondary to ketone",
      "Reagents PCC vs Jones vs Swern vs DMP and what they stop at",
      "Convert alcohol to leaving group tosylate mesylate then substitution elimination",
      "Protection as silyl ether concept and when you need it",
      "Acid catalyzed dehydration and rearrangements",
    ],
    howToStudy: [
      "Build oxidation table starting alcohol reagent product conditions",
      "Do 20 transformations starting from alcohols and identify the key reagent",
      "Practice protecting group logic on 10 multi step problems",
      "Mix in 10 mechanism sketches for dehydration and tosylate formation",
    ],
    hasMechanism: true,
  },
  {
    slug: "ethers-epoxides",
    title: "Ethers and Epoxides",
    shortDesc: "Williamson ether synthesis and epoxide openings",
    summary:
      "Master Williamson and epoxide regioselectivity under basic vs acidic conditions. Full reference is on the external link.",
    externalUrl: "https://openstax.org/books/organic-chemistry/pages/11-introduction",
    externalLabel: "OpenStax Organic Chemistry - Chapter 11: Ethers and Epoxides",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/6/66/Epoxide_opening.png",
    imageAlt: "Epoxide ring opening diagram",
    mustKnow: [
      "Williamson ether synthesis is SN2 so primary works best",
      "Epoxide opening basic attacks less substituted acidic attacks more substituted",
      "Anti opening stereochemistry and why it happens",
      "Ether cleavage with strong acids and limits",
      "Use ethers as protecting groups in synthesis planning",
    ],
    howToStudy: [
      "Do 15 Williamson problems and identify which side must be the alkyl halide",
      "Do 20 epoxide opening problems split by acidic vs basic conditions",
      "Add stereochemistry checks on 10 problems using wedges and dashes",
      "Finish with 10 synthesis problems combining epoxide formation and opening",
    ],
    hasMechanism: true,
  },
  {
    slug: "carbonyls-addition",
    title: "Carbonyls Nucleophilic Addition",
    shortDesc: "Aldehydes and ketones additions and selectivity",
    summary:
      "Decide carbonyl type and nucleophile type first then draw. Full reference is on the external link.",
    externalUrl: "https://openstax.org/books/organic-chemistry/pages/17-introduction",
    externalLabel: "OpenStax Organic Chemistry - Chapter 17: Aldehydes and Ketones",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/6/6d/Grignard_reaction.png",
    imageAlt: "Grignard reaction overview",
    mustKnow: [
      "Reactivity aldehydes more reactive than ketones",
      "Key additions hydride Grignard organolithium cyanohydrin acetal formation",
      "Imine and enamine formation basics and acid catalysis role",
      "Acetal as carbonyl protection and deprotection",
      "Use spectra concepts to confirm products",
    ],
    howToStudy: [
      "Make a nucleophile list hydride carbon nucleophile nitrogen nucleophile and expected products",
      "Do 25 product predictions across mixed carbonyl additions",
      "Practice 10 protection deprotection sequences using acetals",
      "Add 10 combined problems with structure confirmation checks",
    ],
    hasMechanism: true,
  },
  {
    slug: "carboxylic-acids-derivatives",
    title: "Carboxylic Acids and Derivatives",
    shortDesc: "Acyl substitution and derivative reactivity ladder",
    summary:
      "This is substitution not addition. Use leaving group logic. Full reference is on the external link.",
    externalUrl: "https://openstax.org/books/organic-chemistry/pages/19-introduction",
    externalLabel: "OpenStax Organic Chemistry - Chapter 19: Carboxylic Acids and Derivatives",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/6/60/Nucleophilic_acyl_substitution.png",
    imageAlt: "Nucleophilic acyl substitution overview",
    mustKnow: [
      "Reactivity ladder acyl chloride anhydride ester acid amide",
      "Acyl substitution mechanism and tetrahedral intermediate",
      "Conversions acid to acid chloride acid chloride to ester amide transesterification idea",
      "Decarboxylation situations and beta dicarbonyl acidity idea",
      "Differentiate derivatives using key signals concept level",
    ],
    howToStudy: [
      "Memorize the ladder and do 20 conversion direction questions",
      "Do 20 product predictions for acyl substitutions with different nucleophiles",
      "Do 10 identification drills for derivatives",
      "Do 10 multi step synthesis problems moving down the reactivity ladder",
    ],
    hasMechanism: true,
  },
  {
    slug: "enolates-aldol-claisen",
    title: "Enolates Aldol and Claisen",
    shortDesc: "Alpha chemistry carbon carbon bond building",
    summary:
      "Identify alpha position choose base and conditions then build CC bonds. Full reference is on the external link.",
    externalUrl: "https://openstax.org/books/organic-chemistry/pages/22-introduction",
    externalLabel: "OpenStax Organic Chemistry - Chapter 22: Alpha Substitution and Condensation",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/2/2d/Aldol_reaction.png",
    imageAlt: "Aldol reaction overview",
    mustKnow: [
      "Alpha hydrogen acidity and why enolates form",
      "Kinetic vs thermodynamic enolate concept level",
      "Aldol addition vs aldol condensation and dehydration idea",
      "Claisen requirements at least one alpha H and matching alkoxide base",
      "Michael addition and conjugate addition intuition",
    ],
    howToStudy: [
      "For each problem mark alpha positions and decide which carbon becomes nucleophile",
      "Do 15 aldol problems and label beta hydroxy vs enone products",
      "Do 15 Claisen problems and check base alkoxide match",
      "Add 10 mixed enolate planning problems for synthesis style questions",
    ],
    hasMechanism: true,
  },
  {
    slug: "aromatic-chemistry",
    title: "Aromatic Chemistry",
    shortDesc: "EAS directing effects and synthesis order",
    summary:
      "Pick directing group then choose order of steps to control substitution. Full reference is on the external link.",
    externalUrl: "https://openstax.org/books/organic-chemistry/pages/15-introduction",
    externalLabel: "OpenStax Organic Chemistry - Chapter 15: Aromaticity and EAS",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/3/36/EAS_mechanism.png",
    imageAlt: "Electrophilic aromatic substitution mechanism overview",
    mustKnow: [
      "Aromaticity requirements and resonance stabilization idea",
      "EAS mechanism sigma complex and regeneration of aromaticity",
      "Activating vs deactivating and ortho para vs meta directors",
      "Common reactions nitration sulfonation halogenation Friedel Crafts alkylation acylation",
      "Synthesis order to avoid wrong directing or rearrangements",
    ],
    howToStudy: [
      "Memorize a director table and drill 20 predict major product problems",
      "Do 15 synthesis order problems with two substitutions",
      "Sketch sigma complex once per reaction type to see why directing happens",
      "Add 10 practice problems mixing EAS with carbonyl chemistry",
    ],
    hasMechanism: true,
  },
  {
    slug: "amines",
    title: "Amines",
    shortDesc: "Basicity synthesis and key reactions with carbonyls",
    summary:
      "Learn basicity trends and common formation pathways. Full reference is on the external link.",
    externalUrl: "https://openstax.org/books/organic-chemistry/pages/21-introduction",
    externalLabel: "OpenStax Organic Chemistry - Chapter 21: Amines",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/8/8a/Reductive_amination.png",
    imageAlt: "Reductive amination overview",
    mustKnow: [
      "Amine classes primary secondary tertiary and ammonium salts",
      "Basicity trends resonance decreases basicity inductive effects aniline case",
      "Reductive amination concept and imine intermediate",
      "Amide formation and why amides are weak bases",
      "Structure confirmation cues concept level",
    ],
    howToStudy: [
      "Drill 15 basicity ranking questions with one sentence explanation",
      "Do 15 synthesis problems including reductive amination",
      "Do 10 carbonyl to imine enamine transformation problems",
      "Confirm products using structure checks on 10 mixed problems",
    ],
    hasMechanism: true,
  },
];

export function getCourseTopics(course: CourseId): Topic[] {
  if (course === "orgochem-1") return ORGOCHEM_1;
  return ORGOCHEM_2;
}

export function findTopic(course: CourseId, slug: string): Topic | undefined {
  return getCourseTopics(course).find((t) => t.slug === slug);
}
