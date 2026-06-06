import Link from "next/link";
import type { ReactNode } from "react";
import TopicSubNav from "@/components/TopicSubNav";

type Props = {
  slug: string;
  title: string;
  children: ReactNode;
  breadcrumb?: string;
};

export default function TopicPracticeShell({ slug, title, children, breadcrumb }: Props) {
  const topicHref = `/orgochem-2/${encodeURIComponent(slug)}`;

  return (
    <main className="stack orgochem2-topic" style={{ maxWidth: 720, margin: "0 auto" }}>
      <div className="card">
        <div className="cardInner">
          <div className="subtle">OrgoChem II · Practice</div>
          <h1 className="h1" style={{ marginTop: 4 }}>
            {title}
          </h1>
          {breadcrumb ? <p className="subtle" style={{ margin: "0 0 12px" }}>{breadcrumb}</p> : null}
          <div className="topicToolRow" style={{ marginBottom: 0 }}>
            <Link className="btn" href={topicHref}>
              Back to topic
            </Link>
            <Link className="btn" href={`${topicHref}/practice`}>
              All questions
            </Link>
          </div>
          <div style={{ marginTop: 16 }}>
            <TopicSubNav />
          </div>
        </div>
      </div>
      {children}
    </main>
  );
}
