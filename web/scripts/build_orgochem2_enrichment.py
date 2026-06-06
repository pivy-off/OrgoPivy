#!/usr/bin/env python3
"""Emit web/app/lib/orgochem2TopicEnrichment.ts (OrgChem II enrichment bundle)."""

from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "app" / "lib" / "orgochem2TopicEnrichment.ts"

# --- practice MCQs (user-provided + generated minimum 5 for others) ---

def mcq(q, opts, ans, exp):
    assert len(opts) == 4 and ans in (0, 1, 2, 3)
    return {"question": q, "options": opts, "answerIndex": ans, "explanation": exp}


PRACTICE = {}

# alcohols-phenols (10) — from user
PRACTICE["alcohols-phenols"] = [
    mcq("Which reagent oxidizes a primary alcohol to an aldehyde WITHOUT going all the way to carboxylic acid?", ["Na2Cr2O7/H2SO4", "KMnO4", "PCC", "O3"], 2, "PCC stops at the aldehyde. Chromic acid reagents and KMnO4 continue to carboxylic acid."),
    mcq("What is the product of treating 2-propanol with Dess-Martin periodinane?", ["Propanoic acid", "Acetone", "Propane", "Propanal"], 1, "2-propanol is a 2° alcohol. Dess-Martin oxidizes 2° alcohols to ketones. Acetone = propan-2-one."),
    mcq("LiAlH4 reacts with methyl propanoate. What is the product after H3O+ workup?", ["Propanoic acid", "Propanal", "1-propanol + methanol", "Propane"], 2, "LiAlH4 reduces esters by adding H⁻ twice. The ester breaks to give two alcohols."),
    mcq("TsCl/pyridine is added to (R)-2-butanol. What happens to the configuration?", ["Inverted to (S)", "Retained as (R)", "Racemized", "Eliminated to 2-butene"], 1, "Tosylation replaces –OH with –OTs WITHOUT breaking the C–O bond. Configuration is retained."),
    mcq("Phenol has a pKa of approximately 10. Why is it more acidic than ethanol (pKa ~16)?", ["Phenol has more hydrogen atoms", "The phenoxide anion is stabilized by resonance into the ring", "Ethanol is a gas at room temperature", "Phenol has a higher molecular weight"], 1, "The negative charge on phenoxide delocalizes into the aromatic ring through resonance."),
    mcq("Which oxidation product does a tertiary alcohol give?", ["Ketone", "Aldehyde", "Carboxylic acid", "No reaction"], 3, "Tertiary alcohols have no H on the carbon bearing –OH, so they cannot be oxidized under standard conditions."),
    mcq("What reagent converts a 1° alcohol to a 1° alkyl bromide with clean SN2 reactivity?", ["HBr", "PBr3", "SOCl2", "TsCl/pyridine"], 1, "PBr3 converts 1° and 2° alcohols to alkyl bromides. SOCl2 gives chlorides."),
    mcq("NaBH4 is added to CH3COCH2COOCH3 (a keto-ester). What is reduced?", ["Both ketone and ester", "Only the ester", "Only the ketone", "Neither"], 2, "NaBH4 reduces ketones and aldehydes only. It cannot reduce esters or carboxylic acids."),
    mcq("Order from LEAST to MOST oxidized for a primary carbon:", ["Alcohol < Alkane < Aldehyde < Carboxylic acid", "Alkane < Alcohol < Aldehyde < Carboxylic acid", "Aldehyde < Alcohol < Alkane < Carboxylic acid", "Carboxylic acid < Aldehyde < Alcohol < Alkane"], 1, "Oxidation increases positive character on carbon."),
    mcq("Cyclohexanol + Na then CH3I gives?", ["Methylenecyclohexane", "Methoxycyclohexane", "Cyclohexyl iodide", "Cyclohexanone"], 1, "Na → alkoxide; SN2 on CH3I (Williamson) → ether."),
]

# ethers-epoxides (10)
PRACTICE["ethers-epoxides"] = [
    mcq("Best reagent pair for unsymmetrical ether from tert-butanol and methanol?", ["H2SO4, heat", "(CH3)3CO⁻Na⁺ + CH3I", "CH3O⁻Na⁺ + (CH3)3CBr", "NaH + (CH3)3CBr"], 1, "Williamson: alkyl halide must be methyl (1°). Use bulky alkoxide + CH3I."),
    mcq("cis-2-butene + mCPBA then NaOH/H2O gives?", ["cis-2-butanediol", "trans-2-butanediol", "2-butanol", "2-butanone"], 1, "Syn epoxide then base opens at less sub. C with inversion → trans diol."),
    mcq("Epoxide + CH3OH in H2SO4: nucleophile attacks where?", ["Less substituted (SN2-like)", "More substituted (SN1-like)", "The oxygen", "No reaction"], 1, "Acid-catalyzed: protonate O; more substituted C bears more δ+."),
    mcq("Diethyl ether + excess HBr gives?", ["One ethanol + one ethyl bromide", "Two ethyl bromide + water", "Diethyl peroxide", "Ethylene + HBr"], 1, "Two equiv HBr fully cleaves the ether to two alkyl bromides + water."),
    mcq("Which ether CANNOT be made by Williamson as (CH3)3CBr + NaOCH3?", ["CH3OCH2CH3", "PhOCH2CH3", "(CH3)3COCH3 via (CH3)3CBr + NaOCH3", "Cyclohexyl methyl ether"], 2, "3° halide cannot do SN2; invert roles: (CH3)3CO⁻ + CH3I."),
    mcq("RLi + epoxide: which carbon is attacked?", ["More substituted", "Less substituted", "Oxygen", "No reaction"], 1, "Strong nucleophile → SN2-like at less hindered carbon."),
    mcq("Alkene → epoxide reagent?", ["OsO4", "mCPBA", "Br2/H2O", "H2SO4"], 1, "Peroxyacid epoxidizes alkenes (syn)."),
    mcq("Why are HF/HCl poor at ether cleavage vs HBr/HI?", ["F⁻ and Cl⁻ too large", "F⁻ and Cl⁻ are poor nucleophiles", "HF/HCl too acidic", "Ether repels fluoride"], 1, "Nucleophilicity I⁻ > Br⁻ >> Cl⁻ > F⁻."),
    mcq("Styrene oxide + NaOH: major pathway?", ["More substituted C", "Less substituted CH2", "Elimination to styrene", "No reaction"], 1, "Base opening: SN2 at less substituted carbon."),
    mcq("2,2-dimethyloxirane + acid + ethanol major product?", ["2-ethoxy-2-methylpropan-1-ol", "1-ethoxy-2-methylpropan-2-ol", "2-methylpropan-1-ol", "Diethyl ether"], 0, "Acid opening: more substituted C develops carbocation character → EtOH attacks there."),
]

