"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { apiUrl } from "../lib/api";
import { OpBadge, OpPanel, OpSpinner, ToolPageLayout } from "../components/op";

type DrugItem = { drug_id: string; display_name: string; dose_demo_mg: number };

export default function PharmaSimDemoPage() {
  const [drugs, setDrugs] = useState<DrugItem[]>([]);
  const [drugId, setDrugId] = useState("acetaminophen");
  const [compareB, setCompareB] = useState("demo_high_risk");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [predictJson, setPredictJson] = useState<string>("");
  const [simulateJson, setSimulateJson] = useState<string>("");

  const loadDrugs = useCallback(async () => {
    try {
      const res = await fetch(apiUrl("/pharmasim/drugs"), { cache: "no-store" });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setDrugs(data.items || []);
    } catch {
      setDrugs([]);
    }
  }, []);

  useEffect(() => {
    void loadDrugs();
  }, [loadDrugs]);

  async function runPredict() {
    setErr("");
    setLoading(true);
    setPredictJson("");
    try {
      const res = await fetch(apiUrl("/predict"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drug_id: drugId, weight_kg: 70 }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setPredictJson(JSON.stringify(data, null, 2));
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  async function runSimulate() {
    setErr("");
    setLoading(true);
    setSimulateJson("");
    try {
      const res = await fetch(apiUrl("/simulate"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drug_id: drugId, hours: 24, steps: 48 }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setSimulateJson(JSON.stringify(data, null, 2));
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  async function runCompare() {
    setErr("");
    setLoading(true);
    setPredictJson("");
    setSimulateJson("");
    try {
      const res = await fetch(apiUrl("/compare"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drug_id_a: drugId, drug_id_b: compareB, hours: 24 }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setPredictJson(JSON.stringify(data, null, 2));
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPageLayout
      eyebrow="Demo API"
      title="PharmaSim endpoints"
      subtitle="Calls your FastAPI /predict, /simulate, and /compare. Educational presets only—see disclaimer in each response."
      actions={
        <Link className="btn" href="/">
          Home
        </Link>
      }
    >
      <OpPanel title="Preset drugs">
        <div className="opFieldRow" style={{ flexWrap: "wrap" }}>
          {drugs.map((d) => (
            <button key={d.drug_id} type="button" className="btn" onClick={() => setDrugId(d.drug_id)}>
              {d.display_name}
            </button>
          ))}
        </div>
        <div className="subtle" style={{ marginTop: 10 }}>
          Selected: <strong style={{ color: "var(--text)" }}>{drugId}</strong>
        </div>
      </OpPanel>

      <OpPanel title="Run requests">
        <div className="opFieldRow">
          <button type="button" className="btn btnPrimary" onClick={() => void runPredict()} disabled={loading}>
            POST /predict
          </button>
          <button type="button" className="btn btnPrimary" onClick={() => void runSimulate()} disabled={loading}>
            POST /simulate
          </button>
        </div>
        <div style={{ marginTop: 12 }}>
          <div className="subtle" style={{ marginBottom: 6 }}>
            Compare second drug
          </div>
          <select className="input" value={compareB} onChange={(e) => setCompareB(e.target.value)} style={{ maxWidth: 280 }}>
            {drugs.map((d) => (
              <option key={d.drug_id} value={d.drug_id}>
                {d.display_name}
              </option>
            ))}
          </select>
          <button type="button" className="btn" style={{ marginLeft: 10 }} onClick={() => void runCompare()} disabled={loading}>
            POST /compare
          </button>
        </div>
        {loading ? <OpSpinner label="Calling API…" /> : null}
        {err ? <OpBadge tone="warn">{err}</OpBadge> : null}
      </OpPanel>

      {(predictJson || simulateJson) && (
        <OpPanel title="Response">
          <pre
            style={{
              margin: 0,
              fontSize: 11,
              lineHeight: 1.45,
              overflow: "auto",
              maxHeight: 420,
              padding: 12,
              background: "var(--panel-2)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)",
            }}
          >
            {predictJson || simulateJson}
          </pre>
        </OpPanel>
      )}
    </ToolPageLayout>
  );
}
