// Memorization items for organic chemistry topics
// Enhanced with valuable "must know" information from curriculum

import { findTopic, getCourseTopics } from "./curriculum";
import type { CourseId } from "./curriculum";

export type MemorizationItemEntry = {
  term: string;
  value: string;
  note?: string;
  /** Best image from the web for this item (e.g. Wikipedia Commons structure) */
  imageUrl?: string;
  imageAlt?: string;
  /** Shown when user hasn't reached spectroscopy yet (no IR/NMR) */
  valueNoSpectroscopy?: string;
};

export type MemorizationItem = {
  category: string;
  /** Optional image for the whole category (e.g. reference diagram) */
  categoryImageUrl?: string;
  categoryImageAlt?: string;
  items: MemorizationItemEntry[];
};

// Topics before spectroscopy in Orgo 1 — don't show IR/NMR on functional groups yet
const SLUGS_BEFORE_SPECTROSCOPY = ["alkanes", "cycloalkanes", "stereochemistry", "substitution-elimination", "alkenes"];

function getTopicFromSlug(slug: string): { topic: any; course: CourseId } | null {
  const orgochem1Topics = getCourseTopics("orgochem-1");
  const orgochem2Topics = getCourseTopics("orgochem-2");
  
  let topic = orgochem1Topics.find(t => t.slug === slug);
  if (topic) return { topic, course: "orgochem-1" };
  
  topic = orgochem2Topics.find(t => t.slug === slug);
  if (topic) return { topic, course: "orgochem-2" };
  
  return null;
}

