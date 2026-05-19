"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { CourseId, Topic } from "../lib/curriculum";

type UploadItem = {
  stored_filename: string;
  bytes: number;
};

type UploadsResponse = {
  count: number;
  items: UploadItem[];
};

type ExamMeta = {
  label: string;
  course: CourseId;
  topicSlug: string;
  kind: "exam" | "quiz" | "worksheet" | "answer-key" | "study-guide" | "other";
  createdAt: string;
};

type MetaMap = Record<string, ExamMeta>;

function metaKey() {
  return "orgopivy-exams-meta-v1";
}

function safeParse(raw: string | null): MetaMap {
  if (!raw) return {};
  try {
    const v = JSON.parse(raw);
    if (v && typeof v === "object") return v as MetaMap;
    return {};
  } catch {
    return {};
  }
}

function toKB(bytes: number) {
  const kb = Math.round((bytes / 1024) * 10) / 10;
  return `${kb} KB`;
}

export default function ExamVaultClient({
  course,
  topics,
}: {
  course: CourseId;
  topics: Topic[];
}) {
  const apiBase = useMemo(() => {
    return process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
  }, []);

  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [meta, setMeta] = useState<MetaMap>(() =>
    typeof window !== "undefined" ? safeParse(localStorage.getItem(metaKey())) : {},
  );
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [filterKind, setFilterKind] = useState<string>("all");
  const [filterTopic, setFilterTopic] = useState<string>("all");

  useEffect(() => {
    localStorage.setItem(metaKey(), JSON.stringify(meta));
  }, [meta]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch(`${apiBase}/uploads`, { method: "GET" });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Uploads failed ${res.status} ${txt}`);
      }
      const data = (await res.json()) as UploadsResponse;
      setUploads(data.items || []);
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : "Failed to load uploads");
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function setField(stored: string, patch: Partial<ExamMeta>) {
    setMeta((m) => {
      const prev = m[stored];
      const base: ExamMeta =
        prev ||
        ({
          label: "",
          course,
          topicSlug: "",
          kind: "exam",
          createdAt: new Date().toISOString(),
        } as ExamMeta);

      const next: ExamMeta = {
        ...base,
        ...patch,
        course,
      };

      return { ...m, [stored]: next };
    });
  }

  function clearMeta(stored: string) {
    setMeta((m) => {
      const next = { ...m };
      delete next[stored];
      return next;
    });
  }

  const itemsForCourse = useMemo(() => {
    const tagged = uploads
      .map((u) => {
        const m = meta[u.stored_filename];
        return { ...u, meta: m || null };
      })
      .filter((x) => x.meta && x.meta.course === course);

    const untagged = uploads
      .map((u) => {
        const m = meta[u.stored_filename];
        return { ...u, meta: m || null };
      })
      .filter((x) => !x.meta);

    let list = [...tagged, ...untagged];

    if (filterKind !== "all") {
      list = list.filter((x) => (x.meta?.kind || "none") === filterKind);
    }

    if (filterTopic !== "all") {
      list = list.filter((x) => (x.meta?.topicSlug || "none") === filterTopic);
    }

    return list;
  }, [uploads, meta, course, filterKind, filterTopic]);

  const kinds: ExamMeta["kind"][] = ["exam", "quiz", "worksheet", "answer-key", "study-guide", "other"];

  return (
    <div className="stack">
      <div className="card" style={{ boxShadow: "none" }}>
        <div className="cardInner" style={{ display: "grid", gap: 10 }}>
          <div className="row">
            <div style={{ display: "grid", gap: 4 }}>
              <div style={{ fontWeight: 950 }}>Exam vault</div>
              <div className="subtle">
                Upload files on Upload and Ingest then tag them here
              </div>
            </div>

            <div className="row">
              <button className="btn" type="button" onClick={refresh} disabled={loading}>
                {loading ? "Loading" : "Refresh"}
              </button>

              <Link className="btn btnPrimary" href="/uploads">
                Upload and Ingest
              </Link>
            </div>
          </div>

          <div className="row" style={{ gap: 10 }}>
            <div style={{ minWidth: 220 }}>
              <div className="subtle" style={{ fontWeight: 950, marginBottom: 6 }}>
                Filter kind
              </div>
              <select
                className="input"
                value={filterKind}
                onChange={(e) => setFilterKind(e.target.value)}
              >
                <option value="all">All</option>
                {kinds.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ minWidth: 260 }}>
              <div className="subtle" style={{ fontWeight: 950, marginBottom: 6 }}>
                Filter topic
              </div>
              <select
                className="input"
                value={filterTopic}
                onChange={(e) => setFilterTopic(e.target.value)}
              >
                <option value="all">All</option>
                {topics.map((t) => (
                  <option key={t.slug} value={t.slug}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {msg ? (
            <div className="card" style={{ boxShadow: "none" }}>
              <div className="cardInner" style={{ padding: 12 }}>
                <div className="subtle" style={{ color: "var(--text)" }}>
                  {msg}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="card">
        <div className="cardInner" style={{ display: "grid", gap: 10 }}>
          <div className="row">
            <div className="subtle" style={{ fontWeight: 950 }}>
              Files
            </div>
            <div className="subtle">{itemsForCourse.length}</div>
          </div>

          <div className="divider" />

          <div style={{ display: "grid", gap: 10 }}>
            {itemsForCourse.map((u) => {
              const m = meta[u.stored_filename];
              const isTaggedForCourse = Boolean(m && m.course === course);

              return (
                <div key={u.stored_filename} className="progressRow">
                  <div style={{ display: "grid", gap: 4 }}>
                    <div style={{ fontWeight: 950 }}>
                      {m?.label ? m.label : "Untitled"}
                    </div>
                    <div className="subtle" style={{ fontSize: 12 }}>
                      {u.stored_filename} · {toKB(u.bytes)}
                    </div>
                    <div className="subtle" style={{ fontSize: 12 }}>
                      {m
                        ? `Kind ${m.kind} · Topic ${m.topicSlug || "none"}`
                        : "Not tagged yet"}
                    </div>
                  </div>

                  <div style={{ display: "grid", gap: 8, width: 380, maxWidth: "100%" }}>
                    <input
                      className="input"
                      placeholder="Label eg Exam 1 Fall 2024"
                      value={m?.label || ""}
                      onChange={(e) => setField(u.stored_filename, { label: e.target.value })}
                    />

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <select
                        className="input"
                        value={m?.kind || "exam"}
                        onChange={(e) =>
                          setField(u.stored_filename, { kind: e.target.value as ExamMeta["kind"] })
                        }
                      >
                        {kinds.map((k) => (
                          <option key={k} value={k}>
                            {k}
                          </option>
                        ))}
                      </select>

                      <select
                        className="input"
                        value={m?.topicSlug || ""}
                        onChange={(e) => setField(u.stored_filename, { topicSlug: e.target.value })}
                      >
                        <option value="">Topic none</option>
                        {topics.map((t) => (
                          <option key={t.slug} value={t.slug}>
                            {t.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="row" style={{ justifyContent: "flex-start" }}>
                      <button
                        className="btn btnPrimary"
                        type="button"
                        onClick={() => {
                          const base = meta[u.stored_filename];
                          if (!base || !base.label.trim()) {
                            setMsg("Add a label before saving");
                            return;
                          }
                          setMsg("Saved");
                          setTimeout(() => setMsg(""), 800);
                        }}
                      >
                        Save
                      </button>

                      {isTaggedForCourse || m ? (
                        <button className="btn" type="button" onClick={() => clearMeta(u.stored_filename)}>
                          Clear
                        </button>
                      ) : null}

                      <Link className="btn" href={`/uploads/${u.stored_filename}/text`}>
                        Open text
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}

            {!itemsForCourse.length ? (
              <div className="subtle">
                No files yet. Go to Upload and Ingest and upload txt exams or study guides
              </div>
            ) : null}
          </div>

          <div className="divider" />

          <div className="subtle">
            After you upload exams, ingest them so Search and Ask can use them during review
          </div>
        </div>
      </div>
    </div>
  );
}
