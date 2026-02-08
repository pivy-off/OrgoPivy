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
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = () => setIsMobile(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  function pillClass(href: string) {
    const active = path === href || (href !== "/" && path.startsWith(href));
    return active ? "pill pillActive" : "pill";
  }

  function openCommandPalette() {
    window.dispatchEvent(new CustomEvent("openCommandPalette"));
  }

  if (isMobile) {
    return (
      <div style={{ position: "relative" }}>
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
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
            aria-expanded={mobileMenuOpen}
          >
            ☰
          </button>
        </div>

        {mobileMenuOpen && (
          <>
            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 49,
              }}
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: 8,
                zIndex: 50,
                minWidth: 220,
                background: "var(--panel)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow)",
                padding: 8,
              }}
            >
              <nav
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 6,
                }}
              >
                {NAV_LINKS.map(({ href, labelKey }) => (
                  <Link
                    key={href}
                    href={href}
                    className={pillClass(href)}
                    style={{
                      display: "block",
                      padding: "10px 12px",
                      textAlign: "left",
                      fontSize: 14,
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t(labelKey)}
                  </Link>
                ))}
              </nav>
            </div>
          </>
        )}
      </div>
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
