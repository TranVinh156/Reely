import React, { useRef, useEffect, use } from "react";
import type { Video } from "../../types/video";
import { useVideoController } from "../../hooks/feed/useVideoController";
import { ProgressBar } from "./ProgressBar";
import { useVideoProgress } from "../../hooks/feed/useVideoProgress";
import VideoControls from "./VideoControls";
import VideoInfo from "./VideoInfo";
import { motion } from "framer-motion";

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
  // const { isPlaying, togglePlay } = useVideoController(ref, video.id);
  const { togglePlay, isPlaying, muted, toggleMute, volume, setVol } =
    useVideoController(ref, video.id);

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

  const { progress, duration, isSeeking, currentTime, setIsSeeking, seekTo } =
    useVideoProgress(ref);

  return (
    <motion.div
      className={`relative h-full w-full overflow-hidden transition-opacity duration-300 ${
        isPlaying ? "opacity-100" : "opacity-50"
      } ${className ?? ""}`}
    >
      <video
        ref={ref}
        onLoadedMetadata={handleLoadedMetadata}
        data-id={video.id}
        src={video.src}
        poster={video.poster}
        playsInline
        // loop
        // muted
        className="h-full w-full object-contain"
      />
      {/* <VideoInfo username={video.user.username} description={video.description} /> */}
      <VideoControls
        username={video.user.username}
        description={video.description}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        progress={progress}
        muted={muted}
        volume={volume}
        togglePlay={togglePlay}
        toggleMute={toggleMute}
        setVol={setVol}
        onSeek={seekTo}
        onSeekStart={() => setIsSeeking(true)}
        onSeekEnd={() => setIsSeeking(false)}
      />

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
