import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";

interface Reply {
  id: string;
  username: string;
  comment: string;
  timestamp: string;
  avatarUrl: string;
}

interface CommentCardProps {
  username?: string;
  comment?: string;
  timestamp?: string;
  avatarUrl?: string;
  replies?: Reply[];
  replyCount?: number;
  onReply?: () => void;
}

const CommentCard: React.FC<CommentCardProps> = ({
  username,
  comment,
  timestamp,
  avatarUrl,
  replies = [],
  replyCount = 0,
  onReply,
}) => {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className="w-full">
      {/* Main Comment */}
      <div className="flex gap-3 px-4 py-3 w-full bg-[#1e1e1e]">
        {/* Avatar */}
        <div className="flex flex-col justify-start pt-1">
          <img
            src={avatarUrl}
            alt={username ? `${username} avatar` : 'avatar'}
            className="w-12 h-12 rounded-full flex-shrink-0 object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col gap-y-1">
          {/* Username and Timestamp */}
          <div className="flex items-center gap-2">
            <h4 className="text-base font-semibold text-white">{username || 'Unknown'}</h4>
          </div>    

          {/* Comment Text */}
          <p className="text-sm text-white leading-none">
            {comment || ''}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-15">
            <span className="text-sm text-white/60">{timestamp || ''}</span>

            <button 
              onClick={onReply}
              className="text-sm text-white/60 hover:text-white cursor-pointer transition-colors font-bold"
            >
              Reply
            </button>
          </div>

          {/* Nested Replies */}
        {showReplies && replies.length > 0 && (
        <div className="">
            {replies.map((reply) => (
            <div key={reply.id} className="flex gap-3 py-1 w-full bg-[#1e1e1e]">
                {/* Reply Avatar */}
                <div className="flex flex-col justify-start pt-1">
                <img
                    src={reply.avatarUrl}
                    alt={`${reply.username} avatar`}
                    className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
                />
                </div>

                {/* Reply Content */}
                <div className="flex-1 min-w-0 flex flex-col gap-y-0.5">
                    <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-white">{reply.username}</h4>
                    </div>
                    <p className="text-sm text-white/90 leading-relaxed">
                        {reply.comment}
                    </p>

                    <div className="flex items-center gap-15">
                        <span className="text-sm text-white/60">{reply.timestamp || ''}</span>

                        <button 
                            onClick={onReply}
                            className="text-sm text-white/60 hover:text-white cursor-pointer transition-colors font-bold"
                        >
                            Reply
                        </button>
                    </div>

                </div>   

            </div>
            ))}
        </div>
        )}


        {/* View Replies Button*/}
        {replyCount > 0 && (
            <div className="flex gap-15">
                <button
                onClick={() => setShowReplies(true)}
                className="text-sm text-white/60 hover:text-white/50 transition-colors flex items-center gap-1 cursor-pointer font-bold pt-2"
                >
                    {/* line */}
                    <div className="h-px bg-white/20 w-20 mr-2"></div>
                    view {replyCount} {replyCount === 1 ? 'reply' : 'replies'} 
                    <ChevronDown size={16}/>
                </button>


                {
                    showReplies && (
                        <button
                        onClick={() => setShowReplies(false)}
                        className="text-sm text-white/60 hover:text-white/50 transition-colors flex items-center gap-1 cursor-pointer font-bold pt-2"
                        >
                            Hide <ChevronUp size={16}/>
                        </button>
                    )
                }

            
            </div>
            
        )} 
        </div>
      </div>

      

      
    </div>
  );
};

export default CommentCard;