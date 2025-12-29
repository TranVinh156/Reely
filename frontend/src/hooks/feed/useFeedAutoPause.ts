import { useEffect, useRef } from "react";
import { useFeedStore } from "@/store/feedStore";
import { registerView } from "@/api/feed";

const ACTIVE_RATIO = 2 / 3; // 0.666...
const VIEW_SECONDS = 5;
const TICK_MS = 250;

export function useFeedAutoPause() {
  const autoPlay = useFeedStore((s) => s.autoPlay);
  const autoScroll = useFeedStore((s) => s.autoScroll);
  const setCurrentIndex = useFeedStore((s) => s.setCurrentIndex);

  const activeRef = useRef<HTMLVideoElement | null>(null);
  const endedBoundRef = useRef<WeakSet<HTMLVideoElement>>(new WeakSet());


  // ---- View tracking (continuous watch only) ----
  const viewIntervalRef = useRef<number | null>(null);
  const viewVideoIdRef = useRef<string | null>(null);
  const viewElapsedRef = useRef(0);
  const viewLastTimeRef = useRef<number | null>(null);

  const resetViewTracker = () => {
    viewElapsedRef.current = 0;
    viewLastTimeRef.current = null;
  };

  const stopViewInterval = () => {
    if (viewIntervalRef.current != null) {
      window.clearInterval(viewIntervalRef.current);
      viewIntervalRef.current = null;
    }
  };

  const startViewInterval = () => {
    if (viewIntervalRef.current != null) return;
    viewIntervalRef.current = window.setInterval(async () => {
      const v = activeRef.current;
      if (!v) {
        resetViewTracker();
        return;
      }

      const videoId = v.getAttribute("data-video-id") ?? v.getAttribute("data-id") ?? null;
      if (!videoId) {
        resetViewTracker();
        return;
      }

      // if active video changed, reset continuous timer
      if (viewVideoIdRef.current !== videoId) {
        viewVideoIdRef.current = videoId;
        resetViewTracker();
      }

      // only count when truly active + playing
      if (v.dataset.active !== "1" || v.paused || v.ended) {
        resetViewTracker();
        return;
      }

      const t = v.currentTime;
      const last = viewLastTimeRef.current;
      viewLastTimeRef.current = t;

      if (last == null) return;

      const dt = t - last;
      // Seek / jump / background tab => break continuity
      if (dt <= 0 || dt > 1.0) {
        viewElapsedRef.current = 0;
        return;
      }

      viewElapsedRef.current += dt;

      if (viewElapsedRef.current >= VIEW_SECONDS) {
        // One continuous view achieved => +1 view
        viewElapsedRef.current -= VIEW_SECONDS;
        try {
          const res = await registerView(videoId);
          window.dispatchEvent(
            new CustomEvent("reely:view", {
              detail: { videoId: String(videoId), viewCount: res.viewCount },
            })
          );
        } catch {
          // ignore network errors
        }
      }
    }, TICK_MS);
  };

  useEffect(() => {
    const scroller = document.querySelector("[data-feed-scroller]") as HTMLElement | null;

    const getVideos = () =>
      Array.from(
        document.querySelectorAll<HTMLVideoElement>(
          'video[data-video-el][data-video-id], video[data-id]'
        )
      );

    const getKey = (v: HTMLVideoElement) =>
      v.getAttribute("data-video-id") ?? v.getAttribute("data-id") ?? "";

    const pauseAll = () => {
      for (const v of getVideos()) {
        try {
          v.pause();
        } catch {}
        v.dataset.active = "0";
      }
      activeRef.current = null;
      viewVideoIdRef.current = null;
      resetViewTracker();
    };

    const pauseOthers = (active: HTMLVideoElement) => {
      for (const v of getVideos()) {
        if (v === active) continue;
        try {
          v.pause();
        } catch {}
        v.dataset.active = "0";
      }
    };

    const tryPlay = async (v: HTMLVideoElement) => {
      if (!autoPlay) return;
      try {
        if (v.paused) await v.play();
      } catch {
        // autoplay blocked -> ignore
      }
    };

    const smoothScrollToNext = (active: HTMLVideoElement) => {
      const item = active.closest("[data-feed-item]") as HTMLElement | null;
      const next = item?.nextElementSibling as HTMLElement | null;
      if (!next) return;

      if (scroller) {
        const prevSnap = scroller.style.scrollSnapType;
        scroller.style.scrollSnapType = "none";
        next.scrollIntoView({ behavior: "smooth", block: "center" });
        window.setTimeout(() => (scroller.style.scrollSnapType = prevSnap), 450);
      } else {
        next.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };

    const bindEndedOnce = (v: HTMLVideoElement) => {
      if (endedBoundRef.current.has(v)) return;
      endedBoundRef.current.add(v);

      v.addEventListener("ended", () => {
        if (!autoScroll) return;
        // chỉ autoScroll khi nó đang active
        if (activeRef.current !== v) return;

        smoothScrollToNext(v);

        const item = v.closest("[data-feed-item]") as HTMLElement | null;
        const idx = Number(item?.getAttribute("data-feed-index") ?? "0");
        setCurrentIndex(Number.isFinite(idx) ? idx + 1 : 0);
      });
    };

    const handleActive = async (active: HTMLVideoElement | null) => {
      if (!active) {
        pauseAll();
        return;
      }

      // active đổi
      if (activeRef.current !== active) {
        if (activeRef.current) {
          try {
            activeRef.current.pause();
          } catch {}
          activeRef.current.dataset.active = "0";
        }
        activeRef.current = active;
        resetViewTracker();

        // Sync comment drawer if open
        const videoId = getKey(active);
        const { activeCommentVideoId, openComment } = useFeedStore.getState();
        if (activeCommentVideoId && activeCommentVideoId !== videoId) {
           openComment(videoId);
        }
      }

      bindEndedOnce(active);

      // set currentIndex từ wrapper (nếu có)
      const item = active.closest("[data-feed-item]") as HTMLElement | null;
      const idx = Number(item?.getAttribute("data-feed-index") ?? "0");
      if (Number.isFinite(idx)) setCurrentIndex(idx);

      // pause others + play active
      pauseOthers(active);
      active.dataset.active = "1";
      await tryPlay(active);

      startViewInterval();
    };

    const io = new IntersectionObserver(
      async (entries) => {
        // chọn video có ratio >= 2/3 và ratio cao nhất
        let best: { v: HTMLVideoElement; ratio: number } | null = null;

        for (const e of entries) {
          const v = e.target as HTMLVideoElement;
          bindEndedOnce(v);

          if (!e.isIntersecting) continue;
          const ratio = e.intersectionRatio;

          if (ratio >= ACTIVE_RATIO) {
            if (!best || ratio > best.ratio) best = { v, ratio };
          }
        }

        // Không có video nào đủ 2/3 => pause tất cả (đúng yêu cầu)
        if (!best) {
          pauseAll();
          return;
        }

        await handleActive(best.v);
      },
      {
        root: scroller ?? null,
        // đặt threshold chứa 0.66 để callback cập nhật đúng lúc “vượt ngưỡng”
        threshold: [0, 0.33, 0.5, 0.66, 0.8, 1],
      }
    );

    const observeAll = () => {
      const vids = getVideos();
      for (const v of vids) io.observe(v);
    };
    observeAll();

    // support infinite append
    const mo = new MutationObserver(() => observeAll());
    mo.observe(scroller ?? document.body, { childList: true, subtree: true });

    startViewInterval();

    return () => {
      io.disconnect();
      mo.disconnect();
      stopViewInterval();
    };
  }, [autoPlay, autoScroll, setCurrentIndex]);
}
