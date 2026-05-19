"""User-provided practice MCQs and video IDs — imported by build_orgochem2_enrichment.py."""

def mcq(q, opts, ans, exp):
    assert len(opts) == 4 and ans in (0, 1, 2, 3)
    return {"question": q, "options": opts, "answerIndex": ans, "explanation": exp}


def mki(title, desc, vid):
    return {"title": title, "description": desc, "videoId": vid}


PRACTICE_OVERRIDES = {
    "resonance-acid-base-review": [
        mcq("Which bonds are allowed to move in resonance structures?", ["Sigma bonds only", "Pi bonds and lone pairs only", "All bonds including sigma", "Only lone pairs, never pi bonds"], 1, "Resonance involves the delocalization of pi electrons and lone pairs only. Sigma bonds form the fixed framework of a molecule and never move in resonance structures. Atoms also stay in the same positions."),
        mcq("Using the pKa table, predict which reaction will proceed as written: CH3COOH + NaOH → CH3COO⁻Na⁺ + H2O", ["No reaction — NaOH is too weak a base", "Proceeds — acetic acid (pKa ~5) is stronger acid than water (pKa 15.7), so products are favored", "Proceeds — but only at high temperature", "No reaction — carboxylic acids can't be deprotonated"], 1, "The reaction favors the side with the weaker acid. Acetic acid (pKa ~5) is a much stronger acid than water (pKa 15.7). The equilibrium strongly favors products."),
        mcq("Can NaOH deprotonate a terminal alkyne (pKa ~25)?", ["Yes — NaOH is a strong base", "No — water (pKa 15.7) is a weaker acid than the alkyne, so equilibrium favors reactants", "Yes — but only in ether solvent", "No — alkynes don't have acidic protons"], 1, "For deprotonation to proceed, the base's conjugate acid must be weaker (higher pKa) than the acid being deprotonated. NaOH's conjugate acid is water (pKa 15.7). The alkyne has pKa ~25."),
        mcq("An electron-withdrawing group (EWG) is placed adjacent to a carboxylic acid. What happens to its acidity?", ["Acidity decreases — EWGs donate electrons", "Acidity increases — EWGs stabilize the carboxylate anion", "Acidity is unchanged — groups don't affect acidity", "Acidity decreases — EWGs destabilize the anion"], 1, "EWGs pull electron density away from the carboxylate anion, stabilizing the negative charge. More stable anion = stronger acid = lower pKa."),
        mcq("Rank these in order of increasing acidity (least to most): ethane (pKa ~50), ethanol (pKa ~16), acetic acid (pKa ~5), phenol (pKa ~10)", ["Ethane < Ethanol < Phenol < Acetic acid", "Acetic acid < Phenol < Ethanol < Ethane", "Ethanol < Ethane < Acetic acid < Phenol", "Ethane < Phenol < Ethanol < Acetic acid"], 0, "Lower pKa = more acidic. Increasing acidity: ethane < ethanol < phenol < acetic acid."),
        mcq("A resonance structure shows a carbon with 3 bonds and a positive charge. How many nonbonding electrons does it have?", ["0 — using charge formula: 4 - 3 - 0 = +1", "2", "4", "6"], 0, "Charge = valence electrons - bonds - nonbonding electrons. For carbon: 4 - 3 - 0 = +1. A carbocation has 3 bonds, 0 nonbonding electrons, and a +1 charge."),
        mcq("Which species is the stronger base: CH3COO⁻ or OH⁻?", ["CH3COO⁻ — carboxylates are always strong bases", "OH⁻ — hydroxide is the stronger base because its conjugate acid (water, pKa 15.7) has a higher pKa than acetic acid (pKa 5)", "Both are equally basic", "Neither is basic"], 1, "Stronger base = weaker conjugate acid = higher pKa. OH⁻ conjugate acid = H2O (pKa 15.7). CH3COO⁻ conjugate acid = CH3COOH (pKa 5)."),
        mcq("Two resonance structures of benzene are drawn. What is true about them?", ["They are different molecules in equilibrium", "They are the same molecule — resonance structures represent one hybrid structure", "One is more stable than the other", "They interconvert by rotating sigma bonds"], 1, "Resonance structures are not different molecules. They describe a single resonance hybrid."),
        mcq("What base is strong enough to deprotonate a terminal alkyne (pKa ~25)?", ["NaOH (conjugate acid pKa 15.7)", "Na2CO3 (conjugate acid pKa ~10)", "NaNH2 (conjugate acid NH3, pKa ~35)", "NaHCO3 (conjugate acid pKa ~6)"], 2, "To deprotonate an acid, the base's conjugate acid must have a higher pKa than the acid. NaNH2 (NH3, pKa ~35) can deprotonate terminal alkynes."),
        mcq("A molecule has the structure CH2=CH-CH=O (crotonaldehyde). How many resonance structures can be drawn, and what charge distribution do they show?", ["One structure — no resonance possible", "Two structures — the pi bond alternates between C=C and C=O", "Two meaningful resonance structures — one with C=C-C=O and one with ⁻C-C=C-O⁺", "Three structures — requires a radical intermediate"], 2, "Crotonaldehyde is conjugated. The charge-separated form explains 1,2- vs 1,4-addition regiochemistry."),
    ],
    "alkynes": [
        mcq("Propyne reacts with 1 equivalent of Br2. What is the major product?", ["1,1-dibromopropane", "1,2-dibromoprop-1-ene (vinyl dibromide)", "1,1,2,2-tetrabromopropane", "Propane"], 1, "One equivalent of Br2 adds across one pi bond to give a vinyl dibromide (anti addition)."),
        mcq("What is the product of treating propyne with HgSO4, H2SO4, and H2O?", ["Propan-1-ol", "Propanal (aldehyde)", "Propan-2-one (acetone, a ketone)", "Propene"], 2, "Markovnikov hydration gives an enol that tautomerizes to a ketone. Propyne → acetone."),
        mcq("You need to synthesize cis-2-pentene from 2-pentyne. Which reagent do you use?", ["H2/Pt", "Na, liquid NH3", "H2, Lindlar's catalyst (Pd/BaSO4, quinoline)", "NaBH4"], 2, "Lindlar's catalyst gives cis (Z) alkenes via syn addition."),
        mcq("Terminal alkynes have pKa ~25. What does this mean for their reactivity?", ["They are more acidic than water and can be deprotonated by NaOH", "They are less acidic than water; NaNH2 is needed to deprotonate them", "They cannot be deprotonated under any conditions", "They are more acidic than carboxylic acids"], 1, "NaOH cannot deprotonate terminal alkynes; use NaNH2."),
        mcq("Treating 1-butyne with Sia2BH then H2O2/NaOH gives what product?", ["Butan-2-one", "Butanal (an aldehyde, anti-Markovnikov)", "Butan-1-ol", "1,1-dibromobutane"], 1, "Hydroboration–oxidation of a terminal alkyne gives the anti-Markovnikov aldehyde."),
        mcq("What are the products of oxidative cleavage of 3-hexyne with KMnO4?", ["Two equivalents of propanoic acid", "Two equivalents of propanal", "One propanoic acid + CO2", "Hexanedioic acid"], 0, "Internal alkyne cleavage gives two carboxylic acids."),
        mcq("An acetylide anion (RC≡C⁻) reacts with 2-bromopropane. What problem arises?", ["No problem — acetylide does SN2 on any alkyl halide", "The reaction fails — acetylide cannot do SN2 on secondary alkyl halides; E2 elimination occurs instead", "The acetylide deprotonates the solvent", "2-bromopropane is too reactive"], 1, "Acetylide SN2 works only with primary alkyl halides."),
        mcq("What is keto-enol tautomerization and when does it occur?", ["Two molecules interconverting by forming/breaking a C-C bond", "Isomers differing in placement of one H and a double bond; enol converts to keto under acid or base catalysis", "A radical process requiring UV light", "Reversible rotation around a C=C double bond"], 1, "The enol is less stable than the keto form; tautomerization explains alkyne hydration products."),
        mcq("Terminal alkyne RC≡CH + HgSO4/H2SO4/H2O gives (after tautomerization):", ["Aldehyde", "Methyl ketone", "Primary alcohol", "Alkane"], 1, "Markovnikov hydration of terminal alkyne → methyl ketone."),
        mcq("Lindlar catalyst (H2, poisoned Pd) on an alkyne gives:", ["Trans alkene", "cis alkene", "Alkane", "Diol"], 1, "Lindlar stops at cis alkene."),
    ],
    "grignard-reaction": [
        mcq("PhMgBr is added to acetone, then H3O+. What is the product?", ["Benzaldehyde", "2-phenyl-2-propanol (a tertiary alcohol)", "Isopropyl benzene", "Benzoic acid"], 1, "Grignard adds to the carbonyl → tertiary alcohol after protonation."),
        mcq("What happens when PhMgBr is added to a flask containing ethyl acetate with a trace of water?", ["Normal Grignard addition occurs to give a tertiary alcohol", "The Grignard reagent is immediately destroyed — it protonates with water before attacking the ester", "An ether forms", "Oxidation of the Grignard occurs"], 1, "Water destroys Grignard reagents before they reach the carbonyl."),
        mcq("RMgBr is added to an ester (RCOOR'), then H3O+. How many times does the Grignard add?", ["Once — gives a ketone", "Twice — gives a tertiary alcohol (same two R groups from Grignard)", "Three times — gives a primary alcohol", "Zero times — esters don't react with Grignard"], 1, "Esters undergo two Grignard additions → tertiary alcohol."),
        mcq("How would you synthesize 2-phenylethanol using a Grignard reaction?", ["PhMgBr + formaldehyde, then H3O+", "PhMgBr + acetaldehyde, then H3O+", "CH3MgBr + benzaldehyde, then H3O+", "PhMgBr + ethylene oxide, then H3O+"], 3, "PhMgBr + ethylene oxide → 2-phenylethanol after H3O+."),
        mcq("A Gilman reagent (R2CuLi) reacts with an acid chloride. What is the product?", ["A tertiary alcohol (adds twice like Grignard)", "A ketone (adds once, stops)", "A primary alcohol", "An alkane"], 1, "Gilman reagents add once to acid chlorides → ketone."),
        mcq("Grignard reagents are typically prepared in:", ["Water", "Dry ether or THF", "Concentrated HCl", "Liquid NH3 only"], 1, "RMgX requires anhydrous ether/THF."),
        mcq("RMgBr + CO2, then H3O+ gives:", ["Aldehyde", "Carboxylic acid", "Ketone", "Ester"], 1, "CO2 + Grignard → carboxylic acid after workup."),
        mcq("Gilman reagents (R2CuLi) differ from Grignard because they often:", ["Add once to α,β-unsaturated carbonyls (1,4)", "Only reduce esters", "Require water", "Form radicals exclusively"], 0, "Organocuprates give conjugate addition selectively."),
        mcq("Grignard + formaldehyde (H2CO) gives after H3O+:", ["Primary alcohol", "Secondary alcohol", "Tertiary alcohol", "Aldehyde"], 0, "Formaldehyde → 1° alcohol."),
        mcq("Which substrate will DESTROY a Grignard reagent?", ["Dry acetone", "Ester", "Terminal alkyne (acidic H)", "CO2"], 2, "Protic/acidic sites protonate RMgX."),
    ],
    "organohalides-radical": [
        mcq("Radical chlorination of butane with Cl2/hν gives multiple products. Which is the MAJOR product?", ["1-chlorobutane", "2-chlorobutane", "Equal amounts of both", "1,2-dichlorobutane"], 1, "2° C–H abstraction is favored → 2-chlorobutane major."),
        mcq("NBS (N-bromosuccinimide) with hν reacts with 4-tert-butylmethylbenzene. Where does bromination occur?", ["On the benzene ring (EAS)", "At the methyl group (allylic/benzylic position)", "At the tert-butyl group", "No reaction"], 1, "NBS selectively brominates benzylic/allylic positions under radical conditions."),
        mcq("What product forms when SOCl2 reacts with (R)-2-butanol?", ["(S)-2-chlorobutane (inverted)", "(R)-2-chlorobutane (retained)", "Racemic 2-chlorobutane", "2-butene (elimination)"], 1, "SOCl2 gives retention of configuration."),
        mcq("Which is the correct sequence for radical chain halogenation?", ["Termination → Initiation → Propagation", "Initiation → Propagation → Termination", "Propagation → Initiation → Termination", "All three occur simultaneously"], 1, "Initiation → propagation → termination."),
        mcq("HBr adds to propene with ROOR (peroxide). What is the product and mechanism?", ["2-bromopropane, ionic Markovnikov", "1-bromopropane, radical anti-Markovnikov", "1-bromopropane, ionic anti-Markovnikov", "2-bromopropane, radical addition"], 1, "Peroxide initiates radical anti-Markovnikov HBr addition."),
        mcq("Radical halogenation of methane with Cl2/light proceeds via:", ["SN2", "Carbocation", "Radical chain (initiation, propagation)", "E2"], 2, "Radical chain mechanism."),
        mcq("Radical stability order (most → least):", ["1° > 2° > 3°", "3° > 2° > 1° > methyl", "Methyl > 1°", "All equal"], 1, "3° > 2° > 1°; allylic/benzylic especially stable."),
        mcq("PBr3 converts an alcohol to:", ["Alkyl chloride", "Alkyl bromide", "Alkene", "Ether"], 1, "PBr3 → alkyl bromide."),
        mcq("Anti-Markovnikov addition of HBr to an alkene uses:", ["HBr only", "HBr + peroxides (radical)", "Br2/H2O", "HgSO4"], 1, "Peroxides switch to radical addition."),
        mcq("Allylic bromination product of propene with NBS is:", ["1-bromopropane", "3-bromo-1-propene (allylic)", "2-bromopropane", "Propene dibromide"], 1, "Allylic position is brominated."),
    ],
    "conjugated-compounds-diels-alder": [
        mcq("1,3-butadiene reacts with HBr at −80°C. What is the major product?", ["3-bromobut-1-ene (1,4-addition product)", "3,4-dibromobutane", "3-bromobut-1-ene (1,2-addition product)", "No reaction at low temperature"], 2, "Low temperature → kinetic 1,2-addition product."),
        mcq("Which diene CANNOT undergo a Diels-Alder reaction and why?", ["1,3-butadiene — too simple", "(E)-1,3-pentadiene — wrong geometry", "2,3-di-tert-butyl-1,3-butadiene — locked s-trans", "Cyclopentadiene — too reactive"], 2, "Bulky groups lock the diene in s-trans."),
        mcq("Maleic anhydride (cis dienophile) reacts with 1,3-butadiene. What is the stereochemistry of the product?", ["Trans relationship between the anhydride oxygens", "Cis relationship — dienophile geometry is preserved", "Racemic mixture", "No stereochemistry"], 1, "Concerted [4+2] preserves cis/trans geometry."),
        mcq("Why does the 1,4-addition product of a conjugated diene + HBr dominate at high temperature?", ["The 1,4-product forms faster", "At high temperature the reaction is reversible; 1,4-product is more stable", "Heat changes the mechanism to radical", "High temperature destroys the 1,2-product"], 1, "Thermodynamic control favors the more stable 1,4-product."),
        mcq("What two conditions make an ideal Diels-Alder reaction fast and high-yielding?", ["EWG on diene + EDG on dienophile", "EDG on diene + EWG on dienophile, and diene in s-cis", "Both components must be cyclic", "High temperature always increases yield"], 1, "EDG diene + EWG dienophile + s-cis diene."),
        mcq("A conjugated diene is more stable than two isolated double bonds because:", ["Sigma bonds strengthen", "Pi electrons are delocalized", "It is antiaromatic", "Steric strain is higher"], 1, "Conjugation delocalizes π electrons."),
        mcq("Diels–Alder requires the diene in:", ["s-trans only", "s-cis conformation", "Non-planar boat", "Radical conditions"], 1, "Diene must be s-cis."),
        mcq("The Diels–Alder reaction is:", ["Stepwise ionic", "Concerted pericyclic", "Radical only", "SN2"], 1, "One-step concerted mechanism."),
        mcq("1,3-butadiene + maleic anhydride (heat) gives:", ["Open-chain diol", "Cyclohexene derivative (adduct)", "Two alkenes", "Polymer only"], 1, "Classic Diels–Alder cycloadduct."),
        mcq("Electron-rich diene + electron-poor dienophile is favored because:", ["HOMO–LUMO interaction is symmetry-allowed and energy-matched", "It is antiaromatic", "Only radicals react", "EDG blocks all reactivity"], 0, "Normal electron-demand Diels–Alder."),
    ],
}

