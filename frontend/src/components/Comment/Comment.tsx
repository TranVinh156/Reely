import React, { useState } from "react";
import CommentCard from "./CommentCard";
import { X, ChevronDown, Paperclip, Smile, Send, ChevronUp } from "lucide-react";

interface Reply {
  id: string;
  username: string;
  comment: string;
  timestamp: string;
  avatarUrl: string;
}

interface CommentData {
  id: string;
  username: string;
  comment: string;
  timestamp: string;
  avatarUrl: string;
  // replies?: Reply[];
  replyCount?: number;
}

const Comment: React.FC = () => {
  const [comments] = useState<CommentData[]>([
    {
      id: '1',
      username: 'Nhỏ Uyenn 💙 🦀',
      comment: '"Anh hát chơi chơi hơn 1 kiếp của nó đi làm" =))))',
      timestamp: '23 giờ trước',
      avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s',
      replyCount: 0,
    },
    {
      id: '2',
      username: 'như quỳnh 😺 😺',
      comment: '😂 😂 nghe nói a tui hát 1bài 1, 2 tỷ đó hát chơi chơi hơn anti lm 1kiep là có thật',
      timestamp: '23 giờ trước',
      avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s',
      replyCount: 0,
    },
    {
      id: '3',
      username: 'MONO TEAM FC vn',
      comment: 'JACK5TR CA SĨ SỐ 1 CAMPUCHIA NHÉ 😂 😴 😂 😂 😂 😂 😂 😂 😂 🤑 🤑 🤑 🤑',
      timestamp: '17 giờ trước',
      avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s',
      replyCount: 0,
    },
    {
      id: '4',
      username: 'Thành Đạt',
      comment: 'Ổ 😂 😂',
      timestamp: '17 giờ trước',
      avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s',
      replyCount: 3,
      
    },
    {
      id: '5',
      username: 'Phạm Anh Minh',
      comment: 'Báo đạo nhạc là đời à 🤣',
      timestamp: '21 giờ trước',
      avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s',
      replyCount: 42,
      
    },
    {
      id: '6',
      username: 'Tiêu Đằng',
      comment: 'Giai điệu y chang cái gì 100% ngay trc hay trong đám cưới vậy',
      timestamp: '23 giờ trước',
      avatarUrl: 'https://example.com/avatar6.jpg',
      replyCount: 8,
      
    },
    {
      id: '7',
      username: 'haan.',
      comment: 'hay quá tui sốc luôn mà=))',
      timestamp: '1 ngày trước',
      avatarUrl: 'https://example.com/avatar7.jpg',
      replyCount: 0,
    },
  ]);

  const [repliesData, setRepliesData] = useState<Record<string, Reply[]>>({});
  const [showReplies, setShowReplies] = useState<Record<string, number>>({});
  const [loadingReplies, setLoadingReplies] = useState<Record<string, boolean>>({});
  const [commentText, setCommentText] = useState("");

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      console.log("Comment:", commentText);
      setCommentText("");
    }
  };

  // ✅ Function: Fetch replies từ API
  const fetchReplies = async (commentId: string) => {
    // Nếu đã fetch rồi thì không fetch lại
    if (repliesData[commentId]) {
      return;
    }

    setLoadingReplies(prev => ({ ...prev, [commentId]: true }));

    try {
      // TODO: Thay bằng API call thật
      // const response = await fetch(`/api/comments/${commentId}/replies`);
      // const data = await response.json();
      
      // Mock data (giả lập API call)
      await new Promise(resolve => setTimeout(resolve, 500)); // Giả lập delay
      
      const mockReplies: Reply[] = Array.from({ length: 12 }, (_, i) => ({
        id: `${commentId}-${i + 1}`,
        username: `User ${String.fromCharCode(65 + (i % 3))}`,
        comment: `Phản hồi ${i + 1}`,
        timestamp: `${16 - i} giờ trước`,
        avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s',
      }));

      // Lưu replies vào state
      setRepliesData(prev => ({
        ...prev,
        [commentId]: mockReplies,
      }));

      // Hiển thị 5 replies đầu tiên
      setShowReplies(prev => ({
        ...prev,
        [commentId]: Math.min(5, mockReplies.length),
      }));

    } catch (error) {
      console.error('Error fetching replies:', error);
    } finally {
      setLoadingReplies(prev => ({ ...prev, [commentId]: false }));
    }
  };

  const toggleShowMoreReplies = (commentId: string) => {
    const currentCount = showReplies[commentId] || 0;
    const totalReplies = repliesData[commentId]?.length || 0;
    
    
    setShowReplies(prev => ({
      ...prev,
      [commentId]: Math.min(currentCount + 5, totalReplies),
    }));
  };

  const hideReplies = (id: string) => {
    setShowReplies(prev => ({ ...prev, [id]: 0 }));
  };


  // ✅ Handle click "View replies" button
  const handleViewReplies = async (commentId: string) => {
    // Nếu chưa fetch thì fetch
    if (!repliesData[commentId]) {
      await fetchReplies(commentId);
    } else {
      // Nếu đã fetch rồi thì chỉ cần show thêm
      toggleShowMoreReplies(commentId);
    }
  };

  return (
    <div className="w-[450px] h-screen bg-[#1e1e1e] text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <h2 className="text-lg font-semibold">Comment</h2>
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Comment List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-white/30">
        {comments.map((comment) => {
          const replies = repliesData[comment.id] || [];
          const showCount = showReplies[comment.id] || 0;
          const isLoading = loadingReplies[comment.id] || false;

          return (
          <div key={comment.id}>
            {/* Main Comment */}
            <CommentCard
              username={comment.username}
              comment={comment.comment}
              timestamp={comment.timestamp}
              avatarUrl={comment.avatarUrl}
              replyCount={comment.replyCount}
              showReplies={0}
            />

            {/* Nested Replies */}
            {showCount > 0 && replies.length > 0 && (
              <div className="ml-10">
                {replies.slice(0, showCount).map((reply) => (
                  <CommentCard
                    key={reply.id}
                    username={reply.username}
                    comment={reply.comment}
                    timestamp={reply.timestamp}
                    avatarUrl={reply.avatarUrl}
                    isReply={true}
                  />
                ))}
              </div>
            )}

            {/* View Replies Button */}
            {comment.replyCount !== undefined && comment.replyCount > 0 && (
            <div className="pt-1 ml-20 flex gap-15">

              {/* Loading spinner */}
              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <div className="animate-spin rounded-full h-3 w-3 border-b border-white/60"></div>
                  <span>Loading replies...</span>
                </div>
              )}

              {/* View More button */}
              {!isLoading && showCount < (repliesData[comment.id]?.length || comment.replyCount) && (
                <button
                  onClick={() => handleViewReplies(comment.id)}
                  className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors"
                >
                  <div className="h-px bg-white/20 w-10"></div>
                  <span className="whitespace-nowrap">
                    {showCount === 0 
                      ? `View ${comment.replyCount} replies`
                      : `View ${comment.replyCount - showCount} more replies`
                    }
                  </span>
                  <ChevronDown size={14} />
                </button>
              )}
              

              {/* Hide button */}
              {!isLoading &&showCount > 0 && (
                <button
                  onClick={() => hideReplies(comment.id)}
                  className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors"
                >
                  <span className="whitespace-nowrap">Hide</span>
                  <ChevronUp size={14} />
                </button>
              )}
            </div>
            
            )}
          </div>
        )
        }
        )}
      </div>

      {/* Comment Input */}
      <div className="flex p-4 border-t border-white/10 gap-2">
        <div className="flex-1 bg-[#2a2a2a] rounded-lg p-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Thêm bình luận..."
              className="flex flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/40"
            />
            <button className="text-white hover:text-white/60 transition-colors cursor-pointer">
              <Smile size={20} />
            </button>

            <button className="text-white hover:text-white/60 transition-colors cursor-pointer flex gap-2">
                                <Paperclip size={20} />
            </button>
          </div>
        </div>
        <button
          onClick={handleSubmitComment}
          disabled={!commentText.trim()}
          className={`text-sm font-semibold px-4 py-1 rounded transition-colors flex items-center gap-2 cursor-pointer flex-shrink-0 ${
            commentText.trim()
              ? 'text-[#FE2C55] hover:text-[#FE2C55]/60'
              : 'text-white/40 cursor-not-allowed'
          }`}
        >
          Post <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default Comment;