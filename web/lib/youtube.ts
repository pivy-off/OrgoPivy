/** YouTube watch + thumbnail URLs (use i.ytimg.com — img.youtube.com often 404s). */

export function youtubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

/** High-quality thumbnail; falls back gracefully in YouTubeThumbnail when maxres is missing. */
export function youtubeThumbnailUrl(
  videoId: string,
  quality: "maxres" | "hq" | "mq" | "default" = "hq",
): string {
  const file =
    quality === "maxres"
      ? "maxresdefault.jpg"
      : quality === "hq"
        ? "hqdefault.jpg"
        : quality === "mq"
          ? "mqdefault.jpg"
          : "default.jpg";
  return `https://i.ytimg.com/vi/${videoId}/${file}`;
}

export const YOUTUBE_THUMB_QUALITIES = ["maxres", "hq", "mq", "default"] as const;
