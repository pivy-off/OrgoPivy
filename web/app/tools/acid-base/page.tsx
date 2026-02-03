"use client";

import { useState } from "react";
import Link from "next/link";

const ACIDS: { id: string; name: string; pka: number }[] = [
  { id: "h2so4", name: "H₂SO₄", pka: -3 },
  { id: "h3o", name: "H₃O⁺", pka: -1.7 },
  { id: "hf", name: "HF", pka: 3.2 },
  { id: "rcooh", name: "RCOOH", pka: 4.5 },
  { id: "h2co3", name: "H₂CO₃", pka: 6.4 },
  { id: "phenol", name: "Phenol", pka: 10 },
  { id: "h2o", name: "H₂O", pka: 15.7 },
  { id: "roh", name: "ROH", pka: 16 },
  { id: "rcech", name: "RC≡CH", pka: 25 },
  { id: "nh3", name: "NH₃", pka: 38 },
  { id: "alkane", name: "Alkane C-H", pka: 50 },
];

export default function AcidBasePage() {
  const [acid1, setAcid1] = useState("");
  const [acid2, setAcid2] = useState("");
  const [result, setResult] = useState<{
    stronger: string;
    weaker: string;
    favored: "left" | "right" | "equal";
    explanation: string;
  } | null>(null);

  const compare = () => {
    const a1 = ACIDS.find((a) => a.id === acid1);
    const a2 = ACIDS.find((a) => a.id === acid2);
    if (!a1 || !a2) {
      setResult(null);
      return;
    }
    const stronger = a1.pka < a2.pka ? a1 : a2;
    const weaker = a1.pka > a2.pka ? a1 : a2;
    const favored = a1.pka < a2.pka ? "right" : a1.pka > a2.pka ? "left" : "equal";
    setResult({
      stronger: stronger.name,
      weaker: weaker.name,
      favored,
      explanation: `Lower pKa = stronger acid. ${stronger.name} (pKa ${stronger.pka}) is stronger than ${weaker.name} (pKa ${weaker.pka}). Equilibrium favors the weaker acid side — conjugates of ${weaker.name} predominate.`,
    });
  };

  return (
    <main className="stack" style={{ maxWidth: 640, margin: "0 auto", padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Link href="/tools" className="subtle" style={{ fontSize: 14, textDecoration: "none" }}>
          ← Back to Tools
        </Link>
        <h1 className="h1" style={{ marginTop: 12, marginBottom: 8 }}>Acid–Base Intelligence Engine</h1>
        <p className="subtle" style={{ fontSize: 15 }}>
          Input two acids. Output: which side equilibrium favors, stronger vs weaker acid, conjugate pairs, pKa logic.
        </p>
      </div>

      <div style={{ padding: 24, background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Compare two acids</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <select
            value={acid1}
            onChange={(e) => setAcid1(e.target.value)}
            style={{
              padding: "12px 16px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)",
              background: "var(--panel-2)",
              fontSize: 15,
              minWidth: 140,
            }}
          >
            <option value="">Select acid 1</option>
            {ACIDS.map((a) => (
              <option key={a.id} value={a.id}>{a.name} (pKa {a.pka})</option>
            ))}
          </select>
          <span style={{ fontSize: 18, fontWeight: 700 }}>vs</span>
          <select
            value={acid2}
            onChange={(e) => setAcid2(e.target.value)}
            style={{
              padding: "12px 16px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)",
              background: "var(--panel-2)",
              fontSize: 15,
              minWidth: 140,
            }}
          >
            <option value="">Select acid 2</option>
            {ACIDS.map((a) => (
              <option key={a.id} value={a.id}>{a.name} (pKa {a.pka})</option>
            ))}
          </select>
          <button type="button" className="btn btnPrimary" onClick={compare}>
            Compare
          </button>
        </div>
      </div>

      {result && (
        <div
          style={{
            marginTop: 24,
            padding: 24,
            background: "rgba(0,122,255,0.06)",
            border: "1px solid rgba(0,122,255,0.2)",
            borderRadius: "var(--radius-md)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--blue)" }}>Stronger acid</div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{result.stronger}</div>
            <span style={{ color: "var(--muted)" }}>→</span>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--blue)" }}>Weaker acid</div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{result.weaker}</div>
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.6 }}>{result.explanation}</div>
          <div style={{ marginTop: 16, padding: 12, background: "var(--panel)", borderRadius: "var(--radius-sm)", fontSize: 13 }}>
            <strong>Rules:</strong> Equilibrium favors weaker acid (higher pKa). Conjugate base of stronger acid is weaker base. Negative charge = stronger base.
          </div>
        </div>
      )}

      <div style={{ marginTop: 32, padding: 20, background: "var(--panel-2)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Quick reference</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 13 }}>
          {ACIDS.map((a) => (
            <div key={a.id} style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{a.name}</span>
              <span style={{ fontWeight: 700 }}>pKa {a.pka}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
