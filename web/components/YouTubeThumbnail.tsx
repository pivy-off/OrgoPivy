"use client";

import Image from "next/image";
import { useState } from "react";
import { YOUTUBE_THUMB_QUALITIES, youtubeThumbnailUrl } from "@/lib/youtube";

type Props = {
  videoId: string;
  alt: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  className?: string;
};

export default function YouTubeThumbnail({
  videoId,
  alt,
  width = 480,
  height = 270,
  style,
  className,
}: Props) {
  const [qualityIdx, setQualityIdx] = useState(0);
  const quality = YOUTUBE_THUMB_QUALITIES[qualityIdx] ?? "default";
  const src = youtubeThumbnailUrl(videoId, quality);

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      unoptimized
      className={className}
      style={style}
      onError={() => {
        setQualityIdx((i) => (i < YOUTUBE_THUMB_QUALITIES.length - 1 ? i + 1 : i));
      }}
    />
  );
}
