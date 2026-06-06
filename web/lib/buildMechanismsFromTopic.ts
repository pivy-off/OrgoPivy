import { getMechanismStepCardsForSlug, type MechanismStepCard } from "@/app/lib/orgochem2MechanismSteps";
import { getMechanismPathwaysForSlug } from "@/lib/orgochem2MechanismPathways";
import { parseBondChanges, parseReactionScheme } from "@/lib/parseReactionScheme";

export type MechanismStep = {
  title: string;
  narration: string;
  bondFormed: string;
  bondBroken: string;
  electronFlow: string;
  structure: string;
  reactant: string;
  product: string;
  commonError: string;
};

export type MechanismDef = {
  id: string;
  title: string;
  subtitle: string;
  steps: MechanismStep[];
};

const COMMON_ERRORS = [
  "Forgetting to track formal charge after each curved arrow.",
  "Drawing arrows from H⁺ instead of the actual π bond or lone pair.",
  "Ignoring stereochemistry when a new stereocenter forms.",
  "Using reagents incompatible with the mechanism class (e.g. strong base with acetylide + 3° halide).",
];

function cardToStep(card: MechanismStepCard, stepIndex: number): MechanismStep {
  const { reactant, product } = parseReactionScheme(card.structure);
  const { formed, broken } = parseBondChanges(card.bonds);
  const title = card.title ?? `Step ${card.step}`;

  return {
    title,
    narration: card.electronFlow,
    bondFormed: formed,
    bondBroken: broken,
    electronFlow: card.electronFlow,
    structure: card.structure,
    reactant,
    product,
    commonError: COMMON_ERRORS[stepIndex % COMMON_ERRORS.length],
  };
}

export function buildMechanismsFromTopic(topic: {
  title: string;
  slug: string;
}): MechanismDef[] {
  const cards = getMechanismStepCardsForSlug(topic.slug);
  const pathways = getMechanismPathwaysForSlug(topic.slug);

  if (pathways.length > 0) {
    return pathways.map((pathway) => {
      const steps = pathway.stepIndices
        .filter((i) => cards[i])
        .map((i, si) => cardToStep(cards[i], si));
      return {
        id: pathway.id,
        title: pathway.title,
        subtitle: pathway.subtitle ?? topic.title,
        steps,
      };
    });
  }

  return [
    {
      id: topic.slug,
      title: topic.title,
      subtitle: `${cards.length} curved-arrow step${cards.length === 1 ? "" : "s"}`,
      steps: cards.map((card, i) => cardToStep(card, i)),
    },
  ];
}
