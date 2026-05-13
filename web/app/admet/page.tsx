"use client";

import { useState } from "react";
import Link from "next/link";
import { apiUrl } from "../lib/api";
import { OpBadge, OpPanel, OpSpinner, ToolPageLayout } from "../components/op";

export default function AdmetAiPage() {
  const [smiles, setSmiles] = useState("CC(=O)Nc1ccc(O)cc1");
  const [smilesB, setSmilesB] = useState("CC(C)Cc1ccc(cc1)C(C)C(=O)O");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [outJson, setOutJson] = useState("");

  async function runPredict() {
    setErr("");
    setLoading(true);
    setOutJson("");
    try {
      const res = await fetch(apiUrl("/admet/predict"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ smiles }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setOutJson(JSON.stringify(data, null, 2));
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  async function runCompare() {
    setErr("");
    setLoading(true);
    setOutJson("");
    try {
      const res = await fetch(apiUrl("/admet/compare"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ smiles_a: smiles, smiles_b: smilesB }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setOutJson(JSON.stringify(data, null, 2));
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPageLayout
      eyebrow="ADMET-AI"
      title="SMILES → ADMET / physchem"
      subtitle="Uses ADMET-AI (TDC-trained models) via POST /admet/predict and /admet/compare. First server request can take a long time while models load."
      actions={
        <Link className="btn" href="/">
          Home
        </Link>
      }
    >
      <OpPanel title="SMILES">
        <label className="subtle" style={{ display: "block", marginBottom: 6 }}>
          Molecule A
        </label>
        <textarea
          className="input"
          rows={3}
          value={smiles}
          onChange={(e) => setSmiles(e.target.value)}
          style={{ width: "100%", fontFamily: "var(--font-mono)", fontSize: 13 }}
          spellCheck={false}
        />
        <label className="subtle" style={{ display: "block", marginTop: 12, marginBottom: 6 }}>
          Molecule B (compare)
        </label>
        <textarea
          className="input"
          rows={3}
          value={smilesB}
          onChange={(e) => setSmilesB(e.target.value)}
          style={{ width: "100%", fontFamily: "var(--font-mono)", fontSize: 13 }}
          spellCheck={false}
        />
      </OpPanel>

      <OpPanel title="Run">
        <div className="opFieldRow">
          <button type="button" className="btn btnPrimary" onClick={() => void runPredict()} disabled={loading}>
            POST /admet/predict
          </button>
          <button type="button" className="btn btnPrimary" onClick={() => void runCompare()} disabled={loading}>
            POST /admet/compare
          </button>
        </div>
        {loading ? <OpSpinner label="Running ADMET-AI (first run may take ~1 min)…" /> : null}
        {err ? <OpBadge tone="warn">{err}</OpBadge> : null}
      </OpPanel>

      {outJson ? (
        <OpPanel title="Response">
          <pre
            style={{
              margin: 0,
              fontSize: 11,
              lineHeight: 1.45,
              overflow: "auto",
              maxHeight: 480,
              padding: 12,
              background: "var(--panel-2)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)",
            }}
          >
            {outJson}
          </pre>
        </OpPanel>
      ) : null}
    </ToolPageLayout>
  );
}
