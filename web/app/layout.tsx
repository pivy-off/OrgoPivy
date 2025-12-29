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

            <Link className="navLink" href="/search">
              Search <span className="subtle">Chunks</span>
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

          <div className="divider" />

          <div className="stackSm">
            <div className="cardTitle">Shortcuts</div>
            <div className="row">
              <span className="subtle">Undo</span>
              <span className="kbd">Ctrl Z</span>
            </div>
            <div className="row">
              <span className="subtle">Redo</span>
              <span className="kbd">Ctrl Y</span>
            </div>
            <div className="row">
              <span className="subtle">Peak tool</span>
              <span className="kbd">P</span>
            </div>
            <div className="row">
              <span className="subtle">Calibrate</span>
              <span className="kbd">C</span>
            </div>
            <div className="row">
              <span className="subtle">Atom tool</span>
              <span className="kbd">A</span>
            </div>
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
            <div className="brand">
              <span className="brandDot" />
              <span>OrgoPivy</span>
              <span className="badge">Orgo Studio</span>
            </div>

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
