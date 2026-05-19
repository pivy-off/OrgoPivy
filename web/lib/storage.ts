/** Typed localStorage helpers (SSR-safe). Keys prefixed `op_`. */

export type FlashcardMastery = { easy: string[]; hard: string[]; ok: string[] };
export type ExamScores = { best: number; attempts: number; lastDate: string };
export type NotebookSessionMeta = { lastOpened: string; questionsUsed: number };
export type ConceptMapLayout = { nodes: Array<{ id: string; x: number; y: number }> };

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota */
  }
}

export function getOrCreateSessionToken(): string {
  if (!canUseStorage()) return `srv-${Math.random().toString(36).slice(2)}`;
  try {
    let t = window.localStorage.getItem("op_session_token");
    if (!t) {
      t =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `op-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      window.localStorage.setItem("op_session_token", t);
    }
    return t;
  } catch {
    return `fallback-${Date.now()}`;
  }
}

export function getGlobalAiRequestsUsed(): number {
  if (!canUseStorage()) return 0;
  try {
    return parseInt(window.localStorage.getItem("op_ai_requests_used") || "0", 10) || 0;
  } catch {
    return 0;
  }
}

export function incrementGlobalAiRequests(): void {
  if (!canUseStorage()) return;
  try {
    const n = getGlobalAiRequestsUsed() + 1;
    window.localStorage.setItem("op_ai_requests_used", String(n));
  } catch {
    /* ignore */
  }
}

export function touchStreakActivity(): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem("op_streak_last_activity", new Date().toISOString());
  } catch {
    /* ignore */
  }
}

export function flashcardMasteryKey(slug: string): string {
  return `op_flashcard_mastery_${slug}`;
}

export function getFlashcardMastery(slug: string): FlashcardMastery {
  return readJson(flashcardMasteryKey(slug), { easy: [], hard: [], ok: [] });
}

export function setFlashcardMastery(slug: string, v: FlashcardMastery): void {
  writeJson(flashcardMasteryKey(slug), v);
}

export function examScoresKey(slug: string): string {
  return `op_exam_scores_${slug}`;
}

export function getExamScores(slug: string): ExamScores {
  return readJson(examScoresKey(slug), { best: 0, attempts: 0, lastDate: "" });
}

export function setExamScores(slug: string, v: ExamScores): void {
  writeJson(examScoresKey(slug), v);
}

export function mechanismsViewedKey(slug: string): string {
  return `op_mechanisms_viewed_${slug}`;
}

export function getMechanismsViewed(slug: string): string[] {
  return readJson(mechanismsViewedKey(slug), []);
}

export function addMechanismViewed(slug: string, mechanismId: string): void {
  const cur = getMechanismsViewed(slug);
  if (!cur.includes(mechanismId)) {
    writeJson(mechanismsViewedKey(slug), [...cur, mechanismId]);
  }
}

export function notebookSessionsKey(slug: string): string {
  return `op_notebook_sessions_${slug}`;
}

export function getNotebookSession(slug: string): NotebookSessionMeta {
  return readJson(notebookSessionsKey(slug), { lastOpened: "", questionsUsed: 0 });
}

export function setNotebookSession(slug: string, v: NotebookSessionMeta): void {
  writeJson(notebookSessionsKey(slug), v);
}

export function conceptMapLayoutKey(slug: string): string {
  return `op_concept_map_arranged_${slug}`;
}

export function getConceptMapLayout(slug: string): ConceptMapLayout | null {
  const v = readJson<ConceptMapLayout | null>(conceptMapLayoutKey(slug), null);
  return v && Array.isArray(v.nodes) ? v : null;
}

export function setConceptMapLayout(slug: string, v: ConceptMapLayout): void {
  writeJson(conceptMapLayoutKey(slug), v);
}

export function getNotebookStarters(slug: string): string[] {
  return readJson<string[]>(`op_notebook_starters_${slug}`, []);
}

export function pushNotebookStarter(slug: string, text: string, max = 3): void {
  const t = text.trim();
  if (!t) return;
  const cur = getNotebookStarters(slug).filter((x) => x !== t);
  cur.unshift(t);
  writeJson(`op_notebook_starters_${slug}`, cur.slice(0, max));
}
