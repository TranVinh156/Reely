import VideoCard from "../../components/Video/VideoCard.tsx";
import { useInfiniteFeed } from "../../hooks/feed/useInfiniteFeed.ts";
import { useFeedAutoPause } from "../../hooks/feed/useFeedAutoPause.ts"; // implemented below
import LoadingPage from "@/components/Auth/LoadingPage.tsx";

export default function FeedList() {
  const { videos, loaderRef, isLoading } = useInfiniteFeed();
  useFeedAutoPause();

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="flex w-full flex-col items-center">
      {videos.map((v, idx) => (
        <div
          key={v.id}
          className="feed-item w-full"
          data-feed-item
          data-video-id={v.id}
          data-feed-index={idx}
        >
          <VideoCard video={v} />
        </div>
      ))}
      <div ref={loaderRef} className="h-[200px]" />
    </div>
  );
}
