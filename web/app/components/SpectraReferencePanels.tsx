"use client";

type IrPeak = { x: number; w: number; label: string; broad?: boolean };
type HPeak = { ppm: number; label: string; h: number };

function IrTrace({ title, peaks, note }: { title: string; peaks: IrPeak[]; note: string }) {
  return (
    <div className="spectraRefCard">
      <div className="spectraRefTitle">{title}</div>
      <div className="spectraRefIrAxis">
        <span>4000</span>
        <span>2500</span>
        <span>1700</span>
        <span>1000</span>
      </div>
      <div className="spectraRefIrPlot" aria-hidden="true">
        <svg viewBox="0 0 400 120" className="spectraRefIrSvg">
          <line x1="0" y1="100" x2="400" y2="100" stroke="var(--border)" strokeWidth="1" />
          {peaks.map((p, i) => (
            <g key={i}>
              {p.broad ? (
                <ellipse cx={p.x} cy={55} rx={p.w} ry="38" fill="rgba(0,122,255,0.12)" stroke="var(--blue)" strokeWidth="1.5" />
              ) : (
                <line x1={p.x - p.w / 2} y1="100" x2={p.x + p.w / 2} y2="20" stroke="var(--blue)" strokeWidth="3" strokeLinecap="round" />
              )}
              <text x={p.x} y="112" textAnchor="middle" fontSize="9" fill="var(--muted)" fontWeight="700">
                {p.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <p className="spectraRefNote">{note}</p>
    </div>
  );
}

function HTrace({ title, peaks, note }: { title: string; peaks: HPeak[]; note: string }) {
  return (
    <div className="spectraRefCard">
      <div className="spectraRefTitle">{title}</div>
      <div className="spectraRefHAxis">
        <span>δ 14</span>
        <span>10</span>
        <span>6</span>
        <span>0</span>
      </div>
      <div className="spectraRefHPlot" aria-hidden="true">
        <svg viewBox="0 0 400 100" className="spectraRefHSvg">
          <line x1="20" y1="80" x2="380" y2="80" stroke="var(--border)" strokeWidth="1" />
          {peaks.map((p, i) => {
            const x = 380 - (p.ppm / 14) * 360;
            return (
              <g key={i}>
                <line x1={x} y1="80" x2={x} y2={30} stroke="var(--purple)" strokeWidth="2" />
                <text x={x} y="24" textAnchor="middle" fontSize="9" fontWeight="800" fill="var(--text)">
                  {p.ppm}
                </text>
                <text x={x} y="95" textAnchor="middle" fontSize="8" fill="var(--muted)">
                  {p.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="spectraRefNote">{note}</p>
    </div>
  );
}

export default function SpectraReferencePanels() {
  return (
    <section className="spectraRefSection" aria-labelledby="spectra-ref-heading">
      <h2 id="spectra-ref-heading" className="spectraRefHeading">
        Reference spectra (IR + ¹H cues)
      </h2>
      <p className="spectraRefLead">
        Use these schematic traces to connect peak positions to functional groups. Compare broad O–H, carbonyl position, and N–H stretches before uploading your own data.
      </p>
      <div className="spectraRefGrid">
        <IrTrace
          title="Carboxylic acid"
          peaks={[
            { x: 120, w: 55, label: "O–H 2500–3500 (broad)", broad: true },
            { x: 260, w: 14, label: "C=O ~1710" },
          ]}
          note="¹H: COOH proton δ 10–13 ppm, very broad. IR: H-bonded O–H smears the baseline; C=O still near 1710 cm⁻¹."
        />
        <IrTrace
          title="Aldehyde vs ketone (C=O stretch)"
          peaks={[
            { x: 255, w: 12, label: "R–CHO ~1725" },
            { x: 275, w: 12, label: "R₂C=O ~1715" },
          ]}
          note="Difference is small in IR; combine with ¹H: aldehyde C–H near δ 9–10 ppm (ketones lack that proton)."
        />
        <IrTrace
          title="Ester"
          peaks={[{ x: 270, w: 12, label: "C=O ~1735" }]}
          note="No broad acid O–H. Two C–O single-bond stretches near 1200–1300 cm⁻¹ (schematic omitted for clarity)."
        />
        <IrTrace
          title="Amine (1° / 2°)"
          peaks={[{ x: 200, w: 35, label: "N–H 3300–3500", broad: true }]}
          note="Primary shows a doublet-like pair of sharper bands; secondary one band. Tertiary amines lack N–H."
        />
      </div>
      <div className="spectraRefGrid" style={{ marginTop: 16 }}>
        <HTrace
          title="¹H — carboxylic acid O–H"
          peaks={[{ ppm: 12, label: "broad COOH", h: 40 }]}
          note="Very broad; may obscure nearby signals — do not mistake for solvent."
        />
        <HTrace
          title="¹H — aldehyde"
          peaks={[{ ppm: 9.8, label: "–CHO", h: 50 }]}
          note="Downfield one-proton signal; distinguish from aromatic multiplet by integration."
        />
      </div>
    </section>
  );
}
