"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useLanguage } from "../contexts/LanguageContext";

export default function SideNavMobile() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const links = [
    { href: "/", labelKey: "home" as const, subKey: "overview" as const },
    { href: "/uploads", labelKey: "uploads" as const, subKey: "files" as const },
    { href: "/ask", labelKey: "ask" as const, subKey: "qa" as const },
    { href: "/mechanisms", labelKey: "mechanisms" as const, subKey: "steps" as const },
    { href: "/spectra", labelKey: "spectra" as const, subKey: "nmr" as const },
    { href: "/assignments", labelKey: "assignments" as const, subKey: "graded" as const },
    { href: "/professor", labelKey: "professor" as const, subKey: "tools" as const },
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
          <div className="cardTitle">{t("workspace")}</div>
          <div className="subtle">{t("workspaceSub")}</div>
        </div>
        <span style={{ fontSize: 18, transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "none" }}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div style={{ padding: "0 var(--space-4) var(--space-4)", marginTop: -8 }}>
          <div className="nav" style={{ marginBottom: "var(--space-3)" }}>
            {links.map(({ href, labelKey, subKey }) => (
              <Link key={href} className="navLink" href={href}>
                {t(labelKey)} <span className="subtle">{t(subKey)}</span>
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
              {t("theme")}
            </span>
            <ThemeToggle />
          </div>
        </div>
      )}
    </div>
  );
}
