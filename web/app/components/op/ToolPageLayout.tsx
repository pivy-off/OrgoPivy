import type { ReactNode } from "react";

export default function ToolPageLayout({
  title,
  subtitle,
  eyebrow,
  children,
  actions,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <main className="opToolPage">
      <div className="opToolInner">
        <header className="opToolHeader">
          <div>
            {eyebrow ? <div className="opEyebrow">{eyebrow}</div> : null}
            <h1 className="opToolTitle">{title}</h1>
            {subtitle ? <p className="opToolSubtitle">{subtitle}</p> : null}
          </div>
          {actions ? <div className="opToolActions">{actions}</div> : null}
        </header>
        {children}
      </div>
    </main>
  );
}
