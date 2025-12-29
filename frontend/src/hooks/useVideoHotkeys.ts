import { useEffect } from "react";

const CAPTURE = true;

let subscriberCount = 0;

function isEditableElement(el: Element | null): boolean {
  if (!el) return false;
  const tag = (el as HTMLElement).tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  const h = el as HTMLElement;
  return Boolean(h.isContentEditable);
}

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

const keydownHandler = (e: KeyboardEvent) => {
  // Don't steal keys while typing
  const activeEl = document.activeElement;
  if (isEditableElement(activeEl)) return;

  const video = getActiveVideo();
  if (!video) return;

  // Avoid fast repeat toggles while holding a key
  if (e.repeat) return;

  const code = e.code;
  const key = e.key;
  const isSpace = code === "Space" || key === " " || key === "Spacebar";

  if (isSpace) {
    e.preventDefault();
    e.stopPropagation();
    if (video.paused) video.play().catch(() => {});
    else video.pause();
    return;
  }

  if (code === "KeyM" || key.toLowerCase() === "m") {
    e.preventDefault();
    video.muted = !video.muted;
    return;
  }

  if (code === "ArrowUp") {
    e.preventDefault();
    video.volume = Math.min(1, video.volume + 0.05);
    return;
  }
  if (code === "ArrowDown") {
    e.preventDefault();
    video.volume = Math.max(0, video.volume - 0.05);
    return;
  }
  if (code === "ArrowRight") {
    e.preventDefault();
    video.currentTime = Math.min(video.duration || Infinity, video.currentTime + 5);
    return;
  }
  if (code === "ArrowLeft") {
    e.preventDefault();
    video.currentTime = Math.max(0, video.currentTime - 5);
  }
};

export function useVideoHotkeys() {
  useEffect(() => {
    subscriberCount += 1;
    if (subscriberCount === 1) {
      // capture=true để tránh bị component khác chặn
      window.addEventListener("keydown", keydownHandler, CAPTURE);
    }

    return () => {
      subscriberCount = Math.max(0, subscriberCount - 1);
      if (subscriberCount === 0) {
        window.removeEventListener("keydown", keydownHandler, CAPTURE);
      }
    };
  }, []);
}
