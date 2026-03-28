import type { ReactNode } from "react";

export default function OpSearchResultCard({
  metaLeft,
  metaRight,
  snippet,
  footer,
}: {
  metaLeft: ReactNode;
  metaRight?: ReactNode;
  snippet: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <article className="opResultCard">
      <div className="opResultCardTop">
        <div className="opResultCardMeta">{metaLeft}</div>
        {metaRight ? <div className="opResultCardScore">{metaRight}</div> : null}
      </div>
      <div className="opResultCardSnippet">{snippet}</div>
      {footer ? <div className="opResultCardFoot">{footer}</div> : null}
    </article>
  );
}
