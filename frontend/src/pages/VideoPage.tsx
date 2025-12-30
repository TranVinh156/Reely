import VideoCard from "@/components/Video/VideoCard";
import Comment from "@/components/Comment/Comment";
import { useGetVideoById } from "@/hooks/video/useGetVideoById";
import { NavLink, useParams } from "react-router-dom";
import LoadingPage from "@/components/Auth/LoadingPage";
import { Heart, MessageCircle, Play, UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/auth/useAuth";
import useIsFollowing from "@/hooks/follow/useIsFollowing";
import useFollow from "@/hooks/follow/useFollow";
import useUnfollow from "@/hooks/follow/useUnfollow";

const VideoPage = () => {
    const { id: videoId } = useParams();
    const { data: videoData, isLoading } = useGetVideoById(Number(videoId));
    const { user: currentUser } = useAuth();
    console.log(videoData)
    const creatorId = videoData?.user.id !== undefined && videoData?.user.id !== null
        ? Number(videoData.user.id)
        : -1;

    const { data: isFollowingUser = false } = useIsFollowing(
        currentUser?.id ?? -1,
        creatorId,
        !!currentUser && currentUser.id !== creatorId
    );

    const { mutate: followUser, isPending: isFollowing } = useFollow();
    const { mutate: unfollowUser, isPending: isUnfollowing } = useUnfollow();

    const handleFollowToggle = () => {
        if (!currentUser) return;

        if (isFollowingUser) {
            console.log('Unfollow')
            unfollowUser({
                followerId: currentUser.id,
                followingId: creatorId,
            });
        } else {
            console.log('Follow')
            followUser({
                followerId: currentUser.id,
                followingId: creatorId,
            });
        }
    };

    if (isLoading || !videoData) {
        return <LoadingPage />;
    }

    const numericVideoId = Number.parseInt(String(videoData.id), 10) || 0;
    const numericOwnerId = Number.parseInt(String(videoData.user.id), 10) || 0;

    return (
        <div className="flex h-screen text-white">
            <div className="flex flex-[3] items-center justify-center">
                <div className="flex h-full w-full items-center justify-center">
                    <VideoCard video={videoData} loadMode="active" />
                </div>
            </div>

            <div className="flex w-[420px] flex-[2] flex-col bg-[#121212]">
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                    <NavLink to={`/users/${videoData.user.username}`} className="flex gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-full bg-white flex items-center justify-center">
                            {videoData.user.avatar ? (
                                <img
                                    src={videoData.user.avatar}
                                    alt={videoData.user.username}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <UserIcon className="text-black" size={20} />
                            )}
                        </div>
                        <div className="flex min-w-0 flex-col">
                            <span className="truncate text-sm font-semibold">{videoData.user.username}</span>
                            <span className="truncate text-xs text-white/60">Người sáng tạo</span>
                        </div>
                    </NavLink>
                    {creatorId != currentUser?.id &&
                        <button
                            onClick={handleFollowToggle}
                            disabled={isFollowing || isUnfollowing}
                            className={`px-4 py-1 text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isFollowingUser
                                ? 'bg-gray-600 hover:bg-gray-700'
                                : 'bg-red-600 hover:bg-red-700'
                                }`}
                        >
                            {isFollowing || isUnfollowing
                                ? 'Loading...'
                                : isFollowingUser
                                    ? 'Unfollow'
                                    : 'Follow'
                            }
                        </button>}
                </div>

                <div className="px-4 py-3 text-sm">
                    <h1 className="text-lg font-bold mb-2">
                        {videoData.title}
                    </h1>
                    <p className="mb-2 line-clamp-3 break-words text-white/90">
                        {videoData.description || "Không có mô tả"}
                    </p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/50">
                        <span className="flex items-center gap-1"><Play size={12} /> {videoData.views} </span>
                        <span className="flex items-center gap-1"><Heart size={12} /> {videoData.likes}</span>
                        <span className="flex items-center gap-1"><MessageCircle size={12} /> {videoData.comments}</span>
                    </div>
                </div>

                <div className="flex-1">
                    <Comment
                        videoId={numericVideoId}
                        videoOwnerId={numericOwnerId}
                        onClose={() => { }}
                        hideCloseButton
                    />
                </div>
            </div>
        </div>
    );
};

export default VideoPage;