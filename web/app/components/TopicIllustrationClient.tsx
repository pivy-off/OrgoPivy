"use client";

import { useState, useEffect } from "react";

type Props = {
  slug: string;
  title: string;
  imageUrl?: string;
  imageAlt?: string;
};

export default function TopicIllustrationClient({ slug, title, imageUrl, imageAlt }: Props) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Check if image loads successfully
  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageError(true);
    img.src = imageUrl;
  }, [imageUrl]);

  // If image failed to load or no URL, hide this component to show SVG fallback
  if (!imageUrl || imageError) {
    return null;
  }

  // Only show when image is loaded
  if (!imageLoaded) {
    return null;
  }

  return (
    <div
      style={{
        width: "100%",
        height: 320,
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        position: "relative",
        background: "var(--panel-2)",
      }}
    >
      <img
        src={imageUrl}
        alt={imageAlt || `${title} illustration`}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)",
          padding: "28px",
          color: "white",
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 15, opacity: 0.95 }}>{imageAlt || "Visual representation"}</div>
      </div>
    </div>
  );
}
