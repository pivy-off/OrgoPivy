import { getMechanismStepCardsForSlug } from "../lib/orgochem2MechanismSteps";
import { ChemFormattedLine } from "../lib/chemTypography";
import { parseBondChanges, parseReactionScheme } from "@/lib/parseReactionScheme";
import MechanismStepSchematic from "@/components/MechanismStepSchematic";

export default function OrgChem2MechanismStepCards({ slug }: { slug: string }) {
  const steps = getMechanismStepCardsForSlug(slug);
  const total = steps.length;

  return (
    <div className="mechanismStepCards mech-viewer__steps-stack">
      {steps.map((s) => {
        const { reactant, product } = parseReactionScheme(s.structure);
        const { formed, broken } = parseBondChanges(s.bonds);
        const title = s.title ?? `Step ${s.step}`;

        return (
          <article key={s.step} className="mech-step-card">
            <h3 className="mech-step-card__title">{title}</h3>
            <MechanismStepSchematic
              reactant={reactant}
              product={product}
              electronFlow={s.electronFlow}
              stepNo={s.step}
              totalSteps={total}
              title={title}
            />
            <div className="mech-step-card__bonds">
              <div className="mech-step-card__chip mech-step-card__chip--form">
                <span className="mech-step-card__chip-label">Bonds formed</span>
                <ChemFormattedLine text={formed} />
              </div>
              <div className="mech-step-card__chip mech-step-card__chip--break">
                <span className="mech-step-card__chip-label">Bonds broken</span>
                <ChemFormattedLine text={broken} />
              </div>
            </div>
            <div className="mech-step-card__line">
              <span className="mech-step-card__line-label">Line notation</span>
              <pre className="mech-step-card__structure chem-structure-line">{s.structure}</pre>
            </div>
          </article>
        );
      })}
    </div>
  );
}
