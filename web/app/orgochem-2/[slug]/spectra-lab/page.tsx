import { notFound } from "next/navigation";
import { findTopic } from "@/app/lib/curriculum";
import SpectraLab from "@/components/SpectraLab";

/** Eligible topics for Spectra Lab (exact list). */
const SPECTRA_LAB_SLUGS = new Set([
  "substitution-elimination-nmr-review",
  "alcohols-phenols",
  "carboxylic-acids-derivatives",
  "aldehydes-ketones",
]);

export default async function SpectraLabPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!SPECTRA_LAB_SLUGS.has(slug)) return notFound();
  const topic = findTopic("orgochem-2", slug);
  if (!topic) return notFound();
  return (
    <main className="stack" style={{ maxWidth: 1100, margin: "0 auto" }}>
      <SpectraLab topicTitle={topic.title} />
    </main>
  );
}
