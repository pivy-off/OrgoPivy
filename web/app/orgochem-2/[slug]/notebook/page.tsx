import { notFound } from "next/navigation";
import { findTopic } from "@/app/lib/curriculum";
import NotebookPageClient from "@/components/NotebookPageClient";

export default async function NotebookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = findTopic("orgochem-2", slug);
  if (!topic) return notFound();
  return (
    <main className="stack" style={{ maxWidth: 1280, margin: "0 auto" }}>
      <NotebookPageClient slug={slug} topic={topic} />
    </main>
  );
}
