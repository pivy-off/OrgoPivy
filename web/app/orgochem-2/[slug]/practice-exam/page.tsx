import { notFound } from "next/navigation";
import { findTopic } from "@/app/lib/curriculum";
import PracticeExam from "@/components/PracticeExam";

export default async function PracticeExamPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = findTopic("orgochem-2", slug);
  if (!topic) return notFound();
  const seed = topic.practiceMcqs ?? [];
  return (
    <main className="stack" style={{ maxWidth: 900, margin: "0 auto" }}>
      <PracticeExam slug={slug} title={topic.title} topic={topic} seedMcqs={seed} />
    </main>
  );
}
