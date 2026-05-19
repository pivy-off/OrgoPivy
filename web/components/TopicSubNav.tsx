"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { findTopic } from "@/app/lib/curriculum";

const SPECTRA_SLUGS = new Set([
  "nmr-spectroscopy-review",
  "alcohols-phenols",
  "carboxylic-acids-derivatives",
  "aldehydes-ketones",
]);

export default function TopicSubNav() {
  const params = useParams();
  const pathname = usePathname();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const topic = findTopic("orgochem-2", slug);
  const title = topic?.title ?? slug.replace(/-/g, " ");

  const base = `/orgochem-2/${encodeURIComponent(slug)}`;
  const items: { href: string; label: string; icon: string; key: string }[] = [
    { href: `${base}/notebook`, label: "AI", icon: "🧠", key: "notebook" },
    { href: `${base}/flashcards`, label: "Cards", icon: "🃏", key: "flashcards" },
    { href: `${base}/mechanisms`, label: "Mechs", icon: "⚗️", key: "mechanisms" },
    { href: `${base}/practice-exam`, label: "Exam", icon: "📝", key: "practice-exam" },
    { href: `${base}/concept-map`, label: "Map", icon: "🗺️", key: "concept-map" },
  ];
  if (SPECTRA_SLUGS.has(slug)) {
    items.push({ href: `${base}/spectra-lab`, label: "Spectra", icon: "🔬", key: "spectra-lab" });
  }

  const active = (href: string) => pathname === href || pathname?.startsWith(href + "/");

  return (
    <nav
      className="op-topic-subnav"
      style={{
        borderBottom: "1px solid var(--op-border, #e5e7eb)",
        background: "var(--op-card-bg, #fff)",
        fontFamily: "var(--op-font-sans, sans-serif)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 16px",
          flexWrap: "nowrap",
          overflowX: "auto",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <Link
          href={base}
          style={{
            flexShrink: 0,
            textDecoration: "none",
            color: "var(--op-text-primary)",
            fontWeight: 700,
            padding: "6px 10px",
            borderRadius: 8,
            whiteSpace: "nowrap",
          }}
        >
          ← {title}
        </Link>
        <div style={{ width: 1, height: 22, background: "var(--op-border)", flexShrink: 0 }} />
        {items.map((it) => {
          const on = active(it.href);
          return (
            <Link
              key={it.key}
              href={it.href}
              title={it.label}
              style={{
                flexShrink: 0,
                textDecoration: "none",
                color: on ? "var(--op-indigo)" : "var(--op-text-secondary)",
                fontWeight: on ? 800 : 600,
                fontSize: 13,
                padding: "8px 12px",
                borderRadius: 8,
                borderBottom: on ? "3px solid var(--op-indigo)" : "3px solid transparent",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                transition: "var(--op-transition)",
              }}
            >
              <span aria-hidden>{it.icon}</span>
              <span className="op-subnav-label">{it.label}</span>
            </Link>
          );
        })}
      </div>
      <style jsx>{`
        @media (max-width: 640px) {
          .op-subnav-label {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
}
