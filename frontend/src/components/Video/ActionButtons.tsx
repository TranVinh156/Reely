// frontend/src/components/Video/ActionButtons.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "@/hooks/feed/useMediaQuery";
import { useFeedStore } from "@/store/feedStore";
import Comment from "@/components/Comment/Comment";
import type { Video } from "@/types/video";
import { likeVideo, unlikeVideo } from "@/api/feed";
import { ShareModel } from "./ShareModal";

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
  const isLikedInStore = useFeedStore((s) => s.liked[video.id]);
  const setLikeInStore = useFeedStore((s) => s.setLike);

  const commentCountInStore = useFeedStore((s) => s.commentCounts[video.id]);
  const setCommentCountInStore = useFeedStore((s) => s.setCommentCount);
  
  const activeCommentVideoId = useFeedStore((s) => s.activeCommentVideoId);
  const openComment = useFeedStore((s) => s.openComment);
  const closeComment = useFeedStore((s) => s.closeComment);

  // Initialize store with video.isLiked if not present
  useEffect(() => {
    if (isLikedInStore === undefined && video.isLiked !== undefined) {
      setLikeInStore(video.id, video.isLiked);
    }
    if (commentCountInStore === undefined && video.comments !== undefined) {
      setCommentCountInStore(video.id, video.comments);
    }
  }, [video.id, video.isLiked, isLikedInStore, setLikeInStore, video.comments, commentCountInStore, setCommentCountInStore]);

  // Derived state for UI
  const liked = isLikedInStore !== undefined ? isLikedInStore : !!video.isLiked;
  const commentCount = commentCountInStore !== undefined ? commentCountInStore : video.comments;

  const likeCount = useMemo(() => {
    let count = video.likes;
    const serverLiked = !!video.isLiked;
    // If local state differs from server state, adjust count
    if (liked !== serverLiked) {
      count += liked ? 1 : -1;
    }
    return Math.max(0, count);
  }, [video.likes, video.isLiked, liked]);

  const [shareModalOpen, setShareModalOpen] = useState(false);

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

  const handleToggleLike = async () => {
    // Optimistic update via store
    const nextLiked = !liked;
    setLikeInStore(video.id, nextLiked);

    try {
      const data = nextLiked ? await likeVideo(video.id) : await unlikeVideo(video.id);

      // If server response contradicts our optimistic update, revert
      if (!!data.liked !== nextLiked) {
        setLikeInStore(video.id, !!data.liked);
      }
    } catch (e) {
      // Revert on error
      setLikeInStore(video.id, !nextLiked);
      console.error("toggle like failed:", e);
    }
  };

  const isCommentOpen = activeCommentVideoId === video.id;
  const anyCommentOpen = !!activeCommentVideoId;

  const shiftStyle = anyCommentOpen && !isSmallScreen ? { transform: "translateX(-225px)" } : {};

  return (
    <>
      <div
        className={`${
          isSmallScreen ? "absolute right-3.5" : "relative ml-5"
        } flex flex-col items-center space-y-8 text-white transition-transform duration-300 ease-in-out`}
        style={shiftStyle}
      >
        {/* Avatar */}
        <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-white/20">
          <img
            src={video.user.avatar}
            alt={video.user.username}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Like */}
        <button
          onClick={handleToggleLike}
          className="relative flex h-10 w-10 flex-col items-center justify-center rounded-full bg-[#ffffff21]"
          aria-label="Like"
        >
          <div
            className={`icon-[mdi--heart] h-6 w-6 ${
              liked ? "text-red-500" : "text-white"
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

        {/* Save (placeholder) */}
        <button
          className="relative flex h-10 w-10 flex-col items-center justify-center rounded-full bg-[#ffffff21]"
          aria-label="Save"
        >
          <div className="icon-[subway--mark-2] h-6 w-6" />
        </button>

        {/* Share */}
        <button
          className="relative flex h-10 w-10 flex-col items-center justify-center rounded-full bg-[#ffffff21]"
          aria-label="Share"
          onClick={() => setShareModalOpen(true)}
        >
          <div className="icon-[ooui--share] h-6 w-6" />
          <div className="absolute top-10 mt-1 text-xs font-bold text-white">
            {formatCount(video.shares)}
          </div>
        </button>
      </div>

      {shareModalOpen && (
        <ShareModel onClose={() => setShareModalOpen(false)} videoUrl={video.src} />
      )}

      {/* Comment Drawer */}
      {isCommentOpen && (
        <div className="fixed right-0 top-0 bottom-0 z-50 w-[450px] shadow-xl bg-[#1e1e1e] border-l border-white/10">
            <Comment videoId={videoIdNumber} videoOwnerId={videoOwnerIdNumber} onClose={closeComment} />
        </div>
      )}
    </>
  );
}
