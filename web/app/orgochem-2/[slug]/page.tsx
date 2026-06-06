import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findTopic } from "@/app/lib/curriculum";
import MustKnowChecklist from "@/app/components/MustKnowChecklist";
import StudyStepsChecklist from "@/app/components/StudyStepsChecklist";
import TopicCurriculumImages from "@/app/components/TopicCurriculumImages";
import OrgChem2MechanismStepCards from "@/app/components/OrgChem2MechanismStepCards";
import OrgChem2ReactionTables from "@/app/components/OrgChem2ReactionTables";
import { ChemFormattedLine } from "@/app/lib/chemTypography";
import { getOrgChem2MechanismSupplementalSvg } from "@/app/lib/orgochem2MechanismSupplementalSvg";
import TopicHeroDiagramView from "@/app/components/TopicHeroDiagram";
import TopicToolsGrid from "@/components/TopicToolsGrid";
import TopicBookmarkButton from "@/app/components/TopicBookmarkButton";
import { TopicTabbedLayout, TopicTabPanel } from "@/app/components/TopicTabbedLayout";
import YouTubeTutorialCard from "@/components/YouTubeTutorialCard";
import { partitionHowToStudy } from "@/lib/studySteps";

function TopicIllustration({ slug, title }: { slug: string; title: string }) {
  const common = {
    width: "100%",
    height: 240,
    viewBox: "0 0 900 240",
    role: "img" as const,
    "aria-label": `${title} illustration`,
  };

  const bg = (
    <defs>
      <linearGradient id="g0" x1="0" x2="1">
        <stop offset="0" stopColor="var(--primary)" stopOpacity="0.18" />
        <stop offset="1" stopColor="var(--accent)" stopOpacity="0.18" />
      </linearGradient>
    </defs>
  );

  if (slug === "resonance-acid-base-review") {
    return (
      <svg {...common}>
        {bg}
        <rect x="0" y="0" width="900" height="240" rx="18" fill="url(#g0)" />
        <text x="28" y="54" fontSize="20" fontWeight="950" fill="var(--text)">
          Acid-base equilibrium
        </text>
        <text x="28" y="82" fontSize="13" fill="var(--muted)">
          pKa comparison — weaker acid (higher pKa) on the product side
        </text>
        <text x="200" y="150" fontSize="15" fill="var(--text)" fontWeight="700">
          H–A + B: → A:⁻ + H–B⁺
        </text>
        <text x="600" y="132" fontSize="14" fill="var(--muted)">
          Compare
        </text>
        <text x="600" y="158" fontSize="14" fill="var(--text)" fontWeight="900">
          pKa table
        </text>
      </svg>
    );
  }

  if (slug === "substitution-elimination-nmr-review") {
    return (
      <svg {...common}>
        {bg}
        <rect x="0" y="0" width="900" height="240" rx="18" fill="url(#g0)" />
        <text x="28" y="54" fontSize="20" fontWeight="950" fill="var(--text)">
          SN2 reaction
        </text>
        <text x="28" y="82" fontSize="13" fill="var(--muted)">
          Primary substrate · δ (ppm) · integration
        </text>
        <text x="160" y="150" fontSize="14" fill="var(--text)" fontWeight="700">
          Nu:⁻ + R–X → Nu–R + X:⁻
        </text>
        <text x="600" y="132" fontSize="14" fill="var(--muted)">
          Reagent
        </text>
        <text x="600" y="158" fontSize="14" fill="var(--text)" fontWeight="900">
          1° RX + strong Nu
        </text>
      </svg>
    );
  }

  if (slug === "alcohols-phenols") {
    return (
      <svg {...common}>
        {bg}
        <rect x="0" y="0" width="900" height="240" rx="18" fill="url(#g0)" />
        <text x="28" y="54" fontSize="20" fontWeight="950" fill="var(--text)">
          Alcohol oxidation
        </text>
        <text x="28" y="82" fontSize="13" fill="var(--muted)">
          R–CH₂–OH → R–CHO → R–COOH · choose oxidant
        </text>

        <line x1="280" y1="150" x2="380" y2="150" stroke="var(--text)" strokeOpacity="0.6" strokeWidth="4" />
        <text x="330" y="145" fontSize="14" fill="var(--text)" fontWeight="700">OH</text>

        <path d="M 400 150 L 500 120 L 500 180 Z" fill="none" stroke="var(--text)" strokeOpacity="0.4" strokeWidth="3" />
        <text x="520" y="150" fontSize="14" fill="var(--text)" fontWeight="700">O</text>

        <text x="600" y="140" fontSize="14" fill="var(--muted)">Reagent</text>
        <text x="600" y="160" fontSize="14" fill="var(--text)" fontWeight="900">PCC or CrO₃</text>
      </svg>
    );
  }

  if (slug === "ethers-epoxides") {
    return (
      <svg {...common}>
        {bg}
        <rect x="0" y="0" width="900" height="240" rx="18" fill="url(#g0)" />
        <text x="28" y="54" fontSize="20" fontWeight="950" fill="var(--text)">
          Epoxide opening
        </text>
        <text x="28" y="82" fontSize="13" fill="var(--muted)">
          epoxide + Nu → trans diol · acid or base conditions
        </text>

        <polygon points="300,150 350,120 400,150 350,180" fill="none" stroke="var(--text)" strokeOpacity="0.6" strokeWidth="4" />
        <text x="350" y="150" fontSize="12" fill="var(--text)" fontWeight="700">O</text>

        <path d="M 450 150 L 550 130" fill="none" stroke="var(--text)" strokeOpacity="0.4" strokeWidth="3" />
        <text x="570" y="135" fontSize="14" fill="var(--text)" fontWeight="700">OH</text>

        <text x="650" y="140" fontSize="14" fill="var(--muted)">Conditions</text>
        <text x="650" y="160" fontSize="14" fill="var(--text)" fontWeight="900">Acid or base</text>
      </svg>
    );
  }

  if (slug === "grignard-reaction") {
    return (
      <svg {...common}>
        {bg}
        <rect x="0" y="0" width="900" height="240" rx="18" fill="url(#g0)" />
        <text x="28" y="54" fontSize="20" fontWeight="950" fill="var(--text)">
          Grignard addition
        </text>
        <text x="28" y="82" fontSize="13" fill="var(--muted)">
          R–MgBr + C=O → after workup → C–OH
        </text>
        <text x="220" y="150" fontSize="14" fill="var(--text)" fontWeight="700">
          R–MgBr + C=O → R–C–OH
        </text>
        <text x="600" y="132" fontSize="14" fill="var(--muted)">
          Reagent
        </text>
        <text x="600" y="158" fontSize="14" fill="var(--text)" fontWeight="900">
          Ether solvent
        </text>
      </svg>
    );
  }

  if (slug === "aldehydes-ketones") {
    return (
      <svg {...common}>
        {bg}
        <rect x="0" y="0" width="900" height="240" rx="18" fill="url(#g0)" />
        <text x="28" y="54" fontSize="20" fontWeight="950" fill="var(--text)">
          Nucleophilic addition
        </text>
        <text x="28" y="82" fontSize="13" fill="var(--muted)">
          C=O + Nu:⁻ → tetrahedral alkoxide
        </text>
        <text x="200" y="150" fontSize="14" fill="var(--text)" fontWeight="700">
          C=O + Nu:⁻ → C(–O⁻)(–Nu)
        </text>
        <text x="600" y="132" fontSize="14" fill="var(--muted)">
          Selectivity
        </text>
        <text x="600" y="158" fontSize="14" fill="var(--text)" fontWeight="900">
          Aldehyde &gt; ketone
        </text>
      </svg>
    );
  }

  if (
    slug.includes("carbonyl") ||
    slug === "grignard-reaction-lab" ||
    slug === "organometallic-reactions"
  ) {
    return (
      <svg {...common}>
        {bg}
        <rect x="0" y="0" width="900" height="240" rx="18" fill="url(#g0)" />
        <text x="28" y="54" fontSize="20" fontWeight="950" fill="var(--text)">
          Carbonyl logic
        </text>
        <text x="28" y="82" fontSize="13" fill="var(--muted)">
          Decide addition vs substitution first
        </text>

        <line x1="300" y1="155" x2="420" y2="155" stroke="var(--text)" strokeOpacity="0.55" strokeWidth="5" />
        <line x1="300" y1="145" x2="420" y2="145" stroke="var(--text)" strokeOpacity="0.25" strokeWidth="5" />
        <text x="440" y="155" fontSize="16" fill="var(--text)" fontWeight="950">
          O
        </text>

        <rect x="560" y="110" width="160" height="50" rx="12" fill="var(--panel)" stroke="var(--border)" />
        <text x="585" y="142" fontSize="14" fill="var(--text)" fontWeight="900">
          Nucleophile
        </text>

        <line x1="520" y1="150" x2="560" y2="135" stroke="var(--text)" strokeOpacity="0.35" strokeWidth="4" />
      </svg>
    );
  }

  if (slug.includes("carboxylic-acids")) {
    return (
      <svg {...common}>
        {bg}
        <rect x="0" y="0" width="900" height="240" rx="18" fill="url(#g0)" />
        <text x="28" y="54" fontSize="20" fontWeight="950" fill="var(--text)">
          Acyl substitution
        </text>
        <text x="28" y="82" fontSize="13" fill="var(--muted)">
          Reactivity: Cl {'>'} Anhydride {'>'} Ester {'>'} Acid {'>'} Amide
        </text>

        <line x1="280" y1="150" x2="380" y2="150" stroke="var(--text)" strokeOpacity="0.6" strokeWidth="4" />
        <text x="330" y="145" fontSize="14" fill="var(--text)" fontWeight="700">O</text>
        <text x="330" y="165" fontSize="12" fill="var(--text)" fontWeight="700">R</text>

        <path d="M 400 150 L 500 130 L 500 170 Z" fill="none" stroke="var(--text)" strokeOpacity="0.4" strokeWidth="3" />
        <text x="520" y="150" fontSize="14" fill="var(--text)" fontWeight="700">Nu</text>

        <text x="600" y="140" fontSize="14" fill="var(--muted)">Intermediate</text>
        <text x="600" y="160" fontSize="14" fill="var(--text)" fontWeight="900">Tetrahedral adduct</text>
      </svg>
    );
  }

  if (slug === "aldehydes-ketones-part-b") {
    return (
      <svg {...common}>
        {bg}
        <rect x="0" y="0" width="900" height="240" rx="18" fill="url(#g0)" />
        <text x="28" y="54" fontSize="20" fontWeight="950" fill="var(--text)">
          Enolate chemistry
        </text>
        <text x="28" y="82" fontSize="13" fill="var(--muted)">
          Alpha position → Enolate → C-C bond formation
        </text>

        <line x1="280" y1="150" x2="380" y2="150" stroke="var(--text)" strokeOpacity="0.6" strokeWidth="4" />
        <text x="330" y="145" fontSize="14" fill="var(--text)" fontWeight="700">O</text>
        <circle cx="300" cy="150" r="8" fill="var(--text)" fillOpacity="0.6" />
        <text x="290" y="155" fontSize="10" fill="var(--text)" fontWeight="700">α</text>

        <path d="M 400 150 L 500 120 L 500 180 Z" fill="none" stroke="var(--text)" strokeOpacity="0.4" strokeWidth="3" />
        <text x="520" y="150" fontSize="14" fill="var(--text)" fontWeight="700">C-C</text>

        <text x="600" y="140" fontSize="14" fill="var(--muted)">Reactions</text>
        <text x="600" y="160" fontSize="14" fill="var(--text)" fontWeight="900">Aldol, Claisen, Michael</text>
      </svg>
    );
  }

  if (slug === "electrophilic-aromatic-substitution" || slug === "eas-substituent-directing-effects") {
    return (
      <svg {...common}>
        {bg}
        <rect x="0" y="0" width="900" height="240" rx="18" fill="url(#g0)" />
        <text x="28" y="54" fontSize="20" fontWeight="950" fill="var(--text)">
          EAS mechanism
        </text>
        <text x="28" y="82" fontSize="13" fill="var(--muted)">
          Ar–H + E⁺ → Ar–E + H⁺
        </text>

        <polygon points="300,120 320,100 360,100 380,120 360,140 320,140" fill="none" stroke="var(--text)" strokeOpacity="0.6" strokeWidth="4" />
        <text x="340" y="130" fontSize="12" fill="var(--text)" fontWeight="700">
          Ar
        </text>

        <path d="M 400 130 L 500 110 L 500 150 Z" fill="none" stroke="var(--text)" strokeOpacity="0.4" strokeWidth="3" />
        <text x="520" y="130" fontSize="14" fill="var(--text)" fontWeight="700">
          E⁺
        </text>

        <text x="600" y="120" fontSize="14" fill="var(--muted)">
          Catalyst
        </text>
        <text x="600" y="140" fontSize="14" fill="var(--text)" fontWeight="900">
          Lewis acid
        </text>
      </svg>
    );
  }

  if (slug === "nucleophilic-aromatic-substitution" || slug === "aromatic-side-chain-reactions") {
    return (
      <svg {...common}>
        {bg}
        <rect x="0" y="0" width="900" height="240" rx="18" fill="url(#g0)" />
        <text x="28" y="54" fontSize="20" fontWeight="950" fill="var(--text)">
          NAS mechanism
        </text>
        <text x="28" y="82" fontSize="13" fill="var(--muted)">
          Ar–X + Nu:⁻ → Ar–Nu + X:⁻
        </text>

        <polygon points="300,120 320,100 360,100 380,120 360,140 320,140" fill="none" stroke="var(--text)" strokeOpacity="0.6" strokeWidth="4" />
        <text x="340" y="130" fontSize="12" fill="var(--text)" fontWeight="700">
          Ar–X
        </text>

        <path d="M 400 130 L 500 110 L 500 150 Z" fill="none" stroke="var(--text)" strokeOpacity="0.4" strokeWidth="3" />
        <text x="520" y="130" fontSize="14" fill="var(--text)" fontWeight="700">
          Nu:⁻
        </text>

        <text x="600" y="120" fontSize="14" fill="var(--muted)">
          Activation
        </text>
        <text x="600" y="140" fontSize="14" fill="var(--text)" fontWeight="900">
          EWG required
        </text>
      </svg>
    );
  }

  if (slug === "diels-alder-reaction" || slug === "conjugated-systems" || slug === "conjugated-compounds-diels-alder") {
    return (
      <svg {...common}>
        {bg}
        <rect x="0" y="0" width="900" height="240" rx="18" fill="url(#g0)" />
        <text x="28" y="54" fontSize="20" fontWeight="950" fill="var(--text)">
          Diels-Alder
        </text>
        <text x="28" y="82" fontSize="13" fill="var(--muted)">
          diene + dienophile → cyclohexene · concerted [4+2]
        </text>
        <path d="M 260 150 L 320 120 L 380 150 L 320 180 Z" fill="none" stroke="var(--text)" strokeOpacity="0.55" strokeWidth="3" />
        <path d="M 420 150 L 520 150" stroke="var(--text)" strokeOpacity="0.35" strokeWidth="4" />
        <rect x="560" y="115" width="200" height="70" rx="12" fill="var(--panel)" stroke="var(--border)" />
        <text x="575" y="145" fontSize="13" fill="var(--text)" fontWeight="800">
          Heat · [4+2]
        </text>
        <text x="575" y="165" fontSize="12" fill="var(--muted)">
          s-cis diene required
        </text>
      </svg>
    );
  }

  if (slug === "organohalides-radical") {
    return (
      <svg {...common}>
        {bg}
        <rect x="0" y="0" width="900" height="240" rx="18" fill="url(#g0)" />
        <text x="28" y="54" fontSize="20" fontWeight="950" fill="var(--text)">
          Allylic bromination
        </text>
        <text x="28" y="82" fontSize="13" fill="var(--muted)">
          [alkene] + NBS → [allylic bromide] · radical chain
        </text>
        <circle cx="320" cy="150" r="10" fill="var(--text)" fillOpacity="0.75" />
        <text x="340" y="155" fontSize="14" fill="var(--text)" fontWeight="800">
          X·
        </text>
        <path d="M 380 150 L 468 150" stroke="var(--text)" strokeOpacity="0.4" strokeWidth="4" />
        <path d="M 462 146 L 478 150 L 462 154 Z" fill="var(--text)" fillOpacity="0.55" />
        <text x="520" y="132" fontSize="14" fill="var(--muted)">
          Reagent
        </text>
        <text x="520" y="158" fontSize="14" fill="var(--text)" fontWeight="900">
          NBS, hν
        </text>
      </svg>
    );
  }

  if (slug === "alkynes") {
    return (
      <svg {...common}>
        {bg}
        <rect x="0" y="0" width="900" height="240" rx="18" fill="url(#g0)" />
        <text x="28" y="54" fontSize="20" fontWeight="950" fill="var(--text)">
          Alkyne hydration
        </text>
        <text x="28" y="82" fontSize="13" fill="var(--muted)">
          RC≡CH + H₂O → RC(=O)CH₃ (after tautomerization)
        </text>
        <line x1="280" y1="150" x2="400" y2="150" stroke="var(--text)" strokeOpacity="0.65" strokeWidth="5" />
        <line x1="280" y1="142" x2="400" y2="142" stroke="var(--text)" strokeOpacity="0.65" strokeWidth="5" />
        <text x="420" y="155" fontSize="14" fill="var(--text)" fontWeight="900">
          C≡C
        </text>
        <text x="560" y="132" fontSize="14" fill="var(--muted)">
          Reagent
        </text>
        <text x="560" y="158" fontSize="14" fill="var(--text)" fontWeight="850">
          HgSO₄, H₂SO₄
        </text>
      </svg>
    );
  }

  if (slug === "aromaticity") {
    return (
      <svg {...common}>
        {bg}
        <rect x="0" y="0" width="900" height="240" rx="18" fill="url(#g0)" />
        <text x="28" y="54" fontSize="20" fontWeight="950" fill="var(--text)">
          {`Hückel's rule`}
        </text>
        <text x="28" y="82" fontSize="13" fill="var(--muted)">
          4n+2 π electrons → aromatic · cyclic + planar + conjugated
        </text>
        <polygon points="300,120 320,100 360,100 380,120 360,140 320,140" fill="none" stroke="var(--text)" strokeOpacity="0.65" strokeWidth="4" />
        <circle cx="340" cy="120" r="22" fill="none" stroke="var(--primary)" strokeOpacity="0.35" strokeWidth="3" />
        <text x="520" y="140" fontSize="14" fill="var(--text)" fontWeight="900">
          6 π electrons (n=1)
        </text>
      </svg>
    );
  }

  if (slug === "proton-nmr-review" || slug === "nmr-spectroscopy-review") {
    return (
      <svg {...common}>
        {bg}
        <rect x="0" y="0" width="900" height="240" rx="18" fill="url(#g0)" />
        <text x="28" y="54" fontSize="20" fontWeight="950" fill="var(--text)">
          ¹H NMR review
        </text>
        <text x="28" y="82" fontSize="13" fill="var(--muted)">
          δ · integration · splitting (n+1) · coupling
        </text>
        <rect x="260" y="120" width="360" height="60" rx="12" fill="var(--panel)" stroke="var(--border)" />
        <text x="280" y="148" fontSize="13" fill="var(--text)" fontWeight="800">
          Triplet · Quartet · Multiplet
        </text>
        <text x="280" y="168" fontSize="12" fill="var(--muted)">
          Predict spectrum from structure before peak hunting
        </text>
      </svg>
    );
  }

  return (
    <svg {...common}>
      {bg}
      <rect x="0" y="0" width="900" height="240" rx="18" fill="url(#g0)" />
      <text x="28" y="54" fontSize="20" fontWeight="950" fill="var(--text)">
        {title}
      </text>
      <text x="28" y="82" fontSize="13" fill="var(--muted)">
        CHM 222 topic visual
      </text>
    </svg>
  );
}

