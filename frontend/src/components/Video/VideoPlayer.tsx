import React, { useRef, useEffect } from "react";
import type { Video } from "../../types/video";
import { useVideoController } from "../../hooks/useVideoController";

export type VideoOrientation = "portrait" | "landscape" | "square";

interface Props {
  video: Video;
  className?: string;
  onOrientationChange?: (orientation: VideoOrientation) => void;
}

export default function VideoPlayer({
  video,
  className,
  onOrientationChange,
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const { isPlaying, togglePlay } = useVideoController(ref, video.id);

  useEffect(() => {
    // ensure metadata preloaded
    if (ref.current) ref.current.preload = "metadata";
  }, []);

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

  return (
    <div
      className={`relative h-full w-full overflow-hidden ${className ?? ""}`}
    >
      <video
        ref={ref}
        onLoadedMetadata={handleLoadedMetadata}
        data-id={video.id}
        src={video.src}
        poster={video.poster}
        playsInline
        loop
        muted
        className="h-full w-full object-contain"
      />
      {/* simple overlay: click to toggle */}
      <button
        aria-label="Toggle play"
        onClick={togglePlay}
        className="absolute inset-0 flex items-center justify-center"
      >
        {/* Visual feedback minimal: show a faint play/pause icon when toggled via CSS or later framer-motion */}
        <div className="pointer-events-none text-4xl text-white opacity-0">
          {isPlaying ? "⏸" : "▶"}
        </div>
      </button>
    </div>
  );
}
