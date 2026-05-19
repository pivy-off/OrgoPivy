import Link from "next/link";

type Props = {
  videoId: string;
  title: string;
};

export default function YouTubeTutorialCard({ videoId, title }: Props) {
  const watch = `https://www.youtube.com/watch?v=${videoId}`;
  const thumb = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <Link
      href={watch}
      target="_blank"
      rel="noreferrer"
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
      <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", background: "#111" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumb}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
      <div style={{ padding: "12px 14px" }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, color: "var(--op-text-primary, inherit)" }}>
          {title}
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--op-indigo, #4F6EF7)" }}>
          Click to watch on YouTube →
        </div>
      </div>
    </Link>
  );
}
