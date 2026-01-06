"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ 
      padding: "40px 20px", 
      maxWidth: 1400, 
      margin: "0 auto",
      minHeight: "calc(100vh - 80px)"
    }}>
      <div style={{ 
        textAlign: "center", 
        marginBottom: 60,
        paddingTop: 20
      }}>
        <h1 style={{ 
          fontSize: 48, 
          fontWeight: 700, 
          letterSpacing: "-0.5px",
          marginBottom: 12,
          background: "linear-gradient(135deg, #007AFF 0%, #5856D6 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          OrgoPivy
        </h1>
        <p style={{ 
          fontSize: 18, 
          color: "rgba(0, 0, 0, 0.6)",
          fontWeight: 400,
          maxWidth: 600,
          margin: "0 auto"
        }}>
          Your student-centered Organic Chemistry learning platform. 
          Understand concepts clearly, practice effectively, and prepare for exams with confidence.
        </p>
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", 
        gap: 32,
        maxWidth: 1000,
        margin: "0 auto"
      }}>
        <Link href="/orgochem-1" style={{ textDecoration: "none" }}>
          <div style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            borderRadius: 24,
            padding: 48,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-8px)";
            e.currentTarget.style.boxShadow = "0 12px 40px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)";
          }}
          >
            <div style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 120,
              height: 120,
              background: "linear-gradient(135deg, rgba(0, 122, 255, 0.1) 0%, rgba(88, 86, 214, 0.1) 100%)",
              borderRadius: "0 24px 0 100%"
            }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#007AFF",
                marginBottom: 12,
                letterSpacing: "0.5px",
                textTransform: "uppercase"
              }}>
                Course I
              </div>
              <h2 style={{
                fontSize: 36,
                fontWeight: 700,
                marginBottom: 16,
                letterSpacing: "-0.5px",
                color: "#000"
              }}>
                OrgoChem I
              </h2>
              <p style={{
                fontSize: 16,
                lineHeight: 1.6,
                color: "rgba(0, 0, 0, 0.7)",
                marginBottom: 24
              }}>
                Foundations, stereochemistry, and reaction logic. Build your understanding step by step through 
                alkanes, cycloalkanes, stereochemistry, substitution and elimination reactions, alkenes, and spectroscopy.
              </p>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 15,
                fontWeight: 600,
                color: "#007AFF",
                marginTop: 8
              }}>
                View topics
                <span style={{ fontSize: 18 }}>→</span>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/orgochem-2" style={{ textDecoration: "none" }}>
          <div style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            borderRadius: 24,
            padding: 48,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-8px)";
            e.currentTarget.style.boxShadow = "0 12px 40px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)";
          }}
          >
            <div style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 120,
              height: 120,
              background: "linear-gradient(135deg, rgba(88, 86, 214, 0.1) 0%, rgba(0, 122, 255, 0.1) 100%)",
              borderRadius: "0 24px 0 100%"
            }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#5856D6",
                marginBottom: 12,
                letterSpacing: "0.5px",
                textTransform: "uppercase"
              }}>
                Course II
              </div>
              <h2 style={{
                fontSize: 36,
                fontWeight: 700,
                marginBottom: 16,
                letterSpacing: "-0.5px",
                color: "#000"
              }}>
                OrgoChem II
              </h2>
              <p style={{
                fontSize: 16,
                lineHeight: 1.6,
                color: "rgba(0, 0, 0, 0.7)",
                marginBottom: 24
              }}>
                Carbonyl logic, synthesis, and structure proof. Master advanced transformations including 
                alcohols, ethers, carbonyls, carboxylic acids, enolates, aromatic chemistry, and amines.
              </p>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 15,
                fontWeight: 600,
                color: "#5856D6",
                marginTop: 8
              }}>
                View topics
                <span style={{ fontSize: 18 }}>→</span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </main>
  );
}
