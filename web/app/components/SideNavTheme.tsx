"use client";

import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";

function readTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export default function SideNavTheme() {
  // Always start "light" so SSR matches first client paint (boot script may set dark before hydrate).
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(readTheme());
    const el = document.documentElement;
    const obs = new MutationObserver(() => setTheme(readTheme()));
    obs.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  const toggle = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    try {
      // @ts-expect-error ThemeBootScript global
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
