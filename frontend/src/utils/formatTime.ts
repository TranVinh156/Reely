export default function formatTimeSeconds(sec: number) {
  if (!Number.isFinite(sec)) return "0:00";
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((sec % 3600) / 60);
  const h = Math.floor(sec / 3600);
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s}`;
  return `${m}:${s}`;
}
