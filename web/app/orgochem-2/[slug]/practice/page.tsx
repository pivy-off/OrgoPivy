import Link from "next/link";
import { notFound } from "next/navigation";
import TopicPracticeHub from "@/app/components/TopicPracticeHub";
import TopicPracticeShell from "@/app/components/TopicPracticeShell";
import { findTopic } from "@/app/lib/curriculum";

export default async function TopicPracticePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = findTopic("orgochem-2", slug);
  if (!topic) return notFound();

  const questions = topic.practiceMcqs ?? [];

  return (
    <TopicPracticeShell slug={slug} title={topic.title}>
      {questions.length > 0 ? (
        <TopicPracticeHub course="orgochem-2" slug={slug} questions={questions} />
      ) : (
        <div className="card">
          <div className="cardInner">
            <p className="subtle">No practice questions are available for this topic yet.</p>
            <Link className="btn" href={`/orgochem-2/${encodeURIComponent(slug)}`} style={{ marginTop: 12 }}>
              Back to topic
            </Link>
          </div>
        </div>
      )}
    </TopicPracticeShell>
  );
}
