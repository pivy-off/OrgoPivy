"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { CourseId } from "../lib/curriculum";
import { getAssignments, importAssignment, type Assignment } from "../lib/assignments";

export default function AssignmentsPage() {
  const [orgochem1, setOrgoChem1] = useState<Assignment[]>([]);
  const [orgochem2, setOrgoChem2] = useState<Assignment[]>([]);
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState<string | null>(null);

  function load() {
    setOrgoChem1(getAssignments("orgochem-1"));
    setOrgoChem2(getAssignments("orgochem-2"));
  }

  useEffect(() => {
    load();
  }, []);

  function handleImport() {
    setImportError(null);
    const a = importAssignment(importText);
    if (a) {
      setImportText("");
      setShowImport(false);
      load();
      window.location.href = `/assignments/${a.courseId}/${a.id}`;
    } else {
      setImportError("Invalid assignment JSON. Paste the exported file contents.");
    }
  }

  const total = orgochem1.length + orgochem2.length;

  return (
    <main className="stack" style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      <div>
        <Link href="/" className="btn" style={{ marginBottom: 16 }}>
          ← Back
        </Link>
        <h1 className="h1" style={{ marginBottom: 8 }}>Assignments</h1>
        <p className="subtle" style={{ fontSize: 15 }}>
          Take graded assignments and get instant feedback. Professors can share assignments via export.
        </p>
      </div>

      <div className="card">
        <div className="cardInner">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Your assignments</div>
            <button
              type="button"
              className="btn"
              onClick={() => setShowImport(!showImport)}
              style={{ fontSize: 13 }}
            >
              {showImport ? "Cancel" : "Import assignment"}
            </button>
          </div>

          {showImport && (
            <div style={{ marginBottom: 24, padding: 16, background: "var(--panel-2)", borderRadius: 12, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Paste exported assignment JSON</div>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder='{"title":"...","courseId":"orgochem-1","problems":[...]}'
                style={{
                  width: "100%",
                  minHeight: 120,
                  padding: 12,
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: "var(--panel)",
                  color: "var(--text)",
                  fontSize: 13,
                  fontFamily: "monospace",
                  resize: "vertical",
                }}
              />
              {importError && <div style={{ fontSize: 13, color: "var(--red)", marginTop: 8 }}>{importError}</div>}
              <button type="button" className="btn btnPrimary" onClick={handleImport} style={{ marginTop: 12 }}>
                Import and open
              </button>
            </div>
          )}

          {total === 0 && !showImport ? (
            <div style={{ padding: 32, textAlign: "center", color: "var(--muted)" }}>
              <div style={{ fontSize: 15, marginBottom: 8 }}>No assignments yet</div>
              <div style={{ fontSize: 13 }}>
                Assignments appear here when you create them (Professor Tools) or import one shared by your professor.
              </div>
              <Link href="/" className="btn btnPrimary" style={{ marginTop: 16, display: "inline-block" }}>
                Go to Home
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {orgochem1.map((a) => (
                <AssignmentCard key={a.id} assignment={a} course="orgochem-1" />
              ))}
              {orgochem2.map((a) => (
                <AssignmentCard key={a.id} assignment={a} course="orgochem-2" />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function AssignmentCard({ assignment, course }: { assignment: Assignment; course: CourseId }) {
  const [submission, setSubmission] = useState<{ score: number; percentage: number } | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`orgopivy-submissions-${course}`);
      if (saved) {
        const subs = JSON.parse(saved);
        const s = subs[assignment.id];
        if (s?.graded) setSubmission({ score: s.score, percentage: s.percentage });
      }
    } catch {}
  }, [assignment.id, course]);

  return (
    <Link
      href={`/assignments/${course}/${assignment.id}`}
      style={{
        display: "block",
        padding: 16,
        border: "1px solid var(--border)",
        borderRadius: 12,
        background: "var(--panel)",
        textDecoration: "none",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--blue)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4, color: "var(--text)" }}>
            {assignment.title}
          </div>
          <div className="subtle" style={{ fontSize: 13 }}>
            {course === "orgochem-1" ? "OrgoChem I" : "OrgoChem II"} • {assignment.problems.length} problems • {assignment.totalPoints} pts
          </div>
        </div>
        {submission && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--blue)" }}>{submission.percentage}%</div>
            <div className="subtle" style={{ fontSize: 12 }}>{submission.score}/{assignment.totalPoints}</div>
          </div>
        )}
        {!submission && <span style={{ fontSize: 14, color: "var(--muted)" }}>Start →</span>}
      </div>
    </Link>
  );
}
