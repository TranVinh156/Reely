import { useEffect, useRef } from "react";

export function useAutoPlay(threshold = 0.6) {
    const observerRef = useRef<IntersectionObserver | null>(null);
    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const el = entry.target as HTMLVideoElement;
                    if (!el || el.tagName !== "VIDEO") return;
                    if (entry.isIntersecting) {
                        const promise = el.play();
                        if (promise && typeof promise.then === "function") promise.catch(() => {});   
                    } else {
                        try {
                            el.pause();
                        }
                        catch {

                        }
                    }
                })
            },
            { threshold }
        );
        return () => observerRef.current?.disconnect();
    }, [threshold])

    const observe = (el: HTMLVideoElement | null) => {
        if (!observerRef.current || !el) return;
        observerRef.current.observe(el);    
    }

    const unobserve = (el: HTMLVideoElement | null) => {
        if (!observerRef.current || !el) return;
        observerRef.current.unobserve(el);
    };

    return { observe, unobserve };
}

