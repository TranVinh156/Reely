// frontend/src/components/Video/ActionButtons.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "@/hooks/feed/useMediaQuery";
import { useFeedStore } from "@/store/feedStore";
import Comment from "@/components/Comment/Comment";
import type { Video } from "@/types/video";
import { likeVideo, unlikeVideo } from "@/api/feed";
import { ShareModel } from "./ShareModal";
import { UserIcon, Plus, Check } from "lucide-react";
import { follow, isFollowing, unfollow } from "@/api/follow";
import { useAuth } from "@/hooks/auth/useAuth";

function formatCount(n: number) {
  if (n >= 1_000_000) return `${Math.round(n / 1_000_000)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return `${n}`;
}

type Props = {
  video: Video;
};

export function ActionButtons({ video }: Props) {
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  // Select only the specific video's like status to avoid unnecessary re-renders
  const isLikedInStore = useFeedStore((s) => s.liked[String(video.id)]);
  const setLikeInStore = useFeedStore((s) => s.setLike);

  const commentCountInStore = useFeedStore((s) => s.commentCounts[video.id]);
  const setCommentCountInStore = useFeedStore((s) => s.setCommentCount);

  const activeCommentVideoId = useFeedStore((s) => s.activeCommentVideoId);
  const openComment = useFeedStore((s) => s.openComment);
  const closeComment = useFeedStore((s) => s.closeComment);
  const location = useLocation();

  useEffect(() => {
    closeComment();
  }, [location.pathname, closeComment]);

  // Initialize store with video.isLiked if not present
  useEffect(() => {
    if (isLikedInStore === undefined && video.isLiked !== undefined) {
      setLikeInStore(String(video.id), !!video.isLiked);
    }
    if (commentCountInStore === undefined && video.comments !== undefined) {
      setCommentCountInStore(video.id, video.comments);
    }
  }, [video.id, video.isLiked, isLikedInStore, setLikeInStore, video.comments, commentCountInStore, setCommentCountInStore]);

  // Derived state for UI
  const liked = isLikedInStore !== undefined ? !!isLikedInStore : !!video.isLiked;
  const commentCount = commentCountInStore !== undefined ? commentCountInStore : video.comments;

  const likeCount = useMemo(() => {
    let count = Number(video.likes ?? 0);
    const serverLiked = !!video.isLiked;
    // If local state differs from server state, adjust count
    if (liked !== serverLiked) {
      count += liked ? 1 : -1;
    }
    return Math.max(0, count);
  }, [video.likes, video.isLiked, liked]);

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const likeLockRef = useRef(false);
  // Reset modal state when switching to a different video
  useEffect(() => {
    setShareModalOpen(false);
  }, [video.id]);

  const videoIdNumber = useMemo(() => {
    const n = Number.parseInt(String(video.id), 10);
    return Number.isFinite(n) ? n : 0;
  }, [video.id]);

  const videoOwnerIdNumber = useMemo(() => {
    const n = Number.parseInt(String(video.user.id), 10);
    return Number.isFinite(n) ? n : 0;
  }, [video.user.id]);

  const { user: currentUser } = useAuth();
  const [isFollowed, setIsFollowed] = useState(false);
  const [justFollowed, setJustFollowed] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (currentUser && videoOwnerIdNumber && currentUser.id !== videoOwnerIdNumber) {
      isFollowing(Number(currentUser.id), videoOwnerIdNumber).then(status => {
        if (mounted) setIsFollowed(status);
      }).catch(err => console.error(err));
    }
    return () => { mounted = false; };
  }, [currentUser, videoOwnerIdNumber]);

  const handleFollow = async () => {
    if (!currentUser) return;
    try {
      if (isFollowed) {
        await unfollow(Number(currentUser.id), videoOwnerIdNumber);
        setIsFollowed(false);
        setJustFollowed(false);
      } else {
        await follow(Number(currentUser.id), videoOwnerIdNumber);
        setIsFollowed(true);
        setJustFollowed(true);
      }
    } catch (error) {
      console.error("Failed to toggle follow", error);
    }
  };

  const handleToggleLike = async () => {
    if (likeLockRef.current) return;
    likeLockRef.current = true;

    console.log("Liked status before toggle:", liked);
    // Optimistic update via store
    const nextLiked = !liked;
    setLikeInStore(String(video.id), nextLiked);
    console.log("like toggled, now:", nextLiked);

    try {
      const data = nextLiked ? await likeVideo(video.id) : await unlikeVideo(video.id);

      // If server response contradicts our optimistic update, revert
      // if (!(!data.liked !== nextLiked)) {
      //   setLikeInStore(String(video.id), !!data.liked);
      //   console.log("like status corrected to:", !!data.liked);
      // }
    } catch (e) {
      // Revert on error
      setLikeInStore(String(video.id), !nextLiked);
      console.error("toggle like failed:", e);
    } finally {
      likeLockRef.current = false;
    }

    console.log("Liked status after toggle:", liked);
  };

  const isCommentOpen = activeCommentVideoId === video.id;
  const anyCommentOpen = !!activeCommentVideoId;

  const shiftStyle = anyCommentOpen && !isSmallScreen ? { transform: "translateX(-225px)" } : {};

  return (
    <>
      <div
        className={`${isSmallScreen ? "absolute right-3.5" : "relative ml-5"
          } flex flex-col items-center space-y-8 text-white transition-transform duration-300 ease-in-out`}
        style={shiftStyle}
      >
        {/* Avatar */}
        <div className="relative">
          <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-white/20">
            {video.user.avatar ? (
              <img
                src={video.user.avatar}
                alt={video.user.username}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white">
                <UserIcon color="black" />
              </div>
            )}
          </div>
          {currentUser && currentUser.id !== videoOwnerIdNumber && (!isFollowed || justFollowed) && (
            <button
              onClick={handleFollow}
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-sm transition-transform hover:scale-110"
            >
              {isFollowed ? <Check size={12} /> : <Plus size={12} />}
            </button>
          )}
        </div>

        {/* Like */}
        <button
          onClick={handleToggleLike}
          className="relative flex h-10 w-10 flex-col items-center justify-center rounded-full bg-[#ffffff21]"
          aria-label="Like"
        >
          <div
            className={`icon-[mdi--heart] h-6 w-6 ${liked ? "text-red-500" : "text-white"
              }`}
          />
          <div className="absolute top-10 mt-1 text-xs font-bold text-white">
            {formatCount(likeCount)}
          </div>
        </button>

        {/* Comment */}
        <button
          onClick={() => isCommentOpen ? closeComment() : openComment(video.id)}
          className="relative flex h-10 w-10 flex-col items-center justify-center rounded-full bg-[#ffffff21]"
          aria-label="Comment"
        >
          <div className="icon-[basil--comment-solid] h-6 w-6" />
          <div className="absolute top-10 mt-1 text-sm">{formatCount(commentCount)}</div>
        </button>

        {/* Share */}
        <button
          className="relative flex h-10 w-10 flex-col items-center justify-center rounded-full bg-[#ffffff21]"
          aria-label="Share"
          onClick={() => setShareModalOpen(true)}
        >
          <div className="icon-[ooui--share] h-6 w-6" />
        </button>
      </div>

      {shareModalOpen && (
        <ShareModel 
          onClose={() => setShareModalOpen(false)} 
          videoUrl={video.src} 
          shareUrl={`${window.location.origin}/videos/${video.id}`}
        />
      )}

      {/* Comment Drawer */}
      {isCommentOpen && (
        <>
          {isSmallScreen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40"
              onClick={closeComment}
            />
          )}
          <div className={`fixed z-50 shadow-xl bg-[#1e1e1e] transition-all duration-300 ease-in-out
            ${isSmallScreen 
              ? "inset-x-0 bottom-0 h-[70vh] rounded-t-2xl border-t border-white/10" 
              : "right-0 top-0 bottom-0 w-[450px] border-l border-white/10"
            }
          `}>
            <Comment videoId={videoIdNumber} videoOwnerId={videoOwnerIdNumber} onClose={closeComment} />
          </div>
        </>
      )}
    </>
  );
}
