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

function createSVGIllustration(slug: string, title: string) {
  const common = {
    width: "100%",
    height: 320,
    viewBox: "0 0 900 320",
    role: "img" as const,
    "aria-label": `${title} illustration`,
    style: { display: "block" },
  };

  const bg = (
    <defs>
      <linearGradient id="g0" x1="0" x2="1">
        <stop offset="0" stopColor="var(--primary)" stopOpacity="0.18" />
        <stop offset="1" stopColor="var(--accent)" stopOpacity="0.18" />
      </linearGradient>
    </defs>
  );

  if (slug === "alcohols") {
    return (
      <svg {...common}>
        {bg}
        <rect x="0" y="0" width="900" height="320" rx="18" fill="url(#g0)" />
        <text x="28" y="54" fontSize="20" fontWeight="950" fill="var(--text)">
          Alcohol oxidation
        </text>
        <text x="28" y="82" fontSize="13" fill="var(--muted)">
          Primary → Aldehyde → Acid | Secondary → Ketone
        </text>

        <line x1="280" y1="150" x2="380" y2="150" stroke="var(--text)" strokeOpacity="0.6" strokeWidth="4" />
        <text x="330" y="145" fontSize="14" fill="var(--text)" fontWeight="700">OH</text>

        <path d="M 400 150 L 500 120 L 500 180 Z" fill="none" stroke="var(--text)" strokeOpacity="0.4" strokeWidth="3" />
        <text x="520" y="150" fontSize="14" fill="var(--text)" fontWeight="700">O</text>

        <text x="600" y="140" fontSize="14" fill="var(--muted)">Reagent</text>
        <text x="600" y="160" fontSize="14" fill="var(--text)" fontWeight="900">PCC, Jones, Swern</text>
      </svg>
    );
  }

  if (slug === "ethers-epoxides") {
    return (
      <svg {...common}>
        {bg}
        <rect x="0" y="0" width="900" height="320" rx="18" fill="url(#g0)" />
        <text x="28" y="54" fontSize="20" fontWeight="950" fill="var(--text)">
          Epoxide opening
        </text>
        <text x="28" y="82" fontSize="13" fill="var(--muted)">
          Basic: less substituted | Acidic: more substituted
        </text>

        <polygon points="300,150 350,120 400,150 350,180" fill="none" stroke="var(--text)" strokeOpacity="0.6" strokeWidth="4" />
        <text x="350" y="150" fontSize="12" fill="var(--text)" fontWeight="700">O</text>

        <path d="M 450 150 L 550 130" fill="none" stroke="var(--text)" strokeOpacity="0.4" strokeWidth="3" />
        <text x="570" y="135" fontSize="14" fill="var(--text)" fontWeight="700">OH</text>

        <text x="650" y="140" fontSize="14" fill="var(--muted)">Regioselectivity</text>
        <text x="650" y="160" fontSize="14" fill="var(--text)" fontWeight="900">Depends on conditions</text>
      </svg>
    );
  }

  if (slug.includes("carbonyl")) {
    return (
      <svg {...common}>
        {bg}
        <rect x="0" y="0" width="900" height="320" rx="18" fill="url(#g0)" />
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

  if (slug === "carboxylic-acids-derivatives") {
    return (
      <svg {...common}>
        {bg}
        <rect x="0" y="0" width="900" height="320" rx="18" fill="url(#g0)" />
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

        <text x="600" y="140" fontSize="14" fill="var(--muted)">Leaving group</text>
        <text x="600" y="160" fontSize="14" fill="var(--text)" fontWeight="900">Better LG = faster</text>
      </svg>
    );
  }

  if (slug === "enolates-aldol-claisen") {
    return (
      <svg {...common}>
        {bg}
        <rect x="0" y="0" width="900" height="320" rx="18" fill="url(#g0)" />
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

  if (slug === "aromatic-chemistry") {
    return (
      <svg {...common}>
        {bg}
        <rect x="0" y="0" width="900" height="320" rx="18" fill="url(#g0)" />
        <text x="28" y="54" fontSize="20" fontWeight="950" fill="var(--text)">
          EAS directing
        </text>
        <text x="28" y="82" fontSize="13" fill="var(--muted)">
          Activating: ortho/para | Deactivating: meta
        </text>

        <polygon points="300,120 320,100 360,100 380,120 360,140 320,140" fill="none" stroke="var(--text)" strokeOpacity="0.6" strokeWidth="4" />
        <text x="340" y="130" fontSize="12" fill="var(--text)" fontWeight="700">R</text>

        <path d="M 400 130 L 500 110 L 500 150 Z" fill="none" stroke="var(--text)" strokeOpacity="0.4" strokeWidth="3" />
        <text x="520" y="130" fontSize="14" fill="var(--text)" fontWeight="700">E+</text>

        <text x="600" y="120" fontSize="14" fill="var(--muted)">Directing</text>
        <text x="600" y="140" fontSize="14" fill="var(--text)" fontWeight="900">ortho/para/meta</text>
      </svg>
    );
  }

  if (slug === "amines") {
    return (
      <svg {...common}>
        {bg}
        <rect x="0" y="0" width="900" height="320" rx="18" fill="url(#g0)" />
        <text x="28" y="54" fontSize="20" fontWeight="950" fill="var(--text)">
          Amine basicity
        </text>
        <text x="28" y="82" fontSize="13" fill="var(--muted)">
          Resonance decreases basicity | Inductive effects matter
        </text>

        <line x1="280" y1="150" x2="380" y2="150" stroke="var(--text)" strokeOpacity="0.6" strokeWidth="4" />
        <text x="330" y="145" fontSize="14" fill="var(--text)" fontWeight="700">N</text>
        <circle cx="330" cy="150" r="12" fill="var(--text)" fillOpacity="0.3" />

        <path d="M 400 150 L 500 130 L 500 170 Z" fill="none" stroke="var(--text)" strokeOpacity="0.4" strokeWidth="3" />
        <text x="520" y="150" fontSize="14" fill="var(--text)" fontWeight="700">H+</text>

        <text x="600" y="140" fontSize="14" fill="var(--muted)">Basicity</text>
        <text x="600" y="160" fontSize="14" fill="var(--text)" fontWeight="900">Rank by pKa</text>
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
        Visual guide
      </text>
    </svg>
  );
}

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

  // Fallback to SVG
  return createSVGIllustration(slug, title);
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
  if (slug.includes("alcohol")) return "alcohol";
  if (slug.includes("ether")) return "ether";
  if (slug.includes("epoxide")) return "epoxide";
  if (slug.includes("carbonyl")) return "carbonyl";
  if (slug.includes("carboxylic")) return "carboxylic";
  if (slug.includes("enolate")) return "enolate";
  if (slug.includes("aromatic")) return "aromatic";
  if (slug.includes("amine")) return "amine";
  return slug;
}

export default async function OrgoChem2TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = findTopic("orgochem-2", slug);
  if (!topic) return notFound();

  const mechTag = guessMechanismTag(topic.slug);

  return (
    <main className="stack">
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
                <BookmarkButton course="orgochem-2" topic={topic.slug} />
                <Link className="btn" href="/orgochem-2">
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
                <MustKnowChecklist items={topic.mustKnow} course="orgochem-2" topic={topic.slug} />
              </Section>

              <Section title="Common mistakes">
                <Mistakes items={[
                  "Not deciding addition vs substitution first for carbonyls",
                  "Forgetting to check alpha positions before enolate formation",
                  "Ignoring directing effects when planning EAS synthesis order",
                  "Mixing up kinetic vs thermodynamic enolate conditions",
                ]} />
              </Section>
            </div>

            <MemorizationSection slug={topic.slug} />
            <MemorizationFlashcards slug={topic.slug} />

            <Section title="Study steps">
              <StudyStepsChecklist items={topic.howToStudy} course="orgochem-2" topic={topic.slug} />
            </Section>

            <Section title="Study Tools">
              <div style={{ display: "grid", gap: 16 }}>
                <StudyTimer course="orgochem-2" topic={topic.slug} />
                <StudyNotes course="orgochem-2" topic={topic.slug} />
              </div>
            </Section>

            <Section title="Tools">
              <div className="topicToolRow">
                {topic.hasMechanism ? (
                  <Link className="btn btnPrimary" href={`/mechanisms?topic=${encodeURIComponent(mechTag)}`}>
                    Mechanism tool
                  </Link>
                ) : null}
                {!topic.hasMechanism ? (
                  <div className="subtle">No specialized tools needed for this topic</div>
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

            <Section title="Practice">
              <div className="topicPracticeRow">
                <div className="topicPracticeText">
                  Practice problems for this topic. Get instant feedback and track your progress.
                </div>
                <Link className="btn btnPrimary" href={`/orgochem-2/exams?topic=${encodeURIComponent(topic.slug)}`}>
                  Open practice
                </Link>
              </div>
            </Section>

            <Section title="Exam prep">
              <div className="topicSummaryText" style={{ marginBottom: 12 }}>
                Download study guides and practice exam problems for this specific topic.
              </div>
              <ExportStudyGuide course="orgochem-2" topicSlug={topic.slug} />
              <div className="topicToolRow" style={{ marginTop: 12 }}>
                <a 
                  className="btn btnPrimary" 
                  href={`/api/exam-guide?course=orgochem-2&topic=${encodeURIComponent(topic.slug)}`}
                  download
                >
                  Download study guide
                </a>
                <Link 
                  className="btn" 
                  href={`/orgochem-2/exams?topic=${encodeURIComponent(topic.slug)}`}
                >
                  Practice exam problems
                </Link>
              </div>
              <div className="subtle" style={{ marginTop: 8, fontSize: 13 }}>
                OrgoChem II generates study guides automatically from topic content. Guides are organized by topic for focused exam preparation.
              </div>
            </Section>

            <Section title="Tips">
              <div className="topicTips">
                {[
                  "Carbonyls decide addition vs substitution first",
                  "Enolates mark alpha positions before choosing base",
                  "Aromatics plan order of steps to control directing",
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
