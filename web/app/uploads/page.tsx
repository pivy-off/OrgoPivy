// web/app/uploads/page.tsx
// Full replacement file

"use client";

import { useEffect, useMemo, useState } from "react";
import { getCourseTopics, type CourseId } from "../lib/curriculum";

type UploadItem = {
  stored_filename: string;
  original_filename: string;
  display_name: string;
  bytes: number;
  uploaded_at: string | null;
  status: string;
  indexed_at: string | null;
  course?: string | null;
  topic?: string | null;
  source_url?: string | null;
  source_title?: string | null;
};

type UploadListResponse = {
  count: number;
  items: UploadItem[];
};

type UploadResponse = {
  original_filename: string;
  stored_filename: string;
  bytes: number;
  status: string;
  chunk_count: number;
};

function formatBytes(n: number) {
  if (!Number.isFinite(n)) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round((n / 1024) * 10) / 10} KB`;
  return `${Math.round((n / (1024 * 1024)) * 10) / 10} MB`;
}

function formatDate(iso: string | null) {
  if (!iso) return "Unknown";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Unknown";
  return d.toLocaleString();
}

export default function UploadsPage() {
  const apiBase = useMemo(() => {
    return process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
  }, []);

  const [apiStatus, setApiStatus] = useState<string>("unknown");
  const [busy, setBusy] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [items, setItems] = useState<UploadItem[]>([]);
  const [selected, setSelected] = useState<string>("");

  const [previewText, setPreviewText] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const [course, setCourse] = useState<CourseId>("orgochem-1");
  const topics = useMemo(() => getCourseTopics(course), [course]);
  const [topicSlug, setTopicSlug] = useState<string>(topics[0]?.slug || "");

  const [sourceTitle, setSourceTitle] = useState<string>("");
  const [sourceUrl, setSourceUrl] = useState<string>("");

  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");

  async function checkHealth() {
    try {
      const res = await fetch(`${apiBase}/health`, { cache: "no-store" });
      const data = await res.json();
      setApiStatus(String(data?.status || "unknown"));
    } catch {
      setApiStatus("down");
    }
  }

  async function loadUploads(nextSelect?: string) {
    setMessage("");
    try {
      const res = await fetch(`${apiBase}/uploads`, { cache: "no-store" });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as UploadListResponse;
      const list = Array.isArray(data?.items) ? data.items : [];
      setItems(list);

      const desired = nextSelect || selected;
      if (desired && list.some((x) => x.stored_filename === desired)) {
        setSelected(desired);
      } else if (list.length) {
        setSelected(list[0].stored_filename);
      } else {
        setSelected("");
      }
    } catch (e: any) {
      setMessage(e?.message || "Failed to load files");
    }
  }

  async function doUpload() {
    if (!file) {
      setMessage("Pick a file first");
      return;
    }

    setBusy(true);
    setMessage("");
    setPreviewText("");

    try {
      const fd = new FormData();
      fd.append("file", file);

      const qs = new URLSearchParams();
      qs.set("course", course);
      qs.set("topic", topicSlug);
      if (sourceUrl.trim()) qs.set("source_url", sourceUrl.trim());
      if (sourceTitle.trim()) qs.set("source_title", sourceTitle.trim());

      const res = await fetch(`${apiBase}/upload?${qs.toString()}`, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) throw new Error(await res.text());

      const data = (await res.json()) as UploadResponse;

      setMessage(`Uploaded ${data.original_filename}`);
      setFile(null);

      await loadUploads(data.stored_filename);
    } catch (e: any) {
      setMessage(e?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function loadPreview(name?: string) {
    const target = name || selected;
    if (!target) return;

    setBusy(true);
    setMessage("");
    setPreviewText("");

    try {
      const res = await fetch(`${apiBase}/uploads/${encodeURIComponent(target)}/text`, {
        cache: "no-store",
      });

      if (!res.ok) {
        setPreviewText("Preview works for txt files only");
        return;
      }

      const data = await res.json();
      const text = String(data?.text || "");
      setPreviewText(text.slice(0, 4000));
      if (text.length > 4000) setPreviewText((t) => `${t}\n\nPreview truncated`);
    } catch (e: any) {
      setMessage(e?.message || "Preview failed");
    } finally {
      setBusy(false);
    }
  }

  async function doRename(newName: string) {
    const target = selected;
    if (!target) return;

    const name = newName.trim();
    if (!name) {
      setMessage("Name required");
      return;
    }

    setBusy(true);
    setMessage("");

    try {
      const res = await fetch(`${apiBase}/uploads/${encodeURIComponent(target)}/rename`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display_name: name }),
      });

      if (!res.ok) throw new Error(await res.text());

      setRenameOpen(false);
      await loadUploads(target);
      setMessage("Updated name");
    } catch (e: any) {
      setMessage(e?.message || "Rename failed");
    } finally {
      setBusy(false);
    }
  }

  async function doDelete() {
    const target = selected;
    if (!target) return;

    const item = items.find((x) => x.stored_filename === target);
    const label = item?.display_name || item?.original_filename || target;

    const ok = window.confirm(`Delete ${label} ?`);
    if (!ok) return;

    setBusy(true);
    setMessage("");

    try {
      const res = await fetch(`${apiBase}/uploads/${encodeURIComponent(target)}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());

      setPreviewText("");
      setRenameOpen(false);
      setRenameValue("");

      await loadUploads();
      setMessage("Deleted");
    } catch (e: any) {
      setMessage(e?.message || "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    checkHealth();
    loadUploads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const next = getCourseTopics(course);
    const first = next[0]?.slug || "";
    setTopicSlug((prev) => {
      if (next.some((t) => t.slug === prev)) return prev;
      return first;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course]);

  useEffect(() => {
    if (selected) loadPreview(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const selectedItem = useMemo(() => items.find((x) => x.stored_filename === selected), [items, selected]);

  return (
    <main className="stack" style={{ padding: 18 }}>
      <div className="card">
        <div className="cardInner" style={{ display: "grid", gap: 12 }}>
          <div className="row">
            <div style={{ flex: 1 }}>
              <div className="subtle">Upload Your Notes</div>
              <div className="h1">Upload Notes to Ask Questions & Generate Practice</div>
              <div style={{ 
                marginTop: 12, 
                padding: 16, 
                background: "rgba(0, 122, 255, 0.06)", 
                borderRadius: 12,
                border: "1px solid rgba(0, 122, 255, 0.2)"
              }}>
                <div style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text)" }}>
                  <strong>How it works:</strong> Upload your class notes, textbook summaries, or study materials as text files. 
                  Once uploaded, you can ask questions about your notes using the <strong>Ask</strong> tool, and the system will 
                  generate personalized practice homework based on your uploaded content. Organize your notes by course and topic 
                  for better results.
                </div>
              </div>
            </div>

            <div className="badge">API {apiStatus}</div>
          </div>

          <div className="divider" />

          <div className="topicTwoCol">
            <div className="card" style={{ boxShadow: "none" }}>
              <div className="cardInner" style={{ padding: 14, display: "grid", gap: 10 }}>
                <div style={{ fontWeight: 950 }}>Organize</div>

                <div style={{ display: "grid", gap: 10, gridTemplateColumns: "160px 1fr", alignItems: "center" }}>
                  <div className="subtle" style={{ fontWeight: 900 }}>
                    Course
                  </div>
                  <select className="input" value={course} onChange={(e) => setCourse(e.target.value as CourseId)} disabled={busy}>
                    <option value="orgochem-1">OrgoChem I</option>
                    <option value="orgochem-2">OrgoChem II</option>
                  </select>

                  <div className="subtle" style={{ fontWeight: 900 }}>
                    Topic
                  </div>
                  <select className="input" value={topicSlug} onChange={(e) => setTopicSlug(e.target.value)} disabled={busy}>
                    {topics.map((t) => (
                      <option key={t.slug} value={t.slug}>
                        {t.title}
                      </option>
                    ))}
                  </select>

                  <div className="subtle" style={{ fontWeight: 900 }}>
                    Source title
                  </div>
                  <input className="input" value={sourceTitle} onChange={(e) => setSourceTitle(e.target.value)} placeholder="Optional" disabled={busy} />

                  <div className="subtle" style={{ fontWeight: 900 }}>
                    Source link
                  </div>
                  <input className="input" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="Optional" disabled={busy} />
                </div>

                <div className="subtle">Old files from before this update do not have the original filename saved so use Rename</div>
              </div>
            </div>

            <div className="card" style={{ boxShadow: "none" }}>
              <div className="cardInner" style={{ padding: 14, display: "grid", gap: 10 }}>
                <div style={{ fontWeight: 950 }}>Upload</div>

                <div className="row" style={{ alignItems: "center" }}>
                  <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} disabled={busy} />
                  <button type="button" className="btn btnPrimary" onClick={doUpload} disabled={busy}>
                    {busy ? "Working" : "Upload"}
                  </button>
                  <button type="button" className="btn" onClick={() => loadUploads()} disabled={busy}>
                    Refresh
                  </button>
                </div>

                <div className="subtle">Txt works now  PDF and images will be used in NMR studio next</div>
              </div>
            </div>
          </div>

          <div className="divider" />

          <div className="stack">
            <div className="row">
              <div style={{ fontWeight: 950 }}>Files</div>
              <div className="subtle">{items.length} total</div>
            </div>

            {items.length === 0 ? (
              <div className="card" style={{ boxShadow: "none" }}>
                <div className="cardInner" style={{ padding: 14 }}>
                  <div style={{ fontWeight: 950 }}>No files yet</div>
                  <div className="subtle">Upload a txt note then go to Ask</div>
                </div>
              </div>
            ) : (
              <div className="stack">
                {items.map((it) => {
                  const isSelected = it.stored_filename === selected;
                  const ready = it.status === "ready";

                  return (
                    <button
                      key={it.stored_filename}
                      type="button"
                      onClick={() => setSelected(it.stored_filename)}
                      className="progressRow"
                      style={{
                        textAlign: "left",
                        cursor: "pointer",
                        outline: "none",
                        borderColor: isSelected ? "color-mix(in srgb, var(--accent) 35%, var(--border))" : "var(--border)",
                      }}
                      disabled={busy}
                    >
                      <div className="progressRowLeft">
                        <div className="progressRowTitle">{it.display_name || it.original_filename || it.stored_filename}</div>
                        <div className="progressRowDesc">
                          {formatBytes(it.bytes)}  Uploaded {formatDate(it.uploaded_at)}  {ready ? "Ready" : "Stored"}
                        </div>
                      </div>

                      <div className="progressRowAction">{ready ? <span className="badge">Ready</span> : <span className="badge">Stored</span>}</div>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="card" style={{ boxShadow: "none" }}>
              <div className="cardInner" style={{ padding: 14, display: "grid", gap: 10 }}>
                <div className="row">
                  <div>
                    <div style={{ fontWeight: 950 }}>Selected</div>
                    <div className="subtle" style={{ color: "var(--text)" }}>
                      {selectedItem ? selectedItem.display_name : "None"}
                    </div>
                    <div className="subtle">{selectedItem ? selectedItem.stored_filename : ""}</div>
                  </div>

                  <div className="row" style={{ justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      className="btn"
                      onClick={() => {
                        setRenameValue(selectedItem?.display_name || "");
                        setRenameOpen(true);
                      }}
                      disabled={busy || !selectedItem}
                    >
                      Rename
                    </button>

                    <button type="button" className="btn" onClick={doDelete} disabled={busy || !selectedItem}>
                      Delete
                    </button>

                    <button type="button" className="btn" onClick={() => loadPreview()} disabled={busy || !selected}>
                      Preview
                    </button>

                    <a className="btn btnPrimary" href="/ask">
                      Ask
                    </a>

                    <a className="btn" href="/search">
                      Search
                    </a>
                  </div>
                </div>

                {renameOpen ? (
                  <div className="card" style={{ boxShadow: "none" }}>
                    <div className="cardInner" style={{ padding: 12, display: "grid", gap: 10 }}>
                      <div style={{ fontWeight: 950 }}>Rename file</div>
                      <input className="input" value={renameValue} onChange={(e) => setRenameValue(e.target.value)} disabled={busy} />
                      <div className="row" style={{ justifyContent: "flex-end" }}>
                        <button type="button" className="btn" onClick={() => setRenameOpen(false)} disabled={busy}>
                          Cancel
                        </button>
                        <button type="button" className="btn btnPrimary" onClick={() => doRename(renameValue)} disabled={busy}>
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="divider" />

                <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr", alignItems: "start" }}>
                  <div>
                    <div style={{ fontWeight: 950, marginBottom: 8 }}>Preview</div>
                    <div className="card" style={{ boxShadow: "none", minHeight: 220 }}>
                      <div className="cardInner" style={{ padding: 12 }}>
                        {previewText ? (
                          <pre style={{ whiteSpace: "pre-wrap", margin: 0, fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>{previewText}</pre>
                        ) : (
                          <div className="subtle">Preview works for txt files only</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontWeight: 950, marginBottom: 8 }}>How it works</div>
                    <div className="card" style={{ boxShadow: "none" }}>
                      <div className="cardInner" style={{ padding: 12, display: "grid", gap: 10 }}>
                        <div className="topicSummaryText">Txt notes are prepared automatically so Ask can answer from them</div>
                        <div className="topicToolRow">
                          <a className="btn btnPrimary" href="/ask">
                            Ask from notes
                          </a>
                          <a className="btn" href="/spectra">
                            NMR studio
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {message ? (
            <div className="card" style={{ boxShadow: "none" }}>
              <div className="cardInner" style={{ padding: 12 }}>
                <div style={{ fontWeight: 950 }}>Status</div>
                <div className="subtle" style={{ marginTop: 4 }}>
                  {message}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
