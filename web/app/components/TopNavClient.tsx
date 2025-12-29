"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";

function getCurrentTheme(): Theme {
  const v = document.documentElement.dataset.theme;
  return v === "dark" ? "dark" : "light";
}

export default function TopNavClient() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    try {
      setTheme(getCurrentTheme());
    } catch {
      setTheme("light");
    }
  }, []);

  const setThemeSafe = useCallback((next: Theme) => {
    try {
      // @ts-ignore
      window.__setTheme?.(next);
    } catch {}
    setTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setThemeSafe(next);
  }, [theme, setThemeSafe]);

  const pillClass = useCallback(
    (href: string) => {
      const active = pathname === href;
      return active ? "pill pillActive" : "pill";
    },
    [pathname]
  );

  const themeLabel = useMemo(() => {
    return theme === "dark" ? "Dark" : "Light";
  }, [theme]);

  return (
    <div className="topLinks">
      <Link className={pillClass("/spectra")} href="/spectra">
        NMR Studio
      </Link>

      <Link className={pillClass("/mechanisms")} href="/mechanisms">
        Mechanisms
      </Link>

      <Link className={pillClass("/ask")} href="/ask">
        Ask
      </Link>

      <button
        className="pill"
        type="button"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        Theme {themeLabel}
      </button>
    </div>
  );
}
