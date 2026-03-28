"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getCourseTopics, type CourseId } from "../lib/curriculum";
import { apiUrl } from "../lib/api";
import { logActivity } from "../lib/activity";
import {
  OpBadge,
  OpContextBanner,
  OpEmptyState,
  OpPanel,
  OpSpinner,
  ToolPageLayout,
} from "../components/op";

type UploadItem = {
  upload_id: string;
  stored_filename: string;
  original_filename: string;
  display_name?: string;
  bytes: number;
  indexed: boolean;
  chunk_count: number;
  course?: string | null;
  topic?: string | null;
};

type UploadListResponse = { count: number; items: UploadItem[] };

function formatBytes(n: number) {
  if (!Number.isFinite(n)) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round((n / 1024) * 10) / 10} KB`;
  return `${Math.round((n / (1024 * 1024)) * 10) / 10} MB`;
}

function statusForItem(it: UploadItem) {
  const isTxt = it.stored_filename.toLowerCase().endsWith(".txt");
  if (!isTxt) return { label: "Uploaded", tone: "warn" as const };
  if (it.indexed) return { label: `Indexed · ${it.chunk_count} chunks`, tone: "success" as const };
  return { label: "Uploaded (txt)", tone: "info" as const };
}

export default function UploadsPage() {
  const [apiStatus, setApiStatus] = useState<string>("…");
  const [busy, setBusy] = useState(false);
  const [uploadPct, setUploadPct] = useState<number | null>(null);
  const [items, setItems] = useState<UploadItem[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [previewText, setPreviewText] = useState("");
  const [message, setMessage] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [previewBusy, setPreviewBusy] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [course, setCourse] = useState<CourseId>("orgochem-2");
  const topics = useMemo(() => getCourseTopics(course), [course]);
  const [topicSlug, setTopicSlug] = useState(topics[0]?.slug || "");
  const [sourceTitle, setSourceTitle] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");

  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");

  const selected = useMemo(() => items.find((x) => x.upload_id === selectedId) || null, [items, selectedId]);

  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch(apiUrl("/health"), { cache: "no-store" });
      const data = await res.json();
      setApiStatus(String(data?.status || "unknown"));
    } catch {
      setApiStatus("down");
    }
  }, []);

  const loadUploads = useCallback(async (preferId?: string) => {
    setMessage("");
    try {
      const res = await fetch(apiUrl("/uploads"), { cache: "no-store" });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as UploadListResponse;
      const list = Array.isArray(data?.items) ? data.items : [];
      setItems(list);
      setSelectedId((cur) => {
        if (preferId && list.some((x) => x.upload_id === preferId)) return preferId;
        if (cur && list.some((x) => x.upload_id === cur)) return cur;
        return list[0]?.upload_id || "";
      });
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : "Failed to load files");
    }
  }, []);

  useEffect(() => {
    void checkHealth();
    void loadUploads();
  }, [checkHealth, loadUploads]);

  useEffect(() => {
    const next = getCourseTopics(course);
    const first = next[0]?.slug || "";
    setTopicSlug((prev) => (next.some((t) => t.slug === prev) ? prev : first));
  }, [course]);

  useEffect(() => {
    if (!selectedId) {
      setPreviewText("");
      return;
    }
    let cancelled = false;
    (async () => {
      setPreviewBusy(true);
      try {
        const res = await fetch(apiUrl(`/uploads/${encodeURIComponent(selectedId)}/text`), { cache: "no-store" });
        if (!res.ok) {
          if (!cancelled) setPreviewText("Preview available for .txt files after upload.");
          return;
        }
        const data = await res.json();
        const text = String(data?.text || "");
        if (!cancelled) setPreviewText(text.slice(0, 4000) + (text.length > 4000 ? "\n\n…truncated" : ""));
      } catch {
        if (!cancelled) setPreviewText("");
      } finally {
        if (!cancelled) setPreviewBusy(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  function uploadWithProgress(fd: FormData, url: string): Promise<Response> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setUploadPct(Math.round((100 * e.loaded) / e.total));
      };
      xhr.onload = () => {
        setUploadPct(null);
        resolve(new Response(xhr.responseText, { status: xhr.status, statusText: xhr.statusText }));
      };
      xhr.onerror = () => {
        setUploadPct(null);
        reject(new Error("Network error"));
      };
      xhr.send(fd);
    });
  }

  async function doUpload() {
    if (!file) {
      setMessage("Choose a .txt file (first-class) or another file for storage.");
      return;
    }
    setBusy(true);
    setMessage("");
    setPreviewText("");
    setUploadPct(0);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const qs = new URLSearchParams();
      qs.set("course", course);
      qs.set("topic", topicSlug);
      if (sourceUrl.trim()) qs.set("source_url", sourceUrl.trim());
      if (sourceTitle.trim()) qs.set("source_title", sourceTitle.trim());

      const res = await uploadWithProgress(fd, apiUrl(`/upload?${qs.toString()}`));
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as { upload_id?: string; chunk_count?: number };
      setFile(null);
      setMessage(`Uploaded · chunks ${data.chunk_count ?? 0}`);
      logActivity({
        kind: "upload",
        label: file.name,
        detail: `${data.chunk_count ?? 0} chunks`,
        href: "/uploads",
      });
      await loadUploads(data.upload_id);
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      setUploadPct(null);
    }
  }

  async function doIngest(id: string) {
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch(apiUrl(`/uploads/${encodeURIComponent(id)}/ingest`), { method: "POST" });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as { chunk_count?: number };
      setMessage(`Ingest complete · ${data.chunk_count ?? 0} chunks`);
      await loadUploads(id);
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : "Ingest failed");
    } finally {
      setBusy(false);
    }
  }

  async function doRename() {
    if (!selectedId) return;
    const name = renameValue.trim();
    if (!name) {
      setMessage("Name required");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(apiUrl(`/uploads/${encodeURIComponent(selectedId)}/rename`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display_name: name }),
      });
      if (!res.ok) throw new Error(await res.text());
      setRenameOpen(false);
      await loadUploads(selectedId);
      setMessage("Renamed");
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : "Rename failed");
    } finally {
      setBusy(false);
    }
  }

  async function doDelete() {
    if (!selectedId || !selected) return;
    const ok = window.confirm(`Delete ${selected.display_name || selected.original_filename}?`);
    if (!ok) return;
    setBusy(true);
    try {
      const res = await fetch(apiUrl(`/uploads/${encodeURIComponent(selectedId)}`), { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      setPreviewText("");
      setRenameOpen(false);
      await loadUploads();
      setMessage("Deleted");
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolPageLayout
      eyebrow="Study OS"
      title="Uploads & ingest"
      subtitle="Drop .txt notes, tag by Orgo II topic, and index them for Search and Ask. Other formats are stored for future pipelines."
      actions={
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <OpBadge tone={apiStatus === "ok" ? "success" : apiStatus === "down" ? "warn" : "neutral"}>
            API {apiStatus}
          </OpBadge>
          <button type="button" className="btn" onClick={() => void checkHealth()} disabled={busy}>
            Ping health
          </button>
        </div>
      }
    >
      <OpContextBanner title="Workflow">
        Upload → (txt auto-indexes on upload) → Search / Ask. Use <strong>Ingest</strong> to rebuild the index if you replace file content
        manually.
      </OpContextBanner>

      <OpPanel title="Organize metadata">
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "140px 1fr", alignItems: "center" }}>
          <span className="subtle" style={{ fontWeight: 800 }}>
            Course
          </span>
          <select className="input" value={course} onChange={(e) => setCourse(e.target.value as CourseId)} disabled={busy}>
            <option value="orgochem-1">OrgoChem I</option>
            <option value="orgochem-2">OrgoChem II</option>
          </select>
          <span className="subtle" style={{ fontWeight: 800 }}>
            Topic
          </span>
          <select className="input" value={topicSlug} onChange={(e) => setTopicSlug(e.target.value)} disabled={busy}>
            {topics.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.title}
              </option>
            ))}
          </select>
          <span className="subtle" style={{ fontWeight: 800 }}>
            Source title
          </span>
          <input className="input" value={sourceTitle} onChange={(e) => setSourceTitle(e.target.value)} placeholder="Optional" disabled={busy} />
          <span className="subtle" style={{ fontWeight: 800 }}>
            Source URL
          </span>
          <input className="input" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="Optional https://…" disabled={busy} />
        </div>
      </OpPanel>

      <OpPanel title="Upload">
        <div
          className={`opDropZone ${dragOver ? "opDropZoneActive" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files?.[0];
            if (f) setFile(f);
          }}
        >
          <div style={{ fontWeight: 900 }}>Drag & drop a file</div>
          <div className="opDropZoneHint">.txt recommended for Search / Ask indexing</div>
          <div style={{ marginTop: 12 }}>
            <input
              type="file"
              accept=".txt,text/plain"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              disabled={busy}
            />
          </div>
          {uploadPct !== null ? (
            <div style={{ marginTop: 14 }}>
              <div className="subtle" style={{ marginBottom: 6 }}>
                Uploading {uploadPct}%
              </div>
              <div className="homeProgressTrack">
                <div className="homeProgressFill" style={{ width: `${uploadPct}%` }} />
              </div>
            </div>
          ) : null}
          <div style={{ marginTop: 14 }} className="opFieldRow">
            <button type="button" className="btn btnPrimary" onClick={() => void doUpload()} disabled={busy || !file}>
              {busy ? "Working…" : "Upload"}
            </button>
            <button type="button" className="btn" onClick={() => void loadUploads()} disabled={busy}>
              Refresh list
            </button>
          </div>
        </div>
      </OpPanel>

      <OpPanel
        title={`Library (${items.length})`}
        right={
          <div className="opFieldRow">
            <Link className="btn btnPrimary" href="/search">
              Search
            </Link>
            <Link className="btn" href="/ask">
              Ask
            </Link>
          </div>
        }
      >
        {items.length === 0 ? (
          <OpEmptyState
            title="No uploads yet"
            description="Seed a demo: create a small .txt with reaction summaries, upload here, then open Search."
          >
            <Link className="btn btnPrimary" href="/search">
              Try Search
            </Link>
          </OpEmptyState>
        ) : (
          <div className="stack" style={{ display: "grid", gap: 10 }}>
            {items.map((it) => {
              const st = statusForItem(it);
              const active = it.upload_id === selectedId;
              return (
                <button
                  key={it.upload_id}
                  type="button"
                  className="progressRow"
                  style={{
                    textAlign: "left",
                    cursor: "pointer",
                    borderColor: active ? "color-mix(in srgb, var(--blue) 35%, var(--border))" : undefined,
                  }}
                  onClick={() => setSelectedId(it.upload_id)}
                  disabled={busy}
                >
                  <div className="progressRowLeft">
                    <div className="progressRowTitle">{it.display_name || it.original_filename}</div>
                    <div className="progressRowDesc">
                      {formatBytes(it.bytes)} · {it.stored_filename}
                    </div>
                  </div>
                  <div className="progressRowAction">
                    <OpBadge tone={st.tone}>{st.label}</OpBadge>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </OpPanel>

      {selected ? (
        <OpPanel title="Selected file">
          <div className="opFieldRow" style={{ justifyContent: "flex-start", flexWrap: "wrap" }}>
            <button type="button" className="btn" onClick={() => { setRenameValue(selected.display_name || ""); setRenameOpen(true); }} disabled={busy}>
              Rename
            </button>
            <button type="button" className="btn" onClick={() => void doDelete()} disabled={busy}>
              Delete
            </button>
            {selected.stored_filename.toLowerCase().endsWith(".txt") ? (
              <button type="button" className="btn btnPrimary" onClick={() => void doIngest(selected.upload_id)} disabled={busy}>
                Ingest / re-index
              </button>
            ) : null}
          </div>
          {renameOpen ? (
            <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
              <input className="input" value={renameValue} onChange={(e) => setRenameValue(e.target.value)} disabled={busy} />
              <div className="opFieldRow">
                <button type="button" className="btn" onClick={() => setRenameOpen(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btnPrimary" onClick={() => void doRename()} disabled={busy}>
                  Save name
                </button>
              </div>
            </div>
          ) : null}
          <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="topicTwoCol">
            <div>
              <div style={{ fontWeight: 850, marginBottom: 8 }}>Preview</div>
              <div className="card" style={{ boxShadow: "none", minHeight: 200 }}>
                <div className="cardInner" style={{ padding: 12 }}>
                  {busy && !previewText ? <OpSpinner label="Loading preview…" /> : null}
                  {previewText ? (
                    <pre style={{ whiteSpace: "pre-wrap", margin: 0, fontSize: 12, color: "var(--muted)", lineHeight: 1.55 }}>{previewText}</pre>
                  ) : (
                    !busy && <div className="subtle">No text preview</div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 850, marginBottom: 8 }}>Details</div>
              <div className="subtle" style={{ display: "grid", gap: 6, fontSize: 13 }}>
                <div>
                  <strong>upload_id</strong> {selected.upload_id}
                </div>
                <div>
                  <strong>Chunks</strong> {selected.chunk_count}
                </div>
                <div>
                  <strong>Indexed</strong> {selected.indexed ? "yes" : "no"}
                </div>
              </div>
            </div>
          </div>
        </OpPanel>
      ) : null}

      {message ? (
        <OpPanel title="Status" variant="muted">
          <div className="subtle" style={{ color: "var(--text)" }}>
            {message}
          </div>
        </OpPanel>
      ) : null}
    </ToolPageLayout>
  );
}
