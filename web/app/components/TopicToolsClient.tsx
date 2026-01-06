"use client";

import Link from "next/link";

export default function TopicToolsClient(props: {
  hasMechanism: boolean;
  mechanismHref?: string;
}) {
  return (
    <div className="topicToolRow">
      {props.hasMechanism && props.mechanismHref ? (
        <Link className="btn btnPrimary" href={props.mechanismHref}>
          Mechanism tool
        </Link>
      ) : (
        <div className="subtle">No mechanism tool needed here</div>
      )}
    </div>
  );
}
