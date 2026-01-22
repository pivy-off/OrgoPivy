import Link from "next/link";
import type { Topic } from "../lib/curriculum";
import type { CourseId } from "../lib/curriculum";

type Props = {
  topic: Topic;
  courseId: CourseId;
};

export default function TopicCard({ topic, courseId }: Props) {
  return (
    <Link href={`/${courseId}/${topic.slug}`} style={{ textDecoration: "none" }}>
      <div className="card" style={{ padding: 20 }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{topic.title}</div>
        <div className="subtle" style={{ fontSize: 14 }}>{topic.shortDesc}</div>
      </div>
    </Link>
  );
}
