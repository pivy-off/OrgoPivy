import Link from "next/link";
import { notFound } from "next/navigation";
import { findTopic } from "../../lib/curriculum";
import MustKnowChecklist from "../../components/MustKnowChecklist";
import StudyStepsChecklist from "../../components/StudyStepsChecklist";
import StudyTimer from "../../components/StudyTimer";
import BookmarkButton from "../../components/BookmarkButton";
import StudyNotes from "../../components/StudyNotes";
import TopicIllustrationClient from "../../components/TopicIllustrationClient";
import MemorizationSection from "../../components/MemorizationSection";
import MemorizationFlashcards from "../../components/MemorizationFlashcards";
import ExportStudyGuide from "../../components/ExportStudyGuide";
import AchieveHomework from "../../components/AchieveHomework";
function TopicIllustration({ slug, title, imageUrl, imageAlt }: { slug: string; title: string; imageUrl?: string; imageAlt?: string }) {
  // Use client component for images with SVG fallback
  if (imageUrl) {
    return (
      <div style={{ position: "relative", width: "100%" }}>
        <div style={{ position: "absolute", width: "100%", zIndex: 2 }}>
          <TopicIllustrationClient slug={slug} title={title} imageUrl={imageUrl} imageAlt={imageAlt} />
        </div>
        <div style={{ position: "relative", width: "100%", zIndex: 1 }}>
          {createSVGIllustration(slug, title)}
        </div>
      </div>
    );
  }

  // Fallback to SVG illustrations
  return createSVGIllustration(slug, title);
}

