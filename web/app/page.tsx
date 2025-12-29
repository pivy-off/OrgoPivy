import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ padding: 18 }}>
      <div
        style={{
          border: "1px solid #e5e5e5",
          borderRadius: 14,
          padding: 18,
          background: "white",
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 750, marginBottom: 6 }}>
          Organic chemistry workbench
        </div>
        <div style={{ opacity: 0.75, marginBottom: 14 }}>
          Mechanisms and spectra are first class tools
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link
            href="/mechanisms"
            style={{
              textDecoration: "none",
              border: "1px solid #111",
              borderRadius: 12,
              padding: "10px 12px",
              color: "#111",
              fontWeight: 600,
            }}
          >
            Mechanism Canvas
          </Link>

          <Link
            href="/spectra"
            style={{
              textDecoration: "none",
              border: "1px solid #111",
              borderRadius: 12,
              padding: "10px 12px",
              color: "#111",
              fontWeight: 600,
            }}
          >
            NMR Studio
          </Link>

          <Link
            href="/search"
            style={{
              textDecoration: "none",
              border: "1px solid #e5e5e5",
              borderRadius: 12,
              padding: "10px 12px",
              color: "#111",
              fontWeight: 600,
            }}
          >
            Search Notes
          </Link>

          <Link
            href="/uploads"
            style={{
              textDecoration: "none",
              border: "1px solid #e5e5e5",
              borderRadius: 12,
              padding: "10px 12px",
              color: "#111",
              fontWeight: 600,
            }}
          >
            Upload and Ingest
          </Link>
        </div>
      </div>
    </main>
  );
}
