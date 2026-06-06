export type MechanismStepCard = {
  step: number;
  /** Short label shown in step tabs (optional). */
  title?: string;
  electronFlow: string;
  bonds: string;
  structure: string;
};

const DEFAULT: MechanismStepCard[] = [
  {
    step: 1,
    electronFlow: "Identify nucleophile (lone pair or π bond) and electrophile (δ+ center).",
    bonds: "Form one new bond to electrophile; stabilize charges with resonance if possible.",
    structure: "Nu: + E–LG → Nu–E (intermediate)",
  },
  {
    step: 2,
    electronFlow: "Collapse intermediate: lone pair assists loss of leaving group or proton transfer.",
    bonds: "Break LG–C or O–H; restore stable valence shells.",
    structure: "Intermediate → Product + LG or H+",
  },
];

const BY_SLUG: Record<string, MechanismStepCard[]> = {
  "substitution-elimination-nmr-review": [
    {
      step: 1,
      title: "SN₂ backside attack",
      electronFlow: "SN2: nucleophile attacks σ* of C–LG from backside; SN1: LG leaves to give carbocation.",
      bonds: "SN2: form Nu–C, break C–LG (concerted). SN1: break C–LG first.",
      structure: "SN2: (R)–LG + Nu⁻ → (S)–Nu + LG⁻",
    },
    {
      step: 2,
      title: "E₂ anti elimination",
      electronFlow: "E2: base abstracts β-H anti to LG; electrons form π bond as LG departs.",
      bonds: "Break C–H and C–LG; form C=C.",
      structure: "B: + H–C–C–LG → C=C + BH + LG⁻",
    },
    {
      step: 3,
      title: "¹H NMR interpretation",
      electronFlow: "¹H NMR: chemical shift tracks electron density; integration gives proton ratios; splitting follows n+1.",
      bonds: "Pair broad acid O–H (10–13 ppm) with IR C=O ~1710 cm⁻¹ and broad O–H 2500–3500 cm⁻¹.",
      structure: "Predict shifts first, then match peaks to fragments",
    },
  ],
  alkynes: [
    {
      step: 1,
      title: "Electrophilic addition",
      electronFlow: "π bond of alkyne attacks electrophilic H of HX (or Hg²⁺-activated H₂O).",
      bonds: "Form C–H; break H–X partially; build vinyl cation or mercurinium depending on pathway.",
      structure: "R–C≡C–R′ + H⁺ → vinyl cation / enol precursor",
    },
    {
      step: 2,
      title: "Enol → keto tautomerization",
      electronFlow: "Second addition or tautomerization: enol → keto via proton shuffle on oxygen.",
      bonds: "C–O π forms; relocate H to give ketone or aldehyde.",
      structure: "Enol –C=C–OH– → Keto –C(=O)–CH–",
    },
  ],
  "grignard-reaction": [
    {
      step: 1,
      title: "Nucleophilic addition",
      electronFlow: "Carbanionic carbon of RMgX attacks electrophilic carbonyl carbon.",
      bonds: "Form C–C; π C=O → alkoxide on oxygen.",
      structure: "R–MgX + R′₂C=O → R′₂C(OMgX)–R",
    },
    {
      step: 2,
      title: "Acid workup",
      electronFlow: "Acidic workup protonates alkoxide to neutral alcohol.",
      bonds: "Form O–H; break O–Mg bond.",
      structure: "R′₂C(OMgX)–R + H₃O⁺ → R′₂C(OH)–R",
    },
  ],
  "organohalides-radical": [
    {
      step: 1,
      title: "Initiation",
      electronFlow: "Initiation: homolytic cleavage of X–X or RO–OR to two radicals.",
      bonds: "Break X–X σ; each fragment keeps one electron.",
      structure: "X–X → 2 X·",
    },
    {
      step: 2,
      title: "Propagation",
      electronFlow: "Propagation: X· abstracts H from allylic/benzylic position; radical adds to π bond or couples.",
      bonds: "Break C–H; form C–X or new C–radical center.",
      structure: "X· + R–H → HX + R· → … → product",
    },
  ],
  "conjugated-compounds-diels-alder": [
    {
      step: 1,
      title: "Concerted [4+2] cycloaddition",
      electronFlow: "Concerted [4+2]: diene HOMO donates into dienophile LUMO (cycloaddition).",
      bonds: "Form two new C–C σ bonds; convert two π bonds of diene + one π of dienophile.",
      structure: "diene(s-cis) + =EWG → cyclohexene ring",
    },
  ],
  "electrophilic-aromatic-substitution": [
    {
      step: 1,
      title: "Form σ (arenium) complex",
      electronFlow: "Aromatic π attacks electrophile E⁺; loses aromaticity in σ complex.",
      bonds: "Form C–E; positive charge delocalized on ortho/para ring positions.",
      structure: "C₆H₆ + E⁺ → [C₆H₆E]⁺ (arenium)",
    },
    {
      step: 2,
      title: "Restore aromaticity",
      electronFlow: "Weak base removes adjacent proton; electrons restore aromatic sextet.",
      bonds: "Break C–H; regain aromatic π system.",
      structure: "[C₆H₆E]⁺ + B: → C₆H₅E + BH⁺",
    },
  ],
  "nucleophilic-aromatic-substitution": [
    {
      step: 1,
      title: "Meisenheimer complex",
      electronFlow: "Nucleophile attacks ipso carbon bearing LG; Meisenheimer complex (anionic σ adduct).",
      bonds: "Form Nu–C(aryl); sp² → sp³ at ipso; negative charge stabilized by ortho/para NO₂.",
      structure: "Ar–Cl + Nu⁻ → [Ar(Nu)Cl]⁻",
    },
    {
      step: 2,
      title: "Expel leaving group",
      electronFlow: "Collapse adduct: expel chloride; aromaticity returns if product is aromatic.",
      bonds: "Break C–Cl; reform aromatic π in product.",
      structure: "[Ar(Nu)Cl]⁻ → Ar–Nu + Cl⁻",
    },
  ],
  "resonance-acid-base-review": [
    {
      step: 1,
      title: "Move π / lone pairs only",
      electronFlow: "Curved arrow from lone pair or π bond to an adjacent atom; never move σ bonds.",
      bonds: "π bond breaks as lone pair forms; formal charges shift on adjacent atoms.",
      structure: "Structure A → Structure B (resonance contributor)",
    },
    {
      step: 2,
      title: "Acid–base equilibrium",
      electronFlow: "Base removes the more acidic proton; equilibrium favors the weaker acid (higher pKa).",
      bonds: "Form conjugate base; break O–H or N–H.",
      structure: "HA + B: ⇌ A⁻ + BH⁺",
    },
  ],
  "alcohols-phenols": [
    {
      step: 1,
      title: "Alcohol oxidation",
      electronFlow: "Oxidation: remove α-H equivalents from alcohol oxygen-bound carbon (Cr or Mn oxides).",
      bonds: "Form C=O; increase oxidation state of carbon.",
      structure: "R–CH₂OH → R–CHO → R–COOH (strong oxidant)",
    },
  ],
  "ethers-epoxides": [
    {
      step: 1,
      title: "Acid-catalyzed opening",
      electronFlow: "Acid: protonate epoxide O; nucleophile attacks more substituted C (more + charge).",
      bonds: "Open three-membered ring; anti addition across C–O.",
      structure: "epoxide–O⁺H + Nu: → HO–C–C–Nu",
    },
    {
      step: 2,
      title: "Base-catalyzed opening",
      electronFlow: "Base: Nu⁻ attacks less substituted C (SN2, least steric hindrance).",
      bonds: "Backside attack; open ring with inversion at that carbon.",
      structure: "epoxide + Nu⁻ → Nu–C–C–O⁻",
    },
  ],
  "aldehydes-ketones": [
    {
      step: 1,
      title: "Nucleophilic addition",
      electronFlow: "Nucleophile lone pair attacks carbonyl carbon (π* acceptor).",
      bonds: "Form Nu–C; π C=O → alkoxide.",
      structure: "R₂C=O + Nu: → R₂C(O⁻)–Nu",
    },
    {
      step: 2,
      title: "Protonation / dehydration",
      electronFlow: "Protonation of alkoxide completes addition (or dehydration to imine / enamine).",
      bonds: "Form O–H or eliminate H₂O depending on Nu type.",
      structure: "R₂C(O⁻)–Nu + H⁺ → R₂C(OH)–Nu",
    },
  ],
  "carboxylic-acids-derivatives": [
    {
      step: 1,
      title: "Addition to acyl carbon",
      electronFlow: "Nucleophile attacks acyl carbon; tetrahedral intermediate (sp³ at carbonyl C).",
      bonds: "Form Nu–C; C=O becomes single C–O⁻ in intermediate.",
      structure: "R–C(=O)–LG + Nu: → R–C(O⁻)(Nu)–LG",
    },
    {
      step: 2,
      title: "Eliminate leaving group",
      electronFlow: "Re-form carbonyl; expel leaving group (weaker base = better LG).",
      bonds: "Break C–LG; restore C=O π.",
      structure: "Tetrahedral → R–C(=O)–Nu + LG⁻",
    },
  ],
};

export function getMechanismStepCardsForSlug(slug: string): MechanismStepCard[] {
  return BY_SLUG[slug] ?? DEFAULT;
}