ENRICH_VIDEO_PATCHES = {
    "resonance-acid-base-review": {
        "overviewVideoId": "_S-Dxnv-VLs",
        "mustKnowItems": [
            mki("Resonance basics", "Only π bonds and lone pairs move; atoms stay fixed.", "_S-Dxnv-VLs"),
            mki("Drawing resonance structures", "Practice curved arrows without moving σ bonds.", "4G_jHoFMRpA"),
            mki("pKa and acid strength", "Lower pKa = stronger acid; use tables to set equilibrium.", "MnWWJVRbdXg"),
            mki("EWG/EDG effects on acidity", "Withdrawers stabilize anions; donors destabilize them.", "9N4AuX5oK-o"),
        ],
    },
    "substitution-elimination-nmr-review": {
        "overviewVideoId": "5EGnJiLtfPs",
        "mustKnowItems": [
            mki("SN2 requirements", "1° substrate, strong Nu, polar aprotic solvent.", "5EGnJiLtfPs"),
            mki("SN1 requirements", "3° substrate, weak Nu, protic solvent.", "5EGnJiLtfPs"),
            mki("Tosylate strategy", "TsCl activates –OH without breaking C–O at carbon.", "Z-nVfpJ6gls"),
            mki("NMR key shifts", "δ, integration, and splitting for exam spectra.", "SBir5wUS3Bo"),
        ],
    },
    "alkynes": {
        "overviewVideoId": "K07VceUan0k",
        "mustKnowItems": [
            mki("Double addition of Br2", "One equiv → vinyl dibromide; two equiv → tetrahalide.", "K07VceUan0k"),
            mki("Hydration (Markovnikov)", "Hg²⁺/H₂SO₄/H₂O → enol → ketone.", "Yd9MFqJmyas"),
            mki("Hydration (anti-Markovnikov)", "Hydroboration–oxidation → aldehyde from terminal alkyne.", "Yd9MFqJmyas"),
            mki("Reduction to alkenes", "Lindlar (cis) vs Na/NH₃ (trans).", "vJPKfTSJQaM"),
            mki("Acetylide alkylation", "NaNH₂ then 1° alkyl halide only.", "hS4WWJWQ3_Y"),
            mki("Oxidative cleavage", "KMnO₄ cleavage patterns.", "K07VceUan0k"),
        ],
    },
    "grignard-reaction": {
        "overviewVideoId": "Y9jAMdA7C1c",
        "mustKnowItems": [
            mki("Grignard formation", "Mg, dry ether; handle under anhydrous conditions.", "Y9jAMdA7C1c"),
            mki("Addition to carbonyls", "RMgX + carbonyl → alcohol after H₃O⁺.", "8wXaRfFsRPs"),
            mki("Incompatible groups", "Protic acids and O–H destroy the reagent.", "Y9jAMdA7C1c"),
            mki("Gilman reagent", "R₂CuLi: selective 1,4 and ketone from acid chloride.", "6oOomzJzP6M"),
            mki("Suzuki-Miyaura", "Pd-catalyzed C–C coupling overview.", "6oOomzJzP6M"),
        ],
    },
    "organohalides-radical": {
        "overviewVideoId": "rWoaT2NLQLA",
        "mustKnowItems": [
            mki("Alcohol to alkyl halide", "PBr₃, SOCl₂, and HX tradeoffs.", "3_kVUkXS2ds"),
            mki("Radical mechanism", "Initiation → propagation → termination.", "rWoaT2NLQLA"),
            mki("NBS allylic bromination", "Selective allylic/benzylic positions.", "vJPKfTSJQaM"),
            mki("Radical stability", "Allylic/benzylic > 3° > 2° > 1°.", "rWoaT2NLQLA"),
        ],
    },
    "conjugated-compounds-diels-alder": {
        "overviewVideoId": "Uy8A0SZZD_g",
        "mustKnowItems": [
            mki("Conjugated vs isolated", "π overlap lowers energy vs isolated dienes.", "6QLnXPF16dA"),
            mki("1,2 vs 1,4 addition", "Kinetic (low T) vs thermodynamic (high T) control.", "bVbNRKkbVSA"),
            mki("Diels-Alder reaction", "s-cis diene + electron-deficient dienophile.", "Uy8A0SZZD_g"),
            mki("Stereochemistry", "Suprafacial [4+2] preserves dienophile geometry.", "3N5mM5HI-es"),
        ],
    },
    "aromaticity": {
        "overviewVideoId": "MFABFiMEGqQ",
        "mustKnowItems": [
            mki("4 criteria for aromaticity", "Cyclic, planar, conjugated, 4n+2 π e⁻.", "MFABFiMEGqQ"),
            mki("Aromatic vs antiaromatic", "Hückel rule and planarity.", "gRm-A7SdNT0"),
            mki("Pyridine vs pyrrole basicity", "Where the lone pair lives relative to π.", "y4L97H_3lT4"),
            mki("Heterocycles", "Electron counting in furan, thiophene, pyrrole.", "y4L97H_3lT4"),
        ],
    },
    "electrophilic-aromatic-substitution": {
        "overviewVideoId": "B8bQBLHkBiQ",
        "mustKnowItems": [
            mki("EAS two steps", "σ complex then deprotonation restores aromaticity.", "B8bQBLHkBiQ"),
            mki("5 EAS reactions", "Halogenation, nitration, sulfonation, FC alkylation/acylation.", "K_5B0TBUOQA"),
            mki("Directing effects", "Ortho/para vs meta from resonance.", "V0bdQFrUzgE"),
            mki("Friedel-Crafts alkylation", "Carbocation chemistry; rearrangement risk.", "SxGWnfFMrq4"),
            mki("Friedel-Crafts acylation", "Ketone product; no rearrangement.", "9G5nQi4kD0g"),
        ],
    },
    "nucleophilic-aromatic-substitution": {
        "overviewVideoId": "DAbRxRV-3-4",
        "mustKnowItems": [
            mki("NAS requirements", "EWG ortho/para to leaving group.", "DAbRxRV-3-4"),
            mki("NAS vs EAS", "When the ring is electron-poor.", "DAbRxRV-3-4"),
            mki("Benzyne mechanism", "Strong base on simple aryl halides.", "DAbRxRV-3-4"),
            mki("Side-chain reactions", "Benzylic oxidation and halogenation.", "lBJc9ij5ZLU"),
        ],
    },
    "alcohols-phenols": {
        "overviewVideoId": "K07VceUan0k",
        "mustKnowItems": [
            mki("Reducing agents", "NaBH₄ vs LiAlH₄ scope.", "PJ4Kq3GXOOU"),
            mki("Oxidation levels", "1° → aldehyde → acid; 2° → ketone.", "K07VceUan0k"),
            mki("Tosylate strategy", "TsCl/pyridine; retention at stereocenter.", "Z-nVfpJ6gls"),
            mki("Phenol acidity", "Resonance stabilization of phenoxide.", "2IKb_yVhL3E"),
        ],
    },
    "ethers-epoxides": {
        "overviewVideoId": "ojVhITKMtSA",
        "mustKnowItems": [
            mki("Williamson synthesis", "Alkoxide + 1° RX; avoid 3° halide.", "ojVhITKMtSA"),
            mki("Ether cleavage", "HBr/HI mechanisms.", "0fNuDJPIiPA"),
            mki("Epoxide synthesis", "mCPBA syn epoxidation.", "8Ydm-HHJoF0"),
            mki("Ring opening acid/base", "Acid: more substituted C; base: less substituted.", "0fNuDJPIiPA"),
        ],
    },
    "aldehydes-ketones": {
        "overviewVideoId": "MQsPeQBjqmM",
        "mustKnowItems": [
            mki("Cyanohydrin", "CN⁻ addition to carbonyl.", "pTLM_5RJCQ4"),
            mki("Imine and enamine", "1° vs 2° amine outcomes; pH window.", "TZtkZRsXkc8"),
            mki("Wolff-Kishner", "Hydrazone then strong base/heat.", "T4r7eBpwsQk"),
            mki("Acetal formation", "Protection/deprotection equilibrium.", "nC5XJLN3WjE"),
            mki("Wittig reaction", "Phosphonium ylide forms new C=C.", "xHfb0dRBDRs"),
        ],
    },
    "carboxylic-acids-derivatives": {
        "overviewVideoId": "zWJ3_3hVxb8",
        "mustKnowItems": [
            mki("Reactivity order", "Acid chloride > anhydride > ester > amide.", "jSCQpMmDzrE"),
            mki("Acyl substitution", "Tetrahedral intermediate; LG basicity.", "jSCQpMmDzrE"),
            mki("Fischer esterification", "Equilibrium with water/alcohol.", "B28_pfN_4l8"),
            mki("Acid chloride SOCl2", "–COOH → –COCl.", "cSmKPsJebbU"),
            mki("Ester reactions", "Hydrolysis, transesterification, reduction.", "ZApKjLKKXvk"),
            mki("Amide reactions", "Hydrolysis difficulty vs esters.", "R_L_mJTrLvQ"),
        ],
    },
}
