import { Paperclip, Send, Smile, X, ChevronDown, ChevronUp} from "lucide-react";
import React, { useState } from "react";

interface CommentCardProps {
  username?: string;
  comment?: string;
  timestamp?: string;
  avatarUrl?: string;
  replyCount?: number;
  onViewReplies?: () => void;
  showReplies?: number;
  isReply?: boolean;
  // likeCount?: number;
  // commentId?: string; // ✅ Thêm ID để track like
  // onLike?: (commentId: string) => void; // ✅ Callback khi like
}

const CommentCard: React.FC<CommentCardProps> = ({
  username,
  comment,
  timestamp,
  avatarUrl,
  replyCount = 0,
  showReplies = 0,
  isReply = false,
  // likeCount = 0,
  // commentId = '',
  // onLike,
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  // const [isLiked, setIsLiked] = useState(false); // ✅ Track trạng thái like
  // const [currentLikeCount, setCurrentLikeCount] = useState(likeCount); // ✅ Local like count

  const handleReplyClick = () => {
    setShowReplyInput(true);
  };

  const handleCancelReply = () => {
    setShowReplyInput(false);
    setReplyText("");
  };

  const handleSubmitReply = () => {
    if (replyText.trim()) {
      console.log("Reply:", replyText);
      setReplyText("");
      setShowReplyInput(false);
    }
  };

  // // ✅ Handle like/unlike
  // const handleLike = () => {
  //   setIsLiked(!isLiked);
    
  //   if (!isLiked) {
  //     // Like: Tăng count
  //     setCurrentLikeCount(prev => prev + 1);
  //   } else {
  //     // Unlike: Giảm count
  //     setCurrentLikeCount(prev => Math.max(0, prev - 1));
  //   }

  //   // Callback to parent component
  //   if (onLike && commentId) {
  //     onLike(commentId);
  //   }
  // };

  // Avatar size dựa vào isReply
  const avatarSize = isReply ? "w-8 h-8" : "w-12 h-12";

  return (
    <div className="w-full mt-2">
      {/* Main Comment */}
      <div className="flex gap-3 px-4 py-3 w-full bg-[#1e1e1e]">
        {/* Avatar */}
        <div className="flex flex-col justify-start pt-1">
          <img
            src={avatarUrl}
            alt={username ? `${username} avatar` : 'avatar'}
            className={`${avatarSize} rounded-full flex-shrink-0 object-cover`}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col gap-y-1">
          {/* Username */}
          <div className="flex items-center gap-2">
            <h4 className={`${isReply ? 'text-sm' : 'text-base'} font-semibold text-white`}>
              {username || 'Unknown'}
            </h4>
          </div>

          {/* Comment Text */}
          <p className="text-sm text-white/95 leading-tight">
            {comment || ''}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-10">
            <span className="text-sm text-white/60">{timestamp || ''}</span>
            <button
              onClick={handleReplyClick}
              className="text-sm text-white/60 hover:text-white cursor-pointer transition-colors"
            >
              Reply
            </button>

            {/* ✅ Like Button với logic */}
            {/* <button 
              onClick={handleLike}
              className="flex items-center gap-1 group cursor-pointer"
            >
              <Heart 
                size={14} 
                className={`transition-all duration-200 ${
                  isLiked 
                    ? 'fill-red-500 text-red-500' 
                    : 'text-white/60 group-hover:text-red-500'
                }`}
              />
              {currentLikeCount > 0 && (
                <span className={`text-sm transition-colors duration-200 ${
                  isLiked 
                    ? 'text-red-500' 
                    : 'text-white/60 group-hover:text-white'
                }`}>
                  {currentLikeCount}
                </span>
              )}
            </button> */}
          </div>

          {/* Reply Input */}
          {showReplyInput && (
            <div className="flex gap-1 mt-2">
              <div className="flex-1 bg-[#2a2a2a] rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Thêm câu trả lời..."
                    className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/40"
                    autoFocus
                  />
                  <button className="text-white hover:text-white/60 transition-colors cursor-pointer flex gap-2">
                    <Smile size={20} />
                  </button>

                  <button className="text-white hover:text-white/60 transition-colors cursor-pointer flex gap-2">
                    <Paperclip size={20} />
                  </button>
                </div>
              </div>
              <button
                onClick={handleSubmitReply}
                disabled={!replyText.trim()}
                className={`text-sm font-semibold px-1 py-1 rounded transition-colors flex items-center gap-2 cursor-pointer flex-shrink-0 ${
                  replyText.trim()
                    ? 'text-[#FE2C55] hover:text-[#FE2C55]/60'
                    : 'text-white/40 cursor-not-allowed'
                }`}
              >
                Post <Send size={20} />
              </button>
              <button
                onClick={handleCancelReply}
                className="text-white hover:text-white/60 transition-colors cursor-pointer flex-shrink-0"
              >
                <X size={20} />
              </button>
            </div>
          )}

          {/* View Replies Button - Chỉ hiện ở comment chính */}
          {/* {!isReply && replyCount > 0 && (
            <div className="pt-2">
              <button
                onClick={onViewReplies}
                className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors"
              >
                <div className="h-px bg-white/20 w-16"></div>
                <span className="whitespace-nowrap">
                  {showReplies ? 'Hide' : `View ${replyCount} replies`}
                </span>
                {showReplies ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default CommentCard;