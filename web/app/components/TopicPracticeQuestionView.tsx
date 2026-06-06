import Link from "next/link";
import type { TopicPracticeMcq } from "../lib/curriculum";
import TopicPracticeMcqCard from "./TopicPracticeMcqCard";

type Props = {
  course: "orgochem-2";
  slug: string;
  questions: TopicPracticeMcq[];
  questionIndex: number;
};

export default function TopicPracticeQuestionView({ course, slug, questions, questionIndex }: Props) {
  const n = questions.length;
  const q = questions[questionIndex];
  const base = `/${course}/${encodeURIComponent(slug)}/practice`;

  return (
    <article className="card topicSection">
      <div className="cardInner">
        <p className="subtle" style={{ margin: "0 0 12px" }}>
          Question {questionIndex + 1} of {n}
        </p>
        <TopicPracticeMcqCard question={q} index={questionIndex} />
        <nav className="topicPracticeNav" aria-label="Question navigation">
          {questionIndex > 0 ? (
            <Link className="btn" href={`${base}/${questionIndex}`}>
              ← Previous
            </Link>
          ) : (
            <span />
          )}
          <Link className="btn" href={base}>
            Question list
          </Link>
          {questionIndex < n - 1 ? (
            <Link className="btn btnPrimary" href={`${base}/${questionIndex + 2}`}>
              Next →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </article>
  );
}
