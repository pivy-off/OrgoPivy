import Link from "next/link";
import { WORKSPACE_BOARDS } from "../lib/workspace-boards";
import { ToolPageLayout } from "../components/op";

export default function WorkspaceIndexPage() {
  return (
    <ToolPageLayout
      eyebrow="Study OS"
      title="Study workspace"
      subtitle="Topic boards for Organic Chemistry II: summaries, quick facts, checklists, and links into tools."
    >
      <div className="opQuickGrid">
        {WORKSPACE_BOARDS.map((b) => (
          <Link key={b.id} className="opQuickCard" href={`/workspace/${b.id}`}>
            <div className="opQuickCardKicker">Board</div>
            <div className="opQuickCardTitle">{b.title}</div>
            <div className="opQuickCardDesc">{b.tagline}</div>
          </Link>
        ))}
      </div>
    </ToolPageLayout>
  );
}
