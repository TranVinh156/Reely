import { API_ORIGIN } from "@/utils/axios.client";

/**
 * Resolve backend media URL.
 *
 * - Backend returns relative paths like `/videos/<file>.mp4` or `/avatars/<file>.jpg`.
 *
 * Configure:
 *   VITE_MEDIA_ORIGIN=http://localhost:9000   (MinIO default)
 *
 * If not provided, we fallback to API_ORIGIN.
 */
const MEDIA_ORIGIN: string = (import.meta as any).env?.VITE_MEDIA_ORIGIN || "http://localhost:9000";

export function resolveMediaUrl(url?: string | null): string {
  if (!url) return "";
  const u = String(url).trim();
  if (!u) return "";
  if (u.startsWith("http://") || u.startsWith("https://")) return u;

  // If it starts with '/', treat as absolute path on the media origin
  if (u.startsWith("/")) return `${MEDIA_ORIGIN}${u}`;

  // Otherwise treat as a path
  return `${MEDIA_ORIGIN}/${u}`;
}
