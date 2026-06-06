/** Split a line-notation scheme into reactant / product for mechanism schematics. */
export function parseReactionScheme(structure: string): {
  reactant: string;
  product: string;
  reversible: boolean;
} {
  const reversible = /⇌|↔/.test(structure);
  const parts = structure.split(/\s*(?:→|⟶|->|⇌|↔)\s*/);
  if (parts.length >= 2) {
    return {
      reactant: parts[0].trim(),
      product: parts.slice(1).join(" → ").trim(),
      reversible,
    };
  }
  return { reactant: structure.trim(), product: "", reversible };
}

/** Pull "form …" / "break …" fragments from bonds text. */
export function parseBondChanges(bonds: string): { formed: string; broken: string } {
  const formed =
    bonds.match(/(?:form|forms)\s+([^.;]+)/i)?.[1]?.trim() ??
    bonds.split(/[.;]/)[0]?.trim() ??
    "—";
  const broken =
    bonds.match(/(?:break|breaks)\s+([^.;]+)/i)?.[1]?.trim() ??
    bonds.match(/(?:lose|loses)\s+([^.;]+)/i)?.[1]?.trim() ??
    "—";
  return { formed, broken };
}