export function getMemorizationItems(slug: string): MemorizationItem[] {
  const topicData = getTopicFromSlug(slug);
  const items: MemorizationItem[] = [];

  // Add "Must Know" items as flashcards - these are the most valuable
  if (topicData?.topic.mustKnow && topicData.topic.mustKnow.length > 0) {
    // Group must-know items into logical categories for better organization
    const categorizedItems: Record<string, Array<{term: string; value: string; note?: string}>> = {};
    
    topicData.topic.mustKnow.forEach((concept: string, idx: number) => {
      // Determine category based on content
      let category = "Must Know Concepts";
      
      if (concept.toLowerCase().includes("newman") || concept.toLowerCase().includes("conformation") || concept.toLowerCase().includes("staggered") || concept.toLowerCase().includes("eclipsed") || concept.toLowerCase().includes("anti") || concept.toLowerCase().includes("gauche")) {
        category = "Conformations & Newman Projections";
      } else if (concept.toLowerCase().includes("naming") || concept.toLowerCase().includes("iupac") || concept.toLowerCase().includes("substituent") || concept.toLowerCase().includes("alphabetical")) {
        category = "Naming Rules";
      } else if (concept.toLowerCase().includes("primary") || concept.toLowerCase().includes("secondary") || concept.toLowerCase().includes("tertiary") || concept.toLowerCase().includes("1°") || concept.toLowerCase().includes("2°") || concept.toLowerCase().includes("3°")) {
        category = "Carbon Classification";
      } else if (concept.toLowerCase().includes("strain") || concept.toLowerCase().includes("torsional") || concept.toLowerCase().includes("steric") || concept.toLowerCase().includes("angle")) {
        category = "Strain & Stability";
      } else if (concept.toLowerCase().includes("chair") || concept.toLowerCase().includes("axial") || concept.toLowerCase().includes("equatorial") || concept.toLowerCase().includes("flip")) {
        category = "Cycloalkane Conformations";
      } else if (concept.toLowerCase().includes("r/s") || concept.toLowerCase().includes("e/z") || concept.toLowerCase().includes("enantiomer") || concept.toLowerCase().includes("diastereomer") || concept.toLowerCase().includes("chiral") || concept.toLowerCase().includes("stereocenter") || concept.toLowerCase().includes("cip")) {
        category = "Stereochemistry";
      } else if (concept.toLowerCase().includes("sn1") || concept.toLowerCase().includes("sn2") || concept.toLowerCase().includes("e1") || concept.toLowerCase().includes("e2") || concept.toLowerCase().includes("substrate") || concept.toLowerCase().includes("nucleophile") || concept.toLowerCase().includes("solvent")) {
        category = "Substitution & Elimination";
      } else if (concept.toLowerCase().includes("markovnikov") || concept.toLowerCase().includes("addition") || concept.toLowerCase().includes("syn") || concept.toLowerCase().includes("anti") || concept.toLowerCase().includes("rearrangement")) {
        category = "Alkene Reactions";
      } else if (concept.toLowerCase().includes("ir") || concept.toLowerCase().includes("nmr") || concept.toLowerCase().includes("spectroscopy") || concept.toLowerCase().includes("chemical shift") || concept.toLowerCase().includes("splitting")) {
        category = "Spectroscopy";
      } else if (concept.toLowerCase().includes("oxidation") || concept.toLowerCase().includes("pcc") || concept.toLowerCase().includes("jones") || concept.toLowerCase().includes("alcohol")) {
        category = "Alcohol Reactions";
      } else if (concept.toLowerCase().includes("williamson") || concept.toLowerCase().includes("epoxide") || concept.toLowerCase().includes("ether")) {
        category = "Ethers & Epoxides";
      } else if (concept.toLowerCase().includes("carbonyl") || concept.toLowerCase().includes("grignard") || concept.toLowerCase().includes("aldehyde") || concept.toLowerCase().includes("ketone") || concept.toLowerCase().includes("acetal")) {
        category = "Carbonyl Chemistry";
      } else if (concept.toLowerCase().includes("acyl") || concept.toLowerCase().includes("carboxylic") || concept.toLowerCase().includes("ester") || concept.toLowerCase().includes("amide") || concept.toLowerCase().includes("reactivity ladder")) {
        category = "Carboxylic Acid Derivatives";
      } else if (concept.toLowerCase().includes("enolate") || concept.toLowerCase().includes("aldol") || concept.toLowerCase().includes("claisen") || concept.toLowerCase().includes("alpha")) {
        category = "Enolate Chemistry";
      } else if (concept.toLowerCase().includes("aromatic") || concept.toLowerCase().includes("eas") || concept.toLowerCase().includes("directing") || concept.toLowerCase().includes("ortho") || concept.toLowerCase().includes("meta") || concept.toLowerCase().includes("para")) {
        category = "Aromatic Chemistry";
      } else if (concept.toLowerCase().includes("amine") || concept.toLowerCase().includes("basicity") || concept.toLowerCase().includes("reductive amination")) {
        category = "Amines";
      }
      
      if (!categorizedItems[category]) {
        categorizedItems[category] = [];
      }
      
      // Create better flashcard format from must-know concepts
      // Pattern 1: "Term: definition" format
      const colonIndex = concept.indexOf(":");
      if (colonIndex > 0 && colonIndex < concept.length - 5) {
        const term = concept.substring(0, colonIndex).trim();
        const definition = concept.substring(colonIndex + 1).trim();
        categorizedItems[category].push({
          term: term,
          value: definition,
          note: topicData.topic.mustKnowVideos?.[idx]?.title
        });
        return;
      }
      
      // Pattern 2: Split by "vs" or "and" for comparisons
      if (concept.includes(" vs ") || concept.includes(" vs. ")) {
        const parts = concept.split(/ vs\.? /);
        if (parts.length === 2) {
          categorizedItems[category].push({
            term: parts[0].trim(),
            value: parts[1].trim(),
            note: topicData.topic.mustKnowVideos?.[idx]?.title
          });
          return;
        }
      }
      
      // Pattern 3: First sentence as question, rest as answer
      const periodIndex = concept.indexOf(".");
      if (periodIndex > 10 && periodIndex < concept.length / 2) {
        categorizedItems[category].push({
          term: concept.substring(0, periodIndex).trim(),
          value: concept.substring(periodIndex + 1).trim() || concept,
          note: topicData.topic.mustKnowVideos?.[idx]?.title
        });
        return;
      }
      
      // Pattern 4: Extract key concept and explanation
      const words = concept.split(" ");
      if (words.length > 8) {
        const midPoint = Math.floor(words.length * 0.4);
        categorizedItems[category].push({
          term: words.slice(0, midPoint).join(" "),
          value: words.slice(midPoint).join(" "),
          note: topicData.topic.mustKnowVideos?.[idx]?.title
        });
        return;
      }
      
      // Default: Use first part as question, full text as answer
      const questionLength = Math.min(60, Math.floor(concept.length * 0.4));
      categorizedItems[category].push({
        term: concept.substring(0, questionLength).trim() + (concept.length > questionLength ? "..." : ""),
        value: concept,
        note: topicData.topic.mustKnowVideos?.[idx]?.title
      });
    });
    
    // Convert categorized items to MemorizationItem format
    // Don't show Conformations & Newman Projections under Alkanes — conformation is its own topic
    const categoriesToSkipForAlkanes = new Set(["Conformations & Newman Projections"]);
    Object.keys(categorizedItems).forEach(category => {
      if (slug === "alkanes" && categoriesToSkipForAlkanes.has(category)) return;
      if (categorizedItems[category].length > 0) {
        items.push({
          category: category,
          items: categorizedItems[category]
        });
      }
    });
  }

  // Functional groups for Orgo Chem 1: memorize name, structure; IR/NMR only after spectroscopy topic
  const functionalGroupsOrgo1: MemorizationItem = {
    category: "Functional Groups (Memorize & Identify)",
    items: [
      { term: "Alkane", value: "C–C and C–H only (no π bonds). IR: C–H stretch ~2850–2960 cm⁻¹. Very unreactive.", valueNoSpectroscopy: "C–C and C–H only (no π bonds). Very unreactive.", note: "R–H", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Butane-2D-flat.png", imageAlt: "Butane structure" },
      { term: "Alkene", value: "Carbon–carbon double bond (C=C). IR: C=C ~1620–1680 cm⁻¹; vinylic C–H ~3020–3100 cm⁻¹. ¹H NMR: vinyl ~4.5–6.5 ppm.", valueNoSpectroscopy: "Carbon–carbon double bond (C=C).", note: "R₂C=CR₂", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Ethene-2D-flat.png", imageAlt: "Ethene structure" },
      { term: "Alkyne", value: "Carbon–carbon triple bond (C≡C). IR: C≡C ~2100–2260 cm⁻¹; terminal ≡C–H ~3300 cm⁻¹. Terminal alkynes are acidic.", valueNoSpectroscopy: "Carbon–carbon triple bond (C≡C). Terminal alkynes (R–C≡C–H) are acidic.", note: "R–C≡C–H or R–C≡C–R", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Ethyne-2D-flat.png", imageAlt: "Ethyne structure" },
      { term: "Alcohol", value: "R–OH. IR: O–H broad ~3200–3600 cm⁻¹; C–O ~1000–1200 cm⁻¹. ¹H NMR: O–H ~2–5 ppm (variable).", valueNoSpectroscopy: "R–OH. Primary, secondary, or tertiary depending on C attached to OH.", note: "Primary, secondary, tertiary", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/60/Ethanol-2D-flat.png", imageAlt: "Ethanol structure" },
      { term: "Ether", value: "R–O–R′ (C–O–C). IR: C–O ~1050–1150 cm⁻¹ (no O–H). Relatively unreactive.", valueNoSpectroscopy: "R–O–R′ (C–O–C). No O–H. Relatively unreactive.", note: "No O–H", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Diethyl-ether-2D-flat.png", imageAlt: "Diethyl ether structure" },
      { term: "Alkyl halide", value: "R–X (X = F, Cl, Br, I). IR: C–X stretch varies (C–Cl ~700–800). ¹H NMR: R–CH₂–X ~3–4 ppm. Good leaving groups.", valueNoSpectroscopy: "R–X (X = F, Cl, Br, I). Good leaving groups in substitution/elimination.", note: "Halide = leaving group", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Chloroethane-2D-flat.png", imageAlt: "Chloroethane structure" },
      { term: "Aldehyde", value: "R–CHO (C=O with H on carbonyl). IR: C=O ~1725–1740 cm⁻¹; aldehyde C–H ~2700–2800 (doublet). ¹H NMR: CHO ~9–10 ppm.", valueNoSpectroscopy: "R–CHO (C=O with H on carbonyl). Oxidizes to carboxylic acid.", note: "Oxidizes to carboxylic acid", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Acetaldehyde-2D-flat.png", imageAlt: "Acetaldehyde structure" },
      { term: "Ketone", value: "R–(C=O)–R′. IR: C=O ~1705–1720 cm⁻¹. ¹H NMR: no CHO; α protons ~2–2.5 ppm. Resists oxidation.", valueNoSpectroscopy: "R–(C=O)–R′. No H on carbonyl. Resists oxidation.", note: "No H on carbonyl", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/00/Acetone-2D-flat.png", imageAlt: "Acetone structure" },
      { term: "Carboxylic acid", value: "R–COOH. IR: O–H broad ~2500–3300; C=O ~1710 cm⁻¹. ¹H NMR: COOH ~10–12 ppm. Acidic (pKa ~4–5).", valueNoSpectroscopy: "R–COOH. Acidic (pKa ~4–5).", note: "Dimer H-bonding", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Acetic-acid-2D-flat.png", imageAlt: "Acetic acid structure" },
      { term: "Ester", value: "R–COO–R′. IR: C=O ~1735–1750 cm⁻¹; C–O ~1150–1250. No O–H. ¹H NMR: COO–CH₂– ~3.7–4.2 ppm.", valueNoSpectroscopy: "R–COO–R′. Formed from acid + alcohol. No O–H.", note: "From acid + alcohol", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Ethyl-acetate-2D-flat.png", imageAlt: "Ethyl acetate structure" },
      { term: "Amide", value: "R–(C=O)–NR₂. IR: C=O ~1640–1680; N–H ~3200–3500 (1 or 2 peaks). Least reactive carbonyl derivative.", valueNoSpectroscopy: "R–(C=O)–NR₂. Least reactive carbonyl derivative.", note: "N–H in structure", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Acetamide-2D-flat.png", imageAlt: "Acetamide structure" },
      { term: "Amine", value: "R–NH₂, R₂NH, or R₃N. IR: N–H ~3300–3500 (sharp, 1 or 2 peaks). Basic; ¹H NMR: N–H ~1–3 ppm (broad, exchangeable).", valueNoSpectroscopy: "R–NH₂, R₂NH, or R₃N. Basic. Primary: 2 N–H; secondary: 1 N–H.", note: "Primary: 2 N–H; secondary: 1 N–H", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Methylamine-2D-flat.png", imageAlt: "Methylamine structure" },
      { term: "Nitrile", value: "R–C≡N. IR: C≡N ~2210–2260 cm⁻¹ (sharp). ¹H NMR: α protons ~2–3 ppm.", valueNoSpectroscopy: "R–C≡N. Not the same as alkyne C≡C.", note: "Not the same as alkyne C≡C", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Acetonitrile-2D-flat.png", imageAlt: "Acetonitrile structure" },
      { term: "Aromatic", value: "Benzene ring (conjugated π). IR: C–H ~3000–3100; C=C ~1450–1600. ¹H NMR: aromatic H ~6.5–8.5 ppm.", valueNoSpectroscopy: "Benzene ring (conjugated π). Planar, 4n+2 π electrons.", note: "Planar, 4n+2 π electrons", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/90/Benzene-2D-flat.png", imageAlt: "Benzene structure" },
    ],
  };

  // Add topic-specific valuable memorization items (supplementary to must-know)
  const topicSpecificItems: Record<string, MemorizationItem[]> = {
    "alkanes": [
      functionalGroupsOrgo1,
      {
        category: "Naming Prefixes",
        categoryImageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Butane-2D-flat.png",
        categoryImageAlt: "Alkane carbon chain (butane)",
        items: [
          { term: "Meth-", value: "1 carbon" },
          { term: "Eth-", value: "2 carbons" },
          { term: "Prop-", value: "3 carbons" },
          { term: "But-", value: "4 carbons" },
          { term: "Pent-", value: "5 carbons" },
          { term: "Hex-", value: "6 carbons" },
          { term: "Hept-", value: "7 carbons" },
          { term: "Oct-", value: "8 carbons" },
        ],
      },
    ],
    "cycloalkanes": [
      functionalGroupsOrgo1,
      {
        category: "Ring Strain",
        items: [
          { term: "Cyclopropane", value: "~27 kcal/mol", note: "High angle strain" },
          { term: "Cyclobutane", value: "~26 kcal/mol", note: "Moderate strain" },
          { term: "Cyclopentane", value: "~6 kcal/mol", note: "Low strain" },
          { term: "Cyclohexane", value: "~0 kcal/mol", note: "Strain-free chair" },
        ],
      },
    ],
    "stereochemistry": [
      functionalGroupsOrgo1,
      {
        category: "CIP Priority Rules",
        items: [
          { term: "Higher atomic number", value: "Higher priority" },
          { term: "If same atom", value: "Compare next atoms" },
          { term: "Double bond", value: "Count as two single bonds" },
          { term: "Triple bond", value: "Count as three single bonds" },
        ],
      },
    ],
    "substitution-elimination": [
      functionalGroupsOrgo1,
      {
        category: "pKa Values (Important)",
        items: [
          { term: "H2SO4", value: "pKa ≈ -3", note: "Very strong acid" },
          { term: "H3O+", value: "pKa = -1.7" },
          { term: "HF", value: "pKa = 3.2" },
          { term: "Carboxylic acids", value: "pKa ≈ 4-5" },
          { term: "H2CO3", value: "pKa = 6.4" },
          { term: "Phenol", value: "pKa = 10" },
          { term: "H2O", value: "pKa = 15.7" },
          { term: "ROH (alcohols)", value: "pKa ≈ 15-18" },
          { term: "RC≡CH (terminal alkyne)", value: "pKa ≈ 25" },
          { term: "NH3", value: "pKa = 38" },
          { term: "Alkanes", value: "pKa ≈ 50", note: "Very weak acids" },
        ],
      },
      {
        category: "Leaving Group Ability",
        items: [
          { term: "Best leaving groups", value: "I⁻, Br⁻, Cl⁻, H2O, TsO⁻" },
          { term: "Poor leaving groups", value: "F⁻, OH⁻, OR⁻, NH2⁻" },
          { term: "Rule", value: "Weaker base = better leaving group" },
        ],
      },
      {
        category: "Nucleophile Strength",
        items: [
          { term: "Strong nucleophiles", value: "I⁻, Br⁻, CN⁻, OH⁻, RO⁻, NH2⁻" },
          { term: "Weak nucleophiles", value: "H2O, ROH, RCOO⁻" },
          { term: "Polar aprotic", value: "Increases nucleophilicity" },
        ],
      },
    ],
    "alkenes": [
      functionalGroupsOrgo1,
      {
        category: "Markovnikov's Rule",
        items: [
          { term: "H adds to", value: "Less substituted carbon" },
          { term: "X adds to", value: "More substituted carbon" },
          { term: "Anti-Markovnikov", value: "Hydroboration-oxidation" },
        ],
      },
      {
        category: "Reaction Outcomes",
        items: [
          { term: "HX addition", value: "Markovnikov, racemic" },
          { term: "X2 addition", value: "Anti addition" },
          { term: "Halohydrin", value: "Markovnikov, anti addition" },
          { term: "Oxymercuration", value: "Markovnikov, no rearrangement" },
          { term: "Hydroboration", value: "Anti-Markovnikov, syn addition" },
        ],
      },
    ],
    "spectroscopy": [
      functionalGroupsOrgo1,
      {
        category: "IR Key Regions (cm⁻¹)",
        items: [
          { term: "O-H (broad)", value: "3200-3600" },
          { term: "N-H", value: "3300-3500" },
          { term: "C-H (sp³)", value: "2850-3000" },
          { term: "C≡N", value: "2200-2250" },
          { term: "C=O", value: "1650-1750" },
          { term: "C=C", value: "1600-1680" },
          { term: "C-O", value: "1000-1300" },
        ],
      },
      {
        category: "1H NMR Chemical Shifts (δ)",
        items: [
          { term: "R-CH3", value: "~0.9 ppm" },
          { term: "R-CH2-R", value: "~1.2 ppm" },
          { term: "Allylic", value: "~2-3 ppm" },
          { term: "R-OH", value: "~2-5 ppm" },
          { term: "R-CH2-X", value: "~3-4 ppm" },
          { term: "Vinyl", value: "~4.5-6.5 ppm" },
          { term: "Aromatic", value: "~6.5-8.5 ppm" },
          { term: "Aldehyde", value: "~9-10 ppm" },
          { term: "Carboxylic acid", value: "~10-12 ppm" },
        ],
      },
      {
        category: "13C NMR Shifts (δ)",
        items: [
          { term: "Alkyl C", value: "0-50 ppm" },
          { term: "C-O (alcohol/ether)", value: "50-90 ppm" },
          { term: "Alkene C", value: "100-150 ppm" },
          { term: "Aromatic C", value: "110-160 ppm" },
          { term: "C=O", value: "160-220 ppm" },
        ],
      },
    ],
    "alcohols": [
      functionalGroupsOrgo1,
      {
        category: "Oxidation Reagents",
        items: [
          { term: "PCC", value: "Primary → Aldehyde, Secondary → Ketone" },
          { term: "CrO3 / H2SO4", value: "Primary → Acid, Secondary → Ketone" },
          { term: "DMP", value: "Primary → Aldehyde, Secondary → Ketone" },
          { term: "Swern", value: "Primary → Aldehyde, Secondary → Ketone" },
        ],
      },
    ],
    "carbonyls-addition": [
      functionalGroupsOrgo1,
      {
        category: "Reactivity Order",
        items: [
          { term: "Most reactive", value: "Aldehydes" },
          { term: "Less reactive", value: "Ketones" },
          { term: "Reason", value: "Steric hindrance in ketones" },
        ],
      },
      {
        category: "Common Nucleophiles",
        items: [
          { term: "Hydride (NaBH4, LiAlH4)", value: "Reduction to alcohol" },
          { term: "Grignard (RMgX)", value: "Addition to alcohol" },
          { term: "Cyanide (CN⁻)", value: "Cyanohydrin formation" },
          { term: "Water (H2O)", value: "Hydrate (reversible)" },
        ],
      },
    ],
    "carboxylic-acids-derivatives": [
      functionalGroupsOrgo1,
      {
        category: "Reactivity Ladder",
        items: [
          { term: "Most reactive", value: "Acyl chloride" },
          { term: "↓", value: "Anhydride" },
          { term: "↓", value: "Ester" },
          { term: "↓", value: "Carboxylic acid" },
          { term: "Least reactive", value: "Amide" },
        ],
      },
    ],
    "enolates-aldol-claisen": [
      functionalGroupsOrgo1,
      {
        category: "pKa Values (Alpha H)",
        items: [
          { term: "Aldehyde α-H", value: "pKa ≈ 17" },
          { term: "Ketone α-H", value: "pKa ≈ 20" },
          { term: "Ester α-H", value: "pKa ≈ 25" },
          { term: "β-Dicarbonyl", value: "pKa ≈ 9-13", note: "Much more acidic" },
        ],
      },
    ],
    "aromatic-chemistry": [
      functionalGroupsOrgo1,
      {
        category: "Directing Effects",
        items: [
          { term: "Ortho/para directors", value: "NH2, OH, OR, R, Halogens" },
          { term: "Meta directors", value: "NO2, CN, COOH, SO3H, CHO, COR" },
          { term: "Strong activators", value: "NH2, OH, OR" },
          { term: "Weak activators", value: "R, Halogens" },
          { term: "Deactivators", value: "All meta directors" },
        ],
      },
    ],
    "amines": [
      functionalGroupsOrgo1,
      {
        category: "Basicity Trends",
        items: [
          { term: "Ammonia", value: "pKa (conjugate acid) = 9.2" },
          { term: "Primary amine", value: "pKa ≈ 10-11" },
          { term: "Secondary amine", value: "pKa ≈ 11" },
          { term: "Tertiary amine", value: "pKa ≈ 10" },
          { term: "Aniline", value: "pKa ≈ 4.6", note: "Resonance decreases basicity" },
          { term: "Amide", value: "pKa ≈ 0", note: "Very weak base" },
        ],
      },
    ],
  };

  // Add topic-specific items if they exist
  if (topicSpecificItems[slug]) {
    items.push(...topicSpecificItems[slug]);
  }

  // Before spectroscopy topic: show functional groups without IR/NMR so students aren’t overwhelmed
  const useSimpleValues = SLUGS_BEFORE_SPECTROSCOPY.includes(slug);
  return items.map((cat) => ({
    ...cat,
    items: cat.items.map((entry) => {
      const e = entry as MemorizationItemEntry;
      const value = useSimpleValues && e.valueNoSpectroscopy ? e.valueNoSpectroscopy : e.value;
      return { ...e, value };
    }),
  }));
}
