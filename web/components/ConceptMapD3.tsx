"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Topic } from "@/app/lib/curriculum";
import { getConceptMapLayout, setConceptMapLayout } from "@/lib/storage";

type NodeT = {
  id: string;
  label: string;
  kind: "center" | "concept" | "reagent" | "mistake";
  desc: string;
  video?: string;
};

const W = 900;
const H = 560;

function buildInitialNodes(baseNodes: NodeT[], slug: string) {
  const saved = typeof window !== "undefined" ? getConceptMapLayout(slug) : null;
  return baseNodes.map((n, i) => {
    const s = saved?.nodes.find((x) => x.id === n.id);
    const angle = (i / baseNodes.length) * Math.PI * 2;
    const r = n.kind === "center" ? 0 : 160 + (i % 4) * 28;
    return {
      ...n,
      x: s?.x ?? W / 2 + Math.cos(angle) * r,
      y: s?.y ?? H / 2 + Math.sin(angle) * r,
      vx: 0,
      vy: 0,
    };
  });
}

function ConceptMapCanvas({ slug, topic }: { slug: string; topic: Topic }) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [sel, setSel] = useState<string | null>(null);
  const [pathPick, setPathPick] = useState<string[]>([]);
  const dragging = useRef<{ id: string } | null>(null);
  const [zoom, setZoom] = useState(1);

  const baseNodes: NodeT[] = useMemo(() => {
    const center: NodeT = {
      id: "center",
      label: topic.title,
      kind: "center",
      desc: topic.summary.slice(0, 280),
      video: topic.bestVideos?.[0]?.url,
    };
    const mk = topic.mustKnowItems?.length
      ? topic.mustKnowItems.map((m, i) => ({
          id: `mk-${i}`,
          label: m.title,
          kind: "concept" as const,
          desc: m.description,
          video: m.videoId ? `https://www.youtube.com/watch?v=${m.videoId}` : topic.bestVideos?.[0]?.url,
        }))
      : topic.mustKnow.map((s, i) => ({
          id: `mk-${i}`,
          label: s.slice(0, 60),
          kind: "concept" as const,
          desc: s,
          video: topic.bestVideos?.[0]?.url,
        }));
    const mistakes = (topic.commonMistakes ?? []).slice(0, 3).map((t, i) => ({
      id: `err-${i}`,
      label: t.length > 40 ? `${t.slice(0, 40)}…` : t,
      kind: "mistake" as const,
      desc: t,
    }));
    return [center, ...mk, ...mistakes];
  }, [topic]);

  type SimNode = NodeT & { x: number; y: number; vx: number; vy: number };
  const [nodes, setNodes] = useState<SimNode[]>(() => buildInitialNodes(baseNodes, slug));

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      setNodes((prev) => {
        if (!prev.length) return prev;
        const cx = W / 2;
        const cy = H / 2;
        const next = prev.map((n) => ({ ...n }));
        for (const n of next) {
          if (n.kind === "center") {
            n.x = cx;
            n.y = cy;
            n.vx = 0;
            n.vy = 0;
            continue;
          }
          let fx = 0;
          let fy = 0;
          fx += (cx - n.x) * 0.012;
          fy += (cy - n.y) * 0.012;
          for (const m of next) {
            if (m.id === n.id) continue;
            const dx = n.x - m.x;
            const dy = n.y - m.y;
            const d2 = dx * dx + dy * dy + 80;
            const rep = 4200 / d2;
            fx += dx * rep;
            fy += dy * rep;
          }
          n.vx = (n.vx + fx) * 0.78;
          n.vy = (n.vy + fy) * 0.78;
          if (dragging.current?.id !== n.id) {
            n.x += n.vx;
            n.y += n.vy;
          }
          n.x = Math.max(40, Math.min(W - 40, n.x));
          n.y = Math.max(40, Math.min(H - 40, n.y));
        }
        return next;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [baseNodes.length]);

  useEffect(() => {
    const up = () => {
      dragging.current = null;
    };
    window.addEventListener("mouseup", up);
    return () => window.removeEventListener("mouseup", up);
  }, []);

  const onNodeClick = (id: string) => {
    const el = svgRef.current?.querySelector(`[data-node="${id}"]`);
    el?.classList.remove("op-node-pulse");
    void (el as HTMLElement | null)?.offsetWidth;
    el?.classList.add("op-node-pulse");
    setSel(id);
    setPathPick((p) => {
      if (p.length >= 2) return [id];
      if (p.length === 1 && p[0] !== id) return [p[0], id];
      return [id];
    });
  };

  const saveLayout = useCallback(() => {
    setConceptMapLayout(slug, { nodes: nodes.map((n) => ({ id: n.id, x: n.x, y: n.y })) });
  }, [nodes, slug]);

  const downloadPng = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const xml = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, W, H);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob((b) => {
        if (!b) return;
        const a = document.createElement("a");
        a.href = URL.createObjectURL(b);
        a.download = `concept-map-${slug}.png`;
        a.click();
      });
    };
    img.src = url;
  };

  const pathSet = useMemo(() => {
    if (pathPick.length !== 2) return new Set<string>();
    const [a, b] = pathPick;
    return new Set([a, "center", b]);
  }, [pathPick]);

  const nodeById = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);

  return (
    <div style={{ fontFamily: "var(--op-font-sans)", padding: 16 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        <button
          type="button"
          className="op-btn-secondary"
          onClick={() =>
            setNodes((n) => n.map((x, i) => ({ ...x, x: W / 2 + (i % 5) * 30, y: H / 2 + i * 5 })))
          }
        >
          Reset layout
        </button>
        <button type="button" className="op-btn-secondary" onClick={saveLayout}>
          Save positions
        </button>
        <button type="button" className="op-btn-primary" onClick={downloadPng}>
          Download as PNG
        </button>
        <span className="subtle" style={{ fontSize: 13 }}>
          Click two nodes to highlight a path through the center. Scroll to zoom.
        </span>
      </div>
      <div
        style={{
          overflow: "auto",
          touchAction: "none",
          border: "1px solid var(--op-border)",
          borderRadius: 16,
          background: "#fafafa",
        }}
        onWheel={(e) => {
          e.preventDefault();
          setZoom((z) => Math.min(2.2, Math.max(0.6, z - e.deltaY * 0.001)));
        }}
      >
        <svg
          ref={svgRef}
          width={W * zoom}
          height={H * zoom}
          viewBox={`0 0 ${W} ${H}`}
          style={{ display: "block" }}
        >
          {nodes.map((n) =>
            n.kind === "center" ? null : (
              <line
                key={`e-${n.id}`}
                x1={nodeById.center?.x ?? W / 2}
                y1={nodeById.center?.y ?? H / 2}
                x2={n.x}
                y2={n.y}
                stroke={pathSet.has(n.id) ? "var(--op-indigo)" : "#cbd5e1"}
                strokeWidth={pathSet.has(n.id) ? 3 : 1.5}
              />
            ),
          )}
          {nodes.map((n) => {
            const r = n.kind === "center" ? 56 : n.kind === "mistake" ? 36 : 44;
            const fill =
              n.kind === "center" ? "#4F6EF7" : n.kind === "mistake" ? "#ef4444" : n.kind === "concept" ? "#22c55e" : "#f97316";
            return (
              <g
                key={n.id}
                data-node={n.id}
                transform={`translate(${n.x},${n.y})`}
                style={{ cursor: "pointer" }}
                onClick={() => onNodeClick(n.id)}
                onMouseDown={() => {
                  dragging.current = { id: n.id };
                }}
              >
                <circle r={r} fill={fill} opacity={0.92} stroke="#fff" strokeWidth={2} />
                <text
                  textAnchor="middle"
                  dy={4}
                  fontSize={n.kind === "center" ? 13 : 10}
                  fill="#fff"
                  fontWeight={700}
                  style={{ pointerEvents: "none" }}
                >
                  {n.kind === "mistake" ? "⚠️ " : ""}
                  {n.label.length > 18 ? `${n.label.slice(0, 16)}…` : n.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      {sel && nodeById[sel] ? (
        <div className="op-card op-fade-in" style={{ marginTop: 12, maxWidth: 480 }}>
          <strong>{nodeById[sel].label}</strong>
          <p style={{ fontSize: 14, color: "var(--op-text-secondary)" }}>{nodeById[sel].desc}</p>
          {nodeById[sel].video ? (
            <a href={nodeById[sel].video} target="_blank" rel="noreferrer" className="op-btn-secondary" style={{ display: "inline-block" }}>
              Open video
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default function ConceptMapD3({ slug, topic }: { slug: string; topic: Topic }) {
  return <ConceptMapCanvas key={slug} slug={slug} topic={topic} />;
}
