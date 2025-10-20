import { useEffect } from "react";

/**
 * This hook finds the video element closest to the center of viewport and plays it.
 * Others are paused. It's placed in shared hooks so it can be reused by other pages.
 */
export function useFeedAutoPause() {
  useEffect(() => {
    let raf = 0;
    const handle = () => {
      // throttle via rAF
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const videos = Array.from(document.querySelectorAll("video[data-id]")) as HTMLVideoElement[];
        if (videos.length === 0) return;
        let active: HTMLVideoElement | null = null;
        let minDist = Infinity;
        const viewportCenter = window.innerHeight / 2;

        videos.forEach((v) => {
          const rect = v.getBoundingClientRect();
          const center = rect.top + rect.height / 2;
          const dist = Math.abs(viewportCenter - center);
          if (dist < minDist) {
            minDist = dist;
            active = v;
          }
        });

        videos.forEach((v) => {
          if (v === active) {
            // try play
            if (v.paused) v.play().catch(() => {});
          } else {
            if (!v.paused) v.pause();
          }
        });
      });
    };

    handle();
    window.addEventListener("scroll", handle, { passive: true });
    window.addEventListener("resize", handle);
    return () => {
      window.removeEventListener("scroll", handle);
      window.removeEventListener("resize", handle);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
}
