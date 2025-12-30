import VideoCard from "../../components/Video/VideoCard.tsx";
import { useFeedAutoPause } from "../../hooks/feed/useFeedAutoPause.ts"; // implemented below
import LoadingPage from "@/components/Auth/LoadingPage.tsx";
import { useFeedStore } from "@/store/feedStore.ts";
import { useInfiniteFeed } from "@/hooks/feed/useInfiniteFeed.ts";

export default function FeedList() {
  const mode = useFeedStore((s) => s.mode);
  const { videos, loaderRef, isLoading } = useInfiniteFeed(5, mode);
  useFeedAutoPause();
  const currentIndex = useFeedStore((s) => s.currentIndex);

  if (isLoading && videos.length === 0) {
    return <LoadingPage />;
  }

  return (
    <div className="flex w-full flex-col items-center">
      {videos.map((v, idx) => {
        const delta = idx - currentIndex;
        const loadMode =
          delta === 0
            ? "active"
            : (delta >= -2 && delta <= 4
              ? "preload"
              : "idle");
        return (
          <div
            key={v.id}
            className="feed-item w-full"
            data-feed-item
            data-video-id={v.id}
            data-feed-index={idx}
          >
            <VideoCard video={v} loadMode={loadMode} />
          </div>
        );
      })}
      <div ref={loaderRef} className="h-[200px]" />
    </div>
  );
}
