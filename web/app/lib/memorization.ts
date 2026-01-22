// Memorization items for organic chemistry topics

export type MemorizationItem = {
  category: string;
  items: Array<{
    term: string;
    value: string;
    note?: string;
  }>;
};

export function getMemorizationItems(slug: string): MemorizationItem[] {
  const items: Record<string, MemorizationItem[]> = {
    "alkanes": [
      {
        category: "Naming Prefixes",
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

  return items[slug] || [];
}
