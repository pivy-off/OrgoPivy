import Link from "next/link";
import { notFound } from "next/navigation";
import { WORKSPACE_BOARDS } from "../../lib/workspace-boards";
import { OpPanel, ToolPageLayout } from "../../components/op";

type Props = { params: Promise<{ boardId: string }> };

export default async function WorkspaceBoardPage({ params }: Props) {
  const { boardId } = await params;
  const board = WORKSPACE_BOARDS.find((b) => b.id === boardId);
  if (!board) notFound();

  return (
    <ToolPageLayout
      eyebrow="Workspace board"
      title={board.title}
      subtitle={board.tagline}
      actions={
        <Link className="btn" href="/workspace">
          All boards
        </Link>
      }
    >
      <OpPanel title="Summary">
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: "var(--text)" }}>{board.summary}</p>
      </OpPanel>

      <OpPanel title="Quick facts">
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.65 }}>
          {board.quickFacts.map((f) => (
            <li key={f} style={{ marginBottom: 6 }}>
              {f}
            </li>
          ))}
        </ul>
      </OpPanel>

      <OpPanel title="Checklist">
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.65 }}>
          {board.checklist.map((c) => (
            <li key={c} style={{ marginBottom: 6 }}>
              {c}
            </li>
          ))}
        </ul>
      </OpPanel>

      <OpPanel title="Pinned notes">
        <div className="subtle" style={{ fontSize: 14 }}>
          Local-only pins ship next: this panel is reserved for student annotations tied to each board.
        </div>
      </OpPanel>

      <OpPanel title="Linked sources">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {board.links.map((l) => (
            <Link key={l.href} className="btn btnPrimary" href={l.href}>
              {l.label}
            </Link>
          ))}
          <Link className="btn" href="/uploads">
            Uploads
          </Link>
        </div>
      </OpPanel>
    </ToolPageLayout>
  );
}
