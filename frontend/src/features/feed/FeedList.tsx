import VideoCard from "../../components/Video/VideoCard.tsx";
import { useInfiniteFeed } from "../../hooks/useInfiniteFeed.ts";
import { useFeedAutoPause } from "../../hooks/useFeedAutoPause.ts"; // implemented below

export default function FeedList() {
  const { videos, loaderRef, isLoading } = useInfiniteFeed();
  useFeedAutoPause();

  return (
    <div className="flex flex-col items-center w-full">
      {videos.map((v) => (
        <div key={v.id} className="feed-item w-full">
          <VideoCard video={v} />
        </div>
      ))}
      {isLoading && <p className="py-4 text-gray-400 text-sm animate-pulse">Đang tải thêm video...</p>}
      <div ref={loaderRef} className="h-[200px]" />
    </div>
  );
}
