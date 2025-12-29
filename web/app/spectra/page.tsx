"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { normalizeXY, parseJcamp, peakPick } from "../lib/jcamp";



type PeakLabel = {
  id: string;
  x: number;
  y: number;

  ppmManual: string;
  ppmAuto: number | null;

  multiplicity: string;
  integration: string;
  note: string;

  atomId: string;
};

type AtomPin = {
  id: string;
  x: number;
  y: number;
  label: string;
  note: string;
};

type AxisCalibration = {
  p1: { x: number; y: number } | null;
  p2: { x: number; y: number } | null;
  ppm1: string;
  ppm2: string;
};

type Workspace = {
  spectrumName: string;
  structureName: string;
  cal: AxisCalibration;
  peaks: PeakLabel[];
  atoms: AtomPin[];
  specScale: number;
  specOffset: { x: number; y: number };
  strScale: number;
  strOffset: { x: number; y: number };
  structureUrl: string;

  plotMode: "image" | "jcamp";
  plotView: { scaleX: number; scaleY: number; offsetX: number; offsetY: number };
};

type PlotData = {
  x: number[];
  y: number[];
  has: boolean;
  meta?: Record<string, string>;
};

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function safeFloat(s: string): number | null {
  const v = Number.parseFloat(s);
  return Number.isFinite(v) ? v : null;
}

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadCanvasPng(canvas: HTMLCanvasElement, filename: string) {
  const url = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
}

function ppmFromX(cal: AxisCalibration, wx: number): number | null {
  if (!cal.p1 || !cal.p2) return null;
  const ppm1 = safeFloat(cal.ppm1);
  const ppm2 = safeFloat(cal.ppm2);
  if (ppm1 === null || ppm2 === null) return null;

  const x1 = cal.p1.x;
  const x2 = cal.p2.x;
  if (x1 === x2) return null;

  const t = (wx - x1) / (x2 - x1);
  return ppm1 + t * (ppm2 - ppm1);
}

function classifyRegion(ppm: number): string {
  const p = ppm;
  if (p >= 9.0 && p <= 10.5) return "aldehyde";
  if (p >= 10.0 && p <= 13.5) return "carboxylic acid";
  if (p >= 6.0 && p <= 8.5) return "aromatic";
  if (p >= 4.5 && p <= 6.5) return "vinylic";
  if (p >= 3.0 && p <= 4.5) return "hetero adjacent";
  if (p >= 2.0 && p <= 3.0) return "allylic or benzylic";
  if (p >= 0.5 && p <= 2.0) return "alkyl";
  if (p < 0.5) return "unusual low";
  if (p > 13.5) return "unusual high";
  return "unknown";
}

function computeChecks(peaks: PeakLabel[], cal: AxisCalibration) {
  const issues: { level: "warn" | "info"; text: string }[] = [];

  const hasCal = !!(
    cal.p1 &&
    cal.p2 &&
    safeFloat(cal.ppm1) !== null &&
    safeFloat(cal.ppm2) !== null
  );
  if (!hasCal) {
    issues.push({
      level: "info",
      text: "Calibrate the x axis to enable auto ppm and region hints",
    });
    return issues;
  }

  const ppmVals = peaks
    .map((p) => p.ppmAuto)
    .filter((v) => v !== null) as number[];
  if (ppmVals.length === 0) {
    issues.push({
      level: "info",
      text: "Add peaks or peak pick from JCAMP to see checks",
    });
    return issues;
  }

  const aldehydeCount = ppmVals.filter((p) => p >= 9.0 && p <= 10.5).length;
  if (aldehydeCount > 1)
    issues.push({
      level: "warn",
      text: "More than one aldehyde region peak detected. Often only one CHO proton is expected",
    });

  const outside = ppmVals.filter((p) => p < -1 || p > 15).length;
  if (outside > 0)
    issues.push({
      level: "warn",
      text: "Some peaks are outside typical 1H ppm range. Recheck calibration points",
    });

  issues.push({
    level: "info",
    text: "Shortcuts: Ctrl Z undo, Ctrl Y redo, Delete remove selected, C calibrate, P peak, A atom, Space pan",
  });

  return issues;
}

function medianStep(xs: number[]) {
  if (xs.length < 3) return 1;
  const diffs: number[] = [];
  for (let i = 1; i < xs.length; i++) {
    const d = Math.abs(xs[i] - xs[i - 1]);
    if (Number.isFinite(d) && d > 0) diffs.push(d);
  }
  if (!diffs.length) return 1;
  diffs.sort((a, b) => a - b);
  return diffs[Math.floor(diffs.length / 2)] || 1;
}

