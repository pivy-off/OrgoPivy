/** Static inline SVG fragments for mechanism panel (trusted, no user input). */

function uid(slug: string, suffix: string): string {
  return `${slug.replace(/[^a-z0-9]+/gi, "_")}_${suffix}`;
}

export function getOrgChem2MechanismSupplementalSvg(slug: string): string | undefined {
  const map: Record<string, string> = {
    "substitution-elimination-nmr-review": easStyleScheme(slug, "SN2 backside", "Nu⁻", "C–LG", "Product + LG⁻"),
    alkynes: curvedArrowScheme(slug, "Alkyne π → H⁺", "Vinyl cation / enol", "Markovnikov placement"),
    "grignard-reaction": curvedArrowScheme(slug, "R⁻ (C–Mg) → C=O", "Tetrahedral alkoxide", "H₃O⁺ → alcohol"),
    "organohalides-radical": curvedArrowScheme(slug, "X· abstracts H", "Carbon radical", "Chain propagation"),
    "conjugated-compounds-diels-alder": curvedArrowScheme(slug, "Diene HOMO + dienophile LUMO", "Concerted [4+2]", "Cyclohexene framework"),
    "electrophilic-aromatic-substitution": curvedArrowScheme(slug, "Arene π → E⁺", "σ complex (+)", "Deprotonation → Ar–E"),
    "nucleophilic-aromatic-substitution": curvedArrowScheme(slug, "Nu⁻ → ipso-C", "Meisenheimer (–)", "Expel LG"),
    "alcohols-phenols": curvedArrowScheme(slug, "Oxidant abstracts α-H", "C=O forms", "Track 1° vs 2°"),
    "ethers-epoxides": curvedArrowScheme(slug, "Acid: Nu → +C", "Base: Nu → less hindered C", "Anti ring-open"),
    "aldehydes-ketones": curvedArrowScheme(slug, "Nu: → carbonyl C", "Alkoxide", "Protonate / dehydrate"),
    "carboxylic-acids-derivatives": curvedArrowScheme(slug, "Nu → acyl C", "Tetrahedral", "Re-form C=O, expel LG"),
  };
  return map[slug];
}

function curvedArrowScheme(slug: string, label: string, mid: string, foot: string): string {
  const g = uid(slug, "bg");
  const m = uid(slug, "mk");
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 220" role="img" aria-label="Mechanism overview with curved electron-flow arrows">
  <defs>
    <linearGradient id="${g}" x1="0" x2="1"><stop offset="0" stop-color="#007AFF" stop-opacity="0.08"/><stop offset="1" stop-color="#5856D6" stop-opacity="0.08"/></linearGradient>
    <marker id="${m}" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L10,3 L0,6 z" fill="#1d1d1f"/></marker>
  </defs>
  <rect width="800" height="220" rx="14" fill="url(#${g})" stroke="rgba(29,29,31,0.12)"/>
  <text x="24" y="36" font-size="15" font-weight="800" fill="#1d1d1f">Arrow-pushing overview</text>
  <text x="24" y="58" font-size="12" fill="rgba(29,29,31,0.55)">Nucleophile / electrophile / LG labels — full step list in cards below</text>
  <rect x="40" y="95" width="90" height="44" rx="10" fill="#fff" stroke="#1d1d1f" stroke-width="1.5"/>
  <text x="85" y="123" text-anchor="middle" font-size="13" font-weight="800">Nu</text>
  <path d="M 140 117 Q 200 60 280 117" fill="none" stroke="#007AFF" stroke-width="3" marker-end="url(#${m})"/>
  <rect x="290" y="95" width="110" height="44" rx="10" fill="#fff" stroke="#1d1d1f" stroke-width="1.5"/>
  <text x="345" y="123" text-anchor="middle" font-size="13" font-weight="800">E⁺ / C=O</text>
  <path d="M 410 117 Q 470 170 540 117" fill="none" stroke="#FF3B30" stroke-width="3" marker-end="url(#${m})"/>
  <rect x="550" y="95" width="90" height="44" rx="10" fill="#fff" stroke="#1d1d1f" stroke-width="1.5"/>
  <text x="595" y="123" text-anchor="middle" font-size="13" font-weight="800">Int.</text>
  <text x="24" y="188" font-size="13" font-weight="700" fill="#1d1d1f">${esc(label)}</text>
  <text x="24" y="206" font-size="12" fill="rgba(29,29,31,0.65)">${esc(mid)} → ${esc(foot)}</text>
</svg>`.trim();
}

function easStyleScheme(_slug: string, a: string, b: string, c: string, d: string): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" role="img" aria-label="Reaction scheme left to right">
  <rect width="800" height="200" rx="14" fill="#fafafa" stroke="rgba(29,29,31,0.1)"/>
  <text x="24" y="34" font-size="14" font-weight="800">Substrate → product (read left → right)</text>
  <text x="220" y="110" font-size="22" font-weight="900">${esc(a)}</text>
  <text x="340" y="110" font-size="26">→</text>
  <text x="400" y="110" font-size="22" font-weight="900">${esc(b)}</text>
  <text x="520" y="110" font-size="26">→</text>
  <text x="580" y="110" font-size="22" font-weight="900">${esc(c)}</text>
  <text x="24" y="170" font-size="12" fill="rgba(29,29,31,0.6)">${esc(d)}</text>
</svg>`.trim();
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
