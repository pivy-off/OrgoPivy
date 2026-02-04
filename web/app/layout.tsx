// app/layout.tsx
import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Viewport } from "next";
import TopNavClient from "./components/TopNavClient";
import ErrorBoundary from "./components/ErrorBoundary";
import ThemeToggle from "./components/ThemeToggle";
import LanguageToggle from "./components/LanguageToggle";
import CommandPalette from "./components/CommandPalette";
import SideNavMobile from "./components/SideNavMobile";
import SideNavClient from "./components/SideNavClient";
import { LanguageProvider } from "./contexts/LanguageContext";

export const metadata = {
  title: "OrgoPivy",
  description: "Orgo tools for students",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

function ThemeBootScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
(function () {
  try {
    const saved = localStorage.getItem("orgopivy_theme");
    const theme = saved || "light";
    document.documentElement.dataset.theme = theme;
    window.__setTheme = function(next) {
      document.documentElement.dataset.theme = next;
      localStorage.setItem("orgopivy_theme", next);
    };
    var lang = localStorage.getItem("orgopivy_locale");
    document.documentElement.lang = lang === "fr" ? "fr" : "en";
  } catch (e) {}
})();
`,
      }}
    />
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeBootScript />

        <LanguageProvider>
          <CommandPalette />
          <div className="topbar">
            <div className="topbarInner">
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="brand">
                    <span className="brandDot" style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      background: "linear-gradient(135deg, #007AFF 0%, #5856D6 100%)",
                      display: "inline-block",
                      marginRight: 8,
                      verticalAlign: "middle"
                    }} />
                    <span>OrgoPivy</span>
                    <span className="badge">Orgo Studio</span>
                  </div>
                </Link>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                  <LanguageToggle />
                  <ThemeToggle />
                </div>
              </div>

              <TopNavClient />
            </div>
          </div>

          <ErrorBoundary>
            <div className="container">
              <div className="shell">
                <div className="sideNavDesktop">
                  <SideNavClient />
                </div>
                <div className="sideNavMobileWrap">
                  <SideNavMobile />
                </div>
                <div>{children}</div>
              </div>
            </div>
          </ErrorBoundary>
        </LanguageProvider>
      </body>
    </html>
  );
}
