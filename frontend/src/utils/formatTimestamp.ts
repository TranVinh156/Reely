export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();

  const Ms = now.getTime() - date.getTime();
  const Sec = Math.floor(Ms / 1000);
  const Min = Math.floor(Sec / 60);
  const Hour = Math.floor(Min / 60);
  const Day = Math.floor(Hour / 24);

  if (Sec < 60) return "Vừa xong";
  if (Min < 60) return `${Min} phút trước`;
  if (Hour < 24) return `${Hour} giờ trước`;
  if (Day < 7) return `${Day} ngày trước`;

  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();

  if (y === now.getFullYear()) {
    return `${d}-${m}`;
  } else {
    return `${d}-${m}-${y}`;
  }
}