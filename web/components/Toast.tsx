"use client";

import { useEffect, useState } from "react";

export function showToast(message: string, ms = 2000) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("op-toast", { detail: { message, ms } }));
}

export default function ToastHost() {
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const fn = (e: Event) => {
      const ce = e as CustomEvent<{ message: string; ms?: number }>;
      setMsg(ce.detail.message);
      window.setTimeout(() => setMsg(null), ce.detail.ms ?? 2000);
    };
    window.addEventListener("op-toast", fn as EventListener);
    return () => window.removeEventListener("op-toast", fn as EventListener);
  }, []);

  if (!msg) return null;
  return (
    <div
      role="status"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 10000,
        background: "var(--op-text-primary, #111)",
        color: "#fff",
        padding: "12px 18px",
        borderRadius: 12,
        fontSize: 14,
        fontWeight: 600,
        boxShadow: "var(--op-shadow-lg, 0 8px 24px rgba(0,0,0,0.2))",
        animation: "opFadeIn 0.25s ease",
      }}
    >
      {msg}
    </div>
  );
}
