import type { ReactNode } from "react";
import type { TopicHeroDiagram } from "../lib/curriculum";

function renderChemLine(text: string, y: number, opts: { size?: number; weight?: number; fill?: string; x?: number }) {
  const { size = 14, weight = 700, fill = "var(--text)", x = 28 } = opts;
  const parts = text.split(/(⇌|→|←)/);
  let offsetX = x;
  const nodes: ReactNode[] = [];
  parts.forEach((part, i) => {
    if (!part) return;
    const isArrow = part === "⇌" || part === "→" || part === "←";
    nodes.push(
      <text
        key={`${y}-${i}`}
        x={offsetX}
        y={y}
        fontSize={size}
        fontWeight={isArrow ? 800 : weight}
        fill={isArrow ? "#4F6EF7" : fill}
        fontFamily={isArrow ? "inherit" : "ui-monospace, monospace"}
      >
        {part}
      </text>,
    );
    offsetX += part.length * (isArrow ? 9 : 7.2);
  });
  return nodes;
}

export default function TopicHeroDiagramView({ diagram }: { diagram: TopicHeroDiagram }) {
  const common = {
    width: "100%",
    height: 240,
    viewBox: "0 0 900 240",
    role: "img" as const,
    "aria-label": diagram.cardTitle,
  };

  return (
    <svg {...common}>
      <defs>
        <linearGradient id="heroGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EEF1FF" stopOpacity="1" />
          <stop offset="55%" stopColor="#F8FAFF" stopOpacity="1" />
          <stop offset="100%" stopColor="#EDE9FE" stopOpacity="1" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="900" height="240" rx="18" fill="url(#heroGrad)" stroke="rgba(79,110,247,0.12)" />
      <text x="28" y="54" fontSize="20" fontWeight="950" fill="var(--text)">
        {diagram.cardTitle}
      </text>
      <text x="28" y="82" fontSize="13" fill="var(--muted)">
        {diagram.cardSubtitle}
      </text>
      {renderChemLine(diagram.centerLine1, 138, { size: 14, weight: 700 })}
      {diagram.centerLine2 ? (
        <text x="28" y="164" fontSize="13" fill="var(--muted)">
          {diagram.centerLine2}
        </text>
      ) : null}
      <text x="600" y="128" fontSize="13" fill="var(--muted)">
        {diagram.reagentCaption}
      </text>
      <text x="600" y="154" fontSize="15" fontWeight="900" fill="#4F6EF7">
        {diagram.reagentBold}
      </text>
    </svg>
  );
}