function Section({
  title,
  right,
  children,
}: {
  title: string;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="card topicSection" style={{ boxShadow: "none" }}>
      <div className="cardInner" style={{ padding: 14 }}>
        <div className="topicSectionHeader">
          <div className="topicSectionTitle">{title}</div>
          {right ? <div className="topicSectionRight">{right}</div> : null}
        </div>
        <div className="topicSectionBody">{children}</div>
      </div>
    </div>
  );
}

function Mistakes({ items }: { items: string[] }) {
  return (
    <div className="topicMistakes">
      {items.map((t, i) => (
        <div key={`${i}-${t}`} className="topicMistakeItem">
          <span aria-hidden="true">⚠️ </span>
          <ChemFormattedLine text={t} />
        </div>
      ))}
    </div>
  );
}

export default async function OrgoChem2TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = findTopic("orgochem-2", slug);
  if (!topic) return notFound();

  const supplementalSvg = topic.hasMechanism ? getOrgChem2MechanismSupplementalSvg(topic.slug) : undefined;
  const hasSpectraImages = topic.images?.some((im) => im.section === "spectra") ?? false;
  const { steps: studySteps, tips: extractedTips } = partitionHowToStudy(topic.howToStudy);
  const tipItems = [
    ...extractedTips,
    ...(topic.tips ?? []),
  ];
  const displayTips =
    tipItems.length > 0
      ? tipItems
      : [
          "Keep Week 1–2 skills warm: resonance and acid–base arguments belong in every later mechanism",
          "For aromatics, decide EAS vs NAS vs side-chain chemistry before drawing arrows",
          "For carbonyls and derivatives, label addition vs acyl substitution before predicting products",
        ];

  return (
    <main className="stack orgochem2-topic">
      <div className="card">
        <div className="cardInner">
          <div className="stack">
            <div className="topicTopRow">
              <div className="topicTopLeft">
                <div className="subtle">OrgoChem II</div>
                <h1 className="h1">{topic.title}</h1>
                <div className="subtle">{topic.shortDesc}</div>
              </div>

              <div className="topicTopActions">
                <TopicBookmarkButton course="orgochem-2" topic={topic.slug} />
                <Link className="btn" href="/orgochem-2">
                  Back
                </Link>
              </div>
            </div>

            <div className="topicHero">
              {topic.heroDiagram ? (
                <TopicHeroDiagramView diagram={topic.heroDiagram} />
              ) : (
                <TopicIllustration slug={topic.slug} title={topic.title} />
              )}
            </div>

            <TopicTabbedLayout>
            <TopicTabPanel id="overview">
            <Section
              title="Summary"
              right={
                <a className="btn topicExtBtn" href={topic.externalUrl} target="_blank" rel="noreferrer">
                  Open full reference
                </a>
              }
            >
              <div className="topicSummaryText">
                <div className="orgochem2SummaryBody">
                  <ChemFormattedLine text={topic.summary} />
                </div>
                <TopicCurriculumImages images={topic.images} section="summary" />
                {topic.overviewVideoId ? (
                  <div style={{ marginTop: 16 }}>
                    <div className="topicVideoLabel">Video Tutorial</div>
                    <YouTubeTutorialCard
                      videoId={topic.overviewVideoId}
                      title={`${topic.title} — overview`}
                    />
                  </div>
                ) : null}
                <div className="topicCallout">
                  <div className="topicCalloutTitle">What you need to know:</div>
                  <div className="topicCalloutBody">
                    This topic covers {topic.title.toLowerCase()}. Focus on mastering the key concepts in the
                    &quot;Must know checklist&quot; below. Follow the study steps systematically, and use practice
                    problems to reinforce your understanding. The external reference provides comprehensive coverage of
                    all concepts.
                  </div>
                </div>
              </div>
            </Section>

            <OrgChem2ReactionTables slug={topic.slug} />

            <div className="topicTwoCol">
              <Section title="Must know checklist">
                <MustKnowChecklist
                  chemPolish
                  items={topic.mustKnow}
                  structuredItems={topic.mustKnowItems}
                  course="orgochem-2"
                  topic={topic.slug}
                />
              </Section>

              <Section title="Common mistakes">
                <Mistakes
                  items={
                    topic.commonMistakes && topic.commonMistakes.length > 0
                      ? topic.commonMistakes
                      : [
                          "Skipping resonance or acid–base reasoning before drawing a mechanism",
                          "Treating every carbonyl problem as addition without checking for acyl substitution",
                          "Misordering EAS steps on disubstituted benzenes",
                        ]
                  }
                />
              </Section>
            </div>
            </TopicTabPanel>

            <TopicTabPanel id="study">
            {topic.hasMechanism ? (
              <Section title="Mechanism steps">
                <OrgChem2MechanismStepCards slug={topic.slug} />
              </Section>
            ) : null}

            {topic.hasMechanism ? (
              <Section
                title="Mechanism visuals"
                right={
                  <Link className="btn btnPrimary" href={`/orgochem-2/${encodeURIComponent(topic.slug)}/mechanisms`}>
                    Open step-by-step viewer
                  </Link>
                }
              >
                <p className="topicReadable" style={{ marginBottom: 12 }}>
                  Each step shows <strong>reactants → products</strong> in line notation with curved-arrow electron flow.
                  Open the viewer for pathway tabs (SN₂ vs E₂, acid vs base epoxide opening, etc.).
                </p>
                <TopicCurriculumImages images={topic.images} section="mechanism" />
                {supplementalSvg ? (
                  <div className="orgochem2MechanismSupplemental" style={{ marginTop: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Arrow-pushing summary</div>
                    <div dangerouslySetInnerHTML={{ __html: supplementalSvg }} />
                  </div>
                ) : null}
              </Section>
            ) : null}

            {hasSpectraImages ? (
              <Section title="Spectra" right={topic.practiceHref === "/spectra" ? <Link className="btn" href="/spectra">NMR Studio</Link> : null}>
                <TopicCurriculumImages images={topic.images} section="spectra" />
              </Section>
            ) : null}

            <Section title="Study steps">
              <StudyStepsChecklist chemPolish items={studySteps} course="orgochem-2" topic={topic.slug} />
            </Section>

            <Section title="💡 Tips">
                <div className="topicTips">
                  {displayTips.map((t, i) => (
                    <div key={i} className="topicTipItem topicReadable">
                      <ChemFormattedLine text={t} />
                    </div>
                  ))}
                </div>
              </Section>
            </TopicTabPanel>

            <TopicTabPanel id="practice">
            {topic.practiceMcqs && topic.practiceMcqs.length > 0 ? (
              <Section
                title="Practice questions"
                right={
                  <Link
                    className="btn btnPrimary"
                    href={`/orgochem-2/${encodeURIComponent(topic.slug)}/practice`}
                  >
                    Open practice hub
                  </Link>
                }
              >
                <p className="topicReadable" style={{ margin: "0 0 12px" }}>
                  {topic.practiceMcqs.length} multiple-choice questions — each on its own page for focused study.
                </p>
                <div className="topicToolRow" style={{ flexWrap: "wrap", gap: 8 }}>
                  {topic.practiceMcqs.map((_, i) => (
                    <Link
                      key={i}
                      className="btn"
                      href={`/orgochem-2/${encodeURIComponent(topic.slug)}/practice/${i + 1}`}
                    >
                      Question {i + 1}
                    </Link>
                  ))}
                </div>
              </Section>
            ) : null}

            <Section title="Exam practice & drills">
              <TopicCurriculumImages images={topic.images} section="practice" />
              {topic.practiceHref ? (
                <div className="topicPracticeRow" style={{ marginBottom: 12 }}>
                  <div className="topicPracticeText">
                    Open the linked drill (interactive practice, NMR studio, quiz, or exam bank).
                  </div>
                  <Link className="btn btnPrimary" href={topic.practiceHref}>
                    Open linked drill
                  </Link>
                </div>
              ) : null}
              <div className="topicToolRow" style={{ flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                <Link
                  className="btn btnPrimary"
                  href={`/orgochem-2/exams?topic=${encodeURIComponent(topic.slug)}`}
                >
                  Practice This Topic
                </Link>
                <Link className="btn" href="/orgochem-2/exams">
                  Full Exam Hub
                </Link>
                <Link className="btn" href={`/orgochem-2/${encodeURIComponent(topic.slug)}/practice-exam`}>
                  Timed practice exam
                </Link>
                <a
                  className="btn"
                  href={`/api/exam-guide?course=orgochem-2&topic=${encodeURIComponent(topic.slug)}`}
                  download
                >
                  Download study guide
                </a>
              </div>
              <p className="subtle" style={{ margin: 0, fontSize: 13, lineHeight: 1.5 }}>
                Timed mode uses the same question bank as above. Download a Word study guide generated from this topic&apos;s content.
              </p>
            </Section>
            </TopicTabPanel>

            <TopicTabPanel id="resources">
            <Section title="Tools">
              <div className="topicToolRow">
                {topic.hasMechanism ? (
                  <Link className="btn btnPrimary" href={`/orgochem-2/${encodeURIComponent(topic.slug)}/mechanisms`}>
                    Mechanism viewer
                  </Link>
                ) : null}
                {topic.slug === "nmr-spectroscopy-review" || topic.slug === "substitution-elimination-nmr-review" ? (
                  <Link className="btn" href="/spectra">
                    NMR Studio (reference spectra)
                  </Link>
                ) : null}
              </div>

              <div className="topicToolRow">
                <Link className="btn" href={`/ask?course=orgochem-2&topic=${encodeURIComponent(topic.slug)}`}>
                  Ask questions
                </Link>
                <Link className="btn" href={`/uploads?course=orgochem-2&topic=${encodeURIComponent(topic.slug)}`}>
                  Upload notes
                </Link>
              </div>
            </Section>

            <Section title="Deep study tools">
              <TopicToolsGrid slug={topic.slug} title={topic.title} />
            </Section>
            </TopicTabPanel>
            </TopicTabbedLayout>

          </div>
        </div>
      </div>
    </main>
  );
}
