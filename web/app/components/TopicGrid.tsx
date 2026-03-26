import type { CourseId } from "../lib/curriculum";
import { getCourseTopics } from "../lib/curriculum";
import TopicCard from "./TopicCard";

export default function TopicGrid({
  course,
}: {
  course: CourseId;
}) {
  const topics = getCourseTopics(course);

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {topics.map((t) => (
        <TopicCard
          key={t.slug}
          topic={t}
          href={`/${course}/${t.slug}`}
        />
      ))}
    </div>
  );
}