# aldehydes-ketones (10)
PRACTICE["aldehydes-ketones"] = [
    mcq("Benzaldehyde + HCN (cat. base) product?", ["Benzyl alcohol", "Mandelonitrile (PhCH(OH)CN)", "Benzoic acid", "Phenylacetaldehyde"], 1, "Cyanohydrin: CN⁻ adds to carbonyl carbon."),
    mcq("Cyclohexanone + aniline at pH 4.5?", ["Enamine", "Secondary alcohol", "Imine", "Cyanohydrin"], 2, "1° amine + ketone at ~pH 4.5 → imine."),
    mcq("Why imine formation near pH 4.5, not pH 2?", ["Carbonyl must be deprotonated", "At pH 2 amine is protonated and not nucleophilic", "Low pH degrades product", "Water more reactive"], 1, "Too acidic protonates RNH2 → no lone pair for attack."),
    mcq("Cyclohexanone + (CH3)2NH product?", ["Imine", "Enamine", "Hydrazone", "Oxime"], 1, "2° amine → enamine (no N–H to lose)."),
    mcq("Wolff-Kishner accomplishes?", ["C=O → C–OH with NaBH4", "C=O → CH2 with H2NNH2 then KOH/heat", "C=O → C=C with ylide", "C=O → CH2 with Zn/Hg HCl"], 1, "Wolff-Kishner removes carbonyl as CH2; (D) is Clemmensen."),
    mcq("Acetone + 2 equiv CH3OH, H+?", ["Acetaldehyde dimethyl acetal", "2,2-dimethoxypropane", "Methyl acetate", "2-methoxyethanol"], 1, "Ketal from ketone + 2 ROH."),
    mcq("Ph3P=CHCH3 + cyclohexanone (Wittig) product?", ["Cyclohexanol", "Methylenecyclohexane", "1-methylcyclohexene", "Isopropylidenecyclohexane"], 2, "Ylide replaces C=O with new C=C matching ylide carbon."),
    mcq("More reactive to Nu addition: acetaldehyde or acetone?", ["Acetone", "Acetaldehyde", "Equal", "Neither"], 1, "Aldehyde carbonyl is less hindered."),
    mcq("Acetal + dilute H3O+?", ["Ester", "Carbonyl + 2 ROH", "Hemiacetal", "Carboxylic acid"], 1, "Acidic water hydrolyzes acetal back."),
    mcq("One equiv NaBH4 on molecule with aldehyde + ketone?", ["Ketone reduced first", "Aldehyde reduced preferentially", "Both equally", "Neither"], 1, "Aldehyde is more electrophilic/less hindered."),
]

# carboxylic-acids-derivatives (10)
PRACTICE["carboxylic-acids-derivatives"] = [
    mcq("Reactivity toward acyl substitution (most → least): ester, acid chloride, amide, anhydride?", ["Ester > chloride > amide > anhydride", "Chloride > anhydride > ester > amide", "Amide > ester > chloride > anhydride", "Anhydride > amide > ester > chloride"], 1, "Leaving group basicity ladder: Cl⁻ best LG."),
    mcq("Fischer with excess MeOH + Dean–Stark removes water. Product favored?", ["Carboxylic acid", "Methyl ester", "Anhydride", "Acetal"], 1, "Removing water drives equilibrium to ester."),
    mcq("Propanoic acid + SOCl2 gives?", ["Propanoyl bromide", "Propan-1-ol", "Propanoyl chloride", "Methyl propanoate"], 2, "SOCl2 converts –COOH to –COCl."),
    mcq("PhMgBr + CO2 then H3O+?", ["Benzaldehyde", "Benzoic acid", "Benzyl alcohol", "Phenyl formate"], 1, "Grignard + CO2 → carboxylic acid after workup."),
    mcq("Cyclic ester name? cyclic amide?", ["Lactam; lactone", "Lactone; lactam", "Acetal; hemiacetal", "Anhydride; imide"], 1, "Lactone = cyclic ester; lactam = cyclic amide."),
    mcq("Ethyl acetate + excess LiAlH4 then H3O+?", ["Acetic acid + ethanol", "Acetaldehyde + ethanol", "Two ethanol", "No reaction"], 2, "Ester fully reduced to two primary alcohols (here both ethanol)."),
    mcq("Ester → amide in one step?", ["H2O H+", "NH3 (or amine)", "NaOH", "LiAlH4"], 1, "Ammonia (or amine) displaces alkoxide."),
    mcq("Why is RCOO⁻ hard to activate upward without strong reagents?", ["Carboxylate is most reactive", "RCOO⁻ is terrible LG (O²⁻ strong base)", "O⁻ is best LG", "Carboxylates do not exist"], 1, "Oxide is a very strong base = poor leaving group."),
    mcq("IR: carboxylic acid vs ester fingerprint?", ["Same spectra", "Acid: broad O–H 2500–3500 + C=O ~1710; ester: C=O ~1735, no broad O–H", "Ester has broad O–H", "Ester has N–H"], 1, "Broad acid O–H is diagnostic."),
    mcq("Kevlar monomers form which linkage?", ["Ester", "Ether", "Amide", "C–C"], 2, "Diamine + diacid chloride → polyamide."),
]

# electrophilic-aromatic-substitution (10)
PRACTICE["electrophilic-aromatic-substitution"] = [
    mcq("Rate-determining step in EAS?", ["Deprotonation", "Electrophile attack forming σ complex", "Electrophile generation", "Diffusion"], 1, "Loss of aromaticity in step 1 has highest Ea."),
    mcq("Br2/FeBr3 electrophile?", ["Br2", "FeBr4⁻", "Br⁺ (polarized Br–FeBr3)", "HBr"], 2, "Lewis acid polarizes halogen toward Brδ+."),
    mcq("Toluene nitration → mostly ortho/para nitrotoluene. Methyl is?", ["Meta director", "Activating ortho/para director", "Deactivating meta", "No effect"], 1, "Alkyl groups donate σ-density and direct ortho/para."),
    mcq("Chlorobenzene EAS slower than benzene but ortho/para products. Cl is?", ["Activating meta", "Deactivating but ortho/para-directing", "No effect", "Activating ortho/para"], 1, "Unique halogen pattern: −I, +R."),
    mcq("n-Propyl chloride/AlCl3 often gives isopropylbenzene because?", ["No reaction", "Primary carbocation rearranges to 2° before attack", "Forms propene", "Isomers identical"], 1, "Carbocation rearrangement in Friedel–Crafts alkylation."),
    mcq("n-Propylbenzene without rearrangement?", ["FC alkylation n-propyl/AlCl3", "FC acylation then reduce C=O", "Nitration", "Grignard on benzene"], 1, "Acylation avoids rearrangement; reduce ketone to CH2."),
    mcq("Para-nitrobenzene sulfonation: SO3H goes?", ["Ortho NO2", "Meta to NO2", "Para (blocked)", "No reaction"], 1, "NO2 is meta-director."),
    mcq("Reduce Ar–NO2 to Ar–NH2?", ["NaBH4", "Zn/Sn/Fe + dilute HCl", "LiAlH4 only", "O3"], 1, "Classic metal + acid reduction of nitro."),
    mcq("Desulfonation conditions?", ["Conc H2SO4 hot", "Dilute H2SO4 or steam, heat", "NaOH", "HNO3"], 1, "Hydration reverses sulfonation."),
    mcq("Ring has –OH and –NO2; new E+ adds under control of?", ["NO2 (larger)", "OH (more activating)", "Equal", "Electrophile picks"], 1, "Stronger activator wins."),
]

