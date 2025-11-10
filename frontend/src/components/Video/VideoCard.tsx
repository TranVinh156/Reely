import React from "react";
import { useState } from "react";
import type { Video } from "../../types/video";
import VideoPlayer, { type VideoOrientation } from "./VideoPlayer";
import { useMediaQuery } from "../../hooks/feed/useMediaQuery";
interface Props {
  video: Video;
}

function formatCount(n: number) {
  if (n >= 1_000_000) return `${Math.round(n / 1000000)}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return n.toString();
}

function ActionButton({ video }: Props) {
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  return (
    <div
      className={`${
        isSmallScreen ? "absolute right-3.5" : "relative ml-5"
      } flex flex-col items-center space-y-8 text-white`}
    >
      <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-white/20">
        <img
          src={video.user.avatar}
          alt={video.user.username}
          className="h-full w-full object-cover"
        />
      </div>

      <button
        // onClick={}
        className="relative flex h-10 w-10 flex-col items-center justify-center rounded-full bg-[#ffffff21]"
      >
        <div className="icon-[mdi--heart] h-6 w-6"></div>
        <div className="absolute top-10 mt-1 text-xs font-bold text-white">
          {formatCount(video.likes)}
        </div>
      </button>

      <button
        // onClick={}
        className="relative flex h-10 w-10 flex-col items-center justify-center rounded-full bg-[#ffffff21]"
      >
        <div className="icon-[basil--comment-solid] h-6 w-6"></div>
        <div className="absolute top-10 mt-1 text-sm">
          {formatCount(video.comments)}
        </div>
      </button>

      <button
        // onClick={}
        className="relative flex h-10 w-10 flex-col items-center justify-center rounded-full bg-[#ffffff21]"
      >
        <div className="icon-[subway--mark-2] h-6 w-6"></div>
        <div className="absolute top-10 mt-1 text-xs font-bold text-white">
          {formatCount(video.likes)}
        </div>
      </button>

      <button
        // onClick={}
        className="relative flex h-10 w-10 flex-col items-center justify-center rounded-full bg-[#ffffff21]"
      >
        <div className="icon-[ooui--share] h-6 w-6"></div>
        <div className="absolute top-10 mt-1 text-xs font-bold text-white">
          {formatCount(video.likes)}
        </div>
      </button>
    </div>
  );
}

export default function VideoCard({ video }: Props) {
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
        />
        {/* <div className="absolute bottom-5 left-5 text-white drop-shadow-md">
          <p className="font-semibold">@{video.user.username}</p>
          <p className="max-w-[70%] text-sm opacity-80">{video.description}</p>
        </div> */}
        {isSmallScreen ? <ActionButton video={video} /> : ""}
      </div>
      {/* Right action column */}
      {isSmallScreen ? "" : <ActionButton video={video} />}
    </div>
  );
}
