import React, { useRef, useEffect } from "react";
import type { Video } from "../../types/video";
import { useVideoController } from "../../hooks/useVideoController";

interface Props {
  video: Video;
  className?: string;
}

export default function VideoPlayer({ video, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const { isPlaying, togglePlay } = useVideoController(ref, video.id);

  useEffect(() => {
    // ensure metadata preloaded
    if (ref.current) ref.current.preload = "metadata";
  }, []);

  return (
    <div className={`relative w-full h-full ${className ?? ""}`}>
      <video
        ref={ref}
        data-id={video.id}
        src={video.src}
        poster={video.poster}
        playsInline
        loop
        muted
        className="w-full h-full object-contain"
      />
      {/* simple overlay: click to toggle */}
      <button
        aria-label="Toggle play"
        onClick={togglePlay}
        className="absolute inset-0 flex items-center justify-center"
      >
        {/* Visual feedback minimal: show a faint play/pause icon when toggled via CSS or later framer-motion */}
        <div className="pointer-events-none text-white text-4xl opacity-0">{isPlaying ? "⏸" : "▶"}</div>
      </button>
    </div>
  );
}