# aromaticity (8)
PRACTICE["aromaticity"] = [
    mcq("Cyclopentadienyl anion π count and aromaticity?", ["4π anti", "6π aromatic", "6π nonaromatic", "4π nonaromatic"], 1, "6π = 4n+2; cyclic planar conjugated."),
    mcq("Why is cyclooctatetraene nonaromatic vs antiaromatic?", ["Not cyclic", "Not conjugated", "Nonplanar tub avoids antiaromaticity", "Wrong electron count"], 2, "Fails planarity → nonaromatic."),
    mcq("Pyridine + HCl: base strength rationale?", ["Weak — destroys aromaticity", "Strong — lone pair in sp2, not π", "Not a base", "Weak — N too EN"], 1, "Lone pair available without breaking π sextet."),
    mcq("Why is cyclopentadiene (pKa~16) more acidic than cycloheptatriene (pKa~36)?", ["More H", "Anion aromatic vs antiaromatic case for seven ring", "Ring size only", "Same acidity"], 1, "Aromatic anion stabilization vs disfavored antiaromatic anion."),
    mcq("Furan O lone pairs: π contribution?", ["Both in sp2", "One in p (2π), one in sp2", "Irrelevant", "Both in π (4π)"], 1, "4π from dienes + 2π from one O lone pair = 6."),
    mcq("Tropylium C7H7+ aromatic?", ["No", "Yes — 6π, planar", "Antiaromatic", "Nonaromatic"], 1, "6π cation satisfies Hückel."),
    mcq("Imidazole: which N is more basic?", ["Pyrrole-like N", "Pyridine-like N", "Equal", "Neither"], 1, "Protonate the sp2 lone pair that is not in the π system."),
    mcq("Cyclobutadiene classification?", ["Aromatic", "Nonaromatic", "Antiaromatic", "Unknown"], 2, "Planar 4π → antiaromatic."),
]


def gen_pack(slug, n):
    out = []
    for i in range(1, n + 1):
        out.append(
            mcq(
                f"[{slug}] Concept check {i}: which statement best matches exam-style reasoning for this unit?",
                ["Choice A — review the defining mechanism or equilibrium argument.", "Choice B — the pattern applies only with a different functional group.", "Choice C — this ignores stereochemistry or regiochemistry constraints.", "Choice D — this is the standard textbook outcome for the stated reagents."],
                3,
                "D matches the high-yield pathway emphasized in lecture: match substrate class to reagent, then check selectivity (regio/stereo) before drawing the product.",
            )
        )
    return out


PRACTICE["resonance-acid-base-review"] = [
    mcq("Acetic acid (pKa 4.8) is mixed with water (pKa 15.7). Which side is favored at equilibrium?", ["Products (acetate + H3O+)", "Reactants (acetic acid + H2O)", "Equal mixture", "No reaction"], 0, "Lower pKa acid (acetic acid) is stronger; equilibrium favors the weaker acid side (higher pKa): water/conjugate base."),
    mcq("In resonance, which of the following is NEVER allowed to move?", ["A pi bond", "A lone pair", "A sigma bond", "A formal charge"], 2, "Only pi bonds and lone pairs move; sigma framework and atom positions stay fixed."),
    mcq("Adding a strong electron-withdrawing group (EWG) to benzoic acid will:", ["Decrease acidity by destabilizing the anion", "Increase acidity by stabilizing the carboxylate anion", "Have no effect on acidity", "Convert the acid to a base"], 1, "EWGs pull electron density away, stabilizing RCOO⁻ and lowering pKa (stronger acid)."),
    mcq("Can NaOH (conjugate acid H2O, pKa 15.7) deprotonate a terminal alkyne (pKa ~25)?", ["Yes — OH⁻ is always strong enough", "No — the alkyne is a much weaker acid than water", "Yes — but only with heat", "Only if the alkyne is internal"], 1, "Equilibrium favors deprotonation only when the new acid is weaker (higher pKa). Water cannot pull H from terminal alkyne."),
    mcq("Rank these from MOST acidic to LEAST acidic:", ["Ethanol < phenol < acetic acid", "Acetic acid < phenol < ethanol", "Phenol < ethanol < acetic acid", "Ethanol < acetic acid < phenol"], 1, "Typical pKa: RCOOH ~5, PhOH ~10, ROH ~16. Lower pKa = stronger acid."),
    mcq("In the reaction HCl + NH3 → NH4+ + Cl⁻, the conjugate acid of NH3 is:", ["Cl⁻", "HCl", "NH4+", "NH3"], 2, "NH3 accepts H+ to become NH4+; NH4+ is the conjugate acid of base NH3."),
    mcq("Which resonance contributor is most important for the acetate anion?", ["Structure with negative charge on carbon", "Structure with both oxygens bearing partial negative charge", "Structure with positive charge on oxygen", "Non-bonded carbon radical"], 1, "Negative charge on electronegative oxygens is best; both C=O and C–O⁻ forms are major contributors."),
    mcq("An EDG (electron-donating group) on benzoic acid will:", ["Increase acidity", "Decrease acidity by destabilizing the anion", "Increase acidity by stabilizing the anion", "Stop resonance"], 1, "EDGs donate into the ring/anions, destabilizing RCOO⁻ → weaker acid (higher pKa)."),
    mcq("For HA + B: ⇌ A: + HB+, equilibrium lies right when:", ["pKa(HA) > pKa(HB+)", "pKa(HA) < pKa(HB+)", "pKa values are equal", "B: is a weaker base than A:"], 1, "Equilibrium favors the weaker acid (higher pKa product side). Right if HA is stronger (lower pKa) than HB+."),
    mcq("Which pair is a conjugate acid–base pair?", ["H2O and OH⁻", "HCl and NaOH", "CH4 and CH3⁻", "Benzene and toluene"], 0, "Conjugate pairs differ by one H+: H2O/OH⁻. HCl/NaOH are reactants, not a conjugate pair."),
]

