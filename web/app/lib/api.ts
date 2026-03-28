/**
 * Single source of truth for the OrgoPivy FastAPI base URL.
 * Prefer NEXT_PUBLIC_ORGOPIVY_API_BASE; NEXT_PUBLIC_API_BASE_URL is supported for backwards compatibility.
 */
export function getApiBase(): string {
  if (typeof window !== "undefined") {
    const fromWindow = (window as unknown as { __ORGOPIVY_API_BASE__?: string }).__ORGOPIVY_API_BASE__;
    if (fromWindow) return fromWindow.replace(/\/$/, "");
  }
  const primary = process.env.NEXT_PUBLIC_ORGOPIVY_API_BASE?.trim();
  const legacy = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  const raw = primary || legacy || "http://127.0.0.1:8000";
  return raw.replace(/\/$/, "");
}

export function apiUrl(path: string): string {
  const base = getApiBase();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
