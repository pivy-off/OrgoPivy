export default function OpBadge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warn" | "info";
}) {
  return <span className={`opBadge opBadge-${tone}`}>{children}</span>;
}
