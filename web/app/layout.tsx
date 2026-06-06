// app/layout.tsx
import "./globals.css";
import "../styles/apple-glass.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import type { ReactNode } from "react";
import TopNavClient from "./components/TopNavClient";
import TopBarThemeToggle from "./components/TopBarThemeToggle";
import TraduireButton from "./components/TraduireButton";
import WorkspaceSidebar from "./components/WorkspaceSidebar";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "OrgoPivy",
  description: "Orgo tools for students",
};

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
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body>
        <ThemeBootScript />

        <div className="topbar">
          <div className="topbarInner topbarInnerStack">
            <div className="topbarRowTop">
              <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
                <div className="brand">
                  <span className="brandMark" aria-hidden />
                  <span>OrgoPivy</span>
                </div>
              </Link>

              <div className="topbarQuick">
                <Link className="pill" href="/studio">
                  Orgo Studio
                </Link>
                <TraduireButton />
                <TopBarThemeToggle />
              </div>
            </div>

            <TopNavClient />
          </div>
        </div>

        <div className="container">
          <div className="shell">
            <WorkspaceSidebar />
            <div className="shellMain">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
