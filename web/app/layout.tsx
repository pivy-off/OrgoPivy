// app/layout.tsx
import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";
import TopNavClient from "./components/TopNavClient";
import ErrorBoundary from "./components/ErrorBoundary";
import ThemeToggle from "./components/ThemeToggle";
import CommandPalette from "./components/CommandPalette";

export const metadata = {
  title: "OrgoPivy",
  description: "Orgo tools for students",
};

function SideNav() {
  return (
    <div className="card">
      <div className="cardInner">
        <div className="stack">
          <div>
            <div className="cardTitle">Workspace</div>
            <div className="subtle">Pick a tool and stay in flow</div>
          </div>

          <div className="nav">
            <Link className="navLink" href="/">
              Home <span className="subtle">Overview</span>
            </Link>

            <Link className="navLink" href="/uploads">
              Uploads <span className="subtle">Files</span>
            </Link>

            <Link className="navLink" href="/ask">
              Ask <span className="subtle">QA</span>
            </Link>

            <Link className="navLink" href="/mechanisms">
              Mechanisms <span className="subtle">Steps</span>
            </Link>

            <Link className="navLink" href="/spectra">
              Spectra <span className="subtle">NMR</span>
            </Link>
          </div>

          <div style={{ 
            marginTop: "auto", 
            paddingTop: "var(--space-3)",
            borderTop: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--space-2)"
          }}>
            <span className="subtle" style={{ fontSize: 13 }}>Theme</span>
            <ThemeToggle />
          </div>

        </div>
      </div>
    </div>
  );
}

function ThemeBootScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
(function () {
  try {
    const saved = localStorage.getItem("orgopivy_theme");
    // Default to light mode if no preference is saved
    const theme = saved || "light";
    document.documentElement.dataset.theme = theme;

    window.__setTheme = function(next) {
      document.documentElement.dataset.theme = next;
      localStorage.setItem("orgopivy_theme", next);
    };
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
              <ThemeToggle />
            </div>

            <TopNavClient />
          </div>
        </div>

        <ErrorBoundary>
          <div className="container">
            <div className="shell">
              <SideNav />
              <div>{children}</div>
            </div>
          </div>
        </ErrorBoundary>
      </body>
    </html>
  );
}
