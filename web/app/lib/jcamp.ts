// app/lib/jcamp.ts

export type JcampSpectrum = {
  x: number[];
  y: number[];
  meta: Record<string, string>;
};

export type XY = {
  x: number[];
  y: number[];
};

export type NormalizeOptions = {
  invertY?: boolean;
  yFloorQuantile?: number;
  yCeilQuantile?: number;
};

export type PeakPickOptions = {
  maxPeaks?: number;
  minProminence?: number;
  minDistancePoints?: number;
};

export type PeakPoint = {
  x: number;
  y: number;
};

function num(s: string): number | null {
  const v = Number.parseFloat(s);
  return Number.isFinite(v) ? v : null;
}

function quantile(sorted: number[], q: number): number {
  if (!sorted.length) return 0;
  const qq = Math.min(1, Math.max(0, q));
  const pos = (sorted.length - 1) * qq;
  const base = Math.floor(pos);
  const rest = pos - base;
  const a = sorted[base] ?? sorted[sorted.length - 1];
  const b = sorted[base + 1] ?? a;
  return a + rest * (b - a);
}

/*
  Minimal JCAMP DX parser
  Supports common XYDATA style blocks where each data line begins with an X value
  followed by multiple Y values
*/
export function parseJcamp(text: string): JcampSpectrum {
  const lines = text.split(/\r?\n/);

  const meta: Record<string, string> = {};
  const x: number[] = [];
  const y: number[] = [];

  let firstX: number | null = null;
  let lastX: number | null = null;
  let deltaX: number | null = null;
  let xFactor = 1;
  let yFactor = 1;

  let inXYDATA = false;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    if (line.startsWith("##")) {
      inXYDATA = false;

      const idx = line.indexOf("=");
      if (idx === -1) continue;

      const key = line.slice(2, idx).trim().toUpperCase();
      const value = line.slice(idx + 1).trim();

      meta[key] = value;

      if (key === "FIRSTX") {
        const v = num(value);
        if (v !== null) firstX = v;
      }
      if (key === "LASTX") {
        const v = num(value);
        if (v !== null) lastX = v;
      }
      if (key === "DELTAX") {
        const v = num(value);
        if (v !== null) deltaX = v;
      }
      if (key === "XFACTOR") {
        const v = num(value);
        if (v !== null) xFactor = v;
      }
      if (key === "YFACTOR") {
        const v = num(value);
        if (v !== null) yFactor = v;
      }

      if (key.startsWith("XYDATA")) {
        inXYDATA = true;
      }
      if (key === "END") {
        inXYDATA = false;
      }

      continue;
    }

    if (!inXYDATA) continue;

    const parts = line
      .split(/[\s,]+/)
      .map((v) => Number(v))
      .filter((n) => Number.isFinite(n));

    if (parts.length < 2) continue;

    const xStart = parts[0] * xFactor;
    const yValues = parts.slice(1).map((v) => v * yFactor);
    if (!yValues.length) continue;

    let step = deltaX ?? 1;
    if (deltaX === null && firstX !== null && lastX !== null && yValues.length > 1) {
      step = ((lastX - firstX) / Math.max(1, yValues.length - 1)) * xFactor;
    } else {
      step = step * xFactor;
    }

    for (let i = 0; i < yValues.length; i++) {
      x.push(xStart + i * step);
      y.push(yValues[i]);
    }
  }

  return { x, y, meta };
}

/*
  Normalize for plotting
  x unchanged
  y scaled to 0..1 by robust quantiles
*/
export function normalizeXY(
  x: number[],
  y: number[],
  opts: NormalizeOptions = {}
): XY {
  const n = Math.min(x.length, y.length);
  if (n === 0) return { x: [], y: [] };

  const invertY = Boolean(opts.invertY);
  const floorQ = opts.yFloorQuantile ?? 0.02;
  const ceilQ = opts.yCeilQuantile ?? 0.98;

  const ySlice = y.slice(0, n).map((v) => (Number.isFinite(v) ? v : 0));
  const sorted = [...ySlice].sort((a, b) => a - b);

  const lo = quantile(sorted, floorQ);
  const hi = quantile(sorted, ceilQ);
  const denom = hi - lo === 0 ? 1 : hi - lo;

  const yNorm = ySlice.map((v) => {
    const clamped = Math.min(hi, Math.max(lo, v));
    const scaled = (clamped - lo) / denom;
    return invertY ? 1 - scaled : scaled;
  });

  return { x: x.slice(0, n), y: yNorm };
}

/*
  Peak picking
  Returns points shaped as { x y } for your spectra page
*/
export function peakPick(
  x: number[],
  y: number[],
  maxPeaksOrOpts: number | PeakPickOptions = {}
): PeakPoint[] {
  const opts: PeakPickOptions =
    typeof maxPeaksOrOpts === "number" ? { maxPeaks: maxPeaksOrOpts } : maxPeaksOrOpts;

  const n = Math.min(x.length, y.length);
  if (n < 3) return [];

  const maxPeaks = opts.maxPeaks ?? 12;
  const minProm = opts.minProminence ?? 0.06;
  const minDist = Math.max(1, opts.minDistancePoints ?? 10);

  const xArr = x.slice(0, n);
  const yArr = y.slice(0, n).map((v) => (Number.isFinite(v) ? v : 0));

  const candidates: { i: number; score: number }[] = [];

  for (let i = 1; i < n - 1; i++) {
    const prev = yArr[i - 1];
    const curr = yArr[i];
    const next = yArr[i + 1];

    if (!(curr > prev && curr > next)) continue;

    const base = Math.min(prev, next);
    const prom = curr - base;

    if (prom < minProm) continue;

    candidates.push({ i, score: prom });
  }

  candidates.sort((a, b) => b.score - a.score);

  const picked: number[] = [];
  for (const c of candidates) {
    if (picked.length >= maxPeaks) break;

    let tooClose = false;
    for (const j of picked) {
      if (Math.abs(c.i - j) < minDist) {
        tooClose = true;
        break;
      }
    }
    if (tooClose) continue;

    picked.push(c.i);
  }

  const peaks = picked.map((i) => ({ x: xArr[i], y: yArr[i] }));
  peaks.sort((a, b) => a.x - b.x);
  return peaks;
}
