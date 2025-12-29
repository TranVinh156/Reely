import { useEffect } from "react";

function getActiveVideo(): HTMLVideoElement | null {
  // ưu tiên video được đánh dấu active
  const v = document.querySelector<HTMLVideoElement>('video[data-active="1"]');
  if (v) return v;

  // fallback: video đang play
  const playing = Array.from(document.querySelectorAll<HTMLVideoElement>("video")).find(
    (x) => !x.paused && !x.ended
  );
  return playing ?? null;
}

export function useVideoHotkeys() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const activeEl = document.activeElement as HTMLElement | null;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.isContentEditable)
      ) {
        return;
      }

      const video = getActiveVideo();
      if (!video) return;

      // dùng e.code cho ổn định (Space không phụ thuộc layout)
      const code = e.code;

      if (code === "Space") {
        e.preventDefault();
        if (video.paused) video.play().catch(() => {});
        else video.pause();
      } else if (code === "KeyM") {
        e.preventDefault();
        video.muted = !video.muted;
      } else if (code === "ArrowUp") {
        e.preventDefault();
        video.volume = Math.min(1, video.volume + 0.05);
      } else if (code === "ArrowDown") {
        e.preventDefault();
        video.volume = Math.max(0, video.volume - 0.05);
      } else if (code === "ArrowRight") {
        e.preventDefault();
        video.currentTime = Math.min(video.duration || Infinity, video.currentTime + 5);
      } else if (code === "ArrowLeft") {
        e.preventDefault();
        video.currentTime = Math.max(0, video.currentTime - 5);
      }
    };

    // capture=true để tránh bị component khác chặn
    window.addEventListener("keydown", handler, { capture: true });
    return () => window.removeEventListener("keydown", handler, { capture: true } as any);
  }, []);
}
