"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "../contexts/LanguageContext";
import type { TranslationKey } from "../lib/i18n";

const NAV_LINKS: { href: string; labelKey: TranslationKey }[] = [
  { href: "/", labelKey: "home" },
  { href: "/orgochem-1", labelKey: "orgochem1" },
  { href: "/orgochem-2", labelKey: "orgochem2" },
  { href: "/uploads", labelKey: "upload" },
  { href: "/search", labelKey: "search" },
  { href: "/ask", labelKey: "ask" },
  { href: "/practice", labelKey: "practice" },
  { href: "/assignments", labelKey: "assignments" },
  { href: "/professor", labelKey: "professor" },
  { href: "/tools", labelKey: "tools" },
];

export default function TopNavClient() {
  const path = usePathname() || "/";
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setIsMobile(mq.matches);
    const handler = () => setIsMobile(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  function pillClass(href: string) {
    const active = path === href || (href !== "/" && path.startsWith(href));
    return active ? "pill pillActive" : "pill";
  }

  function openCommandPalette() {
    window.dispatchEvent(new CustomEvent("openCommandPalette"));
  }

  if (isMobile) {
    return (
      <>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            onClick={openCommandPalette}
            className="pill"
            style={{
              padding: "10px 12px",
              minWidth: 44,
              minHeight: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Search"
          >
            🔍
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="pill"
            style={{
              padding: "10px 12px",
              minWidth: 44,
              minHeight: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>

        {mobileMenuOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 50,
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(4px)",
            }}
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                width: "min(320px, 85vw)",
                background: "var(--panel)",
                borderLeft: "1px solid var(--border)",
                boxShadow: "-10px 0 40px rgba(0,0,0,0.2)",
                padding: "calc(env(safe-area-inset-top) + 16px) 16px 16px",
                overflowY: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <span style={{ fontSize: 18, fontWeight: 700 }}>{t("menu")}</span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn"
                  style={{ padding: "8px 16px" }}
                >
                  {t("close")}
                </button>
              </div>
              <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {NAV_LINKS.map(({ href, labelKey }) => (
                  <Link
                    key={href}
                    href={href}
                    className={pillClass(href)}
                    style={{
                      display: "block",
                      padding: "14px 16px",
                      textAlign: "left",
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t(labelKey)}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="topNav">
      {NAV_LINKS.map(({ href, labelKey }) => (
        <Link key={href} className={pillClass(href)} href={href}>
          {t(labelKey)}
        </Link>
      ))}
    </div>
  );
}
