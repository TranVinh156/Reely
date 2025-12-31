import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react"
import { useFeedStore } from "../../store/feedStore";
import { preloadUrl } from "./usePreloadRendition";

export function useVideoController(videoRef: RefObject<HTMLVideoElement | null>, id: string) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const autoPlay = useFeedStore((s) => s.autoPlay);
  const currentIndex = useFeedStore((s) => s.currentIndex);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    // autoplay if allowed and visible (visibility handling done externally)
    if (autoPlay && el.paused) {
      el.play().then(() => setIsPlaying(true)).catch(() => { });
    }

    const onPlay = () => {
      setIsPlaying(true);
      console.log("Video playing:", id);
      const nextVideo = document.querySelectorAll("video[data-id]")[currentIndex + 1] as HTMLVideoElement;
      if (nextVideo) {
        const nextSrc = nextVideo.getAttribute("src") || nextVideo.currentSrc || "";
        preloadUrl(nextSrc || undefined);
      }
    };
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);

    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
    };
  }, [videoRef, autoPlay, currentIndex]);

  const play = async () => {
    const el = videoRef.current;
    if (!el) return;
    try {
      await el.play();
      setIsPlaying(true);
    } catch (e) {
      // autoplay blocked -> keep muted and try again
      try {
        el.muted = true;
        await el.play();
        setIsPlaying(true);
      } catch { }
    }
  };

  const pause = () => {
    const el = videoRef.current;
    if (!el) return;
    el.pause();
    setIsPlaying(false);
  };

  const togglePlay = () => {
    isPlaying ? pause() : play();
  };

  const setVol = (v: number) => {
    const el = videoRef.current;
    if (!el) return;
    el.volume = Math.max(0, Math.min(1, v));
    setVolume(el.volume);
    setMuted(el.volume === 0);
  };

  const toggleMute = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
  };

  return {
    isPlaying,
    play,
    pause,
    togglePlay,
    muted,
    toggleMute,
    volume,
    setVol,
  };
}
