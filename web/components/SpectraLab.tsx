"use client";

import { useMemo, useState } from "react";
import { showToast } from "@/components/Toast";

export type SpectrumSpec = {
  id: string;
  label: string;
  type: "IR" | "NMR";
  peaks: { x: number; label: string; hint: string }[];
  correctGroups: string[];
};

const GROUPS = ["Alcohol O–H", "Carbonyl C=O", "Aromatic ring", "Alkyne C≡C", "Broad acid O–H (H-bonded)"];

export default function SpectraLab({ topicTitle }: { topicTitle: string }) {
  const spectra: SpectrumSpec[] = useMemo(
    () => [
      {
        id: "1",
        label: "Spectrum 1 — IR",
        type: "IR",
        peaks: [
          { x: 3300, label: "3300", hint: "Broad O–H / N–H region (watch H-bonding)" },
          { x: 1710, label: "1710", hint: "Strong C=O stretch — narrow and intense" },
        ],
        correctGroups: ["Carbonyl C=O", "Broad acid O–H (H-bonded)"],
      },
      {
        id: "2",
        label: "Spectrum 2 — IR",
        type: "IR",
        peaks: [{ x: 3000, label: "3000", hint: "sp² C–H stretches just above 3000 cm⁻¹" }],
        correctGroups: ["Aromatic ring"],
      },
      {
        id: "3",
        label: "Spectrum 3 — ¹H NMR",
        type: "NMR",
        peaks: [
          { x: 10, label: "δ 10", hint: "Aldehyde proton — downfield" },
          { x: 2.2, label: "δ 2.2", hint: "α to carbonyl — deshielded" },
        ],
        correctGroups: ["Carbonyl C=O"],
      },
      {
        id: "4",
        label: "Spectrum 4 — IR",
        type: "IR",
        peaks: [{ x: 2100, label: "2100", hint: "Weak alkyne C≡C stretch" }],
        correctGroups: ["Alkyne C≡C"],
      },
      {
        id: "5",
        label: "Spectrum 5 — IR",
        type: "IR",
        peaks: [{ x: 3350, label: "3350", hint: "Sharp-ish O–H for dilute/neat alcohol" }],
        correctGroups: ["Alcohol O–H"],
      },
    ],
    [],
  );

  const [si, setSi] = useState(0);
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const [popup, setPopup] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState<Record<string, boolean>>({});

  const spec = spectra[si];

  const toggle = (g: string) => {
    setPicked((p) => ({ ...p, [g]: !p[g] }));
  };

  const submit = () => {
    const chosen = new Set(GROUPS.filter((g) => picked[g]));
    const ok = spec.correctGroups.every((g) => chosen.has(g)) && chosen.size === spec.correctGroups.length;
    if (ok) {
      showToast("✅ Concept marked as known!");
      setDone((d) => ({ ...d, [spec.id]: true }));
      setScore((s) => s + 1);
    } else {
      const wrong = [...chosen].filter((g) => !spec.correctGroups.includes(g));
      const missing = spec.correctGroups.filter((g) => !chosen.has(g));
      window.alert(`Not quite.\nMissing: ${missing.join(", ") || "(none)"}\nIncorrect picks: ${wrong.join(", ") || "(none)"}`);
    }
  };

  const xMax = spec.type === "IR" ? 4000 : 12;
  const xMin = spec.type === "IR" ? 500 : 0;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 20, padding: 16, fontFamily: "var(--op-font-sans)" }}>
      <div style={{ flex: "1 1 320px", minWidth: 280 }}>
        <h2 style={{ marginTop: 0 }}>{spec.label}</h2>
        <p className="subtle">{topicTitle}</p>
        <svg viewBox={`0 0 400 220`} width="100%" height={220} style={{ background: "#fff", borderRadius: 12, border: "1px solid var(--op-border)" }}>
          <line x1="40" y1="180" x2="380" y2="180" stroke="#94a3b8" />
          <text x="200" y="210" textAnchor="middle" fontSize="11" fill="#64748b">
            {spec.type === "IR" ? "Wavenumber (cm⁻¹)" : "δ (ppm)"}
          </text>
          {spec.peaks.map((p) => {
            const nx = 40 + ((p.x - xMin) / (xMax - xMin)) * 340;
            return (
              <g key={p.label}>
                <line
                  x1={nx}
                  y1="40"
                  x2={nx}
                  y2="180"
                  stroke="#4F6EF7"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  style={{ cursor: "pointer" }}
                  onClick={() => setPopup(`${p.label}: ${p.hint}`)}
                />
                <text x={nx} y="195" textAnchor="middle" fontSize="10" fill="#334155">
                  {p.label}
                </text>
              </g>
            );
          })}
          <polyline points="40,120 120,90 200,140 300,100 380,130" fill="none" stroke="#0f172a" strokeWidth="2" />
        </svg>
        {popup ? (
          <div className="op-card op-fade-in" style={{ marginTop: 10, fontSize: 14 }}>
            {popup}
            <button type="button" className="op-btn-secondary" style={{ marginLeft: 8 }} onClick={() => setPopup(null)}>
              Close
            </button>
          </div>
        ) : null}
      </div>
      <div style={{ flex: "1 1 260px" }}>
        <h3>What functional groups do you see?</h3>
        {GROUPS.map((g) => (
          <label key={g} style={{ display: "block", marginBottom: 8, fontSize: 14 }}>
            <input type="checkbox" checked={!!picked[g]} onChange={() => toggle(g)} /> {g}
          </label>
        ))}
        <button type="button" className="op-btn-primary" style={{ marginTop: 12 }} onClick={submit}>
          Submit identification
        </button>
        <div style={{ marginTop: 16, fontWeight: 700 }}>
          Progress: {Object.keys(done).length}/5 identified correctly · Score {score}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
          {spectra.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={i === si ? "op-btn-primary" : "op-btn-secondary"}
              onClick={() => {
                setSi(i);
                setPicked({});
                setPopup(null);
              }}
            >
              Spectrum {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
