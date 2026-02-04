import type { Locale } from "./i18n";

/** French translations for curriculum topic titles and short descriptions */
export const topicTranslationsFR: Record<
  string,
  { title: string; shortDesc: string }
> = {
  "resonance-acid-base": {
    title: "Résonance et acide-base",
    shortDesc: "Formes de résonance, Brønsted-Lowry, pKa, paires conjuguées, sens d'équilibre",
  },
  alkanes: {
    title: "Alcanes",
    shortDesc: "Nomenclature, conformations et logique de stabilité",
  },
  cycloalkanes: {
    title: "Cycloalcanes",
    shortDesc: "Retournements de chaise, axial vs équatorial, règles de stabilité",
  },
  stereochemistry: {
    title: "Stéréochimie",
    shortDesc: "R/S, énantiomères, diastéréomères, E/Z",
  },
  "substitution-elimination": {
    title: "SN1 SN2 E1 E2",
    shortDesc: "Substitution et élimination, mécanismes et sélectivité",
  },
  alkenes: {
    title: "Alcènes",
    shortDesc: "Additions, règle de Markovnikov, stéréochimie",
  },
  alkynes: {
    title: "Alcynes",
    shortDesc: "Réduction, addition, acidité des alcynes terminaux",
  },
  spectroscopy: {
    title: "Spectroscopie",
    shortDesc: "IR, RMN, degré d'insaturation",
  },
  alcohols: {
    title: "Alcools",
    shortDesc: "Oxydation, déshydratation, groupes protecteurs",
  },
  "ethers-epoxides": {
    title: "Éthers et époxydes",
    shortDesc: "Synthèse de Williamson, ouverture d'époxydes",
  },
  "carbonyls-addition": {
    title: "Addition nucléophile aux carbonylés",
    shortDesc: "Grignard, imines, acétals",
  },
  "carboxylic-acids-derivatives": {
    title: "Acides carboxyliques et dérivés",
    shortDesc: "Substitution acyl, échelle de réactivité",
  },
  "enolates-aldol-claisen": {
    title: "Énolates, aldol et Claisen",
    shortDesc: "Formation d'énolates, aldol, Claisen, Michael",
  },
  "aromatic-chemistry": {
    title: "Chimie aromatique",
    shortDesc: "Substitution électrophile aromatique, directeurs ortho/méta/para",
  },
  amines: {
    title: "Amines",
    shortDesc: "Amination réductive, basicité, formation d'amides",
  },
};

export function getTranslatedTopicTitle(
  slug: string,
  locale: Locale,
  fallback: string
): string {
  if (locale !== "fr") return fallback;
  return topicTranslationsFR[slug]?.title ?? fallback;
}

export function getTranslatedTopicShortDesc(
  slug: string,
  locale: Locale,
  fallback: string
): string {
  if (locale !== "fr") return fallback;
  return topicTranslationsFR[slug]?.shortDesc ?? fallback;
}
