"use client";

import { useState, useRef } from "react";

type NMRType = "1H" | "13C" | null;
type AnalysisResult = {
  moleculeType?: string;
  functionalGroups?: string[];
  signals?: Array<{
    ppm: number;
    integration?: number;
    multiplicity?: string;
    assignment?: string;
  }>;
  structure?: string;
  answer?: string;
};

export default function NMRStudio() {
  const [nmrType, setNMRType] = useState<NMRType>(null);
  const [spectrumFile, setSpectrumFile] = useState<File | null>(null);
  const [spectrumPreview, setSpectrumPreview] = useState<string>("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [questionType, setQuestionType] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSpectrumFile(file);
    setAnalysisResult(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setSpectrumPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!spectrumFile || !nmrType) return;

    setAnalyzing(true);
    setAnalysisResult(null);

    // Simulate analysis - in production, this would call an API
    setTimeout(() => {
      const mockResult: AnalysisResult = {
        moleculeType: nmrType === "1H" ? "Aromatic compound with aldehyde" : "Carbonyl-containing compound",
        functionalGroups: nmrType === "1H" 
          ? ["Aromatic ring", "Aldehyde", "Alkyl chain"]
          : ["Carbonyl", "Aromatic carbons", "Alkyl carbons"],
        signals: nmrType === "1H"
          ? [
              { ppm: 9.8, integration: 1, multiplicity: "singlet", assignment: "Aldehyde proton" },
              { ppm: 7.2, integration: 5, multiplicity: "multiplet", assignment: "Aromatic protons" },
              { ppm: 2.3, integration: 3, multiplicity: "singlet", assignment: "Methyl group" }
            ]
          : [
              { ppm: 192.5, assignment: "Aldehyde carbon" },
              { ppm: 135.2, assignment: "Aromatic carbons" },
              { ppm: 21.3, assignment: "Methyl carbon" }
            ],
        answer: questionType 
          ? generateAnswer(questionType, nmrType)
          : "Upload a spectrum and select a question type to get specific analysis."
      };
      setAnalysisResult(mockResult);
      setAnalyzing(false);
    }, 2000);
  };

  const generateAnswer = (type: string, nmr: "1H" | "13C"): string => {
    if (nmr === "1H") {
      switch (type) {
        case "identify-signals":
          return "The spectrum shows 3 distinct signals: a singlet at 9.8 ppm (1H, aldehyde), a multiplet at 7.2 ppm (5H, aromatic), and a singlet at 2.3 ppm (3H, methyl).";
        case "integration":
          return "Integration ratios: 1:5:3. This corresponds to 1 aldehyde proton, 5 aromatic protons, and 3 methyl protons. Total = 9 protons.";
        case "multiplicity":
          return "The aldehyde appears as a singlet (no neighboring protons). The aromatic region shows a multiplet (complex coupling). The methyl group is a singlet (no adjacent protons).";
        case "chemical-shift":
          return "9.8 ppm (downfield) indicates aldehyde due to electron-withdrawing effect. 7.2 ppm is typical aromatic region. 2.3 ppm is alkyl region, slightly downfield due to benzylic position.";
        case "structure":
          return "Based on the signals, this appears to be benzaldehyde (C6H5CHO) with an additional methyl group, possibly 4-methylbenzaldehyde.";
        default:
          return "Analysis complete. Review the identified signals and functional groups above.";
      }
    } else {
      switch (type) {
        case "signal-counting":
          return "The spectrum shows 3 unique carbon environments, indicating 3 types of chemically distinct carbons in the molecule.";
        case "carbon-type":
          return "Carbon types identified: 1 carbonyl carbon (192.5 ppm), aromatic carbons (135.2 ppm), and alkyl carbon (21.3 ppm).";
        case "chemical-shift":
          return "192.5 ppm is characteristic of aldehyde carbonyl. 135.2 ppm is typical for aromatic carbons. 21.3 ppm indicates an sp3 carbon, likely benzylic methyl.";
        case "structure":
          return "The 13C NMR suggests a benzaldehyde derivative with a methyl substituent, consistent with 4-methylbenzaldehyde structure.";
        default:
          return "Analysis complete. Review the identified carbon types above.";
      }
    }
  };

  return (
    <div style={{ display: "grid", gap: 24 }}>
      {/* Header */}
      <div style={{
        padding: 24,
        background: "linear-gradient(135deg, rgba(0, 122, 255, 0.08) 0%, rgba(88, 86, 214, 0.08) 100%)",
        borderRadius: 20,
        border: "1px solid rgba(0, 122, 255, 0.2)"
      }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.5px" }}>
          NMR Studio
        </h1>
        <p style={{ fontSize: 16, color: "rgba(0, 0, 0, 0.7)", lineHeight: 1.6 }}>
          Upload your NMR spectrum and get instant analysis. Identify signals, interpret chemical shifts, 
          determine multiplicity, and solve structure determination problems.
        </p>
      </div>

      {/* NMR Type Selection */}
      <div style={{
        padding: 20,
        background: "white",
        borderRadius: 16,
        border: "1px solid rgba(0, 0, 0, 0.08)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)"
      }}>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
          Select NMR Type
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="button"
            onClick={() => {
              setNMRType("1H");
              setAnalysisResult(null);
            }}
            style={{
              flex: 1,
              padding: 20,
              borderRadius: 12,
              border: `2px solid ${nmrType === "1H" ? "#007AFF" : "rgba(0, 0, 0, 0.1)"}`,
              background: nmrType === "1H" ? "rgba(0, 122, 255, 0.08)" : "white",
              cursor: "pointer",
              fontSize: 16,
              fontWeight: 600,
              transition: "all 0.2s ease"
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>¹H NMR</div>
            <div style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.6)" }}>
              Proton Nuclear Magnetic Resonance
            </div>
          </button>
          <button
            type="button"
            onClick={() => {
              setNMRType("13C");
              setAnalysisResult(null);
            }}
            style={{
              flex: 1,
              padding: 20,
              borderRadius: 12,
              border: `2px solid ${nmrType === "13C" ? "#007AFF" : "rgba(0, 0, 0, 0.1)"}`,
              background: nmrType === "13C" ? "rgba(0, 122, 255, 0.08)" : "white",
              cursor: "pointer",
              fontSize: 16,
              fontWeight: 600,
              transition: "all 0.2s ease"
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>¹³C NMR</div>
            <div style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.6)" }}>
              Carbon-13 Nuclear Magnetic Resonance
            </div>
          </button>
        </div>
      </div>

      {/* File Upload */}
      {nmrType && (
        <div style={{
          padding: 20,
          background: "white",
          borderRadius: 16,
          border: "1px solid rgba(0, 0, 0, 0.08)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)"
        }}>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
            Upload {nmrType === "1H" ? "Proton" : "Carbon-13"} NMR Spectrum
          </div>
          
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: "40px 20px",
              border: "2px dashed rgba(0, 122, 255, 0.3)",
              borderRadius: 12,
              background: "rgba(0, 122, 255, 0.04)",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#007AFF";
              e.currentTarget.style.background = "rgba(0, 122, 255, 0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(0, 122, 255, 0.3)";
              e.currentTarget.style.background = "rgba(0, 122, 255, 0.04)";
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.jdx,.jcamp"
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />
            {spectrumPreview ? (
              <div>
                <img
                  src={spectrumPreview}
                  alt="Spectrum preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: 300,
                    borderRadius: 8,
                    marginBottom: 12
                  }}
                />
                <div style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.6)" }}>
                  {spectrumFile?.name}
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📄</div>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
                  Click to upload spectrum
                </div>
                <div style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.6)" }}>
                  Supports images (PNG, JPG) or JCAMP files (.jdx, .jcamp)
                </div>
              </div>
            )}
          </div>

          {spectrumFile && (
            <>
              {/* Question Type Selection */}
              <div style={{ marginTop: 24 }}>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
                  What would you like to analyze?
                </div>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 12,
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                    fontSize: 15,
                    background: "white"
                  }}
                >
                  <option value="">Select analysis type...</option>
                  {nmrType === "1H" ? (
                    <>
                      <option value="identify-signals">Identify signals and assign protons</option>
                      <option value="integration">Integration and proton ratios</option>
                      <option value="multiplicity">Multiplicity interpretation (n+1 rule)</option>
                      <option value="chemical-shift">Chemical shift reasoning</option>
                      <option value="coupling">Coupling constants and geometry</option>
                      <option value="equivalence">Equivalent vs non-equivalent protons</option>
                      <option value="structure">Structure determination</option>
                      <option value="peak-prediction">Predict spectrum for a molecule</option>
                    </>
                  ) : (
                    <>
                      <option value="signal-counting">Count unique carbon environments</option>
                      <option value="carbon-type">Identify carbon types (sp, sp², sp³)</option>
                      <option value="chemical-shift">Chemical shift assignment</option>
                      <option value="quaternary">Quaternary carbon identification</option>
                      <option value="structure">Structure matching</option>
                      <option value="prediction">Predict ¹³C NMR spectrum</option>
                    </>
                  )}
                </select>
              </div>

              {/* Analyze Button */}
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={analyzing || !questionType}
                style={{
                  width: "100%",
                  marginTop: 16,
                  padding: 16,
                  borderRadius: 12,
                  border: "none",
                  background: analyzing || !questionType
                    ? "rgba(0, 0, 0, 0.1)"
                    : "linear-gradient(135deg, #007AFF, #5856D6)",
                  color: analyzing || !questionType ? "rgba(0, 0, 0, 0.4)" : "white",
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: analyzing || !questionType ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                {analyzing ? "Analyzing..." : "Analyze Spectrum"}
              </button>
            </>
          )}
        </div>
      )}

      {/* Analysis Results */}
      {analysisResult && (
        <div style={{
          padding: 24,
          background: "white",
          borderRadius: 16,
          border: "1px solid rgba(52, 199, 89, 0.3)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)"
        }}>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: "#34C759" }}>
            ✓ Analysis Complete
          </div>

          {analysisResult.moleculeType && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(0, 0, 0, 0.6)", marginBottom: 8 }}>
                Molecule Type
              </div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>
                {analysisResult.moleculeType}
              </div>
            </div>
          )}

          {analysisResult.functionalGroups && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(0, 0, 0, 0.6)", marginBottom: 8 }}>
                Functional Groups Identified
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {analysisResult.functionalGroups.map((fg, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "6px 12px",
                      background: "rgba(0, 122, 255, 0.1)",
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#007AFF"
                    }}
                  >
                    {fg}
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysisResult.signals && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(0, 0, 0, 0.6)", marginBottom: 12 }}>
                Signals Identified
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                {analysisResult.signals.map((signal, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: 16,
                      background: "rgba(0, 0, 0, 0.02)",
                      borderRadius: 12,
                      border: "1px solid rgba(0, 0, 0, 0.08)"
                    }}
                  >
                    <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                      <div style={{ fontSize: 18, fontWeight: 700, color: "#007AFF" }}>
                        {signal.ppm} ppm
                      </div>
                      {signal.integration && (
                        <div style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.7)" }}>
                          Integration: {signal.integration}H
                        </div>
                      )}
                      {signal.multiplicity && (
                        <div style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.7)" }}>
                          Multiplicity: {signal.multiplicity}
                        </div>
                      )}
                    </div>
                    {signal.assignment && (
                      <div style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.8)", marginTop: 8 }}>
                        <strong>Assignment:</strong> {signal.assignment}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysisResult.answer && (
            <div style={{
              padding: 16,
              background: "rgba(0, 122, 255, 0.06)",
              borderRadius: 12,
              border: "1px solid rgba(0, 122, 255, 0.2)"
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#007AFF", marginBottom: 8 }}>
                Analysis Answer
              </div>
              <div style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(0, 0, 0, 0.9)" }}>
                {analysisResult.answer}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
