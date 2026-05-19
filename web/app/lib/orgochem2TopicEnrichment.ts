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
      mcq("Acetic acid (pKa 4.8) is mixed with water (pKa 15.7). Which side is favored at equilibrium?", ["Products (acetate + H3O+)", "Reactants (acetic acid + H2O)", "Equal mixture", "No reaction"] as [string, string, string, string], 0, "Lower pKa acid (acetic acid) is stronger; equilibrium favors the weaker acid side (higher pKa): water/conjugate base."),
      mcq("In resonance, which of the following is NEVER allowed to move?", ["A pi bond", "A lone pair", "A sigma bond", "A formal charge"] as [string, string, string, string], 2, "Only pi bonds and lone pairs move; sigma framework and atom positions stay fixed."),
      mcq("Adding a strong electron-withdrawing group (EWG) to benzoic acid will:", ["Decrease acidity by destabilizing the anion", "Increase acidity by stabilizing the carboxylate anion", "Have no effect on acidity", "Convert the acid to a base"] as [string, string, string, string], 1, "EWGs pull electron density away, stabilizing RCOO\u207b and lowering pKa (stronger acid)."),
      mcq("Can NaOH (conjugate acid H2O, pKa 15.7) deprotonate a terminal alkyne (pKa ~25)?", ["Yes \u2014 OH\u207b is always strong enough", "No \u2014 the alkyne is a much weaker acid than water", "Yes \u2014 but only with heat", "Only if the alkyne is internal"] as [string, string, string, string], 1, "Equilibrium favors deprotonation only when the new acid is weaker (higher pKa). Water cannot pull H from terminal alkyne."),
      mcq("Rank these from MOST acidic to LEAST acidic:", ["Ethanol < phenol < acetic acid", "Acetic acid < phenol < ethanol", "Phenol < ethanol < acetic acid", "Ethanol < acetic acid < phenol"] as [string, string, string, string], 1, "Typical pKa: RCOOH ~5, PhOH ~10, ROH ~16. Lower pKa = stronger acid."),
      mcq("In the reaction HCl + NH3 \u2192 NH4+ + Cl\u207b, the conjugate acid of NH3 is:", ["Cl\u207b", "HCl", "NH4+", "NH3"] as [string, string, string, string], 2, "NH3 accepts H+ to become NH4+; NH4+ is the conjugate acid of base NH3."),
      mcq("Which resonance contributor is most important for the acetate anion?", ["Structure with negative charge on carbon", "Structure with both oxygens bearing partial negative charge", "Structure with positive charge on oxygen", "Non-bonded carbon radical"] as [string, string, string, string], 1, "Negative charge on electronegative oxygens is best; both C=O and C\u2013O\u207b forms are major contributors."),
      mcq("An EDG (electron-donating group) on benzoic acid will:", ["Increase acidity", "Decrease acidity by destabilizing the anion", "Increase acidity by stabilizing the anion", "Stop resonance"] as [string, string, string, string], 1, "EDGs donate into the ring/anions, destabilizing RCOO\u207b \u2192 weaker acid (higher pKa)."),
      mcq("For HA + B: \u21cc A: + HB+, equilibrium lies right when:", ["pKa(HA) > pKa(HB+)", "pKa(HA) < pKa(HB+)", "pKa values are equal", "B: is a weaker base than A:"] as [string, string, string, string], 1, "Equilibrium favors the weaker acid (higher pKa product side). Right if HA is stronger (lower pKa) than HB+."),
      mcq("Which pair is a conjugate acid\u2013base pair?", ["H2O and OH\u207b", "HCl and NaOH", "CH4 and CH3\u207b", "Benzene and toluene"] as [string, string, string, string], 0, "Conjugate pairs differ by one H+: H2O/OH\u207b. HCl/NaOH are reactants, not a conjugate pair."),
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
      mcq("A 1\u00b0 alkyl bromide in acetone with NaI (polar aprotic) undergoes:", ["SN1", "SN2", "E1", "E2"] as [string, string, string, string], 1, "1\u00b0 + strong nucleophile + polar aprotic solvent \u2192 SN2 (backside attack, inversion)."),
      mcq("tert-Butyl bromide in ethanol (weak nucleophile, protic) favors:", ["SN2", "SN1 and/or E1", "Only E2", "No reaction"] as [string, string, string, string], 1, "3\u00b0 substrate + weak Nu, protic solvent \u2192 carbocation pathway (SN1/E1)."),
      mcq("TsCl/pyridine on an alcohol gives \u2013OTs. The C\u2013O bond at carbon:", ["Breaks with inversion", "Breaks with retention", "Is retained (no cleavage at C)", "Is oxidized"] as [string, string, string, string], 2, "Tosylation replaces H on O; C\u2013O bond to carbon stays intact \u2192 configuration retained."),
      mcq("Carboxylic acid O\u2013H in \u00b9H NMR appears at approximately:", ["2\u20133 ppm", "7 ppm", "10\u201313 ppm (broad)", "0 ppm"] as [string, string, string, string], 2, "Acid O\u2013H is very deshielded and broad due to H-bonding (10\u201313 ppm)."),
      mcq("IR: a strong broad band 2500\u20133500 cm\u207b\u00b9 plus C=O ~1710 cm\u207b\u00b9 suggests:", ["Ester", "Carboxylic acid", "Alkene", "Ether"] as [string, string, string, string], 1, "Broad O\u2013H (acid dimer) + C=O ~1710 is classic carboxylic acid."),
      mcq("SN2 stereochemistry at a chiral center:", ["Racemization", "Retention", "Inversion", "Syn addition"] as [string, string, string, string], 2, "Backside attack inverts configuration (Walden inversion)."),
      mcq("E2 requires:", ["Carbocation intermediate", "Anti-periplanar H and leaving group", "Weak base only", "Protic solvent only"] as [string, string, string, string], 1, "Concerted elimination: H and LG anti-coplanar."),
      mcq("Benzylic bromide + NaCN in DMSO \u2014 dominant pathway?", ["E2 only", "SN2 at benzylic carbon", "SN1 with rearrangement", "No reaction"] as [string, string, string, string], 1, "Benzylic/allylic positions undergo SN2 readily; CN\u207b is strong Nu."),
      mcq("A triplet at ~1.1 ppm (3H) and quartet at ~3.4 ppm (2H) suggest:", ["Isopropyl group", "Ethyl group", "tert-Butyl", "Phenyl"] as [string, string, string, string], 1, "Ethyl: CH3 triplet (3H) coupled to CH2 quartet (2H) \u2014 n+1 rule."),
      mcq("Why use tosylate before SN2 with a basic nucleophile (e.g. RO\u207b)?", ["TsO\u207b is a better leaving group than OH\u207b", "OH\u207b would protonate the nucleophile", "TsCl oxidizes the alcohol", "Ts groups block all reaction"] as [string, string, string, string], 0, "\u2013OTs is an excellent LG; allows SN2/E2 under basic conditions that fail with \u2013OH."),
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
      mcq("Terminal alkyne RC\u2261CH + HgSO4/H2SO4/H2O gives (after tautomerization):", ["Aldehyde", "Methyl ketone", "Primary alcohol", "Alkane"] as [string, string, string, string], 1, "Markovnikov hydration \u2192 enol \u2192 keto tautomer \u2192 methyl ketone."),
      mcq("Internal alkyne + Sia2BH then H2O2/NaOH gives:", ["Ketone", "cis diol", "Aldehyde (anti-Markovnikov)", "Trans alkene"] as [string, string, string, string], 2, "Hydroboration\u2013oxidation on alkyne gives aldehyde (terminal) or ketone patterns; anti-Markovnikov vs acid-catalyzed Hg\u00b2\u207a."),
      mcq("Lindlar catalyst (H2, poisoned Pd) on an alkyne gives:", ["Trans alkene", "cis alkene", "Alkane", "Diol"] as [string, string, string, string], 1, "Lindlar stops at cis alkene; Na/NH3 gives trans."),
      mcq("Terminal alkyne + NaNH2, then CH3CH2Br gives:", ["E2 alkene", "Internal alkyne from SN2", "Alkane", "Vinyl bromide"] as [string, string, string, string], 1, "NaNH2 \u2192 acetylide; SN2 on 1\u00b0 halide extends the chain."),
      mcq("Two equivalents of Br2 to an alkyne give:", ["Vinyl bromide", "Tetrahalide (geminal/tetrabromo)", "Bromohydrin", "No reaction"] as [string, string, string, string], 1, "Each \u03c0 bond can add X2; 2 equiv \u2192 tetrahalogenated product."),
      mcq("KMnO4 (hot) cleavage of RC\u2261CR (internal alkyne) gives:", ["Two aldehydes", "Two carboxylic acids", "CO2 only", "Ketone + acid"] as [string, string, string, string], 1, "Internal alkyne oxidative cleavage \u2192 two carboxylic acids."),
      mcq("H2/Pt on an alkyne (excess) gives:", ["cis alkene", "trans alkene", "Fully hydrogenated alkane", "Enol"] as [string, string, string, string], 2, "Unpoisoned Pd/C reduces all the way to alkane."),
      mcq("Why can't acetylide anions do SN2 on tert-butyl bromide?", ["Too weak nucleophile", "Steric hindrance prevents SN2 at 3\u00b0", "Br\u207b is too basic", "Alkynes are acids only"] as [string, string, string, string], 1, "Acetylide is strong Nu but 3\u00b0 halides eliminate (E2) instead of SN2."),
      mcq("HX (1 equiv) adds to 1-butyne to give major:", ["1-bromo-1-butene", "2-bromo-1-butene (Markovnikov)", "1,2-dibromobutane", "Butane"] as [string, string, string, string], 1, "First addition is Markovnikov: H to less substituted C, X to more substituted vinylic C."),
      mcq("Terminal alkyne oxidative cleavage (O3 or hot KMnO4) also produces:", ["Ethene", "CO2 (from terminal carbon)", "Methanol", "Ester"] as [string, string, string, string], 1, "Terminal C\u2261CH \u2192 RCOOH + CO2."),
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
      mcq("Grignard reagents are typically prepared in:", ["Water", "Dry ether or THF", "Concentrated HCl", "Liquid NH3 only"] as [string, string, string, string], 1, "RMgX requires anhydrous ether/THF; water destroys the reagent."),
      mcq("PhMgBr + benzaldehyde, then H3O+ workup gives:", ["Benzoic acid", "Diphenylmethanol (Ph-CH(OH)-Ph)", "Benzophenone", "Toluene"] as [string, string, string, string], 1, "Nucleophilic addition to aldehyde \u2192 secondary alcohol after protonation."),
      mcq("Which substrate will DESTROY a Grignard reagent before it reaches the carbonyl?", ["Dry acetone", "Ester", "Terminal alkyne (acidic H)", "CO2"] as [string, string, string, string], 2, "Acidic C\u2013H (terminal alkyne, alcohols, amines) protonates RMgX."),
      mcq("RMgBr + CO2, then H3O+ gives:", ["Aldehyde", "Carboxylic acid (homologation)", "Ketone", "Ester"] as [string, string, string, string], 1, "CO2 acts as electrophile \u2192 carboxylate \u2192 acid after workup."),
      mcq("Gilman reagents (R2CuLi) differ from Grignard because they often:", ["Add once to \u03b1,\u03b2-unsaturated carbonyls (1,4)", "Only reduce esters", "Require water", "Form radicals exclusively"] as [string, string, string, string], 0, "Organocuprates give conjugate (Michael-type) addition selectively vs simple 1,2 with many enones."),
      mcq("Grignard + ester (2 equiv RMgX) after workup gives:", ["Tertiary alcohol", "Secondary alcohol", "Aldehyde", "Carboxylic acid"] as [string, string, string, string], 0, "Ester + 2 equiv Grignard \u2192 tertiary alcohol (two R groups from RMgX)."),
      mcq("Why must the reaction flask be flame-dried for Grignard formation?", ["Mg is too reactive with O2 only", "Water quenches RMgX and can ignite", "Ether boils without drying", "CO2 is toxic"] as [string, string, string, string], 1, "Moisture protonates/carboxylates the organometallic; rigorously dry conditions required."),
      mcq("Grignard + formaldehyde (H2CO) gives after H3O+:", ["Primary alcohol", "Secondary alcohol", "Tertiary alcohol", "Aldehyde"] as [string, string, string, string], 0, "Formaldehyde \u2192 1\u00b0 alcohol; one R from Grignard."),
      mcq("Which carbonyl is MOST reactive toward Grignard addition?", ["Acetone", "Acetaldehyde", "Amide", "Carboxylate"] as [string, string, string, string], 1, "Aldehydes are less hindered and more electrophilic than ketones; amides/carboxylates are poor."),
      mcq("A student has a molecule with \u2013OH and \u2013CHO. Grignard will:", ["Select only the alcohol", "Attack the carbonyl; \u2013OH must be protected first if incompatible", "Reduce the alcohol", "Do nothing"] as [string, string, string, string], 1, "Grignard adds to C=O; acidic/alcoholic \u2013OH also destroys RMgX \u2014 protect or use alternative."),
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
      mcq("Radical halogenation of methane with Cl2/light proceeds via:", ["SN2", "Carbocation", "Radical chain (initiation, propagation)", "E2"] as [string, string, string, string], 2, "Light/heat generates Cl\u00b7; radical chain mechanism."),
      mcq("NBS + h\u03bd with cyclohexene gives allylic bromination because:", ["NBS is an electrophile only", "Low [Br2] favors allylic radical substitution", "It is SN2 at the double bond", "Benzene is formed"] as [string, string, string, string], 1, "NBS maintains low Br2 concentration \u2192 selective allylic/benzylic radical bromination."),
      mcq("Radical stability order (most \u2192 least):", ["1\u00b0 > 2\u00b0 > 3\u00b0", "3\u00b0 > 2\u00b0 > 1\u00b0 > methyl", "Methyl > 1\u00b0", "All equal"] as [string, string, string, string], 1, "Radicals stabilize with substitution: 3\u00b0 > 2\u00b0 > 1\u00b0; allylic/benzylic especially stable."),
      mcq("PBr3 converts an alcohol to:", ["Alkyl chloride with inversion", "Alkyl bromide (C\u2013O retained until substitution)", "Alkene", "Ether"] as [string, string, string, string], 1, "PBr3 \u2192 alkyl bromide; useful for 1\u00b0/2\u00b0 alcohols."),
      mcq("SOCl2/pyridine on a 2\u00b0 alcohol gives:", ["Alkyl chloride with inversion", "Tosylate", "Ketone", "Ester"] as [string, string, string, string], 0, "SOCl2 converts ROH \u2192 RCl with inversion (SN2-like at carbon)."),
      mcq("Anti-Markovnikov addition of HBr to an alkene uses:", ["HBr only", "HBr + peroxides (radical)", "Br2/H2O", "HgSO4"] as [string, string, string, string], 1, "Peroxides switch to radical addition \u2192 Br\u00b7 adds to less substituted C."),
      mcq("Which C\u2013H is most likely abstracted in radical bromination of butane?", ["Terminal methyl (1\u00b0)", "Internal methylene (2\u00b0)", "Both equally", "None \u2014 only alkenes react"] as [string, string, string, string], 1, "2\u00b0 C\u2013H is weaker; bromination selectivity favors 2\u00b0 > 1\u00b0 (3\u00b0 best when present)."),
      mcq("Radical chain termination step is:", ["X\u00b7 + RH \u2192 HX + R\u00b7", "R\u00b7 + X\u00b7 \u2192 R\u2013X", "R\u00b7 + R\u00b7 \u2192 R\u2013R", "Both B and C"] as [string, string, string, string], 3, "Termination: radical\u2013radical coupling (R\u2013R, R\u2013X, X\u2013X)."),
      mcq("Why is fluorination of alkanes not used synthetically?", ["F2 too unreactive", "F\u00b7 is too reactive and unselective", "No radicals form", "HF is the only product"] as [string, string, string, string], 1, "F\u00b7 is extremely reactive; reactions are violent and unselective."),
      mcq("Allylic bromination product of propene with NBS is:", ["1-bromopropane", "3-bromo-1-propene (allylic)", "2-bromopropane", "Propene dibromide"] as [string, string, string, string], 1, "Allylic position (CH2 next to C=C) is brominated."),
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
      mcq("A conjugated diene is more stable than two isolated double bonds because:", ["Sigma bonds strengthen", "Pi electrons are delocalized", "It is antiaromatic", "Steric strain is higher"] as [string, string, string, string], 1, "Conjugation delocalizes \u03c0 electrons \u2192 resonance stabilization."),
      mcq("At low temperature, 1,3-butadiene + HBr gives mostly:", ["1,4-addition (thermodynamic)", "1,2-addition (kinetic)", "No reaction", "Diels\u2013Alder product"] as [string, string, string, string], 1, "Kinetic control at low T \u2192 1,2 (faster); high T favors 1,4 (more stable conjugated product)."),
      mcq("Diels\u2013Alder requires the diene in:", ["s-trans only", "s-cis conformation", "Non-planar boat", "Radical conditions"] as [string, string, string, string], 1, "Diene must be s-cis for [4+2] cycloaddition."),
      mcq("A good dienophile for Diels\u2013Alder typically has:", ["Electron-donating groups only", "Electron-withdrawing groups (activated alkene)", "No pi bonds", "Only alkyl groups"] as [string, string, string, string], 1, "EWG lowers LUMO of dienophile \u2192 faster cycloaddition."),
      mcq("Diels\u2013Alder stereochemistry with respect to the dienophile:", ["Racemizes the dienophile", "Suprafacial \u2014 cis substituents stay cis in product", "Inverts all stereocenters", "Random"] as [string, string, string, string], 1, "Concerted suprafacial [4+2] preserves dienophile cis/trans geometry in the ring."),
      mcq("The Diels\u2013Alder reaction is:", ["Stepwise ionic", "Concerted pericyclic", "Radical only", "SN2"] as [string, string, string, string], 1, "One-step concerted mechanism; no intermediates."),
      mcq("1,3-butadiene + maleic anhydride (heat) gives:", ["Open-chain diol", "Cyclohexene derivative (adduct)", "Two alkenes", "Polymer only"] as [string, string, string, string], 1, "Classic Diels\u2013Alder \u2192 substituted cyclohexene (here with anhydride bridge)."),
      mcq("Why is 1,4-addition often favored at high temperature?", ["It is faster", "The conjugated 1,4 product is thermodynamically more stable", "1,2 is impossible", "Entropy only"] as [string, string, string, string], 1, "Thermodynamic control: more substituted/conjugated alkene is more stable."),
      mcq("Which diene cannot undergo Diels\u2013Alder easily?", ["Cyclopentadiene", "s-trans locked diene in a ring", "Isoprene (s-cis accessible)", "1,3-butadiene"] as [string, string, string, string], 1, "If s-cis is inaccessible (locked trans), [4+2] is slow or forbidden."),
      mcq("Electron-rich diene + electron-poor dienophile is favored because:", ["HOMO\u2013LUMO interaction is symmetry-allowed and energy-matched", "It is antiaromatic", "Only radicals react", "EDG blocks all reactivity"] as [string, string, string, string], 0, "Normal electron demand Diels\u2013Alder: diene HOMO + dienophile LUMO."),
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
      mcq("NAS on chlorobenzene without EWGs is:", ["Very fast", "Essentially impossible under normal conditions", "Faster than EAS", "Radical only"] as [string, string, string, string], 1, "Simple aryl halides need strong EWGs ortho/para to halide for NAS."),
      mcq("The NAS intermediate is called:", ["Carbocation", "Meisenheimer complex (anionic \u03c3 complex)", "Benzyne only", "Nitrene"] as [string, string, string, string], 1, "Nu attacks ipso \u2192 tetrahedral Meisenheimer; LG leaves."),
      mcq("p-Nitrochlorobenzene + NaOH gives substitution because:", ["NO2 activates by resonance for NAS", "Chlorine is an EDG", "It is SN2 on sp3 carbon", "Only heat matters"] as [string, string, string, string], 0, "EWG ortho/para to Cl stabilizes Meisenheimer; enables NAS."),
      mcq("Toluene side chain (benzylic CH3) + hot KMnO4 gives:", ["Benzyl alcohol", "Benzoic acid", "Toluene unchanged", "Benzaldehyde only"] as [string, string, string, string], 1, "Benzylic oxidation with KMnO4 \u2192 aromatic carboxylic acid (any alkyl side chain \u2192 COOH)."),
      mcq("Benzylic bromination of toluene uses:", ["Br2/FeBr3 (EAS)", "NBS, h\u03bd (radical)", "NaOH", "SN2 with NaBr"] as [string, string, string, string], 1, "Radical allylic/benzylic: NBS + light."),
      mcq("NAS differs from EAS because:", ["Electrophile attacks in NAS", "Nucleophile replaces leaving group on electron-poor ring", "It requires Lewis acid", "Aromaticity is never restored"] as [string, string, string, string], 1, "NAS: Nu replaces LG; ring must be activated by EWGs."),
      mcq("Which is NOT required for aryl halide NAS?", ["EWG ortho or para to halide", "Strong nucleophile", "Meisenheimer intermediate", "Lewis acid catalyst like FeCl3"] as [string, string, string, string], 3, "FeCl3 is for EAS electrophile generation, not standard NAS."),
      mcq("Chlorobenzene + NaNH2 (very strong base) can form benzyne. This is:", ["Standard NAS", "Elimination\u2013addition (benzyne mechanism)", "EAS", "SN1"] as [string, string, string, string], 1, "Without EWG, strong base can eliminate to benzyne then add Nu."),
      mcq("If both \u2013NH2 and \u2013NO2 are on the ring, which directs new NAS?", ["NH2 (ortho/para director)", "NO2 (meta, deactivating, but activates NAS when ortho/para to Cl)", "Neither", "Both equally for NAS"] as [string, string, string, string], 1, "For NAS, EWG like NO2 ortho/para to leaving group is key; NH2 is activating for EAS not NAS on halide."),
      mcq("Product of NAS: p-chloronitrobenzene + methoxide:", ["Anisole (\u2013OCH3 replaces Cl)", "Nitration product", "Reduction to aniline only", "No reaction"] as [string, string, string, string], 0, "Methoxide displaces Cl when NO2 activates ring \u2192 p-nitroanisole."),
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

