"use client";

import type { Video } from "../lib/curriculum";

type Props = {
  video: Video;
};

export default function VideoCard({ video }: Props) {
  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "block",
        textDecoration: "none",
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid var(--border)",
        transition: "all 0.2s ease"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--blue)";
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 122, 255, 0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ position: "relative" }}>
        <img
          src={video.thumbnail}
          alt={video.title}
          style={{
            width: "100%",
            height: "auto",
            display: "block"
          }}
        />
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "rgba(0, 0, 0, 0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          color: "white"
        }}>
          ▶
        </div>
      </div>
      <div style={{
        padding: 16,
        background: "var(--panel)"
      }}>
        <div style={{
          fontSize: 16,
          fontWeight: 600,
          color: "var(--text)",
          marginBottom: 4
        }}>
          {video.title}
        </div>
        <div style={{
          fontSize: 12,
          color: "var(--muted)"
        }}>
          Click to watch on YouTube →
        </div>
      </div>
    </a>
  );
}
