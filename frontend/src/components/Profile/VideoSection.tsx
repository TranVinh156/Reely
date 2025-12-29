import { useGetUserVideos } from "@/hooks/video/useGetUserVideos"
import { Heart, Video, Play, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useInView } from "react-intersection-observer"

interface VideoSectionProps {
    userId: number;
}

const VideoSection = ({ userId }: VideoSectionProps) => {
    const [section, setSection] = useState<string>("videos")
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading
    } = useGetUserVideos(userId);

    const { ref, inView } = useInView();
    const storageUrl = 'http://localhost:9000';

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    const videos = data?.pages.flatMap((page) => page.content) || [];

    return (
        <div>
            <div className="flex gap-5 border-b border-gray-800 mb-6">
                <button
                    onClick={() => setSection("videos")}
                    className={`flex gap-2 items-center font-semibold py-3 px-6 border-b-2 transition-colors ${section === "videos"
                        ? "border-white text-white"
                        : "border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-200"
                        }`}
                >
                    <Video size={20} /> Videos
                </button>
                <button
                    onClick={() => setSection("liked")}
                    className={`flex gap-2 items-center font-semibold py-3 px-6 border-b-2 transition-colors ${section === "liked"
                        ? "border-white text-white"
                        : "border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-200"
                        }`}
                >
                    <Heart size={20} /> Liked
                </button>
            </div>

            {section === "videos" && (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                        {isLoading ? (
                            <div className="col-span-full text-center text-gray-500 py-10">Loading videos...</div>
                        ) : videos.length === 0 ? (
                            <div className="col-span-full text-center text-gray-500 py-10">No videos yet</div>
                        ) : (
                            videos.map((video) => (
                                <div key={video.id} className="aspect-[10/16] bg-gray-900 rounded-lg overflow-hidden relative group cursor-pointer">
                                    <video
                                        src={`${storageUrl}${video.originalS3Key}`}
                                        className="w-full h-full object-cover"
                                        muted
                                        loop
                                        playsInline
                                        onMouseEnter={(e) => e.currentTarget.play()}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.pause();
                                            e.currentTarget.currentTime = 0;
                                        }}
                                    />
                                    <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1 text-white text-xs drop-shadow-md">
                                        <Play size={12} fill="white" />
                                        <span>{video.viewCount}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {videos.length > 0 && (
                        <div ref={ref} className="py-8 flex justify-center w-full">
                            {isFetchingNextPage && (
                                <Loader2 className="animate-spin text-primary" size={24} />
                            )}
                        </div>
                    )}
                </>
            )}

            {section === "liked" && (
                <div className="text-center text-gray-500 py-10">
                    Like
                </div>
            )}
        </div>
    )
}

export default VideoSection