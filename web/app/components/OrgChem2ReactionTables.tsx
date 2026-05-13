type Row = { reagents: string; transform: string; notes: string; typeClass: string };

const TABLES: Record<string, { title: string; rows: Row[] }> = {
  "electrophilic-aromatic-substitution": {
    title: "Five classic EAS reactions",
    rows: [
      { reagents: "Br₂ / FeBr₃ (or AlBr₃)", transform: "Ar–H → Ar–Br", notes: "Lewis acid polarizes Br₂; bromonium-like attack on ring", typeClass: "rt-halogenation" },
      { reagents: "HNO₃ / H₂SO₄", transform: "Ar–H → Ar–NO₂", notes: "NO₂⁺ electrophile; meta-director when on ring", typeClass: "rt-nitration" },
      { reagents: "SO₃ / H₂SO₄", transform: "Ar–H → Ar–SO₃H", notes: "Reversible — useful as blocking/directing handle", typeClass: "rt-sulfonation" },
      { reagents: "R–Cl / AlCl₃", transform: "Ar–H → Ar–R", notes: "Carbocation chemistry; rearrangements possible", typeClass: "rt-fc-alkyl" },
      { reagents: "R–COCl / AlCl₃", transform: "Ar–H → Ar–COR", notes: "No rearrangement; ketone can be reduced to alkyl", typeClass: "rt-fc-acyl" },
    ],
  },
  "carboxylic-acids-derivatives": {
    title: "Nucleophilic acyl substitution — reactivity ladder",
    rows: [
      { reagents: "Acid chloride RCOCl", transform: "Most reactive acyl source", notes: "Best LG (Cl⁻); converts downward in ladder", typeClass: "rt-acyl-1" },
      { reagents: "Anhydride (RCO)₂O", transform: "RCO₂R′ + RCOOH", notes: "Good acylating agent; milder than acid chloride", typeClass: "rt-acyl-2" },
      { reagents: "Ester RCO₂R′", transform: "Amide / acid (with forcing)", notes: "Saponification: OH⁻ → carboxylate + alcohol", typeClass: "rt-acyl-3" },
      { reagents: "Carboxylic acid RCOOH", transform: "Fischer → ester (+H₂O)", notes: "Equilibrium; remove H₂O or use excess ROH", typeClass: "rt-acyl-4" },
      { reagents: "Amide RCONR′₂", transform: "Least reactive", notes: "Poor LG; needs strong conditions to hydrolyze", typeClass: "rt-acyl-5" },
    ],
  },
  "aldehydes-ketones": {
    title: "Nucleophilic addition at the carbonyl",
    rows: [
      { reagents: "HCN (catalytic base)", transform: "C=O → cyanohydrin", notes: "New C–C; nitrile reducible to amine", typeClass: "rt-add-1" },
      { reagents: "NaBH₄ then H₃O⁺", transform: "C=O → alcohol", notes: "Aldehyde → 1°; ketone → 2°", typeClass: "rt-add-2" },
      { reagents: "RMgX then H₃O⁺", transform: "C=O → alcohol", notes: "Aldehyde → 2°; ketone → 3°; anhydrous first", typeClass: "rt-add-3" },
      { reagents: "R–NH₂, pH ~4.5", transform: "C=O → imine", notes: "Schiff base; too acidic kills nucleophilicity", typeClass: "rt-add-4" },
      { reagents: "R₂NH", transform: "C=O → enamine", notes: "No N–H to lose; deprotonate α to N", typeClass: "rt-add-5" },
      { reagents: "Ph₃P=CHR (Wittig)", transform: "C=O → C=C", notes: "Alkene + Ph₃P=O byproduct", typeClass: "rt-add-6" },
    ],
  },
  "ethers-epoxides": {
    title: "Epoxide ring opening — acid vs base",
    rows: [
      { reagents: "H⁺ then H₂O (acid)", transform: "Protonate O → Nu attacks", notes: "Regio: more substituted C (better carbocation character)", typeClass: "rt-ep-a" },
      { reagents: "HO⁻ or RO⁻ (base)", transform: "SN2 at epoxide", notes: "Regio: less substituted C (backside, less steric clash)", typeClass: "rt-ep-b" },
      { reagents: "RMgX or RLi", transform: "Organometallic opening", notes: "Behaves like base pathway — less hindered carbon", typeClass: "rt-ep-c" },
    ],
  },
  "alcohols-phenols": {
    title: "Oxidation ladder (organic oxidation level)",
    rows: [
      { reagents: "Alkane R–CH₃", transform: "Lowest ox. level", notes: "Reference baseline", typeClass: "rt-ox-1" },
      { reagents: "1° alcohol R–CH₂OH", transform: "↑ one level", notes: "PCC / Dess–Martin → aldehyde; Cr(VI) → acid", typeClass: "rt-ox-2" },
      { reagents: "Aldehyde R–CHO", transform: "↑ from 1° alcohol", notes: "Stop here with mild oxidant only", typeClass: "rt-ox-3" },
      { reagents: "2° alcohol R₂CHOH", transform: "→ ketone", notes: "No further oxidation without C–C cleavage", typeClass: "rt-ox-4" },
      { reagents: "Carboxylic acid R–COOH", transform: "Highest in ladder", notes: "From 1° alcohol + strong oxidant", typeClass: "rt-ox-5" },
    ],
  },
};

export default function OrgChem2ReactionTables({ slug }: { slug: string }) {
  const t = TABLES[slug];
  if (!t) return null;

  return (
    <div className="orgochem2ReactionTableWrap">
      <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 12 }}>{t.title}</div>
      <div className="orgochem2ReactionGrid">
        {t.rows.map((r, i) => (
          <div key={i} className={`orgochem2ReactionCard ${r.typeClass}`}>
            <div className="orgochem2ReactionCardReagents">{r.reagents}</div>
            <div className="orgochem2ReactionCardArrow">{r.transform}</div>
            <div className="orgochem2ReactionCardNotes">{r.notes}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
