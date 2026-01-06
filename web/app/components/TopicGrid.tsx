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
      {topics.map((t, idx) => (
        <TopicCard
          key={t.slug}
          topic={t}
          href={`/${course}/topic/${t.slug}`}
        />
      ))}
    </div>
  );
}
