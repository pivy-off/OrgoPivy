import type { TopicCurriculumImage, TopicImageSection } from "../lib/curriculum";

export default function TopicCurriculumImages({
  images,
  section,
}: {
  images?: TopicCurriculumImage[];
  section: TopicImageSection;
}) {
  if (!images?.length) return null;
  const rows = images.filter((im) => im.section === section);
  if (!rows.length) return null;

  return (
    <div className="topicCurriculumImages" style={{ display: "grid", gap: 16, marginTop: 14 }}>
      {rows.map((im, idx) => (
        <figure
          key={`${im.src}-${idx}`}
          style={{
            margin: 0,
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
            overflow: "hidden",
            background: "var(--panel-2)",
          }}
        >
          <div style={{ position: "relative", width: "100%", aspectRatio: "2 / 1", maxHeight: 400 }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- dynamic curriculum paths under /public */}
            <img src={im.src} alt={im.alt} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <figcaption className="subtle" style={{ padding: "10px 12px", fontSize: 13, lineHeight: 1.45 }}>
            {im.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
