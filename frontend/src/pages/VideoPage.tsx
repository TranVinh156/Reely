import VideoCard from "@/components/Video/VideoCard";
import Comment from "@/components/Comment/Comment";
import { useGetVideoById } from "@/hooks/video/useGetVideoById";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import LoadingPage from "@/components/Auth/LoadingPage";
import { Ellipsis, Heart, MessageCircle, Play, UserIcon, ChevronLeft } from "lucide-react";
import { useAuth } from "@/hooks/auth/useAuth";
import useIsFollowing from "@/hooks/follow/useIsFollowing";
import useFollow from "@/hooks/follow/useFollow";
import useUnfollow from "@/hooks/follow/useUnfollow";
import { useState } from "react";
import DeleteVideoModal from "@/components/Layout/DeleteVideoModal";
import { deleteVideo } from "@/api/video";

const VideoPage = () => {
    const { id: videoId } = useParams();
    const { data: videoData, isLoading } = useGetVideoById(Number(videoId));
    const { user: currentUser } = useAuth();
    console.log(videoData)
    const creatorId = videoData?.user?.id
        ? Number(videoData.user.id)
        : -1;

    const { data: isFollowingUser = false } = useIsFollowing(
        currentUser?.id ?? -1,
        creatorId,
        !!currentUser && currentUser.id !== creatorId
    );

    const { mutate: followUser, isPending: isFollowing } = useFollow();
    const { mutate: unfollowUser, isPending: isUnfollowing } = useUnfollow();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const navigate = useNavigate();
    const [openDeleteOption, setDeleteOption] = useState(false);

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
    console.log(creatorId + " " + currentUser?.id)

    const numericVideoId = Number.parseInt(String(videoData.id), 10) || 0;
    const numericOwnerId = Number.parseInt(String(videoData.user.id), 10) || 0;

    const deleteOption = (
        <div className="absolute right-0 top-full z-50 w-32 rounded-lg bg-[#FE2C55] shadow-xl border border-white/10">
            <button className="flex w-full px-2 py-2 text-left text-base text-white hover:bg-white/5 font-semibold justify-center cursor-pointer"
                onClick={() => { setShowDeleteModal(true) }}>
                Delete Video
            </button>
        </div>
    )

    const handleDeleteConfirm = async () => {
        try {
            await deleteVideo(parseInt(videoId ? videoId : '-1'));
            setShowDeleteModal(false);
            navigate(`/users/${currentUser?.username}`);
        } catch (error) {
            console.error("Failed to delete video:", error);
        }
    }

    return (
        <div className="flex flex-col lg:flex-row h-screen text-white overflow-hidden">
            <div className="relative flex-1 lg:flex-[3] flex items-center justify-center bg-black min-h-0">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 z-50 p-2 bg-gray-800/50 rounded-full hover:bg-gray-800 transition-colors cursor-pointer"
                >
                    <ChevronLeft size={24} color="white" />
                </button>
                <VideoCard video={videoData} loadMode="active" isFeed={false} />
            </div>

            <div className="flex w-full lg:w-[420px] lg:flex-[2] flex-col bg-[#121212] h-[60vh] lg:h-full border-t lg:border-l border-white/10">
                <div className="flex items-center justify-between gap-3 px-4 py-3 shrink-0">
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
                    {(creatorId != currentUser?.id) ?
                        (<button
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
                        </button>) :
                        (
                            <div className="relative">
                                <Ellipsis onClick={() => setDeleteOption(!openDeleteOption)} className="cursor-pointer" size={25} />
                                {openDeleteOption && deleteOption}
                            </div>

                        )}

                </div>

                <div className="px-4 py-3 text-sm shrink-0">
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

                <div className="flex-1 min-h-0 overflow-hidden">
                    <Comment
                        videoId={numericVideoId}
                        videoOwnerId={numericOwnerId}
                        onClose={() => { }}
                        hideCloseButton
                    />
                </div>
            </div>

            {showDeleteModal && (
                <DeleteVideoModal
                    username={currentUser?.username ? currentUser.username : "null"}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteConfirm}
                />
            )}
        </div>
    );
};

export default VideoPage;