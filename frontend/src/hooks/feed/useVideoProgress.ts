import { useEffect, useState, useCallback } from "react";

export function useVideoProgress(videoRef: React.RefObject<HTMLVideoElement | null>) {
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        const el = videoRef.current;
        if (!el) return;

        const onLoaded = () => {
            setDuration(el.duration || 0);
        }

        const onTime = () => {
            setCurrentTime(el.currentTime);
            setProgress((el.currentTime / (el.duration || 1)));
        }

        el.addEventListener("loadedmetadata", onLoaded);
        el.addEventListener("timeupdate", onTime);
        
        return () => {
            el.removeEventListener("loadedmetadata", onLoaded);
            el.removeEventListener("timeupdate", onTime);
        }
    }, [videoRef, isSeeking]);

    const seekTo = useCallback((percent: number) => {
        const el = videoRef.current;
        if (!el) return;
        const newTime = percent * duration;
        el.currentTime = newTime;
        setCurrentTime(newTime);
        setProgress(percent);
    }, [videoRef, duration]);

    return {
        progress,
        duration,
        isSeeking,
        currentTime,
        setIsSeeking,
        seekTo
    }
}
