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
  replies?: Reply[];
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
      replies: [],
    },
    {
      id: '2',
      username: 'như quỳnh 😺 😺',
      comment: '😂 😂 nghe nói a tui hát 1bài 1, 2 tỷ đó hát chơi chơi hơn anti lm 1kiep là có thật',
      timestamp: '23 giờ trước',
      avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s',
      replyCount: 0,
      replies: [],
    },
    {
      id: '3',
      username: 'MONO TEAM FC vn',
      comment: 'JACK5TR CA SĨ SỐ 1 CAMPUCHIA NHÉ 😂 😴 😂 😂 😂 😂 😂 😂 😂 🤑 🤑 🤑 🤑',
      timestamp: '17 giờ trước',
      avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s',
      replyCount: 0,
      replies: [],
    },
    {
      id: '4',
      username: 'Thành Đạt',
      comment: 'Ổ 😂 😂',
      timestamp: '17 giờ trước',
      avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s',
      replyCount: 3,
      replies: [
        {
          id: '4-1',
          username: 'User A',
          comment: 'Phản hồi 1',
          timestamp: '16 giờ trước',
          avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s'         
        },
        {
          id: '4-2',
          username: 'User B',
          comment: 'Phản hồi 2',
          timestamp: '15 giờ trước',
          avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s',
        },
        {
          id: '4-3',
          username: 'User C',
          comment: 'Phản hồi 3',
          timestamp: '14 giờ trước',
          avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s',
        },
        {
          id: '4-4',
          username: 'User A',
          comment: 'Phản hồi 1',
          timestamp: '16 giờ trước',
          avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s'         
        },
        {
          id: '4-5',
          username: 'User B',
          comment: 'Phản hồi 2',
          timestamp: '15 giờ trước',
          avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s',
        },
        {
          id: '4-6',
          username: 'User C',
          comment: 'Phản hồi 3',
          timestamp: '14 giờ trước',
          avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s',
        },
        {
          id: '4-7',
          username: 'User A',
          comment: 'Phản hồi 1',
          timestamp: '16 giờ trước',
          avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s'         
        },
        {
          id: '4-8',
          username: 'User B',
          comment: 'Phản hồi 2',
          timestamp: '15 giờ trước',
          avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s',
        },
        {
          id: '4-9',
          username: 'User C',
          comment: 'Phản hồi 3',
          timestamp: '14 giờ trước',
          avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s',
        },
        {
          id: '4-10',
          username: 'User A',
          comment: 'Phản hồi 1',
          timestamp: '16 giờ trước',
          avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s'         
        },
        {
          id: '4-11',
          username: 'User B',
          comment: 'Phản hồi 2',
          timestamp: '15 giờ trước',
          avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s',
        },
        {
          id: '4-12',
          username: 'User C',
          comment: 'Phản hồi 3',
          timestamp: '14 giờ trước',
          avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s',
        },
      ],
    },
    {
      id: '5',
      username: 'Phạm Anh Minh',
      comment: 'Báo đạo nhạc là đời à 🤣',
      timestamp: '21 giờ trước',
      avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s',
      replyCount: 42,
      replies: [
        {
          id: '5-1',
          username: 'Reply User 1',
          comment: 'Đồng ý với bạn',
          timestamp: '20 giờ trước',
          avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s',
        },
        {
          id: '5-2',
          username: 'Reply User 2',
          comment: 'Haha đúng rồi',
          timestamp: '19 giờ trước',
          avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s',
        },
      ],
    },
    {
      id: '6',
      username: 'Tiêu Đằng',
      comment: 'Giai điệu y chang cái gì 100% ngay trc hay trong đám cưới vậy',
      timestamp: '23 giờ trước',
      avatarUrl: 'https://example.com/avatar6.jpg',
      replyCount: 8,
      replies: [
        {
          id: '6-1',
          username: 'Reply User',
          comment: 'Tôi cũng nghĩ vậy',
          timestamp: '22 giờ trước',
          avatarUrl: 'https://example.com/avatar6.jpg',
        },
      ],
    },
    {
      id: '7',
      username: 'haan.',
      comment: 'hay quá tui sốc luôn mà=))',
      timestamp: '1 ngày trước',
      avatarUrl: 'https://example.com/avatar7.jpg',
      replyCount: 0,
      replies: [],
    },
  ]);

  const [showReplies, setShowReplies] = useState<Record<string, number>>({});
  const [commentText, setCommentText] = useState("");

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      console.log("Comment:", commentText);
      setCommentText("");
    }
  };

  const toggleShowReplies = (id: string) => {
    setShowReplies(prev => ({ ...prev, [id]: Math.min((prev[id] || 0) + 5, comments.find(c => c.id === id)?.replyCount || 0) }));
  };

  const hideReplies = (id: string) => {
    setShowReplies(prev => ({ ...prev, [id]: 0 }));
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
        {comments.map((comment) => (
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
            {showReplies[comment.id] > 0 && comment.replies && comment.replies.length > 0 && (
              <div className="ml-10">
                {comment.replies.slice(0, showReplies[comment.id]).map((reply) => (
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

              {comment.replyCount - (showReplies[comment.id] || 0) > 0 && (
                <button
                onClick={() => toggleShowReplies(comment.id)}
                className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors"
              >
                <div className="h-px bg-white/20 w-10"></div>
                <span className="whitespace-nowrap">
                  View {comment.replyCount - (showReplies[comment.id] || 0)} replies
                </span>
                <ChevronDown size={14} />
              </button>
              )}
              

              {showReplies[comment.id] > 0 && (
              <button
                onClick={() => hideReplies(comment.id)}
                className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors"
              >
                <span className="whitespace-nowrap">
                  Hide
                </span>
                <ChevronUp size={14} /> 
              </button>
              )}
            </div>
            
            )}
          </div>
        ))}
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