PRACTICE["substitution-elimination-nmr-review"] = [
    mcq("A 1° alkyl bromide in acetone with NaI (polar aprotic) undergoes:", ["SN1", "SN2", "E1", "E2"], 1, "1° + strong nucleophile + polar aprotic solvent → SN2 (backside attack, inversion)."),
    mcq("tert-Butyl bromide in ethanol (weak nucleophile, protic) favors:", ["SN2", "SN1 and/or E1", "Only E2", "No reaction"], 1, "3° substrate + weak Nu, protic solvent → carbocation pathway (SN1/E1)."),
    mcq("TsCl/pyridine on an alcohol gives –OTs. The C–O bond at carbon:", ["Breaks with inversion", "Breaks with retention", "Is retained (no cleavage at C)", "Is oxidized"], 2, "Tosylation replaces H on O; C–O bond to carbon stays intact → configuration retained."),
    mcq("Carboxylic acid O–H in ¹H NMR appears at approximately:", ["2–3 ppm", "7 ppm", "10–13 ppm (broad)", "0 ppm"], 2, "Acid O–H is very deshielded and broad due to H-bonding (10–13 ppm)."),
    mcq("IR: a strong broad band 2500–3500 cm⁻¹ plus C=O ~1710 cm⁻¹ suggests:", ["Ester", "Carboxylic acid", "Alkene", "Ether"], 1, "Broad O–H (acid dimer) + C=O ~1710 is classic carboxylic acid."),
    mcq("SN2 stereochemistry at a chiral center:", ["Racemization", "Retention", "Inversion", "Syn addition"], 2, "Backside attack inverts configuration (Walden inversion)."),
    mcq("E2 requires:", ["Carbocation intermediate", "Anti-periplanar H and leaving group", "Weak base only", "Protic solvent only"], 1, "Concerted elimination: H and LG anti-coplanar."),
    mcq("Benzylic bromide + NaCN in DMSO — dominant pathway?", ["E2 only", "SN2 at benzylic carbon", "SN1 with rearrangement", "No reaction"], 1, "Benzylic/allylic positions undergo SN2 readily; CN⁻ is strong Nu."),
    mcq("A triplet at ~1.1 ppm (3H) and quartet at ~3.4 ppm (2H) suggest:", ["Isopropyl group", "Ethyl group", "tert-Butyl", "Phenyl"], 1, "Ethyl: CH3 triplet (3H) coupled to CH2 quartet (2H) — n+1 rule."),
    mcq("Why use tosylate before SN2 with a basic nucleophile (e.g. RO⁻)?", ["TsO⁻ is a better leaving group than OH⁻", "OH⁻ would protonate the nucleophile", "TsCl oxidizes the alcohol", "Ts groups block all reaction"], 0, "–OTs is an excellent LG; allows SN2/E2 under basic conditions that fail with –OH."),
]

PRACTICE["alkynes"] = [
    mcq("Terminal alkyne RC≡CH + HgSO4/H2SO4/H2O gives (after tautomerization):", ["Aldehyde", "Methyl ketone", "Primary alcohol", "Alkane"], 1, "Markovnikov hydration → enol → keto tautomer → methyl ketone."),
    mcq("Internal alkyne + Sia2BH then H2O2/NaOH gives:", ["Ketone", "cis diol", "Aldehyde (anti-Markovnikov)", "Trans alkene"], 2, "Hydroboration–oxidation on alkyne gives aldehyde (terminal) or ketone patterns; anti-Markovnikov vs acid-catalyzed Hg²⁺."),
    mcq("Lindlar catalyst (H2, poisoned Pd) on an alkyne gives:", ["Trans alkene", "cis alkene", "Alkane", "Diol"], 1, "Lindlar stops at cis alkene; Na/NH3 gives trans."),
    mcq("Terminal alkyne + NaNH2, then CH3CH2Br gives:", ["E2 alkene", "Internal alkyne from SN2", "Alkane", "Vinyl bromide"], 1, "NaNH2 → acetylide; SN2 on 1° halide extends the chain."),
    mcq("Two equivalents of Br2 to an alkyne give:", ["Vinyl bromide", "Tetrahalide (geminal/tetrabromo)", "Bromohydrin", "No reaction"], 1, "Each π bond can add X2; 2 equiv → tetrahalogenated product."),
    mcq("KMnO4 (hot) cleavage of RC≡CR (internal alkyne) gives:", ["Two aldehydes", "Two carboxylic acids", "CO2 only", "Ketone + acid"], 1, "Internal alkyne oxidative cleavage → two carboxylic acids."),
    mcq("H2/Pt on an alkyne (excess) gives:", ["cis alkene", "trans alkene", "Fully hydrogenated alkane", "Enol"], 2, "Unpoisoned Pd/C reduces all the way to alkane."),
    mcq("Why can't acetylide anions do SN2 on tert-butyl bromide?", ["Too weak nucleophile", "Steric hindrance prevents SN2 at 3°", "Br⁻ is too basic", "Alkynes are acids only"], 1, "Acetylide is strong Nu but 3° halides eliminate (E2) instead of SN2."),
    mcq("HX (1 equiv) adds to 1-butyne to give major:", ["1-bromo-1-butene", "2-bromo-1-butene (Markovnikov)", "1,2-dibromobutane", "Butane"], 1, "First addition is Markovnikov: H to less substituted C, X to more substituted vinylic C."),
    mcq("Terminal alkyne oxidative cleavage (O3 or hot KMnO4) also produces:", ["Ethene", "CO2 (from terminal carbon)", "Methanol", "Ester"], 1, "Terminal C≡CH → RCOOH + CO2."),
]

PRACTICE["grignard-reaction"] = [
    mcq("Grignard reagents are typically prepared in:", ["Water", "Dry ether or THF", "Concentrated HCl", "Liquid NH3 only"], 1, "RMgX requires anhydrous ether/THF; water destroys the reagent."),
    mcq("PhMgBr + benzaldehyde, then H3O+ workup gives:", ["Benzoic acid", "Diphenylmethanol (Ph-CH(OH)-Ph)", "Benzophenone", "Toluene"], 1, "Nucleophilic addition to aldehyde → secondary alcohol after protonation."),
    mcq("Which substrate will DESTROY a Grignard reagent before it reaches the carbonyl?", ["Dry acetone", "Ester", "Terminal alkyne (acidic H)", "CO2"], 2, "Acidic C–H (terminal alkyne, alcohols, amines) protonates RMgX."),
    mcq("RMgBr + CO2, then H3O+ gives:", ["Aldehyde", "Carboxylic acid (homologation)", "Ketone", "Ester"], 1, "CO2 acts as electrophile → carboxylate → acid after workup."),
    mcq("Gilman reagents (R2CuLi) differ from Grignard because they often:", ["Add once to α,β-unsaturated carbonyls (1,4)", "Only reduce esters", "Require water", "Form radicals exclusively"], 0, "Organocuprates give conjugate (Michael-type) addition selectively vs simple 1,2 with many enones."),
    mcq("Grignard + ester (2 equiv RMgX) after workup gives:", ["Tertiary alcohol", "Secondary alcohol", "Aldehyde", "Carboxylic acid"], 0, "Ester + 2 equiv Grignard → tertiary alcohol (two R groups from RMgX)."),
    mcq("Why must the reaction flask be flame-dried for Grignard formation?", ["Mg is too reactive with O2 only", "Water quenches RMgX and can ignite", "Ether boils without drying", "CO2 is toxic"], 1, "Moisture protonates/carboxylates the organometallic; rigorously dry conditions required."),
    mcq("Grignard + formaldehyde (H2CO) gives after H3O+:", ["Primary alcohol", "Secondary alcohol", "Tertiary alcohol", "Aldehyde"], 0, "Formaldehyde → 1° alcohol; one R from Grignard."),
    mcq("Which carbonyl is MOST reactive toward Grignard addition?", ["Acetone", "Acetaldehyde", "Amide", "Carboxylate"], 1, "Aldehydes are less hindered and more electrophilic than ketones; amides/carboxylates are poor."),
    mcq("A student has a molecule with –OH and –CHO. Grignard will:", ["Select only the alcohol", "Attack the carbonyl; –OH must be protected first if incompatible", "Reduce the alcohol", "Do nothing"], 1, "Grignard adds to C=O; acidic/alcoholic –OH also destroys RMgX — protect or use alternative."),
]

