"use client";

import { useState } from "react";
import { geminiAudioBrief, geminiFreshQuestions, geminiStudyGuide } from "@/lib/gemini";
import type { Topic } from "@/app/lib/curriculum";

type StudioKind = "idle" | "audio" | "guide" | "fresh" | "map";

export default function StudioPanel({
  slug,
  topic,
  onTranscript,
  onMarkdown,
  onFreshQuestions,
  onConceptMapSvg,
  busy,
  setBusy,
  onError,
}: {
  slug: string;
  topic: Topic;
  onTranscript: (t: string) => void;
  onMarkdown: (m: string) => void;
  onFreshQuestions: (q: unknown[]) => void;
  onConceptMapSvg: (svg: string) => void;
  busy: boolean;
  setBusy: (b: boolean) => void;
  onError: (e: string) => void;
}) {
  const [kind, setKind] = useState<StudioKind>("idle");

  const run = async (k: StudioKind, fn: () => Promise<void>) => {
    if (busy) return;
    setBusy(true);
    setKind(k);
    try {
      await fn();
    } catch (e) {
      onError((e as Error).message || "Request failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div style={{ fontWeight: 800, color: "#9ca3af", fontSize: 12, marginBottom: 8 }}>STUDIO</div>
      <button
        type="button"
        className="op-chip"
        style={{ display: "block", width: "100%", marginBottom: 8, textAlign: "left" }}
        disabled={busy}
        onClick={() =>
          run("audio", async () => {
            const r = await geminiAudioBrief(topic, slug);
            onTranscript(r.transcript);
          })
        }
      >
        🎧 Audio Brief
      </button>
      <button
        type="button"
        className="op-chip"
        style={{ display: "block", width: "100%", marginBottom: 8, textAlign: "left" }}
        disabled={busy}
        onClick={() =>
          run("guide", async () => {
            const r = await geminiStudyGuide(topic, slug);
            onMarkdown(r.markdown);
          })
        }
      >
        📋 Study Guide
      </button>
      <button
        type="button"
        className="op-chip"
        style={{ display: "block", width: "100%", marginBottom: 8, textAlign: "left" }}
        disabled={busy}
        onClick={() =>
          run("fresh", async () => {
            const r = await geminiFreshQuestions(topic, slug);
            onFreshQuestions(r.questions || []);
          })
        }
      >
        ❓ Fresh Practice
      </button>
      <button
        type="button"
        className="op-chip"
        style={{ display: "block", width: "100%", marginBottom: 8, textAlign: "left" }}
        disabled={busy}
        onClick={() =>
          run("map", async () => {
            const titles = topic.mustKnowItems?.map((m) => m.title) ?? topic.mustKnow;
            const svg = buildLocalConceptMapSvg(topic.title, titles.slice(0, 10));
            onConceptMapSvg(svg);
          })
        }
      >
        🔍 Concept Map
      </button>
      {kind !== "idle" ? <div className="subtle" style={{ fontSize: 11, marginTop: 6 }}>Last: {kind}</div> : null}
    </div>
  );
}

function buildLocalConceptMapSvg(title: string, concepts: string[]): string {
  const cx = 400;
  const cy = 260;
  const nodes = concepts.map((c, i) => {
    const ang = (i / Math.max(concepts.length, 1)) * Math.PI * 2;
    const r = 180;
    return { c, x: cx + Math.cos(ang) * r, y: cy + Math.sin(ang) * r };
  });
  const lines = nodes
    .map(
      (n) =>
        `<line x1="${cx}" y1="${cy}" x2="${n.x}" y2="${n.y}" stroke="#cbd5e1" stroke-width="2"/>`,
    )
    .join("");
  const circles = nodes
    .map(
      (n, i) => `
  <g transform="translate(${n.x},${n.y})">
    <circle r="38" fill="#EEF1FF" stroke="#4F6EF7" stroke-width="2"/>
    <text text-anchor="middle" y="4" font-size="10" font-family="sans-serif" fill="#111">${escapeXml(n.c).slice(0, 18)}</text>
  </g>`,
    )
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" width="100%" height="420">
  <rect width="800" height="520" fill="#fafafa"/>
  ${lines}
  <g transform="translate(${cx},${cy})">
    <circle r="64" fill="#4F6EF7"/>
    <text text-anchor="middle" y="6" font-size="14" font-weight="700" fill="#fff" font-family="sans-serif">${escapeXml(title).slice(0, 28)}</text>
  </g>
  ${circles}
</svg>`;
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}