function createSVGIllustration(slug: string, title: string) {
  const common = {
    width: "100%",
    height: 320,
    viewBox: "0 0 900 320",
    role: "img" as const,
    "aria-label": `${title} illustration`,
    style: { display: "block" },
  };

  if (slug === "alkanes") {
    return (
      <svg {...common}>
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0" stopColor="var(--primary)" stopOpacity="0.22" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0.22" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="900" height="320" rx="18" fill="url(#g1)" />
        <text x="28" y="54" fontSize="20" fontWeight="950" fill="var(--text)">
          Newman projection mindset
        </text>
        <text x="28" y="82" fontSize="13" fill="var(--muted)">
          Compare staggered vs eclipsed to predict stability fast
        </text>

        <circle cx="300" cy="150" r="42" fill="none" stroke="var(--text)" strokeOpacity="0.55" strokeWidth="3" />
        <circle cx="300" cy="150" r="14" fill="var(--text)" fillOpacity="0.55" />

        <line x1="300" y1="150" x2="240" y2="110" stroke="var(--text)" strokeOpacity="0.6" strokeWidth="4" />
        <line x1="300" y1="150" x2="300" y2="90" stroke="var(--text)" strokeOpacity="0.6" strokeWidth="4" />
        <line x1="300" y1="150" x2="360" y2="110" stroke="var(--text)" strokeOpacity="0.6" strokeWidth="4" />

        <line x1="300" y1="150" x2="250" y2="190" stroke="var(--text)" strokeOpacity="0.35" strokeWidth="4" />
        <line x1="300" y1="150" x2="300" y2="210" stroke="var(--text)" strokeOpacity="0.35" strokeWidth="4" />
        <line x1="300" y1="150" x2="350" y2="190" stroke="var(--text)" strokeOpacity="0.35" strokeWidth="4" />

        <text x="420" y="140" fontSize="14" fill="var(--muted)">
          Rule
        </text>
        <text x="420" y="164" fontSize="14" fill="var(--text)" fontWeight="900">
          More staggered means more stable
        </text>
      </svg>
    );
  }

  if (slug === "cycloalkanes") {
    return (
      <svg {...common}>
        <defs>
          <linearGradient id="g2" x1="0" x2="1">
            <stop offset="0" stopColor="var(--primary)" stopOpacity="0.18" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0.18" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="900" height="320" rx="18" fill="url(#g2)" />
        <text x="28" y="54" fontSize="20" fontWeight="950" fill="var(--text)">
          Chair flips
        </text>
        <text x="28" y="82" fontSize="13" fill="var(--muted)">
          Up stays up, down stays down. Axial swaps with equatorial
        </text>

        <polyline
          points="320,170 380,120 460,140 520,100 600,140 540,190 460,170 400,210 320,170"
          fill="none"
          stroke="var(--text)"
          strokeOpacity="0.55"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        <line x1="380" y1="120" x2="380" y2="78" stroke="var(--text)" strokeOpacity="0.35" strokeWidth="3" />
        <line x1="460" y1="140" x2="460" y2="98" stroke="var(--text)" strokeOpacity="0.35" strokeWidth="3" />
        <line x1="540" y1="190" x2="540" y2="230" stroke="var(--text)" strokeOpacity="0.35" strokeWidth="3" />

        <text x="650" y="150" fontSize="14" fill="var(--muted)">
          Goal
        </text>
        <text x="650" y="174" fontSize="14" fill="var(--text)" fontWeight="900">
          Put bulky groups equatorial
        </text>
      </svg>
    );
  }

  if (slug === "stereochemistry") {
    return (
      <svg {...common}>
        <defs>
          <linearGradient id="g3" x1="0" x2="1">
            <stop offset="0" stopColor="var(--primary)" stopOpacity="0.18" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0.18" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="900" height="320" rx="18" fill="url(#g3)" />
        <text x="28" y="54" fontSize="20" fontWeight="950" fill="var(--text)">
          R and S quickly
        </text>
        <text x="28" y="82" fontSize="13" fill="var(--muted)">
          Priorities, lowest back, then clockwise or counterclockwise
        </text>

        <circle cx="360" cy="150" r="10" fill="var(--text)" fillOpacity="0.6" />
        <line x1="360" y1="150" x2="280" y2="110" stroke="var(--text)" strokeOpacity="0.55" strokeWidth="4" />
        <line x1="360" y1="150" x2="460" y2="110" stroke="var(--text)" strokeOpacity="0.55" strokeWidth="4" />
        <line x1="360" y1="150" x2="360" y2="225" stroke="var(--text)" strokeOpacity="0.55" strokeWidth="4" />
        <line x1="360" y1="150" x2="440" y2="200" stroke="var(--text)" strokeOpacity="0.25" strokeWidth="8" />

        <text x="510" y="150" fontSize="14" fill="var(--muted)">
          Habit
        </text>
        <text x="510" y="174" fontSize="14" fill="var(--text)" fontWeight="900">
          Decide first, then draw
        </text>
      </svg>
    );
  }

  if (slug === "substitution-elimination") {
    return (
      <svg {...common}>
        <defs>
          <linearGradient id="g4" x1="0" x2="1">
            <stop offset="0" stopColor="var(--primary)" stopOpacity="0.2" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="900" height="320" rx="18" fill="url(#g4)" />
        <text x="28" y="54" fontSize="20" fontWeight="950" fill="var(--text)">
          Pathway decision
        </text>
        <text x="28" y="82" fontSize="13" fill="var(--muted)">
          Substrate, nucleophile base, solvent, heat
        </text>

        <rect x="280" y="108" width="130" height="46" rx="12" fill="var(--panel)" stroke="var(--border)" />
        <text x="305" y="137" fontSize="14" fill="var(--text)" fontWeight="900">
          Substrate
        </text>

        <rect x="470" y="70" width="130" height="46" rx="12" fill="var(--panel)" stroke="var(--border)" />
        <text x="506" y="99" fontSize="14" fill="var(--text)" fontWeight="900">
          SN2
        </text>

        <rect x="470" y="148" width="130" height="46" rx="12" fill="var(--panel)" stroke="var(--border)" />
        <text x="506" y="177" fontSize="14" fill="var(--text)" fontWeight="900">
          E2
        </text>

        <line x1="410" y1="131" x2="470" y2="93" stroke="var(--text)" strokeOpacity="0.35" strokeWidth="4" />
        <line x1="410" y1="131" x2="470" y2="171" stroke="var(--text)" strokeOpacity="0.35" strokeWidth="4" />
      </svg>
    );
  }

  if (slug === "alkenes") {
    return (
      <svg {...common}>
        <defs>
          <linearGradient id="g5" x1="0" x2="1">
            <stop offset="0" stopColor="var(--primary)" stopOpacity="0.18" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0.18" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="900" height="320" rx="18" fill="url(#g5)" />
        <text x="28" y="54" fontSize="20" fontWeight="950" fill="var(--text)">
          Alkene additions
        </text>
        <text x="28" y="82" fontSize="13" fill="var(--muted)">
          Regio and stereo are the whole game
        </text>

        <line x1="300" y1="160" x2="420" y2="160" stroke="var(--text)" strokeOpacity="0.55" strokeWidth="5" />
        <line x1="300" y1="150" x2="420" y2="150" stroke="var(--text)" strokeOpacity="0.25" strokeWidth="5" />
        <circle cx="270" cy="155" r="12" fill="var(--text)" fillOpacity="0.35" />
        <circle cx="450" cy="155" r="12" fill="var(--text)" fillOpacity="0.35" />

        <path d="M520 155 C 560 120, 610 120, 650 155" fill="none" stroke="var(--text)" strokeOpacity="0.35" strokeWidth="5" />
        <text x="675" y="160" fontSize="14" fill="var(--text)" fontWeight="900">
          Product
        </text>
      </svg>
    );
  }

  if (slug === "spectroscopy") {
    return (
      <svg {...common}>
        <defs>
          <linearGradient id="g6" x1="0" x2="1">
            <stop offset="0" stopColor="var(--primary)" stopOpacity="0.18" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0.18" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="900" height="320" rx="18" fill="url(#g6)" />
        <text x="28" y="54" fontSize="20" fontWeight="950" fill="var(--text)">
          Spectroscopy analysis
        </text>
        <text x="28" y="82" fontSize="13" fill="var(--muted)">
          Predict structure first, then verify with spectra
        </text>

        {/* NMR spectrum representation */}
        <path d="M 280,180 L 300,160 L 320,170 L 340,150 L 360,175 L 380,140 L 400,165 L 420,155 L 440,180 L 460,145 L 480,170 L 500,160" 
          fill="none" stroke="var(--text)" strokeOpacity="0.6" strokeWidth="3" />
        
        {/* Peaks */}
        <line x1="300" y1="180" x2="300" y2="160" stroke="var(--text)" strokeOpacity="0.7" strokeWidth="2" />
        <line x1="360" y1="180" x2="360" y2="175" stroke="var(--text)" strokeOpacity="0.7" strokeWidth="2" />
        <line x1="440" y1="180" x2="440" y2="180" stroke="var(--text)" strokeOpacity="0.7" strokeWidth="2" />
        <line x1="480" y1="180" x2="480" y2="170" stroke="var(--text)" strokeOpacity="0.7" strokeWidth="2" />

        <text x="280" y="200" fontSize="12" fill="var(--muted)">δ (ppm)</text>
        
        <text x="600" y="140" fontSize="14" fill="var(--muted)">
          Key
        </text>
        <text x="600" y="164" fontSize="14" fill="var(--text)" fontWeight="900">
          IR + NMR = Structure
        </text>
      </svg>
    );
  }

  return (
    <svg {...common}>
      <defs>
        <linearGradient id="g0" x1="0" x2="1">
          <stop offset="0" stopColor="var(--primary)" stopOpacity="0.14" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0.14" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="900" height="320" rx="18" fill="url(#g0)" />
      <text x="28" y="54" fontSize="20" fontWeight="950" fill="var(--text)">
        {title}
      </text>
      <text x="28" y="82" fontSize="13" fill="var(--muted)">
        Visual guide
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
  right?: React.ReactNode;
  children: React.ReactNode;
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

function Checklist({ items }: { items: string[] }) {
  return (
    <div className="topicChecklist">
      {items.map((raw, i) => {
        const parts = raw.split(":");
        const head = (parts[0] || "").trim();
        const tail = parts.slice(1).join(":").trim();
        return (
          <div key={`${i}-${raw}`} className="topicCheckItem">
            <div className="topicCheckBox" aria-hidden="true" />
            <div className="topicCheckText">
              <div className="topicCheckHead">{head}</div>
              {tail ? <div className="topicCheckTail">{tail}</div> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Mistakes({ items }: { items: string[] }) {
  return (
    <div className="topicMistakes">
      {items.map((t, i) => (
        <div key={`${i}-${t}`} className="topicMistakeItem">
          {t}
        </div>
      ))}
    </div>
  );
}

function guessMechanismTag(slug: string) {
  if (slug.includes("substitution")) return "substitution";
  if (slug.includes("elimination")) return "elimination";
  if (slug.includes("alkene")) return "alkene";
  return slug;
}

export default async function OrgoChem1TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = findTopic("orgochem-1", slug);
  if (!topic) return notFound();

  const mechTag = guessMechanismTag(topic.slug);

  const commonMistakes: Record<string, string[]> = {
    alkanes: [
      "Forgetting to number the chain to give the lowest set of locants",
      "Mixing up anti and gauche when comparing stability",
      "Comparing structures without drawing Newman projections",
    ],
    cycloalkanes: [
      "Thinking chair flip changes up down stereochemistry",
      "Leaving a bulky group axial and not checking the flip",
      "Confusing cis trans on a ring with wedge dash on a flat drawing",
    ],
    stereochemistry: [
      "Not putting the lowest priority group to the back before deciding R or S",
      "Breaking CIP ties incorrectly at the first point of difference",
      "Calling a compound chiral without checking symmetry",
    ],
    "substitution-elimination": [
      "Choosing by memorized rules instead of substrate plus base nucleophile solvent heat",
      "Forgetting SN2 inversion and E2 anti requirement",
      "Ignoring bulky base pushing Hofmann product in E2",
    ],
    alkenes: [
      "Assuming Markovnikov always applies",
      "Forgetting syn vs anti addition outcomes",
      "Not checking rearrangements in carbocation pathways",
    ],
    spectroscopy: [
      "Peak hunting without a proposed structure first",
      "Ignoring integration and splitting in 1H NMR",
      "Over trusting one peak instead of matching all major signals",
    ],
  };

  return (
    <main className="stack">
      <div className="card">
        <div className="cardInner">
          <div className="stack">
            <div className="topicTopRow">
              <div className="topicTopLeft">
                <div className="subtle">OrgoChem I</div>
                <h1 className="h1">{topic.title}</h1>
                <div className="subtle">{topic.shortDesc}</div>
              </div>

              <div className="topicTopActions">
                <BookmarkButton course="orgochem-1" topic={topic.slug} />
                <Link className="btn" href="/orgochem-1">
                  Back
                </Link>
              </div>
            </div>

            <div className="topicHero">
              <TopicIllustration slug={topic.slug} title={topic.title} imageUrl={topic.imageUrl} imageAlt={topic.imageAlt} />
            </div>

            <div className="divider" />

            <Section
              title="Summary"
              right={
                <a className="btn topicExtBtn" href={topic.externalUrl} target="_blank" rel="noreferrer">
                  Open full reference
                </a>
              }
            >
              <div className="topicSummaryText">
                <div style={{ marginBottom: 16, fontSize: 16, lineHeight: 1.7, fontWeight: 500 }}>
                  {topic.summary}
                </div>
                <div style={{ marginTop: 16, padding: 16, background: "rgba(0, 122, 255, 0.04)", borderRadius: 12, border: "1px solid rgba(0, 122, 255, 0.1)" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: "#007AFF" }}>
                    What you need to know:
                  </div>
                  <div style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(0, 0, 0, 0.8)" }}>
                    This topic covers {topic.title.toLowerCase()}. Focus on mastering the key concepts in the "Must know checklist" above. 
                    Follow the study steps systematically, and use practice problems to reinforce your understanding. 
                    The external reference provides comprehensive coverage of all concepts.
                  </div>
                </div>
              </div>
            </Section>

            <div className="topicTwoCol">
              <Section title="Must know checklist">
                <MustKnowChecklist items={topic.mustKnow} course="orgochem-1" topic={topic.slug} />
              </Section>

              <Section title="Common mistakes">
                <Mistakes items={commonMistakes[topic.slug] || ["Write the one clue you ignored then redo the problem immediately"]} />
              </Section>
            </div>

            <MemorizationSection slug={topic.slug} />
            <MemorizationFlashcards slug={topic.slug} />

            <Section title="Study steps">
              <StudyStepsChecklist items={topic.howToStudy} course="orgochem-1" topic={topic.slug} />
            </Section>

            <Section title="Study Tools">
              <div style={{ display: "grid", gap: 16 }}>
                <StudyTimer course="orgochem-1" topic={topic.slug} />
                <StudyNotes course="orgochem-1" topic={topic.slug} />
              </div>
            </Section>

            <Section title="Tools">
              <div className="topicToolRow">
                {topic.hasMechanism ? (
                  <Link className="btn btnPrimary" href={`/mechanisms?topic=${encodeURIComponent(mechTag)}`}>
                    Mechanism tool
                  </Link>
                ) : null}
                {topic.slug === "spectroscopy" ? (
                  <Link className="btn btnPrimary" href="/spectra">
                    NMR Studio
                  </Link>
                ) : null}
                {!topic.hasMechanism && topic.slug !== "spectroscopy" ? (
                  <div className="subtle">No specialized tools needed for this topic</div>
                ) : null}
              </div>

              <div className="topicToolRow">
                <Link className="btn" href={`/ask?course=orgochem-1&topic=${encodeURIComponent(topic.slug)}`}>
                  Ask questions
                </Link>
                <Link className="btn" href={`/uploads?course=orgochem-1&topic=${encodeURIComponent(topic.slug)}`}>
                  Upload notes
                </Link>
              </div>
            </Section>

            <Section title="Practice">
              <AchieveHomework course="orgochem-1" topic={topic.slug} />
            </Section>

            <Section title="Exam prep">
              <div className="topicSummaryText" style={{ marginBottom: 12 }}>
                Download study guides and practice exam problems for this specific topic.
              </div>
              <ExportStudyGuide course="orgochem-1" topicSlug={topic.slug} />
              <div className="topicToolRow" style={{ marginTop: 12 }}>
                <a 
                  className="btn btnPrimary" 
                  href={`/api/exam-guide?course=orgochem-1&topic=${encodeURIComponent(topic.slug)}`}
                  download
                >
                  Download Word Doc
                </a>
                <Link 
                  className="btn" 
                  href={`/orgochem-1/exams?topic=${encodeURIComponent(topic.slug)}`}
                >
                  Practice exam problems
                </Link>
              </div>
              <div className="subtle" style={{ marginTop: 8, fontSize: 13 }}>
                OrgoChem I uses uploaded study guides. Guides are organized by topic for focused exam preparation.
              </div>
            </Section>

            <Section title="Tips">
              <div className="topicTips">
                {[
                  "Always name the intermediate before predicting the product",
                  "When stuck, list what the reagent can do, then match to the substrate",
                  "Speed comes after accuracy. First be right, then be fast",
                ].map((t, i) => (
                  <div key={i} className="topicTipItem">
                    {t}
                  </div>
                ))}
              </div>
            </Section>
          </div>
        </div>
      </div>
    </main>
  );
}