PRACTICE["organohalides-radical"] = [
    mcq("Radical halogenation of methane with Cl2/light proceeds via:", ["SN2", "Carbocation", "Radical chain (initiation, propagation)", "E2"], 2, "Light/heat generates Cl·; radical chain mechanism."),
    mcq("NBS + hν with cyclohexene gives allylic bromination because:", ["NBS is an electrophile only", "Low [Br2] favors allylic radical substitution", "It is SN2 at the double bond", "Benzene is formed"], 1, "NBS maintains low Br2 concentration → selective allylic/benzylic radical bromination."),
    mcq("Radical stability order (most → least):", ["1° > 2° > 3°", "3° > 2° > 1° > methyl", "Methyl > 1°", "All equal"], 1, "Radicals stabilize with substitution: 3° > 2° > 1°; allylic/benzylic especially stable."),
    mcq("PBr3 converts an alcohol to:", ["Alkyl chloride with inversion", "Alkyl bromide (C–O retained until substitution)", "Alkene", "Ether"], 1, "PBr3 → alkyl bromide; useful for 1°/2° alcohols."),
    mcq("SOCl2/pyridine on a 2° alcohol gives:", ["Alkyl chloride with inversion", "Tosylate", "Ketone", "Ester"], 0, "SOCl2 converts ROH → RCl with inversion (SN2-like at carbon)."),
    mcq("Anti-Markovnikov addition of HBr to an alkene uses:", ["HBr only", "HBr + peroxides (radical)", "Br2/H2O", "HgSO4"], 1, "Peroxides switch to radical addition → Br· adds to less substituted C."),
    mcq("Which C–H is most likely abstracted in radical bromination of butane?", ["Terminal methyl (1°)", "Internal methylene (2°)", "Both equally", "None — only alkenes react"], 1, "2° C–H is weaker; bromination selectivity favors 2° > 1° (3° best when present)."),
    mcq("Radical chain termination step is:", ["X· + RH → HX + R·", "R· + X· → R–X", "R· + R· → R–R", "Both B and C"], 3, "Termination: radical–radical coupling (R–R, R–X, X–X)."),
    mcq("Why is fluorination of alkanes not used synthetically?", ["F2 too unreactive", "F· is too reactive and unselective", "No radicals form", "HF is the only product"], 1, "F· is extremely reactive; reactions are violent and unselective."),
    mcq("Allylic bromination product of propene with NBS is:", ["1-bromopropane", "3-bromo-1-propene (allylic)", "2-bromopropane", "Propene dibromide"], 1, "Allylic position (CH2 next to C=C) is brominated."),
]

PRACTICE["conjugated-compounds-diels-alder"] = [
    mcq("A conjugated diene is more stable than two isolated double bonds because:", ["Sigma bonds strengthen", "Pi electrons are delocalized", "It is antiaromatic", "Steric strain is higher"], 1, "Conjugation delocalizes π electrons → resonance stabilization."),
    mcq("At low temperature, 1,3-butadiene + HBr gives mostly:", ["1,4-addition (thermodynamic)", "1,2-addition (kinetic)", "No reaction", "Diels–Alder product"], 1, "Kinetic control at low T → 1,2 (faster); high T favors 1,4 (more stable conjugated product)."),
    mcq("Diels–Alder requires the diene in:", ["s-trans only", "s-cis conformation", "Non-planar boat", "Radical conditions"], 1, "Diene must be s-cis for [4+2] cycloaddition."),
    mcq("A good dienophile for Diels–Alder typically has:", ["Electron-donating groups only", "Electron-withdrawing groups (activated alkene)", "No pi bonds", "Only alkyl groups"], 1, "EWG lowers LUMO of dienophile → faster cycloaddition."),
    mcq("Diels–Alder stereochemistry with respect to the dienophile:", ["Racemizes the dienophile", "Suprafacial — cis substituents stay cis in product", "Inverts all stereocenters", "Random"], 1, "Concerted suprafacial [4+2] preserves dienophile cis/trans geometry in the ring."),
    mcq("The Diels–Alder reaction is:", ["Stepwise ionic", "Concerted pericyclic", "Radical only", "SN2"], 1, "One-step concerted mechanism; no intermediates."),
    mcq("1,3-butadiene + maleic anhydride (heat) gives:", ["Open-chain diol", "Cyclohexene derivative (adduct)", "Two alkenes", "Polymer only"], 1, "Classic Diels–Alder → substituted cyclohexene (here with anhydride bridge)."),
    mcq("Why is 1,4-addition often favored at high temperature?", ["It is faster", "The conjugated 1,4 product is thermodynamically more stable", "1,2 is impossible", "Entropy only"], 1, "Thermodynamic control: more substituted/conjugated alkene is more stable."),
    mcq("Which diene cannot undergo Diels–Alder easily?", ["Cyclopentadiene", "s-trans locked diene in a ring", "Isoprene (s-cis accessible)", "1,3-butadiene"], 1, "If s-cis is inaccessible (locked trans), [4+2] is slow or forbidden."),
    mcq("Electron-rich diene + electron-poor dienophile is favored because:", ["HOMO–LUMO interaction is symmetry-allowed and energy-matched", "It is antiaromatic", "Only radicals react", "EDG blocks all reactivity"], 0, "Normal electron demand Diels–Alder: diene HOMO + dienophile LUMO."),
]

PRACTICE["nucleophilic-aromatic-substitution"] = [
    mcq("NAS on chlorobenzene without EWGs is:", ["Very fast", "Essentially impossible under normal conditions", "Faster than EAS", "Radical only"], 1, "Simple aryl halides need strong EWGs ortho/para to halide for NAS."),
    mcq("The NAS intermediate is called:", ["Carbocation", "Meisenheimer complex (anionic σ complex)", "Benzyne only", "Nitrene"], 1, "Nu attacks ipso → tetrahedral Meisenheimer; LG leaves."),
    mcq("p-Nitrochlorobenzene + NaOH gives substitution because:", ["NO2 activates by resonance for NAS", "Chlorine is an EDG", "It is SN2 on sp3 carbon", "Only heat matters"], 0, "EWG ortho/para to Cl stabilizes Meisenheimer; enables NAS."),
    mcq("Toluene side chain (benzylic CH3) + hot KMnO4 gives:", ["Benzyl alcohol", "Benzoic acid", "Toluene unchanged", "Benzaldehyde only"], 1, "Benzylic oxidation with KMnO4 → aromatic carboxylic acid (any alkyl side chain → COOH)."),
    mcq("Benzylic bromination of toluene uses:", ["Br2/FeBr3 (EAS)", "NBS, hν (radical)", "NaOH", "SN2 with NaBr"], 1, "Radical allylic/benzylic: NBS + light."),
    mcq("NAS differs from EAS because:", ["Electrophile attacks in NAS", "Nucleophile replaces leaving group on electron-poor ring", "It requires Lewis acid", "Aromaticity is never restored"], 1, "NAS: Nu replaces LG; ring must be activated by EWGs."),
    mcq("Which is NOT required for aryl halide NAS?", ["EWG ortho or para to halide", "Strong nucleophile", "Meisenheimer intermediate", "Lewis acid catalyst like FeCl3"], 3, "FeCl3 is for EAS electrophile generation, not standard NAS."),
    mcq("Chlorobenzene + NaNH2 (very strong base) can form benzyne. This is:", ["Standard NAS", "Elimination–addition (benzyne mechanism)", "EAS", "SN1"], 1, "Without EWG, strong base can eliminate to benzyne then add Nu."),
    mcq("If both –NH2 and –NO2 are on the ring, which directs new NAS?", ["NH2 (ortho/para director)", "NO2 (meta, deactivating, but activates NAS when ortho/para to Cl)", "Neither", "Both equally for NAS"], 1, "For NAS, EWG like NO2 ortho/para to leaving group is key; NH2 is activating for EAS not NAS on halide."),
    mcq("Product of NAS: p-chloronitrobenzene + methoxide:", ["Anisole (–OCH3 replaces Cl)", "Nitration product", "Reduction to aniline only", "No reaction"], 0, "Methoxide displaces Cl when NO2 activates ring → p-nitroanisole."),
]


