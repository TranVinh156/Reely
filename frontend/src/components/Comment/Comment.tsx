import React, {useEffect, useState } from "react";
import CommentCard from "./CommentCard";
import { X, ChevronDown, Paperclip, Smile, Send, ChevronUp } from "lucide-react";
import { formatTimestamp } from "../../utils/formatTimestamp.ts";
import axiosClient from "@/utils/axios.client.ts";
import { useAuth } from "@/hooks/auth/useAuth.ts";

interface Reply {
  id: string;
  ownerId: string;
  username: string;
  comment: string;
  timestamp: string;
  avatarUrl: string;
  usernameReplied?: string;
  rootCommentId: string;
}

interface CommentData {
  id: string;
  ownerId: string;
  username: string;
  comment: string;
  timestamp: string;
  avatarUrl: string;  
  replyCount?: number;
  rootCommentId: string;
}

const Comment: React.FC<{ videoId: number, videoOwnerId: number , onClose: () => void }> = ({ videoId, videoOwnerId, onClose }) => {
  
  const [comments, setComments] = useState<CommentData[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  const [repliesData, setRepliesData] = useState<Record<string, Reply[]>>({});
  const [showReplies, setShowReplies] = useState<Record<string, number>>({});
  const [loadingReplies, setLoadingReplies] = useState<Record<string, boolean>>({});
  const [commentText, setCommentText] = useState("");
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const [lastReplyAddedTo, setLastReplyAddedTo] = useState<string | null>(null);
  const [deleteCommentId, setDeleteCommentId] = useState<[string, string]>(["", ""]);

  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreComments, setHasMoreComments] = useState(true);

  const {user} = useAuth();
  
  useEffect(() => {
    setComments([]);
    fetchComments(0);
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

  useEffect(() => {
    if (deleteCommentId[1]) {
      // Xóa reply khỏi repliesData
      setRepliesData(prev => ({
        ...prev,
        [deleteCommentId[1]]: prev[deleteCommentId[1]]?.filter(r => r.id !== deleteCommentId[0]) || []
      }));

      setComments(prev => 
        prev.map(c => 
          c.id === deleteCommentId[1] 
            ? { ...c, replyCount: Math.max(0, (c.replyCount || 0) - 1) }
            : c
        )
      );

      // Cập nhật showReplies
      setShowReplies(prev => ({
        ...prev,
        [deleteCommentId[1]]: Math.max(0, (prev[deleteCommentId[1]] || 0) - 1)
      }));

  } else {
      // Xoá comment khỏi danh sách
      setComments(prev => prev.filter(c => c.id !== deleteCommentId[0]));

      // Xóa replies data của comment đó (nếu có)
      setRepliesData(prev => {
        const newData = { ...prev };
        delete newData[deleteCommentId[0]];
        return newData;
      });
    
      // Xóa showReplies của comment đó
      setShowReplies(prev => {
        const newState = { ...prev };
        delete newState[deleteCommentId[0]];
        return newState;
      });
      
    }
  }, [deleteCommentId]);



  const fetchComments = async (page: number) => {
    setIsLoadingComments(true);
    try {
      const response = await axiosClient.get(`/comments/video?videoId=${videoId}&page=${page}&size=30`);
      const existingIds = new Set(comments.map(n => n.id));
      const uniqueNew = response.data.data.filter(
        (n: CommentData) => {
          return !existingIds.has(n.id)
        }
      );
      setComments(prev => [...prev, ...uniqueNew])

      setHasMoreComments(response.data.pageNumber < response.data.totalPages - 1);
      setCurrentPage(page);
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
      const response = await axiosClient.get(`/comments/replies?rootCommentId=${commentId}`);
      let replies: Reply[] = response.data.data;
      
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

  const handleDeleteComment = (commentId: string, rootCommentId: string) => {
    setDeleteCommentId([commentId, rootCommentId]);
  };

  const closeMenu = () => setActiveMenuId(null);

  const handleSubmitComment = async() => {
    if (commentText.trim()) {
      try {
        const response = await axiosClient.post('/comments', {
          videoId,
          userId: user?.id,
          text: commentText.trim()
        });
        console.log('Comment submitted:', response.data.data);
        setComments(prev => [response.data, ...prev]);
        setCommentText("");
      } catch (error) {
        console.error('Error submitting comment:', error);
      }   
    }
    closeMenu();
  };

  // ✅ Function: Fetch replies từ API
  const fetchReplies = async (commentId: string) => {
    // Nếu đã fetch rồi thì không fetch lại
    if (repliesData[commentId]) {
      return;
    }
    setLoadingReplies(prev => ({ ...prev, [commentId]: true }));

    try {
      const response = await axiosClient.get(`/comments/replies?rootCommentId=${commentId}`);
      
      let replies: Reply[] = response.data.data;
      
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
    closeMenu();
  };


  // ✅ Handle click "View replies" button
  const handleViewReplies = async (commentId: string) => {
    closeMenu();
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
    closeMenu();
  };


  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      if (hasMoreComments && !isLoadingComments) {
        fetchComments(currentPage + 1);
    }
  }};

  return (
    <div className="w-full h-full bg-[#1e1e1e] text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <h2 className="text-lg font-semibold">Comment</h2>
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      {/* Comment List */}
      <div 
        className="flex-1 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-white/30"
        onScroll={handleScroll}
      >
        
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
              videoOwnerId={videoOwnerId}
              ownerId={comment.ownerId}
              username={comment.username}
              comment={comment.comment}
              timestamp={formatTimestamp(comment.timestamp)}
              avatarUrl={comment.avatarUrl}
              showReplyInput={activeReplyId === comment.id}
              onReplyClick={() => setActiveReplyId(comment.id)}
              onReplyClose={() => setActiveReplyId(null)}
              showMenu={activeMenuId === comment.id}
              onMenuClick={() => setActiveMenuId(comment.id)}
              onMenuClose={() => setActiveMenuId(null)}
              videoId={videoId}
              commentId={comment.id}
              rootCommentId={comment.rootCommentId}
              onReplyAdded={handleReplyAdded}
              onDelete={handleDeleteComment}
            />
            
            {/* Nested Replies */}
            {showCount > 0 && replies.length > 0 && (
              <div className="ml-10">
                {replies.slice(0, showCount).map((reply) => (
                  <CommentCard
                    videoOwnerId={videoOwnerId}
                    key={reply.id}
                    ownerId={reply.ownerId}
                    username={reply.username}
                    comment={reply.comment}
                    timestamp={formatTimestamp(reply.timestamp)}
                    avatarUrl={reply.avatarUrl}
                    isReply={true}
                    usernameReplied={reply.usernameReplied}
                    showReplyInput={activeReplyId === reply.id}
                    onReplyClick={() => handleReplyClick(reply.id)}
                    onReplyClose={() => setActiveReplyId(null)}
                    showMenu={activeMenuId === reply.id}
                    onMenuClick={() => setActiveMenuId(reply.id)}
                    onMenuClose={closeMenu}
                    videoId={videoId}
                    commentId={reply.id}
                    rootCommentId={reply.rootCommentId}
                    onReplyAdded={handleReplyAdded}
                    onDelete={handleDeleteComment}
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
              onFocus={closeMenu}
              placeholder="Thêm bình luận..."
              className="flex flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/40"
            />
            <button className="text-white hover:text-white/60 transition-colors cursor-pointer" onClick={closeMenu}>
              <Smile size={20} />
            </button>

            <button className="text-white hover:text-white/60 transition-colors cursor-pointer flex gap-2" onClick={closeMenu}>
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