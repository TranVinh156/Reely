import React, { useEffect, useState } from "react";
import CommentCard from "./CommentCard";
import { X, ChevronDown, Paperclip, Smile, Send, ChevronUp } from "lucide-react";
import axios from "axios";
import { formatTimestamp } from "../../utils/formatTimestamp.ts";

interface Reply {
  id: string;
  username: string;
  comment: string;
  timestamp: string;
  avatarUrl: string;
  usernameReplied?: string;
  rootCommentId: string;
}

interface CommentData {
  id: string;
  username: string;
  comment: string;
  timestamp: string;
  avatarUrl: string;  
  replyCount?: number;
  rootCommentId: string;
}

const Comment: React.FC<{ videoId: number, userId: number }> = ({ videoId, userId}) => {
  // const [comments] = useState<CommentData[]>([
  //   {
  //     id: '1',
  //     username: 'Nhỏ Uyenn 💙 🦀',
  //     comment: '"Anh hát chơi chơi hơn 1 kiếp của nó đi làm" =))))',
  //     timestamp: '23 giờ trước',
  //     avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s',
  //     replyCount: 0,
  //   },
  //   {
  //     id: '2',
  //     username: 'như quỳnh 😺 😺',
  //     comment: '😂 😂 nghe nói a tui hát 1bài 1, 2 tỷ đó hát chơi chơi hơn anti lm 1kiep là có thật',
  //     timestamp: '23 giờ trước',
  //     avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s',
  //     replyCount: 0,
  //   },
  //   {
  //     id: '3',
  //     username: 'MONO TEAM FC vn',
  //     comment: 'JACK5TR CA SĨ SỐ 1 CAMPUCHIA NHÉ 😂 😴 😂 😂 😂 😂 😂 😂 😂 🤑 🤑 🤑 🤑',
  //     timestamp: '17 giờ trước',
  //     avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s',
  //     replyCount: 0,
  //   },
  //   {
  //     id: '4',
  //     username: 'Thành Đạt',
  //     comment: 'Ổ 😂 😂',
  //     timestamp: '17 giờ trước',
  //     avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s',
  //     replyCount: 3,
      
  //   },
  //   {
  //     id: '5',
  //     username: 'Phạm Anh Minh',
  //     comment: 'Báo đạo nhạc là đời à 🤣',
  //     timestamp: '21 giờ trước',
  //     avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s',
  //     replyCount: 42,
      
  //   },
  //   {
  //     id: '6',
  //     username: 'Tiêu Đằng',
  //     comment: 'Giai điệu y chang cái gì 100% ngay trc hay trong đám cưới vậy',
  //     timestamp: '23 giờ trước',
  //     avatarUrl: 'https://example.com/avatar6.jpg',
  //     replyCount: 8,
      
  //   },
  //   {
  //     id: '7',
  //     username: 'haan.',
  //     comment: 'hay quá tui sốc luôn mà=))',
  //     timestamp: '1 ngày trước',
  //     avatarUrl: 'https://example.com/avatar7.jpg',
  //     replyCount: 0,
  //   },
  // ]);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  const [repliesData, setRepliesData] = useState<Record<string, Reply[]>>({});
  const [showReplies, setShowReplies] = useState<Record<string, number>>({});
  const [loadingReplies, setLoadingReplies] = useState<Record<string, boolean>>({});
  const [commentText, setCommentText] = useState("");
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [activeReportId, setActiveReportId] = useState<string | null>(null);

  const [lastReplyAddedTo, setLastReplyAddedTo] = useState<string | null>(null);
  useEffect( () => {
    fetchComments();
  }, [videoId]
  )

   useEffect(() => {
    if (lastReplyAddedTo) {
      // Re-fetch replies của comment đó
      refetchReplies(lastReplyAddedTo);
      // Reset flag
      setLastReplyAddedTo(null);
    }
  }, [lastReplyAddedTo]);

  const fetchComments = async () => {
    setIsLoadingComments(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/comments/video?videoId=${videoId}`)
      setComments(response.data.data)
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  // ✅ Function mới: Re-fetch replies
  const refetchReplies = async (commentId: string) => {
    setLoadingReplies(prev => ({ ...prev, [commentId]: true }));

    try {
      const response = await axios.get(`http://localhost:8080/api/v1/comments/replies?rootCommentId=${commentId}`);
      const replies: Reply[] = response.data.data;
      
      // Update repliesData
      setRepliesData(prev => ({
        ...prev,
        [commentId]: replies,
      }));

      // Update showReplies để hiện reply mới
      setShowReplies(prev => ({
        ...prev,
        [commentId]: replies.length,
      }));

      // Update replyCount của root comment
      setComments(prev => 
        prev.map(c => 
          c.id === commentId 
            ? { ...c, replyCount: replies.length }
            : c
        )
      );

    } catch (error) {
      console.error('Error refetching replies:', error);
    } finally {
      setLoadingReplies(prev => ({ ...prev, [commentId]: false }));
    }
  };

  const handleReplyAdded = (rootCommentId: string) => {
    setLastReplyAddedTo(rootCommentId);
  };



  const closeReportMenu = () => setActiveReportId(null);

  const handleSubmitComment = async() => {
    if (commentText.trim()) {
      try {
        const response = await axios.post('http://localhost:8080/api/v1/comments', {
          videoId,
          userId: userId,
          text: commentText.trim()
        });
        console.log('Comment submitted:', response.data.data);
        setComments(prev => [response.data, ...prev]);
        setCommentText("");
      } catch (error) {
        console.error('Error submitting comment:', error);
      }   
    }
    closeReportMenu();
  };

  // ✅ Function: Fetch replies từ API
  const fetchReplies = async (commentId: string) => {
    // Nếu đã fetch rồi thì không fetch lại
    if (repliesData[commentId]) {
      return;
    }

    setLoadingReplies(prev => ({ ...prev, [commentId]: true }));

    try {
      const response = await axios.get(`http://localhost:8080/api/v1/comments/replies?rootCommentId=${commentId}`);
      
      const replies: Reply[] = response.data.data;
      
      // Lưu replies vào state
      setRepliesData(prev => ({
        ...prev,
        [commentId]: replies,
      }));

      // Hiển thị 5 replies đầu tiên
      setShowReplies(prev => ({
        ...prev,
        [commentId]: Math.min(5, replies.length),
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
    closeReportMenu();
  };


  // ✅ Handle click "View replies" button
  const handleViewReplies = async (commentId: string) => {
    closeReportMenu();
    // Nếu chưa fetch thì fetch
    if (!repliesData[commentId]) {
      await fetchReplies(commentId);
    } else {
      // Nếu đã fetch rồi thì chỉ cần show thêm
      toggleShowMoreReplies(commentId);
    }
  };

  const handleReplyClick = (commentId: string) => {
    setActiveReplyId(commentId);
    closeReportMenu();
  };

  return (
    <div className="w-[450px] h-screen bg-[#1e1e1e] text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <h2 className="text-lg font-semibold">Comment</h2>
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors" onClick={closeReportMenu}>
          <X size={20} />
        </button>
      </div>

      {/* Comment List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-white/30">
        
        {/* ✅ Loading State */}
        {isLoadingComments && (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}

        {!isLoadingComments && comments.length === 0 && (
          <div className="px-4 py-8 text-center text-white/40">
            Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
          </div>
        )}


        {!isLoadingComments && comments.map((comment) => {
          const replies = repliesData[comment.id] || [];
          const showCount = showReplies[comment.id] || 0;
          const isLoading = loadingReplies[comment.id] || false;

          
          return (
          <div key={comment.id}>
            {/* Main Comment */}
            <CommentCard
              username={comment.username}
              comment={comment.comment}
              timestamp={formatTimestamp(comment.timestamp)}
              avatarUrl={comment.avatarUrl}
              showReplyInput={activeReplyId === comment.id}
              onReplyClick={() => setActiveReplyId(comment.id)}
              onReplyClose={() => setActiveReplyId(null)}
              showReportMenu={activeReportId === comment.id}
              onReportClick={() => setActiveReportId(comment.id)}
              onReportClose={() => setActiveReportId(null)}
              videoId={videoId}
              userId={userId}
              commentId={comment.id}
              rootCommentId={comment.rootCommentId}
              onReplyAdded={handleReplyAdded}
            />
            
            {/* Nested Replies */}
            {showCount > 0 && replies.length > 0 && (
              <div className="ml-10">
                {replies.slice(0, showCount).map((reply) => (
                  <CommentCard
                    key={reply.id}
                    username={reply.username}
                    comment={reply.comment}
                    timestamp={formatTimestamp(reply.timestamp)}
                    avatarUrl={reply.avatarUrl}
                    isReply={true}
                    usernameReplied={reply.usernameReplied}
                    showReplyInput={activeReplyId === reply.id}
                    onReplyClick={() => handleReplyClick(reply.id)}
                    onReplyClose={() => setActiveReplyId(null)}
                    showReportMenu={activeReportId === reply.id}
                    onReportClick={() => setActiveReportId(reply.id)}
                    onReportClose={closeReportMenu}
                    videoId={videoId}
                    userId={userId}
                    commentId={reply.id}
                    rootCommentId={reply.rootCommentId}
                    onReplyAdded={handleReplyAdded}
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
              {!isLoading && showCount > 0 && (
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
              onFocus={closeReportMenu} 
              placeholder="Thêm bình luận..."
              className="flex flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/40"
            />
            <button className="text-white hover:text-white/60 transition-colors cursor-pointer" onClick={closeReportMenu}>
              <Smile size={20} />
            </button>

            <button className="text-white hover:text-white/60 transition-colors cursor-pointer flex gap-2" onClick={closeReportMenu}>
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