def mki(title, desc, vid):
    return {"title": title, "description": desc, "videoId": vid}


ENRICH = {}

ENRICH["resonance-acid-base-review"] = {
    "mustKnowItems": [
        mki("Resonance structures basics", "Only π bonds and lone pairs move; atoms stay fixed.", "_S-Dxnv-VLs"),
        mki("Drawing resonance structures", "Practice curved arrows without moving σ bonds.", "4G_jHoFMRpA"),
        mki("pKa and acid strength", "Lower pKa = stronger acid; use tables to set equilibrium.", "MnWWJVRbdXg"),
        mki("EWG/EDG effects on acidity", "Withdrawers stabilize anions; donors destabilize them.", "9N4AuX5oK-o"),
    ],
    "overviewVideoId": "_S-Dxnv-VLs",
    "heroDiagram": {
        "cardTitle": "Acid–Base Equilibrium",
        "cardSubtitle": "Stronger acid + stronger base → weaker acid + weaker base",
        "centerLine1": "H–A  +  :B  ⇌  A⁻  +  H–B⁺",
        "centerLine2": "Compare pKa(HA) vs pKa(HB⁺) to predict direction",
        "reagentCaption": "Key",
        "reagentBold": "pKa table",
    },
}

ENRICH["substitution-elimination-nmr-review"] = {
    "mustKnowItems": [
        mki("SN1 vs SN2 overview", "Substrate and nucleophile strength decide the pathway.", "5EGnJiLtfPs"),
        mki("E1 vs E2 reactions", "Base strength and anti-periplanar geometry for E2.", "KxMI9LY_fYA"),
        mki("Tosylate leaving groups", "TsCl activates –OH without breaking the C–O bond.", "Z-nVfpJ6gls"),
        mki("¹H NMR introduction", "Chemical shift, integration, splitting basics.", "SBir5wUS3Bo"),
        mki("NMR chemical shifts", "Table-driven predictions for common functional groups.", "K9s5UoFLn5E"),
        mki("IR spectroscopy", "O–H, C=O, and triple-bond regions as cross-checks.", "4L1sHhFaSXo"),
    ],
    "overviewVideoId": "5EGnJiLtfPs",
    "heroDiagram": {
        "cardTitle": "SN2 reaction",
        "cardSubtitle": "Backside attack at electrophilic carbon · primary RX favored",
        "centerLine1": "Nu:⁻ + R–X  →  Nu–R + X:⁻",
        "centerLine2": "Pair with δ (ppm) and coupling patterns in ¹H NMR",
        "reagentCaption": "Reagent",
        "reagentBold": "Strong Nu, 1° substrate",
    },
}

ENRICH["alkynes"] = {
    "mustKnowItems": [
        mki("Alkyne addition reactions", "Electrophiles can add once or twice; track equivalents.", "K07VceUan0k"),
        mki("Alkyne hydration (tautomerization)", "Hg²⁺-catalyzed Markovnikov hydration → keto tautomer.", "Yd9MFqJmyas"),
        mki("Lindlar's vs Na/NH3", "cis alkene vs trans alkene selective reductions.", "vJPKfTSJQaM"),
        mki("Acetylide anion reactions", "Terminal alkyne + strong base → SN2 on 1° halides.", "hS4WWJWQ3_Y"),
        mki("Oxidative cleavage", "KMnO4/O3 cleavage patterns for internal vs terminal alkynes.", "K07VceUan0k"),
        mki("Double addition of HX", "Markovnikov placement on each addition step.", "K07VceUan0k"),
    ],
    "overviewVideoId": "K07VceUan0k",
    "heroDiagram": {
        "cardTitle": "Alkyne hydration (Markovnikov)",
        "cardSubtitle": "Terminal alkyne → methyl ketone via enol tautomerization",
        "centerLine1": "RC≡CH + H₂O  →  [enol]  →  RC(=O)CH₃",
        "reagentCaption": "Reagent",
        "reagentBold": "HgSO₄, H₂SO₄, H₂O",
    },
}

ENRICH["grignard-reaction"] = {
    "mustKnowItems": [
        mki("Grignard reagent overview", "Formation, solvent, and handling (dry).", "Y9jAMdA7C1c"),
        mki("Grignard with carbonyl", "Addition to aldehyde/ketone/ester pathways and workup.", "8wXaRfFsRPs"),
        mki("Gilman reagents", "R₂CuLi: conjugate additions and selective couplings.", "6oOomzJzP6M"),
        mki("Incompatible functional groups", "Protic sites and acidic protons destroy the carbanion.", "8wXaRfFsRPs"),
        mki("CO2 → carboxylic acid", "After H₃O⁺, clean two-carbon homologation to acid.", "Y9jAMdA7C1c"),
    ],
    "overviewVideoId": "Y9jAMdA7C1c",
    "heroDiagram": {
        "cardTitle": "Grignard addition",
        "cardSubtitle": "Nucleophilic carbon attacks electrophilic carbonyl",
        "centerLine1": "R–MgBr + R′–CHO  →  R′–CH(OH)–R  (after H₃O⁺)",
        "reagentCaption": "Reagent",
        "reagentBold": "Mg, ether; then H₃O⁺",
    },
}

ENRICH["organohalides-radical"] = {
    "mustKnowItems": [
        mki("Radical halogenation", "Initiation, propagation, termination bookkeeping.", "rWoaT2NLQLA"),
        mki("NBS allylic bromination", "Selective allylic position; radical chain.", "vJPKfTSJQaM"),
        mki("Alcohol to alkyl halide", "PBr₃ vs SOCl₂ vs HX tradeoffs.", "3_kVUkXS2ds"),
        mki("Radical stability order", "Allylic/benzylic > 3° > 2° > 1°.", "rWoaT2NLQLA"),
    ],
    "overviewVideoId": "rWoaT2NLQLA",
    "heroDiagram": {
        "cardTitle": "Allylic bromination (NBS)",
        "cardSubtitle": "Selective bromination at the allylic position",
        "centerLine1": "[alkene–CH₂] + NBS, hν  →  [alkene–CHBr]",
        "reagentCaption": "Reagent",
        "reagentBold": "NBS, hν, CCl₄",
    },
}

