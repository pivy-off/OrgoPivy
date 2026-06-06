import { getMechanismDiagramSvg } from "@/lib/mechanismDiagramSvgs";

/** Static mechanism figures under /public (curriculum-quality schematics). */
const PUBLIC_BY_SLUG: Record<string, string> = {
  alkynes: "/images/orgochem2/alkynes-mechanism-1.svg",
  "conjugated-compounds-diels-alder": "/images/orgochem2/diels-alder-mechanism-1.svg",
  "electrophilic-aromatic-substitution": "/images/orgochem2/eas-mechanism-1.svg",
};

export function getMechanismOverviewImageSrc(slug: string): string | undefined {
  return PUBLIC_BY_SLUG[slug];
}

/** Diagram HTML for mechanism viewer + step cards (large readable SVG). */
export function getMechanismStepDiagram(slug: string, stepIndex: number): string {
  return getMechanismDiagramSvg(slug, stepIndex);
}

export function getMechanismStepImageSrc(slug: string, stepIndex: number): string | undefined {
  if (stepIndex === 0) return PUBLIC_BY_SLUG[slug];
  return undefined;
}
