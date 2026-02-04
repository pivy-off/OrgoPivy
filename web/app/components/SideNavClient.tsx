"use client";

import Link from "next/link";
import { useLanguage } from "../contexts/LanguageContext";
import ThemeToggle from "./ThemeToggle";

export default function SideNavClient() {
  const { t } = useLanguage();

  return (
    <div className="card">
      <div className="cardInner">
        <div className="stack">
          <div>
            <div className="cardTitle">{t("workspace")}</div>
            <div className="subtle">{t("workspaceSub")}</div>
          </div>

          <div className="nav">
            <Link className="navLink" href="/">
              {t("home")} <span className="subtle">{t("overview")}</span>
            </Link>
            <Link className="navLink" href="/uploads">
              {t("uploads")} <span className="subtle">{t("files")}</span>
            </Link>
            <Link className="navLink" href="/ask">
              {t("ask")} <span className="subtle">{t("qa")}</span>
            </Link>
            <Link className="navLink" href="/mechanisms">
              Mechanisms <span className="subtle">{t("steps")}</span>
            </Link>
            <Link className="navLink" href="/spectra">
              Spectra <span className="subtle">{t("nmr")}</span>
            </Link>
            <Link className="navLink" href="/assignments">
              {t("assignments")} <span className="subtle">{t("graded")}</span>
            </Link>
            <Link className="navLink" href="/professor">
              {t("professor")} <span className="subtle">{t("tools")}</span>
            </Link>
          </div>

          <div
            style={{
              marginTop: "auto",
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
      </div>
    </div>
  );
}