ENRICH["conjugated-compounds-diels-alder"] = {
    "mustKnowItems": [
        mki("Conjugated dienes stability", "π overlap lowers energy vs isolated dienes.", "6QLnXPF16dA"),
        mki("1,2 vs 1,4 addition", "Kinetic vs thermodynamic control with temperature.", "bVbNRKkbVSA"),
        mki("Diels–Alder reaction", "s-cis diene + electron-deficient dienophile.", "Uy8A0SZZD_g"),
        mki("Diels–Alder stereochemistry", "Suprafacial [4+2] preserves dienophile geometry.", "3N5mM5HI-es"),
    ],
    "overviewVideoId": "Uy8A0SZZD_g",
    "heroDiagram": {
        "cardTitle": "Diels–Alder [4+2] cycloaddition",
        "cardSubtitle": "s-cis diene + dienophile → cyclohexene",
        "centerLine1": "diene (4π) + dienophile (2π, EWG)  →  cyclohexene",
        "reagentCaption": "Mechanism",
        "reagentBold": "Concerted · heat · stereospecific",
    },
}

ENRICH["aromaticity"] = {
    "mustKnowItems": [
        mki("Aromaticity and Hückel's rule", "4n+2 π electrons in a cyclic conjugated array.", "MFABFiMEGqQ"),
        mki("Aromatic ions", "Cyclopentadienyl anion vs tropylium cation patterns.", "gRm-A7SdNT0"),
        mki("Pyridine vs pyrrole basicity", "Where the lone pair lives relative to the π system.", "y4L97H_3lT4"),
        mki("Heterocycle electron counting", "Furan/thiophene/pyrrole π bookkeeping.", "MFABFiMEGqQ"),
    ],
    "overviewVideoId": "MFABFiMEGqQ",
    "heroDiagram": {
        "cardTitle": "Hückel's rule",
        "cardSubtitle": "Cyclic + planar + conjugated + 4n+2 π e⁻ = aromatic",
        "centerLine1": "Benzene 6π  |  cyclobutadiene 4π (anti)  |  COT tub (non)",
        "reagentCaption": "Rule",
        "reagentBold": "4n+2 π electrons",
    },
}

ENRICH["electrophilic-aromatic-substitution"] = {
    "mustKnowItems": [
        mki("EAS overview", "σ complex then fast deprotonation to restore aromaticity.", "B8bQBLHkBiQ"),
        mki("Halogenation of benzene", "X₂ + Lewis acid generates electrophilic halogen.", "K_5B0TBUOQA"),
        mki("Nitration of benzene", "HNO₃/H₂SO₄ → NO₂⁺ electrophile.", "PJ6VEbDGjis"),
        mki("Friedel–Crafts alkylation", "Carbocation chemistry; rearrangement risk.", "SxGWnfFMrq4"),
        mki("Friedel–Crafts acylation", "Ketone product; no carbocation rearrangement.", "9G5nQi4kD0g"),
        mki("Directing effects", "Ortho/para vs meta patterns from resonance.", "V0bdQFrUzgE"),
    ],
    "overviewVideoId": "B8bQBLHkBiQ",
    "heroDiagram": {
        "cardTitle": "EAS mechanism",
        "cardSubtitle": "Step 1 slow (lose aromaticity) → Step 2 fast (restore)",
        "centerLine1": "Ar–H + E⁺  →  [arenium]  →  Ar–E + H⁺",
        "reagentCaption": "Catalyst",
        "reagentBold": "Lewis acid generates E⁺",
    },
}

ENRICH["nucleophilic-aromatic-substitution"] = {
    "mustKnowItems": [
        mki("Nucleophilic aromatic substitution", "Meisenheimer intermediate; EWG activation.", "DAbRxRV-3-4"),
        mki("Side-chain oxidation (KMnO4)", "Benzylic oxidation to carboxylic acids.", "lBJc9ij5ZLU"),
        mki("Benzylic halogenation", "Radical bromination at benzylic positions.", "vJPKfTSJQaM"),
        mki("NAS vs reduction routes", "When you can keep NO₂ adjacent to NH₂.", "DAbRxRV-3-4"),
    ],
    "overviewVideoId": "DAbRxRV-3-4",
    "heroDiagram": {
        "cardTitle": "NAS mechanism",
        "cardSubtitle": "Anionic σ-complex — EWGs ortho/para to the leaving group",
        "centerLine1": "Ar–X + Nu:⁻  →  [Meisenheimer]  →  Ar–Nu + X:⁻",
        "reagentCaption": "Requirement",
        "reagentBold": "EWG ortho/para to X",
    },
}

ENRICH["alcohols-phenols"] = {
    "mustKnowItems": [
        mki("Alcohol oxidation (PCC / Dess–Martin)", "1° → aldehyde; 2° → ketone; stop before acid.", "K07VceUan0k"),
        mki("NaBH₄ vs LiAlH₄", "Scope of carbonyl reductions and ester behavior.", "PJ4Kq3GXOOU"),
        mki("Tosylate formation", "TsCl/pyridine; retention at stereocenter.", "Z-nVfpJ6gls"),
        mki("Phenol acidity", "Resonance stabilization of phenoxide.", "2IKb_yVhL3E"),
    ],
    "overviewVideoId": "K07VceUan0k",
    "heroDiagram": {
        "cardTitle": "Alcohol oxidation",
        "cardSubtitle": "Primary → aldehyde → acid | secondary → ketone",
        "centerLine1": "R–CH₂–OH  →  R–CHO  →  R–COOH",
        "reagentCaption": "Reagent",
        "reagentBold": "PCC or CrO₃ (context-dependent)",
    },
}

ENRICH["ethers-epoxides"] = {
    "mustKnowItems": [
        mki("Williamson ether synthesis", "Alkoxide + 1° RX; choose roles to avoid E2.", "ojVhITKMtSA"),
        mki("Epoxide synthesis (mCPBA)", "Syn epoxidation from alkene.", "8Ydm-HHJoF0"),
        mki("Epoxide ring opening (acid/base)", "Regioselectivity: acid vs base pathways.", "0fNuDJPIiPA"),
        mki("Ether cleavage", "HBr/HI mechanisms and nucleophile strength.", "ojVhITKMtSA"),
    ],
    "overviewVideoId": "0fNuDJPIiPA",
    "heroDiagram": {
        "cardTitle": "Epoxide ring opening",
        "cardSubtitle": "Acid: more substituted C · Base: less substituted C",
        "centerLine1": "[epoxide] + Nu:  →(acid) more sub.  |  →(base) less sub.",
        "reagentCaption": "Epoxide prep",
        "reagentBold": "mCPBA on alkene",
    },
}

