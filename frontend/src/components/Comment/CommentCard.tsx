import { Paperclip, Send, Smile, X, Ellipsis, Flag, ChevronRight, UserIcon } from "lucide-react";
import React, { useState } from "react";
import Report from "./Report";
import Delete from "./Delete";
import axiosClient from "@/utils/axios.client";
import { useAuth } from "@/hooks/auth/useAuth";
import { h4 } from "motion/react-client";
import { NavLink, useNavigate } from "react-router-dom";
import { useFeedStore } from "@/store/feedStore";
import UserAvatar from "../Profile/UserAvatar";
import { STORAGE_URL } from "@/utils/constant";


interface CommentCardProps {
  videoOwnerId?: number;
  ownerId?: string;
  username?: string;
  comment?: string;
  timestamp?: string;
  avatarUrl?: string;
  isReply?: boolean;
  usernameReplied?: string;
  showReplyInput?: boolean;
  onReplyClick?: () => void;
  onReplyClose?: () => void;
  showMenu?: boolean;
  onMenuClick?: () => void;
  onMenuClose?: () => void;
  videoId: number;
  commentId: string;
  rootCommentId: string;
  onReplyAdded?: (rootCommentId: string) => void;
  onDelete?: (CommentId: string, rootCommentId: string) => void;
  onNavigate?: () => void;
}

const CommentCard: React.FC<CommentCardProps> = ({
  videoOwnerId,
  ownerId,
  username,
  comment,
  timestamp,
  avatarUrl,
  isReply = false,
  showReplyInput = false,
  usernameReplied,
  onReplyClick,
  onReplyClose,
  showMenu = false,
  onMenuClick,
  onMenuClose,
  videoId,
  commentId,
  rootCommentId,
  onReplyAdded,
  onDelete,
  onNavigate
}) => {
  const [replyText, setReplyText] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const incrementCommentCount = useFeedStore((s) => s.incrementCommentCount);
  const navigate = useNavigate()

  const handleSubmitReply = async () => {
    if (!isAuthenticated) {
      onNavigate?.()
      navigate('/login')
      return;
    }
    if (replyText.trim()) {
      try {
        const response = await axiosClient.post('/comments', {
          videoId,
          userId: user?.id,
          text: replyText.trim(),
          rootCommentId: rootCommentId === null ? parseInt(commentId) : parseInt(rootCommentId),
          replyToCommentId: rootCommentId === null ? null : parseInt(commentId)
        });
        const targetRootId = rootCommentId === null ? commentId : rootCommentId;
        onReplyAdded?.(targetRootId);
        setReplyText("");
        if (onReplyClose) onReplyClose();
        incrementCommentCount(videoId.toString());
      } catch (error) {
        console.error("Error submitting reply:", error);
      }

    }
  };

  const handleViewMenu = () => {
    if (showMenu) {
      onMenuClose?.();
    } else {
      onMenuClick?.();
    }
  };

  const handleReportClick = () => {
    setShowReportModal(true);
    onMenuClose?.(); // Đóng menu report
  };

  const handleReportClose = () => {
    setShowReportModal(false);
  };

  const handleReportSubmit = (reason: string) => {
    console.log("Report submitted with reason:", reason);
    // TODO: Gọi API để gửi report lên server
    setShowReportModal(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    onMenuClose?.(); // Đóng menu delete
  };

  const handleDeleteConfirm = async () => {
    try {
      await axiosClient.delete(`/comments/${commentId}`);
      onDelete?.(commentId, rootCommentId);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const avatarSize = isReply ? "w-8 h-8" : "w-12 h-12";

  return (
    <div className="w-full mt-2 group">
      {/* Main Comment */}
      <div className="flex gap-3 px-4 py-2 w-full bg-[#1e1e1e]">
        {/* Avatar */}
        <NavLink to={`/users/${username}`} onClick={onNavigate} className="flex flex-col justify-start pt-1">
          <UserAvatar size={40} avatarUrl={avatarUrl} />
        </NavLink>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col gap-y-1">
          {/* Username */}
          <div className="flex items-center gap-3">
            <NavLink to={`/users/${username}`} onClick={onNavigate}
              className={`${isReply ? 'text-sm' : 'text-base'} font-semibold text-white cursor-pointer hover:underline`}>
              {username || 'Unknown'}
            </NavLink>

            {Number(ownerId) === videoOwnerId && (
              <h4 className={`${isReply ? 'text-sm' : 'text-sm'} font-semibold text-[#FE2C55]/95`}>
                Tác giả
              </h4>
            )}

            {usernameReplied && (
              <div className="flex items-center gap-1">
                <ChevronRight size={15} className="text-white/60" />
                <h4 className={`${isReply ? 'text-sm' : 'text-base'} font-semibold text-white`}>
                  {usernameReplied || 'Unknown'}
                </h4>
              </div>
            )}
          </div>

          {/* Comment Text */}
          <p className="text-sm text-white/95 leading-tight break-words whitespace-pre-wrap">
            {comment || ''}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-10">
            <span className="text-sm text-white/60">{timestamp || ''}</span>
            <button
              onClick={onReplyClick}
              className="text-sm text-white/60 hover:text-white cursor-pointer transition-colors"
            >
              Reply
            </button>
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
                  // autoFocus
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
                className={`text-sm font-semibold px-1 py-1 rounded transition-colors flex items-center gap-2 cursor-pointer flex-shrink-0 ${replyText.trim()
                  ? 'text-[#FE2C55] hover:text-[#FE2C55]/60'
                  : 'text-white/40 cursor-not-allowed'
                  }`}
              >
                Post <Send size={20} />
              </button>
              <button
                onClick={() => {
                  setReplyText("");
                  onReplyClose?.();
                }}
                className="text-white hover:text-white/60 transition-colors cursor-pointer flex-shrink-0"
              >
                <X size={20} />
              </button>
            </div>
          )}
        </div>

        <div className="h-20 relative">
          <button
            onClick={handleViewMenu}
            className={`flex justify-start cursor-pointer text-white/60 hover:text-white ${showMenu ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            <Ellipsis className="mt-0.5" />
          </button>
          {showMenu && `${user?.id}` !== ownerId && (
            <div
              onClick={handleReportClick}
              className="flex absolute right-0 w-25 bg-[#2a2a2a] rounded-lg shadow-lg p-2 border border-white/10 hover:text-[#FE2C55] gap-1 justify-center">
              <Flag className="" size={20} />
              <button className="flex justify-start text-center text-sm font-semibold">
                Report
              </button>
            </div>
          )}

          {showMenu && `${user?.id}` === ownerId && (
            <div
              onClick={handleDeleteClick}
              className="flex absolute right-0 w-25 bg-[#2a2a2a] rounded-lg shadow-lg p-2 border border-white/10 hover:text-[#FE2C55] gap-1 justify-center">
              <button className="flex justify-start text-center text-sm font-semibold">
                Delete
              </button>
            </div>
          )}
        </div>

      </div>
      {showDeleteModal && (
        <Delete
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {/* Report Modal */}
      {showReportModal && (
        <Report
          onClose={handleReportClose}
          onSubmit={handleReportSubmit}
        />
      )}
    </div>
  );
};

export default CommentCard;