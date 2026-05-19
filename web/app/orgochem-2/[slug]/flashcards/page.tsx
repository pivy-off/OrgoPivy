import { notFound } from "next/navigation";
import { findTopic } from "@/app/lib/curriculum";
import FlashcardsClient from "@/components/FlashcardsClient";

export default async function FlashcardsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = findTopic("orgochem-2", slug);
  if (!topic) return notFound();
  return (
    <main className="stack" style={{ maxWidth: 1100, margin: "0 auto" }}>
      <FlashcardsClient slug={slug} topic={topic} />
    </main>
  );
}
