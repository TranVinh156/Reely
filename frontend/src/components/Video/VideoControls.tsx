import { useFeedStore } from "@/store/feedStore";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { OptionsMenu } from "./OptionsMenu";
import { ActionButtons } from "./ActionButtons";
import { ProgressBar } from "./ProgressBar";
import VolumeControl from "./VolumeControl";
import VideoInfo from "./VideoInfo";

interface VideoControlsProps {
  username: string;
  description: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  muted: boolean;
  volume: number;
  togglePlay: () => void;
  toggleMute: () => void;
  setVol: (volume: number) => void;
  onSeek: (time: number) => void;
  onSeekStart: () => void;
  onSeekEnd: () => void;
}

export default function VideoControls({
  username,
  description,
  isPlaying,
  currentTime,
  duration,
  progress,
  muted,
  volume,
  togglePlay,
  toggleMute,
  setVol,
  onSeek,
  onSeekStart,
  onSeekEnd,
}: VideoControlsProps) {
  const { liked } = useFeedStore();

  return (
    // <div className="pointer-events-auto absolute right-0 bottom-0 left-0 p-2">
    //   {/* Placeholder: we'll implement ProgressBar, Volume, etc. in Phase2 */}
    // </div>
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between select-none">
      {/* Overlay Play/Pause Animation */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            key="play-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <i className="ri-play-circle-fill text-6xl text-white/80" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Controls */}
      <div className="pointer-events-auto absolute right-0 bottom-0 left-0 px-3 pb-3">
        <div className="flex flex-col gap-2">
          <VideoInfo username={username} description={description} />
          <ProgressBar
            progress={progress}
            duration={duration}
            currentTime={currentTime}
            onSeek={onSeek}
            onSeekStart={onSeekStart}
            onSeekEnd={onSeekEnd}
          />
        </div>

        <div className="mt-2 flex items-center justify-between">
          <VolumeControl
            volume={volume}
            muted={muted}
            setVol={setVol}
            toggleMute={toggleMute}
          />
          {/* <div className="flex items-center gap-3">
            <ActionButtons />
            <OptionsMenu />
          </div> */}
        </div>
      </div>
    </div>
  );
}