export default function SpectraPage() {
  const [spectrumUrl, setSpectrumUrl] = useState<string>("");
  const [spectrumName, setSpectrumName] = useState<string>("spectrum");

  const [structureUrl, setStructureUrl] = useState<string>("");
  const [structureName, setStructureName] = useState<string>("structure");

  const spectrumImgRef = useRef<HTMLImageElement | null>(null);
  const structureImgRef = useRef<HTMLImageElement | null>(null);

  const spectrumCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const structureCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [peaks, setPeaks] = useState<PeakLabel[]>([]);
  const [atoms, setAtoms] = useState<AtomPin[]>([]);

  const [selectedPeakId, setSelectedPeakId] = useState<string>("");
  const [selectedAtomId, setSelectedAtomId] = useState<string>("");

  const [tool, setTool] = useState<
    "peak" | "panSpectrum" | "calibrate" | "atom" | "panStructure"
  >("peak");

  const [specScale, setSpecScale] = useState<number>(1);
  const [specOffset, setSpecOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const [strScale, setStrScale] = useState<number>(1);
  const [strOffset, setStrOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const [specIsPanning, setSpecIsPanning] = useState(false);
  const specPanStart = useRef<{ x: number; y: number; ox: number; oy: number } | null>(
    null
  );

  const [strIsPanning, setStrIsPanning] = useState(false);
  const strPanStart = useRef<{ x: number; y: number; ox: number; oy: number } | null>(
    null
  );

  const [cal, setCal] = useState<AxisCalibration>({
    p1: null,
    p2: null,
    ppm1: "10",
    ppm2: "0",
  });

  const [plot, setPlot] = useState<PlotData>({ x: [], y: [], has: false });
  const [plotMode, setPlotMode] = useState<"image" | "jcamp">("image");

  const [plotView, setPlotView] = useState<{
    scaleX: number;
    scaleY: number;
    offsetX: number;
    offsetY: number;
  }>({ scaleX: 1, scaleY: 1, offsetX: 0, offsetY: 0 });

  const [hover, setHover] = useState<{
    on: boolean;
    cx: number;
    cy: number;
    xVal: number | null;
    yVal: number | null;
  }>({ on: false, cx: 0, cy: 0, xVal: null, yVal: null });

  const [spaceDown, setSpaceDown] = useState(false);

  const selectedPeak = useMemo(
    () => peaks.find((p) => p.id === selectedPeakId) || null,
    [peaks, selectedPeakId]
  );
  const selectedAtom = useMemo(
    () => atoms.find((a) => a.id === selectedAtomId) || null,
    [atoms, selectedAtomId]
  );

  const checks = useMemo(() => computeChecks(peaks, cal), [peaks, cal]);

  const undoRef = useRef<Workspace[]>([]);
  const redoRef = useRef<Workspace[]>([]);

  function snapshot(): Workspace {
    return {
      spectrumName,
      structureName,
      cal,
      peaks,
      atoms,
      specScale,
      specOffset,
      strScale,
      strOffset,
      structureUrl,
      plotMode,
      plotView,
    };
  }

  function applySnapshot(w: Workspace) {
    setSpectrumName(w.spectrumName);
    setStructureName(w.structureName);
    setCal(w.cal);
    setPeaks(w.peaks);
    setAtoms(w.atoms);
    setSpecScale(w.specScale);
    setSpecOffset(w.specOffset);
    setStrScale(w.strScale);
    setStrOffset(w.strOffset);
    setStructureUrl(w.structureUrl);
    setPlotMode(w.plotMode);
    setPlotView(w.plotView);
  }

  function pushUndo() {
    undoRef.current.push(snapshot());
    if (undoRef.current.length > 50) undoRef.current.shift();
    redoRef.current = [];
  }

  function undo() {
    const prev = undoRef.current.pop();
    if (!prev) return;
    redoRef.current.push(snapshot());
    applySnapshot(prev);
    setSelectedPeakId("");
    setSelectedAtomId("");
  }

  function redo() {
    const nxt = redoRef.current.pop();
    if (!nxt) return;
    undoRef.current.push(snapshot());
    applySnapshot(nxt);
    setSelectedPeakId("");
    setSelectedAtomId("");
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === " ") {
        setSpaceDown(true);
      }
      if ((e.key === "z" || e.key === "Z") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        undo();
        return;
      }
      if ((e.key === "y" || e.key === "Y") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        redo();
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedPeakId) {
          e.preventDefault();
          pushUndo();
          setPeaks((arr) => arr.filter((p) => p.id !== selectedPeakId));
          setSelectedPeakId("");
          return;
        }
        if (selectedAtomId) {
          e.preventDefault();
          pushUndo();
          const id = selectedAtomId;
          setAtoms((arr) => arr.filter((a) => a.id !== id));
          setPeaks((arr) => arr.map((p) => (p.atomId === id ? { ...p, atomId: "" } : p)));
          setSelectedAtomId("");
          return;
        }
      }
      if (e.key === "c" || e.key === "C") setTool("calibrate");
      if (e.key === "p" || e.key === "P") setTool("peak");
      if (e.key === "a" || e.key === "A") setTool("atom");
      if (e.key === "Escape") {
        setSelectedPeakId("");
        setSelectedAtomId("");
      }
      if (e.key === "r" || e.key === "R") {
        if (plotMode === "jcamp") {
          setPlotView({ scaleX: 1, scaleY: 1, offsetX: 0, offsetY: 0 });
        } else {
          setSpecScale(1);
          setSpecOffset({ x: 0, y: 0 });
        }
      }
    }

    function onKeyUp(e: KeyboardEvent) {
      if (e.key === " ") {
        setSpaceDown(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [
    selectedPeakId,
    selectedAtomId,
    peaks,
    atoms,
    cal,
    specScale,
    specOffset,
    strScale,
    strOffset,
    structureUrl,
    spectrumName,
    structureName,
    plotMode,
    plotView,
  ]);

  function ensureCanvasSize(canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = Math.max(1, Math.floor(rect.width * dpr));
    const h = Math.max(1, Math.floor(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  }

  function specWorldFromCanvas(cx: number, cy: number) {
    return { x: (cx - specOffset.x) / specScale, y: (cy - specOffset.y) / specScale };
  }

  function specCanvasFromWorld(wx: number, wy: number) {
    return { x: wx * specScale + specOffset.x, y: wy * specScale + specOffset.y };
  }

  function strWorldFromCanvas(cx: number, cy: number) {
    return { x: (cx - strOffset.x) / strScale, y: (cy - strOffset.y) / strScale };
  }

  function strCanvasFromWorld(wx: number, wy: number) {
    return { x: wx * strScale + strOffset.x, y: wy * strScale + strOffset.y };
  }

  function recomputeAutoPpm(nextPeaks: PeakLabel[], nextCal: AxisCalibration) {
    return nextPeaks.map((p) => ({ ...p, ppmAuto: ppmFromX(nextCal, p.x) }));
  }

  function jcampBounds() {
    if (!plot.has || plot.x.length < 2) {
      return { xMin: 0, xMax: 1, yMin: 0, yMax: 1 };
    }
    let xMin = plot.x[0];
    let xMax = plot.x[0];
    for (const v of plot.x) {
      if (v < xMin) xMin = v;
      if (v > xMax) xMax = v;
    }
    return { xMin, xMax, yMin: 0, yMax: 1 };
  }

  function drawSpectrum() {
    const canvas = spectrumCanvasRef.current;
    const img = spectrumImgRef.current;
    if (!canvas) return;

    ensureCanvasSize(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);

    const wCss = canvas.width / dpr;
    const hCss = canvas.height / dpr;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, wCss, hCss);

    const padL = 56;
    const padR = 18;
    const padT = 18;
    const padB = 44;

    const frameX = padL;
    const frameY = padT;
    const frameW = wCss - padL - padR;
    const frameH = hCss - padT - padB;

    const drawFrame = () => {
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "#e5e5e5";
      ctx.lineWidth = 1;
      ctx.strokeRect(frameX, frameY, frameW, frameH);

      ctx.globalAlpha = 0.7;
      ctx.fillStyle = "#111";
      ctx.font = "12px system-ui, Arial";
      const title = plotMode === "jcamp" ? "JCAMP spectrum" : "Spectrum image";
      ctx.fillText(title, 14, 18);

      ctx.globalAlpha = 1;
    };

    if (plotMode === "jcamp" && plot.has && plot.x.length > 1) {
      const { xMin, xMax, yMin, yMax } = jcampBounds();

      const toX = (xv: number) => {
        const t = (xv - xMin) / (xMax - xMin || 1);
        const base = frameX + t * frameW;
        return base * plotView.scaleX + plotView.offsetX;
      };

      const toY = (yv: number) => {
        const t = (yv - yMin) / (yMax - yMin || 1);
        const base = frameY + (1 - t) * frameH;
        return base * plotView.scaleY + plotView.offsetY;
      };

      drawFrame();

      ctx.save();
      ctx.beginPath();
      ctx.rect(frameX, frameY, frameW, frameH);
      ctx.clip();

      ctx.strokeStyle = "#111";
      ctx.lineWidth = 1;

      ctx.beginPath();
      for (let i = 0; i < plot.x.length; i++) {
        const x = toX(plot.x[i]);
        const y = toY(plot.y[i]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      for (const p of peaks) {
        const cx = toX(p.x);
        const cy = toY(p.y);
        const active = p.id === selectedPeakId;

        ctx.beginPath();
        ctx.arc(cx, cy, active ? 5 : 4, 0, Math.PI * 2);
        ctx.fillStyle = active ? "#111" : "#444";
        ctx.fill();

        const ppmText =
          p.ppmManual.trim()
            ? `${p.ppmManual.trim()} ppm`
            : p.ppmAuto !== null
              ? `${Math.round(p.ppmAuto * 100) / 100} ppm`
              : "peak";

        ctx.font = active ? "12px system-ui, Arial" : "11px system-ui, Arial";
        ctx.fillStyle = "#111";
        ctx.globalAlpha = 0.92;
        ctx.fillText(ppmText, cx + 10, cy - 10);

        if (p.ppmAuto !== null) {
          const region = classifyRegion(p.ppmAuto);
          ctx.globalAlpha = 0.75;
          ctx.font = "10px system-ui, Arial";
          ctx.fillText(region, cx + 10, cy + 10);
          ctx.globalAlpha = 1;
        }
      }

      if (hover.on && hover.xVal !== null && hover.yVal !== null) {
        const hx = toX(hover.xVal);
        const hy = toY(hover.yVal);

        ctx.strokeStyle = "rgba(17,17,17,0.25)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(hx, frameY);
        ctx.lineTo(hx, frameY + frameH);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(hx, hy, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#111";
        ctx.fill();

        const hint = `x ${Math.round(hover.xVal * 1000) / 1000} y ${Math.round(hover.yVal * 1000) / 1000}`;
        ctx.font = "11px system-ui, Arial";
        const tw = ctx.measureText(hint).width;
        const bx = clamp(hx + 10, frameX + 6, frameX + frameW - tw - 18);
        const by = clamp(hy - 22, frameY + 6, frameY + frameH - 22);

        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.strokeStyle = "rgba(0,0,0,0.08)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(bx, by, tw + 12, 18, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#111";
        ctx.globalAlpha = 0.9;
        ctx.fillText(hint, bx + 6, by + 13);
        ctx.globalAlpha = 1;
      }

      ctx.restore();

      ctx.globalAlpha = 0.75;
      ctx.fillStyle = "#111";
      ctx.font = "11px system-ui, Arial";
      ctx.fillText("Wheel zoom, drag pan, R reset, Space to pan", 14, hCss - 14);
      ctx.globalAlpha = 1;

      return;
    }

    if (img && img.complete && spectrumUrl) {
      ctx.save();
      ctx.translate(specOffset.x, specOffset.y);
      ctx.scale(specScale, specScale);
      ctx.drawImage(img, 0, 0);
      ctx.restore();
    } else {
      ctx.fillStyle = "#fafafa";
      ctx.fillRect(0, 0, wCss, hCss);
      ctx.fillStyle = "#111";
      ctx.globalAlpha = 0.7;
      ctx.font = "14px system-ui, Arial";
      ctx.fillText("Upload a spectrum image or a JCAMP file", 18, 30);
      ctx.globalAlpha = 1;
    }

    if (cal.p1) {
      const c = specCanvasFromWorld(cal.p1.x, cal.p1.y);
      ctx.beginPath();
      ctx.arc(c.x, c.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#111";
      ctx.fill();
      ctx.font = "12px system-ui, Arial";
      ctx.fillStyle = "#111";
      ctx.fillText(`cal 1 ${cal.ppm1} ppm`, c.x + 10, c.y - 10);
    }
    if (cal.p2) {
      const c = specCanvasFromWorld(cal.p2.x, cal.p2.y);
      ctx.beginPath();
      ctx.arc(c.x, c.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#111";
      ctx.fill();
      ctx.font = "12px system-ui, Arial";
      ctx.fillStyle = "#111";
      ctx.fillText(`cal 2 ${cal.ppm2} ppm`, c.x + 10, c.y - 10);
    }

    for (const p of peaks) {
      const c = specCanvasFromWorld(p.x, p.y);
      const active = p.id === selectedPeakId;

      ctx.beginPath();
      ctx.arc(c.x, c.y, active ? 6 : 5, 0, Math.PI * 2);
      ctx.fillStyle = active ? "#111" : "#444";
      ctx.fill();

      const ppmText =
        p.ppmManual.trim()
          ? `${p.ppmManual.trim()} ppm`
          : p.ppmAuto !== null
            ? `${Math.round(p.ppmAuto * 100) / 100} ppm`
            : "peak";

      ctx.font = active ? "13px system-ui, Arial" : "12px system-ui, Arial";
      ctx.fillStyle = "#111";
      ctx.globalAlpha = 0.92;
      ctx.fillText(ppmText, c.x + 10, c.y - 10);

      if (p.ppmAuto !== null) {
        const region = classifyRegion(p.ppmAuto);
        ctx.globalAlpha = 0.75;
        ctx.font = "11px system-ui, Arial";
        ctx.fillText(region, c.x + 10, c.y + 10);
        ctx.globalAlpha = 1;
      }
    }

    drawFrame();
  }

  function drawStructure() {
    const canvas = structureCanvasRef.current;
    const img = structureImgRef.current;
    if (!canvas) return;

    ensureCanvasSize(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);

    const wCss = canvas.width / dpr;
    const hCss = canvas.height / dpr;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, wCss, hCss);

    if (img && img.complete && structureUrl) {
      ctx.save();
      ctx.translate(strOffset.x, strOffset.y);
      ctx.scale(strScale, strScale);
      ctx.drawImage(img, 0, 0);
      ctx.restore();
    } else {
      ctx.fillStyle = "#fafafa";
      ctx.fillRect(0, 0, wCss, hCss);
      ctx.fillStyle = "#111";
      ctx.globalAlpha = 0.7;
      ctx.font = "14px system-ui, Arial";
      ctx.fillText("Upload a structure image to link peaks", 18, 30);
      ctx.globalAlpha = 1;
    }

    for (const a of atoms) {
      const c = strCanvasFromWorld(a.x, a.y);
      const active = a.id === selectedAtomId;

      ctx.beginPath();
      ctx.arc(c.x, c.y, active ? 7 : 6, 0, Math.PI * 2);
      ctx.fillStyle = active ? "#111" : "#444";
      ctx.fill();

      ctx.font = active ? "13px system-ui, Arial" : "12px system-ui, Arial";
      ctx.fillStyle = "#111";
      ctx.globalAlpha = 0.92;
      ctx.fillText(a.label || "atom", c.x + 10, c.y - 10);
      ctx.globalAlpha = 1;
    }
  }

  useEffect(() => {
    drawSpectrum();
  }, [spectrumUrl, peaks, selectedPeakId, specScale, specOffset, cal, plot, plotMode, plotView, hover]);

  useEffect(() => {
    drawStructure();
  }, [structureUrl, atoms, selectedAtomId, strScale, strOffset]);

  useEffect(() => {
    function onResize() {
      drawSpectrum();
      drawStructure();
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  function onSpectrumImageFile(file: File | null) {
    if (!file) return;
    pushUndo();
    const url = URL.createObjectURL(file);
    setSpectrumUrl(url);
    setSpectrumName(file.name.replace(/\.[^/.]+$/, ""));
    setPlot({ x: [], y: [], has: false });
    setPlotMode("image");
    setPeaks([]);
    setSelectedPeakId("");
    setCal({ p1: null, p2: null, ppm1: "10", ppm2: "0" });
    setSpecScale(1);
    setSpecOffset({ x: 0, y: 0 });
    setHover({ on: false, cx: 0, cy: 0, xVal: null, yVal: null });
  }

  async function onJcampFile(file: File | null) {
    if (!file) return;
    pushUndo();
    const text = await file.text();
    const parsed = parseJcamp(text);
    const norm = normalizeXY(parsed.x, parsed.y);
    setPlot({ x: norm.x, y: norm.y, has: norm.x.length > 1, meta: parsed.meta });
    setPlotMode("jcamp");
    setSpectrumUrl("");
    setSpectrumName(file.name.replace(/\.[^/.]+$/, ""));
    setPeaks([]);
    setSelectedPeakId("");
    setCal({ p1: null, p2: null, ppm1: "10", ppm2: "0" });
    setPlotView({ scaleX: 1, scaleY: 1, offsetX: 0, offsetY: 0 });
    setHover({ on: false, cx: 0, cy: 0, xVal: null, yVal: null });
  }

  function onStructureFile(file: File | null) {
    if (!file) return;
    pushUndo();
    const url = URL.createObjectURL(file);
    setStructureUrl(url);
    setStructureName(file.name.replace(/\.[^/.]+$/, ""));
    setAtoms([]);
    setSelectedAtomId("");
    setStrScale(1);
    setStrOffset({ x: 0, y: 0 });
  }

  function spectrumHitPeak(canvasX: number, canvasY: number) {
    if (plotMode === "jcamp" && plot.has) {
      const { xMin, xMax, yMin, yMax } = jcampBounds();

      const canvas = spectrumCanvasRef.current;
      if (!canvas) return "";
      const rect = canvas.getBoundingClientRect();
      const wCss = rect.width;
      const hCss = rect.height;

      const padL = 56;
      const padR = 18;
      const padT = 18;
      const padB = 44;

      const frameX = padL;
      const frameY = padT;
      const frameW = wCss - padL - padR;
      const frameH = hCss - padT - padB;

      const toX = (xv: number) => {
        const t = (xv - xMin) / (xMax - xMin || 1);
        const base = frameX + t * frameW;
        return base * plotView.scaleX + plotView.offsetX;
      };
      const toY = (yv: number) => {
        const t = (yv - yMin) / (yMax - yMin || 1);
        const base = frameY + (1 - t) * frameH;
        return base * plotView.scaleY + plotView.offsetY;
      };

      for (let i = peaks.length - 1; i >= 0; i--) {
        const p = peaks[i];
        const cx = toX(p.x);
        const cy = toY(p.y);
        const dx = canvasX - cx;
        const dy = canvasY - cy;
        if (dx * dx + dy * dy <= 14 * 14) return p.id;
      }
      return "";
    }

    for (let i = peaks.length - 1; i >= 0; i--) {
      const p = peaks[i];
      const c = specCanvasFromWorld(p.x, p.y);
      const dx = canvasX - c.x;
      const dy = canvasY - c.y;
      if (dx * dx + dy * dy <= 14 * 14) return p.id;
    }
    return "";
  }

  function structureHitAtom(canvasX: number, canvasY: number) {
    for (let i = atoms.length - 1; i >= 0; i--) {
      const a = atoms[i];
      const c = strCanvasFromWorld(a.x, a.y);
      const dx = canvasX - c.x;
      const dy = canvasY - c.y;
      if (dx * dx + dy * dy <= 16 * 16) return a.id;
    }
    return "";
  }

  function onSpectrumWheel(e: React.WheelEvent) {
    if (!spectrumCanvasRef.current) return;
    e.preventDefault();

    const rect = spectrumCanvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (plotMode === "jcamp") {
      const factor = e.deltaY < 0 ? 1.08 : 0.92;
      const nextScaleX = clamp(plotView.scaleX * factor, 0.6, 12);
      const nextScaleY = clamp(plotView.scaleY * factor, 0.6, 12);

      const xBefore = (mx - plotView.offsetX) / plotView.scaleX;
      const yBefore = (my - plotView.offsetY) / plotView.scaleY;

      const nextOffsetX = mx - xBefore * nextScaleX;
      const nextOffsetY = my - yBefore * nextScaleY;

      setPlotView({
        scaleX: nextScaleX,
        scaleY: nextScaleY,
        offsetX: nextOffsetX,
        offsetY: nextOffsetY,
      });
      return;
    }

    const factor = e.deltaY < 0 ? 1.08 : 0.92;
    const nextScale = clamp(specScale * factor, 0.5, 6);

    const before = specWorldFromCanvas(mx, my);
    const nextOffset = { x: mx - before.x * nextScale, y: my - before.y * nextScale };

    setSpecScale(nextScale);
    setSpecOffset(nextOffset);
  }

  function onStructureWheel(e: React.WheelEvent) {
    if (!structureCanvasRef.current) return;
    e.preventDefault();

    const rect = structureCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const factor = e.deltaY < 0 ? 1.08 : 0.92;
    const nextScale = clamp(strScale * factor, 0.5, 6);

    const before = strWorldFromCanvas(x, y);
    const nextOffset = { x: x - before.x * nextScale, y: y - before.y * nextScale };

    setStrScale(nextScale);
    setStrOffset(nextOffset);
  }

  function onSpectrumMouseDown(e: React.MouseEvent) {
    if (!spectrumCanvasRef.current) return;

    const rect = spectrumCanvasRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    const panIntent = spaceDown || tool === "panSpectrum";

    if (plotMode === "jcamp") {
      if (panIntent) {
        setSpecIsPanning(true);
        specPanStart.current = { x: e.clientX, y: e.clientY, ox: plotView.offsetX, oy: plotView.offsetY };
        return;
      }

      const hit = spectrumHitPeak(cx, cy);
      if (hit) {
        setSelectedPeakId(hit);
        const peak = peaks.find((p) => p.id === hit);
        if (peak?.atomId) setSelectedAtomId(peak.atomId);
        return;
      }

      return;
    }

    if (panIntent) {
      setSpecIsPanning(true);
      specPanStart.current = { x: e.clientX, y: e.clientY, ox: specOffset.x, oy: specOffset.y };
      return;
    }

    const hit = spectrumHitPeak(cx, cy);
    if (hit) {
      setSelectedPeakId(hit);
      const peak = peaks.find((p) => p.id === hit);
      if (peak?.atomId) setSelectedAtomId(peak.atomId);
      return;
    }

    if (!spectrumUrl) return;

    const w = specWorldFromCanvas(cx, cy);

    if (tool === "calibrate") {
      pushUndo();
      setCal((prev) => {
        const next = { ...prev };
        if (!next.p1) next.p1 = { x: w.x, y: w.y };
        else if (!next.p2) next.p2 = { x: w.x, y: w.y };
        else {
          next.p1 = { x: w.x, y: w.y };
          next.p2 = null;
        }
        return next;
      });
      return;
    }

    if (tool === "peak") {
      pushUndo();
      const id = uid();
      const next: PeakLabel = {
        id,
        x: w.x,
        y: w.y,
        ppmManual: "",
        ppmAuto: null,
        multiplicity: "",
        integration: "",
        note: "",
        atomId: "",
      };

      const nextPeaks = recomputeAutoPpm([...peaks, next], cal);
      setPeaks(nextPeaks);
      setSelectedPeakId(id);
      return;
    }
  }

  function onStructureMouseDown(e: React.MouseEvent) {
    if (!structureCanvasRef.current) return;

    const rect = structureCanvasRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    const panIntent = spaceDown || tool === "panStructure";

    if (panIntent) {
      setStrIsPanning(true);
      strPanStart.current = { x: e.clientX, y: e.clientY, ox: strOffset.x, oy: strOffset.y };
      return;
    }

    const hit = structureHitAtom(cx, cy);
    if (hit) {
      setSelectedAtomId(hit);
      const linkedPeak = peaks.find((p) => p.atomId === hit);
      if (linkedPeak) setSelectedPeakId(linkedPeak.id);
      return;
    }

    if (!structureUrl) return;

    const w = strWorldFromCanvas(cx, cy);

    if (tool === "atom") {
      pushUndo();
      const id = uid();
      const nextLabel = `H${atoms.length + 1}`;
      setAtoms((arr) => [...arr, { id, x: w.x, y: w.y, label: nextLabel, note: "" }]);
      setSelectedAtomId(id);
      return;
    }
  }

  function onSpectrumMouseMove(e: React.MouseEvent) {
    if (!spectrumCanvasRef.current) return;

    const rect = spectrumCanvasRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    if (specIsPanning && specPanStart.current) {
      const dx = e.clientX - specPanStart.current.x;
      const dy = e.clientY - specPanStart.current.y;

      if (plotMode === "jcamp") {
        setPlotView((pv) => ({ ...pv, offsetX: specPanStart.current!.ox + dx, offsetY: specPanStart.current!.oy + dy }));
      } else {
        setSpecOffset({ x: specPanStart.current.ox + dx, y: specPanStart.current.oy + dy });
      }
      return;
    }

    if (plotMode === "jcamp" && plot.has && plot.x.length > 1) {
      const { xMin, xMax } = jcampBounds();
      const step = medianStep(plot.x);

      const wCss = rect.width;
      const hCss = rect.height;

      const padL = 56;
      const padR = 18;
      const padT = 18;
      const padB = 44;

      const frameX = padL;
      const frameW = wCss - padL - padR;

      const baseX = (cx - plotView.offsetX) / plotView.scaleX;
      const t = (baseX - frameX) / (frameW || 1);
      const xVal = xMin + clamp(t, 0, 1) * (xMax - xMin);

      const approxIdx = Math.round((xVal - plot.x[0]) / (step || 1));
      const idx = clamp(approxIdx, 0, plot.x.length - 1);

      setHover({ on: true, cx, cy, xVal: plot.x[idx], yVal: plot.y[idx] });
      return;
    }

    setHover({ on: false, cx: 0, cy: 0, xVal: null, yVal: null });
  }

  function onStructureMouseMove(e: React.MouseEvent) {
    if (!strIsPanning || !strPanStart.current) return;
    const dx = e.clientX - strPanStart.current.x;
    const dy = e.clientY - strPanStart.current.y;
    setStrOffset({ x: strPanStart.current.ox + dx, y: strPanStart.current.oy + dy });
  }

  function onSpectrumMouseUp() {
    setSpecIsPanning(false);
    specPanStart.current = null;
  }

  function onStructureMouseUp() {
    setStrIsPanning(false);
    strPanStart.current = null;
  }

  function applyCalibration() {
    pushUndo();
    setPeaks((arr) => recomputeAutoPpm(arr, cal));
  }

  function peakPickFromJcamp(maxPeaks: number) {
    if (!plot.has) return;
    pushUndo();
    const found = peakPick(plot.x, plot.y, { maxPeaks, minProminence: 0.06, minDistancePoints: 10 });

    const next: PeakLabel[] = found.map((p, idx) => ({
      id: uid(),
      x: p.x,
      y: p.y,
      ppmManual: "",
      ppmAuto: null,
      multiplicity: "",
      integration: "",
      note: `auto peak ${idx + 1}`,
      atomId: "",
    }));

    setPeaks(next);
    setSelectedPeakId(next[0]?.id || "");
  }

  function updateSelectedPeak(patch: Partial<PeakLabel>) {
    if (!selectedPeakId) return;
    pushUndo();
    setPeaks((arr) =>
      recomputeAutoPpm(
        arr.map((p) => (p.id === selectedPeakId ? { ...p, ...patch } : p)),
        cal
      )
    );
  }

  function updateSelectedAtom(patch: Partial<AtomPin>) {
    if (!selectedAtomId) return;
    pushUndo();
    setAtoms((arr) => arr.map((a) => (a.id === selectedAtomId ? { ...a, ...patch } : a)));
  }

  function linkSelectedPeakToSelectedAtom() {
    if (!selectedPeakId || !selectedAtomId) return;
    pushUndo();
    setPeaks((arr) => arr.map((p) => (p.id === selectedPeakId ? { ...p, atomId: selectedAtomId } : p)));
  }

  function exportWorkspace() {
    const payload = snapshot();
    downloadText(`${spectrumName}_workspace.json`, JSON.stringify(payload, null, 2));
  }

  function exportAnnotatedPngs() {
    const specCanvas = spectrumCanvasRef.current;
    if (specCanvas) downloadCanvasPng(specCanvas, `${spectrumName}_annotated.png`);

    const strCanvas = structureCanvasRef.current;
    if (strCanvas && structureUrl) downloadCanvasPng(strCanvas, `${structureName}_annotated.png`);
  }

  const selectedRegion = useMemo(() => {
    const ppm = selectedPeak?.ppmAuto;
    if (ppm === null || ppm === undefined) return "";
    return classifyRegion(ppm);
  }, [selectedPeak]);

  const topBarStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 12,
    flexWrap: "wrap",
  };

  const cardStyle: React.CSSProperties = {
    border: "1px solid #e5e5e5",
    borderRadius: 14,
    background: "white",
    padding: 14,
  };

  const buttonStyle = (active?: boolean): React.CSSProperties => ({
    padding: "10px 12px",
    borderRadius: 12,
    border: active ? "1px solid #111" : "1px solid #e5e5e5",
    background: active ? "#111" : "white",
    color: active ? "white" : "#111",
    cursor: "pointer",
    fontWeight: 800,
  });

  return (
    <main style={{ padding: 18, background: "#fafafa", minHeight: "100vh" }}>
      <div style={topBarStyle}>
        <div style={{ display: "grid", gap: 4 }}>
          <div style={{ fontSize: 18, fontWeight: 900 }}>NMR Studio</div>
          <div style={{ fontSize: 12, opacity: 0.75 }}>
            Wheel zoom. Drag pan. Space pan. R reset. Click peaks to select.
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ fontSize: 12, opacity: 0.75 }}>Ctrl Z undo</div>
          <div style={{ fontSize: 12, opacity: 0.75 }}>Ctrl Y redo</div>
          {selectedRegion === "aldehyde" ? (
            <Link href="/mechanisms?topic=aldehyde" style={{ fontSize: 12, fontWeight: 900 }}>
              Open aldehyde mechanisms
            </Link>
          ) : null}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "340px 1fr 340px",
          gap: 14,
          minHeight: "calc(100vh - 140px)",
        }}
      >
        <div style={{ ...cardStyle, display: "grid", gap: 12, height: "fit-content" }}>
          <div style={{ fontSize: 14, fontWeight: 900 }}>Inputs</div>

          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Spectrum image</div>
            <input type="file" accept="image/*" onChange={(e) => onSpectrumImageFile(e.target.files?.[0] || null)} />
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ fontSize: 12, opacity: 0.8 }}>JCAMP file</div>
            <input type="file" accept=".jdx,.dx,.jcamp,.txt" onChange={(e) => onJcampFile(e.target.files?.[0] || null)} />
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Structure image</div>
            <input type="file" accept="image/*" onChange={(e) => onStructureFile(e.target.files?.[0] || null)} />
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 900 }}>Tools</div>

            <div style={{ display: "grid", gap: 8 }}>
              <button type="button" onClick={() => setTool("peak")} style={buttonStyle(tool === "peak")}>
                Peak tool P
              </button>

              <button type="button" onClick={() => setTool("calibrate")} style={buttonStyle(tool === "calibrate")}>
                Calibrate tool C
              </button>

              <button type="button" onClick={() => setTool("panSpectrum")} style={buttonStyle(tool === "panSpectrum")}>
                Pan spectrum
              </button>

              <button type="button" onClick={() => setTool("atom")} style={buttonStyle(tool === "atom")}>
                Atom tool A
              </button>

              <button type="button" onClick={() => setTool("panStructure")} style={buttonStyle(tool === "panStructure")}>
                Pan structure
              </button>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 12, display: "grid", gap: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 900 }}>Calibration</div>

            <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
              <label style={{ display: "grid", gap: 6 }}>
                <div style={{ fontSize: 11, opacity: 0.8 }}>Point 1 ppm</div>
                <input
                  value={cal.ppm1}
                  onChange={(e) => setCal((c) => ({ ...c, ppm1: e.target.value }))}
                  style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e5e5" }}
                />
              </label>

              <label style={{ display: "grid", gap: 6 }}>
                <div style={{ fontSize: 11, opacity: 0.8 }}>Point 2 ppm</div>
                <input
                  value={cal.ppm2}
                  onChange={(e) => setCal((c) => ({ ...c, ppm2: e.target.value }))}
                  style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e5e5" }}
                />
              </label>
            </div>

            <button
              type="button"
              onClick={applyCalibration}
              style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid #e5e5e5", background: "white", cursor: "pointer", fontWeight: 900 }}
              disabled={plotMode === "jcamp"}
              title={plotMode === "jcamp" ? "Calibration for image mode in this version" : ""}
            >
              Apply calibration
            </button>

            <div style={{ fontSize: 12, opacity: 0.75 }}>
              Calibrate mode. Click two known x axis points then apply. For JCAMP, we will add ppm calibration next.
            </div>
          </div>

          <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 12, display: "grid", gap: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 900 }}>JCAMP</div>
            <button
              type="button"
              onClick={() => peakPickFromJcamp(12)}
              disabled={!plot.has}
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid #111",
                background: "#111",
                color: "white",
                cursor: plot.has ? "pointer" : "not-allowed",
                opacity: plot.has ? 1 : 0.5,
                fontWeight: 950,
              }}
            >
              Auto peak pick
            </button>

            <button
              type="button"
              onClick={() => setPlotView({ scaleX: 1, scaleY: 1, offsetX: 0, offsetY: 0 })}
              disabled={!plot.has || plotMode !== "jcamp"}
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid #e5e5e5",
                background: "white",
                cursor: plot.has && plotMode === "jcamp" ? "pointer" : "not-allowed",
                opacity: plot.has && plotMode === "jcamp" ? 1 : 0.5,
                fontWeight: 900,
              }}
            >
              Reset view R
            </button>
          </div>

          <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 12, display: "grid", gap: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 900 }}>Intelligence</div>
            <div style={{ display: "grid", gap: 8 }}>
              {checks.map((c, i) => (
                <div
                  key={i}
                  style={{
                    border: "1px solid #e5e5e5",
                    borderRadius: 12,
                    padding: 10,
                    background: c.level === "warn" ? "#fff7f7" : "white",
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 900 }}>{c.level === "warn" ? "Check" : "Hint"}</div>
                  <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>{c.text}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 12, display: "grid", gap: 10 }}>
            <button
              type="button"
              onClick={exportWorkspace}
              style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid #e5e5e5", background: "white", cursor: "pointer", fontWeight: 900 }}
            >
              Export workspace JSON
            </button>

            <button
              type="button"
              onClick={exportAnnotatedPngs}
              style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid #111", background: "#111", color: "white", cursor: "pointer", fontWeight: 950 }}
            >
              Export annotated PNG
            </button>
          </div>
        </div>

        <div style={{ border: "1px solid #e5e5e5", borderRadius: 14, background: "white", overflow: "hidden", position: "relative", minHeight: 680 }}>
          {spectrumUrl ? (
            <img
              ref={spectrumImgRef}
              src={spectrumUrl}
              alt=""
              style={{ display: "none" }}
              onLoad={() => drawSpectrum()}
            />
          ) : null}

          <canvas
            ref={spectrumCanvasRef}
            onWheel={onSpectrumWheel}
            onMouseDown={onSpectrumMouseDown}
            onMouseMove={onSpectrumMouseMove}
            onMouseUp={onSpectrumMouseUp}
            onMouseLeave={() => {
              onSpectrumMouseUp();
              setHover({ on: false, cx: 0, cy: 0, xVal: null, yVal: null });
            }}
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              cursor:
                spaceDown || tool === "panSpectrum"
                  ? specIsPanning
                    ? "grabbing"
                    : "grab"
                  : "crosshair",
            }}
          />
        </div>

        <div style={{ border: "1px solid #e5e5e5", borderRadius: 14, background: "white", overflow: "hidden", position: "relative", minHeight: 680, display: "grid", gridTemplateRows: "1fr auto" }}>
          {structureUrl ? (
            <img
              ref={structureImgRef}
              src={structureUrl}
              alt=""
              style={{ display: "none" }}
              onLoad={() => drawStructure()}
            />
          ) : null}

          <canvas
            ref={structureCanvasRef}
            onWheel={onStructureWheel}
            onMouseDown={onStructureMouseDown}
            onMouseMove={onStructureMouseMove}
            onMouseUp={onStructureMouseUp}
            onMouseLeave={onStructureMouseUp}
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              cursor:
                spaceDown || tool === "panStructure"
                  ? strIsPanning
                    ? "grabbing"
                    : "grab"
                  : "crosshair",
            }}
          />

          <div style={{ borderTop: "1px solid #f0f0f0", padding: 12, display: "grid", gap: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 950 }}>Linking</div>

            <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
              <div style={{ border: "1px solid #e5e5e5", borderRadius: 12, padding: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 950 }}>Selected peak</div>
                <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>
                  {selectedPeak
                    ? selectedPeak.ppmManual.trim()
                      ? `${selectedPeak.ppmManual.trim()} ppm`
                      : selectedPeak.ppmAuto !== null
                        ? `${Math.round(selectedPeak.ppmAuto * 100) / 100} ppm`
                        : "peak"
                    : "none"}
                </div>

                {selectedPeak ? (
                  <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
                    <label style={{ display: "grid", gap: 6 }}>
                      <div style={{ fontSize: 11, opacity: 0.8 }}>Manual ppm</div>
                      <input
                        value={selectedPeak.ppmManual}
                        onChange={(e) => updateSelectedPeak({ ppmManual: e.target.value })}
                        style={{ padding: 9, borderRadius: 10, border: "1px solid #e5e5e5" }}
                      />
                    </label>
                    <label style={{ display: "grid", gap: 6 }}>
                      <div style={{ fontSize: 11, opacity: 0.8 }}>Multiplicity</div>
                      <input
                        value={selectedPeak.multiplicity}
                        onChange={(e) => updateSelectedPeak({ multiplicity: e.target.value })}
                        style={{ padding: 9, borderRadius: 10, border: "1px solid #e5e5e5" }}
                      />
                    </label>
                    <label style={{ display: "grid", gap: 6 }}>
                      <div style={{ fontSize: 11, opacity: 0.8 }}>Integration</div>
                      <input
                        value={selectedPeak.integration}
                        onChange={(e) => updateSelectedPeak({ integration: e.target.value })}
                        style={{ padding: 9, borderRadius: 10, border: "1px solid #e5e5e5" }}
                      />
                    </label>
                  </div>
                ) : null}
              </div>

              <div style={{ border: "1px solid #e5e5e5", borderRadius: 12, padding: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 950 }}>Selected atom</div>
                <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>
                  {selectedAtom ? selectedAtom.label || "atom" : "none"}
                </div>

                {selectedAtom ? (
                  <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
                    <label style={{ display: "grid", gap: 6 }}>
                      <div style={{ fontSize: 11, opacity: 0.8 }}>Atom label</div>
                      <input
                        value={selectedAtom.label}
                        onChange={(e) => updateSelectedAtom({ label: e.target.value })}
                        style={{ padding: 9, borderRadius: 10, border: "1px solid #e5e5e5" }}
                      />
                    </label>
                    <label style={{ display: "grid", gap: 6 }}>
                      <div style={{ fontSize: 11, opacity: 0.8 }}>Note</div>
                      <input
                        value={selectedAtom.note}
                        onChange={(e) => updateSelectedAtom({ note: e.target.value })}
                        style={{ padding: 9, borderRadius: 10, border: "1px solid #e5e5e5" }}
                      />
                    </label>
                  </div>
                ) : null}
              </div>
            </div>

            <button
              type="button"
              onClick={linkSelectedPeakToSelectedAtom}
              disabled={!selectedPeakId || !selectedAtomId}
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid #111",
                background: "#111",
                color: "white",
                cursor: selectedPeakId && selectedAtomId ? "pointer" : "not-allowed",
                opacity: selectedPeakId && selectedAtomId ? 1 : 0.5,
                fontWeight: 950,
              }}
            >
              Link peak to atom
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
