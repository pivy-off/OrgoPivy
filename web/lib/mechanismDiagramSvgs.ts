/** Large, readable mechanism schematics (inline SVG) per topic + step. */

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

function frame(title: string, subtitle: string, inner: string): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 320" role="img" aria-label="${esc(title)}">
  <defs>
    <linearGradient id="mfBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#eef2ff"/>
      <stop offset="100%" stop-color="#f0fdf4"/>
    </linearGradient>
    <marker id="mfArrB" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L10,3 L0,6 z" fill="#2563eb"/>
    </marker>
    <marker id="mfArrR" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L10,3 L0,6 z" fill="#dc2626"/>
    </marker>
  </defs>
  <rect width="880" height="320" rx="16" fill="url(#mfBg)" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="28" y="36" font-size="18" font-weight="800" fill="#0f172a">${esc(title)}</text>
  <text x="28" y="58" font-size="13" fill="#64748b">${esc(subtitle)}</text>
  ${inner}
</svg>`.trim();
}

function benzene(cx: number, cy: number, r: number, label: string, charge?: string): string {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(" ");
  const ch = charge
    ? `<text x="${cx}" y="${cy + 4}" text-anchor="middle" font-size="16" font-weight="800" fill="#dc2626">${esc(charge)}</text>`
    : "";
  return `
    <polygon points="${pts}" fill="none" stroke="#1e293b" stroke-width="3"/>
    <circle cx="${cx}" cy="${cy}" r="3" fill="#1e293b"/>
    <text x="${cx}" y="${cy - r - 14}" text-anchor="middle" font-size="13" font-weight="700" fill="#334155">${esc(label)}</text>
    ${ch}`;
}

function carbonyl(cx: number, cy: number, label: string): string {
  return `
    <line x1="${cx - 40}" y1="${cy}" x2="${cx + 40}" y2="${cy}" stroke="#1e293b" stroke-width="4"/>
    <line x1="${cx - 8}" y1="${cy - 28}" x2="${cx + 32}" y2="${cy - 8}" stroke="#1e293b" stroke-width="4"/>
    <text x="${cx}" y="${cy + 36}" text-anchor="middle" font-size="13" font-weight="700">${esc(label)}</text>`;
}

function arrow(x1: number, y1: number, x2: number, y2: number, color: "b" | "r" = "b"): string {
  const m = color === "b" ? "mfArrB" : "mfArrR";
  const stroke = color === "b" ? "#2563eb" : "#dc2626";
  return `<path d="M ${x1} ${y1} Q ${(x1 + x2) / 2} ${y1 - 40} ${x2} ${y2}" fill="none" stroke="${stroke}" stroke-width="3" marker-end="url(#${m})"/>`;
}

const BY_SLUG_STEP: Record<string, (step: number) => string> = {
  "substitution-elimination-nmr-review": (step) => {
    if (step === 0) {
      return frame(
        "SN2 — backside attack",
        "Nu attacks σ*; inversion at stereocenter",
        `
        <rect x="80" y="120" width="70" height="50" rx="8" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
        <text x="115" y="152" text-anchor="middle" font-size="14" font-weight="800" fill="#1d4ed8">Nu⁻</text>
        ${arrow(150, 145, 260, 145)}
        <rect x="270" y="110" width="90" height="70" rx="8" fill="#fff" stroke="#1e293b" stroke-width="2"/>
        <text x="315" y="140" text-anchor="middle" font-size="13" font-weight="700">C–LG</text>
        <text x="315" y="162" text-anchor="middle" font-size="11" fill="#64748b">(R configuration)</text>
        <text x="400" y="145" font-size="22" font-weight="800">→</text>
        <rect x="440" y="120" width="70" height="50" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
        <text x="475" y="152" text-anchor="middle" font-size="14" font-weight="800" fill="#15803d">Nu–R</text>
        <text x="560" y="152" font-size="14" fill="#64748b">+ LG⁻</text>
        `,
      );
    }
    if (step === 1) {
      return frame(
        "E2 — anti elimination",
        "Base removes β-H anti to leaving group",
        `
        <text x="120" y="150" font-size="14" font-weight="800" fill="#7c3aed">B:</text>
        ${arrow(160, 140, 240, 160, "r")}
        <line x1="280" y1="150" x2="380" y2="150" stroke="#1e293b" stroke-width="4"/>
        <line x1="280" y1="138" x2="380" y2="138" stroke="#1e293b" stroke-width="4"/>
        <text x="330" y="130" text-anchor="middle" font-size="12">β-H</text>
        <text x="400" y="155" font-size="20">→</text>
        <line x1="450" y1="155" x2="550" y2="155" stroke="#16a34a" stroke-width="5"/>
        <text x="500" y="140" text-anchor="middle" font-size="13" font-weight="700" fill="#15803d">C=C</text>
        `,
      );
    }
    return frame("¹H NMR", "Chemical shift, integration, splitting (n+1)", `
      <rect x="100" y="100" width="680" height="120" rx="10" fill="#fff" stroke="#94a3b8"/>
      <line x1="140" y1="180" x2="740" y2="180" stroke="#1e293b" stroke-width="2"/>
      <line x1="200" y1="120" x2="200" y2="180" stroke="#2563eb" stroke-width="3"/>
      <text x="200" y="110" text-anchor="middle" font-size="11" fill="#2563eb">δ ~1.1 triplet</text>
      <line x1="400" y1="100" x2="400" y2="180" stroke="#dc2626" stroke-width="3"/>
      <text x="400" y="90" text-anchor="middle" font-size="11" fill="#dc2626">δ ~3.4 quartet</text>
      <line x1="600" y1="130" x2="600" y2="180" stroke="#7c3aed" stroke-width="3"/>
      <text x="600" y="118" text-anchor="middle" font-size="11" fill="#7c3aed">acid O–H broad</text>
    `);
  },

  "electrophilic-aromatic-substitution": (step) => {
    if (step === 0) {
      return frame(
        "EAS step 1 — σ complex",
        "Arenium ion; aromaticity lost temporarily",
        `
        ${benzene(200, 170, 50, "Ar–H")}
        <text x="290" y="175" font-size="22" font-weight="800">+ E⁺</text>
        ${arrow(330, 165, 420, 165)}
        ${benzene(520, 170, 50, "σ complex", "+")}
        <text x="640" y="175" font-size="13" fill="#64748b">charge delocalized</text>
        `,
      );
    }
    return frame(
      "EAS step 2 — restore aromaticity",
      "Base removes H; aromatic ring returns",
      `
      ${benzene(180, 170, 48, "[Ar–E]⁺", "+")}
      <text x="300" y="175" font-size="14" font-weight="700">+ B:</text>
      ${arrow(360, 165, 450, 165, "r")}
      ${benzene(520, 170, 50, "Ar–E")}
      <text x="640" y="175" font-size="13">+ BH⁺</text>
      `,
    );
  },

  alkynes: (step) => {
    if (step === 0) {
      return frame(
        "Alkyne + electrophile",
        "π bond attacks H⁺ (or Hg²⁺-activated water)",
        `
        <line x1="120" y1="160" x2="220" y2="160" stroke="#1e293b" stroke-width="5"/>
        <line x1="120" y1="148" x2="220" y2="148" stroke="#1e293b" stroke-width="5"/>
        <text x="170" y="130" text-anchor="middle" font-size="14" font-weight="800">C≡C</text>
        <text x="260" y="165" font-size="20">+</text>
        <text x="300" y="172" font-size="16" font-weight="800">H⁺</text>
        ${arrow(360, 155, 460, 155)}
        <line x1="500" y1="155" x2="600" y2="155" stroke="#2563eb" stroke-width="5"/>
        <line x1="500" y1="143" x2="580" y2="143" stroke="#2563eb" stroke-width="4"/>
        <text x="550" y="125" text-anchor="middle" font-size="12" fill="#2563eb">vinyl cation / enol</text>
        `,
      );
    }
    return frame(
      "Keto–enol tautomerization",
      "Enol → more stable carbonyl product",
      `
      <text x="140" y="165" font-size="15" font-weight="700">Enol</text>
      <line x1="200" y1="155" x2="280" y2="155" stroke="#1e293b" stroke-width="4"/>
      <text x="240" y="140" font-size="12">C=C–OH</text>
      <text x="320" y="165" font-size="22">⇌</text>
      ${carbonyl(480, 155, "Ketone / aldehyde")}
      `,
    );
  },

  "grignard-reaction": (step) => {
    if (step === 0) {
      return frame(
        "Grignard addition",
        "Carbanion attacks carbonyl carbon",
        `
        <text x="100" y="155" font-size="14" font-weight="800" fill="#2563eb">R⁻ (from RMgX)</text>
        ${arrow(200, 150, 320, 150)}
        ${carbonyl(400, 155, "C=O")}
        <text x="520" y="165" font-size="22">→</text>
        <text x="560" y="155" font-size="14" font-weight="700">alkoxide</text>
        <text x="560" y="178" font-size="12" fill="#64748b">C–O⁻, new C–C bond</text>
        `,
      );
    }
    return frame("Acid workup", "Protonate alkoxide → alcohol", `
      <text x="200" y="160" font-size="14">R₂C(O⁻)–R</text>
      <text x="380" y="160" font-size="14" font-weight="700">+ H₃O⁺</text>
      <text x="500" y="160" font-size="22">→</text>
      <text x="560" y="155" font-size="15" font-weight="800" fill="#16a34a">R₂C(OH)–R</text>
    `);
  },

  "organohalides-radical": (step) => {
    if (step === 0) {
      return frame("Initiation", "Light/heat homolyzes X–X → 2 X·", `
        <text x="200" y="150" font-size="16" font-weight="800">X–X</text>
        <text x="300" y="150" font-size="14" fill="#64748b">hν / Δ</text>
        <text x="380" y="150" font-size="22">→</text>
        <text x="460" y="145" font-size="15" font-weight="800" fill="#dc2626">2 X·</text>
      `);
    }
    return frame("Propagation", "H abstraction then X· addition", `
      <text x="120" y="140" font-size="14" font-weight="800" fill="#dc2626">X·</text>
      <text x="170" y="140" font-size="14">+ R–H</text>
      <text x="280" y="140" font-size="22">→</text>
      <text x="340" y="140" font-size="14">HX + R·</text>
      <text x="500" y="180" font-size="14" font-weight="800" fill="#dc2626">X·</text>
      <text x="550" y="180" font-size="14">+ R· → R–X</text>
    `);
  },

  "conjugated-compounds-diels-alder": () =>
    frame(
      "Diels–Alder [4+2]",
      "Concerted cycloaddition; s-cis diene required",
      `
      <path d="M 100 200 L 160 140 L 220 200 L 160 260 Z" fill="none" stroke="#1e293b" stroke-width="3"/>
      <text x="160" y="205" text-anchor="middle" font-size="12" font-weight="700">diene</text>
      <text x="280" y="200" font-size="22">+</text>
      ${carbonyl(380, 195, "dienophile")}
      <text x="520" y="200" font-size="22">→</text>
      <polygon points="580,160 640,140 700,160 700,240 640,260 580,240" fill="#dcfce7" stroke="#16a34a" stroke-width="3"/>
      <text x="640" y="205" text-anchor="middle" font-size="12" font-weight="800">cyclohexene</text>
      `,
    ),

  "nucleophilic-aromatic-substitution": (step) => {
    if (step === 0) {
      return frame(
        "NAS — Meisenheimer complex",
        "Nu⁻ attacks ipso C; anion stabilized by EWG",
        `
        ${benzene(200, 170, 45, "Ar–LG")}
        <text x="120" y="120" font-size="12" font-weight="700" fill="#dc2626">NO₂ (EWG)</text>
        <text x="300" y="175" font-size="14" font-weight="700">+ Nu⁻</text>
        ${arrow(380, 165, 470, 165)}
        ${benzene(560, 170, 45, "σ adduct", "−")}
        `,
      );
    }
    return frame("Elimination of LG", "Aromaticity restored", `
      ${benzene(220, 170, 45, "[Ar–Nu]", "−")}
      <text x="360" y="175" font-size="22">→</text>
      ${benzene(480, 170, 45, "Ar–Nu")}
      <text x="600" y="175" font-size="13">+ LG⁻</text>
    `);
  },

  "aldehydes-ketones": (step) => {
    if (step === 0) {
      return frame(
        "Nucleophilic addition",
        "Nu: attacks electrophilic carbonyl carbon",
        `
        <text x="120" y="155" font-size="14" font-weight="800" fill="#2563eb">Nu:</text>
        ${arrow(180, 150, 300, 150)}
        ${carbonyl(380, 155, "C=O")}
        <text x="520" y="160" font-size="22">→</text>
        <text x="580" y="150" font-size="13" font-weight="700">tetrahedral alkoxide</text>
        `,
      );
    }
    return frame("Protonation / dehydration", "Alcohol, imine, or acetal depending on Nu", `
      <text x="200" y="160" font-size="14">alkoxide</text>
      <text x="360" y="160" font-size="14">+ H⁺ or −H₂O</text>
      <text x="520" y="160" font-size="22">→</text>
      <text x="600" y="155" font-size="14" font-weight="800" fill="#16a34a">product</text>
    `);
  },

  "carboxylic-acids-derivatives": (step) => {
    if (step === 0) {
      return frame(
        "Acyl substitution — addition",
        "Nu attacks acyl carbon; tetrahedral intermediate",
        `
        <text x="100" y="150" font-size="14" font-weight="800" fill="#2563eb">Nu:</text>
        ${arrow(160, 145, 280, 145)}
        <text x="320" y="145" font-size="14" font-weight="700">R–C(=O)–LG</text>
        <text x="500" y="150" font-size="22">→</text>
        <text x="560" y="140" font-size="13">tetrahedral intermediate</text>
        `,
      );
    }
    return frame("Acyl substitution — elimination", "Re-form C=O; expel leaving group", `
      <text x="180" y="160" font-size="13">tetrahedral</text>
      <text x="380" y="160" font-size="22">→</text>
      <text x="460" y="155" font-size="14" font-weight="700">R–C(=O)–Nu</text>
      <text x="620" y="155" font-size="13">+ LG⁻</text>
    `);
  },

  "alcohols-phenols": () =>
    frame(
      "Alcohol oxidation",
      "Remove α-H; increase oxidation state at carbon",
      `
      <text x="140" y="155" font-size="14" font-weight="700">R–CH₂OH</text>
      <text x="320" y="155" font-size="14" fill="#64748b">oxidant</text>
      <text x="420" y="155" font-size="22">→</text>
      ${carbonyl(540, 150, "R–CHO")}
      <text x="680" y="155" font-size="12" fill="#64748b">→ acid if strong</text>
      `,
    ),

  "ethers-epoxides": (step) => {
    if (step === 0) {
      return frame(
        "Acid-catalyzed epoxide opening",
        "Attack more substituted carbon (more δ+)",
        `
        <polygon points="380,120 440,160 380,200 320,160" fill="#fef3c7" stroke="#d97706" stroke-width="3"/>
        <text x="380" y="165" text-anchor="middle" font-size="12" font-weight="800">epoxide</text>
        <text x="500" y="165" font-size="14" font-weight="700">+ Nu:</text>
        ${arrow(560, 160, 650, 160)}
        <text x="720" y="155" font-size="13">anti addition</text>
        `,
      );
    }
    return frame(
      "Base-catalyzed epoxide opening",
      "SN2 at less hindered carbon",
      `
      <text x="120" y="160" font-size="14" font-weight="800" fill="#2563eb">Nu⁻</text>
      ${arrow(180, 155, 300, 155)}
      <polygon points="380,120 440,160 380,200 320,160" fill="#fef3c7" stroke="#d97706" stroke-width="3"/>
      <text x="520" y="165" font-size="22">→</text>
      <text x="600" y="155" font-size="13" font-weight="700">Nu–C–C–O⁻</text>
      `,
    );
  },
};

export function getMechanismDiagramSvg(slug: string, stepIndex: number): string {
  const fn = BY_SLUG_STEP[slug];
  if (fn) return fn(stepIndex);
  return frame(
    "Mechanism overview",
    "Follow curved arrows from electron rich → electron poor",
    `
    <text x="140" y="170" font-size="14" font-weight="800" fill="#2563eb">Nu / π</text>
    ${arrow(220, 165, 360, 165)}
    <text x="420" y="170" font-size="14" font-weight="800">E⁺ / C=O</text>
    ${arrow(500, 165, 640, 165, "r")}
    <text x="700" y="170" font-size="14" font-weight="800" fill="#16a34a">Product</text>
    `,
  );
}
