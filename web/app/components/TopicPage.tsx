import Link from "next/link";
import type { ReactNode } from "react";
import TopicToolsClient from "./TopicToolsClient";
import TopicChecklistClient from "./TopicChecklistClient";
import type { Topic } from "../lib/curriculum";

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

function guessMechanismTag(slug: string) {
  if (slug.includes("substitution")) return "substitution";
  if (slug.includes("elimination")) return "elimination";
  if (slug.includes("alkene")) return "alkene";
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

export default function TopicPage({
  courseLabel,
  backHref,
  topic,
  illustration,
  commonMistakes,
  practiceHref,
}: {
  courseLabel: string;
  backHref: string;
  topic: Topic;
  illustration: React.ReactNode;
  commonMistakes?: string[];
  practiceHref?: string;
}) {
  const mechTag = guessMechanismTag(topic.slug);

  return (
    <main className="stack">
      <div className="card">
        <div className="cardInner">
          <div className="stack">
            <div className="topicTopRow">
              <div className="topicTopLeft">
                <div className="subtle">{courseLabel}</div>
                <h1 className="h1">{topic.title}</h1>
                <div className="subtle">{topic.shortDesc}</div>
              </div>

              <div className="topicTopActions">
                <Link className="btn" href={backHref}>
                  Back
                </Link>
              </div>
            </div>

            <div className="topicHero">{illustration}</div>

            <div className="divider" />

            <Section
              title="Summary"
              right={
                <a className="btn topicExtBtn" href={topic.externalUrl} target="_blank" rel="noreferrer">
                  Open full reference
                </a>
              }
            >
              <div className="topicSummaryText">{topic.summary}</div>
            </Section>

            <div className="topicTwoCol">
              <Section title="Must know checklist">
                <TopicChecklistClient items={topic.mustKnow} />
              </Section>

              <Section title="Common mistakes">
                <div className="topicMistakes">
                  {(commonMistakes && commonMistakes.length ? commonMistakes : ["Write the one clue you ignored then redo the problem immediately"]).map(
                    (t, i) => (
                      <div key={`${i}-${t}`} className="topicMistakeItem">
                        {t}
                      </div>
                    )
                  )}
                </div>
              </Section>
            </div>

            <Section title="Study steps">
              <TopicChecklistClient items={topic.howToStudy} />
            </Section>

            <Section title="Tools">
              <TopicToolsClient
                hasMechanism={topic.hasMechanism}
                mechanismHref={topic.hasMechanism ? `/mechanisms?topic=${encodeURIComponent(mechTag)}` : undefined}
              />

              <div className="topicToolRow">
                <Link className="btn" href="/search">
                  Search notes
                </Link>
                <Link className="btn" href="/ask">
                  Ask
                </Link>
                <Link className="btn" href="/uploads">
                  Upload
                </Link>
              </div>
            </Section>

            <Section title="Practice">
              {practiceHref ? (
                <div className="topicPracticeRow">
                  <div className="topicPracticeText">This topic has an interactive drill</div>
                  <Link className="btn btnPrimary" href={practiceHref}>
                    Open practice
                  </Link>
                </div>
              ) : (
                <div className="topicSummaryText">
                  Do 10 problems. For each one write one sentence explaining why your pathway or product is correct. If you cannot explain it, redo the topic checklist.
                </div>
              )}
            </Section>

            <Section title="Exam mode">
              <div className="topicSummaryText">
                This will become a study guide download section. You will pick topics and download the matching study guides.
              </div>
            </Section>

            <Section title="Tips">
              <div className="topicMistakes">
                {[
                  "Always name the intermediate before predicting the product",
                  "When stuck list what the reagent can do then match to the substrate",
                  "Speed comes after accuracy first be right then be fast",
                ].map((t) => (
                  <div key={t} className="topicMistakeItem">
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
