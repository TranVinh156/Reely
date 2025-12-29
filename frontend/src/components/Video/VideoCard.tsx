import React from "react";
import { useState } from "react";
import type { Video } from "../../types/video";
import VideoPlayer, { type VideoOrientation } from "./VideoPlayer";
import { useMediaQuery } from "../../hooks/feed/useMediaQuery";
import { ActionButtons } from "./ActionButtons";

interface Props {
  video: Video;
  loadMode?: "active" | "preload" | "idle";
}

export default function VideoCard({ video, loadMode = "idle" }: Props) {
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  const [orientation, setOrientation] = useState<VideoOrientation>("landscape");

  const handleOrientationChange = (newOrientation: VideoOrientation) => {
    setOrientation(newOrientation);
  };

  const containerClasses = {
    landscape: "max-w-[90vh] h-[70%]",
    portrait: "w-auto h-[90vh] max-w-[50vh]", // Ví dụ: cao 90% viewport, rộng tối đa 50vh
    square: "w-[70%] h-[70%]", // Giống landscape
  };

  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-[#161823]">
      <div
        className={`relative flex flex-col ${containerClasses[orientation]} justify-center overflow-hidden rounded-2xl bg-black`}
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
