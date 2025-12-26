import VideoCard from "../../components/Video/VideoCard.tsx";
import { useInfiniteFeed } from "../../hooks/feed/useInfiniteFeed.ts";
import { useFeedAutoPause } from "../../hooks/feed/useFeedAutoPause.ts"; // implemented below
import LoadingPage from "@/components/Auth/LoadingPage.tsx";

export default function FeedList() {
  const { videos, loaderRef, isLoading } = useInfiniteFeed();
  useFeedAutoPause();

  if (isLoading) {
    return (
      <LoadingPage />
    )
  }

  return (
    <div className="flex flex-col items-center w-full">
      {videos.map((v) => (
        <div key={v.id} className="feed-item w-full">
          <VideoCard video={v} />
        </div>
      ))}
      <div ref={loaderRef} className="h-[200px]" />
    </div>
  );
}
