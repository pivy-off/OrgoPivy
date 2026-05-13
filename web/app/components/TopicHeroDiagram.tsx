import type { TopicHeroDiagram } from "../lib/curriculum";

export default function TopicHeroDiagram({ diagram }: { diagram: TopicHeroDiagram }) {
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
        <linearGradient id="heroGrad" x1="0" x2="1">
          <stop offset="0" stopColor="var(--primary)" stopOpacity="0.18" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0.18" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="900" height="240" rx="18" fill="url(#heroGrad)" />
      <text x="28" y="54" fontSize="20" fontWeight="950" fill="var(--text)">
        {diagram.cardTitle}
      </text>
      <text x="28" y="82" fontSize="13" fill="var(--muted)">
        {diagram.cardSubtitle}
      </text>
      <text x="28" y="138" fontSize="14" fontWeight="700" fill="var(--text)">
        {diagram.centerLine1}
      </text>
      {diagram.centerLine2 ? (
        <text x="28" y="164" fontSize="13" fill="var(--muted)">
          {diagram.centerLine2}
        </text>
      ) : null}
      <text x="600" y="128" fontSize="13" fill="var(--muted)">
        {diagram.reagentCaption}
      </text>
      <text x="600" y="154" fontSize="14" fontWeight="900" fill="var(--text)">
        {diagram.reagentBold}
      </text>
    </svg>
  );
}
