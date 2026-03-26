"use client";

import { useCallback, useState, type ReactNode } from "react";

/**
 * Drives press motion on surfaces that are not links (touch + mouse),
 * so :active on a plain div is not relied on.
 */
export default function HomePressable({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const [down, setDown] = useState(false);
  const end = useCallback(() => setDown(false), []);

  return (
    <div
      className={`${className.trim()}${down ? " homePressableDown" : ""}`.trim()}
      style={{ touchAction: "manipulation" }}
      onPointerDown={(e) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        setDown(true);
      }}
      onPointerUp={end}
      onPointerCancel={end}
      onPointerLeave={end}
    >
      {children}
    </div>
  );
}
