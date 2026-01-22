"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    __setTheme?: (theme: "light" | "dark") => void;
  }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get current theme
    const currentTheme = (document.documentElement.dataset.theme as "light" | "dark") || "light";
    setTheme(currentTheme);
  }, []);

  function toggleTheme() {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (typeof window !== "undefined" && window.__setTheme) {
      window.__setTheme(newTheme);
    }
  }

  if (!mounted) {
    return (
      <button
        type="button"
        className="pill"
        style={{ 
          minWidth: 40, 
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer"
        }}
        aria-label="Toggle theme"
      >
        <span style={{ fontSize: 18 }}>🌓</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className="pill"
      onClick={toggleTheme}
      style={{ 
        minWidth: 40, 
        height: 32, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.2s ease"
      }}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <span style={{ fontSize: 18 }}>
        {theme === "light" ? "🌙" : "☀️"}
      </span>
    </button>
  );
}
