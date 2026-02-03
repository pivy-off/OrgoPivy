"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function SideNavMobile() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Home", sub: "Overview" },
    { href: "/uploads", label: "Uploads", sub: "Files" },
    { href: "/ask", label: "Ask", sub: "QA" },
    { href: "/mechanisms", label: "Mechanisms", sub: "Steps" },
    { href: "/spectra", label: "Spectra", sub: "NMR" },
    { href: "/assignments", label: "Assignments", sub: "Graded" },
    { href: "/professor", label: "Professor", sub: "Tools" },
  ];

  return (
    <div className="card" style={{ marginBottom: "var(--space-3)" }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="navLink"
        style={{
          width: "100%",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
      >
        <div>
          <div className="cardTitle">Workspace</div>
          <div className="subtle">Pick a tool and stay in flow</div>
        </div>
        <span style={{ fontSize: 18, transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "none" }}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div style={{ padding: "0 var(--space-4) var(--space-4)", marginTop: -8 }}>
          <div className="nav" style={{ marginBottom: "var(--space-3)" }}>
            {links.map(({ href, label, sub }) => (
              <Link key={href} className="navLink" href={href}>
                {label} <span className="subtle">{sub}</span>
              </Link>
            ))}
          </div>
          <div
            style={{
              paddingTop: "var(--space-3)",
              borderTop: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "var(--space-2)",
            }}
          >
            <span className="subtle" style={{ fontSize: 13 }}>
              Theme
            </span>
            <ThemeToggle />
          </div>
        </div>
      )}
    </div>
  );
}
