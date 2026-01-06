// app/layout.tsx
import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";
import TopNavClient from "./components/TopNavClient";

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
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    const theme = saved || (prefersDark ? "dark" : "light");
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

        <div className="topbar">
          <div className="topbarInner">
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

            <TopNavClient />
          </div>
        </div>

        <div className="container">
          <div className="shell">
            <SideNav />
            <div>{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
