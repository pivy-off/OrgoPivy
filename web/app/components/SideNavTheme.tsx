"use client";

import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";

function readTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export default function SideNavTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    typeof window !== "undefined" ? readTheme() : "light",
  );

  useEffect(() => {
    const el = document.documentElement;
    const obs = new MutationObserver(() => setTheme(readTheme()));
    obs.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  const toggle = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    try {
      // @ts-ignore ThemeBootScript
      window.__setTheme?.(next);
    } catch {
      // ignore
    }
    setTheme(next);
  }, [theme]);

  return (
    <div className="sideNavThemeRow">
      <span className="subtle" style={{ fontWeight: 700 }}>
        Theme
      </span>
      <button
        type="button"
        className="pill sideNavThemeBtn"
        onClick={toggle}
        aria-label="Toggle theme"
      >
        {theme === "dark" ? "☀️" : "🌙"}
      </button>
    </div>
  );
}
