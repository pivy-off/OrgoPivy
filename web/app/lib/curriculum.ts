import { applyOrgChem2Enrichment } from "./orgochem2TopicEnrichment";

export type CourseId = "orgochem-1" | "orgochem-2";

export type TopicImageSection = "summary" | "mechanism" | "spectra" | "practice";

export type TopicCurriculumImage = {
  src: string;
  alt: string;
  caption: string;
  section: TopicImageSection;
};

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

/** OrgoChem II: one checklist row with its own explainer video (11-char YouTube id). */
export type TopicMustKnowItem = {
  title: string;
  description: string;
  videoId: string;
};

export type TopicPracticeMcq = {
  question: string;
  options: [string, string, string, string];
  answerIndex: 0 | 1 | 2 | 3;
  explanation: string;
};

/** Data-driven hero reaction card (same visual slot as inline TopicIllustration). */
export type TopicHeroDiagram = {
  cardTitle: string;
  cardSubtitle: string;
  centerLine1: string;
  centerLine2?: string;
  reagentCaption: string;
  reagentBold: string;
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

  /** CHM 222-style calendar week (1–17); gaps (e.g. 8, 13) match the syllabus. */
  scheduleWeek?: number;
  /** Optional label shown next to week (e.g. course subtitle). */
  weekLabel?: string;
  /** Deep link when a drill route exists (practice API, exams bank, spectra, etc.). */
  practiceHref?: string;
  /** Textbook chapter label (e.g. OpenStax chapter). */
  chapter?: string;
  /** Inline figures under `/public` (e.g. `/images/orgochem2/...`). */
  images?: TopicCurriculumImage[];
  /** Short exam-prep tips shown on the OrgoChem II topic page. */
  tips?: string[];
  /** OrgoChem II: structured must-know rows with per-concept YouTube clips. */
  mustKnowItems?: TopicMustKnowItem[];
  /** OrgoChem II: multiple-choice practice for the Practice section. */
  practiceMcqs?: TopicPracticeMcq[];
  /** OrgoChem II: replaces default hero SVG when set. */
  heroDiagram?: TopicHeroDiagram;
  /** OrgoChem II: primary tutorial embed in Overview (YouTube id). */
  overviewVideoId?: string;
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

const _orgochem2TopicsBase: Topic[] = [
  {
    slug: "resonance-acid-base-review",
    title: "Resonance and Acid-Base Review",
    shortDesc: "Electron movement, pKa, and equilibrium direction",
    scheduleWeek: 1,
    chapter: "Chapter 2",
    summary:
      "Reviews resonance and Brønsted-Lowry acid-base theory. Only pi bonds and lone pairs move in resonance — sigma bonds never move. Equilibrium favors the weaker acid (higher pKa). EWGs stabilize carboxylate anions and enhance acidity; EDGs destabilize anions and weaken acidity.",
    externalUrl: "https://openstax.org/books/organic-chemistry/pages/2-4-resonance",
    externalLabel: "OpenStax — Resonance (Chapter 2)",
    mustKnow: [
      "Resonance rules: Only pi bonds and lone pairs move — sigma bonds are fixed. Atoms stay in place. Charge = valence electrons − bonds − nonbonding electrons.",
      "pKa table: HCl <0, RCOOH ~5, PhOH ~10, H2O 15.7, ROH 16–18, RC≡CH ~25, NH3 ~35, alkenes ~45, alkanes ~50. Lower pKa = stronger acid.",
      "Equilibrium direction: Reaction favors the weaker acid side (higher pKa). If left acid pKa < right acid pKa, products are favored. NaOH cannot deprotonate alkynes (pKa mismatch).",
      "EWG vs EDG on acidity: EWGs pull electron density, stabilize the carboxylate anion, enhance acidity. EDGs donate electron density, destabilize anion, weaken acidity.",
    ],
    howToStudy: [
      "Draw resonance structures using only pi bond and lone pair movement",
      "Use charge formula to assign + and − to atoms",
      "Use pKa table to predict acid-base equilibrium direction",
      "Predict how EWGs and EDGs affect carboxylic acid acidity",
      "Tip — Lower pKa always wins — that side is the stronger acid",
      "Tip — Sigma bonds NEVER move in resonance",
    ],
    commonMistakes: [
      "Moving sigma bonds in resonance — this is never allowed",
      "Forgetting equilibrium favors the weaker acid (higher pKa) as product",
      "Assuming NaOH can deprotonate alkynes — it cannot",
    ],
    hasMechanism: false,
    tips: [
      "Lower pKa always wins — that side is the stronger acid",
      "Sigma bonds NEVER move in resonance",
    ],
  },
  {
    slug: "substitution-elimination-nmr-review",
    title: "Substitution, Elimination, and NMR Review",
    shortDesc: "SN1, SN2, E1, E2, and spectroscopy fundamentals",
    scheduleWeek: 2,
    chapter: "Chapters 6–13",
    summary:
      "Reviews SN1, SN2, E1, E2 from Orgo I plus 1H NMR. SN2 favors primary substrates + strong nucleophiles; SN1 favors tertiary via carbocations. Tosylate esters (TsCl/pyridine) activate alcohols for substitution/elimination with basic nucleophiles. NMR: carboxylic acid O–H at 10–13 ppm (broad), C=O at 1710 cm⁻¹ in IR.",
    externalUrl: "https://openstax.org/books/organic-chemistry/pages/11-1-the-sn1-reaction",
    externalLabel: "OpenStax — SN1 and related chapters",
    mustKnow: [
      "SN2 requirements: Primary substrate, strong nucleophile, one step, inversion of configuration. Backside attack — sterically blocked at 3° substrates.",
      "SN1 requirements: Tertiary substrate, weak nucleophile, two steps via carbocation intermediate, racemization. Benzylic and allylic positions also reactive.",
      "Tosylate ester strategy: TsCl/pyridine converts –OH to –OTs without breaking C–O bond. Allows SN2/E2 with basic nucleophiles incompatible with HX conditions.",
      "NMR key shifts: Carboxylic acid O–H: 10–13 ppm, very broad. Aldehyde C–H: 9–10 ppm. Carbonyl 13C: 160–210 ppm. IR C=O: 1710 cm⁻¹ (acid), O–H: 2500–3500 cm⁻¹ (broad).",
    ],
    howToStudy: [
      "For each reaction identify substrate class, nucleophile strength, base strength → assign mechanism",
      "Practice tosylate formation and subsequent SN2/elimination",
      "Interpret NMR spectra using chemical shift table",
      "Tip — Benzylic halides are 100× more reactive than primary halides in SN2",
      "Tip — Sulfonation is reversible — unlike other EAS reactions",
    ],
    commonMistakes: [
      "Attempting SN2 on tertiary substrates — steric hindrance prevents backside attack",
      "Forgetting tosylation does NOT break the C–O bond — configuration at carbon is retained",
      "Confusing aldehyde C–H (~9–10 ppm) with carboxylic acid O–H (~10–13 ppm)",
    ],
    hasMechanism: true,
    practiceHref: "/spectra",
    images: [
      {
        src: "/images/orgochem2/nmr-spectra-carboxylic-1.svg",
        alt: "Schematic 1H NMR and IR bands for a carboxylic acid",
        caption: "Reference: broad O–H (10–13 ppm, ¹H), C=O IR ~1710 cm⁻¹, broad H-bonded O–H IR 2500–3500 cm⁻¹.",
        section: "spectra",
      },
    ],
    tips: [
      "Benzylic halides are 100× more reactive than primary halides in SN2",
      "Sulfonation is reversible — unlike other EAS reactions",
    ],
  },
  {
    slug: "alkynes",
    title: "Alkynes",
    shortDesc: "Addition, hydration, reduction, and acetylide chemistry",
    scheduleWeek: 3,
    chapter: "Chapter 9",
    summary:
      "Alkynes have two pi bonds allowing electrophiles to add twice. HgSO4/H2SO4/H2O gives Markovnikov ketone via keto-enol tautomerization; Sia2BH/H2O2/NaOH gives anti-Markovnikov aldehyde. Lindlar's catalyst gives cis alkene; Na/NH3 gives trans alkene. Terminal alkynes (pKa ~25) are deprotonated by NaNH2 to form acetylide nucleophiles for SN2 alkylation.",
    externalUrl: "https://openstax.org/books/organic-chemistry/pages/9-3-reactions-of-alkynes-addition-of-hx-and-x2",
    externalLabel: "OpenStax — Reactions of alkynes",
    mustKnow: [
      "Double addition of electrophiles: X2 (1 equiv) → vinyl dihalide; X2 (2 equiv) → tetrahalide. HX adds twice Markovnikov each time.",
      "Hydration (Markovnikov): HgSO4/H2SO4/H2O → enol → tautomerizes to ketone. Terminal alkyne gives methyl ketone.",
      "Hydration (anti-Markovnikov): Sia2BH then H2O2/NaOH → aldehyde (anti-Markovnikov). Only one B–H bond so reaction stops at alkene stage.",
      "Reduction to alkenes: Lindlar's catalyst (H2, Pd/BaSO4, quinoline) → cis alkene. Na/NH3 dissolving metal → trans alkene. H2/Pt goes all the way to alkane.",
      "Acetylide alkylation: Terminal alkyne + NaNH2 → acetylide anion → SN2 on primary alkyl halide only. Cannot use on 2° or 3° — steric hindrance.",
      "Oxidative cleavage: KMnO4 or O3 cleaves internal alkyne → 2 carboxylic acids. Terminal alkyne → RCOOH + CO2.",
    ],
    howToStudy: [
      "Practice addition reactions tracking equivalents (1 vs 2)",
      "Work through keto-enol tautomerization mechanism",
      "Choose Lindlar's vs Na/NH3 based on desired alkene geometry",
      "Practice retrosynthesis: given a product, work back to the alkyne and reagents",
      "Tip — Lindlar's = cis. Sodium = trans. Pt = alkane. Memorize this trio.",
      "Tip — Enol always tautomerizes — never write it as the final product",
    ],
    commonMistakes: [
      "Using H2/Pt expecting to stop at alkene — it always goes to alkane",
      "Forgetting tautomerization after hydration — enol is not the final product",
      "Attempting acetylide SN2 on secondary or tertiary alkyl halide",
    ],
    hasMechanism: true,
    images: [
      {
        src: "/images/orgochem2/alkynes-mechanism-1.svg",
        alt: "First addition of HBr to an alkyne: pi attack on protonated intermediate",
        caption: "Step 1 of HX addition: pi bond as nucleophile toward electrophilic H (Markovnikov pathway).",
        section: "mechanism",
      },
    ],
    tips: [
      "Lindlar's = cis. Sodium = trans. Pt = alkane. Memorize this trio.",
      "Enol always tautomerizes — never write it as the final product",
    ],
  },
  {
    slug: "grignard-reaction",
    title: "Grignard Reaction",
    shortDesc: "Nucleophilic carbon sources and organometallic additions",
    scheduleWeek: 3,
    chapter: "Chapter 10",
    summary:
      "Grignard reagents (RMgX) and organolithium reagents are nucleophilic C sources. The C–Mg bond is polarized C⁻–Mg⁺. Addition to aldehydes gives 2° alcohols, to ketones gives 3° alcohols, to formaldehyde gives 1° alcohols, to esters/acid chlorides gives 3° alcohols (reacts twice), to CO2 gives carboxylic acids. Incompatible with O–H, N–H, S–H, terminal alkynes, and electrophilic carbonyls on the substrate.",
    externalUrl: "https://openstax.org/books/organic-chemistry/pages/10-6-reactions-of-alkyl-halides-grignard-reagents",
    externalLabel: "OpenStax — Grignard reagents",
    mustKnow: [
      "Grignard formation: R–X + Mg, ether → R–MgX. Organolithium: R–X + 2 Li, hexane → R–Li. THF is another common solvent. Glassware must be bone dry.",
      "Addition to carbonyls: Aldehyde → 2° alcohol. Ketone → 3° alcohol. Formaldehyde → 1° alcohol. CO2 → carboxylic acid after H3O+ workup. Ester or acid chloride → adds twice → 3° alcohol.",
      "Incompatible groups: O–H, N–H, S–H, terminal alkynes all protonate and destroy the Grignard. Strongly electrophilic groups (C=N, S=O, NO) also react undesirably.",
      "Gilman reagent: R2CuLi couples with alkyl halides (not fluorides) to form C–C bonds. Adds once to acid chlorides giving ketones (stops there, unlike Grignard).",
      "Suzuki-Miyaura reaction: Aryl/vinyl boronic acid + aryl/vinyl halide, Pd catalyst, base → biaryl. Used widely in drug synthesis. Doesn't work with alkyl substrates.",
    ],
    howToStudy: [
      "Practice choosing the correct carbonyl/Grignard pair to reach a target alcohol",
      "Note 3° alcohols can be made 3 different ways — practice all three routes",
      "Practice identifying incompatible functional groups before planning synthesis",
      "Tip — Water destroys Grignard reagents — always dry glassware first",
      "Tip — CO2 + Grignard is the cleanest route to a carboxylic acid",
    ],
    commonMistakes: [
      "Putting O–H or N–H on the substrate — Grignard will just deprotonate it",
      "Forgetting esters/acid chlorides react twice — product is always a 3° alcohol",
      "Using Gilman reagent with C–F bonds — it does not react with fluorides",
    ],
    hasMechanism: true,
    tips: [
      "Water destroys Grignard reagents — always dry glassware first",
      "CO2 + Grignard is the cleanest route to a carboxylic acid",
    ],
  },
  {
    slug: "organohalides-radical",
    title: "Organohalides and Radical Reactions",
    shortDesc: "Radical halogenation, NBS, and alkyl halide synthesis",
    scheduleWeek: 4,
    chapter: "Chapter 10",
    summary:
      "Alkyl halides are made from alcohols using HX, PBr3, SOCl2, or PCl5. SOCl2 gives retention of configuration. Radical halogenation (Cl2 or Br2/hν) proceeds via initiation, propagation, and termination. NBS selectively brominates the allylic position via radical mechanism. Radical stability: allylic/benzylic > 3° > 2° > 1°.",
    externalUrl: "https://openstax.org/books/organic-chemistry/pages/10-2-preparing-alkyl-halides-from-alkanes-radical-halogenation",
    externalLabel: "OpenStax — Radical halogenation",
    mustKnow: [
      "Alcohol → alkyl halide reagents: HX (best for 3°). PBr3 (best for 1° and 2° bromides). SOCl2 (chlorides, retention of config). PCl5 (also chlorides). 2P + 3I2 (iodides only).",
      "Radical mechanism steps: Initiation (0→2 radicals, hν splits X2). Propagation (1→1 radical, chain continues). Termination (2→0 radicals, two radicals collide).",
      "NBS allylic bromination: NBS + hν (or heat) in CCl4 → brominates carbon adjacent to double bond (allylic position). Radical mechanism. Does NOT add to the double bond.",
      "Radical stability order: Allylic/benzylic (resonance stabilized) > 3° > 2° > 1° > methyl. More substituents = more stable = more likely to form.",
    ],
    howToStudy: [
      "Label initiation, propagation, termination steps in any radical mechanism",
      "Choose between HX, PBr3, SOCl2 based on substrate and stereochemistry needs",
      "Rank radicals by stability using substituents and resonance",
      "Tip — Br2 is more selective than Cl2 in radical halogenation (only hits 3° and benzylic/allylic)",
      "Tip — The undesired termination step in methane chlorination is ethane formation — can't be converted to product",
    ],
    commonMistakes: [
      "SOCl2 gives retention, not inversion — the C–O bond is not broken in the rate-limiting step",
      "NBS does NOT add to the double bond — it only brominates the allylic position",
      "Confusing HBr (Markovnikov ionic) with HBr/ROOR (anti-Markovnikov radical)",
    ],
    hasMechanism: true,
    tips: [
      "Br2 is more selective than Cl2 in radical halogenation (only hits 3° and benzylic/allylic)",
      "The undesired termination step in methane chlorination is ethane formation — can't be converted to product",
    ],
  },
  {
    slug: "conjugated-compounds-diels-alder",
    title: "Conjugated Compounds and Diels-Alder",
    shortDesc: "1,2- vs 1,4-addition, kinetic vs thermodynamic control, cycloaddition",
    scheduleWeek: 6,
    chapter: "Chapter 14",
    summary:
      "Conjugated dienes have extra resonance stability and give both 1,2- and 1,4-addition products. Low temperature favors the kinetic (1,2) product; high temperature favors the thermodynamic (1,4) product. Diels-Alder [4+2] cycloaddition requires diene in s-cis conformation and EWG on dienophile. Concerted mechanism gives stereospecific cis addition.",
    externalUrl: "https://openstax.org/books/organic-chemistry/pages/14-4-the-diels-alder-cycloaddition-reaction",
    externalLabel: "OpenStax — Diels-Alder cycloaddition",
    mustKnow: [
      "Conjugated vs isolated vs cumulated: Conjugated = alternating double/single bonds (1,3-butadiene). Isolated = more than one single bond between double bonds. Cumulated = allene (two successive double bonds on same carbon).",
      "1,2- vs 1,4-addition: 1,2-addition = kinetic product (low temp, −80°C, 80% yield). 1,4-addition = thermodynamic product (high temp, 40°C, 85% yield). 1,4 is more stable (more substituted double bond).",
      "Diels-Alder requirements: Diene must be in s-cis conformation. Dienophile needs EWG (C=O, CN, NO2). Both react in a concerted [4+2] cycloaddition. If diene is locked s-trans, no reaction.",
      "Diels-Alder stereochemistry: Cis dienophile substituents → cis product. Trans dienophile → trans product. The geometry is completely preserved in the ring.",
    ],
    howToStudy: [
      "Label conjugated/isolated/cumulated for any given structure",
      "Draw 1,2 and 1,4 addition products for HBr and Br2 with 1,3-butadiene",
      "Practice Diels-Alder by drawing diene in s-cis and matching with dienophile",
      "Predict Diels-Alder stereochemistry from dienophile geometry",
      "Tip — EDGs on diene + EWGs on dienophile = fastest Diels-Alder reaction",
      "Tip — Cyclopentadiene is always locked s-cis — extremely reactive in Diels-Alder",
    ],
    commonMistakes: [
      "Forgetting diene must be s-cis — locked s-trans dienes do not react",
      "Reversing kinetic and thermodynamic — kinetic = 1,2 (faster), thermodynamic = 1,4 (more stable)",
      "Ignoring stereochemistry — cis/trans of dienophile transfers to product ring",
    ],
    hasMechanism: true,
    images: [
      {
        src: "/images/orgochem2/diels-alder-mechanism-1.svg",
        alt: "s-cis diene and dienophile oriented for [4+2] cycloaddition to cyclohexene framework",
        caption: "Diels–Alder: overlap diene HOMO with dienophile LUMO in the s-cis conformation.",
        section: "mechanism",
      },
    ],
    tips: [
      "EDGs on diene + EWGs on dienophile = fastest Diels-Alder reaction",
      "Cyclopentadiene is always locked s-cis — extremely reactive in Diels-Alder",
    ],
  },
  {
    slug: "aromaticity",
    title: "Aromaticity",
    shortDesc: "Hückel's rule, aromatic ions, and heterocycles",
    scheduleWeek: 7,
    chapter: "Chapter 15",
    summary:
      "Aromatic compounds are cyclic, planar, fully conjugated, and have 4n+2 π electrons. Antiaromatic = 4n π electrons (meets criteria 1–3 but fails Hückel). Nonaromatic = fails at least one of criteria 1–3. Cyclopentadienyl anion is aromatic (6π); cation is antiaromatic (4π). Pyridine lone pair is NOT in the π system → strong base. Pyrrole lone pair IS in the π system → weak base.",
    externalUrl: "https://openstax.org/books/organic-chemistry/pages/15-3-aromaticity-and-the-huckel-4n-2-rule",
    externalLabel: "OpenStax — Hückel's rule and aromaticity",
    mustKnow: [
      "4 criteria for aromaticity: 1) Cyclic. 2) One p orbital on each ring atom. 3) Planar. 4) 4n+2 π electrons (n = 0,1,2...). All 4 must be met. Missing any one = nonaromatic (or antiaromatic if only criterion 4 fails).",
      "Aromatic vs antiaromatic vs nonaromatic: Benzene 6π (n=1) aromatic. Cyclobutadiene 4π (n=1, antiaromatic). Cyclooctatetraene nonplanar = nonaromatic. Cyclopentadienyl anion 6π = aromatic. Cation 4π = antiaromatic.",
      "Pyridine vs pyrrole basicity: Pyridine N lone pair is in sp2 orbital, NOT in π system → protonation retains aromaticity → strong base. Pyrrole N lone pair IS in π system → protonation destroys aromaticity → weak base.",
      "Heterocycle π electron counting: If lone pair is in the π system (like pyrrole O in furan, S in thiophene), count it as 2 π electrons. If it's in an sp2 orbital (pyridine N), do not count it.",
    ],
    howToStudy: [
      "Apply all 4 criteria in order to classify any ring system",
      "Count π electrons carefully in charged and heterocyclic systems",
      "Determine if N lone pair is in π system or not to classify base strength",
      "Tip — Aromaticity drives reactions — if a product can be aromatic, the reaction will favor it",
      "Tip — Cyclopentadiene is unusually acidic (pKa ~16) because the anion is aromatic",
    ],
    commonMistakes: [
      "Counting lone pairs as π electrons when they are in sp3 or sp2 (non-π) orbitals",
      "Calling cyclooctatetraene antiaromatic — it's nonplanar so it's nonaromatic",
      "Assuming all N-heterocycles are strong bases — pyrrole N is weak base",
    ],
    hasMechanism: false,
    tips: [
      "Aromaticity drives reactions — if a product can be aromatic, the reaction will favor it",
      "Cyclopentadiene is unusually acidic (pKa ~16) because the anion is aromatic",
    ],
  },
  {
    slug: "electrophilic-aromatic-substitution",
    title: "Electrophilic Aromatic Substitution (EAS)",
    shortDesc: "Halogenation, nitration, sulfonation, Friedel-Crafts, and directing effects",
    scheduleWeek: 9,
    chapter: "Chapter 16",
    summary:
      "Benzene undergoes EAS — Step 1 (slow, rate-determining): π bond attacks electrophile forming nonaromatic sigma complex (arenium ion). Step 2 (fast): base removes H to restore aromaticity. Five key reactions: halogenation, nitration, sulfonation (reversible), Friedel-Crafts alkylation (prone to rearrangement), Friedel-Crafts acylation (no rearrangement). Substituents direct ortho/para (activating donors + halogens) or meta (deactivating EWGs).",
    externalUrl: "https://openstax.org/books/organic-chemistry/pages/16-1-electrophilic-aromatic-substitution-reactions-bromination",
    externalLabel: "OpenStax — Electrophilic aromatic substitution",
    mustKnow: [
      "EAS two steps: Step 1 (slow): π bond attacks E+, aromaticity lost, sigma complex (arenium ion) forms. Step 2 (fast): base removes H+, aromaticity restored. Step 1 is rate-determining.",
      "5 EAS reactions: Halogenation (Br2/FeBr3 or Cl2/AlCl3). Nitration (HNO3/H2SO4 → NO2+). Sulfonation (SO3/H2SO4, reversible). Friedel-Crafts alkylation (RX/AlCl3, rearrangement risk). Friedel-Crafts acylation (RCOCl/AlCl3, no rearrangement → ketone).",
      "Directing effects: Ortho/para directors (activating): –NH2, –OH, –OR, alkyl. Ortho/para directors (deactivating): halogens. Meta directors (deactivating): –NO2, –SO3H, –CHO, –COR, –COOH, –CN. Follow the more activating group when two substituents compete.",
      "Friedel-Crafts acylation strategy: Use acylation (no rearrangement) then reduce ketone to alkyl with Zn/HCl(aq) or H2/Pd. This avoids the carbocation rearrangement problem of direct alkylation.",
    ],
    howToStudy: [
      "Memorize the 5 EAS reactions and electrophile-generating reagent for each",
      "Draw full EAS mechanisms including sigma complex resonance structures",
      "Use sigma complex resonance to predict ortho/para vs meta",
      "Practice multi-step aromatic synthesis using directing effects strategically",
      "Tip — When two substituents on a ring conflict, always follow the more activating one",
      "Tip — Acylation then reduction = no rearrangement. Alkylation directly = rearrangement risk.",
    ],
    commonMistakes: [
      "Using Br2 alone without Lewis acid — not electrophilic enough for EAS",
      "Friedel-Crafts alkylation with primary alkyl chloride expecting no rearrangement — always rearranges",
      "Misidentifying halogens as activating — they are deactivating despite ortho/para direction",
      "Forgetting sulfonation is reversible — sulfonic acid group is removed with dilute H2SO4/steam",
    ],
    hasMechanism: true,
    images: [
      {
        src: "/images/orgochem2/eas-mechanism-1.svg",
        alt: "Benzene attacks electrophile then deprotonates to restore aromaticity",
        caption: "EAS sigma complex: ring loses aromaticity briefly, then base removes adjacent H.",
        section: "mechanism",
      },
    ],
    tips: [
      "When two substituents on a ring conflict, always follow the more activating one",
      "Acylation then reduction = no rearrangement. Alkylation directly = rearrangement risk.",
    ],
  },
  {
    slug: "nucleophilic-aromatic-substitution",
    title: "Nucleophilic Aromatic Substitution and Side-Chain Reactions",
    shortDesc: "NAS, benzyne, oxidation, and benzylic chemistry",
    scheduleWeek: 10,
    chapter: "Chapter 16",
    summary:
      "NAS requires a halogen leaving group plus EWGs ortho/para to stabilize the Meisenheimer complex (negatively charged intermediate). NAS advantage over EAS/reduction route: can install –NH2 alongside existing –NO2 on the ring. Benzyne (NaNH2) gives regioisomeric mixture. Side-chain: KMnO4 oxidizes any alkyl group to –COOH; Br2/hν selectively brominates benzylic position via radical mechanism.",
    externalUrl: "https://openstax.org/books/organic-chemistry/pages/16-6-nucleophilic-aromatic-substitution",
    externalLabel: "OpenStax — Nucleophilic aromatic substitution",
    mustKnow: [
      "NAS requirements: Must have halogen leaving group + EWGs (especially NO2) ortho/para for activation. Nucleophile attacks ipso carbon → negatively charged Meisenheimer complex → halide leaves.",
      "NAS vs EAS route to ring amines: EAS route (HNO3/H2SO4 then Zn/HCl): reduces ALL nitro groups AND carbonyls. NAS route (2 NaOH or 2 NH3): can place –NH2 next to –NO2 on same ring. NAS is the only option when you need both.",
      "Benzyne mechanism: Requires very strong base (NaNH2) + halogen on ring. NaNH2 deprotonates ring; elimination gives strained benzyne (triple bond in ring). Nucleophile adds to give mixture of two regioisomers.",
      "Side-chain oxidation and halogenation: KMnO4 or Na2Cr2O7/H2SO4 oxidizes any alkyl side chain to –COOH regardless of chain length. Br2/hν or NBS gives radical halogenation at benzylic position only. Benzylic halides are 100× more reactive than primary in SN2.",
    ],
    howToStudy: [
      "Practice NAS mechanism: nucleophile attacks ipso, Meisenheimer forms, halide leaves",
      "Count EWGs and positions to predict if NAS will work",
      "Practice side-chain oxidation: identify every alkyl group that becomes COOH",
      "Distinguish ring halogenation (EAS) from benzylic halogenation (radical)",
      "Tip — The Meisenheimer complex is anionic — remember it's the opposite charge from EAS",
      "Tip — Benzyne always gives a mixture — use NAS when you need regioselectivity",
    ],
    commonMistakes: [
      "Attempting NAS without EWGs on the ring — will not proceed",
      "NAS gives negatively charged intermediate — opposite of EAS (positively charged arenium)",
      "KMnO4 oxidizes ALL alkyl side chains to COOH — not selective for one position",
    ],
    hasMechanism: true,
    tips: [
      "The Meisenheimer complex is anionic — remember it's the opposite charge from EAS",
      "Benzyne always gives a mixture — use NAS when you need regioselectivity",
    ],
  },
  {
    slug: "alcohols-phenols",
    title: "Alcohols and Phenols",
    shortDesc: "Synthesis, oxidation, and leaving group activation",
    scheduleWeek: 11,
    chapter: "Chapter 17",
    summary:
      "Alcohols are synthesized by carbonyl reduction (NaBH4 or LiAlH4) or Grignard addition. Primary alcohols oxidize to aldehydes (PCC or Dess-Martin) or carboxylic acids (chromic acid); secondary to ketones. Leaving group ability improved via protonation (HX) or tosylate (TsCl/pyridine). Phenol (pKa ~10) is more acidic than alcohols (pKa ~16–18) due to resonance delocalization into the ring.",
    externalUrl: "https://openstax.org/books/organic-chemistry/pages/17-4-alcohols-from-carbonyl-compounds-reduction",
    externalLabel: "OpenStax — Alcohols from carbonyl reduction",
    mustKnow: [
      "Reducing agents: NaBH4 reduces aldehydes and ketones only. LiAlH4 reduces all carbonyls including COOH and esters. LiAlH4 on esters adds twice — gives primary alcohol. NaBH4 cannot reduce COOH or esters.",
      "Oxidation levels: PCC or Dess-Martin periodinane: 1° alcohol → aldehyde (stops); 2° alcohol → ketone. Chromic acid (Na2Cr2O7, CrO3/H2SO4): 1° alcohol → carboxylic acid all the way. 3° alcohols do not oxidize.",
      "Tosylate ester strategy: TsCl/pyridine converts –OH to –OTs. C–O bond is NOT broken during tosylation. Tosylate is an excellent leaving group for SN2/E2 with basic nucleophiles.",
      "Phenol acidity: Phenol pKa ~10 — far more acidic than alcohols (pKa ~16–18). Phenoxide anion is stabilized by resonance into the ring. NaOH deprotonates phenol but not regular alcohols.",
    ],
    howToStudy: [
      "Practice choosing NaBH4 vs LiAlH4 based on the substrate",
      "Practice choosing PCC/Dess-Martin vs chromic acid based on desired oxidation level",
      "Work through tosylate formation and subsequent SN2/elimination with various nucleophiles",
      "Tip — 3° alcohols do not oxidize — no H on the carbon bearing OH",
      "Tip — PCC stops at aldehyde; chromic acid does not stop there",
    ],
    commonMistakes: [
      "Using NaBH4 on carboxylic acids or esters — not strong enough",
      "Using chromic acid when you want to stop at aldehyde — use PCC or Dess-Martin instead",
      "Thinking tosylation inverts configuration — C–O bond is NOT broken during tosylation",
    ],
    hasMechanism: true,
    tips: [
      "3° alcohols do not oxidize — no H on the carbon bearing OH",
      "PCC stops at aldehyde; chromic acid does not stop there",
    ],
  },
  {
    slug: "ethers-epoxides",
    title: "Ethers, Epoxides, Thiols, and Sulfides",
    shortDesc: "Williamson synthesis, ring opening, and acid vs base conditions",
    scheduleWeek: 12,
    chapter: "Chapter 18",
    summary:
      "Symmetrical ethers form by acid-catalyzed dehydration (1° alcohols only). Unsymmetrical ethers use Williamson synthesis: alkoxide (Na/K/NaH) + primary alkyl halide via SN2. Ethers cleave with HBr or HI (2 equiv). Epoxides (mCPBA + alkene) open under acid conditions at more substituted carbon (SN1-like) or base conditions at less substituted carbon (SN2-like).",
    externalUrl: "https://openstax.org/books/organic-chemistry/pages/18-2-preparing-ethers",
    externalLabel: "OpenStax — Preparing ethers",
    mustKnow: [
      "Williamson synthesis: Alkoxide + 1° RX → ether via SN2. Use Na, K, or NaH to deprotonate alcohol (not NaOH — equilibrium disfavors alkoxide). SN2 on benzene ring is impossible.",
      "Ether cleavage: HBr or HI (2 equiv) cleaves ethers → 2 alkyl halides + H2O. HCl and HF are too weak (halide not nucleophilic enough). Mechanism is SN1 or SN2 depending on substitution.",
      "Epoxide synthesis: Alkene + mCPBA (meta-chloroperoxybenzoic acid) → epoxide via butterfly mechanism (syn addition — both oxygens add from same face).",
      "Epoxide ring opening: Acid-catalyzed: protonate O first, nucleophile attacks more substituted C (SN1-like). Base-catalyzed: nucleophile attacks less substituted C directly (SN2-like). Grignard reagents = base-catalyzed pathway.",
    ],
    howToStudy: [
      "Choose Williamson reagents: which component is alkoxide vs alkyl halide (must be 1°)",
      "Work through acid and base epoxide opening mechanisms with full curved arrows",
      "Practice synthesis sequences: alkene → epoxide → ring-opened product",
      "Tip — Acid opens at more substituted (carbocation logic). Base opens at less substituted (SN2 logic).",
      "Tip — Epoxides are far more reactive than regular ethers because of ring strain",
    ],
    commonMistakes: [
      "Williamson synthesis on secondary or tertiary alkyl halide — SN2 won't work, use the other component as electrophile",
      "Using NaOH to deprotonate alcohols — equilibrium strongly disfavors this",
      "Confusing acid vs base epoxide regiochemistry — acid → more substituted C; base → less substituted C",
    ],
    hasMechanism: true,
    tips: [
      "Acid opens at more substituted (carbocation logic). Base opens at less substituted (SN2 logic).",
      "Epoxides are far more reactive than regular ethers because of ring strain",
    ],
  },
  {
    slug: "aldehydes-ketones",
    title: "Aldehydes and Ketones",
    shortDesc: "Nucleophilic addition, imine/enamine formation, Wittig, and acetal protection",
    scheduleWeek: 14,
    chapter: "Chapter 19",
    summary:
      "Aldehydes and ketones undergo nucleophilic addition at the electrophilic carbonyl carbon. Key reactions: cyanohydrin (HCN/base), alcohol formation (NaBH4/LiAlH4 or Grignard), imine (1° amine, pH ~4.5), enamine (2° amine), hydrazone/Wolff-Kishner (H2NNH2 then KOH/heat → removes carbonyl entirely), acetal (2 ROH, acid, reversible — used as protecting group), Wittig (ylide + carbonyl → alkene).",
    externalUrl: "https://openstax.org/books/organic-chemistry/pages/19-6-nucleophilic-addition-of-hcn-cyanohydrin-formation",
    externalLabel: "OpenStax — Cyanohydrin formation",
    mustKnow: [
      "Cyanohydrin formation: Aldehyde/ketone + HCN, base catalyst → cyanohydrin RCH(OH)CN. Base generates CN⁻ nucleophile. CN can be reduced to CH2NH2 by LiAlH4, or hydrolyzed to COOH by H3O+.",
      "Imine and enamine formation: Imine: 1° amine + carbonyl, H+, pH ~4.5 → C=NR + H2O. Below pH 4.5, amine is protonated and not nucleophilic. Enamine: 2° amine + carbonyl → C=C–N (deprotonation from alpha carbon, no N–H to lose).",
      "Wolff-Kishner reduction: Step 1: H2NNH2, H+ → hydrazone (C=N–NH2). Step 2: KOH, heat → alkane. Completely removes the carbonyl, converts C=O to CH2. Clemmensen reduction (Zn/Hg, HCl) does same thing under acidic conditions.",
      "Acetal formation and protection: Carbonyl + 2 ROH, H+ → acetal R2C(OR')2 + H2O. Reversible — add acid + H2O to deprotect. Aldehyde more reactive than ketone. Used as protecting group to block one carbonyl during multi-step synthesis.",
      "Wittig reaction: Ylide (Ph3P=CR2) + aldehyde or ketone → alkene + Ph3P=O. Wittig salt formed first by SN2 (Ph3P + RX). Base (NaOCH3) deprotonates salt → ylide. Allows C=O → C=C conversion.",
    ],
    howToStudy: [
      "Practice nucleophilic addition mechanisms to aldehydes and ketones with curved arrows",
      "Work through imine and enamine formation mechanisms",
      "Practice Wolff-Kishner mechanism completely",
      "Practice Wittig: identify the ylide + carbonyl pair needed for a target alkene",
      "Tip — Aldehydes are more reactive than ketones toward nucleophilic addition (less steric hindrance)",
      "Tip — Protect the more reactive aldehyde first when a substrate has both aldehyde and ketone",
    ],
    commonMistakes: [
      "Running imine formation at pH <4.5 — amine is protonated and no longer nucleophilic",
      "Confusing imine (1° amine, C=N–R) with enamine (2° amine, C=C–N) — enamines have no N–H",
      "Forgetting Wolff-Kishner is two steps: hydrazone first, then KOH/heat",
      "Mixing up acetal formation (acid + 2 ROH) vs hydrolysis (acid + H2O)",
    ],
    hasMechanism: true,
    tips: [
      "Aldehydes are more reactive than ketones toward nucleophilic addition (less steric hindrance)",
      "Protect the more reactive aldehyde first when a substrate has both aldehyde and ketone",
    ],
  },
  {
    slug: "carboxylic-acids-derivatives",
    title: "Carboxylic Acids and Their Derivatives",
    shortDesc: "Acidity, nucleophilic acyl substitution, and interconversion",
    scheduleWeek: 16,
    chapter: "Chapters 20–21",
    summary:
      "Carboxylic acids (pKa ~5) are the most acidic organic class. Derivatives in decreasing reactivity: acid chloride > anhydride > ester > amide > carboxylate. All react via nucleophilic acyl substitution through a tetrahedral intermediate. Key reactions: Fischer esterification (RCOOH + ROH, H+, reversible, Le Chatelier driven), acid chloride synthesis (SOCl2 or oxalyl chloride), saponification (ester + NaOH). Lactones = cyclic esters; lactams = cyclic amides.",
    externalUrl: "https://openstax.org/books/organic-chemistry/pages/21-2-nucleophilic-acyl-substitution-reactions",
    externalLabel: "OpenStax — Nucleophilic acyl substitution",
    mustKnow: [
      "Reactivity order: Acid chloride > anhydride > ester > amide > carboxylate. More reactive derivatives convert to less reactive — never the reverse in a single step. Reactivity determined by leaving group basicity (weaker base = better leaving group).",
      "Nucleophilic acyl substitution mechanism: Nucleophile attacks carbonyl carbon → tetrahedral intermediate (4 bonds to carbon, negative oxygen) → leaving group departs → product. Four curved arrows total.",
      "Fischer esterification: RCOOH + ROH, H+ → ester + H2O. Reversible. Drive to ester: remove water, remove ester, or excess alcohol (Le Chatelier). Drive to acid + alcohol: excess water, remove products.",
      "Acid chloride synthesis: RCOOH + SOCl2 → RCOCl + SO2 + HCl. Or use oxalyl chloride (ClCO)2. Acid chlorides are the most reactive derivatives — convert to anything else.",
      "Spectroscopy of carboxylic acids: IR C=O at 1710 cm⁻¹. O–H stretch at 2500–3500 cm⁻¹ (very broad). 1H NMR: O–H at 10–13 ppm (broad). 13C NMR: carbonyl C at 160–210 ppm. Alpha C–H at ~2.1 ppm.",
    ],
    howToStudy: [
      "Memorize reactivity order and justify using leaving group basicity",
      "Practice nucleophilic acyl substitution mechanisms for each derivative class",
      "Practice Fischer esterification and identify conditions to shift equilibrium",
      "Practice multi-step interconversions using the reactivity flow chart",
      "Tip — Memorize the reactivity order: acid chloride > anhydride > ester > amide > carboxylate",
      "Tip — Grignard + CO2 → carboxylic acid is cleaner than nitrile hydrolysis in most cases",
    ],
    commonMistakes: [
      "Trying to convert less reactive to more reactive in one step — impossible without special reagents",
      "Forgetting Fischer esterification is reversible — must use Le Chatelier to drive it",
      "Confusing lactone (cyclic ester) with lactam (cyclic amide)",
      "Forgetting SOCl2 converts –COOH all the way to –COCl",
    ],
    hasMechanism: true,
    tips: [
      "Memorize the reactivity order: acid chloride > anhydride > ester > amide > carboxylate",
      "Grignard + CO2 → carboxylic acid is cleaner than nitrile hydrolysis in most cases",
    ],
  },
];

export const orgochem2Topics: Topic[] = applyOrgChem2Enrichment(_orgochem2TopicsBase);

export function getCourseTopics(course: CourseId): Topic[] {
  if (course === "orgochem-1") return ORGOCHEM_1;
  return orgochem2Topics;
}

export function findTopic(course: CourseId, slug: string): Topic | undefined {
  return getCourseTopics(course).find((t) => t.slug === slug);
}
