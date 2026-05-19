import { notFound } from "next/navigation";
import { findTopic } from "@/app/lib/curriculum";
import MechanismViewer, { buildMechanismsFromTopic } from "@/components/MechanismViewer";

export default async function MechanismsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = findTopic("orgochem-2", slug);
  if (!topic) return notFound();
  const mechanisms = buildMechanismsFromTopic(topic);
  return (
    <main className="stack" style={{ maxWidth: 1100, margin: "0 auto" }}>
      <MechanismViewer slug={slug} mechanisms={mechanisms} />
    </main>
  );
}
