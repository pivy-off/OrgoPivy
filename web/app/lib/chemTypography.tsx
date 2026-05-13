import type { ReactNode } from "react";

const UNICODE_SUBS: [RegExp, string][] = [
  [/H2O/g, "H₂O"],
  [/H2(?![₂0-9])/g, "H₂"],
  [/CO2/g, "CO₂"],
  [/NH3/g, "NH₃"],
  [/CH3/g, "CH₃"],
  [/CH2/g, "CH₂"],
  [/C2H/g, "C₂H"],
  [/NaNH2/g, "NaNH₂"],
  [/NaBH4/g, "NaBH₄"],
  [/LiAlH4/g, "LiAlH₄"],
  [/KMnO4/g, "KMnO₄"],
  [/HgSO4/g, "HgSO₄"],
  [/SOCl2/g, "SOCl₂"],
  [/PBr3/g, "PBr₃"],
  [/H2SO4/g, "H₂SO₄"],
  [/HNO3/g, "HNO₃"],
  [/H3O\+/g, "H₃O⁺"],
];

const BOLD_RE =
  /(SN1|SN2|E1|E2|NAS|EAS|PCC|TsCl|Grignard|Wittig|mCPBA|NBS|Friedel|Zaitsev|Hofmann|Markovnikov|anti-Markovnikov|Meisenheimer|Diels|Alder|Lindlar|Williamson|Wolff|Kishner|Schotten|Baumann|Gilman|Suzuki)/gi;

export function applyChemUnicode(text: string): string {
  let s = text;
  for (const [re, rep] of UNICODE_SUBS) {
    s = s.replace(re, rep);
  }
  return s;
}

/** Bold common reagent / reaction labels; unicode subscripts. */
export function ChemFormattedLine({ text }: { text: string }): ReactNode {
  const u = applyChemUnicode(text);
  const nodes: ReactNode[] = [];
  const re = new RegExp(BOLD_RE.source, BOLD_RE.flags);
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(u)) !== null) {
    if (m.index > last) {
      nodes.push(
        <span key={key++} className="chem-mono-inline">
          {u.slice(last, m.index)}
        </span>
      );
    }
    nodes.push(
      <strong key={key++} className="chem-reagent-strong">
        {m[0]}
      </strong>
    );
    last = m.index + m[0].length;
  }
  if (last < u.length) {
    nodes.push(
      <span key={key++} className="chem-mono-inline">
        {u.slice(last)}
      </span>
    );
  }
  return <span className="chem-line">{nodes}</span>;
}
