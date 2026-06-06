import { notFound } from "next/navigation";
import TopicPracticeQuestionView from "@/app/components/TopicPracticeQuestionView";
import TopicPracticeShell from "@/app/components/TopicPracticeShell";
import { findTopic } from "@/app/lib/curriculum";

export default async function TopicPracticeQuestionPage({
  params,
}: {
  params: Promise<{ slug: string; question: string }>;
}) {
  const { slug, question: questionParam } = await params;
  const topic = findTopic("orgochem-2", slug);
  if (!topic) return notFound();

  const questions = topic.practiceMcqs ?? [];
  const n = parseInt(questionParam, 10);
  if (!Number.isFinite(n) || n < 1 || n > questions.length) return notFound();

  const index = n - 1;

  return (
    <TopicPracticeShell
      slug={slug}
      title={topic.title}
      breadcrumb={`Question ${n} of ${questions.length}`}
    >
      <TopicPracticeQuestionView
        course="orgochem-2"
        slug={slug}
        questions={questions}
        questionIndex={index}
      />
    </TopicPracticeShell>
  );
}
