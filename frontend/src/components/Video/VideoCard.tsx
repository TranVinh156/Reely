import React from "react";
import type { Video } from "../../types/video";
import VideoPlayer from "./VideoPlayer";
import { useMediaQuery } from "../../hooks/useMediaQuery";
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
      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
        <img
          src={video.user.avatar}
          alt={video.user.username}
          className="w-full h-full object-cover"
        />
      </div>

      <button
        // onClick={}
        className="relative flex flex-col justify-center items-center w-10 h-10 rounded-full bg-[#ffffff21]"
      >
        <div className="icon-[mdi--heart] w-6 h-6"></div>
        <div className="absolute top-10 text-white text-xs font-bold mt-1">
          {formatCount(video.likes)}
        </div>
      </button>

      <button
        // onClick={}
        className="relative flex flex-col justify-center items-center w-10 h-10 rounded-full bg-[#ffffff21]"
      >
        <div className="icon-[basil--comment-solid] w-6 h-6"></div>
        <div className="absolute top-10 text-sm mt-1">
          {formatCount(video.comments)}
        </div>
      </button>

      <button
        // onClick={}
        className="relative flex flex-col justify-center items-center w-10 h-10 rounded-full bg-[#ffffff21]"
      >
        <div className="icon-[subway--mark-2] w-6 h-6"></div>
        <div className="absolute top-10 text-white text-xs font-bold mt-1">
          {formatCount(video.likes)}
        </div>
      </button>

      <button
        // onClick={}
        className="relative flex flex-col justify-center items-center w-10 h-10 rounded-full bg-[#ffffff21]"
      >
        <div className="icon-[ooui--share] w-6 h-6"></div>
        <div className="absolute top-10 text-white text-xs font-bold mt-1">
          {formatCount(video.likes)}
        </div>
      </button>
    </div>
  );
}

export default function VideoCard({ video }: Props) {
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-[#161823]">
      <div className="relative flex flex-col w-[70%] h-[70%] rounded-2xl bg-black justify-center">
        <VideoPlayer video={video} />
        <div className="absolute bottom-3 left-3 text-white drop-shadow-md">
          <p className="font-semibold">@{video.user.username}</p>
          <p className="text-sm opacity-80 max-w-[70%]">{video.description}</p>
        </div>
        {isSmallScreen ? <ActionButton video={video} /> : ""}
      </div>
      {/* Right action column */}
      {isSmallScreen ? "" : <ActionButton video={video} />}
    </div>
  );
}
