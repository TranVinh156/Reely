// // frontend/src/features/feed/hooks/useInfiniteFeed.ts
// import { useEffect, useRef, useState, useCallback } from "react";
// import { fetchFeed } from "@/api/feed";
// import type { FeedItem } from "@/api/feed";

// export function useInfiniteFeed(pageSize = 4) {
//   const [items, setItems] = useState<FeedItem[]>([]);
//   const [page, setPage] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const inFlight = useRef(false);

//   useEffect(() => {
//     let mounted = true;
//     const load = async () => {
//       if (inFlight.current) return;
//       inFlight.current = true;
//       setLoading(true);
//       try {
//         const { items: newItems, hasMore: more } = await fetchFeed(page, pageSize);
//         if (!mounted) return;
//         setItems((prev) => (page === 0 ? newItems : [...prev, ...newItems]));
//         setHasMore(more);
//       } catch (err) {
//         console.error("fetchFeed err", err);
//       } finally {
//         if (mounted) setLoading(false);
//         inFlight.current = false;
//       }
//     };
//     load();
//     return () => {
//       mounted = false;
//     };
//   }, [page, pageSize]);

//   const loadNext = useCallback(() => {
//     if (!loading && hasMore) setPage((p) => p + 1);
//   }, [loading, hasMore]);

//   const prependItem = useCallback((item: FeedItem) => {
//     setItems((p) => [item, ...p]);
//   }, []);

//   return { items, loading, hasMore, loadNext, prependItem, setItems };
// }

import { useEffect, useState, useRef, useCallback } from "react";
import type { Video } from "../../types/video";
import { fetchFeed, type FeedMode } from "../../api/feed";
import { useFeedStore } from "@/store/feedStore";

export function useInfiniteFeed(pageSize = 5, mode: FeedMode = "personal") {
  const [videos, setVideos] = useState<Video[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const isFetching = useRef(false);

  const hydrateLiked = useFeedStore((s) => s.hydrateLiked);

  const loadMore = useCallback(async () => {
    if (isFetching.current || !hasMore) return;
    isFetching.current = true;
    setIsLoading(true);
    try {
      const res = await fetchFeed(cursor ?? undefined, pageSize);
      setVideos((prev) => {
        const existingIds = new Set(prev.map((v) => v.id));
        const newVideos = res.videos.filter((v) => !existingIds.has(v.id));

        // hydrate liked state once we see a video in feed
        const likedEntries: Record<string, boolean> = {};
        for (const v of newVideos) {
          if (typeof v.isLiked === "boolean") likedEntries[v.id] = v.isLiked;
        }
        hydrateLiked(likedEntries);

        return [...prev, ...newVideos];
      });
      setCursor(res.nextCursor ?? null);
      setHasMore(res.hasMore);
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  }, [cursor, hasMore, pageSize]);

  useEffect(() => {
    loadMore(); // initial
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setVideos([]);
    setCursor(null);
    setHasMore(true);
  }, [mode]);

  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { rootMargin: "600px" }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loadMore, hasMore, isLoading]);

  return { videos, loaderRef, isLoading, hasMore };
}
