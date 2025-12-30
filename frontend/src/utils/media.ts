import { STORAGE_URL } from "./constant";

/**
 * Resolve backend media URL.
 *
 * - Backend returns relative paths like `/videos/<file>.mp4` or `/avatars/<file>.jpg`.
 *
 * Configure:
 *
 * If not provided, we fallback to API_ORIGIN.
 */
const MEDIA_ORIGIN: string = STORAGE_URL;

export function resolveMediaUrl(url?: string | null): string {
  if (!url) return "";
  const u = String(url).trim();
  if (!u) return "";

  if (u.startsWith("http://") || u.startsWith("https://")) {
    // Extract just the path from the full URL and prepend MEDIA_ORIGIN
    try {
      const urlObj = new URL(u);
      const path = urlObj.pathname;
      // Fix duplicate path segments (e.g., /videos//videos/ -> /videos/)
      const cleanPath = path.replace(/\/videos\/+videos\//g, '/videos/')
        .replace(/\/avatars\/+avatars\//g, '/avatars/');
      return `${MEDIA_ORIGIN}${cleanPath}`;
    } catch {
      return u;
    }
  }

  // If it starts with '/', treat as absolute path on the media origin
  if (u.startsWith("/")) return `${MEDIA_ORIGIN}${u}`;

  // Otherwise treat as a path
  return `${MEDIA_ORIGIN}/${u}`;
}
