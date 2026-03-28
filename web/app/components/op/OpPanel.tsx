import type { ReactNode } from "react";

export default function OpPanel({
  title,
  right,
  children,
  variant = "default",
}: {
  title?: string;
  right?: ReactNode;
  children: ReactNode;
  variant?: "default" | "muted";
}) {
  return (
    <section className={`opPanel ${variant === "muted" ? "opPanelMuted" : ""}`}>
      {(title || right) && (
        <div className="opPanelHead">
          {title ? <h2 className="opPanelTitle">{title}</h2> : <span />}
          {right ? <div className="opPanelRight">{right}</div> : null}
        </div>
      )}
      <div className="opPanelBody">{children}</div>
    </section>
  );
}
