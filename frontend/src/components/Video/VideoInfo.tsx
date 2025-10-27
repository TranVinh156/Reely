import React from "react";

interface VideoInfoProps {
  username: string;
  description: string;
}

export default function VideoInfo({ username, description }: VideoInfoProps) {
  return (
    <div className="">
      <p className="font-semibold text-white">{username}</p>
      <p className="text-gray-300 opacity-80 max-w-[70%]">{description}</p>
    </div>
  );
}
