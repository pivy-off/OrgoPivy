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
      m("Resonance basics", "Only \u03c0 bonds and lone pairs move; atoms stay fixed.", "_S-Dxnv-VLs"),
      m("Drawing resonance structures", "Practice curved arrows without moving \u03c3 bonds.", "4G_jHoFMRpA"),
      m("pKa and acid strength", "Lower pKa = stronger acid; use tables to set equilibrium.", "MnWWJVRbdXg"),
      m("EWG/EDG effects on acidity", "Withdrawers stabilize anions; donors destabilize them.", "9N4AuX5oK-o"),
    ],
    practiceMcqs: [
      mcq("Which bonds are allowed to move in resonance structures?", ["Sigma bonds only", "Pi bonds and lone pairs only", "All bonds including sigma", "Only lone pairs, never pi bonds"] as [string, string, string, string], 1, "Resonance involves the delocalization of pi electrons and lone pairs only. Sigma bonds form the fixed framework of a molecule and never move in resonance structures. Atoms also stay in the same positions."),
      mcq("Using the pKa table, predict which reaction will proceed as written: CH3COOH + NaOH \u2192 CH3COO\u207bNa\u207a + H2O", ["No reaction \u2014 NaOH is too weak a base", "Proceeds \u2014 acetic acid (pKa ~5) is stronger acid than water (pKa 15.7), so products are favored", "Proceeds \u2014 but only at high temperature", "No reaction \u2014 carboxylic acids can't be deprotonated"] as [string, string, string, string], 1, "The reaction favors the side with the weaker acid. Acetic acid (pKa ~5) is a much stronger acid than water (pKa 15.7). The equilibrium strongly favors products."),
      mcq("Can NaOH deprotonate a terminal alkyne (pKa ~25)?", ["Yes \u2014 NaOH is a strong base", "No \u2014 water (pKa 15.7) is a weaker acid than the alkyne, so equilibrium favors reactants", "Yes \u2014 but only in ether solvent", "No \u2014 alkynes don't have acidic protons"] as [string, string, string, string], 1, "For deprotonation to proceed, the base's conjugate acid must be weaker (higher pKa) than the acid being deprotonated. NaOH's conjugate acid is water (pKa 15.7). The alkyne has pKa ~25."),
      mcq("An electron-withdrawing group (EWG) is placed adjacent to a carboxylic acid. What happens to its acidity?", ["Acidity decreases \u2014 EWGs donate electrons", "Acidity increases \u2014 EWGs stabilize the carboxylate anion", "Acidity is unchanged \u2014 groups don't affect acidity", "Acidity decreases \u2014 EWGs destabilize the anion"] as [string, string, string, string], 1, "EWGs pull electron density away from the carboxylate anion, stabilizing the negative charge. More stable anion = stronger acid = lower pKa."),
      mcq("Rank these in order of increasing acidity (least to most): ethane (pKa ~50), ethanol (pKa ~16), acetic acid (pKa ~5), phenol (pKa ~10)", ["Ethane < Ethanol < Phenol < Acetic acid", "Acetic acid < Phenol < Ethanol < Ethane", "Ethanol < Ethane < Acetic acid < Phenol", "Ethane < Phenol < Ethanol < Acetic acid"] as [string, string, string, string], 0, "Lower pKa = more acidic. Increasing acidity: ethane < ethanol < phenol < acetic acid."),
      mcq("A resonance structure shows a carbon with 3 bonds and a positive charge. How many nonbonding electrons does it have?", ["0 \u2014 using charge formula: 4 - 3 - 0 = +1", "2", "4", "6"] as [string, string, string, string], 0, "Charge = valence electrons - bonds - nonbonding electrons. For carbon: 4 - 3 - 0 = +1. A carbocation has 3 bonds, 0 nonbonding electrons, and a +1 charge."),
      mcq("Which species is the stronger base: CH3COO\u207b or OH\u207b?", ["CH3COO\u207b \u2014 carboxylates are always strong bases", "OH\u207b \u2014 hydroxide is the stronger base because its conjugate acid (water, pKa 15.7) has a higher pKa than acetic acid (pKa 5)", "Both are equally basic", "Neither is basic"] as [string, string, string, string], 1, "Stronger base = weaker conjugate acid = higher pKa. OH\u207b conjugate acid = H2O (pKa 15.7). CH3COO\u207b conjugate acid = CH3COOH (pKa 5)."),
      mcq("Two resonance structures of benzene are drawn. What is true about them?", ["They are different molecules in equilibrium", "They are the same molecule \u2014 resonance structures represent one hybrid structure", "One is more stable than the other", "They interconvert by rotating sigma bonds"] as [string, string, string, string], 1, "Resonance structures are not different molecules. They describe a single resonance hybrid."),
      mcq("What base is strong enough to deprotonate a terminal alkyne (pKa ~25)?", ["NaOH (conjugate acid pKa 15.7)", "Na2CO3 (conjugate acid pKa ~10)", "NaNH2 (conjugate acid NH3, pKa ~35)", "NaHCO3 (conjugate acid pKa ~6)"] as [string, string, string, string], 2, "To deprotonate an acid, the base's conjugate acid must have a higher pKa than the acid. NaNH2 (NH3, pKa ~35) can deprotonate terminal alkynes."),
      mcq("A molecule has the structure CH2=CH-CH=O (crotonaldehyde). How many resonance structures can be drawn, and what charge distribution do they show?", ["One structure \u2014 no resonance possible", "Two structures \u2014 the pi bond alternates between C=C and C=O", "Two meaningful resonance structures \u2014 one with C=C-C=O and one with \u207bC-C=C-O\u207a", "Three structures \u2014 requires a radical intermediate"] as [string, string, string, string], 2, "Crotonaldehyde is conjugated. The charge-separated form explains 1,2- vs 1,4-addition regiochemistry."),
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
      m("SN2 requirements", "1\u00b0 substrate, strong Nu, polar aprotic solvent.", "5EGnJiLtfPs"),
      m("SN1 requirements", "3\u00b0 substrate, weak Nu, protic solvent.", "5EGnJiLtfPs"),
      m("Tosylate strategy", "TsCl activates \u2013OH without breaking C\u2013O at carbon.", "Z-nVfpJ6gls"),
      m("NMR key shifts", "\u03b4, integration, and splitting for exam spectra.", "SBir5wUS3Bo"),
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
      m("Double addition of Br2", "One equiv \u2192 vinyl dibromide; two equiv \u2192 tetrahalide.", "K07VceUan0k"),
      m("Hydration (Markovnikov)", "Hg\u00b2\u207a/H\u2082SO\u2084/H\u2082O \u2192 enol \u2192 ketone.", "Yd9MFqJmyas"),
      m("Hydration (anti-Markovnikov)", "Hydroboration\u2013oxidation \u2192 aldehyde from terminal alkyne.", "Yd9MFqJmyas"),
      m("Reduction to alkenes", "Lindlar (cis) vs Na/NH\u2083 (trans).", "vJPKfTSJQaM"),
      m("Acetylide alkylation", "NaNH\u2082 then 1\u00b0 alkyl halide only.", "hS4WWJWQ3_Y"),
      m("Oxidative cleavage", "KMnO\u2084 cleavage patterns.", "K07VceUan0k"),
    ],
    practiceMcqs: [
      mcq("Propyne reacts with 1 equivalent of Br2. What is the major product?", ["1,1-dibromopropane", "1,2-dibromoprop-1-ene (vinyl dibromide)", "1,1,2,2-tetrabromopropane", "Propane"] as [string, string, string, string], 1, "One equivalent of Br2 adds across one pi bond to give a vinyl dibromide (anti addition)."),
      mcq("What is the product of treating propyne with HgSO4, H2SO4, and H2O?", ["Propan-1-ol", "Propanal (aldehyde)", "Propan-2-one (acetone, a ketone)", "Propene"] as [string, string, string, string], 2, "Markovnikov hydration gives an enol that tautomerizes to a ketone. Propyne \u2192 acetone."),
      mcq("You need to synthesize cis-2-pentene from 2-pentyne. Which reagent do you use?", ["H2/Pt", "Na, liquid NH3", "H2, Lindlar's catalyst (Pd/BaSO4, quinoline)", "NaBH4"] as [string, string, string, string], 2, "Lindlar's catalyst gives cis (Z) alkenes via syn addition."),
      mcq("Terminal alkynes have pKa ~25. What does this mean for their reactivity?", ["They are more acidic than water and can be deprotonated by NaOH", "They are less acidic than water; NaNH2 is needed to deprotonate them", "They cannot be deprotonated under any conditions", "They are more acidic than carboxylic acids"] as [string, string, string, string], 1, "NaOH cannot deprotonate terminal alkynes; use NaNH2."),
      mcq("Treating 1-butyne with Sia2BH then H2O2/NaOH gives what product?", ["Butan-2-one", "Butanal (an aldehyde, anti-Markovnikov)", "Butan-1-ol", "1,1-dibromobutane"] as [string, string, string, string], 1, "Hydroboration\u2013oxidation of a terminal alkyne gives the anti-Markovnikov aldehyde."),
      mcq("What are the products of oxidative cleavage of 3-hexyne with KMnO4?", ["Two equivalents of propanoic acid", "Two equivalents of propanal", "One propanoic acid + CO2", "Hexanedioic acid"] as [string, string, string, string], 0, "Internal alkyne cleavage gives two carboxylic acids."),
      mcq("An acetylide anion (RC\u2261C\u207b) reacts with 2-bromopropane. What problem arises?", ["No problem \u2014 acetylide does SN2 on any alkyl halide", "The reaction fails \u2014 acetylide cannot do SN2 on secondary alkyl halides; E2 elimination occurs instead", "The acetylide deprotonates the solvent", "2-bromopropane is too reactive"] as [string, string, string, string], 1, "Acetylide SN2 works only with primary alkyl halides."),
      mcq("What is keto-enol tautomerization and when does it occur?", ["Two molecules interconverting by forming/breaking a C-C bond", "Isomers differing in placement of one H and a double bond; enol converts to keto under acid or base catalysis", "A radical process requiring UV light", "Reversible rotation around a C=C double bond"] as [string, string, string, string], 1, "The enol is less stable than the keto form; tautomerization explains alkyne hydration products."),
      mcq("Terminal alkyne RC\u2261CH + HgSO4/H2SO4/H2O gives (after tautomerization):", ["Aldehyde", "Methyl ketone", "Primary alcohol", "Alkane"] as [string, string, string, string], 1, "Markovnikov hydration of terminal alkyne \u2192 methyl ketone."),
      mcq("Lindlar catalyst (H2, poisoned Pd) on an alkyne gives:", ["Trans alkene", "cis alkene", "Alkane", "Diol"] as [string, string, string, string], 1, "Lindlar stops at cis alkene."),
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
      m("Grignard formation", "Mg, dry ether; handle under anhydrous conditions.", "Y9jAMdA7C1c"),
      m("Addition to carbonyls", "RMgX + carbonyl \u2192 alcohol after H\u2083O\u207a.", "8wXaRfFsRPs"),
      m("Incompatible groups", "Protic acids and O\u2013H destroy the reagent.", "Y9jAMdA7C1c"),
      m("Gilman reagent", "R\u2082CuLi: selective 1,4 and ketone from acid chloride.", "6oOomzJzP6M"),
      m("Suzuki-Miyaura", "Pd-catalyzed C\u2013C coupling overview.", "6oOomzJzP6M"),
    ],
    practiceMcqs: [
      mcq("PhMgBr is added to acetone, then H3O+. What is the product?", ["Benzaldehyde", "2-phenyl-2-propanol (a tertiary alcohol)", "Isopropyl benzene", "Benzoic acid"] as [string, string, string, string], 1, "Grignard adds to the carbonyl \u2192 tertiary alcohol after protonation."),
      mcq("What happens when PhMgBr is added to a flask containing ethyl acetate with a trace of water?", ["Normal Grignard addition occurs to give a tertiary alcohol", "The Grignard reagent is immediately destroyed \u2014 it protonates with water before attacking the ester", "An ether forms", "Oxidation of the Grignard occurs"] as [string, string, string, string], 1, "Water destroys Grignard reagents before they reach the carbonyl."),
      mcq("RMgBr is added to an ester (RCOOR'), then H3O+. How many times does the Grignard add?", ["Once \u2014 gives a ketone", "Twice \u2014 gives a tertiary alcohol (same two R groups from Grignard)", "Three times \u2014 gives a primary alcohol", "Zero times \u2014 esters don't react with Grignard"] as [string, string, string, string], 1, "Esters undergo two Grignard additions \u2192 tertiary alcohol."),
      mcq("How would you synthesize 2-phenylethanol using a Grignard reaction?", ["PhMgBr + formaldehyde, then H3O+", "PhMgBr + acetaldehyde, then H3O+", "CH3MgBr + benzaldehyde, then H3O+", "PhMgBr + ethylene oxide, then H3O+"] as [string, string, string, string], 3, "PhMgBr + ethylene oxide \u2192 2-phenylethanol after H3O+."),
      mcq("A Gilman reagent (R2CuLi) reacts with an acid chloride. What is the product?", ["A tertiary alcohol (adds twice like Grignard)", "A ketone (adds once, stops)", "A primary alcohol", "An alkane"] as [string, string, string, string], 1, "Gilman reagents add once to acid chlorides \u2192 ketone."),
      mcq("Grignard reagents are typically prepared in:", ["Water", "Dry ether or THF", "Concentrated HCl", "Liquid NH3 only"] as [string, string, string, string], 1, "RMgX requires anhydrous ether/THF."),
      mcq("RMgBr + CO2, then H3O+ gives:", ["Aldehyde", "Carboxylic acid", "Ketone", "Ester"] as [string, string, string, string], 1, "CO2 + Grignard \u2192 carboxylic acid after workup."),
      mcq("Gilman reagents (R2CuLi) differ from Grignard because they often:", ["Add once to \u03b1,\u03b2-unsaturated carbonyls (1,4)", "Only reduce esters", "Require water", "Form radicals exclusively"] as [string, string, string, string], 0, "Organocuprates give conjugate addition selectively."),
      mcq("Grignard + formaldehyde (H2CO) gives after H3O+:", ["Primary alcohol", "Secondary alcohol", "Tertiary alcohol", "Aldehyde"] as [string, string, string, string], 0, "Formaldehyde \u2192 1\u00b0 alcohol."),
      mcq("Which substrate will DESTROY a Grignard reagent?", ["Dry acetone", "Ester", "Terminal alkyne (acidic H)", "CO2"] as [string, string, string, string], 2, "Protic/acidic sites protonate RMgX."),
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
      m("Alcohol to alkyl halide", "PBr\u2083, SOCl\u2082, and HX tradeoffs.", "3_kVUkXS2ds"),
      m("Radical mechanism", "Initiation \u2192 propagation \u2192 termination.", "rWoaT2NLQLA"),
      m("NBS allylic bromination", "Selective allylic/benzylic positions.", "vJPKfTSJQaM"),
      m("Radical stability", "Allylic/benzylic > 3\u00b0 > 2\u00b0 > 1\u00b0.", "rWoaT2NLQLA"),
    ],
    practiceMcqs: [
      mcq("Radical chlorination of butane with Cl2/h\u03bd gives multiple products. Which is the MAJOR product?", ["1-chlorobutane", "2-chlorobutane", "Equal amounts of both", "1,2-dichlorobutane"] as [string, string, string, string], 1, "2\u00b0 C\u2013H abstraction is favored \u2192 2-chlorobutane major."),
      mcq("NBS (N-bromosuccinimide) with h\u03bd reacts with 4-tert-butylmethylbenzene. Where does bromination occur?", ["On the benzene ring (EAS)", "At the methyl group (allylic/benzylic position)", "At the tert-butyl group", "No reaction"] as [string, string, string, string], 1, "NBS selectively brominates benzylic/allylic positions under radical conditions."),
      mcq("What product forms when SOCl2 reacts with (R)-2-butanol?", ["(S)-2-chlorobutane (inverted)", "(R)-2-chlorobutane (retained)", "Racemic 2-chlorobutane", "2-butene (elimination)"] as [string, string, string, string], 1, "SOCl2 gives retention of configuration."),
      mcq("Which is the correct sequence for radical chain halogenation?", ["Termination \u2192 Initiation \u2192 Propagation", "Initiation \u2192 Propagation \u2192 Termination", "Propagation \u2192 Initiation \u2192 Termination", "All three occur simultaneously"] as [string, string, string, string], 1, "Initiation \u2192 propagation \u2192 termination."),
      mcq("HBr adds to propene with ROOR (peroxide). What is the product and mechanism?", ["2-bromopropane, ionic Markovnikov", "1-bromopropane, radical anti-Markovnikov", "1-bromopropane, ionic anti-Markovnikov", "2-bromopropane, radical addition"] as [string, string, string, string], 1, "Peroxide initiates radical anti-Markovnikov HBr addition."),
      mcq("Radical halogenation of methane with Cl2/light proceeds via:", ["SN2", "Carbocation", "Radical chain (initiation, propagation)", "E2"] as [string, string, string, string], 2, "Radical chain mechanism."),
      mcq("Radical stability order (most \u2192 least):", ["1\u00b0 > 2\u00b0 > 3\u00b0", "3\u00b0 > 2\u00b0 > 1\u00b0 > methyl", "Methyl > 1\u00b0", "All equal"] as [string, string, string, string], 1, "3\u00b0 > 2\u00b0 > 1\u00b0; allylic/benzylic especially stable."),
      mcq("PBr3 converts an alcohol to:", ["Alkyl chloride", "Alkyl bromide", "Alkene", "Ether"] as [string, string, string, string], 1, "PBr3 \u2192 alkyl bromide."),
      mcq("Anti-Markovnikov addition of HBr to an alkene uses:", ["HBr only", "HBr + peroxides (radical)", "Br2/H2O", "HgSO4"] as [string, string, string, string], 1, "Peroxides switch to radical addition."),
      mcq("Allylic bromination product of propene with NBS is:", ["1-bromopropane", "3-bromo-1-propene (allylic)", "2-bromopropane", "Propene dibromide"] as [string, string, string, string], 1, "Allylic position is brominated."),
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
      m("Conjugated vs isolated", "\u03c0 overlap lowers energy vs isolated dienes.", "6QLnXPF16dA"),
      m("1,2 vs 1,4 addition", "Kinetic (low T) vs thermodynamic (high T) control.", "bVbNRKkbVSA"),
      m("Diels-Alder reaction", "s-cis diene + electron-deficient dienophile.", "Uy8A0SZZD_g"),
      m("Stereochemistry", "Suprafacial [4+2] preserves dienophile geometry.", "3N5mM5HI-es"),
    ],
    practiceMcqs: [
      mcq("1,3-butadiene reacts with HBr at \u221280\u00b0C. What is the major product?", ["3-bromobut-1-ene (1,4-addition product)", "3,4-dibromobutane", "3-bromobut-1-ene (1,2-addition product)", "No reaction at low temperature"] as [string, string, string, string], 2, "Low temperature \u2192 kinetic 1,2-addition product."),
      mcq("Which diene CANNOT undergo a Diels-Alder reaction and why?", ["1,3-butadiene \u2014 too simple", "(E)-1,3-pentadiene \u2014 wrong geometry", "2,3-di-tert-butyl-1,3-butadiene \u2014 locked s-trans", "Cyclopentadiene \u2014 too reactive"] as [string, string, string, string], 2, "Bulky groups lock the diene in s-trans."),
      mcq("Maleic anhydride (cis dienophile) reacts with 1,3-butadiene. What is the stereochemistry of the product?", ["Trans relationship between the anhydride oxygens", "Cis relationship \u2014 dienophile geometry is preserved", "Racemic mixture", "No stereochemistry"] as [string, string, string, string], 1, "Concerted [4+2] preserves cis/trans geometry."),
      mcq("Why does the 1,4-addition product of a conjugated diene + HBr dominate at high temperature?", ["The 1,4-product forms faster", "At high temperature the reaction is reversible; 1,4-product is more stable", "Heat changes the mechanism to radical", "High temperature destroys the 1,2-product"] as [string, string, string, string], 1, "Thermodynamic control favors the more stable 1,4-product."),
      mcq("What two conditions make an ideal Diels-Alder reaction fast and high-yielding?", ["EWG on diene + EDG on dienophile", "EDG on diene + EWG on dienophile, and diene in s-cis", "Both components must be cyclic", "High temperature always increases yield"] as [string, string, string, string], 1, "EDG diene + EWG dienophile + s-cis diene."),
      mcq("A conjugated diene is more stable than two isolated double bonds because:", ["Sigma bonds strengthen", "Pi electrons are delocalized", "It is antiaromatic", "Steric strain is higher"] as [string, string, string, string], 1, "Conjugation delocalizes \u03c0 electrons."),
      mcq("Diels\u2013Alder requires the diene in:", ["s-trans only", "s-cis conformation", "Non-planar boat", "Radical conditions"] as [string, string, string, string], 1, "Diene must be s-cis."),
      mcq("The Diels\u2013Alder reaction is:", ["Stepwise ionic", "Concerted pericyclic", "Radical only", "SN2"] as [string, string, string, string], 1, "One-step concerted mechanism."),
      mcq("1,3-butadiene + maleic anhydride (heat) gives:", ["Open-chain diol", "Cyclohexene derivative (adduct)", "Two alkenes", "Polymer only"] as [string, string, string, string], 1, "Classic Diels\u2013Alder cycloadduct."),
      mcq("Electron-rich diene + electron-poor dienophile is favored because:", ["HOMO\u2013LUMO interaction is symmetry-allowed and energy-matched", "It is antiaromatic", "Only radicals react", "EDG blocks all reactivity"] as [string, string, string, string], 0, "Normal electron-demand Diels\u2013Alder."),
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
      m("4 criteria for aromaticity", "Cyclic, planar, conjugated, 4n+2 \u03c0 e\u207b.", "MFABFiMEGqQ"),
      m("Aromatic vs antiaromatic", "H\u00fcckel rule and planarity.", "gRm-A7SdNT0"),
      m("Pyridine vs pyrrole basicity", "Where the lone pair lives relative to \u03c0.", "y4L97H_3lT4"),
      m("Heterocycles", "Electron counting in furan, thiophene, pyrrole.", "y4L97H_3lT4"),
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
      m("EAS two steps", "\u03c3 complex then deprotonation restores aromaticity.", "B8bQBLHkBiQ"),
      m("5 EAS reactions", "Halogenation, nitration, sulfonation, FC alkylation/acylation.", "K_5B0TBUOQA"),
      m("Directing effects", "Ortho/para vs meta from resonance.", "V0bdQFrUzgE"),
      m("Friedel-Crafts alkylation", "Carbocation chemistry; rearrangement risk.", "SxGWnfFMrq4"),
      m("Friedel-Crafts acylation", "Ketone product; no rearrangement.", "9G5nQi4kD0g"),
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
      m("NAS requirements", "EWG ortho/para to leaving group.", "DAbRxRV-3-4"),
      m("NAS vs EAS", "When the ring is electron-poor.", "DAbRxRV-3-4"),
      m("Benzyne mechanism", "Strong base on simple aryl halides.", "DAbRxRV-3-4"),
      m("Side-chain reactions", "Benzylic oxidation and halogenation.", "lBJc9ij5ZLU"),
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
      m("Reducing agents", "NaBH\u2084 vs LiAlH\u2084 scope.", "PJ4Kq3GXOOU"),
      m("Oxidation levels", "1\u00b0 \u2192 aldehyde \u2192 acid; 2\u00b0 \u2192 ketone.", "K07VceUan0k"),
      m("Tosylate strategy", "TsCl/pyridine; retention at stereocenter.", "Z-nVfpJ6gls"),
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
      m("Williamson synthesis", "Alkoxide + 1\u00b0 RX; avoid 3\u00b0 halide.", "ojVhITKMtSA"),
      m("Ether cleavage", "HBr/HI mechanisms.", "0fNuDJPIiPA"),
      m("Epoxide synthesis", "mCPBA syn epoxidation.", "8Ydm-HHJoF0"),
      m("Ring opening acid/base", "Acid: more substituted C; base: less substituted.", "0fNuDJPIiPA"),
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
    overviewVideoId: "ojVhITKMtSA",
  },
  "aldehydes-ketones": {
    mustKnowItems: [
      m("Cyanohydrin", "CN\u207b addition to carbonyl.", "pTLM_5RJCQ4"),
      m("Imine and enamine", "1\u00b0 vs 2\u00b0 amine outcomes; pH window.", "TZtkZRsXkc8"),
      m("Wolff-Kishner", "Hydrazone then strong base/heat.", "T4r7eBpwsQk"),
      m("Acetal formation", "Protection/deprotection equilibrium.", "nC5XJLN3WjE"),
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
      m("Reactivity order", "Acid chloride > anhydride > ester > amide.", "jSCQpMmDzrE"),
      m("Acyl substitution", "Tetrahedral intermediate; LG basicity.", "jSCQpMmDzrE"),
      m("Fischer esterification", "Equilibrium with water/alcohol.", "B28_pfN_4l8"),
      m("Acid chloride SOCl2", "\u2013COOH \u2192 \u2013COCl.", "cSmKPsJebbU"),
      m("Ester reactions", "Hydrolysis, transesterification, reduction.", "ZApKjLKKXvk"),
      m("Amide reactions", "Hydrolysis difficulty vs esters.", "R_L_mJTrLvQ"),
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
    overviewVideoId: "zWJ3_3hVxb8",
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

