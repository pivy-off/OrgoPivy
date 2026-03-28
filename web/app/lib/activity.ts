export type ActivityKind = "search" | "ask" | "upload" | "practice" | "topic" | "quiz" | "workspace";

export type ActivityItem = {
  id: string;
  kind: ActivityKind;
  label: string;
  detail?: string;
  href?: string;
  at: string;
};

const KEY = "orgopivy-activity-v1";
const MAX = 12;

export function logActivity(entry: Omit<ActivityItem, "id" | "at"> & { id?: string }) {
  if (typeof window === "undefined") return;
  const prev = getRecentActivity();
  const item: ActivityItem = {
    id: entry.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    kind: entry.kind,
    label: entry.label,
    detail: entry.detail,
    href: entry.href,
    at: new Date().toISOString(),
  };
  const next = [item, ...prev.filter((x) => x.id !== item.id)].slice(0, MAX);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

export function getRecentActivity(): ActivityItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const v = JSON.parse(raw);
    if (!Array.isArray(v)) return [];
    return v as ActivityItem[];
  } catch {
    return [];
  }
}

export type WeakTopic = { slug: string; title: string; wrong: number };

const WEAK_KEY = "orgopivy-quiz-weak-v1";

export function recordQuizMiss(slug: string, title: string) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(WEAK_KEY);
    const map: Record<string, { title: string; wrong: number }> = raw ? JSON.parse(raw) : {};
    const cur = map[slug] || { title, wrong: 0 };
    map[slug] = { title: title || cur.title, wrong: cur.wrong + 1 };
    localStorage.setItem(WEAK_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}

export function getWeakTopics(limit = 5): WeakTopic[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WEAK_KEY);
    if (!raw) return [];
    const map = JSON.parse(raw) as Record<string, { title: string; wrong: number }>;
    return Object.entries(map)
      .map(([slug, v]) => ({ slug, title: v.title, wrong: v.wrong }))
      .sort((a, b) => b.wrong - a.wrong)
      .slice(0, limit);
  } catch {
    return [];
  }
}
