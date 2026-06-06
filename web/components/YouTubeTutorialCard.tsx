import Link from "next/link";
import YouTubeThumbnail from "@/components/YouTubeThumbnail";
import { youtubeWatchUrl } from "@/lib/youtube";

type Props = {
  videoId: string;
  title: string;
};

export default function YouTubeTutorialCard({ videoId, title }: Props) {
  const watch = youtubeWatchUrl(videoId);

  return (
    <Link
      href={watch}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
        maxWidth: 720,
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid var(--op-border, rgba(0,0,0,0.08))",
        background: "var(--op-card-bg, #fff)",
        transition: "var(--op-transition, all 0.2s ease)",
      }}
    >
      <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", background: "#111" }}>
        <YouTubeThumbnail
          videoId={videoId}
          alt={title}
          width={480}
          height={270}
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>
      <div style={{ padding: "12px 14px" }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, color: "var(--op-text-primary, inherit)" }}>{title}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--op-indigo, #4F6EF7)" }}>
          Click to watch on YouTube →
        </div>
      </div>
    </Link>
  );
}
