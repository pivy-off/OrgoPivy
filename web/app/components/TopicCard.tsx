import Link from "next/link";
import type { Topic } from "../lib/curriculum";

export default function TopicCard({
  topic,
  href,
}: {
  topic: Topic;
  href: string;
}) {
  return (
    <div className="progressRow">
      <div className="progressRowLeft">
        <div className="progressRowTitle">{topic.title}</div>
        <div className="progressRowDesc">{topic.shortDesc}</div>
      </div>
      <div className="progressRowAction">
        <Link className="btn btnPrimary" href={href}>
          Open
        </Link>
      </div>
    </div>
  );
}
