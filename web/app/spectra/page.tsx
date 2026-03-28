"use client";

import NMRStudio from "../components/NMRStudio";

/**
 * NMR Studio entry. The legacy full-page canvas workspace was archived; the active
 * student experience is `NMRStudio` (mock analysis + import). Further splits:
 * panels/hooks can live under `components/nmr/` without changing routes.
 */
export default function SpectraPage() {
  return (
    <main className="opToolPage">
      <div className="opToolInner">
        <NMRStudio />
      </div>
    </main>
  );
}
