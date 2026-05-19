import { notFound } from "next/navigation";
import { findTopic } from "@/app/lib/curriculum";
import ConceptMapD3 from "@/components/ConceptMapD3";

export default async function ConceptMapPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = findTopic("orgochem-2", slug);
  if (!topic) return notFound();
  return (
    <main className="stack" style={{ maxWidth: 1100, margin: "0 auto" }}>
      <ConceptMapD3 slug={slug} topic={topic} />
    </main>
  );
}
