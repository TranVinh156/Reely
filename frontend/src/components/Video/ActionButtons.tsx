// import React from "react";
// import { motion } from "framer-motion";
// import { useFeedStore } from "@/store/feedStore";

// export const ActionButtons: React.FC = () => {
//   const { liked, toggleLike } = useFeedStore();
//   const handleLike = () => toggleLike("current"); // mock id

//   return (
//     <div className="flex items-center gap-3">
//       <motion.button
//         whileTap={{ scale: 0.9 }}
//         onClick={handleLike}
//         className="text-white"
//       >
//         <i
//           className={`ri-heart-${liked["current"] ? "fill text-red-500" : "line"}`}
//         />
//       </motion.button>
//       <button className="text-white">
//         <i className="ri-share-forward-line" />
//       </button>
//       <button className="text-white">
//         <i className="ri-bookmark-line" />
//       </button>
//     </div>
//   );
// };

import React from "react";
import type { Video } from "../../types/video";
import { useMediaQuery } from "../../hooks/feed/useMediaQuery";

export type ActionButtonsPlacement = "responsive" | "overlay" | "sidebar";

export interface ActionButtonsProps {
  video: Video;

  /** Optional UI/behavior overrides (để sau dễ tích hợp API/optimistic update) */
  liked?: boolean;
  saved?: boolean;

  likeCount?: number;
  commentCount?: number;
  savedCount?: number;
  shareCount?: number;

  placement?: ActionButtonsPlacement;
  className?: string;

  onLike?: () => void;
  onComment?: () => void;
  onSave?: () => void;
  onShare?: () => void;
}

function formatCount(n: number) {
  if (n >= 1_000_000) return `${Math.round(n / 1_000_000)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return n.toString();
}

export function ActionButtons({
  video,
  liked = false,
  saved = false,
  likeCount,
  commentCount,
  savedCount,
  shareCount,
  placement = "responsive",
  className,
  onLike,
  onComment,
  onSave,
  onShare,
}: ActionButtonsProps) {
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  const resolvedPlacement: ActionButtonsPlacement =
    placement === "responsive" ? (isSmallScreen ? "overlay" : "sidebar") : placement;

  const positionClass =
    resolvedPlacement === "overlay" ? "absolute right-3.5" : "relative ml-5";

  const likes = likeCount ?? video.likes;
  const comments = commentCount ?? video.comments;
  const shares = shareCount ?? video.shares;
  const saves = savedCount ?? 0; // Video type chưa có savedCount -> để 0 cho đúng (không dùng nhầm likes)

  return (
    <div
      className={`${positionClass} flex flex-col items-center space-y-8 text-white ${
        className ?? ""
      }`}
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
        type="button"
        aria-label="Like"
        onClick={onLike}
        className="relative flex h-10 w-10 flex-col items-center justify-center rounded-full bg-[#ffffff21]"
      >
        <div
          className={`icon-[mdi--heart] h-6 w-6 ${
            liked ? "text-[#FE2C55]" : "text-white"
          }`}
        />
        <div className="absolute top-10 mt-1 text-xs font-bold text-white">
          {formatCount(likes)}
        </div>
      </button>

      {/* Comment */}
      <button
        type="button"
        aria-label="Comment"
        onClick={onComment}
        className="relative flex h-10 w-10 flex-col items-center justify-center rounded-full bg-[#ffffff21]"
      >
        <div className="icon-[basil--comment-solid] h-6 w-6" />
        <div className="absolute top-10 mt-1 text-sm">{formatCount(comments)}</div>
      </button>

      {/* Save */}
      <button
        type="button"
        aria-label="Save"
        onClick={onSave}
        className="relative flex h-10 w-10 flex-col items-center justify-center rounded-full bg-[#ffffff21]"
      >
        <div
          className={`icon-[subway--mark-2] h-6 w-6 ${
            saved ? "text-yellow-300" : "text-white"
          }`}
        />
        <div className="absolute top-10 mt-1 text-xs font-bold text-white">
          {formatCount(saves)}
        </div>
      </button>

      {/* Share */}
      <button
        type="button"
        aria-label="Share"
        onClick={onShare}
        className="relative flex h-10 w-10 flex-col items-center justify-center rounded-full bg-[#ffffff21]"
      >
        <div className="icon-[ooui--share] h-6 w-6" />
        <div className="absolute top-10 mt-1 text-xs font-bold text-white">
          {formatCount(shares)}
        </div>
      </button>
    </div>
  );
}

export default ActionButtons;

