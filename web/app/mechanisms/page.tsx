"use client";

import Link from "next/link";
import { useMemo } from "react";
import { getAllMechanisms } from "./mechanisms-data";

export default function MechanismsIndexPage() {
  const mechanisms = useMemo(() => getAllMechanisms(), []);

  const orgochem1Mechanisms = useMemo(() => mechanisms.filter((m) => m.course === "orgochem-1"), [mechanisms]);
  const orgochem2Mechanisms = useMemo(() => mechanisms.filter((m) => m.course === "orgochem-2"), [mechanisms]);

  const getCategories = (mechs: typeof mechanisms) => {
    const cats = new Set(mechs.map((m) => m.category));
    return Array.from(cats).sort();
  };

  return (
    <main style={{ padding: "40px 20px", maxWidth: 1600, margin: "0 auto" }}>
      <div style={{ marginBottom: 50 }}>
        <h1 style={{ fontSize: 52, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.5px" }}>
          Reaction Mechanisms
        </h1>
        <p style={{ fontSize: 20, color: "var(--muted)", lineHeight: 1.6 }}>
          Interactive step-by-step mechanism visualizations with arrow pushing
        </p>
      </div>

      {/* OrgoChem I Section */}
      <div style={{ marginBottom: 60 }}>
        <div style={{ marginBottom: 30, paddingBottom: 16, borderBottom: "3px solid var(--blue)" }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 8, color: "var(--text)" }}>
            OrgoChem I
          </h2>
          <p style={{ fontSize: 16, color: "var(--muted)" }}>
            Substitution, elimination, alkene reactions, and carbonyl basics
          </p>
        </div>

        {getCategories(orgochem1Mechanisms).map((category) => {
          const categoryMechanisms = orgochem1Mechanisms.filter((m) => m.category === category);
          return (
            <div key={category} style={{ marginBottom: 40 }}>
              <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16, color: "var(--text)" }}>
                {category}
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                  gap: 24,
                }}
              >
                {categoryMechanisms.map((mechanism) => (
                <Link
                  key={mechanism.id}
                  href={`/mechanisms/${mechanism.id}`}
                  style={{
                    textDecoration: "none",
                    display: "block",
                  }}
                >
                  <div
                    className="card"
                    style={{
                      height: "100%",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)";
                    }}
                  >
                    <div className="cardInner" style={{ padding: 24 }}>
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "var(--text)" }}>
                          {mechanism.name}
                        </div>
                        <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
                          {mechanism.category}
                        </div>
                      </div>

                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", marginBottom: 6 }}>
                          REAGENTS
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>
                          {mechanism.reagents}
                        </div>
                      </div>

                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", marginBottom: 6 }}>
                          RESULT
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>
                          {mechanism.result}
                        </div>
                      </div>

                      {mechanism.exampleReaction && (
                        <div
                          style={{
                            padding: 12,
                            background: "var(--panel-2)",
                            borderRadius: 8,
                            marginBottom: 16,
                            border: "1px solid var(--border)",
                          }}
                        >
                          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", marginBottom: 6 }}>
                            EXAMPLE
                          </div>
                          <div style={{ fontSize: 13, fontFamily: "monospace", color: "var(--text)" }}>
                            {mechanism.exampleReaction.fullReaction}
                          </div>
                        </div>
                      )}

                      <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
                        {mechanism.notes}
                      </div>

                      <div
                        style={{
                          marginTop: 16,
                          paddingTop: 16,
                          borderTop: "1px solid var(--border)",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          fontSize: 14,
                          fontWeight: 600,
                          color: "var(--blue)",
                        }}
                      >
                        View mechanism
                        <span style={{ fontSize: 18 }}>→</span>
                      </div>
                    </div>
                  </div>
                </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* OrgoChem II Section */}
      <div style={{ marginBottom: 60 }}>
        <div style={{ marginBottom: 30, paddingBottom: 16, borderBottom: "3px solid var(--green)" }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 8, color: "var(--text)" }}>
            OrgoChem II
          </h2>
          <p style={{ fontSize: 16, color: "var(--muted)" }}>
            Aromatics, enolates, carboxylic acid derivatives, alcohols, ethers, and amines
          </p>
        </div>

        {getCategories(orgochem2Mechanisms).map((category) => {
          const categoryMechanisms = orgochem2Mechanisms.filter((m) => m.category === category);
          return (
            <div key={category} style={{ marginBottom: 40 }}>
              <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16, color: "var(--text)" }}>
                {category}
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                  gap: 24,
                }}
              >
                {categoryMechanisms.map((mechanism) => (
                  <Link
                    key={mechanism.id}
                    href={`/mechanisms/${mechanism.id}`}
                    style={{
                      textDecoration: "none",
                      display: "block",
                    }}
                  >
                    <div
                      className="card"
                      style={{
                        height: "100%",
                        transition: "all 0.2s ease",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.12)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)";
                      }}
                    >
                      <div className="cardInner" style={{ padding: 24 }}>
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "var(--text)" }}>
                            {mechanism.name}
                          </div>
                          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
                            {mechanism.category}
                          </div>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", marginBottom: 6 }}>
                            REAGENTS
                          </div>
                          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>
                            {mechanism.reagents}
                          </div>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", marginBottom: 6 }}>
                            RESULT
                          </div>
                          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>
                            {mechanism.result}
                          </div>
                        </div>

                        {mechanism.exampleReaction && (
                          <div
                            style={{
                              padding: 12,
                              background: "var(--panel-2)",
                              borderRadius: 8,
                              marginBottom: 16,
                              border: "1px solid var(--border)",
                            }}
                          >
                            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", marginBottom: 6 }}>
                              EXAMPLE
                            </div>
                            <div style={{ fontSize: 13, fontFamily: "monospace", color: "var(--text)" }}>
                              {mechanism.exampleReaction.fullReaction}
                            </div>
                          </div>
                        )}

                        <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
                          {mechanism.notes}
                        </div>

                        <div
                          style={{
                            marginTop: 16,
                            paddingTop: 16,
                            borderTop: "1px solid var(--border)",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            fontSize: 14,
                            fontWeight: 600,
                            color: "var(--blue)",
                          }}
                        >
                          View mechanism
                          <span style={{ fontSize: 18 }}>→</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
