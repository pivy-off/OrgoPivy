import Link from "next/link";

type Topic = {
  id: string;
  title: string;
  short: string;
};

const COURSE_TOPICS: Record<string, { title: string; topics: Topic[] }> = {
  chem1: {
    title: "Chem 1",
    topics: [
      { id: "foundations", title: "Foundations", short: "Units, sig figs, basics" },
      { id: "stoichiometry", title: "Stoichiometry", short: "Moles, limiting reagent, yields" },
      { id: "thermo", title: "Thermochemistry", short: "Enthalpy, Hess law" },
      { id: "equilibrium", title: "Equilibrium", short: "K, ICE tables" },
      { id: "acids-bases", title: "Acids and bases", short: "pH, pKa, buffers" },

      { id: "ir", title: "IR spectroscopy", short: "Functional group ID" },
      { id: "h1-nmr", title: "1H NMR", short: "Shifts, splitting, integration" },
      { id: "c13-nmr", title: "13C NMR", short: "Carbon environments" },
      { id: "structure-determination", title: "Structure determination", short: "Use evidence to solve" },
    ],
  },

  ochem2: {
    title: "Ochem 2",
    topics: [
      { id: "alcohols-ethers-epoxides", title: "Alcohols, ethers, epoxides", short: "Reactivity and openings" },
      { id: "carbonyl-chemistry", title: "Carbonyl chemistry", short: "Additions and mechanisms" },
      { id: "carboxylic-acids-derivatives", title: "Carboxylic acids and derivatives", short: "Substitution pathways" },
      { id: "enolate-chemistry", title: "Enolate chemistry", short: "Aldol, Claisen, Michael" },
      { id: "aromatic-chemistry", title: "Aromatic chemistry", short: "EAS and directing" },
      { id: "amines", title: "Amines", short: "Basicity, reactions" },
      { id: "multistep-synthesis", title: "Multistep synthesis", short: "Planning and strategy" },

      { id: "ir", title: "IR spectroscopy", short: "Functional group ID" },
      { id: "h1-nmr", title: "1H NMR", short: "Shifts, splitting, integration" },
      { id: "c13-nmr", title: "13C NMR", short: "Carbon environments" },
      { id: "splitting-patterns", title: "Splitting patterns", short: "n plus 1, coupling" },
      { id: "integration", title: "Integration", short: "Relative proton counts" },
      { id: "structure-determination", title: "Structure determination", short: "Use evidence to solve" },
    ],
  },
};

export default function CoursePage({ params }: { params: { courseId: string } }) {
  const courseId = (params.courseId || "").toLowerCase();
  const course = COURSE_TOPICS[courseId];

  if (!course) {
    return (
      <main className="stack">
        <div className="card">
          <div className="cardInner">
            <div className="h1">Course not found</div>
            <div className="subtle">Go back home and pick Chem 1 or Ochem 2</div>
            <div style={{ marginTop: 12 }}>
              <Link className="btn btnPrimary" href="/">
                Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="stack">
      <div className="card">
        <div className="cardInner">
          <div className="h1">{course.title}</div>
          <div className="subtle">Pick a topic then follow the study checklist and tools</div>
        </div>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {course.topics.map((t) => (
          <Link key={t.id} href={`/course/${courseId}/${t.id}`} className="navLink">
            <span style={{ fontWeight: 950 }}>{t.title}</span>
            <span className="subtle">{t.short}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
