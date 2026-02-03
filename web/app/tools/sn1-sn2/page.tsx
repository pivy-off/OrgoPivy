"use client";

import { useState } from "react";
import Link from "next/link";

type Substrate = "methyl" | "primary" | "secondary" | "tertiary";
type NuBase = "strong-nu-weak-base" | "strong-base" | "weak-both";
type Solvent = "polar-aprotic" | "polar-protic";

export default function SN1SN2Page() {
  const [substrate, setSubstrate] = useState<Substrate | "">("");
  const [nuBase, setNuBase] = useState<NuBase | "">("");
  const [solvent, setSolvent] = useState<Solvent | "">("");
  const [result, setResult] = useState<string | null>(null);

  const decide = () => {
    if (!substrate || !nuBase || !solvent) {
      setResult("Select all options.");
      return;
    }
    const s = substrate as Substrate;
    const n = nuBase as NuBase;
    const sol = solvent as Solvent;

    if (s === "methyl" || s === "primary") {
      if (n === "strong-base" && s === "primary") {
        setResult("E2 favored (primary can do SN2 or E2; strong base → elimination). Stereochemistry: anti-periplanar. Zaitsev product unless bulky base.");
      } else {
        setResult("SN2 favored. Stereochemistry: inversion. Primary/methyl favor backside attack.");
      }
      return;
    }
    if (s === "tertiary") {
      if (n === "strong-nu-weak-base") {
        setResult("SN1 favored (or E1 with heat). Tertiary can't do SN2. Stereochemistry: racemization (50/50). Carbocation forms first.");
      } else if (n === "strong-base") {
        setResult("E2 favored. Bulky base → Hofmann (less substituted alkene). Tertiary can't do SN2.");
      } else {
        setResult("SN1/E1 mix. Weak nucleophile/base, polar protic favors. Racemization for SN1; no stereochemistry requirement for E1.");
      }
      return;
    }
    if (s === "secondary") {
      if (sol === "polar-aprotic" && n === "strong-nu-weak-base") {
        setResult("SN2 favored. Polar aprotic + strong nucleophile. Stereochemistry: inversion.");
      } else if (n === "strong-base") {
        setResult("E2 favored. Strong base favors elimination. Zaitsev product (more substituted alkene) unless bulky base.");
      } else if (sol === "polar-protic" && n === "weak-both") {
        setResult("SN1/E1 mix. Secondary can do all four. Polar protic + weak Nu/base → carbocation pathway. Racemization if SN1.");
      } else {
        setResult("Secondary: consider all four. Polar aprotic + strong Nu → SN2. Strong base → E2. Polar protic + weak → SN1/E1.");
      }
    }
  };

  return (
    <main className="stack" style={{ maxWidth: 640, margin: "0 auto", padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Link href="/tools" className="subtle" style={{ fontSize: 14, textDecoration: "none" }}>
          ← Back to Tools
        </Link>
        <h1 className="h1" style={{ marginTop: 12, marginBottom: 8 }}>SN1 / SN2 / E1 / E2 Decision Engine</h1>
        <p className="subtle" style={{ fontSize: 15 }}>
          Substrate, nucleophile/base, solvent → predicted pathway, stereochemistry, major product.
        </p>
      </div>

      <div style={{ display: "grid", gap: 24 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Substrate</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {(["methyl", "primary", "secondary", "tertiary"] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setSubstrate(opt)}
                style={{
                  padding: "12px 18px",
                  borderRadius: "var(--radius-sm)",
                  border: substrate === opt ? "2px solid var(--blue)" : "1px solid var(--border)",
                  background: substrate === opt ? "rgba(0,122,255,0.1)" : "var(--panel)",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Nucleophile / Base</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <button
              type="button"
              onClick={() => setNuBase("strong-nu-weak-base")}
              style={{
                padding: "12px 18px",
                borderRadius: "var(--radius-sm)",
                border: nuBase === "strong-nu-weak-base" ? "2px solid var(--blue)" : "1px solid var(--border)",
                background: nuBase === "strong-nu-weak-base" ? "rgba(0,122,255,0.1)" : "var(--panel)",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Strong Nu, weak base (I⁻, Br⁻, CN⁻)
            </button>
            <button
              type="button"
              onClick={() => setNuBase("strong-base")}
              style={{
                padding: "12px 18px",
                borderRadius: "var(--radius-sm)",
                border: nuBase === "strong-base" ? "2px solid var(--blue)" : "1px solid var(--border)",
                background: nuBase === "strong-base" ? "rgba(0,122,255,0.1)" : "var(--panel)",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Strong base (t-BuO⁻, etc.)
            </button>
            <button
              type="button"
              onClick={() => setNuBase("weak-both")}
              style={{
                padding: "12px 18px",
                borderRadius: "var(--radius-sm)",
                border: nuBase === "weak-both" ? "2px solid var(--blue)" : "1px solid var(--border)",
                background: nuBase === "weak-both" ? "rgba(0,122,255,0.1)" : "var(--panel)",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Weak both (H₂O, ROH)
            </button>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Solvent</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <button
              type="button"
              onClick={() => setSolvent("polar-aprotic")}
              style={{
                padding: "12px 18px",
                borderRadius: "var(--radius-sm)",
                border: solvent === "polar-aprotic" ? "2px solid var(--blue)" : "1px solid var(--border)",
                background: solvent === "polar-aprotic" ? "rgba(0,122,255,0.1)" : "var(--panel)",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Polar aprotic (DMSO, DMF, acetone)
            </button>
            <button
              type="button"
              onClick={() => setSolvent("polar-protic")}
              style={{
                padding: "12px 18px",
                borderRadius: "var(--radius-sm)",
                border: solvent === "polar-protic" ? "2px solid var(--blue)" : "1px solid var(--border)",
                background: solvent === "polar-protic" ? "rgba(0,122,255,0.1)" : "var(--panel)",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Polar protic (H₂O, ROH)
            </button>
          </div>
        </div>

        <button type="button" className="btn btnPrimary" onClick={decide} style={{ width: "100%" }}>
          Predict pathway
        </button>
      </div>

      {result && (
        <div
          style={{
            marginTop: 24,
            padding: 24,
            background: "rgba(0,122,255,0.06)",
            border: "1px solid rgba(0,122,255,0.2)",
            borderRadius: "var(--radius-md)",
            fontSize: 15,
            lineHeight: 1.6,
          }}
        >
          {result}
        </div>
      )}

      <div style={{ marginTop: 24, padding: 16, background: "var(--panel-2)", borderRadius: "var(--radius-sm)", fontSize: 13 }}>
        <strong>Rules:</strong> SN2 → inversion. SN1 → racemization. E2 → anti-periplanar. Primary → SN2 favored. Tertiary → no SN2. Bulky base → Hofmann.
      </div>
    </main>
  );
}
