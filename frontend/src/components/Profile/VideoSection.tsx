import { useAuth } from "@/hooks/auth/useAuth";
import { useGetUserVideos } from "@/hooks/video/useGetUserVideos"
import { useGetLikedVideos } from "@/hooks/video/useGetLikedVideos"
import { STORAGE_URL } from "@/utils/constant";
import { Heart, Video, Play, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { NavLink } from "react-router-dom";

interface VideoSectionProps {
    userId: number;
}

const VideoSection = ({ userId }: VideoSectionProps) => {
    const [section, setSection] = useState<string>("videos")
    const {
        data: userVideosData,
        fetchNextPage: fetchNextUserVideos,
        hasNextPage: hasNextUserVideos,
        isFetchingNextPage: isFetchingNextUserVideos,
        isLoading: isLoadingUserVideos
    } = useGetUserVideos(userId);

    const {
        data: likedVideosData,
        fetchNextPage: fetchNextLikedVideos,
        hasNextPage: hasNextLikedVideos,
        isFetchingNextPage: isFetchingNextLikedVideos,
        isLoading: isLoadingLikedVideos
    } = useGetLikedVideos(userId);

    const { user: currentUser } = useAuth();

    const { ref, inView } = useInView();

    const isVideosSection = section === "videos";

    useEffect(() => {
        if (inView) {
            if (isVideosSection && hasNextUserVideos) {
                fetchNextUserVideos();
            } else if (!isVideosSection && hasNextLikedVideos) {
                fetchNextLikedVideos();
            }
        }
    }, [inView, isVideosSection, hasNextUserVideos, fetchNextUserVideos, hasNextLikedVideos, fetchNextLikedVideos]);

    const userVideos = userVideosData?.pages.flatMap((page) => page.content) || [];
    const likedVideos = likedVideosData?.pages.flatMap((page) => page.content) || [];

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
                {currentUser?.id === userId &&
                    <button
                        onClick={() => setSection("liked")}
                        className={`flex gap-2 items-center font-semibold py-3 px-6 border-b-2 transition-colors ${section === "liked"
                            ? "border-white text-white"
                            : "border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-200"
                            }`}
                    >
                        <Heart size={20} /> Liked
                    </button>}
            </div>

            {section === "videos" && (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                        {isLoadingUserVideos ? (
                            <div className="col-span-full text-center text-gray-500 py-10">Loading videos...</div>
                        ) : userVideos.length === 0 ? (
                            <div className="col-span-full text-center text-gray-500 py-10">No videos yet</div>
                        ) : (
                            userVideos.map((video) => (
                                <NavLink to={`/videos/${video.id}`} key={video.id} className="aspect-[10/16] bg-gray-900 rounded-lg overflow-hidden relative group cursor-pointer">
                                    <video
                                        src={`${STORAGE_URL}${video.originalS3Key}`}
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
                                </NavLink>
                            ))
                        )}
                    </div>

                    {userVideos.length > 0 && (
                        <div ref={ref} className="py-8 flex justify-center w-full">
                            {isFetchingNextUserVideos && (
                                <Loader2 className="animate-spin text-primary" size={24} />
                            )}
                        </div>
                    )}
                </>
            )}

            {section === "liked" && (
                <>
                    {console.log(likedVideos)}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                        {isLoadingLikedVideos ? (
                            <div className="col-span-full text-center text-gray-500 py-10">Loading liked videos...</div>
                        ) : likedVideos.length === 0 ? (
                            <div className="col-span-full text-center text-gray-500 py-10">No liked videos yet</div>
                        ) : (
                            likedVideos.map((video) => (
                                <NavLink to={`/videos/${video.id}`} key={video.id} className="aspect-[10/16] bg-gray-900 rounded-lg overflow-hidden relative group cursor-pointer">
                                    <video
                                        src={`${STORAGE_URL}${video.originalS3Key}`}
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
                                </NavLink>
                            ))
                        )}
                    </div>

                    {likedVideos.length > 0 && (
                        <div ref={ref} className="py-8 flex justify-center w-full">
                            {isFetchingNextLikedVideos && (
                                <Loader2 className="animate-spin text-primary" size={24} />
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default VideoSection