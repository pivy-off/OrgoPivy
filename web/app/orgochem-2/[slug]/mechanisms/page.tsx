import Link from "next/link";
import { notFound } from "next/navigation";
import { findTopic } from "@/app/lib/curriculum";
import { buildMechanismsFromTopic } from "@/lib/buildMechanismsFromTopic";
import MechanismViewer from "@/components/MechanismViewer";

export default async function MechanismsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = findTopic("orgochem-2", slug);
  if (!topic) return notFound();
  const mechanisms = buildMechanismsFromTopic(topic);
  const stepCount = mechanisms.reduce((n, m) => n + m.steps.length, 0);

  return (
    <main className="stack orgochem2-topic" style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div className="card" style={{ boxShadow: "none" }}>
        <div className="cardInner" style={{ padding: 16 }}>
          <div className="subtle">OrgoChem II · Mechanisms</div>
          <h1 className="h1" style={{ marginTop: 4 }}>{topic.title}</h1>
          <p className="subtle" style={{ marginBottom: 12 }}>
            {mechanisms.length} pathway{mechanisms.length === 1 ? "" : "s"} · {stepCount} step{stepCount === 1 ? "" : "s"} with reactant → product schematics.
          </p>
          <Link className="btn" href={`/orgochem-2/${encodeURIComponent(slug)}`}>
            Back to topic
          </Link>
        </div>
      </div>
      <MechanismViewer slug={slug} mechanisms={mechanisms} />
    </main>
  );
}
