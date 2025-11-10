import { use, useEffect } from "react";

export function useVideoHotkeys(videoRef: React.RefObject<HTMLVideoElement | null>) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const active = document.activeElement;
            if (active && ['INPUT', 'TEXTAREA'].includes(active.tagName)) {
                return;
            }

            const video = videoRef.current;
            if (!video) return;
            const key = e.key.toLowerCase();
            if (key === " ") {
                e.preventDefault();
                if (video.paused) {
                    video.play().catch(() => {});
                } else {
                    video.pause();
                }
            } else if (key === "m") {
                e.preventDefault();
                video.muted = !video.muted;
            } else if (key === "arrowup") {
                e.preventDefault();
                video.volume = Math.min(1, video.volume + 0.05);
            } else if (key === "arrowdown") {
                e.preventDefault();
                video.volume = Math.max(0, video.volume - 0.05);
            } else if (key === "arrowright") {
                e.preventDefault();
                video.currentTime = Math.min(video.duration || Infinity, video.currentTime + 5);
            } else if (key === "arrowleft") {
                e.preventDefault();
                video.currentTime = Math.max(0, video.currentTime - 5);
            }
        };

        window.addEventListener("keydown", handler);
        return () => {
            window.removeEventListener("keydown", handler);
        };
    }, [videoRef]);
}