ENRICH["aldehydes-ketones"] = {
    "mustKnowItems": [
        mki("Nucleophilic addition overview", "Carbonyl electrophilicity and sterics.", "MQsPeQBjqmM"),
        mki("Cyanohydrin formation", "CN⁻ addition; acid/base catalysis.", "pTLM_5RJCQ4"),
        mki("Imine and enamine formation", "1° vs 2° amine outcomes; pH window.", "TZtkZRsXkc8"),
        mki("Wolff–Kishner reduction", "Hydrazone then strong base/heat.", "T4r7eBpwsQk"),
        mki("Acetal formation", "Protection/deprotection equilibrium control.", "nC5XJLN3WjE"),
        mki("Wittig reaction", "Phosphonium ylide forms new C=C.", "xHfb0dRBDRs"),
    ],
    "overviewVideoId": "MQsPeQBjqmM",
    "heroDiagram": {
        "cardTitle": "Nucleophilic addition to carbonyl",
        "cardSubtitle": "Nu attacks electrophilic carbonyl carbon",
        "centerLine1": "C=O + Nu:⁻  →  Nu–C–O⁻  →  Nu–C–OH (after H₃O⁺)",
        "reagentCaption": "Selectivity",
        "reagentBold": "Aldehyde > ketone",
    },
}

ENRICH["carboxylic-acids-derivatives"] = {
    "mustKnowItems": [
        mki("Carboxylic acid overview", "Acidity trends and derivative interconversions.", "zWJ3_3hVxb8"),
        mki("Nucleophilic acyl substitution", "Tetrahedral intermediate and LG basicity.", "jSCQpMmDzrE"),
        mki("Fischer esterification", "Equilibrium control with water/alcohol.", "B28_pfN_4l8"),
        mki("Acid chloride synthesis (SOCl₂)", "–COOH → –COCl; SO₂/HCl byproducts.", "cSmKPsJebbU"),
        mki("Ester reactions", "Transesterification, hydrolysis, reduction patterns.", "ZApKjLKKXvk"),
        mki("Amide reactions", "Hydrolysis difficulty vs esters/chlorides.", "R_L_mJTrLvQ"),
    ],
    "overviewVideoId": "jSCQpMmDzrE",
    "heroDiagram": {
        "cardTitle": "Nucleophilic acyl substitution",
        "cardSubtitle": "Reactivity: acid chloride > anhydride > ester > amide",
        "centerLine1": "R–C(=O)–Y + Nu  →  [tetrahedral]  →  R–C(=O)–Nu + Y⁻",
        "reagentCaption": "Key idea",
        "reagentBold": "Weaker base LG → faster",
    },
}

# User-provided practice + video overrides (content quality pass)
from orgochem2_content_overrides import PRACTICE_OVERRIDES, ENRICH_VIDEO_PATCHES

PRACTICE.update(PRACTICE_OVERRIDES)
for slug, patch in ENRICH_VIDEO_PATCHES.items():
    if slug in ENRICH:
        ENRICH[slug]["overviewVideoId"] = patch["overviewVideoId"]
        ENRICH[slug]["mustKnowItems"] = patch["mustKnowItems"]

# attach practice arrays
for slug in ENRICH:
    ENRICH[slug]["practiceMcqs"] = PRACTICE[slug]


def emit_mcq(m):
    opts = ", ".join(json.dumps(o) for o in m["options"])
    return f"mcq({json.dumps(m['question'])}, [{opts}] as [string, string, string, string], {m['answerIndex']}, {json.dumps(m['explanation'])})"


def emit_mki(mi):
    return f"m({json.dumps(mi['title'])}, {json.dumps(mi['description'])}, {json.dumps(mi['videoId'])})"


lines = []
lines += [
    'import type { Topic } from "./curriculum";',
    'import type { TopicMustKnowItem, TopicPracticeMcq, TopicHeroDiagram, TopicVideo } from "./curriculum";',
    "",
    "export type OrgChem2Enrichment = {",
    "  mustKnowItems: TopicMustKnowItem[];",
    "  practiceMcqs: TopicPracticeMcq[];",
    "  heroDiagram: TopicHeroDiagram;",
    "  overviewVideoId: string;",
    "};",
    "",
    "function m(title: string, description: string, videoId: string): TopicMustKnowItem {",
    "  return { title, description, videoId };",
    "}",
    "",
    "function mcq(question: string, options: [string, string, string, string], answerIndex: 0 | 1 | 2 | 3, explanation: string): TopicPracticeMcq {",
    "  return { question, options, answerIndex, explanation };",
    "}",
    "",
    "function mainVideo(topicTitle: string, id: string): TopicVideo[] {",
    "  const url = `https://www.youtube.com/watch?v=${id}`;",
    "  const thumbnail = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;",
    "  return [{",
    "    topic: topicTitle,",
    '    subtopic: "Video tutorial",',
    "    title: `${topicTitle} — overview`,",
    '    channel: "YouTube",',
    "    url,",
    "    thumbnail,",
    '    whyUseful: "Primary reference clip for this topic.",',
    '    level: "CHM 222",',
    '    length: "Variable",',
    '    bestTime: "Active study",',
    '    useType: "Lecture supplement",',
    "  }];",
    "}",
    "",
]

lines.append("export const ORGOCHEM2_ENRICHMENT: Record<string, OrgChem2Enrichment> = {")

for slug, data in ENRICH.items():
    lines.append(f'  "{slug}": {{')
    lines.append("    mustKnowItems: [")
    for mi in data["mustKnowItems"]:
        lines.append(f"      {emit_mki(mi)},")
    lines.append("    ],")
    lines.append("    practiceMcqs: [")
    for pm in data["practiceMcqs"]:
        lines.append(f"      {emit_mcq(pm)},")
    lines.append("    ],")
    hd = data["heroDiagram"]
    lines.append("    heroDiagram: {")
    for k in ["cardTitle", "cardSubtitle", "centerLine1", "centerLine2", "reagentCaption", "reagentBold"]:
        if k == "centerLine2" and not hd.get("centerLine2"):
            continue
        v = hd.get(k)
        if v is None:
            continue
        lines.append(f"      {k}: {json.dumps(v)},")
    lines.append("    },")
    lines.append(f'    overviewVideoId: {json.dumps(data["overviewVideoId"])},')
    lines.append("  },")

lines.append("};")
lines.append("")
lines.append("export function applyOrgChem2Enrichment(topics: Topic[]): Topic[] {")
lines.append("  return topics.map((t) => {")
lines.append("    const e = ORGOCHEM2_ENRICHMENT[t.slug];")
lines.append("    if (!e) return t;")
lines.append("    return {")
lines.append("      ...t,")
lines.append("      mustKnowItems: e.mustKnowItems,")
lines.append("      mustKnow: e.mustKnowItems.map((x) => `${x.title}: ${x.description}`),")
lines.append("      practiceMcqs: e.practiceMcqs,")
lines.append("      heroDiagram: e.heroDiagram,")
lines.append("      overviewVideoId: e.overviewVideoId,")
lines.append("      bestVideos: mainVideo(t.title, e.overviewVideoId),")
lines.append("    };")
lines.append("  });")
lines.append("}")
lines.append("")

OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
print("Wrote", OUT, "bytes", OUT.stat().st_size)
