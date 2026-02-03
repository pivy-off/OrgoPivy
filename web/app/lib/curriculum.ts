export type CourseId = "orgochem-1" | "orgochem-2";

export type Video = {
  url: string;
  title: string;
  thumbnail: string;
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
  mustKnowVideos?: Video[]; // Videos for each must-know item (index-matched)
  howToStudy: string[];

  video?: Video; // Topic-level video

  hasMechanism: boolean;

  /** Optional activity PDFs (e.g. M. R. Garrett POGIL-style activities) */
  activityPdfs?: { url: string; label: string }[];
};

const ORGOCHEM_1: Topic[] = [
  {
    slug: "resonance-acid-base",
    title: "Resonance & Acid-Base",
    shortDesc: "Drawing resonance forms, Brønsted-Lowry, pKa, conjugate pairs, equilibrium direction",
    summary:
      "Master resonance (π bonds and lone pairs move; σ bonds stay) and acid-base (equilibrium favors weaker acid). Essential foundation for all of orgo.",
    externalUrl: "https://openstax.org/books/organic-chemistry/pages/2-introduction",
    externalLabel: "OpenStax Organic Chemistry - Chapter 2: Polar Covalent Bonds, Acids and Bases",
    video: {
      url: "https://www.youtube.com/watch?v=9B5FGPDwX_E",
      title: "Resonance Structures - How To Draw The Resonance Hybrid",
      thumbnail: "https://img.youtube.com/vi/9B5FGPDwX_E/maxresdefault.jpg",
    },
    mustKnow: [
      "Resonance: π bonds and lone pairs can move; σ bonds and atom positions stay fixed; resonance forms differ only in electron placement",
      "Charge formula: formal charge = valence − bonds − lone pairs; use to check resonance structures",
      "Brønsted-Lowry: acid = proton donor; base = proton acceptor; conjugate acid = base + H⁺; conjugate base = acid − H⁺",
      "Equilibrium favors weaker acid (higher pKa); lower pKa = stronger acid; conjugates are on the side of the weaker acid",
      "Predicting reactions: label acid, base, conjugate acid, conjugate base; compare pKa; equilibrium arrows point toward weaker acid",
    ],
    mustKnowVideos: [
      { url: "https://www.youtube.com/watch?v=9B5FGPDwX_E", title: "Resonance Structures - Drawing Resonance Hybrid", thumbnail: "https://img.youtube.com/vi/9B5FGPDwX_E/maxresdefault.jpg" },
      { url: "https://www.youtube.com/watch?v=K07VceUan0k", title: "Acid-Base Reactions and pKa", thumbnail: "https://img.youtube.com/vi/K07VceUan0k/maxresdefault.jpg" },
      { url: "https://www.youtube.com/watch?v=K07VceUan0k", title: "Conjugate Acid-Base Pairs", thumbnail: "https://img.youtube.com/vi/K07VceUan0k/maxresdefault.jpg" },
      { url: "https://www.youtube.com/watch?v=K07VceUan0k", title: "Predicting Equilibrium from pKa", thumbnail: "https://img.youtube.com/vi/K07VceUan0k/maxresdefault.jpg" },
      { url: "https://www.youtube.com/watch?v=K07VceUan0k", title: "pKa Values and Acid Strength", thumbnail: "https://img.youtube.com/vi/K07VceUan0k/maxresdefault.jpg" },
    ],
    howToStudy: [
      "Draw 10 resonance structures with curved arrows; check formal charges",
      "Label acid, base, conjugate acid, conjugate base on 15 reactions",
      "Use pKa table to predict equilibrium direction on 20 problems",
      "Do Activity 1-style problems: electron flow arrows, equilibrium arrows",
    ],
    hasMechanism: false,
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
    video: {
      url: "https://www.youtube.com/watch?v=TYU_JluleME",
      title: "IUPAC Nomenclature of Alkanes - Naming Organic Compounds",
      thumbnail: "https://img.youtube.com/vi/TYU_JluleME/maxresdefault.jpg",
    },
    mustKnow: [
      "IUPAC naming: find longest chain, number from end giving lowest substituent numbers, list substituents alphabetically",
      "Primary (1°), secondary (2°), tertiary (3°) carbons: count carbons attached to the carbon of interest",
      "Conformations: staggered (lower energy) vs eclipsed (higher energy); anti (180°) vs gauche (60°) for butane",
      "Newman projections: view down C-C bond, identify most stable conformation (anti > gauche > eclipsed)",
      "Strain types: torsional (eclipsed bonds), steric (crowded groups), angle (deviations from ideal bond angles)",
    ],
    mustKnowVideos: [
      {
        url: "https://www.youtube.com/watch?v=TYU_JluleME",
        title: "IUPAC Nomenclature of Alkanes - Naming Organic Compounds",
        thumbnail: "https://img.youtube.com/vi/TYU_JluleME/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=pz11Qpcc3Fs",
        title: "Identifying Primary, Secondary and Tertiary Carbons",
        thumbnail: "https://img.youtube.com/vi/pz11Qpcc3Fs/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=-fff3Ytm7U0",
        title: "Eclipsed, Gauche, Anti [Staggered] Conformations of Newman Projections MADE EASY!",
        thumbnail: "https://img.youtube.com/vi/-fff3Ytm7U0/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=xpJLSx3f6ug",
        title: "Newman Projections | Anti, Gauche, Staggered, and Eclipsed Energy Diagrams",
        thumbnail: "https://img.youtube.com/vi/xpJLSx3f6ug/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=_CCHTptAhLQ",
        title: "Strain in Organic Molecules - Torsional, Steric, Angle Strain",
        thumbnail: "https://img.youtube.com/vi/_CCHTptAhLQ/maxresdefault.jpg",
      },
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
    video: {
      url: "https://www.youtube.com/watch?v=UtM-F2zlgmw",
      title: "Cyclohexane Chair Conformations and Ring Flips",
      thumbnail: "https://img.youtube.com/vi/UtM-F2zlgmw/maxresdefault.jpg",
    },
    mustKnow: [
      "Chair conformation: alternating axial (up/down) and equatorial (around ring) positions; equatorial is more stable",
      "Chair flip: all axial become equatorial and vice versa; up substituents stay up, down stay down",
      "1,3-diaxial interactions: axial substituents clash with axial H's 3 carbons away; bulky groups prefer equatorial",
      "Cis/trans in rings: cis = both up or both down; trans = one up one down; relate to wedge/dash notation",
      "Stability: mono-substituted prefers equatorial; trans-1,4-disubstituted prefers diequatorial conformation",
    ],
    mustKnowVideos: [
      {
        url: "https://www.youtube.com/watch?v=hr7EtgUBmRM",
        title: "Cycloalkanes and Cyclohexane Chair Conformations - Axial and Equatorial",
        thumbnail: "https://img.youtube.com/vi/hr7EtgUBmRM/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=UtM-F2zlgmw",
        title: "Cyclohexane Chair Conformations and Ring Flips",
        thumbnail: "https://img.youtube.com/vi/UtM-F2zlgmw/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=hr7EtgUBmRM",
        title: "1,3-Diaxial Interactions and Steric Strain in Cyclohexane",
        thumbnail: "https://img.youtube.com/vi/hr7EtgUBmRM/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=UtM-F2zlgmw",
        title: "Cis and Trans Isomers in Cyclohexane - Chair Conformations",
        thumbnail: "https://img.youtube.com/vi/UtM-F2zlgmw/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=hr7EtgUBmRM",
        title: "Energy Ranking of Substituted Cyclohexanes - Stability Analysis",
        thumbnail: "https://img.youtube.com/vi/hr7EtgUBmRM/maxresdefault.jpg",
      },
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
    video: {
      url: "https://www.youtube.com/watch?v=yzfcrwJ37kI",
      title: "R and S Configuration Using Cahn Ingold Prelog Priority Rules",
      thumbnail: "https://img.youtube.com/vi/yzfcrwJ37kI/maxresdefault.jpg",
    },
    mustKnow: [
      "Stereocenter: carbon with 4 different groups; chiral molecule has no plane of symmetry; meso compounds have stereocenters but are achiral",
      "Enantiomers: mirror images, not superimposable; diastereomers: stereoisomers that aren't enantiomers; identical: same molecule",
      "R/S assignment: assign CIP priorities (atomic number), put lowest priority away, trace 1→2→3: clockwise=R, counterclockwise=S",
      "E/Z assignment: assign priorities to each side of double bond; E = high priority groups trans, Z = high priority groups cis",
      "Optical activity: chiral molecules rotate plane-polarized light; racemic mixture (50:50 enantiomers) has no net rotation",
    ],
    mustKnowVideos: [
      {
        url: "https://www.youtube.com/watch?v=WW6oAqVNBR8",
        title: "R and S Configuration Using Cahn Ingold Prelog Priority Rules - Leah4Sci",
        thumbnail: "https://img.youtube.com/vi/WW6oAqVNBR8/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=caVwvvrAyas",
        title: "What Are Stereoisomers? Enantiomers, Diastereomers, and Meso Compounds",
        thumbnail: "https://img.youtube.com/vi/caVwvvrAyas/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=yKyjs4Qb30E",
        title: "How to Assign R and S Configuration Using CIP Priority Rules",
        thumbnail: "https://img.youtube.com/vi/yKyjs4Qb30E/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=7He7goTp6BY",
        title: "E–Z system | Alkenes and alkynes | Khan Academy",
        thumbnail: "https://img.youtube.com/vi/7He7goTp6BY/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=yzfcrwJ37kI",
        title: "Optical Activity and Racemic Mixtures - Chiral Molecules",
        thumbnail: "https://img.youtube.com/vi/yzfcrwJ37kI/maxresdefault.jpg",
      },
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
    video: {
      url: "https://www.youtube.com/watch?v=hz-fSXifP9w",
      title: "SN2 SN1 E1 E2 Reaction Mechanisms Made Easy!",
      thumbnail: "https://img.youtube.com/vi/hz-fSXifP9w/maxresdefault.jpg",
    },
    mustKnow: [
      "Substrate: methyl/1° favor SN2/E2; 2° can do all four; 3° favors SN1/E1 (no SN2); bulky 3° favors E2",
      "Nucleophile vs base: strong nucleophile + weak base → substitution; strong base → elimination; weak both → SN1/E1",
      "Solvent: polar aprotic (DMSO, DMF, acetone) favors SN2; polar protic (H2O, alcohols) favors SN1/E1",
      "Stereochemistry: SN2 = inversion; SN1 = racemization; E2 = anti-periplanar requirement; E1 = no requirement",
      "Regioselectivity: Zaitsev = more substituted alkene (thermodynamic); Hofmann = less substituted (with bulky base)",
    ],
    mustKnowVideos: [
      {
        url: "https://www.youtube.com/watch?v=5ALRV3crwXA",
        title: "Choosing Between SN1 SN2 E1 E2 Reactions - Leah4Sci",
        thumbnail: "https://img.youtube.com/vi/5ALRV3crwXA/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=2SWVieovfsQ",
        title: "Determining SN1, SN2, E1, and E2 Reactions - Crash Course Organic Chemistry",
        thumbnail: "https://img.youtube.com/vi/2SWVieovfsQ/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=hz-fSXifP9w",
        title: "Solvent Effects - Polar Protic vs Polar Aprotic in SN1 SN2 E1 E2",
        thumbnail: "https://img.youtube.com/vi/hz-fSXifP9w/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=hz-fSXifP9w",
        title: "Stereochemistry of SN1 SN2 E1 E2 Reactions - Inversion vs Racemization",
        thumbnail: "https://img.youtube.com/vi/hz-fSXifP9w/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=5ALRV3crwXA",
        title: "Zaitsev vs Hofmann Product Regioselectivity in Elimination Reactions",
        thumbnail: "https://img.youtube.com/vi/5ALRV3crwXA/maxresdefault.jpg",
      },
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
    video: {
      url: "https://www.youtube.com/watch?v=hgHJojT6EXU",
      title: "Alkene Reactions Made Simple - Mechanisms, Markovnikov's Rule, Lots of Practice",
      thumbnail: "https://img.youtube.com/vi/hgHJojT6EXU/maxresdefault.jpg",
    },
    mustKnow: [
      "Markovnikov: H adds to less substituted C, X adds to more substituted C (HX, acid-catalyzed hydration); anti-Markovnikov: opposite (hydroboration-oxidation)",
      "Key reactions: HX (Markovnikov), X2 (anti addition), halohydrin (X2/H2O), hydration (H+/H2O), oxymercuration (Markovnikov, no rearrangement), hydroboration (anti-Markovnikov, syn addition)",
      "Stereochemistry: syn addition (H2/Pd, hydroboration) = both add from same face; anti addition (X2, halohydrin) = add from opposite faces",
      "Carbocation rearrangements: hydride shift (H-) or methyl shift (CH3-) to form more stable carbocation (3° > 2° > 1°)",
      "Ozonolysis: cleaves C=C to carbonyls; terminal alkene → aldehyde + HCHO; internal alkene → two carbonyls; identify original alkene from products",
    ],
    mustKnowVideos: [
      {
        url: "https://www.youtube.com/watch?v=hgHJojT6EXU",
        title: "Alkene Reactions Made Simple - Mechanisms, Markovnikov's Rule, Lots of Practice",
        thumbnail: "https://img.youtube.com/vi/hgHJojT6EXU/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=AQmZrC7Mgs8",
        title: "Markovnikov's Rule vs Anti-Markovnikov in Alkene Addition Reactions",
        thumbnail: "https://img.youtube.com/vi/AQmZrC7Mgs8/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=hgHJojT6EXU",
        title: "Syn vs Anti Addition Stereochemistry in Alkene Reactions",
        thumbnail: "https://img.youtube.com/vi/hgHJojT6EXU/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=AQmZrC7Mgs8",
        title: "Carbocation Rearrangements - Hydride and Methyl Shifts Explained",
        thumbnail: "https://img.youtube.com/vi/AQmZrC7Mgs8/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=ID79wLZLzbA",
        title: "Ozonolysis - Oxidative Cleavage of Alkenes",
        thumbnail: "https://img.youtube.com/vi/ID79wLZLzbA/maxresdefault.jpg",
      },
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
    slug: "alkynes",
    title: "Alkynes",
    shortDesc: "Addition, hydration, reduction, oxidative cleavage, acetylide alkylation",
    summary:
      "Alkynes add twice like alkenes. Hydration gives carbonyls via enol tautomerization. Lindlar → cis alkene; Na/NH₃ → trans. Terminal alkynes are acidic (pKa ~25).",
    externalUrl: "https://openstax.org/books/organic-chemistry/pages/9-introduction",
    externalLabel: "OpenStax Organic Chemistry - Chapter 9: Alkynes",
    video: {
      url: "https://www.youtube.com/watch?v=W6QwEySRzuM",
      title: "Alkyne Reduction - Lindlar, Na/NH3, Hydrogenation",
      thumbnail: "https://img.youtube.com/vi/W6QwEySRzuM/maxresdefault.jpg",
    },
    mustKnow: [
      "Addition: HX (Markovnikov), X₂, H₂ (always adds twice to alkane); same as alkenes but electrophile adds twice",
      "Hydration: Hg²⁺/H₂O → Markovnikov ketone (enol tautomerizes); hydroboration-oxidation → anti-Markovnikov aldehyde (terminal only)",
      "Reduction: H₂/Pd → alkane; Lindlar (H₂, Pd/BaSO₄, quinoline) → cis alkene; Na/NH₃ → trans alkene",
      "Oxidative cleavage: O₃ or KMnO₄; internal alkyne → carboxylic acids; terminal → CO₂ + carboxylic acid",
      "Acidity: terminal alkyne RC≡CH pKa ~25; NaNH₂, BuLi deprotonate; acetylide + alkyl halide → SN2, extended alkyne",
    ],
    mustKnowVideos: [
      { url: "https://www.youtube.com/watch?v=W6QwEySRzuM", title: "Alkyne Reduction - Lindlar, Na/NH3", thumbnail: "https://img.youtube.com/vi/W6QwEySRzuM/maxresdefault.jpg" },
      { url: "https://www.youtube.com/watch?v=hgHJojT6EXU", title: "Alkyne Addition - HX, X2 (like alkenes)", thumbnail: "https://img.youtube.com/vi/hgHJojT6EXU/maxresdefault.jpg" },
      { url: "https://www.youtube.com/watch?v=ID79wLZLzbA", title: "Alkyne Hydration - Enol to Ketone Tautomerization", thumbnail: "https://img.youtube.com/vi/ID79wLZLzbA/maxresdefault.jpg" },
      { url: "https://www.youtube.com/watch?v=W6QwEySRzuM", title: "Lindlar vs Na/NH3 - cis vs trans alkene", thumbnail: "https://img.youtube.com/vi/W6QwEySRzuM/maxresdefault.jpg" },
      { url: "https://www.youtube.com/watch?v=K07VceUan0k", title: "Terminal Alkyne Acidity - Acetylide Alkylation", thumbnail: "https://img.youtube.com/vi/K07VceUan0k/maxresdefault.jpg" },
    ],
    howToStudy: [
      "Map alkyne reactions: addition (2×), hydration, reduction (3 pathways), cleavage",
      "Do 15 product predictions: HX, X2, Hg²⁺, hydroboration, Lindlar, Na/NH3",
      "Practice acetylide alkylation: deprotonate with NaNH2, then SN2 with R-X",
      "Synthesis: work backwards from carbonyl to alkyne (hydration reverse)",
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
    video: {
      url: "https://www.youtube.com/watch?v=_Xi5ZVbbftI",
      title: "IR Infrared Spectroscopy Review - 15 Practice Problems",
      thumbnail: "https://img.youtube.com/vi/_Xi5ZVbbftI/maxresdefault.jpg",
    },
    mustKnow: [
      "IR spectroscopy: O-H (3200-3600), N-H (3300-3500), C=O (1650-1750), C=C (1600-1680), C≡C (2100-2260), C≡N (2200-2260); fingerprint region <1500",
      "Proton NMR: chemical shift (deshielded = downfield), integration (H count), splitting (n+1 rule, coupling constants), symmetry",
      "Carbon-13 NMR: chemical shift ranges (0-220 ppm), number of unique carbons, no splitting (decoupled), DEPT for CH/CH2/CH3 identification",
      "Degree of unsaturation (DBE): C + 1 - H/2 - X/2 + N/2; DBE = 0 (saturated), 1 (double bond/ring), 2 (triple bond or 2 double bonds), etc.",
      "Structure determination workflow: calculate DBE, analyze IR for functional groups, analyze NMR for connectivity, propose structure, verify all signals match",
    ],
    mustKnowVideos: [
      {
        url: "https://www.youtube.com/watch?v=_Xi5ZVbbftI",
        title: "IR Infrared Spectroscopy Review - 15 Practice Problems",
        thumbnail: "https://img.youtube.com/vi/_Xi5ZVbbftI/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=hoWiuAwdzKU",
        title: "How to Read NMR Spectroscopy - Chemical Shift, Integration, Splitting",
        thumbnail: "https://img.youtube.com/vi/hoWiuAwdzKU/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=UKm0MtSLLNw",
        title: "Carbon-13 NMR Spectroscopy Explained",
        thumbnail: "https://img.youtube.com/vi/UKm0MtSLLNw/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=_Xi5ZVbbftI",
        title: "Degree of Unsaturation - Calculating DBE from Molecular Formula",
        thumbnail: "https://img.youtube.com/vi/_Xi5ZVbbftI/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=_Xi5ZVbbftI",
        title: "Combined Spectroscopy Problems - IR, NMR, Mass Spec",
        thumbnail: "https://img.youtube.com/vi/_Xi5ZVbbftI/maxresdefault.jpg",
      },
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
    video: {
      url: "https://www.youtube.com/watch?v=K07VceUan0k",
      title: "Oxidation of Alcohols",
      thumbnail: "https://img.youtube.com/vi/K07VceUan0k/maxresdefault.jpg",
    },
    mustKnow: [
      "Oxidation levels: 1° alcohol → aldehyde → carboxylic acid; 2° alcohol → ketone; 3° alcohol doesn't oxidize; know which reagents stop where",
      "Oxidation reagents: PCC/DMP (stops at aldehyde), Jones/CrO3 (goes to acid), Swern (aldehyde), KMnO4/Na2Cr2O7 (acid); MnO2 (selective for allylic alcohols)",
      "Alcohol to leaving group: TsCl/pyridine → tosylate; MsCl/pyridine → mesylate; both are excellent leaving groups for SN2/E2",
      "Protecting groups: TBDMS/TIPS silyl ethers protect OH from oxidation/reduction; remove with F- or acid; essential in multi-step synthesis",
      "Dehydration: acid-catalyzed (H2SO4/heat) gives E1 mechanism with carbocation rearrangements; Zaitsev product; can form ethers at lower temp",
    ],
    mustKnowVideos: [
      {
        url: "https://www.youtube.com/watch?v=K07VceUan0k",
        title: "Oxidation of Alcohols - Primary, Secondary, Tertiary",
        thumbnail: "https://img.youtube.com/vi/K07VceUan0k/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=K07VceUan0k",
        title: "Oxidation Reagents - PCC, Jones, Swern, DMP",
        thumbnail: "https://img.youtube.com/vi/K07VceUan0k/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=K07VceUan0k",
        title: "Converting Alcohols to Leaving Groups - Tosylates and Mesylates",
        thumbnail: "https://img.youtube.com/vi/K07VceUan0k/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=K07VceUan0k",
        title: "Protecting Groups for Alcohols - Silyl Ethers",
        thumbnail: "https://img.youtube.com/vi/K07VceUan0k/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=K07VceUan0k",
        title: "Acid-Catalyzed Dehydration of Alcohols",
        thumbnail: "https://img.youtube.com/vi/K07VceUan0k/maxresdefault.jpg",
      },
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
    video: {
      url: "https://www.youtube.com/watch?v=BxRLJhHjqMc",
      title: "Ether and Epoxide Reactions",
      thumbnail: "https://img.youtube.com/vi/BxRLJhHjqMc/maxresdefault.jpg",
    },
    mustKnow: [
      "Williamson ether synthesis: alkoxide (RO-) + alkyl halide → ether via SN2; primary halide works best; intramolecular forms epoxides",
      "Epoxide opening: basic conditions (RO-, OH-) attack less substituted C (SN2); acidic conditions (H+) attack more substituted C (protonated epoxide); both give anti addition",
      "Stereochemistry: epoxide opening is always anti (trans-diaxial); nucleophile and leaving group end up trans to each other",
      "Ether cleavage: strong acids (HI, HBr) cleave ethers; mechanism depends on substitution; can give alkyl halides or alcohols",
      "Ethers as protecting groups: protect alcohols from oxidation/reduction; remove with strong acid (HBr, HI); useful in synthesis planning",
    ],
    mustKnowVideos: [
      {
        url: "https://www.youtube.com/watch?v=BxRLJhHjqMc",
        title: "Ether and Epoxide Reactions",
        thumbnail: "https://img.youtube.com/vi/BxRLJhHjqMc/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=2OOhbhQXdhI",
        title: "Williamson Ether Synthesis - SN2 Mechanism",
        thumbnail: "https://img.youtube.com/vi/2OOhbhQXdhI/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=fQr2-EBRTkk",
        title: "Epoxide Opening - Acidic vs Basic Conditions",
        thumbnail: "https://img.youtube.com/vi/fQr2-EBRTkk/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=BxRLJhHjqMc",
        title: "Epoxide Stereochemistry - Anti Addition",
        thumbnail: "https://img.youtube.com/vi/BxRLJhHjqMc/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=BxRLJhHjqMc",
        title: "Ether Cleavage Reactions",
        thumbnail: "https://img.youtube.com/vi/BxRLJhHjqMc/maxresdefault.jpg",
      },
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
    video: {
      url: "https://www.youtube.com/watch?v=X5I2vG576QA",
      title: "Grignard Reagent Synthesis Reaction Mechanism",
      thumbnail: "https://img.youtube.com/vi/X5I2vG576QA/maxresdefault.jpg",
    },
    mustKnow: [
      "Carbonyl reactivity: aldehydes > ketones (steric and electronic effects); aldehydes have one R group, ketones have two (less electrophilic)",
      "Nucleophilic additions: hydride (NaBH4, LiAlH4) → alcohol; Grignard/organolithium (RMgX, RLi) → alcohol; CN- → cyanohydrin; ROH/acid → acetal",
      "Imine formation: aldehyde/ketone + primary amine → imine (C=N) via hemiaminal intermediate; enamine: aldehyde/ketone + secondary amine → enamine (C-N with C=C)",
      "Acetal protection: aldehyde/ketone + 2 ROH + acid catalyst → acetal; stable to base, nucleophiles, reducing agents; deprotect with aqueous acid",
      "Structure confirmation: use IR (C=O ~1700), NMR (aldehyde H ~9-10 ppm, ketone no aldehyde H), and other spectroscopic data to verify products",
    ],
    mustKnowVideos: [
      {
        url: "https://www.youtube.com/watch?v=X5I2vG576QA",
        title: "Grignard Reagent Synthesis Reaction Mechanism",
        thumbnail: "https://img.youtube.com/vi/X5I2vG576QA/hqdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=D5-1qEKtfQ4",
        title: "Addition of Carbon Nucleophiles to Aldehydes and Ketones",
        thumbnail: "https://img.youtube.com/vi/D5-1qEKtfQ4/hqdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=_0C7XXWjOpQ",
        title: "Imine and Enamine Formation Reactions",
        thumbnail: "https://img.youtube.com/vi/_0C7XXWjOpQ/hqdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=PjBGN19tQuw",
        title: "Acetal Formation and Deprotection - Carbonyl Protection",
        thumbnail: "https://img.youtube.com/vi/PjBGN19tQuw/hqdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=UfulhkYQNmA",
        title: "Carbonyl Reactivity - Aldehydes vs Ketones",
        thumbnail: "https://img.youtube.com/vi/UfulhkYQNmA/hqdefault.jpg",
      },
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
    video: {
      url: "https://www.youtube.com/watch?v=HaeWpZ3ecyA",
      title: "Nucleophilic Acyl Substitution Reaction Mechanism - Carboxylic Acid Derivatives",
      thumbnail: "https://img.youtube.com/vi/HaeWpZ3ecyA/maxresdefault.jpg",
    },
    mustKnow: [
      "Reactivity ladder: acyl chloride > anhydride > ester > carboxylic acid > amide (based on leaving group ability; Cl- > RCO2- > RO- > OH- > NH2-)",
      "Nucleophilic acyl substitution: two-step addition-elimination; nucleophile attacks carbonyl → tetrahedral intermediate → leaving group expelled; NOT addition like aldehydes/ketones",
      "Conversions: acid → acid chloride (SOCl2, PCl5); acid chloride → ester (ROH/pyridine); acid chloride → amide (NH3, RNH2); ester → amide (NH3, excess); transesterification (ROH/acid)",
      "Decarboxylation: β-ketoacids and malonic acids decarboxylate on heating; β-dicarbonyls are acidic (pKa ~9-13) due to enolate stabilization",
      "Spectroscopy: acid (broad O-H ~3000, C=O ~1710); ester (C=O ~1735, no O-H); amide (C=O ~1680, N-H ~3300); acid chloride (C=O ~1800, very reactive)",
    ],
    mustKnowVideos: [
      {
        url: "https://www.youtube.com/watch?v=HaeWpZ3ecyA",
        title: "Nucleophilic Acyl Substitution Reaction Mechanism",
        thumbnail: "https://img.youtube.com/vi/HaeWpZ3ecyA/hqdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=Av9x8DilfWU",
        title: "Carboxylic Acid Derivatives Reactivity Ladder",
        thumbnail: "https://img.youtube.com/vi/Av9x8DilfWU/hqdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=4KmNRscPgPA",
        title: "Converting Between Carboxylic Acid Derivatives - Acid Chlorides",
        thumbnail: "https://img.youtube.com/vi/4KmNRscPgPA/hqdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=Fz9Ws8e92UI",
        title: "Decarboxylation and Beta-Ketoacids - Acyl Substitution",
        thumbnail: "https://img.youtube.com/vi/Fz9Ws8e92UI/hqdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=_Xi5ZVbbftI",
        title: "Spectroscopy of Carboxylic Acid Derivatives - IR",
        thumbnail: "https://img.youtube.com/vi/_Xi5ZVbbftI/hqdefault.jpg",
      },
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
    video: {
      url: "https://www.youtube.com/watch?v=OBT3otCRBxg",
      title: "Aldol Addition Reactions, Intramolecular Aldol Condensation Reactions",
      thumbnail: "https://img.youtube.com/vi/OBT3otCRBxg/maxresdefault.jpg",
    },
    mustKnow: [
      "Alpha hydrogen acidity: α-H's are acidic (pKa ~20 for ketones, ~25 for esters) due to enolate resonance; stronger base (LDA, NaH) → enolate; weaker base (OH-) → enol equilibrium",
      "Kinetic vs thermodynamic enolate: kinetic (LDA, low temp) attacks less substituted α-C; thermodynamic (strong base, high temp) attacks more substituted α-C (more stable enolate)",
      "Aldol reaction: enolate + carbonyl → β-hydroxy carbonyl (aldol addition); with heat/base → α,β-unsaturated carbonyl (aldol condensation); can be intramolecular",
      "Claisen condensation: ester enolate + ester → β-ketoester; requires: 2 α-H's, matching alkoxide base (R'O- for R'CO2R'), full equivalent of base (consumed in second deprotonation)",
      "Michael addition: enolate (donor) + α,β-unsaturated carbonyl (acceptor) → 1,4-addition (conjugate addition); forms new C-C bond β to carbonyl; enolate attacks β-carbon",
    ],
    mustKnowVideos: [
      {
        url: "https://www.youtube.com/watch?v=OBT3otCRBxg",
        title: "Aldol Addition Reactions, Intramolecular Aldol Condensation",
        thumbnail: "https://img.youtube.com/vi/OBT3otCRBxg/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=OBT3otCRBxg",
        title: "Enolate Formation - Alpha Hydrogen Acidity",
        thumbnail: "https://img.youtube.com/vi/OBT3otCRBxg/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=OBT3otCRBxg",
        title: "Kinetic vs Thermodynamic Enolate Control",
        thumbnail: "https://img.youtube.com/vi/OBT3otCRBxg/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=0j6LAFhV6Bk",
        title: "Claisen Condensation Mechanism - Beta-Ketoester Formation",
        thumbnail: "https://img.youtube.com/vi/0j6LAFhV6Bk/hqdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=OBT3otCRBxg",
        title: "Michael Addition - Conjugate Addition of Enolates",
        thumbnail: "https://img.youtube.com/vi/OBT3otCRBxg/maxresdefault.jpg",
      },
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
    video: {
      url: "https://www.youtube.com/watch?v=ubtvxTvdWjA",
      title: "Electrophilic Aromatic Substitution Reactions Made Easy!",
      thumbnail: "https://img.youtube.com/vi/ubtvxTvdWjA/maxresdefault.jpg",
    },
    mustKnow: [
      "Aromaticity: Hückel's rule (4n+2 π electrons), planar, cyclic, conjugated; benzene is aromatic (6 π e-); antiaromatic (4n π e-); nonaromatic (not fully conjugated)",
      "EAS mechanism: electrophile attacks aromatic ring → σ-complex (arenium ion, sp3 carbon) → loss of H+ regenerates aromaticity; rate-determining step is σ-complex formation",
      "Directing effects: activating groups (OH, OR, NH2, alkyl) = ortho/para directors (donate electrons); deactivating groups (NO2, CN, C=O) = meta directors (withdraw electrons); halogens = weakly deactivating but ortho/para directors",
      "Common EAS reactions: nitration (HNO3/H2SO4), sulfonation (SO3/H2SO4), halogenation (X2/FeX3), Friedel-Crafts alkylation (RCl/AlCl3), Friedel-Crafts acylation (RCOCl/AlCl3)",
      "Synthesis strategy: order matters! Activating groups go first (faster), then deactivating; meta-directors block ortho/para; plan sequence to avoid wrong substitution patterns",
    ],
    mustKnowVideos: [
      {
        url: "https://www.youtube.com/watch?v=ubtvxTvdWjA",
        title: "Electrophilic Aromatic Substitution Reactions Made Easy!",
        thumbnail: "https://img.youtube.com/vi/ubtvxTvdWjA/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=ubtvxTvdWjA",
        title: "Aromaticity and Hückel's Rule",
        thumbnail: "https://img.youtube.com/vi/ubtvxTvdWjA/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=BDooDi7zQxo",
        title: "Ortho Meta Para Directors - Activating and Deactivating Groups",
        thumbnail: "https://img.youtube.com/vi/BDooDi7zQxo/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=ubtvxTvdWjA",
        title: "EAS Mechanism - Sigma Complex Formation",
        thumbnail: "https://img.youtube.com/vi/ubtvxTvdWjA/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=ubtvxTvdWjA",
        title: "EAS Synthesis Strategy - Order of Substitution",
        thumbnail: "https://img.youtube.com/vi/ubtvxTvdWjA/maxresdefault.jpg",
      },
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
    video: {
      url: "https://www.youtube.com/watch?v=_0C7XXWjOpQ",
      title: "Imine and Enamine Formation Reactions With Reductive Amination",
      thumbnail: "https://img.youtube.com/vi/_0C7XXWjOpQ/maxresdefault.jpg",
    },
    mustKnow: [
      "Amine classification: primary (1°: RNH2), secondary (2°: R2NH), tertiary (3°: R3N), quaternary ammonium (R4N+); all have lone pair on N",
      "Basicity trends: aliphatic amines (pKaH ~9-10) > ammonia (pKaH ~9.2) > aromatic amines (aniline pKaH ~4.6); resonance in aniline delocalizes lone pair, reducing basicity; alkyl groups increase basicity (inductive effect)",
      "Reductive amination: carbonyl (aldehyde/ketone) + amine → imine intermediate → reduction (NaBH4, NaBH3CN, H2/Pd) → amine; versatile for 1°, 2°, 3° amine synthesis",
      "Amide formation: carboxylic acid derivative (acid chloride, ester) + amine → amide; amides are weak bases (pKaH ~0-1) due to resonance delocalization of N lone pair into C=O",
      "Structure confirmation: IR (N-H stretch ~3300-3500, C=O ~1680 for amides); NMR (amine H's ~1-5 ppm, broad if exchangeable); use spectroscopy to verify amine vs amide",
    ],
    mustKnowVideos: [
      {
        url: "https://www.youtube.com/watch?v=_0C7XXWjOpQ",
        title: "Imine and Enamine Formation Reactions With Reductive Amination",
        thumbnail: "https://img.youtube.com/vi/_0C7XXWjOpQ/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=qwoH15IqKlY",
        title: "Comparing Basic Strength of Nitrogenous Aromatic Molecules",
        thumbnail: "https://img.youtube.com/vi/qwoH15IqKlY/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=_0C7XXWjOpQ",
        title: "Reductive Amination Mechanism - Imine Formation and Reduction",
        thumbnail: "https://img.youtube.com/vi/_0C7XXWjOpQ/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=_0C7XXWjOpQ",
        title: "Amide Formation and Basicity of Amines",
        thumbnail: "https://img.youtube.com/vi/_0C7XXWjOpQ/maxresdefault.jpg",
      },
      {
        url: "https://www.youtube.com/watch?v=_0C7XXWjOpQ",
        title: "Amine Basicity Trends - Resonance and Inductive Effects",
        thumbnail: "https://img.youtube.com/vi/_0C7XXWjOpQ/maxresdefault.jpg",
      },
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
