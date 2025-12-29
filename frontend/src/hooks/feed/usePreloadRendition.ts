export function preloadUrl(url?: string) {
  if (!url) return;
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "video";
  link.href = url;
  document.head.appendChild(link);
  // remove after a while
  setTimeout(() => link.remove(), 30_000);
}
