const PRELOAD_TTL_MS = 30_000;
const preloadedUntil = new Map<string, number>();

export function preloadUrl(url?: string) {
  if (!url) return;

  const now = Date.now();
  const until = preloadedUntil.get(url);
  if (until && until > now) return;
  preloadedUntil.set(url, now + PRELOAD_TTL_MS);

  // Avoid duplicating DOM nodes if the same URL is requested repeatedly.
  const existing = document.querySelector(
    `link[rel="preload"][as="video"][href="${CSS.escape(url)}"]`
  );
  if (existing) return;

  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "video";
  link.href = url;
  document.head.appendChild(link);

  window.setTimeout(() => {
    link.remove();
    const currentUntil = preloadedUntil.get(url);
    if (currentUntil && currentUntil <= Date.now()) preloadedUntil.delete(url);
  }, PRELOAD_TTL_MS);
}
