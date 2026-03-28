import type { ReactNode } from "react";

export default function OpEmptyState({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="opEmpty">
      <div className="opEmptyTitle">{title}</div>
      {description ? <div className="opEmptyDesc">{description}</div> : null}
      {children ? <div className="opEmptyActions">{children}</div> : null}
    </div>
  );
}
