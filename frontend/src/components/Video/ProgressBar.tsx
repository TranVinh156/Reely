import React from "react";
import { useVideoProgress } from "../../hooks/feed/useVideoProgress";
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
  const draggingRef = useRef(false);

  const [isSeeking, setIsSeeking] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState<number | null>(null);

  const calc = (clientX: number) => {
    const rect = barRef.current?.getBoundingClientRect();
    if (!rect || !duration) return null;

    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(1, x / rect.width));
    return { percent, x };
  };

  const handleMove = (clientX: number, dragging: boolean) => {
    const r = calc(clientX);
    if (!r) return;

    setHoverX(r.x);
    setHoverTime(duration * r.percent);

    if (dragging) onSeek(r.percent);
  };

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
      className="relative h-[4px] w-full cursor-pointer rounded-full bg-neutral-700 transition-all hover:h-[6px]"
      onPointerDown={(e) => {
        if (!duration) return;
        draggingRef.current = true;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        onSeekStart();
        handleMove(e.clientX, true);
      }}
      onPointerMove={(e) => {
        handleMove(e.clientX, draggingRef.current);
      }}
      onPointerUp={() => {
        if (!draggingRef.current) return;
        draggingRef.current = false;
        onSeekEnd();
      }}
      onPointerLeave={() => {
        setHoverTime(null);
        setHoverX(null);
      }}
    >
      <div
        className="absolute top-0 left-0 h-full rounded-full bg-red-500"
        style={{ width: `${progress * 100}%` }}
      />

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
