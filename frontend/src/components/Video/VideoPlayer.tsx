import React, { useRef, useEffect } from "react";
import type { Video } from "../../types/video";
import { useVideoController } from "../../hooks/feed/useVideoController";
import { ProgressBar } from "./ProgressBar";
import { useVideoProgress } from "../../hooks/feed/useVideoProgress";
import VideoControls from "./VideoControls";
import VideoInfo from "./VideoInfo";
import { motion } from "framer-motion";
import { useVideoHotkeys } from "@/hooks/useVideoHotkeys";

export type VideoOrientation = "portrait" | "landscape" | "square";

interface Props {
  video: Video;
  className?: string;
  onOrientationChange?: (orientation: VideoOrientation) => void;
  loadMode?: "active" | "preload" | "idle";
}

export default function VideoPlayer({
  video,
  className,
  onOrientationChange,
  loadMode = "idle",
}: Props) {
  const desiredPreload: HTMLVideoElement["preload"] =
    loadMode === "active" ? "auto" : loadMode === "preload" ? "metadata" : "none";

  // load/unload video based on loadMode
  useEffect(() => {
    const el = ref.current;

    if (!el) return;

    if (loadMode === "idle") {
      try {
        el.pause();
      } catch (e) {}

      // Ensure any in-flight request is cancelled and memory can be reclaimed.
      // React may already remove `src`, but doing it explicitly is safer across browsers.
      if (el.getAttribute("src") || el.currentSrc) {
        el.removeAttribute("src");
        try {
          // Some browsers keep fetching unless src property is cleared.
          el.src = "";
        } catch (e) {}
        try {
          el.load();
        } catch (e) {}
      }

      return;
    }

    // For non-idle modes, the `src` is driven by React. We only nudge the element
    // to (re)load when needed.
    if (video.src && (el.getAttribute("src") ?? "") !== video.src) {
      try {
        el.load();
      } catch (e) {}
    }
  }, [loadMode, video.src]);

  const ref = useRef<HTMLVideoElement>(null);
  // const { isPlaying, togglePlay } = useVideoController(ref, video.id);
  const { togglePlay, isPlaying, muted, toggleMute, volume, setVol } =
    useVideoController(ref, video.id);

  useVideoHotkeys();

  // useEffect(() => {
  //   if (!ref.current) return;
  //   ref.current.dataset.seeking = isSeeking ? "1" : "0";
  // }, [isSeeking]);

  const handleLoadedMetadata = () => {
    if (ref.current && onOrientationChange) {
      const { videoWidth, videoHeight } = ref.current;
      let orientation: VideoOrientation = "square";
      if (videoWidth > videoHeight) {
        orientation = "landscape";
      } else if (videoHeight > videoWidth) {
        orientation = "portrait";
      }
      // Gọi callback để gửi thông tin hướng lên component cha
      onOrientationChange(orientation);
    }
  };

  const { progress, duration, isSeeking, currentTime, setIsSeeking, seekTo } =
    useVideoProgress(ref);

  const tapTimerRef = useRef<number | null>(null);
  const lastTapAtRef = useRef<number>(0);

  const isInteractiveTarget = (t: HTMLElement | null) =>
    Boolean(
      t?.closest(
        [
          '[data-video-controls="1"]',
          "button",
          "a",
          "input",
          "textarea",
          "select",
          "label",
          "summary",
          '[role="button"]',
          '[role="link"]',
        ].join(",")
      )
    );

  const fireLikeEvent = () => {
    window.dispatchEvent(
      new CustomEvent("reely:like", {
        detail: { videoId: String(video.id) },
      })
    );
  };

  const scheduleTogglePlay = () => {
    if (tapTimerRef.current != null) {
      window.clearTimeout(tapTimerRef.current);
      tapTimerRef.current = null;
    }
    // Small delay so double-tap won't toggle play/pause
    tapTimerRef.current = window.setTimeout(() => {
      tapTimerRef.current = null;
      togglePlay();
    }, 220);
  };

  const handleSurfacePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const t = e.target as HTMLElement | null;
    if (isInteractiveTarget(t)) return;

    const now = Date.now();
    const dt = now - lastTapAtRef.current;
    lastTapAtRef.current = now;

    // double tap/click
    if (dt > 0 && dt < 260) {
      if (tapTimerRef.current != null) {
        window.clearTimeout(tapTimerRef.current);
        tapTimerRef.current = null;
      }
      e.preventDefault();
      e.stopPropagation();
      fireLikeEvent();
      return;
    }

    scheduleTogglePlay();
  };

  useEffect(() => {
    return () => {
      if (tapTimerRef.current != null) {
        window.clearTimeout(tapTimerRef.current);
        tapTimerRef.current = null;
      }
    };
  }, []);

  return (
    <motion.div
      className={`relative h-full w-full overflow-hidden transition-opacity duration-300 ${
        isPlaying ? "opacity-100" : "opacity-50"
      } ${className ?? ""}`}
      onPointerUp={handleSurfacePointerUp}
    >
      <video
        ref={ref}
        onLoadedMetadata={handleLoadedMetadata}
        data-id={video.id}
        data-video-el
        data-video-id={video.id}
        src={loadMode === "idle" ? undefined : video.src}
        preload={desiredPreload}
        poster={video.poster}
        playsInline
        // loop
        // muted
        className="h-full w-full object-contain"
      />
      {/* <VideoInfo username={video.user.username} description={video.description} /> */}

      {/* <button
        aria-label="Toggle play"
        onClick={togglePlay}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div
          className={`bg-red pointer-events-none h-18 w-18 text-4xl opacity-100 ${isPlaying ? "" : "icon-[solar--play-bold]"}`}
        ></div>
      </button> */}

      <VideoControls
        username={video.user.username}
        description={video.description}
        currentTime={currentTime}
        duration={duration}
        progress={progress}
        muted={muted}
        volume={volume}
        toggleMute={toggleMute}
        setVol={setVol}
        onSeek={seekTo}
        onSeekStart={() => setIsSeeking(true)}
        onSeekEnd={() => setIsSeeking(false)}
      />

      {/* simple overlay: click to toggle */}

      {/* simple overlay: click to toggle */}
      {/* <button
        aria-label="Toggle play"
        onClick={togglePlay}
        className="absolute inset-0 flex items-center justify-center"
      > */}
      {/* Visual feedback minimal: show a faint play/pause icon when toggled via CSS or later framer-motion */}
      {/* <div
          className={`w-18 h-18 bg-red pointer-events-none text-4xl opacity-100 ${isPlaying ? "" : "icon-[solar--play-bold]"}`}
        ></div>
      </button> */}
      {/* <div className="absolute right-0 bottom-0 left-0 px-3 pb-3">
        <ProgressBar
          progress={progress}
          duration={duration}
          currentTime={currentTime}
          onSeek={seekTo}
          onSeekStart={() => setIsSeeking(true)}
          onSeekEnd={() => setIsSeeking(false)}
        />
      </div> */}
    </motion.div>
  );
}
