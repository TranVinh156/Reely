import React from "react";
import { useState } from "react";
import type { Video } from "../../types/video";
import VideoPlayer, { type VideoOrientation } from "./VideoPlayer";
import { useMediaQuery } from "../../hooks/feed/useMediaQuery";
import { ActionButtons } from "./ActionButtons";
import { useFeedStore } from "@/store/feedStore";

interface Props {
  video: Video;
  loadMode?: "active" | "preload" | "idle";
  isFeed?: boolean;
}

export default function VideoCard({ video, loadMode = "idle", isFeed = true }: Props) {
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const activeCommentVideoId = useFeedStore((s) => s.activeCommentVideoId);
  const isCommentOpen = !!activeCommentVideoId;

  const [orientation, setOrientation] = useState<VideoOrientation>("landscape");

  const handleOrientationChange = (newOrientation: VideoOrientation) => {
    setOrientation(newOrientation);
  };

  const containerClasses = isFeed ? {
    landscape: "max-w-[90vh] h-[60%]",
    portrait: "w-auto h-[80%] max-w-[50vh]", // Ví dụ: cao 90% viewport, rộng tối đa 50vh
    square: "w-[70%] h-[60%]", // Giống landscape
  } : {
    landscape: "w-full h-full",
    portrait: "w-full h-full",
    square: "w-full h-full",
  };

  // If comments are open, shift the video container to the left
  // Assuming comment drawer is ~450px wide.
  // We can use a transform or margin.
  // Since the drawer is fixed right, we want to center the video in the remaining space.
  // Remaining space width = 100vw - 450px.
  // Center of remaining space is at (100vw - 450px) / 2.
  // Current center is 50vw.
  // Shift amount = 50vw - (100vw - 450px) / 2 = 50vw - 50vw + 225px = 225px.
  // So we need to shift LEFT by 225px.
  const shiftStyle = isCommentOpen && !isSmallScreen ? { transform: "translateX(-225px)" } : {};

  return (
    <div className="relative flex h-full w-full items-center justify-center bg-[#161823]">
      <div
        className={`relative flex flex-col ${containerClasses[orientation]} justify-center overflow-hidden rounded-2xl bg-black transition-transform duration-300 ease-in-out`}
        style={shiftStyle}
      >
        <VideoPlayer
          video={video}
          onOrientationChange={handleOrientationChange}
          loadMode={loadMode}
        />
        {/* <div className="absolute bottom-5 left-5 text-white drop-shadow-md">
          <p className="font-semibold">@{video.user.username}</p>
          <p className="max-w-[70%] text-sm opacity-80">{video.description}</p>
        </div> */}
        {isSmallScreen ? <ActionButtons video={video} /> : ""}
      </div>
      {/* Right action column */}
      {isSmallScreen ? "" : <ActionButtons video={video} />}
    </div>
  );
}
