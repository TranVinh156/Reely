import React from "react";
import { useVideoProgress } from "../../hooks/useVideoProgress";
import formatTime from "../../utils/formatTime";
import { useRef, useState } from "react";
// import { on } from "events";

interface ProgressbarProps {
  progress: number;
  duration: number;
  currentTime: number;
  onSeek: (percent: number) => void;
  onSeekStart: () => void;
  onSeekEnd: () => void;
}

export const ProgressBar: React.FC<ProgressbarProps> = ({
  progress,
  duration,
  currentTime,
  onSeek,
  onSeekStart,
  onSeekEnd,
}) => {
  const barRef = useRef<HTMLDivElement>(null);
  const [isSeeking, setIsSeeking] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = barRef.current?.getBoundingClientRect();
    if (!rect) return;
    const percent = (e.clientX - rect.left) / rect.width;
    setHoverX(e.clientX - rect.left);
    setHoverTime(Math.max(0, Math.min(duration * percent, duration)));
  };

  const handleClickOrDrag = (e: React.MouseEvent) => {
    const rect = barRef.current?.getBoundingClientRect();
    if (!rect || !duration) return;

    const percent = (e.clientX - rect.left) / rect.width;
    onSeek(Math.max(0, Math.min(percent, 1)));
  };

  return (
    <div
      ref={barRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setHoverTime(null);
        setHoverX(null);
      }}
      onMouseDown={(e) => {
        onSeekStart();
        handleClickOrDrag(e);

        const up = () => {
          onSeekEnd();
          window.removeEventListener("mouseup", up);
          window.removeEventListener("mousemove", move);
        };

        const move = (ev: MouseEvent) => {
          handleClickOrDrag(ev as any as React.MouseEvent);
        };
        window.addEventListener("mouseup", up);
        window.addEventListener("mousemove", move);
      }}
      className="relative h-[4px] w-full cursor-pointer rounded-full bg-neutral-700 transition-all hover:h-[6px]"
    >
      <div
        className="absolute top-0 left-0 h-full rounded-full bg-red-500"
        style={{ width: `${progress * 100}%` }}
      ></div>

        {/* tooltip */}
      {hoverTime !== null && hoverX !== null && (
        <div
          className="absolute -top-6 rounded-md bg-black/70 px-2 py-1 text-xs text-white"
          style={{ left: `${hoverX}px`, transform: "translateX(-50%)" }}
        >
          {formatTime(hoverTime)} / {formatTime(duration)}
        </div>
      )}
    </div>
  );
};
