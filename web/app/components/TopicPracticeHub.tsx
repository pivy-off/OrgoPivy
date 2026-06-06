import Link from "next/link";
import type { TopicPracticeMcq } from "../lib/curriculum";
import { applyChemUnicode } from "../lib/chemTypography";

type Props = {
  course: "orgochem-2";
  slug: string;
  questions: TopicPracticeMcq[];
};

function preview(text: string, max = 72) {
  const t = applyChemUnicode(text).replace(/\s+/g, " ").trim();
  return t.length <= max ? t : `${t.slice(0, max - 1)}…`;
}

export default function TopicPracticeHub({ course, slug, questions }: Props) {
  const base = `/${course}/${encodeURIComponent(slug)}/practice`;

  return (
    <section className="card topicSection" aria-labelledby="practice-hub-heading">
      <div className="cardInner">
        <h2 id="practice-hub-heading" className="topicSectionTitle" style={{ margin: 0 }}>
          {questions.length} practice questions
        </h2>
        <p className="subtle topicReadable" style={{ margin: "10px 0 16px" }}>
          Each question has its own page so you can focus on one problem at a time.
        </p>
        <ul className="topicPracticeHubList">
          {questions.map((q, i) => (
            <li key={i}>
              <Link className="topicPracticeHubLink" href={`${base}/${i + 1}`}>
                <span className="topicPracticeHubLinkNum">Q{i + 1}</span>
                <span className="topicPracticeHubLinkText">{preview(q.question)}</span>
                <span aria-hidden>→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
