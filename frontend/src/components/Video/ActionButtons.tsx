// frontend/src/components/Video/ActionButtons.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
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

  const likedMap = useFeedStore((s) => s.liked);
  const setLikedInStore = useFeedStore((s) => s.setLiked);

  const hasStoreValue = Object.prototype.hasOwnProperty.call(likedMap, video.id);
  const storeLiked = hasStoreValue ? Boolean(likedMap[video.id]) : Boolean(video.isLiked);

  const [liked, setLiked] = useState(storeLiked);
  const [likeCount, setLikeCount] = useState(video.likes);
  const [viewCount, setViewCount] = useState(video.views);
  const [commentCount, setCommentCount] = useState(video.comments);
  const [likePending, setLikePending] = useState(false);

  const [commentOpen, setCommentOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Guard against rapid multi-click before React state updates
  const likeLockRef = useRef(false);

  // Reset state when switching to a different video
  useEffect(() => {
    setLiked(storeLiked);
    setLikeCount(video.likes);
    setViewCount(video.views);
    setCommentCount(video.comments);
    setLikePending(false);
    setCommentOpen(false);
    setShareModalOpen(false);
  }, [video.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep local liked in sync with store (optional)
  useEffect(() => {
    setLiked(storeLiked);
  }, [storeLiked]);

  // Listen to view updates coming from the feed watcher
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ videoId: string; viewCount: number }>;
      if (!ce?.detail) return;
      if (String(ce.detail.videoId) !== String(video.id)) return;
      setViewCount(Number(ce.detail.viewCount ?? 0));
    };
    window.addEventListener("reely:view", handler as EventListener);
    return () => window.removeEventListener("reely:view", handler as EventListener);
  }, [video.id]);

  const videoIdNumber = useMemo(() => {
    const n = Number.parseInt(String(video.id), 10);
    return Number.isFinite(n) ? n : 0;
  }, [video.id]);

  const videoOwnerIdNumber = useMemo(() => {
    const n = Number.parseInt(String(video.user.id), 10);
    return Number.isFinite(n) ? n : 0;
  }, [video.user.id]);

  const commitLike = async (nextLiked: boolean) => {
    if (likeLockRef.current || likePending) return;
    likeLockRef.current = true;

    const prevLiked = liked;

    // optimistic UI
    setLiked(nextLiked);
    setLikeCount((c) => Math.max(0, c + (nextLiked ? 1 : -1)));
    setLikedInStore(video.id, nextLiked);

    setLikePending(true);
    try {
      const data = nextLiked ? await likeVideo(video.id) : await unlikeVideo(video.id);

      // canonical state from server
      setLiked(Boolean(data.liked));
      setLikedInStore(video.id, Boolean(data.liked));
      if (typeof data.likeCount === "number") {
        setLikeCount(data.likeCount);
      }
    } catch (e) {
      // rollback
      setLiked(prevLiked);
      setLikeCount((c) => Math.max(0, c + (nextLiked ? -1 : 1)));
      setLikedInStore(video.id, prevLiked);
      console.error("toggle like failed:", e);
    } finally {
      setLikePending(false);
      likeLockRef.current = false;
    }
  };

  const handleToggleLike = async () => {
    await commitLike(!liked);
  };

  // TikTok-like: double-tap video to like (only like, never unlike)
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ videoId: string }>;
      if (!ce?.detail) return;
      if (String(ce.detail.videoId) !== String(video.id)) return;
      if (liked) return;
      void commitLike(true);
    };
    window.addEventListener("reely:like", handler as EventListener);
    return () => window.removeEventListener("reely:like", handler as EventListener);
  }, [video.id, liked]);

  return (
    <>
      <div
        className={`${
          isSmallScreen ? "absolute right-3.5" : "relative ml-5"
        } flex flex-col items-center space-y-8 text-white`}
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
          disabled={likePending}
          className={`relative flex h-10 w-10 flex-col items-center justify-center rounded-full bg-[#ffffff21]
            ${likePending ? "opacity-60" : "opacity-100"}`}
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
          onClick={() => setCommentOpen(true)}
          className="relative flex h-10 w-10 flex-col items-center justify-center rounded-full bg-[#ffffff21]"
          aria-label="Comment"
        >
          <div className="icon-[basil--comment-solid] h-6 w-6" />
          <div className="absolute top-10 mt-1 text-sm">{formatCount(video.comments)}</div>
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
      {commentOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setCommentOpen(false)}
          />
          {/* Panel */}
          <div className="relative h-full">
            <Comment videoId={videoIdNumber} videoOwnerId={videoOwnerIdNumber} onClose={() => setCommentOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
