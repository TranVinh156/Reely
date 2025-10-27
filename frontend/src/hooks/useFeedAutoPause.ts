import { useFeedStore } from "@/store/feedStore";
import { useEffect } from "react";
import { animate } from "framer-motion";

/**
 * This hook finds the video element closest to the center of viewport and plays it.
 * Others are paused. It's placed in shared hooks so it can be reused by other pages.
 */
export function useFeedAutoPause() {
  const autoScroll = useFeedStore((s) => s.autoScroll);
  const setCurrentIndex = useFeedStore((s) => s.setCurrentIndex);

  useEffect(() => {
    let raf = 0;
    let scrollRaf = 0;
    const scroller = document.querySelector(
      "[data-feed-scroller]"
    ) as HTMLElement | null;

    // Smoothly scroll the scroller (or window) so that `el` lands at the visual center.
    const smoothScrollToCenter = (
      el: HTMLElement,
      container: HTMLElement | null,
      opts: { duration?: number; easing?: (t: number) => number } = {},
    ) => {
      const duration = opts.duration ?? 650; // ms
      const easing =
        opts.easing ??
        ((t: number) =>
          // easeInOutCubic
          t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

      const startTime = performance.now();

      if (container) {
        const start = container.scrollTop;
        const contRect = container.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        const centerOffset =
          (elRect.top - contRect.top) + elRect.height / 2 - container.clientHeight / 2;
        const target = start + centerOffset;

        // Temporarily disable scroll-snap to avoid fighting the animation
        const prevSnap = container.style.scrollSnapType;
        container.style.scrollSnapType = "none";

        const step = (now: number) => {
          const t = Math.min(1, (now - startTime) / duration);
          const p = easing(t);
          const value = start + (target - start) * p;
          container.scrollTop = value;
          if (t < 1) {
            scrollRaf = requestAnimationFrame(step);
          } else {
            // restore snapping
            container.style.scrollSnapType = prevSnap;
          }
        };
        if (scrollRaf) cancelAnimationFrame(scrollRaf);
        scrollRaf = requestAnimationFrame(step);
      } else {
        const start = window.scrollY || document.documentElement.scrollTop || 0;
        const elRect = el.getBoundingClientRect();
        const centerOffset = elRect.top + elRect.height / 2 - window.innerHeight / 2;
        const target = start + centerOffset;

        const step = (now: number) => {
          const t = Math.min(1, (now - startTime) / duration);
          const p = easing(t);
          const value = start + (target - start) * p;
          window.scrollTo({ top: value, behavior: "auto" });
          if (t < 1) {
            scrollRaf = requestAnimationFrame(step);
          }
        };
        if (scrollRaf) cancelAnimationFrame(scrollRaf);
        scrollRaf = requestAnimationFrame(step);
      }
    };

    const handle = () => {
      // throttle via rAF
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const videos = Array.from(
          document.querySelectorAll("video[data-id]"),
        ) as HTMLVideoElement[];
        if (videos.length === 0) return;

        videos.forEach((v, index) => {
          v.onended = async () => {
            if (autoScroll) {
              const next = videos[index + 1];

              // v.style.willChange = "transform, opacity";
              // if (next) next.style.willChange = "transform, opacity";

              // const out = animate(
              //   v,
              //   { y: [0, -80], scale: [1, 0.98], opacity: [1, 0.85] },
              //   { duration: 0.45, ease: "circOut" },
              // );

              if (next) {
                // const inAnim = animate(
                //   next,
                //   { y: [80, 0], scale: [0.985, 1], opacity: [0.95, 1] },
                //   { duration: 0.45, ease: "circOut", delay: 0.05 },
                // );
                // Custom smooth scroll with controlled duration/easing
                smoothScrollToCenter(next, scroller, { duration: 800 });
                setCurrentIndex(index + 1);

                try {
                  // await Promise.all([out.finished, inAnim.finished]);
                } catch {} finally {
                  // v.style.willChange = "";
                  // next.style.willChange = "";
                }
              } else {
                setCurrentIndex(index);
                // try {
                //   await out.finished;
                // } catch {} finally {
                //   v.style.willChange = "";
                // }
              }
            }
          };
        });

        let active: HTMLVideoElement | null = null;
        let minDist = Infinity;
        // Center of the visible area: use feed scroller if present, fallback to window
        const viewportCenter = scroller
          ? scroller.getBoundingClientRect().top + scroller.clientHeight / 2
          : window.innerHeight / 2;

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
    // Listen to scroll on the feed scroller if available; otherwise on window
    if (scroller) scroller.addEventListener("scroll", handle, { passive: true });
    else window.addEventListener("scroll", handle, { passive: true });
    window.addEventListener("resize", handle);
    return () => {
      if (scroller) scroller.removeEventListener("scroll", handle);
      else window.removeEventListener("scroll", handle);
      window.removeEventListener("resize", handle);
      if (raf) cancelAnimationFrame(raf);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
    };
  }, [autoScroll, setCurrentIndex]);
}
